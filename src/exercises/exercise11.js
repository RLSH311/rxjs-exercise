const { fromHttpRequest } = require('../utils/http');
const { concatMap, tap, mergeMap, filter, map, count, take } = require('rxjs/operators');

fromHttpRequest('https://orels-moviedb.herokuapp.com/ratings')
    .pipe(
        concatMap(rate => rate),
        take(1),
        tap(rate => console.log(rate.movie)),
        mergeMap(rateA => {
            return fromHttpRequest('https://orels-moviedb.herokuapp.com/ratings')
                    .pipe(
                        concatMap(rateB => rateB),
                        filter(rateB => rateB.movie === rateA.movie),
                        count(sameMovieRate => sameMovieRate.score >= 1),
                        tap(console.log)
                    )
        })
    )
    .subscribe();