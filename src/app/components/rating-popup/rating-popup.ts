import { 
  Component, 
  Input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SliderComponent } from '../slider/slider';

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
  @Input() close!: () => void;


  rating: number = 0;

  submit() {
    if (this.rating >= 0 && this.rating <= 5) {
      this.onRatingInput(this.rating);
      this.close?.();
      this.rating = 0; // Reset after submit
    }
  }
}
