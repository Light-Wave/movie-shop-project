-- CreateTable
CREATE TABLE "user_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "deliveryAddressId" TEXT,
    "billingAddressId" TEXT,

    CONSTRAINT "user_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_data_deliveryAddressId_key" ON "user_data"("deliveryAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "user_data_billingAddressId_key" ON "user_data"("billingAddressId");

-- CreateIndex
CREATE INDEX "user_data_userId_idx" ON "user_data"("userId");

-- CreateIndex
CREATE INDEX "address_id_idx" ON "address"("id");

-- AddForeignKey
ALTER TABLE "user_data" ADD CONSTRAINT "user_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_data" ADD CONSTRAINT "user_data_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_data" ADD CONSTRAINT "user_data_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
