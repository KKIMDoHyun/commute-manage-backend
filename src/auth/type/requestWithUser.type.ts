import { Request } from 'express';
import { User } from 'src/auth/entity/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}
