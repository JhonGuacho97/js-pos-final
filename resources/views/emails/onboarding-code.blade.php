@component('mail::message')
# Verifica tu correo

Usa este código para terminar de crear tu cuenta en EcuaPOS:

@component('mail::panel')
<div style="font-size: 30px; font-weight: 700; letter-spacing: 8px; text-align: center;">{{ $code }}</div>
@endcomponent

El código vence en {{ $minutes }} minutos. Si no estás creando una cuenta, ignora este correo: nadie podrá usar tu dirección sin este código.

Saludos,<br>
EcuaPOS
@endcomponent
