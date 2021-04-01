import {AccountDto, ProjectDto} from "@profyu/unblock-ng-sdk";

export interface LoginState {
  accessToken: string;
  me: AccountDto;
}
