import { v4 as uuidv4 } from 'uuid';
import * as dotenv from "dotenv";
import axios from "axios";


dotenv.config();




export const getPaymentForCapture = async ({payment_id}:any)=>{

const { SHOP_ID_YOOKASSA, TOKEN_YOOKASSA, REDIRECT_URL_YOOKASSA_WEBHOOK } = process.env


const url = `https://api.yookassa.ru/v3/payments/${payment_id}/capture`;

    var headers = {
        "Authorization": `Basic ` + btoa(`${SHOP_ID_YOOKASSA}:${TOKEN_YOOKASSA}`),
        "Idempotence-Key": uuidv4().toString(),
        "Content-Type": 'application/json'
    };

    return await axios.post(url, {}, {
        headers: headers,
    }).then((res) => res.data).then(async (res) => {
        res.log.log("Платеж успешно подтвержден", res);
        return true;
    }).catch((err) => {
        console.error("Ошибка при подтверждении платежа", err);
        return false;
    });
}