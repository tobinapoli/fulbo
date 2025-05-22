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
  private posiciones: { zonaA: Posicion[], zonaB: Posicion[] } = { zonaA: [], zonaB: [] };
  private equiposOriginales: { zonaA: string[], zonaB: string[] };

  constructor() {
    // Nombres de los 15 equipos para Zona A y Zona B
    const equiposZonaAInit = [
      "River Plate", "Independiente", "Gimnasia LP", "Rosario Central", "Huracán",
      "Colón", "Vélez Sarsfield", "Dep. Riestra", "Instituto", "Barracas Central",
      "Argentinos Juniors", "Talleres (C)", "Ind. Rivadavia (M)", "Banfield", "Atlético Tucumán"
    ];
    const equiposZonaBInit = [
      "Racing Club", "Boca Juniors", "Estudiantes LP", "Newell's Old Boys", "San Lorenzo",
      "Godoy Cruz", "Platense", "Defensa y Justicia", "Central Córdoba (SdE)", "Lanús",
      "Belgrano (C)", "Sarmiento (J)", "Unión (SF)", "Tigre", "Gimnasia (M)" // Asumiendo Gimnasia de Mendoza para completar 15
    ];

    this.equiposOriginales = { zonaA: equiposZonaAInit, zonaB: equiposZonaBInit };
    this.inicializarPosiciones();
  }

  private inicializarPosiciones(): void {
    this.posiciones.zonaA = this.equiposOriginales.zonaA.map((nombre, index) => ({
      equipo: { id: index + 1, nombre: nombre }, // ID numérico simple basado en el índice
      puntos: 0,
      zona: 'A'
    }));
    this.posiciones.zonaB = this.equiposOriginales.zonaB.map((nombre, index) => ({
      equipo: { id: index + 1 + this.equiposOriginales.zonaA.length, nombre: nombre }, // ID numérico, continuando desde Zona A
      puntos: 0,
      zona: 'B'
    }));
    this.ordenarTabla();
  }

  private ordenarTabla(): void {
    this.posiciones.zonaA.sort((a, b) => b.puntos - a.puntos || a.equipo.nombre.localeCompare(b.equipo.nombre));
    this.posiciones.zonaB.sort((a, b) => b.puntos - a.puntos || a.equipo.nombre.localeCompare(b.equipo.nombre));
  }

  getPosiciones(): { zonaA: Posicion[], zonaB: Posicion[] } {
    this.ordenarTabla(); 
    return this.posiciones;
  }

  sumarPuntos(equipoNombre: string, puntos: number): void { // <--- Renombrado parámetro para claridad
    const posicion = [...this.posiciones.zonaA, ...this.posiciones.zonaB].find(pos => pos.equipo.nombre.toLowerCase() === equipoNombre.toLowerCase()); // <--- Buscar por nombre del objeto Equipo
    if (posicion) {
      posicion.puntos += puntos;
      this.ordenarTabla(); 
    } else {
      console.warn(`TablaPosicionesService: Equipo "${equipoNombre}" no encontrado para sumar puntos.`);
    }
  }

  resetearTabla(): void {
    this.inicializarPosiciones();
  }

  getAllNombresEquipos(): string[] {
    return [...this.equiposOriginales.zonaA, ...this.equiposOriginales.zonaB];
  }

  getNombresEquiposPorZona(zona: 'A' | 'B'): string[] {
    return zona === 'A' ? [...this.equiposOriginales.zonaA] : [...this.equiposOriginales.zonaB];
  }
}
