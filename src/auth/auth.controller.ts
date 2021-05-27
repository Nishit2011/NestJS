import { Delete, Get, Patch, UsePipes } from '@nestjs/common';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/tasks/dto/auth-creds.dto';
import { AuthService } from './auth.service';
import { Users } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  createUser(@Body() authUserDto: AuthCredentialsDto): Promise<Users> {
    return this.authService.signUp(authUserDto);
  }

  @Get()
  getAllUser(authUserDto: AuthCredentialsDto): Promise<Users[]> {
    return this.authService.getAllUsers(authUserDto);
  }

  @Get(':id')
  getAllUserById(userId: string): Promise<Users> {
    return this.authService.getAllUserById(userId);
  }

  @Delete(':id')
  deleteUserById(userId: string): Promise<void> {
    return this.authService.deleteUserById(userId);
  }

  @Post('signin')
  signIn(@Body() authUserDto: AuthCredentialsDto): Promise<Users> {
    return this.authService.signIn(authUserDto);
  }

  //   @Patch(':id')
  //   updateUserById(userId: string): Promise<Users> {
  //     return this.authService.updateUserById(userId);
  //   }
}
