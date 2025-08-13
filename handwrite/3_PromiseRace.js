const myPromiseRace = (promises) => {
  const length = promises.length;
  if (length === 0) return new Promise(() => {});

  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      Promise.resolve(promise).then(resolve).catch(reject);
    });
  });
};

// --- 测试用例 ---

// 创建一些 Promise，它们会在不同的时间点解决或拒绝
const fastResolvedPromise = new Promise((resolve) =>
  setTimeout(() => resolve("fastResolvedPromise"), 10)
);

const slowResolvedPromise = new Promise((resolve) =>
  setTimeout(() => resolve("slowResolvedPromise"), 100)
);

const fastRejectedPromise = new Promise((resolve, reject) =>
  setTimeout(() => reject("fastRejectedPromise"), 5)
);

const nonPromiseValue = "This is a string";

// 1. 测试最快解决的 Promise
console.log("--- 测试最快解决的 Promise ---");
myPromiseRace([slowResolvedPromise, fastResolvedPromise])
  .then((result) => {
    console.log("✅ 测试通过！最快解决的 Promise 获胜。");
    console.assert(
      result === "fastResolvedPromise",
      `预期结果: 'fastResolvedPromise', 实际结果: ${result}`
    );
  })
  .catch((err) => {
    console.error("❌ 测试失败:", err);
  });

// 2. 测试最快拒绝的 Promise
console.log("\n--- 测试最快拒绝的 Promise ---");
myPromiseRace([slowResolvedPromise, fastRejectedPromise])
  .then((result) => {
    console.error("❌ 测试失败：Promise 不应被解决。");
  })
  .catch((err) => {
    console.log("✅ 测试通过！最快拒绝的 Promise 获胜。");
    console.assert(
      err === "fastRejectedPromise",
      `预期结果: 'fastRejectedPromise', 实际结果: ${err}`
    );
  });

// 3. 测试包含非 Promise 值的数组
console.log("\n--- 测试包含非 Promise 值的数组 ---");
myPromiseRace([slowResolvedPromise, nonPromiseValue])
  .then((result) => {
    console.log("✅ 测试通过！非 Promise 值立即获胜。");
    console.assert(
      result === "This is a string",
      `预期结果: 'This is a string', 实际结果: ${result}`
    );
  })
  .catch((err) => {
    console.error("❌ 测试失败:", err);
  });

// 4. 测试空数组
console.log("\n--- 测试空数组 ---");
const emptyRace = myPromiseRace([]);

const emptyRaceTimeout = setTimeout(() => {
  console.log("✅ 测试通过！空数组的 Promise 没有解决也没有拒绝。");
}, 1000);

emptyRace
  .then(() => {
    clearTimeout(emptyRaceTimeout);
    console.error("❌ 测试失败：空数组的 Promise 不应该解决！");
  })
  .catch(() => {
    clearTimeout(emptyRaceTimeout);
    console.error("❌ 测试失败：空数组的 Promise 不应该拒绝！");
  });
