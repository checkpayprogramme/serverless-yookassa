import { Prisma } from '@prisma/client';
import prisma from './db';


export async function createPayment(data: Prisma.PaymentCreateInput) {
  return prisma.payment.create({
    data,
  });
}

