import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "src/common/prisma.service";
import { DeleteDocumentRequest, DeleteDocumentResponse, findDocumentByIdRequest, findDocumentByIdResponse, getAllDocumentsRequest, getAllDocumentsResponse, UploadDocumentRequest, UploadDocumentResponse } from "src/model/document.model";
import { Logger } from 'winston'
import * as streamifier from 'streamifier';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { ValidationService } from "../common/validation.service";
import { DocumentValidation } from "./document.validation";
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private validationService: ValidationService,
        private configService: ConfigService
    ) { }

    async upload(request: UploadDocumentRequest): Promise<UploadDocumentResponse> {
        this.logger.info(`Upload document ${JSON.stringify(request)}`);
        // console.log(request.file, "<<<<<")
        // const uploadRequest: UploadDocumentRequest = this.validationService.validate(DocumentValidation.uploadDocument, request);
        const verifToken = this.jwtService.verify(request.token, {
            secret: this.configService.get('JWT_SECRET'),
        })

        const userId = verifToken.id

        if (!verifToken) throw new HttpException('Unauthorized', 401)

        if (!request.file) throw new HttpException('File not found', 400);

        if (request.file.mimetype !== "image/jpeg" && request.file.mimetype !== "image/png" && request.file.mimetype !== "image/webp" && request.file.mimetype !== "image/jpg") throw new HttpException('File type not supported', 400);

        if (request.file.size > 1000000) throw new HttpException('Size to large', 400);


        if (!request.title) throw new HttpException('Title not found', 400);

        const upload = await new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            streamifier.createReadStream(request.file.buffer).pipe(uploadStream);
        });

        if ('secure_url' in upload) {
            const document = await this.prismaService.document.create({
                data: {
                    title: request.title,
                    userId: +userId,
                    cloudinaryUrl: upload.secure_url,
                },
            });

            return {
                title: document.title,
                userId: document.userId,
                fileUrl: document.cloudinaryUrl,
            };
        } else {
            throw new Error('File upload failed');
        }
    }

    async delete(request: DeleteDocumentRequest): Promise<DeleteDocumentResponse> {
        if (!request.documentId) {
            throw new HttpException('Document ID not found', 400);
        }

        const verifToken = this.jwtService.verify(request.token, {
            secret: this.configService.get('JWT_SECRET'),
        })

        const userId = verifToken.id

        if (!verifToken) throw new HttpException('Unauthorized', 401)

        const findDocument = await this.prismaService.document.findFirst({
            where: {
                AND: [
                    { id: +request.documentId },
                    { userId: +userId }
                ]
            }
        });

        if (!findDocument) {
            throw new HttpException('Document not found', 400);
        }

        await this.prismaService.document.delete({
            where: {
                id: +request.documentId
            }
        })

        return {
            documentId: request.documentId,
            response: `Deleted document successfully`
        }
    }

    async findDocumentById(request: findDocumentByIdRequest): Promise<findDocumentByIdResponse> {
        const findMatchDocument = await this.prismaService.document.findFirst({
            where: {
                id: +request.documentId
            }
        })

        const verifToken = this.jwtService.verify(request.token, {
            secret: this.configService.get('JWT_SECRET'),
        })

        const userId = verifToken.id

        if (!verifToken) throw new HttpException('Unauthorized', 401)

        if (!findMatchDocument) throw new HttpException('Document not found', 400);

        const findMatchUsers = await this.prismaService.document.findFirst({
            where: {
                userId: +userId
            }
        })

        if (!findMatchUsers) throw new HttpException('User not found', 400);

        const findDocument = await this.prismaService.document.findFirst({
            where: {
                AND: [
                    { id: +request.documentId },
                    { userId: +userId }
                ]
            }
        });

        if (!findDocument) throw new HttpException('Document not found', 400);

        return {
            id: findDocument.id,
            title: findDocument.title,
            fileUrl: findDocument.cloudinaryUrl
        }
    }

    async getAllDocuments(request: getAllDocumentsRequest): Promise<getAllDocumentsResponse> {
        const page = +request.page || 1;
        const limit = 5;
        const title = request.title || '';

        const verifToken = this.jwtService.verify(request.token, {
            secret: this.configService.get('JWT_SECRET'),
        })

        const userId = +verifToken.id
        if (!verifToken) throw new HttpException('Unauthorized', 401)

        if (isNaN(userId)) {
            throw new HttpException('Invalid userId provided', 400);
        }

        let filterOptions: Prisma.DocumentWhereInput = {
            userId
        };

        if (title) {
            filterOptions.title = {
                contains: title,
                mode: 'insensitive'
            };
        }

        const totalDocumentsCount = await this.prismaService.document.count({
            where: filterOptions,
        });

        if (totalDocumentsCount === 0) {
            return {
                documents: 'No documents found',
                totalPage: 0,
                currentPage: page,
                limit: limit,
            };
        }

        const totalPages = Math.ceil(totalDocumentsCount / limit);

        if (page > totalPages) {
            return {
                documents: 'No documents found',
                totalPage: 0,
                currentPage: page,
                limit: limit,
            };
        }

        const currentPage = Math.min(page, totalPages);

        const documents = await this.prismaService.document.findMany({
            where: filterOptions,
            skip: (currentPage - 1) * limit,
            take: limit
        });

        const formattedDocuments: findDocumentByIdResponse[] = documents.map(document => ({
            id: document.id,
            title: document.title,
            fileUrl: document.cloudinaryUrl,
        }));

        return {
            documents: formattedDocuments,
            totalPage: totalPages,
            currentPage: currentPage,
            limit: limit,
        };
    }


}