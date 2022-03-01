const clarify = require('./lib/index');

function explainedError(cb) {
  require('fs').stat('neoatuhrcoahkrcophkr', function (err) {
    if (err) cb(clarify(err, 'asked for a file that certainly did not exist'));
    else cb();
  });
}

explainedError(function (err) {
  throw clarify(err, 'called an function that was expected to fail');
});
