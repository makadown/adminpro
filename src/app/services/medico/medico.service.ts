import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

@Injectable()
export class MedicoService {

  totalMedicos: number = 0;

  medico: Medico;

  constructor(public http: HttpClient,
    public _usuarioService: UsuarioService ) {
  }
  /** Este observable carga 5 medicos paginados
   * @returns medicos: Medico[ ] */
  cargarMedicos(desde: number = 0  ) {

    const url = URL_SERVICIOS + '/medico?desde=' +  desde;

    return this.http.get(url)
                    .map( (resp: any) => {
                      this.totalMedicos = resp.total;
                      return resp.medicos;
                    });
  }

  /** Este observable carga 1 medico dado un id
   * @returns medico: Medico
  */
  cargarMedico(	id:	string ) {
    const url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get(url)
              .map( (resp: any) => resp.medico );
  }
  /** Este observable realiza una busqueda dado un termino en la colección
   * de medicos registrados.
   * @return medicos: Medico[]
   */
  buscarMedicos(	termino:	string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' +  termino;
    return this.http.get(url)
                    .map( (resp: any) => resp.medicos );
  }

  /** Este observable elimina un medico por id.
   * El map retorna una respuesta con el resultado y el medico eliminado
   * en formato JSON
   * @returns resp = { ok: boolean,
            medico: Medico }
   */
  borrarMedico(	id:	string	) {

    const url = URL_SERVICIOS + '/medico/' + id + '?token=' + this._usuarioService.token;
    // TODO: Tratar de poner todos los swals en los componentes y no en los servicios.
    return this.http.delete(url)
                    .map( (resp: any) => {
                      swal('Listo', 'Medico eliminado correctamente', 'success');
                      return resp;
                    } );
  }

  /** Este observable crea o actualiza un medico
   * @returns medico: Medico
  */
  guardarMedico( medico: Medico ) {

    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) {
      // actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, medico )
                .map( (resp: any) => {
                  swal('Médico Actualizado', medico.nombre, 'success');
                  return resp.medico;

                });

    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, medico )
              .map( (resp: any) => {
                swal('Médico Creado', medico.nombre, 'success');
                return resp.medico;
              });
    }
  }

}
