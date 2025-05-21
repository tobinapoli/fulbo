import { Routes } from '@angular/router';
import { PartidoComponent } from './components/partido/partido.component';
import { TablaPosicionesComponent } from './components/tabla-posiciones/tabla-posiciones.component';

export const routes: Routes = [
    { path: '', redirectTo: '/partido', pathMatch: 'full' },// Ruta por defecto
    { path: 'partido', component: PartidoComponent },
    { path: 'tabla-posiciones', component: TablaPosicionesComponent },
];
