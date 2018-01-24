;(function(){
  var vq = null;
  var tq = function(a) {
    return function() {
      return a
    }
  }
  , uq = function(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
      var d = b.charAt(c + 2);
      d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
      d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
      a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
  }
  ,wq = function(a) {
    if (null !== vq)
    var b = vq;
    else {
      b = tq(String.fromCharCode(84));
      var c = tq(String.fromCharCode(75));
      b = [b(), b()];
      b[1] = c();
      b = (vq = window[b.join(c())] || "") || ""
    }
    var d = tq(String.fromCharCode(116));
    c = tq(String.fromCharCode(107));
    d = [d(), d()];
    d[1] = c();
    c = "&" + d.join("") + "=";
    d = b.split(".");
    b = Number(d[0]) || 0;
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
      var l = a.charCodeAt(g);
      128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
        e[f++] = l >> 18 | 240,
        e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
        e[f++] = l >> 6 & 63 | 128),
      e[f++] = l & 63 | 128)
    }
    a = b;
    for (f = 0; f < e.length; f++)
      a += e[f],
      a = uq(a, "+-a^+6");
    a = uq(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return c + (a.toString() + "." + (a ^ b))
  };

  var stringifyPrimitive = function(v) {
    switch (typeof v) {
      case 'string':
        return v;

      case 'boolean':
        return v ? 'true' : 'false';

      case 'number':
        return isFinite(v) ? v : '';

      default:
        return '';
    }
  };

  var stringify  = function(obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';
    if (obj === null) {
      obj = undefined;
    }

    if (typeof obj === 'object') {
      return Object.keys(obj).map(function(k) {
        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
        if (Array.isArray(obj[k])) {
          return obj[k].map(function(v) {
            return ks + encodeURIComponent(stringifyPrimitive(v));
          }).join(sep);
        } else {
          return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
        }
      }).join(sep);

    }

    if (!name) return '';
    return encodeURIComponent(stringifyPrimitive(name)) + eq +
    encodeURIComponent(stringifyPrimitive(obj));
  };

  var getTKK = function () {
    return new Promise(function (resolve, reject) {
      var now = Math.floor(Date.now() / 3600000);

      if (window.TKK !== undefined && Number(window.TKK.split('.')[0]) === now) {
        resolve(window.TKK);
      } else {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://translate.google.cn');

        request.setRequestHeader('Content-Type', 'text/html; charset=UTF-8');
        request.onload = () => {
          if (request.status >= 200 && request.status < 400) {
            var regex = /TKK=(.*?)\(\)\)'\)\;/g;
            var code = request.responseText.match(regex);
            if (code) {
              eval(code[0]);
              if (typeof TKK !== 'undefined') {
                window.TKK = TKK;
                localStorage.setItem('TKK', TKK);
              }
            }

            resolve(TKK);
          }
        }

        request.onerror = function (error) {
          reject(error)
        }

        request.send()
      }});
  }

  var  translate = function (text, toLang, token) {
    return new Promise((resolve,reject)=>{
      var url = 'https://translate.google.cn/translate_a/single';
      var opts = {};
      opts.from = 'auto';
      opts.to = toLang;
      var data = {
        client: 't',
        sl: opts.from,
        tl: opts.to,
        hl: opts.to,
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
        ie: 'UTF-8',
        oe: 'UTF-8',
        otf: 1,
        ssel: 0,
        tsel: 0,
        kc: 7,
        q: text
      };


      var request = new XMLHttpRequest();
      url = url + '?' + stringify(data) + token;

      request.open('GET', url);

      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          const res = JSON.parse(request.responseText);
          resolve(res);
        }
      }

      request.onerror = function (error) {
        reject(error)
      }

      request.send()


    });
  };
  var domClassName = 'goodTranslatePlugin';
  var showText = (parentElement, text) => {

    var descriptionDom = document.createElement('div');
    descriptionDom.style.color = 'red';
    descriptionDom.classList.add(domClassName);
    descriptionDom.innerHTML = text;
    parentElement.appendChild(descriptionDom);

  };

  var clearText = function() {
    var texts = document.querySelectorAll('.'+domClassName);
    for (var textItem = 0;textItem < texts.length;textItem++) {
      texts[textItem].remove();
    }
  };


  var originText = '';
  var token = '';
  originText = window.getSelection().toString();

  chrome.storage.sync.get({
    toLanguage: 'en'
  }, function(storage) {
    if (storage.toLanguage === 'clear') {
      clearText();
      return;
    }
    getTKK().then(() => {
      return translate(originText, storage.toLanguage, wq(originText))
    }).then(ans=>{
      console.log(ans);
      let ansText = '';
      ans[0].forEach((as)=>{
        if (as[0]) {
          ansText += as[0] + ' ';
        }
      });

      showText(window.getSelection().baseNode.parentElement, ansText);
    });
  });
})();

