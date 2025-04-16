import { AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'
import {MatIconModule} from '@angular/material/icon'
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator'
import {ClientModelTable } from '../../client.models';
import { Subscription } from 'rxjs';
import { SERVICES_TOKEN } from '../../../services/service.token';
import { IDialogManagerService } from '../../../services/idialog-manager.service';
import { DialogManagerService } from '../../../services/dialog-manager.service';
import { YesNoDialogComponent } from '../../../commons/components/yes-no-dialog/yes-no-dialog.component';
import { CustomPaginator } from './custom-pagination';
@Component({
  selector: 'app-client-table',
  imports: [MatTableModule, MatIconModule, MatPaginatorModule],
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.scss',
  providers:[
    {provide: SERVICES_TOKEN.DIALOG, useClass: DialogManagerService},
    {provide: MatPaginator, useClass: CustomPaginator}
  ]
})
export class ClientTableComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() clients: ClientModelTable[] =[]

  datasource!: MatTableDataSource<ClientModelTable>
  @ViewChild(MatPaginator) paginator!: MatPaginator

  displayedColumns:string[] = ['name','email','cellphone','actions']

  private dialogManagerServiceSubscriptions?: Subscription
  @Output() onConfirmDelete = new EventEmitter<ClientModelTable>()
  @Output() onConfirmUpdate = new EventEmitter<ClientModelTable>()

  constructor(@Inject(SERVICES_TOKEN.DIALOG) readonly dialogManagerService : IDialogManagerService){}
  
  
  ngAfterViewInit(): void {
    this.datasource.paginator = this.paginator
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['clients'] && this.clients){
      this.datasource = new MatTableDataSource<ClientModelTable>(this.clients)
      if(this.paginator){
        this.datasource.paginator = this.paginator
      }
    }
  }
  ngOnDestroy(): void {
    if(this.dialogManagerServiceSubscriptions){
      this.dialogManagerServiceSubscriptions?.unsubscribe()
    }
  }

  updateClient(client: ClientModelTable) {
    this.dialogManagerService.showYesNoDialog(YesNoDialogComponent,{title:'Update Prompt',content:`Are you sure you want to Update ${client.name}?`})
    .subscribe( result => {
      if(result){
        this.onConfirmUpdate.emit(client)
        
      }
    })
  }
  deleteClient(client: ClientModelTable) {
    this.dialogManagerService.showYesNoDialog(YesNoDialogComponent,{title:'Delete Prompt',content:`Are you sure you want to delete ${client.name}?`})
    .subscribe( result => {
      if(result){
        this.onConfirmDelete.emit(client)
        const updatedList = this.datasource.data.filter(c => c.id !== client.id)
        this.datasource = new MatTableDataSource<ClientModelTable>(updatedList)
      }
    })
  }
  formatCellphone(phone: string)  {
    return `(${phone.substring(0,2)}) - ${phone.substring(2,7)}`
  }

}
