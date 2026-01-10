import { 
  Component, 
  Input,
  ViewChild,
  TemplateRef 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Rating } from '../../services/recommend/get-user-user-cf-recommendation';

@Component({
  selector: 'app-rating-summary',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './rating-summary.html',
  styleUrl: './rating-summary.css',
})
export class RatingSummary {
  @Input() ratings: Rating[] = [];

  @ViewChild('ratingSummaryPopup', { static: true })
  template!: TemplateRef<any>;

  trackByName(_: number, rating: Rating) {
    return rating.name;
  }
}
