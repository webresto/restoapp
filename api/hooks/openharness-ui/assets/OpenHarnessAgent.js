var em = Object.defineProperty;
var tm = (t, e, r) => e in t ? em(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var C = (t, e, r) => (tm(t, typeof e != "symbol" ? e + "" : e, r), r), Es = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
};
var Ir = (t, e, r) => (Es(t, e, "read from private field"), r ? r.call(t) : e.get(t)), Er = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, Ar = (t, e, r, n) => (Es(t, e, "write to private field"), n ? n.call(t, r) : e.set(t, r), r);
const _e = window.React, {
  Children: zi,
  Component: rm,
  Fragment: Bt,
  Profiler: nm,
  PureComponent: im,
  StrictMode: om,
  Suspense: sm,
  act: am,
  cloneElement: Ft,
  createContext: po,
  createElement: St,
  createFactory: lm,
  createRef: cm,
  forwardRef: te,
  isValidElement: Ct,
  lazy: um,
  memo: we,
  startTransition: dm,
  useCallback: yt,
  useContext: Jr,
  useDebugValue: hm,
  useDeferredValue: nc,
  useEffect: Ht,
  useId: mo,
  useImperativeHandle: pm,
  useInsertionEffect: ic,
  useLayoutEffect: Fn,
  useMemo: xt,
  useReducer: mm,
  useRef: lt,
  useState: Ie,
  useSyncExternalStore: fm,
  useTransition: gm,
  version: bm
} = _e, vm = _e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, wm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: zi,
  Component: rm,
  Fragment: Bt,
  Profiler: nm,
  PureComponent: im,
  StrictMode: om,
  Suspense: sm,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: vm,
  act: am,
  cloneElement: Ft,
  createContext: po,
  createElement: St,
  createFactory: lm,
  createRef: cm,
  default: _e,
  forwardRef: te,
  isValidElement: Ct,
  lazy: um,
  memo: we,
  startTransition: dm,
  useCallback: yt,
  useContext: Jr,
  useDebugValue: hm,
  useDeferredValue: nc,
  useEffect: Ht,
  useId: mo,
  useImperativeHandle: pm,
  useInsertionEffect: ic,
  useLayoutEffect: Fn,
  useMemo: xt,
  useReducer: mm,
  useRef: lt,
  useState: Ie,
  useSyncExternalStore: fm,
  useTransition: gm,
  version: bm
}, Symbol.toStringTag, { value: "Module" })), tt = Bt;
function oc(t, e, r) {
  return r !== void 0 ? St(t, { ...e, key: r }) : St(t, e);
}
const f = oc, H = oc;
let dr = null;
function ym(t, e) {
  t.currentIndex = 0, t.wipContextDeps = null, t.wipCommitCallbacks = [];
  const r = dr;
  dr = t;
  try {
    if (e(), t.isFirstRender = !1, t.cells.length !== t.currentIndex)
      throw new Error(`Rendered ${t.currentIndex} hooks but expected ${t.cells.length}. Hooks must be called in the exact same order in every render.`);
  } finally {
    dr = r;
  }
}
function Tt() {
  if (!dr)
    throw new Error("No resource fiber available");
  return dr;
}
function Gt() {
  return dr;
}
const fo = Symbol("tap.Context.defaultValue"), xm = (t) => t;
let st = /* @__PURE__ */ new Map();
const zt = /* @__PURE__ */ new Set(), sc = () => new Map(st), ii = (t, e) => {
  const r = st;
  st = t;
  try {
    return e();
  } finally {
    st = r;
  }
}, ac = (t, e) => {
  t[fo] = e;
}, lc = (t) => typeof t == "object" && t !== null && fo in t, cc = (t) => typeof t == "object" && t !== null && "$$typeof" in t && t.$$typeof === Symbol.for("react.context"), go = (t) => lc(t) || cc(t), uc = (t) => {
  if (!lc(t)) {
    if (cc(t)) {
      ac(t, t._currentValue ?? t._currentValue2);
      return;
    }
    throw new Error("A tap resource's `use()` only accepts a tap context.");
  }
}, dc = (t, e, r) => {
  if (typeof t != "object" || t === null)
    throw new Error("useContextProvider only accepts a React context.");
  uc(t);
  const n = t, i = Tt(), o = Z(void 0), s = o.current === void 0 || !Object.is(o.current.value, e);
  Q(() => {
    o.current = { value: e };
  }, [e]);
  const a = st.get(n), l = a !== void 0 || st.has(n);
  st.set(n, {
    value: e,
    source: i
  });
  try {
    return km(n, s, r);
  } finally {
    l ? st.set(n, a) : st.delete(n);
  }
}, km = (t, e, r) => {
  const n = zt.has(t);
  e ? zt.add(t) : zt.delete(t);
  try {
    return r();
  } finally {
    n ? zt.add(t) : zt.delete(t);
  }
}, _m = (t) => {
  uc(t);
  const e = t, r = Sm(e, t), n = Tt();
  return (n.wipContextDeps ?? (n.wipContextDeps = /* @__PURE__ */ new Map())).set(e, r.source), r.value;
}, Sm = (t, e) => st.get(t) ?? {
  value: xm(e)[fo],
  source: null
}, Cm = (t, e, r, n) => {
  if (!n)
    return r;
  let i = r;
  for (const [o, s] of n)
    s === e || s === t || (i ?? (i = /* @__PURE__ */ new Map())).set(o, s);
  return i;
}, hc = (t, e = t.wipContextDeps) => {
  const r = Gt();
  !r || !e || (r.wipContextDeps = Cm(r, t, r.wipContextDeps, e));
}, pc = () => zt.size > 0, bo = (t) => {
  if (!t.contextDeps || !pc())
    return !1;
  for (const e of zt.keys())
    if (t.contextDeps.has(e))
      return !0;
  return !1;
}, Tm = [
  0,
  1,
  2,
  3
];
function As(t) {
  const e = [];
  for (const r of Tm) {
    const n = t[r];
    if (n !== void 0)
      for (let i = 0; i < n.length; i++)
        try {
          n[i]();
        } catch (o) {
          e.push(o);
        }
  }
  if (e.length > 0) {
    if (e.length === 1)
      throw e[0];
    for (const r of e)
      console.error(r);
    throw new AggregateError(e, "Errors during commit");
  }
}
function mc(t) {
  var r;
  const e = [];
  for (const n of t.cells)
    if ((n == null ? void 0 : n.type) === "effect" && (n.deps = null, n.cleanup))
      try {
        (r = n.cleanup) == null || r.call(n);
      } catch (i) {
        e.push(i);
      } finally {
        n.cleanup = void 0;
      }
  if (e.length > 0) {
    if (e.length === 1)
      throw e[0];
    for (const n of e)
      console.error(n);
    throw new AggregateError(e, "Errors during cleanup");
  }
}
const je = typeof process < "u" && ({}.NODE_ENV === "development" || {}.NODE_ENV === "test"), fc = (t) => ({
  version: 0,
  committedVersion: 0,
  context: sc(),
  dispatchUpdate: t,
  changelog: [],
  rollbackCallbacks: []
}), Sn = (t) => {
  t.committedVersion = t.version, t.changelog.length = 0, t.rollbackCallbacks.length = 0;
}, Dr = (t, e) => {
  const r = t.version > e;
  if (t.version = e, r) {
    for (let n = 0; n < t.rollbackCallbacks.length; n++)
      t.rollbackCallbacks[n]();
    if (t.rollbackCallbacks.length = 0, e === t.committedVersion)
      t.changelog.length = 0;
    else {
      if (t.committedVersion > e)
        throw new Error("Version is less than committed version");
      for (; t.committedVersion + t.changelog.length > e; )
        t.changelog.pop();
      for (let n = 0; n < t.changelog.length; n++)
        gc(t.changelog[n]);
      Sn(t);
    }
  }
}, gc = (t) => {
  var e;
  vc(t.fiber, t.cell), t.queued || (t.queued = !0, ((e = t.cell).queue ?? (e.queue = [])).push(t));
}, Br = (t, e, r) => {
  const n = t.wipCommitCallbacks;
  (n[e] ?? (n[e] = [])).push(r);
}, bc = (t, e) => {
  t.rollbackCallbacks.push(e);
}, vc = (t, e) => {
  var r;
  e.isDirty || (e.isDirty = !0, (r = t.markDirty) == null || r.call(t), bc(t.root, () => {
    if (e.queue !== null) {
      for (const n of e.queue)
        n.queued = !1;
      e.queue = null;
    }
    e.workInProgress = e.current, e.isDirty = !1;
  }));
}, vo = () => {
  throw new Error("Rendered more hooks than during the previous render. Hooks must be called in the exact same order in every render.");
}, wo = () => {
  throw new Error("Hook order changed between renders");
}, Im = (t, e, r) => {
  if (t.isNeverMounted)
    throw new Error("Resource updated before mount");
  let n = !1, i = !0;
  t.root.dispatchUpdate(() => (n || (n = !0, r && t.root.changelog.length === 0 && !e.cell.isDirty && !e.hasEagerState && (e.eagerState = r(e.cell.workInProgress, e.action), e.hasEagerState = !0, i = !Object.is(e.cell.current, e.eagerState))), i), () => (n = !0, i = !0, gc(e), t.root.changelog.push(e), !0));
}, Em = (t, e, r, n, i) => {
  const o = n ? n(r) : r;
  je && t.devStrictMode && n && n(r);
  const s = {
    type: "reducer",
    workInProgress: o,
    current: o,
    isDirty: !1,
    queue: null,
    renderQueue: null,
    reducer: e,
    dispatch: (a) => {
      const l = Gt();
      if (l !== null) {
        if (l !== t)
          throw new Error("Cannot update a resource while rendering a different resource.");
        (t.renderPendingCells ?? (t.renderPendingCells = /* @__PURE__ */ new Set())).add(s), (s.renderQueue ?? (s.renderQueue = [])).push(a);
      } else
        Im(t, {
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
function wc(t, e, r, n) {
  var c;
  const i = Tt(), o = i.currentIndex++, s = i.cells[o], a = (() => {
    if (s !== void 0)
      return s.type === "reducer" ? s : wo();
    !i.isFirstRender && o >= i.cells.length && vo();
    const d = Em(i, t, e, r, n);
    return i.cells[o] = d, d;
  })(), l = a.queue;
  if (l !== null) {
    const d = t === a.reducer;
    for (let u = 0; u < l.length; u++) {
      const h = l[u];
      !h.hasEagerState || !d ? (h.eagerState = t(a.workInProgress, h.action), h.hasEagerState = !0, je && i.devStrictMode && (h.eagerState = t(a.workInProgress, h.action))) : je && i.devStrictMode && t(a.workInProgress, h.action), h.queued = !1, a.workInProgress = h.eagerState;
    }
    a.queue = null;
  }
  if (a.reducer = t, a.renderQueue !== null) {
    let d = a.workInProgress;
    for (const u of a.renderQueue)
      d = t(d, u);
    a.renderQueue = null, (c = i.renderPendingCells) == null || c.delete(a), Object.is(d, a.workInProgress) || (vc(i, a), a.workInProgress = d);
  }
  return a.isDirty && Br(i, 0, () => {
    a.current = a.workInProgress, a.isDirty = !1;
  }), [a.workInProgress, a.dispatch];
}
function yc(t, e, r) {
  return wc(t, e, r, !1);
}
const Am = (t, e) => typeof e == "function" ? e(t) : e, Rm = (t) => t === void 0 ? void 0 : typeof t == "function" ? t() : t;
function yo(t) {
  return wc(Am, t, Rm, !0);
}
const Un = (t, e) => {
  je && t.length !== e.length && console.error(`The final argument passed to a hook changed size between renders. The order and size of this array must remain constant.

Previous: [${t.join(", ")}]
Incoming: [${e.join(", ")}]`);
  for (let r = 0; r < t.length && r < e.length; r++)
    if (!Object.is(t[r], e[r]))
      return !1;
  return !0;
}, Rs = (t, e) => {
  Br(t, 0, () => {
    e.current = e.wip, e.currentDeps = e.wipDeps, e.isDirty = !1;
  });
}, jn = (t, e) => {
  const r = Tt(), n = r.currentIndex++;
  let i = r.cells[n];
  if (i === void 0) {
    !r.isFirstRender && n >= r.cells.length && vo();
    const a = t();
    return je && r.devStrictMode && t(), i = {
      type: "memo",
      current: a,
      currentDeps: e,
      wip: a,
      wipDeps: e,
      isDirty: !1
    }, r.cells[n] = i, a;
  }
  i.type !== "memo" && wo();
  const o = i;
  if (Un(o.wipDeps, e))
    return o.isDirty && Rs(r, o), o.wip;
  const s = t();
  return je && r.devStrictMode && t(), o.wip = s, o.wipDeps = e, o.isDirty || (o.isDirty = !0, bc(r.root, () => {
    o.wip = o.current, o.wipDeps = o.currentDeps, o.isDirty = !1;
  })), Rs(r, o), s;
};
function Vn(t) {
  return jn(() => ({ current: t }), []);
}
const xo = (t, e) => jn(() => t, e), Pm = () => ({
  type: "effect",
  cleanup: void 0,
  deps: null
});
function hr(t, e) {
  const r = Tt(), n = r.currentIndex++, i = r.cells[n], o = i === void 0 ? Pm() : i.type === "effect" ? i : wo();
  if (i === void 0 && (!r.isFirstRender && n >= r.cells.length && vo(), r.cells[n] = o), !(e && o.deps && Un(o.deps, e))) {
    if (o.deps !== null && !!e != !!o.deps)
      throw new Error("useEffect called with and without dependencies across re-renders");
    Br(r, 2, () => {
      var s;
      try {
        (s = o.cleanup) == null || s.call(o);
      } finally {
        o.cleanup = void 0;
      }
    }), Br(r, 3, () => {
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
function ko(t) {
  const e = Tt(), r = Vn(t);
  return r.current !== t && Br(e, 1, () => {
    r.current = t;
  }), xo((...n) => {
    if (je && Gt())
      throw new Error("useEffectEvent cannot be called during render");
    return r.current(...n);
  }, []);
}
const Cn = (t) => {
  if (!go(t))
    throw new Error("A tap resource's `use()` only accepts a tap context.");
  return _m(t);
}, xc = (t, e, r = e) => {
  const n = Vn(!0), i = n.current ? r() : e();
  n.current = !1;
  const [, o] = yo(0), s = ko(() => {
    Object.is(i, e()) || o((a) => a + 1);
  });
  return hr(() => (s(), t(s)), [t]), i;
}, kc = (t, e) => {
}, Mm = _e;
function Dm(t) {
  const e = lt(t);
  return ic(() => {
    e.current = t;
  }), yt((...r) => e.current(...r), []);
}
const Nm = Mm.useEffectEvent ?? Dm, qe = () => Gt() !== null, He = _e, ve = (t) => qe() ? yo(t) : He.useState(t), zm = (t, e, r) => qe() ? yc(t, e, r) : He.useReducer(t, e, r), Z = (t) => qe() ? Vn(t) : He.useRef(t), ce = (t, e) => qe() ? jn(t, e) : He.useMemo(t, e), kt = (t, e) => qe() ? xo(t, e) : He.useCallback(t, e), Q = (t, e) => qe() ? hr(t, e) : He.useEffect(t, e), Fr = (t, e) => qe() ? hr(t, e) : He.useLayoutEffect(t, e), Fe = (t) => qe() ? ko(t) : Nm(t), vr = (t, e, r) => qe() ? xc(t, e, r) : He.useSyncExternalStore(t, e, r), Om = (t, e) => qe() ? kc() : He.useDebugValue(t, e), Ge = (t) => {
  const e = He.createContext(t);
  return ac(e, t), e;
}, _c = (t) => qe() && go(t) ? Cn(t) : He.use(t), We = (t) => qe() && go(t) ? Cn(t) : He.useContext(t), Sc = _e, Cc = Symbol.for("react.memo_cache_sentinel"), Tc = (t) => new Array(t).fill(Cc), Lm = (t) => Sc.useMemo(() => {
  const e = Tc(t);
  return e[Cc] = !0, e;
}, []), A = (t) => {
  var s;
  const e = Gt();
  if (e === null)
    return (((s = Sc.__COMPILER_RUNTIME) == null ? void 0 : s.c) ?? Lm)(t);
  const r = e.memoCache;
  let n = r.workInProgress;
  if (n === null) {
    const a = r.current;
    n = a === null ? [] : a.map((l) => l.slice()), r.workInProgress = n;
  }
  const i = r.index++;
  let o = n[i];
  return o === void 0 ? (o = Tc(t), n[i] = o) : je && o.length !== t && console.error(`Expected a constant size argument for each invocation of c(). The previous cache was allocated with size ${o.length} but size ${t} was requested.`), o;
};
function le(t) {
  return (...e) => ({
    hook: t,
    args: e
  });
}
function Ze(t, e, r) {
  return r ? {
    ...e,
    key: t,
    deps: r
  } : {
    ...e,
    key: t
  };
}
const $m = 50;
let at = {
  schedulers: /* @__PURE__ */ new Set([]),
  isScheduled: !1
};
var Bm = class {
  constructor(t) {
    C(this, "_task");
    C(this, "_isDirty", !1);
    this._task = t;
  }
  get isDirty() {
    return this._isDirty;
  }
  markDirty() {
    this._isDirty = !0, at.schedulers.add(this), Fm();
  }
  runTask() {
    this._isDirty = !1, this._task();
  }
};
const Fm = () => {
  at.isScheduled || (at.isScheduled = !0, Um());
}, Oi = () => {
  try {
    const t = [];
    let e = 0;
    for (const r of at.schedulers)
      if (at.schedulers.delete(r), !!r.isDirty) {
        if (e++, e > $m)
          throw new Error("Maximum update depth exceeded. This can happen when a resource repeatedly calls setState inside useEffect.");
        try {
          r.runTask();
        } catch (n) {
          t.push(n);
        }
      }
    if (t.length > 0) {
      if (t.length === 1)
        throw t[0];
      for (const r of t)
        console.error(r);
      throw new AggregateError(t, "Errors occurred during flushSync");
    }
  } finally {
    at.schedulers.clear(), at.isScheduled = !1;
  }
}, Um = (() => {
  if (typeof MessageChannel < "u") {
    const t = new MessageChannel();
    return t.port1.onmessage = Oi, () => t.port2.postMessage(null);
  }
  return () => setTimeout(Oi, 0);
})(), Ps = (t) => {
  const e = at;
  at = {
    schedulers: /* @__PURE__ */ new Set([]),
    isScheduled: !0
  };
  try {
    const r = t();
    return Oi(), r;
  } finally {
    at = e;
  }
}, jm = {
  useState: yo,
  useReducer: yc,
  useRef: Vn,
  useMemo: jn,
  useCallback: xo,
  useEffect: hr,
  useLayoutEffect: hr,
  useInsertionEffect: hr,
  useEffectEvent: ko,
  useContext: Cn,
  use: Cn,
  useSyncExternalStore: xc,
  useDebugValue: kc
}, Ms = _e, Rt = Ms.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ?? Ms.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, on = Rt == null ? null : "H" in Rt ? {
  get current() {
    return Rt.H;
  },
  set current(t) {
    Rt.H = t;
  }
} : "ReactCurrentDispatcher" in Rt ? {
  get current() {
    return Rt.ReactCurrentDispatcher.current;
  },
  set current(t) {
    Rt.ReactCurrentDispatcher.current = t;
  }
} : null;
function Vm(t) {
  if (!on)
    return t();
  const e = on.current;
  on.current = jm;
  try {
    return t();
  } finally {
    on.current = e;
  }
}
function Ic(t, e, r = void 0, n) {
  return {
    hook: t,
    root: e,
    markDirty: r,
    devStrictMode: n,
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
function pr(t) {
  if (!t.isMounted)
    throw new Error("Tried to unmount a fiber that is already unmounted");
  t.isMounted = !1, mc(t);
}
function _t(t, e) {
  var i;
  if (t.memoCache.workInProgress = null, t.renderPendingCells !== null) {
    for (const o of t.renderPendingCells)
      o.renderQueue = null;
    t.renderPendingCells.clear();
  }
  let r = 0, n;
  do {
    if (++r > 25)
      throw new Error("Too many re-renders. tap limits the number of renders to prevent an infinite loop.");
    t.memoCache.index = 0, ym(t, () => {
      n = Vm(() => t.hook(...e));
    });
  } while ((((i = t.renderPendingCells) == null ? void 0 : i.size) ?? 0) > 0);
  return hc(t), n;
}
function Ur(t) {
  const e = t.wipCommitCallbacks ?? t.commitCallbacks ?? [];
  t.wipCommitCallbacks = null, t.commitCallbacks = e, t.isMounted = !0, t.contextDeps = t.wipContextDeps, Sn(t.root), t.memoCache.workInProgress !== null && (t.memoCache.current = t.memoCache.workInProgress, t.memoCache.workInProgress = null), je && t.isNeverMounted && t.devStrictMode === "root" && (t.isNeverMounted = !1, As(e), mc(t)), t.isNeverMounted = !1, As(e);
}
const qm = () => {
  const t = Tt();
  return t.devStrictMode ? t.isFirstRender ? "child" : "root" : null;
}, Hm = () => "child", Ds = () => null, Gm = () => {
  if (!je)
    return Ds;
  const t = Z(0);
  return ve(() => t.current++), t.current !== 2 ? Ds : Hm;
}, Ec = () => Gt() ? qm : Gm(), Wm = (t) => t(), Km = (t) => {
  const e = ce(() => new Bm(() => p()), []), r = ce(() => [], []), n = Ec(), i = ce(() => {
    const m = fc((g, v) => {
      if (!e.isDirty) {
        if (!g())
          return;
        v();
      }
      Dr(m, m.committedVersion + m.changelog.length), r.push(v), e.markDirty();
    });
    return Ic(Wm, m, void 0, n());
  }, [
    r,
    e,
    n
  ]), o = sc(), s = i.root.version - i.root.committedVersion, a = ii(o, () => _t(i, [t])), l = Z(!1), c = Z([t]), d = Z(a), u = ce(() => /* @__PURE__ */ new Set(), []), h = (m) => {
    e.isDirty || d.current === m || (d.current = m, u.forEach((g) => g()));
  }, p = Fe(() => {
    Dr(i.root, i.root.committedVersion), r.forEach((g) => {
      je && i.devStrictMode && g(), g();
    }), Dr(i.root, i.root.committedVersion + i.root.changelog.length), je && i.devStrictMode && ii(i.root.context, () => _t(i, c.current));
    const m = ii(i.root.context, () => _t(i, c.current));
    if (e.isDirty)
      throw new Error("Scheduler is dirty, this should never happen");
    Sn(i.root), r.length = 0, l.current && Ur(i), h(m);
  });
  return Q(() => (l.current = !0, () => {
    l.current = !1, pr(i);
  }), [i]), Q(() => {
    c.current = [t], Sn(i.root), r.splice(0, s), i.root.context = o, Ur(i), h(a);
  }), ce(() => ({
    getValue: () => d.current,
    subscribe: (m) => (u.add(m), () => u.delete(m))
  }), [u]);
}, Qm = () => {
  const t = Z(0), e = t.current, r = Tt();
  return {
    version: e,
    markDirty: ce(() => () => {
      var n;
      t.current++, (n = r == null ? void 0 : r.markDirty) == null || n.call(r);
    }, [r]),
    root: r.root
  };
}, Ym = () => {
  const t = ce(() => fc((i, o) => {
    let s = !1;
    n((a) => (s = !i(), s ? a : a + 1)), s || r(o);
  }), []), [e, r] = zm((i, o) => (Dr(t, i), i + (o() ? 1 : 0)), 0), [, n] = ve(0);
  return Dr(t, e), {
    root: t,
    version: e,
    markDirty: void 0
  };
}, _o = () => {
  const t = Ec(), { root: e, version: r, markDirty: n } = Gt() ? Qm() : Ym();
  return {
    version: r,
    createFiber: kt((i, o, s) => Ic(i, e, s ? () => {
      s(), n == null || n();
    } : n, t()), [])
  };
}, Ac = (t, e, r) => {
  const n = Z(null), i = n.current ?? (n.current = {
    wipDeps: null,
    wip: null,
    currentDeps: null,
    current: null
  });
  return i.wipDeps = i.currentDeps, i.wip = i.current, Q(() => {
    i.currentDeps = i.wipDeps, i.current = i.wip;
  }), !r && i.currentDeps && Un(i.currentDeps, e) ? i.current : (i.wipDeps = e, i.wip = t(), i.wip);
};
function Ne(t) {
  const { version: e, createFiber: r } = _o(), n = ce(() => r(t.hook, t.key), [
    t.hook,
    t.key,
    r
  ]), i = Ac(() => ({ value: _t(n, t.args) }), [
    n,
    e,
    t.args
  ], bo(n));
  return Q(() => () => pr(n), [n]), Q(() => {
    Ur(n);
  }, [n, i]), i.value;
}
const Ns = (t, e) => {
  const r = t.get(e);
  r && (r.isDirty = !0);
}, Jm = (t, e) => !t.isDirty && !bo(t.fiber) && e !== void 0 && t.committedDeps !== void 0 && Un(t.committedDeps, e), Xm = (t) => {
  if (!pc())
    return !1;
  for (const { fiber: e } of t.values())
    if (bo(e))
      return !0;
  return !1;
};
function qn(t) {
  const e = ce(() => /* @__PURE__ */ new Map(), []), { version: r, createFiber: n } = _o(), i = Xm(e), o = Ac(() => {
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
          const p = n(d.hook, d.key, () => Ns(e, u)), m = _t(p, d.args);
          h.next = {
            value: m,
            deps: d.deps,
            remount: p
          };
        } else if (Jm(h, d.deps))
          h.fiber.contextDeps && hc(h.fiber, h.fiber.contextDeps), h.next = "skip";
        else {
          const p = _t(h.fiber, d.args);
          h.next = {
            value: p,
            deps: d.deps
          };
        }
      else {
        const p = n(d.hook, d.key, () => Ns(e, u));
        h = {
          fiber: p,
          next: {
            value: _t(p, d.args),
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
    n,
    r
  ], i);
  return Q(() => () => {
    for (const s of e.keys()) {
      const a = e.get(s).fiber;
      pr(a);
    }
  }, [e]), Q(() => {
    for (const [s, a] of e.entries()) {
      const l = a.next;
      l === "delete" ? (a.fiber.isMounted && pr(a.fiber), e.delete(s)) : l === "skip" || (l.remount && (pr(a.fiber), a.fiber = l.remount), Ur(a.fiber), a.committedDeps = l.deps, a.committedValue = l.value, a.isDirty = !1);
    }
  }, [o, e]), o;
}
const Zm = (t) => t(), ef = (t) => {
  const { createFiber: e } = _o(), r = ce(() => e(Zm, void 0), [e]), n = _t(r, [t]);
  Q(() => () => {
    pr(r);
  }, [r]);
  let i = !1;
  const o = () => {
    i && r.isMounted || (i = !0, Ur(r));
  };
  return Q(o), {
    value: n,
    effects: o
  };
}, tf = () => {
  const t = A(4), [e, r] = ve(nf);
  let n;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (n = (l, c) => (r((d) => ({
    ...d,
    renderers: {
      ...d.renderers,
      [l]: [...d.renderers[l] ?? [], c]
    }
  })), () => {
    r((d) => {
      var u;
      return {
        ...d,
        renderers: {
          ...d.renderers,
          [l]: ((u = d.renderers[l]) == null ? void 0 : u.filter((h) => h !== c)) ?? []
        }
      };
    });
  }), t[0] = n) : n = t[0];
  const i = n;
  let o;
  t[1] === Symbol.for("react.memo_cache_sentinel") ? (o = (l) => (r((c) => ({
    ...c,
    fallbacks: [...c.fallbacks, l]
  })), () => {
    r((c) => ({
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
}, rf = le(tf);
function nf() {
  return {
    renderers: {},
    fallbacks: []
  };
}
const of = (t) => {
  const e = Array.from(t).map((n) => n.getModelContext()).sort((n, i) => (i.priority ?? 0) - (n.priority ?? 0)), r = {};
  return e.reduce((n, i) => {
    var s;
    const o = i.priority ?? 0;
    if (i.system && (n.system ? n.system += `

${i.system}` : n.system = i.system), i.tools)
      for (const [a, l] of Object.entries(i.tools)) {
        const c = (s = n.tools) == null ? void 0 : s[a];
        if (c && c !== l) {
          const d = r[a];
          if (d === o)
            throw new Error(`You tried to define a tool with the name ${a}, but it already exists.`);
          const u = d > o ? c : l, h = d > o ? l : c;
          n.tools[a] = {
            ...h,
            ...u
          }, r[a] = Math.max(d, o);
          continue;
        }
        n.tools || (n.tools = {}), n.tools[a] = l, r[a] ?? (r[a] = o);
      }
    return i.config && (n.config = {
      ...n.config,
      ...i.config
    }), i.callSettings && (n.callSettings = {
      ...n.callSettings,
      ...i.callSettings
    }), i.unstable_composerMetadata && (n.unstable_composerMetadata = {
      ...n.unstable_composerMetadata,
      ...i.unstable_composerMetadata
    }), n;
  }, {});
};
var So = class {
  constructor() {
    C(this, "_providers", /* @__PURE__ */ new Set());
    C(this, "_subscribers", /* @__PURE__ */ new Set());
  }
  getModelContext() {
    return of(this._providers);
  }
  registerModelContextProvider(t) {
    var r;
    this._providers.add(t);
    const e = (r = t.subscribe) == null ? void 0 : r.call(t, () => {
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
const Li = [], sf = {
  modelName: void 0,
  toolNames: Li
}, af = (t, e) => t === e || t.length === e.length && t.every((r, n) => r === e[n]), sn = (t, e) => {
  var s;
  const r = t.getModelContext(), n = (s = r.config) == null ? void 0 : s.modelName, i = r.tools ? Object.keys(r.tools).sort() : Li, o = i.length ? i : Li;
  return n === e.modelName && af(o, e.toolNames) ? e : {
    modelName: n,
    toolNames: o
  };
}, lf = () => {
  const t = A(11);
  let e;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (e = new So(), t[0] = e) : e = t[0];
  const r = e;
  let n;
  t[1] === Symbol.for("react.memo_cache_sentinel") ? (n = () => sn(r, sf), t[1] = n) : n = t[1];
  const [i, o] = ve(n);
  let s, a;
  t[2] === Symbol.for("react.memo_cache_sentinel") ? (s = () => (o((p) => sn(r, p)), r.subscribe(() => {
    o((p) => sn(r, p));
  })), a = [r], t[2] = s, t[3] = a) : (s = t[2], a = t[3]), Q(s, a);
  let l;
  t[4] !== i ? (l = () => sn(r, i), t[4] = i, t[5] = l) : l = t[5];
  let c, d, u;
  t[6] === Symbol.for("react.memo_cache_sentinel") ? (c = () => r.getModelContext(), d = (p) => r.subscribe(p), u = (p) => r.registerModelContextProvider(p), t[6] = c, t[7] = d, t[8] = u) : (c = t[6], d = t[7], u = t[8]);
  let h;
  return t[9] !== l ? (h = {
    getState: l,
    getModelContext: c,
    subscribe: d,
    register: u
  }, t[9] = l, t[10] = h) : h = t[10], h;
}, Rc = le(lf), cf = (t) => t.display !== void 0 ? t.display === "standalone" : t.type === "human", uf = (t, e) => {
  var n, i;
  if (!(((n = e.status) == null ? void 0 : n.type) === "running" || ((i = e.status) == null ? void 0 : i.type) === "requires-action")) {
    const o = t.complete;
    return typeof o != "function" ? o ?? null : o({
      args: e.args,
      result: e.result
    });
  }
  const r = t.running;
  return typeof r != "function" ? r ?? null : r({ args: e.args });
}, df = (t) => function(r) {
  return uf(t, r);
}, $i = Symbol("assistant-ui.store.clientIndex"), hf = (t) => t[$i], Pc = Ge([]), Co = () => _c(Pc), pf = (t, e) => {
  const r = A(3), n = Co();
  let i;
  return r[0] !== t || r[1] !== n ? (i = [...n, t], r[0] = t, r[1] = n, r[2] = i) : i = r[2], dc(Pc, i, e);
}, mf = /* @__PURE__ */ new Set([
  "$$typeof",
  "nodeType",
  "then"
]), Hn = (t, e) => {
  if (t === Symbol.toStringTag)
    return e;
  if (typeof t != "symbol") {
    if (t === "toJSON")
      return () => e;
    if (!mf.has(t))
      return !1;
  }
};
var To = class {
  getOwnPropertyDescriptor(t, e) {
    const r = this.get(t, e);
    if (r !== void 0)
      return {
        value: r,
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
const Tn = Symbol("assistant-ui.store.getValue"), ff = (t) => {
  var r;
  const e = t[Tn];
  if (!e)
    throw new Error("Client scope contains a non-client resource. Ensure your Derived get() returns a client created with useClientResource(), not a plain resource.");
  return (r = e.getState) == null ? void 0 : r.call(e);
}, zs = /* @__PURE__ */ new Map();
function gf(t) {
  let e = zs.get(t);
  return e || (e = function(...r) {
    if (!this || typeof this != "object")
      throw new Error(`Method "${String(t)}" called without proper context. This may indicate the function was called incorrectly.`);
    const n = this[Tn];
    if (!n)
      throw new Error(`Method "${String(t)}" called on invalid client proxy. Ensure you are calling this method on a valid client instance.`);
    const i = n[t];
    if (!i)
      throw new Error(`Method "${String(t)}" is not implemented.`);
    if (typeof i != "function")
      throw new Error(`"${String(t)}" is not a function.`);
    return i(...r);
  }, zs.set(t, e)), e;
}
var bf = class extends To {
  constructor(e, r) {
    super();
    C(this, "outputRef");
    C(this, "index");
    C(this, "boundFns");
    C(this, "cachedReceiver");
    this.outputRef = e, this.index = r;
  }
  get(e, r, n) {
    if (r === Tn)
      return this.outputRef.current;
    if (r === $i)
      return this.index;
    const i = Hn(r, "ClientProxy");
    if (i !== !1)
      return i;
    const o = this.outputRef.current[r];
    if (typeof o == "function") {
      this.cachedReceiver !== n && (this.boundFns = /* @__PURE__ */ new Map(), this.cachedReceiver = n);
      let s = this.boundFns.get(r);
      return s || (s = gf(r).bind(n), this.boundFns.set(r, s)), s;
    }
    return o;
  }
  ownKeys() {
    return Object.keys(this.outputRef.current);
  }
  has(e, r) {
    return r === Tn || r === $i ? !0 : r in this.outputRef.current;
  }
};
const Xr = (t) => {
  var o;
  const e = Z(null), r = Co().length, n = ce(() => new Proxy({}, new bf(e, r)), [r]), i = pf(n, function() {
    return Ne(t);
  });
  return e.current || (e.current = i), Q(() => {
    e.current = i;
  }), {
    methods: n,
    state: (o = i.getState) == null ? void 0 : o.call(i),
    key: t.key
  };
}, vf = le(Xr), Nr = Symbol("assistant-ui.store.proxiedAssistantState"), oi = (t) => t === "on" || t === "subscribe" || typeof t == "symbol", Mc = (t) => {
  class e extends To {
    get(n, i) {
      const o = Hn(i, "AssistantState");
      if (o !== !1)
        return o;
      const s = i;
      if (!oi(s))
        return ff(t[s]());
    }
    ownKeys() {
      return Object.keys(t).filter((n) => !oi(n));
    }
    has(n, i) {
      return !oi(i) && i in t;
    }
  }
  return new Proxy({}, new e());
}, wf = (t) => t[Nr], Os = () => () => {
}, Dc = (t) => {
  const e = () => {
    throw new Error(t);
  };
  return e.source = null, e.query = null, e;
};
var yf = class extends To {
  get(t, e) {
    if (e === "subscribe" || e === "on")
      return Os;
    if (e === Nr)
      return xf;
    const r = Hn(e, "DefaultAssistantClient");
    return r !== !1 ? r : Dc("You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.");
  }
  ownKeys() {
    return [
      "subscribe",
      "on",
      Nr
    ];
  }
  has(t, e) {
    return e === "subscribe" || e === "on" || e === Nr;
  }
};
const Gn = new Proxy({}, new yf()), xf = Mc(Gn), kf = () => new Proxy({}, { get(t, e) {
  const r = Hn(e, "AssistantClient");
  return r !== !1 ? r : Dc(`The current scope does not have a "${String(e)}" property.`);
} }), Nc = Ge(Gn), zc = Symbol("assistant-ui.store.useEffects"), _f = () => {
}, Sf = (t) => t[zc] ?? _f, Cf = () => {
  "use no memo";
  return Q(Sf(Oc())), null;
}, Oc = () => We(Nc), Ve = ({ value: t, children: e }) => {
  "use no memo";
  return /* @__PURE__ */ H(Nc.Provider, {
    value: t,
    children: [/* @__PURE__ */ f(Cf, {}), e]
  });
}, Bi = (t) => null, Ue = le(Bi), Fi = Symbol("assistant-ui.transform-scopes");
function Lc(t, e) {
  const r = t;
  if (r[Fi])
    throw new Error("transformScopes is already attached to this resource");
  r[Fi] = e;
}
function Tf(t) {
  return t[Fi];
}
const $c = (t) => typeof t == "string" ? {
  scope: t.split(".")[0],
  event: t
} : {
  scope: t.scope,
  event: t.event
}, Bc = Ge(null), If = (t, e) => dc(Bc, t, e), Fc = () => {
  const t = _c(Bc);
  if (!t)
    throw new Error("AssistantTapContext is not available");
  return t;
}, Uc = () => Fc().clientRef, Io = () => {
  const t = A(3), { emit: e } = Fc(), r = Co();
  let n;
  return t[0] !== r || t[1] !== e ? (n = (i, o) => {
    e(i, o, r);
  }, t[0] = r, t[1] = e, t[2] = n) : n = t[2], Fe(n);
};
function Ef(t, e) {
  const r = { ...t }, n = /* @__PURE__ */ new Set();
  let i = !0;
  for (; i; ) {
    i = !1;
    for (const a of Object.values(r)) {
      if (a.hook === Bi || n.has(a.hook))
        continue;
      n.add(a.hook);
      const l = Tf(a.hook);
      if (l) {
        l(r, e), i = !0;
        break;
      }
    }
  }
  const o = {}, s = {};
  for (const [a, l] of Object.entries(r))
    l.hook === Bi ? s[a] = l : o[a] = l;
  return {
    rootClients: o,
    derivedClients: s
  };
}
const Ls = (t) => ce(() => t, [...Object.entries(t).flat()]), Af = (t, e) => {
  const r = A(6);
  let n;
  r[0] !== e || r[1] !== t ? (n = Ef(t, e), r[0] = e, r[1] = t, r[2] = n) : n = r[2];
  const { rootClients: i, derivedClients: o } = n, s = Ls(i), a = Ls(o);
  let l;
  return r[3] !== s || r[4] !== a ? (l = {
    rootClients: s,
    derivedClients: a
  }, r[3] = s, r[4] = a, r[5] = l) : l = r[5], l;
}, Rf = () => {
  const t = A(3);
  let e;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (e = /* @__PURE__ */ new Map(), t[0] = e) : e = t[0];
  const r = e;
  let n;
  t[1] === Symbol.for("react.memo_cache_sentinel") ? (n = /* @__PURE__ */ new Set(), t[1] = n) : n = t[1];
  const i = n;
  let o;
  if (t[2] === Symbol.for("react.memo_cache_sentinel")) {
    const s = /* @__PURE__ */ new Set();
    o = {
      on(a, l) {
        const c = l;
        if (a === "*")
          return i.add(c), () => i.delete(c);
        let d = r.get(a);
        return d || (d = /* @__PURE__ */ new Set(), r.set(a, d)), d.add(c), () => {
          d.delete(c), d.size === 0 && r.delete(a);
        };
      },
      emit(a, l, c) {
        const d = r.get(a);
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
}, Pf = le(Rf), jc = (t) => ce(() => t, t), Mf = ({ element: t, emit: e, clientRef: r }) => {
  const { methods: n, state: i } = If({
    clientRef: r,
    emit: e
  }, function() {
    return Xr(t);
  });
  return ce(() => ({
    state: i,
    methods: n
  }), [n, i]);
}, Df = ({ element: t, notifications: e, clientRef: r, name: n }) => {
  const i = Km(function() {
    return Mf({
      element: t,
      emit: e.emit,
      clientRef: r
    });
  });
  return Q(() => i.subscribe(e.notifySubscribers), [i, e]), ce(() => {
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
        value: n,
        configurable: !0
      }
    }), o;
  }, [i, n]);
}, Nf = le(Df), zf = () => {
  const t = A(2);
  let e;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (e = [], t[0] = e) : e = t[0];
  let r;
  return t[1] === Symbol.for("react.memo_cache_sentinel") ? (r = {
    clients: e,
    subscribe: void 0,
    on: void 0
  }, t[1] = r) : r = t[1], r;
}, Of = le(zf), Lf = (t) => {
  const e = A(14), { clients: r, clientRef: n } = t;
  let i;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (i = Pf(), e[0] = i) : i = e[0];
  const o = Ne(i);
  let s;
  e[1] !== n.parent || e[2] !== o.notifySubscribers ? (s = () => n.parent.subscribe(o.notifySubscribers), e[1] = n.parent, e[2] = o.notifySubscribers, e[3] = s) : s = e[3];
  let a;
  e[4] !== n || e[5] !== o ? (a = [n, o], e[4] = n, e[5] = o, e[6] = a) : a = e[6], Q(s, a);
  let l;
  e[7] !== n || e[8] !== r || e[9] !== o ? (l = Object.keys(r).map((u) => Ze(u, Nf({
    element: r[u],
    notifications: o,
    clientRef: n,
    name: u
  }))), e[7] = n, e[8] = r, e[9] = o, e[10] = l) : l = e[10];
  const c = jc(qn(l));
  let d;
  return e[11] !== o || e[12] !== c ? (d = {
    notifications: o,
    results: c
  }, e[11] = o, e[12] = c, e[13] = d) : d = e[13], d;
}, $f = (t) => {
  const { clientRef: e } = t, { notifications: r, results: n } = Lf(t);
  return ce(() => ({
    clients: n,
    subscribe: r.subscribe,
    on: function(i, o) {
      if (!this)
        throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
      const { scope: s, event: a } = $c(i);
      if (s !== "*" && this[s].source === null)
        throw new Error(`Scope "${s}" is not available. Use { scope: "*", event: "${a}" } to listen globally.`);
      const l = r.on(a, (d, u) => {
        if (s === "*") {
          o(d);
          return;
        }
        const h = this[s]();
        h === u[hf(h)] && o(d);
      });
      if (s !== "*" && e.parent[s].source === null)
        return l;
      const c = e.parent.on(i, o);
      return () => {
        l(), c();
      };
    }
  }), [
    n,
    r,
    e
  ]);
}, Bf = le($f), Ff = ({ element: t, clientRef: e, name: r }) => {
  const n = Z(t.args[0]);
  return n.current = t.args[0], ce(() => {
    const i = () => n.current.get(e.current);
    return Object.defineProperties(i, {
      source: { value: n.current.source },
      query: { value: n.current.query },
      name: {
        value: r,
        configurable: !0
      }
    }), i;
  }, [e, r]);
}, Uf = le(Ff), jf = (t, e) => {
  let r;
  try {
    const n = {};
    for (const i of Object.keys(e.query).sort())
      n[i] = e.query[i];
    r = JSON.stringify(n);
  } catch {
    r = String(e.query);
  }
  return `${t}::${e.source}::${r}`;
}, Vf = (t) => {
  const e = A(3), { clients: r, clientRef: n } = t;
  let i;
  return e[0] !== n || e[1] !== r ? (i = Object.keys(r).map((o) => {
    const s = o, a = r[s];
    return Ze(jf(s, a.args[0]), Uf({
      element: a,
      clientRef: n,
      name: s
    }));
  }), e[0] = n, e[1] = r, e[2] = i) : i = e[2], jc(qn(i));
}, qf = (t) => {
  const e = A(3), { rootClients: r, clientRef: n } = t;
  let i;
  return e[0] !== n || e[1] !== r ? (i = Object.keys(r).length > 0 ? Bf({
    clients: r,
    clientRef: n
  }) : Of(), e[0] = n, e[1] = r, e[2] = i) : i = e[2], Ne(i);
}, Hf = ({ parent: t, clients: e }) => {
  const { rootClients: r, derivedClients: n } = Af(e, t), i = Z({
    parent: t,
    current: null
  }).current;
  Q(() => {
    i.current = a;
  });
  const o = qf({
    rootClients: r,
    clientRef: i
  }), s = Vf({
    clients: n,
    clientRef: i
  }), a = ce(() => {
    const l = t === Gn ? kf() : t, c = Object.create(l);
    Object.assign(c, {
      subscribe: o.subscribe ?? t.subscribe,
      on: o.on ?? t.on,
      [Nr]: Mc(c)
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
}, Gf = (t) => {
  const { value: e, effects: r } = ef(function() {
    return Hf(t);
  });
  return e[zc] = r, e;
};
function J(t, { parent: e } = { parent: Oc() }) {
  if (t)
    return Gf({
      parent: e ?? Gn,
      clients: t
    });
  if (e === null)
    throw new Error("received null parent, this usage is not allowed");
  return e;
}
const L = (t) => {
  const e = A(6), r = J();
  let n;
  e[0] !== r ? (n = wf(r), e[0] = r, e[1] = n) : n = e[1];
  const i = n;
  let o, s;
  e[2] !== i || e[3] !== t ? (o = () => t(i), s = () => t(i), e[2] = i, e[3] = t, e[4] = o, e[5] = s) : (o = e[4], s = e[5]);
  const a = vr(r.subscribe, o, s);
  if (a === i)
    throw new Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
  return Om(a), a;
}, Ut = (t) => {
  const { children: e, condition: r } = t;
  return L(r) ? e : null;
};
Ut.displayName = "AuiIf";
const Wf = (t) => {
  const e = J(), r = Z(!1), n = r.current ? null : t(e);
  return L(() => r.current ? t(e) : n), () => (r.current = !0, t(e));
}, Kf = Object.freeze({});
function wr(t) {
  const e = A(3), { getItemState: r, children: n } = t, i = Wf(r);
  let o;
  return e[0] !== n || e[1] !== i ? (o = n(i), e[0] = n, e[1] = i, e[2] = o) : o = e[2], Qf(o);
}
const Qf = (t) => {
  const e = typeof t == "object" && t != null && "type" in t ? t : null, r = e == null ? void 0 : e.type, n = e == null ? void 0 : e.key;
  return ce(() => e, [
    r,
    n,
    typeof (e == null ? void 0 : e.props) == "object" && e.props != null && Object.entries(e.props).length === 0 ? Kf : e == null ? void 0 : e.props
  ]) ?? t;
}, Yf = _e.createContext(!0);
function $s() {
  throw new Error("A function wrapped in useEffectEvent can't be called during rendering.");
}
const Jf = "use" in _e ? () => {
  try {
    return _e.use(Yf);
  } catch {
    return !1;
  }
} : () => !1;
function Xf(t) {
  const e = _e.useRef($s);
  return _e.useInsertionEffect(() => {
    e.current = t;
  }, [t]), (...r) => {
    Jf() && $s();
    const n = e.current;
    return n(...r);
  };
}
const jr = (t, e) => {
  const r = A(11), n = J(), i = Xf(e);
  let o;
  r[0] !== t ? (o = $c(t), r[0] = t, r[1] = o) : o = r[1];
  const { scope: s, event: a } = o;
  let l;
  r[2] !== n || r[3] !== i || r[4] !== a || r[5] !== s ? (l = () => n.on({
    scope: s,
    event: a
  }, i), r[2] = n, r[3] = i, r[4] = a, r[5] = s, r[6] = l) : l = r[6];
  let c;
  r[7] !== n || r[8] !== a || r[9] !== s ? (c = [
    n,
    s,
    a
  ], r[7] = n, r[8] = a, r[9] = s, r[10] = c) : c = r[10], Q(l, c);
}, Zf = (t) => {
  if (t.key === void 0)
    throw new Error("useClientLookup: Element has no key");
  return t.key;
};
function jt(t) {
  const e = A(15);
  let r;
  e[0] !== t ? (r = t.map(rg), e[0] = t, e[1] = r) : r = e[1];
  const n = qn(r);
  let i;
  e[2] !== n ? (i = Object.keys(n), e[2] = n, e[3] = i) : i = e[3];
  const o = i;
  let s;
  e[4] !== n ? (s = n.reduce(tg, {}), e[4] = n, e[5] = s) : s = e[5];
  const a = s;
  let l;
  e[6] !== n ? (l = n.map(eg), e[6] = n, e[7] = l) : l = e[7];
  const c = l;
  let d;
  e[8] !== a || e[9] !== o || e[10] !== n ? (d = (h) => {
    if ("index" in h) {
      if (h.index < 0 || h.index >= o.length)
        throw new Error(`useClientLookup: Index ${h.index} out of bounds (length: ${o.length})`);
      return n[h.index].methods;
    }
    const p = a[h.key];
    if (p === void 0)
      throw new Error(`useClientLookup: Key "${h.key}" not found`);
    return n[p].methods;
  }, e[8] = a, e[9] = o, e[10] = n, e[11] = d) : d = e[11];
  let u;
  return e[12] !== c || e[13] !== d ? (u = {
    state: c,
    get: d
  }, e[12] = c, e[13] = d, e[14] = u) : u = e[14], u;
}
function eg(t) {
  return t.state;
}
function tg(t, e, r) {
  return t[e.key] = r, t;
}
function rg(t) {
  return Ze(Zf(t), vf(t), t.deps);
}
const Vc = (t) => {
  const e = A(15), { toolkit: r, mcpApp: n } = t;
  let i;
  e[0] !== n ? (i = n ? [Ze("mcpApp", n)] : [], e[0] = n, e[1] = i) : i = e[1];
  const o = qn(i)[0], [s, a] = ve(ig);
  let l;
  e[2] !== s ? (l = Object.fromEntries(Object.entries(s).map(sg)), e[2] = s, e[3] = l) : l = e[3];
  let c;
  e[4] !== o || e[5] !== l || e[6] !== s ? (c = {
    toolUIs: s,
    mcpApp: o,
    tools: l
  }, e[4] = o, e[5] = l, e[6] = s, e[7] = c) : c = e[7];
  const d = c, u = Uc();
  let h;
  e[8] === Symbol.for("react.memo_cache_sentinel") ? (h = (b, k, x) => {
    const T = {
      render: k,
      standalone: (x == null ? void 0 : x.standalone) ?? !1
    };
    return a((E) => ({
      ...E,
      [b]: [...E[b] ?? [], T]
    })), () => {
      a((E) => {
        var R;
        const y = ((R = E[b]) == null ? void 0 : R.filter((D) => D !== T)) ?? [];
        if (y.length > 0)
          return {
            ...E,
            [b]: y
          };
        const P = { ...E };
        return delete P[b], P;
      });
    };
  }, e[8] = h) : h = e[8];
  const p = h;
  let m, g;
  e[9] !== u || e[10] !== r ? (m = () => {
    if (!r)
      return;
    const b = [];
    for (const [x, T] of Object.entries(r)) {
      const E = "render" in T ? T.render : void 0, y = "renderText" in T ? T.renderText : void 0, P = E ?? (y ? df(y) : void 0);
      P && b.push(p(x, P, { standalone: cf(T) }));
    }
    const k = Object.entries(r).reduce(ag, {});
    return b.push(u.current.modelContext().register({ getModelContext: () => ({ tools: k }) })), () => {
      b.forEach(lg);
    };
  }, g = [
    r,
    p,
    u
  ], e[9] = u, e[10] = r, e[11] = m, e[12] = g) : (m = e[11], g = e[12]), Q(m, g);
  let v;
  return e[13] !== d ? (v = {
    getState: () => d,
    setToolUI: p
  }, e[13] = d, e[14] = v) : v = e[14], v;
}, ng = le(Vc);
Lc(Vc, (t, e) => {
  !t.modelContext && e.modelContext.source === null && (t.modelContext = Rc());
});
function ig() {
  return {};
}
function og(t) {
  return t.render;
}
function sg(t) {
  const [e, r] = t;
  return [e, r.map(og)];
}
function ag(t, e) {
  const [r, n] = e;
  if (n.type === "mcp")
    return t;
  const { display: i, render: o, renderText: s, ...a } = n;
  return t[r] = a, t;
}
function lg(t) {
  return t();
}
const Wt = (t) => vr(t.subscribe, t.getState), cg = (t) => {
  const e = A(8), { runtime: r } = t, n = Wt(r);
  let i;
  e[0] !== n ? (i = () => n, e[0] = n, e[1] = i) : i = e[1];
  let o;
  e[2] !== r ? (o = () => r, e[2] = r, e[3] = o) : o = e[3];
  let s;
  return e[4] !== r.remove || e[5] !== i || e[6] !== o ? (s = {
    getState: i,
    remove: r.remove,
    __internal_getRuntime: o
  }, e[4] = r.remove, e[5] = i, e[6] = o, e[7] = s) : s = e[7], s;
}, qc = le(cg), ug = (t) => {
  const e = A(5), { runtime: r, index: n } = t;
  let i;
  e[0] !== n || e[1] !== r ? (i = r.getAttachmentByIndex(n), e[0] = n, e[1] = r, e[2] = i) : i = e[2];
  const o = i;
  let s;
  return e[3] !== o ? (s = qc({ runtime: o }), e[3] = o, e[4] = s) : s = e[4], Ne(s);
}, dg = le(ug), hg = ({ item: t, onSteer: e, onRemove: r }) => ({
  getState: () => t,
  steer: e,
  remove: r
}), pg = le(hg), mg = (t) => {
  const e = A(55), { threadIdRef: r, messageIdRef: n, runtime: i } = t, o = Wt(i), s = Io();
  let a, l;
  e[0] !== s || e[1] !== n || e[2] !== i || e[3] !== r ? (a = () => {
    const P = [];
    for (const R of ["send", "attachmentAdd"]) {
      const D = i.unstable_on(R, () => {
        s(`composer.${R}`, {
          threadId: r.current,
          ...n && { messageId: n.current }
        });
      });
      P.push(D);
    }
    return P.push(i.unstable_on("attachmentAddError", (R) => {
      s("composer.attachmentAddError", {
        threadId: r.current,
        ...n && { messageId: n.current },
        ...R.attachmentId && { attachmentId: R.attachmentId },
        reason: R.reason,
        message: R.message
      });
    })), () => {
      for (const R of P)
        R();
    };
  }, l = [
    i,
    s,
    r,
    n
  ], e[0] = s, e[1] = n, e[2] = i, e[3] = r, e[4] = a, e[5] = l) : (a = e[4], l = e[5]), Q(a, l);
  let c;
  if (e[6] !== i || e[7] !== o.attachments) {
    let P;
    e[9] !== i ? (P = (R, D) => Ze(R.id, dg({
      runtime: i,
      index: D
    }), [i, D]), e[9] = i, e[10] = P) : P = e[10], c = o.attachments.map(P), e[6] = i, e[7] = o.attachments, e[8] = c;
  } else
    c = e[8];
  const d = jt(c), u = o.queue;
  let h;
  if (e[11] !== u || e[12] !== i) {
    let P;
    e[14] !== i ? (P = (R) => Ze(R.id, pg({
      item: R,
      onSteer: () => i.steerQueueItem(R.id),
      onRemove: () => i.removeQueueItem(R.id)
    })), e[14] = i, e[15] = P) : P = e[15], h = u.map(P), e[11] = u, e[12] = i, e[13] = h;
  } else
    h = e[13];
  const p = jt(h), m = o.type ?? "thread";
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
  const v = g;
  let b;
  e[30] !== v ? (b = () => v, e[30] = v, e[31] = b) : b = e[31];
  const k = i.beginEdit ?? fg;
  let x;
  e[32] !== d ? (x = (P) => "id" in P ? d.get({ key: P.id }) : d.get(P), e[32] = d, e[33] = x) : x = e[33];
  let T;
  e[34] !== p ? (T = (P) => p.get(P), e[34] = p, e[35] = T) : T = e[35];
  let E;
  e[36] !== i ? (E = () => i, e[36] = i, e[37] = E) : E = e[37];
  let y;
  return e[38] !== i.addAttachment || e[39] !== i.cancel || e[40] !== i.clearAttachments || e[41] !== i.reset || e[42] !== i.send || e[43] !== i.setQuote || e[44] !== i.setRole || e[45] !== i.setRunConfig || e[46] !== i.setText || e[47] !== i.startDictation || e[48] !== i.stopDictation || e[49] !== T || e[50] !== E || e[51] !== b || e[52] !== k || e[53] !== x ? (y = {
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
    __internal_getRuntime: E
  }, e[38] = i.addAttachment, e[39] = i.cancel, e[40] = i.clearAttachments, e[41] = i.reset, e[42] = i.send, e[43] = i.setQuote, e[44] = i.setRole, e[45] = i.setRunConfig, e[46] = i.setText, e[47] = i.startDictation, e[48] = i.stopDictation, e[49] = T, e[50] = E, e[51] = b, e[52] = k, e[53] = x, e[54] = y) : y = e[54], y;
}, Hc = le(mg);
function fg() {
  throw new Error("beginEdit is not supported in this runtime");
}
const Gc = (t) => ({ get current() {
  return t();
} }), gg = (t) => {
  const e = A(13), { runtime: r } = t, n = Wt(r);
  let i;
  e[0] !== n ? (i = () => n, e[0] = n, e[1] = i) : i = e[1];
  let o, s, a, l;
  e[2] !== r ? (o = (d) => r.addToolResult(d), s = (d) => r.resumeToolCall(d), a = (d) => r.respondToToolApproval(d), l = () => r, e[2] = r, e[3] = o, e[4] = s, e[5] = a, e[6] = l) : (o = e[3], s = e[4], a = e[5], l = e[6]);
  let c;
  return e[7] !== i || e[8] !== o || e[9] !== s || e[10] !== a || e[11] !== l ? (c = {
    getState: i,
    addToolResult: o,
    resumeToolCall: s,
    respondToToolApproval: a,
    __internal_getRuntime: l
  }, e[7] = i, e[8] = o, e[9] = s, e[10] = a, e[11] = l, e[12] = c) : c = e[12], c;
}, bg = le(gg), vg = (t) => {
  const e = A(5), { runtime: r, index: n } = t;
  let i;
  e[0] !== n || e[1] !== r ? (i = r.getAttachmentByIndex(n), e[0] = n, e[1] = r, e[2] = i) : i = e[2];
  const o = i;
  let s;
  return e[3] !== o ? (s = qc({ runtime: o }), e[3] = o, e[4] = s) : s = e[4], Ne(s);
}, wg = le(vg), yg = (t) => {
  const e = A(5), { runtime: r, index: n } = t;
  let i;
  e[0] !== n || e[1] !== r ? (i = r.getMessagePartByIndex(n), e[0] = n, e[1] = r, e[2] = i) : i = e[2];
  const o = i;
  let s;
  return e[3] !== o ? (s = bg({ runtime: o }), e[3] = o, e[4] = s) : s = e[4], Ne(s);
}, xg = le(yg), kg = (t) => {
  const e = A(55), { runtime: r, threadIdRef: n } = t, i = Wt(r), [o, s] = ve(!1), [a, l] = ve(!1);
  let c;
  e[0] !== r ? (c = Gc(() => r.getState().id), e[0] = r, e[1] = c) : c = e[1];
  const d = c;
  let u;
  e[2] !== d || e[3] !== r.composer || e[4] !== n ? (u = Hc({
    runtime: r.composer,
    threadIdRef: n,
    messageIdRef: d
  }), e[2] = d, e[3] = r.composer, e[4] = n, e[5] = u) : u = e[5];
  const h = Xr(u);
  let p;
  if (e[6] !== r || e[7] !== i.content) {
    let B;
    e[9] !== r ? (B = (W, w) => Ze("toolCallId" in W && W.toolCallId != null ? `toolCallId-${W.toolCallId}` : `index-${w}`, xg({
      runtime: r,
      index: w
    }), [r, w]), e[9] = r, e[10] = B) : B = e[10], p = i.content.map(B), e[6] = r, e[7] = i.content, e[8] = p;
  } else
    p = e[8];
  const m = jt(p);
  let g;
  e[11] !== i.attachments ? (g = i.attachments ?? [], e[11] = i.attachments, e[12] = g) : g = e[12];
  let v;
  if (e[13] !== r || e[14] !== g) {
    let B;
    e[16] !== r ? (B = (W, w) => Ze(W.id, wg({
      runtime: r,
      index: w
    }), [r, w]), e[16] = r, e[17] = B) : B = e[17], v = g.map(B), e[13] = r, e[14] = g, e[15] = v;
  } else
    v = e[15];
  const b = jt(v), k = i;
  let x;
  e[18] !== h.state || e[19] !== o || e[20] !== a || e[21] !== m.state || e[22] !== k ? (x = {
    ...k,
    parts: m.state,
    composer: h.state,
    isCopied: o,
    isHovering: a
  }, e[18] = h.state, e[19] = o, e[20] = a, e[21] = m.state, e[22] = k, e[23] = x) : x = e[23];
  const T = x;
  let E;
  e[24] !== T ? (E = () => T, e[24] = T, e[25] = E) : E = e[25];
  let y;
  e[26] !== h.methods ? (y = () => h.methods, e[26] = h.methods, e[27] = y) : y = e[27];
  let P, R, D, _, I, M, N;
  e[28] !== r ? (P = () => r.delete(), R = (B) => r.reload(B), D = () => r.speak(), _ = () => r.stopSpeaking(), I = (B) => r.submitFeedback(B), M = (B) => r.switchToBranch(B), N = () => r.unstable_getCopyText(), e[28] = r, e[29] = P, e[30] = R, e[31] = D, e[32] = _, e[33] = I, e[34] = M, e[35] = N) : (P = e[29], R = e[30], D = e[31], _ = e[32], I = e[33], M = e[34], N = e[35]);
  let $;
  e[36] !== m ? ($ = (B) => "index" in B ? m.get({ index: B.index }) : m.get({ key: `toolCallId-${B.toolCallId}` }), e[36] = m, e[37] = $) : $ = e[37];
  let O;
  e[38] !== b ? (O = (B) => "id" in B ? b.get({ key: B.id }) : b.get(B), e[38] = b, e[39] = O) : O = e[39];
  let j;
  e[40] !== r ? (j = () => r, e[40] = r, e[41] = j) : j = e[41];
  let G;
  return e[42] !== P || e[43] !== R || e[44] !== D || e[45] !== _ || e[46] !== I || e[47] !== M || e[48] !== N || e[49] !== $ || e[50] !== O || e[51] !== j || e[52] !== E || e[53] !== y ? (G = {
    getState: E,
    composer: y,
    delete: P,
    reload: R,
    speak: D,
    stopSpeaking: _,
    submitFeedback: I,
    switchToBranch: M,
    getCopyText: N,
    part: $,
    attachment: O,
    setIsCopied: s,
    setIsHovering: l,
    __internal_getRuntime: j
  }, e[42] = P, e[43] = R, e[44] = D, e[45] = _, e[46] = I, e[47] = M, e[48] = N, e[49] = $, e[50] = O, e[51] = j, e[52] = E, e[53] = y, e[54] = G) : G = e[54], G;
}, _g = le(kg), Sg = (t) => {
  const e = A(6), { runtime: r, id: n, threadIdRef: i } = t;
  let o;
  e[0] !== n || e[1] !== r ? (o = r.getMessageById(n), e[0] = n, e[1] = r, e[2] = o) : o = e[2];
  const s = o;
  let a;
  return e[3] !== s || e[4] !== i ? (a = _g({
    runtime: s,
    threadIdRef: i
  }), e[3] = s, e[4] = i, e[5] = a) : a = e[5], Ne(a);
}, Cg = le(Sg), Tg = (t) => {
  const e = A(58), { runtime: r } = t, n = Wt(r), i = Io();
  let o, s;
  e[0] !== i || e[1] !== r ? (o = () => {
    const E = [];
    for (const y of [
      "runStart",
      "runEnd",
      "initialize",
      "modelContextUpdate"
    ]) {
      const P = r.unstable_on(y, () => {
        var D;
        const R = ((D = r.getState()) == null ? void 0 : D.threadId) || "unknown";
        i(`thread.${y}`, { threadId: R });
      });
      E.push(P);
    }
    return () => {
      for (const y of E)
        y();
    };
  }, s = [r, i], e[0] = i, e[1] = r, e[2] = o, e[3] = s) : (o = e[2], s = e[3]), Q(o, s);
  let a;
  e[4] !== r ? (a = Gc(() => r.getState().threadId), e[4] = r, e[5] = a) : a = e[5];
  const l = a;
  let c;
  e[6] !== r.composer || e[7] !== l ? (c = Hc({
    runtime: r.composer,
    threadIdRef: l
  }), e[6] = r.composer, e[7] = l, e[8] = c) : c = e[8];
  const d = Xr(c);
  let u;
  if (e[9] !== r || e[10] !== n.messages || e[11] !== l) {
    let E;
    e[13] !== r || e[14] !== l ? (E = (y) => Ze(y.id, Cg({
      runtime: r,
      id: y.id,
      threadIdRef: l
    }), [
      r,
      y.id,
      l
    ]), e[13] = r, e[14] = l, e[15] = E) : E = e[15], u = n.messages.map(E), e[9] = r, e[10] = n.messages, e[11] = l, e[12] = u;
  } else
    u = e[12];
  const h = jt(u), p = h.state.length === 0 && !n.isLoading;
  let m;
  e[16] !== d.state || e[17] !== h.state || e[18] !== n.capabilities || e[19] !== n.extras || e[20] !== n.isDisabled || e[21] !== n.isLoading || e[22] !== n.isRunning || e[23] !== n.speech || e[24] !== n.state || e[25] !== n.suggestions || e[26] !== n.voice || e[27] !== p ? (m = {
    isEmpty: p,
    isDisabled: n.isDisabled,
    isLoading: n.isLoading,
    isRunning: n.isRunning,
    capabilities: n.capabilities,
    state: n.state,
    suggestions: n.suggestions,
    extras: n.extras,
    speech: n.speech,
    voice: n.voice,
    composer: d.state,
    messages: h.state
  }, e[16] = d.state, e[17] = h.state, e[18] = n.capabilities, e[19] = n.extras, e[20] = n.isDisabled, e[21] = n.isLoading, e[22] = n.isRunning, e[23] = n.speech, e[24] = n.state, e[25] = n.suggestions, e[26] = n.voice, e[27] = p, e[28] = m) : m = e[28];
  const g = m;
  let v;
  e[29] !== g ? (v = () => g, e[29] = g, e[30] = v) : v = e[30];
  let b;
  e[31] !== d.methods ? (b = () => d.methods, e[31] = d.methods, e[32] = b) : b = e[32];
  let k;
  e[33] !== h ? (k = (E) => "id" in E ? h.get({ key: E.id }) : h.get(E), e[33] = h, e[34] = k) : k = e[34];
  let x;
  e[35] !== r ? (x = () => r, e[35] = r, e[36] = x) : x = e[36];
  let T;
  return e[37] !== r.append || e[38] !== r.cancelRun || e[39] !== r.connectVoice || e[40] !== r.deleteMessage || e[41] !== r.disconnectVoice || e[42] !== r.export || e[43] !== r.getModelContext || e[44] !== r.getVoiceVolume || e[45] !== r.import || e[46] !== r.muteVoice || e[47] !== r.reset || e[48] !== r.resumeRun || e[49] !== r.startRun || e[50] !== r.stopSpeaking || e[51] !== r.subscribeVoiceVolume || e[52] !== r.unmuteVoice || e[53] !== k || e[54] !== x || e[55] !== v || e[56] !== b ? (T = {
    getState: v,
    composer: b,
    append: r.append,
    deleteMessage: r.deleteMessage,
    startRun: r.startRun,
    resumeRun: r.resumeRun,
    cancelRun: r.cancelRun,
    getModelContext: r.getModelContext,
    export: r.export,
    import: r.import,
    reset: r.reset,
    stopSpeaking: r.stopSpeaking,
    connectVoice: r.connectVoice,
    disconnectVoice: r.disconnectVoice,
    getVoiceVolume: r.getVoiceVolume,
    subscribeVoiceVolume: r.subscribeVoiceVolume,
    muteVoice: r.muteVoice,
    unmuteVoice: r.unmuteVoice,
    message: k,
    __internal_getRuntime: x
  }, e[37] = r.append, e[38] = r.cancelRun, e[39] = r.connectVoice, e[40] = r.deleteMessage, e[41] = r.disconnectVoice, e[42] = r.export, e[43] = r.getModelContext, e[44] = r.getVoiceVolume, e[45] = r.import, e[46] = r.muteVoice, e[47] = r.reset, e[48] = r.resumeRun, e[49] = r.startRun, e[50] = r.stopSpeaking, e[51] = r.subscribeVoiceVolume, e[52] = r.unmuteVoice, e[53] = k, e[54] = x, e[55] = v, e[56] = b, e[57] = T) : T = e[57], T;
}, Ig = le(Tg), Eg = (t) => {
  const e = A(20), { runtime: r } = t, n = Wt(r), i = Io();
  let o, s;
  e[0] !== i || e[1] !== r ? (o = () => {
    const d = [];
    for (const u of ["switchedTo", "switchedAway"]) {
      const h = r.unstable_on(u, () => {
        i(`threadListItem.${u}`, { threadId: r.getState().id });
      });
      d.push(h);
    }
    return () => {
      for (const u of d)
        u();
    };
  }, s = [r, i], e[0] = i, e[1] = r, e[2] = o, e[3] = s) : (o = e[2], s = e[3]), Q(o, s);
  let a;
  e[4] !== n ? (a = () => n, e[4] = n, e[5] = a) : a = e[5];
  let l;
  e[6] !== r ? (l = () => r, e[6] = r, e[7] = l) : l = e[7];
  let c;
  return e[8] !== r.archive || e[9] !== r.delete || e[10] !== r.detach || e[11] !== r.generateTitle || e[12] !== r.initialize || e[13] !== r.rename || e[14] !== r.switchTo || e[15] !== r.unarchive || e[16] !== r.updateCustom || e[17] !== a || e[18] !== l ? (c = {
    getState: a,
    switchTo: r.switchTo,
    rename: r.rename,
    updateCustom: r.updateCustom,
    archive: r.archive,
    unarchive: r.unarchive,
    delete: r.delete,
    generateTitle: r.generateTitle,
    initialize: r.initialize,
    detach: r.detach,
    __internal_getRuntime: l
  }, e[8] = r.archive, e[9] = r.delete, e[10] = r.detach, e[11] = r.generateTitle, e[12] = r.initialize, e[13] = r.rename, e[14] = r.switchTo, e[15] = r.unarchive, e[16] = r.updateCustom, e[17] = a, e[18] = l, e[19] = c) : c = e[19], c;
}, Wc = le(Eg), Ag = (t) => {
  const e = A(5), { runtime: r, id: n } = t;
  let i;
  e[0] !== n || e[1] !== r ? (i = r.getItemById(n), e[0] = n, e[1] = r, e[2] = i) : i = e[2];
  const o = i;
  let s;
  return e[3] !== o ? (s = Wc({ runtime: o }), e[3] = o, e[4] = s) : s = e[4], Ne(s);
}, Rg = le(Ag), Pg = (t) => {
  const e = A(40), { runtime: r, __internal_assistantRuntime: n } = t, i = Wt(r);
  let o;
  e[0] !== r.main ? (o = Ig({ runtime: r.main }), e[0] = r.main, e[1] = o) : o = e[1];
  const s = Xr(o);
  let a;
  e[2] !== r || e[3] !== i.threadItems ? (a = Object.keys(i.threadItems).map((y) => Ze(y, Rg({
    runtime: r,
    id: y
  }), [r, y])), e[2] = r, e[3] = i.threadItems, e[4] = a) : a = e[4];
  const l = jt(a), c = i.newThreadId ?? null;
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
    const { index: P, archived: R } = y, D = R !== void 0 && R ? u.archivedThreadIds[P] : u.threadIds[P];
    return l.get({ key: D });
  }, e[19] = u, e[20] = l, e[21] = m) : m = e[21];
  let g, v, b, k, x;
  e[22] !== r ? (k = async (y, P) => {
    await r.switchToThread(y, P);
  }, x = async () => {
    await r.switchToNewThread();
  }, g = () => r.getLoadThreadsPromise(), v = () => r.reload(), b = () => r.loadMore(), e[22] = r, e[23] = g, e[24] = v, e[25] = b, e[26] = k, e[27] = x) : (g = e[23], v = e[24], b = e[25], k = e[26], x = e[27]);
  let T;
  e[28] !== n ? (T = () => n, e[28] = n, e[29] = T) : T = e[29];
  let E;
  return e[30] !== g || e[31] !== v || e[32] !== b || e[33] !== T || e[34] !== h || e[35] !== p || e[36] !== m || e[37] !== k || e[38] !== x ? (E = {
    getState: h,
    thread: p,
    item: m,
    switchToThread: k,
    switchToNewThread: x,
    getLoadThreadsPromise: g,
    reload: v,
    loadMore: b,
    __internal_getAssistantRuntime: T
  }, e[30] = g, e[31] = v, e[32] = b, e[33] = T, e[34] = h, e[35] = p, e[36] = m, e[37] = k, e[38] = x, e[39] = E) : E = e[39], E;
}, Mg = le(Pg), Dg = (t) => ({ getState: () => t }), Ng = le(Dg), zg = (t) => {
  const e = A(11);
  let r;
  e[0] !== t ? (r = () => ({ suggestions: (t ?? []).map(Lg) }), e[0] = t, e[1] = r) : r = e[1];
  const [n] = ve(r);
  let i;
  e[2] !== n.suggestions ? (i = n.suggestions.map($g), e[2] = n.suggestions, e[3] = i) : i = e[3];
  const o = jt(i);
  let s;
  e[4] !== n ? (s = () => n, e[4] = n, e[5] = s) : s = e[5];
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
}, Og = le(zg);
function Lg(t) {
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
function $g(t, e) {
  return Ze(e, Ng(t), [t]);
}
const Bg = (t, e) => {
  t.thread ?? (t.thread = Ue({
    source: "threads",
    query: { type: "main" },
    get: (r) => r.threads().thread("main")
  })), t.threadListItem ?? (t.threadListItem = Ue({
    source: "threads",
    query: { type: "main" },
    get: (r) => r.threads().item("main")
  })), t.composer ?? (t.composer = Ue({
    source: "thread",
    query: {},
    get: (r) => r.threads().thread("main").composer()
  })), !t.modelContext && e.modelContext.source === null && (t.modelContext = Rc()), !t.suggestions && e.suggestions.source === null && (t.suggestions = Og());
}, Kc = (t) => {
  const e = A(6), r = Uc();
  let n, i;
  e[0] !== r || e[1] !== t ? (n = () => t.registerModelContextProvider(r.current.modelContext()), i = [t, r], e[0] = r, e[1] = t, e[2] = n, e[3] = i) : (n = e[2], i = e[3]), Q(n, i);
  let o;
  return e[4] !== t ? (o = Mg({
    runtime: t.threads,
    __internal_assistantRuntime: t
  }), e[4] = t, e[5] = o) : o = e[5], Ne(o);
}, Fg = le(Kc);
Lc(Kc, (t, e) => {
  Bg(t, e), !t.tools && e.tools.source === null && (t.tools = ng({})), !t.dataRenderers && e.dataRenderers.source === null && (t.dataRenderers = rf());
});
const Ug = (t) => {
  var e;
  return (e = t._core) == null ? void 0 : e.RenderComponent;
}, jg = we(({ runtime: t, aui: e = null, children: r }) => {
  "use no memo";
  const n = J({ threads: Fg(t) }, { parent: e }), i = Ug(t), o = /* @__PURE__ */ H(Ve, {
    value: n,
    children: [i && /* @__PURE__ */ f(i, {}), r]
  });
  return e ? /* @__PURE__ */ f(Ve, {
    value: e,
    children: o
  }) : o;
}), Bs = (t) => {
  let e;
  const r = /* @__PURE__ */ new Set(), n = (c, d) => {
    const u = typeof c == "function" ? c(e) : c;
    if (!Object.is(u, e)) {
      const h = e;
      e = d ?? (typeof u != "object" || u === null) ? u : Object.assign({}, e, u), r.forEach((p) => p(e, h));
    }
  }, i = () => e, a = { setState: n, getState: i, getInitialState: () => l, subscribe: (c) => (r.add(c), () => r.delete(c)) }, l = e = t(n, i, a);
  return a;
}, Vg = (t) => t ? Bs(t) : Bs, qg = (t) => t;
function Hg(t, e = qg) {
  const r = _e.useSyncExternalStore(
    t.subscribe,
    _e.useCallback(() => e(t.getState()), [t, e]),
    _e.useCallback(() => e(t.getInitialState()), [t, e])
  );
  return _e.useDebugValue(r), r;
}
const Fs = (t) => {
  const e = Vg(t), r = (n) => Hg(e, n);
  return Object.assign(r, e), r;
}, mr = (t) => t ? Fs(t) : Fs;
function Ce(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function fr(t, e = 0) {
  return e > 100 ? !1 : t === null || typeof t == "string" || typeof t == "boolean" ? !0 : typeof t == "number" ? !Number.isNaN(t) && Number.isFinite(t) : Array.isArray(t) ? t.every((r) => fr(r, e + 1)) : Ce(t) ? Object.entries(t).every(([r, n]) => typeof r == "string" && fr(n, e + 1)) : !1;
}
const Gg = 100, Ui = (t, e, r) => {
  if (t === e)
    return !0;
  if (r > Gg || t == null || e == null)
    return !1;
  if (Array.isArray(t))
    return !Array.isArray(e) || t.length !== e.length ? !1 : t.every((o, s) => Ui(o, e[s], r + 1));
  if (Array.isArray(e) || !Ce(t) || !Ce(e))
    return !1;
  const n = Object.keys(t), i = Object.keys(e);
  return n.length !== i.length ? !1 : n.every((o) => Object.hasOwn(e, o) && Ui(t[o], e[o], r + 1));
}, Qc = (t, e) => !fr(t) || !fr(e) ? !1 : Ui(t, e, 0);
function Wg(t) {
  const e = t.metadata;
  if (!e || typeof e != "object")
    return;
  const r = e.custom;
  if (!r || typeof r != "object")
    return;
  const n = r.interactables;
  return Array.isArray(n) ? n : void 0;
}
function Kg(t) {
  return `update_${t.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
const Us = (t) => {
  if (!Ce(t))
    return;
  const e = t.id;
  return typeof e == "string" || typeof e == "number" ? e : void 0;
};
function Qg(t, e, r) {
  let n = Array.isArray(e.set) ? [...e.set] : [...t];
  if (e.clear === !0 && (n = []), Array.isArray(e.remove) && e.remove.length > 0) {
    const o = new Set(e.remove);
    n = n.filter((s) => {
      const a = Us(s);
      return a !== void 0 ? !o.has(a) : !o.has(s);
    });
  }
  const i = e.update;
  if (Array.isArray(i) && i.length > 0 && (n = n.map((o) => {
    const s = Us(o);
    if (s === void 0 || !Ce(o))
      return o;
    const a = i.find((l) => Ce(l) && l.id === s);
    return a ? {
      ...o,
      ...a
    } : o;
  })), Array.isArray(e.add) && e.add.length > 0) {
    const o = r ? e.add.map((s) => {
      if (!Ce(s) || s.id !== void 0)
        return s;
      const a = r();
      return a === void 0 ? s : {
        ...s,
        id: a
      };
    }) : e.add;
    n = [...n, ...o];
  }
  return n;
}
function si(t, e, r) {
  if (!Ce(t) || !Ce(e))
    return e;
  const n = Ce(r == null ? void 0 : r.arrayBaseline) ? r.arrayBaseline : t, i = { ...t };
  for (const [o, s] of Object.entries(e)) {
    const a = n[o];
    Array.isArray(a) && Ce(s) ? i[o] = Qg(a, s, r != null && r.idFactory && (r.idKeyedFields === void 0 || r.idKeyedFields.has(o)) ? () => {
      var l;
      return (l = r.idFactory) == null ? void 0 : l.call(r, o);
    } : void 0) : i[o] = s;
  }
  return i;
}
function Yg(t, e) {
  if (!Ce(t) || !Ce(e))
    return;
  for (const i of Object.keys(t))
    if (!(i in e))
      return;
  const r = {};
  for (const [i, o] of Object.entries(e))
    (!(i in t) || !Qc(t[i], o)) && (r[i] = o);
  const n = Object.keys(r).length;
  if (!(n === 0 || n === Object.keys(e).length))
    return r;
}
const Jg = (t) => {
  if (!t || typeof t != "object")
    return;
  const e = t;
  return e.type === "tool-call" ? e : void 0;
}, Xg = (t, e) => {
  if (!t.args || typeof t.args != "object")
    return !1;
  const r = Ce(t.result) ? t.result : void 0;
  if ((r == null ? void 0 : r.success) === !1)
    return !1;
  if (typeof (r == null ? void 0 : r.id) == "string")
    return r.id === e;
  const n = t.args.id;
  return n === e || n === void 0;
}, Zg = (t) => {
  const e = Ce(t) ? t.addedItemIds : void 0;
  if (!Ce(e))
    return;
  const r = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(e)) {
    if (!Array.isArray(i))
      continue;
    const o = i.filter((s) => typeof s == "string");
    o.length > 0 && r.set(n, o);
  }
  if (r.size !== 0)
    return (n) => {
      var i;
      return (i = r.get(n)) == null ? void 0 : i.shift();
    };
}, js = /* @__PURE__ */ new WeakMap();
function eb(t, e, r) {
  var c;
  let n = js.get(t);
  n || (n = /* @__PURE__ */ new Map(), js.set(t, n));
  let i = n.get(r);
  i || (i = /* @__PURE__ */ new Map(), n.set(r, i));
  const o = i.get(e);
  if (o)
    return o;
  const s = Kg(r), a = [], l = () => a[a.length - 1];
  for (const d of t) {
    if (d.role === "user") {
      const u = (c = Wg(d)) == null ? void 0 : c.find((h) => h.id === e);
      if (!u)
        continue;
      if (u.partial) {
        const h = l();
        h && a.push({
          state: si(h.state, u.state),
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
        const h = Jg(u);
        if (h) {
          if (h.toolCallId === e && h.toolName === r)
            h.args && typeof h.args == "object" && a.push({
              state: h.args,
              origin: "create",
              toolCallId: e
            });
          else if (h.toolName === s && Xg(h, e)) {
            const p = l();
            if (p) {
              const { id: m, ...g } = h.args, v = Zg(h.result);
              a.push({
                state: v ? si(p.state, g, { idFactory: v }) : si(p.state, g),
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
function tb(t, e, r) {
  const n = eb(t, e, r), i = n[n.length - 1];
  return i ? { state: i.state } : void 0;
}
function Yc(t, e) {
  if (!t)
    return;
  const { interactables: r, ...n } = t, i = { ...n };
  if (Array.isArray(r)) {
    const o = [];
    for (const s of r) {
      ({}).NODE_ENV !== "production" && !fr(s.state) && console.warn(`[Interactables] state for "${s.name}" (${s.id}) is not JSON-equatable (an undefined, NaN, Infinity, function, or symbol value?). It will be re-snapshotted on every send, recreating per-message growth. Use plain JSON values.`);
      const a = tb(e, s.id, s.name);
      if (!a) {
        o.push({
          id: s.id,
          name: s.name,
          state: s.state
        });
        continue;
      }
      if (Qc(s.state, a.state))
        continue;
      const l = Yg(a.state, s.state);
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
let Jc = (t, e = 21) => (r = e) => {
  let n = "", i = r | 0;
  for (; i-- > 0; )
    n += t[Math.random() * t.length | 0];
  return n;
};
const rb = Jc("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
function nb(t) {
  const e = ["ROOT"];
  let r = -1, n = null;
  const i = [];
  let o;
  function s() {
    o !== void 0 && (i.push(JSON.parse(`"${o}"`)), o = void 0);
  }
  function a(u, h, p) {
    switch (u) {
      case '"':
        r = h, e.pop(), e.push(p), e.push("INSIDE_STRING"), s();
        break;
      case "f":
      case "t":
      case "n":
        r = h, n = h, e.pop(), e.push(p), e.push("INSIDE_LITERAL");
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
        r = h, e.pop(), e.push(p), e.push("INSIDE_NUMBER"), s();
        break;
      case "{":
        r = h, e.pop(), e.push(p), e.push("INSIDE_OBJECT_START"), s();
        break;
      case "[":
        r = h, e.pop(), e.push(p), e.push("INSIDE_ARRAY_START"), s();
        break;
    }
  }
  function l(u, h) {
    switch (u) {
      case ",":
        e.pop(), e.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      case "}":
        r = h, e.pop(), o = i.pop();
        break;
    }
  }
  function c(u, h) {
    switch (u) {
      case ",":
        e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), o = (Number(o) + 1).toString();
        break;
      case "]":
        r = h, e.pop(), o = i.pop();
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
            r = u, e.pop(), o = i.pop();
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
            e.pop(), r = u, o = i.pop();
            break;
          case "\\":
            e.push("INSIDE_STRING_ESCAPE");
            break;
          default:
            r = u;
        }
        break;
      case "INSIDE_ARRAY_START":
        switch (h) {
          case "]":
            r = u, e.pop(), o = i.pop();
            break;
          default:
            r = u, o = "0", a(h, u, "INSIDE_ARRAY_AFTER_VALUE");
            break;
        }
        break;
      case "INSIDE_ARRAY_AFTER_VALUE":
        switch (h) {
          case ",":
            e.pop(), e.push("INSIDE_ARRAY_AFTER_COMMA"), o = (Number(o) + 1).toString();
            break;
          case "]":
            r = u, e.pop(), o = i.pop();
            break;
          default:
            r = u;
            break;
        }
        break;
      case "INSIDE_ARRAY_AFTER_COMMA":
        a(h, u, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      case "INSIDE_STRING_ESCAPE":
        e.pop(), e[e.length - 1] === "INSIDE_STRING" ? r = u : e[e.length - 1] === "INSIDE_OBJECT_KEY" && (o += h);
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
            r = u;
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
        const p = t.substring(n, u + 1);
        !"false".startsWith(p) && !"true".startsWith(p) && !"null".startsWith(p) ? (e.pop(), e[e.length - 1] === "INSIDE_OBJECT_AFTER_VALUE" ? l(h, u) : e[e.length - 1] === "INSIDE_ARRAY_AFTER_VALUE" && c(h, u)) : r = u;
        break;
      }
    }
  }
  let d = t.slice(0, r + 1);
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
        const h = t.substring(n, t.length);
        "true".startsWith(h) ? d += "true".slice(h.length) : "false".startsWith(h) ? d += "false".slice(h.length) : "null".startsWith(h) && (d += "null".slice(h.length));
      }
    }
  return [d, i];
}
var In = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Wn(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var yr = { exports: {} };
const ib = typeof Buffer < "u", Vs = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/, qs = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
function Xc(t, e, r) {
  r == null && e !== null && typeof e == "object" && (r = e, e = void 0), ib && Buffer.isBuffer(t) && (t = t.toString()), t && t.charCodeAt(0) === 65279 && (t = t.slice(1));
  const n = JSON.parse(t, e);
  if (n === null || typeof n != "object")
    return n;
  const i = r && r.protoAction || "error", o = r && r.constructorAction || "error";
  if (i === "ignore" && o === "ignore")
    return n;
  if (i !== "ignore" && o !== "ignore") {
    if (Vs.test(t) === !1 && qs.test(t) === !1)
      return n;
  } else if (i !== "ignore" && o === "ignore") {
    if (Vs.test(t) === !1)
      return n;
  } else if (qs.test(t) === !1)
    return n;
  return Zc(n, { protoAction: i, constructorAction: o, safe: r && r.safe });
}
function Zc(t, { protoAction: e = "error", constructorAction: r = "error", safe: n } = {}) {
  let i = [t];
  for (; i.length; ) {
    const o = i;
    i = [];
    for (const s of o) {
      if (e !== "ignore" && Object.prototype.hasOwnProperty.call(s, "__proto__")) {
        if (n === !0)
          return null;
        if (e === "error")
          throw new SyntaxError("Object contains forbidden prototype property");
        delete s.__proto__;
      }
      if (r !== "ignore" && Object.prototype.hasOwnProperty.call(s, "constructor") && s.constructor !== null && typeof s.constructor == "object" && Object.prototype.hasOwnProperty.call(s.constructor, "prototype")) {
        if (n === !0)
          return null;
        if (r === "error")
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
function Eo(t, e, r) {
  const { stackTraceLimit: n } = Error;
  Error.stackTraceLimit = 0;
  try {
    return Xc(t, e, r);
  } finally {
    Error.stackTraceLimit = n;
  }
}
function ob(t, e) {
  const { stackTraceLimit: r } = Error;
  Error.stackTraceLimit = 0;
  try {
    return Xc(t, e, { safe: !0 });
  } catch {
    return;
  } finally {
    Error.stackTraceLimit = r;
  }
}
yr.exports = Eo;
yr.exports.default = Eo;
yr.exports.parse = Eo;
yr.exports.safeParse = ob;
yr.exports.scan = Zc;
var sb = yr.exports;
const Hs = /* @__PURE__ */ Wn(sb), ai = Symbol("aui.parse-partial-json-object.meta"), eu = (t) => {
  if (t.length === 0)
    return { [ai]: {
      state: "partial",
      partialPath: []
    } };
  try {
    const e = Hs.parse(t);
    if (typeof e != "object" || e === null)
      throw new Error("argsText is expected to be an object");
    return e[ai] = {
      state: "complete",
      partialPath: []
    }, e;
  } catch {
    try {
      const [e, r] = nb(t), n = Hs.parse(e);
      if (typeof n != "object" || n === null)
        throw new Error("argsText is expected to be an object");
      return n[ai] = {
        state: "partial",
        partialPath: r
      }, n;
    } catch {
      return;
    }
  }
};
var ab = class lr {
  constructor(e = null) {
    C(this, "_state");
    this._state = e;
  }
  get state() {
    return this._state;
  }
  append(e) {
    this._state = e.reduce((r, n) => lr.apply(r, n), this._state);
  }
  static apply(e, r) {
    const n = r.type;
    switch (n) {
      case "set":
        return lr.updatePath(e, r.path, () => r.value);
      case "append-text":
        return lr.updatePath(e, r.path, (i) => {
          if (typeof i != "string")
            throw new Error(`Expected string at path [${r.path.join(", ")}]`);
          return i + r.value;
        });
      default:
        throw new Error(`Invalid operation type: ${n}`);
    }
  }
  static updatePath(e, r, n) {
    if (r.length === 0)
      return n(e);
    if (e ?? (e = {}), typeof e != "object")
      throw new Error(`Invalid path: [${r.join(", ")}]`);
    const [i, ...o] = r;
    if (Array.isArray(e)) {
      const a = Number(i);
      if (Number.isNaN(a))
        throw new Error(`Expected array index at [${r.join(", ")}]`);
      if (a > e.length || a < 0)
        throw new Error("Insert array index out of bounds");
      const l = [...e];
      return l[a] = lr.updatePath(l[a], o, n), l;
    }
    const s = { ...e };
    return s[i] = lr.updatePath(s[i], o, n), s;
  }
}, lb = class {
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
    const r = Date.now() - this._streamStartTime, n = t && t > 0 ? t : e ? Math.ceil(e.length / 4) : void 0, i = n && r > 0 ? n / r * 1e3 : void 0;
    return {
      streamStartTime: this._streamStartTime,
      ...this._firstTokenTime !== void 0 ? { firstTokenTime: this._firstTokenTime - this._streamStartTime } : void 0,
      totalStreamTime: r,
      ...n !== void 0 ? { tokenCount: n } : void 0,
      ...i !== void 0 ? { tokensPerSecond: i } : void 0,
      totalChunks: this._totalChunks,
      toolCallCount: this._toolCallIds.size
    };
  }
};
const cb = ({ unstable_state: t = null } = {}) => ({
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
}), Kn = (t, e, r) => {
  if (t.parts.length === 0)
    throw new Error("No parts available to update.");
  if (e.path.length !== 1)
    throw new Error("Nested paths are not supported yet.");
  const n = e.path[0], i = r(t.parts[n]);
  return {
    ...t,
    parts: [
      ...t.parts.slice(0, n),
      i,
      ...t.parts.slice(n + 1)
    ],
    get content() {
      return this.parts;
    }
  };
}, ub = (t, e) => {
  const r = e.part;
  if (r.type === "text" || r.type === "reasoning") {
    const n = {
      type: r.type,
      text: "",
      status: { type: "running" },
      ...r.parentId && { parentId: r.parentId }
    };
    return {
      ...t,
      parts: [...t.parts, n],
      get content() {
        return this.parts;
      }
    };
  } else if (r.type === "tool-call") {
    const n = {
      type: "tool-call",
      state: "partial-call",
      status: {
        type: "running",
        isArgsComplete: !1
      },
      toolCallId: r.toolCallId,
      toolName: r.toolName,
      argsText: "",
      args: {},
      timing: { startedAt: Date.now() },
      ...r.parentId && { parentId: r.parentId }
    };
    return {
      ...t,
      parts: [...t.parts, n],
      get content() {
        return this.parts;
      }
    };
  } else if (r.type === "source") {
    const n = {
      type: "source",
      sourceType: r.sourceType,
      id: r.id,
      url: r.url,
      ...r.title ? { title: r.title } : void 0,
      ...r.parentId && { parentId: r.parentId }
    };
    return {
      ...t,
      parts: [...t.parts, n],
      get content() {
        return this.parts;
      }
    };
  } else if (r.type === "file") {
    const n = {
      type: "file",
      mimeType: r.mimeType,
      data: r.data,
      ...r.parentId && { parentId: r.parentId }
    };
    return {
      ...t,
      parts: [...t.parts, n],
      get content() {
        return this.parts;
      }
    };
  } else if (r.type === "data") {
    const n = {
      type: "data",
      name: r.name,
      data: r.data,
      ...r.parentId && { parentId: r.parentId }
    };
    return {
      ...t,
      parts: [...t.parts, n],
      get content() {
        return this.parts;
      }
    };
  } else
    throw new Error(`Unsupported part type: ${r.type}`);
}, db = (t, e) => Kn(t, e, (r) => {
  if (r.type !== "tool-call")
    throw new Error("Last is not a tool call");
  return r.state !== "partial-call" ? r : {
    ...r,
    state: "call"
  };
}), hb = (t, e) => Kn(t, e, (r) => ({
  ...r,
  status: {
    type: "complete",
    reason: "unknown"
  }
})), pb = (t, e) => Kn(t, e, (r) => {
  if (r.type === "text" || r.type === "reasoning")
    return {
      ...r,
      text: r.text + e.textDelta
    };
  if (r.type === "tool-call") {
    const n = r.argsText + e.textDelta, i = eu(n) ?? r.args;
    return {
      ...r,
      argsText: n,
      args: i
    };
  } else
    throw new Error("text-delta received but part is neither text nor tool-call");
}), mb = (t, e) => Kn(t, e, (r) => {
  if (r.type === "tool-call")
    return {
      ...r,
      state: "result",
      ...r.timing !== void 0 ? { timing: {
        ...r.timing,
        completedAt: r.timing.completedAt ?? Date.now()
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
}), Gs = (t, e) => {
  var n, i;
  if (((n = t.status) == null ? void 0 : n.type) === "incomplete" && ((i = t.status) == null ? void 0 : i.reason) === "error")
    return t;
  const r = fb(e);
  return {
    ...t,
    status: r
  };
}, fb = (t) => t.finishReason === "tool-calls" ? {
  type: "requires-action",
  reason: "tool-calls"
} : t.finishReason === "stop" || t.finishReason === "unknown" ? {
  type: "complete",
  reason: t.finishReason
} : {
  type: "incomplete",
  reason: t.finishReason
}, gb = (t, e) => ({
  ...t,
  metadata: {
    ...t.metadata,
    unstable_annotations: [...t.metadata.unstable_annotations, ...e.annotations]
  }
}), bb = (t, e) => ({
  ...t,
  metadata: {
    ...t.metadata,
    unstable_data: [...t.metadata.unstable_data, ...e.data]
  }
}), vb = (t, e) => ({
  ...t,
  metadata: {
    ...t.metadata,
    steps: [...t.metadata.steps, {
      state: "started",
      messageId: e.messageId
    }]
  }
}), wb = (t, e) => {
  var i;
  const r = t.metadata.steps.slice(), n = r.length - 1;
  return r.length > 0 && ((i = r[n]) == null ? void 0 : i.state) === "started" ? r[n] = {
    ...r[n],
    state: "finished",
    finishReason: e.finishReason,
    usage: e.usage,
    isContinued: e.isContinued
  } : r.push({
    state: "finished",
    messageId: rb(),
    finishReason: e.finishReason,
    usage: e.usage,
    isContinued: e.isContinued
  }), {
    ...t,
    metadata: {
      ...t.metadata,
      steps: r
    }
  };
}, yb = (t, e) => ({
  ...t,
  status: {
    type: "incomplete",
    reason: "error",
    error: e.error
  }
}), xb = (t, e) => {
  const r = new ab(t.metadata.unstable_state);
  return r.append(e.operations), {
    ...t,
    metadata: {
      ...t.metadata,
      unstable_state: r.state
    }
  };
}, Ws = (t, e) => {
  let r = 0;
  for (const i of e.metadata.steps)
    i.state === "finished" && i.usage && (r += i.usage.outputTokens);
  let n = "";
  for (const i of e.parts)
    (i.type === "text" || i.type === "reasoning") && (n += i.text);
  return t.getTiming(r > 0 ? r : void 0, n || void 0);
}, kb = (t) => {
  let e = !1;
  return () => {
    e || (e = !0, queueMicrotask(() => {
      e = !1, t();
    }));
  };
};
var _b = class extends TransformStream {
  constructor({ initialMessage: t, throttle: e, onError: r } = {}) {
    let n = t ?? cb();
    const i = new lb();
    let o;
    const s = e ? kb(() => {
      o == null || o.enqueue(n);
    }) : () => {
      o == null || o.enqueue(n);
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
            n = ub(n, a), a.part.type === "tool-call" && i.recordToolCallStart(a.part.toolCallId);
            break;
          case "tool-call-args-text-finish":
            n = db(n, a);
            break;
          case "part-finish":
            n = hb(n, a);
            break;
          case "text-delta":
            n = pb(n, a), i.recordFirstToken();
            break;
          case "result":
            n = mb(n, a);
            break;
          case "message-finish":
            n = Gs(n, a);
            break;
          case "annotations":
            n = gb(n, a);
            break;
          case "data":
            n = bb(n, a);
            break;
          case "step-start":
            n = vb(n, a);
            break;
          case "step-finish":
            n = wb(n, a);
            break;
          case "error":
            n = yb(n, a), r == null || r(a.error);
            break;
          case "update-state":
            n = xb(n, a);
            break;
          default:
            throw new Error(`Unsupported chunk type: ${l}`);
        }
        n.status.type !== "running" && (n = {
          ...n,
          metadata: {
            ...n.metadata,
            timing: Ws(i, n)
          }
        }), s();
      },
      flush(a) {
        var l, c;
        if (((l = n.status) == null ? void 0 : l.type) === "running") {
          const d = ((c = n.parts) == null ? void 0 : c.some((u) => u.type === "tool-call" && (u.state === "call" || u.state === "partial-call") && u.result === void 0)) ?? !1;
          n = Gs(n, {
            type: "message-finish",
            path: [],
            finishReason: d ? "tool-calls" : "unknown",
            usage: {
              inputTokens: 0,
              outputTokens: 0
            }
          }), n = {
            ...n,
            metadata: {
              ...n.metadata,
              timing: Ws(i, n)
            }
          }, a.enqueue(n);
        }
      }
    });
  }
}, Sb = class yn {
  constructor(e) {
    C(this, "readable");
    this.readable = e, this.readable = e;
  }
  static fromAssistantStream(e) {
    return new yn(e.pipeThrough(new _b()));
  }
  async unstable_result() {
    let e;
    for await (const r of this)
      e = r;
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
      const { done: r, value: n } = await e.read();
      return r ? {
        done: !0,
        value: void 0
      } : {
        done: !1,
        value: n
      };
    } };
  }
  tee() {
    const [e, r] = this.readable.tee();
    return [new yn(e), new yn(r)];
  }
};
const Ks = Symbol.for("aui.tool-response");
var Cb = class ji {
  constructor(e) {
    C(this, "artifact");
    C(this, "result");
    C(this, "isError");
    C(this, "modelContent");
    C(this, "messages");
    e.artifact !== void 0 && (this.artifact = e.artifact), this.result = e.result, this.isError = e.isError ?? !1, e.modelContent !== void 0 && (this.modelContent = e.modelContent), e.messages !== void 0 && (this.messages = e.messages);
  }
  get [Ks]() {
    return !0;
  }
  static [Symbol.hasInstance](e) {
    return typeof e == "object" && e !== null && Ks in e;
  }
  /**
  * Converts a plain tool return value into a {@link ToolResponse}.
  *
  * Existing `ToolResponse` instances are returned unchanged. `undefined`
  * becomes the string `"<no result>"` so downstream protocol chunks always
  * carry a concrete result.
  */
  static toResponse(e) {
    return e instanceof ji ? e : new ji({ result: e === void 0 ? "<no result>" : e });
  }
};
const ct = Jc("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7), tu = (t) => {
  const e = A(7), { index: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ue({
    source: "message",
    query: {
      type: "index",
      index: r
    },
    get: (l) => l.message().attachment({ index: r })
  }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { attachment: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = J(o);
  let a;
  return e[4] !== s || e[5] !== n ? (a = /* @__PURE__ */ f(Ve, {
    value: s,
    children: n
  }), e[4] = s, e[5] = n, e[6] = a) : a = e[6], a;
}, ru = (t) => {
  const e = A(7), { index: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ue({
    source: "composer",
    query: {
      type: "index",
      index: r
    },
    get: (l) => l.composer().attachment({ index: r })
  }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { attachment: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = J(o);
  let a;
  return e[4] !== s || e[5] !== n ? (a = /* @__PURE__ */ f(Ve, {
    value: s,
    children: n
  }), e[4] = s, e[5] = n, e[6] = a) : a = e[6], a;
}, Tb = (t) => {
  const e = A(7), { runtime: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Wc({ runtime: r }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { threadListItem: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = J(o);
  let a;
  return e[4] !== s || e[5] !== n ? (a = /* @__PURE__ */ f(Ve, {
    value: s,
    children: n
  }), e[4] = s, e[5] = n, e[6] = a) : a = e[6], a;
}, nu = (t) => {
  const e = A(10), { index: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ue({
    source: "thread",
    query: {
      type: "index",
      index: r
    },
    get: (c) => c.thread().message({ index: r })
  }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== r ? (o = Ue({
    source: "message",
    query: {},
    get: (c) => c.thread().message({ index: r }).composer()
  }), e[2] = r, e[3] = o) : o = e[3];
  let s;
  e[4] !== i || e[5] !== o ? (s = {
    message: i,
    composer: o
  }, e[4] = i, e[5] = o, e[6] = s) : s = e[6];
  const a = J(s);
  let l;
  return e[7] !== a || e[8] !== n ? (l = /* @__PURE__ */ f(Ve, {
    value: a,
    children: n
  }), e[7] = a, e[8] = n, e[9] = l) : l = e[9], l;
}, Ao = (t) => {
  const e = A(7), { index: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ue({
    source: "message",
    query: {
      type: "index",
      index: r
    },
    get: (l) => l.message().part({ index: r })
  }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { part: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = J(o);
  let a;
  return e[4] !== s || e[5] !== n ? (a = /* @__PURE__ */ f(Ve, {
    value: s,
    children: n
  }), e[4] = s, e[5] = n, e[6] = a) : a = e[6], a;
}, Ib = (t) => {
  const e = A(7), { text: r, isRunning: n } = t;
  let i;
  e[0] !== n ? (i = n ? { type: "running" } : { type: "complete" }, e[0] = n, e[1] = i) : i = e[1];
  let o;
  e[2] !== i || e[3] !== r ? (o = {
    type: "text",
    text: r,
    status: i
  }, e[2] = i, e[3] = r, e[4] = o) : o = e[4];
  const s = o;
  let a;
  return e[5] !== s ? (a = {
    getState: () => s,
    addToolResult: Ab,
    resumeToolCall: Rb,
    respondToToolApproval: Pb
  }, e[5] = s, e[6] = a) : a = e[6], a;
}, Eb = le(Ib), Ro = (t) => {
  const e = A(8), { text: r, isRunning: n, children: i } = t, o = n === void 0 ? !1 : n;
  let s;
  e[0] !== o || e[1] !== r ? (s = Eb({
    text: r,
    isRunning: o
  }), e[0] = o, e[1] = r, e[2] = s) : s = e[2];
  let a;
  e[3] !== s ? (a = { part: s }, e[3] = s, e[4] = a) : a = e[4];
  const l = J(a);
  let c;
  return e[5] !== l || e[6] !== i ? (c = /* @__PURE__ */ f(Ve, {
    value: l,
    children: i
  }), e[5] = l, e[6] = i, e[7] = c) : c = e[7], c;
};
function Ab() {
  throw new Error("Not supported");
}
function Rb() {
  throw new Error("Not supported");
}
function Pb() {
  throw new Error("Not supported");
}
const Mb = Object.freeze({ type: "complete" }), Db = (t) => {
  var u;
  const e = A(9), { parts: r, getMessagePart: n } = t, [i, o] = ve(!0), s = ((u = r[r.length - 1]) == null ? void 0 : u.status) ?? Mb;
  let a;
  e[0] !== i || e[1] !== r || e[2] !== s ? (a = {
    parts: r,
    collapsed: i,
    status: s
  }, e[0] = i, e[1] = r, e[2] = s, e[3] = a) : a = e[3];
  const l = a;
  let c;
  e[4] !== l ? (c = () => l, e[4] = l, e[5] = c) : c = e[5];
  let d;
  return e[6] !== n || e[7] !== c ? (d = {
    getState: c,
    setCollapsed: o,
    part: n
  }, e[6] = n, e[7] = c, e[8] = d) : d = e[8], d;
}, Nb = le(Db), zb = (t) => {
  const e = A(5), { startIndex: r, endIndex: n, children: i } = t, o = L(Ob).slice(r, n + 1), s = J(), a = Nb({
    parts: o,
    getMessagePart: (u) => {
      const { index: h } = u;
      if (h < 0 || h >= o.length)
        throw new Error(`ChainOfThought part index ${h} is out of bounds (0..${o.length - 1})`);
      return s.message().part({ index: r + h });
    }
  });
  let l;
  e[0] !== a ? (l = { chainOfThought: a }, e[0] = a, e[1] = l) : l = e[1];
  const c = J(l);
  let d;
  return e[2] !== c || e[3] !== i ? (d = /* @__PURE__ */ f(Ve, {
    value: c,
    children: i
  }), e[2] = c, e[3] = i, e[4] = d) : d = e[4], d;
};
function Ob(t) {
  return t.message.parts;
}
const iu = (t) => {
  const e = A(7), { index: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ue({
    source: "suggestions",
    query: { index: r },
    get: (l) => l.suggestions().suggestion({ index: r })
  }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { suggestion: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = J(o);
  let a;
  return e[4] !== s || e[5] !== n ? (a = /* @__PURE__ */ f(Ve, {
    value: s,
    children: n
  }), e[4] = s, e[5] = n, e[6] = a) : a = e[6], a;
}, Lb = (t) => {
  const e = A(7), { index: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ue({
    source: "composer",
    query: { index: r },
    get: (l) => l.composer().queueItem({ index: r })
  }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { queueItem: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = J(o);
  let a;
  return e[4] !== s || e[5] !== n ? (a = /* @__PURE__ */ f(Ve, {
    value: s,
    children: n
  }), e[4] = s, e[5] = n, e[6] = a) : a = e[6], a;
}, En = Symbol("innerMessage"), et = Symbol("skip-update");
function $b(t, e) {
  if (t === void 0 && e === void 0)
    return !0;
  if (t === void 0 || e === void 0)
    return !1;
  for (const r of Object.keys(t)) {
    const n = t[r], i = e[r];
    if (!Object.is(n, i))
      return !1;
  }
  return !0;
}
var Zr = class {
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
      } catch (r) {
        t.push(r);
      }
    if (t.length > 0) {
      if (t.length === 1)
        throw t[0];
      for (const e of t)
        console.error(e);
      throw new AggregateError(t);
    }
  }
}, Qn = class {
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
}, Je = class extends Qn {
  constructor(e) {
    super();
    C(this, "binding");
    C(this, "_previousState");
    C(this, "getState", () => (this.isConnected || this._syncState(), this._previousState));
    this.binding = e;
    const r = e.getState();
    if (r === et)
      throw new Error("Entry not available in the store");
    this._previousState = r;
  }
  get path() {
    return this.binding.path;
  }
  _syncState() {
    const e = this.binding.getState();
    return e === et || $b(e, this._previousState) ? !1 : (this._previousState = e, !0);
  }
  _connect() {
    const e = () => {
      this._syncState() && this.notifySubscribers();
    };
    return this.binding.subscribe(e);
  }
}, Po = class extends Qn {
  constructor(e) {
    super();
    C(this, "binding");
    C(this, "_previousStateDirty", !0);
    C(this, "_previousState");
    C(this, "getState", () => {
      if (!this.isConnected || this._previousStateDirty) {
        const e = this.binding.getState();
        e !== et && (this._previousState = e), this._previousStateDirty = !1;
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
}, An = class extends Qn {
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
    let r = this.binding.getState(), n = r == null ? void 0 : r.subscribe(e);
    const i = () => {
      const s = this.binding.getState();
      s !== r && (r = s, n == null || n(), n = s == null ? void 0 : s.subscribe(e), e());
    }, o = this.outerSubscribe(i);
    return () => {
      o == null || o(), n == null || n();
    };
  }
}, ou = class extends Qn {
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
    let r = this.config.binding.getState(), n = r == null ? void 0 : r.unstable_on(this.config.event, e);
    const i = () => {
      const s = this.config.binding.getState();
      s !== r && (r = s, n == null || n(), n = s == null ? void 0 : s.unstable_on(this.config.event, e));
    }, o = this.outerSubscribe(i);
    return () => {
      o == null || o(), n == null || n();
    };
  }
}, su = class {
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
}, au = class extends su {
  constructor(e, r) {
    super(e);
    C(this, "_composerApi");
    this._composerApi = r;
  }
  remove() {
    const e = this._composerApi.getState();
    if (!e)
      throw new Error("Composer is not available");
    return e.removeAttachment(this.getState().id);
  }
}, Bb = class extends au {
  get source() {
    return "thread-composer";
  }
}, Fb = class extends au {
  get source() {
    return "edit-composer";
  }
}, Ub = class extends su {
  get source() {
    return "message";
  }
  remove() {
    throw new Error("Message attachments cannot be removed");
  }
};
const Rn = Object.freeze([]), lu = Object.freeze({}), jb = (t) => Object.freeze({
  type: "thread",
  isEditing: (t == null ? void 0 : t.isEditing) ?? !1,
  canCancel: (t == null ? void 0 : t.canCancel) ?? !1,
  canSend: (t == null ? void 0 : t.canSend) ?? !1,
  isEmpty: (t == null ? void 0 : t.isEmpty) ?? !0,
  attachments: (t == null ? void 0 : t.attachments) ?? Rn,
  text: (t == null ? void 0 : t.text) ?? "",
  role: (t == null ? void 0 : t.role) ?? "user",
  runConfig: (t == null ? void 0 : t.runConfig) ?? lu,
  attachmentAccept: (t == null ? void 0 : t.attachmentAccept) ?? "",
  dictation: t == null ? void 0 : t.dictation,
  quote: t == null ? void 0 : t.quote,
  queue: (t == null ? void 0 : t.queue) ?? Rn,
  value: (t == null ? void 0 : t.text) ?? ""
}), Vb = (t) => Object.freeze({
  type: "edit",
  isEditing: (t == null ? void 0 : t.isEditing) ?? !1,
  canCancel: (t == null ? void 0 : t.canCancel) ?? !1,
  canSend: (t == null ? void 0 : t.canSend) ?? !1,
  isEmpty: (t == null ? void 0 : t.isEmpty) ?? !0,
  text: (t == null ? void 0 : t.text) ?? "",
  role: (t == null ? void 0 : t.role) ?? "user",
  attachments: (t == null ? void 0 : t.attachments) ?? Rn,
  runConfig: (t == null ? void 0 : t.runConfig) ?? lu,
  attachmentAccept: (t == null ? void 0 : t.attachmentAccept) ?? "",
  dictation: t == null ? void 0 : t.dictation,
  quote: t == null ? void 0 : t.quote,
  queue: (t == null ? void 0 : t.queue) ?? Rn,
  parentId: (t == null ? void 0 : t.parentId) ?? null,
  sourceId: (t == null ? void 0 : t.sourceId) ?? null,
  value: (t == null ? void 0 : t.text) ?? ""
});
var cu = class {
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
    let r = this._eventSubscriptionSubjects.get(t);
    return r || (r = new ou({
      event: t,
      binding: this._core
    }), this._eventSubscriptionSubjects.set(t, r)), r.subscribe(e);
  }
}, qb = class extends cu {
  constructor(e) {
    const r = new Po({
      path: e.path,
      getState: () => jb(e.getState()),
      subscribe: (n) => e.subscribe(n)
    });
    super({
      path: e.path,
      getState: () => e.getState(),
      subscribe: (n) => r.subscribe(n)
    });
    C(this, "_getState");
    this._getState = r.getState.bind(r), this.__internal_bindMethods();
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
    return new Bb(new Je({
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
        const r = this.getState().attachments[e];
        return r ? {
          ...r,
          source: "thread-composer"
        } : et;
      },
      subscribe: (r) => this._core.subscribe(r)
    }), this._core);
  }
}, Hb = class extends cu {
  constructor(e, r) {
    const n = new Po({
      path: e.path,
      getState: () => Vb(e.getState()),
      subscribe: (i) => e.subscribe(i)
    });
    super({
      path: e.path,
      getState: () => e.getState(),
      subscribe: (i) => n.subscribe(i)
    });
    C(this, "_beginEdit");
    C(this, "_getState");
    this._beginEdit = r, this._getState = n.getState.bind(n), this.__internal_bindMethods();
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
    return new Fb(new Je({
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
        const r = this.getState().attachments[e];
        return r ? {
          ...r,
          source: "edit-composer"
        } : et;
      },
      subscribe: (r) => this._core.subscribe(r)
    }), this._core);
  }
};
const Vr = (t) => t.content.filter((e) => e.type === "text").map((e) => e.text).join(`

`), Qs = {
  "allow-once": !0,
  "allow-always": !0,
  "reject-once": !1,
  "reject-always": !1
}, Gb = (t, e) => {
  var i;
  let r, n;
  if ("optionId" in e) {
    const o = (i = t.options) == null ? void 0 : i.find((s) => s.id === e.optionId);
    if (!o)
      throw new Error(`Tool approval has no option with id "${e.optionId}"`);
    if ("approved" in e)
      r = e.approved;
    else {
      if (!Object.hasOwn(Qs, o.kind))
        throw new Error(`Tool approval option "${o.id}" has a custom kind "${o.kind}"; respond with an explicit approved value instead`);
      r = Qs[o.kind];
    }
    n = o.id;
  } else
    r = e.approved;
  return {
    approvalId: t.id,
    approved: r,
    ...n !== void 0 && { optionId: n },
    ...e.reason != null && { reason: e.reason }
  };
};
var Ys = class {
  constructor(t, e, r) {
    C(this, "contentBinding");
    C(this, "messageApi");
    C(this, "threadApi");
    this.contentBinding = t, this.messageApi = e, this.threadApi = r, this.__internal_bindMethods();
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
    const r = this.messageApi.getState();
    if (!r)
      throw new Error("Message is not available");
    const n = e.toolName, i = e.toolCallId, o = Cb.toResponse(t);
    this.threadApi.getState().addToolResult({
      messageId: r.id,
      toolName: n,
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
    const r = e.toolCallId;
    this.threadApi.getState().resumeToolCall({
      toolCallId: r,
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
    this.threadApi.getState().respondToToolApproval(Gb(e.approval, t));
  }
  subscribe(t) {
    return this.contentBinding.subscribe(t);
  }
};
const an = Object.freeze({ type: "complete" }), Wb = (t, e, r) => {
  if (t.role !== "assistant")
    return an;
  if (r.type === "tool-call")
    return r.result ? an : t.status;
  const n = e === Math.max(0, t.content.length - 1);
  return t.status.type === "requires-action" ? an : n ? t.status : an;
}, Js = (t, e) => {
  const r = t.content[e];
  if (!r)
    return et;
  const n = Wb(t, e, r);
  return Object.freeze({
    ...r,
    [En]: r[En],
    status: n
  });
};
var Kb = class {
  constructor(t, e) {
    C(this, "_core");
    C(this, "_threadBinding");
    C(this, "composer");
    C(this, "_getEditComposerRuntimeCore", () => this._threadBinding.getState().getEditComposer(this._core.getState().id));
    this._core = t, this._threadBinding = e, this.composer = new Hb(new An({
      path: {
        ...this.path,
        ref: `${this.path.ref}${this.path.ref}.composer`,
        composerSource: "edit"
      },
      getState: this._getEditComposerRuntimeCore,
      subscribe: (r) => this._threadBinding.subscribe(r)
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
    const e = this._getEditComposerRuntimeCore(), r = e ?? this._threadBinding.getState().composer, n = e ?? r, { runConfig: i = n.runConfig } = t, o = this._core.getState();
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
    const r = this._core.getState();
    if (e && t)
      throw new Error("May not specify both branchId and position");
    if (!e && !t)
      throw new Error("Must specify either branchId or position");
    const n = this._threadBinding.getState().getBranches(r.id);
    let i = e;
    if (t === "previous" ? i = n[r.branchNumber - 2] : t === "next" && (i = n[r.branchNumber]), !i)
      throw new Error("Branch not found");
    this._threadBinding.getState().switchToBranch(i);
  }
  unstable_getCopyText() {
    return Vr(this.getState());
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  getMessagePartByIndex(t) {
    if (t < 0)
      throw new Error("Message part index must be >= 0");
    return new Ys(new Je({
      path: {
        ...this.path,
        ref: `${this.path.ref}${this.path.ref}.content[${t}]`,
        messagePartSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => Js(this.getState(), t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getMessagePartByToolCallId(t) {
    return new Ys(new Je({
      path: {
        ...this.path,
        ref: this.path.ref + `${this.path.ref}.content[toolCallId=${JSON.stringify(t)}]`,
        messagePartSelector: {
          type: "toolCallId",
          toolCallId: t
        }
      },
      getState: () => {
        const e = this._core.getState(), r = e.content.findIndex((n) => n.type === "tool-call" && n.toolCallId === t);
        return r === -1 ? et : Js(e, r);
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getAttachmentByIndex(t) {
    return new Ub(new Je({
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
        var r;
        const e = (r = this.getState().attachments) == null ? void 0 : r[t];
        return e ? {
          ...e,
          source: "message"
        } : et;
      },
      subscribe: (e) => this._core.subscribe(e)
    }));
  }
};
const Qb = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {},
  ...t.stream ? { stream: t.stream } : {}
}), Yb = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {}
}), Jb = (t, e) => {
  var r, n;
  return typeof e == "string" ? {
    createdAt: /* @__PURE__ */ new Date(),
    parentId: ((r = t.at(-1)) == null ? void 0 : r.id) ?? null,
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
    parentId: e.parentId ?? ((n = t.at(-1)) == null ? void 0 : n.id) ?? null,
    sourceId: e.sourceId ?? null,
    role: e.role ?? "user",
    content: e.content,
    attachments: e.attachments ?? [],
    metadata: e.metadata ?? { custom: {} },
    runConfig: e.runConfig ?? {},
    startRun: e.startRun
  };
}, Xb = (t, e) => {
  const r = t.messages.at(-1);
  return Object.freeze({
    threadId: e.id,
    metadata: e,
    capabilities: t.capabilities,
    isDisabled: t.isDisabled,
    isLoading: t.isLoading,
    isRunning: t.isRunning ?? ((r == null ? void 0 : r.role) !== "assistant" ? !1 : r.status.type === "running"),
    messages: t.messages,
    state: t.state,
    suggestions: t.suggestions,
    extras: t.extras,
    speech: t.speech,
    voice: t.voice
  });
};
var uu = class {
  constructor(t, e) {
    C(this, "_threadBinding");
    C(this, "composer");
    C(this, "_eventSubscriptionSubjects", /* @__PURE__ */ new Map());
    const r = new Je({
      path: t.path,
      getState: () => Xb(t.getState(), e.getState()),
      subscribe: (n) => {
        const i = t.subscribe(n), o = e.subscribe(n);
        return () => {
          i(), o();
        };
      }
    });
    this._threadBinding = {
      path: t.path,
      getState: () => t.getState(),
      getStateState: () => r.getState(),
      outerSubscribe: (n) => t.outerSubscribe(n),
      subscribe: (n) => t.subscribe(n)
    }, this.composer = new qb(new An({
      path: {
        ...this.path,
        ref: `${this.path.ref}.composer`,
        composerSource: "thread"
      },
      getState: () => this._threadBinding.getState().composer,
      subscribe: (n) => this._threadBinding.subscribe(n)
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
    this._threadBinding.getState().append(Jb(this._threadBinding.getState().messages, t));
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
    return this._threadBinding.getState().startRun(Yb(t));
  }
  resumeRun(t) {
    return this._threadBinding.getState().resumeRun(Qb(t));
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
      var n;
      const e = this._threadBinding.getState().messages, r = e[t];
      if (r)
        return {
          message: r,
          parentId: ((n = e[t - 1]) == null ? void 0 : n.id) ?? null,
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
    return new Kb(new Je({
      path: t,
      getState: () => {
        var l;
        const { message: r, parentId: n, index: i } = e() ?? {}, { messages: o, speech: s } = this._threadBinding.getState();
        if (!r || n === void 0 || i === void 0)
          return et;
        const a = this._threadBinding.getState().getBranches(r.id);
        return {
          ...r,
          [En]: r[En],
          index: i,
          isLast: ((l = o.at(-1)) == null ? void 0 : l.id) === r.id,
          parentId: n,
          branchNumber: a.indexOf(r.id) + 1,
          branchCount: a.length,
          speech: (s == null ? void 0 : s.messageId) === r.id ? s : void 0
        };
      },
      subscribe: (r) => this._threadBinding.subscribe(r)
    }), this._threadBinding);
  }
  unstable_on(t, e) {
    let r = this._eventSubscriptionSubjects.get(t);
    return r || (r = new ou({
      event: t,
      binding: this._threadBinding
    }), this._eventSubscriptionSubjects.set(t, r)), r.subscribe(e);
  }
};
const Vi = Ge(null), du = (t) => {
  const e = A(6), { adapters: r, children: n } = t, i = We(Vi);
  let o;
  e[0] !== r || e[1] !== i ? (o = {
    ...i,
    ...r
  }, e[0] = r, e[1] = i, e[2] = o) : o = e[2];
  const s = o;
  let a;
  return e[3] !== n || e[4] !== s ? (a = /* @__PURE__ */ f(Vi.Provider, {
    value: s,
    children: n
  }), e[3] = n, e[4] = s, e[5] = a) : a = e[5], a;
}, Zb = () => We(Vi);
var ln = class {
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
    let r = this._core.getState().isMain, n = this._core.getState().id;
    return this.subscribe(() => {
      const i = this._core.getState(), o = i.isMain, s = i.id;
      r === o && n === s || (r = o, n = s, !(t === "switchedTo" && !o) && (t === "switchedAway" && o || e({})));
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
const Xs = Promise.resolve(), ev = (t) => ({
  mainThreadId: t.mainThreadId,
  newThreadId: t.newThreadId,
  threadIds: t.threadIds,
  archivedThreadIds: t.archivedThreadIds,
  isLoading: t.isLoading,
  isLoadingMore: t.isLoadingMore ?? !1,
  hasMore: t.hasMore ?? !1,
  threadItems: t.threadItems
}), cn = (t, e) => {
  if (e === void 0)
    return et;
  const r = t.getItemById(e);
  return r ? {
    id: r.id,
    remoteId: r.remoteId,
    externalId: r.externalId,
    title: r.title,
    status: r.status,
    lastMessageAt: r.lastMessageAt,
    custom: r.custom,
    isMain: r.id === t.mainThreadId
  } : et;
};
var hu = class {
  constructor(t, e = uu) {
    C(this, "_core");
    C(this, "_runtimeFactory");
    C(this, "_getState");
    C(this, "_mainThreadListItemRuntime");
    C(this, "main");
    this._core = t, this._runtimeFactory = e;
    const r = new Po({
      path: {},
      getState: () => ev(t),
      subscribe: (n) => t.subscribe(n)
    });
    this._getState = r.getState.bind(r), this._mainThreadListItemRuntime = new ln(new Je({
      path: {
        ref: "threadItems[main]",
        threadSelector: { type: "main" }
      },
      getState: () => cn(this._core, this._core.mainThreadId),
      subscribe: (n) => this._core.subscribe(n)
    }), this._core), this.main = new e(new An({
      path: {
        ref: "threads.main",
        threadSelector: { type: "main" }
      },
      getState: () => t.getMainThreadRuntimeCore(),
      subscribe: (n) => t.subscribe(n)
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
    return ((e = (t = this._core).reload) == null ? void 0 : e.call(t)) ?? Xs;
  }
  loadMore() {
    var t, e;
    return ((e = (t = this._core).loadMore) == null ? void 0 : e.call(t)) ?? Xs;
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
    return new this._runtimeFactory(new An({
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
    return new ln(new Je({
      path: {
        ref: `threadItems[${t}]`,
        threadSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => cn(this._core, this._core.threadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getArchivedItemByIndex(t) {
    return new ln(new Je({
      path: {
        ref: `archivedThreadItems[${t}]`,
        threadSelector: {
          type: "archiveIndex",
          index: t
        }
      },
      getState: () => cn(this._core, this._core.archivedThreadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getItemById(t) {
    return new ln(new Je({
      path: {
        ref: `threadItems[threadId=${t}]`,
        threadSelector: {
          type: "threadId",
          threadId: t
        }
      },
      getState: () => cn(this._core, t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, Mo = class {
  constructor(t) {
    C(this, "_core");
    C(this, "threads");
    C(this, "_thread");
    this._core = t, this.threads = new hu(t.threads), this._thread = this.threads.main, this.__internal_bindMethods();
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
}, Do = class {
  constructor() {
    C(this, "_contextProvider", new So());
  }
  registerModelContextProvider(t) {
    return this._contextProvider.registerModelContextProvider(t);
  }
  getModelContextProvider() {
    return this._contextProvider;
  }
};
const li = (t, e) => {
  if (t.startsWith("data-"))
    return {
      type: "data",
      name: t.substring(5),
      data: e
    };
}, Pn = (t, e, r) => {
  const { role: n, id: i, createdAt: o, attachments: s, status: a, metadata: l } = t, c = {
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
  if (n !== "user" && (s != null && s.length))
    throw new Error("attachments are only supported for user messages");
  if (n !== "assistant" && a)
    throw new Error("status is only supported for assistant messages");
  if (n !== "assistant" && (l != null && l.steps))
    throw new Error("metadata.steps is only supported for assistant messages");
  switch (n) {
    case "assistant":
      return {
        ...c,
        role: n,
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
              const { parentId: g, messages: v, ...b } = h, k = {
                ...b,
                toolCallId: h.toolCallId ?? `tool-${ct()}`,
                ...g !== void 0 && { parentId: g },
                ...v !== void 0 && { messages: v }
              };
              return h.args ? {
                ...k,
                args: h.args,
                argsText: h.argsText ?? JSON.stringify(h.args)
              } : {
                ...k,
                args: eu(h.argsText ?? "") ?? {},
                argsText: h.argsText ?? ""
              };
            }
            default: {
              const g = li(p, h.data);
              if (g)
                return g;
              throw new Error(`Unsupported assistant message part type: ${p}`);
            }
          }
        }).filter((h) => !!h),
        status: a ?? r,
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
        role: n,
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
              const m = li(p, h.data);
              if (m)
                return m;
              throw new Error(`Unsupported user message part type: ${p}`);
            }
          }
        }),
        attachments: (s ?? []).map((h) => ({
          ...h,
          content: h.content.map((p) => li(p.type, p.data) ?? p)
        })),
        metadata: { custom: (l == null ? void 0 : l.custom) ?? {} }
      };
    case "system":
      if (d.length !== 1 || d[0].type !== "text")
        throw new Error("System messages must have exactly one text message part.");
      return {
        ...c,
        role: n,
        content: d,
        metadata: { custom: (l == null ? void 0 : l.custom) ?? {} }
      };
    default:
      throw new Error(`Unknown message role: ${n}`);
  }
}, en = Symbol("autoStatus"), tv = Object.freeze(Object.assign({ type: "running" }, { [en]: !0 })), rv = Object.freeze(Object.assign({
  type: "complete",
  reason: "unknown"
}, { [en]: !0 })), nv = Object.freeze(Object.assign({
  type: "requires-action",
  reason: "tool-calls"
}, { [en]: !0 })), iv = Object.freeze(Object.assign({
  type: "requires-action",
  reason: "interrupt"
}, { [en]: !0 })), qi = (t, e, r, n, i) => t && i ? Object.assign({
  type: "incomplete",
  reason: "error",
  error: i
}, { [en]: !0 }) : t && e ? tv : r ? iv : n ? nv : rv, pu = {
  fromArray: (t) => {
    const e = t.map((r) => Pn(r, ct(), qi(!1, !1, !1, !1, void 0)));
    return { messages: e.map((r, n) => ({
      parentId: n > 0 ? e[n - 1].id : null,
      message: r
    })) };
  },
  fromBranchableArray: (t, e) => {
    const r = qi(!1, !1, !1, !1, void 0);
    return {
      ...(e == null ? void 0 : e.headId) !== void 0 ? { headId: e.headId } : void 0,
      messages: t.map(({ message: n, parentId: i }) => {
        if (!n.id)
          throw new Error("ExportedMessageRepository.fromBranchableArray: Each message must have an 'id' field set.");
        return {
          parentId: i,
          message: Pn(n, n.id, r)
        };
      })
    };
  }
}, xn = (t) => t.next ? xn(t.next) : "current" in t ? t : null;
var ov = class {
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
}, mu = class {
  constructor() {
    C(this, "messages", /* @__PURE__ */ new Map());
    C(this, "head", null);
    C(this, "root", {
      children: [],
      next: null
    });
    C(this, "_messages", new ov(() => {
      var e;
      const t = new Array((((e = this.head) == null ? void 0 : e.level) ?? -1) + 1);
      for (let r = this.head; r; r = r.prev)
        t[r.level] = r.current;
      return t;
    }));
  }
  updateLevels(t, e) {
    t.level = e;
    for (const r of t.children) {
      const n = this.messages.get(r);
      n && this.updateLevels(n, e + 1);
    }
  }
  performOp(t, e, r) {
    const n = e.prev ?? this.root, i = t ?? this.root;
    if (!(r === "relink" && n === i)) {
      if (r !== "link" && (n.children = n.children.filter((o) => o !== e.current.id), n.next === e)) {
        const o = n.children.at(-1), s = o ? this.messages.get(o) : null;
        if (s === void 0)
          throw new Error("MessageRepository(performOp/cut): Fallback sibling message not found. This is likely an internal bug in assistant-ui.");
        n.next = s;
      }
      if (r !== "cut") {
        for (let s = t; s; s = s.prev)
          if (s.current.id === e.current.id)
            throw new Error("MessageRepository(performOp/link): A message with the same id already exists in the parent tree. This error occurs if the same message id is found multiple times. This is likely an internal bug in assistant-ui.");
        i.children = [...i.children, e.current.id], (xn(e) === this.head || i.next === null) && (i.next = e), e.prev = t;
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
    var n;
    if (t === void 0 || t === ((n = this.head) == null ? void 0 : n.current.id))
      return this._messages.value;
    const e = this.messages.get(t);
    if (!e)
      throw new Error("MessageRepository(getMessages): Head message not found. This is likely an internal bug in assistant-ui.");
    const r = new Array(e.level + 1);
    for (let i = e; i; i = i.prev)
      r[i.level] = i.current;
    return r;
  }
  addOrUpdateMessage(t, e) {
    const r = this.messages.get(e.id), n = t ? this.messages.get(t) : null;
    if (n === void 0)
      throw new Error("MessageRepository(addOrUpdateMessage): Parent message not found. This is likely an internal bug in assistant-ui.");
    if (r) {
      r.current = e, this.performOp(n, r, "relink"), this._messages.dirty();
      return;
    }
    const i = {
      prev: n,
      current: e,
      next: null,
      children: [],
      level: n ? n.level + 1 : 0
    };
    this.messages.set(e.id, i), this.performOp(n, i, "link"), this.head === n && (this.head = i), this._messages.dirty();
  }
  getMessage(t) {
    var r;
    const e = this.messages.get(t);
    if (!e)
      throw new Error("MessageRepository(updateMessage): Message not found. This is likely an internal bug in assistant-ui.");
    return {
      parentId: ((r = e.prev) == null ? void 0 : r.current.id) ?? null,
      message: e.current,
      index: e.level
    };
  }
  deleteMessage(t, e) {
    const r = this.messages.get(t);
    if (!r)
      throw new Error("MessageRepository(deleteMessage): Message not found. This is likely an internal bug in assistant-ui.");
    const n = e === void 0 ? r.prev : e === null ? null : this.messages.get(e);
    if (n === void 0)
      throw new Error("MessageRepository(deleteMessage): Replacement not found. This is likely an internal bug in assistant-ui.");
    for (const i of r.children) {
      const o = this.messages.get(i);
      if (!o)
        throw new Error("MessageRepository(deleteMessage): Child message not found. This is likely an internal bug in assistant-ui.");
      this.performOp(n, o, "relink");
    }
    this.performOp(null, r, "cut"), this.messages.delete(t), this.head === r && (this.head = xn(n ?? this.root)), this._messages.dirty();
  }
  getBranches(t) {
    const e = this.messages.get(t);
    if (!e)
      throw new Error("MessageRepository(getBranches): Message not found. This is likely an internal bug in assistant-ui.");
    const { children: r } = e.prev ?? this.root;
    return r;
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
    const r = /* @__PURE__ */ new Set();
    for (let o = e; o; o = o.prev)
      r.add(o.current.id);
    const n = [];
    for (let o = t; o && !r.has(o.current.id); o = o.prev)
      (i = o.current.metadata) != null && i.isOptimistic && n.push(o.current.id);
    for (const o of n)
      this.messages.has(o) && this.deleteMessage(o);
  }
  switchToBranch(t) {
    const e = this.messages.get(t);
    if (!e)
      throw new Error("MessageRepository(switchToBranch): Branch not found. This is likely an internal bug in assistant-ui.");
    const r = this.head, n = e.prev ?? this.root;
    n.next = e, this.head = xn(e), this.evictOffBranchOptimisticMessages(r, this.head), this._messages.dirty();
  }
  resetHead(t) {
    if (t === null) {
      this.clear();
      return;
    }
    const e = this.messages.get(t);
    if (!e)
      throw new Error("MessageRepository(resetHead): Branch not found. This is likely an internal bug in assistant-ui.");
    const r = this.head;
    if (e.children.length > 0) {
      const n = (i) => {
        for (const o of i.children) {
          const s = this.messages.get(o);
          s && (n(s), this.messages.delete(o));
        }
      };
      n(e), e.children = [], e.next = null;
    }
    this.head = e;
    for (let n = e; n; n = n.prev)
      n.prev ? n.prev.next = n : this.root.next = n;
    this.evictOffBranchOptimisticMessages(r, this.head), this._messages.dirty();
  }
  clear() {
    this.messages.clear(), this.head = null, this.root = {
      children: [],
      next: null
    }, this._messages.dirty();
  }
  export() {
    var e, r;
    const t = [];
    for (const [, n] of this.messages)
      (e = n.current.metadata) != null && e.isOptimistic || t.push({
        message: n.current,
        parentId: ((r = n.prev) == null ? void 0 : r.current.id) ?? null
      });
    return {
      headId: this.canonicalHeadId,
      messages: t
    };
  }
  import({ headId: t, messages: e }) {
    var r;
    for (const { message: n, parentId: i } of e)
      this.addOrUpdateMessage(i, n);
    this.resetHead(t ?? ((r = e.at(-1)) == null ? void 0 : r.message.id) ?? null);
  }
};
const qr = Object.freeze([]);
function Zs(t, e) {
  if (e === "*")
    return !0;
  const r = e.split(",").map((o) => o.trim().toLowerCase()), n = `.${t.name.split(".").pop().toLowerCase()}`, i = t.type.toLowerCase();
  for (const o of r) {
    if (o.startsWith(".") && o === n || o.includes("/") && o === i)
      return !0;
    if (o.endsWith("/*")) {
      const s = o.split("/")[0];
      if (i.startsWith(`${s}/`))
        return !0;
    }
  }
  return !1;
}
function sv(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.id === e[n].id);
}
function av(t) {
  const e = ct();
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
function lv(t) {
  const e = [];
  for (const r of t)
    r.type !== "text" && e.push(av(r));
  return e;
}
const ci = (t) => t.status.type === "complete";
var fu = class extends Zr {
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
  enrichWithComposerMetadata(e, r) {
    var n;
    return r ? {
      ...e,
      metadata: {
        ...e.metadata,
        custom: {
          ...(n = e.metadata) == null ? void 0 : n.custom,
          ...r
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
        const { status: r, inputDisabled: n } = this._dictation;
        this._dictation = n ? {
          status: r,
          inputDisabled: n
        } : { status: r };
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
      const r = this._attachments.filter((n) => !ci(n));
      await Promise.all(r.map((n) => e.remove(n)));
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
    const r = this.getAttachmentAdapter(), n = this.attachments.length > 0 ? Promise.all(this.attachments.map(async (a) => {
      if (ci(a))
        return a;
      if (!r)
        throw new Error("Attachments are not supported");
      return await r.send(a);
    })) : [], i = this.text, o = this._quote;
    this._quote = void 0, this._emptyTextAndAttachments();
    const s = {
      createdAt: /* @__PURE__ */ new Date(),
      role: this.role,
      content: i ? [{
        type: "text",
        text: i
      }] : [],
      attachments: await n,
      runConfig: this.runConfig,
      metadata: { custom: { ...o ? { quote: o } : {} } }
    };
    this.handleSend(s, e), this._notifyEventSubscribers("send", {});
  }
  cancel() {
    this.handleCancel();
  }
  get queue() {
    return qr;
  }
  steerQueueItem(e) {
  }
  removeQueueItem(e) {
  }
  async addAttachment(e) {
    if (!(e instanceof File)) {
      const o = this.getAttachmentAdapter();
      if (o && !Zs({
        name: e.name,
        type: e.contentType ?? ""
      }, o.accept)) {
        const a = `File type ${e.contentType || "unknown"} is not accepted. Accepted types: ${o.accept}`, l = new Error(a);
        throw this._safeEmitAttachmentAddError("not-accepted", a, void 0, l), l;
      }
      const s = {
        id: e.id ?? ct(),
        type: e.type ?? "document",
        name: e.name,
        contentType: e.contentType,
        content: e.content,
        status: { type: "complete" }
      };
      this._attachments = [...this._attachments, s], this._notifySubscribers(), this._notifyEventSubscribers("attachmentAdd", {});
      return;
    }
    const r = (o) => {
      const s = this._attachments.findIndex((a) => a.id === o.id);
      s !== -1 ? this._attachments = [
        ...this._attachments.slice(0, s),
        o,
        ...this._attachments.slice(s + 1)
      ] : this._attachments = [...this._attachments, o], this._notifySubscribers();
    }, n = this.getAttachmentAdapter();
    if (!n) {
      const o = "Attachments are not supported", s = /* @__PURE__ */ new Error(o);
      throw this._safeEmitAttachmentAddError("no-adapter", o, void 0, s), s;
    }
    if (!Zs({
      name: e.name,
      type: e.type
    }, n.accept)) {
      const o = `File type ${e.type || "unknown"} is not accepted. Accepted types: ${n.accept}`, s = new Error(o);
      throw this._safeEmitAttachmentAddError("not-accepted", o, void 0, s), s;
    }
    let i;
    try {
      const o = n.add({ file: e });
      if (Symbol.asyncIterator in o)
        for await (const s of o)
          i = s, r(s);
      else
        i = await o, r(i);
    } catch (o) {
      throw i && r({
        ...i,
        status: {
          type: "incomplete",
          reason: "error"
        }
      }), this._safeEmitAttachmentAddError("adapter-error", o instanceof Error ? o.message : String(o), i == null ? void 0 : i.id, o instanceof Error ? o : void 0), o;
    }
    (i == null ? void 0 : i.status.type) === "incomplete" && i.status.reason === "error" ? this._safeEmitAttachmentAddError("adapter-error", "Attachment upload did not complete successfully.", i == null ? void 0 : i.id) : this._notifyEventSubscribers("attachmentAdd", {});
  }
  _safeEmitAttachmentAddError(e, r, n, i) {
    try {
      this._notifyEventSubscribers("attachmentAddError", {
        reason: e,
        message: r,
        ...n !== void 0 && { attachmentId: n },
        ...i !== void 0 && { error: i }
      });
    } catch (o) {
      console.error("[assistant-ui] attachmentAddError subscriber threw:", o);
    }
  }
  async removeAttachment(e) {
    const r = this._attachments.findIndex((i) => i.id === e);
    if (r === -1)
      throw new Error("Attachment not found");
    const n = this._attachments[r];
    if (!ci(n)) {
      const i = this.getAttachmentAdapter();
      if (!i)
        throw new Error("Attachments are not supported");
      await i.remove(n);
    }
    this._attachments = this._attachments.filter((i) => i.id !== e), this._notifySubscribers();
  }
  get dictation() {
    return this._dictation;
  }
  _isActiveSession(e, r) {
    return this._activeDictationSessionId === e && this._dictationSession === r;
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
    const r = e.disableInputDuringDictation ?? !1;
    this._dictationBaseText = this._text, this._currentInterimText = "";
    const n = e.listen();
    this._dictationSession = n;
    const i = ++this._dictationSessionIdCounter;
    this._activeDictationSessionId = i, this._dictation = {
      status: n.status,
      inputDisabled: r
    }, this._notifySubscribers();
    const o = n.onSpeech((c) => {
      if (!this._isActiveSession(i, n))
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
    const s = n.onSpeechStart(() => {
      var c;
      this._isActiveSession(i, n) && (this._dictation = {
        status: { type: "running" },
        inputDisabled: r,
        ...((c = this._dictation) == null ? void 0 : c.transcript) && { transcript: this._dictation.transcript }
      }, this._notifySubscribers());
    });
    this._dictationUnsubscribes.push(s);
    const a = n.onSpeechEnd(() => {
      this._cleanupDictation({ sessionId: i });
    });
    this._dictationUnsubscribes.push(a);
    const l = setInterval(() => {
      this._isActiveSession(i, n) && n.status.type === "ended" && this._cleanupDictation({ sessionId: i });
    }, 100);
    this._dictationUnsubscribes.push(() => clearInterval(l));
  }
  stopDictation() {
    if (!this._dictationSession)
      return;
    const e = this._dictationSession, r = this._activeDictationSessionId;
    e.stop().finally(() => {
      this._cleanupDictation({ sessionId: r });
    });
  }
  _cleanupDictation(e) {
    if (!((e == null ? void 0 : e.sessionId) !== void 0 && e.sessionId !== this._activeDictationSessionId || this._isCleaningDictation)) {
      this._isCleaningDictation = !0;
      try {
        for (const r of this._dictationUnsubscribes)
          r();
        this._dictationUnsubscribes = [], this._dictationSession = void 0, this._activeDictationSessionId = void 0, this._dictation = void 0, this._dictationBaseText = "", this._currentInterimText = "", this._notifySubscribers();
      } finally {
        this._isCleaningDictation = !1;
      }
    }
  }
  _notifyEventSubscribers(e, r) {
    const n = this._eventSubscribers.get(e);
    if (n)
      for (const i of n)
        i(r);
  }
  unstable_on(e, r) {
    const n = r;
    let i = this._eventSubscribers.get(e);
    return i || (i = /* @__PURE__ */ new Set(), this._eventSubscribers.set(e, i)), i.add(n), () => {
      var o;
      (o = this._eventSubscribers.get(e)) == null || o.delete(n);
    };
  }
}, gu = class extends fu {
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
    var e, r;
    return ((r = (e = this.runtime).getQueueItems) == null ? void 0 : r.call(e)) ?? qr;
  }
  steerQueueItem(e) {
    var r, n;
    (n = (r = this.runtime).steerQueueItem) == null || n.call(r, e);
  }
  removeQueueItem(e) {
    var r, n;
    (n = (r = this.runtime).removeQueueItem) == null || n.call(r, e);
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
    let e = this.runtime.isSendDisabled, r = this.queue;
    return this.runtime.subscribe(() => {
      let n = !1;
      this.canCancel !== this.runtime.capabilities.cancel && (this._canCancel = this.runtime.capabilities.cancel, n = !0), e !== this.runtime.isSendDisabled && (e = this.runtime.isSendDisabled, n = !0), r !== this.queue && (r = this.queue, n = !0), n && this._notifySubscribers();
    });
  }
  async handleSend(e, r) {
    var o;
    const n = Yc(this.runtime.getModelContext().unstable_composerMetadata, this.runtime.messages), i = this.enrichWithComposerMetadata(e, n);
    this.runtime.append({
      ...i,
      parentId: ((o = this.runtime.messages.at(-1)) == null ? void 0 : o.id) ?? null,
      sourceId: null,
      startRun: r == null ? void 0 : r.startRun,
      steer: r == null ? void 0 : r.steer
    });
  }
  async handleCancel() {
    this.runtime.cancelRun();
  }
}, cv = class extends fu {
  constructor(e, r, { parentId: n, message: i }) {
    super();
    C(this, "runtime");
    C(this, "endEditCallback");
    C(this, "_previousText");
    C(this, "_previousAttachments");
    C(this, "_nonTextPassthrough");
    C(this, "_parentId");
    C(this, "_sourceId");
    this.runtime = e, this.endEditCallback = r, this._parentId = n, this._sourceId = i.id, this._previousText = Vr(i), this.setText(this._previousText), this.setRole(i.role), i.role === "user" ? (this._previousAttachments = [...i.attachments ?? [], ...lv(i.content)], this._nonTextPassthrough = []) : (this._previousAttachments = i.attachments ?? [], this._nonTextPassthrough = i.content.filter((o) => o.type !== "text")), this.setAttachments(this._previousAttachments), this.setRunConfig({ ...e.composer.runConfig });
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
  async handleSend(e, r) {
    const n = Vr(e), i = !sv(e.attachments ?? [], this._previousAttachments);
    if (n !== this._previousText || i || r != null && r.startRun) {
      const o = this._nonTextPassthrough.length > 0 ? [...e.content, ...this._nonTextPassthrough] : e.content, s = this.runtime.messages, a = this._parentId === null ? -1 : s.findIndex((d) => d.id === this._parentId), l = Yc(this.runtime.getModelContext().unstable_composerMetadata, s.slice(0, a + 1)), c = this.enrichWithComposerMetadata(e, l);
      this.runtime.append({
        ...c,
        content: o,
        parentId: this._parentId,
        sourceId: this._sourceId,
        startRun: r == null ? void 0 : r.startRun
      });
    }
    this.handleCancel();
  }
  handleCancel() {
    this.endEditCallback(), this._notifySubscribers();
  }
}, uv = class {
  constructor(t) {
    C(this, "_contextProvider");
    C(this, "_subscriptions", /* @__PURE__ */ new Set());
    C(this, "_isInitialized", !1);
    C(this, "repository", new mu());
    C(this, "_voiceMessages", []);
    C(this, "_voiceGeneration", 0);
    C(this, "_cachedMergedMessages", null);
    C(this, "_cachedVoiceGeneration", -1);
    C(this, "_cachedMergedBase", null);
    C(this, "composer", new gu(this));
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
    this._editComposers.set(t, new cv(this, () => this._editComposers.delete(t), this.repository.getMessage(t))), this._notifySubscribers();
  }
  getMessageById(t) {
    var e;
    try {
      return this.repository.getMessage(t);
    } catch {
      const r = this.repository.getMessages(), n = this._voiceMessages.findIndex((i) => i.id === t);
      return n !== -1 ? {
        parentId: n > 0 ? this._voiceMessages[n - 1].id : ((e = r.at(-1)) == null ? void 0 : e.id) ?? null,
        message: this._voiceMessages[n],
        index: r.length + n
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
    const r = this._eventSubscribers.get(t);
    if (r)
      for (const n of r)
        n(e);
  }
  subscribe(t) {
    return this._subscriptions.add(t), () => this._subscriptions.delete(t);
  }
  submitFeedback({ messageId: t, type: e }) {
    var o;
    const r = (o = this.adapters) == null ? void 0 : o.feedback;
    if (!r)
      throw new Error("Feedback adapter not configured");
    const { message: n, parentId: i } = this.repository.getMessage(t);
    if (r.submit({
      message: n,
      type: e
    }), n.role === "assistant") {
      const s = {
        ...n,
        metadata: {
          ...n.metadata,
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
    const { message: r } = this.repository.getMessage(t);
    (s = this._stopSpeaking) == null || s.call(this);
    const n = e.speak(Vr(r)), i = n.subscribe(() => {
      n.status.type === "ended" ? (this._stopSpeaking = void 0, this.speech = void 0) : this.speech = {
        messageId: t,
        status: n.status
      }, this._notifySubscribers();
    });
    this.speech = {
      messageId: t,
      status: n.status
    }, this._notifySubscribers(), this._stopSpeaking = () => {
      n.cancel(), i(), this.speech = void 0, this._stopSpeaking = void 0;
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
    const r = [];
    let n = "listening";
    this.voice = {
      status: e.status,
      isMuted: e.isMuted,
      mode: n
    }, this._voiceVolume = 0, this._notifySubscribers(), r.push(e.onStatusChange((o) => {
      o.type === "ended" ? (this._finishVoiceAssistantMessage(), this._voiceSession = void 0, this.voice = void 0) : this.voice = {
        status: o,
        isMuted: e.isMuted,
        mode: n
      }, this._notifySubscribers();
    })), r.push(e.onModeChange((o) => {
      n = o, this.voice && (this.voice = {
        ...this.voice,
        mode: o
      }, this._notifySubscribers());
    })), r.push(e.onVolumeChange((o) => {
      this._voiceVolume = o;
      for (const s of this._voiceVolumeSubscribers)
        s();
    })), r.push(e.onTranscript((o) => {
      this._handleVoiceTranscript(o);
    })), this._voiceUnsubs = r;
  }
  _handleVoiceTranscript(t) {
    if (this.ensureInitialized(), t.role === "user")
      this._finishVoiceAssistantMessage(), this._currentAssistantMsg = null, t.isFinal && (this._voiceMessages.push({
        id: ct(),
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
          id: ct(),
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
        const r = {
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
        this._voiceMessages[e] = r, this._currentAssistantMsg = r;
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
    this.import(pu.fromArray(t ?? []));
  }
  unstable_on(t, e) {
    var i, o;
    const r = e;
    if (t === "modelContextUpdate")
      return ((o = (i = this._contextProvider).subscribe) == null ? void 0 : o.call(i, () => r({}))) ?? (() => {
      });
    let n = this._eventSubscribers.get(t);
    return n || (n = /* @__PURE__ */ new Set(), this._eventSubscribers.set(t, n)), n.add(r), t === "initialize" && this._isInitialized && queueMicrotask(() => {
      n.has(r) && r({});
    }), () => {
      var s;
      (s = this._eventSubscribers.get(t)) == null || s.delete(r);
    };
  }
};
const dv = (t) => {
  const e = A(3), { detectorRef: r } = t;
  let n, i;
  return e[0] !== r ? (n = () => {
    r.current = !0;
  }, i = [r], e[0] = r, e[1] = n, e[2] = i) : (n = e[1], i = e[2]), Fr(n, i), null;
};
var hv = class extends Zr {
  constructor(e, r) {
    super();
    C(this, "useRuntimeHook");
    C(this, "instances", /* @__PURE__ */ new Map());
    C(this, "useAliveThreadsKeysChanged", mr(() => ({})));
    C(this, "parent");
    C(this, "_RuntimeBinder", ({ threadId: e, children: r }) => {
      const { useRuntime: n } = this.useRuntimeHook(), i = n(), o = i.thread.__internal_threadBinding, s = kt(() => {
        const u = this.instances.get(e);
        if (!u)
          throw new Error("Thread not found. This is a bug in assistant-ui.");
        u.runtime = o.getState(), this._notifySubscribers();
      }, [e, o]), a = Z(!1);
      a.current || s(), Q(() => (a.current = !0, s(), o.outerSubscribe(s)), [o, s]);
      const l = J(), c = Z(void 0), d = Z(!1);
      return Q(() => {
        const u = o.getState(), h = u.__internal_setGetInitializePromise;
        typeof h == "function" && h.call(u, () => c.current);
      }, [o]), Q(() => (d.current = !1, i.threads.main.unstable_on("initialize", () => {
        if (d.current || l.threadListItem().getState().status !== "new")
          return;
        d.current = !0, c.current = l.threadListItem().initialize();
        const u = i.thread.unstable_on("runEnd", () => {
          u(), l.threadListItem().generateTitle();
        });
      })), [i, l]), /* @__PURE__ */ f(tt, { children: r });
    });
    C(this, "_OuterActiveThreadProvider", we(({ threadId: e, provider: r }) => {
      const n = ce(() => new hu(this.parent).getItemById(e), [e]), i = Z(!1);
      return Q(() => {
        if ({}.NODE_ENV !== "production" && r !== Bt) {
          const o = setTimeout(() => {
            i.current || console.warn("RemoteThreadListAdapter.unstable_Provider did not render its `children` synchronously. Render `children` on first commit; deferring them behind a loading state, Suspense boundary, or `useEffect` gate strands the runtime binder and leaves the thread without context.");
          }, 100);
          return () => clearTimeout(o);
        }
      }, [r]), /* @__PURE__ */ f(Tb, {
        runtime: n,
        children: /* @__PURE__ */ f(r, { children: /* @__PURE__ */ f(this._RuntimeBinder, {
          threadId: e,
          children: /* @__PURE__ */ f(dv, { detectorRef: i })
        }) })
      });
    }));
    C(this, "__internal_RenderThreadRuntimes", ({ provider: e }) => (this.useAliveThreadsKeysChanged(), Array.from(this.instances.keys()).map((r) => /* @__PURE__ */ f(this._OuterActiveThreadProvider, {
      threadId: r,
      provider: e
    }, r))));
    this.parent = r, this.useRuntimeHook = mr(() => ({ useRuntime: e }));
  }
  startThreadRuntime(e) {
    return this.instances.has(e) || (this.instances.set(e, {}), this.useAliveThreadsKeysChanged.setState({}, !0)), new Promise((r, n) => {
      const i = () => {
        const s = this.instances.get(e);
        if (!s)
          o(), n(/* @__PURE__ */ new Error("Thread was deleted before runtime was started"));
        else if (s.runtime)
          o(), r(s.runtime);
        else
          return;
      }, o = this.subscribe(i);
      i();
    });
  }
  getThreadRuntimeCore(e) {
    const r = this.instances.get(e);
    if (r)
      return r.runtime;
  }
  stopThreadRuntime(e) {
    this.instances.delete(e), this.useAliveThreadsKeysChanged.setState({}, !0);
  }
  setRuntimeHook(e) {
    this.useRuntimeHook.getState().useRuntime !== e && this.useRuntimeHook.setState({ useRuntime: e }, !0);
  }
};
const ea = (t, e, r) => r.reduce((n, i) => (i == null ? void 0 : i(n, e)) ?? n, t);
var pv = class extends Zr {
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
    this._cachedValue = this._pendingTransforms.reduce((e, r) => ea(e, r.task, [r.loading, r.optimistic]), this._baseValue), this._notifySubscribers();
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
    const r = e.execute(), n = {
      ...e,
      task: r
    };
    try {
      this._pendingTransforms.push(n), this._updateState();
      const i = await r;
      this._baseValue = ea(this._baseValue, i, [e.optimistic, e.then]);
      for (const o of this._completedOptimistics)
        this._baseValue = o(this._baseValue);
      return e.optimistic && this._completedOptimistics.push(e.optimistic), i;
    } finally {
      const i = this._pendingTransforms.indexOf(n);
      i > -1 && this._pendingTransforms.splice(i, 1), this._pendingTransforms.length === 0 && (this._completedOptimistics.length = 0), this._updateState();
    }
  }
};
const ue = /* @__PURE__ */ new Error("This is the empty thread, a placeholder for the main thread. You cannot perform any actions on this thread instance. This error is probably because you tried to call a thread method in your render function. Call the method inside a `useEffect` hook instead."), mv = {
  getMessageById() {
  },
  getBranches() {
    return [];
  },
  switchToBranch() {
    throw ue;
  },
  append() {
    throw ue;
  },
  deleteMessage() {
    throw ue;
  },
  startRun() {
    throw ue;
  },
  resumeRun() {
    throw ue;
  },
  cancelRun() {
    throw ue;
  },
  addToolResult() {
    throw ue;
  },
  resumeToolCall() {
    throw ue;
  },
  respondToToolApproval() {
    throw ue;
  },
  speak() {
    throw ue;
  },
  stopSpeaking() {
    throw ue;
  },
  connectVoice() {
    throw ue;
  },
  disconnectVoice() {
    throw ue;
  },
  getVoiceVolume: () => 0,
  subscribeVoiceVolume: () => () => {
  },
  muteVoice() {
    throw ue;
  },
  unmuteVoice() {
    throw ue;
  },
  submitFeedback() {
    throw ue;
  },
  getModelContext() {
    return {};
  },
  exportExternalState() {
    throw ue;
  },
  importExternalState() {
    throw ue;
  },
  composer: {
    attachments: [],
    attachmentAccept: "*",
    async addAttachment() {
      throw ue;
    },
    async removeAttachment() {
      throw ue;
    },
    isEditing: !0,
    canCancel: !1,
    canSend: !1,
    isEmpty: !0,
    text: "",
    setText() {
      throw ue;
    },
    role: "user",
    setRole() {
      throw ue;
    },
    runConfig: {},
    setRunConfig() {
      throw ue;
    },
    async reset() {
    },
    async clearAttachments() {
    },
    send() {
      throw ue;
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
      throw ue;
    },
    stopDictation() {
    },
    quote: void 0,
    setQuote() {
      throw ue;
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
    throw ue;
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
    throw ue;
  },
  export() {
    return { messages: [] };
  },
  reset() {
    throw ue;
  },
  unstable_on() {
    return () => {
    };
  }
};
const ta = (t) => t || void 0, ra = (t, e) => {
  for (const r of t) {
    if (e.threadIdMap[r.remoteId] !== void 0)
      continue;
    switch (r.status) {
      case "regular":
        e.threadIds.push(r.remoteId);
        break;
      case "archived":
        e.archivedThreadIds.push(r.remoteId);
        break;
      default: {
        const i = r.status;
        throw new Error(`Unsupported state: ${i}`);
      }
    }
    const n = r.remoteId;
    e.threadIdMap[r.remoteId] = n, e.threadData[n] = {
      id: r.remoteId,
      remoteId: r.remoteId,
      externalId: r.externalId,
      status: r.status,
      title: r.title,
      lastMessageAt: r.lastMessageAt,
      custom: r.custom,
      initializeTask: Promise.resolve({
        remoteId: r.remoteId,
        externalId: r.externalId
      })
    };
  }
  return e;
}, Dt = (t, e) => {
  const r = t.threadIdMap[e];
  if (r !== void 0)
    return t.threadData[r];
}, un = (t, e, r) => {
  const n = Dt(t, e);
  if (!n)
    return t;
  const { id: i, remoteId: o, status: s } = n;
  if (s === r)
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
  switch (r) {
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
      throw new Error(`Unsupported state: ${r}`);
  }
  return r !== "deleted" && (a.threadData = {
    ...a.threadData,
    [i]: {
      ...n,
      status: r
    }
  }), a;
};
var fv = class extends Zr {
  constructor(e, r) {
    super();
    C(this, "_options");
    C(this, "_hookManager");
    C(this, "_loadThreadsPromise");
    C(this, "_loadMorePromise");
    C(this, "_loadGeneration", 0);
    C(this, "_mainThreadId");
    C(this, "_state", new pv({
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
        const r = this.getItemById(e);
        if (!r)
          throw new Error("Thread not found");
        if (r.status === "new")
          throw new Error("Unexpected new state");
        return r.initializeTask;
      }
      return this._state.optimisticUpdate({
        execute: () => this._options.adapter.initialize(e),
        optimistic: (r) => un(r, e, "regular"),
        loading: (r, n) => {
          const i = e;
          return {
            ...r,
            threadData: {
              ...r.threadData,
              [i]: {
                ...r.threadData[i],
                initializeTask: n
              }
            }
          };
        },
        then: (r, { remoteId: n, externalId: i }) => {
          const o = Dt(r, e);
          if (!o)
            return r;
          const s = e;
          return {
            ...r,
            threadIdMap: {
              ...r.threadIdMap,
              [n]: s
            },
            threadData: {
              ...r.threadData,
              [s]: {
                ...o,
                initializeTask: Promise.resolve({
                  remoteId: n,
                  externalId: i
                }),
                remoteId: n,
                externalId: i
              }
            }
          };
        }
      });
    });
    C(this, "generateTitle", async (e) => {
      var l;
      const r = this.getItemById(e);
      if (!r)
        throw new Error("Thread not found");
      if (r.status === "new")
        throw new Error("Thread is not yet initialized");
      const { remoteId: n } = await r.initializeTask, i = this._hookManager.getThreadRuntimeCore(r.id);
      if (!i)
        return;
      const o = i.messages, s = await this._options.adapter.generateTitle(n, o), a = Sb.fromAssistantStream(s);
      for await (const c of a) {
        const d = (l = c.parts.filter((p) => p.type === "text")[0]) == null ? void 0 : l.text, u = this._state.baseValue, h = Dt(u, r.id);
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
    C(this, "useBoundIds", mr(() => []));
    C(this, "__internal_RenderComponent", () => {
      const e = mo();
      Q(() => (this.useBoundIds.setState((o) => [...o, e], !0), () => {
        this.useBoundIds.setState((o) => o.filter((s) => s !== e), !0);
      }), [e]);
      const r = this.useBoundIds(), { Provider: n } = this.useProvider(), i = { modelContext: this.contextProvider };
      return (r.length === 0 || r[0] === e) && /* @__PURE__ */ f(du, {
        adapters: i,
        children: /* @__PURE__ */ f(this._hookManager.__internal_RenderThreadRuntimes, { provider: n })
      });
    });
    this.contextProvider = r, this._state.subscribe(() => {
      this._notifySubscribers(), this._notifyThreadIdChange();
    }), this._hookManager = new hv(e.runtimeHook, this), this.useProvider = mr(() => ({ Provider: e.adapter.unstable_Provider ?? Bt })), this.__internal_setOptions(e), this.switchToNewThread();
  }
  get threadItems() {
    return this._state.value.threadData;
  }
  getLoadThreadsPromise() {
    if (!this._loadThreadsPromise) {
      const e = this._loadGeneration;
      this._loadThreadsPromise = this._state.optimisticUpdate({
        execute: () => this._options.adapter.list(),
        loading: (r) => ({
          ...r,
          isLoading: !0
        }),
        then: (r, n) => {
          if (e !== this._loadGeneration)
            return r;
          const i = ra(n.threads, {
            threadIds: [],
            archivedThreadIds: [],
            threadIdMap: {},
            threadData: {}
          });
          return {
            ...r,
            isLoading: !1,
            cursor: ta(n.nextCursor),
            threadIds: i.threadIds,
            archivedThreadIds: i.archivedThreadIds,
            threadIdMap: {
              ...r.threadIdMap,
              ...i.threadIdMap
            },
            threadData: {
              ...r.threadData,
              ...i.threadData
            }
          };
        }
      }).catch((r) => {
        e === this._loadGeneration && (console.error("[assistant-ui] thread list load failed:", r), this._loadThreadsPromise = void 0, this._state.update({
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
    const r = this._loadGeneration, n = this._options.adapter, i = e.cursor, o = this._state.optimisticUpdate({
      execute: () => n.list({ after: i }),
      loading: (s) => ({
        ...s,
        isLoadingMore: !0
      }),
      then: (s, a) => {
        if (r !== this._loadGeneration || n !== this._options.adapter)
          return s;
        const l = ra(a.threads, {
          threadIds: [...s.threadIds],
          archivedThreadIds: [...s.archivedThreadIds],
          threadIdMap: { ...s.threadIdMap },
          threadData: { ...s.threadData }
        });
        return {
          ...s,
          isLoadingMore: !1,
          cursor: ta(a.nextCursor),
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
    const r = this._options !== void 0 && this._options.adapter !== e.adapter;
    this._options = e;
    const n = e.adapter.unstable_Provider ?? Bt;
    n !== this.useProvider.getState().Provider && this.useProvider.setState({ Provider: n }, !0), this._hookManager.setRuntimeHook(e.runtimeHook), r && (this._loadGeneration++, this._loadThreadsPromise = void 0, this._loadMorePromise = void 0, this._state.update({
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
      return (e = Dt(this._state.value, this._mainThreadId)) == null ? void 0 : e.remoteId;
  }
  _notifyThreadIdChange() {
    var r, n;
    const e = this._mainThreadRemoteId;
    this._lastNotifiedThreadId !== e && (this._lastNotifiedThreadId = e, (n = (r = this._options).onThreadIdChange) == null || n.call(r, e));
  }
  getMainThreadRuntimeCore() {
    const e = this._hookManager.getThreadRuntimeCore(this._mainThreadId);
    return e || mv;
  }
  getThreadRuntimeCore(e) {
    const r = this.getItemById(e);
    if (!r)
      throw new Error("Thread not found");
    const n = this._hookManager.getThreadRuntimeCore(r.id);
    if (!n)
      throw new Error("Thread not found");
    return n;
  }
  getItemById(e) {
    return Dt(this._state.value, e);
  }
  async switchToThread(e, r) {
    let n = this.getItemById(e);
    if (!n) {
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
      }), n = this.getItemById(e);
    }
    if (!n)
      throw new Error("Thread not found");
    if (this._mainThreadId === n.id)
      return;
    const i = this._hookManager.startThreadRuntime(n.id);
    this.mainThreadId !== void 0 ? await i : i.then(() => this._notifySubscribers()), n.status === "archived" && (r == null ? void 0 : r.unarchive) !== !1 && await this.unarchive(n.id), this._mainThreadId = n.id, this._notifySubscribers(), this._notifyThreadIdChange();
  }
  async switchToNewThread() {
    for (; this._state.baseValue.newThreadId !== void 0 && this._state.value.newThreadId === void 0; )
      await this._state.waitForUpdate();
    const e = this._state.value;
    let r = this._state.value.newThreadId;
    if (r === void 0) {
      do
        r = `__LOCALID_${ct()}`;
      while (e.threadIdMap[r]);
      const n = r;
      this._state.update({
        ...e,
        newThreadId: r,
        threadIdMap: {
          ...e.threadIdMap,
          [r]: n
        },
        threadData: {
          ...e.threadData,
          [n]: {
            status: "new",
            id: r,
            remoteId: void 0,
            externalId: void 0,
            title: void 0,
            custom: void 0
          }
        }
      });
    }
    return this.switchToThread(r);
  }
  rename(e, r) {
    const n = this.getItemById(e);
    if (!n)
      throw new Error("Thread not found");
    if (n.status === "new")
      throw new Error("Thread is not yet initialized");
    return this._state.optimisticUpdate({
      execute: async () => {
        const { remoteId: i } = await n.initializeTask;
        return this._options.adapter.rename(i, r);
      },
      optimistic: (i) => {
        const o = Dt(i, e);
        return o ? {
          ...i,
          threadData: {
            ...i.threadData,
            [o.id]: {
              ...o,
              title: r
            }
          }
        } : i;
      }
    });
  }
  updateCustom(e, r) {
    const n = this.getItemById(e);
    if (!n)
      throw new Error("Thread not found");
    if (n.status === "new")
      throw new Error("Thread is not yet initialized");
    if (!this._options.adapter.updateCustom)
      throw new Error("Remote thread list adapter does not support updating custom metadata");
    return this._state.optimisticUpdate({
      execute: async () => {
        const { remoteId: i } = await n.initializeTask, o = this._options.adapter;
        if (!o.updateCustom)
          throw new Error("Remote thread list adapter does not support updating custom metadata");
        return o.updateCustom(i, r);
      },
      optimistic: (i) => {
        const o = Dt(i, e);
        return o ? {
          ...i,
          threadData: {
            ...i.threadData,
            [o.id]: {
              ...o,
              custom: r
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
    const r = this.getItemById(e);
    if (!r)
      throw new Error("Thread not found");
    if (r.status !== "regular")
      throw new Error("Thread is not yet initialized or already archived");
    return await this._ensureThreadIsNotMain(r.id), this._state.optimisticUpdate({
      execute: async () => {
        const { remoteId: n } = await r.initializeTask;
        return this._options.adapter.archive(n);
      },
      optimistic: (n) => un(n, r.id, "archived")
    });
  }
  unarchive(e) {
    const r = this.getItemById(e);
    if (!r)
      throw new Error("Thread not found");
    if (r.status !== "archived")
      throw new Error("Thread is not archived");
    return this._state.optimisticUpdate({
      execute: async () => {
        try {
          const { remoteId: n } = await r.initializeTask;
          return await this._options.adapter.unarchive(n);
        } catch (n) {
          throw await this._ensureThreadIsNotMain(r.id), n;
        }
      },
      optimistic: (n) => un(n, r.id, "regular")
    });
  }
  async delete(e) {
    const r = this.getItemById(e);
    if (!r)
      throw new Error("Thread not found");
    if (r.status !== "regular" && r.status !== "archived")
      throw new Error("Thread is not yet initialized");
    return await this._ensureThreadIsNotMain(r.id), this._hookManager.stopThreadRuntime(r.id), this._state.optimisticUpdate({
      execute: async () => {
        const { remoteId: n } = await r.initializeTask;
        return await this._options.adapter.delete(n);
      },
      optimistic: (n) => un(n, r.id, "deleted")
    });
  }
  async detach(e) {
    const r = this.getItemById(e);
    if (!r)
      throw new Error("Thread not found");
    if (r.status !== "regular" && r.status !== "archived")
      throw new Error("Thread is not yet initialized");
    await this._ensureThreadIsNotMain(r.id), this._hookManager.stopThreadRuntime(r.id);
  }
}, gv = class extends Do {
  constructor(e) {
    super();
    C(this, "threads");
    this.threads = new fv(e, this._contextProvider);
  }
  get RenderComponent() {
    return this.threads.__internal_RenderComponent;
  }
};
const bv = (t) => {
  const e = A(10);
  let r;
  e[0] !== t ? (r = () => new gv(t), e[0] = t, e[1] = r) : r = e[1];
  const [n] = ve(r);
  let i;
  e[2] !== t || e[3] !== n.threads ? (i = () => {
    n.threads.__internal_setOptions(t), n.threads.__internal_load();
  }, e[2] = t, e[3] = n.threads, e[4] = i) : i = e[4];
  let o;
  e[5] !== t || e[6] !== n ? (o = [n, t], e[5] = t, e[6] = n, e[7] = o) : o = e[7], Q(i, o);
  let s;
  return e[8] !== n ? (s = new Mo(n), e[8] = n, e[9] = s) : s = e[9], s;
}, vv = (t) => {
  const e = Z(t.runtimeHook);
  e.current = t.runtimeHook;
  const r = Z(t.threadId ?? t.initialThreadId), n = kt(() => e.current(), []), i = Fe((l) => {
    var c;
    (c = t.onThreadIdChange) == null || c.call(t, l);
  }), o = ce(() => ({
    adapter: t.adapter,
    allowNesting: t.allowNesting,
    initialThreadId: r.current,
    runtimeHook: n,
    onThreadIdChange: i
  }), [
    t.adapter,
    t.allowNesting,
    n
  ]);
  if (J().threadListItem.source !== null) {
    if (!o.allowNesting)
      throw new Error("useRemoteThreadListRuntime cannot be nested inside another RemoteThreadListRuntime. Set allowNesting: true to allow nesting (the inner runtime will become a no-op).");
    return n();
  }
  const s = bv(o), a = Z(t.threadId);
  return Q(() => {
    t.threadId !== a.current && (a.current = t.threadId, t.threadId ? s.threads.switchToThread(t.threadId).catch(() => {
    }) : s.threads.switchToNewThread().catch(() => {
    }));
  }, [s, t.threadId]), s;
};
function wv(t) {
  var r;
  const e = ((r = t.status) == null ? void 0 : r.type) === "running" ? {
    type: "incomplete",
    reason: "cancelled"
  } : t.status;
  return {
    role: t.role,
    content: t.content.map((n) => {
      const i = n.type;
      switch (i) {
        case "text":
          return {
            type: "text",
            text: n.text
          };
        case "reasoning":
          return {
            type: "reasoning",
            text: n.text
          };
        case "source":
          return n.sourceType === "url" ? {
            type: "source",
            sourceType: "url",
            id: n.id,
            url: n.url,
            ...n.title != null ? { title: n.title } : void 0,
            ...n.providerMetadata != null ? { providerMetadata: n.providerMetadata } : void 0
          } : {
            type: "source",
            sourceType: "document",
            id: n.id,
            title: n.title,
            mediaType: n.mediaType,
            ...n.filename != null ? { filename: n.filename } : void 0,
            ...n.providerMetadata != null ? { providerMetadata: n.providerMetadata } : void 0
          };
        case "tool-call":
          return fr(n.result) || console.warn(`tool-call result is not JSON! ${JSON.stringify(n)}`), {
            type: "tool-call",
            toolCallId: n.toolCallId,
            toolName: n.toolName,
            ...JSON.stringify(n.args) === n.argsText ? { args: n.args } : { argsText: n.argsText },
            ...n.result ? { result: n.result } : void 0,
            ...n.isError ? { isError: !0 } : void 0
          };
        case "image":
          return {
            type: "image",
            image: n.image
          };
        case "file":
          return {
            type: "file",
            data: n.data,
            mimeType: n.mimeType,
            ...n.filename ? { filename: n.filename } : void 0
          };
        default:
          throw new Error(`Message part type not supported by aui/v0: ${i}`);
      }
    }),
    metadata: t.metadata,
    ...e ? { status: e } : void 0
  };
}
function yv(t) {
  const e = t.content, r = Pn({
    id: t.id,
    createdAt: t.created_at,
    ...e
  }, t.id, {
    type: "complete",
    reason: "unknown"
  });
  return {
    parentId: t.parent_id,
    message: r
  };
}
const na = (t) => {
  try {
    const e = t.split(".")[1];
    if (!e)
      throw new Error("Invalid JWT format");
    let r = e.replace(/-/g, "+").replace(/_/g, "/");
    for (; r.length % 4 !== 0; )
      r += "=";
    const n = atob(r), i = JSON.parse(n).exp;
    if (!i || typeof i != "number")
      throw new Error('JWT does not contain a valid "exp" field');
    return i * 1e3;
  } catch (e) {
    throw new Error(`Unable to determine the token expiry: ${e}`);
  }
};
var Wr, ec, bu = (ec = class {
  constructor(t) {
    C(this, "strategy", "jwt");
    C(this, "cachedToken", null);
    C(this, "tokenExpiry", null);
    Er(this, Wr, void 0);
    Ar(this, Wr, t);
  }
  async getAuthHeaders() {
    const t = Date.now();
    if (this.cachedToken && this.tokenExpiry && this.tokenExpiry - t > 30 * 1e3)
      return { Authorization: `Bearer ${this.cachedToken}` };
    const e = await Ir(this, Wr).call(this);
    return e ? (this.cachedToken = e, this.tokenExpiry = na(e), { Authorization: `Bearer ${e}` }) : !1;
  }
  readAuthHeaders(t) {
    const e = t.get("Authorization");
    if (!e)
      return;
    const [r, n] = e.split(" ");
    if (r !== "Bearer" || !n)
      throw new Error("Invalid auth header received");
    this.cachedToken = n, this.tokenExpiry = na(n);
  }
}, Wr = new WeakMap(), ec), Kr, Qr, Yr, tc, xv = (tc = class {
  constructor(t, e, r) {
    C(this, "strategy", "api-key");
    Er(this, Kr, void 0);
    Er(this, Qr, void 0);
    Er(this, Yr, void 0);
    Ar(this, Kr, t), Ar(this, Qr, e), Ar(this, Yr, r);
  }
  async getAuthHeaders() {
    return {
      Authorization: `Bearer ${Ir(this, Kr)}`,
      "Aui-User-Id": Ir(this, Qr),
      "Aui-Workspace-Id": Ir(this, Yr)
    };
  }
  readAuthHeaders() {
  }
}, Kr = new WeakMap(), Qr = new WeakMap(), Yr = new WeakMap(), tc);
const dn = "aui:refresh_token";
var kv = class {
  constructor(t) {
    C(this, "strategy", "anon");
    C(this, "baseUrl");
    C(this, "jwtStrategy");
    this.baseUrl = t, this.jwtStrategy = new bu(async () => {
      const e = Date.now(), r = localStorage.getItem(dn), n = r ? JSON.parse(r) : void 0;
      if (n)
        if (new Date(n.expires_at).getTime() - e > 30 * 1e3) {
          const a = await fetch(`${this.baseUrl}/v1/auth/tokens/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: n.token })
          });
          if (a.ok) {
            const { access_token: l, refresh_token: c } = await a.json();
            return c && localStorage.setItem(dn, JSON.stringify(c)), l;
          }
        } else
          localStorage.removeItem(dn);
      const i = await fetch(`${this.baseUrl}/v1/auth/tokens/anonymous`, { method: "POST" });
      if (!i.ok)
        return null;
      const { access_token: o, refresh_token: s } = await i.json();
      return !o || !s ? null : (localStorage.setItem(dn, JSON.stringify(s)), o);
    });
  }
  async getAuthHeaders() {
    return this.jwtStrategy.getAuthHeaders();
  }
  readAuthHeaders(t) {
    this.jwtStrategy.readAuthHeaders(t);
  }
}, ia = class extends Error {
  constructor(t) {
    super(t), this.name = "APIError";
  }
}, _v = class {
  constructor(t) {
    C(this, "_auth");
    C(this, "_baseUrl");
    if ("authToken" in t)
      this._baseUrl = t.baseUrl, this._auth = new bu(t.authToken);
    else if ("apiKey" in t)
      this._baseUrl = (t.baseUrl ?? "https://backend.assistant-api.com").replace(/\/$/, ""), this._auth = new xv(t.apiKey, t.userId, t.workspaceId);
    else if ("anonymous" in t)
      this._baseUrl = t.baseUrl, this._auth = new kv(t.baseUrl);
    else
      throw new Error("Invalid configuration: Must provide authToken, apiKey, or anonymous configuration");
  }
  async initializeAuth() {
    return !!this._auth.getAuthHeaders();
  }
  async makeRawRequest(t, e = {}) {
    const r = await this._auth.getAuthHeaders();
    if (!r)
      throw new Error("Authorization failed");
    const n = {
      ...r,
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
      headers: n,
      body: e.body ? JSON.stringify(e.body) : null
    });
    if (this._auth.readAuthHeaders(s.headers), !s.ok) {
      const a = await s.text();
      try {
        throw new ia(JSON.parse(a).message);
      } catch (l) {
        throw l instanceof ia ? l : new Error(`Request failed with status ${s.status}, ${a}`);
      }
    }
    return s;
  }
  async makeRequest(t, e = {}) {
    return (await this.makeRawRequest(t, e)).json();
  }
}, Sv = class {
  constructor(t) {
    C(this, "cloud");
    this.cloud = t;
  }
  async create() {
    return this.cloud.makeRequest("/auth/tokens", { method: "POST" });
  }
};
const Hi = {
  /**
  * Converts an {@link AssistantStream} into a `Response` using the supplied
  * encoder.
  *
  * The encoder's `headers` are copied onto the response. Pair this with the
  * decoder for the same wire format when consuming the response.
  */
  toResponse(t, e) {
    return new Response(Hi.toByteStream(t, e), { headers: e.headers ?? {} });
  },
  /**
  * Reads an assistant stream from a `Response` body using the supplied
  * decoder.
  *
  * The response body must be present and encoded with the matching assistant
  * stream wire format.
  */
  fromResponse(t, e) {
    return Hi.fromByteStream(t.body, e);
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
}, vu = () => {
  let t, e;
  const r = new Promise((n, i) => {
    t = n, e = i;
  });
  if (!t || !e)
    throw new Error("Failed to create promise");
  return {
    promise: r,
    resolve: t,
    reject: e
  };
}, Cv = () => {
  const t = [];
  let e = !1, r, n;
  const i = (o) => {
    o.promise || (o.promise = o.reader.read().then(({ done: s, value: a }) => {
      o.promise = void 0, s ? (t.splice(t.indexOf(o), 1), e && t.length === 0 && r.close()) : r.enqueue(a), n == null || n.resolve(), n = void 0;
    }).catch((s) => {
      console.error(s), t.forEach((a) => {
        a.reader.cancel();
      }), t.length = 0, r.error(s), n == null || n.reject(s), n = void 0;
    }));
  };
  return {
    readable: new ReadableStream({
      start(o) {
        r = o;
      },
      pull() {
        return n = vu(), t.forEach((o) => {
          i(o);
        }), n.promise;
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
      e = !0, t.length === 0 && r.close();
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
var oa = class {
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
const wu = (t) => new ReadableStream({
  start(e) {
    var r;
    return (r = t.start) == null ? void 0 : r.call(t, new oa(e));
  },
  pull(e) {
    var r;
    return (r = t.pull) == null ? void 0 : r.call(t, new oa(e));
  },
  cancel(e) {
    var r;
    return (r = t.cancel) == null ? void 0 : r.call(t, e);
  }
}), sa = () => {
  let t;
  return [wu({ start(e) {
    t = e;
  } }), t];
};
var aa = class {
  constructor(t) {
    C(this, "_controller");
    C(this, "_isClosed", !1);
    C(this, "_mergeTask");
    C(this, "_argsTextController");
    this._controller = t;
    const e = wu({ start: (n) => {
      this._argsTextController = n;
    } });
    let r = !1;
    this._mergeTask = e.pipeTo(new WritableStream({ write: (n) => {
      switch (n.type) {
        case "text-delta":
          r = !0, this._controller.enqueue(n);
          break;
        case "part-finish":
          r || this._controller.enqueue({
            type: "text-delta",
            textDelta: "{}",
            path: []
          }), this._controller.enqueue({
            type: "tool-call-args-text-finish",
            path: []
          });
          break;
        default:
          throw new Error(`Unexpected chunk type: ${n.type}`);
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
const Tv = (t) => new ReadableStream({
  start(e) {
    var r;
    return (r = t.start) == null ? void 0 : r.call(t, new aa(e));
  },
  pull(e) {
    var r;
    return (r = t.pull) == null ? void 0 : r.call(t, new aa(e));
  },
  cancel(e) {
    var r;
    return (r = t.cancel) == null ? void 0 : r.call(t, e);
  }
}), Iv = () => {
  let t;
  return [Tv({ start(e) {
    t = e;
  } }), t];
};
var yu = class {
  constructor() {
    C(this, "value", -1);
  }
  up() {
    return ++this.value;
  }
}, Ev = class extends TransformStream {
  constructor(t) {
    super({ transform(e, r) {
      r.enqueue({
        ...e,
        path: [t, ...e.path]
      });
    } });
  }
};
(class extends TransformStream {
  constructor(t) {
    super({ transform(e, r) {
      const { path: [n, ...i] } = e;
      if (t !== n)
        throw new Error(`Path mismatch: expected ${t}, got ${n}`);
      r.enqueue({
        ...e,
        path: i
      });
    } });
  }
});
var Av = class extends TransformStream {
  constructor(t) {
    const e = new yu(), r = /* @__PURE__ */ new Map();
    super({ transform(n, i) {
      n.type === "part-start" && n.path.length === 0 && r.set(e.up(), t.up());
      const [o, ...s] = n.path;
      if (o === void 0) {
        i.enqueue(n);
        return;
      }
      const a = r.get(o);
      if (a === void 0)
        throw new Error("Path not found");
      i.enqueue({
        ...n,
        path: [a, ...s]
      });
    } });
  }
};
let Rv = (t, e = 21) => (r = e) => {
  let n = "", i = r | 0;
  for (; i-- > 0; )
    n += t[Math.random() * t.length | 0];
  return n;
};
const Pv = Rv("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
var Mv = class xu {
  constructor(e) {
    C(this, "_state");
    C(this, "_parentId");
    this._state = e || {
      merger: Cv(),
      contentCounter: new yu()
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
  _addPart(e, r) {
    this._state.append && (this._state.append.controller.close(), this._state.append = void 0), this.enqueue({
      type: "part-start",
      part: e,
      path: []
    }), this._state.merger.addStream(r.pipeThrough(new Ev(this._state.contentCounter.value)));
  }
  merge(e) {
    this._state.merger.addStream(e.pipeThrough(new Av(this._state.contentCounter)));
  }
  appendText(e) {
    var r;
    (((r = this._state.append) == null ? void 0 : r.kind) !== "text" || this._state.append.parentId !== this._parentId) && (this._state.append = {
      kind: "text",
      parentId: this._parentId,
      controller: this.addTextPart()
    }), this._state.append.controller.append(e);
  }
  appendReasoning(e) {
    var r;
    (((r = this._state.append) == null ? void 0 : r.kind) !== "reasoning" || this._state.append.parentId !== this._parentId) && (this._state.append = {
      kind: "reasoning",
      parentId: this._parentId,
      controller: this.addReasoningPart()
    }), this._state.append.controller.append(e);
  }
  addTextPart() {
    const [e, r] = sa();
    return this._addPart(this._withParentIdOption({ type: "text" }), e), r;
  }
  addReasoningPart() {
    const [e, r] = sa();
    return this._addPart(this._withParentIdOption({ type: "reasoning" }), e), r;
  }
  addToolCallPart(e) {
    const r = typeof e == "string" ? { toolName: e } : e, n = r.toolName, i = r.toolCallId ?? Pv(), [o, s] = Iv();
    return this._addPart({
      type: "tool-call",
      toolName: n,
      toolCallId: i,
      ...this._parentId && { parentId: this._parentId }
    }, o), r.argsText !== void 0 && (s.argsText.append(r.argsText), s.argsText.close()), r.args !== void 0 && (s.argsText.append(JSON.stringify(r.args)), s.argsText.close()), r.response !== void 0 && s.setResponse(r.response), s;
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
    const r = new xu(this._state);
    return r._parentId = e, r;
  }
  close() {
    var e, r, n, i;
    (r = (e = this._state.append) == null ? void 0 : e.controller) == null || r.close(), this._state.merger.seal(), (i = (n = this._state).closeSubscriber) == null || i.call(n);
  }
};
function Dv(t) {
  const e = new Mv();
  return (async () => {
    try {
      await t(e);
    } catch (n) {
      throw e.__internal_isClosed || e.enqueue({
        type: "error",
        path: [],
        error: String(n)
      }), n;
    } finally {
      e.__internal_isClosed || e.close();
    }
  })(), e.__internal_getReadable();
}
function Nv() {
  const { resolve: t, promise: e } = vu();
  let r;
  return [Dv((n) => (r = n, r.__internal_subscribeToClose(t), e)), r];
}
var zv = class extends TransformStream {
  constructor(t, e, r) {
    const [n, i] = Nv();
    let o;
    super({
      start(s) {
        var a;
        return o = n.pipeTo(new WritableStream({
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
    }, e, r);
  }
}, Ov = class extends TransformStream {
  constructor(t) {
    super();
    const e = t(super.readable);
    Object.defineProperty(this, "readable", {
      value: e,
      writable: !1
    });
  }
}, Lv = class extends Ov {
  constructor() {
    super((t) => {
      const e = new zv({ transform(r, n) {
        n.appendText(r);
      } });
      return t.pipeThrough(new TextDecoderStream()).pipeThrough(e);
    });
  }
}, $v = class {
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
    return Hi.fromResponse(e, new Lv());
  }
  async report(t) {
    return this.cloud.makeRequest("/runs", {
      method: "POST",
      body: t
    });
  }
}, Bv = class {
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
  async update(t, e, r) {
    return this.cloud.makeRequest(`/threads/${encodeURIComponent(t)}/messages/${encodeURIComponent(e)}`, {
      method: "PUT",
      body: r
    });
  }
}, Fv = class {
  constructor(t) {
    C(this, "cloud");
    C(this, "messages");
    this.cloud = t, this.messages = new Bv(t);
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
}, Uv = class {
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
}, jv = class {
  constructor(t) {
    C(this, "threads");
    C(this, "auth");
    C(this, "runs");
    C(this, "files");
    C(this, "telemetry");
    const e = new _v(t);
    this.threads = new Fv(e), this.auth = { tokens: new Sv(e) }, this.runs = new $v(e), this.files = new Uv(e);
    const r = t.telemetry;
    this.telemetry = r === !1 ? { enabled: !1 } : r === !0 || r === void 0 ? { enabled: !0 } : {
      enabled: r.enabled !== !1,
      ...r
    };
  }
}, Vv = class {
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
  async append(t, e, r, n, i) {
    const o = r ? await this.idMapping[r] ?? r : null, s = this.cloud.threads.messages.create(t, {
      parent_id: o,
      format: n,
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
  async update(t, e, r, n) {
    const i = await this.getRemoteId(e);
    i && await this.cloud.threads.messages.update(t, i, { content: n });
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
    const { messages: r } = await this.cloud.threads.messages.list(t, e ? { format: e } : void 0);
    for (const n of r)
      this.idMapping[n.id] = n.id;
    return r;
  }
  /**
  * Reset the ID mapping (call when switching threads).
  */
  reset() {
    this.idMapping = {};
  }
};
const qv = (t, e) => ({
  append: async (r, n) => {
    const i = e.getId(n.message), o = e.encode(n);
    return t.append(r, i, n.parentId, e.format, o);
  },
  update: t.update ? async (r, n, i) => {
    const o = e.encode(n);
    return t.update(r, i, e.format, o);
  } : void 0,
  load: async (r) => ({ messages: (await t.load(r, e.format)).filter((n) => n.format === e.format).map((n) => e.decode({
    id: n.id,
    parent_id: n.parent_id,
    format: n.format,
    content: n.content
  })).reverse() }),
  isPersisted: (r) => t.isPersisted(r)
}), ui = /* @__PURE__ */ new WeakMap();
var Hv = class {
  constructor(t, e) {
    C(this, "cloudRef");
    C(this, "aui");
    this.cloudRef = t, this.aui = e;
  }
  get _persistence() {
    const t = this.aui.threadListItem();
    return ui.has(t) || ui.set(t, new Vv(this.cloudRef.current)), ui.get(t);
  }
  withFormat(t) {
    const e = this, r = qv(this._persistence, t);
    return {
      async append(n) {
        const { remoteId: i } = await e.aui.threadListItem().initialize();
        await r.append(i, n);
      },
      async update(n, i) {
        var s;
        const o = e.aui.threadListItem().getState().remoteId;
        o && await ((s = r.update) == null ? void 0 : s.call(r, o, n, i));
      },
      async delete() {
        throw new Error("Assistant Cloud does not support deleting thread messages yet.");
      },
      reportTelemetry(n, i) {
        const o = n.map((s) => t.encode(s));
        e._reportRunTelemetry(t.format, o, i);
      },
      async load() {
        const n = e.aui.threadListItem().getState().remoteId;
        return n ? r.load(n) : { messages: [] };
      }
    };
  }
  async append({ parentId: t, message: e }) {
    const { remoteId: r } = await this.aui.threadListItem().initialize(), n = wv(e);
    await this._persistence.append(r, e.id, t, "aui/v0", n), this.cloudRef.current.telemetry.enabled && this._maybeReportRun(r, "aui/v0", n);
  }
  async delete() {
    throw new Error("Assistant Cloud does not support deleting thread messages yet.");
  }
  async load() {
    const t = this.aui.threadListItem().getState().remoteId;
    return t ? { messages: (await this._persistence.load(t, "aui/v0")).filter((e) => e.format === "aui/v0").map(yv).reverse() } : { messages: [] };
  }
  _reportRunTelemetry(t, e, r) {
    if (!this.cloudRef.current.telemetry.enabled)
      return;
    const n = this.aui.threadListItem().getState().remoteId;
    if (!n)
      return;
    const i = Qv(t, e);
    i && this._sendReport(n, i, r == null ? void 0 : r.durationMs, r == null ? void 0 : r.stepTimestamps);
  }
  _maybeReportRun(t, e, r) {
    const n = _u(e, r);
    n && this._sendReport(t, n);
  }
  _sendReport(t, e, r, n) {
    const i = Kv(e.steps, n), o = {
      thread_id: t,
      status: e.status,
      ...e.totalSteps != null ? { total_steps: e.totalSteps } : void 0,
      ...e.toolCalls ? { tool_calls: e.toolCalls } : void 0,
      ...i ? { steps: i } : void 0,
      ...e.inputTokens != null ? { input_tokens: e.inputTokens } : void 0,
      ...e.outputTokens != null ? { output_tokens: e.outputTokens } : void 0,
      ...e.reasoningTokens != null ? { reasoning_tokens: e.reasoningTokens } : void 0,
      ...e.cachedInputTokens != null ? { cached_input_tokens: e.cachedInputTokens } : void 0,
      ...r != null ? { duration_ms: r } : void 0,
      ...e.outputText != null ? { output_text: e.outputText } : void 0,
      ...e.metadata ? { metadata: e.metadata } : void 0,
      ...e.modelId ? { model_id: e.modelId } : void 0
    }, { beforeReport: s } = this.cloudRef.current.telemetry, a = s ? s(o) : o;
    a && this.cloudRef.current.runs.report(a).catch(() => {
    });
  }
};
const la = 5e4;
function Yn(t) {
  return t.length <= la ? t : t.slice(0, la);
}
function Gi(t) {
  if (t != null)
    try {
      return Yn(JSON.stringify(t));
    } catch {
      return;
    }
}
const Gv = /^[A-Za-z0-9+/]{100,}={0,2}$/;
function Wv(t) {
  if (t != null) {
    try {
      const e = typeof t == "string" ? JSON.parse(t) : t;
      if (Array.isArray(e)) {
        const r = e.map((n) => {
          if (n && typeof n == "object" && n.type && (n.type === "image" || n.type === "audio") && typeof n.data == "string" && Gv.test(n.data.slice(0, 200))) {
            const i = (n.data.length * 3 / 4 / 1024).toFixed(1);
            return {
              ...n,
              data: `[${n.type}: ${i}KB]`
            };
          }
          return n;
        });
        return Yn(JSON.stringify(r));
      }
    } catch {
    }
    return Gi(t);
  }
}
function ku(t, e, r, n, i, o) {
  const s = {
    tool_name: t,
    tool_call_id: e
  }, a = i ?? Gi(r);
  a !== void 0 && (s.tool_args = a);
  const l = o === "mcp" ? Wv(n) : Gi(n);
  return l !== void 0 && (s.tool_result = l), o && (s.tool_source = o), s;
}
function Kv(t, e) {
  if (!e)
    return t;
  if (!t)
    return e.map((n) => ({ ...n }));
  const r = Math.min(t.length, e.length);
  return t.map((n, i) => ({
    ...n,
    ...i < r ? e[i] : void 0
  }));
}
function _u(t, e) {
  switch (t) {
    case "aui/v0":
      return Jv(e);
    case "ai-sdk/v6":
      return rw(e);
    default:
      return null;
  }
}
function Qv(t, e) {
  if (t === "ai-sdk/v6")
    return nw(e);
  for (let r = e.length - 1; r >= 0; r--) {
    const n = _u(t, e[r]);
    if (n)
      return n;
  }
  return null;
}
const Yv = {
  error: "error",
  incomplete: "incomplete"
};
function Jv(t) {
  var g, v, b, k, x, T, E, y, P, R, D, _;
  const e = t;
  if (e.role !== "assistant")
    return null;
  const r = (g = e.content) == null ? void 0 : g.filter((I) => I.type === "tool-call" && I.toolName && I.toolCallId).map((I) => ku(I.toolName, I.toolCallId, I.args, I.result, I.argsText)), n = (v = e.content) == null ? void 0 : v.filter((I) => I.type === "text" && I.text), i = n && n.length > 0 ? Yn(n.map((I) => I.text).join("")) : void 0, o = (b = e.metadata) == null ? void 0 : b.steps;
  let s, a, l, c;
  if (o && o.length > 0) {
    let I = 0, M = 0, N = 0, $ = 0, O = !1, j = !1, G = !1, B = !1;
    for (const W of o)
      ((k = W.usage) == null ? void 0 : k.inputTokens) != null && (I += W.usage.inputTokens, O = !0), ((x = W.usage) == null ? void 0 : x.outputTokens) != null && (M += W.usage.outputTokens, j = !0), ((T = W.usage) == null ? void 0 : T.reasoningTokens) != null && (N += W.usage.reasoningTokens, G = !0), ((E = W.usage) == null ? void 0 : E.cachedInputTokens) != null && ($ += W.usage.cachedInputTokens, B = !0);
    s = O ? I : void 0, a = j ? M : void 0, l = G ? N : void 0, c = B ? $ : void 0;
  }
  const d = (y = e.status) == null ? void 0 : y.type, u = d && Yv[d] || "completed", h = (P = e.metadata) == null ? void 0 : P.custom, p = ((R = e.metadata) == null ? void 0 : R.modelId) ?? (typeof ((_ = (D = e.metadata) == null ? void 0 : D.custom) == null ? void 0 : _.modelId) == "string" ? e.metadata.custom.modelId : void 0), m = o && o.length > 1 ? o.map((I) => {
    var M, N, $, O;
    return {
      ...((M = I.usage) == null ? void 0 : M.inputTokens) != null ? { input_tokens: I.usage.inputTokens } : void 0,
      ...((N = I.usage) == null ? void 0 : N.outputTokens) != null ? { output_tokens: I.usage.outputTokens } : void 0,
      ...(($ = I.usage) == null ? void 0 : $.reasoningTokens) != null ? { reasoning_tokens: I.usage.reasoningTokens } : void 0,
      ...((O = I.usage) == null ? void 0 : O.cachedInputTokens) != null ? { cached_input_tokens: I.usage.cachedInputTokens } : void 0
    };
  }) : void 0;
  return {
    status: u,
    ...r && r.length > 0 ? { toolCalls: r } : void 0,
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
function Xv(t) {
  return t.toolCallId ? t.type === "tool-call" || t.type === "dynamic-tool" ? !!t.toolName : t.type.startsWith("tool-") || t.type.startsWith("dynamic-tool-") : !1;
}
function Zv(t) {
  return t.type === "dynamic-tool" || t.type.startsWith("dynamic-tool-");
}
function ew(t) {
  const e = Zv(t) ? "mcp" : void 0;
  return ku(t.toolName ?? t.type.slice(5), t.toolCallId, t.args ?? t.input, t.result ?? t.output, void 0, e);
}
function Su(t) {
  const e = [], r = [], n = [];
  let i = null;
  for (const o of t)
    if (o.type === "step-start")
      i !== null && n.push({ tool_calls: i }), i = [];
    else if (o.type === "text" && o.text)
      e.push(o.text);
    else if (Xv(o)) {
      const s = ew(o);
      r.push(s), i !== null && i.push(s);
    }
  return i !== null && n.push({ tool_calls: i }), {
    textParts: e,
    toolCalls: r,
    stepsData: n
  };
}
function tw(t) {
  if (!t)
    return;
  if (typeof t.modelId == "string")
    return t.modelId;
  const e = t.custom;
  if (typeof (e == null ? void 0 : e.modelId) == "string")
    return e.modelId;
}
function Cu(t, e, r, n, i, o) {
  const s = t.length > 0, a = s ? Yn(t.join("")) : void 0, l = tw(n), c = i && i.length > 1 ? i.map((d) => ({ ...d.tool_calls.length > 0 ? { tool_calls: d.tool_calls } : void 0 })) : void 0;
  return {
    status: s ? "completed" : "incomplete",
    ...e.length > 0 ? { toolCalls: e } : void 0,
    ...r > 0 ? { totalSteps: r } : void 0,
    ...(o == null ? void 0 : o.inputTokens) != null ? { inputTokens: o.inputTokens } : void 0,
    ...(o == null ? void 0 : o.outputTokens) != null ? { outputTokens: o.outputTokens } : void 0,
    ...(o == null ? void 0 : o.reasoningTokens) != null ? { reasoningTokens: o.reasoningTokens } : void 0,
    ...(o == null ? void 0 : o.cachedInputTokens) != null ? { cachedInputTokens: o.cachedInputTokens } : void 0,
    ...a != null ? { outputText: a } : void 0,
    ...n ? { metadata: n } : void 0,
    ...c ? { steps: c } : void 0,
    ...l ? { modelId: l } : void 0
  };
}
function ca(t) {
  const e = t.inputTokens ?? t.promptTokens, r = t.outputTokens ?? t.completionTokens;
  if (!(e == null && r == null && t.reasoningTokens == null && t.cachedInputTokens == null))
    return {
      ...e != null ? { inputTokens: e } : void 0,
      ...r != null ? { outputTokens: r } : void 0,
      ...t.reasoningTokens != null ? { reasoningTokens: t.reasoningTokens } : void 0,
      ...t.cachedInputTokens != null ? { cachedInputTokens: t.cachedInputTokens } : void 0
    };
}
function Tu(t) {
  const e = t == null ? void 0 : t.usage;
  if (e) {
    const n = ca(e);
    if (n)
      return n;
  }
  const r = t == null ? void 0 : t.steps;
  if (r && r.length > 0) {
    let n = 0, i = 0, o = 0, s = 0, a = !1, l = !1, c = !1, d = !1, u = !1;
    for (const h of r) {
      if (!h.usage)
        continue;
      const p = ca(h.usage);
      p && (p.inputTokens != null && (n += p.inputTokens, a = !0), p.outputTokens != null && (i += p.outputTokens, l = !0), p.reasoningTokens != null && (o += p.reasoningTokens, c = !0), p.cachedInputTokens != null && (s += p.cachedInputTokens, d = !0), u = !0);
    }
    if (u)
      return {
        ...a ? { inputTokens: n } : void 0,
        ...l ? { outputTokens: i } : void 0,
        ...c ? { reasoningTokens: o } : void 0,
        ...d ? { cachedInputTokens: s } : void 0
      };
  }
}
function rw(t) {
  const e = t;
  if (e.role !== "assistant")
    return null;
  const { textParts: r, toolCalls: n, stepsData: i } = Su(e.parts ?? []);
  return Cu(r, n, i.length, e.metadata, i, Tu(e.metadata));
}
function nw(t) {
  const e = [], r = [], n = [];
  let i = !1, o, s = 0, a = 0, l = 0, c = 0, d = !1, u = !1, h = !1, p = !1;
  for (const m of t) {
    const g = m;
    if (g.role !== "assistant")
      continue;
    i = !0;
    const { textParts: v, toolCalls: b, stepsData: k } = Su(g.parts ?? []);
    e.push(...v), r.push(...b), n.push(...k), g.metadata && (o = g.metadata);
    const x = Tu(g.metadata);
    x && (x.inputTokens != null && (s += x.inputTokens, d = !0), x.outputTokens != null && (a += x.outputTokens, u = !0), x.reasoningTokens != null && (l += x.reasoningTokens, h = !0), x.cachedInputTokens != null && (c += x.cachedInputTokens, p = !0));
  }
  return i ? Cu(e, r, n.length, o, n, {
    ...d ? { inputTokens: s } : void 0,
    ...u ? { outputTokens: a } : void 0,
    ...h ? { reasoningTokens: l } : void 0,
    ...p ? { cachedInputTokens: c } : void 0
  }) : null;
}
function iw(t) {
  const e = A(3), r = J();
  let n;
  e[0] !== r || e[1] !== t ? (n = () => new Hv(t, r), e[0] = r, e[1] = t, e[2] = n) : n = e[2];
  const [i] = ve(n);
  return i;
}
const ow = (t) => t.startsWith("image/") ? "image" : t.startsWith("text/") ? "document" : "file";
var sw = class {
  constructor(t) {
    C(this, "cloud");
    C(this, "accept", "*");
    C(this, "uploadedUrls", /* @__PURE__ */ new Map());
    this.cloud = t;
  }
  async *add({ file: t }) {
    const e = crypto.randomUUID();
    let r = {
      id: e,
      type: ow(t.type),
      name: t.name,
      contentType: t.type,
      file: t,
      status: {
        type: "running",
        reason: "uploading",
        progress: 0
      }
    };
    yield r;
    try {
      const { signedUrl: n, publicUrl: i } = await this.cloud.files.generatePresignedUploadUrl({ filename: t.name });
      await fetch(n, {
        method: "PUT",
        body: t,
        headers: { "Content-Type": t.type },
        mode: "cors"
      }), this.uploadedUrls.set(e, i), r = {
        ...r,
        status: {
          type: "requires-action",
          reason: "composer-send"
        }
      }, yield r;
    } catch {
      r = {
        ...r,
        status: {
          type: "incomplete",
          reason: "error"
        }
      }, yield r;
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
    let r;
    return t.type === "image" ? r = [{
      type: "image",
      image: e,
      filename: t.name
    }] : r = [{
      type: "file",
      data: e,
      mimeType: t.contentType ?? "",
      filename: t.name
    }], {
      ...t,
      status: { type: "complete" },
      content: r
    };
  }
}, aw = class {
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
const ua = (t) => Ce(t) ? t : void 0;
var rc;
const da = typeof process < "u" && ((rc = process == null ? void 0 : process.env) == null ? void 0 : rc.NEXT_PUBLIC_ASSISTANT_BASE_URL), di = da ? new jv({
  baseUrl: da,
  anonymous: !0
}) : void 0, lw = (t) => {
  const e = Z(t);
  Q(() => {
    e.current = t;
  }, [t]);
  const r = kt(function({ children: o }) {
    const s = iw({ get current() {
      return e.current.cloud ?? di;
    } }), a = e.current.cloud ?? di, l = ce(() => new sw(a), [a]);
    return /* @__PURE__ */ f(du, {
      adapters: ce(() => ({
        history: s,
        attachments: l
      }), [s, l]),
      children: o
    });
  }, []), n = t.cloud ?? di;
  if (!n) {
    const i = e, o = new aw();
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
      const { threads: i } = await n.threads.list();
      return { threads: i.map((o) => ({
        status: o.is_archived ? "archived" : "regular",
        remoteId: o.id,
        title: o.title,
        lastMessageAt: o.last_message_at ? new Date(o.last_message_at) : void 0,
        externalId: o.external_id ?? void 0,
        custom: ua(o.metadata)
      })) };
    },
    initialize: async () => {
      var a;
      const i = await (((a = t.create) == null ? void 0 : a.call(t)) ?? Promise.resolve()), o = i ? i.externalId : void 0, { thread_id: s } = await n.threads.create({
        last_message_at: /* @__PURE__ */ new Date(),
        external_id: o
      });
      return {
        externalId: o,
        remoteId: s
      };
    },
    rename: async (i, o) => n.threads.update(i, { title: o }),
    updateCustom: async (i, o) => n.threads.update(i, { metadata: o ?? null }),
    archive: async (i) => n.threads.update(i, { is_archived: !0 }),
    unarchive: async (i) => n.threads.update(i, { is_archived: !1 }),
    delete: async (i) => {
      var o;
      return await ((o = t.delete) == null ? void 0 : o.call(t, i)), n.threads.delete(i);
    },
    generateTitle: async (i, o) => {
      const s = o.map((a) => ({
        ...a,
        content: a.content.filter((l) => l.type === "text" || l.type === "tool-call")
      }));
      return n.runs.stream({
        thread_id: i,
        assistant_id: "system/thread_title",
        messages: s
      });
    },
    fetch: async (i) => {
      const o = await n.threads.get(i);
      return {
        status: o.is_archived ? "archived" : "regular",
        remoteId: o.id,
        title: o.title,
        lastMessageAt: o.last_message_at ? new Date(o.last_message_at) : void 0,
        externalId: o.external_id ?? void 0,
        custom: ua(o.metadata)
      };
    },
    unstable_Provider: r
  };
}, cw = (t) => {
  const e = A(10), { id: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ue({
    source: "thread",
    query: {
      type: "id",
      id: r
    },
    get: (c) => c.thread().message({ id: r })
  }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== r ? (o = Ue({
    source: "message",
    query: {},
    get: (c) => c.thread().message({ id: r }).composer()
  }), e[2] = r, e[3] = o) : o = e[3];
  let s;
  e[4] !== i || e[5] !== o ? (s = {
    message: i,
    composer: o
  }, e[4] = i, e[5] = o, e[6] = s) : s = e[6];
  const a = J(s);
  let l;
  return e[7] !== a || e[8] !== n ? (l = /* @__PURE__ */ f(Ve, {
    value: a,
    children: n
  }), e[7] = a, e[8] = n, e[9] = l) : l = e[9], l;
}, No = (t, e) => t.Message === e.Message && t.EditComposer === e.EditComposer && t.UserEditComposer === e.UserEditComposer && t.AssistantEditComposer === e.AssistantEditComposer && t.SystemEditComposer === e.SystemEditComposer && t.UserMessage === e.UserMessage && t.AssistantMessage === e.AssistantMessage && t.SystemMessage === e.SystemMessage, uw = () => null, ha = /* @__PURE__ */ new WeakMap(), dw = (t, e) => {
  let r = ha.get(t);
  return r || (r = new Set(t.map((n) => n.id)), ha.set(t, r)), r.has(e);
}, hw = (t, e, r) => {
  switch (e) {
    case "user":
      return r ? t.UserEditComposer ?? t.EditComposer ?? t.UserMessage ?? t.Message : t.UserMessage ?? t.Message;
    case "assistant":
      return r ? t.AssistantEditComposer ?? t.EditComposer ?? t.AssistantMessage ?? t.Message : t.AssistantMessage ?? t.Message;
    case "system":
      return r ? t.SystemEditComposer ?? t.EditComposer ?? t.SystemMessage ?? t.Message : t.SystemMessage ?? t.Message ?? uw;
    default:
      throw new Error(`Unknown message role: ${e}`);
  }
}, zo = (t) => {
  const e = A(6), { components: r } = t, n = L(mw), i = L(fw);
  let o;
  e[0] !== r || e[1] !== i || e[2] !== n ? (o = hw(r, n, i), e[0] = r, e[1] = i, e[2] = n, e[3] = o) : o = e[3];
  const s = o;
  let a;
  return e[4] !== s ? (a = /* @__PURE__ */ f(s, {}), e[4] = s, e[5] = a) : a = e[5], a;
}, Iu = we((t) => {
  const e = A(5), { index: r, components: n } = t;
  let i;
  e[0] !== n ? (i = /* @__PURE__ */ f(zo, { components: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  return e[2] !== r || e[3] !== i ? (o = /* @__PURE__ */ f(nu, {
    index: r,
    children: i
  }), e[2] = r, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && No(t.components, e.components));
Iu.displayName = "ThreadPrimitive.MessageByIndex";
const Eu = we((t) => {
  const e = A(7), { messageId: r, components: n } = t;
  let i;
  if (e[0] !== r ? (i = (a) => dw(a.thread.messages, r), e[0] = r, e[1] = i) : i = e[1], !L(i))
    return null;
  let o;
  e[2] !== n ? (o = /* @__PURE__ */ f(zo, { components: n }), e[2] = n, e[3] = o) : o = e[3];
  let s;
  return e[4] !== r || e[5] !== o ? (s = /* @__PURE__ */ f(cw, {
    id: r,
    children: o
  }), e[4] = r, e[5] = o, e[6] = s) : s = e[6], s;
}, (t, e) => t.messageId === e.messageId && No(t.components, e.components));
Eu.displayName = "ThreadPrimitive.Unstable_MessageById";
const pa = ({ children: t }) => {
  const e = L((r) => r.thread.messages.length);
  return ce(() => e === 0 ? null : Array.from({ length: e }, (r, n) => /* @__PURE__ */ f(nu, {
    index: n,
    children: /* @__PURE__ */ f(wr, {
      getItemState: (i) => i.thread().message({ index: n }).getState(),
      children: (i) => t({ get message() {
        return i();
      } })
    })
  }, n)), [e, t]);
}, Au = (t) => {
  const e = A(4), { components: r, children: n } = t;
  if (r) {
    let o;
    return e[0] !== r ? (o = /* @__PURE__ */ f(pa, { children: () => /* @__PURE__ */ f(zo, { components: r }) }), e[0] = r, e[1] = o) : o = e[1], o;
  }
  let i;
  return e[2] !== n ? (i = /* @__PURE__ */ f(pa, { children: n }), e[2] = n, e[3] = i) : i = e[3], i;
};
Au.displayName = "ThreadPrimitive.Messages";
const pw = we(Au, (t, e) => t.children || e.children ? t.children === e.children : No(t.components, e.components));
function mw(t) {
  return t.message.role;
}
function fw(t) {
  return t.message.composer.isEditing;
}
const Ru = (t) => {
  var r;
  const e = t.message.metadata;
  if (!(!e || typeof e != "object"))
    return (r = e.custom) == null ? void 0 : r.quote;
};
var gw = class extends Error {
  constructor(e, r = `Component "${e}" is not in the generative-ui allowlist.`) {
    super(r);
    C(this, "componentName");
    this.name = "GenerativeUIRenderError", this.componentName = e;
  }
};
const bw = (t) => typeof t == "object" && t !== null, Pu = (t, e, r, n) => {
  if (t == null)
    return null;
  if (typeof t == "string")
    return t;
  if (!bw(t) || !("component" in t) || typeof t.component != "string")
    return typeof process < "u" && {}.NODE_ENV !== "production" && console.warn(`[generative-ui] Skipping malformed node at ${n}:`, t), null;
  const { component: i, props: o, children: s, key: a } = t, l = e[i];
  if (!l) {
    if (r)
      return /* @__PURE__ */ f(r, {
        component: i,
        props: o
      }, a ?? n);
    throw new gw(i);
  }
  const c = s != null && s.length ? s.map((d, u) => Pu(d, e, r, `${n}/${u}`)) : void 0;
  return St(l, {
    ...o ?? {},
    key: a ?? n
  }, ...c ?? []);
}, vw = (t) => {
  if (!t || t.root === void 0 || t.root === null)
    return [];
  const e = t.root;
  return Array.isArray(e) ? e : [e];
}, Oo = (t) => {
  const e = A(11), { spec: r, components: n, Fallback: i } = t;
  let o;
  e[0] !== r ? (o = vw(r), e[0] = r, e[1] = o) : o = e[1];
  const s = o;
  let a;
  if (e[2] !== i || e[3] !== n || e[4] !== s) {
    let c;
    e[6] !== i || e[7] !== n ? (c = (d, u) => Pu(d, n, i, `${u}`), e[6] = i, e[7] = n, e[8] = c) : c = e[8], a = s.map(c), e[2] = i, e[3] = n, e[4] = s, e[5] = a;
  } else
    a = e[5];
  let l;
  return e[9] !== a ? (l = /* @__PURE__ */ f(tt, { children: a }), e[9] = a, e[10] = l) : l = e[10], l;
};
Oo.displayName = "GenerativeUIRender";
const Mu = (t) => {
  const e = A(4), { components: r, spec: n, Fallback: i } = t, o = L(ww), s = n ?? o;
  if (!s)
    return null;
  let a;
  return e[0] !== i || e[1] !== r || e[2] !== s ? (a = /* @__PURE__ */ f(Oo, {
    spec: s,
    components: r,
    Fallback: i
  }), e[0] = i, e[1] = r, e[2] = s, e[3] = a) : a = e[3], a;
};
Mu.displayName = "MessagePrimitive.GenerativeUI";
function ww(t) {
  const e = t.part;
  return (e == null ? void 0 : e.type) === "generative-ui" ? e.spec : void 0;
}
const yw = "ui://", Du = (t) => !!(t != null && t.startsWith(yw)), ma = (t) => Symbol.iterator in t, fa = (t) => (
  // HACK: avoid checking entries type
  "entries" in t
), ga = (t, e) => {
  const r = t instanceof Map ? t : new Map(t.entries()), n = e instanceof Map ? e : new Map(e.entries());
  if (r.size !== n.size)
    return !1;
  for (const [i, o] of r)
    if (!n.has(i) || !Object.is(o, n.get(i)))
      return !1;
  return !0;
}, xw = (t, e) => {
  const r = t[Symbol.iterator](), n = e[Symbol.iterator]();
  let i = r.next(), o = n.next();
  for (; !i.done && !o.done; ) {
    if (!Object.is(i.value, o.value))
      return !1;
    i = r.next(), o = n.next();
  }
  return !!i.done && !!o.done;
};
function kw(t, e) {
  return Object.is(t, e) ? !0 : typeof t != "object" || t === null || typeof e != "object" || e === null || Object.getPrototypeOf(t) !== Object.getPrototypeOf(e) ? !1 : ma(t) && ma(e) ? fa(t) && fa(e) ? ga(t, e) : xw(t, e) : ga(
    { entries: () => Object.entries(t) },
    { entries: () => Object.entries(e) }
  );
}
function Mn(t) {
  const e = _e.useRef(void 0);
  return (r) => {
    const n = t(r);
    return kw(e.current, n) ? e.current : e.current = n;
  };
}
const hi = (t) => {
  let e = -1;
  return {
    startGroup: (r) => {
      e === -1 && (e = r);
    },
    endGroup: (r, n) => {
      e !== -1 && (n.push({
        type: t,
        startIndex: e,
        endIndex: r
      }), e = -1);
    },
    finalize: (r, n) => {
      e !== -1 && n.push({
        type: t,
        startIndex: e,
        endIndex: r
      });
    }
  };
}, _w = (t, e, r) => {
  const n = [];
  if (e) {
    const i = hi("chainOfThoughtGroup");
    for (let o = 0; o < t.length; o++) {
      const s = t[o];
      s === "tool-call" || s === "reasoning" ? i.startGroup(o) : (i.endGroup(o - 1, n), n.push({
        type: "single",
        index: o
      }));
    }
    i.finalize(t.length - 1, n);
  } else {
    const i = hi("toolGroup"), o = hi("reasoningGroup");
    for (let s = 0; s < t.length; s++) {
      const a = t[s];
      a === "tool-call" ? (o.endGroup(s - 1, n), i.startGroup(s)) : a === "reasoning" ? (i.endGroup(s - 1, n), o.startGroup(s)) : (i.endGroup(s - 1, n), o.endGroup(s - 1, n), n.push({
        type: "single",
        index: s
      }));
    }
    i.finalize(t.length - 1, n), o.finalize(t.length - 1, n);
  }
  if (r) {
    const i = /* @__PURE__ */ new Set();
    for (const o of n) {
      if (o.type === "single")
        continue;
      const s = r[o.startIndex];
      s !== void 0 && !i.has(s) && (i.add(s), o.idKey = `id:${s}`);
    }
  }
  return n;
}, Sw = (t) => {
  const e = A(10), r = L(Mn(Uw)), n = L(Mn(Vw));
  let i;
  e: {
    if (r.length === 0) {
      let a;
      e[0] === Symbol.for("react.memo_cache_sentinel") ? (a = [], e[0] = a) : a = e[0];
      let l;
      e[1] !== n ? (l = {
        ranges: a,
        partIds: n
      }, e[1] = n, e[2] = l) : l = e[2], i = l;
      break e;
    }
    let o;
    e[3] !== r || e[4] !== n || e[5] !== t ? (o = _w(r, t, n), e[3] = r, e[4] = n, e[5] = t, e[6] = o) : o = e[6];
    let s;
    e[7] !== n || e[8] !== o ? (s = {
      ranges: o,
      partIds: n
    }, e[7] = n, e[8] = o, e[9] = s) : s = e[9], i = s;
  }
  return i;
}, Cw = (t) => {
  const e = A(9);
  let r, n;
  e[0] !== t ? ({ Fallback: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]);
  let i;
  e[3] !== r || e[4] !== n.toolName ? (i = (a) => {
    var l, c;
    return ((c = (l = a.tools.toolUIs[n.toolName]) == null ? void 0 : l[0]) == null ? void 0 : c.render) ?? r;
  }, e[3] = r, e[4] = n.toolName, e[5] = i) : i = e[5];
  const o = L(i);
  if (!o)
    return null;
  let s;
  return e[6] !== o || e[7] !== n ? (s = /* @__PURE__ */ f(o, { ...n }), e[6] = o, e[7] = n, e[8] = s) : s = e[8], s;
}, Lo = (t, e, r) => {
  var i;
  const n = (i = t.renderers[e]) == null ? void 0 : i[0];
  return n || (t.fallbacks[0] ?? r);
}, Tw = (t) => {
  const e = A(9);
  let r, n;
  e[0] !== t ? ({ Fallback: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]);
  let i;
  e[3] !== r || e[4] !== n.name ? (i = (a) => Lo(a.dataRenderers, n.name, r), e[3] = r, e[4] = n.name, e[5] = i) : i = e[5];
  const o = L(i);
  if (!o)
    return null;
  let s;
  return e[6] !== o || e[7] !== n ? (s = /* @__PURE__ */ f(o, { ...n }), e[6] = o, e[7] = n, e[8] = s) : s = e[8], s;
}, Te = {
  Text: () => null,
  Reasoning: () => null,
  Source: () => null,
  Image: () => null,
  File: () => null,
  Unstable_Audio: () => null,
  ToolGroup: ({ children: t }) => t,
  ReasoningGroup: ({ children: t }) => t
}, Iw = (t) => {
  var R, D, _;
  const e = A(47), { components: r } = t;
  let n;
  e[0] !== r ? (n = r === void 0 ? {} : r, e[0] = r, e[1] = n) : n = e[1];
  const { Text: i, Reasoning: o, Image: s, Source: a, File: l, Unstable_Audio: c, tools: d, data: u, generativeUI: h } = n, p = i === void 0 ? Te.Text : i, m = o === void 0 ? Te.Reasoning : o, g = s === void 0 ? Te.Image : s, v = a === void 0 ? Te.Source : a, b = l === void 0 ? Te.File : l, k = c === void 0 ? Te.Unstable_Audio : c;
  let x;
  e[2] !== d ? (x = d === void 0 ? {} : d, e[2] = d, e[3] = x) : x = e[3];
  const T = x, E = J(), y = L(qw), P = y.type;
  if (P === "tool-call") {
    let I;
    e[4] !== E ? (I = E.part(), e[4] = E, e[5] = I) : I = e[5];
    const M = I.addToolResult;
    let N;
    e[6] !== E ? (N = E.part(), e[6] = E, e[7] = N) : N = e[7];
    const $ = N.resumeToolCall;
    let O;
    e[8] !== E ? (O = E.part(), e[8] = E, e[9] = O) : O = e[9];
    const j = O.respondToToolApproval;
    if ("Override" in T) {
      let W;
      return e[10] !== M || e[11] !== y || e[12] !== j || e[13] !== $ || e[14] !== T.Override ? (W = /* @__PURE__ */ f(T.Override, {
        ...y,
        addResult: M,
        resume: $,
        respondToApproval: j
      }), e[10] = M, e[11] = y, e[12] = j, e[13] = $, e[14] = T.Override, e[15] = W) : W = e[15], W;
    }
    const G = ((R = T.by_name) == null ? void 0 : R[y.toolName]) ?? T.Fallback;
    let B;
    return e[16] !== G || e[17] !== M || e[18] !== y || e[19] !== j || e[20] !== $ ? (B = /* @__PURE__ */ f(Cw, {
      ...y,
      Fallback: G,
      addResult: M,
      resume: $,
      respondToApproval: j
    }), e[16] = G, e[17] = M, e[18] = y, e[19] = j, e[20] = $, e[21] = B) : B = e[21], B;
  }
  if (((D = y.status) == null ? void 0 : D.type) === "requires-action")
    throw new Error("Encountered unexpected requires-action status");
  switch (P) {
    case "text": {
      let I;
      return e[22] !== p || e[23] !== y ? (I = /* @__PURE__ */ f(p, { ...y }), e[22] = p, e[23] = y, e[24] = I) : I = e[24], I;
    }
    case "reasoning": {
      let I;
      return e[25] !== m || e[26] !== y ? (I = /* @__PURE__ */ f(m, { ...y }), e[25] = m, e[26] = y, e[27] = I) : I = e[27], I;
    }
    case "source": {
      let I;
      return e[28] !== v || e[29] !== y ? (I = /* @__PURE__ */ f(v, { ...y }), e[28] = v, e[29] = y, e[30] = I) : I = e[30], I;
    }
    case "image": {
      let I;
      return e[31] !== g || e[32] !== y ? (I = /* @__PURE__ */ f(g, { ...y }), e[31] = g, e[32] = y, e[33] = I) : I = e[33], I;
    }
    case "file": {
      let I;
      return e[34] !== b || e[35] !== y ? (I = /* @__PURE__ */ f(b, { ...y }), e[34] = b, e[35] = y, e[36] = I) : I = e[36], I;
    }
    case "audio": {
      let I;
      return e[37] !== k || e[38] !== y ? (I = /* @__PURE__ */ f(k, { ...y }), e[37] = k, e[38] = y, e[39] = I) : I = e[39], I;
    }
    case "data": {
      const I = ((_ = u == null ? void 0 : u.by_name) == null ? void 0 : _[y.name]) ?? (u == null ? void 0 : u.Fallback);
      let M;
      return e[40] !== I || e[41] !== y ? (M = /* @__PURE__ */ f(Tw, {
        ...y,
        Fallback: I
      }), e[40] = I, e[41] = y, e[42] = M) : M = e[42], M;
    }
    case "generative-ui": {
      if (!(h != null && h.components))
        return typeof process < "u" && {}.NODE_ENV !== "production" && console.warn("MessagePrimitive.Parts received a generative-ui part but no `components.generativeUI.components` allowlist was provided. Pass an allowlist or render with <MessagePrimitive.GenerativeUI />."), null;
      const I = y;
      let M;
      return e[43] !== h.Fallback || e[44] !== h.components || e[45] !== I.spec ? (M = /* @__PURE__ */ f(Oo, {
        spec: I.spec,
        components: h.components,
        Fallback: h.Fallback
      }), e[43] = h.Fallback, e[44] = h.components, e[45] = I.spec, e[46] = M) : M = e[46], M;
    }
    default:
      return console.warn(`Unknown message part type: ${P}`), null;
  }
}, zr = we((t) => {
  const e = A(5), { index: r, components: n } = t;
  let i;
  e[0] !== n ? (i = /* @__PURE__ */ f(Iw, { components: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  return e[2] !== r || e[3] !== i ? (o = /* @__PURE__ */ f(Ao, {
    index: r,
    children: i
  }), e[2] = r, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => {
  var r, n, i, o, s, a, l, c, d, u, h, p, m, g, v, b, k, x, T, E, y, P;
  return t.index === e.index && ((r = t.components) == null ? void 0 : r.Text) === ((n = e.components) == null ? void 0 : n.Text) && ((i = t.components) == null ? void 0 : i.Reasoning) === ((o = e.components) == null ? void 0 : o.Reasoning) && ((s = t.components) == null ? void 0 : s.Source) === ((a = e.components) == null ? void 0 : a.Source) && ((l = t.components) == null ? void 0 : l.Image) === ((c = e.components) == null ? void 0 : c.Image) && ((d = t.components) == null ? void 0 : d.File) === ((u = e.components) == null ? void 0 : u.File) && ((h = t.components) == null ? void 0 : h.Unstable_Audio) === ((p = e.components) == null ? void 0 : p.Unstable_Audio) && ((m = t.components) == null ? void 0 : m.tools) === ((g = e.components) == null ? void 0 : g.tools) && ((v = t.components) == null ? void 0 : v.data) === ((b = e.components) == null ? void 0 : b.data) && ((k = t.components) == null ? void 0 : k.generativeUI) === ((x = e.components) == null ? void 0 : x.generativeUI) && ((T = t.components) == null ? void 0 : T.ToolGroup) === ((E = e.components) == null ? void 0 : E.ToolGroup) && ((y = t.components) == null ? void 0 : y.ReasoningGroup) === ((P = e.components) == null ? void 0 : P.ReasoningGroup);
});
zr.displayName = "MessagePrimitive.PartByIndex";
const Ew = (t) => {
  const e = A(6), { status: r, component: n } = t, i = r.type === "running";
  let o;
  e[0] !== n || e[1] !== r ? (o = /* @__PURE__ */ f(n, {
    type: "text",
    text: "",
    status: r
  }), e[0] = n, e[1] = r, e[2] = o) : o = e[2];
  let s;
  return e[3] !== i || e[4] !== o ? (s = /* @__PURE__ */ f(Ro, {
    text: "",
    isRunning: i,
    children: o
  }), e[3] = i, e[4] = o, e[5] = s) : s = e[5], s;
}, Aw = Object.freeze({ type: "complete" }), Rw = Object.freeze({ type: "running" }), Pw = (t) => {
  const e = A(6), { components: r } = t, n = L(Hw);
  if (r != null && r.Empty) {
    let s;
    return e[0] !== r.Empty || e[1] !== n ? (s = /* @__PURE__ */ f(r.Empty, { status: n }), e[0] = r.Empty, e[1] = n, e[2] = s) : s = e[2], s;
  }
  if (n.type !== "running")
    return null;
  const i = (r == null ? void 0 : r.Text) ?? Te.Text;
  let o;
  return e[3] !== n || e[4] !== i ? (o = /* @__PURE__ */ f(Ew, {
    status: n,
    component: i
  }), e[3] = n, e[4] = i, e[5] = o) : o = e[5], o;
}, Nu = we(Pw, (t, e) => {
  var r, n, i, o;
  return ((r = t.components) == null ? void 0 : r.Empty) === ((n = e.components) == null ? void 0 : n.Empty) && ((i = t.components) == null ? void 0 : i.Text) === ((o = e.components) == null ? void 0 : o.Text);
}), Mw = (t) => {
  const e = A(4), { components: r, enabled: n } = t;
  let i;
  if (e[0] !== n ? (i = (s) => {
    if (!n || s.message.parts.length === 0)
      return !1;
    const a = s.message.parts[s.message.parts.length - 1];
    return (a == null ? void 0 : a.type) !== "text" && (a == null ? void 0 : a.type) !== "reasoning";
  }, e[0] = n, e[1] = i) : i = e[1], !L(i))
    return null;
  let o;
  return e[2] !== r ? (o = /* @__PURE__ */ f(Nu, { components: r }), e[2] = r, e[3] = o) : o = e[3], o;
}, Dw = we(Mw, (t, e) => {
  var r, n, i, o;
  return t.enabled === e.enabled && ((r = t.components) == null ? void 0 : r.Empty) === ((n = e.components) == null ? void 0 : n.Empty) && ((i = t.components) == null ? void 0 : i.Text) === ((o = e.components) == null ? void 0 : o.Text);
}), Nw = (t) => {
  const e = A(4), { Quote: r } = t, n = L(Ru);
  if (!n)
    return null;
  let i;
  return e[0] !== r || e[1] !== n.messageId || e[2] !== n.text ? (i = /* @__PURE__ */ f(r, {
    text: n.text,
    messageId: n.messageId
  }), e[0] = r, e[1] = n.messageId, e[2] = n.text, e[3] = i) : i = e[3], i;
}, zw = we(Nw);
function zu(t, e) {
  var n, i, o, s;
  const r = ((i = (n = t.toolUIs[e.toolName]) == null ? void 0 : n[0]) == null ? void 0 : i.render) ?? null;
  return r || (Du((s = (o = e.mcp) == null ? void 0 : o.app) == null ? void 0 : s.resourceUri) && t.mcpApp ? t.mcpApp.render : null);
}
const Ou = () => {
  const t = A(12), e = J(), r = L(Gw), n = L(Ww);
  if (!n || r.type !== "tool-call")
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
  return t[6] !== n || t[7] !== r || t[8] !== i.addToolResult || t[9] !== s.resumeToolCall || t[10] !== l.respondToToolApproval ? (c = /* @__PURE__ */ f(n, {
    ...r,
    addResult: o,
    resume: a,
    respondToApproval: l.respondToToolApproval
  }), t[6] = n, t[7] = r, t[8] = i.addToolResult, t[9] = s.resumeToolCall, t[10] = l.respondToToolApproval, t[11] = c) : c = t[11], c;
}, Lu = () => {
  const t = A(3), e = L(Kw), r = L(Qw);
  if (!r || e.type !== "data")
    return null;
  const n = e;
  let i;
  return t[0] !== r || t[1] !== n ? (i = /* @__PURE__ */ f(r, { ...n }), t[0] = r, t[1] = n, t[2] = i) : i = t[2], i;
}, Ow = () => {
  const t = A(2), e = L(Yw);
  if (e === "tool-call") {
    let r;
    return t[0] === Symbol.for("react.memo_cache_sentinel") ? (r = /* @__PURE__ */ f(Ou, {}), t[0] = r) : r = t[0], r;
  }
  if (e === "data") {
    let r;
    return t[1] === Symbol.for("react.memo_cache_sentinel") ? (r = /* @__PURE__ */ f(Lu, {}), t[1] = r) : r = t[1], r;
  }
  return null;
}, Lw = Object.freeze({
  type: "text",
  text: "",
  status: Rw
}), $u = ({ index: t, children: e }) => {
  const r = J(), n = L((i) => i.dataRenderers);
  return /* @__PURE__ */ f(Ao, {
    index: t,
    children: /* @__PURE__ */ f(wr, {
      getItemState: (i) => i.message().part({ index: t }).getState(),
      children: (i) => e({ get part() {
        const o = i();
        if (o.type === "tool-call") {
          const s = zu(r.tools().getState(), o) !== null, a = r.message().part({ index: t });
          return {
            ...o,
            toolUI: s ? /* @__PURE__ */ f(Ou, {}) : null,
            addResult: a.addToolResult,
            resume: a.resumeToolCall,
            respondToApproval: a.respondToToolApproval
          };
        }
        if (o.type === "data") {
          const s = Lo(n, o.name, void 0) !== void 0;
          return {
            ...o,
            dataRendererUI: s ? /* @__PURE__ */ f(Lu, {}) : null
          };
        }
        return o;
      } })
    })
  });
}, $w = (t) => {
  const e = A(9), { children: r } = t, n = L(Jw), i = L(Xw), o = n === 0 && i;
  if (n === 0) {
    if (!o)
      return null;
    let a;
    e[0] !== r ? (a = r({ part: Lw }), e[0] = r, e[1] = a) : a = e[1];
    let l;
    return e[2] !== a ? (l = /* @__PURE__ */ f(Ro, {
      text: "",
      isRunning: !0,
      children: a
    }), e[2] = a, e[3] = l) : l = e[3], l;
  }
  let s;
  if (e[4] !== r || e[5] !== n) {
    let a;
    e[7] !== r ? (a = (l, c) => /* @__PURE__ */ f($u, {
      index: c,
      children: (d) => r(d) ?? /* @__PURE__ */ f(Ow, {})
    }, c), e[7] = r, e[8] = a) : a = e[8], s = /* @__PURE__ */ f(tt, { children: Array.from({ length: n }, a) }), e[4] = r, e[5] = n, e[6] = s;
  } else
    s = e[6];
  return s;
}, Wi = (t) => {
  const e = A(5), { components: r, unstable_showEmptyOnNonTextEnd: n, children: i } = t, o = n === void 0 ? !0 : n;
  if (i) {
    let a;
    return e[0] !== i ? (a = /* @__PURE__ */ f($w, { children: i }), e[0] = i, e[1] = a) : a = e[1], a;
  }
  let s;
  return e[2] !== r || e[3] !== o ? (s = /* @__PURE__ */ f(Bw, {
    components: r,
    unstable_showEmptyOnNonTextEnd: o
  }), e[2] = r, e[3] = o, e[4] = s) : s = e[4], s;
};
Wi.displayName = "MessagePrimitive.Parts";
const Bw = (t) => {
  const e = A(15), { components: r, unstable_showEmptyOnNonTextEnd: n } = t, i = L(Zw), { ranges: o, partIds: s } = Sw(!!(r != null && r.ChainOfThought));
  let a;
  e: {
    if (i === 0) {
      let p;
      e[0] !== r ? (p = /* @__PURE__ */ f(Nu, { components: r }), e[0] = r, e[1] = p) : p = e[1], a = p;
      break e;
    }
    let h;
    if (e[2] !== r || e[3] !== o || e[4] !== s) {
      const p = /* @__PURE__ */ new Set(), m = (g) => {
        const v = s[g];
        return v !== void 0 && !p.has(v) ? (p.add(v), `part-id:${v}`) : `part-${g}`;
      };
      h = o.map((g) => {
        if (g.type === "single")
          return /* @__PURE__ */ f(zr, {
            index: g.index,
            components: r
          }, g.index);
        if (g.type === "chainOfThoughtGroup") {
          const v = r == null ? void 0 : r.ChainOfThought;
          return v ? /* @__PURE__ */ f(zb, {
            startIndex: g.startIndex,
            endIndex: g.endIndex,
            children: /* @__PURE__ */ f(v, {})
          }, `chainOfThought-${g.idKey ?? g.startIndex}`) : null;
        } else
          return g.type === "toolGroup" ? /* @__PURE__ */ f((r == null ? void 0 : r.ToolGroup) ?? Te.ToolGroup, {
            startIndex: g.startIndex,
            endIndex: g.endIndex,
            children: Array.from({ length: g.endIndex - g.startIndex + 1 }, (v, b) => {
              const k = g.startIndex + b;
              return /* @__PURE__ */ f(zr, {
                index: k,
                components: r
              }, m(k));
            })
          }, `tool-${g.idKey ?? g.startIndex}`) : /* @__PURE__ */ f((r == null ? void 0 : r.ReasoningGroup) ?? Te.ReasoningGroup, {
            startIndex: g.startIndex,
            endIndex: g.endIndex,
            children: Array.from({ length: g.endIndex - g.startIndex + 1 }, (v, b) => {
              const k = g.startIndex + b;
              return /* @__PURE__ */ f(zr, {
                index: k,
                components: r
              }, `part-${k}`);
            })
          }, `reasoning-${g.startIndex}`);
      }), e[2] = r, e[3] = o, e[4] = s, e[5] = h;
    } else
      h = e[5];
    a = h;
  }
  const l = a;
  let c;
  e[6] !== r ? (c = (r == null ? void 0 : r.Quote) && /* @__PURE__ */ f(zw, { Quote: r.Quote }), e[6] = r, e[7] = c) : c = e[7];
  let d;
  e[8] !== r || e[9] !== n ? (d = /* @__PURE__ */ f(Dw, {
    components: r,
    enabled: n
  }), e[8] = r, e[9] = n, e[10] = d) : d = e[10];
  let u;
  return e[11] !== l || e[12] !== c || e[13] !== d ? (u = /* @__PURE__ */ H(tt, { children: [
    c,
    l,
    d
  ] }), e[11] = l, e[12] = c, e[13] = d, e[14] = u) : u = e[14], u;
};
function Fw(t) {
  return t.type;
}
function Uw(t) {
  return t.message.parts.map(Fw);
}
function jw(t) {
  return t.type === "tool-call" ? t.toolCallId : void 0;
}
function Vw(t) {
  return t.message.parts.map(jw);
}
function qw(t) {
  return t.part;
}
function Hw(t) {
  return t.message.status ?? Aw;
}
function Gw(t) {
  return t.part;
}
function Ww(t) {
  return t.part.type === "tool-call" ? zu(t.tools, t.part) : null;
}
function Kw(t) {
  return t.part;
}
function Qw(t) {
  return t.part.type === "data" ? Lo(t.dataRenderers, t.part.name, void 0) ?? null : null;
}
function Yw(t) {
  return t.part.type;
}
function Jw(t) {
  return t.message.parts.length;
}
function Xw(t) {
  var e;
  return (((e = t.message.status) == null ? void 0 : e.type) ?? "complete") === "running";
}
function Zw(t) {
  return t.message.parts.length;
}
const Bu = Symbol.for("@assistant-ui/groupBy.memoKey"), ey = (t) => {
  const e = t, r = (i, o) => {
    var s, a, l, c, d;
    if (i.type === "tool-call") {
      const u = Du((a = (s = i.mcp) == null ? void 0 : s.app) == null ? void 0 : a.resourceUri);
      if ((u || (((d = (c = (l = o == null ? void 0 : o.toolUIs) == null ? void 0 : l[i.toolName]) == null ? void 0 : c[0]) == null ? void 0 : d.standalone) ?? !1)) && e["standalone-tool-call"] !== void 0)
        return e["standalone-tool-call"];
      if (u && e["mcp-app"] !== void 0)
        return e["mcp-app"];
    }
    return e[i.type] ?? [];
  }, n = Object.keys(t).sort().map((i) => [i, t[i]]);
  return r[Bu] = `groupPartByType:${JSON.stringify(n)}`, r;
}, ba = (t) => {
  const e = t.nextChildIdx++;
  return t.nodeKey === "" ? String(e) : `${t.nodeKey}.${e}`;
}, va = (t, e) => {
  if (!(e === void 0 || t.claimed.has(e)))
    return t.claimed.add(e), `id:${e}`;
}, ty = (t, e) => {
  const r = {
    key: "",
    nodeKey: "",
    indices: [],
    children: [],
    nextChildIdx: 0,
    claimed: /* @__PURE__ */ new Set()
  }, n = [r], i = () => {
    const o = n.pop(), s = n[n.length - 1];
    s.children.push({
      type: "group",
      key: o.key,
      nodeKey: o.nodeKey,
      idKey: va(s, e == null ? void 0 : e[o.indices[0]]),
      indices: o.indices,
      children: o.children
    });
  };
  for (let o = 0; o < t.length; o++) {
    const s = t[o];
    let a = 0;
    for (; a < n.length - 1 && a < s.length && n[a + 1].key === s[a]; )
      a++;
    for (; n.length - 1 > a; )
      i();
    for (; n.length - 1 < s.length; ) {
      const c = n[n.length - 1];
      n.push({
        key: s[n.length - 1],
        nodeKey: ba(c),
        indices: [],
        children: [],
        nextChildIdx: 0,
        claimed: /* @__PURE__ */ new Set()
      });
    }
    const l = n[n.length - 1];
    l.children.push({
      type: "part",
      index: o,
      nodeKey: ba(l),
      idKey: va(l, e == null ? void 0 : e[o])
    });
    for (let c = 1; c < n.length; c++)
      n[c].indices.push(o);
  }
  for (; n.length > 1; )
    i();
  return r.children;
}, ry = Object.freeze({ type: "complete" }), ny = (t, e, r) => {
  if (!r)
    return !1;
  switch (t) {
    case "never":
      return !1;
    case "always":
      return !0;
    case "empty":
      return e.length === 0;
    case "no-text": {
      const n = e[e.length - 1];
      return n === void 0 || n.type !== "text" && n.type !== "reasoning";
    }
  }
}, Fu = () => {
  throw new Error("MessagePrimitive.GroupedParts: rendered `children` under a leaf part. `children` is only meaningful for `group-…` cases — add a matching case for the part type or return `null` to skip it.");
}, Uu = (t, e, r) => {
  var i;
  if (t.type === "part")
    return /* @__PURE__ */ f($u, {
      index: t.index,
      children: ({ part: o }) => r({
        part: o,
        children: /* @__PURE__ */ f(Fu, {})
      })
    }, t.idKey ? `part-${t.idKey}` : `part-${t.index}`);
  const n = ((i = e[t.indices.at(-1)]) == null ? void 0 : i.status) ?? ry;
  return /* @__PURE__ */ f(Bt, { children: r({
    part: {
      type: t.key,
      status: n,
      indices: t.indices
    },
    children: /* @__PURE__ */ f(tt, { children: t.children.map((o) => Uu(o, e, r)) })
  }) }, t.idKey ?? t.nodeKey);
}, ju = ({ groupBy: t, indicator: e = "no-text", children: r }) => {
  const n = L(Mn((s) => s.message.parts)), i = L((s) => s.tools.toolUIs), o = L((s) => {
    var a;
    return e === "never" ? !1 : ((a = s.message.status) == null ? void 0 : a.type) === "running";
  });
  return /* @__PURE__ */ H(tt, { children: [ce(() => {
    const s = { toolUIs: i };
    return ty(n.map((a) => t(a, s) ?? []), n.map((a) => a.type === "tool-call" ? a.toolCallId : void 0));
  }, [
    n,
    t[Bu] ?? t,
    i
  ]).map((s) => Uu(s, n, r)), ny(e, n, o) && r({
    part: { type: "indicator" },
    children: /* @__PURE__ */ f(Fu, {})
  })] });
};
ju.displayName = "MessagePrimitive.GroupedParts";
const iy = (t) => {
  const e = A(5), { children: r } = t, n = L(Ru);
  if (!n)
    return null;
  let i;
  e[0] !== r || e[1] !== n ? (i = r(n), e[0] = r, e[1] = n, e[2] = i) : i = e[2];
  let o;
  return e[3] !== i ? (o = /* @__PURE__ */ f(tt, { children: i }), e[3] = i, e[4] = o) : o = e[4], o;
}, Vu = we(iy);
Vu.displayName = "MessagePrimitive.Quote";
const qu = (t, e) => {
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
}, oy = (t) => {
  const e = A(5), { components: r } = t, n = L(sy);
  if (!n)
    return null;
  const i = n;
  let o;
  e[0] !== r || e[1] !== i ? (o = qu(r, i), e[0] = r, e[1] = i, e[2] = o) : o = e[2];
  const s = o;
  if (!s)
    return null;
  let a;
  return e[3] !== s ? (a = /* @__PURE__ */ f(s, {}), e[3] = s, e[4] = a) : a = e[4], a;
}, Hu = we((t) => {
  const e = A(5), { index: r, components: n } = t;
  let i;
  e[0] !== n ? (i = /* @__PURE__ */ f(oy, { components: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  return e[2] !== r || e[3] !== i ? (o = /* @__PURE__ */ f(tu, {
    index: r,
    children: i
  }), e[2] = r, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => {
  var r, n, i, o, s, a, l, c;
  return t.index === e.index && ((r = t.components) == null ? void 0 : r.Image) === ((n = e.components) == null ? void 0 : n.Image) && ((i = t.components) == null ? void 0 : i.Document) === ((o = e.components) == null ? void 0 : o.Document) && ((s = t.components) == null ? void 0 : s.File) === ((a = e.components) == null ? void 0 : a.File) && ((l = t.components) == null ? void 0 : l.Attachment) === ((c = e.components) == null ? void 0 : c.Attachment);
});
Hu.displayName = "MessagePrimitive.AttachmentByIndex";
const wa = ({ children: t }) => {
  const e = L((r) => r.message.role !== "user" ? 0 : (r.message.attachments ?? []).length);
  return ce(() => Array.from({ length: e }, (r, n) => /* @__PURE__ */ f(tu, {
    index: n,
    children: /* @__PURE__ */ f(wr, {
      getItemState: (i) => i.message().attachment({ index: n }).getState(),
      children: (i) => t({ get attachment() {
        return i();
      } })
    })
  }, n)), [e, t]);
}, Gu = (t) => {
  const e = A(4), { components: r, children: n } = t;
  if (r) {
    let o;
    return e[0] !== r ? (o = /* @__PURE__ */ f(wa, { children: (s) => {
      const { attachment: a } = s, l = qu(r, a);
      return l ? /* @__PURE__ */ f(l, {}) : null;
    } }), e[0] = r, e[1] = o) : o = e[1], o;
  }
  let i;
  return e[2] !== n ? (i = /* @__PURE__ */ f(wa, { children: n }), e[2] = n, e[3] = i) : i = e[3], i;
};
Gu.displayName = "MessagePrimitive.Attachments";
function sy(t) {
  return t.attachment;
}
const Wu = (t, e) => {
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
}, ay = (t) => {
  const e = A(5), { components: r } = t, n = L(ly);
  if (!n)
    return null;
  let i;
  e[0] !== n || e[1] !== r ? (i = Wu(r, n), e[0] = n, e[1] = r, e[2] = i) : i = e[2];
  const o = i;
  if (!o)
    return null;
  let s;
  return e[3] !== o ? (s = /* @__PURE__ */ f(o, {}), e[3] = o, e[4] = s) : s = e[4], s;
}, Ku = we((t) => {
  const e = A(5), { index: r, components: n } = t;
  let i;
  e[0] !== n ? (i = /* @__PURE__ */ f(ay, { components: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  return e[2] !== r || e[3] !== i ? (o = /* @__PURE__ */ f(ru, {
    index: r,
    children: i
  }), e[2] = r, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => {
  var r, n, i, o, s, a, l, c;
  return t.index === e.index && ((r = t.components) == null ? void 0 : r.Image) === ((n = e.components) == null ? void 0 : n.Image) && ((i = t.components) == null ? void 0 : i.Document) === ((o = e.components) == null ? void 0 : o.Document) && ((s = t.components) == null ? void 0 : s.File) === ((a = e.components) == null ? void 0 : a.File) && ((l = t.components) == null ? void 0 : l.Attachment) === ((c = e.components) == null ? void 0 : c.Attachment);
});
Ku.displayName = "ComposerPrimitive.AttachmentByIndex";
const ya = ({ children: t }) => {
  const e = L((r) => r.composer.attachments.length);
  return ce(() => Array.from({ length: e }, (r, n) => /* @__PURE__ */ f(ru, {
    index: n,
    children: /* @__PURE__ */ f(wr, {
      getItemState: (i) => i.composer().attachment({ index: n }).getState(),
      children: (i) => t({ get attachment() {
        return i();
      } })
    })
  }, n)), [e, t]);
}, Qu = (t) => {
  const e = A(4), { components: r, children: n } = t;
  if (r) {
    let o;
    return e[0] !== r ? (o = /* @__PURE__ */ f(ya, { children: (s) => {
      const { attachment: a } = s, l = Wu(r, a);
      return l ? /* @__PURE__ */ f(l, {}) : null;
    } }), e[0] = r, e[1] = o) : o = e[1], o;
  }
  let i;
  return e[2] !== n ? (i = /* @__PURE__ */ f(ya, { children: n }), e[2] = n, e[3] = i) : i = e[3], i;
};
Qu.displayName = "ComposerPrimitive.Attachments";
function ly(t) {
  return t.attachment;
}
const cy = ({ children: t }) => {
  const e = L((r) => r.composer.queue.length);
  return ce(() => Array.from({ length: e }, (r, n) => /* @__PURE__ */ f(Lb, {
    index: n,
    children: /* @__PURE__ */ f(wr, {
      getItemState: (i) => i.composer().queueItem({ index: n }).getState(),
      children: (i) => t({ get queueItem() {
        return i();
      } })
    })
  }, n)), [e, t]);
}, Yu = we(cy);
Yu.displayName = "ComposerPrimitive.Queue";
const $o = (t) => {
  const { children: e } = t;
  return L(uy) ? e : null;
};
$o.displayName = "MessagePartPrimitive.InProgress";
function uy(t) {
  return t.part.status.type === "running";
}
const Ju = (t) => {
  const e = A(2), { components: r } = t, n = r.Suggestion;
  let i;
  return e[0] !== n ? (i = /* @__PURE__ */ f(n, {}), e[0] = n, e[1] = i) : i = e[1], i;
}, Xu = we((t) => {
  const e = A(5), { index: r, components: n } = t;
  let i;
  e[0] !== n ? (i = /* @__PURE__ */ f(Ju, { components: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  return e[2] !== r || e[3] !== i ? (o = /* @__PURE__ */ f(iu, {
    index: r,
    children: i
  }), e[2] = r, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components.Suggestion === e.components.Suggestion);
Xu.displayName = "ThreadPrimitive.SuggestionByIndex";
const xa = ({ children: t }) => {
  const e = L((r) => r.suggestions.suggestions.length);
  return ce(() => e === 0 ? null : Array.from({ length: e }, (r, n) => /* @__PURE__ */ f(iu, {
    index: n,
    children: /* @__PURE__ */ f(wr, {
      getItemState: (i) => i.suggestions().suggestion({ index: n }).getState(),
      children: (i) => t({ get suggestion() {
        return i();
      } })
    })
  }, n)), [e, t]);
}, Zu = (t) => {
  const e = A(4), { components: r, children: n } = t;
  if (r) {
    let o;
    return e[0] !== r ? (o = /* @__PURE__ */ f(xa, { children: () => /* @__PURE__ */ f(Ju, { components: r }) }), e[0] = r, e[1] = o) : o = e[1], o;
  }
  let i;
  return e[2] !== n ? (i = /* @__PURE__ */ f(xa, { children: n }), e[2] = n, e[3] = i) : i = e[3], i;
};
Zu.displayName = "ThreadPrimitive.Suggestions";
const dy = we(Zu, (t, e) => t.children || e.children ? t.children === e.children : t.components.Suggestion === e.components.Suggestion), hy = (t) => {
  const e = A(3);
  let r;
  return e[0] !== t.dictation || e[1] !== t.editing ? (r = (n) => {
    if (t.editing === !0 && !n.composer.isEditing || t.editing === !1 && n.composer.isEditing)
      return !1;
    const i = n.composer.dictation != null;
    return !(t.dictation === !0 && !i || t.dictation === !1 && i);
  }, e[0] = t.dictation, e[1] = t.editing, e[2] = r) : r = e[2], L(r);
}, ed = (t) => {
  const e = A(3);
  let r, n;
  return e[0] !== t ? ({ children: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]), hy(n) ? r : null;
};
ed.displayName = "ComposerPrimitive.If";
const py = () => {
  const t = A(5), e = J(), r = L(my);
  let n;
  t[0] !== e ? (n = (s) => {
    e.composer().send(s);
  }, t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  let o;
  return t[2] !== r || t[3] !== i ? (o = {
    send: i,
    disabled: r
  }, t[2] = r, t[3] = i, t[4] = o) : o = t[4], o;
};
function my(t) {
  return !t.composer.canSend || t.thread.isRunning && !t.thread.capabilities.queue;
}
const fy = () => {
  const t = A(5), e = J(), r = L(gy);
  let n;
  t[0] !== e ? (n = () => {
    e.composer().cancel();
  }, t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  let o;
  return t[2] !== i || t[3] !== r ? (o = {
    cancel: i,
    disabled: r
  }, t[2] = i, t[3] = r, t[4] = o) : o = t[4], o;
};
function gy(t) {
  return !t.composer.canCancel;
}
const by = () => {
  const t = A(5), e = J(), r = L(vy);
  let n;
  t[0] !== e ? (n = () => {
    e.composer().startDictation();
  }, t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  let o;
  return t[2] !== r || t[3] !== i ? (o = {
    startDictation: i,
    disabled: r
  }, t[2] = r, t[3] = i, t[4] = o) : o = t[4], o;
};
function vy(t) {
  return t.composer.dictation != null || !t.thread.capabilities.dictation || !t.composer.isEditing;
}
const wy = () => {
  const t = A(5), e = J(), r = L(yy);
  let n;
  t[0] !== e ? (n = (s) => e.composer().addAttachment(s), t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  let o;
  return t[2] !== i || t[3] !== r ? (o = {
    addAttachment: i,
    disabled: r
  }, t[2] = i, t[3] = r, t[4] = o) : o = t[4], o;
};
function yy(t) {
  return !t.composer.isEditing;
}
const xy = (t) => {
  const e = A(12);
  let r;
  e[0] !== t ? (r = t === void 0 ? {} : t, e[0] = t, e[1] = r) : r = e[1];
  const { copiedDuration: n, copyToClipboard: i } = r, o = n === void 0 ? 3e3 : n, s = J(), a = L(_y), l = L(Sy), c = L(Cy), d = L(Ty);
  let u;
  e[2] !== s || e[3] !== d || e[4] !== o || e[5] !== i || e[6] !== c ? (u = () => {
    const m = c ? d : s.message().getCopyText();
    if (!m)
      return;
    const g = i ?? Iy;
    Promise.resolve(g(m)).then(() => {
      s.message().setIsCopied(!0), setTimeout(() => s.message().setIsCopied(!1), o);
    }, Ey);
  }, e[2] = s, e[3] = d, e[4] = o, e[5] = i, e[6] = c, e[7] = u) : u = e[7];
  const h = u;
  let p;
  return e[8] !== h || e[9] !== a || e[10] !== l ? (p = {
    copy: h,
    disabled: a,
    isCopied: l
  }, e[8] = h, e[9] = a, e[10] = l, e[11] = p) : p = e[11], p;
};
function ky(t) {
  return t.type === "text" && t.text.length > 0;
}
function _y(t) {
  var e;
  return !((t.message.role !== "assistant" || ((e = t.message.status) == null ? void 0 : e.type) !== "running") && t.message.parts.some(ky));
}
function Sy(t) {
  return t.message.isCopied;
}
function Cy(t) {
  return t.composer.isEditing;
}
function Ty(t) {
  return t.composer.text;
}
function Iy() {
}
function Ey() {
}
const Ay = () => {
  const t = A(5), e = J(), r = L(Ry);
  let n;
  t[0] !== e ? (n = () => {
    e.composer().beginEdit();
  }, t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  let o;
  return t[2] !== r || t[3] !== i ? (o = {
    edit: i,
    disabled: r
  }, t[2] = r, t[3] = i, t[4] = o) : o = t[4], o;
};
function Ry(t) {
  return t.composer.isEditing;
}
const Py = () => {
  const t = A(5), e = J(), r = L(My);
  let n;
  t[0] !== e ? (n = () => {
    e.message().reload();
  }, t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  let o;
  return t[2] !== r || t[3] !== i ? (o = {
    reload: i,
    disabled: r
  }, t[2] = r, t[3] = i, t[4] = o) : o = t[4], o;
};
function My(t) {
  return t.thread.isRunning || t.thread.isDisabled || t.message.role !== "assistant";
}
const Dy = () => {
  const t = A(5), e = J(), r = L(zy);
  let n;
  t[0] !== e ? (n = () => {
    e.message().submitFeedback({ type: "positive" });
  }, t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  let o;
  return t[2] !== r || t[3] !== i ? (o = {
    submit: i,
    isSubmitted: r
  }, t[2] = r, t[3] = i, t[4] = o) : o = t[4], o;
}, Ny = () => {
  const t = A(5), e = J(), r = L(Oy);
  let n;
  t[0] !== e ? (n = () => {
    e.message().submitFeedback({ type: "negative" });
  }, t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  let o;
  return t[2] !== r || t[3] !== i ? (o = {
    submit: i,
    isSubmitted: r
  }, t[2] = r, t[3] = i, t[4] = o) : o = t[4], o;
};
function zy(t) {
  var e;
  return ((e = t.message.metadata.submittedFeedback) == null ? void 0 : e.type) === "positive";
}
function Oy(t) {
  var e;
  return ((e = t.message.metadata.submittedFeedback) == null ? void 0 : e.type) === "negative";
}
const Ly = () => {
  const t = A(5), e = J(), r = L(By);
  let n;
  t[0] !== e ? (n = async () => {
    e.message().speak();
  }, t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  let o;
  return t[2] !== r || t[3] !== i ? (o = {
    speak: i,
    disabled: r
  }, t[2] = r, t[3] = i, t[4] = o) : o = t[4], o;
};
function $y(t) {
  return t.type === "text" && t.text.length > 0;
}
function By(t) {
  var e;
  return !((t.message.role !== "assistant" || ((e = t.message.status) == null ? void 0 : e.type) !== "running") && t.message.parts.some($y));
}
const Fy = () => {
  const t = A(5), e = J(), r = L(Uy);
  let n;
  t[0] !== e ? (n = () => {
    e.message().stopSpeaking();
  }, t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  let o;
  return t[2] !== r || t[3] !== i ? (o = {
    stopSpeaking: i,
    disabled: r
  }, t[2] = r, t[3] = i, t[4] = o) : o = t[4], o;
};
function Uy(t) {
  return t.message.speech == null;
}
const jy = (t) => {
  const e = A(8), { prompt: r, send: n, clearComposer: i } = t, o = i === void 0 ? !0 : i, s = J(), a = L(Vy), l = n ?? !1;
  let c;
  e[0] !== s || e[1] !== o || e[2] !== r || e[3] !== l ? (c = () => {
    const h = s.thread().getState().isRunning;
    if (l && !h)
      s.thread().append({
        content: [{
          type: "text",
          text: r
        }],
        runConfig: s.composer().getState().runConfig
      }), o && s.composer().setText("");
    else if (o)
      s.composer().setText(r);
    else {
      const p = s.composer().getState().text;
      s.composer().setText(p.trim() ? `${p} ${r}` : r);
    }
  }, e[0] = s, e[1] = o, e[2] = r, e[3] = l, e[4] = c) : c = e[4];
  const d = c;
  let u;
  return e[5] !== a || e[6] !== d ? (u = {
    trigger: d,
    disabled: a
  }, e[5] = a, e[6] = d, e[7] = u) : u = e[7], u;
};
function Vy(t) {
  return t.thread.isDisabled;
}
const td = () => L(qy);
function qy(t) {
  var e;
  return ((e = t.message.status) == null ? void 0 : e.type) === "incomplete" && t.message.status.reason === "error" ? t.message.status.error ?? "An error occurred" : void 0;
}
const Hy = (t) => {
  let e = qr;
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let i = !1, o = 0;
  const s = () => {
    for (const m of n)
      m();
  }, a = (m) => {
    e = m, p.items = m, s();
  }, l = () => {
    if (i || e.length === 0)
      return;
    const m = e[0], g = r.get(m.id);
    r.delete(m.id), a(e.slice(1)), g && (i = !0, t.run(g, { steer: !1 }));
  }, c = (m, { steer: g }) => {
    const v = ct(), b = Vr(m);
    r.set(v, m), a([...e, {
      id: v,
      prompt: b
    }]), g ? d(v) : l();
  }, d = (m) => {
    if (!r.has(m))
      return;
    if (t.cancel && i) {
      const v = r.get(m);
      r.delete(m), a(e.filter((b) => b.id !== m)), o++, t.cancel(), i = !0, t.run(v, { steer: !0 });
      return;
    }
    const g = e.find((v) => v.id === m);
    g && (a([g, ...e.filter((v) => v.id !== m)]), l());
  }, p = {
    items: e,
    enqueue: c,
    steer: d,
    remove: (m) => {
      r.delete(m) && a(e.filter((g) => g.id !== m));
    },
    clear: () => {
      e.length !== 0 && (r.clear(), a(qr));
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
    subscribe: (m) => (n.add(m), () => {
      n.delete(m);
    })
  };
}, pi = (t, e) => {
  var r;
  return ((r = t.status) == null ? void 0 : r.type) !== "requires-action" || t.status.reason !== "tool-calls" || t.content.some((n) => n.type === "tool-call" && n.result === void 0 && n.approval !== void 0 && n.approval.approved === void 0 && n.approval.resolution === void 0) ? !1 : e === void 0 ? t.content.every((n) => n.type !== "tool-call" || !!n.result || n.approval !== void 0) : t.content.every((n) => n.type !== "tool-call" || !!n.result || n.approval !== void 0 || !e.includes(n.toolName));
};
var mi = class extends Error {
  constructor(e, r) {
    super(r);
    C(this, "name", "AbortError");
    C(this, "detach");
    this.detach = e;
  }
}, Gy = class extends uv {
  constructor(e, r) {
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
    this.__internal_setOptions(r);
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
    var d, u, h, p, m, g, v;
    if (this._options === e)
      return;
    this._options = e;
    let r = !1;
    const n = ((d = e.adapters) == null ? void 0 : d.speech) !== void 0;
    this.capabilities.speech !== n && (this.capabilities.speech = n, r = !0);
    const i = ((u = e.adapters) == null ? void 0 : u.dictation) !== void 0;
    this.capabilities.dictation !== i && (this.capabilities.dictation = i, r = !0);
    const o = ((h = e.adapters) == null ? void 0 : h.voice) !== void 0;
    this.capabilities.voice !== o && (this.capabilities.voice = o, r = !0);
    const s = ((p = e.adapters) == null ? void 0 : p.attachments) !== void 0;
    this.capabilities.attachments !== s && (this.capabilities.attachments = s, r = !0);
    const a = ((m = e.adapters) == null ? void 0 : m.feedback) !== void 0;
    this.capabilities.feedback !== a && (this.capabilities.feedback = a, r = !0);
    const l = ((v = (g = e.adapters) == null ? void 0 : g.history) == null ? void 0 : v.delete) !== void 0;
    this.capabilities.delete !== l && (this.capabilities.delete = l, r = !0);
    const c = e.unstable_enableMessageQueue === !0;
    c && !this._queue ? (this._queue = Hy({ run: (b) => {
      this._queueRunInFlight = !0, this._runAppend(b).finally(() => {
        var k;
        this._queueRunInFlight = !1, (k = this._queue) == null || k.notifyIdle();
      }).catch(() => {
      });
    } }), this._queue.subscribe(() => this._notifySubscribers())) : !c && this._queue && (this._queue.adapter.clear("cancel-run"), this._queue = null), this.capabilities.queue !== c && (this.capabilities.queue = c, r = !0), r && this._notifySubscribers();
  }
  __internal_load() {
    var r;
    if (this._loadPromise)
      return this._loadPromise;
    const e = ((r = this.adapters.history) == null ? void 0 : r.load()) ?? Promise.resolve(null);
    return this._isLoading = !0, this._notifySubscribers(), this._loadPromise = e.then((n) => {
      var o, s;
      if (!n)
        return;
      this.repository.import(n), n.messages.length > 0 && this.ensureInitialized(), this._notifySubscribers();
      const i = (s = (o = this.adapters.history) == null ? void 0 : o.resume) == null ? void 0 : s.bind(this.adapters.history);
      n.unstable_resume && i && this.startRun({
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
    const r = e.parentId === (((i = this.messages.at(-1)) == null ? void 0 : i.id) ?? null), n = e.startRun ?? e.role === "user";
    if (this._queue && n && r) {
      this._queue.adapter.enqueue(e, { steer: e.steer ?? !1 });
      return;
    }
    return this._queue && !r && this._queue.adapter.clear("edit"), this._runAppend(e);
  }
  getQueueItems() {
    var e;
    return ((e = this._queue) == null ? void 0 : e.adapter.items) ?? qr;
  }
  steerQueueItem(e) {
    var r;
    (r = this._queue) == null || r.adapter.steer(e);
  }
  removeQueueItem(e) {
    var r;
    (r = this._queue) == null || r.adapter.remove(e);
  }
  async _runAppend(e) {
    var i, o;
    this.ensureInitialized();
    const r = (i = this._getInitializePromise) == null ? void 0 : i.call(this);
    r && await r;
    const n = Pn(e, ct(), {
      type: "complete",
      reason: "unknown"
    });
    this.repository.addOrUpdateMessage(e.parentId, n), (o = this._options.adapters.history) == null || o.append({
      parentId: e.parentId,
      message: n,
      ...e.runConfig !== void 0 && { runConfig: e.runConfig }
    }), e.startRun ?? e.role === "user" ? await this.startRun({
      parentId: n.id,
      sourceId: e.sourceId,
      runConfig: e.runConfig ?? {}
    }) : (this.repository.resetHead(n.id), this._notifySubscribers());
  }
  async deleteMessage(e) {
    var a;
    const r = this._options.adapters.history;
    if (!(r != null && r.delete))
      throw new Error("Runtime does not support deleting messages.");
    const n = this.repository.getMessages(), i = n.findIndex((l) => l.id === e);
    if (i === -1)
      throw new Error("Message not found.");
    const o = n[i], s = [{
      parentId: ((a = n[i - 1]) == null ? void 0 : a.id) ?? null,
      message: o
    }];
    await r.delete(s), this.repository.deleteMessage(e), this._notifySubscribers();
  }
  resumeRun({ stream: e, ...r }) {
    if (!e)
      throw new Error("You must pass a stream parameter to resume runs.");
    return this.startRun(r, e);
  }
  exportExternalState() {
    throw new Error("Runtime does not support exporting external states.");
  }
  importExternalState() {
    throw new Error("Runtime does not support importing external states.");
  }
  async startRun({ parentId: e, runConfig: r }, n) {
    this.ensureInitialized();
    const i = {
      id: ct(),
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
    return this._runLoop(e, i, r, n);
  }
  async _runLoop(e, r, n, i) {
    var s, a, l, c;
    this._notifyEventSubscribers("runStart", {});
    try {
      (s = this._queue) == null || s.notifyBusy(), this._suggestions = [], (a = this._suggestionsController) == null || a.abort(), this._suggestionsController = null, this._notifySubscribers();
      do
        r = await this.performRoundtrip(e, r, n, i), i = void 0;
      while (pi(r, this._options.unstable_humanToolNames));
    } finally {
      this._notifyEventSubscribers("runEnd", {}), this._queueRunInFlight || queueMicrotask(() => {
        var d;
        return (d = this._queue) == null ? void 0 : d.notifyIdle();
      });
    }
    this._suggestionsController = new AbortController();
    const o = this._suggestionsController.signal;
    if (this.adapters.suggestion && ((l = r.status) == null ? void 0 : l.type) !== "requires-action") {
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
  async performRoundtrip(e, r, n, i) {
    var p, m, g, v, b, k, x, T, E;
    const o = e ? this.repository.getMessages(e) : [];
    (p = this.abortController) == null || p.abort(), this.abortController = new AbortController();
    const s = r.content, a = (m = r.metadata) == null ? void 0 : m.unstable_annotations, l = (g = r.metadata) == null ? void 0 : g.unstable_data, c = (v = r.metadata) == null ? void 0 : v.steps, d = (b = r.metadata) == null ? void 0 : b.custom, u = (y) => {
      var N, $, O, j, G;
      const P = (N = y.metadata) == null ? void 0 : N.steps, R = P ? [...c ?? [], ...P] : void 0, D = ($ = y.metadata) == null ? void 0 : $.unstable_annotations, _ = (O = y.metadata) == null ? void 0 : O.unstable_data, I = D ? [...a ?? [], ...D] : void 0, M = _ ? [...l ?? [], ..._] : void 0;
      r = {
        ...r,
        ...y.content ? { content: [...s, ...y.content ?? []] } : void 0,
        status: y.status ?? r.status,
        ...y.metadata ? { metadata: {
          ...r.metadata,
          ...y.metadata.unstable_state ? { unstable_state: y.metadata.unstable_state } : void 0,
          ...I ? { unstable_annotations: I } : void 0,
          ...M ? { unstable_data: M } : void 0,
          ...R ? { steps: R } : void 0,
          ...(j = y.metadata) != null && j.timing ? { timing: y.metadata.timing } : void 0,
          ...(G = y.metadata) != null && G.custom ? { custom: {
            ...d ?? {},
            ...y.metadata.custom
          } } : void 0
        } } : void 0
      }, this.repository.addOrUpdateMessage(e, r), this._notifySubscribers();
    }, h = this._options.maxSteps ?? 2;
    if ((((x = (k = r.metadata) == null ? void 0 : k.steps) == null ? void 0 : x.length) ?? 0) >= h)
      return u({ status: {
        type: "incomplete",
        reason: "tool-calls"
      } }), r;
    u({ status: { type: "running" } }), this.repository.resetHead(r.id), this._notifySubscribers();
    try {
      this._lastRunConfig = n ?? {};
      const { unstable_composerMetadata: y, ...P } = this.getModelContext();
      i = i ?? this.adapters.chatModel.run.bind(this.adapters.chatModel);
      const R = this.abortController.signal, D = (T = this._getThreadId) == null ? void 0 : T.call(this), _ = i({
        messages: o,
        runConfig: this._lastRunConfig,
        abortSignal: R,
        context: P,
        unstable_assistantMessageId: r.id,
        unstable_threadId: D,
        unstable_parentId: e,
        unstable_getMessage() {
          return r;
        }
      });
      if (Symbol.asyncIterator in _)
        for await (const I of _) {
          if (R.aborted) {
            u({ status: {
              type: "incomplete",
              reason: "cancelled"
            } });
            break;
          }
          u(I);
        }
      else
        u(await _);
      r.status.type === "running" && u({ status: {
        type: "complete",
        reason: "unknown"
      } });
    } catch (y) {
      if (y instanceof mi)
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
      this.abortController = null, (r.status.type === "complete" || r.status.type === "incomplete") && await ((E = this._options.adapters.history) == null ? void 0 : E.append({
        parentId: e,
        message: r,
        runConfig: this._lastRunConfig
      }));
    }
    return r;
  }
  detach() {
    var r, n;
    (r = this._queue) == null || r.adapter.clear("cancel-run");
    const e = new mi(!0);
    (n = this.abortController) == null || n.abort(e), this.abortController = null;
  }
  cancelRun() {
    var r, n;
    (r = this._queue) == null || r.adapter.clear("cancel-run");
    const e = new mi(!1);
    (n = this.abortController) == null || n.abort(e), this.abortController = null;
  }
  addToolResult({ messageId: e, toolCallId: r, result: n, isError: i, artifact: o }) {
    const s = this.repository.getMessage(e), { parentId: a } = s;
    let { message: l } = s;
    if (l.role !== "assistant")
      throw new Error("Tried to add tool result to non-assistant message");
    let c = !1, d = !1;
    const u = l.content.map((h) => h.type !== "tool-call" || h.toolCallId !== r ? h : (d = !0, h.result || (c = !0), {
      ...h,
      result: n,
      artifact: o,
      isError: i
    }));
    if (!d)
      throw new Error("Tried to add tool result to non-existing tool call");
    l = {
      ...l,
      content: u
    }, this.repository.addOrUpdateMessage(a, l), this._notifySubscribers(), c && pi(l, this._options.unstable_humanToolNames) && this._runLoop(a, l, this._lastRunConfig).catch(() => {
    });
  }
  resumeToolCall(e) {
    throw new Error("Local runtime does not support resuming tool calls. For human-in-the-loop tools, list the tool in unstable_humanToolNames and complete the call with addToolResult.");
  }
  respondToToolApproval({ approvalId: e, approved: r, optionId: n, reason: i }) {
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
        approved: r,
        ...n != null && { optionId: n },
        ...i != null && { reason: i }
      };
      return r ? {
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
    this.repository.addOrUpdateMessage(c, o), this._notifySubscribers(), this.repository.headId === o.id && pi(o, this._options.unstable_humanToolNames) && this._runLoop(c, o, this._lastRunConfig).catch(() => {
    });
  }
};
const ka = Object.freeze([]), Ki = "__DEFAULT_ID__", Wy = Object.freeze({ [Ki]: {
  id: Ki,
  remoteId: void 0,
  externalId: void 0,
  status: "regular",
  title: void 0
} });
var Ky = class extends Zr {
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
    return ka;
  }
  get archivedThreadIds() {
    return ka;
  }
  get mainThreadId() {
    return Ki;
  }
  get threadItems() {
    return Wy;
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
}, Qy = class extends Do {
  constructor(e, r) {
    super();
    C(this, "threads");
    C(this, "Provider");
    C(this, "_options");
    this._options = e, this.threads = new Ky(() => new Gy(this._contextProvider, this._options)), r && this.threads.getMainThreadRuntimeCore().import(pu.fromArray(r));
  }
};
const Yy = (t, { initialMessages: e, ...r }) => {
  const { modelContext: n, ...i } = Zb() ?? {}, o = {
    ...r,
    adapters: {
      ...i,
      ...r.adapters,
      chatModel: t
    }
  }, [s] = ve(() => new Qy(o, e)), a = Z(void 0);
  return a.current = L((l) => l.threadListItem.remoteId), Q(() => {
    s.threads.getMainThreadRuntimeCore().__internal_setGetThreadId(() => a.current);
  }, [s]), Q(() => () => {
    s.threads.getMainThreadRuntimeCore().detach();
  }, [s]), Q(() => {
    s.threads.getMainThreadRuntimeCore().__internal_setOptions(o), s.threads.getMainThreadRuntimeCore().__internal_load();
  }), Q(() => {
    if (n)
      return s.registerModelContextProvider(n);
  }, [n, s]), ce(() => new Mo(s), [s]);
}, Jy = (t) => {
  const { cloud: e, initialMessages: r, maxSteps: n, adapters: i, unstable_humanToolNames: o, unstable_enableMessageQueue: s, ...a } = t;
  return {
    localRuntimeOptions: {
      cloud: e,
      initialMessages: r,
      maxSteps: n,
      adapters: i,
      unstable_humanToolNames: o,
      unstable_enableMessageQueue: s
    },
    otherOptions: a
  };
}, Xy = (t, { cloud: e, ...r } = {}) => vv({
  runtimeHook: function() {
    return Yy(t, r);
  },
  adapter: lw({ cloud: e }),
  allowNesting: !0
}), _a = Symbol.for("@assistant-ui/core.loaded");
function Zy() {
  const t = globalThis;
  t[_a] && console.warn("[@assistant-ui/core] Multiple copies of @assistant-ui/core are loaded into the same runtime. This causes subtle bugs (tools not reaching the runtime, context lookups returning the wrong provider, instanceof checks failing). Run `npx assistant-ui doctor` to diagnose."), t[_a] = !0;
}
const e0 = /:([\w-]{1,64})\[([^\]\n]{1,1024})\](?:\{name=([^}\n]{1,1024})\})?/gu, rd = {
  serialize(t) {
    const e = t.id !== t.label ? `{name=${t.id}}` : "";
    return `:${t.type}[${t.label}]${e}`;
  },
  parse(t) {
    const e = [];
    let r = 0;
    for (const n of t.matchAll(e0)) {
      n.index > r && e.push({
        kind: "text",
        text: t.slice(r, n.index)
      });
      const i = n[2];
      e.push({
        kind: "mention",
        type: n[1],
        label: i,
        id: n[3] ?? i
      }), r = n.index + n[0].length;
    }
    return r < t.length && e.push({
      kind: "text",
      text: t.slice(r)
    }), e;
  }
};
({}).NODE_ENV !== "production" && Zy();
function t0(t, e) {
  function r(n) {
    const i = We(t);
    if (!(n != null && n.optional) && !i)
      throw new Error(`This component must be used within ${e}.`);
    return i;
  }
  return r;
}
function nd(t, e) {
  function r(i) {
    const o = t(i);
    return o ? o[e] : null;
  }
  function n(i) {
    let o = !1, s;
    typeof i == "function" ? s = i : i && typeof i == "object" && (o = !!i.optional, s = i.selector);
    const a = r({ optional: o });
    return a ? s ? a(s) : a() : null;
  }
  return {
    [e]: n,
    [`${e}Store`]: r
  };
}
const id = Ge(null), { useThreadViewport: Kt, useThreadViewportStore: Qt } = nd(t0(id, "ThreadPrimitive.Viewport"), "useThreadViewport");
let or;
const fi = () => {
  if (or)
    return or;
  const t = () => ({
    apis: /* @__PURE__ */ new Map(),
    nextId: 0,
    listeners: /* @__PURE__ */ new Set()
  });
  if (typeof window > "u")
    return or = t(), or;
  const e = window.__ASSISTANT_UI_DEVTOOLS_HOOK__;
  if (e)
    return or = e, e;
  const r = t();
  return window.__ASSISTANT_UI_DEVTOOLS_HOOK__ = r, or = r, r;
};
var Ye, r0 = (Ye = class {
  static register(e) {
    var a, l;
    const r = fi();
    for (const c of r.apis.values())
      if (c.api === e)
        return () => {
        };
    const n = r.nextId++, i = {
      api: e,
      logs: []
    }, o = (a = e.on) == null ? void 0 : a.call(e, "*", (c) => {
      const d = r.apis.get(n);
      d && (d.logs.push({
        time: /* @__PURE__ */ new Date(),
        event: c.event,
        data: c.payload
      }), d.logs.length > Ye.MAX_EVENT_LOGS_PER_API && (d.logs = d.logs.slice(-Ye.MAX_EVENT_LOGS_PER_API)), Ye.notifyListeners(n));
    }), s = (l = e.subscribe) == null ? void 0 : l.call(e, () => {
      Ye.notifyListeners(n);
    });
    return r.apis.set(n, i), Ye.notifyListeners(n), () => {
      const c = fi();
      c.apis.get(n) && (o == null || o(), s == null || s(), c.apis.delete(n), Ye.notifyListeners(n));
    };
  }
  static notifyListeners(e) {
    fi().listeners.forEach((r) => r(e));
  }
}, C(Ye, "MAX_EVENT_LOGS_PER_API", 200), Ye);
const Sa = (t) => {
  const e = /* @__PURE__ */ new Map(), r = () => {
    let n = 0;
    for (const i of e.values())
      n += i;
    t(n);
  };
  return { register: () => {
    const n = Symbol();
    return e.set(n, 0), {
      setHeight: (i) => {
        e.get(n) !== i && (e.set(n, i), r());
      },
      unregister: () => {
        e.delete(n), r();
      }
    };
  } };
}, n0 = (t = {}) => {
  const e = /* @__PURE__ */ new Set(), r = Sa((s) => {
    o.setState({ height: {
      ...o.getState().height,
      viewport: s
    } });
  }), n = Sa((s) => {
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
  }), o = mr(() => {
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
      registerViewport: r.register,
      registerContentInset: n.register,
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
}, Dn = (t) => t, i0 = (t) => {
  const e = A(11);
  let r;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (r = { optional: !0 }, e[0] = r) : r = e[0];
  const n = Qt(r);
  let i;
  e[1] !== t ? (i = () => n0(t), e[1] = t, e[2] = i) : i = e[2];
  const [o] = ve(i);
  let s, a;
  e[3] !== n || e[4] !== o ? (s = () => n == null ? void 0 : n.getState().onScrollToBottom(() => {
    o.getState().scrollToBottom();
  }), a = [n, o], e[3] = n, e[4] = o, e[5] = s, e[6] = a) : (s = e[5], a = e[6]), Q(s, a);
  let l, c;
  return e[7] !== n || e[8] !== o ? (l = () => {
    if (n)
      return o.subscribe((d) => {
        n.getState().isAtBottom !== d.isAtBottom && Dn(n).setState({ isAtBottom: d.isAtBottom });
      });
  }, c = [o, n], e[7] = n, e[8] = o, e[9] = l, e[10] = c) : (l = e[9], c = e[10]), Q(l, c), o;
}, Bo = (t) => {
  const e = A(7), { children: r, options: n } = t;
  let i;
  e[0] !== n ? (i = n === void 0 ? {} : n, e[0] = n, e[1] = i) : i = e[1];
  const o = i0(i);
  let s;
  e[2] !== o ? (s = () => ({ useThreadViewport: o }), e[2] = o, e[3] = s) : s = e[3];
  const [a] = ve(s);
  let l;
  return e[4] !== r || e[5] !== a ? (l = /* @__PURE__ */ f(id.Provider, {
    value: a,
    children: r
  }), e[4] = r, e[5] = a, e[6] = l) : l = e[6], l;
}, o0 = () => {
  const t = A(3), e = J();
  let r, n;
  return t[0] !== e ? (r = () => {
    if (!(typeof process > "u" || {}.NODE_ENV === "production"))
      return r0.register(e);
  }, n = [e], t[0] = e, t[1] = r, t[2] = n) : (r = t[1], n = t[2]), Q(r, n), null;
}, s0 = (t) => {
  const e = A(7), { children: r, aui: n, runtime: i } = t, o = n ?? null;
  let s;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ f(o0, {}), e[0] = s) : s = e[0];
  let a;
  e[1] !== r ? (a = /* @__PURE__ */ f(Bo, { children: r }), e[1] = r, e[2] = a) : a = e[2];
  let l;
  return e[3] !== i || e[4] !== o || e[5] !== a ? (l = /* @__PURE__ */ H(jg, {
    runtime: i,
    aui: o,
    children: [s, a]
  }), e[3] = i, e[4] = o, e[5] = a, e[6] = l) : l = e[6], l;
}, a0 = we(s0);
function Ca(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
function l0(...t) {
  return (e) => {
    let r = !1;
    const n = t.map((i) => {
      const o = Ca(i, e);
      return !r && typeof o == "function" && (r = !0), o;
    });
    if (r)
      return () => {
        for (let i = 0; i < n.length; i++) {
          const o = n[i];
          typeof o == "function" ? o() : Ca(t[i], null);
        }
      };
  };
}
function Yt(...t) {
  return yt(l0(...t), t);
}
var Ta = Object.defineProperty, Jt = (t, e) => {
  let r = {};
  for (var n in t)
    Ta(r, n, {
      get: t[n],
      enumerable: !0
    });
  return e || Ta(r, Symbol.toStringTag, { value: "Module" }), r;
};
const c0 = window.ReactDOM;
c0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
// @__NO_SIDE_EFFECTS__
function od(t) {
  const e = te((r, n) => {
    let { children: i, ...o } = r, s = null, a = !1;
    const l = [];
    Ia(i) && typeof hn == "function" && (i = hn(i._payload)), zi.forEach(i, (h) => {
      var p;
      if (f0(h)) {
        a = !0;
        const m = h;
        let g = "child" in m.props ? m.props.child : m.props.children;
        Ia(g) && typeof hn == "function" && (g = hn(g._payload)), s = h0(m, g), l.push((p = s == null ? void 0 : s.props) == null ? void 0 : p.children);
      } else
        l.push(h);
    }), s ? s = Ft(s, void 0, l) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && zi.count(i) === 1 && Ct(i) && (s = i)
    );
    const c = s ? m0(s) : void 0, d = Yt(n, c);
    if (!s) {
      if (i || i === 0)
        throw new Error(
          a ? w0(t) : v0(t)
        );
      return i;
    }
    const u = p0(o, s.props ?? {});
    return s.type !== Bt && (u.ref = n ? d : c), Ft(s, u);
  });
  return e.displayName = `${t}.Slot`, e;
}
var Nn = /* @__PURE__ */ od("Slot"), sd = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function u0(t) {
  const e = (r) => "child" in r ? r.children(r.child) : r.children;
  return e.displayName = `${t}.Slottable`, e.__radixId = sd, e;
}
var d0 = /* @__PURE__ */ u0("Slottable"), h0 = (t, e) => {
  if ("child" in t.props) {
    const r = t.props.child;
    return Ct(r) ? Ft(r, void 0, t.props.children(r.props.children)) : null;
  }
  return Ct(e) ? e : null;
};
function p0(t, e) {
  const r = { ...e };
  for (const n in e) {
    const i = t[n], o = e[n];
    /^on[A-Z]/.test(n) ? i && o ? r[n] = (...a) => {
      const l = o(...a);
      return i(...a), l;
    } : i && (r[n] = i) : n === "style" ? r[n] = { ...i, ...o } : n === "className" && (r[n] = [i, o].filter(Boolean).join(" "));
  }
  return { ...t, ...r };
}
function m0(t) {
  var n, i;
  let e = (n = Object.getOwnPropertyDescriptor(t.props, "ref")) == null ? void 0 : n.get, r = e && "isReactWarning" in e && e.isReactWarning;
  return r ? t.ref : (e = (i = Object.getOwnPropertyDescriptor(t, "ref")) == null ? void 0 : i.get, r = e && "isReactWarning" in e && e.isReactWarning, r ? t.props.ref : t.props.ref || t.ref);
}
function f0(t) {
  return Ct(t) && typeof t.type == "function" && "__radixId" in t.type && t.type.__radixId === sd;
}
var g0 = Symbol.for("react.lazy");
function Ia(t) {
  return t != null && typeof t == "object" && "$$typeof" in t && t.$$typeof === g0 && "_payload" in t && b0(t._payload);
}
function b0(t) {
  return typeof t == "object" && t !== null && "then" in t;
}
var v0 = (t) => `${t} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, w0 = (t) => `${t} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, hn = wm[" use ".trim().toString()], y0 = [
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
], x0 = y0.reduce((t, e) => {
  const r = /* @__PURE__ */ od(`Primitive.${e}`), n = te((i, o) => {
    const { asChild: s, ...a } = i, l = s ? r : e;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ f(l, { ...a, ref: o });
  });
  return n.displayName = `Primitive.${e}`, { ...t, [e]: n };
}, {});
const k0 = [
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
function _0(t) {
  const e = te((r, n) => {
    const i = A(17);
    let o, s, a, l;
    i[0] !== r ? ({ render: a, asChild: o, children: s, ...l } = r, i[0] = r, i[1] = o, i[2] = s, i[3] = a, i[4] = l) : (o = i[1], s = i[2], a = i[3], l = i[4]);
    const c = t;
    if (a && Ct(a)) {
      const h = s !== void 0 ? s : a.props.children, p = l;
      let m;
      i[5] !== a || i[6] !== h ? (m = Ft(a, void 0, h), i[5] = a, i[6] = h, i[7] = m) : m = i[7];
      let g;
      return i[8] !== n || i[9] !== p || i[10] !== m ? (g = /* @__PURE__ */ f(c, {
        ...p,
        asChild: !0,
        ref: n,
        children: m
      }), i[8] = n, i[9] = p, i[10] = m, i[11] = g) : g = i[11], g;
    }
    const d = l;
    let u;
    return i[12] !== o || i[13] !== s || i[14] !== n || i[15] !== d ? (u = /* @__PURE__ */ f(c, {
      ...d,
      asChild: o,
      ref: n,
      children: s
    }), i[12] = o, i[13] = s, i[14] = n, i[15] = d, i[16] = u) : u = i[16], u;
  });
  return e.displayName = typeof t == "string" ? t : t.displayName ?? t.name ?? "Component", e;
}
function S0(t) {
  const e = x0[t], r = _0(e);
  return r.displayName = `Primitive.${t}`, r;
}
const he = k0.reduce((t, e) => (t[e] = S0(e), t), {}), C0 = (t) => {
  const e = A(5), { hideWhenRunning: r, autohide: n, autohideFloat: i, forceVisible: o } = t;
  let s;
  return e[0] !== n || e[1] !== i || e[2] !== o || e[3] !== r ? (s = (a) => {
    if (r && a.thread.isRunning)
      return "hidden";
    const l = n === "always" || n === "not-last" && !a.message.isLast, c = o || a.message.isHovering;
    return l ? c ? i === "always" || i === "single-branch" && a.message.branchCount <= 1 ? "floating" : "normal" : "hidden" : "normal";
  }, e[0] = n, e[1] = i, e[2] = o, e[3] = r, e[4] = s) : s = e[4], L(s);
}, T0 = Ge(null), ad = te((t, e) => {
  const r = A(18);
  let n, i, o, s;
  r[0] !== t ? ({ hideWhenRunning: o, autohide: n, autohideFloat: i, ...s } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s) : (n = r[1], i = r[2], o = r[3], s = r[4]);
  const [a, l] = ve(0);
  let c;
  r[5] === Symbol.for("react.memo_cache_sentinel") ? (c = () => {
    let k = !1;
    return l(I0), () => {
      k || (k = !0, l(E0));
    };
  }, r[5] = c) : c = r[5];
  const d = c;
  let u;
  r[6] === Symbol.for("react.memo_cache_sentinel") ? (u = { acquireInteractionLock: d }, r[6] = u) : u = r[6];
  const h = u, p = a > 0;
  let m;
  r[7] !== n || r[8] !== i || r[9] !== o || r[10] !== p ? (m = {
    hideWhenRunning: o,
    autohide: n,
    autohideFloat: i,
    forceVisible: p
  }, r[7] = n, r[8] = i, r[9] = o, r[10] = p, r[11] = m) : m = r[11];
  const g = C0(m);
  if (g === "hidden")
    return null;
  let v;
  r[12] !== g ? (v = g === "floating" ? { "data-floating": "true" } : null, r[12] = g, r[13] = v) : v = r[13];
  let b;
  return r[14] !== e || r[15] !== s || r[16] !== v ? (b = /* @__PURE__ */ f(T0.Provider, {
    value: h,
    children: /* @__PURE__ */ f(he.div, {
      ...v,
      ...s,
      ref: e
    })
  }), r[14] = e, r[15] = s, r[16] = v, r[17] = b) : b = r[17], b;
});
ad.displayName = "ActionBarPrimitive.Root";
function I0(t) {
  return t + 1;
}
function E0(t) {
  return Math.max(0, t - 1);
}
function ye(t, e, { checkForDefaultPrevented: r = !0 } = {}) {
  return function(i) {
    if (t == null || t(i), r === !1 || !i || !i.defaultPrevented)
      return e == null ? void 0 : e(i);
  };
}
const A0 = (t) => {
  const e = A(4);
  let r;
  e[0] !== t ? (r = t === void 0 ? {} : t, e[0] = t, e[1] = r) : r = e[1];
  const { copiedDuration: n } = r, i = n === void 0 ? 3e3 : n;
  let o;
  e[2] !== i ? (o = {
    copiedDuration: i,
    copyToClipboard: R0
  }, e[2] = i, e[3] = o) : o = e[3];
  const { copy: s, disabled: a } = xy(o);
  return a ? null : s;
}, ld = te((t, e) => {
  const r = A(20);
  let n, i, o, s;
  r[0] !== t ? ({ copiedDuration: n, onClick: o, disabled: i, ...s } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s) : (n = r[1], i = r[2], o = r[3], s = r[4]);
  const a = L(P0);
  let l;
  r[5] !== n ? (l = { copiedDuration: n }, r[5] = n, r[6] = l) : l = r[6];
  const c = A0(l);
  let d;
  r[7] !== a ? (d = a ? { "data-copied": "true" } : {}, r[7] = a, r[8] = d) : d = r[8];
  const u = i || !c;
  let h;
  r[9] !== c ? (h = () => {
    c == null || c();
  }, r[9] = c, r[10] = h) : h = r[10];
  let p;
  r[11] !== o || r[12] !== h ? (p = ye(o, h), r[11] = o, r[12] = h, r[13] = p) : p = r[13];
  let m;
  return r[14] !== e || r[15] !== s || r[16] !== d || r[17] !== u || r[18] !== p ? (m = /* @__PURE__ */ f(he.button, {
    type: "button",
    ...d,
    ...s,
    ref: e,
    disabled: u,
    onClick: p
  }), r[14] = e, r[15] = s, r[16] = d, r[17] = u, r[18] = p, r[19] = m) : m = r[19], m;
});
ld.displayName = "ActionBarPrimitive.Copy";
function R0(t) {
  return typeof navigator > "u" || !navigator.clipboard ? Promise.reject(/* @__PURE__ */ new Error("Clipboard API is unavailable")) : navigator.clipboard.writeText(t);
}
function P0(t) {
  return t.message.isCopied;
}
const rt = (t, e, r = []) => {
  const n = te((i, o) => {
    const s = A(6), a = {}, l = {};
    Object.keys(i).forEach((g) => {
      r.includes(g) ? a[g] = i[g] : l[g] = i[g];
    });
    const c = e(a) ?? void 0, d = he, u = "button", h = l.disabled || !c, p = ye(l.onClick, c);
    let m;
    return s[0] !== o || s[1] !== l || s[2] !== d.button || s[3] !== h || s[4] !== p ? (m = /* @__PURE__ */ f(d.button, {
      ...l,
      type: u,
      ref: o,
      disabled: h,
      onClick: p
    }), s[0] = o, s[1] = l, s[2] = d.button, s[3] = h, s[4] = p, s[5] = m) : m = s[5], m;
  });
  return n.displayName = t, n;
}, M0 = () => {
  const { disabled: t, reload: e } = Py();
  return t ? null : e;
}, D0 = rt("ActionBarPrimitive.Reload", M0), N0 = () => {
  const { disabled: t, edit: e } = Ay();
  return t ? null : e;
}, z0 = rt("ActionBarPrimitive.Edit", N0), O0 = () => {
  const { disabled: t, speak: e } = Ly();
  return t ? null : e;
}, L0 = rt("ActionBarPrimitive.Speak", O0);
function Vt(t) {
  const e = lt(t);
  return Ht(() => {
    e.current = t;
  }), xt(() => (...r) => {
    var n;
    return (n = e.current) == null ? void 0 : n.call(e, ...r);
  }, []);
}
function cd(t, e = globalThis == null ? void 0 : globalThis.document) {
  const r = Vt(t);
  Ht(() => {
    const n = (i) => {
      i.key === "Escape" && r(i);
    };
    return e.addEventListener("keydown", n, { capture: !0 }), () => e.removeEventListener("keydown", n, { capture: !0 });
  }, [r, e]);
}
const $0 = () => {
  const { disabled: t, stopSpeaking: e } = Fy();
  return t ? null : e;
}, ud = te((t, e) => {
  const r = A(12), n = $0();
  let i;
  r[0] !== n ? (i = (c) => {
    n && (c.preventDefault(), n());
  }, r[0] = n, r[1] = i) : i = r[1], cd(i);
  const o = !n;
  let s;
  r[2] !== n ? (s = () => {
    n == null || n();
  }, r[2] = n, r[3] = s) : s = r[3];
  let a;
  r[4] !== t.onClick || r[5] !== s ? (a = ye(t.onClick, s), r[4] = t.onClick, r[5] = s, r[6] = a) : a = r[6];
  let l;
  return r[7] !== t || r[8] !== e || r[9] !== o || r[10] !== a ? (l = /* @__PURE__ */ f(he.button, {
    type: "button",
    disabled: o,
    ...t,
    ref: e,
    onClick: a
  }), r[7] = t, r[8] = e, r[9] = o, r[10] = a, r[11] = l) : l = r[11], l;
});
ud.displayName = "ActionBarPrimitive.StopSpeaking";
const B0 = () => {
  const { submit: t } = Dy();
  return t;
}, dd = te((t, e) => {
  const r = A(17);
  let n, i, o;
  r[0] !== t ? ({ onClick: i, disabled: n, ...o } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o) : (n = r[1], i = r[2], o = r[3]);
  const s = L(F0), a = B0();
  let l;
  r[4] !== s ? (l = s ? { "data-submitted": "true" } : {}, r[4] = s, r[5] = l) : l = r[5];
  const c = n || !a;
  let d;
  r[6] !== a ? (d = () => {
    a == null || a();
  }, r[6] = a, r[7] = d) : d = r[7];
  let u;
  r[8] !== i || r[9] !== d ? (u = ye(i, d), r[8] = i, r[9] = d, r[10] = u) : u = r[10];
  let h;
  return r[11] !== e || r[12] !== o || r[13] !== l || r[14] !== c || r[15] !== u ? (h = /* @__PURE__ */ f(he.button, {
    type: "button",
    ...l,
    ...o,
    ref: e,
    disabled: c,
    onClick: u
  }), r[11] = e, r[12] = o, r[13] = l, r[14] = c, r[15] = u, r[16] = h) : h = r[16], h;
});
dd.displayName = "ActionBarPrimitive.FeedbackPositive";
function F0(t) {
  var e;
  return ((e = t.message.metadata.submittedFeedback) == null ? void 0 : e.type) === "positive";
}
const U0 = () => {
  const { submit: t } = Ny();
  return t;
}, hd = te((t, e) => {
  const r = A(17);
  let n, i, o;
  r[0] !== t ? ({ onClick: i, disabled: n, ...o } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o) : (n = r[1], i = r[2], o = r[3]);
  const s = L(j0), a = U0();
  let l;
  r[4] !== s ? (l = s ? { "data-submitted": "true" } : {}, r[4] = s, r[5] = l) : l = r[5];
  const c = n || !a;
  let d;
  r[6] !== a ? (d = () => {
    a == null || a();
  }, r[6] = a, r[7] = d) : d = r[7];
  let u;
  r[8] !== i || r[9] !== d ? (u = ye(i, d), r[8] = i, r[9] = d, r[10] = u) : u = r[10];
  let h;
  return r[11] !== e || r[12] !== o || r[13] !== l || r[14] !== c || r[15] !== u ? (h = /* @__PURE__ */ f(he.button, {
    type: "button",
    ...l,
    ...o,
    ref: e,
    disabled: c,
    onClick: u
  }), r[11] = e, r[12] = o, r[13] = l, r[14] = c, r[15] = u, r[16] = h) : h = r[16], h;
});
hd.displayName = "ActionBarPrimitive.FeedbackNegative";
function j0(t) {
  var e;
  return ((e = t.message.metadata.submittedFeedback) == null ? void 0 : e.type) === "negative";
}
const V0 = (t) => {
  const e = A(6);
  let r;
  e[0] !== t ? (r = t === void 0 ? {} : t, e[0] = t, e[1] = r) : r = e[1];
  const { filename: n, onExport: i } = r, o = J(), s = L(H0);
  let a;
  e[2] !== o || e[3] !== n || e[4] !== i ? (a = async () => {
    const c = o.message().getCopyText();
    if (!c)
      return;
    if (i) {
      await i(c);
      return;
    }
    const d = new Blob([c], { type: "text/markdown" }), u = URL.createObjectURL(d), h = document.createElement("a");
    h.href = u, h.download = n ?? `message-${Date.now()}.md`, h.click(), URL.revokeObjectURL(u);
  }, e[2] = o, e[3] = n, e[4] = i, e[5] = a) : a = e[5];
  const l = a;
  return s ? l : null;
}, pd = te((t, e) => {
  const r = A(19);
  let n, i, o, s, a;
  r[0] !== t ? ({ filename: i, onExport: s, onClick: o, disabled: n, ...a } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s, r[5] = a) : (n = r[1], i = r[2], o = r[3], s = r[4], a = r[5]);
  let l;
  r[6] !== i || r[7] !== s ? (l = {
    filename: i,
    onExport: s
  }, r[6] = i, r[7] = s, r[8] = l) : l = r[8];
  const c = V0(l), d = n || !c;
  let u;
  r[9] !== c ? (u = () => {
    c == null || c();
  }, r[9] = c, r[10] = u) : u = r[10];
  let h;
  r[11] !== o || r[12] !== u ? (h = ye(o, u), r[11] = o, r[12] = u, r[13] = h) : h = r[13];
  let p;
  return r[14] !== e || r[15] !== a || r[16] !== d || r[17] !== h ? (p = /* @__PURE__ */ f(he.button, {
    type: "button",
    ...a,
    ref: e,
    disabled: d,
    onClick: h
  }), r[14] = e, r[15] = a, r[16] = d, r[17] = h, r[18] = p) : p = r[18], p;
});
pd.displayName = "ActionBarPrimitive.ExportMarkdown";
function q0(t) {
  return t.type === "text" && t.text.length > 0;
}
function H0(t) {
  var e;
  return (t.message.role !== "assistant" || ((e = t.message.status) == null ? void 0 : e.type) !== "running") && t.message.parts.some(q0);
}
var Ea = /* @__PURE__ */ Jt({
  Copy: () => ld,
  Edit: () => z0,
  ExportMarkdown: () => pd,
  FeedbackNegative: () => hd,
  FeedbackPositive: () => dd,
  Reload: () => D0,
  Root: () => ad,
  Speak: () => L0,
  StopSpeaking: () => ud
});
const md = te((t, e) => {
  const r = A(3);
  let n;
  return r[0] !== t || r[1] !== e ? (n = /* @__PURE__ */ f(he.div, {
    ...t,
    ref: e
  }), r[0] = t, r[1] = e, r[2] = n) : n = r[2], n;
});
md.displayName = "AttachmentPrimitive.Root";
const fd = te((t, e) => {
  const r = A(4), n = L(G0);
  let i;
  return r[0] !== n || r[1] !== t || r[2] !== e ? (i = /* @__PURE__ */ H(he.div, {
    ...t,
    ref: e,
    children: [".", n]
  }), r[0] = n, r[1] = t, r[2] = e, r[3] = i) : i = r[3], i;
});
fd.displayName = "AttachmentPrimitive.unstable_Thumb";
function G0(t) {
  const e = t.attachment.name.split(".");
  return e.length > 1 ? e.pop() : "";
}
const gd = () => {
  const t = A(2), e = L(W0);
  let r;
  return t[0] !== e ? (r = /* @__PURE__ */ f(tt, { children: e }), t[0] = e, t[1] = r) : r = t[1], r;
};
gd.displayName = "AttachmentPrimitive.Name";
function W0(t) {
  return t.attachment.name;
}
const K0 = () => {
  const t = A(2), e = J();
  let r;
  return t[0] !== e ? (r = () => {
    e.attachment().remove();
  }, t[0] = e, t[1] = r) : r = t[1], r;
}, Q0 = rt("AttachmentPrimitive.Remove", K0);
var Qi = /* @__PURE__ */ Jt({
  Name: () => gd,
  Remove: () => Q0,
  Root: () => md,
  unstable_Thumb: () => fd
});
const Y0 = (t) => {
  const e = A(12);
  let r;
  return e[0] !== t.assistant || e[1] !== t.copied || e[2] !== t.hasAttachments || e[3] !== t.hasBranches || e[4] !== t.hasContent || e[5] !== t.last || e[6] !== t.lastOrHover || e[7] !== t.speaking || e[8] !== t.submittedFeedback || e[9] !== t.system || e[10] !== t.user ? (r = (n) => {
    var h;
    const { role: i, attachments: o, parts: s, branchCount: a, isLast: l, speech: c, isCopied: d, isHovering: u } = n.message;
    return !(t.hasBranches === !0 && a < 2 || t.user && i !== "user" || t.assistant && i !== "assistant" || t.system && i !== "system" || t.lastOrHover === !0 && !u && !l || t.last !== void 0 && t.last !== l || t.copied === !0 && !d || t.copied === !1 && d || t.speaking === !0 && c == null || t.speaking === !1 && c != null || t.hasAttachments === !0 && (i !== "user" || !(o != null && o.length)) || t.hasAttachments === !1 && i === "user" && (o != null && o.length) || t.hasContent === !0 && s.length === 0 || t.hasContent === !1 && s.length > 0 || t.submittedFeedback !== void 0 && (((h = n.message.metadata.submittedFeedback) == null ? void 0 : h.type) ?? null) !== t.submittedFeedback);
  }, e[0] = t.assistant, e[1] = t.copied, e[2] = t.hasAttachments, e[3] = t.hasBranches, e[4] = t.hasContent, e[5] = t.last, e[6] = t.lastOrHover, e[7] = t.speaking, e[8] = t.submittedFeedback, e[9] = t.system, e[10] = t.user, e[11] = r) : r = e[11], L(r);
}, bd = (t) => {
  const e = A(3);
  let r, n;
  return e[0] !== t ? ({ children: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]), Y0(n) ? r : null;
};
bd.displayName = "MessagePrimitive.If";
const vd = Ge(null), Jn = () => We(vd), J0 = (t) => {
  const e = A(8), { children: r } = t;
  let n;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (n = /* @__PURE__ */ new Map(), e[0] = n) : n = e[0];
  const i = Z(n);
  let o;
  e[1] === Symbol.for("react.memo_cache_sentinel") ? (o = [], e[1] = o) : o = e[1];
  const s = Z(o);
  let a;
  e[2] === Symbol.for("react.memo_cache_sentinel") ? (a = () => {
    const v = Array.from(i.current.entries());
    v.sort(X0), s.current = v.map(Z0);
  }, e[2] = a) : a = e[2];
  const l = a;
  let c;
  e[3] === Symbol.for("react.memo_cache_sentinel") ? (c = (v, b) => {
    const k = (b == null ? void 0 : b.priority) ?? 0;
    return i.current.set(v, k), l(), () => {
      i.current.delete(v), l();
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
  return e[6] !== r ? (g = /* @__PURE__ */ f(vd.Provider, {
    value: m,
    children: r
  }), e[6] = r, e[7] = g) : g = e[7], g;
};
function X0(t, e) {
  return e[1] - t[1];
}
function Z0(t) {
  const [e] = t;
  return e;
}
const Fo = Ge(null), wd = Ge(null), Uo = () => {
  const t = We(Fo);
  if (!t)
    throw new Error("useTriggerPopoverRootContext must be used within ComposerPrimitive.TriggerPopoverRoot");
  return t;
}, jo = () => We(Fo), ex = () => {
  const t = We(wd);
  if (!t)
    throw new Error("useTriggerPopoverAriaPublish must be used within ComposerPrimitive.TriggerPopoverRoot");
  return t;
}, tx = () => {
  const t = Uo();
  return vr(t.subscribe, t.getTriggers, t.getTriggers);
}, rx = /* @__PURE__ */ new Map(), yd = () => () => {
}, Aa = () => rx, nx = () => {
  const t = jo();
  return vr(t ? t.subscribe : yd, t ? t.getTriggers : Aa, t ? t.getTriggers : Aa);
}, Ra = () => null, ix = () => {
  const t = jo();
  return vr(t ? t.subscribeAria : yd, t ? t.getActiveAria : Ra, t ? t.getActiveAria : Ra);
};
function Pa() {
  const t = A(4);
  let e;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (e = /* @__PURE__ */ new Set(), t[0] = e) : e = t[0];
  const r = Z(e);
  let n;
  t[1] === Symbol.for("react.memo_cache_sentinel") ? (n = () => {
    for (const l of r.current)
      l();
  }, t[1] = n) : n = t[1];
  const i = n;
  let o;
  t[2] === Symbol.for("react.memo_cache_sentinel") ? (o = (l) => (r.current.add(l), () => {
    r.current.delete(l);
  }), t[2] = o) : o = t[2];
  const s = o;
  let a;
  return t[3] === Symbol.for("react.memo_cache_sentinel") ? (a = {
    notify: i,
    subscribe: s
  }, t[3] = a) : a = t[3], a;
}
const Ma = (t) => {
  const e = A(21), { children: r } = t;
  let n;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (n = /* @__PURE__ */ new Map(), e[0] = n) : n = e[0];
  const i = Z(n);
  let o;
  e[1] === Symbol.for("react.memo_cache_sentinel") ? (o = /* @__PURE__ */ new Set(), e[1] = o) : o = e[1];
  const s = Z(o), { notify: a, subscribe: l } = Pa();
  let c;
  e[2] !== a ? (c = (N) => {
    const { char: $ } = N;
    if (i.current.has($))
      return {}.NODE_ENV !== "production" && console.warn(`[assistant-ui] Duplicate TriggerPopover for char "${$}". Ignoring the second registration.`), ox;
    if ({}.NODE_ENV !== "production")
      for (const j of i.current.values())
        ($.startsWith(j.char) || j.char.startsWith($)) && console.warn(`[assistant-ui] Trigger prefix collision between "${j.char}" and "${$}". One char is a prefix of the other; only one will match reliably.`);
    const O = new Map(i.current);
    O.set($, N), i.current = O, a();
    for (const j of s.current)
      j.added(N);
    return () => {
      const j = new Map(i.current);
      j.delete($), i.current = j, a();
      for (const G of s.current)
        G.removed($);
    };
  }, e[2] = a, e[3] = c) : c = e[3];
  const d = c;
  let u;
  e[4] === Symbol.for("react.memo_cache_sentinel") ? (u = () => i.current, e[4] = u) : u = e[4];
  const h = u;
  let p;
  e[5] === Symbol.for("react.memo_cache_sentinel") ? (p = (N) => (s.current.add(N), () => {
    s.current.delete(N);
  }), e[5] = p) : p = e[5];
  const m = p, g = Z(null), v = Z(null), { notify: b, subscribe: k } = Pa();
  let x;
  e[6] !== b ? (x = (N, $) => {
    if ($ === null) {
      if (v.current !== N)
        return;
      g.current = null, v.current = null, b();
      return;
    }
    const O = g.current;
    v.current === N && O !== null && O.popoverId === $.popoverId && O.highlightedItemId === $.highlightedItemId || (g.current = $, v.current = N, b());
  }, e[6] = b, e[7] = x) : x = e[7];
  const T = x;
  let E;
  e[8] === Symbol.for("react.memo_cache_sentinel") ? (E = () => g.current, e[8] = E) : E = e[8];
  const y = E;
  let P;
  e[9] !== d || e[10] !== l || e[11] !== k ? (P = {
    register: d,
    getTriggers: h,
    subscribe: l,
    subscribeLifecycle: m,
    getActiveAria: y,
    subscribeAria: k
  }, e[9] = d, e[10] = l, e[11] = k, e[12] = P) : P = e[12];
  const R = P;
  let D;
  e[13] !== T ? (D = { setActiveAria: T }, e[13] = T, e[14] = D) : D = e[14];
  const _ = D;
  let I;
  e[15] !== _ || e[16] !== r ? (I = /* @__PURE__ */ f(wd.Provider, {
    value: _,
    children: r
  }), e[15] = _, e[16] = r, e[17] = I) : I = e[17];
  let M;
  return e[18] !== I || e[19] !== R ? (M = /* @__PURE__ */ f(Fo.Provider, {
    value: R,
    children: I
  }), e[18] = I, e[19] = R, e[20] = M) : M = e[20], M;
}, xd = (t) => {
  const e = A(4), { children: r } = t;
  if (Jn()) {
    let i;
    return e[0] !== r ? (i = /* @__PURE__ */ f(Ma, { children: r }), e[0] = r, e[1] = i) : i = e[1], i;
  }
  let n;
  return e[2] !== r ? (n = /* @__PURE__ */ f(J0, { children: /* @__PURE__ */ f(Ma, { children: r }) }), e[2] = r, e[3] = n) : n = e[3], n;
};
xd.displayName = "ComposerPrimitive.TriggerPopoverRoot";
function ox() {
}
const Da = /\s/u;
function sx(t, e, r) {
  const n = t.slice(0, r);
  for (let i = n.length - 1; i >= 0; i--) {
    const o = n[i];
    if (Da.test(o))
      return null;
    if (n.startsWith(e, i)) {
      if (i > 0 && !Da.test(n[i - 1]))
        continue;
      return {
        query: n.slice(i + e.length),
        offset: i
      };
    }
  }
  return null;
}
const ax = (t) => {
  const e = A(7), { text: r, triggerChar: n } = t, [i, o] = ve(r.length), s = Math.min(i, r.length);
  let a;
  e[0] !== s || e[1] !== r || e[2] !== n ? (a = sx(r, n, s), e[0] = s, e[1] = r, e[2] = n, e[3] = a) : a = e[3];
  const l = a, c = (l == null ? void 0 : l.query) ?? "";
  let d;
  return e[4] !== c || e[5] !== l ? (d = {
    trigger: l,
    query: c,
    setCursorPosition: o
  }, e[4] = c, e[5] = l, e[6] = d) : d = e[6], d;
}, lx = le(ax);
function cx(t) {
  return "type" in t;
}
const ux = (t) => {
  const e = A(25), { navigableList: r, isSearchMode: n, activeCategoryId: i, query: o, popoverId: s, open: a, selectItem: l, selectCategory: c, goBack: d, close: u } = t, [h, p] = ve(0);
  let m;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (m = () => {
    p(0);
  }, e[0] = m) : m = e[0];
  let g;
  e[1] !== r ? (g = [r], e[1] = r, e[2] = g) : g = e[2], Q(m, g);
  let v;
  e[3] === Symbol.for("react.memo_cache_sentinel") ? (v = () => {
    p(0);
  }, e[3] = v) : v = e[3];
  let b;
  e[4] !== i || e[5] !== n ? (b = [n, i], e[4] = i, e[5] = n, e[6] = b) : b = e[6], Q(v, b);
  let k;
  e[7] !== h || e[8] !== r.length ? (k = (D) => {
    D < 0 || D >= r.length || D !== h && p(D);
  }, e[7] = h, e[8] = r.length, e[9] = k) : k = e[9];
  const x = Fe(k);
  let T;
  e[10] !== i || e[11] !== u || e[12] !== d || e[13] !== h || e[14] !== r || e[15] !== a || e[16] !== o || e[17] !== c || e[18] !== l ? (T = (D) => {
    if (!a)
      return !1;
    switch (D.key) {
      case "ArrowDown":
        return D.preventDefault(), p((_) => {
          const I = r.length;
          return I === 0 ? 0 : _ < I - 1 ? _ + 1 : 0;
        }), !0;
      case "ArrowUp":
        return D.preventDefault(), p((_) => {
          const I = r.length;
          return I === 0 ? 0 : _ > 0 ? _ - 1 : I - 1;
        }), !0;
      case "Enter":
      case "Tab": {
        if (D.shiftKey)
          return !1;
        D.preventDefault();
        const _ = r[h];
        return _ && (cx(_) ? l(_) : c(_.id)), !0;
      }
      case "Escape":
        return D.preventDefault(), u(), !0;
      case "Backspace":
        return i && o === "" ? (D.preventDefault(), d(), !0) : !1;
      default:
        return !1;
    }
  }, e[10] = i, e[11] = u, e[12] = d, e[13] = h, e[14] = r, e[15] = a, e[16] = o, e[17] = c, e[18] = l, e[19] = T) : T = e[19];
  const E = Fe(T), y = r[h], P = a && y ? `${s}-option-${y.id}` : void 0;
  let R;
  return e[20] !== E || e[21] !== x || e[22] !== h || e[23] !== P ? (R = {
    highlightedIndex: h,
    highlightedItemId: P,
    highlightIndex: x,
    handleKeyDown: E
  }, e[20] = E, e[21] = x, e[22] = h, e[23] = P, e[24] = R) : R = e[24], R;
}, dx = le(ux);
function Na(t, e) {
  var r;
  return t.id.toLowerCase().includes(e) || t.label.toLowerCase().includes(e) || (((r = t.description) == null ? void 0 : r.toLowerCase().includes(e)) ?? !1);
}
const hx = (t) => {
  const e = A(38), { adapter: r, query: n, open: i } = t, [o, s] = ve(null);
  let a, l;
  e[0] !== i ? (a = () => {
    i || s(null);
  }, l = [i], e[0] = i, e[1] = a, e[2] = l) : (a = e[1], l = e[2]), Q(a, l);
  let c;
  e: {
    if (!i || !r) {
      let N;
      e[3] === Symbol.for("react.memo_cache_sentinel") ? (N = [], e[3] = N) : N = e[3], c = N;
      break e;
    }
    let M;
    e[4] !== r ? (M = r.categories(), e[4] = r, e[5] = M) : M = e[5], c = M;
  }
  const d = c, u = i ? o : null;
  let h;
  e: {
    if (!u || !r) {
      let N;
      e[6] === Symbol.for("react.memo_cache_sentinel") ? (N = [], e[6] = N) : N = e[6], h = N;
      break e;
    }
    let M;
    e[7] !== r || e[8] !== u ? (M = r.categoryItems(u), e[7] = r, e[8] = u, e[9] = M) : M = e[9], h = M;
  }
  const p = h;
  let m;
  e: {
    if (!i || !r || u) {
      m = null;
      break e;
    }
    if (!n && d.length > 0) {
      m = null;
      break e;
    }
    if (r.search) {
      let N;
      e[10] !== r || e[11] !== n ? (N = r.search(n), e[10] = r, e[11] = n, e[12] = N) : N = e[12], m = N;
      break e;
    }
    let M;
    if (e[13] !== r || e[14] !== d || e[15] !== n) {
      M = [];
      const N = n.toLowerCase();
      for (const $ of d)
        for (const O of r.categoryItems($.id))
          Na(O, N) && M.push(O);
      e[13] = r, e[14] = d, e[15] = n, e[16] = M;
    } else
      M = e[16];
    m = M;
  }
  const g = m, v = g !== null;
  let b;
  e: {
    if (v) {
      let N;
      e[17] === Symbol.for("react.memo_cache_sentinel") ? (N = [], e[17] = N) : N = e[17], b = N;
      break e;
    }
    if (!n) {
      b = d;
      break e;
    }
    let M;
    if (e[18] !== d || e[19] !== n) {
      const N = n.toLowerCase();
      M = d.filter(($) => $.label.toLowerCase().includes(N)), e[18] = d, e[19] = n, e[20] = M;
    } else
      M = e[20];
    b = M;
  }
  const k = b;
  let x;
  e: {
    if (v) {
      let N;
      e[21] !== g ? (N = g ?? [], e[21] = g, e[22] = N) : N = e[22], x = N;
      break e;
    }
    if (!n) {
      x = p;
      break e;
    }
    let M;
    if (e[23] !== p || e[24] !== n) {
      const N = n.toLowerCase();
      M = p.filter(($) => Na($, N)), e[23] = p, e[24] = n, e[25] = M;
    } else
      M = e[25];
    x = M;
  }
  const T = x;
  let E;
  e: {
    if (v) {
      let M;
      e[26] !== g ? (M = g ?? [], e[26] = g, e[27] = M) : M = e[27], E = M;
      break e;
    }
    if (u) {
      E = T;
      break e;
    }
    E = k;
  }
  const y = E;
  let P;
  e[28] === Symbol.for("react.memo_cache_sentinel") ? (P = (M) => {
    s(M);
  }, e[28] = P) : P = e[28];
  const R = Fe(P);
  let D;
  e[29] === Symbol.for("react.memo_cache_sentinel") ? (D = () => {
    s(null);
  }, e[29] = D) : D = e[29];
  const _ = Fe(D);
  let I;
  return e[30] !== u || e[31] !== k || e[32] !== T || e[33] !== _ || e[34] !== v || e[35] !== y || e[36] !== R ? (I = {
    categories: k,
    items: T,
    isSearchMode: v,
    activeCategoryId: u,
    navigableList: y,
    selectCategory: R,
    goBack: _
  }, e[30] = u, e[31] = k, e[32] = T, e[33] = _, e[34] = v, e[35] = y, e[36] = R, e[37] = I) : I = e[37], I;
}, px = le(hx), mx = (t) => {
  const e = A(15), { behavior: r, trigger: n, aui: i, triggerChar: o, setCursorPosition: s, onSelected: a } = t, l = Z(null);
  let c;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (c = (v) => (l.current = v, () => {
    l.current === v && (l.current = null);
  }), e[0] = c) : c = e[0];
  const d = Fe(c);
  let u;
  e[1] !== i || e[2] !== r || e[3] !== a || e[4] !== n || e[5] !== o ? (u = (v) => {
    var E, y;
    if (!n || !r)
      return;
    if ((E = l.current) != null && E.call(l, v)) {
      a();
      return;
    }
    const b = i.composer().getState().text, k = b.slice(0, n.offset), x = b.slice(n.offset + o.length + n.query.length), T = () => {
      const P = r.formatter.serialize(v);
      i.composer().setText(k + P + (x.startsWith(" ") ? x : ` ${x}`));
    };
    r.kind === "directive" ? (T(), (y = r.onInserted) == null || y.call(r, v)) : (r.removeOnExecute ? i.composer().setText(k + (x.startsWith(" ") ? x.slice(1) : x)) : T(), r.onExecute(v)), a();
  }, e[1] = i, e[2] = r, e[3] = a, e[4] = n, e[5] = o, e[6] = u) : u = e[6];
  const h = Fe(u);
  let p;
  e[7] !== a || e[8] !== s || e[9] !== n ? (p = () => {
    a(), n && s(n.offset);
  }, e[7] = a, e[8] = s, e[9] = n, e[10] = p) : p = e[10];
  const m = Fe(p);
  let g;
  return e[11] !== m || e[12] !== d || e[13] !== h ? (g = {
    selectItem: h,
    close: m,
    registerSelectItemOverride: d
  }, e[11] = m, e[12] = d, e[13] = h, e[14] = g) : g = e[14], g;
}, fx = le(mx), gx = (t) => {
  const e = A(46), { adapter: r, text: n, triggerChar: i, behavior: o, aui: s, popoverId: a, isLoading: l } = t;
  let c;
  e[0] !== n || e[1] !== i ? (c = lx({
    text: n,
    triggerChar: i
  }), e[0] = n, e[1] = i, e[2] = c) : c = e[2];
  const d = Ne(c), u = d.trigger !== null && r !== void 0 && o !== void 0;
  let h;
  e[3] !== r || e[4] !== d.query || e[5] !== u ? (h = px({
    adapter: r,
    query: d.query,
    open: u
  }), e[3] = r, e[4] = d.query, e[5] = u, e[6] = h) : h = e[6];
  const p = Ne(h);
  let m;
  e[7] !== p ? (m = () => {
    p.goBack();
  }, e[7] = p, e[8] = m) : m = e[8];
  const g = Fe(m);
  let v;
  e[9] !== s || e[10] !== o || e[11] !== d.setCursorPosition || e[12] !== d.trigger || e[13] !== g || e[14] !== i ? (v = fx({
    behavior: o,
    trigger: d.trigger,
    aui: s,
    triggerChar: i,
    setCursorPosition: d.setCursorPosition,
    onSelected: g
  }), e[9] = s, e[10] = o, e[11] = d.setCursorPosition, e[12] = d.trigger, e[13] = g, e[14] = i, e[15] = v) : v = e[15];
  const b = Ne(v);
  let k;
  e[16] !== d.query || e[17] !== p.activeCategoryId || e[18] !== p.goBack || e[19] !== p.isSearchMode || e[20] !== p.navigableList || e[21] !== p.selectCategory || e[22] !== u || e[23] !== a || e[24] !== b.close || e[25] !== b.selectItem ? (k = dx({
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
  const x = Ne(k);
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
}, bx = le(gx), Vo = Ge(null), xr = () => {
  const t = We(Vo);
  if (!t)
    throw new Error("useTriggerPopoverScopeContext must be used within ComposerPrimitive.TriggerPopover");
  return t;
}, vx = () => We(Vo), kd = Ge(null), _d = () => {
  const t = We(kd);
  if (!t)
    throw new Error("TriggerPopover.Directive / TriggerPopover.Action must be rendered inside ComposerPrimitive.TriggerPopover");
  return t;
}, Sd = te((t, e) => {
  const r = A(61);
  let n, i, o, s, a, l;
  r[0] !== t ? ({ char: o, adapter: n, isLoading: l, "aria-label": i, children: s, ...a } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s, r[5] = a, r[6] = l) : (n = r[1], i = r[2], o = r[3], s = r[4], a = r[5], l = r[6]);
  const c = l === void 0 ? !1 : l, d = J(), u = L(wx), h = mo(), p = Z(null), [m, g] = ve(null), v = Z(0);
  let b;
  r[7] !== o ? (b = (pe) => (v.current = v.current + 1, {}.NODE_ENV !== "production" && v.current > 1 && console.warn(`[assistant-ui] TriggerPopover "${o}" received more than one behavior child. Exactly one <TriggerPopover.Directive> or <TriggerPopover.Action> is allowed per TriggerPopover; the last registration wins.`), p.current = pe, g(pe), () => {
    v.current = Math.max(0, v.current - 1), p.current === pe && (p.current = null, g(null));
  }), r[7] = o, r[8] = b) : b = r[8];
  const k = b;
  let x;
  r[9] !== k ? (x = { register: k }, r[9] = k, r[10] = x) : x = r[10];
  const T = x, E = m ?? void 0;
  let y;
  r[11] !== n || r[12] !== d || r[13] !== o || r[14] !== c || r[15] !== h || r[16] !== E || r[17] !== u ? (y = bx({
    adapter: n,
    text: u,
    triggerChar: o,
    behavior: E,
    aui: d,
    popoverId: h,
    isLoading: c
  }), r[11] = n, r[12] = d, r[13] = o, r[14] = c, r[15] = h, r[16] = E, r[17] = u, r[18] = y) : y = r[18];
  const P = Ne(y);
  let R;
  r[19] !== P ? (R = () => P, r[19] = P, r[20] = R) : R = r[20];
  const D = Fe(R), _ = Uo();
  let I;
  r[21] !== m || r[22] !== o || r[23] !== D || r[24] !== _ ? (I = () => _.register({
    char: o,
    ...m ? { behavior: m } : {},
    resource: D()
  }), r[21] = m, r[22] = o, r[23] = D, r[24] = _, r[25] = I) : I = r[25];
  let M;
  r[26] !== m || r[27] !== o || r[28] !== _ ? (M = [
    _,
    o,
    m
  ], r[26] = m, r[27] = o, r[28] = _, r[29] = M) : M = r[29], Q(I, M);
  const N = Jn();
  let $;
  r[30] !== D || r[31] !== N ? ($ = () => {
    if (N)
      return N.register(D());
  }, r[30] = D, r[31] = N, r[32] = $) : $ = r[32];
  let O;
  r[33] !== N ? (O = [N], r[33] = N, r[34] = O) : O = r[34], Q($, O);
  const j = m !== null && P.open, G = ex();
  let B, W;
  r[35] !== G || r[36] !== o || r[37] !== j ? (B = () => {
    if (j)
      return () => {
        G.setActiveAria(o, null);
      };
  }, W = [
    G,
    o,
    j
  ], r[35] = G, r[36] = o, r[37] = j, r[38] = B, r[39] = W) : (B = r[38], W = r[39]), Q(B, W);
  let w, ie;
  r[40] !== G || r[41] !== o || r[42] !== j || r[43] !== h || r[44] !== P.highlightedItemId ? (w = () => {
    j && G.setActiveAria(o, {
      popoverId: h,
      highlightedItemId: P.highlightedItemId
    });
  }, ie = [
    G,
    o,
    h,
    j,
    P.highlightedItemId
  ], r[40] = G, r[41] = o, r[42] = j, r[43] = h, r[44] = P.highlightedItemId, r[45] = w, r[46] = ie) : (w = r[45], ie = r[46]), Q(w, ie);
  let de;
  r[47] !== i || r[48] !== s || r[49] !== e || r[50] !== j || r[51] !== h || r[52] !== a || r[53] !== P.highlightedItemId ? (de = j ? /* @__PURE__ */ f(he.div, {
    role: "listbox",
    id: h,
    "aria-label": i ?? "Suggestions",
    "aria-activedescendant": P.highlightedItemId,
    "data-state": "open",
    ...a,
    ref: e,
    children: s
  }) : s, r[47] = i, r[48] = s, r[49] = e, r[50] = j, r[51] = h, r[52] = a, r[53] = P.highlightedItemId, r[54] = de) : de = r[54];
  let S;
  r[55] !== P || r[56] !== de ? (S = /* @__PURE__ */ f(Vo.Provider, {
    value: P,
    children: de
  }), r[55] = P, r[56] = de, r[57] = S) : S = r[57];
  let xe;
  return r[58] !== T || r[59] !== S ? (xe = /* @__PURE__ */ f(kd.Provider, {
    value: T,
    children: S
  }), r[58] = T, r[59] = S, r[60] = xe) : xe = r[60], xe;
});
Sd.displayName = "ComposerPrimitive.TriggerPopover";
function wx(t) {
  return t.composer.text;
}
const Cd = () => {
  const t = A(2), { disabled: e, send: r } = py();
  let n;
  t[0] !== r ? (n = () => r(), t[0] = r, t[1] = n) : n = t[1];
  const i = n;
  return e ? null : i;
}, yx = rt("ComposerPrimitive.Send", Cd), Td = te((t, e) => {
  const r = A(12);
  let n, i;
  r[0] !== t ? ({ onSubmit: n, ...i } = t, r[0] = t, r[1] = n, r[2] = i) : (n = r[1], i = r[2]);
  const o = Cd();
  let s;
  r[3] !== o ? (s = (d) => {
    d.preventDefault(), o && o();
  }, r[3] = o, r[4] = s) : s = r[4];
  const a = s;
  let l;
  r[5] !== a || r[6] !== n ? (l = ye(n, a), r[5] = a, r[6] = n, r[7] = l) : l = r[7];
  let c;
  return r[8] !== e || r[9] !== i || r[10] !== l ? (c = /* @__PURE__ */ f(he.form, {
    ...i,
    ref: e,
    onSubmit: l
  }), r[8] = e, r[9] = i, r[10] = l, r[11] = c) : c = r[11], c;
});
Td.displayName = "ComposerPrimitive.Root";
const Id = (t) => {
  const e = A(4), r = Vt(t), n = Kt(xx);
  let i, o;
  e[0] !== r || e[1] !== n ? (i = () => n(r), o = [n, r], e[0] = r, e[1] = n, e[2] = i, e[3] = o) : (i = e[2], o = e[3]), Q(i, o);
};
function xx(t) {
  return t.onScrollToBottom;
}
const kx = () => !1, _x = () => {
}, Ed = (t) => {
  const e = A(4);
  let r;
  e[0] !== t ? (r = (o) => {
    if (typeof window > "u" || t === null || !window.matchMedia)
      return _x;
    const s = window.matchMedia(t);
    return s.addEventListener("change", o), () => s.removeEventListener("change", o);
  }, e[0] = t, e[1] = r) : r = e[1];
  const n = r;
  let i;
  return e[2] !== t ? (i = () => typeof window > "u" || t === null || !window.matchMedia ? !1 : window.matchMedia(t).matches, e[2] = t, e[3] = i) : i = e[3], vr(n, i, kx);
};
function Sx() {
  return L(Cx);
}
function Cx(t) {
  return t.composer.isEditing ? t.composer.text : "";
}
function Tx(t) {
  return !!L(Ix) || !!t;
}
function Ix(t) {
  var e;
  return t.thread.isDisabled || ((e = t.composer.dictation) == null ? void 0 : e.inputDisabled);
}
function Ex() {
  const t = A(4), e = ix();
  if (!e) {
    let n;
    return t[0] === Symbol.for("react.memo_cache_sentinel") ? (n = {}, t[0] = n) : n = t[0], n;
  }
  let r;
  return t[1] !== e.highlightedItemId || t[2] !== e.popoverId ? (r = {
    "aria-controls": e.popoverId,
    "aria-expanded": !0,
    "aria-haspopup": "listbox",
    "aria-activedescendant": e.highlightedItemId
  }, t[1] = e.highlightedItemId, t[2] = e.popoverId, t[3] = r) : r = t[3], r;
}
function Yi() {
  return Yi = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        ({}).hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, Yi.apply(null, arguments);
}
function Ax(t, e) {
  if (t == null)
    return {};
  var r = {};
  for (var n in t)
    if ({}.hasOwnProperty.call(t, n)) {
      if (e.indexOf(n) !== -1)
        continue;
      r[n] = t[n];
    }
  return r;
}
var Rx = Fn, Px = function(e) {
  var r = _e.useRef(e);
  return Rx(function() {
    r.current = e;
  }), r;
}, za = function(e, r) {
  if (typeof e == "function") {
    e(r);
    return;
  }
  e.current = r;
}, Mx = function(e, r) {
  var n = _e.useRef();
  return _e.useCallback(function(i) {
    e.current = i, n.current && za(n.current, null), n.current = r, r && za(r, i);
  }, [r]);
}, Oa = {
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
}, Dx = function(e) {
  Object.keys(Oa).forEach(function(r) {
    e.style.setProperty(r, Oa[r], "important");
  });
}, La = Dx, Pe = null, $a = function(e, r) {
  var n = e.scrollHeight;
  return r.sizingStyle.boxSizing === "border-box" ? n + r.borderSize : n - r.paddingSize;
};
function Nx(t, e, r, n) {
  r === void 0 && (r = 1), n === void 0 && (n = 1 / 0), Pe || (Pe = document.createElement("textarea"), Pe.setAttribute("tabindex", "-1"), Pe.setAttribute("aria-hidden", "true"), La(Pe)), Pe.parentNode === null && document.body.appendChild(Pe);
  var i = t.paddingSize, o = t.borderSize, s = t.sizingStyle, a = s.boxSizing;
  Object.keys(s).forEach(function(h) {
    var p = h;
    Pe.style[p] = s[p];
  }), La(Pe), Pe.value = e;
  var l = $a(Pe, t);
  Pe.value = e, l = $a(Pe, t), Pe.value = "x";
  var c = Pe.scrollHeight - i, d = c * r;
  a === "border-box" && (d = d + i + o), l = Math.max(d, l);
  var u = c * n;
  return a === "border-box" && (u = u + i + o), l = Math.min(u, l), [l, c];
}
var Ba = function() {
}, zx = function(e, r) {
  return e.reduce(function(n, i) {
    return n[i] = r[i], n;
  }, {});
}, Ox = [
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
], Lx = !!document.documentElement.currentStyle, $x = function(e) {
  var r = window.getComputedStyle(e);
  if (r === null)
    return null;
  var n = zx(Ox, r), i = n.boxSizing;
  if (i === "")
    return null;
  Lx && i === "border-box" && (n.width = parseFloat(n.width) + parseFloat(n.borderRightWidth) + parseFloat(n.borderLeftWidth) + parseFloat(n.paddingRight) + parseFloat(n.paddingLeft) + "px");
  var o = parseFloat(n.paddingBottom) + parseFloat(n.paddingTop), s = parseFloat(n.borderBottomWidth) + parseFloat(n.borderTopWidth);
  return {
    sizingStyle: n,
    paddingSize: o,
    borderSize: s
  };
}, Bx = $x;
function qo(t, e, r) {
  var n = Px(r);
  Fn(function() {
    var i = function(s) {
      return n.current(s);
    };
    if (t)
      return t.addEventListener(e, i), function() {
        return t.removeEventListener(e, i);
      };
  }, []);
}
var Fx = function(e, r) {
  qo(document.body, "reset", function(n) {
    e.current.form === n.target && r(n);
  });
}, Ux = function(e) {
  qo(window, "resize", e);
}, jx = function(e) {
  qo(document.fonts, "loadingdone", e);
}, Vx = ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"], qx = function(e, r) {
  var n = e.cacheMeasurements, i = e.maxRows, o = e.minRows, s = e.onChange, a = s === void 0 ? Ba : s, l = e.onHeightChange, c = l === void 0 ? Ba : l, d = Ax(e, Vx), u = d.value !== void 0, h = lt(null), p = Mx(h, r), m = lt(0), g = lt(), v = function() {
    var x = h.current, T = n && g.current ? g.current : Bx(x);
    if (T) {
      g.current = T;
      var E = Nx(T, x.value || x.placeholder || "x", o, i), y = E[0], P = E[1];
      m.current !== y && (m.current = y, x.style.setProperty("height", y + "px", "important"), c(y, {
        rowHeight: P
      }));
    }
  }, b = function(x) {
    u || v(), a(x);
  };
  return Fn(v), Fx(h, function() {
    if (!u) {
      var k = h.current.value;
      requestAnimationFrame(function() {
        var x = h.current;
        x && k !== x.value && v();
      });
    }
  }), Ux(v), jx(v), /* @__PURE__ */ St("textarea", Yi({}, d, {
    onChange: b,
    ref: p
  }));
}, Hx = /* @__PURE__ */ te(qx);
const Gx = "(pointer: coarse) and (not (any-pointer: fine))", Ad = te(({ autoFocus: t = !1, asChild: e, render: r, disabled: n, onChange: i, onKeyDown: o, onPaste: s, onSelect: a, submitOnEnter: l, submitMode: c, cancelOnEscape: d = !0, unstable_focusOnRunStart: u = !0, unstable_focusOnScrollToBottom: h = !0, unstable_focusOnThreadSwitched: p = !0, unstable_insertNewlineOnTouchEnter: m = !1, addAttachmentOnPaste: g = !0, ...v }, b) => {
  const k = J(), x = Jn(), T = c ?? (l === !1 ? "none" : "enter"), E = Ed(m ? Gx : null), y = m && E && T === "enter" ? "none" : T, P = Sx(), R = Tx(n), D = Z(null), _ = Yt(b, D), I = Z(!1);
  cd((B) => {
    var w;
    if (!((w = D.current) != null && w.contains(B.target)))
      return;
    if (x) {
      for (const ie of x.getPlugins())
        if (ie.handleKeyDown(B))
          return;
    }
    if (!d)
      return;
    const W = k.composer();
    W.getState().canCancel && (W.cancel(), B.preventDefault());
  });
  const M = (B) => {
    var W, w;
    if (!R && !B.nativeEvent.isComposing) {
      if (x) {
        for (const ie of x.getPlugins())
          if (ie.handleKeyDown(B))
            return;
      }
      if (B.key === "Enter") {
        const ie = k.thread().getState(), de = ie.capabilities.queue;
        if (B.shiftKey && (B.ctrlKey || B.metaKey) && de && T !== "none" && k.composer().getState().canSend) {
          B.preventDefault(), k.composer().send({ steer: !0 });
          return;
        }
        if (B.shiftKey || ie.isRunning && !de)
          return;
        let S = !1;
        y === "ctrlEnter" ? S = B.ctrlKey || B.metaKey : y === "enter" && (S = !0), S && (B.preventDefault(), (w = (W = D.current) == null ? void 0 : W.closest("form")) == null || w.requestSubmit());
      }
    }
  }, N = async (B) => {
    var ie;
    if (!g)
      return;
    const W = k.thread().getState().capabilities, w = Array.from(((ie = B.clipboardData) == null ? void 0 : ie.files) || []);
    if (W.attachments && w.length > 0)
      try {
        B.preventDefault(), await Promise.all(w.map((de) => k.composer().addAttachment(de)));
      } catch (de) {
        console.error("Error adding attachment:", de);
      }
  }, $ = t && !R, O = kt(() => {
    const B = D.current;
    !B || !$ || (B.focus({ preventScroll: !0 }), B.setSelectionRange(B.value.length, B.value.length));
  }, [$]);
  Q(() => O(), [O]), Id(() => {
    k.composer().getState().type === "thread" && h && O();
  }), Q(() => {
    if (!(k.composer().getState().type !== "thread" || !u))
      return k.on("thread.runStart", O);
  }, [
    u,
    O,
    k
  ]), Q(() => {
    if (!(k.composer().getState().type !== "thread" || !p))
      return k.on("threadListItem.switchedTo", O);
  }, [
    p,
    O,
    k
  ]);
  const j = Ex(), G = {
    name: "input",
    value: P,
    ...v,
    ...j,
    ref: _,
    disabled: R,
    onChange: ye(i, (B) => {
      if (!k.composer().getState().isEditing)
        return;
      const W = B.nativeEvent.isComposing === !0;
      I.current && !W && (I.current = !1);
      const w = W || I.current;
      if (Ps(() => {
        k.composer().setText(B.target.value);
      }), w)
        return;
      const ie = B.target.selectionStart ?? B.target.value.length;
      if (x)
        for (const de of x.getPlugins())
          de.setCursorPosition(ie);
    }),
    onKeyDown: ye(o, M),
    onCompositionStart: ye(v.onCompositionStart, () => {
      I.current = !0;
    }),
    onCompositionEnd: ye(v.onCompositionEnd, (B) => {
      if (I.current = !1, !k.composer().getState().isEditing)
        return;
      const W = B.target;
      Ps(() => {
        k.composer().setText(W.value);
      });
      const w = W.selectionStart ?? W.value.length;
      if (x)
        for (const ie of x.getPlugins())
          ie.setCursorPosition(w);
    }),
    onSelect: ye(a, (B) => {
      if (I.current)
        return;
      const W = B.target, w = W.selectionStart ?? W.value.length;
      if (x)
        for (const ie of x.getPlugins())
          ie.setCursorPosition(w);
    }),
    onPaste: ye(s, N)
  };
  if (r && Ct(r)) {
    const B = v.children !== void 0 ? v.children : r.props.children;
    return /* @__PURE__ */ f(Nn, {
      ...G,
      children: Ft(r, void 0, B)
    });
  }
  return /* @__PURE__ */ f(e ? Nn : Hx, { ...G });
});
Ad.displayName = "ComposerPrimitive.Input";
const Wx = () => {
  const { disabled: t, cancel: e } = fy();
  return t ? null : e;
}, Kx = rt("ComposerPrimitive.Cancel", Wx), Qx = (t) => {
  const e = A(6);
  let r;
  e[0] !== t ? (r = t === void 0 ? {} : t, e[0] = t, e[1] = r) : r = e[1];
  const { multiple: n } = r, i = n === void 0 ? !0 : n, { disabled: o, addAttachment: s } = wy(), a = J();
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
}, Yx = rt("ComposerPrimitive.AddAttachment", Qx, ["multiple"]), Rd = te((t, e) => {
  const r = A(30), { disabled: n, asChild: i, render: o, children: s, ...a } = t, l = i === void 0 ? !1 : i, [c, d] = ve(!1), u = J();
  let h;
  r[0] !== n ? (h = (N) => {
    n || (N.preventDefault(), d(!0));
  }, r[0] = n, r[1] = h) : h = r[1];
  const p = h;
  let m;
  r[2] !== n || r[3] !== c ? (m = (N) => {
    n || (N.preventDefault(), c || d(!0));
  }, r[2] = n, r[3] = c, r[4] = m) : m = r[4];
  const g = m;
  let v;
  r[5] !== n ? (v = (N) => {
    if (n)
      return;
    N.preventDefault();
    const $ = N.relatedTarget;
    $ && N.currentTarget.contains($) || d(!1);
  }, r[5] = n, r[6] = v) : v = r[6];
  const b = v;
  let k;
  r[7] !== u || r[8] !== n ? (k = async (N) => {
    if (n)
      return;
    N.preventDefault(), d(!1);
    const $ = Array.from(N.dataTransfer.files);
    await Promise.all($.map(async (O) => {
      try {
        await u.composer().addAttachment(O);
      } catch (j) {
        console.error("Failed to add attachment:", j);
      }
    }));
  }, r[7] = u, r[8] = n, r[9] = k) : k = r[9];
  const x = k;
  let T;
  r[10] !== c ? (T = c ? { "data-dragging": "true" } : null, r[10] = c, r[11] = T) : T = r[11];
  const E = ye(a.onDragEnterCapture, p), y = ye(a.onDragOverCapture, g), P = ye(a.onDragLeaveCapture, b), R = ye(a.onDropCapture, x);
  let D;
  r[12] !== e || r[13] !== a || r[14] !== R || r[15] !== T || r[16] !== E || r[17] !== y || r[18] !== P ? (D = {
    ...T,
    ...a,
    onDragEnterCapture: E,
    onDragOverCapture: y,
    onDragLeaveCapture: P,
    onDropCapture: R,
    ref: e
  }, r[12] = e, r[13] = a, r[14] = R, r[15] = T, r[16] = E, r[17] = y, r[18] = P, r[19] = D) : D = r[19];
  const _ = D;
  if (o && Ct(o)) {
    const N = s !== void 0 ? s : o.props.children;
    let $;
    r[20] !== o || r[21] !== N ? ($ = Ft(o, void 0, N), r[20] = o, r[21] = N, r[22] = $) : $ = r[22];
    let O;
    return r[23] !== _ || r[24] !== $ ? (O = /* @__PURE__ */ f(Nn, {
      ..._,
      children: $
    }), r[23] = _, r[24] = $, r[25] = O) : O = r[25], O;
  }
  const I = l ? Nn : "div";
  let M;
  return r[26] !== I || r[27] !== s || r[28] !== _ ? (M = /* @__PURE__ */ f(I, {
    ..._,
    children: s
  }), r[26] = I, r[27] = s, r[28] = _, r[29] = M) : M = r[29], M;
});
Rd.displayName = "ComposerPrimitive.AttachmentDropzone";
const Jx = () => {
  const { disabled: t, startDictation: e } = by();
  return t ? null : e;
}, Xx = rt("ComposerPrimitive.Dictate", Jx), Zx = () => {
  const t = A(2), e = J(), r = L(t1);
  let n;
  t[0] !== e ? (n = () => {
    e.composer().stopDictation();
  }, t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  return r ? i : null;
}, e1 = rt("ComposerPrimitive.StopDictation", Zx);
function t1(t) {
  return t.composer.dictation != null;
}
const Pd = te((t, e) => {
  const r = A(7);
  let n, i;
  r[0] !== t ? ({ children: n, ...i } = t, r[0] = t, r[1] = n, r[2] = i) : (n = r[1], i = r[2]);
  const o = L(r1);
  if (!o)
    return null;
  const s = n ?? o;
  let a;
  return r[3] !== e || r[4] !== i || r[5] !== s ? (a = /* @__PURE__ */ f(he.span, {
    ...i,
    ref: e,
    children: s
  }), r[3] = e, r[4] = i, r[5] = s, r[6] = a) : a = r[6], a;
});
Pd.displayName = "ComposerPrimitive.DictationTranscript";
function r1(t) {
  var e;
  return (e = t.composer.dictation) == null ? void 0 : e.transcript;
}
const Md = te((t, e) => {
  const r = A(3);
  if (!L(n1))
    return null;
  let n;
  return r[0] !== e || r[1] !== t ? (n = /* @__PURE__ */ f(he.div, {
    ...t,
    ref: e
  }), r[0] = e, r[1] = t, r[2] = n) : n = r[2], n;
});
Md.displayName = "ComposerPrimitive.Quote";
const Dd = te((t, e) => {
  const r = A(7);
  let n, i;
  r[0] !== t ? ({ children: n, ...i } = t, r[0] = t, r[1] = n, r[2] = i) : (n = r[1], i = r[2]);
  const o = L(i1);
  if (!o)
    return null;
  const s = n ?? o;
  let a;
  return r[3] !== e || r[4] !== i || r[5] !== s ? (a = /* @__PURE__ */ f(he.span, {
    ...i,
    ref: e,
    children: s
  }), r[3] = e, r[4] = i, r[5] = s, r[6] = a) : a = r[6], a;
});
Dd.displayName = "ComposerPrimitive.QuoteText";
const Nd = te((t, e) => {
  const r = A(12);
  let n, i;
  r[0] !== t ? ({ onClick: n, ...i } = t, r[0] = t, r[1] = n, r[2] = i) : (n = r[1], i = r[2]);
  const o = J();
  let s;
  r[3] !== o ? (s = () => {
    o.composer().setQuote(void 0);
  }, r[3] = o, r[4] = s) : s = r[4];
  const a = s;
  let l;
  r[5] !== a || r[6] !== n ? (l = ye(n, a), r[5] = a, r[6] = n, r[7] = l) : l = r[7];
  let c;
  return r[8] !== e || r[9] !== i || r[10] !== l ? (c = /* @__PURE__ */ f(he.button, {
    type: "button",
    ...i,
    ref: e,
    onClick: l
  }), r[8] = e, r[9] = i, r[10] = l, r[11] = c) : c = r[11], c;
});
Nd.displayName = "ComposerPrimitive.QuoteDismiss";
function n1(t) {
  return t.composer.quote;
}
function i1(t) {
  var e;
  return (e = t.composer.quote) == null ? void 0 : e.text;
}
const zd = te((t, e) => {
  const r = A(12);
  let n, i, o;
  r[0] !== t ? ({ children: i, "aria-label": n, ...o } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o) : (n = r[1], i = r[2], o = r[3]);
  const { categories: s, activeCategoryId: a, isSearchMode: l, open: c } = xr();
  if (!c || a || l)
    return null;
  const d = n ?? "Categories";
  let u;
  r[4] !== s || r[5] !== i ? (u = i(s), r[4] = s, r[5] = i, r[6] = u) : u = r[6];
  let h;
  return r[7] !== e || r[8] !== o || r[9] !== d || r[10] !== u ? (h = /* @__PURE__ */ f(he.div, {
    role: "group",
    "aria-label": d,
    ...o,
    ref: e,
    children: u
  }), r[7] = e, r[8] = o, r[9] = d, r[10] = u, r[11] = h) : h = r[11], h;
});
zd.displayName = "ComposerPrimitive.TriggerPopoverCategories";
const Od = te((t, e) => {
  const r = A(30);
  let n, i, o, s;
  r[0] !== t ? ({ categoryId: n, onClick: i, onMouseMove: o, ...s } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s) : (n = r[1], i = r[2], o = r[3], s = r[4]);
  const { selectCategory: a, highlightIndex: l, categories: c, highlightedIndex: d, activeCategoryId: u, isSearchMode: h, popoverId: p } = xr();
  let m;
  r[5] !== n || r[6] !== a ? (m = () => {
    a(n);
  }, r[5] = n, r[6] = a, r[7] = m) : m = r[7];
  const g = m;
  let v;
  if (r[8] !== c || r[9] !== n) {
    let _;
    r[11] !== n ? (_ = (I) => I.id === n, r[11] = n, r[12] = _) : _ = r[12], v = c.findIndex(_), r[8] = c, r[9] = n, r[10] = v;
  } else
    v = r[10];
  const b = v, k = !u && !h && b === d;
  let x;
  r[13] !== b || r[14] !== l ? (x = () => {
    l(b);
  }, r[13] = b, r[14] = l, r[15] = x) : x = r[15];
  const T = x, E = `${p}-option-${n}`, y = k ? "" : void 0;
  let P;
  r[16] !== g || r[17] !== i ? (P = ye(i, g), r[16] = g, r[17] = i, r[18] = P) : P = r[18];
  let R;
  r[19] !== T || r[20] !== o ? (R = ye(o, T), r[19] = T, r[20] = o, r[21] = R) : R = r[21];
  let D;
  return r[22] !== e || r[23] !== k || r[24] !== s || r[25] !== E || r[26] !== y || r[27] !== P || r[28] !== R ? (D = /* @__PURE__ */ f(he.button, {
    type: "button",
    role: "option",
    id: E,
    "aria-selected": k,
    "data-highlighted": y,
    ...s,
    ref: e,
    onClick: P,
    onMouseMove: R
  }), r[22] = e, r[23] = k, r[24] = s, r[25] = E, r[26] = y, r[27] = P, r[28] = R, r[29] = D) : D = r[29], D;
});
Od.displayName = "ComposerPrimitive.TriggerPopoverCategoryItem";
const Ld = te((t, e) => {
  const r = A(12);
  let n, i, o;
  r[0] !== t ? ({ children: i, "aria-label": n, ...o } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o) : (n = r[1], i = r[2], o = r[3]);
  const { items: s, activeCategoryId: a, isSearchMode: l, open: c } = xr();
  if (!c || !a && !l)
    return null;
  const d = n ?? "Items";
  let u;
  r[4] !== i || r[5] !== s ? (u = i(s), r[4] = i, r[5] = s, r[6] = u) : u = r[6];
  let h;
  return r[7] !== e || r[8] !== o || r[9] !== d || r[10] !== u ? (h = /* @__PURE__ */ f(he.div, {
    role: "group",
    "aria-label": d,
    ...o,
    ref: e,
    children: u
  }), r[7] = e, r[8] = o, r[9] = d, r[10] = u, r[11] = h) : h = r[11], h;
});
Ld.displayName = "ComposerPrimitive.TriggerPopoverItems";
const $d = te((t, e) => {
  const r = A(30);
  let n, i, o, s, a;
  r[0] !== t ? ({ item: i, index: n, onClick: o, onMouseMove: s, ...a } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s, r[5] = a) : (n = r[1], i = r[2], o = r[3], s = r[4], a = r[5]);
  const { selectItem: l, highlightIndex: c, items: d, highlightedIndex: u, activeCategoryId: h, isSearchMode: p, popoverId: m } = xr();
  let g;
  r[6] !== i || r[7] !== l ? (g = () => {
    l(i);
  }, r[6] = i, r[7] = l, r[8] = g) : g = r[8];
  const v = g;
  let b;
  r[9] !== n || r[10] !== i.id || r[11] !== d ? (b = n ?? d.findIndex((I) => I.id === i.id), r[9] = n, r[10] = i.id, r[11] = d, r[12] = b) : b = r[12];
  const k = b, x = (p || h !== null) && k === u;
  let T;
  r[13] !== c || r[14] !== k ? (T = () => {
    c(k);
  }, r[13] = c, r[14] = k, r[15] = T) : T = r[15];
  const E = T, y = `${m}-option-${i.id}`, P = x ? "" : void 0;
  let R;
  r[16] !== v || r[17] !== o ? (R = ye(o, v), r[16] = v, r[17] = o, r[18] = R) : R = r[18];
  let D;
  r[19] !== E || r[20] !== s ? (D = ye(s, E), r[19] = E, r[20] = s, r[21] = D) : D = r[21];
  let _;
  return r[22] !== e || r[23] !== x || r[24] !== a || r[25] !== y || r[26] !== P || r[27] !== R || r[28] !== D ? (_ = /* @__PURE__ */ f(he.button, {
    type: "button",
    role: "option",
    id: y,
    "aria-selected": x,
    "data-highlighted": P,
    ...a,
    ref: e,
    onClick: R,
    onMouseMove: D
  }), r[22] = e, r[23] = x, r[24] = a, r[25] = y, r[26] = P, r[27] = R, r[28] = D, r[29] = _) : _ = r[29], _;
});
$d.displayName = "ComposerPrimitive.TriggerPopoverItem";
const Bd = te((t, e) => {
  const r = A(10);
  let n, i;
  r[0] !== t ? ({ onClick: n, ...i } = t, r[0] = t, r[1] = n, r[2] = i) : (n = r[1], i = r[2]);
  const { activeCategoryId: o, isSearchMode: s, goBack: a, open: l } = xr();
  if (!l || !o || s)
    return null;
  let c;
  r[3] !== a || r[4] !== n ? (c = ye(n, a), r[3] = a, r[4] = n, r[5] = c) : c = r[5];
  let d;
  return r[6] !== e || r[7] !== i || r[8] !== c ? (d = /* @__PURE__ */ f(he.button, {
    type: "button",
    ...i,
    ref: e,
    onClick: c
  }), r[6] = e, r[7] = i, r[8] = c, r[9] = d) : d = r[9], d;
});
Bd.displayName = "ComposerPrimitive.TriggerPopoverBack";
const Fd = ({ formatter: t, onExecute: e, removeOnExecute: r }) => {
  const { register: n } = _d(), i = Z(e);
  return i.current = e, Q(() => n({
    kind: "action",
    formatter: t ?? rd,
    onExecute: (o) => i.current(o),
    ...r !== void 0 ? { removeOnExecute: r } : {}
  }), [
    n,
    t,
    r
  ]), null;
};
Fd.displayName = "ComposerPrimitive.TriggerPopoverAction";
const Ud = ({ formatter: t, onInserted: e }) => {
  const { register: r } = _d(), n = Z(e);
  return n.current = e, Q(() => r({
    kind: "directive",
    formatter: t ?? rd,
    onInserted: (i) => {
      var o;
      return (o = n.current) == null ? void 0 : o.call(n, i);
    }
  }), [r, t]), null;
};
Ud.displayName = "ComposerPrimitive.TriggerPopoverDirective";
const o1 = Object.assign(Sd, {
  Directive: Ud,
  Action: Fd
});
var Lt = /* @__PURE__ */ Jt({
  AddAttachment: () => Yx,
  AttachmentByIndex: () => Ku,
  AttachmentDropzone: () => Rd,
  Attachments: () => Qu,
  Cancel: () => Kx,
  Dictate: () => Xx,
  DictationTranscript: () => Pd,
  If: () => ed,
  Input: () => Ad,
  Queue: () => Yu,
  Quote: () => Md,
  QuoteDismiss: () => Nd,
  QuoteText: () => Dd,
  Root: () => Td,
  Send: () => yx,
  StopDictation: () => e1,
  Unstable_TriggerPopover: () => o1,
  Unstable_TriggerPopoverBack: () => Bd,
  Unstable_TriggerPopoverCategories: () => zd,
  Unstable_TriggerPopoverCategoryItem: () => Od,
  Unstable_TriggerPopoverItem: () => $d,
  Unstable_TriggerPopoverItems: () => Ld,
  Unstable_TriggerPopoverRoot: () => xd,
  unstable_useTriggerPopoverRootContext: () => Uo,
  unstable_useTriggerPopoverRootContextOptional: () => jo,
  unstable_useTriggerPopoverScopeContext: () => xr,
  unstable_useTriggerPopoverScopeContextOptional: () => vx,
  unstable_useTriggerPopoverTriggers: () => tx,
  unstable_useTriggerPopoverTriggersOptional: () => nx
});
const jd = () => L(s1);
function s1(t) {
  if (t.part.type !== "text" && t.part.type !== "reasoning")
    throw new Error("MessagePartText can only be used inside text or reasoning message parts.");
  return t.part;
}
const Vd = Ge(null), a1 = (t) => ({ useSmoothStatus: mr(() => t) }), l1 = (t) => {
  const e = A(6), { children: r } = t;
  let n;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (n = { optional: !0 }, e[0] = n) : n = e[0];
  const i = qd(n), o = J();
  let s;
  e[1] !== o ? (s = () => a1(o.part().getState().status), e[1] = o, e[2] = s) : s = e[2];
  const [a] = ve(s);
  if (i)
    return r;
  let l;
  return e[3] !== r || e[4] !== a ? (l = /* @__PURE__ */ f(Vd.Provider, {
    value: a,
    children: r
  }), e[3] = r, e[4] = a, e[5] = l) : l = e[5], l;
}, c1 = (t) => {
  const e = te((r, n) => {
    const i = A(3), o = r;
    let s;
    return i[0] !== n || i[1] !== o ? (s = /* @__PURE__ */ f(l1, { children: /* @__PURE__ */ f(t, {
      ...o,
      ref: n
    }) }), i[0] = n, i[1] = o, i[2] = s) : s = i[2], s;
  });
  return e.displayName = t.displayName, e;
};
function qd(t) {
  const e = We(Vd);
  if (!(t != null && t.optional) && !e)
    throw new Error("This component must be used within a SmoothContextProvider.");
  return e;
}
const { useSmoothStatus: u1, useSmoothStatusStore: d1 } = nd(qd, "useSmoothStatus"), Hd = 250, Gd = 5;
var h1 = class {
  constructor(t, e) {
    C(this, "currentText");
    C(this, "setText");
    C(this, "animationFrameId", null);
    C(this, "lastUpdateTime", Date.now());
    C(this, "lastCommitTime", 0);
    C(this, "targetText", "");
    C(this, "drainMs", Hd);
    C(this, "maxCharIntervalMs", Gd);
    C(this, "maxCharsPerFrame", 1 / 0);
    C(this, "minCommitMs", 0);
    C(this, "animate", () => {
      const t = Date.now();
      let e = t - this.lastUpdateTime;
      const r = this.targetText.length - this.currentText.length, n = Math.min(this.maxCharIntervalMs, this.drainMs / r), i = Math.min(r, this.maxCharsPerFrame);
      let o = 0;
      for (; e >= n && o < i; )
        o++, e -= n;
      o === i && i === this.maxCharsPerFrame && (e = 0), o !== r ? this.animationFrameId = requestAnimationFrame(this.animate) : this.animationFrameId = null, o !== 0 && (this.currentText = this.targetText.slice(0, this.currentText.length + o), this.lastUpdateTime = t - e, (o === r || t - this.lastCommitTime >= this.minCommitMs) && (this.lastCommitTime = t, this.setText(this.currentText)));
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
const gi = Object.freeze({ type: "running" }), pn = (t, e) => t !== void 0 && t > 0 ? t : e, Wd = (t, e = !1) => {
  const { text: r } = t, n = Ed("(prefers-reduced-motion: reduce)"), i = typeof e == "object" && e !== null ? e : void 0, o = e !== !1 && e !== null && !n, s = pn(i == null ? void 0 : i.drainMs, Hd), a = pn(i == null ? void 0 : i.maxCharIntervalMs, Gd), l = pn(i == null ? void 0 : i.maxCharsPerFrame, 1 / 0), c = pn(i == null ? void 0 : i.minCommitMs, 0), [d, u] = ve(t.status.type === "running" ? "" : r), h = J(), p = L(() => h.part()), [m, g] = ve(p);
  (p !== m || !r.startsWith(d)) && (g(p), u(t.status.type === "running" ? "" : r));
  const v = d1({ optional: !0 }), b = Vt((T) => {
    if (u(T), v) {
      const E = d !== T || t.status.type === "running" ? gi : t.status;
      Dn(v).setState(E, !0);
    }
  });
  Q(() => {
    if (v) {
      const T = o && (d !== r || t.status.type === "running") ? gi : t.status;
      Dn(v).setState(T, !0);
    }
  }, [
    v,
    o,
    r,
    d,
    t.status
  ]);
  const [k] = ve(new h1(d, b));
  Q(() => {
    k.drainMs = s, k.maxCharIntervalMs = a, k.maxCharsPerFrame = l, k.minCommitMs = c;
  }, [
    k,
    s,
    a,
    l,
    c
  ]);
  const x = Z(p);
  return Q(() => {
    if (!o) {
      k.stop();
      return;
    }
    const T = x.current !== p;
    if (x.current = p, T || !r.startsWith(k.targetText)) {
      t.status.type === "running" ? (k.currentText = "", k.targetText = r, k.lastCommitTime = 0, k.start()) : (k.currentText = r, k.targetText = r, k.stop());
      return;
    }
    k.targetText = r, k.start();
  }, [
    k,
    o,
    r,
    t.status.type,
    p
  ]), Q(() => () => {
    k.stop();
  }, [k]), ce(() => o ? {
    ...t,
    text: d,
    status: r === d ? t.status : gi
  } : t, [
    o,
    d,
    t,
    r
  ]);
}, p1 = () => L(m1);
function m1(t) {
  if (t.part.type !== "image")
    throw new Error("MessagePartImage can only be used inside image message parts.");
  return t.part;
}
const Ho = te((t, e) => {
  const r = A(10);
  let n, i, o;
  r[0] !== t ? ({ smooth: i, component: o, ...n } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o) : (n = r[1], i = r[2], o = r[3]);
  const s = i === void 0 ? !0 : i, a = o === void 0 ? "span" : o, { text: l, status: c } = Wd(jd(), s);
  let d;
  return r[4] !== a || r[5] !== e || r[6] !== n || r[7] !== c.type || r[8] !== l ? (d = /* @__PURE__ */ f(a, {
    "data-status": c.type,
    ...n,
    ref: e,
    children: l
  }), r[4] = a, r[5] = e, r[6] = n, r[7] = c.type, r[8] = l, r[9] = d) : d = r[9], d;
});
Ho.displayName = "MessagePartPrimitive.Text";
const Go = te((t, e) => {
  const r = A(4), { image: n } = p1();
  let i;
  return r[0] !== e || r[1] !== n || r[2] !== t ? (i = /* @__PURE__ */ f(he.img, {
    src: n,
    ...t,
    ref: e
  }), r[0] = e, r[1] = n, r[2] = t, r[3] = i) : i = r[3], i;
});
Go.displayName = "MessagePartPrimitive.Image";
const Kd = te((t, e) => {
  const r = A(3);
  let n;
  return r[0] !== e || r[1] !== t ? (n = /* @__PURE__ */ f(he.div, {
    role: "alert",
    ...t,
    ref: e
  }), r[0] = e, r[1] = t, r[2] = n) : n = r[2], n;
});
Kd.displayName = "ErrorPrimitive.Root";
const Qd = te((t, e) => {
  const r = A(7);
  let n, i;
  r[0] !== t ? ({ children: n, ...i } = t, r[0] = t, r[1] = n, r[2] = i) : (n = r[1], i = r[2]);
  const o = td();
  if (o === void 0)
    return null;
  const s = n ?? String(o);
  let a;
  return r[3] !== e || r[4] !== i || r[5] !== s ? (a = /* @__PURE__ */ f(he.span, {
    ...i,
    ref: e,
    children: s
  }), r[3] = e, r[4] = i, r[5] = s, r[6] = a) : a = r[6], a;
});
Qd.displayName = "ErrorPrimitive.Message";
var Fa = /* @__PURE__ */ Jt({
  Message: () => Qd,
  Root: () => Kd
});
const Xt = (t) => {
  const e = A(2), r = Z(void 0);
  let n;
  return e[0] !== t ? (n = (i) => {
    r.current && (r.current(), r.current = void 0), i && (r.current = t(i));
  }, e[0] = t, e[1] = n) : n = e[1], n;
}, Ua = (t, e) => {
  const r = t.trim().match(/^(\d+(?:\.\d+)?|\.\d+)(em|px|rem)$/);
  if (!r)
    return Number.POSITIVE_INFINITY;
  const n = Number(r[1]), i = r[2];
  return i === "px" ? n : i === "em" ? n * (parseFloat(getComputedStyle(e).fontSize) || 16) : i === "rem" ? n * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) : Number.POSITIVE_INFINITY;
}, f1 = (t) => t.dataset.messageId, g1 = () => {
  const t = document.createElement("div");
  return t.dataset.auiTopAnchorReserve = "", t.style.height = "0px", t.style.flexShrink = "0", t.style.pointerEvents = "none", t.setAttribute("aria-hidden", "true"), t;
}, ja = (t, e) => {
  const r = `${e}px`;
  return t.style.height !== r ? (t.style.height = r, !0) : !1;
}, b1 = (t) => {
  const e = window.devicePixelRatio || 1;
  return Math.round(t * e) / e;
}, Yd = () => {
  const t = A(4), e = J();
  let r;
  t[0] !== e ? (r = () => e.message(), t[0] = e, t[1] = r) : r = t[1];
  const n = L(r);
  let i;
  return t[2] !== n ? (i = (o) => {
    const s = () => {
      n.setIsHovering(!0);
    }, a = () => {
      n.setIsHovering(!1);
    };
    return o.addEventListener("mouseenter", s), o.addEventListener("mouseleave", a), o.matches(":hover") && queueMicrotask(() => n.setIsHovering(!0)), () => {
      o.removeEventListener("mouseenter", s), o.removeEventListener("mouseleave", a), n.setIsHovering(!1);
    };
  }, t[2] = n, t[3] = i) : i = t[3], Xt(i);
}, v1 = () => {
  const t = A(2), e = Kt(S1);
  let r;
  return t[0] !== e ? (r = (n) => {
    var i;
    return n.message.role === "user" && n.message.index > 0 && n.message.index === n.thread.messages.length - 2 && ((i = n.thread.messages.at(-1)) == null ? void 0 : i.role) === "assistant" && (n.message.id === e || n.thread.isRunning);
  }, t[0] = e, t[1] = r) : r = t[1], L(r);
}, w1 = () => {
  const t = A(2), e = Kt(C1);
  let r;
  return t[0] !== e ? (r = (n) => {
    var i;
    return n.message.isLast && n.message.role === "assistant" && n.message.index >= 1 && ((i = n.thread.messages.at(n.message.index - 1)) == null ? void 0 : i.role) === "user" && (n.message.id === e || n.thread.isRunning);
  }, t[0] = e, t[1] = r) : r = t[1], L(r);
}, y1 = (t, e) => {
  const r = A(3);
  let n;
  return r[0] !== t || r[1] !== e ? (n = (i) => {
    if (t)
      return e.getState().registerAnchorElement(i);
  }, r[0] = t, r[1] = e, r[2] = n) : n = r[2], Xt(n);
}, x1 = (t) => {
  const e = A(3), { active: r, threadViewportStore: n } = t;
  let i;
  return e[0] !== r || e[1] !== n ? (i = (o) => {
    if (!r)
      return;
    const s = n.getState(), a = s.topAnchorMessageClamp;
    return s.registerAnchorTargetElement(o, {
      tallerThan: Ua(a.tallerThan, o),
      visibleHeight: Ua(a.visibleHeight, o)
    });
  }, e[0] = r, e[1] = n, e[2] = i) : i = e[2], Xt(i);
}, k1 = (t) => {
  const e = A(7);
  let r, n;
  e[0] !== t ? ({ forwardedRef: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]);
  const i = Yd(), o = Yt(r, i), s = L(T1);
  let a;
  return e[3] !== s || e[4] !== n || e[5] !== o ? (a = /* @__PURE__ */ f(he.div, {
    ...n,
    ref: o,
    "data-message-id": s
  }), e[3] = s, e[4] = n, e[5] = o, e[6] = a) : a = e[6], a;
}, _1 = (t) => {
  const e = A(13);
  let r, n, i;
  e[0] !== t ? ({ forwardedRef: r, threadViewportStore: i, ...n } = t, e[0] = t, e[1] = r, e[2] = n, e[3] = i) : (r = e[1], n = e[2], i = e[3]);
  const o = Yd(), s = v1(), a = w1(), l = y1(s, i);
  let c;
  e[4] !== a || e[5] !== i ? (c = {
    active: a,
    threadViewportStore: i
  }, e[4] = a, e[5] = i, e[6] = c) : c = e[6];
  const d = x1(c), u = Yt(r, o, l, d), h = L(I1), p = s ? "" : void 0, m = a ? "" : void 0;
  let g;
  return e[7] !== h || e[8] !== n || e[9] !== u || e[10] !== p || e[11] !== m ? (g = /* @__PURE__ */ f(he.div, {
    ...n,
    ref: u,
    "data-message-id": h,
    "data-aui-top-anchor-user": p,
    "data-aui-top-anchor-target": m
  }), e[7] = h, e[8] = n, e[9] = u, e[10] = p, e[11] = m, e[12] = g) : g = e[12], g;
}, Jd = te((t, e) => {
  const r = A(7), n = Qt();
  if (n.getState().turnAnchor === "top") {
    let o;
    return r[0] !== e || r[1] !== t || r[2] !== n ? (o = /* @__PURE__ */ f(_1, {
      ...t,
      forwardedRef: e,
      threadViewportStore: n
    }), r[0] = e, r[1] = t, r[2] = n, r[3] = o) : o = r[3], o;
  }
  let i;
  return r[4] !== e || r[5] !== t ? (i = /* @__PURE__ */ f(k1, {
    ...t,
    forwardedRef: e
  }), r[4] = e, r[5] = t, r[6] = i) : i = r[6], i;
});
Jd.displayName = "MessagePrimitive.Root";
function S1(t) {
  var e;
  return (e = t.topAnchorTurn) == null ? void 0 : e.anchorId;
}
function C1(t) {
  var e;
  return (e = t.topAnchorTurn) == null ? void 0 : e.targetId;
}
function T1(t) {
  return t.message.id;
}
function I1(t) {
  return t.message.id;
}
const bi = {
  ...Te,
  Text: () => /* @__PURE__ */ H("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ f(Ho, {}), /* @__PURE__ */ f($o, { children: /* @__PURE__ */ f("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Image: () => /* @__PURE__ */ f(Go, {})
}, Ji = (t) => {
  const e = A(10);
  if ("children" in t) {
    let a;
    return e[0] !== t.children ? (a = /* @__PURE__ */ f(Wi, { children: t.children }), e[0] = t.children, e[1] = a) : a = e[1], a;
  }
  let r, n;
  e[2] !== t ? ({ components: r, ...n } = t, e[2] = t, e[3] = r, e[4] = n) : (r = e[3], n = e[4]);
  let i;
  e[5] !== r ? (i = r ? {
    Text: r.Text ?? bi.Text,
    Image: r.Image ?? bi.Image,
    Reasoning: r.Reasoning ?? Te.Reasoning,
    Source: r.Source ?? Te.Source,
    File: r.File ?? Te.File,
    Unstable_Audio: r.Unstable_Audio ?? Te.Unstable_Audio,
    ..."ChainOfThought" in r ? { ChainOfThought: r.ChainOfThought } : {
      tools: r.tools,
      data: r.data,
      ToolGroup: r.ToolGroup ?? Te.ToolGroup,
      ReasoningGroup: r.ReasoningGroup ?? Te.ReasoningGroup
    },
    Empty: r.Empty,
    Quote: r.Quote,
    generativeUI: r.generativeUI
  } : bi, e[5] = r, e[6] = i) : i = e[6];
  const o = i;
  let s;
  return e[7] !== n || e[8] !== o ? (s = /* @__PURE__ */ f(Wi, {
    components: o,
    ...n
  }), e[7] = n, e[8] = o, e[9] = s) : s = e[9], s;
};
Ji.displayName = "MessagePrimitive.Parts";
const Xd = (t) => {
  const { children: e } = t;
  return td() !== void 0 ? e : null;
};
Xd.displayName = "MessagePrimitive.Error";
const E1 = (t) => {
  var n;
  const e = /* @__PURE__ */ new Map();
  for (let i = 0; i < t.length; i++) {
    const o = ((n = t[i]) == null ? void 0 : n.parentId) ?? `__ungrouped_${i}`, s = e.get(o) ?? [];
    s.push(i), e.set(o, s);
  }
  const r = [];
  for (const [i, o] of e) {
    const s = i.startsWith("__ungrouped_") ? void 0 : i;
    r.push({
      groupKey: s,
      indices: o
    });
  }
  return r;
}, A1 = (t) => {
  const e = A(4), r = L(B1);
  let n;
  e: {
    if (r.length === 0) {
      let o;
      e[0] === Symbol.for("react.memo_cache_sentinel") ? (o = [], e[0] = o) : o = e[0], n = o;
      break e;
    }
    let i;
    e[1] !== t || e[2] !== r ? (i = t(r), e[1] = t, e[2] = r, e[3] = i) : i = e[3], n = i;
  }
  return n;
}, R1 = (t) => {
  const e = A(9);
  let r, n;
  e[0] !== t ? ({ Fallback: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]);
  let i;
  e[3] !== r || e[4] !== n.toolName ? (i = (a) => {
    const l = a.tools.tools[n.toolName] ?? r;
    return Array.isArray(l) ? l[0] ?? r : l;
  }, e[3] = r, e[4] = n.toolName, e[5] = i) : i = e[5];
  const o = L(i);
  if (!o)
    return null;
  let s;
  return e[6] !== o || e[7] !== n ? (s = /* @__PURE__ */ f(o, { ...n }), e[6] = o, e[7] = n, e[8] = s) : s = e[8], s;
}, P1 = (t) => {
  const e = A(9);
  let r, n;
  e[0] !== t ? ({ Fallback: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]);
  let i;
  e[3] !== r || e[4] !== n.name ? (i = (a) => {
    const l = a.dataRenderers.renderers[n.name] ?? r;
    return Array.isArray(l) ? l[0] ?? r : l;
  }, e[3] = r, e[4] = n.name, e[5] = i) : i = e[5];
  const o = L(i);
  if (!o)
    return null;
  let s;
  return e[6] !== o || e[7] !== n ? (s = /* @__PURE__ */ f(o, { ...n }), e[6] = o, e[7] = n, e[8] = s) : s = e[8], s;
}, wt = {
  Text: () => /* @__PURE__ */ H("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ f(Ho, {}), /* @__PURE__ */ f($o, { children: /* @__PURE__ */ f("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Reasoning: () => null,
  Source: () => null,
  Image: () => /* @__PURE__ */ f(Go, {}),
  File: () => null,
  Unstable_Audio: () => null,
  Group: ({ children: t }) => t
}, M1 = (t) => {
  var P, R, D;
  const e = A(43), { components: r } = t;
  let n;
  e[0] !== r ? (n = r === void 0 ? {} : r, e[0] = r, e[1] = n) : n = e[1];
  const { Text: i, Reasoning: o, Image: s, Source: a, File: l, Unstable_Audio: c, tools: d, data: u } = n, h = i === void 0 ? wt.Text : i, p = o === void 0 ? wt.Reasoning : o, m = s === void 0 ? wt.Image : s, g = a === void 0 ? wt.Source : a, v = l === void 0 ? wt.File : l, b = c === void 0 ? wt.Unstable_Audio : c;
  let k;
  e[2] !== d ? (k = d === void 0 ? {} : d, e[2] = d, e[3] = k) : k = e[3];
  const x = k, T = J(), E = L(F1), y = E.type;
  if (y === "tool-call") {
    let _;
    e[4] !== T ? (_ = T.part(), e[4] = T, e[5] = _) : _ = e[5];
    const I = _.addToolResult;
    let M;
    e[6] !== T ? (M = T.part(), e[6] = T, e[7] = M) : M = e[7];
    const N = M.resumeToolCall;
    let $;
    e[8] !== T ? ($ = T.part(), e[8] = T, e[9] = $) : $ = e[9];
    const O = $.respondToToolApproval;
    if ("Override" in x) {
      let B;
      return e[10] !== I || e[11] !== E || e[12] !== O || e[13] !== N || e[14] !== x.Override ? (B = /* @__PURE__ */ f(x.Override, {
        ...E,
        addResult: I,
        resume: N,
        respondToApproval: O
      }), e[10] = I, e[11] = E, e[12] = O, e[13] = N, e[14] = x.Override, e[15] = B) : B = e[15], B;
    }
    const j = ((P = x.by_name) == null ? void 0 : P[E.toolName]) ?? x.Fallback;
    let G;
    return e[16] !== j || e[17] !== I || e[18] !== E || e[19] !== O || e[20] !== N ? (G = /* @__PURE__ */ f(R1, {
      ...E,
      Fallback: j,
      addResult: I,
      resume: N,
      respondToApproval: O
    }), e[16] = j, e[17] = I, e[18] = E, e[19] = O, e[20] = N, e[21] = G) : G = e[21], G;
  }
  if (((R = E.status) == null ? void 0 : R.type) === "requires-action")
    throw new Error("Encountered unexpected requires-action status");
  switch (y) {
    case "text": {
      let _;
      return e[22] !== h || e[23] !== E ? (_ = /* @__PURE__ */ f(h, { ...E }), e[22] = h, e[23] = E, e[24] = _) : _ = e[24], _;
    }
    case "reasoning": {
      let _;
      return e[25] !== p || e[26] !== E ? (_ = /* @__PURE__ */ f(p, { ...E }), e[25] = p, e[26] = E, e[27] = _) : _ = e[27], _;
    }
    case "source": {
      let _;
      return e[28] !== g || e[29] !== E ? (_ = /* @__PURE__ */ f(g, { ...E }), e[28] = g, e[29] = E, e[30] = _) : _ = e[30], _;
    }
    case "image": {
      let _;
      return e[31] !== m || e[32] !== E ? (_ = /* @__PURE__ */ f(m, { ...E }), e[31] = m, e[32] = E, e[33] = _) : _ = e[33], _;
    }
    case "file": {
      let _;
      return e[34] !== v || e[35] !== E ? (_ = /* @__PURE__ */ f(v, { ...E }), e[34] = v, e[35] = E, e[36] = _) : _ = e[36], _;
    }
    case "audio": {
      let _;
      return e[37] !== b || e[38] !== E ? (_ = /* @__PURE__ */ f(b, { ...E }), e[37] = b, e[38] = E, e[39] = _) : _ = e[39], _;
    }
    case "data": {
      const _ = ((D = u == null ? void 0 : u.by_name) == null ? void 0 : D[E.name]) ?? (u == null ? void 0 : u.Fallback);
      let I;
      return e[40] !== _ || e[41] !== E ? (I = /* @__PURE__ */ f(P1, {
        ...E,
        Fallback: _
      }), e[40] = _, e[41] = E, e[42] = I) : I = e[42], I;
    }
    default:
      return console.warn(`Unknown message part type: ${y}`), null;
  }
}, D1 = (t) => {
  const e = A(5), { partIndex: r, components: n } = t;
  let i;
  e[0] !== n ? (i = /* @__PURE__ */ f(M1, { components: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  return e[2] !== r || e[3] !== i ? (o = /* @__PURE__ */ f(Ao, {
    index: r,
    children: i
  }), e[2] = r, e[3] = i, e[4] = o) : o = e[4], o;
}, N1 = we(D1, (t, e) => {
  var r, n, i, o, s, a, l, c, d, u, h, p, m, g, v, b, k, x;
  return t.partIndex === e.partIndex && ((r = t.components) == null ? void 0 : r.Text) === ((n = e.components) == null ? void 0 : n.Text) && ((i = t.components) == null ? void 0 : i.Reasoning) === ((o = e.components) == null ? void 0 : o.Reasoning) && ((s = t.components) == null ? void 0 : s.Source) === ((a = e.components) == null ? void 0 : a.Source) && ((l = t.components) == null ? void 0 : l.Image) === ((c = e.components) == null ? void 0 : c.Image) && ((d = t.components) == null ? void 0 : d.File) === ((u = e.components) == null ? void 0 : u.File) && ((h = t.components) == null ? void 0 : h.Unstable_Audio) === ((p = e.components) == null ? void 0 : p.Unstable_Audio) && ((m = t.components) == null ? void 0 : m.tools) === ((g = e.components) == null ? void 0 : g.tools) && ((v = t.components) == null ? void 0 : v.data) === ((b = e.components) == null ? void 0 : b.data) && ((k = t.components) == null ? void 0 : k.Group) === ((x = e.components) == null ? void 0 : x.Group);
}), z1 = (t) => {
  const e = A(6), { status: r, component: n } = t, i = r.type === "running";
  let o;
  e[0] !== n || e[1] !== r ? (o = /* @__PURE__ */ f(n, {
    type: "text",
    text: "",
    status: r
  }), e[0] = n, e[1] = r, e[2] = o) : o = e[2];
  let s;
  return e[3] !== i || e[4] !== o ? (s = /* @__PURE__ */ f(Ro, {
    text: "",
    isRunning: i,
    children: o
  }), e[3] = i, e[4] = o, e[5] = s) : s = e[5], s;
}, O1 = Object.freeze({ type: "complete" }), L1 = (t) => {
  const e = A(6), { components: r } = t, n = L(U1);
  if (r != null && r.Empty) {
    let s;
    return e[0] !== r.Empty || e[1] !== n ? (s = /* @__PURE__ */ f(r.Empty, { status: n }), e[0] = r.Empty, e[1] = n, e[2] = s) : s = e[2], s;
  }
  const i = (r == null ? void 0 : r.Text) ?? wt.Text;
  let o;
  return e[3] !== n || e[4] !== i ? (o = /* @__PURE__ */ f(z1, {
    status: n,
    component: i
  }), e[3] = n, e[4] = i, e[5] = o) : o = e[5], o;
}, $1 = we(L1, (t, e) => {
  var r, n, i, o;
  return ((r = t.components) == null ? void 0 : r.Empty) === ((n = e.components) == null ? void 0 : n.Empty) && ((i = t.components) == null ? void 0 : i.Text) === ((o = e.components) == null ? void 0 : o.Text);
}), Wo = (t) => {
  const e = A(9), { groupingFunction: r, components: n } = t, i = L(j1), o = A1(r);
  let s;
  e: {
    if (i === 0) {
      let d;
      e[0] !== n ? (d = /* @__PURE__ */ f($1, { components: n }), e[0] = n, e[1] = d) : d = e[1], s = d;
      break e;
    }
    let c;
    if (e[2] !== n || e[3] !== o) {
      let d;
      e[5] !== n ? (d = (u, h) => /* @__PURE__ */ f((n == null ? void 0 : n.Group) ?? wt.Group, {
        groupKey: u.groupKey,
        indices: u.indices,
        children: u.indices.map((p) => /* @__PURE__ */ f(N1, {
          partIndex: p,
          components: n
        }, p))
      }, `group-${h}-${u.groupKey ?? "ungrouped"}`), e[5] = n, e[6] = d) : d = e[6], c = o.map(d), e[2] = n, e[3] = o, e[4] = c;
    } else
      c = e[4];
    s = c;
  }
  const a = s;
  let l;
  return e[7] !== a ? (l = /* @__PURE__ */ f(tt, { children: a }), e[7] = a, e[8] = l) : l = e[8], l;
};
Wo.displayName = "MessagePrimitive.Unstable_PartsGrouped";
const Zd = (t) => {
  const e = A(6);
  let r, n;
  e[0] !== t ? ({ components: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]);
  let i;
  return e[3] !== r || e[4] !== n ? (i = /* @__PURE__ */ f(Wo, {
    ...n,
    components: r,
    groupingFunction: E1
  }), e[3] = r, e[4] = n, e[5] = i) : i = e[5], i;
};
Zd.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
function B1(t) {
  return t.message.parts;
}
function F1(t) {
  return t.part;
}
function U1(t) {
  return t.message.status ?? O1;
}
function j1(t) {
  return t.message.parts.length;
}
var gr = /* @__PURE__ */ Jt({
  AttachmentByIndex: () => Hu,
  Attachments: () => Gu,
  Content: () => Ji,
  Error: () => Xd,
  GenerativeUI: () => Mu,
  GroupedParts: () => ju,
  If: () => bd,
  PartByIndex: () => zr,
  Parts: () => Ji,
  Quote: () => Vu,
  Root: () => Jd,
  Unstable_PartsGrouped: () => Wo,
  Unstable_PartsGroupedByParentId: () => Zd
});
const V1 = (t) => {
  const e = A(2), r = Vt(t);
  let n;
  return e[0] !== r ? (n = (i) => {
    const o = new ResizeObserver(() => {
      r();
    }), s = new MutationObserver((a) => {
      a.some(q1) && r();
    });
    return o.observe(i), s.observe(i, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      characterData: !0
    }), () => {
      o.disconnect(), s.disconnect();
    };
  }, e[0] = r, e[1] = n) : n = e[1], Xt(n);
};
function q1(t) {
  return t.type !== "attributes" || t.attributeName !== "style";
}
const H1 = ({ autoScroll: t, scrollToBottomOnRunStart: e = !0, scrollToBottomOnInitialize: r = !0, scrollToBottomOnThreadSwitch: n = !0 }) => {
  const i = Z(null), o = L((T) => T.thread.messages.length > 0), s = Z(!1), a = Z(null), l = Qt();
  t === void 0 && (t = l.getState().turnAnchor !== "top");
  const c = Z(0), d = Z(0), u = Z(0), h = Z(0), p = Z(null), m = kt((T) => {
    const E = i.current;
    E && (p.current = T, E.scrollTo({
      top: E.scrollHeight,
      behavior: T
    }));
  }, []), g = kt((T) => {
    p.current = T, a.current !== null && cancelAnimationFrame(a.current), a.current = requestAnimationFrame(() => {
      a.current = null, m(T);
    });
  }, [m]);
  Fr(() => () => {
    a.current !== null && cancelAnimationFrame(a.current);
  }, []);
  const v = kt(() => {
    const T = l.getState();
    return T.turnAnchor === "top" && T.element.viewport === i.current && T.element.anchor !== null;
  }, [l]), b = () => {
    const T = i.current;
    if (!T)
      return;
    const E = l.getState().isAtBottom, y = Math.abs(T.scrollHeight - T.scrollTop - T.clientHeight) <= 1 || T.scrollHeight <= T.clientHeight;
    !y && c.current < T.scrollTop || (y ? T.scrollHeight > T.clientHeight + 1 && (p.current = null) : c.current > T.scrollTop && d.current === T.scrollHeight && (p.current = null), (y || p.current === null) && y !== E && Dn(l).setState({ isAtBottom: y })), c.current = T.scrollTop, d.current = T.scrollHeight;
  }, k = V1(() => {
    const T = i.current;
    if (!T)
      return;
    const { scrollHeight: E, clientHeight: y } = T;
    if (E === u.current && y === h.current)
      return;
    u.current = E, h.current = y;
    const P = p.current;
    P && v() ? p.current = null : P ? m(P) : t && l.getState().isAtBottom && m("instant"), b();
  }), x = Xt((T) => {
    const E = () => {
      p.current = null;
    };
    return T.addEventListener("scroll", b), T.addEventListener("pointerdown", E), () => {
      T.removeEventListener("scroll", b), T.removeEventListener("pointerdown", E);
    };
  });
  return Fr(() => {
    if (r) {
      if (!o) {
        s.current = !1;
        return;
      }
      s.current || (s.current = !0, p.current === null && g("instant"));
    }
  }, [
    o,
    g,
    r
  ]), Id(({ behavior: T }) => {
    m(T);
  }), jr("thread.runStart", () => {
    e && l.getState().turnAnchor !== "top" && g("auto");
  }), jr("threadListItem.switchedTo", () => {
    n && g("instant");
  }), Yt(k, x, i);
}, eh = te((t, e) => {
  const r = A(3);
  let n;
  return r[0] !== t || r[1] !== e ? (n = /* @__PURE__ */ f(he.div, {
    ...t,
    ref: e
  }), r[0] = t, r[1] = e, r[2] = n) : n = r[2], n;
});
eh.displayName = "ThreadPrimitive.Root";
const th = (t) => {
  const { children: e } = t;
  return L(G1) ? e : null;
};
th.displayName = "ThreadPrimitive.Empty";
function G1(t) {
  return t.thread.isEmpty;
}
const W1 = (t) => {
  const e = A(4);
  let r;
  return e[0] !== t.disabled || e[1] !== t.empty || e[2] !== t.running ? (r = (n) => !(t.empty === !0 && !n.thread.isEmpty || t.empty === !1 && n.thread.isEmpty || t.running === !0 && !n.thread.isRunning || t.running === !1 && n.thread.isRunning || t.disabled === !0 && !n.thread.isDisabled || t.disabled === !1 && n.thread.isDisabled), e[0] = t.disabled, e[1] = t.empty, e[2] = t.running, e[3] = r) : r = e[3], L(r);
}, rh = (t) => {
  const e = A(3);
  let r, n;
  return e[0] !== t ? ({ children: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]), W1(n) ? r : null;
};
rh.displayName = "ThreadPrimitive.If";
const nh = (t, e) => {
  const r = A(3);
  let n;
  return r[0] !== e || r[1] !== t ? (n = (i) => {
    if (!t)
      return;
    const o = t(), s = () => {
      const l = e ? e(i) : i.offsetHeight;
      o.setHeight(l);
    }, a = new ResizeObserver(s);
    return a.observe(i), s(), () => {
      a.disconnect(), o.unregister();
    };
  }, r[0] = e, r[1] = t, r[2] = n) : n = r[2], Xt(n);
}, Va = (t) => {
  let e = 0, r = t;
  for (; r; )
    e += r.offsetTop, r = r.offsetParent;
  return e;
}, K1 = (t, e) => {
  let r = 0, n = t;
  for (; n && n !== e; )
    r += n.offsetTop, n = n.offsetParent;
  return n === e ? r : Va(t) - Va(e);
}, ih = ({ viewport: t, anchor: e, tallerThan: r, visibleHeight: n }) => {
  const i = K1(e, t), o = e.offsetHeight;
  return i + Math.max(0, o - (o <= r ? o : n));
}, Q1 = ({ scrollHeight: t, ...e }) => {
  const { viewport: r } = e, n = ih(e) + r.clientHeight;
  return Math.max(0, n - t);
}, Y1 = ({ viewport: t, reserve: e, ...r }) => Q1({
  viewport: t,
  ...r,
  scrollHeight: t.scrollHeight - e.offsetHeight
}), J1 = (t) => {
  const e = new ResizeObserver(t), r = new MutationObserver(t);
  let n = null, i = null, o = null;
  const s = () => {
    e.disconnect(), r.disconnect(), n = null, i = null, o = null;
  };
  return {
    target: (a, l, c) => {
      n === a && i === l && o === c || (s(), e.observe(a), e.observe(l), e.observe(c), r.observe(c, {
        childList: !0,
        subtree: !0,
        characterData: !0
      }), n = a, i = l, o = c);
    },
    disconnect: s
  };
}, X1 = (t) => {
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
}, Z1 = (t) => {
  let e = null, r;
  function n() {
    const a = t.getState(), { viewport: l, anchor: c, target: d } = a.element, u = a.targetConfig;
    if (a.turnAnchor !== "top" || !l || !c || !d || !u) {
      o.disconnect(), e && (ja(e, 0), e.remove());
      return;
    }
    if (e ?? (e = g1()), (e.parentElement !== d.parentElement || e.previousElementSibling !== d) && d.after(e), o.target(l, c, d), ja(e, Y1({
      viewport: l,
      anchor: c,
      reserve: e,
      ...u
    }))) {
      i.schedule();
      return;
    }
    const h = f1(c);
    if (h !== void 0 && r === h)
      return;
    const p = b1(ih({
      viewport: l,
      anchor: c,
      ...u
    }));
    Math.abs(l.scrollTop - p) > 1 && l.scrollTo({
      top: p,
      behavior: "smooth"
    }), h !== void 0 && (r = h);
  }
  const i = X1(n), o = J1(i.schedule);
  i.schedule();
  const s = t.subscribe(i.schedule);
  return () => {
    i.cancel(), s(), o.disconnect(), e == null || e.remove();
  };
}, ek = (t) => {
  const e = A(4), r = Qt();
  let n, i;
  e[0] !== t || e[1] !== r ? (n = () => {
    if (t)
      return Z1(r);
  }, i = [t, r], e[0] = t, e[1] = r, e[2] = n, e[3] = i) : (n = e[2], i = e[3]), Fr(n, i);
}, oh = ({ isRunning: t, messages: e }) => {
  if (!t)
    return null;
  const r = e.at(-1), n = e.at(-2);
  return (n == null ? void 0 : n.role) !== "user" || (r == null ? void 0 : r.role) !== "assistant" ? null : {
    anchorId: n.id,
    targetId: r.id
  };
}, tk = (t) => {
  var e;
  return (e = oh(t)) == null ? void 0 : e.anchorId;
}, rk = (t) => {
  var e;
  return (e = oh(t)) == null ? void 0 : e.targetId;
}, nk = () => nh(Kt(sk), ak), ik = () => Xt(Kt(lk)), ok = (t) => {
  const e = A(13), r = Qt();
  let n;
  e[0] !== t ? (n = (p) => {
    if (t)
      return tk(p.thread);
  }, e[0] = t, e[1] = n) : n = e[1];
  const i = L(n);
  let o;
  e[2] !== t ? (o = (p) => {
    if (t)
      return rk(p.thread);
  }, e[2] = t, e[3] = o) : o = e[3];
  const s = L(o);
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
  e[7] !== l || e[8] !== r ? (c = () => {
    if (!l)
      return;
    const p = r.getState(), m = p.topAnchorTurn;
    (m == null ? void 0 : m.anchorId) === l.anchorId && m.targetId === l.targetId || p.setTopAnchorTurn(l);
  }, d = [l, r], e[7] = l, e[8] = r, e[9] = c, e[10] = d) : (c = e[9], d = e[10]), Fr(c, d);
  let u;
  e[11] !== r ? (u = () => {
    r.getState().setTopAnchorTurn(null);
  }, e[11] = r, e[12] = u) : u = e[12];
  const h = u;
  jr("thread.initialize", h), jr("threadListItem.switchedTo", h);
}, sh = te((t, e) => {
  const r = A(18);
  let n, i, o, s, a, l;
  r[0] !== t ? ({ autoScroll: n, scrollToBottomOnRunStart: a, scrollToBottomOnInitialize: s, scrollToBottomOnThreadSwitch: l, children: i, ...o } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s, r[5] = a, r[6] = l) : (n = r[1], i = r[2], o = r[3], s = r[4], a = r[5], l = r[6]);
  let c;
  r[7] !== n || r[8] !== s || r[9] !== a || r[10] !== l ? (c = {
    autoScroll: n,
    scrollToBottomOnRunStart: a,
    scrollToBottomOnInitialize: s,
    scrollToBottomOnThreadSwitch: l
  }, r[7] = n, r[8] = s, r[9] = a, r[10] = l, r[11] = c) : c = r[11];
  const d = H1(c), u = nk(), h = ik(), p = Qt();
  let m;
  r[12] !== p ? (m = p.getState(), r[12] = p, r[13] = m) : m = r[13];
  const g = m.turnAnchor === "top";
  ok(g), ek(g);
  const v = Yt(e, d, u, h);
  let b;
  return r[14] !== i || r[15] !== v || r[16] !== o ? (b = /* @__PURE__ */ f(he.div, {
    ...o,
    ref: v,
    children: i
  }), r[14] = i, r[15] = v, r[16] = o, r[17] = b) : b = r[17], b;
});
sh.displayName = "ThreadPrimitive.ViewportScrollable";
const ah = te((t, e) => {
  const r = A(13);
  let n, i, o;
  r[0] !== t ? ({ turnAnchor: o, topAnchorMessageClamp: i, ...n } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o) : (n = r[1], i = r[2], o = r[3]);
  let s;
  r[4] !== i || r[5] !== o ? (s = {
    turnAnchor: o,
    topAnchorMessageClamp: i
  }, r[4] = i, r[5] = o, r[6] = s) : s = r[6];
  let a;
  r[7] !== n || r[8] !== e ? (a = /* @__PURE__ */ f(sh, {
    ...n,
    ref: e
  }), r[7] = n, r[8] = e, r[9] = a) : a = r[9];
  let l;
  return r[10] !== s || r[11] !== a ? (l = /* @__PURE__ */ f(Bo, {
    options: s,
    children: a
  }), r[10] = s, r[11] = a, r[12] = l) : l = r[12], l;
});
ah.displayName = "ThreadPrimitive.Viewport";
function sk(t) {
  return t.registerViewport;
}
function ak(t) {
  return t.clientHeight;
}
function lk(t) {
  return t.registerViewportElement;
}
const lh = te((t, e) => {
  const r = A(3), n = Yt(e, nh(Kt(ck), uk));
  let i;
  return r[0] !== t || r[1] !== n ? (i = /* @__PURE__ */ f(he.div, {
    ...t,
    ref: n
  }), r[0] = t, r[1] = n, r[2] = i) : i = r[2], i;
});
lh.displayName = "ThreadPrimitive.ViewportFooter";
function ck(t) {
  return t.registerContentInset;
}
function uk(t) {
  const e = parseFloat(getComputedStyle(t).marginTop) || 0;
  return t.offsetHeight + e;
}
const dk = (t) => {
  const e = A(5);
  let r;
  e[0] !== t ? (r = t === void 0 ? {} : t, e[0] = t, e[1] = r) : r = e[1];
  const { behavior: n } = r, i = Kt(pk), o = Qt();
  let s;
  e[2] !== n || e[3] !== o ? (s = () => {
    o.getState().scrollToBottom({ behavior: n });
  }, e[2] = n, e[3] = o, e[4] = s) : s = e[4];
  const a = s;
  return i ? null : a;
}, hk = rt("ThreadPrimitive.ScrollToBottom", dk, ["behavior"]);
function pk(t) {
  return t.isAtBottom;
}
const mk = (t) => {
  const e = A(4), { prompt: r, send: n, clearComposer: i, autoSend: o } = t, s = n ?? o ?? !1;
  let a;
  e[0] !== i || e[1] !== r || e[2] !== s ? (a = {
    prompt: r,
    send: s,
    clearComposer: i
  }, e[0] = i, e[1] = r, e[2] = s, e[3] = a) : a = e[3];
  const { disabled: l, trigger: c } = jy(a);
  return l ? null : c;
}, fk = rt("ThreadPrimitive.Suggestion", mk, [
  "prompt",
  "send",
  "clearComposer",
  "autoSend",
  "method"
]);
var ur = /* @__PURE__ */ Jt({
  Empty: () => th,
  If: () => rh,
  MessageByIndex: () => Iu,
  Messages: () => pw,
  Root: () => eh,
  ScrollToBottom: () => hk,
  Suggestion: () => fk,
  SuggestionByIndex: () => Xu,
  Suggestions: () => dy,
  Unstable_MessageById: () => Eu,
  Viewport: () => ah,
  ViewportFooter: () => lh,
  ViewportProvider: () => Bo
});
const gk = () => {
  const t = A(7), e = J().part.source !== null;
  let r;
  t[0] !== e ? (r = (u) => e && u.part.type === "tool-call" ? u.part.timing : void 0, t[0] = e, t[1] = r) : r = t[1];
  const n = L(r);
  let i;
  t[2] !== e ? (i = (u) => e && u.part.type === "tool-call" && u.part.status.type === "running", t[2] = e, t[3] = i) : i = t[3];
  const o = L(i), s = n !== void 0 && n.completedAt === void 0 && o, [a, l] = ve(bk);
  let c, d;
  if (t[4] !== s ? (c = () => {
    if (!s)
      return;
    l(Date.now());
    const u = setInterval(() => l(Date.now()), 1e3);
    return () => clearInterval(u);
  }, d = [s], t[4] = s, t[5] = c, t[6] = d) : (c = t[5], d = t[6]), Q(c, d), n !== void 0) {
    if (n.completedAt !== void 0)
      return Math.max(0, n.completedAt - n.startedAt);
    if (s)
      return Math.max(0, a - n.startedAt);
  }
};
function bk() {
  return Date.now();
}
var vk = /* @__PURE__ */ Jt({
  AssistantRuntimeImpl: () => Mo,
  BaseAssistantRuntimeCore: () => Do,
  CompositeContextProvider: () => So,
  DefaultThreadComposerRuntimeCore: () => gu,
  MessageRepository: () => mu,
  ThreadRuntimeImpl: () => uu,
  getAutoStatus: () => qi,
  splitLocalRuntimeOptions: () => Jy,
  useComposerInputPluginRegistryOptional: () => Jn,
  useSmooth: () => Wd,
  useSmoothStatus: () => u1,
  withSmoothContextProvider: () => c1
});
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wk = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), yk = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, r, n) => n ? n.toUpperCase() : r.toLowerCase()
), qa = (t) => {
  const e = yk(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
}, ch = (...t) => t.filter((e, r, n) => !!e && e.trim() !== "" && n.indexOf(e) === r).join(" ").trim(), xk = (t) => {
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
var kk = {
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
const _k = te(
  ({
    color: t = "currentColor",
    size: e = 24,
    strokeWidth: r = 2,
    absoluteStrokeWidth: n,
    className: i = "",
    children: o,
    iconNode: s,
    ...a
  }, l) => St(
    "svg",
    {
      ref: l,
      ...kk,
      width: e,
      height: e,
      stroke: t,
      strokeWidth: n ? Number(r) * 24 / Number(e) : r,
      className: ch("lucide", i),
      ...!o && !xk(a) && { "aria-hidden": "true" },
      ...a
    },
    [
      ...s.map(([c, d]) => St(c, d)),
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
const Ae = (t, e) => {
  const r = te(
    ({ className: n, ...i }, o) => St(_k, {
      ref: o,
      iconNode: e,
      className: ch(
        `lucide-${wk(qa(t))}`,
        `lucide-${t}`,
        n
      ),
      ...i
    })
  );
  return r.displayName = qa(t), r;
};
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sk = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
], Ck = Ae("arrow-down", Sk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tk = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
], Ik = Ae("arrow-up", Tk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ek = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
], uh = Ae("bot", Ek);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ak = [
  ["path", { d: "M12 18V5", key: "adv99a" }],
  ["path", { d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4", key: "1e3is1" }],
  ["path", { d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5", key: "1gqd8o" }],
  ["path", { d: "M17.997 5.125a4 4 0 0 1 2.526 5.77", key: "iwvgf7" }],
  ["path", { d: "M18 18a4 4 0 0 0 2-7.464", key: "efp6ie" }],
  ["path", { d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517", key: "1gq6am" }],
  ["path", { d: "M6 18a4 4 0 0 1-2-7.464", key: "k1g0md" }],
  ["path", { d: "M6.003 5.125a4 4 0 0 0-2.526 5.77", key: "q97ue3" }]
], Rk = Ae("brain", Ak);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pk = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], Ko = Ae("check", Pk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mk = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], Qo = Ae("chevron-down", Mk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dk = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], dh = Ae("circle-alert", Dk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nk = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
], zk = Ae("circle-x", Nk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ok = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
], hh = Ae("copy", Ok);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lk = [
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
], $k = Ae("file-text", Lk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bk = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], Fk = Ae("loader-circle", Bk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Uk = [
  ["path", { d: "M12 2v4", key: "3427ic" }],
  ["path", { d: "m16.2 7.8 2.9-2.9", key: "r700ao" }],
  ["path", { d: "M18 12h4", key: "wj9ykh" }],
  ["path", { d: "m16.2 16.2 2.9 2.9", key: "1bxg5t" }],
  ["path", { d: "M12 18v4", key: "jadmvz" }],
  ["path", { d: "m4.9 19.1 2.9-2.9", key: "bwix9q" }],
  ["path", { d: "M2 12h4", key: "j09sii" }],
  ["path", { d: "m4.9 4.9 2.9 2.9", key: "giyufr" }]
], ph = Ae("loader", Uk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jk = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], Vk = Ae("plus", jk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qk = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
], Hk = Ae("rotate-ccw", qk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gk = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
], Wk = Ae("square", Gk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kk = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], Qk = Ae("x", Kk);
function mh(t) {
  var e, r, n = "";
  if (typeof t == "string" || typeof t == "number")
    n += t;
  else if (typeof t == "object")
    if (Array.isArray(t)) {
      var i = t.length;
      for (e = 0; e < i; e++)
        t[e] && (r = mh(t[e])) && (n && (n += " "), n += r);
    } else
      for (r in t)
        t[r] && (n && (n += " "), n += r);
  return n;
}
function fh() {
  for (var t, e, r = 0, n = "", i = arguments.length; r < i; r++)
    (t = arguments[r]) && (e = mh(t)) && (n && (n += " "), n += e);
  return n;
}
const Yk = (t, e) => {
  const r = new Array(t.length + e.length);
  for (let n = 0; n < t.length; n++)
    r[n] = t[n];
  for (let n = 0; n < e.length; n++)
    r[t.length + n] = e[n];
  return r;
}, Jk = (t, e) => ({
  classGroupId: t,
  validator: e
}), gh = (t = /* @__PURE__ */ new Map(), e = null, r) => ({
  nextPart: t,
  validators: e,
  classGroupId: r
}), zn = "-", Ha = [], Xk = "arbitrary..", Zk = (t) => {
  const e = t_(t), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: n
  } = t;
  return {
    getClassGroupId: (s) => {
      if (s.startsWith("[") && s.endsWith("]"))
        return e_(s);
      const a = s.split(zn), l = a[0] === "" && a.length > 1 ? 1 : 0;
      return bh(a, l, e);
    },
    getConflictingClassGroupIds: (s, a) => {
      if (a) {
        const l = n[s], c = r[s];
        return l ? c ? Yk(c, l) : l : c || Ha;
      }
      return r[s] || Ha;
    }
  };
}, bh = (t, e, r) => {
  if (t.length - e === 0)
    return r.classGroupId;
  const i = t[e], o = r.nextPart.get(i);
  if (o) {
    const c = bh(t, e + 1, o);
    if (c)
      return c;
  }
  const s = r.validators;
  if (s === null)
    return;
  const a = e === 0 ? t.join(zn) : t.slice(e).join(zn), l = s.length;
  for (let c = 0; c < l; c++) {
    const d = s[c];
    if (d.validator(a))
      return d.classGroupId;
  }
}, e_ = (t) => t.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const e = t.slice(1, -1), r = e.indexOf(":"), n = e.slice(0, r);
  return n ? Xk + n : void 0;
})(), t_ = (t) => {
  const {
    theme: e,
    classGroups: r
  } = t;
  return r_(r, e);
}, r_ = (t, e) => {
  const r = gh();
  for (const n in t) {
    const i = t[n];
    Yo(i, r, n, e);
  }
  return r;
}, Yo = (t, e, r, n) => {
  const i = t.length;
  for (let o = 0; o < i; o++) {
    const s = t[o];
    n_(s, e, r, n);
  }
}, n_ = (t, e, r, n) => {
  if (typeof t == "string") {
    i_(t, e, r);
    return;
  }
  if (typeof t == "function") {
    o_(t, e, r, n);
    return;
  }
  s_(t, e, r, n);
}, i_ = (t, e, r) => {
  const n = t === "" ? e : vh(e, t);
  n.classGroupId = r;
}, o_ = (t, e, r, n) => {
  if (a_(t)) {
    Yo(t(n), e, r, n);
    return;
  }
  e.validators === null && (e.validators = []), e.validators.push(Jk(r, t));
}, s_ = (t, e, r, n) => {
  const i = Object.entries(t), o = i.length;
  for (let s = 0; s < o; s++) {
    const [a, l] = i[s];
    Yo(l, vh(e, a), r, n);
  }
}, vh = (t, e) => {
  let r = t;
  const n = e.split(zn), i = n.length;
  for (let o = 0; o < i; o++) {
    const s = n[o];
    let a = r.nextPart.get(s);
    a || (a = gh(), r.nextPart.set(s, a)), r = a;
  }
  return r;
}, a_ = (t) => "isThemeGetter" in t && t.isThemeGetter === !0, l_ = (t) => {
  if (t < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let e = 0, r = /* @__PURE__ */ Object.create(null), n = /* @__PURE__ */ Object.create(null);
  const i = (o, s) => {
    r[o] = s, e++, e > t && (e = 0, n = r, r = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(o) {
      let s = r[o];
      if (s !== void 0)
        return s;
      if ((s = n[o]) !== void 0)
        return i(o, s), s;
    },
    set(o, s) {
      o in r ? r[o] = s : i(o, s);
    }
  };
}, Xi = "!", Ga = ":", c_ = [], Wa = (t, e, r, n, i) => ({
  modifiers: t,
  hasImportantModifier: e,
  baseClassName: r,
  maybePostfixModifierPosition: n,
  isExternal: i
}), u_ = (t) => {
  const {
    prefix: e,
    experimentalParseClassName: r
  } = t;
  let n = (i) => {
    const o = [];
    let s = 0, a = 0, l = 0, c;
    const d = i.length;
    for (let g = 0; g < d; g++) {
      const v = i[g];
      if (s === 0 && a === 0) {
        if (v === Ga) {
          o.push(i.slice(l, g)), l = g + 1;
          continue;
        }
        if (v === "/") {
          c = g;
          continue;
        }
      }
      v === "[" ? s++ : v === "]" ? s-- : v === "(" ? a++ : v === ")" && a--;
    }
    const u = o.length === 0 ? i : i.slice(l);
    let h = u, p = !1;
    u.endsWith(Xi) ? (h = u.slice(0, -1), p = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      u.startsWith(Xi) && (h = u.slice(1), p = !0)
    );
    const m = c && c > l ? c - l : void 0;
    return Wa(o, p, h, m);
  };
  if (e) {
    const i = e + Ga, o = n;
    n = (s) => s.startsWith(i) ? o(s.slice(i.length)) : Wa(c_, !1, s, void 0, !0);
  }
  if (r) {
    const i = n;
    n = (o) => r({
      className: o,
      parseClassName: i
    });
  }
  return n;
}, d_ = (t) => {
  const e = /* @__PURE__ */ new Map();
  return t.orderSensitiveModifiers.forEach((r, n) => {
    e.set(r, 1e6 + n);
  }), (r) => {
    const n = [];
    let i = [];
    for (let o = 0; o < r.length; o++) {
      const s = r[o], a = s[0] === "[", l = e.has(s);
      a || l ? (i.length > 0 && (i.sort(), n.push(...i), i = []), n.push(s)) : i.push(s);
    }
    return i.length > 0 && (i.sort(), n.push(...i)), n;
  };
}, h_ = (t) => ({
  cache: l_(t.cacheSize),
  parseClassName: u_(t),
  sortModifiers: d_(t),
  postfixLookupClassGroupIds: p_(t),
  ...Zk(t)
}), p_ = (t) => {
  const e = /* @__PURE__ */ Object.create(null), r = t.postfixLookupClassGroups;
  if (r)
    for (let n = 0; n < r.length; n++)
      e[r[n]] = !0;
  return e;
}, m_ = /\s+/, f_ = (t, e) => {
  const {
    parseClassName: r,
    getClassGroupId: n,
    getConflictingClassGroupIds: i,
    sortModifiers: o,
    postfixLookupClassGroupIds: s
  } = e, a = [], l = t.trim().split(m_);
  let c = "";
  for (let d = l.length - 1; d >= 0; d -= 1) {
    const u = l[d], {
      isExternal: h,
      modifiers: p,
      hasImportantModifier: m,
      baseClassName: g,
      maybePostfixModifierPosition: v
    } = r(u);
    if (h) {
      c = u + (c.length > 0 ? " " + c : c);
      continue;
    }
    let b = !!v, k;
    if (b) {
      const P = g.substring(0, v);
      k = n(P);
      const R = k && s[k] ? n(g) : void 0;
      R && R !== k && (k = R, b = !1);
    } else
      k = n(g);
    if (!k) {
      if (!b) {
        c = u + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (k = n(g), !k) {
        c = u + (c.length > 0 ? " " + c : c);
        continue;
      }
      b = !1;
    }
    const x = p.length === 0 ? "" : p.length === 1 ? p[0] : o(p).join(":"), T = m ? x + Xi : x, E = T + k;
    if (a.indexOf(E) > -1)
      continue;
    a.push(E);
    const y = i(k, b);
    for (let P = 0; P < y.length; ++P) {
      const R = y[P];
      a.push(T + R);
    }
    c = u + (c.length > 0 ? " " + c : c);
  }
  return c;
}, g_ = (...t) => {
  let e = 0, r, n, i = "";
  for (; e < t.length; )
    (r = t[e++]) && (n = wh(r)) && (i && (i += " "), i += n);
  return i;
}, wh = (t) => {
  if (typeof t == "string")
    return t;
  let e, r = "";
  for (let n = 0; n < t.length; n++)
    t[n] && (e = wh(t[n])) && (r && (r += " "), r += e);
  return r;
}, b_ = (t, ...e) => {
  let r, n, i, o;
  const s = (l) => {
    const c = e.reduce((d, u) => u(d), t());
    return r = h_(c), n = r.cache.get, i = r.cache.set, o = a, a(l);
  }, a = (l) => {
    const c = n(l);
    if (c)
      return c;
    const d = f_(l, r);
    return i(l, d), d;
  };
  return o = s, (...l) => o(g_(...l));
}, v_ = [], Se = (t) => {
  const e = (r) => r[t] || v_;
  return e.isThemeGetter = !0, e;
}, yh = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, xh = /^\((?:(\w[\w-]*):)?(.+)\)$/i, w_ = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, y_ = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, x_ = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, k_ = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, __ = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, S_ = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, bt = (t) => w_.test(t), re = (t) => !!t && !Number.isNaN(Number(t)), it = (t) => !!t && Number.isInteger(Number(t)), vi = (t) => t.endsWith("%") && re(t.slice(0, -1)), ft = (t) => y_.test(t), kh = () => !0, C_ = (t) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  x_.test(t) && !k_.test(t)
), Jo = () => !1, T_ = (t) => __.test(t), I_ = (t) => S_.test(t), E_ = (t) => !V(t) && !q(t), A_ = (t) => t.startsWith("@container") && (t[10] === "/" && t[11] !== void 0 || t[11] === "s" && t[16] !== void 0 && t.startsWith("-size/", 10) || t[11] === "n" && t[18] !== void 0 && t.startsWith("-normal/", 10)), R_ = (t) => It(t, Ch, Jo), V = (t) => yh.test(t), Pt = (t) => It(t, Th, C_), Ka = (t) => It(t, $_, re), P_ = (t) => It(t, Eh, kh), M_ = (t) => It(t, Ih, Jo), Qa = (t) => It(t, _h, Jo), D_ = (t) => It(t, Sh, I_), mn = (t) => It(t, Ah, T_), q = (t) => xh.test(t), Rr = (t) => Zt(t, Th), N_ = (t) => Zt(t, Ih), Ya = (t) => Zt(t, _h), z_ = (t) => Zt(t, Ch), O_ = (t) => Zt(t, Sh), fn = (t) => Zt(t, Ah, !0), L_ = (t) => Zt(t, Eh, !0), It = (t, e, r) => {
  const n = yh.exec(t);
  return n ? n[1] ? e(n[1]) : r(n[2]) : !1;
}, Zt = (t, e, r = !1) => {
  const n = xh.exec(t);
  return n ? n[1] ? e(n[1]) : r : !1;
}, _h = (t) => t === "position" || t === "percentage", Sh = (t) => t === "image" || t === "url", Ch = (t) => t === "length" || t === "size" || t === "bg-size", Th = (t) => t === "length", $_ = (t) => t === "number", Ih = (t) => t === "family-name", Eh = (t) => t === "number" || t === "weight", Ah = (t) => t === "shadow", B_ = () => {
  const t = Se("color"), e = Se("font"), r = Se("text"), n = Se("font-weight"), i = Se("tracking"), o = Se("leading"), s = Se("breakpoint"), a = Se("container"), l = Se("spacing"), c = Se("radius"), d = Se("shadow"), u = Se("inset-shadow"), h = Se("text-shadow"), p = Se("drop-shadow"), m = Se("blur"), g = Se("perspective"), v = Se("aspect"), b = Se("ease"), k = Se("animate"), x = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], T = () => [
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
  ], E = () => [...T(), q, V], y = () => ["auto", "hidden", "clip", "visible", "scroll"], P = () => ["auto", "contain", "none"], R = () => [q, V, l], D = () => [bt, "full", "auto", ...R()], _ = () => [it, "none", "subgrid", q, V], I = () => ["auto", {
    span: ["full", it, q, V]
  }, it, q, V], M = () => [it, "auto", q, V], N = () => ["auto", "min", "max", "fr", q, V], $ = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], O = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], j = () => ["auto", ...R()], G = () => [bt, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...R()], B = () => [bt, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...R()], W = () => [bt, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...R()], w = () => [t, q, V], ie = () => [...T(), Ya, Qa, {
    position: [q, V]
  }], de = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], S = () => ["auto", "cover", "contain", z_, R_, {
    size: [q, V]
  }], xe = () => [vi, Rr, Pt], pe = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    c,
    q,
    V
  ], ae = () => ["", re, Rr, Pt], nt = () => ["solid", "dashed", "dotted", "double"], Ke = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], be = () => [re, vi, Ya, Qa], dt = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    m,
    q,
    V
  ], ht = () => ["none", re, q, V], rr = () => ["none", re, q, V], Sr = () => [re, q, V], nr = () => [bt, "full", ...R()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [ft],
      breakpoint: [ft],
      color: [kh],
      container: [ft],
      "drop-shadow": [ft],
      ease: ["in", "out", "in-out"],
      font: [E_],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [ft],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [ft],
      shadow: [ft],
      spacing: ["px", re],
      text: [ft],
      "text-shadow": [ft],
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
        aspect: ["auto", "square", bt, V, q, v]
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
        "@container": ["", "normal", "size", q, V]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [A_],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [re, V, q, a]
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
        object: E()
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
        overscroll: P()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": P()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": P()
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
        inset: D()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": D()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": D()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": D(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: D()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": D(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: D()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": D()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": D()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: D()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: D()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: D()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: D()
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
        z: [it, "auto", q, V]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [bt, "full", "auto", a, ...R()]
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
        flex: [re, bt, "auto", "initial", "none", V]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", re, q, V]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", re, q, V]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [it, "first", "last", "none", q, V]
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
        col: I()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": M()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": M()
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
        row: I()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": M()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": M()
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
        "auto-cols": N()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": N()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: R()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": R()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": R()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...$(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...O(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...O()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...$()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...O(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...O(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": $()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...O(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...O()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: R()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: R()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: R()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: R()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: R()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: R()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: R()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: R()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: R()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: R()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: R()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: j()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: j()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: j()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: j()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: j()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: j()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: j()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: j()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: j()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: j()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: j()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": R()
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
        "space-y": R()
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
        inline: ["auto", ...B()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...B()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...B()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...W()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...W()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...W()]
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
        text: ["base", r, Rr, Pt]
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
        font: [n, L_, P_]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", vi, V]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [N_, M_, e]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [V]
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
        tracking: [i, q, V]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [re, "none", q, Ka]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          o,
          ...R()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", q, V]
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
        list: ["disc", "decimal", "none", q, V]
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
        placeholder: w()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: w()
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
        decoration: [...nt(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [re, "from-font", "auto", q, Pt]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: w()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [re, "auto", q, V]
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
        indent: R()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [it, q, V]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", q, V]
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
        content: ["none", q, V]
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
        bg: ie()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: de()
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
          }, it, q, V],
          radial: ["", q, V],
          conic: [it, q, V]
        }, O_, D_]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: w()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: xe()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: xe()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: xe()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: w()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: w()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: w()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: pe()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": pe()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": pe()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": pe()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": pe()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": pe()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": pe()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": pe()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": pe()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": pe()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": pe()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": pe()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": pe()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": pe()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": pe()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: ae()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": ae()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": ae()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": ae()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": ae()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": ae()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": ae()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": ae()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": ae()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": ae()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": ae()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": ae()
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
        "divide-y": ae()
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
        border: [...nt(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...nt(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: w()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": w()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": w()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": w()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": w()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": w()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": w()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": w()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": w()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": w()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": w()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: w()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...nt(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [re, q, V]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", re, Rr, Pt]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: w()
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
          fn,
          mn
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: w()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", u, fn, mn]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": w()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: ae()
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
        ring: w()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [re, Pt]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": w()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": ae()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": w()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", h, fn, mn]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": w()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [re, q, V]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Ke(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Ke()
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
        "mask-linear": [re]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": be()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": be()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": w()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": w()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": be()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": be()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": w()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": w()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": be()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": be()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": w()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": w()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": be()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": be()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": w()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": w()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": be()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": be()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": w()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": w()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": be()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": be()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": w()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": w()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": be()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": be()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": w()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": w()
      }],
      "mask-image-radial": [{
        "mask-radial": [q, V]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": be()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": be()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": w()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": w()
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
        "mask-conic": [re]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": be()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": be()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": w()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": w()
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
        mask: ie()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: de()
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
        mask: ["none", q, V]
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
          q,
          V
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: dt()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [re, q, V]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [re, q, V]
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
          fn,
          mn
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": w()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", re, q, V]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [re, q, V]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", re, q, V]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [re, q, V]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", re, q, V]
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
          q,
          V
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": dt()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [re, q, V]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [re, q, V]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", re, q, V]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [re, q, V]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", re, q, V]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [re, q, V]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [re, q, V]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", re, q, V]
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
        "border-spacing": R()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": R()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": R()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", q, V]
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
        duration: [re, "initial", q, V]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", b, q, V]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [re, q, V]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", k, q, V]
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
        perspective: [g, q, V]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": E()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: ht()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": ht()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": ht()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": ht()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: rr()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": rr()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": rr()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": rr()
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
        skew: Sr()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Sr()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Sr()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [q, V, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: E()
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
        translate: nr()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": nr()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": nr()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": nr()
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
        zoom: [it, q, V]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: w()
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
        caret: w()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", q, V]
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
        "scrollbar-thumb": w()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": w()
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
        "scroll-m": R()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": R()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": R()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": R()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": R()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": R()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": R()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": R()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": R()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": R()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": R()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": R()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": R()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": R()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": R()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": R()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": R()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": R()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": R()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": R()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": R()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": R()
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
        "will-change": ["auto", "scroll", "contents", "transform", q, V]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...w()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [re, Rr, Pt, Ka]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...w()]
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
}, F_ = /* @__PURE__ */ b_(B_);
function K(...t) {
  return F_(fh(t));
}
const U_ = window.UIComponents.Tooltip, j_ = window.UIComponents.TooltipContent, V_ = window.UIComponents.TooltipProvider, q_ = window.UIComponents.TooltipTrigger, H_ = window.UIComponents.Button, er = te(({ children: t, tooltip: e, side: r = "bottom", className: n, ...i }, o) => /* @__PURE__ */ f(V_, { delayDuration: 0, children: /* @__PURE__ */ H(U_, { children: [
  /* @__PURE__ */ f(q_, { asChild: !0, children: /* @__PURE__ */ H(
    H_,
    {
      variant: "ghost",
      size: "icon",
      ...i,
      className: K("aui-button-icon size-6 p-1 active:scale-90", n),
      ref: o,
      children: [
        /* @__PURE__ */ f(d0, { children: t }),
        /* @__PURE__ */ f("span", { className: "aui-sr-only sr-only", children: e })
      ]
    }
  ) }),
  /* @__PURE__ */ f(j_, { side: r, children: e })
] }) }));
er.displayName = "TooltipIconButton";
const G_ = window.UIComponents.Tooltip, W_ = window.UIComponents.TooltipContent, K_ = window.UIComponents.TooltipTrigger, Q_ = window.UIComponents.Dialog, Y_ = window.UIComponents.DialogTitle, J_ = window.UIComponents.DialogContent, X_ = window.UIComponents.DialogTrigger, Z_ = window.UIComponents.Avatar, eS = window.UIComponents.AvatarImage, tS = window.UIComponents.AvatarFallback, rS = (t) => {
  const [e, r] = Ie(void 0);
  return Ht(() => {
    if (!t) {
      r(void 0);
      return;
    }
    const n = URL.createObjectURL(t);
    return r(n), () => {
      URL.revokeObjectURL(n);
    };
  }, [t]), e;
}, Rh = () => {
  const { file: t, src: e } = L(
    Mn((r) => {
      var i, o;
      if (r.attachment.type !== "image")
        return {};
      if (r.attachment.file)
        return { file: r.attachment.file };
      const n = (o = (i = r.attachment.content) == null ? void 0 : i.filter((s) => s.type === "image")[0]) == null ? void 0 : o.image;
      return n ? { src: n } : {};
    })
  );
  return rS(t) ?? e;
}, nS = ({ src: t }) => {
  const [e, r] = Ie(!1);
  return /* @__PURE__ */ f(
    "img",
    {
      src: t,
      alt: "Attachment preview",
      className: K(
        "block h-auto max-h-[80vh] w-auto max-w-full object-contain",
        e ? "aui-attachment-preview-image-loaded" : "aui-attachment-preview-image-loading invisible"
      ),
      onLoad: () => r(!0)
    }
  );
}, iS = ({ children: t }) => {
  const e = Rh();
  return e ? /* @__PURE__ */ H(Q_, { children: [
    /* @__PURE__ */ f(
      X_,
      {
        className: "aui-attachment-preview-trigger hover:bg-accent/50 cursor-pointer transition-colors",
        asChild: !0,
        children: t
      }
    ),
    /* @__PURE__ */ H(J_, { className: "aui-attachment-preview-dialog-content [&>button]:bg-foreground/60 [&_svg]:text-background [&>button]:hover:[&_svg]:text-destructive p-2 sm:max-w-3xl [&>button]:rounded-full [&>button]:p-1 [&>button]:opacity-100 [&>button]:ring-0!", children: [
      /* @__PURE__ */ f(Y_, { className: "aui-sr-only sr-only", children: "Image Attachment Preview" }),
      /* @__PURE__ */ f("div", { className: "aui-attachment-preview bg-background relative mx-auto flex max-h-[80dvh] w-full items-center justify-center overflow-hidden", children: /* @__PURE__ */ f(nS, { src: e }) })
    ] })
  ] }) : t;
}, oS = () => {
  const t = Rh();
  return /* @__PURE__ */ H(Z_, { className: "aui-attachment-tile-avatar h-full w-full rounded-none", children: [
    /* @__PURE__ */ f(
      eS,
      {
        src: t,
        alt: "Attachment preview",
        className: "aui-attachment-tile-image object-cover"
      }
    ),
    /* @__PURE__ */ f(tS, { children: /* @__PURE__ */ f($k, { className: "aui-attachment-tile-fallback-icon text-muted-foreground size-8" }) })
  ] });
}, Ph = () => {
  const e = J().attachment.source !== "message", r = L((l) => l.attachment.type === "image"), n = L((l) => {
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
  }), i = L(
    (l) => l.attachment.status.type === "running" ? "uploading" : l.attachment.status.type === "incomplete" && l.attachment.status.reason === "error" ? "error" : void 0
  ), o = i === "uploading", s = i === "error", a = L(
    (l) => l.attachment.status.type === "incomplete" && l.attachment.status.reason === "error" ? l.attachment.status.message ?? "Upload failed" : void 0
  );
  return /* @__PURE__ */ H(G_, { children: [
    /* @__PURE__ */ H(
      Qi.Root,
      {
        className: K(
          "aui-attachment-root relative",
          r && !e && "aui-attachment-root-message only:*:first:size-24"
        ),
        children: [
          /* @__PURE__ */ f(iS, { children: /* @__PURE__ */ f(K_, { asChild: !0, children: /* @__PURE__ */ H(
            "div",
            {
              className: K(
                "aui-attachment-tile bg-muted relative size-14 cursor-pointer overflow-hidden rounded-lg border transition-opacity hover:opacity-75",
                s && "border-destructive"
              ),
              role: "button",
              tabIndex: 0,
              "aria-label": `${n} attachment${s ? ", upload failed" : o ? ", uploading" : ""}`,
              children: [
                /* @__PURE__ */ f(oS, {}),
                o && /* @__PURE__ */ f(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "aui-attachment-tile-uploading bg-background/60 absolute inset-0 flex items-center justify-center backdrop-blur-[1px]",
                    children: /* @__PURE__ */ f(Fk, { className: "text-muted-foreground size-5 animate-spin" })
                  }
                ),
                s && /* @__PURE__ */ f(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "aui-attachment-tile-error bg-destructive/10 absolute inset-0 flex items-center justify-center",
                    children: /* @__PURE__ */ f(dh, { className: "text-destructive size-5" })
                  }
                )
              ]
            }
          ) }) }),
          e && /* @__PURE__ */ f(sS, {})
        ]
      }
    ),
    /* @__PURE__ */ H(W_, { side: "top", children: [
      /* @__PURE__ */ f(Qi.Name, {}),
      a && /* @__PURE__ */ f("p", { className: "aui-attachment-error-message", children: a })
    ] })
  ] });
}, sS = () => /* @__PURE__ */ f(Qi.Remove, { asChild: !0, children: /* @__PURE__ */ f(
  er,
  {
    tooltip: "Remove file",
    className: "aui-attachment-tile-remove text-muted-foreground hover:[&_svg]:text-destructive absolute end-1.5 top-1.5 size-3.5 rounded-full bg-white opacity-100 shadow-sm hover:bg-white! [&_svg]:text-black",
    side: "top",
    children: /* @__PURE__ */ f(Qk, { className: "aui-attachment-remove-icon size-3 dark:stroke-[2.5px]" })
  }
) }), aS = () => /* @__PURE__ */ f("div", { className: "aui-user-message-attachments-end col-span-full col-start-1 row-start-1 flex w-full flex-row justify-end gap-2", children: /* @__PURE__ */ f(gr.Attachments, { children: () => /* @__PURE__ */ f(Ph, {}) }) }), lS = () => /* @__PURE__ */ f("div", { className: "aui-composer-attachments flex w-full flex-row items-center gap-2 overflow-x-auto empty:hidden", children: /* @__PURE__ */ f(Lt.Attachments, { children: () => /* @__PURE__ */ f(Ph, {}) }) }), cS = () => /* @__PURE__ */ f(Lt.AddAttachment, { asChild: !0, children: /* @__PURE__ */ f(
  er,
  {
    tooltip: "Add Attachment",
    side: "bottom",
    variant: "ghost",
    size: "icon",
    className: "aui-composer-add-attachment hover:bg-muted-foreground/15 dark:border-muted-foreground/15 dark:hover:bg-muted-foreground/30 size-7 rounded-full p-1 text-xs font-semibold",
    "aria-label": "Add Attachment",
    children: /* @__PURE__ */ f(Vk, { className: "aui-attachment-add-icon size-4.5 stroke-[1.5px]" })
  }
) }), uS = (t, e) => typeof t == "string" ? t === e : JSON.stringify(t) === JSON.stringify(e), dS = (t, e) => {
  if (!t || !e)
    return !1;
  const r = (n) => {
    const { position: i, data: o, ...s } = n || {};
    return s;
  };
  return JSON.stringify(r(t.properties)) === JSON.stringify(r(e.properties)) && uS(t.children, e.children);
}, Xo = (t, e) => dS(t.node, e.node), hS = (t = {}) => Object.fromEntries(Object.entries(t ?? {}).map(([e, r]) => {
  if (!r)
    return [e, r];
  const n = r;
  return [e, we(({ node: o, ...s }) => /* @__PURE__ */ f(n, { ...s }), Xo)];
})), Zo = po(null), Mh = () => Jr(Zo) !== null, pS = ({ children: t, ...e }) => /* @__PURE__ */ f(Zo.Provider, {
  value: e,
  children: t
}), mS = we(pS, Xo), fS = ({ node: t, ...e }) => /* @__PURE__ */ f("pre", { ...e }), gS = ({ node: t, ...e }) => /* @__PURE__ */ f("code", { ...e }), es = ({ node: t, components: { Pre: e, Code: r }, code: n }) => /* @__PURE__ */ f(e, { children: /* @__PURE__ */ f(r, {
  node: t,
  children: n
}) }), bS = () => null, vS = ({ node: t, components: { Pre: e, Code: r, SyntaxHighlighter: n, CodeHeader: i }, language: o, code: s }) => {
  const a = xt(() => ({
    Pre: e,
    Code: r
  }), [e, r]);
  return /* @__PURE__ */ H(tt, { children: [/* @__PURE__ */ f(i, {
    node: t,
    language: o,
    code: s
  }), /* @__PURE__ */ f(o ? n : es, {
    node: t,
    components: a,
    language: o ?? "unknown",
    code: s
  })] });
};
var Dh = { exports: {} };
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
(function(t) {
  (function() {
    var e = {}.hasOwnProperty;
    function r() {
      for (var o = "", s = 0; s < arguments.length; s++) {
        var a = arguments[s];
        a && (o = i(o, n(a)));
      }
      return o;
    }
    function n(o) {
      if (typeof o == "string" || typeof o == "number")
        return o;
      if (typeof o != "object")
        return "";
      if (Array.isArray(o))
        return r.apply(null, o);
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
    t.exports ? (r.default = r, t.exports = r) : window.classNames = r;
  })();
})(Dh);
var wS = Dh.exports;
const Nh = /* @__PURE__ */ Wn(wS), Ja = ({ className: t, ...e }) => ({ className: r, ...n }) => ({
  className: Nh(t, r),
  ...e,
  ...n
}), yS = ({ node: t, components: { Pre: e, Code: r, SyntaxHighlighter: n, CodeHeader: i }, componentsByLanguage: o = {}, children: s, ...a }) => {
  var p, m, g;
  const l = Ja(Jr(Zo)), c = Vt((v) => /* @__PURE__ */ f(e, { ...l(v) })), d = Ja(a), u = Vt((v) => /* @__PURE__ */ f(r, { ...d(v) })), h = ((p = /language-(\w+)/.exec(a.className || "")) == null ? void 0 : p[1]) ?? "";
  return typeof s != "string" ? /* @__PURE__ */ f(es, {
    node: t,
    components: {
      Pre: c,
      Code: u
    },
    code: s
  }) : /* @__PURE__ */ f(vS, {
    node: t,
    components: {
      Pre: c,
      Code: u,
      SyntaxHighlighter: ((m = o[h]) == null ? void 0 : m.SyntaxHighlighter) ?? n,
      CodeHeader: ((g = o[h]) == null ? void 0 : g.CodeHeader) ?? i
    },
    language: h || "unknown",
    code: s
  });
}, xS = ({ node: t, components: e, componentsByLanguage: r, ...n }) => Mh() ? /* @__PURE__ */ f(yS, {
  node: t,
  components: e,
  componentsByLanguage: r,
  ...n
}) : /* @__PURE__ */ f(e.Code, { ...n }), kS = we(xS, (t, e) => t.components === e.components && t.componentsByLanguage === e.componentsByLanguage && Xo(t, e));
function _S(t, e) {
  const r = e || {};
  return (t[t.length - 1] === "" ? [...t, ""] : t).join(
    (r.padRight ? " " : "") + "," + (r.padLeft === !1 ? "" : " ")
  ).trim();
}
const SS = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, CS = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, TS = {};
function Xa(t, e) {
  return ((e || TS).jsx ? CS : SS).test(t);
}
const IS = /[ \t\n\f\r]/g;
function ES(t) {
  return typeof t == "object" ? t.type === "text" ? Za(t.value) : !1 : Za(t);
}
function Za(t) {
  return t.replace(IS, "") === "";
}
class tn {
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
  constructor(e, r, n) {
    this.normal = r, this.property = e, n && (this.space = n);
  }
}
tn.prototype.normal = {};
tn.prototype.property = {};
tn.prototype.space = void 0;
function zh(t, e) {
  const r = {}, n = {};
  for (const i of t)
    Object.assign(r, i.property), Object.assign(n, i.normal);
  return new tn(r, n, e);
}
function Zi(t) {
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
  constructor(e, r) {
    this.attribute = r, this.property = e;
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
let AS = 0;
const X = tr(), ke = tr(), eo = tr(), F = tr(), fe = tr(), $t = tr(), Le = tr();
function tr() {
  return 2 ** ++AS;
}
const to = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean: X,
  booleanish: ke,
  commaOrSpaceSeparated: Le,
  commaSeparated: $t,
  number: F,
  overloadedBoolean: eo,
  spaceSeparated: fe
}, Symbol.toStringTag, { value: "Module" })), wi = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(to)
);
class ts extends ze {
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
  constructor(e, r, n, i) {
    let o = -1;
    if (super(e, r), el(this, "space", i), typeof n == "number")
      for (; ++o < wi.length; ) {
        const s = wi[o];
        el(this, wi[o], (n & to[s]) === to[s]);
      }
  }
}
ts.prototype.defined = !0;
function el(t, e, r) {
  r && (t[e] = r);
}
function kr(t) {
  const e = {}, r = {};
  for (const [n, i] of Object.entries(t.properties)) {
    const o = new ts(
      n,
      t.transform(t.attributes || {}, n),
      i,
      t.space
    );
    t.mustUseProperty && t.mustUseProperty.includes(n) && (o.mustUseProperty = !0), e[n] = o, r[Zi(n)] = n, r[Zi(o.attribute)] = n;
  }
  return new tn(e, r, t.space);
}
const Oh = kr({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: ke,
    ariaAutoComplete: null,
    ariaBusy: ke,
    ariaChecked: ke,
    ariaColCount: F,
    ariaColIndex: F,
    ariaColSpan: F,
    ariaControls: fe,
    ariaCurrent: null,
    ariaDescribedBy: fe,
    ariaDetails: null,
    ariaDisabled: ke,
    ariaDropEffect: fe,
    ariaErrorMessage: null,
    ariaExpanded: ke,
    ariaFlowTo: fe,
    ariaGrabbed: ke,
    ariaHasPopup: null,
    ariaHidden: ke,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: fe,
    ariaLevel: F,
    ariaLive: null,
    ariaModal: ke,
    ariaMultiLine: ke,
    ariaMultiSelectable: ke,
    ariaOrientation: null,
    ariaOwns: fe,
    ariaPlaceholder: null,
    ariaPosInSet: F,
    ariaPressed: ke,
    ariaReadOnly: ke,
    ariaRelevant: null,
    ariaRequired: ke,
    ariaRoleDescription: fe,
    ariaRowCount: F,
    ariaRowIndex: F,
    ariaRowSpan: F,
    ariaSelected: ke,
    ariaSetSize: F,
    ariaSort: null,
    ariaValueMax: F,
    ariaValueMin: F,
    ariaValueNow: F,
    ariaValueText: null,
    role: null
  },
  transform(t, e) {
    return e === "role" ? e : "aria-" + e.slice(4).toLowerCase();
  }
});
function Lh(t, e) {
  return e in t ? t[e] : e;
}
function $h(t, e) {
  return Lh(t, e.toLowerCase());
}
const RS = kr({
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
    accept: $t,
    acceptCharset: fe,
    accessKey: fe,
    action: null,
    allow: null,
    allowFullScreen: X,
    allowPaymentRequest: X,
    allowUserMedia: X,
    alpha: X,
    alt: null,
    as: null,
    async: X,
    autoCapitalize: null,
    autoComplete: fe,
    autoFocus: X,
    autoPlay: X,
    blocking: fe,
    capture: null,
    charSet: null,
    checked: X,
    cite: null,
    className: fe,
    closedBy: null,
    colorSpace: null,
    cols: F,
    colSpan: F,
    command: null,
    commandFor: null,
    content: null,
    contentEditable: ke,
    controls: X,
    controlsList: fe,
    coords: F | $t,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: X,
    defer: X,
    dir: null,
    dirName: null,
    disabled: X,
    download: eo,
    draggable: ke,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: X,
    formTarget: null,
    headers: fe,
    height: F,
    hidden: eo,
    high: F,
    href: null,
    hrefLang: null,
    htmlFor: fe,
    httpEquiv: fe,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: X,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: X,
    itemId: null,
    itemProp: fe,
    itemRef: fe,
    itemScope: X,
    itemType: fe,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: X,
    low: F,
    manifest: null,
    max: null,
    maxLength: F,
    media: null,
    method: null,
    min: null,
    minLength: F,
    multiple: X,
    muted: X,
    name: null,
    nonce: null,
    noModule: X,
    noValidate: X,
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
    open: X,
    optimum: F,
    pattern: null,
    ping: fe,
    placeholder: null,
    playsInline: X,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: X,
    referrerPolicy: null,
    rel: fe,
    required: X,
    reversed: X,
    rows: F,
    rowSpan: F,
    sandbox: fe,
    scope: null,
    scoped: X,
    seamless: X,
    selected: X,
    shadowRootClonable: X,
    shadowRootCustomElementRegistry: X,
    shadowRootDelegatesFocus: X,
    shadowRootMode: null,
    shadowRootSerializable: X,
    shape: null,
    size: F,
    sizes: null,
    slot: null,
    span: F,
    spellCheck: ke,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: F,
    step: null,
    style: null,
    tabIndex: F,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: X,
    useMap: null,
    value: ke,
    width: F,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: fe,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: F,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: F,
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
    compact: X,
    // Lists. Use CSS to reduce space between items instead
    declare: X,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: F,
    // `<img>` and `<object>`
    leftMargin: F,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: F,
    // `<body>`
    marginWidth: F,
    // `<body>`
    noResize: X,
    // `<frame>`
    noHref: X,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: X,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: X,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: F,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: ke,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: F,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: F,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    credentialless: X,
    disablePictureInPicture: X,
    disableRemotePlayback: X,
    exportParts: $t,
    part: fe,
    prefix: null,
    property: null,
    results: F,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: $h
}), PS = kr({
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
    about: Le,
    accentHeight: F,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: F,
    amplitude: F,
    arabicForm: null,
    ascent: F,
    attributeName: null,
    attributeType: null,
    azimuth: F,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: F,
    by: null,
    calcMode: null,
    capHeight: F,
    className: fe,
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
    descent: F,
    diffuseConstant: F,
    direction: null,
    display: null,
    dur: null,
    divisor: F,
    dominantBaseline: null,
    download: X,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: F,
    enableBackground: null,
    end: null,
    event: null,
    exponent: F,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: F,
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
    g1: $t,
    g2: $t,
    glyphName: $t,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: F,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: F,
    horizOriginX: F,
    horizOriginY: F,
    id: null,
    ideographic: F,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: F,
    k: F,
    k1: F,
    k2: F,
    k3: F,
    k4: F,
    kernelMatrix: Le,
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
    limitingConeAngle: F,
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
    mediaSize: F,
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
    overlinePosition: F,
    overlineThickness: F,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: F,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: fe,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: F,
    pointsAtY: F,
    pointsAtZ: F,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: Le,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: Le,
    rev: Le,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: Le,
    requiredFeatures: Le,
    requiredFonts: Le,
    requiredFormats: Le,
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
    specularConstant: F,
    specularExponent: F,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: F,
    strikethroughThickness: F,
    string: null,
    stroke: null,
    strokeDashArray: Le,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: F,
    strokeOpacity: F,
    strokeWidth: null,
    style: null,
    surfaceScale: F,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: Le,
    tabIndex: F,
    tableValues: null,
    target: null,
    targetX: F,
    targetY: F,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: Le,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: F,
    underlineThickness: F,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: F,
    values: null,
    vAlphabetic: F,
    vMathematical: F,
    vectorEffect: null,
    vHanging: F,
    vIdeographic: F,
    version: null,
    vertAdvY: F,
    vertOriginX: F,
    vertOriginY: F,
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
    xHeight: F,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: Lh
}), Bh = kr({
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
}), Fh = kr({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: $h
}), Uh = kr({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(t, e) {
    return "xml:" + e.slice(3).toLowerCase();
  }
}), MS = {
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
}, DS = /[A-Z]/g, tl = /-[a-z]/g, NS = /^data[-\w.:]+$/i;
function zS(t, e) {
  const r = Zi(e);
  let n = e, i = ze;
  if (r in t.normal)
    return t.property[t.normal[r]];
  if (r.length > 4 && r.slice(0, 4) === "data" && NS.test(e)) {
    if (e.charAt(4) === "-") {
      const o = e.slice(5).replace(tl, LS);
      n = "data" + o.charAt(0).toUpperCase() + o.slice(1);
    } else {
      const o = e.slice(4);
      if (!tl.test(o)) {
        let s = o.replace(DS, OS);
        s.charAt(0) !== "-" && (s = "-" + s), e = "data" + s;
      }
    }
    i = ts;
  }
  return new i(n, e);
}
function OS(t) {
  return "-" + t.toLowerCase();
}
function LS(t) {
  return t.charAt(1).toUpperCase();
}
const $S = zh([Oh, RS, Bh, Fh, Uh], "html"), rs = zh([Oh, PS, Bh, Fh, Uh], "svg");
function BS(t) {
  return t.join(" ").trim();
}
var ns = {}, rl = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, FS = /\n/g, US = /^\s*/, jS = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, VS = /^:\s*/, qS = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, HS = /^[;\s]*/, GS = /^\s+|\s+$/g, WS = `
`, nl = "/", il = "*", Ot = "", KS = "comment", QS = "declaration";
function YS(t, e) {
  if (typeof t != "string")
    throw new TypeError("First argument must be a string");
  if (!t)
    return [];
  e = e || {};
  var r = 1, n = 1;
  function i(m) {
    var g = m.match(FS);
    g && (r += g.length);
    var v = m.lastIndexOf(WS);
    n = ~v ? m.length - v : n + m.length;
  }
  function o() {
    var m = { line: r, column: n };
    return function(g) {
      return g.position = new s(m), c(), g;
    };
  }
  function s(m) {
    this.start = m, this.end = { line: r, column: n }, this.source = e.source;
  }
  s.prototype.content = t;
  function a(m) {
    var g = new Error(
      e.source + ":" + r + ":" + n + ": " + m
    );
    if (g.reason = m, g.filename = e.source, g.line = r, g.column = n, g.source = t, !e.silent)
      throw g;
  }
  function l(m) {
    var g = m.exec(t);
    if (g) {
      var v = g[0];
      return i(v), t = t.slice(v.length), g;
    }
  }
  function c() {
    l(US);
  }
  function d(m) {
    var g;
    for (m = m || []; g = u(); )
      g !== !1 && m.push(g);
    return m;
  }
  function u() {
    var m = o();
    if (!(nl != t.charAt(0) || il != t.charAt(1))) {
      for (var g = 2; Ot != t.charAt(g) && (il != t.charAt(g) || nl != t.charAt(g + 1)); )
        ++g;
      if (g += 2, Ot === t.charAt(g - 1))
        return a("End of comment missing");
      var v = t.slice(2, g - 2);
      return n += 2, i(v), t = t.slice(g), n += 2, m({
        type: KS,
        comment: v
      });
    }
  }
  function h() {
    var m = o(), g = l(jS);
    if (g) {
      if (u(), !l(VS))
        return a("property missing ':'");
      var v = l(qS), b = m({
        type: QS,
        property: ol(g[0].replace(rl, Ot)),
        value: v ? ol(v[0].replace(rl, Ot)) : Ot
      });
      return l(HS), b;
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
function ol(t) {
  return t ? t.replace(GS, Ot) : Ot;
}
var JS = YS, XS = In && In.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
};
Object.defineProperty(ns, "__esModule", { value: !0 });
ns.default = eC;
const ZS = XS(JS);
function eC(t, e) {
  let r = null;
  if (!t || typeof t != "string")
    return r;
  const n = (0, ZS.default)(t), i = typeof e == "function";
  return n.forEach((o) => {
    if (o.type !== "declaration")
      return;
    const { property: s, value: a } = o;
    i ? e(s, a, o) : a && (r = r || {}, r[s] = a);
  }), r;
}
var Xn = {};
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.camelCase = void 0;
var tC = /^--[a-zA-Z0-9_-]+$/, rC = /-([a-z])/g, nC = /^[^-]+$/, iC = /^-(webkit|moz|ms|o|khtml)-/, oC = /^-(ms)-/, sC = function(t) {
  return !t || nC.test(t) || tC.test(t);
}, aC = function(t, e) {
  return e.toUpperCase();
}, sl = function(t, e) {
  return "".concat(e, "-");
}, lC = function(t, e) {
  return e === void 0 && (e = {}), sC(t) ? t : (t = t.toLowerCase(), e.reactCompat ? t = t.replace(oC, sl) : t = t.replace(iC, sl), t.replace(rC, aC));
};
Xn.camelCase = lC;
var cC = In && In.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
}, uC = cC(ns), dC = Xn;
function ro(t, e) {
  var r = {};
  return !t || typeof t != "string" || (0, uC.default)(t, function(n, i) {
    n && i && (r[(0, dC.camelCase)(n, e)] = i);
  }), r;
}
ro.default = ro;
var hC = ro;
const pC = /* @__PURE__ */ Wn(hC), jh = Vh("end"), is = Vh("start");
function Vh(t) {
  return e;
  function e(r) {
    const n = r && r.position && r.position[t] || {};
    if (typeof n.line == "number" && n.line > 0 && typeof n.column == "number" && n.column > 0)
      return {
        line: n.line,
        column: n.column,
        offset: typeof n.offset == "number" && n.offset > -1 ? n.offset : void 0
      };
  }
}
function mC(t) {
  const e = is(t), r = jh(t);
  if (e && r)
    return { start: e, end: r };
}
function Or(t) {
  return !t || typeof t != "object" ? "" : "position" in t || "type" in t ? al(t.position) : "start" in t || "end" in t ? al(t) : "line" in t || "column" in t ? no(t) : "";
}
function no(t) {
  return ll(t && t.line) + ":" + ll(t && t.column);
}
function al(t) {
  return no(t && t.start) + "-" + no(t && t.end);
}
function ll(t) {
  return t && typeof t == "number" ? t : 1;
}
class Re extends Error {
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
  constructor(e, r, n) {
    super(), typeof r == "string" && (n = r, r = void 0);
    let i = "", o = {}, s = !1;
    if (r && ("line" in r && "column" in r ? o = { place: r } : "start" in r && "end" in r ? o = { place: r } : "type" in r ? o = {
      ancestors: [r],
      place: r.position
    } : o = { ...r }), typeof e == "string" ? i = e : !o.cause && e && (s = !0, i = e.message, o.cause = e), !o.ruleId && !o.source && typeof n == "string") {
      const l = n.indexOf(":");
      l === -1 ? o.ruleId = n : (o.source = n.slice(0, l), o.ruleId = n.slice(l + 1));
    }
    if (!o.place && o.ancestors && o.ancestors) {
      const l = o.ancestors[o.ancestors.length - 1];
      l && (o.place = l.position);
    }
    const a = o.place && "start" in o.place ? o.place.start : o.place;
    this.ancestors = o.ancestors || void 0, this.cause = o.cause || void 0, this.column = a ? a.column : void 0, this.fatal = void 0, this.file = "", this.message = i, this.line = a ? a.line : void 0, this.name = Or(o.place) || "1:1", this.place = o.place || void 0, this.reason = this.message, this.ruleId = o.ruleId || void 0, this.source = o.source || void 0, this.stack = s && o.cause && typeof o.cause.stack == "string" ? o.cause.stack : "", this.actual = void 0, this.expected = void 0, this.note = void 0, this.url = void 0;
  }
}
Re.prototype.file = "";
Re.prototype.name = "";
Re.prototype.reason = "";
Re.prototype.message = "";
Re.prototype.stack = "";
Re.prototype.column = void 0;
Re.prototype.line = void 0;
Re.prototype.ancestors = void 0;
Re.prototype.cause = void 0;
Re.prototype.fatal = void 0;
Re.prototype.place = void 0;
Re.prototype.ruleId = void 0;
Re.prototype.source = void 0;
const os = {}.hasOwnProperty, fC = /* @__PURE__ */ new Map(), gC = /[A-Z]/g, bC = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"]), vC = /* @__PURE__ */ new Set(["td", "th"]), qh = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function wC(t, e) {
  if (!e || e.Fragment === void 0)
    throw new TypeError("Expected `Fragment` in options");
  const r = e.filePath || void 0;
  let n;
  if (e.development) {
    if (typeof e.jsxDEV != "function")
      throw new TypeError(
        "Expected `jsxDEV` in options when `development: true`"
      );
    n = IC(r, e.jsxDEV);
  } else {
    if (typeof e.jsx != "function")
      throw new TypeError("Expected `jsx` in production options");
    if (typeof e.jsxs != "function")
      throw new TypeError("Expected `jsxs` in production options");
    n = TC(r, e.jsx, e.jsxs);
  }
  const i = {
    Fragment: e.Fragment,
    ancestors: [],
    components: e.components || {},
    create: n,
    elementAttributeNameCase: e.elementAttributeNameCase || "react",
    evaluater: e.createEvaluater ? e.createEvaluater() : void 0,
    filePath: r,
    ignoreInvalidStyle: e.ignoreInvalidStyle || !1,
    passKeys: e.passKeys !== !1,
    passNode: e.passNode || !1,
    schema: e.space === "svg" ? rs : $S,
    stylePropertyNameCase: e.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: e.tableCellAlignToStyle !== !1
  }, o = Hh(i, t, void 0);
  return o && typeof o != "string" ? o : i.create(
    t,
    i.Fragment,
    { children: o || void 0 },
    void 0
  );
}
function Hh(t, e, r) {
  if (e.type === "element")
    return yC(t, e, r);
  if (e.type === "mdxFlowExpression" || e.type === "mdxTextExpression")
    return xC(t, e);
  if (e.type === "mdxJsxFlowElement" || e.type === "mdxJsxTextElement")
    return _C(t, e, r);
  if (e.type === "mdxjsEsm")
    return kC(t, e);
  if (e.type === "root")
    return SC(t, e, r);
  if (e.type === "text")
    return CC(t, e);
}
function yC(t, e, r) {
  const n = t.schema;
  let i = n;
  e.tagName.toLowerCase() === "svg" && n.space === "html" && (i = rs, t.schema = i), t.ancestors.push(e);
  const o = Wh(t, e.tagName, !1), s = EC(t, e);
  let a = as(t, e);
  return bC.has(e.tagName) && (a = a.filter(function(l) {
    return typeof l == "string" ? !ES(l) : !0;
  })), Gh(t, s, o, e), ss(s, a), t.ancestors.pop(), t.schema = n, t.create(e, o, s, r);
}
function xC(t, e) {
  if (e.data && e.data.estree && t.evaluater) {
    const n = e.data.estree.body[0];
    return n.type, /** @type {Child | undefined} */
    t.evaluater.evaluateExpression(n.expression);
  }
  Hr(t, e.position);
}
function kC(t, e) {
  if (e.data && e.data.estree && t.evaluater)
    return (
      /** @type {Child | undefined} */
      t.evaluater.evaluateProgram(e.data.estree)
    );
  Hr(t, e.position);
}
function _C(t, e, r) {
  const n = t.schema;
  let i = n;
  e.name === "svg" && n.space === "html" && (i = rs, t.schema = i), t.ancestors.push(e);
  const o = e.name === null ? t.Fragment : Wh(t, e.name, !0), s = AC(t, e), a = as(t, e);
  return Gh(t, s, o, e), ss(s, a), t.ancestors.pop(), t.schema = n, t.create(e, o, s, r);
}
function SC(t, e, r) {
  const n = {};
  return ss(n, as(t, e)), t.create(e, t.Fragment, n, r);
}
function CC(t, e) {
  return e.value;
}
function Gh(t, e, r, n) {
  typeof r != "string" && r !== t.Fragment && t.passNode && (e.node = n);
}
function ss(t, e) {
  if (e.length > 0) {
    const r = e.length > 1 ? e : e[0];
    r && (t.children = r);
  }
}
function TC(t, e, r) {
  return n;
  function n(i, o, s, a) {
    const c = Array.isArray(s.children) ? r : e;
    return a ? c(o, s, a) : c(o, s);
  }
}
function IC(t, e) {
  return r;
  function r(n, i, o, s) {
    const a = Array.isArray(o.children), l = is(n);
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
function EC(t, e) {
  const r = {};
  let n, i;
  for (i in e.properties)
    if (i !== "children" && os.call(e.properties, i)) {
      const o = RC(t, i, e.properties[i]);
      if (o) {
        const [s, a] = o;
        t.tableCellAlignToStyle && s === "align" && typeof a == "string" && vC.has(e.tagName) ? n = a : r[s] = a;
      }
    }
  if (n) {
    const o = (
      /** @type {Style} */
      r.style || (r.style = {})
    );
    o[t.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = n;
  }
  return r;
}
function AC(t, e) {
  const r = {};
  for (const n of e.attributes)
    if (n.type === "mdxJsxExpressionAttribute")
      if (n.data && n.data.estree && t.evaluater) {
        const o = n.data.estree.body[0];
        o.type;
        const s = o.expression;
        s.type;
        const a = s.properties[0];
        a.type, Object.assign(
          r,
          t.evaluater.evaluateExpression(a.argument)
        );
      } else
        Hr(t, e.position);
    else {
      const i = n.name;
      let o;
      if (n.value && typeof n.value == "object")
        if (n.value.data && n.value.data.estree && t.evaluater) {
          const a = n.value.data.estree.body[0];
          a.type, o = t.evaluater.evaluateExpression(a.expression);
        } else
          Hr(t, e.position);
      else
        o = n.value === null ? !0 : n.value;
      r[i] = /** @type {Props[keyof Props]} */
      o;
    }
  return r;
}
function as(t, e) {
  const r = [];
  let n = -1;
  const i = t.passKeys ? /* @__PURE__ */ new Map() : fC;
  for (; ++n < e.children.length; ) {
    const o = e.children[n];
    let s;
    if (t.passKeys) {
      const l = o.type === "element" ? o.tagName : o.type === "mdxJsxFlowElement" || o.type === "mdxJsxTextElement" ? o.name : void 0;
      if (l) {
        const c = i.get(l) || 0;
        s = l + "-" + c, i.set(l, c + 1);
      }
    }
    const a = Hh(t, o, s);
    a !== void 0 && r.push(a);
  }
  return r;
}
function RC(t, e, r) {
  const n = zS(t.schema, e);
  if (!(r == null || typeof r == "number" && Number.isNaN(r))) {
    if (Array.isArray(r) && (r = n.commaSeparated ? _S(r) : BS(r)), n.property === "style") {
      let i = typeof r == "object" ? r : PC(t, String(r));
      return t.stylePropertyNameCase === "css" && (i = MC(i)), ["style", i];
    }
    return [
      t.elementAttributeNameCase === "react" && n.space ? MS[n.property] || n.property : n.attribute,
      r
    ];
  }
}
function PC(t, e) {
  try {
    return pC(e, { reactCompat: !0 });
  } catch (r) {
    if (t.ignoreInvalidStyle)
      return {};
    const n = (
      /** @type {Error} */
      r
    ), i = new Re("Cannot parse `style` attribute", {
      ancestors: t.ancestors,
      cause: n,
      ruleId: "style",
      source: "hast-util-to-jsx-runtime"
    });
    throw i.file = t.filePath || void 0, i.url = qh + "#cannot-parse-style-attribute", i;
  }
}
function Wh(t, e, r) {
  let n;
  if (!r)
    n = { type: "Literal", value: e };
  else if (e.includes(".")) {
    const i = e.split(".");
    let o = -1, s;
    for (; ++o < i.length; ) {
      const a = Xa(i[o]) ? { type: "Identifier", name: i[o] } : { type: "Literal", value: i[o] };
      s = s ? {
        type: "MemberExpression",
        object: s,
        property: a,
        computed: !!(o && a.type === "Literal"),
        optional: !1
      } : a;
    }
    n = s;
  } else
    n = Xa(e) && !/^[a-z]/.test(e) ? { type: "Identifier", name: e } : { type: "Literal", value: e };
  if (n.type === "Literal") {
    const i = (
      /** @type {string | number} */
      n.value
    );
    return os.call(t.components, i) ? t.components[i] : i;
  }
  if (t.evaluater)
    return t.evaluater.evaluateExpression(n);
  Hr(t);
}
function Hr(t, e) {
  const r = new Re(
    "Cannot handle MDX estrees without `createEvaluater`",
    {
      ancestors: t.ancestors,
      place: e,
      ruleId: "mdx-estree",
      source: "hast-util-to-jsx-runtime"
    }
  );
  throw r.file = t.filePath || void 0, r.url = qh + "#cannot-handle-mdx-estrees-without-createevaluater", r;
}
function MC(t) {
  const e = {};
  let r;
  for (r in t)
    os.call(t, r) && (e[DC(r)] = t[r]);
  return e;
}
function DC(t) {
  let e = t.replace(gC, NC);
  return e.slice(0, 3) === "ms-" && (e = "-" + e), e;
}
function NC(t) {
  return "-" + t.toLowerCase();
}
const yi = {
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
}, zC = {};
function ls(t, e) {
  const r = e || zC, n = typeof r.includeImageAlt == "boolean" ? r.includeImageAlt : !0, i = typeof r.includeHtml == "boolean" ? r.includeHtml : !0;
  return Kh(t, n, i);
}
function Kh(t, e, r) {
  if (OC(t)) {
    if ("value" in t)
      return t.type === "html" && !r ? "" : t.value;
    if (e && "alt" in t && t.alt)
      return t.alt;
    if ("children" in t)
      return cl(t.children, e, r);
  }
  return Array.isArray(t) ? cl(t, e, r) : "";
}
function cl(t, e, r) {
  const n = [];
  let i = -1;
  for (; ++i < t.length; )
    n[i] = Kh(t[i], e, r);
  return n.join("");
}
function OC(t) {
  return !!(t && typeof t == "object");
}
const ul = document.createElement("i");
function cs(t) {
  const e = "&" + t + ";";
  ul.innerHTML = e;
  const r = ul.textContent;
  return r.charCodeAt(r.length - 1) === 59 && t !== "semi" || r === e ? !1 : r;
}
function $e(t, e, r, n) {
  const i = t.length;
  let o = 0, s;
  if (e < 0 ? e = -e > i ? 0 : i + e : e = e > i ? i : e, r = r > 0 ? r : 0, n.length < 1e4)
    s = Array.from(n), s.unshift(e, r), t.splice(...s);
  else
    for (r && t.splice(e, r); o < n.length; )
      s = n.slice(o, o + 1e4), s.unshift(e, 0), t.splice(...s), o += 1e4, e += 1e4;
}
function Be(t, e) {
  return t.length > 0 ? ($e(t, t.length, 0, e), t) : e;
}
const dl = {}.hasOwnProperty;
function Qh(t) {
  const e = {};
  let r = -1;
  for (; ++r < t.length; )
    LC(e, t[r]);
  return e;
}
function LC(t, e) {
  let r;
  for (r in e) {
    const i = (dl.call(t, r) ? t[r] : void 0) || (t[r] = {}), o = e[r];
    let s;
    if (o)
      for (s in o) {
        dl.call(i, s) || (i[s] = []);
        const a = o[s];
        $C(
          // @ts-expect-error Looks like a list.
          i[s],
          Array.isArray(a) ? a : a ? [a] : []
        );
      }
  }
}
function $C(t, e) {
  let r = -1;
  const n = [];
  for (; ++r < e.length; )
    (e[r].add === "after" ? t : n).push(e[r]);
  $e(t, 0, 0, n);
}
function Yh(t, e) {
  const r = Number.parseInt(t, e);
  return (
    // C0 except for HT, LF, FF, CR, space.
    r < 9 || r === 11 || r > 13 && r < 32 || // Control character (DEL) of C0, and C1 controls.
    r > 126 && r < 160 || // Lone high surrogates and low surrogates.
    r > 55295 && r < 57344 || // Noncharacters.
    r > 64975 && r < 65008 || /* eslint-disable no-bitwise */
    (r & 65535) === 65535 || (r & 65535) === 65534 || /* eslint-enable no-bitwise */
    // Out of range
    r > 1114111 ? "�" : String.fromCodePoint(r)
  );
}
function Xe(t) {
  return t.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
const Me = Et(/[A-Za-z]/), Ee = Et(/[\dA-Za-z]/), BC = Et(/[#-'*+\--9=?A-Z^-~]/);
function On(t) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    t !== null && (t < 32 || t === 127)
  );
}
const io = Et(/\d/), FC = Et(/[\dA-Fa-f]/), UC = Et(/[!-/:-@[-`{-~]/);
function Y(t) {
  return t !== null && t < -2;
}
function ge(t) {
  return t !== null && (t < 0 || t === 32);
}
function ne(t) {
  return t === -2 || t === -1 || t === 32;
}
const Zn = Et(/\p{P}|\p{S}/u), qt = Et(/\s/);
function Et(t) {
  return e;
  function e(r) {
    return r !== null && r > -1 && t.test(String.fromCharCode(r));
  }
}
function _r(t) {
  const e = [];
  let r = -1, n = 0, i = 0;
  for (; ++r < t.length; ) {
    const o = t.charCodeAt(r);
    let s = "";
    if (o === 37 && Ee(t.charCodeAt(r + 1)) && Ee(t.charCodeAt(r + 2)))
      i = 2;
    else if (o < 128)
      /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(o)) || (s = String.fromCharCode(o));
    else if (o > 55295 && o < 57344) {
      const a = t.charCodeAt(r + 1);
      o < 56320 && a > 56319 && a < 57344 ? (s = String.fromCharCode(o, a), i = 1) : s = "�";
    } else
      s = String.fromCharCode(o);
    s && (e.push(t.slice(n, r), encodeURIComponent(s)), n = r + i + 1, s = ""), i && (r += i, i = 0);
  }
  return e.join("") + t.slice(n);
}
function se(t, e, r, n) {
  const i = n ? n - 1 : Number.POSITIVE_INFINITY;
  let o = 0;
  return s;
  function s(l) {
    return ne(l) ? (t.enter(r), a(l)) : e(l);
  }
  function a(l) {
    return ne(l) && o++ < i ? (t.consume(l), a) : (t.exit(r), e(l));
  }
}
const jC = {
  tokenize: VC
};
function VC(t) {
  const e = t.attempt(this.parser.constructs.contentInitial, n, i);
  let r;
  return e;
  function n(a) {
    if (a === null) {
      t.consume(a);
      return;
    }
    return t.enter("lineEnding"), t.consume(a), t.exit("lineEnding"), se(t, e, "linePrefix");
  }
  function i(a) {
    return t.enter("paragraph"), o(a);
  }
  function o(a) {
    const l = t.enter("chunkText", {
      contentType: "text",
      previous: r
    });
    return r && (r.next = l), r = l, s(a);
  }
  function s(a) {
    if (a === null) {
      t.exit("chunkText"), t.exit("paragraph"), t.consume(a);
      return;
    }
    return Y(a) ? (t.consume(a), t.exit("chunkText"), o) : (t.consume(a), s);
  }
}
const qC = {
  tokenize: HC
}, hl = {
  tokenize: GC
};
function HC(t) {
  const e = this, r = [];
  let n = 0, i, o, s;
  return a;
  function a(x) {
    if (n < r.length) {
      const T = r[n];
      return e.containerState = T[1], t.attempt(T[0].continuation, l, c)(x);
    }
    return c(x);
  }
  function l(x) {
    if (n++, e.containerState._closeFlow) {
      e.containerState._closeFlow = void 0, i && k();
      const T = e.events.length;
      let E = T, y;
      for (; E--; )
        if (e.events[E][0] === "exit" && e.events[E][1].type === "chunkFlow") {
          y = e.events[E][1].end;
          break;
        }
      b(n);
      let P = T;
      for (; P < e.events.length; )
        e.events[P][1].end = {
          ...y
        }, P++;
      return $e(e.events, E + 1, 0, e.events.slice(T)), e.events.length = P, c(x);
    }
    return a(x);
  }
  function c(x) {
    if (n === r.length) {
      if (!i)
        return h(x);
      if (i.currentConstruct && i.currentConstruct.concrete)
        return m(x);
      e.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
    }
    return e.containerState = {}, t.check(hl, d, u)(x);
  }
  function d(x) {
    return i && k(), b(n), h(x);
  }
  function u(x) {
    return e.parser.lazy[e.now().line] = n !== r.length, s = e.now().offset, m(x);
  }
  function h(x) {
    return e.containerState = {}, t.attempt(hl, p, m)(x);
  }
  function p(x) {
    return n++, r.push([e.currentConstruct, e.containerState]), h(x);
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
      v(t.exit("chunkFlow"), !0), b(0), t.consume(x);
      return;
    }
    return Y(x) ? (t.consume(x), v(t.exit("chunkFlow")), n = 0, e.interrupt = void 0, a) : (t.consume(x), g);
  }
  function v(x, T) {
    const E = e.sliceStream(x);
    if (T && E.push(null), x.previous = o, o && (o.next = x), o = x, i.defineSkip(x.start), i.write(E), e.parser.lazy[x.start.line]) {
      let y = i.events.length;
      for (; y--; )
        if (
          // The token starts before the line ending…
          i.events[y][1].start.offset < s && // …and either is not ended yet…
          (!i.events[y][1].end || // …or ends after it.
          i.events[y][1].end.offset > s)
        )
          return;
      const P = e.events.length;
      let R = P, D, _;
      for (; R--; )
        if (e.events[R][0] === "exit" && e.events[R][1].type === "chunkFlow") {
          if (D) {
            _ = e.events[R][1].end;
            break;
          }
          D = !0;
        }
      for (b(n), y = P; y < e.events.length; )
        e.events[y][1].end = {
          ..._
        }, y++;
      $e(e.events, R + 1, 0, e.events.slice(P)), e.events.length = y;
    }
  }
  function b(x) {
    let T = r.length;
    for (; T-- > x; ) {
      const E = r[T];
      e.containerState = E[1], E[0].exit.call(e, t);
    }
    r.length = x;
  }
  function k() {
    i.write([null]), o = void 0, i = void 0, e.containerState._closeFlow = void 0;
  }
}
function GC(t, e, r) {
  return se(t, t.attempt(this.parser.constructs.document, e, r), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
function br(t) {
  if (t === null || ge(t) || qt(t))
    return 1;
  if (Zn(t))
    return 2;
}
function ei(t, e, r) {
  const n = [];
  let i = -1;
  for (; ++i < t.length; ) {
    const o = t[i].resolveAll;
    o && !n.includes(o) && (e = o(e, r), n.push(o));
  }
  return e;
}
const oo = {
  name: "attention",
  resolveAll: WC,
  tokenize: KC
};
function WC(t, e) {
  let r = -1, n, i, o, s, a, l, c, d;
  for (; ++r < t.length; )
    if (t[r][0] === "enter" && t[r][1].type === "attentionSequence" && t[r][1]._close) {
      for (n = r; n--; )
        if (t[n][0] === "exit" && t[n][1].type === "attentionSequence" && t[n][1]._open && // If the markers are the same:
        e.sliceSerialize(t[n][1]).charCodeAt(0) === e.sliceSerialize(t[r][1]).charCodeAt(0)) {
          if ((t[n][1]._close || t[r][1]._open) && (t[r][1].end.offset - t[r][1].start.offset) % 3 && !((t[n][1].end.offset - t[n][1].start.offset + t[r][1].end.offset - t[r][1].start.offset) % 3))
            continue;
          l = t[n][1].end.offset - t[n][1].start.offset > 1 && t[r][1].end.offset - t[r][1].start.offset > 1 ? 2 : 1;
          const u = {
            ...t[n][1].end
          }, h = {
            ...t[r][1].start
          };
          pl(u, -l), pl(h, l), s = {
            type: l > 1 ? "strongSequence" : "emphasisSequence",
            start: u,
            end: {
              ...t[n][1].end
            }
          }, a = {
            type: l > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...t[r][1].start
            },
            end: h
          }, o = {
            type: l > 1 ? "strongText" : "emphasisText",
            start: {
              ...t[n][1].end
            },
            end: {
              ...t[r][1].start
            }
          }, i = {
            type: l > 1 ? "strong" : "emphasis",
            start: {
              ...s.start
            },
            end: {
              ...a.end
            }
          }, t[n][1].end = {
            ...s.start
          }, t[r][1].start = {
            ...a.end
          }, c = [], t[n][1].end.offset - t[n][1].start.offset && (c = Be(c, [["enter", t[n][1], e], ["exit", t[n][1], e]])), c = Be(c, [["enter", i, e], ["enter", s, e], ["exit", s, e], ["enter", o, e]]), c = Be(c, ei(e.parser.constructs.insideSpan.null, t.slice(n + 1, r), e)), c = Be(c, [["exit", o, e], ["enter", a, e], ["exit", a, e], ["exit", i, e]]), t[r][1].end.offset - t[r][1].start.offset ? (d = 2, c = Be(c, [["enter", t[r][1], e], ["exit", t[r][1], e]])) : d = 0, $e(t, n - 1, r - n + 3, c), r = n + c.length - d - 2;
          break;
        }
    }
  for (r = -1; ++r < t.length; )
    t[r][1].type === "attentionSequence" && (t[r][1].type = "data");
  return t;
}
function KC(t, e) {
  const r = this.parser.constructs.attentionMarkers.null, n = this.previous, i = br(n);
  let o;
  return s;
  function s(l) {
    return o = l, t.enter("attentionSequence"), a(l);
  }
  function a(l) {
    if (l === o)
      return t.consume(l), a;
    const c = t.exit("attentionSequence"), d = br(l), u = !d || d === 2 && i || r.includes(l), h = !i || i === 2 && d || r.includes(n);
    return c._open = !!(o === 42 ? u : u && (i || !h)), c._close = !!(o === 42 ? h : h && (d || !u)), e(l);
  }
}
function pl(t, e) {
  t.column += e, t.offset += e, t._bufferIndex += e;
}
const QC = {
  name: "autolink",
  tokenize: YC
};
function YC(t, e, r) {
  let n = 0;
  return i;
  function i(p) {
    return t.enter("autolink"), t.enter("autolinkMarker"), t.consume(p), t.exit("autolinkMarker"), t.enter("autolinkProtocol"), o;
  }
  function o(p) {
    return Me(p) ? (t.consume(p), s) : p === 64 ? r(p) : c(p);
  }
  function s(p) {
    return p === 43 || p === 45 || p === 46 || Ee(p) ? (n = 1, a(p)) : c(p);
  }
  function a(p) {
    return p === 58 ? (t.consume(p), n = 0, l) : (p === 43 || p === 45 || p === 46 || Ee(p)) && n++ < 32 ? (t.consume(p), a) : (n = 0, c(p));
  }
  function l(p) {
    return p === 62 ? (t.exit("autolinkProtocol"), t.enter("autolinkMarker"), t.consume(p), t.exit("autolinkMarker"), t.exit("autolink"), e) : p === null || p === 32 || p === 60 || On(p) ? r(p) : (t.consume(p), l);
  }
  function c(p) {
    return p === 64 ? (t.consume(p), d) : BC(p) ? (t.consume(p), c) : r(p);
  }
  function d(p) {
    return Ee(p) ? u(p) : r(p);
  }
  function u(p) {
    return p === 46 ? (t.consume(p), n = 0, d) : p === 62 ? (t.exit("autolinkProtocol").type = "autolinkEmail", t.enter("autolinkMarker"), t.consume(p), t.exit("autolinkMarker"), t.exit("autolink"), e) : h(p);
  }
  function h(p) {
    if ((p === 45 || Ee(p)) && n++ < 63) {
      const m = p === 45 ? h : u;
      return t.consume(p), m;
    }
    return r(p);
  }
}
const rn = {
  partial: !0,
  tokenize: JC
};
function JC(t, e, r) {
  return n;
  function n(o) {
    return ne(o) ? se(t, i, "linePrefix")(o) : i(o);
  }
  function i(o) {
    return o === null || Y(o) ? e(o) : r(o);
  }
}
const Jh = {
  continuation: {
    tokenize: ZC
  },
  exit: eT,
  name: "blockQuote",
  tokenize: XC
};
function XC(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    if (s === 62) {
      const a = n.containerState;
      return a.open || (t.enter("blockQuote", {
        _container: !0
      }), a.open = !0), t.enter("blockQuotePrefix"), t.enter("blockQuoteMarker"), t.consume(s), t.exit("blockQuoteMarker"), o;
    }
    return r(s);
  }
  function o(s) {
    return ne(s) ? (t.enter("blockQuotePrefixWhitespace"), t.consume(s), t.exit("blockQuotePrefixWhitespace"), t.exit("blockQuotePrefix"), e) : (t.exit("blockQuotePrefix"), e(s));
  }
}
function ZC(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    return ne(s) ? se(t, o, "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(s) : o(s);
  }
  function o(s) {
    return t.attempt(Jh, e, r)(s);
  }
}
function eT(t) {
  t.exit("blockQuote");
}
const Xh = {
  name: "characterEscape",
  tokenize: tT
};
function tT(t, e, r) {
  return n;
  function n(o) {
    return t.enter("characterEscape"), t.enter("escapeMarker"), t.consume(o), t.exit("escapeMarker"), i;
  }
  function i(o) {
    return UC(o) ? (t.enter("characterEscapeValue"), t.consume(o), t.exit("characterEscapeValue"), t.exit("characterEscape"), e) : r(o);
  }
}
const Zh = {
  name: "characterReference",
  tokenize: rT
};
function rT(t, e, r) {
  const n = this;
  let i = 0, o, s;
  return a;
  function a(u) {
    return t.enter("characterReference"), t.enter("characterReferenceMarker"), t.consume(u), t.exit("characterReferenceMarker"), l;
  }
  function l(u) {
    return u === 35 ? (t.enter("characterReferenceMarkerNumeric"), t.consume(u), t.exit("characterReferenceMarkerNumeric"), c) : (t.enter("characterReferenceValue"), o = 31, s = Ee, d(u));
  }
  function c(u) {
    return u === 88 || u === 120 ? (t.enter("characterReferenceMarkerHexadecimal"), t.consume(u), t.exit("characterReferenceMarkerHexadecimal"), t.enter("characterReferenceValue"), o = 6, s = FC, d) : (t.enter("characterReferenceValue"), o = 7, s = io, d(u));
  }
  function d(u) {
    if (u === 59 && i) {
      const h = t.exit("characterReferenceValue");
      return s === Ee && !cs(n.sliceSerialize(h)) ? r(u) : (t.enter("characterReferenceMarker"), t.consume(u), t.exit("characterReferenceMarker"), t.exit("characterReference"), e);
    }
    return s(u) && i++ < o ? (t.consume(u), d) : r(u);
  }
}
const ml = {
  partial: !0,
  tokenize: iT
}, fl = {
  concrete: !0,
  name: "codeFenced",
  tokenize: nT
};
function nT(t, e, r) {
  const n = this, i = {
    partial: !0,
    tokenize: E
  };
  let o = 0, s = 0, a;
  return l;
  function l(y) {
    return c(y);
  }
  function c(y) {
    const P = n.events[n.events.length - 1];
    return o = P && P[1].type === "linePrefix" ? P[2].sliceSerialize(P[1], !0).length : 0, a = y, t.enter("codeFenced"), t.enter("codeFencedFence"), t.enter("codeFencedFenceSequence"), d(y);
  }
  function d(y) {
    return y === a ? (s++, t.consume(y), d) : s < 3 ? r(y) : (t.exit("codeFencedFenceSequence"), ne(y) ? se(t, u, "whitespace")(y) : u(y));
  }
  function u(y) {
    return y === null || Y(y) ? (t.exit("codeFencedFence"), n.interrupt ? e(y) : t.check(ml, g, T)(y)) : (t.enter("codeFencedFenceInfo"), t.enter("chunkString", {
      contentType: "string"
    }), h(y));
  }
  function h(y) {
    return y === null || Y(y) ? (t.exit("chunkString"), t.exit("codeFencedFenceInfo"), u(y)) : ne(y) ? (t.exit("chunkString"), t.exit("codeFencedFenceInfo"), se(t, p, "whitespace")(y)) : y === 96 && y === a ? r(y) : (t.consume(y), h);
  }
  function p(y) {
    return y === null || Y(y) ? u(y) : (t.enter("codeFencedFenceMeta"), t.enter("chunkString", {
      contentType: "string"
    }), m(y));
  }
  function m(y) {
    return y === null || Y(y) ? (t.exit("chunkString"), t.exit("codeFencedFenceMeta"), u(y)) : y === 96 && y === a ? r(y) : (t.consume(y), m);
  }
  function g(y) {
    return t.attempt(i, T, v)(y);
  }
  function v(y) {
    return t.enter("lineEnding"), t.consume(y), t.exit("lineEnding"), b;
  }
  function b(y) {
    return o > 0 && ne(y) ? se(t, k, "linePrefix", o + 1)(y) : k(y);
  }
  function k(y) {
    return y === null || Y(y) ? t.check(ml, g, T)(y) : (t.enter("codeFlowValue"), x(y));
  }
  function x(y) {
    return y === null || Y(y) ? (t.exit("codeFlowValue"), k(y)) : (t.consume(y), x);
  }
  function T(y) {
    return t.exit("codeFenced"), e(y);
  }
  function E(y, P, R) {
    let D = 0;
    return _;
    function _(O) {
      return y.enter("lineEnding"), y.consume(O), y.exit("lineEnding"), I;
    }
    function I(O) {
      return y.enter("codeFencedFence"), ne(O) ? se(y, M, "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(O) : M(O);
    }
    function M(O) {
      return O === a ? (y.enter("codeFencedFenceSequence"), N(O)) : R(O);
    }
    function N(O) {
      return O === a ? (D++, y.consume(O), N) : D >= s ? (y.exit("codeFencedFenceSequence"), ne(O) ? se(y, $, "whitespace")(O) : $(O)) : R(O);
    }
    function $(O) {
      return O === null || Y(O) ? (y.exit("codeFencedFence"), P(O)) : R(O);
    }
  }
}
function iT(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    return s === null ? r(s) : (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), o);
  }
  function o(s) {
    return n.parser.lazy[n.now().line] ? r(s) : e(s);
  }
}
const xi = {
  name: "codeIndented",
  tokenize: sT
}, oT = {
  partial: !0,
  tokenize: aT
};
function sT(t, e, r) {
  const n = this;
  return i;
  function i(c) {
    return t.enter("codeIndented"), se(t, o, "linePrefix", 4 + 1)(c);
  }
  function o(c) {
    const d = n.events[n.events.length - 1];
    return d && d[1].type === "linePrefix" && d[2].sliceSerialize(d[1], !0).length >= 4 ? s(c) : r(c);
  }
  function s(c) {
    return c === null ? l(c) : Y(c) ? t.attempt(oT, s, l)(c) : (t.enter("codeFlowValue"), a(c));
  }
  function a(c) {
    return c === null || Y(c) ? (t.exit("codeFlowValue"), s(c)) : (t.consume(c), a);
  }
  function l(c) {
    return t.exit("codeIndented"), e(c);
  }
}
function aT(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    return n.parser.lazy[n.now().line] ? r(s) : Y(s) ? (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), i) : se(t, o, "linePrefix", 4 + 1)(s);
  }
  function o(s) {
    const a = n.events[n.events.length - 1];
    return a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? e(s) : Y(s) ? i(s) : r(s);
  }
}
const lT = {
  name: "codeText",
  previous: uT,
  resolve: cT,
  tokenize: dT
};
function cT(t) {
  let e = t.length - 4, r = 3, n, i;
  if ((t[r][1].type === "lineEnding" || t[r][1].type === "space") && (t[e][1].type === "lineEnding" || t[e][1].type === "space")) {
    for (n = r; ++n < e; )
      if (t[n][1].type === "codeTextData") {
        t[r][1].type = "codeTextPadding", t[e][1].type = "codeTextPadding", r += 2, e -= 2;
        break;
      }
  }
  for (n = r - 1, e++; ++n <= e; )
    i === void 0 ? n !== e && t[n][1].type !== "lineEnding" && (i = n) : (n === e || t[n][1].type === "lineEnding") && (t[i][1].type = "codeTextData", n !== i + 2 && (t[i][1].end = t[n - 1][1].end, t.splice(i + 2, n - i - 2), e -= n - i - 2, n = i + 2), i = void 0);
  return t;
}
function uT(t) {
  return t !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function dT(t, e, r) {
  let n = 0, i, o;
  return s;
  function s(u) {
    return t.enter("codeText"), t.enter("codeTextSequence"), a(u);
  }
  function a(u) {
    return u === 96 ? (t.consume(u), n++, a) : (t.exit("codeTextSequence"), l(u));
  }
  function l(u) {
    return u === null ? r(u) : u === 32 ? (t.enter("space"), t.consume(u), t.exit("space"), l) : u === 96 ? (o = t.enter("codeTextSequence"), i = 0, d(u)) : Y(u) ? (t.enter("lineEnding"), t.consume(u), t.exit("lineEnding"), l) : (t.enter("codeTextData"), c(u));
  }
  function c(u) {
    return u === null || u === 32 || u === 96 || Y(u) ? (t.exit("codeTextData"), l(u)) : (t.consume(u), c);
  }
  function d(u) {
    return u === 96 ? (t.consume(u), i++, d) : i === n ? (t.exit("codeTextSequence"), t.exit("codeText"), e(u)) : (o.type = "codeTextData", c(u));
  }
}
class hT {
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
  slice(e, r) {
    const n = r ?? Number.POSITIVE_INFINITY;
    return n < this.left.length ? this.left.slice(e, n) : e > this.left.length ? this.right.slice(this.right.length - n + this.left.length, this.right.length - e + this.left.length).reverse() : this.left.slice(e).concat(this.right.slice(this.right.length - n + this.left.length).reverse());
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
  splice(e, r, n) {
    const i = r || 0;
    this.setCursor(Math.trunc(e));
    const o = this.right.splice(this.right.length - i, Number.POSITIVE_INFINITY);
    return n && Pr(this.left, n), o.reverse();
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
    this.setCursor(Number.POSITIVE_INFINITY), Pr(this.left, e);
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
    this.setCursor(0), Pr(this.right, e.reverse());
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
        const r = this.left.splice(e, Number.POSITIVE_INFINITY);
        Pr(this.right, r.reverse());
      } else {
        const r = this.right.splice(this.left.length + this.right.length - e, Number.POSITIVE_INFINITY);
        Pr(this.left, r.reverse());
      }
  }
}
function Pr(t, e) {
  let r = 0;
  if (e.length < 1e4)
    t.push(...e);
  else
    for (; r < e.length; )
      t.push(...e.slice(r, r + 1e4)), r += 1e4;
}
function ep(t) {
  const e = {};
  let r = -1, n, i, o, s, a, l, c;
  const d = new hT(t);
  for (; ++r < d.length; ) {
    for (; r in e; )
      r = e[r];
    if (n = d.get(r), r && n[1].type === "chunkFlow" && d.get(r - 1)[1].type === "listItemPrefix" && (l = n[1]._tokenizer.events, o = 0, o < l.length && l[o][1].type === "lineEndingBlank" && (o += 2), o < l.length && l[o][1].type === "content"))
      for (; ++o < l.length && l[o][1].type !== "content"; )
        l[o][1].type === "chunkText" && (l[o][1]._isInFirstContentOfListItem = !0, o++);
    if (n[0] === "enter")
      n[1].contentType && (Object.assign(e, pT(d, r)), r = e[r], c = !0);
    else if (n[1]._container) {
      for (o = r, i = void 0; o--; )
        if (s = d.get(o), s[1].type === "lineEnding" || s[1].type === "lineEndingBlank")
          s[0] === "enter" && (i && (d.get(i)[1].type = "lineEndingBlank"), s[1].type = "lineEnding", i = o);
        else if (!(s[1].type === "linePrefix" || s[1].type === "listItemIndent"))
          break;
      i && (n[1].end = {
        ...d.get(i)[1].start
      }, a = d.slice(i, r), a.unshift(n), d.splice(i, r - i + 1, a));
    }
  }
  return $e(t, 0, Number.POSITIVE_INFINITY, d.slice(0)), !c;
}
function pT(t, e) {
  const r = t.get(e)[1], n = t.get(e)[2];
  let i = e - 1;
  const o = [];
  let s = r._tokenizer;
  s || (s = n.parser[r.contentType](r.start), r._contentTypeTextTrailing && (s._contentTypeTextTrailing = !0));
  const a = s.events, l = [], c = {};
  let d, u, h = -1, p = r, m = 0, g = 0;
  const v = [g];
  for (; p; ) {
    for (; t.get(++i)[1] !== p; )
      ;
    o.push(i), p._tokenizer || (d = n.sliceStream(p), p.next || d.push(null), u && s.defineSkip(p.start), p._isInFirstContentOfListItem && (s._gfmTasklistFirstContentOfListItem = !0), s.write(d), p._isInFirstContentOfListItem && (s._gfmTasklistFirstContentOfListItem = void 0)), u = p, p = p.next;
  }
  for (p = r; ++h < a.length; )
    // Find a void token that includes a break.
    a[h][0] === "exit" && a[h - 1][0] === "enter" && a[h][1].type === a[h - 1][1].type && a[h][1].start.line !== a[h][1].end.line && (g = h + 1, v.push(g), p._tokenizer = void 0, p.previous = void 0, p = p.next);
  for (s.events = [], p ? (p._tokenizer = void 0, p.previous = void 0) : v.pop(), h = v.length; h--; ) {
    const b = a.slice(v[h], v[h + 1]), k = o.pop();
    l.push([k, k + b.length - 1]), t.splice(k, 2, b);
  }
  for (l.reverse(), h = -1; ++h < l.length; )
    c[m + l[h][0]] = m + l[h][1], m += l[h][1] - l[h][0] - 1;
  return c;
}
const mT = {
  resolve: gT,
  tokenize: bT
}, fT = {
  partial: !0,
  tokenize: vT
};
function gT(t) {
  return ep(t), t;
}
function bT(t, e) {
  let r;
  return n;
  function n(a) {
    return t.enter("content"), r = t.enter("chunkContent", {
      contentType: "content"
    }), i(a);
  }
  function i(a) {
    return a === null ? o(a) : Y(a) ? t.check(fT, s, o)(a) : (t.consume(a), i);
  }
  function o(a) {
    return t.exit("chunkContent"), t.exit("content"), e(a);
  }
  function s(a) {
    return t.consume(a), t.exit("chunkContent"), r.next = t.enter("chunkContent", {
      contentType: "content",
      previous: r
    }), r = r.next, i;
  }
}
function vT(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    return t.exit("chunkContent"), t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), se(t, o, "linePrefix");
  }
  function o(s) {
    if (s === null || Y(s))
      return r(s);
    const a = n.events[n.events.length - 1];
    return !n.parser.constructs.disable.null.includes("codeIndented") && a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? e(s) : t.interrupt(n.parser.constructs.flow, r, e)(s);
  }
}
function tp(t, e, r, n, i, o, s, a, l) {
  const c = l || Number.POSITIVE_INFINITY;
  let d = 0;
  return u;
  function u(b) {
    return b === 60 ? (t.enter(n), t.enter(i), t.enter(o), t.consume(b), t.exit(o), h) : b === null || b === 32 || b === 41 || On(b) ? r(b) : (t.enter(n), t.enter(s), t.enter(a), t.enter("chunkString", {
      contentType: "string"
    }), g(b));
  }
  function h(b) {
    return b === 62 ? (t.enter(o), t.consume(b), t.exit(o), t.exit(i), t.exit(n), e) : (t.enter(a), t.enter("chunkString", {
      contentType: "string"
    }), p(b));
  }
  function p(b) {
    return b === 62 ? (t.exit("chunkString"), t.exit(a), h(b)) : b === null || b === 60 || Y(b) ? r(b) : (t.consume(b), b === 92 ? m : p);
  }
  function m(b) {
    return b === 60 || b === 62 || b === 92 ? (t.consume(b), p) : p(b);
  }
  function g(b) {
    return !d && (b === null || b === 41 || ge(b)) ? (t.exit("chunkString"), t.exit(a), t.exit(s), t.exit(n), e(b)) : d < c && b === 40 ? (t.consume(b), d++, g) : b === 41 ? (t.consume(b), d--, g) : b === null || b === 32 || b === 40 || On(b) ? r(b) : (t.consume(b), b === 92 ? v : g);
  }
  function v(b) {
    return b === 40 || b === 41 || b === 92 ? (t.consume(b), g) : g(b);
  }
}
function rp(t, e, r, n, i, o) {
  const s = this;
  let a = 0, l;
  return c;
  function c(p) {
    return t.enter(n), t.enter(i), t.consume(p), t.exit(i), t.enter(o), d;
  }
  function d(p) {
    return a > 999 || p === null || p === 91 || p === 93 && !l || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    p === 94 && !a && "_hiddenFootnoteSupport" in s.parser.constructs ? r(p) : p === 93 ? (t.exit(o), t.enter(i), t.consume(p), t.exit(i), t.exit(n), e) : Y(p) ? (t.enter("lineEnding"), t.consume(p), t.exit("lineEnding"), d) : (t.enter("chunkString", {
      contentType: "string"
    }), u(p));
  }
  function u(p) {
    return p === null || p === 91 || p === 93 || Y(p) || a++ > 999 ? (t.exit("chunkString"), d(p)) : (t.consume(p), l || (l = !ne(p)), p === 92 ? h : u);
  }
  function h(p) {
    return p === 91 || p === 92 || p === 93 ? (t.consume(p), a++, u) : u(p);
  }
}
function np(t, e, r, n, i, o) {
  let s;
  return a;
  function a(h) {
    return h === 34 || h === 39 || h === 40 ? (t.enter(n), t.enter(i), t.consume(h), t.exit(i), s = h === 40 ? 41 : h, l) : r(h);
  }
  function l(h) {
    return h === s ? (t.enter(i), t.consume(h), t.exit(i), t.exit(n), e) : (t.enter(o), c(h));
  }
  function c(h) {
    return h === s ? (t.exit(o), l(s)) : h === null ? r(h) : Y(h) ? (t.enter("lineEnding"), t.consume(h), t.exit("lineEnding"), se(t, c, "linePrefix")) : (t.enter("chunkString", {
      contentType: "string"
    }), d(h));
  }
  function d(h) {
    return h === s || h === null || Y(h) ? (t.exit("chunkString"), c(h)) : (t.consume(h), h === 92 ? u : d);
  }
  function u(h) {
    return h === s || h === 92 ? (t.consume(h), d) : d(h);
  }
}
function Lr(t, e) {
  let r;
  return n;
  function n(i) {
    return Y(i) ? (t.enter("lineEnding"), t.consume(i), t.exit("lineEnding"), r = !0, n) : ne(i) ? se(t, n, r ? "linePrefix" : "lineSuffix")(i) : e(i);
  }
}
const wT = {
  name: "definition",
  tokenize: xT
}, yT = {
  partial: !0,
  tokenize: kT
};
function xT(t, e, r) {
  const n = this;
  let i;
  return o;
  function o(p) {
    return t.enter("definition"), s(p);
  }
  function s(p) {
    return rp.call(
      n,
      t,
      a,
      // Note: we don’t need to reset the way `markdown-rs` does.
      r,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(p);
  }
  function a(p) {
    return i = Xe(n.sliceSerialize(n.events[n.events.length - 1][1]).slice(1, -1)), p === 58 ? (t.enter("definitionMarker"), t.consume(p), t.exit("definitionMarker"), l) : r(p);
  }
  function l(p) {
    return ge(p) ? Lr(t, c)(p) : c(p);
  }
  function c(p) {
    return tp(
      t,
      d,
      // Note: we don’t need to reset the way `markdown-rs` does.
      r,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(p);
  }
  function d(p) {
    return t.attempt(yT, u, u)(p);
  }
  function u(p) {
    return ne(p) ? se(t, h, "whitespace")(p) : h(p);
  }
  function h(p) {
    return p === null || Y(p) ? (t.exit("definition"), n.parser.defined.push(i), e(p)) : r(p);
  }
}
function kT(t, e, r) {
  return n;
  function n(a) {
    return ge(a) ? Lr(t, i)(a) : r(a);
  }
  function i(a) {
    return np(t, o, r, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(a);
  }
  function o(a) {
    return ne(a) ? se(t, s, "whitespace")(a) : s(a);
  }
  function s(a) {
    return a === null || Y(a) ? e(a) : r(a);
  }
}
const _T = {
  name: "hardBreakEscape",
  tokenize: ST
};
function ST(t, e, r) {
  return n;
  function n(o) {
    return t.enter("hardBreakEscape"), t.consume(o), i;
  }
  function i(o) {
    return Y(o) ? (t.exit("hardBreakEscape"), e(o)) : r(o);
  }
}
const CT = {
  name: "headingAtx",
  resolve: TT,
  tokenize: IT
};
function TT(t, e) {
  let r = t.length - 2, n = 3, i, o;
  return t[n][1].type === "whitespace" && (n += 2), r - 2 > n && t[r][1].type === "whitespace" && (r -= 2), t[r][1].type === "atxHeadingSequence" && (n === r - 1 || r - 4 > n && t[r - 2][1].type === "whitespace") && (r -= n + 1 === r ? 2 : 4), r > n && (i = {
    type: "atxHeadingText",
    start: t[n][1].start,
    end: t[r][1].end
  }, o = {
    type: "chunkText",
    start: t[n][1].start,
    end: t[r][1].end,
    contentType: "text"
  }, $e(t, n, r - n + 1, [["enter", i, e], ["enter", o, e], ["exit", o, e], ["exit", i, e]])), t;
}
function IT(t, e, r) {
  let n = 0;
  return i;
  function i(d) {
    return t.enter("atxHeading"), o(d);
  }
  function o(d) {
    return t.enter("atxHeadingSequence"), s(d);
  }
  function s(d) {
    return d === 35 && n++ < 6 ? (t.consume(d), s) : d === null || ge(d) ? (t.exit("atxHeadingSequence"), a(d)) : r(d);
  }
  function a(d) {
    return d === 35 ? (t.enter("atxHeadingSequence"), l(d)) : d === null || Y(d) ? (t.exit("atxHeading"), e(d)) : ne(d) ? se(t, a, "whitespace")(d) : (t.enter("atxHeadingText"), c(d));
  }
  function l(d) {
    return d === 35 ? (t.consume(d), l) : (t.exit("atxHeadingSequence"), a(d));
  }
  function c(d) {
    return d === null || d === 35 || ge(d) ? (t.exit("atxHeadingText"), a(d)) : (t.consume(d), c);
  }
}
const ET = [
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
], gl = ["pre", "script", "style", "textarea"], AT = {
  concrete: !0,
  name: "htmlFlow",
  resolveTo: MT,
  tokenize: DT
}, RT = {
  partial: !0,
  tokenize: zT
}, PT = {
  partial: !0,
  tokenize: NT
};
function MT(t) {
  let e = t.length;
  for (; e-- && !(t[e][0] === "enter" && t[e][1].type === "htmlFlow"); )
    ;
  return e > 1 && t[e - 2][1].type === "linePrefix" && (t[e][1].start = t[e - 2][1].start, t[e + 1][1].start = t[e - 2][1].start, t.splice(e - 2, 2)), t;
}
function DT(t, e, r) {
  const n = this;
  let i, o, s, a, l;
  return c;
  function c(S) {
    return d(S);
  }
  function d(S) {
    return t.enter("htmlFlow"), t.enter("htmlFlowData"), t.consume(S), u;
  }
  function u(S) {
    return S === 33 ? (t.consume(S), h) : S === 47 ? (t.consume(S), o = !0, g) : S === 63 ? (t.consume(S), i = 3, n.interrupt ? e : w) : Me(S) ? (t.consume(S), s = String.fromCharCode(S), v) : r(S);
  }
  function h(S) {
    return S === 45 ? (t.consume(S), i = 2, p) : S === 91 ? (t.consume(S), i = 5, a = 0, m) : Me(S) ? (t.consume(S), i = 4, n.interrupt ? e : w) : r(S);
  }
  function p(S) {
    return S === 45 ? (t.consume(S), n.interrupt ? e : w) : r(S);
  }
  function m(S) {
    const xe = "CDATA[";
    return S === xe.charCodeAt(a++) ? (t.consume(S), a === xe.length ? n.interrupt ? e : M : m) : r(S);
  }
  function g(S) {
    return Me(S) ? (t.consume(S), s = String.fromCharCode(S), v) : r(S);
  }
  function v(S) {
    if (S === null || S === 47 || S === 62 || ge(S)) {
      const xe = S === 47, pe = s.toLowerCase();
      return !xe && !o && gl.includes(pe) ? (i = 1, n.interrupt ? e(S) : M(S)) : ET.includes(s.toLowerCase()) ? (i = 6, xe ? (t.consume(S), b) : n.interrupt ? e(S) : M(S)) : (i = 7, n.interrupt && !n.parser.lazy[n.now().line] ? r(S) : o ? k(S) : x(S));
    }
    return S === 45 || Ee(S) ? (t.consume(S), s += String.fromCharCode(S), v) : r(S);
  }
  function b(S) {
    return S === 62 ? (t.consume(S), n.interrupt ? e : M) : r(S);
  }
  function k(S) {
    return ne(S) ? (t.consume(S), k) : _(S);
  }
  function x(S) {
    return S === 47 ? (t.consume(S), _) : S === 58 || S === 95 || Me(S) ? (t.consume(S), T) : ne(S) ? (t.consume(S), x) : _(S);
  }
  function T(S) {
    return S === 45 || S === 46 || S === 58 || S === 95 || Ee(S) ? (t.consume(S), T) : E(S);
  }
  function E(S) {
    return S === 61 ? (t.consume(S), y) : ne(S) ? (t.consume(S), E) : x(S);
  }
  function y(S) {
    return S === null || S === 60 || S === 61 || S === 62 || S === 96 ? r(S) : S === 34 || S === 39 ? (t.consume(S), l = S, P) : ne(S) ? (t.consume(S), y) : R(S);
  }
  function P(S) {
    return S === l ? (t.consume(S), l = null, D) : S === null || Y(S) ? r(S) : (t.consume(S), P);
  }
  function R(S) {
    return S === null || S === 34 || S === 39 || S === 47 || S === 60 || S === 61 || S === 62 || S === 96 || ge(S) ? E(S) : (t.consume(S), R);
  }
  function D(S) {
    return S === 47 || S === 62 || ne(S) ? x(S) : r(S);
  }
  function _(S) {
    return S === 62 ? (t.consume(S), I) : r(S);
  }
  function I(S) {
    return S === null || Y(S) ? M(S) : ne(S) ? (t.consume(S), I) : r(S);
  }
  function M(S) {
    return S === 45 && i === 2 ? (t.consume(S), j) : S === 60 && i === 1 ? (t.consume(S), G) : S === 62 && i === 4 ? (t.consume(S), ie) : S === 63 && i === 3 ? (t.consume(S), w) : S === 93 && i === 5 ? (t.consume(S), W) : Y(S) && (i === 6 || i === 7) ? (t.exit("htmlFlowData"), t.check(RT, de, N)(S)) : S === null || Y(S) ? (t.exit("htmlFlowData"), N(S)) : (t.consume(S), M);
  }
  function N(S) {
    return t.check(PT, $, de)(S);
  }
  function $(S) {
    return t.enter("lineEnding"), t.consume(S), t.exit("lineEnding"), O;
  }
  function O(S) {
    return S === null || Y(S) ? N(S) : (t.enter("htmlFlowData"), M(S));
  }
  function j(S) {
    return S === 45 ? (t.consume(S), w) : M(S);
  }
  function G(S) {
    return S === 47 ? (t.consume(S), s = "", B) : M(S);
  }
  function B(S) {
    if (S === 62) {
      const xe = s.toLowerCase();
      return gl.includes(xe) ? (t.consume(S), ie) : M(S);
    }
    return Me(S) && s.length < 8 ? (t.consume(S), s += String.fromCharCode(S), B) : M(S);
  }
  function W(S) {
    return S === 93 ? (t.consume(S), w) : M(S);
  }
  function w(S) {
    return S === 62 ? (t.consume(S), ie) : S === 45 && i === 2 ? (t.consume(S), w) : M(S);
  }
  function ie(S) {
    return S === null || Y(S) ? (t.exit("htmlFlowData"), de(S)) : (t.consume(S), ie);
  }
  function de(S) {
    return t.exit("htmlFlow"), e(S);
  }
}
function NT(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    return Y(s) ? (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), o) : r(s);
  }
  function o(s) {
    return n.parser.lazy[n.now().line] ? r(s) : e(s);
  }
}
function zT(t, e, r) {
  return n;
  function n(i) {
    return t.enter("lineEnding"), t.consume(i), t.exit("lineEnding"), t.attempt(rn, e, r);
  }
}
const OT = {
  name: "htmlText",
  tokenize: LT
};
function LT(t, e, r) {
  const n = this;
  let i, o, s;
  return a;
  function a(w) {
    return t.enter("htmlText"), t.enter("htmlTextData"), t.consume(w), l;
  }
  function l(w) {
    return w === 33 ? (t.consume(w), c) : w === 47 ? (t.consume(w), E) : w === 63 ? (t.consume(w), x) : Me(w) ? (t.consume(w), R) : r(w);
  }
  function c(w) {
    return w === 45 ? (t.consume(w), d) : w === 91 ? (t.consume(w), o = 0, m) : Me(w) ? (t.consume(w), k) : r(w);
  }
  function d(w) {
    return w === 45 ? (t.consume(w), p) : r(w);
  }
  function u(w) {
    return w === null ? r(w) : w === 45 ? (t.consume(w), h) : Y(w) ? (s = u, G(w)) : (t.consume(w), u);
  }
  function h(w) {
    return w === 45 ? (t.consume(w), p) : u(w);
  }
  function p(w) {
    return w === 62 ? j(w) : w === 45 ? h(w) : u(w);
  }
  function m(w) {
    const ie = "CDATA[";
    return w === ie.charCodeAt(o++) ? (t.consume(w), o === ie.length ? g : m) : r(w);
  }
  function g(w) {
    return w === null ? r(w) : w === 93 ? (t.consume(w), v) : Y(w) ? (s = g, G(w)) : (t.consume(w), g);
  }
  function v(w) {
    return w === 93 ? (t.consume(w), b) : g(w);
  }
  function b(w) {
    return w === 62 ? j(w) : w === 93 ? (t.consume(w), b) : g(w);
  }
  function k(w) {
    return w === null || w === 62 ? j(w) : Y(w) ? (s = k, G(w)) : (t.consume(w), k);
  }
  function x(w) {
    return w === null ? r(w) : w === 63 ? (t.consume(w), T) : Y(w) ? (s = x, G(w)) : (t.consume(w), x);
  }
  function T(w) {
    return w === 62 ? j(w) : x(w);
  }
  function E(w) {
    return Me(w) ? (t.consume(w), y) : r(w);
  }
  function y(w) {
    return w === 45 || Ee(w) ? (t.consume(w), y) : P(w);
  }
  function P(w) {
    return Y(w) ? (s = P, G(w)) : ne(w) ? (t.consume(w), P) : j(w);
  }
  function R(w) {
    return w === 45 || Ee(w) ? (t.consume(w), R) : w === 47 || w === 62 || ge(w) ? D(w) : r(w);
  }
  function D(w) {
    return w === 47 ? (t.consume(w), j) : w === 58 || w === 95 || Me(w) ? (t.consume(w), _) : Y(w) ? (s = D, G(w)) : ne(w) ? (t.consume(w), D) : j(w);
  }
  function _(w) {
    return w === 45 || w === 46 || w === 58 || w === 95 || Ee(w) ? (t.consume(w), _) : I(w);
  }
  function I(w) {
    return w === 61 ? (t.consume(w), M) : Y(w) ? (s = I, G(w)) : ne(w) ? (t.consume(w), I) : D(w);
  }
  function M(w) {
    return w === null || w === 60 || w === 61 || w === 62 || w === 96 ? r(w) : w === 34 || w === 39 ? (t.consume(w), i = w, N) : Y(w) ? (s = M, G(w)) : ne(w) ? (t.consume(w), M) : (t.consume(w), $);
  }
  function N(w) {
    return w === i ? (t.consume(w), i = void 0, O) : w === null ? r(w) : Y(w) ? (s = N, G(w)) : (t.consume(w), N);
  }
  function $(w) {
    return w === null || w === 34 || w === 39 || w === 60 || w === 61 || w === 96 ? r(w) : w === 47 || w === 62 || ge(w) ? D(w) : (t.consume(w), $);
  }
  function O(w) {
    return w === 47 || w === 62 || ge(w) ? D(w) : r(w);
  }
  function j(w) {
    return w === 62 ? (t.consume(w), t.exit("htmlTextData"), t.exit("htmlText"), e) : r(w);
  }
  function G(w) {
    return t.exit("htmlTextData"), t.enter("lineEnding"), t.consume(w), t.exit("lineEnding"), B;
  }
  function B(w) {
    return ne(w) ? se(t, W, "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(w) : W(w);
  }
  function W(w) {
    return t.enter("htmlTextData"), s(w);
  }
}
const us = {
  name: "labelEnd",
  resolveAll: UT,
  resolveTo: jT,
  tokenize: VT
}, $T = {
  tokenize: qT
}, BT = {
  tokenize: HT
}, FT = {
  tokenize: GT
};
function UT(t) {
  let e = -1;
  const r = [];
  for (; ++e < t.length; ) {
    const n = t[e][1];
    if (r.push(t[e]), n.type === "labelImage" || n.type === "labelLink" || n.type === "labelEnd") {
      const i = n.type === "labelImage" ? 4 : 2;
      n.type = "data", e += i;
    }
  }
  return t.length !== r.length && $e(t, 0, t.length, r), t;
}
function jT(t, e) {
  let r = t.length, n = 0, i, o, s, a;
  for (; r--; )
    if (i = t[r][1], o) {
      if (i.type === "link" || i.type === "labelLink" && i._inactive)
        break;
      t[r][0] === "enter" && i.type === "labelLink" && (i._inactive = !0);
    } else if (s) {
      if (t[r][0] === "enter" && (i.type === "labelImage" || i.type === "labelLink") && !i._balanced && (o = r, i.type !== "labelLink")) {
        n = 2;
        break;
      }
    } else
      i.type === "labelEnd" && (s = r);
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
      ...t[o + n + 2][1].end
    },
    end: {
      ...t[s - 2][1].start
    }
  };
  return a = [["enter", l, e], ["enter", c, e]], a = Be(a, t.slice(o + 1, o + n + 3)), a = Be(a, [["enter", d, e]]), a = Be(a, ei(e.parser.constructs.insideSpan.null, t.slice(o + n + 4, s - 3), e)), a = Be(a, [["exit", d, e], t[s - 2], t[s - 1], ["exit", c, e]]), a = Be(a, t.slice(s + 1)), a = Be(a, [["exit", l, e]]), $e(t, o, t.length, a), t;
}
function VT(t, e, r) {
  const n = this;
  let i = n.events.length, o, s;
  for (; i--; )
    if ((n.events[i][1].type === "labelImage" || n.events[i][1].type === "labelLink") && !n.events[i][1]._balanced) {
      o = n.events[i][1];
      break;
    }
  return a;
  function a(h) {
    return o ? o._inactive ? u(h) : (s = n.parser.defined.includes(Xe(n.sliceSerialize({
      start: o.end,
      end: n.now()
    }))), t.enter("labelEnd"), t.enter("labelMarker"), t.consume(h), t.exit("labelMarker"), t.exit("labelEnd"), l) : r(h);
  }
  function l(h) {
    return h === 40 ? t.attempt($T, d, s ? d : u)(h) : h === 91 ? t.attempt(BT, d, s ? c : u)(h) : s ? d(h) : u(h);
  }
  function c(h) {
    return t.attempt(FT, d, u)(h);
  }
  function d(h) {
    return e(h);
  }
  function u(h) {
    return o._balanced = !0, r(h);
  }
}
function qT(t, e, r) {
  return n;
  function n(u) {
    return t.enter("resource"), t.enter("resourceMarker"), t.consume(u), t.exit("resourceMarker"), i;
  }
  function i(u) {
    return ge(u) ? Lr(t, o)(u) : o(u);
  }
  function o(u) {
    return u === 41 ? d(u) : tp(t, s, a, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(u);
  }
  function s(u) {
    return ge(u) ? Lr(t, l)(u) : d(u);
  }
  function a(u) {
    return r(u);
  }
  function l(u) {
    return u === 34 || u === 39 || u === 40 ? np(t, c, r, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(u) : d(u);
  }
  function c(u) {
    return ge(u) ? Lr(t, d)(u) : d(u);
  }
  function d(u) {
    return u === 41 ? (t.enter("resourceMarker"), t.consume(u), t.exit("resourceMarker"), t.exit("resource"), e) : r(u);
  }
}
function HT(t, e, r) {
  const n = this;
  return i;
  function i(a) {
    return rp.call(n, t, o, s, "reference", "referenceMarker", "referenceString")(a);
  }
  function o(a) {
    return n.parser.defined.includes(Xe(n.sliceSerialize(n.events[n.events.length - 1][1]).slice(1, -1))) ? e(a) : r(a);
  }
  function s(a) {
    return r(a);
  }
}
function GT(t, e, r) {
  return n;
  function n(o) {
    return t.enter("reference"), t.enter("referenceMarker"), t.consume(o), t.exit("referenceMarker"), i;
  }
  function i(o) {
    return o === 93 ? (t.enter("referenceMarker"), t.consume(o), t.exit("referenceMarker"), t.exit("reference"), e) : r(o);
  }
}
const WT = {
  name: "labelStartImage",
  resolveAll: us.resolveAll,
  tokenize: KT
};
function KT(t, e, r) {
  const n = this;
  return i;
  function i(a) {
    return t.enter("labelImage"), t.enter("labelImageMarker"), t.consume(a), t.exit("labelImageMarker"), o;
  }
  function o(a) {
    return a === 91 ? (t.enter("labelMarker"), t.consume(a), t.exit("labelMarker"), t.exit("labelImage"), s) : r(a);
  }
  function s(a) {
    return a === 94 && "_hiddenFootnoteSupport" in n.parser.constructs ? r(a) : e(a);
  }
}
const QT = {
  name: "labelStartLink",
  resolveAll: us.resolveAll,
  tokenize: YT
};
function YT(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    return t.enter("labelLink"), t.enter("labelMarker"), t.consume(s), t.exit("labelMarker"), t.exit("labelLink"), o;
  }
  function o(s) {
    return s === 94 && "_hiddenFootnoteSupport" in n.parser.constructs ? r(s) : e(s);
  }
}
const ki = {
  name: "lineEnding",
  tokenize: JT
};
function JT(t, e) {
  return r;
  function r(n) {
    return t.enter("lineEnding"), t.consume(n), t.exit("lineEnding"), se(t, e, "linePrefix");
  }
}
const kn = {
  name: "thematicBreak",
  tokenize: XT
};
function XT(t, e, r) {
  let n = 0, i;
  return o;
  function o(c) {
    return t.enter("thematicBreak"), s(c);
  }
  function s(c) {
    return i = c, a(c);
  }
  function a(c) {
    return c === i ? (t.enter("thematicBreakSequence"), l(c)) : n >= 3 && (c === null || Y(c)) ? (t.exit("thematicBreak"), e(c)) : r(c);
  }
  function l(c) {
    return c === i ? (t.consume(c), n++, l) : (t.exit("thematicBreakSequence"), ne(c) ? se(t, a, "whitespace")(c) : a(c));
  }
}
const De = {
  continuation: {
    tokenize: rI
  },
  exit: iI,
  name: "list",
  tokenize: tI
}, ZT = {
  partial: !0,
  tokenize: oI
}, eI = {
  partial: !0,
  tokenize: nI
};
function tI(t, e, r) {
  const n = this, i = n.events[n.events.length - 1];
  let o = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, s = 0;
  return a;
  function a(p) {
    const m = n.containerState.type || (p === 42 || p === 43 || p === 45 ? "listUnordered" : "listOrdered");
    if (m === "listUnordered" ? !n.containerState.marker || p === n.containerState.marker : io(p)) {
      if (n.containerState.type || (n.containerState.type = m, t.enter(m, {
        _container: !0
      })), m === "listUnordered")
        return t.enter("listItemPrefix"), p === 42 || p === 45 ? t.check(kn, r, c)(p) : c(p);
      if (!n.interrupt || p === 49)
        return t.enter("listItemPrefix"), t.enter("listItemValue"), l(p);
    }
    return r(p);
  }
  function l(p) {
    return io(p) && ++s < 10 ? (t.consume(p), l) : (!n.interrupt || s < 2) && (n.containerState.marker ? p === n.containerState.marker : p === 41 || p === 46) ? (t.exit("listItemValue"), c(p)) : r(p);
  }
  function c(p) {
    return t.enter("listItemMarker"), t.consume(p), t.exit("listItemMarker"), n.containerState.marker = n.containerState.marker || p, t.check(
      rn,
      // Can’t be empty when interrupting.
      n.interrupt ? r : d,
      t.attempt(ZT, h, u)
    );
  }
  function d(p) {
    return n.containerState.initialBlankLine = !0, o++, h(p);
  }
  function u(p) {
    return ne(p) ? (t.enter("listItemPrefixWhitespace"), t.consume(p), t.exit("listItemPrefixWhitespace"), h) : r(p);
  }
  function h(p) {
    return n.containerState.size = o + n.sliceSerialize(t.exit("listItemPrefix"), !0).length, e(p);
  }
}
function rI(t, e, r) {
  const n = this;
  return n.containerState._closeFlow = void 0, t.check(rn, i, o);
  function i(a) {
    return n.containerState.furtherBlankLines = n.containerState.furtherBlankLines || n.containerState.initialBlankLine, se(t, e, "listItemIndent", n.containerState.size + 1)(a);
  }
  function o(a) {
    return n.containerState.furtherBlankLines || !ne(a) ? (n.containerState.furtherBlankLines = void 0, n.containerState.initialBlankLine = void 0, s(a)) : (n.containerState.furtherBlankLines = void 0, n.containerState.initialBlankLine = void 0, t.attempt(eI, e, s)(a));
  }
  function s(a) {
    return n.containerState._closeFlow = !0, n.interrupt = void 0, se(t, t.attempt(De, e, r), "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(a);
  }
}
function nI(t, e, r) {
  const n = this;
  return se(t, i, "listItemIndent", n.containerState.size + 1);
  function i(o) {
    const s = n.events[n.events.length - 1];
    return s && s[1].type === "listItemIndent" && s[2].sliceSerialize(s[1], !0).length === n.containerState.size ? e(o) : r(o);
  }
}
function iI(t) {
  t.exit(this.containerState.type);
}
function oI(t, e, r) {
  const n = this;
  return se(t, i, "listItemPrefixWhitespace", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4 + 1);
  function i(o) {
    const s = n.events[n.events.length - 1];
    return !ne(o) && s && s[1].type === "listItemPrefixWhitespace" ? e(o) : r(o);
  }
}
const bl = {
  name: "setextUnderline",
  resolveTo: sI,
  tokenize: aI
};
function sI(t, e) {
  let r = t.length, n, i, o;
  for (; r--; )
    if (t[r][0] === "enter") {
      if (t[r][1].type === "content") {
        n = r;
        break;
      }
      t[r][1].type === "paragraph" && (i = r);
    } else
      t[r][1].type === "content" && t.splice(r, 1), !o && t[r][1].type === "definition" && (o = r);
  const s = {
    type: "setextHeading",
    start: {
      ...t[n][1].start
    },
    end: {
      ...t[t.length - 1][1].end
    }
  };
  return t[i][1].type = "setextHeadingText", o ? (t.splice(i, 0, ["enter", s, e]), t.splice(o + 1, 0, ["exit", t[n][1], e]), t[n][1].end = {
    ...t[o][1].end
  }) : t[n][1] = s, t.push(["exit", s, e]), t;
}
function aI(t, e, r) {
  const n = this;
  let i;
  return o;
  function o(c) {
    let d = n.events.length, u;
    for (; d--; )
      if (n.events[d][1].type !== "lineEnding" && n.events[d][1].type !== "linePrefix" && n.events[d][1].type !== "content") {
        u = n.events[d][1].type === "paragraph";
        break;
      }
    return !n.parser.lazy[n.now().line] && (n.interrupt || u) ? (t.enter("setextHeadingLine"), i = c, s(c)) : r(c);
  }
  function s(c) {
    return t.enter("setextHeadingLineSequence"), a(c);
  }
  function a(c) {
    return c === i ? (t.consume(c), a) : (t.exit("setextHeadingLineSequence"), ne(c) ? se(t, l, "lineSuffix")(c) : l(c));
  }
  function l(c) {
    return c === null || Y(c) ? (t.exit("setextHeadingLine"), e(c)) : r(c);
  }
}
const lI = {
  tokenize: cI
};
function cI(t) {
  const e = this, r = t.attempt(
    // Try to parse a blank line.
    rn,
    n,
    // Try to parse initial flow (essentially, only code).
    t.attempt(this.parser.constructs.flowInitial, i, se(t, t.attempt(this.parser.constructs.flow, i, t.attempt(mT, i)), "linePrefix"))
  );
  return r;
  function n(o) {
    if (o === null) {
      t.consume(o);
      return;
    }
    return t.enter("lineEndingBlank"), t.consume(o), t.exit("lineEndingBlank"), e.currentConstruct = void 0, r;
  }
  function i(o) {
    if (o === null) {
      t.consume(o);
      return;
    }
    return t.enter("lineEnding"), t.consume(o), t.exit("lineEnding"), e.currentConstruct = void 0, r;
  }
}
const uI = {
  resolveAll: op()
}, dI = ip("string"), hI = ip("text");
function ip(t) {
  return {
    resolveAll: op(t === "text" ? pI : void 0),
    tokenize: e
  };
  function e(r) {
    const n = this, i = this.parser.constructs[t], o = r.attempt(i, s, a);
    return s;
    function s(d) {
      return c(d) ? o(d) : a(d);
    }
    function a(d) {
      if (d === null) {
        r.consume(d);
        return;
      }
      return r.enter("data"), r.consume(d), l;
    }
    function l(d) {
      return c(d) ? (r.exit("data"), o(d)) : (r.consume(d), l);
    }
    function c(d) {
      if (d === null)
        return !0;
      const u = i[d];
      let h = -1;
      if (u)
        for (; ++h < u.length; ) {
          const p = u[h];
          if (!p.previous || p.previous.call(n, n.previous))
            return !0;
        }
      return !1;
    }
  }
}
function op(t) {
  return e;
  function e(r, n) {
    let i = -1, o;
    for (; ++i <= r.length; )
      o === void 0 ? r[i] && r[i][1].type === "data" && (o = i, i++) : (!r[i] || r[i][1].type !== "data") && (i !== o + 2 && (r[o][1].end = r[i - 1][1].end, r.splice(o + 2, i - o - 2), i = o + 2), o = void 0);
    return t ? t(r, n) : r;
  }
}
function pI(t, e) {
  let r = 0;
  for (; ++r <= t.length; )
    if ((r === t.length || t[r][1].type === "lineEnding") && t[r - 1][1].type === "data") {
      const n = t[r - 1][1], i = e.sliceStream(n);
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
      if (e._contentTypeTextTrailing && r === t.length && (a = 0), a) {
        const c = {
          type: r === t.length || l || a < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: o ? s : n.start._bufferIndex + s,
            _index: n.start._index + o,
            line: n.end.line,
            column: n.end.column - a,
            offset: n.end.offset - a
          },
          end: {
            ...n.end
          }
        };
        n.end = {
          ...c.start
        }, n.start.offset === n.end.offset ? Object.assign(n, c) : (t.splice(r, 0, ["enter", c, e], ["exit", c, e]), r += 2);
      }
      r++;
    }
  return t;
}
const mI = {
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
  62: Jh
}, fI = {
  91: wT
}, gI = {
  [-2]: xi,
  [-1]: xi,
  32: xi
}, bI = {
  35: CT,
  42: kn,
  45: [bl, kn],
  60: AT,
  61: bl,
  95: kn,
  96: fl,
  126: fl
}, vI = {
  38: Zh,
  92: Xh
}, wI = {
  [-5]: ki,
  [-4]: ki,
  [-3]: ki,
  33: WT,
  38: Zh,
  42: oo,
  60: [QC, OT],
  91: QT,
  92: [_T, Xh],
  93: us,
  95: oo,
  96: lT
}, yI = {
  null: [oo, uI]
}, xI = {
  null: [42, 95]
}, kI = {
  null: []
}, _I = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attentionMarkers: xI,
  contentInitial: fI,
  disable: kI,
  document: mI,
  flow: bI,
  flowInitial: gI,
  insideSpan: yI,
  string: vI,
  text: wI
}, Symbol.toStringTag, { value: "Module" }));
function SI(t, e, r) {
  let n = {
    _bufferIndex: -1,
    _index: 0,
    line: r && r.line || 1,
    column: r && r.column || 1,
    offset: r && r.offset || 0
  };
  const i = {}, o = [];
  let s = [], a = [];
  const l = {
    attempt: P(E),
    check: P(y),
    consume: k,
    enter: x,
    exit: T,
    interrupt: P(y, {
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
  function u(I) {
    return s = Be(s, I), v(), s[s.length - 1] !== null ? [] : (R(e, 0), c.events = ei(o, c.events, c), c.events);
  }
  function h(I, M) {
    return TI(p(I), M);
  }
  function p(I) {
    return CI(s, I);
  }
  function m() {
    const {
      _bufferIndex: I,
      _index: M,
      line: N,
      column: $,
      offset: O
    } = n;
    return {
      _bufferIndex: I,
      _index: M,
      line: N,
      column: $,
      offset: O
    };
  }
  function g(I) {
    i[I.line] = I.column, _();
  }
  function v() {
    let I;
    for (; n._index < s.length; ) {
      const M = s[n._index];
      if (typeof M == "string")
        for (I = n._index, n._bufferIndex < 0 && (n._bufferIndex = 0); n._index === I && n._bufferIndex < M.length; )
          b(M.charCodeAt(n._bufferIndex));
      else
        b(M);
    }
  }
  function b(I) {
    d = d(I);
  }
  function k(I) {
    Y(I) ? (n.line++, n.column = 1, n.offset += I === -3 ? 2 : 1, _()) : I !== -1 && (n.column++, n.offset++), n._bufferIndex < 0 ? n._index++ : (n._bufferIndex++, n._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
    // strings.
    /** @type {string} */
    s[n._index].length && (n._bufferIndex = -1, n._index++)), c.previous = I;
  }
  function x(I, M) {
    const N = M || {};
    return N.type = I, N.start = m(), c.events.push(["enter", N, c]), a.push(N), N;
  }
  function T(I) {
    const M = a.pop();
    return M.end = m(), c.events.push(["exit", M, c]), M;
  }
  function E(I, M) {
    R(I, M.from);
  }
  function y(I, M) {
    M.restore();
  }
  function P(I, M) {
    return N;
    function N($, O, j) {
      let G, B, W, w;
      return Array.isArray($) ? (
        /* c8 ignore next 1 */
        de($)
      ) : "tokenize" in $ ? (
        // Looks like a construct.
        de([
          /** @type {Construct} */
          $
        ])
      ) : ie($);
      function ie(ae) {
        return nt;
        function nt(Ke) {
          const be = Ke !== null && ae[Ke], dt = Ke !== null && ae.null, ht = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(be) ? be : be ? [be] : [],
            ...Array.isArray(dt) ? dt : dt ? [dt] : []
          ];
          return de(ht)(Ke);
        }
      }
      function de(ae) {
        return G = ae, B = 0, ae.length === 0 ? j : S(ae[B]);
      }
      function S(ae) {
        return nt;
        function nt(Ke) {
          return w = D(), W = ae, ae.partial || (c.currentConstruct = ae), ae.name && c.parser.constructs.disable.null.includes(ae.name) ? pe() : ae.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            M ? Object.assign(Object.create(c), M) : c,
            l,
            xe,
            pe
          )(Ke);
        }
      }
      function xe(ae) {
        return I(W, w), O;
      }
      function pe(ae) {
        return w.restore(), ++B < G.length ? S(G[B]) : j;
      }
    }
  }
  function R(I, M) {
    I.resolveAll && !o.includes(I) && o.push(I), I.resolve && $e(c.events, M, c.events.length - M, I.resolve(c.events.slice(M), c)), I.resolveTo && (c.events = I.resolveTo(c.events, c));
  }
  function D() {
    const I = m(), M = c.previous, N = c.currentConstruct, $ = c.events.length, O = Array.from(a);
    return {
      from: $,
      restore: j
    };
    function j() {
      n = I, c.previous = M, c.currentConstruct = N, c.events.length = $, a = O, _();
    }
  }
  function _() {
    n.line in i && n.column < 2 && (n.column = i[n.line], n.offset += i[n.line] - 1);
  }
}
function CI(t, e) {
  const r = e.start._index, n = e.start._bufferIndex, i = e.end._index, o = e.end._bufferIndex;
  let s;
  if (r === i)
    s = [t[r].slice(n, o)];
  else {
    if (s = t.slice(r, i), n > -1) {
      const a = s[0];
      typeof a == "string" ? s[0] = a.slice(n) : s.shift();
    }
    o > 0 && s.push(t[i].slice(0, o));
  }
  return s;
}
function TI(t, e) {
  let r = -1;
  const n = [];
  let i;
  for (; ++r < t.length; ) {
    const o = t[r];
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
    i = o === -2, n.push(s);
  }
  return n.join("");
}
function II(t) {
  const n = {
    constructs: (
      /** @type {FullNormalizedExtension} */
      Qh([_I, ...(t || {}).extensions || []])
    ),
    content: i(jC),
    defined: [],
    document: i(qC),
    flow: i(lI),
    lazy: {},
    string: i(dI),
    text: i(hI)
  };
  return n;
  function i(o) {
    return s;
    function s(a) {
      return SI(n, o, a);
    }
  }
}
function EI(t) {
  for (; !ep(t); )
    ;
  return t;
}
const vl = /[\0\t\n\r]/g;
function AI() {
  let t = 1, e = "", r = !0, n;
  return i;
  function i(o, s, a) {
    const l = [];
    let c, d, u, h, p;
    for (o = e + (typeof o == "string" ? o.toString() : new TextDecoder(s || void 0).decode(o)), u = 0, e = "", r && (o.charCodeAt(0) === 65279 && u++, r = void 0); u < o.length; ) {
      if (vl.lastIndex = u, c = vl.exec(o), h = c && c.index !== void 0 ? c.index : o.length, p = o.charCodeAt(h), !c) {
        e = o.slice(u);
        break;
      }
      if (p === 10 && u === h && n)
        l.push(-3), n = void 0;
      else
        switch (n && (l.push(-5), n = void 0), u < h && (l.push(o.slice(u, h)), t += h - u), p) {
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
            n = !0, t = 1;
        }
      u = h + 1;
    }
    return a && (n && l.push(-5), e && l.push(e), l.push(null)), l;
  }
}
const RI = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function PI(t) {
  return t.replace(RI, MI);
}
function MI(t, e, r) {
  if (e)
    return e;
  if (r.charCodeAt(0) === 35) {
    const i = r.charCodeAt(1), o = i === 120 || i === 88;
    return Yh(r.slice(o ? 2 : 1), o ? 16 : 10);
  }
  return cs(r) || t;
}
const sp = {}.hasOwnProperty;
function DI(t, e, r) {
  return e && typeof e == "object" && (r = e, e = void 0), NI(r)(EI(II(r).document().write(AI()(t, e, !0))));
}
function NI(t) {
  const e = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: o(Ts),
      autolinkProtocol: D,
      autolinkEmail: D,
      atxHeading: o(_s),
      blockQuote: o(dt),
      characterEscape: D,
      characterReference: D,
      codeFenced: o(ht),
      codeFencedFenceInfo: s,
      codeFencedFenceMeta: s,
      codeIndented: o(ht, s),
      codeText: o(rr, s),
      codeTextData: D,
      data: D,
      codeFlowValue: D,
      definition: o(Sr),
      definitionDestinationString: s,
      definitionLabelString: s,
      definitionTitleString: s,
      emphasis: o(nr),
      hardBreakEscape: o(Ss),
      hardBreakTrailing: o(Ss),
      htmlFlow: o(Cs, s),
      htmlFlowData: D,
      htmlText: o(Cs, s),
      htmlTextData: D,
      image: o(Kp),
      label: s,
      link: o(Ts),
      listItem: o(Qp),
      listItemValue: h,
      listOrdered: o(Is, u),
      listUnordered: o(Is),
      paragraph: o(Yp),
      reference: S,
      referenceString: s,
      resourceDestinationString: s,
      resourceTitleString: s,
      setextHeading: o(_s),
      strong: o(Jp),
      thematicBreak: o(Zp)
    },
    exit: {
      atxHeading: l(),
      atxHeadingSequence: E,
      autolink: l(),
      autolinkEmail: be,
      autolinkProtocol: Ke,
      blockQuote: l(),
      characterEscapeValue: _,
      characterReferenceMarkerHexadecimal: pe,
      characterReferenceMarkerNumeric: pe,
      characterReferenceValue: ae,
      characterReference: nt,
      codeFenced: l(v),
      codeFencedFence: g,
      codeFencedFenceInfo: p,
      codeFencedFenceMeta: m,
      codeFlowValue: _,
      codeIndented: l(b),
      codeText: l(O),
      codeTextData: _,
      data: _,
      definition: l(),
      definitionDestinationString: T,
      definitionLabelString: k,
      definitionTitleString: x,
      emphasis: l(),
      hardBreakEscape: l(M),
      hardBreakTrailing: l(M),
      htmlFlow: l(N),
      htmlFlowData: _,
      htmlText: l($),
      htmlTextData: _,
      image: l(G),
      label: W,
      labelText: B,
      lineEnding: I,
      link: l(j),
      listItem: l(),
      listOrdered: l(),
      listUnordered: l(),
      paragraph: l(),
      referenceString: xe,
      resourceDestinationString: w,
      resourceTitleString: ie,
      resource: de,
      setextHeading: l(R),
      setextHeadingLineSequence: P,
      setextHeadingText: y,
      strong: l(),
      thematicBreak: l()
    }
  };
  ap(e, (t || {}).mdastExtensions || []);
  const r = {};
  return n;
  function n(z) {
    let U = {
      type: "root",
      children: []
    };
    const ee = {
      stack: [U],
      tokenStack: [],
      config: e,
      enter: a,
      exit: c,
      buffer: s,
      resume: d,
      data: r
    }, oe = [];
    let me = -1;
    for (; ++me < z.length; )
      if (z[me][1].type === "listOrdered" || z[me][1].type === "listUnordered")
        if (z[me][0] === "enter")
          oe.push(me);
        else {
          const Qe = oe.pop();
          me = i(z, Qe, me);
        }
    for (me = -1; ++me < z.length; ) {
      const Qe = e[z[me][0]];
      sp.call(Qe, z[me][1].type) && Qe[z[me][1].type].call(Object.assign({
        sliceSerialize: z[me][2].sliceSerialize
      }, ee), z[me][1]);
    }
    if (ee.tokenStack.length > 0) {
      const Qe = ee.tokenStack[ee.tokenStack.length - 1];
      (Qe[1] || wl).call(ee, void 0, Qe[0]);
    }
    for (U.position = {
      start: vt(z.length > 0 ? z[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: vt(z.length > 0 ? z[z.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    }, me = -1; ++me < e.transforms.length; )
      U = e.transforms[me](U) || U;
    return U;
  }
  function i(z, U, ee) {
    let oe = U - 1, me = -1, Qe = !1, At, pt, Cr, Tr;
    for (; ++oe <= ee; ) {
      const Oe = z[oe];
      switch (Oe[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          Oe[0] === "enter" ? me++ : me--, Tr = void 0;
          break;
        }
        case "lineEndingBlank": {
          Oe[0] === "enter" && (At && !Tr && !me && !Cr && (Cr = oe), Tr = void 0);
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          Tr = void 0;
      }
      if (!me && Oe[0] === "enter" && Oe[1].type === "listItemPrefix" || me === -1 && Oe[0] === "exit" && (Oe[1].type === "listUnordered" || Oe[1].type === "listOrdered")) {
        if (At) {
          let ir = oe;
          for (pt = void 0; ir--; ) {
            const mt = z[ir];
            if (mt[1].type === "lineEnding" || mt[1].type === "lineEndingBlank") {
              if (mt[0] === "exit")
                continue;
              pt && (z[pt][1].type = "lineEndingBlank", Qe = !0), mt[1].type = "lineEnding", pt = ir;
            } else if (!(mt[1].type === "linePrefix" || mt[1].type === "blockQuotePrefix" || mt[1].type === "blockQuotePrefixWhitespace" || mt[1].type === "blockQuoteMarker" || mt[1].type === "listItemIndent"))
              break;
          }
          Cr && (!pt || Cr < pt) && (At._spread = !0), At.end = Object.assign({}, pt ? z[pt][1].start : Oe[1].end), z.splice(pt || oe, 0, ["exit", At, Oe[2]]), oe++, ee++;
        }
        if (Oe[1].type === "listItemPrefix") {
          const ir = {
            type: "listItem",
            _spread: !1,
            start: Object.assign({}, Oe[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          At = ir, z.splice(oe, 0, ["enter", ir, Oe[2]]), oe++, ee++, Cr = void 0, Tr = !0;
        }
      }
    }
    return z[U][1]._spread = Qe, ee;
  }
  function o(z, U) {
    return ee;
    function ee(oe) {
      a.call(this, z(oe), oe), U && U.call(this, oe);
    }
  }
  function s() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function a(z, U, ee) {
    this.stack[this.stack.length - 1].children.push(z), this.stack.push(z), this.tokenStack.push([U, ee || void 0]), z.position = {
      start: vt(U.start),
      // @ts-expect-error: `end` will be patched later.
      end: void 0
    };
  }
  function l(z) {
    return U;
    function U(ee) {
      z && z.call(this, ee), c.call(this, ee);
    }
  }
  function c(z, U) {
    const ee = this.stack.pop(), oe = this.tokenStack.pop();
    if (oe)
      oe[0].type !== z.type && (U ? U.call(this, z, oe[0]) : (oe[1] || wl).call(this, z, oe[0]));
    else
      throw new Error("Cannot close `" + z.type + "` (" + Or({
        start: z.start,
        end: z.end
      }) + "): it’s not open");
    ee.position.end = vt(z.end);
  }
  function d() {
    return ls(this.stack.pop());
  }
  function u() {
    this.data.expectingFirstListItemValue = !0;
  }
  function h(z) {
    if (this.data.expectingFirstListItemValue) {
      const U = this.stack[this.stack.length - 2];
      U.start = Number.parseInt(this.sliceSerialize(z), 10), this.data.expectingFirstListItemValue = void 0;
    }
  }
  function p() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.lang = z;
  }
  function m() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.meta = z;
  }
  function g() {
    this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
  }
  function v() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.value = z.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
  }
  function b() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.value = z.replace(/(\r?\n|\r)$/g, "");
  }
  function k(z) {
    const U = this.resume(), ee = this.stack[this.stack.length - 1];
    ee.label = U, ee.identifier = Xe(this.sliceSerialize(z)).toLowerCase();
  }
  function x() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.title = z;
  }
  function T() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.url = z;
  }
  function E(z) {
    const U = this.stack[this.stack.length - 1];
    if (!U.depth) {
      const ee = this.sliceSerialize(z).length;
      U.depth = ee;
    }
  }
  function y() {
    this.data.setextHeadingSlurpLineEnding = !0;
  }
  function P(z) {
    const U = this.stack[this.stack.length - 1];
    U.depth = this.sliceSerialize(z).codePointAt(0) === 61 ? 1 : 2;
  }
  function R() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function D(z) {
    const ee = this.stack[this.stack.length - 1].children;
    let oe = ee[ee.length - 1];
    (!oe || oe.type !== "text") && (oe = Xp(), oe.position = {
      start: vt(z.start),
      // @ts-expect-error: we’ll add `end` later.
      end: void 0
    }, ee.push(oe)), this.stack.push(oe);
  }
  function _(z) {
    const U = this.stack.pop();
    U.value += this.sliceSerialize(z), U.position.end = vt(z.end);
  }
  function I(z) {
    const U = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const ee = U.children[U.children.length - 1];
      ee.position.end = vt(z.end), this.data.atHardBreak = void 0;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && e.canContainEols.includes(U.type) && (D.call(this, z), _.call(this, z));
  }
  function M() {
    this.data.atHardBreak = !0;
  }
  function N() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.value = z;
  }
  function $() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.value = z;
  }
  function O() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.value = z;
  }
  function j() {
    const z = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const U = this.data.referenceType || "shortcut";
      z.type += "Reference", z.referenceType = U, delete z.url, delete z.title;
    } else
      delete z.identifier, delete z.label;
    this.data.referenceType = void 0;
  }
  function G() {
    const z = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      const U = this.data.referenceType || "shortcut";
      z.type += "Reference", z.referenceType = U, delete z.url, delete z.title;
    } else
      delete z.identifier, delete z.label;
    this.data.referenceType = void 0;
  }
  function B(z) {
    const U = this.sliceSerialize(z), ee = this.stack[this.stack.length - 2];
    ee.label = PI(U), ee.identifier = Xe(U).toLowerCase();
  }
  function W() {
    const z = this.stack[this.stack.length - 1], U = this.resume(), ee = this.stack[this.stack.length - 1];
    if (this.data.inReference = !0, ee.type === "link") {
      const oe = z.children;
      ee.children = oe;
    } else
      ee.alt = U;
  }
  function w() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.url = z;
  }
  function ie() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.title = z;
  }
  function de() {
    this.data.inReference = void 0;
  }
  function S() {
    this.data.referenceType = "collapsed";
  }
  function xe(z) {
    const U = this.resume(), ee = this.stack[this.stack.length - 1];
    ee.label = U, ee.identifier = Xe(this.sliceSerialize(z)).toLowerCase(), this.data.referenceType = "full";
  }
  function pe(z) {
    this.data.characterReferenceType = z.type;
  }
  function ae(z) {
    const U = this.sliceSerialize(z), ee = this.data.characterReferenceType;
    let oe;
    ee ? (oe = Yh(U, ee === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : oe = cs(U);
    const me = this.stack[this.stack.length - 1];
    me.value += oe;
  }
  function nt(z) {
    const U = this.stack.pop();
    U.position.end = vt(z.end);
  }
  function Ke(z) {
    _.call(this, z);
    const U = this.stack[this.stack.length - 1];
    U.url = this.sliceSerialize(z);
  }
  function be(z) {
    _.call(this, z);
    const U = this.stack[this.stack.length - 1];
    U.url = "mailto:" + this.sliceSerialize(z);
  }
  function dt() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function ht() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function rr() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function Sr() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function nr() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function _s() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }
  function Ss() {
    return {
      type: "break"
    };
  }
  function Cs() {
    return {
      type: "html",
      value: ""
    };
  }
  function Kp() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function Ts() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function Is(z) {
    return {
      type: "list",
      ordered: z.type === "listOrdered",
      start: null,
      spread: z._spread,
      children: []
    };
  }
  function Qp(z) {
    return {
      type: "listItem",
      spread: z._spread,
      checked: null,
      children: []
    };
  }
  function Yp() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function Jp() {
    return {
      type: "strong",
      children: []
    };
  }
  function Xp() {
    return {
      type: "text",
      value: ""
    };
  }
  function Zp() {
    return {
      type: "thematicBreak"
    };
  }
}
function vt(t) {
  return {
    line: t.line,
    column: t.column,
    offset: t.offset
  };
}
function ap(t, e) {
  let r = -1;
  for (; ++r < e.length; ) {
    const n = e[r];
    Array.isArray(n) ? ap(t, n) : zI(t, n);
  }
}
function zI(t, e) {
  let r;
  for (r in e)
    if (sp.call(e, r))
      switch (r) {
        case "canContainEols": {
          const n = e[r];
          n && t[r].push(...n);
          break;
        }
        case "transforms": {
          const n = e[r];
          n && t[r].push(...n);
          break;
        }
        case "enter":
        case "exit": {
          const n = e[r];
          n && Object.assign(t[r], n);
          break;
        }
      }
}
function wl(t, e) {
  throw t ? new Error("Cannot close `" + t.type + "` (" + Or({
    start: t.start,
    end: t.end
  }) + "): a different token (`" + e.type + "`, " + Or({
    start: e.start,
    end: e.end
  }) + ") is open") : new Error("Cannot close document, a token (`" + e.type + "`, " + Or({
    start: e.start,
    end: e.end
  }) + ") is still open");
}
function OI(t) {
  const e = this;
  e.parser = r;
  function r(n) {
    return DI(n, {
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
function LI(t, e) {
  const r = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: t.wrap(t.all(e), !0)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function $I(t, e) {
  const r = { type: "element", tagName: "br", properties: {}, children: [] };
  return t.patch(e, r), [t.applyData(e, r), { type: "text", value: `
` }];
}
function BI(t, e) {
  const r = e.value ? e.value + `
` : "", n = {}, i = e.lang ? e.lang.split(/\s+/) : [];
  i.length > 0 && (n.className = ["language-" + i[0]]);
  let o = {
    type: "element",
    tagName: "code",
    properties: n,
    children: [{ type: "text", value: r }]
  };
  return e.meta && (o.data = { meta: e.meta }), t.patch(e, o), o = t.applyData(e, o), o = { type: "element", tagName: "pre", properties: {}, children: [o] }, t.patch(e, o), o;
}
function FI(t, e) {
  const r = {
    type: "element",
    tagName: "del",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function UI(t, e) {
  const r = {
    type: "element",
    tagName: "em",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function jI(t, e) {
  const r = typeof t.options.clobberPrefix == "string" ? t.options.clobberPrefix : "user-content-", n = String(e.identifier).toUpperCase(), i = _r(n.toLowerCase()), o = t.footnoteOrder.indexOf(n);
  let s, a = t.footnoteCounts.get(n);
  a === void 0 ? (a = 0, t.footnoteOrder.push(n), s = t.footnoteOrder.length) : s = o + 1, a += 1, t.footnoteCounts.set(n, a);
  const l = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + r + "fn-" + i,
      id: r + "fnref-" + i + (a > 1 ? "-" + a : ""),
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
function VI(t, e) {
  const r = {
    type: "element",
    tagName: "h" + e.depth,
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function qI(t, e) {
  if (t.options.allowDangerousHtml) {
    const r = { type: "raw", value: e.value };
    return t.patch(e, r), t.applyData(e, r);
  }
}
function lp(t, e) {
  const r = e.referenceType;
  let n = "]";
  if (r === "collapsed" ? n += "[]" : r === "full" && (n += "[" + (e.label || e.identifier) + "]"), e.type === "imageReference")
    return [{ type: "text", value: "![" + e.alt + n }];
  const i = t.all(e), o = i[0];
  o && o.type === "text" ? o.value = "[" + o.value : i.unshift({ type: "text", value: "[" });
  const s = i[i.length - 1];
  return s && s.type === "text" ? s.value += n : i.push({ type: "text", value: n }), i;
}
function HI(t, e) {
  const r = String(e.identifier).toUpperCase(), n = t.definitionById.get(r);
  if (!n)
    return lp(t, e);
  const i = { src: _r(n.url || ""), alt: e.alt };
  n.title !== null && n.title !== void 0 && (i.title = n.title);
  const o = { type: "element", tagName: "img", properties: i, children: [] };
  return t.patch(e, o), t.applyData(e, o);
}
function GI(t, e) {
  const r = { src: _r(e.url) };
  e.alt !== null && e.alt !== void 0 && (r.alt = e.alt), e.title !== null && e.title !== void 0 && (r.title = e.title);
  const n = { type: "element", tagName: "img", properties: r, children: [] };
  return t.patch(e, n), t.applyData(e, n);
}
function WI(t, e) {
  const r = { type: "text", value: e.value.replace(/\r?\n|\r/g, " ") };
  t.patch(e, r);
  const n = {
    type: "element",
    tagName: "code",
    properties: {},
    children: [r]
  };
  return t.patch(e, n), t.applyData(e, n);
}
function KI(t, e) {
  const r = String(e.identifier).toUpperCase(), n = t.definitionById.get(r);
  if (!n)
    return lp(t, e);
  const i = { href: _r(n.url || "") };
  n.title !== null && n.title !== void 0 && (i.title = n.title);
  const o = {
    type: "element",
    tagName: "a",
    properties: i,
    children: t.all(e)
  };
  return t.patch(e, o), t.applyData(e, o);
}
function QI(t, e) {
  const r = { href: _r(e.url) };
  e.title !== null && e.title !== void 0 && (r.title = e.title);
  const n = {
    type: "element",
    tagName: "a",
    properties: r,
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function YI(t, e, r) {
  const n = t.all(e), i = r ? JI(r) : cp(e), o = {}, s = [];
  if (typeof e.checked == "boolean") {
    const d = n[0];
    let u;
    d && d.type === "element" && d.tagName === "p" ? u = d : (u = { type: "element", tagName: "p", properties: {}, children: [] }, n.unshift(u)), u.children.length > 0 && u.children.unshift({ type: "text", value: " " }), u.children.unshift({
      type: "element",
      tagName: "input",
      properties: { type: "checkbox", checked: e.checked, disabled: !0 },
      children: []
    }), o.className = ["task-list-item"];
  }
  let a = -1;
  for (; ++a < n.length; ) {
    const d = n[a];
    (i || a !== 0 || d.type !== "element" || d.tagName !== "p") && s.push({ type: "text", value: `
` }), d.type === "element" && d.tagName === "p" && !i ? s.push(...d.children) : s.push(d);
  }
  const l = n[n.length - 1];
  l && (i || l.type !== "element" || l.tagName !== "p") && s.push({ type: "text", value: `
` });
  const c = { type: "element", tagName: "li", properties: o, children: s };
  return t.patch(e, c), t.applyData(e, c);
}
function JI(t) {
  let e = !1;
  if (t.type === "list") {
    e = t.spread || !1;
    const r = t.children;
    let n = -1;
    for (; !e && ++n < r.length; )
      e = cp(r[n]);
  }
  return e;
}
function cp(t) {
  const e = t.spread;
  return e ?? t.children.length > 1;
}
function XI(t, e) {
  const r = {}, n = t.all(e);
  let i = -1;
  for (typeof e.start == "number" && e.start !== 1 && (r.start = e.start); ++i < n.length; ) {
    const s = n[i];
    if (s.type === "element" && s.tagName === "li" && s.properties && Array.isArray(s.properties.className) && s.properties.className.includes("task-list-item")) {
      r.className = ["contains-task-list"];
      break;
    }
  }
  const o = {
    type: "element",
    tagName: e.ordered ? "ol" : "ul",
    properties: r,
    children: t.wrap(n, !0)
  };
  return t.patch(e, o), t.applyData(e, o);
}
function ZI(t, e) {
  const r = {
    type: "element",
    tagName: "p",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function e2(t, e) {
  const r = { type: "root", children: t.wrap(t.all(e)) };
  return t.patch(e, r), t.applyData(e, r);
}
function t2(t, e) {
  const r = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function r2(t, e) {
  const r = t.all(e), n = r.shift(), i = [];
  if (n) {
    const s = {
      type: "element",
      tagName: "thead",
      properties: {},
      children: t.wrap([n], !0)
    };
    t.patch(e.children[0], s), i.push(s);
  }
  if (r.length > 0) {
    const s = {
      type: "element",
      tagName: "tbody",
      properties: {},
      children: t.wrap(r, !0)
    }, a = is(e.children[1]), l = jh(e.children[e.children.length - 1]);
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
function n2(t, e, r) {
  const n = r ? r.children : void 0, o = (n ? n.indexOf(e) : 1) === 0 ? "th" : "td", s = r && r.type === "table" ? r.align : void 0, a = s ? s.length : e.children.length;
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
function i2(t, e) {
  const r = {
    type: "element",
    tagName: "td",
    // Assume body cell.
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
const yl = 9, xl = 32;
function o2(t) {
  const e = String(t), r = /\r?\n|\r/g;
  let n = r.exec(e), i = 0;
  const o = [];
  for (; n; )
    o.push(
      kl(e.slice(i, n.index), i > 0, !0),
      n[0]
    ), i = n.index + n[0].length, n = r.exec(e);
  return o.push(kl(e.slice(i), i > 0, !1)), o.join("");
}
function kl(t, e, r) {
  let n = 0, i = t.length;
  if (e) {
    let o = t.codePointAt(n);
    for (; o === yl || o === xl; )
      n++, o = t.codePointAt(n);
  }
  if (r) {
    let o = t.codePointAt(i - 1);
    for (; o === yl || o === xl; )
      i--, o = t.codePointAt(i - 1);
  }
  return i > n ? t.slice(n, i) : "";
}
function s2(t, e) {
  const r = { type: "text", value: o2(String(e.value)) };
  return t.patch(e, r), t.applyData(e, r);
}
function a2(t, e) {
  const r = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  return t.patch(e, r), t.applyData(e, r);
}
const l2 = {
  blockquote: LI,
  break: $I,
  code: BI,
  delete: FI,
  emphasis: UI,
  footnoteReference: jI,
  heading: VI,
  html: qI,
  imageReference: HI,
  image: GI,
  inlineCode: WI,
  linkReference: KI,
  link: QI,
  listItem: YI,
  list: XI,
  paragraph: ZI,
  // @ts-expect-error: root is different, but hard to type.
  root: e2,
  strong: t2,
  table: r2,
  tableCell: i2,
  tableRow: n2,
  text: s2,
  thematicBreak: a2,
  toml: gn,
  yaml: gn,
  definition: gn,
  footnoteDefinition: gn
};
function gn() {
}
const up = -1, ti = 0, $r = 1, Ln = 2, ds = 3, hs = 4, ps = 5, ms = 6, dp = 7, hp = 8, pp = typeof self == "object" ? self : globalThis, _l = (t, e) => {
  switch (t) {
    case "Function":
    case "SharedWorker":
    case "Worker":
    case "eval":
    case "setInterval":
    case "setTimeout":
      throw new TypeError("unable to deserialize " + t);
  }
  return new pp[t](e);
}, c2 = (t, e) => {
  const r = (i, o) => (t.set(o, i), i), n = (i) => {
    if (t.has(i))
      return t.get(i);
    const [o, s] = e[i];
    switch (o) {
      case ti:
      case up:
        return r(s, i);
      case $r: {
        const a = r([], i);
        for (const l of s)
          a.push(n(l));
        return a;
      }
      case Ln: {
        const a = r({}, i);
        for (const [l, c] of s)
          a[n(l)] = n(c);
        return a;
      }
      case ds:
        return r(new Date(s), i);
      case hs: {
        const { source: a, flags: l } = s;
        return r(new RegExp(a, l), i);
      }
      case ps: {
        const a = r(/* @__PURE__ */ new Map(), i);
        for (const [l, c] of s)
          a.set(n(l), n(c));
        return a;
      }
      case ms: {
        const a = r(/* @__PURE__ */ new Set(), i);
        for (const l of s)
          a.add(n(l));
        return a;
      }
      case dp: {
        const { name: a, message: l } = s;
        return r(
          typeof pp[a] == "function" ? _l(a, l) : new Error(l),
          i
        );
      }
      case hp:
        return r(BigInt(s), i);
      case "BigInt":
        return r(Object(BigInt(s)), i);
      case "ArrayBuffer":
        return r(new Uint8Array(s).buffer, s);
      case "DataView": {
        const { buffer: a } = new Uint8Array(s);
        return r(new DataView(a), s);
      }
    }
    return r(_l(o, s), i);
  };
  return n;
}, Sl = (t) => c2(/* @__PURE__ */ new Map(), t)(0), Nt = "", { toString: u2 } = {}, { keys: d2 } = Object, Mr = (t) => {
  const e = typeof t;
  if (e !== "object" || !t)
    return [ti, e];
  const r = u2.call(t).slice(8, -1);
  switch (r) {
    case "Array":
      return [$r, Nt];
    case "Object":
      return [Ln, Nt];
    case "Date":
      return [ds, Nt];
    case "RegExp":
      return [hs, Nt];
    case "Map":
      return [ps, Nt];
    case "Set":
      return [ms, Nt];
    case "DataView":
      return [$r, r];
  }
  return r.includes("Array") ? [$r, r] : t instanceof Error ? [dp, t.name || "Error"] : [Ln, r];
}, bn = ([t, e]) => t === ti && (e === "function" || e === "symbol"), h2 = (t, e, r, n) => {
  const i = (s, a) => {
    const l = n.push(s) - 1;
    return r.set(a, l), l;
  }, o = (s) => {
    if (r.has(s))
      return r.get(s);
    let [a, l] = Mr(s);
    switch (a) {
      case ti: {
        let d = s;
        switch (l) {
          case "bigint":
            a = hp, d = s.toString();
            break;
          case "function":
          case "symbol":
            if (t)
              throw new TypeError("unable to serialize " + l);
            d = null;
            break;
          case "undefined":
            return i([up], s);
        }
        return i([a, d], s);
      }
      case $r: {
        if (l) {
          let h = s;
          return l === "DataView" ? h = new Uint8Array(s.buffer) : l === "ArrayBuffer" && (h = new Uint8Array(s)), i([l, [...h]], s);
        }
        const d = [], u = i([a, d], s);
        for (const h of s)
          d.push(o(h));
        return u;
      }
      case Ln: {
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
        for (const h of d2(s))
          (t || !bn(Mr(s[h]))) && d.push([o(h), o(s[h])]);
        return u;
      }
      case ds:
        return i([a, isNaN(s.getTime()) ? Nt : s.toISOString()], s);
      case hs: {
        const { source: d, flags: u } = s;
        return i([a, { source: d, flags: u }], s);
      }
      case ps: {
        const d = [], u = i([a, d], s);
        for (const [h, p] of s)
          (t || !(bn(Mr(h)) || bn(Mr(p)))) && d.push([o(h), o(p)]);
        return u;
      }
      case ms: {
        const d = [], u = i([a, d], s);
        for (const h of s)
          (t || !bn(Mr(h))) && d.push(o(h));
        return u;
      }
    }
    const { message: c } = s;
    return i([a, { name: l, message: c }], s);
  };
  return o;
}, Cl = (t, { json: e, lossy: r } = {}) => {
  const n = [];
  return h2(!(e || r), !!e, /* @__PURE__ */ new Map(), n)(t), n;
}, $n = typeof structuredClone == "function" ? (
  /* c8 ignore start */
  (t, e) => e && ("json" in e || "lossy" in e) ? Sl(Cl(t, e)) : structuredClone(t)
) : (t, e) => Sl(Cl(t, e));
function p2(t, e) {
  const r = [{ type: "text", value: "↩" }];
  return e > 1 && r.push({
    type: "element",
    tagName: "sup",
    properties: {},
    children: [{ type: "text", value: String(e) }]
  }), r;
}
function m2(t, e) {
  return "Back to reference " + (t + 1) + (e > 1 ? "-" + e : "");
}
function f2(t) {
  const e = typeof t.options.clobberPrefix == "string" ? t.options.clobberPrefix : "user-content-", r = t.options.footnoteBackContent || p2, n = t.options.footnoteBackLabel || m2, i = t.options.footnoteLabel || "Footnotes", o = t.options.footnoteLabelTagName || "h2", s = t.options.footnoteLabelProperties || {
    className: ["sr-only"]
  }, a = [];
  let l = -1;
  for (; ++l < t.footnoteOrder.length; ) {
    const c = t.footnoteById.get(
      t.footnoteOrder[l]
    );
    if (!c)
      continue;
    const d = t.all(c), u = String(c.identifier).toUpperCase(), h = _r(u.toLowerCase());
    let p = 0;
    const m = [], g = t.footnoteCounts.get(u);
    for (; g !== void 0 && ++p <= g; ) {
      m.length > 0 && m.push({ type: "text", value: " " });
      let k = typeof r == "string" ? r : r(l, p);
      typeof k == "string" && (k = { type: "text", value: k }), m.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + e + "fnref-" + h + (p > 1 ? "-" + p : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof n == "string" ? n : n(l, p),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(k) ? k : [k]
      });
    }
    const v = d[d.length - 1];
    if (v && v.type === "element" && v.tagName === "p") {
      const k = v.children[v.children.length - 1];
      k && k.type === "text" ? k.value += " " : v.children.push({ type: "text", value: " " }), v.children.push(...m);
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
            ...$n(s),
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
const ri = (
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
      return w2;
    if (typeof t == "function")
      return ni(t);
    if (typeof t == "object")
      return Array.isArray(t) ? g2(t) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        b2(
          /** @type {Props} */
          t
        )
      );
    if (typeof t == "string")
      return v2(t);
    throw new Error("Expected function, string, or object as test");
  }
);
function g2(t) {
  const e = [];
  let r = -1;
  for (; ++r < t.length; )
    e[r] = ri(t[r]);
  return ni(n);
  function n(...i) {
    let o = -1;
    for (; ++o < e.length; )
      if (e[o].apply(this, i))
        return !0;
    return !1;
  }
}
function b2(t) {
  const e = (
    /** @type {Record<string, unknown>} */
    t
  );
  return ni(r);
  function r(n) {
    const i = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      n
    );
    let o;
    for (o in t)
      if (i[o] !== e[o])
        return !1;
    return !0;
  }
}
function v2(t) {
  return ni(e);
  function e(r) {
    return r && r.type === t;
  }
}
function ni(t) {
  return e;
  function e(r, n, i) {
    return !!(y2(r) && t.call(
      this,
      r,
      typeof n == "number" ? n : void 0,
      i || void 0
    ));
  }
}
function w2() {
  return !0;
}
function y2(t) {
  return t !== null && typeof t == "object" && "type" in t;
}
const mp = [], x2 = !0, so = !1, k2 = "skip";
function fp(t, e, r, n) {
  let i;
  typeof e == "function" && typeof r != "function" ? (n = r, r = e) : i = e;
  const o = ri(i), s = n ? -1 : 1;
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
      let p = mp, m, g, v;
      if ((!e || o(l, c, d[d.length - 1] || void 0)) && (p = _2(r(l, d)), p[0] === so))
        return p;
      if ("children" in l && l.children) {
        const b = (
          /** @type {UnistParent} */
          l
        );
        if (b.children && p[0] !== k2)
          for (g = (n ? b.children.length : -1) + s, v = d.concat(b); g > -1 && g < b.children.length; ) {
            const k = b.children[g];
            if (m = a(k, g, v)(), m[0] === so)
              return m;
            g = typeof m[1] == "number" ? m[1] : g + s;
          }
      }
      return p;
    }
  }
}
function _2(t) {
  return Array.isArray(t) ? t : typeof t == "number" ? [x2, t] : t == null ? mp : [t];
}
function fs(t, e, r, n) {
  let i, o, s;
  typeof e == "function" && typeof r != "function" ? (o = void 0, s = e, i = r) : (o = e, s = r, i = n), fp(t, o, a, i);
  function a(l, c) {
    const d = c[c.length - 1], u = d ? d.children.indexOf(l) : void 0;
    return s(l, u, d);
  }
}
const ao = {}.hasOwnProperty, S2 = {};
function C2(t, e) {
  const r = e || S2, n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = { ...l2, ...r.handlers }, a = {
    all: c,
    applyData: I2,
    definitionById: n,
    footnoteById: i,
    footnoteCounts: o,
    footnoteOrder: [],
    handlers: s,
    one: l,
    options: r,
    patch: T2,
    wrap: A2
  };
  return fs(t, function(d) {
    if (d.type === "definition" || d.type === "footnoteDefinition") {
      const u = d.type === "definition" ? n : i, h = String(d.identifier).toUpperCase();
      u.has(h) || u.set(h, d);
    }
  }), a;
  function l(d, u) {
    const h = d.type, p = a.handlers[h];
    if (ao.call(a.handlers, h) && p)
      return p(a, d, u);
    if (a.options.passThrough && a.options.passThrough.includes(h)) {
      if ("children" in d) {
        const { children: g, ...v } = d, b = $n(v);
        return b.children = a.all(d), b;
      }
      return $n(d);
    }
    return (a.options.unknownHandler || E2)(a, d, u);
  }
  function c(d) {
    const u = [];
    if ("children" in d) {
      const h = d.children;
      let p = -1;
      for (; ++p < h.length; ) {
        const m = a.one(h[p], d);
        if (m) {
          if (p && h[p - 1].type === "break" && (!Array.isArray(m) && m.type === "text" && (m.value = Tl(m.value)), !Array.isArray(m) && m.type === "element")) {
            const g = m.children[0];
            g && g.type === "text" && (g.value = Tl(g.value));
          }
          Array.isArray(m) ? u.push(...m) : u.push(m);
        }
      }
    }
    return u;
  }
}
function T2(t, e) {
  t.position && (e.position = mC(t));
}
function I2(t, e) {
  let r = e;
  if (t && t.data) {
    const n = t.data.hName, i = t.data.hChildren, o = t.data.hProperties;
    if (typeof n == "string")
      if (r.type === "element")
        r.tagName = n;
      else {
        const s = "children" in r ? r.children : [r];
        r = { type: "element", tagName: n, properties: {}, children: s };
      }
    r.type === "element" && o && Object.assign(r.properties, $n(o)), "children" in r && r.children && i !== null && i !== void 0 && (r.children = i);
  }
  return r;
}
function E2(t, e) {
  const r = e.data || {}, n = "value" in e && !(ao.call(r, "hProperties") || ao.call(r, "hChildren")) ? { type: "text", value: e.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function A2(t, e) {
  const r = [];
  let n = -1;
  for (e && r.push({ type: "text", value: `
` }); ++n < t.length; )
    n && r.push({ type: "text", value: `
` }), r.push(t[n]);
  return e && t.length > 0 && r.push({ type: "text", value: `
` }), r;
}
function Tl(t) {
  let e = 0, r = t.charCodeAt(e);
  for (; r === 9 || r === 32; )
    e++, r = t.charCodeAt(e);
  return t.slice(e);
}
function Il(t, e) {
  const r = C2(t, e), n = r.one(t, void 0), i = f2(r), o = Array.isArray(n) ? { type: "root", children: n } : n || { type: "root", children: [] };
  return i && o.children.push({ type: "text", value: `
` }, i), o;
}
function R2(t, e) {
  return t && "run" in t ? async function(r, n) {
    const i = (
      /** @type {HastRoot} */
      Il(r, { file: n, ...e })
    );
    await t.run(i, n);
  } : function(r, n) {
    return (
      /** @type {HastRoot} */
      Il(r, { file: n, ...t || e })
    );
  };
}
function El(t) {
  if (t)
    throw t;
}
var _n = Object.prototype.hasOwnProperty, gp = Object.prototype.toString, Al = Object.defineProperty, Rl = Object.getOwnPropertyDescriptor, Pl = function(e) {
  return typeof Array.isArray == "function" ? Array.isArray(e) : gp.call(e) === "[object Array]";
}, Ml = function(e) {
  if (!e || gp.call(e) !== "[object Object]")
    return !1;
  var r = _n.call(e, "constructor"), n = e.constructor && e.constructor.prototype && _n.call(e.constructor.prototype, "isPrototypeOf");
  if (e.constructor && !r && !n)
    return !1;
  var i;
  for (i in e)
    ;
  return typeof i > "u" || _n.call(e, i);
}, Dl = function(e, r) {
  Al && r.name === "__proto__" ? Al(e, r.name, {
    enumerable: !0,
    configurable: !0,
    value: r.newValue,
    writable: !0
  }) : e[r.name] = r.newValue;
}, Nl = function(e, r) {
  if (r === "__proto__")
    if (_n.call(e, r)) {
      if (Rl)
        return Rl(e, r).value;
    } else
      return;
  return e[r];
}, P2 = function t() {
  var e, r, n, i, o, s, a = arguments[0], l = 1, c = arguments.length, d = !1;
  for (typeof a == "boolean" && (d = a, a = arguments[1] || {}, l = 2), (a == null || typeof a != "object" && typeof a != "function") && (a = {}); l < c; ++l)
    if (e = arguments[l], e != null)
      for (r in e)
        n = Nl(a, r), i = Nl(e, r), a !== i && (d && i && (Ml(i) || (o = Pl(i))) ? (o ? (o = !1, s = n && Pl(n) ? n : []) : s = n && Ml(n) ? n : {}, Dl(a, { name: r, newValue: t(d, s, i) })) : typeof i < "u" && Dl(a, { name: r, newValue: i }));
  return a;
};
const _i = /* @__PURE__ */ Wn(P2);
function lo(t) {
  if (typeof t != "object" || t === null)
    return !1;
  const e = Object.getPrototypeOf(t);
  return (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) && !(Symbol.toStringTag in t) && !(Symbol.iterator in t);
}
function M2() {
  const t = [], e = { run: r, use: n };
  return e;
  function r(...i) {
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
      i = c, d ? D2(d, a)(...c) : s(null, ...c);
    }
  }
  function n(i) {
    if (typeof i != "function")
      throw new TypeError(
        "Expected `middelware` to be a function, not " + i
      );
    return t.push(i), e;
  }
}
function D2(t, e) {
  let r;
  return n;
  function n(...s) {
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
      if (a && r)
        throw d;
      return i(d);
    }
    a || (l && l.then && typeof l.then == "function" ? l.then(o, i) : l instanceof Error ? i(l) : o(l));
  }
  function i(s, ...a) {
    r || (r = !0, e(s, ...a));
  }
  function o(s) {
    i(null, s);
  }
}
const ot = { basename: N2, dirname: z2, extname: O2, join: L2, sep: "/" };
function N2(t, e) {
  if (e !== void 0 && typeof e != "string")
    throw new TypeError('"ext" argument must be a string');
  nn(t);
  let r = 0, n = -1, i = t.length, o;
  if (e === void 0 || e.length === 0 || e.length > t.length) {
    for (; i--; )
      if (t.codePointAt(i) === 47) {
        if (o) {
          r = i + 1;
          break;
        }
      } else
        n < 0 && (o = !0, n = i + 1);
    return n < 0 ? "" : t.slice(r, n);
  }
  if (e === t)
    return "";
  let s = -1, a = e.length - 1;
  for (; i--; )
    if (t.codePointAt(i) === 47) {
      if (o) {
        r = i + 1;
        break;
      }
    } else
      s < 0 && (o = !0, s = i + 1), a > -1 && (t.codePointAt(i) === e.codePointAt(a--) ? a < 0 && (n = i) : (a = -1, n = s));
  return r === n ? n = s : n < 0 && (n = t.length), t.slice(r, n);
}
function z2(t) {
  if (nn(t), t.length === 0)
    return ".";
  let e = -1, r = t.length, n;
  for (; --r; )
    if (t.codePointAt(r) === 47) {
      if (n) {
        e = r;
        break;
      }
    } else
      n || (n = !0);
  return e < 0 ? t.codePointAt(0) === 47 ? "/" : "." : e === 1 && t.codePointAt(0) === 47 ? "//" : t.slice(0, e);
}
function O2(t) {
  nn(t);
  let e = t.length, r = -1, n = 0, i = -1, o = 0, s;
  for (; e--; ) {
    const a = t.codePointAt(e);
    if (a === 47) {
      if (s) {
        n = e + 1;
        break;
      }
      continue;
    }
    r < 0 && (s = !0, r = e + 1), a === 46 ? i < 0 ? i = e : o !== 1 && (o = 1) : i > -1 && (o = -1);
  }
  return i < 0 || r < 0 || // We saw a non-dot character immediately before the dot.
  o === 0 || // The (right-most) trimmed path component is exactly `..`.
  o === 1 && i === r - 1 && i === n + 1 ? "" : t.slice(i, r);
}
function L2(...t) {
  let e = -1, r;
  for (; ++e < t.length; )
    nn(t[e]), t[e] && (r = r === void 0 ? t[e] : r + "/" + t[e]);
  return r === void 0 ? "." : $2(r);
}
function $2(t) {
  nn(t);
  const e = t.codePointAt(0) === 47;
  let r = B2(t, !e);
  return r.length === 0 && !e && (r = "."), r.length > 0 && t.codePointAt(t.length - 1) === 47 && (r += "/"), e ? "/" + r : r;
}
function B2(t, e) {
  let r = "", n = 0, i = -1, o = 0, s = -1, a, l;
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
          if (r.length < 2 || n !== 2 || r.codePointAt(r.length - 1) !== 46 || r.codePointAt(r.length - 2) !== 46) {
            if (r.length > 2) {
              if (l = r.lastIndexOf("/"), l !== r.length - 1) {
                l < 0 ? (r = "", n = 0) : (r = r.slice(0, l), n = r.length - 1 - r.lastIndexOf("/")), i = s, o = 0;
                continue;
              }
            } else if (r.length > 0) {
              r = "", n = 0, i = s, o = 0;
              continue;
            }
          }
          e && (r = r.length > 0 ? r + "/.." : "..", n = 2);
        } else
          r.length > 0 ? r += "/" + t.slice(i + 1, s) : r = t.slice(i + 1, s), n = s - i - 1;
      i = s, o = 0;
    } else
      a === 46 && o > -1 ? o++ : o = -1;
  }
  return r;
}
function nn(t) {
  if (typeof t != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(t)
    );
}
const F2 = { cwd: U2 };
function U2() {
  return "/";
}
function co(t) {
  return !!(t !== null && typeof t == "object" && "href" in t && t.href && "protocol" in t && t.protocol && // @ts-expect-error: indexing is fine.
  t.auth === void 0);
}
function j2(t) {
  if (typeof t == "string")
    t = new URL(t);
  else if (!co(t)) {
    const e = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + t + "`"
    );
    throw e.code = "ERR_INVALID_ARG_TYPE", e;
  }
  if (t.protocol !== "file:") {
    const e = new TypeError("The URL must be of scheme file");
    throw e.code = "ERR_INVALID_URL_SCHEME", e;
  }
  return V2(t);
}
function V2(t) {
  if (t.hostname !== "") {
    const n = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    throw n.code = "ERR_INVALID_FILE_URL_HOST", n;
  }
  const e = t.pathname;
  let r = -1;
  for (; ++r < e.length; )
    if (e.codePointAt(r) === 37 && e.codePointAt(r + 1) === 50) {
      const n = e.codePointAt(r + 2);
      if (n === 70 || n === 102) {
        const i = new TypeError(
          "File URL path must not include encoded / characters"
        );
        throw i.code = "ERR_INVALID_FILE_URL_PATH", i;
      }
    }
  return decodeURIComponent(e);
}
const Si = (
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
class bp {
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
    let r;
    e ? co(e) ? r = { path: e } : typeof e == "string" || q2(e) ? r = { value: e } : r = e : r = {}, this.cwd = "cwd" in r ? "" : F2.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
    let n = -1;
    for (; ++n < Si.length; ) {
      const o = Si[n];
      o in r && r[o] !== void 0 && r[o] !== null && (this[o] = o === "history" ? [...r[o]] : r[o]);
    }
    let i;
    for (i in r)
      Si.includes(i) || (this[i] = r[i]);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path == "string" ? ot.basename(this.path) : void 0;
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
    Ti(e, "basename"), Ci(e, "basename"), this.path = ot.join(this.dirname || "", e);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path == "string" ? ot.dirname(this.path) : void 0;
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
    zl(this.basename, "dirname"), this.path = ot.join(e || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path == "string" ? ot.extname(this.path) : void 0;
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
    if (Ci(e, "extname"), zl(this.dirname, "extname"), e) {
      if (e.codePointAt(0) !== 46)
        throw new Error("`extname` must start with `.`");
      if (e.includes(".", 1))
        throw new Error("`extname` cannot contain multiple dots");
    }
    this.path = ot.join(this.dirname, this.stem + (e || ""));
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
    co(e) && (e = j2(e)), Ti(e, "path"), this.path !== e && this.history.push(e);
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path == "string" ? ot.basename(this.path, this.extname) : void 0;
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
    Ti(e, "stem"), Ci(e, "stem"), this.path = ot.join(this.dirname || "", e + (this.extname || ""));
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
  fail(e, r, n) {
    const i = this.message(e, r, n);
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
  info(e, r, n) {
    const i = this.message(e, r, n);
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
  message(e, r, n) {
    const i = new Re(
      // @ts-expect-error: the overloads are fine.
      e,
      r,
      n
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
function Ci(t, e) {
  if (t && t.includes(ot.sep))
    throw new Error(
      "`" + e + "` cannot be a path: did not expect `" + ot.sep + "`"
    );
}
function Ti(t, e) {
  if (!t)
    throw new Error("`" + e + "` cannot be empty");
}
function zl(t, e) {
  if (!t)
    throw new Error("Setting `" + e + "` requires `path` to be set too");
}
function q2(t) {
  return !!(t && typeof t == "object" && "byteLength" in t && "byteOffset" in t);
}
const H2 = (
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
    const n = (
      /** @type {Record<string | symbol, Function>} */
      // Prototypes do exist.
      // type-coverage:ignore-next-line
      this.constructor.prototype
    ), i = n[t], o = function() {
      return i.apply(o, arguments);
    };
    return Object.setPrototypeOf(o, n), o;
  }
), G2 = {}.hasOwnProperty;
class gs extends H2 {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = M2();
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
      new gs()
    );
    let r = -1;
    for (; ++r < this.attachers.length; ) {
      const n = this.attachers[r];
      e.use(...n);
    }
    return e.data(_i(!0, {}, this.namespace)), e;
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
  data(e, r) {
    return typeof e == "string" ? arguments.length === 2 ? (Ai("data", this.frozen), this.namespace[e] = r, this) : G2.call(this.namespace, e) && this.namespace[e] || void 0 : e ? (Ai("data", this.frozen), this.namespace = e, this) : this.namespace;
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
      const [r, ...n] = this.attachers[this.freezeIndex];
      if (n[0] === !1)
        continue;
      n[0] === !0 && (n[0] = void 0);
      const i = r.call(e, ...n);
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
    const r = vn(e), n = this.parser || this.Parser;
    return Ii("parse", n), n(String(r), r);
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
  process(e, r) {
    const n = this;
    return this.freeze(), Ii("process", this.parser || this.Parser), Ei("process", this.compiler || this.Compiler), r ? i(void 0, r) : new Promise(i);
    function i(o, s) {
      const a = vn(e), l = (
        /** @type {HeadTree extends undefined ? Node : HeadTree} */
        /** @type {unknown} */
        n.parse(a)
      );
      n.run(l, a, function(d, u, h) {
        if (d || !u || !h)
          return c(d);
        const p = (
          /** @type {CompileTree extends undefined ? Node : CompileTree} */
          /** @type {unknown} */
          u
        ), m = n.stringify(p, h);
        Q2(m) ? h.value = m : h.result = m, c(
          d,
          /** @type {VFileWithOutput<CompileResult>} */
          h
        );
      });
      function c(d, u) {
        d || !u ? s(d) : o ? o(u) : r(void 0, u);
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
    let r = !1, n;
    return this.freeze(), Ii("processSync", this.parser || this.Parser), Ei("processSync", this.compiler || this.Compiler), this.process(e, i), Ll("processSync", "process", r), n;
    function i(o, s) {
      r = !0, El(o), n = s;
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
  run(e, r, n) {
    Ol(e), this.freeze();
    const i = this.transformers;
    return !n && typeof r == "function" && (n = r, r = void 0), n ? o(void 0, n) : new Promise(o);
    function o(s, a) {
      const l = vn(r);
      i.run(e, l, c);
      function c(d, u, h) {
        const p = (
          /** @type {TailTree extends undefined ? Node : TailTree} */
          u || e
        );
        d ? a(d) : s ? s(p) : n(void 0, p, h);
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
  runSync(e, r) {
    let n = !1, i;
    return this.run(e, r, o), Ll("runSync", "run", n), i;
    function o(s, a) {
      El(s), i = a, n = !0;
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
  stringify(e, r) {
    this.freeze();
    const n = vn(r), i = this.compiler || this.Compiler;
    return Ei("stringify", i), Ol(e), i(e, n);
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
  use(e, ...r) {
    const n = this.attachers, i = this.namespace;
    if (Ai("use", this.frozen), e != null)
      if (typeof e == "function")
        l(e, r);
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
      a(c.plugins), c.settings && (i.settings = _i(!0, i.settings, c.settings));
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
      for (; ++u < n.length; )
        if (n[u][0] === c) {
          h = u;
          break;
        }
      if (h === -1)
        n.push([c, ...d]);
      else if (d.length > 0) {
        let [p, ...m] = d;
        const g = n[h][1];
        lo(g) && lo(p) && (p = _i(!0, g, p)), n[h] = [c, p, ...m];
      }
    }
  }
}
const W2 = new gs().freeze();
function Ii(t, e) {
  if (typeof e != "function")
    throw new TypeError("Cannot `" + t + "` without `parser`");
}
function Ei(t, e) {
  if (typeof e != "function")
    throw new TypeError("Cannot `" + t + "` without `compiler`");
}
function Ai(t, e) {
  if (e)
    throw new Error(
      "Cannot call `" + t + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
}
function Ol(t) {
  if (!lo(t) || typeof t.type != "string")
    throw new TypeError("Expected node, got `" + t + "`");
}
function Ll(t, e, r) {
  if (!r)
    throw new Error(
      "`" + t + "` finished async. Use `" + e + "` instead"
    );
}
function vn(t) {
  return K2(t) ? t : new bp(t);
}
function K2(t) {
  return !!(t && typeof t == "object" && "message" in t && "messages" in t);
}
function Q2(t) {
  return typeof t == "string" || Y2(t);
}
function Y2(t) {
  return !!(t && typeof t == "object" && "byteLength" in t && "byteOffset" in t);
}
const J2 = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md", $l = [], Bl = { allowDangerousHtml: !0 }, X2 = /^(https?|ircs?|mailto|xmpp)$/i, Z2 = [
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
function eE(t) {
  const e = tE(t), r = rE(t);
  return nE(e.runSync(e.parse(r), r), t);
}
function tE(t) {
  const e = t.rehypePlugins || $l, r = t.remarkPlugins || $l, n = t.remarkRehypeOptions ? { ...t.remarkRehypeOptions, ...Bl } : Bl;
  return W2().use(OI).use(r).use(R2, n).use(e);
}
function rE(t) {
  const e = t.children || "", r = new bp();
  return typeof e == "string" && (r.value = e), r;
}
function nE(t, e) {
  const r = e.allowedElements, n = e.allowElement, i = e.components, o = e.disallowedElements, s = e.skipHtml, a = e.unwrapDisallowed, l = e.urlTransform || iE;
  for (const d of Z2)
    Object.hasOwn(e, d.from) && ("" + d.from + (d.to ? "use `" + d.to + "` instead" : "remove it") + J2 + d.id, void 0);
  return fs(t, c), wC(t, {
    Fragment: tt,
    components: i,
    ignoreInvalidStyle: !0,
    jsx: f,
    jsxs: H,
    passKeys: !0,
    passNode: !0
  });
  function c(d, u, h) {
    if (d.type === "raw" && h && typeof u == "number")
      return s ? h.children.splice(u, 1) : h.children[u] = { type: "text", value: d.value }, u;
    if (d.type === "element") {
      let p;
      for (p in yi)
        if (Object.hasOwn(yi, p) && Object.hasOwn(d.properties, p)) {
          const m = d.properties[p], g = yi[p];
          (g === null || g.includes(d.tagName)) && (d.properties[p] = l(String(m || ""), p, d));
        }
    }
    if (d.type === "element") {
      let p = r ? !r.includes(d.tagName) : o ? o.includes(d.tagName) : !1;
      if (!p && n && typeof u == "number" && (p = !n(d, u, h)), p && h && typeof u == "number")
        return a && d.children ? h.children.splice(u, 1, ...d.children) : h.children.splice(u, 1), u;
    }
  }
}
function iE(t) {
  const e = t.indexOf(":"), r = t.indexOf("?"), n = t.indexOf("#"), i = t.indexOf("/");
  return (
    // If there is no protocol, it’s relative.
    e === -1 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    i !== -1 && e > i || r !== -1 && e > r || n !== -1 && e > n || // It is a protocol, it should be allowed.
    X2.test(t.slice(0, e)) ? t : ""
  );
}
const { useSmooth: oE, useSmoothStatus: sE, withSmoothContextProvider: aE } = vk, lE = ({ components: t, componentsByLanguage: e, smooth: r = !0, defer: n = !1, preprocess: i, ...o }) => {
  const s = jd(), { text: a } = oE(xt(() => i ? {
    ...s,
    text: i(s.text)
  } : s, [s, i]), r), l = nc(a), c = n ? l : a, { pre: d = fS, code: u = gS, SyntaxHighlighter: h = es, CodeHeader: p = bS } = t ?? {}, m = xt(() => ({
    Pre: d,
    Code: u,
    SyntaxHighlighter: h,
    CodeHeader: p
  }), [
    d,
    u,
    h,
    p
  ]), g = Vt((v) => /* @__PURE__ */ f(kS, {
    components: m,
    componentsByLanguage: e,
    ...v
  }));
  return /* @__PURE__ */ f(eE, {
    components: xt(() => {
      const { pre: v, code: b, SyntaxHighlighter: k, CodeHeader: x, ...T } = t ?? {};
      return {
        ...T,
        pre: mS,
        code: g
      };
    }, [g, t]),
    ...o,
    children: c
  });
}, vp = te(({ className: t, containerProps: e, containerComponent: r = "div", ...n }, i) => /* @__PURE__ */ f(r, {
  "data-status": sE().type,
  ...e,
  className: Nh(t, e == null ? void 0 : e.className),
  ref: i,
  children: /* @__PURE__ */ f(lE, { ...n })
}));
vp.displayName = "MarkdownTextPrimitive";
const cE = aE(vp);
function Fl(t, e) {
  const r = String(t);
  if (typeof e != "string")
    throw new TypeError("Expected character");
  let n = 0, i = r.indexOf(e);
  for (; i !== -1; )
    n++, i = r.indexOf(e, i + e.length);
  return n;
}
function uE(t) {
  if (typeof t != "string")
    throw new TypeError("Expected a string");
  return t.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function dE(t, e, r) {
  const i = ri((r || {}).ignore || []), o = hE(e);
  let s = -1;
  for (; ++s < o.length; )
    fp(t, "text", a);
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
    const v = u.children.indexOf(c);
    let b = !1, k = [];
    h.lastIndex = 0;
    let x = h.exec(c.value);
    for (; x; ) {
      const T = x.index, E = {
        index: x.index,
        input: x.input,
        stack: [...d, c]
      };
      let y = p(...x, E);
      if (typeof y == "string" && (y = y.length > 0 ? { type: "text", value: y } : void 0), y === !1 ? h.lastIndex = T + 1 : (m !== T && k.push({
        type: "text",
        value: c.value.slice(m, T)
      }), Array.isArray(y) ? k.push(...y) : y && k.push(y), m = T + x[0].length, b = !0), !h.global)
        break;
      x = h.exec(c.value);
    }
    return b ? (m < c.value.length && k.push({ type: "text", value: c.value.slice(m) }), u.children.splice(v, 1, ...k)) : k = [c], v + k.length;
  }
}
function hE(t) {
  const e = [];
  if (!Array.isArray(t))
    throw new TypeError("Expected find and replace tuple or list of tuples");
  const r = !t[0] || Array.isArray(t[0]) ? t : [t];
  let n = -1;
  for (; ++n < r.length; ) {
    const i = r[n];
    e.push([pE(i[0]), mE(i[1])]);
  }
  return e;
}
function pE(t) {
  return typeof t == "string" ? new RegExp(uE(t), "g") : t;
}
function mE(t) {
  return typeof t == "function" ? t : function() {
    return t;
  };
}
const Ri = "phrasing", Pi = ["autolink", "link", "image", "label"];
function fE() {
  return {
    transforms: [kE],
    enter: {
      literalAutolink: bE,
      literalAutolinkEmail: Mi,
      literalAutolinkHttp: Mi,
      literalAutolinkWww: Mi
    },
    exit: {
      literalAutolink: xE,
      literalAutolinkEmail: yE,
      literalAutolinkHttp: vE,
      literalAutolinkWww: wE
    }
  };
}
function gE() {
  return {
    unsafe: [
      {
        character: "@",
        before: "[+\\-.\\w]",
        after: "[\\-.\\w]",
        inConstruct: Ri,
        notInConstruct: Pi
      },
      {
        character: ".",
        before: "[Ww]",
        after: "[\\-.\\w]",
        inConstruct: Ri,
        notInConstruct: Pi
      },
      {
        character: ":",
        before: "[ps]",
        after: "\\/",
        inConstruct: Ri,
        notInConstruct: Pi
      }
    ]
  };
}
function bE(t) {
  this.enter({ type: "link", title: null, url: "", children: [] }, t);
}
function Mi(t) {
  this.config.enter.autolinkProtocol.call(this, t);
}
function vE(t) {
  this.config.exit.autolinkProtocol.call(this, t);
}
function wE(t) {
  this.config.exit.data.call(this, t);
  const e = this.stack[this.stack.length - 1];
  e.type, e.url = "http://" + this.sliceSerialize(t);
}
function yE(t) {
  this.config.exit.autolinkEmail.call(this, t);
}
function xE(t) {
  this.exit(t);
}
function kE(t) {
  dE(
    t,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, _E],
      [new RegExp("(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)", "gu"), SE]
    ],
    { ignore: ["link", "linkReference"] }
  );
}
function _E(t, e, r, n, i) {
  let o = "";
  if (!wp(i) || (/^w/i.test(e) && (r = e + r, e = "", o = "http://"), !CE(r)))
    return !1;
  const s = TE(r + n);
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
function SE(t, e, r, n) {
  return (
    // Not an expected previous character.
    !wp(n, !0) || // Label ends in not allowed character.
    /[-\d_]$/.test(r) ? !1 : {
      type: "link",
      title: null,
      url: "mailto:" + e + "@" + r,
      children: [{ type: "text", value: e + "@" + r }]
    }
  );
}
function CE(t) {
  const e = t.split(".");
  return !(e.length < 2 || e[e.length - 1] && (/_/.test(e[e.length - 1]) || !/[a-zA-Z\d]/.test(e[e.length - 1])) || e[e.length - 2] && (/_/.test(e[e.length - 2]) || !/[a-zA-Z\d]/.test(e[e.length - 2])));
}
function TE(t) {
  const e = /[!"&'),.:;<>?\]}]+$/.exec(t);
  if (!e)
    return [t, void 0];
  t = t.slice(0, e.index);
  let r = e[0], n = r.indexOf(")");
  const i = Fl(t, "(");
  let o = Fl(t, ")");
  for (; n !== -1 && i > o; )
    t += r.slice(0, n + 1), r = r.slice(n + 1), n = r.indexOf(")"), o++;
  return [t, r];
}
function wp(t, e) {
  const r = t.input.charCodeAt(t.index - 1);
  return (t.index === 0 || qt(r) || Zn(r)) && // If it’s an email, the previous character should not be a slash.
  (!e || r !== 47);
}
yp.peek = zE;
function IE() {
  this.buffer();
}
function EE(t) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, t);
}
function AE() {
  this.buffer();
}
function RE(t) {
  this.enter(
    { type: "footnoteDefinition", identifier: "", label: "", children: [] },
    t
  );
}
function PE(t) {
  const e = this.resume(), r = this.stack[this.stack.length - 1];
  r.type, r.identifier = Xe(
    this.sliceSerialize(t)
  ).toLowerCase(), r.label = e;
}
function ME(t) {
  this.exit(t);
}
function DE(t) {
  const e = this.resume(), r = this.stack[this.stack.length - 1];
  r.type, r.identifier = Xe(
    this.sliceSerialize(t)
  ).toLowerCase(), r.label = e;
}
function NE(t) {
  this.exit(t);
}
function zE() {
  return "[";
}
function yp(t, e, r, n) {
  const i = r.createTracker(n);
  let o = i.move("[^");
  const s = r.enter("footnoteReference"), a = r.enter("reference");
  return o += i.move(
    r.safe(r.associationId(t), { after: "]", before: o })
  ), a(), s(), o += i.move("]"), o;
}
function OE() {
  return {
    enter: {
      gfmFootnoteCallString: IE,
      gfmFootnoteCall: EE,
      gfmFootnoteDefinitionLabelString: AE,
      gfmFootnoteDefinition: RE
    },
    exit: {
      gfmFootnoteCallString: PE,
      gfmFootnoteCall: ME,
      gfmFootnoteDefinitionLabelString: DE,
      gfmFootnoteDefinition: NE
    }
  };
}
function LE(t) {
  let e = !1;
  return t && t.firstLineBlank && (e = !0), {
    handlers: { footnoteDefinition: r, footnoteReference: yp },
    // This is on by default already.
    unsafe: [{ character: "[", inConstruct: ["label", "phrasing", "reference"] }]
  };
  function r(n, i, o, s) {
    const a = o.createTracker(s);
    let l = a.move("[^");
    const c = o.enter("footnoteDefinition"), d = o.enter("label");
    return l += a.move(
      o.safe(o.associationId(n), { before: l, after: "]" })
    ), d(), l += a.move("]:"), n.children && n.children.length > 0 && (a.shift(4), l += a.move(
      (e ? `
` : " ") + o.indentLines(
        o.containerFlow(n, a.current()),
        e ? xp : $E
      )
    )), c(), l;
  }
}
function $E(t, e, r) {
  return e === 0 ? t : xp(t, e, r);
}
function xp(t, e, r) {
  return (r ? "" : "    ") + t;
}
const BE = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];
kp.peek = qE;
function FE() {
  return {
    canContainEols: ["delete"],
    enter: { strikethrough: jE },
    exit: { strikethrough: VE }
  };
}
function UE() {
  return {
    unsafe: [
      {
        character: "~",
        inConstruct: "phrasing",
        notInConstruct: BE
      }
    ],
    handlers: { delete: kp }
  };
}
function jE(t) {
  this.enter({ type: "delete", children: [] }, t);
}
function VE(t) {
  this.exit(t);
}
function kp(t, e, r, n) {
  const i = r.createTracker(n), o = r.enter("strikethrough");
  let s = i.move("~~");
  return s += r.containerPhrasing(t, {
    ...i.current(),
    before: s,
    after: "~"
  }), s += i.move("~~"), o(), s;
}
function qE() {
  return "~";
}
function HE(t) {
  return t.length;
}
function GE(t, e) {
  const r = e || {}, n = (r.align || []).concat(), i = r.stringLength || HE, o = [], s = [], a = [], l = [];
  let c = 0, d = -1;
  for (; ++d < t.length; ) {
    const g = [], v = [];
    let b = -1;
    for (t[d].length > c && (c = t[d].length); ++b < t[d].length; ) {
      const k = WE(t[d][b]);
      if (r.alignDelimiters !== !1) {
        const x = i(k);
        v[b] = x, (l[b] === void 0 || x > l[b]) && (l[b] = x);
      }
      g.push(k);
    }
    s[d] = g, a[d] = v;
  }
  let u = -1;
  if (typeof n == "object" && "length" in n)
    for (; ++u < c; )
      o[u] = Ul(n[u]);
  else {
    const g = Ul(n);
    for (; ++u < c; )
      o[u] = g;
  }
  u = -1;
  const h = [], p = [];
  for (; ++u < c; ) {
    const g = o[u];
    let v = "", b = "";
    g === 99 ? (v = ":", b = ":") : g === 108 ? v = ":" : g === 114 && (b = ":");
    let k = r.alignDelimiters === !1 ? 1 : Math.max(
      1,
      l[u] - v.length - b.length
    );
    const x = v + "-".repeat(k) + b;
    r.alignDelimiters !== !1 && (k = v.length + k + b.length, k > l[u] && (l[u] = k), p[u] = k), h[u] = x;
  }
  s.splice(1, 0, h), a.splice(1, 0, p), d = -1;
  const m = [];
  for (; ++d < s.length; ) {
    const g = s[d], v = a[d];
    u = -1;
    const b = [];
    for (; ++u < c; ) {
      const k = g[u] || "";
      let x = "", T = "";
      if (r.alignDelimiters !== !1) {
        const E = l[u] - (v[u] || 0), y = o[u];
        y === 114 ? x = " ".repeat(E) : y === 99 ? E % 2 ? (x = " ".repeat(E / 2 + 0.5), T = " ".repeat(E / 2 - 0.5)) : (x = " ".repeat(E / 2), T = x) : T = " ".repeat(E);
      }
      r.delimiterStart !== !1 && !u && b.push("|"), r.padding !== !1 && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(r.alignDelimiters === !1 && k === "") && (r.delimiterStart !== !1 || u) && b.push(" "), r.alignDelimiters !== !1 && b.push(x), b.push(k), r.alignDelimiters !== !1 && b.push(T), r.padding !== !1 && b.push(" "), (r.delimiterEnd !== !1 || u !== c - 1) && b.push("|");
    }
    m.push(
      r.delimiterEnd === !1 ? b.join("").replace(/ +$/, "") : b.join("")
    );
  }
  return m.join(`
`);
}
function WE(t) {
  return t == null ? "" : String(t);
}
function Ul(t) {
  const e = typeof t == "string" ? t.codePointAt(0) : 0;
  return e === 67 || e === 99 ? 99 : e === 76 || e === 108 ? 108 : e === 82 || e === 114 ? 114 : 0;
}
function KE(t, e, r, n) {
  const i = r.enter("blockquote"), o = r.createTracker(n);
  o.move("> "), o.shift(2);
  const s = r.indentLines(
    r.containerFlow(t, o.current()),
    QE
  );
  return i(), s;
}
function QE(t, e, r) {
  return ">" + (r ? "" : " ") + t;
}
function YE(t, e) {
  return jl(t, e.inConstruct, !0) && !jl(t, e.notInConstruct, !1);
}
function jl(t, e, r) {
  if (typeof e == "string" && (e = [e]), !e || e.length === 0)
    return r;
  let n = -1;
  for (; ++n < e.length; )
    if (t.includes(e[n]))
      return !0;
  return !1;
}
function Vl(t, e, r, n) {
  let i = -1;
  for (; ++i < r.unsafe.length; )
    if (r.unsafe[i].character === `
` && YE(r.stack, r.unsafe[i]))
      return /[ \t]/.test(n.before) ? "" : " ";
  return `\\
`;
}
function JE(t, e) {
  const r = String(t);
  let n = r.indexOf(e), i = n, o = 0, s = 0;
  if (typeof e != "string")
    throw new TypeError("Expected substring");
  for (; n !== -1; )
    n === i ? ++o > s && (s = o) : o = 1, i = n + e.length, n = r.indexOf(e, i);
  return s;
}
function XE(t, e) {
  return !!(e.options.fences === !1 && t.value && // If there’s no info…
  !t.lang && // And there’s a non-whitespace character…
  /[^ \r\n]/.test(t.value) && // And the value doesn’t start or end in a blank…
  !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(t.value));
}
function ZE(t) {
  const e = t.options.fence || "`";
  if (e !== "`" && e !== "~")
    throw new Error(
      "Cannot serialize code with `" + e + "` for `options.fence`, expected `` ` `` or `~`"
    );
  return e;
}
function eA(t, e, r, n) {
  const i = ZE(r), o = t.value || "", s = i === "`" ? "GraveAccent" : "Tilde";
  if (XE(t, r)) {
    const u = r.enter("codeIndented"), h = r.indentLines(o, tA);
    return u(), h;
  }
  const a = r.createTracker(n), l = i.repeat(Math.max(JE(o, i) + 1, 3)), c = r.enter("codeFenced");
  let d = a.move(l);
  if (t.lang) {
    const u = r.enter(`codeFencedLang${s}`);
    d += a.move(
      r.safe(t.lang, {
        before: d,
        after: " ",
        encode: ["`"],
        ...a.current()
      })
    ), u();
  }
  if (t.lang && t.meta) {
    const u = r.enter(`codeFencedMeta${s}`);
    d += a.move(" "), d += a.move(
      r.safe(t.meta, {
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
function tA(t, e, r) {
  return (r ? "" : "    ") + t;
}
function bs(t) {
  const e = t.options.quote || '"';
  if (e !== '"' && e !== "'")
    throw new Error(
      "Cannot serialize title with `" + e + "` for `options.quote`, expected `\"`, or `'`"
    );
  return e;
}
function rA(t, e, r, n) {
  const i = bs(r), o = i === '"' ? "Quote" : "Apostrophe", s = r.enter("definition");
  let a = r.enter("label");
  const l = r.createTracker(n);
  let c = l.move("[");
  return c += l.move(
    r.safe(r.associationId(t), {
      before: c,
      after: "]",
      ...l.current()
    })
  ), c += l.move("]: "), a(), // If there’s no url, or…
  !t.url || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(t.url) ? (a = r.enter("destinationLiteral"), c += l.move("<"), c += l.move(
    r.safe(t.url, { before: c, after: ">", ...l.current() })
  ), c += l.move(">")) : (a = r.enter("destinationRaw"), c += l.move(
    r.safe(t.url, {
      before: c,
      after: t.title ? " " : `
`,
      ...l.current()
    })
  )), a(), t.title && (a = r.enter(`title${o}`), c += l.move(" " + i), c += l.move(
    r.safe(t.title, {
      before: c,
      after: i,
      ...l.current()
    })
  ), c += l.move(i), a()), s(), c;
}
function nA(t) {
  const e = t.options.emphasis || "*";
  if (e !== "*" && e !== "_")
    throw new Error(
      "Cannot serialize emphasis with `" + e + "` for `options.emphasis`, expected `*`, or `_`"
    );
  return e;
}
function Gr(t) {
  return "&#x" + t.toString(16).toUpperCase() + ";";
}
function Bn(t, e, r) {
  const n = br(t), i = br(e);
  return n === void 0 ? i === void 0 ? (
    // Letter inside:
    // we have to encode *both* letters for `_` as it is looser.
    // it already forms for `*` (and GFMs `~`).
    r === "_" ? { inside: !0, outside: !0 } : { inside: !1, outside: !1 }
  ) : i === 1 ? (
    // Whitespace inside: encode both (letter, whitespace).
    { inside: !0, outside: !0 }
  ) : (
    // Punctuation inside: encode outer (letter)
    { inside: !1, outside: !0 }
  ) : n === 1 ? i === void 0 ? (
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
_p.peek = iA;
function _p(t, e, r, n) {
  const i = nA(r), o = r.enter("emphasis"), s = r.createTracker(n), a = s.move(i);
  let l = s.move(
    r.containerPhrasing(t, {
      after: i,
      before: a,
      ...s.current()
    })
  );
  const c = l.charCodeAt(0), d = Bn(
    n.before.charCodeAt(n.before.length - 1),
    c,
    i
  );
  d.inside && (l = Gr(c) + l.slice(1));
  const u = l.charCodeAt(l.length - 1), h = Bn(n.after.charCodeAt(0), u, i);
  h.inside && (l = l.slice(0, -1) + Gr(u));
  const p = s.move(i);
  return o(), r.attentionEncodeSurroundingInfo = {
    after: h.outside,
    before: d.outside
  }, a + l + p;
}
function iA(t, e, r) {
  return r.options.emphasis || "*";
}
function oA(t, e) {
  let r = !1;
  return fs(t, function(n) {
    if ("value" in n && /\r?\n|\r/.test(n.value) || n.type === "break")
      return r = !0, so;
  }), !!((!t.depth || t.depth < 3) && ls(t) && (e.options.setext || r));
}
function sA(t, e, r, n) {
  const i = Math.max(Math.min(6, t.depth || 1), 1), o = r.createTracker(n);
  if (oA(t, r)) {
    const d = r.enter("headingSetext"), u = r.enter("phrasing"), h = r.containerPhrasing(t, {
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
  const s = "#".repeat(i), a = r.enter("headingAtx"), l = r.enter("phrasing");
  o.move(s + " ");
  let c = r.containerPhrasing(t, {
    before: "# ",
    after: `
`,
    ...o.current()
  });
  return /^[\t ]/.test(c) && (c = Gr(c.charCodeAt(0)) + c.slice(1)), c = c ? s + " " + c : s, r.options.closeAtx && (c += " " + s), l(), a(), c;
}
Sp.peek = aA;
function Sp(t) {
  return t.value || "";
}
function aA() {
  return "<";
}
Cp.peek = lA;
function Cp(t, e, r, n) {
  const i = bs(r), o = i === '"' ? "Quote" : "Apostrophe", s = r.enter("image");
  let a = r.enter("label");
  const l = r.createTracker(n);
  let c = l.move("![");
  return c += l.move(
    r.safe(t.alt, { before: c, after: "]", ...l.current() })
  ), c += l.move("]("), a(), // If there’s no url but there is a title…
  !t.url && t.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(t.url) ? (a = r.enter("destinationLiteral"), c += l.move("<"), c += l.move(
    r.safe(t.url, { before: c, after: ">", ...l.current() })
  ), c += l.move(">")) : (a = r.enter("destinationRaw"), c += l.move(
    r.safe(t.url, {
      before: c,
      after: t.title ? " " : ")",
      ...l.current()
    })
  )), a(), t.title && (a = r.enter(`title${o}`), c += l.move(" " + i), c += l.move(
    r.safe(t.title, {
      before: c,
      after: i,
      ...l.current()
    })
  ), c += l.move(i), a()), c += l.move(")"), s(), c;
}
function lA() {
  return "!";
}
Tp.peek = cA;
function Tp(t, e, r, n) {
  const i = t.referenceType, o = r.enter("imageReference");
  let s = r.enter("label");
  const a = r.createTracker(n);
  let l = a.move("![");
  const c = r.safe(t.alt, {
    before: l,
    after: "]",
    ...a.current()
  });
  l += a.move(c + "]["), s();
  const d = r.stack;
  r.stack = [], s = r.enter("reference");
  const u = r.safe(r.associationId(t), {
    before: l,
    after: "]",
    ...a.current()
  });
  return s(), r.stack = d, o(), i === "full" || !c || c !== u ? l += a.move(u + "]") : i === "shortcut" ? l = l.slice(0, -1) : l += a.move("]"), l;
}
function cA() {
  return "!";
}
Ip.peek = uA;
function Ip(t, e, r) {
  let n = t.value || "", i = "`", o = -1;
  for (; new RegExp("(^|[^`])" + i + "([^`]|$)").test(n); )
    i += "`";
  for (/[^ \r\n]/.test(n) && (/^[ \r\n]/.test(n) && /[ \r\n]$/.test(n) || /^`|`$/.test(n)) && (n = " " + n + " "); ++o < r.unsafe.length; ) {
    const s = r.unsafe[o], a = r.compilePattern(s);
    let l;
    if (s.atBreak)
      for (; l = a.exec(n); ) {
        let c = l.index;
        n.charCodeAt(c) === 10 && n.charCodeAt(c - 1) === 13 && c--, n = n.slice(0, c) + " " + n.slice(l.index + 1);
      }
  }
  return i + n + i;
}
function uA() {
  return "`";
}
function Ep(t, e) {
  const r = ls(t);
  return !!(!e.options.resourceLink && // If there’s a url…
  t.url && // And there’s a no title…
  !t.title && // And the content of `node` is a single text node…
  t.children && t.children.length === 1 && t.children[0].type === "text" && // And if the url is the same as the content…
  (r === t.url || "mailto:" + r === t.url) && // And that starts w/ a protocol…
  /^[a-z][a-z+.-]+:/i.test(t.url) && // And that doesn’t contain ASCII control codes (character escapes and
  // references don’t work), space, or angle brackets…
  !/[\0- <>\u007F]/.test(t.url));
}
Ap.peek = dA;
function Ap(t, e, r, n) {
  const i = bs(r), o = i === '"' ? "Quote" : "Apostrophe", s = r.createTracker(n);
  let a, l;
  if (Ep(t, r)) {
    const d = r.stack;
    r.stack = [], a = r.enter("autolink");
    let u = s.move("<");
    return u += s.move(
      r.containerPhrasing(t, {
        before: u,
        after: ">",
        ...s.current()
      })
    ), u += s.move(">"), a(), r.stack = d, u;
  }
  a = r.enter("link"), l = r.enter("label");
  let c = s.move("[");
  return c += s.move(
    r.containerPhrasing(t, {
      before: c,
      after: "](",
      ...s.current()
    })
  ), c += s.move("]("), l(), // If there’s no url but there is a title…
  !t.url && t.title || // If there are control characters or whitespace.
  /[\0- \u007F]/.test(t.url) ? (l = r.enter("destinationLiteral"), c += s.move("<"), c += s.move(
    r.safe(t.url, { before: c, after: ">", ...s.current() })
  ), c += s.move(">")) : (l = r.enter("destinationRaw"), c += s.move(
    r.safe(t.url, {
      before: c,
      after: t.title ? " " : ")",
      ...s.current()
    })
  )), l(), t.title && (l = r.enter(`title${o}`), c += s.move(" " + i), c += s.move(
    r.safe(t.title, {
      before: c,
      after: i,
      ...s.current()
    })
  ), c += s.move(i), l()), c += s.move(")"), a(), c;
}
function dA(t, e, r) {
  return Ep(t, r) ? "<" : "[";
}
Rp.peek = hA;
function Rp(t, e, r, n) {
  const i = t.referenceType, o = r.enter("linkReference");
  let s = r.enter("label");
  const a = r.createTracker(n);
  let l = a.move("[");
  const c = r.containerPhrasing(t, {
    before: l,
    after: "]",
    ...a.current()
  });
  l += a.move(c + "]["), s();
  const d = r.stack;
  r.stack = [], s = r.enter("reference");
  const u = r.safe(r.associationId(t), {
    before: l,
    after: "]",
    ...a.current()
  });
  return s(), r.stack = d, o(), i === "full" || !c || c !== u ? l += a.move(u + "]") : i === "shortcut" ? l = l.slice(0, -1) : l += a.move("]"), l;
}
function hA() {
  return "[";
}
function vs(t) {
  const e = t.options.bullet || "*";
  if (e !== "*" && e !== "+" && e !== "-")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.bullet`, expected `*`, `+`, or `-`"
    );
  return e;
}
function pA(t) {
  const e = vs(t), r = t.options.bulletOther;
  if (!r)
    return e === "*" ? "-" : "*";
  if (r !== "*" && r !== "+" && r !== "-")
    throw new Error(
      "Cannot serialize items with `" + r + "` for `options.bulletOther`, expected `*`, `+`, or `-`"
    );
  if (r === e)
    throw new Error(
      "Expected `bullet` (`" + e + "`) and `bulletOther` (`" + r + "`) to be different"
    );
  return r;
}
function mA(t) {
  const e = t.options.bulletOrdered || ".";
  if (e !== "." && e !== ")")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.bulletOrdered`, expected `.` or `)`"
    );
  return e;
}
function Pp(t) {
  const e = t.options.rule || "*";
  if (e !== "*" && e !== "-" && e !== "_")
    throw new Error(
      "Cannot serialize rules with `" + e + "` for `options.rule`, expected `*`, `-`, or `_`"
    );
  return e;
}
function fA(t, e, r, n) {
  const i = r.enter("list"), o = r.bulletCurrent;
  let s = t.ordered ? mA(r) : vs(r);
  const a = t.ordered ? s === "." ? ")" : "." : pA(r);
  let l = e && r.bulletLastUsed ? s === r.bulletLastUsed : !1;
  if (!t.ordered) {
    const d = t.children ? t.children[0] : void 0;
    if (
      // Bullet could be used as a thematic break marker:
      (s === "*" || s === "-") && // Empty first list item:
      d && (!d.children || !d.children[0]) && // Directly in two other list items:
      r.stack[r.stack.length - 1] === "list" && r.stack[r.stack.length - 2] === "listItem" && r.stack[r.stack.length - 3] === "list" && r.stack[r.stack.length - 4] === "listItem" && // That are each the first child.
      r.indexStack[r.indexStack.length - 1] === 0 && r.indexStack[r.indexStack.length - 2] === 0 && r.indexStack[r.indexStack.length - 3] === 0 && (l = !0), Pp(r) === s && d
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
  l && (s = a), r.bulletCurrent = s;
  const c = r.containerFlow(t, n);
  return r.bulletLastUsed = s, r.bulletCurrent = o, i(), c;
}
function gA(t) {
  const e = t.options.listItemIndent || "one";
  if (e !== "tab" && e !== "one" && e !== "mixed")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
    );
  return e;
}
function bA(t, e, r, n) {
  const i = gA(r);
  let o = r.bulletCurrent || vs(r);
  e && e.type === "list" && e.ordered && (o = (typeof e.start == "number" && e.start > -1 ? e.start : 1) + (r.options.incrementListMarker === !1 ? 0 : e.children.indexOf(t)) + o);
  let s = o.length + 1;
  (i === "tab" || i === "mixed" && (e && e.type === "list" && e.spread || t.spread)) && (s = Math.ceil(s / 4) * 4);
  const a = r.createTracker(n);
  a.move(o + " ".repeat(s - o.length)), a.shift(s);
  const l = r.enter("listItem"), c = r.indentLines(
    r.containerFlow(t, a.current()),
    d
  );
  return l(), c;
  function d(u, h, p) {
    return h ? (p ? "" : " ".repeat(s)) + u : (p ? o : o + " ".repeat(s - o.length)) + u;
  }
}
function vA(t, e, r, n) {
  const i = r.enter("paragraph"), o = r.enter("phrasing"), s = r.containerPhrasing(t, n);
  return o(), i(), s;
}
const wA = (
  /** @type {(node?: unknown) => node is Exclude<PhrasingContent, Html>} */
  ri([
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
function yA(t, e, r, n) {
  return (t.children.some(function(s) {
    return wA(s);
  }) ? r.containerPhrasing : r.containerFlow).call(r, t, n);
}
function xA(t) {
  const e = t.options.strong || "*";
  if (e !== "*" && e !== "_")
    throw new Error(
      "Cannot serialize strong with `" + e + "` for `options.strong`, expected `*`, or `_`"
    );
  return e;
}
Mp.peek = kA;
function Mp(t, e, r, n) {
  const i = xA(r), o = r.enter("strong"), s = r.createTracker(n), a = s.move(i + i);
  let l = s.move(
    r.containerPhrasing(t, {
      after: i,
      before: a,
      ...s.current()
    })
  );
  const c = l.charCodeAt(0), d = Bn(
    n.before.charCodeAt(n.before.length - 1),
    c,
    i
  );
  d.inside && (l = Gr(c) + l.slice(1));
  const u = l.charCodeAt(l.length - 1), h = Bn(n.after.charCodeAt(0), u, i);
  h.inside && (l = l.slice(0, -1) + Gr(u));
  const p = s.move(i + i);
  return o(), r.attentionEncodeSurroundingInfo = {
    after: h.outside,
    before: d.outside
  }, a + l + p;
}
function kA(t, e, r) {
  return r.options.strong || "*";
}
function _A(t, e, r, n) {
  return r.safe(t.value, n);
}
function SA(t) {
  const e = t.options.ruleRepetition || 3;
  if (e < 3)
    throw new Error(
      "Cannot serialize rules with repetition `" + e + "` for `options.ruleRepetition`, expected `3` or more"
    );
  return e;
}
function CA(t, e, r) {
  const n = (Pp(r) + (r.options.ruleSpaces ? " " : "")).repeat(SA(r));
  return r.options.ruleSpaces ? n.slice(0, -1) : n;
}
const Dp = {
  blockquote: KE,
  break: Vl,
  code: eA,
  definition: rA,
  emphasis: _p,
  hardBreak: Vl,
  heading: sA,
  html: Sp,
  image: Cp,
  imageReference: Tp,
  inlineCode: Ip,
  link: Ap,
  linkReference: Rp,
  list: fA,
  listItem: bA,
  paragraph: vA,
  root: yA,
  strong: Mp,
  text: _A,
  thematicBreak: CA
};
function TA() {
  return {
    enter: {
      table: IA,
      tableData: ql,
      tableHeader: ql,
      tableRow: AA
    },
    exit: {
      codeText: RA,
      table: EA,
      tableData: Di,
      tableHeader: Di,
      tableRow: Di
    }
  };
}
function IA(t) {
  const e = t._align;
  this.enter(
    {
      type: "table",
      align: e.map(function(r) {
        return r === "none" ? null : r;
      }),
      children: []
    },
    t
  ), this.data.inTable = !0;
}
function EA(t) {
  this.exit(t), this.data.inTable = void 0;
}
function AA(t) {
  this.enter({ type: "tableRow", children: [] }, t);
}
function Di(t) {
  this.exit(t);
}
function ql(t) {
  this.enter({ type: "tableCell", children: [] }, t);
}
function RA(t) {
  let e = this.resume();
  this.data.inTable && (e = e.replace(/\\([\\|])/g, PA));
  const r = this.stack[this.stack.length - 1];
  r.type, r.value = e, this.exit(t);
}
function PA(t, e) {
  return e === "|" ? e : t;
}
function MA(t) {
  const e = t || {}, r = e.tableCellPadding, n = e.tablePipeAlign, i = e.stringLength, o = r ? " " : "|";
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
  function s(p, m, g, v) {
    return c(d(p, g, v), p.align);
  }
  function a(p, m, g, v) {
    const b = u(p, g, v), k = c([b]);
    return k.slice(0, k.indexOf(`
`));
  }
  function l(p, m, g, v) {
    const b = g.enter("tableCell"), k = g.enter("phrasing"), x = g.containerPhrasing(p, {
      ...v,
      before: o,
      after: o
    });
    return k(), b(), x;
  }
  function c(p, m) {
    return GE(p, {
      align: m,
      // @ts-expect-error: `markdown-table` types should support `null`.
      alignDelimiters: n,
      // @ts-expect-error: `markdown-table` types should support `null`.
      padding: r,
      // @ts-expect-error: `markdown-table` types should support `null`.
      stringLength: i
    });
  }
  function d(p, m, g) {
    const v = p.children;
    let b = -1;
    const k = [], x = m.enter("table");
    for (; ++b < v.length; )
      k[b] = u(v[b], m, g);
    return x(), k;
  }
  function u(p, m, g) {
    const v = p.children;
    let b = -1;
    const k = [], x = m.enter("tableRow");
    for (; ++b < v.length; )
      k[b] = l(v[b], p, m, g);
    return x(), k;
  }
  function h(p, m, g) {
    let v = Dp.inlineCode(p, m, g);
    return g.stack.includes("tableCell") && (v = v.replace(/\|/g, "\\$&")), v;
  }
}
function DA() {
  return {
    exit: {
      taskListCheckValueChecked: Hl,
      taskListCheckValueUnchecked: Hl,
      paragraph: zA
    }
  };
}
function NA() {
  return {
    unsafe: [{ atBreak: !0, character: "-", after: "[:|-]" }],
    handlers: { listItem: OA }
  };
}
function Hl(t) {
  const e = this.stack[this.stack.length - 2];
  e.type, e.checked = t.type === "taskListCheckValueChecked";
}
function zA(t) {
  const e = this.stack[this.stack.length - 2];
  if (e && e.type === "listItem" && typeof e.checked == "boolean") {
    const r = this.stack[this.stack.length - 1];
    r.type;
    const n = r.children[0];
    if (n && n.type === "text") {
      const i = e.children;
      let o = -1, s;
      for (; ++o < i.length; ) {
        const a = i[o];
        if (a.type === "paragraph") {
          s = a;
          break;
        }
      }
      s === r && (n.value = n.value.slice(1), n.value.length === 0 ? r.children.shift() : r.position && n.position && typeof n.position.start.offset == "number" && (n.position.start.column++, n.position.start.offset++, r.position.start = Object.assign({}, n.position.start)));
    }
  }
  this.exit(t);
}
function OA(t, e, r, n) {
  const i = t.children[0], o = typeof t.checked == "boolean" && i && i.type === "paragraph", s = "[" + (t.checked ? "x" : " ") + "] ", a = r.createTracker(n);
  o && a.move(s);
  let l = Dp.listItem(t, e, r, {
    ...n,
    ...a.current()
  });
  return o && (l = l.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, c)), l;
  function c(d) {
    return d + s;
  }
}
function LA() {
  return [
    fE(),
    OE(),
    FE(),
    TA(),
    DA()
  ];
}
function $A(t) {
  return {
    extensions: [
      gE(),
      LE(t),
      UE(),
      MA(t),
      NA()
    ]
  };
}
const BA = {
  tokenize: HA,
  partial: !0
}, Np = {
  tokenize: GA,
  partial: !0
}, zp = {
  tokenize: WA,
  partial: !0
}, Op = {
  tokenize: KA,
  partial: !0
}, FA = {
  tokenize: QA,
  partial: !0
}, Lp = {
  name: "wwwAutolink",
  tokenize: VA,
  previous: Bp
}, $p = {
  name: "protocolAutolink",
  tokenize: qA,
  previous: Fp
}, gt = {
  name: "emailAutolink",
  tokenize: jA,
  previous: Up
}, ut = {};
function UA() {
  return {
    text: ut
  };
}
let Mt = 48;
for (; Mt < 123; )
  ut[Mt] = gt, Mt++, Mt === 58 ? Mt = 65 : Mt === 91 && (Mt = 97);
ut[43] = gt;
ut[45] = gt;
ut[46] = gt;
ut[95] = gt;
ut[72] = [gt, $p];
ut[104] = [gt, $p];
ut[87] = [gt, Lp];
ut[119] = [gt, Lp];
function jA(t, e, r) {
  const n = this;
  let i, o;
  return s;
  function s(u) {
    return !uo(u) || !Up.call(n, n.previous) || ws(n.events) ? r(u) : (t.enter("literalAutolink"), t.enter("literalAutolinkEmail"), a(u));
  }
  function a(u) {
    return uo(u) ? (t.consume(u), a) : u === 64 ? (t.consume(u), l) : r(u);
  }
  function l(u) {
    return u === 46 ? t.check(FA, d, c)(u) : u === 45 || u === 95 || Ee(u) ? (o = !0, t.consume(u), l) : d(u);
  }
  function c(u) {
    return t.consume(u), i = !0, l;
  }
  function d(u) {
    return o && i && Me(n.previous) ? (t.exit("literalAutolinkEmail"), t.exit("literalAutolink"), e(u)) : r(u);
  }
}
function VA(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    return s !== 87 && s !== 119 || !Bp.call(n, n.previous) || ws(n.events) ? r(s) : (t.enter("literalAutolink"), t.enter("literalAutolinkWww"), t.check(BA, t.attempt(Np, t.attempt(zp, o), r), r)(s));
  }
  function o(s) {
    return t.exit("literalAutolinkWww"), t.exit("literalAutolink"), e(s);
  }
}
function qA(t, e, r) {
  const n = this;
  let i = "", o = !1;
  return s;
  function s(u) {
    return (u === 72 || u === 104) && Fp.call(n, n.previous) && !ws(n.events) ? (t.enter("literalAutolink"), t.enter("literalAutolinkHttp"), i += String.fromCodePoint(u), t.consume(u), a) : r(u);
  }
  function a(u) {
    if (Me(u) && i.length < 5)
      return i += String.fromCodePoint(u), t.consume(u), a;
    if (u === 58) {
      const h = i.toLowerCase();
      if (h === "http" || h === "https")
        return t.consume(u), l;
    }
    return r(u);
  }
  function l(u) {
    return u === 47 ? (t.consume(u), o ? c : (o = !0, l)) : r(u);
  }
  function c(u) {
    return u === null || On(u) || ge(u) || qt(u) || Zn(u) ? r(u) : t.attempt(Np, t.attempt(zp, d), r)(u);
  }
  function d(u) {
    return t.exit("literalAutolinkHttp"), t.exit("literalAutolink"), e(u);
  }
}
function HA(t, e, r) {
  let n = 0;
  return i;
  function i(s) {
    return (s === 87 || s === 119) && n < 3 ? (n++, t.consume(s), i) : s === 46 && n === 3 ? (t.consume(s), o) : r(s);
  }
  function o(s) {
    return s === null ? r(s) : e(s);
  }
}
function GA(t, e, r) {
  let n, i, o;
  return s;
  function s(c) {
    return c === 46 || c === 95 ? t.check(Op, l, a)(c) : c === null || ge(c) || qt(c) || c !== 45 && Zn(c) ? l(c) : (o = !0, t.consume(c), s);
  }
  function a(c) {
    return c === 95 ? n = !0 : (i = n, n = void 0), t.consume(c), s;
  }
  function l(c) {
    return i || n || !o ? r(c) : e(c);
  }
}
function WA(t, e) {
  let r = 0, n = 0;
  return i;
  function i(s) {
    return s === 40 ? (r++, t.consume(s), i) : s === 41 && n < r ? o(s) : s === 33 || s === 34 || s === 38 || s === 39 || s === 41 || s === 42 || s === 44 || s === 46 || s === 58 || s === 59 || s === 60 || s === 63 || s === 93 || s === 95 || s === 126 ? t.check(Op, e, o)(s) : s === null || ge(s) || qt(s) ? e(s) : (t.consume(s), i);
  }
  function o(s) {
    return s === 41 && n++, t.consume(s), i;
  }
}
function KA(t, e, r) {
  return n;
  function n(a) {
    return a === 33 || a === 34 || a === 39 || a === 41 || a === 42 || a === 44 || a === 46 || a === 58 || a === 59 || a === 63 || a === 95 || a === 126 ? (t.consume(a), n) : a === 38 ? (t.consume(a), o) : a === 93 ? (t.consume(a), i) : (
      // `<` is an end.
      a === 60 || // So is whitespace.
      a === null || ge(a) || qt(a) ? e(a) : r(a)
    );
  }
  function i(a) {
    return a === null || a === 40 || a === 91 || ge(a) || qt(a) ? e(a) : n(a);
  }
  function o(a) {
    return Me(a) ? s(a) : r(a);
  }
  function s(a) {
    return a === 59 ? (t.consume(a), n) : Me(a) ? (t.consume(a), s) : r(a);
  }
}
function QA(t, e, r) {
  return n;
  function n(o) {
    return t.consume(o), i;
  }
  function i(o) {
    return Ee(o) ? r(o) : e(o);
  }
}
function Bp(t) {
  return t === null || t === 40 || t === 42 || t === 95 || t === 91 || t === 93 || t === 126 || ge(t);
}
function Fp(t) {
  return !Me(t);
}
function Up(t) {
  return !(t === 47 || uo(t));
}
function uo(t) {
  return t === 43 || t === 45 || t === 46 || t === 95 || Ee(t);
}
function ws(t) {
  let e = t.length, r = !1;
  for (; e--; ) {
    const n = t[e][1];
    if ((n.type === "labelLink" || n.type === "labelImage") && !n._balanced) {
      r = !0;
      break;
    }
    if (n._gfmAutolinkLiteralWalkedInto) {
      r = !1;
      break;
    }
  }
  return t.length > 0 && !r && (t[t.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), r;
}
const YA = {
  tokenize: i3,
  partial: !0
};
function JA() {
  return {
    document: {
      91: {
        name: "gfmFootnoteDefinition",
        tokenize: t3,
        continuation: {
          tokenize: r3
        },
        exit: n3
      }
    },
    text: {
      91: {
        name: "gfmFootnoteCall",
        tokenize: e3
      },
      93: {
        name: "gfmPotentialFootnoteCall",
        add: "after",
        tokenize: XA,
        resolveTo: ZA
      }
    }
  };
}
function XA(t, e, r) {
  const n = this;
  let i = n.events.length;
  const o = n.parser.gfmFootnotes || (n.parser.gfmFootnotes = []);
  let s;
  for (; i--; ) {
    const l = n.events[i][1];
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
      return r(l);
    const c = Xe(n.sliceSerialize({
      start: s.end,
      end: n.now()
    }));
    return c.codePointAt(0) !== 94 || !o.includes(c.slice(1)) ? r(l) : (t.enter("gfmFootnoteCallLabelMarker"), t.consume(l), t.exit("gfmFootnoteCallLabelMarker"), e(l));
  }
}
function ZA(t, e) {
  let r = t.length;
  for (; r--; )
    if (t[r][1].type === "labelImage" && t[r][0] === "enter") {
      t[r][1];
      break;
    }
  t[r + 1][1].type = "data", t[r + 3][1].type = "gfmFootnoteCallLabelMarker";
  const n = {
    type: "gfmFootnoteCall",
    start: Object.assign({}, t[r + 3][1].start),
    end: Object.assign({}, t[t.length - 1][1].end)
  }, i = {
    type: "gfmFootnoteCallMarker",
    start: Object.assign({}, t[r + 3][1].end),
    end: Object.assign({}, t[r + 3][1].end)
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
    t[r + 1],
    t[r + 2],
    ["enter", n, e],
    // The `[`
    t[r + 3],
    t[r + 4],
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
    ["exit", n, e]
  ];
  return t.splice(r, t.length - r + 1, ...a), t;
}
function e3(t, e, r) {
  const n = this, i = n.parser.gfmFootnotes || (n.parser.gfmFootnotes = []);
  let o = 0, s;
  return a;
  function a(u) {
    return t.enter("gfmFootnoteCall"), t.enter("gfmFootnoteCallLabelMarker"), t.consume(u), t.exit("gfmFootnoteCallLabelMarker"), l;
  }
  function l(u) {
    return u !== 94 ? r(u) : (t.enter("gfmFootnoteCallMarker"), t.consume(u), t.exit("gfmFootnoteCallMarker"), t.enter("gfmFootnoteCallString"), t.enter("chunkString").contentType = "string", c);
  }
  function c(u) {
    if (
      // Too long.
      o > 999 || // Closing brace with nothing.
      u === 93 && !s || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      u === null || u === 91 || ge(u)
    )
      return r(u);
    if (u === 93) {
      t.exit("chunkString");
      const h = t.exit("gfmFootnoteCallString");
      return i.includes(Xe(n.sliceSerialize(h))) ? (t.enter("gfmFootnoteCallLabelMarker"), t.consume(u), t.exit("gfmFootnoteCallLabelMarker"), t.exit("gfmFootnoteCall"), e) : r(u);
    }
    return ge(u) || (s = !0), o++, t.consume(u), u === 92 ? d : c;
  }
  function d(u) {
    return u === 91 || u === 92 || u === 93 ? (t.consume(u), o++, c) : c(u);
  }
}
function t3(t, e, r) {
  const n = this, i = n.parser.gfmFootnotes || (n.parser.gfmFootnotes = []);
  let o, s = 0, a;
  return l;
  function l(m) {
    return t.enter("gfmFootnoteDefinition")._container = !0, t.enter("gfmFootnoteDefinitionLabel"), t.enter("gfmFootnoteDefinitionLabelMarker"), t.consume(m), t.exit("gfmFootnoteDefinitionLabelMarker"), c;
  }
  function c(m) {
    return m === 94 ? (t.enter("gfmFootnoteDefinitionMarker"), t.consume(m), t.exit("gfmFootnoteDefinitionMarker"), t.enter("gfmFootnoteDefinitionLabelString"), t.enter("chunkString").contentType = "string", d) : r(m);
  }
  function d(m) {
    if (
      // Too long.
      s > 999 || // Closing brace with nothing.
      m === 93 && !a || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      m === null || m === 91 || ge(m)
    )
      return r(m);
    if (m === 93) {
      t.exit("chunkString");
      const g = t.exit("gfmFootnoteDefinitionLabelString");
      return o = Xe(n.sliceSerialize(g)), t.enter("gfmFootnoteDefinitionLabelMarker"), t.consume(m), t.exit("gfmFootnoteDefinitionLabelMarker"), t.exit("gfmFootnoteDefinitionLabel"), h;
    }
    return ge(m) || (a = !0), s++, t.consume(m), m === 92 ? u : d;
  }
  function u(m) {
    return m === 91 || m === 92 || m === 93 ? (t.consume(m), s++, d) : d(m);
  }
  function h(m) {
    return m === 58 ? (t.enter("definitionMarker"), t.consume(m), t.exit("definitionMarker"), i.includes(o) || i.push(o), se(t, p, "gfmFootnoteDefinitionWhitespace")) : r(m);
  }
  function p(m) {
    return e(m);
  }
}
function r3(t, e, r) {
  return t.check(rn, e, t.attempt(YA, e, r));
}
function n3(t) {
  t.exit("gfmFootnoteDefinition");
}
function i3(t, e, r) {
  const n = this;
  return se(t, i, "gfmFootnoteDefinitionIndent", 4 + 1);
  function i(o) {
    const s = n.events[n.events.length - 1];
    return s && s[1].type === "gfmFootnoteDefinitionIndent" && s[2].sliceSerialize(s[1], !0).length === 4 ? e(o) : r(o);
  }
}
function o3(t) {
  let r = (t || {}).singleTilde;
  const n = {
    name: "strikethrough",
    tokenize: o,
    resolveAll: i
  };
  return r == null && (r = !0), {
    text: {
      126: n
    },
    insideSpan: {
      null: [n]
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
            p && $e(h, h.length, 0, ei(p, s.slice(c + 1, l), a)), $e(h, h.length, 0, [["exit", u, a], ["enter", s[l][1], a], ["exit", s[l][1], a], ["exit", d, a]]), $e(s, c - 1, l - c + 3, h), l = c + h.length - 2;
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
      const g = br(c);
      if (m === 126)
        return u > 1 ? l(m) : (s.consume(m), u++, p);
      if (u < 2 && !r)
        return l(m);
      const v = s.exit("strikethroughSequenceTemporary"), b = br(m);
      return v._open = !b || b === 2 && !!g, v._close = !g || g === 2 && !!b, a(m);
    }
  }
}
class s3 {
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
  add(e, r, n) {
    a3(this, e, r, n);
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
    let r = this.map.length;
    const n = [];
    for (; r > 0; )
      r -= 1, n.push(e.slice(this.map[r][0] + this.map[r][1]), this.map[r][2]), e.length = this.map[r][0];
    n.push(e.slice()), e.length = 0;
    let i = n.pop();
    for (; i; ) {
      for (const o of i)
        e.push(o);
      i = n.pop();
    }
    this.map.length = 0;
  }
}
function a3(t, e, r, n) {
  let i = 0;
  if (!(r === 0 && n.length === 0)) {
    for (; i < t.map.length; ) {
      if (t.map[i][0] === e) {
        t.map[i][1] += r, t.map[i][2].push(...n);
        return;
      }
      i += 1;
    }
    t.map.push([e, r, n]);
  }
}
function l3(t, e) {
  let r = !1;
  const n = [];
  for (; e < t.length; ) {
    const i = t[e];
    if (r) {
      if (i[0] === "enter")
        i[1].type === "tableContent" && n.push(t[e + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
      else if (i[1].type === "tableContent") {
        if (t[e - 1][1].type === "tableDelimiterMarker") {
          const o = n.length - 1;
          n[o] = n[o] === "left" ? "center" : "right";
        }
      } else if (i[1].type === "tableDelimiterRow")
        break;
    } else
      i[0] === "enter" && i[1].type === "tableDelimiterRow" && (r = !0);
    e += 1;
  }
  return n;
}
function c3() {
  return {
    flow: {
      null: {
        name: "table",
        tokenize: u3,
        resolveAll: d3
      }
    }
  };
}
function u3(t, e, r) {
  const n = this;
  let i = 0, o = 0, s;
  return a;
  function a(_) {
    let I = n.events.length - 1;
    for (; I > -1; ) {
      const $ = n.events[I][1].type;
      if ($ === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
      $ === "linePrefix")
        I--;
      else
        break;
    }
    const M = I > -1 ? n.events[I][1].type : null, N = M === "tableHead" || M === "tableRow" ? y : l;
    return N === y && n.parser.lazy[n.now().line] ? r(_) : N(_);
  }
  function l(_) {
    return t.enter("tableHead"), t.enter("tableRow"), c(_);
  }
  function c(_) {
    return _ === 124 || (s = !0, o += 1), d(_);
  }
  function d(_) {
    return _ === null ? r(_) : Y(_) ? o > 1 ? (o = 0, n.interrupt = !0, t.exit("tableRow"), t.enter("lineEnding"), t.consume(_), t.exit("lineEnding"), p) : r(_) : ne(_) ? se(t, d, "whitespace")(_) : (o += 1, s && (s = !1, i += 1), _ === 124 ? (t.enter("tableCellDivider"), t.consume(_), t.exit("tableCellDivider"), s = !0, d) : (t.enter("data"), u(_)));
  }
  function u(_) {
    return _ === null || _ === 124 || ge(_) ? (t.exit("data"), d(_)) : (t.consume(_), _ === 92 ? h : u);
  }
  function h(_) {
    return _ === 92 || _ === 124 ? (t.consume(_), u) : u(_);
  }
  function p(_) {
    return n.interrupt = !1, n.parser.lazy[n.now().line] ? r(_) : (t.enter("tableDelimiterRow"), s = !1, ne(_) ? se(t, m, "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(_) : m(_));
  }
  function m(_) {
    return _ === 45 || _ === 58 ? v(_) : _ === 124 ? (s = !0, t.enter("tableCellDivider"), t.consume(_), t.exit("tableCellDivider"), g) : E(_);
  }
  function g(_) {
    return ne(_) ? se(t, v, "whitespace")(_) : v(_);
  }
  function v(_) {
    return _ === 58 ? (o += 1, s = !0, t.enter("tableDelimiterMarker"), t.consume(_), t.exit("tableDelimiterMarker"), b) : _ === 45 ? (o += 1, b(_)) : _ === null || Y(_) ? T(_) : E(_);
  }
  function b(_) {
    return _ === 45 ? (t.enter("tableDelimiterFiller"), k(_)) : E(_);
  }
  function k(_) {
    return _ === 45 ? (t.consume(_), k) : _ === 58 ? (s = !0, t.exit("tableDelimiterFiller"), t.enter("tableDelimiterMarker"), t.consume(_), t.exit("tableDelimiterMarker"), x) : (t.exit("tableDelimiterFiller"), x(_));
  }
  function x(_) {
    return ne(_) ? se(t, T, "whitespace")(_) : T(_);
  }
  function T(_) {
    return _ === 124 ? m(_) : _ === null || Y(_) ? !s || i !== o ? E(_) : (t.exit("tableDelimiterRow"), t.exit("tableHead"), e(_)) : E(_);
  }
  function E(_) {
    return r(_);
  }
  function y(_) {
    return t.enter("tableRow"), P(_);
  }
  function P(_) {
    return _ === 124 ? (t.enter("tableCellDivider"), t.consume(_), t.exit("tableCellDivider"), P) : _ === null || Y(_) ? (t.exit("tableRow"), e(_)) : ne(_) ? se(t, P, "whitespace")(_) : (t.enter("data"), R(_));
  }
  function R(_) {
    return _ === null || _ === 124 || ge(_) ? (t.exit("data"), P(_)) : (t.consume(_), _ === 92 ? D : R);
  }
  function D(_) {
    return _ === 92 || _ === 124 ? (t.consume(_), R) : R(_);
  }
}
function d3(t, e) {
  let r = -1, n = !0, i = 0, o = [0, 0, 0, 0], s = [0, 0, 0, 0], a = !1, l = 0, c, d, u;
  const h = new s3();
  for (; ++r < t.length; ) {
    const p = t[r], m = p[1];
    p[0] === "enter" ? m.type === "tableHead" ? (a = !1, l !== 0 && (Gl(h, e, l, c, d), d = void 0, l = 0), c = {
      type: "table",
      start: Object.assign({}, m.start),
      // Note: correct end is set later.
      end: Object.assign({}, m.end)
    }, h.add(r, 0, [["enter", c, e]])) : m.type === "tableRow" || m.type === "tableDelimiterRow" ? (n = !0, u = void 0, o = [0, 0, 0, 0], s = [0, r + 1, 0, 0], a && (a = !1, d = {
      type: "tableBody",
      start: Object.assign({}, m.start),
      // Note: correct end is set later.
      end: Object.assign({}, m.end)
    }, h.add(r, 0, [["enter", d, e]])), i = m.type === "tableDelimiterRow" ? 2 : d ? 3 : 1) : i && (m.type === "data" || m.type === "tableDelimiterMarker" || m.type === "tableDelimiterFiller") ? (n = !1, s[2] === 0 && (o[1] !== 0 && (s[0] = s[1], u = wn(h, e, o, i, void 0, u), o = [0, 0, 0, 0]), s[2] = r)) : m.type === "tableCellDivider" && (n ? n = !1 : (o[1] !== 0 && (s[0] = s[1], u = wn(h, e, o, i, void 0, u)), o = s, s = [o[1], r, 0, 0])) : m.type === "tableHead" ? (a = !0, l = r) : m.type === "tableRow" || m.type === "tableDelimiterRow" ? (l = r, o[1] !== 0 ? (s[0] = s[1], u = wn(h, e, o, i, r, u)) : s[1] !== 0 && (u = wn(h, e, s, i, r, u)), i = 0) : i && (m.type === "data" || m.type === "tableDelimiterMarker" || m.type === "tableDelimiterFiller") && (s[3] = r);
  }
  for (l !== 0 && Gl(h, e, l, c, d), h.consume(e.events), r = -1; ++r < e.events.length; ) {
    const p = e.events[r];
    p[0] === "enter" && p[1].type === "table" && (p[1]._align = l3(e.events, r));
  }
  return t;
}
function wn(t, e, r, n, i, o) {
  const s = n === 1 ? "tableHeader" : n === 2 ? "tableDelimiter" : "tableData", a = "tableContent";
  r[0] !== 0 && (o.end = Object.assign({}, cr(e.events, r[0])), t.add(r[0], 0, [["exit", o, e]]));
  const l = cr(e.events, r[1]);
  if (o = {
    type: s,
    start: Object.assign({}, l),
    // Note: correct end is set later.
    end: Object.assign({}, l)
  }, t.add(r[1], 0, [["enter", o, e]]), r[2] !== 0) {
    const c = cr(e.events, r[2]), d = cr(e.events, r[3]), u = {
      type: a,
      start: Object.assign({}, c),
      end: Object.assign({}, d)
    };
    if (t.add(r[2], 0, [["enter", u, e]]), n !== 2) {
      const h = e.events[r[2]], p = e.events[r[3]];
      if (h[1].end = Object.assign({}, p[1].end), h[1].type = "chunkText", h[1].contentType = "text", r[3] > r[2] + 1) {
        const m = r[2] + 1, g = r[3] - r[2] - 1;
        t.add(m, g, []);
      }
    }
    t.add(r[3] + 1, 0, [["exit", u, e]]);
  }
  return i !== void 0 && (o.end = Object.assign({}, cr(e.events, i)), t.add(i, 0, [["exit", o, e]]), o = void 0), o;
}
function Gl(t, e, r, n, i) {
  const o = [], s = cr(e.events, r);
  i && (i.end = Object.assign({}, s), o.push(["exit", i, e])), n.end = Object.assign({}, s), o.push(["exit", n, e]), t.add(r + 1, 0, o);
}
function cr(t, e) {
  const r = t[e], n = r[0] === "enter" ? "start" : "end";
  return r[1][n];
}
const h3 = {
  name: "tasklistCheck",
  tokenize: m3
};
function p3() {
  return {
    text: {
      91: h3
    }
  };
}
function m3(t, e, r) {
  const n = this;
  return i;
  function i(l) {
    return (
      // Exit if there’s stuff before.
      n.previous !== null || // Exit if not in the first content that is the first child of a list
      // item.
      !n._gfmTasklistFirstContentOfListItem ? r(l) : (t.enter("taskListCheck"), t.enter("taskListCheckMarker"), t.consume(l), t.exit("taskListCheckMarker"), o)
    );
  }
  function o(l) {
    return ge(l) ? (t.enter("taskListCheckValueUnchecked"), t.consume(l), t.exit("taskListCheckValueUnchecked"), s) : l === 88 || l === 120 ? (t.enter("taskListCheckValueChecked"), t.consume(l), t.exit("taskListCheckValueChecked"), s) : r(l);
  }
  function s(l) {
    return l === 93 ? (t.enter("taskListCheckMarker"), t.consume(l), t.exit("taskListCheckMarker"), t.exit("taskListCheck"), a) : r(l);
  }
  function a(l) {
    return Y(l) ? e(l) : ne(l) ? t.check({
      tokenize: f3
    }, e, r)(l) : r(l);
  }
}
function f3(t, e, r) {
  return se(t, n, "whitespace");
  function n(i) {
    return i === null ? r(i) : e(i);
  }
}
function g3(t) {
  return Qh([
    UA(),
    JA(),
    o3(t),
    c3(),
    p3()
  ]);
}
const b3 = {};
function v3(t) {
  const e = (
    /** @type {Processor<Root>} */
    this
  ), r = t || b3, n = e.data(), i = n.micromarkExtensions || (n.micromarkExtensions = []), o = n.fromMarkdownExtensions || (n.fromMarkdownExtensions = []), s = n.toMarkdownExtensions || (n.toMarkdownExtensions = []);
  i.push(g3(r)), o.push(LA()), s.push($A(r));
}
const w3 = () => /* @__PURE__ */ f(
  cE,
  {
    remarkPlugins: [v3],
    className: "aui-md",
    components: k3,
    defer: !0
  }
), jp = we(w3), y3 = ({ language: t, code: e }) => {
  const { isCopied: r, copyToClipboard: n } = x3();
  return /* @__PURE__ */ H("div", { className: "aui-code-header-root border-border/50 bg-muted/50 mt-3 flex items-center justify-between rounded-t-xl border border-b-0 px-3.5 py-1.5 text-xs", children: [
    /* @__PURE__ */ f("span", { className: "aui-code-header-language text-muted-foreground font-medium lowercase", children: t }),
    /* @__PURE__ */ H(er, { tooltip: "Copy", onClick: () => {
      !e || r || n(e);
    }, children: [
      !r && /* @__PURE__ */ f(hh, { className: "animate-in zoom-in-75 fade-in duration-150" }),
      r && /* @__PURE__ */ f(Ko, { className: "animate-in zoom-in-50 fade-in duration-200 ease-out" })
    ] })
  ] });
}, x3 = ({
  copiedDuration: t = 3e3
} = {}) => {
  const [e, r] = Ie(!1);
  return { isCopied: e, copyToClipboard: (i) => {
    !i || typeof navigator > "u" || !navigator.clipboard || navigator.clipboard.writeText(i).then(
      () => {
        r(!0), setTimeout(() => r(!1), t);
      },
      () => {
      }
    );
  } };
}, k3 = hS({
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
  code: function({ className: e, ...r }) {
    const n = Mh();
    return /* @__PURE__ */ f(
      "code",
      {
        className: K(
          !n && "aui-md-inline-code bg-muted rounded-md px-1.5 py-0.5 font-mono text-[0.85em]",
          e
        ),
        ...r
      }
    );
  },
  CodeHeader: y3
}), Wl = (t) => typeof t == "boolean" ? `${t}` : t === 0 ? "0" : t, Kl = fh, Vp = (t, e) => (r) => {
  var n;
  if ((e == null ? void 0 : e.variants) == null)
    return Kl(t, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
  const { variants: i, defaultVariants: o } = e, s = Object.keys(i).map((c) => {
    const d = r == null ? void 0 : r[c], u = o == null ? void 0 : o[c];
    if (d === null)
      return null;
    const h = Wl(d) || Wl(u);
    return i[c][h];
  }), a = r && Object.entries(r).reduce((c, d) => {
    let [u, h] = d;
    return h === void 0 || (c[u] = h), c;
  }, {}), l = e == null || (n = e.compoundVariants) === null || n === void 0 ? void 0 : n.reduce((c, d) => {
    let { class: u, className: h, ...p } = d;
    return Object.entries(p).every((m) => {
      let [g, v] = m;
      return Array.isArray(v) ? v.includes({
        ...o,
        ...a
      }[g]) : {
        ...o,
        ...a
      }[g] === v;
    }) ? [
      ...c,
      u,
      h
    ] : c;
  }, []);
  return Kl(t, s, l, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
}, _3 = window.UIComponents.Collapsible, S3 = window.UIComponents.CollapsibleContent, C3 = window.UIComponents.CollapsibleTrigger, T3 = 200, ys = po(!1), I3 = Vp("aui-reasoning-root mb-4 w-full", {
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
function E3({
  className: t,
  variant: e,
  open: r,
  onOpenChange: n,
  defaultOpen: i = !1,
  streaming: o,
  children: s,
  ...a
}) {
  const l = lt(i), [c, d] = Ie(null), u = r !== void 0, h = u ? r : c ?? o ?? l.current, m = o === !0 && h && (u || c === null);
  return /* @__PURE__ */ f(
    _3,
    {
      "data-slot": "reasoning-root",
      "data-variant": e,
      open: h,
      onOpenChange: (v) => {
        u || d(v), n == null || n(v);
      },
      className: K("group/reasoning-root", I3({ variant: e, className: t })),
      style: { "--animation-duration": `${T3}ms` },
      ...a,
      children: /* @__PURE__ */ f(ys.Provider, { value: m, children: s })
    }
  );
}
function Ql({
  side: t = "bottom",
  className: e,
  ...r
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
      ...r
    }
  );
}
function A3({
  active: t,
  duration: e,
  className: r,
  ...n
}) {
  const i = e ? ` (${e}s)` : "";
  return /* @__PURE__ */ H(
    C3,
    {
      "data-slot": "reasoning-trigger",
      className: K(
        "aui-reasoning-trigger group/trigger text-muted-foreground hover:text-foreground flex max-w-[75%] origin-left items-center gap-2 py-1.5 text-sm transition-[color,scale] active:scale-[0.98]",
        r
      ),
      ...n,
      children: [
        /* @__PURE__ */ f(
          Rk,
          {
            "data-slot": "reasoning-trigger-icon",
            className: "aui-reasoning-trigger-icon size-4 shrink-0"
          }
        ),
        /* @__PURE__ */ H(
          "span",
          {
            "data-slot": "reasoning-trigger-label",
            className: "aui-reasoning-trigger-label-wrapper relative inline-block leading-none tabular-nums",
            children: [
              /* @__PURE__ */ H("span", { children: [
                "Reasoning",
                i
              ] }),
              t ? /* @__PURE__ */ H(
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
          Qo,
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
function R3({
  className: t,
  children: e,
  ...r
}) {
  const n = Jr(ys);
  return /* @__PURE__ */ H(
    S3,
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
      ...r,
      children: [
        /* @__PURE__ */ f(Ql, { side: "top" }),
        e,
        n ? /* @__PURE__ */ f(Ql, {}) : null
      ]
    }
  );
}
function P3({
  className: t,
  children: e,
  ...r
}) {
  const n = Jr(ys), i = lt(null), o = lt(null);
  return Ht(() => {
    if (!n)
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
  }, [n]), /* @__PURE__ */ f(
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
      ...r,
      children: /* @__PURE__ */ f("div", { ref: o, className: "aui-reasoning-text-content space-y-4", children: e })
    }
  );
}
const M3 = () => /* @__PURE__ */ f(jp, {}), qp = we(M3);
qp.displayName = "Reasoning";
const D3 = window.UIComponents.Collapsible, N3 = window.UIComponents.CollapsibleContent, z3 = window.UIComponents.CollapsibleTrigger, sr = window.UIComponents.Button, O3 = 200, ar = "active:scale-[0.98]";
function L3({
  className: t,
  open: e,
  onOpenChange: r,
  defaultOpen: n = !1,
  children: i,
  ...o
}) {
  const [s, a] = Ie(n), l = e !== void 0;
  return /* @__PURE__ */ f(
    D3,
    {
      "data-slot": "tool-fallback-root",
      open: l ? e : s,
      onOpenChange: (u) => {
        l || a(u), r == null || r(u);
      },
      className: K("aui-tool-fallback-root group/tool-fallback-root w-full", t),
      style: { "--animation-duration": `${O3}ms` },
      ...o,
      children: i
    }
  );
}
const $3 = {
  running: ph,
  complete: Ko,
  incomplete: zk,
  "requires-action": dh
}, B3 = (t) => {
  if (t < 1e3)
    return "<1s";
  const e = t / 1e3;
  return e < 10 ? `${(Math.floor(e * 10) / 10).toFixed(1)}s` : e < 60 ? `${Math.floor(e)}s` : `${Math.floor(e / 60)}m ${Math.floor(e % 60)}s`;
};
function F3({
  className: t,
  ...e
}) {
  const r = gk();
  return r === void 0 ? null : /* @__PURE__ */ f(
    "span",
    {
      "data-slot": "tool-fallback-duration",
      className: K("aui-tool-fallback-duration text-muted-foreground text-xs tabular-nums", t),
      ...e,
      children: B3(r)
    }
  );
}
function U3({
  toolName: t,
  status: e,
  className: r,
  ...n
}) {
  const i = (e == null ? void 0 : e.type) ?? "complete", o = i === "running", s = (e == null ? void 0 : e.type) === "incomplete" && e.reason === "cancelled", a = $3[i], l = s ? "Cancelled tool" : "Used tool";
  return /* @__PURE__ */ H(
    z3,
    {
      "data-slot": "tool-fallback-trigger",
      className: K(
        "aui-tool-fallback-trigger group/trigger text-muted-foreground hover:text-foreground flex w-fit origin-left items-center gap-2 py-1.5 text-sm transition-[color,scale] active:scale-[0.98]",
        r
      ),
      ...n,
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
        /* @__PURE__ */ H(
          "span",
          {
            "data-slot": "tool-fallback-trigger-label",
            className: K(
              "aui-tool-fallback-trigger-label-wrapper relative inline-block text-start leading-none",
              s && "text-muted-foreground line-through"
            ),
            children: [
              /* @__PURE__ */ H("span", { children: [
                l,
                ": ",
                /* @__PURE__ */ f("b", { children: t })
              ] }),
              o && /* @__PURE__ */ H(
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
        /* @__PURE__ */ f(F3, {}),
        /* @__PURE__ */ f(
          Qo,
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
function j3({
  className: t,
  children: e,
  ...r
}) {
  return /* @__PURE__ */ f(
    N3,
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
      ...r,
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
function V3({
  argsText: t,
  className: e,
  ...r
}) {
  return t ? /* @__PURE__ */ f("div", { "data-slot": "tool-fallback-args", className: K("aui-tool-fallback-args", e), ...r, children: /* @__PURE__ */ f("pre", { className: "aui-tool-fallback-args-value bg-muted/50 text-foreground/90 rounded-md p-2.5 text-xs whitespace-pre-wrap", children: t }) }) : null;
}
function q3({
  result: t,
  className: e,
  ...r
}) {
  return t === void 0 ? null : /* @__PURE__ */ H("div", { "data-slot": "tool-fallback-result", className: K("aui-tool-fallback-result", e), ...r, children: [
    /* @__PURE__ */ f("p", { className: "aui-tool-fallback-result-header text-muted-foreground text-xs font-medium", children: "Result:" }),
    /* @__PURE__ */ f("pre", { className: "aui-tool-fallback-result-content bg-muted/50 text-foreground/90 mt-1 max-h-80 overflow-y-auto rounded-md p-2.5 text-xs whitespace-pre-wrap", children: typeof t == "string" ? t : JSON.stringify(t, null, 2) })
  ] });
}
function H3({
  status: t,
  className: e,
  ...r
}) {
  if ((t == null ? void 0 : t.type) !== "incomplete")
    return null;
  const n = t.error, i = n ? typeof n == "string" ? n : JSON.stringify(n) : null;
  if (!i)
    return null;
  const s = t.reason === "cancelled" ? "Cancelled reason:" : "Error:";
  return /* @__PURE__ */ H("div", { "data-slot": "tool-fallback-error", className: K("aui-tool-fallback-error", e), ...r, children: [
    /* @__PURE__ */ f("p", { className: "aui-tool-fallback-error-header text-muted-foreground font-semibold", children: s }),
    /* @__PURE__ */ f("p", { className: "aui-tool-fallback-error-reason text-muted-foreground", children: i })
  ] });
}
const G3 = "Approved by user", W3 = "User denied tool execution", ho = {
  "allow-once": "Allow",
  "allow-always": "Always allow",
  "reject-once": "Deny",
  "reject-always": "Always deny"
}, Yl = (t) => t === "allow-once" || t === "allow-always", Jl = (t) => t.label ?? (Object.hasOwn(ho, t.kind) ? ho[t.kind] : void 0) ?? t.id;
function K3({
  className: t,
  addResult: e,
  resume: r,
  interrupt: n,
  approval: i,
  respondToApproval: o,
  ...s
}) {
  const [a, l] = Ie(!1), [c, d] = Ie(null);
  if (i != null && (i.approved !== void 0 || i.resolution !== void 0))
    return null;
  const u = o ? i == null ? void 0 : i.options : void 0, h = u == null ? void 0 : u.filter(
    (b) => Object.hasOwn(ho, b.kind)
  ), p = (b) => {
    a || (i != null && i.approved === void 0 && o ? o({ approved: b }) : n ? r == null || r({ approved: b }) : e == null || e(b ? G3 : W3), l(!0));
  }, m = (b) => {
    a || (o == null || o({ optionId: b.id }), l(!0), d(null));
  }, g = (b) => {
    b.confirm ? d(b.id) : m(b);
  }, v = c != null ? h == null ? void 0 : h.find((b) => b.id === c) : void 0;
  if (v) {
    const b = typeof v.confirm == "object" ? v.confirm : void 0, k = (b == null ? void 0 : b.description) ?? v.description;
    return /* @__PURE__ */ H(
      "div",
      {
        "data-slot": "tool-fallback-approval-confirm",
        className: K("aui-tool-fallback-approval-confirm flex flex-col gap-2 pt-1", t),
        ...s,
        children: [
          /* @__PURE__ */ f("p", { className: "aui-tool-fallback-approval-confirm-title font-semibold", children: (b == null ? void 0 : b.title) ?? `${Jl(v)}?` }),
          k && /* @__PURE__ */ f("p", { className: "aui-tool-fallback-approval-confirm-description text-muted-foreground", children: k }),
          v.grants && v.grants.length > 0 && /* @__PURE__ */ f("ul", { className: "aui-tool-fallback-approval-confirm-grants flex flex-col gap-1", children: v.grants.map((x) => /* @__PURE__ */ f("li", { children: /* @__PURE__ */ f("code", { className: "aui-tool-fallback-approval-confirm-grant bg-muted rounded px-1.5 py-0.5 text-xs", children: x }) }, x)) }),
          /* @__PURE__ */ H("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ f(sr, { size: "sm", className: ar, onClick: () => m(v), disabled: a, children: "Confirm" }),
            /* @__PURE__ */ f(sr, { size: "sm", variant: "outline", className: ar, onClick: () => d(null), disabled: a, children: "Back" })
          ] })
        ]
      }
    );
  }
  if (u && u.length > 0) {
    const b = (h == null ? void 0 : h.filter((x) => Yl(x.kind))) ?? [], k = (h == null ? void 0 : h.filter((x) => !Yl(x.kind))) ?? [];
    return /* @__PURE__ */ H(
      "div",
      {
        "data-slot": "tool-fallback-approval",
        className: K("aui-tool-fallback-approval flex flex-wrap items-center gap-2 pt-1", t),
        ...s,
        children: [
          [...b, ...k].map((x) => /* @__PURE__ */ f(
            sr,
            {
              size: "sm",
              variant: x === b[0] ? "default" : "outline",
              className: ar,
              onClick: () => g(x),
              disabled: a,
              children: Jl(x)
            },
            x.id
          )),
          k.length === 0 && /* @__PURE__ */ f(sr, { size: "sm", variant: "outline", className: ar, onClick: () => p(!1), disabled: a, children: "Deny" })
        ]
      }
    );
  }
  return /* @__PURE__ */ H(
    "div",
    {
      "data-slot": "tool-fallback-approval",
      className: K("aui-tool-fallback-approval flex items-center gap-2 pt-1", t),
      ...s,
      children: [
        /* @__PURE__ */ f(sr, { size: "sm", className: ar, onClick: () => p(!0), disabled: a, children: "Allow" }),
        /* @__PURE__ */ f(sr, { size: "sm", variant: "outline", className: ar, onClick: () => p(!1), disabled: a, children: "Deny" })
      ]
    }
  );
}
const Q3 = ({
  toolName: t,
  argsText: e,
  result: r,
  status: n,
  addResult: i,
  resume: o,
  interrupt: s,
  approval: a,
  respondToApproval: l
}) => {
  const c = (n == null ? void 0 : n.type) === "incomplete" && n.reason === "cancelled", d = (n == null ? void 0 : n.type) === "requires-action", [u, h] = Ie(d), [p, m] = Ie(d);
  return d !== p && (m(d), d && h(!0)), /* @__PURE__ */ H(L3, { open: u, onOpenChange: h, children: [
    /* @__PURE__ */ f(U3, { toolName: t, status: n }),
    /* @__PURE__ */ H(j3, { children: [
      /* @__PURE__ */ f(H3, { status: n }),
      /* @__PURE__ */ f(V3, { argsText: e, className: K(c && "opacity-60") }),
      d && /* @__PURE__ */ f(
        K3,
        {
          addResult: i,
          resume: o,
          interrupt: s,
          approval: a,
          respondToApproval: l
        }
      ),
      !c && /* @__PURE__ */ f(q3, { result: r })
    ] })
  ] });
}, Hp = we(Q3);
Hp.displayName = "ToolFallback";
const Y3 = window.UIComponents.Collapsible, J3 = window.UIComponents.CollapsibleContent, X3 = window.UIComponents.CollapsibleTrigger, Z3 = 200, eR = Vp("aui-tool-group-root group/tool-group-root w-full", {
  variants: {
    variant: {
      outline: "rounded-lg border py-3",
      ghost: "",
      muted: "border-muted-foreground/30 bg-muted/30 rounded-lg border py-3"
    }
  },
  defaultVariants: { variant: "outline" }
});
function tR({
  className: t,
  variant: e,
  open: r,
  onOpenChange: n,
  defaultOpen: i = !1,
  children: o,
  ...s
}) {
  const [a, l] = Ie(i), c = r !== void 0;
  return /* @__PURE__ */ f(
    Y3,
    {
      "data-slot": "tool-group-root",
      "data-variant": e ?? "outline",
      open: c ? r : a,
      onOpenChange: (h) => {
        c || l(h), n == null || n(h);
      },
      className: K(eR({ variant: e }), "group/tool-group-root", t),
      style: { "--animation-duration": `${Z3}ms` },
      ...s,
      children: o
    }
  );
}
function rR({
  count: t,
  active: e = !1,
  className: r,
  ...n
}) {
  const i = `${t} tool ${t === 1 ? "call" : "calls"}`;
  return /* @__PURE__ */ H(
    X3,
    {
      "data-slot": "tool-group-trigger",
      className: K(
        "aui-tool-group-trigger group/trigger flex origin-left items-center gap-2 text-sm transition-[color,scale] active:scale-[0.98]",
        "group-data-[variant=ghost]/tool-group-root:text-muted-foreground group-data-[variant=ghost]/tool-group-root:hover:text-foreground group-data-[variant=ghost]/tool-group-root:py-1.5",
        "group-data-[variant=outline]/tool-group-root:w-full group-data-[variant=outline]/tool-group-root:px-4",
        "group-data-[variant=muted]/tool-group-root:w-full group-data-[variant=muted]/tool-group-root:px-4",
        r
      ),
      ...n,
      children: [
        e && /* @__PURE__ */ f(
          ph,
          {
            "data-slot": "tool-group-trigger-loader",
            className: "aui-tool-group-trigger-loader size-3 shrink-0 animate-spin [animation-duration:0.6s]"
          }
        ),
        /* @__PURE__ */ H(
          "span",
          {
            "data-slot": "tool-group-trigger-label",
            className: K(
              "aui-tool-group-trigger-label-wrapper relative inline-block text-start leading-none font-medium",
              "group-data-[variant=ghost]/tool-group-root:font-normal",
              "group-data-[variant=outline]/tool-group-root:grow",
              "group-data-[variant=muted]/tool-group-root:grow"
            ),
            children: [
              /* @__PURE__ */ f("span", { className: "text-xs", children: i }),
              e && /* @__PURE__ */ f(
                "span",
                {
                  "aria-hidden": !0,
                  "data-slot": "tool-group-trigger-shimmer",
                  className: "aui-tool-group-trigger-shimmer shimmer pointer-events-none absolute inset-0 text-xs motion-reduce:animate-none",
                  children: i
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ f(
          Qo,
          {
            "data-slot": "tool-group-trigger-chevron",
            className: K(
              "aui-tool-group-trigger-chevron size-3 shrink-0",
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
function nR({
  className: t,
  children: e,
  ...r
}) {
  return /* @__PURE__ */ f(
    J3,
    {
      "data-slot": "tool-group-content",
      className: K(
        "aui-tool-group-content relative overflow-hidden text-sm outline-none",
        "group/collapsible-content ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none",
        "data-[state=closed]:animate-collapsible-up",
        "data-[state=open]:animate-collapsible-down",
        "data-[state=closed]:fill-mode-forwards",
        "data-[state=closed]:pointer-events-none",
        t
      ),
      ...r,
      children: /* @__PURE__ */ f(
        "div",
        {
          className: K(
            "mt-2 flex flex-col gap-2",
            "group-data-[variant=ghost]/tool-group-root:mt-1 group-data-[variant=ghost]/tool-group-root:gap-1",
            "group-data-[variant=outline]/tool-group-root:mt-3 group-data-[variant=outline]/tool-group-root:border-t group-data-[variant=outline]/tool-group-root:px-4 group-data-[variant=outline]/tool-group-root:pt-3",
            "group-data-[variant=muted]/tool-group-root:mt-3 group-data-[variant=muted]/tool-group-root:border-t group-data-[variant=muted]/tool-group-root:px-4 group-data-[variant=muted]/tool-group-root:pt-3",
            "[&>*]:animate-in [&>*]:fade-in-0 [&>*]:slide-in-from-top-1 [&>*]:duration-(--animation-duration) [&>*]:ease-[cubic-bezier(0.32,0.72,0,1)]",
            "[&>*]:motion-reduce:animate-none"
          ),
          children: e
        }
      )
    }
  );
}
const Gp = window.UIComponents.Button, iR = [
  "What MCP tools are available?",
  "Show the 5 most recent orders",
  "Summarize today’s orders"
], Ni = (t) => t.thread.messages.length === 0 && (!t.thread.isLoading || t.threads.isLoading), oR = () => {
  const t = L(Ni);
  return /* @__PURE__ */ f(
    ur.Root,
    {
      className: "aui-root aui-thread-root bg-background flex h-full flex-col",
      style: {
        "--thread-max-width": "44rem",
        "--composer-bg": "color-mix(in oklab, var(--color-muted) 30%, var(--color-background))",
        "--composer-radius": "1.5rem"
      },
      children: /* @__PURE__ */ f(
        ur.Viewport,
        {
          turnAnchor: "top",
          "data-slot": "aui_thread-viewport",
          className: "relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth",
          children: /* @__PURE__ */ H(
            "div",
            {
              className: K(
                "mx-auto flex w-full max-w-(--thread-max-width) flex-1 flex-col px-4 pt-4",
                t && "justify-center"
              ),
              children: [
                /* @__PURE__ */ f(Ut, { condition: Ni, children: /* @__PURE__ */ f(aR, {}) }),
                /* @__PURE__ */ f(
                  "div",
                  {
                    "data-slot": "aui_message-group",
                    className: "mb-14 flex flex-col gap-y-6 empty:hidden",
                    children: /* @__PURE__ */ f(ur.Messages, { components: { UserMessage: mR, AssistantMessage: hR } })
                  }
                ),
                /* @__PURE__ */ H(
                  ur.ViewportFooter,
                  {
                    className: K(
                      "aui-thread-viewport-footer bg-background flex flex-col gap-4 overflow-visible pb-4 md:pb-6",
                      !t && "sticky bottom-0 mt-auto rounded-t-(--composer-radius)"
                    ),
                    children: [
                      /* @__PURE__ */ f(sR, {}),
                      /* @__PURE__ */ f(cR, {}),
                      /* @__PURE__ */ f(Ut, { condition: (e) => Ni(e) && e.composer.isEmpty, children: /* @__PURE__ */ f(lR, {}) })
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
}, sR = () => /* @__PURE__ */ f(ur.ScrollToBottom, { asChild: !0, children: /* @__PURE__ */ f(
  er,
  {
    tooltip: "Scroll to bottom",
    variant: "outline",
    className: "aui-thread-scroll-to-bottom dark:border-border dark:bg-background dark:hover:bg-accent absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible",
    children: /* @__PURE__ */ f(Ck, {})
  }
) }), aR = () => /* @__PURE__ */ H("div", { className: "aui-thread-welcome-root mb-6 flex flex-col items-center px-4 text-center", children: [
  /* @__PURE__ */ f(uh, { className: "text-muted-foreground mb-3 size-10" }),
  /* @__PURE__ */ f("h1", { className: "aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in fill-mode-both text-2xl font-semibold duration-200", children: "How can I help you today?" }),
  /* @__PURE__ */ f("p", { className: "text-muted-foreground mt-1 text-sm", children: "Ask about Restoapp data available to your account." })
] }), lR = () => /* @__PURE__ */ f("div", { className: "aui-thread-welcome-suggestions flex w-full flex-wrap items-center justify-center gap-2 px-4", children: iR.map((t) => /* @__PURE__ */ f(ur.Suggestion, { prompt: t, send: !0, asChild: !0, children: /* @__PURE__ */ f(
  Gp,
  {
    variant: "ghost",
    className: "aui-thread-welcome-suggestion text-foreground hover:bg-muted border-border/60 h-auto gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-normal whitespace-nowrap transition-colors",
    children: t
  }
) }, t)) }), cR = () => /* @__PURE__ */ f(Lt.Root, { className: "aui-composer-root relative flex w-full flex-col", children: /* @__PURE__ */ f(Lt.AttachmentDropzone, { asChild: !0, children: /* @__PURE__ */ H(
  "div",
  {
    "data-slot": "aui_composer-shell",
    className: "border-border/60 data-[dragging=true]:border-ring focus-within:border-border dark:border-muted-foreground/15 dark:focus-within:border-muted-foreground/30 flex w-full flex-col gap-2 rounded-(--composer-radius) border bg-(--composer-bg) p-2 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] focus-within:shadow-[0_6px_24px_-8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.05)] data-[dragging=true]:border-dashed dark:shadow-none",
    children: [
      /* @__PURE__ */ f(lS, {}),
      /* @__PURE__ */ f(
        Lt.Input,
        {
          placeholder: "Ask about Restoapp data...",
          className: "aui-composer-input caret-primary placeholder:text-muted-foreground/80 max-h-32 min-h-10 w-full resize-none bg-transparent px-2.5 py-1 text-base outline-none",
          rows: 1,
          autoFocus: !0,
          addAttachmentOnPaste: !0,
          enterKeyHint: "send",
          "aria-label": "Message input"
        }
      ),
      /* @__PURE__ */ f(uR, {})
    ]
  }
) }) }), uR = () => /* @__PURE__ */ H("div", { className: "aui-composer-action-wrapper relative flex items-center justify-between", children: [
  /* @__PURE__ */ f(cS, {}),
  /* @__PURE__ */ H("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ f(Ut, { condition: (t) => !t.thread.isRunning, children: /* @__PURE__ */ f(Lt.Send, { asChild: !0, children: /* @__PURE__ */ f(
      er,
      {
        tooltip: "Send message",
        side: "bottom",
        type: "button",
        variant: "default",
        size: "icon",
        className: "aui-composer-send size-7 rounded-full",
        "aria-label": "Send message",
        children: /* @__PURE__ */ f(Ik, { className: "aui-composer-send-icon size-4.5" })
      }
    ) }) }),
    /* @__PURE__ */ f(Ut, { condition: (t) => t.thread.isRunning, children: /* @__PURE__ */ f(Lt.Cancel, { asChild: !0, children: /* @__PURE__ */ f(
      Gp,
      {
        type: "button",
        variant: "default",
        size: "icon",
        className: "aui-composer-cancel size-7 rounded-full",
        "aria-label": "Stop generating",
        children: /* @__PURE__ */ f(Wk, { className: "aui-composer-cancel-icon size-3.5 fill-current" })
      }
    ) }) })
  ] })
] }), dR = () => /* @__PURE__ */ f(gr.Error, { children: /* @__PURE__ */ f(Fa.Root, { className: "aui-message-error-root border-destructive bg-destructive/10 text-destructive dark:bg-destructive/5 mt-2 rounded-md border p-3 text-sm dark:text-red-200", children: /* @__PURE__ */ f(Fa.Message, { className: "aui-message-error-message" }) }) }), hR = () => /* @__PURE__ */ H(
  gr.Root,
  {
    "data-slot": "aui_assistant-message-root",
    "data-role": "assistant",
    className: "fade-in slide-in-from-bottom-1 animate-in relative -mb-7.5 pb-7.5 duration-150",
    children: [
      /* @__PURE__ */ H(
        "div",
        {
          "data-slot": "aui_assistant-message-content",
          className: "text-foreground px-2 leading-relaxed wrap-break-word",
          children: [
            /* @__PURE__ */ f(
              gr.GroupedParts,
              {
                groupBy: ey({
                  reasoning: ["group-reasoning"],
                  "tool-call": ["group-tool"],
                  "standalone-tool-call": []
                }),
                children: ({ part: t, children: e }) => {
                  switch (t.type) {
                    case "group-tool":
                      return /* @__PURE__ */ H(tR, { variant: "ghost", children: [
                        /* @__PURE__ */ f(
                          rR,
                          {
                            count: t.indices.length,
                            active: t.status.type === "running"
                          }
                        ),
                        /* @__PURE__ */ f(nR, { children: e })
                      ] });
                    case "group-reasoning": {
                      const r = t.status.type === "running";
                      return /* @__PURE__ */ H(E3, { variant: "ghost", streaming: r, children: [
                        /* @__PURE__ */ f(A3, { active: r }),
                        /* @__PURE__ */ f(R3, { "aria-busy": r, children: /* @__PURE__ */ f(P3, { children: e }) })
                      ] });
                    }
                    case "text":
                      return /* @__PURE__ */ f(jp, {});
                    case "reasoning":
                      return /* @__PURE__ */ f(qp, { ...t });
                    case "tool-call":
                      return t.toolUI ?? /* @__PURE__ */ f(Hp, { ...t });
                    case "indicator":
                      return /* @__PURE__ */ f(
                        "span",
                        {
                          "data-slot": "aui_assistant-message-indicator",
                          className: "animate-pulse font-sans",
                          "aria-label": "Assistant is working",
                          children: "●"
                        }
                      );
                    default:
                      return null;
                  }
                }
              }
            ),
            /* @__PURE__ */ f(dR, {})
          ]
        }
      ),
      /* @__PURE__ */ f(
        "div",
        {
          "data-slot": "aui_assistant-message-footer",
          className: "ms-2 flex min-h-7.5 items-center pt-1.5",
          children: /* @__PURE__ */ f(pR, {})
        }
      )
    ]
  }
), pR = () => /* @__PURE__ */ f(
  Ea.Root,
  {
    hideWhenRunning: !0,
    autohide: "not-last",
    className: "aui-assistant-action-bar-root text-muted-foreground animate-in fade-in -ms-1 flex gap-1 duration-200",
    children: /* @__PURE__ */ f(Ea.Copy, { asChild: !0, children: /* @__PURE__ */ H(er, { tooltip: "Copy", children: [
      /* @__PURE__ */ f(Ut, { condition: (t) => t.message.isCopied, children: /* @__PURE__ */ f(Ko, { className: "animate-in zoom-in-50 fade-in duration-200 ease-out" }) }),
      /* @__PURE__ */ f(Ut, { condition: (t) => !t.message.isCopied, children: /* @__PURE__ */ f(hh, { className: "animate-in zoom-in-75 fade-in duration-150" }) })
    ] }) })
  }
), mR = () => /* @__PURE__ */ H(
  gr.Root,
  {
    "data-slot": "aui_user-message-root",
    className: "fade-in slide-in-from-bottom-1 animate-in grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 duration-150 [&>*]:col-start-2",
    "data-role": "user",
    children: [
      /* @__PURE__ */ f(aS, {}),
      /* @__PURE__ */ f("div", { className: "aui-user-message-content-wrapper relative col-start-2 min-w-0", children: /* @__PURE__ */ f("div", { className: "aui-user-message-content bg-muted text-foreground rounded-xl px-4 py-2 wrap-break-word whitespace-pre-wrap empty:hidden", children: /* @__PURE__ */ f(gr.Parts, {}) }) })
    ]
  }
);
function xs() {
  return (window.location.pathname || "").replace(/\/openharness-agent$/, "");
}
function fR() {
  for (const t of document.cookie.split(";")) {
    const [e, ...r] = t.trim().split("=");
    if (e === "XSRF-TOKEN")
      return decodeURIComponent(r.join("=") || "");
  }
  return null;
}
function Wp() {
  const t = fR();
  return t ? { "X-XSRF-TOKEN": t } : {};
}
async function ks(t) {
  try {
    const e = await t.json();
    return e.error || e.message || `HTTP ${t.status}`;
  } catch {
    return `HTTP ${t.status}`;
  }
}
async function gR() {
  const t = await fetch(`${xs()}/api/openharness/meta`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" }
  });
  if (!t.ok)
    throw new Error(await ks(t));
  return t.json();
}
async function bR() {
  const t = await fetch(`${xs()}/api/openharness/session`, {
    method: "DELETE",
    credentials: "same-origin",
    headers: { Accept: "application/json", ...Wp() }
  });
  if (!t.ok)
    throw new Error(await ks(t));
}
async function* vR(t, e) {
  const r = new EventSource(t, { withCredentials: !0 }), n = [];
  let i = null, o = !1;
  const s = () => {
    i == null || i(), i = null;
  };
  r.addEventListener("openharness", (l) => {
    try {
      n.push(JSON.parse(l.data));
    } catch {
    }
    s();
  }), r.onerror = () => {
    r.readyState === EventSource.CLOSED && (o = !0, s());
  };
  const a = () => {
    o = !0, s();
  };
  e == null || e.addEventListener("abort", a);
  try {
    for (; ; ) {
      for (; n.length; ) {
        const l = n.shift();
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
    e == null || e.removeEventListener("abort", a), r.close();
  }
}
function wR({ onUsage: t, onRunEnd: e }) {
  return {
    async *run({ messages: r, abortSignal: n }) {
      const i = r[r.length - 1];
      if (!i || i.role !== "user")
        throw new Error("Nothing to send.");
      const o = i.content.filter((m) => m.type === "text").map((m) => m.text).join(`

`), s = new FormData();
      s.append("message", o);
      for (const m of i.attachments ?? []) {
        const g = m.file;
        g && s.append("files", g, m.name);
      }
      const a = await fetch(`${xs()}/api/openharness/runs`, {
        method: "POST",
        body: s,
        credentials: "same-origin",
        headers: { Accept: "application/json", ...Wp() },
        signal: n
      });
      if (!a.ok)
        throw new Error(await ks(a));
      const { stream: l } = await a.json(), c = [], d = /* @__PURE__ */ new Map();
      let u = null, h = null;
      const p = () => ({ content: c.map((m) => ({ ...m })) });
      try {
        for await (const m of vR(l, n))
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
function yR(t) {
  return new Promise((e, r) => {
    const n = new FileReader();
    n.onload = () => e(n.result), n.onerror = () => r(n.error ?? new Error("Failed to read file")), n.readAsDataURL(t);
  });
}
class xR {
  constructor(e) {
    this.getMeta = e;
  }
  get accept() {
    return "*";
  }
  async add({ file: e }) {
    var n;
    const r = ((n = this.getMeta()) == null ? void 0 : n.maxFileSize) ?? 8388608;
    if (e.size > r)
      throw new Error(`File is too large (max ${Math.round(r / 1024 / 1024)}MB)`);
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
    const r = e.type === "image" ? [{ type: "image", image: await yR(e.file) }] : [];
    return { ...e, status: { type: "complete" }, content: r };
  }
  async remove() {
  }
}
const kR = `/*! tailwindcss v4.3.2 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-pan-x:initial;--tw-pan-y:initial;--tw-pinch-zoom:initial;--tw-space-y-reverse:0;--tw-space-x-reverse:0;--tw-divide-x-reverse:0;--tw-border-style:solid;--tw-divide-y-reverse:0;--tw-leading:initial;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-ease:initial;--tw-animation-delay:0s;--tw-animation-direction:normal;--tw-animation-duration:initial;--tw-animation-fill-mode:none;--tw-animation-iteration-count:1;--tw-enter-blur:0;--tw-enter-opacity:1;--tw-enter-rotate:0;--tw-enter-scale:1;--tw-enter-translate-x:0;--tw-enter-translate-y:0;--tw-exit-blur:0;--tw-exit-opacity:1;--tw-exit-rotate:0;--tw-exit-scale:1;--tw-exit-translate-x:0;--tw-exit-translate-y:0}}}@layer theme{:root,:host{--font-sans:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;--color-red-200:oklch(88.5% .062 18.334);--color-red-500:oklch(63.7% .237 25.331);--color-red-600:oklch(57.7% .245 27.325);--color-orange-500:oklch(70.5% .213 47.604);--color-amber-400:oklch(82.8% .189 84.429);--color-amber-500:oklch(76.9% .188 70.08);--color-amber-600:oklch(66.6% .179 58.318);--color-green-100:oklch(96.2% .044 156.743);--color-green-200:oklch(92.5% .084 155.995);--color-green-400:oklch(79.2% .209 151.711);--color-green-500:oklch(72.3% .219 149.579);--color-green-600:oklch(62.7% .194 149.214);--color-green-700:oklch(52.7% .154 150.069);--color-emerald-400:oklch(76.5% .177 163.223);--color-emerald-600:oklch(59.6% .145 163.225);--color-blue-100:oklch(93.2% .032 255.585);--color-blue-500:oklch(62.3% .214 259.815);--color-blue-600:oklch(54.6% .245 262.881);--color-blue-700:oklch(48.8% .243 264.376);--color-blue-800:oklch(42.4% .199 265.638);--color-blue-950:oklch(28.2% .091 267.935);--color-indigo-500:oklch(58.5% .233 277.117);--color-indigo-600:oklch(51.1% .262 276.966);--color-gray-50:oklch(98.5% .002 247.839);--color-gray-100:oklch(96.7% .003 264.542);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-300:oklch(87.2% .01 258.338);--color-gray-400:oklch(70.7% .022 261.325);--color-gray-500:oklch(55.1% .027 264.364);--color-gray-600:oklch(44.6% .03 256.802);--color-gray-700:oklch(37.3% .034 259.733);--color-gray-800:oklch(27.8% .033 256.848);--color-gray-900:oklch(21% .034 264.665);--color-black:#000;--color-white:#fff;--spacing:.25rem;--breakpoint-md:48rem;--container-xs:20rem;--container-sm:24rem;--container-md:28rem;--container-2xl:42rem;--container-3xl:48rem;--container-4xl:56rem;--container-5xl:64rem;--container-6xl:72rem;--container-7xl:80rem;--text-xs:.75rem;--text-xs--line-height:calc(1 / .75);--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-base:1rem;--text-base--line-height:1.5;--text-lg:1.125rem;--text-lg--line-height:calc(1.75 / 1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75 / 1.25);--text-2xl:1.5rem;--text-2xl--line-height:calc(2 / 1.5);--text-3xl:1.875rem;--text-3xl--line-height:1.2;--text-4xl:2.25rem;--text-4xl--line-height:calc(2.5 / 2.25);--font-weight-light:300;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--tracking-tight:-.025em;--tracking-normal:0em;--tracking-wide:.025em;--leading-tight:1.25;--leading-snug:1.375;--leading-normal:1.5;--leading-relaxed:1.625;--radius-xs:.125rem;--radius-xl:calc(var(--radius) + 4px);--radius-2xl:1rem;--shadow-xs:0 1px 2px 0 #0000000d;--ease-in:cubic-bezier(.4, 0, 1, 1);--ease-out:cubic-bezier(0, 0, .2, 1);--ease-in-out:cubic-bezier(.4, 0, .2, 1);--animate-spin:spin 1s linear infinite;--animate-pulse:pulse 2s cubic-bezier(.4, 0, .6, 1) infinite;--blur-xs:4px;--aspect-video:16 / 9;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4, 0, .2, 1);--color-background:var(--background);--color-muted:var(--muted);--color-border:var(--border)}}.\\@container{container-type:inline-size}.pointer-events-auto{pointer-events:auto}.pointer-events-none{pointer-events:none}.collapse{visibility:collapse}.invisible{visibility:hidden}.visible{visibility:visible}.sr-only{clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.not-sr-only{clip-path:none;white-space:normal;width:auto;height:auto;margin:0;padding:0;position:static;overflow:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.sticky{position:sticky}.inset-0{top:0;right:0;bottom:0;left:0}.inset-x-0{inset-inline:0}.end-1{inset-inline-end:calc(var(--spacing) * 1)}.end-1\\.5{inset-inline-end:calc(var(--spacing) * 1.5)}.-top-1{top:calc(var(--spacing) * -1)}.-top-2{top:calc(var(--spacing) * -2)}.-top-12{top:calc(var(--spacing) * -12)}.top-0{top:0}.top-1{top:var(--spacing)}.top-1\\.5{top:calc(var(--spacing) * 1.5)}.top-1\\/2{top:50%}.top-2{top:calc(var(--spacing) * 2)}.top-4{top:calc(var(--spacing) * 4)}.top-6{top:calc(var(--spacing) * 6)}.top-full{top:100%}.-right-1{right:calc(var(--spacing) * -1)}.right-0{right:0}.right-1{right:var(--spacing)}.right-2{right:calc(var(--spacing) * 2)}.right-3{right:calc(var(--spacing) * 3)}.right-4{right:calc(var(--spacing) * 4)}.right-5{right:calc(var(--spacing) * 5)}.right-6{right:calc(var(--spacing) * 6)}.bottom-0{bottom:0}.bottom-\\[calc\\(var\\(--sab\\)\\+4\\.5rem\\)\\]{bottom:calc(var(--sab) + 4.5rem)}.left-0{left:0}.left-1{left:var(--spacing)}.left-1\\/2{left:50%}.left-2{left:calc(var(--spacing) * 2)}.left-3{left:calc(var(--spacing) * 3)}.left-\\[-4px\\]{left:-4px}.isolate{isolation:isolate}.isolation-auto{isolation:auto}.z-0{z-index:0}.z-10{z-index:10}.z-20{z-index:20}.z-30{z-index:30}.z-40{z-index:40}.z-50{z-index:50}.z-\\[1000\\]{z-index:1000}.z-\\[1010\\]{z-index:1010}.z-\\[1200\\]{z-index:1200}.col-span-1{grid-column:span 1/span 1}.col-span-2{grid-column:span 2/span 2}.col-span-3{grid-column:span 3/span 3}.col-span-full{grid-column:1/-1}.col-start-1{grid-column-start:1}.col-start-2{grid-column-start:2}.row-span-1{grid-row:span 1/span 1}.row-span-2{grid-row:span 2/span 2}.row-span-3{grid-row:span 3/span 3}.row-start-1{grid-row-start:1}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.m-0{margin:0}.m-5{margin:calc(var(--spacing) * 5)}.m-26{margin:calc(var(--spacing) * 26)}.m-26\\.25{margin:calc(var(--spacing) * 26.25)}.m-31{margin:calc(var(--spacing) * 31)}.m-31\\.5{margin:calc(var(--spacing) * 31.5)}.m-90{margin:calc(var(--spacing) * 90)}.m-1743{margin:calc(var(--spacing) * 1743)}.m-2205{margin:calc(var(--spacing) * 2205)}.mx-1{margin-inline:var(--spacing)}.mx-4{margin-inline:calc(var(--spacing) * 4)}.mx-auto{margin-inline:auto}.my-3{margin-block:calc(var(--spacing) * 3)}.my-8{margin-block:calc(var(--spacing) * 8)}.-ms-1{margin-inline-start:calc(var(--spacing) * -1)}.ms-2{margin-inline-start:calc(var(--spacing) * 2)}.ms-5{margin-inline-start:calc(var(--spacing) * 5)}.ms-auto{margin-inline-start:auto}.mt-0{margin-top:0}.mt-0\\.5{margin-top:calc(var(--spacing) * .5)}.mt-1{margin-top:var(--spacing)}.mt-1\\.5{margin-top:calc(var(--spacing) * 1.5)}.mt-2{margin-top:calc(var(--spacing) * 2)}.mt-3{margin-top:calc(var(--spacing) * 3)}.mt-3\\.5{margin-top:calc(var(--spacing) * 3.5)}.mt-4{margin-top:calc(var(--spacing) * 4)}.mt-5{margin-top:calc(var(--spacing) * 5)}.mt-6{margin-top:calc(var(--spacing) * 6)}.mt-8{margin-top:calc(var(--spacing) * 8)}.mt-12{margin-top:calc(var(--spacing) * 12)}.mt-auto{margin-top:auto}.mr-1{margin-right:var(--spacing)}.mr-2{margin-right:calc(var(--spacing) * 2)}.mr-3{margin-right:calc(var(--spacing) * 3)}.mr-4{margin-right:calc(var(--spacing) * 4)}.mr-9{margin-right:calc(var(--spacing) * 9)}.mr-auto{margin-right:auto}.-mb-7{margin-bottom:calc(var(--spacing) * -7)}.-mb-7\\.5{margin-bottom:calc(var(--spacing) * -7.5)}.mb-0{margin-bottom:0}.mb-0\\.5{margin-bottom:calc(var(--spacing) * .5)}.mb-1{margin-bottom:var(--spacing)}.mb-1\\.5{margin-bottom:calc(var(--spacing) * 1.5)}.mb-2{margin-bottom:calc(var(--spacing) * 2)}.mb-3{margin-bottom:calc(var(--spacing) * 3)}.mb-4{margin-bottom:calc(var(--spacing) * 4)}.mb-5{margin-bottom:calc(var(--spacing) * 5)}.mb-6{margin-bottom:calc(var(--spacing) * 6)}.mb-8{margin-bottom:calc(var(--spacing) * 8)}.mb-10{margin-bottom:calc(var(--spacing) * 10)}.mb-12{margin-bottom:calc(var(--spacing) * 12)}.mb-14{margin-bottom:calc(var(--spacing) * 14)}.ml-1{margin-left:var(--spacing)}.ml-2{margin-left:calc(var(--spacing) * 2)}.ml-4{margin-left:calc(var(--spacing) * 4)}.ml-auto{margin-left:auto}.box-border{box-sizing:border-box}.line-clamp-2{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.line-clamp-3{-webkit-line-clamp:3;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.line-clamp-6{-webkit-line-clamp:6;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.\\!hidden{display:none!important}.block{display:block}.contents{display:contents}.flex{display:flex}.flow-root{display:flow-root}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.inline-grid{display:inline-grid}.inline-table{display:inline-table}.list-item{display:list-item}.table{display:table}.table-caption{display:table-caption}.table-cell{display:table-cell}.table-column{display:table-column}.table-column-group{display:table-column-group}.table-footer-group{display:table-footer-group}.table-header-group{display:table-header-group}.table-row{display:table-row}.table-row-group{display:table-row-group}.aspect-\\[4\\/3\\]{aspect-ratio:4/3}.aspect-square{aspect-ratio:1}.size-2{width:calc(var(--spacing) * 2);height:calc(var(--spacing) * 2)}.size-3{width:calc(var(--spacing) * 3);height:calc(var(--spacing) * 3)}.size-3\\.5{width:calc(var(--spacing) * 3.5);height:calc(var(--spacing) * 3.5)}.size-4{width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}.size-4\\.5{width:calc(var(--spacing) * 4.5);height:calc(var(--spacing) * 4.5)}.size-5{width:calc(var(--spacing) * 5);height:calc(var(--spacing) * 5)}.size-6{width:calc(var(--spacing) * 6);height:calc(var(--spacing) * 6)}.size-7{width:calc(var(--spacing) * 7);height:calc(var(--spacing) * 7)}.size-8{width:calc(var(--spacing) * 8);height:calc(var(--spacing) * 8)}.size-9{width:calc(var(--spacing) * 9);height:calc(var(--spacing) * 9)}.size-10{width:calc(var(--spacing) * 10);height:calc(var(--spacing) * 10)}.size-14{width:calc(var(--spacing) * 14);height:calc(var(--spacing) * 14)}.\\!h-4{height:calc(var(--spacing) * 4)!important}.h-0{height:0}.h-1{height:var(--spacing)}.h-1\\.5{height:calc(var(--spacing) * 1.5)}.h-2{height:calc(var(--spacing) * 2)}.h-2\\.5{height:calc(var(--spacing) * 2.5)}.h-3{height:calc(var(--spacing) * 3)}.h-3\\.5{height:calc(var(--spacing) * 3.5)}.h-4{height:calc(var(--spacing) * 4)}.h-5{height:calc(var(--spacing) * 5)}.h-6{height:calc(var(--spacing) * 6)}.h-8{height:calc(var(--spacing) * 8)}.h-9{height:calc(var(--spacing) * 9)}.h-10{height:calc(var(--spacing) * 10)}.h-11{height:calc(var(--spacing) * 11)}.h-12{height:calc(var(--spacing) * 12)}.h-14{height:calc(var(--spacing) * 14)}.h-16{height:calc(var(--spacing) * 16)}.h-20{height:calc(var(--spacing) * 20)}.h-28{height:calc(var(--spacing) * 28)}.h-30{height:calc(var(--spacing) * 30)}.h-56{height:calc(var(--spacing) * 56)}.h-\\[1\\.125rem\\]{height:1.125rem}.h-\\[2\\.375rem\\]{height:2.375rem}.h-\\[2\\.1875rem\\]{height:2.1875rem}.h-\\[20px\\]{height:20px}.h-\\[38px\\]{height:38px}.h-\\[75vh\\]{height:75vh}.h-\\[calc\\(100\\%_-_96px\\)\\]{height:calc(100% - 96px)}.h-auto{height:auto}.h-full{height:100%}.h-screen{height:100vh}.max-h-32{max-height:calc(var(--spacing) * 32)}.max-h-48{max-height:calc(var(--spacing) * 48)}.max-h-64{max-height:calc(var(--spacing) * 64)}.max-h-72{max-height:calc(var(--spacing) * 72)}.max-h-80{max-height:calc(var(--spacing) * 80)}.max-h-\\[80dvh\\]{max-height:80dvh}.max-h-\\[80vh\\]{max-height:80vh}.max-h-\\[85vh\\]{max-height:85vh}.min-h-0{min-height:0}.min-h-7{min-height:calc(var(--spacing) * 7)}.min-h-7\\.5{min-height:calc(var(--spacing) * 7.5)}.min-h-10{min-height:calc(var(--spacing) * 10)}.min-h-\\[2\\.625rem\\]{min-height:2.625rem}.min-h-\\[2rem\\]{min-height:2rem}.min-h-\\[4\\.25rem\\]{min-height:4.25rem}.min-h-\\[40px\\]{min-height:40px}.min-h-\\[300px\\]{min-height:300px}.min-h-\\[calc\\(100vh-7rem\\)\\]{min-height:calc(100vh - 7rem)}.min-h-screen{min-height:100vh}.\\!w-4{width:calc(var(--spacing) * 4)!important}.w-1{width:var(--spacing)}.w-1\\.5{width:calc(var(--spacing) * 1.5)}.w-2{width:calc(var(--spacing) * 2)}.w-3{width:calc(var(--spacing) * 3)}.w-3\\.5{width:calc(var(--spacing) * 3.5)}.w-3\\/4{width:75%}.w-4{width:calc(var(--spacing) * 4)}.w-5{width:calc(var(--spacing) * 5)}.w-6{width:calc(var(--spacing) * 6)}.w-7{width:calc(var(--spacing) * 7)}.w-8{width:calc(var(--spacing) * 8)}.w-9{width:calc(var(--spacing) * 9)}.w-10{width:calc(var(--spacing) * 10)}.w-12{width:calc(var(--spacing) * 12)}.w-14{width:calc(var(--spacing) * 14)}.w-16{width:calc(var(--spacing) * 16)}.w-20{width:calc(var(--spacing) * 20)}.w-24{width:calc(var(--spacing) * 24)}.w-40{width:calc(var(--spacing) * 40)}.w-48{width:calc(var(--spacing) * 48)}.w-64{width:calc(var(--spacing) * 64)}.w-72{width:calc(var(--spacing) * 72)}.w-80{width:calc(var(--spacing) * 80)}.w-\\[2\\.375rem\\]{width:2.375rem}.w-\\[35\\%\\]{width:35%}.w-auto{width:auto}.w-fit{width:fit-content}.w-full{width:100%}.w-max{width:max-content}.max-w-\\(--thread-max-width\\){max-width:var(--thread-max-width)}.max-w-2xl{max-width:var(--container-2xl)}.max-w-3xl{max-width:var(--container-3xl)}.max-w-4xl{max-width:var(--container-4xl)}.max-w-5xl{max-width:var(--container-5xl)}.max-w-6xl{max-width:var(--container-6xl)}.max-w-7xl{max-width:var(--container-7xl)}.max-w-64{max-width:calc(var(--spacing) * 64)}.max-w-\\[60ch\\]{max-width:60ch}.max-w-\\[72ch\\]{max-width:72ch}.max-w-\\[75\\%\\]{max-width:75%}.max-w-\\[150px\\]{max-width:150px}.max-w-\\[180px\\]{max-width:180px}.max-w-\\[280px\\]{max-width:280px}.max-w-\\[310px\\]{max-width:310px}.max-w-\\[1600px\\]{max-width:1600px}.max-w-full{max-width:100%}.max-w-md{max-width:var(--container-md)}.max-w-screen-md{max-width:var(--breakpoint-md)}.max-w-sm{max-width:var(--container-sm)}.max-w-xs{max-width:var(--container-xs)}.min-w-0{min-width:0}.min-w-5{min-width:calc(var(--spacing) * 5)}.min-w-6{min-width:calc(var(--spacing) * 6)}.min-w-8{min-width:calc(var(--spacing) * 8)}.min-w-36{min-width:calc(var(--spacing) * 36)}.min-w-\\[1\\.125rem\\]{min-width:1.125rem}.min-w-\\[2rem\\]{min-width:2rem}.min-w-\\[6\\.5rem\\]{min-width:6.5rem}.min-w-\\[6\\.875rem\\]{min-width:6.875rem}.min-w-\\[64px\\]{min-width:64px}.min-w-\\[140px\\]{min-width:140px}.min-w-\\[150px\\]{min-width:150px}.min-w-full{min-width:100%}.flex-1{flex:1}.flex-shrink{flex-shrink:1}.flex-shrink-0{flex-shrink:0}.shrink{flex-shrink:1}.shrink-0{flex-shrink:0}.flex-grow{flex-grow:1}.flex-grow-0{flex-grow:0}.grow{flex-grow:1}.basis-\\[80\\%\\]{flex-basis:80%}.basis-\\[88\\%\\]{flex-basis:88%}.basis-\\[140px\\]{flex-basis:140px}.basis-\\[160px\\]{flex-basis:160px}.basis-auto{flex-basis:auto}.basis-full{flex-basis:100%}.border-collapse{border-collapse:collapse}.border-separate{border-collapse:separate}.border-spacing-0{--tw-border-spacing-x:0;--tw-border-spacing-y:0;border-spacing:var(--tw-border-spacing-x) var(--tw-border-spacing-y)}.origin-left{transform-origin:0}.-translate-x-1{--tw-translate-x:calc(var(--spacing) * -1);translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-x-1\\/2{--tw-translate-x:-50%;translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-x-0{--tw-translate-x:0;translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-x-full{--tw-translate-x:100%;translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-y-1{--tw-translate-y:calc(var(--spacing) * -1);translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y:-50%;translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-none{translate:none}.scale-3d{scale:var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z)}.-rotate-90{rotate:-90deg}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.animate-in{animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.animate-pulse{animation:var(--animate-pulse)}.animate-spin{animation:var(--animate-spin)}.cursor-col-resize{cursor:col-resize}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.cursor-pointer{cursor:pointer}.touch-pinch-zoom{--tw-pinch-zoom:pinch-zoom;touch-action:var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)}.resize{resize:both}.resize-none{resize:none}.scroll-m-20{scroll-margin:calc(var(--spacing) * 20)}.list-inside{list-style-position:inside}.list-decimal{list-style-type:decimal}.list-disc{list-style-type:disc}.auto-rows-auto{grid-auto-rows:auto}.auto-rows-fr{grid-auto-rows:minmax(0,1fr)}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-\\[252px_8px_1fr\\]{grid-template-columns:252px 8px 1fr}.grid-cols-\\[minmax\\(72px\\,1fr\\)_auto\\]{grid-template-columns:minmax(72px,1fr) auto}.flex-col{flex-direction:column}.flex-row{flex-direction:row}.flex-wrap{flex-wrap:wrap}.content-start{align-content:flex-start}.items-baseline{align-items:baseline}.items-center{align-items:center}.items-end{align-items:flex-end}.items-start{align-items:flex-start}.items-stretch{align-items:stretch}.justify-around{justify-content:space-around}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-start{justify-content:flex-start}.gap-0{gap:0}.gap-1{gap:var(--spacing)}.gap-1\\.5{gap:calc(var(--spacing) * 1.5)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-2\\.5{gap:calc(var(--spacing) * 2.5)}.gap-3{gap:calc(var(--spacing) * 3)}.gap-4{gap:calc(var(--spacing) * 4)}.gap-5{gap:calc(var(--spacing) * 5)}.gap-6{gap:calc(var(--spacing) * 6)}.gap-8{gap:calc(var(--spacing) * 8)}.gap-10{gap:calc(var(--spacing) * 10)}.gap-12{gap:calc(var(--spacing) * 12)}:where(.space-y-0>:not(:last-child)){--tw-space-y-reverse:0;margin-block:0}:where(.space-y-1>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(var(--spacing) * var(--tw-space-y-reverse));margin-block-end:calc(var(--spacing) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2\\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 2.5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 2.5) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 5) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-6>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-8>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 8) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 8) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-reverse>:not(:last-child)){--tw-space-y-reverse:1}.gap-x-2{column-gap:calc(var(--spacing) * 2)}.gap-x-3{column-gap:calc(var(--spacing) * 3)}.gap-x-4{column-gap:calc(var(--spacing) * 4)}.gap-x-5{column-gap:calc(var(--spacing) * 5)}.gap-x-6{column-gap:calc(var(--spacing) * 6)}:where(.space-x-1>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(var(--spacing) * var(--tw-space-x-reverse));margin-inline-end:calc(var(--spacing) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-2>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 2) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-3>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 3) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-4>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 4) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-6>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 6) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-reverse>:not(:last-child)){--tw-space-x-reverse:1}.gap-y-1{row-gap:var(--spacing)}.gap-y-2{row-gap:calc(var(--spacing) * 2)}.gap-y-3{row-gap:calc(var(--spacing) * 3)}.gap-y-6{row-gap:calc(var(--spacing) * 6)}.gap-y-8{row-gap:calc(var(--spacing) * 8)}:where(.divide-x>:not(:last-child)){--tw-divide-x-reverse:0;border-inline-style:var(--tw-border-style);border-inline-start-width:calc(1px * var(--tw-divide-x-reverse));border-inline-end-width:calc(1px * calc(1 - var(--tw-divide-x-reverse)))}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px * var(--tw-divide-y-reverse));border-bottom-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-y-reverse>:not(:last-child)){--tw-divide-y-reverse:1}:where(.divide-border>:not(:last-child)){border-color:var(--border)}.self-center{align-self:center}.self-stretch{align-self:stretch}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-visible{overflow:visible}.overflow-x-auto{overflow-x:auto}.overflow-y-auto{overflow-y:auto}.overflow-y-scroll{overflow-y:scroll}.scroll-smooth{scroll-behavior:smooth}.rounded{border-radius:.25rem}.rounded-\\(--composer-radius\\){border-radius:var(--composer-radius)}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-\\[0\\.625rem\\]{border-radius:.625rem}.rounded-\\[calc\\(var\\(--border-radius\\)-2px\\)\\]{border-radius:calc(var(--border-radius) - 2px)}.rounded-\\[var\\(--border-radius\\)\\]{border-radius:var(--border-radius)}.rounded-\\[var\\(--border-radius\\,0\\.625rem\\)\\]{border-radius:var(--border-radius,.625rem)}.rounded-\\[var\\(--border-radius\\,0\\.875rem\\)\\]{border-radius:var(--border-radius,.875rem)}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius)}.rounded-md{border-radius:calc(var(--radius) - 2px)}.rounded-none{border-radius:0}.rounded-xl{border-radius:calc(var(--radius) + 4px)}.rounded-s{border-start-start-radius:.25rem;border-end-start-radius:.25rem}.rounded-ss{border-start-start-radius:.25rem}.rounded-e{border-start-end-radius:.25rem;border-end-end-radius:.25rem}.rounded-se{border-start-end-radius:.25rem}.rounded-ee{border-end-end-radius:.25rem}.rounded-es{border-end-start-radius:.25rem}.rounded-t{border-top-left-radius:.25rem;border-top-right-radius:.25rem}.rounded-t-\\(--composer-radius\\){border-top-left-radius:var(--composer-radius);border-top-right-radius:var(--composer-radius)}.rounded-t-lg{border-top-left-radius:var(--radius);border-top-right-radius:var(--radius)}.rounded-t-none{border-top-left-radius:0;border-top-right-radius:0}.rounded-t-xl{border-top-left-radius:calc(var(--radius) + 4px);border-top-right-radius:calc(var(--radius) + 4px)}.rounded-l{border-top-left-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-l-\\[var\\(--border-radius\\)\\]{border-top-left-radius:var(--border-radius);border-bottom-left-radius:var(--border-radius)}.rounded-l-none{border-top-left-radius:0;border-bottom-left-radius:0}.rounded-tl{border-top-left-radius:.25rem}.rounded-r{border-top-right-radius:.25rem;border-bottom-right-radius:.25rem}.rounded-r-\\[var\\(--border-radius\\)\\]{border-top-right-radius:var(--border-radius);border-bottom-right-radius:var(--border-radius)}.rounded-r-none{border-top-right-radius:0;border-bottom-right-radius:0}.rounded-tr{border-top-right-radius:.25rem}.rounded-b{border-bottom-right-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-b-xl{border-bottom-right-radius:calc(var(--radius) + 4px);border-bottom-left-radius:calc(var(--radius) + 4px)}.rounded-br{border-bottom-right-radius:.25rem}.rounded-bl{border-bottom-left-radius:.25rem}.border{border-style:var(--tw-border-style);border-width:1px}.border-0{border-style:var(--tw-border-style);border-width:0}.border-2{border-style:var(--tw-border-style);border-width:2px}.border-\\[3px\\]{border-style:var(--tw-border-style);border-width:3px}.border-x{border-inline-style:var(--tw-border-style);border-inline-width:1px}.border-y{border-block-style:var(--tw-border-style);border-block-width:1px}.border-s{border-inline-start-style:var(--tw-border-style);border-inline-start-width:1px}.border-s-2{border-inline-start-style:var(--tw-border-style);border-inline-start-width:2px}.border-e{border-inline-end-style:var(--tw-border-style);border-inline-end-width:1px}.border-bs{border-block-start-style:var(--tw-border-style);border-block-start-width:1px}.border-be{border-block-end-style:var(--tw-border-style);border-block-end-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-t-0{border-top-style:var(--tw-border-style);border-top-width:0}.border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-b-0{border-bottom-style:var(--tw-border-style);border-bottom-width:0}.border-b-2{border-bottom-style:var(--tw-border-style);border-bottom-width:2px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-l-2{border-left-style:var(--tw-border-style);border-left-width:2px}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-none{--tw-border-style:none;border-style:none}.border-solid{--tw-border-style:solid;border-style:solid}.border-\\[var\\(--border\\)\\]{border-color:var(--border)}.border-\\[var\\(--bottom-nav-border\\)\\]{border-color:var(--bottom-nav-border)}.border-\\[var\\(--secondary-color\\)\\]{border-color:var(--secondary-color)}.border-amber-500{border-color:var(--color-amber-500)}.border-amber-500\\/40{border-color:#f99c0066}@supports (color:color-mix(in lab,red,red)){.border-amber-500\\/40{border-color:color-mix(in oklab,var(--color-amber-500) 40%,transparent)}}.border-black{border-color:var(--color-black)}.border-black\\/10{border-color:#0000001a}@supports (color:color-mix(in lab,red,red)){.border-black\\/10{border-color:color-mix(in oklab,var(--color-black) 10%,transparent)}}.border-black\\/15{border-color:#00000026}@supports (color:color-mix(in lab,red,red)){.border-black\\/15{border-color:color-mix(in oklab,var(--color-black) 15%,transparent)}}.border-black\\/\\[\\.08\\]{border-color:#00000014}@supports (color:color-mix(in lab,red,red)){.border-black\\/\\[\\.08\\]{border-color:color-mix(in oklab,var(--color-black) 8%,transparent)}}.border-border,.border-border\\/50{border-color:var(--border)}@supports (color:color-mix(in lab,red,red)){.border-border\\/50{border-color:color-mix(in oklab,var(--border) 50%,transparent)}}.border-border\\/60{border-color:var(--border)}@supports (color:color-mix(in lab,red,red)){.border-border\\/60{border-color:color-mix(in oklab,var(--border) 60%,transparent)}}.border-current{border-color:currentColor}.border-destructive,.border-destructive\\/20{border-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.border-destructive\\/20{border-color:color-mix(in oklab,var(--destructive) 20%,transparent)}}.border-destructive\\/30{border-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.border-destructive\\/30{border-color:color-mix(in oklab,var(--destructive) 30%,transparent)}}.border-destructive\\/40{border-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.border-destructive\\/40{border-color:color-mix(in oklab,var(--destructive) 40%,transparent)}}.border-gray-200{border-color:var(--color-gray-200)}.border-gray-300{border-color:var(--color-gray-300)}.border-gray-400{border-color:var(--color-gray-400)}.border-gray-600{border-color:var(--color-gray-600)}.border-green-500{border-color:var(--color-green-500)}.border-green-500\\/30{border-color:#00c7584d}@supports (color:color-mix(in lab,red,red)){.border-green-500\\/30{border-color:color-mix(in oklab,var(--color-green-500) 30%,transparent)}}.border-input{border-color:var(--input)}.border-muted-foreground,.border-muted-foreground\\/20{border-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.border-muted-foreground\\/20{border-color:color-mix(in oklab,var(--muted-foreground) 20%,transparent)}}.border-muted-foreground\\/30{border-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.border-muted-foreground\\/30{border-color:color-mix(in oklab,var(--muted-foreground) 30%,transparent)}}.border-primary{border-color:var(--primary)}.border-red-500{border-color:var(--color-red-500)}.border-ring{border-color:var(--ring)}.border-white{border-color:var(--color-white)}.border-white\\/15{border-color:#ffffff26}@supports (color:color-mix(in lab,red,red)){.border-white\\/15{border-color:color-mix(in oklab,var(--color-white) 15%,transparent)}}.border-t-\\[var\\(--secondary-color\\)\\]{border-top-color:var(--secondary-color)}.border-t-transparent{border-top-color:#0000}.border-l-primary{border-left-color:var(--primary)}.\\!bg-transparent{background-color:#0000!important}.bg-\\(--composer-bg\\){background-color:var(--composer-bg)}.bg-\\[\\#E07A5F\\]{background-color:#e07a5f}.bg-\\[\\#d9043d\\]{background-color:#d9043d}.bg-\\[var\\(--bottom-nav-bg\\)\\]{background-color:var(--bottom-nav-bg)}.bg-\\[var\\(--counter-background\\)\\]{background-color:var(--counter-background)}.bg-\\[var\\(--primary-color\\)\\]{background-color:var(--primary-color)}.bg-\\[var\\(--primary-color\\,\\#fff\\)\\]{background-color:var(--primary-color,#fff)}.bg-\\[var\\(--secondary-color\\)\\],.bg-\\[var\\(--secondary-color\\)\\]\\/\\[\\.08\\]{background-color:var(--secondary-color)}@supports (color:color-mix(in lab,red,red)){.bg-\\[var\\(--secondary-color\\)\\]\\/\\[\\.08\\]{background-color:color-mix(in oklab,var(--secondary-color) 8%,transparent)}}.bg-accent{background-color:var(--accent)}.bg-amber-500{background-color:var(--color-amber-500)}.bg-background,.bg-background\\/60{background-color:var(--background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/60{background-color:color-mix(in oklab,var(--background) 60%,transparent)}}.bg-background\\/70{background-color:var(--background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/70{background-color:color-mix(in oklab,var(--background) 70%,transparent)}}.bg-black{background-color:var(--color-black)}.bg-black\\/10{background-color:#0000001a}@supports (color:color-mix(in lab,red,red)){.bg-black\\/10{background-color:color-mix(in oklab,var(--color-black) 10%,transparent)}}.bg-black\\/50{background-color:#00000080}@supports (color:color-mix(in lab,red,red)){.bg-black\\/50{background-color:color-mix(in oklab,var(--color-black) 50%,transparent)}}.bg-black\\/\\[\\.03\\]{background-color:#00000008}@supports (color:color-mix(in lab,red,red)){.bg-black\\/\\[\\.03\\]{background-color:color-mix(in oklab,var(--color-black) 3%,transparent)}}.bg-black\\/\\[\\.06\\]{background-color:#0000000f}@supports (color:color-mix(in lab,red,red)){.bg-black\\/\\[\\.06\\]{background-color:color-mix(in oklab,var(--color-black) 6%,transparent)}}.bg-blue-100{background-color:var(--color-blue-100)}.bg-blue-500{background-color:var(--color-blue-500)}.bg-blue-600{background-color:var(--color-blue-600)}.bg-blue-950{background-color:var(--color-blue-950)}.bg-card{background-color:var(--card)}.bg-current{background-color:currentColor}.bg-destructive,.bg-destructive\\/10{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.bg-destructive\\/10{background-color:color-mix(in oklab,var(--destructive) 10%,transparent)}}.bg-gray-50{background-color:var(--color-gray-50)}.bg-gray-100{background-color:var(--color-gray-100)}.bg-gray-200{background-color:var(--color-gray-200)}.bg-gray-300{background-color:var(--color-gray-300)}.bg-gray-600{background-color:var(--color-gray-600)}.bg-gray-800{background-color:var(--color-gray-800)}.bg-green-100{background-color:var(--color-green-100)}.bg-green-200{background-color:var(--color-green-200)}.bg-green-500{background-color:var(--color-green-500)}.bg-green-500\\/10{background-color:#00c7581a}@supports (color:color-mix(in lab,red,red)){.bg-green-500\\/10{background-color:color-mix(in oklab,var(--color-green-500) 10%,transparent)}}.bg-green-600{background-color:var(--color-green-600)}.bg-green-700{background-color:var(--color-green-700)}.bg-indigo-500{background-color:var(--color-indigo-500)}.bg-muted,.bg-muted\\/30{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.bg-muted\\/30{background-color:color-mix(in oklab,var(--muted) 30%,transparent)}}.bg-muted\\/50{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.bg-muted\\/50{background-color:color-mix(in oklab,var(--muted) 50%,transparent)}}.bg-popover{background-color:var(--popover)}.bg-primary,.bg-primary\\/5{background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.bg-primary\\/5{background-color:color-mix(in oklab,var(--primary) 5%,transparent)}}.bg-red-500{background-color:var(--color-red-500)}.bg-transparent{background-color:#0000}.bg-white{background-color:var(--color-white)}.bg-white\\/5{background-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){.bg-white\\/5{background-color:color-mix(in oklab,var(--color-white) 5%,transparent)}}.bg-white\\/90{background-color:#ffffffe6}@supports (color:color-mix(in lab,red,red)){.bg-white\\/90{background-color:color-mix(in oklab,var(--color-white) 90%,transparent)}}.bg-\\[linear-gradient\\(to_bottom\\,var\\(--color-background\\)\\,transparent\\)\\]{background-image:linear-gradient(to bottom,var(--color-background),transparent)}.bg-\\[linear-gradient\\(to_top\\,var\\(--color-background\\)\\,transparent\\)\\]{background-image:linear-gradient(to top,var(--color-background),transparent)}.bg-repeat{background-repeat:repeat}.mask-no-clip{-webkit-mask-clip:no-clip;mask-clip:no-clip}.mask-repeat{-webkit-mask-repeat:repeat;mask-repeat:repeat}.\\!fill-\\[var\\(--primary-text-color\\)\\]{fill:var(--primary-text-color)!important}.\\!fill-\\[var\\(--secondary-text-color\\)\\]{fill:var(--secondary-text-color)!important}.fill-\\[var\\(--button-text-color\\)\\]{fill:var(--button-text-color)}.fill-current{fill:currentColor}.stroke-\\[1\\.5px\\]{stroke-width:1.5px}.object-contain{object-fit:contain}.object-cover{object-fit:cover}.p-0{padding:0}.p-0\\.5{padding:calc(var(--spacing) * .5)}.p-1{padding:var(--spacing)}.p-2{padding:calc(var(--spacing) * 2)}.p-2\\.5{padding:calc(var(--spacing) * 2.5)}.p-3{padding:calc(var(--spacing) * 3)}.p-3\\.5{padding:calc(var(--spacing) * 3.5)}.p-4{padding:calc(var(--spacing) * 4)}.p-5{padding:calc(var(--spacing) * 5)}.p-6{padding:calc(var(--spacing) * 6)}.p-8{padding:calc(var(--spacing) * 8)}.p-10{padding:calc(var(--spacing) * 10)}.p-12{padding:calc(var(--spacing) * 12)}.px-1{padding-inline:var(--spacing)}.px-1\\.5{padding-inline:calc(var(--spacing) * 1.5)}.px-2{padding-inline:calc(var(--spacing) * 2)}.px-2\\.5{padding-inline:calc(var(--spacing) * 2.5)}.px-3{padding-inline:calc(var(--spacing) * 3)}.px-3\\.5{padding-inline:calc(var(--spacing) * 3.5)}.px-4{padding-inline:calc(var(--spacing) * 4)}.px-5{padding-inline:calc(var(--spacing) * 5)}.px-6{padding-inline:calc(var(--spacing) * 6)}.py-0{padding-block:0}.py-0\\.5{padding-block:calc(var(--spacing) * .5)}.py-1{padding-block:var(--spacing)}.py-1\\.5{padding-block:calc(var(--spacing) * 1.5)}.py-2{padding-block:calc(var(--spacing) * 2)}.py-2\\.5{padding-block:calc(var(--spacing) * 2.5)}.py-3{padding-block:calc(var(--spacing) * 3)}.py-4{padding-block:calc(var(--spacing) * 4)}.py-5{padding-block:calc(var(--spacing) * 5)}.py-6{padding-block:calc(var(--spacing) * 6)}.py-8{padding-block:calc(var(--spacing) * 8)}.py-10{padding-block:calc(var(--spacing) * 10)}.py-12{padding-block:calc(var(--spacing) * 12)}.ps-4{padding-inline-start:calc(var(--spacing) * 4)}.ps-6{padding-inline-start:calc(var(--spacing) * 6)}.pt-0{padding-top:0}.pt-1{padding-top:var(--spacing)}.pt-1\\.5{padding-top:calc(var(--spacing) * 1.5)}.pt-2{padding-top:calc(var(--spacing) * 2)}.pt-2\\.5{padding-top:calc(var(--spacing) * 2.5)}.pt-4{padding-top:calc(var(--spacing) * 4)}.pt-5{padding-top:calc(var(--spacing) * 5)}.pr-4{padding-right:calc(var(--spacing) * 4)}.pr-5{padding-right:calc(var(--spacing) * 5)}.pr-6{padding-right:calc(var(--spacing) * 6)}.pr-10{padding-right:calc(var(--spacing) * 10)}.pr-12{padding-right:calc(var(--spacing) * 12)}.pr-28{padding-right:calc(var(--spacing) * 28)}.pb-0{padding-bottom:0}.pb-2{padding-bottom:calc(var(--spacing) * 2)}.pb-4{padding-bottom:calc(var(--spacing) * 4)}.pb-5{padding-bottom:calc(var(--spacing) * 5)}.pb-7{padding-bottom:calc(var(--spacing) * 7)}.pb-7\\.5{padding-bottom:calc(var(--spacing) * 7.5)}.pb-8{padding-bottom:calc(var(--spacing) * 8)}.pb-10{padding-bottom:calc(var(--spacing) * 10)}.pb-\\[calc\\(env\\(safe-area-inset-bottom\\,0\\)\\+0\\.5rem\\)\\]{padding-bottom:calc(env(safe-area-inset-bottom,0) + .5rem)}.pb-\\[env\\(safe-area-inset-bottom\\,0\\)\\]{padding-bottom:env(safe-area-inset-bottom,0)}.pb-\\[var\\(--sab\\)\\]{padding-bottom:var(--sab)}.pl-2{padding-left:calc(var(--spacing) * 2)}.pl-4{padding-left:calc(var(--spacing) * 4)}.pl-5{padding-left:calc(var(--spacing) * 5)}.pl-13{padding-left:calc(var(--spacing) * 13)}.text-center{text-align:center}.text-left{text-align:left}.text-right{text-align:right}.text-start{text-align:start}.font-mono{font-family:var(--font-mono)}.font-sans{font-family:var(--font-sans)}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-\\[0\\.75rem\\]{font-size:.75rem}.text-\\[0\\.85em\\]{font-size:.85em}.text-\\[0\\.625rem\\]{font-size:.625rem}.text-\\[0\\.8125rem\\]{font-size:.8125rem}.text-\\[0\\.9375rem\\]{font-size:.9375rem}.text-\\[1\\.5rem\\]{font-size:1.5rem}.text-\\[1\\.0625rem\\]{font-size:1.0625rem}.text-\\[10px\\]{font-size:10px}.text-\\[12px\\]{font-size:12px}.text-\\[13px\\]{font-size:13px}.text-\\[33px\\]{font-size:33px}.leading-4{--tw-leading:calc(var(--spacing) * 4);line-height:calc(var(--spacing) * 4)}.leading-5{--tw-leading:calc(var(--spacing) * 5);line-height:calc(var(--spacing) * 5)}.leading-6{--tw-leading:calc(var(--spacing) * 6);line-height:calc(var(--spacing) * 6)}.leading-7{--tw-leading:calc(var(--spacing) * 7);line-height:calc(var(--spacing) * 7)}.leading-\\[1\\.125rem\\]{--tw-leading:1.125rem;line-height:1.125rem}.leading-none{--tw-leading:1;line-height:1}.leading-normal{--tw-leading:var(--leading-normal);line-height:var(--leading-normal)}.leading-relaxed{--tw-leading:var(--leading-relaxed);line-height:var(--leading-relaxed)}.leading-snug{--tw-leading:var(--leading-snug);line-height:var(--leading-snug)}.leading-tight{--tw-leading:var(--leading-tight);line-height:var(--leading-tight)}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-light{--tw-font-weight:var(--font-weight-light);font-weight:var(--font-weight-light)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-normal{--tw-tracking:var(--tracking-normal);letter-spacing:var(--tracking-normal)}.tracking-tight{--tw-tracking:var(--tracking-tight);letter-spacing:var(--tracking-tight)}.tracking-wide{--tw-tracking:var(--tracking-wide);letter-spacing:var(--tracking-wide)}.text-pretty{text-wrap:pretty}.text-wrap{text-wrap:wrap}.break-words,.wrap-break-word{overflow-wrap:break-word}.break-all{word-break:break-all}.text-clip{text-overflow:clip}.text-ellipsis{text-overflow:ellipsis}.whitespace-normal{white-space:normal}.whitespace-nowrap{white-space:nowrap}.whitespace-pre-wrap{white-space:pre-wrap}.\\!text-\\[var\\(--primary-text-color\\)\\]{color:var(--primary-text-color)!important}.\\!text-\\[var\\(--secondary-text-color\\)\\]{color:var(--secondary-text-color)!important}.text-\\[\\#444\\]{color:#444}.text-\\[color\\:var\\(--button-text-color\\)\\]{color:var(--button-text-color)}.text-\\[color\\:var\\(--minor-color\\)\\]{color:var(--minor-color)}.text-\\[color\\:var\\(--primary-text-color\\)\\]{color:var(--primary-text-color)}.text-\\[color\\:var\\(--secondary-text-color\\)\\]{color:var(--secondary-text-color)}.text-\\[var\\(--bottom-nav-text\\)\\]{color:var(--bottom-nav-text)}.text-\\[var\\(--button-text-color\\)\\]{color:var(--button-text-color)}.text-\\[var\\(--primary-text-color\\)\\]{color:var(--primary-text-color)}.text-\\[var\\(--secondary-color\\)\\]{color:var(--secondary-color)}.text-\\[var\\(--secondary-text-color\\)\\]{color:var(--secondary-text-color)}.text-amber-500{color:var(--color-amber-500)}.text-amber-600{color:var(--color-amber-600)}.text-blue-500{color:var(--color-blue-500)}.text-blue-600{color:var(--color-blue-600)}.text-blue-700{color:var(--color-blue-700)}.text-card-foreground{color:var(--card-foreground)}.text-destructive{color:var(--destructive)}.text-emerald-600{color:var(--color-emerald-600)}.text-foreground,.text-foreground\\/70{color:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.text-foreground\\/70{color:color-mix(in oklab,var(--foreground) 70%,transparent)}}.text-foreground\\/90{color:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.text-foreground\\/90{color:color-mix(in oklab,var(--foreground) 90%,transparent)}}.text-gray-300{color:var(--color-gray-300)}.text-gray-500{color:var(--color-gray-500)}.text-gray-600{color:var(--color-gray-600)}.text-gray-700{color:var(--color-gray-700)}.text-gray-800{color:var(--color-gray-800)}.text-gray-900{color:var(--color-gray-900)}.text-green-500{color:var(--color-green-500)}.text-green-600{color:var(--color-green-600)}.text-inherit{color:inherit}.text-muted-foreground{color:var(--muted-foreground)}.text-orange-500{color:var(--color-orange-500)}.text-popover-foreground{color:var(--popover-foreground)}.text-primary{color:var(--primary)}.text-primary-foreground{color:var(--primary-foreground)}.text-red-500{color:var(--color-red-500)}.text-red-600{color:var(--color-red-600)}.text-white{color:var(--color-white)}.capitalize{text-transform:capitalize}.lowercase{text-transform:lowercase}.normal-case{text-transform:none}.uppercase{text-transform:uppercase}.italic{font-style:italic}.not-italic{font-style:normal}.diagonal-fractions{--tw-numeric-fraction:diagonal-fractions;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.lining-nums{--tw-numeric-figure:lining-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.oldstyle-nums{--tw-numeric-figure:oldstyle-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.ordinal{--tw-ordinal:ordinal;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.proportional-nums{--tw-numeric-spacing:proportional-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.slashed-zero{--tw-slashed-zero:slashed-zero;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.stacked-fractions{--tw-numeric-fraction:stacked-fractions;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.normal-nums{font-variant-numeric:normal}.\\!underline{text-decoration-line:underline!important}.line-through{text-decoration-line:line-through}.no-underline{text-decoration-line:none}.overline{text-decoration-line:overline}.underline{text-decoration-line:underline}.underline-offset-2{text-underline-offset:2px}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.subpixel-antialiased{-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto}.caret-primary{caret-color:var(--primary)}.\\[color-scheme\\:dark\\]{color-scheme:dark}.opacity-0{opacity:0}.opacity-25{opacity:.25}.opacity-30{opacity:.3}.opacity-50{opacity:.5}.opacity-60{opacity:.6}.opacity-70{opacity:.7}.opacity-75{opacity:.75}.opacity-85{opacity:.85}.opacity-100{opacity:1}.\\!shadow-none{--tw-shadow:0 0 #0000!important;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)!important}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_-4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\]{--tw-shadow:0 -4px 20px var(--tw-shadow-color,#0000000f);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_-6px_20px_rgba\\(0\\,0\\,0\\,0\\.12\\)\\]{--tw-shadow:0 -6px 20px var(--tw-shadow-color,#0000001f);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_4px_16px_-8px_rgba\\(0\\,0\\,0\\,0\\.08\\)\\,0_1px_2px_rgba\\(0\\,0\\,0\\,0\\.04\\)\\]{--tw-shadow:0 4px 16px -8px var(--tw-shadow-color,#00000014), 0 1px 2px var(--tw-shadow-color,#0000000a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a), 0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,#0000001a), 0 2px 4px -2px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,#0000001a), 0 8px 10px -6px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.inset-ring{--tw-inset-ring-shadow:inset 0 0 0 1px var(--tw-inset-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-offset-background{--tw-ring-offset-color:var(--background)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.blur{--tw-blur:blur(8px);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.drop-shadow{--tw-drop-shadow-size:drop-shadow(0 1px 2px var(--tw-drop-shadow-color,#0000001a)) drop-shadow(0 1px 1px var(--tw-drop-shadow-color,#0000000f));--tw-drop-shadow:drop-shadow(0 1px 2px #0000001a) drop-shadow(0 1px 1px #0000000f);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.drop-shadow-\\[0_1px_3px_rgba\\(0\\,0\\,0\\,0\\.6\\)\\]{--tw-drop-shadow-size:drop-shadow(0 1px 3px var(--tw-drop-shadow-color,#0009));--tw-drop-shadow:var(--tw-drop-shadow-size);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.grayscale{--tw-grayscale:grayscale(100%);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.invert{--tw-invert:invert(100%);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.sepia{--tw-sepia:sepia(100%);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.filter{filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.backdrop-blur{--tw-backdrop-blur:blur(8px);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-blur-\\[1px\\]{--tw-backdrop-blur:blur(1px);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-grayscale{--tw-backdrop-grayscale:grayscale(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-invert{--tw-backdrop-invert:invert(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-sepia{--tw-backdrop-sepia:sepia(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-filter{-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[border-color\\,box-shadow\\]{transition-property:border-color,box-shadow;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[color\\,scale\\]{transition-property:color,scale;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[width\\]{transition-property:width;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-shadow{transition-property:box-shadow;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.duration-\\(--animation-duration\\){--tw-duration:var(--animation-duration);transition-duration:var(--animation-duration)}.duration-150{--tw-duration:.15s;transition-duration:.15s}.duration-200{--tw-duration:.2s;transition-duration:.2s}.duration-300{--tw-duration:.3s;transition-duration:.3s}.duration-500{--tw-duration:.5s;transition-duration:.5s}.ease-\\[cubic-bezier\\(0\\.32\\,0\\.72\\,0\\,1\\)\\]{--tw-ease:cubic-bezier(.32,.72,0,1);transition-timing-function:cubic-bezier(.32,.72,0,1)}.ease-in{--tw-ease:var(--ease-in);transition-timing-function:var(--ease-in)}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}.ease-out{--tw-ease:var(--ease-out);transition-timing-function:var(--ease-out)}.fade-in-0{--tw-enter-opacity:0}.fill-mode-both{--tw-animation-fill-mode:both;animation-fill-mode:both}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.zoom-in-50{--tw-enter-scale:.5}.zoom-in-75{--tw-enter-scale:.75}.\\[animation-duration\\:0\\.6s\\]{animation-duration:.6s}.\\[core\\:order-after-done\\]{core:order-after-done}.\\[key\\:string\\]{key:string}.backface-hidden{backface-visibility:hidden}:where(.divide-x-reverse>:not(:last-child)){--tw-divide-x-reverse:1}.fade-in{--tw-enter-opacity:0}.paused{animation-play-state:paused}.ring-inset{--tw-ring-inset:inset}.running{animation-play-state:running}.slide-in-from-bottom-1{--tw-enter-translate-y:calc(1*var(--spacing))}.zoom-in{--tw-enter-scale:0}.zoom-out{--tw-exit-scale:0}@media (hover:hover){.group-hover\\:translate-x-0\\.5:is(:where(.group):hover *){--tw-translate-x:calc(var(--spacing) * .5);translate:var(--tw-translate-x) var(--tw-translate-y)}.group-hover\\:-translate-y-0\\.5:is(:where(.group):hover *){--tw-translate-y:calc(var(--spacing) * -.5);translate:var(--tw-translate-x) var(--tw-translate-y)}.group-hover\\:opacity-100:is(:where(.group):hover *){opacity:1}}.group-data-\\[state\\=closed\\]\\/collapsible-content\\:animate-out:is(:where(.group\\/collapsible-content)[data-state=closed] *){animation:exit var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.group-data-\\[state\\=closed\\]\\/collapsible-content\\:fade-out-0:is(:where(.group\\/collapsible-content)[data-state=closed] *){--tw-exit-opacity:0}.group-data-\\[state\\=closed\\]\\/collapsible-content\\:slide-out-to-top-1:is(:where(.group\\/collapsible-content)[data-state=closed] *){--tw-exit-translate-y:calc(1*var(--spacing)*-1)}.group-data-\\[state\\=open\\]\\/collapsible-content\\:animate-in:is(:where(.group\\/collapsible-content)[data-state=open] *){animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.group-data-\\[state\\=open\\]\\/collapsible-content\\:fade-in-0:is(:where(.group\\/collapsible-content)[data-state=open] *){--tw-enter-opacity:0}.group-data-\\[state\\=open\\]\\/collapsible-content\\:slide-in-from-top-1:is(:where(.group\\/collapsible-content)[data-state=open] *){--tw-enter-translate-y:calc(1*var(--spacing)*-1)}.group-data-\\[state\\=open\\]\\/collapsible-content\\:slide-in-from-top-4:is(:where(.group\\/collapsible-content)[data-state=open] *){--tw-enter-translate-y:calc(4*var(--spacing)*-1)}.group-data-\\[state\\=open\\]\\/trigger\\:rotate-0:is(:where(.group\\/trigger)[data-state=open] *){rotate:0deg}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:mt-1:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){margin-top:var(--spacing)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:gap-1:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){gap:var(--spacing)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:py-1\\.5:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){padding-block:calc(var(--spacing) * 1.5)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:font-normal:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:text-muted-foreground:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){color:var(--muted-foreground)}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:mt-3:is(:where(.group\\/tool-group-root)[data-variant=muted] *){margin-top:calc(var(--spacing) * 3)}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:w-full:is(:where(.group\\/tool-group-root)[data-variant=muted] *){width:100%}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:grow:is(:where(.group\\/tool-group-root)[data-variant=muted] *){flex-grow:1}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:border-t:is(:where(.group\\/tool-group-root)[data-variant=muted] *){border-top-style:var(--tw-border-style);border-top-width:1px}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:px-4:is(:where(.group\\/tool-group-root)[data-variant=muted] *){padding-inline:calc(var(--spacing) * 4)}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:pt-3:is(:where(.group\\/tool-group-root)[data-variant=muted] *){padding-top:calc(var(--spacing) * 3)}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:mt-3:is(:where(.group\\/tool-group-root)[data-variant=outline] *){margin-top:calc(var(--spacing) * 3)}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:w-full:is(:where(.group\\/tool-group-root)[data-variant=outline] *){width:100%}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:grow:is(:where(.group\\/tool-group-root)[data-variant=outline] *){flex-grow:1}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:border-t:is(:where(.group\\/tool-group-root)[data-variant=outline] *){border-top-style:var(--tw-border-style);border-top-width:1px}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:px-4:is(:where(.group\\/tool-group-root)[data-variant=outline] *){padding-inline:calc(var(--spacing) * 4)}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:pt-3:is(:where(.group\\/tool-group-root)[data-variant=outline] *){padding-top:calc(var(--spacing) * 3)}.marker\\:text-muted-foreground ::marker{color:var(--muted-foreground)}.marker\\:text-muted-foreground::marker{color:var(--muted-foreground)}.marker\\:text-muted-foreground ::-webkit-details-marker{color:var(--muted-foreground)}.marker\\:text-muted-foreground::-webkit-details-marker{color:var(--muted-foreground)}.placeholder\\:text-muted-foreground\\/80::placeholder{color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.placeholder\\:text-muted-foreground\\/80::placeholder{color:color-mix(in oklab,var(--muted-foreground) 80%,transparent)}}.first\\:mt-0:first-child{margin-top:0}.first\\:rounded-ss-lg:first-child{border-start-start-radius:var(--radius)}.first\\:border-t:first-child{border-top-style:var(--tw-border-style);border-top-width:1px}.last\\:mb-0:last-child{margin-bottom:0}.last\\:rounded-se-lg:last-child{border-start-end-radius:var(--radius)}.last\\:border-e:last-child{border-inline-end-style:var(--tw-border-style);border-inline-end-width:1px}.last\\:border-b-0:last-child{border-bottom-style:var(--tw-border-style);border-bottom-width:0}:is(.only\\:\\*\\:first\\:size-24:only-child>*):first-child{width:calc(var(--spacing) * 24);height:calc(var(--spacing) * 24)}.empty\\:hidden:empty{display:none}.focus-within\\:border-border:focus-within{border-color:var(--border)}.focus-within\\:shadow-\\[0_6px_24px_-8px_rgba\\(0\\,0\\,0\\,0\\.12\\)\\,0_1px_2px_rgba\\(0\\,0\\,0\\,0\\.05\\)\\]:focus-within{--tw-shadow:0 6px 24px -8px var(--tw-shadow-color,#0000001f), 0 1px 2px var(--tw-shadow-color,#0000000d);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-within\\:outline-none:focus-within{--tw-outline-style:none;outline-style:none}@media (hover:hover){.hover\\:scale-105:hover{--tw-scale-x:105%;--tw-scale-y:105%;--tw-scale-z:105%;scale:var(--tw-scale-x) var(--tw-scale-y)}.hover\\:scale-110:hover{--tw-scale-x:110%;--tw-scale-y:110%;--tw-scale-z:110%;scale:var(--tw-scale-x) var(--tw-scale-y)}.hover\\:border-\\[var\\(--secondary-color\\)\\]:hover{border-color:var(--secondary-color)}.hover\\:bg-\\[var\\(--secondary-color\\)\\]:hover{background-color:var(--secondary-color)}.hover\\:bg-accent:hover,.hover\\:bg-accent\\/50:hover{background-color:var(--accent)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-accent\\/50:hover{background-color:color-mix(in oklab,var(--accent) 50%,transparent)}}.hover\\:bg-black:hover{background-color:var(--color-black)}.hover\\:bg-black\\/5:hover{background-color:#0000000d}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-black\\/5:hover{background-color:color-mix(in oklab,var(--color-black) 5%,transparent)}}.hover\\:bg-black\\/\\[\\.04\\]:hover{background-color:#0000000a}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-black\\/\\[\\.04\\]:hover{background-color:color-mix(in oklab,var(--color-black) 4%,transparent)}}.hover\\:bg-black\\/\\[\\.12\\]:hover{background-color:#0000001f}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-black\\/\\[\\.12\\]:hover{background-color:color-mix(in oklab,var(--color-black) 12%,transparent)}}.hover\\:bg-black\\/\\[0\\.03\\]:hover{background-color:#00000008}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-black\\/\\[0\\.03\\]:hover{background-color:color-mix(in oklab,var(--color-black) 3%,transparent)}}.hover\\:bg-blue-100:hover{background-color:var(--color-blue-100)}.hover\\:bg-blue-600:hover{background-color:var(--color-blue-600)}.hover\\:bg-blue-800:hover{background-color:var(--color-blue-800)}.hover\\:bg-gray-100:hover{background-color:var(--color-gray-100)}.hover\\:bg-gray-400:hover{background-color:var(--color-gray-400)}.hover\\:bg-gray-500:hover{background-color:var(--color-gray-500)}.hover\\:bg-green-600:hover{background-color:var(--color-green-600)}.hover\\:bg-indigo-600:hover{background-color:var(--color-indigo-600)}.hover\\:bg-muted:hover{background-color:var(--muted)}.hover\\:bg-muted-foreground\\/15:hover{background-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-muted-foreground\\/15:hover{background-color:color-mix(in oklab,var(--muted-foreground) 15%,transparent)}}.hover\\:bg-muted\\/40:hover{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-muted\\/40:hover{background-color:color-mix(in oklab,var(--muted) 40%,transparent)}}.hover\\:bg-muted\\/50:hover{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-muted\\/50:hover{background-color:color-mix(in oklab,var(--muted) 50%,transparent)}}.hover\\:bg-primary:hover,.hover\\:bg-primary\\/90:hover{background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-primary\\/90:hover{background-color:color-mix(in oklab,var(--primary) 90%,transparent)}}.hover\\:bg-red-600:hover{background-color:var(--color-red-600)}.hover\\:bg-white:hover{background-color:var(--color-white)}.hover\\:bg-white\\!:hover{background-color:var(--color-white)!important}.hover\\:bg-white\\/10:hover{background-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/10:hover{background-color:color-mix(in oklab,var(--color-white) 10%,transparent)}}.hover\\:text-\\[\\#222\\]:hover{color:#222}.hover\\:text-\\[var\\(--button-text-color\\)\\]:hover{color:var(--button-text-color)}.hover\\:text-\\[var\\(--secondary-color\\)\\]:hover{color:var(--secondary-color)}.hover\\:text-accent-foreground:hover{color:var(--accent-foreground)}.hover\\:text-foreground:hover{color:var(--foreground)}.hover\\:text-gray-300:hover{color:var(--color-gray-300)}.hover\\:text-gray-700:hover{color:var(--color-gray-700)}.hover\\:text-primary\\/80:hover{color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.hover\\:text-primary\\/80:hover{color:color-mix(in oklab,var(--primary) 80%,transparent)}}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:opacity-70:hover{opacity:.7}.hover\\:opacity-75:hover{opacity:.75}.hover\\:opacity-80:hover{opacity:.8}.hover\\:opacity-90:hover{opacity:.9}.hover\\:shadow-2xl:hover{--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,#00000040);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:hover\\:text-foreground:is(:where(.group\\/tool-group-root)[data-variant=ghost] *):hover{color:var(--foreground)}}.focus\\:border-\\[var\\(--secondary-color\\)\\]:focus{border-color:var(--secondary-color)}.focus\\:ring-2:focus{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus\\:ring-\\[var\\(--secondary-color\\)\\]:focus{--tw-ring-color:var(--secondary-color)}.focus\\:ring-blue-500:focus{--tw-ring-color:var(--color-blue-500)}.focus\\:ring-gray-500:focus{--tw-ring-color:var(--color-gray-500)}.focus\\:outline-none:focus{--tw-outline-style:none;outline-style:none}.focus-visible\\:ring-2:focus-visible{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-visible\\:ring-ring:focus-visible{--tw-ring-color:var(--ring)}.focus-visible\\:ring-offset-2:focus-visible{--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)}.focus-visible\\:outline-none:focus-visible{--tw-outline-style:none;outline-style:none}.active\\:scale-90:active{--tw-scale-x:90%;--tw-scale-y:90%;--tw-scale-z:90%;scale:var(--tw-scale-x) var(--tw-scale-y)}.active\\:scale-95:active{--tw-scale-x:95%;--tw-scale-y:95%;--tw-scale-z:95%;scale:var(--tw-scale-x) var(--tw-scale-y)}.active\\:scale-\\[0\\.98\\]:active{scale:.98}.disabled\\:pointer-events-none:disabled{pointer-events:none}.disabled\\:invisible:disabled{visibility:hidden}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}.data-\\[dragging\\=true\\]\\:border-dashed[data-dragging=true]{--tw-border-style:dashed;border-style:dashed}.data-\\[dragging\\=true\\]\\:border-ring[data-dragging=true]{border-color:var(--ring)}.data-\\[state\\=closed\\]\\:pointer-events-none[data-state=closed]{pointer-events:none}.data-\\[state\\=closed\\]\\:animate-collapsible-up[data-state=closed]{animation:.2s ease-out collapsible-up}.data-\\[state\\=closed\\]\\:fill-mode-forwards[data-state=closed]{--tw-animation-fill-mode:forwards;animation-fill-mode:forwards}.data-\\[state\\=open\\]\\:animate-collapsible-down[data-state=open]{animation:.2s ease-out collapsible-down}@media (prefers-reduced-motion:reduce){.motion-reduce\\:animate-none{animation:none}.motion-reduce\\:transition-none{transition-property:none}}@media not all and (min-width:48rem){.max-md\\:aspect-video{aspect-ratio:var(--aspect-video)}.max-md\\:max-h-52{max-height:calc(var(--spacing) * 52)}.max-md\\:p-4{padding:calc(var(--spacing) * 4)}.max-md\\:px-4{padding-inline:calc(var(--spacing) * 4)}.max-md\\:text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}}@media (min-width:40rem){.sm\\:mt-0{margin-top:0}.sm\\:mr-4{margin-right:calc(var(--spacing) * 4)}.sm\\:mb-0{margin-bottom:0}.sm\\:flex{display:flex}.sm\\:inline{display:inline}.sm\\:max-w-3xl{max-width:var(--container-3xl)}.sm\\:basis-1\\/2{flex-basis:50%}.sm\\:basis-\\[45\\%\\]{flex-basis:45%}.sm\\:basis-\\[180px\\]{flex-basis:180px}.sm\\:grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.sm\\:grid-cols-\\[160px_1fr\\]{grid-template-columns:160px 1fr}.sm\\:flex-row{flex-direction:row}.sm\\:items-center{align-items:center}.sm\\:items-end{align-items:flex-end}.sm\\:items-start{align-items:flex-start}.sm\\:justify-between{justify-content:space-between}.sm\\:gap-3{gap:calc(var(--spacing) * 3)}.sm\\:p-6{padding:calc(var(--spacing) * 6)}.sm\\:px-6{padding-inline:calc(var(--spacing) * 6)}.sm\\:py-5{padding-block:calc(var(--spacing) * 5)}.sm\\:pl-0{padding-left:0}.sm\\:text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.sm\\:text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}}@media (min-width:48rem){.md\\:absolute{position:absolute}.md\\:top-6{top:calc(var(--spacing) * 6)}.md\\:right-4{right:calc(var(--spacing) * 4)}.md\\:right-5{right:calc(var(--spacing) * 5)}.md\\:left-5{left:calc(var(--spacing) * 5)}.md\\:mt-0{margin-top:0}.md\\:mb-8{margin-bottom:calc(var(--spacing) * 8)}.md\\:ml-4{margin-left:calc(var(--spacing) * 4)}.md\\:block{display:block}.md\\:flex{display:flex}.md\\:hidden{display:none}.md\\:inline{display:inline}.md\\:h-8{height:calc(var(--spacing) * 8)}.md\\:h-12{height:calc(var(--spacing) * 12)}.md\\:h-auto{height:auto}.md\\:max-h-80{max-height:calc(var(--spacing) * 80)}.md\\:min-h-\\[48px\\]{min-height:48px}.md\\:w-1\\/2{width:50%}.md\\:w-8{width:calc(var(--spacing) * 8)}.md\\:w-12{width:calc(var(--spacing) * 12)}.md\\:w-20{width:calc(var(--spacing) * 20)}.md\\:w-auto{width:auto}.md\\:min-w-\\[90px\\]{min-width:90px}.md\\:min-w-\\[150px\\]{min-width:150px}.md\\:flex-grow{flex-grow:1}.md\\:basis-1\\/3{flex-basis:33.3333%}.md\\:basis-\\[200px\\]{flex-basis:200px}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.md\\:flex-row{flex-direction:row}.md\\:flex-wrap{flex-wrap:wrap}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:gap-4{gap:calc(var(--spacing) * 4)}.md\\:gap-6{gap:calc(var(--spacing) * 6)}.md\\:gap-8{gap:calc(var(--spacing) * 8)}:where(.md\\:space-y-0>:not(:last-child)){--tw-space-y-reverse:0;margin-block:0}:where(.md\\:space-x-4>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 4) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-x-reverse)))}.md\\:gap-y-8{row-gap:calc(var(--spacing) * 8)}.md\\:p-6{padding:calc(var(--spacing) * 6)}.md\\:px-4{padding-inline:calc(var(--spacing) * 4)}.md\\:px-6{padding-inline:calc(var(--spacing) * 6)}.md\\:px-8{padding-inline:calc(var(--spacing) * 8)}.md\\:py-2{padding-block:calc(var(--spacing) * 2)}.md\\:pt-\\[158px\\]{padding-top:158px}.md\\:pb-6{padding-bottom:calc(var(--spacing) * 6)}.md\\:text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.md\\:text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.md\\:text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.md\\:text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.md\\:text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.md\\:text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.md\\:font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}@media (hover:hover){.md\\:hover\\:scale-105:hover{--tw-scale-x:105%;--tw-scale-y:105%;--tw-scale-z:105%;scale:var(--tw-scale-x) var(--tw-scale-y)}.md\\:hover\\:bg-transparent:hover{background-color:#0000}}}@media (min-width:64rem){.lg\\:right-8{right:calc(var(--spacing) * 8)}.lg\\:left-8{left:calc(var(--spacing) * 8)}.lg\\:mt-0{margin-top:0}.lg\\:ml-2{margin-left:calc(var(--spacing) * 2)}.lg\\:\\!flex{display:flex!important}.lg\\:\\!hidden{display:none!important}.lg\\:block{display:block}.lg\\:flex{display:flex}.lg\\:hidden{display:none}.lg\\:w-1\\/3{width:33.3333%}.lg\\:w-2\\/3{width:66.6667%}.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.lg\\:grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}.lg\\:grid-cols-\\[minmax\\(0\\,1fr\\)_360px\\]{grid-template-columns:minmax(0,1fr) 360px}.lg\\:flex-row{flex-direction:row}.lg\\:gap-8{gap:calc(var(--spacing) * 8)}.lg\\:pr-6{padding-right:calc(var(--spacing) * 6)}}@media (min-width:80rem){.xl\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.xl\\:grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}.xl\\:grid-cols-6{grid-template-columns:repeat(6,minmax(0,1fr))}.xl\\:gap-4{gap:calc(var(--spacing) * 4)}}@media (min-width:96rem){.\\32xl\\:gap-6{gap:calc(var(--spacing) * 6)}}@media (prefers-color-scheme:dark){.dark\\:border-border{border-color:var(--border)}.dark\\:border-muted-foreground\\/15{border-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.dark\\:border-muted-foreground\\/15{border-color:color-mix(in oklab,var(--muted-foreground) 15%,transparent)}}.dark\\:bg-background{background-color:var(--background)}.dark\\:bg-destructive\\/5{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.dark\\:bg-destructive\\/5{background-color:color-mix(in oklab,var(--destructive) 5%,transparent)}}.dark\\:stroke-\\[2\\.5px\\]{stroke-width:2.5px}.dark\\:text-amber-400{color:var(--color-amber-400)}.dark\\:text-amber-500{color:var(--color-amber-500)}.dark\\:text-emerald-400{color:var(--color-emerald-400)}.dark\\:text-green-400{color:var(--color-green-400)}.dark\\:text-red-200{color:var(--color-red-200)}.dark\\:shadow-none{--tw-shadow:0 0 #0000;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.dark\\:focus-within\\:border-muted-foreground\\/30:focus-within{border-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.dark\\:focus-within\\:border-muted-foreground\\/30:focus-within{border-color:color-mix(in oklab,var(--muted-foreground) 30%,transparent)}}@media (hover:hover){.dark\\:hover\\:bg-accent:hover{background-color:var(--accent)}.dark\\:hover\\:bg-muted-foreground\\/30:hover{background-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.dark\\:hover\\:bg-muted-foreground\\/30:hover{background-color:color-mix(in oklab,var(--muted-foreground) 30%,transparent)}}}}.\\[\\&_svg\\]\\:text-background svg{color:var(--background)}.\\[\\&_svg\\]\\:text-black svg{color:var(--color-black)}@media (hover:hover){.hover\\:\\[\\&_svg\\]\\:text-destructive:hover svg{color:var(--destructive)}}.\\[\\[align\\=center\\]\\]\\:text-center[align=center]{text-align:center}.\\[\\[align\\=right\\]\\]\\:text-right[align=right]{text-align:right}.\\[\\&\\:last-child\\>td\\:first-child\\]\\:rounded-es-lg:last-child>td:first-child{border-end-start-radius:var(--radius)}.\\[\\&\\:last-child\\>td\\:last-child\\]\\:rounded-ee-lg:last-child>td:last-child{border-end-end-radius:var(--radius)}.\\[\\&\\>\\*\\]\\:col-start-2>*{grid-column-start:2}.\\[\\&\\>\\*\\]\\:animate-in>*{animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.\\[\\&\\>\\*\\]\\:duration-\\(--animation-duration\\)>*{--tw-duration:var(--animation-duration);transition-duration:var(--animation-duration)}.\\[\\&\\>\\*\\]\\:ease-\\[cubic-bezier\\(0\\.32\\,0\\.72\\,0\\,1\\)\\]>*{--tw-ease:cubic-bezier(.32,.72,0,1);transition-timing-function:cubic-bezier(.32,.72,0,1)}.\\[\\&\\>\\*\\]\\:fade-in-0>*{--tw-enter-opacity:0}.\\[\\&\\>\\*\\]\\:slide-in-from-top-1>*{--tw-enter-translate-y:calc(1*var(--spacing)*-1)}@media (prefers-reduced-motion:reduce){.\\[\\&\\>\\*\\]\\:motion-reduce\\:animate-none>*{animation:none}}.\\[\\&\\>a\\]\\:text-xs>a{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.\\[\\&\\>a\\]\\:no-underline>a{text-decoration-line:none}.\\[\\&\\>button\\]\\:rounded-full>button{border-radius:3.40282e38px}.\\[\\&\\>button\\]\\:bg-foreground\\/60>button{background-color:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.\\[\\&\\>button\\]\\:bg-foreground\\/60>button{background-color:color-mix(in oklab,var(--foreground) 60%,transparent)}}.\\[\\&\\>button\\]\\:p-1>button{padding:var(--spacing)}.\\[\\&\\>button\\]\\:opacity-100>button{opacity:1}.\\[\\&\\>button\\]\\:ring-0\\!>button{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor)!important;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)!important}@media (hover:hover){.\\[\\&\\>button\\]\\:hover\\:\\[\\&_svg\\]\\:text-destructive>button:hover svg{color:var(--destructive)}}.\\[\\&\\>li\\]\\:mt-1>li{margin-top:var(--spacing)}.\\[\\&\\>svg\\]\\:h-full>svg{height:100%}.\\[\\&\\>svg\\]\\:w-full>svg{width:100%}@property --tw-animation-delay{syntax:"*";inherits:false;initial-value:0s}@property --tw-animation-direction{syntax:"*";inherits:false;initial-value:normal}@property --tw-animation-duration{syntax:"*";inherits:false}@property --tw-animation-fill-mode{syntax:"*";inherits:false;initial-value:none}@property --tw-animation-iteration-count{syntax:"*";inherits:false;initial-value:1}@property --tw-enter-blur{syntax:"*";inherits:false;initial-value:0}@property --tw-enter-opacity{syntax:"*";inherits:false;initial-value:1}@property --tw-enter-rotate{syntax:"*";inherits:false;initial-value:0}@property --tw-enter-scale{syntax:"*";inherits:false;initial-value:1}@property --tw-enter-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-enter-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-blur{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-opacity{syntax:"*";inherits:false;initial-value:1}@property --tw-exit-rotate{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-scale{syntax:"*";inherits:false;initial-value:1}@property --tw-exit-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-translate-y{syntax:"*";inherits:false;initial-value:0}@keyframes aui-pulse{50%{opacity:.5}}:where(.aui-md[data-status=running]):empty:after,:where(.aui-md[data-status=running])>:where(:not(ol):not(ul):not(pre)):last-child:after,:where(.aui-md[data-status=running])>pre:last-child code:after,:where(.aui-md[data-status=running])>:where(:is(ol,ul):last-child)>:where(li:last-child:not(:has(*>li))):after,:where(.aui-md[data-status=running])>:where(:is(ol,ul):last-child)>:where(li:last-child)>:where(:is(ol,ul):last-child)>:where(li:last-child:not(:has(*>li))):after,:where(.aui-md[data-status=running])>:where(:is(ol,ul):last-child)>:where(li:last-child)>:where(:is(ol,ul):last-child)>:where(li:last-child)>:where(:is(ol,ul):last-child)>:where(li:last-child):after{--aui-content:"●";content:var(--aui-content);margin-left:.25rem;margin-right:.25rem;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;animation:2s cubic-bezier(.4,0,.6,1) infinite aui-pulse}@keyframes collapsible-down{0%{height:0}to{height:var(--radix-collapsible-content-height,var(--bits-collapsible-content-height,var(--reka-collapsible-content-height,var(--kb-collapsible-content-height,auto))))}}@keyframes collapsible-up{0%{height:var(--radix-collapsible-content-height,var(--bits-collapsible-content-height,var(--reka-collapsible-content-height,var(--kb-collapsible-content-height,auto))))}to{height:0}}.shimmer{color:#0000;background-image:linear-gradient(90deg,transparent 20%,var(--foreground) 50%,transparent 80%)}@supports (color:color-mix(in lab,red,red)){.shimmer{background-image:linear-gradient(90deg,transparent 20%,color-mix(in oklab,var(--foreground) 90%,transparent) 50%,transparent 80%)}}.shimmer{background-size:200% 100%;-webkit-background-clip:text;background-clip:text;animation:1.6s linear infinite ohx-shimmer}@keyframes ohx-shimmer{0%{background-position:200% 0}to{background-position:-200% 0}}.ohx-root{flex-direction:column;height:calc(100dvh - 8.5rem);min-height:24rem;display:flex}.ohx-root .aui-thread-root{flex:1;min-height:0}@property --tw-border-spacing-x{syntax:"<length>";inherits:false;initial-value:0}@property --tw-border-spacing-y{syntax:"<length>";inherits:false;initial-value:0}@property --tw-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-z{syntax:"*";inherits:false;initial-value:0}@property --tw-scale-x{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-y{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-z{syntax:"*";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-pan-x{syntax:"*";inherits:false}@property --tw-pan-y{syntax:"*";inherits:false}@property --tw-pinch-zoom{syntax:"*";inherits:false}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-space-x-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-divide-x-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-divide-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-leading{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@property --tw-ordinal{syntax:"*";inherits:false}@property --tw-slashed-zero{syntax:"*";inherits:false}@property --tw-numeric-figure{syntax:"*";inherits:false}@property --tw-numeric-spacing{syntax:"*";inherits:false}@property --tw-numeric-fraction{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.5}}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0)scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1))rotate(var(--tw-enter-rotate,0));filter:blur(var(--tw-enter-blur,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0)scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1))rotate(var(--tw-exit-rotate,0));filter:blur(var(--tw-exit-blur,0))}}
`, _R = window.UIComponents.Button, SR = window.UIComponents.Badge, CR = window.UIComponents.Tooltip, TR = window.UIComponents.TooltipContent, IR = window.UIComponents.TooltipProvider, ER = window.UIComponents.TooltipTrigger, Xl = "openharness-agent-styles";
function AR() {
  Ht(() => {
    if (document.getElementById(Xl))
      return;
    const t = document.createElement("style");
    t.id = Xl, t.textContent = kR, document.head.appendChild(t);
  }, []);
}
const Zl = (t) => !Number.isFinite(t) || t <= 0 ? "0" : t >= 1e3 ? `${(t / 1e3).toFixed(t >= 1e4 ? 0 : 1)}k` : String(Math.round(t)), RR = (t) => (t.split("/").pop() ?? t).split(":")[0], PR = ({ used: t, window: e }) => {
  const r = e > 0 ? Math.min(t / e, 1) : 0, n = r > 0.85 ? "bg-destructive" : r > 0.6 ? "bg-amber-500" : "bg-primary";
  return /* @__PURE__ */ f(IR, { delayDuration: 200, children: /* @__PURE__ */ H(CR, { children: [
    /* @__PURE__ */ f(ER, { asChild: !0, children: /* @__PURE__ */ H("div", { className: "flex min-w-36 items-center gap-2", "aria-label": "Context usage", children: [
      /* @__PURE__ */ f("div", { className: "bg-muted h-1.5 w-24 overflow-hidden rounded-full", children: /* @__PURE__ */ f(
        "div",
        {
          className: K("h-full rounded-full transition-[width] duration-500", n),
          style: { width: `${Math.max(r * 100, t > 0 ? 2 : 0)}%` }
        }
      ) }),
      /* @__PURE__ */ H("span", { className: "text-muted-foreground text-xs whitespace-nowrap tabular-nums", children: [
        Zl(t),
        " / ",
        Zl(e)
      ] })
    ] }) }),
    /* @__PURE__ */ H(TR, { side: "bottom", children: [
      "Context: ",
      t.toLocaleString(),
      " of ",
      e.toLocaleString(),
      " tokens (",
      Math.round(r * 100),
      "%)"
    ] })
  ] }) });
}, MR = () => (jr("composer.attachmentAddError", ({ reason: t, message: e }) => {
  var i;
  const r = (i = window.sonner) == null ? void 0 : i.toast, n = t === "not-accepted" ? "This file type is not supported." : e || "Attachment failed.";
  r != null && r.error ? r.error(n) : console.warn("[openharness-ui]", n);
}), null), DR = ({ getMeta: t, onUsage: e, onRunEnd: r }) => {
  const n = xt(
    () => wR({ onUsage: e, onRunEnd: r }),
    [e, r]
  ), i = xt(() => new xR(t), [t]), o = Xy(n, { adapters: { attachments: i } });
  return /* @__PURE__ */ H(a0, { runtime: o, children: [
    /* @__PURE__ */ f(MR, {}),
    /* @__PURE__ */ f(oR, {})
  ] });
};
function zR() {
  AR();
  const [t, e] = Ie(null), [r, n] = Ie(null), [i, o] = Ie(null), [s, a] = Ie(0), [l, c] = Ie(!1), d = lt(null);
  d.current = t;
  const u = yt(() => d.current, []), h = yt(() => {
    gR().then((b) => {
      e(b), n(null);
    }).catch((b) => n((b == null ? void 0 : b.message) || "Failed to load agent info"));
  }, []);
  Ht(() => {
    h();
  }, [h]);
  const p = yt((b) => o(b), []), m = yt(() => h(), [h]), g = yt(async () => {
    var b;
    if (!l) {
      c(!0);
      try {
        await bR(), o(null), a((k) => k + 1), h();
      } catch (k) {
        const x = (b = window.sonner) == null ? void 0 : b.toast;
        x != null && x.error && x.error((k == null ? void 0 : k.message) || "Failed to reset the session");
      } finally {
        c(!1);
      }
    }
  }, [l, h]), v = i ? (i.inputTokens ?? 0) + (i.outputTokens ?? 0) : (t == null ? void 0 : t.contextTokens) ?? 0;
  return /* @__PURE__ */ H("div", { className: "aui-root ohx-root bg-background text-foreground", children: [
    /* @__PURE__ */ H("header", { className: "border-border/60 flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5", children: [
      /* @__PURE__ */ H("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ f(uh, { className: "text-muted-foreground size-5" }),
        /* @__PURE__ */ f("span", { className: "text-sm font-semibold", children: "OpenHarness Agent" })
      ] }),
      t && /* @__PURE__ */ f(SR, { variant: "outline", className: "max-w-64 font-mono text-xs", title: t.model, children: /* @__PURE__ */ f("span", { className: "truncate", children: RR(t.model) }) }),
      /* @__PURE__ */ H("div", { className: "ms-auto flex items-center gap-4", children: [
        t && /* @__PURE__ */ f(PR, { used: v, window: t.contextWindow }),
        t && t.turns > 0 && /* @__PURE__ */ H("span", { className: "text-muted-foreground hidden text-xs sm:inline", children: [
          t.turns,
          " ",
          t.turns === 1 ? "turn" : "turns"
        ] }),
        /* @__PURE__ */ H(
          _R,
          {
            variant: "outline",
            size: "sm",
            onClick: g,
            disabled: l,
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ f(Hk, { className: K("size-3.5", l && "animate-spin") }),
              "New chat"
            ]
          }
        )
      ] }),
      r && /* @__PURE__ */ f("span", { className: "text-destructive w-full text-xs", children: r })
    ] }),
    /* @__PURE__ */ f(DR, { getMeta: u, onUsage: p, onRunEnd: m }, s)
  ] });
}
export {
  zR as default
};
