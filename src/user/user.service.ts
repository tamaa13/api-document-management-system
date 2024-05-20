import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { LoginUserRequest, LoginUserResponse, RegisterUserRequest, RegisterUserResponse } from "../model/user.model";
import { Logger } from "winston";
import { UserValidation } from "./user.validation";
import * as bcrypt from 'bcryptjs'
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private jwtService: JwtService, 
        @Inject(ConfigService) private configService: ConfigService
    ) {

    }
    async register(request: RegisterUserRequest): Promise<RegisterUserResponse> {
        this.logger.info(`Register new user ${JSON.stringify(request)}`)
        const registerRequest: RegisterUserRequest = this.validationService.validate(UserValidation.REGISTER, request)

        const totalUserWithSameUsername = await this.prismaService.user.count({
            where: {
                username: registerRequest.username
            }
        })

        const totalUserWithSameEmail = await this.prismaService.user.count({
            where: {
                email: registerRequest.email
            }
        })

        if (totalUserWithSameEmail != 0 || totalUserWithSameUsername != 0) {
            throw new HttpException("Username or Email already exists", 400)
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10)

        const user = await this.prismaService.user.create({
            data: registerRequest
        })

        return {
            username: user.username,
            email: user.email
        }
    }

    async login(request: LoginUserRequest): Promise<LoginUserResponse> {
        this.logger.info(`Login user ${JSON.stringify(request)}`)

        const loginUserRequest: LoginUserRequest = this.validationService.validate(UserValidation.LOGIN, request)

        const user = await this.prismaService.user.findUnique({
            where: {
                email: loginUserRequest.email
            }
        })

        if (!user) {
            throw new HttpException("User not found", 400)
        }

        if (!await bcrypt.compare(loginUserRequest.password, user.password)) {
            throw new HttpException("Wrong password", 400)
        }

        const payload = { id: user.id, username: user.username, email: user.email }
        return {
            username: user.username,
            email: user.email,
            token: this.jwtService.sign(payload, { expiresIn: '1d', secret: this.configService.get('JWT_SECRET') })
        }
    }

    async getUsers(headers: any): Promise<any> {
        this.logger.info(`Get all users ${JSON.stringify(headers)}`)

        return await this.prismaService.user.findMany()
    }
}