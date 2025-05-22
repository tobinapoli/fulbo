import { Injectable } from '@angular/core';
import { EQUIPOS_ZONA_A, EQUIPOS_ZONA_B } from '../data/equipos.data';
import { Equipo } from '../models/equipo.model'; // <--- IMPORTAR Equipo
import { FechaTorneoCompleta, PartidoFixture } from '../models/fixture.model'; // Importar modelos de fixture

export interface Posicion {
  equipo: Equipo; // <--- Cambiado de string a Equipo
  puntos: number;
  pj: number; // Partidos Jugados
  g: number;  // Ganados
  e: number;  // Empatados
  p: number;  // Perdidos
  gf: number; // Goles a Favor
  gc: number; // Goles en Contra
  dif: number; // Diferencia de Goles
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
      "San Martin (SJ)", "Vélez Sarsfield", "Dep. Riestra", "Instituto", "Barracas Central",
      "Argentinos Juniors", "Talleres (C)", "Ind. Rivadavia (M)", "Banfield", "Atlético Tucumán"
    ];
    const equiposZonaBInit = [
      "Racing Club", "Boca Juniors", "Estudiantes LP", "Newell's Old Boys", "San Lorenzo",
      "Godoy Cruz", "Platense", "Defensa y Justicia", "Central Córdoba (SdE)", "Lanús",
      "Belgrano (C)", "Sarmiento (J)", "Unión (SF)", "Tigre", "Aldosivi" 
    ];

    this.equiposOriginales = { zonaA: equiposZonaAInit, zonaB: equiposZonaBInit };
    this.inicializarPosiciones();
  }

  private inicializarPosiciones(): void {
    this.posiciones.zonaA = this.equiposOriginales.zonaA.map((nombre, index) => ({
      equipo: { id: index + 1, nombre: nombre }, // ID numérico simple basado en el índice
      puntos: 0,
      pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dif: 0,
      zona: 'A'
    }));
    this.posiciones.zonaB = this.equiposOriginales.zonaB.map((nombre, index) => ({
      equipo: { id: index + 1 + this.equiposOriginales.zonaA.length, nombre: nombre }, // ID numérico, continuando desde Zona A
      puntos: 0,
      pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dif: 0,
      zona: 'B'
    }));
    // No llamar a ordenarTabla aquí, se hará después de calcular resultados o al obtener posiciones
  }

  private ordenarTabla(): void {
    const sortLogic = (a: Posicion, b: Posicion) =>
      b.puntos - a.puntos ||
      b.dif - a.dif ||
      b.gf - a.gf ||
      a.equipo.nombre.localeCompare(b.equipo.nombre);

    this.posiciones.zonaA.sort(sortLogic);
    this.posiciones.zonaB.sort(sortLogic);
  }

  getPosiciones(): { zonaA: Posicion[], zonaB: Posicion[] } {
    this.ordenarTabla(); 
    return this.posiciones;
  }

  sumarPuntos(equipoNombre: string, puntosASumar: number): void { // <--- Renombrado parámetro para claridad
    const posicion = [...this.posiciones.zonaA, ...this.posiciones.zonaB].find(pos => pos.equipo.nombre.toLowerCase() === equipoNombre.toLowerCase()); // <--- Buscar por nombre del objeto Equipo
    if (posicion) {
      // Esta función ahora es menos relevante si los puntos se calculan desde los resultados.
      // Podría usarse para ajustes manuales si es necesario, pero afectaría la consistencia con PJ, G, E, P.
      // Por ahora, la dejamos, pero su uso principal cambia.
      posicion.puntos += puntosASumar;
      // No se actualizan G, E, P aquí, ya que no tenemos el contexto del partido.
      this.ordenarTabla(); 
    } else {
      console.warn(`TablaPosicionesService: Equipo "${equipoNombre}" no encontrado para sumar puntos.`);
    }
  }

  resetearTabla(): void {
    this.inicializarPosiciones();
    // Aquí también se deberían resetear los resultados de los partidos si se gestionan centralizadamente
    // o si el fixture service es el único dueño de los resultados.
    // Por ahora, solo reinicia las posiciones.
  }

  actualizarTablaConResultados(fixture: FechaTorneoCompleta[], fechaHastaDondeSeJugo: number): void {
    this.inicializarPosiciones(); // Resetea puntos y estadísticas antes de recalcular

    for (let i = 0; i < fechaHastaDondeSeJugo; i++) {
      const fecha = fixture[i];
      if (!fecha) continue;

      const procesarPartido = (partido: PartidoFixture) => {
        if (partido && partido.jugado && typeof partido.golesLocal === 'number' && typeof partido.golesVisitante === 'number') {
          const equipoLocalPos = [...this.posiciones.zonaA, ...this.posiciones.zonaB].find(p => p.equipo.nombre === partido.local);
          const equipoVisitantePos = [...this.posiciones.zonaA, ...this.posiciones.zonaB].find(p => p.equipo.nombre === partido.visitante);

          if (equipoLocalPos && equipoVisitantePos) {
            equipoLocalPos.pj++;
            equipoVisitantePos.pj++;
            equipoLocalPos.gf += partido.golesLocal;
            equipoLocalPos.gc += partido.golesVisitante;
            equipoVisitantePos.gf += partido.golesVisitante;
            equipoVisitantePos.gc += partido.golesLocal;

            if (partido.golesLocal > partido.golesVisitante) {
              equipoLocalPos.puntos += 3;
              equipoLocalPos.g++;
              equipoVisitantePos.p++;
            } else if (partido.golesLocal < partido.golesVisitante) {
              equipoVisitantePos.puntos += 3;
              equipoVisitantePos.g++;
              equipoLocalPos.p++;
            } else {
              equipoLocalPos.puntos += 1;
              equipoVisitantePos.puntos += 1;
              equipoLocalPos.e++;
              equipoVisitantePos.e++;
            }
            equipoLocalPos.dif = equipoLocalPos.gf - equipoLocalPos.gc;
            equipoVisitantePos.dif = equipoVisitantePos.gf - equipoVisitantePos.gc;
          }
        }
      };

      fecha.partidosZonaA.forEach(procesarPartido);
      fecha.partidosZonaB.forEach(procesarPartido);
      if (fecha.partidoInterzonal) {
        procesarPartido(fecha.partidoInterzonal);
      }
    }
    this.ordenarTabla();
  }

  getAllNombresEquipos(): string[] {
    return [...this.equiposOriginales.zonaA, ...this.equiposOriginales.zonaB];
  }

  getNombresEquiposPorZona(zona: 'A' | 'B'): string[] {
    return zona === 'A' ? [...this.equiposOriginales.zonaA] : [...this.equiposOriginales.zonaB];
  }
}
