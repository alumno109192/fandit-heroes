import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Serie, Hero } from '../../models/hero.model';
import { MarvelService } from '../../services/marvel-solid.service';
import { ImageService } from '../../services/image.service';
import { DataMode, ImageSize } from '../../interfaces/data.interfaces';
import { LogUtils } from '../../utils/common.utils';

/**
 * Componente de detalle de serie siguiendo principios SOLID
 * SRP: Se enfoca únicamente en mostrar detalles de una serie específica
 * DIP: Depende de abstracciones (servicios) no de implementaciones
 */
@Component({
  selector: 'app-series-detail-solid',
  templateUrl: './series-detail-solid.component.html',
  styleUrls: ['./series-detail-solid.component.scss']
})
export class SeriesDetailSolidComponent implements OnInit, OnDestroy {
  
  serie: Serie | null = null;
  relatedHeroes: Hero[] = [];
  isLoading = true;
  error: string | null = null;
  seriesId: number = 0;
  
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marvelService: MarvelService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.loadSeriesFromRoute();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Carga la serie basándose en el ID de la ruta
   */
  private loadSeriesFromRoute(): void {
    const routeSubscription = this.route.params.subscribe(params => {
      this.seriesId = +params['id'];
      if (this.seriesId) {
        this.loadSeriesDetail();
      } else {
        this.handleError('ID de serie inválido');
      }
    });

    this.subscriptions.add(routeSubscription);
  }

  /**
   * Carga los detalles de la serie y héroes relacionados
   */
  private loadSeriesDetail(): void {
    this.isLoading = true;
    this.error = null;

    // Como no tenemos un getSeriesById, vamos a simular obtener la serie
    // En una implementación real, necesitaríamos este método en el servicio
    this.loadMockSeriesDetail();
  }

  /**
   * Simula la carga de detalle de serie (para implementación mock)
   */
  private loadMockSeriesDetail(): void {
    const seriesSubscription = this.marvelService.getSeries(10).subscribe({
      next: (series) => {
        this.serie = series.find(s => s.id === this.seriesId) || null;
        if (this.serie) {
          this.loadRelatedHeroes();
          LogUtils.log(`Cargado detalle de la serie: ${this.serie.title}`, 'SeriesDetailSolidComponent');
        } else {
          this.handleError('Serie no encontrada');
        }
      },
      error: (error) => {
        this.handleError('Error al cargar la serie');
        LogUtils.error(error, 'SeriesDetailSolidComponent.loadSeriesDetail');
      }
    });

    this.subscriptions.add(seriesSubscription);
  }

  /**
   * Carga héroes relacionados
   */
  private loadRelatedHeroes(): void {
    const heroesSubscription = this.marvelService.getHeroes(3).subscribe({
      next: (heroes) => {
        this.relatedHeroes = heroes;
        this.isLoading = false;
        LogUtils.log(`Cargados ${heroes.length} héroes relacionados`, 'SeriesDetailSolidComponent');
      },
      error: (error) => {
        this.relatedHeroes = [];
        this.isLoading = false;
        LogUtils.error(error, 'SeriesDetailSolidComponent.loadRelatedHeroes');
      }
    });

    this.subscriptions.add(heroesSubscription);
  }

  /**
   * Maneja errores de carga
   */
  private handleError(message: string): void {
    this.error = message;
    this.isLoading = false;
  }

  /**
   * Obtiene la URL de imagen de la serie
   */
  getSeriesImageUrl(): string {
    if (!this.serie) return '';
    return this.imageService.getSeriesImageUrl(this.serie, ImageSize.LARGE);
  }

  /**
   * Obtiene la URL de imagen de un héroe
   */
  getHeroImageUrl(hero: Hero): string {
    return this.imageService.getHeroImageUrl(hero, ImageSize.LARGE);
  }

  /**
   * Navega a los detalles de un héroe
   */
  onHeroClick(hero: Hero): void {
    LogUtils.log(`Navegando a héroe: ${hero.name}`, 'SeriesDetailSolidComponent');
    this.router.navigate(['/hero', hero.id]);
  }

  /**
   * Vuelve a la lista principal
   */
  goBack(): void {
    this.router.navigate(['/heroes']);
  }

  /**
   * Formatea la descripción de la serie
   */
  getFormattedDescription(): string {
    if (!this.serie?.description) {
      return 'No hay descripción disponible para esta serie.';
    }
    return this.serie.description;
  }

  /**
   * Obtiene información de años de la serie
   */
  getSeriesYears(): string {
    if (!this.serie) return '';
    
    if (this.serie.startYear && this.serie.endYear) {
      return `${this.serie.startYear} - ${this.serie.endYear}`;
    } else if (this.serie.startYear) {
      return `${this.serie.startYear} - Presente`;
    }
    
    return 'Años no disponibles';
  }

  /**
   * Obtiene el rating formateado
   */
  getFormattedRating(): string {
    return this.serie?.rating || 'No clasificado';
  }

  /**
   * Obtiene el número de comics
   */
  getComicsCount(): number {
    return this.serie?.comics?.available || 0;
  }
}
