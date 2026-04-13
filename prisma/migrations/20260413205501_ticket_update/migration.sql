/*
  Warnings:

  - The primary key for the `ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `order_id` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ticket" DROP CONSTRAINT "ticket_pkey",
ADD COLUMN     "order_id" TEXT NOT NULL,
ADD CONSTRAINT "ticket_pkey" PRIMARY KEY ("user_id", "order_id");

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
