import { PipeTransform } from '@nestjs/common';
import { User } from '../../graphql/models/user.model';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { FindOptionsSelect } from 'typeorm';

export class BuilderSelectUserPipe implements PipeTransform {
  transform(value: any): FindOptionsSelect<User> {
    const userRequest = parseResolveInfo(value, { deep: true }).fieldsByTypeName?.User;

    const selectUserOptions: FindOptionsSelect<User> = {
      id: !!userRequest['id'],
      displayName: !!userRequest['displayName'],
      userName: !!userRequest['userName'],
    };

    if (userRequest['settings']) {
      const userSettingsRequest = userRequest['settings'].fieldsByTypeName?.UserSetting;
      selectUserOptions.settings = {
        userId: !!userSettingsRequest['userId'],
        receiveEmails: !!userSettingsRequest['receiveEmails'],
        receiveNotifications: !!userSettingsRequest['receiveNotifications'],
      };
    }

    return selectUserOptions;
  }
}
