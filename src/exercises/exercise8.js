const { fromHttpRequest } = require('../utils/http');
const { map, concatMap, tap } = require('rxjs/operators');
const { concat } = require('rxjs');


let genresNames$ = fromHttpRequest('https://orels-moviedb.herokuapp.com/genres').pipe(
                    concatMap(genre => genre),
                    map(genre => genre.name),
                    tap(console.log));
    
let directorsName$ = fromHttpRequest('https://orels-moviedb.herokuapp.com/directors').pipe(
                        concatMap(director => director),
                        map(director => director.name),
                        tap(console.log));

let moviesTitles$ = fromHttpRequest('https://orels-moviedb.herokuapp.com/movies').pipe(
                        concatMap(movie => movie),
                        map(movie => movie.title),
                        tap(console.log));

concat(moviesTitles$, directorsName$, genresNames$).subscribe();
