import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginUserRequest, LoginUserResponse, RegisterUserRequest, RegisterUserResponse } from "../model/user.model";
import { WebResponse } from "../model/web.model";
import { Public } from "../common/public.decorator";

@Public()
@Controller('api/users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('register')
    async register(@Body() request: RegisterUserRequest): Promise<WebResponse<RegisterUserResponse>> {
        const result = await this.userService.register(request)

        return {
            data: result
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() request: LoginUserRequest): Promise<WebResponse<LoginUserResponse>> {
        const result = await this.userService.login(request)

        return {
            data: result
        }
    }
}