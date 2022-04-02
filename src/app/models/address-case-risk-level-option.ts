import { AddressCaseDtoLevelEnum } from "@chainsight/unblock-api-axios-sdk";
import {ADDRESS_CASE_STATUS_LIST, AddressCaseStatusOption} from "./address-case-status-option";

export interface AddressCaseRiskLevelOption {
  value: AddressCaseDtoLevelEnum,
  label: string,
  color: string,
}

export const RISK_LEVEL_LIST: AddressCaseRiskLevelOption[] = [
  {
    value: AddressCaseDtoLevelEnum.High,
    label: 'High',
    color: '#f50',
  },
  {
    value: AddressCaseDtoLevelEnum.Medium,
    label: 'Medium',
    color: '#108ee9',
  },
  {
    value: AddressCaseDtoLevelEnum.Low,
    label: 'Low',
    color: '#87d068',
  }
];

export const RISK_LEVEL_MAP: { [key: string]: AddressCaseStatusOption } = RISK_LEVEL_LIST.reduce((map, obj) => {
  map[obj.value] = obj;
  return map;
}, {})
