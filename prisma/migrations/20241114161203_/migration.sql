-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "overallSentiment" TEXT,
ADD COLUMN     "scores" JSONB;
