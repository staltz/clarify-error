function splitStack(err: Error | string): Array<string> {
  if (typeof err === 'string') return [`Error: ${err}`];
  else if (err.stack) return err.stack.split('\n');
  else return [`${err.name}: ${err.message}`];
}

export = function clarify(innerError: Error | string, message: string): Error {
  const outerError = new Error(message);
  const outerStack = outerError.stack!.split('\n');
  outerStack.splice(1, 1);
  const innerStack = splitStack(innerError);
  innerStack[0] = '  ' + innerStack[0];
  for (let i = 1; i < outerStack.length; i++) {
    if (innerStack.includes(outerStack[i])) {
      outerStack.splice(i);
      break;
    }
  }
  outerError.stack = outerStack.concat(innerStack).join('\n');
  return outerError;
};
