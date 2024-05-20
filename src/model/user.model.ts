export class RegisterUserRequest {
    username: string
    password: string
    email: string
}

export class RegisterUserResponse {
    username: string
    email: string
}

export class LoginUserRequest {
    email: string
    password: string
}

export class LoginUserResponse {
    username: string
    email: string
    token: any
}