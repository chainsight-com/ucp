import { AccountDto } from "@chainsight/unblock-api-axios-sdk";


export interface LoginState {
  accessToken: string;
  me: AccountDto;
}
