// wb-random.js — cơ chế "🎲 Đổi số" dùng chung cho mọi phiếu AI by Hand.
// Mỗi bài tự viết generate() tính số liệu mới, rồi gọi WB.setAll({...}) để ghi vào
// các thẻ có data-q="<key>" (mọi thẻ cùng key được cập nhật cùng lúc).
(function () {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function randIntNZ(min, max) {
    let v;
    do { v = randInt(min, max); } while (v === 0);
    return v;
  }
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function pickDistinct(arr, n) {
    const pool = arr.slice();
    const out = [];
    while (out.length < n && pool.length) {
      out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    return out;
  }
  function minus(s) {
    return s.replace(/^-/, '−').replace(/-(\d)/g, '−$1');
  }
  // số nguyên: −3, 0, 5 ...
  function fmtInt(x) {
    if (x === 0) return '0';
    return minus(String(Math.round(x)));
  }
  // luôn 2 chữ số thập phân: dùng cho xác suất / sigmoid / softmax
  function fmt2(x) {
    const v = Math.round(x * 100) / 100;
    if (v === 0) return '0.00';
    return minus(v.toFixed(2));
  }
  // số nguyên nếu tròn, ngược lại tối đa 2 chữ số thập phân (bỏ số 0 dư) — dùng cho θ, ℒ kiểu gradient descent
  function fmtTrim(x) {
    const v = Math.round(x * 100) / 100;
    if (v === 0) return '0';
    let s = v.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
    return minus(s);
  }
  // bọc ngoặc số âm khi nó đứng làm thừa số/cơ số trong một tích hoặc lũy thừa, ví dụ (−3)² , (−1)·2
  function wrap(s) {
    return /^−/.test(s) ? '(' + s + ')' : s;
  }
  // nối các số hạng có dấu thành chuỗi kiểu "2 + 4 + 6" hay "2 − 4 + 6" (không viết "+ −")
  function sumExpr(values, fmt) {
    fmt = fmt || fmtInt;
    return values.map(function (v, i) {
      var s = fmt(v);
      var neg = /^−/.test(s);
      var mag = neg ? s.slice(1) : s;
      if (i === 0) return neg ? '−' + mag : mag;
      return (neg ? '− ' : '+ ') + mag;
    }).join(' ');
  }
  // toán hạng nối tiếp có dấu, dùng sau một chỗ trống/số đã biết: " + 3" hay " − 2"
  function opTerm(v, fmt) {
    fmt = fmt || fmtInt;
    var s = fmt(v);
    return /^−/.test(s) ? ' − ' + s.slice(1) : ' + ' + s;
  }
  function set(key, value) {
    document.querySelectorAll('[data-q="' + key + '"]').forEach(function (el) {
      el.textContent = value;
    });
  }
  function setAll(map) {
    Object.keys(map).forEach(function (k) { set(k, map[k]); });
  }
  function wire(generate) {
    const btn = document.querySelector('.js-randomize');
    if (btn) btn.addEventListener('click', generate);
  }
  window.WB = {
    randInt: randInt, randIntNZ: randIntNZ, pick: pick, pickDistinct: pickDistinct,
    fmtInt: fmtInt, fmt2: fmt2, fmtTrim: fmtTrim, wrap: wrap, sumExpr: sumExpr, opTerm: opTerm,
    set: set, setAll: setAll, wire: wire
  };
})();
