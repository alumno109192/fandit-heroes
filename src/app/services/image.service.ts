import { Injectable } from '@angular/core';
import { IImageService, ImageSize } from '../interfaces/data.interfaces';
import { Hero, Serie } from '../models/hero.model';
import { UI_CONSTANTS } from '../constants/app.constants';

/**
 * Servicio especializado en gestión de imágenes siguiendo SRP
 * Se encarga únicamente de la construcción de URLs y gestión de imágenes
 */
@Injectable({
  providedIn: 'root'
})
export class ImageService implements IImageService {

  /**
   * Construye la URL de imagen para un héroe
   * @param hero Objeto héroe
   * @param size Tamaño deseado de imagen
   * @returns URL completa de la imagen
   */
  getHeroImageUrl(hero: Hero, size: ImageSize = ImageSize.LARGE): string {
    if (!hero?.thumbnail) {
      return this.getFallbackImage();
    }

    if (!this.isValidImageUrl(hero.thumbnail.path)) {
      return this.getFallbackImage();
    }

    return this.buildImageUrl(hero.thumbnail.path, hero.thumbnail.extension, size);
  }

  /**
   * Construye la URL de imagen para una serie
   * @param series Objeto serie
   * @param size Tamaño deseado de imagen
   * @returns URL completa de la imagen
   */
  getSeriesImageUrl(series: Serie, size: ImageSize = ImageSize.LARGE): string {
    if (!series?.thumbnail) {
      return this.getFallbackImage();
    }

    if (!this.isValidImageUrl(series.thumbnail.path)) {
      return this.getFallbackImage();
    }

    return this.buildImageUrl(series.thumbnail.path, series.thumbnail.extension, size);
  }

  /**
   * Obtiene una imagen placeholder
   * @returns URL de imagen placeholder
   */
  getPlaceholderImage(): string {
    return UI_CONSTANTS.IMAGES.PLACEHOLDER;
  }

  /**
   * Obtiene una imagen de fallback
   * @returns URL de imagen de fallback
   */
  getFallbackImage(): string {
    return UI_CONSTANTS.IMAGES.FALLBACK;
  }

  /**
   * Construye una URL de imagen completa
   * @param path Ruta base de la imagen
   * @param extension Extensión del archivo
   * @param size Tamaño deseado
   * @returns URL completa
   */
  private buildImageUrl(path: string, extension: string, size: ImageSize): string {
    if (!path || !extension) {
      return this.getFallbackImage();
    }
    
    return `${path}/${size}.${extension}`;
  }

  /**
   * Valida si una URL de imagen es válida
   * @param url URL a validar
   * @returns true si es válida
   */
  private isValidImageUrl(url: string): boolean {
    if (!url) return false;
    
    // Verificar que no sea la imagen "not available" de Marvel
    if (url.includes('image_not_available')) return false;
    
    // Verificar que tenga un protocolo válido
    if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
    
    return true;
  }

  /**
   * Obtiene tamaños de imagen disponibles para héroes
   * @returns Array de tamaños disponibles
   */
  getAvailableHeroSizes(): ImageSize[] {
    return [
      ImageSize.SMALL,
      ImageSize.MEDIUM,
      ImageSize.LARGE,
      ImageSize.INCREDIBLE
    ];
  }

  /**
   * Obtiene tamaños de imagen disponibles para series
   * @returns Array de tamaños disponibles
   */
  getAvailableSeriesSizes(): ImageSize[] {
    return [
      ImageSize.SMALL,
      ImageSize.MEDIUM,
      ImageSize.LARGE,
      ImageSize.STANDARD_MEDIUM,
      ImageSize.STANDARD_LARGE
    ];
  }

  /**
   * Preload de imagen para mejorar UX
   * @param imageUrl URL de la imagen a precargar
   * @returns Promise que se resuelve cuando la imagen carga
   */
  preloadImage(imageUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  }
}
