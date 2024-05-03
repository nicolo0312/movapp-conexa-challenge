import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

export class ErrorHandler {
  handleDBErrors(error: any): never {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException('Resource already exists');
    }

    throw new InternalServerErrorException('Please try again later');
  }
}
