// Unit-level tests for internal modules, executed inside a real browser page.
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/parent.html');
});

test.describe('buildDeferred', () => {
  test('resolve(...args) resolves the promise with an args array', async ({ page }) => {
    const value = await page.evaluate(() => {
      const d = __fo.buildDeferred();
      d.resolve(1, 'a');
      return d;
    });
    expect(value).toEqual([1, 'a']);
  });

  test('done(fn) receives resolved args spread', async ({ page }) => {
    const args = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const d = __fo.buildDeferred();
          d.done((...a) => resolve(a));
          d.resolve(1, 2);
        })
    );
    expect(args).toEqual([1, 2]);
  });

  test('reject(...args) rejects with an args array and fail(fn) receives args spread', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const d = __fo.buildDeferred();
      const failArgs = new Promise((resolve) => d.fail((...a) => resolve(a)));
      d.reject('err', 3);
      const reason = await d.then(
        () => null,
        (r) => r
      );
      return { reason, failArgs: await failArgs };
    });
    expect(result.reason).toEqual(['err', 3]);
    expect(result.failArgs).toEqual(['err', 3]);
  });

  test('always(fn) is called with resolved args', async ({ page }) => {
    const args = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const d = __fo.buildDeferred();
          d.always((...a) => resolve(a));
          d.resolve('ok');
        })
    );
    expect(args).toEqual(['ok']);
  });

  test('always(fn) is called with rejected args', async ({ page }) => {
    const result = await page.evaluate(() => {
      const d = __fo.buildDeferred();
      const called = new Promise((resolve) => d.always((...a) => resolve(a)));
      d.reject('boom');
      return settleWithin(called, 500);
    });
    expect(result).toEqual({ status: 'resolved', value: ['boom'] });
  });
});

test.describe('StateManager', () => {
  test('get(name) returns the same deferred for the same name and different ones otherwise', async ({ page }) => {
    const result = await page.evaluate(() => {
      const sm = new __fo.StateManager();
      return { same: sm.get('a') === sm.get('a'), different: sm.get('a') !== sm.get('b') };
    });
    expect(result).toEqual({ same: true, different: true });
  });

  test('assign forwards a resolve that happens after assignment', async ({ page }) => {
    const value = await page.evaluate(() => {
      const sm = new __fo.StateManager();
      const d = __fo.buildDeferred();
      sm.assign('ready', d);
      sm.get('ready').resolve(['x', 1]);
      return d;
    });
    expect(value).toEqual([['x', 1]]);
  });

  test('assign forwards a resolve that happened before assignment', async ({ page }) => {
    const value = await page.evaluate(() => {
      const sm = new __fo.StateManager();
      sm.get('ready').resolve(['early']);
      const d = __fo.buildDeferred();
      sm.assign('ready', d);
      return d;
    });
    expect(value).toEqual([['early']]);
  });

  test('assign forwards a reject', async ({ page }) => {
    const reason = await page.evaluate(() => {
      const sm = new __fo.StateManager();
      const d = __fo.buildDeferred();
      sm.assign('ready', d);
      sm.get('ready').reject(['bad']);
      return d.then(
        () => null,
        (r) => r
      );
    });
    expect(reason).toEqual([['bad']]);
  });
});

test.describe('EventObserver', () => {
  test('trigger(name, ...args) calls handlers with an event object followed by args', async ({ page }) => {
    const calls = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      const calls = [];
      o.on('x', (evt, ...args) => calls.push({ type: evt.type, ts: typeof evt.timeStamp, args }));
      o.trigger('x', 1, 'two');
      return calls;
    });
    expect(calls).toEqual([{ type: 'x', ts: 'number', args: [1, 'two'] }]);
  });

  test('handlers run in registration order and only for the triggered name', async ({ page }) => {
    const calls = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      const calls = [];
      o.on('x', () => calls.push('x1'));
      o.on('y', () => calls.push('y1'));
      o.on('x', () => calls.push('x2'));
      o.trigger('x');
      return calls;
    });
    expect(calls).toEqual(['x1', 'x2']);
  });

  test('trigger on a name without handlers does nothing', async ({ page }) => {
    const ok = await page.evaluate(() => {
      new __fo.EventObserver().trigger('nobody');
      return true;
    });
    expect(ok).toBe(true);
  });

  test('getEventNumber counts handlers per name', async ({ page }) => {
    const counts = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      o.on('x', () => {});
      o.on('x', () => {});
      return [o.getEventNumber('x'), o.getEventNumber('none')];
    });
    expect(counts).toEqual([2, 0]);
  });

  test('trigger({name, target}) only calls handlers bound to that target', async ({ page }) => {
    const calls = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      const a = {};
      const b = {};
      const calls = [];
      o.on('x', (evt, v) => calls.push('a:' + v), { target: a });
      o.on('x', (evt, v) => calls.push('b:' + v), { target: b });
      o.on('x', (evt, v) => calls.push('none:' + v));
      o.trigger({ name: 'x', target: b }, 7);
      return calls;
    });
    expect(calls).toEqual(['b:7']);
  });

  test('trigger({name}) without target calls every handler', async ({ page }) => {
    const calls = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      const calls = [];
      o.on('x', () => calls.push('t'), { target: {} });
      o.on('x', () => calls.push('n'));
      o.trigger({ name: 'x' });
      return calls;
    });
    expect(calls).toEqual(['t', 'n']);
  });

  test('off(name, func) removes only that handler', async ({ page }) => {
    const result = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      const calls = [];
      const f1 = () => calls.push('f1');
      const f2 = () => calls.push('f2');
      o.on('x', f1);
      o.on('x', f2);
      o.off('x', f1);
      o.trigger('x');
      return { calls, count: o.getEventNumber('x') };
    });
    expect(result).toEqual({ calls: ['f2'], count: 1 });
  });

  test('off(name, func) with an unknown func removes nothing', async ({ page }) => {
    const count = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      o.on('x', () => {});
      o.off('x', () => {});
      return o.getEventNumber('x');
    });
    expect(count).toBe(1);
  });

  test('off(name) removes every handler of that name only', async ({ page }) => {
    const counts = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      o.on('x', () => {});
      o.on('x', () => {});
      o.on('y', () => {});
      o.off('x');
      return [o.getEventNumber('x'), o.getEventNumber('y')];
    });
    expect(counts).toEqual([0, 1]);
  });

  test('off() removes every handler of every name', async ({ page }) => {
    const result = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      o.on('x', () => {});
      o.on('y', () => {});
      o.off();
      return Object.keys(o.events);
    });
    expect(result).toEqual([]);
  });

  test('off(name, undefined, target) removes the handler bound to target', async ({ page }) => {
    const calls = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      const a = {};
      const b = {};
      const calls = [];
      o.on('x', () => calls.push('a'), { target: a });
      o.on('x', () => calls.push('b'), { target: b });
      o.off('x', undefined, a);
      o.trigger('x');
      return calls;
    });
    expect(calls).toEqual(['b']);
  });

  test('off(name, func, target) does not remove a handler bound to another target', async ({ page }) => {
    const count = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      const f = () => {};
      o.on('x', f, { target: {} });
      o.off('x', f, {});
      return o.getEventNumber('x');
    });
    expect(count).toBe(1);
  });

  test('once(name, func) handler fires only once', async ({ page }) => {
    const result = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      let n = 0;
      o.once('x', () => n++);
      o.trigger('x');
      o.trigger('x');
      return { n, count: o.getEventNumber('x') };
    });
    expect(result).toEqual({ n: 1, count: 0 });
  });

  test('once handlers are removed without affecting regular handlers', async ({ page }) => {
    const result = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      const calls = [];
      o.on('x', () => calls.push('on1'));
      o.once('x', () => calls.push('once'));
      o.on('x', () => calls.push('on2'));
      o.trigger('x');
      o.trigger('x');
      return { calls, count: o.getEventNumber('x') };
    });
    expect(result).toEqual({ calls: ['on1', 'once', 'on2', 'on1', 'on2'], count: 2 });
  });

  test('once handlers are removed when triggered with {name, target}', async ({ page }) => {
    const result = await page.evaluate(() => {
      const o = new __fo.EventObserver();
      const a = {};
      const calls = [];
      o.on('x', () => calls.push('a'), { target: a, once: true });
      o.on('x', () => calls.push('keep'), { target: a });
      o.trigger({ name: 'x', target: a });
      o.trigger({ name: 'x', target: a });
      return { calls, count: o.getEventNumber('x') };
    });
    expect(result).toEqual({ calls: ['a', 'keep', 'keep'], count: 1 });
  });
});

test.describe('util', () => {
  test('isString / isElement / isObject', async ({ page }) => {
    const r = await page.evaluate(() => {
      const u = __fo.util;
      return [
        u.isString('a'),
        u.isString(1),
        u.isElement(document.body),
        u.isElement({}),
        u.isElement(window),
        u.isObject({}),
        u.isObject('a'),
      ];
    });
    expect(r).toEqual([true, false, true, false, false, true, false]);
  });

  test('isArray({}) is false', async ({ page }) => {
    expect(await page.evaluate(() => __fo.util.isArray({}))).toBe(false);
  });

  test('isArray([]) is true', async ({ page }) => {
    expect(await page.evaluate(() => __fo.util.isArray([]))).toBe(true);
  });

  test('isArray rejects array-likes', async ({ page }) => {
    const r = await page.evaluate(() => [
      __fo.util.isArray('ab'),
      __fo.util.isArray({ length: 0 }),
      (function () {
        return __fo.util.isArray(arguments);
      })(),
    ]);
    expect(r).toEqual([false, false, false]);
  });

  test('copyArray converts array-likes into a new array', async ({ page }) => {
    const r = await page.evaluate(() => {
      const src = [1, 2];
      const copy = __fo.util.copyArray(src);
      const fromArgs = (function () {
        return __fo.util.copyArray(arguments);
      })('a', 'b');
      return { copy, notSame: copy !== src, fromArgs, isArray: Array.isArray(fromArgs) };
    });
    expect(r).toEqual({ copy: [1, 2], notSame: true, fromArgs: ['a', 'b'], isArray: true });
  });

  test('clone(target, ...sources) shallow-merges into target, later sources win', async ({ page }) => {
    const r = await page.evaluate(() => {
      const target = { a: 1 };
      const result = __fo.util.clone(target, { b: 2, c: 0 }, { c: 3 });
      return { result, sameRef: result === target };
    });
    expect(r).toEqual({ result: { a: 1, b: 2, c: 3 }, sameRef: true });
  });

  test('clone(true, target, source) deep-copies nested objects', async ({ page }) => {
    const r = await page.evaluate(() => {
      const source = { nested: { v: 1 } };
      const result = __fo.util.clone(true, {}, source);
      return { result, detached: result.nested !== source.nested };
    });
    expect(r).toEqual({ result: { nested: { v: 1 } }, detached: true });
  });

  test('clone(true, ...) deep-copies arrays and keeps null / primitives', async ({ page }) => {
    const r = await page.evaluate(() => {
      const source = { list: [1, { v: 2 }], empty: null, n: 0, s: 'x' };
      const result = __fo.util.clone(true, {}, source);
      return {
        result,
        isArray: Array.isArray(result.list),
        listDetached: result.list !== source.list,
        itemDetached: result.list[1] !== source.list[1],
      };
    });
    expect(r).toEqual({
      result: { list: [1, { v: 2 }], empty: null, n: 0, s: 'x' },
      isArray: true,
      listDetached: true,
      itemDetached: true,
    });
  });

  test('clone(true, ...) merges into existing nested objects of target', async ({ page }) => {
    const r = await page.evaluate(() => __fo.util.clone(true, { nested: { a: 1 } }, { nested: { b: 2 } }));
    expect(r).toEqual({ nested: { a: 1, b: 2 } });
  });

  test('clone without deep keeps nested references', async ({ page }) => {
    const shared = await page.evaluate(() => {
      const source = { nested: { v: 1 }, list: [1] };
      const result = __fo.util.clone({}, source);
      return result.nested === source.nested && result.list === source.list;
    });
    expect(shared).toBe(true);
  });

  test('data(el, key, val) stores per-element values', async ({ page }) => {
    const r = await page.evaluate(() => {
      const u = __fo.util;
      const a = document.createElement('div');
      const b = document.createElement('div');
      u.data(a, 'k', 1);
      u.data(b, 'k', 2);
      return [u.data(a, 'k'), u.data(b, 'k'), u.data(a, 'missing')];
    });
    expect(r).toEqual([1, 2, undefined]);
  });

  test('getContentWindowByEl returns iframe.contentWindow for elements and the input otherwise', async ({ page }) => {
    await page.evaluate(() => createFrame('f1'));
    const r = await page.evaluate(() => {
      const u = __fo.util;
      const iframe = $frames.f1;
      return [u.getContentWindowByEl(iframe) === iframe.contentWindow, u.getContentWindowByEl(window) === window];
    });
    expect(r).toEqual([true, true]);
  });

  test('postMessage sends JSON-serialised data with the given origin', async ({ page }) => {
    const r = await page.evaluate(() => {
      let sent;
      __fo.util.postMessage({ postMessage: (data, origin) => (sent = { data, origin }) }, { a: 1 }, 'http://x.test');
      return sent;
    });
    expect(r).toEqual({ data: '{"a":1}', origin: 'http://x.test' });
  });
});

test.describe('urlUtils', () => {
  test('getOrigin extracts scheme://host[:port]/ from http(s) URLs', async ({ page }) => {
    const r = await page.evaluate(() => {
      const g = __fo.urlUtils.getOrigin;
      return [
        g('http://a.test/path/page.html'),
        g('https://a.test:8443/x?y=1'),
        g('https://a.test'),
        g('about:blank'),
        g(''),
      ];
    });
    expect(r).toEqual(['http://a.test/', 'https://a.test:8443/', 'https://a.test', null, null]);
  });

  test('getOriginByFrameEl(iframe) uses the iframe src origin', async ({ page }) => {
    await page.evaluate(() => createFrame('f1'));
    const r = await page.evaluate(() => [__fo.urlUtils.getOriginByFrameEl($frames.f1), CHILD_ORIGIN + '/']);
    expect(r[0]).toBe(r[1]);
  });

  test('getOriginByFrameEl(window) falls back to the current origin when there is no referrer', async ({ page }) => {
    const r = await page.evaluate(() => [document.referrer, __fo.urlUtils.getOriginByFrameEl(window), location.origin + '/']);
    expect(r[0]).toBe('');
    expect(r[1]).toBe(r[2]);
  });
});

test.describe('buildMessageEvent', () => {
  test('builds a frame-observer message with generated id', async ({ page }) => {
    const msg = await page.evaluate(() => __fo.buildMessageEvent('method', 'send', { params: [1] }));
    expect(msg).toMatchObject({ type: 'method', direction: 'send', data: { params: [1] }, _FRAME_OBSERVER_: true });
    expect(msg.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(typeof msg.timestamp).toBe('number');
  });

  test('keeps the given id, defaults data to {}, merges extra attributes', async ({ page }) => {
    const msg = await page.evaluate(() => __fo.buildMessageEvent('state', 'recv', null, 'fixed-id', { deferredState: 'done' }));
    expect(msg).toMatchObject({ id: 'fixed-id', data: {}, deferredState: 'done', _FRAME_OBSERVER_: true });
  });

  test('generated ids are unique', async ({ page }) => {
    const unique = await page.evaluate(() => {
      const ids = new Set();
      for (let i = 0; i < 1000; i++) ids.add(__fo.buildMessageEvent('method', 'send').id);
      return ids.size;
    });
    expect(unique).toBe(1000);
  });
});
