import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TablaPosicionesService, Posicion } from '../../services/tabla-posiciones.service';
import { FixtureComponent } from '../fixture/fixture.component';
import { FixtureService } from '../../services/fixture.service';
import { FechaTorneoCompleta } from '../../models/fixture.model'; // Importar FechaTorneoCompleta

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
  fixtureParaMostrar: FechaTorneoCompleta[] = []; // Para pasar al FixtureComponent
  totalFechasFixture: number = 15; // Asumiendo 15 fechas

  equipoParaSumarPuntos: string = '';
  cantidadPuntos: number = 3; // Default to 3, but points are now mainly from results
  equiposArgentinosDisponibles: string[] = [];
  fechaHastaDondeSeJugo: number = 12; // Definir la fecha hasta donde se simulan resultados

  constructor(
    private tablaPosicionesService: TablaPosicionesService,
    private fixtureService: FixtureService // Inyectar FixtureService
  ) {}

  ngOnInit(): void {
    this.actualizarSimulacionPorFecha(); // Llama al nuevo método que maneja la lógica
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
        // Advertencia: sumarPuntos manualmente puede desincronizar con PJ, G, E, P, etc.
        this.tablaPosicionesService.sumarPuntos(this.equipoParaSumarPuntos.trim(), puntosNum);
        this.actualizarPosiciones();
        // Considerar si esto debería también recalcular el fixture o si es solo un ajuste manual
        // Si se quiere que afecte la simulación, se debería llamar a actualizarSimulacionPorFecha()
        // pero eso sobreescribiría los puntos manuales con los simulados.
        this.equipoParaSumarPuntos = '';
      } else {
        console.warn('La cantidad de puntos no es un número válido.');
      }
    } else {
      console.warn('El nombre del equipo no puede estar vacío.');
    }
  }

  resetearTabla(): void {
    this.tablaPosicionesService.resetearTabla(); // Esto resetea puntos y stats a 0
    // Recalcular y actualizar todo basado en la fechaHastaDondeSeJugo actual (que podría ser 0 o un valor por defecto)
    this.actualizarSimulacionPorFecha(); 
  }

  actualizarSimulacionPorFecha(): void {
    // Validar fechaHastaDondeSeJugo (opcional, pero bueno para UX)
    if (this.fechaHastaDondeSeJugo < 0) this.fechaHastaDondeSeJugo = 0;
    if (this.fechaHastaDondeSeJugo > this.totalFechasFixture) this.fechaHastaDondeSeJugo = this.totalFechasFixture;

    // 1. Generar el fixture con los resultados simulados hasta la nueva fecha
    this.fixtureParaMostrar = this.fixtureService.generarFixtureCompletoConInterzonales(this.fechaHastaDondeSeJugo);
    // 2. Actualizar la tabla de posiciones basada en este nuevo fixture
    this.tablaPosicionesService.actualizarTablaConResultados(this.fixtureParaMostrar, this.fechaHastaDondeSeJugo);
    // 3. Obtener las posiciones actualizadas para la vista de tablas
    this.actualizarPosiciones();
    // El FixtureComponent se actualizará automáticamente gracias al @Input y ngOnChanges
  }
}
