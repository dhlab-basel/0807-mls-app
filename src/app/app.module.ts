import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LemmataComponent} from './components/lemmata/lemmata.component';
import {HomeComponent} from './components/home/home.component';
import {LexicaComponent} from './components/lexica/lexica.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule, MatFormFieldControl } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {SparqlPrep} from './classes/sparql-prep';
import {AindexComponent} from './components/aindex/aindex.component';
import {LemmaComponent} from './components/lemma/lemma.component';
import {AppInitService} from './app-init.service';
import {LexiconComponent} from './components/lexicon/lexicon.component';
import {LexFromLemmaComponent} from './components/lex-from-lemma/lex-from-lemma.component';
import {ArticleComponent} from './components/article/article.component';
import {InfoComponent} from './components/info/info.component';
import {BackButtonDirective} from './directives/back-button.directive';
import {AboutComponent} from './components/about/about.component';
import {NewsItemsComponent} from './components/news-items/news-items.component';
import {DatePipe} from '@angular/common';
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EditResourceComponent} from './components/knora/edit-resource/edit-resource.component';
import {ValueEditComponent} from './components/knora/value-edit/value-edit.component';
import {TheprojectComponent} from './components/theproject/theproject.component';
import {KnoraStringInputComponent} from './components/knora/knora-string-input/knora-string-input.component';
import {KnoraListInputComponent} from './components/knora/knora-list-input/knora-list-input.component';
import {ConfirmDialogComponent} from './components/knora/confirm-dialog/confirm-dialog.component';
import {KnoraLinkInputComponent} from './components/knora/knora-link-input/knora-link-input.component';
import {CreateResourceComponent} from './components/knora/create-resource/create-resource/create-resource.component';
import {KnoraTextInputComponent} from './components/knora/knora-text-input/knora-text-input.component';
import { EditartComponent } from './components/editart/editart.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LemmaselectComponent } from './components/lemmaselect/lemmaselect.component';
import { EditlemComponent } from './components/editlem/editlem.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { EditlexComponent } from './components/editlex/editlex.component';
import { EditnewsComponent } from './components/editnews/editnews.component';
import { MatFileUploadModule } from 'angular-material-fileupload';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {SafePipe} from './pipes/safe.pipe';
import { NewsitemViewerComponent } from './components/newsitem-viewer/newsitem-viewer.component';

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
    KnoraStringInputComponent,
    KnoraListInputComponent,
    KnoraLinkInputComponent,
    CreateResourceComponent,
    KnoraTextInputComponent,
    EditartComponent,
    LemmaselectComponent,
    EditlemComponent,
    EditlexComponent,
    EditnewsComponent,
    SafePipe,
    NewsitemViewerComponent,
  ],
  entryComponents: [
    LoginComponent,
    EditResourceComponent,
    CreateResourceComponent,
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
    MatTooltipModule,
    HttpClientModule,
    MatExpansionModule,
    MatGridListModule,
    MatGridListModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    CKEditorModule,
    ClipboardModule,
    MatFileUploadModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppInitService], multi: true
    },
    {provide: MatFormFieldControl, useExisting: KnoraStringInputComponent},
    SparqlPrep,
    DatePipe,
    SafePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

