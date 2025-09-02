import { Component, Input, OnInit } from '@angular/core';
import { Serie } from '../../models/hero.model';

@Component({
  selector: 'app-series-slider',
  templateUrl: './series-slider.component.html',
  styleUrls: ['./series-slider.component.scss']
})
export class SeriesSliderComponent implements OnInit {
  @Input() series: Serie[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  getSerieImageUrl(serie: Serie): string {
    return `${serie.thumbnail.path}/portrait_xlarge.${serie.thumbnail.extension}`;
  }

  getYearRange(serie: Serie): string {
    if (serie.startYear && serie.endYear && serie.endYear !== serie.startYear) {
      return `${serie.startYear} - ${serie.endYear}`;
    } else if (serie.startYear) {
      return `${serie.startYear}`;
    }
    return 'N/A';
  }
}
