import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from "fastify";
import cors from '@fastify/cors'
import routes from "./routes";
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from "dotenv";
import { getPaymentForCapture } from "./getPaymentForCapture";
import { YooCheckout } from '@a2seven/yoo-checkout';
dotenv.config();

const { SHOP_ID_YOOKASSA, TOKEN_YOOKASSA, REDIRECT_URL_YOOKASSA_AFTE_PAYMENT_FORM } = process.env;

interface IQueryString {
  paymentId: string;
}

interface CustomRouteGenericQuery {
  Querystring: IQueryString;
}


interface IParams {
  paymentId: string;

}


interface CustomRouteGenericParam {
  Params: IParams;
}

async function app(
  instance: FastifyInstance,
  opts: FastifyServerOptions,
  done: any
) {

  await instance.register(cors, {
    origin: ["http://localhost:5173", "https://booking.lavrentev.tk"],
    methods: ["POST"]
  })

  instance.get("/", async (req: FastifyRequest, res: FastifyReply) => {
    res.status(200).send({
      hello: "World",
    });
  });

  instance.register(
    async (instance: FastifyInstance, opts: FastifyServerOptions, done) => {
      instance.get(
        "/get-payments-yookassa/:paymentId",
        async (
          req: FastifyRequest<CustomRouteGenericParam>,
          res: FastifyReply
        ) => {
          const { paymentId = "" } = req.params;

          const checkout = new YooCheckout({ shopId: `${SHOP_ID_YOOKASSA}`, secretKey: `${TOKEN_YOOKASSA}` });

          try {
            const payment = await checkout.getPayment(paymentId);

            res.status(200).send({
              payment,
            });
          } catch (error) {
            console.error(error);
          }
        }
      );

      instance.get(
        "/get-payments-yookassa",
        async (
          req: FastifyRequest<CustomRouteGenericQuery>,
          res: FastifyReply
        ) => {
          const { paymentId = "" } = req.query;

          const checkout = new YooCheckout({ shopId: `${SHOP_ID_YOOKASSA}`, secretKey: `${TOKEN_YOOKASSA}` });

          try {
            const payment_list = await checkout.getPayment("");

            res.status(200).send({
              payment_list,
            });
          } catch (error) {
            console.error(error);
          }          

        }
      );
      done();
    }
  );


  instance.post('/', async (req: FastifyRequest, res: FastifyReply) => {


    try {

      const { price, name, description, quantity, email, currency, transactionType }: any = req.body;
      const url = "https://api.yookassa.ru/v3/payments";
      const idempotenceKey = uuidv4().toString()

      // параметры для запроса
      const headers = {
        "Authorization": `Basic ` + btoa(`${SHOP_ID_YOOKASSA}:${TOKEN_YOOKASSA}`),
        "Idempotence-Key": idempotenceKey,
        "Content-Type": 'application/json'
      };
      const params = {
        "amount": {
          "value": `${price}`,
          "currency": currency || "RUB"
        },
        "payment_method_data": {
          "type": "bank_card"
        },
        "confirmation": {
          "type": "redirect",
          "return_url": REDIRECT_URL_YOOKASSA_AFTE_PAYMENT_FORM
        },
        "description": name +" "+ description,
        "metadata":{idempotenceKey, quantity, email, transactionType},
        "save_payment_method": "false"
      };

      // Отправляем первый запрос от пользователя
      const firstResponse = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(params)
      });

      const firstResponseData = await firstResponse.json();

      if (firstResponseData.status === "pending") {     
        res.send({
          "email": email,
          "payment_id": firstResponseData.id,
          "confirmation": firstResponseData?.confirmation,
          "paid": firstResponseData?.paid,
          "amount": firstResponseData?.amount,
          "metadata": firstResponseData?.metadata,
          "description": firstResponseData?.description,
        });
      } else {
        console.error("Error in first response:", firstResponseData);
        res.status(500).send('Internal Server Error');
      }

    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  });

  // WEBhook POST
  instance.post('/webhook', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { event, object }: any = req.body;

     
      if (event === 'payment.waiting_for_capture') {
        const payment_id = object.id;
        const status = object.status;

        if (status === 'waiting_for_capture') {
          //если клиент оплатил
          await getPaymentForCapture({objectPayment:object});
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
  //     instance.get("/webhook", async (req: FastifyRequest, res: FastifyReply) => {
  // console.log(res);
  // res.status(200).send('OK')
  //     }),  

  // For API
  instance.register(routes, { prefix: "/api/v1" });
  done();
}

export default app;