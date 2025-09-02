import { Component, OnInit } from '@angular/core';
import { MarvelService } from '../../services/marvel.service';
import { Hero } from '../../models/hero.model';

@Component({
  selector: 'app-api-debug',
  template: `
    <div class="api-debug-container" style="padding: 20px; background: #f5f5f5; margin: 20px; border-radius: 8px;">
      <h3>🔍 Debug Marvel API - Estado de Conexión</h3>
      
      <div class="status-section" style="margin: 15px 0;">
        <h4>📡 Estado de la API:</h4>
        <div [class]="apiStatus.class" style="padding: 10px; border-radius: 4px; font-weight: bold;">
          {{apiStatus.message}}
        </div>
      </div>

      <div class="test-section" style="margin: 15px 0;">
        <h4>🧪 Tests de Endpoints:</h4>
        <button (click)="testGetHeroes()" [disabled]="loading" class="btn btn-primary" style="margin: 5px;">
          Test Lista Héroes
        </button>
        <button (click)="testSearchHero()" [disabled]="loading" class="btn btn-secondary" style="margin: 5px;">
          Test Búsqueda
        </button>
        <button (click)="testHeroDetail()" [disabled]="loading" class="btn btn-info" style="margin: 5px;">
          Test Detalle Héroe
        </button>
      </div>

      <div class="results-section" style="margin: 15px 0;">
        <h4>📊 Resultados:</h4>
        <div *ngIf="loading" style="padding: 10px; background: #fff3cd; border-radius: 4px;">
          ⏳ Cargando datos de Marvel API...
        </div>
        <div *ngIf="lastResult" style="padding: 10px; background: white; border-radius: 4px; margin-top: 10px;">
          <strong>Último Test:</strong> {{lastTest}}<br>
          <strong>Fuente de Datos:</strong> 
          <span [style.color]="isRealData ? 'green' : 'orange'" style="font-weight: bold;">
            {{isRealData ? '✅ Marvel API Real' : '⚠️ Datos Mock (Fallback)'}}
          </span><br>
          <strong>Cantidad de Resultados:</strong> {{resultCount}}<br>
          <strong>Primer Resultado:</strong> {{firstItemName}}
        </div>
      </div>

      <div class="raw-data" style="margin: 15px 0;" *ngIf="showRawData">
        <h4>📄 Datos Raw (JSON):</h4>
        <pre style="background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">{{rawData}}</pre>
        <button (click)="showRawData = false" class="btn btn-sm btn-outline-secondary">Ocultar Raw Data</button>
      </div>
    </div>
  `
})
export class ApiDebugComponent implements OnInit {
  apiStatus = { message: 'Iniciando...', class: 'text-info' };
  loading = false;
  lastResult: any = null;
  lastTest = '';
  isRealData = false;
  resultCount = 0;
  firstItemName = '';
  showRawData = false;
  rawData = '';

  constructor(private marvelService: MarvelService) {}

  ngOnInit() {
    this.checkApiStatus();
  }

  checkApiStatus() {
    this.apiStatus = { message: '🔗 API Configurada y Lista', class: 'text-success' };
  }

  testGetHeroes() {
    this.loading = true;
    this.lastTest = 'Lista de Héroes';
    
    this.marvelService.getHeroes(5, 0).subscribe({
      next: (heroes) => {
        this.processResults(heroes, 'Heroes');
        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
        this.loading = false;
      }
    });
  }

  testSearchHero() {
    this.loading = true;
    this.lastTest = 'Búsqueda de "Spider"';
    
    this.marvelService.searchHeroes('Spider').subscribe({
      next: (heroes) => {
        this.processResults(heroes, 'Search Results');
        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
        this.loading = false;
      }
    });
  }

  testHeroDetail() {
    this.loading = true;
    this.lastTest = 'Detalle de Iron Man (ID: 1009368)';
    
    this.marvelService.getHeroById(1009368).subscribe({
      next: (hero) => {
        this.processResults([hero], 'Hero Detail');
        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
        this.loading = false;
      }
    });
  }

  processResults(data: any[], type: string) {
    this.lastResult = data;
    this.resultCount = data.length;
    this.firstItemName = data[0]?.name || 'N/A';
    
    // Detectar si son datos reales o mock basándose en variedad y IDs
    this.isRealData = this.detectRealData(data);
    
    this.rawData = JSON.stringify(data, null, 2);
    this.showRawData = true;
  }

  detectRealData(data: any[]): boolean {
    // Los datos mock tienen IDs específicos conocidos y solo 3 elementos
    const mockIds = [1009368, 1009610, 1009220]; // Iron Man, Spider-Man, Captain America
    
    if (data.length === 0) return false;
    
    // Si hay más de 3 elementos, definitivamente son datos reales
    if (data.length > 3) {
      console.log('🔍 Detectado: MÁS de 3 resultados = DATOS REALES');
      return true;
    }
    
    // Si encuentra IDs que no están en mock, son datos reales
    const foundIds = data.map(item => item.id);
    const hasNonMockId = foundIds.some(id => !mockIds.includes(id));
    if (hasNonMockId) {
      console.log('🔍 Detectado: ID no-mock encontrado = DATOS REALES', foundIds);
      return true;
    }
    
    // Si todos los IDs son de mock Y son exactamente 3 elementos
    if (data.length <= 3 && foundIds.every(id => mockIds.includes(id))) {
      console.log('🔍 Detectado: Solo IDs mock + 3 elementos máximo = DATOS MOCK', foundIds);
      return false;
    }
    
    // Si las descripciones son muy variadas, probablemente son reales
    const descriptions = data.map(item => item.description?.length || 0);
    const avgLength = descriptions.reduce((a, b) => a + b, 0) / descriptions.length;
    
    console.log('🔍 Análisis longitud descripciones:', avgLength, avgLength > 200 ? 'REAL' : 'MOCK');
    return avgLength > 200;
  }

  handleError(error: any) {
    this.apiStatus = { 
      message: '❌ Error en API - Usando datos mock', 
      class: 'text-warning' 
    };
    console.error('API Test Error:', error);
  }
}
