import { registerEnumType } from '@nestjs/graphql';

export enum ResponseStatus {
  'Success' = 'success',
  'Error' = 'error',
  'Pending' = 'pending',
}

registerEnumType(ResponseStatus, {
  name: 'ResponseStatus',
});
