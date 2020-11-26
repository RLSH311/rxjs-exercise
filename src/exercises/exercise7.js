const { fromHttpRequest } = require('../utils/http');
const { concatMap, map, filter, mergeMap, max, tap, take, skip } = require('rxjs/operators');
const { concat, of } = require('rxjs');

let thrillerMoviesPerYears = {};

function countThrillerMoviesPerYear(movie) {
    if (thrillerMoviesPerYears[movie.year] === undefined) {
        thrillerMoviesPerYears[movie.year] = 0;
    }

    return fromHttpRequest('https://orels-moviedb.herokuapp.com/genres').pipe(
        concatMap(genre => genre),
        filter(genre => genre.name === 'thriller'),
        filter(thrillerGenre => movie.genres.includes(thrillerGenre.id)),
        map(thrillerGenre => {
            thrillerMoviesPerYears[movie.year] += 1;
        })
    );
}

let movies$ = fromHttpRequest('https://orels-moviedb.herokuapp.com/movies').pipe(
    concatMap(movie => movie),
    // taking only few movies so the server won't collapse
    skip(200),
    take(150),
    mergeMap(movie => countThrillerMoviesPerYear(movie))
)

let findYearWithMostThrillerMovies$ = 
    of(thrillerMoviesPerYears).pipe(
        map(obj => Object.keys(obj).map(key => [key, obj[key]])),
        concatMap(thrillerMoviesOfYear => thrillerMoviesOfYear),
        max((a, b) => a[1] < b[1] ? -1 : 1),
        tap(yearOfMostThrillerMovies => console.log(`the year ${yearOfMostThrillerMovies[0]} has the most thriller movies (${yearOfMostThrillerMovies[1]} movies)`))
    );

concat(movies$, findYearWithMostThrillerMovies$).subscribe();