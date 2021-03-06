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
  cargando: boolean = false;

  constructor(public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService) {
    }

  ngOnInit() {
    this.cargarHospitales();

      this._modalUploadService.notificacion
               .subscribe( resp => this.cargarHospitales());
  }

  buscarHospital( termino: string) {

    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospital(termino)
                        .subscribe( (hospitales: Hospital[]) => {
                          this.hospitales = hospitales;
                          this.cargando = false;
                        } );
  }

  cargarHospitales() {
    this.cargando = true;
    this._hospitalService.cargarHospitales(this.desde)
                    .subscribe( hospitales => {
                        this.hospitales = hospitales;
                        this.cargando = false;
          });
  }

  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital)
                        .subscribe();
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
                   .subscribe( () =>  this.cargarHospitales() );
      }
    });
  }

  crearHospital() {
    swal({
      title: 'Crear hospital',
      text: 'Escriba el nombre del nuevo hospital:',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    })
    .then((value) => {
      if ( !value || value.length === 0 ) { return; }

      this._hospitalService.crearHospital( value )
              .subscribe( () => {
                this.desde = 0;
                this.cargarHospitales();
              });

    });
  }

  actualizarImagen(hospital: Hospital) {
    this._modalUploadService.mostrarModal('hospitales', hospital._id);
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
   // console.log(desde);
    if ( desde >= this._hospitalService.totalHospitales ) { return; }
    if ( desde < 0 ) { return; }

    this.desde += valor;
    this.cargarHospitales();

  }
}
