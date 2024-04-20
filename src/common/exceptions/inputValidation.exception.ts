import { InputError } from 'src/graphql/types/dtos/invalidInput.error';

export class InputValidationException extends Error {
  errors: InputError[];

  constructor(errors: InputError[]) {
    super();
    this.errors = errors;
  }
}
