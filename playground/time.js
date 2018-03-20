const moment = require('moment');

// Jan 1st 1970 00:00:10 am
let someTimestamp = moment().valueOf();
console.log(someTimestamp);

let createdAt = new Date().getTime();
let date = moment(createdAt);

console.log(date.format());
console.log(date.format('MMM'));
console.log(date.format('YYYY'));
console.log(date.format('MMM YYYY DD'));
console.log(date.format('MMM Do, YYYY '));
console.log(date.format('h:mm a'));