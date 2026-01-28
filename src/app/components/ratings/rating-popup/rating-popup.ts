import { 
  Component, 
  Input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SliderComponent } from '../../slider/slider';

@Component({
  selector: 'app-rating-popup',
  standalone: true,
  imports: [
    FormsModule,
    SliderComponent
  ],
  templateUrl: './rating-popup.html',
  styleUrl: './rating-popup.css',
})
export class RatingPopup {
  @Input() name!: string;
  @Input() onRatingInput!: (v: number) => void;

  rating: number = 0;

  submit(event?: Event) {
    event?.stopPropagation();

    if (this.rating >= 0 && this.rating <= 5) {
      const ratingValue = this.rating;
      this.rating = 0;
      this.onRatingInput(ratingValue);
    }
  }
}
