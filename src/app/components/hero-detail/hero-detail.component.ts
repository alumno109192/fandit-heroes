import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarvelService } from '../../services/marvel.service';
import { Hero, Serie } from '../../models/hero.model';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | null = null;
  relatedSeries: Serie[] = [];
  isLoading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marvelService: MarvelService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const heroId = +params['id'];
      if (heroId) {
        this.loadHeroDetail(heroId);
      }
    });
  }

  loadHeroDetail(heroId: number): void {
    this.isLoading = true;
    this.error = false;

    this.marvelService.getHeroById(heroId).subscribe({
      next: (hero) => {
        this.hero = hero;
        this.loadRelatedSeries(heroId);
      },
      error: (error) => {
        console.error('Error loading hero:', error);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  loadRelatedSeries(heroId: number): void {
    this.marvelService.getHeroSeries(heroId, 3).subscribe({
      next: (series) => {
        this.relatedSeries = series;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading series:', error);
        this.isLoading = false;
      }
    });
  }

  getHeroImageUrl(): string {
    if (!this.hero) return '';
    return `${this.hero.thumbnail.path}/portrait_incredible.${this.hero.thumbnail.extension}`;
  }

  getSerieImageUrl(serie: Serie): string {
    return `${serie.thumbnail.path}/portrait_xlarge.${serie.thumbnail.extension}`;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getYearRange(serie: Serie): string {
    if (serie.startYear && serie.endYear && serie.endYear !== serie.startYear) {
      return `${serie.startYear} - ${serie.endYear}`;
    } else if (serie.startYear) {
      return `${serie.startYear}`;
    }
    return 'N/A';
  }
}
