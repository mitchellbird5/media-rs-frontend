import { 
  Component,
  WritableSignal,
  signal,
  InputSignal,
  input,
  computed 
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  LucideAngularModule, 
  Loader 
} from 'lucide-angular';

import { RecommendFn } from '../../types/movies.types';
import { CompareModelParams } from '../../components/compare/compare-model-params/compare-model-params';

import { ModelParameters, ModelType } from '../../types/model.types';
import { MediumType, isMediumType } from '../../types/medium.type';


@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    LucideAngularModule,
    CompareModelParams,
  ],
  templateUrl: './compare.html',
  styleUrls: [
    './compare.css',
    '../../styles/model.css',
    '../../styles/button.css',
    '../../components/models/search-parameters/search-parameters.css'
  ]
})
export class Compare {
  medium: InputSignal<MediumType | null> = input<MediumType | null>(null);
  routeMedium!: MediumType;
  width: string = '600px';

  readonly Loader = Loader;
  readonly MediumType = MediumType;
  readonly ModelType = ModelType;

  modelData: WritableSignal<{ [modelName: string]: ModelParameters }> = signal({
    "item-similarity": {
      show: false,
      results: [],
      loading: false,
      recommendFn: null,
      recommendationsReady: false
    },
    "item-item-cf": {
      show: false,
      results: [],
      loading: false,
      recommendFn: null,
      recommendationsReady: false
    },
    "user-user-cf": {
      show: false,
      results: [],
      loading: false,
      recommendFn: null,
      recommendationsReady: false
    },
    "hybrid": {
      show: false,
      results: [],
      loading: false,
      recommendFn: null,
      recommendationsReady: false
    }
  });

  numRecommendations: WritableSignal<number> = signal(10);
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const mediumParam = this.route.snapshot.paramMap.get('medium');

    if (!mediumParam || !isMediumType(mediumParam)) {
      throw new Error(`Invalid medium ${mediumParam}`);
    }

    this.routeMedium = mediumParam;
  }

  resolvedMedium = computed<MediumType>(() => {
    return this.medium() ?? this.routeMedium;
  });


  updateModel(modelName: string, newParams: Partial<ModelParameters>) {
    const current = this.modelData();
    this.modelData.set({
      ...current,
      [modelName]: {
        ...current[modelName],
        ...newParams
      }
    });
  }

  onResultsChange(modelName: string, results: string[]) {
    this.updateModel(modelName, { results });
  }

  onRecommendFnReady(modelName: string, recommendFn: RecommendFn) {
    this.updateModel(modelName, { recommendFn });
  }

  onLoading(modelName: string, loading: boolean) {
    this.updateModel(modelName, { loading });
  }

  onShow(modelName: string, show: boolean) {
    this.updateModel(modelName, { show });
  }
}
