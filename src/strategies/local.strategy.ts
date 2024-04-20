import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string) {
    console.log('test')
    // const user = this.authService.validateUser(email, password);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
  }
}
