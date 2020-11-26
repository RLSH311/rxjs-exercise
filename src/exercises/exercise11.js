const { fromHttpRequest } = require('../utils/http');
const { map, concatMap, filter, count, mergeMap, tap, take, skip } = require('rxjs/operators');

let ratesBiggerThanValue = {};

function findMovieRatesThatBiggerThanValue(movie, minRate) {
    if (ratesBiggerThanValue[movie.title] === undefined) {
        ratesBiggerThanValue[movie.title] = {ratesBiggerThanValue: 0, totalRates: 0};
    }

    return fromHttpRequest('https://orels-moviedb.herokuapp.com/ratings').pipe(
        concatMap(rate => rate),
        filter(rate => rate.movie === movie.id),
        map(sameMovieRate => {
            ratesBiggerThanValue[movie.title].totalRates += 1;
            return sameMovieRate;
        }),
        filter(sameMovieRate => sameMovieRate.score >= minRate),
        count(),
        map(ratesBiggerThanValueAmount => {
            ratesBiggerThanValue[movie.title].ratesBiggerThanValue += ratesBiggerThanValueAmount;
            return ratesBiggerThanValue[movie.title];
        })
    );
}

fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
    .pipe(
        concatMap(movie => movie),
        // running only on few movies so the operation won't take too long
        skip(75),
        take(35),
        mergeMap(movie => findMovieRatesThatBiggerThanValue(movie, 3).pipe(
            filter(movieRating => {
                return movieRating.ratesBiggerThanValue / movieRating.totalRates >= 0.7;
            }),
            tap(highRatedMovie => {
                let precentage = (highRatedMovie.ratesBiggerThanValue / highRatedMovie.totalRates) * 100;
                console.log(`the movie '${movie.title}' have ${precentage}% rates >= 3`);
                return precentage;
            })
        ))
    )
    .subscribe();