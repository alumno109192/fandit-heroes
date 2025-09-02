import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HeroListSolidComponent } from './hero-list-solid.component';
import { MarvelService } from '../../services/marvel-solid.service';
import { ImageService } from '../../services/image.service';
import { ToggleService } from '../../services/toggle.service';
import { DataMode } from '../../interfaces/data.interfaces';

/**
 * Tests para HeroListSolidComponent siguiendo principios de Clean Code
 * - Tests específicos y enfocados
 * - Nombres descriptivos
 * - Mocks apropiados
 */
describe('HeroListSolidComponent', () => {
  let component: HeroListSolidComponent;
  let fixture: ComponentFixture<HeroListSolidComponent>;
  let mockMarvelService: jasmine.SpyObj<MarvelService>;
  let mockImageService: jasmine.SpyObj<ImageService>;
  let mockToggleService: jasmine.SpyObj<ToggleService>;

  const mockHeroes = [
    {
      id: 1,
      name: 'Iron Man',
      description: 'Billionaire genius',
      thumbnail: { path: 'test', extension: 'jpg' },
      comics: { available: 100, items: [] },
      series: { available: 50, items: [] },
      stories: { available: 200, items: [] }
    }
  ];

  beforeEach(async () => {
    // Crear spies para los servicios
    mockMarvelService = jasmine.createSpyObj('MarvelService', [
      'getHeroes',
      'getSearchResults'
    ]);
    
    mockImageService = jasmine.createSpyObj('ImageService', [
      'getHeroImageUrl',
      'getFallbackImage'
    ]);
    
    mockToggleService = jasmine.createSpyObj('ToggleService', [
      'getModeObservable',
      'getCurrentModeDisplayName',
      'isMockMode'
    ]);

    // Configurar retornos por defecto
    mockMarvelService.getHeroes.and.returnValue(of(mockHeroes));
    mockMarvelService.getSearchResults.and.returnValue(of([]));
    mockToggleService.getModeObservable.and.returnValue(of(DataMode.MOCK));
    mockToggleService.getCurrentModeDisplayName.and.returnValue('10 personajes fijos');
    mockToggleService.isMockMode.and.returnValue(true);
    mockImageService.getHeroImageUrl.and.returnValue('test-image-url');
    mockImageService.getFallbackImage.and.returnValue('fallback-image-url');

    await TestBed.configureTestingModule({
      declarations: [HeroListSolidComponent],
      providers: [
        { provide: MarvelService, useValue: mockMarvelService },
        { provide: ImageService, useValue: mockImageService },
        { provide: ToggleService, useValue: mockToggleService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListSolidComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load heroes on init', () => {
      fixture.detectChanges();
      expect(mockMarvelService.getHeroes).toHaveBeenCalled();
      expect(component.heroes).toEqual(mockHeroes);
    });

    it('should subscribe to mode changes on init', () => {
      fixture.detectChanges();
      expect(mockToggleService.getModeObservable).toHaveBeenCalled();
    });
  });

  describe('Hero Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return current heroes when not searching', () => {
      component.isSearching = false;
      component.heroes = mockHeroes;
      
      expect(component.getCurrentHeroes()).toEqual(mockHeroes);
    });

    it('should return search results when searching', () => {
      component.isSearching = true;
      component.searchResults = mockHeroes;
      
      expect(component.getCurrentHeroes()).toEqual(mockHeroes);
    });

    it('should get hero image URL from image service', () => {
      const hero = mockHeroes[0];
      const result = component.getHeroImageUrl(hero);
      
      expect(mockImageService.getHeroImageUrl).toHaveBeenCalledWith(hero, jasmine.any(Object));
      expect(result).toBe('test-image-url');
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle search results correctly', () => {
      const searchResults = [mockHeroes[0]];
      
      component.onSearchResults(searchResults);
      
      expect(component.searchResults).toEqual(searchResults);
      expect(component.isSearching).toBe(true);
    });

    it('should clear search results', () => {
      component.searchResults = mockHeroes;
      component.isSearching = true;
      
      component.clearSearchResults();
      
      expect(component.searchResults).toEqual([]);
      expect(component.isSearching).toBe(false);
    });
  });

  describe('Mode Information', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should get mode info from toggle service', () => {
      const result = component.getModeInfo();
      
      expect(mockToggleService.getCurrentModeDisplayName).toHaveBeenCalled();
      expect(result).toBe('10 personajes fijos');
    });

    it('should check if is mock mode', () => {
      const result = component.isMockMode();
      
      expect(mockToggleService.isMockMode).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('Utility Functions', () => {
    it('should truncate long descriptions', () => {
      const longDescription = 'A'.repeat(200);
      const result = component.truncateDescription(longDescription);
      
      expect(result).toContain('...');
      expect(result.length).toBeLessThan(longDescription.length);
    });

    it('should return description as is if short', () => {
      const shortDescription = 'Short description';
      const result = component.truncateDescription(shortDescription);
      
      expect(result).toBe(shortDescription);
    });

    it('should handle empty description', () => {
      const result = component.truncateDescription('');
      
      expect(result).toBe('Sin descripción disponible');
    });

    it('should track heroes by id', () => {
      const hero = mockHeroes[0];
      const result = component.trackByHeroId(0, hero);
      
      expect(result).toBe(hero.id);
    });
  });

  describe('Error Handling', () => {
    it('should handle image load errors', () => {
      const mockEvent = {
        target: { src: '' }
      };
      
      component.onImageError(mockEvent);
      
      expect(mockImageService.getFallbackImage).toHaveBeenCalled();
      expect(mockEvent.target.src).toBe('fallback-image-url');
    });
  });
});
