import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MarvelService } from '../../services/marvel.service';
import { Hero, Serie } from '../../models/hero.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss']
})
export class HeroListComponent implements OnInit, OnDestroy {
  heroes: Hero[] = [];
  series: Serie[] = [];
  searchResults: Hero[] = [];
  isLoading = false;
  isSearching = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private marvelService: MarvelService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadHeroes();
    this.loadSeries();
    
    // Suscribirse a cambios de modo para recargar datos
    this.subscription.add(
      this.marvelService.useMockData$.subscribe(() => {
        console.log('🔄 Modo cambiado, recargando datos...');
        this.loadHeroes();
        this.loadSeries();
        // Limpiar búsqueda al cambiar modo
        this.searchResults = [];
        this.isSearching = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadHeroes(): void {
    this.isLoading = true;
    this.marvelService.getHeroes(20, 0).subscribe({
      next: (heroes) => {
        this.heroes = heroes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading heroes:', error);
        this.isLoading = false;
      }
    });
  }

  loadSeries(): void {
    this.marvelService.getSeries(10).subscribe({
      next: (series) => {
        this.series = series;
      },
      error: (error) => {
        console.error('Error loading series:', error);
      }
    });
  }

  onSearchResults(results: Hero[]): void {
    this.searchResults = results;
    this.isSearching = results.length > 0;
  }

  onHeroSelected(hero: Hero): void {
    this.router.navigate(['/hero', hero.id]);
  }

  viewHeroDetail(heroId: number): void {
    this.router.navigate(['/hero', heroId]);
  }

  getImageUrl(hero: Hero): string {
    return `${hero.thumbnail.path}/standard_xlarge.${hero.thumbnail.extension}`;
  }

  getCurrentHeroes(): Hero[] {
    return this.isSearching ? this.searchResults : this.heroes;
  }
}
