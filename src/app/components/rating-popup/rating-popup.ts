import { 
  Component, 
  Input,
  ViewChild,
  TemplateRef 
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rating-popup',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './rating-popup.html',
  styleUrl: './rating-popup.css',
})
export class RatingPopup {
  @Input() name!: string;
  @Input() onRatingInput!: (v: number) => void;

  rating = 0;

  @ViewChild('addRatingPopup', { static: true })
  template!: TemplateRef<any>;

  submit() {
    if (this.rating >= 0 && this.rating <= 5) {
      this.onRatingInput(this.rating);
    }
  }
}
