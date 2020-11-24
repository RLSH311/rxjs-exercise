const { fromHttpRequest } = require('../utils/http');
const { map } = require('rxjs/operators');

fromHttpRequest('https://orels-moviedb.herokuapp.com/movies')
    .pipe(
        map(movies => `there are ${movies.length} movies in the DB`)
    )
    .subscribe(console.log);