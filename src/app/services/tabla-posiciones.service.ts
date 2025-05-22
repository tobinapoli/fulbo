import { Injectable } from '@angular/core';
import { EQUIPOS_ZONA_A, EQUIPOS_ZONA_B } from '../data/equipos.data';
import { Equipo } from '../models/equipo.model'; // <--- IMPORTAR Equipo

export interface Posicion {
  equipo: Equipo; // <--- Cambiado de string a Equipo
  puntos: number;
  zona: 'A' | 'B';
}

@Injectable({
  providedIn: 'root'
})
export class TablaPosicionesService {
  private _posiciones: Posicion[] = [];

  constructor() {
    this.iniciarTablaPosiciones();
  }

  private iniciarTablaPosiciones(): void {
    this._posiciones = [];
    EQUIPOS_ZONA_A.forEach(equipoObj => { // <--- equipoObj es ahora un objeto Equipo
      this._posiciones.push({ equipo: equipoObj, puntos: 0, zona: 'A' });
    });
    EQUIPOS_ZONA_B.forEach(equipoObj => { // <--- equipoObj es ahora un objeto Equipo
      this._posiciones.push({ equipo: equipoObj, puntos: 0, zona: 'B' });
    });
    this.ordenarTabla();
  }

  private ordenarTabla(): void {
    this._posiciones.sort((a, b) => {
      if (b.puntos !== a.puntos) {
        return b.puntos - a.puntos;
      }
      return a.equipo.nombre.localeCompare(b.equipo.nombre); // <--- Comparar por nombre del objeto Equipo
    });
  }

  getPosiciones(): { zonaA: Posicion[], zonaB: Posicion[] } {
    this.ordenarTabla(); 
    return {
      zonaA: this._posiciones.filter(p => p.zona === 'A'),
      zonaB: this._posiciones.filter(p => p.zona === 'B')
    };
  }

  sumarPuntos(equipoNombre: string, puntos: number): void { // <--- Renombrado parámetro para claridad
    const posicion = this._posiciones.find(pos => pos.equipo.nombre.toLowerCase() === equipoNombre.toLowerCase()); // <--- Buscar por nombre del objeto Equipo
    if (posicion) {
      posicion.puntos += puntos;
      this.ordenarTabla(); 
    } else {
      console.warn(`TablaPosicionesService: Equipo "${equipoNombre}" no encontrado para sumar puntos.`);
    }
  }

  resetearTabla(): void {
    this._posiciones.forEach(pos => pos.puntos = 0);
    this.ordenarTabla(); 
  }

  getAllNombresEquipos(): string[] {
    // Mapear los objetos Equipo a sus nombres
    const nombresZonaA = EQUIPOS_ZONA_A.map(equipo => equipo.nombre);
    const nombresZonaB = EQUIPOS_ZONA_B.map(equipo => equipo.nombre);
    return [...nombresZonaA, ...nombresZonaB].sort((a,b) => a.localeCompare(b));
  }
}
