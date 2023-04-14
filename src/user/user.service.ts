import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findUserByEmail(email);
  }
}
