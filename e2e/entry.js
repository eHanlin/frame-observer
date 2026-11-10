// Test entry: bundles src/ and exposes internals for Playwright tests.
// src/js/index.js mixes `export default` with `module.exports`, which cannot run as
// a browser bundle, so the window assignment is reproduced here instead.
import frameObserver from '../src/js/frameObserver';
import EventObserver from '../src/js/EventObserver';
import StateManager from '../src/js/StateManager';
import FrameObserverContext from '../src/js/FrameObserverContext';
import buildDeferred from '../src/js/buildDeferred';
import util from '../src/js/utils/util';
import urlUtils from '../src/js/utils/urlUtils';
import guid from '../src/js/utils/guid';
import { buildMessageEvent } from '../src/js/builder';
import * as Config from '../src/js/constants/Config';
import * as Event from '../src/js/constants/Event';
import * as MessageType from '../src/js/constants/MessageType';

window.frameObserver = frameObserver;
window.__fo = {
  frameObserver,
  EventObserver,
  StateManager,
  FrameObserverContext,
  buildDeferred,
  util,
  urlUtils,
  guid,
  buildMessageEvent,
  Config,
  Event,
  MessageType,
};
