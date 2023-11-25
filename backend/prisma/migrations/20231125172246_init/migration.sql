-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "username" TEXT,
    "image" TEXT,
    "gamewins" INTEGER NOT NULL DEFAULT 0,
    "gameplays" INTEGER NOT NULL DEFAULT 0,
    "gamefails" INTEGER NOT NULL DEFAULT 0,
    "gamepoints" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "game-id" TEXT NOT NULL,
    "userPlayerId" INTEGER NOT NULL,
    "userOpponnentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("game-id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_userPlayerId_fkey" FOREIGN KEY ("userPlayerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
