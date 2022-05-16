const log = (x) => console.log(`%c${x}`, "font-family:monospace;");

export const test = (name, fn) => {
  log(`test: ${name}`);
  fn();
};

export const is = (actual, expected) => {
  if (expected === actual) {
    return true;
  } else {
    log(`failed\n  expected: "${expected}"\n  actual:   "${actual}"`);
    return false;
  }
};
