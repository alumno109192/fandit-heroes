import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroListComponent } from './components/hero-list/hero-list.component';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { HeroListSolidComponent } from './components/hero-list-solid/hero-list-solid.component';
import { HeroDetailSolidComponent } from './components/hero-detail-solid/hero-detail-solid.component';
import { SeriesDetailSolidComponent } from './components/series-detail-solid/series-detail-solid.component';

const routes: Routes = [
  { path: '', component: HeroListSolidComponent },
  { path: 'hero/:id', component: HeroDetailSolidComponent },
  { path: 'series/:id', component: SeriesDetailSolidComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
