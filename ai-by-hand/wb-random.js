// wb-random.js — cơ chế "🎲 Đổi số" dùng chung cho mọi phiếu Làm toán AI.
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

  // ---- Vừa-khít-màn-hình (chỉ trên MÀN HÌNH) ----------------------------------
  // Trang phiếu rộng cố định (210mm dọc / 297mm ngang) → trên điện thoại bị tràn
  // ngang, người xem chỉ thấy nửa trái. Ở đây đo bề rộng thật của .page rồi thu
  // nhỏ cho vừa bề ngang viewport. Đo .page nên tự đúng cho cả dọc lẫn ngang.
  //
  // Ưu tiên `zoom` (co giãn CẢ bố cục → hết tràn ngang, không cần bù margin,
  // chạy đúng trên Safari/Chrome/Firefox mobile đời nay). Trình duyệt nào không
  // hiểu `zoom` thì lùi về `transform: scale` + bù margin.
  // Khi IN: gỡ hết để PDF giữ đúng khổ A4 (xem before/afterprint).
  var _zoomOK = (function () {
    var t = document.createElement('div');
    t.style.zoom = '2';
    return t.style.zoom === '2' || t.style.zoom === '200%';
  })();
  function clearFit() {
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
      var s = pages[i].style;
      s.zoom = ''; s.transform = ''; s.transformOrigin = ''; s.margin = '';
    }
    document.documentElement.style.overflowX = '';
    document.body.style.overflowX = '';
  }
  function fitToScreen() {
    if (window.matchMedia && window.matchMedia('print').matches) return;
    var pages = document.querySelectorAll('.page');
    if (!pages.length) return;
    clearFit();                                    // reset trước khi đo bề rộng thật
    var vw = document.documentElement.clientWidth;
    var pw = pages[0].offsetWidth;                 // bề rộng thật của .page (px)
    if (vw >= pw + 1) return;                       // màn đủ rộng → giữ nguyên
    var scale = vw / pw;
    for (var i = 0; i < pages.length; i++) {
      var p = pages[i];
      if (_zoomOK) {
        p.style.zoom = scale;                       // reflow: bố cục co lại thật
      } else {
        var ph = p.offsetHeight;
        p.style.transformOrigin = 'top left';
        p.style.transform = 'scale(' + scale + ')';
        p.style.margin = (i === 0 ? '8px' : '0') + ' 0 ' +
          (-(ph * (1 - scale)) + 12) + 'px 0';
      }
    }
    if (!_zoomOK) {                                 // chỉ transform mới cần chặn tràn
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
    }
  }
  var _fitPending;
  function scheduleFit() {
    clearTimeout(_fitPending);
    _fitPending = setTimeout(fitToScreen, 120);    // gộp resize/xoay máy
  }
  window.addEventListener('DOMContentLoaded', fitToScreen);
  window.addEventListener('load', fitToScreen);    // đo lại sau khi mọi thứ ổn định
  window.addEventListener('resize', scheduleFit);
  window.addEventListener('beforeprint', clearFit);
  window.addEventListener('afterprint', fitToScreen);

  window.WB = {
    randInt: randInt, randIntNZ: randIntNZ, pick: pick, pickDistinct: pickDistinct,
    fmtInt: fmtInt, fmt2: fmt2, fmtTrim: fmtTrim, wrap: wrap, sumExpr: sumExpr, opTerm: opTerm,
    set: set, setAll: setAll, wire: wire
  };
})();
