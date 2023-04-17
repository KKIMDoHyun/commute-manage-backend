import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async updateRefreshToken(id: number, token: any) {
    await this.userRepository.update(id, token);
  }

  async getUserList(): Promise<{ id: number }[]> {
    const userList = await this.userRepository.find({
      select: ['id'],
    });
    return userList;
  }
}
