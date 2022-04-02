import { HolderDtoLevelEnum } from "@chainsight/unblock-api-axios-sdk";
import {ADDRESS_CASE_STATUS_LIST, AddressCaseStatusOption} from "./address-case-status-option";

export interface HolderRiskLevelOption {
  value: HolderDtoLevelEnum,
  label: string,
  color: string,
}

export const RISK_LEVEL_LIST: HolderRiskLevelOption[] = [
  {
    value: HolderDtoLevelEnum.High,
    label: 'High',
    color: '#f50',
  },
  {
    value: HolderDtoLevelEnum.Medium,
    label: 'Medium',
    color: '#108ee9',
  },
  {
    value: HolderDtoLevelEnum.Low,
    label: 'Low',
    color: '#87d068',
  }
];

export const RISK_LEVEL_MAP: { [key: string]: HolderRiskLevelOption } = RISK_LEVEL_LIST.reduce((map, obj) => {
  map[obj.value] = obj;
  return map;
}, {})
