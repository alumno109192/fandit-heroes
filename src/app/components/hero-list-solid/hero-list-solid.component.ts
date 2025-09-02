import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Hero, Serie } from '../../models/hero.model';
import { MarvelService } from '../../services/marvel-solid.service';
import { ImageService } from '../../services/image.service';
import { ToggleService } from '../../services/toggle.service';
import { DataMode, ImageSize } from '../../interfaces/data.interfaces';
import { LogUtils } from '../../utils/common.utils';
import { UI_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-hero-list-solid',
  templateUrl: './hero-list-solid.component.html',
  styleUrls: ['./hero-list-solid.component.scss']
})
export class HeroListSolidComponent implements OnInit, OnDestroy {
  
  heroes: Hero[] = [];
  series: Serie[] = [];
  searchResults: Hero[] = [];
  isLoading = true;
  isSearching = false;
  currentMode: DataMode = DataMode.MOCK;
  searchTerm = '';
  
  private subscriptions = new Subscription();
  private readonly defaultLimit = UI_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE;

  constructor(
    private marvelService: MarvelService,
    private imageService: ImageService,
    private toggleService: ToggleService,
    private router: Router
  ) {}

  // === LIFECYCLE HOOKS ===

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }

  // === MÉTODOS PÚBLICOS ===

  /**
   * Maneja los resultados de búsqueda
   * @param results Resultados de la búsqueda
   */
  onSearchResults(results: Hero[]): void {
    LogUtils.log(`Recibidos ${results.length} resultados de búsqueda`, 'HeroListSolidComponent');
    this.searchResults = results;
    this.isSearching = results.length > 0;
  }

  /**
   * Maneja la selección de un héroe
   * @param hero Héroe seleccionado
   */
  onHeroSelected(hero: Hero): void {
    LogUtils.log(`Héroe seleccionado: ${hero.name}`, 'HeroListSolidComponent');
    this.router.navigate(['/hero', hero.id]);
  }

  /**
   * Maneja la selección de una serie
   * @param serie Serie seleccionada
   */
  onSeriesSelected(serie: Serie): void {
    LogUtils.log(`Serie seleccionada: ${serie.title}`, 'HeroListSolidComponent');
    this.router.navigate(['/series', serie.id]);
  }

  /**
   * Obtiene la URL de imagen para un héroe
   * @param hero Héroe
   * @returns URL de la imagen
   */
  getHeroImageUrl(hero: Hero): string {
    return this.imageService.getHeroImageUrl(hero, ImageSize.LARGE);
  }

  /**
   * Obtiene la URL de imagen para una serie
   * @param serie Serie
   * @returns URL de la imagen
   */
  getSeriesImageUrl(serie: Serie): string {
    return this.imageService.getSeriesImageUrl(serie, ImageSize.LARGE);
  }

  /**
   * Obtiene las primeras N series para el slider
   * @param count Número de series a obtener
   * @returns Array de series
   */
  getFirstSeries(count: number): Serie[] {
    return this.series.slice(0, count);
  }

  /**
   * Obtiene los héroes filtrados por término de búsqueda
   * @returns Array de héroes filtrados
   */
  getFilteredHeroes(): Hero[] {
    const currentHeroes = this.getCurrentHeroes();
    
    if (!this.searchTerm.trim()) {
      return currentHeroes;
    }
    
    return currentHeroes.filter(hero => 
      hero.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /**
   * Maneja el cambio en el término de búsqueda
   */
  onSearchChange(): void {
    LogUtils.log(`Término de búsqueda cambiado: ${this.searchTerm}`, 'HeroListSolidComponent');
    // La búsqueda se realiza reactivamente a través de getFilteredHeroes()
  }

  /**
   * Obtiene los héroes a mostrar (búsqueda o lista completa)
   * @returns Array de héroes a mostrar
   */
  getCurrentHeroes(): Hero[] {
    return this.isSearching ? this.searchResults : this.heroes;
  }

  /**
   * Obtiene información del modo actual
   * @returns Información del modo
   */
  getModeInfo(): string {
    return this.toggleService.getCurrentModeDisplayName();
  }

  /**
   * Verifica si está en modo Mock
   * @returns true si es Mock
   */
  isMockMode(): boolean {
    return this.currentMode === DataMode.MOCK;
  }

  /**
   * Obtiene el número total de héroes
   * @returns Número total
   */
  getTotalHeroes(): number {
    return this.getCurrentHeroes().length;
  }

  /**
   * Obtiene los primeros N héroes para el slider
   * @param count Número de héroes a obtener
   * @returns Array de héroes
   */
  getFirstHeroes(count: number): Hero[] {
    const currentHeroes = this.getCurrentHeroes();
    return currentHeroes.slice(0, count);
  }

  /**
   * Recarga los datos
   */
  reloadData(): void {
    LogUtils.log('Recargando datos', 'HeroListSolidComponent');
    this.loadHeroes();
    this.loadSeries();
  }

  // === MÉTODOS PRIVADOS ===

  /**
   * Inicializa el componente
   */
  private initializeComponent(): void {
    LogUtils.log('Inicializando HeroListSolidComponent', 'HeroListSolidComponent');
    
    this.loadHeroes();
    this.loadSeries();
    this.subscribeToModeChanges();
    this.subscribeToSearchResults();
  }

  /**
   * Carga la lista de héroes
   */
  private loadHeroes(): void {
    this.setLoadingState(true);
    
    const heroesSubscription = this.marvelService.getHeroes(this.defaultLimit).subscribe({
      next: (heroes) => {
        this.handleHeroesLoaded(heroes);
        this.setLoadingState(false);
      },
      error: (error) => {
        this.handleLoadError(error, 'héroes');
        this.setLoadingState(false);
      }
    });

    this.subscriptions.add(heroesSubscription);
  }

  /**
   * Carga la lista de series
   */
  private loadSeries(): void {
    const seriesSubscription = this.marvelService.getSeries(6).subscribe({
      next: (series) => {
        this.handleSeriesLoaded(series);
      },
      error: (error) => {
        this.handleLoadError(error, 'series');
      }
    });

    this.subscriptions.add(seriesSubscription);
  }

  /**
   * Maneja la carga exitosa de héroes
   * @param heroes Héroes cargados
   */
  private handleHeroesLoaded(heroes: Hero[]): void {
    LogUtils.log(`Cargados ${heroes.length} héroes`, 'HeroListSolidComponent');
    this.heroes = heroes;
    this.clearSearchResults();
  }

  /**
   * Maneja la carga exitosa de series
   * @param series Series cargadas
   */
  private handleSeriesLoaded(series: Serie[]): void {
    LogUtils.log(`Cargadas ${series.length} series`, 'HeroListSolidComponent');
    this.series = series;
  }

  /**
   * Maneja errores de carga
   * @param error Error ocurrido
   * @param context Contexto del error
   */
  private handleLoadError(error: any, context: string): void {
    LogUtils.error(error, `HeroListSolidComponent.load${context}`);
    // TODO: Mostrar mensaje de error al usuario usando un servicio de notificaciones
    console.error(`Error cargando ${context}:`, error);
  }

  /**
   * Se suscribe a cambios de modo
   */
  private subscribeToModeChanges(): void {
    const modeSubscription = this.toggleService.getModeObservable().subscribe(mode => {
      LogUtils.log(`Cambio de modo detectado: ${mode}`, 'HeroListSolidComponent');
      this.currentMode = mode;
      this.reloadData();
      this.clearSearchResults();
    });

    this.subscriptions.add(modeSubscription);
  }

  /**
   * Se suscribe a resultados de búsqueda reactiva
   */
  private subscribeToSearchResults(): void {
    const searchSubscription = this.marvelService.getSearchResults().subscribe(results => {
      this.onSearchResults(results);
    });

    this.subscriptions.add(searchSubscription);
  }

  /**
   * Establece el estado de carga
   * @param loading Estado de carga
   */
  private setLoadingState(loading: boolean): void {
    this.isLoading = loading;
  }

  /**
   * Limpia los resultados de búsqueda
   */
  clearSearchResults(): void {
    LogUtils.log('Limpiando resultados de búsqueda', 'HeroListSolidComponent');
    this.searchResults = [];
    this.isSearching = false;
  }

  /**
   * TrackBy function para optimizar renderizado
   * @param index Índice del elemento
   * @param hero Héroe
   * @returns ID único del héroe
   */
  trackByHeroId(index: number, hero: Hero): number {
    return hero.id;
  }

  /**
   * Trunca la descripción del héroe
   * @param description Descripción completa
   * @returns Descripción truncada
   */
  truncateDescription(description: string): string {
    if (!description) return 'Sin descripción disponible';
    return description.length > 150 ? description.substring(0, 150) + '...' : description;
  }

  /**
   * Maneja errores de carga de imagen
   * @param event Evento de error
   */
  onImageError(event: any): void {
    LogUtils.warn('Error cargando imagen, usando placeholder', 'HeroListSolidComponent');
    event.target.src = this.imageService.getFallbackImage();
  }

  /**
   * Limpia todas las suscripciones
   */
  private cleanupSubscriptions(): void {
    LogUtils.log('Limpiando suscripciones', 'HeroListSolidComponent');
    this.subscriptions.unsubscribe();
  }
}
