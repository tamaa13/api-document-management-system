-- DropForeignKey
ALTER TABLE "Sharing" DROP CONSTRAINT "Sharing_documentId_fkey";

-- AddForeignKey
ALTER TABLE "Sharing" ADD CONSTRAINT "Sharing_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
