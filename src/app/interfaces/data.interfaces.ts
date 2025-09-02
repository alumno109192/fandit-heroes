// Interfaces principales para aplicar principios SOLID

export interface IDataSource<T> {
  get(params?: any): Observable<T[]>;
  getById(id: number): Observable<T>;
  search(query: string): Observable<T[]>;
}

export interface IHeroDataSource extends IDataSource<Hero> {
  getHeroes(limit?: number, offset?: number, nameStartsWith?: string): Observable<Hero[]>;
  getHeroById(id: number): Observable<Hero>;
  searchHeroes(query: string): Observable<Hero[]>;
}

export interface ISeriesDataSource extends IDataSource<Serie> {
  getSeries(limit?: number): Observable<Serie[]>;
  getHeroSeries(heroId: number, limit?: number): Observable<Serie[]>;
  getSeriesById(id: number): Observable<Serie>;
}

export interface IConfigurationService {
  getApiConfig(): ApiConfiguration;
  isApiAvailable(): boolean;
}

export interface IImageService {
  getHeroImageUrl(hero: Hero, size?: ImageSize): string;
  getSeriesImageUrl(series: Serie, size?: ImageSize): string;
}

export interface IToggleService {
  getCurrentMode(): DataMode;
  setMode(mode: DataMode): void;
  getModeObservable(): Observable<DataMode>;
  toggleMode(): void;
}

// Types y Enums
export enum DataMode {
  MOCK = 'MOCK',
  API = 'API'
}

export enum ImageSize {
  SMALL = 'portrait_small',
  MEDIUM = 'portrait_medium', 
  LARGE = 'portrait_xlarge',
  INCREDIBLE = 'portrait_incredible',
  STANDARD_SMALL = 'standard_small',
  STANDARD_MEDIUM = 'standard_medium',
  STANDARD_LARGE = 'standard_large',
  STANDARD_XLARGE = 'standard_xlarge'
}

export interface ApiConfiguration {
  baseUrl: string;
  publicKey: string;
  privateKey: string;
  timeout: number;
}

export interface SearchParams {
  query?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
}

export interface HeroSearchParams extends SearchParams {
  nameStartsWith?: string;
}

export interface SeriesSearchParams extends SearchParams {
  titleStartsWith?: string;
  startYear?: number;
}

// Importar tipos existentes
import { Observable } from 'rxjs';
import { Hero, Serie } from '../models/hero.model';
