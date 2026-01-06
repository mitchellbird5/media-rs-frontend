import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-model-info',
  imports: [],
  templateUrl: './model-info.html',
  styleUrl: './model-info.css',
})
export class ModelInfo {
  @Input() title: string = '';
  @Input() description: string = '';
}
