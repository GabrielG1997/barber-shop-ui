import { AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule} from '@angular/material/card';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { SERVICES_TOKEN } from '../../../services/service.token';
import { DialogManagerService } from '../../../services/dialog-manager.service';
import { ClientScheduleAppointmentModel, SaveScheduleModel, ScheduleAppointmentMonthModel, SelectClientModel } from '../../schedule.models';
import { FormControl, NgForm } from '@angular/forms';
import { IDialogManagerService } from '../../../services/idialog-manager.service';
import { YesNoDialogComponent } from '../../../commons/components/yes-no-dialog/yes-no-dialog.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { log } from 'node:console';
import { btoa } from 'node:buffer';



@Component({
  selector: 'app-schedule-calendar',
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule, 
    MatTableModule, 
    MatCardModule,
    MatIconModule, 
    MatInputModule,
    MatFormFieldModule, 
    MatTimepickerModule, 
    MatSelectModule, 
    MatPaginatorModule
  ],
  templateUrl: './schedule-calendar.component.html',
  styleUrl: './schedule-calendar.component.scss',
  providers:[
    {provide:SERVICES_TOKEN.DIALOG, useClass: DialogManagerService},
    provideNativeDateAdapter()
  ]
})
export class ScheduleCalendarComponent implements AfterViewInit, OnDestroy, OnChanges {

  _selected:Date = new Date()
  private subscription?: Subscription
  displayedColumns:string[]=['startAt','endAt','client','actions']

  dataSource!:MatTableDataSource<ClientScheduleAppointmentModel>

  addingSchedule:boolean = false
  
  newSchedule: SaveScheduleModel = {id:"",startAt:undefined, endAt:undefined, clientId:undefined}
  
  clientSelectFormControl = new FormControl()

  @Input() monthSchedule!: ScheduleAppointmentMonthModel
  @Input() clients: SelectClientModel[] = []
  @Output() onDateChange = new EventEmitter<Date>()
  @Output() onConfirmDelete = new EventEmitter<ClientScheduleAppointmentModel>()
  @Output() onScheduleClient = new EventEmitter<SaveScheduleModel>()
  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    @Inject(SERVICES_TOKEN.DIALOG) private readonly dialogManagerService:IDialogManagerService
  ){}

  get selected():Date{
    return this._selected
  }
  set selected(selected: Date) {
    if (this._selected.getTime() !== selected.getTime()) {
      this._selected = selected;
      this.onDateChange.emit(selected);
      this.buildTable();
    }
  }
  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe()
    }
  }
  ngAfterViewInit(): void {
    if(this.dataSource && this.paginator){
      this.dataSource.paginator = this.paginator
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['monthSchedule'] && this.monthSchedule){
      this.buildTable()
    }
  }
  onTimeChange(time: Date) {
    if(time){
      const endAt = new Date(time)
      endAt.setHours(time.getHours()+1)
      this.newSchedule.endAt= endAt  
    }
    
  }
  requestDelete(schedule:ClientScheduleAppointmentModel){
    console.log("RequestDelete: props -> " + schedule.startAt, schedule.endAt)
    this.subscription = this.dialogManagerService.showYesNoDialog(
      YesNoDialogComponent,{title:'Appointment Exclusion', content:'Are you sure you want to delete this appointment?'}
    ).subscribe(result => {
      if(result){
        this.onConfirmDelete.emit(schedule)
        const updatedList = this.dataSource.data.filter(c => c.id !== schedule.id)
        this.dataSource = new MatTableDataSource<ClientScheduleAppointmentModel>(updatedList)
        if(this.paginator){
          this.dataSource.paginator = this.paginator
        }
      }
    })
  }
  onSubmit(form: NgForm) 
  {
    const startAt = new Date(this._selected)
    const endAt = new Date(this._selected)
    startAt.setHours(this.newSchedule.startAt!.getHours(),this.newSchedule.startAt!.getMinutes())
    endAt.setHours(this.newSchedule.endAt!.getHours(),this.newSchedule.endAt!.getMinutes())
    const id =`${this.newSchedule.clientId}_D${startAt.getDate()}H${startAt.getHours()}M${startAt.getMinutes()}`
    const saved: ClientScheduleAppointmentModel ={
      id,
      clientId: this.newSchedule.clientId!,
      clientName: this.clients.find(c=> c.id === this.newSchedule.clientId!)!.name,
      day: this._selected.getDay(),
      endAt,
      startAt
    }
    this.monthSchedule.scheduledAppointments.push(saved)
    console.log(saved)
    this.onScheduleClient.emit(saved)
    this.buildTable()
    form.resetForm()
    this.newSchedule = {id:"", startAt:undefined, endAt:undefined, clientId:undefined}
  }
  private buildTable(){
    console.log('buildTable executed')
    const appointments = this.monthSchedule.scheduledAppointments.filter(
      a => this.monthSchedule.year === this._selected.getFullYear() && 
      this.monthSchedule.month -1 === this._selected.getMonth() 
       &&
       a.day === this._selected.getDate()
      )
    this.dataSource = new MatTableDataSource<ClientScheduleAppointmentModel>(appointments)
    if(this.paginator){
      this.dataSource.paginator = this.paginator
    }
  }
}
