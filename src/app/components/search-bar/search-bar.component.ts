import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { MarvelService } from '../../services/marvel.service';
import { Hero } from '../../models/hero.model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  @Output() heroSelected = new EventEmitter<Hero>();
  @Output() searchResults = new EventEmitter<Hero[]>();

  searchControl = new FormControl();
  filteredHeroes: Observable<Hero[]> = of([]);
  isLoading = false;

  constructor(private marvelService: MarvelService) { }

  ngOnInit(): void {
    this.filteredHeroes = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (typeof value === 'string' && value.length > 0) {
          this.isLoading = true;
          return this.marvelService.searchHeroes(value).pipe(
            catchError(() => of([]))
          );
        }
        return of([]);
      })
    );

    this.filteredHeroes.subscribe(heroes => {
      this.isLoading = false;
      this.searchResults.emit(heroes);
    });
  }

  onHeroSelected(hero: Hero): void {
    this.heroSelected.emit(hero);
  }

  displayFn(hero: Hero): string {
    return hero ? hero.name : '';
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.searchResults.emit([]);
  }
}
