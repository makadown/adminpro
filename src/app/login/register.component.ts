import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

const swal: SweetAlert = _swal as any;

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(public _usuarioService: UsuarioService,
  public router: Router) { }

  sonIguales (campo1: string, campo2: string) {

      return  ( group: FormGroup ) => {

          const pass1 = group.controls[campo1].value;
          const pass2 = group.controls[campo2].value;

          if ( pass1 === pass2 ) {
            return null;
          }


          return {
            sonIguales: true
        };
      };
  }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      nombre : new FormControl(null, Validators.required ),
      correo : new FormControl(null, [Validators.required, Validators.email]),
      password : new FormControl(null, Validators.required),
      password2 : new FormControl(null, Validators.required),
      condiciones : new FormControl(false)
    }, { validators: this.sonIguales('password', 'password2')  });

    this.forma.setValue({
      nombre: 'test', correo: 'test@test.com', password: '123456', password2: '123456', condiciones: true
    });

  }
/*
En este proyecto se usa sweet alert de
https://sweetalert.js.org/
*/
  registrarUsuario() {

    if ( !this.forma.value.condiciones ) {
      swal('Importante', 'Debe aceptar las condiciones.', 'warning');
    } else {

      if ( this.forma.invalid  ) {
      return;
    }

    const usuario = new Usuario(this.forma.value.nombre,
                              this.forma.value.correo,
                              this.forma.value.password
       ); 

    this._usuarioService.crearUsuario(usuario)
      .catch(err => {
        swal('Error al crear usuario', 'Intente con otro correo.', 'warning');
        return Observable.empty();
    })
      .subscribe( resp => {
              // console.log(resp);
              this.router.navigate(['/login']);
       });
    }
  }

}
