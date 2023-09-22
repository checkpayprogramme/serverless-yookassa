import { Prisma } from '@prisma/client';
import prisma from './db';


export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });
}

export async function createOrder(orderData: Prisma.OrderCreateInput) {
  return prisma.order.create({
    data: orderData,
  });
}