import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { Home } from './pages/home/home';
import { SelectMethod } from './pages/select-method/select-method';
import { Recommendation } from './pages/recommend/recommendation';
import { Compare } from './pages/compare/compare';
import { About } from './pages/about/about';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // layout wraps these pages
    children: [
      { path: '', component: Home },
      { path: 'select-method/:medium', component: SelectMethod },
      { path: 'recommend/:medium/:model', component: Recommendation },
      { path: 'compare/:medium', component: Compare },
      { path: 'about', component: About },
    ]
  }
];