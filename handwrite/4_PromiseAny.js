const myPromiseAny = (promises) => {
  let errCount = 0;
  const errs = [];
  const length = promises.length;

  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve)
        .catch((err) => {
          errCount++;
          errs[index] = err;
          if (length === errCount) {
            reject(new AggregateError(errs));
          }
        });
    });
  });
};

// --- 测试用例开始 ---

// 创建一些 Promise
const p1 = new Promise((resolve) =>
  setTimeout(() => resolve("First Success"), 50)
);
const p2 = new Promise((_, reject) =>
  setTimeout(() => reject("First Failure"), 10)
);
const p3 = new Promise((resolve) =>
  setTimeout(() => resolve("Second Success"), 100)
);
const p4 = new Promise((_, reject) =>
  setTimeout(() => reject("Second Failure"), 20)
);

// 1. 测试至少有一个 Promise 成功的情况
console.log("--- 1. 测试至少有一个 Promise 成功 ---");
myPromiseAny([p2, p1, p3])
  .then((result) => {
    console.log("✅ 测试通过：获得了第一个成功的 Promise。");
    console.assert(
      result === "First Success",
      `预期结果: 'First Success', 实际结果: ${result}`
    );
  })
  .catch((err) => {
    console.error("❌ 测试失败：不应该捕获到错误。", err);
  });

// 2. 测试所有 Promise 都失败的情况
console.log("\n--- 2. 测试所有 Promise 都失败 ---");
myPromiseAny([p2, p4])
  .then((result) => {
    console.error("❌ 测试失败：不应该获得成功结果。", result);
  })
  .catch((err) => {
    console.log("✅ 测试通过：所有 Promise 都失败，并返回了 AggregateError。");
    console.assert(
      err instanceof AggregateError,
      "错误类型不正确，应为 AggregateError。"
    );
    console.log("错误详情:", err.errors);
  });

// 3. 测试空数组
console.log("\n--- 3. 测试空数组 ---");
myPromiseAny([])
  .then((result) => {
    console.error("❌ 测试失败：空数组不应该成功。", result);
  })
  .catch((err) => {
    console.log("✅ 测试通过：空数组立即失败，并返回了 AggregateError。");
    console.assert(
      err instanceof AggregateError && err.errors.length === 0,
      "空数组错误类型或内容不正确。"
    );
  });

// 4. 测试包含非 Promise 值的情况
console.log("\n--- 4. 测试包含非 Promise 值 ---");
myPromiseAny([p2, "Hello World", p1])
  .then((result) => {
    console.log("✅ 测试通过：非 Promise 值被视为成功，并立即返回。");
    console.assert(
      result === "Hello World",
      `预期结果: 'Hello World', 实际结果: ${result}`
    );
  })
  .catch((err) => {
    console.error("❌ 测试失败：不应该捕获到错误。", err);
  });
