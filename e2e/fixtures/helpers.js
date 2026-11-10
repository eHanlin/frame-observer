// Shared by parent.html and child.html.
window.$frames = {};

/**
 * @param {String} name iframe name (used by Playwright's page.frame({name}))
 * @param {String} [query] extra query string for child.html
 * @param {String} [origin] origin serving child.html, defaults to window.CHILD_ORIGIN
 * @type Promise resolved on iframe load
 */
window.createFrame = function (name, query, origin) {
  return new Promise(function (resolve) {
    var iframe = document.createElement('iframe');
    iframe.name = name;
    iframe.onload = function () { resolve(); };
    iframe.src = (origin || window.CHILD_ORIGIN) + '/child.html?name=' + encodeURIComponent(name) + (query ? '&' + query : '');
    window.$frames[name] = iframe;
    document.body.appendChild(iframe);
  });
};

/**
 * Resolves with {status: 'timeout'} when the promise does not settle within ms.
 */
window.settleWithin = function (promise, ms) {
  return Promise.race([
    promise.then(
      function (value) { return { status: 'resolved', value: value }; },
      function (reason) { return { status: 'rejected', reason: reason }; }
    ),
    new Promise(function (resolve) { setTimeout(function () { resolve({ status: 'timeout' }); }, ms); })
  ]);
};
