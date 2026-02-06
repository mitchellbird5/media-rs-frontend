import { 
  Component,
  Input 
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookDetailPopup } from '../../detail-popup/book-detail-popup/book-detail-popup';
import { PopupDirective } from '../../../popup-card/popup-directive/popup-directive';

import { BookData } from '../../../../types/medium.type';

@Component({
  selector: 'app-book-result-card',
  imports: [
    CommonModule,
    PopupDirective
  ],
  templateUrl: './book-result-card.html',
  styleUrls: [
    '../../../../styles/result-card.css'
  ],
})
export class BookResultCard {
    @Input() book!: BookData;
    @Input() animationDelay: string = '0s';
  
    readonly BookDetailPopup = BookDetailPopup;
}
