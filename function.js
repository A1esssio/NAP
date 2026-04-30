// Задание 1.1 — concatenate

function concatenate(arr, separator) {
  let result = "";
  for (let i = 0; i < arr.length; i++) {
    result += arr[i];
    if (i < arr.length - 1) {
      result += separator;
    }
  }
  return result;
}

console.log("=== 1.1 concatenate ===");
console.log(concatenate(["Я", "Учусь", "на", "лучшей", "кафедре"], " "));
// Я Учусь на лучшей кафедре

// ============================================================

// Задание 1.10 — erase

function erase(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (
      arr[i] !== false &&
      arr[i] !== undefined &&
      arr[i] !== "" &&
      arr[i] !== 0 &&
      arr[i] !== null
    ) {
      result.push(arr[i]);
    }
  }
  return result;
}

console.log("\n=== 1.10 erase ===");
const data = [0, 1, false, 2, undefined, "", 3, null];
console.log(erase(data)); // [1, 2, 3]

// ============================================================

// Задание 2.4 — diff

function diff(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    let found = false;
    for (let j = 0; j < b.length; j++) {
      if (a[i] === b[j]) {
        found = true;
        break;
      }
    }
    if (!found) {
      result.push(a[i]);
    }
  }
  return result;
}

console.log("\n=== 2.4 diff ===");
console.log(diff([1, 2, 3, 4, 5], [2, 4])); // [1, 3, 5]
console.log(diff(["a", "b", "c"], ["b", "d"])); // ['a', 'c']

// ============================================================

// Задание 3.2 — inverse

function inverse(arr, n) {
  const result = [];

  if (n === undefined || n === 0) {
    for (let i = arr.length - 1; i >= 0; i--) {
      result.push(arr[i]);
    }
  } else if (n > 0) {
    for (let i = 0; i < n; i++) {
      result.push(arr[i]);
    }
    for (let i = arr.length - 1; i >= n; i--) {
      result.push(arr[i]);
    }
  } else {
    const keepCount = -n;
    const reverseUntil = arr.length - keepCount;
    for (let i = reverseUntil - 1; i >= 0; i--) {
      result.push(arr[i]);
    }
    for (let i = reverseUntil; i < arr.length; i++) {
      result.push(arr[i]);
    }
  }

  return result;
}

console.log("\n=== 3.2 inverse ===");
console.log(inverse([1, 2, 3, 4, 5]));
console.log(inverse([1, 2, 3, 4, 5], 2));
console.log(inverse([1, 2, 3, 4, 5], -2));
