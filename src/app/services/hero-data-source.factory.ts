import { Injectable } from '@angular/core';
import { IHeroDataSource, DataMode } from '../interfaces/data.interfaces';
import { MockHeroDataSource } from './data-sources/mock-hero.data-source';
import { ApiHeroDataSource } from './data-sources/api-hero.data-source';
import { ToggleService } from './toggle.service';
import { LogUtils } from '../utils/common.utils';

/**
 * Factory para Data Sources siguiendo Factory Pattern y DIP
 * Permite crear el data source apropiado según el modo actual
 * Facilita la extensión futura con nuevos tipos de data sources
 */
@Injectable({
  providedIn: 'root'
})
export class HeroDataSourceFactory {

  constructor(
    private mockDataSource: MockHeroDataSource,
    private apiDataSource: ApiHeroDataSource,
    private toggleService: ToggleService
  ) {}

  /**
   * Crea el data source apropiado según el modo actual
   * @returns Data source configurado
   */
  createDataSource(): IHeroDataSource {
    const mode = this.toggleService.getCurrentMode();
    return this.createDataSourceForMode(mode);
  }

  /**
   * Crea un data source para un modo específico
   * @param mode Modo deseado
   * @returns Data source apropiado
   */
  createDataSourceForMode(mode: DataMode): IHeroDataSource {
    LogUtils.log(`Creando data source para modo: ${mode}`, 'HeroDataSourceFactory');

    switch (mode) {
      case DataMode.MOCK:
        return this.createMockDataSource();
      
      case DataMode.API:
        return this.createApiDataSource();
      
      default:
        LogUtils.warn(`Modo desconocido: ${mode}, usando Mock por defecto`, 'HeroDataSourceFactory');
        return this.createMockDataSource();
    }
  }

  /**
   * Crea data source Mock
   * @returns Mock data source configurado
   */
  private createMockDataSource(): IHeroDataSource {
    LogUtils.log('Creando Mock Data Source', 'HeroDataSourceFactory');
    return this.mockDataSource;
  }

  /**
   * Crea data source API
   * @returns API data source configurado
   */
  private createApiDataSource(): IHeroDataSource {
    LogUtils.log('Creando API Data Source', 'HeroDataSourceFactory');
    return this.apiDataSource;
  }

  /**
   * Obtiene todos los tipos de data source disponibles
   * @returns Array con los tipos disponibles
   */
  getAvailableDataSourceTypes(): DataMode[] {
    return [DataMode.MOCK, DataMode.API];
  }

  /**
   * Verifica si un tipo de data source está disponible
   * @param mode Modo a verificar
   * @returns true si está disponible
   */
  isDataSourceAvailable(mode: DataMode): boolean {
    switch (mode) {
      case DataMode.MOCK:
        return true; // Mock siempre disponible
      
      case DataMode.API:
        // Verificar si API está configurada (se podría hacer más validaciones)
        return true; // Por ahora siempre disponible, la lógica de fallback está en el data source
      
      default:
        return false;
    }
  }

  /**
   * Obtiene descripción de un tipo de data source
   * @param mode Modo a describir
   * @returns Descripción legible
   */
  getDataSourceDescription(mode: DataMode): string {
    switch (mode) {
      case DataMode.MOCK:
        return 'Datos locales predefinidos (10 héroes). Funciona sin conexión a internet.';
      
      case DataMode.API:
        return 'Datos en tiempo real desde Marvel API. Requiere conexión a internet.';
      
      default:
        return 'Tipo de data source desconocido';
    }
  }

  /**
   * Crea data source con fallback automático
   * Intenta crear el data source solicitado, pero regresa a Mock si falla
   * @param preferredMode Modo preferido
   * @returns Data source con fallback
   */
  createDataSourceWithFallback(preferredMode: DataMode): IHeroDataSource {
    try {
      if (this.isDataSourceAvailable(preferredMode)) {
        return this.createDataSourceForMode(preferredMode);
      }
    } catch (error) {
      LogUtils.error(error, 'HeroDataSourceFactory.createDataSourceWithFallback');
    }

    // Fallback a Mock
    LogUtils.warn(`Fallback a Mock desde modo: ${preferredMode}`, 'HeroDataSourceFactory');
    this.toggleService.forceMockMode();
    return this.createMockDataSource();
  }

  /**
   * Crea data source reactivo que cambia automáticamente con el toggle
   * @returns Data source que responde a cambios de modo
   */
  createReactiveDataSource(): IHeroDataSource {
    // Por ahora retorna el data source actual
    // En una implementación más avanzada podría crear un wrapper reactivo
    return this.createDataSource();
  }
}
