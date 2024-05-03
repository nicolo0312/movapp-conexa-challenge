import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../../decorators/role-protected.decorator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const req = context.switchToHttp().getRequest();
    const user =  req.user as User;
    const validRoles: string = this.reflector.get(META_ROLES, context.getHandler())
    if(!validRoles) return true;
    if(validRoles.length === 0) return true;
    

    if(!user)
      throw new InternalServerErrorException('User not found');

    
    if(validRoles[0].toLowerCase() === user.role.toLowerCase()) return true;
    
    throw new ForbiddenException(
      `User ${user.firstname + ' ' + user.lastname} need a valid role`
    );
  }
}
