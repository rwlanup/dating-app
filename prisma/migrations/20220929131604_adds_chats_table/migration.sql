/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('CALL', 'MESSAGE');

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_receiverUserId_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_requestedUserId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "deletedAt",
ADD COLUMN     "lastChatReadAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ChatType" NOT NULL DEFAULT 'MESSAGE',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "receiverId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "friendsId" TEXT NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_requestedUserId_fkey" FOREIGN KEY ("requestedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_receiverUserId_fkey" FOREIGN KEY ("receiverUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_friendsId_fkey" FOREIGN KEY ("friendsId") REFERENCES "friends"("id") ON DELETE CASCADE ON UPDATE CASCADE;
