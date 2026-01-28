import { 
  Component, 
  signal,
  input,
  WritableSignal,
  InputSignal,
  computed
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
import { ModelType, isModelType } from '../../types/model.types';
import { MediumType, isMediumType } from '../../types/medium.type';

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
  medium!: MediumType;
  model!: ModelType;

  width: string = '600px';
  results: WritableSignal<string[]> = signal([]);
  numRecommendations: WritableSignal<number> = signal(10);
  loading: WritableSignal<boolean> = signal(false);
  recommendFn: WritableSignal<RecommendFn | null> = signal(null);
  recommendationsReady: WritableSignal<boolean> = signal(true);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const mediumParam = this.route.snapshot.paramMap.get('medium');
    const modelParam = this.route.snapshot.paramMap.get('model');

    if (!mediumParam || !isMediumType(mediumParam)) {
      throw new Error(`Invalid medium '${mediumParam}'`);
    }
    if (!modelParam || !isModelType(modelParam)) {
      throw new Error(`Invalid recommendation model '${modelParam}'`);
    }

    this.medium = mediumParam;
    this.model = modelParam;
  }

  onLoading(loading: boolean) {
    this.loading.set(loading);
  }

  onNumRecommendationsChange(value: number) {
    console.log(`Updating number of recommendations in recommendation from ${this.numRecommendations} to ${value}`);
    this.numRecommendations.set(value);
  }
}
