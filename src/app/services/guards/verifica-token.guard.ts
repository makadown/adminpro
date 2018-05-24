import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class VerificaTokenGuard implements CanActivate {

  constructor( public _usuarioService: UsuarioService,
               public router: Router ) {
  }

  canActivate(): Promise<boolean> | boolean {

    const token = this._usuarioService.token;
    const payload = JSON.parse( atob( token.split('.')[1] ) );

    const expirado = this.expirado(payload.exp);

    if (expirado) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva( payload.exp );
  }

  verificaRenueva( fechaExp ) {

    return new Promise<boolean>( (resolve, reject) => {

      const tokenExp = new Date(fechaExp * 1000);
      const ahora = new Date();

      const horas_faltantes = 1;
      /* Si falta por lo menos 'horas_faltantes' hora(s)
         para que expire el token, lo renuevo
      */
      ahora.setTime(  ahora.getTime() +
                    ( horas_faltantes * 60 * 60 * 1000 ) );

      // console.log(tokenExp.getTime());
      // console.log(ahora.getTime());

      if (tokenExp.getTime() > ahora.getTime() ) {
        resolve(true);
      } else {
        this._usuarioService.renuevatoken()
             .subscribe(() => {
               resolve(true);
              }, () => {
                this.router.navigate(['/login']);
                reject(false);
              });
      }

      resolve(true);
    });

  }

   expirado ( fechaExp: number ) {
     const ahora = new Date().getTime() / 1000;
     return ( fechaExp < ahora );
  }

}
