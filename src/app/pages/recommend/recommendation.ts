import { 
  Component, 
  signal,
  WritableSignal,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
} from 'lucide-angular';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Results } from '../../components/results/results';
import { ItemSimilarity } from '../../components/models/item-similarity/item-similarity';
import { ItemItemCF } from '../../components/models/item-item-cf/item-item-cf';
import { UserUserCF } from '../../components/models/user-user-cf/user-user-cf';
import { Hybrid } from '../../components/models/hybrid/hybrid';
import { SearchParameters } from '../../components/models/search-parameters/search-parameters';
import { RecommendFn } from '../../types/movies.types';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    NgIf,
    Results,
    CommonModule,
    RouterModule,
    SearchParameters,
    ItemSimilarity,
    ItemItemCF,
    UserUserCF,
    Hybrid
  ],
  templateUrl: './recommendation.html',
  styleUrl: './recommendation.css',
})
export class Recommendation {
  medium!: string;
  model!: string;
  width: string = '600px';

  results: WritableSignal<string[]> = signal([]);
  numRecommendations: WritableSignal<number> = signal(10);
  recommendFn!: RecommendFn;

  recommendationsReady = signal(true);
  loadingRecommendations = signal(true);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.medium = this.route.snapshot.paramMap.get('medium')!;
    this.model = this.route.snapshot.paramMap.get('model')!;
  }

  onResultsChange(newResults: string[]) {
    this.results.set(newResults);
  }

  onResultsRendered(ready: boolean) {
    this.recommendationsReady.set(ready);
  }

  onNumRecommendationsSelected (value: number) {
    this.numRecommendations.set(value);
  }

  onRecommendFnReady(fn: RecommendFn) {
    this.recommendFn = fn;
  }

}
