<?php

namespace App\Services;

use App\Models\ElectronicInvoice;
use App\Models\SriSequence;
use App\Models\SriSequenceAdjustment;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SriSequenceService
{
    public const DOCUMENT_TYPES = [
        ElectronicInvoice::FACTURA => 'Factura',
        ElectronicInvoice::NOTA_CREDITO => 'Nota de crédito',
        ElectronicInvoice::NOTA_DEBITO => 'Nota de débito',
    ];

    public function listForSeries(
        int $storeId,
        int $ambiente,
        string $estab,
        string $ptoEmi
    ): array {
        $this->validateSeries($ambiente, $estab, $ptoEmi);

        return collect(self::DOCUMENT_TYPES)
            ->map(fn (string $label, string $type) => $this->state(
                $storeId,
                $ambiente,
                $estab,
                $ptoEmi,
                $type,
                $label
            ))
            ->values()
            ->all();
    }

    public function reserveNext(
        int $storeId,
        int $ambiente,
        string $estab,
        string $ptoEmi,
        string $documentType
    ): string {
        $this->validateSeries($ambiente, $estab, $ptoEmi, $documentType);

        $next = DB::transaction(function () use ($storeId, $ambiente, $estab, $ptoEmi, $documentType) {
            $this->ensureSequenceExists($storeId, $ambiente, $estab, $ptoEmi, $documentType);

            $sequence = $this->sequenceQuery($storeId, $ambiente, $estab, $ptoEmi, $documentType)
                ->lockForUpdate()
                ->firstOrFail();

            $effectiveLast = max(
                (int) $sequence->ultimo_secuencial,
                $this->localMaximum($storeId, $ambiente, $estab, $ptoEmi, $documentType)
            );

            if ($effectiveLast >= 999999999) {
                throw new \RuntimeException('La serie SRI alcanzó el máximo de 999999999.');
            }

            $next = $effectiveLast + 1;
            $sequence->update(['ultimo_secuencial' => $next]);

            return $next;
        }, 3);

        return $this->format($next);
    }

    public function adjustLastUsed(
        int $storeId,
        int $ambiente,
        string $estab,
        string $ptoEmi,
        string $documentType,
        int $newLast,
        string $reason,
        ?int $userId,
        ?string $ipAddress,
        ?string $userAgent
    ): array {
        $this->validateSeries($ambiente, $estab, $ptoEmi, $documentType);

        DB::transaction(function () use (
            $storeId,
            $ambiente,
            $estab,
            $ptoEmi,
            $documentType,
            $newLast,
            $reason,
            $userId,
            $ipAddress,
            $userAgent
        ) {
            $this->ensureSequenceExists($storeId, $ambiente, $estab, $ptoEmi, $documentType);

            $sequence = $this->sequenceQuery($storeId, $ambiente, $estab, $ptoEmi, $documentType)
                ->lockForUpdate()
                ->firstOrFail();

            $current = max(
                (int) $sequence->ultimo_secuencial,
                $this->localMaximum($storeId, $ambiente, $estab, $ptoEmi, $documentType)
            );

            if ($newLast < $current) {
                throw ValidationException::withMessages([
                    'ultimo_secuencial' => "No se puede disminuir la numeración. El último secuencial protegido es {$this->format($current)}.",
                ]);
            }

            if ($newLast > 999999998) {
                throw ValidationException::withMessages([
                    'ultimo_secuencial' => 'El último secuencial debe ser menor que 999999999.',
                ]);
            }

            if ($newLast === $current && (int) $sequence->ultimo_secuencial === $current) {
                return;
            }

            SriSequenceAdjustment::create([
                'sri_sequence_id' => $sequence->id,
                'store_id' => $storeId,
                'user_id' => $userId,
                'secuencial_anterior' => $current,
                'secuencial_nuevo' => $newLast,
                'motivo' => $reason,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent ? mb_substr($userAgent, 0, 500) : null,
            ]);

            $sequence->update([
                'ultimo_secuencial' => $newLast,
                'updated_by' => $userId,
            ]);
        }, 3);

        return $this->state(
            $storeId,
            $ambiente,
            $estab,
            $ptoEmi,
            $documentType,
            self::DOCUMENT_TYPES[$documentType]
        );
    }

    private function state(
        int $storeId,
        int $ambiente,
        string $estab,
        string $ptoEmi,
        string $documentType,
        string $label
    ): array {
        $sequence = $this->sequenceQuery($storeId, $ambiente, $estab, $ptoEmi, $documentType)
            ->with(['updatedBy:id,first_name,last_name'])
            ->first();
        $localMaximum = $this->localMaximum($storeId, $ambiente, $estab, $ptoEmi, $documentType);
        $effectiveLast = max((int) ($sequence?->ultimo_secuencial ?? 0), $localMaximum);
        $lastAdjustment = $sequence?->adjustments()
            ->with('user:id,first_name,last_name')
            ->latest('id')
            ->first();

        return [
            'tipo_comprobante' => $documentType,
            'label' => $label,
            'ultimo_secuencial' => $effectiveLast,
            'ultimo_formateado' => $this->format($effectiveLast),
            'proximo_secuencial' => $effectiveLast < 999999999 ? $effectiveLast + 1 : null,
            'proximo_formateado' => $effectiveLast < 999999999 ? $this->format($effectiveLast + 1) : null,
            'maximo_local' => $localMaximum,
            'serie' => "{$estab}-{$ptoEmi}",
            'ambiente' => $ambiente,
            'ultima_modificacion' => $lastAdjustment ? [
                'motivo' => $lastAdjustment->motivo,
                'fecha' => optional($lastAdjustment->created_at)->toIso8601String(),
                'usuario' => trim(($lastAdjustment->user?->first_name ?? '') . ' ' . ($lastAdjustment->user?->last_name ?? '')) ?: 'Sistema',
            ] : null,
        ];
    }

    private function ensureSequenceExists(
        int $storeId,
        int $ambiente,
        string $estab,
        string $ptoEmi,
        string $documentType
    ): void {
        DB::table('sri_sequences')->insertOrIgnore([
            'store_id' => $storeId,
            'ambiente' => $ambiente,
            'estab' => $estab,
            'pto_emi' => $ptoEmi,
            'tipo_comprobante' => $documentType,
            'ultimo_secuencial' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function sequenceQuery(
        int $storeId,
        int $ambiente,
        string $estab,
        string $ptoEmi,
        string $documentType
    ) {
        return SriSequence::query()
            ->where('store_id', $storeId)
            ->where('ambiente', $ambiente)
            ->where('estab', $estab)
            ->where('pto_emi', $ptoEmi)
            ->where('tipo_comprobante', $documentType);
    }

    private function localMaximum(
        int $storeId,
        int $ambiente,
        string $estab,
        string $ptoEmi,
        string $documentType
    ): int {
        return (int) ElectronicInvoice::query()
            ->where('store_id', $storeId)
            ->where('ambiente', $ambiente)
            ->where('estab', $estab)
            ->where('pto_emi', $ptoEmi)
            ->where('tipo_comprobante', $documentType)
            ->where('clave_acceso', 'not like', 'ERR%')
            ->whereRaw("secuencial REGEXP '^[0-9]{9}$'")
            ->max(DB::raw('CAST(secuencial AS UNSIGNED)'));
    }

    private function validateSeries(
        int $ambiente,
        string $estab,
        string $ptoEmi,
        ?string $documentType = null
    ): void {
        if (! in_array($ambiente, [1, 2], true)
            || ! preg_match('/^\d{3}$/', $estab)
            || ! preg_match('/^\d{3}$/', $ptoEmi)
            || ($documentType !== null && ! array_key_exists($documentType, self::DOCUMENT_TYPES))) {
            throw ValidationException::withMessages([
                'serie' => 'La combinación de ambiente, establecimiento, punto de emisión o tipo no es válida.',
            ]);
        }
    }

    private function format(int $sequence): string
    {
        return str_pad((string) $sequence, 9, '0', STR_PAD_LEFT);
    }
}
