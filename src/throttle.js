const $box = document.querySelector(".mouse-move-box");

const options = {
  capture: false
};

const listener = e => {
  const { x, y } = e;
  const str = `x: ${x}, y: ${y}`;
  console.log(str);
};

// 别人的面试遇到的问题：能实现一个节流函数吗？
// 别人的回答：(很快写完了 定时器版) 面试官改进一下要求滚动第一次就触发，于是改成时间戳版。
// 再改进一下，最后一次的延迟也要触发，于是改成了时间戳+定时器版，完美解决
// 特此，我对节流进行了一次分析，对上述三种情况下的节流进行了不同的实现：

// > 定时器版:（特点：可以触发最后一次事件的延迟，缺点：无法对事件第一次响应进行触发）
function throttle(fn, wait) {
  let timer = null;
  return function() {
    if (!timer) {
      timer = setTimeout((fn.apply(this, arguments), (timer = null)), wait);
    }
  };
}

// > 时间戳版:（特点：事件第一次响应触发，缺点：最后一次事件延迟无法触发）
function throttle(fn, wait) {
  let start = Date.now();
  return function() {
    if (Date.now() - start >= wait) {
      fn.apply(this, arguments);
      start = Date.now();
    }
  };
}

// > 时间戳+定时器版
function throttle(fn, wait) {
  let timer = null;
  let start = Date.now();
  return function() {
    if (Date.now() - start >= wait) {
      timer = setTimeout(
        (fn.apply(this, arguments), (timer = undefined)),
        wait
      );
      start = Date.now();
    }
  };
}

// > 时间戳+定时器版 更通用版本：
function throttle(fn, wait) {
  let timer = undefined;
  let lastCallTime = Date.now();
  return function() {
    const timeSinceLastCall = Date.now() - lastCallTime;
    const shouldCall = timeSinceLastCall >= wait;
    if (shouldCall) {
      timer = setTimeout(
        (fn.apply(this, arguments), (timer = undefined)),
        wait
      );
      lastCallTime = Date.now();
    }
  };
}

// > 时间戳+RAF版本 性能更好的一种实现：
function throttle(fn, wait) {
  let RAF = undefined;
  let lastCallTime = Date.now();
  return function() {
    const timeSinceLastCall = Date.now() - lastCallTime;
    const shouldCall = timeSinceLastCall >= wait;
    if (shouldCall) {
      const context = this;
      const args = arguments;
      cancelAnimationFrame(RAF);
      RAF = requestAnimationFrame(() => fn.apply(context, args));
      lastCallTime = Date.now();
    }
  };
}

// > 通用版 也可以叫兼容版
function throttle(fn, wait) {
  let RAF = undefined;
  let timer = undefined;
  let lastCallTime = Date.now();
  return function() {
    const timeSinceLastCall = Date.now() - lastCallTime;
    const shouldCall = timeSinceLastCall >= wait;
    if (shouldCall) {
      const context = this;
      const args = arguments;
      if (typeof requestAnimationFrame === "function") {
        typeof cancelAnimationFrame === "function"
          ? cancelAnimationFrame(RAF)
          : (RAF = undefined);
        RAF = requestAnimationFrame(() => fn.apply(context, args));
      } else {
        timer = setTimeout(
          (fn.apply(context, args), (timer = undefined)),
          wait
        );
      }
      lastCallTime = Date.now();
    }
  };
}

// throttle 要点：
//  1. 时效性，一段时间内重复执行是无效的。
//  2. 连续性，连续执行的事件适合节流场景。
//  3. 函数实现上采用科里化思想

const wait = 500; // 500ms 时间长比较容易看出这三种节流实现的区别

$box.addEventListener("mousemove", throttle(listener, wait), options);
