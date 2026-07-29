<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>{{ config('app.name') }}</title>
</head>
<body>
<table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center">
            <table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                    <td class="accent-bar">&nbsp;</td>
                </tr>
                {{ $header ?? '' }}
                <tr>
                    <td class="body" width="100%" cellpadding="0" cellspacing="0" style="border: hidden !important;">
                        <table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                                <td class="content-cell">
                                    {!! $slot !!}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                {{ $footer ?? '' }}
            </table>
        </td>
    </tr>
</table>
</body>
</html>
