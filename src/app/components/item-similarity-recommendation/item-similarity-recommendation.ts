import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Info } from 'lucide-angular';
import { ModelInfo } from '../model-info/model-info';

@Component({
  selector: 'app-item-similarity-recommendation',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    ModelInfo
  ],
  templateUrl: './item-similarity-recommendation.html',
  styleUrl: './item-similarity-recommendation.css',
})
export class ItemSimilarityRecommendation {
  @Input() medium: string ='';

  showInfo: boolean = false;
  id: string = '';
  readonly Info = Info;

  info_title: string = 'Item Similarity Recommendation'
  info_description: string = 'Recommend movies that are similar to the selected movies based on similarity of title, genre and tags using sentence transform (all-MiniLM-L6-v2) aka SBERT.'
}
