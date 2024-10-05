-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('LIST', 'CREATE', 'DELETE', 'UPDATE');

-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "type" "LogType" NOT NULL DEFAULT 'LIST';
