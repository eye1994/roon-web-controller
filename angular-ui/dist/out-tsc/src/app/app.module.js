import * as tslib_1 from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule } from 'ngx-socket-io';
import { MatListModule, MatProgressBarModule, MatTabsModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
const config = { url: 'http://0.0.0.0:8080', options: {} };
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    NgModule({
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
        providers: [CookieService],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map