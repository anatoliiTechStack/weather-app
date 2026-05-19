-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "favorite_cities" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "city_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favorite_cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_history" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "city_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorite_cities_user_id_idx" ON "favorite_cities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_cities_user_id_city_name_key" ON "favorite_cities"("user_id", "city_name");

-- CreateIndex
CREATE INDEX "search_history_user_id_created_at_idx" ON "search_history"("user_id", "created_at" DESC);
