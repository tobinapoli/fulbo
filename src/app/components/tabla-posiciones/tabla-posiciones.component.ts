import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common'; // Descomentar si usas *ngIf, *ngFor, etc.

@Component({
  selector: 'app-tabla-posiciones',
  standalone: true, // <--- AÑADIDO
  imports: [/* CommonModule */], // <--- imports: [] está bien, o CommonModule si es necesario
  templateUrl: './tabla-posiciones.component.html',
  styleUrl: './tabla-posiciones.component.css'
})
export class TablaPosicionesComponent {

}
