import { Routes } from '@angular/router';
import { EditClientComponent } from './clients/edit-client/edit-client.component';
import { NewClientComponent } from './clients/new-client/new-client.component';
import { ListClientsComponent } from './clients/list-clients/list-clients.component';
import { SchedulesMonthComponent } from './schedules/schedules-month/schedules-month.component';

export const routes: Routes = [
    {path: 'clients/edit-client/:id', component:EditClientComponent, data: {title: 'Update customer'}},
    {path: 'clients/new-client', component:NewClientComponent, data: {title: 'Create new customer'}},
    {path: 'clients/list', component:ListClientsComponent, data: {title: 'List customers'}},
    {path: 'schedules/month', component:SchedulesMonthComponent, data: {title: 'Schedules'}},
    {path: '**', redirectTo:'schedules/month'}
];
