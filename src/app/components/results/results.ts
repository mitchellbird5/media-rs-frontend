import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ResultCard } from "./result-card/result-card";
import { fetchMovieImages, MovieImage } from "../../services/movieSearch";

@Component({
  selector: "app-results",
  standalone: true,
  imports: [CommonModule, ResultCard],
  templateUrl: "./results.html",
  styleUrls: ["./results.css"],
})
export class Results {
  images: (MovieImage | undefined)[] = []; // one image per movie

  private _results: string[] = [];
  @Input()
  set results(value: string[]) {
    this._results = value || [];
    if (this._results.length > 0) {
      this.fetchAndSetImages(this._results);
    } else {
      this.images = [];
    }
  }
  get results() {
    return this._results;
  }

  async fetchAndSetImages(results: string[]) {
    // Fetch all images at once (backend now supports multiple)
    const imagesForAll = await fetchMovieImages(results);

    // Ensure ordering matches input results
    this.images = results.map(
      (title) => imagesForAll.find((img) => img.title === title) || undefined
    );
  }

  getFullImageUrl(file_path?: string | null) {
    console.log(file_path)
    return file_path ? `https://image.tmdb.org/t/p/w500${file_path}` : '';
  }
}
