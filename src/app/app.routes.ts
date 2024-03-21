import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { MapaComponent } from './mapa/mapa.component';
import { FullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { ChartsComponent } from './charts/charts.component';


export const routes: Routes = [

// Indicamos que cuando la ruta sea la raíz de la aplicación se cargue el componente welcome
{
  path: '',
  component: HomeComponent,
  pathMatch: 'full'
},

{
  path: 'home',
  component: HomeComponent
},

{
  path: 'mapa',
  component: MapaComponent,
  // canActivate: [AuthGuard]
},

{
  path: 'fullcalendar',
  component: FullcalendarComponent
},

{
  path: 'charts',
  component: ChartsComponent
},


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
