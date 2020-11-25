const { fromHttpRequest } = require('../utils/http');
const { map, concatMap, mergeMap, filter, tap, count, reduce, min } = require('rxjs/operators');
const { concat, of } = require('rxjs');

moviesAmountForGenre = {};

function countMoivesForGenre(genre) {
    if (moviesAmountForGenre[genre.name] === undefined) {
        moviesAmountForGenre[genre.name] = 0;
    }

    return fromHttpRequest('https://orels-moviedb.herokuapp.com/movies').pipe(
            concatMap(movie => movie),
            filter(movie => movie.genres.includes(genre.id)),
            map(sameGenreMovies => {
                moviesAmountForGenre[genre.name] += 1;
                return moviesAmountForGenre[genre.name];
            }),
            reduce((acc, value) => value));
}

let findGenresMoviesAmount$ = fromHttpRequest('https://orels-moviedb.herokuapp.com/genres').pipe(
                                    concatMap(genre => genre),
                                    mergeMap(genre => countMoivesForGenre(genre)));

let findGenreWithLowestMoviesAmount$ = 
    of(moviesAmountForGenre).pipe(
        //convert the object to array of arrays of key and pair
        map(moviesPerGenreObj => Object.keys(moviesPerGenreObj).map(key => [key, moviesPerGenreObj[key]])),
        concatMap(moviePerGenre => moviePerGenre),
        //compare the movies amount
        min((a, b) => a[1] < b[1] ? -1 : 1),
        tap(listAmountOfMoviesGenre => console.log(`the genre with list amount of movies (${listAmountOfMoviesGenre[1]} movies) is '${listAmountOfMoviesGenre[0]}'`)));

concat(findGenresMoviesAmount$, findGenreWithLowestMoviesAmount$).subscribe()