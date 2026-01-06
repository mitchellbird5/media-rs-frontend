// src/app/layout/layout.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../components/header/header';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, Header],
  templateUrl: "./layout.html"
})
export class LayoutComponent {}
