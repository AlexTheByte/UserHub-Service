import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FindOptionsWhere, In, Like } from 'typeorm';
import { User } from './entities/user.entity';

function decrypt(findOptionsWhere: FindOptionsWhere<User>) {
  const optionsDecrypted = {};

  for (const option in findOptionsWhere) {
    let Type = null;

    if (!!findOptionsWhere[option]['_type']) {
      switch (findOptionsWhere[option]['_type']) {
        case 'in':
          Type = In;
          break;

        case 'like':
          Type = Like;
          break;

        default:
          throw new Error('Where type unknown');
      }
      optionsDecrypted[option] = Type(findOptionsWhere[option]['_value']);
      continue;
    }

    optionsDecrypted[option] = findOptionsWhere[option];
  }

  return optionsDecrypted;
}

export const UsersRpcParam = createParamDecorator((data: any, ctx: ExecutionContext) => {
  return decrypt(ctx.getArgByIndex(0));
});
