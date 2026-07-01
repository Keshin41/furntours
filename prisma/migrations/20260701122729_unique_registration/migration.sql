/*
  Warnings:

  - A unique constraint covering the columns `[user_id,event_part_id]` on the table `registration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "registration_user_id_event_part_id_key" ON "registration"("user_id", "event_part_id");
