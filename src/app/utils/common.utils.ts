import * as CryptoJS from 'crypto-js';
import { Observable, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap, finalize } from 'rxjs/operators';
import { ERROR_MESSAGES, MOCK_IDS } from '../constants/app.constants';

/**
 * Utilidades para autenticación de Marvel API
 */
export class AuthUtils {
  
  /**
   * Genera los parámetros de autenticación para Marvel API
   * @param publicKey Clave pública de Marvel
   * @param privateKey Clave privada de Marvel
   * @returns Objeto con parámetros de autenticación
   */
  static generateAuthParams(publicKey: string, privateKey: string): AuthParams {
    const timestamp = Date.now().toString();
    const hash = CryptoJS.MD5(timestamp + privateKey + publicKey).toString();
    
    return {
      ts: timestamp,
      apikey: publicKey,
      hash: hash
    };
  }

  /**
   * Construye query string desde objeto de parámetros
   * @param params Objeto con parámetros
   * @returns Query string formateado
   */
  static buildQueryString(params: Record<string, any>): string {
    return Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }
}

/**
 * Utilidades para validación de datos
 */
export class ValidationUtils {
  
  /**
   * Valida si un ID es un ID de mock
   * @param id ID a validar
   * @returns true si es un ID de mock
   */
  static isMockId(id: number): boolean {
    return MOCK_IDS.includes(id as any);
  }

  /**
   * Valida si una query de búsqueda es válida
   * @param query Query a validar
   * @returns true si es válida
   */
  static isValidSearchQuery(query: string): boolean {
    if (!query || typeof query !== 'string') return false;
    return query.trim().length >= 2;
  }

  /**
   * Valida si un número es un ID válido
   * @param id ID a validar
   * @returns true si es válido
   */
  static isValidId(id: any): boolean {
    return typeof id === 'number' && id > 0 && Number.isInteger(id);
  }

  /**
   * Valida límites de paginación
   * @param limit Límite a validar
   * @param maxLimit Límite máximo permitido
   * @returns Límite validado
   */
  static validateLimit(limit: number, maxLimit: number = 100): number {
    if (!limit || limit <= 0) return 20; // Default
    return Math.min(limit, maxLimit);
  }

  /**
   * Valida offset de paginación
   * @param offset Offset a validar
   * @returns Offset validado
   */
  static validateOffset(offset: number): number {
    return Math.max(0, offset || 0);
  }
}

/**
 * Utilidades para manejo de errores
 */
export class ErrorUtils {
  
  /**
   * Crea un mensaje de error estandarizado
   * @param error Error original
   * @param context Contexto donde ocurrió el error
   * @returns Mensaje de error legible
   */
  static createErrorMessage(error: any, context: string): string {
    if (!error) return ERROR_MESSAGES.API.GENERIC;
    
    // Error de red
    if (error.status === 0) {
      return ERROR_MESSAGES.API.NETWORK_ERROR;
    }
    
    // Error de timeout
    if (error.name === 'TimeoutError') {
      return ERROR_MESSAGES.API.TIMEOUT;
    }
    
    // Error de autorización
    if (error.status === 401 || error.status === 403) {
      return ERROR_MESSAGES.API.UNAUTHORIZED;
    }
    
    // Error de recurso no encontrado
    if (error.status === 404) {
      return ERROR_MESSAGES.API.NOT_FOUND;
    }
    
    // Error genérico
    return `${ERROR_MESSAGES.API.GENERIC} (${context})`;
  }

  /**
   * Operador RxJS para retry con backoff exponencial
   * @param maxRetries Número máximo de reintentos
   * @returns Operador RxJS
   */
  static retryWithBackoff(maxRetries: number = 3) {
    return (source: Observable<any>) => source.pipe(
      retryWhen(errors => 
        errors.pipe(
          mergeMap((error, index) => {
            if (index >= maxRetries) {
              return throwError(error);
            }
            
            const delay = Math.pow(2, index) * 1000; // Backoff exponencial
            console.warn(`⚠️ Reintento ${index + 1}/${maxRetries} en ${delay}ms`);
            return timer(delay);
          })
        )
      )
    );
  }
}

/**
 * Utilidades para formateo de datos
 */
export class FormatUtils {
  
  /**
   * Formatea un rango de años para series
   * @param startYear Año de inicio
   * @param endYear Año de fin
   * @returns Rango formateado
   */
  static formatYearRange(startYear?: number, endYear?: number): string {
    if (!startYear) return 'N/A';
    
    if (endYear && endYear !== startYear) {
      return `${startYear} - ${endYear}`;
    }
    
    return startYear.toString();
  }

  /**
   * Trunca texto a una longitud específica
   * @param text Texto a truncar
   * @param maxLength Longitud máxima
   * @returns Texto truncado
   */
  static truncateText(text: string, maxLength: number = 200): string {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Capitaliza la primera letra de cada palabra
   * @param text Texto a capitalizar
   * @returns Texto capitalizado
   */
  static capitalizeWords(text: string): string {
    if (!text) return '';
    
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  /**
   * Formatea números con separadores de miles
   * @param num Número a formatear
   * @returns Número formateado
   */
  static formatNumber(num: number): string {
    if (typeof num !== 'number') return '0';
    return num.toLocaleString();
  }
}

/**
 * Utilidades para logging mejorado
 */
export class LogUtils {
  
  /**
   * Log con contexto para desarrollo
   * @param message Mensaje a mostrar
   * @param context Contexto del log
   * @param data Datos adicionales
   */
  static log(message: string, context: string = '', data?: any): void {
    if (!this.shouldLog()) return;
    
    const timestamp = new Date().toISOString();
    const prefix = context ? `[${context}]` : '';
    
    console.log(`🔍 ${timestamp} ${prefix} ${message}`, data || '');
  }

  /**
   * Log de error con contexto
   * @param error Error a loggear
   * @param context Contexto del error
   */
  static error(error: any, context: string = ''): void {
    const timestamp = new Date().toISOString();
    const prefix = context ? `[${context}]` : '';
    
    console.error(`❌ ${timestamp} ${prefix} Error:`, error);
  }

  /**
   * Log de warning
   * @param message Mensaje de warning
   * @param context Contexto
   */
  static warn(message: string, context: string = ''): void {
    const timestamp = new Date().toISOString();
    const prefix = context ? `[${context}]` : '';
    
    console.warn(`⚠️ ${timestamp} ${prefix} ${message}`);
  }

  /**
   * Verifica si debe hacer logging (solo en desarrollo)
   * @returns true si debe hacer log
   */
  private static shouldLog(): boolean {
    return !environment.production;
  }
}

// Interfaces para las utilidades
export interface AuthParams {
  ts: string;
  apikey: string;
  hash: string;
}

// Import para environment
import { environment } from '../../environments/environment';
