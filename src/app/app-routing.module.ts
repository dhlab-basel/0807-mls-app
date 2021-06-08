import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LemmataComponent} from './components/lemmata/lemmata.component';
import {LemmaComponent} from './components/lemma/lemma.component';
import {LexicaComponent} from './components/lexica/lexica.component';
import {LexiconComponent} from './components/lexicon/lexicon.component';
import {ArticleComponent} from './components/article/article.component';
import {InfoComponent} from './components/info/info.component';
import {AboutComponent} from './components/about/about.component';
import {TheprojectComponent} from './components/theproject/theproject.component';
import {EditartComponent} from './components/editart/editart.component';
import {EditlemComponent} from './components/editlem/editlem.component';
import {EditlexComponent} from './components/editlex/editlex.component';
import {EditnewsComponent} from './components/editnews/editnews.component';
import {NewsItemsComponent} from './components/news-items/news-items.component';
import {NewsitemViewerComponent} from './components/newsitem-viewer/newsitem-viewer.component';

const routes: Routes = [{
  path: 'home',
  component: HomeComponent
}, {
  path: 'lemmata',
  component: LemmataComponent
}, {
  path: 'info',
  component: InfoComponent
}, {
  path: 'lemma/:iri',
  component: LemmaComponent
}, {
  path: 'lexica',
  component: LexicaComponent
}, {
  path: 'lexicon/:iri',
  component: LexiconComponent
}, {
  path: 'article/:iri',
  component: ArticleComponent
}, {
  path: 'editart/:iri',
  component: EditartComponent
}, {
  path: 'editart',
  component: EditartComponent
}, {
  path: 'editlem/:iri',
  component: EditlemComponent
}, {
  path: 'editlem',
  component: EditlemComponent
}, {
  path: 'editlex/:iri',
  component: EditlexComponent
}, {
  path: 'editlex',
  component: EditlexComponent
}, {
  path: 'editnews/:iri',
  component: EditnewsComponent
}, {
  path: 'editnews',
  component: EditnewsComponent
}, {
  path: 'allnews',
  component: NewsItemsComponent
}, {
  path: 'newsitem/:iri',
  component: NewsitemViewerComponent
}, {
  path: 'about',
  component: AboutComponent
}, {
  path: 'theproject',
  component: TheprojectComponent
}, {
  path: '**',
  redirectTo: '/home'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
