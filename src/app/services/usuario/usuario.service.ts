import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient ,
    public router: Router ) {
    this.cargarStorage();
    console.log('Servicio de usuario listo');
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
              });
  }

  cargarStorage() {
      if (localStorage.getItem('token')) {
        this.token = localStorage.getItem('token');
        this.usuario = JSON.parse( localStorage.getItem('usuario') ) ;
      } else {
        this.token = '';
        this.usuario = null;
      }
  }

  guardarStorage(resp: any) {
    localStorage.setItem('id', resp.id );
    localStorage.setItem('token', resp.token );
    localStorage.setItem('usuario', JSON.stringify(resp.usuario) );
    this.usuario = resp.usuario;
    this.token = resp.token;
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

}