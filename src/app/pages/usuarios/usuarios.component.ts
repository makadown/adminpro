import { ModalUploadService } from './../../components/modal-upload/modal-upload.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit, OnDestroy {

  usuarios: Usuario[] = [];
  desde: number = 0;
  termino: string = '';

  totalRegistros: number = 0;
  cargando: boolean = false;

  constructor(public _usuarioService: UsuarioService,
  public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion
             .subscribe( resp => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde)
    .subscribe( (resp: any) => {
      // console.log( resp );
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    console.log(desde);
    if ( desde >= this.totalRegistros ) { return; }
    if ( desde < 0 ) { return; }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuarios( termino: string) {

    this.termino = termino;
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios(termino)
                        .subscribe( (usuarios: Usuario[]) => {
                          this.usuarios = usuarios;
                          this.totalRegistros = this.usuarios.length;
                          this.cargando = false;
                        } );
  }

  borrarUsuario(usuario: Usuario) {

    if ( usuario._id === this._usuarioService.usuario._id ) {
      swal('No se puede borrar usuario', 'No se puede borrar a sí mismo', 'error');
      return;
    }
    // this._usuarioService.
    swal({
      title: 'Está seguro?',
      text: 'Está a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then((borrar) => {
      if (borrar) {
        this._usuarioService.borrarUsuario(usuario._id)
                .subscribe( ( borrado: boolean) => {
                  console.log(borrado);
                  this.desde = 0;
                  this.cargarUsuarios();
                });
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario)
                        .subscribe();
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this._modalUploadService.notificacion.unsubscribe();
  }

}
