const myPromiseAllSettled = (promises) => {
  const results = [];
  const length = promises.length;
  let settledCount = 0;

  return new Promise((resolve, reject) => {
    if (length === 0) {
      return resolve([]);
    }
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = { status: "fulfilled", value };
        })
        .catch((err) => {
          results[index] = { status: "rejected", err };
        })
        .finally(() => {
          settledCount++;
          if (settledCount === length) resolve(results);
        });
    });
  });
};

// --- 测试开始 ---

// 创建一些 Promise 和非 Promise 值
const promise1 = Promise.resolve("Success!");
const promise2 = new Promise((resolve, reject) =>
  setTimeout(() => reject(new Error("Failed!")), 100)
);
const promise3 = "This is a string"; // 非 Promise 值
const promise4 = new Promise((resolve) => setTimeout(() => resolve(123), 50));

// 将它们放入一个数组
const promises = [promise1, promise2, promise3, promise4];

console.log("开始测试 myPromiseAllSettled...");

myPromiseAllSettled(promises)
  .then((results) => {
    console.log("测试通过！结果如下：");
    console.log(results);

    // 验证结果是否符合预期
    // 期望的结构：
    // [
    //   { status: 'fulfilled', value: 'Success!' },
    //   { status: 'rejected', reason: [Error: Failed!] },
    //   { status: 'fulfilled', value: 'This is a string' },
    //   { status: 'fulfilled', value: 123 }
    // ]

    // 简单的断言，确保结果的长度和状态正确
    if (
      results.length === 4 &&
      results[0].status === "fulfilled" &&
      results[1].status === "rejected" &&
      results[2].status === "fulfilled" &&
      results[3].status === "fulfilled"
    ) {
      console.log("\n✅ 所有断言都通过。");
    } else {
      console.log("\n❌ 断言失败。结果不符合预期。");
    }
  })
  .catch((err) => {
    console.error("测试失败：", err);
  });

// 测试空数组
console.log("\n开始测试空数组...");
myPromiseAllSettled([]).then((results) => {
  console.log("空数组测试通过！结果：", results);
  if (results.length === 0) {
    console.log("✅ 空数组断言通过。");
  } else {
    console.log("❌ 空数组断言失败。");
  }
});
