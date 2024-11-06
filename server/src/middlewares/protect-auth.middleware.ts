import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { CustomException } from '../services/custom-exception';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class ProtectAuthMiddleware implements NestMiddleware {
  constructor(
    private usersRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async use(req: Request & { user?: User }, _: Response, next: NextFunction) {
    const token =
      req.headers.authorization?.startsWith('Bearer') &&
      req.headers.authorization?.split(' ')[1];

    if (!token)
      throw new CustomException(HttpStatus.UNAUTHORIZED, 'Not authorized');

    let decodedToken: { id: any };
    try {
      decodedToken = await this.jwtService.verify(token);
    } catch (error) {
      console.error(error);
      throw new CustomException(HttpStatus.UNAUTHORIZED, 'Not authorized');
    }

    const currentUser = await this.usersRepository.findOne({
      where: { id: decodedToken.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: {},
        avatarUrl: true,
      },
    });
    if (!currentUser)
      throw new CustomException(HttpStatus.UNAUTHORIZED, 'Not authorized');

    req.user = currentUser;
    next();
  }
}
