import prisma from "./db";

export const confirmPayment = async (payment_id:string) => {


let orderUpdate;
    // const orderUpdate = prisma.order.update({
    //     where: {id: payment_id},
    //     data: {
    //         order: {connect:{paid: true}}
    //     },
       
    //   });

  if(!orderUpdate){
    console.log('Ошибка обновления документа')
    console.log("документы не найдены");
  }


}