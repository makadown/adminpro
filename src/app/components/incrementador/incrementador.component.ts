
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress') txtProgress: ElementRef;

  @Input() leyenda: string = 'Leyenda!';
  @Input() progreso: number = 50;


  @Output() cambioValor: EventEmitter<number> = new EventEmitter();


  constructor() {
   }

  ngOnInit() {
  }

  onChanges( newValue: number) {

    // let elemHtml = document.getElementsByName('progreso')[0];
    // console.log(this.txtProgress);

    if ( newValue >= 100  ) { newValue = 100; }

    if ( newValue <= 0) { newValue = 0; }

    this.progreso = newValue;
   // elemHtml.value = Number(this.progreso);
   this.txtProgress.nativeElement.value = this.progreso;
    this.cambioValor.emit(this.progreso);
  }

  cambiarValor(valor) {

    this.progreso = this.progreso + valor;
    if ( this.progreso > 100  ) { this.progreso = 100; }

    if ( this.progreso < 0) { this.progreso = 0; }

    this.cambioValor.emit(this.progreso);
    this.txtProgress.nativeElement.focus();
  }

}
