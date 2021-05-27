import { AuthCredentialsDto } from 'src/tasks/dto/auth-creds.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Users } from './user.entity';
import { v1 as uuid } from 'uuid';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  async createUser(
    authCredsDTO: AuthCredentialsDto,
    token: string,
  ): Promise<Users> {
    const { username, password } = authCredsDTO;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({
      username,
      password: hashedPassword,
      token: [],
    });
    const newlyAddedUser = user;
    newlyAddedUser.token.push(token);

    try {
      const savedUser = await this.save(newlyAddedUser);
      return savedUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`User has already been added`);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
}
