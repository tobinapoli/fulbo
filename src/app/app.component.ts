import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PartidoComponent } from "./components/partido/partido.component";

@Component({
  selector: 'app-root',
  imports: [PartidoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fulbo';
}
