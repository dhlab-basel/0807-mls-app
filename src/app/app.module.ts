import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LemmataComponent } from './components/lemmata/lemmata.component';
import { HomeComponent } from './components/home/home.component';
import { LexicaComponent } from './components/lexica/lexica.component';
import { MatToolbarModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatDividerModule} from '@angular/material';
import { MatTableModule} from '@angular/material';
import { MatPaginatorModule} from '@angular/material';
import { MatProgressBarModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { SparqlPrep } from './classes/sparql-prep';
import { AindexComponent } from './components/aindex/aindex.component';

@NgModule({
  declarations: [
    AppComponent,
    LemmataComponent,
    HomeComponent,
    LexicaComponent,
    AindexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatInputModule,
    MatFormFieldModule,
    HttpClientModule,
  ],
  providers: [
    SparqlPrep
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
