// src/app/layout/layout.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="bg-background-default">
      <!-- Page content -->
      <main>
        <router-outlet></router-outlet> <!-- Pages get rendered here -->
      </main>
    </div>
  `
})
export class LayoutComponent {}
