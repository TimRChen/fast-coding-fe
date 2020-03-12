const $box = document.querySelector(".mouse-move-box");

let timer = null;

const options = {
  capture: false
};

const listener = e => {
  const { x, y } = e;
  const str = `x: ${x}, y: ${y}`;
  console.log(str);
};

// throttle 要点：
//  1. 时效性，一段时间内重复执行是无效的。
//  2. 连续性，连续执行的事件适合节流场景。
//  3. 函数实现上采用科里化思想
function throttle(fn, wait) {
  let start = Date.now();
  return e => {
    if (Date.now() - start >= wait) {
      clearTimeout(timer)
      timer = setTimeout(fn.bind(this, e), wait);
      start = Date.now()
    }
  };
}

const wait = 100;

$box.addEventListener("mousemove", throttle(listener, wait), options);