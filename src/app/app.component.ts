import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CardHeaderComponent } from "./commons/components/card-header/card-header.component";
import { filter, map, Subscribable, Subscription } from 'rxjs';
import { MenuBarComponent } from './commons/components/menu-bar/menu-bar.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CardHeaderComponent, MenuBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title:string=''
  private routeSubscription?:Subscription 
  constructor(
    private readonly router:Router,
    private readonly activatedRoute:ActivatedRoute
  ){}
  ngOnInit(): void {
    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(()=> this.getRouteTitle(this.activatedRoute))
    ).subscribe(title => this.title = title)
  }
  private getRouteTitle(route: ActivatedRoute):string{
    let child = route
    while(child.firstChild){
      child = child.firstChild
    }
    return child.snapshot.data['title'] || 'Default Title'
  }
  ngOnDestroy(): void {
    if(this.routeSubscription){
      this.routeSubscription.unsubscribe()
    }
  }
}
