const { fromHttpRequest } = require('../utils/http');
const { concatMap, filter } = require('rxjs/operators');

fromHttpRequest('https://orels-moviedb.herokuapp.com/directors')
    .pipe(
        concatMap(director => director),
        filter(director => {
            let name = director.name;
            return name[0] === name[name.length - 1].toUpperCase();
        })
    )
    .subscribe(console.log);