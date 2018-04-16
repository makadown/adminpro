import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {

  leyenda: number;
  progreso1: number = 20;
  progreso2: number = 50;

  constructor() { }

  ngOnInit() {
  }

  actualizar(event: number)  {
console.log('Evento: ', event);
  }
}
