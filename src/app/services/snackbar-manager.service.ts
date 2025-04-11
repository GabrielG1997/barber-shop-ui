import { Inject, Injectable } from '@angular/core';
import { ISnackbarManagerService } from './isnackbar-manager.service';
import {MatSnackBar} from '@angular/material/snack-bar'
import { SERVICES_TOKEN } from './service.token';
@Injectable({
  providedIn: 'root'
})
export class SnackbarManagerService implements ISnackbarManagerService{
  constructor(
    private readonly snackBar: MatSnackBar
  ) { }
  show(message: string, action: string = 'close', duration: number =3000): void {
    this.snackBar.open(message,action,{duration: duration, verticalPosition:'top', horizontalPosition:'right'})
  }
}
