const { promiseChainInit } = require("./index");

it("cache success p1 on promise chain has fail", async () => {
  const chain = promiseChainInit();

  const p1 = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(Math.random());
      }, 50);
    });
  };
  const p2 = async (pre) => {
    return new Promise((resolve, reject) => {
      const cur = Math.random();
      setTimeout(() => {
        cur > 0.5 ? resolve([pre, cur]) : reject([pre, cur]);
      }, 10);
    });
  };

  chain.next(p1);
  chain.next(p2);

  async function mock() {
    let p1ResOnError;
    let p1ResOnSuccess;

    let needRetry = true;
    let hasError = false;
    while (needRetry) {
      try {
        const res = await chain.execute();
        console.log(res);
        if (hasError) {
          needRetry = false;
          p1ResOnSuccess = res[0];
          return p1ResOnSuccess === p1ResOnError;
        }
      } catch (error) {
        console.log("error", error);
        p1ResOnError = error[0];
        hasError = true;
      }
    }
  }

  await expect(mock()).resolves.toEqual(true);
});
