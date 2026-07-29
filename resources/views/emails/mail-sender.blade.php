@component('mail::layout')
    {{-- Header --}}
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
        @endcomponent
    @endslot

    {{-- Body --}}
    <div>
        {!! $data !!}
    </div>

    {{-- Footer --}}
    @slot('footer')
        @component('mail::footer')
        @endcomponent
    @endslot
@endcomponent
