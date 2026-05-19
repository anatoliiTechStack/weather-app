-- Initial schema for weather-app (PostgreSQL)
-- Mirrors prisma/schema.prisma — for manual review / provisioning

CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "favorite_cities" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "city_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favorite_cities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "search_history" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "city_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_history_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "favorite_cities_user_id_idx" ON "favorite_cities"("user_id");

CREATE UNIQUE INDEX "favorite_cities_user_id_city_name_key"
    ON "favorite_cities"("user_id", "city_name");

CREATE INDEX "search_history_user_id_created_at_idx"
    ON "search_history"("user_id", "created_at" DESC);
