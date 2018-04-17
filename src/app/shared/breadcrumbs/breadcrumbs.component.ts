import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  label: string = '';

  constructor( private router: Router,
               public title: Title,
               public meta: Meta ) {

    this.getDataRoute()
    .subscribe( data => {
      this.label = data.titulo;
      this.title.setTitle(data.titulo);

      const metaTag: MetaDefinition = {
        name: 'description',
        content: this.label
      };
      this.meta.updateTag(metaTag);

    });

// Lo de arriba es una simplificación de :
/*
    this.router.events
        .filter( evento => {
                return evento instanceof ActivationEnd;
              } )
        .filter( (evento: ActivationEnd) => {
                return evento.snapshot.firstChild === null;
              } )
        .subscribe( event => { console.log(event); } );
*/

   }

   getDataRoute() {
     return  this.router.events
     .filter( evento => evento instanceof ActivationEnd )
     .filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null )
     .map( (evento: ActivationEnd) => evento.snapshot.data );
   }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

}
