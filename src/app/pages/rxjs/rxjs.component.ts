import { Component, OnInit, OnDestroy } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {
    this.subscription = this.regresaObservable()
    .subscribe(numero => {
                    console.log('Subs ', numero);
                  },
                  error => {
                    console.log('Error en el obs ', error);
                  },
                  () => {
                    console.log('El observador ha terminado');
                  }
                );
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
      console.log('Llamando el onDestroy');
  }

  regresaObservable(): Observable<any> {
    return new Observable( observer => {
            let contador = 0;
            const intervalo = setInterval( () => {
              contador += 1;

              const salida = { valor: contador };

              // observer.next(contador);
              observer.next(salida);

              /*if (contador === 3 ) {
                clearInterval(intervalo);
                observer.complete();
              }*/
              // if (contador === 2 ) {
              //  observer.error('Auxilio!');
              // }
            }, 500);
      })
      .retry(2)
      .map( (resp: any) => resp.valor)
      .filter( (valor, index) => {
            return (valor % 2 === 1 );
      });
  }

}
