import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Hospital } from '../../models/hospital.model';

@Injectable()
export class HospitalService {

  totalHospitales: number = 0;

  hospital: Hospital;

  constructor(public http: HttpClient,
    public _usuarioService: UsuarioService ) {
  }

  /**
   * Este observable carga 5 hospitales paginados. O bien
   * si se manda -1 carga todos los hospitales.
   * @returns hospitales: Hospital[]
   */
  cargarHospitales(desde: number = 0  ) {
    const url = URL_SERVICIOS + '/hospital?desde=' +  desde;
    return this.http.get( url )
              .map( (resp: any) => {
                this.totalHospitales = resp.total;
                return resp.hospitales;
              });
  }

  obtenerHospital(	id:	string ) {
    const url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url)
              .map( (resp: any) => resp.hospital );
  }

  borrarHospital(	id:	string	) {
    const url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this._usuarioService.token;

    return this.http.delete(url)
               .map( resp => swal('Listo', 'Hospital eliminado correctamente', 'success') );
  }

  /** Esta funcion crea un hospital a partir de un nombre dado
   * @returns hospital: Hospital
  */
  crearHospital(	nombre: string	) {
    const url = URL_SERVICIOS + '/hospital?token=' + this._usuarioService.token;
    return this.http.post(url , {nombre})
              .map( (resp: any) => {
                swal('Hospital creado', resp.hospital.nombre , 'success');
                return resp.hospital;
       });
  }

  buscarHospital(	termino:	string ) {

    /*TODO: meter funcionalidad de paginacion */
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' +  termino;
    return this.http.get(url)
                    .map( (resp: any) => resp.hospitales );
  }

  actualizarHospital(	hospital:	Hospital	) {
    const url = URL_SERVICIOS + '/hospital/' + hospital._id +
                                '?token=' + this._usuarioService.token;

    return this.http.put(url, hospital)
         .map((resp: any) => {

          swal('Hospital actualizado', hospital.nombre, 'success');

          return resp.hospital;
         });
  }
}
