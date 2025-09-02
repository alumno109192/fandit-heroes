import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IHeroDataSource } from '../../interfaces/data.interfaces';
import { Hero } from '../../models/hero.model';
import { ValidationUtils, LogUtils, FormatUtils } from '../../utils/common.utils';
import { MOCK_IDS } from '../../constants/app.constants';

/**
 * Data Source para datos Mock siguiendo SRP y OCP
 * Se encarga únicamente de proveer datos mock de héroes
 */
@Injectable({
  providedIn: 'root'
})
export class MockHeroDataSource implements IHeroDataSource {
  
  private readonly mockHeroes: Hero[] = [
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
        path: 'http://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b',
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
    },
    {
      id: 1009664,
      name: 'Thor',
      description: 'As the Norse God of thunder and lightning, Thor wields one of the greatest weapons ever made, the enchanted hammer Mjolnir. While others have described Thor as an over-muscled, oafish imbecile, he\'s quite smart and compassionate. He\'s self-assured, and he would never, ever stop fighting for a worthwhile cause.',
      thumbnail: {
        path: 'http://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350',
        extension: 'jpg'
      },
      comics: { available: 1978, items: [] },
      series: { available: 493, items: [] },
      stories: { available: 2263, items: [] }
    },
    {
      id: 1009351,
      name: 'Hulk',
      description: 'Caught in a gamma bomb explosion while trying to save the life of a teenager, Dr. Bruce Banner was transformed into the incredibly powerful creature called the Hulk. An all too often misunderstood hero, the angrier the Hulk gets, the stronger the Hulk gets.',
      thumbnail: {
        path: 'http://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0',
        extension: 'jpg'
      },
      comics: { available: 1667, items: [] },
      series: { available: 463, items: [] },
      stories: { available: 2403, items: [] }
    },
    {
      id: 1009189,
      name: 'Black Widow',
      description: 'Despite super spy Natasha Romanoff\'s checkered past, she\'s become one of S.H.I.E.L.D.\'s most deadly assassins and a frequent member of the Avengers.',
      thumbnail: {
        path: 'https://m.media-amazon.com/images/I/81Jgy1tfvcL._UF894,1000_QL80_',
        extension: 'jpg'
      },
      comics: { available: 1072, items: [] },
      series: { available: 234, items: [] },
      stories: { available: 1356, items: [] }
    },
    {
      id: 1009262,
      name: 'Daredevil',
      description: 'Abandoned by his mother, Matt Murdock was raised by his father, boxer "Battling Jack" Murdock, in Hell\'s Kitchen. Realizing that rules were needed to prevent people from behaving badly, young Matt decided to dedicate his life to the pursuit of justice.',
      thumbnail: {
        path: 'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b',
        extension: 'jpg'
      },
      comics: { available: 1567, items: [] },
      series: { available: 390, items: [] },
      stories: { available: 2073, items: [] }
    },
    {
      id: 1009282,
      name: 'Doctor Strange',
      description: 'Doctor Stephen Strange\'s life changed after a car accident that resulted in a damaged nervous system, preventing him from practicing neurosurgery. When modern medicine failed him, he embarked on a journey to Kamar-Taj in Tibet, where the one known as the Ancient One taught him the ways of the mystic arts.',
      thumbnail: {
        path: 'http://i.annihil.us/u/prod/marvel/i/mg/5/f0/5261a85a501fe',
        extension: 'jpg'
      },
      comics: { available: 814, items: [] },
      series: { available: 188, items: [] },
      stories: { available: 1011, items: [] }
    },
    {
      id: 1009718,
      name: 'Wolverine',
      description: 'Born with super-human senses and the power to heal from almost any wound, Wolverine was captured by a secret Canadian organization and given an unbreakable skeleton and claws. Treated like an animal, it took years for him to control himself.',
      thumbnail: {
        path: 'http://i.annihil.us/u/prod/marvel/i/mg/2/60/537bcaef0f6cf',
        extension: 'jpg'
      },
      comics: { available: 1831, items: [] },
      series: { available: 484, items: [] },
      stories: { available: 2335, items: [] }
    },
    {
      id: 1009146,
      name: 'Abomination',
      description: 'Formerly known as Emil Blonsky, a spy of Soviet Yugoslavian origin working for the KGB, the Abomination gained his powers after receiving a dose of gamma radiation similar to that which transformed Bruce Banner into the incredible Hulk.',
      thumbnail: {
        path: 'http://i.annihil.us/u/prod/marvel/i/mg/9/50/4ce18691cbf04',
        extension: 'jpg'
      },
      comics: { available: 67, items: [] },
      series: { available: 28, items: [] },
      stories: { available: 81, items: [] }
    }
  ];

  // Implementación de IDataSource<Hero>
  get(params?: any): Observable<Hero[]> {
    return this.getHeroes(params?.limit, params?.offset, params?.nameStartsWith);
  }

  getById(id: number): Observable<Hero> {
    return this.getHeroById(id);
  }

  search(query: string): Observable<Hero[]> {
    return this.searchHeroes(query);
  }

  // Implementación de IHeroDataSource
  getHeroes(limit: number = 20, offset: number = 0, nameStartsWith?: string): Observable<Hero[]> {
    LogUtils.log(`Obteniendo héroes mock: limit=${limit}, offset=${offset}, search=${nameStartsWith}`, 'MockHeroDataSource');
    
    const validLimit = ValidationUtils.validateLimit(limit);
    const validOffset = ValidationUtils.validateOffset(offset);
    
    let filteredHeroes = [...this.mockHeroes];
    
    // Aplicar filtro de búsqueda si existe
    if (nameStartsWith && ValidationUtils.isValidSearchQuery(nameStartsWith)) {
      filteredHeroes = this.filterHeroesByName(filteredHeroes, nameStartsWith);
    }
    
    // Aplicar paginación
    const paginatedHeroes = filteredHeroes.slice(validOffset, validOffset + validLimit);
    
    LogUtils.log(`Retornando ${paginatedHeroes.length} héroes mock`, 'MockHeroDataSource');
    return of(paginatedHeroes);
  }

  getHeroById(id: number): Observable<Hero> {
    LogUtils.log(`Obteniendo héroe mock por ID: ${id}`, 'MockHeroDataSource');
    
    if (!ValidationUtils.isValidId(id)) {
      LogUtils.warn(`ID inválido: ${id}`, 'MockHeroDataSource');
      return of(this.getDefaultHero());
    }
    
    const hero = this.findHeroById(id);
    if (hero) {
      LogUtils.log(`Héroe encontrado: ${hero.name}`, 'MockHeroDataSource');
      return of(hero);
    }
    
    LogUtils.warn(`Héroe no encontrado con ID: ${id}, usando héroe por defecto`, 'MockHeroDataSource');
    return of(this.getDefaultHero());
  }

  searchHeroes(query: string): Observable<Hero[]> {
    LogUtils.log(`Buscando héroes mock: "${query}"`, 'MockHeroDataSource');
    
    if (!ValidationUtils.isValidSearchQuery(query)) {
      LogUtils.warn(`Query de búsqueda inválida: "${query}"`, 'MockHeroDataSource');
      return of([]);
    }
    
    const results = this.filterHeroesByName(this.mockHeroes, query);
    LogUtils.log(`Encontrados ${results.length} héroes que coinciden con "${query}"`, 'MockHeroDataSource');
    
    return of(results);
  }

  /**
   * Filtra héroes por nombre
   * @param heroes Array de héroes
   * @param searchTerm Término de búsqueda
   * @returns Héroes filtrados
   */
  private filterHeroesByName(heroes: Hero[], searchTerm: string): Hero[] {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    return heroes.filter(hero => 
      hero.name.toLowerCase().includes(normalizedSearch)
    );
  }

  /**
   * Busca un héroe por ID
   * @param id ID del héroe
   * @returns Héroe encontrado o null
   */
  private findHeroById(id: number): Hero | null {
    return this.mockHeroes.find(hero => hero.id === id) || null;
  }

  /**
   * Obtiene el héroe por defecto (Iron Man)
   * @returns Héroe por defecto
   */
  private getDefaultHero(): Hero {
    return this.mockHeroes[0]; // Iron Man
  }

  /**
   * Obtiene todos los IDs mock disponibles
   * @returns Array de IDs
   */
  getMockIds(): number[] {
    return this.mockHeroes.map(hero => hero.id);
  }

  /**
   * Verifica si un ID es de mock
   * @param id ID a verificar
   * @returns true si es mock
   */
  isMockId(id: number): boolean {
    return ValidationUtils.isMockId(id);
  }

  /**
   * Obtiene el total de héroes mock disponibles
   * @returns Número total
   */
  getTotalHeroes(): number {
    return this.mockHeroes.length;
  }
}
