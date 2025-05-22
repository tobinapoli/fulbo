import { Component } from '@angular/core';
import { Partido } from '../../models/partido.model';
import { CommonModule } from '@angular/common'; // <--- IMPORTANTE

@Component({
  selector: 'app-fecha',
  standalone: true, // <--- ASEGÚRATE DE ESTO
  imports: [CommonModule], // <--- Y ESTO
  templateUrl: './fecha.component.html',
  styleUrl: './fecha.component.css'
})
export class FechaComponent {
  fechaPartido: Date = new Date();
  partidos: Partido[] = [];

    
}
