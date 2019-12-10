import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LemmataComponent } from './components/lemmata/lemmata.component';
import { HomeComponent } from './components/home/home.component';
import { LexicaComponent } from './components/lexica/lexica.component';
import { MatButtonToggleModule, MatExpansionModule, MatGridListModule, MatToolbarModule} from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatDividerModule} from '@angular/material';
import { MatTableModule} from '@angular/material';
import { MatPaginatorModule} from '@angular/material';
import { MatProgressBarModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { SparqlPrep } from './classes/sparql-prep';
import { AindexComponent } from './components/aindex/aindex.component';
import { LemmaComponent } from './components/lemma/lemma.component';
import { AppInitService } from './app-init.service';
import { LexiconComponent } from './components/lexicon/lexicon.component';
import { LexFromLemmaComponent } from './components/lex-from-lemma/lex-from-lemma.component';
import { ArticleComponent } from './components/article/article.component';
import { InfoComponent } from './components/info/info.component';
import { BackButtonDirective } from './directives/back-button.directive';
import { AboutComponent } from './components/about/about.component';
import { NewsItemsComponent } from './components/news-items/news-items.component';
import { DatePipe } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditResourceComponent } from './components/knora/edit-resource/edit-resource.component';
import { ValueEditComponent } from './components/knora/string-value-edit/value-edit.component';
import { TheprojectComponent } from './components/theproject/theproject.component';
import { KnoraStringInputComponent } from './components/knora/knora-string-value/knora-string-input.component';
import { MatFormFieldControl } from "@angular/material/form-field";
import { ConfirmDialogComponent } from './components/knora/confirm-dialog/confirm-dialog.component';

export function initializeApp(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.Init();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LemmataComponent,
    HomeComponent,
    LexicaComponent,
    AindexComponent,
    LemmaComponent,
    LexiconComponent,
    LexFromLemmaComponent,
    ArticleComponent,
    InfoComponent,
    BackButtonDirective,
    AboutComponent,
    NewsItemsComponent,
    LoginComponent,
    EditResourceComponent,
    ValueEditComponent,
    TheprojectComponent,
    KnoraStringInputComponent,
    ConfirmDialogComponent,
  ],
  entryComponents: [
    LoginComponent,
    EditResourceComponent,
    ConfirmDialogComponent,
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
    MatMenuModule,
    MatButtonToggleModule,
    HttpClientModule,
    MatExpansionModule,
    MatGridListModule,
    MatGridListModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppInitService], multi: true
    },
    {provide: MatFormFieldControl, useExisting: KnoraStringInputComponent},
    SparqlPrep,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

