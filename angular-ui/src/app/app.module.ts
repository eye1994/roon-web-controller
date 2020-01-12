import { environment } from './../environments/environment.prod';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {
  MatListModule, MatProgressBarModule, MatTabsModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule
} from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

const config: SocketIoConfig = { url: environment.API_URL, options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatListModule,
    MatProgressBarModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FontAwesomeModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [ CookieService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
