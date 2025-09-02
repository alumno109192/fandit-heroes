import { Component, OnInit, OnDestroy } from '@angular/core';
import { MarvelService } from '../../services/marvel.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-toggle',
  template: `
    <div class="data-toggle-container">
      <div class="toggle-card">
        <div class="toggle-header">
          <h4>🔄 Modo de Datos</h4>
          <div class="current-mode" [class.mock-mode]="currentMode" [class.api-mode]="!currentMode">
            {{currentModeText}}
          </div>
        </div>
        
        <div class="toggle-content">
          <div class="mode-info">
            <div class="mode-option" [class.active]="!currentMode">
              <div class="mode-icon">🌐</div>
              <div class="mode-details">
                <strong>API Real Marvel</strong>
                <small>1500+ personajes, búsqueda completa</small>
              </div>
            </div>
            
            <div class="toggle-switch">
              <label class="switch">
                <input 
                  type="checkbox" 
                  [checked]="currentMode" 
                  (change)="onToggleChange($event)">
                <span class="slider round"></span>
              </label>
            </div>
            
            <div class="mode-option" [class.active]="currentMode">
              <div class="mode-icon">📦</div>
              <div class="mode-details">
                <strong>Datos Mock</strong>
                <small>3 personajes fijos, offline</small>
              </div>
            </div>
          </div>
          
          <div class="toggle-actions">
            <button 
              class="btn-toggle" 
              [class.btn-api]="currentMode" 
              [class.btn-mock]="!currentMode"
              (click)="quickToggle()">
              {{currentMode ? '🌐 Cambiar a API Real' : '📦 Cambiar a Mock'}}
            </button>
          </div>
          
          <div class="mode-description">
            <p *ngIf="!currentMode">
              <strong>🌐 Modo API Real:</strong> Conectado a developer.marvel.com. 
              Datos actualizados, búsqueda completa, requiere internet.
            </p>
            <p *ngIf="currentMode">
              <strong>📦 Modo Mock:</strong> Datos locales predefinidos. 
              Funciona offline, solo 3 personajes disponibles.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .data-toggle-container {
      margin: 20px;
      max-width: 600px;
    }

    .toggle-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      padding: 20px;
      color: white;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .toggle-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .toggle-header h4 {
      margin: 0;
      font-size: 1.2rem;
    }

    .current-mode {
      padding: 5px 15px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .current-mode.api-mode {
      background: rgba(76, 175, 80, 0.8);
    }

    .current-mode.mock-mode {
      background: rgba(255, 152, 0, 0.8);
    }

    .mode-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .mode-option {
      display: flex;
      align-items: center;
      padding: 10px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.1);
      flex: 1;
      opacity: 0.7;
      transition: all 0.3s ease;
    }

    .mode-option.active {
      opacity: 1;
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }

    .mode-icon {
      font-size: 2rem;
      margin-right: 10px;
    }

    .mode-details small {
      display: block;
      opacity: 0.8;
      font-size: 0.8rem;
    }

    .toggle-switch {
      margin: 0 20px;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #4CAF50;
      transition: .4s;
      border-radius: 34px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #FF9800;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .toggle-actions {
      text-align: center;
      margin-bottom: 15px;
    }

    .btn-toggle {
      padding: 10px 20px;
      border: none;
      border-radius: 25px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      color: white;
    }

    .btn-api {
      background: #4CAF50;
    }

    .btn-api:hover {
      background: #45a049;
      transform: translateY(-2px);
    }

    .btn-mock {
      background: #FF9800;
    }

    .btn-mock:hover {
      background: #f57c00;
      transform: translateY(-2px);
    }

    .mode-description {
      background: rgba(255, 255, 255, 0.1);
      padding: 15px;
      border-radius: 10px;
      font-size: 0.9rem;
    }

    .mode-description p {
      margin: 0;
      line-height: 1.4;
    }

    @media (max-width: 768px) {
      .mode-info {
        flex-direction: column;
        gap: 15px;
      }

      .toggle-switch {
        margin: 0;
      }

      .mode-option {
        justify-content: center;
        text-align: center;
      }
    }
  `]
})
export class DataToggleComponent implements OnInit, OnDestroy {
  currentMode = false; // false = API Real, true = Mock
  currentModeText = 'API REAL';
  private subscription: Subscription = new Subscription();

  constructor(private marvelService: MarvelService) {}

  ngOnInit() {
    // Suscribirse a cambios de modo
    this.subscription.add(
      this.marvelService.useMockData$.subscribe(useMock => {
        this.currentMode = useMock;
        this.currentModeText = useMock ? 'MOCK' : 'API REAL';
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onToggleChange(event: any) {
    const useMock = event.target.checked;
    this.marvelService.setMockMode(useMock);
    
    // Notificar el cambio
    const mode = useMock ? 'Mock (Offline)' : 'API Real (Online)';
    console.log(`🔄 Cambiado a modo: ${mode}`);
  }

  quickToggle() {
    this.marvelService.toggleDataSource();
  }
}
