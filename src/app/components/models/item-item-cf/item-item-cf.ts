import { 
  Component, 
  Input, 
  signal,
  Output,
  EventEmitter,
  WritableSignal 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Info, 
} from 'lucide-angular';
import { ActivatedRoute, RouterModule  } from '@angular/router';

import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { fetchItemItemCFRecommendations } from '../../../services/recommend/get-item-item-cf-recommendation';
import { ModelInfo } from '../../model-info/model-info';
import { ItemItemCFInputs } from './item-item-cf-inputs/item-item-cf-inputs';

import { RecommendFn } from '../../../types/movies.types';

@Component({
  selector: 'app-item-item-cf',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    PopupDirective,
    CommonModule,
    ModelInfo,
    RouterModule,
    ItemItemCFInputs
  ],
  templateUrl: './item-item-cf.html',
  styleUrls: ['../../../styles/model.css'],
})
export class ItemItemCF {
  @Input() medium!: string;
  @Input() width: string = '400px';
  @Input() numRecommendations!: number;

  selectedItem: WritableSignal<string | null> = signal(null);

  @Output() recommendFnReady = new EventEmitter<RecommendFn>();
  @Output() resultsChange = new EventEmitter<string[]>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.recommendFnReady.emit(this.recommend);
  }

  readonly Info = Info;

  info_title = 'Item-Item Collaborative Filtering Recommendation';
  info_description =
    `Recommend items that are commonly rated high by users who also enjoyed this particular item.`;

  onItemSelected(item: string | null) {
    this.selectedItem.set(item);
  }

  onResultsChange(results: string[]) {
    this.resultsChange.emit(results);
  }

  private recommend: RecommendFn = async () => {
    const query = this.selectedItem()
    if (!query) return;
    const results =
      await fetchItemItemCFRecommendations(
        query,
        this.numRecommendations
      );

    this.onResultsChange(results ?? []);

  }
}
