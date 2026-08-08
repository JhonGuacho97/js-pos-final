<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Utils\ResponseUtil;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * @SWG\Swagger(
 *   basePath="/api/v1",
 *
 *   @SWG\Info(
 *     title="Laravel Generator APIs",
 *     version="1.0.0",
 *   )
 * )
 * This class should be parent class for other API controllers
 * Class AppBaseController
 */
class AppBaseController extends Controller
{
    public function sendResponse($result, $message): JsonResponse
    {
        return Response::json(ResponseUtil::makeResponse($message, $result));
    }

    public function sendError($error, $code = 422): JsonResponse
    {
        return Response::json(ResponseUtil::makeError($error), $code);
    }

    public function sendSuccess($message): JsonResponse
    {
        return Response::json([
            'success' => true,
            'message' => $message,
        ], 200);
    }

    /**
     * Sucursal a la que un usuario no-admin está restringido, o null si
     * es admin (ve todas) o no tiene sucursal asignada (por decisión de
     * producto, en ese caso conserva el comportamiento actual: ve todo).
     */
    protected function restrictedWarehouseId(): ?int
    {
        $user = Auth::user();
        if (!$user || $user->hasRole(Role::ADMIN)) {
            return null;
        }

        return $user->default_warehouse_id;
    }

    /**
     * Lanza 403 si el warehouse_id dado no pertenece a la sucursal del
     * usuario autenticado, salvo que sea admin o no tenga sucursal
     * asignada (ver restrictedWarehouseId()). Usar en show/update/destroy
     * y cualquier endpoint que exponga un registro puntual por ID.
     */
    protected function authorizeWarehouseAccess(?int $warehouseId): void
    {
        $restricted = $this->restrictedWarehouseId();
        if ($restricted !== null && $warehouseId !== $restricted) {
            throw new AccessDeniedHttpException('No tiene permiso para acceder a datos de esta sucursal.');
        }
    }
}
