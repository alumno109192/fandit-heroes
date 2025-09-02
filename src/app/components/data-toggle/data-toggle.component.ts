import { Component, OnInit, OnDestroy } from '@angular/core';
import { MarvelService } from '../../services/marvel-solid.service';
import { Subscription } from 'rxjs';
import { DataMode } from '../../interfaces/data.interfaces';

@Component({
  selector: 'app-data-toggle',
  template: `
    <div class="data-toggle-toolbar">
      <div class="toggle-info">
        <span class="mode-label">Datos:</span>
        <span class="mode-badge" [class.mock-mode]="currentMode" [class.api-mode]="!currentMode">
          {{currentModeText}}
        </span>
      </div>
      
      <div class="toggle-switch">
        <label class="switch">
          <input 
            type="checkbox" 
            [checked]="currentMode" 
            (change)="onToggleChange($event)"
            [title]="currentMode ? 'Cambiar a API Real' : 'Cambiar a Mock'">
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  `,
  styles: [`
    .data-toggle-toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 8px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      transition: background-color 0.3s ease;
    }

    .data-toggle-toolbar:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .toggle-info {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
    }

    .mode-label {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }

    .mode-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
    }

    .mode-badge.api-mode {
      background: #4CAF50;
      color: white;
    }

    .mode-badge.mock-mode {
      background: #FF9800;
      color: white;
    }

    .toggle-switch {
      display: flex;
      align-items: center;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
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
      transition: .3s;
      border-radius: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    input:checked + .slider {
      background-color: #FF9800;
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }

    .slider:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .data-toggle-toolbar {
        gap: 8px;
        padding: 2px 6px;
      }

      .toggle-info {
        gap: 4px;
        font-size: 0.8rem;
      }

      .mode-label {
        display: none; /* Ocultar en móvil para ahorrar espacio */
      }

      .mode-badge {
        font-size: 0.7rem;
        padding: 1px 6px;
      }

      .switch {
        width: 36px;
        height: 18px;
      }

      .slider:before {
        height: 14px;
        width: 14px;
      }

      input:checked + .slider:before {
        transform: translateX(18px);
      }
    }

    @media (max-width: 480px) {
      .data-toggle-toolbar {
        gap: 6px;
      }

      .switch {
        width: 32px;
        height: 16px;
      }

      .slider:before {
        height: 12px;
        width: 12px;
      }

      input:checked + .slider:before {
        transform: translateX(16px);
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
      this.marvelService.useMockData$.subscribe(mode => {
        this.currentMode = mode === DataMode.MOCK;
        this.currentModeText = mode === DataMode.MOCK ? 'MOCK' : 'API REAL';
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
}
