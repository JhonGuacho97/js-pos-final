<tr>
    <td class="header">
        <a href="{{ $url }}" style="display: inline-block;">
            @if(getLogoUrl())
                <img src="{{ getLogoUrl() }}" class="logo" alt="{{ getSettingValue('company_name') }}">
            @else
                {{ getSettingValue('company_name') }}
            @endif
        </a>
    </td>
</tr>
