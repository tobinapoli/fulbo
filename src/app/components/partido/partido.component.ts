import { Component } from '@angular/core';
import { Partido } from '../../models/partido.model';
// import { CommonModule } from '@angular/common'; // Descomentar si usas *ngIf, *ngFor, etc.

@Component({
  selector: 'app-partido',
  standalone: true, // <--- AÑADIDO
  imports: [/* CommonModule */], // <--- imports: [] está bien, o CommonModule si es necesario
  templateUrl: './partido.component.html',
  styleUrl: './partido.component.css'
})
export class PartidoComponent {
  partido: Partido;
  partidos: Partido[] = [];
  equiposArgentinos: string[] = [
    'Boca Juniors',
    'River Plate',
    'San Lorenzo',
    'Racing Club',
    'Independiente',
    'Vélez Sarsfield',
    'Estudiantes de La Plata',
    'Newells',
    'Rosario Central',
    'Talleres de Córdoba',
    'Atlético Tucumán',
    'Gimnasia y Esgrima La Plata',
    'Argentinos Juniors',
    'Huracán',
    'Colón de Santa Fe',
  ]
  constructor() {
    let equipoLocal = this.seleccionarEquipoAleatorio();
    let equipoVisitante = this.seleccionarEquipoAleatorio();


    this.partido = {
      equipoLocal: equipoLocal,
      equipoVisitante: equipoVisitante,
      golesLocal: 0,
      golesVisitante: 0
    };
  }

  golLocal() {
    this.partido.golesLocal++;
  }

  golVisitante() {
    this.partido.golesVisitante++;
  }
  

  private seleccionarEquipoAleatorio(): string {
    const indiceAleatorio = Math.floor(Math.random() * this.equiposArgentinos.length);
    return this.equiposArgentinos[indiceAleatorio];
  }

}
