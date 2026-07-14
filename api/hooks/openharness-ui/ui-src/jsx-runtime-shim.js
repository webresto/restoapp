// The admin panel provides React as a window global without the jsx-runtime
// entry point, so the automatic JSX runtime is emulated via createElement.
import * as React from 'react';

export const Fragment = React.Fragment;

function create(type, props, key) {
  if (key !== undefined) return React.createElement(type, { ...props, key });
  return React.createElement(type, props);
}

export const jsx = create;
export const jsxs = create;
export const jsxDEV = create;
