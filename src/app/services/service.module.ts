import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SettingsService, SidebarService, SharedService,
         UsuarioService, LoginGuardGuard, HospitalService,
         MedicoService,
         AdminGuard} from './service.index';
import { SubirArchivoService } from './subir-archivo/subir-archivo.service';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [ LoginGuardGuard, SettingsService, SidebarService,
    SharedService, SubirArchivoService, UsuarioService, HospitalService,
     ModalUploadService, MedicoService, AdminGuard ],
  declarations: []
})
export class ServiceModule { }
