import { PipeTransform } from '@nestjs/common';
import { User } from '../../graphql/models/user.model';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import { FindOptionsSelect } from 'typeorm';
import { UserActionsEnum } from '../../graphql/types/enums/actionEnums';

export class BuilderSelectUserPipe implements PipeTransform {
  transform(value: any): FindOptionsSelect<User> {
    const queryInfo = parseResolveInfo(value, { deep: true });

    let userRequest:
      | ResolveTree
      | {
          [str: string]: ResolveTree;
        };

    // single query info
    if (queryInfo.alias === UserActionsEnum.User) {
      userRequest = queryInfo.fieldsByTypeName?.User;
    }
    // pagination info
    else {
      userRequest =
        queryInfo.fieldsByTypeName?.UserPage['docs']?.fieldsByTypeName?.User;
    }

    const selectUserOptions: FindOptionsSelect<User> = {
      id: !!userRequest['id'],
      email: !!userRequest['email'],
      displayName: !!userRequest['displayName'],
      userName: !!userRequest['userName'],
      createdAt: !!userRequest['createdAt'],
      updatedAt: !!userRequest['updatedAt'],
    };

    if (userRequest['settings']) {
      const userSettingsRequest =
        userRequest['settings'].fieldsByTypeName?.UserSetting;
      selectUserOptions.settings = {
        id: !!userSettingsRequest['id'],
        userId: !!userSettingsRequest['userId'],
        receiveEmails: !!userSettingsRequest['receiveEmails'],
        receiveNotifications: !!userSettingsRequest['receiveNotifications'],
        createdAt: !!userSettingsRequest['createdAt'],
        updatedAt: !!userSettingsRequest['updatedAt'],
      };
    }

    return selectUserOptions;
  }
}
