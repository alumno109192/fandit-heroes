export interface Hero {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  series: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  stories: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
}

export interface MarvelResponse {
  code: number;
  status: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: Hero[];
  };
}

export interface Serie {
  id: number;
  title: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  startYear: number;
  endYear: number;
  rating?: string;
  comics: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
}

export interface SeriesResponse {
  code: number;
  status: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: Serie[];
  };
}
