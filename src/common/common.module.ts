import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserService } from 'src/user/user.service';

@Global()
@Module({
    imports: [
        WinstonModule.forRoot({
            format: winston.format.json(),
            transports: [new winston.transports.Console()]
        }),
        ConfigModule.forRoot({
            isGlobal: true
        })
    ],
    providers: [PrismaService, ValidationService, JwtService, CloudinaryService, UserService,
        {
            provide: APP_FILTER,
            useClass: ErrorFilter
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
    ],
    exports: [PrismaService, ValidationService, JwtService, CloudinaryService, UserService, JwtService]
})
export class CommonModule { }