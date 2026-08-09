import { Controller, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: { email: string; newPassword: string }) {
    return this.authService.resetPassword(data.email, data.newPassword);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('change-password')
  async changePassword(
    @Request() req,
    @Body() data: { currentPassword: string; newPassword: string }
  ) {
    return this.authService.changePassword(req.user.id, data.currentPassword, data.newPassword);
  }
}
