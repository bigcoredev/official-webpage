import type { AttendanceLocation, AttendanceStatus } from '../enums'
import type { RosterListItem } from './roster'

type AttendanceBasic = {
  id: number
  response: AttendanceStatus
  result: AttendanceStatus
  location: AttendanceLocation
  reason?: string
}

export interface AttendanceListItem extends AttendanceBasic {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Roster: RosterListItem
}

export interface AttendanceList {
  attendances: AttendanceListItem[]
  total: number
}
