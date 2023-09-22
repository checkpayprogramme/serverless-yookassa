import prisma from "./db";

async function getAllUsers() {
    return prisma.user.findMany();
  }
  
  export { getAllUsers };