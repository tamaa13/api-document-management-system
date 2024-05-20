import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule { }