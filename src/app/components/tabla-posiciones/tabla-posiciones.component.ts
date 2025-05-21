import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- IMPORTAR FormsModule

@Component({
  selector: 'app-tabla-posiciones',
  standalone: true,
  imports: [CommonModule, FormsModule], // <--- AÑADIR FormsModule
  templateUrl: './tabla-posiciones.component.html',
  styleUrl: './tabla-posiciones.component.css'
})
export class TablaPosicionesComponent {
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
  ];
  posiciones: { equipo: string, puntos: number }[] = [];

  // Nuevas propiedades para los inputs
  equipoParaSumarPuntos: string = '';
  cantidadPuntos: number = 3; // Por defecto 3 puntos

  constructor() {
    this.iniciarTablaPosiciones();
    this.ordenarTabla();
  }

  iniciarTablaPosiciones() {
    this.equiposArgentinos.forEach(equipo => {
      this.posiciones.push({ equipo: equipo, puntos: 0 });
    });
  }

  sumarPuntos(equipo: string, puntos: number) {
    const posicion = this.posiciones.find(pos => pos.equipo.toLowerCase() === equipo.toLowerCase());
    if (posicion) {
      posicion.puntos += puntos;
      this.ordenarTabla(); // <--- Reordenar la tabla después de sumar puntos
    } else {
      console.warn(`Equipo "${equipo}" no encontrado para sumar puntos.`);
      // Podrías considerar mostrar un mensaje al usuario aquí
    }
  }

  // Nuevo método para ser llamado desde el botón
  aplicarPuntosDesdeInput() {
    if (this.equipoParaSumarPuntos && this.equipoParaSumarPuntos.trim() !== '') {
      // Validar que la cantidad de puntos sea un número
      const puntosNum = Number(this.cantidadPuntos);
      if (!isNaN(puntosNum)) {
        this.sumarPuntos(this.equipoParaSumarPuntos.trim(), puntosNum);
        this.equipoParaSumarPuntos = ''; // Limpiar el input del equipo
        // this.cantidadPuntos = 3; // Resetear los puntos si quieres
      } else {
        console.warn('La cantidad de puntos no es un número válido.');
        // Mensaje al usuario
      }
    } else {
      console.warn('El nombre del equipo no puede estar vacío.');
      // Mensaje al usuario
    }
  }

  ordenarTabla() {
    this.posiciones.sort((a, b) => {
      if (b.puntos !== a.puntos) {
        return b.puntos - a.puntos;
      }
      return a.equipo.localeCompare(b.equipo);
    });
  }

  resetearTabla() {
    this.posiciones.forEach(pos => pos.puntos = 0);
    this.ordenarTabla();
  }
}
