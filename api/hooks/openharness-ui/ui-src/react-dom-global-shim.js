// ESM facade over the admin panel's window.ReactDOM (see react-global-shim.js).
const ReactDOM = window.ReactDOM;

export default ReactDOM;

export const {
  createPortal,
  findDOMNode,
  flushSync,
  hydrate,
  render,
  unmountComponentAtNode,
  unstable_batchedUpdates,
  version,
} = ReactDOM;

export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED =
  ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
