import { Component } from '@angular/core';

/**
 * Componente footer de la aplicación
 * Siguiendo principio SRP: responsabilidad única de mostrar información del pie de página
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  
  readonly currentYear = new Date().getFullYear();
  readonly appName = 'FANDIT HÉROES';
  readonly version = '1.0.0';

  /**
   * Maneja el clic en enlaces sociales
   * @param platform Plataforma social
   */
  onSocialClick(platform: string): void {
    console.log(`Clic en ${platform}`);
    // TODO: Implementar navegación a redes sociales
  }

  /**
   * Maneja el clic en enlaces legales
   * @param type Tipo de enlace legal
   */
  onLegalClick(type: string): void {
    console.log(`Clic en ${type}`);
    // TODO: Implementar navegación a páginas legales
  }
}
