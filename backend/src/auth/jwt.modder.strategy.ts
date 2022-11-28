import { Role } from './../base/const';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ModderJwtStrategy extends PassportStrategy(Strategy, 'modder') {
  constructor(
    private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SECRETKEY,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.role !== Role.MODDER || user.role !== Role.ADMIN) throw new UnauthorizedException();
    return user;
  }
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
