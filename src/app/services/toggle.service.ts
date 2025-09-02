import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IToggleService, DataMode } from '../interfaces/data.interfaces';
import { SUCCESS_MESSAGES } from '../constants/app.constants';

/**
 * Servicio especializado en gestión del toggle de datos siguiendo SRP
 * Se encarga únicamente del estado y cambio entre modos Mock/API
 */
@Injectable({
  providedIn: 'root'
})
export class ToggleService implements IToggleService {
  
  // Estado privado del modo actual
  private readonly currentMode = new BehaviorSubject<DataMode>(DataMode.MOCK);
  
  // Observable público para suscripciones
  public readonly mode$ = this.currentMode.asObservable();

  constructor() {
    // Log inicial del modo
    this.logModeChange(this.getCurrentMode());
  }

  /**
   * Obtiene el modo actual
   * @returns Modo actual (MOCK o API)
   */
  getCurrentMode(): DataMode {
    return this.currentMode.value;
  }

  /**
   * Establece un modo específico
   * @param mode Modo a establecer
   */
  setMode(mode: DataMode): void {
    if (this.isValidMode(mode) && mode !== this.getCurrentMode()) {
      this.currentMode.next(mode);
      this.logModeChange(mode);
    }
  }

  /**
   * Obtiene el observable del modo para suscripciones
   * @returns Observable del modo actual
   */
  getModeObservable(): Observable<DataMode> {
    return this.mode$;
  }

  /**
   * Alterna entre los modos disponibles
   */
  toggleMode(): void {
    const newMode = this.getCurrentMode() === DataMode.MOCK 
      ? DataMode.API 
      : DataMode.MOCK;
    
    this.setMode(newMode);
  }

  /**
   * Verifica si está en modo Mock
   * @returns true si está en modo Mock
   */
  isMockMode(): boolean {
    return this.getCurrentMode() === DataMode.MOCK;
  }

  /**
   * Verifica si está en modo API
   * @returns true si está en modo API
   */
  isApiMode(): boolean {
    return this.getCurrentMode() === DataMode.API;
  }

  /**
   * Obtiene el nombre del modo actual para mostrar en UI
   * @returns Nombre legible del modo
   */
  getCurrentModeDisplayName(): string {
    const mode = this.getCurrentMode();
    return mode === DataMode.MOCK ? '10 personajes fijos' : 'API en tiempo real';
  }

  /**
   * Obtiene descripción del modo actual
   * @returns Descripción del modo para UI
   */
  getCurrentModeDescription(): string {
    const mode = this.getCurrentMode();
    
    if (mode === DataMode.MOCK) {
      return 'Usando datos locales para demostración. Funciona sin conexión a internet.';
    } else {
      return 'Intentando conectar con Marvel API. Requiere conexión a internet.';
    }
  }

  /**
   * Obtiene todos los modos disponibles
   * @returns Array con todos los modos
   */
  getAvailableModes(): DataMode[] {
    return Object.values(DataMode);
  }

  /**
   * Valida si un modo es válido
   * @param mode Modo a validar
   * @returns true si es válido
   */
  private isValidMode(mode: DataMode): boolean {
    return Object.values(DataMode).includes(mode);
  }

  /**
   * Log del cambio de modo para debugging
   * @param mode Nuevo modo
   */
  private logModeChange(mode: DataMode): void {
    const message = mode === DataMode.MOCK 
      ? SUCCESS_MESSAGES.MODE.SWITCHED_TO_MOCK
      : SUCCESS_MESSAGES.MODE.SWITCHED_TO_API;
    
    console.log(`🔄 ${message}: ${this.getCurrentModeDisplayName()}`);
  }

  /**
   * Resetea al modo por defecto (Mock debido a API indisponible)
   */
  resetToDefault(): void {
    this.setMode(DataMode.MOCK);
  }

  /**
   * Fuerza modo Mock (útil cuando API falla)
   */
  forceMockMode(): void {
    this.setMode(DataMode.MOCK);
    console.warn('⚠️ Forzado modo Mock debido a problemas con API');
  }
}
