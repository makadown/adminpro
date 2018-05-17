import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';

declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  cargando: boolean = false;

  constructor(public _medicoService: MedicoService) {
    }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoService.cargarMedicos(this.desde)
              .subscribe( medicos => {
                this.medicos = medicos;
                this.cargando = false;
          });
  }

  buscarMedico( termino: string) {

    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;

    this._medicoService.buscarMedicos(termino)
                        .subscribe( medicos => {
                          this.medicos = medicos;
                          this.cargando = false;
                        } );
  }

  borrarMedico(medico: Medico) {
    swal({
      title: 'Está seguro?',
      text: 'Está a punto de borrar a ' + medico.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then((borrar) => {
      if (borrar) {
        this._medicoService.borrarMedico(medico._id)
                .subscribe( () => {
                  this.desde = 0;
                  this.cargarMedicos();
                });
      }
    });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    if ( desde >= this._medicoService.totalMedicos ) { return; }
    if ( desde < 0 ) { return; }

    this.desde += valor;
    this.cargarMedicos();

  }

}
