import { Module } from "@nestjs/common";
import { SharingService } from "./sharing.service";
import { SharingController } from "./sharing.controller";
import { UserService } from "src/user/user.service";
import { DocumentService } from "src/document/document.service";

@Module({
    providers: [SharingService, UserService, DocumentService],
    controllers: [SharingController],
    exports: [SharingService]
})

export class SharingModule { }