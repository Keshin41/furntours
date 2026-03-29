-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "category" TEXT,
    "imageUrl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option_type" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "option_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option_value" (
    "id" TEXT NOT NULL,
    "option_type_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "option_value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sku" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sku_code" TEXT NOT NULL,
    "price_override" DECIMAL(10,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sku_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sku_option_value" (
    "sku_id" TEXT NOT NULL,
    "option_value_id" TEXT NOT NULL,

    CONSTRAINT "sku_option_value_pkey" PRIMARY KEY ("sku_id","option_value_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sku_sku_code_key" ON "sku"("sku_code");

-- AddForeignKey
ALTER TABLE "option_type" ADD CONSTRAINT "option_type_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option_value" ADD CONSTRAINT "option_value_option_type_id_fkey" FOREIGN KEY ("option_type_id") REFERENCES "option_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sku" ADD CONSTRAINT "sku_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sku_option_value" ADD CONSTRAINT "sku_option_value_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "sku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sku_option_value" ADD CONSTRAINT "sku_option_value_option_value_id_fkey" FOREIGN KEY ("option_value_id") REFERENCES "option_value"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
