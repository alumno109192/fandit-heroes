import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Hero, Serie } from '../../models/hero.model';
import { MarvelService } from '../../services/marvel-solid.service';
import { ImageService } from '../../services/image.service';
import { DataMode, ImageSize } from '../../interfaces/data.interfaces';
import { LogUtils } from '../../utils/common.utils';

/**
 * Componente de detalle de héroe siguiendo principios SOLID
 * SRP: Se enfoca únicamente en mostrar detalles de un héroe específico
 * DIP: Depende de abstracciones (servicios) no de implementaciones
 */
@Component({
  selector: 'app-hero-detail-solid',
  templateUrl: './hero-detail-solid.component.html',
  styleUrls: ['./hero-detail-solid.component.scss']
})
export class HeroDetailSolidComponent implements OnInit, OnDestroy {
  
  hero: Hero | null = null;
  relatedSeries: Serie[] = [];
  isLoading = true;
  error: string | null = null;
  heroId: number = 0;
  
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marvelService: MarvelService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.loadHeroFromRoute();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Carga el héroe basándose en el ID de la ruta
   */
  private loadHeroFromRoute(): void {
    const routeSubscription = this.route.params.subscribe(params => {
      this.heroId = +params['id'];
      if (this.heroId) {
        this.loadHeroDetail();
      } else {
        this.handleError('ID de héroe inválido');
      }
    });

    this.subscriptions.add(routeSubscription);
  }

  /**
   * Carga los detalles del héroe y series relacionadas
   */
  private loadHeroDetail(): void {
    this.isLoading = true;
    this.error = null;

    const heroSubscription = this.marvelService.getHeroById(this.heroId).subscribe({
      next: (hero) => {
        this.hero = hero;
        this.loadRelatedSeries();
        LogUtils.log(`Cargado detalle del héroe: ${hero.name}`, 'HeroDetailSolidComponent');
      },
      error: (error) => {
        this.handleError('Error al cargar el héroe');
        LogUtils.error(error, 'HeroDetailSolidComponent.loadHeroDetail');
      }
    });

    this.subscriptions.add(heroSubscription);
  }

  /**
   * Carga series relacionadas
   */
  private loadRelatedSeries(): void {
    const seriesSubscription = this.marvelService.getSeries(3).subscribe({
      next: (series) => {
        this.relatedSeries = series;
        this.isLoading = false;
        LogUtils.log(`Cargadas ${series.length} series relacionadas`, 'HeroDetailSolidComponent');
      },
      error: (error) => {
        this.relatedSeries = [];
        this.isLoading = false;
        LogUtils.error(error, 'HeroDetailSolidComponent.loadRelatedSeries');
      }
    });

    this.subscriptions.add(seriesSubscription);
  }

  /**
   * Maneja errores de carga
   */
  private handleError(message: string): void {
    this.error = message;
    this.isLoading = false;
  }

  /**
   * Obtiene la URL de imagen del héroe
   */
  getHeroImageUrl(): string {
    if (!this.hero) return '';
    return this.imageService.getHeroImageUrl(this.hero, ImageSize.LARGE);
  }

  /**
   * Obtiene la URL de imagen de una serie
   */
  getSeriesImageUrl(serie: Serie): string {
    return this.imageService.getSeriesImageUrl(serie, ImageSize.LARGE);
  }

  /**
   * Navega a los detalles de una serie
   */
  onSeriesClick(serie: Serie): void {
    LogUtils.log(`Navegando a serie: ${serie.title}`, 'HeroDetailSolidComponent');
    this.router.navigate(['/series', serie.id]);
  }

  /**
   * Vuelve a la lista de héroes
   */
  goBack(): void {
    this.router.navigate(['/heroes']);
  }

  /**
   * Formatea la descripción del héroe
   */
  getFormattedDescription(): string {
    if (!this.hero?.description) {
      return 'No hay descripción disponible para este héroe.';
    }
    return this.hero.description;
  }

  /**
   * Obtiene información de estadísticas del héroe
   */
  getHeroStats(): { label: string, value: number }[] {
    if (!this.hero) return [];
    
    return [
      { label: 'Comics', value: this.hero.comics.available || 0 },
      { label: 'Series', value: this.hero.series.available || 0 },
      { label: 'Historias', value: this.hero.stories.available || 0 }
    ];
  }
}
