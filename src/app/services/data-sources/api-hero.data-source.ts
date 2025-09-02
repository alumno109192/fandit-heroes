import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { IHeroDataSource } from '../../interfaces/data.interfaces';
import { Hero, MarvelResponse } from '../../models/hero.model';
import { ConfigurationService } from '../configuration.service';
import { AuthUtils, ValidationUtils, LogUtils, ErrorUtils } from '../../utils/common.utils';
import { API_CONSTANTS, ERROR_MESSAGES } from '../../constants/app.constants';

/**
 * Data Source para Marvel API siguiendo SRP y OCP
 * Se encarga únicamente de la comunicación con la API real de Marvel
 */
@Injectable({
  providedIn: 'root'
})
export class ApiHeroDataSource implements IHeroDataSource {

  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) {}

  // Implementación de IDataSource<Hero>
  get(params?: any): Observable<Hero[]> {
    return this.getHeroes(params?.limit, params?.offset, params?.nameStartsWith);
  }

  getById(id: number): Observable<Hero> {
    return this.getHeroById(id);
  }

  search(query: string): Observable<Hero[]> {
    return this.searchHeroes(query);
  }

  // Implementación de IHeroDataSource
  getHeroes(limit: number = 20, offset: number = 0, nameStartsWith?: string): Observable<Hero[]> {
    LogUtils.log(`Obteniendo héroes de API: limit=${limit}, offset=${offset}, search=${nameStartsWith}`, 'ApiHeroDataSource');
    
    if (!this.configService.isApiAvailable()) {
      return this.handleApiUnavailable('getHeroes');
    }

    const validLimit = ValidationUtils.validateLimit(limit);
    const validOffset = ValidationUtils.validateOffset(offset);

    const params = this.buildGetHeroesParams(validLimit, validOffset, nameStartsWith);
    const url = this.buildApiUrl(API_CONSTANTS.MARVEL.ENDPOINTS.CHARACTERS, params);

    return this.http.get<MarvelResponse>(url).pipe(
      timeout(this.configService.getSearchTimeout()),
      map(response => this.extractHeroesFromResponse(response)),
      catchError(error => this.handleApiError(error, 'getHeroes')),
      ErrorUtils.retryWithBackoff(2)
    );
  }

  getHeroById(id: number): Observable<Hero> {
    LogUtils.log(`Obteniendo héroe de API por ID: ${id}`, 'ApiHeroDataSource');
    
    if (!ValidationUtils.isValidId(id)) {
      return throwError(() => new Error(ERROR_MESSAGES.DATA.INVALID_ID));
    }

    if (!this.configService.isApiAvailable()) {
      return this.handleApiUnavailable('getHeroById');
    }

    const params = this.buildAuthParams();
    const url = this.buildApiUrl(`${API_CONSTANTS.MARVEL.ENDPOINTS.CHARACTERS}/${id}`, params);

    return this.http.get<MarvelResponse>(url).pipe(
      timeout(this.configService.getSearchTimeout()),
      map(response => this.extractSingleHeroFromResponse(response)),
      catchError(error => this.handleApiError(error, 'getHeroById')),
      ErrorUtils.retryWithBackoff(2)
    );
  }

  searchHeroes(query: string): Observable<Hero[]> {
    LogUtils.log(`Buscando héroes en API: "${query}"`, 'ApiHeroDataSource');
    
    if (!ValidationUtils.isValidSearchQuery(query)) {
      return of([]);
    }

    if (!this.configService.isApiAvailable()) {
      return this.handleApiUnavailable('searchHeroes');
    }

    const params = this.buildSearchParams(query);
    const url = this.buildApiUrl(API_CONSTANTS.MARVEL.ENDPOINTS.CHARACTERS, params);

    return this.http.get<MarvelResponse>(url).pipe(
      timeout(this.configService.getSearchTimeout()),
      map(response => this.extractHeroesFromResponse(response)),
      catchError(error => this.handleApiError(error, 'searchHeroes')),
      ErrorUtils.retryWithBackoff(2)
    );
  }

  /**
   * Construye parámetros para obtener héroes
   * @param limit Límite de resultados
   * @param offset Offset para paginación
   * @param nameStartsWith Filtro por nombre
   * @returns Objeto con parámetros
   */
  private buildGetHeroesParams(limit: number, offset: number, nameStartsWith?: string): Record<string, any> {
    const authParams = this.buildAuthParams();
    const queryParams: Record<string, any> = {
      ...authParams,
      limit,
      offset,
      orderBy: 'name'
    };

    if (nameStartsWith) {
      queryParams['nameStartsWith'] = nameStartsWith.trim();
    }

    return queryParams;
  }

  /**
   * Construye parámetros para búsqueda
   * @param query Término de búsqueda
   * @returns Objeto con parámetros
   */
  private buildSearchParams(query: string): Record<string, any> {
    const authParams = this.buildAuthParams();
    
    return {
      ...authParams,
      ['nameStartsWith']: query.trim(),
      limit: 10,
      orderBy: 'name'
    };
  }

  /**
   * Construye parámetros de autenticación
   * @returns Parámetros de auth
   */
  private buildAuthParams(): Record<string, any> {
    const config = this.configService.getApiConfig();
    return AuthUtils.generateAuthParams(config.publicKey, config.privateKey);
  }

  /**
   * Construye URL completa de la API
   * @param endpoint Endpoint específico
   * @param params Parámetros de query
   * @returns URL completa
   */
  private buildApiUrl(endpoint: string, params: Record<string, any>): string {
    const config = this.configService.getApiConfig();
    const queryString = AuthUtils.buildQueryString(params);
    return `${config.baseUrl}${endpoint}?${queryString}`;
  }

  /**
   * Extrae héroes de la respuesta de Marvel API
   * @param response Respuesta de la API
   * @returns Array de héroes
   */
  private extractHeroesFromResponse(response: MarvelResponse): Hero[] {
    if (!response?.data?.results) {
      LogUtils.warn('Respuesta de API sin datos válidos', 'ApiHeroDataSource');
      return [];
    }

    const heroes = response.data.results;
    LogUtils.log(`Extraídos ${heroes.length} héroes de la respuesta API`, 'ApiHeroDataSource');
    
    return heroes;
  }

  /**
   * Extrae un héroe único de la respuesta
   * @param response Respuesta de la API
   * @returns Héroe único
   */
  private extractSingleHeroFromResponse(response: MarvelResponse): Hero {
    const heroes = this.extractHeroesFromResponse(response);
    
    if (heroes.length === 0) {
      throw new Error(ERROR_MESSAGES.DATA.NO_HEROES_FOUND);
    }

    return heroes[0];
  }

  /**
   * Maneja errores de la API
   * @param error Error original
   * @param operation Operación que falló
   * @returns Observable con error
   */
  private handleApiError(error: HttpErrorResponse, operation: string): Observable<never> {
    const errorMessage = ErrorUtils.createErrorMessage(error, operation);
    LogUtils.error(error, `ApiHeroDataSource.${operation}`);
    
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Maneja el caso de API no disponible
   * @param operation Operación que se intentó
   * @returns Observable con error
   */
  private handleApiUnavailable(operation: string): Observable<never> {
    const error = new Error(ERROR_MESSAGES.API.NOT_AVAILABLE);
    LogUtils.error(error, `ApiHeroDataSource.${operation}`);
    
    return throwError(() => error);
  }

  /**
   * Verifica el estado de la API
   * @returns Promise con el estado
   */
  async checkApiStatus(): Promise<boolean> {
    try {
      if (!this.configService.isApiAvailable()) {
        return false;
      }

      const params = this.buildAuthParams();
      const url = this.buildApiUrl(API_CONSTANTS.MARVEL.ENDPOINTS.CHARACTERS, {
        ...params,
        limit: 1
      });

      await this.http.get(url).pipe(
        timeout(5000)
      ).toPromise();

      LogUtils.log('API Marvel disponible', 'ApiHeroDataSource');
      return true;

    } catch (error) {
      LogUtils.error(error, 'ApiHeroDataSource.checkApiStatus');
      return false;
    }
  }
}
