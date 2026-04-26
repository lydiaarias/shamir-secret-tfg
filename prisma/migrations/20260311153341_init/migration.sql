-- CreateTable
CREATE TABLE "Secret" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "threshold" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "xIndex" INTEGER NOT NULL,
    "secretId" TEXT NOT NULL,
    CONSTRAINT "Share_secretId_fkey" FOREIGN KEY ("secretId") REFERENCES "Secret" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
