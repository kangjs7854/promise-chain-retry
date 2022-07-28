export default function () {
  let tasks: any[] = [];
  let promiseCache: any[] = [];

  let needRetry = false;

  return {
    next,
    execute,
  };

  function next(cb: (...args: any) => Promise<any>) {
    if (needRetry) return;
    tasks.push(cb);
  }

  function cachePromise(promiseIndex: number, promiseRes: any) {
    promiseCache[promiseIndex] = promiseRes;
  }

  function getPromiseCache(index: number) {
    return promiseCache[index];
  }

  function callPromise(index: number) {
    return async (prePromiseRes: any) => {
      if (needRetry) {
        const cacheRes = getPromiseCache(index);
        if (cacheRes) return cacheRes;
      }
      const res = await tasks[index](prePromiseRes);
      cachePromise(index, res);
      return res;
    };
  }

  async function execute() {
    let errorInfo;
    let prePromiseRes;
    try {
      for (let i = 0; i < tasks.length; i++) {
        prePromiseRes = await callPromise(i)(prePromiseRes);
        console.log(i, prePromiseRes);
      }
    } catch (error) {
      errorInfo = error;
    } finally {
      if (errorInfo) {
        needRetry = true;
        return Promise.reject(errorInfo);
      }

      reset();
      return prePromiseRes;
    }
  }

  function reset() {
    needRetry = false;
    tasks = [];
    promiseCache = [];
  }
}
