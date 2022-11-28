import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserJwt extends AuthGuard('jwt') { }
export class AdminJwt extends AuthGuard('admin') { }
export class ModderJwt extends AuthGuard('modder') { }
