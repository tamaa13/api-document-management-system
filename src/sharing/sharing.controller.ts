import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { SharingService } from "./sharing.service";
import { WebResponse } from "../model/web.model";
import { getAllSharedDocumentRequest, ShareDocumentRequest, ShareDocumentResponse } from "src/model/sharing.model";

@Controller('api/share')
export class SharingController {
    constructor(private sharingService: SharingService) { }

    @Post()
    async shareDocument(
        @Headers('authorization') token: any,
        @Body() body: ShareDocumentRequest
    ): Promise<WebResponse<ShareDocumentResponse>> {
        const request: ShareDocumentRequest = {
            documentId: body.documentId,
            sharedWithUserIds: body.sharedWithUserIds,
            token: token.split(' ')[1]
        };

        const response = await this.sharingService.shareDocument(request);
        return { data: response };
    }

    @Get()
    async getAllSharedDocument(
        @Headers('authorization') token: string,
    ): Promise<WebResponse<any>> {
        const request: getAllSharedDocumentRequest = {
            token: token.split(' ')[1]
        }

        const response = await this.sharingService.getShareDocument(request);
        return { data: response }
    }
}