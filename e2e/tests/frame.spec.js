// Cross-origin integration tests: parent page on http://localhost:PORT, child frames on
// http://127.0.0.1:PORT, communicating through the real postMessage channel.
const { test, expect } = require('@playwright/test');

/** Evaluates fn inside the child frame named `name`. */
const inChild = (page, name, fn, arg) => page.frame({ name }).evaluate(fn, arg);

test.beforeEach(async ({ page }) => {
  await page.goto('/parent.html');
});

test('parent and child run on different origins', async ({ page }) => {
  await page.evaluate(() => createFrame('c'));
  const parentOrigin = await page.evaluate(() => location.origin);
  const childOrigin = await inChild(page, 'c', () => location.origin);
  expect(parentOrigin).not.toBe(childOrigin);
});

test.describe('readyState', () => {
  test('resolves with the params passed to resolveState', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const resp = await page.evaluate(() => frameObserver.readyState($frames.c, 'ready'));
    expect(resp).toEqual([{ result: { 0: ['child-ready', 'c'] } }]);
  });

  test('waits until the child resolves the state', async ({ page }) => {
    await page.evaluate(() => createFrame('c', 'autoReady=0'));
    await page.evaluate(() => {
      window.readyResult = settleWithin(frameObserver.readyState($frames.c, 'ready'), 3000);
    });
    const pending = await page.evaluate(() => settleWithin(frameObserver.readyState($frames.c, 'ready'), 300));
    expect(pending).toEqual({ status: 'timeout' });

    await inChild(page, 'c', () => frameObserver.resolveState('ready', 42));
    const result = await page.evaluate(() => window.readyResult);
    expect(result).toEqual({ status: 'resolved', value: [{ result: { 0: [42] } }] });
  });

  test('rejects with the params passed to rejectState', async ({ page }) => {
    await page.evaluate(() => createFrame('c', 'autoReady=0'));
    await inChild(page, 'c', () => frameObserver.rejectState('ready', 'boom'));
    const result = await page.evaluate(() => settleWithin(frameObserver.readyState($frames.c, 'ready'), 3000));
    expect(result).toEqual({ status: 'rejected', reason: [{ result: { 0: ['boom'] } }] });
  });

  test('states are independent by name', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const result = await page.evaluate(() => settleWithin(frameObserver.readyState($frames.c, 'other'), 300));
    expect(result).toEqual({ status: 'timeout' });
  });

  test('every pending readyState call resolves once the state is resolved', async ({ page }) => {
    await page.evaluate(() => createFrame('c', 'autoReady=0'));
    await page.evaluate(() => {
      window.waiters = [1, 2, 3].map(() => settleWithin(frameObserver.readyState($frames.c, 'ready'), 3000));
    });
    await inChild(page, 'c', () => frameObserver.resolveState('ready', 'go'));
    const results = await page.evaluate(() => Promise.all(waiters));
    expect(results).toEqual(Array(3).fill({ status: 'resolved', value: [{ result: { 0: ['go'] } }] }));
  });
});

test.describe('callMethod', () => {
  test('returns the value resolved by the child method', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const resp = await page.evaluate(() => frameObserver.callMethod($frames.c, 'add', 5, 6));
    expect(resp[0].result[0]).toBe(11);
  });

  test('passes multiple resolved values through', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const resp = await page.evaluate(() => frameObserver.callMethod($frames.c, 'echo', 'a', { b: [1, 2] }, null));
    expect(resp).toEqual([{ result: { 0: 'a', 1: { b: [1, 2] }, 2: null } }]);
  });

  test('waits for asynchronous resolution', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const resp = await page.evaluate(() => frameObserver.callMethod($frames.c, 'asyncAdd', 1, 2));
    expect(resp[0].result[0]).toBe(3);
  });

  test('rejects with the reason rejected by the child method', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const result = await page.evaluate(() => settleWithin(frameObserver.callMethod($frames.c, 'fail', 'nope'), 3000));
    expect(result).toEqual({ status: 'rejected', reason: [{ result: { 0: 'nope' } }] });
  });

  test('rejects when the method is not registered in the child', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const result = await page.evaluate(() => settleWithin(frameObserver.callMethod($frames.c, 'missing'), 3000));
    expect(result).toEqual({ status: 'rejected', reason: [{ result: { 0: { err: 'the method is not exist.' } } }] });
  });

  test('concurrent calls are matched to their own responses', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const sums = await page.evaluate(() =>
      Promise.all([1, 2, 3, 4, 5].map((n) => frameObserver.callMethod($frames.c, n % 2 ? 'asyncAdd' : 'add', n, 100))).then((rs) =>
        rs.map((r) => r[0].result[0])
      )
    );
    expect(sums).toEqual([101, 102, 103, 104, 105]);
  });

  test('pending-call bookkeeping is cleared after the response', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const sizes = await page.evaluate(async () => {
      const before = Object.keys(frameObserver.evtMapping).length;
      const p = frameObserver.callMethod($frames.c, 'add', 1, 1);
      const during = Object.keys(frameObserver.evtMapping).length;
      await p;
      return { before, during, after: Object.keys(frameObserver.evtMapping).length };
    });
    expect(sizes).toEqual({ before: 0, during: 1, after: 0 });
  });

  test('child can call a method registered by the parent', async ({ page }) => {
    await page.evaluate(() => {
      frameObserver.registerMethods({ mul: (d, a, b) => d.resolve(a * b) });
      return createFrame('c');
    });
    const resp = await inChild(page, 'c', () => frameObserver.callMethod(window.parent, 'mul', 6, 7));
    expect(resp[0].result[0]).toBe(42);
  });

  test('child can wait on a state resolved by the parent', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    await inChild(page, 'c', () => {
      window.parentReady = frameObserver.readyState(window.parent, 'parentReady');
    });
    await page.evaluate(() => frameObserver.resolveState('parentReady', 'p'));
    const resp = await inChild(page, 'c', () => window.parentReady);
    expect(resp).toEqual([{ result: { 0: ['p'] } }]);
  });
});

test.describe('createOrigin', () => {
  test('is used to compute the target origin and receives the element', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const result = await page.evaluate(async () => {
      const seen = [];
      frameObserver.createOrigin = (el) => {
        seen.push(el === $frames.c);
        return CHILD_ORIGIN;
      };
      try {
        const resp = await frameObserver.callMethod($frames.c, 'add', 2, 2);
        return { value: resp[0].result[0], seen };
      } finally {
        frameObserver.createOrigin = null;
      }
    });
    expect(result).toEqual({ value: 4, seen: [true] });
  });

  test('a non-matching origin prevents delivery', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const result = await page.evaluate(async () => {
      frameObserver.createOrigin = () => 'http://not-the-child.test';
      try {
        return await settleWithin(frameObserver.callMethod($frames.c, 'add', 2, 2), 500);
      } finally {
        frameObserver.createOrigin = null;
      }
    });
    expect(result).toEqual({ status: 'timeout' });
  });
});

test.describe('events (on / off / trigger)', () => {
  const childHandlerCount = (page, name, eventName) =>
    inChild(page, name, (e) => frameObserver.registerEventObserver.getEventNumber(e), eventName);

  test('handler receives events triggered by the child with their params', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    await page.evaluate(() => {
      window.received = [];
      return frameObserver.on($frames.c, 'ping', (evt, ...args) => received.push({ type: evt.type, ts: typeof evt.timeStamp, args }));
    });
    await inChild(page, 'c', () => frameObserver.trigger('ping', 1, { a: 'b' }));
    await expect.poll(() => page.evaluate(() => received)).toEqual([{ type: 'ping', ts: 'number', args: [1, { a: 'b' }] }]);
  });

  test('registers once per event name in the child no matter how many handlers', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    await page.evaluate(async () => {
      window.calls = [];
      await frameObserver.on($frames.c, 'ping', () => calls.push('h1'));
      await frameObserver.on($frames.c, 'ping', () => calls.push('h2'));
    });
    expect(await childHandlerCount(page, 'c', 'ping')).toBe(1);

    await inChild(page, 'c', () => frameObserver.trigger('ping'));
    await expect.poll(() => page.evaluate(() => calls)).toEqual(['h1', 'h2']);
  });

  test('off(el, name, func) unregisters in the child only after the last handler is removed', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    await page.evaluate(async () => {
      window.calls = [];
      window.h1 = () => calls.push('h1');
      window.h2 = () => calls.push('h2');
      await frameObserver.on($frames.c, 'ping', h1);
      await frameObserver.on($frames.c, 'ping', h2);
      await frameObserver.off($frames.c, 'ping', h1);
    });
    expect(await childHandlerCount(page, 'c', 'ping')).toBe(1);

    await inChild(page, 'c', () => frameObserver.trigger('ping'));
    await expect.poll(() => page.evaluate(() => calls)).toEqual(['h2']);

    await page.evaluate(() => frameObserver.off($frames.c, 'ping', h2));
    expect(await childHandlerCount(page, 'c', 'ping')).toBe(0);
  });

  test('off(el, name) removes every handler and unregisters in the child', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    await page.evaluate(async () => {
      await frameObserver.on($frames.c, 'ping', () => {});
      await frameObserver.on($frames.c, 'ping', () => {});
      await frameObserver.off($frames.c, 'ping');
    });
    expect(await childHandlerCount(page, 'c', 'ping')).toBe(0);
  });

  test('off for an event that was never listened to resolves', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const results = await page.evaluate(() =>
      Promise.all([
        settleWithin(frameObserver.off($frames.c, 'never'), 3000),
        settleWithin(frameObserver.off($frames.c, 'never2', () => {}), 3000),
      ]).then((rs) => rs.map((r) => r.status))
    );
    expect(results).toEqual(['resolved', 'resolved']);
    expect(await childHandlerCount(page, 'c', 'never')).toBe(0);
  });

  test('events can be listened to again after off', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    await page.evaluate(async () => {
      window.calls = [];
      await frameObserver.on($frames.c, 'ping', () => calls.push('old'));
      await frameObserver.off($frames.c, 'ping');
      await frameObserver.on($frames.c, 'ping', () => calls.push('new'));
    });
    expect(await childHandlerCount(page, 'c', 'ping')).toBe(1);
    await inChild(page, 'c', () => frameObserver.trigger('ping'));
    await expect.poll(() => page.evaluate(() => calls)).toEqual(['new']);
  });

  test('events from one iframe do not reach handlers of another iframe', async ({ page }) => {
    await page.evaluate(() => Promise.all([createFrame('a'), createFrame('b')]));
    await page.evaluate(async () => {
      window.calls = [];
      await frameObserver.on($frames.a, 'ping', (evt, v) => calls.push('a:' + v));
      await frameObserver.on($frames.b, 'ping', (evt, v) => calls.push('b:' + v));
    });
    await inChild(page, 'b', () => frameObserver.trigger('ping', 1));
    await expect.poll(() => page.evaluate(() => calls)).toEqual(['b:1']);
    await inChild(page, 'a', () => frameObserver.trigger('ping', 2));
    await expect.poll(() => page.evaluate(() => calls)).toEqual(['b:1', 'a:2']);
  });

  test('child can listen to events triggered by the parent', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    await inChild(page, 'c', () => {
      window.received = [];
      return frameObserver.on(window.parent, 'fromParent', (evt, v) => received.push(v));
    });
    await page.evaluate(() => frameObserver.trigger('fromParent', 'hi'));
    await expect.poll(() => inChild(page, 'c', () => received)).toEqual(['hi']);
  });
});

test.describe('getContext', () => {
  test('getElement returns the iframe for elements and null for windows', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const r = await page.evaluate(() => [
      frameObserver.getContext($frames.c).getElement() === $frames.c,
      frameObserver.getContext(window).getElement(),
    ]);
    expect(r).toEqual([true, null]);
  });

  test('readyState / callMethod / on / off delegate to the scoped element', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const result = await page.evaluate(async () => {
      const ctx = frameObserver.getContext($frames.c);
      const ready = await ctx.readyState('ready');
      const sum = await ctx.callMethod('add', 3, 4);
      window.calls = [];
      await ctx.on('ping', (evt, v) => calls.push(v));
      return { ready, sum: sum[0].result[0] };
    });
    expect(result).toEqual({ ready: [{ result: { 0: ['child-ready', 'c'] } }], sum: 7 });

    await inChild(page, 'c', () => frameObserver.trigger('ping', 'ctx'));
    await expect.poll(() => page.evaluate(() => calls)).toEqual(['ctx']);

    await page.evaluate(() => frameObserver.getContext($frames.c).off('ping'));
    expect(await inChild(page, 'c', () => frameObserver.registerEventObserver.getEventNumber('ping'))).toBe(0);
  });

  test('child can use getContext(window.parent) for methods, states and events', async ({ page }) => {
    await page.evaluate(() => {
      frameObserver.registerMethods({ mul: (d, a, b) => d.resolve(a * b) });
      return createFrame('c');
    });
    const result = await inChild(page, 'c', async () => {
      const ctx = frameObserver.getContext(window.parent);
      window.received = [];
      await ctx.on('fromParent', (evt, v) => received.push(v));
      window.parentReady = ctx.readyState('parentReady');
      const product = await ctx.callMethod('mul', 6, 7);
      return { product: product[0].result[0], element: ctx.getElement() };
    });
    expect(result).toEqual({ product: 42, element: null });

    await page.evaluate(() => {
      frameObserver.resolveState('parentReady', 'p');
      frameObserver.trigger('fromParent', 'hi');
    });
    expect(await inChild(page, 'c', () => window.parentReady)).toEqual([{ result: { 0: ['p'] } }]);
    await expect.poll(() => inChild(page, 'c', () => received)).toEqual(['hi']);
  });
});

test.describe('message filtering', () => {
  test('ignores messages not produced by frame-observer', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.evaluate(() => createFrame('c'));
    await inChild(page, 'c', () => {
      ['plain text', '{"foo":1}', 'null', '123', 1, { _FRAME_OBSERVER_: true }].forEach((m) => window.parent.postMessage(m, '*'));
    });
    const resp = await page.evaluate(() => frameObserver.callMethod($frames.c, 'add', 1, 2));
    expect(resp[0].result[0]).toBe(3);
    expect(errors).toEqual([]);
  });

  test('ignores frame-observer messages with an unknown type', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.evaluate(() => createFrame('c'));
    await inChild(page, 'c', () => {
      ['bogus', 'toString', '__proto__', undefined].forEach((type) =>
        ['send', 'recv'].forEach((direction) =>
          window.parent.postMessage(JSON.stringify({ _FRAME_OBSERVER_: true, type, direction, data: {} }), '*')
        )
      );
    });
    const resp = await page.evaluate(() => frameObserver.callMethod($frames.c, 'add', 1, 2));
    expect(resp[0].result[0]).toBe(3);
    expect(errors).toEqual([]);
  });
});

test.describe('same-origin iframe', () => {
  test('readyState, callMethod and events work without crossing origins', async ({ page }) => {
    await page.evaluate(() => createFrame('s', '', location.origin));
    const sameOrigin = await page.evaluate(() => $frames.s.contentWindow.location.origin === location.origin);
    expect(sameOrigin).toBe(true);

    const result = await page.evaluate(async () => {
      const ready = await frameObserver.readyState($frames.s, 'ready');
      const sum = await frameObserver.callMethod($frames.s, 'add', 2, 3);
      window.calls = [];
      await frameObserver.on($frames.s, 'ping', (evt, v) => calls.push(v));
      return { ready, sum: sum[0].result[0] };
    });
    expect(result).toEqual({ ready: [{ result: { 0: ['child-ready', 's'] } }], sum: 5 });

    await inChild(page, 's', () => frameObserver.trigger('ping', 'same'));
    await expect.poll(() => page.evaluate(() => calls)).toEqual(['same']);
  });
});

test.describe('nested iframes', () => {
  // top (localhost) -> c (127.0.0.1) -> gc (localhost): every hop is cross-origin.
  const setup = async (page) => {
    await page.evaluate(() => createFrame('c'));
    const topOrigin = await page.evaluate(() => location.origin);
    await inChild(page, 'c', (origin) => createFrame('gc', '', origin), topOrigin);
  };

  test('a frame can call both its child and its parent', async ({ page }) => {
    await setup(page);
    await inChild(page, 'c', () => frameObserver.registerMethods({ fromGc: (d, v) => d.resolve('c:' + v) }));

    const topToChild = await page.evaluate(() => frameObserver.callMethod($frames.c, 'add', 1, 2));
    const childToGrandchild = await inChild(page, 'c', () => frameObserver.callMethod($frames.gc, 'add', 3, 4));
    const grandchildToChild = await inChild(page, 'gc', () => frameObserver.callMethod(window.parent, 'fromGc', 'x'));

    expect([topToChild[0].result[0], childToGrandchild[0].result[0], grandchildToChild[0].result[0]]).toEqual([3, 7, 'c:x']);
  });

  test('events stay within each parent/child pair', async ({ page }) => {
    await setup(page);
    await page.evaluate(() => {
      window.calls = [];
      return frameObserver.on($frames.c, 'ping', (evt, v) => calls.push(v));
    });
    await inChild(page, 'c', () => {
      window.calls = [];
      return frameObserver.on($frames.gc, 'ping', (evt, v) => calls.push(v));
    });

    await inChild(page, 'gc', () => frameObserver.trigger('ping', 'from-gc'));
    await expect.poll(() => inChild(page, 'c', () => calls)).toEqual(['from-gc']);

    await inChild(page, 'c', () => frameObserver.trigger('ping', 'from-c'));
    await expect.poll(() => page.evaluate(() => calls)).toEqual(['from-c']);
    expect(await inChild(page, 'c', () => calls)).toEqual(['from-gc']);
  });
});

test.describe('serialization', () => {
  test('params and results are passed through JSON', async ({ page }) => {
    await page.evaluate(() => createFrame('c'));
    const resp = await page.evaluate(() =>
      frameObserver.callMethod($frames.c, 'echo', undefined, function () {}, new Date(0), NaN, { u: undefined, n: null, list: [undefined, 1] })
    );
    // JSON.stringify: undefined / functions / NaN in arrays -> null, Date -> ISO string, undefined properties dropped.
    expect(resp).toEqual([{ result: { 0: null, 1: null, 2: '1970-01-01T00:00:00.000Z', 3: null, 4: { n: null, list: [null, 1] } } }]);
  });
});
