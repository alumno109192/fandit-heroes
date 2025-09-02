import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { Hero, Serie } from '../models/hero.model';
import { HeroDataSourceFactory } from './hero-data-source.factory';
import { ToggleService } from './toggle.service';
import { ImageService } from './image.service';
import { ConfigurationService } from './configuration.service';
import { IHeroDataSource, DataMode, ImageSize } from '../interfaces/data.interfaces';
import { LogUtils, ValidationUtils } from '../utils/common.utils';
import { UI_CONSTANTS } from '../constants/app.constants';

/**
 * MarvelService refactorizado siguiendo principios SOLID
 * 
 * SRP: Se enfoca únicamente en coordinar servicios y proveer una API unificada
 * OCP: Extensible a través de nuevos data sources sin modificar código existente
 * LSP: Los data sources son intercambiables
 * ISP: Usa interfaces específicas para cada responsabilidad
 * DIP: Depende de abstracciones, no de implementaciones concretas
 */
@Injectable({
  providedIn: 'root'
})
export class MarvelService {
  
  // Subject para búsquedas reactivas
  private readonly searchSubject = new BehaviorSubject<string>('');
  
  // Data source actual
  private currentDataSource: IHeroDataSource;

  constructor(
    private dataSourceFactory: HeroDataSourceFactory,
    private toggleService: ToggleService,
    private imageService: ImageService,
    private configService: ConfigurationService
  ) {
    // Inicializar data source
    this.currentDataSource = this.dataSourceFactory.createDataSource();
    
    // Suscribirse a cambios de modo para actualizar data source
    this.initializeDataSourceReactivity();
    
    // Configurar búsqueda reactiva
    this.initializeReactiveSearch();
  }

  // === MÉTODOS PRINCIPALES DE HÉROES ===

  /**
   * Obtiene lista de héroes
   * @param limit Límite de resultados
   * @param offset Offset para paginación  
   * @param nameStartsWith Filtro por nombre
   * @returns Observable con héroes
   */
  getHeroes(limit: number = 20, offset: number = 0, nameStartsWith?: string): Observable<Hero[]> {
    LogUtils.log(`MarvelService.getHeroes: limit=${limit}, offset=${offset}, filter=${nameStartsWith}`, 'MarvelService');
    
    const validLimit = ValidationUtils.validateLimit(limit);
    const validOffset = ValidationUtils.validateOffset(offset);
    
    return this.currentDataSource.getHeroes(validLimit, validOffset, nameStartsWith);
  }

  /**
   * Obtiene un héroe por ID
   * @param id ID del héroe
   * @returns Observable con el héroe
   */
  getHeroById(id: number): Observable<Hero> {
    LogUtils.log(`MarvelService.getHeroById: ${id}`, 'MarvelService');
    
    if (!ValidationUtils.isValidId(id)) {
      throw new Error('ID de héroe inválido');
    }
    
    return this.currentDataSource.getHeroById(id);
  }

  /**
   * Busca héroes por término
   * @param query Término de búsqueda
   * @returns Observable con resultados
   */
  searchHeroes(query: string): Observable<Hero[]> {
    LogUtils.log(`MarvelService.searchHeroes: "${query}"`, 'MarvelService');
    
    if (!ValidationUtils.isValidSearchQuery(query)) {
      return this.getHeroes(0, 0); // Retorna lista vacía si query inválida
    }
    
    return this.currentDataSource.searchHeroes(query);
  }

  // === MÉTODOS DE SERIES (Placeholder para futuro) ===

  /**
   * Obtiene series de un héroe
   * @param heroId ID del héroe
   * @param limit Límite de resultados
   * @returns Observable con series
   */
  getHeroSeries(heroId: number, limit: number = 3): Observable<Serie[]> {
    LogUtils.log(`MarvelService.getHeroSeries: heroId=${heroId}, limit=${limit}`, 'MarvelService');
    
    return new Observable<Serie[]>(subscriber => {
      this.getMockSeries().subscribe(allSeries => {
        // Siempre incluimos "Marvel Heroes United" (id: 3001) como primera serie relacionada
        const heroesUnitedSeries = allSeries.find((serie: Serie) => serie.id === 3001);
        let relatedSeries: Serie[] = [];
        
        if (heroesUnitedSeries) {
          relatedSeries.push(heroesUnitedSeries);
        }
        
        // Agregamos otras series hasta completar el límite
        const otherSeries = allSeries.filter((serie: Serie) => serie.id !== 3001);
        const remainingSlots = Math.max(0, limit - relatedSeries.length);
        relatedSeries = [...relatedSeries, ...otherSeries.slice(0, remainingSlots)];
        
        LogUtils.log(`Retornando ${relatedSeries.length} series relacionadas para héroe ${heroId}`, 'MarvelService');
        subscriber.next(relatedSeries);
        subscriber.complete();
      });
    });
  }

  /**
   * Obtiene series populares
   * @param limit Límite de resultados
   * @returns Observable con series
   */
  getSeries(limit: number = 10): Observable<Serie[]> {
    LogUtils.log(`MarvelService.getSeries: limit=${limit}`, 'MarvelService');
    
    // TODO: Implementar con SeriesDataSource
    return this.getMockSeries();
  }

  // === MÉTODOS DE IMÁGENES ===

  /**
   * Obtiene URL de imagen de héroe
   * @param hero Héroe
   * @param size Tamaño deseado
   * @returns URL de imagen
   */
  getHeroImageUrl(hero: Hero, size: ImageSize = ImageSize.LARGE): string {
    return this.imageService.getHeroImageUrl(hero, size);
  }

  /**
   * Obtiene URL de imagen de serie
   * @param series Serie
   * @param size Tamaño deseado
   * @returns URL de imagen
   */
  getSeriesImageUrl(series: Serie, size: ImageSize = ImageSize.LARGE): string {
    return this.imageService.getSeriesImageUrl(series, size);
  }

  // === MÉTODOS DE TOGGLE Y MODO ===

  /**
   * Observable del modo actual
   */
  get useMockData$(): Observable<DataMode> {
    return this.toggleService.getModeObservable();
  }

  /**
   * Alterna entre modos Mock/API
   */
  toggleDataSource(): void {
    LogUtils.log('MarvelService.toggleDataSource', 'MarvelService');
    this.toggleService.toggleMode();
  }

  /**
   * Establece modo específico
   * @param useMock true para Mock, false para API
   */
  setMockMode(useMock: boolean): void {
    const mode = useMock ? DataMode.MOCK : DataMode.API;
    LogUtils.log(`MarvelService.setMockMode: ${mode}`, 'MarvelService');
    this.toggleService.setMode(mode);
  }

  /**
   * Obtiene modo actual (compatibilidad)
   * @returns true si es Mock
   */
  getCurrentMode(): boolean {
    return this.toggleService.isMockMode();
  }

  /**
   * Obtiene nombre del modo actual
   * @returns Nombre del modo
   */
  getCurrentModeString(): string {
    return this.toggleService.getCurrentModeDisplayName();
  }

  // === MÉTODOS DE BÚSQUEDA REACTIVA ===

  /**
   * Establece término de búsqueda reactiva
   * @param term Término de búsqueda
   */
  setSearchTerm(term: string): void {
    LogUtils.log(`MarvelService.setSearchTerm: "${term}"`, 'MarvelService');
    this.searchSubject.next(term);
  }

  /**
   * Observable de resultados de búsqueda reactiva
   * @returns Observable con resultados
   */
  getSearchResults(): Observable<Hero[]> {
    return this.searchSubject.pipe(
      debounceTime(UI_CONSTANTS.SEARCH.DEBOUNCE_TIME),
      switchMap(term => this.searchHeroes(term))
    );
  }

  // === MÉTODOS DE UTILIDAD ===

  /**
   * Verifica si está en modo Mock
   * @returns true si es Mock
   */
  isMockMode(): boolean {
    return this.toggleService.isMockMode();
  }

  /**
   * Verifica si está en modo API
   * @returns true si es API
   */
  isApiMode(): boolean {
    return this.toggleService.isApiMode();
  }

  /**
   * Obtiene información del modo actual
   * @returns Información detallada del modo
   */
  getCurrentModeInfo(): { 
    mode: DataMode; 
    displayName: string; 
    description: string; 
  } {
    const mode = this.toggleService.getCurrentMode();
    return {
      mode,
      displayName: this.toggleService.getCurrentModeDisplayName(),
      description: this.toggleService.getCurrentModeDescription()
    };
  }

  // === MÉTODOS PRIVADOS ===

  /**
   * Inicializa la reactividad del data source
   */
  private initializeDataSourceReactivity(): void {
    this.toggleService.getModeObservable().subscribe(mode => {
      LogUtils.log(`Cambio de modo detectado: ${mode}`, 'MarvelService');
      this.currentDataSource = this.dataSourceFactory.createDataSourceForMode(mode);
    });
  }

  /**
   * Inicializa la búsqueda reactiva
   */
  private initializeReactiveSearch(): void {
    this.searchSubject.pipe(
      debounceTime(UI_CONSTANTS.SEARCH.DEBOUNCE_TIME),
      switchMap(term => this.searchHeroes(term))
    ).subscribe(results => {
      LogUtils.log(`Búsqueda reactiva completada: ${results.length} resultados`, 'MarvelService');
    });
  }

  /**
   * Obtiene series mock (temporal)
   * @returns Observable con series mock
   */
  private getMockSeries(): Observable<Serie[]> {
    const mockSeries: Serie[] = [
      {
        id: 1945,
        title: 'Avengers (1963 - 1996)',
        description: 'The first Avengers series.',
        thumbnail: {
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/9/20/5102c774ebae7',
          extension: 'jpg'
        },
        startYear: 1963,
        endYear: 1996,
        rating: 'T',
        comics: { available: 354, items: [] }
      },
      {
        id: 2069,
        title: 'Spider-Man (1990 - 1998)',
        description: 'Classic Spider-Man adventures.',
        thumbnail: {
          path: 'https://m.media-amazon.com/images/I/81aRXFZ6d-L._UF1000,1000_QL80_',
          extension: 'jpg'
        },
        startYear: 1990,
        endYear: 1998,
        rating: 'T',
        comics: { available: 98, items: [] }
      },
      {
        id: 3001,
        title: 'Marvel Heroes United (2019 - Present)',
        description: 'La serie épica que une a todos los héroes de Marvel en una batalla cósmica contra las fuerzas del mal. Desde Iron Man hasta Spider-Man, todos los héroes deben unir sus fuerzas para proteger el universo.',
        thumbnail: {
          path: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          extension: 'jpg'
        },
        startYear: 2019,
        endYear: 2025,
        rating: 'T+',
        comics: { available: 156, items: [] }
      }
    ];

    return new Observable(subscriber => {
      subscriber.next(mockSeries);
      subscriber.complete();
    });
  }
}
