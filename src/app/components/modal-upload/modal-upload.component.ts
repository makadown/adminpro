import { ModalUploadService } from './modal-upload.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { SubirArchivoService } from '../../services/service.index';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;
  @ViewChild( 'inputFile' ) inputFile: any;

  constructor(
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService
  ) {
   // console.log('Modal Upload Listo');
  }

  ngOnInit() {
  }

  seleccionImagen( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      this.imagenTemp = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      this.imagenTemp = null;
      return;
    }
    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => {
      this.imagenTemp = reader.result;
    };
  }

  subirImagen() {
    this._subirArchivoService.subirArchivo(
                      this.imagenSubir,
                    this._modalUploadService.tipo,
                  this._modalUploadService.id)
                .then( resp => {

                 // console.log(resp);
                  this._modalUploadService.notificacion.emit(resp);
                  this.cerrarModal();

                })
                .catch( err => {console.log(err); });
  }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;
    this.clearForm();
    this._modalUploadService.ocultarModal();
  }

  clearForm() {
    // console.log('Aqui obtienes el elemento para atribuir algo vazio: ', this.inputFile.nativeElement);

    this.inputFile.nativeElement.value = '';
}

}
