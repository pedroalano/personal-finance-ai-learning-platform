-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Enums
CREATE TYPE "SubscriptionStatus" AS ENUM ('free', 'pro');
CREATE TYPE "LearningPathModuleStatus" AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE "ChatRole" AS ENUM ('user', 'assistant');

-- User
CREATE TABLE "User" (
    "id"                  TEXT NOT NULL,
    "email"               TEXT NOT NULL,
    "password_hash"       TEXT NOT NULL,
    "subscription_status" "SubscriptionStatus" NOT NULL DEFAULT 'free',
    "created_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- UserProfile
CREATE TABLE "UserProfile" (
    "id"              TEXT NOT NULL,
    "userId"          TEXT NOT NULL,
    "income_range"    TEXT,
    "expenses"        DOUBLE PRECISION,
    "debt"            DOUBLE PRECISION,
    "savings"         DOUBLE PRECISION,
    "age"             INTEGER,
    "knowledge_level" TEXT,
    "risk_tolerance"  TEXT,
    "goals"           TEXT,
    "fears"           TEXT,
    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Topic
CREATE TABLE "Topic" (
    "id"          TEXT NOT NULL,
    "title"       TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- Module (embedding column written manually — pgvector Unsupported type)
CREATE TABLE "Module" (
    "id"            TEXT NOT NULL,
    "topicId"       TEXT NOT NULL,
    "title"         TEXT NOT NULL,
    "content"       TEXT NOT NULL,
    "difficulty"    TEXT NOT NULL,
    "prerequisites" TEXT[],
    "embedding"     vector(1536),
    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Module" ADD CONSTRAINT "Module_topicId_fkey"
    FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- LearningPath
CREATE TABLE "LearningPath" (
    "id"         TEXT NOT NULL,
    "userId"     TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- LearningPathModule
CREATE TABLE "LearningPathModule" (
    "id"                TEXT NOT NULL,
    "learningPathId"    TEXT NOT NULL,
    "moduleId"          TEXT NOT NULL,
    "order"             INTEGER NOT NULL,
    "status"            "LearningPathModuleStatus" NOT NULL DEFAULT 'not_started',
    "generated_content" TEXT,
    CONSTRAINT "LearningPathModule_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "LearningPathModule" ADD CONSTRAINT "LearningPathModule_learningPathId_fkey"
    FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearningPathModule" ADD CONSTRAINT "LearningPathModule_moduleId_fkey"
    FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ChatMessage
CREATE TABLE "ChatMessage" (
    "id"         TEXT NOT NULL,
    "userId"     TEXT NOT NULL,
    "role"       "ChatRole" NOT NULL,
    "content"    TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
