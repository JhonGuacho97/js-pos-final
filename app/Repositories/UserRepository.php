<?php

namespace App\Repositories;

use App\Models\Role;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class UserRepository
 */
class UserRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'created_at',
        //        'roles.name',
    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model()
    {
        return User::class;
    }

    /**
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Support\Collection|mixed
     */
    public function storeUser($input)
    {
        try {
            DB::beginTransaction();
            $input['password'] = Hash::make($input['password']);
            // Un select vacío llega como '' desde el formulario -- en la
            // columna (entero, nullable) eso debe guardarse como NULL, no
            // como texto vacío.
            if (isset($input['default_warehouse_id']) && $input['default_warehouse_id'] === '') {
                $input['default_warehouse_id'] = null;
            }
            $user = $this->create($input);
            if (isset($input['role_id'])) {
                if (!Auth::user() || !Auth::user()->hasRole(Role::ADMIN)) {
                    throw new UnprocessableEntityHttpException('No tiene permiso para asignar roles.');
                }
                $user->assignRole($input['role_id']);
            }
            if (isset($input['image']) && !empty($input['image'])) {
                $user->addMedia($input['image'])->toMediaCollection(
                    User::PATH,
                    config('app.media_disc')
                );
            }
            DB::commit();

            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Support\Collection|mixed
     */
    public function updateUser($input, $id)
    {
        try {
            DB::beginTransaction();
            if (isset($input['default_warehouse_id']) && $input['default_warehouse_id'] === '') {
                $input['default_warehouse_id'] = null;
            }
            $user = $this->update($input, $id);

            if (isset($input['role_id'])) {
                if (!Auth::user() || !Auth::user()->hasRole(Role::ADMIN)) {
                    throw new UnprocessableEntityHttpException('No tiene permiso para asignar roles.');
                }
                $user->syncRoles($input['role_id']);
            }
            if (isset($input['image']) && $input['image']) {
                $user->clearMediaCollection(User::PATH);
                $user['image_url'] = $user->addMedia($input['image'])->toMediaCollection(
                    User::PATH,
                    config('app.media_disc')
                );
            }
            DB::commit();

            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return User|\Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function updateUserProfile($input)
    {
        try {
            DB::beginTransaction();
            unset($input['role_id']);

            $user = Auth::user();
            $user->update($input);

            if ((!empty($input['image']))) {
                $user->clearMediaCollection(User::PATH);
                $user->media()->delete();
                $user->addMedia($input['image'])->toMediaCollection(User::PATH, config('app.media_disc'));
            }
            DB::commit();

            return $user;
        } catch (\Exception $e) {
            DB::rollBack();

            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Support\Collection|mixed
     */
    public function getUsers($perPage)
    {
        $loginUserId = Auth::id();
        if (Auth::user()->hasRole(Role::ADMIN)) {
            if (request()->get('returnAll') == 'true') {
                $users = $this->paginate($perPage);
            } else {
                $users = $this->where('id', '!=', $loginUserId)->paginate($perPage);
            }
        } else {
            $users = $this->whereHas('roles', function ($q) {
                $q->where('name', '!=', Role::ADMIN);
            });

            if (request()->get('returnAll') == 'true') {
                $users = $users->paginate($perPage);
            } else {
                $users = $users->where('id', '!=', $loginUserId)->paginate($perPage);
            }
        }

        return $users;
    }

    public function updateUserPassword($userId, $password)
    {
        $user = User::findOrFail($userId);

        $user->update([
            'password' => Hash::make($password),
        ]);

        return $user;
    }

    public function updatePassword(array $input): User
    {
        /** @var User $user */
        $user = Auth::user();
        if (!Hash::check($input['current_password'], $user->password)) {
            throw new UnprocessableEntityHttpException('Current password is invalid.');
        }
        $input['password'] = Hash::make($input['new_password']);
        $user->update($input);

        return $user;
    }
}
