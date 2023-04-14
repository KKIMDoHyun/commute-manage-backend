import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findUserByEmail(email);
  }
  async findUserById(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      '사용자가 존재하지 않습니다.',
      HttpStatus.NOT_FOUND,
    );
  }
}
