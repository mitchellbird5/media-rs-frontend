import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { ItemSimilarityRecommendation } from "../../components/item-similarity-recommendation/item-similarity-recommendation";

@Component({
  selector: 'app-movies',
  imports: [RouterModule, ItemSimilarityRecommendation],
  templateUrl: './movies.html',
  styleUrls: ['./movies.css'],
  //   template: `
  //   <h1>Movies Page</h1>
  //   <app-item-similarity-recommendation></app-item-similarity-recommendation>
  // `
})
export class Movies {

}
