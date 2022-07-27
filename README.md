# why we need to retry promise?

when promise chain has error, some time we need to retry

```js
function api(){
    const id1 = await genId1();
    console.log(id1)
    const id2 = await genId2(id1);
    return id2
}

//first call, genId2 throw error
api() //123

//retry, genId2 normal, but gen aother id1
api() //666


```

# use promise-chain-retry

```js
const chain = promiseChainInit();
function api() {
  chain.next(async () => {
    return await genId1();
  });
  chain.next(async (id1) => {
    console.log(id1);
    return await genId2(id1);
  });

  return chain.execute();
}

//first call, genId2 throw error
api(); //123

//retry, genId2 normal, reused successful promises
api(); //123
```
