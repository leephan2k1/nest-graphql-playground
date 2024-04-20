import { applyDecorators, UseFilters, UsePipes } from '@nestjs/common';
import { InputValidationPipe } from '../pipes/inputValidation.pipe';
import { InputValidationExceptionFilter } from '../filters/inputValidationException.filter';

export function ValidateInput() {
  return applyDecorators(
    UsePipes(InputValidationPipe),
    UseFilters(InputValidationExceptionFilter),
  );
}
