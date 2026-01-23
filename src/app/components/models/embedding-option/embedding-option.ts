import { 
  Component,
  EventEmitter,
  Output 
} from '@angular/core';
import { 
  LucideAngularModule, 
  Search, 
  Info,
} from 'lucide-angular';

import { PopupDirective } from '../../popup-card/popup-directive/popup-directive';
import { ModelInfo } from '../../model-info/model-info';
import { EmbeddingMethod } from '../../../types/model.types';

@Component({
  selector: 'app-embedding-option',
  imports: [
    LucideAngularModule,
    PopupDirective,
    ModelInfo
  ],
  templateUrl: './embedding-option.html',
  styleUrls: [
    './embedding-option.css',
    '../../../styles/model.css'
  ]
})
export class EmbeddingOption {
  @Output() embeddingSelected = new EventEmitter<EmbeddingMethod>();
  selectedEmbedding: EmbeddingMethod = 'SBERT';

  readonly Search = Search;
  readonly Info = Info;

  description: string = 'Select an option for how to calculate item embeddings. SBERT is a sentence transformer, this is best used for short, varied, or nuanced descriptions. TF-IDF is a simpler text analysis method, best for matching key words and recommending items from the same franchise.';

  selectEmbedding(embedding: EmbeddingMethod) {
    this.selectedEmbedding = embedding;
    this.embeddingSelected.emit(embedding);
  }
}
