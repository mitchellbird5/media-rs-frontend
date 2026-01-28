import { 
  Component,
  WritableSignal,
  signal,
  InputSignal,
  Signal,
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
import { SearchParameters } from '../../components/models/search-parameters/search-parameters';
import { ResultComparison } from '../../components/results/result-comparison/result-comparison';

import { 
  ModelParameters,
  ModelType, 
  ModelTitles,
  ModelMetaData,
  nullMetaData 
} from '../../types/model.types';
import { MediumType, isMediumType } from '../../types/medium.type';


@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    LucideAngularModule,
    CompareModelParams,
    SearchParameters,
    ResultComparison
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
  routeMedium!: MediumType;
  medium: InputSignal<MediumType | null> = input<MediumType | null>(null);
  loading: WritableSignal<boolean> = signal(false);
  numRecommendations: WritableSignal<number> = signal(10);
  width: string = '600px';

  readonly Loader = Loader;
  readonly MediumType = MediumType;
  readonly ModelType = ModelType;
  readonly ModelTitles = ModelTitles;

  allRecommendationsReady: Signal<boolean> = computed(() => {
    return Object.values(this.modelData()).every(
      model => model.recommendationsReady === true
    );
  });

  shownModelCount = computed(() => {
    return Object.values(this.modelData())
      .filter(model => model.show)
      .length;
  });

  modelEntries = computed(() => {
    return Object.entries(this.modelData()) as [
      ModelType,
      ModelParameters
    ][];
  });


  modelData: WritableSignal<{ [modelName: string]: ModelParameters }> = signal({
    "item-similarity": {
      show: false,
      results: [],
      loading: false,
      recommendFn: null,
      recommendationsReady: false,
      metaData: nullMetaData[ModelType.ItemSimilarity]
    },
    "item-item-cf": {
      show: false,
      results: [],
      loading: false,
      recommendFn: null,
      recommendationsReady: false,
      metaData: nullMetaData[ModelType.ItemItemCF]
    },
    "user-user-cf": {
      show: false,
      results: [],
      loading: false,
      recommendFn: null,
      recommendationsReady: false,
      metaData: nullMetaData[ModelType.UserUserCF]
    },
    "hybrid": {
      show: false,
      results: [],
      loading: false,
      recommendFn: null,
      recommendationsReady: false,
      metaData: nullMetaData[ModelType.Hybrid]
    }
  });

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


  trackByModelType(index: number, entry: [ModelType, ModelParameters]): ModelType {
    return entry[0];
  }


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

  onNumRecommendationsChange(numRecommendations: number) {
    console.log(`Changing number of recommendations from ${this.numRecommendations()} to ${numRecommendations}`)
    this.numRecommendations.set(numRecommendations);
  }

  onResultsChange(modelName: string, results: string[]) {
    console.log(`Compare received results for ${modelName}:`, results);
    this.updateModel(modelName, { results: [...results] });
  }

  onRecommendFnReady(modelName: string, recommendFn: RecommendFn) {
    console.log(`Compare received recommendFn for ${modelName}`);
    this.updateModel(modelName, { recommendFn });
  }

  onLoading(modelName: string, loading: boolean) {
    this.updateModel(modelName, { loading });
  }

  onShow(modelName: string, show: boolean) {
    this.updateModel(modelName, { show });
  }

  onRecommendationsReady(modelName: string, recommendationsReady: boolean) {
    const currentModel = this.modelData()[modelName];
    if (currentModel.recommendationsReady !== recommendationsReady) {
      this.updateModel(modelName, { recommendationsReady });
    }
  }

  onMetaDataChange(modelName: string, metaData: ModelMetaData) {
    console.log(`Updating metaData for ${modelName}: `, metaData);
    this.updateModel(modelName, { metaData });
  }

  async recommendFn() {
    const models = this.modelData();

    const calls: Promise<unknown>[] = [];

    for (const [modelName, model] of Object.entries(models)) {
      if (!model.show) continue;

      if (!model.recommendFn) continue;

      try {
        // recommendFn returns a promise, so just push it directly
        calls.push(model.recommendFn());
      } catch (err) {
        console.error(`RecommendFn failed for model: ${modelName}`, err);
      }
    }

    if (calls.length) {
      await Promise.all(calls);
    }
  }
}
