import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result-card',
  imports: [CommonModule],
  templateUrl: './result-card.html',
  styleUrl: './result-card.css',
})
export class ResultCard implements OnChanges {
  @Input() result!: string;
  @Input() imageUrl?: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['imageUrl']) {
      console.log('Image URL changed:', this.imageUrl);
    }
  }
}