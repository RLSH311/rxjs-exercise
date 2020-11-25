const { fromHttpRequest } = require('../utils/http');
const { concatMap, count, tap, mergeMap, take } = require('rxjs/operators');

function calculateMoviesAmountForYear(title, year) {
    return fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
            .pipe(
                concatMap(movie => movie),
                count(movie => movie.year === year),
                tap(moviesAmount => console.log(`'${title}' from year ${year} have ${moviesAmount} movies`))
            );
}

fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
    .pipe(
        concatMap(movie => movie),
        take(100), // taking only 100 movies beause the server can't handle all the requests
        mergeMap(movie => calculateMoviesAmountForYear(movie.title, movie.year))
    )
    .subscribe();