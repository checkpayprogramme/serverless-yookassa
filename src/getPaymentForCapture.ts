import { v4 as uuidv4 } from 'uuid';
import * as dotenv from "dotenv";
import axios from "axios";


dotenv.config();


import { YooCheckout, ICapturePayment } from '@a2seven/yoo-checkout';


export const getPaymentForCapture = async ({object}:any)=>{

const { SHOP_ID_YOOKASSA, TOKEN_YOOKASSA, REDIRECT_URL_YOOKASSA_WEBHOOK } = process.env

console.log("paymentObgectStartNew=====")

if(object){
    console.log("paymentObgect=====", object)

}

// const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const paymentId = '21966b95-000f-50bf-b000-0d78983bb5bc';

const idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';

// const capturePayload: ICapturePayment = {
//     amount: {
//         value: '2.00',
//         currency: 'RUB'
//     }
// };

try {
    // const payment = await checkout.capturePayment(paymentId, capturePayload, idempotenceKey);
    console.log("payment")
} catch (error) {
     console.error(error);
}
}