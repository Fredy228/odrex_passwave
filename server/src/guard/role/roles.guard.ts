import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoleEnum } from '../../enums/role.enum';
import { ReqProtectedType } from '../../types/protect.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles || roles.length === 0) {
      return true;
    }

    const request: ReqProtectedType = context.switchToHttp().getRequest();

    const user = request?.user;
    if (!user) return false;

    if (user.role === RoleEnum.ADMIN) return true;

    return roles.includes(user.role);
  }
}
