var um = Object.defineProperty;
var dm = (t, e, n) => e in t ? um(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var C = (t, e, n) => (dm(t, typeof e != "symbol" ? e + "" : e, n), n), Ds = (t, e, n) => {
  if (!e.has(t))
    throw TypeError("Cannot " + n);
};
var Pn = (t, e, n) => (Ds(t, e, "read from private field"), n ? n.call(t) : e.get(t)), Nn = (t, e, n) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, n);
}, Dn = (t, e, n, r) => (Ds(t, e, "write to private field"), r ? r.call(t, n) : e.set(t, n), n);
const Ce = window.React, {
  Children: ji,
  Component: hm,
  Fragment: qt,
  Profiler: pm,
  PureComponent: mm,
  StrictMode: fm,
  Suspense: gm,
  act: bm,
  cloneElement: Ht,
  createContext: yo,
  createElement: Et,
  createFactory: vm,
  createRef: wm,
  forwardRef: ie,
  isValidElement: Rt,
  lazy: ym,
  memo: ke,
  startTransition: xm,
  useCallback: Ue,
  useContext: nr,
  useDebugValue: km,
  useDeferredValue: pc,
  useEffect: it,
  useId: xo,
  useImperativeHandle: _m,
  useInsertionEffect: mc,
  useLayoutEffect: Wr,
  useMemo: Tt,
  useReducer: Sm,
  useRef: Fe,
  useState: we,
  useSyncExternalStore: Cm,
  useTransition: Tm,
  version: Im
} = Ce, Am = Ce.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Em = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: ji,
  Component: hm,
  Fragment: qt,
  Profiler: pm,
  PureComponent: mm,
  StrictMode: fm,
  Suspense: gm,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Am,
  act: bm,
  cloneElement: Ht,
  createContext: yo,
  createElement: Et,
  createFactory: vm,
  createRef: wm,
  default: Ce,
  forwardRef: ie,
  isValidElement: Rt,
  lazy: ym,
  memo: ke,
  startTransition: xm,
  useCallback: Ue,
  useContext: nr,
  useDebugValue: km,
  useDeferredValue: pc,
  useEffect: it,
  useId: xo,
  useImperativeHandle: _m,
  useInsertionEffect: mc,
  useLayoutEffect: Wr,
  useMemo: Tt,
  useReducer: Sm,
  useRef: Fe,
  useState: we,
  useSyncExternalStore: Cm,
  useTransition: Tm,
  version: Im
}, Symbol.toStringTag, { value: "Module" })), Ke = qt;
function fc(t, e, n) {
  return n !== void 0 ? Et(t, { ...e, key: n }) : Et(t, e);
}
const f = fc, j = fc;
let gn = null;
function Rm(t, e) {
  t.currentIndex = 0, t.wipContextDeps = null, t.wipCommitCallbacks = [];
  const n = gn;
  gn = t;
  try {
    if (e(), t.isFirstRender = !1, t.cells.length !== t.currentIndex)
      throw new Error(`Rendered ${t.currentIndex} hooks but expected ${t.cells.length}. Hooks must be called in the exact same order in every render.`);
  } finally {
    gn = n;
  }
}
function Mt() {
  if (!gn)
    throw new Error("No resource fiber available");
  return gn;
}
function Qt() {
  return gn;
}
const ko = Symbol("tap.Context.defaultValue"), Mm = (t) => t;
let dt = /* @__PURE__ */ new Map();
const Ut = /* @__PURE__ */ new Set(), gc = () => new Map(dt), di = (t, e) => {
  const n = dt;
  dt = t;
  try {
    return e();
  } finally {
    dt = n;
  }
}, bc = (t, e) => {
  t[ko] = e;
}, vc = (t) => typeof t == "object" && t !== null && ko in t, wc = (t) => typeof t == "object" && t !== null && "$$typeof" in t && t.$$typeof === Symbol.for("react.context"), _o = (t) => vc(t) || wc(t), yc = (t) => {
  if (!vc(t)) {
    if (wc(t)) {
      bc(t, t._currentValue ?? t._currentValue2);
      return;
    }
    throw new Error("A tap resource's `use()` only accepts a tap context.");
  }
}, xc = (t, e, n) => {
  if (typeof t != "object" || t === null)
    throw new Error("useContextProvider only accepts a React context.");
  yc(t);
  const r = t, i = Mt(), o = ne(void 0), s = o.current === void 0 || !Object.is(o.current.value, e);
  Y(() => {
    o.current = { value: e };
  }, [e]);
  const a = dt.get(r), l = a !== void 0 || dt.has(r);
  dt.set(r, {
    value: e,
    source: i
  });
  try {
    return Pm(r, s, n);
  } finally {
    l ? dt.set(r, a) : dt.delete(r);
  }
}, Pm = (t, e, n) => {
  const r = Ut.has(t);
  e ? Ut.add(t) : Ut.delete(t);
  try {
    return n();
  } finally {
    r ? Ut.add(t) : Ut.delete(t);
  }
}, Nm = (t) => {
  yc(t);
  const e = t, n = Dm(e, t), r = Mt();
  return (r.wipContextDeps ?? (r.wipContextDeps = /* @__PURE__ */ new Map())).set(e, n.source), n.value;
}, Dm = (t, e) => dt.get(t) ?? {
  value: Mm(e)[ko],
  source: null
}, Lm = (t, e, n, r) => {
  if (!r)
    return n;
  let i = n;
  for (const [o, s] of r)
    s === e || s === t || (i ?? (i = /* @__PURE__ */ new Map())).set(o, s);
  return i;
}, kc = (t, e = t.wipContextDeps) => {
  const n = Qt();
  !n || !e || (n.wipContextDeps = Lm(n, t, n.wipContextDeps, e));
}, _c = () => Ut.size > 0, So = (t) => {
  if (!t.contextDeps || !_c())
    return !1;
  for (const e of Ut.keys())
    if (t.contextDeps.has(e))
      return !0;
  return !1;
}, zm = [
  0,
  1,
  2,
  3
];
function Ls(t) {
  const e = [];
  for (const n of zm) {
    const r = t[n];
    if (r !== void 0)
      for (let i = 0; i < r.length; i++)
        try {
          r[i]();
        } catch (o) {
          e.push(o);
        }
  }
  if (e.length > 0) {
    if (e.length === 1)
      throw e[0];
    for (const n of e)
      console.error(n);
    throw new AggregateError(e, "Errors during commit");
  }
}
function Sc(t) {
  var n;
  const e = [];
  for (const r of t.cells)
    if ((r == null ? void 0 : r.type) === "effect" && (r.deps = null, r.cleanup))
      try {
        (n = r.cleanup) == null || n.call(r);
      } catch (i) {
        e.push(i);
      } finally {
        r.cleanup = void 0;
      }
  if (e.length > 0) {
    if (e.length === 1)
      throw e[0];
    for (const r of e)
      console.error(r);
    throw new AggregateError(e, "Errors during cleanup");
  }
}
const We = typeof process < "u" && ({}.NODE_ENV === "development" || {}.NODE_ENV === "test"), Cc = (t) => ({
  version: 0,
  committedVersion: 0,
  context: gc(),
  dispatchUpdate: t,
  changelog: [],
  rollbackCallbacks: []
}), Er = (t) => {
  t.committedVersion = t.version, t.changelog.length = 0, t.rollbackCallbacks.length = 0;
}, $n = (t, e) => {
  const n = t.version > e;
  if (t.version = e, n) {
    for (let r = 0; r < t.rollbackCallbacks.length; r++)
      t.rollbackCallbacks[r]();
    if (t.rollbackCallbacks.length = 0, e === t.committedVersion)
      t.changelog.length = 0;
    else {
      if (t.committedVersion > e)
        throw new Error("Version is less than committed version");
      for (; t.committedVersion + t.changelog.length > e; )
        t.changelog.pop();
      for (let r = 0; r < t.changelog.length; r++)
        Tc(t.changelog[r]);
      Er(t);
    }
  }
}, Tc = (t) => {
  var e;
  Ac(t.fiber, t.cell), t.queued || (t.queued = !0, ((e = t.cell).queue ?? (e.queue = [])).push(t));
}, qn = (t, e, n) => {
  const r = t.wipCommitCallbacks;
  (r[e] ?? (r[e] = [])).push(n);
}, Ic = (t, e) => {
  t.rollbackCallbacks.push(e);
}, Ac = (t, e) => {
  var n;
  e.isDirty || (e.isDirty = !0, (n = t.markDirty) == null || n.call(t), Ic(t.root, () => {
    if (e.queue !== null) {
      for (const r of e.queue)
        r.queued = !1;
      e.queue = null;
    }
    e.workInProgress = e.current, e.isDirty = !1;
  }));
}, Co = () => {
  throw new Error("Rendered more hooks than during the previous render. Hooks must be called in the exact same order in every render.");
}, To = () => {
  throw new Error("Hook order changed between renders");
}, Om = (t, e, n) => {
  if (t.isNeverMounted)
    throw new Error("Resource updated before mount");
  let r = !1, i = !0;
  t.root.dispatchUpdate(() => (r || (r = !0, n && t.root.changelog.length === 0 && !e.cell.isDirty && !e.hasEagerState && (e.eagerState = n(e.cell.workInProgress, e.action), e.hasEagerState = !0, i = !Object.is(e.cell.current, e.eagerState))), i), () => (r = !0, i = !0, Tc(e), t.root.changelog.push(e), !0));
}, $m = (t, e, n, r, i) => {
  const o = r ? r(n) : n;
  We && t.devStrictMode && r && r(n);
  const s = {
    type: "reducer",
    workInProgress: o,
    current: o,
    isDirty: !1,
    queue: null,
    renderQueue: null,
    reducer: e,
    dispatch: (a) => {
      const l = Qt();
      if (l !== null) {
        if (l !== t)
          throw new Error("Cannot update a resource while rendering a different resource.");
        (t.renderPendingCells ?? (t.renderPendingCells = /* @__PURE__ */ new Set())).add(s), (s.renderQueue ?? (s.renderQueue = [])).push(a);
      } else
        Om(t, {
          fiber: t,
          cell: s,
          action: a,
          hasEagerState: !1,
          eagerState: void 0,
          queued: !1
        }, i ? e : void 0);
    }
  };
  return s;
};
function Ec(t, e, n, r) {
  var c;
  const i = Mt(), o = i.currentIndex++, s = i.cells[o], a = (() => {
    if (s !== void 0)
      return s.type === "reducer" ? s : To();
    !i.isFirstRender && o >= i.cells.length && Co();
    const d = $m(i, t, e, n, r);
    return i.cells[o] = d, d;
  })(), l = a.queue;
  if (l !== null) {
    const d = t === a.reducer;
    for (let u = 0; u < l.length; u++) {
      const h = l[u];
      !h.hasEagerState || !d ? (h.eagerState = t(a.workInProgress, h.action), h.hasEagerState = !0, We && i.devStrictMode && (h.eagerState = t(a.workInProgress, h.action))) : We && i.devStrictMode && t(a.workInProgress, h.action), h.queued = !1, a.workInProgress = h.eagerState;
    }
    a.queue = null;
  }
  if (a.reducer = t, a.renderQueue !== null) {
    let d = a.workInProgress;
    for (const u of a.renderQueue)
      d = t(d, u);
    a.renderQueue = null, (c = i.renderPendingCells) == null || c.delete(a), Object.is(d, a.workInProgress) || (Ac(i, a), a.workInProgress = d);
  }
  return a.isDirty && qn(i, 0, () => {
    a.current = a.workInProgress, a.isDirty = !1;
  }), [a.workInProgress, a.dispatch];
}
function Rc(t, e, n) {
  return Ec(t, e, n, !1);
}
const Fm = (t, e) => typeof e == "function" ? e(t) : e, Bm = (t) => t === void 0 ? void 0 : typeof t == "function" ? t() : t;
function Io(t) {
  return Ec(Fm, t, Bm, !0);
}
const Gr = (t, e) => {
  We && t.length !== e.length && console.error(`The final argument passed to a hook changed size between renders. The order and size of this array must remain constant.

Previous: [${t.join(", ")}]
Incoming: [${e.join(", ")}]`);
  for (let n = 0; n < t.length && n < e.length; n++)
    if (!Object.is(t[n], e[n]))
      return !1;
  return !0;
}, zs = (t, e) => {
  qn(t, 0, () => {
    e.current = e.wip, e.currentDeps = e.wipDeps, e.isDirty = !1;
  });
}, Kr = (t, e) => {
  const n = Mt(), r = n.currentIndex++;
  let i = n.cells[r];
  if (i === void 0) {
    !n.isFirstRender && r >= n.cells.length && Co();
    const a = t();
    return We && n.devStrictMode && t(), i = {
      type: "memo",
      current: a,
      currentDeps: e,
      wip: a,
      wipDeps: e,
      isDirty: !1
    }, n.cells[r] = i, a;
  }
  i.type !== "memo" && To();
  const o = i;
  if (Gr(o.wipDeps, e))
    return o.isDirty && zs(n, o), o.wip;
  const s = t();
  return We && n.devStrictMode && t(), o.wip = s, o.wipDeps = e, o.isDirty || (o.isDirty = !0, Ic(n.root, () => {
    o.wip = o.current, o.wipDeps = o.currentDeps, o.isDirty = !1;
  })), zs(n, o), s;
};
function Jr(t) {
  return Kr(() => ({ current: t }), []);
}
const Ao = (t, e) => Kr(() => t, e), Um = () => ({
  type: "effect",
  cleanup: void 0,
  deps: null
});
function bn(t, e) {
  const n = Mt(), r = n.currentIndex++, i = n.cells[r], o = i === void 0 ? Um() : i.type === "effect" ? i : To();
  if (i === void 0 && (!n.isFirstRender && r >= n.cells.length && Co(), n.cells[r] = o), !(e && o.deps && Gr(o.deps, e))) {
    if (o.deps !== null && !!e != !!o.deps)
      throw new Error("useEffect called with and without dependencies across re-renders");
    qn(n, 2, () => {
      var s;
      try {
        (s = o.cleanup) == null || s.call(o);
      } finally {
        o.cleanup = void 0;
      }
    }), qn(n, 3, () => {
      try {
        const s = t();
        if (s !== void 0 && typeof s != "function")
          throw new Error(`An effect function must either return a cleanup function or nothing. Received: ${typeof s}`);
        o.cleanup = s;
      } finally {
        o.deps = e;
      }
    });
  }
}
function Eo(t) {
  const e = Mt(), n = Jr(t);
  return n.current !== t && qn(e, 1, () => {
    n.current = t;
  }), Ao((...r) => {
    if (We && Qt())
      throw new Error("useEffectEvent cannot be called during render");
    return n.current(...r);
  }, []);
}
const Rr = (t) => {
  if (!_o(t))
    throw new Error("A tap resource's `use()` only accepts a tap context.");
  return Nm(t);
}, Mc = (t, e, n = e) => {
  const r = Jr(!0), i = r.current ? n() : e();
  r.current = !1;
  const [, o] = Io(0), s = Eo(() => {
    Object.is(i, e()) || o((a) => a + 1);
  });
  return bn(() => (s(), t(s)), [t]), i;
}, Pc = (t, e) => {
}, jm = Ce;
function Vm(t) {
  const e = Fe(t);
  return mc(() => {
    e.current = t;
  }), Ue((...n) => e.current(...n), []);
}
const qm = jm.useEffectEvent ?? Vm, Je = () => Qt() !== null, Qe = Ce, xe = (t) => Je() ? Io(t) : Qe.useState(t), Hm = (t, e, n) => Je() ? Rc(t, e, n) : Qe.useReducer(t, e, n), ne = (t) => Je() ? Jr(t) : Qe.useRef(t), de = (t, e) => Je() ? Kr(t, e) : Qe.useMemo(t, e), It = (t, e) => Je() ? Ao(t, e) : Qe.useCallback(t, e), Y = (t, e) => Je() ? bn(t, e) : Qe.useEffect(t, e), Hn = (t, e) => Je() ? bn(t, e) : Qe.useLayoutEffect(t, e), qe = (t) => Je() ? Eo(t) : qm(t), _n = (t, e, n) => Je() ? Mc(t, e, n) : Qe.useSyncExternalStore(t, e, n), Wm = (t, e) => Je() ? Pc() : Qe.useDebugValue(t, e), Ye = (t) => {
  const e = Qe.createContext(t);
  return bc(e, t), e;
}, Nc = (t) => Je() && _o(t) ? Rr(t) : Qe.use(t), Xe = (t) => Je() && _o(t) ? Rr(t) : Qe.useContext(t), Dc = Ce, Lc = Symbol.for("react.memo_cache_sentinel"), zc = (t) => new Array(t).fill(Lc), Gm = (t) => Dc.useMemo(() => {
  const e = zc(t);
  return e[Lc] = !0, e;
}, []), R = (t) => {
  var s;
  const e = Qt();
  if (e === null)
    return (((s = Dc.__COMPILER_RUNTIME) == null ? void 0 : s.c) ?? Gm)(t);
  const n = e.memoCache;
  let r = n.workInProgress;
  if (r === null) {
    const a = n.current;
    r = a === null ? [] : a.map((l) => l.slice()), n.workInProgress = r;
  }
  const i = n.index++;
  let o = r[i];
  return o === void 0 ? (o = zc(t), r[i] = o) : We && o.length !== t && console.error(`Expected a constant size argument for each invocation of c(). The previous cache was allocated with size ${o.length} but size ${t} was requested.`), o;
};
function ue(t) {
  return (...e) => ({
    hook: t,
    args: e
  });
}
function ot(t, e, n) {
  return n ? {
    ...e,
    key: t,
    deps: n
  } : {
    ...e,
    key: t
  };
}
const Km = 50;
let ht = {
  schedulers: /* @__PURE__ */ new Set([]),
  isScheduled: !1
};
var Jm = class {
  constructor(t) {
    C(this, "_task");
    C(this, "_isDirty", !1);
    this._task = t;
  }
  get isDirty() {
    return this._isDirty;
  }
  markDirty() {
    this._isDirty = !0, ht.schedulers.add(this), Qm();
  }
  runTask() {
    this._isDirty = !1, this._task();
  }
};
const Qm = () => {
  ht.isScheduled || (ht.isScheduled = !0, Ym());
}, Vi = () => {
  try {
    const t = [];
    let e = 0;
    for (const n of ht.schedulers)
      if (ht.schedulers.delete(n), !!n.isDirty) {
        if (e++, e > Km)
          throw new Error("Maximum update depth exceeded. This can happen when a resource repeatedly calls setState inside useEffect.");
        try {
          n.runTask();
        } catch (r) {
          t.push(r);
        }
      }
    if (t.length > 0) {
      if (t.length === 1)
        throw t[0];
      for (const n of t)
        console.error(n);
      throw new AggregateError(t, "Errors occurred during flushSync");
    }
  } finally {
    ht.schedulers.clear(), ht.isScheduled = !1;
  }
}, Ym = (() => {
  if (typeof MessageChannel < "u") {
    const t = new MessageChannel();
    return t.port1.onmessage = Vi, () => t.port2.postMessage(null);
  }
  return () => setTimeout(Vi, 0);
})(), Os = (t) => {
  const e = ht;
  ht = {
    schedulers: /* @__PURE__ */ new Set([]),
    isScheduled: !0
  };
  try {
    const n = t();
    return Vi(), n;
  } finally {
    ht = e;
  }
}, Xm = {
  useState: Io,
  useReducer: Rc,
  useRef: Jr,
  useMemo: Kr,
  useCallback: Ao,
  useEffect: bn,
  useLayoutEffect: bn,
  useInsertionEffect: bn,
  useEffectEvent: Eo,
  useContext: Rr,
  use: Rr,
  useSyncExternalStore: Mc,
  useDebugValue: Pc
}, $s = Ce, zt = $s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ?? $s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, cr = zt == null ? null : "H" in zt ? {
  get current() {
    return zt.H;
  },
  set current(t) {
    zt.H = t;
  }
} : "ReactCurrentDispatcher" in zt ? {
  get current() {
    return zt.ReactCurrentDispatcher.current;
  },
  set current(t) {
    zt.ReactCurrentDispatcher.current = t;
  }
} : null;
function Zm(t) {
  if (!cr)
    return t();
  const e = cr.current;
  cr.current = Xm;
  try {
    return t();
  } finally {
    cr.current = e;
  }
}
function Oc(t, e, n = void 0, r) {
  return {
    hook: t,
    root: e,
    markDirty: n,
    devStrictMode: r,
    cells: [],
    contextDeps: null,
    wipContextDeps: null,
    commitCallbacks: null,
    wipCommitCallbacks: null,
    memoCache: {
      current: null,
      workInProgress: null,
      index: 0
    },
    renderPendingCells: null,
    currentIndex: 0,
    isFirstRender: !0,
    isMounted: !1,
    isNeverMounted: !0
  };
}
function vn(t) {
  if (!t.isMounted)
    throw new Error("Tried to unmount a fiber that is already unmounted");
  t.isMounted = !1, Sc(t);
}
function At(t, e) {
  var i;
  if (t.memoCache.workInProgress = null, t.renderPendingCells !== null) {
    for (const o of t.renderPendingCells)
      o.renderQueue = null;
    t.renderPendingCells.clear();
  }
  let n = 0, r;
  do {
    if (++n > 25)
      throw new Error("Too many re-renders. tap limits the number of renders to prevent an infinite loop.");
    t.memoCache.index = 0, Rm(t, () => {
      r = Zm(() => t.hook(...e));
    });
  } while ((((i = t.renderPendingCells) == null ? void 0 : i.size) ?? 0) > 0);
  return kc(t), r;
}
function Wn(t) {
  const e = t.wipCommitCallbacks ?? t.commitCallbacks ?? [];
  t.wipCommitCallbacks = null, t.commitCallbacks = e, t.isMounted = !0, t.contextDeps = t.wipContextDeps, Er(t.root), t.memoCache.workInProgress !== null && (t.memoCache.current = t.memoCache.workInProgress, t.memoCache.workInProgress = null), We && t.isNeverMounted && t.devStrictMode === "root" && (t.isNeverMounted = !1, Ls(e), Sc(t)), t.isNeverMounted = !1, Ls(e);
}
const ef = () => {
  const t = Mt();
  return t.devStrictMode ? t.isFirstRender ? "child" : "root" : null;
}, tf = () => "child", Fs = () => null, nf = () => {
  if (!We)
    return Fs;
  const t = ne(0);
  return xe(() => t.current++), t.current !== 2 ? Fs : tf;
}, $c = () => Qt() ? ef : nf(), rf = (t) => t(), of = (t) => {
  const e = de(() => new Jm(() => p()), []), n = de(() => [], []), r = $c(), i = de(() => {
    const m = Cc((g, w) => {
      if (!e.isDirty) {
        if (!g())
          return;
        w();
      }
      $n(m, m.committedVersion + m.changelog.length), n.push(w), e.markDirty();
    });
    return Oc(rf, m, void 0, r());
  }, [
    n,
    e,
    r
  ]), o = gc(), s = i.root.version - i.root.committedVersion, a = di(o, () => At(i, [t])), l = ne(!1), c = ne([t]), d = ne(a), u = de(() => /* @__PURE__ */ new Set(), []), h = (m) => {
    e.isDirty || d.current === m || (d.current = m, u.forEach((g) => g()));
  }, p = qe(() => {
    $n(i.root, i.root.committedVersion), n.forEach((g) => {
      We && i.devStrictMode && g(), g();
    }), $n(i.root, i.root.committedVersion + i.root.changelog.length), We && i.devStrictMode && di(i.root.context, () => At(i, c.current));
    const m = di(i.root.context, () => At(i, c.current));
    if (e.isDirty)
      throw new Error("Scheduler is dirty, this should never happen");
    Er(i.root), n.length = 0, l.current && Wn(i), h(m);
  });
  return Y(() => (l.current = !0, () => {
    l.current = !1, vn(i);
  }), [i]), Y(() => {
    c.current = [t], Er(i.root), n.splice(0, s), i.root.context = o, Wn(i), h(a);
  }), de(() => ({
    getValue: () => d.current,
    subscribe: (m) => (u.add(m), () => u.delete(m))
  }), [u]);
}, sf = () => {
  const t = ne(0), e = t.current, n = Mt();
  return {
    version: e,
    markDirty: de(() => () => {
      var r;
      t.current++, (r = n == null ? void 0 : n.markDirty) == null || r.call(n);
    }, [n]),
    root: n.root
  };
}, af = () => {
  const t = de(() => Cc((i, o) => {
    let s = !1;
    r((a) => (s = !i(), s ? a : a + 1)), s || n(o);
  }), []), [e, n] = Hm((i, o) => ($n(t, i), i + (o() ? 1 : 0)), 0), [, r] = xe(0);
  return $n(t, e), {
    root: t,
    version: e,
    markDirty: void 0
  };
}, Ro = () => {
  const t = $c(), { root: e, version: n, markDirty: r } = Qt() ? sf() : af();
  return {
    version: n,
    createFiber: It((i, o, s) => Oc(i, e, s ? () => {
      s(), r == null || r();
    } : r, t()), [])
  };
}, Fc = (t, e, n) => {
  const r = ne(null), i = r.current ?? (r.current = {
    wipDeps: null,
    wip: null,
    currentDeps: null,
    current: null
  });
  return i.wipDeps = i.currentDeps, i.wip = i.current, Y(() => {
    i.currentDeps = i.wipDeps, i.current = i.wip;
  }), !n && i.currentDeps && Gr(i.currentDeps, e) ? i.current : (i.wipDeps = e, i.wip = t(), i.wip);
};
function Le(t) {
  const { version: e, createFiber: n } = Ro(), r = de(() => n(t.hook, t.key), [
    t.hook,
    t.key,
    n
  ]), i = Fc(() => ({ value: At(r, t.args) }), [
    r,
    e,
    t.args
  ], So(r));
  return Y(() => () => vn(r), [r]), Y(() => {
    Wn(r);
  }, [r, i]), i.value;
}
const Bs = (t, e) => {
  const n = t.get(e);
  n && (n.isDirty = !0);
}, lf = (t, e) => !t.isDirty && !So(t.fiber) && e !== void 0 && t.committedDeps !== void 0 && Gr(t.committedDeps, e), cf = (t) => {
  if (!_c())
    return !1;
  for (const { fiber: e } of t.values())
    if (So(e))
      return !0;
  return !1;
};
function Qr(t) {
  const e = de(() => /* @__PURE__ */ new Map(), []), { version: n, createFiber: r } = Ro(), i = cf(e), o = Fc(() => {
    const s = /* @__PURE__ */ new Set(), a = [];
    let l = 0;
    for (let c = 0; c < t.length; c++) {
      const d = t[c], u = d.key;
      if (u === void 0)
        throw new Error(`useResources did not provide a key for array at index ${c}`);
      if (s.has(u))
        throw new Error(`Duplicate key ${u} in useResources`);
      s.add(u);
      let h = e.get(u);
      if (h)
        if (h.fiber.hook !== d.hook) {
          const p = r(d.hook, d.key, () => Bs(e, u)), m = At(p, d.args);
          h.next = {
            value: m,
            deps: d.deps,
            remount: p
          };
        } else if (lf(h, d.deps))
          h.fiber.contextDeps && kc(h.fiber, h.fiber.contextDeps), h.next = "skip";
        else {
          const p = At(h.fiber, d.args);
          h.next = {
            value: p,
            deps: d.deps
          };
        }
      else {
        const p = r(d.hook, d.key, () => Bs(e, u));
        h = {
          fiber: p,
          next: {
            value: At(p, d.args),
            deps: d.deps
          },
          isDirty: !1,
          committedDeps: void 0,
          committedValue: void 0
        }, l++, e.set(u, h);
      }
      a.push(typeof h.next == "object" ? h.next.value : h.committedValue);
    }
    if (e.size > a.length - l)
      for (const c of e.keys())
        s.has(c) || (e.get(c).next = "delete");
    return a;
  }, [
    t,
    e,
    r,
    n
  ], i);
  return Y(() => () => {
    for (const s of e.keys()) {
      const a = e.get(s).fiber;
      vn(a);
    }
  }, [e]), Y(() => {
    for (const [s, a] of e.entries()) {
      const l = a.next;
      l === "delete" ? (a.fiber.isMounted && vn(a.fiber), e.delete(s)) : l === "skip" || (l.remount && (vn(a.fiber), a.fiber = l.remount), Wn(a.fiber), a.committedDeps = l.deps, a.committedValue = l.value, a.isDirty = !1);
    }
  }, [o, e]), o;
}
const uf = (t) => t(), df = (t) => {
  const { createFiber: e } = Ro(), n = de(() => e(uf, void 0), [e]), r = At(n, [t]);
  Y(() => () => {
    vn(n);
  }, [n]);
  let i = !1;
  const o = () => {
    i && n.isMounted || (i = !0, Wn(n));
  };
  return Y(o), {
    value: r,
    effects: o
  };
}, hf = () => {
  const t = R(4), [e, n] = xe(mf);
  let r;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (r = (l, c) => (n((d) => ({
    ...d,
    renderers: {
      ...d.renderers,
      [l]: [...d.renderers[l] ?? [], c]
    }
  })), () => {
    n((d) => {
      var u;
      return {
        ...d,
        renderers: {
          ...d.renderers,
          [l]: ((u = d.renderers[l]) == null ? void 0 : u.filter((h) => h !== c)) ?? []
        }
      };
    });
  }), t[0] = r) : r = t[0];
  const i = r;
  let o;
  t[1] === Symbol.for("react.memo_cache_sentinel") ? (o = (l) => (n((c) => ({
    ...c,
    fallbacks: [...c.fallbacks, l]
  })), () => {
    n((c) => ({
      ...c,
      fallbacks: c.fallbacks.filter((d) => d !== l)
    }));
  }), t[1] = o) : o = t[1];
  const s = o;
  let a;
  return t[2] !== e ? (a = {
    getState: () => e,
    setDataUI: i,
    setFallbackDataUI: s
  }, t[2] = e, t[3] = a) : a = t[3], a;
}, pf = ue(hf);
function mf() {
  return {
    renderers: {},
    fallbacks: []
  };
}
const ff = (t) => {
  const e = Array.from(t).map((r) => r.getModelContext()).sort((r, i) => (i.priority ?? 0) - (r.priority ?? 0)), n = {};
  return e.reduce((r, i) => {
    var s;
    const o = i.priority ?? 0;
    if (i.system && (r.system ? r.system += `

${i.system}` : r.system = i.system), i.tools)
      for (const [a, l] of Object.entries(i.tools)) {
        const c = (s = r.tools) == null ? void 0 : s[a];
        if (c && c !== l) {
          const d = n[a];
          if (d === o)
            throw new Error(`You tried to define a tool with the name ${a}, but it already exists.`);
          const u = d > o ? c : l, h = d > o ? l : c;
          r.tools[a] = {
            ...h,
            ...u
          }, n[a] = Math.max(d, o);
          continue;
        }
        r.tools || (r.tools = {}), r.tools[a] = l, n[a] ?? (n[a] = o);
      }
    return i.config && (r.config = {
      ...r.config,
      ...i.config
    }), i.callSettings && (r.callSettings = {
      ...r.callSettings,
      ...i.callSettings
    }), i.unstable_composerMetadata && (r.unstable_composerMetadata = {
      ...r.unstable_composerMetadata,
      ...i.unstable_composerMetadata
    }), r;
  }, {});
};
var Mo = class {
  constructor() {
    C(this, "_providers", /* @__PURE__ */ new Set());
    C(this, "_subscribers", /* @__PURE__ */ new Set());
  }
  getModelContext() {
    return ff(this._providers);
  }
  registerModelContextProvider(t) {
    var n;
    this._providers.add(t);
    const e = (n = t.subscribe) == null ? void 0 : n.call(t, () => {
      this.notifySubscribers();
    });
    return this.notifySubscribers(), () => {
      this._providers.delete(t), e == null || e(), this.notifySubscribers();
    };
  }
  notifySubscribers() {
    for (const t of this._subscribers)
      t();
  }
  subscribe(t) {
    return this._subscribers.add(t), () => {
      this._subscribers.delete(t);
    };
  }
};
const qi = [], gf = {
  modelName: void 0,
  toolNames: qi
}, bf = (t, e) => t === e || t.length === e.length && t.every((n, r) => n === e[r]), ur = (t, e) => {
  var s;
  const n = t.getModelContext(), r = (s = n.config) == null ? void 0 : s.modelName, i = n.tools ? Object.keys(n.tools).sort() : qi, o = i.length ? i : qi;
  return r === e.modelName && bf(o, e.toolNames) ? e : {
    modelName: r,
    toolNames: o
  };
}, vf = () => {
  const t = R(11);
  let e;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (e = new Mo(), t[0] = e) : e = t[0];
  const n = e;
  let r;
  t[1] === Symbol.for("react.memo_cache_sentinel") ? (r = () => ur(n, gf), t[1] = r) : r = t[1];
  const [i, o] = xe(r);
  let s, a;
  t[2] === Symbol.for("react.memo_cache_sentinel") ? (s = () => (o((p) => ur(n, p)), n.subscribe(() => {
    o((p) => ur(n, p));
  })), a = [n], t[2] = s, t[3] = a) : (s = t[2], a = t[3]), Y(s, a);
  let l;
  t[4] !== i ? (l = () => ur(n, i), t[4] = i, t[5] = l) : l = t[5];
  let c, d, u;
  t[6] === Symbol.for("react.memo_cache_sentinel") ? (c = () => n.getModelContext(), d = (p) => n.subscribe(p), u = (p) => n.registerModelContextProvider(p), t[6] = c, t[7] = d, t[8] = u) : (c = t[6], d = t[7], u = t[8]);
  let h;
  return t[9] !== l ? (h = {
    getState: l,
    getModelContext: c,
    subscribe: d,
    register: u
  }, t[9] = l, t[10] = h) : h = t[10], h;
}, Bc = ue(vf), wf = (t) => t.display !== void 0 ? t.display === "standalone" : t.type === "human", yf = (t, e) => {
  var r, i;
  if (!(((r = e.status) == null ? void 0 : r.type) === "running" || ((i = e.status) == null ? void 0 : i.type) === "requires-action")) {
    const o = t.complete;
    return typeof o != "function" ? o ?? null : o({
      args: e.args,
      result: e.result
    });
  }
  const n = t.running;
  return typeof n != "function" ? n ?? null : n({ args: e.args });
}, xf = (t) => function(n) {
  return yf(t, n);
}, Hi = Symbol("assistant-ui.store.clientIndex"), kf = (t) => t[Hi], Uc = Ye([]), Po = () => Nc(Uc), _f = (t, e) => {
  const n = R(3), r = Po();
  let i;
  return n[0] !== t || n[1] !== r ? (i = [...r, t], n[0] = t, n[1] = r, n[2] = i) : i = n[2], xc(Uc, i, e);
}, Sf = /* @__PURE__ */ new Set([
  "$$typeof",
  "nodeType",
  "then"
]), Yr = (t, e) => {
  if (t === Symbol.toStringTag)
    return e;
  if (typeof t != "symbol") {
    if (t === "toJSON")
      return () => e;
    if (!Sf.has(t))
      return !1;
  }
};
var No = class {
  getOwnPropertyDescriptor(t, e) {
    const n = this.get(t, e);
    if (n !== void 0)
      return {
        value: n,
        writable: !1,
        enumerable: !0,
        configurable: !1
      };
  }
  set() {
    return !1;
  }
  setPrototypeOf() {
    return !1;
  }
  defineProperty() {
    return !1;
  }
  deleteProperty() {
    return !1;
  }
  preventExtensions() {
    return !1;
  }
};
const Mr = Symbol("assistant-ui.store.getValue"), Cf = (t) => {
  var n;
  const e = t[Mr];
  if (!e)
    throw new Error("Client scope contains a non-client resource. Ensure your Derived get() returns a client created with useClientResource(), not a plain resource.");
  return (n = e.getState) == null ? void 0 : n.call(e);
}, Us = /* @__PURE__ */ new Map();
function Tf(t) {
  let e = Us.get(t);
  return e || (e = function(...n) {
    if (!this || typeof this != "object")
      throw new Error(`Method "${String(t)}" called without proper context. This may indicate the function was called incorrectly.`);
    const r = this[Mr];
    if (!r)
      throw new Error(`Method "${String(t)}" called on invalid client proxy. Ensure you are calling this method on a valid client instance.`);
    const i = r[t];
    if (!i)
      throw new Error(`Method "${String(t)}" is not implemented.`);
    if (typeof i != "function")
      throw new Error(`"${String(t)}" is not a function.`);
    return i(...n);
  }, Us.set(t, e)), e;
}
var If = class extends No {
  constructor(e, n) {
    super();
    C(this, "outputRef");
    C(this, "index");
    C(this, "boundFns");
    C(this, "cachedReceiver");
    this.outputRef = e, this.index = n;
  }
  get(e, n, r) {
    if (n === Mr)
      return this.outputRef.current;
    if (n === Hi)
      return this.index;
    const i = Yr(n, "ClientProxy");
    if (i !== !1)
      return i;
    const o = this.outputRef.current[n];
    if (typeof o == "function") {
      this.cachedReceiver !== r && (this.boundFns = /* @__PURE__ */ new Map(), this.cachedReceiver = r);
      let s = this.boundFns.get(n);
      return s || (s = Tf(n).bind(r), this.boundFns.set(n, s)), s;
    }
    return o;
  }
  ownKeys() {
    return Object.keys(this.outputRef.current);
  }
  has(e, n) {
    return n === Mr || n === Hi ? !0 : n in this.outputRef.current;
  }
};
const rr = (t) => {
  var o;
  const e = ne(null), n = Po().length, r = de(() => new Proxy({}, new If(e, n)), [n]), i = _f(r, function() {
    return Le(t);
  });
  return e.current || (e.current = i), Y(() => {
    e.current = i;
  }), {
    methods: r,
    state: (o = i.getState) == null ? void 0 : o.call(i),
    key: t.key
  };
}, Af = ue(rr), Fn = Symbol("assistant-ui.store.proxiedAssistantState"), hi = (t) => t === "on" || t === "subscribe" || typeof t == "symbol", jc = (t) => {
  class e extends No {
    get(r, i) {
      const o = Yr(i, "AssistantState");
      if (o !== !1)
        return o;
      const s = i;
      if (!hi(s))
        return Cf(t[s]());
    }
    ownKeys() {
      return Object.keys(t).filter((r) => !hi(r));
    }
    has(r, i) {
      return !hi(i) && i in t;
    }
  }
  return new Proxy({}, new e());
}, Ef = (t) => t[Fn], js = () => () => {
}, Vc = (t) => {
  const e = () => {
    throw new Error(t);
  };
  return e.source = null, e.query = null, e;
};
var Rf = class extends No {
  get(t, e) {
    if (e === "subscribe" || e === "on")
      return js;
    if (e === Fn)
      return Mf;
    const n = Yr(e, "DefaultAssistantClient");
    return n !== !1 ? n : Vc("You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.");
  }
  ownKeys() {
    return [
      "subscribe",
      "on",
      Fn
    ];
  }
  has(t, e) {
    return e === "subscribe" || e === "on" || e === Fn;
  }
};
const Xr = new Proxy({}, new Rf()), Mf = jc(Xr), Pf = () => new Proxy({}, { get(t, e) {
  const n = Yr(e, "AssistantClient");
  return n !== !1 ? n : Vc(`The current scope does not have a "${String(e)}" property.`);
} }), qc = Ye(Xr), Hc = Symbol("assistant-ui.store.useEffects"), Nf = () => {
}, Df = (t) => t[Hc] ?? Nf, Lf = () => {
  "use no memo";
  return Y(Df(Wc())), null;
}, Wc = () => Xe(qc), Ge = ({ value: t, children: e }) => {
  "use no memo";
  return /* @__PURE__ */ j(qc.Provider, {
    value: t,
    children: [/* @__PURE__ */ f(Lf, {}), e]
  });
}, Wi = (t) => null, He = ue(Wi), Gi = Symbol("assistant-ui.transform-scopes");
function Gc(t, e) {
  const n = t;
  if (n[Gi])
    throw new Error("transformScopes is already attached to this resource");
  n[Gi] = e;
}
function zf(t) {
  return t[Gi];
}
const Kc = (t) => typeof t == "string" ? {
  scope: t.split(".")[0],
  event: t
} : {
  scope: t.scope,
  event: t.event
}, Jc = Ye(null), Of = (t, e) => xc(Jc, t, e), Qc = () => {
  const t = Nc(Jc);
  if (!t)
    throw new Error("AssistantTapContext is not available");
  return t;
}, Yc = () => Qc().clientRef, Do = () => {
  const t = R(3), { emit: e } = Qc(), n = Po();
  let r;
  return t[0] !== n || t[1] !== e ? (r = (i, o) => {
    e(i, o, n);
  }, t[0] = n, t[1] = e, t[2] = r) : r = t[2], qe(r);
};
function $f(t, e) {
  const n = { ...t }, r = /* @__PURE__ */ new Set();
  let i = !0;
  for (; i; ) {
    i = !1;
    for (const a of Object.values(n)) {
      if (a.hook === Wi || r.has(a.hook))
        continue;
      r.add(a.hook);
      const l = zf(a.hook);
      if (l) {
        l(n, e), i = !0;
        break;
      }
    }
  }
  const o = {}, s = {};
  for (const [a, l] of Object.entries(n))
    l.hook === Wi ? s[a] = l : o[a] = l;
  return {
    rootClients: o,
    derivedClients: s
  };
}
const Vs = (t) => de(() => t, [...Object.entries(t).flat()]), Ff = (t, e) => {
  const n = R(6);
  let r;
  n[0] !== e || n[1] !== t ? (r = $f(t, e), n[0] = e, n[1] = t, n[2] = r) : r = n[2];
  const { rootClients: i, derivedClients: o } = r, s = Vs(i), a = Vs(o);
  let l;
  return n[3] !== s || n[4] !== a ? (l = {
    rootClients: s,
    derivedClients: a
  }, n[3] = s, n[4] = a, n[5] = l) : l = n[5], l;
}, Bf = () => {
  const t = R(3);
  let e;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (e = /* @__PURE__ */ new Map(), t[0] = e) : e = t[0];
  const n = e;
  let r;
  t[1] === Symbol.for("react.memo_cache_sentinel") ? (r = /* @__PURE__ */ new Set(), t[1] = r) : r = t[1];
  const i = r;
  let o;
  if (t[2] === Symbol.for("react.memo_cache_sentinel")) {
    const s = /* @__PURE__ */ new Set();
    o = {
      on(a, l) {
        const c = l;
        if (a === "*")
          return i.add(c), () => i.delete(c);
        let d = n.get(a);
        return d || (d = /* @__PURE__ */ new Set(), n.set(a, d)), d.add(c), () => {
          d.delete(c), d.size === 0 && n.delete(a);
        };
      },
      emit(a, l, c) {
        const d = n.get(a);
        !d && i.size === 0 || queueMicrotask(() => {
          const u = [];
          if (d)
            for (const h of d)
              try {
                h(l, c);
              } catch (p) {
                const m = p;
                u.push(m);
              }
          if (i.size > 0) {
            const h = {
              event: a,
              payload: l
            };
            for (const p of i)
              try {
                p(h, c);
              } catch (m) {
                const g = m;
                u.push(g);
              }
          }
          if (u.length > 0) {
            if (u.length === 1)
              throw u[0];
            for (const h of u)
              console.error(h);
            throw new AggregateError(u, "Errors occurred during event emission");
          }
        });
      },
      subscribe(a) {
        return s.add(a), () => s.delete(a);
      },
      notifySubscribers() {
        for (const a of s)
          try {
            a();
          } catch (l) {
            console.error("NotificationManager: subscriber callback error", l);
          }
      }
    }, t[2] = o;
  } else
    o = t[2];
  return o;
}, Uf = ue(Bf), Xc = (t) => de(() => t, t), jf = ({ element: t, emit: e, clientRef: n }) => {
  const { methods: r, state: i } = Of({
    clientRef: n,
    emit: e
  }, function() {
    return rr(t);
  });
  return de(() => ({
    state: i,
    methods: r
  }), [r, i]);
}, Vf = ({ element: t, notifications: e, clientRef: n, name: r }) => {
  const i = of(function() {
    return jf({
      element: t,
      emit: e.emit,
      clientRef: n
    });
  });
  return Y(() => i.subscribe(e.notifySubscribers), [i, e]), de(() => {
    const o = () => i.getValue().methods;
    return Object.defineProperties(o, {
      source: {
        value: "root",
        writable: !1
      },
      query: {
        value: {},
        writable: !1
      },
      name: {
        value: r,
        configurable: !0
      }
    }), o;
  }, [i, r]);
}, qf = ue(Vf), Hf = () => {
  const t = R(2);
  let e;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (e = [], t[0] = e) : e = t[0];
  let n;
  return t[1] === Symbol.for("react.memo_cache_sentinel") ? (n = {
    clients: e,
    subscribe: void 0,
    on: void 0
  }, t[1] = n) : n = t[1], n;
}, Wf = ue(Hf), Gf = (t) => {
  const e = R(14), { clients: n, clientRef: r } = t;
  let i;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (i = Uf(), e[0] = i) : i = e[0];
  const o = Le(i);
  let s;
  e[1] !== r.parent || e[2] !== o.notifySubscribers ? (s = () => r.parent.subscribe(o.notifySubscribers), e[1] = r.parent, e[2] = o.notifySubscribers, e[3] = s) : s = e[3];
  let a;
  e[4] !== r || e[5] !== o ? (a = [r, o], e[4] = r, e[5] = o, e[6] = a) : a = e[6], Y(s, a);
  let l;
  e[7] !== r || e[8] !== n || e[9] !== o ? (l = Object.keys(n).map((u) => ot(u, qf({
    element: n[u],
    notifications: o,
    clientRef: r,
    name: u
  }))), e[7] = r, e[8] = n, e[9] = o, e[10] = l) : l = e[10];
  const c = Xc(Qr(l));
  let d;
  return e[11] !== o || e[12] !== c ? (d = {
    notifications: o,
    results: c
  }, e[11] = o, e[12] = c, e[13] = d) : d = e[13], d;
}, Kf = (t) => {
  const { clientRef: e } = t, { notifications: n, results: r } = Gf(t);
  return de(() => ({
    clients: r,
    subscribe: n.subscribe,
    on: function(i, o) {
      if (!this)
        throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
      const { scope: s, event: a } = Kc(i);
      if (s !== "*" && this[s].source === null)
        throw new Error(`Scope "${s}" is not available. Use { scope: "*", event: "${a}" } to listen globally.`);
      const l = n.on(a, (d, u) => {
        if (s === "*") {
          o(d);
          return;
        }
        const h = this[s]();
        h === u[kf(h)] && o(d);
      });
      if (s !== "*" && e.parent[s].source === null)
        return l;
      const c = e.parent.on(i, o);
      return () => {
        l(), c();
      };
    }
  }), [
    r,
    n,
    e
  ]);
}, Jf = ue(Kf), Qf = ({ element: t, clientRef: e, name: n }) => {
  const r = ne(t.args[0]);
  return r.current = t.args[0], de(() => {
    const i = () => r.current.get(e.current);
    return Object.defineProperties(i, {
      source: { value: r.current.source },
      query: { value: r.current.query },
      name: {
        value: n,
        configurable: !0
      }
    }), i;
  }, [e, n]);
}, Yf = ue(Qf), Xf = (t, e) => {
  let n;
  try {
    const r = {};
    for (const i of Object.keys(e.query).sort())
      r[i] = e.query[i];
    n = JSON.stringify(r);
  } catch {
    n = String(e.query);
  }
  return `${t}::${e.source}::${n}`;
}, Zf = (t) => {
  const e = R(3), { clients: n, clientRef: r } = t;
  let i;
  return e[0] !== r || e[1] !== n ? (i = Object.keys(n).map((o) => {
    const s = o, a = n[s];
    return ot(Xf(s, a.args[0]), Yf({
      element: a,
      clientRef: r,
      name: s
    }));
  }), e[0] = r, e[1] = n, e[2] = i) : i = e[2], Xc(Qr(i));
}, eg = (t) => {
  const e = R(3), { rootClients: n, clientRef: r } = t;
  let i;
  return e[0] !== r || e[1] !== n ? (i = Object.keys(n).length > 0 ? Jf({
    clients: n,
    clientRef: r
  }) : Wf(), e[0] = r, e[1] = n, e[2] = i) : i = e[2], Le(i);
}, tg = ({ parent: t, clients: e }) => {
  const { rootClients: n, derivedClients: r } = Ff(e, t), i = ne({
    parent: t,
    current: null
  }).current;
  Y(() => {
    i.current = a;
  });
  const o = eg({
    rootClients: n,
    clientRef: i
  }), s = Zf({
    clients: r,
    clientRef: i
  }), a = de(() => {
    const l = t === Xr ? Pf() : t, c = Object.create(l);
    Object.assign(c, {
      subscribe: o.subscribe ?? t.subscribe,
      on: o.on ?? t.on,
      [Fn]: jc(c)
    });
    for (const d of o.clients)
      c[d.name] = d;
    for (const d of s)
      c[d.name] = d;
    return c;
  }, [
    t,
    o,
    s
  ]);
  return i.current === null && (i.current = a), a;
}, ng = (t) => {
  const { value: e, effects: n } = df(function() {
    return tg(t);
  });
  return e[Hc] = n, e;
};
function Z(t, { parent: e } = { parent: Wc() }) {
  if (t)
    return ng({
      parent: e ?? Xr,
      clients: t
    });
  if (e === null)
    throw new Error("received null parent, this usage is not allowed");
  return e;
}
const $ = (t) => {
  const e = R(6), n = Z();
  let r;
  e[0] !== n ? (r = Ef(n), e[0] = n, e[1] = r) : r = e[1];
  const i = r;
  let o, s;
  e[2] !== i || e[3] !== t ? (o = () => t(i), s = () => t(i), e[2] = i, e[3] = t, e[4] = o, e[5] = s) : (o = e[4], s = e[5]);
  const a = _n(n.subscribe, o, s);
  if (a === i)
    throw new Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
  return Wm(a), a;
}, Wt = (t) => {
  const { children: e, condition: n } = t;
  return $(n) ? e : null;
};
Wt.displayName = "AuiIf";
const rg = (t) => {
  const e = Z(), n = ne(!1), r = n.current ? null : t(e);
  return $(() => n.current ? t(e) : r), () => (n.current = !0, t(e));
}, ig = Object.freeze({});
function Sn(t) {
  const e = R(3), { getItemState: n, children: r } = t, i = rg(n);
  let o;
  return e[0] !== r || e[1] !== i ? (o = r(i), e[0] = r, e[1] = i, e[2] = o) : o = e[2], og(o);
}
const og = (t) => {
  const e = typeof t == "object" && t != null && "type" in t ? t : null, n = e == null ? void 0 : e.type, r = e == null ? void 0 : e.key;
  return de(() => e, [
    n,
    r,
    typeof (e == null ? void 0 : e.props) == "object" && e.props != null && Object.entries(e.props).length === 0 ? ig : e == null ? void 0 : e.props
  ]) ?? t;
}, sg = Ce.createContext(!0);
function qs() {
  throw new Error("A function wrapped in useEffectEvent can't be called during rendering.");
}
const ag = "use" in Ce ? () => {
  try {
    return Ce.use(sg);
  } catch {
    return !1;
  }
} : () => !1;
function lg(t) {
  const e = Ce.useRef(qs);
  return Ce.useInsertionEffect(() => {
    e.current = t;
  }, [t]), (...n) => {
    ag() && qs();
    const r = e.current;
    return r(...n);
  };
}
const Gn = (t, e) => {
  const n = R(11), r = Z(), i = lg(e);
  let o;
  n[0] !== t ? (o = Kc(t), n[0] = t, n[1] = o) : o = n[1];
  const { scope: s, event: a } = o;
  let l;
  n[2] !== r || n[3] !== i || n[4] !== a || n[5] !== s ? (l = () => r.on({
    scope: s,
    event: a
  }, i), n[2] = r, n[3] = i, n[4] = a, n[5] = s, n[6] = l) : l = n[6];
  let c;
  n[7] !== r || n[8] !== a || n[9] !== s ? (c = [
    r,
    s,
    a
  ], n[7] = r, n[8] = a, n[9] = s, n[10] = c) : c = n[10], Y(l, c);
}, cg = (t) => {
  if (t.key === void 0)
    throw new Error("useClientLookup: Element has no key");
  return t.key;
};
function Gt(t) {
  const e = R(15);
  let n;
  e[0] !== t ? (n = t.map(hg), e[0] = t, e[1] = n) : n = e[1];
  const r = Qr(n);
  let i;
  e[2] !== r ? (i = Object.keys(r), e[2] = r, e[3] = i) : i = e[3];
  const o = i;
  let s;
  e[4] !== r ? (s = r.reduce(dg, {}), e[4] = r, e[5] = s) : s = e[5];
  const a = s;
  let l;
  e[6] !== r ? (l = r.map(ug), e[6] = r, e[7] = l) : l = e[7];
  const c = l;
  let d;
  e[8] !== a || e[9] !== o || e[10] !== r ? (d = (h) => {
    if ("index" in h) {
      if (h.index < 0 || h.index >= o.length)
        throw new Error(`useClientLookup: Index ${h.index} out of bounds (length: ${o.length})`);
      return r[h.index].methods;
    }
    const p = a[h.key];
    if (p === void 0)
      throw new Error(`useClientLookup: Key "${h.key}" not found`);
    return r[p].methods;
  }, e[8] = a, e[9] = o, e[10] = r, e[11] = d) : d = e[11];
  let u;
  return e[12] !== c || e[13] !== d ? (u = {
    state: c,
    get: d
  }, e[12] = c, e[13] = d, e[14] = u) : u = e[14], u;
}
function ug(t) {
  return t.state;
}
function dg(t, e, n) {
  return t[e.key] = n, t;
}
function hg(t) {
  return ot(cg(t), Af(t), t.deps);
}
const Zc = (t) => {
  const e = R(15), { toolkit: n, mcpApp: r } = t;
  let i;
  e[0] !== r ? (i = r ? [ot("mcpApp", r)] : [], e[0] = r, e[1] = i) : i = e[1];
  const o = Qr(i)[0], [s, a] = xe(mg);
  let l;
  e[2] !== s ? (l = Object.fromEntries(Object.entries(s).map(gg)), e[2] = s, e[3] = l) : l = e[3];
  let c;
  e[4] !== o || e[5] !== l || e[6] !== s ? (c = {
    toolUIs: s,
    mcpApp: o,
    tools: l
  }, e[4] = o, e[5] = l, e[6] = s, e[7] = c) : c = e[7];
  const d = c, u = Yc();
  let h;
  e[8] === Symbol.for("react.memo_cache_sentinel") ? (h = (b, k, x) => {
    const T = {
      render: k,
      standalone: (x == null ? void 0 : x.standalone) ?? !1
    };
    return a((I) => ({
      ...I,
      [b]: [...I[b] ?? [], T]
    })), () => {
      a((I) => {
        var E;
        const y = ((E = I[b]) == null ? void 0 : E.filter((N) => N !== T)) ?? [];
        if (y.length > 0)
          return {
            ...I,
            [b]: y
          };
        const M = { ...I };
        return delete M[b], M;
      });
    };
  }, e[8] = h) : h = e[8];
  const p = h;
  let m, g;
  e[9] !== u || e[10] !== n ? (m = () => {
    if (!n)
      return;
    const b = [];
    for (const [x, T] of Object.entries(n)) {
      const I = "render" in T ? T.render : void 0, y = "renderText" in T ? T.renderText : void 0, M = I ?? (y ? xf(y) : void 0);
      M && b.push(p(x, M, { standalone: wf(T) }));
    }
    const k = Object.entries(n).reduce(bg, {});
    return b.push(u.current.modelContext().register({ getModelContext: () => ({ tools: k }) })), () => {
      b.forEach(vg);
    };
  }, g = [
    n,
    p,
    u
  ], e[9] = u, e[10] = n, e[11] = m, e[12] = g) : (m = e[11], g = e[12]), Y(m, g);
  let w;
  return e[13] !== d ? (w = {
    getState: () => d,
    setToolUI: p
  }, e[13] = d, e[14] = w) : w = e[14], w;
}, pg = ue(Zc);
Gc(Zc, (t, e) => {
  !t.modelContext && e.modelContext.source === null && (t.modelContext = Bc());
});
function mg() {
  return {};
}
function fg(t) {
  return t.render;
}
function gg(t) {
  const [e, n] = t;
  return [e, n.map(fg)];
}
function bg(t, e) {
  const [n, r] = e;
  if (r.type === "mcp")
    return t;
  const { display: i, render: o, renderText: s, ...a } = r;
  return t[n] = a, t;
}
function vg(t) {
  return t();
}
const Yt = (t) => _n(t.subscribe, t.getState), wg = (t) => {
  const e = R(8), { runtime: n } = t, r = Yt(n);
  let i;
  e[0] !== r ? (i = () => r, e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== n ? (o = () => n, e[2] = n, e[3] = o) : o = e[3];
  let s;
  return e[4] !== n.remove || e[5] !== i || e[6] !== o ? (s = {
    getState: i,
    remove: n.remove,
    __internal_getRuntime: o
  }, e[4] = n.remove, e[5] = i, e[6] = o, e[7] = s) : s = e[7], s;
}, eu = ue(wg), yg = (t) => {
  const e = R(5), { runtime: n, index: r } = t;
  let i;
  e[0] !== r || e[1] !== n ? (i = n.getAttachmentByIndex(r), e[0] = r, e[1] = n, e[2] = i) : i = e[2];
  const o = i;
  let s;
  return e[3] !== o ? (s = eu({ runtime: o }), e[3] = o, e[4] = s) : s = e[4], Le(s);
}, xg = ue(yg), kg = ({ item: t, onSteer: e, onRemove: n }) => ({
  getState: () => t,
  steer: e,
  remove: n
}), _g = ue(kg), Sg = (t) => {
  const e = R(55), { threadIdRef: n, messageIdRef: r, runtime: i } = t, o = Yt(i), s = Do();
  let a, l;
  e[0] !== s || e[1] !== r || e[2] !== i || e[3] !== n ? (a = () => {
    const M = [];
    for (const E of ["send", "attachmentAdd"]) {
      const N = i.unstable_on(E, () => {
        s(`composer.${E}`, {
          threadId: n.current,
          ...r && { messageId: r.current }
        });
      });
      M.push(N);
    }
    return M.push(i.unstable_on("attachmentAddError", (E) => {
      s("composer.attachmentAddError", {
        threadId: n.current,
        ...r && { messageId: r.current },
        ...E.attachmentId && { attachmentId: E.attachmentId },
        reason: E.reason,
        message: E.message
      });
    })), () => {
      for (const E of M)
        E();
    };
  }, l = [
    i,
    s,
    n,
    r
  ], e[0] = s, e[1] = r, e[2] = i, e[3] = n, e[4] = a, e[5] = l) : (a = e[4], l = e[5]), Y(a, l);
  let c;
  if (e[6] !== i || e[7] !== o.attachments) {
    let M;
    e[9] !== i ? (M = (E, N) => ot(E.id, xg({
      runtime: i,
      index: N
    }), [i, N]), e[9] = i, e[10] = M) : M = e[10], c = o.attachments.map(M), e[6] = i, e[7] = o.attachments, e[8] = c;
  } else
    c = e[8];
  const d = Gt(c), u = o.queue;
  let h;
  if (e[11] !== u || e[12] !== i) {
    let M;
    e[14] !== i ? (M = (E) => ot(E.id, _g({
      item: E,
      onSteer: () => i.steerQueueItem(E.id),
      onRemove: () => i.removeQueueItem(E.id)
    })), e[14] = i, e[15] = M) : M = e[15], h = u.map(M), e[11] = u, e[12] = i, e[13] = h;
  } else
    h = e[13];
  const p = Gt(h), m = o.type ?? "thread";
  let g;
  e[16] !== d.state || e[17] !== u || e[18] !== o.attachmentAccept || e[19] !== o.canCancel || e[20] !== o.canSend || e[21] !== o.dictation || e[22] !== o.isEditing || e[23] !== o.isEmpty || e[24] !== o.quote || e[25] !== o.role || e[26] !== o.runConfig || e[27] !== o.text || e[28] !== m ? (g = {
    text: o.text,
    role: o.role,
    attachments: d.state,
    runConfig: o.runConfig,
    isEditing: o.isEditing,
    canCancel: o.canCancel,
    canSend: o.canSend,
    attachmentAccept: o.attachmentAccept,
    isEmpty: o.isEmpty,
    type: m,
    dictation: o.dictation,
    quote: o.quote,
    queue: u
  }, e[16] = d.state, e[17] = u, e[18] = o.attachmentAccept, e[19] = o.canCancel, e[20] = o.canSend, e[21] = o.dictation, e[22] = o.isEditing, e[23] = o.isEmpty, e[24] = o.quote, e[25] = o.role, e[26] = o.runConfig, e[27] = o.text, e[28] = m, e[29] = g) : g = e[29];
  const w = g;
  let b;
  e[30] !== w ? (b = () => w, e[30] = w, e[31] = b) : b = e[31];
  const k = i.beginEdit ?? Cg;
  let x;
  e[32] !== d ? (x = (M) => "id" in M ? d.get({ key: M.id }) : d.get(M), e[32] = d, e[33] = x) : x = e[33];
  let T;
  e[34] !== p ? (T = (M) => p.get(M), e[34] = p, e[35] = T) : T = e[35];
  let I;
  e[36] !== i ? (I = () => i, e[36] = i, e[37] = I) : I = e[37];
  let y;
  return e[38] !== i.addAttachment || e[39] !== i.cancel || e[40] !== i.clearAttachments || e[41] !== i.reset || e[42] !== i.send || e[43] !== i.setQuote || e[44] !== i.setRole || e[45] !== i.setRunConfig || e[46] !== i.setText || e[47] !== i.startDictation || e[48] !== i.stopDictation || e[49] !== T || e[50] !== I || e[51] !== b || e[52] !== k || e[53] !== x ? (y = {
    getState: b,
    setText: i.setText,
    setRole: i.setRole,
    setRunConfig: i.setRunConfig,
    addAttachment: i.addAttachment,
    reset: i.reset,
    clearAttachments: i.clearAttachments,
    send: i.send,
    cancel: i.cancel,
    beginEdit: k,
    startDictation: i.startDictation,
    stopDictation: i.stopDictation,
    setQuote: i.setQuote,
    attachment: x,
    queueItem: T,
    __internal_getRuntime: I
  }, e[38] = i.addAttachment, e[39] = i.cancel, e[40] = i.clearAttachments, e[41] = i.reset, e[42] = i.send, e[43] = i.setQuote, e[44] = i.setRole, e[45] = i.setRunConfig, e[46] = i.setText, e[47] = i.startDictation, e[48] = i.stopDictation, e[49] = T, e[50] = I, e[51] = b, e[52] = k, e[53] = x, e[54] = y) : y = e[54], y;
}, tu = ue(Sg);
function Cg() {
  throw new Error("beginEdit is not supported in this runtime");
}
const nu = (t) => ({ get current() {
  return t();
} }), Tg = (t) => {
  const e = R(13), { runtime: n } = t, r = Yt(n);
  let i;
  e[0] !== r ? (i = () => r, e[0] = r, e[1] = i) : i = e[1];
  let o, s, a, l;
  e[2] !== n ? (o = (d) => n.addToolResult(d), s = (d) => n.resumeToolCall(d), a = (d) => n.respondToToolApproval(d), l = () => n, e[2] = n, e[3] = o, e[4] = s, e[5] = a, e[6] = l) : (o = e[3], s = e[4], a = e[5], l = e[6]);
  let c;
  return e[7] !== i || e[8] !== o || e[9] !== s || e[10] !== a || e[11] !== l ? (c = {
    getState: i,
    addToolResult: o,
    resumeToolCall: s,
    respondToToolApproval: a,
    __internal_getRuntime: l
  }, e[7] = i, e[8] = o, e[9] = s, e[10] = a, e[11] = l, e[12] = c) : c = e[12], c;
}, Ig = ue(Tg), Ag = (t) => {
  const e = R(5), { runtime: n, index: r } = t;
  let i;
  e[0] !== r || e[1] !== n ? (i = n.getAttachmentByIndex(r), e[0] = r, e[1] = n, e[2] = i) : i = e[2];
  const o = i;
  let s;
  return e[3] !== o ? (s = eu({ runtime: o }), e[3] = o, e[4] = s) : s = e[4], Le(s);
}, Eg = ue(Ag), Rg = (t) => {
  const e = R(5), { runtime: n, index: r } = t;
  let i;
  e[0] !== r || e[1] !== n ? (i = n.getMessagePartByIndex(r), e[0] = r, e[1] = n, e[2] = i) : i = e[2];
  const o = i;
  let s;
  return e[3] !== o ? (s = Ig({ runtime: o }), e[3] = o, e[4] = s) : s = e[4], Le(s);
}, Mg = ue(Rg), Pg = (t) => {
  const e = R(55), { runtime: n, threadIdRef: r } = t, i = Yt(n), [o, s] = xe(!1), [a, l] = xe(!1);
  let c;
  e[0] !== n ? (c = nu(() => n.getState().id), e[0] = n, e[1] = c) : c = e[1];
  const d = c;
  let u;
  e[2] !== d || e[3] !== n.composer || e[4] !== r ? (u = tu({
    runtime: n.composer,
    threadIdRef: r,
    messageIdRef: d
  }), e[2] = d, e[3] = n.composer, e[4] = r, e[5] = u) : u = e[5];
  const h = rr(u);
  let p;
  if (e[6] !== n || e[7] !== i.content) {
    let F;
    e[9] !== n ? (F = (B, v) => ot("toolCallId" in B && B.toolCallId != null ? `toolCallId-${B.toolCallId}` : `index-${v}`, Mg({
      runtime: n,
      index: v
    }), [n, v]), e[9] = n, e[10] = F) : F = e[10], p = i.content.map(F), e[6] = n, e[7] = i.content, e[8] = p;
  } else
    p = e[8];
  const m = Gt(p);
  let g;
  e[11] !== i.attachments ? (g = i.attachments ?? [], e[11] = i.attachments, e[12] = g) : g = e[12];
  let w;
  if (e[13] !== n || e[14] !== g) {
    let F;
    e[16] !== n ? (F = (B, v) => ot(B.id, Eg({
      runtime: n,
      index: v
    }), [n, v]), e[16] = n, e[17] = F) : F = e[17], w = g.map(F), e[13] = n, e[14] = g, e[15] = w;
  } else
    w = e[15];
  const b = Gt(w), k = i;
  let x;
  e[18] !== h.state || e[19] !== o || e[20] !== a || e[21] !== m.state || e[22] !== k ? (x = {
    ...k,
    parts: m.state,
    composer: h.state,
    isCopied: o,
    isHovering: a
  }, e[18] = h.state, e[19] = o, e[20] = a, e[21] = m.state, e[22] = k, e[23] = x) : x = e[23];
  const T = x;
  let I;
  e[24] !== T ? (I = () => T, e[24] = T, e[25] = I) : I = e[25];
  let y;
  e[26] !== h.methods ? (y = () => h.methods, e[26] = h.methods, e[27] = y) : y = e[27];
  let M, E, N, _, A, P, D;
  e[28] !== n ? (M = () => n.delete(), E = (F) => n.reload(F), N = () => n.speak(), _ = () => n.stopSpeaking(), A = (F) => n.submitFeedback(F), P = (F) => n.switchToBranch(F), D = () => n.unstable_getCopyText(), e[28] = n, e[29] = M, e[30] = E, e[31] = N, e[32] = _, e[33] = A, e[34] = P, e[35] = D) : (M = e[29], E = e[30], N = e[31], _ = e[32], A = e[33], P = e[34], D = e[35]);
  let O;
  e[36] !== m ? (O = (F) => "index" in F ? m.get({ index: F.index }) : m.get({ key: `toolCallId-${F.toolCallId}` }), e[36] = m, e[37] = O) : O = e[37];
  let z;
  e[38] !== b ? (z = (F) => "id" in F ? b.get({ key: F.id }) : b.get(F), e[38] = b, e[39] = z) : z = e[39];
  let V;
  e[40] !== n ? (V = () => n, e[40] = n, e[41] = V) : V = e[41];
  let G;
  return e[42] !== M || e[43] !== E || e[44] !== N || e[45] !== _ || e[46] !== A || e[47] !== P || e[48] !== D || e[49] !== O || e[50] !== z || e[51] !== V || e[52] !== I || e[53] !== y ? (G = {
    getState: I,
    composer: y,
    delete: M,
    reload: E,
    speak: N,
    stopSpeaking: _,
    submitFeedback: A,
    switchToBranch: P,
    getCopyText: D,
    part: O,
    attachment: z,
    setIsCopied: s,
    setIsHovering: l,
    __internal_getRuntime: V
  }, e[42] = M, e[43] = E, e[44] = N, e[45] = _, e[46] = A, e[47] = P, e[48] = D, e[49] = O, e[50] = z, e[51] = V, e[52] = I, e[53] = y, e[54] = G) : G = e[54], G;
}, Ng = ue(Pg), Dg = (t) => {
  const e = R(6), { runtime: n, id: r, threadIdRef: i } = t;
  let o;
  e[0] !== r || e[1] !== n ? (o = n.getMessageById(r), e[0] = r, e[1] = n, e[2] = o) : o = e[2];
  const s = o;
  let a;
  return e[3] !== s || e[4] !== i ? (a = Ng({
    runtime: s,
    threadIdRef: i
  }), e[3] = s, e[4] = i, e[5] = a) : a = e[5], Le(a);
}, Lg = ue(Dg), zg = (t) => {
  const e = R(58), { runtime: n } = t, r = Yt(n), i = Do();
  let o, s;
  e[0] !== i || e[1] !== n ? (o = () => {
    const I = [];
    for (const y of [
      "runStart",
      "runEnd",
      "initialize",
      "modelContextUpdate"
    ]) {
      const M = n.unstable_on(y, () => {
        var N;
        const E = ((N = n.getState()) == null ? void 0 : N.threadId) || "unknown";
        i(`thread.${y}`, { threadId: E });
      });
      I.push(M);
    }
    return () => {
      for (const y of I)
        y();
    };
  }, s = [n, i], e[0] = i, e[1] = n, e[2] = o, e[3] = s) : (o = e[2], s = e[3]), Y(o, s);
  let a;
  e[4] !== n ? (a = nu(() => n.getState().threadId), e[4] = n, e[5] = a) : a = e[5];
  const l = a;
  let c;
  e[6] !== n.composer || e[7] !== l ? (c = tu({
    runtime: n.composer,
    threadIdRef: l
  }), e[6] = n.composer, e[7] = l, e[8] = c) : c = e[8];
  const d = rr(c);
  let u;
  if (e[9] !== n || e[10] !== r.messages || e[11] !== l) {
    let I;
    e[13] !== n || e[14] !== l ? (I = (y) => ot(y.id, Lg({
      runtime: n,
      id: y.id,
      threadIdRef: l
    }), [
      n,
      y.id,
      l
    ]), e[13] = n, e[14] = l, e[15] = I) : I = e[15], u = r.messages.map(I), e[9] = n, e[10] = r.messages, e[11] = l, e[12] = u;
  } else
    u = e[12];
  const h = Gt(u), p = h.state.length === 0 && !r.isLoading;
  let m;
  e[16] !== d.state || e[17] !== h.state || e[18] !== r.capabilities || e[19] !== r.extras || e[20] !== r.isDisabled || e[21] !== r.isLoading || e[22] !== r.isRunning || e[23] !== r.speech || e[24] !== r.state || e[25] !== r.suggestions || e[26] !== r.voice || e[27] !== p ? (m = {
    isEmpty: p,
    isDisabled: r.isDisabled,
    isLoading: r.isLoading,
    isRunning: r.isRunning,
    capabilities: r.capabilities,
    state: r.state,
    suggestions: r.suggestions,
    extras: r.extras,
    speech: r.speech,
    voice: r.voice,
    composer: d.state,
    messages: h.state
  }, e[16] = d.state, e[17] = h.state, e[18] = r.capabilities, e[19] = r.extras, e[20] = r.isDisabled, e[21] = r.isLoading, e[22] = r.isRunning, e[23] = r.speech, e[24] = r.state, e[25] = r.suggestions, e[26] = r.voice, e[27] = p, e[28] = m) : m = e[28];
  const g = m;
  let w;
  e[29] !== g ? (w = () => g, e[29] = g, e[30] = w) : w = e[30];
  let b;
  e[31] !== d.methods ? (b = () => d.methods, e[31] = d.methods, e[32] = b) : b = e[32];
  let k;
  e[33] !== h ? (k = (I) => "id" in I ? h.get({ key: I.id }) : h.get(I), e[33] = h, e[34] = k) : k = e[34];
  let x;
  e[35] !== n ? (x = () => n, e[35] = n, e[36] = x) : x = e[36];
  let T;
  return e[37] !== n.append || e[38] !== n.cancelRun || e[39] !== n.connectVoice || e[40] !== n.deleteMessage || e[41] !== n.disconnectVoice || e[42] !== n.export || e[43] !== n.getModelContext || e[44] !== n.getVoiceVolume || e[45] !== n.import || e[46] !== n.muteVoice || e[47] !== n.reset || e[48] !== n.resumeRun || e[49] !== n.startRun || e[50] !== n.stopSpeaking || e[51] !== n.subscribeVoiceVolume || e[52] !== n.unmuteVoice || e[53] !== k || e[54] !== x || e[55] !== w || e[56] !== b ? (T = {
    getState: w,
    composer: b,
    append: n.append,
    deleteMessage: n.deleteMessage,
    startRun: n.startRun,
    resumeRun: n.resumeRun,
    cancelRun: n.cancelRun,
    getModelContext: n.getModelContext,
    export: n.export,
    import: n.import,
    reset: n.reset,
    stopSpeaking: n.stopSpeaking,
    connectVoice: n.connectVoice,
    disconnectVoice: n.disconnectVoice,
    getVoiceVolume: n.getVoiceVolume,
    subscribeVoiceVolume: n.subscribeVoiceVolume,
    muteVoice: n.muteVoice,
    unmuteVoice: n.unmuteVoice,
    message: k,
    __internal_getRuntime: x
  }, e[37] = n.append, e[38] = n.cancelRun, e[39] = n.connectVoice, e[40] = n.deleteMessage, e[41] = n.disconnectVoice, e[42] = n.export, e[43] = n.getModelContext, e[44] = n.getVoiceVolume, e[45] = n.import, e[46] = n.muteVoice, e[47] = n.reset, e[48] = n.resumeRun, e[49] = n.startRun, e[50] = n.stopSpeaking, e[51] = n.subscribeVoiceVolume, e[52] = n.unmuteVoice, e[53] = k, e[54] = x, e[55] = w, e[56] = b, e[57] = T) : T = e[57], T;
}, Og = ue(zg), $g = (t) => {
  const e = R(20), { runtime: n } = t, r = Yt(n), i = Do();
  let o, s;
  e[0] !== i || e[1] !== n ? (o = () => {
    const d = [];
    for (const u of ["switchedTo", "switchedAway"]) {
      const h = n.unstable_on(u, () => {
        i(`threadListItem.${u}`, { threadId: n.getState().id });
      });
      d.push(h);
    }
    return () => {
      for (const u of d)
        u();
    };
  }, s = [n, i], e[0] = i, e[1] = n, e[2] = o, e[3] = s) : (o = e[2], s = e[3]), Y(o, s);
  let a;
  e[4] !== r ? (a = () => r, e[4] = r, e[5] = a) : a = e[5];
  let l;
  e[6] !== n ? (l = () => n, e[6] = n, e[7] = l) : l = e[7];
  let c;
  return e[8] !== n.archive || e[9] !== n.delete || e[10] !== n.detach || e[11] !== n.generateTitle || e[12] !== n.initialize || e[13] !== n.rename || e[14] !== n.switchTo || e[15] !== n.unarchive || e[16] !== n.updateCustom || e[17] !== a || e[18] !== l ? (c = {
    getState: a,
    switchTo: n.switchTo,
    rename: n.rename,
    updateCustom: n.updateCustom,
    archive: n.archive,
    unarchive: n.unarchive,
    delete: n.delete,
    generateTitle: n.generateTitle,
    initialize: n.initialize,
    detach: n.detach,
    __internal_getRuntime: l
  }, e[8] = n.archive, e[9] = n.delete, e[10] = n.detach, e[11] = n.generateTitle, e[12] = n.initialize, e[13] = n.rename, e[14] = n.switchTo, e[15] = n.unarchive, e[16] = n.updateCustom, e[17] = a, e[18] = l, e[19] = c) : c = e[19], c;
}, ru = ue($g), Fg = (t) => {
  const e = R(5), { runtime: n, id: r } = t;
  let i;
  e[0] !== r || e[1] !== n ? (i = n.getItemById(r), e[0] = r, e[1] = n, e[2] = i) : i = e[2];
  const o = i;
  let s;
  return e[3] !== o ? (s = ru({ runtime: o }), e[3] = o, e[4] = s) : s = e[4], Le(s);
}, Bg = ue(Fg), Ug = (t) => {
  const e = R(40), { runtime: n, __internal_assistantRuntime: r } = t, i = Yt(n);
  let o;
  e[0] !== n.main ? (o = Og({ runtime: n.main }), e[0] = n.main, e[1] = o) : o = e[1];
  const s = rr(o);
  let a;
  e[2] !== n || e[3] !== i.threadItems ? (a = Object.keys(i.threadItems).map((y) => ot(y, Bg({
    runtime: n,
    id: y
  }), [n, y])), e[2] = n, e[3] = i.threadItems, e[4] = a) : a = e[4];
  const l = Gt(a), c = i.newThreadId ?? null;
  let d;
  e[5] !== s.state || e[6] !== i.archivedThreadIds || e[7] !== i.hasMore || e[8] !== i.isLoading || e[9] !== i.isLoadingMore || e[10] !== i.mainThreadId || e[11] !== i.threadIds || e[12] !== c || e[13] !== l.state ? (d = {
    mainThreadId: i.mainThreadId,
    newThreadId: c,
    isLoading: i.isLoading,
    isLoadingMore: i.isLoadingMore,
    hasMore: i.hasMore,
    threadIds: i.threadIds,
    archivedThreadIds: i.archivedThreadIds,
    threadItems: l.state,
    main: s.state
  }, e[5] = s.state, e[6] = i.archivedThreadIds, e[7] = i.hasMore, e[8] = i.isLoading, e[9] = i.isLoadingMore, e[10] = i.mainThreadId, e[11] = i.threadIds, e[12] = c, e[13] = l.state, e[14] = d) : d = e[14];
  const u = d;
  let h;
  e[15] !== u ? (h = () => u, e[15] = u, e[16] = h) : h = e[16];
  let p;
  e[17] !== s.methods ? (p = () => s.methods, e[17] = s.methods, e[18] = p) : p = e[18];
  let m;
  e[19] !== u || e[20] !== l ? (m = (y) => {
    if (y === "main")
      return l.get({ key: u.mainThreadId });
    if ("id" in y)
      return l.get({ key: y.id });
    const { index: M, archived: E } = y, N = E !== void 0 && E ? u.archivedThreadIds[M] : u.threadIds[M];
    return l.get({ key: N });
  }, e[19] = u, e[20] = l, e[21] = m) : m = e[21];
  let g, w, b, k, x;
  e[22] !== n ? (k = async (y, M) => {
    await n.switchToThread(y, M);
  }, x = async () => {
    await n.switchToNewThread();
  }, g = () => n.getLoadThreadsPromise(), w = () => n.reload(), b = () => n.loadMore(), e[22] = n, e[23] = g, e[24] = w, e[25] = b, e[26] = k, e[27] = x) : (g = e[23], w = e[24], b = e[25], k = e[26], x = e[27]);
  let T;
  e[28] !== r ? (T = () => r, e[28] = r, e[29] = T) : T = e[29];
  let I;
  return e[30] !== g || e[31] !== w || e[32] !== b || e[33] !== T || e[34] !== h || e[35] !== p || e[36] !== m || e[37] !== k || e[38] !== x ? (I = {
    getState: h,
    thread: p,
    item: m,
    switchToThread: k,
    switchToNewThread: x,
    getLoadThreadsPromise: g,
    reload: w,
    loadMore: b,
    __internal_getAssistantRuntime: T
  }, e[30] = g, e[31] = w, e[32] = b, e[33] = T, e[34] = h, e[35] = p, e[36] = m, e[37] = k, e[38] = x, e[39] = I) : I = e[39], I;
}, jg = ue(Ug), Vg = (t) => ({ getState: () => t }), qg = ue(Vg), Hg = (t) => {
  const e = R(11);
  let n;
  e[0] !== t ? (n = () => ({ suggestions: (t ?? []).map(Gg) }), e[0] = t, e[1] = n) : n = e[1];
  const [r] = xe(n);
  let i;
  e[2] !== r.suggestions ? (i = r.suggestions.map(Kg), e[2] = r.suggestions, e[3] = i) : i = e[3];
  const o = Gt(i);
  let s;
  e[4] !== r ? (s = () => r, e[4] = r, e[5] = s) : s = e[5];
  let a;
  e[6] !== o ? (a = (c) => {
    const { index: d } = c;
    return o.get({ index: d });
  }, e[6] = o, e[7] = a) : a = e[7];
  let l;
  return e[8] !== s || e[9] !== a ? (l = {
    getState: s,
    suggestion: a
  }, e[8] = s, e[9] = a, e[10] = l) : l = e[10], l;
}, Wg = ue(Hg);
function Gg(t) {
  return typeof t == "string" ? {
    title: t,
    label: "",
    prompt: t
  } : {
    title: t.title,
    label: t.label,
    prompt: t.prompt
  };
}
function Kg(t, e) {
  return ot(e, qg(t), [t]);
}
const Jg = (t, e) => {
  t.thread ?? (t.thread = He({
    source: "threads",
    query: { type: "main" },
    get: (n) => n.threads().thread("main")
  })), t.threadListItem ?? (t.threadListItem = He({
    source: "threads",
    query: { type: "main" },
    get: (n) => n.threads().item("main")
  })), t.composer ?? (t.composer = He({
    source: "thread",
    query: {},
    get: (n) => n.threads().thread("main").composer()
  })), !t.modelContext && e.modelContext.source === null && (t.modelContext = Bc()), !t.suggestions && e.suggestions.source === null && (t.suggestions = Wg());
}, iu = (t) => {
  const e = R(6), n = Yc();
  let r, i;
  e[0] !== n || e[1] !== t ? (r = () => t.registerModelContextProvider(n.current.modelContext()), i = [t, n], e[0] = n, e[1] = t, e[2] = r, e[3] = i) : (r = e[2], i = e[3]), Y(r, i);
  let o;
  return e[4] !== t ? (o = jg({
    runtime: t.threads,
    __internal_assistantRuntime: t
  }), e[4] = t, e[5] = o) : o = e[5], Le(o);
}, Qg = ue(iu);
Gc(iu, (t, e) => {
  Jg(t, e), !t.tools && e.tools.source === null && (t.tools = pg({})), !t.dataRenderers && e.dataRenderers.source === null && (t.dataRenderers = pf());
});
const Yg = (t) => {
  var e;
  return (e = t._core) == null ? void 0 : e.RenderComponent;
}, Xg = ke(({ runtime: t, aui: e = null, children: n }) => {
  "use no memo";
  const r = Z({ threads: Qg(t) }, { parent: e }), i = Yg(t), o = /* @__PURE__ */ j(Ge, {
    value: r,
    children: [i && /* @__PURE__ */ f(i, {}), n]
  });
  return e ? /* @__PURE__ */ f(Ge, {
    value: e,
    children: o
  }) : o;
}), Hs = (t) => {
  let e;
  const n = /* @__PURE__ */ new Set(), r = (c, d) => {
    const u = typeof c == "function" ? c(e) : c;
    if (!Object.is(u, e)) {
      const h = e;
      e = d ?? (typeof u != "object" || u === null) ? u : Object.assign({}, e, u), n.forEach((p) => p(e, h));
    }
  }, i = () => e, a = { setState: r, getState: i, getInitialState: () => l, subscribe: (c) => (n.add(c), () => n.delete(c)) }, l = e = t(r, i, a);
  return a;
}, Zg = (t) => t ? Hs(t) : Hs, eb = (t) => t;
function tb(t, e = eb) {
  const n = Ce.useSyncExternalStore(
    t.subscribe,
    Ce.useCallback(() => e(t.getState()), [t, e]),
    Ce.useCallback(() => e(t.getInitialState()), [t, e])
  );
  return Ce.useDebugValue(n), n;
}
const Ws = (t) => {
  const e = Zg(t), n = (r) => tb(e, r);
  return Object.assign(n, e), n;
}, wn = (t) => t ? Ws(t) : Ws;
function Ae(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function yn(t, e = 0) {
  return e > 100 ? !1 : t === null || typeof t == "string" || typeof t == "boolean" ? !0 : typeof t == "number" ? !Number.isNaN(t) && Number.isFinite(t) : Array.isArray(t) ? t.every((n) => yn(n, e + 1)) : Ae(t) ? Object.entries(t).every(([n, r]) => typeof n == "string" && yn(r, e + 1)) : !1;
}
const nb = 100, Ki = (t, e, n) => {
  if (t === e)
    return !0;
  if (n > nb || t == null || e == null)
    return !1;
  if (Array.isArray(t))
    return !Array.isArray(e) || t.length !== e.length ? !1 : t.every((o, s) => Ki(o, e[s], n + 1));
  if (Array.isArray(e) || !Ae(t) || !Ae(e))
    return !1;
  const r = Object.keys(t), i = Object.keys(e);
  return r.length !== i.length ? !1 : r.every((o) => Object.hasOwn(e, o) && Ki(t[o], e[o], n + 1));
}, ou = (t, e) => !yn(t) || !yn(e) ? !1 : Ki(t, e, 0);
function rb(t) {
  const e = t.metadata;
  if (!e || typeof e != "object")
    return;
  const n = e.custom;
  if (!n || typeof n != "object")
    return;
  const r = n.interactables;
  return Array.isArray(r) ? r : void 0;
}
function ib(t) {
  return `update_${t.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
const Gs = (t) => {
  if (!Ae(t))
    return;
  const e = t.id;
  return typeof e == "string" || typeof e == "number" ? e : void 0;
};
function ob(t, e, n) {
  let r = Array.isArray(e.set) ? [...e.set] : [...t];
  if (e.clear === !0 && (r = []), Array.isArray(e.remove) && e.remove.length > 0) {
    const o = new Set(e.remove);
    r = r.filter((s) => {
      const a = Gs(s);
      return a !== void 0 ? !o.has(a) : !o.has(s);
    });
  }
  const i = e.update;
  if (Array.isArray(i) && i.length > 0 && (r = r.map((o) => {
    const s = Gs(o);
    if (s === void 0 || !Ae(o))
      return o;
    const a = i.find((l) => Ae(l) && l.id === s);
    return a ? {
      ...o,
      ...a
    } : o;
  })), Array.isArray(e.add) && e.add.length > 0) {
    const o = n ? e.add.map((s) => {
      if (!Ae(s) || s.id !== void 0)
        return s;
      const a = n();
      return a === void 0 ? s : {
        ...s,
        id: a
      };
    }) : e.add;
    r = [...r, ...o];
  }
  return r;
}
function pi(t, e, n) {
  if (!Ae(t) || !Ae(e))
    return e;
  const r = Ae(n == null ? void 0 : n.arrayBaseline) ? n.arrayBaseline : t, i = { ...t };
  for (const [o, s] of Object.entries(e)) {
    const a = r[o];
    Array.isArray(a) && Ae(s) ? i[o] = ob(a, s, n != null && n.idFactory && (n.idKeyedFields === void 0 || n.idKeyedFields.has(o)) ? () => {
      var l;
      return (l = n.idFactory) == null ? void 0 : l.call(n, o);
    } : void 0) : i[o] = s;
  }
  return i;
}
function sb(t, e) {
  if (!Ae(t) || !Ae(e))
    return;
  for (const i of Object.keys(t))
    if (!(i in e))
      return;
  const n = {};
  for (const [i, o] of Object.entries(e))
    (!(i in t) || !ou(t[i], o)) && (n[i] = o);
  const r = Object.keys(n).length;
  if (!(r === 0 || r === Object.keys(e).length))
    return n;
}
const ab = (t) => {
  if (!t || typeof t != "object")
    return;
  const e = t;
  return e.type === "tool-call" ? e : void 0;
}, lb = (t, e) => {
  if (!t.args || typeof t.args != "object")
    return !1;
  const n = Ae(t.result) ? t.result : void 0;
  if ((n == null ? void 0 : n.success) === !1)
    return !1;
  if (typeof (n == null ? void 0 : n.id) == "string")
    return n.id === e;
  const r = t.args.id;
  return r === e || r === void 0;
}, cb = (t) => {
  const e = Ae(t) ? t.addedItemIds : void 0;
  if (!Ae(e))
    return;
  const n = /* @__PURE__ */ new Map();
  for (const [r, i] of Object.entries(e)) {
    if (!Array.isArray(i))
      continue;
    const o = i.filter((s) => typeof s == "string");
    o.length > 0 && n.set(r, o);
  }
  if (n.size !== 0)
    return (r) => {
      var i;
      return (i = n.get(r)) == null ? void 0 : i.shift();
    };
}, Ks = /* @__PURE__ */ new WeakMap();
function ub(t, e, n) {
  var c;
  let r = Ks.get(t);
  r || (r = /* @__PURE__ */ new Map(), Ks.set(t, r));
  let i = r.get(n);
  i || (i = /* @__PURE__ */ new Map(), r.set(n, i));
  const o = i.get(e);
  if (o)
    return o;
  const s = ib(n), a = [], l = () => a[a.length - 1];
  for (const d of t) {
    if (d.role === "user") {
      const u = (c = rb(d)) == null ? void 0 : c.find((h) => h.id === e);
      if (!u)
        continue;
      if (u.partial) {
        const h = l();
        h && a.push({
          state: pi(h.state, u.state),
          origin: "user-edit"
        });
      } else
        a.push({
          state: u.state,
          origin: "user-edit"
        });
      continue;
    }
    if (d.role === "assistant")
      for (const u of d.content ?? []) {
        const h = ab(u);
        if (h) {
          if (h.toolCallId === e && h.toolName === n)
            h.args && typeof h.args == "object" && a.push({
              state: h.args,
              origin: "create",
              toolCallId: e
            });
          else if (h.toolName === s && lb(h, e)) {
            const p = l();
            if (p) {
              const { id: m, ...g } = h.args, w = cb(h.result);
              a.push({
                state: w ? pi(p.state, g, { idFactory: w }) : pi(p.state, g),
                origin: "update",
                toolCallId: h.toolCallId
              });
            }
          }
        }
      }
  }
  return i.set(e, a), a;
}
function db(t, e, n) {
  const r = ub(t, e, n), i = r[r.length - 1];
  return i ? { state: i.state } : void 0;
}
function su(t, e) {
  if (!t)
    return;
  const { interactables: n, ...r } = t, i = { ...r };
  if (Array.isArray(n)) {
    const o = [];
    for (const s of n) {
      ({}).NODE_ENV !== "production" && !yn(s.state) && console.warn(`[Interactables] state for "${s.name}" (${s.id}) is not JSON-equatable (an undefined, NaN, Infinity, function, or symbol value?). It will be re-snapshotted on every send, recreating per-message growth. Use plain JSON values.`);
      const a = db(e, s.id, s.name);
      if (!a) {
        o.push({
          id: s.id,
          name: s.name,
          state: s.state
        });
        continue;
      }
      if (ou(s.state, a.state))
        continue;
      const l = sb(a.state, s.state);
      o.push(l ? {
        id: s.id,
        name: s.name,
        state: l,
        partial: !0
      } : {
        id: s.id,
        name: s.name,
        state: s.state
      });
    }
    o.length && (i.interactables = o);
  }
  return Object.keys(i).length ? i : void 0;
}
let au = (t, e = 21) => (n = e) => {
  let r = "", i = n | 0;
  for (; i-- > 0; )
    r += t[Math.random() * t.length | 0];
  return r;
};
const hb = au("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
function pb(t) {
  const e = ["ROOT"];
  let n = -1, r = null;
  const i = [];
  let o;
  function s() {
    o !== void 0 && (i.push(JSON.parse(`"${o}"`)), o = void 0);
  }
  function a(u, h, p) {
    switch (u) {
      case '"':
        n = h, e.pop(), e.push(p), e.push("INSIDE_STRING"), s();
        break;
      case "f":
      case "t":
      case "n":
        n = h, r = h, e.pop(), e.push(p), e.push("INSIDE_LITERAL");
        break;
      case "-":
        e.pop(), e.push(p), e.push("INSIDE_NUMBER"), s();
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        n = h, e.pop(), e.push(p), e.push("INSIDE_NUMBER"), s();
        break;
      case "{":
        n = h, e.pop(), e.push(p), e.push("INSIDE_OBJECT_START"), s();
        break;
      case "[":
        n = h, e.pop(), e.push(p), e.push("INSIDE_ARRAY_START"), s();
        break;
    }
  }
  function l(u, h) {
    switch (u) {
      case ",":
        e.pop(), e.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      case "}":
        n = h, e.pop(), o = i.pop();
        break;
    }
  }
  function c(u, h) {
    switch (u) {
      case ",":
        e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), o = (Number(o) + 1).toString();
        break;
      case "]":
        n = h, e.pop(), o = i.pop();
        break;
    }
  }
  for (let u = 0; u < t.length; u++) {
    const h = t[u];
    switch (e[e.length - 1]) {
      case "ROOT":
        a(h, u, "FINISH");
        break;
      case "INSIDE_OBJECT_START":
        switch (h) {
          case '"':
            e.pop(), e.push("INSIDE_OBJECT_KEY"), o = "";
            break;
          case "}":
            n = u, e.pop(), o = i.pop();
            break;
        }
        break;
      case "INSIDE_OBJECT_AFTER_COMMA":
        switch (h) {
          case '"':
            e.pop(), e.push("INSIDE_OBJECT_KEY"), o = "";
            break;
        }
        break;
      case "INSIDE_OBJECT_KEY":
        switch (h) {
          case '"':
            e.pop(), e.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          case "\\":
            e.push("INSIDE_STRING_ESCAPE"), o += h;
            break;
          default:
            o += h;
            break;
        }
        break;
      case "INSIDE_OBJECT_AFTER_KEY":
        switch (h) {
          case ":":
            e.pop(), e.push("INSIDE_OBJECT_BEFORE_VALUE");
            break;
        }
        break;
      case "INSIDE_OBJECT_BEFORE_VALUE":
        a(h, u, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      case "INSIDE_OBJECT_AFTER_VALUE":
        l(h, u);
        break;
      case "INSIDE_STRING":
        switch (h) {
          case '"':
            e.pop(), n = u, o = i.pop();
            break;
          case "\\":
            e.push("INSIDE_STRING_ESCAPE");
            break;
          default:
            n = u;
        }
        break;
      case "INSIDE_ARRAY_START":
        switch (h) {
          case "]":
            n = u, e.pop(), o = i.pop();
            break;
          default:
            n = u, o = "0", a(h, u, "INSIDE_ARRAY_AFTER_VALUE");
            break;
        }
        break;
      case "INSIDE_ARRAY_AFTER_VALUE":
        switch (h) {
          case ",":
            e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), o = (Number(o) + 1).toString();
            break;
          case "]":
            n = u, e.pop(), o = i.pop();
            break;
          default:
            n = u;
            break;
        }
        break;
      case "INSIDE_ARRAY_AFTER_COMMA":
        a(h, u, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      case "INSIDE_STRING_ESCAPE":
        e.pop(), e[e.length - 1] === "INSIDE_STRING" ? n = u : e[e.length - 1] === "INSIDE_OBJECT_KEY" && (o += h);
        break;
      case "INSIDE_NUMBER":
        switch (h) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            n = u;
            break;
          case "e":
          case "E":
          case "-":
          case ".":
            break;
          case ",":
            e.pop(), o = i.pop(), e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && c(h, u), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && l(h, u);
            break;
          case "}":
            e.pop(), o = i.pop(), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" && l(h, u);
            break;
          case "]":
            e.pop(), o = i.pop(), e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && c(h, u);
            break;
          default:
            e.pop(), o = i.pop();
            break;
        }
        break;
      case "INSIDE_LITERAL": {
        const p = t.substring(r, u + 1);
        !"false".startsWith(p) && !"true".startsWith(p) && !"null".startsWith(p) ? (e.pop(), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" ? l(h, u) : e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && c(h, u)) : n = u;
        break;
      }
    }
  }
  let d = t.slice(0, n + 1);
  for (let u = e.length - 1; u >= 0; u--)
    switch (e[u]) {
      case "INSIDE_STRING":
        d += '"';
        break;
      case "INSIDE_OBJECT_KEY":
      case "INSIDE_OBJECT_AFTER_KEY":
      case "INSIDE_OBJECT_AFTER_COMMA":
      case "INSIDE_OBJECT_START":
      case "INSIDE_OBJECT_BEFORE_VALUE":
      case "INSIDE_OBJECT_AFTER_VALUE":
        d += "}";
        break;
      case "INSIDE_ARRAY_START":
      case "INSIDE_ARRAY_AFTER_COMMA":
      case "INSIDE_ARRAY_AFTER_VALUE":
        d += "]";
        break;
      case "INSIDE_LITERAL": {
        const h = t.substring(r, t.length);
        "true".startsWith(h) ? d += "true".slice(h.length) : "false".startsWith(h) ? d += "false".slice(h.length) : "null".startsWith(h) && (d += "null".slice(h.length));
      }
    }
  return [d, i];
}
var Pr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Zr(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Cn = { exports: {} };
const mb = typeof Buffer < "u", Js = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/, Qs = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
function lu(t, e, n) {
  n == null && e !== null && typeof e == "object" && (n = e, e = void 0), mb && Buffer.isBuffer(t) && (t = t.toString()), t && t.charCodeAt(0) === 65279 && (t = t.slice(1));
  const r = JSON.parse(t, e);
  if (r === null || typeof r != "object")
    return r;
  const i = n && n.protoAction || "error", o = n && n.constructorAction || "error";
  if (i === "ignore" && o === "ignore")
    return r;
  if (i !== "ignore" && o !== "ignore") {
    if (Js.test(t) === !1 && Qs.test(t) === !1)
      return r;
  } else if (i !== "ignore" && o === "ignore") {
    if (Js.test(t) === !1)
      return r;
  } else if (Qs.test(t) === !1)
    return r;
  return cu(r, { protoAction: i, constructorAction: o, safe: n && n.safe });
}
function cu(t, { protoAction: e = "error", constructorAction: n = "error", safe: r } = {}) {
  let i = [t];
  for (; i.length; ) {
    const o = i;
    i = [];
    for (const s of o) {
      if (e !== "ignore" && Object.prototype.hasOwnProperty.call(s, "__proto__")) {
        if (r === !0)
          return null;
        if (e === "error")
          throw new SyntaxError("Object contains forbidden prototype property");
        delete s.__proto__;
      }
      if (n !== "ignore" && Object.prototype.hasOwnProperty.call(s, "constructor") && s.constructor !== null && typeof s.constructor == "object" && Object.prototype.hasOwnProperty.call(s.constructor, "prototype")) {
        if (r === !0)
          return null;
        if (n === "error")
          throw new SyntaxError("Object contains forbidden prototype property");
        delete s.constructor;
      }
      for (const a in s) {
        const l = s[a];
        l && typeof l == "object" && i.push(l);
      }
    }
  }
  return t;
}
function Lo(t, e, n) {
  const { stackTraceLimit: r } = Error;
  Error.stackTraceLimit = 0;
  try {
    return lu(t, e, n);
  } finally {
    Error.stackTraceLimit = r;
  }
}
function fb(t, e) {
  const { stackTraceLimit: n } = Error;
  Error.stackTraceLimit = 0;
  try {
    return lu(t, e, { safe: !0 });
  } catch {
    return;
  } finally {
    Error.stackTraceLimit = n;
  }
}
Cn.exports = Lo;
Cn.exports.default = Lo;
Cn.exports.parse = Lo;
Cn.exports.safeParse = fb;
Cn.exports.scan = cu;
var gb = Cn.exports;
const Ys = /* @__PURE__ */ Zr(gb), mi = Symbol("aui.parse-partial-json-object.meta"), uu = (t) => {
  if (t.length === 0)
    return { [mi]: {
      state: "partial",
      partialPath: []
    } };
  try {
    const e = Ys.parse(t);
    if (typeof e != "object" || e === null)
      throw new Error("argsText is expected to be an object");
    return e[mi] = {
      state: "complete",
      partialPath: []
    }, e;
  } catch {
    try {
      const [e, n] = pb(t), r = Ys.parse(e);
      if (typeof r != "object" || r === null)
        throw new Error("argsText is expected to be an object");
      return r[mi] = {
        state: "partial",
        partialPath: n
      }, r;
    } catch {
      return;
    }
  }
};
var bb = class pn {
  constructor(e = null) {
    C(this, "_state");
    this._state = e;
  }
  get state() {
    return this._state;
  }
  append(e) {
    this._state = e.reduce((n, r) => pn.apply(n, r), this._state);
  }
  static apply(e, n) {
    const r = n.type;
    switch (r) {
      case "set":
        return pn.updatePath(e, n.path, () => n.value);
      case "append-text":
        return pn.updatePath(e, n.path, (i) => {
          if (typeof i != "string")
            throw new Error(`Expected string at path [${n.path.join(", ")}]`);
          return i + n.value;
        });
      default:
        throw new Error(`Invalid operation type: ${r}`);
    }
  }
  static updatePath(e, n, r) {
    if (n.length === 0)
      return r(e);
    if (e ?? (e = {}), typeof e != "object")
      throw new Error(`Invalid path: [${n.join(", ")}]`);
    const [i, ...o] = n;
    if (Array.isArray(e)) {
      const a = Number(i);
      if (Number.isNaN(a))
        throw new Error(`Expected array index at [${n.join(", ")}]`);
      if (a > e.length || a < 0)
        throw new Error("Insert array index out of bounds");
      const l = [...e];
      return l[a] = pn.updatePath(l[a], o, r), l;
    }
    const s = { ...e };
    return s[i] = pn.updatePath(s[i], o, r), s;
  }
}, vb = class {
  constructor() {
    C(this, "_streamStartTime");
    C(this, "_firstTokenTime");
    C(this, "_totalChunks", 0);
    C(this, "_toolCallIds", /* @__PURE__ */ new Set());
    this._streamStartTime = Date.now();
  }
  recordChunk() {
    this._totalChunks++;
  }
  recordFirstToken() {
    this._firstTokenTime === void 0 && (this._firstTokenTime = Date.now());
  }
  recordToolCallStart(t) {
    this._toolCallIds.add(t);
  }
  getTiming(t, e) {
    const n = Date.now() - this._streamStartTime, r = t && t > 0 ? t : e ? Math.ceil(e.length / 4) : void 0, i = r && n > 0 ? r / n * 1e3 : void 0;
    return {
      streamStartTime: this._streamStartTime,
      ...this._firstTokenTime !== void 0 ? { firstTokenTime: this._firstTokenTime - this._streamStartTime } : void 0,
      totalStreamTime: n,
      ...r !== void 0 ? { tokenCount: r } : void 0,
      ...i !== void 0 ? { tokensPerSecond: i } : void 0,
      totalChunks: this._totalChunks,
      toolCallCount: this._toolCallIds.size
    };
  }
};
const wb = ({ unstable_state: t = null } = {}) => ({
  role: "assistant",
  status: { type: "running" },
  parts: [],
  get content() {
    return this.parts;
  },
  metadata: {
    unstable_state: t,
    unstable_data: [],
    unstable_annotations: [],
    steps: [],
    custom: {}
  }
}), ei = (t, e, n) => {
  if (t.parts.length === 0)
    throw new Error("No parts available to update.");
  if (e.path.length !== 1)
    throw new Error("Nested paths are not supported yet.");
  const r = e.path[0], i = n(t.parts[r]);
  return {
    ...t,
    parts: [
      ...t.parts.slice(0, r),
      i,
      ...t.parts.slice(r + 1)
    ],
    get content() {
      return this.parts;
    }
  };
}, yb = (t, e) => {
  const n = e.part;
  if (n.type === "text" || n.type === "reasoning") {
    const r = {
      type: n.type,
      text: "",
      status: { type: "running" },
      ...n.parentId && { parentId: n.parentId }
    };
    return {
      ...t,
      parts: [...t.parts, r],
      get content() {
        return this.parts;
      }
    };
  } else if (n.type === "tool-call") {
    const r = {
      type: "tool-call",
      state: "partial-call",
      status: {
        type: "running",
        isArgsComplete: !1
      },
      toolCallId: n.toolCallId,
      toolName: n.toolName,
      argsText: "",
      args: {},
      timing: { startedAt: Date.now() },
      ...n.parentId && { parentId: n.parentId }
    };
    return {
      ...t,
      parts: [...t.parts, r],
      get content() {
        return this.parts;
      }
    };
  } else if (n.type === "source") {
    const r = {
      type: "source",
      sourceType: n.sourceType,
      id: n.id,
      url: n.url,
      ...n.title ? { title: n.title } : void 0,
      ...n.parentId && { parentId: n.parentId }
    };
    return {
      ...t,
      parts: [...t.parts, r],
      get content() {
        return this.parts;
      }
    };
  } else if (n.type === "file") {
    const r = {
      type: "file",
      mimeType: n.mimeType,
      data: n.data,
      ...n.parentId && { parentId: n.parentId }
    };
    return {
      ...t,
      parts: [...t.parts, r],
      get content() {
        return this.parts;
      }
    };
  } else if (n.type === "data") {
    const r = {
      type: "data",
      name: n.name,
      data: n.data,
      ...n.parentId && { parentId: n.parentId }
    };
    return {
      ...t,
      parts: [...t.parts, r],
      get content() {
        return this.parts;
      }
    };
  } else
    throw new Error(`Unsupported part type: ${n.type}`);
}, xb = (t, e) => ei(t, e, (n) => {
  if (n.type !== "tool-call")
    throw new Error("Last is not a tool call");
  return n.state !== "partial-call" ? n : {
    ...n,
    state: "call"
  };
}), kb = (t, e) => ei(t, e, (n) => ({
  ...n,
  status: {
    type: "complete",
    reason: "unknown"
  }
})), _b = (t, e) => ei(t, e, (n) => {
  if (n.type === "text" || n.type === "reasoning")
    return {
      ...n,
      text: n.text + e.textDelta
    };
  if (n.type === "tool-call") {
    const r = n.argsText + e.textDelta, i = uu(r) ?? n.args;
    return {
      ...n,
      argsText: r,
      args: i
    };
  } else
    throw new Error("text-delta received but part is neither text nor tool-call");
}), Sb = (t, e) => ei(t, e, (n) => {
  if (n.type === "tool-call")
    return {
      ...n,
      state: "result",
      ...n.timing !== void 0 ? { timing: {
        ...n.timing,
        completedAt: n.timing.completedAt ?? Date.now()
      } } : {},
      ...e.artifact !== void 0 ? { artifact: e.artifact } : {},
      result: e.result,
      isError: e.isError ?? !1,
      ...e.modelContent !== void 0 ? { modelContent: e.modelContent } : {},
      ...e.messages !== void 0 ? { messages: e.messages } : {},
      status: {
        type: "complete",
        reason: "stop"
      }
    };
  throw new Error("Result chunk received but part is not a tool-call");
}), Xs = (t, e) => {
  var r, i;
  if (((r = t.status) == null ? void 0 : r.type) === "incomplete" && ((i = t.status) == null ? void 0 : i.reason) === "error")
    return t;
  const n = Cb(e);
  return {
    ...t,
    status: n
  };
}, Cb = (t) => t.finishReason === "tool-calls" ? {
  type: "requires-action",
  reason: "tool-calls"
} : t.finishReason === "stop" || t.finishReason === "unknown" ? {
  type: "complete",
  reason: t.finishReason
} : {
  type: "incomplete",
  reason: t.finishReason
}, Tb = (t, e) => ({
  ...t,
  metadata: {
    ...t.metadata,
    unstable_annotations: [...t.metadata.unstable_annotations, ...e.annotations]
  }
}), Ib = (t, e) => ({
  ...t,
  metadata: {
    ...t.metadata,
    unstable_data: [...t.metadata.unstable_data, ...e.data]
  }
}), Ab = (t, e) => ({
  ...t,
  metadata: {
    ...t.metadata,
    steps: [...t.metadata.steps, {
      state: "started",
      messageId: e.messageId
    }]
  }
}), Eb = (t, e) => {
  var i;
  const n = t.metadata.steps.slice(), r = n.length - 1;
  return n.length > 0 && ((i = n[r]) == null ? void 0 : i.state) === "started" ? n[r] = {
    ...n[r],
    state: "finished",
    finishReason: e.finishReason,
    usage: e.usage,
    isContinued: e.isContinued
  } : n.push({
    state: "finished",
    messageId: hb(),
    finishReason: e.finishReason,
    usage: e.usage,
    isContinued: e.isContinued
  }), {
    ...t,
    metadata: {
      ...t.metadata,
      steps: n
    }
  };
}, Rb = (t, e) => ({
  ...t,
  status: {
    type: "incomplete",
    reason: "error",
    error: e.error
  }
}), Mb = (t, e) => {
  const n = new bb(t.metadata.unstable_state);
  return n.append(e.operations), {
    ...t,
    metadata: {
      ...t.metadata,
      unstable_state: n.state
    }
  };
}, Zs = (t, e) => {
  let n = 0;
  for (const i of e.metadata.steps)
    i.state === "finished" && i.usage && (n += i.usage.outputTokens);
  let r = "";
  for (const i of e.parts)
    (i.type === "text" || i.type === "reasoning") && (r += i.text);
  return t.getTiming(n > 0 ? n : void 0, r || void 0);
}, Pb = (t) => {
  let e = !1;
  return () => {
    e || (e = !0, queueMicrotask(() => {
      e = !1, t();
    }));
  };
};
var Nb = class extends TransformStream {
  constructor({ initialMessage: t, throttle: e, onError: n } = {}) {
    let r = t ?? wb();
    const i = new vb();
    let o;
    const s = e ? Pb(() => {
      o == null || o.enqueue(r);
    }) : () => {
      o == null || o.enqueue(r);
    };
    super({
      start(a) {
        o = a;
      },
      transform(a) {
        i.recordChunk();
        const l = a.type;
        switch (l) {
          case "part-start":
            r = yb(r, a), a.part.type === "tool-call" && i.recordToolCallStart(a.part.toolCallId);
            break;
          case "tool-call-args-text-finish":
            r = xb(r, a);
            break;
          case "part-finish":
            r = kb(r, a);
            break;
          case "text-delta":
            r = _b(r, a), i.recordFirstToken();
            break;
          case "result":
            r = Sb(r, a);
            break;
          case "message-finish":
            r = Xs(r, a);
            break;
          case "annotations":
            r = Tb(r, a);
            break;
          case "data":
            r = Ib(r, a);
            break;
          case "step-start":
            r = Ab(r, a);
            break;
          case "step-finish":
            r = Eb(r, a);
            break;
          case "error":
            r = Rb(r, a), n == null || n(a.error);
            break;
          case "update-state":
            r = Mb(r, a);
            break;
          default:
            throw new Error(`Unsupported chunk type: ${l}`);
        }
        r.status.type !== "running" && (r = {
          ...r,
          metadata: {
            ...r.metadata,
            timing: Zs(i, r)
          }
        }), s();
      },
      flush(a) {
        var l, c;
        if (((l = r.status) == null ? void 0 : l.type) === "running") {
          const d = ((c = r.parts) == null ? void 0 : c.some((u) => u.type === "tool-call" && (u.state === "call" || u.state === "partial-call") && u.result === void 0)) ?? !1;
          r = Xs(r, {
            type: "message-finish",
            path: [],
            finishReason: d ? "tool-calls" : "unknown",
            usage: {
              inputTokens: 0,
              outputTokens: 0
            }
          }), r = {
            ...r,
            metadata: {
              ...r.metadata,
              timing: Zs(i, r)
            }
          }, a.enqueue(r);
        }
      }
    });
  }
}, Db = class Sr {
  constructor(e) {
    C(this, "readable");
    this.readable = e, this.readable = e;
  }
  static fromAssistantStream(e) {
    return new Sr(e.pipeThrough(new Nb()));
  }
  async unstable_result() {
    let e;
    for await (const n of this)
      e = n;
    return e || {
      role: "assistant",
      status: {
        type: "complete",
        reason: "unknown"
      },
      parts: [],
      content: [],
      metadata: {
        unstable_state: null,
        unstable_data: [],
        unstable_annotations: [],
        steps: [],
        custom: {}
      }
    };
  }
  [Symbol.asyncIterator]() {
    const e = this.readable.getReader();
    return { async next() {
      const { done: n, value: r } = await e.read();
      return n ? {
        done: !0,
        value: void 0
      } : {
        done: !1,
        value: r
      };
    } };
  }
  tee() {
    const [e, n] = this.readable.tee();
    return [new Sr(e), new Sr(n)];
  }
};
const ea = Symbol.for("aui.tool-response");
var Lb = class Ji {
  constructor(e) {
    C(this, "artifact");
    C(this, "result");
    C(this, "isError");
    C(this, "modelContent");
    C(this, "messages");
    e.artifact !== void 0 && (this.artifact = e.artifact), this.result = e.result, this.isError = e.isError ?? !1, e.modelContent !== void 0 && (this.modelContent = e.modelContent), e.messages !== void 0 && (this.messages = e.messages);
  }
  get [ea]() {
    return !0;
  }
  static [Symbol.hasInstance](e) {
    return typeof e == "object" && e !== null && ea in e;
  }
  /**
  * Converts a plain tool return value into a {@link ToolResponse}.
  *
  * Existing `ToolResponse` instances are returned unchanged. `undefined`
  * becomes the string `"<no result>"` so downstream protocol chunks always
  * carry a concrete result.
  */
  static toResponse(e) {
    return e instanceof Ji ? e : new Ji({ result: e === void 0 ? "<no result>" : e });
  }
};
const pt = au("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7), du = (t) => {
  const e = R(7), { index: n, children: r } = t;
  let i;
  e[0] !== n ? (i = He({
    source: "message",
    query: {
      type: "index",
      index: n
    },
    get: (l) => l.message().attachment({ index: n })
  }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { attachment: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = Z(o);
  let a;
  return e[4] !== s || e[5] !== r ? (a = /* @__PURE__ */ f(Ge, {
    value: s,
    children: r
  }), e[4] = s, e[5] = r, e[6] = a) : a = e[6], a;
}, hu = (t) => {
  const e = R(7), { index: n, children: r } = t;
  let i;
  e[0] !== n ? (i = He({
    source: "composer",
    query: {
      type: "index",
      index: n
    },
    get: (l) => l.composer().attachment({ index: n })
  }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { attachment: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = Z(o);
  let a;
  return e[4] !== s || e[5] !== r ? (a = /* @__PURE__ */ f(Ge, {
    value: s,
    children: r
  }), e[4] = s, e[5] = r, e[6] = a) : a = e[6], a;
}, zb = (t) => {
  const e = R(7), { runtime: n, children: r } = t;
  let i;
  e[0] !== n ? (i = ru({ runtime: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { threadListItem: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = Z(o);
  let a;
  return e[4] !== s || e[5] !== r ? (a = /* @__PURE__ */ f(Ge, {
    value: s,
    children: r
  }), e[4] = s, e[5] = r, e[6] = a) : a = e[6], a;
}, pu = (t) => {
  const e = R(10), { index: n, children: r } = t;
  let i;
  e[0] !== n ? (i = He({
    source: "thread",
    query: {
      type: "index",
      index: n
    },
    get: (c) => c.thread().message({ index: n })
  }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  e[2] !== n ? (o = He({
    source: "message",
    query: {},
    get: (c) => c.thread().message({ index: n }).composer()
  }), e[2] = n, e[3] = o) : o = e[3];
  let s;
  e[4] !== i || e[5] !== o ? (s = {
    message: i,
    composer: o
  }, e[4] = i, e[5] = o, e[6] = s) : s = e[6];
  const a = Z(s);
  let l;
  return e[7] !== a || e[8] !== r ? (l = /* @__PURE__ */ f(Ge, {
    value: a,
    children: r
  }), e[7] = a, e[8] = r, e[9] = l) : l = e[9], l;
}, zo = (t) => {
  const e = R(7), { index: n, children: r } = t;
  let i;
  e[0] !== n ? (i = He({
    source: "message",
    query: {
      type: "index",
      index: n
    },
    get: (l) => l.message().part({ index: n })
  }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { part: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = Z(o);
  let a;
  return e[4] !== s || e[5] !== r ? (a = /* @__PURE__ */ f(Ge, {
    value: s,
    children: r
  }), e[4] = s, e[5] = r, e[6] = a) : a = e[6], a;
}, Ob = (t) => {
  const e = R(7), { text: n, isRunning: r } = t;
  let i;
  e[0] !== r ? (i = r ? { type: "running" } : { type: "complete" }, e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== i || e[3] !== n ? (o = {
    type: "text",
    text: n,
    status: i
  }, e[2] = i, e[3] = n, e[4] = o) : o = e[4];
  const s = o;
  let a;
  return e[5] !== s ? (a = {
    getState: () => s,
    addToolResult: Fb,
    resumeToolCall: Bb,
    respondToToolApproval: Ub
  }, e[5] = s, e[6] = a) : a = e[6], a;
}, $b = ue(Ob), Oo = (t) => {
  const e = R(8), { text: n, isRunning: r, children: i } = t, o = r === void 0 ? !1 : r;
  let s;
  e[0] !== o || e[1] !== n ? (s = $b({
    text: n,
    isRunning: o
  }), e[0] = o, e[1] = n, e[2] = s) : s = e[2];
  let a;
  e[3] !== s ? (a = { part: s }, e[3] = s, e[4] = a) : a = e[4];
  const l = Z(a);
  let c;
  return e[5] !== l || e[6] !== i ? (c = /* @__PURE__ */ f(Ge, {
    value: l,
    children: i
  }), e[5] = l, e[6] = i, e[7] = c) : c = e[7], c;
};
function Fb() {
  throw new Error("Not supported");
}
function Bb() {
  throw new Error("Not supported");
}
function Ub() {
  throw new Error("Not supported");
}
const jb = Object.freeze({ type: "complete" }), Vb = (t) => {
  var u;
  const e = R(9), { parts: n, getMessagePart: r } = t, [i, o] = xe(!0), s = ((u = n[n.length - 1]) == null ? void 0 : u.status) ?? jb;
  let a;
  e[0] !== i || e[1] !== n || e[2] !== s ? (a = {
    parts: n,
    collapsed: i,
    status: s
  }, e[0] = i, e[1] = n, e[2] = s, e[3] = a) : a = e[3];
  const l = a;
  let c;
  e[4] !== l ? (c = () => l, e[4] = l, e[5] = c) : c = e[5];
  let d;
  return e[6] !== r || e[7] !== c ? (d = {
    getState: c,
    setCollapsed: o,
    part: r
  }, e[6] = r, e[7] = c, e[8] = d) : d = e[8], d;
}, qb = ue(Vb), Hb = (t) => {
  const e = R(5), { startIndex: n, endIndex: r, children: i } = t, o = $(Wb).slice(n, r + 1), s = Z(), a = qb({
    parts: o,
    getMessagePart: (u) => {
      const { index: h } = u;
      if (h < 0 || h >= o.length)
        throw new Error(`ChainOfThought part index ${h} is out of bounds (0..${o.length - 1})`);
      return s.message().part({ index: n + h });
    }
  });
  let l;
  e[0] !== a ? (l = { chainOfThought: a }, e[0] = a, e[1] = l) : l = e[1];
  const c = Z(l);
  let d;
  return e[2] !== c || e[3] !== i ? (d = /* @__PURE__ */ f(Ge, {
    value: c,
    children: i
  }), e[2] = c, e[3] = i, e[4] = d) : d = e[4], d;
};
function Wb(t) {
  return t.message.parts;
}
const mu = (t) => {
  const e = R(7), { index: n, children: r } = t;
  let i;
  e[0] !== n ? (i = He({
    source: "suggestions",
    query: { index: n },
    get: (l) => l.suggestions().suggestion({ index: n })
  }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { suggestion: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = Z(o);
  let a;
  return e[4] !== s || e[5] !== r ? (a = /* @__PURE__ */ f(Ge, {
    value: s,
    children: r
  }), e[4] = s, e[5] = r, e[6] = a) : a = e[6], a;
}, Gb = (t) => {
  const e = R(7), { index: n, children: r } = t;
  let i;
  e[0] !== n ? (i = He({
    source: "composer",
    query: { index: n },
    get: (l) => l.composer().queueItem({ index: n })
  }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { queueItem: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = Z(o);
  let a;
  return e[4] !== s || e[5] !== r ? (a = /* @__PURE__ */ f(Ge, {
    value: s,
    children: r
  }), e[4] = s, e[5] = r, e[6] = a) : a = e[6], a;
}, Nr = Symbol("innerMessage"), st = Symbol("skip-update");
function Kb(t, e) {
  if (t === void 0 && e === void 0)
    return !0;
  if (t === void 0 || e === void 0)
    return !1;
  for (const n of Object.keys(t)) {
    const r = t[n], i = e[n];
    if (!Object.is(r, i))
      return !1;
  }
  return !0;
}
var ir = class {
  constructor() {
    C(this, "_subscribers", /* @__PURE__ */ new Set());
  }
  subscribe(t) {
    return this._subscribers.add(t), () => this._subscribers.delete(t);
  }
  waitForUpdate() {
    return new Promise((t) => {
      const e = this.subscribe(() => {
        e(), t();
      });
    });
  }
  _notifySubscribers() {
    const t = [];
    for (const e of this._subscribers)
      try {
        e();
      } catch (n) {
        t.push(n);
      }
    if (t.length > 0) {
      if (t.length === 1)
        throw t[0];
      for (const e of t)
        console.error(e);
      throw new AggregateError(t);
    }
  }
}, ti = class {
  constructor() {
    C(this, "_subscriptions", /* @__PURE__ */ new Set());
    C(this, "_connection");
  }
  get isConnected() {
    return !!this._connection;
  }
  notifySubscribers(t) {
    for (const e of this._subscriptions)
      e(t);
  }
  _updateConnection() {
    var t;
    if (this._subscriptions.size > 0) {
      if (this._connection)
        return;
      this._connection = this._connect();
    } else
      (t = this._connection) == null || t.call(this), this._connection = void 0;
  }
  subscribe(t) {
    return this._subscriptions.add(t), this._updateConnection(), () => {
      this._subscriptions.delete(t), this._updateConnection();
    };
  }
}, nt = class extends ti {
  constructor(e) {
    super();
    C(this, "binding");
    C(this, "_previousState");
    C(this, "getState", () => (this.isConnected || this._syncState(), this._previousState));
    this.binding = e;
    const n = e.getState();
    if (n === st)
      throw new Error("Entry not available in the store");
    this._previousState = n;
  }
  get path() {
    return this.binding.path;
  }
  _syncState() {
    const e = this.binding.getState();
    return e === st || Kb(e, this._previousState) ? !1 : (this._previousState = e, !0);
  }
  _connect() {
    const e = () => {
      this._syncState() && this.notifySubscribers();
    };
    return this.binding.subscribe(e);
  }
}, $o = class extends ti {
  constructor(e) {
    super();
    C(this, "binding");
    C(this, "_previousStateDirty", !0);
    C(this, "_previousState");
    C(this, "getState", () => {
      if (!this.isConnected || this._previousStateDirty) {
        const e = this.binding.getState();
        e !== st && (this._previousState = e), this._previousStateDirty = !1;
      }
      if (this._previousState === void 0)
        throw new Error("Entry not available in the store");
      return this._previousState;
    });
    this.binding = e;
  }
  get path() {
    return this.binding.path;
  }
  _connect() {
    const e = () => {
      this._previousStateDirty = !0, this.notifySubscribers();
    };
    return this.binding.subscribe(e);
  }
}, Dr = class extends ti {
  constructor(e) {
    super();
    C(this, "binding");
    this.binding = e;
  }
  get path() {
    return this.binding.path;
  }
  getState() {
    return this.binding.getState();
  }
  outerSubscribe(e) {
    return this.binding.subscribe(e);
  }
  _connect() {
    const e = () => {
      this.notifySubscribers();
    };
    let n = this.binding.getState(), r = n == null ? void 0 : n.subscribe(e);
    const i = () => {
      const s = this.binding.getState();
      s !== n && (n = s, r == null || r(), r = s == null ? void 0 : s.subscribe(e), e());
    }, o = this.outerSubscribe(i);
    return () => {
      o == null || o(), r == null || r();
    };
  }
}, fu = class extends ti {
  constructor(e) {
    super();
    C(this, "config");
    this.config = e;
  }
  getState() {
    return this.config.binding.getState();
  }
  outerSubscribe(e) {
    return this.config.binding.subscribe(e);
  }
  _connect() {
    const e = (s) => {
      this.notifySubscribers(s);
    };
    let n = this.config.binding.getState(), r = n == null ? void 0 : n.unstable_on(this.config.event, e);
    const i = () => {
      const s = this.config.binding.getState();
      s !== n && (n = s, r == null || r(), r = s == null ? void 0 : s.unstable_on(this.config.event, e));
    }, o = this.outerSubscribe(i);
    return () => {
      o == null || o(), r == null || r();
    };
  }
}, gu = class {
  constructor(t) {
    C(this, "_core");
    this._core = t, this.__internal_bindMethods();
  }
  get path() {
    return this._core.path;
  }
  __internal_bindMethods() {
    this.getState = this.getState.bind(this), this.remove = this.remove.bind(this), this.subscribe = this.subscribe.bind(this);
  }
  getState() {
    return this._core.getState();
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
}, bu = class extends gu {
  constructor(e, n) {
    super(e);
    C(this, "_composerApi");
    this._composerApi = n;
  }
  remove() {
    const e = this._composerApi.getState();
    if (!e)
      throw new Error("Composer is not available");
    return e.removeAttachment(this.getState().id);
  }
}, Jb = class extends bu {
  get source() {
    return "thread-composer";
  }
}, Qb = class extends bu {
  get source() {
    return "edit-composer";
  }
}, Yb = class extends gu {
  get source() {
    return "message";
  }
  remove() {
    throw new Error("Message attachments cannot be removed");
  }
};
const Lr = Object.freeze([]), vu = Object.freeze({}), Xb = (t) => Object.freeze({
  type: "thread",
  isEditing: (t == null ? void 0 : t.isEditing) ?? !1,
  canCancel: (t == null ? void 0 : t.canCancel) ?? !1,
  canSend: (t == null ? void 0 : t.canSend) ?? !1,
  isEmpty: (t == null ? void 0 : t.isEmpty) ?? !0,
  attachments: (t == null ? void 0 : t.attachments) ?? Lr,
  text: (t == null ? void 0 : t.text) ?? "",
  role: (t == null ? void 0 : t.role) ?? "user",
  runConfig: (t == null ? void 0 : t.runConfig) ?? vu,
  attachmentAccept: (t == null ? void 0 : t.attachmentAccept) ?? "",
  dictation: t == null ? void 0 : t.dictation,
  quote: t == null ? void 0 : t.quote,
  queue: (t == null ? void 0 : t.queue) ?? Lr,
  value: (t == null ? void 0 : t.text) ?? ""
}), Zb = (t) => Object.freeze({
  type: "edit",
  isEditing: (t == null ? void 0 : t.isEditing) ?? !1,
  canCancel: (t == null ? void 0 : t.canCancel) ?? !1,
  canSend: (t == null ? void 0 : t.canSend) ?? !1,
  isEmpty: (t == null ? void 0 : t.isEmpty) ?? !0,
  text: (t == null ? void 0 : t.text) ?? "",
  role: (t == null ? void 0 : t.role) ?? "user",
  attachments: (t == null ? void 0 : t.attachments) ?? Lr,
  runConfig: (t == null ? void 0 : t.runConfig) ?? vu,
  attachmentAccept: (t == null ? void 0 : t.attachmentAccept) ?? "",
  dictation: t == null ? void 0 : t.dictation,
  quote: t == null ? void 0 : t.quote,
  queue: (t == null ? void 0 : t.queue) ?? Lr,
  parentId: (t == null ? void 0 : t.parentId) ?? null,
  sourceId: (t == null ? void 0 : t.sourceId) ?? null,
  value: (t == null ? void 0 : t.text) ?? ""
});
var wu = class {
  constructor(t) {
    C(this, "_core");
    C(this, "_eventSubscriptionSubjects", /* @__PURE__ */ new Map());
    this._core = t;
  }
  get path() {
    return this._core.path;
  }
  __internal_bindMethods() {
    this.setText = this.setText.bind(this), this.setRunConfig = this.setRunConfig.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.addAttachment = this.addAttachment.bind(this), this.reset = this.reset.bind(this), this.clearAttachments = this.clearAttachments.bind(this), this.send = this.send.bind(this), this.cancel = this.cancel.bind(this), this.steerQueueItem = this.steerQueueItem.bind(this), this.removeQueueItem = this.removeQueueItem.bind(this), this.setRole = this.setRole.bind(this), this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this), this.startDictation = this.startDictation.bind(this), this.stopDictation = this.stopDictation.bind(this), this.setQuote = this.setQuote.bind(this), this.unstable_on = this.unstable_on.bind(this);
  }
  setText(t) {
    const e = this._core.getState();
    if (!e)
      throw new Error("Composer is not available");
    e.setText(t);
  }
  setRunConfig(t) {
    const e = this._core.getState();
    if (!e)
      throw new Error("Composer is not available");
    e.setRunConfig(t);
  }
  addAttachment(t) {
    const e = this._core.getState();
    if (!e)
      throw new Error("Composer is not available");
    return e.addAttachment(t);
  }
  reset() {
    const t = this._core.getState();
    if (!t)
      throw new Error("Composer is not available");
    return t.reset();
  }
  clearAttachments() {
    const t = this._core.getState();
    if (!t)
      throw new Error("Composer is not available");
    return t.clearAttachments();
  }
  send(t) {
    const e = this._core.getState();
    if (!e)
      throw new Error("Composer is not available");
    e.send(t);
  }
  cancel() {
    const t = this._core.getState();
    if (!t)
      throw new Error("Composer is not available");
    t.cancel();
  }
  steerQueueItem(t) {
    const e = this._core.getState();
    if (!e)
      throw new Error("Composer is not available");
    e.steerQueueItem(t);
  }
  removeQueueItem(t) {
    const e = this._core.getState();
    if (!e)
      throw new Error("Composer is not available");
    e.removeQueueItem(t);
  }
  setRole(t) {
    const e = this._core.getState();
    if (!e)
      throw new Error("Composer is not available");
    e.setRole(t);
  }
  startDictation() {
    const t = this._core.getState();
    if (!t)
      throw new Error("Composer is not available");
    t.startDictation();
  }
  stopDictation() {
    const t = this._core.getState();
    if (!t)
      throw new Error("Composer is not available");
    t.stopDictation();
  }
  setQuote(t) {
    const e = this._core.getState();
    if (!e)
      throw new Error("Composer is not available");
    e.setQuote(t);
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  unstable_on(t, e) {
    let n = this._eventSubscriptionSubjects.get(t);
    return n || (n = new fu({
      event: t,
      binding: this._core
    }), this._eventSubscriptionSubjects.set(t, n)), n.subscribe(e);
  }
}, ev = class extends wu {
  constructor(e) {
    const n = new $o({
      path: e.path,
      getState: () => Xb(e.getState()),
      subscribe: (r) => e.subscribe(r)
    });
    super({
      path: e.path,
      getState: () => e.getState(),
      subscribe: (r) => n.subscribe(r)
    });
    C(this, "_getState");
    this._getState = n.getState.bind(n), this.__internal_bindMethods();
  }
  get path() {
    return this._core.path;
  }
  get type() {
    return "thread";
  }
  getState() {
    return this._getState();
  }
  getAttachmentByIndex(e) {
    return new Jb(new nt({
      path: {
        ...this.path,
        attachmentSource: "thread-composer",
        attachmentSelector: {
          type: "index",
          index: e
        },
        ref: `${this.path.ref}.attachments[${e}]`
      },
      getState: () => {
        const n = this.getState().attachments[e];
        return n ? {
          ...n,
          source: "thread-composer"
        } : st;
      },
      subscribe: (n) => this._core.subscribe(n)
    }), this._core);
  }
}, tv = class extends wu {
  constructor(e, n) {
    const r = new $o({
      path: e.path,
      getState: () => Zb(e.getState()),
      subscribe: (i) => e.subscribe(i)
    });
    super({
      path: e.path,
      getState: () => e.getState(),
      subscribe: (i) => r.subscribe(i)
    });
    C(this, "_beginEdit");
    C(this, "_getState");
    this._beginEdit = n, this._getState = r.getState.bind(r), this.__internal_bindMethods();
  }
  get path() {
    return this._core.path;
  }
  get type() {
    return "edit";
  }
  __internal_bindMethods() {
    super.__internal_bindMethods(), this.beginEdit = this.beginEdit.bind(this);
  }
  getState() {
    return this._getState();
  }
  beginEdit() {
    this._beginEdit();
  }
  getAttachmentByIndex(e) {
    return new Qb(new nt({
      path: {
        ...this.path,
        attachmentSource: "edit-composer",
        attachmentSelector: {
          type: "index",
          index: e
        },
        ref: `${this.path.ref}.attachments[${e}]`
      },
      getState: () => {
        const n = this.getState().attachments[e];
        return n ? {
          ...n,
          source: "edit-composer"
        } : st;
      },
      subscribe: (n) => this._core.subscribe(n)
    }), this._core);
  }
};
const Kn = (t) => t.content.filter((e) => e.type === "text").map((e) => e.text).join(`

`), ta = {
  "allow-once": !0,
  "allow-always": !0,
  "reject-once": !1,
  "reject-always": !1
}, nv = (t, e) => {
  var i;
  let n, r;
  if ("optionId" in e) {
    const o = (i = t.options) == null ? void 0 : i.find((s) => s.id === e.optionId);
    if (!o)
      throw new Error(`Tool approval has no option with id "${e.optionId}"`);
    if ("approved" in e)
      n = e.approved;
    else {
      if (!Object.hasOwn(ta, o.kind))
        throw new Error(`Tool approval option "${o.id}" has a custom kind "${o.kind}"; respond with an explicit approved value instead`);
      n = ta[o.kind];
    }
    r = o.id;
  } else
    n = e.approved;
  return {
    approvalId: t.id,
    approved: n,
    ...r !== void 0 && { optionId: r },
    ...e.reason != null && { reason: e.reason }
  };
};
var na = class {
  constructor(t, e, n) {
    C(this, "contentBinding");
    C(this, "messageApi");
    C(this, "threadApi");
    this.contentBinding = t, this.messageApi = e, this.threadApi = n, this.__internal_bindMethods();
  }
  get path() {
    return this.contentBinding.path;
  }
  __internal_bindMethods() {
    this.addToolResult = this.addToolResult.bind(this), this.resumeToolCall = this.resumeToolCall.bind(this), this.respondToToolApproval = this.respondToToolApproval.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this);
  }
  getState() {
    return this.contentBinding.getState();
  }
  addToolResult(t) {
    const e = this.contentBinding.getState();
    if (!e)
      throw new Error("Message part is not available");
    if (e.type !== "tool-call")
      throw new Error("Tried to add tool result to non-tool message part");
    if (!this.messageApi)
      throw new Error("Message API is not available. This is likely a bug in assistant-ui.");
    if (!this.threadApi)
      throw new Error("Thread API is not available");
    const n = this.messageApi.getState();
    if (!n)
      throw new Error("Message is not available");
    const r = e.toolName, i = e.toolCallId, o = Lb.toResponse(t);
    this.threadApi.getState().addToolResult({
      messageId: n.id,
      toolName: r,
      toolCallId: i,
      result: o.result,
      artifact: o.artifact,
      isError: o.isError
    });
  }
  resumeToolCall(t) {
    const e = this.contentBinding.getState();
    if (!e)
      throw new Error("Message part is not available");
    if (e.type !== "tool-call")
      throw new Error("Tried to resume tool call on non-tool message part");
    if (!this.threadApi)
      throw new Error("Thread API is not available");
    const n = e.toolCallId;
    this.threadApi.getState().resumeToolCall({
      toolCallId: n,
      payload: t
    });
  }
  respondToToolApproval(t) {
    const e = this.contentBinding.getState();
    if (!e)
      throw new Error("Message part is not available");
    if (e.type !== "tool-call")
      throw new Error("Tried to respond to tool approval on non-tool message part");
    if (!e.approval || e.approval.approved !== void 0 || e.approval.resolution !== void 0)
      throw new Error("Tool call has no pending approval");
    if (!this.threadApi)
      throw new Error("Thread API is not available");
    this.threadApi.getState().respondToToolApproval(nv(e.approval, t));
  }
  subscribe(t) {
    return this.contentBinding.subscribe(t);
  }
};
const dr = Object.freeze({ type: "complete" }), rv = (t, e, n) => {
  if (t.role !== "assistant")
    return dr;
  if (n.type === "tool-call")
    return n.result ? dr : t.status;
  const r = e === Math.max(0, t.content.length - 1);
  return t.status.type === "requires-action" ? dr : r ? t.status : dr;
}, ra = (t, e) => {
  const n = t.content[e];
  if (!n)
    return st;
  const r = rv(t, e, n);
  return Object.freeze({
    ...n,
    [Nr]: n[Nr],
    status: r
  });
};
var iv = class {
  constructor(t, e) {
    C(this, "_core");
    C(this, "_threadBinding");
    C(this, "composer");
    C(this, "_getEditComposerRuntimeCore", () => this._threadBinding.getState().getEditComposer(this._core.getState().id));
    this._core = t, this._threadBinding = e, this.composer = new tv(new Dr({
      path: {
        ...this.path,
        ref: `${this.path.ref}${this.path.ref}.composer`,
        composerSource: "edit"
      },
      getState: this._getEditComposerRuntimeCore,
      subscribe: (n) => this._threadBinding.subscribe(n)
    }), () => this._threadBinding.getState().beginEdit(this._core.getState().id)), this.__internal_bindMethods();
  }
  get path() {
    return this._core.path;
  }
  __internal_bindMethods() {
    this.reload = this.reload.bind(this), this.delete = this.delete.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.getMessagePartByIndex = this.getMessagePartByIndex.bind(this), this.getMessagePartByToolCallId = this.getMessagePartByToolCallId.bind(this), this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this), this.unstable_getCopyText = this.unstable_getCopyText.bind(this), this.speak = this.speak.bind(this), this.stopSpeaking = this.stopSpeaking.bind(this), this.submitFeedback = this.submitFeedback.bind(this), this.switchToBranch = this.switchToBranch.bind(this);
  }
  getState() {
    return this._core.getState();
  }
  delete() {
    const t = this._core.getState();
    return this._threadBinding.getState().deleteMessage(t.id);
  }
  reload(t = {}) {
    const e = this._getEditComposerRuntimeCore(), n = e ?? this._threadBinding.getState().composer, r = e ?? n, { runConfig: i = r.runConfig } = t, o = this._core.getState();
    if (o.role !== "assistant")
      throw new Error("Can only reload assistant messages");
    this._threadBinding.getState().startRun({
      parentId: o.parentId,
      sourceId: o.id,
      runConfig: i
    });
  }
  speak() {
    const t = this._core.getState();
    return this._threadBinding.getState().speak(t.id);
  }
  stopSpeaking() {
    var e;
    const t = this._core.getState();
    if (((e = this._threadBinding.getState().speech) == null ? void 0 : e.messageId) === t.id)
      this._threadBinding.getState().stopSpeaking();
    else
      throw new Error("Message is not being spoken");
  }
  submitFeedback({ type: t }) {
    const e = this._core.getState();
    this._threadBinding.getState().submitFeedback({
      messageId: e.id,
      type: t
    });
  }
  switchToBranch({ position: t, branchId: e }) {
    const n = this._core.getState();
    if (e && t)
      throw new Error("May not specify both branchId and position");
    if (!e && !t)
      throw new Error("Must specify either branchId or position");
    const r = this._threadBinding.getState().getBranches(n.id);
    let i = e;
    if (t === "previous" ? i = r[n.branchNumber - 2] : t === "next" && (i = r[n.branchNumber]), !i)
      throw new Error("Branch not found");
    this._threadBinding.getState().switchToBranch(i);
  }
  unstable_getCopyText() {
    return Kn(this.getState());
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  getMessagePartByIndex(t) {
    if (t < 0)
      throw new Error("Message part index must be >= 0");
    return new na(new nt({
      path: {
        ...this.path,
        ref: `${this.path.ref}${this.path.ref}.content[${t}]`,
        messagePartSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => ra(this.getState(), t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getMessagePartByToolCallId(t) {
    return new na(new nt({
      path: {
        ...this.path,
        ref: this.path.ref + `${this.path.ref}.content[toolCallId=${JSON.stringify(t)}]`,
        messagePartSelector: {
          type: "toolCallId",
          toolCallId: t
        }
      },
      getState: () => {
        const e = this._core.getState(), n = e.content.findIndex((r) => r.type === "tool-call" && r.toolCallId === t);
        return n === -1 ? st : ra(e, n);
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getAttachmentByIndex(t) {
    return new Yb(new nt({
      path: {
        ...this.path,
        ref: `${this.path.ref}${this.path.ref}.attachments[${t}]`,
        attachmentSource: "message",
        attachmentSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => {
        var n;
        const e = (n = this.getState().attachments) == null ? void 0 : n[t];
        return e ? {
          ...e,
          source: "message"
        } : st;
      },
      subscribe: (e) => this._core.subscribe(e)
    }));
  }
};
const ov = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {},
  ...t.stream ? { stream: t.stream } : {}
}), sv = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {}
}), av = (t, e) => {
  var n, r;
  return typeof e == "string" ? {
    createdAt: /* @__PURE__ */ new Date(),
    parentId: ((n = t.at(-1)) == null ? void 0 : n.id) ?? null,
    sourceId: null,
    runConfig: {},
    role: "user",
    content: [{
      type: "text",
      text: e
    }],
    attachments: [],
    metadata: { custom: {} }
  } : {
    createdAt: e.createdAt ?? /* @__PURE__ */ new Date(),
    parentId: e.parentId ?? ((r = t.at(-1)) == null ? void 0 : r.id) ?? null,
    sourceId: e.sourceId ?? null,
    role: e.role ?? "user",
    content: e.content,
    attachments: e.attachments ?? [],
    metadata: e.metadata ?? { custom: {} },
    runConfig: e.runConfig ?? {},
    startRun: e.startRun
  };
}, lv = (t, e) => {
  const n = t.messages.at(-1);
  return Object.freeze({
    threadId: e.id,
    metadata: e,
    capabilities: t.capabilities,
    isDisabled: t.isDisabled,
    isLoading: t.isLoading,
    isRunning: t.isRunning ?? ((n == null ? void 0 : n.role) !== "assistant" ? !1 : n.status.type === "running"),
    messages: t.messages,
    state: t.state,
    suggestions: t.suggestions,
    extras: t.extras,
    speech: t.speech,
    voice: t.voice
  });
};
var yu = class {
  constructor(t, e) {
    C(this, "_threadBinding");
    C(this, "composer");
    C(this, "_eventSubscriptionSubjects", /* @__PURE__ */ new Map());
    const n = new nt({
      path: t.path,
      getState: () => lv(t.getState(), e.getState()),
      subscribe: (r) => {
        const i = t.subscribe(r), o = e.subscribe(r);
        return () => {
          i(), o();
        };
      }
    });
    this._threadBinding = {
      path: t.path,
      getState: () => t.getState(),
      getStateState: () => n.getState(),
      outerSubscribe: (r) => t.outerSubscribe(r),
      subscribe: (r) => t.subscribe(r)
    }, this.composer = new ev(new Dr({
      path: {
        ...this.path,
        ref: `${this.path.ref}.composer`,
        composerSource: "thread"
      },
      getState: () => this._threadBinding.getState().composer,
      subscribe: (r) => this._threadBinding.subscribe(r)
    })), this.__internal_bindMethods();
  }
  get path() {
    return this._threadBinding.path;
  }
  get __internal_threadBinding() {
    return this._threadBinding;
  }
  __internal_bindMethods() {
    this.append = this.append.bind(this), this.deleteMessage = this.deleteMessage.bind(this), this.resumeRun = this.resumeRun.bind(this), this.importExternalState = this.importExternalState.bind(this), this.exportExternalState = this.exportExternalState.bind(this), this.startRun = this.startRun.bind(this), this.cancelRun = this.cancelRun.bind(this), this.stopSpeaking = this.stopSpeaking.bind(this), this.connectVoice = this.connectVoice.bind(this), this.disconnectVoice = this.disconnectVoice.bind(this), this.muteVoice = this.muteVoice.bind(this), this.unmuteVoice = this.unmuteVoice.bind(this), this.getVoiceVolume = this.getVoiceVolume.bind(this), this.subscribeVoiceVolume = this.subscribeVoiceVolume.bind(this), this.export = this.export.bind(this), this.import = this.import.bind(this), this.reset = this.reset.bind(this), this.getMessageByIndex = this.getMessageByIndex.bind(this), this.getMessageById = this.getMessageById.bind(this), this.subscribe = this.subscribe.bind(this), this.unstable_on = this.unstable_on.bind(this), this.getModelContext = this.getModelContext.bind(this), this.getState = this.getState.bind(this);
  }
  getState() {
    return this._threadBinding.getStateState();
  }
  append(t) {
    this._threadBinding.getState().append(av(this._threadBinding.getState().messages, t));
  }
  deleteMessage(t) {
    return this._threadBinding.getState().deleteMessage(t);
  }
  subscribe(t) {
    return this._threadBinding.subscribe(t);
  }
  getModelContext() {
    return this._threadBinding.getState().getModelContext();
  }
  startRun(t) {
    return this._threadBinding.getState().startRun(sv(t));
  }
  resumeRun(t) {
    return this._threadBinding.getState().resumeRun(ov(t));
  }
  exportExternalState() {
    return this._threadBinding.getState().exportExternalState();
  }
  importExternalState(t) {
    this._threadBinding.getState().importExternalState(t);
  }
  cancelRun() {
    this._threadBinding.getState().cancelRun();
  }
  stopSpeaking() {
    return this._threadBinding.getState().stopSpeaking();
  }
  connectVoice() {
    this._threadBinding.getState().connectVoice();
  }
  disconnectVoice() {
    this._threadBinding.getState().disconnectVoice();
  }
  getVoiceVolume() {
    return this._threadBinding.getState().getVoiceVolume();
  }
  subscribeVoiceVolume(t) {
    return this._threadBinding.getState().subscribeVoiceVolume(t);
  }
  muteVoice() {
    this._threadBinding.getState().muteVoice();
  }
  unmuteVoice() {
    this._threadBinding.getState().unmuteVoice();
  }
  export() {
    return this._threadBinding.getState().export();
  }
  import(t) {
    this._threadBinding.getState().import(t);
  }
  reset(t) {
    this._threadBinding.getState().reset(t);
  }
  getMessageByIndex(t) {
    if (t < 0)
      throw new Error("Message index must be >= 0");
    return this._getMessageRuntime({
      ...this.path,
      ref: `${this.path.ref}.messages[${t}]`,
      messageSelector: {
        type: "index",
        index: t
      }
    }, () => {
      var r;
      const e = this._threadBinding.getState().messages, n = e[t];
      if (n)
        return {
          message: n,
          parentId: ((r = e[t - 1]) == null ? void 0 : r.id) ?? null,
          index: t
        };
    });
  }
  getMessageById(t) {
    return this._getMessageRuntime({
      ...this.path,
      ref: `${this.path.ref}.messages[messageId=${JSON.stringify(t)}]`,
      messageSelector: {
        type: "messageId",
        messageId: t
      }
    }, () => this._threadBinding.getState().getMessageById(t));
  }
  _getMessageRuntime(t, e) {
    return new iv(new nt({
      path: t,
      getState: () => {
        var l;
        const { message: n, parentId: r, index: i } = e() ?? {}, { messages: o, speech: s } = this._threadBinding.getState();
        if (!n || r === void 0 || i === void 0)
          return st;
        const a = this._threadBinding.getState().getBranches(n.id);
        return {
          ...n,
          [Nr]: n[Nr],
          index: i,
          isLast: ((l = o.at(-1)) == null ? void 0 : l.id) === n.id,
          parentId: r,
          branchNumber: a.indexOf(n.id) + 1,
          branchCount: a.length,
          speech: (s == null ? void 0 : s.messageId) === n.id ? s : void 0
        };
      },
      subscribe: (n) => this._threadBinding.subscribe(n)
    }), this._threadBinding);
  }
  unstable_on(t, e) {
    let n = this._eventSubscriptionSubjects.get(t);
    return n || (n = new fu({
      event: t,
      binding: this._threadBinding
    }), this._eventSubscriptionSubjects.set(t, n)), n.subscribe(e);
  }
};
const Qi = Ye(null), xu = (t) => {
  const e = R(6), { adapters: n, children: r } = t, i = Xe(Qi);
  let o;
  e[0] !== n || e[1] !== i ? (o = {
    ...i,
    ...n
  }, e[0] = n, e[1] = i, e[2] = o) : o = e[2];
  const s = o;
  let a;
  return e[3] !== r || e[4] !== s ? (a = /* @__PURE__ */ f(Qi.Provider, {
    value: s,
    children: r
  }), e[3] = r, e[4] = s, e[5] = a) : a = e[5], a;
}, cv = () => Xe(Qi);
var hr = class {
  constructor(t, e) {
    C(this, "_core");
    C(this, "_threadListBinding");
    this._core = t, this._threadListBinding = e, this.__internal_bindMethods();
  }
  get path() {
    return this._core.path;
  }
  __internal_bindMethods() {
    this.switchTo = this.switchTo.bind(this), this.rename = this.rename.bind(this), this.updateCustom = this.updateCustom.bind(this), this.archive = this.archive.bind(this), this.unarchive = this.unarchive.bind(this), this.delete = this.delete.bind(this), this.initialize = this.initialize.bind(this), this.generateTitle = this.generateTitle.bind(this), this.subscribe = this.subscribe.bind(this), this.unstable_on = this.unstable_on.bind(this), this.getState = this.getState.bind(this), this.detach = this.detach.bind(this);
  }
  getState() {
    return this._core.getState();
  }
  switchTo(t) {
    const e = this._core.getState();
    return this._threadListBinding.switchToThread(e.id, t);
  }
  rename(t) {
    const e = this._core.getState();
    return this._threadListBinding.rename(e.id, t);
  }
  updateCustom(t) {
    const e = this._core.getState();
    if (!this._threadListBinding.updateCustom)
      throw new Error("Thread list runtime does not support updating custom metadata");
    return this._threadListBinding.updateCustom(e.id, t);
  }
  archive() {
    const t = this._core.getState();
    return this._threadListBinding.archive(t.id);
  }
  unarchive() {
    const t = this._core.getState();
    return this._threadListBinding.unarchive(t.id);
  }
  delete() {
    const t = this._core.getState();
    return this._threadListBinding.delete(t.id);
  }
  initialize() {
    const t = this._core.getState();
    return this._threadListBinding.initialize(t.id);
  }
  generateTitle() {
    const t = this._core.getState();
    return this._threadListBinding.generateTitle(t.id);
  }
  unstable_on(t, e) {
    let n = this._core.getState().isMain, r = this._core.getState().id;
    return this.subscribe(() => {
      const i = this._core.getState(), o = i.isMain, s = i.id;
      n === o && r === s || (n = o, r = s, !(t === "switchedTo" && !o) && (t === "switchedAway" && o || e({})));
    });
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  detach() {
    const t = this._core.getState();
    this._threadListBinding.detach(t.id);
  }
  __internal_getRuntime() {
    return this;
  }
};
const ia = Promise.resolve(), uv = (t) => ({
  mainThreadId: t.mainThreadId,
  newThreadId: t.newThreadId,
  threadIds: t.threadIds,
  archivedThreadIds: t.archivedThreadIds,
  isLoading: t.isLoading,
  isLoadingMore: t.isLoadingMore ?? !1,
  hasMore: t.hasMore ?? !1,
  threadItems: t.threadItems
}), pr = (t, e) => {
  if (e === void 0)
    return st;
  const n = t.getItemById(e);
  return n ? {
    id: n.id,
    remoteId: n.remoteId,
    externalId: n.externalId,
    title: n.title,
    status: n.status,
    lastMessageAt: n.lastMessageAt,
    custom: n.custom,
    isMain: n.id === t.mainThreadId
  } : st;
};
var ku = class {
  constructor(t, e = yu) {
    C(this, "_core");
    C(this, "_runtimeFactory");
    C(this, "_getState");
    C(this, "_mainThreadListItemRuntime");
    C(this, "main");
    this._core = t, this._runtimeFactory = e;
    const n = new $o({
      path: {},
      getState: () => uv(t),
      subscribe: (r) => t.subscribe(r)
    });
    this._getState = n.getState.bind(n), this._mainThreadListItemRuntime = new hr(new nt({
      path: {
        ref: "threadItems[main]",
        threadSelector: { type: "main" }
      },
      getState: () => pr(this._core, this._core.mainThreadId),
      subscribe: (r) => this._core.subscribe(r)
    }), this._core), this.main = new e(new Dr({
      path: {
        ref: "threads.main",
        threadSelector: { type: "main" }
      },
      getState: () => t.getMainThreadRuntimeCore(),
      subscribe: (r) => t.subscribe(r)
    }), this._mainThreadListItemRuntime), this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.switchToThread = this.switchToThread.bind(this), this.switchToNewThread = this.switchToNewThread.bind(this), this.getLoadThreadsPromise = this.getLoadThreadsPromise.bind(this), this.reload = this.reload.bind(this), this.loadMore = this.loadMore.bind(this), this.getState = this.getState.bind(this), this.subscribe = this.subscribe.bind(this), this.getById = this.getById.bind(this), this.getItemById = this.getItemById.bind(this), this.getItemByIndex = this.getItemByIndex.bind(this), this.getArchivedItemByIndex = this.getArchivedItemByIndex.bind(this);
  }
  switchToThread(t, e) {
    return this._core.switchToThread(t, e);
  }
  switchToNewThread() {
    return this._core.switchToNewThread();
  }
  getLoadThreadsPromise() {
    return this._core.getLoadThreadsPromise();
  }
  reload() {
    var t, e;
    return ((e = (t = this._core).reload) == null ? void 0 : e.call(t)) ?? ia;
  }
  loadMore() {
    var t, e;
    return ((e = (t = this._core).loadMore) == null ? void 0 : e.call(t)) ?? ia;
  }
  getState() {
    return this._getState();
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  get mainItem() {
    return this._mainThreadListItemRuntime;
  }
  getById(t) {
    return new this._runtimeFactory(new Dr({
      path: {
        ref: `threads[threadId=${JSON.stringify(t)}]`,
        threadSelector: {
          type: "threadId",
          threadId: t
        }
      },
      getState: () => this._core.getThreadRuntimeCore(t),
      subscribe: (e) => this._core.subscribe(e)
    }), this.mainItem);
  }
  getItemByIndex(t) {
    return new hr(new nt({
      path: {
        ref: `threadItems[${t}]`,
        threadSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => pr(this._core, this._core.threadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getArchivedItemByIndex(t) {
    return new hr(new nt({
      path: {
        ref: `archivedThreadItems[${t}]`,
        threadSelector: {
          type: "archiveIndex",
          index: t
        }
      },
      getState: () => pr(this._core, this._core.archivedThreadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getItemById(t) {
    return new hr(new nt({
      path: {
        ref: `threadItems[threadId=${t}]`,
        threadSelector: {
          type: "threadId",
          threadId: t
        }
      },
      getState: () => pr(this._core, t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, Fo = class {
  constructor(t) {
    C(this, "_core");
    C(this, "threads");
    C(this, "_thread");
    this._core = t, this.threads = new ku(t.threads), this._thread = this.threads.main, this.__internal_bindMethods();
  }
  __internal_bindMethods() {
    this.registerModelContextProvider = this.registerModelContextProvider.bind(this);
  }
  get thread() {
    return this._thread;
  }
  registerModelContextProvider(t) {
    return this._core.registerModelContextProvider(t);
  }
}, Bo = class {
  constructor() {
    C(this, "_contextProvider", new Mo());
  }
  registerModelContextProvider(t) {
    return this._contextProvider.registerModelContextProvider(t);
  }
  getModelContextProvider() {
    return this._contextProvider;
  }
};
const fi = (t, e) => {
  if (t.startsWith("data-"))
    return {
      type: "data",
      name: t.substring(5),
      data: e
    };
}, zr = (t, e, n) => {
  const { role: r, id: i, createdAt: o, attachments: s, status: a, metadata: l } = t, c = {
    id: i ?? e,
    createdAt: o ?? /* @__PURE__ */ new Date()
  }, d = typeof t.content == "string" ? [{
    type: "text",
    text: t.content
  }] : t.content, u = ({ image: h, ...p }) => typeof h != "string" ? null : h.match(/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,(.*)$/) ? {
    ...p,
    image: h
  } : /^(https:\/\/|blob:)/.test(h) ? {
    ...p,
    image: h
  } : (console.warn("Invalid image data format detected"), null);
  if (r !== "user" && (s != null && s.length))
    throw new Error("attachments are only supported for user messages");
  if (r !== "assistant" && a)
    throw new Error("status is only supported for assistant messages");
  if (r !== "assistant" && (l != null && l.steps))
    throw new Error("metadata.steps is only supported for assistant messages");
  switch (r) {
    case "assistant":
      return {
        ...c,
        role: r,
        content: d.map((h) => {
          var m;
          const p = h.type;
          switch (p) {
            case "text":
            case "reasoning":
              return (m = h.text) != null && m.trim() ? h : null;
            case "file":
            case "source":
              return h;
            case "image":
              return u(h);
            case "data":
              return h;
            case "generative-ui":
              return h;
            case "tool-call": {
              const { parentId: g, messages: w, ...b } = h, k = {
                ...b,
                toolCallId: h.toolCallId ?? `tool-${pt()}`,
                ...g !== void 0 && { parentId: g },
                ...w !== void 0 && { messages: w }
              };
              return h.args ? {
                ...k,
                args: h.args,
                argsText: h.argsText ?? JSON.stringify(h.args)
              } : {
                ...k,
                args: uu(h.argsText ?? "") ?? {},
                argsText: h.argsText ?? ""
              };
            }
            default: {
              const g = fi(p, h.data);
              if (g)
                return g;
              throw new Error(`Unsupported assistant message part type: ${p}`);
            }
          }
        }).filter((h) => !!h),
        status: a ?? n,
        metadata: {
          unstable_state: (l == null ? void 0 : l.unstable_state) ?? null,
          unstable_annotations: (l == null ? void 0 : l.unstable_annotations) ?? [],
          unstable_data: (l == null ? void 0 : l.unstable_data) ?? [],
          custom: (l == null ? void 0 : l.custom) ?? {},
          steps: (l == null ? void 0 : l.steps) ?? [],
          ...(l == null ? void 0 : l.timing) && { timing: l.timing },
          ...(l == null ? void 0 : l.submittedFeedback) && { submittedFeedback: l.submittedFeedback },
          ...(l == null ? void 0 : l.isOptimistic) && { isOptimistic: !0 }
        }
      };
    case "user":
      return {
        ...c,
        role: r,
        content: d.map((h) => {
          const p = h.type;
          switch (p) {
            case "text":
            case "image":
            case "audio":
            case "file":
            case "data":
              return h;
            default: {
              const m = fi(p, h.data);
              if (m)
                return m;
              throw new Error(`Unsupported user message part type: ${p}`);
            }
          }
        }),
        attachments: (s ?? []).map((h) => ({
          ...h,
          content: h.content.map((p) => fi(p.type, p.data) ?? p)
        })),
        metadata: { custom: (l == null ? void 0 : l.custom) ?? {} }
      };
    case "system":
      if (d.length !== 1 || d[0].type !== "text")
        throw new Error("System messages must have exactly one text message part.");
      return {
        ...c,
        role: r,
        content: d,
        metadata: { custom: (l == null ? void 0 : l.custom) ?? {} }
      };
    default:
      throw new Error(`Unknown message role: ${r}`);
  }
}, or = Symbol("autoStatus"), dv = Object.freeze(Object.assign({ type: "running" }, { [or]: !0 })), hv = Object.freeze(Object.assign({
  type: "complete",
  reason: "unknown"
}, { [or]: !0 })), pv = Object.freeze(Object.assign({
  type: "requires-action",
  reason: "tool-calls"
}, { [or]: !0 })), mv = Object.freeze(Object.assign({
  type: "requires-action",
  reason: "interrupt"
}, { [or]: !0 })), Yi = (t, e, n, r, i) => t && i ? Object.assign({
  type: "incomplete",
  reason: "error",
  error: i
}, { [or]: !0 }) : t && e ? dv : n ? mv : r ? pv : hv, _u = {
  fromArray: (t) => {
    const e = t.map((n) => zr(n, pt(), Yi(!1, !1, !1, !1, void 0)));
    return { messages: e.map((n, r) => ({
      parentId: r > 0 ? e[r - 1].id : null,
      message: n
    })) };
  },
  fromBranchableArray: (t, e) => {
    const n = Yi(!1, !1, !1, !1, void 0);
    return {
      ...(e == null ? void 0 : e.headId) !== void 0 ? { headId: e.headId } : void 0,
      messages: t.map(({ message: r, parentId: i }) => {
        if (!r.id)
          throw new Error("ExportedMessageRepository.fromBranchableArray: Each message must have an 'id' field set.");
        return {
          parentId: i,
          message: zr(r, r.id, n)
        };
      })
    };
  }
}, Cr = (t) => t.next ? Cr(t.next) : "current" in t ? t : null;
var fv = class {
  constructor(t) {
    C(this, "func");
    C(this, "_value", null);
    this.func = t;
  }
  get value() {
    return this._value === null && (this._value = this.func()), this._value;
  }
  dirty() {
    this._value = null;
  }
}, Su = class {
  constructor() {
    C(this, "messages", /* @__PURE__ */ new Map());
    C(this, "head", null);
    C(this, "root", {
      children: [],
      next: null
    });
    C(this, "_messages", new fv(() => {
      var e;
      const t = new Array((((e = this.head) == null ? void 0 : e.level) ?? -1) + 1);
      for (let n = this.head; n; n = n.prev)
        t[n.level] = n.current;
      return t;
    }));
  }
  updateLevels(t, e) {
    t.level = e;
    for (const n of t.children) {
      const r = this.messages.get(n);
      r && this.updateLevels(r, e + 1);
    }
  }
  performOp(t, e, n) {
    const r = e.prev ?? this.root, i = t ?? this.root;
    if (!(n === "relink" && r === i)) {
      if (n !== "link" && (r.children = r.children.filter((o) => o !== e.current.id), r.next === e)) {
        const o = r.children.at(-1), s = o ? this.messages.get(o) : null;
        if (s === void 0)
          throw new Error("MessageRepository(performOp/cut): Fallback sibling message not found. This is likely an internal bug in assistant-ui.");
        r.next = s;
      }
      if (n !== "cut") {
        for (let s = t; s; s = s.prev)
          if (s.current.id === e.current.id)
            throw new Error("MessageRepository(performOp/link): A message with the same id already exists in the parent tree. This error occurs if the same message id is found multiple times. This is likely an internal bug in assistant-ui.");
        i.children = [...i.children, e.current.id], (Cr(e) === this.head || i.next === null) && (i.next = e), e.prev = t;
        const o = t ? t.level + 1 : 0;
        this.updateLevels(e, o);
      }
    }
  }
  get headId() {
    var t;
    return ((t = this.head) == null ? void 0 : t.current.id) ?? null;
  }
  get canonicalHeadId() {
    var e;
    let t = this.head;
    for (; (e = t == null ? void 0 : t.current.metadata) != null && e.isOptimistic; )
      t = t.prev;
    return (t == null ? void 0 : t.current.id) ?? null;
  }
  getMessages(t) {
    var r;
    if (t === void 0 || t === ((r = this.head) == null ? void 0 : r.current.id))
      return this._messages.value;
    const e = this.messages.get(t);
    if (!e)
      throw new Error("MessageRepository(getMessages): Head message not found. This is likely an internal bug in assistant-ui.");
    const n = new Array(e.level + 1);
    for (let i = e; i; i = i.prev)
      n[i.level] = i.current;
    return n;
  }
  addOrUpdateMessage(t, e) {
    const n = this.messages.get(e.id), r = t ? this.messages.get(t) : null;
    if (r === void 0)
      throw new Error("MessageRepository(addOrUpdateMessage): Parent message not found. This is likely an internal bug in assistant-ui.");
    if (n) {
      n.current = e, this.performOp(r, n, "relink"), this._messages.dirty();
      return;
    }
    const i = {
      prev: r,
      current: e,
      next: null,
      children: [],
      level: r ? r.level + 1 : 0
    };
    this.messages.set(e.id, i), this.performOp(r, i, "link"), this.head === r && (this.head = i), this._messages.dirty();
  }
  getMessage(t) {
    var n;
    const e = this.messages.get(t);
    if (!e)
      throw new Error("MessageRepository(updateMessage): Message not found. This is likely an internal bug in assistant-ui.");
    return {
      parentId: ((n = e.prev) == null ? void 0 : n.current.id) ?? null,
      message: e.current,
      index: e.level
    };
  }
  deleteMessage(t, e) {
    const n = this.messages.get(t);
    if (!n)
      throw new Error("MessageRepository(deleteMessage): Message not found. This is likely an internal bug in assistant-ui.");
    const r = e === void 0 ? n.prev : e === null ? null : this.messages.get(e);
    if (r === void 0)
      throw new Error("MessageRepository(deleteMessage): Replacement not found. This is likely an internal bug in assistant-ui.");
    for (const i of n.children) {
      const o = this.messages.get(i);
      if (!o)
        throw new Error("MessageRepository(deleteMessage): Child message not found. This is likely an internal bug in assistant-ui.");
      this.performOp(r, o, "relink");
    }
    this.performOp(null, n, "cut"), this.messages.delete(t), this.head === n && (this.head = Cr(r ?? this.root)), this._messages.dirty();
  }
  getBranches(t) {
    const e = this.messages.get(t);
    if (!e)
      throw new Error("MessageRepository(getBranches): Message not found. This is likely an internal bug in assistant-ui.");
    const { children: n } = e.prev ?? this.root;
    return n;
  }
  /**
  * Evicts optimistic messages (`metadata.isOptimistic`) the head just moved
  * away from. Since eviction runs on every head move, the only optimistic
  * messages in the repository live on the branch the head previously pointed
  * at — so we walk just that branch rather than the whole repository. Keeps a
  * client→server id swap from leaving a phantom sibling, and drops off-branch
  * placeholders.
  */
  evictOffBranchOptimisticMessages(t, e) {
    var i;
    if (!t)
      return;
    const n = /* @__PURE__ */ new Set();
    for (let o = e; o; o = o.prev)
      n.add(o.current.id);
    const r = [];
    for (let o = t; o && !n.has(o.current.id); o = o.prev)
      (i = o.current.metadata) != null && i.isOptimistic && r.push(o.current.id);
    for (const o of r)
      this.messages.has(o) && this.deleteMessage(o);
  }
  switchToBranch(t) {
    const e = this.messages.get(t);
    if (!e)
      throw new Error("MessageRepository(switchToBranch): Branch not found. This is likely an internal bug in assistant-ui.");
    const n = this.head, r = e.prev ?? this.root;
    r.next = e, this.head = Cr(e), this.evictOffBranchOptimisticMessages(n, this.head), this._messages.dirty();
  }
  resetHead(t) {
    if (t === null) {
      this.clear();
      return;
    }
    const e = this.messages.get(t);
    if (!e)
      throw new Error("MessageRepository(resetHead): Branch not found. This is likely an internal bug in assistant-ui.");
    const n = this.head;
    if (e.children.length > 0) {
      const r = (i) => {
        for (const o of i.children) {
          const s = this.messages.get(o);
          s && (r(s), this.messages.delete(o));
        }
      };
      r(e), e.children = [], e.next = null;
    }
    this.head = e;
    for (let r = e; r; r = r.prev)
      r.prev ? r.prev.next = r : this.root.next = r;
    this.evictOffBranchOptimisticMessages(n, this.head), this._messages.dirty();
  }
  clear() {
    this.messages.clear(), this.head = null, this.root = {
      children: [],
      next: null
    }, this._messages.dirty();
  }
  export() {
    var e, n;
    const t = [];
    for (const [, r] of this.messages)
      (e = r.current.metadata) != null && e.isOptimistic || t.push({
        message: r.current,
        parentId: ((n = r.prev) == null ? void 0 : n.current.id) ?? null
      });
    return {
      headId: this.canonicalHeadId,
      messages: t
    };
  }
  import({ headId: t, messages: e }) {
    var n;
    for (const { message: r, parentId: i } of e)
      this.addOrUpdateMessage(i, r);
    this.resetHead(t ?? ((n = e.at(-1)) == null ? void 0 : n.message.id) ?? null);
  }
};
const Jn = Object.freeze([]);
function oa(t, e) {
  if (e === "*")
    return !0;
  const n = e.split(",").map((o) => o.trim().toLowerCase()), r = `.${t.name.split(".").pop().toLowerCase()}`, i = t.type.toLowerCase();
  for (const o of n) {
    if (o.startsWith(".") && o === r || o.includes("/") && o === i)
      return !0;
    if (o.endsWith("/*")) {
      const s = o.split("/")[0];
      if (i.startsWith(`${s}/`))
        return !0;
    }
  }
  return !1;
}
function gv(t, e) {
  return t.length !== e.length ? !1 : t.every((n, r) => n.id === e[r].id);
}
function bv(t) {
  const e = pt();
  return t.type === "image" ? {
    id: e,
    type: "image",
    name: t.filename ?? "image",
    content: [t],
    status: { type: "complete" }
  } : t.type === "file" ? {
    id: e,
    type: "document",
    name: t.filename ?? "document",
    contentType: t.mimeType,
    content: [t],
    status: { type: "complete" }
  } : t.type === "audio" ? {
    id: e,
    type: "audio",
    name: `audio.${t.audio.format}`,
    contentType: `audio/${t.audio.format}`,
    content: [t],
    status: { type: "complete" }
  } : {
    id: e,
    type: "data",
    name: t.name,
    content: [t],
    status: { type: "complete" }
  };
}
function vv(t) {
  const e = [];
  for (const n of t)
    n.type !== "text" && e.push(bv(n));
  return e;
}
const gi = (t) => t.status.type === "complete";
var Cu = class extends ir {
  constructor() {
    super(...arguments);
    C(this, "isEditing", !0);
    C(this, "_attachments", []);
    C(this, "_text", "");
    C(this, "_role", "user");
    C(this, "_runConfig", {});
    C(this, "_quote");
    C(this, "_dictation");
    C(this, "_dictationSession");
    C(this, "_dictationUnsubscribes", []);
    C(this, "_dictationBaseText", "");
    C(this, "_currentInterimText", "");
    C(this, "_dictationSessionIdCounter", 0);
    C(this, "_activeDictationSessionId");
    C(this, "_isCleaningDictation", !1);
    C(this, "_eventSubscribers", /* @__PURE__ */ new Map());
  }
  enrichWithComposerMetadata(e, n) {
    var r;
    return n ? {
      ...e,
      metadata: {
        ...e.metadata,
        custom: {
          ...(r = e.metadata) == null ? void 0 : r.custom,
          ...n
        }
      }
    } : e;
  }
  get attachmentAccept() {
    var e;
    return ((e = this.getAttachmentAdapter()) == null ? void 0 : e.accept) ?? "*";
  }
  get attachments() {
    return this._attachments;
  }
  setAttachments(e) {
    this._attachments = e, this._notifySubscribers();
  }
  get isEmpty() {
    return !this.text.trim() && !this.attachments.length;
  }
  get text() {
    return this._text;
  }
  get role() {
    return this._role;
  }
  get runConfig() {
    return this._runConfig;
  }
  get quote() {
    return this._quote;
  }
  setQuote(e) {
    this._quote !== e && (this._quote = e, this._notifySubscribers());
  }
  setText(e) {
    if (this._text !== e) {
      if (this._text = e, this._dictation) {
        this._dictationBaseText = e, this._currentInterimText = "";
        const { status: n, inputDisabled: r } = this._dictation;
        this._dictation = r ? {
          status: n,
          inputDisabled: r
        } : { status: n };
      }
      this._notifySubscribers();
    }
  }
  setRole(e) {
    this._role !== e && (this._role = e, this._notifySubscribers());
  }
  setRunConfig(e) {
    this._runConfig !== e && (this._runConfig = e, this._notifySubscribers());
  }
  _emptyTextAndAttachments() {
    this._attachments = [], this._text = "", this._notifySubscribers();
  }
  async _onClearAttachments() {
    const e = this.getAttachmentAdapter();
    if (e) {
      const n = this._attachments.filter((r) => !gi(r));
      await Promise.all(n.map((r) => e.remove(r)));
    }
  }
  async reset() {
    if (this._attachments.length === 0 && this._text === "" && this._role === "user" && Object.keys(this._runConfig).length === 0 && this._quote === void 0)
      return;
    this._role = "user", this._runConfig = {}, this._quote = void 0;
    const e = this._onClearAttachments();
    this._emptyTextAndAttachments(), await e;
  }
  async clearAttachments() {
    const e = this._onClearAttachments();
    this.setAttachments([]), await e;
  }
  async send(e) {
    if (!this.canSend)
      return;
    this._dictationSession && (this._dictationSession.cancel(), this._cleanupDictation());
    const n = this.getAttachmentAdapter(), r = this.attachments.length > 0 ? Promise.all(this.attachments.map(async (a) => {
      if (gi(a))
        return a;
      if (!n)
        throw new Error("Attachments are not supported");
      return await n.send(a);
    })) : [], i = this.text, o = this._quote;
    this._quote = void 0, this._emptyTextAndAttachments();
    const s = {
      createdAt: /* @__PURE__ */ new Date(),
      role: this.role,
      content: i ? [{
        type: "text",
        text: i
      }] : [],
      attachments: await r,
      runConfig: this.runConfig,
      metadata: { custom: { ...o ? { quote: o } : {} } }
    };
    this.handleSend(s, e), this._notifyEventSubscribers("send", {});
  }
  cancel() {
    this.handleCancel();
  }
  get queue() {
    return Jn;
  }
  steerQueueItem(e) {
  }
  removeQueueItem(e) {
  }
  async addAttachment(e) {
    if (!(e instanceof File)) {
      const o = this.getAttachmentAdapter();
      if (o && !oa({
        name: e.name,
        type: e.contentType ?? ""
      }, o.accept)) {
        const a = `File type ${e.contentType || "unknown"} is not accepted. Accepted types: ${o.accept}`, l = new Error(a);
        throw this._safeEmitAttachmentAddError("not-accepted", a, void 0, l), l;
      }
      const s = {
        id: e.id ?? pt(),
        type: e.type ?? "document",
        name: e.name,
        contentType: e.contentType,
        content: e.content,
        status: { type: "complete" }
      };
      this._attachments = [...this._attachments, s], this._notifySubscribers(), this._notifyEventSubscribers("attachmentAdd", {});
      return;
    }
    const n = (o) => {
      const s = this._attachments.findIndex((a) => a.id === o.id);
      s !== -1 ? this._attachments = [
        ...this._attachments.slice(0, s),
        o,
        ...this._attachments.slice(s + 1)
      ] : this._attachments = [...this._attachments, o], this._notifySubscribers();
    }, r = this.getAttachmentAdapter();
    if (!r) {
      const o = "Attachments are not supported", s = /* @__PURE__ */ new Error(o);
      throw this._safeEmitAttachmentAddError("no-adapter", o, void 0, s), s;
    }
    if (!oa({
      name: e.name,
      type: e.type
    }, r.accept)) {
      const o = `File type ${e.type || "unknown"} is not accepted. Accepted types: ${r.accept}`, s = new Error(o);
      throw this._safeEmitAttachmentAddError("not-accepted", o, void 0, s), s;
    }
    let i;
    try {
      const o = r.add({ file: e });
      if (Symbol.asyncIterator in o)
        for await (const s of o)
          i = s, n(s);
      else
        i = await o, n(i);
    } catch (o) {
      throw i && n({
        ...i,
        status: {
          type: "incomplete",
          reason: "error"
        }
      }), this._safeEmitAttachmentAddError("adapter-error", o instanceof Error ? o.message : String(o), i == null ? void 0 : i.id, o instanceof Error ? o : void 0), o;
    }
    (i == null ? void 0 : i.status.type) === "incomplete" && i.status.reason === "error" ? this._safeEmitAttachmentAddError("adapter-error", "Attachment upload did not complete successfully.", i == null ? void 0 : i.id) : this._notifyEventSubscribers("attachmentAdd", {});
  }
  _safeEmitAttachmentAddError(e, n, r, i) {
    try {
      this._notifyEventSubscribers("attachmentAddError", {
        reason: e,
        message: n,
        ...r !== void 0 && { attachmentId: r },
        ...i !== void 0 && { error: i }
      });
    } catch (o) {
      console.error("[assistant-ui] attachmentAddError subscriber threw:", o);
    }
  }
  async removeAttachment(e) {
    const n = this._attachments.findIndex((i) => i.id === e);
    if (n === -1)
      throw new Error("Attachment not found");
    const r = this._attachments[n];
    if (!gi(r)) {
      const i = this.getAttachmentAdapter();
      if (!i)
        throw new Error("Attachments are not supported");
      await i.remove(r);
    }
    this._attachments = this._attachments.filter((i) => i.id !== e), this._notifySubscribers();
  }
  get dictation() {
    return this._dictation;
  }
  _isActiveSession(e, n) {
    return this._activeDictationSessionId === e && this._dictationSession === n;
  }
  startDictation() {
    const e = this.getDictationAdapter();
    if (!e)
      throw new Error("Dictation adapter not configured");
    if (this._dictationSession) {
      for (const c of this._dictationUnsubscribes)
        c();
      this._dictationUnsubscribes = [], this._dictationSession.stop().catch(() => {
      }), this._dictationSession = void 0;
    }
    const n = e.disableInputDuringDictation ?? !1;
    this._dictationBaseText = this._text, this._currentInterimText = "";
    const r = e.listen();
    this._dictationSession = r;
    const i = ++this._dictationSessionIdCounter;
    this._activeDictationSessionId = i, this._dictation = {
      status: r.status,
      inputDisabled: n
    }, this._notifySubscribers();
    const o = r.onSpeech((c) => {
      if (!this._isActiveSession(i, r))
        return;
      const d = c.isFinal !== !1, u = this._dictationBaseText && !this._dictationBaseText.endsWith(" ") && c.transcript ? " " : "";
      if (d) {
        if (this._dictationBaseText = this._dictationBaseText + u + c.transcript, this._currentInterimText = "", this._text = this._dictationBaseText, this._dictation) {
          const { transcript: h, ...p } = this._dictation;
          this._dictation = p;
        }
        this._notifySubscribers();
      } else
        this._currentInterimText = u + c.transcript, this._text = this._dictationBaseText + this._currentInterimText, this._dictation && (this._dictation = {
          ...this._dictation,
          transcript: c.transcript
        }), this._notifySubscribers();
    });
    this._dictationUnsubscribes.push(o);
    const s = r.onSpeechStart(() => {
      var c;
      this._isActiveSession(i, r) && (this._dictation = {
        status: { type: "running" },
        inputDisabled: n,
        ...((c = this._dictation) == null ? void 0 : c.transcript) && { transcript: this._dictation.transcript }
      }, this._notifySubscribers());
    });
    this._dictationUnsubscribes.push(s);
    const a = r.onSpeechEnd(() => {
      this._cleanupDictation({ sessionId: i });
    });
    this._dictationUnsubscribes.push(a);
    const l = setInterval(() => {
      this._isActiveSession(i, r) && r.status.type === "ended" && this._cleanupDictation({ sessionId: i });
    }, 100);
    this._dictationUnsubscribes.push(() => clearInterval(l));
  }
  stopDictation() {
    if (!this._dictationSession)
      return;
    const e = this._dictationSession, n = this._activeDictationSessionId;
    e.stop().finally(() => {
      this._cleanupDictation({ sessionId: n });
    });
  }
  _cleanupDictation(e) {
    if (!((e == null ? void 0 : e.sessionId) !== void 0 && e.sessionId !== this._activeDictationSessionId || this._isCleaningDictation)) {
      this._isCleaningDictation = !0;
      try {
        for (const n of this._dictationUnsubscribes)
          n();
        this._dictationUnsubscribes = [], this._dictationSession = void 0, this._activeDictationSessionId = void 0, this._dictation = void 0, this._dictationBaseText = "", this._currentInterimText = "", this._notifySubscribers();
      } finally {
        this._isCleaningDictation = !1;
      }
    }
  }
  _notifyEventSubscribers(e, n) {
    const r = this._eventSubscribers.get(e);
    if (r)
      for (const i of r)
        i(n);
  }
  unstable_on(e, n) {
    const r = n;
    let i = this._eventSubscribers.get(e);
    return i || (i = /* @__PURE__ */ new Set(), this._eventSubscribers.set(e, i)), i.add(r), () => {
      var o;
      (o = this._eventSubscribers.get(e)) == null || o.delete(r);
    };
  }
}, Tu = class extends Cu {
  constructor(e) {
    super();
    C(this, "runtime");
    C(this, "_canCancel", !1);
    this.runtime = e, this.connect();
  }
  get canCancel() {
    return this._canCancel;
  }
  get canSend() {
    return !this.isEmpty && !this.runtime.isSendDisabled;
  }
  get queue() {
    var e, n;
    return ((n = (e = this.runtime).getQueueItems) == null ? void 0 : n.call(e)) ?? Jn;
  }
  steerQueueItem(e) {
    var n, r;
    (r = (n = this.runtime).steerQueueItem) == null || r.call(n, e);
  }
  removeQueueItem(e) {
    var n, r;
    (r = (n = this.runtime).removeQueueItem) == null || r.call(n, e);
  }
  getAttachmentAdapter() {
    var e;
    return (e = this.runtime.adapters) == null ? void 0 : e.attachments;
  }
  getDictationAdapter() {
    var e;
    return (e = this.runtime.adapters) == null ? void 0 : e.dictation;
  }
  connect() {
    let e = this.runtime.isSendDisabled, n = this.queue;
    return this.runtime.subscribe(() => {
      let r = !1;
      this.canCancel !== this.runtime.capabilities.cancel && (this._canCancel = this.runtime.capabilities.cancel, r = !0), e !== this.runtime.isSendDisabled && (e = this.runtime.isSendDisabled, r = !0), n !== this.queue && (n = this.queue, r = !0), r && this._notifySubscribers();
    });
  }
  async handleSend(e, n) {
    var o;
    const r = su(this.runtime.getModelContext().unstable_composerMetadata, this.runtime.messages), i = this.enrichWithComposerMetadata(e, r);
    this.runtime.append({
      ...i,
      parentId: ((o = this.runtime.messages.at(-1)) == null ? void 0 : o.id) ?? null,
      sourceId: null,
      startRun: n == null ? void 0 : n.startRun,
      steer: n == null ? void 0 : n.steer
    });
  }
  async handleCancel() {
    this.runtime.cancelRun();
  }
}, wv = class extends Cu {
  constructor(e, n, { parentId: r, message: i }) {
    super();
    C(this, "runtime");
    C(this, "endEditCallback");
    C(this, "_previousText");
    C(this, "_previousAttachments");
    C(this, "_nonTextPassthrough");
    C(this, "_parentId");
    C(this, "_sourceId");
    this.runtime = e, this.endEditCallback = n, this._parentId = r, this._sourceId = i.id, this._previousText = Kn(i), this.setText(this._previousText), this.setRole(i.role), i.role === "user" ? (this._previousAttachments = [...i.attachments ?? [], ...vv(i.content)], this._nonTextPassthrough = []) : (this._previousAttachments = i.attachments ?? [], this._nonTextPassthrough = i.content.filter((o) => o.type !== "text")), this.setAttachments(this._previousAttachments), this.setRunConfig({ ...e.composer.runConfig });
  }
  get canCancel() {
    return !0;
  }
  get canSend() {
    return !this.isEmpty;
  }
  getAttachmentAdapter() {
    var e;
    return (e = this.runtime.adapters) == null ? void 0 : e.attachments;
  }
  getDictationAdapter() {
    var e;
    return (e = this.runtime.adapters) == null ? void 0 : e.dictation;
  }
  get parentId() {
    return this._parentId;
  }
  get sourceId() {
    return this._sourceId;
  }
  async handleSend(e, n) {
    const r = Kn(e), i = !gv(e.attachments ?? [], this._previousAttachments);
    if (r !== this._previousText || i || n != null && n.startRun) {
      const o = this._nonTextPassthrough.length > 0 ? [...e.content, ...this._nonTextPassthrough] : e.content, s = this.runtime.messages, a = this._parentId === null ? -1 : s.findIndex((d) => d.id === this._parentId), l = su(this.runtime.getModelContext().unstable_composerMetadata, s.slice(0, a + 1)), c = this.enrichWithComposerMetadata(e, l);
      this.runtime.append({
        ...c,
        content: o,
        parentId: this._parentId,
        sourceId: this._sourceId,
        startRun: n == null ? void 0 : n.startRun
      });
    }
    this.handleCancel();
  }
  handleCancel() {
    this.endEditCallback(), this._notifySubscribers();
  }
}, yv = class {
  constructor(t) {
    C(this, "_contextProvider");
    C(this, "_subscriptions", /* @__PURE__ */ new Set());
    C(this, "_isInitialized", !1);
    C(this, "repository", new Su());
    C(this, "_voiceMessages", []);
    C(this, "_voiceGeneration", 0);
    C(this, "_cachedMergedMessages", null);
    C(this, "_cachedVoiceGeneration", -1);
    C(this, "_cachedMergedBase", null);
    C(this, "composer", new Tu(this));
    C(this, "_editComposers", /* @__PURE__ */ new Map());
    C(this, "_stopSpeaking");
    C(this, "speech");
    C(this, "_voiceSession");
    C(this, "_voiceUnsubs", []);
    C(this, "voice");
    C(this, "_voiceVolume", 0);
    C(this, "_voiceVolumeSubscribers", /* @__PURE__ */ new Set());
    C(this, "getVoiceVolume", () => this._voiceVolume);
    C(this, "subscribeVoiceVolume", (t) => (this._voiceVolumeSubscribers.add(t), () => this._voiceVolumeSubscribers.delete(t)));
    C(this, "_currentAssistantMsg", null);
    C(this, "_eventSubscribers", /* @__PURE__ */ new Map());
    this._contextProvider = t;
  }
  _markVoiceMessagesDirty() {
    this._voiceGeneration++, this._cachedMergedMessages = null;
  }
  _getBaseMessages() {
    return this.repository.getMessages();
  }
  get messages() {
    if (this._voiceMessages.length === 0)
      return this._getBaseMessages();
    const t = this._getBaseMessages();
    return (this._cachedVoiceGeneration !== this._voiceGeneration || this._cachedMergedBase !== t) && (this._cachedMergedMessages = [...t, ...this._voiceMessages], this._cachedVoiceGeneration = this._voiceGeneration, this._cachedMergedBase = t), this._cachedMergedMessages;
  }
  get state() {
    let t;
    for (const e of this.messages)
      e.role === "assistant" && (t = e);
    return (t == null ? void 0 : t.metadata.unstable_state) ?? null;
  }
  getModelContext() {
    return this._contextProvider.getModelContext();
  }
  getEditComposer(t) {
    return this._editComposers.get(t);
  }
  beginEdit(t) {
    if (this._editComposers.has(t))
      throw new Error("Edit already in progress");
    this._editComposers.set(t, new wv(this, () => this._editComposers.delete(t), this.repository.getMessage(t))), this._notifySubscribers();
  }
  getMessageById(t) {
    var e;
    try {
      return this.repository.getMessage(t);
    } catch {
      const n = this.repository.getMessages(), r = this._voiceMessages.findIndex((i) => i.id === t);
      return r !== -1 ? {
        parentId: r > 0 ? this._voiceMessages[r - 1].id : ((e = n.at(-1)) == null ? void 0 : e.id) ?? null,
        message: this._voiceMessages[r],
        index: n.length + r
      } : void 0;
    }
  }
  getBranches(t) {
    return this._voiceMessages.some((e) => e.id === t) ? [] : this.repository.getBranches(t);
  }
  switchToBranch(t) {
    this.repository.switchToBranch(t), this._notifySubscribers();
  }
  _notifySubscribers() {
    for (const t of this._subscriptions)
      t();
  }
  _notifyEventSubscribers(t, e) {
    const n = this._eventSubscribers.get(t);
    if (n)
      for (const r of n)
        r(e);
  }
  subscribe(t) {
    return this._subscriptions.add(t), () => this._subscriptions.delete(t);
  }
  submitFeedback({ messageId: t, type: e }) {
    var o;
    const n = (o = this.adapters) == null ? void 0 : o.feedback;
    if (!n)
      throw new Error("Feedback adapter not configured");
    const { message: r, parentId: i } = this.repository.getMessage(t);
    if (n.submit({
      message: r,
      type: e
    }), r.role === "assistant") {
      const s = {
        ...r,
        metadata: {
          ...r.metadata,
          submittedFeedback: { type: e }
        }
      };
      this.repository.addOrUpdateMessage(i, s);
    }
    this._notifySubscribers();
  }
  speak(t) {
    var o, s;
    const e = (o = this.adapters) == null ? void 0 : o.speech;
    if (!e)
      throw new Error("Speech adapter not configured");
    const { message: n } = this.repository.getMessage(t);
    (s = this._stopSpeaking) == null || s.call(this);
    const r = e.speak(Kn(n)), i = r.subscribe(() => {
      r.status.type === "ended" ? (this._stopSpeaking = void 0, this.speech = void 0) : this.speech = {
        messageId: t,
        status: r.status
      }, this._notifySubscribers();
    });
    this.speech = {
      messageId: t,
      status: r.status
    }, this._notifySubscribers(), this._stopSpeaking = () => {
      r.cancel(), i(), this.speech = void 0, this._stopSpeaking = void 0;
    };
  }
  stopSpeaking() {
    if (!this._stopSpeaking)
      throw new Error("No message is being spoken");
    this._stopSpeaking(), this._notifySubscribers();
  }
  connectVoice() {
    var i;
    const t = (i = this.adapters) == null ? void 0 : i.voice;
    if (!t)
      throw new Error("Voice adapter not configured");
    this.disconnectVoice();
    const e = t.connect({});
    this._voiceSession = e;
    const n = [];
    let r = "listening";
    this.voice = {
      status: e.status,
      isMuted: e.isMuted,
      mode: r
    }, this._voiceVolume = 0, this._notifySubscribers(), n.push(e.onStatusChange((o) => {
      o.type === "ended" ? (this._finishVoiceAssistantMessage(), this._voiceSession = void 0, this.voice = void 0) : this.voice = {
        status: o,
        isMuted: e.isMuted,
        mode: r
      }, this._notifySubscribers();
    })), n.push(e.onModeChange((o) => {
      r = o, this.voice && (this.voice = {
        ...this.voice,
        mode: o
      }, this._notifySubscribers());
    })), n.push(e.onVolumeChange((o) => {
      this._voiceVolume = o;
      for (const s of this._voiceVolumeSubscribers)
        s();
    })), n.push(e.onTranscript((o) => {
      this._handleVoiceTranscript(o);
    })), this._voiceUnsubs = n;
  }
  _handleVoiceTranscript(t) {
    if (this.ensureInitialized(), t.role === "user")
      this._finishVoiceAssistantMessage(), this._currentAssistantMsg = null, t.isFinal && (this._voiceMessages.push({
        id: pt(),
        role: "user",
        content: [{
          type: "text",
          text: t.text
        }],
        metadata: { custom: {} },
        createdAt: /* @__PURE__ */ new Date(),
        status: {
          type: "complete",
          reason: "unknown"
        },
        attachments: []
      }), this._markVoiceMessagesDirty(), this._notifySubscribers());
    else {
      if (!this._currentAssistantMsg)
        this._currentAssistantMsg = {
          id: pt(),
          role: "assistant",
          content: [{
            type: "text",
            text: t.text
          }],
          metadata: {
            unstable_state: this.state,
            unstable_annotations: [],
            unstable_data: [],
            steps: [],
            custom: {}
          },
          status: { type: "running" },
          createdAt: /* @__PURE__ */ new Date()
        }, this._voiceMessages.push(this._currentAssistantMsg);
      else {
        const e = this._voiceMessages.indexOf(this._currentAssistantMsg);
        if (e === -1)
          return;
        const n = {
          ...this._currentAssistantMsg,
          content: [{
            type: "text",
            text: t.text
          }],
          ...t.isFinal ? { status: {
            type: "complete",
            reason: "stop"
          } } : {}
        };
        this._voiceMessages[e] = n, this._currentAssistantMsg = n;
      }
      t.isFinal && (this._currentAssistantMsg = null), this._markVoiceMessagesDirty(), this._notifySubscribers();
    }
  }
  _finishVoiceAssistantMessage() {
    const t = this._voiceMessages.at(-1);
    if ((t == null ? void 0 : t.role) === "assistant" && t.status.type === "running") {
      const e = this._voiceMessages.length - 1;
      this._voiceMessages[e] = {
        ...t,
        status: {
          type: "complete",
          reason: "stop"
        }
      }, this._markVoiceMessagesDirty(), this._notifySubscribers();
    }
  }
  disconnectVoice() {
    var t;
    this._finishVoiceAssistantMessage(), this._currentAssistantMsg = null;
    for (const e of this._voiceUnsubs)
      e();
    this._voiceUnsubs = [], (t = this._voiceSession) == null || t.disconnect(), this._voiceSession = void 0, this.voice = void 0, this._voiceVolume = 0;
    for (const e of this._voiceVolumeSubscribers)
      e();
    this._voiceMessages = [], this._markVoiceMessagesDirty(), this._notifySubscribers();
  }
  muteVoice() {
    if (!this._voiceSession)
      throw new Error("No active voice session");
    this._voiceSession.mute(), this.voice = {
      ...this.voice,
      isMuted: !0
    }, this._notifySubscribers();
  }
  unmuteVoice() {
    if (!this._voiceSession)
      throw new Error("No active voice session");
    this._voiceSession.unmute(), this.voice = {
      ...this.voice,
      isMuted: !1
    }, this._notifySubscribers();
  }
  ensureInitialized() {
    this._isInitialized || (this._isInitialized = !0, this._notifyEventSubscribers("initialize", {}));
  }
  export() {
    return this.repository.export();
  }
  import(t) {
    this.ensureInitialized(), this.repository.clear(), this.repository.import(t), this._notifySubscribers();
  }
  reset(t) {
    this.import(_u.fromArray(t ?? []));
  }
  unstable_on(t, e) {
    var i, o;
    const n = e;
    if (t === "modelContextUpdate")
      return ((o = (i = this._contextProvider).subscribe) == null ? void 0 : o.call(i, () => n({}))) ?? (() => {
      });
    let r = this._eventSubscribers.get(t);
    return r || (r = /* @__PURE__ */ new Set(), this._eventSubscribers.set(t, r)), r.add(n), t === "initialize" && this._isInitialized && queueMicrotask(() => {
      r.has(n) && n({});
    }), () => {
      var s;
      (s = this._eventSubscribers.get(t)) == null || s.delete(n);
    };
  }
};
const xv = (t) => {
  const e = R(3), { detectorRef: n } = t;
  let r, i;
  return e[0] !== n ? (r = () => {
    n.current = !0;
  }, i = [n], e[0] = n, e[1] = r, e[2] = i) : (r = e[1], i = e[2]), Hn(r, i), null;
};
var kv = class extends ir {
  constructor(e, n) {
    super();
    C(this, "useRuntimeHook");
    C(this, "instances", /* @__PURE__ */ new Map());
    C(this, "useAliveThreadsKeysChanged", wn(() => ({})));
    C(this, "parent");
    C(this, "_RuntimeBinder", ({ threadId: e, children: n }) => {
      const { useRuntime: r } = this.useRuntimeHook(), i = r(), o = i.thread.__internal_threadBinding, s = It(() => {
        const u = this.instances.get(e);
        if (!u)
          throw new Error("Thread not found. This is a bug in assistant-ui.");
        u.runtime = o.getState(), this._notifySubscribers();
      }, [e, o]), a = ne(!1);
      a.current || s(), Y(() => (a.current = !0, s(), o.outerSubscribe(s)), [o, s]);
      const l = Z(), c = ne(void 0), d = ne(!1);
      return Y(() => {
        const u = o.getState(), h = u.__internal_setGetInitializePromise;
        typeof h == "function" && h.call(u, () => c.current);
      }, [o]), Y(() => (d.current = !1, i.threads.main.unstable_on("initialize", () => {
        if (d.current || l.threadListItem().getState().status !== "new")
          return;
        d.current = !0, c.current = l.threadListItem().initialize();
        const u = i.thread.unstable_on("runEnd", () => {
          u(), l.threadListItem().generateTitle();
        });
      })), [i, l]), /* @__PURE__ */ f(Ke, { children: n });
    });
    C(this, "_OuterActiveThreadProvider", ke(({ threadId: e, provider: n }) => {
      const r = de(() => new ku(this.parent).getItemById(e), [e]), i = ne(!1);
      return Y(() => {
        if ({}.NODE_ENV !== "production" && n !== qt) {
          const o = setTimeout(() => {
            i.current || console.warn("RemoteThreadListAdapter.unstable_Provider did not render its `children` synchronously. Render `children` on first commit; deferring them behind a loading state, Suspense boundary, or `useEffect` gate strands the runtime binder and leaves the thread without context.");
          }, 100);
          return () => clearTimeout(o);
        }
      }, [n]), /* @__PURE__ */ f(zb, {
        runtime: r,
        children: /* @__PURE__ */ f(n, { children: /* @__PURE__ */ f(this._RuntimeBinder, {
          threadId: e,
          children: /* @__PURE__ */ f(xv, { detectorRef: i })
        }) })
      });
    }));
    C(this, "__internal_RenderThreadRuntimes", ({ provider: e }) => (this.useAliveThreadsKeysChanged(), Array.from(this.instances.keys()).map((n) => /* @__PURE__ */ f(this._OuterActiveThreadProvider, {
      threadId: n,
      provider: e
    }, n))));
    this.parent = n, this.useRuntimeHook = wn(() => ({ useRuntime: e }));
  }
  startThreadRuntime(e) {
    return this.instances.has(e) || (this.instances.set(e, {}), this.useAliveThreadsKeysChanged.setState({}, !0)), new Promise((n, r) => {
      const i = () => {
        const s = this.instances.get(e);
        if (!s)
          o(), r(/* @__PURE__ */ new Error("Thread was deleted before runtime was started"));
        else if (s.runtime)
          o(), n(s.runtime);
        else
          return;
      }, o = this.subscribe(i);
      i();
    });
  }
  getThreadRuntimeCore(e) {
    const n = this.instances.get(e);
    if (n)
      return n.runtime;
  }
  stopThreadRuntime(e) {
    this.instances.delete(e), this.useAliveThreadsKeysChanged.setState({}, !0);
  }
  setRuntimeHook(e) {
    this.useRuntimeHook.getState().useRuntime !== e && this.useRuntimeHook.setState({ useRuntime: e }, !0);
  }
};
const sa = (t, e, n) => n.reduce((r, i) => (i == null ? void 0 : i(r, e)) ?? r, t);
var _v = class extends ir {
  constructor(e) {
    super();
    C(this, "_pendingTransforms", []);
    /**
    * `optimistic` callbacks from transforms that have already resolved.
    * Re-applied after every `then` callback so that a wholesale state
    * replacement (e.g. list()) cannot erase earlier completed effects
    * (e.g. delete). Cleared when no pending transforms remain.
    *
    * Correctness requirement: `optimistic` callbacks must be idempotent.
    */
    C(this, "_completedOptimistics", []);
    C(this, "_baseValue");
    C(this, "_cachedValue");
    this._baseValue = e, this._cachedValue = e;
  }
  _updateState() {
    this._cachedValue = this._pendingTransforms.reduce((e, n) => sa(e, n.task, [n.loading, n.optimistic]), this._baseValue), this._notifySubscribers();
  }
  get baseValue() {
    return this._baseValue;
  }
  get value() {
    return this._cachedValue;
  }
  update(e) {
    this._baseValue = e, this._updateState();
  }
  async optimisticUpdate(e) {
    const n = e.execute(), r = {
      ...e,
      task: n
    };
    try {
      this._pendingTransforms.push(r), this._updateState();
      const i = await n;
      this._baseValue = sa(this._baseValue, i, [e.optimistic, e.then]);
      for (const o of this._completedOptimistics)
        this._baseValue = o(this._baseValue);
      return e.optimistic && this._completedOptimistics.push(e.optimistic), i;
    } finally {
      const i = this._pendingTransforms.indexOf(r);
      i > -1 && this._pendingTransforms.splice(i, 1), this._pendingTransforms.length === 0 && (this._completedOptimistics.length = 0), this._updateState();
    }
  }
};
const me = /* @__PURE__ */ new Error("This is the empty thread, a placeholder for the main thread. You cannot perform any actions on this thread instance. This error is probably because you tried to call a thread method in your render function. Call the method inside a `useEffect` hook instead."), Sv = {
  getMessageById() {
  },
  getBranches() {
    return [];
  },
  switchToBranch() {
    throw me;
  },
  append() {
    throw me;
  },
  deleteMessage() {
    throw me;
  },
  startRun() {
    throw me;
  },
  resumeRun() {
    throw me;
  },
  cancelRun() {
    throw me;
  },
  addToolResult() {
    throw me;
  },
  resumeToolCall() {
    throw me;
  },
  respondToToolApproval() {
    throw me;
  },
  speak() {
    throw me;
  },
  stopSpeaking() {
    throw me;
  },
  connectVoice() {
    throw me;
  },
  disconnectVoice() {
    throw me;
  },
  getVoiceVolume: () => 0,
  subscribeVoiceVolume: () => () => {
  },
  muteVoice() {
    throw me;
  },
  unmuteVoice() {
    throw me;
  },
  submitFeedback() {
    throw me;
  },
  getModelContext() {
    return {};
  },
  exportExternalState() {
    throw me;
  },
  importExternalState() {
    throw me;
  },
  composer: {
    attachments: [],
    attachmentAccept: "*",
    async addAttachment() {
      throw me;
    },
    async removeAttachment() {
      throw me;
    },
    isEditing: !0,
    canCancel: !1,
    canSend: !1,
    isEmpty: !0,
    text: "",
    setText() {
      throw me;
    },
    role: "user",
    setRole() {
      throw me;
    },
    runConfig: {},
    setRunConfig() {
      throw me;
    },
    async reset() {
    },
    async clearAttachments() {
    },
    send() {
      throw me;
    },
    cancel() {
    },
    queue: [],
    steerQueueItem() {
    },
    removeQueueItem() {
    },
    dictation: void 0,
    startDictation() {
      throw me;
    },
    stopDictation() {
    },
    quote: void 0,
    setQuote() {
      throw me;
    },
    subscribe() {
      return () => {
      };
    },
    unstable_on() {
      return () => {
      };
    }
  },
  getEditComposer() {
  },
  beginEdit() {
    throw me;
  },
  speech: void 0,
  voice: void 0,
  capabilities: {
    switchToBranch: !1,
    switchBranchDuringRun: !1,
    edit: !1,
    delete: !1,
    reload: !1,
    cancel: !1,
    unstable_copy: !1,
    speech: !1,
    dictation: !1,
    voice: !1,
    attachments: !1,
    feedback: !1,
    queue: !1
  },
  isDisabled: !1,
  isSendDisabled: !1,
  isLoading: !0,
  messages: [],
  state: null,
  suggestions: [],
  extras: void 0,
  subscribe() {
    return () => {
    };
  },
  import() {
    throw me;
  },
  export() {
    return { messages: [] };
  },
  reset() {
    throw me;
  },
  unstable_on() {
    return () => {
    };
  }
};
const aa = (t) => t || void 0, la = (t, e) => {
  for (const n of t) {
    if (e.threadIdMap[n.remoteId] !== void 0)
      continue;
    switch (n.status) {
      case "regular":
        e.threadIds.push(n.remoteId);
        break;
      case "archived":
        e.archivedThreadIds.push(n.remoteId);
        break;
      default: {
        const i = n.status;
        throw new Error(`Unsupported state: ${i}`);
      }
    }
    const r = n.remoteId;
    e.threadIdMap[n.remoteId] = r, e.threadData[r] = {
      id: n.remoteId,
      remoteId: n.remoteId,
      externalId: n.externalId,
      status: n.status,
      title: n.title,
      lastMessageAt: n.lastMessageAt,
      custom: n.custom,
      initializeTask: Promise.resolve({
        remoteId: n.remoteId,
        externalId: n.externalId
      })
    };
  }
  return e;
}, Ft = (t, e) => {
  const n = t.threadIdMap[e];
  if (n !== void 0)
    return t.threadData[n];
}, mr = (t, e, n) => {
  const r = Ft(t, e);
  if (!r)
    return t;
  const { id: i, remoteId: o, status: s } = r;
  if (s === n)
    return t;
  const a = { ...t };
  switch (s) {
    case "new":
      a.newThreadId = void 0;
      break;
    case "regular":
      a.threadIds = a.threadIds.filter((l) => l !== i);
      break;
    case "archived":
      a.archivedThreadIds = a.archivedThreadIds.filter((l) => l !== i);
      break;
    default:
      throw new Error(`Unsupported state: ${s}`);
  }
  switch (n) {
    case "regular":
      a.threadIds = [i, ...a.threadIds];
      break;
    case "archived":
      a.archivedThreadIds = [i, ...a.archivedThreadIds];
      break;
    case "deleted":
      a.threadData = Object.fromEntries(Object.entries(a.threadData).filter(([l]) => l !== i)), a.threadIdMap = Object.fromEntries(Object.entries(a.threadIdMap).filter(([l]) => l !== i && l !== o));
      break;
    default:
      throw new Error(`Unsupported state: ${n}`);
  }
  return n !== "deleted" && (a.threadData = {
    ...a.threadData,
    [i]: {
      ...r,
      status: n
    }
  }), a;
};
var Cv = class extends ir {
  constructor(e, n) {
    super();
    C(this, "_options");
    C(this, "_hookManager");
    C(this, "_loadThreadsPromise");
    C(this, "_loadMorePromise");
    C(this, "_loadGeneration", 0);
    C(this, "_mainThreadId");
    C(this, "_state", new _v({
      isLoading: !0,
      isLoadingMore: !1,
      cursor: void 0,
      newThreadId: void 0,
      threadIds: [],
      archivedThreadIds: [],
      threadIdMap: {},
      threadData: {}
    }));
    C(this, "contextProvider");
    C(this, "_initialThreadLoaded", !1);
    C(this, "useProvider");
    C(this, "_lastNotifiedThreadId");
    C(this, "initialize", async (e) => {
      if (this._state.value.newThreadId !== e) {
        const n = this.getItemById(e);
        if (!n)
          throw new Error("Thread not found");
        if (n.status === "new")
          throw new Error("Unexpected new state");
        return n.initializeTask;
      }
      return this._state.optimisticUpdate({
        execute: () => this._options.adapter.initialize(e),
        optimistic: (n) => mr(n, e, "regular"),
        loading: (n, r) => {
          const i = e;
          return {
            ...n,
            threadData: {
              ...n.threadData,
              [i]: {
                ...n.threadData[i],
                initializeTask: r
              }
            }
          };
        },
        then: (n, { remoteId: r, externalId: i }) => {
          const o = Ft(n, e);
          if (!o)
            return n;
          const s = e;
          return {
            ...n,
            threadIdMap: {
              ...n.threadIdMap,
              [r]: s
            },
            threadData: {
              ...n.threadData,
              [s]: {
                ...o,
                initializeTask: Promise.resolve({
                  remoteId: r,
                  externalId: i
                }),
                remoteId: r,
                externalId: i
              }
            }
          };
        }
      });
    });
    C(this, "generateTitle", async (e) => {
      var l;
      const n = this.getItemById(e);
      if (!n)
        throw new Error("Thread not found");
      if (n.status === "new")
        throw new Error("Thread is not yet initialized");
      const { remoteId: r } = await n.initializeTask, i = this._hookManager.getThreadRuntimeCore(n.id);
      if (!i)
        return;
      const o = i.messages, s = await this._options.adapter.generateTitle(r, o), a = Db.fromAssistantStream(s);
      for await (const c of a) {
        const d = (l = c.parts.filter((p) => p.type === "text")[0]) == null ? void 0 : l.text, u = this._state.baseValue, h = Ft(u, n.id);
        h && this._state.update({
          ...u,
          threadData: {
            ...u.threadData,
            [h.id]: {
              ...h,
              title: d
            }
          }
        });
      }
    });
    C(this, "useBoundIds", wn(() => []));
    C(this, "__internal_RenderComponent", () => {
      const e = xo();
      Y(() => (this.useBoundIds.setState((o) => [...o, e], !0), () => {
        this.useBoundIds.setState((o) => o.filter((s) => s !== e), !0);
      }), [e]);
      const n = this.useBoundIds(), { Provider: r } = this.useProvider(), i = { modelContext: this.contextProvider };
      return (n.length === 0 || n[0] === e) && /* @__PURE__ */ f(xu, {
        adapters: i,
        children: /* @__PURE__ */ f(this._hookManager.__internal_RenderThreadRuntimes, { provider: r })
      });
    });
    this.contextProvider = n, this._state.subscribe(() => {
      this._notifySubscribers(), this._notifyThreadIdChange();
    }), this._hookManager = new kv(e.runtimeHook, this), this.useProvider = wn(() => ({ Provider: e.adapter.unstable_Provider ?? qt })), this.__internal_setOptions(e), this.switchToNewThread();
  }
  get threadItems() {
    return this._state.value.threadData;
  }
  getLoadThreadsPromise() {
    if (!this._loadThreadsPromise) {
      const e = this._loadGeneration;
      this._loadThreadsPromise = this._state.optimisticUpdate({
        execute: () => this._options.adapter.list(),
        loading: (n) => ({
          ...n,
          isLoading: !0
        }),
        then: (n, r) => {
          if (e !== this._loadGeneration)
            return n;
          const i = la(r.threads, {
            threadIds: [],
            archivedThreadIds: [],
            threadIdMap: {},
            threadData: {}
          });
          return {
            ...n,
            isLoading: !1,
            cursor: aa(r.nextCursor),
            threadIds: i.threadIds,
            archivedThreadIds: i.archivedThreadIds,
            threadIdMap: {
              ...n.threadIdMap,
              ...i.threadIdMap
            },
            threadData: {
              ...n.threadData,
              ...i.threadData
            }
          };
        }
      }).catch((n) => {
        e === this._loadGeneration && (console.error("[assistant-ui] thread list load failed:", n), this._loadThreadsPromise = void 0, this._state.update({
          ...this._state.baseValue,
          isLoading: !1
        }));
      }).then(() => {
      });
    }
    return this._loadThreadsPromise;
  }
  loadMore() {
    if (this._loadMorePromise)
      return this._loadMorePromise;
    const e = this._state.value;
    if (e.cursor === void 0 || e.isLoading)
      return Promise.resolve();
    const n = this._loadGeneration, r = this._options.adapter, i = e.cursor, o = this._state.optimisticUpdate({
      execute: () => r.list({ after: i }),
      loading: (s) => ({
        ...s,
        isLoadingMore: !0
      }),
      then: (s, a) => {
        if (n !== this._loadGeneration || r !== this._options.adapter)
          return s;
        const l = la(a.threads, {
          threadIds: [...s.threadIds],
          archivedThreadIds: [...s.archivedThreadIds],
          threadIdMap: { ...s.threadIdMap },
          threadData: { ...s.threadData }
        });
        return {
          ...s,
          isLoadingMore: !1,
          cursor: aa(a.nextCursor),
          threadIds: l.threadIds,
          archivedThreadIds: l.archivedThreadIds,
          threadIdMap: l.threadIdMap,
          threadData: l.threadData
        };
      }
    }).catch((s) => {
      console.error("[assistant-ui] thread list loadMore failed:", s);
    }).then(() => {
      this._loadMorePromise === o && (this._loadMorePromise = void 0);
    });
    return this._loadMorePromise = o, o;
  }
  __internal_setOptions(e) {
    if (this._options === e)
      return;
    const n = this._options !== void 0 && this._options.adapter !== e.adapter;
    this._options = e;
    const r = e.adapter.unstable_Provider ?? qt;
    r !== this.useProvider.getState().Provider && this.useProvider.setState({ Provider: r }, !0), this._hookManager.setRuntimeHook(e.runtimeHook), n && (this._loadGeneration++, this._loadThreadsPromise = void 0, this._loadMorePromise = void 0, this._state.update({
      ...this._state.baseValue,
      cursor: void 0
    }));
  }
  __internal_load() {
    this.getLoadThreadsPromise();
    const e = this._options.threadId ?? this._options.initialThreadId;
    !this._initialThreadLoaded && e && (this._initialThreadLoaded = !0, this.switchToThread(e).catch(() => {
    }));
  }
  reload() {
    return this._loadGeneration++, this._loadThreadsPromise = void 0, this._loadMorePromise = void 0, this._state.update({
      ...this._state.baseValue,
      cursor: void 0
    }), this.getLoadThreadsPromise();
  }
  get isLoading() {
    return this._state.value.isLoading;
  }
  get isLoadingMore() {
    return this._state.value.isLoadingMore;
  }
  get hasMore() {
    return this._state.value.cursor !== void 0;
  }
  get threadIds() {
    return this._state.value.threadIds;
  }
  get archivedThreadIds() {
    return this._state.value.archivedThreadIds;
  }
  get newThreadId() {
    return this._state.value.newThreadId;
  }
  get mainThreadId() {
    return this._mainThreadId;
  }
  get _mainThreadRemoteId() {
    var e;
    if (this._mainThreadId !== void 0)
      return (e = Ft(this._state.value, this._mainThreadId)) == null ? void 0 : e.remoteId;
  }
  _notifyThreadIdChange() {
    var n, r;
    const e = this._mainThreadRemoteId;
    this._lastNotifiedThreadId !== e && (this._lastNotifiedThreadId = e, (r = (n = this._options).onThreadIdChange) == null || r.call(n, e));
  }
  getMainThreadRuntimeCore() {
    const e = this._hookManager.getThreadRuntimeCore(this._mainThreadId);
    return e || Sv;
  }
  getThreadRuntimeCore(e) {
    const n = this.getItemById(e);
    if (!n)
      throw new Error("Thread not found");
    const r = this._hookManager.getThreadRuntimeCore(n.id);
    if (!r)
      throw new Error("Thread not found");
    return r;
  }
  getItemById(e) {
    return Ft(this._state.value, e);
  }
  async switchToThread(e, n) {
    let r = this.getItemById(e);
    if (!r) {
      const o = await this._options.adapter.fetch(e), s = this._state.value, a = o.remoteId, l = {
        ...s.threadData,
        [a]: {
          id: a,
          initializeTask: Promise.resolve({
            remoteId: o.remoteId,
            externalId: o.externalId
          }),
          remoteId: o.remoteId,
          externalId: o.externalId,
          status: o.status,
          title: o.title,
          lastMessageAt: o.lastMessageAt,
          custom: o.custom
        }
      }, c = {
        ...s.threadIdMap,
        [o.remoteId]: a
      }, d = s.threadIds.filter((m) => m !== o.remoteId), u = s.archivedThreadIds.filter((m) => m !== o.remoteId), h = o.status === "regular" ? [...d, o.remoteId] : d, p = o.status === "archived" ? [...u, o.remoteId] : u;
      this._state.update({
        ...s,
        threadIds: h,
        archivedThreadIds: p,
        threadIdMap: c,
        threadData: l
      }), r = this.getItemById(e);
    }
    if (!r)
      throw new Error("Thread not found");
    if (this._mainThreadId === r.id)
      return;
    const i = this._hookManager.startThreadRuntime(r.id);
    this.mainThreadId !== void 0 ? await i : i.then(() => this._notifySubscribers()), r.status === "archived" && (n == null ? void 0 : n.unarchive) !== !1 && await this.unarchive(r.id), this._mainThreadId = r.id, this._notifySubscribers(), this._notifyThreadIdChange();
  }
  async switchToNewThread() {
    for (; this._state.baseValue.newThreadId !== void 0 && this._state.value.newThreadId === void 0; )
      await this._state.waitForUpdate();
    const e = this._state.value;
    let n = this._state.value.newThreadId;
    if (n === void 0) {
      do
        n = `__LOCALID_${pt()}`;
      while (e.threadIdMap[n]);
      const r = n;
      this._state.update({
        ...e,
        newThreadId: n,
        threadIdMap: {
          ...e.threadIdMap,
          [n]: r
        },
        threadData: {
          ...e.threadData,
          [r]: {
            status: "new",
            id: n,
            remoteId: void 0,
            externalId: void 0,
            title: void 0,
            custom: void 0
          }
        }
      });
    }
    return this.switchToThread(n);
  }
  rename(e, n) {
    const r = this.getItemById(e);
    if (!r)
      throw new Error("Thread not found");
    if (r.status === "new")
      throw new Error("Thread is not yet initialized");
    return this._state.optimisticUpdate({
      execute: async () => {
        const { remoteId: i } = await r.initializeTask;
        return this._options.adapter.rename(i, n);
      },
      optimistic: (i) => {
        const o = Ft(i, e);
        return o ? {
          ...i,
          threadData: {
            ...i.threadData,
            [o.id]: {
              ...o,
              title: n
            }
          }
        } : i;
      }
    });
  }
  updateCustom(e, n) {
    const r = this.getItemById(e);
    if (!r)
      throw new Error("Thread not found");
    if (r.status === "new")
      throw new Error("Thread is not yet initialized");
    if (!this._options.adapter.updateCustom)
      throw new Error("Remote thread list adapter does not support updating custom metadata");
    return this._state.optimisticUpdate({
      execute: async () => {
        const { remoteId: i } = await r.initializeTask, o = this._options.adapter;
        if (!o.updateCustom)
          throw new Error("Remote thread list adapter does not support updating custom metadata");
        return o.updateCustom(i, n);
      },
      optimistic: (i) => {
        const o = Ft(i, e);
        return o ? {
          ...i,
          threadData: {
            ...i.threadData,
            [o.id]: {
              ...o,
              custom: n
            }
          }
        } : i;
      }
    });
  }
  async _ensureThreadIsNotMain(e) {
    if (e === this.newThreadId)
      throw new Error("Cannot ensure new thread is not main");
    e === this._mainThreadId && await this.switchToNewThread();
  }
  async archive(e) {
    const n = this.getItemById(e);
    if (!n)
      throw new Error("Thread not found");
    if (n.status !== "regular")
      throw new Error("Thread is not yet initialized or already archived");
    return await this._ensureThreadIsNotMain(n.id), this._state.optimisticUpdate({
      execute: async () => {
        const { remoteId: r } = await n.initializeTask;
        return this._options.adapter.archive(r);
      },
      optimistic: (r) => mr(r, n.id, "archived")
    });
  }
  unarchive(e) {
    const n = this.getItemById(e);
    if (!n)
      throw new Error("Thread not found");
    if (n.status !== "archived")
      throw new Error("Thread is not archived");
    return this._state.optimisticUpdate({
      execute: async () => {
        try {
          const { remoteId: r } = await n.initializeTask;
          return await this._options.adapter.unarchive(r);
        } catch (r) {
          throw await this._ensureThreadIsNotMain(n.id), r;
        }
      },
      optimistic: (r) => mr(r, n.id, "regular")
    });
  }
  async delete(e) {
    const n = this.getItemById(e);
    if (!n)
      throw new Error("Thread not found");
    if (n.status !== "regular" && n.status !== "archived")
      throw new Error("Thread is not yet initialized");
    return await this._ensureThreadIsNotMain(n.id), this._hookManager.stopThreadRuntime(n.id), this._state.optimisticUpdate({
      execute: async () => {
        const { remoteId: r } = await n.initializeTask;
        return await this._options.adapter.delete(r);
      },
      optimistic: (r) => mr(r, n.id, "deleted")
    });
  }
  async detach(e) {
    const n = this.getItemById(e);
    if (!n)
      throw new Error("Thread not found");
    if (n.status !== "regular" && n.status !== "archived")
      throw new Error("Thread is not yet initialized");
    await this._ensureThreadIsNotMain(n.id), this._hookManager.stopThreadRuntime(n.id);
  }
}, Tv = class extends Bo {
  constructor(e) {
    super();
    C(this, "threads");
    this.threads = new Cv(e, this._contextProvider);
  }
  get RenderComponent() {
    return this.threads.__internal_RenderComponent;
  }
};
const Iv = (t) => {
  const e = R(10);
  let n;
  e[0] !== t ? (n = () => new Tv(t), e[0] = t, e[1] = n) : n = e[1];
  const [r] = xe(n);
  let i;
  e[2] !== t || e[3] !== r.threads ? (i = () => {
    r.threads.__internal_setOptions(t), r.threads.__internal_load();
  }, e[2] = t, e[3] = r.threads, e[4] = i) : i = e[4];
  let o;
  e[5] !== t || e[6] !== r ? (o = [r, t], e[5] = t, e[6] = r, e[7] = o) : o = e[7], Y(i, o);
  let s;
  return e[8] !== r ? (s = new Fo(r), e[8] = r, e[9] = s) : s = e[9], s;
}, Av = (t) => {
  const e = ne(t.runtimeHook);
  e.current = t.runtimeHook;
  const n = ne(t.threadId ?? t.initialThreadId), r = It(() => e.current(), []), i = qe((l) => {
    var c;
    (c = t.onThreadIdChange) == null || c.call(t, l);
  }), o = de(() => ({
    adapter: t.adapter,
    allowNesting: t.allowNesting,
    initialThreadId: n.current,
    runtimeHook: r,
    onThreadIdChange: i
  }), [
    t.adapter,
    t.allowNesting,
    r
  ]);
  if (Z().threadListItem.source !== null) {
    if (!o.allowNesting)
      throw new Error("useRemoteThreadListRuntime cannot be nested inside another RemoteThreadListRuntime. Set allowNesting: true to allow nesting (the inner runtime will become a no-op).");
    return r();
  }
  const s = Iv(o), a = ne(t.threadId);
  return Y(() => {
    t.threadId !== a.current && (a.current = t.threadId, t.threadId ? s.threads.switchToThread(t.threadId).catch(() => {
    }) : s.threads.switchToNewThread().catch(() => {
    }));
  }, [s, t.threadId]), s;
};
function Ev(t) {
  var n;
  const e = ((n = t.status) == null ? void 0 : n.type) === "running" ? {
    type: "incomplete",
    reason: "cancelled"
  } : t.status;
  return {
    role: t.role,
    content: t.content.map((r) => {
      const i = r.type;
      switch (i) {
        case "text":
          return {
            type: "text",
            text: r.text
          };
        case "reasoning":
          return {
            type: "reasoning",
            text: r.text
          };
        case "source":
          return r.sourceType === "url" ? {
            type: "source",
            sourceType: "url",
            id: r.id,
            url: r.url,
            ...r.title != null ? { title: r.title } : void 0,
            ...r.providerMetadata != null ? { providerMetadata: r.providerMetadata } : void 0
          } : {
            type: "source",
            sourceType: "document",
            id: r.id,
            title: r.title,
            mediaType: r.mediaType,
            ...r.filename != null ? { filename: r.filename } : void 0,
            ...r.providerMetadata != null ? { providerMetadata: r.providerMetadata } : void 0
          };
        case "tool-call":
          return yn(r.result) || console.warn(`tool-call result is not JSON! ${JSON.stringify(r)}`), {
            type: "tool-call",
            toolCallId: r.toolCallId,
            toolName: r.toolName,
            ...JSON.stringify(r.args) === r.argsText ? { args: r.args } : { argsText: r.argsText },
            ...r.result ? { result: r.result } : void 0,
            ...r.isError ? { isError: !0 } : void 0
          };
        case "image":
          return {
            type: "image",
            image: r.image
          };
        case "file":
          return {
            type: "file",
            data: r.data,
            mimeType: r.mimeType,
            ...r.filename ? { filename: r.filename } : void 0
          };
        default:
          throw new Error(`Message part type not supported by aui/v0: ${i}`);
      }
    }),
    metadata: t.metadata,
    ...e ? { status: e } : void 0
  };
}
function Rv(t) {
  const e = t.content, n = zr({
    id: t.id,
    createdAt: t.created_at,
    ...e
  }, t.id, {
    type: "complete",
    reason: "unknown"
  });
  return {
    parentId: t.parent_id,
    message: n
  };
}
const ca = (t) => {
  try {
    const e = t.split(".")[1];
    if (!e)
      throw new Error("Invalid JWT format");
    let n = e.replace(/-/g, "+").replace(/_/g, "/");
    for (; n.length % 4 !== 0; )
      n += "=";
    const r = atob(n), i = JSON.parse(r).exp;
    if (!i || typeof i != "number")
      throw new Error('JWT does not contain a valid "exp" field');
    return i * 1e3;
  } catch (e) {
    throw new Error(`Unable to determine the token expiry: ${e}`);
  }
};
var Xn, uc, Iu = (uc = class {
  constructor(t) {
    C(this, "strategy", "jwt");
    C(this, "cachedToken", null);
    C(this, "tokenExpiry", null);
    Nn(this, Xn, void 0);
    Dn(this, Xn, t);
  }
  async getAuthHeaders() {
    const t = Date.now();
    if (this.cachedToken && this.tokenExpiry && this.tokenExpiry - t > 30 * 1e3)
      return { Authorization: `Bearer ${this.cachedToken}` };
    const e = await Pn(this, Xn).call(this);
    return e ? (this.cachedToken = e, this.tokenExpiry = ca(e), { Authorization: `Bearer ${e}` }) : !1;
  }
  readAuthHeaders(t) {
    const e = t.get("Authorization");
    if (!e)
      return;
    const [n, r] = e.split(" ");
    if (n !== "Bearer" || !r)
      throw new Error("Invalid auth header received");
    this.cachedToken = r, this.tokenExpiry = ca(r);
  }
}, Xn = new WeakMap(), uc), Zn, er, tr, dc, Mv = (dc = class {
  constructor(t, e, n) {
    C(this, "strategy", "api-key");
    Nn(this, Zn, void 0);
    Nn(this, er, void 0);
    Nn(this, tr, void 0);
    Dn(this, Zn, t), Dn(this, er, e), Dn(this, tr, n);
  }
  async getAuthHeaders() {
    return {
      Authorization: `Bearer ${Pn(this, Zn)}`,
      "Aui-User-Id": Pn(this, er),
      "Aui-Workspace-Id": Pn(this, tr)
    };
  }
  readAuthHeaders() {
  }
}, Zn = new WeakMap(), er = new WeakMap(), tr = new WeakMap(), dc);
const fr = "aui:refresh_token";
var Pv = class {
  constructor(t) {
    C(this, "strategy", "anon");
    C(this, "baseUrl");
    C(this, "jwtStrategy");
    this.baseUrl = t, this.jwtStrategy = new Iu(async () => {
      const e = Date.now(), n = localStorage.getItem(fr), r = n ? JSON.parse(n) : void 0;
      if (r)
        if (new Date(r.expires_at).getTime() - e > 30 * 1e3) {
          const a = await fetch(`${this.baseUrl}/v1/auth/tokens/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: r.token })
          });
          if (a.ok) {
            const { access_token: l, refresh_token: c } = await a.json();
            return c && localStorage.setItem(fr, JSON.stringify(c)), l;
          }
        } else
          localStorage.removeItem(fr);
      const i = await fetch(`${this.baseUrl}/v1/auth/tokens/anonymous`, { method: "POST" });
      if (!i.ok)
        return null;
      const { access_token: o, refresh_token: s } = await i.json();
      return !o || !s ? null : (localStorage.setItem(fr, JSON.stringify(s)), o);
    });
  }
  async getAuthHeaders() {
    return this.jwtStrategy.getAuthHeaders();
  }
  readAuthHeaders(t) {
    this.jwtStrategy.readAuthHeaders(t);
  }
}, ua = class extends Error {
  constructor(t) {
    super(t), this.name = "APIError";
  }
}, Nv = class {
  constructor(t) {
    C(this, "_auth");
    C(this, "_baseUrl");
    if ("authToken" in t)
      this._baseUrl = t.baseUrl, this._auth = new Iu(t.authToken);
    else if ("apiKey" in t)
      this._baseUrl = (t.baseUrl ?? "https://backend.assistant-api.com").replace(/\/$/, ""), this._auth = new Mv(t.apiKey, t.userId, t.workspaceId);
    else if ("anonymous" in t)
      this._baseUrl = t.baseUrl, this._auth = new Pv(t.baseUrl);
    else
      throw new Error("Invalid configuration: Must provide authToken, apiKey, or anonymous configuration");
  }
  async initializeAuth() {
    return !!this._auth.getAuthHeaders();
  }
  async makeRawRequest(t, e = {}) {
    const n = await this._auth.getAuthHeaders();
    if (!n)
      throw new Error("Authorization failed");
    const r = {
      ...n,
      ...e.headers,
      "Content-Type": "application/json"
    }, i = new URLSearchParams();
    if (e.query)
      for (const [a, l] of Object.entries(e.query))
        l !== !1 && (l === !0 ? i.set(a, "true") : i.set(a, l.toString()));
    const o = new URL(`${this._baseUrl}/v1${t}`);
    o.search = i.toString();
    const s = await fetch(o, {
      method: e.method ?? "GET",
      headers: r,
      body: e.body ? JSON.stringify(e.body) : null
    });
    if (this._auth.readAuthHeaders(s.headers), !s.ok) {
      const a = await s.text();
      try {
        throw new ua(JSON.parse(a).message);
      } catch (l) {
        throw l instanceof ua ? l : new Error(`Request failed with status ${s.status}, ${a}`);
      }
    }
    return s;
  }
  async makeRequest(t, e = {}) {
    return (await this.makeRawRequest(t, e)).json();
  }
}, Dv = class {
  constructor(t) {
    C(this, "cloud");
    this.cloud = t;
  }
  async create() {
    return this.cloud.makeRequest("/auth/tokens", { method: "POST" });
  }
};
const Xi = {
  /**
  * Converts an {@link AssistantStream} into a `Response` using the supplied
  * encoder.
  *
  * The encoder's `headers` are copied onto the response. Pair this with the
  * decoder for the same wire format when consuming the response.
  */
  toResponse(t, e) {
    return new Response(Xi.toByteStream(t, e), { headers: e.headers ?? {} });
  },
  /**
  * Reads an assistant stream from a `Response` body using the supplied
  * decoder.
  *
  * The response body must be present and encoded with the matching assistant
  * stream wire format.
  */
  fromResponse(t, e) {
    return Xi.fromByteStream(t.body, e);
  },
  /**
  * Pipes an {@link AssistantStream} through an encoder and returns the
  * resulting byte stream.
  */
  toByteStream(t, e) {
    return t.pipeThrough(e);
  },
  /**
  * Pipes a byte stream through a decoder and returns normalized
  * {@link AssistantStreamChunk} values.
  */
  fromByteStream(t, e) {
    return t.pipeThrough(e);
  }
}, Au = () => {
  let t, e;
  const n = new Promise((r, i) => {
    t = r, e = i;
  });
  if (!t || !e)
    throw new Error("Failed to create promise");
  return {
    promise: n,
    resolve: t,
    reject: e
  };
}, Lv = () => {
  const t = [];
  let e = !1, n, r;
  const i = (o) => {
    o.promise || (o.promise = o.reader.read().then(({ done: s, value: a }) => {
      o.promise = void 0, s ? (t.splice(t.indexOf(o), 1), e && t.length === 0 && n.close()) : n.enqueue(a), r == null || r.resolve(), r = void 0;
    }).catch((s) => {
      console.error(s), t.forEach((a) => {
        a.reader.cancel();
      }), t.length = 0, n.error(s), r == null || r.reject(s), r = void 0;
    }));
  };
  return {
    readable: new ReadableStream({
      start(o) {
        n = o;
      },
      pull() {
        return r = Au(), t.forEach((o) => {
          i(o);
        }), r.promise;
      },
      cancel() {
        t.forEach((o) => {
          o.reader.cancel();
        }), t.length = 0;
      }
    }),
    isSealed() {
      return e;
    },
    seal() {
      e = !0, t.length === 0 && n.close();
    },
    addStream(o) {
      if (e)
        throw new Error("Cannot add streams after the run callback has settled.");
      const s = { reader: o.getReader() };
      t.push(s), i(s);
    },
    enqueue(o) {
      this.addStream(new ReadableStream({ start(s) {
        s.enqueue(o), s.close();
      } }));
    }
  };
};
var da = class {
  constructor(t) {
    C(this, "_controller");
    C(this, "_isClosed", !1);
    this._controller = t;
  }
  append(t) {
    return this._controller.enqueue({
      type: "text-delta",
      path: [],
      textDelta: t
    }), this;
  }
  close() {
    this._isClosed || (this._isClosed = !0, this._controller.enqueue({
      type: "part-finish",
      path: []
    }), this._controller.close());
  }
};
const Eu = (t) => new ReadableStream({
  start(e) {
    var n;
    return (n = t.start) == null ? void 0 : n.call(t, new da(e));
  },
  pull(e) {
    var n;
    return (n = t.pull) == null ? void 0 : n.call(t, new da(e));
  },
  cancel(e) {
    var n;
    return (n = t.cancel) == null ? void 0 : n.call(t, e);
  }
}), ha = () => {
  let t;
  return [Eu({ start(e) {
    t = e;
  } }), t];
};
var pa = class {
  constructor(t) {
    C(this, "_controller");
    C(this, "_isClosed", !1);
    C(this, "_mergeTask");
    C(this, "_argsTextController");
    this._controller = t;
    const e = Eu({ start: (r) => {
      this._argsTextController = r;
    } });
    let n = !1;
    this._mergeTask = e.pipeTo(new WritableStream({ write: (r) => {
      switch (r.type) {
        case "text-delta":
          n = !0, this._controller.enqueue(r);
          break;
        case "part-finish":
          n || this._controller.enqueue({
            type: "text-delta",
            textDelta: "{}",
            path: []
          }), this._controller.enqueue({
            type: "tool-call-args-text-finish",
            path: []
          });
          break;
        default:
          throw new Error(`Unexpected chunk type: ${r.type}`);
      }
    } }));
  }
  get argsText() {
    return this._argsTextController;
  }
  async setResponse(t) {
    this._argsTextController.close(), await Promise.resolve(), this._controller.enqueue({
      type: "result",
      path: [],
      ...t.artifact !== void 0 ? { artifact: t.artifact } : {},
      result: t.result,
      isError: t.isError ?? !1,
      ...t.modelContent !== void 0 ? { modelContent: t.modelContent } : {},
      ...t.messages !== void 0 ? { messages: t.messages } : {}
    });
  }
  async close() {
    this._isClosed || (this._isClosed = !0, this._argsTextController.close(), await this._mergeTask, this._controller.enqueue({
      type: "part-finish",
      path: []
    }), this._controller.close());
  }
};
const zv = (t) => new ReadableStream({
  start(e) {
    var n;
    return (n = t.start) == null ? void 0 : n.call(t, new pa(e));
  },
  pull(e) {
    var n;
    return (n = t.pull) == null ? void 0 : n.call(t, new pa(e));
  },
  cancel(e) {
    var n;
    return (n = t.cancel) == null ? void 0 : n.call(t, e);
  }
}), Ov = () => {
  let t;
  return [zv({ start(e) {
    t = e;
  } }), t];
};
var Ru = class {
  constructor() {
    C(this, "value", -1);
  }
  up() {
    return ++this.value;
  }
}, $v = class extends TransformStream {
  constructor(t) {
    super({ transform(e, n) {
      n.enqueue({
        ...e,
        path: [t, ...e.path]
      });
    } });
  }
};
(class extends TransformStream {
  constructor(t) {
    super({ transform(e, n) {
      const { path: [r, ...i] } = e;
      if (t !== r)
        throw new Error(`Path mismatch: expected ${t}, got ${r}`);
      n.enqueue({
        ...e,
        path: i
      });
    } });
  }
});
var Fv = class extends TransformStream {
  constructor(t) {
    const e = new Ru(), n = /* @__PURE__ */ new Map();
    super({ transform(r, i) {
      r.type === "part-start" && r.path.length === 0 && n.set(e.up(), t.up());
      const [o, ...s] = r.path;
      if (o === void 0) {
        i.enqueue(r);
        return;
      }
      const a = n.get(o);
      if (a === void 0)
        throw new Error("Path not found");
      i.enqueue({
        ...r,
        path: [a, ...s]
      });
    } });
  }
};
let Bv = (t, e = 21) => (n = e) => {
  let r = "", i = n | 0;
  for (; i-- > 0; )
    r += t[Math.random() * t.length | 0];
  return r;
};
const Uv = Bv("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
var jv = class Mu {
  constructor(e) {
    C(this, "_state");
    C(this, "_parentId");
    this._state = e || {
      merger: Lv(),
      contentCounter: new Ru()
    };
  }
  get __internal_isClosed() {
    return this._state.merger.isSealed();
  }
  __internal_getReadable() {
    return this._state.merger.readable;
  }
  __internal_subscribeToClose(e) {
    this._state.closeSubscriber = e;
  }
  _addPart(e, n) {
    this._state.append && (this._state.append.controller.close(), this._state.append = void 0), this.enqueue({
      type: "part-start",
      part: e,
      path: []
    }), this._state.merger.addStream(n.pipeThrough(new $v(this._state.contentCounter.value)));
  }
  merge(e) {
    this._state.merger.addStream(e.pipeThrough(new Fv(this._state.contentCounter)));
  }
  appendText(e) {
    var n;
    (((n = this._state.append) == null ? void 0 : n.kind) !== "text" || this._state.append.parentId !== this._parentId) && (this._state.append = {
      kind: "text",
      parentId: this._parentId,
      controller: this.addTextPart()
    }), this._state.append.controller.append(e);
  }
  appendReasoning(e) {
    var n;
    (((n = this._state.append) == null ? void 0 : n.kind) !== "reasoning" || this._state.append.parentId !== this._parentId) && (this._state.append = {
      kind: "reasoning",
      parentId: this._parentId,
      controller: this.addReasoningPart()
    }), this._state.append.controller.append(e);
  }
  addTextPart() {
    const [e, n] = ha();
    return this._addPart(this._withParentIdOption({ type: "text" }), e), n;
  }
  addReasoningPart() {
    const [e, n] = ha();
    return this._addPart(this._withParentIdOption({ type: "reasoning" }), e), n;
  }
  addToolCallPart(e) {
    const n = typeof e == "string" ? { toolName: e } : e, r = n.toolName, i = n.toolCallId ?? Uv(), [o, s] = Ov();
    return this._addPart({
      type: "tool-call",
      toolName: r,
      toolCallId: i,
      ...this._parentId && { parentId: this._parentId }
    }, o), n.argsText !== void 0 && (s.argsText.append(n.argsText), s.argsText.close()), n.args !== void 0 && (s.argsText.append(JSON.stringify(n.args)), s.argsText.close()), n.response !== void 0 && s.setResponse(n.response), s;
  }
  _finishedPartStream() {
    return new ReadableStream({ start(e) {
      e.enqueue({
        type: "part-finish",
        path: []
      }), e.close();
    } });
  }
  _withParentIdOption(e) {
    return this._parentId ? {
      ...e,
      parentId: this._parentId
    } : e;
  }
  appendSource(e) {
    this._addPart(this._withParentIdOption(e), this._finishedPartStream());
  }
  appendFile(e) {
    this._addPart(this._withParentIdOption(e), this._finishedPartStream());
  }
  appendData(e) {
    this._addPart(this._withParentIdOption(e), this._finishedPartStream());
  }
  enqueue(e) {
    this._state.merger.enqueue(e), e.type === "part-start" && e.path.length === 0 && this._state.contentCounter.up();
  }
  withParentId(e) {
    const n = new Mu(this._state);
    return n._parentId = e, n;
  }
  close() {
    var e, n, r, i;
    (n = (e = this._state.append) == null ? void 0 : e.controller) == null || n.close(), this._state.merger.seal(), (i = (r = this._state).closeSubscriber) == null || i.call(r);
  }
};
function Vv(t) {
  const e = new jv();
  return (async () => {
    try {
      await t(e);
    } catch (r) {
      throw e.__internal_isClosed || e.enqueue({
        type: "error",
        path: [],
        error: String(r)
      }), r;
    } finally {
      e.__internal_isClosed || e.close();
    }
  })(), e.__internal_getReadable();
}
function qv() {
  const { resolve: t, promise: e } = Au();
  let n;
  return [Vv((r) => (n = r, n.__internal_subscribeToClose(t), e)), n];
}
var Hv = class extends TransformStream {
  constructor(t, e, n) {
    const [r, i] = qv();
    let o;
    super({
      start(s) {
        var a;
        return o = r.pipeTo(new WritableStream({
          write(l) {
            s.enqueue(l);
          },
          abort(l) {
            s.error(l);
          },
          close() {
            s.terminate();
          }
        })).catch((l) => {
          s.error(l);
        }), (a = t.start) == null ? void 0 : a.call(t, i);
      },
      transform(s) {
        var a;
        return (a = t.transform) == null ? void 0 : a.call(t, s, i);
      },
      async flush() {
        var s;
        await ((s = t.flush) == null ? void 0 : s.call(t, i)), i.close(), await o;
      }
    }, e, n);
  }
}, Wv = class extends TransformStream {
  constructor(t) {
    super();
    const e = t(super.readable);
    Object.defineProperty(this, "readable", {
      value: e,
      writable: !1
    });
  }
}, Gv = class extends Wv {
  constructor() {
    super((t) => {
      const e = new Hv({ transform(n, r) {
        r.appendText(n);
      } });
      return t.pipeThrough(new TextDecoderStream()).pipeThrough(e);
    });
  }
}, Kv = class {
  constructor(t) {
    C(this, "cloud");
    this.cloud = t;
  }
  __internal_getAssistantOptions(t) {
    return {
      api: `${this.cloud._baseUrl}/v1/runs/stream`,
      headers: async () => {
        const e = await this.cloud._auth.getAuthHeaders();
        if (!e)
          throw new Error("Authorization failed");
        return {
          ...e,
          Accept: "text/plain"
        };
      },
      body: {
        assistant_id: t,
        response_format: "vercel-ai-data-stream/v1",
        thread_id: "unstable_todo"
      }
    };
  }
  async stream(t) {
    const e = await this.cloud.makeRawRequest("/runs/stream", {
      method: "POST",
      headers: { Accept: "text/plain" },
      body: t
    });
    return Xi.fromResponse(e, new Gv());
  }
  async report(t) {
    return this.cloud.makeRequest("/runs", {
      method: "POST",
      body: t
    });
  }
}, Jv = class {
  constructor(t) {
    C(this, "cloud");
    this.cloud = t;
  }
  async list(t, e) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(t)}/messages`, { query: e });
  }
  async create(t, e) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(t)}/messages`, {
      method: "POST",
      body: e
    });
  }
  async update(t, e, n) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(t)}/messages/${encodeURIComponent(e)}`, {
      method: "PUT",
      body: n
    });
  }
}, Qv = class {
  constructor(t) {
    C(this, "cloud");
    C(this, "messages");
    this.cloud = t, this.messages = new Jv(t);
  }
  async list(t) {
    return this.cloud.makeRequest("/threads", { query: t });
  }
  async get(t) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(t)}`);
  }
  async create(t) {
    return this.cloud.makeRequest("/threads", {
      method: "POST",
      body: t
    });
  }
  async update(t, e) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(t)}`, {
      method: "PUT",
      body: e
    });
  }
  async delete(t) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(t)}`, { method: "DELETE" });
  }
}, Yv = class {
  constructor(t) {
    C(this, "cloud");
    this.cloud = t;
  }
  async pdfToImages(t) {
    return this.cloud.makeRequest("/files/pdf-to-images", {
      method: "POST",
      body: t
    });
  }
  async generatePresignedUploadUrl(t) {
    return this.cloud.makeRequest("/files/attachments/generate-presigned-upload-url", {
      method: "POST",
      body: t
    });
  }
}, Xv = class {
  constructor(t) {
    C(this, "threads");
    C(this, "auth");
    C(this, "runs");
    C(this, "files");
    C(this, "telemetry");
    const e = new Nv(t);
    this.threads = new Qv(e), this.auth = { tokens: new Dv(e) }, this.runs = new Kv(e), this.files = new Yv(e);
    const n = t.telemetry;
    this.telemetry = n === !1 ? { enabled: !1 } : n === !0 || n === void 0 ? { enabled: !0 } : {
      enabled: n.enabled !== !1,
      ...n
    };
  }
}, Zv = class {
  constructor(t) {
    C(this, "cloud");
    C(this, "idMapping", {});
    this.cloud = t;
  }
  /**
  * Persist a message to the cloud.
  *
  * @param threadId - Remote thread ID
  * @param messageId - Local message ID (used for tracking)
  * @param parentId - Local parent message ID (or null for first message)
  * @param format - Message format (e.g., "aui/v0", "ai-sdk/v6")
  * @param content - Message content (format-specific)
  */
  async append(t, e, n, r, i) {
    const o = n ? await this.idMapping[n] ?? n : null, s = this.cloud.threads.messages.create(t, {
      parent_id: o,
      format: r,
      content: i
    }).then(({ message_id: a }) => (this.idMapping[e] = a, a)).catch((a) => {
      throw this.idMapping[e] === s && delete this.idMapping[e], a;
    });
    return this.idMapping[e] = s, s.then(() => {
    });
  }
  /**
  * Update an already-persisted message in the cloud.
  */
  async update(t, e, n, r) {
    const i = await this.getRemoteId(e);
    i && await this.cloud.threads.messages.update(t, i, { content: r });
  }
  /**
  * Check if a message has been persisted (or is currently being persisted).
  */
  isPersisted(t) {
    return t in this.idMapping;
  }
  /**
  * Get the remote ID for a local message ID (resolved).
  * Returns undefined if not persisted.
  */
  async getRemoteId(t) {
    const e = this.idMapping[t];
    if (e)
      return e;
  }
  /**
  * Load messages from the cloud and populate the ID mapping.
  *
  * The ID mapping is populated so that `isPersisted()` returns true for
  * loaded messages, preventing re-persistence of already-stored messages.
  *
  * @param threadId - Remote thread ID
  * @param format - Optional format filter
  * @returns Array of cloud messages
  */
  async load(t, e) {
    const { messages: n } = await this.cloud.threads.messages.list(t, e ? { format: e } : void 0);
    for (const r of n)
      this.idMapping[r.id] = r.id;
    return n;
  }
  /**
  * Reset the ID mapping (call when switching threads).
  */
  reset() {
    this.idMapping = {};
  }
};
const ew = (t, e) => ({
  append: async (n, r) => {
    const i = e.getId(r.message), o = e.encode(r);
    return t.append(n, i, r.parentId, e.format, o);
  },
  update: t.update ? async (n, r, i) => {
    const o = e.encode(r);
    return t.update(n, i, e.format, o);
  } : void 0,
  load: async (n) => ({ messages: (await t.load(n, e.format)).filter((r) => r.format === e.format).map((r) => e.decode({
    id: r.id,
    parent_id: r.parent_id,
    format: r.format,
    content: r.content
  })).reverse() }),
  isPersisted: (n) => t.isPersisted(n)
}), bi = /* @__PURE__ */ new WeakMap();
var tw = class {
  constructor(t, e) {
    C(this, "cloudRef");
    C(this, "aui");
    this.cloudRef = t, this.aui = e;
  }
  get _persistence() {
    const t = this.aui.threadListItem();
    return bi.has(t) || bi.set(t, new Zv(this.cloudRef.current)), bi.get(t);
  }
  withFormat(t) {
    const e = this, n = ew(this._persistence, t);
    return {
      async append(r) {
        const { remoteId: i } = await e.aui.threadListItem().initialize();
        await n.append(i, r);
      },
      async update(r, i) {
        var s;
        const o = e.aui.threadListItem().getState().remoteId;
        o && await ((s = n.update) == null ? void 0 : s.call(n, o, r, i));
      },
      async delete() {
        throw new Error("Assistant Cloud does not support deleting thread messages yet.");
      },
      reportTelemetry(r, i) {
        const o = r.map((s) => t.encode(s));
        e._reportRunTelemetry(t.format, o, i);
      },
      async load() {
        const r = e.aui.threadListItem().getState().remoteId;
        return r ? n.load(r) : { messages: [] };
      }
    };
  }
  async append({ parentId: t, message: e }) {
    const { remoteId: n } = await this.aui.threadListItem().initialize(), r = Ev(e);
    await this._persistence.append(n, e.id, t, "aui/v0", r), this.cloudRef.current.telemetry.enabled && this._maybeReportRun(n, "aui/v0", r);
  }
  async delete() {
    throw new Error("Assistant Cloud does not support deleting thread messages yet.");
  }
  async load() {
    const t = this.aui.threadListItem().getState().remoteId;
    return t ? { messages: (await this._persistence.load(t, "aui/v0")).filter((e) => e.format === "aui/v0").map(Rv).reverse() } : { messages: [] };
  }
  _reportRunTelemetry(t, e, n) {
    if (!this.cloudRef.current.telemetry.enabled)
      return;
    const r = this.aui.threadListItem().getState().remoteId;
    if (!r)
      return;
    const i = ow(t, e);
    i && this._sendReport(r, i, n == null ? void 0 : n.durationMs, n == null ? void 0 : n.stepTimestamps);
  }
  _maybeReportRun(t, e, n) {
    const r = Nu(e, n);
    r && this._sendReport(t, r);
  }
  _sendReport(t, e, n, r) {
    const i = iw(e.steps, r), o = {
      thread_id: t,
      status: e.status,
      ...e.totalSteps != null ? { total_steps: e.totalSteps } : void 0,
      ...e.toolCalls ? { tool_calls: e.toolCalls } : void 0,
      ...i ? { steps: i } : void 0,
      ...e.inputTokens != null ? { input_tokens: e.inputTokens } : void 0,
      ...e.outputTokens != null ? { output_tokens: e.outputTokens } : void 0,
      ...e.reasoningTokens != null ? { reasoning_tokens: e.reasoningTokens } : void 0,
      ...e.cachedInputTokens != null ? { cached_input_tokens: e.cachedInputTokens } : void 0,
      ...n != null ? { duration_ms: n } : void 0,
      ...e.outputText != null ? { output_text: e.outputText } : void 0,
      ...e.metadata ? { metadata: e.metadata } : void 0,
      ...e.modelId ? { model_id: e.modelId } : void 0
    }, { beforeReport: s } = this.cloudRef.current.telemetry, a = s ? s(o) : o;
    a && this.cloudRef.current.runs.report(a).catch(() => {
    });
  }
};
const ma = 5e4;
function ni(t) {
  return t.length <= ma ? t : t.slice(0, ma);
}
function Zi(t) {
  if (t != null)
    try {
      return ni(JSON.stringify(t));
    } catch {
      return;
    }
}
const nw = /^[A-Za-z0-9+/]{100,}={0,2}$/;
function rw(t) {
  if (t != null) {
    try {
      const e = typeof t == "string" ? JSON.parse(t) : t;
      if (Array.isArray(e)) {
        const n = e.map((r) => {
          if (r && typeof r == "object" && r.type && (r.type === "image" || r.type === "audio") && typeof r.data == "string" && nw.test(r.data.slice(0, 200))) {
            const i = (r.data.length * 3 / 4 / 1024).toFixed(1);
            return {
              ...r,
              data: `[${r.type}: ${i}KB]`
            };
          }
          return r;
        });
        return ni(JSON.stringify(n));
      }
    } catch {
    }
    return Zi(t);
  }
}
function Pu(t, e, n, r, i, o) {
  const s = {
    tool_name: t,
    tool_call_id: e
  }, a = i ?? Zi(n);
  a !== void 0 && (s.tool_args = a);
  const l = o === "mcp" ? rw(r) : Zi(r);
  return l !== void 0 && (s.tool_result = l), o && (s.tool_source = o), s;
}
function iw(t, e) {
  if (!e)
    return t;
  if (!t)
    return e.map((r) => ({ ...r }));
  const n = Math.min(t.length, e.length);
  return t.map((r, i) => ({
    ...r,
    ...i < n ? e[i] : void 0
  }));
}
function Nu(t, e) {
  switch (t) {
    case "aui/v0":
      return aw(e);
    case "ai-sdk/v6":
      return hw(e);
    default:
      return null;
  }
}
function ow(t, e) {
  if (t === "ai-sdk/v6")
    return pw(e);
  for (let n = e.length - 1; n >= 0; n--) {
    const r = Nu(t, e[n]);
    if (r)
      return r;
  }
  return null;
}
const sw = {
  error: "error",
  incomplete: "incomplete"
};
function aw(t) {
  var g, w, b, k, x, T, I, y, M, E, N, _;
  const e = t;
  if (e.role !== "assistant")
    return null;
  const n = (g = e.content) == null ? void 0 : g.filter((A) => A.type === "tool-call" && A.toolName && A.toolCallId).map((A) => Pu(A.toolName, A.toolCallId, A.args, A.result, A.argsText)), r = (w = e.content) == null ? void 0 : w.filter((A) => A.type === "text" && A.text), i = r && r.length > 0 ? ni(r.map((A) => A.text).join("")) : void 0, o = (b = e.metadata) == null ? void 0 : b.steps;
  let s, a, l, c;
  if (o && o.length > 0) {
    let A = 0, P = 0, D = 0, O = 0, z = !1, V = !1, G = !1, F = !1;
    for (const B of o)
      ((k = B.usage) == null ? void 0 : k.inputTokens) != null && (A += B.usage.inputTokens, z = !0), ((x = B.usage) == null ? void 0 : x.outputTokens) != null && (P += B.usage.outputTokens, V = !0), ((T = B.usage) == null ? void 0 : T.reasoningTokens) != null && (D += B.usage.reasoningTokens, G = !0), ((I = B.usage) == null ? void 0 : I.cachedInputTokens) != null && (O += B.usage.cachedInputTokens, F = !0);
    s = z ? A : void 0, a = V ? P : void 0, l = G ? D : void 0, c = F ? O : void 0;
  }
  const d = (y = e.status) == null ? void 0 : y.type, u = d && sw[d] || "completed", h = (M = e.metadata) == null ? void 0 : M.custom, p = ((E = e.metadata) == null ? void 0 : E.modelId) ?? (typeof ((_ = (N = e.metadata) == null ? void 0 : N.custom) == null ? void 0 : _.modelId) == "string" ? e.metadata.custom.modelId : void 0), m = o && o.length > 1 ? o.map((A) => {
    var P, D, O, z;
    return {
      ...((P = A.usage) == null ? void 0 : P.inputTokens) != null ? { input_tokens: A.usage.inputTokens } : void 0,
      ...((D = A.usage) == null ? void 0 : D.outputTokens) != null ? { output_tokens: A.usage.outputTokens } : void 0,
      ...((O = A.usage) == null ? void 0 : O.reasoningTokens) != null ? { reasoning_tokens: A.usage.reasoningTokens } : void 0,
      ...((z = A.usage) == null ? void 0 : z.cachedInputTokens) != null ? { cached_input_tokens: A.usage.cachedInputTokens } : void 0
    };
  }) : void 0;
  return {
    status: u,
    ...n && n.length > 0 ? { toolCalls: n } : void 0,
    ...o != null && o.length ? { totalSteps: o.length } : void 0,
    ...s != null ? { inputTokens: s } : void 0,
    ...a != null ? { outputTokens: a } : void 0,
    ...l != null ? { reasoningTokens: l } : void 0,
    ...c != null ? { cachedInputTokens: c } : void 0,
    ...i != null ? { outputText: i } : void 0,
    ...h ? { metadata: h } : void 0,
    ...m ? { steps: m } : void 0,
    ...p ? { modelId: p } : void 0
  };
}
function lw(t) {
  return t.toolCallId ? t.type === "tool-call" || t.type === "dynamic-tool" ? !!t.toolName : t.type.startsWith("tool-") || t.type.startsWith("dynamic-tool-") : !1;
}
function cw(t) {
  return t.type === "dynamic-tool" || t.type.startsWith("dynamic-tool-");
}
function uw(t) {
  const e = cw(t) ? "mcp" : void 0;
  return Pu(t.toolName ?? t.type.slice(5), t.toolCallId, t.args ?? t.input, t.result ?? t.output, void 0, e);
}
function Du(t) {
  const e = [], n = [], r = [];
  let i = null;
  for (const o of t)
    if (o.type === "step-start")
      i !== null && r.push({ tool_calls: i }), i = [];
    else if (o.type === "text" && o.text)
      e.push(o.text);
    else if (lw(o)) {
      const s = uw(o);
      n.push(s), i !== null && i.push(s);
    }
  return i !== null && r.push({ tool_calls: i }), {
    textParts: e,
    toolCalls: n,
    stepsData: r
  };
}
function dw(t) {
  if (!t)
    return;
  if (typeof t.modelId == "string")
    return t.modelId;
  const e = t.custom;
  if (typeof (e == null ? void 0 : e.modelId) == "string")
    return e.modelId;
}
function Lu(t, e, n, r, i, o) {
  const s = t.length > 0, a = s ? ni(t.join("")) : void 0, l = dw(r), c = i && i.length > 1 ? i.map((d) => ({ ...d.tool_calls.length > 0 ? { tool_calls: d.tool_calls } : void 0 })) : void 0;
  return {
    status: s ? "completed" : "incomplete",
    ...e.length > 0 ? { toolCalls: e } : void 0,
    ...n > 0 ? { totalSteps: n } : void 0,
    ...(o == null ? void 0 : o.inputTokens) != null ? { inputTokens: o.inputTokens } : void 0,
    ...(o == null ? void 0 : o.outputTokens) != null ? { outputTokens: o.outputTokens } : void 0,
    ...(o == null ? void 0 : o.reasoningTokens) != null ? { reasoningTokens: o.reasoningTokens } : void 0,
    ...(o == null ? void 0 : o.cachedInputTokens) != null ? { cachedInputTokens: o.cachedInputTokens } : void 0,
    ...a != null ? { outputText: a } : void 0,
    ...r ? { metadata: r } : void 0,
    ...c ? { steps: c } : void 0,
    ...l ? { modelId: l } : void 0
  };
}
function fa(t) {
  const e = t.inputTokens ?? t.promptTokens, n = t.outputTokens ?? t.completionTokens;
  if (!(e == null && n == null && t.reasoningTokens == null && t.cachedInputTokens == null))
    return {
      ...e != null ? { inputTokens: e } : void 0,
      ...n != null ? { outputTokens: n } : void 0,
      ...t.reasoningTokens != null ? { reasoningTokens: t.reasoningTokens } : void 0,
      ...t.cachedInputTokens != null ? { cachedInputTokens: t.cachedInputTokens } : void 0
    };
}
function zu(t) {
  const e = t == null ? void 0 : t.usage;
  if (e) {
    const r = fa(e);
    if (r)
      return r;
  }
  const n = t == null ? void 0 : t.steps;
  if (n && n.length > 0) {
    let r = 0, i = 0, o = 0, s = 0, a = !1, l = !1, c = !1, d = !1, u = !1;
    for (const h of n) {
      if (!h.usage)
        continue;
      const p = fa(h.usage);
      p && (p.inputTokens != null && (r += p.inputTokens, a = !0), p.outputTokens != null && (i += p.outputTokens, l = !0), p.reasoningTokens != null && (o += p.reasoningTokens, c = !0), p.cachedInputTokens != null && (s += p.cachedInputTokens, d = !0), u = !0);
    }
    if (u)
      return {
        ...a ? { inputTokens: r } : void 0,
        ...l ? { outputTokens: i } : void 0,
        ...c ? { reasoningTokens: o } : void 0,
        ...d ? { cachedInputTokens: s } : void 0
      };
  }
}
function hw(t) {
  const e = t;
  if (e.role !== "assistant")
    return null;
  const { textParts: n, toolCalls: r, stepsData: i } = Du(e.parts ?? []);
  return Lu(n, r, i.length, e.metadata, i, zu(e.metadata));
}
function pw(t) {
  const e = [], n = [], r = [];
  let i = !1, o, s = 0, a = 0, l = 0, c = 0, d = !1, u = !1, h = !1, p = !1;
  for (const m of t) {
    const g = m;
    if (g.role !== "assistant")
      continue;
    i = !0;
    const { textParts: w, toolCalls: b, stepsData: k } = Du(g.parts ?? []);
    e.push(...w), n.push(...b), r.push(...k), g.metadata && (o = g.metadata);
    const x = zu(g.metadata);
    x && (x.inputTokens != null && (s += x.inputTokens, d = !0), x.outputTokens != null && (a += x.outputTokens, u = !0), x.reasoningTokens != null && (l += x.reasoningTokens, h = !0), x.cachedInputTokens != null && (c += x.cachedInputTokens, p = !0));
  }
  return i ? Lu(e, n, r.length, o, r, {
    ...d ? { inputTokens: s } : void 0,
    ...u ? { outputTokens: a } : void 0,
    ...h ? { reasoningTokens: l } : void 0,
    ...p ? { cachedInputTokens: c } : void 0
  }) : null;
}
function mw(t) {
  const e = R(3), n = Z();
  let r;
  e[0] !== n || e[1] !== t ? (r = () => new tw(t, n), e[0] = n, e[1] = t, e[2] = r) : r = e[2];
  const [i] = xe(r);
  return i;
}
const fw = (t) => t.startsWith("image/") ? "image" : t.startsWith("text/") ? "document" : "file";
var gw = class {
  constructor(t) {
    C(this, "cloud");
    C(this, "accept", "*");
    C(this, "uploadedUrls", /* @__PURE__ */ new Map());
    this.cloud = t;
  }
  async *add({ file: t }) {
    const e = crypto.randomUUID();
    let n = {
      id: e,
      type: fw(t.type),
      name: t.name,
      contentType: t.type,
      file: t,
      status: {
        type: "running",
        reason: "uploading",
        progress: 0
      }
    };
    yield n;
    try {
      const { signedUrl: r, publicUrl: i } = await this.cloud.files.generatePresignedUploadUrl({ filename: t.name });
      await fetch(r, {
        method: "PUT",
        body: t,
        headers: { "Content-Type": t.type },
        mode: "cors"
      }), this.uploadedUrls.set(e, i), n = {
        ...n,
        status: {
          type: "requires-action",
          reason: "composer-send"
        }
      }, yield n;
    } catch {
      n = {
        ...n,
        status: {
          type: "incomplete",
          reason: "error"
        }
      }, yield n;
    }
  }
  async remove(t) {
    this.uploadedUrls.delete(t.id);
  }
  async send(t) {
    const e = this.uploadedUrls.get(t.id);
    if (!e)
      throw new Error("Attachment not uploaded");
    this.uploadedUrls.delete(t.id);
    let n;
    return t.type === "image" ? n = [{
      type: "image",
      image: e,
      filename: t.name
    }] : n = [{
      type: "file",
      data: e,
      mimeType: t.contentType ?? "",
      filename: t.name
    }], {
      ...t,
      status: { type: "complete" },
      content: n
    };
  }
}, bw = class {
  list() {
    return Promise.resolve({ threads: [] });
  }
  rename() {
    return Promise.resolve();
  }
  updateCustom() {
    return Promise.resolve();
  }
  archive() {
    return Promise.resolve();
  }
  unarchive() {
    return Promise.resolve();
  }
  delete() {
    return Promise.resolve();
  }
  initialize(t) {
    return Promise.resolve({
      remoteId: t,
      externalId: void 0
    });
  }
  generateTitle() {
    return Promise.resolve(new ReadableStream());
  }
  fetch(t) {
    return Promise.reject(/* @__PURE__ */ new Error("Thread not found"));
  }
};
const ga = (t) => Ae(t) ? t : void 0;
var hc;
const ba = typeof process < "u" && ((hc = process == null ? void 0 : process.env) == null ? void 0 : hc.NEXT_PUBLIC_ASSISTANT_BASE_URL), vi = ba ? new Xv({
  baseUrl: ba,
  anonymous: !0
}) : void 0, vw = (t) => {
  const e = ne(t);
  Y(() => {
    e.current = t;
  }, [t]);
  const n = It(function({ children: o }) {
    const s = mw({ get current() {
      return e.current.cloud ?? vi;
    } }), a = e.current.cloud ?? vi, l = de(() => new gw(a), [a]);
    return /* @__PURE__ */ f(xu, {
      adapters: de(() => ({
        history: s,
        attachments: l
      }), [s, l]),
      children: o
    });
  }, []), r = t.cloud ?? vi;
  if (!r) {
    const i = e, o = new bw();
    return o.initialize = async (s) => {
      var a, l, c;
      return {
        remoteId: s,
        externalId: (c = await ((l = (a = i.current).create) == null ? void 0 : l.call(a))) == null ? void 0 : c.externalId
      };
    }, o;
  }
  return {
    list: async () => {
      const { threads: i } = await r.threads.list();
      return { threads: i.map((o) => ({
        status: o.is_archived ? "archived" : "regular",
        remoteId: o.id,
        title: o.title,
        lastMessageAt: o.last_message_at ? new Date(o.last_message_at) : void 0,
        externalId: o.external_id ?? void 0,
        custom: ga(o.metadata)
      })) };
    },
    initialize: async () => {
      var a;
      const i = await (((a = t.create) == null ? void 0 : a.call(t)) ?? Promise.resolve()), o = i ? i.externalId : void 0, { thread_id: s } = await r.threads.create({
        last_message_at: /* @__PURE__ */ new Date(),
        external_id: o
      });
      return {
        externalId: o,
        remoteId: s
      };
    },
    rename: async (i, o) => r.threads.update(i, { title: o }),
    updateCustom: async (i, o) => r.threads.update(i, { metadata: o ?? null }),
    archive: async (i) => r.threads.update(i, { is_archived: !0 }),
    unarchive: async (i) => r.threads.update(i, { is_archived: !1 }),
    delete: async (i) => {
      var o;
      return await ((o = t.delete) == null ? void 0 : o.call(t, i)), r.threads.delete(i);
    },
    generateTitle: async (i, o) => {
      const s = o.map((a) => ({
        ...a,
        content: a.content.filter((l) => l.type === "text" || l.type === "tool-call")
      }));
      return r.runs.stream({
        thread_id: i,
        assistant_id: "system/thread_title",
        messages: s
      });
    },
    fetch: async (i) => {
      const o = await r.threads.get(i);
      return {
        status: o.is_archived ? "archived" : "regular",
        remoteId: o.id,
        title: o.title,
        lastMessageAt: o.last_message_at ? new Date(o.last_message_at) : void 0,
        externalId: o.external_id ?? void 0,
        custom: ga(o.metadata)
      };
    },
    unstable_Provider: n
  };
}, ww = (t) => {
  const e = R(10), { id: n, children: r } = t;
  let i;
  e[0] !== n ? (i = He({
    source: "thread",
    query: {
      type: "id",
      id: n
    },
    get: (c) => c.thread().message({ id: n })
  }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  e[2] !== n ? (o = He({
    source: "message",
    query: {},
    get: (c) => c.thread().message({ id: n }).composer()
  }), e[2] = n, e[3] = o) : o = e[3];
  let s;
  e[4] !== i || e[5] !== o ? (s = {
    message: i,
    composer: o
  }, e[4] = i, e[5] = o, e[6] = s) : s = e[6];
  const a = Z(s);
  let l;
  return e[7] !== a || e[8] !== r ? (l = /* @__PURE__ */ f(Ge, {
    value: a,
    children: r
  }), e[7] = a, e[8] = r, e[9] = l) : l = e[9], l;
}, Uo = (t, e) => t.Message === e.Message && t.EditComposer === e.EditComposer && t.UserEditComposer === e.UserEditComposer && t.AssistantEditComposer === e.AssistantEditComposer && t.SystemEditComposer === e.SystemEditComposer && t.UserMessage === e.UserMessage && t.AssistantMessage === e.AssistantMessage && t.SystemMessage === e.SystemMessage, yw = () => null, va = /* @__PURE__ */ new WeakMap(), xw = (t, e) => {
  let n = va.get(t);
  return n || (n = new Set(t.map((r) => r.id)), va.set(t, n)), n.has(e);
}, kw = (t, e, n) => {
  switch (e) {
    case "user":
      return n ? t.UserEditComposer ?? t.EditComposer ?? t.UserMessage ?? t.Message : t.UserMessage ?? t.Message;
    case "assistant":
      return n ? t.AssistantEditComposer ?? t.EditComposer ?? t.AssistantMessage ?? t.Message : t.AssistantMessage ?? t.Message;
    case "system":
      return n ? t.SystemEditComposer ?? t.EditComposer ?? t.SystemMessage ?? t.Message : t.SystemMessage ?? t.Message ?? yw;
    default:
      throw new Error(`Unknown message role: ${e}`);
  }
}, jo = (t) => {
  const e = R(6), { components: n } = t, r = $(Sw), i = $(Cw);
  let o;
  e[0] !== n || e[1] !== i || e[2] !== r ? (o = kw(n, r, i), e[0] = n, e[1] = i, e[2] = r, e[3] = o) : o = e[3];
  const s = o;
  let a;
  return e[4] !== s ? (a = /* @__PURE__ */ f(s, {}), e[4] = s, e[5] = a) : a = e[5], a;
}, Ou = ke((t) => {
  const e = R(5), { index: n, components: r } = t;
  let i;
  e[0] !== r ? (i = /* @__PURE__ */ f(jo, { components: r }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  return e[2] !== n || e[3] !== i ? (o = /* @__PURE__ */ f(pu, {
    index: n,
    children: i
  }), e[2] = n, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && Uo(t.components, e.components));
Ou.displayName = "ThreadPrimitive.MessageByIndex";
const $u = ke((t) => {
  const e = R(7), { messageId: n, components: r } = t;
  let i;
  if (e[0] !== n ? (i = (a) => xw(a.thread.messages, n), e[0] = n, e[1] = i) : i = e[1], !$(i))
    return null;
  let o;
  e[2] !== r ? (o = /* @__PURE__ */ f(jo, { components: r }), e[2] = r, e[3] = o) : o = e[3];
  let s;
  return e[4] !== n || e[5] !== o ? (s = /* @__PURE__ */ f(ww, {
    id: n,
    children: o
  }), e[4] = n, e[5] = o, e[6] = s) : s = e[6], s;
}, (t, e) => t.messageId === e.messageId && Uo(t.components, e.components));
$u.displayName = "ThreadPrimitive.Unstable_MessageById";
const wa = ({ children: t }) => {
  const e = $((n) => n.thread.messages.length);
  return de(() => e === 0 ? null : Array.from({ length: e }, (n, r) => /* @__PURE__ */ f(pu, {
    index: r,
    children: /* @__PURE__ */ f(Sn, {
      getItemState: (i) => i.thread().message({ index: r }).getState(),
      children: (i) => t({ get message() {
        return i();
      } })
    })
  }, r)), [e, t]);
}, Fu = (t) => {
  const e = R(4), { components: n, children: r } = t;
  if (n) {
    let o;
    return e[0] !== n ? (o = /* @__PURE__ */ f(wa, { children: () => /* @__PURE__ */ f(jo, { components: n }) }), e[0] = n, e[1] = o) : o = e[1], o;
  }
  let i;
  return e[2] !== r ? (i = /* @__PURE__ */ f(wa, { children: r }), e[2] = r, e[3] = i) : i = e[3], i;
};
Fu.displayName = "ThreadPrimitive.Messages";
const _w = ke(Fu, (t, e) => t.children || e.children ? t.children === e.children : Uo(t.components, e.components));
function Sw(t) {
  return t.message.role;
}
function Cw(t) {
  return t.message.composer.isEditing;
}
const Bu = (t) => {
  var n;
  const e = t.message.metadata;
  if (!(!e || typeof e != "object"))
    return (n = e.custom) == null ? void 0 : n.quote;
};
var Tw = class extends Error {
  constructor(e, n = `Component "${e}" is not in the generative-ui allowlist.`) {
    super(n);
    C(this, "componentName");
    this.name = "GenerativeUIRenderError", this.componentName = e;
  }
};
const Iw = (t) => typeof t == "object" && t !== null, Uu = (t, e, n, r) => {
  if (t == null)
    return null;
  if (typeof t == "string")
    return t;
  if (!Iw(t) || !("component" in t) || typeof t.component != "string")
    return typeof process < "u" && {}.NODE_ENV !== "production" && console.warn(`[generative-ui] Skipping malformed node at ${r}:`, t), null;
  const { component: i, props: o, children: s, key: a } = t, l = e[i];
  if (!l) {
    if (n)
      return /* @__PURE__ */ f(n, {
        component: i,
        props: o
      }, a ?? r);
    throw new Tw(i);
  }
  const c = s != null && s.length ? s.map((d, u) => Uu(d, e, n, `${r}/${u}`)) : void 0;
  return Et(l, {
    ...o ?? {},
    key: a ?? r
  }, ...c ?? []);
}, Aw = (t) => {
  if (!t || t.root === void 0 || t.root === null)
    return [];
  const e = t.root;
  return Array.isArray(e) ? e : [e];
}, Vo = (t) => {
  const e = R(11), { spec: n, components: r, Fallback: i } = t;
  let o;
  e[0] !== n ? (o = Aw(n), e[0] = n, e[1] = o) : o = e[1];
  const s = o;
  let a;
  if (e[2] !== i || e[3] !== r || e[4] !== s) {
    let c;
    e[6] !== i || e[7] !== r ? (c = (d, u) => Uu(d, r, i, `${u}`), e[6] = i, e[7] = r, e[8] = c) : c = e[8], a = s.map(c), e[2] = i, e[3] = r, e[4] = s, e[5] = a;
  } else
    a = e[5];
  let l;
  return e[9] !== a ? (l = /* @__PURE__ */ f(Ke, { children: a }), e[9] = a, e[10] = l) : l = e[10], l;
};
Vo.displayName = "GenerativeUIRender";
const ju = (t) => {
  const e = R(4), { components: n, spec: r, Fallback: i } = t, o = $(Ew), s = r ?? o;
  if (!s)
    return null;
  let a;
  return e[0] !== i || e[1] !== n || e[2] !== s ? (a = /* @__PURE__ */ f(Vo, {
    spec: s,
    components: n,
    Fallback: i
  }), e[0] = i, e[1] = n, e[2] = s, e[3] = a) : a = e[3], a;
};
ju.displayName = "MessagePrimitive.GenerativeUI";
function Ew(t) {
  const e = t.part;
  return (e == null ? void 0 : e.type) === "generative-ui" ? e.spec : void 0;
}
const Rw = "ui://", Vu = (t) => !!(t != null && t.startsWith(Rw)), ya = (t) => Symbol.iterator in t, xa = (t) => (
  // HACK: avoid checking entries type
  "entries" in t
), ka = (t, e) => {
  const n = t instanceof Map ? t : new Map(t.entries()), r = e instanceof Map ? e : new Map(e.entries());
  if (n.size !== r.size)
    return !1;
  for (const [i, o] of n)
    if (!r.has(i) || !Object.is(o, r.get(i)))
      return !1;
  return !0;
}, Mw = (t, e) => {
  const n = t[Symbol.iterator](), r = e[Symbol.iterator]();
  let i = n.next(), o = r.next();
  for (; !i.done && !o.done; ) {
    if (!Object.is(i.value, o.value))
      return !1;
    i = n.next(), o = r.next();
  }
  return !!i.done && !!o.done;
};
function Pw(t, e) {
  return Object.is(t, e) ? !0 : typeof t != "object" || t === null || typeof e != "object" || e === null || Object.getPrototypeOf(t) !== Object.getPrototypeOf(e) ? !1 : ya(t) && ya(e) ? xa(t) && xa(e) ? ka(t, e) : Mw(t, e) : ka(
    { entries: () => Object.entries(t) },
    { entries: () => Object.entries(e) }
  );
}
function Or(t) {
  const e = Ce.useRef(void 0);
  return (n) => {
    const r = t(n);
    return Pw(e.current, r) ? e.current : e.current = r;
  };
}
const wi = (t) => {
  let e = -1;
  return {
    startGroup: (n) => {
      e === -1 && (e = n);
    },
    endGroup: (n, r) => {
      e !== -1 && (r.push({
        type: t,
        startIndex: e,
        endIndex: n
      }), e = -1);
    },
    finalize: (n, r) => {
      e !== -1 && r.push({
        type: t,
        startIndex: e,
        endIndex: n
      });
    }
  };
}, Nw = (t, e, n) => {
  const r = [];
  if (e) {
    const i = wi("chainOfThoughtGroup");
    for (let o = 0; o < t.length; o++) {
      const s = t[o];
      s === "tool-call" || s === "reasoning" ? i.startGroup(o) : (i.endGroup(o - 1, r), r.push({
        type: "single",
        index: o
      }));
    }
    i.finalize(t.length - 1, r);
  } else {
    const i = wi("toolGroup"), o = wi("reasoningGroup");
    for (let s = 0; s < t.length; s++) {
      const a = t[s];
      a === "tool-call" ? (o.endGroup(s - 1, r), i.startGroup(s)) : a === "reasoning" ? (i.endGroup(s - 1, r), o.startGroup(s)) : (i.endGroup(s - 1, r), o.endGroup(s - 1, r), r.push({
        type: "single",
        index: s
      }));
    }
    i.finalize(t.length - 1, r), o.finalize(t.length - 1, r);
  }
  if (n) {
    const i = /* @__PURE__ */ new Set();
    for (const o of r) {
      if (o.type === "single")
        continue;
      const s = n[o.startIndex];
      s !== void 0 && !i.has(s) && (i.add(s), o.idKey = `id:${s}`);
    }
  }
  return r;
}, Dw = (t) => {
  const e = R(10), n = $(Or(Yw)), r = $(Or(Zw));
  let i;
  e: {
    if (n.length === 0) {
      let a;
      e[0] === Symbol.for("react.memo_cache_sentinel") ? (a = [], e[0] = a) : a = e[0];
      let l;
      e[1] !== r ? (l = {
        ranges: a,
        partIds: r
      }, e[1] = r, e[2] = l) : l = e[2], i = l;
      break e;
    }
    let o;
    e[3] !== n || e[4] !== r || e[5] !== t ? (o = Nw(n, t, r), e[3] = n, e[4] = r, e[5] = t, e[6] = o) : o = e[6];
    let s;
    e[7] !== r || e[8] !== o ? (s = {
      ranges: o,
      partIds: r
    }, e[7] = r, e[8] = o, e[9] = s) : s = e[9], i = s;
  }
  return i;
}, Lw = (t) => {
  const e = R(9);
  let n, r;
  e[0] !== t ? ({ Fallback: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]);
  let i;
  e[3] !== n || e[4] !== r.toolName ? (i = (a) => {
    var l, c;
    return ((c = (l = a.tools.toolUIs[r.toolName]) == null ? void 0 : l[0]) == null ? void 0 : c.render) ?? n;
  }, e[3] = n, e[4] = r.toolName, e[5] = i) : i = e[5];
  const o = $(i);
  if (!o)
    return null;
  let s;
  return e[6] !== o || e[7] !== r ? (s = /* @__PURE__ */ f(o, { ...r }), e[6] = o, e[7] = r, e[8] = s) : s = e[8], s;
}, qo = (t, e, n) => {
  var i;
  const r = (i = t.renderers[e]) == null ? void 0 : i[0];
  return r || (t.fallbacks[0] ?? n);
}, zw = (t) => {
  const e = R(9);
  let n, r;
  e[0] !== t ? ({ Fallback: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]);
  let i;
  e[3] !== n || e[4] !== r.name ? (i = (a) => qo(a.dataRenderers, r.name, n), e[3] = n, e[4] = r.name, e[5] = i) : i = e[5];
  const o = $(i);
  if (!o)
    return null;
  let s;
  return e[6] !== o || e[7] !== r ? (s = /* @__PURE__ */ f(o, { ...r }), e[6] = o, e[7] = r, e[8] = s) : s = e[8], s;
}, Ee = {
  Text: () => null,
  Reasoning: () => null,
  Source: () => null,
  Image: () => null,
  File: () => null,
  Unstable_Audio: () => null,
  ToolGroup: ({ children: t }) => t,
  ReasoningGroup: ({ children: t }) => t
}, Ow = (t) => {
  var E, N, _;
  const e = R(47), { components: n } = t;
  let r;
  e[0] !== n ? (r = n === void 0 ? {} : n, e[0] = n, e[1] = r) : r = e[1];
  const { Text: i, Reasoning: o, Image: s, Source: a, File: l, Unstable_Audio: c, tools: d, data: u, generativeUI: h } = r, p = i === void 0 ? Ee.Text : i, m = o === void 0 ? Ee.Reasoning : o, g = s === void 0 ? Ee.Image : s, w = a === void 0 ? Ee.Source : a, b = l === void 0 ? Ee.File : l, k = c === void 0 ? Ee.Unstable_Audio : c;
  let x;
  e[2] !== d ? (x = d === void 0 ? {} : d, e[2] = d, e[3] = x) : x = e[3];
  const T = x, I = Z(), y = $(ey), M = y.type;
  if (M === "tool-call") {
    let A;
    e[4] !== I ? (A = I.part(), e[4] = I, e[5] = A) : A = e[5];
    const P = A.addToolResult;
    let D;
    e[6] !== I ? (D = I.part(), e[6] = I, e[7] = D) : D = e[7];
    const O = D.resumeToolCall;
    let z;
    e[8] !== I ? (z = I.part(), e[8] = I, e[9] = z) : z = e[9];
    const V = z.respondToToolApproval;
    if ("Override" in T) {
      let B;
      return e[10] !== P || e[11] !== y || e[12] !== V || e[13] !== O || e[14] !== T.Override ? (B = /* @__PURE__ */ f(T.Override, {
        ...y,
        addResult: P,
        resume: O,
        respondToApproval: V
      }), e[10] = P, e[11] = y, e[12] = V, e[13] = O, e[14] = T.Override, e[15] = B) : B = e[15], B;
    }
    const G = ((E = T.by_name) == null ? void 0 : E[y.toolName]) ?? T.Fallback;
    let F;
    return e[16] !== G || e[17] !== P || e[18] !== y || e[19] !== V || e[20] !== O ? (F = /* @__PURE__ */ f(Lw, {
      ...y,
      Fallback: G,
      addResult: P,
      resume: O,
      respondToApproval: V
    }), e[16] = G, e[17] = P, e[18] = y, e[19] = V, e[20] = O, e[21] = F) : F = e[21], F;
  }
  if (((N = y.status) == null ? void 0 : N.type) === "requires-action")
    throw new Error("Encountered unexpected requires-action status");
  switch (M) {
    case "text": {
      let A;
      return e[22] !== p || e[23] !== y ? (A = /* @__PURE__ */ f(p, { ...y }), e[22] = p, e[23] = y, e[24] = A) : A = e[24], A;
    }
    case "reasoning": {
      let A;
      return e[25] !== m || e[26] !== y ? (A = /* @__PURE__ */ f(m, { ...y }), e[25] = m, e[26] = y, e[27] = A) : A = e[27], A;
    }
    case "source": {
      let A;
      return e[28] !== w || e[29] !== y ? (A = /* @__PURE__ */ f(w, { ...y }), e[28] = w, e[29] = y, e[30] = A) : A = e[30], A;
    }
    case "image": {
      let A;
      return e[31] !== g || e[32] !== y ? (A = /* @__PURE__ */ f(g, { ...y }), e[31] = g, e[32] = y, e[33] = A) : A = e[33], A;
    }
    case "file": {
      let A;
      return e[34] !== b || e[35] !== y ? (A = /* @__PURE__ */ f(b, { ...y }), e[34] = b, e[35] = y, e[36] = A) : A = e[36], A;
    }
    case "audio": {
      let A;
      return e[37] !== k || e[38] !== y ? (A = /* @__PURE__ */ f(k, { ...y }), e[37] = k, e[38] = y, e[39] = A) : A = e[39], A;
    }
    case "data": {
      const A = ((_ = u == null ? void 0 : u.by_name) == null ? void 0 : _[y.name]) ?? (u == null ? void 0 : u.Fallback);
      let P;
      return e[40] !== A || e[41] !== y ? (P = /* @__PURE__ */ f(zw, {
        ...y,
        Fallback: A
      }), e[40] = A, e[41] = y, e[42] = P) : P = e[42], P;
    }
    case "generative-ui": {
      if (!(h != null && h.components))
        return typeof process < "u" && {}.NODE_ENV !== "production" && console.warn("MessagePrimitive.Parts received a generative-ui part but no `components.generativeUI.components` allowlist was provided. Pass an allowlist or render with <MessagePrimitive.GenerativeUI />."), null;
      const A = y;
      let P;
      return e[43] !== h.Fallback || e[44] !== h.components || e[45] !== A.spec ? (P = /* @__PURE__ */ f(Vo, {
        spec: A.spec,
        components: h.components,
        Fallback: h.Fallback
      }), e[43] = h.Fallback, e[44] = h.components, e[45] = A.spec, e[46] = P) : P = e[46], P;
    }
    default:
      return console.warn(`Unknown message part type: ${M}`), null;
  }
}, Bn = ke((t) => {
  const e = R(5), { index: n, components: r } = t;
  let i;
  e[0] !== r ? (i = /* @__PURE__ */ f(Ow, { components: r }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  return e[2] !== n || e[3] !== i ? (o = /* @__PURE__ */ f(zo, {
    index: n,
    children: i
  }), e[2] = n, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => {
  var n, r, i, o, s, a, l, c, d, u, h, p, m, g, w, b, k, x, T, I, y, M;
  return t.index === e.index && ((n = t.components) == null ? void 0 : n.Text) === ((r = e.components) == null ? void 0 : r.Text) && ((i = t.components) == null ? void 0 : i.Reasoning) === ((o = e.components) == null ? void 0 : o.Reasoning) && ((s = t.components) == null ? void 0 : s.Source) === ((a = e.components) == null ? void 0 : a.Source) && ((l = t.components) == null ? void 0 : l.Image) === ((c = e.components) == null ? void 0 : c.Image) && ((d = t.components) == null ? void 0 : d.File) === ((u = e.components) == null ? void 0 : u.File) && ((h = t.components) == null ? void 0 : h.Unstable_Audio) === ((p = e.components) == null ? void 0 : p.Unstable_Audio) && ((m = t.components) == null ? void 0 : m.tools) === ((g = e.components) == null ? void 0 : g.tools) && ((w = t.components) == null ? void 0 : w.data) === ((b = e.components) == null ? void 0 : b.data) && ((k = t.components) == null ? void 0 : k.generativeUI) === ((x = e.components) == null ? void 0 : x.generativeUI) && ((T = t.components) == null ? void 0 : T.ToolGroup) === ((I = e.components) == null ? void 0 : I.ToolGroup) && ((y = t.components) == null ? void 0 : y.ReasoningGroup) === ((M = e.components) == null ? void 0 : M.ReasoningGroup);
});
Bn.displayName = "MessagePrimitive.PartByIndex";
const $w = (t) => {
  const e = R(6), { status: n, component: r } = t, i = n.type === "running";
  let o;
  e[0] !== r || e[1] !== n ? (o = /* @__PURE__ */ f(r, {
    type: "text",
    text: "",
    status: n
  }), e[0] = r, e[1] = n, e[2] = o) : o = e[2];
  let s;
  return e[3] !== i || e[4] !== o ? (s = /* @__PURE__ */ f(Oo, {
    text: "",
    isRunning: i,
    children: o
  }), e[3] = i, e[4] = o, e[5] = s) : s = e[5], s;
}, Fw = Object.freeze({ type: "complete" }), Bw = Object.freeze({ type: "running" }), Uw = (t) => {
  const e = R(6), { components: n } = t, r = $(ty);
  if (n != null && n.Empty) {
    let s;
    return e[0] !== n.Empty || e[1] !== r ? (s = /* @__PURE__ */ f(n.Empty, { status: r }), e[0] = n.Empty, e[1] = r, e[2] = s) : s = e[2], s;
  }
  if (r.type !== "running")
    return null;
  const i = (n == null ? void 0 : n.Text) ?? Ee.Text;
  let o;
  return e[3] !== r || e[4] !== i ? (o = /* @__PURE__ */ f($w, {
    status: r,
    component: i
  }), e[3] = r, e[4] = i, e[5] = o) : o = e[5], o;
}, qu = ke(Uw, (t, e) => {
  var n, r, i, o;
  return ((n = t.components) == null ? void 0 : n.Empty) === ((r = e.components) == null ? void 0 : r.Empty) && ((i = t.components) == null ? void 0 : i.Text) === ((o = e.components) == null ? void 0 : o.Text);
}), jw = (t) => {
  const e = R(4), { components: n, enabled: r } = t;
  let i;
  if (e[0] !== r ? (i = (s) => {
    if (!r || s.message.parts.length === 0)
      return !1;
    const a = s.message.parts[s.message.parts.length - 1];
    return (a == null ? void 0 : a.type) !== "text" && (a == null ? void 0 : a.type) !== "reasoning";
  }, e[0] = r, e[1] = i) : i = e[1], !$(i))
    return null;
  let o;
  return e[2] !== n ? (o = /* @__PURE__ */ f(qu, { components: n }), e[2] = n, e[3] = o) : o = e[3], o;
}, Vw = ke(jw, (t, e) => {
  var n, r, i, o;
  return t.enabled === e.enabled && ((n = t.components) == null ? void 0 : n.Empty) === ((r = e.components) == null ? void 0 : r.Empty) && ((i = t.components) == null ? void 0 : i.Text) === ((o = e.components) == null ? void 0 : o.Text);
}), qw = (t) => {
  const e = R(4), { Quote: n } = t, r = $(Bu);
  if (!r)
    return null;
  let i;
  return e[0] !== n || e[1] !== r.messageId || e[2] !== r.text ? (i = /* @__PURE__ */ f(n, {
    text: r.text,
    messageId: r.messageId
  }), e[0] = n, e[1] = r.messageId, e[2] = r.text, e[3] = i) : i = e[3], i;
}, Hw = ke(qw);
function Hu(t, e) {
  var r, i, o, s;
  const n = ((i = (r = t.toolUIs[e.toolName]) == null ? void 0 : r[0]) == null ? void 0 : i.render) ?? null;
  return n || (Vu((s = (o = e.mcp) == null ? void 0 : o.app) == null ? void 0 : s.resourceUri) && t.mcpApp ? t.mcpApp.render : null);
}
const Wu = () => {
  const t = R(12), e = Z(), n = $(ny), r = $(ry);
  if (!r || n.type !== "tool-call")
    return null;
  let i;
  t[0] !== e ? (i = e.part(), t[0] = e, t[1] = i) : i = t[1];
  const o = i.addToolResult;
  let s;
  t[2] !== e ? (s = e.part(), t[2] = e, t[3] = s) : s = t[3];
  const a = s.resumeToolCall;
  let l;
  t[4] !== e ? (l = e.part(), t[4] = e, t[5] = l) : l = t[5];
  let c;
  return t[6] !== r || t[7] !== n || t[8] !== i.addToolResult || t[9] !== s.resumeToolCall || t[10] !== l.respondToToolApproval ? (c = /* @__PURE__ */ f(r, {
    ...n,
    addResult: o,
    resume: a,
    respondToApproval: l.respondToToolApproval
  }), t[6] = r, t[7] = n, t[8] = i.addToolResult, t[9] = s.resumeToolCall, t[10] = l.respondToToolApproval, t[11] = c) : c = t[11], c;
}, Gu = () => {
  const t = R(3), e = $(iy), n = $(oy);
  if (!n || e.type !== "data")
    return null;
  const r = e;
  let i;
  return t[0] !== n || t[1] !== r ? (i = /* @__PURE__ */ f(n, { ...r }), t[0] = n, t[1] = r, t[2] = i) : i = t[2], i;
}, Ww = () => {
  const t = R(2), e = $(sy);
  if (e === "tool-call") {
    let n;
    return t[0] === Symbol.for("react.memo_cache_sentinel") ? (n = /* @__PURE__ */ f(Wu, {}), t[0] = n) : n = t[0], n;
  }
  if (e === "data") {
    let n;
    return t[1] === Symbol.for("react.memo_cache_sentinel") ? (n = /* @__PURE__ */ f(Gu, {}), t[1] = n) : n = t[1], n;
  }
  return null;
}, Gw = Object.freeze({
  type: "text",
  text: "",
  status: Bw
}), Ku = ({ index: t, children: e }) => {
  const n = Z(), r = $((i) => i.dataRenderers);
  return /* @__PURE__ */ f(zo, {
    index: t,
    children: /* @__PURE__ */ f(Sn, {
      getItemState: (i) => i.message().part({ index: t }).getState(),
      children: (i) => e({ get part() {
        const o = i();
        if (o.type === "tool-call") {
          const s = Hu(n.tools().getState(), o) !== null, a = n.message().part({ index: t });
          return {
            ...o,
            toolUI: s ? /* @__PURE__ */ f(Wu, {}) : null,
            addResult: a.addToolResult,
            resume: a.resumeToolCall,
            respondToApproval: a.respondToToolApproval
          };
        }
        if (o.type === "data") {
          const s = qo(r, o.name, void 0) !== void 0;
          return {
            ...o,
            dataRendererUI: s ? /* @__PURE__ */ f(Gu, {}) : null
          };
        }
        return o;
      } })
    })
  });
}, Kw = (t) => {
  const e = R(9), { children: n } = t, r = $(ay), i = $(ly), o = r === 0 && i;
  if (r === 0) {
    if (!o)
      return null;
    let a;
    e[0] !== n ? (a = n({ part: Gw }), e[0] = n, e[1] = a) : a = e[1];
    let l;
    return e[2] !== a ? (l = /* @__PURE__ */ f(Oo, {
      text: "",
      isRunning: !0,
      children: a
    }), e[2] = a, e[3] = l) : l = e[3], l;
  }
  let s;
  if (e[4] !== n || e[5] !== r) {
    let a;
    e[7] !== n ? (a = (l, c) => /* @__PURE__ */ f(Ku, {
      index: c,
      children: (d) => n(d) ?? /* @__PURE__ */ f(Ww, {})
    }, c), e[7] = n, e[8] = a) : a = e[8], s = /* @__PURE__ */ f(Ke, { children: Array.from({ length: r }, a) }), e[4] = n, e[5] = r, e[6] = s;
  } else
    s = e[6];
  return s;
}, eo = (t) => {
  const e = R(5), { components: n, unstable_showEmptyOnNonTextEnd: r, children: i } = t, o = r === void 0 ? !0 : r;
  if (i) {
    let a;
    return e[0] !== i ? (a = /* @__PURE__ */ f(Kw, { children: i }), e[0] = i, e[1] = a) : a = e[1], a;
  }
  let s;
  return e[2] !== n || e[3] !== o ? (s = /* @__PURE__ */ f(Jw, {
    components: n,
    unstable_showEmptyOnNonTextEnd: o
  }), e[2] = n, e[3] = o, e[4] = s) : s = e[4], s;
};
eo.displayName = "MessagePrimitive.Parts";
const Jw = (t) => {
  const e = R(15), { components: n, unstable_showEmptyOnNonTextEnd: r } = t, i = $(cy), { ranges: o, partIds: s } = Dw(!!(n != null && n.ChainOfThought));
  let a;
  e: {
    if (i === 0) {
      let p;
      e[0] !== n ? (p = /* @__PURE__ */ f(qu, { components: n }), e[0] = n, e[1] = p) : p = e[1], a = p;
      break e;
    }
    let h;
    if (e[2] !== n || e[3] !== o || e[4] !== s) {
      const p = /* @__PURE__ */ new Set(), m = (g) => {
        const w = s[g];
        return w !== void 0 && !p.has(w) ? (p.add(w), `part-id:${w}`) : `part-${g}`;
      };
      h = o.map((g) => {
        if (g.type === "single")
          return /* @__PURE__ */ f(Bn, {
            index: g.index,
            components: n
          }, g.index);
        if (g.type === "chainOfThoughtGroup") {
          const w = n == null ? void 0 : n.ChainOfThought;
          return w ? /* @__PURE__ */ f(Hb, {
            startIndex: g.startIndex,
            endIndex: g.endIndex,
            children: /* @__PURE__ */ f(w, {})
          }, `chainOfThought-${g.idKey ?? g.startIndex}`) : null;
        } else
          return g.type === "toolGroup" ? /* @__PURE__ */ f((n == null ? void 0 : n.ToolGroup) ?? Ee.ToolGroup, {
            startIndex: g.startIndex,
            endIndex: g.endIndex,
            children: Array.from({ length: g.endIndex - g.startIndex + 1 }, (w, b) => {
              const k = g.startIndex + b;
              return /* @__PURE__ */ f(Bn, {
                index: k,
                components: n
              }, m(k));
            })
          }, `tool-${g.idKey ?? g.startIndex}`) : /* @__PURE__ */ f((n == null ? void 0 : n.ReasoningGroup) ?? Ee.ReasoningGroup, {
            startIndex: g.startIndex,
            endIndex: g.endIndex,
            children: Array.from({ length: g.endIndex - g.startIndex + 1 }, (w, b) => {
              const k = g.startIndex + b;
              return /* @__PURE__ */ f(Bn, {
                index: k,
                components: n
              }, `part-${k}`);
            })
          }, `reasoning-${g.startIndex}`);
      }), e[2] = n, e[3] = o, e[4] = s, e[5] = h;
    } else
      h = e[5];
    a = h;
  }
  const l = a;
  let c;
  e[6] !== n ? (c = (n == null ? void 0 : n.Quote) && /* @__PURE__ */ f(Hw, { Quote: n.Quote }), e[6] = n, e[7] = c) : c = e[7];
  let d;
  e[8] !== n || e[9] !== r ? (d = /* @__PURE__ */ f(Vw, {
    components: n,
    enabled: r
  }), e[8] = n, e[9] = r, e[10] = d) : d = e[10];
  let u;
  return e[11] !== l || e[12] !== c || e[13] !== d ? (u = /* @__PURE__ */ j(Ke, { children: [
    c,
    l,
    d
  ] }), e[11] = l, e[12] = c, e[13] = d, e[14] = u) : u = e[14], u;
};
function Qw(t) {
  return t.type;
}
function Yw(t) {
  return t.message.parts.map(Qw);
}
function Xw(t) {
  return t.type === "tool-call" ? t.toolCallId : void 0;
}
function Zw(t) {
  return t.message.parts.map(Xw);
}
function ey(t) {
  return t.part;
}
function ty(t) {
  return t.message.status ?? Fw;
}
function ny(t) {
  return t.part;
}
function ry(t) {
  return t.part.type === "tool-call" ? Hu(t.tools, t.part) : null;
}
function iy(t) {
  return t.part;
}
function oy(t) {
  return t.part.type === "data" ? qo(t.dataRenderers, t.part.name, void 0) ?? null : null;
}
function sy(t) {
  return t.part.type;
}
function ay(t) {
  return t.message.parts.length;
}
function ly(t) {
  var e;
  return (((e = t.message.status) == null ? void 0 : e.type) ?? "complete") === "running";
}
function cy(t) {
  return t.message.parts.length;
}
const Ju = Symbol.for("@assistant-ui/groupBy.memoKey"), uy = (t) => {
  const e = t, n = (i, o) => {
    var s, a, l, c, d;
    if (i.type === "tool-call") {
      const u = Vu((a = (s = i.mcp) == null ? void 0 : s.app) == null ? void 0 : a.resourceUri);
      if ((u || (((d = (c = (l = o == null ? void 0 : o.toolUIs) == null ? void 0 : l[i.toolName]) == null ? void 0 : c[0]) == null ? void 0 : d.standalone) ?? !1)) && e["standalone-tool-call"] !== void 0)
        return e["standalone-tool-call"];
      if (u && e["mcp-app"] !== void 0)
        return e["mcp-app"];
    }
    return e[i.type] ?? [];
  }, r = Object.keys(t).sort().map((i) => [i, t[i]]);
  return n[Ju] = `groupPartByType:${JSON.stringify(r)}`, n;
}, _a = (t) => {
  const e = t.nextChildIdx++;
  return t.nodeKey === "" ? String(e) : `${t.nodeKey}.${e}`;
}, Sa = (t, e) => {
  if (!(e === void 0 || t.claimed.has(e)))
    return t.claimed.add(e), `id:${e}`;
}, dy = (t, e) => {
  const n = {
    key: "",
    nodeKey: "",
    indices: [],
    children: [],
    nextChildIdx: 0,
    claimed: /* @__PURE__ */ new Set()
  }, r = [n], i = () => {
    const o = r.pop(), s = r[r.length - 1];
    s.children.push({
      type: "group",
      key: o.key,
      nodeKey: o.nodeKey,
      idKey: Sa(s, e == null ? void 0 : e[o.indices[0]]),
      indices: o.indices,
      children: o.children
    });
  };
  for (let o = 0; o < t.length; o++) {
    const s = t[o];
    let a = 0;
    for (; a < r.length - 1 && a < s.length && r[a + 1].key === s[a]; )
      a++;
    for (; r.length - 1 > a; )
      i();
    for (; r.length - 1 < s.length; ) {
      const c = r[r.length - 1];
      r.push({
        key: s[r.length - 1],
        nodeKey: _a(c),
        indices: [],
        children: [],
        nextChildIdx: 0,
        claimed: /* @__PURE__ */ new Set()
      });
    }
    const l = r[r.length - 1];
    l.children.push({
      type: "part",
      index: o,
      nodeKey: _a(l),
      idKey: Sa(l, e == null ? void 0 : e[o])
    });
    for (let c = 1; c < r.length; c++)
      r[c].indices.push(o);
  }
  for (; r.length > 1; )
    i();
  return n.children;
}, hy = Object.freeze({ type: "complete" }), py = (t, e, n) => {
  if (!n)
    return !1;
  switch (t) {
    case "never":
      return !1;
    case "always":
      return !0;
    case "empty":
      return e.length === 0;
    case "no-text": {
      const r = e[e.length - 1];
      return r === void 0 || r.type !== "text" && r.type !== "reasoning";
    }
  }
}, Qu = () => {
  throw new Error("MessagePrimitive.GroupedParts: rendered `children` under a leaf part. `children` is only meaningful for `group-…` cases — add a matching case for the part type or return `null` to skip it.");
}, Yu = (t, e, n) => {
  var i;
  if (t.type === "part")
    return /* @__PURE__ */ f(Ku, {
      index: t.index,
      children: ({ part: o }) => n({
        part: o,
        children: /* @__PURE__ */ f(Qu, {})
      })
    }, t.idKey ? `part-${t.idKey}` : `part-${t.index}`);
  const r = ((i = e[t.indices.at(-1)]) == null ? void 0 : i.status) ?? hy;
  return /* @__PURE__ */ f(qt, { children: n({
    part: {
      type: t.key,
      status: r,
      indices: t.indices
    },
    children: /* @__PURE__ */ f(Ke, { children: t.children.map((o) => Yu(o, e, n)) })
  }) }, t.idKey ?? t.nodeKey);
}, Xu = ({ groupBy: t, indicator: e = "no-text", children: n }) => {
  const r = $(Or((s) => s.message.parts)), i = $((s) => s.tools.toolUIs), o = $((s) => {
    var a;
    return e === "never" ? !1 : ((a = s.message.status) == null ? void 0 : a.type) === "running";
  });
  return /* @__PURE__ */ j(Ke, { children: [de(() => {
    const s = { toolUIs: i };
    return dy(r.map((a) => t(a, s) ?? []), r.map((a) => a.type === "tool-call" ? a.toolCallId : void 0));
  }, [
    r,
    t[Ju] ?? t,
    i
  ]).map((s) => Yu(s, r, n)), py(e, r, o) && n({
    part: { type: "indicator" },
    children: /* @__PURE__ */ f(Qu, {})
  })] });
};
Xu.displayName = "MessagePrimitive.GroupedParts";
const my = (t) => {
  const e = R(5), { children: n } = t, r = $(Bu);
  if (!r)
    return null;
  let i;
  e[0] !== n || e[1] !== r ? (i = n(r), e[0] = n, e[1] = r, e[2] = i) : i = e[2];
  let o;
  return e[3] !== i ? (o = /* @__PURE__ */ f(Ke, { children: i }), e[3] = i, e[4] = o) : o = e[4], o;
}, Zu = ke(my);
Zu.displayName = "MessagePrimitive.Quote";
const ed = (t, e) => {
  switch (e.type) {
    case "image":
      return (t == null ? void 0 : t.Image) ?? (t == null ? void 0 : t.Attachment);
    case "document":
      return (t == null ? void 0 : t.Document) ?? (t == null ? void 0 : t.Attachment);
    case "file":
      return (t == null ? void 0 : t.File) ?? (t == null ? void 0 : t.Attachment);
    default:
      return t == null ? void 0 : t.Attachment;
  }
}, fy = (t) => {
  const e = R(5), { components: n } = t, r = $(gy);
  if (!r)
    return null;
  const i = r;
  let o;
  e[0] !== n || e[1] !== i ? (o = ed(n, i), e[0] = n, e[1] = i, e[2] = o) : o = e[2];
  const s = o;
  if (!s)
    return null;
  let a;
  return e[3] !== s ? (a = /* @__PURE__ */ f(s, {}), e[3] = s, e[4] = a) : a = e[4], a;
}, td = ke((t) => {
  const e = R(5), { index: n, components: r } = t;
  let i;
  e[0] !== r ? (i = /* @__PURE__ */ f(fy, { components: r }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  return e[2] !== n || e[3] !== i ? (o = /* @__PURE__ */ f(du, {
    index: n,
    children: i
  }), e[2] = n, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => {
  var n, r, i, o, s, a, l, c;
  return t.index === e.index && ((n = t.components) == null ? void 0 : n.Image) === ((r = e.components) == null ? void 0 : r.Image) && ((i = t.components) == null ? void 0 : i.Document) === ((o = e.components) == null ? void 0 : o.Document) && ((s = t.components) == null ? void 0 : s.File) === ((a = e.components) == null ? void 0 : a.File) && ((l = t.components) == null ? void 0 : l.Attachment) === ((c = e.components) == null ? void 0 : c.Attachment);
});
td.displayName = "MessagePrimitive.AttachmentByIndex";
const Ca = ({ children: t }) => {
  const e = $((n) => n.message.role !== "user" ? 0 : (n.message.attachments ?? []).length);
  return de(() => Array.from({ length: e }, (n, r) => /* @__PURE__ */ f(du, {
    index: r,
    children: /* @__PURE__ */ f(Sn, {
      getItemState: (i) => i.message().attachment({ index: r }).getState(),
      children: (i) => t({ get attachment() {
        return i();
      } })
    })
  }, r)), [e, t]);
}, nd = (t) => {
  const e = R(4), { components: n, children: r } = t;
  if (n) {
    let o;
    return e[0] !== n ? (o = /* @__PURE__ */ f(Ca, { children: (s) => {
      const { attachment: a } = s, l = ed(n, a);
      return l ? /* @__PURE__ */ f(l, {}) : null;
    } }), e[0] = n, e[1] = o) : o = e[1], o;
  }
  let i;
  return e[2] !== r ? (i = /* @__PURE__ */ f(Ca, { children: r }), e[2] = r, e[3] = i) : i = e[3], i;
};
nd.displayName = "MessagePrimitive.Attachments";
function gy(t) {
  return t.attachment;
}
const rd = (t, e) => {
  switch (e.type) {
    case "image":
      return (t == null ? void 0 : t.Image) ?? (t == null ? void 0 : t.Attachment);
    case "document":
      return (t == null ? void 0 : t.Document) ?? (t == null ? void 0 : t.Attachment);
    case "file":
      return (t == null ? void 0 : t.File) ?? (t == null ? void 0 : t.Attachment);
    default:
      return t == null ? void 0 : t.Attachment;
  }
}, by = (t) => {
  const e = R(5), { components: n } = t, r = $(vy);
  if (!r)
    return null;
  let i;
  e[0] !== r || e[1] !== n ? (i = rd(n, r), e[0] = r, e[1] = n, e[2] = i) : i = e[2];
  const o = i;
  if (!o)
    return null;
  let s;
  return e[3] !== o ? (s = /* @__PURE__ */ f(o, {}), e[3] = o, e[4] = s) : s = e[4], s;
}, id = ke((t) => {
  const e = R(5), { index: n, components: r } = t;
  let i;
  e[0] !== r ? (i = /* @__PURE__ */ f(by, { components: r }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  return e[2] !== n || e[3] !== i ? (o = /* @__PURE__ */ f(hu, {
    index: n,
    children: i
  }), e[2] = n, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => {
  var n, r, i, o, s, a, l, c;
  return t.index === e.index && ((n = t.components) == null ? void 0 : n.Image) === ((r = e.components) == null ? void 0 : r.Image) && ((i = t.components) == null ? void 0 : i.Document) === ((o = e.components) == null ? void 0 : o.Document) && ((s = t.components) == null ? void 0 : s.File) === ((a = e.components) == null ? void 0 : a.File) && ((l = t.components) == null ? void 0 : l.Attachment) === ((c = e.components) == null ? void 0 : c.Attachment);
});
id.displayName = "ComposerPrimitive.AttachmentByIndex";
const Ta = ({ children: t }) => {
  const e = $((n) => n.composer.attachments.length);
  return de(() => Array.from({ length: e }, (n, r) => /* @__PURE__ */ f(hu, {
    index: r,
    children: /* @__PURE__ */ f(Sn, {
      getItemState: (i) => i.composer().attachment({ index: r }).getState(),
      children: (i) => t({ get attachment() {
        return i();
      } })
    })
  }, r)), [e, t]);
}, od = (t) => {
  const e = R(4), { components: n, children: r } = t;
  if (n) {
    let o;
    return e[0] !== n ? (o = /* @__PURE__ */ f(Ta, { children: (s) => {
      const { attachment: a } = s, l = rd(n, a);
      return l ? /* @__PURE__ */ f(l, {}) : null;
    } }), e[0] = n, e[1] = o) : o = e[1], o;
  }
  let i;
  return e[2] !== r ? (i = /* @__PURE__ */ f(Ta, { children: r }), e[2] = r, e[3] = i) : i = e[3], i;
};
od.displayName = "ComposerPrimitive.Attachments";
function vy(t) {
  return t.attachment;
}
const wy = ({ children: t }) => {
  const e = $((n) => n.composer.queue.length);
  return de(() => Array.from({ length: e }, (n, r) => /* @__PURE__ */ f(Gb, {
    index: r,
    children: /* @__PURE__ */ f(Sn, {
      getItemState: (i) => i.composer().queueItem({ index: r }).getState(),
      children: (i) => t({ get queueItem() {
        return i();
      } })
    })
  }, r)), [e, t]);
}, sd = ke(wy);
sd.displayName = "ComposerPrimitive.Queue";
const Ho = (t) => {
  const { children: e } = t;
  return $(yy) ? e : null;
};
Ho.displayName = "MessagePartPrimitive.InProgress";
function yy(t) {
  return t.part.status.type === "running";
}
const ad = (t) => {
  const e = R(2), { components: n } = t, r = n.Suggestion;
  let i;
  return e[0] !== r ? (i = /* @__PURE__ */ f(r, {}), e[0] = r, e[1] = i) : i = e[1], i;
}, ld = ke((t) => {
  const e = R(5), { index: n, components: r } = t;
  let i;
  e[0] !== r ? (i = /* @__PURE__ */ f(ad, { components: r }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  return e[2] !== n || e[3] !== i ? (o = /* @__PURE__ */ f(mu, {
    index: n,
    children: i
  }), e[2] = n, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components.Suggestion === e.components.Suggestion);
ld.displayName = "ThreadPrimitive.SuggestionByIndex";
const Ia = ({ children: t }) => {
  const e = $((n) => n.suggestions.suggestions.length);
  return de(() => e === 0 ? null : Array.from({ length: e }, (n, r) => /* @__PURE__ */ f(mu, {
    index: r,
    children: /* @__PURE__ */ f(Sn, {
      getItemState: (i) => i.suggestions().suggestion({ index: r }).getState(),
      children: (i) => t({ get suggestion() {
        return i();
      } })
    })
  }, r)), [e, t]);
}, cd = (t) => {
  const e = R(4), { components: n, children: r } = t;
  if (n) {
    let o;
    return e[0] !== n ? (o = /* @__PURE__ */ f(Ia, { children: () => /* @__PURE__ */ f(ad, { components: n }) }), e[0] = n, e[1] = o) : o = e[1], o;
  }
  let i;
  return e[2] !== r ? (i = /* @__PURE__ */ f(Ia, { children: r }), e[2] = r, e[3] = i) : i = e[3], i;
};
cd.displayName = "ThreadPrimitive.Suggestions";
const xy = ke(cd, (t, e) => t.children || e.children ? t.children === e.children : t.components.Suggestion === e.components.Suggestion), ky = (t) => {
  const e = R(3);
  let n;
  return e[0] !== t.dictation || e[1] !== t.editing ? (n = (r) => {
    if (t.editing === !0 && !r.composer.isEditing || t.editing === !1 && r.composer.isEditing)
      return !1;
    const i = r.composer.dictation != null;
    return !(t.dictation === !0 && !i || t.dictation === !1 && i);
  }, e[0] = t.dictation, e[1] = t.editing, e[2] = n) : n = e[2], $(n);
}, ud = (t) => {
  const e = R(3);
  let n, r;
  return e[0] !== t ? ({ children: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]), ky(r) ? n : null;
};
ud.displayName = "ComposerPrimitive.If";
const _y = () => {
  const t = R(5), e = Z(), n = $(Sy);
  let r;
  t[0] !== e ? (r = (s) => {
    e.composer().send(s);
  }, t[0] = e, t[1] = r) : r = t[1];
  const i = r;
  let o;
  return t[2] !== n || t[3] !== i ? (o = {
    send: i,
    disabled: n
  }, t[2] = n, t[3] = i, t[4] = o) : o = t[4], o;
};
function Sy(t) {
  return !t.composer.canSend || t.thread.isRunning && !t.thread.capabilities.queue;
}
const Cy = () => {
  const t = R(5), e = Z(), n = $(Ty);
  let r;
  t[0] !== e ? (r = () => {
    e.composer().cancel();
  }, t[0] = e, t[1] = r) : r = t[1];
  const i = r;
  let o;
  return t[2] !== i || t[3] !== n ? (o = {
    cancel: i,
    disabled: n
  }, t[2] = i, t[3] = n, t[4] = o) : o = t[4], o;
};
function Ty(t) {
  return !t.composer.canCancel;
}
const Iy = () => {
  const t = R(5), e = Z(), n = $(Ay);
  let r;
  t[0] !== e ? (r = () => {
    e.composer().startDictation();
  }, t[0] = e, t[1] = r) : r = t[1];
  const i = r;
  let o;
  return t[2] !== n || t[3] !== i ? (o = {
    startDictation: i,
    disabled: n
  }, t[2] = n, t[3] = i, t[4] = o) : o = t[4], o;
};
function Ay(t) {
  return t.composer.dictation != null || !t.thread.capabilities.dictation || !t.composer.isEditing;
}
const Ey = () => {
  const t = R(5), e = Z(), n = $(Ry);
  let r;
  t[0] !== e ? (r = (s) => e.composer().addAttachment(s), t[0] = e, t[1] = r) : r = t[1];
  const i = r;
  let o;
  return t[2] !== i || t[3] !== n ? (o = {
    addAttachment: i,
    disabled: n
  }, t[2] = i, t[3] = n, t[4] = o) : o = t[4], o;
};
function Ry(t) {
  return !t.composer.isEditing;
}
const My = (t) => {
  const e = R(12);
  let n;
  e[0] !== t ? (n = t === void 0 ? {} : t, e[0] = t, e[1] = n) : n = e[1];
  const { copiedDuration: r, copyToClipboard: i } = n, o = r === void 0 ? 3e3 : r, s = Z(), a = $(Ny), l = $(Dy), c = $(Ly), d = $(zy);
  let u;
  e[2] !== s || e[3] !== d || e[4] !== o || e[5] !== i || e[6] !== c ? (u = () => {
    const m = c ? d : s.message().getCopyText();
    if (!m)
      return;
    const g = i ?? Oy;
    Promise.resolve(g(m)).then(() => {
      s.message().setIsCopied(!0), setTimeout(() => s.message().setIsCopied(!1), o);
    }, $y);
  }, e[2] = s, e[3] = d, e[4] = o, e[5] = i, e[6] = c, e[7] = u) : u = e[7];
  const h = u;
  let p;
  return e[8] !== h || e[9] !== a || e[10] !== l ? (p = {
    copy: h,
    disabled: a,
    isCopied: l
  }, e[8] = h, e[9] = a, e[10] = l, e[11] = p) : p = e[11], p;
};
function Py(t) {
  return t.type === "text" && t.text.length > 0;
}
function Ny(t) {
  var e;
  return !((t.message.role !== "assistant" || ((e = t.message.status) == null ? void 0 : e.type) !== "running") && t.message.parts.some(Py));
}
function Dy(t) {
  return t.message.isCopied;
}
function Ly(t) {
  return t.composer.isEditing;
}
function zy(t) {
  return t.composer.text;
}
function Oy() {
}
function $y() {
}
const Fy = () => {
  const t = R(5), e = Z(), n = $(By);
  let r;
  t[0] !== e ? (r = () => {
    e.composer().beginEdit();
  }, t[0] = e, t[1] = r) : r = t[1];
  const i = r;
  let o;
  return t[2] !== n || t[3] !== i ? (o = {
    edit: i,
    disabled: n
  }, t[2] = n, t[3] = i, t[4] = o) : o = t[4], o;
};
function By(t) {
  return t.composer.isEditing;
}
const Uy = () => {
  const t = R(5), e = Z(), n = $(jy);
  let r;
  t[0] !== e ? (r = () => {
    e.message().reload();
  }, t[0] = e, t[1] = r) : r = t[1];
  const i = r;
  let o;
  return t[2] !== n || t[3] !== i ? (o = {
    reload: i,
    disabled: n
  }, t[2] = n, t[3] = i, t[4] = o) : o = t[4], o;
};
function jy(t) {
  return t.thread.isRunning || t.thread.isDisabled || t.message.role !== "assistant";
}
const Vy = () => {
  const t = R(5), e = Z(), n = $(Hy);
  let r;
  t[0] !== e ? (r = () => {
    e.message().submitFeedback({ type: "positive" });
  }, t[0] = e, t[1] = r) : r = t[1];
  const i = r;
  let o;
  return t[2] !== n || t[3] !== i ? (o = {
    submit: i,
    isSubmitted: n
  }, t[2] = n, t[3] = i, t[4] = o) : o = t[4], o;
}, qy = () => {
  const t = R(5), e = Z(), n = $(Wy);
  let r;
  t[0] !== e ? (r = () => {
    e.message().submitFeedback({ type: "negative" });
  }, t[0] = e, t[1] = r) : r = t[1];
  const i = r;
  let o;
  return t[2] !== n || t[3] !== i ? (o = {
    submit: i,
    isSubmitted: n
  }, t[2] = n, t[3] = i, t[4] = o) : o = t[4], o;
};
function Hy(t) {
  var e;
  return ((e = t.message.metadata.submittedFeedback) == null ? void 0 : e.type) === "positive";
}
function Wy(t) {
  var e;
  return ((e = t.message.metadata.submittedFeedback) == null ? void 0 : e.type) === "negative";
}
const Gy = () => {
  const t = R(5), e = Z(), n = $(Jy);
  let r;
  t[0] !== e ? (r = async () => {
    e.message().speak();
  }, t[0] = e, t[1] = r) : r = t[1];
  const i = r;
  let o;
  return t[2] !== n || t[3] !== i ? (o = {
    speak: i,
    disabled: n
  }, t[2] = n, t[3] = i, t[4] = o) : o = t[4], o;
};
function Ky(t) {
  return t.type === "text" && t.text.length > 0;
}
function Jy(t) {
  var e;
  return !((t.message.role !== "assistant" || ((e = t.message.status) == null ? void 0 : e.type) !== "running") && t.message.parts.some(Ky));
}
const Qy = () => {
  const t = R(5), e = Z(), n = $(Yy);
  let r;
  t[0] !== e ? (r = () => {
    e.message().stopSpeaking();
  }, t[0] = e, t[1] = r) : r = t[1];
  const i = r;
  let o;
  return t[2] !== n || t[3] !== i ? (o = {
    stopSpeaking: i,
    disabled: n
  }, t[2] = n, t[3] = i, t[4] = o) : o = t[4], o;
};
function Yy(t) {
  return t.message.speech == null;
}
const Xy = (t) => {
  const e = R(8), { prompt: n, send: r, clearComposer: i } = t, o = i === void 0 ? !0 : i, s = Z(), a = $(Zy), l = r ?? !1;
  let c;
  e[0] !== s || e[1] !== o || e[2] !== n || e[3] !== l ? (c = () => {
    const h = s.thread().getState().isRunning;
    if (l && !h)
      s.thread().append({
        content: [{
          type: "text",
          text: n
        }],
        runConfig: s.composer().getState().runConfig
      }), o && s.composer().setText("");
    else if (o)
      s.composer().setText(n);
    else {
      const p = s.composer().getState().text;
      s.composer().setText(p.trim() ? `${p} ${n}` : n);
    }
  }, e[0] = s, e[1] = o, e[2] = n, e[3] = l, e[4] = c) : c = e[4];
  const d = c;
  let u;
  return e[5] !== a || e[6] !== d ? (u = {
    trigger: d,
    disabled: a
  }, e[5] = a, e[6] = d, e[7] = u) : u = e[7], u;
};
function Zy(t) {
  return t.thread.isDisabled;
}
const dd = () => $(ex);
function ex(t) {
  var e;
  return ((e = t.message.status) == null ? void 0 : e.type) === "incomplete" && t.message.status.reason === "error" ? t.message.status.error ?? "An error occurred" : void 0;
}
const tx = (t) => {
  let e = Jn;
  const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  let i = !1, o = 0;
  const s = () => {
    for (const m of r)
      m();
  }, a = (m) => {
    e = m, p.items = m, s();
  }, l = () => {
    if (i || e.length === 0)
      return;
    const m = e[0], g = n.get(m.id);
    n.delete(m.id), a(e.slice(1)), g && (i = !0, t.run(g, { steer: !1 }));
  }, c = (m, { steer: g }) => {
    const w = pt(), b = Kn(m);
    n.set(w, m), a([...e, {
      id: w,
      prompt: b
    }]), g ? d(w) : l();
  }, d = (m) => {
    if (!n.has(m))
      return;
    if (t.cancel && i) {
      const w = n.get(m);
      n.delete(m), a(e.filter((b) => b.id !== m)), o++, t.cancel(), i = !0, t.run(w, { steer: !0 });
      return;
    }
    const g = e.find((w) => w.id === m);
    g && (a([g, ...e.filter((w) => w.id !== m)]), l());
  }, p = {
    items: e,
    enqueue: c,
    steer: d,
    remove: (m) => {
      n.delete(m) && a(e.filter((g) => g.id !== m));
    },
    clear: () => {
      e.length !== 0 && (n.clear(), a(Jn));
    }
  };
  return {
    adapter: p,
    notifyBusy: () => {
      i = !0;
    },
    notifyIdle: () => {
      if (o > 0) {
        o--;
        return;
      }
      i = !1, l();
    },
    subscribe: (m) => (r.add(m), () => {
      r.delete(m);
    })
  };
}, yi = (t, e) => {
  var n;
  return ((n = t.status) == null ? void 0 : n.type) !== "requires-action" || t.status.reason !== "tool-calls" || t.content.some((r) => r.type === "tool-call" && r.result === void 0 && r.approval !== void 0 && r.approval.approved === void 0 && r.approval.resolution === void 0) ? !1 : e === void 0 ? t.content.every((r) => r.type !== "tool-call" || !!r.result || r.approval !== void 0) : t.content.every((r) => r.type !== "tool-call" || !!r.result || r.approval !== void 0 || !e.includes(r.toolName));
};
var xi = class extends Error {
  constructor(e, n) {
    super(n);
    C(this, "name", "AbortError");
    C(this, "detach");
    this.detach = e;
  }
}, nx = class extends yv {
  constructor(e, n) {
    super(e);
    C(this, "capabilities", {
      switchToBranch: !0,
      switchBranchDuringRun: !0,
      edit: !0,
      delete: !1,
      reload: !0,
      cancel: !0,
      unstable_copy: !0,
      speech: !1,
      dictation: !1,
      voice: !1,
      attachments: !1,
      feedback: !1,
      queue: !1
    });
    C(this, "abortController", null);
    C(this, "_queue", null);
    C(this, "_queueRunInFlight", !1);
    C(this, "isDisabled", !1);
    C(this, "isSendDisabled", !1);
    C(this, "_isLoading", !1);
    C(this, "_suggestions", []);
    C(this, "_suggestionsController", null);
    C(this, "_options");
    C(this, "_lastRunConfig", {});
    C(this, "_getThreadId");
    C(this, "_getInitializePromise");
    C(this, "_loadPromise");
    this.__internal_setOptions(n);
  }
  get isLoading() {
    return this._isLoading;
  }
  get suggestions() {
    return this._suggestions;
  }
  get adapters() {
    return this._options.adapters;
  }
  __internal_setGetThreadId(e) {
    this._getThreadId = e;
  }
  __internal_setGetInitializePromise(e) {
    this._getInitializePromise = e;
  }
  get extras() {
  }
  __internal_setOptions(e) {
    var d, u, h, p, m, g, w;
    if (this._options === e)
      return;
    this._options = e;
    let n = !1;
    const r = ((d = e.adapters) == null ? void 0 : d.speech) !== void 0;
    this.capabilities.speech !== r && (this.capabilities.speech = r, n = !0);
    const i = ((u = e.adapters) == null ? void 0 : u.dictation) !== void 0;
    this.capabilities.dictation !== i && (this.capabilities.dictation = i, n = !0);
    const o = ((h = e.adapters) == null ? void 0 : h.voice) !== void 0;
    this.capabilities.voice !== o && (this.capabilities.voice = o, n = !0);
    const s = ((p = e.adapters) == null ? void 0 : p.attachments) !== void 0;
    this.capabilities.attachments !== s && (this.capabilities.attachments = s, n = !0);
    const a = ((m = e.adapters) == null ? void 0 : m.feedback) !== void 0;
    this.capabilities.feedback !== a && (this.capabilities.feedback = a, n = !0);
    const l = ((w = (g = e.adapters) == null ? void 0 : g.history) == null ? void 0 : w.delete) !== void 0;
    this.capabilities.delete !== l && (this.capabilities.delete = l, n = !0);
    const c = e.unstable_enableMessageQueue === !0;
    c && !this._queue ? (this._queue = tx({ run: (b) => {
      this._queueRunInFlight = !0, this._runAppend(b).finally(() => {
        var k;
        this._queueRunInFlight = !1, (k = this._queue) == null || k.notifyIdle();
      }).catch(() => {
      });
    } }), this._queue.subscribe(() => this._notifySubscribers())) : !c && this._queue && (this._queue.adapter.clear("cancel-run"), this._queue = null), this.capabilities.queue !== c && (this.capabilities.queue = c, n = !0), n && this._notifySubscribers();
  }
  __internal_load() {
    var n;
    if (this._loadPromise)
      return this._loadPromise;
    const e = ((n = this.adapters.history) == null ? void 0 : n.load()) ?? Promise.resolve(null);
    return this._isLoading = !0, this._notifySubscribers(), this._loadPromise = e.then((r) => {
      var o, s;
      if (!r)
        return;
      this.repository.import(r), r.messages.length > 0 && this.ensureInitialized(), this._notifySubscribers();
      const i = (s = (o = this.adapters.history) == null ? void 0 : o.resume) == null ? void 0 : s.bind(this.adapters.history);
      r.unstable_resume && i && this.startRun({
        parentId: this.repository.headId,
        sourceId: this.repository.headId,
        runConfig: this._lastRunConfig
      }, i).catch(() => {
      });
    }).finally(() => {
      this._isLoading = !1, this._notifySubscribers();
    }), this._loadPromise;
  }
  async append(e) {
    var i;
    const n = e.parentId === (((i = this.messages.at(-1)) == null ? void 0 : i.id) ?? null), r = e.startRun ?? e.role === "user";
    if (this._queue && r && n) {
      this._queue.adapter.enqueue(e, { steer: e.steer ?? !1 });
      return;
    }
    return this._queue && !n && this._queue.adapter.clear("edit"), this._runAppend(e);
  }
  getQueueItems() {
    var e;
    return ((e = this._queue) == null ? void 0 : e.adapter.items) ?? Jn;
  }
  steerQueueItem(e) {
    var n;
    (n = this._queue) == null || n.adapter.steer(e);
  }
  removeQueueItem(e) {
    var n;
    (n = this._queue) == null || n.adapter.remove(e);
  }
  async _runAppend(e) {
    var i, o;
    this.ensureInitialized();
    const n = (i = this._getInitializePromise) == null ? void 0 : i.call(this);
    n && await n;
    const r = zr(e, pt(), {
      type: "complete",
      reason: "unknown"
    });
    this.repository.addOrUpdateMessage(e.parentId, r), (o = this._options.adapters.history) == null || o.append({
      parentId: e.parentId,
      message: r,
      ...e.runConfig !== void 0 && { runConfig: e.runConfig }
    }), e.startRun ?? e.role === "user" ? await this.startRun({
      parentId: r.id,
      sourceId: e.sourceId,
      runConfig: e.runConfig ?? {}
    }) : (this.repository.resetHead(r.id), this._notifySubscribers());
  }
  async deleteMessage(e) {
    var a;
    const n = this._options.adapters.history;
    if (!(n != null && n.delete))
      throw new Error("Runtime does not support deleting messages.");
    const r = this.repository.getMessages(), i = r.findIndex((l) => l.id === e);
    if (i === -1)
      throw new Error("Message not found.");
    const o = r[i], s = [{
      parentId: ((a = r[i - 1]) == null ? void 0 : a.id) ?? null,
      message: o
    }];
    await n.delete(s), this.repository.deleteMessage(e), this._notifySubscribers();
  }
  resumeRun({ stream: e, ...n }) {
    if (!e)
      throw new Error("You must pass a stream parameter to resume runs.");
    return this.startRun(n, e);
  }
  exportExternalState() {
    throw new Error("Runtime does not support exporting external states.");
  }
  importExternalState() {
    throw new Error("Runtime does not support importing external states.");
  }
  async startRun({ parentId: e, runConfig: n }, r) {
    this.ensureInitialized();
    const i = {
      id: pt(),
      role: "assistant",
      status: { type: "running" },
      content: [],
      metadata: {
        unstable_state: this.state,
        unstable_annotations: [],
        unstable_data: [],
        steps: [],
        custom: {}
      },
      createdAt: /* @__PURE__ */ new Date()
    };
    return this._runLoop(e, i, n, r);
  }
  async _runLoop(e, n, r, i) {
    var s, a, l, c;
    this._notifyEventSubscribers("runStart", {});
    try {
      (s = this._queue) == null || s.notifyBusy(), this._suggestions = [], (a = this._suggestionsController) == null || a.abort(), this._suggestionsController = null, this._notifySubscribers();
      do
        n = await this.performRoundtrip(e, n, r, i), i = void 0;
      while (yi(n, this._options.unstable_humanToolNames));
    } finally {
      this._notifyEventSubscribers("runEnd", {}), this._queueRunInFlight || queueMicrotask(() => {
        var d;
        return (d = this._queue) == null ? void 0 : d.notifyIdle();
      });
    }
    this._suggestionsController = new AbortController();
    const o = this._suggestionsController.signal;
    if (this.adapters.suggestion && ((l = n.status) == null ? void 0 : l.type) !== "requires-action") {
      const d = (c = this.adapters.suggestion) == null ? void 0 : c.generate({ messages: this.messages });
      if (Symbol.asyncIterator in d)
        for await (const u of d) {
          if (o.aborted)
            break;
          this._suggestions = u, this._notifySubscribers();
        }
      else {
        const u = await d;
        if (o.aborted)
          return;
        this._suggestions = u, this._notifySubscribers();
      }
    }
  }
  async performRoundtrip(e, n, r, i) {
    var p, m, g, w, b, k, x, T, I;
    const o = e ? this.repository.getMessages(e) : [];
    (p = this.abortController) == null || p.abort(), this.abortController = new AbortController();
    const s = n.content, a = (m = n.metadata) == null ? void 0 : m.unstable_annotations, l = (g = n.metadata) == null ? void 0 : g.unstable_data, c = (w = n.metadata) == null ? void 0 : w.steps, d = (b = n.metadata) == null ? void 0 : b.custom, u = (y) => {
      var D, O, z, V, G;
      const M = (D = y.metadata) == null ? void 0 : D.steps, E = M ? [...c ?? [], ...M] : void 0, N = (O = y.metadata) == null ? void 0 : O.unstable_annotations, _ = (z = y.metadata) == null ? void 0 : z.unstable_data, A = N ? [...a ?? [], ...N] : void 0, P = _ ? [...l ?? [], ..._] : void 0;
      n = {
        ...n,
        ...y.content ? { content: [...s, ...y.content ?? []] } : void 0,
        status: y.status ?? n.status,
        ...y.metadata ? { metadata: {
          ...n.metadata,
          ...y.metadata.unstable_state ? { unstable_state: y.metadata.unstable_state } : void 0,
          ...A ? { unstable_annotations: A } : void 0,
          ...P ? { unstable_data: P } : void 0,
          ...E ? { steps: E } : void 0,
          ...(V = y.metadata) != null && V.timing ? { timing: y.metadata.timing } : void 0,
          ...(G = y.metadata) != null && G.custom ? { custom: {
            ...d ?? {},
            ...y.metadata.custom
          } } : void 0
        } } : void 0
      }, this.repository.addOrUpdateMessage(e, n), this._notifySubscribers();
    }, h = this._options.maxSteps ?? 2;
    if ((((x = (k = n.metadata) == null ? void 0 : k.steps) == null ? void 0 : x.length) ?? 0) >= h)
      return u({ status: {
        type: "incomplete",
        reason: "tool-calls"
      } }), n;
    u({ status: { type: "running" } }), this.repository.resetHead(n.id), this._notifySubscribers();
    try {
      this._lastRunConfig = r ?? {};
      const { unstable_composerMetadata: y, ...M } = this.getModelContext();
      i = i ?? this.adapters.chatModel.run.bind(this.adapters.chatModel);
      const E = this.abortController.signal, N = (T = this._getThreadId) == null ? void 0 : T.call(this), _ = i({
        messages: o,
        runConfig: this._lastRunConfig,
        abortSignal: E,
        context: M,
        unstable_assistantMessageId: n.id,
        unstable_threadId: N,
        unstable_parentId: e,
        unstable_getMessage() {
          return n;
        }
      });
      if (Symbol.asyncIterator in _)
        for await (const A of _) {
          if (E.aborted) {
            u({ status: {
              type: "incomplete",
              reason: "cancelled"
            } });
            break;
          }
          u(A);
        }
      else
        u(await _);
      n.status.type === "running" && u({ status: {
        type: "complete",
        reason: "unknown"
      } });
    } catch (y) {
      if (y instanceof xi)
        u({ status: {
          type: "incomplete",
          reason: "cancelled"
        } });
      else if (y instanceof Error && y.name === "AbortError")
        u({ status: {
          type: "incomplete",
          reason: "cancelled"
        } });
      else
        throw u({ status: {
          type: "incomplete",
          reason: "error",
          error: y instanceof Error ? y.message : `[${typeof y}] ${new String(y).toString()}`
        } }), y;
    } finally {
      this.abortController = null, (n.status.type === "complete" || n.status.type === "incomplete") && await ((I = this._options.adapters.history) == null ? void 0 : I.append({
        parentId: e,
        message: n,
        runConfig: this._lastRunConfig
      }));
    }
    return n;
  }
  detach() {
    var n, r;
    (n = this._queue) == null || n.adapter.clear("cancel-run");
    const e = new xi(!0);
    (r = this.abortController) == null || r.abort(e), this.abortController = null;
  }
  cancelRun() {
    var n, r;
    (n = this._queue) == null || n.adapter.clear("cancel-run");
    const e = new xi(!1);
    (r = this.abortController) == null || r.abort(e), this.abortController = null;
  }
  addToolResult({ messageId: e, toolCallId: n, result: r, isError: i, artifact: o }) {
    const s = this.repository.getMessage(e), { parentId: a } = s;
    let { message: l } = s;
    if (l.role !== "assistant")
      throw new Error("Tried to add tool result to non-assistant message");
    let c = !1, d = !1;
    const u = l.content.map((h) => h.type !== "tool-call" || h.toolCallId !== n ? h : (d = !0, h.result || (c = !0), {
      ...h,
      result: r,
      artifact: o,
      isError: i
    }));
    if (!d)
      throw new Error("Tried to add tool result to non-existing tool call");
    l = {
      ...l,
      content: u
    }, this.repository.addOrUpdateMessage(a, l), this._notifySubscribers(), c && yi(l, this._options.unstable_humanToolNames) && this._runLoop(a, l, this._lastRunConfig).catch(() => {
    });
  }
  resumeToolCall(e) {
    throw new Error("Local runtime does not support resuming tool calls. For human-in-the-loop tools, list the tool in unstable_humanToolNames and complete the call with addToolResult.");
  }
  respondToToolApproval({ approvalId: e, approved: n, optionId: r, reason: i }) {
    var d;
    let o = this.repository.getMessages().findLast((u) => u.role === "assistant" && u.content.some((h) => {
      var p;
      return h.type === "tool-call" && ((p = h.approval) == null ? void 0 : p.id) === e;
    }));
    if (!o)
      throw new Error("Tried to respond to a non-existing tool approval");
    if (this.abortController !== null)
      throw new Error("Tried to respond to a tool approval while a run is in progress");
    if (((d = o.status) == null ? void 0 : d.type) !== "requires-action")
      throw new Error("Tried to respond to a tool approval on a message whose status is not requires-action");
    const s = o.content.find((u) => {
      var h;
      return u.type === "tool-call" && ((h = u.approval) == null ? void 0 : h.id) === e;
    });
    if ((s == null ? void 0 : s.type) !== "tool-call" || !s.approval)
      throw new Error("Tried to respond to a non-existing tool approval");
    if (s.approval.resolution !== void 0)
      throw new Error("Tried to respond to a tool approval that was cancelled or expired");
    if (s.approval.approved !== void 0)
      throw new Error("Tried to respond to an already decided tool approval");
    const a = s.approval, l = o.content.map((u) => {
      if (u !== s)
        return u;
      const h = {
        ...a,
        approved: n,
        ...r != null && { optionId: r },
        ...i != null && { reason: i }
      };
      return n ? {
        ...u,
        approval: h
      } : {
        ...u,
        approval: h,
        result: { error: i || "Tool approval denied" },
        isError: !0
      };
    });
    o = {
      ...o,
      content: l
    };
    const { parentId: c } = this.repository.getMessage(o.id);
    this.repository.addOrUpdateMessage(c, o), this._notifySubscribers(), this.repository.headId === o.id && yi(o, this._options.unstable_humanToolNames) && this._runLoop(c, o, this._lastRunConfig).catch(() => {
    });
  }
};
const Aa = Object.freeze([]), to = "__DEFAULT_ID__", rx = Object.freeze({ [to]: {
  id: to,
  remoteId: void 0,
  externalId: void 0,
  status: "regular",
  title: void 0
} });
var ix = class extends ir {
  constructor(e) {
    super();
    C(this, "_mainThread");
    this._mainThread = e();
  }
  get isLoading() {
    return !1;
  }
  getMainThreadRuntimeCore() {
    return this._mainThread;
  }
  get newThreadId() {
  }
  get threadIds() {
    return Aa;
  }
  get archivedThreadIds() {
    return Aa;
  }
  get mainThreadId() {
    return to;
  }
  get threadItems() {
    return rx;
  }
  getThreadRuntimeCore() {
    throw new Error("Method not implemented.");
  }
  getLoadThreadsPromise() {
    return Promise.resolve();
  }
  getItemById(e) {
    if (e === this.mainThreadId)
      return {
        status: "regular",
        id: this.mainThreadId,
        remoteId: this.mainThreadId,
        externalId: void 0,
        title: void 0,
        isMain: !0
      };
    throw new Error("Method not implemented");
  }
  async switchToThread() {
    throw new Error("Method not implemented.");
  }
  switchToNewThread() {
    throw new Error("Method not implemented.");
  }
  rename() {
    throw new Error("Method not implemented.");
  }
  archive() {
    throw new Error("Method not implemented.");
  }
  detach() {
    throw new Error("Method not implemented.");
  }
  unarchive() {
    throw new Error("Method not implemented.");
  }
  delete() {
    throw new Error("Method not implemented.");
  }
  initialize(e) {
    return Promise.resolve({
      remoteId: e,
      externalId: void 0
    });
  }
  generateTitle() {
    throw new Error("Method not implemented.");
  }
}, ox = class extends Bo {
  constructor(e, n) {
    super();
    C(this, "threads");
    C(this, "Provider");
    C(this, "_options");
    this._options = e, this.threads = new ix(() => new nx(this._contextProvider, this._options)), n && this.threads.getMainThreadRuntimeCore().import(_u.fromArray(n));
  }
};
const sx = (t, { initialMessages: e, ...n }) => {
  const { modelContext: r, ...i } = cv() ?? {}, o = {
    ...n,
    adapters: {
      ...i,
      ...n.adapters,
      chatModel: t
    }
  }, [s] = xe(() => new ox(o, e)), a = ne(void 0);
  return a.current = $((l) => l.threadListItem.remoteId), Y(() => {
    s.threads.getMainThreadRuntimeCore().__internal_setGetThreadId(() => a.current);
  }, [s]), Y(() => () => {
    s.threads.getMainThreadRuntimeCore().detach();
  }, [s]), Y(() => {
    s.threads.getMainThreadRuntimeCore().__internal_setOptions(o), s.threads.getMainThreadRuntimeCore().__internal_load();
  }), Y(() => {
    if (r)
      return s.registerModelContextProvider(r);
  }, [r, s]), de(() => new Fo(s), [s]);
}, ax = (t) => {
  const { cloud: e, initialMessages: n, maxSteps: r, adapters: i, unstable_humanToolNames: o, unstable_enableMessageQueue: s, ...a } = t;
  return {
    localRuntimeOptions: {
      cloud: e,
      initialMessages: n,
      maxSteps: r,
      adapters: i,
      unstable_humanToolNames: o,
      unstable_enableMessageQueue: s
    },
    otherOptions: a
  };
}, lx = (t, { cloud: e, ...n } = {}) => Av({
  runtimeHook: function() {
    return sx(t, n);
  },
  adapter: vw({ cloud: e }),
  allowNesting: !0
}), Ea = Symbol.for("@assistant-ui/core.loaded");
function cx() {
  const t = globalThis;
  t[Ea] && console.warn("[@assistant-ui/core] Multiple copies of @assistant-ui/core are loaded into the same runtime. This causes subtle bugs (tools not reaching the runtime, context lookups returning the wrong provider, instanceof checks failing). Run `npx assistant-ui doctor` to diagnose."), t[Ea] = !0;
}
const ux = /:([\w-]{1,64})\[([^\]\n]{1,1024})\](?:\{name=([^}\n]{1,1024})\})?/gu, hd = {
  serialize(t) {
    const e = t.id !== t.label ? `{name=${t.id}}` : "";
    return `:${t.type}[${t.label}]${e}`;
  },
  parse(t) {
    const e = [];
    let n = 0;
    for (const r of t.matchAll(ux)) {
      r.index > n && e.push({
        kind: "text",
        text: t.slice(n, r.index)
      });
      const i = r[2];
      e.push({
        kind: "mention",
        type: r[1],
        label: i,
        id: r[3] ?? i
      }), n = r.index + r[0].length;
    }
    return n < t.length && e.push({
      kind: "text",
      text: t.slice(n)
    }), e;
  }
};
({}).NODE_ENV !== "production" && cx();
function dx(t, e) {
  function n(r) {
    const i = Xe(t);
    if (!(r != null && r.optional) && !i)
      throw new Error(`This component must be used within ${e}.`);
    return i;
  }
  return n;
}
function pd(t, e) {
  function n(i) {
    const o = t(i);
    return o ? o[e] : null;
  }
  function r(i) {
    let o = !1, s;
    typeof i == "function" ? s = i : i && typeof i == "object" && (o = !!i.optional, s = i.selector);
    const a = n({ optional: o });
    return a ? s ? a(s) : a() : null;
  }
  return {
    [e]: r,
    [`${e}Store`]: n
  };
}
const md = Ye(null), { useThreadViewport: Xt, useThreadViewportStore: Zt } = pd(dx(md, "ThreadPrimitive.Viewport"), "useThreadViewport");
let un;
const ki = () => {
  if (un)
    return un;
  const t = () => ({
    apis: /* @__PURE__ */ new Map(),
    nextId: 0,
    listeners: /* @__PURE__ */ new Set()
  });
  if (typeof window > "u")
    return un = t(), un;
  const e = window.__ASSISTANT_UI_DEVTOOLS_HOOK__;
  if (e)
    return un = e, e;
  const n = t();
  return window.__ASSISTANT_UI_DEVTOOLS_HOOK__ = n, un = n, n;
};
var tt, hx = (tt = class {
  static register(e) {
    var a, l;
    const n = ki();
    for (const c of n.apis.values())
      if (c.api === e)
        return () => {
        };
    const r = n.nextId++, i = {
      api: e,
      logs: []
    }, o = (a = e.on) == null ? void 0 : a.call(e, "*", (c) => {
      const d = n.apis.get(r);
      d && (d.logs.push({
        time: /* @__PURE__ */ new Date(),
        event: c.event,
        data: c.payload
      }), d.logs.length > tt.MAX_EVENT_LOGS_PER_API && (d.logs = d.logs.slice(-tt.MAX_EVENT_LOGS_PER_API)), tt.notifyListeners(r));
    }), s = (l = e.subscribe) == null ? void 0 : l.call(e, () => {
      tt.notifyListeners(r);
    });
    return n.apis.set(r, i), tt.notifyListeners(r), () => {
      const c = ki();
      c.apis.get(r) && (o == null || o(), s == null || s(), c.apis.delete(r), tt.notifyListeners(r));
    };
  }
  static notifyListeners(e) {
    ki().listeners.forEach((n) => n(e));
  }
}, C(tt, "MAX_EVENT_LOGS_PER_API", 200), tt);
const Ra = (t) => {
  const e = /* @__PURE__ */ new Map(), n = () => {
    let r = 0;
    for (const i of e.values())
      r += i;
    t(r);
  };
  return { register: () => {
    const r = Symbol();
    return e.set(r, 0), {
      setHeight: (i) => {
        e.get(r) !== i && (e.set(r, i), n());
      },
      unregister: () => {
        e.delete(r), n();
      }
    };
  } };
}, px = (t = {}) => {
  const e = /* @__PURE__ */ new Set(), n = Ra((s) => {
    o.setState({ height: {
      ...o.getState().height,
      viewport: s
    } });
  }), r = Ra((s) => {
    o.setState({ height: {
      ...o.getState().height,
      inset: s
    } });
  }), i = (s, a) => (o.setState({ element: {
    ...o.getState().element,
    [s]: a
  } }), () => {
    o.getState().element[s] === a && o.setState({ element: {
      ...o.getState().element,
      [s]: null
    } });
  }), o = wn(() => {
    var s, a;
    return {
      isAtBottom: !0,
      scrollToBottom: ({ behavior: l = "auto" } = {}) => {
        for (const c of e)
          c({ behavior: l });
      },
      onScrollToBottom: (l) => (e.add(l), () => {
        e.delete(l);
      }),
      turnAnchor: t.turnAnchor ?? "bottom",
      topAnchorMessageClamp: {
        tallerThan: ((s = t.topAnchorMessageClamp) == null ? void 0 : s.tallerThan) ?? "10em",
        visibleHeight: ((a = t.topAnchorMessageClamp) == null ? void 0 : a.visibleHeight) ?? "6em"
      },
      height: {
        viewport: 0,
        inset: 0
      },
      element: {
        viewport: null,
        anchor: null,
        target: null
      },
      targetConfig: null,
      topAnchorTurn: null,
      registerViewport: n.register,
      registerContentInset: r.register,
      registerViewportElement: (l) => i("viewport", l),
      registerAnchorElement: (l) => i("anchor", l),
      registerAnchorTargetElement: (l, c) => (o.setState({
        element: {
          ...o.getState().element,
          target: l
        },
        targetConfig: l && c ? c : null
      }), () => {
        o.getState().element.target === l && o.setState({
          element: {
            ...o.getState().element,
            target: null
          },
          targetConfig: null
        });
      }),
      setTopAnchorTurn: (l) => {
        o.setState({ topAnchorTurn: l });
      }
    };
  });
  return o;
}, $r = (t) => t, mx = (t) => {
  const e = R(11);
  let n;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (n = { optional: !0 }, e[0] = n) : n = e[0];
  const r = Zt(n);
  let i;
  e[1] !== t ? (i = () => px(t), e[1] = t, e[2] = i) : i = e[2];
  const [o] = xe(i);
  let s, a;
  e[3] !== r || e[4] !== o ? (s = () => r == null ? void 0 : r.getState().onScrollToBottom(() => {
    o.getState().scrollToBottom();
  }), a = [r, o], e[3] = r, e[4] = o, e[5] = s, e[6] = a) : (s = e[5], a = e[6]), Y(s, a);
  let l, c;
  return e[7] !== r || e[8] !== o ? (l = () => {
    if (r)
      return o.subscribe((d) => {
        r.getState().isAtBottom !== d.isAtBottom && $r(r).setState({ isAtBottom: d.isAtBottom });
      });
  }, c = [o, r], e[7] = r, e[8] = o, e[9] = l, e[10] = c) : (l = e[9], c = e[10]), Y(l, c), o;
}, Wo = (t) => {
  const e = R(7), { children: n, options: r } = t;
  let i;
  e[0] !== r ? (i = r === void 0 ? {} : r, e[0] = r, e[1] = i) : i = e[1];
  const o = mx(i);
  let s;
  e[2] !== o ? (s = () => ({ useThreadViewport: o }), e[2] = o, e[3] = s) : s = e[3];
  const [a] = xe(s);
  let l;
  return e[4] !== n || e[5] !== a ? (l = /* @__PURE__ */ f(md.Provider, {
    value: a,
    children: n
  }), e[4] = n, e[5] = a, e[6] = l) : l = e[6], l;
}, fx = () => {
  const t = R(3), e = Z();
  let n, r;
  return t[0] !== e ? (n = () => {
    if (!(typeof process > "u" || {}.NODE_ENV === "production"))
      return hx.register(e);
  }, r = [e], t[0] = e, t[1] = n, t[2] = r) : (n = t[1], r = t[2]), Y(n, r), null;
}, gx = (t) => {
  const e = R(7), { children: n, aui: r, runtime: i } = t, o = r ?? null;
  let s;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ f(fx, {}), e[0] = s) : s = e[0];
  let a;
  e[1] !== n ? (a = /* @__PURE__ */ f(Wo, { children: n }), e[1] = n, e[2] = a) : a = e[2];
  let l;
  return e[3] !== i || e[4] !== o || e[5] !== a ? (l = /* @__PURE__ */ j(Xg, {
    runtime: i,
    aui: o,
    children: [s, a]
  }), e[3] = i, e[4] = o, e[5] = a, e[6] = l) : l = e[6], l;
}, bx = ke(gx);
function vx(t) {
  const e = R(2), n = Z();
  let r;
  e[0] !== n ? (r = () => {
    var o, s;
    return n.composer.source ? ((s = (o = n.composer()).__internal_getRuntime) == null ? void 0 : s.call(o)) ?? null : null;
  }, e[0] = n, e[1] = r) : r = e[1];
  const i = $(r);
  if (!i && !(t != null && t.optional))
    throw new Error("ComposerRuntime is not available");
  return i;
}
function Ma(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
function wx(...t) {
  return (e) => {
    let n = !1;
    const r = t.map((i) => {
      const o = Ma(i, e);
      return !n && typeof o == "function" && (n = !0), o;
    });
    if (n)
      return () => {
        for (let i = 0; i < r.length; i++) {
          const o = r[i];
          typeof o == "function" ? o() : Ma(t[i], null);
        }
      };
  };
}
function en(...t) {
  return Ue(wx(...t), t);
}
var Pa = Object.defineProperty, tn = (t, e) => {
  let n = {};
  for (var r in t)
    Pa(n, r, {
      get: t[r],
      enumerable: !0
    });
  return e || Pa(n, Symbol.toStringTag, { value: "Module" }), n;
};
const yx = window.ReactDOM;
yx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
// @__NO_SIDE_EFFECTS__
function fd(t) {
  const e = ie((n, r) => {
    let { children: i, ...o } = n, s = null, a = !1;
    const l = [];
    Na(i) && typeof gr == "function" && (i = gr(i._payload)), ji.forEach(i, (h) => {
      var p;
      if (Tx(h)) {
        a = !0;
        const m = h;
        let g = "child" in m.props ? m.props.child : m.props.children;
        Na(g) && typeof gr == "function" && (g = gr(g._payload)), s = _x(m, g), l.push((p = s == null ? void 0 : s.props) == null ? void 0 : p.children);
      } else
        l.push(h);
    }), s ? s = Ht(s, void 0, l) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && ji.count(i) === 1 && Rt(i) && (s = i)
    );
    const c = s ? Cx(s) : void 0, d = en(r, c);
    if (!s) {
      if (i || i === 0)
        throw new Error(
          a ? Rx(t) : Ex(t)
        );
      return i;
    }
    const u = Sx(o, s.props ?? {});
    return s.type !== qt && (u.ref = r ? d : c), Ht(s, u);
  });
  return e.displayName = `${t}.Slot`, e;
}
var Fr = /* @__PURE__ */ fd("Slot"), gd = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function xx(t) {
  const e = (n) => "child" in n ? n.children(n.child) : n.children;
  return e.displayName = `${t}.Slottable`, e.__radixId = gd, e;
}
var kx = /* @__PURE__ */ xx("Slottable"), _x = (t, e) => {
  if ("child" in t.props) {
    const n = t.props.child;
    return Rt(n) ? Ht(n, void 0, t.props.children(n.props.children)) : null;
  }
  return Rt(e) ? e : null;
};
function Sx(t, e) {
  const n = { ...e };
  for (const r in e) {
    const i = t[r], o = e[r];
    /^on[A-Z]/.test(r) ? i && o ? n[r] = (...a) => {
      const l = o(...a);
      return i(...a), l;
    } : i && (n[r] = i) : r === "style" ? n[r] = { ...i, ...o } : r === "className" && (n[r] = [i, o].filter(Boolean).join(" "));
  }
  return { ...t, ...n };
}
function Cx(t) {
  var r, i;
  let e = (r = Object.getOwnPropertyDescriptor(t.props, "ref")) == null ? void 0 : r.get, n = e && "isReactWarning" in e && e.isReactWarning;
  return n ? t.ref : (e = (i = Object.getOwnPropertyDescriptor(t, "ref")) == null ? void 0 : i.get, n = e && "isReactWarning" in e && e.isReactWarning, n ? t.props.ref : t.props.ref || t.ref);
}
function Tx(t) {
  return Rt(t) && typeof t.type == "function" && "__radixId" in t.type && t.type.__radixId === gd;
}
var Ix = Symbol.for("react.lazy");
function Na(t) {
  return t != null && typeof t == "object" && "$$typeof" in t && t.$$typeof === Ix && "_payload" in t && Ax(t._payload);
}
function Ax(t) {
  return typeof t == "object" && t !== null && "then" in t;
}
var Ex = (t) => `${t} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, Rx = (t) => `${t} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, gr = Em[" use ".trim().toString()], Mx = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], Px = Mx.reduce((t, e) => {
  const n = /* @__PURE__ */ fd(`Primitive.${e}`), r = ie((i, o) => {
    const { asChild: s, ...a } = i, l = s ? n : e;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ f(l, { ...a, ref: o });
  });
  return r.displayName = `Primitive.${e}`, { ...t, [e]: r };
}, {});
const Nx = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
function Dx(t) {
  const e = ie((n, r) => {
    const i = R(17);
    let o, s, a, l;
    i[0] !== n ? ({ render: a, asChild: o, children: s, ...l } = n, i[0] = n, i[1] = o, i[2] = s, i[3] = a, i[4] = l) : (o = i[1], s = i[2], a = i[3], l = i[4]);
    const c = t;
    if (a && Rt(a)) {
      const h = s !== void 0 ? s : a.props.children, p = l;
      let m;
      i[5] !== a || i[6] !== h ? (m = Ht(a, void 0, h), i[5] = a, i[6] = h, i[7] = m) : m = i[7];
      let g;
      return i[8] !== r || i[9] !== p || i[10] !== m ? (g = /* @__PURE__ */ f(c, {
        ...p,
        asChild: !0,
        ref: r,
        children: m
      }), i[8] = r, i[9] = p, i[10] = m, i[11] = g) : g = i[11], g;
    }
    const d = l;
    let u;
    return i[12] !== o || i[13] !== s || i[14] !== r || i[15] !== d ? (u = /* @__PURE__ */ f(c, {
      ...d,
      asChild: o,
      ref: r,
      children: s
    }), i[12] = o, i[13] = s, i[14] = r, i[15] = d, i[16] = u) : u = i[16], u;
  });
  return e.displayName = typeof t == "string" ? t : t.displayName ?? t.name ?? "Component", e;
}
function Lx(t) {
  const e = Px[t], n = Dx(e);
  return n.displayName = `Primitive.${t}`, n;
}
const fe = Nx.reduce((t, e) => (t[e] = Lx(e), t), {}), zx = (t) => {
  const e = R(5), { hideWhenRunning: n, autohide: r, autohideFloat: i, forceVisible: o } = t;
  let s;
  return e[0] !== r || e[1] !== i || e[2] !== o || e[3] !== n ? (s = (a) => {
    if (n && a.thread.isRunning)
      return "hidden";
    const l = r === "always" || r === "not-last" && !a.message.isLast, c = o || a.message.isHovering;
    return l ? c ? i === "always" || i === "single-branch" && a.message.branchCount <= 1 ? "floating" : "normal" : "hidden" : "normal";
  }, e[0] = r, e[1] = i, e[2] = o, e[3] = n, e[4] = s) : s = e[4], $(s);
}, Ox = Ye(null), bd = ie((t, e) => {
  const n = R(18);
  let r, i, o, s;
  n[0] !== t ? ({ hideWhenRunning: o, autohide: r, autohideFloat: i, ...s } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o, n[4] = s) : (r = n[1], i = n[2], o = n[3], s = n[4]);
  const [a, l] = xe(0);
  let c;
  n[5] === Symbol.for("react.memo_cache_sentinel") ? (c = () => {
    let k = !1;
    return l($x), () => {
      k || (k = !0, l(Fx));
    };
  }, n[5] = c) : c = n[5];
  const d = c;
  let u;
  n[6] === Symbol.for("react.memo_cache_sentinel") ? (u = { acquireInteractionLock: d }, n[6] = u) : u = n[6];
  const h = u, p = a > 0;
  let m;
  n[7] !== r || n[8] !== i || n[9] !== o || n[10] !== p ? (m = {
    hideWhenRunning: o,
    autohide: r,
    autohideFloat: i,
    forceVisible: p
  }, n[7] = r, n[8] = i, n[9] = o, n[10] = p, n[11] = m) : m = n[11];
  const g = zx(m);
  if (g === "hidden")
    return null;
  let w;
  n[12] !== g ? (w = g === "floating" ? { "data-floating": "true" } : null, n[12] = g, n[13] = w) : w = n[13];
  let b;
  return n[14] !== e || n[15] !== s || n[16] !== w ? (b = /* @__PURE__ */ f(Ox.Provider, {
    value: h,
    children: /* @__PURE__ */ f(fe.div, {
      ...w,
      ...s,
      ref: e
    })
  }), n[14] = e, n[15] = s, n[16] = w, n[17] = b) : b = n[17], b;
});
bd.displayName = "ActionBarPrimitive.Root";
function $x(t) {
  return t + 1;
}
function Fx(t) {
  return Math.max(0, t - 1);
}
function _e(t, e, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(i) {
    if (t == null || t(i), n === !1 || !i || !i.defaultPrevented)
      return e == null ? void 0 : e(i);
  };
}
const Bx = (t) => {
  const e = R(4);
  let n;
  e[0] !== t ? (n = t === void 0 ? {} : t, e[0] = t, e[1] = n) : n = e[1];
  const { copiedDuration: r } = n, i = r === void 0 ? 3e3 : r;
  let o;
  e[2] !== i ? (o = {
    copiedDuration: i,
    copyToClipboard: Ux
  }, e[2] = i, e[3] = o) : o = e[3];
  const { copy: s, disabled: a } = My(o);
  return a ? null : s;
}, vd = ie((t, e) => {
  const n = R(20);
  let r, i, o, s;
  n[0] !== t ? ({ copiedDuration: r, onClick: o, disabled: i, ...s } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o, n[4] = s) : (r = n[1], i = n[2], o = n[3], s = n[4]);
  const a = $(jx);
  let l;
  n[5] !== r ? (l = { copiedDuration: r }, n[5] = r, n[6] = l) : l = n[6];
  const c = Bx(l);
  let d;
  n[7] !== a ? (d = a ? { "data-copied": "true" } : {}, n[7] = a, n[8] = d) : d = n[8];
  const u = i || !c;
  let h;
  n[9] !== c ? (h = () => {
    c == null || c();
  }, n[9] = c, n[10] = h) : h = n[10];
  let p;
  n[11] !== o || n[12] !== h ? (p = _e(o, h), n[11] = o, n[12] = h, n[13] = p) : p = n[13];
  let m;
  return n[14] !== e || n[15] !== s || n[16] !== d || n[17] !== u || n[18] !== p ? (m = /* @__PURE__ */ f(fe.button, {
    type: "button",
    ...d,
    ...s,
    ref: e,
    disabled: u,
    onClick: p
  }), n[14] = e, n[15] = s, n[16] = d, n[17] = u, n[18] = p, n[19] = m) : m = n[19], m;
});
vd.displayName = "ActionBarPrimitive.Copy";
function Ux(t) {
  return typeof navigator > "u" || !navigator.clipboard ? Promise.reject(/* @__PURE__ */ new Error("Clipboard API is unavailable")) : navigator.clipboard.writeText(t);
}
function jx(t) {
  return t.message.isCopied;
}
const at = (t, e, n = []) => {
  const r = ie((i, o) => {
    const s = R(6), a = {}, l = {};
    Object.keys(i).forEach((g) => {
      n.includes(g) ? a[g] = i[g] : l[g] = i[g];
    });
    const c = e(a) ?? void 0, d = fe, u = "button", h = l.disabled || !c, p = _e(l.onClick, c);
    let m;
    return s[0] !== o || s[1] !== l || s[2] !== d.button || s[3] !== h || s[4] !== p ? (m = /* @__PURE__ */ f(d.button, {
      ...l,
      type: u,
      ref: o,
      disabled: h,
      onClick: p
    }), s[0] = o, s[1] = l, s[2] = d.button, s[3] = h, s[4] = p, s[5] = m) : m = s[5], m;
  });
  return r.displayName = t, r;
}, Vx = () => {
  const { disabled: t, reload: e } = Uy();
  return t ? null : e;
}, qx = at("ActionBarPrimitive.Reload", Vx), Hx = () => {
  const { disabled: t, edit: e } = Fy();
  return t ? null : e;
}, Wx = at("ActionBarPrimitive.Edit", Hx), Gx = () => {
  const { disabled: t, speak: e } = Gy();
  return t ? null : e;
}, Kx = at("ActionBarPrimitive.Speak", Gx);
function Kt(t) {
  const e = Fe(t);
  return it(() => {
    e.current = t;
  }), Tt(() => (...n) => {
    var r;
    return (r = e.current) == null ? void 0 : r.call(e, ...n);
  }, []);
}
function wd(t, e = globalThis == null ? void 0 : globalThis.document) {
  const n = Kt(t);
  it(() => {
    const r = (i) => {
      i.key === "Escape" && n(i);
    };
    return e.addEventListener("keydown", r, { capture: !0 }), () => e.removeEventListener("keydown", r, { capture: !0 });
  }, [n, e]);
}
const Jx = () => {
  const { disabled: t, stopSpeaking: e } = Qy();
  return t ? null : e;
}, yd = ie((t, e) => {
  const n = R(12), r = Jx();
  let i;
  n[0] !== r ? (i = (c) => {
    r && (c.preventDefault(), r());
  }, n[0] = r, n[1] = i) : i = n[1], wd(i);
  const o = !r;
  let s;
  n[2] !== r ? (s = () => {
    r == null || r();
  }, n[2] = r, n[3] = s) : s = n[3];
  let a;
  n[4] !== t.onClick || n[5] !== s ? (a = _e(t.onClick, s), n[4] = t.onClick, n[5] = s, n[6] = a) : a = n[6];
  let l;
  return n[7] !== t || n[8] !== e || n[9] !== o || n[10] !== a ? (l = /* @__PURE__ */ f(fe.button, {
    type: "button",
    disabled: o,
    ...t,
    ref: e,
    onClick: a
  }), n[7] = t, n[8] = e, n[9] = o, n[10] = a, n[11] = l) : l = n[11], l;
});
yd.displayName = "ActionBarPrimitive.StopSpeaking";
const Qx = () => {
  const { submit: t } = Vy();
  return t;
}, xd = ie((t, e) => {
  const n = R(17);
  let r, i, o;
  n[0] !== t ? ({ onClick: i, disabled: r, ...o } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o) : (r = n[1], i = n[2], o = n[3]);
  const s = $(Yx), a = Qx();
  let l;
  n[4] !== s ? (l = s ? { "data-submitted": "true" } : {}, n[4] = s, n[5] = l) : l = n[5];
  const c = r || !a;
  let d;
  n[6] !== a ? (d = () => {
    a == null || a();
  }, n[6] = a, n[7] = d) : d = n[7];
  let u;
  n[8] !== i || n[9] !== d ? (u = _e(i, d), n[8] = i, n[9] = d, n[10] = u) : u = n[10];
  let h;
  return n[11] !== e || n[12] !== o || n[13] !== l || n[14] !== c || n[15] !== u ? (h = /* @__PURE__ */ f(fe.button, {
    type: "button",
    ...l,
    ...o,
    ref: e,
    disabled: c,
    onClick: u
  }), n[11] = e, n[12] = o, n[13] = l, n[14] = c, n[15] = u, n[16] = h) : h = n[16], h;
});
xd.displayName = "ActionBarPrimitive.FeedbackPositive";
function Yx(t) {
  var e;
  return ((e = t.message.metadata.submittedFeedback) == null ? void 0 : e.type) === "positive";
}
const Xx = () => {
  const { submit: t } = qy();
  return t;
}, kd = ie((t, e) => {
  const n = R(17);
  let r, i, o;
  n[0] !== t ? ({ onClick: i, disabled: r, ...o } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o) : (r = n[1], i = n[2], o = n[3]);
  const s = $(Zx), a = Xx();
  let l;
  n[4] !== s ? (l = s ? { "data-submitted": "true" } : {}, n[4] = s, n[5] = l) : l = n[5];
  const c = r || !a;
  let d;
  n[6] !== a ? (d = () => {
    a == null || a();
  }, n[6] = a, n[7] = d) : d = n[7];
  let u;
  n[8] !== i || n[9] !== d ? (u = _e(i, d), n[8] = i, n[9] = d, n[10] = u) : u = n[10];
  let h;
  return n[11] !== e || n[12] !== o || n[13] !== l || n[14] !== c || n[15] !== u ? (h = /* @__PURE__ */ f(fe.button, {
    type: "button",
    ...l,
    ...o,
    ref: e,
    disabled: c,
    onClick: u
  }), n[11] = e, n[12] = o, n[13] = l, n[14] = c, n[15] = u, n[16] = h) : h = n[16], h;
});
kd.displayName = "ActionBarPrimitive.FeedbackNegative";
function Zx(t) {
  var e;
  return ((e = t.message.metadata.submittedFeedback) == null ? void 0 : e.type) === "negative";
}
const e0 = (t) => {
  const e = R(6);
  let n;
  e[0] !== t ? (n = t === void 0 ? {} : t, e[0] = t, e[1] = n) : n = e[1];
  const { filename: r, onExport: i } = n, o = Z(), s = $(n0);
  let a;
  e[2] !== o || e[3] !== r || e[4] !== i ? (a = async () => {
    const c = o.message().getCopyText();
    if (!c)
      return;
    if (i) {
      await i(c);
      return;
    }
    const d = new Blob([c], { type: "text/markdown" }), u = URL.createObjectURL(d), h = document.createElement("a");
    h.href = u, h.download = r ?? `message-${Date.now()}.md`, h.click(), URL.revokeObjectURL(u);
  }, e[2] = o, e[3] = r, e[4] = i, e[5] = a) : a = e[5];
  const l = a;
  return s ? l : null;
}, _d = ie((t, e) => {
  const n = R(19);
  let r, i, o, s, a;
  n[0] !== t ? ({ filename: i, onExport: s, onClick: o, disabled: r, ...a } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o, n[4] = s, n[5] = a) : (r = n[1], i = n[2], o = n[3], s = n[4], a = n[5]);
  let l;
  n[6] !== i || n[7] !== s ? (l = {
    filename: i,
    onExport: s
  }, n[6] = i, n[7] = s, n[8] = l) : l = n[8];
  const c = e0(l), d = r || !c;
  let u;
  n[9] !== c ? (u = () => {
    c == null || c();
  }, n[9] = c, n[10] = u) : u = n[10];
  let h;
  n[11] !== o || n[12] !== u ? (h = _e(o, u), n[11] = o, n[12] = u, n[13] = h) : h = n[13];
  let p;
  return n[14] !== e || n[15] !== a || n[16] !== d || n[17] !== h ? (p = /* @__PURE__ */ f(fe.button, {
    type: "button",
    ...a,
    ref: e,
    disabled: d,
    onClick: h
  }), n[14] = e, n[15] = a, n[16] = d, n[17] = h, n[18] = p) : p = n[18], p;
});
_d.displayName = "ActionBarPrimitive.ExportMarkdown";
function t0(t) {
  return t.type === "text" && t.text.length > 0;
}
function n0(t) {
  var e;
  return (t.message.role !== "assistant" || ((e = t.message.status) == null ? void 0 : e.type) !== "running") && t.message.parts.some(t0);
}
var Da = /* @__PURE__ */ tn({
  Copy: () => vd,
  Edit: () => Wx,
  ExportMarkdown: () => _d,
  FeedbackNegative: () => kd,
  FeedbackPositive: () => xd,
  Reload: () => qx,
  Root: () => bd,
  Speak: () => Kx,
  StopSpeaking: () => yd
});
const Sd = ie((t, e) => {
  const n = R(3);
  let r;
  return n[0] !== t || n[1] !== e ? (r = /* @__PURE__ */ f(fe.div, {
    ...t,
    ref: e
  }), n[0] = t, n[1] = e, n[2] = r) : r = n[2], r;
});
Sd.displayName = "AttachmentPrimitive.Root";
const Cd = ie((t, e) => {
  const n = R(4), r = $(r0);
  let i;
  return n[0] !== r || n[1] !== t || n[2] !== e ? (i = /* @__PURE__ */ j(fe.div, {
    ...t,
    ref: e,
    children: [".", r]
  }), n[0] = r, n[1] = t, n[2] = e, n[3] = i) : i = n[3], i;
});
Cd.displayName = "AttachmentPrimitive.unstable_Thumb";
function r0(t) {
  const e = t.attachment.name.split(".");
  return e.length > 1 ? e.pop() : "";
}
const Td = () => {
  const t = R(2), e = $(i0);
  let n;
  return t[0] !== e ? (n = /* @__PURE__ */ f(Ke, { children: e }), t[0] = e, t[1] = n) : n = t[1], n;
};
Td.displayName = "AttachmentPrimitive.Name";
function i0(t) {
  return t.attachment.name;
}
const o0 = () => {
  const t = R(2), e = Z();
  let n;
  return t[0] !== e ? (n = () => {
    e.attachment().remove();
  }, t[0] = e, t[1] = n) : n = t[1], n;
}, s0 = at("AttachmentPrimitive.Remove", o0);
var no = /* @__PURE__ */ tn({
  Name: () => Td,
  Remove: () => s0,
  Root: () => Sd,
  unstable_Thumb: () => Cd
});
const a0 = (t) => {
  const e = R(12);
  let n;
  return e[0] !== t.assistant || e[1] !== t.copied || e[2] !== t.hasAttachments || e[3] !== t.hasBranches || e[4] !== t.hasContent || e[5] !== t.last || e[6] !== t.lastOrHover || e[7] !== t.speaking || e[8] !== t.submittedFeedback || e[9] !== t.system || e[10] !== t.user ? (n = (r) => {
    var h;
    const { role: i, attachments: o, parts: s, branchCount: a, isLast: l, speech: c, isCopied: d, isHovering: u } = r.message;
    return !(t.hasBranches === !0 && a < 2 || t.user && i !== "user" || t.assistant && i !== "assistant" || t.system && i !== "system" || t.lastOrHover === !0 && !u && !l || t.last !== void 0 && t.last !== l || t.copied === !0 && !d || t.copied === !1 && d || t.speaking === !0 && c == null || t.speaking === !1 && c != null || t.hasAttachments === !0 && (i !== "user" || !(o != null && o.length)) || t.hasAttachments === !1 && i === "user" && (o != null && o.length) || t.hasContent === !0 && s.length === 0 || t.hasContent === !1 && s.length > 0 || t.submittedFeedback !== void 0 && (((h = r.message.metadata.submittedFeedback) == null ? void 0 : h.type) ?? null) !== t.submittedFeedback);
  }, e[0] = t.assistant, e[1] = t.copied, e[2] = t.hasAttachments, e[3] = t.hasBranches, e[4] = t.hasContent, e[5] = t.last, e[6] = t.lastOrHover, e[7] = t.speaking, e[8] = t.submittedFeedback, e[9] = t.system, e[10] = t.user, e[11] = n) : n = e[11], $(n);
}, Id = (t) => {
  const e = R(3);
  let n, r;
  return e[0] !== t ? ({ children: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]), a0(r) ? n : null;
};
Id.displayName = "MessagePrimitive.If";
const Ad = Ye(null), ri = () => Xe(Ad), l0 = (t) => {
  const e = R(8), { children: n } = t;
  let r;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (r = /* @__PURE__ */ new Map(), e[0] = r) : r = e[0];
  const i = ne(r);
  let o;
  e[1] === Symbol.for("react.memo_cache_sentinel") ? (o = [], e[1] = o) : o = e[1];
  const s = ne(o);
  let a;
  e[2] === Symbol.for("react.memo_cache_sentinel") ? (a = () => {
    const w = Array.from(i.current.entries());
    w.sort(c0), s.current = w.map(u0);
  }, e[2] = a) : a = e[2];
  const l = a;
  let c;
  e[3] === Symbol.for("react.memo_cache_sentinel") ? (c = (w, b) => {
    const k = (b == null ? void 0 : b.priority) ?? 0;
    return i.current.set(w, k), l(), () => {
      i.current.delete(w), l();
    };
  }, e[3] = c) : c = e[3];
  const d = c;
  let u;
  e[4] === Symbol.for("react.memo_cache_sentinel") ? (u = () => s.current, e[4] = u) : u = e[4];
  const h = u;
  let p;
  e[5] === Symbol.for("react.memo_cache_sentinel") ? (p = {
    register: d,
    getPlugins: h
  }, e[5] = p) : p = e[5];
  const m = p;
  let g;
  return e[6] !== n ? (g = /* @__PURE__ */ f(Ad.Provider, {
    value: m,
    children: n
  }), e[6] = n, e[7] = g) : g = e[7], g;
};
function c0(t, e) {
  return e[1] - t[1];
}
function u0(t) {
  const [e] = t;
  return e;
}
const Go = Ye(null), Ed = Ye(null), Ko = () => {
  const t = Xe(Go);
  if (!t)
    throw new Error("useTriggerPopoverRootContext must be used within ComposerPrimitive.TriggerPopoverRoot");
  return t;
}, Jo = () => Xe(Go), d0 = () => {
  const t = Xe(Ed);
  if (!t)
    throw new Error("useTriggerPopoverAriaPublish must be used within ComposerPrimitive.TriggerPopoverRoot");
  return t;
}, h0 = () => {
  const t = Ko();
  return _n(t.subscribe, t.getTriggers, t.getTriggers);
}, p0 = /* @__PURE__ */ new Map(), Rd = () => () => {
}, La = () => p0, m0 = () => {
  const t = Jo();
  return _n(t ? t.subscribe : Rd, t ? t.getTriggers : La, t ? t.getTriggers : La);
}, za = () => null, f0 = () => {
  const t = Jo();
  return _n(t ? t.subscribeAria : Rd, t ? t.getActiveAria : za, t ? t.getActiveAria : za);
};
function Oa() {
  const t = R(4);
  let e;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (e = /* @__PURE__ */ new Set(), t[0] = e) : e = t[0];
  const n = ne(e);
  let r;
  t[1] === Symbol.for("react.memo_cache_sentinel") ? (r = () => {
    for (const l of n.current)
      l();
  }, t[1] = r) : r = t[1];
  const i = r;
  let o;
  t[2] === Symbol.for("react.memo_cache_sentinel") ? (o = (l) => (n.current.add(l), () => {
    n.current.delete(l);
  }), t[2] = o) : o = t[2];
  const s = o;
  let a;
  return t[3] === Symbol.for("react.memo_cache_sentinel") ? (a = {
    notify: i,
    subscribe: s
  }, t[3] = a) : a = t[3], a;
}
const $a = (t) => {
  const e = R(21), { children: n } = t;
  let r;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (r = /* @__PURE__ */ new Map(), e[0] = r) : r = e[0];
  const i = ne(r);
  let o;
  e[1] === Symbol.for("react.memo_cache_sentinel") ? (o = /* @__PURE__ */ new Set(), e[1] = o) : o = e[1];
  const s = ne(o), { notify: a, subscribe: l } = Oa();
  let c;
  e[2] !== a ? (c = (D) => {
    const { char: O } = D;
    if (i.current.has(O))
      return {}.NODE_ENV !== "production" && console.warn(`[assistant-ui] Duplicate TriggerPopover for char "${O}". Ignoring the second registration.`), g0;
    if ({}.NODE_ENV !== "production")
      for (const V of i.current.values())
        (O.startsWith(V.char) || V.char.startsWith(O)) && console.warn(`[assistant-ui] Trigger prefix collision between "${V.char}" and "${O}". One char is a prefix of the other; only one will match reliably.`);
    const z = new Map(i.current);
    z.set(O, D), i.current = z, a();
    for (const V of s.current)
      V.added(D);
    return () => {
      const V = new Map(i.current);
      V.delete(O), i.current = V, a();
      for (const G of s.current)
        G.removed(O);
    };
  }, e[2] = a, e[3] = c) : c = e[3];
  const d = c;
  let u;
  e[4] === Symbol.for("react.memo_cache_sentinel") ? (u = () => i.current, e[4] = u) : u = e[4];
  const h = u;
  let p;
  e[5] === Symbol.for("react.memo_cache_sentinel") ? (p = (D) => (s.current.add(D), () => {
    s.current.delete(D);
  }), e[5] = p) : p = e[5];
  const m = p, g = ne(null), w = ne(null), { notify: b, subscribe: k } = Oa();
  let x;
  e[6] !== b ? (x = (D, O) => {
    if (O === null) {
      if (w.current !== D)
        return;
      g.current = null, w.current = null, b();
      return;
    }
    const z = g.current;
    w.current === D && z !== null && z.popoverId === O.popoverId && z.highlightedItemId === O.highlightedItemId || (g.current = O, w.current = D, b());
  }, e[6] = b, e[7] = x) : x = e[7];
  const T = x;
  let I;
  e[8] === Symbol.for("react.memo_cache_sentinel") ? (I = () => g.current, e[8] = I) : I = e[8];
  const y = I;
  let M;
  e[9] !== d || e[10] !== l || e[11] !== k ? (M = {
    register: d,
    getTriggers: h,
    subscribe: l,
    subscribeLifecycle: m,
    getActiveAria: y,
    subscribeAria: k
  }, e[9] = d, e[10] = l, e[11] = k, e[12] = M) : M = e[12];
  const E = M;
  let N;
  e[13] !== T ? (N = { setActiveAria: T }, e[13] = T, e[14] = N) : N = e[14];
  const _ = N;
  let A;
  e[15] !== _ || e[16] !== n ? (A = /* @__PURE__ */ f(Ed.Provider, {
    value: _,
    children: n
  }), e[15] = _, e[16] = n, e[17] = A) : A = e[17];
  let P;
  return e[18] !== A || e[19] !== E ? (P = /* @__PURE__ */ f(Go.Provider, {
    value: E,
    children: A
  }), e[18] = A, e[19] = E, e[20] = P) : P = e[20], P;
}, Md = (t) => {
  const e = R(4), { children: n } = t;
  if (ri()) {
    let i;
    return e[0] !== n ? (i = /* @__PURE__ */ f($a, { children: n }), e[0] = n, e[1] = i) : i = e[1], i;
  }
  let r;
  return e[2] !== n ? (r = /* @__PURE__ */ f(l0, { children: /* @__PURE__ */ f($a, { children: n }) }), e[2] = n, e[3] = r) : r = e[3], r;
};
Md.displayName = "ComposerPrimitive.TriggerPopoverRoot";
function g0() {
}
const Fa = /\s/u;
function b0(t, e, n) {
  const r = t.slice(0, n);
  for (let i = r.length - 1; i >= 0; i--) {
    const o = r[i];
    if (Fa.test(o))
      return null;
    if (r.startsWith(e, i)) {
      if (i > 0 && !Fa.test(r[i - 1]))
        continue;
      return {
        query: r.slice(i + e.length),
        offset: i
      };
    }
  }
  return null;
}
const v0 = (t) => {
  const e = R(7), { text: n, triggerChar: r } = t, [i, o] = xe(n.length), s = Math.min(i, n.length);
  let a;
  e[0] !== s || e[1] !== n || e[2] !== r ? (a = b0(n, r, s), e[0] = s, e[1] = n, e[2] = r, e[3] = a) : a = e[3];
  const l = a, c = (l == null ? void 0 : l.query) ?? "";
  let d;
  return e[4] !== c || e[5] !== l ? (d = {
    trigger: l,
    query: c,
    setCursorPosition: o
  }, e[4] = c, e[5] = l, e[6] = d) : d = e[6], d;
}, w0 = ue(v0);
function y0(t) {
  return "type" in t;
}
const x0 = (t) => {
  const e = R(25), { navigableList: n, isSearchMode: r, activeCategoryId: i, query: o, popoverId: s, open: a, selectItem: l, selectCategory: c, goBack: d, close: u } = t, [h, p] = xe(0);
  let m;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (m = () => {
    p(0);
  }, e[0] = m) : m = e[0];
  let g;
  e[1] !== n ? (g = [n], e[1] = n, e[2] = g) : g = e[2], Y(m, g);
  let w;
  e[3] === Symbol.for("react.memo_cache_sentinel") ? (w = () => {
    p(0);
  }, e[3] = w) : w = e[3];
  let b;
  e[4] !== i || e[5] !== r ? (b = [r, i], e[4] = i, e[5] = r, e[6] = b) : b = e[6], Y(w, b);
  let k;
  e[7] !== h || e[8] !== n.length ? (k = (N) => {
    N < 0 || N >= n.length || N !== h && p(N);
  }, e[7] = h, e[8] = n.length, e[9] = k) : k = e[9];
  const x = qe(k);
  let T;
  e[10] !== i || e[11] !== u || e[12] !== d || e[13] !== h || e[14] !== n || e[15] !== a || e[16] !== o || e[17] !== c || e[18] !== l ? (T = (N) => {
    if (!a)
      return !1;
    switch (N.key) {
      case "ArrowDown":
        return N.preventDefault(), p((_) => {
          const A = n.length;
          return A === 0 ? 0 : _ < A - 1 ? _ + 1 : 0;
        }), !0;
      case "ArrowUp":
        return N.preventDefault(), p((_) => {
          const A = n.length;
          return A === 0 ? 0 : _ > 0 ? _ - 1 : A - 1;
        }), !0;
      case "Enter":
      case "Tab": {
        if (N.shiftKey)
          return !1;
        N.preventDefault();
        const _ = n[h];
        return _ && (y0(_) ? l(_) : c(_.id)), !0;
      }
      case "Escape":
        return N.preventDefault(), u(), !0;
      case "Backspace":
        return i && o === "" ? (N.preventDefault(), d(), !0) : !1;
      default:
        return !1;
    }
  }, e[10] = i, e[11] = u, e[12] = d, e[13] = h, e[14] = n, e[15] = a, e[16] = o, e[17] = c, e[18] = l, e[19] = T) : T = e[19];
  const I = qe(T), y = n[h], M = a && y ? `${s}-option-${y.id}` : void 0;
  let E;
  return e[20] !== I || e[21] !== x || e[22] !== h || e[23] !== M ? (E = {
    highlightedIndex: h,
    highlightedItemId: M,
    highlightIndex: x,
    handleKeyDown: I
  }, e[20] = I, e[21] = x, e[22] = h, e[23] = M, e[24] = E) : E = e[24], E;
}, k0 = ue(x0);
function Ba(t, e) {
  var n;
  return t.id.toLowerCase().includes(e) || t.label.toLowerCase().includes(e) || (((n = t.description) == null ? void 0 : n.toLowerCase().includes(e)) ?? !1);
}
const _0 = (t) => {
  const e = R(38), { adapter: n, query: r, open: i } = t, [o, s] = xe(null);
  let a, l;
  e[0] !== i ? (a = () => {
    i || s(null);
  }, l = [i], e[0] = i, e[1] = a, e[2] = l) : (a = e[1], l = e[2]), Y(a, l);
  let c;
  e: {
    if (!i || !n) {
      let D;
      e[3] === Symbol.for("react.memo_cache_sentinel") ? (D = [], e[3] = D) : D = e[3], c = D;
      break e;
    }
    let P;
    e[4] !== n ? (P = n.categories(), e[4] = n, e[5] = P) : P = e[5], c = P;
  }
  const d = c, u = i ? o : null;
  let h;
  e: {
    if (!u || !n) {
      let D;
      e[6] === Symbol.for("react.memo_cache_sentinel") ? (D = [], e[6] = D) : D = e[6], h = D;
      break e;
    }
    let P;
    e[7] !== n || e[8] !== u ? (P = n.categoryItems(u), e[7] = n, e[8] = u, e[9] = P) : P = e[9], h = P;
  }
  const p = h;
  let m;
  e: {
    if (!i || !n || u) {
      m = null;
      break e;
    }
    if (!r && d.length > 0) {
      m = null;
      break e;
    }
    if (n.search) {
      let D;
      e[10] !== n || e[11] !== r ? (D = n.search(r), e[10] = n, e[11] = r, e[12] = D) : D = e[12], m = D;
      break e;
    }
    let P;
    if (e[13] !== n || e[14] !== d || e[15] !== r) {
      P = [];
      const D = r.toLowerCase();
      for (const O of d)
        for (const z of n.categoryItems(O.id))
          Ba(z, D) && P.push(z);
      e[13] = n, e[14] = d, e[15] = r, e[16] = P;
    } else
      P = e[16];
    m = P;
  }
  const g = m, w = g !== null;
  let b;
  e: {
    if (w) {
      let D;
      e[17] === Symbol.for("react.memo_cache_sentinel") ? (D = [], e[17] = D) : D = e[17], b = D;
      break e;
    }
    if (!r) {
      b = d;
      break e;
    }
    let P;
    if (e[18] !== d || e[19] !== r) {
      const D = r.toLowerCase();
      P = d.filter((O) => O.label.toLowerCase().includes(D)), e[18] = d, e[19] = r, e[20] = P;
    } else
      P = e[20];
    b = P;
  }
  const k = b;
  let x;
  e: {
    if (w) {
      let D;
      e[21] !== g ? (D = g ?? [], e[21] = g, e[22] = D) : D = e[22], x = D;
      break e;
    }
    if (!r) {
      x = p;
      break e;
    }
    let P;
    if (e[23] !== p || e[24] !== r) {
      const D = r.toLowerCase();
      P = p.filter((O) => Ba(O, D)), e[23] = p, e[24] = r, e[25] = P;
    } else
      P = e[25];
    x = P;
  }
  const T = x;
  let I;
  e: {
    if (w) {
      let P;
      e[26] !== g ? (P = g ?? [], e[26] = g, e[27] = P) : P = e[27], I = P;
      break e;
    }
    if (u) {
      I = T;
      break e;
    }
    I = k;
  }
  const y = I;
  let M;
  e[28] === Symbol.for("react.memo_cache_sentinel") ? (M = (P) => {
    s(P);
  }, e[28] = M) : M = e[28];
  const E = qe(M);
  let N;
  e[29] === Symbol.for("react.memo_cache_sentinel") ? (N = () => {
    s(null);
  }, e[29] = N) : N = e[29];
  const _ = qe(N);
  let A;
  return e[30] !== u || e[31] !== k || e[32] !== T || e[33] !== _ || e[34] !== w || e[35] !== y || e[36] !== E ? (A = {
    categories: k,
    items: T,
    isSearchMode: w,
    activeCategoryId: u,
    navigableList: y,
    selectCategory: E,
    goBack: _
  }, e[30] = u, e[31] = k, e[32] = T, e[33] = _, e[34] = w, e[35] = y, e[36] = E, e[37] = A) : A = e[37], A;
}, S0 = ue(_0), C0 = (t) => {
  const e = R(15), { behavior: n, trigger: r, aui: i, triggerChar: o, setCursorPosition: s, onSelected: a } = t, l = ne(null);
  let c;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (c = (w) => (l.current = w, () => {
    l.current === w && (l.current = null);
  }), e[0] = c) : c = e[0];
  const d = qe(c);
  let u;
  e[1] !== i || e[2] !== n || e[3] !== a || e[4] !== r || e[5] !== o ? (u = (w) => {
    var I, y;
    if (!r || !n)
      return;
    if ((I = l.current) != null && I.call(l, w)) {
      a();
      return;
    }
    const b = i.composer().getState().text, k = b.slice(0, r.offset), x = b.slice(r.offset + o.length + r.query.length), T = () => {
      const M = n.formatter.serialize(w);
      i.composer().setText(k + M + (x.startsWith(" ") ? x : ` ${x}`));
    };
    n.kind === "directive" ? (T(), (y = n.onInserted) == null || y.call(n, w)) : (n.removeOnExecute ? i.composer().setText(k + (x.startsWith(" ") ? x.slice(1) : x)) : T(), n.onExecute(w)), a();
  }, e[1] = i, e[2] = n, e[3] = a, e[4] = r, e[5] = o, e[6] = u) : u = e[6];
  const h = qe(u);
  let p;
  e[7] !== a || e[8] !== s || e[9] !== r ? (p = () => {
    a(), r && s(r.offset);
  }, e[7] = a, e[8] = s, e[9] = r, e[10] = p) : p = e[10];
  const m = qe(p);
  let g;
  return e[11] !== m || e[12] !== d || e[13] !== h ? (g = {
    selectItem: h,
    close: m,
    registerSelectItemOverride: d
  }, e[11] = m, e[12] = d, e[13] = h, e[14] = g) : g = e[14], g;
}, T0 = ue(C0), I0 = (t) => {
  const e = R(46), { adapter: n, text: r, triggerChar: i, behavior: o, aui: s, popoverId: a, isLoading: l } = t;
  let c;
  e[0] !== r || e[1] !== i ? (c = w0({
    text: r,
    triggerChar: i
  }), e[0] = r, e[1] = i, e[2] = c) : c = e[2];
  const d = Le(c), u = d.trigger !== null && n !== void 0 && o !== void 0;
  let h;
  e[3] !== n || e[4] !== d.query || e[5] !== u ? (h = S0({
    adapter: n,
    query: d.query,
    open: u
  }), e[3] = n, e[4] = d.query, e[5] = u, e[6] = h) : h = e[6];
  const p = Le(h);
  let m;
  e[7] !== p ? (m = () => {
    p.goBack();
  }, e[7] = p, e[8] = m) : m = e[8];
  const g = qe(m);
  let w;
  e[9] !== s || e[10] !== o || e[11] !== d.setCursorPosition || e[12] !== d.trigger || e[13] !== g || e[14] !== i ? (w = T0({
    behavior: o,
    trigger: d.trigger,
    aui: s,
    triggerChar: i,
    setCursorPosition: d.setCursorPosition,
    onSelected: g
  }), e[9] = s, e[10] = o, e[11] = d.setCursorPosition, e[12] = d.trigger, e[13] = g, e[14] = i, e[15] = w) : w = e[15];
  const b = Le(w);
  let k;
  e[16] !== d.query || e[17] !== p.activeCategoryId || e[18] !== p.goBack || e[19] !== p.isSearchMode || e[20] !== p.navigableList || e[21] !== p.selectCategory || e[22] !== u || e[23] !== a || e[24] !== b.close || e[25] !== b.selectItem ? (k = k0({
    navigableList: p.navigableList,
    isSearchMode: p.isSearchMode,
    activeCategoryId: p.activeCategoryId,
    query: d.query,
    popoverId: a,
    open: u,
    selectItem: b.selectItem,
    selectCategory: p.selectCategory,
    goBack: p.goBack,
    close: b.close
  }), e[16] = d.query, e[17] = p.activeCategoryId, e[18] = p.goBack, e[19] = p.isSearchMode, e[20] = p.navigableList, e[21] = p.selectCategory, e[22] = u, e[23] = a, e[24] = b.close, e[25] = b.selectItem, e[26] = k) : k = e[26];
  const x = Le(k);
  let T;
  return e[27] !== d.query || e[28] !== d.setCursorPosition || e[29] !== l || e[30] !== x.handleKeyDown || e[31] !== x.highlightIndex || e[32] !== x.highlightedIndex || e[33] !== x.highlightedItemId || e[34] !== p.activeCategoryId || e[35] !== p.categories || e[36] !== p.goBack || e[37] !== p.isSearchMode || e[38] !== p.items || e[39] !== p.selectCategory || e[40] !== u || e[41] !== a || e[42] !== b.close || e[43] !== b.registerSelectItemOverride || e[44] !== b.selectItem ? (T = {
    open: u,
    query: d.query,
    activeCategoryId: p.activeCategoryId,
    categories: p.categories,
    items: p.items,
    highlightedIndex: x.highlightedIndex,
    isSearchMode: p.isSearchMode,
    isLoading: l,
    popoverId: a,
    highlightedItemId: x.highlightedItemId,
    selectCategory: p.selectCategory,
    goBack: p.goBack,
    selectItem: b.selectItem,
    close: b.close,
    highlightIndex: x.highlightIndex,
    handleKeyDown: x.handleKeyDown,
    setCursorPosition: d.setCursorPosition,
    registerSelectItemOverride: b.registerSelectItemOverride
  }, e[27] = d.query, e[28] = d.setCursorPosition, e[29] = l, e[30] = x.handleKeyDown, e[31] = x.highlightIndex, e[32] = x.highlightedIndex, e[33] = x.highlightedItemId, e[34] = p.activeCategoryId, e[35] = p.categories, e[36] = p.goBack, e[37] = p.isSearchMode, e[38] = p.items, e[39] = p.selectCategory, e[40] = u, e[41] = a, e[42] = b.close, e[43] = b.registerSelectItemOverride, e[44] = b.selectItem, e[45] = T) : T = e[45], T;
}, A0 = ue(I0), Qo = Ye(null), Tn = () => {
  const t = Xe(Qo);
  if (!t)
    throw new Error("useTriggerPopoverScopeContext must be used within ComposerPrimitive.TriggerPopover");
  return t;
}, E0 = () => Xe(Qo), Pd = Ye(null), Nd = () => {
  const t = Xe(Pd);
  if (!t)
    throw new Error("TriggerPopover.Directive / TriggerPopover.Action must be rendered inside ComposerPrimitive.TriggerPopover");
  return t;
}, Dd = ie((t, e) => {
  const n = R(61);
  let r, i, o, s, a, l;
  n[0] !== t ? ({ char: o, adapter: r, isLoading: l, "aria-label": i, children: s, ...a } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o, n[4] = s, n[5] = a, n[6] = l) : (r = n[1], i = n[2], o = n[3], s = n[4], a = n[5], l = n[6]);
  const c = l === void 0 ? !1 : l, d = Z(), u = $(R0), h = xo(), p = ne(null), [m, g] = xe(null), w = ne(0);
  let b;
  n[7] !== o ? (b = (he) => (w.current = w.current + 1, {}.NODE_ENV !== "production" && w.current > 1 && console.warn(`[assistant-ui] TriggerPopover "${o}" received more than one behavior child. Exactly one <TriggerPopover.Directive> or <TriggerPopover.Action> is allowed per TriggerPopover; the last registration wins.`), p.current = he, g(he), () => {
    w.current = Math.max(0, w.current - 1), p.current === he && (p.current = null, g(null));
  }), n[7] = o, n[8] = b) : b = n[8];
  const k = b;
  let x;
  n[9] !== k ? (x = { register: k }, n[9] = k, n[10] = x) : x = n[10];
  const T = x, I = m ?? void 0;
  let y;
  n[11] !== r || n[12] !== d || n[13] !== o || n[14] !== c || n[15] !== h || n[16] !== I || n[17] !== u ? (y = A0({
    adapter: r,
    text: u,
    triggerChar: o,
    behavior: I,
    aui: d,
    popoverId: h,
    isLoading: c
  }), n[11] = r, n[12] = d, n[13] = o, n[14] = c, n[15] = h, n[16] = I, n[17] = u, n[18] = y) : y = n[18];
  const M = Le(y);
  let E;
  n[19] !== M ? (E = () => M, n[19] = M, n[20] = E) : E = n[20];
  const N = qe(E), _ = Ko();
  let A;
  n[21] !== m || n[22] !== o || n[23] !== N || n[24] !== _ ? (A = () => _.register({
    char: o,
    ...m ? { behavior: m } : {},
    resource: N()
  }), n[21] = m, n[22] = o, n[23] = N, n[24] = _, n[25] = A) : A = n[25];
  let P;
  n[26] !== m || n[27] !== o || n[28] !== _ ? (P = [
    _,
    o,
    m
  ], n[26] = m, n[27] = o, n[28] = _, n[29] = P) : P = n[29], Y(A, P);
  const D = ri();
  let O;
  n[30] !== N || n[31] !== D ? (O = () => {
    if (D)
      return D.register(N());
  }, n[30] = N, n[31] = D, n[32] = O) : O = n[32];
  let z;
  n[33] !== D ? (z = [D], n[33] = D, n[34] = z) : z = n[34], Y(O, z);
  const V = m !== null && M.open, G = d0();
  let F, B;
  n[35] !== G || n[36] !== o || n[37] !== V ? (F = () => {
    if (V)
      return () => {
        G.setActiveAria(o, null);
      };
  }, B = [
    G,
    o,
    V
  ], n[35] = G, n[36] = o, n[37] = V, n[38] = F, n[39] = B) : (F = n[38], B = n[39]), Y(F, B);
  let v, Q;
  n[40] !== G || n[41] !== o || n[42] !== V || n[43] !== h || n[44] !== M.highlightedItemId ? (v = () => {
    V && G.setActiveAria(o, {
      popoverId: h,
      highlightedItemId: M.highlightedItemId
    });
  }, Q = [
    G,
    o,
    h,
    V,
    M.highlightedItemId
  ], n[40] = G, n[41] = o, n[42] = V, n[43] = h, n[44] = M.highlightedItemId, n[45] = v, n[46] = Q) : (v = n[45], Q = n[46]), Y(v, Q);
  let ee;
  n[47] !== i || n[48] !== s || n[49] !== e || n[50] !== V || n[51] !== h || n[52] !== a || n[53] !== M.highlightedItemId ? (ee = V ? /* @__PURE__ */ f(fe.div, {
    role: "listbox",
    id: h,
    "aria-label": i ?? "Suggestions",
    "aria-activedescendant": M.highlightedItemId,
    "data-state": "open",
    ...a,
    ref: e,
    children: s
  }) : s, n[47] = i, n[48] = s, n[49] = e, n[50] = V, n[51] = h, n[52] = a, n[53] = M.highlightedItemId, n[54] = ee) : ee = n[54];
  let S;
  n[55] !== M || n[56] !== ee ? (S = /* @__PURE__ */ f(Qo.Provider, {
    value: M,
    children: ee
  }), n[55] = M, n[56] = ee, n[57] = S) : S = n[57];
  let pe;
  return n[58] !== T || n[59] !== S ? (pe = /* @__PURE__ */ f(Pd.Provider, {
    value: T,
    children: S
  }), n[58] = T, n[59] = S, n[60] = pe) : pe = n[60], pe;
});
Dd.displayName = "ComposerPrimitive.TriggerPopover";
function R0(t) {
  return t.composer.text;
}
const Ld = () => {
  const t = R(2), { disabled: e, send: n } = _y();
  let r;
  t[0] !== n ? (r = () => n(), t[0] = n, t[1] = r) : r = t[1];
  const i = r;
  return e ? null : i;
}, M0 = at("ComposerPrimitive.Send", Ld), zd = ie((t, e) => {
  const n = R(12);
  let r, i;
  n[0] !== t ? ({ onSubmit: r, ...i } = t, n[0] = t, n[1] = r, n[2] = i) : (r = n[1], i = n[2]);
  const o = Ld();
  let s;
  n[3] !== o ? (s = (d) => {
    d.preventDefault(), o && o();
  }, n[3] = o, n[4] = s) : s = n[4];
  const a = s;
  let l;
  n[5] !== a || n[6] !== r ? (l = _e(r, a), n[5] = a, n[6] = r, n[7] = l) : l = n[7];
  let c;
  return n[8] !== e || n[9] !== i || n[10] !== l ? (c = /* @__PURE__ */ f(fe.form, {
    ...i,
    ref: e,
    onSubmit: l
  }), n[8] = e, n[9] = i, n[10] = l, n[11] = c) : c = n[11], c;
});
zd.displayName = "ComposerPrimitive.Root";
const Od = (t) => {
  const e = R(4), n = Kt(t), r = Xt(P0);
  let i, o;
  e[0] !== n || e[1] !== r ? (i = () => r(n), o = [r, n], e[0] = n, e[1] = r, e[2] = i, e[3] = o) : (i = e[2], o = e[3]), Y(i, o);
};
function P0(t) {
  return t.onScrollToBottom;
}
const N0 = () => !1, D0 = () => {
}, $d = (t) => {
  const e = R(4);
  let n;
  e[0] !== t ? (n = (o) => {
    if (typeof window > "u" || t === null || !window.matchMedia)
      return D0;
    const s = window.matchMedia(t);
    return s.addEventListener("change", o), () => s.removeEventListener("change", o);
  }, e[0] = t, e[1] = n) : n = e[1];
  const r = n;
  let i;
  return e[2] !== t ? (i = () => typeof window > "u" || t === null || !window.matchMedia ? !1 : window.matchMedia(t).matches, e[2] = t, e[3] = i) : i = e[3], _n(r, i, N0);
};
function L0() {
  return $(z0);
}
function z0(t) {
  return t.composer.isEditing ? t.composer.text : "";
}
function O0(t) {
  return !!$($0) || !!t;
}
function $0(t) {
  var e;
  return t.thread.isDisabled || ((e = t.composer.dictation) == null ? void 0 : e.inputDisabled);
}
function F0() {
  const t = R(4), e = f0();
  if (!e) {
    let r;
    return t[0] === Symbol.for("react.memo_cache_sentinel") ? (r = {}, t[0] = r) : r = t[0], r;
  }
  let n;
  return t[1] !== e.highlightedItemId || t[2] !== e.popoverId ? (n = {
    "aria-controls": e.popoverId,
    "aria-expanded": !0,
    "aria-haspopup": "listbox",
    "aria-activedescendant": e.highlightedItemId
  }, t[1] = e.highlightedItemId, t[2] = e.popoverId, t[3] = n) : n = t[3], n;
}
function ro() {
  return ro = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var r in n)
        ({}).hasOwnProperty.call(n, r) && (t[r] = n[r]);
    }
    return t;
  }, ro.apply(null, arguments);
}
function B0(t, e) {
  if (t == null)
    return {};
  var n = {};
  for (var r in t)
    if ({}.hasOwnProperty.call(t, r)) {
      if (e.indexOf(r) !== -1)
        continue;
      n[r] = t[r];
    }
  return n;
}
var U0 = Wr, j0 = function(e) {
  var n = Ce.useRef(e);
  return U0(function() {
    n.current = e;
  }), n;
}, Ua = function(e, n) {
  if (typeof e == "function") {
    e(n);
    return;
  }
  e.current = n;
}, V0 = function(e, n) {
  var r = Ce.useRef();
  return Ce.useCallback(function(i) {
    e.current = i, r.current && Ua(r.current, null), r.current = n, n && Ua(n, i);
  }, [n]);
}, ja = {
  "min-height": "0",
  "max-height": "none",
  height: "0",
  visibility: "hidden",
  overflow: "hidden",
  position: "absolute",
  "z-index": "-1000",
  top: "0",
  right: "0",
  display: "block"
}, q0 = function(e) {
  Object.keys(ja).forEach(function(n) {
    e.style.setProperty(n, ja[n], "important");
  });
}, Va = q0, Pe = null, qa = function(e, n) {
  var r = e.scrollHeight;
  return n.sizingStyle.boxSizing === "border-box" ? r + n.borderSize : r - n.paddingSize;
};
function H0(t, e, n, r) {
  n === void 0 && (n = 1), r === void 0 && (r = 1 / 0), Pe || (Pe = document.createElement("textarea"), Pe.setAttribute("tabindex", "-1"), Pe.setAttribute("aria-hidden", "true"), Va(Pe)), Pe.parentNode === null && document.body.appendChild(Pe);
  var i = t.paddingSize, o = t.borderSize, s = t.sizingStyle, a = s.boxSizing;
  Object.keys(s).forEach(function(h) {
    var p = h;
    Pe.style[p] = s[p];
  }), Va(Pe), Pe.value = e;
  var l = qa(Pe, t);
  Pe.value = e, l = qa(Pe, t), Pe.value = "x";
  var c = Pe.scrollHeight - i, d = c * n;
  a === "border-box" && (d = d + i + o), l = Math.max(d, l);
  var u = c * r;
  return a === "border-box" && (u = u + i + o), l = Math.min(u, l), [l, c];
}
var Ha = function() {
}, W0 = function(e, n) {
  return e.reduce(function(r, i) {
    return r[i] = n[i], r;
  }, {});
}, G0 = [
  "borderBottomWidth",
  "borderLeftWidth",
  "borderRightWidth",
  "borderTopWidth",
  "boxSizing",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  // non-standard
  "tabSize",
  "textIndent",
  // non-standard
  "textRendering",
  "textTransform",
  "width",
  "wordBreak",
  "wordSpacing",
  "scrollbarGutter"
], K0 = !!document.documentElement.currentStyle, J0 = function(e) {
  var n = window.getComputedStyle(e);
  if (n === null)
    return null;
  var r = W0(G0, n), i = r.boxSizing;
  if (i === "")
    return null;
  K0 && i === "border-box" && (r.width = parseFloat(r.width) + parseFloat(r.borderRightWidth) + parseFloat(r.borderLeftWidth) + parseFloat(r.paddingRight) + parseFloat(r.paddingLeft) + "px");
  var o = parseFloat(r.paddingBottom) + parseFloat(r.paddingTop), s = parseFloat(r.borderBottomWidth) + parseFloat(r.borderTopWidth);
  return {
    sizingStyle: r,
    paddingSize: o,
    borderSize: s
  };
}, Q0 = J0;
function Yo(t, e, n) {
  var r = j0(n);
  Wr(function() {
    var i = function(s) {
      return r.current(s);
    };
    if (t)
      return t.addEventListener(e, i), function() {
        return t.removeEventListener(e, i);
      };
  }, []);
}
var Y0 = function(e, n) {
  Yo(document.body, "reset", function(r) {
    e.current.form === r.target && n(r);
  });
}, X0 = function(e) {
  Yo(window, "resize", e);
}, Z0 = function(e) {
  Yo(document.fonts, "loadingdone", e);
}, e1 = ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"], t1 = function(e, n) {
  var r = e.cacheMeasurements, i = e.maxRows, o = e.minRows, s = e.onChange, a = s === void 0 ? Ha : s, l = e.onHeightChange, c = l === void 0 ? Ha : l, d = B0(e, e1), u = d.value !== void 0, h = Fe(null), p = V0(h, n), m = Fe(0), g = Fe(), w = function() {
    var x = h.current, T = r && g.current ? g.current : Q0(x);
    if (T) {
      g.current = T;
      var I = H0(T, x.value || x.placeholder || "x", o, i), y = I[0], M = I[1];
      m.current !== y && (m.current = y, x.style.setProperty("height", y + "px", "important"), c(y, {
        rowHeight: M
      }));
    }
  }, b = function(x) {
    u || w(), a(x);
  };
  return Wr(w), Y0(h, function() {
    if (!u) {
      var k = h.current.value;
      requestAnimationFrame(function() {
        var x = h.current;
        x && k !== x.value && w();
      });
    }
  }), X0(w), Z0(w), /* @__PURE__ */ Et("textarea", ro({}, d, {
    onChange: b,
    ref: p
  }));
}, n1 = /* @__PURE__ */ ie(t1);
const r1 = "(pointer: coarse) and (not (any-pointer: fine))", Fd = ie(({ autoFocus: t = !1, asChild: e, render: n, disabled: r, onChange: i, onKeyDown: o, onPaste: s, onSelect: a, submitOnEnter: l, submitMode: c, cancelOnEscape: d = !0, unstable_focusOnRunStart: u = !0, unstable_focusOnScrollToBottom: h = !0, unstable_focusOnThreadSwitched: p = !0, unstable_insertNewlineOnTouchEnter: m = !1, addAttachmentOnPaste: g = !0, ...w }, b) => {
  const k = Z(), x = ri(), T = c ?? (l === !1 ? "none" : "enter"), I = $d(m ? r1 : null), y = m && I && T === "enter" ? "none" : T, M = L0(), E = O0(r), N = ne(null), _ = en(b, N), A = ne(!1);
  wd((F) => {
    var v;
    if (!((v = N.current) != null && v.contains(F.target)))
      return;
    if (x) {
      for (const Q of x.getPlugins())
        if (Q.handleKeyDown(F))
          return;
    }
    if (!d)
      return;
    const B = k.composer();
    B.getState().canCancel && (B.cancel(), F.preventDefault());
  });
  const P = (F) => {
    var B, v;
    if (!E && !F.nativeEvent.isComposing) {
      if (x) {
        for (const Q of x.getPlugins())
          if (Q.handleKeyDown(F))
            return;
      }
      if (F.key === "Enter") {
        const Q = k.thread().getState(), ee = Q.capabilities.queue;
        if (F.shiftKey && (F.ctrlKey || F.metaKey) && ee && T !== "none" && k.composer().getState().canSend) {
          F.preventDefault(), k.composer().send({ steer: !0 });
          return;
        }
        if (F.shiftKey || Q.isRunning && !ee)
          return;
        let S = !1;
        y === "ctrlEnter" ? S = F.ctrlKey || F.metaKey : y === "enter" && (S = !0), S && (F.preventDefault(), (v = (B = N.current) == null ? void 0 : B.closest("form")) == null || v.requestSubmit());
      }
    }
  }, D = async (F) => {
    var Q;
    if (!g)
      return;
    const B = k.thread().getState().capabilities, v = Array.from(((Q = F.clipboardData) == null ? void 0 : Q.files) || []);
    if (B.attachments && v.length > 0)
      try {
        F.preventDefault(), await Promise.all(v.map((ee) => k.composer().addAttachment(ee)));
      } catch (ee) {
        console.error("Error adding attachment:", ee);
      }
  }, O = t && !E, z = It(() => {
    const F = N.current;
    !F || !O || (F.focus({ preventScroll: !0 }), F.setSelectionRange(F.value.length, F.value.length));
  }, [O]);
  Y(() => z(), [z]), Od(() => {
    k.composer().getState().type === "thread" && h && z();
  }), Y(() => {
    if (!(k.composer().getState().type !== "thread" || !u))
      return k.on("thread.runStart", z);
  }, [
    u,
    z,
    k
  ]), Y(() => {
    if (!(k.composer().getState().type !== "thread" || !p))
      return k.on("threadListItem.switchedTo", z);
  }, [
    p,
    z,
    k
  ]);
  const V = F0(), G = {
    name: "input",
    value: M,
    ...w,
    ...V,
    ref: _,
    disabled: E,
    onChange: _e(i, (F) => {
      if (!k.composer().getState().isEditing)
        return;
      const B = F.nativeEvent.isComposing === !0;
      A.current && !B && (A.current = !1);
      const v = B || A.current;
      if (Os(() => {
        k.composer().setText(F.target.value);
      }), v)
        return;
      const Q = F.target.selectionStart ?? F.target.value.length;
      if (x)
        for (const ee of x.getPlugins())
          ee.setCursorPosition(Q);
    }),
    onKeyDown: _e(o, P),
    onCompositionStart: _e(w.onCompositionStart, () => {
      A.current = !0;
    }),
    onCompositionEnd: _e(w.onCompositionEnd, (F) => {
      if (A.current = !1, !k.composer().getState().isEditing)
        return;
      const B = F.target;
      Os(() => {
        k.composer().setText(B.value);
      });
      const v = B.selectionStart ?? B.value.length;
      if (x)
        for (const Q of x.getPlugins())
          Q.setCursorPosition(v);
    }),
    onSelect: _e(a, (F) => {
      if (A.current)
        return;
      const B = F.target, v = B.selectionStart ?? B.value.length;
      if (x)
        for (const Q of x.getPlugins())
          Q.setCursorPosition(v);
    }),
    onPaste: _e(s, D)
  };
  if (n && Rt(n)) {
    const F = w.children !== void 0 ? w.children : n.props.children;
    return /* @__PURE__ */ f(Fr, {
      ...G,
      children: Ht(n, void 0, F)
    });
  }
  return /* @__PURE__ */ f(e ? Fr : n1, { ...G });
});
Fd.displayName = "ComposerPrimitive.Input";
const i1 = () => {
  const { disabled: t, cancel: e } = Cy();
  return t ? null : e;
}, o1 = at("ComposerPrimitive.Cancel", i1), s1 = (t) => {
  const e = R(6);
  let n;
  e[0] !== t ? (n = t === void 0 ? {} : t, e[0] = t, e[1] = n) : n = e[1];
  const { multiple: r } = n, i = r === void 0 ? !0 : r, { disabled: o, addAttachment: s } = Ey(), a = Z();
  let l;
  e[2] !== s || e[3] !== a || e[4] !== i ? (l = () => {
    const d = document.createElement("input");
    d.type = "file", d.multiple = i, d.hidden = !0;
    const u = a.composer().getState().attachmentAccept;
    u !== "*" && (d.accept = u), document.body.appendChild(d), d.onchange = (h) => {
      const p = h.target.files;
      if (p) {
        for (const m of p)
          s(m);
        document.body.removeChild(d);
      }
    }, d.oncancel = () => {
      (!d.files || d.files.length === 0) && document.body.removeChild(d);
    }, d.click();
  }, e[2] = s, e[3] = a, e[4] = i, e[5] = l) : l = e[5];
  const c = l;
  return o ? null : c;
}, a1 = at("ComposerPrimitive.AddAttachment", s1, ["multiple"]), Bd = ie((t, e) => {
  const n = R(30), { disabled: r, asChild: i, render: o, children: s, ...a } = t, l = i === void 0 ? !1 : i, [c, d] = xe(!1), u = Z();
  let h;
  n[0] !== r ? (h = (D) => {
    r || (D.preventDefault(), d(!0));
  }, n[0] = r, n[1] = h) : h = n[1];
  const p = h;
  let m;
  n[2] !== r || n[3] !== c ? (m = (D) => {
    r || (D.preventDefault(), c || d(!0));
  }, n[2] = r, n[3] = c, n[4] = m) : m = n[4];
  const g = m;
  let w;
  n[5] !== r ? (w = (D) => {
    if (r)
      return;
    D.preventDefault();
    const O = D.relatedTarget;
    O && D.currentTarget.contains(O) || d(!1);
  }, n[5] = r, n[6] = w) : w = n[6];
  const b = w;
  let k;
  n[7] !== u || n[8] !== r ? (k = async (D) => {
    if (r)
      return;
    D.preventDefault(), d(!1);
    const O = Array.from(D.dataTransfer.files);
    await Promise.all(O.map(async (z) => {
      try {
        await u.composer().addAttachment(z);
      } catch (V) {
        console.error("Failed to add attachment:", V);
      }
    }));
  }, n[7] = u, n[8] = r, n[9] = k) : k = n[9];
  const x = k;
  let T;
  n[10] !== c ? (T = c ? { "data-dragging": "true" } : null, n[10] = c, n[11] = T) : T = n[11];
  const I = _e(a.onDragEnterCapture, p), y = _e(a.onDragOverCapture, g), M = _e(a.onDragLeaveCapture, b), E = _e(a.onDropCapture, x);
  let N;
  n[12] !== e || n[13] !== a || n[14] !== E || n[15] !== T || n[16] !== I || n[17] !== y || n[18] !== M ? (N = {
    ...T,
    ...a,
    onDragEnterCapture: I,
    onDragOverCapture: y,
    onDragLeaveCapture: M,
    onDropCapture: E,
    ref: e
  }, n[12] = e, n[13] = a, n[14] = E, n[15] = T, n[16] = I, n[17] = y, n[18] = M, n[19] = N) : N = n[19];
  const _ = N;
  if (o && Rt(o)) {
    const D = s !== void 0 ? s : o.props.children;
    let O;
    n[20] !== o || n[21] !== D ? (O = Ht(o, void 0, D), n[20] = o, n[21] = D, n[22] = O) : O = n[22];
    let z;
    return n[23] !== _ || n[24] !== O ? (z = /* @__PURE__ */ f(Fr, {
      ..._,
      children: O
    }), n[23] = _, n[24] = O, n[25] = z) : z = n[25], z;
  }
  const A = l ? Fr : "div";
  let P;
  return n[26] !== A || n[27] !== s || n[28] !== _ ? (P = /* @__PURE__ */ f(A, {
    ..._,
    children: s
  }), n[26] = A, n[27] = s, n[28] = _, n[29] = P) : P = n[29], P;
});
Bd.displayName = "ComposerPrimitive.AttachmentDropzone";
const l1 = () => {
  const { disabled: t, startDictation: e } = Iy();
  return t ? null : e;
}, c1 = at("ComposerPrimitive.Dictate", l1), u1 = () => {
  const t = R(2), e = Z(), n = $(h1);
  let r;
  t[0] !== e ? (r = () => {
    e.composer().stopDictation();
  }, t[0] = e, t[1] = r) : r = t[1];
  const i = r;
  return n ? i : null;
}, d1 = at("ComposerPrimitive.StopDictation", u1);
function h1(t) {
  return t.composer.dictation != null;
}
const Ud = ie((t, e) => {
  const n = R(7);
  let r, i;
  n[0] !== t ? ({ children: r, ...i } = t, n[0] = t, n[1] = r, n[2] = i) : (r = n[1], i = n[2]);
  const o = $(p1);
  if (!o)
    return null;
  const s = r ?? o;
  let a;
  return n[3] !== e || n[4] !== i || n[5] !== s ? (a = /* @__PURE__ */ f(fe.span, {
    ...i,
    ref: e,
    children: s
  }), n[3] = e, n[4] = i, n[5] = s, n[6] = a) : a = n[6], a;
});
Ud.displayName = "ComposerPrimitive.DictationTranscript";
function p1(t) {
  var e;
  return (e = t.composer.dictation) == null ? void 0 : e.transcript;
}
const jd = ie((t, e) => {
  const n = R(3);
  if (!$(m1))
    return null;
  let r;
  return n[0] !== e || n[1] !== t ? (r = /* @__PURE__ */ f(fe.div, {
    ...t,
    ref: e
  }), n[0] = e, n[1] = t, n[2] = r) : r = n[2], r;
});
jd.displayName = "ComposerPrimitive.Quote";
const Vd = ie((t, e) => {
  const n = R(7);
  let r, i;
  n[0] !== t ? ({ children: r, ...i } = t, n[0] = t, n[1] = r, n[2] = i) : (r = n[1], i = n[2]);
  const o = $(f1);
  if (!o)
    return null;
  const s = r ?? o;
  let a;
  return n[3] !== e || n[4] !== i || n[5] !== s ? (a = /* @__PURE__ */ f(fe.span, {
    ...i,
    ref: e,
    children: s
  }), n[3] = e, n[4] = i, n[5] = s, n[6] = a) : a = n[6], a;
});
Vd.displayName = "ComposerPrimitive.QuoteText";
const qd = ie((t, e) => {
  const n = R(12);
  let r, i;
  n[0] !== t ? ({ onClick: r, ...i } = t, n[0] = t, n[1] = r, n[2] = i) : (r = n[1], i = n[2]);
  const o = Z();
  let s;
  n[3] !== o ? (s = () => {
    o.composer().setQuote(void 0);
  }, n[3] = o, n[4] = s) : s = n[4];
  const a = s;
  let l;
  n[5] !== a || n[6] !== r ? (l = _e(r, a), n[5] = a, n[6] = r, n[7] = l) : l = n[7];
  let c;
  return n[8] !== e || n[9] !== i || n[10] !== l ? (c = /* @__PURE__ */ f(fe.button, {
    type: "button",
    ...i,
    ref: e,
    onClick: l
  }), n[8] = e, n[9] = i, n[10] = l, n[11] = c) : c = n[11], c;
});
qd.displayName = "ComposerPrimitive.QuoteDismiss";
function m1(t) {
  return t.composer.quote;
}
function f1(t) {
  var e;
  return (e = t.composer.quote) == null ? void 0 : e.text;
}
const Hd = ie((t, e) => {
  const n = R(12);
  let r, i, o;
  n[0] !== t ? ({ children: i, "aria-label": r, ...o } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o) : (r = n[1], i = n[2], o = n[3]);
  const { categories: s, activeCategoryId: a, isSearchMode: l, open: c } = Tn();
  if (!c || a || l)
    return null;
  const d = r ?? "Categories";
  let u;
  n[4] !== s || n[5] !== i ? (u = i(s), n[4] = s, n[5] = i, n[6] = u) : u = n[6];
  let h;
  return n[7] !== e || n[8] !== o || n[9] !== d || n[10] !== u ? (h = /* @__PURE__ */ f(fe.div, {
    role: "group",
    "aria-label": d,
    ...o,
    ref: e,
    children: u
  }), n[7] = e, n[8] = o, n[9] = d, n[10] = u, n[11] = h) : h = n[11], h;
});
Hd.displayName = "ComposerPrimitive.TriggerPopoverCategories";
const Wd = ie((t, e) => {
  const n = R(30);
  let r, i, o, s;
  n[0] !== t ? ({ categoryId: r, onClick: i, onMouseMove: o, ...s } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o, n[4] = s) : (r = n[1], i = n[2], o = n[3], s = n[4]);
  const { selectCategory: a, highlightIndex: l, categories: c, highlightedIndex: d, activeCategoryId: u, isSearchMode: h, popoverId: p } = Tn();
  let m;
  n[5] !== r || n[6] !== a ? (m = () => {
    a(r);
  }, n[5] = r, n[6] = a, n[7] = m) : m = n[7];
  const g = m;
  let w;
  if (n[8] !== c || n[9] !== r) {
    let _;
    n[11] !== r ? (_ = (A) => A.id === r, n[11] = r, n[12] = _) : _ = n[12], w = c.findIndex(_), n[8] = c, n[9] = r, n[10] = w;
  } else
    w = n[10];
  const b = w, k = !u && !h && b === d;
  let x;
  n[13] !== b || n[14] !== l ? (x = () => {
    l(b);
  }, n[13] = b, n[14] = l, n[15] = x) : x = n[15];
  const T = x, I = `${p}-option-${r}`, y = k ? "" : void 0;
  let M;
  n[16] !== g || n[17] !== i ? (M = _e(i, g), n[16] = g, n[17] = i, n[18] = M) : M = n[18];
  let E;
  n[19] !== T || n[20] !== o ? (E = _e(o, T), n[19] = T, n[20] = o, n[21] = E) : E = n[21];
  let N;
  return n[22] !== e || n[23] !== k || n[24] !== s || n[25] !== I || n[26] !== y || n[27] !== M || n[28] !== E ? (N = /* @__PURE__ */ f(fe.button, {
    type: "button",
    role: "option",
    id: I,
    "aria-selected": k,
    "data-highlighted": y,
    ...s,
    ref: e,
    onClick: M,
    onMouseMove: E
  }), n[22] = e, n[23] = k, n[24] = s, n[25] = I, n[26] = y, n[27] = M, n[28] = E, n[29] = N) : N = n[29], N;
});
Wd.displayName = "ComposerPrimitive.TriggerPopoverCategoryItem";
const Gd = ie((t, e) => {
  const n = R(12);
  let r, i, o;
  n[0] !== t ? ({ children: i, "aria-label": r, ...o } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o) : (r = n[1], i = n[2], o = n[3]);
  const { items: s, activeCategoryId: a, isSearchMode: l, open: c } = Tn();
  if (!c || !a && !l)
    return null;
  const d = r ?? "Items";
  let u;
  n[4] !== i || n[5] !== s ? (u = i(s), n[4] = i, n[5] = s, n[6] = u) : u = n[6];
  let h;
  return n[7] !== e || n[8] !== o || n[9] !== d || n[10] !== u ? (h = /* @__PURE__ */ f(fe.div, {
    role: "group",
    "aria-label": d,
    ...o,
    ref: e,
    children: u
  }), n[7] = e, n[8] = o, n[9] = d, n[10] = u, n[11] = h) : h = n[11], h;
});
Gd.displayName = "ComposerPrimitive.TriggerPopoverItems";
const Kd = ie((t, e) => {
  const n = R(30);
  let r, i, o, s, a;
  n[0] !== t ? ({ item: i, index: r, onClick: o, onMouseMove: s, ...a } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o, n[4] = s, n[5] = a) : (r = n[1], i = n[2], o = n[3], s = n[4], a = n[5]);
  const { selectItem: l, highlightIndex: c, items: d, highlightedIndex: u, activeCategoryId: h, isSearchMode: p, popoverId: m } = Tn();
  let g;
  n[6] !== i || n[7] !== l ? (g = () => {
    l(i);
  }, n[6] = i, n[7] = l, n[8] = g) : g = n[8];
  const w = g;
  let b;
  n[9] !== r || n[10] !== i.id || n[11] !== d ? (b = r ?? d.findIndex((A) => A.id === i.id), n[9] = r, n[10] = i.id, n[11] = d, n[12] = b) : b = n[12];
  const k = b, x = (p || h !== null) && k === u;
  let T;
  n[13] !== c || n[14] !== k ? (T = () => {
    c(k);
  }, n[13] = c, n[14] = k, n[15] = T) : T = n[15];
  const I = T, y = `${m}-option-${i.id}`, M = x ? "" : void 0;
  let E;
  n[16] !== w || n[17] !== o ? (E = _e(o, w), n[16] = w, n[17] = o, n[18] = E) : E = n[18];
  let N;
  n[19] !== I || n[20] !== s ? (N = _e(s, I), n[19] = I, n[20] = s, n[21] = N) : N = n[21];
  let _;
  return n[22] !== e || n[23] !== x || n[24] !== a || n[25] !== y || n[26] !== M || n[27] !== E || n[28] !== N ? (_ = /* @__PURE__ */ f(fe.button, {
    type: "button",
    role: "option",
    id: y,
    "aria-selected": x,
    "data-highlighted": M,
    ...a,
    ref: e,
    onClick: E,
    onMouseMove: N
  }), n[22] = e, n[23] = x, n[24] = a, n[25] = y, n[26] = M, n[27] = E, n[28] = N, n[29] = _) : _ = n[29], _;
});
Kd.displayName = "ComposerPrimitive.TriggerPopoverItem";
const Jd = ie((t, e) => {
  const n = R(10);
  let r, i;
  n[0] !== t ? ({ onClick: r, ...i } = t, n[0] = t, n[1] = r, n[2] = i) : (r = n[1], i = n[2]);
  const { activeCategoryId: o, isSearchMode: s, goBack: a, open: l } = Tn();
  if (!l || !o || s)
    return null;
  let c;
  n[3] !== a || n[4] !== r ? (c = _e(r, a), n[3] = a, n[4] = r, n[5] = c) : c = n[5];
  let d;
  return n[6] !== e || n[7] !== i || n[8] !== c ? (d = /* @__PURE__ */ f(fe.button, {
    type: "button",
    ...i,
    ref: e,
    onClick: c
  }), n[6] = e, n[7] = i, n[8] = c, n[9] = d) : d = n[9], d;
});
Jd.displayName = "ComposerPrimitive.TriggerPopoverBack";
const Qd = ({ formatter: t, onExecute: e, removeOnExecute: n }) => {
  const { register: r } = Nd(), i = ne(e);
  return i.current = e, Y(() => r({
    kind: "action",
    formatter: t ?? hd,
    onExecute: (o) => i.current(o),
    ...n !== void 0 ? { removeOnExecute: n } : {}
  }), [
    r,
    t,
    n
  ]), null;
};
Qd.displayName = "ComposerPrimitive.TriggerPopoverAction";
const Yd = ({ formatter: t, onInserted: e }) => {
  const { register: n } = Nd(), r = ne(e);
  return r.current = e, Y(() => n({
    kind: "directive",
    formatter: t ?? hd,
    onInserted: (i) => {
      var o;
      return (o = r.current) == null ? void 0 : o.call(r, i);
    }
  }), [n, t]), null;
};
Yd.displayName = "ComposerPrimitive.TriggerPopoverDirective";
const g1 = Object.assign(Dd, {
  Directive: Yd,
  Action: Qd
});
var je = /* @__PURE__ */ tn({
  AddAttachment: () => a1,
  AttachmentByIndex: () => id,
  AttachmentDropzone: () => Bd,
  Attachments: () => od,
  Cancel: () => o1,
  Dictate: () => c1,
  DictationTranscript: () => Ud,
  If: () => ud,
  Input: () => Fd,
  Queue: () => sd,
  Quote: () => jd,
  QuoteDismiss: () => qd,
  QuoteText: () => Vd,
  Root: () => zd,
  Send: () => M0,
  StopDictation: () => d1,
  Unstable_TriggerPopover: () => g1,
  Unstable_TriggerPopoverBack: () => Jd,
  Unstable_TriggerPopoverCategories: () => Hd,
  Unstable_TriggerPopoverCategoryItem: () => Wd,
  Unstable_TriggerPopoverItem: () => Kd,
  Unstable_TriggerPopoverItems: () => Gd,
  Unstable_TriggerPopoverRoot: () => Md,
  unstable_useTriggerPopoverRootContext: () => Ko,
  unstable_useTriggerPopoverRootContextOptional: () => Jo,
  unstable_useTriggerPopoverScopeContext: () => Tn,
  unstable_useTriggerPopoverScopeContextOptional: () => E0,
  unstable_useTriggerPopoverTriggers: () => h0,
  unstable_useTriggerPopoverTriggersOptional: () => m0
});
const Xd = () => $(b1);
function b1(t) {
  if (t.part.type !== "text" && t.part.type !== "reasoning")
    throw new Error("MessagePartText can only be used inside text or reasoning message parts.");
  return t.part;
}
const Zd = Ye(null), v1 = (t) => ({ useSmoothStatus: wn(() => t) }), w1 = (t) => {
  const e = R(6), { children: n } = t;
  let r;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (r = { optional: !0 }, e[0] = r) : r = e[0];
  const i = eh(r), o = Z();
  let s;
  e[1] !== o ? (s = () => v1(o.part().getState().status), e[1] = o, e[2] = s) : s = e[2];
  const [a] = xe(s);
  if (i)
    return n;
  let l;
  return e[3] !== n || e[4] !== a ? (l = /* @__PURE__ */ f(Zd.Provider, {
    value: a,
    children: n
  }), e[3] = n, e[4] = a, e[5] = l) : l = e[5], l;
}, y1 = (t) => {
  const e = ie((n, r) => {
    const i = R(3), o = n;
    let s;
    return i[0] !== r || i[1] !== o ? (s = /* @__PURE__ */ f(w1, { children: /* @__PURE__ */ f(t, {
      ...o,
      ref: r
    }) }), i[0] = r, i[1] = o, i[2] = s) : s = i[2], s;
  });
  return e.displayName = t.displayName, e;
};
function eh(t) {
  const e = Xe(Zd);
  if (!(t != null && t.optional) && !e)
    throw new Error("This component must be used within a SmoothContextProvider.");
  return e;
}
const { useSmoothStatus: x1, useSmoothStatusStore: k1 } = pd(eh, "useSmoothStatus"), th = 250, nh = 5;
var _1 = class {
  constructor(t, e) {
    C(this, "currentText");
    C(this, "setText");
    C(this, "animationFrameId", null);
    C(this, "lastUpdateTime", Date.now());
    C(this, "lastCommitTime", 0);
    C(this, "targetText", "");
    C(this, "drainMs", th);
    C(this, "maxCharIntervalMs", nh);
    C(this, "maxCharsPerFrame", 1 / 0);
    C(this, "minCommitMs", 0);
    C(this, "animate", () => {
      const t = Date.now();
      let e = t - this.lastUpdateTime;
      const n = this.targetText.length - this.currentText.length, r = Math.min(this.maxCharIntervalMs, this.drainMs / n), i = Math.min(n, this.maxCharsPerFrame);
      let o = 0;
      for (; e >= r && o < i; )
        o++, e -= r;
      o === i && i === this.maxCharsPerFrame && (e = 0), o !== n ? this.animationFrameId = requestAnimationFrame(this.animate) : this.animationFrameId = null, o !== 0 && (this.currentText = this.targetText.slice(0, this.currentText.length + o), this.lastUpdateTime = t - e, (o === n || t - this.lastCommitTime >= this.minCommitMs) && (this.lastCommitTime = t, this.setText(this.currentText)));
    });
    this.currentText = t, this.setText = e;
  }
  start() {
    this.animationFrameId === null && (this.lastUpdateTime = Date.now(), this.animate());
  }
  stop() {
    this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null);
  }
};
const _i = Object.freeze({ type: "running" }), br = (t, e) => t !== void 0 && t > 0 ? t : e, rh = (t, e = !1) => {
  const { text: n } = t, r = $d("(prefers-reduced-motion: reduce)"), i = typeof e == "object" && e !== null ? e : void 0, o = e !== !1 && e !== null && !r, s = br(i == null ? void 0 : i.drainMs, th), a = br(i == null ? void 0 : i.maxCharIntervalMs, nh), l = br(i == null ? void 0 : i.maxCharsPerFrame, 1 / 0), c = br(i == null ? void 0 : i.minCommitMs, 0), [d, u] = xe(t.status.type === "running" ? "" : n), h = Z(), p = $(() => h.part()), [m, g] = xe(p);
  (p !== m || !n.startsWith(d)) && (g(p), u(t.status.type === "running" ? "" : n));
  const w = k1({ optional: !0 }), b = Kt((T) => {
    if (u(T), w) {
      const I = d !== T || t.status.type === "running" ? _i : t.status;
      $r(w).setState(I, !0);
    }
  });
  Y(() => {
    if (w) {
      const T = o && (d !== n || t.status.type === "running") ? _i : t.status;
      $r(w).setState(T, !0);
    }
  }, [
    w,
    o,
    n,
    d,
    t.status
  ]);
  const [k] = xe(new _1(d, b));
  Y(() => {
    k.drainMs = s, k.maxCharIntervalMs = a, k.maxCharsPerFrame = l, k.minCommitMs = c;
  }, [
    k,
    s,
    a,
    l,
    c
  ]);
  const x = ne(p);
  return Y(() => {
    if (!o) {
      k.stop();
      return;
    }
    const T = x.current !== p;
    if (x.current = p, T || !n.startsWith(k.targetText)) {
      t.status.type === "running" ? (k.currentText = "", k.targetText = n, k.lastCommitTime = 0, k.start()) : (k.currentText = n, k.targetText = n, k.stop());
      return;
    }
    k.targetText = n, k.start();
  }, [
    k,
    o,
    n,
    t.status.type,
    p
  ]), Y(() => () => {
    k.stop();
  }, [k]), de(() => o ? {
    ...t,
    text: d,
    status: n === d ? t.status : _i
  } : t, [
    o,
    d,
    t,
    n
  ]);
}, S1 = () => $(C1);
function C1(t) {
  if (t.part.type !== "image")
    throw new Error("MessagePartImage can only be used inside image message parts.");
  return t.part;
}
const Xo = ie((t, e) => {
  const n = R(10);
  let r, i, o;
  n[0] !== t ? ({ smooth: i, component: o, ...r } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o) : (r = n[1], i = n[2], o = n[3]);
  const s = i === void 0 ? !0 : i, a = o === void 0 ? "span" : o, { text: l, status: c } = rh(Xd(), s);
  let d;
  return n[4] !== a || n[5] !== e || n[6] !== r || n[7] !== c.type || n[8] !== l ? (d = /* @__PURE__ */ f(a, {
    "data-status": c.type,
    ...r,
    ref: e,
    children: l
  }), n[4] = a, n[5] = e, n[6] = r, n[7] = c.type, n[8] = l, n[9] = d) : d = n[9], d;
});
Xo.displayName = "MessagePartPrimitive.Text";
const Zo = ie((t, e) => {
  const n = R(4), { image: r } = S1();
  let i;
  return n[0] !== e || n[1] !== r || n[2] !== t ? (i = /* @__PURE__ */ f(fe.img, {
    src: r,
    ...t,
    ref: e
  }), n[0] = e, n[1] = r, n[2] = t, n[3] = i) : i = n[3], i;
});
Zo.displayName = "MessagePartPrimitive.Image";
const ih = ie((t, e) => {
  const n = R(3);
  let r;
  return n[0] !== e || n[1] !== t ? (r = /* @__PURE__ */ f(fe.div, {
    role: "alert",
    ...t,
    ref: e
  }), n[0] = e, n[1] = t, n[2] = r) : r = n[2], r;
});
ih.displayName = "ErrorPrimitive.Root";
const oh = ie((t, e) => {
  const n = R(7);
  let r, i;
  n[0] !== t ? ({ children: r, ...i } = t, n[0] = t, n[1] = r, n[2] = i) : (r = n[1], i = n[2]);
  const o = dd();
  if (o === void 0)
    return null;
  const s = r ?? String(o);
  let a;
  return n[3] !== e || n[4] !== i || n[5] !== s ? (a = /* @__PURE__ */ f(fe.span, {
    ...i,
    ref: e,
    children: s
  }), n[3] = e, n[4] = i, n[5] = s, n[6] = a) : a = n[6], a;
});
oh.displayName = "ErrorPrimitive.Message";
var Wa = /* @__PURE__ */ tn({
  Message: () => oh,
  Root: () => ih
});
const nn = (t) => {
  const e = R(2), n = ne(void 0);
  let r;
  return e[0] !== t ? (r = (i) => {
    n.current && (n.current(), n.current = void 0), i && (n.current = t(i));
  }, e[0] = t, e[1] = r) : r = e[1], r;
}, Ga = (t, e) => {
  const n = t.trim().match(/^(\d+(?:\.\d+)?|\.\d+)(em|px|rem)$/);
  if (!n)
    return Number.POSITIVE_INFINITY;
  const r = Number(n[1]), i = n[2];
  return i === "px" ? r : i === "em" ? r * (parseFloat(getComputedStyle(e).fontSize) || 16) : i === "rem" ? r * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) : Number.POSITIVE_INFINITY;
}, T1 = (t) => t.dataset.messageId, I1 = () => {
  const t = document.createElement("div");
  return t.dataset.auiTopAnchorReserve = "", t.style.height = "0px", t.style.flexShrink = "0", t.style.pointerEvents = "none", t.setAttribute("aria-hidden", "true"), t;
}, Ka = (t, e) => {
  const n = `${e}px`;
  return t.style.height !== n ? (t.style.height = n, !0) : !1;
}, A1 = (t) => {
  const e = window.devicePixelRatio || 1;
  return Math.round(t * e) / e;
}, sh = () => {
  const t = R(4), e = Z();
  let n;
  t[0] !== e ? (n = () => e.message(), t[0] = e, t[1] = n) : n = t[1];
  const r = $(n);
  let i;
  return t[2] !== r ? (i = (o) => {
    const s = () => {
      r.setIsHovering(!0);
    }, a = () => {
      r.setIsHovering(!1);
    };
    return o.addEventListener("mouseenter", s), o.addEventListener("mouseleave", a), o.matches(":hover") && queueMicrotask(() => r.setIsHovering(!0)), () => {
      o.removeEventListener("mouseenter", s), o.removeEventListener("mouseleave", a), r.setIsHovering(!1);
    };
  }, t[2] = r, t[3] = i) : i = t[3], nn(i);
}, E1 = () => {
  const t = R(2), e = Xt(L1);
  let n;
  return t[0] !== e ? (n = (r) => {
    var i;
    return r.message.role === "user" && r.message.index > 0 && r.message.index === r.thread.messages.length - 2 && ((i = r.thread.messages.at(-1)) == null ? void 0 : i.role) === "assistant" && (r.message.id === e || r.thread.isRunning);
  }, t[0] = e, t[1] = n) : n = t[1], $(n);
}, R1 = () => {
  const t = R(2), e = Xt(z1);
  let n;
  return t[0] !== e ? (n = (r) => {
    var i;
    return r.message.isLast && r.message.role === "assistant" && r.message.index >= 1 && ((i = r.thread.messages.at(r.message.index - 1)) == null ? void 0 : i.role) === "user" && (r.message.id === e || r.thread.isRunning);
  }, t[0] = e, t[1] = n) : n = t[1], $(n);
}, M1 = (t, e) => {
  const n = R(3);
  let r;
  return n[0] !== t || n[1] !== e ? (r = (i) => {
    if (t)
      return e.getState().registerAnchorElement(i);
  }, n[0] = t, n[1] = e, n[2] = r) : r = n[2], nn(r);
}, P1 = (t) => {
  const e = R(3), { active: n, threadViewportStore: r } = t;
  let i;
  return e[0] !== n || e[1] !== r ? (i = (o) => {
    if (!n)
      return;
    const s = r.getState(), a = s.topAnchorMessageClamp;
    return s.registerAnchorTargetElement(o, {
      tallerThan: Ga(a.tallerThan, o),
      visibleHeight: Ga(a.visibleHeight, o)
    });
  }, e[0] = n, e[1] = r, e[2] = i) : i = e[2], nn(i);
}, N1 = (t) => {
  const e = R(7);
  let n, r;
  e[0] !== t ? ({ forwardedRef: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]);
  const i = sh(), o = en(n, i), s = $(O1);
  let a;
  return e[3] !== s || e[4] !== r || e[5] !== o ? (a = /* @__PURE__ */ f(fe.div, {
    ...r,
    ref: o,
    "data-message-id": s
  }), e[3] = s, e[4] = r, e[5] = o, e[6] = a) : a = e[6], a;
}, D1 = (t) => {
  const e = R(13);
  let n, r, i;
  e[0] !== t ? ({ forwardedRef: n, threadViewportStore: i, ...r } = t, e[0] = t, e[1] = n, e[2] = r, e[3] = i) : (n = e[1], r = e[2], i = e[3]);
  const o = sh(), s = E1(), a = R1(), l = M1(s, i);
  let c;
  e[4] !== a || e[5] !== i ? (c = {
    active: a,
    threadViewportStore: i
  }, e[4] = a, e[5] = i, e[6] = c) : c = e[6];
  const d = P1(c), u = en(n, o, l, d), h = $($1), p = s ? "" : void 0, m = a ? "" : void 0;
  let g;
  return e[7] !== h || e[8] !== r || e[9] !== u || e[10] !== p || e[11] !== m ? (g = /* @__PURE__ */ f(fe.div, {
    ...r,
    ref: u,
    "data-message-id": h,
    "data-aui-top-anchor-user": p,
    "data-aui-top-anchor-target": m
  }), e[7] = h, e[8] = r, e[9] = u, e[10] = p, e[11] = m, e[12] = g) : g = e[12], g;
}, ah = ie((t, e) => {
  const n = R(7), r = Zt();
  if (r.getState().turnAnchor === "top") {
    let o;
    return n[0] !== e || n[1] !== t || n[2] !== r ? (o = /* @__PURE__ */ f(D1, {
      ...t,
      forwardedRef: e,
      threadViewportStore: r
    }), n[0] = e, n[1] = t, n[2] = r, n[3] = o) : o = n[3], o;
  }
  let i;
  return n[4] !== e || n[5] !== t ? (i = /* @__PURE__ */ f(N1, {
    ...t,
    forwardedRef: e
  }), n[4] = e, n[5] = t, n[6] = i) : i = n[6], i;
});
ah.displayName = "MessagePrimitive.Root";
function L1(t) {
  var e;
  return (e = t.topAnchorTurn) == null ? void 0 : e.anchorId;
}
function z1(t) {
  var e;
  return (e = t.topAnchorTurn) == null ? void 0 : e.targetId;
}
function O1(t) {
  return t.message.id;
}
function $1(t) {
  return t.message.id;
}
const Si = {
  ...Ee,
  Text: () => /* @__PURE__ */ j("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ f(Xo, {}), /* @__PURE__ */ f(Ho, { children: /* @__PURE__ */ f("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Image: () => /* @__PURE__ */ f(Zo, {})
}, io = (t) => {
  const e = R(10);
  if ("children" in t) {
    let a;
    return e[0] !== t.children ? (a = /* @__PURE__ */ f(eo, { children: t.children }), e[0] = t.children, e[1] = a) : a = e[1], a;
  }
  let n, r;
  e[2] !== t ? ({ components: n, ...r } = t, e[2] = t, e[3] = n, e[4] = r) : (n = e[3], r = e[4]);
  let i;
  e[5] !== n ? (i = n ? {
    Text: n.Text ?? Si.Text,
    Image: n.Image ?? Si.Image,
    Reasoning: n.Reasoning ?? Ee.Reasoning,
    Source: n.Source ?? Ee.Source,
    File: n.File ?? Ee.File,
    Unstable_Audio: n.Unstable_Audio ?? Ee.Unstable_Audio,
    ..."ChainOfThought" in n ? { ChainOfThought: n.ChainOfThought } : {
      tools: n.tools,
      data: n.data,
      ToolGroup: n.ToolGroup ?? Ee.ToolGroup,
      ReasoningGroup: n.ReasoningGroup ?? Ee.ReasoningGroup
    },
    Empty: n.Empty,
    Quote: n.Quote,
    generativeUI: n.generativeUI
  } : Si, e[5] = n, e[6] = i) : i = e[6];
  const o = i;
  let s;
  return e[7] !== r || e[8] !== o ? (s = /* @__PURE__ */ f(eo, {
    components: o,
    ...r
  }), e[7] = r, e[8] = o, e[9] = s) : s = e[9], s;
};
io.displayName = "MessagePrimitive.Parts";
const lh = (t) => {
  const { children: e } = t;
  return dd() !== void 0 ? e : null;
};
lh.displayName = "MessagePrimitive.Error";
const F1 = (t) => {
  var r;
  const e = /* @__PURE__ */ new Map();
  for (let i = 0; i < t.length; i++) {
    const o = ((r = t[i]) == null ? void 0 : r.parentId) ?? `__ungrouped_${i}`, s = e.get(o) ?? [];
    s.push(i), e.set(o, s);
  }
  const n = [];
  for (const [i, o] of e) {
    const s = i.startsWith("__ungrouped_") ? void 0 : i;
    n.push({
      groupKey: s,
      indices: o
    });
  }
  return n;
}, B1 = (t) => {
  const e = R(4), n = $(Q1);
  let r;
  e: {
    if (n.length === 0) {
      let o;
      e[0] === Symbol.for("react.memo_cache_sentinel") ? (o = [], e[0] = o) : o = e[0], r = o;
      break e;
    }
    let i;
    e[1] !== t || e[2] !== n ? (i = t(n), e[1] = t, e[2] = n, e[3] = i) : i = e[3], r = i;
  }
  return r;
}, U1 = (t) => {
  const e = R(9);
  let n, r;
  e[0] !== t ? ({ Fallback: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]);
  let i;
  e[3] !== n || e[4] !== r.toolName ? (i = (a) => {
    const l = a.tools.tools[r.toolName] ?? n;
    return Array.isArray(l) ? l[0] ?? n : l;
  }, e[3] = n, e[4] = r.toolName, e[5] = i) : i = e[5];
  const o = $(i);
  if (!o)
    return null;
  let s;
  return e[6] !== o || e[7] !== r ? (s = /* @__PURE__ */ f(o, { ...r }), e[6] = o, e[7] = r, e[8] = s) : s = e[8], s;
}, j1 = (t) => {
  const e = R(9);
  let n, r;
  e[0] !== t ? ({ Fallback: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]);
  let i;
  e[3] !== n || e[4] !== r.name ? (i = (a) => {
    const l = a.dataRenderers.renderers[r.name] ?? n;
    return Array.isArray(l) ? l[0] ?? n : l;
  }, e[3] = n, e[4] = r.name, e[5] = i) : i = e[5];
  const o = $(i);
  if (!o)
    return null;
  let s;
  return e[6] !== o || e[7] !== r ? (s = /* @__PURE__ */ f(o, { ...r }), e[6] = o, e[7] = r, e[8] = s) : s = e[8], s;
}, St = {
  Text: () => /* @__PURE__ */ j("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ f(Xo, {}), /* @__PURE__ */ f(Ho, { children: /* @__PURE__ */ f("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Reasoning: () => null,
  Source: () => null,
  Image: () => /* @__PURE__ */ f(Zo, {}),
  File: () => null,
  Unstable_Audio: () => null,
  Group: ({ children: t }) => t
}, V1 = (t) => {
  var M, E, N;
  const e = R(43), { components: n } = t;
  let r;
  e[0] !== n ? (r = n === void 0 ? {} : n, e[0] = n, e[1] = r) : r = e[1];
  const { Text: i, Reasoning: o, Image: s, Source: a, File: l, Unstable_Audio: c, tools: d, data: u } = r, h = i === void 0 ? St.Text : i, p = o === void 0 ? St.Reasoning : o, m = s === void 0 ? St.Image : s, g = a === void 0 ? St.Source : a, w = l === void 0 ? St.File : l, b = c === void 0 ? St.Unstable_Audio : c;
  let k;
  e[2] !== d ? (k = d === void 0 ? {} : d, e[2] = d, e[3] = k) : k = e[3];
  const x = k, T = Z(), I = $(Y1), y = I.type;
  if (y === "tool-call") {
    let _;
    e[4] !== T ? (_ = T.part(), e[4] = T, e[5] = _) : _ = e[5];
    const A = _.addToolResult;
    let P;
    e[6] !== T ? (P = T.part(), e[6] = T, e[7] = P) : P = e[7];
    const D = P.resumeToolCall;
    let O;
    e[8] !== T ? (O = T.part(), e[8] = T, e[9] = O) : O = e[9];
    const z = O.respondToToolApproval;
    if ("Override" in x) {
      let F;
      return e[10] !== A || e[11] !== I || e[12] !== z || e[13] !== D || e[14] !== x.Override ? (F = /* @__PURE__ */ f(x.Override, {
        ...I,
        addResult: A,
        resume: D,
        respondToApproval: z
      }), e[10] = A, e[11] = I, e[12] = z, e[13] = D, e[14] = x.Override, e[15] = F) : F = e[15], F;
    }
    const V = ((M = x.by_name) == null ? void 0 : M[I.toolName]) ?? x.Fallback;
    let G;
    return e[16] !== V || e[17] !== A || e[18] !== I || e[19] !== z || e[20] !== D ? (G = /* @__PURE__ */ f(U1, {
      ...I,
      Fallback: V,
      addResult: A,
      resume: D,
      respondToApproval: z
    }), e[16] = V, e[17] = A, e[18] = I, e[19] = z, e[20] = D, e[21] = G) : G = e[21], G;
  }
  if (((E = I.status) == null ? void 0 : E.type) === "requires-action")
    throw new Error("Encountered unexpected requires-action status");
  switch (y) {
    case "text": {
      let _;
      return e[22] !== h || e[23] !== I ? (_ = /* @__PURE__ */ f(h, { ...I }), e[22] = h, e[23] = I, e[24] = _) : _ = e[24], _;
    }
    case "reasoning": {
      let _;
      return e[25] !== p || e[26] !== I ? (_ = /* @__PURE__ */ f(p, { ...I }), e[25] = p, e[26] = I, e[27] = _) : _ = e[27], _;
    }
    case "source": {
      let _;
      return e[28] !== g || e[29] !== I ? (_ = /* @__PURE__ */ f(g, { ...I }), e[28] = g, e[29] = I, e[30] = _) : _ = e[30], _;
    }
    case "image": {
      let _;
      return e[31] !== m || e[32] !== I ? (_ = /* @__PURE__ */ f(m, { ...I }), e[31] = m, e[32] = I, e[33] = _) : _ = e[33], _;
    }
    case "file": {
      let _;
      return e[34] !== w || e[35] !== I ? (_ = /* @__PURE__ */ f(w, { ...I }), e[34] = w, e[35] = I, e[36] = _) : _ = e[36], _;
    }
    case "audio": {
      let _;
      return e[37] !== b || e[38] !== I ? (_ = /* @__PURE__ */ f(b, { ...I }), e[37] = b, e[38] = I, e[39] = _) : _ = e[39], _;
    }
    case "data": {
      const _ = ((N = u == null ? void 0 : u.by_name) == null ? void 0 : N[I.name]) ?? (u == null ? void 0 : u.Fallback);
      let A;
      return e[40] !== _ || e[41] !== I ? (A = /* @__PURE__ */ f(j1, {
        ...I,
        Fallback: _
      }), e[40] = _, e[41] = I, e[42] = A) : A = e[42], A;
    }
    default:
      return console.warn(`Unknown message part type: ${y}`), null;
  }
}, q1 = (t) => {
  const e = R(5), { partIndex: n, components: r } = t;
  let i;
  e[0] !== r ? (i = /* @__PURE__ */ f(V1, { components: r }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  return e[2] !== n || e[3] !== i ? (o = /* @__PURE__ */ f(zo, {
    index: n,
    children: i
  }), e[2] = n, e[3] = i, e[4] = o) : o = e[4], o;
}, H1 = ke(q1, (t, e) => {
  var n, r, i, o, s, a, l, c, d, u, h, p, m, g, w, b, k, x;
  return t.partIndex === e.partIndex && ((n = t.components) == null ? void 0 : n.Text) === ((r = e.components) == null ? void 0 : r.Text) && ((i = t.components) == null ? void 0 : i.Reasoning) === ((o = e.components) == null ? void 0 : o.Reasoning) && ((s = t.components) == null ? void 0 : s.Source) === ((a = e.components) == null ? void 0 : a.Source) && ((l = t.components) == null ? void 0 : l.Image) === ((c = e.components) == null ? void 0 : c.Image) && ((d = t.components) == null ? void 0 : d.File) === ((u = e.components) == null ? void 0 : u.File) && ((h = t.components) == null ? void 0 : h.Unstable_Audio) === ((p = e.components) == null ? void 0 : p.Unstable_Audio) && ((m = t.components) == null ? void 0 : m.tools) === ((g = e.components) == null ? void 0 : g.tools) && ((w = t.components) == null ? void 0 : w.data) === ((b = e.components) == null ? void 0 : b.data) && ((k = t.components) == null ? void 0 : k.Group) === ((x = e.components) == null ? void 0 : x.Group);
}), W1 = (t) => {
  const e = R(6), { status: n, component: r } = t, i = n.type === "running";
  let o;
  e[0] !== r || e[1] !== n ? (o = /* @__PURE__ */ f(r, {
    type: "text",
    text: "",
    status: n
  }), e[0] = r, e[1] = n, e[2] = o) : o = e[2];
  let s;
  return e[3] !== i || e[4] !== o ? (s = /* @__PURE__ */ f(Oo, {
    text: "",
    isRunning: i,
    children: o
  }), e[3] = i, e[4] = o, e[5] = s) : s = e[5], s;
}, G1 = Object.freeze({ type: "complete" }), K1 = (t) => {
  const e = R(6), { components: n } = t, r = $(X1);
  if (n != null && n.Empty) {
    let s;
    return e[0] !== n.Empty || e[1] !== r ? (s = /* @__PURE__ */ f(n.Empty, { status: r }), e[0] = n.Empty, e[1] = r, e[2] = s) : s = e[2], s;
  }
  const i = (n == null ? void 0 : n.Text) ?? St.Text;
  let o;
  return e[3] !== r || e[4] !== i ? (o = /* @__PURE__ */ f(W1, {
    status: r,
    component: i
  }), e[3] = r, e[4] = i, e[5] = o) : o = e[5], o;
}, J1 = ke(K1, (t, e) => {
  var n, r, i, o;
  return ((n = t.components) == null ? void 0 : n.Empty) === ((r = e.components) == null ? void 0 : r.Empty) && ((i = t.components) == null ? void 0 : i.Text) === ((o = e.components) == null ? void 0 : o.Text);
}), es = (t) => {
  const e = R(9), { groupingFunction: n, components: r } = t, i = $(Z1), o = B1(n);
  let s;
  e: {
    if (i === 0) {
      let d;
      e[0] !== r ? (d = /* @__PURE__ */ f(J1, { components: r }), e[0] = r, e[1] = d) : d = e[1], s = d;
      break e;
    }
    let c;
    if (e[2] !== r || e[3] !== o) {
      let d;
      e[5] !== r ? (d = (u, h) => /* @__PURE__ */ f((r == null ? void 0 : r.Group) ?? St.Group, {
        groupKey: u.groupKey,
        indices: u.indices,
        children: u.indices.map((p) => /* @__PURE__ */ f(H1, {
          partIndex: p,
          components: r
        }, p))
      }, `group-${h}-${u.groupKey ?? "ungrouped"}`), e[5] = r, e[6] = d) : d = e[6], c = o.map(d), e[2] = r, e[3] = o, e[4] = c;
    } else
      c = e[4];
    s = c;
  }
  const a = s;
  let l;
  return e[7] !== a ? (l = /* @__PURE__ */ f(Ke, { children: a }), e[7] = a, e[8] = l) : l = e[8], l;
};
es.displayName = "MessagePrimitive.Unstable_PartsGrouped";
const ch = (t) => {
  const e = R(6);
  let n, r;
  e[0] !== t ? ({ components: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]);
  let i;
  return e[3] !== n || e[4] !== r ? (i = /* @__PURE__ */ f(es, {
    ...r,
    components: n,
    groupingFunction: F1
  }), e[3] = n, e[4] = r, e[5] = i) : i = e[5], i;
};
ch.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
function Q1(t) {
  return t.message.parts;
}
function Y1(t) {
  return t.part;
}
function X1(t) {
  return t.message.status ?? G1;
}
function Z1(t) {
  return t.message.parts.length;
}
var xn = /* @__PURE__ */ tn({
  AttachmentByIndex: () => td,
  Attachments: () => nd,
  Content: () => io,
  Error: () => lh,
  GenerativeUI: () => ju,
  GroupedParts: () => Xu,
  If: () => Id,
  PartByIndex: () => Bn,
  Parts: () => io,
  Quote: () => Zu,
  Root: () => ah,
  Unstable_PartsGrouped: () => es,
  Unstable_PartsGroupedByParentId: () => ch
});
const ek = (t) => {
  const e = R(2), n = Kt(t);
  let r;
  return e[0] !== n ? (r = (i) => {
    const o = new ResizeObserver(() => {
      n();
    }), s = new MutationObserver((a) => {
      a.some(tk) && n();
    });
    return o.observe(i), s.observe(i, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      characterData: !0
    }), () => {
      o.disconnect(), s.disconnect();
    };
  }, e[0] = n, e[1] = r) : r = e[1], nn(r);
};
function tk(t) {
  return t.type !== "attributes" || t.attributeName !== "style";
}
const nk = ({ autoScroll: t, scrollToBottomOnRunStart: e = !0, scrollToBottomOnInitialize: n = !0, scrollToBottomOnThreadSwitch: r = !0 }) => {
  const i = ne(null), o = $((T) => T.thread.messages.length > 0), s = ne(!1), a = ne(null), l = Zt();
  t === void 0 && (t = l.getState().turnAnchor !== "top");
  const c = ne(0), d = ne(0), u = ne(0), h = ne(0), p = ne(null), m = It((T) => {
    const I = i.current;
    I && (p.current = T, I.scrollTo({
      top: I.scrollHeight,
      behavior: T
    }));
  }, []), g = It((T) => {
    p.current = T, a.current !== null && cancelAnimationFrame(a.current), a.current = requestAnimationFrame(() => {
      a.current = null, m(T);
    });
  }, [m]);
  Hn(() => () => {
    a.current !== null && cancelAnimationFrame(a.current);
  }, []);
  const w = It(() => {
    const T = l.getState();
    return T.turnAnchor === "top" && T.element.viewport === i.current && T.element.anchor !== null;
  }, [l]), b = () => {
    const T = i.current;
    if (!T)
      return;
    const I = l.getState().isAtBottom, y = Math.abs(T.scrollHeight - T.scrollTop - T.clientHeight) <= 1 || T.scrollHeight <= T.clientHeight;
    !y && c.current < T.scrollTop || (y ? T.scrollHeight > T.clientHeight + 1 && (p.current = null) : c.current > T.scrollTop && d.current === T.scrollHeight && (p.current = null), (y || p.current === null) && y !== I && $r(l).setState({ isAtBottom: y })), c.current = T.scrollTop, d.current = T.scrollHeight;
  }, k = ek(() => {
    const T = i.current;
    if (!T)
      return;
    const { scrollHeight: I, clientHeight: y } = T;
    if (I === u.current && y === h.current)
      return;
    u.current = I, h.current = y;
    const M = p.current;
    M && w() ? p.current = null : M ? m(M) : t && l.getState().isAtBottom && m("instant"), b();
  }), x = nn((T) => {
    const I = () => {
      p.current = null;
    };
    return T.addEventListener("scroll", b), T.addEventListener("pointerdown", I), () => {
      T.removeEventListener("scroll", b), T.removeEventListener("pointerdown", I);
    };
  });
  return Hn(() => {
    if (n) {
      if (!o) {
        s.current = !1;
        return;
      }
      s.current || (s.current = !0, p.current === null && g("instant"));
    }
  }, [
    o,
    g,
    n
  ]), Od(({ behavior: T }) => {
    m(T);
  }), Gn("thread.runStart", () => {
    e && l.getState().turnAnchor !== "top" && g("auto");
  }), Gn("threadListItem.switchedTo", () => {
    r && g("instant");
  }), en(k, x, i);
}, uh = ie((t, e) => {
  const n = R(3);
  let r;
  return n[0] !== t || n[1] !== e ? (r = /* @__PURE__ */ f(fe.div, {
    ...t,
    ref: e
  }), n[0] = t, n[1] = e, n[2] = r) : r = n[2], r;
});
uh.displayName = "ThreadPrimitive.Root";
const dh = (t) => {
  const { children: e } = t;
  return $(rk) ? e : null;
};
dh.displayName = "ThreadPrimitive.Empty";
function rk(t) {
  return t.thread.isEmpty;
}
const ik = (t) => {
  const e = R(4);
  let n;
  return e[0] !== t.disabled || e[1] !== t.empty || e[2] !== t.running ? (n = (r) => !(t.empty === !0 && !r.thread.isEmpty || t.empty === !1 && r.thread.isEmpty || t.running === !0 && !r.thread.isRunning || t.running === !1 && r.thread.isRunning || t.disabled === !0 && !r.thread.isDisabled || t.disabled === !1 && r.thread.isDisabled), e[0] = t.disabled, e[1] = t.empty, e[2] = t.running, e[3] = n) : n = e[3], $(n);
}, hh = (t) => {
  const e = R(3);
  let n, r;
  return e[0] !== t ? ({ children: n, ...r } = t, e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]), ik(r) ? n : null;
};
hh.displayName = "ThreadPrimitive.If";
const ph = (t, e) => {
  const n = R(3);
  let r;
  return n[0] !== e || n[1] !== t ? (r = (i) => {
    if (!t)
      return;
    const o = t(), s = () => {
      const l = e ? e(i) : i.offsetHeight;
      o.setHeight(l);
    }, a = new ResizeObserver(s);
    return a.observe(i), s(), () => {
      a.disconnect(), o.unregister();
    };
  }, n[0] = e, n[1] = t, n[2] = r) : r = n[2], nn(r);
}, Ja = (t) => {
  let e = 0, n = t;
  for (; n; )
    e += n.offsetTop, n = n.offsetParent;
  return e;
}, ok = (t, e) => {
  let n = 0, r = t;
  for (; r && r !== e; )
    n += r.offsetTop, r = r.offsetParent;
  return r === e ? n : Ja(t) - Ja(e);
}, mh = ({ viewport: t, anchor: e, tallerThan: n, visibleHeight: r }) => {
  const i = ok(e, t), o = e.offsetHeight;
  return i + Math.max(0, o - (o <= n ? o : r));
}, sk = ({ scrollHeight: t, ...e }) => {
  const { viewport: n } = e, r = mh(e) + n.clientHeight;
  return Math.max(0, r - t);
}, ak = ({ viewport: t, reserve: e, ...n }) => sk({
  viewport: t,
  ...n,
  scrollHeight: t.scrollHeight - e.offsetHeight
}), lk = (t) => {
  const e = new ResizeObserver(t), n = new MutationObserver(t);
  let r = null, i = null, o = null;
  const s = () => {
    e.disconnect(), n.disconnect(), r = null, i = null, o = null;
  };
  return {
    target: (a, l, c) => {
      r === a && i === l && o === c || (s(), e.observe(a), e.observe(l), e.observe(c), n.observe(c, {
        childList: !0,
        subtree: !0,
        characterData: !0
      }), r = a, i = l, o = c);
    },
    disconnect: s
  };
}, ck = (t) => {
  let e = null;
  return {
    schedule: () => {
      e === null && (e = requestAnimationFrame(() => {
        e = null, t();
      }));
    },
    cancel: () => {
      e !== null && (cancelAnimationFrame(e), e = null);
    }
  };
}, uk = (t) => {
  let e = null, n;
  function r() {
    const a = t.getState(), { viewport: l, anchor: c, target: d } = a.element, u = a.targetConfig;
    if (a.turnAnchor !== "top" || !l || !c || !d || !u) {
      o.disconnect(), e && (Ka(e, 0), e.remove());
      return;
    }
    if (e ?? (e = I1()), (e.parentElement !== d.parentElement || e.previousElementSibling !== d) && d.after(e), o.target(l, c, d), Ka(e, ak({
      viewport: l,
      anchor: c,
      reserve: e,
      ...u
    }))) {
      i.schedule();
      return;
    }
    const h = T1(c);
    if (h !== void 0 && n === h)
      return;
    const p = A1(mh({
      viewport: l,
      anchor: c,
      ...u
    }));
    Math.abs(l.scrollTop - p) > 1 && l.scrollTo({
      top: p,
      behavior: "smooth"
    }), h !== void 0 && (n = h);
  }
  const i = ck(r), o = lk(i.schedule);
  i.schedule();
  const s = t.subscribe(i.schedule);
  return () => {
    i.cancel(), s(), o.disconnect(), e == null || e.remove();
  };
}, dk = (t) => {
  const e = R(4), n = Zt();
  let r, i;
  e[0] !== t || e[1] !== n ? (r = () => {
    if (t)
      return uk(n);
  }, i = [t, n], e[0] = t, e[1] = n, e[2] = r, e[3] = i) : (r = e[2], i = e[3]), Hn(r, i);
}, fh = ({ isRunning: t, messages: e }) => {
  if (!t)
    return null;
  const n = e.at(-1), r = e.at(-2);
  return (r == null ? void 0 : r.role) !== "user" || (n == null ? void 0 : n.role) !== "assistant" ? null : {
    anchorId: r.id,
    targetId: n.id
  };
}, hk = (t) => {
  var e;
  return (e = fh(t)) == null ? void 0 : e.anchorId;
}, pk = (t) => {
  var e;
  return (e = fh(t)) == null ? void 0 : e.targetId;
}, mk = () => ph(Xt(bk), vk), fk = () => nn(Xt(wk)), gk = (t) => {
  const e = R(13), n = Zt();
  let r;
  e[0] !== t ? (r = (p) => {
    if (t)
      return hk(p.thread);
  }, e[0] = t, e[1] = r) : r = e[1];
  const i = $(r);
  let o;
  e[2] !== t ? (o = (p) => {
    if (t)
      return pk(p.thread);
  }, e[2] = t, e[3] = o) : o = e[3];
  const s = $(o);
  let a;
  e: {
    if (!i || !s) {
      a = null;
      break e;
    }
    let p;
    e[4] !== i || e[5] !== s ? (p = {
      anchorId: i,
      targetId: s
    }, e[4] = i, e[5] = s, e[6] = p) : p = e[6], a = p;
  }
  const l = a;
  let c, d;
  e[7] !== l || e[8] !== n ? (c = () => {
    if (!l)
      return;
    const p = n.getState(), m = p.topAnchorTurn;
    (m == null ? void 0 : m.anchorId) === l.anchorId && m.targetId === l.targetId || p.setTopAnchorTurn(l);
  }, d = [l, n], e[7] = l, e[8] = n, e[9] = c, e[10] = d) : (c = e[9], d = e[10]), Hn(c, d);
  let u;
  e[11] !== n ? (u = () => {
    n.getState().setTopAnchorTurn(null);
  }, e[11] = n, e[12] = u) : u = e[12];
  const h = u;
  Gn("thread.initialize", h), Gn("threadListItem.switchedTo", h);
}, gh = ie((t, e) => {
  const n = R(18);
  let r, i, o, s, a, l;
  n[0] !== t ? ({ autoScroll: r, scrollToBottomOnRunStart: a, scrollToBottomOnInitialize: s, scrollToBottomOnThreadSwitch: l, children: i, ...o } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o, n[4] = s, n[5] = a, n[6] = l) : (r = n[1], i = n[2], o = n[3], s = n[4], a = n[5], l = n[6]);
  let c;
  n[7] !== r || n[8] !== s || n[9] !== a || n[10] !== l ? (c = {
    autoScroll: r,
    scrollToBottomOnRunStart: a,
    scrollToBottomOnInitialize: s,
    scrollToBottomOnThreadSwitch: l
  }, n[7] = r, n[8] = s, n[9] = a, n[10] = l, n[11] = c) : c = n[11];
  const d = nk(c), u = mk(), h = fk(), p = Zt();
  let m;
  n[12] !== p ? (m = p.getState(), n[12] = p, n[13] = m) : m = n[13];
  const g = m.turnAnchor === "top";
  gk(g), dk(g);
  const w = en(e, d, u, h);
  let b;
  return n[14] !== i || n[15] !== w || n[16] !== o ? (b = /* @__PURE__ */ f(fe.div, {
    ...o,
    ref: w,
    children: i
  }), n[14] = i, n[15] = w, n[16] = o, n[17] = b) : b = n[17], b;
});
gh.displayName = "ThreadPrimitive.ViewportScrollable";
const bh = ie((t, e) => {
  const n = R(13);
  let r, i, o;
  n[0] !== t ? ({ turnAnchor: o, topAnchorMessageClamp: i, ...r } = t, n[0] = t, n[1] = r, n[2] = i, n[3] = o) : (r = n[1], i = n[2], o = n[3]);
  let s;
  n[4] !== i || n[5] !== o ? (s = {
    turnAnchor: o,
    topAnchorMessageClamp: i
  }, n[4] = i, n[5] = o, n[6] = s) : s = n[6];
  let a;
  n[7] !== r || n[8] !== e ? (a = /* @__PURE__ */ f(gh, {
    ...r,
    ref: e
  }), n[7] = r, n[8] = e, n[9] = a) : a = n[9];
  let l;
  return n[10] !== s || n[11] !== a ? (l = /* @__PURE__ */ f(Wo, {
    options: s,
    children: a
  }), n[10] = s, n[11] = a, n[12] = l) : l = n[12], l;
});
bh.displayName = "ThreadPrimitive.Viewport";
function bk(t) {
  return t.registerViewport;
}
function vk(t) {
  return t.clientHeight;
}
function wk(t) {
  return t.registerViewportElement;
}
const vh = ie((t, e) => {
  const n = R(3), r = en(e, ph(Xt(yk), xk));
  let i;
  return n[0] !== t || n[1] !== r ? (i = /* @__PURE__ */ f(fe.div, {
    ...t,
    ref: r
  }), n[0] = t, n[1] = r, n[2] = i) : i = n[2], i;
});
vh.displayName = "ThreadPrimitive.ViewportFooter";
function yk(t) {
  return t.registerContentInset;
}
function xk(t) {
  const e = parseFloat(getComputedStyle(t).marginTop) || 0;
  return t.offsetHeight + e;
}
const kk = (t) => {
  const e = R(5);
  let n;
  e[0] !== t ? (n = t === void 0 ? {} : t, e[0] = t, e[1] = n) : n = e[1];
  const { behavior: r } = n, i = Xt(Sk), o = Zt();
  let s;
  e[2] !== r || e[3] !== o ? (s = () => {
    o.getState().scrollToBottom({ behavior: r });
  }, e[2] = r, e[3] = o, e[4] = s) : s = e[4];
  const a = s;
  return i ? null : a;
}, _k = at("ThreadPrimitive.ScrollToBottom", kk, ["behavior"]);
function Sk(t) {
  return t.isAtBottom;
}
const Ck = (t) => {
  const e = R(4), { prompt: n, send: r, clearComposer: i, autoSend: o } = t, s = r ?? o ?? !1;
  let a;
  e[0] !== i || e[1] !== n || e[2] !== s ? (a = {
    prompt: n,
    send: s,
    clearComposer: i
  }, e[0] = i, e[1] = n, e[2] = s, e[3] = a) : a = e[3];
  const { disabled: l, trigger: c } = Xy(a);
  return l ? null : c;
}, Tk = at("ThreadPrimitive.Suggestion", Ck, [
  "prompt",
  "send",
  "clearComposer",
  "autoSend",
  "method"
]);
var fn = /* @__PURE__ */ tn({
  Empty: () => dh,
  If: () => hh,
  MessageByIndex: () => Ou,
  Messages: () => _w,
  Root: () => uh,
  ScrollToBottom: () => _k,
  Suggestion: () => Tk,
  SuggestionByIndex: () => ld,
  Suggestions: () => xy,
  Unstable_MessageById: () => $u,
  Viewport: () => bh,
  ViewportFooter: () => vh,
  ViewportProvider: () => Wo
});
const Ik = () => {
  const t = R(7), e = Z().part.source !== null;
  let n;
  t[0] !== e ? (n = (u) => e && u.part.type === "tool-call" ? u.part.timing : void 0, t[0] = e, t[1] = n) : n = t[1];
  const r = $(n);
  let i;
  t[2] !== e ? (i = (u) => e && u.part.type === "tool-call" && u.part.status.type === "running", t[2] = e, t[3] = i) : i = t[3];
  const o = $(i), s = r !== void 0 && r.completedAt === void 0 && o, [a, l] = xe(Ak);
  let c, d;
  if (t[4] !== s ? (c = () => {
    if (!s)
      return;
    l(Date.now());
    const u = setInterval(() => l(Date.now()), 1e3);
    return () => clearInterval(u);
  }, d = [s], t[4] = s, t[5] = c, t[6] = d) : (c = t[5], d = t[6]), Y(c, d), r !== void 0) {
    if (r.completedAt !== void 0)
      return Math.max(0, r.completedAt - r.startedAt);
    if (s)
      return Math.max(0, a - r.startedAt);
  }
};
function Ak() {
  return Date.now();
}
var Ek = /* @__PURE__ */ tn({
  AssistantRuntimeImpl: () => Fo,
  BaseAssistantRuntimeCore: () => Bo,
  CompositeContextProvider: () => Mo,
  DefaultThreadComposerRuntimeCore: () => Tu,
  MessageRepository: () => Su,
  ThreadRuntimeImpl: () => yu,
  getAutoStatus: () => Yi,
  splitLocalRuntimeOptions: () => ax,
  useComposerInputPluginRegistryOptional: () => ri,
  useSmooth: () => rh,
  useSmoothStatus: () => x1,
  withSmoothContextProvider: () => y1
});
function Rk(t) {
  const { commands: e, removeOnExecute: n } = t, r = ne(e);
  return r.current = e, de(() => ({
    adapter: {
      categories: () => [],
      categoryItems: () => [],
      search: (i) => {
        const o = i.toLowerCase();
        return r.current.filter((s) => Pk(s, o)).map(Mk);
      }
    },
    action: {
      onExecute: (i) => {
        var o;
        (o = r.current.find((s) => s.id === i.id)) == null || o.execute();
      },
      ...n !== void 0 ? { removeOnExecute: n } : {}
    },
    ...t.iconMap ? { iconMap: t.iconMap } : {},
    ...t.fallbackIcon ? { fallbackIcon: t.fallbackIcon } : {}
  }), [
    n,
    t.iconMap,
    t.fallbackIcon
  ]);
}
function Mk(t) {
  return {
    id: t.id,
    type: "command",
    label: t.label ?? `/${t.id}`,
    ...t.description !== void 0 ? { description: t.description } : {},
    ...t.icon !== void 0 ? { metadata: { icon: t.icon } } : {}
  };
}
function Pk(t, e) {
  var n, r;
  return !!(!e || t.id.toLowerCase().includes(e) || (n = t.label) != null && n.toLowerCase().includes(e) || (r = t.description) != null && r.toLowerCase().includes(e));
}
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nk = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Dk = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, r) => r ? r.toUpperCase() : n.toLowerCase()
), Qa = (t) => {
  const e = Dk(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
}, wh = (...t) => t.filter((e, n, r) => !!e && e.trim() !== "" && r.indexOf(e) === n).join(" ").trim(), Lk = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
};
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var zk = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ok = ie(
  ({
    color: t = "currentColor",
    size: e = 24,
    strokeWidth: n = 2,
    absoluteStrokeWidth: r,
    className: i = "",
    children: o,
    iconNode: s,
    ...a
  }, l) => Et(
    "svg",
    {
      ref: l,
      ...zk,
      width: e,
      height: e,
      stroke: t,
      strokeWidth: r ? Number(n) * 24 / Number(e) : n,
      className: wh("lucide", i),
      ...!o && !Lk(a) && { "aria-hidden": "true" },
      ...a
    },
    [
      ...s.map(([c, d]) => Et(c, d)),
      ...Array.isArray(o) ? o : [o]
    ]
  )
);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ie = (t, e) => {
  const n = ie(
    ({ className: r, ...i }, o) => Et(Ok, {
      ref: o,
      iconNode: e,
      className: wh(
        `lucide-${Nk(Qa(t))}`,
        `lucide-${t}`,
        r
      ),
      ...i
    })
  );
  return n.displayName = Qa(t), n;
};
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $k = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
], Fk = Ie("arrow-down", $k);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bk = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
], Uk = Ie("arrow-up", Bk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jk = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
], ts = Ie("bot", jk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vk = [
  ["path", { d: "M12 18V5", key: "adv99a" }],
  ["path", { d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4", key: "1e3is1" }],
  ["path", { d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5", key: "1gqd8o" }],
  ["path", { d: "M17.997 5.125a4 4 0 0 1 2.526 5.77", key: "iwvgf7" }],
  ["path", { d: "M18 18a4 4 0 0 0 2-7.464", key: "efp6ie" }],
  ["path", { d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517", key: "1gq6am" }],
  ["path", { d: "M6 18a4 4 0 0 1-2-7.464", key: "k1g0md" }],
  ["path", { d: "M6.003 5.125a4 4 0 0 0-2.526 5.77", key: "q97ue3" }]
], yh = Ie("brain", Vk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qk = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], ns = Ie("check", qk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hk = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], rs = Ie("chevron-down", Hk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wk = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]], Gk = Ie("chevron-right", Wk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kk = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], xh = Ie("circle-alert", Kk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jk = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
], Qk = Ie("circle-x", Jk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yk = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
], kh = Ie("copy", Yk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xk = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
], Zk = Ie("file-text", Xk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const e_ = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], _h = Ie("loader-circle", e_);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const t_ = [
  ["path", { d: "M12 2v4", key: "3427ic" }],
  ["path", { d: "m16.2 7.8 2.9-2.9", key: "r700ao" }],
  ["path", { d: "M18 12h4", key: "wj9ykh" }],
  ["path", { d: "m16.2 16.2 2.9 2.9", key: "1bxg5t" }],
  ["path", { d: "M12 18v4", key: "jadmvz" }],
  ["path", { d: "m4.9 19.1 2.9-2.9", key: "bwix9q" }],
  ["path", { d: "M2 12h4", key: "j09sii" }],
  ["path", { d: "m4.9 4.9 2.9 2.9", key: "giyufr" }]
], Sh = Ie("loader", t_);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const n_ = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], r_ = Ie("plus", n_);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const i_ = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], o_ = Ie("refresh-cw", i_);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const s_ = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
], a_ = Ie("rotate-ccw", s_);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const l_ = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
], c_ = Ie("square", l_);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const u_ = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], d_ = Ie("x", u_);
function Ch(t) {
  var e, n, r = "";
  if (typeof t == "string" || typeof t == "number")
    r += t;
  else if (typeof t == "object")
    if (Array.isArray(t)) {
      var i = t.length;
      for (e = 0; e < i; e++)
        t[e] && (n = Ch(t[e])) && (r && (r += " "), r += n);
    } else
      for (n in t)
        t[n] && (r && (r += " "), r += n);
  return r;
}
function Th() {
  for (var t, e, n = 0, r = "", i = arguments.length; n < i; n++)
    (t = arguments[n]) && (e = Ch(t)) && (r && (r += " "), r += e);
  return r;
}
const h_ = (t, e) => {
  const n = new Array(t.length + e.length);
  for (let r = 0; r < t.length; r++)
    n[r] = t[r];
  for (let r = 0; r < e.length; r++)
    n[t.length + r] = e[r];
  return n;
}, p_ = (t, e) => ({
  classGroupId: t,
  validator: e
}), Ih = (t = /* @__PURE__ */ new Map(), e = null, n) => ({
  nextPart: t,
  validators: e,
  classGroupId: n
}), Br = "-", Ya = [], m_ = "arbitrary..", f_ = (t) => {
  const e = b_(t), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: r
  } = t;
  return {
    getClassGroupId: (s) => {
      if (s.startsWith("[") && s.endsWith("]"))
        return g_(s);
      const a = s.split(Br), l = a[0] === "" && a.length > 1 ? 1 : 0;
      return Ah(a, l, e);
    },
    getConflictingClassGroupIds: (s, a) => {
      if (a) {
        const l = r[s], c = n[s];
        return l ? c ? h_(c, l) : l : c || Ya;
      }
      return n[s] || Ya;
    }
  };
}, Ah = (t, e, n) => {
  if (t.length - e === 0)
    return n.classGroupId;
  const i = t[e], o = n.nextPart.get(i);
  if (o) {
    const c = Ah(t, e + 1, o);
    if (c)
      return c;
  }
  const s = n.validators;
  if (s === null)
    return;
  const a = e === 0 ? t.join(Br) : t.slice(e).join(Br), l = s.length;
  for (let c = 0; c < l; c++) {
    const d = s[c];
    if (d.validator(a))
      return d.classGroupId;
  }
}, g_ = (t) => t.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const e = t.slice(1, -1), n = e.indexOf(":"), r = e.slice(0, n);
  return r ? m_ + r : void 0;
})(), b_ = (t) => {
  const {
    theme: e,
    classGroups: n
  } = t;
  return v_(n, e);
}, v_ = (t, e) => {
  const n = Ih();
  for (const r in t) {
    const i = t[r];
    is(i, n, r, e);
  }
  return n;
}, is = (t, e, n, r) => {
  const i = t.length;
  for (let o = 0; o < i; o++) {
    const s = t[o];
    w_(s, e, n, r);
  }
}, w_ = (t, e, n, r) => {
  if (typeof t == "string") {
    y_(t, e, n);
    return;
  }
  if (typeof t == "function") {
    x_(t, e, n, r);
    return;
  }
  k_(t, e, n, r);
}, y_ = (t, e, n) => {
  const r = t === "" ? e : Eh(e, t);
  r.classGroupId = n;
}, x_ = (t, e, n, r) => {
  if (__(t)) {
    is(t(r), e, n, r);
    return;
  }
  e.validators === null && (e.validators = []), e.validators.push(p_(n, t));
}, k_ = (t, e, n, r) => {
  const i = Object.entries(t), o = i.length;
  for (let s = 0; s < o; s++) {
    const [a, l] = i[s];
    is(l, Eh(e, a), n, r);
  }
}, Eh = (t, e) => {
  let n = t;
  const r = e.split(Br), i = r.length;
  for (let o = 0; o < i; o++) {
    const s = r[o];
    let a = n.nextPart.get(s);
    a || (a = Ih(), n.nextPart.set(s, a)), n = a;
  }
  return n;
}, __ = (t) => "isThemeGetter" in t && t.isThemeGetter === !0, S_ = (t) => {
  if (t < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let e = 0, n = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  const i = (o, s) => {
    n[o] = s, e++, e > t && (e = 0, r = n, n = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(o) {
      let s = n[o];
      if (s !== void 0)
        return s;
      if ((s = r[o]) !== void 0)
        return i(o, s), s;
    },
    set(o, s) {
      o in n ? n[o] = s : i(o, s);
    }
  };
}, oo = "!", Xa = ":", C_ = [], Za = (t, e, n, r, i) => ({
  modifiers: t,
  hasImportantModifier: e,
  baseClassName: n,
  maybePostfixModifierPosition: r,
  isExternal: i
}), T_ = (t) => {
  const {
    prefix: e,
    experimentalParseClassName: n
  } = t;
  let r = (i) => {
    const o = [];
    let s = 0, a = 0, l = 0, c;
    const d = i.length;
    for (let g = 0; g < d; g++) {
      const w = i[g];
      if (s === 0 && a === 0) {
        if (w === Xa) {
          o.push(i.slice(l, g)), l = g + 1;
          continue;
        }
        if (w === "/") {
          c = g;
          continue;
        }
      }
      w === "[" ? s++ : w === "]" ? s-- : w === "(" ? a++ : w === ")" && a--;
    }
    const u = o.length === 0 ? i : i.slice(l);
    let h = u, p = !1;
    u.endsWith(oo) ? (h = u.slice(0, -1), p = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      u.startsWith(oo) && (h = u.slice(1), p = !0)
    );
    const m = c && c > l ? c - l : void 0;
    return Za(o, p, h, m);
  };
  if (e) {
    const i = e + Xa, o = r;
    r = (s) => s.startsWith(i) ? o(s.slice(i.length)) : Za(C_, !1, s, void 0, !0);
  }
  if (n) {
    const i = r;
    r = (o) => n({
      className: o,
      parseClassName: i
    });
  }
  return r;
}, I_ = (t) => {
  const e = /* @__PURE__ */ new Map();
  return t.orderSensitiveModifiers.forEach((n, r) => {
    e.set(n, 1e6 + r);
  }), (n) => {
    const r = [];
    let i = [];
    for (let o = 0; o < n.length; o++) {
      const s = n[o], a = s[0] === "[", l = e.has(s);
      a || l ? (i.length > 0 && (i.sort(), r.push(...i), i = []), r.push(s)) : i.push(s);
    }
    return i.length > 0 && (i.sort(), r.push(...i)), r;
  };
}, A_ = (t) => ({
  cache: S_(t.cacheSize),
  parseClassName: T_(t),
  sortModifiers: I_(t),
  postfixLookupClassGroupIds: E_(t),
  ...f_(t)
}), E_ = (t) => {
  const e = /* @__PURE__ */ Object.create(null), n = t.postfixLookupClassGroups;
  if (n)
    for (let r = 0; r < n.length; r++)
      e[n[r]] = !0;
  return e;
}, R_ = /\s+/, M_ = (t, e) => {
  const {
    parseClassName: n,
    getClassGroupId: r,
    getConflictingClassGroupIds: i,
    sortModifiers: o,
    postfixLookupClassGroupIds: s
  } = e, a = [], l = t.trim().split(R_);
  let c = "";
  for (let d = l.length - 1; d >= 0; d -= 1) {
    const u = l[d], {
      isExternal: h,
      modifiers: p,
      hasImportantModifier: m,
      baseClassName: g,
      maybePostfixModifierPosition: w
    } = n(u);
    if (h) {
      c = u + (c.length > 0 ? " " + c : c);
      continue;
    }
    let b = !!w, k;
    if (b) {
      const M = g.substring(0, w);
      k = r(M);
      const E = k && s[k] ? r(g) : void 0;
      E && E !== k && (k = E, b = !1);
    } else
      k = r(g);
    if (!k) {
      if (!b) {
        c = u + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (k = r(g), !k) {
        c = u + (c.length > 0 ? " " + c : c);
        continue;
      }
      b = !1;
    }
    const x = p.length === 0 ? "" : p.length === 1 ? p[0] : o(p).join(":"), T = m ? x + oo : x, I = T + k;
    if (a.indexOf(I) > -1)
      continue;
    a.push(I);
    const y = i(k, b);
    for (let M = 0; M < y.length; ++M) {
      const E = y[M];
      a.push(T + E);
    }
    c = u + (c.length > 0 ? " " + c : c);
  }
  return c;
}, P_ = (...t) => {
  let e = 0, n, r, i = "";
  for (; e < t.length; )
    (n = t[e++]) && (r = Rh(n)) && (i && (i += " "), i += r);
  return i;
}, Rh = (t) => {
  if (typeof t == "string")
    return t;
  let e, n = "";
  for (let r = 0; r < t.length; r++)
    t[r] && (e = Rh(t[r])) && (n && (n += " "), n += e);
  return n;
}, N_ = (t, ...e) => {
  let n, r, i, o;
  const s = (l) => {
    const c = e.reduce((d, u) => u(d), t());
    return n = A_(c), r = n.cache.get, i = n.cache.set, o = a, a(l);
  }, a = (l) => {
    const c = r(l);
    if (c)
      return c;
    const d = M_(l, n);
    return i(l, d), d;
  };
  return o = s, (...l) => o(P_(...l));
}, D_ = [], Te = (t) => {
  const e = (n) => n[t] || D_;
  return e.isThemeGetter = !0, e;
}, Mh = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Ph = /^\((?:(\w[\w-]*):)?(.+)\)$/i, L_ = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, z_ = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, O_ = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, $_ = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, F_ = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, B_ = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, kt = (t) => L_.test(t), oe = (t) => !!t && !Number.isNaN(Number(t)), ct = (t) => !!t && Number.isInteger(Number(t)), Ci = (t) => t.endsWith("%") && oe(t.slice(0, -1)), wt = (t) => z_.test(t), Nh = () => !0, U_ = (t) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  O_.test(t) && !$_.test(t)
), os = () => !1, j_ = (t) => F_.test(t), V_ = (t) => B_.test(t), q_ = (t) => !H(t) && !W(t), H_ = (t) => t.startsWith("@container") && (t[10] === "/" && t[11] !== void 0 || t[11] === "s" && t[16] !== void 0 && t.startsWith("-size/", 10) || t[11] === "n" && t[18] !== void 0 && t.startsWith("-normal/", 10)), W_ = (t) => Pt(t, zh, os), H = (t) => Mh.test(t), Ot = (t) => Pt(t, Oh, U_), el = (t) => Pt(t, eS, oe), G_ = (t) => Pt(t, Fh, Nh), K_ = (t) => Pt(t, $h, os), tl = (t) => Pt(t, Dh, os), J_ = (t) => Pt(t, Lh, V_), vr = (t) => Pt(t, Bh, j_), W = (t) => Ph.test(t), Ln = (t) => rn(t, Oh), Q_ = (t) => rn(t, $h), nl = (t) => rn(t, Dh), Y_ = (t) => rn(t, zh), X_ = (t) => rn(t, Lh), wr = (t) => rn(t, Bh, !0), Z_ = (t) => rn(t, Fh, !0), Pt = (t, e, n) => {
  const r = Mh.exec(t);
  return r ? r[1] ? e(r[1]) : n(r[2]) : !1;
}, rn = (t, e, n = !1) => {
  const r = Ph.exec(t);
  return r ? r[1] ? e(r[1]) : n : !1;
}, Dh = (t) => t === "position" || t === "percentage", Lh = (t) => t === "image" || t === "url", zh = (t) => t === "length" || t === "size" || t === "bg-size", Oh = (t) => t === "length", eS = (t) => t === "number", $h = (t) => t === "family-name", Fh = (t) => t === "number" || t === "weight", Bh = (t) => t === "shadow", tS = () => {
  const t = Te("color"), e = Te("font"), n = Te("text"), r = Te("font-weight"), i = Te("tracking"), o = Te("leading"), s = Te("breakpoint"), a = Te("container"), l = Te("spacing"), c = Te("radius"), d = Te("shadow"), u = Te("inset-shadow"), h = Te("text-shadow"), p = Te("drop-shadow"), m = Te("blur"), g = Te("perspective"), w = Te("aspect"), b = Te("ease"), k = Te("animate"), x = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], T = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], I = () => [...T(), W, H], y = () => ["auto", "hidden", "clip", "visible", "scroll"], M = () => ["auto", "contain", "none"], E = () => [W, H, l], N = () => [kt, "full", "auto", ...E()], _ = () => [ct, "none", "subgrid", W, H], A = () => ["auto", {
    span: ["full", ct, W, H]
  }, ct, W, H], P = () => [ct, "auto", W, H], D = () => ["auto", "min", "max", "fr", W, H], O = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], z = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], V = () => ["auto", ...E()], G = () => [kt, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...E()], F = () => [kt, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...E()], B = () => [kt, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...E()], v = () => [t, W, H], Q = () => [...T(), nl, tl, {
    position: [W, H]
  }], ee = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], S = () => ["auto", "cover", "contain", Y_, W_, {
    size: [W, H]
  }], pe = () => [Ci, Ln, Ot], he = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    c,
    W,
    H
  ], ce = () => ["", oe, Ln, Ot], lt = () => ["solid", "dashed", "dotted", "double"], Ze = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ye = () => [oe, Ci, nl, tl], ft = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    m,
    W,
    H
  ], gt = () => ["none", oe, W, H], an = () => ["none", oe, W, H], En = () => [oe, W, H], ln = () => [kt, "full", ...E()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [wt],
      breakpoint: [wt],
      color: [Nh],
      container: [wt],
      "drop-shadow": [wt],
      ease: ["in", "out", "in-out"],
      font: [q_],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [wt],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [wt],
      shadow: [wt],
      spacing: ["px", oe],
      text: [wt],
      "text-shadow": [wt],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", kt, H, W, w]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Container Type
       * @see https://tailwindcss.com/docs/responsive-design#container-queries
       */
      "container-type": [{
        "@container": ["", "normal", "size", W, H]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [H_],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [oe, H, W, a]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": x()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": x()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: I()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: y()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": y()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": y()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: M()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": M()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": M()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: N()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": N()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": N()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": N(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: N()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": N(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: N()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": N()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": N()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: N()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: N()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: N()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: N()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [ct, "auto", W, H]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [kt, "full", "auto", a, ...E()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [oe, kt, "auto", "initial", "none", H]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", oe, W, H]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", oe, W, H]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [ct, "first", "last", "none", W, H]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": _()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: A()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": P()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": P()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": _()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: A()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": P()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": P()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": D()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": D()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: E()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": E()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": E()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...O(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...z(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...z()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...O()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...z(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...z(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": O()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...z(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...z()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: E()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: E()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: E()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: E()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: E()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: E()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: E()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: E()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: E()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: E()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: E()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: V()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: V()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: V()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: V()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: V()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: V()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: V()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: V()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: V()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: V()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: V()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": E()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": E()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: G()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...F()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...F()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...F()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...B()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...B()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...B()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [a, "screen", ...G()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          a,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...G()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          a,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [s]
          },
          ...G()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...G()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...G()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...G()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", n, Ln, Ot]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [r, Z_, G_]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Ci, H]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Q_, K_, e]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [H]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [i, W, H]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [oe, "none", W, el]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          o,
          ...E()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", W, H]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", W, H]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: v()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: v()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...lt(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [oe, "from-font", "auto", W, Ot]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: v()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [oe, "auto", W, H]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: E()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [ct, W, H]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", W, H]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", W, H]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: Q()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ee()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: S()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, ct, W, H],
          radial: ["", W, H],
          conic: [ct, W, H]
        }, X_, J_]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: v()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: pe()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: pe()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: pe()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: v()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: v()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: v()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: he()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": he()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": he()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": he()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": he()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": he()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": he()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": he()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": he()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": he()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": he()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": he()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": he()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": he()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": he()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: ce()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": ce()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": ce()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": ce()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": ce()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": ce()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": ce()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": ce()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": ce()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": ce()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": ce()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": ce()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": ce()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...lt(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...lt(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: v()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": v()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": v()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": v()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": v()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": v()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": v()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": v()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": v()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": v()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": v()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: v()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...lt(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [oe, W, H]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", oe, Ln, Ot]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: v()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          d,
          wr,
          vr
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: v()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", u, wr, vr]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": v()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: ce()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: v()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [oe, Ot]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": v()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": ce()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": v()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", h, wr, vr]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": v()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [oe, W, H]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Ze(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Ze()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [oe]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": ye()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": ye()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": v()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": v()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": ye()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": ye()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": v()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": v()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": ye()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": ye()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": v()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": v()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": ye()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": ye()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": v()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": v()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": ye()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": ye()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": v()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": v()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": ye()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": ye()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": v()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": v()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": ye()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": ye()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": v()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": v()
      }],
      "mask-image-radial": [{
        "mask-radial": [W, H]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": ye()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": ye()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": v()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": v()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": T()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [oe]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": ye()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": ye()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": v()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": v()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: Q()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: ee()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: S()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", W, H]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          W,
          H
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: ft()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [oe, W, H]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [oe, W, H]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          p,
          wr,
          vr
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": v()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", oe, W, H]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [oe, W, H]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", oe, W, H]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [oe, W, H]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", oe, W, H]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          W,
          H
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": ft()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [oe, W, H]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [oe, W, H]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", oe, W, H]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [oe, W, H]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", oe, W, H]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [oe, W, H]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [oe, W, H]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", oe, W, H]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": E()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": E()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": E()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", W, H]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [oe, "initial", W, H]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", b, W, H]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [oe, W, H]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", k, W, H]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [g, W, H]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": I()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: gt()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": gt()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": gt()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": gt()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: an()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": an()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": an()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": an()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: En()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": En()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": En()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [W, H, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: I()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: ln()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": ln()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": ln()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": ln()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      /**
       * Zoom
       * @see https://tailwindcss.com/docs/zoom
       */
      zoom: [{
        zoom: [ct, W, H]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: v()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: v()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", W, H]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scrollbar Thumb Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-thumb-color": [{
        "scrollbar-thumb": v()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": v()
      }],
      /**
       * Scrollbar Gutter
       * @see https://tailwindcss.com/docs/scrollbar-gutter
       */
      "scrollbar-gutter": [{
        "scrollbar-gutter": ["auto", "stable", "both"]
      }],
      /**
       * Scrollbar Width
       * @see https://tailwindcss.com/docs/scrollbar-width
       */
      "scrollbar-w": [{
        scrollbar: ["auto", "thin", "none"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": E()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": E()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": E()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": E()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": E()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": E()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": E()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": E()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": E()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": E()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": E()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": E()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": E()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": E()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": E()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": E()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": E()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": E()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": E()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": E()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": E()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": E()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", W, H]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...v()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [oe, Ln, Ot, el]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...v()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      "container-named": ["container-type"],
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    postfixLookupClassGroups: ["container-type"],
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, nS = /* @__PURE__ */ N_(tS);
function K(...t) {
  return nS(Th(t));
}
const rS = window.UIComponents.Tooltip, iS = window.UIComponents.TooltipContent, oS = window.UIComponents.TooltipProvider, sS = window.UIComponents.TooltipTrigger, aS = window.UIComponents.Button, on = ie(({ children: t, tooltip: e, side: n = "bottom", className: r, ...i }, o) => /* @__PURE__ */ f(oS, { delayDuration: 0, children: /* @__PURE__ */ j(rS, { children: [
  /* @__PURE__ */ f(sS, { asChild: !0, children: /* @__PURE__ */ j(
    aS,
    {
      variant: "ghost",
      size: "icon",
      ...i,
      className: K("aui-button-icon size-6 p-1 active:scale-90", r),
      ref: o,
      children: [
        /* @__PURE__ */ f(kx, { children: t }),
        /* @__PURE__ */ f("span", { className: "aui-sr-only sr-only", children: e })
      ]
    }
  ) }),
  /* @__PURE__ */ f(iS, { side: n, children: e })
] }) }));
on.displayName = "TooltipIconButton";
const lS = {
  "New chat": "Новый чат",
  "Model & context": "Модель и контекст",
  Limits: "Лимиты",
  Model: "Модель",
  "Select model": "Выбор модели",
  turn: "ход",
  turns: "ходов",
  "Context usage": "Использование контекста",
  "Context: {used} of {total} tokens ({pct}%)": "Контекст: {used} из {total} токенов ({pct}%)",
  "Loading…": "Загрузка…",
  Retry: "Повторить",
  "{pct} used": "использовано {pct}",
  "{pct} of daily budget left": "осталось {pct} дневного бюджета",
  "No daily budget cap": "Дневной бюджет не ограничен",
  "Session ({duration})": "Сессия ({duration})",
  "Daily ({duration})": "День ({duration})",
  "1 day": "1 день",
  "Resets in {duration}": "Сброс через {duration}",
  "Resetting…": "Сброс…",
  "The assistant is over its budget. It will work again after the window resets.": "Ассистент превысил бюджет. Он снова заработает после сброса окна.",
  "resets {time}": "сброс в {time}",
  "daily resets {time}": "дневной сброс в {time}",
  "{duration} burst: {pct} of daily": "окно {duration}: {pct} от дневного",
  "{duration} burst limit": "лимит окна {duration}",
  "The {duration} window caps how much can be spent in any {duration} span; it resets independently of the daily budget.": "Окно {duration} ограничивает трату за любой промежуток в {duration}; сбрасывается независимо от дневного бюджета.",
  "Refresh limits": "Обновить лимиты",
  "Waiting for the next registration slot": "Ожидание следующего окна регистрации",
  "Registration attempt failed": "Попытка регистрации не удалась",
  "Server setup required": "Требуется завершить настройку сервера",
  "Connecting the assistant…": "Подключение ассистента…",
  "The assistant registers itself with the LLM gateway. The broker issues at most one key per hour, so this can take a while — the page keeps retrying automatically.": "Ассистент регистрируется на LLM-шлюзе. Брокер выдаёт не более одного ключа в час, поэтому это может занять время — страница повторяет попытки автоматически.",
  "Set the PROJECT_NAME setting to finish the server setup — the assistant needs it to register.": "Заполните настройку PROJECT_NAME, чтобы завершить настройку сервера — она нужна ассистенту для регистрации.",
  "Next attempt at": "Следующая попытка в",
  "Failed to load agent info": "Не удалось загрузить данные агента",
  "Failed to check the assistant status": "Не удалось проверить статус ассистента",
  "Failed to reset the session": "Не удалось сбросить сессию",
  "Failed to switch the model": "Не удалось переключить модель",
  "Compaction failed": "Не удалось сжать контекст",
  "Nothing to compact yet.": "Пока нечего сжимать.",
  "Context compacted: {before} → {after} tokens": "Контекст сжат: {before} → {after} токенов",
  "This file type is not supported.": "Этот тип файла не поддерживается.",
  "Attachment failed.": "Не удалось прикрепить файл.",
  "Failed to load limits": "Не удалось загрузить лимиты",
  "Limits are not available for this provider.": "Лимиты недоступны для этого провайдера.",
  "What MCP tools are available?": "Какие MCP-инструменты доступны?",
  "Show the 5 most recent orders": "Покажи 5 последних заказов",
  "Summarize today’s orders": "Сводка заказов за сегодня",
  "Scroll to bottom": "Прокрутить вниз",
  "How can I help you today?": "Чем могу помочь?",
  "Ask about Restoapp data available to your account.": "Спрашивайте о данных Restoapp, доступных вашей учётной записи.",
  "Ask about Restoapp data… type / for commands": "Спросите о данных Restoapp… введите / для команд",
  "Send message": "Отправить сообщение",
  "Stop generating": "Остановить генерацию",
  "Message input": "Поле ввода сообщения",
  "Assistant is working": "Ассистент работает",
  "Start a new chat (clears the conversation)": "Начать новый чат (очищает диалог)",
  "Free up context: prune or summarize older messages": "Освободить контекст: удалить или сжать старые сообщения",
  "Open the model selector": "Открыть выбор модели",
  "Ask the assistant what it can do": "Спросить ассистента, что он умеет",
  "What can you do? List the data models, admin pages and tools available to me.": "Что ты умеешь? Перечисли доступные мне модели данных, страницы админки и инструменты.",
  Copy: "Копировать",
  "Remove file": "Удалить файл",
  "Add Attachment": "Прикрепить файл"
}, cS = {
  "New chat": "Neuer Chat",
  "Model & context": "Modell & Kontext",
  Limits: "Limits",
  Model: "Modell",
  "Select model": "Modell auswählen",
  turn: "Runde",
  turns: "Runden",
  "Context usage": "Kontextnutzung",
  "Context: {used} of {total} tokens ({pct}%)": "Kontext: {used} von {total} Tokens ({pct}%)",
  "Loading…": "Wird geladen…",
  Retry: "Erneut versuchen",
  "{pct} used": "{pct} verbraucht",
  "{pct} of daily budget left": "{pct} des Tagesbudgets übrig",
  "No daily budget cap": "Kein Tagesbudget-Limit",
  "resets {time}": "Reset um {time}",
  "Refresh limits": "Limits aktualisieren",
  "Waiting for the next registration slot": "Warten auf das nächste Registrierungsfenster",
  "Registration attempt failed": "Registrierungsversuch fehlgeschlagen",
  "Server setup required": "Server-Einrichtung erforderlich",
  "Connecting the assistant…": "Assistent wird verbunden…",
  "The assistant registers itself with the LLM gateway. The broker issues at most one key per hour, so this can take a while — the page keeps retrying automatically.": "Der Assistent registriert sich am LLM-Gateway. Der Broker vergibt höchstens einen Schlüssel pro Stunde, das kann dauern — die Seite versucht es automatisch weiter.",
  "Set the PROJECT_NAME setting to finish the server setup — the assistant needs it to register.": "Setzen Sie die Einstellung PROJECT_NAME, um die Server-Einrichtung abzuschließen — der Assistent benötigt sie zur Registrierung.",
  "Next attempt at": "Nächster Versuch um",
  "Failed to load agent info": "Agent-Informationen konnten nicht geladen werden",
  "Failed to check the assistant status": "Assistentenstatus konnte nicht geprüft werden",
  "Failed to reset the session": "Sitzung konnte nicht zurückgesetzt werden",
  "Failed to switch the model": "Modellwechsel fehlgeschlagen",
  "Compaction failed": "Komprimierung fehlgeschlagen",
  "Nothing to compact yet.": "Noch nichts zu komprimieren.",
  "Context compacted: {before} → {after} tokens": "Kontext komprimiert: {before} → {after} Tokens",
  "This file type is not supported.": "Dieser Dateityp wird nicht unterstützt.",
  "Attachment failed.": "Anhang fehlgeschlagen.",
  "Failed to load limits": "Limits konnten nicht geladen werden",
  "Limits are not available for this provider.": "Limits sind für diesen Anbieter nicht verfügbar.",
  "What MCP tools are available?": "Welche MCP-Tools sind verfügbar?",
  "Show the 5 most recent orders": "Zeige die 5 neuesten Bestellungen",
  "Summarize today’s orders": "Fasse die heutigen Bestellungen zusammen",
  "Scroll to bottom": "Nach unten scrollen",
  "How can I help you today?": "Wie kann ich Ihnen helfen?",
  "Ask about Restoapp data available to your account.": "Fragen Sie nach Restoapp-Daten, die Ihrem Konto zur Verfügung stehen.",
  "Ask about Restoapp data… type / for commands": "Nach Restoapp-Daten fragen… / für Befehle eingeben",
  "Send message": "Nachricht senden",
  "Stop generating": "Generierung stoppen",
  "Message input": "Nachrichteneingabe",
  "Assistant is working": "Assistent arbeitet",
  "Start a new chat (clears the conversation)": "Neuen Chat starten (löscht das Gespräch)",
  "Free up context: prune or summarize older messages": "Kontext freigeben: ältere Nachrichten entfernen oder zusammenfassen",
  "Open the model selector": "Modellauswahl öffnen",
  "Ask the assistant what it can do": "Den Assistenten fragen, was er kann",
  "What can you do? List the data models, admin pages and tools available to me.": "Was kannst du? Liste die mir verfügbaren Datenmodelle, Admin-Seiten und Tools auf.",
  Copy: "Kopieren",
  "Remove file": "Datei entfernen",
  "Add Attachment": "Anhang hinzufügen"
}, uS = {
  "New chat": "Nuevo chat",
  "Model & context": "Modelo y contexto",
  Limits: "Límites",
  Model: "Modelo",
  "Select model": "Seleccionar modelo",
  turn: "turno",
  turns: "turnos",
  "Context usage": "Uso del contexto",
  "Context: {used} of {total} tokens ({pct}%)": "Contexto: {used} de {total} tokens ({pct}%)",
  "Loading…": "Cargando…",
  Retry: "Reintentar",
  "{pct} used": "{pct} usado",
  "{pct} of daily budget left": "queda {pct} del presupuesto diario",
  "No daily budget cap": "Sin límite de presupuesto diario",
  "resets {time}": "se restablece a las {time}",
  "Refresh limits": "Actualizar límites",
  "Waiting for the next registration slot": "Esperando la próxima ventana de registro",
  "Registration attempt failed": "El intento de registro falló",
  "Server setup required": "Se requiere completar la configuración del servidor",
  "Connecting the assistant…": "Conectando el asistente…",
  "The assistant registers itself with the LLM gateway. The broker issues at most one key per hour, so this can take a while — the page keeps retrying automatically.": "El asistente se registra en la pasarela LLM. El bróker emite como máximo una clave por hora, así que puede tardar — la página reintenta automáticamente.",
  "Set the PROJECT_NAME setting to finish the server setup — the assistant needs it to register.": "Defina el ajuste PROJECT_NAME para completar la configuración del servidor — el asistente lo necesita para registrarse.",
  "Next attempt at": "Próximo intento a las",
  "Failed to load agent info": "No se pudo cargar la información del agente",
  "Failed to check the assistant status": "No se pudo comprobar el estado del asistente",
  "Failed to reset the session": "No se pudo restablecer la sesión",
  "Failed to switch the model": "No se pudo cambiar el modelo",
  "Compaction failed": "La compactación falló",
  "Nothing to compact yet.": "Todavía no hay nada que compactar.",
  "Context compacted: {before} → {after} tokens": "Contexto compactado: {before} → {after} tokens",
  "This file type is not supported.": "Este tipo de archivo no es compatible.",
  "Attachment failed.": "Error al adjuntar.",
  "Failed to load limits": "No se pudieron cargar los límites",
  "Limits are not available for this provider.": "Los límites no están disponibles para este proveedor.",
  "What MCP tools are available?": "¿Qué herramientas MCP están disponibles?",
  "Show the 5 most recent orders": "Muestra los 5 pedidos más recientes",
  "Summarize today’s orders": "Resume los pedidos de hoy",
  "Scroll to bottom": "Desplazarse abajo",
  "How can I help you today?": "¿En qué puedo ayudarte hoy?",
  "Ask about Restoapp data available to your account.": "Pregunta por los datos de Restoapp disponibles para tu cuenta.",
  "Ask about Restoapp data… type / for commands": "Pregunta por datos de Restoapp… escribe / para comandos",
  "Send message": "Enviar mensaje",
  "Stop generating": "Detener generación",
  "Message input": "Campo de mensaje",
  "Assistant is working": "El asistente está trabajando",
  "Start a new chat (clears the conversation)": "Iniciar un chat nuevo (borra la conversación)",
  "Free up context: prune or summarize older messages": "Liberar contexto: eliminar o resumir mensajes antiguos",
  "Open the model selector": "Abrir el selector de modelo",
  "Ask the assistant what it can do": "Preguntar al asistente qué puede hacer",
  "What can you do? List the data models, admin pages and tools available to me.": "¿Qué puedes hacer? Enumera los modelos de datos, páginas de administración y herramientas disponibles para mí.",
  Copy: "Copiar",
  "Remove file": "Quitar archivo",
  "Add Attachment": "Añadir adjunto"
}, dS = {
  "New chat": "Nouveau chat",
  "Model & context": "Modèle et contexte",
  Limits: "Limites",
  Model: "Modèle",
  "Select model": "Choisir le modèle",
  turn: "tour",
  turns: "tours",
  "Context usage": "Utilisation du contexte",
  "Context: {used} of {total} tokens ({pct}%)": "Contexte : {used} sur {total} tokens ({pct}%)",
  "Loading…": "Chargement…",
  Retry: "Réessayer",
  "{pct} used": "{pct} utilisé",
  "{pct} of daily budget left": "{pct} du budget quotidien restant",
  "No daily budget cap": "Pas de plafond de budget quotidien",
  "resets {time}": "réinitialisation à {time}",
  "Refresh limits": "Actualiser les limites",
  "Waiting for the next registration slot": "En attente du prochain créneau d’enregistrement",
  "Registration attempt failed": "La tentative d’enregistrement a échoué",
  "Server setup required": "Configuration du serveur requise",
  "Connecting the assistant…": "Connexion de l’assistant…",
  "The assistant registers itself with the LLM gateway. The broker issues at most one key per hour, so this can take a while — the page keeps retrying automatically.": "L’assistant s’enregistre auprès de la passerelle LLM. Le broker ne délivre qu’une clé par heure au maximum, cela peut prendre du temps — la page réessaie automatiquement.",
  "Set the PROJECT_NAME setting to finish the server setup — the assistant needs it to register.": "Renseignez le paramètre PROJECT_NAME pour terminer la configuration du serveur — l’assistant en a besoin pour s’enregistrer.",
  "Next attempt at": "Prochaine tentative à",
  "Failed to load agent info": "Impossible de charger les informations de l’agent",
  "Failed to check the assistant status": "Impossible de vérifier l’état de l’assistant",
  "Failed to reset the session": "Impossible de réinitialiser la session",
  "Failed to switch the model": "Impossible de changer de modèle",
  "Compaction failed": "Échec de la compaction",
  "Nothing to compact yet.": "Rien à compacter pour l’instant.",
  "Context compacted: {before} → {after} tokens": "Contexte compacté : {before} → {after} tokens",
  "This file type is not supported.": "Ce type de fichier n’est pas pris en charge.",
  "Attachment failed.": "Échec de la pièce jointe.",
  "Failed to load limits": "Impossible de charger les limites",
  "Limits are not available for this provider.": "Les limites ne sont pas disponibles pour ce fournisseur.",
  "What MCP tools are available?": "Quels outils MCP sont disponibles ?",
  "Show the 5 most recent orders": "Affiche les 5 commandes les plus récentes",
  "Summarize today’s orders": "Résume les commandes du jour",
  "Scroll to bottom": "Faire défiler vers le bas",
  "How can I help you today?": "Comment puis-je vous aider ?",
  "Ask about Restoapp data available to your account.": "Interrogez les données Restoapp accessibles à votre compte.",
  "Ask about Restoapp data… type / for commands": "Interrogez les données Restoapp… tapez / pour les commandes",
  "Send message": "Envoyer le message",
  "Stop generating": "Arrêter la génération",
  "Message input": "Champ de message",
  "Assistant is working": "L’assistant travaille",
  "Start a new chat (clears the conversation)": "Démarrer un nouveau chat (efface la conversation)",
  "Free up context: prune or summarize older messages": "Libérer du contexte : supprimer ou résumer les anciens messages",
  "Open the model selector": "Ouvrir le sélecteur de modèle",
  "Ask the assistant what it can do": "Demander à l’assistant ce qu’il sait faire",
  "What can you do? List the data models, admin pages and tools available to me.": "Que sais-tu faire ? Liste les modèles de données, pages d’administration et outils qui me sont accessibles.",
  Copy: "Copier",
  "Remove file": "Supprimer le fichier",
  "Add Attachment": "Ajouter une pièce jointe"
}, hS = {
  "New chat": "新しいチャット",
  "Model & context": "モデルとコンテキスト",
  Limits: "制限",
  Model: "モデル",
  "Select model": "モデルを選択",
  turn: "ターン",
  turns: "ターン",
  "Context usage": "コンテキスト使用量",
  "Context: {used} of {total} tokens ({pct}%)": "コンテキスト: {total} 中 {used} トークン（{pct}%）",
  "Loading…": "読み込み中…",
  Retry: "再試行",
  "{pct} used": "{pct} 使用済み",
  "{pct} of daily budget left": "1日の予算の残り {pct}",
  "No daily budget cap": "1日の予算上限なし",
  "resets {time}": "{time} にリセット",
  "Refresh limits": "制限を更新",
  "Waiting for the next registration slot": "次の登録枠を待っています",
  "Registration attempt failed": "登録に失敗しました",
  "Server setup required": "サーバーのセットアップが必要です",
  "Connecting the assistant…": "アシスタントに接続中…",
  "The assistant registers itself with the LLM gateway. The broker issues at most one key per hour, so this can take a while — the page keeps retrying automatically.": "アシスタントは LLM ゲートウェイに自動登録します。ブローカーは1時間に最大1つのキーしか発行しないため時間がかかることがあります — ページは自動的に再試行します。",
  "Set the PROJECT_NAME setting to finish the server setup — the assistant needs it to register.": "サーバーのセットアップを完了するには PROJECT_NAME 設定を入力してください — アシスタントの登録に必要です。",
  "Next attempt at": "次回の試行:",
  "Failed to load agent info": "エージェント情報を読み込めませんでした",
  "Failed to check the assistant status": "アシスタントの状態を確認できませんでした",
  "Failed to reset the session": "セッションをリセットできませんでした",
  "Failed to switch the model": "モデルを切り替えられませんでした",
  "Compaction failed": "コンテキストの圧縮に失敗しました",
  "Nothing to compact yet.": "まだ圧縮するものがありません。",
  "Context compacted: {before} → {after} tokens": "コンテキストを圧縮: {before} → {after} トークン",
  "This file type is not supported.": "このファイル形式はサポートされていません。",
  "Attachment failed.": "添付に失敗しました。",
  "Failed to load limits": "制限を読み込めませんでした",
  "Limits are not available for this provider.": "このプロバイダーでは制限情報を利用できません。",
  "What MCP tools are available?": "利用可能な MCP ツールは？",
  "Show the 5 most recent orders": "直近5件の注文を表示",
  "Summarize today’s orders": "今日の注文をまとめて",
  "Scroll to bottom": "一番下へスクロール",
  "How can I help you today?": "何かお手伝いしましょうか？",
  "Ask about Restoapp data available to your account.": "アカウントで利用できる Restoapp のデータについて質問できます。",
  "Ask about Restoapp data… type / for commands": "Restoapp のデータについて質問… / でコマンド",
  "Send message": "メッセージを送信",
  "Stop generating": "生成を停止",
  "Message input": "メッセージ入力",
  "Assistant is working": "アシスタントが処理中",
  "Start a new chat (clears the conversation)": "新しいチャットを開始（会話をクリア）",
  "Free up context: prune or summarize older messages": "コンテキストを解放: 古いメッセージを削除または要約",
  "Open the model selector": "モデル選択を開く",
  "Ask the assistant what it can do": "アシスタントに何ができるか尋ねる",
  "What can you do? List the data models, admin pages and tools available to me.": "何ができますか？利用可能なデータモデル、管理ページ、ツールを一覧にしてください。",
  Copy: "コピー",
  "Remove file": "ファイルを削除",
  "Add Attachment": "添付ファイルを追加"
}, pS = {
  "New chat": "새 채팅",
  "Model & context": "모델 및 컨텍스트",
  Limits: "한도",
  Model: "모델",
  "Select model": "모델 선택",
  turn: "턴",
  turns: "턴",
  "Context usage": "컨텍스트 사용량",
  "Context: {used} of {total} tokens ({pct}%)": "컨텍스트: {total} 중 {used} 토큰 ({pct}%)",
  "Loading…": "불러오는 중…",
  Retry: "다시 시도",
  "{pct} used": "{pct} 사용됨",
  "{pct} of daily budget left": "일일 예산의 {pct} 남음",
  "No daily budget cap": "일일 예산 제한 없음",
  "resets {time}": "{time}에 초기화",
  "Refresh limits": "한도 새로고침",
  "Waiting for the next registration slot": "다음 등록 가능 시간을 기다리는 중",
  "Registration attempt failed": "등록 시도 실패",
  "Server setup required": "서버 설정을 완료해야 합니다",
  "Connecting the assistant…": "어시스턴트 연결 중…",
  "The assistant registers itself with the LLM gateway. The broker issues at most one key per hour, so this can take a while — the page keeps retrying automatically.": "어시스턴트가 LLM 게이트웨이에 자동 등록합니다. 브로커는 시간당 최대 1개의 키만 발급하므로 시간이 걸릴 수 있으며, 페이지가 자동으로 재시도합니다.",
  "Set the PROJECT_NAME setting to finish the server setup — the assistant needs it to register.": "서버 설정을 완료하려면 PROJECT_NAME 설정을 입력하세요 — 어시스턴트 등록에 필요합니다.",
  "Next attempt at": "다음 시도:",
  "Failed to load agent info": "에이전트 정보를 불러오지 못했습니다",
  "Failed to check the assistant status": "어시스턴트 상태를 확인하지 못했습니다",
  "Failed to reset the session": "세션을 초기화하지 못했습니다",
  "Failed to switch the model": "모델을 전환하지 못했습니다",
  "Compaction failed": "컨텍스트 압축 실패",
  "Nothing to compact yet.": "아직 압축할 내용이 없습니다.",
  "Context compacted: {before} → {after} tokens": "컨텍스트 압축됨: {before} → {after} 토큰",
  "This file type is not supported.": "지원되지 않는 파일 형식입니다.",
  "Attachment failed.": "첨부에 실패했습니다.",
  "Failed to load limits": "한도를 불러오지 못했습니다",
  "Limits are not available for this provider.": "이 공급자에서는 한도 정보를 사용할 수 없습니다.",
  "What MCP tools are available?": "사용 가능한 MCP 도구는 무엇인가요?",
  "Show the 5 most recent orders": "최근 주문 5건 보여줘",
  "Summarize today’s orders": "오늘 주문 요약해줘",
  "Scroll to bottom": "맨 아래로 스크롤",
  "How can I help you today?": "무엇을 도와드릴까요?",
  "Ask about Restoapp data available to your account.": "계정에서 사용할 수 있는 Restoapp 데이터에 대해 질문하세요.",
  "Ask about Restoapp data… type / for commands": "Restoapp 데이터에 대해 질문… 명령은 / 입력",
  "Send message": "메시지 보내기",
  "Stop generating": "생성 중지",
  "Message input": "메시지 입력",
  "Assistant is working": "어시스턴트 작업 중",
  "Start a new chat (clears the conversation)": "새 채팅 시작 (대화 삭제)",
  "Free up context: prune or summarize older messages": "컨텍스트 확보: 오래된 메시지 정리 또는 요약",
  "Open the model selector": "모델 선택 열기",
  "Ask the assistant what it can do": "어시스턴트에게 무엇을 할 수 있는지 물어보기",
  "What can you do? List the data models, admin pages and tools available to me.": "무엇을 할 수 있나요? 사용 가능한 데이터 모델, 관리 페이지, 도구를 나열해 주세요.",
  Copy: "복사",
  "Remove file": "파일 제거",
  "Add Attachment": "첨부 파일 추가"
}, mS = {
  "New chat": "แชทใหม่",
  "Model & context": "โมเดลและคอนเท็กซ์",
  Limits: "ขีดจำกัด",
  Model: "โมเดล",
  "Select model": "เลือกโมเดล",
  turn: "เทิร์น",
  turns: "เทิร์น",
  "Context usage": "การใช้คอนเท็กซ์",
  "Context: {used} of {total} tokens ({pct}%)": "คอนเท็กซ์: {used} จาก {total} โทเค็น ({pct}%)",
  "Loading…": "กำลังโหลด…",
  Retry: "ลองใหม่",
  "{pct} used": "ใช้ไป {pct}",
  "{pct} of daily budget left": "เหลืองบประมาณรายวัน {pct}",
  "No daily budget cap": "ไม่มีเพดานงบประมาณรายวัน",
  "resets {time}": "รีเซ็ตเวลา {time}",
  "Refresh limits": "รีเฟรชขีดจำกัด",
  "Waiting for the next registration slot": "รอรอบการลงทะเบียนถัดไป",
  "Registration attempt failed": "การลงทะเบียนล้มเหลว",
  "Server setup required": "ต้องตั้งค่าเซิร์ฟเวอร์ให้เสร็จก่อน",
  "Connecting the assistant…": "กำลังเชื่อมต่อผู้ช่วย…",
  "The assistant registers itself with the LLM gateway. The broker issues at most one key per hour, so this can take a while — the page keeps retrying automatically.": "ผู้ช่วยจะลงทะเบียนกับเกตเวย์ LLM โดยอัตโนมัติ โบรกเกอร์ออกคีย์ได้สูงสุดหนึ่งคีย์ต่อชั่วโมง จึงอาจใช้เวลาสักครู่ — หน้านี้จะลองใหม่ให้เอง",
  "Set the PROJECT_NAME setting to finish the server setup — the assistant needs it to register.": "กรุณาตั้งค่า PROJECT_NAME เพื่อทำการตั้งค่าเซิร์ฟเวอร์ให้เสร็จ — ผู้ช่วยต้องใช้ในการลงทะเบียน",
  "Next attempt at": "ลองใหม่เวลา",
  "Failed to load agent info": "โหลดข้อมูลเอเจนต์ไม่สำเร็จ",
  "Failed to check the assistant status": "ตรวจสอบสถานะผู้ช่วยไม่สำเร็จ",
  "Failed to reset the session": "รีเซ็ตเซสชันไม่สำเร็จ",
  "Failed to switch the model": "สลับโมเดลไม่สำเร็จ",
  "Compaction failed": "บีบอัดคอนเท็กซ์ไม่สำเร็จ",
  "Nothing to compact yet.": "ยังไม่มีอะไรให้บีบอัด",
  "Context compacted: {before} → {after} tokens": "บีบอัดคอนเท็กซ์แล้ว: {before} → {after} โทเค็น",
  "This file type is not supported.": "ไม่รองรับไฟล์ประเภทนี้",
  "Attachment failed.": "แนบไฟล์ไม่สำเร็จ",
  "Failed to load limits": "โหลดขีดจำกัดไม่สำเร็จ",
  "Limits are not available for this provider.": "ผู้ให้บริการนี้ไม่มีข้อมูลขีดจำกัด",
  "What MCP tools are available?": "มีเครื่องมือ MCP อะไรบ้าง?",
  "Show the 5 most recent orders": "แสดงคำสั่งซื้อล่าสุด 5 รายการ",
  "Summarize today’s orders": "สรุปคำสั่งซื้อของวันนี้",
  "Scroll to bottom": "เลื่อนลงล่างสุด",
  "How can I help you today?": "ให้ช่วยอะไรดีครับ/คะ?",
  "Ask about Restoapp data available to your account.": "สอบถามข้อมูล Restoapp ที่บัญชีของคุณเข้าถึงได้",
  "Ask about Restoapp data… type / for commands": "ถามข้อมูล Restoapp… พิมพ์ / เพื่อดูคำสั่ง",
  "Send message": "ส่งข้อความ",
  "Stop generating": "หยุดการสร้าง",
  "Message input": "ช่องพิมพ์ข้อความ",
  "Assistant is working": "ผู้ช่วยกำลังทำงาน",
  "Start a new chat (clears the conversation)": "เริ่มแชทใหม่ (ล้างบทสนทนา)",
  "Free up context: prune or summarize older messages": "เพิ่มพื้นที่คอนเท็กซ์: ลบหรือสรุปข้อความเก่า",
  "Open the model selector": "เปิดตัวเลือกโมเดล",
  "Ask the assistant what it can do": "ถามผู้ช่วยว่าทำอะไรได้บ้าง",
  "What can you do? List the data models, admin pages and tools available to me.": "คุณทำอะไรได้บ้าง? แสดงรายการโมเดลข้อมูล หน้าแอดมิน และเครื่องมือที่ฉันใช้ได้",
  Copy: "คัดลอก",
  "Remove file": "ลบไฟล์",
  "Add Attachment": "แนบไฟล์"
}, fS = {
  "New chat": "Cuộc trò chuyện mới",
  "Model & context": "Mô hình & ngữ cảnh",
  Limits: "Giới hạn",
  Model: "Mô hình",
  "Select model": "Chọn mô hình",
  turn: "lượt",
  turns: "lượt",
  "Context usage": "Mức dùng ngữ cảnh",
  "Context: {used} of {total} tokens ({pct}%)": "Ngữ cảnh: {used} / {total} token ({pct}%)",
  "Loading…": "Đang tải…",
  Retry: "Thử lại",
  "{pct} used": "đã dùng {pct}",
  "{pct} of daily budget left": "còn {pct} ngân sách trong ngày",
  "No daily budget cap": "Không giới hạn ngân sách ngày",
  "resets {time}": "đặt lại lúc {time}",
  "Refresh limits": "Làm mới giới hạn",
  "Waiting for the next registration slot": "Đang chờ lượt đăng ký tiếp theo",
  "Registration attempt failed": "Đăng ký thất bại",
  "Server setup required": "Cần hoàn tất cài đặt máy chủ",
  "Connecting the assistant…": "Đang kết nối trợ lý…",
  "The assistant registers itself with the LLM gateway. The broker issues at most one key per hour, so this can take a while — the page keeps retrying automatically.": "Trợ lý tự đăng ký với cổng LLM. Broker chỉ cấp tối đa một khóa mỗi giờ nên có thể mất thời gian — trang sẽ tự động thử lại.",
  "Set the PROJECT_NAME setting to finish the server setup — the assistant needs it to register.": "Hãy đặt cấu hình PROJECT_NAME để hoàn tất cài đặt máy chủ — trợ lý cần nó để đăng ký.",
  "Next attempt at": "Lần thử tiếp theo lúc",
  "Failed to load agent info": "Không tải được thông tin agent",
  "Failed to check the assistant status": "Không kiểm tra được trạng thái trợ lý",
  "Failed to reset the session": "Không đặt lại được phiên",
  "Failed to switch the model": "Không chuyển được mô hình",
  "Compaction failed": "Nén ngữ cảnh thất bại",
  "Nothing to compact yet.": "Chưa có gì để nén.",
  "Context compacted: {before} → {after} tokens": "Đã nén ngữ cảnh: {before} → {after} token",
  "This file type is not supported.": "Loại tệp này không được hỗ trợ.",
  "Attachment failed.": "Đính kèm thất bại.",
  "Failed to load limits": "Không tải được giới hạn",
  "Limits are not available for this provider.": "Nhà cung cấp này không có thông tin giới hạn.",
  "What MCP tools are available?": "Có những công cụ MCP nào?",
  "Show the 5 most recent orders": "Hiển thị 5 đơn hàng gần nhất",
  "Summarize today’s orders": "Tóm tắt đơn hàng hôm nay",
  "Scroll to bottom": "Cuộn xuống cuối",
  "How can I help you today?": "Tôi có thể giúp gì cho bạn?",
  "Ask about Restoapp data available to your account.": "Hỏi về dữ liệu Restoapp mà tài khoản của bạn truy cập được.",
  "Ask about Restoapp data… type / for commands": "Hỏi về dữ liệu Restoapp… gõ / để xem lệnh",
  "Send message": "Gửi tin nhắn",
  "Stop generating": "Dừng tạo",
  "Message input": "Ô nhập tin nhắn",
  "Assistant is working": "Trợ lý đang xử lý",
  "Start a new chat (clears the conversation)": "Bắt đầu cuộc trò chuyện mới (xóa hội thoại)",
  "Free up context: prune or summarize older messages": "Giải phóng ngữ cảnh: xóa hoặc tóm tắt tin nhắn cũ",
  "Open the model selector": "Mở bộ chọn mô hình",
  "Ask the assistant what it can do": "Hỏi trợ lý có thể làm gì",
  "What can you do? List the data models, admin pages and tools available to me.": "Bạn làm được gì? Liệt kê các mô hình dữ liệu, trang quản trị và công cụ tôi có thể dùng.",
  Copy: "Sao chép",
  "Remove file": "Xóa tệp",
  "Add Attachment": "Thêm tệp đính kèm"
}, gS = {
  "New chat": "新对话",
  "Model & context": "模型与上下文",
  Limits: "限额",
  Model: "模型",
  "Select model": "选择模型",
  turn: "轮",
  turns: "轮",
  "Context usage": "上下文用量",
  "Context: {used} of {total} tokens ({pct}%)": "上下文：{used} / {total} 个 token（{pct}%）",
  "Loading…": "加载中…",
  Retry: "重试",
  "{pct} used": "已用 {pct}",
  "{pct} of daily budget left": "每日预算剩余 {pct}",
  "No daily budget cap": "无每日预算上限",
  "resets {time}": "{time} 重置",
  "Refresh limits": "刷新限额",
  "Waiting for the next registration slot": "等待下一个注册时段",
  "Registration attempt failed": "注册尝试失败",
  "Server setup required": "需要先完成服务器设置",
  "Connecting the assistant…": "正在连接助手…",
  "The assistant registers itself with the LLM gateway. The broker issues at most one key per hour, so this can take a while — the page keeps retrying automatically.": "助手会自动向 LLM 网关注册。代理每小时最多签发一个密钥，因此可能需要等待——页面会自动重试。",
  "Set the PROJECT_NAME setting to finish the server setup — the assistant needs it to register.": "请填写 PROJECT_NAME 设置以完成服务器设置——助手注册时需要它。",
  "Next attempt at": "下次尝试时间",
  "Failed to load agent info": "无法加载代理信息",
  "Failed to check the assistant status": "无法检查助手状态",
  "Failed to reset the session": "无法重置会话",
  "Failed to switch the model": "无法切换模型",
  "Compaction failed": "上下文压缩失败",
  "Nothing to compact yet.": "暂时没有可压缩的内容。",
  "Context compacted: {before} → {after} tokens": "上下文已压缩：{before} → {after} 个 token",
  "This file type is not supported.": "不支持此文件类型。",
  "Attachment failed.": "附件添加失败。",
  "Failed to load limits": "无法加载限额",
  "Limits are not available for this provider.": "该提供商不提供限额信息。",
  "What MCP tools are available?": "有哪些可用的 MCP 工具？",
  "Show the 5 most recent orders": "显示最近 5 个订单",
  "Summarize today’s orders": "汇总今天的订单",
  "Scroll to bottom": "滚动到底部",
  "How can I help you today?": "有什么可以帮您？",
  "Ask about Restoapp data available to your account.": "查询您的账号可访问的 Restoapp 数据。",
  "Ask about Restoapp data… type / for commands": "查询 Restoapp 数据… 输入 / 查看命令",
  "Send message": "发送消息",
  "Stop generating": "停止生成",
  "Message input": "消息输入框",
  "Assistant is working": "助手处理中",
  "Start a new chat (clears the conversation)": "开始新对话（清空当前会话）",
  "Free up context: prune or summarize older messages": "释放上下文：清理或总结较早的消息",
  "Open the model selector": "打开模型选择器",
  "Ask the assistant what it can do": "询问助手能做什么",
  "What can you do? List the data models, admin pages and tools available to me.": "你能做什么？列出我可用的数据模型、管理页面和工具。",
  Copy: "复制",
  "Remove file": "移除文件",
  "Add Attachment": "添加附件"
}, Tr = { en: {}, ru: lS, de: cS, es: uS, fr: dS, ja: hS, ko: pS, th: mS, vn: fS, zh: gS };
let Uh = Tr.en;
function bS(t) {
  const e = (t || "").replace("_", "-"), n = e.split("-")[0];
  Uh = Tr[e] ?? Tr[n] ?? Tr.en;
}
function J(t, e) {
  let n = Uh[t] ?? t;
  if (e)
    for (const [r, i] of Object.entries(e))
      n = n.split(`{${r}}`).join(String(i));
  return n;
}
const vS = window.UIComponents.Tooltip, wS = window.UIComponents.TooltipContent, yS = window.UIComponents.TooltipTrigger, xS = window.UIComponents.Dialog, kS = window.UIComponents.DialogTitle, _S = window.UIComponents.DialogContent, SS = window.UIComponents.DialogTrigger, CS = window.UIComponents.Avatar, TS = window.UIComponents.AvatarImage, IS = window.UIComponents.AvatarFallback, AS = (t) => {
  const [e, n] = we(void 0);
  return it(() => {
    if (!t) {
      n(void 0);
      return;
    }
    const r = URL.createObjectURL(t);
    return n(r), () => {
      URL.revokeObjectURL(r);
    };
  }, [t]), e;
}, jh = () => {
  const { file: t, src: e } = $(
    Or((n) => {
      var i, o;
      if (n.attachment.type !== "image")
        return {};
      if (n.attachment.file)
        return { file: n.attachment.file };
      const r = (o = (i = n.attachment.content) == null ? void 0 : i.filter((s) => s.type === "image")[0]) == null ? void 0 : o.image;
      return r ? { src: r } : {};
    })
  );
  return AS(t) ?? e;
}, ES = ({ src: t }) => {
  const [e, n] = we(!1);
  return /* @__PURE__ */ f(
    "img",
    {
      src: t,
      alt: "Attachment preview",
      className: K(
        "block h-auto max-h-[80vh] w-auto max-w-full object-contain",
        e ? "aui-attachment-preview-image-loaded" : "aui-attachment-preview-image-loading invisible"
      ),
      onLoad: () => n(!0)
    }
  );
}, RS = ({ children: t }) => {
  const e = jh();
  return e ? /* @__PURE__ */ j(xS, { children: [
    /* @__PURE__ */ f(
      SS,
      {
        className: "aui-attachment-preview-trigger hover:bg-accent/50 cursor-pointer transition-colors",
        asChild: !0,
        children: t
      }
    ),
    /* @__PURE__ */ j(_S, { className: "aui-attachment-preview-dialog-content [&>button]:bg-foreground/60 [&_svg]:text-background [&>button]:hover:[&_svg]:text-destructive p-2 sm:max-w-3xl [&>button]:rounded-full [&>button]:p-1 [&>button]:opacity-100 [&>button]:ring-0!", children: [
      /* @__PURE__ */ f(kS, { className: "aui-sr-only sr-only", children: "Image Attachment Preview" }),
      /* @__PURE__ */ f("div", { className: "aui-attachment-preview bg-background relative mx-auto flex max-h-[80dvh] w-full items-center justify-center overflow-hidden", children: /* @__PURE__ */ f(ES, { src: e }) })
    ] })
  ] }) : t;
}, MS = () => {
  const t = jh();
  return /* @__PURE__ */ j(CS, { className: "aui-attachment-tile-avatar h-full w-full rounded-none", children: [
    /* @__PURE__ */ f(
      TS,
      {
        src: t,
        alt: "Attachment preview",
        className: "aui-attachment-tile-image object-cover"
      }
    ),
    /* @__PURE__ */ f(IS, { children: /* @__PURE__ */ f(Zk, { className: "aui-attachment-tile-fallback-icon text-muted-foreground size-8" }) })
  ] });
}, Vh = () => {
  const e = Z().attachment.source !== "message", n = $((l) => l.attachment.type === "image"), r = $((l) => {
    const c = l.attachment.type;
    switch (c) {
      case "image":
        return "Image";
      case "document":
        return "Document";
      case "file":
        return "File";
      default:
        return c;
    }
  }), i = $(
    (l) => l.attachment.status.type === "running" ? "uploading" : l.attachment.status.type === "incomplete" && l.attachment.status.reason === "error" ? "error" : void 0
  ), o = i === "uploading", s = i === "error", a = $(
    (l) => l.attachment.status.type === "incomplete" && l.attachment.status.reason === "error" ? l.attachment.status.message ?? "Upload failed" : void 0
  );
  return /* @__PURE__ */ j(vS, { children: [
    /* @__PURE__ */ j(
      no.Root,
      {
        className: K(
          "aui-attachment-root relative",
          n && !e && "aui-attachment-root-message only:*:first:size-24"
        ),
        children: [
          /* @__PURE__ */ f(RS, { children: /* @__PURE__ */ f(yS, { asChild: !0, children: /* @__PURE__ */ j(
            "div",
            {
              className: K(
                "aui-attachment-tile bg-muted relative size-14 cursor-pointer overflow-hidden rounded-lg border transition-opacity hover:opacity-75",
                s && "border-destructive"
              ),
              role: "button",
              tabIndex: 0,
              "aria-label": `${r} attachment${s ? ", upload failed" : o ? ", uploading" : ""}`,
              children: [
                /* @__PURE__ */ f(MS, {}),
                o && /* @__PURE__ */ f(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "aui-attachment-tile-uploading bg-background/60 absolute inset-0 flex items-center justify-center backdrop-blur-[1px]",
                    children: /* @__PURE__ */ f(_h, { className: "text-muted-foreground size-5 animate-spin" })
                  }
                ),
                s && /* @__PURE__ */ f(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "aui-attachment-tile-error bg-destructive/10 absolute inset-0 flex items-center justify-center",
                    children: /* @__PURE__ */ f(xh, { className: "text-destructive size-5" })
                  }
                )
              ]
            }
          ) }) }),
          e && /* @__PURE__ */ f(PS, {})
        ]
      }
    ),
    /* @__PURE__ */ j(wS, { side: "top", children: [
      /* @__PURE__ */ f(no.Name, {}),
      a && /* @__PURE__ */ f("p", { className: "aui-attachment-error-message", children: a })
    ] })
  ] });
}, PS = () => /* @__PURE__ */ f(no.Remove, { asChild: !0, children: /* @__PURE__ */ f(
  on,
  {
    tooltip: J("Remove file"),
    className: "aui-attachment-tile-remove text-muted-foreground hover:[&_svg]:text-destructive absolute end-1.5 top-1.5 size-3.5 rounded-full bg-white opacity-100 shadow-sm hover:bg-white! [&_svg]:text-black",
    side: "top",
    children: /* @__PURE__ */ f(d_, { className: "aui-attachment-remove-icon size-3 dark:stroke-[2.5px]" })
  }
) }), NS = () => /* @__PURE__ */ f("div", { className: "aui-user-message-attachments-end col-span-full col-start-1 row-start-1 flex w-full flex-row justify-end gap-2", children: /* @__PURE__ */ f(xn.Attachments, { children: () => /* @__PURE__ */ f(Vh, {}) }) }), DS = () => /* @__PURE__ */ f("div", { className: "aui-composer-attachments flex w-full flex-row items-center gap-2 overflow-x-auto empty:hidden", children: /* @__PURE__ */ f(je.Attachments, { children: () => /* @__PURE__ */ f(Vh, {}) }) }), LS = () => /* @__PURE__ */ f(je.AddAttachment, { asChild: !0, children: /* @__PURE__ */ f(
  on,
  {
    tooltip: J("Add Attachment"),
    side: "bottom",
    variant: "ghost",
    size: "icon",
    className: "aui-composer-add-attachment hover:bg-muted-foreground/15 dark:border-muted-foreground/15 dark:hover:bg-muted-foreground/30 size-7 rounded-full p-1 text-xs font-semibold",
    "aria-label": J("Add Attachment"),
    children: /* @__PURE__ */ f(r_, { className: "aui-attachment-add-icon size-4.5 stroke-[1.5px]" })
  }
) }), zS = (t, e) => typeof t == "string" ? t === e : JSON.stringify(t) === JSON.stringify(e), OS = (t, e) => {
  if (!t || !e)
    return !1;
  const n = (r) => {
    const { position: i, data: o, ...s } = r || {};
    return s;
  };
  return JSON.stringify(n(t.properties)) === JSON.stringify(n(e.properties)) && zS(t.children, e.children);
}, ss = (t, e) => OS(t.node, e.node), $S = (t = {}) => Object.fromEntries(Object.entries(t ?? {}).map(([e, n]) => {
  if (!n)
    return [e, n];
  const r = n;
  return [e, ke(({ node: o, ...s }) => /* @__PURE__ */ f(r, { ...s }), ss)];
})), as = yo(null), qh = () => nr(as) !== null, FS = ({ children: t, ...e }) => /* @__PURE__ */ f(as.Provider, {
  value: e,
  children: t
}), BS = ke(FS, ss), US = ({ node: t, ...e }) => /* @__PURE__ */ f("pre", { ...e }), jS = ({ node: t, ...e }) => /* @__PURE__ */ f("code", { ...e }), ls = ({ node: t, components: { Pre: e, Code: n }, code: r }) => /* @__PURE__ */ f(e, { children: /* @__PURE__ */ f(n, {
  node: t,
  children: r
}) }), VS = () => null, qS = ({ node: t, components: { Pre: e, Code: n, SyntaxHighlighter: r, CodeHeader: i }, language: o, code: s }) => {
  const a = Tt(() => ({
    Pre: e,
    Code: n
  }), [e, n]);
  return /* @__PURE__ */ j(Ke, { children: [/* @__PURE__ */ f(i, {
    node: t,
    language: o,
    code: s
  }), /* @__PURE__ */ f(o ? r : ls, {
    node: t,
    components: a,
    language: o ?? "unknown",
    code: s
  })] });
};
var Hh = { exports: {} };
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
(function(t) {
  (function() {
    var e = {}.hasOwnProperty;
    function n() {
      for (var o = "", s = 0; s < arguments.length; s++) {
        var a = arguments[s];
        a && (o = i(o, r(a)));
      }
      return o;
    }
    function r(o) {
      if (typeof o == "string" || typeof o == "number")
        return o;
      if (typeof o != "object")
        return "";
      if (Array.isArray(o))
        return n.apply(null, o);
      if (o.toString !== Object.prototype.toString && !o.toString.toString().includes("[native code]"))
        return o.toString();
      var s = "";
      for (var a in o)
        e.call(o, a) && o[a] && (s = i(s, a));
      return s;
    }
    function i(o, s) {
      return s ? o ? o + " " + s : o + s : o;
    }
    t.exports ? (n.default = n, t.exports = n) : window.classNames = n;
  })();
})(Hh);
var HS = Hh.exports;
const Wh = /* @__PURE__ */ Zr(HS), rl = ({ className: t, ...e }) => ({ className: n, ...r }) => ({
  className: Wh(t, n),
  ...e,
  ...r
}), WS = ({ node: t, components: { Pre: e, Code: n, SyntaxHighlighter: r, CodeHeader: i }, componentsByLanguage: o = {}, children: s, ...a }) => {
  var p, m, g;
  const l = rl(nr(as)), c = Kt((w) => /* @__PURE__ */ f(e, { ...l(w) })), d = rl(a), u = Kt((w) => /* @__PURE__ */ f(n, { ...d(w) })), h = ((p = /language-(\w+)/.exec(a.className || "")) == null ? void 0 : p[1]) ?? "";
  return typeof s != "string" ? /* @__PURE__ */ f(ls, {
    node: t,
    components: {
      Pre: c,
      Code: u
    },
    code: s
  }) : /* @__PURE__ */ f(qS, {
    node: t,
    components: {
      Pre: c,
      Code: u,
      SyntaxHighlighter: ((m = o[h]) == null ? void 0 : m.SyntaxHighlighter) ?? r,
      CodeHeader: ((g = o[h]) == null ? void 0 : g.CodeHeader) ?? i
    },
    language: h || "unknown",
    code: s
  });
}, GS = ({ node: t, components: e, componentsByLanguage: n, ...r }) => qh() ? /* @__PURE__ */ f(WS, {
  node: t,
  components: e,
  componentsByLanguage: n,
  ...r
}) : /* @__PURE__ */ f(e.Code, { ...r }), KS = ke(GS, (t, e) => t.components === e.components && t.componentsByLanguage === e.componentsByLanguage && ss(t, e));
function JS(t, e) {
  const n = e || {};
  return (t[t.length - 1] === "" ? [...t, ""] : t).join(
    (n.padRight ? " " : "") + "," + (n.padLeft === !1 ? "" : " ")
  ).trim();
}
const QS = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, YS = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, XS = {};
function il(t, e) {
  return ((e || XS).jsx ? YS : QS).test(t);
}
const ZS = /[ \t\n\f\r]/g;
function eC(t) {
  return typeof t == "object" ? t.type === "text" ? ol(t.value) : !1 : ol(t);
}
function ol(t) {
  return t.replace(ZS, "") === "";
}
class sr {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(e, n, r) {
    this.normal = n, this.property = e, r && (this.space = r);
  }
}
sr.prototype.normal = {};
sr.prototype.property = {};
sr.prototype.space = void 0;
function Gh(t, e) {
  const n = {}, r = {};
  for (const i of t)
    Object.assign(n, i.property), Object.assign(r, i.normal);
  return new sr(n, r, e);
}
function so(t) {
  return t.toLowerCase();
}
class ze {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(e, n) {
    this.attribute = n, this.property = e;
  }
}
ze.prototype.attribute = "";
ze.prototype.booleanish = !1;
ze.prototype.boolean = !1;
ze.prototype.commaOrSpaceSeparated = !1;
ze.prototype.commaSeparated = !1;
ze.prototype.defined = !1;
ze.prototype.mustUseProperty = !1;
ze.prototype.number = !1;
ze.prototype.overloadedBoolean = !1;
ze.prototype.property = "";
ze.prototype.spaceSeparated = !1;
ze.prototype.space = void 0;
let tC = 0;
const te = sn(), Se = sn(), ao = sn(), U = sn(), be = sn(), Vt = sn(), $e = sn();
function sn() {
  return 2 ** ++tC;
}
const lo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean: te,
  booleanish: Se,
  commaOrSpaceSeparated: $e,
  commaSeparated: Vt,
  number: U,
  overloadedBoolean: ao,
  spaceSeparated: be
}, Symbol.toStringTag, { value: "Module" })), Ti = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(lo)
);
class cs extends ze {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(e, n, r, i) {
    let o = -1;
    if (super(e, n), sl(this, "space", i), typeof r == "number")
      for (; ++o < Ti.length; ) {
        const s = Ti[o];
        sl(this, Ti[o], (r & lo[s]) === lo[s]);
      }
  }
}
cs.prototype.defined = !0;
function sl(t, e, n) {
  n && (t[e] = n);
}
function In(t) {
  const e = {}, n = {};
  for (const [r, i] of Object.entries(t.properties)) {
    const o = new cs(
      r,
      t.transform(t.attributes || {}, r),
      i,
      t.space
    );
    t.mustUseProperty && t.mustUseProperty.includes(r) && (o.mustUseProperty = !0), e[r] = o, n[so(r)] = r, n[so(o.attribute)] = r;
  }
  return new sr(e, n, t.space);
}
const Kh = In({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: Se,
    ariaAutoComplete: null,
    ariaBusy: Se,
    ariaChecked: Se,
    ariaColCount: U,
    ariaColIndex: U,
    ariaColSpan: U,
    ariaControls: be,
    ariaCurrent: null,
    ariaDescribedBy: be,
    ariaDetails: null,
    ariaDisabled: Se,
    ariaDropEffect: be,
    ariaErrorMessage: null,
    ariaExpanded: Se,
    ariaFlowTo: be,
    ariaGrabbed: Se,
    ariaHasPopup: null,
    ariaHidden: Se,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: be,
    ariaLevel: U,
    ariaLive: null,
    ariaModal: Se,
    ariaMultiLine: Se,
    ariaMultiSelectable: Se,
    ariaOrientation: null,
    ariaOwns: be,
    ariaPlaceholder: null,
    ariaPosInSet: U,
    ariaPressed: Se,
    ariaReadOnly: Se,
    ariaRelevant: null,
    ariaRequired: Se,
    ariaRoleDescription: be,
    ariaRowCount: U,
    ariaRowIndex: U,
    ariaRowSpan: U,
    ariaSelected: Se,
    ariaSetSize: U,
    ariaSort: null,
    ariaValueMax: U,
    ariaValueMin: U,
    ariaValueNow: U,
    ariaValueText: null,
    role: null
  },
  transform(t, e) {
    return e === "role" ? e : "aria-" + e.slice(4).toLowerCase();
  }
});
function Jh(t, e) {
  return e in t ? t[e] : e;
}
function Qh(t, e) {
  return Jh(t, e.toLowerCase());
}
const nC = In({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: Vt,
    acceptCharset: be,
    accessKey: be,
    action: null,
    allow: null,
    allowFullScreen: te,
    allowPaymentRequest: te,
    allowUserMedia: te,
    alpha: te,
    alt: null,
    as: null,
    async: te,
    autoCapitalize: null,
    autoComplete: be,
    autoFocus: te,
    autoPlay: te,
    blocking: be,
    capture: null,
    charSet: null,
    checked: te,
    cite: null,
    className: be,
    closedBy: null,
    colorSpace: null,
    cols: U,
    colSpan: U,
    command: null,
    commandFor: null,
    content: null,
    contentEditable: Se,
    controls: te,
    controlsList: be,
    coords: U | Vt,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: te,
    defer: te,
    dir: null,
    dirName: null,
    disabled: te,
    download: ao,
    draggable: Se,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: te,
    formTarget: null,
    headers: be,
    height: U,
    hidden: ao,
    high: U,
    href: null,
    hrefLang: null,
    htmlFor: be,
    httpEquiv: be,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: te,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: te,
    itemId: null,
    itemProp: be,
    itemRef: be,
    itemScope: te,
    itemType: be,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: te,
    low: U,
    manifest: null,
    max: null,
    maxLength: U,
    media: null,
    method: null,
    min: null,
    minLength: U,
    multiple: te,
    muted: te,
    name: null,
    nonce: null,
    noModule: te,
    noValidate: te,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: te,
    optimum: U,
    pattern: null,
    ping: be,
    placeholder: null,
    playsInline: te,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: te,
    referrerPolicy: null,
    rel: be,
    required: te,
    reversed: te,
    rows: U,
    rowSpan: U,
    sandbox: be,
    scope: null,
    scoped: te,
    seamless: te,
    selected: te,
    shadowRootClonable: te,
    shadowRootCustomElementRegistry: te,
    shadowRootDelegatesFocus: te,
    shadowRootMode: null,
    shadowRootSerializable: te,
    shape: null,
    size: U,
    sizes: null,
    slot: null,
    span: U,
    spellCheck: Se,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: U,
    step: null,
    style: null,
    tabIndex: U,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: te,
    useMap: null,
    value: Se,
    width: U,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: be,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: U,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: U,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: te,
    // Lists. Use CSS to reduce space between items instead
    declare: te,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: U,
    // `<img>` and `<object>`
    leftMargin: U,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: U,
    // `<body>`
    marginWidth: U,
    // `<body>`
    noResize: te,
    // `<frame>`
    noHref: te,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: te,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: te,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: U,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: Se,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: U,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: U,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    credentialless: te,
    disablePictureInPicture: te,
    disableRemotePlayback: te,
    exportParts: Vt,
    part: be,
    prefix: null,
    property: null,
    results: U,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: Qh
}), rC = In({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    maskType: "mask-type",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  properties: {
    about: $e,
    accentHeight: U,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: U,
    amplitude: U,
    arabicForm: null,
    ascent: U,
    attributeName: null,
    attributeType: null,
    azimuth: U,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: U,
    by: null,
    calcMode: null,
    capHeight: U,
    className: be,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: U,
    diffuseConstant: U,
    direction: null,
    display: null,
    dur: null,
    divisor: U,
    dominantBaseline: null,
    download: te,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: U,
    enableBackground: null,
    end: null,
    event: null,
    exponent: U,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: U,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: Vt,
    g2: Vt,
    glyphName: Vt,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: U,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: U,
    horizOriginX: U,
    horizOriginY: U,
    id: null,
    ideographic: U,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: U,
    k: U,
    k1: U,
    k2: U,
    k3: U,
    k4: U,
    kernelMatrix: $e,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: U,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskType: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: U,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: U,
    overlineThickness: U,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: U,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: be,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: U,
    pointsAtY: U,
    pointsAtZ: U,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: $e,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: $e,
    rev: $e,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: $e,
    requiredFeatures: $e,
    requiredFonts: $e,
    requiredFormats: $e,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: U,
    specularExponent: U,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: U,
    strikethroughThickness: U,
    string: null,
    stroke: null,
    strokeDashArray: $e,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: U,
    strokeOpacity: U,
    strokeWidth: null,
    style: null,
    surfaceScale: U,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: $e,
    tabIndex: U,
    tableValues: null,
    target: null,
    targetX: U,
    targetY: U,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: $e,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: U,
    underlineThickness: U,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: U,
    values: null,
    vAlphabetic: U,
    vMathematical: U,
    vectorEffect: null,
    vHanging: U,
    vIdeographic: U,
    version: null,
    vertAdvY: U,
    vertOriginX: U,
    vertOriginY: U,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: U,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: Jh
}), Yh = In({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: "xlink",
  transform(t, e) {
    return "xlink:" + e.slice(5).toLowerCase();
  }
}), Xh = In({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: Qh
}), Zh = In({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(t, e) {
    return "xml:" + e.slice(3).toLowerCase();
  }
}), iC = {
  classId: "classID",
  dataType: "datatype",
  itemId: "itemID",
  strokeDashArray: "strokeDasharray",
  strokeDashOffset: "strokeDashoffset",
  strokeLineCap: "strokeLinecap",
  strokeLineJoin: "strokeLinejoin",
  strokeMiterLimit: "strokeMiterlimit",
  typeOf: "typeof",
  xLinkActuate: "xlinkActuate",
  xLinkArcRole: "xlinkArcrole",
  xLinkHref: "xlinkHref",
  xLinkRole: "xlinkRole",
  xLinkShow: "xlinkShow",
  xLinkTitle: "xlinkTitle",
  xLinkType: "xlinkType",
  xmlnsXLink: "xmlnsXlink"
}, oC = /[A-Z]/g, al = /-[a-z]/g, sC = /^data[-\w.:]+$/i;
function aC(t, e) {
  const n = so(e);
  let r = e, i = ze;
  if (n in t.normal)
    return t.property[t.normal[n]];
  if (n.length > 4 && n.slice(0, 4) === "data" && sC.test(e)) {
    if (e.charAt(4) === "-") {
      const o = e.slice(5).replace(al, cC);
      r = "data" + o.charAt(0).toUpperCase() + o.slice(1);
    } else {
      const o = e.slice(4);
      if (!al.test(o)) {
        let s = o.replace(oC, lC);
        s.charAt(0) !== "-" && (s = "-" + s), e = "data" + s;
      }
    }
    i = cs;
  }
  return new i(r, e);
}
function lC(t) {
  return "-" + t.toLowerCase();
}
function cC(t) {
  return t.charAt(1).toUpperCase();
}
const uC = Gh([Kh, nC, Yh, Xh, Zh], "html"), us = Gh([Kh, rC, Yh, Xh, Zh], "svg");
function dC(t) {
  return t.join(" ").trim();
}
var ds = {}, ll = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, hC = /\n/g, pC = /^\s*/, mC = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, fC = /^:\s*/, gC = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, bC = /^[;\s]*/, vC = /^\s+|\s+$/g, wC = `
`, cl = "/", ul = "*", jt = "", yC = "comment", xC = "declaration";
function kC(t, e) {
  if (typeof t != "string")
    throw new TypeError("First argument must be a string");
  if (!t)
    return [];
  e = e || {};
  var n = 1, r = 1;
  function i(m) {
    var g = m.match(hC);
    g && (n += g.length);
    var w = m.lastIndexOf(wC);
    r = ~w ? m.length - w : r + m.length;
  }
  function o() {
    var m = { line: n, column: r };
    return function(g) {
      return g.position = new s(m), c(), g;
    };
  }
  function s(m) {
    this.start = m, this.end = { line: n, column: r }, this.source = e.source;
  }
  s.prototype.content = t;
  function a(m) {
    var g = new Error(
      e.source + ":" + n + ":" + r + ": " + m
    );
    if (g.reason = m, g.filename = e.source, g.line = n, g.column = r, g.source = t, !e.silent)
      throw g;
  }
  function l(m) {
    var g = m.exec(t);
    if (g) {
      var w = g[0];
      return i(w), t = t.slice(w.length), g;
    }
  }
  function c() {
    l(pC);
  }
  function d(m) {
    var g;
    for (m = m || []; g = u(); )
      g !== !1 && m.push(g);
    return m;
  }
  function u() {
    var m = o();
    if (!(cl != t.charAt(0) || ul != t.charAt(1))) {
      for (var g = 2; jt != t.charAt(g) && (ul != t.charAt(g) || cl != t.charAt(g + 1)); )
        ++g;
      if (g += 2, jt === t.charAt(g - 1))
        return a("End of comment missing");
      var w = t.slice(2, g - 2);
      return r += 2, i(w), t = t.slice(g), r += 2, m({
        type: yC,
        comment: w
      });
    }
  }
  function h() {
    var m = o(), g = l(mC);
    if (g) {
      if (u(), !l(fC))
        return a("property missing ':'");
      var w = l(gC), b = m({
        type: xC,
        property: dl(g[0].replace(ll, jt)),
        value: w ? dl(w[0].replace(ll, jt)) : jt
      });
      return l(bC), b;
    }
  }
  function p() {
    var m = [];
    d(m);
    for (var g; g = h(); )
      g !== !1 && (m.push(g), d(m));
    return m;
  }
  return c(), p();
}
function dl(t) {
  return t ? t.replace(vC, jt) : jt;
}
var _C = kC, SC = Pr && Pr.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
};
Object.defineProperty(ds, "__esModule", { value: !0 });
ds.default = TC;
const CC = SC(_C);
function TC(t, e) {
  let n = null;
  if (!t || typeof t != "string")
    return n;
  const r = (0, CC.default)(t), i = typeof e == "function";
  return r.forEach((o) => {
    if (o.type !== "declaration")
      return;
    const { property: s, value: a } = o;
    i ? e(s, a, o) : a && (n = n || {}, n[s] = a);
  }), n;
}
var ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
ii.camelCase = void 0;
var IC = /^--[a-zA-Z0-9_-]+$/, AC = /-([a-z])/g, EC = /^[^-]+$/, RC = /^-(webkit|moz|ms|o|khtml)-/, MC = /^-(ms)-/, PC = function(t) {
  return !t || EC.test(t) || IC.test(t);
}, NC = function(t, e) {
  return e.toUpperCase();
}, hl = function(t, e) {
  return "".concat(e, "-");
}, DC = function(t, e) {
  return e === void 0 && (e = {}), PC(t) ? t : (t = t.toLowerCase(), e.reactCompat ? t = t.replace(MC, hl) : t = t.replace(RC, hl), t.replace(AC, NC));
};
ii.camelCase = DC;
var LC = Pr && Pr.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
}, zC = LC(ds), OC = ii;
function co(t, e) {
  var n = {};
  return !t || typeof t != "string" || (0, zC.default)(t, function(r, i) {
    r && i && (n[(0, OC.camelCase)(r, e)] = i);
  }), n;
}
co.default = co;
var $C = co;
const FC = /* @__PURE__ */ Zr($C), ep = tp("end"), hs = tp("start");
function tp(t) {
  return e;
  function e(n) {
    const r = n && n.position && n.position[t] || {};
    if (typeof r.line == "number" && r.line > 0 && typeof r.column == "number" && r.column > 0)
      return {
        line: r.line,
        column: r.column,
        offset: typeof r.offset == "number" && r.offset > -1 ? r.offset : void 0
      };
  }
}
function BC(t) {
  const e = hs(t), n = ep(t);
  if (e && n)
    return { start: e, end: n };
}
function Un(t) {
  return !t || typeof t != "object" ? "" : "position" in t || "type" in t ? pl(t.position) : "start" in t || "end" in t ? pl(t) : "line" in t || "column" in t ? uo(t) : "";
}
function uo(t) {
  return ml(t && t.line) + ":" + ml(t && t.column);
}
function pl(t) {
  return uo(t && t.start) + "-" + uo(t && t.end);
}
function ml(t) {
  return t && typeof t == "number" ? t : 1;
}
class Me extends Error {
  /**
   * Create a message for `reason`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {Options | null | undefined} [options]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // eslint-disable-next-line complexity
  constructor(e, n, r) {
    super(), typeof n == "string" && (r = n, n = void 0);
    let i = "", o = {}, s = !1;
    if (n && ("line" in n && "column" in n ? o = { place: n } : "start" in n && "end" in n ? o = { place: n } : "type" in n ? o = {
      ancestors: [n],
      place: n.position
    } : o = { ...n }), typeof e == "string" ? i = e : !o.cause && e && (s = !0, i = e.message, o.cause = e), !o.ruleId && !o.source && typeof r == "string") {
      const l = r.indexOf(":");
      l === -1 ? o.ruleId = r : (o.source = r.slice(0, l), o.ruleId = r.slice(l + 1));
    }
    if (!o.place && o.ancestors && o.ancestors) {
      const l = o.ancestors[o.ancestors.length - 1];
      l && (o.place = l.position);
    }
    const a = o.place && "start" in o.place ? o.place.start : o.place;
    this.ancestors = o.ancestors || void 0, this.cause = o.cause || void 0, this.column = a ? a.column : void 0, this.fatal = void 0, this.file = "", this.message = i, this.line = a ? a.line : void 0, this.name = Un(o.place) || "1:1", this.place = o.place || void 0, this.reason = this.message, this.ruleId = o.ruleId || void 0, this.source = o.source || void 0, this.stack = s && o.cause && typeof o.cause.stack == "string" ? o.cause.stack : "", this.actual = void 0, this.expected = void 0, this.note = void 0, this.url = void 0;
  }
}
Me.prototype.file = "";
Me.prototype.name = "";
Me.prototype.reason = "";
Me.prototype.message = "";
Me.prototype.stack = "";
Me.prototype.column = void 0;
Me.prototype.line = void 0;
Me.prototype.ancestors = void 0;
Me.prototype.cause = void 0;
Me.prototype.fatal = void 0;
Me.prototype.place = void 0;
Me.prototype.ruleId = void 0;
Me.prototype.source = void 0;
const ps = {}.hasOwnProperty, UC = /* @__PURE__ */ new Map(), jC = /[A-Z]/g, VC = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"]), qC = /* @__PURE__ */ new Set(["td", "th"]), np = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function HC(t, e) {
  if (!e || e.Fragment === void 0)
    throw new TypeError("Expected `Fragment` in options");
  const n = e.filePath || void 0;
  let r;
  if (e.development) {
    if (typeof e.jsxDEV != "function")
      throw new TypeError(
        "Expected `jsxDEV` in options when `development: true`"
      );
    r = ZC(n, e.jsxDEV);
  } else {
    if (typeof e.jsx != "function")
      throw new TypeError("Expected `jsx` in production options");
    if (typeof e.jsxs != "function")
      throw new TypeError("Expected `jsxs` in production options");
    r = XC(n, e.jsx, e.jsxs);
  }
  const i = {
    Fragment: e.Fragment,
    ancestors: [],
    components: e.components || {},
    create: r,
    elementAttributeNameCase: e.elementAttributeNameCase || "react",
    evaluater: e.createEvaluater ? e.createEvaluater() : void 0,
    filePath: n,
    ignoreInvalidStyle: e.ignoreInvalidStyle || !1,
    passKeys: e.passKeys !== !1,
    passNode: e.passNode || !1,
    schema: e.space === "svg" ? us : uC,
    stylePropertyNameCase: e.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: e.tableCellAlignToStyle !== !1
  }, o = rp(i, t, void 0);
  return o && typeof o != "string" ? o : i.create(
    t,
    i.Fragment,
    { children: o || void 0 },
    void 0
  );
}
function rp(t, e, n) {
  if (e.type === "element")
    return WC(t, e, n);
  if (e.type === "mdxFlowExpression" || e.type === "mdxTextExpression")
    return GC(t, e);
  if (e.type === "mdxJsxFlowElement" || e.type === "mdxJsxTextElement")
    return JC(t, e, n);
  if (e.type === "mdxjsEsm")
    return KC(t, e);
  if (e.type === "root")
    return QC(t, e, n);
  if (e.type === "text")
    return YC(t, e);
}
function WC(t, e, n) {
  const r = t.schema;
  let i = r;
  e.tagName.toLowerCase() === "svg" && r.space === "html" && (i = us, t.schema = i), t.ancestors.push(e);
  const o = op(t, e.tagName, !1), s = eT(t, e);
  let a = fs(t, e);
  return VC.has(e.tagName) && (a = a.filter(function(l) {
    return typeof l == "string" ? !eC(l) : !0;
  })), ip(t, s, o, e), ms(s, a), t.ancestors.pop(), t.schema = r, t.create(e, o, s, n);
}
function GC(t, e) {
  if (e.data && e.data.estree && t.evaluater) {
    const r = e.data.estree.body[0];
    return r.type, /** @type {Child | undefined} */
    t.evaluater.evaluateExpression(r.expression);
  }
  Qn(t, e.position);
}
function KC(t, e) {
  if (e.data && e.data.estree && t.evaluater)
    return (
      /** @type {Child | undefined} */
      t.evaluater.evaluateProgram(e.data.estree)
    );
  Qn(t, e.position);
}
function JC(t, e, n) {
  const r = t.schema;
  let i = r;
  e.name === "svg" && r.space === "html" && (i = us, t.schema = i), t.ancestors.push(e);
  const o = e.name === null ? t.Fragment : op(t, e.name, !0), s = tT(t, e), a = fs(t, e);
  return ip(t, s, o, e), ms(s, a), t.ancestors.pop(), t.schema = r, t.create(e, o, s, n);
}
function QC(t, e, n) {
  const r = {};
  return ms(r, fs(t, e)), t.create(e, t.Fragment, r, n);
}
function YC(t, e) {
  return e.value;
}
function ip(t, e, n, r) {
  typeof n != "string" && n !== t.Fragment && t.passNode && (e.node = r);
}
function ms(t, e) {
  if (e.length > 0) {
    const n = e.length > 1 ? e : e[0];
    n && (t.children = n);
  }
}
function XC(t, e, n) {
  return r;
  function r(i, o, s, a) {
    const c = Array.isArray(s.children) ? n : e;
    return a ? c(o, s, a) : c(o, s);
  }
}
function ZC(t, e) {
  return n;
  function n(r, i, o, s) {
    const a = Array.isArray(o.children), l = hs(r);
    return e(
      i,
      o,
      s,
      a,
      {
        columnNumber: l ? l.column - 1 : void 0,
        fileName: t,
        lineNumber: l ? l.line : void 0
      },
      void 0
    );
  }
}
function eT(t, e) {
  const n = {};
  let r, i;
  for (i in e.properties)
    if (i !== "children" && ps.call(e.properties, i)) {
      const o = nT(t, i, e.properties[i]);
      if (o) {
        const [s, a] = o;
        t.tableCellAlignToStyle && s === "align" && typeof a == "string" && qC.has(e.tagName) ? r = a : n[s] = a;
      }
    }
  if (r) {
    const o = (
      /** @type {Style} */
      n.style || (n.style = {})
    );
    o[t.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = r;
  }
  return n;
}
function tT(t, e) {
  const n = {};
  for (const r of e.attributes)
    if (r.type === "mdxJsxExpressionAttribute")
      if (r.data && r.data.estree && t.evaluater) {
        const o = r.data.estree.body[0];
        o.type;
        const s = o.expression;
        s.type;
        const a = s.properties[0];
        a.type, Object.assign(
          n,
          t.evaluater.evaluateExpression(a.argument)
        );
      } else
        Qn(t, e.position);
    else {
      const i = r.name;
      let o;
      if (r.value && typeof r.value == "object")
        if (r.value.data && r.value.data.estree && t.evaluater) {
          const a = r.value.data.estree.body[0];
          a.type, o = t.evaluater.evaluateExpression(a.expression);
        } else
          Qn(t, e.position);
      else
        o = r.value === null ? !0 : r.value;
      n[i] = /** @type {Props[keyof Props]} */
      o;
    }
  return n;
}
function fs(t, e) {
  const n = [];
  let r = -1;
  const i = t.passKeys ? /* @__PURE__ */ new Map() : UC;
  for (; ++r < e.children.length; ) {
    const o = e.children[r];
    let s;
    if (t.passKeys) {
      const l = o.type === "element" ? o.tagName : o.type === "mdxJsxFlowElement" || o.type === "mdxJsxTextElement" ? o.name : void 0;
      if (l) {
        const c = i.get(l) || 0;
        s = l + "-" + c, i.set(l, c + 1);
      }
    }
    const a = rp(t, o, s);
    a !== void 0 && n.push(a);
  }
  return n;
}
function nT(t, e, n) {
  const r = aC(t.schema, e);
  if (!(n == null || typeof n == "number" && Number.isNaN(n))) {
    if (Array.isArray(n) && (n = r.commaSeparated ? JS(n) : dC(n)), r.property === "style") {
      let i = typeof n == "object" ? n : rT(t, String(n));
      return t.stylePropertyNameCase === "css" && (i = iT(i)), ["style", i];
    }
    return [
      t.elementAttributeNameCase === "react" && r.space ? iC[r.property] || r.property : r.attribute,
      n
    ];
  }
}
function rT(t, e) {
  try {
    return FC(e, { reactCompat: !0 });
  } catch (n) {
    if (t.ignoreInvalidStyle)
      return {};
    const r = (
      /** @type {Error} */
      n
    ), i = new Me("Cannot parse `style` attribute", {
      ancestors: t.ancestors,
      cause: r,
      ruleId: "style",
      source: "hast-util-to-jsx-runtime"
    });
    throw i.file = t.filePath || void 0, i.url = np + "#cannot-parse-style-attribute", i;
  }
}
function op(t, e, n) {
  let r;
  if (!n)
    r = { type: "Literal", value: e };
  else if (e.includes(".")) {
    const i = e.split(".");
    let o = -1, s;
    for (; ++o < i.length; ) {
      const a = il(i[o]) ? { type: "Identifier", name: i[o] } : { type: "Literal", value: i[o] };
      s = s ? {
        type: "MemberExpression",
        object: s,
        property: a,
        computed: !!(o && a.type === "Literal"),
        optional: !1
      } : a;
    }
    r = s;
  } else
    r = il(e) && !/^[a-z]/.test(e) ? { type: "Identifier", name: e } : { type: "Literal", value: e };
  if (r.type === "Literal") {
    const i = (
      /** @type {string | number} */
      r.value
    );
    return ps.call(t.components, i) ? t.components[i] : i;
  }
  if (t.evaluater)
    return t.evaluater.evaluateExpression(r);
  Qn(t);
}
function Qn(t, e) {
  const n = new Me(
    "Cannot handle MDX estrees without `createEvaluater`",
    {
      ancestors: t.ancestors,
      place: e,
      ruleId: "mdx-estree",
      source: "hast-util-to-jsx-runtime"
    }
  );
  throw n.file = t.filePath || void 0, n.url = np + "#cannot-handle-mdx-estrees-without-createevaluater", n;
}
function iT(t) {
  const e = {};
  let n;
  for (n in t)
    ps.call(t, n) && (e[oT(n)] = t[n]);
  return e;
}
function oT(t) {
  let e = t.replace(jC, sT);
  return e.slice(0, 3) === "ms-" && (e = "-" + e), e;
}
function sT(t) {
  return "-" + t.toLowerCase();
}
const Ii = {
  action: ["form"],
  cite: ["blockquote", "del", "ins", "q"],
  data: ["object"],
  formAction: ["button", "input"],
  href: ["a", "area", "base", "link"],
  icon: ["menuitem"],
  itemId: null,
  manifest: ["html"],
  ping: ["a", "area"],
  poster: ["video"],
  src: [
    "audio",
    "embed",
    "iframe",
    "img",
    "input",
    "script",
    "source",
    "track",
    "video"
  ]
}, aT = {};
function gs(t, e) {
  const n = e || aT, r = typeof n.includeImageAlt == "boolean" ? n.includeImageAlt : !0, i = typeof n.includeHtml == "boolean" ? n.includeHtml : !0;
  return sp(t, r, i);
}
function sp(t, e, n) {
  if (lT(t)) {
    if ("value" in t)
      return t.type === "html" && !n ? "" : t.value;
    if (e && "alt" in t && t.alt)
      return t.alt;
    if ("children" in t)
      return fl(t.children, e, n);
  }
  return Array.isArray(t) ? fl(t, e, n) : "";
}
function fl(t, e, n) {
  const r = [];
  let i = -1;
  for (; ++i < t.length; )
    r[i] = sp(t[i], e, n);
  return r.join("");
}
function lT(t) {
  return !!(t && typeof t == "object");
}
const gl = document.createElement("i");
function bs(t) {
  const e = "&" + t + ";";
  gl.innerHTML = e;
  const n = gl.textContent;
  return n.charCodeAt(n.length - 1) === 59 && t !== "semi" || n === e ? !1 : n;
}
function Be(t, e, n, r) {
  const i = t.length;
  let o = 0, s;
  if (e < 0 ? e = -e > i ? 0 : i + e : e = e > i ? i : e, n = n > 0 ? n : 0, r.length < 1e4)
    s = Array.from(r), s.unshift(e, n), t.splice(...s);
  else
    for (n && t.splice(e, n); o < r.length; )
      s = r.slice(o, o + 1e4), s.unshift(e, 0), t.splice(...s), o += 1e4, e += 1e4;
}
function Ve(t, e) {
  return t.length > 0 ? (Be(t, t.length, 0, e), t) : e;
}
const bl = {}.hasOwnProperty;
function ap(t) {
  const e = {};
  let n = -1;
  for (; ++n < t.length; )
    cT(e, t[n]);
  return e;
}
function cT(t, e) {
  let n;
  for (n in e) {
    const i = (bl.call(t, n) ? t[n] : void 0) || (t[n] = {}), o = e[n];
    let s;
    if (o)
      for (s in o) {
        bl.call(i, s) || (i[s] = []);
        const a = o[s];
        uT(
          // @ts-expect-error Looks like a list.
          i[s],
          Array.isArray(a) ? a : a ? [a] : []
        );
      }
  }
}
function uT(t, e) {
  let n = -1;
  const r = [];
  for (; ++n < e.length; )
    (e[n].add === "after" ? t : r).push(e[n]);
  Be(t, 0, 0, r);
}
function lp(t, e) {
  const n = Number.parseInt(t, e);
  return (
    // C0 except for HT, LF, FF, CR, space.
    n < 9 || n === 11 || n > 13 && n < 32 || // Control character (DEL) of C0, and C1 controls.
    n > 126 && n < 160 || // Lone high surrogates and low surrogates.
    n > 55295 && n < 57344 || // Noncharacters.
    n > 64975 && n < 65008 || /* eslint-disable no-bitwise */
    (n & 65535) === 65535 || (n & 65535) === 65534 || /* eslint-enable no-bitwise */
    // Out of range
    n > 1114111 ? "�" : String.fromCodePoint(n)
  );
}
function rt(t) {
  return t.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
const Ne = Nt(/[A-Za-z]/), Re = Nt(/[\dA-Za-z]/), dT = Nt(/[#-'*+\--9=?A-Z^-~]/);
function Ur(t) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    t !== null && (t < 32 || t === 127)
  );
}
const ho = Nt(/\d/), hT = Nt(/[\dA-Fa-f]/), pT = Nt(/[!-/:-@[-`{-~]/);
function X(t) {
  return t !== null && t < -2;
}
function ve(t) {
  return t !== null && (t < 0 || t === 32);
}
function se(t) {
  return t === -2 || t === -1 || t === 32;
}
const oi = Nt(/\p{P}|\p{S}/u), Jt = Nt(/\s/);
function Nt(t) {
  return e;
  function e(n) {
    return n !== null && n > -1 && t.test(String.fromCharCode(n));
  }
}
function An(t) {
  const e = [];
  let n = -1, r = 0, i = 0;
  for (; ++n < t.length; ) {
    const o = t.charCodeAt(n);
    let s = "";
    if (o === 37 && Re(t.charCodeAt(n + 1)) && Re(t.charCodeAt(n + 2)))
      i = 2;
    else if (o < 128)
      /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(o)) || (s = String.fromCharCode(o));
    else if (o > 55295 && o < 57344) {
      const a = t.charCodeAt(n + 1);
      o < 56320 && a > 56319 && a < 57344 ? (s = String.fromCharCode(o, a), i = 1) : s = "�";
    } else
      s = String.fromCharCode(o);
    s && (e.push(t.slice(r, n), encodeURIComponent(s)), r = n + i + 1, s = ""), i && (n += i, i = 0);
  }
  return e.join("") + t.slice(r);
}
function le(t, e, n, r) {
  const i = r ? r - 1 : Number.POSITIVE_INFINITY;
  let o = 0;
  return s;
  function s(l) {
    return se(l) ? (t.enter(n), a(l)) : e(l);
  }
  function a(l) {
    return se(l) && o++ < i ? (t.consume(l), a) : (t.exit(n), e(l));
  }
}
const mT = {
  tokenize: fT
};
function fT(t) {
  const e = t.attempt(this.parser.constructs.contentInitial, r, i);
  let n;
  return e;
  function r(a) {
    if (a === null) {
      t.consume(a);
      return;
    }
    return t.enter("lineEnding"), t.consume(a), t.exit("lineEnding"), le(t, e, "linePrefix");
  }
  function i(a) {
    return t.enter("paragraph"), o(a);
  }
  function o(a) {
    const l = t.enter("chunkText", {
      contentType: "text",
      previous: n
    });
    return n && (n.next = l), n = l, s(a);
  }
  function s(a) {
    if (a === null) {
      t.exit("chunkText"), t.exit("paragraph"), t.consume(a);
      return;
    }
    return X(a) ? (t.consume(a), t.exit("chunkText"), o) : (t.consume(a), s);
  }
}
const gT = {
  tokenize: bT
}, vl = {
  tokenize: vT
};
function bT(t) {
  const e = this, n = [];
  let r = 0, i, o, s;
  return a;
  function a(x) {
    if (r < n.length) {
      const T = n[r];
      return e.containerState = T[1], t.attempt(T[0].continuation, l, c)(x);
    }
    return c(x);
  }
  function l(x) {
    if (r++, e.containerState._closeFlow) {
      e.containerState._closeFlow = void 0, i && k();
      const T = e.events.length;
      let I = T, y;
      for (; I--; )
        if (e.events[I][0] === "exit" && e.events[I][1].type === "chunkFlow") {
          y = e.events[I][1].end;
          break;
        }
      b(r);
      let M = T;
      for (; M < e.events.length; )
        e.events[M][1].end = {
          ...y
        }, M++;
      return Be(e.events, I + 1, 0, e.events.slice(T)), e.events.length = M, c(x);
    }
    return a(x);
  }
  function c(x) {
    if (r === n.length) {
      if (!i)
        return h(x);
      if (i.currentConstruct && i.currentConstruct.concrete)
        return m(x);
      e.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
    }
    return e.containerState = {}, t.check(vl, d, u)(x);
  }
  function d(x) {
    return i && k(), b(r), h(x);
  }
  function u(x) {
    return e.parser.lazy[e.now().line] = r !== n.length, s = e.now().offset, m(x);
  }
  function h(x) {
    return e.containerState = {}, t.attempt(vl, p, m)(x);
  }
  function p(x) {
    return r++, n.push([e.currentConstruct, e.containerState]), h(x);
  }
  function m(x) {
    if (x === null) {
      i && k(), b(0), t.consume(x);
      return;
    }
    return i = i || e.parser.flow(e.now()), t.enter("chunkFlow", {
      _tokenizer: i,
      contentType: "flow",
      previous: o
    }), g(x);
  }
  function g(x) {
    if (x === null) {
      w(t.exit("chunkFlow"), !0), b(0), t.consume(x);
      return;
    }
    return X(x) ? (t.consume(x), w(t.exit("chunkFlow")), r = 0, e.interrupt = void 0, a) : (t.consume(x), g);
  }
  function w(x, T) {
    const I = e.sliceStream(x);
    if (T && I.push(null), x.previous = o, o && (o.next = x), o = x, i.defineSkip(x.start), i.write(I), e.parser.lazy[x.start.line]) {
      let y = i.events.length;
      for (; y--; )
        if (
          // The token starts before the line ending…
          i.events[y][1].start.offset < s && // …and either is not ended yet…
          (!i.events[y][1].end || // …or ends after it.
          i.events[y][1].end.offset > s)
        )
          return;
      const M = e.events.length;
      let E = M, N, _;
      for (; E--; )
        if (e.events[E][0] === "exit" && e.events[E][1].type === "chunkFlow") {
          if (N) {
            _ = e.events[E][1].end;
            break;
          }
          N = !0;
        }
      for (b(r), y = M; y < e.events.length; )
        e.events[y][1].end = {
          ..._
        }, y++;
      Be(e.events, E + 1, 0, e.events.slice(M)), e.events.length = y;
    }
  }
  function b(x) {
    let T = n.length;
    for (; T-- > x; ) {
      const I = n[T];
      e.containerState = I[1], I[0].exit.call(e, t);
    }
    n.length = x;
  }
  function k() {
    i.write([null]), o = void 0, i = void 0, e.containerState._closeFlow = void 0;
  }
}
function vT(t, e, n) {
  return le(t, t.attempt(this.parser.constructs.document, e, n), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
function kn(t) {
  if (t === null || ve(t) || Jt(t))
    return 1;
  if (oi(t))
    return 2;
}
function si(t, e, n) {
  const r = [];
  let i = -1;
  for (; ++i < t.length; ) {
    const o = t[i].resolveAll;
    o && !r.includes(o) && (e = o(e, n), r.push(o));
  }
  return e;
}
const po = {
  name: "attention",
  resolveAll: wT,
  tokenize: yT
};
function wT(t, e) {
  let n = -1, r, i, o, s, a, l, c, d;
  for (; ++n < t.length; )
    if (t[n][0] === "enter" && t[n][1].type === "attentionSequence" && t[n][1]._close) {
      for (r = n; r--; )
        if (t[r][0] === "exit" && t[r][1].type === "attentionSequence" && t[r][1]._open && // If the markers are the same:
        e.sliceSerialize(t[r][1]).charCodeAt(0) === e.sliceSerialize(t[n][1]).charCodeAt(0)) {
          if ((t[r][1]._close || t[n][1]._open) && (t[n][1].end.offset - t[n][1].start.offset) % 3 && !((t[r][1].end.offset - t[r][1].start.offset + t[n][1].end.offset - t[n][1].start.offset) % 3))
            continue;
          l = t[r][1].end.offset - t[r][1].start.offset > 1 && t[n][1].end.offset - t[n][1].start.offset > 1 ? 2 : 1;
          const u = {
            ...t[r][1].end
          }, h = {
            ...t[n][1].start
          };
          wl(u, -l), wl(h, l), s = {
            type: l > 1 ? "strongSequence" : "emphasisSequence",
            start: u,
            end: {
              ...t[r][1].end
            }
          }, a = {
            type: l > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...t[n][1].start
            },
            end: h
          }, o = {
            type: l > 1 ? "strongText" : "emphasisText",
            start: {
              ...t[r][1].end
            },
            end: {
              ...t[n][1].start
            }
          }, i = {
            type: l > 1 ? "strong" : "emphasis",
            start: {
              ...s.start
            },
            end: {
              ...a.end
            }
          }, t[r][1].end = {
            ...s.start
          }, t[n][1].start = {
            ...a.end
          }, c = [], t[r][1].end.offset - t[r][1].start.offset && (c = Ve(c, [["enter", t[r][1], e], ["exit", t[r][1], e]])), c = Ve(c, [["enter", i, e], ["enter", s, e], ["exit", s, e], ["enter", o, e]]), c = Ve(c, si(e.parser.constructs.insideSpan.null, t.slice(r + 1, n), e)), c = Ve(c, [["exit", o, e], ["enter", a, e], ["exit", a, e], ["exit", i, e]]), t[n][1].end.offset - t[n][1].start.offset ? (d = 2, c = Ve(c, [["enter", t[n][1], e], ["exit", t[n][1], e]])) : d = 0, Be(t, r - 1, n - r + 3, c), n = r + c.length - d - 2;
          break;
        }
    }
  for (n = -1; ++n < t.length; )
    t[n][1].type === "attentionSequence" && (t[n][1].type = "data");
  return t;
}
function yT(t, e) {
  const n = this.parser.constructs.attentionMarkers.null, r = this.previous, i = kn(r);
  let o;
  return s;
  function s(l) {
    return o = l, t.enter("attentionSequence"), a(l);
  }
  function a(l) {
    if (l === o)
      return t.consume(l), a;
    const c = t.exit("attentionSequence"), d = kn(l), u = !d || d === 2 && i || n.includes(l), h = !i || i === 2 && d || n.includes(r);
    return c._open = !!(o === 42 ? u : u && (i || !h)), c._close = !!(o === 42 ? h : h && (d || !u)), e(l);
  }
}
function wl(t, e) {
  t.column += e, t.offset += e, t._bufferIndex += e;
}
const xT = {
  name: "autolink",
  tokenize: kT
};
function kT(t, e, n) {
  let r = 0;
  return i;
  function i(p) {
    return t.enter("autolink"), t.enter("autolinkMarker"), t.consume(p), t.exit("autolinkMarker"), t.enter("autolinkProtocol"), o;
  }
  function o(p) {
    return Ne(p) ? (t.consume(p), s) : p === 64 ? n(p) : c(p);
  }
  function s(p) {
    return p === 43 || p === 45 || p === 46 || Re(p) ? (r = 1, a(p)) : c(p);
  }
  function a(p) {
    return p === 58 ? (t.consume(p), r = 0, l) : (p === 43 || p === 45 || p === 46 || Re(p)) && r++ < 32 ? (t.consume(p), a) : (r = 0, c(p));
  }
  function l(p) {
    return p === 62 ? (t.exit("autolinkProtocol"), t.enter("autolinkMarker"), t.consume(p), t.exit("autolinkMarker"), t.exit("autolink"), e) : p === null || p === 32 || p === 60 || Ur(p) ? n(p) : (t.consume(p), l);
  }
  function c(p) {
    return p === 64 ? (t.consume(p), d) : dT(p) ? (t.consume(p), c) : n(p);
  }
  function d(p) {
    return Re(p) ? u(p) : n(p);
  }
  function u(p) {
    return p === 46 ? (t.consume(p), r = 0, d) : p === 62 ? (t.exit("autolinkProtocol").type = "autolinkEmail", t.enter("autolinkMarker"), t.consume(p), t.exit("autolinkMarker"), t.exit("autolink"), e) : h(p);
  }
  function h(p) {
    if ((p === 45 || Re(p)) && r++ < 63) {
      const m = p === 45 ? h : u;
      return t.consume(p), m;
    }
    return n(p);
  }
}
const ar = {
  partial: !0,
  tokenize: _T
};
function _T(t, e, n) {
  return r;
  function r(o) {
    return se(o) ? le(t, i, "linePrefix")(o) : i(o);
  }
  function i(o) {
    return o === null || X(o) ? e(o) : n(o);
  }
}
const cp = {
  continuation: {
    tokenize: CT
  },
  exit: TT,
  name: "blockQuote",
  tokenize: ST
};
function ST(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    if (s === 62) {
      const a = r.containerState;
      return a.open || (t.enter("blockQuote", {
        _container: !0
      }), a.open = !0), t.enter("blockQuotePrefix"), t.enter("blockQuoteMarker"), t.consume(s), t.exit("blockQuoteMarker"), o;
    }
    return n(s);
  }
  function o(s) {
    return se(s) ? (t.enter("blockQuotePrefixWhitespace"), t.consume(s), t.exit("blockQuotePrefixWhitespace"), t.exit("blockQuotePrefix"), e) : (t.exit("blockQuotePrefix"), e(s));
  }
}
function CT(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return se(s) ? le(t, o, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(s) : o(s);
  }
  function o(s) {
    return t.attempt(cp, e, n)(s);
  }
}
function TT(t) {
  t.exit("blockQuote");
}
const up = {
  name: "characterEscape",
  tokenize: IT
};
function IT(t, e, n) {
  return r;
  function r(o) {
    return t.enter("characterEscape"), t.enter("escapeMarker"), t.consume(o), t.exit("escapeMarker"), i;
  }
  function i(o) {
    return pT(o) ? (t.enter("characterEscapeValue"), t.consume(o), t.exit("characterEscapeValue"), t.exit("characterEscape"), e) : n(o);
  }
}
const dp = {
  name: "characterReference",
  tokenize: AT
};
function AT(t, e, n) {
  const r = this;
  let i = 0, o, s;
  return a;
  function a(u) {
    return t.enter("characterReference"), t.enter("characterReferenceMarker"), t.consume(u), t.exit("characterReferenceMarker"), l;
  }
  function l(u) {
    return u === 35 ? (t.enter("characterReferenceMarkerNumeric"), t.consume(u), t.exit("characterReferenceMarkerNumeric"), c) : (t.enter("characterReferenceValue"), o = 31, s = Re, d(u));
  }
  function c(u) {
    return u === 88 || u === 120 ? (t.enter("characterReferenceMarkerHexadecimal"), t.consume(u), t.exit("characterReferenceMarkerHexadecimal"), t.enter("characterReferenceValue"), o = 6, s = hT, d) : (t.enter("characterReferenceValue"), o = 7, s = ho, d(u));
  }
  function d(u) {
    if (u === 59 && i) {
      const h = t.exit("characterReferenceValue");
      return s === Re && !bs(r.sliceSerialize(h)) ? n(u) : (t.enter("characterReferenceMarker"), t.consume(u), t.exit("characterReferenceMarker"), t.exit("characterReference"), e);
    }
    return s(u) && i++ < o ? (t.consume(u), d) : n(u);
  }
}
const yl = {
  partial: !0,
  tokenize: RT
}, xl = {
  concrete: !0,
  name: "codeFenced",
  tokenize: ET
};
function ET(t, e, n) {
  const r = this, i = {
    partial: !0,
    tokenize: I
  };
  let o = 0, s = 0, a;
  return l;
  function l(y) {
    return c(y);
  }
  function c(y) {
    const M = r.events[r.events.length - 1];
    return o = M && M[1].type === "linePrefix" ? M[2].sliceSerialize(M[1], !0).length : 0, a = y, t.enter("codeFenced"), t.enter("codeFencedFence"), t.enter("codeFencedFenceSequence"), d(y);
  }
  function d(y) {
    return y === a ? (s++, t.consume(y), d) : s < 3 ? n(y) : (t.exit("codeFencedFenceSequence"), se(y) ? le(t, u, "whitespace")(y) : u(y));
  }
  function u(y) {
    return y === null || X(y) ? (t.exit("codeFencedFence"), r.interrupt ? e(y) : t.check(yl, g, T)(y)) : (t.enter("codeFencedFenceInfo"), t.enter("chunkString", {
      contentType: "string"
    }), h(y));
  }
  function h(y) {
    return y === null || X(y) ? (t.exit("chunkString"), t.exit("codeFencedFenceInfo"), u(y)) : se(y) ? (t.exit("chunkString"), t.exit("codeFencedFenceInfo"), le(t, p, "whitespace")(y)) : y === 96 && y === a ? n(y) : (t.consume(y), h);
  }
  function p(y) {
    return y === null || X(y) ? u(y) : (t.enter("codeFencedFenceMeta"), t.enter("chunkString", {
      contentType: "string"
    }), m(y));
  }
  function m(y) {
    return y === null || X(y) ? (t.exit("chunkString"), t.exit("codeFencedFenceMeta"), u(y)) : y === 96 && y === a ? n(y) : (t.consume(y), m);
  }
  function g(y) {
    return t.attempt(i, T, w)(y);
  }
  function w(y) {
    return t.enter("lineEnding"), t.consume(y), t.exit("lineEnding"), b;
  }
  function b(y) {
    return o > 0 && se(y) ? le(t, k, "linePrefix", o + 1)(y) : k(y);
  }
  function k(y) {
    return y === null || X(y) ? t.check(yl, g, T)(y) : (t.enter("codeFlowValue"), x(y));
  }
  function x(y) {
    return y === null || X(y) ? (t.exit("codeFlowValue"), k(y)) : (t.consume(y), x);
  }
  function T(y) {
    return t.exit("codeFenced"), e(y);
  }
  function I(y, M, E) {
    let N = 0;
    return _;
    function _(z) {
      return y.enter("lineEnding"), y.consume(z), y.exit("lineEnding"), A;
    }
    function A(z) {
      return y.enter("codeFencedFence"), se(z) ? le(y, P, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(z) : P(z);
    }
    function P(z) {
      return z === a ? (y.enter("codeFencedFenceSequence"), D(z)) : E(z);
    }
    function D(z) {
      return z === a ? (N++, y.consume(z), D) : N >= s ? (y.exit("codeFencedFenceSequence"), se(z) ? le(y, O, "whitespace")(z) : O(z)) : E(z);
    }
    function O(z) {
      return z === null || X(z) ? (y.exit("codeFencedFence"), M(z)) : E(z);
    }
  }
}
function RT(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return s === null ? n(s) : (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), o);
  }
  function o(s) {
    return r.parser.lazy[r.now().line] ? n(s) : e(s);
  }
}
const Ai = {
  name: "codeIndented",
  tokenize: PT
}, MT = {
  partial: !0,
  tokenize: NT
};
function PT(t, e, n) {
  const r = this;
  return i;
  function i(c) {
    return t.enter("codeIndented"), le(t, o, "linePrefix", 4 + 1)(c);
  }
  function o(c) {
    const d = r.events[r.events.length - 1];
    return d && d[1].type === "linePrefix" && d[2].sliceSerialize(d[1], !0).length >= 4 ? s(c) : n(c);
  }
  function s(c) {
    return c === null ? l(c) : X(c) ? t.attempt(MT, s, l)(c) : (t.enter("codeFlowValue"), a(c));
  }
  function a(c) {
    return c === null || X(c) ? (t.exit("codeFlowValue"), s(c)) : (t.consume(c), a);
  }
  function l(c) {
    return t.exit("codeIndented"), e(c);
  }
}
function NT(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return r.parser.lazy[r.now().line] ? n(s) : X(s) ? (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), i) : le(t, o, "linePrefix", 4 + 1)(s);
  }
  function o(s) {
    const a = r.events[r.events.length - 1];
    return a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? e(s) : X(s) ? i(s) : n(s);
  }
}
const DT = {
  name: "codeText",
  previous: zT,
  resolve: LT,
  tokenize: OT
};
function LT(t) {
  let e = t.length - 4, n = 3, r, i;
  if ((t[n][1].type === "lineEnding" || t[n][1].type === "space") && (t[e][1].type === "lineEnding" || t[e][1].type === "space")) {
    for (r = n; ++r < e; )
      if (t[r][1].type === "codeTextData") {
        t[n][1].type = "codeTextPadding", t[e][1].type = "codeTextPadding", n += 2, e -= 2;
        break;
      }
  }
  for (r = n - 1, e++; ++r <= e; )
    i === void 0 ? r !== e && t[r][1].type !== "lineEnding" && (i = r) : (r === e || t[r][1].type === "lineEnding") && (t[i][1].type = "codeTextData", r !== i + 2 && (t[i][1].end = t[r - 1][1].end, t.splice(i + 2, r - i - 2), e -= r - i - 2, r = i + 2), i = void 0);
  return t;
}
function zT(t) {
  return t !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function OT(t, e, n) {
  let r = 0, i, o;
  return s;
  function s(u) {
    return t.enter("codeText"), t.enter("codeTextSequence"), a(u);
  }
  function a(u) {
    return u === 96 ? (t.consume(u), r++, a) : (t.exit("codeTextSequence"), l(u));
  }
  function l(u) {
    return u === null ? n(u) : u === 32 ? (t.enter("space"), t.consume(u), t.exit("space"), l) : u === 96 ? (o = t.enter("codeTextSequence"), i = 0, d(u)) : X(u) ? (t.enter("lineEnding"), t.consume(u), t.exit("lineEnding"), l) : (t.enter("codeTextData"), c(u));
  }
  function c(u) {
    return u === null || u === 32 || u === 96 || X(u) ? (t.exit("codeTextData"), l(u)) : (t.consume(u), c);
  }
  function d(u) {
    return u === 96 ? (t.consume(u), i++, d) : i === r ? (t.exit("codeTextSequence"), t.exit("codeText"), e(u)) : (o.type = "codeTextData", c(u));
  }
}
class $T {
  /**
   * @param {ReadonlyArray<T> | null | undefined} [initial]
   *   Initial items (optional).
   * @returns
   *   Splice buffer.
   */
  constructor(e) {
    this.left = e ? [...e] : [], this.right = [];
  }
  /**
   * Array access;
   * does not move the cursor.
   *
   * @param {number} index
   *   Index.
   * @return {T}
   *   Item.
   */
  get(e) {
    if (e < 0 || e >= this.left.length + this.right.length)
      throw new RangeError("Cannot access index `" + e + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
    return e < this.left.length ? this.left[e] : this.right[this.right.length - e + this.left.length - 1];
  }
  /**
   * The length of the splice buffer, one greater than the largest index in the
   * array.
   */
  get length() {
    return this.left.length + this.right.length;
  }
  /**
   * Remove and return `list[0]`;
   * moves the cursor to `0`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  shift() {
    return this.setCursor(0), this.right.pop();
  }
  /**
   * Slice the buffer to get an array;
   * does not move the cursor.
   *
   * @param {number} start
   *   Start.
   * @param {number | null | undefined} [end]
   *   End (optional).
   * @returns {Array<T>}
   *   Array of items.
   */
  slice(e, n) {
    const r = n ?? Number.POSITIVE_INFINITY;
    return r < this.left.length ? this.left.slice(e, r) : e > this.left.length ? this.right.slice(this.right.length - r + this.left.length, this.right.length - e + this.left.length).reverse() : this.left.slice(e).concat(this.right.slice(this.right.length - r + this.left.length).reverse());
  }
  /**
   * Mimics the behavior of Array.prototype.splice() except for the change of
   * interface necessary to avoid segfaults when patching in very large arrays.
   *
   * This operation moves cursor is moved to `start` and results in the cursor
   * placed after any inserted items.
   *
   * @param {number} start
   *   Start;
   *   zero-based index at which to start changing the array;
   *   negative numbers count backwards from the end of the array and values
   *   that are out-of bounds are clamped to the appropriate end of the array.
   * @param {number | null | undefined} [deleteCount=0]
   *   Delete count (default: `0`);
   *   maximum number of elements to delete, starting from start.
   * @param {Array<T> | null | undefined} [items=[]]
   *   Items to include in place of the deleted items (default: `[]`).
   * @return {Array<T>}
   *   Any removed items.
   */
  splice(e, n, r) {
    const i = n || 0;
    this.setCursor(Math.trunc(e));
    const o = this.right.splice(this.right.length - i, Number.POSITIVE_INFINITY);
    return r && zn(this.left, r), o.reverse();
  }
  /**
   * Remove and return the highest-numbered item in the array, so
   * `list[list.length - 1]`;
   * Moves the cursor to `length`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  pop() {
    return this.setCursor(Number.POSITIVE_INFINITY), this.left.pop();
  }
  /**
   * Inserts a single item to the high-numbered side of the array;
   * moves the cursor to `length`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  push(e) {
    this.setCursor(Number.POSITIVE_INFINITY), this.left.push(e);
  }
  /**
   * Inserts many items to the high-numbered side of the array.
   * Moves the cursor to `length`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  pushMany(e) {
    this.setCursor(Number.POSITIVE_INFINITY), zn(this.left, e);
  }
  /**
   * Inserts a single item to the low-numbered side of the array;
   * Moves the cursor to `0`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  unshift(e) {
    this.setCursor(0), this.right.push(e);
  }
  /**
   * Inserts many items to the low-numbered side of the array;
   * moves the cursor to `0`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  unshiftMany(e) {
    this.setCursor(0), zn(this.right, e.reverse());
  }
  /**
   * Move the cursor to a specific position in the array. Requires
   * time proportional to the distance moved.
   *
   * If `n < 0`, the cursor will end up at the beginning.
   * If `n > length`, the cursor will end up at the end.
   *
   * @param {number} n
   *   Position.
   * @return {undefined}
   *   Nothing.
   */
  setCursor(e) {
    if (!(e === this.left.length || e > this.left.length && this.right.length === 0 || e < 0 && this.left.length === 0))
      if (e < this.left.length) {
        const n = this.left.splice(e, Number.POSITIVE_INFINITY);
        zn(this.right, n.reverse());
      } else {
        const n = this.right.splice(this.left.length + this.right.length - e, Number.POSITIVE_INFINITY);
        zn(this.left, n.reverse());
      }
  }
}
function zn(t, e) {
  let n = 0;
  if (e.length < 1e4)
    t.push(...e);
  else
    for (; n < e.length; )
      t.push(...e.slice(n, n + 1e4)), n += 1e4;
}
function hp(t) {
  const e = {};
  let n = -1, r, i, o, s, a, l, c;
  const d = new $T(t);
  for (; ++n < d.length; ) {
    for (; n in e; )
      n = e[n];
    if (r = d.get(n), n && r[1].type === "chunkFlow" && d.get(n - 1)[1].type === "listItemPrefix" && (l = r[1]._tokenizer.events, o = 0, o < l.length && l[o][1].type === "lineEndingBlank" && (o += 2), o < l.length && l[o][1].type === "content"))
      for (; ++o < l.length && l[o][1].type !== "content"; )
        l[o][1].type === "chunkText" && (l[o][1]._isInFirstContentOfListItem = !0, o++);
    if (r[0] === "enter")
      r[1].contentType && (Object.assign(e, FT(d, n)), n = e[n], c = !0);
    else if (r[1]._container) {
      for (o = n, i = void 0; o--; )
        if (s = d.get(o), s[1].type === "lineEnding" || s[1].type === "lineEndingBlank")
          s[0] === "enter" && (i && (d.get(i)[1].type = "lineEndingBlank"), s[1].type = "lineEnding", i = o);
        else if (!(s[1].type === "linePrefix" || s[1].type === "listItemIndent"))
          break;
      i && (r[1].end = {
        ...d.get(i)[1].start
      }, a = d.slice(i, n), a.unshift(r), d.splice(i, n - i + 1, a));
    }
  }
  return Be(t, 0, Number.POSITIVE_INFINITY, d.slice(0)), !c;
}
function FT(t, e) {
  const n = t.get(e)[1], r = t.get(e)[2];
  let i = e - 1;
  const o = [];
  let s = n._tokenizer;
  s || (s = r.parser[n.contentType](n.start), n._contentTypeTextTrailing && (s._contentTypeTextTrailing = !0));
  const a = s.events, l = [], c = {};
  let d, u, h = -1, p = n, m = 0, g = 0;
  const w = [g];
  for (; p; ) {
    for (; t.get(++i)[1] !== p; )
      ;
    o.push(i), p._tokenizer || (d = r.sliceStream(p), p.next || d.push(null), u && s.defineSkip(p.start), p._isInFirstContentOfListItem && (s._gfmTasklistFirstContentOfListItem = !0), s.write(d), p._isInFirstContentOfListItem && (s._gfmTasklistFirstContentOfListItem = void 0)), u = p, p = p.next;
  }
  for (p = n; ++h < a.length; )
    // Find a void token that includes a break.
    a[h][0] === "exit" && a[h - 1][0] === "enter" && a[h][1].type === a[h - 1][1].type && a[h][1].start.line !== a[h][1].end.line && (g = h + 1, w.push(g), p._tokenizer = void 0, p.previous = void 0, p = p.next);
  for (s.events = [], p ? (p._tokenizer = void 0, p.previous = void 0) : w.pop(), h = w.length; h--; ) {
    const b = a.slice(w[h], w[h + 1]), k = o.pop();
    l.push([k, k + b.length - 1]), t.splice(k, 2, b);
  }
  for (l.reverse(), h = -1; ++h < l.length; )
    c[m + l[h][0]] = m + l[h][1], m += l[h][1] - l[h][0] - 1;
  return c;
}
const BT = {
  resolve: jT,
  tokenize: VT
}, UT = {
  partial: !0,
  tokenize: qT
};
function jT(t) {
  return hp(t), t;
}
function VT(t, e) {
  let n;
  return r;
  function r(a) {
    return t.enter("content"), n = t.enter("chunkContent", {
      contentType: "content"
    }), i(a);
  }
  function i(a) {
    return a === null ? o(a) : X(a) ? t.check(UT, s, o)(a) : (t.consume(a), i);
  }
  function o(a) {
    return t.exit("chunkContent"), t.exit("content"), e(a);
  }
  function s(a) {
    return t.consume(a), t.exit("chunkContent"), n.next = t.enter("chunkContent", {
      contentType: "content",
      previous: n
    }), n = n.next, i;
  }
}
function qT(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return t.exit("chunkContent"), t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), le(t, o, "linePrefix");
  }
  function o(s) {
    if (s === null || X(s))
      return n(s);
    const a = r.events[r.events.length - 1];
    return !r.parser.constructs.disable.null.includes("codeIndented") && a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? e(s) : t.interrupt(r.parser.constructs.flow, n, e)(s);
  }
}
function pp(t, e, n, r, i, o, s, a, l) {
  const c = l || Number.POSITIVE_INFINITY;
  let d = 0;
  return u;
  function u(b) {
    return b === 60 ? (t.enter(r), t.enter(i), t.enter(o), t.consume(b), t.exit(o), h) : b === null || b === 32 || b === 41 || Ur(b) ? n(b) : (t.enter(r), t.enter(s), t.enter(a), t.enter("chunkString", {
      contentType: "string"
    }), g(b));
  }
  function h(b) {
    return b === 62 ? (t.enter(o), t.consume(b), t.exit(o), t.exit(i), t.exit(r), e) : (t.enter(a), t.enter("chunkString", {
      contentType: "string"
    }), p(b));
  }
  function p(b) {
    return b === 62 ? (t.exit("chunkString"), t.exit(a), h(b)) : b === null || b === 60 || X(b) ? n(b) : (t.consume(b), b === 92 ? m : p);
  }
  function m(b) {
    return b === 60 || b === 62 || b === 92 ? (t.consume(b), p) : p(b);
  }
  function g(b) {
    return !d && (b === null || b === 41 || ve(b)) ? (t.exit("chunkString"), t.exit(a), t.exit(s), t.exit(r), e(b)) : d < c && b === 40 ? (t.consume(b), d++, g) : b === 41 ? (t.consume(b), d--, g) : b === null || b === 32 || b === 40 || Ur(b) ? n(b) : (t.consume(b), b === 92 ? w : g);
  }
  function w(b) {
    return b === 40 || b === 41 || b === 92 ? (t.consume(b), g) : g(b);
  }
}
function mp(t, e, n, r, i, o) {
  const s = this;
  let a = 0, l;
  return c;
  function c(p) {
    return t.enter(r), t.enter(i), t.consume(p), t.exit(i), t.enter(o), d;
  }
  function d(p) {
    return a > 999 || p === null || p === 91 || p === 93 && !l || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    p === 94 && !a && "_hiddenFootnoteSupport" in s.parser.constructs ? n(p) : p === 93 ? (t.exit(o), t.enter(i), t.consume(p), t.exit(i), t.exit(r), e) : X(p) ? (t.enter("lineEnding"), t.consume(p), t.exit("lineEnding"), d) : (t.enter("chunkString", {
      contentType: "string"
    }), u(p));
  }
  function u(p) {
    return p === null || p === 91 || p === 93 || X(p) || a++ > 999 ? (t.exit("chunkString"), d(p)) : (t.consume(p), l || (l = !se(p)), p === 92 ? h : u);
  }
  function h(p) {
    return p === 91 || p === 92 || p === 93 ? (t.consume(p), a++, u) : u(p);
  }
}
function fp(t, e, n, r, i, o) {
  let s;
  return a;
  function a(h) {
    return h === 34 || h === 39 || h === 40 ? (t.enter(r), t.enter(i), t.consume(h), t.exit(i), s = h === 40 ? 41 : h, l) : n(h);
  }
  function l(h) {
    return h === s ? (t.enter(i), t.consume(h), t.exit(i), t.exit(r), e) : (t.enter(o), c(h));
  }
  function c(h) {
    return h === s ? (t.exit(o), l(s)) : h === null ? n(h) : X(h) ? (t.enter("lineEnding"), t.consume(h), t.exit("lineEnding"), le(t, c, "linePrefix")) : (t.enter("chunkString", {
      contentType: "string"
    }), d(h));
  }
  function d(h) {
    return h === s || h === null || X(h) ? (t.exit("chunkString"), c(h)) : (t.consume(h), h === 92 ? u : d);
  }
  function u(h) {
    return h === s || h === 92 ? (t.consume(h), d) : d(h);
  }
}
function jn(t, e) {
  let n;
  return r;
  function r(i) {
    return X(i) ? (t.enter("lineEnding"), t.consume(i), t.exit("lineEnding"), n = !0, r) : se(i) ? le(t, r, n ? "linePrefix" : "lineSuffix")(i) : e(i);
  }
}
const HT = {
  name: "definition",
  tokenize: GT
}, WT = {
  partial: !0,
  tokenize: KT
};
function GT(t, e, n) {
  const r = this;
  let i;
  return o;
  function o(p) {
    return t.enter("definition"), s(p);
  }
  function s(p) {
    return mp.call(
      r,
      t,
      a,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(p);
  }
  function a(p) {
    return i = rt(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1)), p === 58 ? (t.enter("definitionMarker"), t.consume(p), t.exit("definitionMarker"), l) : n(p);
  }
  function l(p) {
    return ve(p) ? jn(t, c)(p) : c(p);
  }
  function c(p) {
    return pp(
      t,
      d,
      // Note: we don’t need to reset the way `markdown-rs` does.
      n,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(p);
  }
  function d(p) {
    return t.attempt(WT, u, u)(p);
  }
  function u(p) {
    return se(p) ? le(t, h, "whitespace")(p) : h(p);
  }
  function h(p) {
    return p === null || X(p) ? (t.exit("definition"), r.parser.defined.push(i), e(p)) : n(p);
  }
}
function KT(t, e, n) {
  return r;
  function r(a) {
    return ve(a) ? jn(t, i)(a) : n(a);
  }
  function i(a) {
    return fp(t, o, n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(a);
  }
  function o(a) {
    return se(a) ? le(t, s, "whitespace")(a) : s(a);
  }
  function s(a) {
    return a === null || X(a) ? e(a) : n(a);
  }
}
const JT = {
  name: "hardBreakEscape",
  tokenize: QT
};
function QT(t, e, n) {
  return r;
  function r(o) {
    return t.enter("hardBreakEscape"), t.consume(o), i;
  }
  function i(o) {
    return X(o) ? (t.exit("hardBreakEscape"), e(o)) : n(o);
  }
}
const YT = {
  name: "headingAtx",
  resolve: XT,
  tokenize: ZT
};
function XT(t, e) {
  let n = t.length - 2, r = 3, i, o;
  return t[r][1].type === "whitespace" && (r += 2), n - 2 > r && t[n][1].type === "whitespace" && (n -= 2), t[n][1].type === "atxHeadingSequence" && (r === n - 1 || n - 4 > r && t[n - 2][1].type === "whitespace") && (n -= r + 1 === n ? 2 : 4), n > r && (i = {
    type: "atxHeadingText",
    start: t[r][1].start,
    end: t[n][1].end
  }, o = {
    type: "chunkText",
    start: t[r][1].start,
    end: t[n][1].end,
    contentType: "text"
  }, Be(t, r, n - r + 1, [["enter", i, e], ["enter", o, e], ["exit", o, e], ["exit", i, e]])), t;
}
function ZT(t, e, n) {
  let r = 0;
  return i;
  function i(d) {
    return t.enter("atxHeading"), o(d);
  }
  function o(d) {
    return t.enter("atxHeadingSequence"), s(d);
  }
  function s(d) {
    return d === 35 && r++ < 6 ? (t.consume(d), s) : d === null || ve(d) ? (t.exit("atxHeadingSequence"), a(d)) : n(d);
  }
  function a(d) {
    return d === 35 ? (t.enter("atxHeadingSequence"), l(d)) : d === null || X(d) ? (t.exit("atxHeading"), e(d)) : se(d) ? le(t, a, "whitespace")(d) : (t.enter("atxHeadingText"), c(d));
  }
  function l(d) {
    return d === 35 ? (t.consume(d), l) : (t.exit("atxHeadingSequence"), a(d));
  }
  function c(d) {
    return d === null || d === 35 || ve(d) ? (t.exit("atxHeadingText"), a(d)) : (t.consume(d), c);
  }
}
const eI = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], kl = ["pre", "script", "style", "textarea"], tI = {
  concrete: !0,
  name: "htmlFlow",
  resolveTo: iI,
  tokenize: oI
}, nI = {
  partial: !0,
  tokenize: aI
}, rI = {
  partial: !0,
  tokenize: sI
};
function iI(t) {
  let e = t.length;
  for (; e-- && !(t[e][0] === "enter" && t[e][1].type === "htmlFlow"); )
    ;
  return e > 1 && t[e - 2][1].type === "linePrefix" && (t[e][1].start = t[e - 2][1].start, t[e + 1][1].start = t[e - 2][1].start, t.splice(e - 2, 2)), t;
}
function oI(t, e, n) {
  const r = this;
  let i, o, s, a, l;
  return c;
  function c(S) {
    return d(S);
  }
  function d(S) {
    return t.enter("htmlFlow"), t.enter("htmlFlowData"), t.consume(S), u;
  }
  function u(S) {
    return S === 33 ? (t.consume(S), h) : S === 47 ? (t.consume(S), o = !0, g) : S === 63 ? (t.consume(S), i = 3, r.interrupt ? e : v) : Ne(S) ? (t.consume(S), s = String.fromCharCode(S), w) : n(S);
  }
  function h(S) {
    return S === 45 ? (t.consume(S), i = 2, p) : S === 91 ? (t.consume(S), i = 5, a = 0, m) : Ne(S) ? (t.consume(S), i = 4, r.interrupt ? e : v) : n(S);
  }
  function p(S) {
    return S === 45 ? (t.consume(S), r.interrupt ? e : v) : n(S);
  }
  function m(S) {
    const pe = "CDATA[";
    return S === pe.charCodeAt(a++) ? (t.consume(S), a === pe.length ? r.interrupt ? e : P : m) : n(S);
  }
  function g(S) {
    return Ne(S) ? (t.consume(S), s = String.fromCharCode(S), w) : n(S);
  }
  function w(S) {
    if (S === null || S === 47 || S === 62 || ve(S)) {
      const pe = S === 47, he = s.toLowerCase();
      return !pe && !o && kl.includes(he) ? (i = 1, r.interrupt ? e(S) : P(S)) : eI.includes(s.toLowerCase()) ? (i = 6, pe ? (t.consume(S), b) : r.interrupt ? e(S) : P(S)) : (i = 7, r.interrupt && !r.parser.lazy[r.now().line] ? n(S) : o ? k(S) : x(S));
    }
    return S === 45 || Re(S) ? (t.consume(S), s += String.fromCharCode(S), w) : n(S);
  }
  function b(S) {
    return S === 62 ? (t.consume(S), r.interrupt ? e : P) : n(S);
  }
  function k(S) {
    return se(S) ? (t.consume(S), k) : _(S);
  }
  function x(S) {
    return S === 47 ? (t.consume(S), _) : S === 58 || S === 95 || Ne(S) ? (t.consume(S), T) : se(S) ? (t.consume(S), x) : _(S);
  }
  function T(S) {
    return S === 45 || S === 46 || S === 58 || S === 95 || Re(S) ? (t.consume(S), T) : I(S);
  }
  function I(S) {
    return S === 61 ? (t.consume(S), y) : se(S) ? (t.consume(S), I) : x(S);
  }
  function y(S) {
    return S === null || S === 60 || S === 61 || S === 62 || S === 96 ? n(S) : S === 34 || S === 39 ? (t.consume(S), l = S, M) : se(S) ? (t.consume(S), y) : E(S);
  }
  function M(S) {
    return S === l ? (t.consume(S), l = null, N) : S === null || X(S) ? n(S) : (t.consume(S), M);
  }
  function E(S) {
    return S === null || S === 34 || S === 39 || S === 47 || S === 60 || S === 61 || S === 62 || S === 96 || ve(S) ? I(S) : (t.consume(S), E);
  }
  function N(S) {
    return S === 47 || S === 62 || se(S) ? x(S) : n(S);
  }
  function _(S) {
    return S === 62 ? (t.consume(S), A) : n(S);
  }
  function A(S) {
    return S === null || X(S) ? P(S) : se(S) ? (t.consume(S), A) : n(S);
  }
  function P(S) {
    return S === 45 && i === 2 ? (t.consume(S), V) : S === 60 && i === 1 ? (t.consume(S), G) : S === 62 && i === 4 ? (t.consume(S), Q) : S === 63 && i === 3 ? (t.consume(S), v) : S === 93 && i === 5 ? (t.consume(S), B) : X(S) && (i === 6 || i === 7) ? (t.exit("htmlFlowData"), t.check(nI, ee, D)(S)) : S === null || X(S) ? (t.exit("htmlFlowData"), D(S)) : (t.consume(S), P);
  }
  function D(S) {
    return t.check(rI, O, ee)(S);
  }
  function O(S) {
    return t.enter("lineEnding"), t.consume(S), t.exit("lineEnding"), z;
  }
  function z(S) {
    return S === null || X(S) ? D(S) : (t.enter("htmlFlowData"), P(S));
  }
  function V(S) {
    return S === 45 ? (t.consume(S), v) : P(S);
  }
  function G(S) {
    return S === 47 ? (t.consume(S), s = "", F) : P(S);
  }
  function F(S) {
    if (S === 62) {
      const pe = s.toLowerCase();
      return kl.includes(pe) ? (t.consume(S), Q) : P(S);
    }
    return Ne(S) && s.length < 8 ? (t.consume(S), s += String.fromCharCode(S), F) : P(S);
  }
  function B(S) {
    return S === 93 ? (t.consume(S), v) : P(S);
  }
  function v(S) {
    return S === 62 ? (t.consume(S), Q) : S === 45 && i === 2 ? (t.consume(S), v) : P(S);
  }
  function Q(S) {
    return S === null || X(S) ? (t.exit("htmlFlowData"), ee(S)) : (t.consume(S), Q);
  }
  function ee(S) {
    return t.exit("htmlFlow"), e(S);
  }
}
function sI(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return X(s) ? (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), o) : n(s);
  }
  function o(s) {
    return r.parser.lazy[r.now().line] ? n(s) : e(s);
  }
}
function aI(t, e, n) {
  return r;
  function r(i) {
    return t.enter("lineEnding"), t.consume(i), t.exit("lineEnding"), t.attempt(ar, e, n);
  }
}
const lI = {
  name: "htmlText",
  tokenize: cI
};
function cI(t, e, n) {
  const r = this;
  let i, o, s;
  return a;
  function a(v) {
    return t.enter("htmlText"), t.enter("htmlTextData"), t.consume(v), l;
  }
  function l(v) {
    return v === 33 ? (t.consume(v), c) : v === 47 ? (t.consume(v), I) : v === 63 ? (t.consume(v), x) : Ne(v) ? (t.consume(v), E) : n(v);
  }
  function c(v) {
    return v === 45 ? (t.consume(v), d) : v === 91 ? (t.consume(v), o = 0, m) : Ne(v) ? (t.consume(v), k) : n(v);
  }
  function d(v) {
    return v === 45 ? (t.consume(v), p) : n(v);
  }
  function u(v) {
    return v === null ? n(v) : v === 45 ? (t.consume(v), h) : X(v) ? (s = u, G(v)) : (t.consume(v), u);
  }
  function h(v) {
    return v === 45 ? (t.consume(v), p) : u(v);
  }
  function p(v) {
    return v === 62 ? V(v) : v === 45 ? h(v) : u(v);
  }
  function m(v) {
    const Q = "CDATA[";
    return v === Q.charCodeAt(o++) ? (t.consume(v), o === Q.length ? g : m) : n(v);
  }
  function g(v) {
    return v === null ? n(v) : v === 93 ? (t.consume(v), w) : X(v) ? (s = g, G(v)) : (t.consume(v), g);
  }
  function w(v) {
    return v === 93 ? (t.consume(v), b) : g(v);
  }
  function b(v) {
    return v === 62 ? V(v) : v === 93 ? (t.consume(v), b) : g(v);
  }
  function k(v) {
    return v === null || v === 62 ? V(v) : X(v) ? (s = k, G(v)) : (t.consume(v), k);
  }
  function x(v) {
    return v === null ? n(v) : v === 63 ? (t.consume(v), T) : X(v) ? (s = x, G(v)) : (t.consume(v), x);
  }
  function T(v) {
    return v === 62 ? V(v) : x(v);
  }
  function I(v) {
    return Ne(v) ? (t.consume(v), y) : n(v);
  }
  function y(v) {
    return v === 45 || Re(v) ? (t.consume(v), y) : M(v);
  }
  function M(v) {
    return X(v) ? (s = M, G(v)) : se(v) ? (t.consume(v), M) : V(v);
  }
  function E(v) {
    return v === 45 || Re(v) ? (t.consume(v), E) : v === 47 || v === 62 || ve(v) ? N(v) : n(v);
  }
  function N(v) {
    return v === 47 ? (t.consume(v), V) : v === 58 || v === 95 || Ne(v) ? (t.consume(v), _) : X(v) ? (s = N, G(v)) : se(v) ? (t.consume(v), N) : V(v);
  }
  function _(v) {
    return v === 45 || v === 46 || v === 58 || v === 95 || Re(v) ? (t.consume(v), _) : A(v);
  }
  function A(v) {
    return v === 61 ? (t.consume(v), P) : X(v) ? (s = A, G(v)) : se(v) ? (t.consume(v), A) : N(v);
  }
  function P(v) {
    return v === null || v === 60 || v === 61 || v === 62 || v === 96 ? n(v) : v === 34 || v === 39 ? (t.consume(v), i = v, D) : X(v) ? (s = P, G(v)) : se(v) ? (t.consume(v), P) : (t.consume(v), O);
  }
  function D(v) {
    return v === i ? (t.consume(v), i = void 0, z) : v === null ? n(v) : X(v) ? (s = D, G(v)) : (t.consume(v), D);
  }
  function O(v) {
    return v === null || v === 34 || v === 39 || v === 60 || v === 61 || v === 96 ? n(v) : v === 47 || v === 62 || ve(v) ? N(v) : (t.consume(v), O);
  }
  function z(v) {
    return v === 47 || v === 62 || ve(v) ? N(v) : n(v);
  }
  function V(v) {
    return v === 62 ? (t.consume(v), t.exit("htmlTextData"), t.exit("htmlText"), e) : n(v);
  }
  function G(v) {
    return t.exit("htmlTextData"), t.enter("lineEnding"), t.consume(v), t.exit("lineEnding"), F;
  }
  function F(v) {
    return se(v) ? le(t, B, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(v) : B(v);
  }
  function B(v) {
    return t.enter("htmlTextData"), s(v);
  }
}
const vs = {
  name: "labelEnd",
  resolveAll: pI,
  resolveTo: mI,
  tokenize: fI
}, uI = {
  tokenize: gI
}, dI = {
  tokenize: bI
}, hI = {
  tokenize: vI
};
function pI(t) {
  let e = -1;
  const n = [];
  for (; ++e < t.length; ) {
    const r = t[e][1];
    if (n.push(t[e]), r.type === "labelImage" || r.type === "labelLink" || r.type === "labelEnd") {
      const i = r.type === "labelImage" ? 4 : 2;
      r.type = "data", e += i;
    }
  }
  return t.length !== n.length && Be(t, 0, t.length, n), t;
}
function mI(t, e) {
  let n = t.length, r = 0, i, o, s, a;
  for (; n--; )
    if (i = t[n][1], o) {
      if (i.type === "link" || i.type === "labelLink" && i._inactive)
        break;
      t[n][0] === "enter" && i.type === "labelLink" && (i._inactive = !0);
    } else if (s) {
      if (t[n][0] === "enter" && (i.type === "labelImage" || i.type === "labelLink") && !i._balanced && (o = n, i.type !== "labelLink")) {
        r = 2;
        break;
      }
    } else
      i.type === "labelEnd" && (s = n);
  const l = {
    type: t[o][1].type === "labelLink" ? "link" : "image",
    start: {
      ...t[o][1].start
    },
    end: {
      ...t[t.length - 1][1].end
    }
  }, c = {
    type: "label",
    start: {
      ...t[o][1].start
    },
    end: {
      ...t[s][1].end
    }
  }, d = {
    type: "labelText",
    start: {
      ...t[o + r + 2][1].end
    },
    end: {
      ...t[s - 2][1].start
    }
  };
  return a = [["enter", l, e], ["enter", c, e]], a = Ve(a, t.slice(o + 1, o + r + 3)), a = Ve(a, [["enter", d, e]]), a = Ve(a, si(e.parser.constructs.insideSpan.null, t.slice(o + r + 4, s - 3), e)), a = Ve(a, [["exit", d, e], t[s - 2], t[s - 1], ["exit", c, e]]), a = Ve(a, t.slice(s + 1)), a = Ve(a, [["exit", l, e]]), Be(t, o, t.length, a), t;
}
function fI(t, e, n) {
  const r = this;
  let i = r.events.length, o, s;
  for (; i--; )
    if ((r.events[i][1].type === "labelImage" || r.events[i][1].type === "labelLink") && !r.events[i][1]._balanced) {
      o = r.events[i][1];
      break;
    }
  return a;
  function a(h) {
    return o ? o._inactive ? u(h) : (s = r.parser.defined.includes(rt(r.sliceSerialize({
      start: o.end,
      end: r.now()
    }))), t.enter("labelEnd"), t.enter("labelMarker"), t.consume(h), t.exit("labelMarker"), t.exit("labelEnd"), l) : n(h);
  }
  function l(h) {
    return h === 40 ? t.attempt(uI, d, s ? d : u)(h) : h === 91 ? t.attempt(dI, d, s ? c : u)(h) : s ? d(h) : u(h);
  }
  function c(h) {
    return t.attempt(hI, d, u)(h);
  }
  function d(h) {
    return e(h);
  }
  function u(h) {
    return o._balanced = !0, n(h);
  }
}
function gI(t, e, n) {
  return r;
  function r(u) {
    return t.enter("resource"), t.enter("resourceMarker"), t.consume(u), t.exit("resourceMarker"), i;
  }
  function i(u) {
    return ve(u) ? jn(t, o)(u) : o(u);
  }
  function o(u) {
    return u === 41 ? d(u) : pp(t, s, a, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(u);
  }
  function s(u) {
    return ve(u) ? jn(t, l)(u) : d(u);
  }
  function a(u) {
    return n(u);
  }
  function l(u) {
    return u === 34 || u === 39 || u === 40 ? fp(t, c, n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(u) : d(u);
  }
  function c(u) {
    return ve(u) ? jn(t, d)(u) : d(u);
  }
  function d(u) {
    return u === 41 ? (t.enter("resourceMarker"), t.consume(u), t.exit("resourceMarker"), t.exit("resource"), e) : n(u);
  }
}
function bI(t, e, n) {
  const r = this;
  return i;
  function i(a) {
    return mp.call(r, t, o, s, "reference", "referenceMarker", "referenceString")(a);
  }
  function o(a) {
    return r.parser.defined.includes(rt(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? e(a) : n(a);
  }
  function s(a) {
    return n(a);
  }
}
function vI(t, e, n) {
  return r;
  function r(o) {
    return t.enter("reference"), t.enter("referenceMarker"), t.consume(o), t.exit("referenceMarker"), i;
  }
  function i(o) {
    return o === 93 ? (t.enter("referenceMarker"), t.consume(o), t.exit("referenceMarker"), t.exit("reference"), e) : n(o);
  }
}
const wI = {
  name: "labelStartImage",
  resolveAll: vs.resolveAll,
  tokenize: yI
};
function yI(t, e, n) {
  const r = this;
  return i;
  function i(a) {
    return t.enter("labelImage"), t.enter("labelImageMarker"), t.consume(a), t.exit("labelImageMarker"), o;
  }
  function o(a) {
    return a === 91 ? (t.enter("labelMarker"), t.consume(a), t.exit("labelMarker"), t.exit("labelImage"), s) : n(a);
  }
  function s(a) {
    return a === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(a) : e(a);
  }
}
const xI = {
  name: "labelStartLink",
  resolveAll: vs.resolveAll,
  tokenize: kI
};
function kI(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return t.enter("labelLink"), t.enter("labelMarker"), t.consume(s), t.exit("labelMarker"), t.exit("labelLink"), o;
  }
  function o(s) {
    return s === 94 && "_hiddenFootnoteSupport" in r.parser.constructs ? n(s) : e(s);
  }
}
const Ei = {
  name: "lineEnding",
  tokenize: _I
};
function _I(t, e) {
  return n;
  function n(r) {
    return t.enter("lineEnding"), t.consume(r), t.exit("lineEnding"), le(t, e, "linePrefix");
  }
}
const Ir = {
  name: "thematicBreak",
  tokenize: SI
};
function SI(t, e, n) {
  let r = 0, i;
  return o;
  function o(c) {
    return t.enter("thematicBreak"), s(c);
  }
  function s(c) {
    return i = c, a(c);
  }
  function a(c) {
    return c === i ? (t.enter("thematicBreakSequence"), l(c)) : r >= 3 && (c === null || X(c)) ? (t.exit("thematicBreak"), e(c)) : n(c);
  }
  function l(c) {
    return c === i ? (t.consume(c), r++, l) : (t.exit("thematicBreakSequence"), se(c) ? le(t, a, "whitespace")(c) : a(c));
  }
}
const De = {
  continuation: {
    tokenize: AI
  },
  exit: RI,
  name: "list",
  tokenize: II
}, CI = {
  partial: !0,
  tokenize: MI
}, TI = {
  partial: !0,
  tokenize: EI
};
function II(t, e, n) {
  const r = this, i = r.events[r.events.length - 1];
  let o = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, s = 0;
  return a;
  function a(p) {
    const m = r.containerState.type || (p === 42 || p === 43 || p === 45 ? "listUnordered" : "listOrdered");
    if (m === "listUnordered" ? !r.containerState.marker || p === r.containerState.marker : ho(p)) {
      if (r.containerState.type || (r.containerState.type = m, t.enter(m, {
        _container: !0
      })), m === "listUnordered")
        return t.enter("listItemPrefix"), p === 42 || p === 45 ? t.check(Ir, n, c)(p) : c(p);
      if (!r.interrupt || p === 49)
        return t.enter("listItemPrefix"), t.enter("listItemValue"), l(p);
    }
    return n(p);
  }
  function l(p) {
    return ho(p) && ++s < 10 ? (t.consume(p), l) : (!r.interrupt || s < 2) && (r.containerState.marker ? p === r.containerState.marker : p === 41 || p === 46) ? (t.exit("listItemValue"), c(p)) : n(p);
  }
  function c(p) {
    return t.enter("listItemMarker"), t.consume(p), t.exit("listItemMarker"), r.containerState.marker = r.containerState.marker || p, t.check(
      ar,
      // Can’t be empty when interrupting.
      r.interrupt ? n : d,
      t.attempt(CI, h, u)
    );
  }
  function d(p) {
    return r.containerState.initialBlankLine = !0, o++, h(p);
  }
  function u(p) {
    return se(p) ? (t.enter("listItemPrefixWhitespace"), t.consume(p), t.exit("listItemPrefixWhitespace"), h) : n(p);
  }
  function h(p) {
    return r.containerState.size = o + r.sliceSerialize(t.exit("listItemPrefix"), !0).length, e(p);
  }
}
function AI(t, e, n) {
  const r = this;
  return r.containerState._closeFlow = void 0, t.check(ar, i, o);
  function i(a) {
    return r.containerState.furtherBlankLines = r.containerState.furtherBlankLines || r.containerState.initialBlankLine, le(t, e, "listItemIndent", r.containerState.size + 1)(a);
  }
  function o(a) {
    return r.containerState.furtherBlankLines || !se(a) ? (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, s(a)) : (r.containerState.furtherBlankLines = void 0, r.containerState.initialBlankLine = void 0, t.attempt(TI, e, s)(a));
  }
  function s(a) {
    return r.containerState._closeFlow = !0, r.interrupt = void 0, le(t, t.attempt(De, e, n), "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(a);
  }
}
function EI(t, e, n) {
  const r = this;
  return le(t, i, "listItemIndent", r.containerState.size + 1);
  function i(o) {
    const s = r.events[r.events.length - 1];
    return s && s[1].type === "listItemIndent" && s[2].sliceSerialize(s[1], !0).length === r.containerState.size ? e(o) : n(o);
  }
}
function RI(t) {
  t.exit(this.containerState.type);
}
function MI(t, e, n) {
  const r = this;
  return le(t, i, "listItemPrefixWhitespace", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4 + 1);
  function i(o) {
    const s = r.events[r.events.length - 1];
    return !se(o) && s && s[1].type === "listItemPrefixWhitespace" ? e(o) : n(o);
  }
}
const _l = {
  name: "setextUnderline",
  resolveTo: PI,
  tokenize: NI
};
function PI(t, e) {
  let n = t.length, r, i, o;
  for (; n--; )
    if (t[n][0] === "enter") {
      if (t[n][1].type === "content") {
        r = n;
        break;
      }
      t[n][1].type === "paragraph" && (i = n);
    } else
      t[n][1].type === "content" && t.splice(n, 1), !o && t[n][1].type === "definition" && (o = n);
  const s = {
    type: "setextHeading",
    start: {
      ...t[r][1].start
    },
    end: {
      ...t[t.length - 1][1].end
    }
  };
  return t[i][1].type = "setextHeadingText", o ? (t.splice(i, 0, ["enter", s, e]), t.splice(o + 1, 0, ["exit", t[r][1], e]), t[r][1].end = {
    ...t[o][1].end
  }) : t[r][1] = s, t.push(["exit", s, e]), t;
}
function NI(t, e, n) {
  const r = this;
  let i;
  return o;
  function o(c) {
    let d = r.events.length, u;
    for (; d--; )
      if (r.events[d][1].type !== "lineEnding" && r.events[d][1].type !== "linePrefix" && r.events[d][1].type !== "content") {
        u = r.events[d][1].type === "paragraph";
        break;
      }
    return !r.parser.lazy[r.now().line] && (r.interrupt || u) ? (t.enter("setextHeadingLine"), i = c, s(c)) : n(c);
  }
  function s(c) {
    return t.enter("setextHeadingLineSequence"), a(c);
  }
  function a(c) {
    return c === i ? (t.consume(c), a) : (t.exit("setextHeadingLineSequence"), se(c) ? le(t, l, "lineSuffix")(c) : l(c));
  }
  function l(c) {
    return c === null || X(c) ? (t.exit("setextHeadingLine"), e(c)) : n(c);
  }
}
const DI = {
  tokenize: LI
};
function LI(t) {
  const e = this, n = t.attempt(
    // Try to parse a blank line.
    ar,
    r,
    // Try to parse initial flow (essentially, only code).
    t.attempt(this.parser.constructs.flowInitial, i, le(t, t.attempt(this.parser.constructs.flow, i, t.attempt(BT, i)), "linePrefix"))
  );
  return n;
  function r(o) {
    if (o === null) {
      t.consume(o);
      return;
    }
    return t.enter("lineEndingBlank"), t.consume(o), t.exit("lineEndingBlank"), e.currentConstruct = void 0, n;
  }
  function i(o) {
    if (o === null) {
      t.consume(o);
      return;
    }
    return t.enter("lineEnding"), t.consume(o), t.exit("lineEnding"), e.currentConstruct = void 0, n;
  }
}
const zI = {
  resolveAll: bp()
}, OI = gp("string"), $I = gp("text");
function gp(t) {
  return {
    resolveAll: bp(t === "text" ? FI : void 0),
    tokenize: e
  };
  function e(n) {
    const r = this, i = this.parser.constructs[t], o = n.attempt(i, s, a);
    return s;
    function s(d) {
      return c(d) ? o(d) : a(d);
    }
    function a(d) {
      if (d === null) {
        n.consume(d);
        return;
      }
      return n.enter("data"), n.consume(d), l;
    }
    function l(d) {
      return c(d) ? (n.exit("data"), o(d)) : (n.consume(d), l);
    }
    function c(d) {
      if (d === null)
        return !0;
      const u = i[d];
      let h = -1;
      if (u)
        for (; ++h < u.length; ) {
          const p = u[h];
          if (!p.previous || p.previous.call(r, r.previous))
            return !0;
        }
      return !1;
    }
  }
}
function bp(t) {
  return e;
  function e(n, r) {
    let i = -1, o;
    for (; ++i <= n.length; )
      o === void 0 ? n[i] && n[i][1].type === "data" && (o = i, i++) : (!n[i] || n[i][1].type !== "data") && (i !== o + 2 && (n[o][1].end = n[i - 1][1].end, n.splice(o + 2, i - o - 2), i = o + 2), o = void 0);
    return t ? t(n, r) : n;
  }
}
function FI(t, e) {
  let n = 0;
  for (; ++n <= t.length; )
    if ((n === t.length || t[n][1].type === "lineEnding") && t[n - 1][1].type === "data") {
      const r = t[n - 1][1], i = e.sliceStream(r);
      let o = i.length, s = -1, a = 0, l;
      for (; o--; ) {
        const c = i[o];
        if (typeof c == "string") {
          for (s = c.length; c.charCodeAt(s - 1) === 32; )
            a++, s--;
          if (s)
            break;
          s = -1;
        } else if (c === -2)
          l = !0, a++;
        else if (c !== -1) {
          o++;
          break;
        }
      }
      if (e._contentTypeTextTrailing && n === t.length && (a = 0), a) {
        const c = {
          type: n === t.length || l || a < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: o ? s : r.start._bufferIndex + s,
            _index: r.start._index + o,
            line: r.end.line,
            column: r.end.column - a,
            offset: r.end.offset - a
          },
          end: {
            ...r.end
          }
        };
        r.end = {
          ...c.start
        }, r.start.offset === r.end.offset ? Object.assign(r, c) : (t.splice(n, 0, ["enter", c, e], ["exit", c, e]), n += 2);
      }
      n++;
    }
  return t;
}
const BI = {
  42: De,
  43: De,
  45: De,
  48: De,
  49: De,
  50: De,
  51: De,
  52: De,
  53: De,
  54: De,
  55: De,
  56: De,
  57: De,
  62: cp
}, UI = {
  91: HT
}, jI = {
  [-2]: Ai,
  [-1]: Ai,
  32: Ai
}, VI = {
  35: YT,
  42: Ir,
  45: [_l, Ir],
  60: tI,
  61: _l,
  95: Ir,
  96: xl,
  126: xl
}, qI = {
  38: dp,
  92: up
}, HI = {
  [-5]: Ei,
  [-4]: Ei,
  [-3]: Ei,
  33: wI,
  38: dp,
  42: po,
  60: [xT, lI],
  91: xI,
  92: [JT, up],
  93: vs,
  95: po,
  96: DT
}, WI = {
  null: [po, zI]
}, GI = {
  null: [42, 95]
}, KI = {
  null: []
}, JI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attentionMarkers: GI,
  contentInitial: UI,
  disable: KI,
  document: BI,
  flow: VI,
  flowInitial: jI,
  insideSpan: WI,
  string: qI,
  text: HI
}, Symbol.toStringTag, { value: "Module" }));
function QI(t, e, n) {
  let r = {
    _bufferIndex: -1,
    _index: 0,
    line: n && n.line || 1,
    column: n && n.column || 1,
    offset: n && n.offset || 0
  };
  const i = {}, o = [];
  let s = [], a = [];
  const l = {
    attempt: M(I),
    check: M(y),
    consume: k,
    enter: x,
    exit: T,
    interrupt: M(y, {
      interrupt: !0
    })
  }, c = {
    code: null,
    containerState: {},
    defineSkip: g,
    events: [],
    now: m,
    parser: t,
    previous: null,
    sliceSerialize: h,
    sliceStream: p,
    write: u
  };
  let d = e.tokenize.call(c, l);
  return e.resolveAll && o.push(e), c;
  function u(A) {
    return s = Ve(s, A), w(), s[s.length - 1] !== null ? [] : (E(e, 0), c.events = si(o, c.events, c), c.events);
  }
  function h(A, P) {
    return XI(p(A), P);
  }
  function p(A) {
    return YI(s, A);
  }
  function m() {
    const {
      _bufferIndex: A,
      _index: P,
      line: D,
      column: O,
      offset: z
    } = r;
    return {
      _bufferIndex: A,
      _index: P,
      line: D,
      column: O,
      offset: z
    };
  }
  function g(A) {
    i[A.line] = A.column, _();
  }
  function w() {
    let A;
    for (; r._index < s.length; ) {
      const P = s[r._index];
      if (typeof P == "string")
        for (A = r._index, r._bufferIndex < 0 && (r._bufferIndex = 0); r._index === A && r._bufferIndex < P.length; )
          b(P.charCodeAt(r._bufferIndex));
      else
        b(P);
    }
  }
  function b(A) {
    d = d(A);
  }
  function k(A) {
    X(A) ? (r.line++, r.column = 1, r.offset += A === -3 ? 2 : 1, _()) : A !== -1 && (r.column++, r.offset++), r._bufferIndex < 0 ? r._index++ : (r._bufferIndex++, r._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
    // strings.
    /** @type {string} */
    s[r._index].length && (r._bufferIndex = -1, r._index++)), c.previous = A;
  }
  function x(A, P) {
    const D = P || {};
    return D.type = A, D.start = m(), c.events.push(["enter", D, c]), a.push(D), D;
  }
  function T(A) {
    const P = a.pop();
    return P.end = m(), c.events.push(["exit", P, c]), P;
  }
  function I(A, P) {
    E(A, P.from);
  }
  function y(A, P) {
    P.restore();
  }
  function M(A, P) {
    return D;
    function D(O, z, V) {
      let G, F, B, v;
      return Array.isArray(O) ? (
        /* c8 ignore next 1 */
        ee(O)
      ) : "tokenize" in O ? (
        // Looks like a construct.
        ee([
          /** @type {Construct} */
          O
        ])
      ) : Q(O);
      function Q(ce) {
        return lt;
        function lt(Ze) {
          const ye = Ze !== null && ce[Ze], ft = Ze !== null && ce.null, gt = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(ye) ? ye : ye ? [ye] : [],
            ...Array.isArray(ft) ? ft : ft ? [ft] : []
          ];
          return ee(gt)(Ze);
        }
      }
      function ee(ce) {
        return G = ce, F = 0, ce.length === 0 ? V : S(ce[F]);
      }
      function S(ce) {
        return lt;
        function lt(Ze) {
          return v = N(), B = ce, ce.partial || (c.currentConstruct = ce), ce.name && c.parser.constructs.disable.null.includes(ce.name) ? he() : ce.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            P ? Object.assign(Object.create(c), P) : c,
            l,
            pe,
            he
          )(Ze);
        }
      }
      function pe(ce) {
        return A(B, v), z;
      }
      function he(ce) {
        return v.restore(), ++F < G.length ? S(G[F]) : V;
      }
    }
  }
  function E(A, P) {
    A.resolveAll && !o.includes(A) && o.push(A), A.resolve && Be(c.events, P, c.events.length - P, A.resolve(c.events.slice(P), c)), A.resolveTo && (c.events = A.resolveTo(c.events, c));
  }
  function N() {
    const A = m(), P = c.previous, D = c.currentConstruct, O = c.events.length, z = Array.from(a);
    return {
      from: O,
      restore: V
    };
    function V() {
      r = A, c.previous = P, c.currentConstruct = D, c.events.length = O, a = z, _();
    }
  }
  function _() {
    r.line in i && r.column < 2 && (r.column = i[r.line], r.offset += i[r.line] - 1);
  }
}
function YI(t, e) {
  const n = e.start._index, r = e.start._bufferIndex, i = e.end._index, o = e.end._bufferIndex;
  let s;
  if (n === i)
    s = [t[n].slice(r, o)];
  else {
    if (s = t.slice(n, i), r > -1) {
      const a = s[0];
      typeof a == "string" ? s[0] = a.slice(r) : s.shift();
    }
    o > 0 && s.push(t[i].slice(0, o));
  }
  return s;
}
function XI(t, e) {
  let n = -1;
  const r = [];
  let i;
  for (; ++n < t.length; ) {
    const o = t[n];
    let s;
    if (typeof o == "string")
      s = o;
    else
      switch (o) {
        case -5: {
          s = "\r";
          break;
        }
        case -4: {
          s = `
`;
          break;
        }
        case -3: {
          s = `\r
`;
          break;
        }
        case -2: {
          s = e ? " " : "	";
          break;
        }
        case -1: {
          if (!e && i)
            continue;
          s = " ";
          break;
        }
        default:
          s = String.fromCharCode(o);
      }
    i = o === -2, r.push(s);
  }
  return r.join("");
}
function ZI(t) {
  const r = {
    constructs: (
      /** @type {FullNormalizedExtension} */
      ap([JI, ...(t || {}).extensions || []])
    ),
    content: i(mT),
    defined: [],
    document: i(gT),
    flow: i(DI),
    lazy: {},
    string: i(OI),
    text: i($I)
  };
  return r;
  function i(o) {
    return s;
    function s(a) {
      return QI(r, o, a);
    }
  }
}
function e2(t) {
  for (; !hp(t); )
    ;
  return t;
}
const Sl = /[\0\t\n\r]/g;
function t2() {
  let t = 1, e = "", n = !0, r;
  return i;
  function i(o, s, a) {
    const l = [];
    let c, d, u, h, p;
    for (o = e + (typeof o == "string" ? o.toString() : new TextDecoder(s || void 0).decode(o)), u = 0, e = "", n && (o.charCodeAt(0) === 65279 && u++, n = void 0); u < o.length; ) {
      if (Sl.lastIndex = u, c = Sl.exec(o), h = c && c.index !== void 0 ? c.index : o.length, p = o.charCodeAt(h), !c) {
        e = o.slice(u);
        break;
      }
      if (p === 10 && u === h && r)
        l.push(-3), r = void 0;
      else
        switch (r && (l.push(-5), r = void 0), u < h && (l.push(o.slice(u, h)), t += h - u), p) {
          case 0: {
            l.push(65533), t++;
            break;
          }
          case 9: {
            for (d = Math.ceil(t / 4) * 4, l.push(-2); t++ < d; )
              l.push(-1);
            break;
          }
          case 10: {
            l.push(-4), t = 1;
            break;
          }
          default:
            r = !0, t = 1;
        }
      u = h + 1;
    }
    return a && (r && l.push(-5), e && l.push(e), l.push(null)), l;
  }
}
const n2 = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function r2(t) {
  return t.replace(n2, i2);
}
function i2(t, e, n) {
  if (e)
    return e;
  if (n.charCodeAt(0) === 35) {
    const i = n.charCodeAt(1), o = i === 120 || i === 88;
    return lp(n.slice(o ? 2 : 1), o ? 16 : 10);
  }
  return bs(n) || t;
}
const vp = {}.hasOwnProperty;
function o2(t, e, n) {
  return e && typeof e == "object" && (n = e, e = void 0), s2(n)(e2(ZI(n).document().write(t2()(t, e, !0))));
}
function s2(t) {
  const e = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: o(Ps),
      autolinkProtocol: N,
      autolinkEmail: N,
      atxHeading: o(Es),
      blockQuote: o(ft),
      characterEscape: N,
      characterReference: N,
      codeFenced: o(gt),
      codeFencedFenceInfo: s,
      codeFencedFenceMeta: s,
      codeIndented: o(gt, s),
      codeText: o(an, s),
      codeTextData: N,
      data: N,
      codeFlowValue: N,
      definition: o(En),
      definitionDestinationString: s,
      definitionLabelString: s,
      definitionTitleString: s,
      emphasis: o(ln),
      hardBreakEscape: o(Rs),
      hardBreakTrailing: o(Rs),
      htmlFlow: o(Ms, s),
      htmlFlowData: N,
      htmlText: o(Ms, s),
      htmlTextData: N,
      image: o(im),
      label: s,
      link: o(Ps),
      listItem: o(om),
      listItemValue: h,
      listOrdered: o(Ns, u),
      listUnordered: o(Ns),
      paragraph: o(sm),
      reference: S,
      referenceString: s,
      resourceDestinationString: s,
      resourceTitleString: s,
      setextHeading: o(Es),
      strong: o(am),
      thematicBreak: o(cm)
    },
    exit: {
      atxHeading: l(),
      atxHeadingSequence: I,
      autolink: l(),
      autolinkEmail: ye,
      autolinkProtocol: Ze,
      blockQuote: l(),
      characterEscapeValue: _,
      characterReferenceMarkerHexadecimal: he,
      characterReferenceMarkerNumeric: he,
      characterReferenceValue: ce,
      characterReference: lt,
      codeFenced: l(w),
      codeFencedFence: g,
      codeFencedFenceInfo: p,
      codeFencedFenceMeta: m,
      codeFlowValue: _,
      codeIndented: l(b),
      codeText: l(z),
      codeTextData: _,
      data: _,
      definition: l(),
      definitionDestinationString: T,
      definitionLabelString: k,
      definitionTitleString: x,
      emphasis: l(),
      hardBreakEscape: l(P),
      hardBreakTrailing: l(P),
      htmlFlow: l(D),
      htmlFlowData: _,
      htmlText: l(O),
      htmlTextData: _,
      image: l(G),
      label: B,
      labelText: F,
      lineEnding: A,
      link: l(V),
      listItem: l(),
      listOrdered: l(),
      listUnordered: l(),
      paragraph: l(),
      referenceString: pe,
      resourceDestinationString: v,
      resourceTitleString: Q,
      resource: ee,
      setextHeading: l(E),
      setextHeadingLineSequence: M,
      setextHeadingText: y,
      strong: l(),
      thematicBreak: l()
    }
  };
  wp(e, (t || {}).mdastExtensions || []);
  const n = {};
  return r;
  function r(L) {
    let q = {
      type: "root",
      children: []
    };
    const re = {
      stack: [q],
      tokenStack: [],
      config: e,
      enter: a,
      exit: c,
      buffer: s,
      resume: d,
      data: n
    }, ae = [];
    let ge = -1;
    for (; ++ge < L.length; )
      if (L[ge][1].type === "listOrdered" || L[ge][1].type === "listUnordered")
        if (L[ge][0] === "enter")
          ae.push(ge);
        else {
          const et = ae.pop();
          ge = i(L, et, ge);
        }
    for (ge = -1; ++ge < L.length; ) {
      const et = e[L[ge][0]];
      vp.call(et, L[ge][1].type) && et[L[ge][1].type].call(Object.assign({
        sliceSerialize: L[ge][2].sliceSerialize
      }, re), L[ge][1]);
    }
    if (re.tokenStack.length > 0) {
      const et = re.tokenStack[re.tokenStack.length - 1];
      (et[1] || Cl).call(re, void 0, et[0]);
    }
    for (q.position = {
      start: _t(L.length > 0 ? L[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: _t(L.length > 0 ? L[L.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    }, ge = -1; ++ge < e.transforms.length; )
      q = e.transforms[ge](q) || q;
    return q;
  }
  function i(L, q, re) {
    let ae = q - 1, ge = -1, et = !1, Lt, bt, Rn, Mn;
    for (; ++ae <= re; ) {
      const Oe = L[ae];
      switch (Oe[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          Oe[0] === "enter" ? ge++ : ge--, Mn = void 0;
          break;
        }
        case "lineEndingBlank": {
          Oe[0] === "enter" && (Lt && !Mn && !ge && !Rn && (Rn = ae), Mn = void 0);
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          Mn = void 0;
      }
      if (!ge && Oe[0] === "enter" && Oe[1].type === "listItemPrefix" || ge === -1 && Oe[0] === "exit" && (Oe[1].type === "listUnordered" || Oe[1].type === "listOrdered")) {
        if (Lt) {
          let cn = ae;
          for (bt = void 0; cn--; ) {
            const vt = L[cn];
            if (vt[1].type === "lineEnding" || vt[1].type === "lineEndingBlank") {
              if (vt[0] === "exit")
                continue;
              bt && (L[bt][1].type = "lineEndingBlank", et = !0), vt[1].type = "lineEnding", bt = cn;
            } else if (!(vt[1].type === "linePrefix" || vt[1].type === "blockQuotePrefix" || vt[1].type === "blockQuotePrefixWhitespace" || vt[1].type === "blockQuoteMarker" || vt[1].type === "listItemIndent"))
              break;
          }
          Rn && (!bt || Rn < bt) && (Lt._spread = !0), Lt.end = Object.assign({}, bt ? L[bt][1].start : Oe[1].end), L.splice(bt || ae, 0, ["exit", Lt, Oe[2]]), ae++, re++;
        }
        if (Oe[1].type === "listItemPrefix") {
          const cn = {
            type: "listItem",
            _spread: !1,
            start: Object.assign({}, Oe[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          Lt = cn, L.splice(ae, 0, ["enter", cn, Oe[2]]), ae++, re++, Rn = void 0, Mn = !0;
        }
      }
    }
    return L[q][1]._spread = et, re;
  }
  function o(L, q) {
    return re;
    function re(ae) {
      a.call(this, L(ae), ae), q && q.call(this, ae);
    }
  }
  function s() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function a(L, q, re) {
    this.stack[this.stack.length - 1].children.push(L), this.stack.push(L), this.tokenStack.push([q, re || void 0]), L.position = {
      start: _t(q.start),
      // @ts-expect-error: `end` will be patched later.
      end: void 0
    };
  }
  function l(L) {
    return q;
    function q(re) {
      L && L.call(this, re), c.call(this, re);
    }
  }
  function c(L, q) {
    const re = this.stack.pop(), ae = this.tokenStack.pop();
    if (ae)
      ae[0].type !== L.type && (q ? q.call(this, L, ae[0]) : (ae[1] || Cl).call(this, L, ae[0]));
    else
      throw new Error("Cannot close `" + L.type + "` (" + Un({
        start: L.start,
        end: L.end
      }) + "): it’s not open");
    re.position.end = _t(L.end);
  }
  function d() {
    return gs(this.stack.pop());
  }
  function u() {
    this.data.expectingFirstListItemValue = !0;
  }
  function h(L) {
    if (this.data.expectingFirstListItemValue) {
      const q = this.stack[this.stack.length - 2];
      q.start = Number.parseInt(this.sliceSerialize(L), 10), this.data.expectingFirstListItemValue = void 0;
    }
  }
  function p() {
    const L = this.resume(), q = this.stack[this.stack.length - 1];
    q.lang = L;
  }
  function m() {
    const L = this.resume(), q = this.stack[this.stack.length - 1];
    q.meta = L;
  }
  function g() {
    this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
  }
  function w() {
    const L = this.resume(), q = this.stack[this.stack.length - 1];
    q.value = L.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
  }
  function b() {
    const L = this.resume(), q = this.stack[this.stack.length - 1];
    q.value = L.replace(/(\r?\n|\r)$/g, "");
  }
  function k(L) {
    const q = this.resume(), re = this.stack[this.stack.length - 1];
    re.label = q, re.identifier = rt(this.sliceSerialize(L)).toLowerCase();
  }
  function x() {
    const L = this.resume(), q = this.stack[this.stack.length - 1];
    q.title = L;
  }
  function T() {
    const L = this.resume(), q = this.stack[this.stack.length - 1];
    q.url = L;
  }
  function I(L) {
    const q = this.stack[this.stack.length - 1];
    if (!q.depth) {
      const re = this.sliceSerialize(L).length;
      q.depth = re;
    }
  }
  function y() {
    this.data.setextHeadingSlurpLineEnding = !0;
  }
  function M(L) {
    const q = this.stack[this.stack.length - 1];
    q.depth = this.sliceSerialize(L).codePointAt(0) === 61 ? 1 : 2;
  }
  function E() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function N(L) {
    const re = this.stack[this.stack.length - 1].children;
    let ae = re[re.length - 1];
    (!ae || ae.type !== "text") && (ae = lm(), ae.position = {
      start: _t(L.start),
      // @ts-expect-error: we’ll add `end` later.
      end: void 0
    }, re.push(ae)), this.stack.push(ae);
  }
  function _(L) {
    const q = this.stack.pop();
    q.value += this.sliceSerialize(L), q.position.end = _t(L.end);
  }
  function A(L) {
    const q = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const re = q.children[q.children.length - 1];
      re.position.end = _t(L.end), this.data.atHardBreak = void 0;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && e.canContainEols.includes(q.type) && (N.call(this, L), _.call(this, L));
  }
  function P() {
    this.data.atHardBreak = !0;
  }
  function D() {
    const L = this.resume(), q = this.stack[this.stack.length - 1];
    q.value = L;
  }
  function O() {
    const L = this.resume(), q = this.stack[this.stack.length - 1];
    q.value = L;
  }
  function z() {
    const L = this.resume(), q = this.stack[this.stack.length - 1];
    q.value = L;
  }
  function V() {
    const L = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const q = this.data.referenceType || "shortcut";
      L.type += "Reference", L.referenceType = q, delete L.url, delete L.title;
    } else
      delete L.identifier, delete L.label;
    this.data.referenceType = void 0;
  }
  function G() {
    const L = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const q = this.data.referenceType || "shortcut";
      L.type += "Reference", L.referenceType = q, delete L.url, delete L.title;
    } else
      delete L.identifier, delete L.label;
    this.data.referenceType = void 0;
  }
  function F(L) {
    const q = this.sliceSerialize(L), re = this.stack[this.stack.length - 2];
    re.label = r2(q), re.identifier = rt(q).toLowerCase();
  }
  function B() {
    const L = this.stack[this.stack.length - 1], q = this.resume(), re = this.stack[this.stack.length - 1];
    if (this.data.inReference = !0, re.type === "link") {
      const ae = L.children;
      re.children = ae;
    } else
      re.alt = q;
  }
  function v() {
    const L = this.resume(), q = this.stack[this.stack.length - 1];
    q.url = L;
  }
  function Q() {
    const L = this.resume(), q = this.stack[this.stack.length - 1];
    q.title = L;
  }
  function ee() {
    this.data.inReference = void 0;
  }
  function S() {
    this.data.referenceType = "collapsed";
  }
  function pe(L) {
    const q = this.resume(), re = this.stack[this.stack.length - 1];
    re.label = q, re.identifier = rt(this.sliceSerialize(L)).toLowerCase(), this.data.referenceType = "full";
  }
  function he(L) {
    this.data.characterReferenceType = L.type;
  }
  function ce(L) {
    const q = this.sliceSerialize(L), re = this.data.characterReferenceType;
    let ae;
    re ? (ae = lp(q, re === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : ae = bs(q);
    const ge = this.stack[this.stack.length - 1];
    ge.value += ae;
  }
  function lt(L) {
    const q = this.stack.pop();
    q.position.end = _t(L.end);
  }
  function Ze(L) {
    _.call(this, L);
    const q = this.stack[this.stack.length - 1];
    q.url = this.sliceSerialize(L);
  }
  function ye(L) {
    _.call(this, L);
    const q = this.stack[this.stack.length - 1];
    q.url = "mailto:" + this.sliceSerialize(L);
  }
  function ft() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function gt() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function an() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function En() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function ln() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function Es() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }
  function Rs() {
    return {
      type: "break"
    };
  }
  function Ms() {
    return {
      type: "html",
      value: ""
    };
  }
  function im() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function Ps() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function Ns(L) {
    return {
      type: "list",
      ordered: L.type === "listOrdered",
      start: null,
      spread: L._spread,
      children: []
    };
  }
  function om(L) {
    return {
      type: "listItem",
      spread: L._spread,
      checked: null,
      children: []
    };
  }
  function sm() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function am() {
    return {
      type: "strong",
      children: []
    };
  }
  function lm() {
    return {
      type: "text",
      value: ""
    };
  }
  function cm() {
    return {
      type: "thematicBreak"
    };
  }
}
function _t(t) {
  return {
    line: t.line,
    column: t.column,
    offset: t.offset
  };
}
function wp(t, e) {
  let n = -1;
  for (; ++n < e.length; ) {
    const r = e[n];
    Array.isArray(r) ? wp(t, r) : a2(t, r);
  }
}
function a2(t, e) {
  let n;
  for (n in e)
    if (vp.call(e, n))
      switch (n) {
        case "canContainEols": {
          const r = e[n];
          r && t[n].push(...r);
          break;
        }
        case "transforms": {
          const r = e[n];
          r && t[n].push(...r);
          break;
        }
        case "enter":
        case "exit": {
          const r = e[n];
          r && Object.assign(t[n], r);
          break;
        }
      }
}
function Cl(t, e) {
  throw t ? new Error("Cannot close `" + t.type + "` (" + Un({
    start: t.start,
    end: t.end
  }) + "): a different token (`" + e.type + "`, " + Un({
    start: e.start,
    end: e.end
  }) + ") is open") : new Error("Cannot close document, a token (`" + e.type + "`, " + Un({
    start: e.start,
    end: e.end
  }) + ") is still open");
}
function l2(t) {
  const e = this;
  e.parser = n;
  function n(r) {
    return o2(r, {
      ...e.data("settings"),
      ...t,
      // Note: these options are not in the readme.
      // The goal is for them to be set by plugins on `data` instead of being
      // passed by users.
      extensions: e.data("micromarkExtensions") || [],
      mdastExtensions: e.data("fromMarkdownExtensions") || []
    });
  }
}
function c2(t, e) {
  const n = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: t.wrap(t.all(e), !0)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function u2(t, e) {
  const n = { type: "element", tagName: "br", properties: {}, children: [] };
  return t.patch(e, n), [t.applyData(e, n), { type: "text", value: `
` }];
}
function d2(t, e) {
  const n = e.value ? e.value + `
` : "", r = {}, i = e.lang ? e.lang.split(/\s+/) : [];
  i.length > 0 && (r.className = ["language-" + i[0]]);
  let o = {
    type: "element",
    tagName: "code",
    properties: r,
    children: [{ type: "text", value: n }]
  };
  return e.meta && (o.data = { meta: e.meta }), t.patch(e, o), o = t.applyData(e, o), o = { type: "element", tagName: "pre", properties: {}, children: [o] }, t.patch(e, o), o;
}
function h2(t, e) {
  const n = {
    type: "element",
    tagName: "del",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function p2(t, e) {
  const n = {
    type: "element",
    tagName: "em",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function m2(t, e) {
  const n = typeof t.options.clobberPrefix == "string" ? t.options.clobberPrefix : "user-content-", r = String(e.identifier).toUpperCase(), i = An(r.toLowerCase()), o = t.footnoteOrder.indexOf(r);
  let s, a = t.footnoteCounts.get(r);
  a === void 0 ? (a = 0, t.footnoteOrder.push(r), s = t.footnoteOrder.length) : s = o + 1, a += 1, t.footnoteCounts.set(r, a);
  const l = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + n + "fn-" + i,
      id: n + "fnref-" + i + (a > 1 ? "-" + a : ""),
      dataFootnoteRef: !0,
      ariaDescribedBy: ["footnote-label"]
    },
    children: [{ type: "text", value: String(s) }]
  };
  t.patch(e, l);
  const c = {
    type: "element",
    tagName: "sup",
    properties: {},
    children: [l]
  };
  return t.patch(e, c), t.applyData(e, c);
}
function f2(t, e) {
  const n = {
    type: "element",
    tagName: "h" + e.depth,
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function g2(t, e) {
  if (t.options.allowDangerousHtml) {
    const n = { type: "raw", value: e.value };
    return t.patch(e, n), t.applyData(e, n);
  }
}
function yp(t, e) {
  const n = e.referenceType;
  let r = "]";
  if (n === "collapsed" ? r += "[]" : n === "full" && (r += "[" + (e.label || e.identifier) + "]"), e.type === "imageReference")
    return [{ type: "text", value: "![" + e.alt + r }];
  const i = t.all(e), o = i[0];
  o && o.type === "text" ? o.value = "[" + o.value : i.unshift({ type: "text", value: "[" });
  const s = i[i.length - 1];
  return s && s.type === "text" ? s.value += r : i.push({ type: "text", value: r }), i;
}
function b2(t, e) {
  const n = String(e.identifier).toUpperCase(), r = t.definitionById.get(n);
  if (!r)
    return yp(t, e);
  const i = { src: An(r.url || ""), alt: e.alt };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const o = { type: "element", tagName: "img", properties: i, children: [] };
  return t.patch(e, o), t.applyData(e, o);
}
function v2(t, e) {
  const n = { src: An(e.url) };
  e.alt !== null && e.alt !== void 0 && (n.alt = e.alt), e.title !== null && e.title !== void 0 && (n.title = e.title);
  const r = { type: "element", tagName: "img", properties: n, children: [] };
  return t.patch(e, r), t.applyData(e, r);
}
function w2(t, e) {
  const n = { type: "text", value: e.value.replace(/\r?\n|\r/g, " ") };
  t.patch(e, n);
  const r = {
    type: "element",
    tagName: "code",
    properties: {},
    children: [n]
  };
  return t.patch(e, r), t.applyData(e, r);
}
function y2(t, e) {
  const n = String(e.identifier).toUpperCase(), r = t.definitionById.get(n);
  if (!r)
    return yp(t, e);
  const i = { href: An(r.url || "") };
  r.title !== null && r.title !== void 0 && (i.title = r.title);
  const o = {
    type: "element",
    tagName: "a",
    properties: i,
    children: t.all(e)
  };
  return t.patch(e, o), t.applyData(e, o);
}
function x2(t, e) {
  const n = { href: An(e.url) };
  e.title !== null && e.title !== void 0 && (n.title = e.title);
  const r = {
    type: "element",
    tagName: "a",
    properties: n,
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function k2(t, e, n) {
  const r = t.all(e), i = n ? _2(n) : xp(e), o = {}, s = [];
  if (typeof e.checked == "boolean") {
    const d = r[0];
    let u;
    d && d.type === "element" && d.tagName === "p" ? u = d : (u = { type: "element", tagName: "p", properties: {}, children: [] }, r.unshift(u)), u.children.length > 0 && u.children.unshift({ type: "text", value: " " }), u.children.unshift({
      type: "element",
      tagName: "input",
      properties: { type: "checkbox", checked: e.checked, disabled: !0 },
      children: []
    }), o.className = ["task-list-item"];
  }
  let a = -1;
  for (; ++a < r.length; ) {
    const d = r[a];
    (i || a !== 0 || d.type !== "element" || d.tagName !== "p") && s.push({ type: "text", value: `
` }), d.type === "element" && d.tagName === "p" && !i ? s.push(...d.children) : s.push(d);
  }
  const l = r[r.length - 1];
  l && (i || l.type !== "element" || l.tagName !== "p") && s.push({ type: "text", value: `
` });
  const c = { type: "element", tagName: "li", properties: o, children: s };
  return t.patch(e, c), t.applyData(e, c);
}
function _2(t) {
  let e = !1;
  if (t.type === "list") {
    e = t.spread || !1;
    const n = t.children;
    let r = -1;
    for (; !e && ++r < n.length; )
      e = xp(n[r]);
  }
  return e;
}
function xp(t) {
  const e = t.spread;
  return e ?? t.children.length > 1;
}
function S2(t, e) {
  const n = {}, r = t.all(e);
  let i = -1;
  for (typeof e.start == "number" && e.start !== 1 && (n.start = e.start); ++i < r.length; ) {
    const s = r[i];
    if (s.type === "element" && s.tagName === "li" && s.properties && Array.isArray(s.properties.className) && s.properties.className.includes("task-list-item")) {
      n.className = ["contains-task-list"];
      break;
    }
  }
  const o = {
    type: "element",
    tagName: e.ordered ? "ol" : "ul",
    properties: n,
    children: t.wrap(r, !0)
  };
  return t.patch(e, o), t.applyData(e, o);
}
function C2(t, e) {
  const n = {
    type: "element",
    tagName: "p",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function T2(t, e) {
  const n = { type: "root", children: t.wrap(t.all(e)) };
  return t.patch(e, n), t.applyData(e, n);
}
function I2(t, e) {
  const n = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function A2(t, e) {
  const n = t.all(e), r = n.shift(), i = [];
  if (r) {
    const s = {
      type: "element",
      tagName: "thead",
      properties: {},
      children: t.wrap([r], !0)
    };
    t.patch(e.children[0], s), i.push(s);
  }
  if (n.length > 0) {
    const s = {
      type: "element",
      tagName: "tbody",
      properties: {},
      children: t.wrap(n, !0)
    }, a = hs(e.children[1]), l = ep(e.children[e.children.length - 1]);
    a && l && (s.position = { start: a, end: l }), i.push(s);
  }
  const o = {
    type: "element",
    tagName: "table",
    properties: {},
    children: t.wrap(i, !0)
  };
  return t.patch(e, o), t.applyData(e, o);
}
function E2(t, e, n) {
  const r = n ? n.children : void 0, o = (r ? r.indexOf(e) : 1) === 0 ? "th" : "td", s = n && n.type === "table" ? n.align : void 0, a = s ? s.length : e.children.length;
  let l = -1;
  const c = [];
  for (; ++l < a; ) {
    const u = e.children[l], h = {}, p = s ? s[l] : void 0;
    p && (h.align = p);
    let m = { type: "element", tagName: o, properties: h, children: [] };
    u && (m.children = t.all(u), t.patch(u, m), m = t.applyData(u, m)), c.push(m);
  }
  const d = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: t.wrap(c, !0)
  };
  return t.patch(e, d), t.applyData(e, d);
}
function R2(t, e) {
  const n = {
    type: "element",
    tagName: "td",
    // Assume body cell.
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
const Tl = 9, Il = 32;
function M2(t) {
  const e = String(t), n = /\r?\n|\r/g;
  let r = n.exec(e), i = 0;
  const o = [];
  for (; r; )
    o.push(
      Al(e.slice(i, r.index), i > 0, !0),
      r[0]
    ), i = r.index + r[0].length, r = n.exec(e);
  return o.push(Al(e.slice(i), i > 0, !1)), o.join("");
}
function Al(t, e, n) {
  let r = 0, i = t.length;
  if (e) {
    let o = t.codePointAt(r);
    for (; o === Tl || o === Il; )
      r++, o = t.codePointAt(r);
  }
  if (n) {
    let o = t.codePointAt(i - 1);
    for (; o === Tl || o === Il; )
      i--, o = t.codePointAt(i - 1);
  }
  return i > r ? t.slice(r, i) : "";
}
function P2(t, e) {
  const n = { type: "text", value: M2(String(e.value)) };
  return t.patch(e, n), t.applyData(e, n);
}
function N2(t, e) {
  const n = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  return t.patch(e, n), t.applyData(e, n);
}
const D2 = {
  blockquote: c2,
  break: u2,
  code: d2,
  delete: h2,
  emphasis: p2,
  footnoteReference: m2,
  heading: f2,
  html: g2,
  imageReference: b2,
  image: v2,
  inlineCode: w2,
  linkReference: y2,
  link: x2,
  listItem: k2,
  list: S2,
  paragraph: C2,
  // @ts-expect-error: root is different, but hard to type.
  root: T2,
  strong: I2,
  table: A2,
  tableCell: R2,
  tableRow: E2,
  text: P2,
  thematicBreak: N2,
  toml: yr,
  yaml: yr,
  definition: yr,
  footnoteDefinition: yr
};
function yr() {
}
const kp = -1, ai = 0, Vn = 1, jr = 2, ws = 3, ys = 4, xs = 5, ks = 6, _p = 7, Sp = 8, Cp = typeof self == "object" ? self : globalThis, El = (t, e) => {
  switch (t) {
    case "Function":
    case "SharedWorker":
    case "Worker":
    case "eval":
    case "setInterval":
    case "setTimeout":
      throw new TypeError("unable to deserialize " + t);
  }
  return new Cp[t](e);
}, L2 = (t, e) => {
  const n = (i, o) => (t.set(o, i), i), r = (i) => {
    if (t.has(i))
      return t.get(i);
    const [o, s] = e[i];
    switch (o) {
      case ai:
      case kp:
        return n(s, i);
      case Vn: {
        const a = n([], i);
        for (const l of s)
          a.push(r(l));
        return a;
      }
      case jr: {
        const a = n({}, i);
        for (const [l, c] of s)
          a[r(l)] = r(c);
        return a;
      }
      case ws:
        return n(new Date(s), i);
      case ys: {
        const { source: a, flags: l } = s;
        return n(new RegExp(a, l), i);
      }
      case xs: {
        const a = n(/* @__PURE__ */ new Map(), i);
        for (const [l, c] of s)
          a.set(r(l), r(c));
        return a;
      }
      case ks: {
        const a = n(/* @__PURE__ */ new Set(), i);
        for (const l of s)
          a.add(r(l));
        return a;
      }
      case _p: {
        const { name: a, message: l } = s;
        return n(
          typeof Cp[a] == "function" ? El(a, l) : new Error(l),
          i
        );
      }
      case Sp:
        return n(BigInt(s), i);
      case "BigInt":
        return n(Object(BigInt(s)), i);
      case "ArrayBuffer":
        return n(new Uint8Array(s).buffer, s);
      case "DataView": {
        const { buffer: a } = new Uint8Array(s);
        return n(new DataView(a), s);
      }
    }
    return n(El(o, s), i);
  };
  return r;
}, Rl = (t) => L2(/* @__PURE__ */ new Map(), t)(0), Bt = "", { toString: z2 } = {}, { keys: O2 } = Object, On = (t) => {
  const e = typeof t;
  if (e !== "object" || !t)
    return [ai, e];
  const n = z2.call(t).slice(8, -1);
  switch (n) {
    case "Array":
      return [Vn, Bt];
    case "Object":
      return [jr, Bt];
    case "Date":
      return [ws, Bt];
    case "RegExp":
      return [ys, Bt];
    case "Map":
      return [xs, Bt];
    case "Set":
      return [ks, Bt];
    case "DataView":
      return [Vn, n];
  }
  return n.includes("Array") ? [Vn, n] : t instanceof Error ? [_p, t.name || "Error"] : [jr, n];
}, xr = ([t, e]) => t === ai && (e === "function" || e === "symbol"), $2 = (t, e, n, r) => {
  const i = (s, a) => {
    const l = r.push(s) - 1;
    return n.set(a, l), l;
  }, o = (s) => {
    if (n.has(s))
      return n.get(s);
    let [a, l] = On(s);
    switch (a) {
      case ai: {
        let d = s;
        switch (l) {
          case "bigint":
            a = Sp, d = s.toString();
            break;
          case "function":
          case "symbol":
            if (t)
              throw new TypeError("unable to serialize " + l);
            d = null;
            break;
          case "undefined":
            return i([kp], s);
        }
        return i([a, d], s);
      }
      case Vn: {
        if (l) {
          let h = s;
          return l === "DataView" ? h = new Uint8Array(s.buffer) : l === "ArrayBuffer" && (h = new Uint8Array(s)), i([l, [...h]], s);
        }
        const d = [], u = i([a, d], s);
        for (const h of s)
          d.push(o(h));
        return u;
      }
      case jr: {
        if (l)
          switch (l) {
            case "BigInt":
              return i([l, s.toString()], s);
            case "Boolean":
            case "Number":
            case "String":
              return i([l, s.valueOf()], s);
          }
        if (e && "toJSON" in s)
          return o(s.toJSON());
        const d = [], u = i([a, d], s);
        for (const h of O2(s))
          (t || !xr(On(s[h]))) && d.push([o(h), o(s[h])]);
        return u;
      }
      case ws:
        return i([a, isNaN(s.getTime()) ? Bt : s.toISOString()], s);
      case ys: {
        const { source: d, flags: u } = s;
        return i([a, { source: d, flags: u }], s);
      }
      case xs: {
        const d = [], u = i([a, d], s);
        for (const [h, p] of s)
          (t || !(xr(On(h)) || xr(On(p)))) && d.push([o(h), o(p)]);
        return u;
      }
      case ks: {
        const d = [], u = i([a, d], s);
        for (const h of s)
          (t || !xr(On(h))) && d.push(o(h));
        return u;
      }
    }
    const { message: c } = s;
    return i([a, { name: l, message: c }], s);
  };
  return o;
}, Ml = (t, { json: e, lossy: n } = {}) => {
  const r = [];
  return $2(!(e || n), !!e, /* @__PURE__ */ new Map(), r)(t), r;
}, Vr = typeof structuredClone == "function" ? (
  /* c8 ignore start */
  (t, e) => e && ("json" in e || "lossy" in e) ? Rl(Ml(t, e)) : structuredClone(t)
) : (t, e) => Rl(Ml(t, e));
function F2(t, e) {
  const n = [{ type: "text", value: "↩" }];
  return e > 1 && n.push({
    type: "element",
    tagName: "sup",
    properties: {},
    children: [{ type: "text", value: String(e) }]
  }), n;
}
function B2(t, e) {
  return "Back to reference " + (t + 1) + (e > 1 ? "-" + e : "");
}
function U2(t) {
  const e = typeof t.options.clobberPrefix == "string" ? t.options.clobberPrefix : "user-content-", n = t.options.footnoteBackContent || F2, r = t.options.footnoteBackLabel || B2, i = t.options.footnoteLabel || "Footnotes", o = t.options.footnoteLabelTagName || "h2", s = t.options.footnoteLabelProperties || {
    className: ["sr-only"]
  }, a = [];
  let l = -1;
  for (; ++l < t.footnoteOrder.length; ) {
    const c = t.footnoteById.get(
      t.footnoteOrder[l]
    );
    if (!c)
      continue;
    const d = t.all(c), u = String(c.identifier).toUpperCase(), h = An(u.toLowerCase());
    let p = 0;
    const m = [], g = t.footnoteCounts.get(u);
    for (; g !== void 0 && ++p <= g; ) {
      m.length > 0 && m.push({ type: "text", value: " " });
      let k = typeof n == "string" ? n : n(l, p);
      typeof k == "string" && (k = { type: "text", value: k }), m.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + e + "fnref-" + h + (p > 1 ? "-" + p : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof r == "string" ? r : r(l, p),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(k) ? k : [k]
      });
    }
    const w = d[d.length - 1];
    if (w && w.type === "element" && w.tagName === "p") {
      const k = w.children[w.children.length - 1];
      k && k.type === "text" ? k.value += " " : w.children.push({ type: "text", value: " " }), w.children.push(...m);
    } else
      d.push(...m);
    const b = {
      type: "element",
      tagName: "li",
      properties: { id: e + "fn-" + h },
      children: t.wrap(d, !0)
    };
    t.patch(c, b), a.push(b);
  }
  if (a.length !== 0)
    return {
      type: "element",
      tagName: "section",
      properties: { dataFootnotes: !0, className: ["footnotes"] },
      children: [
        {
          type: "element",
          tagName: o,
          properties: {
            ...Vr(s),
            id: "footnote-label"
          },
          children: [{ type: "text", value: i }]
        },
        { type: "text", value: `
` },
        {
          type: "element",
          tagName: "ol",
          properties: {},
          children: t.wrap(a, !0)
        },
        { type: "text", value: `
` }
      ]
    };
}
const li = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  function(t) {
    if (t == null)
      return H2;
    if (typeof t == "function")
      return ci(t);
    if (typeof t == "object")
      return Array.isArray(t) ? j2(t) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        V2(
          /** @type {Props} */
          t
        )
      );
    if (typeof t == "string")
      return q2(t);
    throw new Error("Expected function, string, or object as test");
  }
);
function j2(t) {
  const e = [];
  let n = -1;
  for (; ++n < t.length; )
    e[n] = li(t[n]);
  return ci(r);
  function r(...i) {
    let o = -1;
    for (; ++o < e.length; )
      if (e[o].apply(this, i))
        return !0;
    return !1;
  }
}
function V2(t) {
  const e = (
    /** @type {Record<string, unknown>} */
    t
  );
  return ci(n);
  function n(r) {
    const i = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      r
    );
    let o;
    for (o in t)
      if (i[o] !== e[o])
        return !1;
    return !0;
  }
}
function q2(t) {
  return ci(e);
  function e(n) {
    return n && n.type === t;
  }
}
function ci(t) {
  return e;
  function e(n, r, i) {
    return !!(W2(n) && t.call(
      this,
      n,
      typeof r == "number" ? r : void 0,
      i || void 0
    ));
  }
}
function H2() {
  return !0;
}
function W2(t) {
  return t !== null && typeof t == "object" && "type" in t;
}
const Tp = [], G2 = !0, mo = !1, K2 = "skip";
function Ip(t, e, n, r) {
  let i;
  typeof e == "function" && typeof n != "function" ? (r = n, n = e) : i = e;
  const o = li(i), s = r ? -1 : 1;
  a(t, void 0, [])();
  function a(l, c, d) {
    const u = (
      /** @type {Record<string, unknown>} */
      l && typeof l == "object" ? l : {}
    );
    if (typeof u.type == "string") {
      const p = (
        // `hast`
        typeof u.tagName == "string" ? u.tagName : (
          // `xast`
          typeof u.name == "string" ? u.name : void 0
        )
      );
      Object.defineProperty(h, "name", {
        value: "node (" + (l.type + (p ? "<" + p + ">" : "")) + ")"
      });
    }
    return h;
    function h() {
      let p = Tp, m, g, w;
      if ((!e || o(l, c, d[d.length - 1] || void 0)) && (p = J2(n(l, d)), p[0] === mo))
        return p;
      if ("children" in l && l.children) {
        const b = (
          /** @type {UnistParent} */
          l
        );
        if (b.children && p[0] !== K2)
          for (g = (r ? b.children.length : -1) + s, w = d.concat(b); g > -1 && g < b.children.length; ) {
            const k = b.children[g];
            if (m = a(k, g, w)(), m[0] === mo)
              return m;
            g = typeof m[1] == "number" ? m[1] : g + s;
          }
      }
      return p;
    }
  }
}
function J2(t) {
  return Array.isArray(t) ? t : typeof t == "number" ? [G2, t] : t == null ? Tp : [t];
}
function _s(t, e, n, r) {
  let i, o, s;
  typeof e == "function" && typeof n != "function" ? (o = void 0, s = e, i = n) : (o = e, s = n, i = r), Ip(t, o, a, i);
  function a(l, c) {
    const d = c[c.length - 1], u = d ? d.children.indexOf(l) : void 0;
    return s(l, u, d);
  }
}
const fo = {}.hasOwnProperty, Q2 = {};
function Y2(t, e) {
  const n = e || Q2, r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = { ...D2, ...n.handlers }, a = {
    all: c,
    applyData: Z2,
    definitionById: r,
    footnoteById: i,
    footnoteCounts: o,
    footnoteOrder: [],
    handlers: s,
    one: l,
    options: n,
    patch: X2,
    wrap: tA
  };
  return _s(t, function(d) {
    if (d.type === "definition" || d.type === "footnoteDefinition") {
      const u = d.type === "definition" ? r : i, h = String(d.identifier).toUpperCase();
      u.has(h) || u.set(h, d);
    }
  }), a;
  function l(d, u) {
    const h = d.type, p = a.handlers[h];
    if (fo.call(a.handlers, h) && p)
      return p(a, d, u);
    if (a.options.passThrough && a.options.passThrough.includes(h)) {
      if ("children" in d) {
        const { children: g, ...w } = d, b = Vr(w);
        return b.children = a.all(d), b;
      }
      return Vr(d);
    }
    return (a.options.unknownHandler || eA)(a, d, u);
  }
  function c(d) {
    const u = [];
    if ("children" in d) {
      const h = d.children;
      let p = -1;
      for (; ++p < h.length; ) {
        const m = a.one(h[p], d);
        if (m) {
          if (p && h[p - 1].type === "break" && (!Array.isArray(m) && m.type === "text" && (m.value = Pl(m.value)), !Array.isArray(m) && m.type === "element")) {
            const g = m.children[0];
            g && g.type === "text" && (g.value = Pl(g.value));
          }
          Array.isArray(m) ? u.push(...m) : u.push(m);
        }
      }
    }
    return u;
  }
}
function X2(t, e) {
  t.position && (e.position = BC(t));
}
function Z2(t, e) {
  let n = e;
  if (t && t.data) {
    const r = t.data.hName, i = t.data.hChildren, o = t.data.hProperties;
    if (typeof r == "string")
      if (n.type === "element")
        n.tagName = r;
      else {
        const s = "children" in n ? n.children : [n];
        n = { type: "element", tagName: r, properties: {}, children: s };
      }
    n.type === "element" && o && Object.assign(n.properties, Vr(o)), "children" in n && n.children && i !== null && i !== void 0 && (n.children = i);
  }
  return n;
}
function eA(t, e) {
  const n = e.data || {}, r = "value" in e && !(fo.call(n, "hProperties") || fo.call(n, "hChildren")) ? { type: "text", value: e.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function tA(t, e) {
  const n = [];
  let r = -1;
  for (e && n.push({ type: "text", value: `
` }); ++r < t.length; )
    r && n.push({ type: "text", value: `
` }), n.push(t[r]);
  return e && t.length > 0 && n.push({ type: "text", value: `
` }), n;
}
function Pl(t) {
  let e = 0, n = t.charCodeAt(e);
  for (; n === 9 || n === 32; )
    e++, n = t.charCodeAt(e);
  return t.slice(e);
}
function Nl(t, e) {
  const n = Y2(t, e), r = n.one(t, void 0), i = U2(n), o = Array.isArray(r) ? { type: "root", children: r } : r || { type: "root", children: [] };
  return i && o.children.push({ type: "text", value: `
` }, i), o;
}
function nA(t, e) {
  return t && "run" in t ? async function(n, r) {
    const i = (
      /** @type {HastRoot} */
      Nl(n, { file: r, ...e })
    );
    await t.run(i, r);
  } : function(n, r) {
    return (
      /** @type {HastRoot} */
      Nl(n, { file: r, ...t || e })
    );
  };
}
function Dl(t) {
  if (t)
    throw t;
}
var Ar = Object.prototype.hasOwnProperty, Ap = Object.prototype.toString, Ll = Object.defineProperty, zl = Object.getOwnPropertyDescriptor, Ol = function(e) {
  return typeof Array.isArray == "function" ? Array.isArray(e) : Ap.call(e) === "[object Array]";
}, $l = function(e) {
  if (!e || Ap.call(e) !== "[object Object]")
    return !1;
  var n = Ar.call(e, "constructor"), r = e.constructor && e.constructor.prototype && Ar.call(e.constructor.prototype, "isPrototypeOf");
  if (e.constructor && !n && !r)
    return !1;
  var i;
  for (i in e)
    ;
  return typeof i > "u" || Ar.call(e, i);
}, Fl = function(e, n) {
  Ll && n.name === "__proto__" ? Ll(e, n.name, {
    enumerable: !0,
    configurable: !0,
    value: n.newValue,
    writable: !0
  }) : e[n.name] = n.newValue;
}, Bl = function(e, n) {
  if (n === "__proto__")
    if (Ar.call(e, n)) {
      if (zl)
        return zl(e, n).value;
    } else
      return;
  return e[n];
}, rA = function t() {
  var e, n, r, i, o, s, a = arguments[0], l = 1, c = arguments.length, d = !1;
  for (typeof a == "boolean" && (d = a, a = arguments[1] || {}, l = 2), (a == null || typeof a != "object" && typeof a != "function") && (a = {}); l < c; ++l)
    if (e = arguments[l], e != null)
      for (n in e)
        r = Bl(a, n), i = Bl(e, n), a !== i && (d && i && ($l(i) || (o = Ol(i))) ? (o ? (o = !1, s = r && Ol(r) ? r : []) : s = r && $l(r) ? r : {}, Fl(a, { name: n, newValue: t(d, s, i) })) : typeof i < "u" && Fl(a, { name: n, newValue: i }));
  return a;
};
const Ri = /* @__PURE__ */ Zr(rA);
function go(t) {
  if (typeof t != "object" || t === null)
    return !1;
  const e = Object.getPrototypeOf(t);
  return (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) && !(Symbol.toStringTag in t) && !(Symbol.iterator in t);
}
function iA() {
  const t = [], e = { run: n, use: r };
  return e;
  function n(...i) {
    let o = -1;
    const s = i.pop();
    if (typeof s != "function")
      throw new TypeError("Expected function as last argument, not " + s);
    a(null, ...i);
    function a(l, ...c) {
      const d = t[++o];
      let u = -1;
      if (l) {
        s(l);
        return;
      }
      for (; ++u < i.length; )
        (c[u] === null || c[u] === void 0) && (c[u] = i[u]);
      i = c, d ? oA(d, a)(...c) : s(null, ...c);
    }
  }
  function r(i) {
    if (typeof i != "function")
      throw new TypeError(
        "Expected `middelware` to be a function, not " + i
      );
    return t.push(i), e;
  }
}
function oA(t, e) {
  let n;
  return r;
  function r(...s) {
    const a = t.length > s.length;
    let l;
    a && s.push(i);
    try {
      l = t.apply(this, s);
    } catch (c) {
      const d = (
        /** @type {Error} */
        c
      );
      if (a && n)
        throw d;
      return i(d);
    }
    a || (l && l.then && typeof l.then == "function" ? l.then(o, i) : l instanceof Error ? i(l) : o(l));
  }
  function i(s, ...a) {
    n || (n = !0, e(s, ...a));
  }
  function o(s) {
    i(null, s);
  }
}
const ut = { basename: sA, dirname: aA, extname: lA, join: cA, sep: "/" };
function sA(t, e) {
  if (e !== void 0 && typeof e != "string")
    throw new TypeError('"ext" argument must be a string');
  lr(t);
  let n = 0, r = -1, i = t.length, o;
  if (e === void 0 || e.length === 0 || e.length > t.length) {
    for (; i--; )
      if (t.codePointAt(i) === 47) {
        if (o) {
          n = i + 1;
          break;
        }
      } else
        r < 0 && (o = !0, r = i + 1);
    return r < 0 ? "" : t.slice(n, r);
  }
  if (e === t)
    return "";
  let s = -1, a = e.length - 1;
  for (; i--; )
    if (t.codePointAt(i) === 47) {
      if (o) {
        n = i + 1;
        break;
      }
    } else
      s < 0 && (o = !0, s = i + 1), a > -1 && (t.codePointAt(i) === e.codePointAt(a--) ? a < 0 && (r = i) : (a = -1, r = s));
  return n === r ? r = s : r < 0 && (r = t.length), t.slice(n, r);
}
function aA(t) {
  if (lr(t), t.length === 0)
    return ".";
  let e = -1, n = t.length, r;
  for (; --n; )
    if (t.codePointAt(n) === 47) {
      if (r) {
        e = n;
        break;
      }
    } else
      r || (r = !0);
  return e < 0 ? t.codePointAt(0) === 47 ? "/" : "." : e === 1 && t.codePointAt(0) === 47 ? "//" : t.slice(0, e);
}
function lA(t) {
  lr(t);
  let e = t.length, n = -1, r = 0, i = -1, o = 0, s;
  for (; e--; ) {
    const a = t.codePointAt(e);
    if (a === 47) {
      if (s) {
        r = e + 1;
        break;
      }
      continue;
    }
    n < 0 && (s = !0, n = e + 1), a === 46 ? i < 0 ? i = e : o !== 1 && (o = 1) : i > -1 && (o = -1);
  }
  return i < 0 || n < 0 || // We saw a non-dot character immediately before the dot.
  o === 0 || // The (right-most) trimmed path component is exactly `..`.
  o === 1 && i === n - 1 && i === r + 1 ? "" : t.slice(i, n);
}
function cA(...t) {
  let e = -1, n;
  for (; ++e < t.length; )
    lr(t[e]), t[e] && (n = n === void 0 ? t[e] : n + "/" + t[e]);
  return n === void 0 ? "." : uA(n);
}
function uA(t) {
  lr(t);
  const e = t.codePointAt(0) === 47;
  let n = dA(t, !e);
  return n.length === 0 && !e && (n = "."), n.length > 0 && t.codePointAt(t.length - 1) === 47 && (n += "/"), e ? "/" + n : n;
}
function dA(t, e) {
  let n = "", r = 0, i = -1, o = 0, s = -1, a, l;
  for (; ++s <= t.length; ) {
    if (s < t.length)
      a = t.codePointAt(s);
    else {
      if (a === 47)
        break;
      a = 47;
    }
    if (a === 47) {
      if (!(i === s - 1 || o === 1))
        if (i !== s - 1 && o === 2) {
          if (n.length < 2 || r !== 2 || n.codePointAt(n.length - 1) !== 46 || n.codePointAt(n.length - 2) !== 46) {
            if (n.length > 2) {
              if (l = n.lastIndexOf("/"), l !== n.length - 1) {
                l < 0 ? (n = "", r = 0) : (n = n.slice(0, l), r = n.length - 1 - n.lastIndexOf("/")), i = s, o = 0;
                continue;
              }
            } else if (n.length > 0) {
              n = "", r = 0, i = s, o = 0;
              continue;
            }
          }
          e && (n = n.length > 0 ? n + "/.." : "..", r = 2);
        } else
          n.length > 0 ? n += "/" + t.slice(i + 1, s) : n = t.slice(i + 1, s), r = s - i - 1;
      i = s, o = 0;
    } else
      a === 46 && o > -1 ? o++ : o = -1;
  }
  return n;
}
function lr(t) {
  if (typeof t != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(t)
    );
}
const hA = { cwd: pA };
function pA() {
  return "/";
}
function bo(t) {
  return !!(t !== null && typeof t == "object" && "href" in t && t.href && "protocol" in t && t.protocol && // @ts-expect-error: indexing is fine.
  t.auth === void 0);
}
function mA(t) {
  if (typeof t == "string")
    t = new URL(t);
  else if (!bo(t)) {
    const e = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + t + "`"
    );
    throw e.code = "ERR_INVALID_ARG_TYPE", e;
  }
  if (t.protocol !== "file:") {
    const e = new TypeError("The URL must be of scheme file");
    throw e.code = "ERR_INVALID_URL_SCHEME", e;
  }
  return fA(t);
}
function fA(t) {
  if (t.hostname !== "") {
    const r = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    throw r.code = "ERR_INVALID_FILE_URL_HOST", r;
  }
  const e = t.pathname;
  let n = -1;
  for (; ++n < e.length; )
    if (e.codePointAt(n) === 37 && e.codePointAt(n + 1) === 50) {
      const r = e.codePointAt(n + 2);
      if (r === 70 || r === 102) {
        const i = new TypeError(
          "File URL path must not include encoded / characters"
        );
        throw i.code = "ERR_INVALID_FILE_URL_PATH", i;
      }
    }
  return decodeURIComponent(e);
}
const Mi = (
  /** @type {const} */
  [
    "history",
    "path",
    "basename",
    "stem",
    "extname",
    "dirname"
  ]
);
class Ep {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Uint8Array` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(e) {
    let n;
    e ? bo(e) ? n = { path: e } : typeof e == "string" || gA(e) ? n = { value: e } : n = e : n = {}, this.cwd = "cwd" in n ? "" : hA.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
    let r = -1;
    for (; ++r < Mi.length; ) {
      const o = Mi[r];
      o in n && n[o] !== void 0 && n[o] !== null && (this[o] = o === "history" ? [...n[o]] : n[o]);
    }
    let i;
    for (i in n)
      Mi.includes(i) || (this[i] = n[i]);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path == "string" ? ut.basename(this.path) : void 0;
  }
  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} basename
   *   Basename.
   * @returns {undefined}
   *   Nothing.
   */
  set basename(e) {
    Ni(e, "basename"), Pi(e, "basename"), this.path = ut.join(this.dirname || "", e);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path == "string" ? ut.dirname(this.path) : void 0;
  }
  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} dirname
   *   Dirname.
   * @returns {undefined}
   *   Nothing.
   */
  set dirname(e) {
    Ul(this.basename, "dirname"), this.path = ut.join(e || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path == "string" ? ut.extname(this.path) : void 0;
  }
  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} extname
   *   Extname.
   * @returns {undefined}
   *   Nothing.
   */
  set extname(e) {
    if (Pi(e, "extname"), Ul(this.dirname, "extname"), e) {
      if (e.codePointAt(0) !== 46)
        throw new Error("`extname` must start with `.`");
      if (e.includes(".", 1))
        throw new Error("`extname` cannot contain multiple dots");
    }
    this.path = ut.join(this.dirname, this.stem + (e || ""));
  }
  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   *   Path.
   */
  get path() {
    return this.history[this.history.length - 1];
  }
  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {URL | string} path
   *   Path.
   * @returns {undefined}
   *   Nothing.
   */
  set path(e) {
    bo(e) && (e = mA(e)), Ni(e, "path"), this.path !== e && this.history.push(e);
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path == "string" ? ut.basename(this.path, this.extname) : void 0;
  }
  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} stem
   *   Stem.
   * @returns {undefined}
   *   Nothing.
   */
  set stem(e) {
    Ni(e, "stem"), Pi(e, "stem"), this.path = ut.join(this.dirname || "", e + (this.extname || ""));
  }
  // Normal prototypal methods.
  /**
   * Create a fatal message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `true` (error; file not usable)
   * and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Never.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(e, n, r) {
    const i = this.message(e, n, r);
    throw i.fatal = !0, i;
  }
  /**
   * Create an info message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `undefined` (info; change
   * likely not needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(e, n, r) {
    const i = this.message(e, n, r);
    return i.fatal = void 0, i;
  }
  /**
   * Create a message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `false` (warning; change may be
   * needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(e, n, r) {
    const i = new Me(
      // @ts-expect-error: the overloads are fine.
      e,
      n,
      r
    );
    return this.path && (i.name = this.path + ":" + i.name, i.file = this.path), i.fatal = !1, this.messages.push(i), i;
  }
  /**
   * Serialize the file.
   *
   * > **Note**: which encodings are supported depends on the engine.
   * > For info on Node.js, see:
   * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
   *
   * @param {string | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Uint8Array`
   *   (default: `'utf-8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(e) {
    return this.value === void 0 ? "" : typeof this.value == "string" ? this.value : new TextDecoder(e || void 0).decode(this.value);
  }
}
function Pi(t, e) {
  if (t && t.includes(ut.sep))
    throw new Error(
      "`" + e + "` cannot be a path: did not expect `" + ut.sep + "`"
    );
}
function Ni(t, e) {
  if (!t)
    throw new Error("`" + e + "` cannot be empty");
}
function Ul(t, e) {
  if (!t)
    throw new Error("Setting `" + e + "` requires `path` to be set too");
}
function gA(t) {
  return !!(t && typeof t == "object" && "byteLength" in t && "byteOffset" in t);
}
const bA = (
  /**
   * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
   */
  /** @type {unknown} */
  /**
   * @this {Function}
   * @param {string | symbol} property
   * @returns {(...parameters: Array<unknown>) => unknown}
   */
  function(t) {
    const r = (
      /** @type {Record<string | symbol, Function>} */
      // Prototypes do exist.
      // type-coverage:ignore-next-line
      this.constructor.prototype
    ), i = r[t], o = function() {
      return i.apply(o, arguments);
    };
    return Object.setPrototypeOf(o, r), o;
  }
), vA = {}.hasOwnProperty;
class Ss extends bA {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = iA();
  }
  /**
   * Copy a processor.
   *
   * @deprecated
   *   This is a private internal method and should not be used.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   New *unfrozen* processor ({@linkcode Processor}) that is
   *   configured to work the same as its ancestor.
   *   When the descendant processor is configured in the future it does not
   *   affect the ancestral processor.
   */
  copy() {
    const e = (
      /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
      new Ss()
    );
    let n = -1;
    for (; ++n < this.attachers.length; ) {
      const r = this.attachers[n];
      e.use(...r);
    }
    return e.data(Ri(!0, {}, this.namespace)), e;
  }
  /**
   * Configure the processor with info available to all plugins.
   * Information is stored in an object.
   *
   * Typically, options can be given to a specific plugin, but sometimes it
   * makes sense to have information shared with several plugins.
   * For example, a list of HTML elements that are self-closing, which is
   * needed during all phases.
   *
   * > **Note**: setting information cannot occur on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * > **Note**: to register custom data in TypeScript, augment the
   * > {@linkcode Data} interface.
   *
   * @example
   *   This example show how to get and set info:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   const processor = unified().data('alpha', 'bravo')
   *
   *   processor.data('alpha') // => 'bravo'
   *
   *   processor.data() // => {alpha: 'bravo'}
   *
   *   processor.data({charlie: 'delta'})
   *
   *   processor.data() // => {charlie: 'delta'}
   *   ```
   *
   * @template {keyof Data} Key
   *
   * @overload
   * @returns {Data}
   *
   * @overload
   * @param {Data} dataset
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Key} key
   * @returns {Data[Key]}
   *
   * @overload
   * @param {Key} key
   * @param {Data[Key]} value
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @param {Data | Key} [key]
   *   Key to get or set, or entire dataset to set, or nothing to get the
   *   entire dataset (optional).
   * @param {Data[Key]} [value]
   *   Value to set (optional).
   * @returns {unknown}
   *   The current processor when setting, the value at `key` when getting, or
   *   the entire dataset when getting without key.
   */
  data(e, n) {
    return typeof e == "string" ? arguments.length === 2 ? (zi("data", this.frozen), this.namespace[e] = n, this) : vA.call(this.namespace, e) && this.namespace[e] || void 0 : e ? (zi("data", this.frozen), this.namespace = e, this) : this.namespace;
  }
  /**
   * Freeze a processor.
   *
   * Frozen processors are meant to be extended and not to be configured
   * directly.
   *
   * When a processor is frozen it cannot be unfrozen.
   * New processors working the same way can be created by calling the
   * processor.
   *
   * It’s possible to freeze processors explicitly by calling `.freeze()`.
   * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
   * `.stringify()`, `.process()`, or `.processSync()` are called.
   *
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   The current processor.
   */
  freeze() {
    if (this.frozen)
      return this;
    const e = (
      /** @type {Processor} */
      /** @type {unknown} */
      this
    );
    for (; ++this.freezeIndex < this.attachers.length; ) {
      const [n, ...r] = this.attachers[this.freezeIndex];
      if (r[0] === !1)
        continue;
      r[0] === !0 && (r[0] = void 0);
      const i = n.call(e, ...r);
      typeof i == "function" && this.transformers.use(i);
    }
    return this.frozen = !0, this.freezeIndex = Number.POSITIVE_INFINITY, this;
  }
  /**
   * Parse text to a syntax tree.
   *
   * > **Note**: `parse` freezes the processor if not already *frozen*.
   *
   * > **Note**: `parse` performs the parse phase, not the run phase or other
   * > phases.
   *
   * @param {Compatible | undefined} [file]
   *   file to parse (optional); typically `string` or `VFile`; any value
   *   accepted as `x` in `new VFile(x)`.
   * @returns {ParseTree extends undefined ? Node : ParseTree}
   *   Syntax tree representing `file`.
   */
  parse(e) {
    this.freeze();
    const n = kr(e), r = this.parser || this.Parser;
    return Di("parse", r), r(String(n), n);
  }
  /**
   * Process the given file as configured on the processor.
   *
   * > **Note**: `process` freezes the processor if not already *frozen*.
   *
   * > **Note**: `process` performs the parse, run, and stringify phases.
   *
   * @overload
   * @param {Compatible | undefined} file
   * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
   * @returns {undefined}
   *
   * @overload
   * @param {Compatible | undefined} [file]
   * @returns {Promise<VFileWithOutput<CompileResult>>}
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`]; any value accepted as
   *   `x` in `new VFile(x)`.
   * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
   *   Callback (optional).
   * @returns {Promise<VFile> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise a promise, rejected with a fatal error or resolved with the
   *   processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  process(e, n) {
    const r = this;
    return this.freeze(), Di("process", this.parser || this.Parser), Li("process", this.compiler || this.Compiler), n ? i(void 0, n) : new Promise(i);
    function i(o, s) {
      const a = kr(e), l = (
        /** @type {HeadTree extends undefined ? Node : HeadTree} */
        /** @type {unknown} */
        r.parse(a)
      );
      r.run(l, a, function(d, u, h) {
        if (d || !u || !h)
          return c(d);
        const p = (
          /** @type {CompileTree extends undefined ? Node : CompileTree} */
          /** @type {unknown} */
          u
        ), m = r.stringify(p, h);
        xA(m) ? h.value = m : h.result = m, c(
          d,
          /** @type {VFileWithOutput<CompileResult>} */
          h
        );
      });
      function c(d, u) {
        d || !u ? s(d) : o ? o(u) : n(void 0, u);
      }
    }
  }
  /**
   * Process the given file as configured on the processor.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `processSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `processSync` performs the parse, run, and stringify phases.
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`; any value accepted as
   *   `x` in `new VFile(x)`.
   * @returns {VFileWithOutput<CompileResult>}
   *   The processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  processSync(e) {
    let n = !1, r;
    return this.freeze(), Di("processSync", this.parser || this.Parser), Li("processSync", this.compiler || this.Compiler), this.process(e, i), Vl("processSync", "process", n), r;
    function i(o, s) {
      n = !0, Dl(o), r = s;
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * > **Note**: `run` freezes the processor if not already *frozen*.
   *
   * > **Note**: `run` performs the run phase, not other phases.
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} file
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} [file]
   * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {(
   *   RunCallback<TailTree extends undefined ? Node : TailTree> |
   *   Compatible
   * )} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
   *   Callback (optional).
   * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise, a promise rejected with a fatal error or resolved with the
   *   transformed tree.
   */
  run(e, n, r) {
    jl(e), this.freeze();
    const i = this.transformers;
    return !r && typeof n == "function" && (r = n, n = void 0), r ? o(void 0, r) : new Promise(o);
    function o(s, a) {
      const l = kr(n);
      i.run(e, l, c);
      function c(d, u, h) {
        const p = (
          /** @type {TailTree extends undefined ? Node : TailTree} */
          u || e
        );
        d ? a(d) : s ? s(p) : r(void 0, p, h);
      }
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `runSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `runSync` performs the run phase, not other phases.
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {TailTree extends undefined ? Node : TailTree}
   *   Transformed tree.
   */
  runSync(e, n) {
    let r = !1, i;
    return this.run(e, n, o), Vl("runSync", "run", r), i;
    function o(s, a) {
      Dl(s), i = a, r = !0;
    }
  }
  /**
   * Compile a syntax tree.
   *
   * > **Note**: `stringify` freezes the processor if not already *frozen*.
   *
   * > **Note**: `stringify` performs the stringify phase, not the run phase
   * > or other phases.
   *
   * @param {CompileTree extends undefined ? Node : CompileTree} tree
   *   Tree to compile.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {CompileResult extends undefined ? Value : CompileResult}
   *   Textual representation of the tree (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most compilers
   *   > return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  stringify(e, n) {
    this.freeze();
    const r = kr(n), i = this.compiler || this.Compiler;
    return Li("stringify", i), jl(e), i(e, r);
  }
  /**
   * Configure the processor to use a plugin, a list of usable values, or a
   * preset.
   *
   * If the processor is already using a plugin, the previous plugin
   * configuration is changed based on the options that are passed in.
   * In other words, the plugin is not added a second time.
   *
   * > **Note**: `use` cannot be called on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * @example
   *   There are many ways to pass plugins to `.use()`.
   *   This example gives an overview:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   unified()
   *     // Plugin with options:
   *     .use(pluginA, {x: true, y: true})
   *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
   *     .use(pluginA, {y: false, z: true})
   *     // Plugins:
   *     .use([pluginB, pluginC])
   *     // Two plugins, the second with options:
   *     .use([pluginD, [pluginE, {}]])
   *     // Preset with plugins and settings:
   *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
   *     // Settings only:
   *     .use({settings: {position: false}})
   *   ```
   *
   * @template {Array<unknown>} [Parameters=[]]
   * @template {Node | string | undefined} [Input=undefined]
   * @template [Output=Input]
   *
   * @overload
   * @param {Preset | null | undefined} [preset]
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {PluggableList} list
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Plugin<Parameters, Input, Output>} plugin
   * @param {...(Parameters | [boolean])} parameters
   * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
   *
   * @param {PluggableList | Plugin | Preset | null | undefined} value
   *   Usable value.
   * @param {...unknown} parameters
   *   Parameters, when a plugin is given as a usable value.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   Current processor.
   */
  use(e, ...n) {
    const r = this.attachers, i = this.namespace;
    if (zi("use", this.frozen), e != null)
      if (typeof e == "function")
        l(e, n);
      else if (typeof e == "object")
        Array.isArray(e) ? a(e) : s(e);
      else
        throw new TypeError("Expected usable value, not `" + e + "`");
    return this;
    function o(c) {
      if (typeof c == "function")
        l(c, []);
      else if (typeof c == "object")
        if (Array.isArray(c)) {
          const [d, ...u] = (
            /** @type {PluginTuple<Array<unknown>>} */
            c
          );
          l(d, u);
        } else
          s(c);
      else
        throw new TypeError("Expected usable value, not `" + c + "`");
    }
    function s(c) {
      if (!("plugins" in c) && !("settings" in c))
        throw new Error(
          "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
        );
      a(c.plugins), c.settings && (i.settings = Ri(!0, i.settings, c.settings));
    }
    function a(c) {
      let d = -1;
      if (c != null)
        if (Array.isArray(c))
          for (; ++d < c.length; ) {
            const u = c[d];
            o(u);
          }
        else
          throw new TypeError("Expected a list of plugins, not `" + c + "`");
    }
    function l(c, d) {
      let u = -1, h = -1;
      for (; ++u < r.length; )
        if (r[u][0] === c) {
          h = u;
          break;
        }
      if (h === -1)
        r.push([c, ...d]);
      else if (d.length > 0) {
        let [p, ...m] = d;
        const g = r[h][1];
        go(g) && go(p) && (p = Ri(!0, g, p)), r[h] = [c, p, ...m];
      }
    }
  }
}
const wA = new Ss().freeze();
function Di(t, e) {
  if (typeof e != "function")
    throw new TypeError("Cannot `" + t + "` without `parser`");
}
function Li(t, e) {
  if (typeof e != "function")
    throw new TypeError("Cannot `" + t + "` without `compiler`");
}
function zi(t, e) {
  if (e)
    throw new Error(
      "Cannot call `" + t + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
}
function jl(t) {
  if (!go(t) || typeof t.type != "string")
    throw new TypeError("Expected node, got `" + t + "`");
}
function Vl(t, e, n) {
  if (!n)
    throw new Error(
      "`" + t + "` finished async. Use `" + e + "` instead"
    );
}
function kr(t) {
  return yA(t) ? t : new Ep(t);
}
function yA(t) {
  return !!(t && typeof t == "object" && "message" in t && "messages" in t);
}
function xA(t) {
  return typeof t == "string" || kA(t);
}
function kA(t) {
  return !!(t && typeof t == "object" && "byteLength" in t && "byteOffset" in t);
}
const _A = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md", ql = [], Hl = { allowDangerousHtml: !0 }, SA = /^(https?|ircs?|mailto|xmpp)$/i, CA = [
  { from: "astPlugins", id: "remove-buggy-html-in-markdown-parser" },
  { from: "allowDangerousHtml", id: "remove-buggy-html-in-markdown-parser" },
  {
    from: "allowNode",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowElement"
  },
  {
    from: "allowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowedElements"
  },
  { from: "className", id: "remove-classname" },
  {
    from: "disallowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "disallowedElements"
  },
  { from: "escapeHtml", id: "remove-buggy-html-in-markdown-parser" },
  { from: "includeElementIndex", id: "#remove-includeelementindex" },
  {
    from: "includeNodeIndex",
    id: "change-includenodeindex-to-includeelementindex"
  },
  { from: "linkTarget", id: "remove-linktarget" },
  { from: "plugins", id: "change-plugins-to-remarkplugins", to: "remarkPlugins" },
  { from: "rawSourcePos", id: "#remove-rawsourcepos" },
  { from: "renderers", id: "change-renderers-to-components", to: "components" },
  { from: "source", id: "change-source-to-children", to: "children" },
  { from: "sourcePos", id: "#remove-sourcepos" },
  { from: "transformImageUri", id: "#add-urltransform", to: "urlTransform" },
  { from: "transformLinkUri", id: "#add-urltransform", to: "urlTransform" }
];
function TA(t) {
  const e = IA(t), n = AA(t);
  return EA(e.runSync(e.parse(n), n), t);
}
function IA(t) {
  const e = t.rehypePlugins || ql, n = t.remarkPlugins || ql, r = t.remarkRehypeOptions ? { ...t.remarkRehypeOptions, ...Hl } : Hl;
  return wA().use(l2).use(n).use(nA, r).use(e);
}
function AA(t) {
  const e = t.children || "", n = new Ep();
  return typeof e == "string" && (n.value = e), n;
}
function EA(t, e) {
  const n = e.allowedElements, r = e.allowElement, i = e.components, o = e.disallowedElements, s = e.skipHtml, a = e.unwrapDisallowed, l = e.urlTransform || RA;
  for (const d of CA)
    Object.hasOwn(e, d.from) && ("" + d.from + (d.to ? "use `" + d.to + "` instead" : "remove it") + _A + d.id, void 0);
  return _s(t, c), HC(t, {
    Fragment: Ke,
    components: i,
    ignoreInvalidStyle: !0,
    jsx: f,
    jsxs: j,
    passKeys: !0,
    passNode: !0
  });
  function c(d, u, h) {
    if (d.type === "raw" && h && typeof u == "number")
      return s ? h.children.splice(u, 1) : h.children[u] = { type: "text", value: d.value }, u;
    if (d.type === "element") {
      let p;
      for (p in Ii)
        if (Object.hasOwn(Ii, p) && Object.hasOwn(d.properties, p)) {
          const m = d.properties[p], g = Ii[p];
          (g === null || g.includes(d.tagName)) && (d.properties[p] = l(String(m || ""), p, d));
        }
    }
    if (d.type === "element") {
      let p = n ? !n.includes(d.tagName) : o ? o.includes(d.tagName) : !1;
      if (!p && r && typeof u == "number" && (p = !r(d, u, h)), p && h && typeof u == "number")
        return a && d.children ? h.children.splice(u, 1, ...d.children) : h.children.splice(u, 1), u;
    }
  }
}
function RA(t) {
  const e = t.indexOf(":"), n = t.indexOf("?"), r = t.indexOf("#"), i = t.indexOf("/");
  return (
    // If there is no protocol, it’s relative.
    e === -1 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    i !== -1 && e > i || n !== -1 && e > n || r !== -1 && e > r || // It is a protocol, it should be allowed.
    SA.test(t.slice(0, e)) ? t : ""
  );
}
const { useSmooth: MA, useSmoothStatus: PA, withSmoothContextProvider: NA } = Ek, DA = ({ components: t, componentsByLanguage: e, smooth: n = !0, defer: r = !1, preprocess: i, ...o }) => {
  const s = Xd(), { text: a } = MA(Tt(() => i ? {
    ...s,
    text: i(s.text)
  } : s, [s, i]), n), l = pc(a), c = r ? l : a, { pre: d = US, code: u = jS, SyntaxHighlighter: h = ls, CodeHeader: p = VS } = t ?? {}, m = Tt(() => ({
    Pre: d,
    Code: u,
    SyntaxHighlighter: h,
    CodeHeader: p
  }), [
    d,
    u,
    h,
    p
  ]), g = Kt((w) => /* @__PURE__ */ f(KS, {
    components: m,
    componentsByLanguage: e,
    ...w
  }));
  return /* @__PURE__ */ f(TA, {
    components: Tt(() => {
      const { pre: w, code: b, SyntaxHighlighter: k, CodeHeader: x, ...T } = t ?? {};
      return {
        ...T,
        pre: BS,
        code: g
      };
    }, [g, t]),
    ...o,
    children: c
  });
}, Rp = ie(({ className: t, containerProps: e, containerComponent: n = "div", ...r }, i) => /* @__PURE__ */ f(n, {
  "data-status": PA().type,
  ...e,
  className: Wh(t, e == null ? void 0 : e.className),
  ref: i,
  children: /* @__PURE__ */ f(DA, { ...r })
}));
Rp.displayName = "MarkdownTextPrimitive";
const LA = NA(Rp);
function Wl(t, e) {
  const n = String(t);
  if (typeof e != "string")
    throw new TypeError("Expected character");
  let r = 0, i = n.indexOf(e);
  for (; i !== -1; )
    r++, i = n.indexOf(e, i + e.length);
  return r;
}
function zA(t) {
  if (typeof t != "string")
    throw new TypeError("Expected a string");
  return t.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function OA(t, e, n) {
  const i = li((n || {}).ignore || []), o = $A(e);
  let s = -1;
  for (; ++s < o.length; )
    Ip(t, "text", a);
  function a(c, d) {
    let u = -1, h;
    for (; ++u < d.length; ) {
      const p = d[u], m = h ? h.children : void 0;
      if (i(
        p,
        m ? m.indexOf(p) : void 0,
        h
      ))
        return;
      h = p;
    }
    if (h)
      return l(c, d);
  }
  function l(c, d) {
    const u = d[d.length - 1], h = o[s][0], p = o[s][1];
    let m = 0;
    const w = u.children.indexOf(c);
    let b = !1, k = [];
    h.lastIndex = 0;
    let x = h.exec(c.value);
    for (; x; ) {
      const T = x.index, I = {
        index: x.index,
        input: x.input,
        stack: [...d, c]
      };
      let y = p(...x, I);
      if (typeof y == "string" && (y = y.length > 0 ? { type: "text", value: y } : void 0), y === !1 ? h.lastIndex = T + 1 : (m !== T && k.push({
        type: "text",
        value: c.value.slice(m, T)
      }), Array.isArray(y) ? k.push(...y) : y && k.push(y), m = T + x[0].length, b = !0), !h.global)
        break;
      x = h.exec(c.value);
    }
    return b ? (m < c.value.length && k.push({ type: "text", value: c.value.slice(m) }), u.children.splice(w, 1, ...k)) : k = [c], w + k.length;
  }
}
function $A(t) {
  const e = [];
  if (!Array.isArray(t))
    throw new TypeError("Expected find and replace tuple or list of tuples");
  const n = !t[0] || Array.isArray(t[0]) ? t : [t];
  let r = -1;
  for (; ++r < n.length; ) {
    const i = n[r];
    e.push([FA(i[0]), BA(i[1])]);
  }
  return e;
}
function FA(t) {
  return typeof t == "string" ? new RegExp(zA(t), "g") : t;
}
function BA(t) {
  return typeof t == "function" ? t : function() {
    return t;
  };
}
const Oi = "phrasing", $i = ["autolink", "link", "image", "label"];
function UA() {
  return {
    transforms: [KA],
    enter: {
      literalAutolink: VA,
      literalAutolinkEmail: Fi,
      literalAutolinkHttp: Fi,
      literalAutolinkWww: Fi
    },
    exit: {
      literalAutolink: GA,
      literalAutolinkEmail: WA,
      literalAutolinkHttp: qA,
      literalAutolinkWww: HA
    }
  };
}
function jA() {
  return {
    unsafe: [
      {
        character: "@",
        before: "[+\\-.\\w]",
        after: "[\\-.\\w]",
        inConstruct: Oi,
        notInConstruct: $i
      },
      {
        character: ".",
        before: "[Ww]",
        after: "[\\-.\\w]",
        inConstruct: Oi,
        notInConstruct: $i
      },
      {
        character: ":",
        before: "[ps]",
        after: "\\/",
        inConstruct: Oi,
        notInConstruct: $i
      }
    ]
  };
}
function VA(t) {
  this.enter({ type: "link", title: null, url: "", children: [] }, t);
}
function Fi(t) {
  this.config.enter.autolinkProtocol.call(this, t);
}
function qA(t) {
  this.config.exit.autolinkProtocol.call(this, t);
}
function HA(t) {
  this.config.exit.data.call(this, t);
  const e = this.stack[this.stack.length - 1];
  e.type, e.url = "http://" + this.sliceSerialize(t);
}
function WA(t) {
  this.config.exit.autolinkEmail.call(this, t);
}
function GA(t) {
  this.exit(t);
}
function KA(t) {
  OA(
    t,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, JA],
      [new RegExp("(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)", "gu"), QA]
    ],
    { ignore: ["link", "linkReference"] }
  );
}
function JA(t, e, n, r, i) {
  let o = "";
  if (!Mp(i) || (/^w/i.test(e) && (n = e + n, e = "", o = "http://"), !YA(n)))
    return !1;
  const s = XA(n + r);
  if (!s[0])
    return !1;
  const a = {
    type: "link",
    title: null,
    url: o + e + s[0],
    children: [{ type: "text", value: e + s[0] }]
  };
  return s[1] ? [a, { type: "text", value: s[1] }] : a;
}
function QA(t, e, n, r) {
  return (
    // Not an expected previous character.
    !Mp(r, !0) || // Label ends in not allowed character.
    /[-\d_]$/.test(n) ? !1 : {
      type: "link",
      title: null,
      url: "mailto:" + e + "@" + n,
      children: [{ type: "text", value: e + "@" + n }]
    }
  );
}
function YA(t) {
  const e = t.split(".");
  return !(e.length < 2 || e[e.length - 1] && (/_/.test(e[e.length - 1]) || !/[a-zA-Z\d]/.test(e[e.length - 1])) || e[e.length - 2] && (/_/.test(e[e.length - 2]) || !/[a-zA-Z\d]/.test(e[e.length - 2])));
}
function XA(t) {
  const e = /[!"&'),.:;<>?\]}]+$/.exec(t);
  if (!e)
    return [t, void 0];
  t = t.slice(0, e.index);
  let n = e[0], r = n.indexOf(")");
  const i = Wl(t, "(");
  let o = Wl(t, ")");
  for (; r !== -1 && i > o; )
    t += n.slice(0, r + 1), n = n.slice(r + 1), r = n.indexOf(")"), o++;
  return [t, n];
}
function Mp(t, e) {
  const n = t.input.charCodeAt(t.index - 1);
  return (t.index === 0 || Jt(n) || oi(n)) && // If it’s an email, the previous character should not be a slash.
  (!e || n !== 47);
}
Pp.peek = aE;
function ZA() {
  this.buffer();
}
function eE(t) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, t);
}
function tE() {
  this.buffer();
}
function nE(t) {
  this.enter(
    { type: "footnoteDefinition", identifier: "", label: "", children: [] },
    t
  );
}
function rE(t) {
  const e = this.resume(), n = this.stack[this.stack.length - 1];
  n.type, n.identifier = rt(
    this.sliceSerialize(t)
  ).toLowerCase(), n.label = e;
}
function iE(t) {
  this.exit(t);
}
function oE(t) {
  const e = this.resume(), n = this.stack[this.stack.length - 1];
  n.type, n.identifier = rt(
    this.sliceSerialize(t)
  ).toLowerCase(), n.label = e;
}
function sE(t) {
  this.exit(t);
}
function aE() {
  return "[";
}
function Pp(t, e, n, r) {
  const i = n.createTracker(r);
  let o = i.move("[^");
  const s = n.enter("footnoteReference"), a = n.enter("reference");
  return o += i.move(
    n.safe(n.associationId(t), { after: "]", before: o })
  ), a(), s(), o += i.move("]"), o;
}
function lE() {
  return {
    enter: {
      gfmFootnoteCallString: ZA,
      gfmFootnoteCall: eE,
      gfmFootnoteDefinitionLabelString: tE,
      gfmFootnoteDefinition: nE
    },
    exit: {
      gfmFootnoteCallString: rE,
      gfmFootnoteCall: iE,
      gfmFootnoteDefinitionLabelString: oE,
      gfmFootnoteDefinition: sE
    }
  };
}
function cE(t) {
  let e = !1;
  return t && t.firstLineBlank && (e = !0), {
    handlers: { footnoteDefinition: n, footnoteReference: Pp },
    // This is on by default already.
    unsafe: [{ character: "[", inConstruct: ["label", "phrasing", "reference"] }]
  };
  function n(r, i, o, s) {
    const a = o.createTracker(s);
    let l = a.move("[^");
    const c = o.enter("footnoteDefinition"), d = o.enter("label");
    return l += a.move(
      o.safe(o.associationId(r), { before: l, after: "]" })
    ), d(), l += a.move("]:"), r.children && r.children.length > 0 && (a.shift(4), l += a.move(
      (e ? `
` : " ") + o.indentLines(
        o.containerFlow(r, a.current()),
        e ? Np : uE
      )
    )), c(), l;
  }
}
function uE(t, e, n) {
  return e === 0 ? t : Np(t, e, n);
}
function Np(t, e, n) {
  return (n ? "" : "    ") + t;
}
const dE = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];
Dp.peek = gE;
function hE() {
  return {
    canContainEols: ["delete"],
    enter: { strikethrough: mE },
    exit: { strikethrough: fE }
  };
}
function pE() {
  return {
    unsafe: [
      {
        character: "~",
        inConstruct: "phrasing",
        notInConstruct: dE
      }
    ],
    handlers: { delete: Dp }
  };
}
function mE(t) {
  this.enter({ type: "delete", children: [] }, t);
}
function fE(t) {
  this.exit(t);
}
function Dp(t, e, n, r) {
  const i = n.createTracker(r), o = n.enter("strikethrough");
  let s = i.move("~~");
  return s += n.containerPhrasing(t, {
    ...i.current(),
    before: s,
    after: "~"
  }), s += i.move("~~"), o(), s;
}
function gE() {
  return "~";
}
function bE(t) {
  return t.length;
}
function vE(t, e) {
  const n = e || {}, r = (n.align || []).concat(), i = n.stringLength || bE, o = [], s = [], a = [], l = [];
  let c = 0, d = -1;
  for (; ++d < t.length; ) {
    const g = [], w = [];
    let b = -1;
    for (t[d].length > c && (c = t[d].length); ++b < t[d].length; ) {
      const k = wE(t[d][b]);
      if (n.alignDelimiters !== !1) {
        const x = i(k);
        w[b] = x, (l[b] === void 0 || x > l[b]) && (l[b] = x);
      }
      g.push(k);
    }
    s[d] = g, a[d] = w;
  }
  let u = -1;
  if (typeof r == "object" && "length" in r)
    for (; ++u < c; )
      o[u] = Gl(r[u]);
  else {
    const g = Gl(r);
    for (; ++u < c; )
      o[u] = g;
  }
  u = -1;
  const h = [], p = [];
  for (; ++u < c; ) {
    const g = o[u];
    let w = "", b = "";
    g === 99 ? (w = ":", b = ":") : g === 108 ? w = ":" : g === 114 && (b = ":");
    let k = n.alignDelimiters === !1 ? 1 : Math.max(
      1,
      l[u] - w.length - b.length
    );
    const x = w + "-".repeat(k) + b;
    n.alignDelimiters !== !1 && (k = w.length + k + b.length, k > l[u] && (l[u] = k), p[u] = k), h[u] = x;
  }
  s.splice(1, 0, h), a.splice(1, 0, p), d = -1;
  const m = [];
  for (; ++d < s.length; ) {
    const g = s[d], w = a[d];
    u = -1;
    const b = [];
    for (; ++u < c; ) {
      const k = g[u] || "";
      let x = "", T = "";
      if (n.alignDelimiters !== !1) {
        const I = l[u] - (w[u] || 0), y = o[u];
        y === 114 ? x = " ".repeat(I) : y === 99 ? I % 2 ? (x = " ".repeat(I / 2 + 0.5), T = " ".repeat(I / 2 - 0.5)) : (x = " ".repeat(I / 2), T = x) : T = " ".repeat(I);
      }
      n.delimiterStart !== !1 && !u && b.push("|"), n.padding !== !1 && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(n.alignDelimiters === !1 && k === "") && (n.delimiterStart !== !1 || u) && b.push(" "), n.alignDelimiters !== !1 && b.push(x), b.push(k), n.alignDelimiters !== !1 && b.push(T), n.padding !== !1 && b.push(" "), (n.delimiterEnd !== !1 || u !== c - 1) && b.push("|");
    }
    m.push(
      n.delimiterEnd === !1 ? b.join("").replace(/ +$/, "") : b.join("")
    );
  }
  return m.join(`
`);
}
function wE(t) {
  return t == null ? "" : String(t);
}
function Gl(t) {
  const e = typeof t == "string" ? t.codePointAt(0) : 0;
  return e === 67 || e === 99 ? 99 : e === 76 || e === 108 ? 108 : e === 82 || e === 114 ? 114 : 0;
}
function yE(t, e, n, r) {
  const i = n.enter("blockquote"), o = n.createTracker(r);
  o.move("> "), o.shift(2);
  const s = n.indentLines(
    n.containerFlow(t, o.current()),
    xE
  );
  return i(), s;
}
function xE(t, e, n) {
  return ">" + (n ? "" : " ") + t;
}
function kE(t, e) {
  return Kl(t, e.inConstruct, !0) && !Kl(t, e.notInConstruct, !1);
}
function Kl(t, e, n) {
  if (typeof e == "string" && (e = [e]), !e || e.length === 0)
    return n;
  let r = -1;
  for (; ++r < e.length; )
    if (t.includes(e[r]))
      return !0;
  return !1;
}
function Jl(t, e, n, r) {
  let i = -1;
  for (; ++i < n.unsafe.length; )
    if (n.unsafe[i].character === `
` && kE(n.stack, n.unsafe[i]))
      return /[ \t]/.test(r.before) ? "" : " ";
  return `\\
`;
}
function _E(t, e) {
  const n = String(t);
  let r = n.indexOf(e), i = r, o = 0, s = 0;
  if (typeof e != "string")
    throw new TypeError("Expected substring");
  for (; r !== -1; )
    r === i ? ++o > s && (s = o) : o = 1, i = r + e.length, r = n.indexOf(e, i);
  return s;
}
function SE(t, e) {
  return !!(e.options.fences === !1 && t.value && // If there’s no info…
  !t.lang && // And there’s a non-whitespace character…
  /[^ \r\n]/.test(t.value) && // And the value doesn’t start or end in a blank…
  !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(t.value));
}
function CE(t) {
  const e = t.options.fence || "`";
  if (e !== "`" && e !== "~")
    throw new Error(
      "Cannot serialize code with `" + e + "` for `options.fence`, expected `` ` `` or `~`"
    );
  return e;
}
function TE(t, e, n, r) {
  const i = CE(n), o = t.value || "", s = i === "`" ? "GraveAccent" : "Tilde";
  if (SE(t, n)) {
    const u = n.enter("codeIndented"), h = n.indentLines(o, IE);
    return u(), h;
  }
  const a = n.createTracker(r), l = i.repeat(Math.max(_E(o, i) + 1, 3)), c = n.enter("codeFenced");
  let d = a.move(l);
  if (t.lang) {
    const u = n.enter(`codeFencedLang${s}`);
    d += a.move(
      n.safe(t.lang, {
        before: d,
        after: " ",
        encode: ["`"],
        ...a.current()
      })
    ), u();
  }
  if (t.lang && t.meta) {
    const u = n.enter(`codeFencedMeta${s}`);
    d += a.move(" "), d += a.move(
      n.safe(t.meta, {
        before: d,
        after: `
`,
        encode: ["`"],
        ...a.current()
      })
    ), u();
  }
  return d += a.move(`
`), o && (d += a.move(o + `
`)), d += a.move(l), c(), d;
}
function IE(t, e, n) {
  return (n ? "" : "    ") + t;
}
function Cs(t) {
  const e = t.options.quote || '"';
  if (e !== '"' && e !== "'")
    throw new Error(
      "Cannot serialize title with `" + e + "` for `options.quote`, expected `\"`, or `'`"
    );
  return e;
}
function AE(t, e, n, r) {
  const i = Cs(n), o = i === '"' ? "Quote" : "Apostrophe", s = n.enter("definition");
  let a = n.enter("label");
  const l = n.createTracker(r);
  let c = l.move("[");
  return c += l.move(
    n.safe(n.associationId(t), {
      before: c,
      after: "]",
      ...l.current()
    })
  ), c += l.move("]: "), a(), // If there’s no url, or…
  !t.url || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(t.url) ? (a = n.enter("destinationLiteral"), c += l.move("<"), c += l.move(
    n.safe(t.url, { before: c, after: ">", ...l.current() })
  ), c += l.move(">")) : (a = n.enter("destinationRaw"), c += l.move(
    n.safe(t.url, {
      before: c,
      after: t.title ? " " : `
`,
      ...l.current()
    })
  )), a(), t.title && (a = n.enter(`title${o}`), c += l.move(" " + i), c += l.move(
    n.safe(t.title, {
      before: c,
      after: i,
      ...l.current()
    })
  ), c += l.move(i), a()), s(), c;
}
function EE(t) {
  const e = t.options.emphasis || "*";
  if (e !== "*" && e !== "_")
    throw new Error(
      "Cannot serialize emphasis with `" + e + "` for `options.emphasis`, expected `*`, or `_`"
    );
  return e;
}
function Yn(t) {
  return "&#x" + t.toString(16).toUpperCase() + ";";
}
function qr(t, e, n) {
  const r = kn(t), i = kn(e);
  return r === void 0 ? i === void 0 ? (
    // Letter inside:
    // we have to encode *both* letters for `_` as it is looser.
    // it already forms for `*` (and GFMs `~`).
    n === "_" ? { inside: !0, outside: !0 } : { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode both (letter, whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: encode outer (letter)
    { inside: !1, outside: !0 }
  ) : r === 1 ? i === void 0 ? (
    // Letter inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode both (whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === void 0 ? (
    // Letter inside: already forms.
    { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode inner (whitespace).
    { inside: !0, outside: !1 }
  ) : (
    // Punctuation inside: already forms.
    { inside: !1, outside: !1 }
  );
}
Lp.peek = RE;
function Lp(t, e, n, r) {
  const i = EE(n), o = n.enter("emphasis"), s = n.createTracker(r), a = s.move(i);
  let l = s.move(
    n.containerPhrasing(t, {
      after: i,
      before: a,
      ...s.current()
    })
  );
  const c = l.charCodeAt(0), d = qr(
    r.before.charCodeAt(r.before.length - 1),
    c,
    i
  );
  d.inside && (l = Yn(c) + l.slice(1));
  const u = l.charCodeAt(l.length - 1), h = qr(r.after.charCodeAt(0), u, i);
  h.inside && (l = l.slice(0, -1) + Yn(u));
  const p = s.move(i);
  return o(), n.attentionEncodeSurroundingInfo = {
    after: h.outside,
    before: d.outside
  }, a + l + p;
}
function RE(t, e, n) {
  return n.options.emphasis || "*";
}
function ME(t, e) {
  let n = !1;
  return _s(t, function(r) {
    if ("value" in r && /\r?\n|\r/.test(r.value) || r.type === "break")
      return n = !0, mo;
  }), !!((!t.depth || t.depth < 3) && gs(t) && (e.options.setext || n));
}
function PE(t, e, n, r) {
  const i = Math.max(Math.min(6, t.depth || 1), 1), o = n.createTracker(r);
  if (ME(t, n)) {
    const d = n.enter("headingSetext"), u = n.enter("phrasing"), h = n.containerPhrasing(t, {
      ...o.current(),
      before: `
`,
      after: `
`
    });
    return u(), d(), h + `
` + (i === 1 ? "=" : "-").repeat(
      // The whole size…
      h.length - // Minus the position of the character after the last EOL (or
      // 0 if there is none)…
      (Math.max(h.lastIndexOf("\r"), h.lastIndexOf(`
`)) + 1)
    );
  }
  const s = "#".repeat(i), a = n.enter("headingAtx"), l = n.enter("phrasing");
  o.move(s + " ");
  let c = n.containerPhrasing(t, {
    before: "# ",
    after: `
`,
    ...o.current()
  });
  return /^[\t ]/.test(c) && (c = Yn(c.charCodeAt(0)) + c.slice(1)), c = c ? s + " " + c : s, n.options.closeAtx && (c += " " + s), l(), a(), c;
}
zp.peek = NE;
function zp(t) {
  return t.value || "";
}
function NE() {
  return "<";
}
Op.peek = DE;
function Op(t, e, n, r) {
  const i = Cs(n), o = i === '"' ? "Quote" : "Apostrophe", s = n.enter("image");
  let a = n.enter("label");
  const l = n.createTracker(r);
  let c = l.move("![");
  return c += l.move(
    n.safe(t.alt, { before: c, after: "]", ...l.current() })
  ), c += l.move("]("), a(), // If there’s no url but there is a title…
  !t.url && t.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(t.url) ? (a = n.enter("destinationLiteral"), c += l.move("<"), c += l.move(
    n.safe(t.url, { before: c, after: ">", ...l.current() })
  ), c += l.move(">")) : (a = n.enter("destinationRaw"), c += l.move(
    n.safe(t.url, {
      before: c,
      after: t.title ? " " : ")",
      ...l.current()
    })
  )), a(), t.title && (a = n.enter(`title${o}`), c += l.move(" " + i), c += l.move(
    n.safe(t.title, {
      before: c,
      after: i,
      ...l.current()
    })
  ), c += l.move(i), a()), c += l.move(")"), s(), c;
}
function DE() {
  return "!";
}
$p.peek = LE;
function $p(t, e, n, r) {
  const i = t.referenceType, o = n.enter("imageReference");
  let s = n.enter("label");
  const a = n.createTracker(r);
  let l = a.move("![");
  const c = n.safe(t.alt, {
    before: l,
    after: "]",
    ...a.current()
  });
  l += a.move(c + "]["), s();
  const d = n.stack;
  n.stack = [], s = n.enter("reference");
  const u = n.safe(n.associationId(t), {
    before: l,
    after: "]",
    ...a.current()
  });
  return s(), n.stack = d, o(), i === "full" || !c || c !== u ? l += a.move(u + "]") : i === "shortcut" ? l = l.slice(0, -1) : l += a.move("]"), l;
}
function LE() {
  return "!";
}
Fp.peek = zE;
function Fp(t, e, n) {
  let r = t.value || "", i = "`", o = -1;
  for (; new RegExp("(^|[^`])" + i + "([^`]|$)").test(r); )
    i += "`";
  for (/[^ \r\n]/.test(r) && (/^[ \r\n]/.test(r) && /[ \r\n]$/.test(r) || /^`|`$/.test(r)) && (r = " " + r + " "); ++o < n.unsafe.length; ) {
    const s = n.unsafe[o], a = n.compilePattern(s);
    let l;
    if (s.atBreak)
      for (; l = a.exec(r); ) {
        let c = l.index;
        r.charCodeAt(c) === 10 && r.charCodeAt(c - 1) === 13 && c--, r = r.slice(0, c) + " " + r.slice(l.index + 1);
      }
  }
  return i + r + i;
}
function zE() {
  return "`";
}
function Bp(t, e) {
  const n = gs(t);
  return !!(!e.options.resourceLink && // If there’s a url…
  t.url && // And there’s a no title…
  !t.title && // And the content of `node` is a single text node…
  t.children && t.children.length === 1 && t.children[0].type === "text" && // And if the url is the same as the content…
  (n === t.url || "mailto:" + n === t.url) && // And that starts w/ a protocol…
  /^[a-z][a-z+.-]+:/i.test(t.url) && // And that doesn’t contain ASCII control codes (character escapes and
  // references don’t work), space, or angle brackets…
  !/[\0- <>\u007F]/.test(t.url));
}
Up.peek = OE;
function Up(t, e, n, r) {
  const i = Cs(n), o = i === '"' ? "Quote" : "Apostrophe", s = n.createTracker(r);
  let a, l;
  if (Bp(t, n)) {
    const d = n.stack;
    n.stack = [], a = n.enter("autolink");
    let u = s.move("<");
    return u += s.move(
      n.containerPhrasing(t, {
        before: u,
        after: ">",
        ...s.current()
      })
    ), u += s.move(">"), a(), n.stack = d, u;
  }
  a = n.enter("link"), l = n.enter("label");
  let c = s.move("[");
  return c += s.move(
    n.containerPhrasing(t, {
      before: c,
      after: "](",
      ...s.current()
    })
  ), c += s.move("]("), l(), // If there’s no url but there is a title…
  !t.url && t.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(t.url) ? (l = n.enter("destinationLiteral"), c += s.move("<"), c += s.move(
    n.safe(t.url, { before: c, after: ">", ...s.current() })
  ), c += s.move(">")) : (l = n.enter("destinationRaw"), c += s.move(
    n.safe(t.url, {
      before: c,
      after: t.title ? " " : ")",
      ...s.current()
    })
  )), l(), t.title && (l = n.enter(`title${o}`), c += s.move(" " + i), c += s.move(
    n.safe(t.title, {
      before: c,
      after: i,
      ...s.current()
    })
  ), c += s.move(i), l()), c += s.move(")"), a(), c;
}
function OE(t, e, n) {
  return Bp(t, n) ? "<" : "[";
}
jp.peek = $E;
function jp(t, e, n, r) {
  const i = t.referenceType, o = n.enter("linkReference");
  let s = n.enter("label");
  const a = n.createTracker(r);
  let l = a.move("[");
  const c = n.containerPhrasing(t, {
    before: l,
    after: "]",
    ...a.current()
  });
  l += a.move(c + "]["), s();
  const d = n.stack;
  n.stack = [], s = n.enter("reference");
  const u = n.safe(n.associationId(t), {
    before: l,
    after: "]",
    ...a.current()
  });
  return s(), n.stack = d, o(), i === "full" || !c || c !== u ? l += a.move(u + "]") : i === "shortcut" ? l = l.slice(0, -1) : l += a.move("]"), l;
}
function $E() {
  return "[";
}
function Ts(t) {
  const e = t.options.bullet || "*";
  if (e !== "*" && e !== "+" && e !== "-")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.bullet`, expected `*`, `+`, or `-`"
    );
  return e;
}
function FE(t) {
  const e = Ts(t), n = t.options.bulletOther;
  if (!n)
    return e === "*" ? "-" : "*";
  if (n !== "*" && n !== "+" && n !== "-")
    throw new Error(
      "Cannot serialize items with `" + n + "` for `options.bulletOther`, expected `*`, `+`, or `-`"
    );
  if (n === e)
    throw new Error(
      "Expected `bullet` (`" + e + "`) and `bulletOther` (`" + n + "`) to be different"
    );
  return n;
}
function BE(t) {
  const e = t.options.bulletOrdered || ".";
  if (e !== "." && e !== ")")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.bulletOrdered`, expected `.` or `)`"
    );
  return e;
}
function Vp(t) {
  const e = t.options.rule || "*";
  if (e !== "*" && e !== "-" && e !== "_")
    throw new Error(
      "Cannot serialize rules with `" + e + "` for `options.rule`, expected `*`, `-`, or `_`"
    );
  return e;
}
function UE(t, e, n, r) {
  const i = n.enter("list"), o = n.bulletCurrent;
  let s = t.ordered ? BE(n) : Ts(n);
  const a = t.ordered ? s === "." ? ")" : "." : FE(n);
  let l = e && n.bulletLastUsed ? s === n.bulletLastUsed : !1;
  if (!t.ordered) {
    const d = t.children ? t.children[0] : void 0;
    if (
      // Bullet could be used as a thematic break marker:
      (s === "*" || s === "-") && // Empty first list item:
      d && (!d.children || !d.children[0]) && // Directly in two other list items:
      n.stack[n.stack.length - 1] === "list" && n.stack[n.stack.length - 2] === "listItem" && n.stack[n.stack.length - 3] === "list" && n.stack[n.stack.length - 4] === "listItem" && // That are each the first child.
      n.indexStack[n.indexStack.length - 1] === 0 && n.indexStack[n.indexStack.length - 2] === 0 && n.indexStack[n.indexStack.length - 3] === 0 && (l = !0), Vp(n) === s && d
    ) {
      let u = -1;
      for (; ++u < t.children.length; ) {
        const h = t.children[u];
        if (h && h.type === "listItem" && h.children && h.children[0] && h.children[0].type === "thematicBreak") {
          l = !0;
          break;
        }
      }
    }
  }
  l && (s = a), n.bulletCurrent = s;
  const c = n.containerFlow(t, r);
  return n.bulletLastUsed = s, n.bulletCurrent = o, i(), c;
}
function jE(t) {
  const e = t.options.listItemIndent || "one";
  if (e !== "tab" && e !== "one" && e !== "mixed")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
    );
  return e;
}
function VE(t, e, n, r) {
  const i = jE(n);
  let o = n.bulletCurrent || Ts(n);
  e && e.type === "list" && e.ordered && (o = (typeof e.start == "number" && e.start > -1 ? e.start : 1) + (n.options.incrementListMarker === !1 ? 0 : e.children.indexOf(t)) + o);
  let s = o.length + 1;
  (i === "tab" || i === "mixed" && (e && e.type === "list" && e.spread || t.spread)) && (s = Math.ceil(s / 4) * 4);
  const a = n.createTracker(r);
  a.move(o + " ".repeat(s - o.length)), a.shift(s);
  const l = n.enter("listItem"), c = n.indentLines(
    n.containerFlow(t, a.current()),
    d
  );
  return l(), c;
  function d(u, h, p) {
    return h ? (p ? "" : " ".repeat(s)) + u : (p ? o : o + " ".repeat(s - o.length)) + u;
  }
}
function qE(t, e, n, r) {
  const i = n.enter("paragraph"), o = n.enter("phrasing"), s = n.containerPhrasing(t, r);
  return o(), i(), s;
}
const HE = (
  /** @type {(node?: unknown) => node is Exclude<PhrasingContent, Html>} */
  li([
    "break",
    "delete",
    "emphasis",
    // To do: next major: removed since footnotes were added to GFM.
    "footnote",
    "footnoteReference",
    "image",
    "imageReference",
    "inlineCode",
    // Enabled by `mdast-util-math`:
    "inlineMath",
    "link",
    "linkReference",
    // Enabled by `mdast-util-mdx`:
    "mdxJsxTextElement",
    // Enabled by `mdast-util-mdx`:
    "mdxTextExpression",
    "strong",
    "text",
    // Enabled by `mdast-util-directive`:
    "textDirective"
  ])
);
function WE(t, e, n, r) {
  return (t.children.some(function(s) {
    return HE(s);
  }) ? n.containerPhrasing : n.containerFlow).call(n, t, r);
}
function GE(t) {
  const e = t.options.strong || "*";
  if (e !== "*" && e !== "_")
    throw new Error(
      "Cannot serialize strong with `" + e + "` for `options.strong`, expected `*`, or `_`"
    );
  return e;
}
qp.peek = KE;
function qp(t, e, n, r) {
  const i = GE(n), o = n.enter("strong"), s = n.createTracker(r), a = s.move(i + i);
  let l = s.move(
    n.containerPhrasing(t, {
      after: i,
      before: a,
      ...s.current()
    })
  );
  const c = l.charCodeAt(0), d = qr(
    r.before.charCodeAt(r.before.length - 1),
    c,
    i
  );
  d.inside && (l = Yn(c) + l.slice(1));
  const u = l.charCodeAt(l.length - 1), h = qr(r.after.charCodeAt(0), u, i);
  h.inside && (l = l.slice(0, -1) + Yn(u));
  const p = s.move(i + i);
  return o(), n.attentionEncodeSurroundingInfo = {
    after: h.outside,
    before: d.outside
  }, a + l + p;
}
function KE(t, e, n) {
  return n.options.strong || "*";
}
function JE(t, e, n, r) {
  return n.safe(t.value, r);
}
function QE(t) {
  const e = t.options.ruleRepetition || 3;
  if (e < 3)
    throw new Error(
      "Cannot serialize rules with repetition `" + e + "` for `options.ruleRepetition`, expected `3` or more"
    );
  return e;
}
function YE(t, e, n) {
  const r = (Vp(n) + (n.options.ruleSpaces ? " " : "")).repeat(QE(n));
  return n.options.ruleSpaces ? r.slice(0, -1) : r;
}
const Hp = {
  blockquote: yE,
  break: Jl,
  code: TE,
  definition: AE,
  emphasis: Lp,
  hardBreak: Jl,
  heading: PE,
  html: zp,
  image: Op,
  imageReference: $p,
  inlineCode: Fp,
  link: Up,
  linkReference: jp,
  list: UE,
  listItem: VE,
  paragraph: qE,
  root: WE,
  strong: qp,
  text: JE,
  thematicBreak: YE
};
function XE() {
  return {
    enter: {
      table: ZE,
      tableData: Ql,
      tableHeader: Ql,
      tableRow: tR
    },
    exit: {
      codeText: nR,
      table: eR,
      tableData: Bi,
      tableHeader: Bi,
      tableRow: Bi
    }
  };
}
function ZE(t) {
  const e = t._align;
  this.enter(
    {
      type: "table",
      align: e.map(function(n) {
        return n === "none" ? null : n;
      }),
      children: []
    },
    t
  ), this.data.inTable = !0;
}
function eR(t) {
  this.exit(t), this.data.inTable = void 0;
}
function tR(t) {
  this.enter({ type: "tableRow", children: [] }, t);
}
function Bi(t) {
  this.exit(t);
}
function Ql(t) {
  this.enter({ type: "tableCell", children: [] }, t);
}
function nR(t) {
  let e = this.resume();
  this.data.inTable && (e = e.replace(/\\([\\|])/g, rR));
  const n = this.stack[this.stack.length - 1];
  n.type, n.value = e, this.exit(t);
}
function rR(t, e) {
  return e === "|" ? e : t;
}
function iR(t) {
  const e = t || {}, n = e.tableCellPadding, r = e.tablePipeAlign, i = e.stringLength, o = n ? " " : "|";
  return {
    unsafe: [
      { character: "\r", inConstruct: "tableCell" },
      { character: `
`, inConstruct: "tableCell" },
      // A pipe, when followed by a tab or space (padding), or a dash or colon
      // (unpadded delimiter row), could result in a table.
      { atBreak: !0, character: "|", after: "[	 :-]" },
      // A pipe in a cell must be encoded.
      { character: "|", inConstruct: "tableCell" },
      // A colon must be followed by a dash, in which case it could start a
      // delimiter row.
      { atBreak: !0, character: ":", after: "-" },
      // A delimiter row can also start with a dash, when followed by more
      // dashes, a colon, or a pipe.
      // This is a stricter version than the built in check for lists, thematic
      // breaks, and setex heading underlines though:
      // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/51a2038/lib/unsafe.js#L57>
      { atBreak: !0, character: "-", after: "[:|-]" }
    ],
    handlers: {
      inlineCode: h,
      table: s,
      tableCell: l,
      tableRow: a
    }
  };
  function s(p, m, g, w) {
    return c(d(p, g, w), p.align);
  }
  function a(p, m, g, w) {
    const b = u(p, g, w), k = c([b]);
    return k.slice(0, k.indexOf(`
`));
  }
  function l(p, m, g, w) {
    const b = g.enter("tableCell"), k = g.enter("phrasing"), x = g.containerPhrasing(p, {
      ...w,
      before: o,
      after: o
    });
    return k(), b(), x;
  }
  function c(p, m) {
    return vE(p, {
      align: m,
      // @ts-expect-error: `markdown-table` types should support `null`.
      alignDelimiters: r,
      // @ts-expect-error: `markdown-table` types should support `null`.
      padding: n,
      // @ts-expect-error: `markdown-table` types should support `null`.
      stringLength: i
    });
  }
  function d(p, m, g) {
    const w = p.children;
    let b = -1;
    const k = [], x = m.enter("table");
    for (; ++b < w.length; )
      k[b] = u(w[b], m, g);
    return x(), k;
  }
  function u(p, m, g) {
    const w = p.children;
    let b = -1;
    const k = [], x = m.enter("tableRow");
    for (; ++b < w.length; )
      k[b] = l(w[b], p, m, g);
    return x(), k;
  }
  function h(p, m, g) {
    let w = Hp.inlineCode(p, m, g);
    return g.stack.includes("tableCell") && (w = w.replace(/\|/g, "\\$&")), w;
  }
}
function oR() {
  return {
    exit: {
      taskListCheckValueChecked: Yl,
      taskListCheckValueUnchecked: Yl,
      paragraph: aR
    }
  };
}
function sR() {
  return {
    unsafe: [{ atBreak: !0, character: "-", after: "[:|-]" }],
    handlers: { listItem: lR }
  };
}
function Yl(t) {
  const e = this.stack[this.stack.length - 2];
  e.type, e.checked = t.type === "taskListCheckValueChecked";
}
function aR(t) {
  const e = this.stack[this.stack.length - 2];
  if (e && e.type === "listItem" && typeof e.checked == "boolean") {
    const n = this.stack[this.stack.length - 1];
    n.type;
    const r = n.children[0];
    if (r && r.type === "text") {
      const i = e.children;
      let o = -1, s;
      for (; ++o < i.length; ) {
        const a = i[o];
        if (a.type === "paragraph") {
          s = a;
          break;
        }
      }
      s === n && (r.value = r.value.slice(1), r.value.length === 0 ? n.children.shift() : n.position && r.position && typeof r.position.start.offset == "number" && (r.position.start.column++, r.position.start.offset++, n.position.start = Object.assign({}, r.position.start)));
    }
  }
  this.exit(t);
}
function lR(t, e, n, r) {
  const i = t.children[0], o = typeof t.checked == "boolean" && i && i.type === "paragraph", s = "[" + (t.checked ? "x" : " ") + "] ", a = n.createTracker(r);
  o && a.move(s);
  let l = Hp.listItem(t, e, n, {
    ...r,
    ...a.current()
  });
  return o && (l = l.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, c)), l;
  function c(d) {
    return d + s;
  }
}
function cR() {
  return [
    UA(),
    lE(),
    hE(),
    XE(),
    oR()
  ];
}
function uR(t) {
  return {
    extensions: [
      jA(),
      cE(t),
      pE(),
      iR(t),
      sR()
    ]
  };
}
const dR = {
  tokenize: bR,
  partial: !0
}, Wp = {
  tokenize: vR,
  partial: !0
}, Gp = {
  tokenize: wR,
  partial: !0
}, Kp = {
  tokenize: yR,
  partial: !0
}, hR = {
  tokenize: xR,
  partial: !0
}, Jp = {
  name: "wwwAutolink",
  tokenize: fR,
  previous: Yp
}, Qp = {
  name: "protocolAutolink",
  tokenize: gR,
  previous: Xp
}, yt = {
  name: "emailAutolink",
  tokenize: mR,
  previous: Zp
}, mt = {};
function pR() {
  return {
    text: mt
  };
}
let $t = 48;
for (; $t < 123; )
  mt[$t] = yt, $t++, $t === 58 ? $t = 65 : $t === 91 && ($t = 97);
mt[43] = yt;
mt[45] = yt;
mt[46] = yt;
mt[95] = yt;
mt[72] = [yt, Qp];
mt[104] = [yt, Qp];
mt[87] = [yt, Jp];
mt[119] = [yt, Jp];
function mR(t, e, n) {
  const r = this;
  let i, o;
  return s;
  function s(u) {
    return !vo(u) || !Zp.call(r, r.previous) || Is(r.events) ? n(u) : (t.enter("literalAutolink"), t.enter("literalAutolinkEmail"), a(u));
  }
  function a(u) {
    return vo(u) ? (t.consume(u), a) : u === 64 ? (t.consume(u), l) : n(u);
  }
  function l(u) {
    return u === 46 ? t.check(hR, d, c)(u) : u === 45 || u === 95 || Re(u) ? (o = !0, t.consume(u), l) : d(u);
  }
  function c(u) {
    return t.consume(u), i = !0, l;
  }
  function d(u) {
    return o && i && Ne(r.previous) ? (t.exit("literalAutolinkEmail"), t.exit("literalAutolink"), e(u)) : n(u);
  }
}
function fR(t, e, n) {
  const r = this;
  return i;
  function i(s) {
    return s !== 87 && s !== 119 || !Yp.call(r, r.previous) || Is(r.events) ? n(s) : (t.enter("literalAutolink"), t.enter("literalAutolinkWww"), t.check(dR, t.attempt(Wp, t.attempt(Gp, o), n), n)(s));
  }
  function o(s) {
    return t.exit("literalAutolinkWww"), t.exit("literalAutolink"), e(s);
  }
}
function gR(t, e, n) {
  const r = this;
  let i = "", o = !1;
  return s;
  function s(u) {
    return (u === 72 || u === 104) && Xp.call(r, r.previous) && !Is(r.events) ? (t.enter("literalAutolink"), t.enter("literalAutolinkHttp"), i += String.fromCodePoint(u), t.consume(u), a) : n(u);
  }
  function a(u) {
    if (Ne(u) && i.length < 5)
      return i += String.fromCodePoint(u), t.consume(u), a;
    if (u === 58) {
      const h = i.toLowerCase();
      if (h === "http" || h === "https")
        return t.consume(u), l;
    }
    return n(u);
  }
  function l(u) {
    return u === 47 ? (t.consume(u), o ? c : (o = !0, l)) : n(u);
  }
  function c(u) {
    return u === null || Ur(u) || ve(u) || Jt(u) || oi(u) ? n(u) : t.attempt(Wp, t.attempt(Gp, d), n)(u);
  }
  function d(u) {
    return t.exit("literalAutolinkHttp"), t.exit("literalAutolink"), e(u);
  }
}
function bR(t, e, n) {
  let r = 0;
  return i;
  function i(s) {
    return (s === 87 || s === 119) && r < 3 ? (r++, t.consume(s), i) : s === 46 && r === 3 ? (t.consume(s), o) : n(s);
  }
  function o(s) {
    return s === null ? n(s) : e(s);
  }
}
function vR(t, e, n) {
  let r, i, o;
  return s;
  function s(c) {
    return c === 46 || c === 95 ? t.check(Kp, l, a)(c) : c === null || ve(c) || Jt(c) || c !== 45 && oi(c) ? l(c) : (o = !0, t.consume(c), s);
  }
  function a(c) {
    return c === 95 ? r = !0 : (i = r, r = void 0), t.consume(c), s;
  }
  function l(c) {
    return i || r || !o ? n(c) : e(c);
  }
}
function wR(t, e) {
  let n = 0, r = 0;
  return i;
  function i(s) {
    return s === 40 ? (n++, t.consume(s), i) : s === 41 && r < n ? o(s) : s === 33 || s === 34 || s === 38 || s === 39 || s === 41 || s === 42 || s === 44 || s === 46 || s === 58 || s === 59 || s === 60 || s === 63 || s === 93 || s === 95 || s === 126 ? t.check(Kp, e, o)(s) : s === null || ve(s) || Jt(s) ? e(s) : (t.consume(s), i);
  }
  function o(s) {
    return s === 41 && r++, t.consume(s), i;
  }
}
function yR(t, e, n) {
  return r;
  function r(a) {
    return a === 33 || a === 34 || a === 39 || a === 41 || a === 42 || a === 44 || a === 46 || a === 58 || a === 59 || a === 63 || a === 95 || a === 126 ? (t.consume(a), r) : a === 38 ? (t.consume(a), o) : a === 93 ? (t.consume(a), i) : (
      // `<` is an end.
      a === 60 || // So is whitespace.
      a === null || ve(a) || Jt(a) ? e(a) : n(a)
    );
  }
  function i(a) {
    return a === null || a === 40 || a === 91 || ve(a) || Jt(a) ? e(a) : r(a);
  }
  function o(a) {
    return Ne(a) ? s(a) : n(a);
  }
  function s(a) {
    return a === 59 ? (t.consume(a), r) : Ne(a) ? (t.consume(a), s) : n(a);
  }
}
function xR(t, e, n) {
  return r;
  function r(o) {
    return t.consume(o), i;
  }
  function i(o) {
    return Re(o) ? n(o) : e(o);
  }
}
function Yp(t) {
  return t === null || t === 40 || t === 42 || t === 95 || t === 91 || t === 93 || t === 126 || ve(t);
}
function Xp(t) {
  return !Ne(t);
}
function Zp(t) {
  return !(t === 47 || vo(t));
}
function vo(t) {
  return t === 43 || t === 45 || t === 46 || t === 95 || Re(t);
}
function Is(t) {
  let e = t.length, n = !1;
  for (; e--; ) {
    const r = t[e][1];
    if ((r.type === "labelLink" || r.type === "labelImage") && !r._balanced) {
      n = !0;
      break;
    }
    if (r._gfmAutolinkLiteralWalkedInto) {
      n = !1;
      break;
    }
  }
  return t.length > 0 && !n && (t[t.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), n;
}
const kR = {
  tokenize: RR,
  partial: !0
};
function _R() {
  return {
    document: {
      91: {
        name: "gfmFootnoteDefinition",
        tokenize: IR,
        continuation: {
          tokenize: AR
        },
        exit: ER
      }
    },
    text: {
      91: {
        name: "gfmFootnoteCall",
        tokenize: TR
      },
      93: {
        name: "gfmPotentialFootnoteCall",
        add: "after",
        tokenize: SR,
        resolveTo: CR
      }
    }
  };
}
function SR(t, e, n) {
  const r = this;
  let i = r.events.length;
  const o = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let s;
  for (; i--; ) {
    const l = r.events[i][1];
    if (l.type === "labelImage") {
      s = l;
      break;
    }
    if (l.type === "gfmFootnoteCall" || l.type === "labelLink" || l.type === "label" || l.type === "image" || l.type === "link")
      break;
  }
  return a;
  function a(l) {
    if (!s || !s._balanced)
      return n(l);
    const c = rt(r.sliceSerialize({
      start: s.end,
      end: r.now()
    }));
    return c.codePointAt(0) !== 94 || !o.includes(c.slice(1)) ? n(l) : (t.enter("gfmFootnoteCallLabelMarker"), t.consume(l), t.exit("gfmFootnoteCallLabelMarker"), e(l));
  }
}
function CR(t, e) {
  let n = t.length;
  for (; n--; )
    if (t[n][1].type === "labelImage" && t[n][0] === "enter") {
      t[n][1];
      break;
    }
  t[n + 1][1].type = "data", t[n + 3][1].type = "gfmFootnoteCallLabelMarker";
  const r = {
    type: "gfmFootnoteCall",
    start: Object.assign({}, t[n + 3][1].start),
    end: Object.assign({}, t[t.length - 1][1].end)
  }, i = {
    type: "gfmFootnoteCallMarker",
    start: Object.assign({}, t[n + 3][1].end),
    end: Object.assign({}, t[n + 3][1].end)
  };
  i.end.column++, i.end.offset++, i.end._bufferIndex++;
  const o = {
    type: "gfmFootnoteCallString",
    start: Object.assign({}, i.end),
    end: Object.assign({}, t[t.length - 1][1].start)
  }, s = {
    type: "chunkString",
    contentType: "string",
    start: Object.assign({}, o.start),
    end: Object.assign({}, o.end)
  }, a = [
    // Take the `labelImageMarker` (now `data`, the `!`)
    t[n + 1],
    t[n + 2],
    ["enter", r, e],
    // The `[`
    t[n + 3],
    t[n + 4],
    // The `^`.
    ["enter", i, e],
    ["exit", i, e],
    // Everything in between.
    ["enter", o, e],
    ["enter", s, e],
    ["exit", s, e],
    ["exit", o, e],
    // The ending (`]`, properly parsed and labelled).
    t[t.length - 2],
    t[t.length - 1],
    ["exit", r, e]
  ];
  return t.splice(n, t.length - n + 1, ...a), t;
}
function TR(t, e, n) {
  const r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let o = 0, s;
  return a;
  function a(u) {
    return t.enter("gfmFootnoteCall"), t.enter("gfmFootnoteCallLabelMarker"), t.consume(u), t.exit("gfmFootnoteCallLabelMarker"), l;
  }
  function l(u) {
    return u !== 94 ? n(u) : (t.enter("gfmFootnoteCallMarker"), t.consume(u), t.exit("gfmFootnoteCallMarker"), t.enter("gfmFootnoteCallString"), t.enter("chunkString").contentType = "string", c);
  }
  function c(u) {
    if (
      // Too long.
      o > 999 || // Closing brace with nothing.
      u === 93 && !s || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      u === null || u === 91 || ve(u)
    )
      return n(u);
    if (u === 93) {
      t.exit("chunkString");
      const h = t.exit("gfmFootnoteCallString");
      return i.includes(rt(r.sliceSerialize(h))) ? (t.enter("gfmFootnoteCallLabelMarker"), t.consume(u), t.exit("gfmFootnoteCallLabelMarker"), t.exit("gfmFootnoteCall"), e) : n(u);
    }
    return ve(u) || (s = !0), o++, t.consume(u), u === 92 ? d : c;
  }
  function d(u) {
    return u === 91 || u === 92 || u === 93 ? (t.consume(u), o++, c) : c(u);
  }
}
function IR(t, e, n) {
  const r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []);
  let o, s = 0, a;
  return l;
  function l(m) {
    return t.enter("gfmFootnoteDefinition")._container = !0, t.enter("gfmFootnoteDefinitionLabel"), t.enter("gfmFootnoteDefinitionLabelMarker"), t.consume(m), t.exit("gfmFootnoteDefinitionLabelMarker"), c;
  }
  function c(m) {
    return m === 94 ? (t.enter("gfmFootnoteDefinitionMarker"), t.consume(m), t.exit("gfmFootnoteDefinitionMarker"), t.enter("gfmFootnoteDefinitionLabelString"), t.enter("chunkString").contentType = "string", d) : n(m);
  }
  function d(m) {
    if (
      // Too long.
      s > 999 || // Closing brace with nothing.
      m === 93 && !a || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      m === null || m === 91 || ve(m)
    )
      return n(m);
    if (m === 93) {
      t.exit("chunkString");
      const g = t.exit("gfmFootnoteDefinitionLabelString");
      return o = rt(r.sliceSerialize(g)), t.enter("gfmFootnoteDefinitionLabelMarker"), t.consume(m), t.exit("gfmFootnoteDefinitionLabelMarker"), t.exit("gfmFootnoteDefinitionLabel"), h;
    }
    return ve(m) || (a = !0), s++, t.consume(m), m === 92 ? u : d;
  }
  function u(m) {
    return m === 91 || m === 92 || m === 93 ? (t.consume(m), s++, d) : d(m);
  }
  function h(m) {
    return m === 58 ? (t.enter("definitionMarker"), t.consume(m), t.exit("definitionMarker"), i.includes(o) || i.push(o), le(t, p, "gfmFootnoteDefinitionWhitespace")) : n(m);
  }
  function p(m) {
    return e(m);
  }
}
function AR(t, e, n) {
  return t.check(ar, e, t.attempt(kR, e, n));
}
function ER(t) {
  t.exit("gfmFootnoteDefinition");
}
function RR(t, e, n) {
  const r = this;
  return le(t, i, "gfmFootnoteDefinitionIndent", 4 + 1);
  function i(o) {
    const s = r.events[r.events.length - 1];
    return s && s[1].type === "gfmFootnoteDefinitionIndent" && s[2].sliceSerialize(s[1], !0).length === 4 ? e(o) : n(o);
  }
}
function MR(t) {
  let n = (t || {}).singleTilde;
  const r = {
    name: "strikethrough",
    tokenize: o,
    resolveAll: i
  };
  return n == null && (n = !0), {
    text: {
      126: r
    },
    insideSpan: {
      null: [r]
    },
    attentionMarkers: {
      null: [126]
    }
  };
  function i(s, a) {
    let l = -1;
    for (; ++l < s.length; )
      if (s[l][0] === "enter" && s[l][1].type === "strikethroughSequenceTemporary" && s[l][1]._close) {
        let c = l;
        for (; c--; )
          if (s[c][0] === "exit" && s[c][1].type === "strikethroughSequenceTemporary" && s[c][1]._open && // If the sizes are the same:
          s[l][1].end.offset - s[l][1].start.offset === s[c][1].end.offset - s[c][1].start.offset) {
            s[l][1].type = "strikethroughSequence", s[c][1].type = "strikethroughSequence";
            const d = {
              type: "strikethrough",
              start: Object.assign({}, s[c][1].start),
              end: Object.assign({}, s[l][1].end)
            }, u = {
              type: "strikethroughText",
              start: Object.assign({}, s[c][1].end),
              end: Object.assign({}, s[l][1].start)
            }, h = [["enter", d, a], ["enter", s[c][1], a], ["exit", s[c][1], a], ["enter", u, a]], p = a.parser.constructs.insideSpan.null;
            p && Be(h, h.length, 0, si(p, s.slice(c + 1, l), a)), Be(h, h.length, 0, [["exit", u, a], ["enter", s[l][1], a], ["exit", s[l][1], a], ["exit", d, a]]), Be(s, c - 1, l - c + 3, h), l = c + h.length - 2;
            break;
          }
      }
    for (l = -1; ++l < s.length; )
      s[l][1].type === "strikethroughSequenceTemporary" && (s[l][1].type = "data");
    return s;
  }
  function o(s, a, l) {
    const c = this.previous, d = this.events;
    let u = 0;
    return h;
    function h(m) {
      return c === 126 && d[d.length - 1][1].type !== "characterEscape" ? l(m) : (s.enter("strikethroughSequenceTemporary"), p(m));
    }
    function p(m) {
      const g = kn(c);
      if (m === 126)
        return u > 1 ? l(m) : (s.consume(m), u++, p);
      if (u < 2 && !n)
        return l(m);
      const w = s.exit("strikethroughSequenceTemporary"), b = kn(m);
      return w._open = !b || b === 2 && !!g, w._close = !g || g === 2 && !!b, a(m);
    }
  }
}
class PR {
  /**
   * Create a new edit map.
   */
  constructor() {
    this.map = [];
  }
  /**
   * Create an edit: a remove and/or add at a certain place.
   *
   * @param {number} index
   * @param {number} remove
   * @param {Array<Event>} add
   * @returns {undefined}
   */
  add(e, n, r) {
    NR(this, e, n, r);
  }
  // To do: add this when moving to `micromark`.
  // /**
  //  * Create an edit: but insert `add` before existing additions.
  //  *
  //  * @param {number} index
  //  * @param {number} remove
  //  * @param {Array<Event>} add
  //  * @returns {undefined}
  //  */
  // addBefore(index, remove, add) {
  //   addImplementation(this, index, remove, add, true)
  // }
  /**
   * Done, change the events.
   *
   * @param {Array<Event>} events
   * @returns {undefined}
   */
  consume(e) {
    if (this.map.sort(function(o, s) {
      return o[0] - s[0];
    }), this.map.length === 0)
      return;
    let n = this.map.length;
    const r = [];
    for (; n > 0; )
      n -= 1, r.push(e.slice(this.map[n][0] + this.map[n][1]), this.map[n][2]), e.length = this.map[n][0];
    r.push(e.slice()), e.length = 0;
    let i = r.pop();
    for (; i; ) {
      for (const o of i)
        e.push(o);
      i = r.pop();
    }
    this.map.length = 0;
  }
}
function NR(t, e, n, r) {
  let i = 0;
  if (!(n === 0 && r.length === 0)) {
    for (; i < t.map.length; ) {
      if (t.map[i][0] === e) {
        t.map[i][1] += n, t.map[i][2].push(...r);
        return;
      }
      i += 1;
    }
    t.map.push([e, n, r]);
  }
}
function DR(t, e) {
  let n = !1;
  const r = [];
  for (; e < t.length; ) {
    const i = t[e];
    if (n) {
      if (i[0] === "enter")
        i[1].type === "tableContent" && r.push(t[e + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
      else if (i[1].type === "tableContent") {
        if (t[e - 1][1].type === "tableDelimiterMarker") {
          const o = r.length - 1;
          r[o] = r[o] === "left" ? "center" : "right";
        }
      } else if (i[1].type === "tableDelimiterRow")
        break;
    } else
      i[0] === "enter" && i[1].type === "tableDelimiterRow" && (n = !0);
    e += 1;
  }
  return r;
}
function LR() {
  return {
    flow: {
      null: {
        name: "table",
        tokenize: zR,
        resolveAll: OR
      }
    }
  };
}
function zR(t, e, n) {
  const r = this;
  let i = 0, o = 0, s;
  return a;
  function a(_) {
    let A = r.events.length - 1;
    for (; A > -1; ) {
      const O = r.events[A][1].type;
      if (O === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
      O === "linePrefix")
        A--;
      else
        break;
    }
    const P = A > -1 ? r.events[A][1].type : null, D = P === "tableHead" || P === "tableRow" ? y : l;
    return D === y && r.parser.lazy[r.now().line] ? n(_) : D(_);
  }
  function l(_) {
    return t.enter("tableHead"), t.enter("tableRow"), c(_);
  }
  function c(_) {
    return _ === 124 || (s = !0, o += 1), d(_);
  }
  function d(_) {
    return _ === null ? n(_) : X(_) ? o > 1 ? (o = 0, r.interrupt = !0, t.exit("tableRow"), t.enter("lineEnding"), t.consume(_), t.exit("lineEnding"), p) : n(_) : se(_) ? le(t, d, "whitespace")(_) : (o += 1, s && (s = !1, i += 1), _ === 124 ? (t.enter("tableCellDivider"), t.consume(_), t.exit("tableCellDivider"), s = !0, d) : (t.enter("data"), u(_)));
  }
  function u(_) {
    return _ === null || _ === 124 || ve(_) ? (t.exit("data"), d(_)) : (t.consume(_), _ === 92 ? h : u);
  }
  function h(_) {
    return _ === 92 || _ === 124 ? (t.consume(_), u) : u(_);
  }
  function p(_) {
    return r.interrupt = !1, r.parser.lazy[r.now().line] ? n(_) : (t.enter("tableDelimiterRow"), s = !1, se(_) ? le(t, m, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(_) : m(_));
  }
  function m(_) {
    return _ === 45 || _ === 58 ? w(_) : _ === 124 ? (s = !0, t.enter("tableCellDivider"), t.consume(_), t.exit("tableCellDivider"), g) : I(_);
  }
  function g(_) {
    return se(_) ? le(t, w, "whitespace")(_) : w(_);
  }
  function w(_) {
    return _ === 58 ? (o += 1, s = !0, t.enter("tableDelimiterMarker"), t.consume(_), t.exit("tableDelimiterMarker"), b) : _ === 45 ? (o += 1, b(_)) : _ === null || X(_) ? T(_) : I(_);
  }
  function b(_) {
    return _ === 45 ? (t.enter("tableDelimiterFiller"), k(_)) : I(_);
  }
  function k(_) {
    return _ === 45 ? (t.consume(_), k) : _ === 58 ? (s = !0, t.exit("tableDelimiterFiller"), t.enter("tableDelimiterMarker"), t.consume(_), t.exit("tableDelimiterMarker"), x) : (t.exit("tableDelimiterFiller"), x(_));
  }
  function x(_) {
    return se(_) ? le(t, T, "whitespace")(_) : T(_);
  }
  function T(_) {
    return _ === 124 ? m(_) : _ === null || X(_) ? !s || i !== o ? I(_) : (t.exit("tableDelimiterRow"), t.exit("tableHead"), e(_)) : I(_);
  }
  function I(_) {
    return n(_);
  }
  function y(_) {
    return t.enter("tableRow"), M(_);
  }
  function M(_) {
    return _ === 124 ? (t.enter("tableCellDivider"), t.consume(_), t.exit("tableCellDivider"), M) : _ === null || X(_) ? (t.exit("tableRow"), e(_)) : se(_) ? le(t, M, "whitespace")(_) : (t.enter("data"), E(_));
  }
  function E(_) {
    return _ === null || _ === 124 || ve(_) ? (t.exit("data"), M(_)) : (t.consume(_), _ === 92 ? N : E);
  }
  function N(_) {
    return _ === 92 || _ === 124 ? (t.consume(_), E) : E(_);
  }
}
function OR(t, e) {
  let n = -1, r = !0, i = 0, o = [0, 0, 0, 0], s = [0, 0, 0, 0], a = !1, l = 0, c, d, u;
  const h = new PR();
  for (; ++n < t.length; ) {
    const p = t[n], m = p[1];
    p[0] === "enter" ? m.type === "tableHead" ? (a = !1, l !== 0 && (Xl(h, e, l, c, d), d = void 0, l = 0), c = {
      type: "table",
      start: Object.assign({}, m.start),
      // Note: correct end is set later.
      end: Object.assign({}, m.end)
    }, h.add(n, 0, [["enter", c, e]])) : m.type === "tableRow" || m.type === "tableDelimiterRow" ? (r = !0, u = void 0, o = [0, 0, 0, 0], s = [0, n + 1, 0, 0], a && (a = !1, d = {
      type: "tableBody",
      start: Object.assign({}, m.start),
      // Note: correct end is set later.
      end: Object.assign({}, m.end)
    }, h.add(n, 0, [["enter", d, e]])), i = m.type === "tableDelimiterRow" ? 2 : d ? 3 : 1) : i && (m.type === "data" || m.type === "tableDelimiterMarker" || m.type === "tableDelimiterFiller") ? (r = !1, s[2] === 0 && (o[1] !== 0 && (s[0] = s[1], u = _r(h, e, o, i, void 0, u), o = [0, 0, 0, 0]), s[2] = n)) : m.type === "tableCellDivider" && (r ? r = !1 : (o[1] !== 0 && (s[0] = s[1], u = _r(h, e, o, i, void 0, u)), o = s, s = [o[1], n, 0, 0])) : m.type === "tableHead" ? (a = !0, l = n) : m.type === "tableRow" || m.type === "tableDelimiterRow" ? (l = n, o[1] !== 0 ? (s[0] = s[1], u = _r(h, e, o, i, n, u)) : s[1] !== 0 && (u = _r(h, e, s, i, n, u)), i = 0) : i && (m.type === "data" || m.type === "tableDelimiterMarker" || m.type === "tableDelimiterFiller") && (s[3] = n);
  }
  for (l !== 0 && Xl(h, e, l, c, d), h.consume(e.events), n = -1; ++n < e.events.length; ) {
    const p = e.events[n];
    p[0] === "enter" && p[1].type === "table" && (p[1]._align = DR(e.events, n));
  }
  return t;
}
function _r(t, e, n, r, i, o) {
  const s = r === 1 ? "tableHeader" : r === 2 ? "tableDelimiter" : "tableData", a = "tableContent";
  n[0] !== 0 && (o.end = Object.assign({}, mn(e.events, n[0])), t.add(n[0], 0, [["exit", o, e]]));
  const l = mn(e.events, n[1]);
  if (o = {
    type: s,
    start: Object.assign({}, l),
    // Note: correct end is set later.
    end: Object.assign({}, l)
  }, t.add(n[1], 0, [["enter", o, e]]), n[2] !== 0) {
    const c = mn(e.events, n[2]), d = mn(e.events, n[3]), u = {
      type: a,
      start: Object.assign({}, c),
      end: Object.assign({}, d)
    };
    if (t.add(n[2], 0, [["enter", u, e]]), r !== 2) {
      const h = e.events[n[2]], p = e.events[n[3]];
      if (h[1].end = Object.assign({}, p[1].end), h[1].type = "chunkText", h[1].contentType = "text", n[3] > n[2] + 1) {
        const m = n[2] + 1, g = n[3] - n[2] - 1;
        t.add(m, g, []);
      }
    }
    t.add(n[3] + 1, 0, [["exit", u, e]]);
  }
  return i !== void 0 && (o.end = Object.assign({}, mn(e.events, i)), t.add(i, 0, [["exit", o, e]]), o = void 0), o;
}
function Xl(t, e, n, r, i) {
  const o = [], s = mn(e.events, n);
  i && (i.end = Object.assign({}, s), o.push(["exit", i, e])), r.end = Object.assign({}, s), o.push(["exit", r, e]), t.add(n + 1, 0, o);
}
function mn(t, e) {
  const n = t[e], r = n[0] === "enter" ? "start" : "end";
  return n[1][r];
}
const $R = {
  name: "tasklistCheck",
  tokenize: BR
};
function FR() {
  return {
    text: {
      91: $R
    }
  };
}
function BR(t, e, n) {
  const r = this;
  return i;
  function i(l) {
    return (
      // Exit if there’s stuff before.
      r.previous !== null || // Exit if not in the first content that is the first child of a list
      // item.
      !r._gfmTasklistFirstContentOfListItem ? n(l) : (t.enter("taskListCheck"), t.enter("taskListCheckMarker"), t.consume(l), t.exit("taskListCheckMarker"), o)
    );
  }
  function o(l) {
    return ve(l) ? (t.enter("taskListCheckValueUnchecked"), t.consume(l), t.exit("taskListCheckValueUnchecked"), s) : l === 88 || l === 120 ? (t.enter("taskListCheckValueChecked"), t.consume(l), t.exit("taskListCheckValueChecked"), s) : n(l);
  }
  function s(l) {
    return l === 93 ? (t.enter("taskListCheckMarker"), t.consume(l), t.exit("taskListCheckMarker"), t.exit("taskListCheck"), a) : n(l);
  }
  function a(l) {
    return X(l) ? e(l) : se(l) ? t.check({
      tokenize: UR
    }, e, n)(l) : n(l);
  }
}
function UR(t, e, n) {
  return le(t, r, "whitespace");
  function r(i) {
    return i === null ? n(i) : e(i);
  }
}
function jR(t) {
  return ap([
    pR(),
    _R(),
    MR(t),
    LR(),
    FR()
  ]);
}
const VR = {};
function qR(t) {
  const e = (
    /** @type {Processor<Root>} */
    this
  ), n = t || VR, r = e.data(), i = r.micromarkExtensions || (r.micromarkExtensions = []), o = r.fromMarkdownExtensions || (r.fromMarkdownExtensions = []), s = r.toMarkdownExtensions || (r.toMarkdownExtensions = []);
  i.push(jR(n)), o.push(cR()), s.push(uR(n));
}
const HR = () => /* @__PURE__ */ f(
  LA,
  {
    remarkPlugins: [qR],
    className: "aui-md",
    components: KR,
    defer: !0
  }
), em = ke(HR), WR = ({ language: t, code: e }) => {
  const { isCopied: n, copyToClipboard: r } = GR();
  return /* @__PURE__ */ j("div", { className: "aui-code-header-root border-border/50 bg-muted/50 mt-3 flex items-center justify-between rounded-t-xl border border-b-0 px-3.5 py-1.5 text-xs", children: [
    /* @__PURE__ */ f("span", { className: "aui-code-header-language text-muted-foreground font-medium lowercase", children: t }),
    /* @__PURE__ */ j(on, { tooltip: "Copy", onClick: () => {
      !e || n || r(e);
    }, children: [
      !n && /* @__PURE__ */ f(kh, { className: "animate-in zoom-in-75 fade-in duration-150" }),
      n && /* @__PURE__ */ f(ns, { className: "animate-in zoom-in-50 fade-in duration-200 ease-out" })
    ] })
  ] });
}, GR = ({
  copiedDuration: t = 3e3
} = {}) => {
  const [e, n] = we(!1);
  return { isCopied: e, copyToClipboard: (i) => {
    !i || typeof navigator > "u" || !navigator.clipboard || navigator.clipboard.writeText(i).then(
      () => {
        n(!0), setTimeout(() => n(!1), t);
      },
      () => {
      }
    );
  } };
}, KR = $S({
  h1: ({ className: t, ...e }) => /* @__PURE__ */ f("h1", { className: K("aui-md-h1 mt-5 mb-2 scroll-m-20 text-xl font-semibold first:mt-0 last:mb-0", t), ...e }),
  h2: ({ className: t, ...e }) => /* @__PURE__ */ f("h2", { className: K("aui-md-h2 mt-5 mb-2 scroll-m-20 text-lg font-semibold first:mt-0 last:mb-0", t), ...e }),
  h3: ({ className: t, ...e }) => /* @__PURE__ */ f("h3", { className: K("aui-md-h3 mt-4 mb-1.5 scroll-m-20 text-base font-semibold first:mt-0 last:mb-0", t), ...e }),
  h4: ({ className: t, ...e }) => /* @__PURE__ */ f("h4", { className: K("aui-md-h4 mt-3.5 mb-1 scroll-m-20 text-base font-medium first:mt-0 last:mb-0", t), ...e }),
  h5: ({ className: t, ...e }) => /* @__PURE__ */ f("h5", { className: K("aui-md-h5 mt-3 mb-1 text-sm font-semibold first:mt-0 last:mb-0", t), ...e }),
  h6: ({ className: t, ...e }) => /* @__PURE__ */ f("h6", { className: K("aui-md-h6 mt-3 mb-1 text-sm font-medium first:mt-0 last:mb-0", t), ...e }),
  p: ({ className: t, ...e }) => /* @__PURE__ */ f("p", { className: K("aui-md-p my-3 leading-relaxed first:mt-0 last:mb-0", t), ...e }),
  a: ({ className: t, ...e }) => /* @__PURE__ */ f("a", { className: K("aui-md-a text-primary hover:text-primary/80 underline underline-offset-2", t), ...e }),
  blockquote: ({ className: t, ...e }) => /* @__PURE__ */ f("blockquote", { className: K("aui-md-blockquote border-muted-foreground/30 text-muted-foreground my-3 border-s-2 ps-4", t), ...e }),
  ul: ({ className: t, ...e }) => /* @__PURE__ */ f("ul", { className: K("aui-md-ul marker:text-muted-foreground my-3 ms-5 list-disc [&>li]:mt-1", t), ...e }),
  ol: ({ className: t, ...e }) => /* @__PURE__ */ f("ol", { className: K("aui-md-ol marker:text-muted-foreground my-3 ms-5 list-decimal [&>li]:mt-1", t), ...e }),
  hr: ({ className: t, ...e }) => /* @__PURE__ */ f("hr", { className: K("aui-md-hr border-muted-foreground/20 my-3", t), ...e }),
  table: ({ className: t, ...e }) => /* @__PURE__ */ f("table", { className: K("aui-md-table my-3 w-full border-separate border-spacing-0 overflow-y-auto", t), ...e }),
  th: ({ className: t, ...e }) => /* @__PURE__ */ f("th", { className: K("aui-md-th bg-muted px-3 py-1.5 text-start font-medium first:rounded-ss-lg last:rounded-se-lg [[align=center]]:text-center [[align=right]]:text-right", t), ...e }),
  td: ({ className: t, ...e }) => /* @__PURE__ */ f("td", { className: K("aui-md-td border-muted-foreground/20 border-s border-b px-3 py-1.5 text-start last:border-e [[align=center]]:text-center [[align=right]]:text-right", t), ...e }),
  tr: ({ className: t, ...e }) => /* @__PURE__ */ f("tr", { className: K("aui-md-tr m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-es-lg [&:last-child>td:last-child]:rounded-ee-lg", t), ...e }),
  li: ({ className: t, ...e }) => /* @__PURE__ */ f("li", { className: K("aui-md-li leading-relaxed", t), ...e }),
  strong: ({ className: t, ...e }) => /* @__PURE__ */ f("strong", { className: K("aui-md-strong font-semibold", t), ...e }),
  sup: ({ className: t, ...e }) => /* @__PURE__ */ f("sup", { className: K("aui-md-sup [&>a]:text-xs [&>a]:no-underline", t), ...e }),
  pre: ({ className: t, ...e }) => /* @__PURE__ */ f("pre", { className: K("aui-md-pre border-border/50 bg-muted/30 overflow-x-auto rounded-t-none rounded-b-xl border border-t-0 p-3.5 text-[13px] leading-relaxed", t), ...e }),
  code: function({ className: e, ...n }) {
    const r = qh();
    return /* @__PURE__ */ f(
      "code",
      {
        className: K(
          !r && "aui-md-inline-code bg-muted rounded-md px-1.5 py-0.5 font-mono text-[0.85em]",
          e
        ),
        ...n
      }
    );
  },
  CodeHeader: WR
}), Zl = (t) => typeof t == "boolean" ? `${t}` : t === 0 ? "0" : t, ec = Th, JR = (t, e) => (n) => {
  var r;
  if ((e == null ? void 0 : e.variants) == null)
    return ec(t, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
  const { variants: i, defaultVariants: o } = e, s = Object.keys(i).map((c) => {
    const d = n == null ? void 0 : n[c], u = o == null ? void 0 : o[c];
    if (d === null)
      return null;
    const h = Zl(d) || Zl(u);
    return i[c][h];
  }), a = n && Object.entries(n).reduce((c, d) => {
    let [u, h] = d;
    return h === void 0 || (c[u] = h), c;
  }, {}), l = e == null || (r = e.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((c, d) => {
    let { class: u, className: h, ...p } = d;
    return Object.entries(p).every((m) => {
      let [g, w] = m;
      return Array.isArray(w) ? w.includes({
        ...o,
        ...a
      }[g]) : {
        ...o,
        ...a
      }[g] === w;
    }) ? [
      ...c,
      u,
      h
    ] : c;
  }, []);
  return ec(t, s, l, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
}, QR = window.UIComponents.Collapsible, YR = window.UIComponents.CollapsibleContent, XR = window.UIComponents.CollapsibleTrigger, ZR = 200, As = yo(!1), e3 = JR("aui-reasoning-root mb-4 w-full", {
  variants: {
    variant: {
      outline: "rounded-lg border px-3 py-2",
      ghost: "",
      muted: "bg-muted/50 rounded-lg px-3 py-2"
    }
  },
  defaultVariants: {
    variant: "outline"
  }
});
function t3({
  className: t,
  variant: e,
  open: n,
  onOpenChange: r,
  defaultOpen: i = !1,
  streaming: o,
  children: s,
  ...a
}) {
  const l = Fe(i), [c, d] = we(null), u = n !== void 0, h = u ? n : c ?? o ?? l.current, m = o === !0 && h && (u || c === null);
  return /* @__PURE__ */ f(
    QR,
    {
      "data-slot": "reasoning-root",
      "data-variant": e,
      open: h,
      onOpenChange: (w) => {
        u || d(w), r == null || r(w);
      },
      className: K("group/reasoning-root", e3({ variant: e, className: t })),
      style: { "--animation-duration": `${ZR}ms` },
      ...a,
      children: /* @__PURE__ */ f(As.Provider, { value: m, children: s })
    }
  );
}
function tc({
  side: t = "bottom",
  className: e,
  ...n
}) {
  return /* @__PURE__ */ f(
    "div",
    {
      "data-slot": "reasoning-fade",
      className: K(
        "aui-reasoning-fade pointer-events-none absolute inset-x-0 z-10 h-8",
        t === "top" ? "top-0 bg-[linear-gradient(to_bottom,var(--color-background),transparent)]" : "bottom-0 bg-[linear-gradient(to_top,var(--color-background),transparent)]",
        "fade-in-0 animate-in",
        "duration-(--animation-duration)",
        e
      ),
      ...n
    }
  );
}
function n3({
  active: t,
  duration: e,
  className: n,
  ...r
}) {
  const i = e ? ` (${e}s)` : "";
  return /* @__PURE__ */ j(
    XR,
    {
      "data-slot": "reasoning-trigger",
      className: K(
        "aui-reasoning-trigger group/trigger text-muted-foreground hover:text-foreground flex max-w-[75%] origin-left items-center gap-2 py-1.5 text-sm transition-[color,scale] active:scale-[0.98]",
        n
      ),
      ...r,
      children: [
        /* @__PURE__ */ f(
          yh,
          {
            "data-slot": "reasoning-trigger-icon",
            className: "aui-reasoning-trigger-icon size-4 shrink-0"
          }
        ),
        /* @__PURE__ */ j(
          "span",
          {
            "data-slot": "reasoning-trigger-label",
            className: "aui-reasoning-trigger-label-wrapper relative inline-block leading-none tabular-nums",
            children: [
              /* @__PURE__ */ j("span", { children: [
                "Reasoning",
                i
              ] }),
              t ? /* @__PURE__ */ j(
                "span",
                {
                  "aria-hidden": !0,
                  "data-slot": "reasoning-trigger-shimmer",
                  className: "aui-reasoning-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:animate-none",
                  children: [
                    "Reasoning",
                    i
                  ]
                }
              ) : null
            ]
          }
        ),
        /* @__PURE__ */ f(
          rs,
          {
            "data-slot": "reasoning-trigger-chevron",
            className: K(
              "aui-reasoning-trigger-chevron mt-0.5 size-4 shrink-0",
              "transition-transform duration-(--animation-duration) ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
              "-rotate-90",
              "group-data-[state=open]/trigger:rotate-0"
            )
          }
        )
      ]
    }
  );
}
function r3({
  className: t,
  children: e,
  ...n
}) {
  const r = nr(As);
  return /* @__PURE__ */ j(
    YR,
    {
      "data-slot": "reasoning-content",
      className: K(
        "aui-reasoning-content text-muted-foreground relative overflow-hidden text-sm outline-none",
        "group/collapsible-content ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none",
        "data-[state=closed]:animate-collapsible-up",
        "data-[state=open]:animate-collapsible-down",
        "data-[state=closed]:fill-mode-forwards",
        "data-[state=closed]:pointer-events-none",
        t
      ),
      ...n,
      children: [
        /* @__PURE__ */ f(tc, { side: "top" }),
        e,
        r ? /* @__PURE__ */ f(tc, {}) : null
      ]
    }
  );
}
function i3({
  className: t,
  children: e,
  ...n
}) {
  const r = nr(As), i = Fe(null), o = Fe(null);
  return it(() => {
    if (!r)
      return;
    const s = i.current, a = o.current;
    if (!s || !a)
      return;
    const l = () => {
      s.scrollTop = s.scrollHeight;
    };
    l();
    const c = new ResizeObserver(l);
    return c.observe(a), () => c.disconnect();
  }, [r]), /* @__PURE__ */ f(
    "div",
    {
      ref: i,
      "data-slot": "reasoning-text",
      className: K(
        "aui-reasoning-text relative z-0 max-h-64 overflow-y-auto ps-6 pt-2 pb-2 leading-relaxed text-pretty",
        "motion-reduce:animate-none",
        "group-data-[state=open]/collapsible-content:animate-in",
        "group-data-[state=open]/collapsible-content:fade-in-0",
        "group-data-[state=open]/collapsible-content:slide-in-from-top-4",
        t
      ),
      ...n,
      children: /* @__PURE__ */ f("div", { ref: o, className: "aui-reasoning-text-content space-y-4", children: e })
    }
  );
}
const o3 = () => /* @__PURE__ */ f(em, {}), tm = ke(o3);
tm.displayName = "Reasoning";
const s3 = window.UIComponents.Collapsible, a3 = window.UIComponents.CollapsibleContent, l3 = window.UIComponents.CollapsibleTrigger, dn = window.UIComponents.Button, c3 = 200, hn = "active:scale-[0.98]";
function u3({
  className: t,
  open: e,
  onOpenChange: n,
  defaultOpen: r = !1,
  children: i,
  ...o
}) {
  const [s, a] = we(r), l = e !== void 0;
  return /* @__PURE__ */ f(
    s3,
    {
      "data-slot": "tool-fallback-root",
      open: l ? e : s,
      onOpenChange: (u) => {
        l || a(u), n == null || n(u);
      },
      className: K("aui-tool-fallback-root group/tool-fallback-root w-full", t),
      style: { "--animation-duration": `${c3}ms` },
      ...o,
      children: i
    }
  );
}
const d3 = {
  running: Sh,
  complete: ns,
  incomplete: Qk,
  "requires-action": xh
}, h3 = (t) => {
  if (t < 1e3)
    return "<1s";
  const e = t / 1e3;
  return e < 10 ? `${(Math.floor(e * 10) / 10).toFixed(1)}s` : e < 60 ? `${Math.floor(e)}s` : `${Math.floor(e / 60)}m ${Math.floor(e % 60)}s`;
};
function p3({
  className: t,
  ...e
}) {
  const n = Ik();
  return n === void 0 ? null : /* @__PURE__ */ f(
    "span",
    {
      "data-slot": "tool-fallback-duration",
      className: K("aui-tool-fallback-duration text-muted-foreground text-xs tabular-nums", t),
      ...e,
      children: h3(n)
    }
  );
}
function m3({
  toolName: t,
  status: e,
  className: n,
  ...r
}) {
  const i = (e == null ? void 0 : e.type) ?? "complete", o = i === "running", s = (e == null ? void 0 : e.type) === "incomplete" && e.reason === "cancelled", a = d3[i], l = s ? "Cancelled tool" : "Used tool";
  return /* @__PURE__ */ j(
    l3,
    {
      "data-slot": "tool-fallback-trigger",
      className: K(
        "aui-tool-fallback-trigger group/trigger text-muted-foreground hover:text-foreground flex w-fit origin-left items-center gap-2 py-1.5 text-sm transition-[color,scale] active:scale-[0.98]",
        n
      ),
      ...r,
      children: [
        /* @__PURE__ */ f(
          a,
          {
            "data-slot": "tool-fallback-trigger-icon",
            className: K(
              "aui-tool-fallback-trigger-icon size-4 shrink-0",
              s && "text-muted-foreground",
              o && "animate-spin [animation-duration:0.6s]"
            )
          }
        ),
        /* @__PURE__ */ j(
          "span",
          {
            "data-slot": "tool-fallback-trigger-label",
            className: K(
              "aui-tool-fallback-trigger-label-wrapper relative inline-block text-start leading-none",
              s && "text-muted-foreground line-through"
            ),
            children: [
              /* @__PURE__ */ j("span", { children: [
                l,
                ": ",
                /* @__PURE__ */ f("b", { children: t })
              ] }),
              o && /* @__PURE__ */ j(
                "span",
                {
                  "aria-hidden": !0,
                  "data-slot": "tool-fallback-trigger-shimmer",
                  className: "aui-tool-fallback-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:animate-none",
                  children: [
                    l,
                    ": ",
                    /* @__PURE__ */ f("b", { children: t })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ f(p3, {}),
        /* @__PURE__ */ f(
          rs,
          {
            "data-slot": "tool-fallback-trigger-chevron",
            className: K(
              "aui-tool-fallback-trigger-chevron size-4 shrink-0",
              "transition-transform duration-(--animation-duration) ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
              "-rotate-90",
              "group-data-[state=open]/trigger:rotate-0"
            )
          }
        )
      ]
    }
  );
}
function f3({
  className: t,
  children: e,
  ...n
}) {
  return /* @__PURE__ */ f(
    a3,
    {
      "data-slot": "tool-fallback-content",
      className: K(
        "aui-tool-fallback-content relative overflow-hidden text-sm outline-none",
        "group/collapsible-content ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none",
        "data-[state=closed]:animate-collapsible-up",
        "data-[state=open]:animate-collapsible-down",
        "data-[state=closed]:fill-mode-forwards",
        "data-[state=closed]:pointer-events-none",
        t
      ),
      ...n,
      children: /* @__PURE__ */ f(
        "div",
        {
          className: K(
            "flex flex-col gap-2 ps-6 pt-1 pb-2 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none",
            "group-data-[state=open]/collapsible-content:animate-in group-data-[state=open]/collapsible-content:fade-in-0 group-data-[state=open]/collapsible-content:slide-in-from-top-1",
            "group-data-[state=closed]/collapsible-content:animate-out group-data-[state=closed]/collapsible-content:fade-out-0 group-data-[state=closed]/collapsible-content:slide-out-to-top-1"
          ),
          children: e
        }
      )
    }
  );
}
function g3({
  argsText: t,
  className: e,
  ...n
}) {
  return t ? /* @__PURE__ */ f("div", { "data-slot": "tool-fallback-args", className: K("aui-tool-fallback-args", e), ...n, children: /* @__PURE__ */ f("pre", { className: "aui-tool-fallback-args-value bg-muted/50 text-foreground/90 rounded-md p-2.5 text-xs whitespace-pre-wrap", children: t }) }) : null;
}
function b3({
  result: t,
  className: e,
  ...n
}) {
  return t === void 0 ? null : /* @__PURE__ */ j("div", { "data-slot": "tool-fallback-result", className: K("aui-tool-fallback-result", e), ...n, children: [
    /* @__PURE__ */ f("p", { className: "aui-tool-fallback-result-header text-muted-foreground text-xs font-medium", children: "Result:" }),
    /* @__PURE__ */ f("pre", { className: "aui-tool-fallback-result-content bg-muted/50 text-foreground/90 mt-1 max-h-80 overflow-y-auto rounded-md p-2.5 text-xs whitespace-pre-wrap", children: typeof t == "string" ? t : JSON.stringify(t, null, 2) })
  ] });
}
function v3({
  status: t,
  className: e,
  ...n
}) {
  if ((t == null ? void 0 : t.type) !== "incomplete")
    return null;
  const r = t.error, i = r ? typeof r == "string" ? r : JSON.stringify(r) : null;
  if (!i)
    return null;
  const s = t.reason === "cancelled" ? "Cancelled reason:" : "Error:";
  return /* @__PURE__ */ j("div", { "data-slot": "tool-fallback-error", className: K("aui-tool-fallback-error", e), ...n, children: [
    /* @__PURE__ */ f("p", { className: "aui-tool-fallback-error-header text-muted-foreground font-semibold", children: s }),
    /* @__PURE__ */ f("p", { className: "aui-tool-fallback-error-reason text-muted-foreground", children: i })
  ] });
}
const w3 = "Approved by user", y3 = "User denied tool execution", wo = {
  "allow-once": "Allow",
  "allow-always": "Always allow",
  "reject-once": "Deny",
  "reject-always": "Always deny"
}, nc = (t) => t === "allow-once" || t === "allow-always", rc = (t) => t.label ?? (Object.hasOwn(wo, t.kind) ? wo[t.kind] : void 0) ?? t.id;
function x3({
  className: t,
  addResult: e,
  resume: n,
  interrupt: r,
  approval: i,
  respondToApproval: o,
  ...s
}) {
  const [a, l] = we(!1), [c, d] = we(null);
  if (i != null && (i.approved !== void 0 || i.resolution !== void 0))
    return null;
  const u = o ? i == null ? void 0 : i.options : void 0, h = u == null ? void 0 : u.filter(
    (b) => Object.hasOwn(wo, b.kind)
  ), p = (b) => {
    a || (i != null && i.approved === void 0 && o ? o({ approved: b }) : r ? n == null || n({ approved: b }) : e == null || e(b ? w3 : y3), l(!0));
  }, m = (b) => {
    a || (o == null || o({ optionId: b.id }), l(!0), d(null));
  }, g = (b) => {
    b.confirm ? d(b.id) : m(b);
  }, w = c != null ? h == null ? void 0 : h.find((b) => b.id === c) : void 0;
  if (w) {
    const b = typeof w.confirm == "object" ? w.confirm : void 0, k = (b == null ? void 0 : b.description) ?? w.description;
    return /* @__PURE__ */ j(
      "div",
      {
        "data-slot": "tool-fallback-approval-confirm",
        className: K("aui-tool-fallback-approval-confirm flex flex-col gap-2 pt-1", t),
        ...s,
        children: [
          /* @__PURE__ */ f("p", { className: "aui-tool-fallback-approval-confirm-title font-semibold", children: (b == null ? void 0 : b.title) ?? `${rc(w)}?` }),
          k && /* @__PURE__ */ f("p", { className: "aui-tool-fallback-approval-confirm-description text-muted-foreground", children: k }),
          w.grants && w.grants.length > 0 && /* @__PURE__ */ f("ul", { className: "aui-tool-fallback-approval-confirm-grants flex flex-col gap-1", children: w.grants.map((x) => /* @__PURE__ */ f("li", { children: /* @__PURE__ */ f("code", { className: "aui-tool-fallback-approval-confirm-grant bg-muted rounded px-1.5 py-0.5 text-xs", children: x }) }, x)) }),
          /* @__PURE__ */ j("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ f(dn, { size: "sm", className: hn, onClick: () => m(w), disabled: a, children: "Confirm" }),
            /* @__PURE__ */ f(dn, { size: "sm", variant: "outline", className: hn, onClick: () => d(null), disabled: a, children: "Back" })
          ] })
        ]
      }
    );
  }
  if (u && u.length > 0) {
    const b = (h == null ? void 0 : h.filter((x) => nc(x.kind))) ?? [], k = (h == null ? void 0 : h.filter((x) => !nc(x.kind))) ?? [];
    return /* @__PURE__ */ j(
      "div",
      {
        "data-slot": "tool-fallback-approval",
        className: K("aui-tool-fallback-approval flex flex-wrap items-center gap-2 pt-1", t),
        ...s,
        children: [
          [...b, ...k].map((x) => /* @__PURE__ */ f(
            dn,
            {
              size: "sm",
              variant: x === b[0] ? "default" : "outline",
              className: hn,
              onClick: () => g(x),
              disabled: a,
              children: rc(x)
            },
            x.id
          )),
          k.length === 0 && /* @__PURE__ */ f(dn, { size: "sm", variant: "outline", className: hn, onClick: () => p(!1), disabled: a, children: "Deny" })
        ]
      }
    );
  }
  return /* @__PURE__ */ j(
    "div",
    {
      "data-slot": "tool-fallback-approval",
      className: K("aui-tool-fallback-approval flex items-center gap-2 pt-1", t),
      ...s,
      children: [
        /* @__PURE__ */ f(dn, { size: "sm", className: hn, onClick: () => p(!0), disabled: a, children: "Allow" }),
        /* @__PURE__ */ f(dn, { size: "sm", variant: "outline", className: hn, onClick: () => p(!1), disabled: a, children: "Deny" })
      ]
    }
  );
}
const k3 = ({
  toolName: t,
  argsText: e,
  result: n,
  status: r,
  addResult: i,
  resume: o,
  interrupt: s,
  approval: a,
  respondToApproval: l
}) => {
  const c = (r == null ? void 0 : r.type) === "incomplete" && r.reason === "cancelled", d = (r == null ? void 0 : r.type) === "requires-action", [u, h] = we(d), [p, m] = we(d);
  return d !== p && (m(d), d && h(!0)), /* @__PURE__ */ j(u3, { open: u, onOpenChange: h, children: [
    /* @__PURE__ */ f(m3, { toolName: t, status: r }),
    /* @__PURE__ */ j(f3, { children: [
      /* @__PURE__ */ f(v3, { status: r }),
      /* @__PURE__ */ f(g3, { argsText: e, className: K(c && "opacity-60") }),
      d && /* @__PURE__ */ f(
        x3,
        {
          addResult: i,
          resume: o,
          interrupt: s,
          approval: a,
          respondToApproval: l
        }
      ),
      !c && /* @__PURE__ */ f(b3, { result: n })
    ] })
  ] });
}, nm = ke(k3);
nm.displayName = "ToolFallback";
const _3 = window.UIComponents.Collapsible, S3 = window.UIComponents.CollapsibleContent, C3 = window.UIComponents.CollapsibleTrigger, T3 = 200;
function I3({
  className: t,
  defaultOpen: e = !1,
  requiresAction: n = !1,
  children: r,
  ...i
}) {
  const [o, s] = we(e), [a, l] = we(n);
  return n !== a && (l(n), n && s(!0)), /* @__PURE__ */ f(
    _3,
    {
      "data-slot": "thought-group-root",
      open: o,
      onOpenChange: s,
      className: K("aui-thought-group-root group/thought-group-root w-full", t),
      style: { "--animation-duration": `${T3}ms` },
      ...i,
      children: r
    }
  );
}
function A3({
  active: t = !1,
  className: e,
  ...n
}) {
  const r = t ? "Thinking…" : "Thought process";
  return /* @__PURE__ */ j(
    C3,
    {
      "data-slot": "thought-group-trigger",
      className: K(
        "aui-thought-group-trigger group/trigger text-muted-foreground hover:text-foreground flex w-fit origin-left items-center gap-2 py-1.5 text-sm transition-[color,scale] active:scale-[0.98]",
        e
      ),
      ...n,
      children: [
        t ? /* @__PURE__ */ f(
          Sh,
          {
            "data-slot": "thought-group-trigger-loader",
            className: "aui-thought-group-trigger-loader size-4 shrink-0 animate-spin [animation-duration:0.6s]"
          }
        ) : /* @__PURE__ */ f(
          yh,
          {
            "data-slot": "thought-group-trigger-icon",
            className: "aui-thought-group-trigger-icon size-4 shrink-0"
          }
        ),
        /* @__PURE__ */ j(
          "span",
          {
            "data-slot": "thought-group-trigger-label",
            className: "aui-thought-group-trigger-label-wrapper relative inline-block text-start text-xs leading-none",
            children: [
              /* @__PURE__ */ f("span", { children: r }),
              t && /* @__PURE__ */ f(
                "span",
                {
                  "aria-hidden": !0,
                  "data-slot": "thought-group-trigger-shimmer",
                  className: "aui-thought-group-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:animate-none",
                  children: r
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ f(
          rs,
          {
            "data-slot": "thought-group-trigger-chevron",
            className: K(
              "aui-thought-group-trigger-chevron size-3 shrink-0",
              "transition-transform duration-(--animation-duration) ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
              "-rotate-90",
              "group-data-[state=open]/trigger:rotate-0"
            )
          }
        )
      ]
    }
  );
}
function E3({
  className: t,
  children: e,
  ...n
}) {
  return /* @__PURE__ */ f(
    S3,
    {
      "data-slot": "thought-group-content",
      className: K(
        "aui-thought-group-content relative overflow-hidden text-sm outline-none",
        "group/collapsible-content ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none",
        "data-[state=closed]:animate-collapsible-up",
        "data-[state=open]:animate-collapsible-down",
        "data-[state=closed]:fill-mode-forwards",
        "data-[state=closed]:pointer-events-none",
        t
      ),
      ...n,
      children: /* @__PURE__ */ f(
        "div",
        {
          className: K(
            "border-border/60 mt-1 mb-2 flex flex-col gap-1 border-s ps-3",
            "[&>*]:animate-in [&>*]:fade-in-0 [&>*]:slide-in-from-top-1 [&>*]:duration-(--animation-duration) [&>*]:ease-[cubic-bezier(0.32,0.72,0,1)]",
            "[&>*]:motion-reduce:animate-none"
          ),
          children: e
        }
      )
    }
  );
}
const rm = window.UIComponents.Button, R3 = [
  "What MCP tools are available?",
  "Show the 5 most recent orders",
  "Summarize today’s orders"
], Ui = (t) => t.thread.messages.length === 0 && (!t.thread.isLoading || t.threads.isLoading), M3 = ({ onNewChat: t, onCompact: e, belowComposer: n }) => {
  const r = $(Ui);
  return /* @__PURE__ */ f(
    fn.Root,
    {
      className: "aui-root aui-thread-root bg-background flex h-full flex-col",
      style: {
        "--thread-max-width": "44rem",
        "--composer-bg": "color-mix(in oklab, var(--color-muted) 30%, var(--color-background))",
        "--composer-radius": "1.5rem"
      },
      children: /* @__PURE__ */ f(
        fn.Viewport,
        {
          turnAnchor: "top",
          "data-slot": "aui_thread-viewport",
          className: "relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth",
          children: /* @__PURE__ */ j(
            "div",
            {
              className: K(
                "mx-auto flex w-full max-w-(--thread-max-width) flex-1 flex-col px-4 pt-4",
                r && "justify-center"
              ),
              children: [
                /* @__PURE__ */ f(Wt, { condition: Ui, children: /* @__PURE__ */ f(N3, {}) }),
                /* @__PURE__ */ f(
                  "div",
                  {
                    "data-slot": "aui_message-group",
                    className: "mb-14 flex flex-col gap-y-6 empty:hidden",
                    children: /* @__PURE__ */ f(fn.Messages, { components: { UserMessage: U3, AssistantMessage: F3 } })
                  }
                ),
                /* @__PURE__ */ j(
                  fn.ViewportFooter,
                  {
                    className: K(
                      "aui-thread-viewport-footer bg-background flex flex-col gap-4 overflow-visible pb-4 md:pb-6",
                      !r && "sticky bottom-0 mt-auto rounded-t-(--composer-radius)"
                    ),
                    children: [
                      /* @__PURE__ */ f(P3, {}),
                      /* @__PURE__ */ f(z3, { onNewChat: t, onCompact: e }),
                      n,
                      /* @__PURE__ */ f(Wt, { condition: (i) => Ui(i) && i.composer.isEmpty, children: /* @__PURE__ */ f(D3, {}) })
                    ]
                  }
                )
              ]
            }
          )
        }
      )
    }
  );
}, P3 = () => /* @__PURE__ */ f(fn.ScrollToBottom, { asChild: !0, children: /* @__PURE__ */ f(
  on,
  {
    tooltip: J("Scroll to bottom"),
    variant: "outline",
    className: "aui-thread-scroll-to-bottom dark:border-border dark:bg-background dark:hover:bg-accent absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible",
    children: /* @__PURE__ */ f(Fk, {})
  }
) }), N3 = () => /* @__PURE__ */ j("div", { className: "aui-thread-welcome-root mb-6 flex flex-col items-center px-4 text-center", children: [
  /* @__PURE__ */ f(ts, { className: "text-muted-foreground mb-3 size-10" }),
  /* @__PURE__ */ f("h1", { className: "aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in fill-mode-both text-2xl font-semibold duration-200", children: J("How can I help you today?") }),
  /* @__PURE__ */ f("p", { className: "text-muted-foreground mt-1 text-sm", children: J("Ask about Restoapp data available to your account.") })
] }), D3 = () => /* @__PURE__ */ f("div", { className: "aui-thread-welcome-suggestions flex w-full flex-wrap items-center justify-center gap-2 px-4", children: R3.map((t) => J(t)).map((t) => /* @__PURE__ */ f(fn.Suggestion, { prompt: t, send: !0, asChild: !0, children: /* @__PURE__ */ f(
  rm,
  {
    variant: "ghost",
    className: "aui-thread-welcome-suggestion text-foreground hover:bg-muted border-border/60 h-auto gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-normal whitespace-nowrap transition-colors",
    children: t
  }
) }, t)) }), L3 = "What can you do? List the data models, admin pages and tools available to me.", z3 = ({
  onNewChat: t,
  onCompact: e
}) => {
  const n = vx(), r = Rk({
    commands: [
      {
        id: "new",
        label: "/new",
        description: J("Start a new chat (clears the conversation)"),
        execute: () => t == null ? void 0 : t()
      },
      {
        id: "compact",
        label: "/compact",
        description: J("Free up context: prune or summarize older messages"),
        execute: () => e == null ? void 0 : e()
      },
      {
        id: "model",
        label: "/model",
        description: J("Open the model selector"),
        execute: () => {
          var i;
          (i = document.querySelector('select[aria-label="Select model"]')) == null || i.focus();
        }
      },
      {
        id: "help",
        label: "/help",
        description: J("Ask the assistant what it can do"),
        // Deferred so the popover's own composer cleanup runs first and does
        // not clobber the injected prompt.
        execute: () => {
          setTimeout(() => {
            n.setText(J(L3)), n.send();
          }, 0);
        }
      }
    ],
    removeOnExecute: !0
  });
  return /* @__PURE__ */ f(je.Unstable_TriggerPopoverRoot, { children: /* @__PURE__ */ j(je.Root, { className: "aui-composer-root relative flex w-full flex-col", children: [
    /* @__PURE__ */ j(
      je.Unstable_TriggerPopover,
      {
        char: "/",
        adapter: r.adapter,
        className: "aui-composer-slash-popover border-border/60 bg-popover text-popover-foreground absolute inset-x-2 bottom-full z-20 mb-2 flex flex-col gap-0.5 overflow-hidden rounded-xl border p-1 shadow-lg",
        children: [
          /* @__PURE__ */ f(je.Unstable_TriggerPopover.Action, { ...r.action }),
          /* @__PURE__ */ f(je.Unstable_TriggerPopoverItems, { children: (i) => i.length === 0 ? /* @__PURE__ */ f("div", { className: "text-muted-foreground px-2.5 py-1.5 text-xs", children: "No matching commands" }) : i.map((o, s) => /* @__PURE__ */ j(
            je.Unstable_TriggerPopoverItem,
            {
              item: o,
              index: s,
              className: "data-[highlighted]:bg-accent hover:bg-accent flex w-full cursor-pointer items-baseline gap-2 rounded-lg px-2.5 py-1.5 text-start text-sm",
              children: [
                /* @__PURE__ */ f("span", { className: "font-medium", children: o.label }),
                o.description && /* @__PURE__ */ f("span", { className: "text-muted-foreground text-xs", children: o.description })
              ]
            },
            o.id
          )) })
        ]
      }
    ),
    /* @__PURE__ */ f(je.AttachmentDropzone, { asChild: !0, children: /* @__PURE__ */ j(
      "div",
      {
        "data-slot": "aui_composer-shell",
        className: "border-border/60 data-[dragging=true]:border-ring focus-within:border-border dark:border-muted-foreground/15 dark:focus-within:border-muted-foreground/30 flex w-full flex-col gap-2 rounded-(--composer-radius) border bg-(--composer-bg) p-2 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] focus-within:shadow-[0_6px_24px_-8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.05)] data-[dragging=true]:border-dashed dark:shadow-none",
        children: [
          /* @__PURE__ */ f(DS, {}),
          /* @__PURE__ */ f(
            je.Input,
            {
              placeholder: J("Ask about Restoapp data… type / for commands"),
              className: "aui-composer-input caret-primary placeholder:text-muted-foreground/80 max-h-32 min-h-10 w-full resize-none bg-transparent px-2.5 py-1 text-base outline-none",
              rows: 1,
              autoFocus: !0,
              addAttachmentOnPaste: !0,
              enterKeyHint: "send",
              "aria-label": J("Message input")
            }
          ),
          /* @__PURE__ */ f(O3, {})
        ]
      }
    ) })
  ] }) });
}, O3 = () => /* @__PURE__ */ j("div", { className: "aui-composer-action-wrapper relative flex items-center justify-between", children: [
  /* @__PURE__ */ f(LS, {}),
  /* @__PURE__ */ j("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ f(Wt, { condition: (t) => !t.thread.isRunning, children: /* @__PURE__ */ f(je.Send, { asChild: !0, children: /* @__PURE__ */ f(
      on,
      {
        tooltip: J("Send message"),
        side: "bottom",
        type: "button",
        variant: "default",
        size: "icon",
        className: "aui-composer-send size-7 rounded-full",
        "aria-label": J("Send message"),
        children: /* @__PURE__ */ f(Uk, { className: "aui-composer-send-icon size-4.5" })
      }
    ) }) }),
    /* @__PURE__ */ f(Wt, { condition: (t) => t.thread.isRunning, children: /* @__PURE__ */ f(je.Cancel, { asChild: !0, children: /* @__PURE__ */ f(
      rm,
      {
        type: "button",
        variant: "default",
        size: "icon",
        className: "aui-composer-cancel size-7 rounded-full",
        "aria-label": J("Stop generating"),
        children: /* @__PURE__ */ f(c_, { className: "aui-composer-cancel-icon size-3.5 fill-current" })
      }
    ) }) })
  ] })
] }), $3 = () => /* @__PURE__ */ f(xn.Error, { children: /* @__PURE__ */ f(Wa.Root, { className: "aui-message-error-root border-destructive bg-destructive/10 text-destructive dark:bg-destructive/5 mt-2 rounded-md border p-3 text-sm dark:text-red-200", children: /* @__PURE__ */ f(Wa.Message, { className: "aui-message-error-message" }) }) }), F3 = () => /* @__PURE__ */ j(
  xn.Root,
  {
    "data-slot": "aui_assistant-message-root",
    "data-role": "assistant",
    className: "fade-in slide-in-from-bottom-1 animate-in relative -mb-7.5 pb-7.5 duration-150",
    children: [
      /* @__PURE__ */ j(
        "div",
        {
          "data-slot": "aui_assistant-message-content",
          className: "text-foreground px-2 leading-relaxed wrap-break-word",
          children: [
            /* @__PURE__ */ f(
              xn.GroupedParts,
              {
                groupBy: uy({
                  reasoning: ["group-thought", "group-reasoning"],
                  "tool-call": ["group-thought"],
                  "standalone-tool-call": []
                }),
                children: ({ part: t, children: e }) => {
                  switch (t.type) {
                    case "group-thought":
                      return /* @__PURE__ */ j(
                        I3,
                        {
                          requiresAction: t.status.type === "requires-action",
                          children: [
                            /* @__PURE__ */ f(A3, { active: t.status.type === "running" }),
                            /* @__PURE__ */ f(E3, { children: e })
                          ]
                        }
                      );
                    case "group-reasoning": {
                      const n = t.status.type === "running";
                      return /* @__PURE__ */ j(t3, { variant: "ghost", streaming: n, children: [
                        /* @__PURE__ */ f(n3, { active: n }),
                        /* @__PURE__ */ f(r3, { "aria-busy": n, children: /* @__PURE__ */ f(i3, { children: e }) })
                      ] });
                    }
                    case "text":
                      return /* @__PURE__ */ f(em, {});
                    case "reasoning":
                      return /* @__PURE__ */ f(tm, { ...t });
                    case "tool-call":
                      return t.toolUI ?? /* @__PURE__ */ f(nm, { ...t });
                    case "indicator":
                      return /* @__PURE__ */ f(
                        "span",
                        {
                          "data-slot": "aui_assistant-message-indicator",
                          className: "animate-pulse font-sans",
                          "aria-label": J("Assistant is working"),
                          children: "●"
                        }
                      );
                    default:
                      return null;
                  }
                }
              }
            ),
            /* @__PURE__ */ f($3, {})
          ]
        }
      ),
      /* @__PURE__ */ f(
        "div",
        {
          "data-slot": "aui_assistant-message-footer",
          className: "ms-2 flex min-h-7.5 items-center pt-1.5",
          children: /* @__PURE__ */ f(B3, {})
        }
      )
    ]
  }
), B3 = () => /* @__PURE__ */ f(
  Da.Root,
  {
    hideWhenRunning: !0,
    autohide: "not-last",
    className: "aui-assistant-action-bar-root text-muted-foreground animate-in fade-in -ms-1 flex gap-1 duration-200",
    children: /* @__PURE__ */ f(Da.Copy, { asChild: !0, children: /* @__PURE__ */ j(on, { tooltip: J("Copy"), children: [
      /* @__PURE__ */ f(Wt, { condition: (t) => t.message.isCopied, children: /* @__PURE__ */ f(ns, { className: "animate-in zoom-in-50 fade-in duration-200 ease-out" }) }),
      /* @__PURE__ */ f(Wt, { condition: (t) => !t.message.isCopied, children: /* @__PURE__ */ f(kh, { className: "animate-in zoom-in-75 fade-in duration-150" }) })
    ] }) })
  }
), U3 = () => /* @__PURE__ */ j(
  xn.Root,
  {
    "data-slot": "aui_user-message-root",
    className: "fade-in slide-in-from-bottom-1 animate-in grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 duration-150 [&>*]:col-start-2",
    "data-role": "user",
    children: [
      /* @__PURE__ */ f(NS, {}),
      /* @__PURE__ */ f("div", { className: "aui-user-message-content-wrapper relative col-start-2 min-w-0", children: /* @__PURE__ */ f("div", { className: "aui-user-message-content bg-muted text-foreground rounded-xl px-4 py-2 wrap-break-word whitespace-pre-wrap empty:hidden", children: /* @__PURE__ */ f(xn.Parts, {}) }) })
    ]
  }
);
function xt() {
  return (window.location.pathname || "").replace(/\/openharness-agent$/, "");
}
function j3() {
  for (const t of document.cookie.split(";")) {
    const [e, ...n] = t.trim().split("=");
    if (e === "XSRF-TOKEN")
      return decodeURIComponent(n.join("=") || "");
  }
  return null;
}
function ui() {
  const t = j3();
  return t ? { "X-XSRF-TOKEN": t } : {};
}
async function Dt(t) {
  try {
    const e = await t.json();
    return e.error || e.message || `HTTP ${t.status}`;
  } catch {
    return `HTTP ${t.status}`;
  }
}
async function V3() {
  const t = await fetch(`${xt()}/api/openharness/status`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" }
  });
  if (!t.ok)
    throw new Error(await Dt(t));
  return t.json();
}
async function q3(t = !1) {
  const e = t ? "?refresh=1" : "", n = await fetch(`${xt()}/api/openharness/limits${e}`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" }
  });
  if (!n.ok)
    throw new Error(await Dt(n));
  return n.json();
}
async function H3() {
  const t = await fetch(`${xt()}/api/openharness/meta`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" }
  });
  if (!t.ok)
    throw new Error(await Dt(t));
  return t.json();
}
async function W3() {
  const t = await fetch(`${xt()}/api/openharness/session`, {
    method: "DELETE",
    credentials: "same-origin",
    headers: { Accept: "application/json", ...ui() }
  });
  if (!t.ok)
    throw new Error(await Dt(t));
}
async function G3(t) {
  const e = await fetch(`${xt()}/api/openharness/model`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...ui()
    },
    body: JSON.stringify({ model: t })
  });
  if (!e.ok)
    throw new Error(await Dt(e));
  return e.json();
}
async function K3() {
  const t = await fetch(`${xt()}/api/openharness/history`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" }
  });
  if (!t.ok)
    throw new Error(await Dt(t));
  const e = await t.json();
  return Array.isArray(e == null ? void 0 : e.messages) ? e.messages : [];
}
async function J3() {
  const t = await fetch(`${xt()}/api/openharness/compact`, {
    method: "POST",
    credentials: "same-origin",
    headers: { Accept: "application/json", ...ui() }
  });
  if (!t.ok)
    throw new Error(await Dt(t));
  return t.json();
}
function Q3(t) {
  if (typeof t == "string")
    return [{ type: "text", text: t }];
  const e = [];
  for (const n of t ?? [])
    if ((n == null ? void 0 : n.type) === "text") {
      const r = /^<attachment name=("(?:[^"\\]|\\.)*")/.exec(n.text ?? "");
      if (r) {
        let i = "file";
        try {
          i = JSON.parse(r[1]);
        } catch {
        }
        e.push({ type: "text", text: `📎 ${i}` });
      } else
        e.push({ type: "text", text: n.text ?? "" });
    } else
      (n == null ? void 0 : n.type) === "image" && typeof n.image == "string" && e.push({ type: "image", image: n.image });
  return e.length ? e : [{ type: "text", text: "" }];
}
function Y3(t) {
  const e = [], n = /* @__PURE__ */ new Map();
  let r = null;
  const i = () => {
    r != null && r.length && e.push({ role: "assistant", content: r }), r = null;
  };
  for (const o of t ?? [])
    if ((o == null ? void 0 : o.role) === "user")
      i(), e.push({ role: "user", content: Q3(o.content) });
    else if ((o == null ? void 0 : o.role) === "assistant") {
      r || (r = []);
      const s = typeof o.content == "string" ? [{ type: "text", text: o.content }] : o.content ?? [];
      for (const a of s)
        if ((a == null ? void 0 : a.type) === "text" && a.text)
          r.push({ type: "text", text: a.text });
        else if ((a == null ? void 0 : a.type) === "reasoning" && a.text)
          r.push({ type: "reasoning", text: a.text });
        else if ((a == null ? void 0 : a.type) === "tool-call") {
          const l = {
            type: "tool-call",
            toolCallId: a.toolCallId,
            toolName: a.toolName,
            args: a.input ?? a.args ?? {}
          };
          n.set(a.toolCallId, l), r.push(l);
        }
    } else if ((o == null ? void 0 : o.role) === "tool")
      for (const s of o.content ?? []) {
        if ((s == null ? void 0 : s.type) !== "tool-result")
          continue;
        const a = n.get(s.toolCallId);
        if (!a)
          continue;
        const l = s.output ?? s.result;
        a.result = l && typeof l == "object" && "type" in l && "value" in l ? l.value : l;
      }
  return i(), e;
}
async function* X3(t, e) {
  const n = new EventSource(t, { withCredentials: !0 }), r = [];
  let i = null, o = !1;
  const s = () => {
    i == null || i(), i = null;
  };
  n.addEventListener("openharness", (l) => {
    try {
      r.push(JSON.parse(l.data));
    } catch {
    }
    s();
  }), n.onerror = () => {
    n.readyState === EventSource.CLOSED && (o = !0, s());
  };
  const a = () => {
    o = !0, s();
  };
  e == null || e.addEventListener("abort", a);
  try {
    for (; ; ) {
      for (; r.length; ) {
        const l = r.shift();
        if (yield l, l.type === "done" || l.type === "error")
          return;
      }
      if (o || e != null && e.aborted)
        return;
      await new Promise((l) => {
        i = l;
      });
    }
  } finally {
    e == null || e.removeEventListener("abort", a), n.close();
  }
}
function Z3({ onUsage: t, onRunEnd: e }) {
  return {
    async *run({ messages: n, abortSignal: r }) {
      const i = n[n.length - 1];
      if (!i || i.role !== "user")
        throw new Error("Nothing to send.");
      const o = i.content.filter((m) => m.type === "text").map((m) => m.text).join(`

`), s = new FormData();
      s.append("message", o);
      for (const m of i.attachments ?? []) {
        const g = m.file;
        g && s.append("files", g, m.name);
      }
      const a = await fetch(`${xt()}/api/openharness/runs`, {
        method: "POST",
        body: s,
        credentials: "same-origin",
        headers: { Accept: "application/json", ...ui() },
        signal: r
      });
      if (!a.ok)
        throw new Error(await Dt(a));
      const { stream: l } = await a.json(), c = [], d = /* @__PURE__ */ new Map();
      let u = null, h = null;
      const p = () => ({ content: c.map((m) => ({ ...m })) });
      try {
        for await (const m of X3(l, r))
          switch (m.type) {
            case "text.delta": {
              u || (u = { type: "text", text: "" }, c.push(u), h = null), u.text += m.text ?? "", yield p();
              break;
            }
            case "text.done":
              u = null;
              break;
            case "reasoning.delta": {
              h || (h = { type: "reasoning", text: "" }, c.push(h), u = null), h.text += m.text ?? "", yield p();
              break;
            }
            case "reasoning.done":
              h = null;
              break;
            case "tool.start": {
              const g = {
                type: "tool-call",
                toolCallId: m.toolCallId,
                toolName: m.toolName,
                args: m.input ?? {},
                argsText: JSON.stringify(m.input ?? {}, null, 2)
              };
              d.set(m.toolCallId, g), c.push(g), u = null, h = null, yield p();
              break;
            }
            case "tool.done": {
              const g = d.get(m.toolCallId);
              g && (g.result = m.output, yield p());
              break;
            }
            case "tool.error": {
              const g = d.get(m.toolCallId);
              g && (g.result = m.error ?? "Tool call failed", g.isError = !0, yield p());
              break;
            }
            case "step.done":
            case "turn.done": {
              m.usage && (t == null || t(m.usage));
              break;
            }
            case "error":
              throw new Error(typeof m.error == "string" ? m.error : "Agent run failed");
            case "done":
              return;
            default:
              break;
          }
      } finally {
        e == null || e();
      }
    }
  };
}
function eM(t) {
  return new Promise((e, n) => {
    const r = new FileReader();
    r.onload = () => e(r.result), r.onerror = () => n(r.error ?? new Error("Failed to read file")), r.readAsDataURL(t);
  });
}
class tM {
  constructor(e) {
    this.getMeta = e;
  }
  get accept() {
    return "*";
  }
  async add({ file: e }) {
    var r;
    const n = ((r = this.getMeta()) == null ? void 0 : r.maxFileSize) ?? 8388608;
    if (e.size > n)
      throw new Error(`File is too large (max ${Math.round(n / 1024 / 1024)}MB)`);
    return {
      id: crypto.randomUUID(),
      type: e.type.startsWith("image/") ? "image" : "document",
      name: e.name,
      contentType: e.type || "application/octet-stream",
      file: e,
      status: { type: "requires-action", reason: "composer-send" }
    };
  }
  async send(e) {
    const n = e.type === "image" ? [{ type: "image", image: await eM(e.file) }] : [];
    return { ...e, status: { type: "complete" }, content: n };
  }
  async remove() {
  }
}
const nM = `/*! tailwindcss v4.3.2 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-pan-x:initial;--tw-pan-y:initial;--tw-pinch-zoom:initial;--tw-space-y-reverse:0;--tw-space-x-reverse:0;--tw-divide-x-reverse:0;--tw-border-style:solid;--tw-divide-y-reverse:0;--tw-leading:initial;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-ease:initial;--tw-animation-delay:0s;--tw-animation-direction:normal;--tw-animation-duration:initial;--tw-animation-fill-mode:none;--tw-animation-iteration-count:1;--tw-enter-blur:0;--tw-enter-opacity:1;--tw-enter-rotate:0;--tw-enter-scale:1;--tw-enter-translate-x:0;--tw-enter-translate-y:0;--tw-exit-blur:0;--tw-exit-opacity:1;--tw-exit-rotate:0;--tw-exit-scale:1;--tw-exit-translate-x:0;--tw-exit-translate-y:0}}}@layer theme{:root,:host{--font-sans:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;--color-red-200:oklch(88.5% .062 18.334);--color-red-500:oklch(63.7% .237 25.331);--color-red-600:oklch(57.7% .245 27.325);--color-orange-500:oklch(70.5% .213 47.604);--color-amber-400:oklch(82.8% .189 84.429);--color-amber-500:oklch(76.9% .188 70.08);--color-amber-600:oklch(66.6% .179 58.318);--color-green-100:oklch(96.2% .044 156.743);--color-green-200:oklch(92.5% .084 155.995);--color-green-400:oklch(79.2% .209 151.711);--color-green-500:oklch(72.3% .219 149.579);--color-green-600:oklch(62.7% .194 149.214);--color-green-700:oklch(52.7% .154 150.069);--color-emerald-400:oklch(76.5% .177 163.223);--color-emerald-600:oklch(59.6% .145 163.225);--color-blue-100:oklch(93.2% .032 255.585);--color-blue-500:oklch(62.3% .214 259.815);--color-blue-600:oklch(54.6% .245 262.881);--color-blue-700:oklch(48.8% .243 264.376);--color-blue-800:oklch(42.4% .199 265.638);--color-blue-950:oklch(28.2% .091 267.935);--color-indigo-500:oklch(58.5% .233 277.117);--color-indigo-600:oklch(51.1% .262 276.966);--color-gray-50:oklch(98.5% .002 247.839);--color-gray-100:oklch(96.7% .003 264.542);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-300:oklch(87.2% .01 258.338);--color-gray-400:oklch(70.7% .022 261.325);--color-gray-500:oklch(55.1% .027 264.364);--color-gray-600:oklch(44.6% .03 256.802);--color-gray-700:oklch(37.3% .034 259.733);--color-gray-800:oklch(27.8% .033 256.848);--color-gray-900:oklch(21% .034 264.665);--color-black:#000;--color-white:#fff;--spacing:.25rem;--breakpoint-md:48rem;--container-xs:20rem;--container-sm:24rem;--container-md:28rem;--container-2xl:42rem;--container-3xl:48rem;--container-4xl:56rem;--container-5xl:64rem;--container-6xl:72rem;--container-7xl:80rem;--text-xs:.75rem;--text-xs--line-height:calc(1 / .75);--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-base:1rem;--text-base--line-height:1.5;--text-lg:1.125rem;--text-lg--line-height:calc(1.75 / 1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75 / 1.25);--text-2xl:1.5rem;--text-2xl--line-height:calc(2 / 1.5);--text-3xl:1.875rem;--text-3xl--line-height:1.2;--text-4xl:2.25rem;--text-4xl--line-height:calc(2.5 / 2.25);--font-weight-light:300;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--tracking-tight:-.025em;--tracking-normal:0em;--tracking-wide:.025em;--leading-tight:1.25;--leading-snug:1.375;--leading-normal:1.5;--leading-relaxed:1.625;--radius-xs:.125rem;--radius-xl:calc(var(--radius) + 4px);--radius-2xl:1rem;--shadow-xs:0 1px 2px 0 #0000000d;--ease-in:cubic-bezier(.4, 0, 1, 1);--ease-out:cubic-bezier(0, 0, .2, 1);--ease-in-out:cubic-bezier(.4, 0, .2, 1);--animate-spin:spin 1s linear infinite;--animate-pulse:pulse 2s cubic-bezier(.4, 0, .6, 1) infinite;--blur-xs:4px;--aspect-video:16 / 9;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4, 0, .2, 1);--color-background:var(--background);--color-muted:var(--muted);--color-border:var(--border)}}.\\@container{container-type:inline-size}.pointer-events-auto{pointer-events:auto}.pointer-events-none{pointer-events:none}.collapse{visibility:collapse}.invisible{visibility:hidden}.visible{visibility:visible}.sr-only{clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.not-sr-only{clip-path:none;white-space:normal;width:auto;height:auto;margin:0;padding:0;position:static;overflow:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.sticky{position:sticky}.inset-0{top:0;right:0;bottom:0;left:0}.inset-x-0{inset-inline:0}.inset-x-2{inset-inline:calc(var(--spacing) * 2)}.inset-y-0{inset-block:0}.end-1{inset-inline-end:calc(var(--spacing) * 1)}.end-1\\.5{inset-inline-end:calc(var(--spacing) * 1.5)}.-top-1{top:calc(var(--spacing) * -1)}.-top-2{top:calc(var(--spacing) * -2)}.-top-12{top:calc(var(--spacing) * -12)}.top-0{top:0}.top-1{top:var(--spacing)}.top-1\\.5{top:calc(var(--spacing) * 1.5)}.top-1\\/2{top:50%}.top-2{top:calc(var(--spacing) * 2)}.top-4{top:calc(var(--spacing) * 4)}.top-6{top:calc(var(--spacing) * 6)}.top-full{top:100%}.-right-1{right:calc(var(--spacing) * -1)}.right-0{right:0}.right-1{right:var(--spacing)}.right-2{right:calc(var(--spacing) * 2)}.right-3{right:calc(var(--spacing) * 3)}.right-4{right:calc(var(--spacing) * 4)}.right-5{right:calc(var(--spacing) * 5)}.right-6{right:calc(var(--spacing) * 6)}.bottom-0{bottom:0}.bottom-\\[calc\\(var\\(--sab\\)\\+4\\.5rem\\)\\]{bottom:calc(var(--sab) + 4.5rem)}.bottom-full{bottom:100%}.left-0{left:0}.left-1{left:var(--spacing)}.left-1\\/2{left:50%}.left-2{left:calc(var(--spacing) * 2)}.left-3{left:calc(var(--spacing) * 3)}.left-\\[-4px\\]{left:-4px}.isolate{isolation:isolate}.isolation-auto{isolation:auto}.z-0{z-index:0}.z-10{z-index:10}.z-20{z-index:20}.z-30{z-index:30}.z-40{z-index:40}.z-50{z-index:50}.z-\\[1000\\]{z-index:1000}.z-\\[1010\\]{z-index:1010}.z-\\[1200\\]{z-index:1200}.col-span-1{grid-column:span 1/span 1}.col-span-2{grid-column:span 2/span 2}.col-span-3{grid-column:span 3/span 3}.col-span-full{grid-column:1/-1}.col-start-1{grid-column-start:1}.col-start-2{grid-column-start:2}.row-span-1{grid-row:span 1/span 1}.row-span-2{grid-row:span 2/span 2}.row-span-3{grid-row:span 3/span 3}.row-start-1{grid-row-start:1}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.m-0{margin:0}.m-5{margin:calc(var(--spacing) * 5)}.m-26{margin:calc(var(--spacing) * 26)}.m-26\\.25{margin:calc(var(--spacing) * 26.25)}.m-31{margin:calc(var(--spacing) * 31)}.m-31\\.5{margin:calc(var(--spacing) * 31.5)}.m-90{margin:calc(var(--spacing) * 90)}.m-1743{margin:calc(var(--spacing) * 1743)}.m-2205{margin:calc(var(--spacing) * 2205)}.mx-1{margin-inline:var(--spacing)}.mx-4{margin-inline:calc(var(--spacing) * 4)}.mx-auto{margin-inline:auto}.my-3{margin-block:calc(var(--spacing) * 3)}.my-8{margin-block:calc(var(--spacing) * 8)}.-ms-1{margin-inline-start:calc(var(--spacing) * -1)}.ms-2{margin-inline-start:calc(var(--spacing) * 2)}.ms-5{margin-inline-start:calc(var(--spacing) * 5)}.ms-auto{margin-inline-start:auto}.mt-0{margin-top:0}.mt-0\\.5{margin-top:calc(var(--spacing) * .5)}.mt-1{margin-top:var(--spacing)}.mt-1\\.5{margin-top:calc(var(--spacing) * 1.5)}.mt-2{margin-top:calc(var(--spacing) * 2)}.mt-3{margin-top:calc(var(--spacing) * 3)}.mt-3\\.5{margin-top:calc(var(--spacing) * 3.5)}.mt-4{margin-top:calc(var(--spacing) * 4)}.mt-5{margin-top:calc(var(--spacing) * 5)}.mt-6{margin-top:calc(var(--spacing) * 6)}.mt-8{margin-top:calc(var(--spacing) * 8)}.mt-12{margin-top:calc(var(--spacing) * 12)}.mt-auto{margin-top:auto}.mr-1{margin-right:var(--spacing)}.mr-2{margin-right:calc(var(--spacing) * 2)}.mr-3{margin-right:calc(var(--spacing) * 3)}.mr-4{margin-right:calc(var(--spacing) * 4)}.mr-9{margin-right:calc(var(--spacing) * 9)}.mr-auto{margin-right:auto}.-mb-7{margin-bottom:calc(var(--spacing) * -7)}.-mb-7\\.5{margin-bottom:calc(var(--spacing) * -7.5)}.mb-0{margin-bottom:0}.mb-0\\.5{margin-bottom:calc(var(--spacing) * .5)}.mb-1{margin-bottom:var(--spacing)}.mb-1\\.5{margin-bottom:calc(var(--spacing) * 1.5)}.mb-2{margin-bottom:calc(var(--spacing) * 2)}.mb-3{margin-bottom:calc(var(--spacing) * 3)}.mb-4{margin-bottom:calc(var(--spacing) * 4)}.mb-5{margin-bottom:calc(var(--spacing) * 5)}.mb-6{margin-bottom:calc(var(--spacing) * 6)}.mb-8{margin-bottom:calc(var(--spacing) * 8)}.mb-10{margin-bottom:calc(var(--spacing) * 10)}.mb-12{margin-bottom:calc(var(--spacing) * 12)}.mb-14{margin-bottom:calc(var(--spacing) * 14)}.ml-1{margin-left:var(--spacing)}.ml-2{margin-left:calc(var(--spacing) * 2)}.ml-4{margin-left:calc(var(--spacing) * 4)}.ml-auto{margin-left:auto}.box-border{box-sizing:border-box}.line-clamp-2{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.line-clamp-3{-webkit-line-clamp:3;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.line-clamp-6{-webkit-line-clamp:6;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.\\!hidden{display:none!important}.block{display:block}.contents{display:contents}.flex{display:flex}.flow-root{display:flow-root}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.inline-grid{display:inline-grid}.inline-table{display:inline-table}.list-item{display:list-item}.table{display:table}.table-caption{display:table-caption}.table-cell{display:table-cell}.table-column{display:table-column}.table-column-group{display:table-column-group}.table-footer-group{display:table-footer-group}.table-header-group{display:table-header-group}.table-row{display:table-row}.table-row-group{display:table-row-group}.aspect-\\[4\\/3\\]{aspect-ratio:4/3}.aspect-square{aspect-ratio:1}.size-2{width:calc(var(--spacing) * 2);height:calc(var(--spacing) * 2)}.size-3{width:calc(var(--spacing) * 3);height:calc(var(--spacing) * 3)}.size-3\\.5{width:calc(var(--spacing) * 3.5);height:calc(var(--spacing) * 3.5)}.size-4{width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}.size-4\\.5{width:calc(var(--spacing) * 4.5);height:calc(var(--spacing) * 4.5)}.size-5{width:calc(var(--spacing) * 5);height:calc(var(--spacing) * 5)}.size-6{width:calc(var(--spacing) * 6);height:calc(var(--spacing) * 6)}.size-7{width:calc(var(--spacing) * 7);height:calc(var(--spacing) * 7)}.size-8{width:calc(var(--spacing) * 8);height:calc(var(--spacing) * 8)}.size-9{width:calc(var(--spacing) * 9);height:calc(var(--spacing) * 9)}.size-10{width:calc(var(--spacing) * 10);height:calc(var(--spacing) * 10)}.size-14{width:calc(var(--spacing) * 14);height:calc(var(--spacing) * 14)}.\\!h-4{height:calc(var(--spacing) * 4)!important}.h-0{height:0}.h-1{height:var(--spacing)}.h-1\\.5{height:calc(var(--spacing) * 1.5)}.h-2{height:calc(var(--spacing) * 2)}.h-2\\.5{height:calc(var(--spacing) * 2.5)}.h-3{height:calc(var(--spacing) * 3)}.h-3\\.5{height:calc(var(--spacing) * 3.5)}.h-4{height:calc(var(--spacing) * 4)}.h-5{height:calc(var(--spacing) * 5)}.h-6{height:calc(var(--spacing) * 6)}.h-8{height:calc(var(--spacing) * 8)}.h-9{height:calc(var(--spacing) * 9)}.h-10{height:calc(var(--spacing) * 10)}.h-11{height:calc(var(--spacing) * 11)}.h-12{height:calc(var(--spacing) * 12)}.h-14{height:calc(var(--spacing) * 14)}.h-16{height:calc(var(--spacing) * 16)}.h-20{height:calc(var(--spacing) * 20)}.h-28{height:calc(var(--spacing) * 28)}.h-30{height:calc(var(--spacing) * 30)}.h-56{height:calc(var(--spacing) * 56)}.h-\\[1\\.125rem\\]{height:1.125rem}.h-\\[2\\.375rem\\]{height:2.375rem}.h-\\[2\\.1875rem\\]{height:2.1875rem}.h-\\[20px\\]{height:20px}.h-\\[38px\\]{height:38px}.h-\\[75vh\\]{height:75vh}.h-\\[calc\\(100\\%_-_96px\\)\\]{height:calc(100% - 96px)}.h-auto{height:auto}.h-full{height:100%}.h-screen{height:100vh}.max-h-32{max-height:calc(var(--spacing) * 32)}.max-h-48{max-height:calc(var(--spacing) * 48)}.max-h-64{max-height:calc(var(--spacing) * 64)}.max-h-72{max-height:calc(var(--spacing) * 72)}.max-h-80{max-height:calc(var(--spacing) * 80)}.max-h-\\[80dvh\\]{max-height:80dvh}.max-h-\\[80vh\\]{max-height:80vh}.max-h-\\[85vh\\]{max-height:85vh}.min-h-0{min-height:0}.min-h-7{min-height:calc(var(--spacing) * 7)}.min-h-7\\.5{min-height:calc(var(--spacing) * 7.5)}.min-h-10{min-height:calc(var(--spacing) * 10)}.min-h-\\[2\\.625rem\\]{min-height:2.625rem}.min-h-\\[2rem\\]{min-height:2rem}.min-h-\\[4\\.25rem\\]{min-height:4.25rem}.min-h-\\[40px\\]{min-height:40px}.min-h-\\[300px\\]{min-height:300px}.min-h-\\[calc\\(100vh-7rem\\)\\]{min-height:calc(100vh - 7rem)}.min-h-screen{min-height:100vh}.\\!w-4{width:calc(var(--spacing) * 4)!important}.w-1{width:var(--spacing)}.w-1\\.5{width:calc(var(--spacing) * 1.5)}.w-2{width:calc(var(--spacing) * 2)}.w-3{width:calc(var(--spacing) * 3)}.w-3\\.5{width:calc(var(--spacing) * 3.5)}.w-3\\/4{width:75%}.w-4{width:calc(var(--spacing) * 4)}.w-5{width:calc(var(--spacing) * 5)}.w-6{width:calc(var(--spacing) * 6)}.w-7{width:calc(var(--spacing) * 7)}.w-8{width:calc(var(--spacing) * 8)}.w-9{width:calc(var(--spacing) * 9)}.w-10{width:calc(var(--spacing) * 10)}.w-12{width:calc(var(--spacing) * 12)}.w-14{width:calc(var(--spacing) * 14)}.w-16{width:calc(var(--spacing) * 16)}.w-20{width:calc(var(--spacing) * 20)}.w-24{width:calc(var(--spacing) * 24)}.w-40{width:calc(var(--spacing) * 40)}.w-48{width:calc(var(--spacing) * 48)}.w-64{width:calc(var(--spacing) * 64)}.w-72{width:calc(var(--spacing) * 72)}.w-80{width:calc(var(--spacing) * 80)}.w-\\[2\\.375rem\\]{width:2.375rem}.w-\\[35\\%\\]{width:35%}.w-auto{width:auto}.w-fit{width:fit-content}.w-full{width:100%}.w-max{width:max-content}.max-w-\\(--thread-max-width\\){max-width:var(--thread-max-width)}.max-w-2xl{max-width:var(--container-2xl)}.max-w-3xl{max-width:var(--container-3xl)}.max-w-4xl{max-width:var(--container-4xl)}.max-w-5xl{max-width:var(--container-5xl)}.max-w-6xl{max-width:var(--container-6xl)}.max-w-7xl{max-width:var(--container-7xl)}.max-w-40{max-width:calc(var(--spacing) * 40)}.max-w-64{max-width:calc(var(--spacing) * 64)}.max-w-\\[60ch\\]{max-width:60ch}.max-w-\\[72ch\\]{max-width:72ch}.max-w-\\[75\\%\\]{max-width:75%}.max-w-\\[150px\\]{max-width:150px}.max-w-\\[180px\\]{max-width:180px}.max-w-\\[280px\\]{max-width:280px}.max-w-\\[310px\\]{max-width:310px}.max-w-\\[1600px\\]{max-width:1600px}.max-w-full{max-width:100%}.max-w-md{max-width:var(--container-md)}.max-w-screen-md{max-width:var(--breakpoint-md)}.max-w-sm{max-width:var(--container-sm)}.max-w-xs{max-width:var(--container-xs)}.min-w-0{min-width:0}.min-w-5{min-width:calc(var(--spacing) * 5)}.min-w-6{min-width:calc(var(--spacing) * 6)}.min-w-8{min-width:calc(var(--spacing) * 8)}.min-w-14{min-width:calc(var(--spacing) * 14)}.min-w-36{min-width:calc(var(--spacing) * 36)}.min-w-48{min-width:calc(var(--spacing) * 48)}.min-w-64{min-width:calc(var(--spacing) * 64)}.min-w-72{min-width:calc(var(--spacing) * 72)}.min-w-\\[1\\.125rem\\]{min-width:1.125rem}.min-w-\\[2rem\\]{min-width:2rem}.min-w-\\[6\\.5rem\\]{min-width:6.5rem}.min-w-\\[6\\.875rem\\]{min-width:6.875rem}.min-w-\\[64px\\]{min-width:64px}.min-w-\\[140px\\]{min-width:140px}.min-w-\\[150px\\]{min-width:150px}.min-w-full{min-width:100%}.flex-1{flex:1}.flex-shrink{flex-shrink:1}.flex-shrink-0{flex-shrink:0}.shrink{flex-shrink:1}.shrink-0{flex-shrink:0}.flex-grow{flex-grow:1}.flex-grow-0{flex-grow:0}.grow{flex-grow:1}.basis-\\[80\\%\\]{flex-basis:80%}.basis-\\[88\\%\\]{flex-basis:88%}.basis-\\[140px\\]{flex-basis:140px}.basis-\\[160px\\]{flex-basis:160px}.basis-auto{flex-basis:auto}.basis-full{flex-basis:100%}.border-collapse{border-collapse:collapse}.border-separate{border-collapse:separate}.border-spacing-0{--tw-border-spacing-x:0;--tw-border-spacing-y:0;border-spacing:var(--tw-border-spacing-x) var(--tw-border-spacing-y)}.origin-left{transform-origin:0}.-translate-x-1{--tw-translate-x:calc(var(--spacing) * -1);translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-x-1\\/2{--tw-translate-x:-50%;translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-x-16{--tw-translate-x:calc(var(--spacing) * -16);translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-x-0{--tw-translate-x:0;translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-x-full{--tw-translate-x:100%;translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-y-1{--tw-translate-y:calc(var(--spacing) * -1);translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y:-50%;translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-none{translate:none}.scale-3d{scale:var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z)}.-rotate-90{rotate:-90deg}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.animate-in{animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.animate-pulse{animation:var(--animate-pulse)}.animate-spin{animation:var(--animate-spin)}.cursor-col-resize{cursor:col-resize}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.cursor-pointer{cursor:pointer}.touch-pinch-zoom{--tw-pinch-zoom:pinch-zoom;touch-action:var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)}.resize{resize:both}.resize-none{resize:none}.scroll-m-20{scroll-margin:calc(var(--spacing) * 20)}.list-inside{list-style-position:inside}.list-decimal{list-style-type:decimal}.list-disc{list-style-type:disc}.list-none{list-style-type:none}.auto-rows-auto{grid-auto-rows:auto}.auto-rows-fr{grid-auto-rows:minmax(0,1fr)}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-\\[252px_8px_1fr\\]{grid-template-columns:252px 8px 1fr}.grid-cols-\\[minmax\\(72px\\,1fr\\)_auto\\]{grid-template-columns:minmax(72px,1fr) auto}.flex-col{flex-direction:column}.flex-row{flex-direction:row}.flex-wrap{flex-wrap:wrap}.content-start{align-content:flex-start}.items-baseline{align-items:baseline}.items-center{align-items:center}.items-end{align-items:flex-end}.items-start{align-items:flex-start}.items-stretch{align-items:stretch}.justify-around{justify-content:space-around}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-start{justify-content:flex-start}.gap-0{gap:0}.gap-0\\.5{gap:calc(var(--spacing) * .5)}.gap-1{gap:var(--spacing)}.gap-1\\.5{gap:calc(var(--spacing) * 1.5)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-2\\.5{gap:calc(var(--spacing) * 2.5)}.gap-3{gap:calc(var(--spacing) * 3)}.gap-4{gap:calc(var(--spacing) * 4)}.gap-5{gap:calc(var(--spacing) * 5)}.gap-6{gap:calc(var(--spacing) * 6)}.gap-8{gap:calc(var(--spacing) * 8)}.gap-10{gap:calc(var(--spacing) * 10)}.gap-12{gap:calc(var(--spacing) * 12)}:where(.space-y-0>:not(:last-child)){--tw-space-y-reverse:0;margin-block:0}:where(.space-y-1>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(var(--spacing) * var(--tw-space-y-reverse));margin-block-end:calc(var(--spacing) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2\\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 2.5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 2.5) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-3>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 5) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-6>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-8>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 8) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 8) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-reverse>:not(:last-child)){--tw-space-y-reverse:1}.gap-x-2{column-gap:calc(var(--spacing) * 2)}.gap-x-3{column-gap:calc(var(--spacing) * 3)}.gap-x-4{column-gap:calc(var(--spacing) * 4)}.gap-x-5{column-gap:calc(var(--spacing) * 5)}.gap-x-6{column-gap:calc(var(--spacing) * 6)}:where(.space-x-1>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(var(--spacing) * var(--tw-space-x-reverse));margin-inline-end:calc(var(--spacing) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-2>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 2) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-3>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 3) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-4>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 4) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-6>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 6) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-reverse>:not(:last-child)){--tw-space-x-reverse:1}.gap-y-1{row-gap:var(--spacing)}.gap-y-2{row-gap:calc(var(--spacing) * 2)}.gap-y-3{row-gap:calc(var(--spacing) * 3)}.gap-y-6{row-gap:calc(var(--spacing) * 6)}.gap-y-8{row-gap:calc(var(--spacing) * 8)}:where(.divide-x>:not(:last-child)){--tw-divide-x-reverse:0;border-inline-style:var(--tw-border-style);border-inline-start-width:calc(1px * var(--tw-divide-x-reverse));border-inline-end-width:calc(1px * calc(1 - var(--tw-divide-x-reverse)))}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px * var(--tw-divide-y-reverse));border-bottom-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-y-reverse>:not(:last-child)){--tw-divide-y-reverse:1}:where(.divide-border>:not(:last-child)){border-color:var(--border)}.self-center{align-self:center}.self-stretch{align-self:stretch}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-visible{overflow:visible}.overflow-x-auto{overflow-x:auto}.overflow-y-auto{overflow-y:auto}.overflow-y-scroll{overflow-y:scroll}.scroll-smooth{scroll-behavior:smooth}.rounded{border-radius:.25rem}.rounded-\\(--composer-radius\\){border-radius:var(--composer-radius)}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-\\[0\\.625rem\\]{border-radius:.625rem}.rounded-\\[calc\\(var\\(--border-radius\\)-2px\\)\\]{border-radius:calc(var(--border-radius) - 2px)}.rounded-\\[var\\(--border-radius\\)\\]{border-radius:var(--border-radius)}.rounded-\\[var\\(--border-radius\\,0\\.625rem\\)\\]{border-radius:var(--border-radius,.625rem)}.rounded-\\[var\\(--border-radius\\,0\\.875rem\\)\\]{border-radius:var(--border-radius,.875rem)}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius)}.rounded-md{border-radius:calc(var(--radius) - 2px)}.rounded-none{border-radius:0}.rounded-xl{border-radius:calc(var(--radius) + 4px)}.rounded-s{border-start-start-radius:.25rem;border-end-start-radius:.25rem}.rounded-ss{border-start-start-radius:.25rem}.rounded-e{border-start-end-radius:.25rem;border-end-end-radius:.25rem}.rounded-se{border-start-end-radius:.25rem}.rounded-ee{border-end-end-radius:.25rem}.rounded-es{border-end-start-radius:.25rem}.rounded-t{border-top-left-radius:.25rem;border-top-right-radius:.25rem}.rounded-t-\\(--composer-radius\\){border-top-left-radius:var(--composer-radius);border-top-right-radius:var(--composer-radius)}.rounded-t-lg{border-top-left-radius:var(--radius);border-top-right-radius:var(--radius)}.rounded-t-none{border-top-left-radius:0;border-top-right-radius:0}.rounded-t-xl{border-top-left-radius:calc(var(--radius) + 4px);border-top-right-radius:calc(var(--radius) + 4px)}.rounded-l{border-top-left-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-l-\\[var\\(--border-radius\\)\\]{border-top-left-radius:var(--border-radius);border-bottom-left-radius:var(--border-radius)}.rounded-l-none{border-top-left-radius:0;border-bottom-left-radius:0}.rounded-tl{border-top-left-radius:.25rem}.rounded-r{border-top-right-radius:.25rem;border-bottom-right-radius:.25rem}.rounded-r-\\[var\\(--border-radius\\)\\]{border-top-right-radius:var(--border-radius);border-bottom-right-radius:var(--border-radius)}.rounded-r-none{border-top-right-radius:0;border-bottom-right-radius:0}.rounded-tr{border-top-right-radius:.25rem}.rounded-b{border-bottom-right-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-b-xl{border-bottom-right-radius:calc(var(--radius) + 4px);border-bottom-left-radius:calc(var(--radius) + 4px)}.rounded-br{border-bottom-right-radius:.25rem}.rounded-bl{border-bottom-left-radius:.25rem}.border{border-style:var(--tw-border-style);border-width:1px}.border-0{border-style:var(--tw-border-style);border-width:0}.border-2{border-style:var(--tw-border-style);border-width:2px}.border-\\[3px\\]{border-style:var(--tw-border-style);border-width:3px}.border-x{border-inline-style:var(--tw-border-style);border-inline-width:1px}.border-y{border-block-style:var(--tw-border-style);border-block-width:1px}.border-s{border-inline-start-style:var(--tw-border-style);border-inline-start-width:1px}.border-s-2{border-inline-start-style:var(--tw-border-style);border-inline-start-width:2px}.border-e{border-inline-end-style:var(--tw-border-style);border-inline-end-width:1px}.border-bs{border-block-start-style:var(--tw-border-style);border-block-start-width:1px}.border-be{border-block-end-style:var(--tw-border-style);border-block-end-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-t-0{border-top-style:var(--tw-border-style);border-top-width:0}.border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-b-0{border-bottom-style:var(--tw-border-style);border-bottom-width:0}.border-b-2{border-bottom-style:var(--tw-border-style);border-bottom-width:2px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-l-2{border-left-style:var(--tw-border-style);border-left-width:2px}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-none{--tw-border-style:none;border-style:none}.border-solid{--tw-border-style:solid;border-style:solid}.border-\\[var\\(--border\\)\\]{border-color:var(--border)}.border-\\[var\\(--bottom-nav-border\\)\\]{border-color:var(--bottom-nav-border)}.border-\\[var\\(--secondary-color\\)\\]{border-color:var(--secondary-color)}.border-amber-500{border-color:var(--color-amber-500)}.border-amber-500\\/40{border-color:#f99c0066}@supports (color:color-mix(in lab,red,red)){.border-amber-500\\/40{border-color:color-mix(in oklab,var(--color-amber-500) 40%,transparent)}}.border-black{border-color:var(--color-black)}.border-black\\/10{border-color:#0000001a}@supports (color:color-mix(in lab,red,red)){.border-black\\/10{border-color:color-mix(in oklab,var(--color-black) 10%,transparent)}}.border-black\\/15{border-color:#00000026}@supports (color:color-mix(in lab,red,red)){.border-black\\/15{border-color:color-mix(in oklab,var(--color-black) 15%,transparent)}}.border-black\\/\\[\\.08\\]{border-color:#00000014}@supports (color:color-mix(in lab,red,red)){.border-black\\/\\[\\.08\\]{border-color:color-mix(in oklab,var(--color-black) 8%,transparent)}}.border-border,.border-border\\/50{border-color:var(--border)}@supports (color:color-mix(in lab,red,red)){.border-border\\/50{border-color:color-mix(in oklab,var(--border) 50%,transparent)}}.border-border\\/60{border-color:var(--border)}@supports (color:color-mix(in lab,red,red)){.border-border\\/60{border-color:color-mix(in oklab,var(--border) 60%,transparent)}}.border-current{border-color:currentColor}.border-destructive,.border-destructive\\/20{border-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.border-destructive\\/20{border-color:color-mix(in oklab,var(--destructive) 20%,transparent)}}.border-destructive\\/30{border-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.border-destructive\\/30{border-color:color-mix(in oklab,var(--destructive) 30%,transparent)}}.border-destructive\\/40{border-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.border-destructive\\/40{border-color:color-mix(in oklab,var(--destructive) 40%,transparent)}}.border-gray-200{border-color:var(--color-gray-200)}.border-gray-300{border-color:var(--color-gray-300)}.border-gray-400{border-color:var(--color-gray-400)}.border-gray-600{border-color:var(--color-gray-600)}.border-green-500{border-color:var(--color-green-500)}.border-green-500\\/30{border-color:#00c7584d}@supports (color:color-mix(in lab,red,red)){.border-green-500\\/30{border-color:color-mix(in oklab,var(--color-green-500) 30%,transparent)}}.border-input{border-color:var(--input)}.border-muted-foreground,.border-muted-foreground\\/20{border-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.border-muted-foreground\\/20{border-color:color-mix(in oklab,var(--muted-foreground) 20%,transparent)}}.border-muted-foreground\\/30{border-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.border-muted-foreground\\/30{border-color:color-mix(in oklab,var(--muted-foreground) 30%,transparent)}}.border-primary{border-color:var(--primary)}.border-red-500{border-color:var(--color-red-500)}.border-ring{border-color:var(--ring)}.border-white{border-color:var(--color-white)}.border-white\\/15{border-color:#ffffff26}@supports (color:color-mix(in lab,red,red)){.border-white\\/15{border-color:color-mix(in oklab,var(--color-white) 15%,transparent)}}.border-t-\\[var\\(--secondary-color\\)\\]{border-top-color:var(--secondary-color)}.border-t-transparent{border-top-color:#0000}.border-l-primary{border-left-color:var(--primary)}.\\!bg-transparent{background-color:#0000!important}.bg-\\(--composer-bg\\){background-color:var(--composer-bg)}.bg-\\[\\#E07A5F\\]{background-color:#e07a5f}.bg-\\[\\#d9043d\\]{background-color:#d9043d}.bg-\\[var\\(--bottom-nav-bg\\)\\]{background-color:var(--bottom-nav-bg)}.bg-\\[var\\(--counter-background\\)\\]{background-color:var(--counter-background)}.bg-\\[var\\(--primary-color\\)\\]{background-color:var(--primary-color)}.bg-\\[var\\(--primary-color\\,\\#fff\\)\\]{background-color:var(--primary-color,#fff)}.bg-\\[var\\(--secondary-color\\)\\],.bg-\\[var\\(--secondary-color\\)\\]\\/\\[\\.08\\]{background-color:var(--secondary-color)}@supports (color:color-mix(in lab,red,red)){.bg-\\[var\\(--secondary-color\\)\\]\\/\\[\\.08\\]{background-color:color-mix(in oklab,var(--secondary-color) 8%,transparent)}}.bg-accent{background-color:var(--accent)}.bg-amber-500{background-color:var(--color-amber-500)}.bg-background,.bg-background\\/60{background-color:var(--background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/60{background-color:color-mix(in oklab,var(--background) 60%,transparent)}}.bg-background\\/70{background-color:var(--background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/70{background-color:color-mix(in oklab,var(--background) 70%,transparent)}}.bg-black{background-color:var(--color-black)}.bg-black\\/10{background-color:#0000001a}@supports (color:color-mix(in lab,red,red)){.bg-black\\/10{background-color:color-mix(in oklab,var(--color-black) 10%,transparent)}}.bg-black\\/50{background-color:#00000080}@supports (color:color-mix(in lab,red,red)){.bg-black\\/50{background-color:color-mix(in oklab,var(--color-black) 50%,transparent)}}.bg-black\\/\\[\\.03\\]{background-color:#00000008}@supports (color:color-mix(in lab,red,red)){.bg-black\\/\\[\\.03\\]{background-color:color-mix(in oklab,var(--color-black) 3%,transparent)}}.bg-black\\/\\[\\.06\\]{background-color:#0000000f}@supports (color:color-mix(in lab,red,red)){.bg-black\\/\\[\\.06\\]{background-color:color-mix(in oklab,var(--color-black) 6%,transparent)}}.bg-blue-100{background-color:var(--color-blue-100)}.bg-blue-500{background-color:var(--color-blue-500)}.bg-blue-600{background-color:var(--color-blue-600)}.bg-blue-950{background-color:var(--color-blue-950)}.bg-card{background-color:var(--card)}.bg-current{background-color:currentColor}.bg-destructive,.bg-destructive\\/10{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.bg-destructive\\/10{background-color:color-mix(in oklab,var(--destructive) 10%,transparent)}}.bg-gray-50{background-color:var(--color-gray-50)}.bg-gray-100{background-color:var(--color-gray-100)}.bg-gray-200{background-color:var(--color-gray-200)}.bg-gray-300{background-color:var(--color-gray-300)}.bg-gray-600{background-color:var(--color-gray-600)}.bg-gray-800{background-color:var(--color-gray-800)}.bg-green-100{background-color:var(--color-green-100)}.bg-green-200{background-color:var(--color-green-200)}.bg-green-500{background-color:var(--color-green-500)}.bg-green-500\\/10{background-color:#00c7581a}@supports (color:color-mix(in lab,red,red)){.bg-green-500\\/10{background-color:color-mix(in oklab,var(--color-green-500) 10%,transparent)}}.bg-green-600{background-color:var(--color-green-600)}.bg-green-700{background-color:var(--color-green-700)}.bg-indigo-500{background-color:var(--color-indigo-500)}.bg-muted,.bg-muted\\/20{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.bg-muted\\/20{background-color:color-mix(in oklab,var(--muted) 20%,transparent)}}.bg-muted\\/30{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.bg-muted\\/30{background-color:color-mix(in oklab,var(--muted) 30%,transparent)}}.bg-muted\\/50{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.bg-muted\\/50{background-color:color-mix(in oklab,var(--muted) 50%,transparent)}}.bg-popover{background-color:var(--popover)}.bg-primary,.bg-primary\\/5{background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.bg-primary\\/5{background-color:color-mix(in oklab,var(--primary) 5%,transparent)}}.bg-red-500{background-color:var(--color-red-500)}.bg-transparent{background-color:#0000}.bg-white{background-color:var(--color-white)}.bg-white\\/5{background-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){.bg-white\\/5{background-color:color-mix(in oklab,var(--color-white) 5%,transparent)}}.bg-white\\/90{background-color:#ffffffe6}@supports (color:color-mix(in lab,red,red)){.bg-white\\/90{background-color:color-mix(in oklab,var(--color-white) 90%,transparent)}}.bg-\\[linear-gradient\\(to_bottom\\,var\\(--color-background\\)\\,transparent\\)\\]{background-image:linear-gradient(to bottom,var(--color-background),transparent)}.bg-\\[linear-gradient\\(to_top\\,var\\(--color-background\\)\\,transparent\\)\\]{background-image:linear-gradient(to top,var(--color-background),transparent)}.bg-repeat{background-repeat:repeat}.mask-no-clip{-webkit-mask-clip:no-clip;mask-clip:no-clip}.mask-repeat{-webkit-mask-repeat:repeat;mask-repeat:repeat}.\\!fill-\\[var\\(--primary-text-color\\)\\]{fill:var(--primary-text-color)!important}.\\!fill-\\[var\\(--secondary-text-color\\)\\]{fill:var(--secondary-text-color)!important}.fill-\\[var\\(--button-text-color\\)\\]{fill:var(--button-text-color)}.fill-current{fill:currentColor}.stroke-\\[1\\.5px\\]{stroke-width:1.5px}.object-contain{object-fit:contain}.object-cover{object-fit:cover}.p-0{padding:0}.p-0\\.5{padding:calc(var(--spacing) * .5)}.p-1{padding:var(--spacing)}.p-2{padding:calc(var(--spacing) * 2)}.p-2\\.5{padding:calc(var(--spacing) * 2.5)}.p-3{padding:calc(var(--spacing) * 3)}.p-3\\.5{padding:calc(var(--spacing) * 3.5)}.p-4{padding:calc(var(--spacing) * 4)}.p-5{padding:calc(var(--spacing) * 5)}.p-6{padding:calc(var(--spacing) * 6)}.p-8{padding:calc(var(--spacing) * 8)}.p-10{padding:calc(var(--spacing) * 10)}.p-12{padding:calc(var(--spacing) * 12)}.px-1{padding-inline:var(--spacing)}.px-1\\.5{padding-inline:calc(var(--spacing) * 1.5)}.px-2{padding-inline:calc(var(--spacing) * 2)}.px-2\\.5{padding-inline:calc(var(--spacing) * 2.5)}.px-3{padding-inline:calc(var(--spacing) * 3)}.px-3\\.5{padding-inline:calc(var(--spacing) * 3.5)}.px-4{padding-inline:calc(var(--spacing) * 4)}.px-5{padding-inline:calc(var(--spacing) * 5)}.px-6{padding-inline:calc(var(--spacing) * 6)}.py-0{padding-block:0}.py-0\\.5{padding-block:calc(var(--spacing) * .5)}.py-1{padding-block:var(--spacing)}.py-1\\.5{padding-block:calc(var(--spacing) * 1.5)}.py-2{padding-block:calc(var(--spacing) * 2)}.py-2\\.5{padding-block:calc(var(--spacing) * 2.5)}.py-3{padding-block:calc(var(--spacing) * 3)}.py-4{padding-block:calc(var(--spacing) * 4)}.py-5{padding-block:calc(var(--spacing) * 5)}.py-6{padding-block:calc(var(--spacing) * 6)}.py-8{padding-block:calc(var(--spacing) * 8)}.py-10{padding-block:calc(var(--spacing) * 10)}.py-12{padding-block:calc(var(--spacing) * 12)}.py-16{padding-block:calc(var(--spacing) * 16)}.ps-3{padding-inline-start:calc(var(--spacing) * 3)}.ps-4{padding-inline-start:calc(var(--spacing) * 4)}.ps-6{padding-inline-start:calc(var(--spacing) * 6)}.pt-0{padding-top:0}.pt-1{padding-top:var(--spacing)}.pt-1\\.5{padding-top:calc(var(--spacing) * 1.5)}.pt-2{padding-top:calc(var(--spacing) * 2)}.pt-2\\.5{padding-top:calc(var(--spacing) * 2.5)}.pt-4{padding-top:calc(var(--spacing) * 4)}.pt-5{padding-top:calc(var(--spacing) * 5)}.pr-4{padding-right:calc(var(--spacing) * 4)}.pr-5{padding-right:calc(var(--spacing) * 5)}.pr-6{padding-right:calc(var(--spacing) * 6)}.pr-10{padding-right:calc(var(--spacing) * 10)}.pr-11{padding-right:calc(var(--spacing) * 11)}.pr-12{padding-right:calc(var(--spacing) * 12)}.pr-28{padding-right:calc(var(--spacing) * 28)}.pb-0{padding-bottom:0}.pb-2{padding-bottom:calc(var(--spacing) * 2)}.pb-2\\.5{padding-bottom:calc(var(--spacing) * 2.5)}.pb-4{padding-bottom:calc(var(--spacing) * 4)}.pb-5{padding-bottom:calc(var(--spacing) * 5)}.pb-7{padding-bottom:calc(var(--spacing) * 7)}.pb-7\\.5{padding-bottom:calc(var(--spacing) * 7.5)}.pb-8{padding-bottom:calc(var(--spacing) * 8)}.pb-10{padding-bottom:calc(var(--spacing) * 10)}.pb-\\[calc\\(env\\(safe-area-inset-bottom\\,0\\)\\+0\\.5rem\\)\\]{padding-bottom:calc(env(safe-area-inset-bottom,0) + .5rem)}.pb-\\[env\\(safe-area-inset-bottom\\,0\\)\\]{padding-bottom:env(safe-area-inset-bottom,0)}.pb-\\[var\\(--sab\\)\\]{padding-bottom:var(--sab)}.pl-2{padding-left:calc(var(--spacing) * 2)}.pl-4{padding-left:calc(var(--spacing) * 4)}.pl-5{padding-left:calc(var(--spacing) * 5)}.pl-13{padding-left:calc(var(--spacing) * 13)}.text-center{text-align:center}.text-end{text-align:end}.text-left{text-align:left}.text-right{text-align:right}.text-start{text-align:start}.font-mono{font-family:var(--font-mono)}.font-sans{font-family:var(--font-sans)}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-\\[0\\.75rem\\]{font-size:.75rem}.text-\\[0\\.85em\\]{font-size:.85em}.text-\\[0\\.625rem\\]{font-size:.625rem}.text-\\[0\\.8125rem\\]{font-size:.8125rem}.text-\\[0\\.9375rem\\]{font-size:.9375rem}.text-\\[1\\.5rem\\]{font-size:1.5rem}.text-\\[1\\.0625rem\\]{font-size:1.0625rem}.text-\\[10px\\]{font-size:10px}.text-\\[12px\\]{font-size:12px}.text-\\[13px\\]{font-size:13px}.text-\\[33px\\]{font-size:33px}.leading-4{--tw-leading:calc(var(--spacing) * 4);line-height:calc(var(--spacing) * 4)}.leading-5{--tw-leading:calc(var(--spacing) * 5);line-height:calc(var(--spacing) * 5)}.leading-6{--tw-leading:calc(var(--spacing) * 6);line-height:calc(var(--spacing) * 6)}.leading-7{--tw-leading:calc(var(--spacing) * 7);line-height:calc(var(--spacing) * 7)}.leading-\\[1\\.125rem\\]{--tw-leading:1.125rem;line-height:1.125rem}.leading-none{--tw-leading:1;line-height:1}.leading-normal{--tw-leading:var(--leading-normal);line-height:var(--leading-normal)}.leading-relaxed{--tw-leading:var(--leading-relaxed);line-height:var(--leading-relaxed)}.leading-snug{--tw-leading:var(--leading-snug);line-height:var(--leading-snug)}.leading-tight{--tw-leading:var(--leading-tight);line-height:var(--leading-tight)}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-light{--tw-font-weight:var(--font-weight-light);font-weight:var(--font-weight-light)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-normal{--tw-tracking:var(--tracking-normal);letter-spacing:var(--tracking-normal)}.tracking-tight{--tw-tracking:var(--tracking-tight);letter-spacing:var(--tracking-tight)}.tracking-wide{--tw-tracking:var(--tracking-wide);letter-spacing:var(--tracking-wide)}.text-balance{text-wrap:balance}.text-pretty{text-wrap:pretty}.text-wrap{text-wrap:wrap}.break-words,.wrap-break-word{overflow-wrap:break-word}.break-all{word-break:break-all}.text-clip{text-overflow:clip}.text-ellipsis{text-overflow:ellipsis}.whitespace-normal{white-space:normal}.whitespace-nowrap{white-space:nowrap}.whitespace-pre-wrap{white-space:pre-wrap}.\\!text-\\[var\\(--primary-text-color\\)\\]{color:var(--primary-text-color)!important}.\\!text-\\[var\\(--secondary-text-color\\)\\]{color:var(--secondary-text-color)!important}.text-\\[\\#444\\]{color:#444}.text-\\[color\\:var\\(--button-text-color\\)\\]{color:var(--button-text-color)}.text-\\[color\\:var\\(--minor-color\\)\\]{color:var(--minor-color)}.text-\\[color\\:var\\(--primary-text-color\\)\\]{color:var(--primary-text-color)}.text-\\[color\\:var\\(--secondary-text-color\\)\\]{color:var(--secondary-text-color)}.text-\\[var\\(--bottom-nav-text\\)\\]{color:var(--bottom-nav-text)}.text-\\[var\\(--button-text-color\\)\\]{color:var(--button-text-color)}.text-\\[var\\(--primary-text-color\\)\\]{color:var(--primary-text-color)}.text-\\[var\\(--secondary-color\\)\\]{color:var(--secondary-color)}.text-\\[var\\(--secondary-text-color\\)\\]{color:var(--secondary-text-color)}.text-amber-500{color:var(--color-amber-500)}.text-amber-600{color:var(--color-amber-600)}.text-blue-500{color:var(--color-blue-500)}.text-blue-600{color:var(--color-blue-600)}.text-blue-700{color:var(--color-blue-700)}.text-card-foreground{color:var(--card-foreground)}.text-destructive{color:var(--destructive)}.text-emerald-600{color:var(--color-emerald-600)}.text-foreground,.text-foreground\\/70{color:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.text-foreground\\/70{color:color-mix(in oklab,var(--foreground) 70%,transparent)}}.text-foreground\\/90{color:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.text-foreground\\/90{color:color-mix(in oklab,var(--foreground) 90%,transparent)}}.text-gray-300{color:var(--color-gray-300)}.text-gray-500{color:var(--color-gray-500)}.text-gray-600{color:var(--color-gray-600)}.text-gray-700{color:var(--color-gray-700)}.text-gray-800{color:var(--color-gray-800)}.text-gray-900{color:var(--color-gray-900)}.text-green-500{color:var(--color-green-500)}.text-green-600{color:var(--color-green-600)}.text-inherit{color:inherit}.text-muted-foreground{color:var(--muted-foreground)}.text-orange-500{color:var(--color-orange-500)}.text-popover-foreground{color:var(--popover-foreground)}.text-primary{color:var(--primary)}.text-primary-foreground{color:var(--primary-foreground)}.text-red-500{color:var(--color-red-500)}.text-red-600{color:var(--color-red-600)}.text-white{color:var(--color-white)}.capitalize{text-transform:capitalize}.lowercase{text-transform:lowercase}.normal-case{text-transform:none}.uppercase{text-transform:uppercase}.italic{font-style:italic}.not-italic{font-style:normal}.diagonal-fractions{--tw-numeric-fraction:diagonal-fractions;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.lining-nums{--tw-numeric-figure:lining-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.oldstyle-nums{--tw-numeric-figure:oldstyle-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.ordinal{--tw-ordinal:ordinal;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.proportional-nums{--tw-numeric-spacing:proportional-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.slashed-zero{--tw-slashed-zero:slashed-zero;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.stacked-fractions{--tw-numeric-fraction:stacked-fractions;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.normal-nums{font-variant-numeric:normal}.\\!underline{text-decoration-line:underline!important}.line-through{text-decoration-line:line-through}.no-underline{text-decoration-line:none}.overline{text-decoration-line:overline}.underline{text-decoration-line:underline}.underline-offset-2{text-underline-offset:2px}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.subpixel-antialiased{-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto}.caret-primary{caret-color:var(--primary)}.accent-\\[var\\(--secondary-color\\)\\]{accent-color:var(--secondary-color)}.\\[color-scheme\\:dark\\]{color-scheme:dark}.opacity-0{opacity:0}.opacity-25{opacity:.25}.opacity-30{opacity:.3}.opacity-50{opacity:.5}.opacity-60{opacity:.6}.opacity-70{opacity:.7}.opacity-75{opacity:.75}.opacity-85{opacity:.85}.opacity-100{opacity:1}.\\!shadow-none{--tw-shadow:0 0 #0000!important;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)!important}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-2xl{--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,#00000040);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_-4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\]{--tw-shadow:0 -4px 20px var(--tw-shadow-color,#0000000f);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_-6px_20px_rgba\\(0\\,0\\,0\\,0\\.12\\)\\]{--tw-shadow:0 -6px 20px var(--tw-shadow-color,#0000001f);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_4px_16px_-8px_rgba\\(0\\,0\\,0\\,0\\.08\\)\\,0_1px_2px_rgba\\(0\\,0\\,0\\,0\\.04\\)\\]{--tw-shadow:0 4px 16px -8px var(--tw-shadow-color,#00000014), 0 1px 2px var(--tw-shadow-color,#0000000a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a), 0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,#0000001a), 0 2px 4px -2px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,#0000001a), 0 8px 10px -6px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.inset-ring{--tw-inset-ring-shadow:inset 0 0 0 1px var(--tw-inset-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-offset-background{--tw-ring-offset-color:var(--background)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.blur{--tw-blur:blur(8px);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.drop-shadow{--tw-drop-shadow-size:drop-shadow(0 1px 2px var(--tw-drop-shadow-color,#0000001a)) drop-shadow(0 1px 1px var(--tw-drop-shadow-color,#0000000f));--tw-drop-shadow:drop-shadow(0 1px 2px #0000001a) drop-shadow(0 1px 1px #0000000f);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.drop-shadow-\\[0_1px_3px_rgba\\(0\\,0\\,0\\,0\\.6\\)\\]{--tw-drop-shadow-size:drop-shadow(0 1px 3px var(--tw-drop-shadow-color,#0009));--tw-drop-shadow:var(--tw-drop-shadow-size);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.grayscale{--tw-grayscale:grayscale(100%);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.invert{--tw-invert:invert(100%);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.sepia{--tw-sepia:sepia(100%);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.filter{filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.backdrop-blur{--tw-backdrop-blur:blur(8px);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-blur-\\[1px\\]{--tw-backdrop-blur:blur(1px);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-grayscale{--tw-backdrop-grayscale:grayscale(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-invert{--tw-backdrop-invert:invert(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-sepia{--tw-backdrop-sepia:sepia(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-filter{-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[border-color\\,box-shadow\\]{transition-property:border-color,box-shadow;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[color\\,scale\\]{transition-property:color,scale;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[width\\]{transition-property:width;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-shadow{transition-property:box-shadow;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.duration-\\(--animation-duration\\){--tw-duration:var(--animation-duration);transition-duration:var(--animation-duration)}.duration-150{--tw-duration:.15s;transition-duration:.15s}.duration-200{--tw-duration:.2s;transition-duration:.2s}.duration-300{--tw-duration:.3s;transition-duration:.3s}.duration-500{--tw-duration:.5s;transition-duration:.5s}.ease-\\[cubic-bezier\\(0\\.32\\,0\\.72\\,0\\,1\\)\\]{--tw-ease:cubic-bezier(.32,.72,0,1);transition-timing-function:cubic-bezier(.32,.72,0,1)}.ease-in{--tw-ease:var(--ease-in);transition-timing-function:var(--ease-in)}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}.ease-out{--tw-ease:var(--ease-out);transition-timing-function:var(--ease-out)}.fade-in-0{--tw-enter-opacity:0}.fill-mode-both{--tw-animation-fill-mode:both;animation-fill-mode:both}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.zoom-in-50{--tw-enter-scale:.5}.zoom-in-75{--tw-enter-scale:.75}.\\[animation-duration\\:0\\.6s\\]{animation-duration:.6s}.\\[core\\:order-after-done\\]{core:order-after-done}.\\[key\\:string\\]{key:string}.backface-hidden{backface-visibility:hidden}:where(.divide-x-reverse>:not(:last-child)){--tw-divide-x-reverse:1}.fade-in{--tw-enter-opacity:0}.paused{animation-play-state:paused}.ring-inset{--tw-ring-inset:inset}.running{animation-play-state:running}.slide-in-from-bottom-1{--tw-enter-translate-y:calc(1*var(--spacing))}.zoom-in{--tw-enter-scale:0}.zoom-out{--tw-exit-scale:0}.group-open\\:rotate-90:is(:where(.group):is([open],:popover-open,:open) *){rotate:90deg}@media (hover:hover){.group-hover\\:translate-x-0\\.5:is(:where(.group):hover *){--tw-translate-x:calc(var(--spacing) * .5);translate:var(--tw-translate-x) var(--tw-translate-y)}.group-hover\\:-translate-y-0\\.5:is(:where(.group):hover *){--tw-translate-y:calc(var(--spacing) * -.5);translate:var(--tw-translate-x) var(--tw-translate-y)}.group-hover\\:opacity-100:is(:where(.group):hover *){opacity:1}}.group-data-\\[state\\=closed\\]\\/collapsible-content\\:animate-out:is(:where(.group\\/collapsible-content)[data-state=closed] *){animation:exit var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.group-data-\\[state\\=closed\\]\\/collapsible-content\\:fade-out-0:is(:where(.group\\/collapsible-content)[data-state=closed] *){--tw-exit-opacity:0}.group-data-\\[state\\=closed\\]\\/collapsible-content\\:slide-out-to-top-1:is(:where(.group\\/collapsible-content)[data-state=closed] *){--tw-exit-translate-y:calc(1*var(--spacing)*-1)}.group-data-\\[state\\=open\\]\\/collapsible-content\\:animate-in:is(:where(.group\\/collapsible-content)[data-state=open] *){animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.group-data-\\[state\\=open\\]\\/collapsible-content\\:fade-in-0:is(:where(.group\\/collapsible-content)[data-state=open] *){--tw-enter-opacity:0}.group-data-\\[state\\=open\\]\\/collapsible-content\\:slide-in-from-top-1:is(:where(.group\\/collapsible-content)[data-state=open] *){--tw-enter-translate-y:calc(1*var(--spacing)*-1)}.group-data-\\[state\\=open\\]\\/collapsible-content\\:slide-in-from-top-4:is(:where(.group\\/collapsible-content)[data-state=open] *){--tw-enter-translate-y:calc(4*var(--spacing)*-1)}.group-data-\\[state\\=open\\]\\/trigger\\:rotate-0:is(:where(.group\\/trigger)[data-state=open] *){rotate:0deg}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:mt-1:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){margin-top:var(--spacing)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:gap-1:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){gap:var(--spacing)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:py-1\\.5:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){padding-block:calc(var(--spacing) * 1.5)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:font-normal:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:text-muted-foreground:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){color:var(--muted-foreground)}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:mt-3:is(:where(.group\\/tool-group-root)[data-variant=muted] *){margin-top:calc(var(--spacing) * 3)}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:w-full:is(:where(.group\\/tool-group-root)[data-variant=muted] *){width:100%}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:grow:is(:where(.group\\/tool-group-root)[data-variant=muted] *){flex-grow:1}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:border-t:is(:where(.group\\/tool-group-root)[data-variant=muted] *){border-top-style:var(--tw-border-style);border-top-width:1px}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:px-4:is(:where(.group\\/tool-group-root)[data-variant=muted] *){padding-inline:calc(var(--spacing) * 4)}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:pt-3:is(:where(.group\\/tool-group-root)[data-variant=muted] *){padding-top:calc(var(--spacing) * 3)}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:mt-3:is(:where(.group\\/tool-group-root)[data-variant=outline] *){margin-top:calc(var(--spacing) * 3)}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:w-full:is(:where(.group\\/tool-group-root)[data-variant=outline] *){width:100%}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:grow:is(:where(.group\\/tool-group-root)[data-variant=outline] *){flex-grow:1}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:border-t:is(:where(.group\\/tool-group-root)[data-variant=outline] *){border-top-style:var(--tw-border-style);border-top-width:1px}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:px-4:is(:where(.group\\/tool-group-root)[data-variant=outline] *){padding-inline:calc(var(--spacing) * 4)}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:pt-3:is(:where(.group\\/tool-group-root)[data-variant=outline] *){padding-top:calc(var(--spacing) * 3)}.marker\\:text-muted-foreground ::marker{color:var(--muted-foreground)}.marker\\:text-muted-foreground::marker{color:var(--muted-foreground)}.marker\\:text-muted-foreground ::-webkit-details-marker{color:var(--muted-foreground)}.marker\\:text-muted-foreground::-webkit-details-marker{color:var(--muted-foreground)}.placeholder\\:text-muted-foreground\\/80::placeholder{color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.placeholder\\:text-muted-foreground\\/80::placeholder{color:color-mix(in oklab,var(--muted-foreground) 80%,transparent)}}.first\\:mt-0:first-child{margin-top:0}.first\\:rounded-ss-lg:first-child{border-start-start-radius:var(--radius)}.first\\:border-t:first-child{border-top-style:var(--tw-border-style);border-top-width:1px}.last\\:mb-0:last-child{margin-bottom:0}.last\\:rounded-se-lg:last-child{border-start-end-radius:var(--radius)}.last\\:border-e:last-child{border-inline-end-style:var(--tw-border-style);border-inline-end-width:1px}.last\\:border-b-0:last-child{border-bottom-style:var(--tw-border-style);border-bottom-width:0}:is(.only\\:\\*\\:first\\:size-24:only-child>*):first-child{width:calc(var(--spacing) * 24);height:calc(var(--spacing) * 24)}.empty\\:hidden:empty{display:none}.focus-within\\:border-border:focus-within{border-color:var(--border)}.focus-within\\:shadow-\\[0_6px_24px_-8px_rgba\\(0\\,0\\,0\\,0\\.12\\)\\,0_1px_2px_rgba\\(0\\,0\\,0\\,0\\.05\\)\\]:focus-within{--tw-shadow:0 6px 24px -8px var(--tw-shadow-color,#0000001f), 0 1px 2px var(--tw-shadow-color,#0000000d);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-within\\:outline-none:focus-within{--tw-outline-style:none;outline-style:none}@media (hover:hover){.hover\\:scale-105:hover{--tw-scale-x:105%;--tw-scale-y:105%;--tw-scale-z:105%;scale:var(--tw-scale-x) var(--tw-scale-y)}.hover\\:scale-110:hover{--tw-scale-x:110%;--tw-scale-y:110%;--tw-scale-z:110%;scale:var(--tw-scale-x) var(--tw-scale-y)}.hover\\:border-\\[var\\(--secondary-color\\)\\]:hover{border-color:var(--secondary-color)}.hover\\:bg-\\[var\\(--secondary-color\\)\\]:hover{background-color:var(--secondary-color)}.hover\\:bg-accent:hover,.hover\\:bg-accent\\/50:hover{background-color:var(--accent)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-accent\\/50:hover{background-color:color-mix(in oklab,var(--accent) 50%,transparent)}}.hover\\:bg-black:hover{background-color:var(--color-black)}.hover\\:bg-black\\/5:hover{background-color:#0000000d}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-black\\/5:hover{background-color:color-mix(in oklab,var(--color-black) 5%,transparent)}}.hover\\:bg-black\\/\\[\\.04\\]:hover{background-color:#0000000a}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-black\\/\\[\\.04\\]:hover{background-color:color-mix(in oklab,var(--color-black) 4%,transparent)}}.hover\\:bg-black\\/\\[\\.12\\]:hover{background-color:#0000001f}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-black\\/\\[\\.12\\]:hover{background-color:color-mix(in oklab,var(--color-black) 12%,transparent)}}.hover\\:bg-black\\/\\[0\\.03\\]:hover{background-color:#00000008}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-black\\/\\[0\\.03\\]:hover{background-color:color-mix(in oklab,var(--color-black) 3%,transparent)}}.hover\\:bg-blue-100:hover{background-color:var(--color-blue-100)}.hover\\:bg-blue-600:hover{background-color:var(--color-blue-600)}.hover\\:bg-blue-800:hover{background-color:var(--color-blue-800)}.hover\\:bg-gray-100:hover{background-color:var(--color-gray-100)}.hover\\:bg-gray-400:hover{background-color:var(--color-gray-400)}.hover\\:bg-gray-500:hover{background-color:var(--color-gray-500)}.hover\\:bg-green-600:hover{background-color:var(--color-green-600)}.hover\\:bg-indigo-600:hover{background-color:var(--color-indigo-600)}.hover\\:bg-muted:hover{background-color:var(--muted)}.hover\\:bg-muted-foreground\\/15:hover{background-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-muted-foreground\\/15:hover{background-color:color-mix(in oklab,var(--muted-foreground) 15%,transparent)}}.hover\\:bg-muted\\/40:hover{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-muted\\/40:hover{background-color:color-mix(in oklab,var(--muted) 40%,transparent)}}.hover\\:bg-muted\\/50:hover{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-muted\\/50:hover{background-color:color-mix(in oklab,var(--muted) 50%,transparent)}}.hover\\:bg-primary:hover,.hover\\:bg-primary\\/90:hover{background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-primary\\/90:hover{background-color:color-mix(in oklab,var(--primary) 90%,transparent)}}.hover\\:bg-red-600:hover{background-color:var(--color-red-600)}.hover\\:bg-white:hover{background-color:var(--color-white)}.hover\\:bg-white\\!:hover{background-color:var(--color-white)!important}.hover\\:bg-white\\/10:hover{background-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/10:hover{background-color:color-mix(in oklab,var(--color-white) 10%,transparent)}}.hover\\:text-\\[\\#222\\]:hover{color:#222}.hover\\:text-\\[var\\(--button-text-color\\)\\]:hover{color:var(--button-text-color)}.hover\\:text-\\[var\\(--secondary-color\\)\\]:hover{color:var(--secondary-color)}.hover\\:text-accent-foreground:hover{color:var(--accent-foreground)}.hover\\:text-foreground:hover{color:var(--foreground)}.hover\\:text-gray-300:hover{color:var(--color-gray-300)}.hover\\:text-gray-700:hover{color:var(--color-gray-700)}.hover\\:text-primary\\/80:hover{color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.hover\\:text-primary\\/80:hover{color:color-mix(in oklab,var(--primary) 80%,transparent)}}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:opacity-70:hover{opacity:.7}.hover\\:opacity-75:hover{opacity:.75}.hover\\:opacity-80:hover{opacity:.8}.hover\\:opacity-90:hover{opacity:.9}.hover\\:shadow-2xl:hover{--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,#00000040);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:hover\\:text-foreground:is(:where(.group\\/tool-group-root)[data-variant=ghost] *):hover{color:var(--foreground)}}.focus\\:border-\\[var\\(--secondary-color\\)\\]:focus{border-color:var(--secondary-color)}.focus\\:ring-2:focus{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus\\:ring-\\[var\\(--secondary-color\\)\\]:focus{--tw-ring-color:var(--secondary-color)}.focus\\:ring-blue-500:focus{--tw-ring-color:var(--color-blue-500)}.focus\\:ring-gray-500:focus{--tw-ring-color:var(--color-gray-500)}.focus\\:outline-none:focus{--tw-outline-style:none;outline-style:none}.focus-visible\\:ring-2:focus-visible{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-visible\\:ring-ring:focus-visible{--tw-ring-color:var(--ring)}.focus-visible\\:ring-offset-2:focus-visible{--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)}.focus-visible\\:outline-none:focus-visible{--tw-outline-style:none;outline-style:none}.active\\:scale-90:active{--tw-scale-x:90%;--tw-scale-y:90%;--tw-scale-z:90%;scale:var(--tw-scale-x) var(--tw-scale-y)}.active\\:scale-95:active{--tw-scale-x:95%;--tw-scale-y:95%;--tw-scale-z:95%;scale:var(--tw-scale-x) var(--tw-scale-y)}.active\\:scale-\\[0\\.98\\]:active{scale:.98}.disabled\\:pointer-events-none:disabled{pointer-events:none}.disabled\\:invisible:disabled{visibility:hidden}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}.data-\\[dragging\\=true\\]\\:border-dashed[data-dragging=true]{--tw-border-style:dashed;border-style:dashed}.data-\\[dragging\\=true\\]\\:border-ring[data-dragging=true]{border-color:var(--ring)}.data-\\[highlighted\\]\\:bg-accent[data-highlighted]{background-color:var(--accent)}.data-\\[state\\=closed\\]\\:pointer-events-none[data-state=closed]{pointer-events:none}.data-\\[state\\=closed\\]\\:animate-collapsible-up[data-state=closed]{animation:.2s ease-out collapsible-up}.data-\\[state\\=closed\\]\\:fill-mode-forwards[data-state=closed]{--tw-animation-fill-mode:forwards;animation-fill-mode:forwards}.data-\\[state\\=open\\]\\:animate-collapsible-down[data-state=open]{animation:.2s ease-out collapsible-down}@media (prefers-reduced-motion:reduce){.motion-reduce\\:animate-none{animation:none}.motion-reduce\\:transition-none{transition-property:none}}@media not all and (min-width:48rem){.max-md\\:aspect-video{aspect-ratio:var(--aspect-video)}.max-md\\:max-h-52{max-height:calc(var(--spacing) * 52)}.max-md\\:p-4{padding:calc(var(--spacing) * 4)}.max-md\\:px-4{padding-inline:calc(var(--spacing) * 4)}.max-md\\:text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}}@media (min-width:40rem){.sm\\:mt-0{margin-top:0}.sm\\:mr-4{margin-right:calc(var(--spacing) * 4)}.sm\\:mb-0{margin-bottom:0}.sm\\:flex{display:flex}.sm\\:inline{display:inline}.sm\\:max-w-3xl{max-width:var(--container-3xl)}.sm\\:basis-1\\/2{flex-basis:50%}.sm\\:basis-\\[45\\%\\]{flex-basis:45%}.sm\\:basis-\\[180px\\]{flex-basis:180px}.sm\\:grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.sm\\:grid-cols-\\[160px_1fr\\]{grid-template-columns:160px 1fr}.sm\\:flex-row{flex-direction:row}.sm\\:items-center{align-items:center}.sm\\:items-end{align-items:flex-end}.sm\\:items-start{align-items:flex-start}.sm\\:justify-between{justify-content:space-between}.sm\\:gap-3{gap:calc(var(--spacing) * 3)}.sm\\:p-6{padding:calc(var(--spacing) * 6)}.sm\\:px-6{padding-inline:calc(var(--spacing) * 6)}.sm\\:py-5{padding-block:calc(var(--spacing) * 5)}.sm\\:pl-0{padding-left:0}.sm\\:text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.sm\\:text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}}@media (min-width:48rem){.md\\:absolute{position:absolute}.md\\:top-6{top:calc(var(--spacing) * 6)}.md\\:right-4{right:calc(var(--spacing) * 4)}.md\\:right-5{right:calc(var(--spacing) * 5)}.md\\:left-5{left:calc(var(--spacing) * 5)}.md\\:mt-0{margin-top:0}.md\\:mb-8{margin-bottom:calc(var(--spacing) * 8)}.md\\:ml-4{margin-left:calc(var(--spacing) * 4)}.md\\:block{display:block}.md\\:flex{display:flex}.md\\:hidden{display:none}.md\\:inline{display:inline}.md\\:h-8{height:calc(var(--spacing) * 8)}.md\\:h-12{height:calc(var(--spacing) * 12)}.md\\:h-auto{height:auto}.md\\:max-h-80{max-height:calc(var(--spacing) * 80)}.md\\:min-h-\\[48px\\]{min-height:48px}.md\\:w-1\\/2{width:50%}.md\\:w-8{width:calc(var(--spacing) * 8)}.md\\:w-12{width:calc(var(--spacing) * 12)}.md\\:w-20{width:calc(var(--spacing) * 20)}.md\\:w-auto{width:auto}.md\\:min-w-\\[90px\\]{min-width:90px}.md\\:min-w-\\[150px\\]{min-width:150px}.md\\:flex-grow{flex-grow:1}.md\\:basis-1\\/3{flex-basis:33.3333%}.md\\:basis-\\[200px\\]{flex-basis:200px}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.md\\:flex-row{flex-direction:row}.md\\:flex-wrap{flex-wrap:wrap}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:gap-4{gap:calc(var(--spacing) * 4)}.md\\:gap-6{gap:calc(var(--spacing) * 6)}.md\\:gap-8{gap:calc(var(--spacing) * 8)}:where(.md\\:space-y-0>:not(:last-child)){--tw-space-y-reverse:0;margin-block:0}:where(.md\\:space-x-4>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 4) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-x-reverse)))}.md\\:gap-y-8{row-gap:calc(var(--spacing) * 8)}.md\\:p-6{padding:calc(var(--spacing) * 6)}.md\\:px-4{padding-inline:calc(var(--spacing) * 4)}.md\\:px-6{padding-inline:calc(var(--spacing) * 6)}.md\\:px-8{padding-inline:calc(var(--spacing) * 8)}.md\\:py-2{padding-block:calc(var(--spacing) * 2)}.md\\:pt-\\[158px\\]{padding-top:158px}.md\\:pb-6{padding-bottom:calc(var(--spacing) * 6)}.md\\:text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.md\\:text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.md\\:text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.md\\:text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.md\\:text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.md\\:text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.md\\:font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}@media (hover:hover){.md\\:hover\\:scale-105:hover{--tw-scale-x:105%;--tw-scale-y:105%;--tw-scale-z:105%;scale:var(--tw-scale-x) var(--tw-scale-y)}.md\\:hover\\:bg-transparent:hover{background-color:#0000}}}@media (min-width:64rem){.lg\\:right-8{right:calc(var(--spacing) * 8)}.lg\\:left-8{left:calc(var(--spacing) * 8)}.lg\\:mt-0{margin-top:0}.lg\\:ml-2{margin-left:calc(var(--spacing) * 2)}.lg\\:\\!flex{display:flex!important}.lg\\:\\!hidden{display:none!important}.lg\\:block{display:block}.lg\\:flex{display:flex}.lg\\:hidden{display:none}.lg\\:w-1\\/3{width:33.3333%}.lg\\:w-2\\/3{width:66.6667%}.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.lg\\:grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}.lg\\:grid-cols-\\[minmax\\(0\\,1fr\\)_360px\\]{grid-template-columns:minmax(0,1fr) 360px}.lg\\:flex-row{flex-direction:row}.lg\\:gap-8{gap:calc(var(--spacing) * 8)}.lg\\:pr-6{padding-right:calc(var(--spacing) * 6)}}@media (min-width:80rem){.xl\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.xl\\:grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}.xl\\:grid-cols-6{grid-template-columns:repeat(6,minmax(0,1fr))}.xl\\:gap-4{gap:calc(var(--spacing) * 4)}}@media (min-width:96rem){.\\32xl\\:gap-6{gap:calc(var(--spacing) * 6)}}@media (prefers-color-scheme:dark){.dark\\:border-border{border-color:var(--border)}.dark\\:border-muted-foreground\\/15{border-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.dark\\:border-muted-foreground\\/15{border-color:color-mix(in oklab,var(--muted-foreground) 15%,transparent)}}.dark\\:bg-background{background-color:var(--background)}.dark\\:bg-destructive\\/5{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.dark\\:bg-destructive\\/5{background-color:color-mix(in oklab,var(--destructive) 5%,transparent)}}.dark\\:stroke-\\[2\\.5px\\]{stroke-width:2.5px}.dark\\:text-amber-400{color:var(--color-amber-400)}.dark\\:text-amber-500{color:var(--color-amber-500)}.dark\\:text-emerald-400{color:var(--color-emerald-400)}.dark\\:text-green-400{color:var(--color-green-400)}.dark\\:text-red-200{color:var(--color-red-200)}.dark\\:shadow-none{--tw-shadow:0 0 #0000;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.dark\\:focus-within\\:border-muted-foreground\\/30:focus-within{border-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.dark\\:focus-within\\:border-muted-foreground\\/30:focus-within{border-color:color-mix(in oklab,var(--muted-foreground) 30%,transparent)}}@media (hover:hover){.dark\\:hover\\:bg-accent:hover{background-color:var(--accent)}.dark\\:hover\\:bg-muted-foreground\\/30:hover{background-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.dark\\:hover\\:bg-muted-foreground\\/30:hover{background-color:color-mix(in oklab,var(--muted-foreground) 30%,transparent)}}}}.\\[\\&_svg\\]\\:text-background svg{color:var(--background)}.\\[\\&_svg\\]\\:text-black svg{color:var(--color-black)}@media (hover:hover){.hover\\:\\[\\&_svg\\]\\:text-destructive:hover svg{color:var(--destructive)}}.\\[\\&\\:\\:-webkit-details-marker\\]\\:hidden::-webkit-details-marker{display:none}.\\[\\[align\\=center\\]\\]\\:text-center[align=center]{text-align:center}.\\[\\[align\\=right\\]\\]\\:text-right[align=right]{text-align:right}.\\[\\&\\:last-child\\>td\\:first-child\\]\\:rounded-es-lg:last-child>td:first-child{border-end-start-radius:var(--radius)}.\\[\\&\\:last-child\\>td\\:last-child\\]\\:rounded-ee-lg:last-child>td:last-child{border-end-end-radius:var(--radius)}.\\[\\&\\>\\*\\]\\:col-start-2>*{grid-column-start:2}.\\[\\&\\>\\*\\]\\:animate-in>*{animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.\\[\\&\\>\\*\\]\\:duration-\\(--animation-duration\\)>*{--tw-duration:var(--animation-duration);transition-duration:var(--animation-duration)}.\\[\\&\\>\\*\\]\\:ease-\\[cubic-bezier\\(0\\.32\\,0\\.72\\,0\\,1\\)\\]>*{--tw-ease:cubic-bezier(.32,.72,0,1);transition-timing-function:cubic-bezier(.32,.72,0,1)}.\\[\\&\\>\\*\\]\\:fade-in-0>*{--tw-enter-opacity:0}.\\[\\&\\>\\*\\]\\:slide-in-from-top-1>*{--tw-enter-translate-y:calc(1*var(--spacing)*-1)}@media (prefers-reduced-motion:reduce){.\\[\\&\\>\\*\\]\\:motion-reduce\\:animate-none>*{animation:none}}.\\[\\&\\>a\\]\\:text-xs>a{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.\\[\\&\\>a\\]\\:no-underline>a{text-decoration-line:none}.\\[\\&\\>button\\]\\:rounded-full>button{border-radius:3.40282e38px}.\\[\\&\\>button\\]\\:bg-foreground\\/60>button{background-color:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.\\[\\&\\>button\\]\\:bg-foreground\\/60>button{background-color:color-mix(in oklab,var(--foreground) 60%,transparent)}}.\\[\\&\\>button\\]\\:p-1>button{padding:var(--spacing)}.\\[\\&\\>button\\]\\:opacity-100>button{opacity:1}.\\[\\&\\>button\\]\\:ring-0\\!>button{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor)!important;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)!important}@media (hover:hover){.\\[\\&\\>button\\]\\:hover\\:\\[\\&_svg\\]\\:text-destructive>button:hover svg{color:var(--destructive)}}.\\[\\&\\>li\\]\\:mt-1>li{margin-top:var(--spacing)}.\\[\\&\\>svg\\]\\:h-full>svg{height:100%}.\\[\\&\\>svg\\]\\:w-full>svg{width:100%}@property --tw-animation-delay{syntax:"*";inherits:false;initial-value:0s}@property --tw-animation-direction{syntax:"*";inherits:false;initial-value:normal}@property --tw-animation-duration{syntax:"*";inherits:false}@property --tw-animation-fill-mode{syntax:"*";inherits:false;initial-value:none}@property --tw-animation-iteration-count{syntax:"*";inherits:false;initial-value:1}@property --tw-enter-blur{syntax:"*";inherits:false;initial-value:0}@property --tw-enter-opacity{syntax:"*";inherits:false;initial-value:1}@property --tw-enter-rotate{syntax:"*";inherits:false;initial-value:0}@property --tw-enter-scale{syntax:"*";inherits:false;initial-value:1}@property --tw-enter-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-enter-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-blur{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-opacity{syntax:"*";inherits:false;initial-value:1}@property --tw-exit-rotate{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-scale{syntax:"*";inherits:false;initial-value:1}@property --tw-exit-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-translate-y{syntax:"*";inherits:false;initial-value:0}@keyframes aui-pulse{50%{opacity:.5}}:where(.aui-md[data-status=running]):empty:after,:where(.aui-md[data-status=running])>:where(:not(ol):not(ul):not(pre)):last-child:after,:where(.aui-md[data-status=running])>pre:last-child code:after,:where(.aui-md[data-status=running])>:where(:is(ol,ul):last-child)>:where(li:last-child:not(:has(*>li))):after,:where(.aui-md[data-status=running])>:where(:is(ol,ul):last-child)>:where(li:last-child)>:where(:is(ol,ul):last-child)>:where(li:last-child:not(:has(*>li))):after,:where(.aui-md[data-status=running])>:where(:is(ol,ul):last-child)>:where(li:last-child)>:where(:is(ol,ul):last-child)>:where(li:last-child)>:where(:is(ol,ul):last-child)>:where(li:last-child):after{--aui-content:"●";content:var(--aui-content);margin-left:.25rem;margin-right:.25rem;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;animation:2s cubic-bezier(.4,0,.6,1) infinite aui-pulse}@keyframes collapsible-down{0%{height:0}to{height:var(--radix-collapsible-content-height,var(--bits-collapsible-content-height,var(--reka-collapsible-content-height,var(--kb-collapsible-content-height,auto))))}}@keyframes collapsible-up{0%{height:var(--radix-collapsible-content-height,var(--bits-collapsible-content-height,var(--reka-collapsible-content-height,var(--kb-collapsible-content-height,auto))))}to{height:0}}.shimmer{color:#0000;background-image:linear-gradient(90deg,transparent 20%,var(--foreground) 50%,transparent 80%)}@supports (color:color-mix(in lab,red,red)){.shimmer{background-image:linear-gradient(90deg,transparent 20%,color-mix(in oklab,var(--foreground) 90%,transparent) 50%,transparent 80%)}}.shimmer{background-size:200% 100%;-webkit-background-clip:text;background-clip:text;animation:1.6s linear infinite ohx-shimmer}@keyframes ohx-shimmer{0%{background-position:200% 0}to{background-position:-200% 0}}.ohx-root{flex-direction:column;height:calc(100dvh - 8.5rem);min-height:24rem;display:flex}.ohx-root .aui-thread-root{flex:1;min-height:0}@property --tw-border-spacing-x{syntax:"<length>";inherits:false;initial-value:0}@property --tw-border-spacing-y{syntax:"<length>";inherits:false;initial-value:0}@property --tw-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-z{syntax:"*";inherits:false;initial-value:0}@property --tw-scale-x{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-y{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-z{syntax:"*";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-pan-x{syntax:"*";inherits:false}@property --tw-pan-y{syntax:"*";inherits:false}@property --tw-pinch-zoom{syntax:"*";inherits:false}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-space-x-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-divide-x-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-divide-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-leading{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@property --tw-ordinal{syntax:"*";inherits:false}@property --tw-slashed-zero{syntax:"*";inherits:false}@property --tw-numeric-figure{syntax:"*";inherits:false}@property --tw-numeric-spacing{syntax:"*";inherits:false}@property --tw-numeric-fraction{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.5}}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0)scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1))rotate(var(--tw-enter-rotate,0));filter:blur(var(--tw-enter-blur,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0)scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1))rotate(var(--tw-exit-rotate,0));filter:blur(var(--tw-exit-blur,0))}}
`, Hr = window.UIComponents.Button, ic = window.UIComponents.Badge, rM = window.UIComponents.Tooltip, iM = window.UIComponents.TooltipContent, oM = window.UIComponents.TooltipProvider, sM = window.UIComponents.TooltipTrigger, oc = "openharness-agent-styles", aM = 3 * 60 * 1e3, sc = 15e3;
function lM() {
  it(() => {
    if (document.getElementById(oc))
      return;
    const t = document.createElement("style");
    t.id = oc, t.textContent = nM, document.head.appendChild(t);
  }, []);
}
const Ct = (t) => !Number.isFinite(t) || t <= 0 ? "0" : t >= 1e3 ? `${(t / 1e3).toFixed(t >= 1e4 ? 0 : 1)}k` : String(Math.round(t)), cM = (t) => !Number.isFinite(t) || !t || t <= 0 ? "ctx unknown" : `${Ct(t)} ctx`, ac = (t) => (t.split("/").pop() ?? t).split(":")[0], uM = (t) => t === null || !Number.isFinite(t) || t <= 0 ? null : `×${t}`, dM = (t) => {
  if (!Number.isFinite(t))
    return "—";
  const e = Math.min(Math.max(t, 0), 1) * 100;
  return e > 0 && e < 1 ? "<1%" : e > 99 && e < 100 ? ">99%" : `${Math.round(e)}%`;
}, hM = (t) => {
  if (!t)
    return null;
  const e = Date.parse(t);
  return Number.isFinite(e) ? new Date(e).toLocaleTimeString() : null;
}, pM = (t, e) => {
  if (!t)
    return null;
  const n = Date.parse(t);
  if (!Number.isFinite(n))
    return null;
  const r = n - e;
  if (r <= 0)
    return J("Resetting…");
  const i = Math.ceil(r / 6e4), o = i >= 60 ? `${Math.round(i / 60)}h` : `${Math.max(1, i)}m`;
  return J("Resets in {duration}", { duration: o });
}, mM = ({ used: t, window: e }) => {
  const n = e > 0 ? Math.min(t / e, 1) : 0, r = n > 0.85 ? "bg-destructive" : n > 0.6 ? "bg-amber-500" : "bg-primary";
  return /* @__PURE__ */ f(oM, { delayDuration: 200, children: /* @__PURE__ */ j(rM, { children: [
    /* @__PURE__ */ f(sM, { asChild: !0, children: /* @__PURE__ */ j("div", { className: "flex min-w-36 items-center gap-2", "aria-label": J("Context usage"), children: [
      /* @__PURE__ */ f("div", { className: "bg-muted h-1.5 w-24 overflow-hidden rounded-full", children: /* @__PURE__ */ f(
        "div",
        {
          className: K("h-full rounded-full transition-[width] duration-500", r),
          style: { width: `${Math.max(n * 100, t > 0 ? 2 : 0)}%` }
        }
      ) }),
      /* @__PURE__ */ j("span", { className: "text-muted-foreground text-xs whitespace-nowrap tabular-nums", children: [
        Ct(t),
        " / ",
        Ct(e)
      ] })
    ] }) }),
    /* @__PURE__ */ f(iM, { side: "bottom", children: J("Context: {used} of {total} tokens ({pct}%)", {
      used: t.toLocaleString(),
      total: e.toLocaleString(),
      pct: Math.round(n * 100)
    }) })
  ] }) });
}, fM = () => (Gn("composer.attachmentAddError", ({ reason: t, message: e }) => {
  var i;
  const n = (i = window.sonner) == null ? void 0 : i.toast, r = t === "not-accepted" ? J("This file type is not supported.") : e || J("Attachment failed.");
  n != null && n.error ? n.error(r) : console.warn("[openharness-ui]", r);
}), null), lc = ({ title: t, hint: e, onOpenChange: n, children: r }) => /* @__PURE__ */ j(
  "details",
  {
    className: "group border-border/60 bg-muted/20 w-full rounded-lg border",
    onToggle: (i) => n == null ? void 0 : n(i.target.open),
    children: [
      /* @__PURE__ */ j("summary", { className: "text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs select-none [&::-webkit-details-marker]:hidden", children: [
        /* @__PURE__ */ f(Gk, { className: "size-3.5 shrink-0 transition-transform group-open:rotate-90" }),
        /* @__PURE__ */ f("span", { className: "font-medium", children: t }),
        e !== void 0 && /* @__PURE__ */ f("span", { className: "ms-auto flex min-w-0 items-center gap-2 truncate text-end", children: e })
      ] }),
      /* @__PURE__ */ f("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-2 px-3 pt-1 pb-2.5", children: r })
    ]
  }
), cc = ({ label: t, ratio: e, resetAt: n, now: r }) => {
  const i = e === null ? 0 : Math.min(Math.max(e, 0), 1), o = i > 0.85 ? "bg-destructive" : i > 0.6 ? "bg-amber-500" : "bg-primary", s = pM(n, r);
  return /* @__PURE__ */ j("div", { className: "w-full", "aria-label": t, children: [
    /* @__PURE__ */ j("div", { className: "flex items-baseline justify-between gap-2", children: [
      /* @__PURE__ */ f("span", { className: "text-foreground text-xs font-medium", children: t }),
      e !== null && /* @__PURE__ */ f("span", { className: "text-muted-foreground text-xs tabular-nums", children: dM(e) })
    ] }),
    /* @__PURE__ */ f("div", { className: "bg-muted mt-1.5 h-1.5 w-full overflow-hidden rounded-full", children: /* @__PURE__ */ f("div", { className: K("h-full rounded-full transition-[width]", o), style: { width: `${i * 100}%` } }) }),
    s && /* @__PURE__ */ f("span", { className: "text-muted-foreground mt-1 block text-xs", children: s })
  ] });
}, gM = ({ open: t, refreshToken: e }) => {
  const [n, r] = we(null), [i, o] = we(null), [s, a] = we(!1), l = Ue((g = !1) => {
    a(!0), q3(g).then((w) => {
      r(w), o(null);
    }).catch((w) => o((w == null ? void 0 : w.message) || J("Failed to load limits"))).finally(() => a(!1));
  }, []);
  it(() => {
    t && l();
  }, [t, e, l]);
  const [c, d] = we(() => Date.now());
  if (it(() => {
    if (!t)
      return;
    const g = window.setInterval(() => d(Date.now()), 6e4);
    return () => window.clearInterval(g);
  }, [t]), !t && !n)
    return null;
  if (i)
    return /* @__PURE__ */ j("span", { className: "text-destructive text-xs", children: [
      i,
      /* @__PURE__ */ f(Hr, { variant: "ghost", size: "sm", className: "ms-2 h-6 px-2 text-xs", onClick: () => l(!0), children: J("Retry") })
    ] });
  if (!n)
    return /* @__PURE__ */ f("span", { className: "text-muted-foreground text-xs", children: J("Loading…") });
  if (!n.supported)
    return /* @__PURE__ */ f("span", { className: "text-muted-foreground text-xs", children: J("Limits are not available for this provider.") });
  const u = typeof n.burstMaxBudgetUsd == "number" && n.burstMaxBudgetUsd > 0, h = u && n.burstSpentUsd !== null ? n.burstSpentUsd / n.burstMaxBudgetUsd : null, p = typeof n.maxBudgetUsd == "number" && n.maxBudgetUsd > 0, m = p ? (n.spentUsd ?? 0) / n.maxBudgetUsd : null;
  return /* @__PURE__ */ j("div", { className: "w-full space-y-3", children: [
    n.overBudget && /* @__PURE__ */ f("p", { className: "text-destructive text-xs", children: J("The assistant is over its budget. It will work again after the window resets.") }),
    u && /* @__PURE__ */ f(
      cc,
      {
        label: J("Session ({duration})", { duration: n.burstDurationLabel ?? "4h" }),
        ratio: h,
        resetAt: n.burstResetAt,
        now: c
      }
    ),
    p ? /* @__PURE__ */ f(
      cc,
      {
        label: J("Daily ({duration})", { duration: J("1 day") }),
        ratio: m,
        resetAt: n.budgetResetAt,
        now: c
      }
    ) : /* @__PURE__ */ f("span", { className: "text-muted-foreground block text-xs", children: J("No daily budget cap") }),
    /* @__PURE__ */ j("div", { className: "text-muted-foreground flex items-center gap-3 text-xs", children: [
      n.rpmLimit !== null && /* @__PURE__ */ j("span", { className: "tabular-nums", children: [
        n.rpmLimit,
        " rpm"
      ] }),
      n.tpmLimit !== null && /* @__PURE__ */ j("span", { className: "tabular-nums", children: [
        Ct(n.tpmLimit),
        " tpm"
      ] }),
      /* @__PURE__ */ f(
        Hr,
        {
          variant: "ghost",
          size: "sm",
          className: "ms-auto h-6 px-2 text-xs",
          onClick: () => l(!0),
          disabled: s,
          "aria-label": J("Refresh limits"),
          children: /* @__PURE__ */ f(o_, { className: K("size-3", s && "animate-spin") })
        }
      )
    ] })
  ] });
}, bM = (t) => {
  switch (t == null ? void 0 : t.state) {
    case "waiting_retry":
      return J("Waiting for the next registration slot");
    case "error":
      return J("Registration attempt failed");
    case "setup_required":
      return J("Server setup required");
    default:
      return J("Connecting the assistant…");
  }
}, vM = ({ status: t, error: e }) => {
  const n = hM((t == null ? void 0 : t.nextAttemptAt) ?? null), r = (t == null ? void 0 : t.state) === "setup_required";
  return /* @__PURE__ */ j("div", { className: "flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center", children: [
    r ? /* @__PURE__ */ f(ts, { className: "text-muted-foreground size-8" }) : /* @__PURE__ */ f(_h, { className: "text-muted-foreground size-8 animate-spin" }),
    /* @__PURE__ */ f("p", { className: "text-sm font-medium", children: bM(t) }),
    /* @__PURE__ */ f("p", { className: "text-muted-foreground max-w-md text-xs text-balance", children: J(r ? "Set the PROJECT_NAME setting to finish the server setup — the assistant needs it to register." : "The assistant registers itself with the LLM gateway. The broker issues at most one key per hour, so this can take a while — the page keeps retrying automatically.") }),
    r && /* @__PURE__ */ f(Hr, { asChild: !0, variant: "outline", size: "sm", children: /* @__PURE__ */ f("a", { href: `${xt()}/settings-manager#PROJECT_NAME`, children: "PROJECT_NAME" }) }),
    n && !r && /* @__PURE__ */ j("p", { className: "text-muted-foreground text-xs", children: [
      J("Next attempt at"),
      " ",
      /* @__PURE__ */ f("span", { className: "text-foreground font-medium tabular-nums", children: n })
    ] }),
    (t == null ? void 0 : t.state) === "error" && t.lastError && /* @__PURE__ */ f("p", { className: "text-destructive max-w-md text-xs", children: t.lastError }),
    e && /* @__PURE__ */ f("p", { className: "text-destructive max-w-md text-xs", children: e })
  ] });
}, wM = ({ getMeta: t, onUsage: e, onRunEnd: n, onNewChat: r, onCompact: i, belowComposer: o }) => {
  const s = Tt(
    () => Z3({ onUsage: e, onRunEnd: n }),
    [e, n]
  ), a = Tt(() => new tM(t), [t]), l = lx(s, { adapters: { attachments: a } }), c = Fe(!1);
  return it(() => {
    c.current || (c.current = !0, K3().then((d) => {
      const u = Y3(d);
      u.length && l.thread.reset(u);
    }).catch(() => {
    }));
  }, [l]), /* @__PURE__ */ j(bx, { runtime: l, children: [
    /* @__PURE__ */ f(fM, {}),
    /* @__PURE__ */ f(M3, { onNewChat: r, onCompact: i, belowComposer: o })
  ] });
};
function xM() {
  lM();
  const [t, e] = we(null), [n, r] = we(null), [i, o] = we(null), [s, a] = we(null), [l, c] = we(null), [d, u] = we(0), [h, p] = we(!1), [m, g] = we(!1), [w, b] = we(!1), [k, x] = we(0), T = Fe(0), I = (t == null ? void 0 : t.state) === "ready", y = Fe(null);
  y.current = i;
  const M = Ue(() => y.current, []);
  it(() => {
    let B = !1, v;
    const Q = async () => {
      try {
        const ee = await V3();
        if (B || (bS(ee.locale), e(ee), r(null), ee.state === "ready"))
          return;
        const S = ee.nextAttemptAt ? Date.parse(ee.nextAttemptAt) - Date.now() + 2e3 : NaN, pe = Number.isFinite(S) ? Math.min(Math.max(S, 5e3), 3e4) : sc;
        v = window.setTimeout(Q, pe);
      } catch (ee) {
        if (B)
          return;
        r((ee == null ? void 0 : ee.message) || J("Failed to check the assistant status")), v = window.setTimeout(Q, sc);
      }
    };
    return Q(), () => {
      B = !0, v && window.clearTimeout(v);
    };
  }, []);
  const E = Ue(() => {
    T.current = Date.now(), H3().then((B) => {
      o(B), a(null);
    }).catch((B) => a((B == null ? void 0 : B.message) || J("Failed to load agent info")));
  }, []);
  it(() => {
    I && E();
  }, [I, E]);
  const N = Ue(() => {
    Date.now() - T.current < aM || E();
  }, [E]), _ = Ue((B) => c(B), []), A = Ue(() => {
    E(), x((B) => B + 1);
  }, [E]), P = Ue(async () => {
    var B;
    if (!h) {
      p(!0);
      try {
        await W3(), c(null), u((v) => v + 1), E();
      } catch (v) {
        const Q = (B = window.sonner) == null ? void 0 : B.toast;
        Q != null && Q.error && Q.error((v == null ? void 0 : v.message) || J("Failed to reset the session"));
      } finally {
        p(!1);
      }
    }
  }, [h, E]), D = Fe(!1), O = Ue(async () => {
    var v;
    if (D.current)
      return;
    D.current = !0;
    const B = (v = window.sonner) == null ? void 0 : v.toast;
    try {
      const Q = await J3();
      c(null), E();
      const ee = Q.compacted ? J("Context compacted: {before} → {after} tokens", {
        before: Ct(Q.tokensBefore ?? 0),
        after: Ct(Q.tokensAfter ?? 0)
      }) : J("Nothing to compact yet.");
      B != null && B.success ? B.success(ee) : console.info("[openharness-ui]", ee);
    } catch (Q) {
      const ee = (Q == null ? void 0 : Q.message) || J("Compaction failed");
      B != null && B.error ? B.error(ee) : console.warn("[openharness-ui]", ee);
    } finally {
      D.current = !1;
    }
  }, [E]), z = Ue(async (B) => {
    var Q, ee;
    const v = B.target.value;
    if (!(!v || m || v === ((Q = y.current) == null ? void 0 : Q.model))) {
      g(!0);
      try {
        const S = await G3(v);
        o(S), a(null), c(null), u((pe) => pe + 1);
      } catch (S) {
        const pe = (ee = window.sonner) == null ? void 0 : ee.toast, he = (S == null ? void 0 : S.message) || J("Failed to switch the model");
        pe != null && pe.error ? pe.error(he) : a(he);
      } finally {
        g(!1);
      }
    }
  }, []), V = l ? (l.inputTokens ?? 0) + (l.outputTokens ?? 0) : (i == null ? void 0 : i.contextTokens) ?? 0, G = (i == null ? void 0 : i.availableModels.find((B) => B.id === i.model)) ?? null, F = i ? /* @__PURE__ */ j("div", { className: "mx-auto flex w-full flex-col gap-1.5", children: [
    /* @__PURE__ */ j(
      lc,
      {
        title: J("Model & context"),
        hint: /* @__PURE__ */ j(Ke, { children: [
          /* @__PURE__ */ f("span", { className: "max-w-40 truncate font-mono", title: i.model, children: ac(i.model) }),
          /* @__PURE__ */ j("span", { className: "tabular-nums", children: [
            Ct(V),
            " / ",
            Ct(i.contextWindow)
          ] })
        ] }),
        children: [
          /* @__PURE__ */ j("label", { className: "flex items-center gap-2 text-xs", children: [
            /* @__PURE__ */ f("span", { className: "text-muted-foreground whitespace-nowrap", children: J("Model") }),
            /* @__PURE__ */ f(
              "select",
              {
                value: i.model,
                onChange: z,
                onMouseDown: N,
                onFocus: N,
                disabled: m || h,
                className: "border-input bg-background text-foreground h-8 min-w-48 rounded-md border px-2 text-xs",
                "aria-label": "Select model",
                title: J("Select model"),
                children: i.availableModels.map((B) => {
                  const v = uM(B.costCoefficient);
                  return /* @__PURE__ */ j("option", { value: B.id, children: [
                    B.id,
                    v ? ` · ${v}` : "",
                    B.vision ? " · vision" : ""
                  ] }, B.id);
                })
              }
            )
          ] }),
          G && /* @__PURE__ */ j(ic, { variant: "secondary", className: "text-xs", children: [
            cM(G.contextWindow),
            G.vision ? " · vision" : ""
          ] }),
          /* @__PURE__ */ f(mM, { used: V, window: i.contextWindow }),
          i.turns > 0 && /* @__PURE__ */ j("span", { className: "text-muted-foreground text-xs whitespace-nowrap", children: [
            i.turns,
            " ",
            i.turns === 1 ? J("turn") : J("turns")
          ] })
        ]
      }
    ),
    /* @__PURE__ */ f(lc, { title: J("Limits"), onOpenChange: b, children: /* @__PURE__ */ f(gM, { open: w, refreshToken: k }) })
  ] }) : null;
  return /* @__PURE__ */ j("div", { className: "aui-root ohx-root bg-background text-foreground", children: [
    /* @__PURE__ */ j("header", { className: "border-border/60 flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5", children: [
      /* @__PURE__ */ j("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ f(ts, { className: "text-muted-foreground size-5" }),
        /* @__PURE__ */ f("span", { className: "text-sm font-semibold", children: "RestoApp Assistant" })
      ] }),
      I && i && /* @__PURE__ */ f(ic, { variant: "outline", className: "max-w-64 font-mono text-xs", title: i.model, children: /* @__PURE__ */ f("span", { className: "truncate", children: ac(i.model) }) }),
      I && /* @__PURE__ */ f("div", { className: "ms-auto flex items-center gap-4", children: /* @__PURE__ */ j(
        Hr,
        {
          variant: "outline",
          size: "sm",
          onClick: P,
          disabled: h || m,
          className: "gap-1.5",
          children: [
            /* @__PURE__ */ f(a_, { className: K("size-3.5", h && "animate-spin") }),
            J("New chat")
          ]
        }
      ) }),
      s && /* @__PURE__ */ f("span", { className: "text-destructive w-full text-xs", children: s })
    ] }),
    I ? /* @__PURE__ */ f(
      wM,
      {
        getMeta: M,
        onUsage: _,
        onRunEnd: A,
        onNewChat: P,
        onCompact: O,
        belowComposer: F
      },
      d
    ) : /* @__PURE__ */ f(vM, { status: t, error: n })
  ] });
}
export {
  xM as default
};
