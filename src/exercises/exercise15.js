const { fromHttpRequest } = require('../utils/http');
const { map, concatMap, count, filter, tap, mergeMap, take } = require('rxjs/operators');

let ratingPerMovie = {};

function calculateRatingForMovie(movie) {
    if (ratingPerMovie[movie.title] === undefined) {
        ratingPerMovie[movie.title] = 0;
    }

    return fromHttpRequest('https://orels-moviedb.herokuapp.com/ratings').pipe(
            concatMap(rate => rate),
            filter(rate => rate.movie === movie.id),
            map(rate => {
                ratingPerMovie[movie.title] += rate.score;
                return rate;
            }),
            count(),
            map(ratesAmount => {
                ratingPerMovie[movie.title] /= ratesAmount;
                return [movie.title, ratingPerMovie[movie.title]];
            }));
}

fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
    .pipe(
        concatMap(movie => movie),
        take(10), // only 10 movies because the server is weak
        mergeMap(movie => calculateRatingForMovie(movie).pipe(
                tap(rate => console.log(`'${rate[0]}' rated: ${rate[1]}`)))
            )
    ).subscribe();