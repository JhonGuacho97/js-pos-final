<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $minutes = (int) config('sanctum.session_token_expiration', 120);

        DB::table('personal_access_tokens')
            ->whereNull('expires_at')
            ->orderBy('id')
            ->chunkById(200, function ($tokens) use ($minutes) {
                foreach ($tokens as $token) {
                    DB::table('personal_access_tokens')
                        ->where('id', $token->id)
                        ->update([
                            'expires_at' => Carbon::parse($token->created_at)->addMinutes($minutes),
                        ]);
                }
            });
    }

    public function down(): void
    {
        DB::table('personal_access_tokens')
            ->where('name', 'token')
            ->update(['expires_at' => null]);
    }
};
