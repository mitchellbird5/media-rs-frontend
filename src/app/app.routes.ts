import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { Home } from './pages/home/home';
import { SelectMethod } from './pages/select-method/select-method';
import { ItemSimilarityRecommendation } from './components/recommend/item-similarity-recommendation/item-similarity-recommendation';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // layout wraps these pages
    children: [
      { path: '', component: Home },
      { path: 'select-method/:medium', component: SelectMethod },
      { path: 'item-similarity/:medium', component: ItemSimilarityRecommendation }
    ]
  }
];