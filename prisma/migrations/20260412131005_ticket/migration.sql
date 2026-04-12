-- CreateTable
CREATE TABLE "ticket" (
    "user_id" TEXT NOT NULL,
    "sku_id" TEXT NOT NULL,

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("user_id","sku_id")
);

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "sku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
