import {AccountDto, AddressCaseDto, HolderDto, ProjectDto} from "@profyu/unblock-ng-sdk";
import {ADDRESS_CASE_STATUS_LIST, AddressCaseStatusOption} from "./address-case-status-option";

export interface HolderRiskLevelOption {
  value: HolderDto.LevelEnum,
  label: string,
  color: string,
}

export const RISK_LEVEL_LIST: HolderRiskLevelOption[] = [
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

export const RISK_LEVEL_MAP: { [key: string]: HolderRiskLevelOption } = RISK_LEVEL_LIST.reduce((map, obj) => {
  map[obj.value] = obj;
  return map;
}, {})
