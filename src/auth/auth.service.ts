import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/tasks/dto/auth-creds.dto';
import { Users } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-interface.payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async getAccessToken(username: string) {
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return accessToken;
  }

  async signUp(authCredsDTO: AuthCredentialsDto): Promise<Users> {
    const { username } = authCredsDTO;
    const accessToken = await this.getAccessToken(username);
    console.log(accessToken);
    return await this.usersRepository.createUser(authCredsDTO, accessToken);
  }

  async signIn(authCredsDTO: AuthCredentialsDto): Promise<Users> {
    const { username, password } = authCredsDTO;
    const user = await this.usersRepository.findOne({ username });
    if (!user) {
      throw new NotFoundException(`User with ${username} not found`);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException(`User not authorized`);
    }
    // const payload: JwtPayload = { username };
    const accessToken = await this.getAccessToken(username);
    user.token.push(accessToken);
    await this.usersRepository.save(user);
    return user;
  }

  async getAllUsers(authCredsDTO: AuthCredentialsDto): Promise<Users[]> {
    return await this.usersRepository.find();
  }

  async getAllUserById(userId: string): Promise<Users> {
    return await this.usersRepository.findOne({ id: userId });
  }

  async deleteUserById(userId: string): Promise<void> {
    const result = await this.usersRepository.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ${userId} is not found`);
    }
  }
}
