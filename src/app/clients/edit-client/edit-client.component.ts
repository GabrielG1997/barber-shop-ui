import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientModelForm } from '../client.models';
import { ClientsService } from '../../services/api-client/clients/clients.service';
import { IClientService } from '../../services/api-client/clients/iclients.service';
import { SERVICES_TOKEN } from '../../services/service.token';
import {ClientFormComponent} from '../components/client-form/client-form.component'
import { SnackbarManagerService } from '../../services/snackbar-manager.service';
import { ISnackbarManagerService } from '../../services/isnackbar-manager.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-edit-client',
  imports: [ClientFormComponent],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.scss',
  providers:[
    {provide: SERVICES_TOKEN.HTTP.CLIENT, useClass: ClientsService},
    {provide: SERVICES_TOKEN.SNACKBAR, useClass: SnackbarManagerService}

  ]
})
export class EditClientComponent implements OnInit, OnDestroy {
  private httpSubscriptions:Subscription[] =[]
  
  client: ClientModelForm = {id:0, name:'', email:'', cellphone:''}

  constructor(
    @Inject(SERVICES_TOKEN.HTTP.CLIENT)private readonly httpService: IClientService,
    @Inject(SERVICES_TOKEN.SNACKBAR)private readonly snackbarManager: ISnackbarManagerService,
    private readonly activatedRoute:ActivatedRoute,
    private readonly router:Router
  ){}
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    if(!id){
      this.snackbarManager.show('Error retrieving customer data')
      this.router.navigate(['clients/list'])
      return
    }
    this.httpSubscriptions.push(this.httpService.findById(Number(id)).subscribe(data => this.client = data))
  }
  ngOnDestroy(): void {
    this.httpSubscriptions?.forEach(data => data.unsubscribe())
  }
  onSubmitClient(value: ClientModelForm) {
    const {id, ...request } = value
    if(id){
      this.httpSubscriptions?.push(this.httpService.update(id,request).subscribe(_ => {
        this.snackbarManager.show('User updated')
        this.router.navigate(['clients/list'])
      }))
      return
    }
    this.snackbarManager.show('Error occured trying to updated user')
    this.router.navigate(['clients/list'])

  }
}
