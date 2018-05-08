import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

// Pipes Modulo
import { PipesModule } from './../pipes/pipes.module';


@NgModule(
{
    imports: [RouterModule, CommonModule, PipesModule],
    declarations: [BreadcrumbsComponent, HeaderComponent, NopagefoundComponent, SidebarComponent],
    exports : [BreadcrumbsComponent, HeaderComponent, NopagefoundComponent, SidebarComponent]
})
export class SharedModule { }
/* OJO, para poder utilizarlo en los componentes involucrados en este módulo:
    - RouterModule se necesita para RouterLink, RouterLinkActive,
    - CommonModule para los ngIfs, Pipes, etc
 */
