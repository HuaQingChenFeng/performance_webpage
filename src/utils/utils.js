/**
 * Created by  on 2018/11/8
 */
/**
 * js浮点数计算
 * */
// 加法运算
export function floatingAdd (numA, numB) {
  let r1 = 0
  let r2 = 0
  let m = 0
  try {
    r1 = numA.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = numB.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return m === 0 ? 0 : (numA * m + numB * m) / m
}

export function add(a, b) {
  var c, d, e;
  try {
      c = a.toString().split(".")[1].length;
  } catch (f) {
      c = 0;
  }
  try {
      d = b.toString().split(".")[1].length;
  } catch (f) {
      d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

export function sub(a, b) {
  var c, d, e;
  try {
      c = a.toString().split(".")[1].length;
  } catch (f) {
      c = 0;
  }
  try {
      d = b.toString().split(".")[1].length;
  } catch (f) {
      d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

export function mul(a, b) {
  var c = 0,
      d = a.toString(),
      e = b.toString();
  try {
      c += d.split(".")[1].length;
  } catch (f) {}
  try {
      c += e.split(".")[1].length;
  } catch (f) {}
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

export function div(a, b) {
  var c, d, e = 0,
      f = 0;
  try {
      e = a.toString().split(".")[1].length;
  } catch (g) {}
  try {
      f = b.toString().split(".")[1].length;
  } catch (g) {}
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}


/**
 * 数组去重
 * @param arr
 * @returns {any[]}
 */
export function distinct (arr) {
  return Array.from(new Set(arr))
}
