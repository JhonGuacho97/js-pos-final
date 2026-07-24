<?php

namespace App\Services;

use RobRichards\XMLSecLibs\XMLSecurityDSig;
use RobRichards\XMLSecLibs\XMLSecurityKey;


class SriFirmaService
{
    private string $certificadoPath;
    private string $certificadoClave;

    public function __construct()
    {
        $config = SriConfigService::get();
        // El certificado se guarda vía Storage::disk('local') en
        // SriConfigController (storage/app/certificados/...), así que aquí
        // debemos resolver la misma ruta en vez de public_path('uploads/...'),
        // que apuntaba a un lugar donde el archivo nunca existe.
        $this->certificadoPath = \Illuminate\Support\Facades\Storage::disk('local')->path($config['certificado_path']);
        $this->certificadoClave = $config['certificado_clave'];
    }

    // ───────────────────────────────────────────── 
    // MÉTODO PRINCIPAL — firma el XML con XAdES-BES
    // ─────────────────────────────────────────────

    public function firmar(string $xmlString): string
    {
        if (!file_exists($this->certificadoPath)) {
            throw new \RuntimeException(
                "Certificado no encontrado en: {$this->certificadoPath}"
            );
        }

        $certData = file_get_contents($this->certificadoPath);
        $certs = [];

        if (!openssl_pkcs12_read($certData, $certs, $this->certificadoClave)) {
            throw new \RuntimeException(
                'No se pudo leer el certificado .p12. Verifica la clave.'
            );
        }

        $privateKey = $certs['pkey'];
        $publicCert = $certs['cert'];
        $certEncoded = $this->extraerCertBase64($publicCert);
        $certDigest = base64_encode(sha1(base64_decode($certEncoded), true));

        $dom = new \DOMDocument('1.0', 'UTF-8');
        $dom->loadXML($xmlString);
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = false;

        $dom->documentElement->setIdAttribute('id', true);

        $dsig = new XMLSecurityDSig();
        $dsig->setCanonicalMethod(XMLSecurityDSig::EXC_C14N);

        // Referencia 1: el comprobante completo.
        $dsig->addReference(
            $dom,
            XMLSecurityDSig::SHA1,
            ['http://www.w3.org/2000/09/xmldsig#enveloped-signature']
        );

        // Forzar el URI del Reference ANTES de firmar
        $refNode = $dsig->sigNode->getElementsByTagNameNS(
            'http://www.w3.org/2000/09/xmldsig#',
            'Reference'
        )->item(0);

        if ($refNode) {
            $refNode->setAttribute('URI', '#comprobante');
        }

        // ── XAdES-BES: las SignedProperties se arman y se agregan como
        // una SEGUNDA referencia ANTES de firmar (no después) -- así la
        // firma sí cubre criptográficamente el bloque con los datos del
        // certificado, que es justo lo que el SRI valida. Antes esto se
        // agregaba después de firmar, sin ninguna referencia que lo
        // cubriera: por eso el SRI marcaba "el certificado firmante no
        // es válido" aunque igual autorizaba el comprobante.
        $qualProps = $this->construirSignedProperties($dom, $certEncoded, $certDigest);
        $signedPropsNode = $qualProps->getElementsByTagNameNS(
            'http://uri.etsi.org/01903/v1.3.2#',
            'SignedProperties'
        )->item(0);
        $signedPropsNode->setIdAttribute('Id', true);

        // Se agrega temporalmente al documento para poder canonicalizarlo
        // y calcular su huella -- se retira de acá y se reubica dentro
        // de la firma recién después de firmar, sin tocar su contenido.
        $dom->documentElement->appendChild($qualProps);

        $dsig->addReference(
            $signedPropsNode,
            XMLSecurityDSig::SHA1,
            null,
            [
                'id_name' => 'Id',
                'overwrite' => false,
            ]
        );

        // La librería arma el URI de esta referencia a partir del
        // Id="SignedPropertiesID" que ya le pusimos al nodo (confirmado
        // contra el código fuente de xmlseclibs), pero no soporta
        // agregar el atributo Type por opciones -- el SRI lo espera, así
        // que se agrega a mano, igual que ya hacíamos con el URI de la
        // primera referencia.
        $signedPropsRefNode = $dsig->sigNode->getElementsByTagNameNS(
            'http://www.w3.org/2000/09/xmldsig#',
            'Reference'
        )->item(1);

        if ($signedPropsRefNode) {
            $signedPropsRefNode->setAttribute('Type', 'http://uri.etsi.org/01903#SignedProperties');
        }

        $objKey = new XMLSecurityKey(
            XMLSecurityKey::RSA_SHA1,
            ['type' => 'private']
        );
        $objKey->loadKey($privateKey);

        $dsig->sign($objKey);
        $dsig->add509Cert($publicCert, true, false);

        // El Id="Signature" es necesario para que
        // QualifyingProperties[Target="#Signature"] resuelva contra el
        // nodo correcto -- antes no se seteaba.
        $dsig->sigNode->setAttribute('Id', 'Signature');

        $dsig->appendSignature($dom->documentElement);

        // Retirar el QualifyingProperties de su ubicación temporal y
        // reubicarlo -- sin alterar su contenido -- dentro de
        // ds:Object, adentro de la firma ya calculada.
        $dom->documentElement->removeChild($qualProps);

        $signatureNode = $dom->getElementsByTagNameNS(
            'http://www.w3.org/2000/09/xmldsig#',
            'Signature'
        )->item(0);

        $objectNode = $dom->createElementNS(
            'http://www.w3.org/2000/09/xmldsig#',
            'ds:Object'
        );
        $objectNode->appendChild($qualProps);
        $signatureNode->appendChild($objectNode);

        return $dom->saveXML();
    }

    // ─────────────────────────────────────────────
    // CONSTRUIR SignedProperties (XAdES-BES)
    // ─────────────────────────────────────────────

    private function construirSignedProperties(
        \DOMDocument $dom,
        string $certEncoded,
        string $certDigest
    ): \DOMElement {
        // Namespace XAdES
        $xadesNs = 'http://uri.etsi.org/01903/v1.3.2#';
        $signingTime = now()->format('Y-m-d\TH:i:s');

        $qualProps = $dom->createElementNS($xadesNs, 'xades:QualifyingProperties');
        $qualProps->setAttribute('Target', '#Signature');

        $signedProps = $dom->createElementNS($xadesNs, 'xades:SignedProperties');
        $signedProps->setAttribute('Id', 'SignedPropertiesID');

        $signedSigProps = $dom->createElementNS($xadesNs, 'xades:SignedSignatureProperties');

        $signingTimeNode = $dom->createElementNS($xadesNs, 'xades:SigningTime', $signingTime);
        $signedSigProps->appendChild($signingTimeNode);

        $signingCert = $dom->createElementNS($xadesNs, 'xades:SigningCertificate');
        $certNode = $dom->createElementNS($xadesNs, 'xades:Cert');

        $certDigestNode = $dom->createElementNS($xadesNs, 'xades:CertDigest');
        $digestMethod = $dom->createElementNS(
            'http://www.w3.org/2000/09/xmldsig#',
            'ds:DigestMethod'
        );
        $digestMethod->setAttribute('Algorithm', 'http://www.w3.org/2000/09/xmldsig#sha1');
        $digestValue = $dom->createElementNS(
            'http://www.w3.org/2000/09/xmldsig#',
            'ds:DigestValue',
            $certDigest
        );

        $certDigestNode->appendChild($digestMethod);
        $certDigestNode->appendChild($digestValue);
        $certNode->appendChild($certDigestNode);

        $issuerSerial = $dom->createElementNS($xadesNs, 'xades:IssuerSerial');
        $certInfo = openssl_x509_parse(
            "-----BEGIN CERTIFICATE-----\n" .
            chunk_split($certEncoded, 64) .
            "-----END CERTIFICATE-----"
        );
        $issuerName = $this->formatearIssuer($certInfo['issuer'] ?? []);
        $serialNumber = $certInfo['serialNumber'] ?? '0';

        $x509IssuerName = $dom->createElementNS(
            'http://www.w3.org/2000/09/xmldsig#',
            'ds:X509IssuerName',
            $issuerName
        );
        $x509SerialNumber = $dom->createElementNS(
            'http://www.w3.org/2000/09/xmldsig#',
            'ds:X509SerialNumber',
            $serialNumber
        );

        $issuerSerial->appendChild($x509IssuerName);
        $issuerSerial->appendChild($x509SerialNumber);
        $certNode->appendChild($issuerSerial);
        $signingCert->appendChild($certNode);
        $signedSigProps->appendChild($signingCert);

        $signedProps->appendChild($signedSigProps);
        $qualProps->appendChild($signedProps);

        return $qualProps;
    }

    // ─────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────

    private function extraerCertBase64(string $certPem): string
    {
        $cert = preg_replace('/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\s/', '', $certPem);
        return trim($cert);
    }

    private function formatearIssuer(array $issuer): string
    {
        $partes = [];

        $orden = ['CN', 'OU', 'O', 'L', 'ST', 'C'];

        foreach ($orden as $campo) {
            if (isset($issuer[$campo])) {
                $partes[] = "{$campo}={$issuer[$campo]}";
            }
        }

        return implode(', ', $partes);
    }

    // ─────────────────────────────────────────────
    // VERIFICAR QUE EL CERTIFICADO ES VÁLIDO
    // ─────────────────────────────────────────────

    public function verificarCertificado(): array
    {
        if (!file_exists($this->certificadoPath)) {
            return [
                'valido' => false,
                'mensaje' => 'Archivo .p12 no encontrado',
            ];
        }

        $certData = file_get_contents($this->certificadoPath);
        $certs = [];

        if (!openssl_pkcs12_read($certData, $certs, $this->certificadoClave)) {
            return [
                'valido' => false,
                'mensaje' => 'Clave incorrecta o archivo .p12 dañado',
            ];
        }

        $certInfo = openssl_x509_parse($certs['cert']);
        $validHasta = date('Y-m-d H:i:s', $certInfo['validTo_time_t']);
        $vencido = $certInfo['validTo_time_t'] < time();

        return [
            'valido' => !$vencido,
            'titular' => $certInfo['subject']['CN'] ?? 'Desconocido',
            'valid_hasta' => $validHasta,
            'vencido' => $vencido,
            'mensaje' => $vencido
                ? "Certificado vencido el {$validHasta}"
                : "Certificado válido hasta {$validHasta}",
        ];
    }
}