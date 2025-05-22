export interface PartidoFixture {
  local: string;
  visitante: string;
  golesLocal?: number | null;
  golesVisitante?: number | null;
  jugado?: boolean;
  // Podrías añadir 'tipo?: "intrazonalA" | "intrazonalB" | "interzonal";' si necesitas diferenciarlo fácilmente
}

// Describe el resultado de generar un fixture para una zona específica para una fecha
// incluyendo quién queda libre para el interzonal.
export interface ResultadoFechaZona {
  fechaNumero: number;
  partidosIntrazona: PartidoFixture[];
  equipoLibreParaInterzonal: string; // El equipo de esta zona que jugará el interzonal
}

// Estructura para una fecha completa del torneo, combinando ambas zonas y el interzonal.
export interface FechaTorneoCompleta {
  numero: number; // Número de la fecha (1 a 15)
  partidosZonaA: PartidoFixture[];
  partidosZonaB: PartidoFixture[];
  partidoInterzonal: PartidoFixture;
}
