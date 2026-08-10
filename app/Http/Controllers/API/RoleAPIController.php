<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleCollection;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Repositories\RoleRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleAPIController extends AppBaseController
{
    /**
     * @var RoleRepository
     */
    private $roleRepository;

    public function __construct(RoleRepository $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    public function index(Request $request): RoleCollection
    {
        $perPage = getPageSize($request);
        $rolesQuery = $this->roleRepository;
        // Role::where(...) no queda filtrado automáticamente por team --
        // eso solo aplica a los métodos de HasRoles/HasPermissions (ver
        // $user->hasRole(), Role::create()), no a queries ad-hoc.
        if ($storeId = $this->currentStoreId()) {
            $rolesQuery->where('store_id', $storeId);
        }
        $roles = $rolesQuery->paginate($perPage);
        RoleResource::usingWithCollection();

        return new RoleCollection($roles);
    }

    public function store(CreateRoleRequest $request): RoleResource
    {
        $input = $request->all();
        $role = $this->roleRepository->storeRole($input);

        return new RoleResource($role);
    }

    public function show(Role $role): RoleResource
    {
        $this->authorizeRoleAccess($role);

        return new RoleResource($role);
    }

    /**
     * @return RoleResource|JsonResponse
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->authorizeRoleAccess($role);

        if ($role->name == Role::ADMIN) {
            return $this->sendError('Admin role Can\'t be updated.');
        }

        $input = $request->all();
        $role = $this->roleRepository->updateRole($input, $role->id);

        return new RoleResource($role);
    }

    public function destroy($id): JsonResponse
    {
        /** @var Role $role */
        $role = Role::findorFail($id);
        $this->authorizeRoleAccess($role);
        if ($role->users->count()) {
            return $this->sendError($role->display_name.' role can\'t be deleted.');
        }
        $role->delete();

        return $this->sendSuccess('Role deleted successfully');
    }

    /**
     * Un rol con store_id de OTRA tienda no debe ser visible/editable
     * aunque se adivine su ID -- ver nota en index() sobre por qué esto
     * no queda cubierto solo por activar el modo teams de Spatie.
     */
    private function authorizeRoleAccess(Role $role): void
    {
        $storeId = $this->currentStoreId();
        if ($storeId !== null && $role->store_id !== null && $role->store_id !== $storeId) {
            throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException('No tiene permiso para acceder a este rol.');
        }
    }
}
