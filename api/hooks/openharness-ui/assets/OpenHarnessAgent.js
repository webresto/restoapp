var rf = Object.defineProperty;
var nf = (t, e, r) => e in t ? rf(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var C = (t, e, r) => (nf(t, typeof e != "symbol" ? e + "" : e, r), r), Rs = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
};
var Ar = (t, e, r) => (Rs(t, e, "read from private field"), r ? r.call(t) : e.get(t)), Rr = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, Pr = (t, e, r, n) => (Rs(t, e, "write to private field"), n ? n.call(t, r) : e.set(t, r), r);
const _e = window.React, {
  Children: Bi,
  Component: of,
  Fragment: Ft,
  Profiler: sf,
  PureComponent: af,
  StrictMode: lf,
  Suspense: cf,
  act: uf,
  cloneElement: Ut,
  createContext: bo,
  createElement: Ct,
  createFactory: df,
  createRef: hf,
  forwardRef: te,
  isValidElement: Tt,
  lazy: pf,
  memo: we,
  startTransition: ff,
  useCallback: Xe,
  useContext: en,
  useDebugValue: mf,
  useDeferredValue: sc,
  useEffect: It,
  useId: vo,
  useImperativeHandle: gf,
  useInsertionEffect: ac,
  useLayoutEffect: Vn,
  useMemo: kt,
  useReducer: bf,
  useRef: $e,
  useState: Ce,
  useSyncExternalStore: vf,
  useTransition: wf,
  version: yf
} = _e, xf = _e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, kf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: Bi,
  Component: of,
  Fragment: Ft,
  Profiler: sf,
  PureComponent: af,
  StrictMode: lf,
  Suspense: cf,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: xf,
  act: uf,
  cloneElement: Ut,
  createContext: bo,
  createElement: Ct,
  createFactory: df,
  createRef: hf,
  default: _e,
  forwardRef: te,
  isValidElement: Tt,
  lazy: pf,
  memo: we,
  startTransition: ff,
  useCallback: Xe,
  useContext: en,
  useDebugValue: mf,
  useDeferredValue: sc,
  useEffect: It,
  useId: vo,
  useImperativeHandle: gf,
  useInsertionEffect: ac,
  useLayoutEffect: Vn,
  useMemo: kt,
  useReducer: bf,
  useRef: $e,
  useState: Ce,
  useSyncExternalStore: vf,
  useTransition: wf,
  version: yf
}, Symbol.toStringTag, { value: "Module" })), it = Ft;
function lc(t, e, r) {
  return r !== void 0 ? Ct(t, { ...e, key: r }) : Ct(t, e);
}
const m = lc, V = lc;
let dr = null;
function _f(t, e) {
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
function Et() {
  if (!dr)
    throw new Error("No resource fiber available");
  return dr;
}
function Gt() {
  return dr;
}
const wo = Symbol("tap.Context.defaultValue"), Sf = (t) => t;
let ct = /* @__PURE__ */ new Map();
const Lt = /* @__PURE__ */ new Set(), cc = () => new Map(ct), li = (t, e) => {
  const r = ct;
  ct = t;
  try {
    return e();
  } finally {
    ct = r;
  }
}, uc = (t, e) => {
  t[wo] = e;
}, dc = (t) => typeof t == "object" && t !== null && wo in t, hc = (t) => typeof t == "object" && t !== null && "$$typeof" in t && t.$$typeof === Symbol.for("react.context"), yo = (t) => dc(t) || hc(t), pc = (t) => {
  if (!dc(t)) {
    if (hc(t)) {
      uc(t, t._currentValue ?? t._currentValue2);
      return;
    }
    throw new Error("A tap resource's `use()` only accepts a tap context.");
  }
}, fc = (t, e, r) => {
  if (typeof t != "object" || t === null)
    throw new Error("useContextProvider only accepts a React context.");
  pc(t);
  const n = t, i = Et(), o = Z(void 0), s = o.current === void 0 || !Object.is(o.current.value, e);
  Q(() => {
    o.current = { value: e };
  }, [e]);
  const a = ct.get(n), l = a !== void 0 || ct.has(n);
  ct.set(n, {
    value: e,
    source: i
  });
  try {
    return Cf(n, s, r);
  } finally {
    l ? ct.set(n, a) : ct.delete(n);
  }
}, Cf = (t, e, r) => {
  const n = Lt.has(t);
  e ? Lt.add(t) : Lt.delete(t);
  try {
    return r();
  } finally {
    n ? Lt.add(t) : Lt.delete(t);
  }
}, Tf = (t) => {
  pc(t);
  const e = t, r = If(e, t), n = Et();
  return (n.wipContextDeps ?? (n.wipContextDeps = /* @__PURE__ */ new Map())).set(e, r.source), r.value;
}, If = (t, e) => ct.get(t) ?? {
  value: Sf(e)[wo],
  source: null
}, Ef = (t, e, r, n) => {
  if (!n)
    return r;
  let i = r;
  for (const [o, s] of n)
    s === e || s === t || (i ?? (i = /* @__PURE__ */ new Map())).set(o, s);
  return i;
}, mc = (t, e = t.wipContextDeps) => {
  const r = Gt();
  !r || !e || (r.wipContextDeps = Ef(r, t, r.wipContextDeps, e));
}, gc = () => Lt.size > 0, xo = (t) => {
  if (!t.contextDeps || !gc())
    return !1;
  for (const e of Lt.keys())
    if (t.contextDeps.has(e))
      return !0;
  return !1;
}, Af = [
  0,
  1,
  2,
  3
];
function Ps(t) {
  const e = [];
  for (const r of Af) {
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
function bc(t) {
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
const qe = typeof process < "u" && ({}.NODE_ENV === "development" || {}.NODE_ENV === "test"), vc = (t) => ({
  version: 0,
  committedVersion: 0,
  context: cc(),
  dispatchUpdate: t,
  changelog: [],
  rollbackCallbacks: []
}), In = (t) => {
  t.committedVersion = t.version, t.changelog.length = 0, t.rollbackCallbacks.length = 0;
}, zr = (t, e) => {
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
        wc(t.changelog[n]);
      In(t);
    }
  }
}, wc = (t) => {
  var e;
  xc(t.fiber, t.cell), t.queued || (t.queued = !0, ((e = t.cell).queue ?? (e.queue = [])).push(t));
}, Ur = (t, e, r) => {
  const n = t.wipCommitCallbacks;
  (n[e] ?? (n[e] = [])).push(r);
}, yc = (t, e) => {
  t.rollbackCallbacks.push(e);
}, xc = (t, e) => {
  var r;
  e.isDirty || (e.isDirty = !0, (r = t.markDirty) == null || r.call(t), yc(t.root, () => {
    if (e.queue !== null) {
      for (const n of e.queue)
        n.queued = !1;
      e.queue = null;
    }
    e.workInProgress = e.current, e.isDirty = !1;
  }));
}, ko = () => {
  throw new Error("Rendered more hooks than during the previous render. Hooks must be called in the exact same order in every render.");
}, _o = () => {
  throw new Error("Hook order changed between renders");
}, Rf = (t, e, r) => {
  if (t.isNeverMounted)
    throw new Error("Resource updated before mount");
  let n = !1, i = !0;
  t.root.dispatchUpdate(() => (n || (n = !0, r && t.root.changelog.length === 0 && !e.cell.isDirty && !e.hasEagerState && (e.eagerState = r(e.cell.workInProgress, e.action), e.hasEagerState = !0, i = !Object.is(e.cell.current, e.eagerState))), i), () => (n = !0, i = !0, wc(e), t.root.changelog.push(e), !0));
}, Pf = (t, e, r, n, i) => {
  const o = n ? n(r) : r;
  qe && t.devStrictMode && n && n(r);
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
        Rf(t, {
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
function kc(t, e, r, n) {
  var c;
  const i = Et(), o = i.currentIndex++, s = i.cells[o], a = (() => {
    if (s !== void 0)
      return s.type === "reducer" ? s : _o();
    !i.isFirstRender && o >= i.cells.length && ko();
    const d = Pf(i, t, e, r, n);
    return i.cells[o] = d, d;
  })(), l = a.queue;
  if (l !== null) {
    const d = t === a.reducer;
    for (let u = 0; u < l.length; u++) {
      const h = l[u];
      !h.hasEagerState || !d ? (h.eagerState = t(a.workInProgress, h.action), h.hasEagerState = !0, qe && i.devStrictMode && (h.eagerState = t(a.workInProgress, h.action))) : qe && i.devStrictMode && t(a.workInProgress, h.action), h.queued = !1, a.workInProgress = h.eagerState;
    }
    a.queue = null;
  }
  if (a.reducer = t, a.renderQueue !== null) {
    let d = a.workInProgress;
    for (const u of a.renderQueue)
      d = t(d, u);
    a.renderQueue = null, (c = i.renderPendingCells) == null || c.delete(a), Object.is(d, a.workInProgress) || (xc(i, a), a.workInProgress = d);
  }
  return a.isDirty && Ur(i, 0, () => {
    a.current = a.workInProgress, a.isDirty = !1;
  }), [a.workInProgress, a.dispatch];
}
function _c(t, e, r) {
  return kc(t, e, r, !1);
}
const Mf = (t, e) => typeof e == "function" ? e(t) : e, Df = (t) => t === void 0 ? void 0 : typeof t == "function" ? t() : t;
function So(t) {
  return kc(Mf, t, Df, !0);
}
const qn = (t, e) => {
  qe && t.length !== e.length && console.error(`The final argument passed to a hook changed size between renders. The order and size of this array must remain constant.

Previous: [${t.join(", ")}]
Incoming: [${e.join(", ")}]`);
  for (let r = 0; r < t.length && r < e.length; r++)
    if (!Object.is(t[r], e[r]))
      return !1;
  return !0;
}, Ms = (t, e) => {
  Ur(t, 0, () => {
    e.current = e.wip, e.currentDeps = e.wipDeps, e.isDirty = !1;
  });
}, Hn = (t, e) => {
  const r = Et(), n = r.currentIndex++;
  let i = r.cells[n];
  if (i === void 0) {
    !r.isFirstRender && n >= r.cells.length && ko();
    const a = t();
    return qe && r.devStrictMode && t(), i = {
      type: "memo",
      current: a,
      currentDeps: e,
      wip: a,
      wipDeps: e,
      isDirty: !1
    }, r.cells[n] = i, a;
  }
  i.type !== "memo" && _o();
  const o = i;
  if (qn(o.wipDeps, e))
    return o.isDirty && Ms(r, o), o.wip;
  const s = t();
  return qe && r.devStrictMode && t(), o.wip = s, o.wipDeps = e, o.isDirty || (o.isDirty = !0, yc(r.root, () => {
    o.wip = o.current, o.wipDeps = o.currentDeps, o.isDirty = !1;
  })), Ms(r, o), s;
};
function Gn(t) {
  return Hn(() => ({ current: t }), []);
}
const Co = (t, e) => Hn(() => t, e), Nf = () => ({
  type: "effect",
  cleanup: void 0,
  deps: null
});
function hr(t, e) {
  const r = Et(), n = r.currentIndex++, i = r.cells[n], o = i === void 0 ? Nf() : i.type === "effect" ? i : _o();
  if (i === void 0 && (!r.isFirstRender && n >= r.cells.length && ko(), r.cells[n] = o), !(e && o.deps && qn(o.deps, e))) {
    if (o.deps !== null && !!e != !!o.deps)
      throw new Error("useEffect called with and without dependencies across re-renders");
    Ur(r, 2, () => {
      var s;
      try {
        (s = o.cleanup) == null || s.call(o);
      } finally {
        o.cleanup = void 0;
      }
    }), Ur(r, 3, () => {
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
function To(t) {
  const e = Et(), r = Gn(t);
  return r.current !== t && Ur(e, 1, () => {
    r.current = t;
  }), Co((...n) => {
    if (qe && Gt())
      throw new Error("useEffectEvent cannot be called during render");
    return r.current(...n);
  }, []);
}
const En = (t) => {
  if (!yo(t))
    throw new Error("A tap resource's `use()` only accepts a tap context.");
  return Tf(t);
}, Sc = (t, e, r = e) => {
  const n = Gn(!0), i = n.current ? r() : e();
  n.current = !1;
  const [, o] = So(0), s = To(() => {
    Object.is(i, e()) || o((a) => a + 1);
  });
  return hr(() => (s(), t(s)), [t]), i;
}, Cc = (t, e) => {
}, zf = _e;
function Of(t) {
  const e = $e(t);
  return ac(() => {
    e.current = t;
  }), Xe((...r) => e.current(...r), []);
}
const Lf = zf.useEffectEvent ?? Of, Ge = () => Gt() !== null, We = _e, ve = (t) => Ge() ? So(t) : We.useState(t), $f = (t, e, r) => Ge() ? _c(t, e, r) : We.useReducer(t, e, r), Z = (t) => Ge() ? Gn(t) : We.useRef(t), ce = (t, e) => Ge() ? Hn(t, e) : We.useMemo(t, e), _t = (t, e) => Ge() ? Co(t, e) : We.useCallback(t, e), Q = (t, e) => Ge() ? hr(t, e) : We.useEffect(t, e), jr = (t, e) => Ge() ? hr(t, e) : We.useLayoutEffect(t, e), je = (t) => Ge() ? To(t) : Lf(t), vr = (t, e, r) => Ge() ? Sc(t, e, r) : We.useSyncExternalStore(t, e, r), Bf = (t, e) => Ge() ? Cc() : We.useDebugValue(t, e), Ke = (t) => {
  const e = We.createContext(t);
  return uc(e, t), e;
}, Tc = (t) => Ge() && yo(t) ? En(t) : We.use(t), Qe = (t) => Ge() && yo(t) ? En(t) : We.useContext(t), Ic = _e, Ec = Symbol.for("react.memo_cache_sentinel"), Ac = (t) => new Array(t).fill(Ec), Ff = (t) => Ic.useMemo(() => {
  const e = Ac(t);
  return e[Ec] = !0, e;
}, []), A = (t) => {
  var s;
  const e = Gt();
  if (e === null)
    return (((s = Ic.__COMPILER_RUNTIME) == null ? void 0 : s.c) ?? Ff)(t);
  const r = e.memoCache;
  let n = r.workInProgress;
  if (n === null) {
    const a = r.current;
    n = a === null ? [] : a.map((l) => l.slice()), r.workInProgress = n;
  }
  const i = r.index++;
  let o = n[i];
  return o === void 0 ? (o = Ac(t), n[i] = o) : qe && o.length !== t && console.error(`Expected a constant size argument for each invocation of c(). The previous cache was allocated with size ${o.length} but size ${t} was requested.`), o;
};
function le(t) {
  return (...e) => ({
    hook: t,
    args: e
  });
}
function rt(t, e, r) {
  return r ? {
    ...e,
    key: t,
    deps: r
  } : {
    ...e,
    key: t
  };
}
const Uf = 50;
let ut = {
  schedulers: /* @__PURE__ */ new Set([]),
  isScheduled: !1
};
var jf = class {
  constructor(t) {
    C(this, "_task");
    C(this, "_isDirty", !1);
    this._task = t;
  }
  get isDirty() {
    return this._isDirty;
  }
  markDirty() {
    this._isDirty = !0, ut.schedulers.add(this), Vf();
  }
  runTask() {
    this._isDirty = !1, this._task();
  }
};
const Vf = () => {
  ut.isScheduled || (ut.isScheduled = !0, qf());
}, Fi = () => {
  try {
    const t = [];
    let e = 0;
    for (const r of ut.schedulers)
      if (ut.schedulers.delete(r), !!r.isDirty) {
        if (e++, e > Uf)
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
    ut.schedulers.clear(), ut.isScheduled = !1;
  }
}, qf = (() => {
  if (typeof MessageChannel < "u") {
    const t = new MessageChannel();
    return t.port1.onmessage = Fi, () => t.port2.postMessage(null);
  }
  return () => setTimeout(Fi, 0);
})(), Ds = (t) => {
  const e = ut;
  ut = {
    schedulers: /* @__PURE__ */ new Set([]),
    isScheduled: !0
  };
  try {
    const r = t();
    return Fi(), r;
  } finally {
    ut = e;
  }
}, Hf = {
  useState: So,
  useReducer: _c,
  useRef: Gn,
  useMemo: Hn,
  useCallback: Co,
  useEffect: hr,
  useLayoutEffect: hr,
  useInsertionEffect: hr,
  useEffectEvent: To,
  useContext: En,
  use: En,
  useSyncExternalStore: Sc,
  useDebugValue: Cc
}, Ns = _e, Mt = Ns.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ?? Ns.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ln = Mt == null ? null : "H" in Mt ? {
  get current() {
    return Mt.H;
  },
  set current(t) {
    Mt.H = t;
  }
} : "ReactCurrentDispatcher" in Mt ? {
  get current() {
    return Mt.ReactCurrentDispatcher.current;
  },
  set current(t) {
    Mt.ReactCurrentDispatcher.current = t;
  }
} : null;
function Gf(t) {
  if (!ln)
    return t();
  const e = ln.current;
  ln.current = Hf;
  try {
    return t();
  } finally {
    ln.current = e;
  }
}
function Rc(t, e, r = void 0, n) {
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
  t.isMounted = !1, bc(t);
}
function St(t, e) {
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
    t.memoCache.index = 0, _f(t, () => {
      n = Gf(() => t.hook(...e));
    });
  } while ((((i = t.renderPendingCells) == null ? void 0 : i.size) ?? 0) > 0);
  return mc(t), n;
}
function Vr(t) {
  const e = t.wipCommitCallbacks ?? t.commitCallbacks ?? [];
  t.wipCommitCallbacks = null, t.commitCallbacks = e, t.isMounted = !0, t.contextDeps = t.wipContextDeps, In(t.root), t.memoCache.workInProgress !== null && (t.memoCache.current = t.memoCache.workInProgress, t.memoCache.workInProgress = null), qe && t.isNeverMounted && t.devStrictMode === "root" && (t.isNeverMounted = !1, Ps(e), bc(t)), t.isNeverMounted = !1, Ps(e);
}
const Wf = () => {
  const t = Et();
  return t.devStrictMode ? t.isFirstRender ? "child" : "root" : null;
}, Kf = () => "child", zs = () => null, Qf = () => {
  if (!qe)
    return zs;
  const t = Z(0);
  return ve(() => t.current++), t.current !== 2 ? zs : Kf;
}, Pc = () => Gt() ? Wf : Qf(), Yf = (t) => t(), Jf = (t) => {
  const e = ce(() => new jf(() => p()), []), r = ce(() => [], []), n = Pc(), i = ce(() => {
    const f = vc((g, v) => {
      if (!e.isDirty) {
        if (!g())
          return;
        v();
      }
      zr(f, f.committedVersion + f.changelog.length), r.push(v), e.markDirty();
    });
    return Rc(Yf, f, void 0, n());
  }, [
    r,
    e,
    n
  ]), o = cc(), s = i.root.version - i.root.committedVersion, a = li(o, () => St(i, [t])), l = Z(!1), c = Z([t]), d = Z(a), u = ce(() => /* @__PURE__ */ new Set(), []), h = (f) => {
    e.isDirty || d.current === f || (d.current = f, u.forEach((g) => g()));
  }, p = je(() => {
    zr(i.root, i.root.committedVersion), r.forEach((g) => {
      qe && i.devStrictMode && g(), g();
    }), zr(i.root, i.root.committedVersion + i.root.changelog.length), qe && i.devStrictMode && li(i.root.context, () => St(i, c.current));
    const f = li(i.root.context, () => St(i, c.current));
    if (e.isDirty)
      throw new Error("Scheduler is dirty, this should never happen");
    In(i.root), r.length = 0, l.current && Vr(i), h(f);
  });
  return Q(() => (l.current = !0, () => {
    l.current = !1, pr(i);
  }), [i]), Q(() => {
    c.current = [t], In(i.root), r.splice(0, s), i.root.context = o, Vr(i), h(a);
  }), ce(() => ({
    getValue: () => d.current,
    subscribe: (f) => (u.add(f), () => u.delete(f))
  }), [u]);
}, Xf = () => {
  const t = Z(0), e = t.current, r = Et();
  return {
    version: e,
    markDirty: ce(() => () => {
      var n;
      t.current++, (n = r == null ? void 0 : r.markDirty) == null || n.call(r);
    }, [r]),
    root: r.root
  };
}, Zf = () => {
  const t = ce(() => vc((i, o) => {
    let s = !1;
    n((a) => (s = !i(), s ? a : a + 1)), s || r(o);
  }), []), [e, r] = $f((i, o) => (zr(t, i), i + (o() ? 1 : 0)), 0), [, n] = ve(0);
  return zr(t, e), {
    root: t,
    version: e,
    markDirty: void 0
  };
}, Io = () => {
  const t = Pc(), { root: e, version: r, markDirty: n } = Gt() ? Xf() : Zf();
  return {
    version: r,
    createFiber: _t((i, o, s) => Rc(i, e, s ? () => {
      s(), n == null || n();
    } : n, t()), [])
  };
}, Mc = (t, e, r) => {
  const n = Z(null), i = n.current ?? (n.current = {
    wipDeps: null,
    wip: null,
    currentDeps: null,
    current: null
  });
  return i.wipDeps = i.currentDeps, i.wip = i.current, Q(() => {
    i.currentDeps = i.wipDeps, i.current = i.wip;
  }), !r && i.currentDeps && qn(i.currentDeps, e) ? i.current : (i.wipDeps = e, i.wip = t(), i.wip);
};
function Ne(t) {
  const { version: e, createFiber: r } = Io(), n = ce(() => r(t.hook, t.key), [
    t.hook,
    t.key,
    r
  ]), i = Mc(() => ({ value: St(n, t.args) }), [
    n,
    e,
    t.args
  ], xo(n));
  return Q(() => () => pr(n), [n]), Q(() => {
    Vr(n);
  }, [n, i]), i.value;
}
const Os = (t, e) => {
  const r = t.get(e);
  r && (r.isDirty = !0);
}, em = (t, e) => !t.isDirty && !xo(t.fiber) && e !== void 0 && t.committedDeps !== void 0 && qn(t.committedDeps, e), tm = (t) => {
  if (!gc())
    return !1;
  for (const { fiber: e } of t.values())
    if (xo(e))
      return !0;
  return !1;
};
function Wn(t) {
  const e = ce(() => /* @__PURE__ */ new Map(), []), { version: r, createFiber: n } = Io(), i = tm(e), o = Mc(() => {
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
          const p = n(d.hook, d.key, () => Os(e, u)), f = St(p, d.args);
          h.next = {
            value: f,
            deps: d.deps,
            remount: p
          };
        } else if (em(h, d.deps))
          h.fiber.contextDeps && mc(h.fiber, h.fiber.contextDeps), h.next = "skip";
        else {
          const p = St(h.fiber, d.args);
          h.next = {
            value: p,
            deps: d.deps
          };
        }
      else {
        const p = n(d.hook, d.key, () => Os(e, u));
        h = {
          fiber: p,
          next: {
            value: St(p, d.args),
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
      l === "delete" ? (a.fiber.isMounted && pr(a.fiber), e.delete(s)) : l === "skip" || (l.remount && (pr(a.fiber), a.fiber = l.remount), Vr(a.fiber), a.committedDeps = l.deps, a.committedValue = l.value, a.isDirty = !1);
    }
  }, [o, e]), o;
}
const rm = (t) => t(), nm = (t) => {
  const { createFiber: e } = Io(), r = ce(() => e(rm, void 0), [e]), n = St(r, [t]);
  Q(() => () => {
    pr(r);
  }, [r]);
  let i = !1;
  const o = () => {
    i && r.isMounted || (i = !0, Vr(r));
  };
  return Q(o), {
    value: n,
    effects: o
  };
}, im = () => {
  const t = A(4), [e, r] = ve(sm);
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
}, om = le(im);
function sm() {
  return {
    renderers: {},
    fallbacks: []
  };
}
const am = (t) => {
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
var Eo = class {
  constructor() {
    C(this, "_providers", /* @__PURE__ */ new Set());
    C(this, "_subscribers", /* @__PURE__ */ new Set());
  }
  getModelContext() {
    return am(this._providers);
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
const Ui = [], lm = {
  modelName: void 0,
  toolNames: Ui
}, cm = (t, e) => t === e || t.length === e.length && t.every((r, n) => r === e[n]), cn = (t, e) => {
  var s;
  const r = t.getModelContext(), n = (s = r.config) == null ? void 0 : s.modelName, i = r.tools ? Object.keys(r.tools).sort() : Ui, o = i.length ? i : Ui;
  return n === e.modelName && cm(o, e.toolNames) ? e : {
    modelName: n,
    toolNames: o
  };
}, um = () => {
  const t = A(11);
  let e;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (e = new Eo(), t[0] = e) : e = t[0];
  const r = e;
  let n;
  t[1] === Symbol.for("react.memo_cache_sentinel") ? (n = () => cn(r, lm), t[1] = n) : n = t[1];
  const [i, o] = ve(n);
  let s, a;
  t[2] === Symbol.for("react.memo_cache_sentinel") ? (s = () => (o((p) => cn(r, p)), r.subscribe(() => {
    o((p) => cn(r, p));
  })), a = [r], t[2] = s, t[3] = a) : (s = t[2], a = t[3]), Q(s, a);
  let l;
  t[4] !== i ? (l = () => cn(r, i), t[4] = i, t[5] = l) : l = t[5];
  let c, d, u;
  t[6] === Symbol.for("react.memo_cache_sentinel") ? (c = () => r.getModelContext(), d = (p) => r.subscribe(p), u = (p) => r.registerModelContextProvider(p), t[6] = c, t[7] = d, t[8] = u) : (c = t[6], d = t[7], u = t[8]);
  let h;
  return t[9] !== l ? (h = {
    getState: l,
    getModelContext: c,
    subscribe: d,
    register: u
  }, t[9] = l, t[10] = h) : h = t[10], h;
}, Dc = le(um), dm = (t) => t.display !== void 0 ? t.display === "standalone" : t.type === "human", hm = (t, e) => {
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
}, pm = (t) => function(r) {
  return hm(t, r);
}, ji = Symbol("assistant-ui.store.clientIndex"), fm = (t) => t[ji], Nc = Ke([]), Ao = () => Tc(Nc), mm = (t, e) => {
  const r = A(3), n = Ao();
  let i;
  return r[0] !== t || r[1] !== n ? (i = [...n, t], r[0] = t, r[1] = n, r[2] = i) : i = r[2], fc(Nc, i, e);
}, gm = /* @__PURE__ */ new Set([
  "$$typeof",
  "nodeType",
  "then"
]), Kn = (t, e) => {
  if (t === Symbol.toStringTag)
    return e;
  if (typeof t != "symbol") {
    if (t === "toJSON")
      return () => e;
    if (!gm.has(t))
      return !1;
  }
};
var Ro = class {
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
const An = Symbol("assistant-ui.store.getValue"), bm = (t) => {
  var r;
  const e = t[An];
  if (!e)
    throw new Error("Client scope contains a non-client resource. Ensure your Derived get() returns a client created with useClientResource(), not a plain resource.");
  return (r = e.getState) == null ? void 0 : r.call(e);
}, Ls = /* @__PURE__ */ new Map();
function vm(t) {
  let e = Ls.get(t);
  return e || (e = function(...r) {
    if (!this || typeof this != "object")
      throw new Error(`Method "${String(t)}" called without proper context. This may indicate the function was called incorrectly.`);
    const n = this[An];
    if (!n)
      throw new Error(`Method "${String(t)}" called on invalid client proxy. Ensure you are calling this method on a valid client instance.`);
    const i = n[t];
    if (!i)
      throw new Error(`Method "${String(t)}" is not implemented.`);
    if (typeof i != "function")
      throw new Error(`"${String(t)}" is not a function.`);
    return i(...r);
  }, Ls.set(t, e)), e;
}
var wm = class extends Ro {
  constructor(e, r) {
    super();
    C(this, "outputRef");
    C(this, "index");
    C(this, "boundFns");
    C(this, "cachedReceiver");
    this.outputRef = e, this.index = r;
  }
  get(e, r, n) {
    if (r === An)
      return this.outputRef.current;
    if (r === ji)
      return this.index;
    const i = Kn(r, "ClientProxy");
    if (i !== !1)
      return i;
    const o = this.outputRef.current[r];
    if (typeof o == "function") {
      this.cachedReceiver !== n && (this.boundFns = /* @__PURE__ */ new Map(), this.cachedReceiver = n);
      let s = this.boundFns.get(r);
      return s || (s = vm(r).bind(n), this.boundFns.set(r, s)), s;
    }
    return o;
  }
  ownKeys() {
    return Object.keys(this.outputRef.current);
  }
  has(e, r) {
    return r === An || r === ji ? !0 : r in this.outputRef.current;
  }
};
const tn = (t) => {
  var o;
  const e = Z(null), r = Ao().length, n = ce(() => new Proxy({}, new wm(e, r)), [r]), i = mm(n, function() {
    return Ne(t);
  });
  return e.current || (e.current = i), Q(() => {
    e.current = i;
  }), {
    methods: n,
    state: (o = i.getState) == null ? void 0 : o.call(i),
    key: t.key
  };
}, ym = le(tn), Or = Symbol("assistant-ui.store.proxiedAssistantState"), ci = (t) => t === "on" || t === "subscribe" || typeof t == "symbol", zc = (t) => {
  class e extends Ro {
    get(n, i) {
      const o = Kn(i, "AssistantState");
      if (o !== !1)
        return o;
      const s = i;
      if (!ci(s))
        return bm(t[s]());
    }
    ownKeys() {
      return Object.keys(t).filter((n) => !ci(n));
    }
    has(n, i) {
      return !ci(i) && i in t;
    }
  }
  return new Proxy({}, new e());
}, xm = (t) => t[Or], $s = () => () => {
}, Oc = (t) => {
  const e = () => {
    throw new Error(t);
  };
  return e.source = null, e.query = null, e;
};
var km = class extends Ro {
  get(t, e) {
    if (e === "subscribe" || e === "on")
      return $s;
    if (e === Or)
      return _m;
    const r = Kn(e, "DefaultAssistantClient");
    return r !== !1 ? r : Oc("You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.");
  }
  ownKeys() {
    return [
      "subscribe",
      "on",
      Or
    ];
  }
  has(t, e) {
    return e === "subscribe" || e === "on" || e === Or;
  }
};
const Qn = new Proxy({}, new km()), _m = zc(Qn), Sm = () => new Proxy({}, { get(t, e) {
  const r = Kn(e, "AssistantClient");
  return r !== !1 ? r : Oc(`The current scope does not have a "${String(e)}" property.`);
} }), Lc = Ke(Qn), $c = Symbol("assistant-ui.store.useEffects"), Cm = () => {
}, Tm = (t) => t[$c] ?? Cm, Im = () => {
  "use no memo";
  return Q(Tm(Bc())), null;
}, Bc = () => Qe(Lc), He = ({ value: t, children: e }) => {
  "use no memo";
  return /* @__PURE__ */ V(Lc.Provider, {
    value: t,
    children: [/* @__PURE__ */ m(Im, {}), e]
  });
}, Vi = (t) => null, Ve = le(Vi), qi = Symbol("assistant-ui.transform-scopes");
function Fc(t, e) {
  const r = t;
  if (r[qi])
    throw new Error("transformScopes is already attached to this resource");
  r[qi] = e;
}
function Em(t) {
  return t[qi];
}
const Uc = (t) => typeof t == "string" ? {
  scope: t.split(".")[0],
  event: t
} : {
  scope: t.scope,
  event: t.event
}, jc = Ke(null), Am = (t, e) => fc(jc, t, e), Vc = () => {
  const t = Tc(jc);
  if (!t)
    throw new Error("AssistantTapContext is not available");
  return t;
}, qc = () => Vc().clientRef, Po = () => {
  const t = A(3), { emit: e } = Vc(), r = Ao();
  let n;
  return t[0] !== r || t[1] !== e ? (n = (i, o) => {
    e(i, o, r);
  }, t[0] = r, t[1] = e, t[2] = n) : n = t[2], je(n);
};
function Rm(t, e) {
  const r = { ...t }, n = /* @__PURE__ */ new Set();
  let i = !0;
  for (; i; ) {
    i = !1;
    for (const a of Object.values(r)) {
      if (a.hook === Vi || n.has(a.hook))
        continue;
      n.add(a.hook);
      const l = Em(a.hook);
      if (l) {
        l(r, e), i = !0;
        break;
      }
    }
  }
  const o = {}, s = {};
  for (const [a, l] of Object.entries(r))
    l.hook === Vi ? s[a] = l : o[a] = l;
  return {
    rootClients: o,
    derivedClients: s
  };
}
const Bs = (t) => ce(() => t, [...Object.entries(t).flat()]), Pm = (t, e) => {
  const r = A(6);
  let n;
  r[0] !== e || r[1] !== t ? (n = Rm(t, e), r[0] = e, r[1] = t, r[2] = n) : n = r[2];
  const { rootClients: i, derivedClients: o } = n, s = Bs(i), a = Bs(o);
  let l;
  return r[3] !== s || r[4] !== a ? (l = {
    rootClients: s,
    derivedClients: a
  }, r[3] = s, r[4] = a, r[5] = l) : l = r[5], l;
}, Mm = () => {
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
                const f = p;
                u.push(f);
              }
          if (i.size > 0) {
            const h = {
              event: a,
              payload: l
            };
            for (const p of i)
              try {
                p(h, c);
              } catch (f) {
                const g = f;
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
}, Dm = le(Mm), Hc = (t) => ce(() => t, t), Nm = ({ element: t, emit: e, clientRef: r }) => {
  const { methods: n, state: i } = Am({
    clientRef: r,
    emit: e
  }, function() {
    return tn(t);
  });
  return ce(() => ({
    state: i,
    methods: n
  }), [n, i]);
}, zm = ({ element: t, notifications: e, clientRef: r, name: n }) => {
  const i = Jf(function() {
    return Nm({
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
}, Om = le(zm), Lm = () => {
  const t = A(2);
  let e;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (e = [], t[0] = e) : e = t[0];
  let r;
  return t[1] === Symbol.for("react.memo_cache_sentinel") ? (r = {
    clients: e,
    subscribe: void 0,
    on: void 0
  }, t[1] = r) : r = t[1], r;
}, $m = le(Lm), Bm = (t) => {
  const e = A(14), { clients: r, clientRef: n } = t;
  let i;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (i = Dm(), e[0] = i) : i = e[0];
  const o = Ne(i);
  let s;
  e[1] !== n.parent || e[2] !== o.notifySubscribers ? (s = () => n.parent.subscribe(o.notifySubscribers), e[1] = n.parent, e[2] = o.notifySubscribers, e[3] = s) : s = e[3];
  let a;
  e[4] !== n || e[5] !== o ? (a = [n, o], e[4] = n, e[5] = o, e[6] = a) : a = e[6], Q(s, a);
  let l;
  e[7] !== n || e[8] !== r || e[9] !== o ? (l = Object.keys(r).map((u) => rt(u, Om({
    element: r[u],
    notifications: o,
    clientRef: n,
    name: u
  }))), e[7] = n, e[8] = r, e[9] = o, e[10] = l) : l = e[10];
  const c = Hc(Wn(l));
  let d;
  return e[11] !== o || e[12] !== c ? (d = {
    notifications: o,
    results: c
  }, e[11] = o, e[12] = c, e[13] = d) : d = e[13], d;
}, Fm = (t) => {
  const { clientRef: e } = t, { notifications: r, results: n } = Bm(t);
  return ce(() => ({
    clients: n,
    subscribe: r.subscribe,
    on: function(i, o) {
      if (!this)
        throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
      const { scope: s, event: a } = Uc(i);
      if (s !== "*" && this[s].source === null)
        throw new Error(`Scope "${s}" is not available. Use { scope: "*", event: "${a}" } to listen globally.`);
      const l = r.on(a, (d, u) => {
        if (s === "*") {
          o(d);
          return;
        }
        const h = this[s]();
        h === u[fm(h)] && o(d);
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
}, Um = le(Fm), jm = ({ element: t, clientRef: e, name: r }) => {
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
}, Vm = le(jm), qm = (t, e) => {
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
}, Hm = (t) => {
  const e = A(3), { clients: r, clientRef: n } = t;
  let i;
  return e[0] !== n || e[1] !== r ? (i = Object.keys(r).map((o) => {
    const s = o, a = r[s];
    return rt(qm(s, a.args[0]), Vm({
      element: a,
      clientRef: n,
      name: s
    }));
  }), e[0] = n, e[1] = r, e[2] = i) : i = e[2], Hc(Wn(i));
}, Gm = (t) => {
  const e = A(3), { rootClients: r, clientRef: n } = t;
  let i;
  return e[0] !== n || e[1] !== r ? (i = Object.keys(r).length > 0 ? Um({
    clients: r,
    clientRef: n
  }) : $m(), e[0] = n, e[1] = r, e[2] = i) : i = e[2], Ne(i);
}, Wm = ({ parent: t, clients: e }) => {
  const { rootClients: r, derivedClients: n } = Pm(e, t), i = Z({
    parent: t,
    current: null
  }).current;
  Q(() => {
    i.current = a;
  });
  const o = Gm({
    rootClients: r,
    clientRef: i
  }), s = Hm({
    clients: n,
    clientRef: i
  }), a = ce(() => {
    const l = t === Qn ? Sm() : t, c = Object.create(l);
    Object.assign(c, {
      subscribe: o.subscribe ?? t.subscribe,
      on: o.on ?? t.on,
      [Or]: zc(c)
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
}, Km = (t) => {
  const { value: e, effects: r } = nm(function() {
    return Wm(t);
  });
  return e[$c] = r, e;
};
function J(t, { parent: e } = { parent: Bc() }) {
  if (t)
    return Km({
      parent: e ?? Qn,
      clients: t
    });
  if (e === null)
    throw new Error("received null parent, this usage is not allowed");
  return e;
}
const $ = (t) => {
  const e = A(6), r = J();
  let n;
  e[0] !== r ? (n = xm(r), e[0] = r, e[1] = n) : n = e[1];
  const i = n;
  let o, s;
  e[2] !== i || e[3] !== t ? (o = () => t(i), s = () => t(i), e[2] = i, e[3] = t, e[4] = o, e[5] = s) : (o = e[4], s = e[5]);
  const a = vr(r.subscribe, o, s);
  if (a === i)
    throw new Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
  return Bf(a), a;
}, jt = (t) => {
  const { children: e, condition: r } = t;
  return $(r) ? e : null;
};
jt.displayName = "AuiIf";
const Qm = (t) => {
  const e = J(), r = Z(!1), n = r.current ? null : t(e);
  return $(() => r.current ? t(e) : n), () => (r.current = !0, t(e));
}, Ym = Object.freeze({});
function wr(t) {
  const e = A(3), { getItemState: r, children: n } = t, i = Qm(r);
  let o;
  return e[0] !== n || e[1] !== i ? (o = n(i), e[0] = n, e[1] = i, e[2] = o) : o = e[2], Jm(o);
}
const Jm = (t) => {
  const e = typeof t == "object" && t != null && "type" in t ? t : null, r = e == null ? void 0 : e.type, n = e == null ? void 0 : e.key;
  return ce(() => e, [
    r,
    n,
    typeof (e == null ? void 0 : e.props) == "object" && e.props != null && Object.entries(e.props).length === 0 ? Ym : e == null ? void 0 : e.props
  ]) ?? t;
}, Xm = _e.createContext(!0);
function Fs() {
  throw new Error("A function wrapped in useEffectEvent can't be called during rendering.");
}
const Zm = "use" in _e ? () => {
  try {
    return _e.use(Xm);
  } catch {
    return !1;
  }
} : () => !1;
function eg(t) {
  const e = _e.useRef(Fs);
  return _e.useInsertionEffect(() => {
    e.current = t;
  }, [t]), (...r) => {
    Zm() && Fs();
    const n = e.current;
    return n(...r);
  };
}
const qr = (t, e) => {
  const r = A(11), n = J(), i = eg(e);
  let o;
  r[0] !== t ? (o = Uc(t), r[0] = t, r[1] = o) : o = r[1];
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
}, tg = (t) => {
  if (t.key === void 0)
    throw new Error("useClientLookup: Element has no key");
  return t.key;
};
function Vt(t) {
  const e = A(15);
  let r;
  e[0] !== t ? (r = t.map(ig), e[0] = t, e[1] = r) : r = e[1];
  const n = Wn(r);
  let i;
  e[2] !== n ? (i = Object.keys(n), e[2] = n, e[3] = i) : i = e[3];
  const o = i;
  let s;
  e[4] !== n ? (s = n.reduce(ng, {}), e[4] = n, e[5] = s) : s = e[5];
  const a = s;
  let l;
  e[6] !== n ? (l = n.map(rg), e[6] = n, e[7] = l) : l = e[7];
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
function rg(t) {
  return t.state;
}
function ng(t, e, r) {
  return t[e.key] = r, t;
}
function ig(t) {
  return rt(tg(t), ym(t), t.deps);
}
const Gc = (t) => {
  const e = A(15), { toolkit: r, mcpApp: n } = t;
  let i;
  e[0] !== n ? (i = n ? [rt("mcpApp", n)] : [], e[0] = n, e[1] = i) : i = e[1];
  const o = Wn(i)[0], [s, a] = ve(sg);
  let l;
  e[2] !== s ? (l = Object.fromEntries(Object.entries(s).map(lg)), e[2] = s, e[3] = l) : l = e[3];
  let c;
  e[4] !== o || e[5] !== l || e[6] !== s ? (c = {
    toolUIs: s,
    mcpApp: o,
    tools: l
  }, e[4] = o, e[5] = l, e[6] = s, e[7] = c) : c = e[7];
  const d = c, u = qc();
  let h;
  e[8] === Symbol.for("react.memo_cache_sentinel") ? (h = (b, _, k) => {
    const I = {
      render: _,
      standalone: (k == null ? void 0 : k.standalone) ?? !1
    };
    return a((E) => ({
      ...E,
      [b]: [...E[b] ?? [], I]
    })), () => {
      a((E) => {
        var R;
        const y = ((R = E[b]) == null ? void 0 : R.filter((P) => P !== I)) ?? [];
        if (y.length > 0)
          return {
            ...E,
            [b]: y
          };
        const M = { ...E };
        return delete M[b], M;
      });
    };
  }, e[8] = h) : h = e[8];
  const p = h;
  let f, g;
  e[9] !== u || e[10] !== r ? (f = () => {
    if (!r)
      return;
    const b = [];
    for (const [k, I] of Object.entries(r)) {
      const E = "render" in I ? I.render : void 0, y = "renderText" in I ? I.renderText : void 0, M = E ?? (y ? pm(y) : void 0);
      M && b.push(p(k, M, { standalone: dm(I) }));
    }
    const _ = Object.entries(r).reduce(cg, {});
    return b.push(u.current.modelContext().register({ getModelContext: () => ({ tools: _ }) })), () => {
      b.forEach(ug);
    };
  }, g = [
    r,
    p,
    u
  ], e[9] = u, e[10] = r, e[11] = f, e[12] = g) : (f = e[11], g = e[12]), Q(f, g);
  let v;
  return e[13] !== d ? (v = {
    getState: () => d,
    setToolUI: p
  }, e[13] = d, e[14] = v) : v = e[14], v;
}, og = le(Gc);
Fc(Gc, (t, e) => {
  !t.modelContext && e.modelContext.source === null && (t.modelContext = Dc());
});
function sg() {
  return {};
}
function ag(t) {
  return t.render;
}
function lg(t) {
  const [e, r] = t;
  return [e, r.map(ag)];
}
function cg(t, e) {
  const [r, n] = e;
  if (n.type === "mcp")
    return t;
  const { display: i, render: o, renderText: s, ...a } = n;
  return t[r] = a, t;
}
function ug(t) {
  return t();
}
const Wt = (t) => vr(t.subscribe, t.getState), dg = (t) => {
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
}, Wc = le(dg), hg = (t) => {
  const e = A(5), { runtime: r, index: n } = t;
  let i;
  e[0] !== n || e[1] !== r ? (i = r.getAttachmentByIndex(n), e[0] = n, e[1] = r, e[2] = i) : i = e[2];
  const o = i;
  let s;
  return e[3] !== o ? (s = Wc({ runtime: o }), e[3] = o, e[4] = s) : s = e[4], Ne(s);
}, pg = le(hg), fg = ({ item: t, onSteer: e, onRemove: r }) => ({
  getState: () => t,
  steer: e,
  remove: r
}), mg = le(fg), gg = (t) => {
  const e = A(55), { threadIdRef: r, messageIdRef: n, runtime: i } = t, o = Wt(i), s = Po();
  let a, l;
  e[0] !== s || e[1] !== n || e[2] !== i || e[3] !== r ? (a = () => {
    const M = [];
    for (const R of ["send", "attachmentAdd"]) {
      const P = i.unstable_on(R, () => {
        s(`composer.${R}`, {
          threadId: r.current,
          ...n && { messageId: n.current }
        });
      });
      M.push(P);
    }
    return M.push(i.unstable_on("attachmentAddError", (R) => {
      s("composer.attachmentAddError", {
        threadId: r.current,
        ...n && { messageId: n.current },
        ...R.attachmentId && { attachmentId: R.attachmentId },
        reason: R.reason,
        message: R.message
      });
    })), () => {
      for (const R of M)
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
    let M;
    e[9] !== i ? (M = (R, P) => rt(R.id, pg({
      runtime: i,
      index: P
    }), [i, P]), e[9] = i, e[10] = M) : M = e[10], c = o.attachments.map(M), e[6] = i, e[7] = o.attachments, e[8] = c;
  } else
    c = e[8];
  const d = Vt(c), u = o.queue;
  let h;
  if (e[11] !== u || e[12] !== i) {
    let M;
    e[14] !== i ? (M = (R) => rt(R.id, mg({
      item: R,
      onSteer: () => i.steerQueueItem(R.id),
      onRemove: () => i.removeQueueItem(R.id)
    })), e[14] = i, e[15] = M) : M = e[15], h = u.map(M), e[11] = u, e[12] = i, e[13] = h;
  } else
    h = e[13];
  const p = Vt(h), f = o.type ?? "thread";
  let g;
  e[16] !== d.state || e[17] !== u || e[18] !== o.attachmentAccept || e[19] !== o.canCancel || e[20] !== o.canSend || e[21] !== o.dictation || e[22] !== o.isEditing || e[23] !== o.isEmpty || e[24] !== o.quote || e[25] !== o.role || e[26] !== o.runConfig || e[27] !== o.text || e[28] !== f ? (g = {
    text: o.text,
    role: o.role,
    attachments: d.state,
    runConfig: o.runConfig,
    isEditing: o.isEditing,
    canCancel: o.canCancel,
    canSend: o.canSend,
    attachmentAccept: o.attachmentAccept,
    isEmpty: o.isEmpty,
    type: f,
    dictation: o.dictation,
    quote: o.quote,
    queue: u
  }, e[16] = d.state, e[17] = u, e[18] = o.attachmentAccept, e[19] = o.canCancel, e[20] = o.canSend, e[21] = o.dictation, e[22] = o.isEditing, e[23] = o.isEmpty, e[24] = o.quote, e[25] = o.role, e[26] = o.runConfig, e[27] = o.text, e[28] = f, e[29] = g) : g = e[29];
  const v = g;
  let b;
  e[30] !== v ? (b = () => v, e[30] = v, e[31] = b) : b = e[31];
  const _ = i.beginEdit ?? bg;
  let k;
  e[32] !== d ? (k = (M) => "id" in M ? d.get({ key: M.id }) : d.get(M), e[32] = d, e[33] = k) : k = e[33];
  let I;
  e[34] !== p ? (I = (M) => p.get(M), e[34] = p, e[35] = I) : I = e[35];
  let E;
  e[36] !== i ? (E = () => i, e[36] = i, e[37] = E) : E = e[37];
  let y;
  return e[38] !== i.addAttachment || e[39] !== i.cancel || e[40] !== i.clearAttachments || e[41] !== i.reset || e[42] !== i.send || e[43] !== i.setQuote || e[44] !== i.setRole || e[45] !== i.setRunConfig || e[46] !== i.setText || e[47] !== i.startDictation || e[48] !== i.stopDictation || e[49] !== I || e[50] !== E || e[51] !== b || e[52] !== _ || e[53] !== k ? (y = {
    getState: b,
    setText: i.setText,
    setRole: i.setRole,
    setRunConfig: i.setRunConfig,
    addAttachment: i.addAttachment,
    reset: i.reset,
    clearAttachments: i.clearAttachments,
    send: i.send,
    cancel: i.cancel,
    beginEdit: _,
    startDictation: i.startDictation,
    stopDictation: i.stopDictation,
    setQuote: i.setQuote,
    attachment: k,
    queueItem: I,
    __internal_getRuntime: E
  }, e[38] = i.addAttachment, e[39] = i.cancel, e[40] = i.clearAttachments, e[41] = i.reset, e[42] = i.send, e[43] = i.setQuote, e[44] = i.setRole, e[45] = i.setRunConfig, e[46] = i.setText, e[47] = i.startDictation, e[48] = i.stopDictation, e[49] = I, e[50] = E, e[51] = b, e[52] = _, e[53] = k, e[54] = y) : y = e[54], y;
}, Kc = le(gg);
function bg() {
  throw new Error("beginEdit is not supported in this runtime");
}
const Qc = (t) => ({ get current() {
  return t();
} }), vg = (t) => {
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
}, wg = le(vg), yg = (t) => {
  const e = A(5), { runtime: r, index: n } = t;
  let i;
  e[0] !== n || e[1] !== r ? (i = r.getAttachmentByIndex(n), e[0] = n, e[1] = r, e[2] = i) : i = e[2];
  const o = i;
  let s;
  return e[3] !== o ? (s = Wc({ runtime: o }), e[3] = o, e[4] = s) : s = e[4], Ne(s);
}, xg = le(yg), kg = (t) => {
  const e = A(5), { runtime: r, index: n } = t;
  let i;
  e[0] !== n || e[1] !== r ? (i = r.getMessagePartByIndex(n), e[0] = n, e[1] = r, e[2] = i) : i = e[2];
  const o = i;
  let s;
  return e[3] !== o ? (s = wg({ runtime: o }), e[3] = o, e[4] = s) : s = e[4], Ne(s);
}, _g = le(kg), Sg = (t) => {
  const e = A(55), { runtime: r, threadIdRef: n } = t, i = Wt(r), [o, s] = ve(!1), [a, l] = ve(!1);
  let c;
  e[0] !== r ? (c = Qc(() => r.getState().id), e[0] = r, e[1] = c) : c = e[1];
  const d = c;
  let u;
  e[2] !== d || e[3] !== r.composer || e[4] !== n ? (u = Kc({
    runtime: r.composer,
    threadIdRef: n,
    messageIdRef: d
  }), e[2] = d, e[3] = r.composer, e[4] = n, e[5] = u) : u = e[5];
  const h = tn(u);
  let p;
  if (e[6] !== r || e[7] !== i.content) {
    let B;
    e[9] !== r ? (B = (W, w) => rt("toolCallId" in W && W.toolCallId != null ? `toolCallId-${W.toolCallId}` : `index-${w}`, _g({
      runtime: r,
      index: w
    }), [r, w]), e[9] = r, e[10] = B) : B = e[10], p = i.content.map(B), e[6] = r, e[7] = i.content, e[8] = p;
  } else
    p = e[8];
  const f = Vt(p);
  let g;
  e[11] !== i.attachments ? (g = i.attachments ?? [], e[11] = i.attachments, e[12] = g) : g = e[12];
  let v;
  if (e[13] !== r || e[14] !== g) {
    let B;
    e[16] !== r ? (B = (W, w) => rt(W.id, xg({
      runtime: r,
      index: w
    }), [r, w]), e[16] = r, e[17] = B) : B = e[17], v = g.map(B), e[13] = r, e[14] = g, e[15] = v;
  } else
    v = e[15];
  const b = Vt(v), _ = i;
  let k;
  e[18] !== h.state || e[19] !== o || e[20] !== a || e[21] !== f.state || e[22] !== _ ? (k = {
    ..._,
    parts: f.state,
    composer: h.state,
    isCopied: o,
    isHovering: a
  }, e[18] = h.state, e[19] = o, e[20] = a, e[21] = f.state, e[22] = _, e[23] = k) : k = e[23];
  const I = k;
  let E;
  e[24] !== I ? (E = () => I, e[24] = I, e[25] = E) : E = e[25];
  let y;
  e[26] !== h.methods ? (y = () => h.methods, e[26] = h.methods, e[27] = y) : y = e[27];
  let M, R, P, x, T, D, N;
  e[28] !== r ? (M = () => r.delete(), R = (B) => r.reload(B), P = () => r.speak(), x = () => r.stopSpeaking(), T = (B) => r.submitFeedback(B), D = (B) => r.switchToBranch(B), N = () => r.unstable_getCopyText(), e[28] = r, e[29] = M, e[30] = R, e[31] = P, e[32] = x, e[33] = T, e[34] = D, e[35] = N) : (M = e[29], R = e[30], P = e[31], x = e[32], T = e[33], D = e[34], N = e[35]);
  let O;
  e[36] !== f ? (O = (B) => "index" in B ? f.get({ index: B.index }) : f.get({ key: `toolCallId-${B.toolCallId}` }), e[36] = f, e[37] = O) : O = e[37];
  let L;
  e[38] !== b ? (L = (B) => "id" in B ? b.get({ key: B.id }) : b.get(B), e[38] = b, e[39] = L) : L = e[39];
  let j;
  e[40] !== r ? (j = () => r, e[40] = r, e[41] = j) : j = e[41];
  let G;
  return e[42] !== M || e[43] !== R || e[44] !== P || e[45] !== x || e[46] !== T || e[47] !== D || e[48] !== N || e[49] !== O || e[50] !== L || e[51] !== j || e[52] !== E || e[53] !== y ? (G = {
    getState: E,
    composer: y,
    delete: M,
    reload: R,
    speak: P,
    stopSpeaking: x,
    submitFeedback: T,
    switchToBranch: D,
    getCopyText: N,
    part: O,
    attachment: L,
    setIsCopied: s,
    setIsHovering: l,
    __internal_getRuntime: j
  }, e[42] = M, e[43] = R, e[44] = P, e[45] = x, e[46] = T, e[47] = D, e[48] = N, e[49] = O, e[50] = L, e[51] = j, e[52] = E, e[53] = y, e[54] = G) : G = e[54], G;
}, Cg = le(Sg), Tg = (t) => {
  const e = A(6), { runtime: r, id: n, threadIdRef: i } = t;
  let o;
  e[0] !== n || e[1] !== r ? (o = r.getMessageById(n), e[0] = n, e[1] = r, e[2] = o) : o = e[2];
  const s = o;
  let a;
  return e[3] !== s || e[4] !== i ? (a = Cg({
    runtime: s,
    threadIdRef: i
  }), e[3] = s, e[4] = i, e[5] = a) : a = e[5], Ne(a);
}, Ig = le(Tg), Eg = (t) => {
  const e = A(58), { runtime: r } = t, n = Wt(r), i = Po();
  let o, s;
  e[0] !== i || e[1] !== r ? (o = () => {
    const E = [];
    for (const y of [
      "runStart",
      "runEnd",
      "initialize",
      "modelContextUpdate"
    ]) {
      const M = r.unstable_on(y, () => {
        var P;
        const R = ((P = r.getState()) == null ? void 0 : P.threadId) || "unknown";
        i(`thread.${y}`, { threadId: R });
      });
      E.push(M);
    }
    return () => {
      for (const y of E)
        y();
    };
  }, s = [r, i], e[0] = i, e[1] = r, e[2] = o, e[3] = s) : (o = e[2], s = e[3]), Q(o, s);
  let a;
  e[4] !== r ? (a = Qc(() => r.getState().threadId), e[4] = r, e[5] = a) : a = e[5];
  const l = a;
  let c;
  e[6] !== r.composer || e[7] !== l ? (c = Kc({
    runtime: r.composer,
    threadIdRef: l
  }), e[6] = r.composer, e[7] = l, e[8] = c) : c = e[8];
  const d = tn(c);
  let u;
  if (e[9] !== r || e[10] !== n.messages || e[11] !== l) {
    let E;
    e[13] !== r || e[14] !== l ? (E = (y) => rt(y.id, Ig({
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
  const h = Vt(u), p = h.state.length === 0 && !n.isLoading;
  let f;
  e[16] !== d.state || e[17] !== h.state || e[18] !== n.capabilities || e[19] !== n.extras || e[20] !== n.isDisabled || e[21] !== n.isLoading || e[22] !== n.isRunning || e[23] !== n.speech || e[24] !== n.state || e[25] !== n.suggestions || e[26] !== n.voice || e[27] !== p ? (f = {
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
  }, e[16] = d.state, e[17] = h.state, e[18] = n.capabilities, e[19] = n.extras, e[20] = n.isDisabled, e[21] = n.isLoading, e[22] = n.isRunning, e[23] = n.speech, e[24] = n.state, e[25] = n.suggestions, e[26] = n.voice, e[27] = p, e[28] = f) : f = e[28];
  const g = f;
  let v;
  e[29] !== g ? (v = () => g, e[29] = g, e[30] = v) : v = e[30];
  let b;
  e[31] !== d.methods ? (b = () => d.methods, e[31] = d.methods, e[32] = b) : b = e[32];
  let _;
  e[33] !== h ? (_ = (E) => "id" in E ? h.get({ key: E.id }) : h.get(E), e[33] = h, e[34] = _) : _ = e[34];
  let k;
  e[35] !== r ? (k = () => r, e[35] = r, e[36] = k) : k = e[36];
  let I;
  return e[37] !== r.append || e[38] !== r.cancelRun || e[39] !== r.connectVoice || e[40] !== r.deleteMessage || e[41] !== r.disconnectVoice || e[42] !== r.export || e[43] !== r.getModelContext || e[44] !== r.getVoiceVolume || e[45] !== r.import || e[46] !== r.muteVoice || e[47] !== r.reset || e[48] !== r.resumeRun || e[49] !== r.startRun || e[50] !== r.stopSpeaking || e[51] !== r.subscribeVoiceVolume || e[52] !== r.unmuteVoice || e[53] !== _ || e[54] !== k || e[55] !== v || e[56] !== b ? (I = {
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
    message: _,
    __internal_getRuntime: k
  }, e[37] = r.append, e[38] = r.cancelRun, e[39] = r.connectVoice, e[40] = r.deleteMessage, e[41] = r.disconnectVoice, e[42] = r.export, e[43] = r.getModelContext, e[44] = r.getVoiceVolume, e[45] = r.import, e[46] = r.muteVoice, e[47] = r.reset, e[48] = r.resumeRun, e[49] = r.startRun, e[50] = r.stopSpeaking, e[51] = r.subscribeVoiceVolume, e[52] = r.unmuteVoice, e[53] = _, e[54] = k, e[55] = v, e[56] = b, e[57] = I) : I = e[57], I;
}, Ag = le(Eg), Rg = (t) => {
  const e = A(20), { runtime: r } = t, n = Wt(r), i = Po();
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
}, Yc = le(Rg), Pg = (t) => {
  const e = A(5), { runtime: r, id: n } = t;
  let i;
  e[0] !== n || e[1] !== r ? (i = r.getItemById(n), e[0] = n, e[1] = r, e[2] = i) : i = e[2];
  const o = i;
  let s;
  return e[3] !== o ? (s = Yc({ runtime: o }), e[3] = o, e[4] = s) : s = e[4], Ne(s);
}, Mg = le(Pg), Dg = (t) => {
  const e = A(40), { runtime: r, __internal_assistantRuntime: n } = t, i = Wt(r);
  let o;
  e[0] !== r.main ? (o = Ag({ runtime: r.main }), e[0] = r.main, e[1] = o) : o = e[1];
  const s = tn(o);
  let a;
  e[2] !== r || e[3] !== i.threadItems ? (a = Object.keys(i.threadItems).map((y) => rt(y, Mg({
    runtime: r,
    id: y
  }), [r, y])), e[2] = r, e[3] = i.threadItems, e[4] = a) : a = e[4];
  const l = Vt(a), c = i.newThreadId ?? null;
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
  let f;
  e[19] !== u || e[20] !== l ? (f = (y) => {
    if (y === "main")
      return l.get({ key: u.mainThreadId });
    if ("id" in y)
      return l.get({ key: y.id });
    const { index: M, archived: R } = y, P = R !== void 0 && R ? u.archivedThreadIds[M] : u.threadIds[M];
    return l.get({ key: P });
  }, e[19] = u, e[20] = l, e[21] = f) : f = e[21];
  let g, v, b, _, k;
  e[22] !== r ? (_ = async (y, M) => {
    await r.switchToThread(y, M);
  }, k = async () => {
    await r.switchToNewThread();
  }, g = () => r.getLoadThreadsPromise(), v = () => r.reload(), b = () => r.loadMore(), e[22] = r, e[23] = g, e[24] = v, e[25] = b, e[26] = _, e[27] = k) : (g = e[23], v = e[24], b = e[25], _ = e[26], k = e[27]);
  let I;
  e[28] !== n ? (I = () => n, e[28] = n, e[29] = I) : I = e[29];
  let E;
  return e[30] !== g || e[31] !== v || e[32] !== b || e[33] !== I || e[34] !== h || e[35] !== p || e[36] !== f || e[37] !== _ || e[38] !== k ? (E = {
    getState: h,
    thread: p,
    item: f,
    switchToThread: _,
    switchToNewThread: k,
    getLoadThreadsPromise: g,
    reload: v,
    loadMore: b,
    __internal_getAssistantRuntime: I
  }, e[30] = g, e[31] = v, e[32] = b, e[33] = I, e[34] = h, e[35] = p, e[36] = f, e[37] = _, e[38] = k, e[39] = E) : E = e[39], E;
}, Ng = le(Dg), zg = (t) => ({ getState: () => t }), Og = le(zg), Lg = (t) => {
  const e = A(11);
  let r;
  e[0] !== t ? (r = () => ({ suggestions: (t ?? []).map(Bg) }), e[0] = t, e[1] = r) : r = e[1];
  const [n] = ve(r);
  let i;
  e[2] !== n.suggestions ? (i = n.suggestions.map(Fg), e[2] = n.suggestions, e[3] = i) : i = e[3];
  const o = Vt(i);
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
}, $g = le(Lg);
function Bg(t) {
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
function Fg(t, e) {
  return rt(e, Og(t), [t]);
}
const Ug = (t, e) => {
  t.thread ?? (t.thread = Ve({
    source: "threads",
    query: { type: "main" },
    get: (r) => r.threads().thread("main")
  })), t.threadListItem ?? (t.threadListItem = Ve({
    source: "threads",
    query: { type: "main" },
    get: (r) => r.threads().item("main")
  })), t.composer ?? (t.composer = Ve({
    source: "thread",
    query: {},
    get: (r) => r.threads().thread("main").composer()
  })), !t.modelContext && e.modelContext.source === null && (t.modelContext = Dc()), !t.suggestions && e.suggestions.source === null && (t.suggestions = $g());
}, Jc = (t) => {
  const e = A(6), r = qc();
  let n, i;
  e[0] !== r || e[1] !== t ? (n = () => t.registerModelContextProvider(r.current.modelContext()), i = [t, r], e[0] = r, e[1] = t, e[2] = n, e[3] = i) : (n = e[2], i = e[3]), Q(n, i);
  let o;
  return e[4] !== t ? (o = Ng({
    runtime: t.threads,
    __internal_assistantRuntime: t
  }), e[4] = t, e[5] = o) : o = e[5], Ne(o);
}, jg = le(Jc);
Fc(Jc, (t, e) => {
  Ug(t, e), !t.tools && e.tools.source === null && (t.tools = og({})), !t.dataRenderers && e.dataRenderers.source === null && (t.dataRenderers = om());
});
const Vg = (t) => {
  var e;
  return (e = t._core) == null ? void 0 : e.RenderComponent;
}, qg = we(({ runtime: t, aui: e = null, children: r }) => {
  "use no memo";
  const n = J({ threads: jg(t) }, { parent: e }), i = Vg(t), o = /* @__PURE__ */ V(He, {
    value: n,
    children: [i && /* @__PURE__ */ m(i, {}), r]
  });
  return e ? /* @__PURE__ */ m(He, {
    value: e,
    children: o
  }) : o;
}), Us = (t) => {
  let e;
  const r = /* @__PURE__ */ new Set(), n = (c, d) => {
    const u = typeof c == "function" ? c(e) : c;
    if (!Object.is(u, e)) {
      const h = e;
      e = d ?? (typeof u != "object" || u === null) ? u : Object.assign({}, e, u), r.forEach((p) => p(e, h));
    }
  }, i = () => e, a = { setState: n, getState: i, getInitialState: () => l, subscribe: (c) => (r.add(c), () => r.delete(c)) }, l = e = t(n, i, a);
  return a;
}, Hg = (t) => t ? Us(t) : Us, Gg = (t) => t;
function Wg(t, e = Gg) {
  const r = _e.useSyncExternalStore(
    t.subscribe,
    _e.useCallback(() => e(t.getState()), [t, e]),
    _e.useCallback(() => e(t.getInitialState()), [t, e])
  );
  return _e.useDebugValue(r), r;
}
const js = (t) => {
  const e = Hg(t), r = (n) => Wg(e, n);
  return Object.assign(r, e), r;
}, fr = (t) => t ? js(t) : js;
function Te(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function mr(t, e = 0) {
  return e > 100 ? !1 : t === null || typeof t == "string" || typeof t == "boolean" ? !0 : typeof t == "number" ? !Number.isNaN(t) && Number.isFinite(t) : Array.isArray(t) ? t.every((r) => mr(r, e + 1)) : Te(t) ? Object.entries(t).every(([r, n]) => typeof r == "string" && mr(n, e + 1)) : !1;
}
const Kg = 100, Hi = (t, e, r) => {
  if (t === e)
    return !0;
  if (r > Kg || t == null || e == null)
    return !1;
  if (Array.isArray(t))
    return !Array.isArray(e) || t.length !== e.length ? !1 : t.every((o, s) => Hi(o, e[s], r + 1));
  if (Array.isArray(e) || !Te(t) || !Te(e))
    return !1;
  const n = Object.keys(t), i = Object.keys(e);
  return n.length !== i.length ? !1 : n.every((o) => Object.hasOwn(e, o) && Hi(t[o], e[o], r + 1));
}, Xc = (t, e) => !mr(t) || !mr(e) ? !1 : Hi(t, e, 0);
function Qg(t) {
  const e = t.metadata;
  if (!e || typeof e != "object")
    return;
  const r = e.custom;
  if (!r || typeof r != "object")
    return;
  const n = r.interactables;
  return Array.isArray(n) ? n : void 0;
}
function Yg(t) {
  return `update_${t.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
const Vs = (t) => {
  if (!Te(t))
    return;
  const e = t.id;
  return typeof e == "string" || typeof e == "number" ? e : void 0;
};
function Jg(t, e, r) {
  let n = Array.isArray(e.set) ? [...e.set] : [...t];
  if (e.clear === !0 && (n = []), Array.isArray(e.remove) && e.remove.length > 0) {
    const o = new Set(e.remove);
    n = n.filter((s) => {
      const a = Vs(s);
      return a !== void 0 ? !o.has(a) : !o.has(s);
    });
  }
  const i = e.update;
  if (Array.isArray(i) && i.length > 0 && (n = n.map((o) => {
    const s = Vs(o);
    if (s === void 0 || !Te(o))
      return o;
    const a = i.find((l) => Te(l) && l.id === s);
    return a ? {
      ...o,
      ...a
    } : o;
  })), Array.isArray(e.add) && e.add.length > 0) {
    const o = r ? e.add.map((s) => {
      if (!Te(s) || s.id !== void 0)
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
function ui(t, e, r) {
  if (!Te(t) || !Te(e))
    return e;
  const n = Te(r == null ? void 0 : r.arrayBaseline) ? r.arrayBaseline : t, i = { ...t };
  for (const [o, s] of Object.entries(e)) {
    const a = n[o];
    Array.isArray(a) && Te(s) ? i[o] = Jg(a, s, r != null && r.idFactory && (r.idKeyedFields === void 0 || r.idKeyedFields.has(o)) ? () => {
      var l;
      return (l = r.idFactory) == null ? void 0 : l.call(r, o);
    } : void 0) : i[o] = s;
  }
  return i;
}
function Xg(t, e) {
  if (!Te(t) || !Te(e))
    return;
  for (const i of Object.keys(t))
    if (!(i in e))
      return;
  const r = {};
  for (const [i, o] of Object.entries(e))
    (!(i in t) || !Xc(t[i], o)) && (r[i] = o);
  const n = Object.keys(r).length;
  if (!(n === 0 || n === Object.keys(e).length))
    return r;
}
const Zg = (t) => {
  if (!t || typeof t != "object")
    return;
  const e = t;
  return e.type === "tool-call" ? e : void 0;
}, eb = (t, e) => {
  if (!t.args || typeof t.args != "object")
    return !1;
  const r = Te(t.result) ? t.result : void 0;
  if ((r == null ? void 0 : r.success) === !1)
    return !1;
  if (typeof (r == null ? void 0 : r.id) == "string")
    return r.id === e;
  const n = t.args.id;
  return n === e || n === void 0;
}, tb = (t) => {
  const e = Te(t) ? t.addedItemIds : void 0;
  if (!Te(e))
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
}, qs = /* @__PURE__ */ new WeakMap();
function rb(t, e, r) {
  var c;
  let n = qs.get(t);
  n || (n = /* @__PURE__ */ new Map(), qs.set(t, n));
  let i = n.get(r);
  i || (i = /* @__PURE__ */ new Map(), n.set(r, i));
  const o = i.get(e);
  if (o)
    return o;
  const s = Yg(r), a = [], l = () => a[a.length - 1];
  for (const d of t) {
    if (d.role === "user") {
      const u = (c = Qg(d)) == null ? void 0 : c.find((h) => h.id === e);
      if (!u)
        continue;
      if (u.partial) {
        const h = l();
        h && a.push({
          state: ui(h.state, u.state),
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
        const h = Zg(u);
        if (h) {
          if (h.toolCallId === e && h.toolName === r)
            h.args && typeof h.args == "object" && a.push({
              state: h.args,
              origin: "create",
              toolCallId: e
            });
          else if (h.toolName === s && eb(h, e)) {
            const p = l();
            if (p) {
              const { id: f, ...g } = h.args, v = tb(h.result);
              a.push({
                state: v ? ui(p.state, g, { idFactory: v }) : ui(p.state, g),
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
function nb(t, e, r) {
  const n = rb(t, e, r), i = n[n.length - 1];
  return i ? { state: i.state } : void 0;
}
function Zc(t, e) {
  if (!t)
    return;
  const { interactables: r, ...n } = t, i = { ...n };
  if (Array.isArray(r)) {
    const o = [];
    for (const s of r) {
      ({}).NODE_ENV !== "production" && !mr(s.state) && console.warn(`[Interactables] state for "${s.name}" (${s.id}) is not JSON-equatable (an undefined, NaN, Infinity, function, or symbol value?). It will be re-snapshotted on every send, recreating per-message growth. Use plain JSON values.`);
      const a = nb(e, s.id, s.name);
      if (!a) {
        o.push({
          id: s.id,
          name: s.name,
          state: s.state
        });
        continue;
      }
      if (Xc(s.state, a.state))
        continue;
      const l = Xg(a.state, s.state);
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
let eu = (t, e = 21) => (r = e) => {
  let n = "", i = r | 0;
  for (; i-- > 0; )
    n += t[Math.random() * t.length | 0];
  return n;
};
const ib = eu("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
function ob(t) {
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
var Rn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Yn(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var yr = { exports: {} };
const sb = typeof Buffer < "u", Hs = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/, Gs = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
function tu(t, e, r) {
  r == null && e !== null && typeof e == "object" && (r = e, e = void 0), sb && Buffer.isBuffer(t) && (t = t.toString()), t && t.charCodeAt(0) === 65279 && (t = t.slice(1));
  const n = JSON.parse(t, e);
  if (n === null || typeof n != "object")
    return n;
  const i = r && r.protoAction || "error", o = r && r.constructorAction || "error";
  if (i === "ignore" && o === "ignore")
    return n;
  if (i !== "ignore" && o !== "ignore") {
    if (Hs.test(t) === !1 && Gs.test(t) === !1)
      return n;
  } else if (i !== "ignore" && o === "ignore") {
    if (Hs.test(t) === !1)
      return n;
  } else if (Gs.test(t) === !1)
    return n;
  return ru(n, { protoAction: i, constructorAction: o, safe: r && r.safe });
}
function ru(t, { protoAction: e = "error", constructorAction: r = "error", safe: n } = {}) {
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
function Mo(t, e, r) {
  const { stackTraceLimit: n } = Error;
  Error.stackTraceLimit = 0;
  try {
    return tu(t, e, r);
  } finally {
    Error.stackTraceLimit = n;
  }
}
function ab(t, e) {
  const { stackTraceLimit: r } = Error;
  Error.stackTraceLimit = 0;
  try {
    return tu(t, e, { safe: !0 });
  } catch {
    return;
  } finally {
    Error.stackTraceLimit = r;
  }
}
yr.exports = Mo;
yr.exports.default = Mo;
yr.exports.parse = Mo;
yr.exports.safeParse = ab;
yr.exports.scan = ru;
var lb = yr.exports;
const Ws = /* @__PURE__ */ Yn(lb), di = Symbol("aui.parse-partial-json-object.meta"), nu = (t) => {
  if (t.length === 0)
    return { [di]: {
      state: "partial",
      partialPath: []
    } };
  try {
    const e = Ws.parse(t);
    if (typeof e != "object" || e === null)
      throw new Error("argsText is expected to be an object");
    return e[di] = {
      state: "complete",
      partialPath: []
    }, e;
  } catch {
    try {
      const [e, r] = ob(t), n = Ws.parse(e);
      if (typeof n != "object" || n === null)
        throw new Error("argsText is expected to be an object");
      return n[di] = {
        state: "partial",
        partialPath: r
      }, n;
    } catch {
      return;
    }
  }
};
var cb = class lr {
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
}, ub = class {
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
const db = ({ unstable_state: t = null } = {}) => ({
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
}), Jn = (t, e, r) => {
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
}, hb = (t, e) => {
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
}, pb = (t, e) => Jn(t, e, (r) => {
  if (r.type !== "tool-call")
    throw new Error("Last is not a tool call");
  return r.state !== "partial-call" ? r : {
    ...r,
    state: "call"
  };
}), fb = (t, e) => Jn(t, e, (r) => ({
  ...r,
  status: {
    type: "complete",
    reason: "unknown"
  }
})), mb = (t, e) => Jn(t, e, (r) => {
  if (r.type === "text" || r.type === "reasoning")
    return {
      ...r,
      text: r.text + e.textDelta
    };
  if (r.type === "tool-call") {
    const n = r.argsText + e.textDelta, i = nu(n) ?? r.args;
    return {
      ...r,
      argsText: n,
      args: i
    };
  } else
    throw new Error("text-delta received but part is neither text nor tool-call");
}), gb = (t, e) => Jn(t, e, (r) => {
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
}), Ks = (t, e) => {
  var n, i;
  if (((n = t.status) == null ? void 0 : n.type) === "incomplete" && ((i = t.status) == null ? void 0 : i.reason) === "error")
    return t;
  const r = bb(e);
  return {
    ...t,
    status: r
  };
}, bb = (t) => t.finishReason === "tool-calls" ? {
  type: "requires-action",
  reason: "tool-calls"
} : t.finishReason === "stop" || t.finishReason === "unknown" ? {
  type: "complete",
  reason: t.finishReason
} : {
  type: "incomplete",
  reason: t.finishReason
}, vb = (t, e) => ({
  ...t,
  metadata: {
    ...t.metadata,
    unstable_annotations: [...t.metadata.unstable_annotations, ...e.annotations]
  }
}), wb = (t, e) => ({
  ...t,
  metadata: {
    ...t.metadata,
    unstable_data: [...t.metadata.unstable_data, ...e.data]
  }
}), yb = (t, e) => ({
  ...t,
  metadata: {
    ...t.metadata,
    steps: [...t.metadata.steps, {
      state: "started",
      messageId: e.messageId
    }]
  }
}), xb = (t, e) => {
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
    messageId: ib(),
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
}, kb = (t, e) => ({
  ...t,
  status: {
    type: "incomplete",
    reason: "error",
    error: e.error
  }
}), _b = (t, e) => {
  const r = new cb(t.metadata.unstable_state);
  return r.append(e.operations), {
    ...t,
    metadata: {
      ...t.metadata,
      unstable_state: r.state
    }
  };
}, Qs = (t, e) => {
  let r = 0;
  for (const i of e.metadata.steps)
    i.state === "finished" && i.usage && (r += i.usage.outputTokens);
  let n = "";
  for (const i of e.parts)
    (i.type === "text" || i.type === "reasoning") && (n += i.text);
  return t.getTiming(r > 0 ? r : void 0, n || void 0);
}, Sb = (t) => {
  let e = !1;
  return () => {
    e || (e = !0, queueMicrotask(() => {
      e = !1, t();
    }));
  };
};
var Cb = class extends TransformStream {
  constructor({ initialMessage: t, throttle: e, onError: r } = {}) {
    let n = t ?? db();
    const i = new ub();
    let o;
    const s = e ? Sb(() => {
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
            n = hb(n, a), a.part.type === "tool-call" && i.recordToolCallStart(a.part.toolCallId);
            break;
          case "tool-call-args-text-finish":
            n = pb(n, a);
            break;
          case "part-finish":
            n = fb(n, a);
            break;
          case "text-delta":
            n = mb(n, a), i.recordFirstToken();
            break;
          case "result":
            n = gb(n, a);
            break;
          case "message-finish":
            n = Ks(n, a);
            break;
          case "annotations":
            n = vb(n, a);
            break;
          case "data":
            n = wb(n, a);
            break;
          case "step-start":
            n = yb(n, a);
            break;
          case "step-finish":
            n = xb(n, a);
            break;
          case "error":
            n = kb(n, a), r == null || r(a.error);
            break;
          case "update-state":
            n = _b(n, a);
            break;
          default:
            throw new Error(`Unsupported chunk type: ${l}`);
        }
        n.status.type !== "running" && (n = {
          ...n,
          metadata: {
            ...n.metadata,
            timing: Qs(i, n)
          }
        }), s();
      },
      flush(a) {
        var l, c;
        if (((l = n.status) == null ? void 0 : l.type) === "running") {
          const d = ((c = n.parts) == null ? void 0 : c.some((u) => u.type === "tool-call" && (u.state === "call" || u.state === "partial-call") && u.result === void 0)) ?? !1;
          n = Ks(n, {
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
              timing: Qs(i, n)
            }
          }, a.enqueue(n);
        }
      }
    });
  }
}, Tb = class _n {
  constructor(e) {
    C(this, "readable");
    this.readable = e, this.readable = e;
  }
  static fromAssistantStream(e) {
    return new _n(e.pipeThrough(new Cb()));
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
    return [new _n(e), new _n(r)];
  }
};
const Ys = Symbol.for("aui.tool-response");
var Ib = class Gi {
  constructor(e) {
    C(this, "artifact");
    C(this, "result");
    C(this, "isError");
    C(this, "modelContent");
    C(this, "messages");
    e.artifact !== void 0 && (this.artifact = e.artifact), this.result = e.result, this.isError = e.isError ?? !1, e.modelContent !== void 0 && (this.modelContent = e.modelContent), e.messages !== void 0 && (this.messages = e.messages);
  }
  get [Ys]() {
    return !0;
  }
  static [Symbol.hasInstance](e) {
    return typeof e == "object" && e !== null && Ys in e;
  }
  /**
  * Converts a plain tool return value into a {@link ToolResponse}.
  *
  * Existing `ToolResponse` instances are returned unchanged. `undefined`
  * becomes the string `"<no result>"` so downstream protocol chunks always
  * carry a concrete result.
  */
  static toResponse(e) {
    return e instanceof Gi ? e : new Gi({ result: e === void 0 ? "<no result>" : e });
  }
};
const dt = eu("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7), iu = (t) => {
  const e = A(7), { index: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ve({
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
  return e[4] !== s || e[5] !== n ? (a = /* @__PURE__ */ m(He, {
    value: s,
    children: n
  }), e[4] = s, e[5] = n, e[6] = a) : a = e[6], a;
}, ou = (t) => {
  const e = A(7), { index: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ve({
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
  return e[4] !== s || e[5] !== n ? (a = /* @__PURE__ */ m(He, {
    value: s,
    children: n
  }), e[4] = s, e[5] = n, e[6] = a) : a = e[6], a;
}, Eb = (t) => {
  const e = A(7), { runtime: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Yc({ runtime: r }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { threadListItem: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = J(o);
  let a;
  return e[4] !== s || e[5] !== n ? (a = /* @__PURE__ */ m(He, {
    value: s,
    children: n
  }), e[4] = s, e[5] = n, e[6] = a) : a = e[6], a;
}, su = (t) => {
  const e = A(10), { index: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ve({
    source: "thread",
    query: {
      type: "index",
      index: r
    },
    get: (c) => c.thread().message({ index: r })
  }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== r ? (o = Ve({
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
  return e[7] !== a || e[8] !== n ? (l = /* @__PURE__ */ m(He, {
    value: a,
    children: n
  }), e[7] = a, e[8] = n, e[9] = l) : l = e[9], l;
}, Do = (t) => {
  const e = A(7), { index: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ve({
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
  return e[4] !== s || e[5] !== n ? (a = /* @__PURE__ */ m(He, {
    value: s,
    children: n
  }), e[4] = s, e[5] = n, e[6] = a) : a = e[6], a;
}, Ab = (t) => {
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
    addToolResult: Pb,
    resumeToolCall: Mb,
    respondToToolApproval: Db
  }, e[5] = s, e[6] = a) : a = e[6], a;
}, Rb = le(Ab), No = (t) => {
  const e = A(8), { text: r, isRunning: n, children: i } = t, o = n === void 0 ? !1 : n;
  let s;
  e[0] !== o || e[1] !== r ? (s = Rb({
    text: r,
    isRunning: o
  }), e[0] = o, e[1] = r, e[2] = s) : s = e[2];
  let a;
  e[3] !== s ? (a = { part: s }, e[3] = s, e[4] = a) : a = e[4];
  const l = J(a);
  let c;
  return e[5] !== l || e[6] !== i ? (c = /* @__PURE__ */ m(He, {
    value: l,
    children: i
  }), e[5] = l, e[6] = i, e[7] = c) : c = e[7], c;
};
function Pb() {
  throw new Error("Not supported");
}
function Mb() {
  throw new Error("Not supported");
}
function Db() {
  throw new Error("Not supported");
}
const Nb = Object.freeze({ type: "complete" }), zb = (t) => {
  var u;
  const e = A(9), { parts: r, getMessagePart: n } = t, [i, o] = ve(!0), s = ((u = r[r.length - 1]) == null ? void 0 : u.status) ?? Nb;
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
}, Ob = le(zb), Lb = (t) => {
  const e = A(5), { startIndex: r, endIndex: n, children: i } = t, o = $($b).slice(r, n + 1), s = J(), a = Ob({
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
  return e[2] !== c || e[3] !== i ? (d = /* @__PURE__ */ m(He, {
    value: c,
    children: i
  }), e[2] = c, e[3] = i, e[4] = d) : d = e[4], d;
};
function $b(t) {
  return t.message.parts;
}
const au = (t) => {
  const e = A(7), { index: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ve({
    source: "suggestions",
    query: { index: r },
    get: (l) => l.suggestions().suggestion({ index: r })
  }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { suggestion: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = J(o);
  let a;
  return e[4] !== s || e[5] !== n ? (a = /* @__PURE__ */ m(He, {
    value: s,
    children: n
  }), e[4] = s, e[5] = n, e[6] = a) : a = e[6], a;
}, Bb = (t) => {
  const e = A(7), { index: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ve({
    source: "composer",
    query: { index: r },
    get: (l) => l.composer().queueItem({ index: r })
  }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== i ? (o = { queueItem: i }, e[2] = i, e[3] = o) : o = e[3];
  const s = J(o);
  let a;
  return e[4] !== s || e[5] !== n ? (a = /* @__PURE__ */ m(He, {
    value: s,
    children: n
  }), e[4] = s, e[5] = n, e[6] = a) : a = e[6], a;
}, Pn = Symbol("innerMessage"), nt = Symbol("skip-update");
function Fb(t, e) {
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
var rn = class {
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
}, Xn = class {
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
}, et = class extends Xn {
  constructor(e) {
    super();
    C(this, "binding");
    C(this, "_previousState");
    C(this, "getState", () => (this.isConnected || this._syncState(), this._previousState));
    this.binding = e;
    const r = e.getState();
    if (r === nt)
      throw new Error("Entry not available in the store");
    this._previousState = r;
  }
  get path() {
    return this.binding.path;
  }
  _syncState() {
    const e = this.binding.getState();
    return e === nt || Fb(e, this._previousState) ? !1 : (this._previousState = e, !0);
  }
  _connect() {
    const e = () => {
      this._syncState() && this.notifySubscribers();
    };
    return this.binding.subscribe(e);
  }
}, zo = class extends Xn {
  constructor(e) {
    super();
    C(this, "binding");
    C(this, "_previousStateDirty", !0);
    C(this, "_previousState");
    C(this, "getState", () => {
      if (!this.isConnected || this._previousStateDirty) {
        const e = this.binding.getState();
        e !== nt && (this._previousState = e), this._previousStateDirty = !1;
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
}, Mn = class extends Xn {
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
}, lu = class extends Xn {
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
}, cu = class {
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
}, uu = class extends cu {
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
}, Ub = class extends uu {
  get source() {
    return "thread-composer";
  }
}, jb = class extends uu {
  get source() {
    return "edit-composer";
  }
}, Vb = class extends cu {
  get source() {
    return "message";
  }
  remove() {
    throw new Error("Message attachments cannot be removed");
  }
};
const Dn = Object.freeze([]), du = Object.freeze({}), qb = (t) => Object.freeze({
  type: "thread",
  isEditing: (t == null ? void 0 : t.isEditing) ?? !1,
  canCancel: (t == null ? void 0 : t.canCancel) ?? !1,
  canSend: (t == null ? void 0 : t.canSend) ?? !1,
  isEmpty: (t == null ? void 0 : t.isEmpty) ?? !0,
  attachments: (t == null ? void 0 : t.attachments) ?? Dn,
  text: (t == null ? void 0 : t.text) ?? "",
  role: (t == null ? void 0 : t.role) ?? "user",
  runConfig: (t == null ? void 0 : t.runConfig) ?? du,
  attachmentAccept: (t == null ? void 0 : t.attachmentAccept) ?? "",
  dictation: t == null ? void 0 : t.dictation,
  quote: t == null ? void 0 : t.quote,
  queue: (t == null ? void 0 : t.queue) ?? Dn,
  value: (t == null ? void 0 : t.text) ?? ""
}), Hb = (t) => Object.freeze({
  type: "edit",
  isEditing: (t == null ? void 0 : t.isEditing) ?? !1,
  canCancel: (t == null ? void 0 : t.canCancel) ?? !1,
  canSend: (t == null ? void 0 : t.canSend) ?? !1,
  isEmpty: (t == null ? void 0 : t.isEmpty) ?? !0,
  text: (t == null ? void 0 : t.text) ?? "",
  role: (t == null ? void 0 : t.role) ?? "user",
  attachments: (t == null ? void 0 : t.attachments) ?? Dn,
  runConfig: (t == null ? void 0 : t.runConfig) ?? du,
  attachmentAccept: (t == null ? void 0 : t.attachmentAccept) ?? "",
  dictation: t == null ? void 0 : t.dictation,
  quote: t == null ? void 0 : t.quote,
  queue: (t == null ? void 0 : t.queue) ?? Dn,
  parentId: (t == null ? void 0 : t.parentId) ?? null,
  sourceId: (t == null ? void 0 : t.sourceId) ?? null,
  value: (t == null ? void 0 : t.text) ?? ""
});
var hu = class {
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
    return r || (r = new lu({
      event: t,
      binding: this._core
    }), this._eventSubscriptionSubjects.set(t, r)), r.subscribe(e);
  }
}, Gb = class extends hu {
  constructor(e) {
    const r = new zo({
      path: e.path,
      getState: () => qb(e.getState()),
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
    return new Ub(new et({
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
        } : nt;
      },
      subscribe: (r) => this._core.subscribe(r)
    }), this._core);
  }
}, Wb = class extends hu {
  constructor(e, r) {
    const n = new zo({
      path: e.path,
      getState: () => Hb(e.getState()),
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
    return new jb(new et({
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
        } : nt;
      },
      subscribe: (r) => this._core.subscribe(r)
    }), this._core);
  }
};
const Hr = (t) => t.content.filter((e) => e.type === "text").map((e) => e.text).join(`

`), Js = {
  "allow-once": !0,
  "allow-always": !0,
  "reject-once": !1,
  "reject-always": !1
}, Kb = (t, e) => {
  var i;
  let r, n;
  if ("optionId" in e) {
    const o = (i = t.options) == null ? void 0 : i.find((s) => s.id === e.optionId);
    if (!o)
      throw new Error(`Tool approval has no option with id "${e.optionId}"`);
    if ("approved" in e)
      r = e.approved;
    else {
      if (!Object.hasOwn(Js, o.kind))
        throw new Error(`Tool approval option "${o.id}" has a custom kind "${o.kind}"; respond with an explicit approved value instead`);
      r = Js[o.kind];
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
var Xs = class {
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
    const n = e.toolName, i = e.toolCallId, o = Ib.toResponse(t);
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
    this.threadApi.getState().respondToToolApproval(Kb(e.approval, t));
  }
  subscribe(t) {
    return this.contentBinding.subscribe(t);
  }
};
const un = Object.freeze({ type: "complete" }), Qb = (t, e, r) => {
  if (t.role !== "assistant")
    return un;
  if (r.type === "tool-call")
    return r.result ? un : t.status;
  const n = e === Math.max(0, t.content.length - 1);
  return t.status.type === "requires-action" ? un : n ? t.status : un;
}, Zs = (t, e) => {
  const r = t.content[e];
  if (!r)
    return nt;
  const n = Qb(t, e, r);
  return Object.freeze({
    ...r,
    [Pn]: r[Pn],
    status: n
  });
};
var Yb = class {
  constructor(t, e) {
    C(this, "_core");
    C(this, "_threadBinding");
    C(this, "composer");
    C(this, "_getEditComposerRuntimeCore", () => this._threadBinding.getState().getEditComposer(this._core.getState().id));
    this._core = t, this._threadBinding = e, this.composer = new Wb(new Mn({
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
    return Hr(this.getState());
  }
  subscribe(t) {
    return this._core.subscribe(t);
  }
  getMessagePartByIndex(t) {
    if (t < 0)
      throw new Error("Message part index must be >= 0");
    return new Xs(new et({
      path: {
        ...this.path,
        ref: `${this.path.ref}${this.path.ref}.content[${t}]`,
        messagePartSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => Zs(this.getState(), t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getMessagePartByToolCallId(t) {
    return new Xs(new et({
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
        return r === -1 ? nt : Zs(e, r);
      },
      subscribe: (e) => this._core.subscribe(e)
    }), this._core, this._threadBinding);
  }
  getAttachmentByIndex(t) {
    return new Vb(new et({
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
        } : nt;
      },
      subscribe: (e) => this._core.subscribe(e)
    }));
  }
};
const Jb = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {},
  ...t.stream ? { stream: t.stream } : {}
}), Xb = (t) => ({
  parentId: t.parentId ?? null,
  sourceId: t.sourceId ?? null,
  runConfig: t.runConfig ?? {}
}), Zb = (t, e) => {
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
}, ev = (t, e) => {
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
var pu = class {
  constructor(t, e) {
    C(this, "_threadBinding");
    C(this, "composer");
    C(this, "_eventSubscriptionSubjects", /* @__PURE__ */ new Map());
    const r = new et({
      path: t.path,
      getState: () => ev(t.getState(), e.getState()),
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
    }, this.composer = new Gb(new Mn({
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
    this._threadBinding.getState().append(Zb(this._threadBinding.getState().messages, t));
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
    return this._threadBinding.getState().startRun(Xb(t));
  }
  resumeRun(t) {
    return this._threadBinding.getState().resumeRun(Jb(t));
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
    return new Yb(new et({
      path: t,
      getState: () => {
        var l;
        const { message: r, parentId: n, index: i } = e() ?? {}, { messages: o, speech: s } = this._threadBinding.getState();
        if (!r || n === void 0 || i === void 0)
          return nt;
        const a = this._threadBinding.getState().getBranches(r.id);
        return {
          ...r,
          [Pn]: r[Pn],
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
    return r || (r = new lu({
      event: t,
      binding: this._threadBinding
    }), this._eventSubscriptionSubjects.set(t, r)), r.subscribe(e);
  }
};
const Wi = Ke(null), fu = (t) => {
  const e = A(6), { adapters: r, children: n } = t, i = Qe(Wi);
  let o;
  e[0] !== r || e[1] !== i ? (o = {
    ...i,
    ...r
  }, e[0] = r, e[1] = i, e[2] = o) : o = e[2];
  const s = o;
  let a;
  return e[3] !== n || e[4] !== s ? (a = /* @__PURE__ */ m(Wi.Provider, {
    value: s,
    children: n
  }), e[3] = n, e[4] = s, e[5] = a) : a = e[5], a;
}, tv = () => Qe(Wi);
var dn = class {
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
const ea = Promise.resolve(), rv = (t) => ({
  mainThreadId: t.mainThreadId,
  newThreadId: t.newThreadId,
  threadIds: t.threadIds,
  archivedThreadIds: t.archivedThreadIds,
  isLoading: t.isLoading,
  isLoadingMore: t.isLoadingMore ?? !1,
  hasMore: t.hasMore ?? !1,
  threadItems: t.threadItems
}), hn = (t, e) => {
  if (e === void 0)
    return nt;
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
  } : nt;
};
var mu = class {
  constructor(t, e = pu) {
    C(this, "_core");
    C(this, "_runtimeFactory");
    C(this, "_getState");
    C(this, "_mainThreadListItemRuntime");
    C(this, "main");
    this._core = t, this._runtimeFactory = e;
    const r = new zo({
      path: {},
      getState: () => rv(t),
      subscribe: (n) => t.subscribe(n)
    });
    this._getState = r.getState.bind(r), this._mainThreadListItemRuntime = new dn(new et({
      path: {
        ref: "threadItems[main]",
        threadSelector: { type: "main" }
      },
      getState: () => hn(this._core, this._core.mainThreadId),
      subscribe: (n) => this._core.subscribe(n)
    }), this._core), this.main = new e(new Mn({
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
    return ((e = (t = this._core).reload) == null ? void 0 : e.call(t)) ?? ea;
  }
  loadMore() {
    var t, e;
    return ((e = (t = this._core).loadMore) == null ? void 0 : e.call(t)) ?? ea;
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
    return new this._runtimeFactory(new Mn({
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
    return new dn(new et({
      path: {
        ref: `threadItems[${t}]`,
        threadSelector: {
          type: "index",
          index: t
        }
      },
      getState: () => hn(this._core, this._core.threadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getArchivedItemByIndex(t) {
    return new dn(new et({
      path: {
        ref: `archivedThreadItems[${t}]`,
        threadSelector: {
          type: "archiveIndex",
          index: t
        }
      },
      getState: () => hn(this._core, this._core.archivedThreadIds[t]),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
  getItemById(t) {
    return new dn(new et({
      path: {
        ref: `threadItems[threadId=${t}]`,
        threadSelector: {
          type: "threadId",
          threadId: t
        }
      },
      getState: () => hn(this._core, t),
      subscribe: (e) => this._core.subscribe(e)
    }), this._core);
  }
}, Oo = class {
  constructor(t) {
    C(this, "_core");
    C(this, "threads");
    C(this, "_thread");
    this._core = t, this.threads = new mu(t.threads), this._thread = this.threads.main, this.__internal_bindMethods();
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
}, Lo = class {
  constructor() {
    C(this, "_contextProvider", new Eo());
  }
  registerModelContextProvider(t) {
    return this._contextProvider.registerModelContextProvider(t);
  }
  getModelContextProvider() {
    return this._contextProvider;
  }
};
const hi = (t, e) => {
  if (t.startsWith("data-"))
    return {
      type: "data",
      name: t.substring(5),
      data: e
    };
}, Nn = (t, e, r) => {
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
          var f;
          const p = h.type;
          switch (p) {
            case "text":
            case "reasoning":
              return (f = h.text) != null && f.trim() ? h : null;
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
              const { parentId: g, messages: v, ...b } = h, _ = {
                ...b,
                toolCallId: h.toolCallId ?? `tool-${dt()}`,
                ...g !== void 0 && { parentId: g },
                ...v !== void 0 && { messages: v }
              };
              return h.args ? {
                ..._,
                args: h.args,
                argsText: h.argsText ?? JSON.stringify(h.args)
              } : {
                ..._,
                args: nu(h.argsText ?? "") ?? {},
                argsText: h.argsText ?? ""
              };
            }
            default: {
              const g = hi(p, h.data);
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
              const f = hi(p, h.data);
              if (f)
                return f;
              throw new Error(`Unsupported user message part type: ${p}`);
            }
          }
        }),
        attachments: (s ?? []).map((h) => ({
          ...h,
          content: h.content.map((p) => hi(p.type, p.data) ?? p)
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
}, nn = Symbol("autoStatus"), nv = Object.freeze(Object.assign({ type: "running" }, { [nn]: !0 })), iv = Object.freeze(Object.assign({
  type: "complete",
  reason: "unknown"
}, { [nn]: !0 })), ov = Object.freeze(Object.assign({
  type: "requires-action",
  reason: "tool-calls"
}, { [nn]: !0 })), sv = Object.freeze(Object.assign({
  type: "requires-action",
  reason: "interrupt"
}, { [nn]: !0 })), Ki = (t, e, r, n, i) => t && i ? Object.assign({
  type: "incomplete",
  reason: "error",
  error: i
}, { [nn]: !0 }) : t && e ? nv : r ? sv : n ? ov : iv, gu = {
  fromArray: (t) => {
    const e = t.map((r) => Nn(r, dt(), Ki(!1, !1, !1, !1, void 0)));
    return { messages: e.map((r, n) => ({
      parentId: n > 0 ? e[n - 1].id : null,
      message: r
    })) };
  },
  fromBranchableArray: (t, e) => {
    const r = Ki(!1, !1, !1, !1, void 0);
    return {
      ...(e == null ? void 0 : e.headId) !== void 0 ? { headId: e.headId } : void 0,
      messages: t.map(({ message: n, parentId: i }) => {
        if (!n.id)
          throw new Error("ExportedMessageRepository.fromBranchableArray: Each message must have an 'id' field set.");
        return {
          parentId: i,
          message: Nn(n, n.id, r)
        };
      })
    };
  }
}, Sn = (t) => t.next ? Sn(t.next) : "current" in t ? t : null;
var av = class {
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
}, bu = class {
  constructor() {
    C(this, "messages", /* @__PURE__ */ new Map());
    C(this, "head", null);
    C(this, "root", {
      children: [],
      next: null
    });
    C(this, "_messages", new av(() => {
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
        i.children = [...i.children, e.current.id], (Sn(e) === this.head || i.next === null) && (i.next = e), e.prev = t;
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
    this.performOp(null, r, "cut"), this.messages.delete(t), this.head === r && (this.head = Sn(n ?? this.root)), this._messages.dirty();
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
    n.next = e, this.head = Sn(e), this.evictOffBranchOptimisticMessages(r, this.head), this._messages.dirty();
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
const Gr = Object.freeze([]);
function ta(t, e) {
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
function lv(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.id === e[n].id);
}
function cv(t) {
  const e = dt();
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
function uv(t) {
  const e = [];
  for (const r of t)
    r.type !== "text" && e.push(cv(r));
  return e;
}
const pi = (t) => t.status.type === "complete";
var vu = class extends rn {
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
      const r = this._attachments.filter((n) => !pi(n));
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
      if (pi(a))
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
    return Gr;
  }
  steerQueueItem(e) {
  }
  removeQueueItem(e) {
  }
  async addAttachment(e) {
    if (!(e instanceof File)) {
      const o = this.getAttachmentAdapter();
      if (o && !ta({
        name: e.name,
        type: e.contentType ?? ""
      }, o.accept)) {
        const a = `File type ${e.contentType || "unknown"} is not accepted. Accepted types: ${o.accept}`, l = new Error(a);
        throw this._safeEmitAttachmentAddError("not-accepted", a, void 0, l), l;
      }
      const s = {
        id: e.id ?? dt(),
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
    if (!ta({
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
    if (!pi(n)) {
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
}, wu = class extends vu {
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
    return ((r = (e = this.runtime).getQueueItems) == null ? void 0 : r.call(e)) ?? Gr;
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
    const n = Zc(this.runtime.getModelContext().unstable_composerMetadata, this.runtime.messages), i = this.enrichWithComposerMetadata(e, n);
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
}, dv = class extends vu {
  constructor(e, r, { parentId: n, message: i }) {
    super();
    C(this, "runtime");
    C(this, "endEditCallback");
    C(this, "_previousText");
    C(this, "_previousAttachments");
    C(this, "_nonTextPassthrough");
    C(this, "_parentId");
    C(this, "_sourceId");
    this.runtime = e, this.endEditCallback = r, this._parentId = n, this._sourceId = i.id, this._previousText = Hr(i), this.setText(this._previousText), this.setRole(i.role), i.role === "user" ? (this._previousAttachments = [...i.attachments ?? [], ...uv(i.content)], this._nonTextPassthrough = []) : (this._previousAttachments = i.attachments ?? [], this._nonTextPassthrough = i.content.filter((o) => o.type !== "text")), this.setAttachments(this._previousAttachments), this.setRunConfig({ ...e.composer.runConfig });
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
    const n = Hr(e), i = !lv(e.attachments ?? [], this._previousAttachments);
    if (n !== this._previousText || i || r != null && r.startRun) {
      const o = this._nonTextPassthrough.length > 0 ? [...e.content, ...this._nonTextPassthrough] : e.content, s = this.runtime.messages, a = this._parentId === null ? -1 : s.findIndex((d) => d.id === this._parentId), l = Zc(this.runtime.getModelContext().unstable_composerMetadata, s.slice(0, a + 1)), c = this.enrichWithComposerMetadata(e, l);
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
}, hv = class {
  constructor(t) {
    C(this, "_contextProvider");
    C(this, "_subscriptions", /* @__PURE__ */ new Set());
    C(this, "_isInitialized", !1);
    C(this, "repository", new bu());
    C(this, "_voiceMessages", []);
    C(this, "_voiceGeneration", 0);
    C(this, "_cachedMergedMessages", null);
    C(this, "_cachedVoiceGeneration", -1);
    C(this, "_cachedMergedBase", null);
    C(this, "composer", new wu(this));
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
    this._editComposers.set(t, new dv(this, () => this._editComposers.delete(t), this.repository.getMessage(t))), this._notifySubscribers();
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
    const n = e.speak(Hr(r)), i = n.subscribe(() => {
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
        id: dt(),
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
          id: dt(),
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
    this.import(gu.fromArray(t ?? []));
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
const pv = (t) => {
  const e = A(3), { detectorRef: r } = t;
  let n, i;
  return e[0] !== r ? (n = () => {
    r.current = !0;
  }, i = [r], e[0] = r, e[1] = n, e[2] = i) : (n = e[1], i = e[2]), jr(n, i), null;
};
var fv = class extends rn {
  constructor(e, r) {
    super();
    C(this, "useRuntimeHook");
    C(this, "instances", /* @__PURE__ */ new Map());
    C(this, "useAliveThreadsKeysChanged", fr(() => ({})));
    C(this, "parent");
    C(this, "_RuntimeBinder", ({ threadId: e, children: r }) => {
      const { useRuntime: n } = this.useRuntimeHook(), i = n(), o = i.thread.__internal_threadBinding, s = _t(() => {
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
      })), [i, l]), /* @__PURE__ */ m(it, { children: r });
    });
    C(this, "_OuterActiveThreadProvider", we(({ threadId: e, provider: r }) => {
      const n = ce(() => new mu(this.parent).getItemById(e), [e]), i = Z(!1);
      return Q(() => {
        if ({}.NODE_ENV !== "production" && r !== Ft) {
          const o = setTimeout(() => {
            i.current || console.warn("RemoteThreadListAdapter.unstable_Provider did not render its `children` synchronously. Render `children` on first commit; deferring them behind a loading state, Suspense boundary, or `useEffect` gate strands the runtime binder and leaves the thread without context.");
          }, 100);
          return () => clearTimeout(o);
        }
      }, [r]), /* @__PURE__ */ m(Eb, {
        runtime: n,
        children: /* @__PURE__ */ m(r, { children: /* @__PURE__ */ m(this._RuntimeBinder, {
          threadId: e,
          children: /* @__PURE__ */ m(pv, { detectorRef: i })
        }) })
      });
    }));
    C(this, "__internal_RenderThreadRuntimes", ({ provider: e }) => (this.useAliveThreadsKeysChanged(), Array.from(this.instances.keys()).map((r) => /* @__PURE__ */ m(this._OuterActiveThreadProvider, {
      threadId: r,
      provider: e
    }, r))));
    this.parent = r, this.useRuntimeHook = fr(() => ({ useRuntime: e }));
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
const ra = (t, e, r) => r.reduce((n, i) => (i == null ? void 0 : i(n, e)) ?? n, t);
var mv = class extends rn {
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
    this._cachedValue = this._pendingTransforms.reduce((e, r) => ra(e, r.task, [r.loading, r.optimistic]), this._baseValue), this._notifySubscribers();
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
      this._baseValue = ra(this._baseValue, i, [e.optimistic, e.then]);
      for (const o of this._completedOptimistics)
        this._baseValue = o(this._baseValue);
      return e.optimistic && this._completedOptimistics.push(e.optimistic), i;
    } finally {
      const i = this._pendingTransforms.indexOf(n);
      i > -1 && this._pendingTransforms.splice(i, 1), this._pendingTransforms.length === 0 && (this._completedOptimistics.length = 0), this._updateState();
    }
  }
};
const ue = /* @__PURE__ */ new Error("This is the empty thread, a placeholder for the main thread. You cannot perform any actions on this thread instance. This error is probably because you tried to call a thread method in your render function. Call the method inside a `useEffect` hook instead."), gv = {
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
const na = (t) => t || void 0, ia = (t, e) => {
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
}, zt = (t, e) => {
  const r = t.threadIdMap[e];
  if (r !== void 0)
    return t.threadData[r];
}, pn = (t, e, r) => {
  const n = zt(t, e);
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
var bv = class extends rn {
  constructor(e, r) {
    super();
    C(this, "_options");
    C(this, "_hookManager");
    C(this, "_loadThreadsPromise");
    C(this, "_loadMorePromise");
    C(this, "_loadGeneration", 0);
    C(this, "_mainThreadId");
    C(this, "_state", new mv({
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
        optimistic: (r) => pn(r, e, "regular"),
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
          const o = zt(r, e);
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
      const o = i.messages, s = await this._options.adapter.generateTitle(n, o), a = Tb.fromAssistantStream(s);
      for await (const c of a) {
        const d = (l = c.parts.filter((p) => p.type === "text")[0]) == null ? void 0 : l.text, u = this._state.baseValue, h = zt(u, r.id);
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
    C(this, "useBoundIds", fr(() => []));
    C(this, "__internal_RenderComponent", () => {
      const e = vo();
      Q(() => (this.useBoundIds.setState((o) => [...o, e], !0), () => {
        this.useBoundIds.setState((o) => o.filter((s) => s !== e), !0);
      }), [e]);
      const r = this.useBoundIds(), { Provider: n } = this.useProvider(), i = { modelContext: this.contextProvider };
      return (r.length === 0 || r[0] === e) && /* @__PURE__ */ m(fu, {
        adapters: i,
        children: /* @__PURE__ */ m(this._hookManager.__internal_RenderThreadRuntimes, { provider: n })
      });
    });
    this.contextProvider = r, this._state.subscribe(() => {
      this._notifySubscribers(), this._notifyThreadIdChange();
    }), this._hookManager = new fv(e.runtimeHook, this), this.useProvider = fr(() => ({ Provider: e.adapter.unstable_Provider ?? Ft })), this.__internal_setOptions(e), this.switchToNewThread();
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
          const i = ia(n.threads, {
            threadIds: [],
            archivedThreadIds: [],
            threadIdMap: {},
            threadData: {}
          });
          return {
            ...r,
            isLoading: !1,
            cursor: na(n.nextCursor),
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
        const l = ia(a.threads, {
          threadIds: [...s.threadIds],
          archivedThreadIds: [...s.archivedThreadIds],
          threadIdMap: { ...s.threadIdMap },
          threadData: { ...s.threadData }
        });
        return {
          ...s,
          isLoadingMore: !1,
          cursor: na(a.nextCursor),
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
    const n = e.adapter.unstable_Provider ?? Ft;
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
      return (e = zt(this._state.value, this._mainThreadId)) == null ? void 0 : e.remoteId;
  }
  _notifyThreadIdChange() {
    var r, n;
    const e = this._mainThreadRemoteId;
    this._lastNotifiedThreadId !== e && (this._lastNotifiedThreadId = e, (n = (r = this._options).onThreadIdChange) == null || n.call(r, e));
  }
  getMainThreadRuntimeCore() {
    const e = this._hookManager.getThreadRuntimeCore(this._mainThreadId);
    return e || gv;
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
    return zt(this._state.value, e);
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
      }, d = s.threadIds.filter((f) => f !== o.remoteId), u = s.archivedThreadIds.filter((f) => f !== o.remoteId), h = o.status === "regular" ? [...d, o.remoteId] : d, p = o.status === "archived" ? [...u, o.remoteId] : u;
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
        r = `__LOCALID_${dt()}`;
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
        const o = zt(i, e);
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
        const o = zt(i, e);
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
      optimistic: (n) => pn(n, r.id, "archived")
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
      optimistic: (n) => pn(n, r.id, "regular")
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
      optimistic: (n) => pn(n, r.id, "deleted")
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
}, vv = class extends Lo {
  constructor(e) {
    super();
    C(this, "threads");
    this.threads = new bv(e, this._contextProvider);
  }
  get RenderComponent() {
    return this.threads.__internal_RenderComponent;
  }
};
const wv = (t) => {
  const e = A(10);
  let r;
  e[0] !== t ? (r = () => new vv(t), e[0] = t, e[1] = r) : r = e[1];
  const [n] = ve(r);
  let i;
  e[2] !== t || e[3] !== n.threads ? (i = () => {
    n.threads.__internal_setOptions(t), n.threads.__internal_load();
  }, e[2] = t, e[3] = n.threads, e[4] = i) : i = e[4];
  let o;
  e[5] !== t || e[6] !== n ? (o = [n, t], e[5] = t, e[6] = n, e[7] = o) : o = e[7], Q(i, o);
  let s;
  return e[8] !== n ? (s = new Oo(n), e[8] = n, e[9] = s) : s = e[9], s;
}, yv = (t) => {
  const e = Z(t.runtimeHook);
  e.current = t.runtimeHook;
  const r = Z(t.threadId ?? t.initialThreadId), n = _t(() => e.current(), []), i = je((l) => {
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
  const s = wv(o), a = Z(t.threadId);
  return Q(() => {
    t.threadId !== a.current && (a.current = t.threadId, t.threadId ? s.threads.switchToThread(t.threadId).catch(() => {
    }) : s.threads.switchToNewThread().catch(() => {
    }));
  }, [s, t.threadId]), s;
};
function xv(t) {
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
          return mr(n.result) || console.warn(`tool-call result is not JSON! ${JSON.stringify(n)}`), {
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
function kv(t) {
  const e = t.content, r = Nn({
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
const oa = (t) => {
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
var Yr, nc, yu = (nc = class {
  constructor(t) {
    C(this, "strategy", "jwt");
    C(this, "cachedToken", null);
    C(this, "tokenExpiry", null);
    Rr(this, Yr, void 0);
    Pr(this, Yr, t);
  }
  async getAuthHeaders() {
    const t = Date.now();
    if (this.cachedToken && this.tokenExpiry && this.tokenExpiry - t > 30 * 1e3)
      return { Authorization: `Bearer ${this.cachedToken}` };
    const e = await Ar(this, Yr).call(this);
    return e ? (this.cachedToken = e, this.tokenExpiry = oa(e), { Authorization: `Bearer ${e}` }) : !1;
  }
  readAuthHeaders(t) {
    const e = t.get("Authorization");
    if (!e)
      return;
    const [r, n] = e.split(" ");
    if (r !== "Bearer" || !n)
      throw new Error("Invalid auth header received");
    this.cachedToken = n, this.tokenExpiry = oa(n);
  }
}, Yr = new WeakMap(), nc), Jr, Xr, Zr, ic, _v = (ic = class {
  constructor(t, e, r) {
    C(this, "strategy", "api-key");
    Rr(this, Jr, void 0);
    Rr(this, Xr, void 0);
    Rr(this, Zr, void 0);
    Pr(this, Jr, t), Pr(this, Xr, e), Pr(this, Zr, r);
  }
  async getAuthHeaders() {
    return {
      Authorization: `Bearer ${Ar(this, Jr)}`,
      "Aui-User-Id": Ar(this, Xr),
      "Aui-Workspace-Id": Ar(this, Zr)
    };
  }
  readAuthHeaders() {
  }
}, Jr = new WeakMap(), Xr = new WeakMap(), Zr = new WeakMap(), ic);
const fn = "aui:refresh_token";
var Sv = class {
  constructor(t) {
    C(this, "strategy", "anon");
    C(this, "baseUrl");
    C(this, "jwtStrategy");
    this.baseUrl = t, this.jwtStrategy = new yu(async () => {
      const e = Date.now(), r = localStorage.getItem(fn), n = r ? JSON.parse(r) : void 0;
      if (n)
        if (new Date(n.expires_at).getTime() - e > 30 * 1e3) {
          const a = await fetch(`${this.baseUrl}/v1/auth/tokens/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: n.token })
          });
          if (a.ok) {
            const { access_token: l, refresh_token: c } = await a.json();
            return c && localStorage.setItem(fn, JSON.stringify(c)), l;
          }
        } else
          localStorage.removeItem(fn);
      const i = await fetch(`${this.baseUrl}/v1/auth/tokens/anonymous`, { method: "POST" });
      if (!i.ok)
        return null;
      const { access_token: o, refresh_token: s } = await i.json();
      return !o || !s ? null : (localStorage.setItem(fn, JSON.stringify(s)), o);
    });
  }
  async getAuthHeaders() {
    return this.jwtStrategy.getAuthHeaders();
  }
  readAuthHeaders(t) {
    this.jwtStrategy.readAuthHeaders(t);
  }
}, sa = class extends Error {
  constructor(t) {
    super(t), this.name = "APIError";
  }
}, Cv = class {
  constructor(t) {
    C(this, "_auth");
    C(this, "_baseUrl");
    if ("authToken" in t)
      this._baseUrl = t.baseUrl, this._auth = new yu(t.authToken);
    else if ("apiKey" in t)
      this._baseUrl = (t.baseUrl ?? "https://backend.assistant-api.com").replace(/\/$/, ""), this._auth = new _v(t.apiKey, t.userId, t.workspaceId);
    else if ("anonymous" in t)
      this._baseUrl = t.baseUrl, this._auth = new Sv(t.baseUrl);
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
        throw new sa(JSON.parse(a).message);
      } catch (l) {
        throw l instanceof sa ? l : new Error(`Request failed with status ${s.status}, ${a}`);
      }
    }
    return s;
  }
  async makeRequest(t, e = {}) {
    return (await this.makeRawRequest(t, e)).json();
  }
}, Tv = class {
  constructor(t) {
    C(this, "cloud");
    this.cloud = t;
  }
  async create() {
    return this.cloud.makeRequest("/auth/tokens", { method: "POST" });
  }
};
const Qi = {
  /**
  * Converts an {@link AssistantStream} into a `Response` using the supplied
  * encoder.
  *
  * The encoder's `headers` are copied onto the response. Pair this with the
  * decoder for the same wire format when consuming the response.
  */
  toResponse(t, e) {
    return new Response(Qi.toByteStream(t, e), { headers: e.headers ?? {} });
  },
  /**
  * Reads an assistant stream from a `Response` body using the supplied
  * decoder.
  *
  * The response body must be present and encoded with the matching assistant
  * stream wire format.
  */
  fromResponse(t, e) {
    return Qi.fromByteStream(t.body, e);
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
}, xu = () => {
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
}, Iv = () => {
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
        return n = xu(), t.forEach((o) => {
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
var aa = class {
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
const ku = (t) => new ReadableStream({
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
}), la = () => {
  let t;
  return [ku({ start(e) {
    t = e;
  } }), t];
};
var ca = class {
  constructor(t) {
    C(this, "_controller");
    C(this, "_isClosed", !1);
    C(this, "_mergeTask");
    C(this, "_argsTextController");
    this._controller = t;
    const e = ku({ start: (n) => {
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
const Ev = (t) => new ReadableStream({
  start(e) {
    var r;
    return (r = t.start) == null ? void 0 : r.call(t, new ca(e));
  },
  pull(e) {
    var r;
    return (r = t.pull) == null ? void 0 : r.call(t, new ca(e));
  },
  cancel(e) {
    var r;
    return (r = t.cancel) == null ? void 0 : r.call(t, e);
  }
}), Av = () => {
  let t;
  return [Ev({ start(e) {
    t = e;
  } }), t];
};
var _u = class {
  constructor() {
    C(this, "value", -1);
  }
  up() {
    return ++this.value;
  }
}, Rv = class extends TransformStream {
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
var Pv = class extends TransformStream {
  constructor(t) {
    const e = new _u(), r = /* @__PURE__ */ new Map();
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
let Mv = (t, e = 21) => (r = e) => {
  let n = "", i = r | 0;
  for (; i-- > 0; )
    n += t[Math.random() * t.length | 0];
  return n;
};
const Dv = Mv("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
var Nv = class Su {
  constructor(e) {
    C(this, "_state");
    C(this, "_parentId");
    this._state = e || {
      merger: Iv(),
      contentCounter: new _u()
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
    }), this._state.merger.addStream(r.pipeThrough(new Rv(this._state.contentCounter.value)));
  }
  merge(e) {
    this._state.merger.addStream(e.pipeThrough(new Pv(this._state.contentCounter)));
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
    const [e, r] = la();
    return this._addPart(this._withParentIdOption({ type: "text" }), e), r;
  }
  addReasoningPart() {
    const [e, r] = la();
    return this._addPart(this._withParentIdOption({ type: "reasoning" }), e), r;
  }
  addToolCallPart(e) {
    const r = typeof e == "string" ? { toolName: e } : e, n = r.toolName, i = r.toolCallId ?? Dv(), [o, s] = Av();
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
    const r = new Su(this._state);
    return r._parentId = e, r;
  }
  close() {
    var e, r, n, i;
    (r = (e = this._state.append) == null ? void 0 : e.controller) == null || r.close(), this._state.merger.seal(), (i = (n = this._state).closeSubscriber) == null || i.call(n);
  }
};
function zv(t) {
  const e = new Nv();
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
function Ov() {
  const { resolve: t, promise: e } = xu();
  let r;
  return [zv((n) => (r = n, r.__internal_subscribeToClose(t), e)), r];
}
var Lv = class extends TransformStream {
  constructor(t, e, r) {
    const [n, i] = Ov();
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
}, $v = class extends TransformStream {
  constructor(t) {
    super();
    const e = t(super.readable);
    Object.defineProperty(this, "readable", {
      value: e,
      writable: !1
    });
  }
}, Bv = class extends $v {
  constructor() {
    super((t) => {
      const e = new Lv({ transform(r, n) {
        n.appendText(r);
      } });
      return t.pipeThrough(new TextDecoderStream()).pipeThrough(e);
    });
  }
}, Fv = class {
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
    return Qi.fromResponse(e, new Bv());
  }
  async report(t) {
    return this.cloud.makeRequest("/runs", {
      method: "POST",
      body: t
    });
  }
}, Uv = class {
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
}, jv = class {
  constructor(t) {
    C(this, "cloud");
    C(this, "messages");
    this.cloud = t, this.messages = new Uv(t);
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
}, Vv = class {
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
}, qv = class {
  constructor(t) {
    C(this, "threads");
    C(this, "auth");
    C(this, "runs");
    C(this, "files");
    C(this, "telemetry");
    const e = new Cv(t);
    this.threads = new jv(e), this.auth = { tokens: new Tv(e) }, this.runs = new Fv(e), this.files = new Vv(e);
    const r = t.telemetry;
    this.telemetry = r === !1 ? { enabled: !1 } : r === !0 || r === void 0 ? { enabled: !0 } : {
      enabled: r.enabled !== !1,
      ...r
    };
  }
}, Hv = class {
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
const Gv = (t, e) => ({
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
}), fi = /* @__PURE__ */ new WeakMap();
var Wv = class {
  constructor(t, e) {
    C(this, "cloudRef");
    C(this, "aui");
    this.cloudRef = t, this.aui = e;
  }
  get _persistence() {
    const t = this.aui.threadListItem();
    return fi.has(t) || fi.set(t, new Hv(this.cloudRef.current)), fi.get(t);
  }
  withFormat(t) {
    const e = this, r = Gv(this._persistence, t);
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
    const { remoteId: r } = await this.aui.threadListItem().initialize(), n = xv(e);
    await this._persistence.append(r, e.id, t, "aui/v0", n), this.cloudRef.current.telemetry.enabled && this._maybeReportRun(r, "aui/v0", n);
  }
  async delete() {
    throw new Error("Assistant Cloud does not support deleting thread messages yet.");
  }
  async load() {
    const t = this.aui.threadListItem().getState().remoteId;
    return t ? { messages: (await this._persistence.load(t, "aui/v0")).filter((e) => e.format === "aui/v0").map(kv).reverse() } : { messages: [] };
  }
  _reportRunTelemetry(t, e, r) {
    if (!this.cloudRef.current.telemetry.enabled)
      return;
    const n = this.aui.threadListItem().getState().remoteId;
    if (!n)
      return;
    const i = Jv(t, e);
    i && this._sendReport(n, i, r == null ? void 0 : r.durationMs, r == null ? void 0 : r.stepTimestamps);
  }
  _maybeReportRun(t, e, r) {
    const n = Tu(e, r);
    n && this._sendReport(t, n);
  }
  _sendReport(t, e, r, n) {
    const i = Yv(e.steps, n), o = {
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
const ua = 5e4;
function Zn(t) {
  return t.length <= ua ? t : t.slice(0, ua);
}
function Yi(t) {
  if (t != null)
    try {
      return Zn(JSON.stringify(t));
    } catch {
      return;
    }
}
const Kv = /^[A-Za-z0-9+/]{100,}={0,2}$/;
function Qv(t) {
  if (t != null) {
    try {
      const e = typeof t == "string" ? JSON.parse(t) : t;
      if (Array.isArray(e)) {
        const r = e.map((n) => {
          if (n && typeof n == "object" && n.type && (n.type === "image" || n.type === "audio") && typeof n.data == "string" && Kv.test(n.data.slice(0, 200))) {
            const i = (n.data.length * 3 / 4 / 1024).toFixed(1);
            return {
              ...n,
              data: `[${n.type}: ${i}KB]`
            };
          }
          return n;
        });
        return Zn(JSON.stringify(r));
      }
    } catch {
    }
    return Yi(t);
  }
}
function Cu(t, e, r, n, i, o) {
  const s = {
    tool_name: t,
    tool_call_id: e
  }, a = i ?? Yi(r);
  a !== void 0 && (s.tool_args = a);
  const l = o === "mcp" ? Qv(n) : Yi(n);
  return l !== void 0 && (s.tool_result = l), o && (s.tool_source = o), s;
}
function Yv(t, e) {
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
function Tu(t, e) {
  switch (t) {
    case "aui/v0":
      return Zv(e);
    case "ai-sdk/v6":
      return iw(e);
    default:
      return null;
  }
}
function Jv(t, e) {
  if (t === "ai-sdk/v6")
    return ow(e);
  for (let r = e.length - 1; r >= 0; r--) {
    const n = Tu(t, e[r]);
    if (n)
      return n;
  }
  return null;
}
const Xv = {
  error: "error",
  incomplete: "incomplete"
};
function Zv(t) {
  var g, v, b, _, k, I, E, y, M, R, P, x;
  const e = t;
  if (e.role !== "assistant")
    return null;
  const r = (g = e.content) == null ? void 0 : g.filter((T) => T.type === "tool-call" && T.toolName && T.toolCallId).map((T) => Cu(T.toolName, T.toolCallId, T.args, T.result, T.argsText)), n = (v = e.content) == null ? void 0 : v.filter((T) => T.type === "text" && T.text), i = n && n.length > 0 ? Zn(n.map((T) => T.text).join("")) : void 0, o = (b = e.metadata) == null ? void 0 : b.steps;
  let s, a, l, c;
  if (o && o.length > 0) {
    let T = 0, D = 0, N = 0, O = 0, L = !1, j = !1, G = !1, B = !1;
    for (const W of o)
      ((_ = W.usage) == null ? void 0 : _.inputTokens) != null && (T += W.usage.inputTokens, L = !0), ((k = W.usage) == null ? void 0 : k.outputTokens) != null && (D += W.usage.outputTokens, j = !0), ((I = W.usage) == null ? void 0 : I.reasoningTokens) != null && (N += W.usage.reasoningTokens, G = !0), ((E = W.usage) == null ? void 0 : E.cachedInputTokens) != null && (O += W.usage.cachedInputTokens, B = !0);
    s = L ? T : void 0, a = j ? D : void 0, l = G ? N : void 0, c = B ? O : void 0;
  }
  const d = (y = e.status) == null ? void 0 : y.type, u = d && Xv[d] || "completed", h = (M = e.metadata) == null ? void 0 : M.custom, p = ((R = e.metadata) == null ? void 0 : R.modelId) ?? (typeof ((x = (P = e.metadata) == null ? void 0 : P.custom) == null ? void 0 : x.modelId) == "string" ? e.metadata.custom.modelId : void 0), f = o && o.length > 1 ? o.map((T) => {
    var D, N, O, L;
    return {
      ...((D = T.usage) == null ? void 0 : D.inputTokens) != null ? { input_tokens: T.usage.inputTokens } : void 0,
      ...((N = T.usage) == null ? void 0 : N.outputTokens) != null ? { output_tokens: T.usage.outputTokens } : void 0,
      ...((O = T.usage) == null ? void 0 : O.reasoningTokens) != null ? { reasoning_tokens: T.usage.reasoningTokens } : void 0,
      ...((L = T.usage) == null ? void 0 : L.cachedInputTokens) != null ? { cached_input_tokens: T.usage.cachedInputTokens } : void 0
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
    ...f ? { steps: f } : void 0,
    ...p ? { modelId: p } : void 0
  };
}
function ew(t) {
  return t.toolCallId ? t.type === "tool-call" || t.type === "dynamic-tool" ? !!t.toolName : t.type.startsWith("tool-") || t.type.startsWith("dynamic-tool-") : !1;
}
function tw(t) {
  return t.type === "dynamic-tool" || t.type.startsWith("dynamic-tool-");
}
function rw(t) {
  const e = tw(t) ? "mcp" : void 0;
  return Cu(t.toolName ?? t.type.slice(5), t.toolCallId, t.args ?? t.input, t.result ?? t.output, void 0, e);
}
function Iu(t) {
  const e = [], r = [], n = [];
  let i = null;
  for (const o of t)
    if (o.type === "step-start")
      i !== null && n.push({ tool_calls: i }), i = [];
    else if (o.type === "text" && o.text)
      e.push(o.text);
    else if (ew(o)) {
      const s = rw(o);
      r.push(s), i !== null && i.push(s);
    }
  return i !== null && n.push({ tool_calls: i }), {
    textParts: e,
    toolCalls: r,
    stepsData: n
  };
}
function nw(t) {
  if (!t)
    return;
  if (typeof t.modelId == "string")
    return t.modelId;
  const e = t.custom;
  if (typeof (e == null ? void 0 : e.modelId) == "string")
    return e.modelId;
}
function Eu(t, e, r, n, i, o) {
  const s = t.length > 0, a = s ? Zn(t.join("")) : void 0, l = nw(n), c = i && i.length > 1 ? i.map((d) => ({ ...d.tool_calls.length > 0 ? { tool_calls: d.tool_calls } : void 0 })) : void 0;
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
function da(t) {
  const e = t.inputTokens ?? t.promptTokens, r = t.outputTokens ?? t.completionTokens;
  if (!(e == null && r == null && t.reasoningTokens == null && t.cachedInputTokens == null))
    return {
      ...e != null ? { inputTokens: e } : void 0,
      ...r != null ? { outputTokens: r } : void 0,
      ...t.reasoningTokens != null ? { reasoningTokens: t.reasoningTokens } : void 0,
      ...t.cachedInputTokens != null ? { cachedInputTokens: t.cachedInputTokens } : void 0
    };
}
function Au(t) {
  const e = t == null ? void 0 : t.usage;
  if (e) {
    const n = da(e);
    if (n)
      return n;
  }
  const r = t == null ? void 0 : t.steps;
  if (r && r.length > 0) {
    let n = 0, i = 0, o = 0, s = 0, a = !1, l = !1, c = !1, d = !1, u = !1;
    for (const h of r) {
      if (!h.usage)
        continue;
      const p = da(h.usage);
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
function iw(t) {
  const e = t;
  if (e.role !== "assistant")
    return null;
  const { textParts: r, toolCalls: n, stepsData: i } = Iu(e.parts ?? []);
  return Eu(r, n, i.length, e.metadata, i, Au(e.metadata));
}
function ow(t) {
  const e = [], r = [], n = [];
  let i = !1, o, s = 0, a = 0, l = 0, c = 0, d = !1, u = !1, h = !1, p = !1;
  for (const f of t) {
    const g = f;
    if (g.role !== "assistant")
      continue;
    i = !0;
    const { textParts: v, toolCalls: b, stepsData: _ } = Iu(g.parts ?? []);
    e.push(...v), r.push(...b), n.push(..._), g.metadata && (o = g.metadata);
    const k = Au(g.metadata);
    k && (k.inputTokens != null && (s += k.inputTokens, d = !0), k.outputTokens != null && (a += k.outputTokens, u = !0), k.reasoningTokens != null && (l += k.reasoningTokens, h = !0), k.cachedInputTokens != null && (c += k.cachedInputTokens, p = !0));
  }
  return i ? Eu(e, r, n.length, o, n, {
    ...d ? { inputTokens: s } : void 0,
    ...u ? { outputTokens: a } : void 0,
    ...h ? { reasoningTokens: l } : void 0,
    ...p ? { cachedInputTokens: c } : void 0
  }) : null;
}
function sw(t) {
  const e = A(3), r = J();
  let n;
  e[0] !== r || e[1] !== t ? (n = () => new Wv(t, r), e[0] = r, e[1] = t, e[2] = n) : n = e[2];
  const [i] = ve(n);
  return i;
}
const aw = (t) => t.startsWith("image/") ? "image" : t.startsWith("text/") ? "document" : "file";
var lw = class {
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
      type: aw(t.type),
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
}, cw = class {
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
const ha = (t) => Te(t) ? t : void 0;
var oc;
const pa = typeof process < "u" && ((oc = process == null ? void 0 : process.env) == null ? void 0 : oc.NEXT_PUBLIC_ASSISTANT_BASE_URL), mi = pa ? new qv({
  baseUrl: pa,
  anonymous: !0
}) : void 0, uw = (t) => {
  const e = Z(t);
  Q(() => {
    e.current = t;
  }, [t]);
  const r = _t(function({ children: o }) {
    const s = sw({ get current() {
      return e.current.cloud ?? mi;
    } }), a = e.current.cloud ?? mi, l = ce(() => new lw(a), [a]);
    return /* @__PURE__ */ m(fu, {
      adapters: ce(() => ({
        history: s,
        attachments: l
      }), [s, l]),
      children: o
    });
  }, []), n = t.cloud ?? mi;
  if (!n) {
    const i = e, o = new cw();
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
        custom: ha(o.metadata)
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
        custom: ha(o.metadata)
      };
    },
    unstable_Provider: r
  };
}, dw = (t) => {
  const e = A(10), { id: r, children: n } = t;
  let i;
  e[0] !== r ? (i = Ve({
    source: "thread",
    query: {
      type: "id",
      id: r
    },
    get: (c) => c.thread().message({ id: r })
  }), e[0] = r, e[1] = i) : i = e[1];
  let o;
  e[2] !== r ? (o = Ve({
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
  return e[7] !== a || e[8] !== n ? (l = /* @__PURE__ */ m(He, {
    value: a,
    children: n
  }), e[7] = a, e[8] = n, e[9] = l) : l = e[9], l;
}, $o = (t, e) => t.Message === e.Message && t.EditComposer === e.EditComposer && t.UserEditComposer === e.UserEditComposer && t.AssistantEditComposer === e.AssistantEditComposer && t.SystemEditComposer === e.SystemEditComposer && t.UserMessage === e.UserMessage && t.AssistantMessage === e.AssistantMessage && t.SystemMessage === e.SystemMessage, hw = () => null, fa = /* @__PURE__ */ new WeakMap(), pw = (t, e) => {
  let r = fa.get(t);
  return r || (r = new Set(t.map((n) => n.id)), fa.set(t, r)), r.has(e);
}, fw = (t, e, r) => {
  switch (e) {
    case "user":
      return r ? t.UserEditComposer ?? t.EditComposer ?? t.UserMessage ?? t.Message : t.UserMessage ?? t.Message;
    case "assistant":
      return r ? t.AssistantEditComposer ?? t.EditComposer ?? t.AssistantMessage ?? t.Message : t.AssistantMessage ?? t.Message;
    case "system":
      return r ? t.SystemEditComposer ?? t.EditComposer ?? t.SystemMessage ?? t.Message : t.SystemMessage ?? t.Message ?? hw;
    default:
      throw new Error(`Unknown message role: ${e}`);
  }
}, Bo = (t) => {
  const e = A(6), { components: r } = t, n = $(gw), i = $(bw);
  let o;
  e[0] !== r || e[1] !== i || e[2] !== n ? (o = fw(r, n, i), e[0] = r, e[1] = i, e[2] = n, e[3] = o) : o = e[3];
  const s = o;
  let a;
  return e[4] !== s ? (a = /* @__PURE__ */ m(s, {}), e[4] = s, e[5] = a) : a = e[5], a;
}, Ru = we((t) => {
  const e = A(5), { index: r, components: n } = t;
  let i;
  e[0] !== n ? (i = /* @__PURE__ */ m(Bo, { components: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  return e[2] !== r || e[3] !== i ? (o = /* @__PURE__ */ m(su, {
    index: r,
    children: i
  }), e[2] = r, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && $o(t.components, e.components));
Ru.displayName = "ThreadPrimitive.MessageByIndex";
const Pu = we((t) => {
  const e = A(7), { messageId: r, components: n } = t;
  let i;
  if (e[0] !== r ? (i = (a) => pw(a.thread.messages, r), e[0] = r, e[1] = i) : i = e[1], !$(i))
    return null;
  let o;
  e[2] !== n ? (o = /* @__PURE__ */ m(Bo, { components: n }), e[2] = n, e[3] = o) : o = e[3];
  let s;
  return e[4] !== r || e[5] !== o ? (s = /* @__PURE__ */ m(dw, {
    id: r,
    children: o
  }), e[4] = r, e[5] = o, e[6] = s) : s = e[6], s;
}, (t, e) => t.messageId === e.messageId && $o(t.components, e.components));
Pu.displayName = "ThreadPrimitive.Unstable_MessageById";
const ma = ({ children: t }) => {
  const e = $((r) => r.thread.messages.length);
  return ce(() => e === 0 ? null : Array.from({ length: e }, (r, n) => /* @__PURE__ */ m(su, {
    index: n,
    children: /* @__PURE__ */ m(wr, {
      getItemState: (i) => i.thread().message({ index: n }).getState(),
      children: (i) => t({ get message() {
        return i();
      } })
    })
  }, n)), [e, t]);
}, Mu = (t) => {
  const e = A(4), { components: r, children: n } = t;
  if (r) {
    let o;
    return e[0] !== r ? (o = /* @__PURE__ */ m(ma, { children: () => /* @__PURE__ */ m(Bo, { components: r }) }), e[0] = r, e[1] = o) : o = e[1], o;
  }
  let i;
  return e[2] !== n ? (i = /* @__PURE__ */ m(ma, { children: n }), e[2] = n, e[3] = i) : i = e[3], i;
};
Mu.displayName = "ThreadPrimitive.Messages";
const mw = we(Mu, (t, e) => t.children || e.children ? t.children === e.children : $o(t.components, e.components));
function gw(t) {
  return t.message.role;
}
function bw(t) {
  return t.message.composer.isEditing;
}
const Du = (t) => {
  var r;
  const e = t.message.metadata;
  if (!(!e || typeof e != "object"))
    return (r = e.custom) == null ? void 0 : r.quote;
};
var vw = class extends Error {
  constructor(e, r = `Component "${e}" is not in the generative-ui allowlist.`) {
    super(r);
    C(this, "componentName");
    this.name = "GenerativeUIRenderError", this.componentName = e;
  }
};
const ww = (t) => typeof t == "object" && t !== null, Nu = (t, e, r, n) => {
  if (t == null)
    return null;
  if (typeof t == "string")
    return t;
  if (!ww(t) || !("component" in t) || typeof t.component != "string")
    return typeof process < "u" && {}.NODE_ENV !== "production" && console.warn(`[generative-ui] Skipping malformed node at ${n}:`, t), null;
  const { component: i, props: o, children: s, key: a } = t, l = e[i];
  if (!l) {
    if (r)
      return /* @__PURE__ */ m(r, {
        component: i,
        props: o
      }, a ?? n);
    throw new vw(i);
  }
  const c = s != null && s.length ? s.map((d, u) => Nu(d, e, r, `${n}/${u}`)) : void 0;
  return Ct(l, {
    ...o ?? {},
    key: a ?? n
  }, ...c ?? []);
}, yw = (t) => {
  if (!t || t.root === void 0 || t.root === null)
    return [];
  const e = t.root;
  return Array.isArray(e) ? e : [e];
}, Fo = (t) => {
  const e = A(11), { spec: r, components: n, Fallback: i } = t;
  let o;
  e[0] !== r ? (o = yw(r), e[0] = r, e[1] = o) : o = e[1];
  const s = o;
  let a;
  if (e[2] !== i || e[3] !== n || e[4] !== s) {
    let c;
    e[6] !== i || e[7] !== n ? (c = (d, u) => Nu(d, n, i, `${u}`), e[6] = i, e[7] = n, e[8] = c) : c = e[8], a = s.map(c), e[2] = i, e[3] = n, e[4] = s, e[5] = a;
  } else
    a = e[5];
  let l;
  return e[9] !== a ? (l = /* @__PURE__ */ m(it, { children: a }), e[9] = a, e[10] = l) : l = e[10], l;
};
Fo.displayName = "GenerativeUIRender";
const zu = (t) => {
  const e = A(4), { components: r, spec: n, Fallback: i } = t, o = $(xw), s = n ?? o;
  if (!s)
    return null;
  let a;
  return e[0] !== i || e[1] !== r || e[2] !== s ? (a = /* @__PURE__ */ m(Fo, {
    spec: s,
    components: r,
    Fallback: i
  }), e[0] = i, e[1] = r, e[2] = s, e[3] = a) : a = e[3], a;
};
zu.displayName = "MessagePrimitive.GenerativeUI";
function xw(t) {
  const e = t.part;
  return (e == null ? void 0 : e.type) === "generative-ui" ? e.spec : void 0;
}
const kw = "ui://", Ou = (t) => !!(t != null && t.startsWith(kw)), ga = (t) => Symbol.iterator in t, ba = (t) => (
  // HACK: avoid checking entries type
  "entries" in t
), va = (t, e) => {
  const r = t instanceof Map ? t : new Map(t.entries()), n = e instanceof Map ? e : new Map(e.entries());
  if (r.size !== n.size)
    return !1;
  for (const [i, o] of r)
    if (!n.has(i) || !Object.is(o, n.get(i)))
      return !1;
  return !0;
}, _w = (t, e) => {
  const r = t[Symbol.iterator](), n = e[Symbol.iterator]();
  let i = r.next(), o = n.next();
  for (; !i.done && !o.done; ) {
    if (!Object.is(i.value, o.value))
      return !1;
    i = r.next(), o = n.next();
  }
  return !!i.done && !!o.done;
};
function Sw(t, e) {
  return Object.is(t, e) ? !0 : typeof t != "object" || t === null || typeof e != "object" || e === null || Object.getPrototypeOf(t) !== Object.getPrototypeOf(e) ? !1 : ga(t) && ga(e) ? ba(t) && ba(e) ? va(t, e) : _w(t, e) : va(
    { entries: () => Object.entries(t) },
    { entries: () => Object.entries(e) }
  );
}
function zn(t) {
  const e = _e.useRef(void 0);
  return (r) => {
    const n = t(r);
    return Sw(e.current, n) ? e.current : e.current = n;
  };
}
const gi = (t) => {
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
}, Cw = (t, e, r) => {
  const n = [];
  if (e) {
    const i = gi("chainOfThoughtGroup");
    for (let o = 0; o < t.length; o++) {
      const s = t[o];
      s === "tool-call" || s === "reasoning" ? i.startGroup(o) : (i.endGroup(o - 1, n), n.push({
        type: "single",
        index: o
      }));
    }
    i.finalize(t.length - 1, n);
  } else {
    const i = gi("toolGroup"), o = gi("reasoningGroup");
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
}, Tw = (t) => {
  const e = A(10), r = $(zn(Vw)), n = $(zn(Hw));
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
    e[3] !== r || e[4] !== n || e[5] !== t ? (o = Cw(r, t, n), e[3] = r, e[4] = n, e[5] = t, e[6] = o) : o = e[6];
    let s;
    e[7] !== n || e[8] !== o ? (s = {
      ranges: o,
      partIds: n
    }, e[7] = n, e[8] = o, e[9] = s) : s = e[9], i = s;
  }
  return i;
}, Iw = (t) => {
  const e = A(9);
  let r, n;
  e[0] !== t ? ({ Fallback: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]);
  let i;
  e[3] !== r || e[4] !== n.toolName ? (i = (a) => {
    var l, c;
    return ((c = (l = a.tools.toolUIs[n.toolName]) == null ? void 0 : l[0]) == null ? void 0 : c.render) ?? r;
  }, e[3] = r, e[4] = n.toolName, e[5] = i) : i = e[5];
  const o = $(i);
  if (!o)
    return null;
  let s;
  return e[6] !== o || e[7] !== n ? (s = /* @__PURE__ */ m(o, { ...n }), e[6] = o, e[7] = n, e[8] = s) : s = e[8], s;
}, Uo = (t, e, r) => {
  var i;
  const n = (i = t.renderers[e]) == null ? void 0 : i[0];
  return n || (t.fallbacks[0] ?? r);
}, Ew = (t) => {
  const e = A(9);
  let r, n;
  e[0] !== t ? ({ Fallback: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]);
  let i;
  e[3] !== r || e[4] !== n.name ? (i = (a) => Uo(a.dataRenderers, n.name, r), e[3] = r, e[4] = n.name, e[5] = i) : i = e[5];
  const o = $(i);
  if (!o)
    return null;
  let s;
  return e[6] !== o || e[7] !== n ? (s = /* @__PURE__ */ m(o, { ...n }), e[6] = o, e[7] = n, e[8] = s) : s = e[8], s;
}, Ie = {
  Text: () => null,
  Reasoning: () => null,
  Source: () => null,
  Image: () => null,
  File: () => null,
  Unstable_Audio: () => null,
  ToolGroup: ({ children: t }) => t,
  ReasoningGroup: ({ children: t }) => t
}, Aw = (t) => {
  var R, P, x;
  const e = A(47), { components: r } = t;
  let n;
  e[0] !== r ? (n = r === void 0 ? {} : r, e[0] = r, e[1] = n) : n = e[1];
  const { Text: i, Reasoning: o, Image: s, Source: a, File: l, Unstable_Audio: c, tools: d, data: u, generativeUI: h } = n, p = i === void 0 ? Ie.Text : i, f = o === void 0 ? Ie.Reasoning : o, g = s === void 0 ? Ie.Image : s, v = a === void 0 ? Ie.Source : a, b = l === void 0 ? Ie.File : l, _ = c === void 0 ? Ie.Unstable_Audio : c;
  let k;
  e[2] !== d ? (k = d === void 0 ? {} : d, e[2] = d, e[3] = k) : k = e[3];
  const I = k, E = J(), y = $(Gw), M = y.type;
  if (M === "tool-call") {
    let T;
    e[4] !== E ? (T = E.part(), e[4] = E, e[5] = T) : T = e[5];
    const D = T.addToolResult;
    let N;
    e[6] !== E ? (N = E.part(), e[6] = E, e[7] = N) : N = e[7];
    const O = N.resumeToolCall;
    let L;
    e[8] !== E ? (L = E.part(), e[8] = E, e[9] = L) : L = e[9];
    const j = L.respondToToolApproval;
    if ("Override" in I) {
      let W;
      return e[10] !== D || e[11] !== y || e[12] !== j || e[13] !== O || e[14] !== I.Override ? (W = /* @__PURE__ */ m(I.Override, {
        ...y,
        addResult: D,
        resume: O,
        respondToApproval: j
      }), e[10] = D, e[11] = y, e[12] = j, e[13] = O, e[14] = I.Override, e[15] = W) : W = e[15], W;
    }
    const G = ((R = I.by_name) == null ? void 0 : R[y.toolName]) ?? I.Fallback;
    let B;
    return e[16] !== G || e[17] !== D || e[18] !== y || e[19] !== j || e[20] !== O ? (B = /* @__PURE__ */ m(Iw, {
      ...y,
      Fallback: G,
      addResult: D,
      resume: O,
      respondToApproval: j
    }), e[16] = G, e[17] = D, e[18] = y, e[19] = j, e[20] = O, e[21] = B) : B = e[21], B;
  }
  if (((P = y.status) == null ? void 0 : P.type) === "requires-action")
    throw new Error("Encountered unexpected requires-action status");
  switch (M) {
    case "text": {
      let T;
      return e[22] !== p || e[23] !== y ? (T = /* @__PURE__ */ m(p, { ...y }), e[22] = p, e[23] = y, e[24] = T) : T = e[24], T;
    }
    case "reasoning": {
      let T;
      return e[25] !== f || e[26] !== y ? (T = /* @__PURE__ */ m(f, { ...y }), e[25] = f, e[26] = y, e[27] = T) : T = e[27], T;
    }
    case "source": {
      let T;
      return e[28] !== v || e[29] !== y ? (T = /* @__PURE__ */ m(v, { ...y }), e[28] = v, e[29] = y, e[30] = T) : T = e[30], T;
    }
    case "image": {
      let T;
      return e[31] !== g || e[32] !== y ? (T = /* @__PURE__ */ m(g, { ...y }), e[31] = g, e[32] = y, e[33] = T) : T = e[33], T;
    }
    case "file": {
      let T;
      return e[34] !== b || e[35] !== y ? (T = /* @__PURE__ */ m(b, { ...y }), e[34] = b, e[35] = y, e[36] = T) : T = e[36], T;
    }
    case "audio": {
      let T;
      return e[37] !== _ || e[38] !== y ? (T = /* @__PURE__ */ m(_, { ...y }), e[37] = _, e[38] = y, e[39] = T) : T = e[39], T;
    }
    case "data": {
      const T = ((x = u == null ? void 0 : u.by_name) == null ? void 0 : x[y.name]) ?? (u == null ? void 0 : u.Fallback);
      let D;
      return e[40] !== T || e[41] !== y ? (D = /* @__PURE__ */ m(Ew, {
        ...y,
        Fallback: T
      }), e[40] = T, e[41] = y, e[42] = D) : D = e[42], D;
    }
    case "generative-ui": {
      if (!(h != null && h.components))
        return typeof process < "u" && {}.NODE_ENV !== "production" && console.warn("MessagePrimitive.Parts received a generative-ui part but no `components.generativeUI.components` allowlist was provided. Pass an allowlist or render with <MessagePrimitive.GenerativeUI />."), null;
      const T = y;
      let D;
      return e[43] !== h.Fallback || e[44] !== h.components || e[45] !== T.spec ? (D = /* @__PURE__ */ m(Fo, {
        spec: T.spec,
        components: h.components,
        Fallback: h.Fallback
      }), e[43] = h.Fallback, e[44] = h.components, e[45] = T.spec, e[46] = D) : D = e[46], D;
    }
    default:
      return console.warn(`Unknown message part type: ${M}`), null;
  }
}, Lr = we((t) => {
  const e = A(5), { index: r, components: n } = t;
  let i;
  e[0] !== n ? (i = /* @__PURE__ */ m(Aw, { components: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  return e[2] !== r || e[3] !== i ? (o = /* @__PURE__ */ m(Do, {
    index: r,
    children: i
  }), e[2] = r, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => {
  var r, n, i, o, s, a, l, c, d, u, h, p, f, g, v, b, _, k, I, E, y, M;
  return t.index === e.index && ((r = t.components) == null ? void 0 : r.Text) === ((n = e.components) == null ? void 0 : n.Text) && ((i = t.components) == null ? void 0 : i.Reasoning) === ((o = e.components) == null ? void 0 : o.Reasoning) && ((s = t.components) == null ? void 0 : s.Source) === ((a = e.components) == null ? void 0 : a.Source) && ((l = t.components) == null ? void 0 : l.Image) === ((c = e.components) == null ? void 0 : c.Image) && ((d = t.components) == null ? void 0 : d.File) === ((u = e.components) == null ? void 0 : u.File) && ((h = t.components) == null ? void 0 : h.Unstable_Audio) === ((p = e.components) == null ? void 0 : p.Unstable_Audio) && ((f = t.components) == null ? void 0 : f.tools) === ((g = e.components) == null ? void 0 : g.tools) && ((v = t.components) == null ? void 0 : v.data) === ((b = e.components) == null ? void 0 : b.data) && ((_ = t.components) == null ? void 0 : _.generativeUI) === ((k = e.components) == null ? void 0 : k.generativeUI) && ((I = t.components) == null ? void 0 : I.ToolGroup) === ((E = e.components) == null ? void 0 : E.ToolGroup) && ((y = t.components) == null ? void 0 : y.ReasoningGroup) === ((M = e.components) == null ? void 0 : M.ReasoningGroup);
});
Lr.displayName = "MessagePrimitive.PartByIndex";
const Rw = (t) => {
  const e = A(6), { status: r, component: n } = t, i = r.type === "running";
  let o;
  e[0] !== n || e[1] !== r ? (o = /* @__PURE__ */ m(n, {
    type: "text",
    text: "",
    status: r
  }), e[0] = n, e[1] = r, e[2] = o) : o = e[2];
  let s;
  return e[3] !== i || e[4] !== o ? (s = /* @__PURE__ */ m(No, {
    text: "",
    isRunning: i,
    children: o
  }), e[3] = i, e[4] = o, e[5] = s) : s = e[5], s;
}, Pw = Object.freeze({ type: "complete" }), Mw = Object.freeze({ type: "running" }), Dw = (t) => {
  const e = A(6), { components: r } = t, n = $(Ww);
  if (r != null && r.Empty) {
    let s;
    return e[0] !== r.Empty || e[1] !== n ? (s = /* @__PURE__ */ m(r.Empty, { status: n }), e[0] = r.Empty, e[1] = n, e[2] = s) : s = e[2], s;
  }
  if (n.type !== "running")
    return null;
  const i = (r == null ? void 0 : r.Text) ?? Ie.Text;
  let o;
  return e[3] !== n || e[4] !== i ? (o = /* @__PURE__ */ m(Rw, {
    status: n,
    component: i
  }), e[3] = n, e[4] = i, e[5] = o) : o = e[5], o;
}, Lu = we(Dw, (t, e) => {
  var r, n, i, o;
  return ((r = t.components) == null ? void 0 : r.Empty) === ((n = e.components) == null ? void 0 : n.Empty) && ((i = t.components) == null ? void 0 : i.Text) === ((o = e.components) == null ? void 0 : o.Text);
}), Nw = (t) => {
  const e = A(4), { components: r, enabled: n } = t;
  let i;
  if (e[0] !== n ? (i = (s) => {
    if (!n || s.message.parts.length === 0)
      return !1;
    const a = s.message.parts[s.message.parts.length - 1];
    return (a == null ? void 0 : a.type) !== "text" && (a == null ? void 0 : a.type) !== "reasoning";
  }, e[0] = n, e[1] = i) : i = e[1], !$(i))
    return null;
  let o;
  return e[2] !== r ? (o = /* @__PURE__ */ m(Lu, { components: r }), e[2] = r, e[3] = o) : o = e[3], o;
}, zw = we(Nw, (t, e) => {
  var r, n, i, o;
  return t.enabled === e.enabled && ((r = t.components) == null ? void 0 : r.Empty) === ((n = e.components) == null ? void 0 : n.Empty) && ((i = t.components) == null ? void 0 : i.Text) === ((o = e.components) == null ? void 0 : o.Text);
}), Ow = (t) => {
  const e = A(4), { Quote: r } = t, n = $(Du);
  if (!n)
    return null;
  let i;
  return e[0] !== r || e[1] !== n.messageId || e[2] !== n.text ? (i = /* @__PURE__ */ m(r, {
    text: n.text,
    messageId: n.messageId
  }), e[0] = r, e[1] = n.messageId, e[2] = n.text, e[3] = i) : i = e[3], i;
}, Lw = we(Ow);
function $u(t, e) {
  var n, i, o, s;
  const r = ((i = (n = t.toolUIs[e.toolName]) == null ? void 0 : n[0]) == null ? void 0 : i.render) ?? null;
  return r || (Ou((s = (o = e.mcp) == null ? void 0 : o.app) == null ? void 0 : s.resourceUri) && t.mcpApp ? t.mcpApp.render : null);
}
const Bu = () => {
  const t = A(12), e = J(), r = $(Kw), n = $(Qw);
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
  return t[6] !== n || t[7] !== r || t[8] !== i.addToolResult || t[9] !== s.resumeToolCall || t[10] !== l.respondToToolApproval ? (c = /* @__PURE__ */ m(n, {
    ...r,
    addResult: o,
    resume: a,
    respondToApproval: l.respondToToolApproval
  }), t[6] = n, t[7] = r, t[8] = i.addToolResult, t[9] = s.resumeToolCall, t[10] = l.respondToToolApproval, t[11] = c) : c = t[11], c;
}, Fu = () => {
  const t = A(3), e = $(Yw), r = $(Jw);
  if (!r || e.type !== "data")
    return null;
  const n = e;
  let i;
  return t[0] !== r || t[1] !== n ? (i = /* @__PURE__ */ m(r, { ...n }), t[0] = r, t[1] = n, t[2] = i) : i = t[2], i;
}, $w = () => {
  const t = A(2), e = $(Xw);
  if (e === "tool-call") {
    let r;
    return t[0] === Symbol.for("react.memo_cache_sentinel") ? (r = /* @__PURE__ */ m(Bu, {}), t[0] = r) : r = t[0], r;
  }
  if (e === "data") {
    let r;
    return t[1] === Symbol.for("react.memo_cache_sentinel") ? (r = /* @__PURE__ */ m(Fu, {}), t[1] = r) : r = t[1], r;
  }
  return null;
}, Bw = Object.freeze({
  type: "text",
  text: "",
  status: Mw
}), Uu = ({ index: t, children: e }) => {
  const r = J(), n = $((i) => i.dataRenderers);
  return /* @__PURE__ */ m(Do, {
    index: t,
    children: /* @__PURE__ */ m(wr, {
      getItemState: (i) => i.message().part({ index: t }).getState(),
      children: (i) => e({ get part() {
        const o = i();
        if (o.type === "tool-call") {
          const s = $u(r.tools().getState(), o) !== null, a = r.message().part({ index: t });
          return {
            ...o,
            toolUI: s ? /* @__PURE__ */ m(Bu, {}) : null,
            addResult: a.addToolResult,
            resume: a.resumeToolCall,
            respondToApproval: a.respondToToolApproval
          };
        }
        if (o.type === "data") {
          const s = Uo(n, o.name, void 0) !== void 0;
          return {
            ...o,
            dataRendererUI: s ? /* @__PURE__ */ m(Fu, {}) : null
          };
        }
        return o;
      } })
    })
  });
}, Fw = (t) => {
  const e = A(9), { children: r } = t, n = $(Zw), i = $(ey), o = n === 0 && i;
  if (n === 0) {
    if (!o)
      return null;
    let a;
    e[0] !== r ? (a = r({ part: Bw }), e[0] = r, e[1] = a) : a = e[1];
    let l;
    return e[2] !== a ? (l = /* @__PURE__ */ m(No, {
      text: "",
      isRunning: !0,
      children: a
    }), e[2] = a, e[3] = l) : l = e[3], l;
  }
  let s;
  if (e[4] !== r || e[5] !== n) {
    let a;
    e[7] !== r ? (a = (l, c) => /* @__PURE__ */ m(Uu, {
      index: c,
      children: (d) => r(d) ?? /* @__PURE__ */ m($w, {})
    }, c), e[7] = r, e[8] = a) : a = e[8], s = /* @__PURE__ */ m(it, { children: Array.from({ length: n }, a) }), e[4] = r, e[5] = n, e[6] = s;
  } else
    s = e[6];
  return s;
}, Ji = (t) => {
  const e = A(5), { components: r, unstable_showEmptyOnNonTextEnd: n, children: i } = t, o = n === void 0 ? !0 : n;
  if (i) {
    let a;
    return e[0] !== i ? (a = /* @__PURE__ */ m(Fw, { children: i }), e[0] = i, e[1] = a) : a = e[1], a;
  }
  let s;
  return e[2] !== r || e[3] !== o ? (s = /* @__PURE__ */ m(Uw, {
    components: r,
    unstable_showEmptyOnNonTextEnd: o
  }), e[2] = r, e[3] = o, e[4] = s) : s = e[4], s;
};
Ji.displayName = "MessagePrimitive.Parts";
const Uw = (t) => {
  const e = A(15), { components: r, unstable_showEmptyOnNonTextEnd: n } = t, i = $(ty), { ranges: o, partIds: s } = Tw(!!(r != null && r.ChainOfThought));
  let a;
  e: {
    if (i === 0) {
      let p;
      e[0] !== r ? (p = /* @__PURE__ */ m(Lu, { components: r }), e[0] = r, e[1] = p) : p = e[1], a = p;
      break e;
    }
    let h;
    if (e[2] !== r || e[3] !== o || e[4] !== s) {
      const p = /* @__PURE__ */ new Set(), f = (g) => {
        const v = s[g];
        return v !== void 0 && !p.has(v) ? (p.add(v), `part-id:${v}`) : `part-${g}`;
      };
      h = o.map((g) => {
        if (g.type === "single")
          return /* @__PURE__ */ m(Lr, {
            index: g.index,
            components: r
          }, g.index);
        if (g.type === "chainOfThoughtGroup") {
          const v = r == null ? void 0 : r.ChainOfThought;
          return v ? /* @__PURE__ */ m(Lb, {
            startIndex: g.startIndex,
            endIndex: g.endIndex,
            children: /* @__PURE__ */ m(v, {})
          }, `chainOfThought-${g.idKey ?? g.startIndex}`) : null;
        } else
          return g.type === "toolGroup" ? /* @__PURE__ */ m((r == null ? void 0 : r.ToolGroup) ?? Ie.ToolGroup, {
            startIndex: g.startIndex,
            endIndex: g.endIndex,
            children: Array.from({ length: g.endIndex - g.startIndex + 1 }, (v, b) => {
              const _ = g.startIndex + b;
              return /* @__PURE__ */ m(Lr, {
                index: _,
                components: r
              }, f(_));
            })
          }, `tool-${g.idKey ?? g.startIndex}`) : /* @__PURE__ */ m((r == null ? void 0 : r.ReasoningGroup) ?? Ie.ReasoningGroup, {
            startIndex: g.startIndex,
            endIndex: g.endIndex,
            children: Array.from({ length: g.endIndex - g.startIndex + 1 }, (v, b) => {
              const _ = g.startIndex + b;
              return /* @__PURE__ */ m(Lr, {
                index: _,
                components: r
              }, `part-${_}`);
            })
          }, `reasoning-${g.startIndex}`);
      }), e[2] = r, e[3] = o, e[4] = s, e[5] = h;
    } else
      h = e[5];
    a = h;
  }
  const l = a;
  let c;
  e[6] !== r ? (c = (r == null ? void 0 : r.Quote) && /* @__PURE__ */ m(Lw, { Quote: r.Quote }), e[6] = r, e[7] = c) : c = e[7];
  let d;
  e[8] !== r || e[9] !== n ? (d = /* @__PURE__ */ m(zw, {
    components: r,
    enabled: n
  }), e[8] = r, e[9] = n, e[10] = d) : d = e[10];
  let u;
  return e[11] !== l || e[12] !== c || e[13] !== d ? (u = /* @__PURE__ */ V(it, { children: [
    c,
    l,
    d
  ] }), e[11] = l, e[12] = c, e[13] = d, e[14] = u) : u = e[14], u;
};
function jw(t) {
  return t.type;
}
function Vw(t) {
  return t.message.parts.map(jw);
}
function qw(t) {
  return t.type === "tool-call" ? t.toolCallId : void 0;
}
function Hw(t) {
  return t.message.parts.map(qw);
}
function Gw(t) {
  return t.part;
}
function Ww(t) {
  return t.message.status ?? Pw;
}
function Kw(t) {
  return t.part;
}
function Qw(t) {
  return t.part.type === "tool-call" ? $u(t.tools, t.part) : null;
}
function Yw(t) {
  return t.part;
}
function Jw(t) {
  return t.part.type === "data" ? Uo(t.dataRenderers, t.part.name, void 0) ?? null : null;
}
function Xw(t) {
  return t.part.type;
}
function Zw(t) {
  return t.message.parts.length;
}
function ey(t) {
  var e;
  return (((e = t.message.status) == null ? void 0 : e.type) ?? "complete") === "running";
}
function ty(t) {
  return t.message.parts.length;
}
const ju = Symbol.for("@assistant-ui/groupBy.memoKey"), ry = (t) => {
  const e = t, r = (i, o) => {
    var s, a, l, c, d;
    if (i.type === "tool-call") {
      const u = Ou((a = (s = i.mcp) == null ? void 0 : s.app) == null ? void 0 : a.resourceUri);
      if ((u || (((d = (c = (l = o == null ? void 0 : o.toolUIs) == null ? void 0 : l[i.toolName]) == null ? void 0 : c[0]) == null ? void 0 : d.standalone) ?? !1)) && e["standalone-tool-call"] !== void 0)
        return e["standalone-tool-call"];
      if (u && e["mcp-app"] !== void 0)
        return e["mcp-app"];
    }
    return e[i.type] ?? [];
  }, n = Object.keys(t).sort().map((i) => [i, t[i]]);
  return r[ju] = `groupPartByType:${JSON.stringify(n)}`, r;
}, wa = (t) => {
  const e = t.nextChildIdx++;
  return t.nodeKey === "" ? String(e) : `${t.nodeKey}.${e}`;
}, ya = (t, e) => {
  if (!(e === void 0 || t.claimed.has(e)))
    return t.claimed.add(e), `id:${e}`;
}, ny = (t, e) => {
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
      idKey: ya(s, e == null ? void 0 : e[o.indices[0]]),
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
        nodeKey: wa(c),
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
      nodeKey: wa(l),
      idKey: ya(l, e == null ? void 0 : e[o])
    });
    for (let c = 1; c < n.length; c++)
      n[c].indices.push(o);
  }
  for (; n.length > 1; )
    i();
  return r.children;
}, iy = Object.freeze({ type: "complete" }), oy = (t, e, r) => {
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
}, Vu = () => {
  throw new Error("MessagePrimitive.GroupedParts: rendered `children` under a leaf part. `children` is only meaningful for `group-…` cases — add a matching case for the part type or return `null` to skip it.");
}, qu = (t, e, r) => {
  var i;
  if (t.type === "part")
    return /* @__PURE__ */ m(Uu, {
      index: t.index,
      children: ({ part: o }) => r({
        part: o,
        children: /* @__PURE__ */ m(Vu, {})
      })
    }, t.idKey ? `part-${t.idKey}` : `part-${t.index}`);
  const n = ((i = e[t.indices.at(-1)]) == null ? void 0 : i.status) ?? iy;
  return /* @__PURE__ */ m(Ft, { children: r({
    part: {
      type: t.key,
      status: n,
      indices: t.indices
    },
    children: /* @__PURE__ */ m(it, { children: t.children.map((o) => qu(o, e, r)) })
  }) }, t.idKey ?? t.nodeKey);
}, Hu = ({ groupBy: t, indicator: e = "no-text", children: r }) => {
  const n = $(zn((s) => s.message.parts)), i = $((s) => s.tools.toolUIs), o = $((s) => {
    var a;
    return e === "never" ? !1 : ((a = s.message.status) == null ? void 0 : a.type) === "running";
  });
  return /* @__PURE__ */ V(it, { children: [ce(() => {
    const s = { toolUIs: i };
    return ny(n.map((a) => t(a, s) ?? []), n.map((a) => a.type === "tool-call" ? a.toolCallId : void 0));
  }, [
    n,
    t[ju] ?? t,
    i
  ]).map((s) => qu(s, n, r)), oy(e, n, o) && r({
    part: { type: "indicator" },
    children: /* @__PURE__ */ m(Vu, {})
  })] });
};
Hu.displayName = "MessagePrimitive.GroupedParts";
const sy = (t) => {
  const e = A(5), { children: r } = t, n = $(Du);
  if (!n)
    return null;
  let i;
  e[0] !== r || e[1] !== n ? (i = r(n), e[0] = r, e[1] = n, e[2] = i) : i = e[2];
  let o;
  return e[3] !== i ? (o = /* @__PURE__ */ m(it, { children: i }), e[3] = i, e[4] = o) : o = e[4], o;
}, Gu = we(sy);
Gu.displayName = "MessagePrimitive.Quote";
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
  const e = A(5), { components: r } = t, n = $(ly);
  if (!n)
    return null;
  const i = n;
  let o;
  e[0] !== r || e[1] !== i ? (o = Wu(r, i), e[0] = r, e[1] = i, e[2] = o) : o = e[2];
  const s = o;
  if (!s)
    return null;
  let a;
  return e[3] !== s ? (a = /* @__PURE__ */ m(s, {}), e[3] = s, e[4] = a) : a = e[4], a;
}, Ku = we((t) => {
  const e = A(5), { index: r, components: n } = t;
  let i;
  e[0] !== n ? (i = /* @__PURE__ */ m(ay, { components: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  return e[2] !== r || e[3] !== i ? (o = /* @__PURE__ */ m(iu, {
    index: r,
    children: i
  }), e[2] = r, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => {
  var r, n, i, o, s, a, l, c;
  return t.index === e.index && ((r = t.components) == null ? void 0 : r.Image) === ((n = e.components) == null ? void 0 : n.Image) && ((i = t.components) == null ? void 0 : i.Document) === ((o = e.components) == null ? void 0 : o.Document) && ((s = t.components) == null ? void 0 : s.File) === ((a = e.components) == null ? void 0 : a.File) && ((l = t.components) == null ? void 0 : l.Attachment) === ((c = e.components) == null ? void 0 : c.Attachment);
});
Ku.displayName = "MessagePrimitive.AttachmentByIndex";
const xa = ({ children: t }) => {
  const e = $((r) => r.message.role !== "user" ? 0 : (r.message.attachments ?? []).length);
  return ce(() => Array.from({ length: e }, (r, n) => /* @__PURE__ */ m(iu, {
    index: n,
    children: /* @__PURE__ */ m(wr, {
      getItemState: (i) => i.message().attachment({ index: n }).getState(),
      children: (i) => t({ get attachment() {
        return i();
      } })
    })
  }, n)), [e, t]);
}, Qu = (t) => {
  const e = A(4), { components: r, children: n } = t;
  if (r) {
    let o;
    return e[0] !== r ? (o = /* @__PURE__ */ m(xa, { children: (s) => {
      const { attachment: a } = s, l = Wu(r, a);
      return l ? /* @__PURE__ */ m(l, {}) : null;
    } }), e[0] = r, e[1] = o) : o = e[1], o;
  }
  let i;
  return e[2] !== n ? (i = /* @__PURE__ */ m(xa, { children: n }), e[2] = n, e[3] = i) : i = e[3], i;
};
Qu.displayName = "MessagePrimitive.Attachments";
function ly(t) {
  return t.attachment;
}
const Yu = (t, e) => {
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
}, cy = (t) => {
  const e = A(5), { components: r } = t, n = $(uy);
  if (!n)
    return null;
  let i;
  e[0] !== n || e[1] !== r ? (i = Yu(r, n), e[0] = n, e[1] = r, e[2] = i) : i = e[2];
  const o = i;
  if (!o)
    return null;
  let s;
  return e[3] !== o ? (s = /* @__PURE__ */ m(o, {}), e[3] = o, e[4] = s) : s = e[4], s;
}, Ju = we((t) => {
  const e = A(5), { index: r, components: n } = t;
  let i;
  e[0] !== n ? (i = /* @__PURE__ */ m(cy, { components: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  return e[2] !== r || e[3] !== i ? (o = /* @__PURE__ */ m(ou, {
    index: r,
    children: i
  }), e[2] = r, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => {
  var r, n, i, o, s, a, l, c;
  return t.index === e.index && ((r = t.components) == null ? void 0 : r.Image) === ((n = e.components) == null ? void 0 : n.Image) && ((i = t.components) == null ? void 0 : i.Document) === ((o = e.components) == null ? void 0 : o.Document) && ((s = t.components) == null ? void 0 : s.File) === ((a = e.components) == null ? void 0 : a.File) && ((l = t.components) == null ? void 0 : l.Attachment) === ((c = e.components) == null ? void 0 : c.Attachment);
});
Ju.displayName = "ComposerPrimitive.AttachmentByIndex";
const ka = ({ children: t }) => {
  const e = $((r) => r.composer.attachments.length);
  return ce(() => Array.from({ length: e }, (r, n) => /* @__PURE__ */ m(ou, {
    index: n,
    children: /* @__PURE__ */ m(wr, {
      getItemState: (i) => i.composer().attachment({ index: n }).getState(),
      children: (i) => t({ get attachment() {
        return i();
      } })
    })
  }, n)), [e, t]);
}, Xu = (t) => {
  const e = A(4), { components: r, children: n } = t;
  if (r) {
    let o;
    return e[0] !== r ? (o = /* @__PURE__ */ m(ka, { children: (s) => {
      const { attachment: a } = s, l = Yu(r, a);
      return l ? /* @__PURE__ */ m(l, {}) : null;
    } }), e[0] = r, e[1] = o) : o = e[1], o;
  }
  let i;
  return e[2] !== n ? (i = /* @__PURE__ */ m(ka, { children: n }), e[2] = n, e[3] = i) : i = e[3], i;
};
Xu.displayName = "ComposerPrimitive.Attachments";
function uy(t) {
  return t.attachment;
}
const dy = ({ children: t }) => {
  const e = $((r) => r.composer.queue.length);
  return ce(() => Array.from({ length: e }, (r, n) => /* @__PURE__ */ m(Bb, {
    index: n,
    children: /* @__PURE__ */ m(wr, {
      getItemState: (i) => i.composer().queueItem({ index: n }).getState(),
      children: (i) => t({ get queueItem() {
        return i();
      } })
    })
  }, n)), [e, t]);
}, Zu = we(dy);
Zu.displayName = "ComposerPrimitive.Queue";
const jo = (t) => {
  const { children: e } = t;
  return $(hy) ? e : null;
};
jo.displayName = "MessagePartPrimitive.InProgress";
function hy(t) {
  return t.part.status.type === "running";
}
const ed = (t) => {
  const e = A(2), { components: r } = t, n = r.Suggestion;
  let i;
  return e[0] !== n ? (i = /* @__PURE__ */ m(n, {}), e[0] = n, e[1] = i) : i = e[1], i;
}, td = we((t) => {
  const e = A(5), { index: r, components: n } = t;
  let i;
  e[0] !== n ? (i = /* @__PURE__ */ m(ed, { components: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  return e[2] !== r || e[3] !== i ? (o = /* @__PURE__ */ m(au, {
    index: r,
    children: i
  }), e[2] = r, e[3] = i, e[4] = o) : o = e[4], o;
}, (t, e) => t.index === e.index && t.components.Suggestion === e.components.Suggestion);
td.displayName = "ThreadPrimitive.SuggestionByIndex";
const _a = ({ children: t }) => {
  const e = $((r) => r.suggestions.suggestions.length);
  return ce(() => e === 0 ? null : Array.from({ length: e }, (r, n) => /* @__PURE__ */ m(au, {
    index: n,
    children: /* @__PURE__ */ m(wr, {
      getItemState: (i) => i.suggestions().suggestion({ index: n }).getState(),
      children: (i) => t({ get suggestion() {
        return i();
      } })
    })
  }, n)), [e, t]);
}, rd = (t) => {
  const e = A(4), { components: r, children: n } = t;
  if (r) {
    let o;
    return e[0] !== r ? (o = /* @__PURE__ */ m(_a, { children: () => /* @__PURE__ */ m(ed, { components: r }) }), e[0] = r, e[1] = o) : o = e[1], o;
  }
  let i;
  return e[2] !== n ? (i = /* @__PURE__ */ m(_a, { children: n }), e[2] = n, e[3] = i) : i = e[3], i;
};
rd.displayName = "ThreadPrimitive.Suggestions";
const py = we(rd, (t, e) => t.children || e.children ? t.children === e.children : t.components.Suggestion === e.components.Suggestion), fy = (t) => {
  const e = A(3);
  let r;
  return e[0] !== t.dictation || e[1] !== t.editing ? (r = (n) => {
    if (t.editing === !0 && !n.composer.isEditing || t.editing === !1 && n.composer.isEditing)
      return !1;
    const i = n.composer.dictation != null;
    return !(t.dictation === !0 && !i || t.dictation === !1 && i);
  }, e[0] = t.dictation, e[1] = t.editing, e[2] = r) : r = e[2], $(r);
}, nd = (t) => {
  const e = A(3);
  let r, n;
  return e[0] !== t ? ({ children: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]), fy(n) ? r : null;
};
nd.displayName = "ComposerPrimitive.If";
const my = () => {
  const t = A(5), e = J(), r = $(gy);
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
function gy(t) {
  return !t.composer.canSend || t.thread.isRunning && !t.thread.capabilities.queue;
}
const by = () => {
  const t = A(5), e = J(), r = $(vy);
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
function vy(t) {
  return !t.composer.canCancel;
}
const wy = () => {
  const t = A(5), e = J(), r = $(yy);
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
function yy(t) {
  return t.composer.dictation != null || !t.thread.capabilities.dictation || !t.composer.isEditing;
}
const xy = () => {
  const t = A(5), e = J(), r = $(ky);
  let n;
  t[0] !== e ? (n = (s) => e.composer().addAttachment(s), t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  let o;
  return t[2] !== i || t[3] !== r ? (o = {
    addAttachment: i,
    disabled: r
  }, t[2] = i, t[3] = r, t[4] = o) : o = t[4], o;
};
function ky(t) {
  return !t.composer.isEditing;
}
const _y = (t) => {
  const e = A(12);
  let r;
  e[0] !== t ? (r = t === void 0 ? {} : t, e[0] = t, e[1] = r) : r = e[1];
  const { copiedDuration: n, copyToClipboard: i } = r, o = n === void 0 ? 3e3 : n, s = J(), a = $(Cy), l = $(Ty), c = $(Iy), d = $(Ey);
  let u;
  e[2] !== s || e[3] !== d || e[4] !== o || e[5] !== i || e[6] !== c ? (u = () => {
    const f = c ? d : s.message().getCopyText();
    if (!f)
      return;
    const g = i ?? Ay;
    Promise.resolve(g(f)).then(() => {
      s.message().setIsCopied(!0), setTimeout(() => s.message().setIsCopied(!1), o);
    }, Ry);
  }, e[2] = s, e[3] = d, e[4] = o, e[5] = i, e[6] = c, e[7] = u) : u = e[7];
  const h = u;
  let p;
  return e[8] !== h || e[9] !== a || e[10] !== l ? (p = {
    copy: h,
    disabled: a,
    isCopied: l
  }, e[8] = h, e[9] = a, e[10] = l, e[11] = p) : p = e[11], p;
};
function Sy(t) {
  return t.type === "text" && t.text.length > 0;
}
function Cy(t) {
  var e;
  return !((t.message.role !== "assistant" || ((e = t.message.status) == null ? void 0 : e.type) !== "running") && t.message.parts.some(Sy));
}
function Ty(t) {
  return t.message.isCopied;
}
function Iy(t) {
  return t.composer.isEditing;
}
function Ey(t) {
  return t.composer.text;
}
function Ay() {
}
function Ry() {
}
const Py = () => {
  const t = A(5), e = J(), r = $(My);
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
function My(t) {
  return t.composer.isEditing;
}
const Dy = () => {
  const t = A(5), e = J(), r = $(Ny);
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
function Ny(t) {
  return t.thread.isRunning || t.thread.isDisabled || t.message.role !== "assistant";
}
const zy = () => {
  const t = A(5), e = J(), r = $(Ly);
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
}, Oy = () => {
  const t = A(5), e = J(), r = $($y);
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
function Ly(t) {
  var e;
  return ((e = t.message.metadata.submittedFeedback) == null ? void 0 : e.type) === "positive";
}
function $y(t) {
  var e;
  return ((e = t.message.metadata.submittedFeedback) == null ? void 0 : e.type) === "negative";
}
const By = () => {
  const t = A(5), e = J(), r = $(Uy);
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
function Fy(t) {
  return t.type === "text" && t.text.length > 0;
}
function Uy(t) {
  var e;
  return !((t.message.role !== "assistant" || ((e = t.message.status) == null ? void 0 : e.type) !== "running") && t.message.parts.some(Fy));
}
const jy = () => {
  const t = A(5), e = J(), r = $(Vy);
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
function Vy(t) {
  return t.message.speech == null;
}
const qy = (t) => {
  const e = A(8), { prompt: r, send: n, clearComposer: i } = t, o = i === void 0 ? !0 : i, s = J(), a = $(Hy), l = n ?? !1;
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
function Hy(t) {
  return t.thread.isDisabled;
}
const id = () => $(Gy);
function Gy(t) {
  var e;
  return ((e = t.message.status) == null ? void 0 : e.type) === "incomplete" && t.message.status.reason === "error" ? t.message.status.error ?? "An error occurred" : void 0;
}
const Wy = (t) => {
  let e = Gr;
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let i = !1, o = 0;
  const s = () => {
    for (const f of n)
      f();
  }, a = (f) => {
    e = f, p.items = f, s();
  }, l = () => {
    if (i || e.length === 0)
      return;
    const f = e[0], g = r.get(f.id);
    r.delete(f.id), a(e.slice(1)), g && (i = !0, t.run(g, { steer: !1 }));
  }, c = (f, { steer: g }) => {
    const v = dt(), b = Hr(f);
    r.set(v, f), a([...e, {
      id: v,
      prompt: b
    }]), g ? d(v) : l();
  }, d = (f) => {
    if (!r.has(f))
      return;
    if (t.cancel && i) {
      const v = r.get(f);
      r.delete(f), a(e.filter((b) => b.id !== f)), o++, t.cancel(), i = !0, t.run(v, { steer: !0 });
      return;
    }
    const g = e.find((v) => v.id === f);
    g && (a([g, ...e.filter((v) => v.id !== f)]), l());
  }, p = {
    items: e,
    enqueue: c,
    steer: d,
    remove: (f) => {
      r.delete(f) && a(e.filter((g) => g.id !== f));
    },
    clear: () => {
      e.length !== 0 && (r.clear(), a(Gr));
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
    subscribe: (f) => (n.add(f), () => {
      n.delete(f);
    })
  };
}, bi = (t, e) => {
  var r;
  return ((r = t.status) == null ? void 0 : r.type) !== "requires-action" || t.status.reason !== "tool-calls" || t.content.some((n) => n.type === "tool-call" && n.result === void 0 && n.approval !== void 0 && n.approval.approved === void 0 && n.approval.resolution === void 0) ? !1 : e === void 0 ? t.content.every((n) => n.type !== "tool-call" || !!n.result || n.approval !== void 0) : t.content.every((n) => n.type !== "tool-call" || !!n.result || n.approval !== void 0 || !e.includes(n.toolName));
};
var vi = class extends Error {
  constructor(e, r) {
    super(r);
    C(this, "name", "AbortError");
    C(this, "detach");
    this.detach = e;
  }
}, Ky = class extends hv {
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
    var d, u, h, p, f, g, v;
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
    const a = ((f = e.adapters) == null ? void 0 : f.feedback) !== void 0;
    this.capabilities.feedback !== a && (this.capabilities.feedback = a, r = !0);
    const l = ((v = (g = e.adapters) == null ? void 0 : g.history) == null ? void 0 : v.delete) !== void 0;
    this.capabilities.delete !== l && (this.capabilities.delete = l, r = !0);
    const c = e.unstable_enableMessageQueue === !0;
    c && !this._queue ? (this._queue = Wy({ run: (b) => {
      this._queueRunInFlight = !0, this._runAppend(b).finally(() => {
        var _;
        this._queueRunInFlight = !1, (_ = this._queue) == null || _.notifyIdle();
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
    return ((e = this._queue) == null ? void 0 : e.adapter.items) ?? Gr;
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
    const n = Nn(e, dt(), {
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
      id: dt(),
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
      while (bi(r, this._options.unstable_humanToolNames));
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
    var p, f, g, v, b, _, k, I, E;
    const o = e ? this.repository.getMessages(e) : [];
    (p = this.abortController) == null || p.abort(), this.abortController = new AbortController();
    const s = r.content, a = (f = r.metadata) == null ? void 0 : f.unstable_annotations, l = (g = r.metadata) == null ? void 0 : g.unstable_data, c = (v = r.metadata) == null ? void 0 : v.steps, d = (b = r.metadata) == null ? void 0 : b.custom, u = (y) => {
      var N, O, L, j, G;
      const M = (N = y.metadata) == null ? void 0 : N.steps, R = M ? [...c ?? [], ...M] : void 0, P = (O = y.metadata) == null ? void 0 : O.unstable_annotations, x = (L = y.metadata) == null ? void 0 : L.unstable_data, T = P ? [...a ?? [], ...P] : void 0, D = x ? [...l ?? [], ...x] : void 0;
      r = {
        ...r,
        ...y.content ? { content: [...s, ...y.content ?? []] } : void 0,
        status: y.status ?? r.status,
        ...y.metadata ? { metadata: {
          ...r.metadata,
          ...y.metadata.unstable_state ? { unstable_state: y.metadata.unstable_state } : void 0,
          ...T ? { unstable_annotations: T } : void 0,
          ...D ? { unstable_data: D } : void 0,
          ...R ? { steps: R } : void 0,
          ...(j = y.metadata) != null && j.timing ? { timing: y.metadata.timing } : void 0,
          ...(G = y.metadata) != null && G.custom ? { custom: {
            ...d ?? {},
            ...y.metadata.custom
          } } : void 0
        } } : void 0
      }, this.repository.addOrUpdateMessage(e, r), this._notifySubscribers();
    }, h = this._options.maxSteps ?? 2;
    if ((((k = (_ = r.metadata) == null ? void 0 : _.steps) == null ? void 0 : k.length) ?? 0) >= h)
      return u({ status: {
        type: "incomplete",
        reason: "tool-calls"
      } }), r;
    u({ status: { type: "running" } }), this.repository.resetHead(r.id), this._notifySubscribers();
    try {
      this._lastRunConfig = n ?? {};
      const { unstable_composerMetadata: y, ...M } = this.getModelContext();
      i = i ?? this.adapters.chatModel.run.bind(this.adapters.chatModel);
      const R = this.abortController.signal, P = (I = this._getThreadId) == null ? void 0 : I.call(this), x = i({
        messages: o,
        runConfig: this._lastRunConfig,
        abortSignal: R,
        context: M,
        unstable_assistantMessageId: r.id,
        unstable_threadId: P,
        unstable_parentId: e,
        unstable_getMessage() {
          return r;
        }
      });
      if (Symbol.asyncIterator in x)
        for await (const T of x) {
          if (R.aborted) {
            u({ status: {
              type: "incomplete",
              reason: "cancelled"
            } });
            break;
          }
          u(T);
        }
      else
        u(await x);
      r.status.type === "running" && u({ status: {
        type: "complete",
        reason: "unknown"
      } });
    } catch (y) {
      if (y instanceof vi)
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
    const e = new vi(!0);
    (n = this.abortController) == null || n.abort(e), this.abortController = null;
  }
  cancelRun() {
    var r, n;
    (r = this._queue) == null || r.adapter.clear("cancel-run");
    const e = new vi(!1);
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
    }, this.repository.addOrUpdateMessage(a, l), this._notifySubscribers(), c && bi(l, this._options.unstable_humanToolNames) && this._runLoop(a, l, this._lastRunConfig).catch(() => {
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
    this.repository.addOrUpdateMessage(c, o), this._notifySubscribers(), this.repository.headId === o.id && bi(o, this._options.unstable_humanToolNames) && this._runLoop(c, o, this._lastRunConfig).catch(() => {
    });
  }
};
const Sa = Object.freeze([]), Xi = "__DEFAULT_ID__", Qy = Object.freeze({ [Xi]: {
  id: Xi,
  remoteId: void 0,
  externalId: void 0,
  status: "regular",
  title: void 0
} });
var Yy = class extends rn {
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
    return Sa;
  }
  get archivedThreadIds() {
    return Sa;
  }
  get mainThreadId() {
    return Xi;
  }
  get threadItems() {
    return Qy;
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
}, Jy = class extends Lo {
  constructor(e, r) {
    super();
    C(this, "threads");
    C(this, "Provider");
    C(this, "_options");
    this._options = e, this.threads = new Yy(() => new Ky(this._contextProvider, this._options)), r && this.threads.getMainThreadRuntimeCore().import(gu.fromArray(r));
  }
};
const Xy = (t, { initialMessages: e, ...r }) => {
  const { modelContext: n, ...i } = tv() ?? {}, o = {
    ...r,
    adapters: {
      ...i,
      ...r.adapters,
      chatModel: t
    }
  }, [s] = ve(() => new Jy(o, e)), a = Z(void 0);
  return a.current = $((l) => l.threadListItem.remoteId), Q(() => {
    s.threads.getMainThreadRuntimeCore().__internal_setGetThreadId(() => a.current);
  }, [s]), Q(() => () => {
    s.threads.getMainThreadRuntimeCore().detach();
  }, [s]), Q(() => {
    s.threads.getMainThreadRuntimeCore().__internal_setOptions(o), s.threads.getMainThreadRuntimeCore().__internal_load();
  }), Q(() => {
    if (n)
      return s.registerModelContextProvider(n);
  }, [n, s]), ce(() => new Oo(s), [s]);
}, Zy = (t) => {
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
}, e0 = (t, { cloud: e, ...r } = {}) => yv({
  runtimeHook: function() {
    return Xy(t, r);
  },
  adapter: uw({ cloud: e }),
  allowNesting: !0
}), Ca = Symbol.for("@assistant-ui/core.loaded");
function t0() {
  const t = globalThis;
  t[Ca] && console.warn("[@assistant-ui/core] Multiple copies of @assistant-ui/core are loaded into the same runtime. This causes subtle bugs (tools not reaching the runtime, context lookups returning the wrong provider, instanceof checks failing). Run `npx assistant-ui doctor` to diagnose."), t[Ca] = !0;
}
const r0 = /:([\w-]{1,64})\[([^\]\n]{1,1024})\](?:\{name=([^}\n]{1,1024})\})?/gu, od = {
  serialize(t) {
    const e = t.id !== t.label ? `{name=${t.id}}` : "";
    return `:${t.type}[${t.label}]${e}`;
  },
  parse(t) {
    const e = [];
    let r = 0;
    for (const n of t.matchAll(r0)) {
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
({}).NODE_ENV !== "production" && t0();
function n0(t, e) {
  function r(n) {
    const i = Qe(t);
    if (!(n != null && n.optional) && !i)
      throw new Error(`This component must be used within ${e}.`);
    return i;
  }
  return r;
}
function sd(t, e) {
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
const ad = Ke(null), { useThreadViewport: Kt, useThreadViewportStore: Qt } = sd(n0(ad, "ThreadPrimitive.Viewport"), "useThreadViewport");
let or;
const wi = () => {
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
var Ze, i0 = (Ze = class {
  static register(e) {
    var a, l;
    const r = wi();
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
      }), d.logs.length > Ze.MAX_EVENT_LOGS_PER_API && (d.logs = d.logs.slice(-Ze.MAX_EVENT_LOGS_PER_API)), Ze.notifyListeners(n));
    }), s = (l = e.subscribe) == null ? void 0 : l.call(e, () => {
      Ze.notifyListeners(n);
    });
    return r.apis.set(n, i), Ze.notifyListeners(n), () => {
      const c = wi();
      c.apis.get(n) && (o == null || o(), s == null || s(), c.apis.delete(n), Ze.notifyListeners(n));
    };
  }
  static notifyListeners(e) {
    wi().listeners.forEach((r) => r(e));
  }
}, C(Ze, "MAX_EVENT_LOGS_PER_API", 200), Ze);
const Ta = (t) => {
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
}, o0 = (t = {}) => {
  const e = /* @__PURE__ */ new Set(), r = Ta((s) => {
    o.setState({ height: {
      ...o.getState().height,
      viewport: s
    } });
  }), n = Ta((s) => {
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
  }), o = fr(() => {
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
}, On = (t) => t, s0 = (t) => {
  const e = A(11);
  let r;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (r = { optional: !0 }, e[0] = r) : r = e[0];
  const n = Qt(r);
  let i;
  e[1] !== t ? (i = () => o0(t), e[1] = t, e[2] = i) : i = e[2];
  const [o] = ve(i);
  let s, a;
  e[3] !== n || e[4] !== o ? (s = () => n == null ? void 0 : n.getState().onScrollToBottom(() => {
    o.getState().scrollToBottom();
  }), a = [n, o], e[3] = n, e[4] = o, e[5] = s, e[6] = a) : (s = e[5], a = e[6]), Q(s, a);
  let l, c;
  return e[7] !== n || e[8] !== o ? (l = () => {
    if (n)
      return o.subscribe((d) => {
        n.getState().isAtBottom !== d.isAtBottom && On(n).setState({ isAtBottom: d.isAtBottom });
      });
  }, c = [o, n], e[7] = n, e[8] = o, e[9] = l, e[10] = c) : (l = e[9], c = e[10]), Q(l, c), o;
}, Vo = (t) => {
  const e = A(7), { children: r, options: n } = t;
  let i;
  e[0] !== n ? (i = n === void 0 ? {} : n, e[0] = n, e[1] = i) : i = e[1];
  const o = s0(i);
  let s;
  e[2] !== o ? (s = () => ({ useThreadViewport: o }), e[2] = o, e[3] = s) : s = e[3];
  const [a] = ve(s);
  let l;
  return e[4] !== r || e[5] !== a ? (l = /* @__PURE__ */ m(ad.Provider, {
    value: a,
    children: r
  }), e[4] = r, e[5] = a, e[6] = l) : l = e[6], l;
}, a0 = () => {
  const t = A(3), e = J();
  let r, n;
  return t[0] !== e ? (r = () => {
    if (!(typeof process > "u" || {}.NODE_ENV === "production"))
      return i0.register(e);
  }, n = [e], t[0] = e, t[1] = r, t[2] = n) : (r = t[1], n = t[2]), Q(r, n), null;
}, l0 = (t) => {
  const e = A(7), { children: r, aui: n, runtime: i } = t, o = n ?? null;
  let s;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (s = /* @__PURE__ */ m(a0, {}), e[0] = s) : s = e[0];
  let a;
  e[1] !== r ? (a = /* @__PURE__ */ m(Vo, { children: r }), e[1] = r, e[2] = a) : a = e[2];
  let l;
  return e[3] !== i || e[4] !== o || e[5] !== a ? (l = /* @__PURE__ */ V(qg, {
    runtime: i,
    aui: o,
    children: [s, a]
  }), e[3] = i, e[4] = o, e[5] = a, e[6] = l) : l = e[6], l;
}, c0 = we(l0);
function u0(t) {
  const e = A(2), r = J();
  let n;
  e[0] !== r ? (n = () => {
    var o, s;
    return r.composer.source ? ((s = (o = r.composer()).__internal_getRuntime) == null ? void 0 : s.call(o)) ?? null : null;
  }, e[0] = r, e[1] = n) : n = e[1];
  const i = $(n);
  if (!i && !(t != null && t.optional))
    throw new Error("ComposerRuntime is not available");
  return i;
}
function Ia(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
function d0(...t) {
  return (e) => {
    let r = !1;
    const n = t.map((i) => {
      const o = Ia(i, e);
      return !r && typeof o == "function" && (r = !0), o;
    });
    if (r)
      return () => {
        for (let i = 0; i < n.length; i++) {
          const o = n[i];
          typeof o == "function" ? o() : Ia(t[i], null);
        }
      };
  };
}
function Yt(...t) {
  return Xe(d0(...t), t);
}
var Ea = Object.defineProperty, Jt = (t, e) => {
  let r = {};
  for (var n in t)
    Ea(r, n, {
      get: t[n],
      enumerable: !0
    });
  return e || Ea(r, Symbol.toStringTag, { value: "Module" }), r;
};
const h0 = window.ReactDOM;
h0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
// @__NO_SIDE_EFFECTS__
function ld(t) {
  const e = te((r, n) => {
    let { children: i, ...o } = r, s = null, a = !1;
    const l = [];
    Aa(i) && typeof mn == "function" && (i = mn(i._payload)), Bi.forEach(i, (h) => {
      var p;
      if (v0(h)) {
        a = !0;
        const f = h;
        let g = "child" in f.props ? f.props.child : f.props.children;
        Aa(g) && typeof mn == "function" && (g = mn(g._payload)), s = m0(f, g), l.push((p = s == null ? void 0 : s.props) == null ? void 0 : p.children);
      } else
        l.push(h);
    }), s ? s = Ut(s, void 0, l) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && Bi.count(i) === 1 && Tt(i) && (s = i)
    );
    const c = s ? b0(s) : void 0, d = Yt(n, c);
    if (!s) {
      if (i || i === 0)
        throw new Error(
          a ? k0(t) : x0(t)
        );
      return i;
    }
    const u = g0(o, s.props ?? {});
    return s.type !== Ft && (u.ref = n ? d : c), Ut(s, u);
  });
  return e.displayName = `${t}.Slot`, e;
}
var Ln = /* @__PURE__ */ ld("Slot"), cd = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function p0(t) {
  const e = (r) => "child" in r ? r.children(r.child) : r.children;
  return e.displayName = `${t}.Slottable`, e.__radixId = cd, e;
}
var f0 = /* @__PURE__ */ p0("Slottable"), m0 = (t, e) => {
  if ("child" in t.props) {
    const r = t.props.child;
    return Tt(r) ? Ut(r, void 0, t.props.children(r.props.children)) : null;
  }
  return Tt(e) ? e : null;
};
function g0(t, e) {
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
function b0(t) {
  var n, i;
  let e = (n = Object.getOwnPropertyDescriptor(t.props, "ref")) == null ? void 0 : n.get, r = e && "isReactWarning" in e && e.isReactWarning;
  return r ? t.ref : (e = (i = Object.getOwnPropertyDescriptor(t, "ref")) == null ? void 0 : i.get, r = e && "isReactWarning" in e && e.isReactWarning, r ? t.props.ref : t.props.ref || t.ref);
}
function v0(t) {
  return Tt(t) && typeof t.type == "function" && "__radixId" in t.type && t.type.__radixId === cd;
}
var w0 = Symbol.for("react.lazy");
function Aa(t) {
  return t != null && typeof t == "object" && "$$typeof" in t && t.$$typeof === w0 && "_payload" in t && y0(t._payload);
}
function y0(t) {
  return typeof t == "object" && t !== null && "then" in t;
}
var x0 = (t) => `${t} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, k0 = (t) => `${t} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, mn = kf[" use ".trim().toString()], _0 = [
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
], S0 = _0.reduce((t, e) => {
  const r = /* @__PURE__ */ ld(`Primitive.${e}`), n = te((i, o) => {
    const { asChild: s, ...a } = i, l = s ? r : e;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ m(l, { ...a, ref: o });
  });
  return n.displayName = `Primitive.${e}`, { ...t, [e]: n };
}, {});
const C0 = [
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
function T0(t) {
  const e = te((r, n) => {
    const i = A(17);
    let o, s, a, l;
    i[0] !== r ? ({ render: a, asChild: o, children: s, ...l } = r, i[0] = r, i[1] = o, i[2] = s, i[3] = a, i[4] = l) : (o = i[1], s = i[2], a = i[3], l = i[4]);
    const c = t;
    if (a && Tt(a)) {
      const h = s !== void 0 ? s : a.props.children, p = l;
      let f;
      i[5] !== a || i[6] !== h ? (f = Ut(a, void 0, h), i[5] = a, i[6] = h, i[7] = f) : f = i[7];
      let g;
      return i[8] !== n || i[9] !== p || i[10] !== f ? (g = /* @__PURE__ */ m(c, {
        ...p,
        asChild: !0,
        ref: n,
        children: f
      }), i[8] = n, i[9] = p, i[10] = f, i[11] = g) : g = i[11], g;
    }
    const d = l;
    let u;
    return i[12] !== o || i[13] !== s || i[14] !== n || i[15] !== d ? (u = /* @__PURE__ */ m(c, {
      ...d,
      asChild: o,
      ref: n,
      children: s
    }), i[12] = o, i[13] = s, i[14] = n, i[15] = d, i[16] = u) : u = i[16], u;
  });
  return e.displayName = typeof t == "string" ? t : t.displayName ?? t.name ?? "Component", e;
}
function I0(t) {
  const e = S0[t], r = T0(e);
  return r.displayName = `Primitive.${t}`, r;
}
const he = C0.reduce((t, e) => (t[e] = I0(e), t), {}), E0 = (t) => {
  const e = A(5), { hideWhenRunning: r, autohide: n, autohideFloat: i, forceVisible: o } = t;
  let s;
  return e[0] !== n || e[1] !== i || e[2] !== o || e[3] !== r ? (s = (a) => {
    if (r && a.thread.isRunning)
      return "hidden";
    const l = n === "always" || n === "not-last" && !a.message.isLast, c = o || a.message.isHovering;
    return l ? c ? i === "always" || i === "single-branch" && a.message.branchCount <= 1 ? "floating" : "normal" : "hidden" : "normal";
  }, e[0] = n, e[1] = i, e[2] = o, e[3] = r, e[4] = s) : s = e[4], $(s);
}, A0 = Ke(null), ud = te((t, e) => {
  const r = A(18);
  let n, i, o, s;
  r[0] !== t ? ({ hideWhenRunning: o, autohide: n, autohideFloat: i, ...s } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s) : (n = r[1], i = r[2], o = r[3], s = r[4]);
  const [a, l] = ve(0);
  let c;
  r[5] === Symbol.for("react.memo_cache_sentinel") ? (c = () => {
    let _ = !1;
    return l(R0), () => {
      _ || (_ = !0, l(P0));
    };
  }, r[5] = c) : c = r[5];
  const d = c;
  let u;
  r[6] === Symbol.for("react.memo_cache_sentinel") ? (u = { acquireInteractionLock: d }, r[6] = u) : u = r[6];
  const h = u, p = a > 0;
  let f;
  r[7] !== n || r[8] !== i || r[9] !== o || r[10] !== p ? (f = {
    hideWhenRunning: o,
    autohide: n,
    autohideFloat: i,
    forceVisible: p
  }, r[7] = n, r[8] = i, r[9] = o, r[10] = p, r[11] = f) : f = r[11];
  const g = E0(f);
  if (g === "hidden")
    return null;
  let v;
  r[12] !== g ? (v = g === "floating" ? { "data-floating": "true" } : null, r[12] = g, r[13] = v) : v = r[13];
  let b;
  return r[14] !== e || r[15] !== s || r[16] !== v ? (b = /* @__PURE__ */ m(A0.Provider, {
    value: h,
    children: /* @__PURE__ */ m(he.div, {
      ...v,
      ...s,
      ref: e
    })
  }), r[14] = e, r[15] = s, r[16] = v, r[17] = b) : b = r[17], b;
});
ud.displayName = "ActionBarPrimitive.Root";
function R0(t) {
  return t + 1;
}
function P0(t) {
  return Math.max(0, t - 1);
}
function ye(t, e, { checkForDefaultPrevented: r = !0 } = {}) {
  return function(i) {
    if (t == null || t(i), r === !1 || !i || !i.defaultPrevented)
      return e == null ? void 0 : e(i);
  };
}
const M0 = (t) => {
  const e = A(4);
  let r;
  e[0] !== t ? (r = t === void 0 ? {} : t, e[0] = t, e[1] = r) : r = e[1];
  const { copiedDuration: n } = r, i = n === void 0 ? 3e3 : n;
  let o;
  e[2] !== i ? (o = {
    copiedDuration: i,
    copyToClipboard: D0
  }, e[2] = i, e[3] = o) : o = e[3];
  const { copy: s, disabled: a } = _y(o);
  return a ? null : s;
}, dd = te((t, e) => {
  const r = A(20);
  let n, i, o, s;
  r[0] !== t ? ({ copiedDuration: n, onClick: o, disabled: i, ...s } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s) : (n = r[1], i = r[2], o = r[3], s = r[4]);
  const a = $(N0);
  let l;
  r[5] !== n ? (l = { copiedDuration: n }, r[5] = n, r[6] = l) : l = r[6];
  const c = M0(l);
  let d;
  r[7] !== a ? (d = a ? { "data-copied": "true" } : {}, r[7] = a, r[8] = d) : d = r[8];
  const u = i || !c;
  let h;
  r[9] !== c ? (h = () => {
    c == null || c();
  }, r[9] = c, r[10] = h) : h = r[10];
  let p;
  r[11] !== o || r[12] !== h ? (p = ye(o, h), r[11] = o, r[12] = h, r[13] = p) : p = r[13];
  let f;
  return r[14] !== e || r[15] !== s || r[16] !== d || r[17] !== u || r[18] !== p ? (f = /* @__PURE__ */ m(he.button, {
    type: "button",
    ...d,
    ...s,
    ref: e,
    disabled: u,
    onClick: p
  }), r[14] = e, r[15] = s, r[16] = d, r[17] = u, r[18] = p, r[19] = f) : f = r[19], f;
});
dd.displayName = "ActionBarPrimitive.Copy";
function D0(t) {
  return typeof navigator > "u" || !navigator.clipboard ? Promise.reject(/* @__PURE__ */ new Error("Clipboard API is unavailable")) : navigator.clipboard.writeText(t);
}
function N0(t) {
  return t.message.isCopied;
}
const ot = (t, e, r = []) => {
  const n = te((i, o) => {
    const s = A(6), a = {}, l = {};
    Object.keys(i).forEach((g) => {
      r.includes(g) ? a[g] = i[g] : l[g] = i[g];
    });
    const c = e(a) ?? void 0, d = he, u = "button", h = l.disabled || !c, p = ye(l.onClick, c);
    let f;
    return s[0] !== o || s[1] !== l || s[2] !== d.button || s[3] !== h || s[4] !== p ? (f = /* @__PURE__ */ m(d.button, {
      ...l,
      type: u,
      ref: o,
      disabled: h,
      onClick: p
    }), s[0] = o, s[1] = l, s[2] = d.button, s[3] = h, s[4] = p, s[5] = f) : f = s[5], f;
  });
  return n.displayName = t, n;
}, z0 = () => {
  const { disabled: t, reload: e } = Dy();
  return t ? null : e;
}, O0 = ot("ActionBarPrimitive.Reload", z0), L0 = () => {
  const { disabled: t, edit: e } = Py();
  return t ? null : e;
}, $0 = ot("ActionBarPrimitive.Edit", L0), B0 = () => {
  const { disabled: t, speak: e } = By();
  return t ? null : e;
}, F0 = ot("ActionBarPrimitive.Speak", B0);
function qt(t) {
  const e = $e(t);
  return It(() => {
    e.current = t;
  }), kt(() => (...r) => {
    var n;
    return (n = e.current) == null ? void 0 : n.call(e, ...r);
  }, []);
}
function hd(t, e = globalThis == null ? void 0 : globalThis.document) {
  const r = qt(t);
  It(() => {
    const n = (i) => {
      i.key === "Escape" && r(i);
    };
    return e.addEventListener("keydown", n, { capture: !0 }), () => e.removeEventListener("keydown", n, { capture: !0 });
  }, [r, e]);
}
const U0 = () => {
  const { disabled: t, stopSpeaking: e } = jy();
  return t ? null : e;
}, pd = te((t, e) => {
  const r = A(12), n = U0();
  let i;
  r[0] !== n ? (i = (c) => {
    n && (c.preventDefault(), n());
  }, r[0] = n, r[1] = i) : i = r[1], hd(i);
  const o = !n;
  let s;
  r[2] !== n ? (s = () => {
    n == null || n();
  }, r[2] = n, r[3] = s) : s = r[3];
  let a;
  r[4] !== t.onClick || r[5] !== s ? (a = ye(t.onClick, s), r[4] = t.onClick, r[5] = s, r[6] = a) : a = r[6];
  let l;
  return r[7] !== t || r[8] !== e || r[9] !== o || r[10] !== a ? (l = /* @__PURE__ */ m(he.button, {
    type: "button",
    disabled: o,
    ...t,
    ref: e,
    onClick: a
  }), r[7] = t, r[8] = e, r[9] = o, r[10] = a, r[11] = l) : l = r[11], l;
});
pd.displayName = "ActionBarPrimitive.StopSpeaking";
const j0 = () => {
  const { submit: t } = zy();
  return t;
}, fd = te((t, e) => {
  const r = A(17);
  let n, i, o;
  r[0] !== t ? ({ onClick: i, disabled: n, ...o } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o) : (n = r[1], i = r[2], o = r[3]);
  const s = $(V0), a = j0();
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
  return r[11] !== e || r[12] !== o || r[13] !== l || r[14] !== c || r[15] !== u ? (h = /* @__PURE__ */ m(he.button, {
    type: "button",
    ...l,
    ...o,
    ref: e,
    disabled: c,
    onClick: u
  }), r[11] = e, r[12] = o, r[13] = l, r[14] = c, r[15] = u, r[16] = h) : h = r[16], h;
});
fd.displayName = "ActionBarPrimitive.FeedbackPositive";
function V0(t) {
  var e;
  return ((e = t.message.metadata.submittedFeedback) == null ? void 0 : e.type) === "positive";
}
const q0 = () => {
  const { submit: t } = Oy();
  return t;
}, md = te((t, e) => {
  const r = A(17);
  let n, i, o;
  r[0] !== t ? ({ onClick: i, disabled: n, ...o } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o) : (n = r[1], i = r[2], o = r[3]);
  const s = $(H0), a = q0();
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
  return r[11] !== e || r[12] !== o || r[13] !== l || r[14] !== c || r[15] !== u ? (h = /* @__PURE__ */ m(he.button, {
    type: "button",
    ...l,
    ...o,
    ref: e,
    disabled: c,
    onClick: u
  }), r[11] = e, r[12] = o, r[13] = l, r[14] = c, r[15] = u, r[16] = h) : h = r[16], h;
});
md.displayName = "ActionBarPrimitive.FeedbackNegative";
function H0(t) {
  var e;
  return ((e = t.message.metadata.submittedFeedback) == null ? void 0 : e.type) === "negative";
}
const G0 = (t) => {
  const e = A(6);
  let r;
  e[0] !== t ? (r = t === void 0 ? {} : t, e[0] = t, e[1] = r) : r = e[1];
  const { filename: n, onExport: i } = r, o = J(), s = $(K0);
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
}, gd = te((t, e) => {
  const r = A(19);
  let n, i, o, s, a;
  r[0] !== t ? ({ filename: i, onExport: s, onClick: o, disabled: n, ...a } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s, r[5] = a) : (n = r[1], i = r[2], o = r[3], s = r[4], a = r[5]);
  let l;
  r[6] !== i || r[7] !== s ? (l = {
    filename: i,
    onExport: s
  }, r[6] = i, r[7] = s, r[8] = l) : l = r[8];
  const c = G0(l), d = n || !c;
  let u;
  r[9] !== c ? (u = () => {
    c == null || c();
  }, r[9] = c, r[10] = u) : u = r[10];
  let h;
  r[11] !== o || r[12] !== u ? (h = ye(o, u), r[11] = o, r[12] = u, r[13] = h) : h = r[13];
  let p;
  return r[14] !== e || r[15] !== a || r[16] !== d || r[17] !== h ? (p = /* @__PURE__ */ m(he.button, {
    type: "button",
    ...a,
    ref: e,
    disabled: d,
    onClick: h
  }), r[14] = e, r[15] = a, r[16] = d, r[17] = h, r[18] = p) : p = r[18], p;
});
gd.displayName = "ActionBarPrimitive.ExportMarkdown";
function W0(t) {
  return t.type === "text" && t.text.length > 0;
}
function K0(t) {
  var e;
  return (t.message.role !== "assistant" || ((e = t.message.status) == null ? void 0 : e.type) !== "running") && t.message.parts.some(W0);
}
var Ra = /* @__PURE__ */ Jt({
  Copy: () => dd,
  Edit: () => $0,
  ExportMarkdown: () => gd,
  FeedbackNegative: () => md,
  FeedbackPositive: () => fd,
  Reload: () => O0,
  Root: () => ud,
  Speak: () => F0,
  StopSpeaking: () => pd
});
const bd = te((t, e) => {
  const r = A(3);
  let n;
  return r[0] !== t || r[1] !== e ? (n = /* @__PURE__ */ m(he.div, {
    ...t,
    ref: e
  }), r[0] = t, r[1] = e, r[2] = n) : n = r[2], n;
});
bd.displayName = "AttachmentPrimitive.Root";
const vd = te((t, e) => {
  const r = A(4), n = $(Q0);
  let i;
  return r[0] !== n || r[1] !== t || r[2] !== e ? (i = /* @__PURE__ */ V(he.div, {
    ...t,
    ref: e,
    children: [".", n]
  }), r[0] = n, r[1] = t, r[2] = e, r[3] = i) : i = r[3], i;
});
vd.displayName = "AttachmentPrimitive.unstable_Thumb";
function Q0(t) {
  const e = t.attachment.name.split(".");
  return e.length > 1 ? e.pop() : "";
}
const wd = () => {
  const t = A(2), e = $(Y0);
  let r;
  return t[0] !== e ? (r = /* @__PURE__ */ m(it, { children: e }), t[0] = e, t[1] = r) : r = t[1], r;
};
wd.displayName = "AttachmentPrimitive.Name";
function Y0(t) {
  return t.attachment.name;
}
const J0 = () => {
  const t = A(2), e = J();
  let r;
  return t[0] !== e ? (r = () => {
    e.attachment().remove();
  }, t[0] = e, t[1] = r) : r = t[1], r;
}, X0 = ot("AttachmentPrimitive.Remove", J0);
var Zi = /* @__PURE__ */ Jt({
  Name: () => wd,
  Remove: () => X0,
  Root: () => bd,
  unstable_Thumb: () => vd
});
const Z0 = (t) => {
  const e = A(12);
  let r;
  return e[0] !== t.assistant || e[1] !== t.copied || e[2] !== t.hasAttachments || e[3] !== t.hasBranches || e[4] !== t.hasContent || e[5] !== t.last || e[6] !== t.lastOrHover || e[7] !== t.speaking || e[8] !== t.submittedFeedback || e[9] !== t.system || e[10] !== t.user ? (r = (n) => {
    var h;
    const { role: i, attachments: o, parts: s, branchCount: a, isLast: l, speech: c, isCopied: d, isHovering: u } = n.message;
    return !(t.hasBranches === !0 && a < 2 || t.user && i !== "user" || t.assistant && i !== "assistant" || t.system && i !== "system" || t.lastOrHover === !0 && !u && !l || t.last !== void 0 && t.last !== l || t.copied === !0 && !d || t.copied === !1 && d || t.speaking === !0 && c == null || t.speaking === !1 && c != null || t.hasAttachments === !0 && (i !== "user" || !(o != null && o.length)) || t.hasAttachments === !1 && i === "user" && (o != null && o.length) || t.hasContent === !0 && s.length === 0 || t.hasContent === !1 && s.length > 0 || t.submittedFeedback !== void 0 && (((h = n.message.metadata.submittedFeedback) == null ? void 0 : h.type) ?? null) !== t.submittedFeedback);
  }, e[0] = t.assistant, e[1] = t.copied, e[2] = t.hasAttachments, e[3] = t.hasBranches, e[4] = t.hasContent, e[5] = t.last, e[6] = t.lastOrHover, e[7] = t.speaking, e[8] = t.submittedFeedback, e[9] = t.system, e[10] = t.user, e[11] = r) : r = e[11], $(r);
}, yd = (t) => {
  const e = A(3);
  let r, n;
  return e[0] !== t ? ({ children: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]), Z0(n) ? r : null;
};
yd.displayName = "MessagePrimitive.If";
const xd = Ke(null), ei = () => Qe(xd), ex = (t) => {
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
    v.sort(tx), s.current = v.map(rx);
  }, e[2] = a) : a = e[2];
  const l = a;
  let c;
  e[3] === Symbol.for("react.memo_cache_sentinel") ? (c = (v, b) => {
    const _ = (b == null ? void 0 : b.priority) ?? 0;
    return i.current.set(v, _), l(), () => {
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
  const f = p;
  let g;
  return e[6] !== r ? (g = /* @__PURE__ */ m(xd.Provider, {
    value: f,
    children: r
  }), e[6] = r, e[7] = g) : g = e[7], g;
};
function tx(t, e) {
  return e[1] - t[1];
}
function rx(t) {
  const [e] = t;
  return e;
}
const qo = Ke(null), kd = Ke(null), Ho = () => {
  const t = Qe(qo);
  if (!t)
    throw new Error("useTriggerPopoverRootContext must be used within ComposerPrimitive.TriggerPopoverRoot");
  return t;
}, Go = () => Qe(qo), nx = () => {
  const t = Qe(kd);
  if (!t)
    throw new Error("useTriggerPopoverAriaPublish must be used within ComposerPrimitive.TriggerPopoverRoot");
  return t;
}, ix = () => {
  const t = Ho();
  return vr(t.subscribe, t.getTriggers, t.getTriggers);
}, ox = /* @__PURE__ */ new Map(), _d = () => () => {
}, Pa = () => ox, sx = () => {
  const t = Go();
  return vr(t ? t.subscribe : _d, t ? t.getTriggers : Pa, t ? t.getTriggers : Pa);
}, Ma = () => null, ax = () => {
  const t = Go();
  return vr(t ? t.subscribeAria : _d, t ? t.getActiveAria : Ma, t ? t.getActiveAria : Ma);
};
function Da() {
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
const Na = (t) => {
  const e = A(21), { children: r } = t;
  let n;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (n = /* @__PURE__ */ new Map(), e[0] = n) : n = e[0];
  const i = Z(n);
  let o;
  e[1] === Symbol.for("react.memo_cache_sentinel") ? (o = /* @__PURE__ */ new Set(), e[1] = o) : o = e[1];
  const s = Z(o), { notify: a, subscribe: l } = Da();
  let c;
  e[2] !== a ? (c = (N) => {
    const { char: O } = N;
    if (i.current.has(O))
      return {}.NODE_ENV !== "production" && console.warn(`[assistant-ui] Duplicate TriggerPopover for char "${O}". Ignoring the second registration.`), lx;
    if ({}.NODE_ENV !== "production")
      for (const j of i.current.values())
        (O.startsWith(j.char) || j.char.startsWith(O)) && console.warn(`[assistant-ui] Trigger prefix collision between "${j.char}" and "${O}". One char is a prefix of the other; only one will match reliably.`);
    const L = new Map(i.current);
    L.set(O, N), i.current = L, a();
    for (const j of s.current)
      j.added(N);
    return () => {
      const j = new Map(i.current);
      j.delete(O), i.current = j, a();
      for (const G of s.current)
        G.removed(O);
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
  const f = p, g = Z(null), v = Z(null), { notify: b, subscribe: _ } = Da();
  let k;
  e[6] !== b ? (k = (N, O) => {
    if (O === null) {
      if (v.current !== N)
        return;
      g.current = null, v.current = null, b();
      return;
    }
    const L = g.current;
    v.current === N && L !== null && L.popoverId === O.popoverId && L.highlightedItemId === O.highlightedItemId || (g.current = O, v.current = N, b());
  }, e[6] = b, e[7] = k) : k = e[7];
  const I = k;
  let E;
  e[8] === Symbol.for("react.memo_cache_sentinel") ? (E = () => g.current, e[8] = E) : E = e[8];
  const y = E;
  let M;
  e[9] !== d || e[10] !== l || e[11] !== _ ? (M = {
    register: d,
    getTriggers: h,
    subscribe: l,
    subscribeLifecycle: f,
    getActiveAria: y,
    subscribeAria: _
  }, e[9] = d, e[10] = l, e[11] = _, e[12] = M) : M = e[12];
  const R = M;
  let P;
  e[13] !== I ? (P = { setActiveAria: I }, e[13] = I, e[14] = P) : P = e[14];
  const x = P;
  let T;
  e[15] !== x || e[16] !== r ? (T = /* @__PURE__ */ m(kd.Provider, {
    value: x,
    children: r
  }), e[15] = x, e[16] = r, e[17] = T) : T = e[17];
  let D;
  return e[18] !== T || e[19] !== R ? (D = /* @__PURE__ */ m(qo.Provider, {
    value: R,
    children: T
  }), e[18] = T, e[19] = R, e[20] = D) : D = e[20], D;
}, Sd = (t) => {
  const e = A(4), { children: r } = t;
  if (ei()) {
    let i;
    return e[0] !== r ? (i = /* @__PURE__ */ m(Na, { children: r }), e[0] = r, e[1] = i) : i = e[1], i;
  }
  let n;
  return e[2] !== r ? (n = /* @__PURE__ */ m(ex, { children: /* @__PURE__ */ m(Na, { children: r }) }), e[2] = r, e[3] = n) : n = e[3], n;
};
Sd.displayName = "ComposerPrimitive.TriggerPopoverRoot";
function lx() {
}
const za = /\s/u;
function cx(t, e, r) {
  const n = t.slice(0, r);
  for (let i = n.length - 1; i >= 0; i--) {
    const o = n[i];
    if (za.test(o))
      return null;
    if (n.startsWith(e, i)) {
      if (i > 0 && !za.test(n[i - 1]))
        continue;
      return {
        query: n.slice(i + e.length),
        offset: i
      };
    }
  }
  return null;
}
const ux = (t) => {
  const e = A(7), { text: r, triggerChar: n } = t, [i, o] = ve(r.length), s = Math.min(i, r.length);
  let a;
  e[0] !== s || e[1] !== r || e[2] !== n ? (a = cx(r, n, s), e[0] = s, e[1] = r, e[2] = n, e[3] = a) : a = e[3];
  const l = a, c = (l == null ? void 0 : l.query) ?? "";
  let d;
  return e[4] !== c || e[5] !== l ? (d = {
    trigger: l,
    query: c,
    setCursorPosition: o
  }, e[4] = c, e[5] = l, e[6] = d) : d = e[6], d;
}, dx = le(ux);
function hx(t) {
  return "type" in t;
}
const px = (t) => {
  const e = A(25), { navigableList: r, isSearchMode: n, activeCategoryId: i, query: o, popoverId: s, open: a, selectItem: l, selectCategory: c, goBack: d, close: u } = t, [h, p] = ve(0);
  let f;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (f = () => {
    p(0);
  }, e[0] = f) : f = e[0];
  let g;
  e[1] !== r ? (g = [r], e[1] = r, e[2] = g) : g = e[2], Q(f, g);
  let v;
  e[3] === Symbol.for("react.memo_cache_sentinel") ? (v = () => {
    p(0);
  }, e[3] = v) : v = e[3];
  let b;
  e[4] !== i || e[5] !== n ? (b = [n, i], e[4] = i, e[5] = n, e[6] = b) : b = e[6], Q(v, b);
  let _;
  e[7] !== h || e[8] !== r.length ? (_ = (P) => {
    P < 0 || P >= r.length || P !== h && p(P);
  }, e[7] = h, e[8] = r.length, e[9] = _) : _ = e[9];
  const k = je(_);
  let I;
  e[10] !== i || e[11] !== u || e[12] !== d || e[13] !== h || e[14] !== r || e[15] !== a || e[16] !== o || e[17] !== c || e[18] !== l ? (I = (P) => {
    if (!a)
      return !1;
    switch (P.key) {
      case "ArrowDown":
        return P.preventDefault(), p((x) => {
          const T = r.length;
          return T === 0 ? 0 : x < T - 1 ? x + 1 : 0;
        }), !0;
      case "ArrowUp":
        return P.preventDefault(), p((x) => {
          const T = r.length;
          return T === 0 ? 0 : x > 0 ? x - 1 : T - 1;
        }), !0;
      case "Enter":
      case "Tab": {
        if (P.shiftKey)
          return !1;
        P.preventDefault();
        const x = r[h];
        return x && (hx(x) ? l(x) : c(x.id)), !0;
      }
      case "Escape":
        return P.preventDefault(), u(), !0;
      case "Backspace":
        return i && o === "" ? (P.preventDefault(), d(), !0) : !1;
      default:
        return !1;
    }
  }, e[10] = i, e[11] = u, e[12] = d, e[13] = h, e[14] = r, e[15] = a, e[16] = o, e[17] = c, e[18] = l, e[19] = I) : I = e[19];
  const E = je(I), y = r[h], M = a && y ? `${s}-option-${y.id}` : void 0;
  let R;
  return e[20] !== E || e[21] !== k || e[22] !== h || e[23] !== M ? (R = {
    highlightedIndex: h,
    highlightedItemId: M,
    highlightIndex: k,
    handleKeyDown: E
  }, e[20] = E, e[21] = k, e[22] = h, e[23] = M, e[24] = R) : R = e[24], R;
}, fx = le(px);
function Oa(t, e) {
  var r;
  return t.id.toLowerCase().includes(e) || t.label.toLowerCase().includes(e) || (((r = t.description) == null ? void 0 : r.toLowerCase().includes(e)) ?? !1);
}
const mx = (t) => {
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
    let D;
    e[4] !== r ? (D = r.categories(), e[4] = r, e[5] = D) : D = e[5], c = D;
  }
  const d = c, u = i ? o : null;
  let h;
  e: {
    if (!u || !r) {
      let N;
      e[6] === Symbol.for("react.memo_cache_sentinel") ? (N = [], e[6] = N) : N = e[6], h = N;
      break e;
    }
    let D;
    e[7] !== r || e[8] !== u ? (D = r.categoryItems(u), e[7] = r, e[8] = u, e[9] = D) : D = e[9], h = D;
  }
  const p = h;
  let f;
  e: {
    if (!i || !r || u) {
      f = null;
      break e;
    }
    if (!n && d.length > 0) {
      f = null;
      break e;
    }
    if (r.search) {
      let N;
      e[10] !== r || e[11] !== n ? (N = r.search(n), e[10] = r, e[11] = n, e[12] = N) : N = e[12], f = N;
      break e;
    }
    let D;
    if (e[13] !== r || e[14] !== d || e[15] !== n) {
      D = [];
      const N = n.toLowerCase();
      for (const O of d)
        for (const L of r.categoryItems(O.id))
          Oa(L, N) && D.push(L);
      e[13] = r, e[14] = d, e[15] = n, e[16] = D;
    } else
      D = e[16];
    f = D;
  }
  const g = f, v = g !== null;
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
    let D;
    if (e[18] !== d || e[19] !== n) {
      const N = n.toLowerCase();
      D = d.filter((O) => O.label.toLowerCase().includes(N)), e[18] = d, e[19] = n, e[20] = D;
    } else
      D = e[20];
    b = D;
  }
  const _ = b;
  let k;
  e: {
    if (v) {
      let N;
      e[21] !== g ? (N = g ?? [], e[21] = g, e[22] = N) : N = e[22], k = N;
      break e;
    }
    if (!n) {
      k = p;
      break e;
    }
    let D;
    if (e[23] !== p || e[24] !== n) {
      const N = n.toLowerCase();
      D = p.filter((O) => Oa(O, N)), e[23] = p, e[24] = n, e[25] = D;
    } else
      D = e[25];
    k = D;
  }
  const I = k;
  let E;
  e: {
    if (v) {
      let D;
      e[26] !== g ? (D = g ?? [], e[26] = g, e[27] = D) : D = e[27], E = D;
      break e;
    }
    if (u) {
      E = I;
      break e;
    }
    E = _;
  }
  const y = E;
  let M;
  e[28] === Symbol.for("react.memo_cache_sentinel") ? (M = (D) => {
    s(D);
  }, e[28] = M) : M = e[28];
  const R = je(M);
  let P;
  e[29] === Symbol.for("react.memo_cache_sentinel") ? (P = () => {
    s(null);
  }, e[29] = P) : P = e[29];
  const x = je(P);
  let T;
  return e[30] !== u || e[31] !== _ || e[32] !== I || e[33] !== x || e[34] !== v || e[35] !== y || e[36] !== R ? (T = {
    categories: _,
    items: I,
    isSearchMode: v,
    activeCategoryId: u,
    navigableList: y,
    selectCategory: R,
    goBack: x
  }, e[30] = u, e[31] = _, e[32] = I, e[33] = x, e[34] = v, e[35] = y, e[36] = R, e[37] = T) : T = e[37], T;
}, gx = le(mx), bx = (t) => {
  const e = A(15), { behavior: r, trigger: n, aui: i, triggerChar: o, setCursorPosition: s, onSelected: a } = t, l = Z(null);
  let c;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (c = (v) => (l.current = v, () => {
    l.current === v && (l.current = null);
  }), e[0] = c) : c = e[0];
  const d = je(c);
  let u;
  e[1] !== i || e[2] !== r || e[3] !== a || e[4] !== n || e[5] !== o ? (u = (v) => {
    var E, y;
    if (!n || !r)
      return;
    if ((E = l.current) != null && E.call(l, v)) {
      a();
      return;
    }
    const b = i.composer().getState().text, _ = b.slice(0, n.offset), k = b.slice(n.offset + o.length + n.query.length), I = () => {
      const M = r.formatter.serialize(v);
      i.composer().setText(_ + M + (k.startsWith(" ") ? k : ` ${k}`));
    };
    r.kind === "directive" ? (I(), (y = r.onInserted) == null || y.call(r, v)) : (r.removeOnExecute ? i.composer().setText(_ + (k.startsWith(" ") ? k.slice(1) : k)) : I(), r.onExecute(v)), a();
  }, e[1] = i, e[2] = r, e[3] = a, e[4] = n, e[5] = o, e[6] = u) : u = e[6];
  const h = je(u);
  let p;
  e[7] !== a || e[8] !== s || e[9] !== n ? (p = () => {
    a(), n && s(n.offset);
  }, e[7] = a, e[8] = s, e[9] = n, e[10] = p) : p = e[10];
  const f = je(p);
  let g;
  return e[11] !== f || e[12] !== d || e[13] !== h ? (g = {
    selectItem: h,
    close: f,
    registerSelectItemOverride: d
  }, e[11] = f, e[12] = d, e[13] = h, e[14] = g) : g = e[14], g;
}, vx = le(bx), wx = (t) => {
  const e = A(46), { adapter: r, text: n, triggerChar: i, behavior: o, aui: s, popoverId: a, isLoading: l } = t;
  let c;
  e[0] !== n || e[1] !== i ? (c = dx({
    text: n,
    triggerChar: i
  }), e[0] = n, e[1] = i, e[2] = c) : c = e[2];
  const d = Ne(c), u = d.trigger !== null && r !== void 0 && o !== void 0;
  let h;
  e[3] !== r || e[4] !== d.query || e[5] !== u ? (h = gx({
    adapter: r,
    query: d.query,
    open: u
  }), e[3] = r, e[4] = d.query, e[5] = u, e[6] = h) : h = e[6];
  const p = Ne(h);
  let f;
  e[7] !== p ? (f = () => {
    p.goBack();
  }, e[7] = p, e[8] = f) : f = e[8];
  const g = je(f);
  let v;
  e[9] !== s || e[10] !== o || e[11] !== d.setCursorPosition || e[12] !== d.trigger || e[13] !== g || e[14] !== i ? (v = vx({
    behavior: o,
    trigger: d.trigger,
    aui: s,
    triggerChar: i,
    setCursorPosition: d.setCursorPosition,
    onSelected: g
  }), e[9] = s, e[10] = o, e[11] = d.setCursorPosition, e[12] = d.trigger, e[13] = g, e[14] = i, e[15] = v) : v = e[15];
  const b = Ne(v);
  let _;
  e[16] !== d.query || e[17] !== p.activeCategoryId || e[18] !== p.goBack || e[19] !== p.isSearchMode || e[20] !== p.navigableList || e[21] !== p.selectCategory || e[22] !== u || e[23] !== a || e[24] !== b.close || e[25] !== b.selectItem ? (_ = fx({
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
  }), e[16] = d.query, e[17] = p.activeCategoryId, e[18] = p.goBack, e[19] = p.isSearchMode, e[20] = p.navigableList, e[21] = p.selectCategory, e[22] = u, e[23] = a, e[24] = b.close, e[25] = b.selectItem, e[26] = _) : _ = e[26];
  const k = Ne(_);
  let I;
  return e[27] !== d.query || e[28] !== d.setCursorPosition || e[29] !== l || e[30] !== k.handleKeyDown || e[31] !== k.highlightIndex || e[32] !== k.highlightedIndex || e[33] !== k.highlightedItemId || e[34] !== p.activeCategoryId || e[35] !== p.categories || e[36] !== p.goBack || e[37] !== p.isSearchMode || e[38] !== p.items || e[39] !== p.selectCategory || e[40] !== u || e[41] !== a || e[42] !== b.close || e[43] !== b.registerSelectItemOverride || e[44] !== b.selectItem ? (I = {
    open: u,
    query: d.query,
    activeCategoryId: p.activeCategoryId,
    categories: p.categories,
    items: p.items,
    highlightedIndex: k.highlightedIndex,
    isSearchMode: p.isSearchMode,
    isLoading: l,
    popoverId: a,
    highlightedItemId: k.highlightedItemId,
    selectCategory: p.selectCategory,
    goBack: p.goBack,
    selectItem: b.selectItem,
    close: b.close,
    highlightIndex: k.highlightIndex,
    handleKeyDown: k.handleKeyDown,
    setCursorPosition: d.setCursorPosition,
    registerSelectItemOverride: b.registerSelectItemOverride
  }, e[27] = d.query, e[28] = d.setCursorPosition, e[29] = l, e[30] = k.handleKeyDown, e[31] = k.highlightIndex, e[32] = k.highlightedIndex, e[33] = k.highlightedItemId, e[34] = p.activeCategoryId, e[35] = p.categories, e[36] = p.goBack, e[37] = p.isSearchMode, e[38] = p.items, e[39] = p.selectCategory, e[40] = u, e[41] = a, e[42] = b.close, e[43] = b.registerSelectItemOverride, e[44] = b.selectItem, e[45] = I) : I = e[45], I;
}, yx = le(wx), Wo = Ke(null), xr = () => {
  const t = Qe(Wo);
  if (!t)
    throw new Error("useTriggerPopoverScopeContext must be used within ComposerPrimitive.TriggerPopover");
  return t;
}, xx = () => Qe(Wo), Cd = Ke(null), Td = () => {
  const t = Qe(Cd);
  if (!t)
    throw new Error("TriggerPopover.Directive / TriggerPopover.Action must be rendered inside ComposerPrimitive.TriggerPopover");
  return t;
}, Id = te((t, e) => {
  const r = A(61);
  let n, i, o, s, a, l;
  r[0] !== t ? ({ char: o, adapter: n, isLoading: l, "aria-label": i, children: s, ...a } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s, r[5] = a, r[6] = l) : (n = r[1], i = r[2], o = r[3], s = r[4], a = r[5], l = r[6]);
  const c = l === void 0 ? !1 : l, d = J(), u = $(kx), h = vo(), p = Z(null), [f, g] = ve(null), v = Z(0);
  let b;
  r[7] !== o ? (b = (pe) => (v.current = v.current + 1, {}.NODE_ENV !== "production" && v.current > 1 && console.warn(`[assistant-ui] TriggerPopover "${o}" received more than one behavior child. Exactly one <TriggerPopover.Directive> or <TriggerPopover.Action> is allowed per TriggerPopover; the last registration wins.`), p.current = pe, g(pe), () => {
    v.current = Math.max(0, v.current - 1), p.current === pe && (p.current = null, g(null));
  }), r[7] = o, r[8] = b) : b = r[8];
  const _ = b;
  let k;
  r[9] !== _ ? (k = { register: _ }, r[9] = _, r[10] = k) : k = r[10];
  const I = k, E = f ?? void 0;
  let y;
  r[11] !== n || r[12] !== d || r[13] !== o || r[14] !== c || r[15] !== h || r[16] !== E || r[17] !== u ? (y = yx({
    adapter: n,
    text: u,
    triggerChar: o,
    behavior: E,
    aui: d,
    popoverId: h,
    isLoading: c
  }), r[11] = n, r[12] = d, r[13] = o, r[14] = c, r[15] = h, r[16] = E, r[17] = u, r[18] = y) : y = r[18];
  const M = Ne(y);
  let R;
  r[19] !== M ? (R = () => M, r[19] = M, r[20] = R) : R = r[20];
  const P = je(R), x = Ho();
  let T;
  r[21] !== f || r[22] !== o || r[23] !== P || r[24] !== x ? (T = () => x.register({
    char: o,
    ...f ? { behavior: f } : {},
    resource: P()
  }), r[21] = f, r[22] = o, r[23] = P, r[24] = x, r[25] = T) : T = r[25];
  let D;
  r[26] !== f || r[27] !== o || r[28] !== x ? (D = [
    x,
    o,
    f
  ], r[26] = f, r[27] = o, r[28] = x, r[29] = D) : D = r[29], Q(T, D);
  const N = ei();
  let O;
  r[30] !== P || r[31] !== N ? (O = () => {
    if (N)
      return N.register(P());
  }, r[30] = P, r[31] = N, r[32] = O) : O = r[32];
  let L;
  r[33] !== N ? (L = [N], r[33] = N, r[34] = L) : L = r[34], Q(O, L);
  const j = f !== null && M.open, G = nx();
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
  r[40] !== G || r[41] !== o || r[42] !== j || r[43] !== h || r[44] !== M.highlightedItemId ? (w = () => {
    j && G.setActiveAria(o, {
      popoverId: h,
      highlightedItemId: M.highlightedItemId
    });
  }, ie = [
    G,
    o,
    h,
    j,
    M.highlightedItemId
  ], r[40] = G, r[41] = o, r[42] = j, r[43] = h, r[44] = M.highlightedItemId, r[45] = w, r[46] = ie) : (w = r[45], ie = r[46]), Q(w, ie);
  let de;
  r[47] !== i || r[48] !== s || r[49] !== e || r[50] !== j || r[51] !== h || r[52] !== a || r[53] !== M.highlightedItemId ? (de = j ? /* @__PURE__ */ m(he.div, {
    role: "listbox",
    id: h,
    "aria-label": i ?? "Suggestions",
    "aria-activedescendant": M.highlightedItemId,
    "data-state": "open",
    ...a,
    ref: e,
    children: s
  }) : s, r[47] = i, r[48] = s, r[49] = e, r[50] = j, r[51] = h, r[52] = a, r[53] = M.highlightedItemId, r[54] = de) : de = r[54];
  let S;
  r[55] !== M || r[56] !== de ? (S = /* @__PURE__ */ m(Wo.Provider, {
    value: M,
    children: de
  }), r[55] = M, r[56] = de, r[57] = S) : S = r[57];
  let xe;
  return r[58] !== I || r[59] !== S ? (xe = /* @__PURE__ */ m(Cd.Provider, {
    value: I,
    children: S
  }), r[58] = I, r[59] = S, r[60] = xe) : xe = r[60], xe;
});
Id.displayName = "ComposerPrimitive.TriggerPopover";
function kx(t) {
  return t.composer.text;
}
const Ed = () => {
  const t = A(2), { disabled: e, send: r } = my();
  let n;
  t[0] !== r ? (n = () => r(), t[0] = r, t[1] = n) : n = t[1];
  const i = n;
  return e ? null : i;
}, _x = ot("ComposerPrimitive.Send", Ed), Ad = te((t, e) => {
  const r = A(12);
  let n, i;
  r[0] !== t ? ({ onSubmit: n, ...i } = t, r[0] = t, r[1] = n, r[2] = i) : (n = r[1], i = r[2]);
  const o = Ed();
  let s;
  r[3] !== o ? (s = (d) => {
    d.preventDefault(), o && o();
  }, r[3] = o, r[4] = s) : s = r[4];
  const a = s;
  let l;
  r[5] !== a || r[6] !== n ? (l = ye(n, a), r[5] = a, r[6] = n, r[7] = l) : l = r[7];
  let c;
  return r[8] !== e || r[9] !== i || r[10] !== l ? (c = /* @__PURE__ */ m(he.form, {
    ...i,
    ref: e,
    onSubmit: l
  }), r[8] = e, r[9] = i, r[10] = l, r[11] = c) : c = r[11], c;
});
Ad.displayName = "ComposerPrimitive.Root";
const Rd = (t) => {
  const e = A(4), r = qt(t), n = Kt(Sx);
  let i, o;
  e[0] !== r || e[1] !== n ? (i = () => n(r), o = [n, r], e[0] = r, e[1] = n, e[2] = i, e[3] = o) : (i = e[2], o = e[3]), Q(i, o);
};
function Sx(t) {
  return t.onScrollToBottom;
}
const Cx = () => !1, Tx = () => {
}, Pd = (t) => {
  const e = A(4);
  let r;
  e[0] !== t ? (r = (o) => {
    if (typeof window > "u" || t === null || !window.matchMedia)
      return Tx;
    const s = window.matchMedia(t);
    return s.addEventListener("change", o), () => s.removeEventListener("change", o);
  }, e[0] = t, e[1] = r) : r = e[1];
  const n = r;
  let i;
  return e[2] !== t ? (i = () => typeof window > "u" || t === null || !window.matchMedia ? !1 : window.matchMedia(t).matches, e[2] = t, e[3] = i) : i = e[3], vr(n, i, Cx);
};
function Ix() {
  return $(Ex);
}
function Ex(t) {
  return t.composer.isEditing ? t.composer.text : "";
}
function Ax(t) {
  return !!$(Rx) || !!t;
}
function Rx(t) {
  var e;
  return t.thread.isDisabled || ((e = t.composer.dictation) == null ? void 0 : e.inputDisabled);
}
function Px() {
  const t = A(4), e = ax();
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
function eo() {
  return eo = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r)
        ({}).hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, eo.apply(null, arguments);
}
function Mx(t, e) {
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
var Dx = Vn, Nx = function(e) {
  var r = _e.useRef(e);
  return Dx(function() {
    r.current = e;
  }), r;
}, La = function(e, r) {
  if (typeof e == "function") {
    e(r);
    return;
  }
  e.current = r;
}, zx = function(e, r) {
  var n = _e.useRef();
  return _e.useCallback(function(i) {
    e.current = i, n.current && La(n.current, null), n.current = r, r && La(r, i);
  }, [r]);
}, $a = {
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
}, Ox = function(e) {
  Object.keys($a).forEach(function(r) {
    e.style.setProperty(r, $a[r], "important");
  });
}, Ba = Ox, Pe = null, Fa = function(e, r) {
  var n = e.scrollHeight;
  return r.sizingStyle.boxSizing === "border-box" ? n + r.borderSize : n - r.paddingSize;
};
function Lx(t, e, r, n) {
  r === void 0 && (r = 1), n === void 0 && (n = 1 / 0), Pe || (Pe = document.createElement("textarea"), Pe.setAttribute("tabindex", "-1"), Pe.setAttribute("aria-hidden", "true"), Ba(Pe)), Pe.parentNode === null && document.body.appendChild(Pe);
  var i = t.paddingSize, o = t.borderSize, s = t.sizingStyle, a = s.boxSizing;
  Object.keys(s).forEach(function(h) {
    var p = h;
    Pe.style[p] = s[p];
  }), Ba(Pe), Pe.value = e;
  var l = Fa(Pe, t);
  Pe.value = e, l = Fa(Pe, t), Pe.value = "x";
  var c = Pe.scrollHeight - i, d = c * r;
  a === "border-box" && (d = d + i + o), l = Math.max(d, l);
  var u = c * n;
  return a === "border-box" && (u = u + i + o), l = Math.min(u, l), [l, c];
}
var Ua = function() {
}, $x = function(e, r) {
  return e.reduce(function(n, i) {
    return n[i] = r[i], n;
  }, {});
}, Bx = [
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
], Fx = !!document.documentElement.currentStyle, Ux = function(e) {
  var r = window.getComputedStyle(e);
  if (r === null)
    return null;
  var n = $x(Bx, r), i = n.boxSizing;
  if (i === "")
    return null;
  Fx && i === "border-box" && (n.width = parseFloat(n.width) + parseFloat(n.borderRightWidth) + parseFloat(n.borderLeftWidth) + parseFloat(n.paddingRight) + parseFloat(n.paddingLeft) + "px");
  var o = parseFloat(n.paddingBottom) + parseFloat(n.paddingTop), s = parseFloat(n.borderBottomWidth) + parseFloat(n.borderTopWidth);
  return {
    sizingStyle: n,
    paddingSize: o,
    borderSize: s
  };
}, jx = Ux;
function Ko(t, e, r) {
  var n = Nx(r);
  Vn(function() {
    var i = function(s) {
      return n.current(s);
    };
    if (t)
      return t.addEventListener(e, i), function() {
        return t.removeEventListener(e, i);
      };
  }, []);
}
var Vx = function(e, r) {
  Ko(document.body, "reset", function(n) {
    e.current.form === n.target && r(n);
  });
}, qx = function(e) {
  Ko(window, "resize", e);
}, Hx = function(e) {
  Ko(document.fonts, "loadingdone", e);
}, Gx = ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"], Wx = function(e, r) {
  var n = e.cacheMeasurements, i = e.maxRows, o = e.minRows, s = e.onChange, a = s === void 0 ? Ua : s, l = e.onHeightChange, c = l === void 0 ? Ua : l, d = Mx(e, Gx), u = d.value !== void 0, h = $e(null), p = zx(h, r), f = $e(0), g = $e(), v = function() {
    var k = h.current, I = n && g.current ? g.current : jx(k);
    if (I) {
      g.current = I;
      var E = Lx(I, k.value || k.placeholder || "x", o, i), y = E[0], M = E[1];
      f.current !== y && (f.current = y, k.style.setProperty("height", y + "px", "important"), c(y, {
        rowHeight: M
      }));
    }
  }, b = function(k) {
    u || v(), a(k);
  };
  return Vn(v), Vx(h, function() {
    if (!u) {
      var _ = h.current.value;
      requestAnimationFrame(function() {
        var k = h.current;
        k && _ !== k.value && v();
      });
    }
  }), qx(v), Hx(v), /* @__PURE__ */ Ct("textarea", eo({}, d, {
    onChange: b,
    ref: p
  }));
}, Kx = /* @__PURE__ */ te(Wx);
const Qx = "(pointer: coarse) and (not (any-pointer: fine))", Md = te(({ autoFocus: t = !1, asChild: e, render: r, disabled: n, onChange: i, onKeyDown: o, onPaste: s, onSelect: a, submitOnEnter: l, submitMode: c, cancelOnEscape: d = !0, unstable_focusOnRunStart: u = !0, unstable_focusOnScrollToBottom: h = !0, unstable_focusOnThreadSwitched: p = !0, unstable_insertNewlineOnTouchEnter: f = !1, addAttachmentOnPaste: g = !0, ...v }, b) => {
  const _ = J(), k = ei(), I = c ?? (l === !1 ? "none" : "enter"), E = Pd(f ? Qx : null), y = f && E && I === "enter" ? "none" : I, M = Ix(), R = Ax(n), P = Z(null), x = Yt(b, P), T = Z(!1);
  hd((B) => {
    var w;
    if (!((w = P.current) != null && w.contains(B.target)))
      return;
    if (k) {
      for (const ie of k.getPlugins())
        if (ie.handleKeyDown(B))
          return;
    }
    if (!d)
      return;
    const W = _.composer();
    W.getState().canCancel && (W.cancel(), B.preventDefault());
  });
  const D = (B) => {
    var W, w;
    if (!R && !B.nativeEvent.isComposing) {
      if (k) {
        for (const ie of k.getPlugins())
          if (ie.handleKeyDown(B))
            return;
      }
      if (B.key === "Enter") {
        const ie = _.thread().getState(), de = ie.capabilities.queue;
        if (B.shiftKey && (B.ctrlKey || B.metaKey) && de && I !== "none" && _.composer().getState().canSend) {
          B.preventDefault(), _.composer().send({ steer: !0 });
          return;
        }
        if (B.shiftKey || ie.isRunning && !de)
          return;
        let S = !1;
        y === "ctrlEnter" ? S = B.ctrlKey || B.metaKey : y === "enter" && (S = !0), S && (B.preventDefault(), (w = (W = P.current) == null ? void 0 : W.closest("form")) == null || w.requestSubmit());
      }
    }
  }, N = async (B) => {
    var ie;
    if (!g)
      return;
    const W = _.thread().getState().capabilities, w = Array.from(((ie = B.clipboardData) == null ? void 0 : ie.files) || []);
    if (W.attachments && w.length > 0)
      try {
        B.preventDefault(), await Promise.all(w.map((de) => _.composer().addAttachment(de)));
      } catch (de) {
        console.error("Error adding attachment:", de);
      }
  }, O = t && !R, L = _t(() => {
    const B = P.current;
    !B || !O || (B.focus({ preventScroll: !0 }), B.setSelectionRange(B.value.length, B.value.length));
  }, [O]);
  Q(() => L(), [L]), Rd(() => {
    _.composer().getState().type === "thread" && h && L();
  }), Q(() => {
    if (!(_.composer().getState().type !== "thread" || !u))
      return _.on("thread.runStart", L);
  }, [
    u,
    L,
    _
  ]), Q(() => {
    if (!(_.composer().getState().type !== "thread" || !p))
      return _.on("threadListItem.switchedTo", L);
  }, [
    p,
    L,
    _
  ]);
  const j = Px(), G = {
    name: "input",
    value: M,
    ...v,
    ...j,
    ref: x,
    disabled: R,
    onChange: ye(i, (B) => {
      if (!_.composer().getState().isEditing)
        return;
      const W = B.nativeEvent.isComposing === !0;
      T.current && !W && (T.current = !1);
      const w = W || T.current;
      if (Ds(() => {
        _.composer().setText(B.target.value);
      }), w)
        return;
      const ie = B.target.selectionStart ?? B.target.value.length;
      if (k)
        for (const de of k.getPlugins())
          de.setCursorPosition(ie);
    }),
    onKeyDown: ye(o, D),
    onCompositionStart: ye(v.onCompositionStart, () => {
      T.current = !0;
    }),
    onCompositionEnd: ye(v.onCompositionEnd, (B) => {
      if (T.current = !1, !_.composer().getState().isEditing)
        return;
      const W = B.target;
      Ds(() => {
        _.composer().setText(W.value);
      });
      const w = W.selectionStart ?? W.value.length;
      if (k)
        for (const ie of k.getPlugins())
          ie.setCursorPosition(w);
    }),
    onSelect: ye(a, (B) => {
      if (T.current)
        return;
      const W = B.target, w = W.selectionStart ?? W.value.length;
      if (k)
        for (const ie of k.getPlugins())
          ie.setCursorPosition(w);
    }),
    onPaste: ye(s, N)
  };
  if (r && Tt(r)) {
    const B = v.children !== void 0 ? v.children : r.props.children;
    return /* @__PURE__ */ m(Ln, {
      ...G,
      children: Ut(r, void 0, B)
    });
  }
  return /* @__PURE__ */ m(e ? Ln : Kx, { ...G });
});
Md.displayName = "ComposerPrimitive.Input";
const Yx = () => {
  const { disabled: t, cancel: e } = by();
  return t ? null : e;
}, Jx = ot("ComposerPrimitive.Cancel", Yx), Xx = (t) => {
  const e = A(6);
  let r;
  e[0] !== t ? (r = t === void 0 ? {} : t, e[0] = t, e[1] = r) : r = e[1];
  const { multiple: n } = r, i = n === void 0 ? !0 : n, { disabled: o, addAttachment: s } = xy(), a = J();
  let l;
  e[2] !== s || e[3] !== a || e[4] !== i ? (l = () => {
    const d = document.createElement("input");
    d.type = "file", d.multiple = i, d.hidden = !0;
    const u = a.composer().getState().attachmentAccept;
    u !== "*" && (d.accept = u), document.body.appendChild(d), d.onchange = (h) => {
      const p = h.target.files;
      if (p) {
        for (const f of p)
          s(f);
        document.body.removeChild(d);
      }
    }, d.oncancel = () => {
      (!d.files || d.files.length === 0) && document.body.removeChild(d);
    }, d.click();
  }, e[2] = s, e[3] = a, e[4] = i, e[5] = l) : l = e[5];
  const c = l;
  return o ? null : c;
}, Zx = ot("ComposerPrimitive.AddAttachment", Xx, ["multiple"]), Dd = te((t, e) => {
  const r = A(30), { disabled: n, asChild: i, render: o, children: s, ...a } = t, l = i === void 0 ? !1 : i, [c, d] = ve(!1), u = J();
  let h;
  r[0] !== n ? (h = (N) => {
    n || (N.preventDefault(), d(!0));
  }, r[0] = n, r[1] = h) : h = r[1];
  const p = h;
  let f;
  r[2] !== n || r[3] !== c ? (f = (N) => {
    n || (N.preventDefault(), c || d(!0));
  }, r[2] = n, r[3] = c, r[4] = f) : f = r[4];
  const g = f;
  let v;
  r[5] !== n ? (v = (N) => {
    if (n)
      return;
    N.preventDefault();
    const O = N.relatedTarget;
    O && N.currentTarget.contains(O) || d(!1);
  }, r[5] = n, r[6] = v) : v = r[6];
  const b = v;
  let _;
  r[7] !== u || r[8] !== n ? (_ = async (N) => {
    if (n)
      return;
    N.preventDefault(), d(!1);
    const O = Array.from(N.dataTransfer.files);
    await Promise.all(O.map(async (L) => {
      try {
        await u.composer().addAttachment(L);
      } catch (j) {
        console.error("Failed to add attachment:", j);
      }
    }));
  }, r[7] = u, r[8] = n, r[9] = _) : _ = r[9];
  const k = _;
  let I;
  r[10] !== c ? (I = c ? { "data-dragging": "true" } : null, r[10] = c, r[11] = I) : I = r[11];
  const E = ye(a.onDragEnterCapture, p), y = ye(a.onDragOverCapture, g), M = ye(a.onDragLeaveCapture, b), R = ye(a.onDropCapture, k);
  let P;
  r[12] !== e || r[13] !== a || r[14] !== R || r[15] !== I || r[16] !== E || r[17] !== y || r[18] !== M ? (P = {
    ...I,
    ...a,
    onDragEnterCapture: E,
    onDragOverCapture: y,
    onDragLeaveCapture: M,
    onDropCapture: R,
    ref: e
  }, r[12] = e, r[13] = a, r[14] = R, r[15] = I, r[16] = E, r[17] = y, r[18] = M, r[19] = P) : P = r[19];
  const x = P;
  if (o && Tt(o)) {
    const N = s !== void 0 ? s : o.props.children;
    let O;
    r[20] !== o || r[21] !== N ? (O = Ut(o, void 0, N), r[20] = o, r[21] = N, r[22] = O) : O = r[22];
    let L;
    return r[23] !== x || r[24] !== O ? (L = /* @__PURE__ */ m(Ln, {
      ...x,
      children: O
    }), r[23] = x, r[24] = O, r[25] = L) : L = r[25], L;
  }
  const T = l ? Ln : "div";
  let D;
  return r[26] !== T || r[27] !== s || r[28] !== x ? (D = /* @__PURE__ */ m(T, {
    ...x,
    children: s
  }), r[26] = T, r[27] = s, r[28] = x, r[29] = D) : D = r[29], D;
});
Dd.displayName = "ComposerPrimitive.AttachmentDropzone";
const e1 = () => {
  const { disabled: t, startDictation: e } = wy();
  return t ? null : e;
}, t1 = ot("ComposerPrimitive.Dictate", e1), r1 = () => {
  const t = A(2), e = J(), r = $(i1);
  let n;
  t[0] !== e ? (n = () => {
    e.composer().stopDictation();
  }, t[0] = e, t[1] = n) : n = t[1];
  const i = n;
  return r ? i : null;
}, n1 = ot("ComposerPrimitive.StopDictation", r1);
function i1(t) {
  return t.composer.dictation != null;
}
const Nd = te((t, e) => {
  const r = A(7);
  let n, i;
  r[0] !== t ? ({ children: n, ...i } = t, r[0] = t, r[1] = n, r[2] = i) : (n = r[1], i = r[2]);
  const o = $(o1);
  if (!o)
    return null;
  const s = n ?? o;
  let a;
  return r[3] !== e || r[4] !== i || r[5] !== s ? (a = /* @__PURE__ */ m(he.span, {
    ...i,
    ref: e,
    children: s
  }), r[3] = e, r[4] = i, r[5] = s, r[6] = a) : a = r[6], a;
});
Nd.displayName = "ComposerPrimitive.DictationTranscript";
function o1(t) {
  var e;
  return (e = t.composer.dictation) == null ? void 0 : e.transcript;
}
const zd = te((t, e) => {
  const r = A(3);
  if (!$(s1))
    return null;
  let n;
  return r[0] !== e || r[1] !== t ? (n = /* @__PURE__ */ m(he.div, {
    ...t,
    ref: e
  }), r[0] = e, r[1] = t, r[2] = n) : n = r[2], n;
});
zd.displayName = "ComposerPrimitive.Quote";
const Od = te((t, e) => {
  const r = A(7);
  let n, i;
  r[0] !== t ? ({ children: n, ...i } = t, r[0] = t, r[1] = n, r[2] = i) : (n = r[1], i = r[2]);
  const o = $(a1);
  if (!o)
    return null;
  const s = n ?? o;
  let a;
  return r[3] !== e || r[4] !== i || r[5] !== s ? (a = /* @__PURE__ */ m(he.span, {
    ...i,
    ref: e,
    children: s
  }), r[3] = e, r[4] = i, r[5] = s, r[6] = a) : a = r[6], a;
});
Od.displayName = "ComposerPrimitive.QuoteText";
const Ld = te((t, e) => {
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
  return r[8] !== e || r[9] !== i || r[10] !== l ? (c = /* @__PURE__ */ m(he.button, {
    type: "button",
    ...i,
    ref: e,
    onClick: l
  }), r[8] = e, r[9] = i, r[10] = l, r[11] = c) : c = r[11], c;
});
Ld.displayName = "ComposerPrimitive.QuoteDismiss";
function s1(t) {
  return t.composer.quote;
}
function a1(t) {
  var e;
  return (e = t.composer.quote) == null ? void 0 : e.text;
}
const $d = te((t, e) => {
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
  return r[7] !== e || r[8] !== o || r[9] !== d || r[10] !== u ? (h = /* @__PURE__ */ m(he.div, {
    role: "group",
    "aria-label": d,
    ...o,
    ref: e,
    children: u
  }), r[7] = e, r[8] = o, r[9] = d, r[10] = u, r[11] = h) : h = r[11], h;
});
$d.displayName = "ComposerPrimitive.TriggerPopoverCategories";
const Bd = te((t, e) => {
  const r = A(30);
  let n, i, o, s;
  r[0] !== t ? ({ categoryId: n, onClick: i, onMouseMove: o, ...s } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s) : (n = r[1], i = r[2], o = r[3], s = r[4]);
  const { selectCategory: a, highlightIndex: l, categories: c, highlightedIndex: d, activeCategoryId: u, isSearchMode: h, popoverId: p } = xr();
  let f;
  r[5] !== n || r[6] !== a ? (f = () => {
    a(n);
  }, r[5] = n, r[6] = a, r[7] = f) : f = r[7];
  const g = f;
  let v;
  if (r[8] !== c || r[9] !== n) {
    let x;
    r[11] !== n ? (x = (T) => T.id === n, r[11] = n, r[12] = x) : x = r[12], v = c.findIndex(x), r[8] = c, r[9] = n, r[10] = v;
  } else
    v = r[10];
  const b = v, _ = !u && !h && b === d;
  let k;
  r[13] !== b || r[14] !== l ? (k = () => {
    l(b);
  }, r[13] = b, r[14] = l, r[15] = k) : k = r[15];
  const I = k, E = `${p}-option-${n}`, y = _ ? "" : void 0;
  let M;
  r[16] !== g || r[17] !== i ? (M = ye(i, g), r[16] = g, r[17] = i, r[18] = M) : M = r[18];
  let R;
  r[19] !== I || r[20] !== o ? (R = ye(o, I), r[19] = I, r[20] = o, r[21] = R) : R = r[21];
  let P;
  return r[22] !== e || r[23] !== _ || r[24] !== s || r[25] !== E || r[26] !== y || r[27] !== M || r[28] !== R ? (P = /* @__PURE__ */ m(he.button, {
    type: "button",
    role: "option",
    id: E,
    "aria-selected": _,
    "data-highlighted": y,
    ...s,
    ref: e,
    onClick: M,
    onMouseMove: R
  }), r[22] = e, r[23] = _, r[24] = s, r[25] = E, r[26] = y, r[27] = M, r[28] = R, r[29] = P) : P = r[29], P;
});
Bd.displayName = "ComposerPrimitive.TriggerPopoverCategoryItem";
const Fd = te((t, e) => {
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
  return r[7] !== e || r[8] !== o || r[9] !== d || r[10] !== u ? (h = /* @__PURE__ */ m(he.div, {
    role: "group",
    "aria-label": d,
    ...o,
    ref: e,
    children: u
  }), r[7] = e, r[8] = o, r[9] = d, r[10] = u, r[11] = h) : h = r[11], h;
});
Fd.displayName = "ComposerPrimitive.TriggerPopoverItems";
const Ud = te((t, e) => {
  const r = A(30);
  let n, i, o, s, a;
  r[0] !== t ? ({ item: i, index: n, onClick: o, onMouseMove: s, ...a } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o, r[4] = s, r[5] = a) : (n = r[1], i = r[2], o = r[3], s = r[4], a = r[5]);
  const { selectItem: l, highlightIndex: c, items: d, highlightedIndex: u, activeCategoryId: h, isSearchMode: p, popoverId: f } = xr();
  let g;
  r[6] !== i || r[7] !== l ? (g = () => {
    l(i);
  }, r[6] = i, r[7] = l, r[8] = g) : g = r[8];
  const v = g;
  let b;
  r[9] !== n || r[10] !== i.id || r[11] !== d ? (b = n ?? d.findIndex((T) => T.id === i.id), r[9] = n, r[10] = i.id, r[11] = d, r[12] = b) : b = r[12];
  const _ = b, k = (p || h !== null) && _ === u;
  let I;
  r[13] !== c || r[14] !== _ ? (I = () => {
    c(_);
  }, r[13] = c, r[14] = _, r[15] = I) : I = r[15];
  const E = I, y = `${f}-option-${i.id}`, M = k ? "" : void 0;
  let R;
  r[16] !== v || r[17] !== o ? (R = ye(o, v), r[16] = v, r[17] = o, r[18] = R) : R = r[18];
  let P;
  r[19] !== E || r[20] !== s ? (P = ye(s, E), r[19] = E, r[20] = s, r[21] = P) : P = r[21];
  let x;
  return r[22] !== e || r[23] !== k || r[24] !== a || r[25] !== y || r[26] !== M || r[27] !== R || r[28] !== P ? (x = /* @__PURE__ */ m(he.button, {
    type: "button",
    role: "option",
    id: y,
    "aria-selected": k,
    "data-highlighted": M,
    ...a,
    ref: e,
    onClick: R,
    onMouseMove: P
  }), r[22] = e, r[23] = k, r[24] = a, r[25] = y, r[26] = M, r[27] = R, r[28] = P, r[29] = x) : x = r[29], x;
});
Ud.displayName = "ComposerPrimitive.TriggerPopoverItem";
const jd = te((t, e) => {
  const r = A(10);
  let n, i;
  r[0] !== t ? ({ onClick: n, ...i } = t, r[0] = t, r[1] = n, r[2] = i) : (n = r[1], i = r[2]);
  const { activeCategoryId: o, isSearchMode: s, goBack: a, open: l } = xr();
  if (!l || !o || s)
    return null;
  let c;
  r[3] !== a || r[4] !== n ? (c = ye(n, a), r[3] = a, r[4] = n, r[5] = c) : c = r[5];
  let d;
  return r[6] !== e || r[7] !== i || r[8] !== c ? (d = /* @__PURE__ */ m(he.button, {
    type: "button",
    ...i,
    ref: e,
    onClick: c
  }), r[6] = e, r[7] = i, r[8] = c, r[9] = d) : d = r[9], d;
});
jd.displayName = "ComposerPrimitive.TriggerPopoverBack";
const Vd = ({ formatter: t, onExecute: e, removeOnExecute: r }) => {
  const { register: n } = Td(), i = Z(e);
  return i.current = e, Q(() => n({
    kind: "action",
    formatter: t ?? od,
    onExecute: (o) => i.current(o),
    ...r !== void 0 ? { removeOnExecute: r } : {}
  }), [
    n,
    t,
    r
  ]), null;
};
Vd.displayName = "ComposerPrimitive.TriggerPopoverAction";
const qd = ({ formatter: t, onInserted: e }) => {
  const { register: r } = Td(), n = Z(e);
  return n.current = e, Q(() => r({
    kind: "directive",
    formatter: t ?? od,
    onInserted: (i) => {
      var o;
      return (o = n.current) == null ? void 0 : o.call(n, i);
    }
  }), [r, t]), null;
};
qd.displayName = "ComposerPrimitive.TriggerPopoverDirective";
const l1 = Object.assign(Id, {
  Directive: qd,
  Action: Vd
});
var Fe = /* @__PURE__ */ Jt({
  AddAttachment: () => Zx,
  AttachmentByIndex: () => Ju,
  AttachmentDropzone: () => Dd,
  Attachments: () => Xu,
  Cancel: () => Jx,
  Dictate: () => t1,
  DictationTranscript: () => Nd,
  If: () => nd,
  Input: () => Md,
  Queue: () => Zu,
  Quote: () => zd,
  QuoteDismiss: () => Ld,
  QuoteText: () => Od,
  Root: () => Ad,
  Send: () => _x,
  StopDictation: () => n1,
  Unstable_TriggerPopover: () => l1,
  Unstable_TriggerPopoverBack: () => jd,
  Unstable_TriggerPopoverCategories: () => $d,
  Unstable_TriggerPopoverCategoryItem: () => Bd,
  Unstable_TriggerPopoverItem: () => Ud,
  Unstable_TriggerPopoverItems: () => Fd,
  Unstable_TriggerPopoverRoot: () => Sd,
  unstable_useTriggerPopoverRootContext: () => Ho,
  unstable_useTriggerPopoverRootContextOptional: () => Go,
  unstable_useTriggerPopoverScopeContext: () => xr,
  unstable_useTriggerPopoverScopeContextOptional: () => xx,
  unstable_useTriggerPopoverTriggers: () => ix,
  unstable_useTriggerPopoverTriggersOptional: () => sx
});
const Hd = () => $(c1);
function c1(t) {
  if (t.part.type !== "text" && t.part.type !== "reasoning")
    throw new Error("MessagePartText can only be used inside text or reasoning message parts.");
  return t.part;
}
const Gd = Ke(null), u1 = (t) => ({ useSmoothStatus: fr(() => t) }), d1 = (t) => {
  const e = A(6), { children: r } = t;
  let n;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (n = { optional: !0 }, e[0] = n) : n = e[0];
  const i = Wd(n), o = J();
  let s;
  e[1] !== o ? (s = () => u1(o.part().getState().status), e[1] = o, e[2] = s) : s = e[2];
  const [a] = ve(s);
  if (i)
    return r;
  let l;
  return e[3] !== r || e[4] !== a ? (l = /* @__PURE__ */ m(Gd.Provider, {
    value: a,
    children: r
  }), e[3] = r, e[4] = a, e[5] = l) : l = e[5], l;
}, h1 = (t) => {
  const e = te((r, n) => {
    const i = A(3), o = r;
    let s;
    return i[0] !== n || i[1] !== o ? (s = /* @__PURE__ */ m(d1, { children: /* @__PURE__ */ m(t, {
      ...o,
      ref: n
    }) }), i[0] = n, i[1] = o, i[2] = s) : s = i[2], s;
  });
  return e.displayName = t.displayName, e;
};
function Wd(t) {
  const e = Qe(Gd);
  if (!(t != null && t.optional) && !e)
    throw new Error("This component must be used within a SmoothContextProvider.");
  return e;
}
const { useSmoothStatus: p1, useSmoothStatusStore: f1 } = sd(Wd, "useSmoothStatus"), Kd = 250, Qd = 5;
var m1 = class {
  constructor(t, e) {
    C(this, "currentText");
    C(this, "setText");
    C(this, "animationFrameId", null);
    C(this, "lastUpdateTime", Date.now());
    C(this, "lastCommitTime", 0);
    C(this, "targetText", "");
    C(this, "drainMs", Kd);
    C(this, "maxCharIntervalMs", Qd);
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
const yi = Object.freeze({ type: "running" }), gn = (t, e) => t !== void 0 && t > 0 ? t : e, Yd = (t, e = !1) => {
  const { text: r } = t, n = Pd("(prefers-reduced-motion: reduce)"), i = typeof e == "object" && e !== null ? e : void 0, o = e !== !1 && e !== null && !n, s = gn(i == null ? void 0 : i.drainMs, Kd), a = gn(i == null ? void 0 : i.maxCharIntervalMs, Qd), l = gn(i == null ? void 0 : i.maxCharsPerFrame, 1 / 0), c = gn(i == null ? void 0 : i.minCommitMs, 0), [d, u] = ve(t.status.type === "running" ? "" : r), h = J(), p = $(() => h.part()), [f, g] = ve(p);
  (p !== f || !r.startsWith(d)) && (g(p), u(t.status.type === "running" ? "" : r));
  const v = f1({ optional: !0 }), b = qt((I) => {
    if (u(I), v) {
      const E = d !== I || t.status.type === "running" ? yi : t.status;
      On(v).setState(E, !0);
    }
  });
  Q(() => {
    if (v) {
      const I = o && (d !== r || t.status.type === "running") ? yi : t.status;
      On(v).setState(I, !0);
    }
  }, [
    v,
    o,
    r,
    d,
    t.status
  ]);
  const [_] = ve(new m1(d, b));
  Q(() => {
    _.drainMs = s, _.maxCharIntervalMs = a, _.maxCharsPerFrame = l, _.minCommitMs = c;
  }, [
    _,
    s,
    a,
    l,
    c
  ]);
  const k = Z(p);
  return Q(() => {
    if (!o) {
      _.stop();
      return;
    }
    const I = k.current !== p;
    if (k.current = p, I || !r.startsWith(_.targetText)) {
      t.status.type === "running" ? (_.currentText = "", _.targetText = r, _.lastCommitTime = 0, _.start()) : (_.currentText = r, _.targetText = r, _.stop());
      return;
    }
    _.targetText = r, _.start();
  }, [
    _,
    o,
    r,
    t.status.type,
    p
  ]), Q(() => () => {
    _.stop();
  }, [_]), ce(() => o ? {
    ...t,
    text: d,
    status: r === d ? t.status : yi
  } : t, [
    o,
    d,
    t,
    r
  ]);
}, g1 = () => $(b1);
function b1(t) {
  if (t.part.type !== "image")
    throw new Error("MessagePartImage can only be used inside image message parts.");
  return t.part;
}
const Qo = te((t, e) => {
  const r = A(10);
  let n, i, o;
  r[0] !== t ? ({ smooth: i, component: o, ...n } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o) : (n = r[1], i = r[2], o = r[3]);
  const s = i === void 0 ? !0 : i, a = o === void 0 ? "span" : o, { text: l, status: c } = Yd(Hd(), s);
  let d;
  return r[4] !== a || r[5] !== e || r[6] !== n || r[7] !== c.type || r[8] !== l ? (d = /* @__PURE__ */ m(a, {
    "data-status": c.type,
    ...n,
    ref: e,
    children: l
  }), r[4] = a, r[5] = e, r[6] = n, r[7] = c.type, r[8] = l, r[9] = d) : d = r[9], d;
});
Qo.displayName = "MessagePartPrimitive.Text";
const Yo = te((t, e) => {
  const r = A(4), { image: n } = g1();
  let i;
  return r[0] !== e || r[1] !== n || r[2] !== t ? (i = /* @__PURE__ */ m(he.img, {
    src: n,
    ...t,
    ref: e
  }), r[0] = e, r[1] = n, r[2] = t, r[3] = i) : i = r[3], i;
});
Yo.displayName = "MessagePartPrimitive.Image";
const Jd = te((t, e) => {
  const r = A(3);
  let n;
  return r[0] !== e || r[1] !== t ? (n = /* @__PURE__ */ m(he.div, {
    role: "alert",
    ...t,
    ref: e
  }), r[0] = e, r[1] = t, r[2] = n) : n = r[2], n;
});
Jd.displayName = "ErrorPrimitive.Root";
const Xd = te((t, e) => {
  const r = A(7);
  let n, i;
  r[0] !== t ? ({ children: n, ...i } = t, r[0] = t, r[1] = n, r[2] = i) : (n = r[1], i = r[2]);
  const o = id();
  if (o === void 0)
    return null;
  const s = n ?? String(o);
  let a;
  return r[3] !== e || r[4] !== i || r[5] !== s ? (a = /* @__PURE__ */ m(he.span, {
    ...i,
    ref: e,
    children: s
  }), r[3] = e, r[4] = i, r[5] = s, r[6] = a) : a = r[6], a;
});
Xd.displayName = "ErrorPrimitive.Message";
var ja = /* @__PURE__ */ Jt({
  Message: () => Xd,
  Root: () => Jd
});
const Xt = (t) => {
  const e = A(2), r = Z(void 0);
  let n;
  return e[0] !== t ? (n = (i) => {
    r.current && (r.current(), r.current = void 0), i && (r.current = t(i));
  }, e[0] = t, e[1] = n) : n = e[1], n;
}, Va = (t, e) => {
  const r = t.trim().match(/^(\d+(?:\.\d+)?|\.\d+)(em|px|rem)$/);
  if (!r)
    return Number.POSITIVE_INFINITY;
  const n = Number(r[1]), i = r[2];
  return i === "px" ? n : i === "em" ? n * (parseFloat(getComputedStyle(e).fontSize) || 16) : i === "rem" ? n * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) : Number.POSITIVE_INFINITY;
}, v1 = (t) => t.dataset.messageId, w1 = () => {
  const t = document.createElement("div");
  return t.dataset.auiTopAnchorReserve = "", t.style.height = "0px", t.style.flexShrink = "0", t.style.pointerEvents = "none", t.setAttribute("aria-hidden", "true"), t;
}, qa = (t, e) => {
  const r = `${e}px`;
  return t.style.height !== r ? (t.style.height = r, !0) : !1;
}, y1 = (t) => {
  const e = window.devicePixelRatio || 1;
  return Math.round(t * e) / e;
}, Zd = () => {
  const t = A(4), e = J();
  let r;
  t[0] !== e ? (r = () => e.message(), t[0] = e, t[1] = r) : r = t[1];
  const n = $(r);
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
}, x1 = () => {
  const t = A(2), e = Kt(I1);
  let r;
  return t[0] !== e ? (r = (n) => {
    var i;
    return n.message.role === "user" && n.message.index > 0 && n.message.index === n.thread.messages.length - 2 && ((i = n.thread.messages.at(-1)) == null ? void 0 : i.role) === "assistant" && (n.message.id === e || n.thread.isRunning);
  }, t[0] = e, t[1] = r) : r = t[1], $(r);
}, k1 = () => {
  const t = A(2), e = Kt(E1);
  let r;
  return t[0] !== e ? (r = (n) => {
    var i;
    return n.message.isLast && n.message.role === "assistant" && n.message.index >= 1 && ((i = n.thread.messages.at(n.message.index - 1)) == null ? void 0 : i.role) === "user" && (n.message.id === e || n.thread.isRunning);
  }, t[0] = e, t[1] = r) : r = t[1], $(r);
}, _1 = (t, e) => {
  const r = A(3);
  let n;
  return r[0] !== t || r[1] !== e ? (n = (i) => {
    if (t)
      return e.getState().registerAnchorElement(i);
  }, r[0] = t, r[1] = e, r[2] = n) : n = r[2], Xt(n);
}, S1 = (t) => {
  const e = A(3), { active: r, threadViewportStore: n } = t;
  let i;
  return e[0] !== r || e[1] !== n ? (i = (o) => {
    if (!r)
      return;
    const s = n.getState(), a = s.topAnchorMessageClamp;
    return s.registerAnchorTargetElement(o, {
      tallerThan: Va(a.tallerThan, o),
      visibleHeight: Va(a.visibleHeight, o)
    });
  }, e[0] = r, e[1] = n, e[2] = i) : i = e[2], Xt(i);
}, C1 = (t) => {
  const e = A(7);
  let r, n;
  e[0] !== t ? ({ forwardedRef: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]);
  const i = Zd(), o = Yt(r, i), s = $(A1);
  let a;
  return e[3] !== s || e[4] !== n || e[5] !== o ? (a = /* @__PURE__ */ m(he.div, {
    ...n,
    ref: o,
    "data-message-id": s
  }), e[3] = s, e[4] = n, e[5] = o, e[6] = a) : a = e[6], a;
}, T1 = (t) => {
  const e = A(13);
  let r, n, i;
  e[0] !== t ? ({ forwardedRef: r, threadViewportStore: i, ...n } = t, e[0] = t, e[1] = r, e[2] = n, e[3] = i) : (r = e[1], n = e[2], i = e[3]);
  const o = Zd(), s = x1(), a = k1(), l = _1(s, i);
  let c;
  e[4] !== a || e[5] !== i ? (c = {
    active: a,
    threadViewportStore: i
  }, e[4] = a, e[5] = i, e[6] = c) : c = e[6];
  const d = S1(c), u = Yt(r, o, l, d), h = $(R1), p = s ? "" : void 0, f = a ? "" : void 0;
  let g;
  return e[7] !== h || e[8] !== n || e[9] !== u || e[10] !== p || e[11] !== f ? (g = /* @__PURE__ */ m(he.div, {
    ...n,
    ref: u,
    "data-message-id": h,
    "data-aui-top-anchor-user": p,
    "data-aui-top-anchor-target": f
  }), e[7] = h, e[8] = n, e[9] = u, e[10] = p, e[11] = f, e[12] = g) : g = e[12], g;
}, eh = te((t, e) => {
  const r = A(7), n = Qt();
  if (n.getState().turnAnchor === "top") {
    let o;
    return r[0] !== e || r[1] !== t || r[2] !== n ? (o = /* @__PURE__ */ m(T1, {
      ...t,
      forwardedRef: e,
      threadViewportStore: n
    }), r[0] = e, r[1] = t, r[2] = n, r[3] = o) : o = r[3], o;
  }
  let i;
  return r[4] !== e || r[5] !== t ? (i = /* @__PURE__ */ m(C1, {
    ...t,
    forwardedRef: e
  }), r[4] = e, r[5] = t, r[6] = i) : i = r[6], i;
});
eh.displayName = "MessagePrimitive.Root";
function I1(t) {
  var e;
  return (e = t.topAnchorTurn) == null ? void 0 : e.anchorId;
}
function E1(t) {
  var e;
  return (e = t.topAnchorTurn) == null ? void 0 : e.targetId;
}
function A1(t) {
  return t.message.id;
}
function R1(t) {
  return t.message.id;
}
const xi = {
  ...Ie,
  Text: () => /* @__PURE__ */ V("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ m(Qo, {}), /* @__PURE__ */ m(jo, { children: /* @__PURE__ */ m("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Image: () => /* @__PURE__ */ m(Yo, {})
}, to = (t) => {
  const e = A(10);
  if ("children" in t) {
    let a;
    return e[0] !== t.children ? (a = /* @__PURE__ */ m(Ji, { children: t.children }), e[0] = t.children, e[1] = a) : a = e[1], a;
  }
  let r, n;
  e[2] !== t ? ({ components: r, ...n } = t, e[2] = t, e[3] = r, e[4] = n) : (r = e[3], n = e[4]);
  let i;
  e[5] !== r ? (i = r ? {
    Text: r.Text ?? xi.Text,
    Image: r.Image ?? xi.Image,
    Reasoning: r.Reasoning ?? Ie.Reasoning,
    Source: r.Source ?? Ie.Source,
    File: r.File ?? Ie.File,
    Unstable_Audio: r.Unstable_Audio ?? Ie.Unstable_Audio,
    ..."ChainOfThought" in r ? { ChainOfThought: r.ChainOfThought } : {
      tools: r.tools,
      data: r.data,
      ToolGroup: r.ToolGroup ?? Ie.ToolGroup,
      ReasoningGroup: r.ReasoningGroup ?? Ie.ReasoningGroup
    },
    Empty: r.Empty,
    Quote: r.Quote,
    generativeUI: r.generativeUI
  } : xi, e[5] = r, e[6] = i) : i = e[6];
  const o = i;
  let s;
  return e[7] !== n || e[8] !== o ? (s = /* @__PURE__ */ m(Ji, {
    components: o,
    ...n
  }), e[7] = n, e[8] = o, e[9] = s) : s = e[9], s;
};
to.displayName = "MessagePrimitive.Parts";
const th = (t) => {
  const { children: e } = t;
  return id() !== void 0 ? e : null;
};
th.displayName = "MessagePrimitive.Error";
const P1 = (t) => {
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
}, M1 = (t) => {
  const e = A(4), r = $(j1);
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
}, D1 = (t) => {
  const e = A(9);
  let r, n;
  e[0] !== t ? ({ Fallback: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]);
  let i;
  e[3] !== r || e[4] !== n.toolName ? (i = (a) => {
    const l = a.tools.tools[n.toolName] ?? r;
    return Array.isArray(l) ? l[0] ?? r : l;
  }, e[3] = r, e[4] = n.toolName, e[5] = i) : i = e[5];
  const o = $(i);
  if (!o)
    return null;
  let s;
  return e[6] !== o || e[7] !== n ? (s = /* @__PURE__ */ m(o, { ...n }), e[6] = o, e[7] = n, e[8] = s) : s = e[8], s;
}, N1 = (t) => {
  const e = A(9);
  let r, n;
  e[0] !== t ? ({ Fallback: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]);
  let i;
  e[3] !== r || e[4] !== n.name ? (i = (a) => {
    const l = a.dataRenderers.renderers[n.name] ?? r;
    return Array.isArray(l) ? l[0] ?? r : l;
  }, e[3] = r, e[4] = n.name, e[5] = i) : i = e[5];
  const o = $(i);
  if (!o)
    return null;
  let s;
  return e[6] !== o || e[7] !== n ? (s = /* @__PURE__ */ m(o, { ...n }), e[6] = o, e[7] = n, e[8] = s) : s = e[8], s;
}, xt = {
  Text: () => /* @__PURE__ */ V("p", {
    style: { whiteSpace: "pre-line" },
    children: [/* @__PURE__ */ m(Qo, {}), /* @__PURE__ */ m(jo, { children: /* @__PURE__ */ m("span", {
      style: { fontFamily: "revert" },
      children: " ●"
    }) })]
  }),
  Reasoning: () => null,
  Source: () => null,
  Image: () => /* @__PURE__ */ m(Yo, {}),
  File: () => null,
  Unstable_Audio: () => null,
  Group: ({ children: t }) => t
}, z1 = (t) => {
  var M, R, P;
  const e = A(43), { components: r } = t;
  let n;
  e[0] !== r ? (n = r === void 0 ? {} : r, e[0] = r, e[1] = n) : n = e[1];
  const { Text: i, Reasoning: o, Image: s, Source: a, File: l, Unstable_Audio: c, tools: d, data: u } = n, h = i === void 0 ? xt.Text : i, p = o === void 0 ? xt.Reasoning : o, f = s === void 0 ? xt.Image : s, g = a === void 0 ? xt.Source : a, v = l === void 0 ? xt.File : l, b = c === void 0 ? xt.Unstable_Audio : c;
  let _;
  e[2] !== d ? (_ = d === void 0 ? {} : d, e[2] = d, e[3] = _) : _ = e[3];
  const k = _, I = J(), E = $(V1), y = E.type;
  if (y === "tool-call") {
    let x;
    e[4] !== I ? (x = I.part(), e[4] = I, e[5] = x) : x = e[5];
    const T = x.addToolResult;
    let D;
    e[6] !== I ? (D = I.part(), e[6] = I, e[7] = D) : D = e[7];
    const N = D.resumeToolCall;
    let O;
    e[8] !== I ? (O = I.part(), e[8] = I, e[9] = O) : O = e[9];
    const L = O.respondToToolApproval;
    if ("Override" in k) {
      let B;
      return e[10] !== T || e[11] !== E || e[12] !== L || e[13] !== N || e[14] !== k.Override ? (B = /* @__PURE__ */ m(k.Override, {
        ...E,
        addResult: T,
        resume: N,
        respondToApproval: L
      }), e[10] = T, e[11] = E, e[12] = L, e[13] = N, e[14] = k.Override, e[15] = B) : B = e[15], B;
    }
    const j = ((M = k.by_name) == null ? void 0 : M[E.toolName]) ?? k.Fallback;
    let G;
    return e[16] !== j || e[17] !== T || e[18] !== E || e[19] !== L || e[20] !== N ? (G = /* @__PURE__ */ m(D1, {
      ...E,
      Fallback: j,
      addResult: T,
      resume: N,
      respondToApproval: L
    }), e[16] = j, e[17] = T, e[18] = E, e[19] = L, e[20] = N, e[21] = G) : G = e[21], G;
  }
  if (((R = E.status) == null ? void 0 : R.type) === "requires-action")
    throw new Error("Encountered unexpected requires-action status");
  switch (y) {
    case "text": {
      let x;
      return e[22] !== h || e[23] !== E ? (x = /* @__PURE__ */ m(h, { ...E }), e[22] = h, e[23] = E, e[24] = x) : x = e[24], x;
    }
    case "reasoning": {
      let x;
      return e[25] !== p || e[26] !== E ? (x = /* @__PURE__ */ m(p, { ...E }), e[25] = p, e[26] = E, e[27] = x) : x = e[27], x;
    }
    case "source": {
      let x;
      return e[28] !== g || e[29] !== E ? (x = /* @__PURE__ */ m(g, { ...E }), e[28] = g, e[29] = E, e[30] = x) : x = e[30], x;
    }
    case "image": {
      let x;
      return e[31] !== f || e[32] !== E ? (x = /* @__PURE__ */ m(f, { ...E }), e[31] = f, e[32] = E, e[33] = x) : x = e[33], x;
    }
    case "file": {
      let x;
      return e[34] !== v || e[35] !== E ? (x = /* @__PURE__ */ m(v, { ...E }), e[34] = v, e[35] = E, e[36] = x) : x = e[36], x;
    }
    case "audio": {
      let x;
      return e[37] !== b || e[38] !== E ? (x = /* @__PURE__ */ m(b, { ...E }), e[37] = b, e[38] = E, e[39] = x) : x = e[39], x;
    }
    case "data": {
      const x = ((P = u == null ? void 0 : u.by_name) == null ? void 0 : P[E.name]) ?? (u == null ? void 0 : u.Fallback);
      let T;
      return e[40] !== x || e[41] !== E ? (T = /* @__PURE__ */ m(N1, {
        ...E,
        Fallback: x
      }), e[40] = x, e[41] = E, e[42] = T) : T = e[42], T;
    }
    default:
      return console.warn(`Unknown message part type: ${y}`), null;
  }
}, O1 = (t) => {
  const e = A(5), { partIndex: r, components: n } = t;
  let i;
  e[0] !== n ? (i = /* @__PURE__ */ m(z1, { components: n }), e[0] = n, e[1] = i) : i = e[1];
  let o;
  return e[2] !== r || e[3] !== i ? (o = /* @__PURE__ */ m(Do, {
    index: r,
    children: i
  }), e[2] = r, e[3] = i, e[4] = o) : o = e[4], o;
}, L1 = we(O1, (t, e) => {
  var r, n, i, o, s, a, l, c, d, u, h, p, f, g, v, b, _, k;
  return t.partIndex === e.partIndex && ((r = t.components) == null ? void 0 : r.Text) === ((n = e.components) == null ? void 0 : n.Text) && ((i = t.components) == null ? void 0 : i.Reasoning) === ((o = e.components) == null ? void 0 : o.Reasoning) && ((s = t.components) == null ? void 0 : s.Source) === ((a = e.components) == null ? void 0 : a.Source) && ((l = t.components) == null ? void 0 : l.Image) === ((c = e.components) == null ? void 0 : c.Image) && ((d = t.components) == null ? void 0 : d.File) === ((u = e.components) == null ? void 0 : u.File) && ((h = t.components) == null ? void 0 : h.Unstable_Audio) === ((p = e.components) == null ? void 0 : p.Unstable_Audio) && ((f = t.components) == null ? void 0 : f.tools) === ((g = e.components) == null ? void 0 : g.tools) && ((v = t.components) == null ? void 0 : v.data) === ((b = e.components) == null ? void 0 : b.data) && ((_ = t.components) == null ? void 0 : _.Group) === ((k = e.components) == null ? void 0 : k.Group);
}), $1 = (t) => {
  const e = A(6), { status: r, component: n } = t, i = r.type === "running";
  let o;
  e[0] !== n || e[1] !== r ? (o = /* @__PURE__ */ m(n, {
    type: "text",
    text: "",
    status: r
  }), e[0] = n, e[1] = r, e[2] = o) : o = e[2];
  let s;
  return e[3] !== i || e[4] !== o ? (s = /* @__PURE__ */ m(No, {
    text: "",
    isRunning: i,
    children: o
  }), e[3] = i, e[4] = o, e[5] = s) : s = e[5], s;
}, B1 = Object.freeze({ type: "complete" }), F1 = (t) => {
  const e = A(6), { components: r } = t, n = $(q1);
  if (r != null && r.Empty) {
    let s;
    return e[0] !== r.Empty || e[1] !== n ? (s = /* @__PURE__ */ m(r.Empty, { status: n }), e[0] = r.Empty, e[1] = n, e[2] = s) : s = e[2], s;
  }
  const i = (r == null ? void 0 : r.Text) ?? xt.Text;
  let o;
  return e[3] !== n || e[4] !== i ? (o = /* @__PURE__ */ m($1, {
    status: n,
    component: i
  }), e[3] = n, e[4] = i, e[5] = o) : o = e[5], o;
}, U1 = we(F1, (t, e) => {
  var r, n, i, o;
  return ((r = t.components) == null ? void 0 : r.Empty) === ((n = e.components) == null ? void 0 : n.Empty) && ((i = t.components) == null ? void 0 : i.Text) === ((o = e.components) == null ? void 0 : o.Text);
}), Jo = (t) => {
  const e = A(9), { groupingFunction: r, components: n } = t, i = $(H1), o = M1(r);
  let s;
  e: {
    if (i === 0) {
      let d;
      e[0] !== n ? (d = /* @__PURE__ */ m(U1, { components: n }), e[0] = n, e[1] = d) : d = e[1], s = d;
      break e;
    }
    let c;
    if (e[2] !== n || e[3] !== o) {
      let d;
      e[5] !== n ? (d = (u, h) => /* @__PURE__ */ m((n == null ? void 0 : n.Group) ?? xt.Group, {
        groupKey: u.groupKey,
        indices: u.indices,
        children: u.indices.map((p) => /* @__PURE__ */ m(L1, {
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
  return e[7] !== a ? (l = /* @__PURE__ */ m(it, { children: a }), e[7] = a, e[8] = l) : l = e[8], l;
};
Jo.displayName = "MessagePrimitive.Unstable_PartsGrouped";
const rh = (t) => {
  const e = A(6);
  let r, n;
  e[0] !== t ? ({ components: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]);
  let i;
  return e[3] !== r || e[4] !== n ? (i = /* @__PURE__ */ m(Jo, {
    ...n,
    components: r,
    groupingFunction: P1
  }), e[3] = r, e[4] = n, e[5] = i) : i = e[5], i;
};
rh.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
function j1(t) {
  return t.message.parts;
}
function V1(t) {
  return t.part;
}
function q1(t) {
  return t.message.status ?? B1;
}
function H1(t) {
  return t.message.parts.length;
}
var gr = /* @__PURE__ */ Jt({
  AttachmentByIndex: () => Ku,
  Attachments: () => Qu,
  Content: () => to,
  Error: () => th,
  GenerativeUI: () => zu,
  GroupedParts: () => Hu,
  If: () => yd,
  PartByIndex: () => Lr,
  Parts: () => to,
  Quote: () => Gu,
  Root: () => eh,
  Unstable_PartsGrouped: () => Jo,
  Unstable_PartsGroupedByParentId: () => rh
});
const G1 = (t) => {
  const e = A(2), r = qt(t);
  let n;
  return e[0] !== r ? (n = (i) => {
    const o = new ResizeObserver(() => {
      r();
    }), s = new MutationObserver((a) => {
      a.some(W1) && r();
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
function W1(t) {
  return t.type !== "attributes" || t.attributeName !== "style";
}
const K1 = ({ autoScroll: t, scrollToBottomOnRunStart: e = !0, scrollToBottomOnInitialize: r = !0, scrollToBottomOnThreadSwitch: n = !0 }) => {
  const i = Z(null), o = $((I) => I.thread.messages.length > 0), s = Z(!1), a = Z(null), l = Qt();
  t === void 0 && (t = l.getState().turnAnchor !== "top");
  const c = Z(0), d = Z(0), u = Z(0), h = Z(0), p = Z(null), f = _t((I) => {
    const E = i.current;
    E && (p.current = I, E.scrollTo({
      top: E.scrollHeight,
      behavior: I
    }));
  }, []), g = _t((I) => {
    p.current = I, a.current !== null && cancelAnimationFrame(a.current), a.current = requestAnimationFrame(() => {
      a.current = null, f(I);
    });
  }, [f]);
  jr(() => () => {
    a.current !== null && cancelAnimationFrame(a.current);
  }, []);
  const v = _t(() => {
    const I = l.getState();
    return I.turnAnchor === "top" && I.element.viewport === i.current && I.element.anchor !== null;
  }, [l]), b = () => {
    const I = i.current;
    if (!I)
      return;
    const E = l.getState().isAtBottom, y = Math.abs(I.scrollHeight - I.scrollTop - I.clientHeight) <= 1 || I.scrollHeight <= I.clientHeight;
    !y && c.current < I.scrollTop || (y ? I.scrollHeight > I.clientHeight + 1 && (p.current = null) : c.current > I.scrollTop && d.current === I.scrollHeight && (p.current = null), (y || p.current === null) && y !== E && On(l).setState({ isAtBottom: y })), c.current = I.scrollTop, d.current = I.scrollHeight;
  }, _ = G1(() => {
    const I = i.current;
    if (!I)
      return;
    const { scrollHeight: E, clientHeight: y } = I;
    if (E === u.current && y === h.current)
      return;
    u.current = E, h.current = y;
    const M = p.current;
    M && v() ? p.current = null : M ? f(M) : t && l.getState().isAtBottom && f("instant"), b();
  }), k = Xt((I) => {
    const E = () => {
      p.current = null;
    };
    return I.addEventListener("scroll", b), I.addEventListener("pointerdown", E), () => {
      I.removeEventListener("scroll", b), I.removeEventListener("pointerdown", E);
    };
  });
  return jr(() => {
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
  ]), Rd(({ behavior: I }) => {
    f(I);
  }), qr("thread.runStart", () => {
    e && l.getState().turnAnchor !== "top" && g("auto");
  }), qr("threadListItem.switchedTo", () => {
    n && g("instant");
  }), Yt(_, k, i);
}, nh = te((t, e) => {
  const r = A(3);
  let n;
  return r[0] !== t || r[1] !== e ? (n = /* @__PURE__ */ m(he.div, {
    ...t,
    ref: e
  }), r[0] = t, r[1] = e, r[2] = n) : n = r[2], n;
});
nh.displayName = "ThreadPrimitive.Root";
const ih = (t) => {
  const { children: e } = t;
  return $(Q1) ? e : null;
};
ih.displayName = "ThreadPrimitive.Empty";
function Q1(t) {
  return t.thread.isEmpty;
}
const Y1 = (t) => {
  const e = A(4);
  let r;
  return e[0] !== t.disabled || e[1] !== t.empty || e[2] !== t.running ? (r = (n) => !(t.empty === !0 && !n.thread.isEmpty || t.empty === !1 && n.thread.isEmpty || t.running === !0 && !n.thread.isRunning || t.running === !1 && n.thread.isRunning || t.disabled === !0 && !n.thread.isDisabled || t.disabled === !1 && n.thread.isDisabled), e[0] = t.disabled, e[1] = t.empty, e[2] = t.running, e[3] = r) : r = e[3], $(r);
}, oh = (t) => {
  const e = A(3);
  let r, n;
  return e[0] !== t ? ({ children: r, ...n } = t, e[0] = t, e[1] = r, e[2] = n) : (r = e[1], n = e[2]), Y1(n) ? r : null;
};
oh.displayName = "ThreadPrimitive.If";
const sh = (t, e) => {
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
}, Ha = (t) => {
  let e = 0, r = t;
  for (; r; )
    e += r.offsetTop, r = r.offsetParent;
  return e;
}, J1 = (t, e) => {
  let r = 0, n = t;
  for (; n && n !== e; )
    r += n.offsetTop, n = n.offsetParent;
  return n === e ? r : Ha(t) - Ha(e);
}, ah = ({ viewport: t, anchor: e, tallerThan: r, visibleHeight: n }) => {
  const i = J1(e, t), o = e.offsetHeight;
  return i + Math.max(0, o - (o <= r ? o : n));
}, X1 = ({ scrollHeight: t, ...e }) => {
  const { viewport: r } = e, n = ah(e) + r.clientHeight;
  return Math.max(0, n - t);
}, Z1 = ({ viewport: t, reserve: e, ...r }) => X1({
  viewport: t,
  ...r,
  scrollHeight: t.scrollHeight - e.offsetHeight
}), ek = (t) => {
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
}, tk = (t) => {
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
}, rk = (t) => {
  let e = null, r;
  function n() {
    const a = t.getState(), { viewport: l, anchor: c, target: d } = a.element, u = a.targetConfig;
    if (a.turnAnchor !== "top" || !l || !c || !d || !u) {
      o.disconnect(), e && (qa(e, 0), e.remove());
      return;
    }
    if (e ?? (e = w1()), (e.parentElement !== d.parentElement || e.previousElementSibling !== d) && d.after(e), o.target(l, c, d), qa(e, Z1({
      viewport: l,
      anchor: c,
      reserve: e,
      ...u
    }))) {
      i.schedule();
      return;
    }
    const h = v1(c);
    if (h !== void 0 && r === h)
      return;
    const p = y1(ah({
      viewport: l,
      anchor: c,
      ...u
    }));
    Math.abs(l.scrollTop - p) > 1 && l.scrollTo({
      top: p,
      behavior: "smooth"
    }), h !== void 0 && (r = h);
  }
  const i = tk(n), o = ek(i.schedule);
  i.schedule();
  const s = t.subscribe(i.schedule);
  return () => {
    i.cancel(), s(), o.disconnect(), e == null || e.remove();
  };
}, nk = (t) => {
  const e = A(4), r = Qt();
  let n, i;
  e[0] !== t || e[1] !== r ? (n = () => {
    if (t)
      return rk(r);
  }, i = [t, r], e[0] = t, e[1] = r, e[2] = n, e[3] = i) : (n = e[2], i = e[3]), jr(n, i);
}, lh = ({ isRunning: t, messages: e }) => {
  if (!t)
    return null;
  const r = e.at(-1), n = e.at(-2);
  return (n == null ? void 0 : n.role) !== "user" || (r == null ? void 0 : r.role) !== "assistant" ? null : {
    anchorId: n.id,
    targetId: r.id
  };
}, ik = (t) => {
  var e;
  return (e = lh(t)) == null ? void 0 : e.anchorId;
}, ok = (t) => {
  var e;
  return (e = lh(t)) == null ? void 0 : e.targetId;
}, sk = () => sh(Kt(ck), uk), ak = () => Xt(Kt(dk)), lk = (t) => {
  const e = A(13), r = Qt();
  let n;
  e[0] !== t ? (n = (p) => {
    if (t)
      return ik(p.thread);
  }, e[0] = t, e[1] = n) : n = e[1];
  const i = $(n);
  let o;
  e[2] !== t ? (o = (p) => {
    if (t)
      return ok(p.thread);
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
  e[7] !== l || e[8] !== r ? (c = () => {
    if (!l)
      return;
    const p = r.getState(), f = p.topAnchorTurn;
    (f == null ? void 0 : f.anchorId) === l.anchorId && f.targetId === l.targetId || p.setTopAnchorTurn(l);
  }, d = [l, r], e[7] = l, e[8] = r, e[9] = c, e[10] = d) : (c = e[9], d = e[10]), jr(c, d);
  let u;
  e[11] !== r ? (u = () => {
    r.getState().setTopAnchorTurn(null);
  }, e[11] = r, e[12] = u) : u = e[12];
  const h = u;
  qr("thread.initialize", h), qr("threadListItem.switchedTo", h);
}, ch = te((t, e) => {
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
  const d = K1(c), u = sk(), h = ak(), p = Qt();
  let f;
  r[12] !== p ? (f = p.getState(), r[12] = p, r[13] = f) : f = r[13];
  const g = f.turnAnchor === "top";
  lk(g), nk(g);
  const v = Yt(e, d, u, h);
  let b;
  return r[14] !== i || r[15] !== v || r[16] !== o ? (b = /* @__PURE__ */ m(he.div, {
    ...o,
    ref: v,
    children: i
  }), r[14] = i, r[15] = v, r[16] = o, r[17] = b) : b = r[17], b;
});
ch.displayName = "ThreadPrimitive.ViewportScrollable";
const uh = te((t, e) => {
  const r = A(13);
  let n, i, o;
  r[0] !== t ? ({ turnAnchor: o, topAnchorMessageClamp: i, ...n } = t, r[0] = t, r[1] = n, r[2] = i, r[3] = o) : (n = r[1], i = r[2], o = r[3]);
  let s;
  r[4] !== i || r[5] !== o ? (s = {
    turnAnchor: o,
    topAnchorMessageClamp: i
  }, r[4] = i, r[5] = o, r[6] = s) : s = r[6];
  let a;
  r[7] !== n || r[8] !== e ? (a = /* @__PURE__ */ m(ch, {
    ...n,
    ref: e
  }), r[7] = n, r[8] = e, r[9] = a) : a = r[9];
  let l;
  return r[10] !== s || r[11] !== a ? (l = /* @__PURE__ */ m(Vo, {
    options: s,
    children: a
  }), r[10] = s, r[11] = a, r[12] = l) : l = r[12], l;
});
uh.displayName = "ThreadPrimitive.Viewport";
function ck(t) {
  return t.registerViewport;
}
function uk(t) {
  return t.clientHeight;
}
function dk(t) {
  return t.registerViewportElement;
}
const dh = te((t, e) => {
  const r = A(3), n = Yt(e, sh(Kt(hk), pk));
  let i;
  return r[0] !== t || r[1] !== n ? (i = /* @__PURE__ */ m(he.div, {
    ...t,
    ref: n
  }), r[0] = t, r[1] = n, r[2] = i) : i = r[2], i;
});
dh.displayName = "ThreadPrimitive.ViewportFooter";
function hk(t) {
  return t.registerContentInset;
}
function pk(t) {
  const e = parseFloat(getComputedStyle(t).marginTop) || 0;
  return t.offsetHeight + e;
}
const fk = (t) => {
  const e = A(5);
  let r;
  e[0] !== t ? (r = t === void 0 ? {} : t, e[0] = t, e[1] = r) : r = e[1];
  const { behavior: n } = r, i = Kt(gk), o = Qt();
  let s;
  e[2] !== n || e[3] !== o ? (s = () => {
    o.getState().scrollToBottom({ behavior: n });
  }, e[2] = n, e[3] = o, e[4] = s) : s = e[4];
  const a = s;
  return i ? null : a;
}, mk = ot("ThreadPrimitive.ScrollToBottom", fk, ["behavior"]);
function gk(t) {
  return t.isAtBottom;
}
const bk = (t) => {
  const e = A(4), { prompt: r, send: n, clearComposer: i, autoSend: o } = t, s = n ?? o ?? !1;
  let a;
  e[0] !== i || e[1] !== r || e[2] !== s ? (a = {
    prompt: r,
    send: s,
    clearComposer: i
  }, e[0] = i, e[1] = r, e[2] = s, e[3] = a) : a = e[3];
  const { disabled: l, trigger: c } = qy(a);
  return l ? null : c;
}, vk = ot("ThreadPrimitive.Suggestion", bk, [
  "prompt",
  "send",
  "clearComposer",
  "autoSend",
  "method"
]);
var ur = /* @__PURE__ */ Jt({
  Empty: () => ih,
  If: () => oh,
  MessageByIndex: () => Ru,
  Messages: () => mw,
  Root: () => nh,
  ScrollToBottom: () => mk,
  Suggestion: () => vk,
  SuggestionByIndex: () => td,
  Suggestions: () => py,
  Unstable_MessageById: () => Pu,
  Viewport: () => uh,
  ViewportFooter: () => dh,
  ViewportProvider: () => Vo
});
const wk = () => {
  const t = A(7), e = J().part.source !== null;
  let r;
  t[0] !== e ? (r = (u) => e && u.part.type === "tool-call" ? u.part.timing : void 0, t[0] = e, t[1] = r) : r = t[1];
  const n = $(r);
  let i;
  t[2] !== e ? (i = (u) => e && u.part.type === "tool-call" && u.part.status.type === "running", t[2] = e, t[3] = i) : i = t[3];
  const o = $(i), s = n !== void 0 && n.completedAt === void 0 && o, [a, l] = ve(yk);
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
function yk() {
  return Date.now();
}
var xk = /* @__PURE__ */ Jt({
  AssistantRuntimeImpl: () => Oo,
  BaseAssistantRuntimeCore: () => Lo,
  CompositeContextProvider: () => Eo,
  DefaultThreadComposerRuntimeCore: () => wu,
  MessageRepository: () => bu,
  ThreadRuntimeImpl: () => pu,
  getAutoStatus: () => Ki,
  splitLocalRuntimeOptions: () => Zy,
  useComposerInputPluginRegistryOptional: () => ei,
  useSmooth: () => Yd,
  useSmoothStatus: () => p1,
  withSmoothContextProvider: () => h1
});
function kk(t) {
  const { commands: e, removeOnExecute: r } = t, n = Z(e);
  return n.current = e, ce(() => ({
    adapter: {
      categories: () => [],
      categoryItems: () => [],
      search: (i) => {
        const o = i.toLowerCase();
        return n.current.filter((s) => Sk(s, o)).map(_k);
      }
    },
    action: {
      onExecute: (i) => {
        var o;
        (o = n.current.find((s) => s.id === i.id)) == null || o.execute();
      },
      ...r !== void 0 ? { removeOnExecute: r } : {}
    },
    ...t.iconMap ? { iconMap: t.iconMap } : {},
    ...t.fallbackIcon ? { fallbackIcon: t.fallbackIcon } : {}
  }), [
    r,
    t.iconMap,
    t.fallbackIcon
  ]);
}
function _k(t) {
  return {
    id: t.id,
    type: "command",
    label: t.label ?? `/${t.id}`,
    ...t.description !== void 0 ? { description: t.description } : {},
    ...t.icon !== void 0 ? { metadata: { icon: t.icon } } : {}
  };
}
function Sk(t, e) {
  var r, n;
  return !!(!e || t.id.toLowerCase().includes(e) || (r = t.label) != null && r.toLowerCase().includes(e) || (n = t.description) != null && n.toLowerCase().includes(e));
}
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ck = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Tk = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, r, n) => n ? n.toUpperCase() : r.toLowerCase()
), Ga = (t) => {
  const e = Tk(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
}, hh = (...t) => t.filter((e, r, n) => !!e && e.trim() !== "" && n.indexOf(e) === r).join(" ").trim(), Ik = (t) => {
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
var Ek = {
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
const Ak = te(
  ({
    color: t = "currentColor",
    size: e = 24,
    strokeWidth: r = 2,
    absoluteStrokeWidth: n,
    className: i = "",
    children: o,
    iconNode: s,
    ...a
  }, l) => Ct(
    "svg",
    {
      ref: l,
      ...Ek,
      width: e,
      height: e,
      stroke: t,
      strokeWidth: n ? Number(r) * 24 / Number(e) : r,
      className: hh("lucide", i),
      ...!o && !Ik(a) && { "aria-hidden": "true" },
      ...a
    },
    [
      ...s.map(([c, d]) => Ct(c, d)),
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
    ({ className: n, ...i }, o) => Ct(Ak, {
      ref: o,
      iconNode: e,
      className: hh(
        `lucide-${Ck(Ga(t))}`,
        `lucide-${t}`,
        n
      ),
      ...i
    })
  );
  return r.displayName = Ga(t), r;
};
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rk = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
], Pk = Ae("arrow-down", Rk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mk = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
], Dk = Ae("arrow-up", Mk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nk = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
], ph = Ae("bot", Nk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zk = [
  ["path", { d: "M12 18V5", key: "adv99a" }],
  ["path", { d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4", key: "1e3is1" }],
  ["path", { d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5", key: "1gqd8o" }],
  ["path", { d: "M17.997 5.125a4 4 0 0 1 2.526 5.77", key: "iwvgf7" }],
  ["path", { d: "M18 18a4 4 0 0 0 2-7.464", key: "efp6ie" }],
  ["path", { d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517", key: "1gq6am" }],
  ["path", { d: "M6 18a4 4 0 0 1-2-7.464", key: "k1g0md" }],
  ["path", { d: "M6.003 5.125a4 4 0 0 0-2.526 5.77", key: "q97ue3" }]
], fh = Ae("brain", zk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ok = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], Xo = Ae("check", Ok);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lk = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], Zo = Ae("chevron-down", Lk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $k = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
], mh = Ae("circle-alert", $k);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bk = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
], Fk = Ae("circle-x", Bk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Uk = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
], gh = Ae("copy", Uk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jk = [
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
], Vk = Ae("file-text", jk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qk = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], Hk = Ae("loader-circle", qk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gk = [
  ["path", { d: "M12 2v4", key: "3427ic" }],
  ["path", { d: "m16.2 7.8 2.9-2.9", key: "r700ao" }],
  ["path", { d: "M18 12h4", key: "wj9ykh" }],
  ["path", { d: "m16.2 16.2 2.9 2.9", key: "1bxg5t" }],
  ["path", { d: "M12 18v4", key: "jadmvz" }],
  ["path", { d: "m4.9 19.1 2.9-2.9", key: "bwix9q" }],
  ["path", { d: "M2 12h4", key: "j09sii" }],
  ["path", { d: "m4.9 4.9 2.9 2.9", key: "giyufr" }]
], bh = Ae("loader", Gk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wk = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], Kk = Ae("plus", Wk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qk = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
], Yk = Ae("rotate-ccw", Qk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jk = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
], Xk = Ae("square", Jk);
/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zk = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], e_ = Ae("x", Zk);
function vh(t) {
  var e, r, n = "";
  if (typeof t == "string" || typeof t == "number")
    n += t;
  else if (typeof t == "object")
    if (Array.isArray(t)) {
      var i = t.length;
      for (e = 0; e < i; e++)
        t[e] && (r = vh(t[e])) && (n && (n += " "), n += r);
    } else
      for (r in t)
        t[r] && (n && (n += " "), n += r);
  return n;
}
function wh() {
  for (var t, e, r = 0, n = "", i = arguments.length; r < i; r++)
    (t = arguments[r]) && (e = vh(t)) && (n && (n += " "), n += e);
  return n;
}
const t_ = (t, e) => {
  const r = new Array(t.length + e.length);
  for (let n = 0; n < t.length; n++)
    r[n] = t[n];
  for (let n = 0; n < e.length; n++)
    r[t.length + n] = e[n];
  return r;
}, r_ = (t, e) => ({
  classGroupId: t,
  validator: e
}), yh = (t = /* @__PURE__ */ new Map(), e = null, r) => ({
  nextPart: t,
  validators: e,
  classGroupId: r
}), $n = "-", Wa = [], n_ = "arbitrary..", i_ = (t) => {
  const e = s_(t), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: n
  } = t;
  return {
    getClassGroupId: (s) => {
      if (s.startsWith("[") && s.endsWith("]"))
        return o_(s);
      const a = s.split($n), l = a[0] === "" && a.length > 1 ? 1 : 0;
      return xh(a, l, e);
    },
    getConflictingClassGroupIds: (s, a) => {
      if (a) {
        const l = n[s], c = r[s];
        return l ? c ? t_(c, l) : l : c || Wa;
      }
      return r[s] || Wa;
    }
  };
}, xh = (t, e, r) => {
  if (t.length - e === 0)
    return r.classGroupId;
  const i = t[e], o = r.nextPart.get(i);
  if (o) {
    const c = xh(t, e + 1, o);
    if (c)
      return c;
  }
  const s = r.validators;
  if (s === null)
    return;
  const a = e === 0 ? t.join($n) : t.slice(e).join($n), l = s.length;
  for (let c = 0; c < l; c++) {
    const d = s[c];
    if (d.validator(a))
      return d.classGroupId;
  }
}, o_ = (t) => t.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const e = t.slice(1, -1), r = e.indexOf(":"), n = e.slice(0, r);
  return n ? n_ + n : void 0;
})(), s_ = (t) => {
  const {
    theme: e,
    classGroups: r
  } = t;
  return a_(r, e);
}, a_ = (t, e) => {
  const r = yh();
  for (const n in t) {
    const i = t[n];
    es(i, r, n, e);
  }
  return r;
}, es = (t, e, r, n) => {
  const i = t.length;
  for (let o = 0; o < i; o++) {
    const s = t[o];
    l_(s, e, r, n);
  }
}, l_ = (t, e, r, n) => {
  if (typeof t == "string") {
    c_(t, e, r);
    return;
  }
  if (typeof t == "function") {
    u_(t, e, r, n);
    return;
  }
  d_(t, e, r, n);
}, c_ = (t, e, r) => {
  const n = t === "" ? e : kh(e, t);
  n.classGroupId = r;
}, u_ = (t, e, r, n) => {
  if (h_(t)) {
    es(t(n), e, r, n);
    return;
  }
  e.validators === null && (e.validators = []), e.validators.push(r_(r, t));
}, d_ = (t, e, r, n) => {
  const i = Object.entries(t), o = i.length;
  for (let s = 0; s < o; s++) {
    const [a, l] = i[s];
    es(l, kh(e, a), r, n);
  }
}, kh = (t, e) => {
  let r = t;
  const n = e.split($n), i = n.length;
  for (let o = 0; o < i; o++) {
    const s = n[o];
    let a = r.nextPart.get(s);
    a || (a = yh(), r.nextPart.set(s, a)), r = a;
  }
  return r;
}, h_ = (t) => "isThemeGetter" in t && t.isThemeGetter === !0, p_ = (t) => {
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
}, ro = "!", Ka = ":", f_ = [], Qa = (t, e, r, n, i) => ({
  modifiers: t,
  hasImportantModifier: e,
  baseClassName: r,
  maybePostfixModifierPosition: n,
  isExternal: i
}), m_ = (t) => {
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
        if (v === Ka) {
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
    u.endsWith(ro) ? (h = u.slice(0, -1), p = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      u.startsWith(ro) && (h = u.slice(1), p = !0)
    );
    const f = c && c > l ? c - l : void 0;
    return Qa(o, p, h, f);
  };
  if (e) {
    const i = e + Ka, o = n;
    n = (s) => s.startsWith(i) ? o(s.slice(i.length)) : Qa(f_, !1, s, void 0, !0);
  }
  if (r) {
    const i = n;
    n = (o) => r({
      className: o,
      parseClassName: i
    });
  }
  return n;
}, g_ = (t) => {
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
}, b_ = (t) => ({
  cache: p_(t.cacheSize),
  parseClassName: m_(t),
  sortModifiers: g_(t),
  postfixLookupClassGroupIds: v_(t),
  ...i_(t)
}), v_ = (t) => {
  const e = /* @__PURE__ */ Object.create(null), r = t.postfixLookupClassGroups;
  if (r)
    for (let n = 0; n < r.length; n++)
      e[r[n]] = !0;
  return e;
}, w_ = /\s+/, y_ = (t, e) => {
  const {
    parseClassName: r,
    getClassGroupId: n,
    getConflictingClassGroupIds: i,
    sortModifiers: o,
    postfixLookupClassGroupIds: s
  } = e, a = [], l = t.trim().split(w_);
  let c = "";
  for (let d = l.length - 1; d >= 0; d -= 1) {
    const u = l[d], {
      isExternal: h,
      modifiers: p,
      hasImportantModifier: f,
      baseClassName: g,
      maybePostfixModifierPosition: v
    } = r(u);
    if (h) {
      c = u + (c.length > 0 ? " " + c : c);
      continue;
    }
    let b = !!v, _;
    if (b) {
      const M = g.substring(0, v);
      _ = n(M);
      const R = _ && s[_] ? n(g) : void 0;
      R && R !== _ && (_ = R, b = !1);
    } else
      _ = n(g);
    if (!_) {
      if (!b) {
        c = u + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (_ = n(g), !_) {
        c = u + (c.length > 0 ? " " + c : c);
        continue;
      }
      b = !1;
    }
    const k = p.length === 0 ? "" : p.length === 1 ? p[0] : o(p).join(":"), I = f ? k + ro : k, E = I + _;
    if (a.indexOf(E) > -1)
      continue;
    a.push(E);
    const y = i(_, b);
    for (let M = 0; M < y.length; ++M) {
      const R = y[M];
      a.push(I + R);
    }
    c = u + (c.length > 0 ? " " + c : c);
  }
  return c;
}, x_ = (...t) => {
  let e = 0, r, n, i = "";
  for (; e < t.length; )
    (r = t[e++]) && (n = _h(r)) && (i && (i += " "), i += n);
  return i;
}, _h = (t) => {
  if (typeof t == "string")
    return t;
  let e, r = "";
  for (let n = 0; n < t.length; n++)
    t[n] && (e = _h(t[n])) && (r && (r += " "), r += e);
  return r;
}, k_ = (t, ...e) => {
  let r, n, i, o;
  const s = (l) => {
    const c = e.reduce((d, u) => u(d), t());
    return r = b_(c), n = r.cache.get, i = r.cache.set, o = a, a(l);
  }, a = (l) => {
    const c = n(l);
    if (c)
      return c;
    const d = y_(l, r);
    return i(l, d), d;
  };
  return o = s, (...l) => o(x_(...l));
}, __ = [], Se = (t) => {
  const e = (r) => r[t] || __;
  return e.isThemeGetter = !0, e;
}, Sh = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Ch = /^\((?:(\w[\w-]*):)?(.+)\)$/i, S_ = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, C_ = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, T_ = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, I_ = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, E_ = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, A_ = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, wt = (t) => S_.test(t), re = (t) => !!t && !Number.isNaN(Number(t)), at = (t) => !!t && Number.isInteger(Number(t)), ki = (t) => t.endsWith("%") && re(t.slice(0, -1)), bt = (t) => C_.test(t), Th = () => !0, R_ = (t) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  T_.test(t) && !I_.test(t)
), ts = () => !1, P_ = (t) => E_.test(t), M_ = (t) => A_.test(t), D_ = (t) => !q(t) && !H(t), N_ = (t) => t.startsWith("@container") && (t[10] === "/" && t[11] !== void 0 || t[11] === "s" && t[16] !== void 0 && t.startsWith("-size/", 10) || t[11] === "n" && t[18] !== void 0 && t.startsWith("-normal/", 10)), z_ = (t) => At(t, Ah, ts), q = (t) => Sh.test(t), Dt = (t) => At(t, Rh, R_), Ya = (t) => At(t, V_, re), O_ = (t) => At(t, Mh, Th), L_ = (t) => At(t, Ph, ts), Ja = (t) => At(t, Ih, ts), $_ = (t) => At(t, Eh, M_), bn = (t) => At(t, Dh, P_), H = (t) => Ch.test(t), Mr = (t) => Zt(t, Rh), B_ = (t) => Zt(t, Ph), Xa = (t) => Zt(t, Ih), F_ = (t) => Zt(t, Ah), U_ = (t) => Zt(t, Eh), vn = (t) => Zt(t, Dh, !0), j_ = (t) => Zt(t, Mh, !0), At = (t, e, r) => {
  const n = Sh.exec(t);
  return n ? n[1] ? e(n[1]) : r(n[2]) : !1;
}, Zt = (t, e, r = !1) => {
  const n = Ch.exec(t);
  return n ? n[1] ? e(n[1]) : r : !1;
}, Ih = (t) => t === "position" || t === "percentage", Eh = (t) => t === "image" || t === "url", Ah = (t) => t === "length" || t === "size" || t === "bg-size", Rh = (t) => t === "length", V_ = (t) => t === "number", Ph = (t) => t === "family-name", Mh = (t) => t === "number" || t === "weight", Dh = (t) => t === "shadow", q_ = () => {
  const t = Se("color"), e = Se("font"), r = Se("text"), n = Se("font-weight"), i = Se("tracking"), o = Se("leading"), s = Se("breakpoint"), a = Se("container"), l = Se("spacing"), c = Se("radius"), d = Se("shadow"), u = Se("inset-shadow"), h = Se("text-shadow"), p = Se("drop-shadow"), f = Se("blur"), g = Se("perspective"), v = Se("aspect"), b = Se("ease"), _ = Se("animate"), k = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], I = () => [
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
  ], E = () => [...I(), H, q], y = () => ["auto", "hidden", "clip", "visible", "scroll"], M = () => ["auto", "contain", "none"], R = () => [H, q, l], P = () => [wt, "full", "auto", ...R()], x = () => [at, "none", "subgrid", H, q], T = () => ["auto", {
    span: ["full", at, H, q]
  }, at, H, q], D = () => [at, "auto", H, q], N = () => ["auto", "min", "max", "fr", H, q], O = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], L = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], j = () => ["auto", ...R()], G = () => [wt, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...R()], B = () => [wt, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...R()], W = () => [wt, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...R()], w = () => [t, H, q], ie = () => [...I(), Xa, Ja, {
    position: [H, q]
  }], de = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], S = () => ["auto", "cover", "contain", F_, z_, {
    size: [H, q]
  }], xe = () => [ki, Mr, Dt], pe = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    c,
    H,
    q
  ], ae = () => ["", re, Mr, Dt], st = () => ["solid", "dashed", "dotted", "double"], Ye = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], be = () => [re, ki, Xa, Ja], pt = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    f,
    H,
    q
  ], ft = () => ["none", re, H, q], rr = () => ["none", re, H, q], Tr = () => [re, H, q], nr = () => [wt, "full", ...R()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [bt],
      breakpoint: [bt],
      color: [Th],
      container: [bt],
      "drop-shadow": [bt],
      ease: ["in", "out", "in-out"],
      font: [D_],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [bt],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [bt],
      shadow: [bt],
      spacing: ["px", re],
      text: [bt],
      "text-shadow": [bt],
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
        aspect: ["auto", "square", wt, q, H, v]
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
        "@container": ["", "normal", "size", H, q]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [N_],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [re, q, H, a]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": k()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": k()
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
        inset: P()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": P()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": P()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": P(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: P()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": P(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: P()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": P()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": P()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: P()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: P()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: P()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: P()
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
        z: [at, "auto", H, q]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [wt, "full", "auto", a, ...R()]
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
        flex: [re, wt, "auto", "initial", "none", q]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", re, H, q]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", re, H, q]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [at, "first", "last", "none", H, q]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": x()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: T()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": D()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": D()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": x()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: T()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": D()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": D()
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
        justify: [...O(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...L(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...L()]
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
        items: [...L(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...L(), {
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
        "place-items": [...L(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...L()]
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
        text: ["base", r, Mr, Dt]
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
        font: [n, j_, O_]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", ki, q]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [B_, L_, e]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [q]
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
        tracking: [i, H, q]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [re, "none", H, Ya]
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
        "list-image": ["none", H, q]
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
        list: ["disc", "decimal", "none", H, q]
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
        decoration: [...st(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [re, "from-font", "auto", H, Dt]
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
        "underline-offset": [re, "auto", H, q]
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
        tab: [at, H, q]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", H, q]
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
        content: ["none", H, q]
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
          }, at, H, q],
          radial: ["", H, q],
          conic: [at, H, q]
        }, U_, $_]
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
        border: [...st(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...st(), "hidden", "none"]
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
        outline: [...st(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [re, H, q]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", re, Mr, Dt]
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
          vn,
          bn
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
        "inset-shadow": ["none", u, vn, bn]
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
        "ring-offset": [re, Dt]
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
        "text-shadow": ["none", h, vn, bn]
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
        opacity: [re, H, q]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Ye(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Ye()
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
        "mask-radial": [H, q]
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
        "mask-radial-at": I()
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
        mask: ["none", H, q]
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
          H,
          q
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: pt()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [re, H, q]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [re, H, q]
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
          vn,
          bn
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
        grayscale: ["", re, H, q]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [re, H, q]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", re, H, q]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [re, H, q]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", re, H, q]
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
          H,
          q
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": pt()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [re, H, q]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [re, H, q]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", re, H, q]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [re, H, q]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", re, H, q]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [re, H, q]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [re, H, q]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", re, H, q]
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", H, q]
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
        duration: [re, "initial", H, q]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", b, H, q]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [re, H, q]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", _, H, q]
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
        perspective: [g, H, q]
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
        rotate: ft()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": ft()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": ft()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": ft()
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
        skew: Tr()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Tr()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Tr()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [H, q, "", "none", "gpu", "cpu"]
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
        zoom: [at, H, q]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", H, q]
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
        "will-change": ["auto", "scroll", "contents", "transform", H, q]
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
        stroke: [re, Mr, Dt, Ya]
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
}, H_ = /* @__PURE__ */ k_(q_);
function K(...t) {
  return H_(wh(t));
}
const G_ = window.UIComponents.Tooltip, W_ = window.UIComponents.TooltipContent, K_ = window.UIComponents.TooltipProvider, Q_ = window.UIComponents.TooltipTrigger, Y_ = window.UIComponents.Button, er = te(({ children: t, tooltip: e, side: r = "bottom", className: n, ...i }, o) => /* @__PURE__ */ m(K_, { delayDuration: 0, children: /* @__PURE__ */ V(G_, { children: [
  /* @__PURE__ */ m(Q_, { asChild: !0, children: /* @__PURE__ */ V(
    Y_,
    {
      variant: "ghost",
      size: "icon",
      ...i,
      className: K("aui-button-icon size-6 p-1 active:scale-90", n),
      ref: o,
      children: [
        /* @__PURE__ */ m(f0, { children: t }),
        /* @__PURE__ */ m("span", { className: "aui-sr-only sr-only", children: e })
      ]
    }
  ) }),
  /* @__PURE__ */ m(W_, { side: r, children: e })
] }) }));
er.displayName = "TooltipIconButton";
const J_ = window.UIComponents.Tooltip, X_ = window.UIComponents.TooltipContent, Z_ = window.UIComponents.TooltipTrigger, eS = window.UIComponents.Dialog, tS = window.UIComponents.DialogTitle, rS = window.UIComponents.DialogContent, nS = window.UIComponents.DialogTrigger, iS = window.UIComponents.Avatar, oS = window.UIComponents.AvatarImage, sS = window.UIComponents.AvatarFallback, aS = (t) => {
  const [e, r] = Ce(void 0);
  return It(() => {
    if (!t) {
      r(void 0);
      return;
    }
    const n = URL.createObjectURL(t);
    return r(n), () => {
      URL.revokeObjectURL(n);
    };
  }, [t]), e;
}, Nh = () => {
  const { file: t, src: e } = $(
    zn((r) => {
      var i, o;
      if (r.attachment.type !== "image")
        return {};
      if (r.attachment.file)
        return { file: r.attachment.file };
      const n = (o = (i = r.attachment.content) == null ? void 0 : i.filter((s) => s.type === "image")[0]) == null ? void 0 : o.image;
      return n ? { src: n } : {};
    })
  );
  return aS(t) ?? e;
}, lS = ({ src: t }) => {
  const [e, r] = Ce(!1);
  return /* @__PURE__ */ m(
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
}, cS = ({ children: t }) => {
  const e = Nh();
  return e ? /* @__PURE__ */ V(eS, { children: [
    /* @__PURE__ */ m(
      nS,
      {
        className: "aui-attachment-preview-trigger hover:bg-accent/50 cursor-pointer transition-colors",
        asChild: !0,
        children: t
      }
    ),
    /* @__PURE__ */ V(rS, { className: "aui-attachment-preview-dialog-content [&>button]:bg-foreground/60 [&_svg]:text-background [&>button]:hover:[&_svg]:text-destructive p-2 sm:max-w-3xl [&>button]:rounded-full [&>button]:p-1 [&>button]:opacity-100 [&>button]:ring-0!", children: [
      /* @__PURE__ */ m(tS, { className: "aui-sr-only sr-only", children: "Image Attachment Preview" }),
      /* @__PURE__ */ m("div", { className: "aui-attachment-preview bg-background relative mx-auto flex max-h-[80dvh] w-full items-center justify-center overflow-hidden", children: /* @__PURE__ */ m(lS, { src: e }) })
    ] })
  ] }) : t;
}, uS = () => {
  const t = Nh();
  return /* @__PURE__ */ V(iS, { className: "aui-attachment-tile-avatar h-full w-full rounded-none", children: [
    /* @__PURE__ */ m(
      oS,
      {
        src: t,
        alt: "Attachment preview",
        className: "aui-attachment-tile-image object-cover"
      }
    ),
    /* @__PURE__ */ m(sS, { children: /* @__PURE__ */ m(Vk, { className: "aui-attachment-tile-fallback-icon text-muted-foreground size-8" }) })
  ] });
}, zh = () => {
  const e = J().attachment.source !== "message", r = $((l) => l.attachment.type === "image"), n = $((l) => {
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
  return /* @__PURE__ */ V(J_, { children: [
    /* @__PURE__ */ V(
      Zi.Root,
      {
        className: K(
          "aui-attachment-root relative",
          r && !e && "aui-attachment-root-message only:*:first:size-24"
        ),
        children: [
          /* @__PURE__ */ m(cS, { children: /* @__PURE__ */ m(Z_, { asChild: !0, children: /* @__PURE__ */ V(
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
                /* @__PURE__ */ m(uS, {}),
                o && /* @__PURE__ */ m(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "aui-attachment-tile-uploading bg-background/60 absolute inset-0 flex items-center justify-center backdrop-blur-[1px]",
                    children: /* @__PURE__ */ m(Hk, { className: "text-muted-foreground size-5 animate-spin" })
                  }
                ),
                s && /* @__PURE__ */ m(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "aui-attachment-tile-error bg-destructive/10 absolute inset-0 flex items-center justify-center",
                    children: /* @__PURE__ */ m(mh, { className: "text-destructive size-5" })
                  }
                )
              ]
            }
          ) }) }),
          e && /* @__PURE__ */ m(dS, {})
        ]
      }
    ),
    /* @__PURE__ */ V(X_, { side: "top", children: [
      /* @__PURE__ */ m(Zi.Name, {}),
      a && /* @__PURE__ */ m("p", { className: "aui-attachment-error-message", children: a })
    ] })
  ] });
}, dS = () => /* @__PURE__ */ m(Zi.Remove, { asChild: !0, children: /* @__PURE__ */ m(
  er,
  {
    tooltip: "Remove file",
    className: "aui-attachment-tile-remove text-muted-foreground hover:[&_svg]:text-destructive absolute end-1.5 top-1.5 size-3.5 rounded-full bg-white opacity-100 shadow-sm hover:bg-white! [&_svg]:text-black",
    side: "top",
    children: /* @__PURE__ */ m(e_, { className: "aui-attachment-remove-icon size-3 dark:stroke-[2.5px]" })
  }
) }), hS = () => /* @__PURE__ */ m("div", { className: "aui-user-message-attachments-end col-span-full col-start-1 row-start-1 flex w-full flex-row justify-end gap-2", children: /* @__PURE__ */ m(gr.Attachments, { children: () => /* @__PURE__ */ m(zh, {}) }) }), pS = () => /* @__PURE__ */ m("div", { className: "aui-composer-attachments flex w-full flex-row items-center gap-2 overflow-x-auto empty:hidden", children: /* @__PURE__ */ m(Fe.Attachments, { children: () => /* @__PURE__ */ m(zh, {}) }) }), fS = () => /* @__PURE__ */ m(Fe.AddAttachment, { asChild: !0, children: /* @__PURE__ */ m(
  er,
  {
    tooltip: "Add Attachment",
    side: "bottom",
    variant: "ghost",
    size: "icon",
    className: "aui-composer-add-attachment hover:bg-muted-foreground/15 dark:border-muted-foreground/15 dark:hover:bg-muted-foreground/30 size-7 rounded-full p-1 text-xs font-semibold",
    "aria-label": "Add Attachment",
    children: /* @__PURE__ */ m(Kk, { className: "aui-attachment-add-icon size-4.5 stroke-[1.5px]" })
  }
) }), mS = (t, e) => typeof t == "string" ? t === e : JSON.stringify(t) === JSON.stringify(e), gS = (t, e) => {
  if (!t || !e)
    return !1;
  const r = (n) => {
    const { position: i, data: o, ...s } = n || {};
    return s;
  };
  return JSON.stringify(r(t.properties)) === JSON.stringify(r(e.properties)) && mS(t.children, e.children);
}, rs = (t, e) => gS(t.node, e.node), bS = (t = {}) => Object.fromEntries(Object.entries(t ?? {}).map(([e, r]) => {
  if (!r)
    return [e, r];
  const n = r;
  return [e, we(({ node: o, ...s }) => /* @__PURE__ */ m(n, { ...s }), rs)];
})), ns = bo(null), Oh = () => en(ns) !== null, vS = ({ children: t, ...e }) => /* @__PURE__ */ m(ns.Provider, {
  value: e,
  children: t
}), wS = we(vS, rs), yS = ({ node: t, ...e }) => /* @__PURE__ */ m("pre", { ...e }), xS = ({ node: t, ...e }) => /* @__PURE__ */ m("code", { ...e }), is = ({ node: t, components: { Pre: e, Code: r }, code: n }) => /* @__PURE__ */ m(e, { children: /* @__PURE__ */ m(r, {
  node: t,
  children: n
}) }), kS = () => null, _S = ({ node: t, components: { Pre: e, Code: r, SyntaxHighlighter: n, CodeHeader: i }, language: o, code: s }) => {
  const a = kt(() => ({
    Pre: e,
    Code: r
  }), [e, r]);
  return /* @__PURE__ */ V(it, { children: [/* @__PURE__ */ m(i, {
    node: t,
    language: o,
    code: s
  }), /* @__PURE__ */ m(o ? n : is, {
    node: t,
    components: a,
    language: o ?? "unknown",
    code: s
  })] });
};
var Lh = { exports: {} };
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
})(Lh);
var SS = Lh.exports;
const $h = /* @__PURE__ */ Yn(SS), Za = ({ className: t, ...e }) => ({ className: r, ...n }) => ({
  className: $h(t, r),
  ...e,
  ...n
}), CS = ({ node: t, components: { Pre: e, Code: r, SyntaxHighlighter: n, CodeHeader: i }, componentsByLanguage: o = {}, children: s, ...a }) => {
  var p, f, g;
  const l = Za(en(ns)), c = qt((v) => /* @__PURE__ */ m(e, { ...l(v) })), d = Za(a), u = qt((v) => /* @__PURE__ */ m(r, { ...d(v) })), h = ((p = /language-(\w+)/.exec(a.className || "")) == null ? void 0 : p[1]) ?? "";
  return typeof s != "string" ? /* @__PURE__ */ m(is, {
    node: t,
    components: {
      Pre: c,
      Code: u
    },
    code: s
  }) : /* @__PURE__ */ m(_S, {
    node: t,
    components: {
      Pre: c,
      Code: u,
      SyntaxHighlighter: ((f = o[h]) == null ? void 0 : f.SyntaxHighlighter) ?? n,
      CodeHeader: ((g = o[h]) == null ? void 0 : g.CodeHeader) ?? i
    },
    language: h || "unknown",
    code: s
  });
}, TS = ({ node: t, components: e, componentsByLanguage: r, ...n }) => Oh() ? /* @__PURE__ */ m(CS, {
  node: t,
  components: e,
  componentsByLanguage: r,
  ...n
}) : /* @__PURE__ */ m(e.Code, { ...n }), IS = we(TS, (t, e) => t.components === e.components && t.componentsByLanguage === e.componentsByLanguage && rs(t, e));
function ES(t, e) {
  const r = e || {};
  return (t[t.length - 1] === "" ? [...t, ""] : t).join(
    (r.padRight ? " " : "") + "," + (r.padLeft === !1 ? "" : " ")
  ).trim();
}
const AS = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, RS = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u, PS = {};
function el(t, e) {
  return ((e || PS).jsx ? RS : AS).test(t);
}
const MS = /[ \t\n\f\r]/g;
function DS(t) {
  return typeof t == "object" ? t.type === "text" ? tl(t.value) : !1 : tl(t);
}
function tl(t) {
  return t.replace(MS, "") === "";
}
class on {
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
on.prototype.normal = {};
on.prototype.property = {};
on.prototype.space = void 0;
function Bh(t, e) {
  const r = {}, n = {};
  for (const i of t)
    Object.assign(r, i.property), Object.assign(n, i.normal);
  return new on(r, n, e);
}
function no(t) {
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
let NS = 0;
const X = tr(), ke = tr(), io = tr(), F = tr(), me = tr(), Bt = tr(), Le = tr();
function tr() {
  return 2 ** ++NS;
}
const oo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean: X,
  booleanish: ke,
  commaOrSpaceSeparated: Le,
  commaSeparated: Bt,
  number: F,
  overloadedBoolean: io,
  spaceSeparated: me
}, Symbol.toStringTag, { value: "Module" })), _i = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(oo)
);
class os extends ze {
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
    if (super(e, r), rl(this, "space", i), typeof n == "number")
      for (; ++o < _i.length; ) {
        const s = _i[o];
        rl(this, _i[o], (n & oo[s]) === oo[s]);
      }
  }
}
os.prototype.defined = !0;
function rl(t, e, r) {
  r && (t[e] = r);
}
function kr(t) {
  const e = {}, r = {};
  for (const [n, i] of Object.entries(t.properties)) {
    const o = new os(
      n,
      t.transform(t.attributes || {}, n),
      i,
      t.space
    );
    t.mustUseProperty && t.mustUseProperty.includes(n) && (o.mustUseProperty = !0), e[n] = o, r[no(n)] = n, r[no(o.attribute)] = n;
  }
  return new on(e, r, t.space);
}
const Fh = kr({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: ke,
    ariaAutoComplete: null,
    ariaBusy: ke,
    ariaChecked: ke,
    ariaColCount: F,
    ariaColIndex: F,
    ariaColSpan: F,
    ariaControls: me,
    ariaCurrent: null,
    ariaDescribedBy: me,
    ariaDetails: null,
    ariaDisabled: ke,
    ariaDropEffect: me,
    ariaErrorMessage: null,
    ariaExpanded: ke,
    ariaFlowTo: me,
    ariaGrabbed: ke,
    ariaHasPopup: null,
    ariaHidden: ke,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: me,
    ariaLevel: F,
    ariaLive: null,
    ariaModal: ke,
    ariaMultiLine: ke,
    ariaMultiSelectable: ke,
    ariaOrientation: null,
    ariaOwns: me,
    ariaPlaceholder: null,
    ariaPosInSet: F,
    ariaPressed: ke,
    ariaReadOnly: ke,
    ariaRelevant: null,
    ariaRequired: ke,
    ariaRoleDescription: me,
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
function Uh(t, e) {
  return e in t ? t[e] : e;
}
function jh(t, e) {
  return Uh(t, e.toLowerCase());
}
const zS = kr({
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
    accept: Bt,
    acceptCharset: me,
    accessKey: me,
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
    autoComplete: me,
    autoFocus: X,
    autoPlay: X,
    blocking: me,
    capture: null,
    charSet: null,
    checked: X,
    cite: null,
    className: me,
    closedBy: null,
    colorSpace: null,
    cols: F,
    colSpan: F,
    command: null,
    commandFor: null,
    content: null,
    contentEditable: ke,
    controls: X,
    controlsList: me,
    coords: F | Bt,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: X,
    defer: X,
    dir: null,
    dirName: null,
    disabled: X,
    download: io,
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
    headers: me,
    height: F,
    hidden: io,
    high: F,
    href: null,
    hrefLang: null,
    htmlFor: me,
    httpEquiv: me,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: X,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: X,
    itemId: null,
    itemProp: me,
    itemRef: me,
    itemScope: X,
    itemType: me,
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
    ping: me,
    placeholder: null,
    playsInline: X,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: X,
    referrerPolicy: null,
    rel: me,
    required: X,
    reversed: X,
    rows: F,
    rowSpan: F,
    sandbox: me,
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
    archive: me,
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
    exportParts: Bt,
    part: me,
    prefix: null,
    property: null,
    results: F,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: jh
}), OS = kr({
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
    className: me,
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
    g1: Bt,
    g2: Bt,
    glyphName: Bt,
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
    ping: me,
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
  transform: Uh
}), Vh = kr({
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
}), qh = kr({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: jh
}), Hh = kr({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(t, e) {
    return "xml:" + e.slice(3).toLowerCase();
  }
}), LS = {
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
}, $S = /[A-Z]/g, nl = /-[a-z]/g, BS = /^data[-\w.:]+$/i;
function FS(t, e) {
  const r = no(e);
  let n = e, i = ze;
  if (r in t.normal)
    return t.property[t.normal[r]];
  if (r.length > 4 && r.slice(0, 4) === "data" && BS.test(e)) {
    if (e.charAt(4) === "-") {
      const o = e.slice(5).replace(nl, jS);
      n = "data" + o.charAt(0).toUpperCase() + o.slice(1);
    } else {
      const o = e.slice(4);
      if (!nl.test(o)) {
        let s = o.replace($S, US);
        s.charAt(0) !== "-" && (s = "-" + s), e = "data" + s;
      }
    }
    i = os;
  }
  return new i(n, e);
}
function US(t) {
  return "-" + t.toLowerCase();
}
function jS(t) {
  return t.charAt(1).toUpperCase();
}
const VS = Bh([Fh, zS, Vh, qh, Hh], "html"), ss = Bh([Fh, OS, Vh, qh, Hh], "svg");
function qS(t) {
  return t.join(" ").trim();
}
var as = {}, il = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, HS = /\n/g, GS = /^\s*/, WS = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, KS = /^:\s*/, QS = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, YS = /^[;\s]*/, JS = /^\s+|\s+$/g, XS = `
`, ol = "/", sl = "*", $t = "", ZS = "comment", eC = "declaration";
function tC(t, e) {
  if (typeof t != "string")
    throw new TypeError("First argument must be a string");
  if (!t)
    return [];
  e = e || {};
  var r = 1, n = 1;
  function i(f) {
    var g = f.match(HS);
    g && (r += g.length);
    var v = f.lastIndexOf(XS);
    n = ~v ? f.length - v : n + f.length;
  }
  function o() {
    var f = { line: r, column: n };
    return function(g) {
      return g.position = new s(f), c(), g;
    };
  }
  function s(f) {
    this.start = f, this.end = { line: r, column: n }, this.source = e.source;
  }
  s.prototype.content = t;
  function a(f) {
    var g = new Error(
      e.source + ":" + r + ":" + n + ": " + f
    );
    if (g.reason = f, g.filename = e.source, g.line = r, g.column = n, g.source = t, !e.silent)
      throw g;
  }
  function l(f) {
    var g = f.exec(t);
    if (g) {
      var v = g[0];
      return i(v), t = t.slice(v.length), g;
    }
  }
  function c() {
    l(GS);
  }
  function d(f) {
    var g;
    for (f = f || []; g = u(); )
      g !== !1 && f.push(g);
    return f;
  }
  function u() {
    var f = o();
    if (!(ol != t.charAt(0) || sl != t.charAt(1))) {
      for (var g = 2; $t != t.charAt(g) && (sl != t.charAt(g) || ol != t.charAt(g + 1)); )
        ++g;
      if (g += 2, $t === t.charAt(g - 1))
        return a("End of comment missing");
      var v = t.slice(2, g - 2);
      return n += 2, i(v), t = t.slice(g), n += 2, f({
        type: ZS,
        comment: v
      });
    }
  }
  function h() {
    var f = o(), g = l(WS);
    if (g) {
      if (u(), !l(KS))
        return a("property missing ':'");
      var v = l(QS), b = f({
        type: eC,
        property: al(g[0].replace(il, $t)),
        value: v ? al(v[0].replace(il, $t)) : $t
      });
      return l(YS), b;
    }
  }
  function p() {
    var f = [];
    d(f);
    for (var g; g = h(); )
      g !== !1 && (f.push(g), d(f));
    return f;
  }
  return c(), p();
}
function al(t) {
  return t ? t.replace(JS, $t) : $t;
}
var rC = tC, nC = Rn && Rn.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
};
Object.defineProperty(as, "__esModule", { value: !0 });
as.default = oC;
const iC = nC(rC);
function oC(t, e) {
  let r = null;
  if (!t || typeof t != "string")
    return r;
  const n = (0, iC.default)(t), i = typeof e == "function";
  return n.forEach((o) => {
    if (o.type !== "declaration")
      return;
    const { property: s, value: a } = o;
    i ? e(s, a, o) : a && (r = r || {}, r[s] = a);
  }), r;
}
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
ti.camelCase = void 0;
var sC = /^--[a-zA-Z0-9_-]+$/, aC = /-([a-z])/g, lC = /^[^-]+$/, cC = /^-(webkit|moz|ms|o|khtml)-/, uC = /^-(ms)-/, dC = function(t) {
  return !t || lC.test(t) || sC.test(t);
}, hC = function(t, e) {
  return e.toUpperCase();
}, ll = function(t, e) {
  return "".concat(e, "-");
}, pC = function(t, e) {
  return e === void 0 && (e = {}), dC(t) ? t : (t = t.toLowerCase(), e.reactCompat ? t = t.replace(uC, ll) : t = t.replace(cC, ll), t.replace(aC, hC));
};
ti.camelCase = pC;
var fC = Rn && Rn.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
}, mC = fC(as), gC = ti;
function so(t, e) {
  var r = {};
  return !t || typeof t != "string" || (0, mC.default)(t, function(n, i) {
    n && i && (r[(0, gC.camelCase)(n, e)] = i);
  }), r;
}
so.default = so;
var bC = so;
const vC = /* @__PURE__ */ Yn(bC), Gh = Wh("end"), ls = Wh("start");
function Wh(t) {
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
function wC(t) {
  const e = ls(t), r = Gh(t);
  if (e && r)
    return { start: e, end: r };
}
function $r(t) {
  return !t || typeof t != "object" ? "" : "position" in t || "type" in t ? cl(t.position) : "start" in t || "end" in t ? cl(t) : "line" in t || "column" in t ? ao(t) : "";
}
function ao(t) {
  return ul(t && t.line) + ":" + ul(t && t.column);
}
function cl(t) {
  return ao(t && t.start) + "-" + ao(t && t.end);
}
function ul(t) {
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
    this.ancestors = o.ancestors || void 0, this.cause = o.cause || void 0, this.column = a ? a.column : void 0, this.fatal = void 0, this.file = "", this.message = i, this.line = a ? a.line : void 0, this.name = $r(o.place) || "1:1", this.place = o.place || void 0, this.reason = this.message, this.ruleId = o.ruleId || void 0, this.source = o.source || void 0, this.stack = s && o.cause && typeof o.cause.stack == "string" ? o.cause.stack : "", this.actual = void 0, this.expected = void 0, this.note = void 0, this.url = void 0;
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
const cs = {}.hasOwnProperty, yC = /* @__PURE__ */ new Map(), xC = /[A-Z]/g, kC = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"]), _C = /* @__PURE__ */ new Set(["td", "th"]), Kh = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function SC(t, e) {
  if (!e || e.Fragment === void 0)
    throw new TypeError("Expected `Fragment` in options");
  const r = e.filePath || void 0;
  let n;
  if (e.development) {
    if (typeof e.jsxDEV != "function")
      throw new TypeError(
        "Expected `jsxDEV` in options when `development: true`"
      );
    n = MC(r, e.jsxDEV);
  } else {
    if (typeof e.jsx != "function")
      throw new TypeError("Expected `jsx` in production options");
    if (typeof e.jsxs != "function")
      throw new TypeError("Expected `jsxs` in production options");
    n = PC(r, e.jsx, e.jsxs);
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
    schema: e.space === "svg" ? ss : VS,
    stylePropertyNameCase: e.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: e.tableCellAlignToStyle !== !1
  }, o = Qh(i, t, void 0);
  return o && typeof o != "string" ? o : i.create(
    t,
    i.Fragment,
    { children: o || void 0 },
    void 0
  );
}
function Qh(t, e, r) {
  if (e.type === "element")
    return CC(t, e, r);
  if (e.type === "mdxFlowExpression" || e.type === "mdxTextExpression")
    return TC(t, e);
  if (e.type === "mdxJsxFlowElement" || e.type === "mdxJsxTextElement")
    return EC(t, e, r);
  if (e.type === "mdxjsEsm")
    return IC(t, e);
  if (e.type === "root")
    return AC(t, e, r);
  if (e.type === "text")
    return RC(t, e);
}
function CC(t, e, r) {
  const n = t.schema;
  let i = n;
  e.tagName.toLowerCase() === "svg" && n.space === "html" && (i = ss, t.schema = i), t.ancestors.push(e);
  const o = Jh(t, e.tagName, !1), s = DC(t, e);
  let a = ds(t, e);
  return kC.has(e.tagName) && (a = a.filter(function(l) {
    return typeof l == "string" ? !DS(l) : !0;
  })), Yh(t, s, o, e), us(s, a), t.ancestors.pop(), t.schema = n, t.create(e, o, s, r);
}
function TC(t, e) {
  if (e.data && e.data.estree && t.evaluater) {
    const n = e.data.estree.body[0];
    return n.type, /** @type {Child | undefined} */
    t.evaluater.evaluateExpression(n.expression);
  }
  Wr(t, e.position);
}
function IC(t, e) {
  if (e.data && e.data.estree && t.evaluater)
    return (
      /** @type {Child | undefined} */
      t.evaluater.evaluateProgram(e.data.estree)
    );
  Wr(t, e.position);
}
function EC(t, e, r) {
  const n = t.schema;
  let i = n;
  e.name === "svg" && n.space === "html" && (i = ss, t.schema = i), t.ancestors.push(e);
  const o = e.name === null ? t.Fragment : Jh(t, e.name, !0), s = NC(t, e), a = ds(t, e);
  return Yh(t, s, o, e), us(s, a), t.ancestors.pop(), t.schema = n, t.create(e, o, s, r);
}
function AC(t, e, r) {
  const n = {};
  return us(n, ds(t, e)), t.create(e, t.Fragment, n, r);
}
function RC(t, e) {
  return e.value;
}
function Yh(t, e, r, n) {
  typeof r != "string" && r !== t.Fragment && t.passNode && (e.node = n);
}
function us(t, e) {
  if (e.length > 0) {
    const r = e.length > 1 ? e : e[0];
    r && (t.children = r);
  }
}
function PC(t, e, r) {
  return n;
  function n(i, o, s, a) {
    const c = Array.isArray(s.children) ? r : e;
    return a ? c(o, s, a) : c(o, s);
  }
}
function MC(t, e) {
  return r;
  function r(n, i, o, s) {
    const a = Array.isArray(o.children), l = ls(n);
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
function DC(t, e) {
  const r = {};
  let n, i;
  for (i in e.properties)
    if (i !== "children" && cs.call(e.properties, i)) {
      const o = zC(t, i, e.properties[i]);
      if (o) {
        const [s, a] = o;
        t.tableCellAlignToStyle && s === "align" && typeof a == "string" && _C.has(e.tagName) ? n = a : r[s] = a;
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
function NC(t, e) {
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
        Wr(t, e.position);
    else {
      const i = n.name;
      let o;
      if (n.value && typeof n.value == "object")
        if (n.value.data && n.value.data.estree && t.evaluater) {
          const a = n.value.data.estree.body[0];
          a.type, o = t.evaluater.evaluateExpression(a.expression);
        } else
          Wr(t, e.position);
      else
        o = n.value === null ? !0 : n.value;
      r[i] = /** @type {Props[keyof Props]} */
      o;
    }
  return r;
}
function ds(t, e) {
  const r = [];
  let n = -1;
  const i = t.passKeys ? /* @__PURE__ */ new Map() : yC;
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
    const a = Qh(t, o, s);
    a !== void 0 && r.push(a);
  }
  return r;
}
function zC(t, e, r) {
  const n = FS(t.schema, e);
  if (!(r == null || typeof r == "number" && Number.isNaN(r))) {
    if (Array.isArray(r) && (r = n.commaSeparated ? ES(r) : qS(r)), n.property === "style") {
      let i = typeof r == "object" ? r : OC(t, String(r));
      return t.stylePropertyNameCase === "css" && (i = LC(i)), ["style", i];
    }
    return [
      t.elementAttributeNameCase === "react" && n.space ? LS[n.property] || n.property : n.attribute,
      r
    ];
  }
}
function OC(t, e) {
  try {
    return vC(e, { reactCompat: !0 });
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
    throw i.file = t.filePath || void 0, i.url = Kh + "#cannot-parse-style-attribute", i;
  }
}
function Jh(t, e, r) {
  let n;
  if (!r)
    n = { type: "Literal", value: e };
  else if (e.includes(".")) {
    const i = e.split(".");
    let o = -1, s;
    for (; ++o < i.length; ) {
      const a = el(i[o]) ? { type: "Identifier", name: i[o] } : { type: "Literal", value: i[o] };
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
    n = el(e) && !/^[a-z]/.test(e) ? { type: "Identifier", name: e } : { type: "Literal", value: e };
  if (n.type === "Literal") {
    const i = (
      /** @type {string | number} */
      n.value
    );
    return cs.call(t.components, i) ? t.components[i] : i;
  }
  if (t.evaluater)
    return t.evaluater.evaluateExpression(n);
  Wr(t);
}
function Wr(t, e) {
  const r = new Re(
    "Cannot handle MDX estrees without `createEvaluater`",
    {
      ancestors: t.ancestors,
      place: e,
      ruleId: "mdx-estree",
      source: "hast-util-to-jsx-runtime"
    }
  );
  throw r.file = t.filePath || void 0, r.url = Kh + "#cannot-handle-mdx-estrees-without-createevaluater", r;
}
function LC(t) {
  const e = {};
  let r;
  for (r in t)
    cs.call(t, r) && (e[$C(r)] = t[r]);
  return e;
}
function $C(t) {
  let e = t.replace(xC, BC);
  return e.slice(0, 3) === "ms-" && (e = "-" + e), e;
}
function BC(t) {
  return "-" + t.toLowerCase();
}
const Si = {
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
}, FC = {};
function hs(t, e) {
  const r = e || FC, n = typeof r.includeImageAlt == "boolean" ? r.includeImageAlt : !0, i = typeof r.includeHtml == "boolean" ? r.includeHtml : !0;
  return Xh(t, n, i);
}
function Xh(t, e, r) {
  if (UC(t)) {
    if ("value" in t)
      return t.type === "html" && !r ? "" : t.value;
    if (e && "alt" in t && t.alt)
      return t.alt;
    if ("children" in t)
      return dl(t.children, e, r);
  }
  return Array.isArray(t) ? dl(t, e, r) : "";
}
function dl(t, e, r) {
  const n = [];
  let i = -1;
  for (; ++i < t.length; )
    n[i] = Xh(t[i], e, r);
  return n.join("");
}
function UC(t) {
  return !!(t && typeof t == "object");
}
const hl = document.createElement("i");
function ps(t) {
  const e = "&" + t + ";";
  hl.innerHTML = e;
  const r = hl.textContent;
  return r.charCodeAt(r.length - 1) === 59 && t !== "semi" || r === e ? !1 : r;
}
function Be(t, e, r, n) {
  const i = t.length;
  let o = 0, s;
  if (e < 0 ? e = -e > i ? 0 : i + e : e = e > i ? i : e, r = r > 0 ? r : 0, n.length < 1e4)
    s = Array.from(n), s.unshift(e, r), t.splice(...s);
  else
    for (r && t.splice(e, r); o < n.length; )
      s = n.slice(o, o + 1e4), s.unshift(e, 0), t.splice(...s), o += 1e4, e += 1e4;
}
function Ue(t, e) {
  return t.length > 0 ? (Be(t, t.length, 0, e), t) : e;
}
const pl = {}.hasOwnProperty;
function Zh(t) {
  const e = {};
  let r = -1;
  for (; ++r < t.length; )
    jC(e, t[r]);
  return e;
}
function jC(t, e) {
  let r;
  for (r in e) {
    const i = (pl.call(t, r) ? t[r] : void 0) || (t[r] = {}), o = e[r];
    let s;
    if (o)
      for (s in o) {
        pl.call(i, s) || (i[s] = []);
        const a = o[s];
        VC(
          // @ts-expect-error Looks like a list.
          i[s],
          Array.isArray(a) ? a : a ? [a] : []
        );
      }
  }
}
function VC(t, e) {
  let r = -1;
  const n = [];
  for (; ++r < e.length; )
    (e[r].add === "after" ? t : n).push(e[r]);
  Be(t, 0, 0, n);
}
function ep(t, e) {
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
function tt(t) {
  return t.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
const Me = Rt(/[A-Za-z]/), Ee = Rt(/[\dA-Za-z]/), qC = Rt(/[#-'*+\--9=?A-Z^-~]/);
function Bn(t) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    t !== null && (t < 32 || t === 127)
  );
}
const lo = Rt(/\d/), HC = Rt(/[\dA-Fa-f]/), GC = Rt(/[!-/:-@[-`{-~]/);
function Y(t) {
  return t !== null && t < -2;
}
function ge(t) {
  return t !== null && (t < 0 || t === 32);
}
function ne(t) {
  return t === -2 || t === -1 || t === 32;
}
const ri = Rt(/\p{P}|\p{S}/u), Ht = Rt(/\s/);
function Rt(t) {
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
const WC = {
  tokenize: KC
};
function KC(t) {
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
const QC = {
  tokenize: YC
}, fl = {
  tokenize: JC
};
function YC(t) {
  const e = this, r = [];
  let n = 0, i, o, s;
  return a;
  function a(k) {
    if (n < r.length) {
      const I = r[n];
      return e.containerState = I[1], t.attempt(I[0].continuation, l, c)(k);
    }
    return c(k);
  }
  function l(k) {
    if (n++, e.containerState._closeFlow) {
      e.containerState._closeFlow = void 0, i && _();
      const I = e.events.length;
      let E = I, y;
      for (; E--; )
        if (e.events[E][0] === "exit" && e.events[E][1].type === "chunkFlow") {
          y = e.events[E][1].end;
          break;
        }
      b(n);
      let M = I;
      for (; M < e.events.length; )
        e.events[M][1].end = {
          ...y
        }, M++;
      return Be(e.events, E + 1, 0, e.events.slice(I)), e.events.length = M, c(k);
    }
    return a(k);
  }
  function c(k) {
    if (n === r.length) {
      if (!i)
        return h(k);
      if (i.currentConstruct && i.currentConstruct.concrete)
        return f(k);
      e.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
    }
    return e.containerState = {}, t.check(fl, d, u)(k);
  }
  function d(k) {
    return i && _(), b(n), h(k);
  }
  function u(k) {
    return e.parser.lazy[e.now().line] = n !== r.length, s = e.now().offset, f(k);
  }
  function h(k) {
    return e.containerState = {}, t.attempt(fl, p, f)(k);
  }
  function p(k) {
    return n++, r.push([e.currentConstruct, e.containerState]), h(k);
  }
  function f(k) {
    if (k === null) {
      i && _(), b(0), t.consume(k);
      return;
    }
    return i = i || e.parser.flow(e.now()), t.enter("chunkFlow", {
      _tokenizer: i,
      contentType: "flow",
      previous: o
    }), g(k);
  }
  function g(k) {
    if (k === null) {
      v(t.exit("chunkFlow"), !0), b(0), t.consume(k);
      return;
    }
    return Y(k) ? (t.consume(k), v(t.exit("chunkFlow")), n = 0, e.interrupt = void 0, a) : (t.consume(k), g);
  }
  function v(k, I) {
    const E = e.sliceStream(k);
    if (I && E.push(null), k.previous = o, o && (o.next = k), o = k, i.defineSkip(k.start), i.write(E), e.parser.lazy[k.start.line]) {
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
      let R = M, P, x;
      for (; R--; )
        if (e.events[R][0] === "exit" && e.events[R][1].type === "chunkFlow") {
          if (P) {
            x = e.events[R][1].end;
            break;
          }
          P = !0;
        }
      for (b(n), y = M; y < e.events.length; )
        e.events[y][1].end = {
          ...x
        }, y++;
      Be(e.events, R + 1, 0, e.events.slice(M)), e.events.length = y;
    }
  }
  function b(k) {
    let I = r.length;
    for (; I-- > k; ) {
      const E = r[I];
      e.containerState = E[1], E[0].exit.call(e, t);
    }
    r.length = k;
  }
  function _() {
    i.write([null]), o = void 0, i = void 0, e.containerState._closeFlow = void 0;
  }
}
function JC(t, e, r) {
  return se(t, t.attempt(this.parser.constructs.document, e, r), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}
function br(t) {
  if (t === null || ge(t) || Ht(t))
    return 1;
  if (ri(t))
    return 2;
}
function ni(t, e, r) {
  const n = [];
  let i = -1;
  for (; ++i < t.length; ) {
    const o = t[i].resolveAll;
    o && !n.includes(o) && (e = o(e, r), n.push(o));
  }
  return e;
}
const co = {
  name: "attention",
  resolveAll: XC,
  tokenize: ZC
};
function XC(t, e) {
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
          ml(u, -l), ml(h, l), s = {
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
          }, c = [], t[n][1].end.offset - t[n][1].start.offset && (c = Ue(c, [["enter", t[n][1], e], ["exit", t[n][1], e]])), c = Ue(c, [["enter", i, e], ["enter", s, e], ["exit", s, e], ["enter", o, e]]), c = Ue(c, ni(e.parser.constructs.insideSpan.null, t.slice(n + 1, r), e)), c = Ue(c, [["exit", o, e], ["enter", a, e], ["exit", a, e], ["exit", i, e]]), t[r][1].end.offset - t[r][1].start.offset ? (d = 2, c = Ue(c, [["enter", t[r][1], e], ["exit", t[r][1], e]])) : d = 0, Be(t, n - 1, r - n + 3, c), r = n + c.length - d - 2;
          break;
        }
    }
  for (r = -1; ++r < t.length; )
    t[r][1].type === "attentionSequence" && (t[r][1].type = "data");
  return t;
}
function ZC(t, e) {
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
function ml(t, e) {
  t.column += e, t.offset += e, t._bufferIndex += e;
}
const eT = {
  name: "autolink",
  tokenize: tT
};
function tT(t, e, r) {
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
    return p === 62 ? (t.exit("autolinkProtocol"), t.enter("autolinkMarker"), t.consume(p), t.exit("autolinkMarker"), t.exit("autolink"), e) : p === null || p === 32 || p === 60 || Bn(p) ? r(p) : (t.consume(p), l);
  }
  function c(p) {
    return p === 64 ? (t.consume(p), d) : qC(p) ? (t.consume(p), c) : r(p);
  }
  function d(p) {
    return Ee(p) ? u(p) : r(p);
  }
  function u(p) {
    return p === 46 ? (t.consume(p), n = 0, d) : p === 62 ? (t.exit("autolinkProtocol").type = "autolinkEmail", t.enter("autolinkMarker"), t.consume(p), t.exit("autolinkMarker"), t.exit("autolink"), e) : h(p);
  }
  function h(p) {
    if ((p === 45 || Ee(p)) && n++ < 63) {
      const f = p === 45 ? h : u;
      return t.consume(p), f;
    }
    return r(p);
  }
}
const sn = {
  partial: !0,
  tokenize: rT
};
function rT(t, e, r) {
  return n;
  function n(o) {
    return ne(o) ? se(t, i, "linePrefix")(o) : i(o);
  }
  function i(o) {
    return o === null || Y(o) ? e(o) : r(o);
  }
}
const tp = {
  continuation: {
    tokenize: iT
  },
  exit: oT,
  name: "blockQuote",
  tokenize: nT
};
function nT(t, e, r) {
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
function iT(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    return ne(s) ? se(t, o, "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(s) : o(s);
  }
  function o(s) {
    return t.attempt(tp, e, r)(s);
  }
}
function oT(t) {
  t.exit("blockQuote");
}
const rp = {
  name: "characterEscape",
  tokenize: sT
};
function sT(t, e, r) {
  return n;
  function n(o) {
    return t.enter("characterEscape"), t.enter("escapeMarker"), t.consume(o), t.exit("escapeMarker"), i;
  }
  function i(o) {
    return GC(o) ? (t.enter("characterEscapeValue"), t.consume(o), t.exit("characterEscapeValue"), t.exit("characterEscape"), e) : r(o);
  }
}
const np = {
  name: "characterReference",
  tokenize: aT
};
function aT(t, e, r) {
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
    return u === 88 || u === 120 ? (t.enter("characterReferenceMarkerHexadecimal"), t.consume(u), t.exit("characterReferenceMarkerHexadecimal"), t.enter("characterReferenceValue"), o = 6, s = HC, d) : (t.enter("characterReferenceValue"), o = 7, s = lo, d(u));
  }
  function d(u) {
    if (u === 59 && i) {
      const h = t.exit("characterReferenceValue");
      return s === Ee && !ps(n.sliceSerialize(h)) ? r(u) : (t.enter("characterReferenceMarker"), t.consume(u), t.exit("characterReferenceMarker"), t.exit("characterReference"), e);
    }
    return s(u) && i++ < o ? (t.consume(u), d) : r(u);
  }
}
const gl = {
  partial: !0,
  tokenize: cT
}, bl = {
  concrete: !0,
  name: "codeFenced",
  tokenize: lT
};
function lT(t, e, r) {
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
    const M = n.events[n.events.length - 1];
    return o = M && M[1].type === "linePrefix" ? M[2].sliceSerialize(M[1], !0).length : 0, a = y, t.enter("codeFenced"), t.enter("codeFencedFence"), t.enter("codeFencedFenceSequence"), d(y);
  }
  function d(y) {
    return y === a ? (s++, t.consume(y), d) : s < 3 ? r(y) : (t.exit("codeFencedFenceSequence"), ne(y) ? se(t, u, "whitespace")(y) : u(y));
  }
  function u(y) {
    return y === null || Y(y) ? (t.exit("codeFencedFence"), n.interrupt ? e(y) : t.check(gl, g, I)(y)) : (t.enter("codeFencedFenceInfo"), t.enter("chunkString", {
      contentType: "string"
    }), h(y));
  }
  function h(y) {
    return y === null || Y(y) ? (t.exit("chunkString"), t.exit("codeFencedFenceInfo"), u(y)) : ne(y) ? (t.exit("chunkString"), t.exit("codeFencedFenceInfo"), se(t, p, "whitespace")(y)) : y === 96 && y === a ? r(y) : (t.consume(y), h);
  }
  function p(y) {
    return y === null || Y(y) ? u(y) : (t.enter("codeFencedFenceMeta"), t.enter("chunkString", {
      contentType: "string"
    }), f(y));
  }
  function f(y) {
    return y === null || Y(y) ? (t.exit("chunkString"), t.exit("codeFencedFenceMeta"), u(y)) : y === 96 && y === a ? r(y) : (t.consume(y), f);
  }
  function g(y) {
    return t.attempt(i, I, v)(y);
  }
  function v(y) {
    return t.enter("lineEnding"), t.consume(y), t.exit("lineEnding"), b;
  }
  function b(y) {
    return o > 0 && ne(y) ? se(t, _, "linePrefix", o + 1)(y) : _(y);
  }
  function _(y) {
    return y === null || Y(y) ? t.check(gl, g, I)(y) : (t.enter("codeFlowValue"), k(y));
  }
  function k(y) {
    return y === null || Y(y) ? (t.exit("codeFlowValue"), _(y)) : (t.consume(y), k);
  }
  function I(y) {
    return t.exit("codeFenced"), e(y);
  }
  function E(y, M, R) {
    let P = 0;
    return x;
    function x(L) {
      return y.enter("lineEnding"), y.consume(L), y.exit("lineEnding"), T;
    }
    function T(L) {
      return y.enter("codeFencedFence"), ne(L) ? se(y, D, "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(L) : D(L);
    }
    function D(L) {
      return L === a ? (y.enter("codeFencedFenceSequence"), N(L)) : R(L);
    }
    function N(L) {
      return L === a ? (P++, y.consume(L), N) : P >= s ? (y.exit("codeFencedFenceSequence"), ne(L) ? se(y, O, "whitespace")(L) : O(L)) : R(L);
    }
    function O(L) {
      return L === null || Y(L) ? (y.exit("codeFencedFence"), M(L)) : R(L);
    }
  }
}
function cT(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    return s === null ? r(s) : (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), o);
  }
  function o(s) {
    return n.parser.lazy[n.now().line] ? r(s) : e(s);
  }
}
const Ci = {
  name: "codeIndented",
  tokenize: dT
}, uT = {
  partial: !0,
  tokenize: hT
};
function dT(t, e, r) {
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
    return c === null ? l(c) : Y(c) ? t.attempt(uT, s, l)(c) : (t.enter("codeFlowValue"), a(c));
  }
  function a(c) {
    return c === null || Y(c) ? (t.exit("codeFlowValue"), s(c)) : (t.consume(c), a);
  }
  function l(c) {
    return t.exit("codeIndented"), e(c);
  }
}
function hT(t, e, r) {
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
const pT = {
  name: "codeText",
  previous: mT,
  resolve: fT,
  tokenize: gT
};
function fT(t) {
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
function mT(t) {
  return t !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function gT(t, e, r) {
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
class bT {
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
    return n && Dr(this.left, n), o.reverse();
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
    this.setCursor(Number.POSITIVE_INFINITY), Dr(this.left, e);
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
    this.setCursor(0), Dr(this.right, e.reverse());
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
        Dr(this.right, r.reverse());
      } else {
        const r = this.right.splice(this.left.length + this.right.length - e, Number.POSITIVE_INFINITY);
        Dr(this.left, r.reverse());
      }
  }
}
function Dr(t, e) {
  let r = 0;
  if (e.length < 1e4)
    t.push(...e);
  else
    for (; r < e.length; )
      t.push(...e.slice(r, r + 1e4)), r += 1e4;
}
function ip(t) {
  const e = {};
  let r = -1, n, i, o, s, a, l, c;
  const d = new bT(t);
  for (; ++r < d.length; ) {
    for (; r in e; )
      r = e[r];
    if (n = d.get(r), r && n[1].type === "chunkFlow" && d.get(r - 1)[1].type === "listItemPrefix" && (l = n[1]._tokenizer.events, o = 0, o < l.length && l[o][1].type === "lineEndingBlank" && (o += 2), o < l.length && l[o][1].type === "content"))
      for (; ++o < l.length && l[o][1].type !== "content"; )
        l[o][1].type === "chunkText" && (l[o][1]._isInFirstContentOfListItem = !0, o++);
    if (n[0] === "enter")
      n[1].contentType && (Object.assign(e, vT(d, r)), r = e[r], c = !0);
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
  return Be(t, 0, Number.POSITIVE_INFINITY, d.slice(0)), !c;
}
function vT(t, e) {
  const r = t.get(e)[1], n = t.get(e)[2];
  let i = e - 1;
  const o = [];
  let s = r._tokenizer;
  s || (s = n.parser[r.contentType](r.start), r._contentTypeTextTrailing && (s._contentTypeTextTrailing = !0));
  const a = s.events, l = [], c = {};
  let d, u, h = -1, p = r, f = 0, g = 0;
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
    const b = a.slice(v[h], v[h + 1]), _ = o.pop();
    l.push([_, _ + b.length - 1]), t.splice(_, 2, b);
  }
  for (l.reverse(), h = -1; ++h < l.length; )
    c[f + l[h][0]] = f + l[h][1], f += l[h][1] - l[h][0] - 1;
  return c;
}
const wT = {
  resolve: xT,
  tokenize: kT
}, yT = {
  partial: !0,
  tokenize: _T
};
function xT(t) {
  return ip(t), t;
}
function kT(t, e) {
  let r;
  return n;
  function n(a) {
    return t.enter("content"), r = t.enter("chunkContent", {
      contentType: "content"
    }), i(a);
  }
  function i(a) {
    return a === null ? o(a) : Y(a) ? t.check(yT, s, o)(a) : (t.consume(a), i);
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
function _T(t, e, r) {
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
function op(t, e, r, n, i, o, s, a, l) {
  const c = l || Number.POSITIVE_INFINITY;
  let d = 0;
  return u;
  function u(b) {
    return b === 60 ? (t.enter(n), t.enter(i), t.enter(o), t.consume(b), t.exit(o), h) : b === null || b === 32 || b === 41 || Bn(b) ? r(b) : (t.enter(n), t.enter(s), t.enter(a), t.enter("chunkString", {
      contentType: "string"
    }), g(b));
  }
  function h(b) {
    return b === 62 ? (t.enter(o), t.consume(b), t.exit(o), t.exit(i), t.exit(n), e) : (t.enter(a), t.enter("chunkString", {
      contentType: "string"
    }), p(b));
  }
  function p(b) {
    return b === 62 ? (t.exit("chunkString"), t.exit(a), h(b)) : b === null || b === 60 || Y(b) ? r(b) : (t.consume(b), b === 92 ? f : p);
  }
  function f(b) {
    return b === 60 || b === 62 || b === 92 ? (t.consume(b), p) : p(b);
  }
  function g(b) {
    return !d && (b === null || b === 41 || ge(b)) ? (t.exit("chunkString"), t.exit(a), t.exit(s), t.exit(n), e(b)) : d < c && b === 40 ? (t.consume(b), d++, g) : b === 41 ? (t.consume(b), d--, g) : b === null || b === 32 || b === 40 || Bn(b) ? r(b) : (t.consume(b), b === 92 ? v : g);
  }
  function v(b) {
    return b === 40 || b === 41 || b === 92 ? (t.consume(b), g) : g(b);
  }
}
function sp(t, e, r, n, i, o) {
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
function ap(t, e, r, n, i, o) {
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
function Br(t, e) {
  let r;
  return n;
  function n(i) {
    return Y(i) ? (t.enter("lineEnding"), t.consume(i), t.exit("lineEnding"), r = !0, n) : ne(i) ? se(t, n, r ? "linePrefix" : "lineSuffix")(i) : e(i);
  }
}
const ST = {
  name: "definition",
  tokenize: TT
}, CT = {
  partial: !0,
  tokenize: IT
};
function TT(t, e, r) {
  const n = this;
  let i;
  return o;
  function o(p) {
    return t.enter("definition"), s(p);
  }
  function s(p) {
    return sp.call(
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
    return i = tt(n.sliceSerialize(n.events[n.events.length - 1][1]).slice(1, -1)), p === 58 ? (t.enter("definitionMarker"), t.consume(p), t.exit("definitionMarker"), l) : r(p);
  }
  function l(p) {
    return ge(p) ? Br(t, c)(p) : c(p);
  }
  function c(p) {
    return op(
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
    return t.attempt(CT, u, u)(p);
  }
  function u(p) {
    return ne(p) ? se(t, h, "whitespace")(p) : h(p);
  }
  function h(p) {
    return p === null || Y(p) ? (t.exit("definition"), n.parser.defined.push(i), e(p)) : r(p);
  }
}
function IT(t, e, r) {
  return n;
  function n(a) {
    return ge(a) ? Br(t, i)(a) : r(a);
  }
  function i(a) {
    return ap(t, o, r, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(a);
  }
  function o(a) {
    return ne(a) ? se(t, s, "whitespace")(a) : s(a);
  }
  function s(a) {
    return a === null || Y(a) ? e(a) : r(a);
  }
}
const ET = {
  name: "hardBreakEscape",
  tokenize: AT
};
function AT(t, e, r) {
  return n;
  function n(o) {
    return t.enter("hardBreakEscape"), t.consume(o), i;
  }
  function i(o) {
    return Y(o) ? (t.exit("hardBreakEscape"), e(o)) : r(o);
  }
}
const RT = {
  name: "headingAtx",
  resolve: PT,
  tokenize: MT
};
function PT(t, e) {
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
  }, Be(t, n, r - n + 1, [["enter", i, e], ["enter", o, e], ["exit", o, e], ["exit", i, e]])), t;
}
function MT(t, e, r) {
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
const DT = [
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
], vl = ["pre", "script", "style", "textarea"], NT = {
  concrete: !0,
  name: "htmlFlow",
  resolveTo: LT,
  tokenize: $T
}, zT = {
  partial: !0,
  tokenize: FT
}, OT = {
  partial: !0,
  tokenize: BT
};
function LT(t) {
  let e = t.length;
  for (; e-- && !(t[e][0] === "enter" && t[e][1].type === "htmlFlow"); )
    ;
  return e > 1 && t[e - 2][1].type === "linePrefix" && (t[e][1].start = t[e - 2][1].start, t[e + 1][1].start = t[e - 2][1].start, t.splice(e - 2, 2)), t;
}
function $T(t, e, r) {
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
    return S === 45 ? (t.consume(S), i = 2, p) : S === 91 ? (t.consume(S), i = 5, a = 0, f) : Me(S) ? (t.consume(S), i = 4, n.interrupt ? e : w) : r(S);
  }
  function p(S) {
    return S === 45 ? (t.consume(S), n.interrupt ? e : w) : r(S);
  }
  function f(S) {
    const xe = "CDATA[";
    return S === xe.charCodeAt(a++) ? (t.consume(S), a === xe.length ? n.interrupt ? e : D : f) : r(S);
  }
  function g(S) {
    return Me(S) ? (t.consume(S), s = String.fromCharCode(S), v) : r(S);
  }
  function v(S) {
    if (S === null || S === 47 || S === 62 || ge(S)) {
      const xe = S === 47, pe = s.toLowerCase();
      return !xe && !o && vl.includes(pe) ? (i = 1, n.interrupt ? e(S) : D(S)) : DT.includes(s.toLowerCase()) ? (i = 6, xe ? (t.consume(S), b) : n.interrupt ? e(S) : D(S)) : (i = 7, n.interrupt && !n.parser.lazy[n.now().line] ? r(S) : o ? _(S) : k(S));
    }
    return S === 45 || Ee(S) ? (t.consume(S), s += String.fromCharCode(S), v) : r(S);
  }
  function b(S) {
    return S === 62 ? (t.consume(S), n.interrupt ? e : D) : r(S);
  }
  function _(S) {
    return ne(S) ? (t.consume(S), _) : x(S);
  }
  function k(S) {
    return S === 47 ? (t.consume(S), x) : S === 58 || S === 95 || Me(S) ? (t.consume(S), I) : ne(S) ? (t.consume(S), k) : x(S);
  }
  function I(S) {
    return S === 45 || S === 46 || S === 58 || S === 95 || Ee(S) ? (t.consume(S), I) : E(S);
  }
  function E(S) {
    return S === 61 ? (t.consume(S), y) : ne(S) ? (t.consume(S), E) : k(S);
  }
  function y(S) {
    return S === null || S === 60 || S === 61 || S === 62 || S === 96 ? r(S) : S === 34 || S === 39 ? (t.consume(S), l = S, M) : ne(S) ? (t.consume(S), y) : R(S);
  }
  function M(S) {
    return S === l ? (t.consume(S), l = null, P) : S === null || Y(S) ? r(S) : (t.consume(S), M);
  }
  function R(S) {
    return S === null || S === 34 || S === 39 || S === 47 || S === 60 || S === 61 || S === 62 || S === 96 || ge(S) ? E(S) : (t.consume(S), R);
  }
  function P(S) {
    return S === 47 || S === 62 || ne(S) ? k(S) : r(S);
  }
  function x(S) {
    return S === 62 ? (t.consume(S), T) : r(S);
  }
  function T(S) {
    return S === null || Y(S) ? D(S) : ne(S) ? (t.consume(S), T) : r(S);
  }
  function D(S) {
    return S === 45 && i === 2 ? (t.consume(S), j) : S === 60 && i === 1 ? (t.consume(S), G) : S === 62 && i === 4 ? (t.consume(S), ie) : S === 63 && i === 3 ? (t.consume(S), w) : S === 93 && i === 5 ? (t.consume(S), W) : Y(S) && (i === 6 || i === 7) ? (t.exit("htmlFlowData"), t.check(zT, de, N)(S)) : S === null || Y(S) ? (t.exit("htmlFlowData"), N(S)) : (t.consume(S), D);
  }
  function N(S) {
    return t.check(OT, O, de)(S);
  }
  function O(S) {
    return t.enter("lineEnding"), t.consume(S), t.exit("lineEnding"), L;
  }
  function L(S) {
    return S === null || Y(S) ? N(S) : (t.enter("htmlFlowData"), D(S));
  }
  function j(S) {
    return S === 45 ? (t.consume(S), w) : D(S);
  }
  function G(S) {
    return S === 47 ? (t.consume(S), s = "", B) : D(S);
  }
  function B(S) {
    if (S === 62) {
      const xe = s.toLowerCase();
      return vl.includes(xe) ? (t.consume(S), ie) : D(S);
    }
    return Me(S) && s.length < 8 ? (t.consume(S), s += String.fromCharCode(S), B) : D(S);
  }
  function W(S) {
    return S === 93 ? (t.consume(S), w) : D(S);
  }
  function w(S) {
    return S === 62 ? (t.consume(S), ie) : S === 45 && i === 2 ? (t.consume(S), w) : D(S);
  }
  function ie(S) {
    return S === null || Y(S) ? (t.exit("htmlFlowData"), de(S)) : (t.consume(S), ie);
  }
  function de(S) {
    return t.exit("htmlFlow"), e(S);
  }
}
function BT(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    return Y(s) ? (t.enter("lineEnding"), t.consume(s), t.exit("lineEnding"), o) : r(s);
  }
  function o(s) {
    return n.parser.lazy[n.now().line] ? r(s) : e(s);
  }
}
function FT(t, e, r) {
  return n;
  function n(i) {
    return t.enter("lineEnding"), t.consume(i), t.exit("lineEnding"), t.attempt(sn, e, r);
  }
}
const UT = {
  name: "htmlText",
  tokenize: jT
};
function jT(t, e, r) {
  const n = this;
  let i, o, s;
  return a;
  function a(w) {
    return t.enter("htmlText"), t.enter("htmlTextData"), t.consume(w), l;
  }
  function l(w) {
    return w === 33 ? (t.consume(w), c) : w === 47 ? (t.consume(w), E) : w === 63 ? (t.consume(w), k) : Me(w) ? (t.consume(w), R) : r(w);
  }
  function c(w) {
    return w === 45 ? (t.consume(w), d) : w === 91 ? (t.consume(w), o = 0, f) : Me(w) ? (t.consume(w), _) : r(w);
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
  function f(w) {
    const ie = "CDATA[";
    return w === ie.charCodeAt(o++) ? (t.consume(w), o === ie.length ? g : f) : r(w);
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
  function _(w) {
    return w === null || w === 62 ? j(w) : Y(w) ? (s = _, G(w)) : (t.consume(w), _);
  }
  function k(w) {
    return w === null ? r(w) : w === 63 ? (t.consume(w), I) : Y(w) ? (s = k, G(w)) : (t.consume(w), k);
  }
  function I(w) {
    return w === 62 ? j(w) : k(w);
  }
  function E(w) {
    return Me(w) ? (t.consume(w), y) : r(w);
  }
  function y(w) {
    return w === 45 || Ee(w) ? (t.consume(w), y) : M(w);
  }
  function M(w) {
    return Y(w) ? (s = M, G(w)) : ne(w) ? (t.consume(w), M) : j(w);
  }
  function R(w) {
    return w === 45 || Ee(w) ? (t.consume(w), R) : w === 47 || w === 62 || ge(w) ? P(w) : r(w);
  }
  function P(w) {
    return w === 47 ? (t.consume(w), j) : w === 58 || w === 95 || Me(w) ? (t.consume(w), x) : Y(w) ? (s = P, G(w)) : ne(w) ? (t.consume(w), P) : j(w);
  }
  function x(w) {
    return w === 45 || w === 46 || w === 58 || w === 95 || Ee(w) ? (t.consume(w), x) : T(w);
  }
  function T(w) {
    return w === 61 ? (t.consume(w), D) : Y(w) ? (s = T, G(w)) : ne(w) ? (t.consume(w), T) : P(w);
  }
  function D(w) {
    return w === null || w === 60 || w === 61 || w === 62 || w === 96 ? r(w) : w === 34 || w === 39 ? (t.consume(w), i = w, N) : Y(w) ? (s = D, G(w)) : ne(w) ? (t.consume(w), D) : (t.consume(w), O);
  }
  function N(w) {
    return w === i ? (t.consume(w), i = void 0, L) : w === null ? r(w) : Y(w) ? (s = N, G(w)) : (t.consume(w), N);
  }
  function O(w) {
    return w === null || w === 34 || w === 39 || w === 60 || w === 61 || w === 96 ? r(w) : w === 47 || w === 62 || ge(w) ? P(w) : (t.consume(w), O);
  }
  function L(w) {
    return w === 47 || w === 62 || ge(w) ? P(w) : r(w);
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
const fs = {
  name: "labelEnd",
  resolveAll: GT,
  resolveTo: WT,
  tokenize: KT
}, VT = {
  tokenize: QT
}, qT = {
  tokenize: YT
}, HT = {
  tokenize: JT
};
function GT(t) {
  let e = -1;
  const r = [];
  for (; ++e < t.length; ) {
    const n = t[e][1];
    if (r.push(t[e]), n.type === "labelImage" || n.type === "labelLink" || n.type === "labelEnd") {
      const i = n.type === "labelImage" ? 4 : 2;
      n.type = "data", e += i;
    }
  }
  return t.length !== r.length && Be(t, 0, t.length, r), t;
}
function WT(t, e) {
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
  return a = [["enter", l, e], ["enter", c, e]], a = Ue(a, t.slice(o + 1, o + n + 3)), a = Ue(a, [["enter", d, e]]), a = Ue(a, ni(e.parser.constructs.insideSpan.null, t.slice(o + n + 4, s - 3), e)), a = Ue(a, [["exit", d, e], t[s - 2], t[s - 1], ["exit", c, e]]), a = Ue(a, t.slice(s + 1)), a = Ue(a, [["exit", l, e]]), Be(t, o, t.length, a), t;
}
function KT(t, e, r) {
  const n = this;
  let i = n.events.length, o, s;
  for (; i--; )
    if ((n.events[i][1].type === "labelImage" || n.events[i][1].type === "labelLink") && !n.events[i][1]._balanced) {
      o = n.events[i][1];
      break;
    }
  return a;
  function a(h) {
    return o ? o._inactive ? u(h) : (s = n.parser.defined.includes(tt(n.sliceSerialize({
      start: o.end,
      end: n.now()
    }))), t.enter("labelEnd"), t.enter("labelMarker"), t.consume(h), t.exit("labelMarker"), t.exit("labelEnd"), l) : r(h);
  }
  function l(h) {
    return h === 40 ? t.attempt(VT, d, s ? d : u)(h) : h === 91 ? t.attempt(qT, d, s ? c : u)(h) : s ? d(h) : u(h);
  }
  function c(h) {
    return t.attempt(HT, d, u)(h);
  }
  function d(h) {
    return e(h);
  }
  function u(h) {
    return o._balanced = !0, r(h);
  }
}
function QT(t, e, r) {
  return n;
  function n(u) {
    return t.enter("resource"), t.enter("resourceMarker"), t.consume(u), t.exit("resourceMarker"), i;
  }
  function i(u) {
    return ge(u) ? Br(t, o)(u) : o(u);
  }
  function o(u) {
    return u === 41 ? d(u) : op(t, s, a, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(u);
  }
  function s(u) {
    return ge(u) ? Br(t, l)(u) : d(u);
  }
  function a(u) {
    return r(u);
  }
  function l(u) {
    return u === 34 || u === 39 || u === 40 ? ap(t, c, r, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(u) : d(u);
  }
  function c(u) {
    return ge(u) ? Br(t, d)(u) : d(u);
  }
  function d(u) {
    return u === 41 ? (t.enter("resourceMarker"), t.consume(u), t.exit("resourceMarker"), t.exit("resource"), e) : r(u);
  }
}
function YT(t, e, r) {
  const n = this;
  return i;
  function i(a) {
    return sp.call(n, t, o, s, "reference", "referenceMarker", "referenceString")(a);
  }
  function o(a) {
    return n.parser.defined.includes(tt(n.sliceSerialize(n.events[n.events.length - 1][1]).slice(1, -1))) ? e(a) : r(a);
  }
  function s(a) {
    return r(a);
  }
}
function JT(t, e, r) {
  return n;
  function n(o) {
    return t.enter("reference"), t.enter("referenceMarker"), t.consume(o), t.exit("referenceMarker"), i;
  }
  function i(o) {
    return o === 93 ? (t.enter("referenceMarker"), t.consume(o), t.exit("referenceMarker"), t.exit("reference"), e) : r(o);
  }
}
const XT = {
  name: "labelStartImage",
  resolveAll: fs.resolveAll,
  tokenize: ZT
};
function ZT(t, e, r) {
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
const eI = {
  name: "labelStartLink",
  resolveAll: fs.resolveAll,
  tokenize: tI
};
function tI(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    return t.enter("labelLink"), t.enter("labelMarker"), t.consume(s), t.exit("labelMarker"), t.exit("labelLink"), o;
  }
  function o(s) {
    return s === 94 && "_hiddenFootnoteSupport" in n.parser.constructs ? r(s) : e(s);
  }
}
const Ti = {
  name: "lineEnding",
  tokenize: rI
};
function rI(t, e) {
  return r;
  function r(n) {
    return t.enter("lineEnding"), t.consume(n), t.exit("lineEnding"), se(t, e, "linePrefix");
  }
}
const Cn = {
  name: "thematicBreak",
  tokenize: nI
};
function nI(t, e, r) {
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
    tokenize: aI
  },
  exit: cI,
  name: "list",
  tokenize: sI
}, iI = {
  partial: !0,
  tokenize: uI
}, oI = {
  partial: !0,
  tokenize: lI
};
function sI(t, e, r) {
  const n = this, i = n.events[n.events.length - 1];
  let o = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, s = 0;
  return a;
  function a(p) {
    const f = n.containerState.type || (p === 42 || p === 43 || p === 45 ? "listUnordered" : "listOrdered");
    if (f === "listUnordered" ? !n.containerState.marker || p === n.containerState.marker : lo(p)) {
      if (n.containerState.type || (n.containerState.type = f, t.enter(f, {
        _container: !0
      })), f === "listUnordered")
        return t.enter("listItemPrefix"), p === 42 || p === 45 ? t.check(Cn, r, c)(p) : c(p);
      if (!n.interrupt || p === 49)
        return t.enter("listItemPrefix"), t.enter("listItemValue"), l(p);
    }
    return r(p);
  }
  function l(p) {
    return lo(p) && ++s < 10 ? (t.consume(p), l) : (!n.interrupt || s < 2) && (n.containerState.marker ? p === n.containerState.marker : p === 41 || p === 46) ? (t.exit("listItemValue"), c(p)) : r(p);
  }
  function c(p) {
    return t.enter("listItemMarker"), t.consume(p), t.exit("listItemMarker"), n.containerState.marker = n.containerState.marker || p, t.check(
      sn,
      // Can’t be empty when interrupting.
      n.interrupt ? r : d,
      t.attempt(iI, h, u)
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
function aI(t, e, r) {
  const n = this;
  return n.containerState._closeFlow = void 0, t.check(sn, i, o);
  function i(a) {
    return n.containerState.furtherBlankLines = n.containerState.furtherBlankLines || n.containerState.initialBlankLine, se(t, e, "listItemIndent", n.containerState.size + 1)(a);
  }
  function o(a) {
    return n.containerState.furtherBlankLines || !ne(a) ? (n.containerState.furtherBlankLines = void 0, n.containerState.initialBlankLine = void 0, s(a)) : (n.containerState.furtherBlankLines = void 0, n.containerState.initialBlankLine = void 0, t.attempt(oI, e, s)(a));
  }
  function s(a) {
    return n.containerState._closeFlow = !0, n.interrupt = void 0, se(t, t.attempt(De, e, r), "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(a);
  }
}
function lI(t, e, r) {
  const n = this;
  return se(t, i, "listItemIndent", n.containerState.size + 1);
  function i(o) {
    const s = n.events[n.events.length - 1];
    return s && s[1].type === "listItemIndent" && s[2].sliceSerialize(s[1], !0).length === n.containerState.size ? e(o) : r(o);
  }
}
function cI(t) {
  t.exit(this.containerState.type);
}
function uI(t, e, r) {
  const n = this;
  return se(t, i, "listItemPrefixWhitespace", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4 + 1);
  function i(o) {
    const s = n.events[n.events.length - 1];
    return !ne(o) && s && s[1].type === "listItemPrefixWhitespace" ? e(o) : r(o);
  }
}
const wl = {
  name: "setextUnderline",
  resolveTo: dI,
  tokenize: hI
};
function dI(t, e) {
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
function hI(t, e, r) {
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
const pI = {
  tokenize: fI
};
function fI(t) {
  const e = this, r = t.attempt(
    // Try to parse a blank line.
    sn,
    n,
    // Try to parse initial flow (essentially, only code).
    t.attempt(this.parser.constructs.flowInitial, i, se(t, t.attempt(this.parser.constructs.flow, i, t.attempt(wT, i)), "linePrefix"))
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
const mI = {
  resolveAll: cp()
}, gI = lp("string"), bI = lp("text");
function lp(t) {
  return {
    resolveAll: cp(t === "text" ? vI : void 0),
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
function cp(t) {
  return e;
  function e(r, n) {
    let i = -1, o;
    for (; ++i <= r.length; )
      o === void 0 ? r[i] && r[i][1].type === "data" && (o = i, i++) : (!r[i] || r[i][1].type !== "data") && (i !== o + 2 && (r[o][1].end = r[i - 1][1].end, r.splice(o + 2, i - o - 2), i = o + 2), o = void 0);
    return t ? t(r, n) : r;
  }
}
function vI(t, e) {
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
const wI = {
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
  62: tp
}, yI = {
  91: ST
}, xI = {
  [-2]: Ci,
  [-1]: Ci,
  32: Ci
}, kI = {
  35: RT,
  42: Cn,
  45: [wl, Cn],
  60: NT,
  61: wl,
  95: Cn,
  96: bl,
  126: bl
}, _I = {
  38: np,
  92: rp
}, SI = {
  [-5]: Ti,
  [-4]: Ti,
  [-3]: Ti,
  33: XT,
  38: np,
  42: co,
  60: [eT, UT],
  91: eI,
  92: [ET, rp],
  93: fs,
  95: co,
  96: pT
}, CI = {
  null: [co, mI]
}, TI = {
  null: [42, 95]
}, II = {
  null: []
}, EI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attentionMarkers: TI,
  contentInitial: yI,
  disable: II,
  document: wI,
  flow: kI,
  flowInitial: xI,
  insideSpan: CI,
  string: _I,
  text: SI
}, Symbol.toStringTag, { value: "Module" }));
function AI(t, e, r) {
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
    attempt: M(E),
    check: M(y),
    consume: _,
    enter: k,
    exit: I,
    interrupt: M(y, {
      interrupt: !0
    })
  }, c = {
    code: null,
    containerState: {},
    defineSkip: g,
    events: [],
    now: f,
    parser: t,
    previous: null,
    sliceSerialize: h,
    sliceStream: p,
    write: u
  };
  let d = e.tokenize.call(c, l);
  return e.resolveAll && o.push(e), c;
  function u(T) {
    return s = Ue(s, T), v(), s[s.length - 1] !== null ? [] : (R(e, 0), c.events = ni(o, c.events, c), c.events);
  }
  function h(T, D) {
    return PI(p(T), D);
  }
  function p(T) {
    return RI(s, T);
  }
  function f() {
    const {
      _bufferIndex: T,
      _index: D,
      line: N,
      column: O,
      offset: L
    } = n;
    return {
      _bufferIndex: T,
      _index: D,
      line: N,
      column: O,
      offset: L
    };
  }
  function g(T) {
    i[T.line] = T.column, x();
  }
  function v() {
    let T;
    for (; n._index < s.length; ) {
      const D = s[n._index];
      if (typeof D == "string")
        for (T = n._index, n._bufferIndex < 0 && (n._bufferIndex = 0); n._index === T && n._bufferIndex < D.length; )
          b(D.charCodeAt(n._bufferIndex));
      else
        b(D);
    }
  }
  function b(T) {
    d = d(T);
  }
  function _(T) {
    Y(T) ? (n.line++, n.column = 1, n.offset += T === -3 ? 2 : 1, x()) : T !== -1 && (n.column++, n.offset++), n._bufferIndex < 0 ? n._index++ : (n._bufferIndex++, n._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
    // strings.
    /** @type {string} */
    s[n._index].length && (n._bufferIndex = -1, n._index++)), c.previous = T;
  }
  function k(T, D) {
    const N = D || {};
    return N.type = T, N.start = f(), c.events.push(["enter", N, c]), a.push(N), N;
  }
  function I(T) {
    const D = a.pop();
    return D.end = f(), c.events.push(["exit", D, c]), D;
  }
  function E(T, D) {
    R(T, D.from);
  }
  function y(T, D) {
    D.restore();
  }
  function M(T, D) {
    return N;
    function N(O, L, j) {
      let G, B, W, w;
      return Array.isArray(O) ? (
        /* c8 ignore next 1 */
        de(O)
      ) : "tokenize" in O ? (
        // Looks like a construct.
        de([
          /** @type {Construct} */
          O
        ])
      ) : ie(O);
      function ie(ae) {
        return st;
        function st(Ye) {
          const be = Ye !== null && ae[Ye], pt = Ye !== null && ae.null, ft = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(be) ? be : be ? [be] : [],
            ...Array.isArray(pt) ? pt : pt ? [pt] : []
          ];
          return de(ft)(Ye);
        }
      }
      function de(ae) {
        return G = ae, B = 0, ae.length === 0 ? j : S(ae[B]);
      }
      function S(ae) {
        return st;
        function st(Ye) {
          return w = P(), W = ae, ae.partial || (c.currentConstruct = ae), ae.name && c.parser.constructs.disable.null.includes(ae.name) ? pe() : ae.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            D ? Object.assign(Object.create(c), D) : c,
            l,
            xe,
            pe
          )(Ye);
        }
      }
      function xe(ae) {
        return T(W, w), L;
      }
      function pe(ae) {
        return w.restore(), ++B < G.length ? S(G[B]) : j;
      }
    }
  }
  function R(T, D) {
    T.resolveAll && !o.includes(T) && o.push(T), T.resolve && Be(c.events, D, c.events.length - D, T.resolve(c.events.slice(D), c)), T.resolveTo && (c.events = T.resolveTo(c.events, c));
  }
  function P() {
    const T = f(), D = c.previous, N = c.currentConstruct, O = c.events.length, L = Array.from(a);
    return {
      from: O,
      restore: j
    };
    function j() {
      n = T, c.previous = D, c.currentConstruct = N, c.events.length = O, a = L, x();
    }
  }
  function x() {
    n.line in i && n.column < 2 && (n.column = i[n.line], n.offset += i[n.line] - 1);
  }
}
function RI(t, e) {
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
function PI(t, e) {
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
function MI(t) {
  const n = {
    constructs: (
      /** @type {FullNormalizedExtension} */
      Zh([EI, ...(t || {}).extensions || []])
    ),
    content: i(WC),
    defined: [],
    document: i(QC),
    flow: i(pI),
    lazy: {},
    string: i(gI),
    text: i(bI)
  };
  return n;
  function i(o) {
    return s;
    function s(a) {
      return AI(n, o, a);
    }
  }
}
function DI(t) {
  for (; !ip(t); )
    ;
  return t;
}
const yl = /[\0\t\n\r]/g;
function NI() {
  let t = 1, e = "", r = !0, n;
  return i;
  function i(o, s, a) {
    const l = [];
    let c, d, u, h, p;
    for (o = e + (typeof o == "string" ? o.toString() : new TextDecoder(s || void 0).decode(o)), u = 0, e = "", r && (o.charCodeAt(0) === 65279 && u++, r = void 0); u < o.length; ) {
      if (yl.lastIndex = u, c = yl.exec(o), h = c && c.index !== void 0 ? c.index : o.length, p = o.charCodeAt(h), !c) {
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
const zI = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function OI(t) {
  return t.replace(zI, LI);
}
function LI(t, e, r) {
  if (e)
    return e;
  if (r.charCodeAt(0) === 35) {
    const i = r.charCodeAt(1), o = i === 120 || i === 88;
    return ep(r.slice(o ? 2 : 1), o ? 16 : 10);
  }
  return ps(r) || t;
}
const up = {}.hasOwnProperty;
function $I(t, e, r) {
  return e && typeof e == "object" && (r = e, e = void 0), BI(r)(DI(MI(r).document().write(NI()(t, e, !0))));
}
function BI(t) {
  const e = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: o(Es),
      autolinkProtocol: P,
      autolinkEmail: P,
      atxHeading: o(Cs),
      blockQuote: o(pt),
      characterEscape: P,
      characterReference: P,
      codeFenced: o(ft),
      codeFencedFenceInfo: s,
      codeFencedFenceMeta: s,
      codeIndented: o(ft, s),
      codeText: o(rr, s),
      codeTextData: P,
      data: P,
      codeFlowValue: P,
      definition: o(Tr),
      definitionDestinationString: s,
      definitionLabelString: s,
      definitionTitleString: s,
      emphasis: o(nr),
      hardBreakEscape: o(Ts),
      hardBreakTrailing: o(Ts),
      htmlFlow: o(Is, s),
      htmlFlowData: P,
      htmlText: o(Is, s),
      htmlTextData: P,
      image: o(Yp),
      label: s,
      link: o(Es),
      listItem: o(Jp),
      listItemValue: h,
      listOrdered: o(As, u),
      listUnordered: o(As),
      paragraph: o(Xp),
      reference: S,
      referenceString: s,
      resourceDestinationString: s,
      resourceTitleString: s,
      setextHeading: o(Cs),
      strong: o(Zp),
      thematicBreak: o(tf)
    },
    exit: {
      atxHeading: l(),
      atxHeadingSequence: E,
      autolink: l(),
      autolinkEmail: be,
      autolinkProtocol: Ye,
      blockQuote: l(),
      characterEscapeValue: x,
      characterReferenceMarkerHexadecimal: pe,
      characterReferenceMarkerNumeric: pe,
      characterReferenceValue: ae,
      characterReference: st,
      codeFenced: l(v),
      codeFencedFence: g,
      codeFencedFenceInfo: p,
      codeFencedFenceMeta: f,
      codeFlowValue: x,
      codeIndented: l(b),
      codeText: l(L),
      codeTextData: x,
      data: x,
      definition: l(),
      definitionDestinationString: I,
      definitionLabelString: _,
      definitionTitleString: k,
      emphasis: l(),
      hardBreakEscape: l(D),
      hardBreakTrailing: l(D),
      htmlFlow: l(N),
      htmlFlowData: x,
      htmlText: l(O),
      htmlTextData: x,
      image: l(G),
      label: W,
      labelText: B,
      lineEnding: T,
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
      setextHeadingLineSequence: M,
      setextHeadingText: y,
      strong: l(),
      thematicBreak: l()
    }
  };
  dp(e, (t || {}).mdastExtensions || []);
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
    let fe = -1;
    for (; ++fe < z.length; )
      if (z[fe][1].type === "listOrdered" || z[fe][1].type === "listUnordered")
        if (z[fe][0] === "enter")
          oe.push(fe);
        else {
          const Je = oe.pop();
          fe = i(z, Je, fe);
        }
    for (fe = -1; ++fe < z.length; ) {
      const Je = e[z[fe][0]];
      up.call(Je, z[fe][1].type) && Je[z[fe][1].type].call(Object.assign({
        sliceSerialize: z[fe][2].sliceSerialize
      }, ee), z[fe][1]);
    }
    if (ee.tokenStack.length > 0) {
      const Je = ee.tokenStack[ee.tokenStack.length - 1];
      (Je[1] || xl).call(ee, void 0, Je[0]);
    }
    for (U.position = {
      start: yt(z.length > 0 ? z[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: yt(z.length > 0 ? z[z.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    }, fe = -1; ++fe < e.transforms.length; )
      U = e.transforms[fe](U) || U;
    return U;
  }
  function i(z, U, ee) {
    let oe = U - 1, fe = -1, Je = !1, Pt, mt, Ir, Er;
    for (; ++oe <= ee; ) {
      const Oe = z[oe];
      switch (Oe[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          Oe[0] === "enter" ? fe++ : fe--, Er = void 0;
          break;
        }
        case "lineEndingBlank": {
          Oe[0] === "enter" && (Pt && !Er && !fe && !Ir && (Ir = oe), Er = void 0);
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          Er = void 0;
      }
      if (!fe && Oe[0] === "enter" && Oe[1].type === "listItemPrefix" || fe === -1 && Oe[0] === "exit" && (Oe[1].type === "listUnordered" || Oe[1].type === "listOrdered")) {
        if (Pt) {
          let ir = oe;
          for (mt = void 0; ir--; ) {
            const gt = z[ir];
            if (gt[1].type === "lineEnding" || gt[1].type === "lineEndingBlank") {
              if (gt[0] === "exit")
                continue;
              mt && (z[mt][1].type = "lineEndingBlank", Je = !0), gt[1].type = "lineEnding", mt = ir;
            } else if (!(gt[1].type === "linePrefix" || gt[1].type === "blockQuotePrefix" || gt[1].type === "blockQuotePrefixWhitespace" || gt[1].type === "blockQuoteMarker" || gt[1].type === "listItemIndent"))
              break;
          }
          Ir && (!mt || Ir < mt) && (Pt._spread = !0), Pt.end = Object.assign({}, mt ? z[mt][1].start : Oe[1].end), z.splice(mt || oe, 0, ["exit", Pt, Oe[2]]), oe++, ee++;
        }
        if (Oe[1].type === "listItemPrefix") {
          const ir = {
            type: "listItem",
            _spread: !1,
            start: Object.assign({}, Oe[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          Pt = ir, z.splice(oe, 0, ["enter", ir, Oe[2]]), oe++, ee++, Ir = void 0, Er = !0;
        }
      }
    }
    return z[U][1]._spread = Je, ee;
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
      start: yt(U.start),
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
      oe[0].type !== z.type && (U ? U.call(this, z, oe[0]) : (oe[1] || xl).call(this, z, oe[0]));
    else
      throw new Error("Cannot close `" + z.type + "` (" + $r({
        start: z.start,
        end: z.end
      }) + "): it’s not open");
    ee.position.end = yt(z.end);
  }
  function d() {
    return hs(this.stack.pop());
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
  function f() {
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
  function _(z) {
    const U = this.resume(), ee = this.stack[this.stack.length - 1];
    ee.label = U, ee.identifier = tt(this.sliceSerialize(z)).toLowerCase();
  }
  function k() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.title = z;
  }
  function I() {
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
  function M(z) {
    const U = this.stack[this.stack.length - 1];
    U.depth = this.sliceSerialize(z).codePointAt(0) === 61 ? 1 : 2;
  }
  function R() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function P(z) {
    const ee = this.stack[this.stack.length - 1].children;
    let oe = ee[ee.length - 1];
    (!oe || oe.type !== "text") && (oe = ef(), oe.position = {
      start: yt(z.start),
      // @ts-expect-error: we’ll add `end` later.
      end: void 0
    }, ee.push(oe)), this.stack.push(oe);
  }
  function x(z) {
    const U = this.stack.pop();
    U.value += this.sliceSerialize(z), U.position.end = yt(z.end);
  }
  function T(z) {
    const U = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      const ee = U.children[U.children.length - 1];
      ee.position.end = yt(z.end), this.data.atHardBreak = void 0;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && e.canContainEols.includes(U.type) && (P.call(this, z), x.call(this, z));
  }
  function D() {
    this.data.atHardBreak = !0;
  }
  function N() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.value = z;
  }
  function O() {
    const z = this.resume(), U = this.stack[this.stack.length - 1];
    U.value = z;
  }
  function L() {
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
    ee.label = OI(U), ee.identifier = tt(U).toLowerCase();
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
    ee.label = U, ee.identifier = tt(this.sliceSerialize(z)).toLowerCase(), this.data.referenceType = "full";
  }
  function pe(z) {
    this.data.characterReferenceType = z.type;
  }
  function ae(z) {
    const U = this.sliceSerialize(z), ee = this.data.characterReferenceType;
    let oe;
    ee ? (oe = ep(U, ee === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : oe = ps(U);
    const fe = this.stack[this.stack.length - 1];
    fe.value += oe;
  }
  function st(z) {
    const U = this.stack.pop();
    U.position.end = yt(z.end);
  }
  function Ye(z) {
    x.call(this, z);
    const U = this.stack[this.stack.length - 1];
    U.url = this.sliceSerialize(z);
  }
  function be(z) {
    x.call(this, z);
    const U = this.stack[this.stack.length - 1];
    U.url = "mailto:" + this.sliceSerialize(z);
  }
  function pt() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function ft() {
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
  function Tr() {
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
  function Cs() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: []
    };
  }
  function Ts() {
    return {
      type: "break"
    };
  }
  function Is() {
    return {
      type: "html",
      value: ""
    };
  }
  function Yp() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function Es() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function As(z) {
    return {
      type: "list",
      ordered: z.type === "listOrdered",
      start: null,
      spread: z._spread,
      children: []
    };
  }
  function Jp(z) {
    return {
      type: "listItem",
      spread: z._spread,
      checked: null,
      children: []
    };
  }
  function Xp() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function Zp() {
    return {
      type: "strong",
      children: []
    };
  }
  function ef() {
    return {
      type: "text",
      value: ""
    };
  }
  function tf() {
    return {
      type: "thematicBreak"
    };
  }
}
function yt(t) {
  return {
    line: t.line,
    column: t.column,
    offset: t.offset
  };
}
function dp(t, e) {
  let r = -1;
  for (; ++r < e.length; ) {
    const n = e[r];
    Array.isArray(n) ? dp(t, n) : FI(t, n);
  }
}
function FI(t, e) {
  let r;
  for (r in e)
    if (up.call(e, r))
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
function xl(t, e) {
  throw t ? new Error("Cannot close `" + t.type + "` (" + $r({
    start: t.start,
    end: t.end
  }) + "): a different token (`" + e.type + "`, " + $r({
    start: e.start,
    end: e.end
  }) + ") is open") : new Error("Cannot close document, a token (`" + e.type + "`, " + $r({
    start: e.start,
    end: e.end
  }) + ") is still open");
}
function UI(t) {
  const e = this;
  e.parser = r;
  function r(n) {
    return $I(n, {
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
function jI(t, e) {
  const r = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: t.wrap(t.all(e), !0)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function VI(t, e) {
  const r = { type: "element", tagName: "br", properties: {}, children: [] };
  return t.patch(e, r), [t.applyData(e, r), { type: "text", value: `
` }];
}
function qI(t, e) {
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
function HI(t, e) {
  const r = {
    type: "element",
    tagName: "del",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function GI(t, e) {
  const r = {
    type: "element",
    tagName: "em",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function WI(t, e) {
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
function KI(t, e) {
  const r = {
    type: "element",
    tagName: "h" + e.depth,
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function QI(t, e) {
  if (t.options.allowDangerousHtml) {
    const r = { type: "raw", value: e.value };
    return t.patch(e, r), t.applyData(e, r);
  }
}
function hp(t, e) {
  const r = e.referenceType;
  let n = "]";
  if (r === "collapsed" ? n += "[]" : r === "full" && (n += "[" + (e.label || e.identifier) + "]"), e.type === "imageReference")
    return [{ type: "text", value: "![" + e.alt + n }];
  const i = t.all(e), o = i[0];
  o && o.type === "text" ? o.value = "[" + o.value : i.unshift({ type: "text", value: "[" });
  const s = i[i.length - 1];
  return s && s.type === "text" ? s.value += n : i.push({ type: "text", value: n }), i;
}
function YI(t, e) {
  const r = String(e.identifier).toUpperCase(), n = t.definitionById.get(r);
  if (!n)
    return hp(t, e);
  const i = { src: _r(n.url || ""), alt: e.alt };
  n.title !== null && n.title !== void 0 && (i.title = n.title);
  const o = { type: "element", tagName: "img", properties: i, children: [] };
  return t.patch(e, o), t.applyData(e, o);
}
function JI(t, e) {
  const r = { src: _r(e.url) };
  e.alt !== null && e.alt !== void 0 && (r.alt = e.alt), e.title !== null && e.title !== void 0 && (r.title = e.title);
  const n = { type: "element", tagName: "img", properties: r, children: [] };
  return t.patch(e, n), t.applyData(e, n);
}
function XI(t, e) {
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
function ZI(t, e) {
  const r = String(e.identifier).toUpperCase(), n = t.definitionById.get(r);
  if (!n)
    return hp(t, e);
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
function e2(t, e) {
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
function t2(t, e, r) {
  const n = t.all(e), i = r ? r2(r) : pp(e), o = {}, s = [];
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
function r2(t) {
  let e = !1;
  if (t.type === "list") {
    e = t.spread || !1;
    const r = t.children;
    let n = -1;
    for (; !e && ++n < r.length; )
      e = pp(r[n]);
  }
  return e;
}
function pp(t) {
  const e = t.spread;
  return e ?? t.children.length > 1;
}
function n2(t, e) {
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
function i2(t, e) {
  const r = {
    type: "element",
    tagName: "p",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function o2(t, e) {
  const r = { type: "root", children: t.wrap(t.all(e)) };
  return t.patch(e, r), t.applyData(e, r);
}
function s2(t, e) {
  const r = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
function a2(t, e) {
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
    }, a = ls(e.children[1]), l = Gh(e.children[e.children.length - 1]);
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
function l2(t, e, r) {
  const n = r ? r.children : void 0, o = (n ? n.indexOf(e) : 1) === 0 ? "th" : "td", s = r && r.type === "table" ? r.align : void 0, a = s ? s.length : e.children.length;
  let l = -1;
  const c = [];
  for (; ++l < a; ) {
    const u = e.children[l], h = {}, p = s ? s[l] : void 0;
    p && (h.align = p);
    let f = { type: "element", tagName: o, properties: h, children: [] };
    u && (f.children = t.all(u), t.patch(u, f), f = t.applyData(u, f)), c.push(f);
  }
  const d = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: t.wrap(c, !0)
  };
  return t.patch(e, d), t.applyData(e, d);
}
function c2(t, e) {
  const r = {
    type: "element",
    tagName: "td",
    // Assume body cell.
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, r), t.applyData(e, r);
}
const kl = 9, _l = 32;
function u2(t) {
  const e = String(t), r = /\r?\n|\r/g;
  let n = r.exec(e), i = 0;
  const o = [];
  for (; n; )
    o.push(
      Sl(e.slice(i, n.index), i > 0, !0),
      n[0]
    ), i = n.index + n[0].length, n = r.exec(e);
  return o.push(Sl(e.slice(i), i > 0, !1)), o.join("");
}
function Sl(t, e, r) {
  let n = 0, i = t.length;
  if (e) {
    let o = t.codePointAt(n);
    for (; o === kl || o === _l; )
      n++, o = t.codePointAt(n);
  }
  if (r) {
    let o = t.codePointAt(i - 1);
    for (; o === kl || o === _l; )
      i--, o = t.codePointAt(i - 1);
  }
  return i > n ? t.slice(n, i) : "";
}
function d2(t, e) {
  const r = { type: "text", value: u2(String(e.value)) };
  return t.patch(e, r), t.applyData(e, r);
}
function h2(t, e) {
  const r = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  return t.patch(e, r), t.applyData(e, r);
}
const p2 = {
  blockquote: jI,
  break: VI,
  code: qI,
  delete: HI,
  emphasis: GI,
  footnoteReference: WI,
  heading: KI,
  html: QI,
  imageReference: YI,
  image: JI,
  inlineCode: XI,
  linkReference: ZI,
  link: e2,
  listItem: t2,
  list: n2,
  paragraph: i2,
  // @ts-expect-error: root is different, but hard to type.
  root: o2,
  strong: s2,
  table: a2,
  tableCell: c2,
  tableRow: l2,
  text: d2,
  thematicBreak: h2,
  toml: wn,
  yaml: wn,
  definition: wn,
  footnoteDefinition: wn
};
function wn() {
}
const fp = -1, ii = 0, Fr = 1, Fn = 2, ms = 3, gs = 4, bs = 5, vs = 6, mp = 7, gp = 8, bp = typeof self == "object" ? self : globalThis, Cl = (t, e) => {
  switch (t) {
    case "Function":
    case "SharedWorker":
    case "Worker":
    case "eval":
    case "setInterval":
    case "setTimeout":
      throw new TypeError("unable to deserialize " + t);
  }
  return new bp[t](e);
}, f2 = (t, e) => {
  const r = (i, o) => (t.set(o, i), i), n = (i) => {
    if (t.has(i))
      return t.get(i);
    const [o, s] = e[i];
    switch (o) {
      case ii:
      case fp:
        return r(s, i);
      case Fr: {
        const a = r([], i);
        for (const l of s)
          a.push(n(l));
        return a;
      }
      case Fn: {
        const a = r({}, i);
        for (const [l, c] of s)
          a[n(l)] = n(c);
        return a;
      }
      case ms:
        return r(new Date(s), i);
      case gs: {
        const { source: a, flags: l } = s;
        return r(new RegExp(a, l), i);
      }
      case bs: {
        const a = r(/* @__PURE__ */ new Map(), i);
        for (const [l, c] of s)
          a.set(n(l), n(c));
        return a;
      }
      case vs: {
        const a = r(/* @__PURE__ */ new Set(), i);
        for (const l of s)
          a.add(n(l));
        return a;
      }
      case mp: {
        const { name: a, message: l } = s;
        return r(
          typeof bp[a] == "function" ? Cl(a, l) : new Error(l),
          i
        );
      }
      case gp:
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
    return r(Cl(o, s), i);
  };
  return n;
}, Tl = (t) => f2(/* @__PURE__ */ new Map(), t)(0), Ot = "", { toString: m2 } = {}, { keys: g2 } = Object, Nr = (t) => {
  const e = typeof t;
  if (e !== "object" || !t)
    return [ii, e];
  const r = m2.call(t).slice(8, -1);
  switch (r) {
    case "Array":
      return [Fr, Ot];
    case "Object":
      return [Fn, Ot];
    case "Date":
      return [ms, Ot];
    case "RegExp":
      return [gs, Ot];
    case "Map":
      return [bs, Ot];
    case "Set":
      return [vs, Ot];
    case "DataView":
      return [Fr, r];
  }
  return r.includes("Array") ? [Fr, r] : t instanceof Error ? [mp, t.name || "Error"] : [Fn, r];
}, yn = ([t, e]) => t === ii && (e === "function" || e === "symbol"), b2 = (t, e, r, n) => {
  const i = (s, a) => {
    const l = n.push(s) - 1;
    return r.set(a, l), l;
  }, o = (s) => {
    if (r.has(s))
      return r.get(s);
    let [a, l] = Nr(s);
    switch (a) {
      case ii: {
        let d = s;
        switch (l) {
          case "bigint":
            a = gp, d = s.toString();
            break;
          case "function":
          case "symbol":
            if (t)
              throw new TypeError("unable to serialize " + l);
            d = null;
            break;
          case "undefined":
            return i([fp], s);
        }
        return i([a, d], s);
      }
      case Fr: {
        if (l) {
          let h = s;
          return l === "DataView" ? h = new Uint8Array(s.buffer) : l === "ArrayBuffer" && (h = new Uint8Array(s)), i([l, [...h]], s);
        }
        const d = [], u = i([a, d], s);
        for (const h of s)
          d.push(o(h));
        return u;
      }
      case Fn: {
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
        for (const h of g2(s))
          (t || !yn(Nr(s[h]))) && d.push([o(h), o(s[h])]);
        return u;
      }
      case ms:
        return i([a, isNaN(s.getTime()) ? Ot : s.toISOString()], s);
      case gs: {
        const { source: d, flags: u } = s;
        return i([a, { source: d, flags: u }], s);
      }
      case bs: {
        const d = [], u = i([a, d], s);
        for (const [h, p] of s)
          (t || !(yn(Nr(h)) || yn(Nr(p)))) && d.push([o(h), o(p)]);
        return u;
      }
      case vs: {
        const d = [], u = i([a, d], s);
        for (const h of s)
          (t || !yn(Nr(h))) && d.push(o(h));
        return u;
      }
    }
    const { message: c } = s;
    return i([a, { name: l, message: c }], s);
  };
  return o;
}, Il = (t, { json: e, lossy: r } = {}) => {
  const n = [];
  return b2(!(e || r), !!e, /* @__PURE__ */ new Map(), n)(t), n;
}, Un = typeof structuredClone == "function" ? (
  /* c8 ignore start */
  (t, e) => e && ("json" in e || "lossy" in e) ? Tl(Il(t, e)) : structuredClone(t)
) : (t, e) => Tl(Il(t, e));
function v2(t, e) {
  const r = [{ type: "text", value: "↩" }];
  return e > 1 && r.push({
    type: "element",
    tagName: "sup",
    properties: {},
    children: [{ type: "text", value: String(e) }]
  }), r;
}
function w2(t, e) {
  return "Back to reference " + (t + 1) + (e > 1 ? "-" + e : "");
}
function y2(t) {
  const e = typeof t.options.clobberPrefix == "string" ? t.options.clobberPrefix : "user-content-", r = t.options.footnoteBackContent || v2, n = t.options.footnoteBackLabel || w2, i = t.options.footnoteLabel || "Footnotes", o = t.options.footnoteLabelTagName || "h2", s = t.options.footnoteLabelProperties || {
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
    const f = [], g = t.footnoteCounts.get(u);
    for (; g !== void 0 && ++p <= g; ) {
      f.length > 0 && f.push({ type: "text", value: " " });
      let _ = typeof r == "string" ? r : r(l, p);
      typeof _ == "string" && (_ = { type: "text", value: _ }), f.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + e + "fnref-" + h + (p > 1 ? "-" + p : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof n == "string" ? n : n(l, p),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(_) ? _ : [_]
      });
    }
    const v = d[d.length - 1];
    if (v && v.type === "element" && v.tagName === "p") {
      const _ = v.children[v.children.length - 1];
      _ && _.type === "text" ? _.value += " " : v.children.push({ type: "text", value: " " }), v.children.push(...f);
    } else
      d.push(...f);
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
            ...Un(s),
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
const oi = (
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
      return S2;
    if (typeof t == "function")
      return si(t);
    if (typeof t == "object")
      return Array.isArray(t) ? x2(t) : (
        // Cast because `ReadonlyArray` goes into the above but `isArray`
        // narrows to `Array`.
        k2(
          /** @type {Props} */
          t
        )
      );
    if (typeof t == "string")
      return _2(t);
    throw new Error("Expected function, string, or object as test");
  }
);
function x2(t) {
  const e = [];
  let r = -1;
  for (; ++r < t.length; )
    e[r] = oi(t[r]);
  return si(n);
  function n(...i) {
    let o = -1;
    for (; ++o < e.length; )
      if (e[o].apply(this, i))
        return !0;
    return !1;
  }
}
function k2(t) {
  const e = (
    /** @type {Record<string, unknown>} */
    t
  );
  return si(r);
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
function _2(t) {
  return si(e);
  function e(r) {
    return r && r.type === t;
  }
}
function si(t) {
  return e;
  function e(r, n, i) {
    return !!(C2(r) && t.call(
      this,
      r,
      typeof n == "number" ? n : void 0,
      i || void 0
    ));
  }
}
function S2() {
  return !0;
}
function C2(t) {
  return t !== null && typeof t == "object" && "type" in t;
}
const vp = [], T2 = !0, uo = !1, I2 = "skip";
function wp(t, e, r, n) {
  let i;
  typeof e == "function" && typeof r != "function" ? (n = r, r = e) : i = e;
  const o = oi(i), s = n ? -1 : 1;
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
      let p = vp, f, g, v;
      if ((!e || o(l, c, d[d.length - 1] || void 0)) && (p = E2(r(l, d)), p[0] === uo))
        return p;
      if ("children" in l && l.children) {
        const b = (
          /** @type {UnistParent} */
          l
        );
        if (b.children && p[0] !== I2)
          for (g = (n ? b.children.length : -1) + s, v = d.concat(b); g > -1 && g < b.children.length; ) {
            const _ = b.children[g];
            if (f = a(_, g, v)(), f[0] === uo)
              return f;
            g = typeof f[1] == "number" ? f[1] : g + s;
          }
      }
      return p;
    }
  }
}
function E2(t) {
  return Array.isArray(t) ? t : typeof t == "number" ? [T2, t] : t == null ? vp : [t];
}
function ws(t, e, r, n) {
  let i, o, s;
  typeof e == "function" && typeof r != "function" ? (o = void 0, s = e, i = r) : (o = e, s = r, i = n), wp(t, o, a, i);
  function a(l, c) {
    const d = c[c.length - 1], u = d ? d.children.indexOf(l) : void 0;
    return s(l, u, d);
  }
}
const ho = {}.hasOwnProperty, A2 = {};
function R2(t, e) {
  const r = e || A2, n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = { ...p2, ...r.handlers }, a = {
    all: c,
    applyData: M2,
    definitionById: n,
    footnoteById: i,
    footnoteCounts: o,
    footnoteOrder: [],
    handlers: s,
    one: l,
    options: r,
    patch: P2,
    wrap: N2
  };
  return ws(t, function(d) {
    if (d.type === "definition" || d.type === "footnoteDefinition") {
      const u = d.type === "definition" ? n : i, h = String(d.identifier).toUpperCase();
      u.has(h) || u.set(h, d);
    }
  }), a;
  function l(d, u) {
    const h = d.type, p = a.handlers[h];
    if (ho.call(a.handlers, h) && p)
      return p(a, d, u);
    if (a.options.passThrough && a.options.passThrough.includes(h)) {
      if ("children" in d) {
        const { children: g, ...v } = d, b = Un(v);
        return b.children = a.all(d), b;
      }
      return Un(d);
    }
    return (a.options.unknownHandler || D2)(a, d, u);
  }
  function c(d) {
    const u = [];
    if ("children" in d) {
      const h = d.children;
      let p = -1;
      for (; ++p < h.length; ) {
        const f = a.one(h[p], d);
        if (f) {
          if (p && h[p - 1].type === "break" && (!Array.isArray(f) && f.type === "text" && (f.value = El(f.value)), !Array.isArray(f) && f.type === "element")) {
            const g = f.children[0];
            g && g.type === "text" && (g.value = El(g.value));
          }
          Array.isArray(f) ? u.push(...f) : u.push(f);
        }
      }
    }
    return u;
  }
}
function P2(t, e) {
  t.position && (e.position = wC(t));
}
function M2(t, e) {
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
    r.type === "element" && o && Object.assign(r.properties, Un(o)), "children" in r && r.children && i !== null && i !== void 0 && (r.children = i);
  }
  return r;
}
function D2(t, e) {
  const r = e.data || {}, n = "value" in e && !(ho.call(r, "hProperties") || ho.call(r, "hChildren")) ? { type: "text", value: e.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: t.all(e)
  };
  return t.patch(e, n), t.applyData(e, n);
}
function N2(t, e) {
  const r = [];
  let n = -1;
  for (e && r.push({ type: "text", value: `
` }); ++n < t.length; )
    n && r.push({ type: "text", value: `
` }), r.push(t[n]);
  return e && t.length > 0 && r.push({ type: "text", value: `
` }), r;
}
function El(t) {
  let e = 0, r = t.charCodeAt(e);
  for (; r === 9 || r === 32; )
    e++, r = t.charCodeAt(e);
  return t.slice(e);
}
function Al(t, e) {
  const r = R2(t, e), n = r.one(t, void 0), i = y2(r), o = Array.isArray(n) ? { type: "root", children: n } : n || { type: "root", children: [] };
  return i && o.children.push({ type: "text", value: `
` }, i), o;
}
function z2(t, e) {
  return t && "run" in t ? async function(r, n) {
    const i = (
      /** @type {HastRoot} */
      Al(r, { file: n, ...e })
    );
    await t.run(i, n);
  } : function(r, n) {
    return (
      /** @type {HastRoot} */
      Al(r, { file: n, ...t || e })
    );
  };
}
function Rl(t) {
  if (t)
    throw t;
}
var Tn = Object.prototype.hasOwnProperty, yp = Object.prototype.toString, Pl = Object.defineProperty, Ml = Object.getOwnPropertyDescriptor, Dl = function(e) {
  return typeof Array.isArray == "function" ? Array.isArray(e) : yp.call(e) === "[object Array]";
}, Nl = function(e) {
  if (!e || yp.call(e) !== "[object Object]")
    return !1;
  var r = Tn.call(e, "constructor"), n = e.constructor && e.constructor.prototype && Tn.call(e.constructor.prototype, "isPrototypeOf");
  if (e.constructor && !r && !n)
    return !1;
  var i;
  for (i in e)
    ;
  return typeof i > "u" || Tn.call(e, i);
}, zl = function(e, r) {
  Pl && r.name === "__proto__" ? Pl(e, r.name, {
    enumerable: !0,
    configurable: !0,
    value: r.newValue,
    writable: !0
  }) : e[r.name] = r.newValue;
}, Ol = function(e, r) {
  if (r === "__proto__")
    if (Tn.call(e, r)) {
      if (Ml)
        return Ml(e, r).value;
    } else
      return;
  return e[r];
}, O2 = function t() {
  var e, r, n, i, o, s, a = arguments[0], l = 1, c = arguments.length, d = !1;
  for (typeof a == "boolean" && (d = a, a = arguments[1] || {}, l = 2), (a == null || typeof a != "object" && typeof a != "function") && (a = {}); l < c; ++l)
    if (e = arguments[l], e != null)
      for (r in e)
        n = Ol(a, r), i = Ol(e, r), a !== i && (d && i && (Nl(i) || (o = Dl(i))) ? (o ? (o = !1, s = n && Dl(n) ? n : []) : s = n && Nl(n) ? n : {}, zl(a, { name: r, newValue: t(d, s, i) })) : typeof i < "u" && zl(a, { name: r, newValue: i }));
  return a;
};
const Ii = /* @__PURE__ */ Yn(O2);
function po(t) {
  if (typeof t != "object" || t === null)
    return !1;
  const e = Object.getPrototypeOf(t);
  return (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) && !(Symbol.toStringTag in t) && !(Symbol.iterator in t);
}
function L2() {
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
      i = c, d ? $2(d, a)(...c) : s(null, ...c);
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
function $2(t, e) {
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
const lt = { basename: B2, dirname: F2, extname: U2, join: j2, sep: "/" };
function B2(t, e) {
  if (e !== void 0 && typeof e != "string")
    throw new TypeError('"ext" argument must be a string');
  an(t);
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
function F2(t) {
  if (an(t), t.length === 0)
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
function U2(t) {
  an(t);
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
function j2(...t) {
  let e = -1, r;
  for (; ++e < t.length; )
    an(t[e]), t[e] && (r = r === void 0 ? t[e] : r + "/" + t[e]);
  return r === void 0 ? "." : V2(r);
}
function V2(t) {
  an(t);
  const e = t.codePointAt(0) === 47;
  let r = q2(t, !e);
  return r.length === 0 && !e && (r = "."), r.length > 0 && t.codePointAt(t.length - 1) === 47 && (r += "/"), e ? "/" + r : r;
}
function q2(t, e) {
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
function an(t) {
  if (typeof t != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(t)
    );
}
const H2 = { cwd: G2 };
function G2() {
  return "/";
}
function fo(t) {
  return !!(t !== null && typeof t == "object" && "href" in t && t.href && "protocol" in t && t.protocol && // @ts-expect-error: indexing is fine.
  t.auth === void 0);
}
function W2(t) {
  if (typeof t == "string")
    t = new URL(t);
  else if (!fo(t)) {
    const e = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + t + "`"
    );
    throw e.code = "ERR_INVALID_ARG_TYPE", e;
  }
  if (t.protocol !== "file:") {
    const e = new TypeError("The URL must be of scheme file");
    throw e.code = "ERR_INVALID_URL_SCHEME", e;
  }
  return K2(t);
}
function K2(t) {
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
const Ei = (
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
class xp {
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
    e ? fo(e) ? r = { path: e } : typeof e == "string" || Q2(e) ? r = { value: e } : r = e : r = {}, this.cwd = "cwd" in r ? "" : H2.cwd(), this.data = {}, this.history = [], this.messages = [], this.value, this.map, this.result, this.stored;
    let n = -1;
    for (; ++n < Ei.length; ) {
      const o = Ei[n];
      o in r && r[o] !== void 0 && r[o] !== null && (this[o] = o === "history" ? [...r[o]] : r[o]);
    }
    let i;
    for (i in r)
      Ei.includes(i) || (this[i] = r[i]);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path == "string" ? lt.basename(this.path) : void 0;
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
    Ri(e, "basename"), Ai(e, "basename"), this.path = lt.join(this.dirname || "", e);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path == "string" ? lt.dirname(this.path) : void 0;
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
    Ll(this.basename, "dirname"), this.path = lt.join(e || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path == "string" ? lt.extname(this.path) : void 0;
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
    if (Ai(e, "extname"), Ll(this.dirname, "extname"), e) {
      if (e.codePointAt(0) !== 46)
        throw new Error("`extname` must start with `.`");
      if (e.includes(".", 1))
        throw new Error("`extname` cannot contain multiple dots");
    }
    this.path = lt.join(this.dirname, this.stem + (e || ""));
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
    fo(e) && (e = W2(e)), Ri(e, "path"), this.path !== e && this.history.push(e);
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path == "string" ? lt.basename(this.path, this.extname) : void 0;
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
    Ri(e, "stem"), Ai(e, "stem"), this.path = lt.join(this.dirname || "", e + (this.extname || ""));
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
function Ai(t, e) {
  if (t && t.includes(lt.sep))
    throw new Error(
      "`" + e + "` cannot be a path: did not expect `" + lt.sep + "`"
    );
}
function Ri(t, e) {
  if (!t)
    throw new Error("`" + e + "` cannot be empty");
}
function Ll(t, e) {
  if (!t)
    throw new Error("Setting `" + e + "` requires `path` to be set too");
}
function Q2(t) {
  return !!(t && typeof t == "object" && "byteLength" in t && "byteOffset" in t);
}
const Y2 = (
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
), J2 = {}.hasOwnProperty;
class ys extends Y2 {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy"), this.Compiler = void 0, this.Parser = void 0, this.attachers = [], this.compiler = void 0, this.freezeIndex = -1, this.frozen = void 0, this.namespace = {}, this.parser = void 0, this.transformers = L2();
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
      new ys()
    );
    let r = -1;
    for (; ++r < this.attachers.length; ) {
      const n = this.attachers[r];
      e.use(...n);
    }
    return e.data(Ii(!0, {}, this.namespace)), e;
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
    return typeof e == "string" ? arguments.length === 2 ? (Di("data", this.frozen), this.namespace[e] = r, this) : J2.call(this.namespace, e) && this.namespace[e] || void 0 : e ? (Di("data", this.frozen), this.namespace = e, this) : this.namespace;
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
    const r = xn(e), n = this.parser || this.Parser;
    return Pi("parse", n), n(String(r), r);
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
    return this.freeze(), Pi("process", this.parser || this.Parser), Mi("process", this.compiler || this.Compiler), r ? i(void 0, r) : new Promise(i);
    function i(o, s) {
      const a = xn(e), l = (
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
        ), f = n.stringify(p, h);
        eE(f) ? h.value = f : h.result = f, c(
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
    return this.freeze(), Pi("processSync", this.parser || this.Parser), Mi("processSync", this.compiler || this.Compiler), this.process(e, i), Bl("processSync", "process", r), n;
    function i(o, s) {
      r = !0, Rl(o), n = s;
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
    $l(e), this.freeze();
    const i = this.transformers;
    return !n && typeof r == "function" && (n = r, r = void 0), n ? o(void 0, n) : new Promise(o);
    function o(s, a) {
      const l = xn(r);
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
    return this.run(e, r, o), Bl("runSync", "run", n), i;
    function o(s, a) {
      Rl(s), i = a, n = !0;
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
    const n = xn(r), i = this.compiler || this.Compiler;
    return Mi("stringify", i), $l(e), i(e, n);
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
    if (Di("use", this.frozen), e != null)
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
      a(c.plugins), c.settings && (i.settings = Ii(!0, i.settings, c.settings));
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
        let [p, ...f] = d;
        const g = n[h][1];
        po(g) && po(p) && (p = Ii(!0, g, p)), n[h] = [c, p, ...f];
      }
    }
  }
}
const X2 = new ys().freeze();
function Pi(t, e) {
  if (typeof e != "function")
    throw new TypeError("Cannot `" + t + "` without `parser`");
}
function Mi(t, e) {
  if (typeof e != "function")
    throw new TypeError("Cannot `" + t + "` without `compiler`");
}
function Di(t, e) {
  if (e)
    throw new Error(
      "Cannot call `" + t + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
}
function $l(t) {
  if (!po(t) || typeof t.type != "string")
    throw new TypeError("Expected node, got `" + t + "`");
}
function Bl(t, e, r) {
  if (!r)
    throw new Error(
      "`" + t + "` finished async. Use `" + e + "` instead"
    );
}
function xn(t) {
  return Z2(t) ? t : new xp(t);
}
function Z2(t) {
  return !!(t && typeof t == "object" && "message" in t && "messages" in t);
}
function eE(t) {
  return typeof t == "string" || tE(t);
}
function tE(t) {
  return !!(t && typeof t == "object" && "byteLength" in t && "byteOffset" in t);
}
const rE = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md", Fl = [], Ul = { allowDangerousHtml: !0 }, nE = /^(https?|ircs?|mailto|xmpp)$/i, iE = [
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
function oE(t) {
  const e = sE(t), r = aE(t);
  return lE(e.runSync(e.parse(r), r), t);
}
function sE(t) {
  const e = t.rehypePlugins || Fl, r = t.remarkPlugins || Fl, n = t.remarkRehypeOptions ? { ...t.remarkRehypeOptions, ...Ul } : Ul;
  return X2().use(UI).use(r).use(z2, n).use(e);
}
function aE(t) {
  const e = t.children || "", r = new xp();
  return typeof e == "string" && (r.value = e), r;
}
function lE(t, e) {
  const r = e.allowedElements, n = e.allowElement, i = e.components, o = e.disallowedElements, s = e.skipHtml, a = e.unwrapDisallowed, l = e.urlTransform || cE;
  for (const d of iE)
    Object.hasOwn(e, d.from) && ("" + d.from + (d.to ? "use `" + d.to + "` instead" : "remove it") + rE + d.id, void 0);
  return ws(t, c), SC(t, {
    Fragment: it,
    components: i,
    ignoreInvalidStyle: !0,
    jsx: m,
    jsxs: V,
    passKeys: !0,
    passNode: !0
  });
  function c(d, u, h) {
    if (d.type === "raw" && h && typeof u == "number")
      return s ? h.children.splice(u, 1) : h.children[u] = { type: "text", value: d.value }, u;
    if (d.type === "element") {
      let p;
      for (p in Si)
        if (Object.hasOwn(Si, p) && Object.hasOwn(d.properties, p)) {
          const f = d.properties[p], g = Si[p];
          (g === null || g.includes(d.tagName)) && (d.properties[p] = l(String(f || ""), p, d));
        }
    }
    if (d.type === "element") {
      let p = r ? !r.includes(d.tagName) : o ? o.includes(d.tagName) : !1;
      if (!p && n && typeof u == "number" && (p = !n(d, u, h)), p && h && typeof u == "number")
        return a && d.children ? h.children.splice(u, 1, ...d.children) : h.children.splice(u, 1), u;
    }
  }
}
function cE(t) {
  const e = t.indexOf(":"), r = t.indexOf("?"), n = t.indexOf("#"), i = t.indexOf("/");
  return (
    // If there is no protocol, it’s relative.
    e === -1 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    i !== -1 && e > i || r !== -1 && e > r || n !== -1 && e > n || // It is a protocol, it should be allowed.
    nE.test(t.slice(0, e)) ? t : ""
  );
}
const { useSmooth: uE, useSmoothStatus: dE, withSmoothContextProvider: hE } = xk, pE = ({ components: t, componentsByLanguage: e, smooth: r = !0, defer: n = !1, preprocess: i, ...o }) => {
  const s = Hd(), { text: a } = uE(kt(() => i ? {
    ...s,
    text: i(s.text)
  } : s, [s, i]), r), l = sc(a), c = n ? l : a, { pre: d = yS, code: u = xS, SyntaxHighlighter: h = is, CodeHeader: p = kS } = t ?? {}, f = kt(() => ({
    Pre: d,
    Code: u,
    SyntaxHighlighter: h,
    CodeHeader: p
  }), [
    d,
    u,
    h,
    p
  ]), g = qt((v) => /* @__PURE__ */ m(IS, {
    components: f,
    componentsByLanguage: e,
    ...v
  }));
  return /* @__PURE__ */ m(oE, {
    components: kt(() => {
      const { pre: v, code: b, SyntaxHighlighter: _, CodeHeader: k, ...I } = t ?? {};
      return {
        ...I,
        pre: wS,
        code: g
      };
    }, [g, t]),
    ...o,
    children: c
  });
}, kp = te(({ className: t, containerProps: e, containerComponent: r = "div", ...n }, i) => /* @__PURE__ */ m(r, {
  "data-status": dE().type,
  ...e,
  className: $h(t, e == null ? void 0 : e.className),
  ref: i,
  children: /* @__PURE__ */ m(pE, { ...n })
}));
kp.displayName = "MarkdownTextPrimitive";
const fE = hE(kp);
function jl(t, e) {
  const r = String(t);
  if (typeof e != "string")
    throw new TypeError("Expected character");
  let n = 0, i = r.indexOf(e);
  for (; i !== -1; )
    n++, i = r.indexOf(e, i + e.length);
  return n;
}
function mE(t) {
  if (typeof t != "string")
    throw new TypeError("Expected a string");
  return t.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function gE(t, e, r) {
  const i = oi((r || {}).ignore || []), o = bE(e);
  let s = -1;
  for (; ++s < o.length; )
    wp(t, "text", a);
  function a(c, d) {
    let u = -1, h;
    for (; ++u < d.length; ) {
      const p = d[u], f = h ? h.children : void 0;
      if (i(
        p,
        f ? f.indexOf(p) : void 0,
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
    let f = 0;
    const v = u.children.indexOf(c);
    let b = !1, _ = [];
    h.lastIndex = 0;
    let k = h.exec(c.value);
    for (; k; ) {
      const I = k.index, E = {
        index: k.index,
        input: k.input,
        stack: [...d, c]
      };
      let y = p(...k, E);
      if (typeof y == "string" && (y = y.length > 0 ? { type: "text", value: y } : void 0), y === !1 ? h.lastIndex = I + 1 : (f !== I && _.push({
        type: "text",
        value: c.value.slice(f, I)
      }), Array.isArray(y) ? _.push(...y) : y && _.push(y), f = I + k[0].length, b = !0), !h.global)
        break;
      k = h.exec(c.value);
    }
    return b ? (f < c.value.length && _.push({ type: "text", value: c.value.slice(f) }), u.children.splice(v, 1, ..._)) : _ = [c], v + _.length;
  }
}
function bE(t) {
  const e = [];
  if (!Array.isArray(t))
    throw new TypeError("Expected find and replace tuple or list of tuples");
  const r = !t[0] || Array.isArray(t[0]) ? t : [t];
  let n = -1;
  for (; ++n < r.length; ) {
    const i = r[n];
    e.push([vE(i[0]), wE(i[1])]);
  }
  return e;
}
function vE(t) {
  return typeof t == "string" ? new RegExp(mE(t), "g") : t;
}
function wE(t) {
  return typeof t == "function" ? t : function() {
    return t;
  };
}
const Ni = "phrasing", zi = ["autolink", "link", "image", "label"];
function yE() {
  return {
    transforms: [IE],
    enter: {
      literalAutolink: kE,
      literalAutolinkEmail: Oi,
      literalAutolinkHttp: Oi,
      literalAutolinkWww: Oi
    },
    exit: {
      literalAutolink: TE,
      literalAutolinkEmail: CE,
      literalAutolinkHttp: _E,
      literalAutolinkWww: SE
    }
  };
}
function xE() {
  return {
    unsafe: [
      {
        character: "@",
        before: "[+\\-.\\w]",
        after: "[\\-.\\w]",
        inConstruct: Ni,
        notInConstruct: zi
      },
      {
        character: ".",
        before: "[Ww]",
        after: "[\\-.\\w]",
        inConstruct: Ni,
        notInConstruct: zi
      },
      {
        character: ":",
        before: "[ps]",
        after: "\\/",
        inConstruct: Ni,
        notInConstruct: zi
      }
    ]
  };
}
function kE(t) {
  this.enter({ type: "link", title: null, url: "", children: [] }, t);
}
function Oi(t) {
  this.config.enter.autolinkProtocol.call(this, t);
}
function _E(t) {
  this.config.exit.autolinkProtocol.call(this, t);
}
function SE(t) {
  this.config.exit.data.call(this, t);
  const e = this.stack[this.stack.length - 1];
  e.type, e.url = "http://" + this.sliceSerialize(t);
}
function CE(t) {
  this.config.exit.autolinkEmail.call(this, t);
}
function TE(t) {
  this.exit(t);
}
function IE(t) {
  gE(
    t,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, EE],
      [new RegExp("(?<=^|\\s|\\p{P}|\\p{S})([-.\\w+]+)@([-\\w]+(?:\\.[-\\w]+)+)", "gu"), AE]
    ],
    { ignore: ["link", "linkReference"] }
  );
}
function EE(t, e, r, n, i) {
  let o = "";
  if (!_p(i) || (/^w/i.test(e) && (r = e + r, e = "", o = "http://"), !RE(r)))
    return !1;
  const s = PE(r + n);
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
function AE(t, e, r, n) {
  return (
    // Not an expected previous character.
    !_p(n, !0) || // Label ends in not allowed character.
    /[-\d_]$/.test(r) ? !1 : {
      type: "link",
      title: null,
      url: "mailto:" + e + "@" + r,
      children: [{ type: "text", value: e + "@" + r }]
    }
  );
}
function RE(t) {
  const e = t.split(".");
  return !(e.length < 2 || e[e.length - 1] && (/_/.test(e[e.length - 1]) || !/[a-zA-Z\d]/.test(e[e.length - 1])) || e[e.length - 2] && (/_/.test(e[e.length - 2]) || !/[a-zA-Z\d]/.test(e[e.length - 2])));
}
function PE(t) {
  const e = /[!"&'),.:;<>?\]}]+$/.exec(t);
  if (!e)
    return [t, void 0];
  t = t.slice(0, e.index);
  let r = e[0], n = r.indexOf(")");
  const i = jl(t, "(");
  let o = jl(t, ")");
  for (; n !== -1 && i > o; )
    t += r.slice(0, n + 1), r = r.slice(n + 1), n = r.indexOf(")"), o++;
  return [t, r];
}
function _p(t, e) {
  const r = t.input.charCodeAt(t.index - 1);
  return (t.index === 0 || Ht(r) || ri(r)) && // If it’s an email, the previous character should not be a slash.
  (!e || r !== 47);
}
Sp.peek = FE;
function ME() {
  this.buffer();
}
function DE(t) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, t);
}
function NE() {
  this.buffer();
}
function zE(t) {
  this.enter(
    { type: "footnoteDefinition", identifier: "", label: "", children: [] },
    t
  );
}
function OE(t) {
  const e = this.resume(), r = this.stack[this.stack.length - 1];
  r.type, r.identifier = tt(
    this.sliceSerialize(t)
  ).toLowerCase(), r.label = e;
}
function LE(t) {
  this.exit(t);
}
function $E(t) {
  const e = this.resume(), r = this.stack[this.stack.length - 1];
  r.type, r.identifier = tt(
    this.sliceSerialize(t)
  ).toLowerCase(), r.label = e;
}
function BE(t) {
  this.exit(t);
}
function FE() {
  return "[";
}
function Sp(t, e, r, n) {
  const i = r.createTracker(n);
  let o = i.move("[^");
  const s = r.enter("footnoteReference"), a = r.enter("reference");
  return o += i.move(
    r.safe(r.associationId(t), { after: "]", before: o })
  ), a(), s(), o += i.move("]"), o;
}
function UE() {
  return {
    enter: {
      gfmFootnoteCallString: ME,
      gfmFootnoteCall: DE,
      gfmFootnoteDefinitionLabelString: NE,
      gfmFootnoteDefinition: zE
    },
    exit: {
      gfmFootnoteCallString: OE,
      gfmFootnoteCall: LE,
      gfmFootnoteDefinitionLabelString: $E,
      gfmFootnoteDefinition: BE
    }
  };
}
function jE(t) {
  let e = !1;
  return t && t.firstLineBlank && (e = !0), {
    handlers: { footnoteDefinition: r, footnoteReference: Sp },
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
        e ? Cp : VE
      )
    )), c(), l;
  }
}
function VE(t, e, r) {
  return e === 0 ? t : Cp(t, e, r);
}
function Cp(t, e, r) {
  return (r ? "" : "    ") + t;
}
const qE = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];
Tp.peek = QE;
function HE() {
  return {
    canContainEols: ["delete"],
    enter: { strikethrough: WE },
    exit: { strikethrough: KE }
  };
}
function GE() {
  return {
    unsafe: [
      {
        character: "~",
        inConstruct: "phrasing",
        notInConstruct: qE
      }
    ],
    handlers: { delete: Tp }
  };
}
function WE(t) {
  this.enter({ type: "delete", children: [] }, t);
}
function KE(t) {
  this.exit(t);
}
function Tp(t, e, r, n) {
  const i = r.createTracker(n), o = r.enter("strikethrough");
  let s = i.move("~~");
  return s += r.containerPhrasing(t, {
    ...i.current(),
    before: s,
    after: "~"
  }), s += i.move("~~"), o(), s;
}
function QE() {
  return "~";
}
function YE(t) {
  return t.length;
}
function JE(t, e) {
  const r = e || {}, n = (r.align || []).concat(), i = r.stringLength || YE, o = [], s = [], a = [], l = [];
  let c = 0, d = -1;
  for (; ++d < t.length; ) {
    const g = [], v = [];
    let b = -1;
    for (t[d].length > c && (c = t[d].length); ++b < t[d].length; ) {
      const _ = XE(t[d][b]);
      if (r.alignDelimiters !== !1) {
        const k = i(_);
        v[b] = k, (l[b] === void 0 || k > l[b]) && (l[b] = k);
      }
      g.push(_);
    }
    s[d] = g, a[d] = v;
  }
  let u = -1;
  if (typeof n == "object" && "length" in n)
    for (; ++u < c; )
      o[u] = Vl(n[u]);
  else {
    const g = Vl(n);
    for (; ++u < c; )
      o[u] = g;
  }
  u = -1;
  const h = [], p = [];
  for (; ++u < c; ) {
    const g = o[u];
    let v = "", b = "";
    g === 99 ? (v = ":", b = ":") : g === 108 ? v = ":" : g === 114 && (b = ":");
    let _ = r.alignDelimiters === !1 ? 1 : Math.max(
      1,
      l[u] - v.length - b.length
    );
    const k = v + "-".repeat(_) + b;
    r.alignDelimiters !== !1 && (_ = v.length + _ + b.length, _ > l[u] && (l[u] = _), p[u] = _), h[u] = k;
  }
  s.splice(1, 0, h), a.splice(1, 0, p), d = -1;
  const f = [];
  for (; ++d < s.length; ) {
    const g = s[d], v = a[d];
    u = -1;
    const b = [];
    for (; ++u < c; ) {
      const _ = g[u] || "";
      let k = "", I = "";
      if (r.alignDelimiters !== !1) {
        const E = l[u] - (v[u] || 0), y = o[u];
        y === 114 ? k = " ".repeat(E) : y === 99 ? E % 2 ? (k = " ".repeat(E / 2 + 0.5), I = " ".repeat(E / 2 - 0.5)) : (k = " ".repeat(E / 2), I = k) : I = " ".repeat(E);
      }
      r.delimiterStart !== !1 && !u && b.push("|"), r.padding !== !1 && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(r.alignDelimiters === !1 && _ === "") && (r.delimiterStart !== !1 || u) && b.push(" "), r.alignDelimiters !== !1 && b.push(k), b.push(_), r.alignDelimiters !== !1 && b.push(I), r.padding !== !1 && b.push(" "), (r.delimiterEnd !== !1 || u !== c - 1) && b.push("|");
    }
    f.push(
      r.delimiterEnd === !1 ? b.join("").replace(/ +$/, "") : b.join("")
    );
  }
  return f.join(`
`);
}
function XE(t) {
  return t == null ? "" : String(t);
}
function Vl(t) {
  const e = typeof t == "string" ? t.codePointAt(0) : 0;
  return e === 67 || e === 99 ? 99 : e === 76 || e === 108 ? 108 : e === 82 || e === 114 ? 114 : 0;
}
function ZE(t, e, r, n) {
  const i = r.enter("blockquote"), o = r.createTracker(n);
  o.move("> "), o.shift(2);
  const s = r.indentLines(
    r.containerFlow(t, o.current()),
    eA
  );
  return i(), s;
}
function eA(t, e, r) {
  return ">" + (r ? "" : " ") + t;
}
function tA(t, e) {
  return ql(t, e.inConstruct, !0) && !ql(t, e.notInConstruct, !1);
}
function ql(t, e, r) {
  if (typeof e == "string" && (e = [e]), !e || e.length === 0)
    return r;
  let n = -1;
  for (; ++n < e.length; )
    if (t.includes(e[n]))
      return !0;
  return !1;
}
function Hl(t, e, r, n) {
  let i = -1;
  for (; ++i < r.unsafe.length; )
    if (r.unsafe[i].character === `
` && tA(r.stack, r.unsafe[i]))
      return /[ \t]/.test(n.before) ? "" : " ";
  return `\\
`;
}
function rA(t, e) {
  const r = String(t);
  let n = r.indexOf(e), i = n, o = 0, s = 0;
  if (typeof e != "string")
    throw new TypeError("Expected substring");
  for (; n !== -1; )
    n === i ? ++o > s && (s = o) : o = 1, i = n + e.length, n = r.indexOf(e, i);
  return s;
}
function nA(t, e) {
  return !!(e.options.fences === !1 && t.value && // If there’s no info…
  !t.lang && // And there’s a non-whitespace character…
  /[^ \r\n]/.test(t.value) && // And the value doesn’t start or end in a blank…
  !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(t.value));
}
function iA(t) {
  const e = t.options.fence || "`";
  if (e !== "`" && e !== "~")
    throw new Error(
      "Cannot serialize code with `" + e + "` for `options.fence`, expected `` ` `` or `~`"
    );
  return e;
}
function oA(t, e, r, n) {
  const i = iA(r), o = t.value || "", s = i === "`" ? "GraveAccent" : "Tilde";
  if (nA(t, r)) {
    const u = r.enter("codeIndented"), h = r.indentLines(o, sA);
    return u(), h;
  }
  const a = r.createTracker(n), l = i.repeat(Math.max(rA(o, i) + 1, 3)), c = r.enter("codeFenced");
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
function sA(t, e, r) {
  return (r ? "" : "    ") + t;
}
function xs(t) {
  const e = t.options.quote || '"';
  if (e !== '"' && e !== "'")
    throw new Error(
      "Cannot serialize title with `" + e + "` for `options.quote`, expected `\"`, or `'`"
    );
  return e;
}
function aA(t, e, r, n) {
  const i = xs(r), o = i === '"' ? "Quote" : "Apostrophe", s = r.enter("definition");
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
function lA(t) {
  const e = t.options.emphasis || "*";
  if (e !== "*" && e !== "_")
    throw new Error(
      "Cannot serialize emphasis with `" + e + "` for `options.emphasis`, expected `*`, or `_`"
    );
  return e;
}
function Kr(t) {
  return "&#x" + t.toString(16).toUpperCase() + ";";
}
function jn(t, e, r) {
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
Ip.peek = cA;
function Ip(t, e, r, n) {
  const i = lA(r), o = r.enter("emphasis"), s = r.createTracker(n), a = s.move(i);
  let l = s.move(
    r.containerPhrasing(t, {
      after: i,
      before: a,
      ...s.current()
    })
  );
  const c = l.charCodeAt(0), d = jn(
    n.before.charCodeAt(n.before.length - 1),
    c,
    i
  );
  d.inside && (l = Kr(c) + l.slice(1));
  const u = l.charCodeAt(l.length - 1), h = jn(n.after.charCodeAt(0), u, i);
  h.inside && (l = l.slice(0, -1) + Kr(u));
  const p = s.move(i);
  return o(), r.attentionEncodeSurroundingInfo = {
    after: h.outside,
    before: d.outside
  }, a + l + p;
}
function cA(t, e, r) {
  return r.options.emphasis || "*";
}
function uA(t, e) {
  let r = !1;
  return ws(t, function(n) {
    if ("value" in n && /\r?\n|\r/.test(n.value) || n.type === "break")
      return r = !0, uo;
  }), !!((!t.depth || t.depth < 3) && hs(t) && (e.options.setext || r));
}
function dA(t, e, r, n) {
  const i = Math.max(Math.min(6, t.depth || 1), 1), o = r.createTracker(n);
  if (uA(t, r)) {
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
  return /^[\t ]/.test(c) && (c = Kr(c.charCodeAt(0)) + c.slice(1)), c = c ? s + " " + c : s, r.options.closeAtx && (c += " " + s), l(), a(), c;
}
Ep.peek = hA;
function Ep(t) {
  return t.value || "";
}
function hA() {
  return "<";
}
Ap.peek = pA;
function Ap(t, e, r, n) {
  const i = xs(r), o = i === '"' ? "Quote" : "Apostrophe", s = r.enter("image");
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
function pA() {
  return "!";
}
Rp.peek = fA;
function Rp(t, e, r, n) {
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
function fA() {
  return "!";
}
Pp.peek = mA;
function Pp(t, e, r) {
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
function mA() {
  return "`";
}
function Mp(t, e) {
  const r = hs(t);
  return !!(!e.options.resourceLink && // If there’s a url…
  t.url && // And there’s a no title…
  !t.title && // And the content of `node` is a single text node…
  t.children && t.children.length === 1 && t.children[0].type === "text" && // And if the url is the same as the content…
  (r === t.url || "mailto:" + r === t.url) && // And that starts w/ a protocol…
  /^[a-z][a-z+.-]+:/i.test(t.url) && // And that doesn’t contain ASCII control codes (character escapes and
  // references don’t work), space, or angle brackets…
  !/[\0- <>\u007F]/.test(t.url));
}
Dp.peek = gA;
function Dp(t, e, r, n) {
  const i = xs(r), o = i === '"' ? "Quote" : "Apostrophe", s = r.createTracker(n);
  let a, l;
  if (Mp(t, r)) {
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
function gA(t, e, r) {
  return Mp(t, r) ? "<" : "[";
}
Np.peek = bA;
function Np(t, e, r, n) {
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
function bA() {
  return "[";
}
function ks(t) {
  const e = t.options.bullet || "*";
  if (e !== "*" && e !== "+" && e !== "-")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.bullet`, expected `*`, `+`, or `-`"
    );
  return e;
}
function vA(t) {
  const e = ks(t), r = t.options.bulletOther;
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
function wA(t) {
  const e = t.options.bulletOrdered || ".";
  if (e !== "." && e !== ")")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.bulletOrdered`, expected `.` or `)`"
    );
  return e;
}
function zp(t) {
  const e = t.options.rule || "*";
  if (e !== "*" && e !== "-" && e !== "_")
    throw new Error(
      "Cannot serialize rules with `" + e + "` for `options.rule`, expected `*`, `-`, or `_`"
    );
  return e;
}
function yA(t, e, r, n) {
  const i = r.enter("list"), o = r.bulletCurrent;
  let s = t.ordered ? wA(r) : ks(r);
  const a = t.ordered ? s === "." ? ")" : "." : vA(r);
  let l = e && r.bulletLastUsed ? s === r.bulletLastUsed : !1;
  if (!t.ordered) {
    const d = t.children ? t.children[0] : void 0;
    if (
      // Bullet could be used as a thematic break marker:
      (s === "*" || s === "-") && // Empty first list item:
      d && (!d.children || !d.children[0]) && // Directly in two other list items:
      r.stack[r.stack.length - 1] === "list" && r.stack[r.stack.length - 2] === "listItem" && r.stack[r.stack.length - 3] === "list" && r.stack[r.stack.length - 4] === "listItem" && // That are each the first child.
      r.indexStack[r.indexStack.length - 1] === 0 && r.indexStack[r.indexStack.length - 2] === 0 && r.indexStack[r.indexStack.length - 3] === 0 && (l = !0), zp(r) === s && d
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
function xA(t) {
  const e = t.options.listItemIndent || "one";
  if (e !== "tab" && e !== "one" && e !== "mixed")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
    );
  return e;
}
function kA(t, e, r, n) {
  const i = xA(r);
  let o = r.bulletCurrent || ks(r);
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
function _A(t, e, r, n) {
  const i = r.enter("paragraph"), o = r.enter("phrasing"), s = r.containerPhrasing(t, n);
  return o(), i(), s;
}
const SA = (
  /** @type {(node?: unknown) => node is Exclude<PhrasingContent, Html>} */
  oi([
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
function CA(t, e, r, n) {
  return (t.children.some(function(s) {
    return SA(s);
  }) ? r.containerPhrasing : r.containerFlow).call(r, t, n);
}
function TA(t) {
  const e = t.options.strong || "*";
  if (e !== "*" && e !== "_")
    throw new Error(
      "Cannot serialize strong with `" + e + "` for `options.strong`, expected `*`, or `_`"
    );
  return e;
}
Op.peek = IA;
function Op(t, e, r, n) {
  const i = TA(r), o = r.enter("strong"), s = r.createTracker(n), a = s.move(i + i);
  let l = s.move(
    r.containerPhrasing(t, {
      after: i,
      before: a,
      ...s.current()
    })
  );
  const c = l.charCodeAt(0), d = jn(
    n.before.charCodeAt(n.before.length - 1),
    c,
    i
  );
  d.inside && (l = Kr(c) + l.slice(1));
  const u = l.charCodeAt(l.length - 1), h = jn(n.after.charCodeAt(0), u, i);
  h.inside && (l = l.slice(0, -1) + Kr(u));
  const p = s.move(i + i);
  return o(), r.attentionEncodeSurroundingInfo = {
    after: h.outside,
    before: d.outside
  }, a + l + p;
}
function IA(t, e, r) {
  return r.options.strong || "*";
}
function EA(t, e, r, n) {
  return r.safe(t.value, n);
}
function AA(t) {
  const e = t.options.ruleRepetition || 3;
  if (e < 3)
    throw new Error(
      "Cannot serialize rules with repetition `" + e + "` for `options.ruleRepetition`, expected `3` or more"
    );
  return e;
}
function RA(t, e, r) {
  const n = (zp(r) + (r.options.ruleSpaces ? " " : "")).repeat(AA(r));
  return r.options.ruleSpaces ? n.slice(0, -1) : n;
}
const Lp = {
  blockquote: ZE,
  break: Hl,
  code: oA,
  definition: aA,
  emphasis: Ip,
  hardBreak: Hl,
  heading: dA,
  html: Ep,
  image: Ap,
  imageReference: Rp,
  inlineCode: Pp,
  link: Dp,
  linkReference: Np,
  list: yA,
  listItem: kA,
  paragraph: _A,
  root: CA,
  strong: Op,
  text: EA,
  thematicBreak: RA
};
function PA() {
  return {
    enter: {
      table: MA,
      tableData: Gl,
      tableHeader: Gl,
      tableRow: NA
    },
    exit: {
      codeText: zA,
      table: DA,
      tableData: Li,
      tableHeader: Li,
      tableRow: Li
    }
  };
}
function MA(t) {
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
function DA(t) {
  this.exit(t), this.data.inTable = void 0;
}
function NA(t) {
  this.enter({ type: "tableRow", children: [] }, t);
}
function Li(t) {
  this.exit(t);
}
function Gl(t) {
  this.enter({ type: "tableCell", children: [] }, t);
}
function zA(t) {
  let e = this.resume();
  this.data.inTable && (e = e.replace(/\\([\\|])/g, OA));
  const r = this.stack[this.stack.length - 1];
  r.type, r.value = e, this.exit(t);
}
function OA(t, e) {
  return e === "|" ? e : t;
}
function LA(t) {
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
  function s(p, f, g, v) {
    return c(d(p, g, v), p.align);
  }
  function a(p, f, g, v) {
    const b = u(p, g, v), _ = c([b]);
    return _.slice(0, _.indexOf(`
`));
  }
  function l(p, f, g, v) {
    const b = g.enter("tableCell"), _ = g.enter("phrasing"), k = g.containerPhrasing(p, {
      ...v,
      before: o,
      after: o
    });
    return _(), b(), k;
  }
  function c(p, f) {
    return JE(p, {
      align: f,
      // @ts-expect-error: `markdown-table` types should support `null`.
      alignDelimiters: n,
      // @ts-expect-error: `markdown-table` types should support `null`.
      padding: r,
      // @ts-expect-error: `markdown-table` types should support `null`.
      stringLength: i
    });
  }
  function d(p, f, g) {
    const v = p.children;
    let b = -1;
    const _ = [], k = f.enter("table");
    for (; ++b < v.length; )
      _[b] = u(v[b], f, g);
    return k(), _;
  }
  function u(p, f, g) {
    const v = p.children;
    let b = -1;
    const _ = [], k = f.enter("tableRow");
    for (; ++b < v.length; )
      _[b] = l(v[b], p, f, g);
    return k(), _;
  }
  function h(p, f, g) {
    let v = Lp.inlineCode(p, f, g);
    return g.stack.includes("tableCell") && (v = v.replace(/\|/g, "\\$&")), v;
  }
}
function $A() {
  return {
    exit: {
      taskListCheckValueChecked: Wl,
      taskListCheckValueUnchecked: Wl,
      paragraph: FA
    }
  };
}
function BA() {
  return {
    unsafe: [{ atBreak: !0, character: "-", after: "[:|-]" }],
    handlers: { listItem: UA }
  };
}
function Wl(t) {
  const e = this.stack[this.stack.length - 2];
  e.type, e.checked = t.type === "taskListCheckValueChecked";
}
function FA(t) {
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
function UA(t, e, r, n) {
  const i = t.children[0], o = typeof t.checked == "boolean" && i && i.type === "paragraph", s = "[" + (t.checked ? "x" : " ") + "] ", a = r.createTracker(n);
  o && a.move(s);
  let l = Lp.listItem(t, e, r, {
    ...n,
    ...a.current()
  });
  return o && (l = l.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, c)), l;
  function c(d) {
    return d + s;
  }
}
function jA() {
  return [
    yE(),
    UE(),
    HE(),
    PA(),
    $A()
  ];
}
function VA(t) {
  return {
    extensions: [
      xE(),
      jE(t),
      GE(),
      LA(t),
      BA()
    ]
  };
}
const qA = {
  tokenize: YA,
  partial: !0
}, $p = {
  tokenize: JA,
  partial: !0
}, Bp = {
  tokenize: XA,
  partial: !0
}, Fp = {
  tokenize: ZA,
  partial: !0
}, HA = {
  tokenize: e3,
  partial: !0
}, Up = {
  name: "wwwAutolink",
  tokenize: KA,
  previous: Vp
}, jp = {
  name: "protocolAutolink",
  tokenize: QA,
  previous: qp
}, vt = {
  name: "emailAutolink",
  tokenize: WA,
  previous: Hp
}, ht = {};
function GA() {
  return {
    text: ht
  };
}
let Nt = 48;
for (; Nt < 123; )
  ht[Nt] = vt, Nt++, Nt === 58 ? Nt = 65 : Nt === 91 && (Nt = 97);
ht[43] = vt;
ht[45] = vt;
ht[46] = vt;
ht[95] = vt;
ht[72] = [vt, jp];
ht[104] = [vt, jp];
ht[87] = [vt, Up];
ht[119] = [vt, Up];
function WA(t, e, r) {
  const n = this;
  let i, o;
  return s;
  function s(u) {
    return !mo(u) || !Hp.call(n, n.previous) || _s(n.events) ? r(u) : (t.enter("literalAutolink"), t.enter("literalAutolinkEmail"), a(u));
  }
  function a(u) {
    return mo(u) ? (t.consume(u), a) : u === 64 ? (t.consume(u), l) : r(u);
  }
  function l(u) {
    return u === 46 ? t.check(HA, d, c)(u) : u === 45 || u === 95 || Ee(u) ? (o = !0, t.consume(u), l) : d(u);
  }
  function c(u) {
    return t.consume(u), i = !0, l;
  }
  function d(u) {
    return o && i && Me(n.previous) ? (t.exit("literalAutolinkEmail"), t.exit("literalAutolink"), e(u)) : r(u);
  }
}
function KA(t, e, r) {
  const n = this;
  return i;
  function i(s) {
    return s !== 87 && s !== 119 || !Vp.call(n, n.previous) || _s(n.events) ? r(s) : (t.enter("literalAutolink"), t.enter("literalAutolinkWww"), t.check(qA, t.attempt($p, t.attempt(Bp, o), r), r)(s));
  }
  function o(s) {
    return t.exit("literalAutolinkWww"), t.exit("literalAutolink"), e(s);
  }
}
function QA(t, e, r) {
  const n = this;
  let i = "", o = !1;
  return s;
  function s(u) {
    return (u === 72 || u === 104) && qp.call(n, n.previous) && !_s(n.events) ? (t.enter("literalAutolink"), t.enter("literalAutolinkHttp"), i += String.fromCodePoint(u), t.consume(u), a) : r(u);
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
    return u === null || Bn(u) || ge(u) || Ht(u) || ri(u) ? r(u) : t.attempt($p, t.attempt(Bp, d), r)(u);
  }
  function d(u) {
    return t.exit("literalAutolinkHttp"), t.exit("literalAutolink"), e(u);
  }
}
function YA(t, e, r) {
  let n = 0;
  return i;
  function i(s) {
    return (s === 87 || s === 119) && n < 3 ? (n++, t.consume(s), i) : s === 46 && n === 3 ? (t.consume(s), o) : r(s);
  }
  function o(s) {
    return s === null ? r(s) : e(s);
  }
}
function JA(t, e, r) {
  let n, i, o;
  return s;
  function s(c) {
    return c === 46 || c === 95 ? t.check(Fp, l, a)(c) : c === null || ge(c) || Ht(c) || c !== 45 && ri(c) ? l(c) : (o = !0, t.consume(c), s);
  }
  function a(c) {
    return c === 95 ? n = !0 : (i = n, n = void 0), t.consume(c), s;
  }
  function l(c) {
    return i || n || !o ? r(c) : e(c);
  }
}
function XA(t, e) {
  let r = 0, n = 0;
  return i;
  function i(s) {
    return s === 40 ? (r++, t.consume(s), i) : s === 41 && n < r ? o(s) : s === 33 || s === 34 || s === 38 || s === 39 || s === 41 || s === 42 || s === 44 || s === 46 || s === 58 || s === 59 || s === 60 || s === 63 || s === 93 || s === 95 || s === 126 ? t.check(Fp, e, o)(s) : s === null || ge(s) || Ht(s) ? e(s) : (t.consume(s), i);
  }
  function o(s) {
    return s === 41 && n++, t.consume(s), i;
  }
}
function ZA(t, e, r) {
  return n;
  function n(a) {
    return a === 33 || a === 34 || a === 39 || a === 41 || a === 42 || a === 44 || a === 46 || a === 58 || a === 59 || a === 63 || a === 95 || a === 126 ? (t.consume(a), n) : a === 38 ? (t.consume(a), o) : a === 93 ? (t.consume(a), i) : (
      // `<` is an end.
      a === 60 || // So is whitespace.
      a === null || ge(a) || Ht(a) ? e(a) : r(a)
    );
  }
  function i(a) {
    return a === null || a === 40 || a === 91 || ge(a) || Ht(a) ? e(a) : n(a);
  }
  function o(a) {
    return Me(a) ? s(a) : r(a);
  }
  function s(a) {
    return a === 59 ? (t.consume(a), n) : Me(a) ? (t.consume(a), s) : r(a);
  }
}
function e3(t, e, r) {
  return n;
  function n(o) {
    return t.consume(o), i;
  }
  function i(o) {
    return Ee(o) ? r(o) : e(o);
  }
}
function Vp(t) {
  return t === null || t === 40 || t === 42 || t === 95 || t === 91 || t === 93 || t === 126 || ge(t);
}
function qp(t) {
  return !Me(t);
}
function Hp(t) {
  return !(t === 47 || mo(t));
}
function mo(t) {
  return t === 43 || t === 45 || t === 46 || t === 95 || Ee(t);
}
function _s(t) {
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
const t3 = {
  tokenize: c3,
  partial: !0
};
function r3() {
  return {
    document: {
      91: {
        name: "gfmFootnoteDefinition",
        tokenize: s3,
        continuation: {
          tokenize: a3
        },
        exit: l3
      }
    },
    text: {
      91: {
        name: "gfmFootnoteCall",
        tokenize: o3
      },
      93: {
        name: "gfmPotentialFootnoteCall",
        add: "after",
        tokenize: n3,
        resolveTo: i3
      }
    }
  };
}
function n3(t, e, r) {
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
    const c = tt(n.sliceSerialize({
      start: s.end,
      end: n.now()
    }));
    return c.codePointAt(0) !== 94 || !o.includes(c.slice(1)) ? r(l) : (t.enter("gfmFootnoteCallLabelMarker"), t.consume(l), t.exit("gfmFootnoteCallLabelMarker"), e(l));
  }
}
function i3(t, e) {
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
function o3(t, e, r) {
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
      return i.includes(tt(n.sliceSerialize(h))) ? (t.enter("gfmFootnoteCallLabelMarker"), t.consume(u), t.exit("gfmFootnoteCallLabelMarker"), t.exit("gfmFootnoteCall"), e) : r(u);
    }
    return ge(u) || (s = !0), o++, t.consume(u), u === 92 ? d : c;
  }
  function d(u) {
    return u === 91 || u === 92 || u === 93 ? (t.consume(u), o++, c) : c(u);
  }
}
function s3(t, e, r) {
  const n = this, i = n.parser.gfmFootnotes || (n.parser.gfmFootnotes = []);
  let o, s = 0, a;
  return l;
  function l(f) {
    return t.enter("gfmFootnoteDefinition")._container = !0, t.enter("gfmFootnoteDefinitionLabel"), t.enter("gfmFootnoteDefinitionLabelMarker"), t.consume(f), t.exit("gfmFootnoteDefinitionLabelMarker"), c;
  }
  function c(f) {
    return f === 94 ? (t.enter("gfmFootnoteDefinitionMarker"), t.consume(f), t.exit("gfmFootnoteDefinitionMarker"), t.enter("gfmFootnoteDefinitionLabelString"), t.enter("chunkString").contentType = "string", d) : r(f);
  }
  function d(f) {
    if (
      // Too long.
      s > 999 || // Closing brace with nothing.
      f === 93 && !a || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      f === null || f === 91 || ge(f)
    )
      return r(f);
    if (f === 93) {
      t.exit("chunkString");
      const g = t.exit("gfmFootnoteDefinitionLabelString");
      return o = tt(n.sliceSerialize(g)), t.enter("gfmFootnoteDefinitionLabelMarker"), t.consume(f), t.exit("gfmFootnoteDefinitionLabelMarker"), t.exit("gfmFootnoteDefinitionLabel"), h;
    }
    return ge(f) || (a = !0), s++, t.consume(f), f === 92 ? u : d;
  }
  function u(f) {
    return f === 91 || f === 92 || f === 93 ? (t.consume(f), s++, d) : d(f);
  }
  function h(f) {
    return f === 58 ? (t.enter("definitionMarker"), t.consume(f), t.exit("definitionMarker"), i.includes(o) || i.push(o), se(t, p, "gfmFootnoteDefinitionWhitespace")) : r(f);
  }
  function p(f) {
    return e(f);
  }
}
function a3(t, e, r) {
  return t.check(sn, e, t.attempt(t3, e, r));
}
function l3(t) {
  t.exit("gfmFootnoteDefinition");
}
function c3(t, e, r) {
  const n = this;
  return se(t, i, "gfmFootnoteDefinitionIndent", 4 + 1);
  function i(o) {
    const s = n.events[n.events.length - 1];
    return s && s[1].type === "gfmFootnoteDefinitionIndent" && s[2].sliceSerialize(s[1], !0).length === 4 ? e(o) : r(o);
  }
}
function u3(t) {
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
            p && Be(h, h.length, 0, ni(p, s.slice(c + 1, l), a)), Be(h, h.length, 0, [["exit", u, a], ["enter", s[l][1], a], ["exit", s[l][1], a], ["exit", d, a]]), Be(s, c - 1, l - c + 3, h), l = c + h.length - 2;
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
    function h(f) {
      return c === 126 && d[d.length - 1][1].type !== "characterEscape" ? l(f) : (s.enter("strikethroughSequenceTemporary"), p(f));
    }
    function p(f) {
      const g = br(c);
      if (f === 126)
        return u > 1 ? l(f) : (s.consume(f), u++, p);
      if (u < 2 && !r)
        return l(f);
      const v = s.exit("strikethroughSequenceTemporary"), b = br(f);
      return v._open = !b || b === 2 && !!g, v._close = !g || g === 2 && !!b, a(f);
    }
  }
}
class d3 {
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
    h3(this, e, r, n);
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
function h3(t, e, r, n) {
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
function p3(t, e) {
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
function f3() {
  return {
    flow: {
      null: {
        name: "table",
        tokenize: m3,
        resolveAll: g3
      }
    }
  };
}
function m3(t, e, r) {
  const n = this;
  let i = 0, o = 0, s;
  return a;
  function a(x) {
    let T = n.events.length - 1;
    for (; T > -1; ) {
      const O = n.events[T][1].type;
      if (O === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
      O === "linePrefix")
        T--;
      else
        break;
    }
    const D = T > -1 ? n.events[T][1].type : null, N = D === "tableHead" || D === "tableRow" ? y : l;
    return N === y && n.parser.lazy[n.now().line] ? r(x) : N(x);
  }
  function l(x) {
    return t.enter("tableHead"), t.enter("tableRow"), c(x);
  }
  function c(x) {
    return x === 124 || (s = !0, o += 1), d(x);
  }
  function d(x) {
    return x === null ? r(x) : Y(x) ? o > 1 ? (o = 0, n.interrupt = !0, t.exit("tableRow"), t.enter("lineEnding"), t.consume(x), t.exit("lineEnding"), p) : r(x) : ne(x) ? se(t, d, "whitespace")(x) : (o += 1, s && (s = !1, i += 1), x === 124 ? (t.enter("tableCellDivider"), t.consume(x), t.exit("tableCellDivider"), s = !0, d) : (t.enter("data"), u(x)));
  }
  function u(x) {
    return x === null || x === 124 || ge(x) ? (t.exit("data"), d(x)) : (t.consume(x), x === 92 ? h : u);
  }
  function h(x) {
    return x === 92 || x === 124 ? (t.consume(x), u) : u(x);
  }
  function p(x) {
    return n.interrupt = !1, n.parser.lazy[n.now().line] ? r(x) : (t.enter("tableDelimiterRow"), s = !1, ne(x) ? se(t, f, "linePrefix", n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(x) : f(x));
  }
  function f(x) {
    return x === 45 || x === 58 ? v(x) : x === 124 ? (s = !0, t.enter("tableCellDivider"), t.consume(x), t.exit("tableCellDivider"), g) : E(x);
  }
  function g(x) {
    return ne(x) ? se(t, v, "whitespace")(x) : v(x);
  }
  function v(x) {
    return x === 58 ? (o += 1, s = !0, t.enter("tableDelimiterMarker"), t.consume(x), t.exit("tableDelimiterMarker"), b) : x === 45 ? (o += 1, b(x)) : x === null || Y(x) ? I(x) : E(x);
  }
  function b(x) {
    return x === 45 ? (t.enter("tableDelimiterFiller"), _(x)) : E(x);
  }
  function _(x) {
    return x === 45 ? (t.consume(x), _) : x === 58 ? (s = !0, t.exit("tableDelimiterFiller"), t.enter("tableDelimiterMarker"), t.consume(x), t.exit("tableDelimiterMarker"), k) : (t.exit("tableDelimiterFiller"), k(x));
  }
  function k(x) {
    return ne(x) ? se(t, I, "whitespace")(x) : I(x);
  }
  function I(x) {
    return x === 124 ? f(x) : x === null || Y(x) ? !s || i !== o ? E(x) : (t.exit("tableDelimiterRow"), t.exit("tableHead"), e(x)) : E(x);
  }
  function E(x) {
    return r(x);
  }
  function y(x) {
    return t.enter("tableRow"), M(x);
  }
  function M(x) {
    return x === 124 ? (t.enter("tableCellDivider"), t.consume(x), t.exit("tableCellDivider"), M) : x === null || Y(x) ? (t.exit("tableRow"), e(x)) : ne(x) ? se(t, M, "whitespace")(x) : (t.enter("data"), R(x));
  }
  function R(x) {
    return x === null || x === 124 || ge(x) ? (t.exit("data"), M(x)) : (t.consume(x), x === 92 ? P : R);
  }
  function P(x) {
    return x === 92 || x === 124 ? (t.consume(x), R) : R(x);
  }
}
function g3(t, e) {
  let r = -1, n = !0, i = 0, o = [0, 0, 0, 0], s = [0, 0, 0, 0], a = !1, l = 0, c, d, u;
  const h = new d3();
  for (; ++r < t.length; ) {
    const p = t[r], f = p[1];
    p[0] === "enter" ? f.type === "tableHead" ? (a = !1, l !== 0 && (Kl(h, e, l, c, d), d = void 0, l = 0), c = {
      type: "table",
      start: Object.assign({}, f.start),
      // Note: correct end is set later.
      end: Object.assign({}, f.end)
    }, h.add(r, 0, [["enter", c, e]])) : f.type === "tableRow" || f.type === "tableDelimiterRow" ? (n = !0, u = void 0, o = [0, 0, 0, 0], s = [0, r + 1, 0, 0], a && (a = !1, d = {
      type: "tableBody",
      start: Object.assign({}, f.start),
      // Note: correct end is set later.
      end: Object.assign({}, f.end)
    }, h.add(r, 0, [["enter", d, e]])), i = f.type === "tableDelimiterRow" ? 2 : d ? 3 : 1) : i && (f.type === "data" || f.type === "tableDelimiterMarker" || f.type === "tableDelimiterFiller") ? (n = !1, s[2] === 0 && (o[1] !== 0 && (s[0] = s[1], u = kn(h, e, o, i, void 0, u), o = [0, 0, 0, 0]), s[2] = r)) : f.type === "tableCellDivider" && (n ? n = !1 : (o[1] !== 0 && (s[0] = s[1], u = kn(h, e, o, i, void 0, u)), o = s, s = [o[1], r, 0, 0])) : f.type === "tableHead" ? (a = !0, l = r) : f.type === "tableRow" || f.type === "tableDelimiterRow" ? (l = r, o[1] !== 0 ? (s[0] = s[1], u = kn(h, e, o, i, r, u)) : s[1] !== 0 && (u = kn(h, e, s, i, r, u)), i = 0) : i && (f.type === "data" || f.type === "tableDelimiterMarker" || f.type === "tableDelimiterFiller") && (s[3] = r);
  }
  for (l !== 0 && Kl(h, e, l, c, d), h.consume(e.events), r = -1; ++r < e.events.length; ) {
    const p = e.events[r];
    p[0] === "enter" && p[1].type === "table" && (p[1]._align = p3(e.events, r));
  }
  return t;
}
function kn(t, e, r, n, i, o) {
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
        const f = r[2] + 1, g = r[3] - r[2] - 1;
        t.add(f, g, []);
      }
    }
    t.add(r[3] + 1, 0, [["exit", u, e]]);
  }
  return i !== void 0 && (o.end = Object.assign({}, cr(e.events, i)), t.add(i, 0, [["exit", o, e]]), o = void 0), o;
}
function Kl(t, e, r, n, i) {
  const o = [], s = cr(e.events, r);
  i && (i.end = Object.assign({}, s), o.push(["exit", i, e])), n.end = Object.assign({}, s), o.push(["exit", n, e]), t.add(r + 1, 0, o);
}
function cr(t, e) {
  const r = t[e], n = r[0] === "enter" ? "start" : "end";
  return r[1][n];
}
const b3 = {
  name: "tasklistCheck",
  tokenize: w3
};
function v3() {
  return {
    text: {
      91: b3
    }
  };
}
function w3(t, e, r) {
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
      tokenize: y3
    }, e, r)(l) : r(l);
  }
}
function y3(t, e, r) {
  return se(t, n, "whitespace");
  function n(i) {
    return i === null ? r(i) : e(i);
  }
}
function x3(t) {
  return Zh([
    GA(),
    r3(),
    u3(t),
    f3(),
    v3()
  ]);
}
const k3 = {};
function _3(t) {
  const e = (
    /** @type {Processor<Root>} */
    this
  ), r = t || k3, n = e.data(), i = n.micromarkExtensions || (n.micromarkExtensions = []), o = n.fromMarkdownExtensions || (n.fromMarkdownExtensions = []), s = n.toMarkdownExtensions || (n.toMarkdownExtensions = []);
  i.push(x3(r)), o.push(jA()), s.push(VA(r));
}
const S3 = () => /* @__PURE__ */ m(
  fE,
  {
    remarkPlugins: [_3],
    className: "aui-md",
    components: I3,
    defer: !0
  }
), Gp = we(S3), C3 = ({ language: t, code: e }) => {
  const { isCopied: r, copyToClipboard: n } = T3();
  return /* @__PURE__ */ V("div", { className: "aui-code-header-root border-border/50 bg-muted/50 mt-3 flex items-center justify-between rounded-t-xl border border-b-0 px-3.5 py-1.5 text-xs", children: [
    /* @__PURE__ */ m("span", { className: "aui-code-header-language text-muted-foreground font-medium lowercase", children: t }),
    /* @__PURE__ */ V(er, { tooltip: "Copy", onClick: () => {
      !e || r || n(e);
    }, children: [
      !r && /* @__PURE__ */ m(gh, { className: "animate-in zoom-in-75 fade-in duration-150" }),
      r && /* @__PURE__ */ m(Xo, { className: "animate-in zoom-in-50 fade-in duration-200 ease-out" })
    ] })
  ] });
}, T3 = ({
  copiedDuration: t = 3e3
} = {}) => {
  const [e, r] = Ce(!1);
  return { isCopied: e, copyToClipboard: (i) => {
    !i || typeof navigator > "u" || !navigator.clipboard || navigator.clipboard.writeText(i).then(
      () => {
        r(!0), setTimeout(() => r(!1), t);
      },
      () => {
      }
    );
  } };
}, I3 = bS({
  h1: ({ className: t, ...e }) => /* @__PURE__ */ m("h1", { className: K("aui-md-h1 mt-5 mb-2 scroll-m-20 text-xl font-semibold first:mt-0 last:mb-0", t), ...e }),
  h2: ({ className: t, ...e }) => /* @__PURE__ */ m("h2", { className: K("aui-md-h2 mt-5 mb-2 scroll-m-20 text-lg font-semibold first:mt-0 last:mb-0", t), ...e }),
  h3: ({ className: t, ...e }) => /* @__PURE__ */ m("h3", { className: K("aui-md-h3 mt-4 mb-1.5 scroll-m-20 text-base font-semibold first:mt-0 last:mb-0", t), ...e }),
  h4: ({ className: t, ...e }) => /* @__PURE__ */ m("h4", { className: K("aui-md-h4 mt-3.5 mb-1 scroll-m-20 text-base font-medium first:mt-0 last:mb-0", t), ...e }),
  h5: ({ className: t, ...e }) => /* @__PURE__ */ m("h5", { className: K("aui-md-h5 mt-3 mb-1 text-sm font-semibold first:mt-0 last:mb-0", t), ...e }),
  h6: ({ className: t, ...e }) => /* @__PURE__ */ m("h6", { className: K("aui-md-h6 mt-3 mb-1 text-sm font-medium first:mt-0 last:mb-0", t), ...e }),
  p: ({ className: t, ...e }) => /* @__PURE__ */ m("p", { className: K("aui-md-p my-3 leading-relaxed first:mt-0 last:mb-0", t), ...e }),
  a: ({ className: t, ...e }) => /* @__PURE__ */ m("a", { className: K("aui-md-a text-primary hover:text-primary/80 underline underline-offset-2", t), ...e }),
  blockquote: ({ className: t, ...e }) => /* @__PURE__ */ m("blockquote", { className: K("aui-md-blockquote border-muted-foreground/30 text-muted-foreground my-3 border-s-2 ps-4", t), ...e }),
  ul: ({ className: t, ...e }) => /* @__PURE__ */ m("ul", { className: K("aui-md-ul marker:text-muted-foreground my-3 ms-5 list-disc [&>li]:mt-1", t), ...e }),
  ol: ({ className: t, ...e }) => /* @__PURE__ */ m("ol", { className: K("aui-md-ol marker:text-muted-foreground my-3 ms-5 list-decimal [&>li]:mt-1", t), ...e }),
  hr: ({ className: t, ...e }) => /* @__PURE__ */ m("hr", { className: K("aui-md-hr border-muted-foreground/20 my-3", t), ...e }),
  table: ({ className: t, ...e }) => /* @__PURE__ */ m("table", { className: K("aui-md-table my-3 w-full border-separate border-spacing-0 overflow-y-auto", t), ...e }),
  th: ({ className: t, ...e }) => /* @__PURE__ */ m("th", { className: K("aui-md-th bg-muted px-3 py-1.5 text-start font-medium first:rounded-ss-lg last:rounded-se-lg [[align=center]]:text-center [[align=right]]:text-right", t), ...e }),
  td: ({ className: t, ...e }) => /* @__PURE__ */ m("td", { className: K("aui-md-td border-muted-foreground/20 border-s border-b px-3 py-1.5 text-start last:border-e [[align=center]]:text-center [[align=right]]:text-right", t), ...e }),
  tr: ({ className: t, ...e }) => /* @__PURE__ */ m("tr", { className: K("aui-md-tr m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-es-lg [&:last-child>td:last-child]:rounded-ee-lg", t), ...e }),
  li: ({ className: t, ...e }) => /* @__PURE__ */ m("li", { className: K("aui-md-li leading-relaxed", t), ...e }),
  strong: ({ className: t, ...e }) => /* @__PURE__ */ m("strong", { className: K("aui-md-strong font-semibold", t), ...e }),
  sup: ({ className: t, ...e }) => /* @__PURE__ */ m("sup", { className: K("aui-md-sup [&>a]:text-xs [&>a]:no-underline", t), ...e }),
  pre: ({ className: t, ...e }) => /* @__PURE__ */ m("pre", { className: K("aui-md-pre border-border/50 bg-muted/30 overflow-x-auto rounded-t-none rounded-b-xl border border-t-0 p-3.5 text-[13px] leading-relaxed", t), ...e }),
  code: function({ className: e, ...r }) {
    const n = Oh();
    return /* @__PURE__ */ m(
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
  CodeHeader: C3
}), Ql = (t) => typeof t == "boolean" ? `${t}` : t === 0 ? "0" : t, Yl = wh, E3 = (t, e) => (r) => {
  var n;
  if ((e == null ? void 0 : e.variants) == null)
    return Yl(t, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
  const { variants: i, defaultVariants: o } = e, s = Object.keys(i).map((c) => {
    const d = r == null ? void 0 : r[c], u = o == null ? void 0 : o[c];
    if (d === null)
      return null;
    const h = Ql(d) || Ql(u);
    return i[c][h];
  }), a = r && Object.entries(r).reduce((c, d) => {
    let [u, h] = d;
    return h === void 0 || (c[u] = h), c;
  }, {}), l = e == null || (n = e.compoundVariants) === null || n === void 0 ? void 0 : n.reduce((c, d) => {
    let { class: u, className: h, ...p } = d;
    return Object.entries(p).every((f) => {
      let [g, v] = f;
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
  return Yl(t, s, l, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
}, A3 = window.UIComponents.Collapsible, R3 = window.UIComponents.CollapsibleContent, P3 = window.UIComponents.CollapsibleTrigger, M3 = 200, Ss = bo(!1), D3 = E3("aui-reasoning-root mb-4 w-full", {
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
function N3({
  className: t,
  variant: e,
  open: r,
  onOpenChange: n,
  defaultOpen: i = !1,
  streaming: o,
  children: s,
  ...a
}) {
  const l = $e(i), [c, d] = Ce(null), u = r !== void 0, h = u ? r : c ?? o ?? l.current, f = o === !0 && h && (u || c === null);
  return /* @__PURE__ */ m(
    A3,
    {
      "data-slot": "reasoning-root",
      "data-variant": e,
      open: h,
      onOpenChange: (v) => {
        u || d(v), n == null || n(v);
      },
      className: K("group/reasoning-root", D3({ variant: e, className: t })),
      style: { "--animation-duration": `${M3}ms` },
      ...a,
      children: /* @__PURE__ */ m(Ss.Provider, { value: f, children: s })
    }
  );
}
function Jl({
  side: t = "bottom",
  className: e,
  ...r
}) {
  return /* @__PURE__ */ m(
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
function z3({
  active: t,
  duration: e,
  className: r,
  ...n
}) {
  const i = e ? ` (${e}s)` : "";
  return /* @__PURE__ */ V(
    P3,
    {
      "data-slot": "reasoning-trigger",
      className: K(
        "aui-reasoning-trigger group/trigger text-muted-foreground hover:text-foreground flex max-w-[75%] origin-left items-center gap-2 py-1.5 text-sm transition-[color,scale] active:scale-[0.98]",
        r
      ),
      ...n,
      children: [
        /* @__PURE__ */ m(
          fh,
          {
            "data-slot": "reasoning-trigger-icon",
            className: "aui-reasoning-trigger-icon size-4 shrink-0"
          }
        ),
        /* @__PURE__ */ V(
          "span",
          {
            "data-slot": "reasoning-trigger-label",
            className: "aui-reasoning-trigger-label-wrapper relative inline-block leading-none tabular-nums",
            children: [
              /* @__PURE__ */ V("span", { children: [
                "Reasoning",
                i
              ] }),
              t ? /* @__PURE__ */ V(
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
        /* @__PURE__ */ m(
          Zo,
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
function O3({
  className: t,
  children: e,
  ...r
}) {
  const n = en(Ss);
  return /* @__PURE__ */ V(
    R3,
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
        /* @__PURE__ */ m(Jl, { side: "top" }),
        e,
        n ? /* @__PURE__ */ m(Jl, {}) : null
      ]
    }
  );
}
function L3({
  className: t,
  children: e,
  ...r
}) {
  const n = en(Ss), i = $e(null), o = $e(null);
  return It(() => {
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
  }, [n]), /* @__PURE__ */ m(
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
      children: /* @__PURE__ */ m("div", { ref: o, className: "aui-reasoning-text-content space-y-4", children: e })
    }
  );
}
const $3 = () => /* @__PURE__ */ m(Gp, {}), Wp = we($3);
Wp.displayName = "Reasoning";
const B3 = window.UIComponents.Collapsible, F3 = window.UIComponents.CollapsibleContent, U3 = window.UIComponents.CollapsibleTrigger, sr = window.UIComponents.Button, j3 = 200, ar = "active:scale-[0.98]";
function V3({
  className: t,
  open: e,
  onOpenChange: r,
  defaultOpen: n = !1,
  children: i,
  ...o
}) {
  const [s, a] = Ce(n), l = e !== void 0;
  return /* @__PURE__ */ m(
    B3,
    {
      "data-slot": "tool-fallback-root",
      open: l ? e : s,
      onOpenChange: (u) => {
        l || a(u), r == null || r(u);
      },
      className: K("aui-tool-fallback-root group/tool-fallback-root w-full", t),
      style: { "--animation-duration": `${j3}ms` },
      ...o,
      children: i
    }
  );
}
const q3 = {
  running: bh,
  complete: Xo,
  incomplete: Fk,
  "requires-action": mh
}, H3 = (t) => {
  if (t < 1e3)
    return "<1s";
  const e = t / 1e3;
  return e < 10 ? `${(Math.floor(e * 10) / 10).toFixed(1)}s` : e < 60 ? `${Math.floor(e)}s` : `${Math.floor(e / 60)}m ${Math.floor(e % 60)}s`;
};
function G3({
  className: t,
  ...e
}) {
  const r = wk();
  return r === void 0 ? null : /* @__PURE__ */ m(
    "span",
    {
      "data-slot": "tool-fallback-duration",
      className: K("aui-tool-fallback-duration text-muted-foreground text-xs tabular-nums", t),
      ...e,
      children: H3(r)
    }
  );
}
function W3({
  toolName: t,
  status: e,
  className: r,
  ...n
}) {
  const i = (e == null ? void 0 : e.type) ?? "complete", o = i === "running", s = (e == null ? void 0 : e.type) === "incomplete" && e.reason === "cancelled", a = q3[i], l = s ? "Cancelled tool" : "Used tool";
  return /* @__PURE__ */ V(
    U3,
    {
      "data-slot": "tool-fallback-trigger",
      className: K(
        "aui-tool-fallback-trigger group/trigger text-muted-foreground hover:text-foreground flex w-fit origin-left items-center gap-2 py-1.5 text-sm transition-[color,scale] active:scale-[0.98]",
        r
      ),
      ...n,
      children: [
        /* @__PURE__ */ m(
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
        /* @__PURE__ */ V(
          "span",
          {
            "data-slot": "tool-fallback-trigger-label",
            className: K(
              "aui-tool-fallback-trigger-label-wrapper relative inline-block text-start leading-none",
              s && "text-muted-foreground line-through"
            ),
            children: [
              /* @__PURE__ */ V("span", { children: [
                l,
                ": ",
                /* @__PURE__ */ m("b", { children: t })
              ] }),
              o && /* @__PURE__ */ V(
                "span",
                {
                  "aria-hidden": !0,
                  "data-slot": "tool-fallback-trigger-shimmer",
                  className: "aui-tool-fallback-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:animate-none",
                  children: [
                    l,
                    ": ",
                    /* @__PURE__ */ m("b", { children: t })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ m(G3, {}),
        /* @__PURE__ */ m(
          Zo,
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
function K3({
  className: t,
  children: e,
  ...r
}) {
  return /* @__PURE__ */ m(
    F3,
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
      children: /* @__PURE__ */ m(
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
function Q3({
  argsText: t,
  className: e,
  ...r
}) {
  return t ? /* @__PURE__ */ m("div", { "data-slot": "tool-fallback-args", className: K("aui-tool-fallback-args", e), ...r, children: /* @__PURE__ */ m("pre", { className: "aui-tool-fallback-args-value bg-muted/50 text-foreground/90 rounded-md p-2.5 text-xs whitespace-pre-wrap", children: t }) }) : null;
}
function Y3({
  result: t,
  className: e,
  ...r
}) {
  return t === void 0 ? null : /* @__PURE__ */ V("div", { "data-slot": "tool-fallback-result", className: K("aui-tool-fallback-result", e), ...r, children: [
    /* @__PURE__ */ m("p", { className: "aui-tool-fallback-result-header text-muted-foreground text-xs font-medium", children: "Result:" }),
    /* @__PURE__ */ m("pre", { className: "aui-tool-fallback-result-content bg-muted/50 text-foreground/90 mt-1 max-h-80 overflow-y-auto rounded-md p-2.5 text-xs whitespace-pre-wrap", children: typeof t == "string" ? t : JSON.stringify(t, null, 2) })
  ] });
}
function J3({
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
  return /* @__PURE__ */ V("div", { "data-slot": "tool-fallback-error", className: K("aui-tool-fallback-error", e), ...r, children: [
    /* @__PURE__ */ m("p", { className: "aui-tool-fallback-error-header text-muted-foreground font-semibold", children: s }),
    /* @__PURE__ */ m("p", { className: "aui-tool-fallback-error-reason text-muted-foreground", children: i })
  ] });
}
const X3 = "Approved by user", Z3 = "User denied tool execution", go = {
  "allow-once": "Allow",
  "allow-always": "Always allow",
  "reject-once": "Deny",
  "reject-always": "Always deny"
}, Xl = (t) => t === "allow-once" || t === "allow-always", Zl = (t) => t.label ?? (Object.hasOwn(go, t.kind) ? go[t.kind] : void 0) ?? t.id;
function eR({
  className: t,
  addResult: e,
  resume: r,
  interrupt: n,
  approval: i,
  respondToApproval: o,
  ...s
}) {
  const [a, l] = Ce(!1), [c, d] = Ce(null);
  if (i != null && (i.approved !== void 0 || i.resolution !== void 0))
    return null;
  const u = o ? i == null ? void 0 : i.options : void 0, h = u == null ? void 0 : u.filter(
    (b) => Object.hasOwn(go, b.kind)
  ), p = (b) => {
    a || (i != null && i.approved === void 0 && o ? o({ approved: b }) : n ? r == null || r({ approved: b }) : e == null || e(b ? X3 : Z3), l(!0));
  }, f = (b) => {
    a || (o == null || o({ optionId: b.id }), l(!0), d(null));
  }, g = (b) => {
    b.confirm ? d(b.id) : f(b);
  }, v = c != null ? h == null ? void 0 : h.find((b) => b.id === c) : void 0;
  if (v) {
    const b = typeof v.confirm == "object" ? v.confirm : void 0, _ = (b == null ? void 0 : b.description) ?? v.description;
    return /* @__PURE__ */ V(
      "div",
      {
        "data-slot": "tool-fallback-approval-confirm",
        className: K("aui-tool-fallback-approval-confirm flex flex-col gap-2 pt-1", t),
        ...s,
        children: [
          /* @__PURE__ */ m("p", { className: "aui-tool-fallback-approval-confirm-title font-semibold", children: (b == null ? void 0 : b.title) ?? `${Zl(v)}?` }),
          _ && /* @__PURE__ */ m("p", { className: "aui-tool-fallback-approval-confirm-description text-muted-foreground", children: _ }),
          v.grants && v.grants.length > 0 && /* @__PURE__ */ m("ul", { className: "aui-tool-fallback-approval-confirm-grants flex flex-col gap-1", children: v.grants.map((k) => /* @__PURE__ */ m("li", { children: /* @__PURE__ */ m("code", { className: "aui-tool-fallback-approval-confirm-grant bg-muted rounded px-1.5 py-0.5 text-xs", children: k }) }, k)) }),
          /* @__PURE__ */ V("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ m(sr, { size: "sm", className: ar, onClick: () => f(v), disabled: a, children: "Confirm" }),
            /* @__PURE__ */ m(sr, { size: "sm", variant: "outline", className: ar, onClick: () => d(null), disabled: a, children: "Back" })
          ] })
        ]
      }
    );
  }
  if (u && u.length > 0) {
    const b = (h == null ? void 0 : h.filter((k) => Xl(k.kind))) ?? [], _ = (h == null ? void 0 : h.filter((k) => !Xl(k.kind))) ?? [];
    return /* @__PURE__ */ V(
      "div",
      {
        "data-slot": "tool-fallback-approval",
        className: K("aui-tool-fallback-approval flex flex-wrap items-center gap-2 pt-1", t),
        ...s,
        children: [
          [...b, ..._].map((k) => /* @__PURE__ */ m(
            sr,
            {
              size: "sm",
              variant: k === b[0] ? "default" : "outline",
              className: ar,
              onClick: () => g(k),
              disabled: a,
              children: Zl(k)
            },
            k.id
          )),
          _.length === 0 && /* @__PURE__ */ m(sr, { size: "sm", variant: "outline", className: ar, onClick: () => p(!1), disabled: a, children: "Deny" })
        ]
      }
    );
  }
  return /* @__PURE__ */ V(
    "div",
    {
      "data-slot": "tool-fallback-approval",
      className: K("aui-tool-fallback-approval flex items-center gap-2 pt-1", t),
      ...s,
      children: [
        /* @__PURE__ */ m(sr, { size: "sm", className: ar, onClick: () => p(!0), disabled: a, children: "Allow" }),
        /* @__PURE__ */ m(sr, { size: "sm", variant: "outline", className: ar, onClick: () => p(!1), disabled: a, children: "Deny" })
      ]
    }
  );
}
const tR = ({
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
  const c = (n == null ? void 0 : n.type) === "incomplete" && n.reason === "cancelled", d = (n == null ? void 0 : n.type) === "requires-action", [u, h] = Ce(d), [p, f] = Ce(d);
  return d !== p && (f(d), d && h(!0)), /* @__PURE__ */ V(V3, { open: u, onOpenChange: h, children: [
    /* @__PURE__ */ m(W3, { toolName: t, status: n }),
    /* @__PURE__ */ V(K3, { children: [
      /* @__PURE__ */ m(J3, { status: n }),
      /* @__PURE__ */ m(Q3, { argsText: e, className: K(c && "opacity-60") }),
      d && /* @__PURE__ */ m(
        eR,
        {
          addResult: i,
          resume: o,
          interrupt: s,
          approval: a,
          respondToApproval: l
        }
      ),
      !c && /* @__PURE__ */ m(Y3, { result: r })
    ] })
  ] });
}, Kp = we(tR);
Kp.displayName = "ToolFallback";
const rR = window.UIComponents.Collapsible, nR = window.UIComponents.CollapsibleContent, iR = window.UIComponents.CollapsibleTrigger, oR = 200;
function sR({
  className: t,
  defaultOpen: e = !1,
  requiresAction: r = !1,
  children: n,
  ...i
}) {
  const [o, s] = Ce(e), [a, l] = Ce(r);
  return r !== a && (l(r), r && s(!0)), /* @__PURE__ */ m(
    rR,
    {
      "data-slot": "thought-group-root",
      open: o,
      onOpenChange: s,
      className: K("aui-thought-group-root group/thought-group-root w-full", t),
      style: { "--animation-duration": `${oR}ms` },
      ...i,
      children: n
    }
  );
}
function aR({
  active: t = !1,
  className: e,
  ...r
}) {
  const n = t ? "Thinking…" : "Thought process";
  return /* @__PURE__ */ V(
    iR,
    {
      "data-slot": "thought-group-trigger",
      className: K(
        "aui-thought-group-trigger group/trigger text-muted-foreground hover:text-foreground flex w-fit origin-left items-center gap-2 py-1.5 text-sm transition-[color,scale] active:scale-[0.98]",
        e
      ),
      ...r,
      children: [
        t ? /* @__PURE__ */ m(
          bh,
          {
            "data-slot": "thought-group-trigger-loader",
            className: "aui-thought-group-trigger-loader size-4 shrink-0 animate-spin [animation-duration:0.6s]"
          }
        ) : /* @__PURE__ */ m(
          fh,
          {
            "data-slot": "thought-group-trigger-icon",
            className: "aui-thought-group-trigger-icon size-4 shrink-0"
          }
        ),
        /* @__PURE__ */ V(
          "span",
          {
            "data-slot": "thought-group-trigger-label",
            className: "aui-thought-group-trigger-label-wrapper relative inline-block text-start text-xs leading-none",
            children: [
              /* @__PURE__ */ m("span", { children: n }),
              t && /* @__PURE__ */ m(
                "span",
                {
                  "aria-hidden": !0,
                  "data-slot": "thought-group-trigger-shimmer",
                  className: "aui-thought-group-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:animate-none",
                  children: n
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ m(
          Zo,
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
function lR({
  className: t,
  children: e,
  ...r
}) {
  return /* @__PURE__ */ m(
    nR,
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
      ...r,
      children: /* @__PURE__ */ m(
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
const Qp = window.UIComponents.Button, cR = [
  "What MCP tools are available?",
  "Show the 5 most recent orders",
  "Summarize today’s orders"
], $i = (t) => t.thread.messages.length === 0 && (!t.thread.isLoading || t.threads.isLoading), uR = ({ onNewChat: t, onCompact: e }) => {
  const r = $($i);
  return /* @__PURE__ */ m(
    ur.Root,
    {
      className: "aui-root aui-thread-root bg-background flex h-full flex-col",
      style: {
        "--thread-max-width": "44rem",
        "--composer-bg": "color-mix(in oklab, var(--color-muted) 30%, var(--color-background))",
        "--composer-radius": "1.5rem"
      },
      children: /* @__PURE__ */ m(
        ur.Viewport,
        {
          turnAnchor: "top",
          "data-slot": "aui_thread-viewport",
          className: "relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth",
          children: /* @__PURE__ */ V(
            "div",
            {
              className: K(
                "mx-auto flex w-full max-w-(--thread-max-width) flex-1 flex-col px-4 pt-4",
                r && "justify-center"
              ),
              children: [
                /* @__PURE__ */ m(jt, { condition: $i, children: /* @__PURE__ */ m(hR, {}) }),
                /* @__PURE__ */ m(
                  "div",
                  {
                    "data-slot": "aui_message-group",
                    className: "mb-14 flex flex-col gap-y-6 empty:hidden",
                    children: /* @__PURE__ */ m(ur.Messages, { components: { UserMessage: yR, AssistantMessage: vR } })
                  }
                ),
                /* @__PURE__ */ V(
                  ur.ViewportFooter,
                  {
                    className: K(
                      "aui-thread-viewport-footer bg-background flex flex-col gap-4 overflow-visible pb-4 md:pb-6",
                      !r && "sticky bottom-0 mt-auto rounded-t-(--composer-radius)"
                    ),
                    children: [
                      /* @__PURE__ */ m(dR, {}),
                      /* @__PURE__ */ m(mR, { onNewChat: t, onCompact: e }),
                      /* @__PURE__ */ m(jt, { condition: (n) => $i(n) && n.composer.isEmpty, children: /* @__PURE__ */ m(pR, {}) })
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
}, dR = () => /* @__PURE__ */ m(ur.ScrollToBottom, { asChild: !0, children: /* @__PURE__ */ m(
  er,
  {
    tooltip: "Scroll to bottom",
    variant: "outline",
    className: "aui-thread-scroll-to-bottom dark:border-border dark:bg-background dark:hover:bg-accent absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible",
    children: /* @__PURE__ */ m(Pk, {})
  }
) }), hR = () => /* @__PURE__ */ V("div", { className: "aui-thread-welcome-root mb-6 flex flex-col items-center px-4 text-center", children: [
  /* @__PURE__ */ m(ph, { className: "text-muted-foreground mb-3 size-10" }),
  /* @__PURE__ */ m("h1", { className: "aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in fill-mode-both text-2xl font-semibold duration-200", children: "How can I help you today?" }),
  /* @__PURE__ */ m("p", { className: "text-muted-foreground mt-1 text-sm", children: "Ask about Restoapp data available to your account." })
] }), pR = () => /* @__PURE__ */ m("div", { className: "aui-thread-welcome-suggestions flex w-full flex-wrap items-center justify-center gap-2 px-4", children: cR.map((t) => /* @__PURE__ */ m(ur.Suggestion, { prompt: t, send: !0, asChild: !0, children: /* @__PURE__ */ m(
  Qp,
  {
    variant: "ghost",
    className: "aui-thread-welcome-suggestion text-foreground hover:bg-muted border-border/60 h-auto gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-normal whitespace-nowrap transition-colors",
    children: t
  }
) }, t)) }), fR = "What can you do? List the data models, admin pages and tools available to me.", mR = ({
  onNewChat: t,
  onCompact: e
}) => {
  const r = u0(), n = kk({
    commands: [
      {
        id: "new",
        label: "/new",
        description: "Start a new chat (clears the conversation)",
        execute: () => t == null ? void 0 : t()
      },
      {
        id: "compact",
        label: "/compact",
        description: "Free up context: prune or summarize older messages",
        execute: () => e == null ? void 0 : e()
      },
      {
        id: "model",
        label: "/model",
        description: "Open the model selector",
        execute: () => {
          var i;
          (i = document.querySelector('select[aria-label="Select model"]')) == null || i.focus();
        }
      },
      {
        id: "help",
        label: "/help",
        description: "Ask the assistant what it can do",
        // Deferred so the popover's own composer cleanup runs first and does
        // not clobber the injected prompt.
        execute: () => {
          setTimeout(() => {
            r.setText(fR), r.send();
          }, 0);
        }
      }
    ],
    removeOnExecute: !0
  });
  return /* @__PURE__ */ m(Fe.Unstable_TriggerPopoverRoot, { children: /* @__PURE__ */ V(Fe.Root, { className: "aui-composer-root relative flex w-full flex-col", children: [
    /* @__PURE__ */ V(
      Fe.Unstable_TriggerPopover,
      {
        char: "/",
        adapter: n.adapter,
        className: "aui-composer-slash-popover border-border/60 bg-popover text-popover-foreground absolute inset-x-2 bottom-full z-20 mb-2 flex flex-col gap-0.5 overflow-hidden rounded-xl border p-1 shadow-lg",
        children: [
          /* @__PURE__ */ m(Fe.Unstable_TriggerPopover.Action, { ...n.action }),
          /* @__PURE__ */ m(Fe.Unstable_TriggerPopoverItems, { children: (i) => i.length === 0 ? /* @__PURE__ */ m("div", { className: "text-muted-foreground px-2.5 py-1.5 text-xs", children: "No matching commands" }) : i.map((o, s) => /* @__PURE__ */ V(
            Fe.Unstable_TriggerPopoverItem,
            {
              item: o,
              index: s,
              className: "data-[highlighted]:bg-accent hover:bg-accent flex w-full cursor-pointer items-baseline gap-2 rounded-lg px-2.5 py-1.5 text-start text-sm",
              children: [
                /* @__PURE__ */ m("span", { className: "font-medium", children: o.label }),
                o.description && /* @__PURE__ */ m("span", { className: "text-muted-foreground text-xs", children: o.description })
              ]
            },
            o.id
          )) })
        ]
      }
    ),
    /* @__PURE__ */ m(Fe.AttachmentDropzone, { asChild: !0, children: /* @__PURE__ */ V(
      "div",
      {
        "data-slot": "aui_composer-shell",
        className: "border-border/60 data-[dragging=true]:border-ring focus-within:border-border dark:border-muted-foreground/15 dark:focus-within:border-muted-foreground/30 flex w-full flex-col gap-2 rounded-(--composer-radius) border bg-(--composer-bg) p-2 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] focus-within:shadow-[0_6px_24px_-8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.05)] data-[dragging=true]:border-dashed dark:shadow-none",
        children: [
          /* @__PURE__ */ m(pS, {}),
          /* @__PURE__ */ m(
            Fe.Input,
            {
              placeholder: "Ask about Restoapp data… type / for commands",
              className: "aui-composer-input caret-primary placeholder:text-muted-foreground/80 max-h-32 min-h-10 w-full resize-none bg-transparent px-2.5 py-1 text-base outline-none",
              rows: 1,
              autoFocus: !0,
              addAttachmentOnPaste: !0,
              enterKeyHint: "send",
              "aria-label": "Message input"
            }
          ),
          /* @__PURE__ */ m(gR, {})
        ]
      }
    ) })
  ] }) });
}, gR = () => /* @__PURE__ */ V("div", { className: "aui-composer-action-wrapper relative flex items-center justify-between", children: [
  /* @__PURE__ */ m(fS, {}),
  /* @__PURE__ */ V("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ m(jt, { condition: (t) => !t.thread.isRunning, children: /* @__PURE__ */ m(Fe.Send, { asChild: !0, children: /* @__PURE__ */ m(
      er,
      {
        tooltip: "Send message",
        side: "bottom",
        type: "button",
        variant: "default",
        size: "icon",
        className: "aui-composer-send size-7 rounded-full",
        "aria-label": "Send message",
        children: /* @__PURE__ */ m(Dk, { className: "aui-composer-send-icon size-4.5" })
      }
    ) }) }),
    /* @__PURE__ */ m(jt, { condition: (t) => t.thread.isRunning, children: /* @__PURE__ */ m(Fe.Cancel, { asChild: !0, children: /* @__PURE__ */ m(
      Qp,
      {
        type: "button",
        variant: "default",
        size: "icon",
        className: "aui-composer-cancel size-7 rounded-full",
        "aria-label": "Stop generating",
        children: /* @__PURE__ */ m(Xk, { className: "aui-composer-cancel-icon size-3.5 fill-current" })
      }
    ) }) })
  ] })
] }), bR = () => /* @__PURE__ */ m(gr.Error, { children: /* @__PURE__ */ m(ja.Root, { className: "aui-message-error-root border-destructive bg-destructive/10 text-destructive dark:bg-destructive/5 mt-2 rounded-md border p-3 text-sm dark:text-red-200", children: /* @__PURE__ */ m(ja.Message, { className: "aui-message-error-message" }) }) }), vR = () => /* @__PURE__ */ V(
  gr.Root,
  {
    "data-slot": "aui_assistant-message-root",
    "data-role": "assistant",
    className: "fade-in slide-in-from-bottom-1 animate-in relative -mb-7.5 pb-7.5 duration-150",
    children: [
      /* @__PURE__ */ V(
        "div",
        {
          "data-slot": "aui_assistant-message-content",
          className: "text-foreground px-2 leading-relaxed wrap-break-word",
          children: [
            /* @__PURE__ */ m(
              gr.GroupedParts,
              {
                groupBy: ry({
                  reasoning: ["group-thought", "group-reasoning"],
                  "tool-call": ["group-thought"],
                  "standalone-tool-call": []
                }),
                children: ({ part: t, children: e }) => {
                  switch (t.type) {
                    case "group-thought":
                      return /* @__PURE__ */ V(
                        sR,
                        {
                          requiresAction: t.status.type === "requires-action",
                          children: [
                            /* @__PURE__ */ m(aR, { active: t.status.type === "running" }),
                            /* @__PURE__ */ m(lR, { children: e })
                          ]
                        }
                      );
                    case "group-reasoning": {
                      const r = t.status.type === "running";
                      return /* @__PURE__ */ V(N3, { variant: "ghost", streaming: r, children: [
                        /* @__PURE__ */ m(z3, { active: r }),
                        /* @__PURE__ */ m(O3, { "aria-busy": r, children: /* @__PURE__ */ m(L3, { children: e }) })
                      ] });
                    }
                    case "text":
                      return /* @__PURE__ */ m(Gp, {});
                    case "reasoning":
                      return /* @__PURE__ */ m(Wp, { ...t });
                    case "tool-call":
                      return t.toolUI ?? /* @__PURE__ */ m(Kp, { ...t });
                    case "indicator":
                      return /* @__PURE__ */ m(
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
            /* @__PURE__ */ m(bR, {})
          ]
        }
      ),
      /* @__PURE__ */ m(
        "div",
        {
          "data-slot": "aui_assistant-message-footer",
          className: "ms-2 flex min-h-7.5 items-center pt-1.5",
          children: /* @__PURE__ */ m(wR, {})
        }
      )
    ]
  }
), wR = () => /* @__PURE__ */ m(
  Ra.Root,
  {
    hideWhenRunning: !0,
    autohide: "not-last",
    className: "aui-assistant-action-bar-root text-muted-foreground animate-in fade-in -ms-1 flex gap-1 duration-200",
    children: /* @__PURE__ */ m(Ra.Copy, { asChild: !0, children: /* @__PURE__ */ V(er, { tooltip: "Copy", children: [
      /* @__PURE__ */ m(jt, { condition: (t) => t.message.isCopied, children: /* @__PURE__ */ m(Xo, { className: "animate-in zoom-in-50 fade-in duration-200 ease-out" }) }),
      /* @__PURE__ */ m(jt, { condition: (t) => !t.message.isCopied, children: /* @__PURE__ */ m(gh, { className: "animate-in zoom-in-75 fade-in duration-150" }) })
    ] }) })
  }
), yR = () => /* @__PURE__ */ V(
  gr.Root,
  {
    "data-slot": "aui_user-message-root",
    className: "fade-in slide-in-from-bottom-1 animate-in grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 duration-150 [&>*]:col-start-2",
    "data-role": "user",
    children: [
      /* @__PURE__ */ m(hS, {}),
      /* @__PURE__ */ m("div", { className: "aui-user-message-content-wrapper relative col-start-2 min-w-0", children: /* @__PURE__ */ m("div", { className: "aui-user-message-content bg-muted text-foreground rounded-xl px-4 py-2 wrap-break-word whitespace-pre-wrap empty:hidden", children: /* @__PURE__ */ m(gr.Parts, {}) }) })
    ]
  }
);
function Sr() {
  return (window.location.pathname || "").replace(/\/openharness-agent$/, "");
}
function xR() {
  for (const t of document.cookie.split(";")) {
    const [e, ...r] = t.trim().split("=");
    if (e === "XSRF-TOKEN")
      return decodeURIComponent(r.join("=") || "");
  }
  return null;
}
function ai() {
  const t = xR();
  return t ? { "X-XSRF-TOKEN": t } : {};
}
async function Cr(t) {
  try {
    const e = await t.json();
    return e.error || e.message || `HTTP ${t.status}`;
  } catch {
    return `HTTP ${t.status}`;
  }
}
async function kR() {
  const t = await fetch(`${Sr()}/api/openharness/meta`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" }
  });
  if (!t.ok)
    throw new Error(await Cr(t));
  return t.json();
}
async function _R() {
  const t = await fetch(`${Sr()}/api/openharness/session`, {
    method: "DELETE",
    credentials: "same-origin",
    headers: { Accept: "application/json", ...ai() }
  });
  if (!t.ok)
    throw new Error(await Cr(t));
}
async function SR(t) {
  const e = await fetch(`${Sr()}/api/openharness/model`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...ai()
    },
    body: JSON.stringify({ model: t })
  });
  if (!e.ok)
    throw new Error(await Cr(e));
  return e.json();
}
async function CR() {
  const t = await fetch(`${Sr()}/api/openharness/history`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" }
  });
  if (!t.ok)
    throw new Error(await Cr(t));
  const e = await t.json();
  return Array.isArray(e == null ? void 0 : e.messages) ? e.messages : [];
}
async function TR() {
  const t = await fetch(`${Sr()}/api/openharness/compact`, {
    method: "POST",
    credentials: "same-origin",
    headers: { Accept: "application/json", ...ai() }
  });
  if (!t.ok)
    throw new Error(await Cr(t));
  return t.json();
}
function IR(t) {
  if (typeof t == "string")
    return [{ type: "text", text: t }];
  const e = [];
  for (const r of t ?? [])
    if ((r == null ? void 0 : r.type) === "text") {
      const n = /^<attachment name=("(?:[^"\\]|\\.)*")/.exec(r.text ?? "");
      if (n) {
        let i = "file";
        try {
          i = JSON.parse(n[1]);
        } catch {
        }
        e.push({ type: "text", text: `📎 ${i}` });
      } else
        e.push({ type: "text", text: r.text ?? "" });
    } else
      (r == null ? void 0 : r.type) === "image" && typeof r.image == "string" && e.push({ type: "image", image: r.image });
  return e.length ? e : [{ type: "text", text: "" }];
}
function ER(t) {
  const e = [], r = /* @__PURE__ */ new Map();
  let n = null;
  const i = () => {
    n != null && n.length && e.push({ role: "assistant", content: n }), n = null;
  };
  for (const o of t ?? [])
    if ((o == null ? void 0 : o.role) === "user")
      i(), e.push({ role: "user", content: IR(o.content) });
    else if ((o == null ? void 0 : o.role) === "assistant") {
      n || (n = []);
      const s = typeof o.content == "string" ? [{ type: "text", text: o.content }] : o.content ?? [];
      for (const a of s)
        if ((a == null ? void 0 : a.type) === "text" && a.text)
          n.push({ type: "text", text: a.text });
        else if ((a == null ? void 0 : a.type) === "reasoning" && a.text)
          n.push({ type: "reasoning", text: a.text });
        else if ((a == null ? void 0 : a.type) === "tool-call") {
          const l = {
            type: "tool-call",
            toolCallId: a.toolCallId,
            toolName: a.toolName,
            args: a.input ?? a.args ?? {}
          };
          r.set(a.toolCallId, l), n.push(l);
        }
    } else if ((o == null ? void 0 : o.role) === "tool")
      for (const s of o.content ?? []) {
        if ((s == null ? void 0 : s.type) !== "tool-result")
          continue;
        const a = r.get(s.toolCallId);
        if (!a)
          continue;
        const l = s.output ?? s.result;
        a.result = l && typeof l == "object" && "type" in l && "value" in l ? l.value : l;
      }
  return i(), e;
}
async function* AR(t, e) {
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
function RR({ onUsage: t, onRunEnd: e }) {
  return {
    async *run({ messages: r, abortSignal: n }) {
      const i = r[r.length - 1];
      if (!i || i.role !== "user")
        throw new Error("Nothing to send.");
      const o = i.content.filter((f) => f.type === "text").map((f) => f.text).join(`

`), s = new FormData();
      s.append("message", o);
      for (const f of i.attachments ?? []) {
        const g = f.file;
        g && s.append("files", g, f.name);
      }
      const a = await fetch(`${Sr()}/api/openharness/runs`, {
        method: "POST",
        body: s,
        credentials: "same-origin",
        headers: { Accept: "application/json", ...ai() },
        signal: n
      });
      if (!a.ok)
        throw new Error(await Cr(a));
      const { stream: l } = await a.json(), c = [], d = /* @__PURE__ */ new Map();
      let u = null, h = null;
      const p = () => ({ content: c.map((f) => ({ ...f })) });
      try {
        for await (const f of AR(l, n))
          switch (f.type) {
            case "text.delta": {
              u || (u = { type: "text", text: "" }, c.push(u), h = null), u.text += f.text ?? "", yield p();
              break;
            }
            case "text.done":
              u = null;
              break;
            case "reasoning.delta": {
              h || (h = { type: "reasoning", text: "" }, c.push(h), u = null), h.text += f.text ?? "", yield p();
              break;
            }
            case "reasoning.done":
              h = null;
              break;
            case "tool.start": {
              const g = {
                type: "tool-call",
                toolCallId: f.toolCallId,
                toolName: f.toolName,
                args: f.input ?? {},
                argsText: JSON.stringify(f.input ?? {}, null, 2)
              };
              d.set(f.toolCallId, g), c.push(g), u = null, h = null, yield p();
              break;
            }
            case "tool.done": {
              const g = d.get(f.toolCallId);
              g && (g.result = f.output, yield p());
              break;
            }
            case "tool.error": {
              const g = d.get(f.toolCallId);
              g && (g.result = f.error ?? "Tool call failed", g.isError = !0, yield p());
              break;
            }
            case "step.done":
            case "turn.done": {
              f.usage && (t == null || t(f.usage));
              break;
            }
            case "error":
              throw new Error(typeof f.error == "string" ? f.error : "Agent run failed");
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
function PR(t) {
  return new Promise((e, r) => {
    const n = new FileReader();
    n.onload = () => e(n.result), n.onerror = () => r(n.error ?? new Error("Failed to read file")), n.readAsDataURL(t);
  });
}
class MR {
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
    const r = e.type === "image" ? [{ type: "image", image: await PR(e.file) }] : [];
    return { ...e, status: { type: "complete" }, content: r };
  }
  async remove() {
  }
}
const DR = `/*! tailwindcss v4.3.2 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-pan-x:initial;--tw-pan-y:initial;--tw-pinch-zoom:initial;--tw-space-y-reverse:0;--tw-space-x-reverse:0;--tw-divide-x-reverse:0;--tw-border-style:solid;--tw-divide-y-reverse:0;--tw-leading:initial;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-ease:initial;--tw-animation-delay:0s;--tw-animation-direction:normal;--tw-animation-duration:initial;--tw-animation-fill-mode:none;--tw-animation-iteration-count:1;--tw-enter-blur:0;--tw-enter-opacity:1;--tw-enter-rotate:0;--tw-enter-scale:1;--tw-enter-translate-x:0;--tw-enter-translate-y:0;--tw-exit-blur:0;--tw-exit-opacity:1;--tw-exit-rotate:0;--tw-exit-scale:1;--tw-exit-translate-x:0;--tw-exit-translate-y:0}}}@layer theme{:root,:host{--font-sans:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;--color-red-200:oklch(88.5% .062 18.334);--color-red-500:oklch(63.7% .237 25.331);--color-red-600:oklch(57.7% .245 27.325);--color-orange-500:oklch(70.5% .213 47.604);--color-amber-400:oklch(82.8% .189 84.429);--color-amber-500:oklch(76.9% .188 70.08);--color-amber-600:oklch(66.6% .179 58.318);--color-green-100:oklch(96.2% .044 156.743);--color-green-200:oklch(92.5% .084 155.995);--color-green-400:oklch(79.2% .209 151.711);--color-green-500:oklch(72.3% .219 149.579);--color-green-600:oklch(62.7% .194 149.214);--color-green-700:oklch(52.7% .154 150.069);--color-emerald-400:oklch(76.5% .177 163.223);--color-emerald-600:oklch(59.6% .145 163.225);--color-blue-100:oklch(93.2% .032 255.585);--color-blue-500:oklch(62.3% .214 259.815);--color-blue-600:oklch(54.6% .245 262.881);--color-blue-700:oklch(48.8% .243 264.376);--color-blue-800:oklch(42.4% .199 265.638);--color-blue-950:oklch(28.2% .091 267.935);--color-indigo-500:oklch(58.5% .233 277.117);--color-indigo-600:oklch(51.1% .262 276.966);--color-gray-50:oklch(98.5% .002 247.839);--color-gray-100:oklch(96.7% .003 264.542);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-300:oklch(87.2% .01 258.338);--color-gray-400:oklch(70.7% .022 261.325);--color-gray-500:oklch(55.1% .027 264.364);--color-gray-600:oklch(44.6% .03 256.802);--color-gray-700:oklch(37.3% .034 259.733);--color-gray-800:oklch(27.8% .033 256.848);--color-gray-900:oklch(21% .034 264.665);--color-black:#000;--color-white:#fff;--spacing:.25rem;--breakpoint-md:48rem;--container-xs:20rem;--container-sm:24rem;--container-md:28rem;--container-2xl:42rem;--container-3xl:48rem;--container-4xl:56rem;--container-5xl:64rem;--container-6xl:72rem;--container-7xl:80rem;--text-xs:.75rem;--text-xs--line-height:calc(1 / .75);--text-sm:.875rem;--text-sm--line-height:calc(1.25 / .875);--text-base:1rem;--text-base--line-height:1.5;--text-lg:1.125rem;--text-lg--line-height:calc(1.75 / 1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75 / 1.25);--text-2xl:1.5rem;--text-2xl--line-height:calc(2 / 1.5);--text-3xl:1.875rem;--text-3xl--line-height:1.2;--text-4xl:2.25rem;--text-4xl--line-height:calc(2.5 / 2.25);--font-weight-light:300;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--tracking-tight:-.025em;--tracking-normal:0em;--tracking-wide:.025em;--leading-tight:1.25;--leading-snug:1.375;--leading-normal:1.5;--leading-relaxed:1.625;--radius-xs:.125rem;--radius-xl:calc(var(--radius) + 4px);--radius-2xl:1rem;--shadow-xs:0 1px 2px 0 #0000000d;--ease-in:cubic-bezier(.4, 0, 1, 1);--ease-out:cubic-bezier(0, 0, .2, 1);--ease-in-out:cubic-bezier(.4, 0, .2, 1);--animate-spin:spin 1s linear infinite;--animate-pulse:pulse 2s cubic-bezier(.4, 0, .6, 1) infinite;--blur-xs:4px;--aspect-video:16 / 9;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4, 0, .2, 1);--color-background:var(--background);--color-muted:var(--muted);--color-border:var(--border)}}.\\@container{container-type:inline-size}.pointer-events-auto{pointer-events:auto}.pointer-events-none{pointer-events:none}.collapse{visibility:collapse}.invisible{visibility:hidden}.visible{visibility:visible}.sr-only{clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.not-sr-only{clip-path:none;white-space:normal;width:auto;height:auto;margin:0;padding:0;position:static;overflow:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.sticky{position:sticky}.inset-0{top:0;right:0;bottom:0;left:0}.inset-x-0{inset-inline:0}.inset-x-2{inset-inline:calc(var(--spacing) * 2)}.inset-y-0{inset-block:0}.end-1{inset-inline-end:calc(var(--spacing) * 1)}.end-1\\.5{inset-inline-end:calc(var(--spacing) * 1.5)}.-top-1{top:calc(var(--spacing) * -1)}.-top-2{top:calc(var(--spacing) * -2)}.-top-12{top:calc(var(--spacing) * -12)}.top-0{top:0}.top-1{top:var(--spacing)}.top-1\\.5{top:calc(var(--spacing) * 1.5)}.top-1\\/2{top:50%}.top-2{top:calc(var(--spacing) * 2)}.top-4{top:calc(var(--spacing) * 4)}.top-6{top:calc(var(--spacing) * 6)}.top-full{top:100%}.-right-1{right:calc(var(--spacing) * -1)}.right-0{right:0}.right-1{right:var(--spacing)}.right-2{right:calc(var(--spacing) * 2)}.right-3{right:calc(var(--spacing) * 3)}.right-4{right:calc(var(--spacing) * 4)}.right-5{right:calc(var(--spacing) * 5)}.right-6{right:calc(var(--spacing) * 6)}.bottom-0{bottom:0}.bottom-\\[calc\\(var\\(--sab\\)\\+4\\.5rem\\)\\]{bottom:calc(var(--sab) + 4.5rem)}.bottom-full{bottom:100%}.left-0{left:0}.left-1{left:var(--spacing)}.left-1\\/2{left:50%}.left-2{left:calc(var(--spacing) * 2)}.left-3{left:calc(var(--spacing) * 3)}.left-\\[-4px\\]{left:-4px}.isolate{isolation:isolate}.isolation-auto{isolation:auto}.z-0{z-index:0}.z-10{z-index:10}.z-20{z-index:20}.z-30{z-index:30}.z-40{z-index:40}.z-50{z-index:50}.z-\\[1000\\]{z-index:1000}.z-\\[1010\\]{z-index:1010}.z-\\[1200\\]{z-index:1200}.col-span-1{grid-column:span 1/span 1}.col-span-2{grid-column:span 2/span 2}.col-span-3{grid-column:span 3/span 3}.col-span-full{grid-column:1/-1}.col-start-1{grid-column-start:1}.col-start-2{grid-column-start:2}.row-span-1{grid-row:span 1/span 1}.row-span-2{grid-row:span 2/span 2}.row-span-3{grid-row:span 3/span 3}.row-start-1{grid-row-start:1}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.m-0{margin:0}.m-5{margin:calc(var(--spacing) * 5)}.m-26{margin:calc(var(--spacing) * 26)}.m-26\\.25{margin:calc(var(--spacing) * 26.25)}.m-31{margin:calc(var(--spacing) * 31)}.m-31\\.5{margin:calc(var(--spacing) * 31.5)}.m-90{margin:calc(var(--spacing) * 90)}.m-1743{margin:calc(var(--spacing) * 1743)}.m-2205{margin:calc(var(--spacing) * 2205)}.mx-1{margin-inline:var(--spacing)}.mx-4{margin-inline:calc(var(--spacing) * 4)}.mx-auto{margin-inline:auto}.my-3{margin-block:calc(var(--spacing) * 3)}.my-8{margin-block:calc(var(--spacing) * 8)}.-ms-1{margin-inline-start:calc(var(--spacing) * -1)}.ms-2{margin-inline-start:calc(var(--spacing) * 2)}.ms-5{margin-inline-start:calc(var(--spacing) * 5)}.ms-auto{margin-inline-start:auto}.mt-0{margin-top:0}.mt-0\\.5{margin-top:calc(var(--spacing) * .5)}.mt-1{margin-top:var(--spacing)}.mt-1\\.5{margin-top:calc(var(--spacing) * 1.5)}.mt-2{margin-top:calc(var(--spacing) * 2)}.mt-3{margin-top:calc(var(--spacing) * 3)}.mt-3\\.5{margin-top:calc(var(--spacing) * 3.5)}.mt-4{margin-top:calc(var(--spacing) * 4)}.mt-5{margin-top:calc(var(--spacing) * 5)}.mt-6{margin-top:calc(var(--spacing) * 6)}.mt-8{margin-top:calc(var(--spacing) * 8)}.mt-12{margin-top:calc(var(--spacing) * 12)}.mt-auto{margin-top:auto}.mr-1{margin-right:var(--spacing)}.mr-2{margin-right:calc(var(--spacing) * 2)}.mr-3{margin-right:calc(var(--spacing) * 3)}.mr-4{margin-right:calc(var(--spacing) * 4)}.mr-9{margin-right:calc(var(--spacing) * 9)}.mr-auto{margin-right:auto}.-mb-7{margin-bottom:calc(var(--spacing) * -7)}.-mb-7\\.5{margin-bottom:calc(var(--spacing) * -7.5)}.mb-0{margin-bottom:0}.mb-0\\.5{margin-bottom:calc(var(--spacing) * .5)}.mb-1{margin-bottom:var(--spacing)}.mb-1\\.5{margin-bottom:calc(var(--spacing) * 1.5)}.mb-2{margin-bottom:calc(var(--spacing) * 2)}.mb-3{margin-bottom:calc(var(--spacing) * 3)}.mb-4{margin-bottom:calc(var(--spacing) * 4)}.mb-5{margin-bottom:calc(var(--spacing) * 5)}.mb-6{margin-bottom:calc(var(--spacing) * 6)}.mb-8{margin-bottom:calc(var(--spacing) * 8)}.mb-10{margin-bottom:calc(var(--spacing) * 10)}.mb-12{margin-bottom:calc(var(--spacing) * 12)}.mb-14{margin-bottom:calc(var(--spacing) * 14)}.ml-1{margin-left:var(--spacing)}.ml-2{margin-left:calc(var(--spacing) * 2)}.ml-4{margin-left:calc(var(--spacing) * 4)}.ml-auto{margin-left:auto}.box-border{box-sizing:border-box}.line-clamp-2{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.line-clamp-3{-webkit-line-clamp:3;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.line-clamp-6{-webkit-line-clamp:6;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.\\!hidden{display:none!important}.block{display:block}.contents{display:contents}.flex{display:flex}.flow-root{display:flow-root}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.inline-grid{display:inline-grid}.inline-table{display:inline-table}.list-item{display:list-item}.table{display:table}.table-caption{display:table-caption}.table-cell{display:table-cell}.table-column{display:table-column}.table-column-group{display:table-column-group}.table-footer-group{display:table-footer-group}.table-header-group{display:table-header-group}.table-row{display:table-row}.table-row-group{display:table-row-group}.aspect-\\[4\\/3\\]{aspect-ratio:4/3}.aspect-square{aspect-ratio:1}.size-2{width:calc(var(--spacing) * 2);height:calc(var(--spacing) * 2)}.size-3{width:calc(var(--spacing) * 3);height:calc(var(--spacing) * 3)}.size-3\\.5{width:calc(var(--spacing) * 3.5);height:calc(var(--spacing) * 3.5)}.size-4{width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}.size-4\\.5{width:calc(var(--spacing) * 4.5);height:calc(var(--spacing) * 4.5)}.size-5{width:calc(var(--spacing) * 5);height:calc(var(--spacing) * 5)}.size-6{width:calc(var(--spacing) * 6);height:calc(var(--spacing) * 6)}.size-7{width:calc(var(--spacing) * 7);height:calc(var(--spacing) * 7)}.size-8{width:calc(var(--spacing) * 8);height:calc(var(--spacing) * 8)}.size-9{width:calc(var(--spacing) * 9);height:calc(var(--spacing) * 9)}.size-10{width:calc(var(--spacing) * 10);height:calc(var(--spacing) * 10)}.size-14{width:calc(var(--spacing) * 14);height:calc(var(--spacing) * 14)}.\\!h-4{height:calc(var(--spacing) * 4)!important}.h-0{height:0}.h-1{height:var(--spacing)}.h-1\\.5{height:calc(var(--spacing) * 1.5)}.h-2{height:calc(var(--spacing) * 2)}.h-2\\.5{height:calc(var(--spacing) * 2.5)}.h-3{height:calc(var(--spacing) * 3)}.h-3\\.5{height:calc(var(--spacing) * 3.5)}.h-4{height:calc(var(--spacing) * 4)}.h-5{height:calc(var(--spacing) * 5)}.h-6{height:calc(var(--spacing) * 6)}.h-8{height:calc(var(--spacing) * 8)}.h-9{height:calc(var(--spacing) * 9)}.h-10{height:calc(var(--spacing) * 10)}.h-11{height:calc(var(--spacing) * 11)}.h-12{height:calc(var(--spacing) * 12)}.h-14{height:calc(var(--spacing) * 14)}.h-16{height:calc(var(--spacing) * 16)}.h-20{height:calc(var(--spacing) * 20)}.h-28{height:calc(var(--spacing) * 28)}.h-30{height:calc(var(--spacing) * 30)}.h-56{height:calc(var(--spacing) * 56)}.h-\\[1\\.125rem\\]{height:1.125rem}.h-\\[2\\.375rem\\]{height:2.375rem}.h-\\[2\\.1875rem\\]{height:2.1875rem}.h-\\[20px\\]{height:20px}.h-\\[38px\\]{height:38px}.h-\\[75vh\\]{height:75vh}.h-\\[calc\\(100\\%_-_96px\\)\\]{height:calc(100% - 96px)}.h-auto{height:auto}.h-full{height:100%}.h-screen{height:100vh}.max-h-32{max-height:calc(var(--spacing) * 32)}.max-h-48{max-height:calc(var(--spacing) * 48)}.max-h-64{max-height:calc(var(--spacing) * 64)}.max-h-72{max-height:calc(var(--spacing) * 72)}.max-h-80{max-height:calc(var(--spacing) * 80)}.max-h-\\[80dvh\\]{max-height:80dvh}.max-h-\\[80vh\\]{max-height:80vh}.max-h-\\[85vh\\]{max-height:85vh}.min-h-0{min-height:0}.min-h-7{min-height:calc(var(--spacing) * 7)}.min-h-7\\.5{min-height:calc(var(--spacing) * 7.5)}.min-h-10{min-height:calc(var(--spacing) * 10)}.min-h-\\[2\\.625rem\\]{min-height:2.625rem}.min-h-\\[2rem\\]{min-height:2rem}.min-h-\\[4\\.25rem\\]{min-height:4.25rem}.min-h-\\[40px\\]{min-height:40px}.min-h-\\[300px\\]{min-height:300px}.min-h-\\[calc\\(100vh-7rem\\)\\]{min-height:calc(100vh - 7rem)}.min-h-screen{min-height:100vh}.\\!w-4{width:calc(var(--spacing) * 4)!important}.w-1{width:var(--spacing)}.w-1\\.5{width:calc(var(--spacing) * 1.5)}.w-2{width:calc(var(--spacing) * 2)}.w-3{width:calc(var(--spacing) * 3)}.w-3\\.5{width:calc(var(--spacing) * 3.5)}.w-3\\/4{width:75%}.w-4{width:calc(var(--spacing) * 4)}.w-5{width:calc(var(--spacing) * 5)}.w-6{width:calc(var(--spacing) * 6)}.w-7{width:calc(var(--spacing) * 7)}.w-8{width:calc(var(--spacing) * 8)}.w-9{width:calc(var(--spacing) * 9)}.w-10{width:calc(var(--spacing) * 10)}.w-12{width:calc(var(--spacing) * 12)}.w-14{width:calc(var(--spacing) * 14)}.w-16{width:calc(var(--spacing) * 16)}.w-20{width:calc(var(--spacing) * 20)}.w-24{width:calc(var(--spacing) * 24)}.w-40{width:calc(var(--spacing) * 40)}.w-48{width:calc(var(--spacing) * 48)}.w-64{width:calc(var(--spacing) * 64)}.w-72{width:calc(var(--spacing) * 72)}.w-80{width:calc(var(--spacing) * 80)}.w-\\[2\\.375rem\\]{width:2.375rem}.w-\\[35\\%\\]{width:35%}.w-auto{width:auto}.w-fit{width:fit-content}.w-full{width:100%}.w-max{width:max-content}.max-w-\\(--thread-max-width\\){max-width:var(--thread-max-width)}.max-w-2xl{max-width:var(--container-2xl)}.max-w-3xl{max-width:var(--container-3xl)}.max-w-4xl{max-width:var(--container-4xl)}.max-w-5xl{max-width:var(--container-5xl)}.max-w-6xl{max-width:var(--container-6xl)}.max-w-7xl{max-width:var(--container-7xl)}.max-w-64{max-width:calc(var(--spacing) * 64)}.max-w-\\[60ch\\]{max-width:60ch}.max-w-\\[72ch\\]{max-width:72ch}.max-w-\\[75\\%\\]{max-width:75%}.max-w-\\[150px\\]{max-width:150px}.max-w-\\[180px\\]{max-width:180px}.max-w-\\[280px\\]{max-width:280px}.max-w-\\[310px\\]{max-width:310px}.max-w-\\[1600px\\]{max-width:1600px}.max-w-full{max-width:100%}.max-w-md{max-width:var(--container-md)}.max-w-screen-md{max-width:var(--breakpoint-md)}.max-w-sm{max-width:var(--container-sm)}.max-w-xs{max-width:var(--container-xs)}.min-w-0{min-width:0}.min-w-5{min-width:calc(var(--spacing) * 5)}.min-w-6{min-width:calc(var(--spacing) * 6)}.min-w-8{min-width:calc(var(--spacing) * 8)}.min-w-14{min-width:calc(var(--spacing) * 14)}.min-w-36{min-width:calc(var(--spacing) * 36)}.min-w-48{min-width:calc(var(--spacing) * 48)}.min-w-64{min-width:calc(var(--spacing) * 64)}.min-w-72{min-width:calc(var(--spacing) * 72)}.min-w-\\[1\\.125rem\\]{min-width:1.125rem}.min-w-\\[2rem\\]{min-width:2rem}.min-w-\\[6\\.5rem\\]{min-width:6.5rem}.min-w-\\[6\\.875rem\\]{min-width:6.875rem}.min-w-\\[64px\\]{min-width:64px}.min-w-\\[140px\\]{min-width:140px}.min-w-\\[150px\\]{min-width:150px}.min-w-full{min-width:100%}.flex-1{flex:1}.flex-shrink{flex-shrink:1}.flex-shrink-0{flex-shrink:0}.shrink{flex-shrink:1}.shrink-0{flex-shrink:0}.flex-grow{flex-grow:1}.flex-grow-0{flex-grow:0}.grow{flex-grow:1}.basis-\\[80\\%\\]{flex-basis:80%}.basis-\\[88\\%\\]{flex-basis:88%}.basis-\\[140px\\]{flex-basis:140px}.basis-\\[160px\\]{flex-basis:160px}.basis-auto{flex-basis:auto}.basis-full{flex-basis:100%}.border-collapse{border-collapse:collapse}.border-separate{border-collapse:separate}.border-spacing-0{--tw-border-spacing-x:0;--tw-border-spacing-y:0;border-spacing:var(--tw-border-spacing-x) var(--tw-border-spacing-y)}.origin-left{transform-origin:0}.-translate-x-1{--tw-translate-x:calc(var(--spacing) * -1);translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-x-1\\/2{--tw-translate-x:-50%;translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-x-16{--tw-translate-x:calc(var(--spacing) * -16);translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-x-0{--tw-translate-x:0;translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-x-full{--tw-translate-x:100%;translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-y-1{--tw-translate-y:calc(var(--spacing) * -1);translate:var(--tw-translate-x) var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y:-50%;translate:var(--tw-translate-x) var(--tw-translate-y)}.translate-none{translate:none}.scale-3d{scale:var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z)}.-rotate-90{rotate:-90deg}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.animate-in{animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.animate-pulse{animation:var(--animate-pulse)}.animate-spin{animation:var(--animate-spin)}.cursor-col-resize{cursor:col-resize}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.cursor-pointer{cursor:pointer}.touch-pinch-zoom{--tw-pinch-zoom:pinch-zoom;touch-action:var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)}.resize{resize:both}.resize-none{resize:none}.scroll-m-20{scroll-margin:calc(var(--spacing) * 20)}.list-inside{list-style-position:inside}.list-decimal{list-style-type:decimal}.list-disc{list-style-type:disc}.list-none{list-style-type:none}.auto-rows-auto{grid-auto-rows:auto}.auto-rows-fr{grid-auto-rows:minmax(0,1fr)}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-\\[252px_8px_1fr\\]{grid-template-columns:252px 8px 1fr}.grid-cols-\\[minmax\\(72px\\,1fr\\)_auto\\]{grid-template-columns:minmax(72px,1fr) auto}.flex-col{flex-direction:column}.flex-row{flex-direction:row}.flex-wrap{flex-wrap:wrap}.content-start{align-content:flex-start}.items-baseline{align-items:baseline}.items-center{align-items:center}.items-end{align-items:flex-end}.items-start{align-items:flex-start}.items-stretch{align-items:stretch}.justify-around{justify-content:space-around}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-start{justify-content:flex-start}.gap-0{gap:0}.gap-0\\.5{gap:calc(var(--spacing) * .5)}.gap-1{gap:var(--spacing)}.gap-1\\.5{gap:calc(var(--spacing) * 1.5)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-2\\.5{gap:calc(var(--spacing) * 2.5)}.gap-3{gap:calc(var(--spacing) * 3)}.gap-4{gap:calc(var(--spacing) * 4)}.gap-5{gap:calc(var(--spacing) * 5)}.gap-6{gap:calc(var(--spacing) * 6)}.gap-8{gap:calc(var(--spacing) * 8)}.gap-10{gap:calc(var(--spacing) * 10)}.gap-12{gap:calc(var(--spacing) * 12)}:where(.space-y-0>:not(:last-child)){--tw-space-y-reverse:0;margin-block:0}:where(.space-y-1>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(var(--spacing) * var(--tw-space-y-reverse));margin-block-end:calc(var(--spacing) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2\\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 2.5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 2.5) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 5) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 5) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-6>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-8>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing) * 8) * var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing) * 8) * calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-reverse>:not(:last-child)){--tw-space-y-reverse:1}.gap-x-2{column-gap:calc(var(--spacing) * 2)}.gap-x-3{column-gap:calc(var(--spacing) * 3)}.gap-x-4{column-gap:calc(var(--spacing) * 4)}.gap-x-5{column-gap:calc(var(--spacing) * 5)}.gap-x-6{column-gap:calc(var(--spacing) * 6)}:where(.space-x-1>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(var(--spacing) * var(--tw-space-x-reverse));margin-inline-end:calc(var(--spacing) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-2>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 2) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-3>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 3) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-4>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 4) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-6>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 6) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-reverse>:not(:last-child)){--tw-space-x-reverse:1}.gap-y-1{row-gap:var(--spacing)}.gap-y-2{row-gap:calc(var(--spacing) * 2)}.gap-y-3{row-gap:calc(var(--spacing) * 3)}.gap-y-6{row-gap:calc(var(--spacing) * 6)}.gap-y-8{row-gap:calc(var(--spacing) * 8)}:where(.divide-x>:not(:last-child)){--tw-divide-x-reverse:0;border-inline-style:var(--tw-border-style);border-inline-start-width:calc(1px * var(--tw-divide-x-reverse));border-inline-end-width:calc(1px * calc(1 - var(--tw-divide-x-reverse)))}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px * var(--tw-divide-y-reverse));border-bottom-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-y-reverse>:not(:last-child)){--tw-divide-y-reverse:1}:where(.divide-border>:not(:last-child)){border-color:var(--border)}.self-center{align-self:center}.self-stretch{align-self:stretch}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-visible{overflow:visible}.overflow-x-auto{overflow-x:auto}.overflow-y-auto{overflow-y:auto}.overflow-y-scroll{overflow-y:scroll}.scroll-smooth{scroll-behavior:smooth}.rounded{border-radius:.25rem}.rounded-\\(--composer-radius\\){border-radius:var(--composer-radius)}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-\\[0\\.625rem\\]{border-radius:.625rem}.rounded-\\[calc\\(var\\(--border-radius\\)-2px\\)\\]{border-radius:calc(var(--border-radius) - 2px)}.rounded-\\[var\\(--border-radius\\)\\]{border-radius:var(--border-radius)}.rounded-\\[var\\(--border-radius\\,0\\.625rem\\)\\]{border-radius:var(--border-radius,.625rem)}.rounded-\\[var\\(--border-radius\\,0\\.875rem\\)\\]{border-radius:var(--border-radius,.875rem)}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius)}.rounded-md{border-radius:calc(var(--radius) - 2px)}.rounded-none{border-radius:0}.rounded-xl{border-radius:calc(var(--radius) + 4px)}.rounded-s{border-start-start-radius:.25rem;border-end-start-radius:.25rem}.rounded-ss{border-start-start-radius:.25rem}.rounded-e{border-start-end-radius:.25rem;border-end-end-radius:.25rem}.rounded-se{border-start-end-radius:.25rem}.rounded-ee{border-end-end-radius:.25rem}.rounded-es{border-end-start-radius:.25rem}.rounded-t{border-top-left-radius:.25rem;border-top-right-radius:.25rem}.rounded-t-\\(--composer-radius\\){border-top-left-radius:var(--composer-radius);border-top-right-radius:var(--composer-radius)}.rounded-t-lg{border-top-left-radius:var(--radius);border-top-right-radius:var(--radius)}.rounded-t-none{border-top-left-radius:0;border-top-right-radius:0}.rounded-t-xl{border-top-left-radius:calc(var(--radius) + 4px);border-top-right-radius:calc(var(--radius) + 4px)}.rounded-l{border-top-left-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-l-\\[var\\(--border-radius\\)\\]{border-top-left-radius:var(--border-radius);border-bottom-left-radius:var(--border-radius)}.rounded-l-none{border-top-left-radius:0;border-bottom-left-radius:0}.rounded-tl{border-top-left-radius:.25rem}.rounded-r{border-top-right-radius:.25rem;border-bottom-right-radius:.25rem}.rounded-r-\\[var\\(--border-radius\\)\\]{border-top-right-radius:var(--border-radius);border-bottom-right-radius:var(--border-radius)}.rounded-r-none{border-top-right-radius:0;border-bottom-right-radius:0}.rounded-tr{border-top-right-radius:.25rem}.rounded-b{border-bottom-right-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-b-xl{border-bottom-right-radius:calc(var(--radius) + 4px);border-bottom-left-radius:calc(var(--radius) + 4px)}.rounded-br{border-bottom-right-radius:.25rem}.rounded-bl{border-bottom-left-radius:.25rem}.border{border-style:var(--tw-border-style);border-width:1px}.border-0{border-style:var(--tw-border-style);border-width:0}.border-2{border-style:var(--tw-border-style);border-width:2px}.border-\\[3px\\]{border-style:var(--tw-border-style);border-width:3px}.border-x{border-inline-style:var(--tw-border-style);border-inline-width:1px}.border-y{border-block-style:var(--tw-border-style);border-block-width:1px}.border-s{border-inline-start-style:var(--tw-border-style);border-inline-start-width:1px}.border-s-2{border-inline-start-style:var(--tw-border-style);border-inline-start-width:2px}.border-e{border-inline-end-style:var(--tw-border-style);border-inline-end-width:1px}.border-bs{border-block-start-style:var(--tw-border-style);border-block-start-width:1px}.border-be{border-block-end-style:var(--tw-border-style);border-block-end-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-t-0{border-top-style:var(--tw-border-style);border-top-width:0}.border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-b-0{border-bottom-style:var(--tw-border-style);border-bottom-width:0}.border-b-2{border-bottom-style:var(--tw-border-style);border-bottom-width:2px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-l-2{border-left-style:var(--tw-border-style);border-left-width:2px}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-none{--tw-border-style:none;border-style:none}.border-solid{--tw-border-style:solid;border-style:solid}.border-\\[var\\(--border\\)\\]{border-color:var(--border)}.border-\\[var\\(--bottom-nav-border\\)\\]{border-color:var(--bottom-nav-border)}.border-\\[var\\(--secondary-color\\)\\]{border-color:var(--secondary-color)}.border-amber-500{border-color:var(--color-amber-500)}.border-amber-500\\/40{border-color:#f99c0066}@supports (color:color-mix(in lab,red,red)){.border-amber-500\\/40{border-color:color-mix(in oklab,var(--color-amber-500) 40%,transparent)}}.border-black{border-color:var(--color-black)}.border-black\\/10{border-color:#0000001a}@supports (color:color-mix(in lab,red,red)){.border-black\\/10{border-color:color-mix(in oklab,var(--color-black) 10%,transparent)}}.border-black\\/15{border-color:#00000026}@supports (color:color-mix(in lab,red,red)){.border-black\\/15{border-color:color-mix(in oklab,var(--color-black) 15%,transparent)}}.border-black\\/\\[\\.08\\]{border-color:#00000014}@supports (color:color-mix(in lab,red,red)){.border-black\\/\\[\\.08\\]{border-color:color-mix(in oklab,var(--color-black) 8%,transparent)}}.border-border,.border-border\\/50{border-color:var(--border)}@supports (color:color-mix(in lab,red,red)){.border-border\\/50{border-color:color-mix(in oklab,var(--border) 50%,transparent)}}.border-border\\/60{border-color:var(--border)}@supports (color:color-mix(in lab,red,red)){.border-border\\/60{border-color:color-mix(in oklab,var(--border) 60%,transparent)}}.border-current{border-color:currentColor}.border-destructive,.border-destructive\\/20{border-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.border-destructive\\/20{border-color:color-mix(in oklab,var(--destructive) 20%,transparent)}}.border-destructive\\/30{border-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.border-destructive\\/30{border-color:color-mix(in oklab,var(--destructive) 30%,transparent)}}.border-destructive\\/40{border-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.border-destructive\\/40{border-color:color-mix(in oklab,var(--destructive) 40%,transparent)}}.border-gray-200{border-color:var(--color-gray-200)}.border-gray-300{border-color:var(--color-gray-300)}.border-gray-400{border-color:var(--color-gray-400)}.border-gray-600{border-color:var(--color-gray-600)}.border-green-500{border-color:var(--color-green-500)}.border-green-500\\/30{border-color:#00c7584d}@supports (color:color-mix(in lab,red,red)){.border-green-500\\/30{border-color:color-mix(in oklab,var(--color-green-500) 30%,transparent)}}.border-input{border-color:var(--input)}.border-muted-foreground,.border-muted-foreground\\/20{border-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.border-muted-foreground\\/20{border-color:color-mix(in oklab,var(--muted-foreground) 20%,transparent)}}.border-muted-foreground\\/30{border-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.border-muted-foreground\\/30{border-color:color-mix(in oklab,var(--muted-foreground) 30%,transparent)}}.border-primary{border-color:var(--primary)}.border-red-500{border-color:var(--color-red-500)}.border-ring{border-color:var(--ring)}.border-white{border-color:var(--color-white)}.border-white\\/15{border-color:#ffffff26}@supports (color:color-mix(in lab,red,red)){.border-white\\/15{border-color:color-mix(in oklab,var(--color-white) 15%,transparent)}}.border-t-\\[var\\(--secondary-color\\)\\]{border-top-color:var(--secondary-color)}.border-t-transparent{border-top-color:#0000}.border-l-primary{border-left-color:var(--primary)}.\\!bg-transparent{background-color:#0000!important}.bg-\\(--composer-bg\\){background-color:var(--composer-bg)}.bg-\\[\\#E07A5F\\]{background-color:#e07a5f}.bg-\\[\\#d9043d\\]{background-color:#d9043d}.bg-\\[var\\(--bottom-nav-bg\\)\\]{background-color:var(--bottom-nav-bg)}.bg-\\[var\\(--counter-background\\)\\]{background-color:var(--counter-background)}.bg-\\[var\\(--primary-color\\)\\]{background-color:var(--primary-color)}.bg-\\[var\\(--primary-color\\,\\#fff\\)\\]{background-color:var(--primary-color,#fff)}.bg-\\[var\\(--secondary-color\\)\\],.bg-\\[var\\(--secondary-color\\)\\]\\/\\[\\.08\\]{background-color:var(--secondary-color)}@supports (color:color-mix(in lab,red,red)){.bg-\\[var\\(--secondary-color\\)\\]\\/\\[\\.08\\]{background-color:color-mix(in oklab,var(--secondary-color) 8%,transparent)}}.bg-accent{background-color:var(--accent)}.bg-amber-500{background-color:var(--color-amber-500)}.bg-background,.bg-background\\/60{background-color:var(--background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/60{background-color:color-mix(in oklab,var(--background) 60%,transparent)}}.bg-background\\/70{background-color:var(--background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/70{background-color:color-mix(in oklab,var(--background) 70%,transparent)}}.bg-black{background-color:var(--color-black)}.bg-black\\/10{background-color:#0000001a}@supports (color:color-mix(in lab,red,red)){.bg-black\\/10{background-color:color-mix(in oklab,var(--color-black) 10%,transparent)}}.bg-black\\/50{background-color:#00000080}@supports (color:color-mix(in lab,red,red)){.bg-black\\/50{background-color:color-mix(in oklab,var(--color-black) 50%,transparent)}}.bg-black\\/\\[\\.03\\]{background-color:#00000008}@supports (color:color-mix(in lab,red,red)){.bg-black\\/\\[\\.03\\]{background-color:color-mix(in oklab,var(--color-black) 3%,transparent)}}.bg-black\\/\\[\\.06\\]{background-color:#0000000f}@supports (color:color-mix(in lab,red,red)){.bg-black\\/\\[\\.06\\]{background-color:color-mix(in oklab,var(--color-black) 6%,transparent)}}.bg-blue-100{background-color:var(--color-blue-100)}.bg-blue-500{background-color:var(--color-blue-500)}.bg-blue-600{background-color:var(--color-blue-600)}.bg-blue-950{background-color:var(--color-blue-950)}.bg-card{background-color:var(--card)}.bg-current{background-color:currentColor}.bg-destructive,.bg-destructive\\/10{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.bg-destructive\\/10{background-color:color-mix(in oklab,var(--destructive) 10%,transparent)}}.bg-gray-50{background-color:var(--color-gray-50)}.bg-gray-100{background-color:var(--color-gray-100)}.bg-gray-200{background-color:var(--color-gray-200)}.bg-gray-300{background-color:var(--color-gray-300)}.bg-gray-600{background-color:var(--color-gray-600)}.bg-gray-800{background-color:var(--color-gray-800)}.bg-green-100{background-color:var(--color-green-100)}.bg-green-200{background-color:var(--color-green-200)}.bg-green-500{background-color:var(--color-green-500)}.bg-green-500\\/10{background-color:#00c7581a}@supports (color:color-mix(in lab,red,red)){.bg-green-500\\/10{background-color:color-mix(in oklab,var(--color-green-500) 10%,transparent)}}.bg-green-600{background-color:var(--color-green-600)}.bg-green-700{background-color:var(--color-green-700)}.bg-indigo-500{background-color:var(--color-indigo-500)}.bg-muted,.bg-muted\\/30{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.bg-muted\\/30{background-color:color-mix(in oklab,var(--muted) 30%,transparent)}}.bg-muted\\/50{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.bg-muted\\/50{background-color:color-mix(in oklab,var(--muted) 50%,transparent)}}.bg-popover{background-color:var(--popover)}.bg-primary,.bg-primary\\/5{background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.bg-primary\\/5{background-color:color-mix(in oklab,var(--primary) 5%,transparent)}}.bg-red-500{background-color:var(--color-red-500)}.bg-transparent{background-color:#0000}.bg-white{background-color:var(--color-white)}.bg-white\\/5{background-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){.bg-white\\/5{background-color:color-mix(in oklab,var(--color-white) 5%,transparent)}}.bg-white\\/90{background-color:#ffffffe6}@supports (color:color-mix(in lab,red,red)){.bg-white\\/90{background-color:color-mix(in oklab,var(--color-white) 90%,transparent)}}.bg-\\[linear-gradient\\(to_bottom\\,var\\(--color-background\\)\\,transparent\\)\\]{background-image:linear-gradient(to bottom,var(--color-background),transparent)}.bg-\\[linear-gradient\\(to_top\\,var\\(--color-background\\)\\,transparent\\)\\]{background-image:linear-gradient(to top,var(--color-background),transparent)}.bg-repeat{background-repeat:repeat}.mask-no-clip{-webkit-mask-clip:no-clip;mask-clip:no-clip}.mask-repeat{-webkit-mask-repeat:repeat;mask-repeat:repeat}.\\!fill-\\[var\\(--primary-text-color\\)\\]{fill:var(--primary-text-color)!important}.\\!fill-\\[var\\(--secondary-text-color\\)\\]{fill:var(--secondary-text-color)!important}.fill-\\[var\\(--button-text-color\\)\\]{fill:var(--button-text-color)}.fill-current{fill:currentColor}.stroke-\\[1\\.5px\\]{stroke-width:1.5px}.object-contain{object-fit:contain}.object-cover{object-fit:cover}.p-0{padding:0}.p-0\\.5{padding:calc(var(--spacing) * .5)}.p-1{padding:var(--spacing)}.p-2{padding:calc(var(--spacing) * 2)}.p-2\\.5{padding:calc(var(--spacing) * 2.5)}.p-3{padding:calc(var(--spacing) * 3)}.p-3\\.5{padding:calc(var(--spacing) * 3.5)}.p-4{padding:calc(var(--spacing) * 4)}.p-5{padding:calc(var(--spacing) * 5)}.p-6{padding:calc(var(--spacing) * 6)}.p-8{padding:calc(var(--spacing) * 8)}.p-10{padding:calc(var(--spacing) * 10)}.p-12{padding:calc(var(--spacing) * 12)}.px-1{padding-inline:var(--spacing)}.px-1\\.5{padding-inline:calc(var(--spacing) * 1.5)}.px-2{padding-inline:calc(var(--spacing) * 2)}.px-2\\.5{padding-inline:calc(var(--spacing) * 2.5)}.px-3{padding-inline:calc(var(--spacing) * 3)}.px-3\\.5{padding-inline:calc(var(--spacing) * 3.5)}.px-4{padding-inline:calc(var(--spacing) * 4)}.px-5{padding-inline:calc(var(--spacing) * 5)}.px-6{padding-inline:calc(var(--spacing) * 6)}.py-0{padding-block:0}.py-0\\.5{padding-block:calc(var(--spacing) * .5)}.py-1{padding-block:var(--spacing)}.py-1\\.5{padding-block:calc(var(--spacing) * 1.5)}.py-2{padding-block:calc(var(--spacing) * 2)}.py-2\\.5{padding-block:calc(var(--spacing) * 2.5)}.py-3{padding-block:calc(var(--spacing) * 3)}.py-4{padding-block:calc(var(--spacing) * 4)}.py-5{padding-block:calc(var(--spacing) * 5)}.py-6{padding-block:calc(var(--spacing) * 6)}.py-8{padding-block:calc(var(--spacing) * 8)}.py-10{padding-block:calc(var(--spacing) * 10)}.py-12{padding-block:calc(var(--spacing) * 12)}.ps-3{padding-inline-start:calc(var(--spacing) * 3)}.ps-4{padding-inline-start:calc(var(--spacing) * 4)}.ps-6{padding-inline-start:calc(var(--spacing) * 6)}.pt-0{padding-top:0}.pt-1{padding-top:var(--spacing)}.pt-1\\.5{padding-top:calc(var(--spacing) * 1.5)}.pt-2{padding-top:calc(var(--spacing) * 2)}.pt-2\\.5{padding-top:calc(var(--spacing) * 2.5)}.pt-4{padding-top:calc(var(--spacing) * 4)}.pt-5{padding-top:calc(var(--spacing) * 5)}.pr-4{padding-right:calc(var(--spacing) * 4)}.pr-5{padding-right:calc(var(--spacing) * 5)}.pr-6{padding-right:calc(var(--spacing) * 6)}.pr-10{padding-right:calc(var(--spacing) * 10)}.pr-11{padding-right:calc(var(--spacing) * 11)}.pr-12{padding-right:calc(var(--spacing) * 12)}.pr-28{padding-right:calc(var(--spacing) * 28)}.pb-0{padding-bottom:0}.pb-2{padding-bottom:calc(var(--spacing) * 2)}.pb-4{padding-bottom:calc(var(--spacing) * 4)}.pb-5{padding-bottom:calc(var(--spacing) * 5)}.pb-7{padding-bottom:calc(var(--spacing) * 7)}.pb-7\\.5{padding-bottom:calc(var(--spacing) * 7.5)}.pb-8{padding-bottom:calc(var(--spacing) * 8)}.pb-10{padding-bottom:calc(var(--spacing) * 10)}.pb-\\[calc\\(env\\(safe-area-inset-bottom\\,0\\)\\+0\\.5rem\\)\\]{padding-bottom:calc(env(safe-area-inset-bottom,0) + .5rem)}.pb-\\[env\\(safe-area-inset-bottom\\,0\\)\\]{padding-bottom:env(safe-area-inset-bottom,0)}.pb-\\[var\\(--sab\\)\\]{padding-bottom:var(--sab)}.pl-2{padding-left:calc(var(--spacing) * 2)}.pl-4{padding-left:calc(var(--spacing) * 4)}.pl-5{padding-left:calc(var(--spacing) * 5)}.pl-13{padding-left:calc(var(--spacing) * 13)}.text-center{text-align:center}.text-left{text-align:left}.text-right{text-align:right}.text-start{text-align:start}.font-mono{font-family:var(--font-mono)}.font-sans{font-family:var(--font-sans)}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-\\[0\\.75rem\\]{font-size:.75rem}.text-\\[0\\.85em\\]{font-size:.85em}.text-\\[0\\.625rem\\]{font-size:.625rem}.text-\\[0\\.8125rem\\]{font-size:.8125rem}.text-\\[0\\.9375rem\\]{font-size:.9375rem}.text-\\[1\\.5rem\\]{font-size:1.5rem}.text-\\[1\\.0625rem\\]{font-size:1.0625rem}.text-\\[10px\\]{font-size:10px}.text-\\[12px\\]{font-size:12px}.text-\\[13px\\]{font-size:13px}.text-\\[33px\\]{font-size:33px}.leading-4{--tw-leading:calc(var(--spacing) * 4);line-height:calc(var(--spacing) * 4)}.leading-5{--tw-leading:calc(var(--spacing) * 5);line-height:calc(var(--spacing) * 5)}.leading-6{--tw-leading:calc(var(--spacing) * 6);line-height:calc(var(--spacing) * 6)}.leading-7{--tw-leading:calc(var(--spacing) * 7);line-height:calc(var(--spacing) * 7)}.leading-\\[1\\.125rem\\]{--tw-leading:1.125rem;line-height:1.125rem}.leading-none{--tw-leading:1;line-height:1}.leading-normal{--tw-leading:var(--leading-normal);line-height:var(--leading-normal)}.leading-relaxed{--tw-leading:var(--leading-relaxed);line-height:var(--leading-relaxed)}.leading-snug{--tw-leading:var(--leading-snug);line-height:var(--leading-snug)}.leading-tight{--tw-leading:var(--leading-tight);line-height:var(--leading-tight)}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-light{--tw-font-weight:var(--font-weight-light);font-weight:var(--font-weight-light)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-normal{--tw-tracking:var(--tracking-normal);letter-spacing:var(--tracking-normal)}.tracking-tight{--tw-tracking:var(--tracking-tight);letter-spacing:var(--tracking-tight)}.tracking-wide{--tw-tracking:var(--tracking-wide);letter-spacing:var(--tracking-wide)}.text-pretty{text-wrap:pretty}.text-wrap{text-wrap:wrap}.break-words,.wrap-break-word{overflow-wrap:break-word}.break-all{word-break:break-all}.text-clip{text-overflow:clip}.text-ellipsis{text-overflow:ellipsis}.whitespace-normal{white-space:normal}.whitespace-nowrap{white-space:nowrap}.whitespace-pre-wrap{white-space:pre-wrap}.\\!text-\\[var\\(--primary-text-color\\)\\]{color:var(--primary-text-color)!important}.\\!text-\\[var\\(--secondary-text-color\\)\\]{color:var(--secondary-text-color)!important}.text-\\[\\#444\\]{color:#444}.text-\\[color\\:var\\(--button-text-color\\)\\]{color:var(--button-text-color)}.text-\\[color\\:var\\(--minor-color\\)\\]{color:var(--minor-color)}.text-\\[color\\:var\\(--primary-text-color\\)\\]{color:var(--primary-text-color)}.text-\\[color\\:var\\(--secondary-text-color\\)\\]{color:var(--secondary-text-color)}.text-\\[var\\(--bottom-nav-text\\)\\]{color:var(--bottom-nav-text)}.text-\\[var\\(--button-text-color\\)\\]{color:var(--button-text-color)}.text-\\[var\\(--primary-text-color\\)\\]{color:var(--primary-text-color)}.text-\\[var\\(--secondary-color\\)\\]{color:var(--secondary-color)}.text-\\[var\\(--secondary-text-color\\)\\]{color:var(--secondary-text-color)}.text-amber-500{color:var(--color-amber-500)}.text-amber-600{color:var(--color-amber-600)}.text-blue-500{color:var(--color-blue-500)}.text-blue-600{color:var(--color-blue-600)}.text-blue-700{color:var(--color-blue-700)}.text-card-foreground{color:var(--card-foreground)}.text-destructive{color:var(--destructive)}.text-emerald-600{color:var(--color-emerald-600)}.text-foreground,.text-foreground\\/70{color:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.text-foreground\\/70{color:color-mix(in oklab,var(--foreground) 70%,transparent)}}.text-foreground\\/90{color:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.text-foreground\\/90{color:color-mix(in oklab,var(--foreground) 90%,transparent)}}.text-gray-300{color:var(--color-gray-300)}.text-gray-500{color:var(--color-gray-500)}.text-gray-600{color:var(--color-gray-600)}.text-gray-700{color:var(--color-gray-700)}.text-gray-800{color:var(--color-gray-800)}.text-gray-900{color:var(--color-gray-900)}.text-green-500{color:var(--color-green-500)}.text-green-600{color:var(--color-green-600)}.text-inherit{color:inherit}.text-muted-foreground{color:var(--muted-foreground)}.text-orange-500{color:var(--color-orange-500)}.text-popover-foreground{color:var(--popover-foreground)}.text-primary{color:var(--primary)}.text-primary-foreground{color:var(--primary-foreground)}.text-red-500{color:var(--color-red-500)}.text-red-600{color:var(--color-red-600)}.text-white{color:var(--color-white)}.capitalize{text-transform:capitalize}.lowercase{text-transform:lowercase}.normal-case{text-transform:none}.uppercase{text-transform:uppercase}.italic{font-style:italic}.not-italic{font-style:normal}.diagonal-fractions{--tw-numeric-fraction:diagonal-fractions;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.lining-nums{--tw-numeric-figure:lining-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.oldstyle-nums{--tw-numeric-figure:oldstyle-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.ordinal{--tw-ordinal:ordinal;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.proportional-nums{--tw-numeric-spacing:proportional-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.slashed-zero{--tw-slashed-zero:slashed-zero;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.stacked-fractions{--tw-numeric-fraction:stacked-fractions;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.normal-nums{font-variant-numeric:normal}.\\!underline{text-decoration-line:underline!important}.line-through{text-decoration-line:line-through}.no-underline{text-decoration-line:none}.overline{text-decoration-line:overline}.underline{text-decoration-line:underline}.underline-offset-2{text-underline-offset:2px}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.subpixel-antialiased{-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto}.caret-primary{caret-color:var(--primary)}.accent-\\[var\\(--secondary-color\\)\\]{accent-color:var(--secondary-color)}.\\[color-scheme\\:dark\\]{color-scheme:dark}.opacity-0{opacity:0}.opacity-25{opacity:.25}.opacity-30{opacity:.3}.opacity-50{opacity:.5}.opacity-60{opacity:.6}.opacity-70{opacity:.7}.opacity-75{opacity:.75}.opacity-85{opacity:.85}.opacity-100{opacity:1}.\\!shadow-none{--tw-shadow:0 0 #0000!important;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)!important}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-2xl{--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,#00000040);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_-4px_20px_rgba\\(0\\,0\\,0\\,0\\.06\\)\\]{--tw-shadow:0 -4px 20px var(--tw-shadow-color,#0000000f);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_-6px_20px_rgba\\(0\\,0\\,0\\,0\\.12\\)\\]{--tw-shadow:0 -6px 20px var(--tw-shadow-color,#0000001f);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_4px_16px_-8px_rgba\\(0\\,0\\,0\\,0\\.08\\)\\,0_1px_2px_rgba\\(0\\,0\\,0\\,0\\.04\\)\\]{--tw-shadow:0 4px 16px -8px var(--tw-shadow-color,#00000014), 0 1px 2px var(--tw-shadow-color,#0000000a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a), 0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,#0000001a), 0 2px 4px -2px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,#0000001a), 0 8px 10px -6px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.inset-ring{--tw-inset-ring-shadow:inset 0 0 0 1px var(--tw-inset-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-offset-background{--tw-ring-offset-color:var(--background)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.blur{--tw-blur:blur(8px);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.drop-shadow{--tw-drop-shadow-size:drop-shadow(0 1px 2px var(--tw-drop-shadow-color,#0000001a)) drop-shadow(0 1px 1px var(--tw-drop-shadow-color,#0000000f));--tw-drop-shadow:drop-shadow(0 1px 2px #0000001a) drop-shadow(0 1px 1px #0000000f);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.drop-shadow-\\[0_1px_3px_rgba\\(0\\,0\\,0\\,0\\.6\\)\\]{--tw-drop-shadow-size:drop-shadow(0 1px 3px var(--tw-drop-shadow-color,#0009));--tw-drop-shadow:var(--tw-drop-shadow-size);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.grayscale{--tw-grayscale:grayscale(100%);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.invert{--tw-invert:invert(100%);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.sepia{--tw-sepia:sepia(100%);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.filter{filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.backdrop-blur{--tw-backdrop-blur:blur(8px);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-blur-\\[1px\\]{--tw-backdrop-blur:blur(1px);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-grayscale{--tw-backdrop-grayscale:grayscale(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-invert{--tw-backdrop-invert:invert(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-sepia{--tw-backdrop-sepia:sepia(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.backdrop-filter{-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[border-color\\,box-shadow\\]{transition-property:border-color,box-shadow;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[color\\,scale\\]{transition-property:color,scale;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[width\\]{transition-property:width;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-shadow{transition-property:box-shadow;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.duration-\\(--animation-duration\\){--tw-duration:var(--animation-duration);transition-duration:var(--animation-duration)}.duration-150{--tw-duration:.15s;transition-duration:.15s}.duration-200{--tw-duration:.2s;transition-duration:.2s}.duration-300{--tw-duration:.3s;transition-duration:.3s}.duration-500{--tw-duration:.5s;transition-duration:.5s}.ease-\\[cubic-bezier\\(0\\.32\\,0\\.72\\,0\\,1\\)\\]{--tw-ease:cubic-bezier(.32,.72,0,1);transition-timing-function:cubic-bezier(.32,.72,0,1)}.ease-in{--tw-ease:var(--ease-in);transition-timing-function:var(--ease-in)}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}.ease-out{--tw-ease:var(--ease-out);transition-timing-function:var(--ease-out)}.fade-in-0{--tw-enter-opacity:0}.fill-mode-both{--tw-animation-fill-mode:both;animation-fill-mode:both}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.zoom-in-50{--tw-enter-scale:.5}.zoom-in-75{--tw-enter-scale:.75}.\\[animation-duration\\:0\\.6s\\]{animation-duration:.6s}.\\[core\\:order-after-done\\]{core:order-after-done}.\\[key\\:string\\]{key:string}.backface-hidden{backface-visibility:hidden}:where(.divide-x-reverse>:not(:last-child)){--tw-divide-x-reverse:1}.fade-in{--tw-enter-opacity:0}.paused{animation-play-state:paused}.ring-inset{--tw-ring-inset:inset}.running{animation-play-state:running}.slide-in-from-bottom-1{--tw-enter-translate-y:calc(1*var(--spacing))}.zoom-in{--tw-enter-scale:0}.zoom-out{--tw-exit-scale:0}@media (hover:hover){.group-hover\\:translate-x-0\\.5:is(:where(.group):hover *){--tw-translate-x:calc(var(--spacing) * .5);translate:var(--tw-translate-x) var(--tw-translate-y)}.group-hover\\:-translate-y-0\\.5:is(:where(.group):hover *){--tw-translate-y:calc(var(--spacing) * -.5);translate:var(--tw-translate-x) var(--tw-translate-y)}.group-hover\\:opacity-100:is(:where(.group):hover *){opacity:1}}.group-data-\\[state\\=closed\\]\\/collapsible-content\\:animate-out:is(:where(.group\\/collapsible-content)[data-state=closed] *){animation:exit var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.group-data-\\[state\\=closed\\]\\/collapsible-content\\:fade-out-0:is(:where(.group\\/collapsible-content)[data-state=closed] *){--tw-exit-opacity:0}.group-data-\\[state\\=closed\\]\\/collapsible-content\\:slide-out-to-top-1:is(:where(.group\\/collapsible-content)[data-state=closed] *){--tw-exit-translate-y:calc(1*var(--spacing)*-1)}.group-data-\\[state\\=open\\]\\/collapsible-content\\:animate-in:is(:where(.group\\/collapsible-content)[data-state=open] *){animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.group-data-\\[state\\=open\\]\\/collapsible-content\\:fade-in-0:is(:where(.group\\/collapsible-content)[data-state=open] *){--tw-enter-opacity:0}.group-data-\\[state\\=open\\]\\/collapsible-content\\:slide-in-from-top-1:is(:where(.group\\/collapsible-content)[data-state=open] *){--tw-enter-translate-y:calc(1*var(--spacing)*-1)}.group-data-\\[state\\=open\\]\\/collapsible-content\\:slide-in-from-top-4:is(:where(.group\\/collapsible-content)[data-state=open] *){--tw-enter-translate-y:calc(4*var(--spacing)*-1)}.group-data-\\[state\\=open\\]\\/trigger\\:rotate-0:is(:where(.group\\/trigger)[data-state=open] *){rotate:0deg}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:mt-1:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){margin-top:var(--spacing)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:gap-1:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){gap:var(--spacing)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:py-1\\.5:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){padding-block:calc(var(--spacing) * 1.5)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:font-normal:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:text-muted-foreground:is(:where(.group\\/tool-group-root)[data-variant=ghost] *){color:var(--muted-foreground)}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:mt-3:is(:where(.group\\/tool-group-root)[data-variant=muted] *){margin-top:calc(var(--spacing) * 3)}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:w-full:is(:where(.group\\/tool-group-root)[data-variant=muted] *){width:100%}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:grow:is(:where(.group\\/tool-group-root)[data-variant=muted] *){flex-grow:1}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:border-t:is(:where(.group\\/tool-group-root)[data-variant=muted] *){border-top-style:var(--tw-border-style);border-top-width:1px}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:px-4:is(:where(.group\\/tool-group-root)[data-variant=muted] *){padding-inline:calc(var(--spacing) * 4)}.group-data-\\[variant\\=muted\\]\\/tool-group-root\\:pt-3:is(:where(.group\\/tool-group-root)[data-variant=muted] *){padding-top:calc(var(--spacing) * 3)}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:mt-3:is(:where(.group\\/tool-group-root)[data-variant=outline] *){margin-top:calc(var(--spacing) * 3)}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:w-full:is(:where(.group\\/tool-group-root)[data-variant=outline] *){width:100%}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:grow:is(:where(.group\\/tool-group-root)[data-variant=outline] *){flex-grow:1}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:border-t:is(:where(.group\\/tool-group-root)[data-variant=outline] *){border-top-style:var(--tw-border-style);border-top-width:1px}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:px-4:is(:where(.group\\/tool-group-root)[data-variant=outline] *){padding-inline:calc(var(--spacing) * 4)}.group-data-\\[variant\\=outline\\]\\/tool-group-root\\:pt-3:is(:where(.group\\/tool-group-root)[data-variant=outline] *){padding-top:calc(var(--spacing) * 3)}.marker\\:text-muted-foreground ::marker{color:var(--muted-foreground)}.marker\\:text-muted-foreground::marker{color:var(--muted-foreground)}.marker\\:text-muted-foreground ::-webkit-details-marker{color:var(--muted-foreground)}.marker\\:text-muted-foreground::-webkit-details-marker{color:var(--muted-foreground)}.placeholder\\:text-muted-foreground\\/80::placeholder{color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.placeholder\\:text-muted-foreground\\/80::placeholder{color:color-mix(in oklab,var(--muted-foreground) 80%,transparent)}}.first\\:mt-0:first-child{margin-top:0}.first\\:rounded-ss-lg:first-child{border-start-start-radius:var(--radius)}.first\\:border-t:first-child{border-top-style:var(--tw-border-style);border-top-width:1px}.last\\:mb-0:last-child{margin-bottom:0}.last\\:rounded-se-lg:last-child{border-start-end-radius:var(--radius)}.last\\:border-e:last-child{border-inline-end-style:var(--tw-border-style);border-inline-end-width:1px}.last\\:border-b-0:last-child{border-bottom-style:var(--tw-border-style);border-bottom-width:0}:is(.only\\:\\*\\:first\\:size-24:only-child>*):first-child{width:calc(var(--spacing) * 24);height:calc(var(--spacing) * 24)}.empty\\:hidden:empty{display:none}.focus-within\\:border-border:focus-within{border-color:var(--border)}.focus-within\\:shadow-\\[0_6px_24px_-8px_rgba\\(0\\,0\\,0\\,0\\.12\\)\\,0_1px_2px_rgba\\(0\\,0\\,0\\,0\\.05\\)\\]:focus-within{--tw-shadow:0 6px 24px -8px var(--tw-shadow-color,#0000001f), 0 1px 2px var(--tw-shadow-color,#0000000d);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-within\\:outline-none:focus-within{--tw-outline-style:none;outline-style:none}@media (hover:hover){.hover\\:scale-105:hover{--tw-scale-x:105%;--tw-scale-y:105%;--tw-scale-z:105%;scale:var(--tw-scale-x) var(--tw-scale-y)}.hover\\:scale-110:hover{--tw-scale-x:110%;--tw-scale-y:110%;--tw-scale-z:110%;scale:var(--tw-scale-x) var(--tw-scale-y)}.hover\\:border-\\[var\\(--secondary-color\\)\\]:hover{border-color:var(--secondary-color)}.hover\\:bg-\\[var\\(--secondary-color\\)\\]:hover{background-color:var(--secondary-color)}.hover\\:bg-accent:hover,.hover\\:bg-accent\\/50:hover{background-color:var(--accent)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-accent\\/50:hover{background-color:color-mix(in oklab,var(--accent) 50%,transparent)}}.hover\\:bg-black:hover{background-color:var(--color-black)}.hover\\:bg-black\\/5:hover{background-color:#0000000d}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-black\\/5:hover{background-color:color-mix(in oklab,var(--color-black) 5%,transparent)}}.hover\\:bg-black\\/\\[\\.04\\]:hover{background-color:#0000000a}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-black\\/\\[\\.04\\]:hover{background-color:color-mix(in oklab,var(--color-black) 4%,transparent)}}.hover\\:bg-black\\/\\[\\.12\\]:hover{background-color:#0000001f}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-black\\/\\[\\.12\\]:hover{background-color:color-mix(in oklab,var(--color-black) 12%,transparent)}}.hover\\:bg-black\\/\\[0\\.03\\]:hover{background-color:#00000008}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-black\\/\\[0\\.03\\]:hover{background-color:color-mix(in oklab,var(--color-black) 3%,transparent)}}.hover\\:bg-blue-100:hover{background-color:var(--color-blue-100)}.hover\\:bg-blue-600:hover{background-color:var(--color-blue-600)}.hover\\:bg-blue-800:hover{background-color:var(--color-blue-800)}.hover\\:bg-gray-100:hover{background-color:var(--color-gray-100)}.hover\\:bg-gray-400:hover{background-color:var(--color-gray-400)}.hover\\:bg-gray-500:hover{background-color:var(--color-gray-500)}.hover\\:bg-green-600:hover{background-color:var(--color-green-600)}.hover\\:bg-indigo-600:hover{background-color:var(--color-indigo-600)}.hover\\:bg-muted:hover{background-color:var(--muted)}.hover\\:bg-muted-foreground\\/15:hover{background-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-muted-foreground\\/15:hover{background-color:color-mix(in oklab,var(--muted-foreground) 15%,transparent)}}.hover\\:bg-muted\\/40:hover{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-muted\\/40:hover{background-color:color-mix(in oklab,var(--muted) 40%,transparent)}}.hover\\:bg-muted\\/50:hover{background-color:var(--muted)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-muted\\/50:hover{background-color:color-mix(in oklab,var(--muted) 50%,transparent)}}.hover\\:bg-primary:hover,.hover\\:bg-primary\\/90:hover{background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-primary\\/90:hover{background-color:color-mix(in oklab,var(--primary) 90%,transparent)}}.hover\\:bg-red-600:hover{background-color:var(--color-red-600)}.hover\\:bg-white:hover{background-color:var(--color-white)}.hover\\:bg-white\\!:hover{background-color:var(--color-white)!important}.hover\\:bg-white\\/10:hover{background-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/10:hover{background-color:color-mix(in oklab,var(--color-white) 10%,transparent)}}.hover\\:text-\\[\\#222\\]:hover{color:#222}.hover\\:text-\\[var\\(--button-text-color\\)\\]:hover{color:var(--button-text-color)}.hover\\:text-\\[var\\(--secondary-color\\)\\]:hover{color:var(--secondary-color)}.hover\\:text-accent-foreground:hover{color:var(--accent-foreground)}.hover\\:text-foreground:hover{color:var(--foreground)}.hover\\:text-gray-300:hover{color:var(--color-gray-300)}.hover\\:text-gray-700:hover{color:var(--color-gray-700)}.hover\\:text-primary\\/80:hover{color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.hover\\:text-primary\\/80:hover{color:color-mix(in oklab,var(--primary) 80%,transparent)}}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:opacity-70:hover{opacity:.7}.hover\\:opacity-75:hover{opacity:.75}.hover\\:opacity-80:hover{opacity:.8}.hover\\:opacity-90:hover{opacity:.9}.hover\\:shadow-2xl:hover{--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,#00000040);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.group-data-\\[variant\\=ghost\\]\\/tool-group-root\\:hover\\:text-foreground:is(:where(.group\\/tool-group-root)[data-variant=ghost] *):hover{color:var(--foreground)}}.focus\\:border-\\[var\\(--secondary-color\\)\\]:focus{border-color:var(--secondary-color)}.focus\\:ring-2:focus{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus\\:ring-\\[var\\(--secondary-color\\)\\]:focus{--tw-ring-color:var(--secondary-color)}.focus\\:ring-blue-500:focus{--tw-ring-color:var(--color-blue-500)}.focus\\:ring-gray-500:focus{--tw-ring-color:var(--color-gray-500)}.focus\\:outline-none:focus{--tw-outline-style:none;outline-style:none}.focus-visible\\:ring-2:focus-visible{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-visible\\:ring-ring:focus-visible{--tw-ring-color:var(--ring)}.focus-visible\\:ring-offset-2:focus-visible{--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)}.focus-visible\\:outline-none:focus-visible{--tw-outline-style:none;outline-style:none}.active\\:scale-90:active{--tw-scale-x:90%;--tw-scale-y:90%;--tw-scale-z:90%;scale:var(--tw-scale-x) var(--tw-scale-y)}.active\\:scale-95:active{--tw-scale-x:95%;--tw-scale-y:95%;--tw-scale-z:95%;scale:var(--tw-scale-x) var(--tw-scale-y)}.active\\:scale-\\[0\\.98\\]:active{scale:.98}.disabled\\:pointer-events-none:disabled{pointer-events:none}.disabled\\:invisible:disabled{visibility:hidden}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}.data-\\[dragging\\=true\\]\\:border-dashed[data-dragging=true]{--tw-border-style:dashed;border-style:dashed}.data-\\[dragging\\=true\\]\\:border-ring[data-dragging=true]{border-color:var(--ring)}.data-\\[highlighted\\]\\:bg-accent[data-highlighted]{background-color:var(--accent)}.data-\\[state\\=closed\\]\\:pointer-events-none[data-state=closed]{pointer-events:none}.data-\\[state\\=closed\\]\\:animate-collapsible-up[data-state=closed]{animation:.2s ease-out collapsible-up}.data-\\[state\\=closed\\]\\:fill-mode-forwards[data-state=closed]{--tw-animation-fill-mode:forwards;animation-fill-mode:forwards}.data-\\[state\\=open\\]\\:animate-collapsible-down[data-state=open]{animation:.2s ease-out collapsible-down}@media (prefers-reduced-motion:reduce){.motion-reduce\\:animate-none{animation:none}.motion-reduce\\:transition-none{transition-property:none}}@media not all and (min-width:48rem){.max-md\\:aspect-video{aspect-ratio:var(--aspect-video)}.max-md\\:max-h-52{max-height:calc(var(--spacing) * 52)}.max-md\\:p-4{padding:calc(var(--spacing) * 4)}.max-md\\:px-4{padding-inline:calc(var(--spacing) * 4)}.max-md\\:text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}}@media (min-width:40rem){.sm\\:mt-0{margin-top:0}.sm\\:mr-4{margin-right:calc(var(--spacing) * 4)}.sm\\:mb-0{margin-bottom:0}.sm\\:flex{display:flex}.sm\\:inline{display:inline}.sm\\:max-w-3xl{max-width:var(--container-3xl)}.sm\\:basis-1\\/2{flex-basis:50%}.sm\\:basis-\\[45\\%\\]{flex-basis:45%}.sm\\:basis-\\[180px\\]{flex-basis:180px}.sm\\:grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.sm\\:grid-cols-\\[160px_1fr\\]{grid-template-columns:160px 1fr}.sm\\:flex-row{flex-direction:row}.sm\\:items-center{align-items:center}.sm\\:items-end{align-items:flex-end}.sm\\:items-start{align-items:flex-start}.sm\\:justify-between{justify-content:space-between}.sm\\:gap-3{gap:calc(var(--spacing) * 3)}.sm\\:p-6{padding:calc(var(--spacing) * 6)}.sm\\:px-6{padding-inline:calc(var(--spacing) * 6)}.sm\\:py-5{padding-block:calc(var(--spacing) * 5)}.sm\\:pl-0{padding-left:0}.sm\\:text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.sm\\:text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}}@media (min-width:48rem){.md\\:absolute{position:absolute}.md\\:top-6{top:calc(var(--spacing) * 6)}.md\\:right-4{right:calc(var(--spacing) * 4)}.md\\:right-5{right:calc(var(--spacing) * 5)}.md\\:left-5{left:calc(var(--spacing) * 5)}.md\\:mt-0{margin-top:0}.md\\:mb-8{margin-bottom:calc(var(--spacing) * 8)}.md\\:ml-4{margin-left:calc(var(--spacing) * 4)}.md\\:block{display:block}.md\\:flex{display:flex}.md\\:hidden{display:none}.md\\:inline{display:inline}.md\\:h-8{height:calc(var(--spacing) * 8)}.md\\:h-12{height:calc(var(--spacing) * 12)}.md\\:h-auto{height:auto}.md\\:max-h-80{max-height:calc(var(--spacing) * 80)}.md\\:min-h-\\[48px\\]{min-height:48px}.md\\:w-1\\/2{width:50%}.md\\:w-8{width:calc(var(--spacing) * 8)}.md\\:w-12{width:calc(var(--spacing) * 12)}.md\\:w-20{width:calc(var(--spacing) * 20)}.md\\:w-auto{width:auto}.md\\:min-w-\\[90px\\]{min-width:90px}.md\\:min-w-\\[150px\\]{min-width:150px}.md\\:flex-grow{flex-grow:1}.md\\:basis-1\\/3{flex-basis:33.3333%}.md\\:basis-\\[200px\\]{flex-basis:200px}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.md\\:flex-row{flex-direction:row}.md\\:flex-wrap{flex-wrap:wrap}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:gap-4{gap:calc(var(--spacing) * 4)}.md\\:gap-6{gap:calc(var(--spacing) * 6)}.md\\:gap-8{gap:calc(var(--spacing) * 8)}:where(.md\\:space-y-0>:not(:last-child)){--tw-space-y-reverse:0;margin-block:0}:where(.md\\:space-x-4>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing) * 4) * var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-x-reverse)))}.md\\:gap-y-8{row-gap:calc(var(--spacing) * 8)}.md\\:p-6{padding:calc(var(--spacing) * 6)}.md\\:px-4{padding-inline:calc(var(--spacing) * 4)}.md\\:px-6{padding-inline:calc(var(--spacing) * 6)}.md\\:px-8{padding-inline:calc(var(--spacing) * 8)}.md\\:py-2{padding-block:calc(var(--spacing) * 2)}.md\\:pt-\\[158px\\]{padding-top:158px}.md\\:pb-6{padding-bottom:calc(var(--spacing) * 6)}.md\\:text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.md\\:text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.md\\:text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.md\\:text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.md\\:text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.md\\:text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.md\\:font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}@media (hover:hover){.md\\:hover\\:scale-105:hover{--tw-scale-x:105%;--tw-scale-y:105%;--tw-scale-z:105%;scale:var(--tw-scale-x) var(--tw-scale-y)}.md\\:hover\\:bg-transparent:hover{background-color:#0000}}}@media (min-width:64rem){.lg\\:right-8{right:calc(var(--spacing) * 8)}.lg\\:left-8{left:calc(var(--spacing) * 8)}.lg\\:mt-0{margin-top:0}.lg\\:ml-2{margin-left:calc(var(--spacing) * 2)}.lg\\:\\!flex{display:flex!important}.lg\\:\\!hidden{display:none!important}.lg\\:block{display:block}.lg\\:flex{display:flex}.lg\\:hidden{display:none}.lg\\:w-1\\/3{width:33.3333%}.lg\\:w-2\\/3{width:66.6667%}.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.lg\\:grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}.lg\\:grid-cols-\\[minmax\\(0\\,1fr\\)_360px\\]{grid-template-columns:minmax(0,1fr) 360px}.lg\\:flex-row{flex-direction:row}.lg\\:gap-8{gap:calc(var(--spacing) * 8)}.lg\\:pr-6{padding-right:calc(var(--spacing) * 6)}}@media (min-width:80rem){.xl\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.xl\\:grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}.xl\\:grid-cols-6{grid-template-columns:repeat(6,minmax(0,1fr))}.xl\\:gap-4{gap:calc(var(--spacing) * 4)}}@media (min-width:96rem){.\\32xl\\:gap-6{gap:calc(var(--spacing) * 6)}}@media (prefers-color-scheme:dark){.dark\\:border-border{border-color:var(--border)}.dark\\:border-muted-foreground\\/15{border-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.dark\\:border-muted-foreground\\/15{border-color:color-mix(in oklab,var(--muted-foreground) 15%,transparent)}}.dark\\:bg-background{background-color:var(--background)}.dark\\:bg-destructive\\/5{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.dark\\:bg-destructive\\/5{background-color:color-mix(in oklab,var(--destructive) 5%,transparent)}}.dark\\:stroke-\\[2\\.5px\\]{stroke-width:2.5px}.dark\\:text-amber-400{color:var(--color-amber-400)}.dark\\:text-amber-500{color:var(--color-amber-500)}.dark\\:text-emerald-400{color:var(--color-emerald-400)}.dark\\:text-green-400{color:var(--color-green-400)}.dark\\:text-red-200{color:var(--color-red-200)}.dark\\:shadow-none{--tw-shadow:0 0 #0000;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.dark\\:focus-within\\:border-muted-foreground\\/30:focus-within{border-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.dark\\:focus-within\\:border-muted-foreground\\/30:focus-within{border-color:color-mix(in oklab,var(--muted-foreground) 30%,transparent)}}@media (hover:hover){.dark\\:hover\\:bg-accent:hover{background-color:var(--accent)}.dark\\:hover\\:bg-muted-foreground\\/30:hover{background-color:var(--muted-foreground)}@supports (color:color-mix(in lab,red,red)){.dark\\:hover\\:bg-muted-foreground\\/30:hover{background-color:color-mix(in oklab,var(--muted-foreground) 30%,transparent)}}}}.\\[\\&_svg\\]\\:text-background svg{color:var(--background)}.\\[\\&_svg\\]\\:text-black svg{color:var(--color-black)}@media (hover:hover){.hover\\:\\[\\&_svg\\]\\:text-destructive:hover svg{color:var(--destructive)}}.\\[\\[align\\=center\\]\\]\\:text-center[align=center]{text-align:center}.\\[\\[align\\=right\\]\\]\\:text-right[align=right]{text-align:right}.\\[\\&\\:last-child\\>td\\:first-child\\]\\:rounded-es-lg:last-child>td:first-child{border-end-start-radius:var(--radius)}.\\[\\&\\:last-child\\>td\\:last-child\\]\\:rounded-ee-lg:last-child>td:last-child{border-end-end-radius:var(--radius)}.\\[\\&\\>\\*\\]\\:col-start-2>*{grid-column-start:2}.\\[\\&\\>\\*\\]\\:animate-in>*{animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.\\[\\&\\>\\*\\]\\:duration-\\(--animation-duration\\)>*{--tw-duration:var(--animation-duration);transition-duration:var(--animation-duration)}.\\[\\&\\>\\*\\]\\:ease-\\[cubic-bezier\\(0\\.32\\,0\\.72\\,0\\,1\\)\\]>*{--tw-ease:cubic-bezier(.32,.72,0,1);transition-timing-function:cubic-bezier(.32,.72,0,1)}.\\[\\&\\>\\*\\]\\:fade-in-0>*{--tw-enter-opacity:0}.\\[\\&\\>\\*\\]\\:slide-in-from-top-1>*{--tw-enter-translate-y:calc(1*var(--spacing)*-1)}@media (prefers-reduced-motion:reduce){.\\[\\&\\>\\*\\]\\:motion-reduce\\:animate-none>*{animation:none}}.\\[\\&\\>a\\]\\:text-xs>a{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.\\[\\&\\>a\\]\\:no-underline>a{text-decoration-line:none}.\\[\\&\\>button\\]\\:rounded-full>button{border-radius:3.40282e38px}.\\[\\&\\>button\\]\\:bg-foreground\\/60>button{background-color:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.\\[\\&\\>button\\]\\:bg-foreground\\/60>button{background-color:color-mix(in oklab,var(--foreground) 60%,transparent)}}.\\[\\&\\>button\\]\\:p-1>button{padding:var(--spacing)}.\\[\\&\\>button\\]\\:opacity-100>button{opacity:1}.\\[\\&\\>button\\]\\:ring-0\\!>button{--tw-ring-shadow:var(--tw-ring-inset,) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color,currentcolor)!important;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)!important}@media (hover:hover){.\\[\\&\\>button\\]\\:hover\\:\\[\\&_svg\\]\\:text-destructive>button:hover svg{color:var(--destructive)}}.\\[\\&\\>li\\]\\:mt-1>li{margin-top:var(--spacing)}.\\[\\&\\>svg\\]\\:h-full>svg{height:100%}.\\[\\&\\>svg\\]\\:w-full>svg{width:100%}@property --tw-animation-delay{syntax:"*";inherits:false;initial-value:0s}@property --tw-animation-direction{syntax:"*";inherits:false;initial-value:normal}@property --tw-animation-duration{syntax:"*";inherits:false}@property --tw-animation-fill-mode{syntax:"*";inherits:false;initial-value:none}@property --tw-animation-iteration-count{syntax:"*";inherits:false;initial-value:1}@property --tw-enter-blur{syntax:"*";inherits:false;initial-value:0}@property --tw-enter-opacity{syntax:"*";inherits:false;initial-value:1}@property --tw-enter-rotate{syntax:"*";inherits:false;initial-value:0}@property --tw-enter-scale{syntax:"*";inherits:false;initial-value:1}@property --tw-enter-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-enter-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-blur{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-opacity{syntax:"*";inherits:false;initial-value:1}@property --tw-exit-rotate{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-scale{syntax:"*";inherits:false;initial-value:1}@property --tw-exit-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-translate-y{syntax:"*";inherits:false;initial-value:0}@keyframes aui-pulse{50%{opacity:.5}}:where(.aui-md[data-status=running]):empty:after,:where(.aui-md[data-status=running])>:where(:not(ol):not(ul):not(pre)):last-child:after,:where(.aui-md[data-status=running])>pre:last-child code:after,:where(.aui-md[data-status=running])>:where(:is(ol,ul):last-child)>:where(li:last-child:not(:has(*>li))):after,:where(.aui-md[data-status=running])>:where(:is(ol,ul):last-child)>:where(li:last-child)>:where(:is(ol,ul):last-child)>:where(li:last-child:not(:has(*>li))):after,:where(.aui-md[data-status=running])>:where(:is(ol,ul):last-child)>:where(li:last-child)>:where(:is(ol,ul):last-child)>:where(li:last-child)>:where(:is(ol,ul):last-child)>:where(li:last-child):after{--aui-content:"●";content:var(--aui-content);margin-left:.25rem;margin-right:.25rem;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;animation:2s cubic-bezier(.4,0,.6,1) infinite aui-pulse}@keyframes collapsible-down{0%{height:0}to{height:var(--radix-collapsible-content-height,var(--bits-collapsible-content-height,var(--reka-collapsible-content-height,var(--kb-collapsible-content-height,auto))))}}@keyframes collapsible-up{0%{height:var(--radix-collapsible-content-height,var(--bits-collapsible-content-height,var(--reka-collapsible-content-height,var(--kb-collapsible-content-height,auto))))}to{height:0}}.shimmer{color:#0000;background-image:linear-gradient(90deg,transparent 20%,var(--foreground) 50%,transparent 80%)}@supports (color:color-mix(in lab,red,red)){.shimmer{background-image:linear-gradient(90deg,transparent 20%,color-mix(in oklab,var(--foreground) 90%,transparent) 50%,transparent 80%)}}.shimmer{background-size:200% 100%;-webkit-background-clip:text;background-clip:text;animation:1.6s linear infinite ohx-shimmer}@keyframes ohx-shimmer{0%{background-position:200% 0}to{background-position:-200% 0}}.ohx-root{flex-direction:column;height:calc(100dvh - 8.5rem);min-height:24rem;display:flex}.ohx-root .aui-thread-root{flex:1;min-height:0}@property --tw-border-spacing-x{syntax:"<length>";inherits:false;initial-value:0}@property --tw-border-spacing-y{syntax:"<length>";inherits:false;initial-value:0}@property --tw-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-z{syntax:"*";inherits:false;initial-value:0}@property --tw-scale-x{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-y{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-z{syntax:"*";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-pan-x{syntax:"*";inherits:false}@property --tw-pan-y{syntax:"*";inherits:false}@property --tw-pinch-zoom{syntax:"*";inherits:false}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-space-x-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-divide-x-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-divide-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-leading{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@property --tw-ordinal{syntax:"*";inherits:false}@property --tw-slashed-zero{syntax:"*";inherits:false}@property --tw-numeric-figure{syntax:"*";inherits:false}@property --tw-numeric-spacing{syntax:"*";inherits:false}@property --tw-numeric-fraction{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.5}}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0)scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1))rotate(var(--tw-enter-rotate,0));filter:blur(var(--tw-enter-blur,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0)scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1))rotate(var(--tw-exit-rotate,0));filter:blur(var(--tw-exit-blur,0))}}
`, NR = window.UIComponents.Button, ec = window.UIComponents.Badge, zR = window.UIComponents.Tooltip, OR = window.UIComponents.TooltipContent, LR = window.UIComponents.TooltipProvider, $R = window.UIComponents.TooltipTrigger, tc = "openharness-agent-styles", BR = 3 * 60 * 1e3;
function FR() {
  It(() => {
    if (document.getElementById(tc))
      return;
    const t = document.createElement("style");
    t.id = tc, t.textContent = DR, document.head.appendChild(t);
  }, []);
}
const Qr = (t) => !Number.isFinite(t) || t <= 0 ? "0" : t >= 1e3 ? `${(t / 1e3).toFixed(t >= 1e4 ? 0 : 1)}k` : String(Math.round(t)), rc = (t) => !Number.isFinite(t) || !t || t <= 0 ? "ctx unknown" : `${Qr(t)} ctx`, UR = (t) => (t.split("/").pop() ?? t).split(":")[0], jR = ({ used: t, window: e }) => {
  const r = e > 0 ? Math.min(t / e, 1) : 0, n = r > 0.85 ? "bg-destructive" : r > 0.6 ? "bg-amber-500" : "bg-primary";
  return /* @__PURE__ */ m(LR, { delayDuration: 200, children: /* @__PURE__ */ V(zR, { children: [
    /* @__PURE__ */ m($R, { asChild: !0, children: /* @__PURE__ */ V("div", { className: "flex min-w-36 items-center gap-2", "aria-label": "Context usage", children: [
      /* @__PURE__ */ m("div", { className: "bg-muted h-1.5 w-24 overflow-hidden rounded-full", children: /* @__PURE__ */ m(
        "div",
        {
          className: K("h-full rounded-full transition-[width] duration-500", n),
          style: { width: `${Math.max(r * 100, t > 0 ? 2 : 0)}%` }
        }
      ) }),
      /* @__PURE__ */ V("span", { className: "text-muted-foreground text-xs whitespace-nowrap tabular-nums", children: [
        Qr(t),
        " / ",
        Qr(e)
      ] })
    ] }) }),
    /* @__PURE__ */ V(OR, { side: "bottom", children: [
      "Context: ",
      t.toLocaleString(),
      " of ",
      e.toLocaleString(),
      " tokens (",
      Math.round(r * 100),
      "%)"
    ] })
  ] }) });
}, VR = () => (qr("composer.attachmentAddError", ({ reason: t, message: e }) => {
  var i;
  const r = (i = window.sonner) == null ? void 0 : i.toast, n = t === "not-accepted" ? "This file type is not supported." : e || "Attachment failed.";
  r != null && r.error ? r.error(n) : console.warn("[openharness-ui]", n);
}), null), qR = ({ getMeta: t, onUsage: e, onRunEnd: r, onNewChat: n, onCompact: i }) => {
  const o = kt(
    () => RR({ onUsage: e, onRunEnd: r }),
    [e, r]
  ), s = kt(() => new MR(t), [t]), a = e0(o, { adapters: { attachments: s } }), l = $e(!1);
  return It(() => {
    l.current || (l.current = !0, CR().then((c) => {
      const d = ER(c);
      d.length && a.thread.reset(d);
    }).catch(() => {
    }));
  }, [a]), /* @__PURE__ */ V(c0, { runtime: a, children: [
    /* @__PURE__ */ m(VR, {}),
    /* @__PURE__ */ m(uR, { onNewChat: n, onCompact: i })
  ] });
};
function GR() {
  FR();
  const [t, e] = Ce(null), [r, n] = Ce(null), [i, o] = Ce(null), [s, a] = Ce(0), [l, c] = Ce(!1), [d, u] = Ce(!1), h = $e(0), p = $e(null);
  p.current = t;
  const f = Xe(() => p.current, []), g = Xe(() => {
    h.current = Date.now(), kR().then((P) => {
      e(P), n(null);
    }).catch((P) => n((P == null ? void 0 : P.message) || "Failed to load agent info"));
  }, []);
  It(() => {
    g();
  }, [g]);
  const v = Xe(() => {
    Date.now() - h.current < BR || g();
  }, [g]), b = Xe((P) => o(P), []), _ = Xe(() => g(), [g]), k = Xe(async () => {
    var P;
    if (!l) {
      c(!0);
      try {
        await _R(), o(null), a((x) => x + 1), g();
      } catch (x) {
        const T = (P = window.sonner) == null ? void 0 : P.toast;
        T != null && T.error && T.error((x == null ? void 0 : x.message) || "Failed to reset the session");
      } finally {
        c(!1);
      }
    }
  }, [l, g]), I = $e(!1), E = Xe(async () => {
    var x;
    if (I.current)
      return;
    I.current = !0;
    const P = (x = window.sonner) == null ? void 0 : x.toast;
    try {
      const T = await TR();
      o(null), g();
      const D = T.compacted ? `Context compacted: ${Qr(T.tokensBefore ?? 0)} → ${Qr(T.tokensAfter ?? 0)} tokens` : "Nothing to compact yet.";
      P != null && P.success ? P.success(D) : console.info("[openharness-ui]", D);
    } catch (T) {
      const D = (T == null ? void 0 : T.message) || "Compaction failed";
      P != null && P.error ? P.error(D) : console.warn("[openharness-ui]", D);
    } finally {
      I.current = !1;
    }
  }, [g]), y = Xe(async (P) => {
    var T, D;
    const x = P.target.value;
    if (!(!x || d || x === ((T = p.current) == null ? void 0 : T.model))) {
      u(!0);
      try {
        const N = await SR(x);
        e(N), n(null), o(null), a((O) => O + 1);
      } catch (N) {
        const O = (D = window.sonner) == null ? void 0 : D.toast, L = (N == null ? void 0 : N.message) || "Failed to switch the model";
        O != null && O.error ? O.error(L) : n(L);
      } finally {
        u(!1);
      }
    }
  }, []), M = i ? (i.inputTokens ?? 0) + (i.outputTokens ?? 0) : (t == null ? void 0 : t.contextTokens) ?? 0, R = (t == null ? void 0 : t.availableModels.find((P) => P.id === t.model)) ?? null;
  return /* @__PURE__ */ V("div", { className: "aui-root ohx-root bg-background text-foreground", children: [
    /* @__PURE__ */ V("header", { className: "border-border/60 flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5", children: [
      /* @__PURE__ */ V("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ m(ph, { className: "text-muted-foreground size-5" }),
        /* @__PURE__ */ m("span", { className: "text-sm font-semibold", children: "RestoApp Assistant" })
      ] }),
      t && /* @__PURE__ */ m(ec, { variant: "outline", className: "max-w-64 font-mono text-xs", title: t.model, children: /* @__PURE__ */ m("span", { className: "truncate", children: UR(t.model) }) }),
      R && /* @__PURE__ */ V(ec, { variant: "secondary", className: "text-xs", children: [
        rc(R.contextWindow),
        R.vision ? " · vision" : ""
      ] }),
      t && /* @__PURE__ */ V("label", { className: "flex items-center gap-2 text-xs", children: [
        /* @__PURE__ */ m("span", { className: "text-muted-foreground whitespace-nowrap", children: "Model" }),
        /* @__PURE__ */ m(
          "select",
          {
            value: t.model,
            onChange: y,
            onMouseDown: v,
            onFocus: v,
            disabled: d || l,
            className: "border-input bg-background text-foreground h-8 min-w-48 rounded-md border px-2 text-xs",
            "aria-label": "Select model",
            children: t.availableModels.map((P) => /* @__PURE__ */ V("option", { value: P.id, children: [
              P.id,
              " · ",
              rc(P.contextWindow),
              P.vision ? " · vision" : ""
            ] }, P.id))
          }
        )
      ] }),
      /* @__PURE__ */ V("div", { className: "ms-auto flex items-center gap-4", children: [
        t && /* @__PURE__ */ m(jR, { used: M, window: t.contextWindow }),
        t && t.turns > 0 && /* @__PURE__ */ V("span", { className: "text-muted-foreground hidden text-xs sm:inline", children: [
          t.turns,
          " ",
          t.turns === 1 ? "turn" : "turns"
        ] }),
        /* @__PURE__ */ V(
          NR,
          {
            variant: "outline",
            size: "sm",
            onClick: k,
            disabled: l || d,
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ m(Yk, { className: K("size-3.5", l && "animate-spin") }),
              "New chat"
            ]
          }
        )
      ] }),
      r && /* @__PURE__ */ m("span", { className: "text-destructive w-full text-xs", children: r })
    ] }),
    /* @__PURE__ */ m(
      qR,
      {
        getMeta: f,
        onUsage: b,
        onRunEnd: _,
        onNewChat: k,
        onCompact: E
      },
      s
    )
  ] });
}
export {
  GR as default
};
