import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { getAllSharedDocumentRequest, ShareDocumentRequest } from "../model/sharing.model";
import { Logger } from 'winston';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SharingService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async shareDocument(request: ShareDocumentRequest): Promise<any> {
        this.logger.info(`Share document ${JSON.stringify(request)}`);

        const verifToken = this.jwtService.verify(request.token, {
            secret: this.configService.get('JWT_SECRET'),
        })

        if (!verifToken) throw new HttpException('Unauthorized', 401)
        const users = [...request.sharedWithUserIds]
        const sharedUserIds = users
            .filter((user) => typeof user === 'string' && user !== ',' || typeof user === 'number')
            .map((user) => typeof user === 'string' ? Number(user) : user);

        if (!request.documentId || !request.sharedWithUserIds) throw new HttpException('Document ID or sharedWithUserIds not found', 400);

        if (!Array.isArray(sharedUserIds)) throw new HttpException('sharedWithUserIds must be an array', 400);

        const findDocument = await this.prismaService.document.findFirst({
            where: { id: +request.documentId }
        });

        if (!findDocument) throw new HttpException('Document not found', 400);

        const findUsers = await this.prismaService.user.findMany({
            where: {
                id: {
                    in: sharedUserIds
                }
            }
        });

        if (!findUsers.length) {
            throw new HttpException('User not found', 400);
        }

        const createShared = [
            ...sharedUserIds.map((user) => ({
                sharedWithUserId: +user,
                documentId: +request.documentId
            })),
        ]

        const sharedDocument = await this.prismaService.sharing.createMany({
            data: createShared
        })

        return {
            totalShared: sharedDocument,
            createdShared: createShared
        }
    }

    async getShareDocument(request: getAllSharedDocumentRequest): Promise<any> {
        this.logger.info(`Get share document ${JSON.stringify(request)}`);

        const verifToken = this.jwtService.verify(request.token, {
            secret: this.configService.get('JWT_SECRET'),
        })

        if (!verifToken) throw new HttpException('Unauthorized', 401)

        const userId = +verifToken.id

        const response = await this.prismaService.sharing.findMany({
            where: {
                sharedWithUserId: userId
            },
            include: {
                document: true
            }
        })

        if (!response.length) return 'No shared document found'

        return {
            sharedWithUsers: response
        }
    }
}
