import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["info", "error", "warn", "query"],
});

export default prisma