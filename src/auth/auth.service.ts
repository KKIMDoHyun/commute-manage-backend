import { Injectable } from '@nestjs/common';
import { AuthRepository } from 'src/auth/auth.repository';
import { UserSignUpDto } from 'src/auth/dto/user-signUp.dto';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<UserSignUpDto> {
    return this.authRepository.signUp(userSignUpDto);
  }
}
