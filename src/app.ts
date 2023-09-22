import {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions,
  } from "fastify";
  import routes from "./routes";
  import axios from "axios";
  import { v4 as uuidv4 } from 'uuid';
import { createOrder } from "./Order";

import * as dotenv from "dotenv";
import { confirmPayment } from "./confirmPayment";
import { createPayment } from "./Payment";
import { getPaymentForCapture } from "./getPaymentForCapture";
dotenv.config();


  async function app(
    instance: FastifyInstance,
    opts: FastifyServerOptions,
    done:any
  ) {
// GET
    instance.get("/", async (req: FastifyRequest, res: FastifyReply) => {
      res.status(200).send({
        hello: "World",
      });
    });

// POST
instance.post('/', async (req: FastifyRequest, res: FastifyReply) => {
  try {
    // Получаем данные из тела POST-запроса
    const { price, name, description, quantity, email }:any = req.body;
    const { SHOP_ID_YOOKASSA, TOKEN_YOOKASSA, REDIRECT_URL_YOOKASSA_WEBHOOK } = process.env;

    // Выводим полученные данные на печать
    console.log('Email:', email);
    console.log('Сумма оплаты:', price);
    console.log('Название:', name);
    console.log('Описание:', description);
    console.log('Количество:', quantity);

    // =========================================================================
    const newOrder = await createOrder({
      price, name, description, quantity
    });

    if (!newOrder) {
      req.log.error('ERROR CREATE ORDER');
      return res.status(500).send('Internal Server Error');
    }

    const newPayment = await createPayment({
      order: { connect: { id: newOrder.id } },
      email: email,
      amount: price
    });

    const url = "https://api.yookassa.ru/v3/payments";

    // получаем заказ из БД и цену заказа
    var order_id = newOrder.id;
    var order_price = newOrder.price;

    // параметры для запроса
    var headers = {
      "Authorization": `Basic ` + btoa(`${SHOP_ID_YOOKASSA}:${TOKEN_YOOKASSA}`),
      "Idempotence-Key": uuidv4().toString(),
      "Content-Type": 'application/json'
    };
    var params = {
      "amount": {
        "value": price.toString(),
        "currency": "RUB"
      },
      "payment_method_data": {
        "type": "bank_card"
      },
      "confirmation": {
        "type": "redirect",
        "return_url": REDIRECT_URL_YOOKASSA_WEBHOOK
      },
      "description": name + description,
      "save_payment_method": "false"
    };

    // запрос к юкассе
    axios.post(url, params, {
      headers: headers,
    }).then((response) => {
      const responseData = response.data;
      if (responseData.status == "pending") {
        console.log("YooKASSA====", responseData.confirmation.confirmation_url);
        return res.send({
          "url": responseData.confirmation.confirmation_url,
        });
      } else {
        return res.status(200).send('OK'); 
      }
    }).catch((e: any) => {
      req.log.error('ERROR', e.message);
      console.error(e);
      return res.status(500).send({
        "status": "error",
        "body": e.message
      });
    });
    
    

  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});


    // WEBhook POST
    instance.post('/webhook', async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const { event, object }:any = req.body;
  
        if (event === 'payment.waiting_for_capture') {
          const payment_id = object.id;
          const status = object.status;
  
          if (status === 'waiting_for_capture') {
            // Сюда попадаем, если клиент оплатил
            await confirmPayment(payment_id);
            await getPaymentForCapture(payment_id);
          }
        }
  
        res.status(200).send('OK');
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });
  

    // Добавьте другие маршруты, связанные с платежами, если необходимо
    // WEBhook GET
    instance.get("/webhook", async (req: FastifyRequest, res: FastifyReply) => {
console.log(res);
res.status(200).send('OK')
    }),  

    // For API
    instance.register(routes, { prefix: "/api/v1" });
    done();
  }
  
  export default app;