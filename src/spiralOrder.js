// 螺旋矩阵 实现
// 给定一个包含 m x n 个元素的矩阵（m 行, n 列），请按照顺时针螺旋顺序，返回矩阵中的所有元素。
// 示例 1:
// 输入:
// [
//  [ 1, 2, 3 ],
//  [ 4, 5, 6 ],
//  [ 7, 8, 9 ]
// ]
// 输出: [1,2,3,6,9,8,7,4,5]
// 示例 2:
// 输入:
// [
//   [1, 2, 3, 4],
//   [5, 6, 7, 8],
//   [9,10,11,12]
// ]
// 输出: [1,2,3,4,8,12,11,10,9,5,6,7]

const showBoard = document.querySelector(".result-show");

// const matrix_test = [
//   [1, 2, 3, 5],
//   [4, 5, 6, 7],
//   [7, 8, 9, 0],
//   [4, 2, 1, 2],
//   [6, 7, 3, 4]
// ];

const matrix_test = [
  [1, 2, 3, 5],
  [4, 5, 6, 7],
  [7, 8, 9, 0],
  [4, 2, 1, 2],
  [4, 2, 1, 2],
  [4, 2, 1, 2],
  [4, 2, 1, 2],
  [6, 7, 3, 4]
];

// const matrix_test = [
//   [1, 2, 3, 5, 1],
//   [4, 5, 6, 7, 1],
//   [7, 8, 9, 0, 1],
//   [4, 2, 1, 2, 1],
//   [6, 7, 3, 4, 1]
// ];

// const matrix_test = [
//   [1, 2, 3, 4],
//   [5, 6, 7, 8],
//   [9, 10, 11, 12]
// ];

// const matrix_test = [
//   [7],
//   [9],
//   [6]
// ];

/**
 * bad.
 * @param {number[][]} matrix
 * @return {number[]}
 */
const spiralOrder = function(matrix) {
  const m = matrix.length;
  let flatList = [];
  const markNegOne = list => {
    if (Array.isArray(list)) {
      return list.map(i => -1);
    } else {
      return list;
    }
  };
  for (let i = 0; i <= m; i++) {
    if (i === 0) {
      flatList = matrix[i];
      matrix[i] = markNegOne(matrix[i]);
    } else if (i > 0 && i < m - 1) {
      const n = matrix[i].length;
      const lastIndex = n - 1;
      const headIndex = matrix[i].findIndex(item => item !== -1);
      const lastItem = matrix[i][lastIndex];
      const headItem = matrix[i][headIndex];
      if (lastItem !== -1 && headItem !== -1) {
        flatList = [...flatList, lastItem];
        matrix[i][lastIndex] = -1;
      }
    } else if (i === m - 1) {
      const lastReverseList = matrix[i].reverse();
      flatList = [...flatList, ...lastReverseList];
      matrix[i] = markNegOne(matrix[i]);
    }
  }

  for (let j = m - 1; j >= 0; j--) {
    const headIndex = matrix[j].findIndex(item => item !== -1);
    const headItem = matrix[j][headIndex];
    if (headItem) {
      flatList = [...flatList, headItem];
    }
    matrix[j][headIndex] = -1;
  }

  const matrixFlat = matrix.reduce((acc, cur) => [...acc, ...cur], []);
  // const matrixFlat = matrix.flat() // equl to last row.;
  const iterable = matrixFlat.filter(i => i !== -1).length > 0;
  if (iterable) {
    const leftMatrix = matrix.reduce((acc, item) => {
      const str = item.join();
      const regx = /-1,?/g;
      let result = str.replace(regx, "");
      if (result.endsWith(",")) {
        result = result.substring(0, result.length - 1);
      }
      if (result !== "") {
        let list = result.split(",");
        list = list.map(k => parseInt(k, 10));
        acc.push(list);
      }
      return acc;
    }, []);
    const iterableFlatList = spiralOrder(leftMatrix);
    flatList = [...flatList, ...iterableFlatList];
  }
  return flatList;
};

/**
 * good.
 * @param {number[][]} matrix
 * @return {number[]}
 */
const spiralOrder = function(matrix) {
  let result = [],
    left = [];
  let len = matrix.length,
    start = 0;
  for (let i = 0; i < len; i++) {
    let tempArr = matrix[i].slice(start, matrix[i].length - start);
    if (i == start) {
      result = result.concat(tempArr);
      if (i == len - 1) break;
    } else if (i < len - 1) {
      result.push(matrix[i][matrix[i].length - 1 - start]);
      if (tempArr == 1) break;
      if (tempArr.length > 1) left.unshift(matrix[i][start]);
    } else {
      result = result.concat(tempArr.reverse(), left);
      if (tempArr.length <= 2) break;
      left.length = 0;
      i = start++;
      len--;
    }
  }
  return result;
};

const flatResult = spiralOrder(matrix_test);

showBoard.innerText = flatResult.join();
