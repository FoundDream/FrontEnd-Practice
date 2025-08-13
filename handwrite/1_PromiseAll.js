// 我的版本
const myPromiseAll = (promises) => {
  const results = [];
  const length = promises.length;
  let count = 0;

  return new Promise((resolve, reject) => {
    if (length === 0) {
      resolve(results); // 空数组特殊处理
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise) // Promise.resolve 可以让非 Promise 转换成 Promise
        .then((value) => {
          results[index] = value;
          count++;
          if (count === length) resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

// 测试 case
const p1 = Promise.resolve(1);
const p2 = 2; // 非 Promise
const p3 = new Promise((resolve) => setTimeout(() => resolve(3), 100));

myPromiseAll([p1, p2, p3])
  .then((res) => {
    console.log(res); // [1, 2, 3]
  })
  .catch((err) => {
    console.error("Error:", err);
  });

// 测试 reject
const p4 = Promise.reject("fail");

myPromiseAll([p1, p4, p3])
  .then((res) => console.log(res))
  .catch((err) => console.error("Rejected:", err)); // Rejected: fail
