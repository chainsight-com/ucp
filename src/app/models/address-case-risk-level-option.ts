import {AccountDto, AddressCaseDto, ProjectDto} from "@profyu/unblock-ng-sdk";
import {ADDRESS_CASE_STATUS_LIST, AddressCaseStatusOption} from "./address-case-status-option";

export interface AddressCaseRiskLevelOption {
  value: AddressCaseDto.LevelEnum,
  label: string,
  color: string,
}

export const RISK_LEVEL_LIST: AddressCaseRiskLevelOption[] = [
  {
    value: "HIGH",
    label: 'High',
    color: '#f50',
  },
  {
    value: "MEDIUM",
    label: 'Medium',
    color: '#108ee9',
  },
  {
    value: "LOW",
    label: 'Low',
    color: '#87d068',
  }
];

export const RISK_LEVEL_MAP: { [key: string]: AddressCaseStatusOption } = RISK_LEVEL_LIST.reduce((map, obj) => {
  map[obj.value] = obj;
  return map;
}, {})
