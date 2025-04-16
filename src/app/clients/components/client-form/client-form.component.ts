import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClientModelForm } from '../../client.models';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import{ MatInputModule } from '@angular/material/input';
import{ MatFormFieldModule } from '@angular/material/form-field';
import{ MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-client-form',
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    NgxMaskDirective
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent {
  @Input() client: ClientModelForm = {id:0, name:'', email:'', cellphone:''}

  @Output() clientSubmitted = new EventEmitter<ClientModelForm>();

  onSubmit(_:NgForm){
    this.clientSubmitted.emit(this.client)
  }
}
