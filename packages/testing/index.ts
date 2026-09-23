export function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

export function expectDefined<T>(value: T | null | undefined, message = 'Expected a defined value'): T {
  if (value === null || value === undefined) throw new Error(message);
  return value;
}