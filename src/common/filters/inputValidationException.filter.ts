import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { InputValidationException } from '../exceptions/inputValidation.exception';
import { InvalidInputError } from 'src/graphql/types/dtos/invalidInput.error';

@Catch(InputValidationException)
export class InputValidationExceptionFilter implements GqlExceptionFilter {
  catch(exception: InputValidationException, host: ArgumentsHost) {
    const { errors } = exception;
    const resp = new InvalidInputError(errors);
    return [resp];
  }
}
