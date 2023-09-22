-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "username" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "first_name" STRING,
    "last_name" STRING,
    "middle_name" STRING NOT NULL,
    "date_birth" TIMESTAMP(3) NOT NULL,
    "phone_user" STRING,
    "phone_additional" STRING,
    "link_to_profile" STRING,
    "date_create_user" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_modified" TIMESTAMP(3) NOT NULL,
    "trademark" STRING,
    "locale_user" STRING,
    "image_url_user" STRING,
    "auth_is_telegram" BOOL NOT NULL DEFAULT false,
    "auth_is_yandex" BOOL NOT NULL DEFAULT false,
    "auth_is_google" BOOL NOT NULL DEFAULT false,
    "role" STRING DEFAULT 'buyer',
    "bio" STRING,
    "is_black_list" BOOL NOT NULL DEFAULT false,
    "balance" FLOAT8 NOT NULL DEFAULT 0.00,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "color" STRING NOT NULL,
    "slug" STRING NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherPhotos" (
    "id" STRING NOT NULL,
    "errors" STRING NOT NULL,
    "valid" BOOL NOT NULL,
    "name" STRING NOT NULL,
    "size" STRING NOT NULL,
    "type" STRING NOT NULL,
    "imageUrl" STRING NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtherPhotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" STRING NOT NULL,
    "isFavorite" BOOL DEFAULT false,
    "name" STRING NOT NULL,
    "description" STRING NOT NULL,
    "image" STRING NOT NULL,
    "price_product" FLOAT8,
    "authorId" STRING,
    "tax" STRING,
    "taxation" STRING,
    "text" STRING,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlotSchedule" (
    "id" STRING NOT NULL,
    "serviceProductId" STRING NOT NULL,
    "availableSlots" BOOL NOT NULL,
    "durationService" STRING NOT NULL,
    "price" FLOAT8,
    "date" STRING,
    "time" STRING,

    CONSTRAINT "SlotSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentBooking" (
    "id" STRING NOT NULL,
    "slotScheduleId" STRING NOT NULL,
    "clientDataId" STRING NOT NULL,
    "date_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_modified" TIMESTAMP(3) NOT NULL,
    "status" STRING NOT NULL,

    CONSTRAINT "AppointmentBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionUser" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" STRING NOT NULL,
    "appointmentBookingId" STRING,
    "amount" FLOAT8 NOT NULL DEFAULT 0.0,
    "currency" STRING NOT NULL DEFAULT 'RUB',
    "status" STRING NOT NULL DEFAULT 'Pending',
    "paymentId" STRING NOT NULL,
    "changingBalance" STRING NOT NULL,
    "descriptionBalance" STRING NOT NULL,
    "productId" STRING,

    CONSTRAINT "TransactionUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" STRING NOT NULL,
    "order_id" STRING NOT NULL,
    "price" FLOAT8 NOT NULL,
    "paid" BOOL NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" STRING NOT NULL,
    "payment_id" STRING NOT NULL,
    "amount" FLOAT8 NOT NULL,
    "orderId" STRING NOT NULL,
    "email" STRING NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OtherPhotosToProduct" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToTag" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_id_key" ON "Order"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_payment_id_key" ON "Payment"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "_OtherPhotosToProduct_AB_unique" ON "_OtherPhotosToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OtherPhotosToProduct_B_index" ON "_OtherPhotosToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToTag_AB_unique" ON "_ProductToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToTag_B_index" ON "_ProductToTag"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotSchedule" ADD CONSTRAINT "SlotSchedule_serviceProductId_fkey" FOREIGN KEY ("serviceProductId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentBooking" ADD CONSTRAINT "AppointmentBooking_slotScheduleId_fkey" FOREIGN KEY ("slotScheduleId") REFERENCES "SlotSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentBooking" ADD CONSTRAINT "AppointmentBooking_clientDataId_fkey" FOREIGN KEY ("clientDataId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionUser" ADD CONSTRAINT "TransactionUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionUser" ADD CONSTRAINT "TransactionUser_appointmentBookingId_fkey" FOREIGN KEY ("appointmentBookingId") REFERENCES "AppointmentBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionUser" ADD CONSTRAINT "TransactionUser_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OtherPhotosToProduct" ADD CONSTRAINT "_OtherPhotosToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "OtherPhotos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OtherPhotosToProduct" ADD CONSTRAINT "_OtherPhotosToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
