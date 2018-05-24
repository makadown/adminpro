import { URL_SERVICIOS } from './../../config/config';
import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor( public http: HttpClient ,
    public router: Router,
    public _subirArchivoService: SubirArchivoService ) {
    this.cargarStorage();
    // console.log('Servicio de usuario listo');
  }

  renuevatoken() {
    const url = URL_SERVICIOS + '/login/renuevatoken?token=' + this.token;

    return this.http.get(url)
              .map( (resp: any) => {
                this.guardarStorage(resp);
                console.log('Token renovado.');
                return true;
               })
               .catch( err => {
                 this.router.navigate(['/login']);
                 swal('Error al renovar token', 'Por favor inicie sesión nuevamente', 'error');
                    return Observable.throw(err);
               });
  }

  estaLogueado() {
    return (this.token.length > 5 ) ? true : false;
  }

  logout() {
    this.token = '';
    this.usuario = null;
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    // El clear borra todas las configuraciones sobre este server. Usar con cuidado
    // localStorage.clear();
    this.router.navigate(['/login']);

  }

  crearUsuario( usuario: Usuario) {
      const url = URL_SERVICIOS + '/usuario';
      return this.http.post(url , usuario)
              .map( (resp: any) => {
                swal('Usuario creado', usuario.email , 'success');
                return resp.usuario;
              })
              .catch( err => {
                swal( err.error.mensaje, err.error.errors.message, 'error');
                   return Observable.throw(err);
              });
  }

  cargarStorage() {
      if (localStorage.getItem('token')) {
        this.token = localStorage.getItem('token');
        this.usuario = JSON.parse( localStorage.getItem('usuario') ) ;
        this.menu = JSON.parse( localStorage.getItem('menu') ) ;
      } else {
        this.token = '';
        this.usuario = null;
        this.menu = [];
      }
  }

  guardarStorage(resp: any) {
    localStorage.setItem('id', resp.id );
    localStorage.setItem('token', resp.token );
    localStorage.setItem('usuario', JSON.stringify(resp.usuario) );
    localStorage.setItem('menu', JSON.stringify(resp.menu) );
    this.usuario = resp.usuario;
    this.token = resp.token;
    this.menu = resp.menu;
  }

  actualizarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );
    localStorage.setItem('menu', JSON.stringify(menu) );
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  login(usuario: Usuario, recuerdame: boolean) {

    if (recuerdame) {
        localStorage.setItem('email', usuario.email);
    } else {localStorage.removeItem('email'); }

    const url = URL_SERVICIOS + '/login';
    return this.http.post(url , usuario)
              .map( (resp: any) => {
                this.guardarStorage(resp);
                return true;
               })
               .catch( err => {
                 swal('Error en el login. ', err.error.mensaje, 'error');
                    return Observable.throw(err);
               });
  }

  loginGoogle(token: string) {

    // console.log('Enviando token '  + token );
    const url = URL_SERVICIOS + '/login/google';
    /* Indispensable mandar el token entre {} */
    return this.http.post(url , { token } )
              .map( (resp: any) => {
                this.guardarStorage(resp);
                return true;
               });
  }

  actualizarUsuario( usuario: Usuario ) {

    const url = URL_SERVICIOS + '/usuario/' + usuario._id +
          '?token=' + this.token;

    return this.http.put(url, usuario)
               .map((resp: any) => {

                if (usuario._id === this.usuario._id) {
                  /* Solo si soy yo mismo, el usuario conectado */
                  const usuarioDB: Usuario = resp.usuario;
                  this.actualizarStorage( usuarioDB._id, this.token, usuarioDB, this.menu);
                }

                swal('Usuario actualizado', usuario.nombre, 'success');

                return true;
               })
               .catch( err => {
                swal( err.error.mensaje, err.error.errors.message, 'error');
                   return Observable.throw(err);
              });
  }

  cambiarImagen(archivo: File, id: string) {
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
    .then( (resp: any ) => {
      this.usuario.img = resp.usuarioActualizado.img;
      swal('Imagen de usuario actualizada', this.usuario.nombre, 'success');
      this.actualizarStorage(this.usuario._id, this.token, this.usuario, this.menu);
    })
    .catch(resp => {
      console.log( resp );
    });
  }

  cargarUsuarios( desde: number = 0  ) {
    const url = URL_SERVICIOS + '/usuario?desde=' +  desde;
    return this.http.get(url);
  }

  buscarUsuarios( termino: string) {

    /*TODO: meter funcionalidad de paginacion */
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' +  termino;
    return this.http.get(url)
                    .map( (resp: any) => resp.usuarios );
  }

  borrarUsuario(id: string) {
    const url = URL_SERVICIOS + '/usuario/' + id +
          '?token=' + this.token;

    return this.http.delete(url)
    .map((resp: any) => {
      swal('Listo', 'Usuario eliminado correctamente', 'success');
      return true;
     });
  }

}
