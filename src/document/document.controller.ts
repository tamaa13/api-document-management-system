import { Controller, Post, UseInterceptors, UploadedFile, Body, Delete, Param, Query, Get, Headers } from '@nestjs/common';
import { DocumentService } from './document.service';
import { WebResponse } from 'src/model/web.model';
import { DeleteDocumentRequest, DeleteDocumentResponse, findDocumentByIdResponse, getAllDocumentsRequest, getAllDocumentsResponse, UploadDocumentRequest, UploadDocumentResponse } from 'src/model/document.model';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Get()
    async getAllDocuments(
        @Headers('authorization') token: any,
        @Query('page') page: number,
        @Query('title') title?: string
    ): Promise<WebResponse<getAllDocumentsResponse>> {
        const request: getAllDocumentsRequest = {
            token: token.split(' ')[1],
            page,
            title
        }
        console.log(token)
        const response = await this.documentService.getAllDocuments(request);
        return { data: response };
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadDocument(
        @UploadedFile() file: Express.Multer.File,
        @Headers('authorization') token: any,
        @Body() body: { userId: number; title: string }
    ): Promise<WebResponse<UploadDocumentResponse>> {
        const request: UploadDocumentRequest = {
            title: body.title,
            file: file as Express.Multer.File,
            token: token.split(' ')[1]
        };
        const response = await this.documentService.upload(request);
        return { data: response };
    }


    @Get(':documentId')
    async findDocumentById(
        @Param('documentId') documentId: number,
        @Headers('authorization') token: any,
    ): Promise<WebResponse<findDocumentByIdResponse>> {
        const request = {
            documentId,
            token: token.split(' ')[1],
        }
        const response = await this.documentService.findDocumentById(request);
        return { data: response };
    }

    @Delete(':documentId')
    async deleteDocument(
        @Headers('authorization') token: any,
        @Param('documentId') documentId: number,
    ): Promise<WebResponse<DeleteDocumentResponse>> {
        const request: DeleteDocumentRequest = {
            documentId,
            token : token.split(' ')[1],
        };
        const response = await this.documentService.delete(request);
        return { data: response };
    }

}
