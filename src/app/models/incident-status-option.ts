import {AccountDto, AddressCaseDto, ProjectDto} from "@profyu/unblock-ng-sdk";

export interface IncidentStatusOption {
  value: AddressCaseDto.StatusEnum,
  label: string,
  color: string,
}

export const INCIDENT_STATUS_LIST: IncidentStatusOption[] = [
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

export const INCIDENT_STATUS_MAP: { [key: string]: IncidentStatusOption } = INCIDENT_STATUS_LIST.reduce((map, obj) => {
  map[obj.value] = obj;
  return map;
}, {})
