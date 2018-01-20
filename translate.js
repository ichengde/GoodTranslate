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


  var getTKK = function () {
    return new Promise(function (resolve, reject) {
      var now = Math.floor(Date.now() / 3600000);

      if (Number(window.TKK.split('.')[0]) === now) {
        resolve(window.TKK);
      } else {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://translate.google.com');

        request.setRequestHeader('Content-Type', 'text/html; charset=UTF-8');
        request.onload = () => {
          if (request.status >= 200 && request.status < 400) {
            var code = request.responseText.match(/TKK=(.*?)\(\)\)'\);/g);
            if (code) {
              eval(code[0]);
              if (typeof TKK !== 'undefined') {
                window.TKK = TKK;
                localStorage.setItem('TKK', TKK);
              }
            }

            resolve(TKK)
          }
        }

        request.onerror = function (error) {
          reject(error)
        }

        request.send()
      }).catch(function (err) {
          var e = new Error();
          e.code = 'BAD_NETWORK';
          e.message = err.message;
          reject(e);
        });

    });
  }


  var originText = '';
  var token = '';
  originText = window.getSelection().toString();
  getTKK().then(() => {
     console.log(originText, wq(originText));
  });

})();

