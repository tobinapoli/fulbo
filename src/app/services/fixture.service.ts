import { Injectable } from '@angular/core';
import { FechaTorneoCompleta, PartidoFixture, ResultadoFechaZona } from '../models/fixture.model';
import { TablaPosicionesService } from './tabla-posiciones.service'; // Asumiendo que necesitas los nombres de los equipos

@Injectable({
  providedIn: 'root'
})
export class FixtureService {

  constructor(private tablaPosicionesService: TablaPosicionesService) {}

  /**
   * Genera los partidos intrazonales para un conjunto de equipos en una fecha específica,
   * determinando también qué equipo queda libre.
   * Este es un paso del algoritmo round-robin para una sola fecha.
   */
  private generarPartidosIntrazonaYEquipoLibre(
    equiposZona: string[], 
    fechaIndex: number, // 0-based index of the current round for rotation purposes
    fechaNumeroGlobal: number, // 1-based actual round number for display/simulation
    fechaHastaDondeSeJugo: number
  ): ResultadoFechaZona {
    if (equiposZona.length % 2 === 0) {
      throw new Error('Este método espera un número impar de equipos para determinar un equipo libre.');
    }

    const equiposConBye = [...equiposZona, '__BYE__'];
    const n = equiposConBye.length;
    const partidosDeEstaFecha: PartidoFixture[] = [];
    let equipoLibreReal: string = '';

    const elementosRotativos = equiposConBye.slice(1);
    for (let k = 0; k < fechaIndex; k++) { // k instead of i to avoid conflict if this code is nested
      const ultimo = elementosRotativos.pop();
      if (ultimo) {
        elementosRotativos.unshift(ultimo);
      }
    }
    const equiposRotadosEstaFecha = [equiposConBye[0], ...elementosRotativos];

    for (let j = 0; j < n / 2; j++) { // j instead of i
      let localEquipo = equiposRotadosEstaFecha[j];
      let visitanteEquipo = equiposRotadosEstaFecha[n - 1 - j];

      // Alternar local/visitante para el equipo fijo (j=0) en fechas impares (fechaIndex)
      // fechaIndex es 0-based, así que las fechas "impares" (1, 3, 5...) tienen fechaIndex par (0, 2, 4...)
      // No, si fechaIndex es 0, 2, 4 (rondas 1, 3, 5) -> fijo es local
      // Si fechaIndex es 1, 3, 5 (rondas 2, 4, 6) -> fijo es visitante
      if (j === 0 && fechaIndex % 2 !== 0) { 
        [localEquipo, visitanteEquipo] = [visitanteEquipo, localEquipo];
      }

      if (localEquipo === '__BYE__') {
        equipoLibreReal = visitanteEquipo;
      } else if (visitanteEquipo === '__BYE__') {
        equipoLibreReal = localEquipo;
      } else {
        let golesLocal: number | null = null;
        let golesVisitante: number | null = null;
        let jugado = false;

        if (fechaNumeroGlobal <= fechaHastaDondeSeJugo) {
          jugado = true;
          golesLocal = Math.floor(Math.random() * 4);
          golesVisitante = Math.floor(Math.random() * 4);
        }
        partidosDeEstaFecha.push({ local: localEquipo, visitante: visitanteEquipo, golesLocal, golesVisitante, jugado });
      }
    }

    return {
      fechaNumero: fechaNumeroGlobal, // Usar fechaNumeroGlobal que es 1-based
      partidosIntrazona: partidosDeEstaFecha,
      equipoLibreParaInterzonal: equipoLibreReal
    };
  }

  public generarFixtureCompletoConInterzonales(fechaHastaDondeSeJugo: number): FechaTorneoCompleta[] {
    const nombresEquiposZonaA = this.tablaPosicionesService.getNombresEquiposPorZona('A');
    const nombresEquiposZonaB = this.tablaPosicionesService.getNombresEquiposPorZona('B');

    if (nombresEquiposZonaA.length !== 15 || nombresEquiposZonaB.length !== 15) {
      console.error('Se esperan 15 equipos por zona para este tipo de fixture.');
      return [];
    }

    const fixtureCompleto: FechaTorneoCompleta[] = [];
    const numeroDeFechas = 15;

    for (let i = 0; i < numeroDeFechas; i++) {
      const fechaNumeroActual = i + 1; // 1-based
      const fechaIndex = i; // 0-based for rotation logic

      const resultadoZonaA = this.generarPartidosIntrazonaYEquipoLibre([...nombresEquiposZonaA], fechaIndex, fechaNumeroActual, fechaHastaDondeSeJugo);
      const resultadoZonaB = this.generarPartidosIntrazonaYEquipoLibre([...nombresEquiposZonaB], fechaIndex, fechaNumeroActual, fechaHastaDondeSeJugo);

      let golesLocalInterzonal: number | null = null;
      let golesVisitanteInterzonal: number | null = null;
      let jugadoInterzonal = false;

      if (fechaNumeroActual <= fechaHastaDondeSeJugo) {
        jugadoInterzonal = true;
        golesLocalInterzonal = Math.floor(Math.random() * 4);
        golesVisitanteInterzonal = Math.floor(Math.random() * 4);
      }

      let localInterzonalEquipo = resultadoZonaA.equipoLibreParaInterzonal;
      let visitanteInterzonalEquipo = resultadoZonaB.equipoLibreParaInterzonal;

      // Alternar local/visitante para el partido interzonal basado en fechaNumeroActual (1-based)
      // Si fechaNumeroActual es par, el equipo de Zona B (visitante original) juega de local.
      if (fechaNumeroActual % 2 === 0) {
        [localInterzonalEquipo, visitanteInterzonalEquipo] = [visitanteInterzonalEquipo, localInterzonalEquipo];
      }

      const partidoInterzonal: PartidoFixture = {
        local: localInterzonalEquipo,
        visitante: visitanteInterzonalEquipo,
        golesLocal: golesLocalInterzonal,
        golesVisitante: golesVisitanteInterzonal,
        jugado: jugadoInterzonal
      };

      fixtureCompleto.push({
        numero: fechaNumeroActual,
        partidosZonaA: resultadoZonaA.partidosIntrazona,
        partidosZonaB: resultadoZonaB.partidosIntrazona,
        partidoInterzonal: partidoInterzonal
      });
    }

    return fixtureCompleto;
  }
}
