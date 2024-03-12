import type { ScheduleType } from '../enums'

type ScheduleBasic = {
  id: number
  name: string
  startedAt: string
  endedAt: string
  type: ScheduleType
  description: string
}

export interface Schedule extends ScheduleBasic {}
