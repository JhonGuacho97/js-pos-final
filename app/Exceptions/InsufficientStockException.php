<?php

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class InsufficientStockException extends UnprocessableEntityHttpException
{
    public function __construct(private readonly array $conflicts, private readonly array $diagnosis = [])
    {
        parent::__construct('Uno o más productos no tienen stock suficiente en el almacén seleccionado.');
    }

    public function conflicts(): array
    {
        return $this->conflicts;
    }

    public function diagnosis(): array
    {
        return $this->diagnosis ?: [
            'can_sync' => false,
            'items' => [],
            'conflicts' => $this->conflicts,
            'checked_at' => now()->toIso8601String(),
        ];
    }
}
