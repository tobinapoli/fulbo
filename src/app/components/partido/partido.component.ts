import { Component } from '@angular/core';
import { Partido } from '../../models/partido.model';

@Component({
  selector: 'app-partido',
  imports: [],
  templateUrl: './partido.component.html',
  styleUrl: './partido.component.css'
})
export class PartidoComponent {
  partido: Partido;
  constructor() {
    this.partido = {
      equipoLocal: 'Equipo Local',
      equipoVisitante: 'Equipo Visitante',
      golesLocal: 0,
      golesVisitante: 0
    };
  }
  
}
