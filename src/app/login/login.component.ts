import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  email: string;
  auth2: any;
  googleUser: any;

  constructor(public router: Router,
              public _usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';

    if ( this.email.length > 1) {
        this.recuerdame = true;
    }
  }

  googleInit() {
    /* Tomado de documentación de google :
      https://developers.google.com/identity/sign-in/web/listeners
    */
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
         client_id : '501471606436-8a4bkqck9pt659bltrijac6t8sc1nqf0.apps.googleusercontent.com',
        /*cookiepolicy : 'singe_host_origin',*/
        scope: 'profile email'
      });

      this.attachSignin( document.getElementById('btnGoogle') );
    });
  }

  attachSignin( element ) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {

      // console.log('Entrando al profail');
      const profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;

     // console.log(profile);
     /* this._usuarioService.loginGoogle(token)
                    .subscribe( () => this.router.navigate(['/dashboard']) ); */
                    /* En produccion y dev esto se buguea */

      /* this._usuarioService.loginGoogle(token).subscribe( () =>
                 window.location.href = '#/dashboard' ); */
                 /* En produccion no jala y en dev si funciona */
      this._usuarioService.loginGoogle(token).subscribe( () =>
                 window.location.href = 'https://makadown.github.io/adminpro/#/dashboard' );
                 /* Solo para Githubpages  */
                 
    /* Esto de arriba es una chicanada para evitar un bug del template del dashboard */

    } );
  }

  ingresar( forma: NgForm ) {

    if (!forma.valid) {return; }

    const usuario = new Usuario(null, forma.value.email, forma.value.password);
    this._usuarioService.login(usuario, forma.value.recuerdame)
                .subscribe( resp => this.router.navigate(['/dashboard']) );
  }
}
