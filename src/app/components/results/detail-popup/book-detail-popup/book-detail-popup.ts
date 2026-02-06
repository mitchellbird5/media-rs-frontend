import { 
  Component,
  Input 
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookData } from '../../../../types/medium.type';

@Component({
  selector: 'app-book-detail-popup',
  imports: [
    CommonModule
  ],
  templateUrl: './book-detail-popup.html',
  styleUrls: [
    '../../../../styles/detail-popup.css'
  ],
})
export class BookDetailPopup {
  @Input() book!: BookData;
}
