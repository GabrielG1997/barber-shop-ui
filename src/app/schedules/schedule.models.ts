
export interface ScheduleAppointmentMonthModel{
    year: number
    month:number
    scheduledAppointments:ClientScheduleAppointmentModel[]
}

export interface ClientScheduleAppointmentModel{
    id: string
    day:number
    startAt:Date
    endAt:Date
    clientId:number
    clientName:string
}

export interface SaveScheduleModel{
    id: string
    startAt?:Date
    endAt?:Date
    clientId?:number
}

export interface SelectClientModel{
    id:number
    name:string
}