const REACT_ELEMENT_TYPE = Symbol.for('react.transitional.element');

function createElement(type, props, ...children) {
  const react = typeof window !== 'undefined' ? window.React : undefined;
  if (react && typeof react.createElement === 'function') {
    return react.createElement(type, props, ...children);
  }

  const nextProps = { ...(props || {}) };
  const key = nextProps.key != null ? String(nextProps.key) : null;
  if (Object.prototype.hasOwnProperty.call(nextProps, 'key')) {
    delete nextProps.key;
  }

  if (children.length === 1) {
    nextProps.children = children[0];
  } else if (children.length > 1) {
    nextProps.children = children;
  }

  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref: null,
    props: nextProps,
    _owner: null,
  };
}

const styles = {
  page: {
    maxWidth: '880px',
    margin: '0 auto',
    color: 'var(--foreground)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    margin: '0 0 8px',
    color: 'var(--foreground)',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--muted-foreground)',
    margin: '0 0 18px',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    border: '1px solid var(--border)',
    borderRadius: '10px',
    overflow: 'hidden',
    background: 'var(--card)',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 14px',
    borderBottom: '1px solid var(--border)',
    fontSize: '14px',
    background: 'var(--card)',
  },
  rowName: {
    fontWeight: 600,
    color: 'var(--foreground)',
  },
  rowNameLink: {
    color: 'inherit',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  rowVersion: {
    color: 'var(--muted-foreground)',
    whiteSpace: 'nowrap',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  empty: {
    fontSize: '14px',
    color: 'var(--muted-foreground)',
    padding: '12px 0',
  },
};

export default function ModulesVersions(props) {
  const modules = Array.isArray(props?.data?.modules) ? props.data.modules : [];
  const translations = props?.data?.translations || {};
  const marketplaceBaseUrl = 'https://marketplace.restoapp.org/catalog/module/';

  const rows = modules.map((item, index) => {
    const name = item?.name || item?.appId || translations.unknown || '';
    const appId = item?.appId || '';
    const version = item?.version || translations.unknown || '';
    const marketplaceLink = appId ? `${marketplaceBaseUrl}${encodeURIComponent(appId)}` : '';

    const nameNode = marketplaceLink
      ? createElement(
          'a',
          {
            href: marketplaceLink,
            target: '_blank',
            rel: 'noopener noreferrer',
            style: styles.rowNameLink,
            title: marketplaceLink,
          },
          name
        )
      : name;

    return createElement(
      'li',
      { key: `${name}-${index}`, style: { ...styles.row, borderBottom: index === modules.length - 1 ? 'none' : styles.row.borderBottom } },
      createElement('span', { style: styles.rowName }, nameNode),
      createElement('span', { style: styles.rowVersion }, `v${version}`)
    );
  });

  return createElement(
    'div',
    { style: styles.page },
    createElement('h1', { style: styles.title }, translations.title || ''),
    createElement('p', { style: styles.subtitle }, translations.subtitle || ''),
    modules.length
      ? createElement('ul', { style: styles.list }, ...rows)
      : createElement('p', { style: styles.empty }, translations.empty || '')
  );
}
