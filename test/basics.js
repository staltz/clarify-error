const tape = require('tape');
const clarify = require('../lib/index');
const fs = require('fs');

function doSomethingWrong(cb) {
  fs.stat('file-that-does-not-exist', (err) => {
    if (err) cb(clarify(err, 'asked for a file that certainly did not exist'));
    else cb();
  });
}

function doMoreWrong(cb) {
  doSomethingWrong((err) => {
    if (err) cb(clarify(err, 'things went wrong'));
    else cb();
  });
}

function throwString(cb) {
  cb(clarify('string error', 'bad things happened'));
}

function throwStacklessError(cb) {
  cb(
    clarify({name: 'Error', message: 'client rejected'}, 'bad things happened'),
  );
}

tape('clarify a normal error', (t) => {
  doMoreWrong((err) => {
    if (!err) t.fail('should have thrown an error');

    console.log(err);

    t.equal(err.name, 'Error', 'should be an Error');
    t.equal(err.message, 'things went wrong');
    const stackArr = err.stack.split('\n');
    t.equals(stackArr.length, 7);
    t.equals(stackArr[0], 'Error: things went wrong');
    t.equals(stackArr[1].startsWith('    at'), true);
    t.equals(stackArr[2].startsWith('    at'), true);
    t.equals(
      stackArr[3],
      '  Error: asked for a file that certainly did not exist',
    );
    t.equals(stackArr[4].startsWith('    at'), true);
    t.equals(stackArr[5].startsWith('    at'), true);
    t.equals(
      stackArr[6],
      "  Error: ENOENT: no such file or directory, stat 'file-that-does-not-exist'",
    );
    t.end();
  });
});

tape('clarify a stringly error', (t) => {
  throwString((err) => {
    if (!err) t.fail('should have thrown an error');

    console.log(err);
    const stackArr = err.stack.split('\n');
    t.true(stackArr.length > 4);
    t.equals(stackArr[0], 'Error: bad things happened');
    t.equals(stackArr[stackArr.length - 1], '  Error: string error');
    t.end();
  });
});

tape('clarify a stackless error', (t) => {
  throwStacklessError((err) => {
    if (!err) t.fail('should have thrown an error');

    console.log(err);
    const stackArr = err.stack.split('\n');
    t.true(stackArr.length > 4);
    t.equals(stackArr[0], 'Error: bad things happened');
    t.equals(stackArr[stackArr.length - 1], '  Error: client rejected');
    t.end();
  });
});
