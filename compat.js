/* Penambal fitur untuk Safari/iOS & Android lama (dimuat paling awal). */
(function () {
  'use strict';
  var w = window, AP = Array.prototype, SP = String.prototype;
  function def(o, k, v) { if (!o[k]) try { Object.defineProperty(o, k, { value: v, configurable: true, writable: true }); } catch (e) {} }
  def(AP, 'at', function (n) { n = Math.trunc(n) || 0; if (n < 0) n += this.length; return this[n]; });
  def(SP, 'at', function (n) { n = Math.trunc(n) || 0; if (n < 0) n += this.length; return this.charAt(n); });
  def(AP, 'flat', function (d) { d = d === undefined ? 1 : d; return d > 0 ? AP.reduce.call(this, function (a, x) { return a.concat(Array.isArray(x) ? x.flat(d - 1) : x); }, []) : AP.slice.call(this); });
  def(AP, 'flatMap', function (f, t) { return AP.map.call(this, f, t).flat(1); });
  def(AP, 'findLast', function (f, t) { for (var i = this.length - 1; i >= 0; i--) if (f.call(t, this[i], i, this)) return this[i]; });
  def(AP, 'findLastIndex', function (f, t) { for (var i = this.length - 1; i >= 0; i--) if (f.call(t, this[i], i, this)) return i; return -1; });
  def(SP, 'replaceAll', function (a, b) {
    if (a instanceof RegExp) { if (!a.global) throw new TypeError('replaceAll must be called with a global RegExp'); return this.replace(a, b); }
    return this.split(String(a)).join(typeof b === 'function' ? b(String(a)) : b);
  });
  if (!Object.hasOwn) Object.hasOwn = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  if (!Object.fromEntries) Object.fromEntries = function (it) { var o = {}; for (var e of it) o[e[0]] = e[1]; return o; };
  if (!w.Promise.allSettled) w.Promise.allSettled = function (ps) {
    return Promise.all(Array.from(ps).map(function (p) { return Promise.resolve(p).then(function (v) { return { status: 'fulfilled', value: v }; }, function (r) { return { status: 'rejected', reason: r }; }); }));
  };
  if (!w.Promise.any) w.Promise.any = function (ps) {
    return new Promise(function (res, rej) { var n = 0, errs = [], a = Array.from(ps); if (!a.length) rej(new Error('No promises')); a.forEach(function (p, i) { Promise.resolve(p).then(res, function (e) { errs[i] = e; if (++n === a.length) rej(new Error('All promises were rejected')); }); }); });
  };
  if (!w.structuredClone) w.structuredClone = function (v) { return v === undefined ? v : JSON.parse(JSON.stringify(v)); };
  if (!w.queueMicrotask) w.queueMicrotask = function (f) { Promise.resolve().then(f); };
  if (!w.requestIdleCallback) {
    w.requestIdleCallback = function (cb) { var s = Date.now(); return setTimeout(function () { cb({ didTimeout: false, timeRemaining: function () { return Math.max(0, 50 - (Date.now() - s)); } }); }, 1); };
    w.cancelIdleCallback = function (id) { clearTimeout(id); };
  }
  if (w.AbortSignal && !AbortSignal.timeout) AbortSignal.timeout = function (ms) { var c = new AbortController(); setTimeout(function () { c.abort(); }, ms); return c.signal; };
  if (w.crypto && !w.crypto.randomUUID) w.crypto.randomUUID = function () {
    var b = new Uint8Array(16); w.crypto.getRandomValues(b); b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  };
  // Penanda perangkat untuk CSS
  var ua = navigator.userAgent, de = document.documentElement;
  var ios = /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) de.classList.add('is-ios');
  if (/Android/.test(ua)) de.classList.add('is-android');
  var sa = (w.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  if (sa) de.classList.add('is-standalone');
  w.__isStandalone = sa; w.__isIOS = ios;
})();
