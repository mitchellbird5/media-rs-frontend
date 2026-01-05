import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { Home } from './pages/home/home';
import { Movies } from './pages/movies/movies';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // layout wraps these pages
    children: [
      { path: '', component: Home },
      { path: 'movies', component: Movies },
      // add more pages here
    ]
  }
];