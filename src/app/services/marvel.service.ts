import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { Hero, MarvelResponse, Serie, SeriesResponse } from '../models/hero.model';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class MarvelService {
  private baseUrl = 'https://gateway.marvel.com/v1/public';
  private searchSubject = new BehaviorSubject<string>('');
  
  // Toggle para modo de datos
  private useMockData = new BehaviorSubject<boolean>(false); // Por defecto API real
  public useMockData$ = this.useMockData.asObservable();

  // Datos mock como fallback
  private mockHeroes: Hero[] = [
    {
      id: 1009368,
      name: 'Iron Man',
      description: 'Wounded, captured and forced to build a weapon by his enemies, billionaire industrialist Tony Stark instead created an advanced suit of armor to save his life and escape captivity. Now with a new outlook on life, Tony uses his money and intelligence to make the world a safer, better place as Iron Man.',
      thumbnail: {
        path: 'http://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55',
        extension: 'jpg'
      },
      comics: { available: 2667, items: [] },
      series: { available: 653, items: [] },
      stories: { available: 3009, items: [] }
    },
    {
      id: 1009610,
      name: 'Spider-Man',
      description: 'Bitten by a radioactive spider, high school student Peter Parker gained the speed, strength and powers of a spider. Adopting the name Spider-Man, Peter hoped to start a career using his new abilities. Taught that with great power comes great responsibility, Spidey has vowed to use his powers to help people.',
      thumbnail: {
        path: 'https://m.media-amazon.com/images/I/81aRXFZ6d-L._UF1000,1000_QL80_',
        extension: 'jpg'
      },
      comics: { available: 1634, items: [] },
      series: { available: 447, items: [] },
      stories: { available: 2067, items: [] }
    },
    {
      id: 1009220,
      name: 'Captain America',
      description: 'Vowing to serve his country any way he could, young Steve Rogers took the super soldier serum to become America\'s one-man army. Fighting for the red, white and blue for over 60 years, Captain America is the living, breathing symbol of freedom and liberty.',
      thumbnail: {
        path: 'http://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087',
        extension: 'jpg'
      },
      comics: { available: 2235, items: [] },
      series: { available: 556, items: [] },
      stories: { available: 2693, items: [] }
    }
  ];

  private mockSeries: Serie[] = [
    {
      id: 1945,
      title: 'Avengers (1963 - 1996)',
      description: 'The first Avengers series.',
      thumbnail: {
        path: 'http://i.annihil.us/u/prod/marvel/i/mg/9/20/5102c774ebae7',
        extension: 'jpg'
      },
      startYear: 1963,
      endYear: 1996,
      rating: 'T',
      comics: { available: 354, items: [] }
    },
    {
      id: 2069,
      title: 'Spider-Man (1990 - 1998)',
      description: 'Classic Spider-Man adventures.',
      thumbnail: {
        path: 'https://m.media-amazon.com/images/I/81aRXFZ6d-L._UF1000,1000_QL80_',
        extension: 'jpg'
      },
      startYear: 1990,
      endYear: 1998,
      rating: 'T',
      comics: { available: 98, items: [] }
    }
  ];

  constructor(private http: HttpClient) {
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(term => this.searchHeroes(term))
    ).subscribe();
  }

  private generateAuthParams(): any {
    const ts = new Date().getTime().toString();
    const hash = CryptoJS.MD5(ts + environment.marvelPrivateKey + environment.marvelPublicKey).toString();
    
    return {
      ts: ts,
      apikey: environment.marvelPublicKey,
      hash: hash
    };
  }

  private buildUrl(endpoint: string, params: any = {}): string {
    const authParams = this.generateAuthParams();
    const allParams = { ...params, ...authParams };
    
    const queryString = Object.keys(allParams)
      .map(key => `${key}=${encodeURIComponent(allParams[key])}`)
      .join('&');
    
    return `${this.baseUrl}${endpoint}?${queryString}`;
  }

  getHeroes(limit: number = 20, offset: number = 0, nameStartsWith?: string): Observable<Hero[]> {
    // Si está en modo mock, usar datos mock directamente
    if (this.useMockData.value) {
      console.log('🔄 Modo MOCK activado - usando datos locales');
      return this.getMockHeroes(limit, offset, nameStartsWith);
    }

    // Modo API real
    console.log('🌐 Modo API REAL activado - consultando Marvel API');
    const params: any = { 
      limit, 
      offset,
      orderBy: 'name'
    };

    if (nameStartsWith) {
      params.nameStartsWith = nameStartsWith;
    }

    const url = this.buildUrl('/characters', params);

    return this.http.get<MarvelResponse>(url).pipe(
      map(response => response.data.results),
      catchError(error => {
        console.error('❌ Error en Marvel API, usando datos mock como fallback:', error);
        return this.getMockHeroes(limit, offset, nameStartsWith);
      })
    );
  }

  private getMockHeroes(limit: number = 20, offset: number = 0, nameStartsWith?: string): Observable<Hero[]> {
    let heroes = [...this.mockHeroes];
    
    if (nameStartsWith) {
      heroes = heroes.filter(hero => 
        hero.name.toLowerCase().startsWith(nameStartsWith.toLowerCase())
      );
    }
    
    return of(heroes.slice(offset, offset + limit));
  }

  getHeroById(id: number): Observable<Hero> {
    // Si está en modo mock, usar datos mock directamente
    if (this.useMockData.value) {
      console.log('🔄 Modo MOCK - obteniendo héroe por ID:', id);
      const hero = this.mockHeroes.find(h => h.id === id);
      return of(hero || this.mockHeroes[0]);
    }

    // Modo API real
    console.log('🌐 Modo API REAL - obteniendo héroe por ID:', id);
    const url = this.buildUrl(`/characters/${id}`);

    return this.http.get<MarvelResponse>(url).pipe(
      map(response => response.data.results[0]),
      catchError(error => {
        console.error('❌ Error en Marvel API, usando datos mock como fallback:', error);
        const hero = this.mockHeroes.find(h => h.id === id);
        return of(hero || this.mockHeroes[0]);
      })
    );
  }

  getHeroSeries(heroId: number, limit: number = 3): Observable<Serie[]> {
    const url = this.buildUrl(`/characters/${heroId}/series`, { 
      limit,
      orderBy: '-startYear'
    });

    return this.http.get<SeriesResponse>(url).pipe(
      map(response => response.data.results),
      catchError(error => {
        console.error('Error fetching hero series from Marvel API, using mock data:', error);
        return of(this.mockSeries.slice(0, limit));
      })
    );
  }

  getSeries(limit: number = 10): Observable<Serie[]> {
    const url = this.buildUrl('/series', { 
      limit,
      orderBy: '-startYear'
    });

    return this.http.get<SeriesResponse>(url).pipe(
      map(response => response.data.results),
      catchError(error => {
        console.error('Error fetching series from Marvel API, using mock data:', error);
        return of(this.mockSeries.slice(0, limit));
      })
    );
  }

  searchHeroes(query: string): Observable<Hero[]> {
    if (!query || query.trim() === '') {
      return this.getHeroes(20, 0);
    }
    
    // Si está en modo mock, usar datos mock directamente
    if (this.useMockData.value) {
      console.log('🔄 Modo MOCK - buscando:', query);
      const filtered = this.mockHeroes.filter(hero =>
        hero.name.toLowerCase().includes(query.toLowerCase())
      );
      return of(filtered);
    }

    // Modo API real
    console.log('🌐 Modo API REAL - buscando:', query);
    const url = this.buildUrl('/characters', { 
      nameStartsWith: query.trim(),
      limit: 10,
      orderBy: 'name'
    });

    return this.http.get<MarvelResponse>(url).pipe(
      map(response => response.data.results),
      catchError(error => {
        console.error('❌ Error en Marvel API, usando datos mock como fallback:', error);
        const filtered = this.mockHeroes.filter(hero =>
          hero.name.toLowerCase().includes(query.toLowerCase())
        );
        return of(filtered);
      })
    );
  }

  // Métodos para controlar el toggle
  toggleDataSource(): void {
    const newValue = !this.useMockData.value;
    this.useMockData.next(newValue);
    console.log(`🔄 Cambiado a modo: ${newValue ? 'MOCK' : 'API REAL'}`);
  }

  setMockMode(useMock: boolean): void {
    this.useMockData.next(useMock);
    console.log(`🔄 Configurado modo: ${useMock ? 'MOCK' : 'API REAL'}`);
  }

  getCurrentMode(): boolean {
    return this.useMockData.value;
  }

  getCurrentModeString(): string {
    return this.useMockData.value ? 'MOCK' : 'API REAL';
  }

  setSearchTerm(term: string): void {
    this.searchSubject.next(term);
  }

  getSearchResults(): Observable<Hero[]> {
    return this.searchSubject.pipe(
      debounceTime(300),
      switchMap(term => this.searchHeroes(term))
    );
  }
}
