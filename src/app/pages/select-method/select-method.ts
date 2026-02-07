import { Component, signal } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-select-method',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './select-method.html',
  styleUrl: './select-method.css',
})
export class SelectMethod {
  medium;

  constructor(private route: ActivatedRoute) {
    this.medium = toSignal(
      this.route.paramMap.pipe(
        map(params => params.get('medium') || '')
      ),
      { initialValue: '' }
    );
  }

  singularize(word: string): string {
    return word.replace(/s$/i, '');
  }
}