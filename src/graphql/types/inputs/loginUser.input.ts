import { InputType, PickType } from '@nestjs/graphql';
import { RegisterUserInput } from './registerUser.input';

@InputType()
export class LoginUserInput extends PickType(RegisterUserInput, ['email', 'password']) {}
