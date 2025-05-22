import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaTorneoCompleta } from '../../models/fixture.model';

@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fixture.component.html',
  styleUrl: './fixture.component.css'
})
export class FixtureComponent implements OnInit, OnChanges {
  @Input() fixtureCompleto: FechaTorneoCompleta[] = [];
  
  fechaActualFixtureNumero: number = 1;
  datosFechaSeleccionada: FechaTorneoCompleta | undefined;

  constructor() { }

  ngOnInit(): void {
    if (this.fixtureCompleto.length > 0) {
      this.actualizarDatosFechaSeleccionada();
    } else {
      this.datosFechaSeleccionada = undefined;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fixtureCompleto']) {
      if (this.fixtureCompleto && this.fixtureCompleto.length > 0) {
        if (this.fechaActualFixtureNumero > this.fixtureCompleto.length) {
            this.fechaActualFixtureNumero = 1;
        }
        this.actualizarDatosFechaSeleccionada();
      } else {
        this.datosFechaSeleccionada = undefined;
        this.fechaActualFixtureNumero = 1;
      }
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
