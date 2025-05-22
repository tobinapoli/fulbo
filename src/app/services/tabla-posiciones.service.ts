import { Injectable } from '@angular/core';
import { EQUIPOS_ZONA_A, EQUIPOS_ZONA_B } from '../data/equipos.data'; // <--- IMPORTAR CONSTANTES (sin .ts)

export interface Posicion {
  equipo: string;
  puntos: number;
  zona: 'A' | 'B';
}

@Injectable({
  providedIn: 'root'
})
export class TablaPosicionesService {
  // Ya no se definen aquí, se importan
  // private equiposZonaA: string[] = [ ... ];
  // private equiposZonaB: string[] = [ ... ];

  private _posiciones: Posicion[] = [];

  constructor() {
    this.iniciarTablaPosiciones();
  }

  private iniciarTablaPosiciones(): void {
    this._posiciones = [];
    EQUIPOS_ZONA_A.forEach(equipo => { // <--- Usar constante importada
      this._posiciones.push({ equipo, puntos: 0, zona: 'A' });
    });
    EQUIPOS_ZONA_B.forEach(equipo => { // <--- Usar constante importada
      this._posiciones.push({ equipo, puntos: 0, zona: 'B' });
    });
    this.ordenarTabla();
  }

  private ordenarTabla(): void {
    this._posiciones.sort((a, b) => {
      if (b.puntos !== a.puntos) {
        return b.puntos - a.puntos;
      }
      return a.equipo.localeCompare(b.equipo);
    });
  }

  getPosiciones(): { zonaA: Posicion[], zonaB: Posicion[] } {
    this.ordenarTabla(); 
    return {
      zonaA: this._posiciones.filter(p => p.zona === 'A'),
      zonaB: this._posiciones.filter(p => p.zona === 'B')
    };
  }

  sumarPuntos(equipo: string, puntos: number): void {
    const posicion = this._posiciones.find(pos => pos.equipo.toLowerCase() === equipo.toLowerCase());
    if (posicion) {
      posicion.puntos += puntos;
      this.ordenarTabla(); 
    } else {
      console.warn(`TablaPosicionesService: Equipo "${equipo}" no encontrado para sumar puntos.`);
    }
  }

  resetearTabla(): void {
    this._posiciones.forEach(pos => pos.puntos = 0);
    this.ordenarTabla(); 
  }

  getAllNombresEquipos(): string[] {
    return [...EQUIPOS_ZONA_A, ...EQUIPOS_ZONA_B].sort((a,b) => a.localeCompare(b)); // <--- Usar constantes importadas
  }
}
