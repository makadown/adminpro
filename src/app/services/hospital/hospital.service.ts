import { Hospital } from './../../models/hospital.model';
import { URL_SERVICIOS } from './../../config/config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable()
export class HospitalService {

  hospital: Hospital;
  token: string;

  constructor(public http: HttpClient ,
    public router: Router,
    public _subirArchivoService: SubirArchivoService) {
      this.cargarStorage();
  }

  cargarStorage() {
      if (localStorage.getItem('token')) {
        this.token = localStorage.getItem('token');
        // this.hospital = JSON.parse( localStorage.getItem('hospital') ) ;
      } else {
        this.token = '';
        // this.hospital = null;
      }
  }

  guardarStorage(resp: any) {
    localStorage.setItem('token', resp.token );
    localStorage.setItem('hospital', JSON.stringify(resp.hospital) );
    this.hospital = resp.hospital;
    this.token = resp.token;
  }

  actualizarStorage(token: string, hospital: Hospital) {
    localStorage.setItem('token', token );
    localStorage.setItem('hospital', JSON.stringify(hospital) );
    this.hospital = hospital;
    this.token = token;
  }

  cargarHospitales(desde: number = 0  ) {
    const url = URL_SERVICIOS + '/hospital?desde=' +  desde;
    return this.http.get(url);
  }

  buscarHospitales(	termino:	string ) {

    /*TODO: meter funcionalidad de paginacion */
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' +  termino;
    return this.http.get(url)
                    .map( (resp: any) => resp.hospitales );
  }

  obtenerHospital(	id:	string ) {
    const url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url)
              .map( (resp: any) => {
                this.guardarStorage(resp);
                return resp.hospital;
               });
  }

  cambiarImagen(archivo: File, id: string) {
    this._subirArchivoService.subirArchivo(archivo, 'hospital', id)
    .then( (resp: any ) => {
      this.hospital.img = resp.hospitalActualizado.img;
      swal('Imagen de hospital actualizada', this.hospital.nombre, 'success');
      this.actualizarStorage(this.token, this.hospital);
    })
    .catch(resp => {
      console.log( resp );
    });
  }

  borrarHospital(	id:	string	) {
    const url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this.token;

    return this.http.delete(url)
                    .map((resp: any) => {
                          swal('Listo', 'Hospital eliminado correctamente', 'success');
                          return true;
            });
  }

  crearHospital(	hospital:	Hospital	) {
    const url = URL_SERVICIOS + '/hospital?token=' + this.token;
    return this.http.post(url , hospital)
              .map( (resp: any) => {
                swal('Hospital creado', hospital.nombre , 'success');
                return resp.hospital;
       });
  }

  actualizarHospital(	hospital:	Hospital	) {
    const url = URL_SERVICIOS + '/hospital/' + hospital._id +
    '?token=' + this.token;

return this.http.put(url, hospital)
         .map((resp: any) => {

          swal('Hospital actualizado', hospital.nombre, 'success');

          return true;
         });
  }


}
