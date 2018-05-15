import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from './../../components/modal-upload/modal-upload.service';
import { Hospital } from '../../models/hospital.model';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  hospitales: Hospital[] = [];
  desde: number = 0;
  termino: string = '';
  hospitalSeleccionado: Hospital;

  totalRegistros: number = 0;
  cargando: boolean = false;

  constructor(public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService) {
    }

  ngOnInit() {
    this.cargarHospitales();

      this._modalUploadService.notificacion
               .subscribe( resp => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;
    this._hospitalService.cargarHospitales(this.desde)
    .subscribe( (resp: any) => {
      // console.log( resp );
      this.totalRegistros = resp.total;
      this.hospitales = resp.hospitales;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    console.log(desde);
    if ( desde >= this.totalRegistros ) { return; }
    if ( desde < 0 ) { return; }

    this.desde += valor;
    this.cargarHospitales();

  }

  buscarHospitales( termino: string) {

    this.termino = termino;
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospitales(termino)
                        .subscribe( (hospitales: Hospital[]) => {
                          this.hospitales = hospitales;
                          this.totalRegistros = this.hospitales.length;
                          this.cargando = false;
                        } );
  }

  obtenerHospital( id: string) {

    if (id.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService.obtenerHospital(id)
                        .subscribe( (hospital: Hospital) => {
                          this.hospitalSeleccionado = hospital;
                        } );
  }

  borrarHospital(hospital: Hospital) {


    swal({
      title: 'Está seguro?',
      text: 'Está a punto de borrar a ' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then((borrar) => {
      if (borrar) {
        this._hospitalService.borrarHospital(hospital._id)
                .subscribe( ( borrado: boolean) => {
                  console.log(borrado);
                  this.desde = 0;
                  this.cargarHospitales();
                });
      }
    });
  }

  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital)
                        .subscribe();
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('hospitales', id);
  }

  crearHospital() {
    swal('Escriba el nombre del nuevo hospital:', {
      content: 'input',
    })
    .then((value) => {
      if (value) {
        const hospital = new Hospital(value);
        this._hospitalService.crearHospital( hospital )
              .subscribe( (hospitalNuevo: Hospital) => {
                this.desde = 0;
                this.cargarHospitales();
              }
            );
      }
    });
  }
}
