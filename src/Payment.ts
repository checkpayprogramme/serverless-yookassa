import { Prisma } from '@prisma/client';
import prisma from './db';


export async function createPayment(data: any) {
  return prisma.payment.create({
    data: {
      order: {
        connect: {
          id: data.order.id, // Используйте значение ID заказа из data
        },
      },
      email: data.email,
      amount: data.amount,
    },
  });
}
