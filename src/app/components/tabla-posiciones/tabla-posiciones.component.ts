import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TablaPosicionesService, Posicion } from '../../services/tabla-posiciones.service';
import { FixtureService } from '../../services/fixture.service'; // Importar FixtureService
import { FechaTorneoCompleta, PartidoFixture } from '../../models/fixture.model'; // Importar modelo de fixture

@Component({
  selector: 'app-tabla-posiciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tabla-posiciones.component.html',
  styleUrl: './tabla-posiciones.component.css'
})
export class TablaPosicionesComponent implements OnInit {
  // Estructura para almacenar las posiciones por zona
  posicionesZonaA: Posicion[] = [];
  posicionesZonaB: Posicion[] = [];

  equipoParaSumarPuntos: string = '';
  cantidadPuntos: number = 3;
  equiposArgentinosDisponibles: string[] = [];

  fixtureCompleto: FechaTorneoCompleta[] = []; // Para almacenar el fixture generado
  fechaActualFixtureNumero: number = 1; // Para controlar la fecha del fixture que se muestra
  datosFechaSeleccionada: FechaTorneoCompleta | undefined; // Datos de la fecha actual del fixture

  constructor(
    private tablaPosicionesService: TablaPosicionesService,
    private fixtureService: FixtureService // Inyectar FixtureService
  ) {}

  ngOnInit(): void {
    this.actualizarPosiciones();
    // Obtener todos los nombres de equipos para el dropdown
    this.equiposArgentinosDisponibles = this.tablaPosicionesService.getAllNombresEquipos();
    this.generarFixture(); // Llamar a generar fixture
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
    // Opcionalmente, regenerar el fixture si depende de algún estado que se resetea
    // this.generarFixture(); 
  }

  generarFixture(): void {
    this.fixtureCompleto = this.fixtureService.generarFixtureCompletoConInterzonales();
    if (this.fixtureCompleto.length > 0) {
      this.actualizarDatosFechaSeleccionada();
    } else {
      this.datosFechaSeleccionada = undefined;
    }
  }

  private actualizarDatosFechaSeleccionada(): void {
    this.datosFechaSeleccionada = this.fixtureCompleto.find(f => f.numero === this.fechaActualFixtureNumero);
  }

  siguienteFecha(): void {
    if (this.fechaActualFixtureNumero < this.fixtureCompleto.length) {
      this.fechaActualFixtureNumero++;
      this.actualizarDatosFechaSeleccionada();
    }
  }

  fechaAnterior(): void {
    if (this.fechaActualFixtureNumero > 1) {
      this.fechaActualFixtureNumero--;
      this.actualizarDatosFechaSeleccionada();
    }
  }

  // Método para simular la estructura de partidos como en la imagen (si es necesario)
  // Esto es solo un ejemplo si necesitaras agruparlos o añadirles más info.
  // Por ahora, usaremos directamente los datos de `datosFechaSeleccionada`.
  getPartidosParaDisplay(): any[] {
    if (!this.datosFechaSeleccionada) return [];
    
    const partidosDisplay: any[] = [];
    // Aquí podrías transformar los partidos si necesitas un formato específico para la UI
    // Por ejemplo, añadirles información de día/hora si la tuvieras.
    // De momento, la plantilla accederá directamente a datosFechaSeleccionada.partidosZonaA, etc.
    return partidosDisplay;
  }
}
