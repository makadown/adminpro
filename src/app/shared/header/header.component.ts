import { Usuario } from './../../models/usuario.model';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;
  constructor(public _usuarioService: UsuarioService) {
    console.log('_usuarioService asignado');
  }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
  }

}
