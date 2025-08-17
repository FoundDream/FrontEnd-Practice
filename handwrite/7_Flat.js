// 递归实现
const myFlat = (arr, depth = 1) => {
  const results = [];

  const flatten = (arr, currentDepth) => {
    for (const item of arr) {
      if (Array.isArray(item) && currentDepth < depth) {
        flatten(item, currentDepth + 1);
      } else {
        results.push(item);
      }
    }
  };

  flatten(arr, 0);
  return results;
};

const arr = [1, [2, [3, [4]]]];

console.log(myFlat(arr)); // 默认 depth = 1 => [1, 2, [3, [4]]]
console.log(myFlat(arr, 2)); // [1, 2, 3, [4]]
console.log(myFlat(arr, 3)); // [1, 2, 3, 4]
