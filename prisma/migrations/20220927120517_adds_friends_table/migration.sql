-- CreateTable
CREATE TABLE "friends" (
    "id" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "requestedUserId" TEXT NOT NULL,
    "receiverUserId" TEXT NOT NULL,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "friends_requestedUserId_receiverUserId_key" ON "friends"("requestedUserId", "receiverUserId");

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_requestedUserId_fkey" FOREIGN KEY ("requestedUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_receiverUserId_fkey" FOREIGN KEY ("receiverUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
