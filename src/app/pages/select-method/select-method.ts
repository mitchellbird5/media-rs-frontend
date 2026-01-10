import { Component, Input } from '@angular/core';
import { RouterModule, ActivatedRoute  } from '@angular/router';

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
  medium!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.medium = this.route.snapshot.paramMap.get('medium')!;
  }
}
