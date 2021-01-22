import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HelpComponent} from './components/help/help.component';
import {AboutComponent} from './components/about/about.component';
import {MenuComponent} from './components/menu/menu.component';
import {GameComponent} from './components/game/game.component';

const routes: Routes = [
  {path: '', component: MenuComponent},
  {path: 'game', component: GameComponent},
  {path: 'help', component: HelpComponent},
  {path: 'about', component: AboutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
