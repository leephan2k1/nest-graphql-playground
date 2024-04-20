import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtConfig } from 'src/configs';
import { ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { AuthTypes } from 'src/common/types/auth.types';
import { IUserService } from 'src/contracts/user/IUserService';
import { ITokenRepository } from 'src/contracts/repositories/ITokenRepository';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthTypes.JWT) {
  constructor(
    @Inject(JwtConfig.KEY) private readonly jwtConf: ConfigType<typeof JwtConfig>,
    @Inject(IUserService) private readonly userService: IUserService,
  ) {
    super({
      usernameField: 'email',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConf.secret,
    });
  }

  async validate(payload: any, done: VerifiedCallback) {
    const user = await this.userService.getUserByConditions({
      email: payload.email,
    });
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, user);
  }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  AuthTypes.RefreshJwt,
) {
  constructor(
    @Inject(JwtConfig.KEY) private readonly jwtConf: ConfigType<typeof JwtConfig>,
    @Inject(ITokenRepository) private readonly tokenRepository: ITokenRepository,
  ) {
    super({
      usernameField: 'email',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConf.refreshSecret,
      passReqToCallback: true, // => we need the original refresh token to clear it in DB
    });
  }

  async validate(req: Request, payload: any, done: VerifiedCallback) {
    const rawRefreshToken = req.headers['authorization'] as string;
    const refreshToken = rawRefreshToken
      .replace('Bearer', '')
      .replace('bearer', '')
      .trim();

    if (!refreshToken || !refreshToken) {
      return done(new UnauthorizedException(), false);
    }

    const existRefreshToken = await this.tokenRepository.findByCondition({
      select: { id: true, token: true },
      where: { token: refreshToken },
      relations: { user: true },
    });

    if (!existRefreshToken) {
      return done(new UnauthorizedException(), false);
    }

    const { user } = existRefreshToken;

    //Because we use rotate refresh token Strategy 
    //So old refresh token should be remove
    await this.tokenRepository.remove(existRefreshToken);

    return done(null, user);
  }
}
