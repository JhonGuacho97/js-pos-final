<?php

namespace App\Repositories;

use App\Models\Sale;
use App\Models\SalesPayment;
use Exception;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class SalesPaymentRepository
 */
class SalesPaymentRepository extends BaseRepository
{
    /**
     * @var string[]
     */
    protected $fieldSearchable = [
        'payment_date',
        'payment_type',
        'amount',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'sale_id',
        'payment_date',
        'payment_type',
        'amount',
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
    public function model(): string
    {
        return SalesPayment::class;
    }

    /**
     * @return mixed
     */
    public function storeSalePayment($input, $sale)
    {
        try {
            DB::beginTransaction();

            $sale = Sale::whereKey($sale->id)->lockForUpdate()->firstOrFail();

            $existAmount = SalesPayment::whereSaleId($sale->id)->lockForUpdate()->get()->sum('amount');

            $saleAmount = $sale->grand_total;
            $payAmount = $input['amount'];
            $creditedAmount = $sale->creditedAmount();

            // Antes no había límite server-side: un pago mayor al saldo
            // pendiente se aceptaba igual (solo el frontend lo evitaba),
            // pudiendo inflar paid_amount por encima del total sin ningún
            // registro de a dónde fue el excedente (a diferencia del
            // flujo de venta nueva, este endpoint no tiene noción de
            // "vuelto").
            $saldoPendiente = max(0, round($saleAmount - $existAmount - $creditedAmount, 2));
            if (round($payAmount, 2) > round($saldoPendiente, 2)) {
                throw new UnprocessableEntityHttpException(
                    "El monto del pago (\${$payAmount}) no puede ser mayor al saldo pendiente (\${$saldoPendiente})."
                );
            }

            $paidAmount = $existAmount + $payAmount;

            $paymentStatus = Sale::PARTIAL_PAID;

            if (($payAmount > 0) && (($paidAmount + $creditedAmount) >= $saleAmount)) {
                $paymentStatus = Sale::PAID;
            }

            $sale->update([
                'payment_status' => $paymentStatus,
                'paid_amount' => $paidAmount,
                'payment_type' => $input['payment_type'],
            ]);

            $input['sale_id'] = $sale->id;
            $salePayment = SalesPayment::create($input);

            DB::commit();

            return $salePayment;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return mixed
     */
    public function updateSalePayment($input, $salesPayment)
    {
        try {
            DB::beginTransaction();

            $sale = Sale::whereId($salesPayment->sale_id)->lockForUpdate()->firstOrFail();
            $salesPayment = SalesPayment::whereKey($salesPayment->id)->lockForUpdate()->firstOrFail();
            $existAmount = SalesPayment::whereSaleId($salesPayment->sale_id)->lockForUpdate()->get()->sum('amount');
            $saleAmount = $sale->grand_total;
            $payAmount = $input['amount'];
            $paidAmount = ($existAmount - $salesPayment->amount) + $payAmount;
            $creditedAmount = $sale->creditedAmount();

            if (round($paidAmount + $creditedAmount, 2) > round($saleAmount, 2)) {
                $available = max(0, round($saleAmount - $creditedAmount - ($existAmount - $salesPayment->amount), 2));
                throw new UnprocessableEntityHttpException(
                    "El monto del pago no puede superar el saldo disponible (\${$available})."
                );
            }

            $paymentStatus = Sale::PARTIAL_PAID;

            if (($payAmount > 0) && (($paidAmount + $creditedAmount) >= $saleAmount)) {
                $paymentStatus = Sale::PAID;
            }

            $sale->update([
                'payment_status' => $paymentStatus,
                'paid_amount' => $paidAmount,
                'payment_type' => $input['payment_type'],
            ]);

            $salesPayment->update($input);

            DB::commit();

            return $salesPayment;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
