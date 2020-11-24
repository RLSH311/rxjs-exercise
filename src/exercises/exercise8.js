const { fromHttpRequest } = require('../utils/http');
const { map, concatMap } = require('rxjs/operators');

let directorsName$ = fromHttpRequest('https://orels-moviedb.herokuapp.com/directors')
                        .pipe(
                            concatMap(director => director),
                            map(director => director.name)
                        )
                        .subscribe(console.log);

let genresNames$ = fromHttpRequest('https://orels-moviedb.herokuapp.com/genres')
                    .pipe(
                        concatMap(genre => genre),
                        map(genre => genre.name)
                    )
                    .subscribe(console.log);

fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
    .pipe(
        concatMap(movie => movie),
        map(movie => movie.title)
    )
    .subscribe(console.log);
