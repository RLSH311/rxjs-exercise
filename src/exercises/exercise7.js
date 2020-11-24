const { fromHttpRequest } = require('../utils/http');
const { concatMap, map, filter } = require('rxjs/operators');
const { of } = require('rxjs');

thrillerMoviesPerYear = {};

fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
    .pipe(
        concatMap(movie => {
            movieGenresIds = movie.genres;

            return of(movieGenresIds)
                    .pipe(
                        concatMap(genreId => {
                            return fromHttpRequest(`https://orels-moviedb.herokuapp.com/genres/${genreId}`)
                                    .pipe(
                                        filter(genre => genre.name === 'thriller'),
                                        map(_ => {
                                            if (thrillerMoviesPerYear[movie.year] === undefined) {
                                                thrillerMoviesPerYear[movie.year] = 0;
                                            }

                                            thrillerMoviesPerYear[movie.year] += 1;
                                        })
                                    )
                                    .subscribe();
                        })
                    ).subscribe()
        })
    )
    .subscribe(console.log);