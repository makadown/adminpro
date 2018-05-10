import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SettingsService, SidebarService, SharedService, UsuarioService, LoginGuardGuard } from './service.index';
import { SubirArchivoService } from './subir-archivo/subir-archivo.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [ LoginGuardGuard, SettingsService, SidebarService,
    SharedService, SubirArchivoService, UsuarioService ],
  declarations: []
})
export class ServiceModule { }
