import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SubirArchivoService {

  constructor(public http: HttpClient) { }

  /* Lamentablemente Angular no tiene todavia instrucciones que tome imagen y la suba como
      http.post. Esto es Vanilla Javascript
  */
  subirArchivo(archivo: File, tipo: string, id: string) {

    return new Promise( (resolve, reject) => {
        const formData = new FormData();
        const xhr = new XMLHttpRequest();

        formData.append('imagen', archivo, archivo.name);
        xhr.onreadystatechange = function() {
          if ( xhr.readyState === 4 ) {
            if ( xhr.status === 200 ) {
              // console.log('Imagen Subida');
              resolve( JSON.parse( xhr.response ) );
            } else {
              console.log('Falló la subida papu!');
              reject( xhr.response );
            }
          }
        };

        const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
        xhr.open('PUT', url, true);
        xhr.send( formData );
    });
  }



/* Esta es otra forma. La puse para tenerla a la mano. */
  fileUpload(fileItem: File, tipo: string, id: string) {
    const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
    const formData: FormData = new FormData();
    formData.append('imagen', fileItem, fileItem.name);
    return this.http.put(url, formData, { reportProgress: true });
    }

}
