import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button'
import{MatMenuModule} from '@angular/material/menu'
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  imports: [MatButtonModule, MatMenuModule],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss'
})
export class MenuBarComponent {
constructor(private readonly router:Router){}

navigateTo(path: string) {
  this.router.navigate([path])
}

}
