-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'MALE_OTHER', 'FEMALE_OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "bio" TEXT,
    "country" VARCHAR(60),
    "city" VARCHAR(255),
    "profession" VARCHAR(50),
    "dob" DATE,
    "gender" "Gender",
    "profilePictureMime" VARCHAR(100),
    "profilePicture" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
