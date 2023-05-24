# clarify-error

Wrap errors in explanations.

> This is a spiritual successor to [explain-error](https://github.com/dominictarr/explain-error), rewritten after 8 years, using TypeScript, fixing some quirks and achieving 100%
test coverage.

In Node.js sometimes something fails because of some internal detail, but then
this error may be passed back somewhere else, too often, context is lost.

## Example

```js
const fs = require('fs')
const clarify = require('clarify-error')

// stat a file that does not exist. this will error, so add an explanation.
function clarifyError(cb) {
  fs.stat('neoatuhrcoahkrcophkr', (err) => {
    if (err) cb(clarify(err, 'asked for a file that certainly did not exist'))
    else cb()
  })
}

// this works even with multiple layers of explanations.
clarifyError(function (err) {
  throw clarify(err, 'called an function that was expected to fail')
})
```

**Output:**

`fs.stat` does not show where it was called from, but at least now you know what
happened after that.

```
Error: called an function that was expected to fail
    at /home/staltz/oss/wrap-error/example.js:11:9
    at /home/staltz/oss/wrap-error/example.js:5:14
  Error: asked for a file that certainly did not exist
    at /home/staltz/oss/wrap-error/example.js:5:17
    at FSReqCallback.oncomplete (fs.js:168:21)
  Error: ENOENT: no such file or directory, stat 'neoatuhrcoahkrcophkr'
```

## License

MIT
