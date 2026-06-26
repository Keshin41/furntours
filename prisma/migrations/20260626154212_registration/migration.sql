-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('TEXT', 'NUMBER', 'SELECT', 'CHECKBOX', 'RADIO');

-- CreateTable
CREATE TABLE "event_activity_field_definition" (
    "id" TEXT NOT NULL,
    "event_part_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "event_activity_field_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_option" (
    "id" TEXT NOT NULL,
    "field_definition_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "field_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_part_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_answer" (
    "id" TEXT NOT NULL,
    "registration_id" TEXT NOT NULL,
    "field_definition_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registration_answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_activity_field_definition" ADD CONSTRAINT "event_activity_field_definition_event_part_id_fkey" FOREIGN KEY ("event_part_id") REFERENCES "event_activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_option" ADD CONSTRAINT "field_option_field_definition_id_fkey" FOREIGN KEY ("field_definition_id") REFERENCES "event_activity_field_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration" ADD CONSTRAINT "registration_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration" ADD CONSTRAINT "registration_event_part_id_fkey" FOREIGN KEY ("event_part_id") REFERENCES "event_activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_answer" ADD CONSTRAINT "registration_answer_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_answer" ADD CONSTRAINT "registration_answer_field_definition_id_fkey" FOREIGN KEY ("field_definition_id") REFERENCES "event_activity_field_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
