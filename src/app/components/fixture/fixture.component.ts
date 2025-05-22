import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixtureService } from '../../services/fixture.service';
import { FechaTorneoCompleta } from '../../models/fixture.model';

@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fixture.component.html',
  styleUrl: './fixture.component.css'
})
export class FixtureComponent implements OnInit {
  fixtureCompleto: FechaTorneoCompleta[] = [];
  fechaActualFixtureNumero: number = 1;
  datosFechaSeleccionada: FechaTorneoCompleta | undefined;

  constructor(private fixtureService: FixtureService) { }

  ngOnInit(): void {
    this.generarFixture();
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
}
