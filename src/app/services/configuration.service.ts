import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IConfigurationService, ApiConfiguration } from '../interfaces/data.interfaces';
import { API_CONSTANTS } from '../constants/app.constants';

/**
 * Servicio de configuración siguiendo el principio de Responsabilidad Única (SRP)
 * Se encarga únicamente de la gestión de configuraciones de la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService implements IConfigurationService {

  /**
   * Obtiene la configuración de la API Marvel
   * @returns Configuración completa de la API
   */
  getApiConfig(): ApiConfiguration {
    return {
      baseUrl: API_CONSTANTS.MARVEL.BASE_URL,
      publicKey: environment.marvelPublicKey || '',
      privateKey: environment.marvelPrivateKey || '',
      timeout: API_CONSTANTS.MARVEL.TIMEOUTS.DEFAULT
    };
  }

  /**
   * Verifica si la API está disponible basándose en las keys
   * @returns true si las keys están configuradas
   */
  isApiAvailable(): boolean {
    const config = this.getApiConfig();
    return !!(config.publicKey && config.privateKey);
  }

  /**
   * Obtiene la configuración de timeout para búsquedas
   * @returns Timeout en milisegundos
   */
  getSearchTimeout(): number {
    return API_CONSTANTS.MARVEL.TIMEOUTS.SEARCH;
  }

  /**
   * Obtiene el límite por defecto para héroes
   * @returns Límite numérico
   */
  getDefaultHeroLimit(): number {
    return API_CONSTANTS.MARVEL.DEFAULT_LIMITS.HEROES;
  }

  /**
   * Obtiene el límite por defecto para series
   * @returns Límite numérico
   */
  getDefaultSeriesLimit(): number {
    return API_CONSTANTS.MARVEL.DEFAULT_LIMITS.SERIES;
  }

  /**
   * Verifica si estamos en modo desarrollo
   * @returns true si es desarrollo
   */
  isDevelopment(): boolean {
    return !environment.production;
  }

  /**
   * Obtiene la configuración de debug
   * @returns true si debug está habilitado
   */
  isDebugEnabled(): boolean {
    return this.isDevelopment();
  }
}
