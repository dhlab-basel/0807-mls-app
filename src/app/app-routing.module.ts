import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './components/home/home.component';
import { LemmataComponent} from './components/lemmata/lemmata.component';
import { LexicaComponent} from './components/lexica/lexica.component';

const routes: Routes = [{
  path: 'home',
  component: HomeComponent
}, {
  path: 'lemmata',
  component: LemmataComponent
}, {
  path: 'lexica',
  component: LexicaComponent
}, {
  path: '**',
  redirectTo: '/home'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
