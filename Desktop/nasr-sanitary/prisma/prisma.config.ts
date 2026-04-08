import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "./schema.prisma",
  db: {
    url: process.env.DATABASE_URL,
  },
});