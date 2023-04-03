import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSignUpDto } from 'src/auth/dto/user-signUp.dto';
import { User } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository extends Repository<User> {
  @InjectRepository(User)
  private readonly authRepository: Repository<User>;

  async findUser(email: string): Promise<boolean> {
    const foundUser = await this.authRepository.findOne({ email });
    return foundUser ? true : false;
  }

  async signUp(userSignUpDto: UserSignUpDto): Promise<User> {
    const { email, name, password, team, position } = userSignUpDto;
    const user = this.authRepository.create({
      email,
      name,
      password,
      team,
      position,
    });
    try {
      await this.authRepository.save(user);
      return user;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('해당 계정이 이미 존재합니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
