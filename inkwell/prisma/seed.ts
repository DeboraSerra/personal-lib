import { PrismaClient } from "@/generated/prisma/client";
import genres from "../assets/lists/genres";
import statuses from "../assets/lists/status";
import tropes from "../assets/lists/tropes";

const prisma = new PrismaClient();

async function main() {
  for (const status of statuses) {
    await prisma.status.create({
      data: status,
    });
  }
  for (const genre of genres) {
    await prisma.genre.create({
      data: genre,
    });
  }
  for (const trope of tropes) {
    await prisma.trope.create({
      data: trope,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
