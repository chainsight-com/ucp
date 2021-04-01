import {AccountDto, AddressCaseDto, ProjectDto} from "@profyu/unblock-ng-sdk";

export interface AddressCaseStatusOption {
  value: AddressCaseDto.StatusEnum,
  label: string,
  color: string,
}

export const ADDRESS_CASE_STATUS_LIST: AddressCaseStatusOption[] = [
  {
    value: "OPEN",
    label: 'Open',
    color: '#52c41a',
  },
  {
    value: "IN_REVIEW",
    label: 'In Review',
    color: 'blue',
  },
  {
    value: "CLOSED",
    label: 'Closed',
    color: '#d9d9d9'
  }
];

export const ADDRESS_CASE_STATUS_MAP: { [key: string]: AddressCaseStatusOption } = ADDRESS_CASE_STATUS_LIST.reduce((map, obj) => {
  map[obj.value] = obj;
  return map;
}, {})
