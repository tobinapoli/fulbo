import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TablaPosicionesService, Posicion } from '../../services/tabla-posiciones.service';
import { FixtureComponent } from '../fixture/fixture.component'; // Importar FixtureComponent

@Component({
  selector: 'app-tabla-posiciones',
  standalone: true,
  imports: [CommonModule, FormsModule, FixtureComponent], // Añadir FixtureComponent a imports
  templateUrl: './tabla-posiciones.component.html',
  styleUrl: './tabla-posiciones.component.css'
})
export class TablaPosicionesComponent implements OnInit {
  posicionesZonaA: Posicion[] = [];
  posicionesZonaB: Posicion[] = [];

  equipoParaSumarPuntos: string = '';
  cantidadPuntos: number = 3;
  equiposArgentinosDisponibles: string[] = [];

  constructor(
    private tablaPosicionesService: TablaPosicionesService
  ) {}

  ngOnInit(): void {
    this.actualizarPosiciones();
    this.equiposArgentinosDisponibles = this.tablaPosicionesService.getAllNombresEquipos();
  }

  actualizarPosiciones(): void {
    const posicionesPorZona = this.tablaPosicionesService.getPosiciones();
    this.posicionesZonaA = posicionesPorZona.zonaA;
    this.posicionesZonaB = posicionesPorZona.zonaB;
  }

  aplicarPuntosDesdeInput(): void {
    if (this.equipoParaSumarPuntos && this.equipoParaSumarPuntos.trim() !== '') {
      const puntosNum = Number(this.cantidadPuntos);
      if (!isNaN(puntosNum)) {
        this.tablaPosicionesService.sumarPuntos(this.equipoParaSumarPuntos.trim(), puntosNum);
        this.actualizarPosiciones();
        this.equipoParaSumarPuntos = '';
      } else {
        console.warn('La cantidad de puntos no es un número válido.');
      }
    } else {
      console.warn('El nombre del equipo no puede estar vacío.');
    }
  }

  resetearTabla(): void {
    this.tablaPosicionesService.resetearTabla();
    this.actualizarPosiciones();
  }
}
