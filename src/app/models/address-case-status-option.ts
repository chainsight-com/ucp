import { AddressCaseDtoStatusEnum } from "@chainsight/unblock-api-axios-sdk";

export interface AddressCaseStatusOption {
  value: AddressCaseDtoStatusEnum,
  label: string,
  color: string,
}

export const ADDRESS_CASE_STATUS_LIST: AddressCaseStatusOption[] = [
  {
    value: AddressCaseDtoStatusEnum.Open,
    label: 'Open',
    color: '#52c41a',
  },
  {
    value: AddressCaseDtoStatusEnum.InReview,
    label: 'In Review',
    color: 'blue',
  },
  {
    value: AddressCaseDtoStatusEnum.Closed,
    label: 'Closed',
    color: '#d9d9d9'
  }
];

export const ADDRESS_CASE_STATUS_MAP: { [key: string]: AddressCaseStatusOption } = ADDRESS_CASE_STATUS_LIST.reduce((map, obj) => {
  map[obj.value] = obj;
  return map;
}, {})
