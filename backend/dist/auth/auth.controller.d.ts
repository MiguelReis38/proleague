import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(data: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    login(data: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    resetPassword(data: {
        email: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    changePassword(req: any, data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
