const { fromHttpRequest } = require('../utils/http');
const { map, concatMap, filter, mergeMap, tap, take, count, finalize } = require('rxjs/operators');

let ratingPerDirector = {};
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

function calculateDirectorRating(director) {
    if (ratingPerDirector[director.name] === undefined) {
        ratingPerDirector[director.name] = 0;
    }

    return fromHttpRequest('https://orels-moviedb.herokuapp.com/movies').pipe(
            concatMap(movie => movie),
            filter(movie => movie.directors.includes(director.id)),
            mergeMap(sameDirectorMovie => calculateRatingForMovie(sameDirectorMovie).pipe(
                    map(movieRate => {
                        ratingPerDirector[director.name] += movieRate[1];
                        return movieRate;
                    }))),
            count(),
            map(moviesAmount => {
                ratingPerDirector[director.name] /= moviesAmount;
                return [director.name, ratingPerDirector[director.name]]
            }));
}

fromHttpRequest('https://orels-moviedb.herokuapp.com/directors')
    .pipe(
        concatMap(director => director),
        take(5),
        mergeMap(director => calculateDirectorRating(director).pipe(
            tap(directorRating => console.log(`${directorRating[0]} movies are rated (in avg): ${directorRating[1]}`))
        ))
    )
    .subscribe();