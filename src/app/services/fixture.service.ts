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
  private generarPartidosIntrazonaYEquipoLibre(equiposZona: string[], fechaIndex: number): ResultadoFechaZona {
    if (equiposZona.length % 2 === 0) {
      throw new Error('Este método espera un número impar de equipos para determinar un equipo libre.');
    }

    const equiposConBye = [...equiposZona, '__BYE__']; // Añadir un equipo "descanso" temporal
    const n = equiposConBye.length;
    const partidosDeEstaFecha: PartidoFixture[] = [];
    let equipoLibreReal: string = '';

    // Aplicar la rotación correspondiente a la fecha actual (fechaIndex)
    // El primer equipo (equiposConBye[0]) se mantiene fijo.
    // Los demás rotan. Para la fecha 0, no hay rotación previa.
    // Para fecha 1, el último se mueve a la posición 1, y los demás se desplazan.
    // Esto es equivalente a rotar la sublista equiposConBye.slice(1)
    const elementosRotativos = equiposConBye.slice(1);
    for (let i = 0; i < fechaIndex; i++) {
      const ultimo = elementosRotativos.pop();
      if (ultimo) {
        elementosRotativos.unshift(ultimo);
      }
    }
    const equiposRotadosEstaFecha = [equiposConBye[0], ...elementosRotativos];

    for (let i = 0; i < n / 2; i++) {
      const local = equiposRotadosEstaFecha[i];
      const visitante = equiposRotadosEstaFecha[n - 1 - i];

      if (local === '__BYE__') {
        equipoLibreReal = visitante;
      } else if (visitante === '__BYE__') {
        equipoLibreReal = local;
      } else {
        partidosDeEstaFecha.push({ local, visitante });
      }
    }

    return {
      fechaNumero: fechaIndex + 1,
      partidosIntrazona: partidosDeEstaFecha,
      equipoLibreParaInterzonal: equipoLibreReal
    };
  }

  public generarFixtureCompletoConInterzonales(): FechaTorneoCompleta[] {
    const nombresEquiposZonaA = this.tablaPosicionesService.getNombresEquiposPorZona('A');
    const nombresEquiposZonaB = this.tablaPosicionesService.getNombresEquiposPorZona('B');

    if (nombresEquiposZonaA.length !== 15 || nombresEquiposZonaB.length !== 15) {
      console.error('Se esperan 15 equipos por zona para este tipo de fixture.');
      return [];
    }

    const fixtureCompleto: FechaTorneoCompleta[] = [];
    const numeroDeFechas = 15; // Dado que son 15 equipos por zona, y el que queda libre juega interzonal.

    for (let i = 0; i < numeroDeFechas; i++) {
      // Generar partidos y libre para Zona A para la fecha 'i'
      const resultadoZonaA = this.generarPartidosIntrazonaYEquipoLibre([...nombresEquiposZonaA], i);
      
      // Generar partidos y libre para Zona B para la fecha 'i'
      // IMPORTANTE: Para que los "libres" se crucen correctamente y no se repitan los interzonales,
      // la "rotación" o el orden de los equipos de la Zona B debe ser diferente o estar desfasado
      // respecto a la Zona A. Una forma simple es invertir el orden inicial de la Zona B o aplicar un offset.
      // Aquí, para simplificar, usamos la misma lógica de rotación pero con su propia lista.
      // Una mejora sería asegurar que los cruces interzonales sean variados si es un requisito.
      // Por ahora, el 'equipoLibre' de cada zona se determinará por la misma lógica de rotación interna.
      const resultadoZonaB = this.generarPartidosIntrazonaYEquipoLibre([...nombresEquiposZonaB], i);

      const partidoInterzonal: PartidoFixture = {
        local: resultadoZonaA.equipoLibreParaInterzonal,
        visitante: resultadoZonaB.equipoLibreParaInterzonal
      };

      fixtureCompleto.push({
        numero: i + 1,
        partidosZonaA: resultadoZonaA.partidosIntrazona,
        partidosZonaB: resultadoZonaB.partidosIntrazona,
        partidoInterzonal: partidoInterzonal
      });
    }

    return fixtureCompleto;
  }
}
