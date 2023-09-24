import { YooCheckout, ICapturePayment } from '@a2seven/yoo-checkout';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from "dotenv";
dotenv.config();


export const getPaymentForCapture = async ({ objectPayment }: any) => {

    const { SHOP_ID_YOOKASSA, TOKEN_YOOKASSA } = process.env
    const checkout = new YooCheckout({ shopId: `${SHOP_ID_YOOKASSA}`, secretKey: `${TOKEN_YOOKASSA}` });
    const paymentId = objectPayment.id;
    const idempotenceKey = objectPayment?.metadata?.idempotenceKey;
    const capturePayload: ICapturePayment = {
        amount: {
            value: objectPayment.amount.value,
            currency: objectPayment.amount.currency
        }
    };

    try {
        const payment = await checkout.capturePayment(paymentId, capturePayload, idempotenceKey);
        console.log("idempotenceKey====", idempotenceKey)
        console.log("payment", payment)
    } catch (error) {
        console.error(error);
    }
}
