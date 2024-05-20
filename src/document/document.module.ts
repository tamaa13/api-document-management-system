import { Module } from "@nestjs/common";
import { DocumentService } from "./document.service";
import { DocumentController } from "./document.controller";
import { CloudinaryProvider } from "../cloudinary/cloudinary/cloudinary.provider";

@Module({
    providers: [DocumentService, CloudinaryProvider],
    controllers: [DocumentController],
    exports: [DocumentService, CloudinaryProvider]
})
export class DocumentModule { }