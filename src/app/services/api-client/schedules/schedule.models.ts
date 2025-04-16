export interface ScheduleAppointmentMonthResponse{
    year:number
    month:number
    scheduledAppointments: ClientScheduleAppointmentResponse[]
}
export interface ClientScheduleAppointmentResponse{
    id:number
    day:number
    startAt:Date
    endAt:Date
    clientId:number
    clientName:string
}

export interface SaveScheduleRequest{
    id?:number
    startAt:Date
    endAt:Date
    clientId:number
}
export interface SaveScheduleResponse{
    startAt:Date
    endAt:Date
    clientId:number
}