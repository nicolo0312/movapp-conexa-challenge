import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        
        const req = ctx.switchToHttp().getRequest();
        const user = data ? req.user[data]: req.user;
        
        if(!user)
            throw new InternalServerErrorException('User not found')

        return user

    }
)