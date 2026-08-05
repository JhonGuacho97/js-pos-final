<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Models\CreditNoteCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreditNoteCategoryAPIController extends AppBaseController
{
    public function index(): JsonResponse
    {
        $categories = CreditNoteCategory::orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $categories->map(fn (CreditNoteCategory $c) => $c->prepareAttributes() + ['id' => $c->id]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = CreditNoteCategory::create($request->only(['name', 'description']));

        return response()->json([
            'success' => true,
            'message' => 'Categoría creada correctamente.',
            'data' => $category->prepareAttributes() + ['id' => $category->id],
        ], 201);
    }
}
