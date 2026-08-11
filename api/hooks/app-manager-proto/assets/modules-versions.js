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
  headerActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' },
  simpleButton: {
    display: 'inline-block', border: '1px solid var(--border)', borderRadius: '6px', padding: '7px 11px',
    background: 'var(--primary)', color: 'var(--primary-foreground)', textDecoration: 'none', cursor: 'pointer'
  },
  secondaryButton: {
    display: 'inline-block', marginBottom: '16px', color: 'var(--foreground)', textDecoration: 'underline'
  },
  catalogDescription: { color: 'var(--muted-foreground)', fontSize: '13px', marginTop: '4px' },
  catalogMeta: { color: 'var(--muted-foreground)', fontSize: '11px', marginTop: '4px' },
  subtitleLink: { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' },
  filters: { display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: '10px', marginBottom: '18px' },
  filterField: { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--muted-foreground)' },
  filterInput: { minWidth: '170px', padding: '7px 8px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--card)', color: 'var(--foreground)' },
  restartNotice: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
    padding: '12px 14px', marginBottom: '18px', border: '1px solid #f0c36d', borderRadius: '8px',
    background: '#fff8e6', color: '#533f03', fontSize: '14px'
  },
  restartButton: {
    border: '1px solid #533f03', borderRadius: '6px', padding: '6px 10px',
    background: '#533f03', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap'
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
  rowActions: { display: 'flex', alignItems: 'center', gap: '12px' },
  updateInfo: { color: 'var(--muted-foreground)', fontSize: '12px' },
  updateButton: {
    border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 10px',
    background: 'var(--primary)', color: 'var(--primary-foreground)', cursor: 'pointer'
  },
  removeButton: {
    border: '1px solid var(--destructive, #b3261e)', borderRadius: '6px', padding: '6px 10px',
    background: 'transparent', color: 'var(--destructive, #b3261e)', cursor: 'pointer'
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
  const updateUrl = props?.updateUrl || '';
  const removeUrl = props?.removeUrl || '';
  const catalogUrl = props?.catalogUrl || '';
  const versionsUrl = props?.versionsUrl || '';
  const restartUrl = props?.restartUrl || '';
  const react = typeof window !== 'undefined' ? window.React : undefined;
  const state = react?.useState ? react.useState({}) : [{}, () => {}];
  const statuses = state[0];
  const setStatuses = state[1];
  const restartState = react?.useState ? react.useState(Boolean(props?.restartNotice?.scheduled)) : [false, () => {}];
  const restartScheduled = restartState[0];
  const setRestartScheduled = restartState[1];

  const restartNow = async () => {
    setStatuses((current) => ({ ...current, restart: 'restarting' }));
    try {
      const response = await fetch(restartUrl, { credentials: 'same-origin' });
      if (!response.ok) throw new Error(await response.text());
      setTimeout(() => window.location.reload(), 5000);
    } catch (error) {
      console.error(error);
      setStatuses((current) => ({ ...current, restart: 'failed' }));
    }
  };

  const restartBanner = restartScheduled && createElement(
    'div', { style: styles.restartNotice, role: 'status' },
    createElement('span', null, translations.restartScheduled || 'Restart is scheduled for 00:00 server time.'),
    createElement('button', { type: 'button', style: styles.restartButton, onClick: restartNow, disabled: statuses.restart === 'restarting' },
      statuses.restart === 'restarting' ? translations.restartingNow :
        statuses.restart === 'failed' ? translations.restartFailed : translations.restartNow)
  );

  const updateModule = async (appId) => {
    setStatuses((current) => ({ ...current, [appId]: 'updating' }));
    try {
      const response = await fetch(`${updateUrl}?appId=${encodeURIComponent(appId)}`, { credentials: 'same-origin' });
      const output = await response.text();
      if (!response.ok) throw new Error(output || `HTTP ${response.status}`);
      setStatuses((current) => ({ ...current, [appId]: 'done' }));
      setRestartScheduled(true);
    } catch (error) {
      console.error(error);
      setStatuses((current) => ({ ...current, [appId]: 'failed' }));
    }
  };

  const removeModule = async (appId, name) => {
    const confirmText = (translations.removeConfirm || 'Remove module {{name}}?').replace('{{name}}', name || appId);
    if (typeof window !== 'undefined' && !window.confirm(confirmText)) return;

    setStatuses((current) => ({ ...current, [appId]: 'removing' }));
    try {
      const response = await fetch(`${removeUrl}?appId=${encodeURIComponent(appId)}`, { credentials: 'same-origin' });
      const output = await response.text();
      if (!response.ok) throw new Error(output || `HTTP ${response.status}`);
      setStatuses((current) => ({ ...current, [appId]: 'removed' }));
      setRestartScheduled(true);
    } catch (error) {
      console.error(error);
      setStatuses((current) => ({ ...current, [appId]: 'removeFailed' }));
    }
  };

  const installModule = async (appId) => {
    setStatuses((current) => ({ ...current, [appId]: 'installing' }));
    try {
      const response = await fetch(`${updateUrl}?action=install&appId=${encodeURIComponent(appId)}`, { credentials: 'same-origin' });
      const output = await response.text();
      if (!response.ok) throw new Error(output || `HTTP ${response.status}`);
      setStatuses((current) => ({ ...current, [appId]: 'done' }));
      setRestartScheduled(true);
    } catch (error) {
      console.error(error);
      setStatuses((current) => ({ ...current, [appId]: 'failed' }));
    }
  };

  if (props?.data?.view === 'catalog') {
    const catalog = Array.isArray(props.data.catalog) ? props.data.catalog : [];
    const filters = props.data.filters || {};
    const catalogRows = catalog.map((item, index) => createElement(
      'li',
      { key: item.appId, style: { ...styles.row, borderBottom: index === catalog.length - 1 ? 'none' : styles.row.borderBottom } },
      createElement('span', null,
        createElement('span', { style: styles.rowName }, item.name),
        item.teaser && createElement('div', { style: styles.catalogDescription }, item.teaser),
        Boolean(item.group || item.tags?.length) && createElement(
          'div', { style: styles.catalogMeta },
          [item.group, ...(item.tags || []).map((tag) => `#${tag}`)].filter(Boolean).join(' · ')
        )
      ),
      createElement('span', { style: styles.rowActions },
        item.latestVersion && createElement('span', { style: styles.rowVersion }, `v${item.latestVersion}`),
        createElement('button', {
          type: 'button', style: styles.updateButton,
          disabled: !item.canInstall || statuses[item.appId] === 'installing' || statuses[item.appId] === 'done',
          onClick: () => installModule(item.appId)
        }, !item.canInstall ? translations.unavailable :
          statuses[item.appId] === 'installing' ? translations.installing :
            statuses[item.appId] === 'done' ? translations.installed :
              statuses[item.appId] === 'failed' ? translations.installFailed : translations.install)
      )
    ));

    return createElement('div', { style: styles.page },
      restartBanner,
      createElement('a', { href: versionsUrl, style: styles.secondaryButton }, translations.back || ''),
      createElement('h1', { style: styles.title }, translations.catalogTitle || ''),
      createElement('p', { style: styles.subtitle },
        createElement('a', {
          href: 'https://marketplace.restoapp.org/', target: '_blank', rel: 'noopener noreferrer', style: styles.subtitleLink
        }, translations.catalogSubtitle || '')
      ),
      createElement('form', { method: 'get', action: catalogUrl || versionsUrl.replace(/\/versions\/?$/, '/catalog'), style: styles.filters },
        createElement('label', { style: styles.filterField }, translations.search || 'Search',
          createElement('input', { name: 'search', defaultValue: filters.search || '', placeholder: translations.searchPlaceholder || '', style: styles.filterInput })
        ),
        createElement('label', { style: styles.filterField }, translations.group || 'Group',
          createElement('select', { name: 'group', defaultValue: filters.group || '', style: styles.filterInput },
            createElement('option', { value: '' }, translations.allGroups || 'All groups'),
            ...(filters.availableGroups || []).map((value) => createElement('option', { key: value, value }, value))
          )
        ),
        createElement('label', { style: styles.filterField }, translations.tags || 'Tags',
          createElement('input', { name: 'tags', defaultValue: filters.tags || '', list: 'marketplace-module-tags', placeholder: translations.tagsPlaceholder || '', style: styles.filterInput }),
          createElement('datalist', { id: 'marketplace-module-tags' },
            ...(filters.availableTags || []).map((value) => createElement('option', { key: value, value }))
          )
        ),
        createElement('button', { type: 'submit', style: styles.updateButton }, translations.applyFilters || 'Apply filters')
      ),
      props.data.catalogError
        ? createElement('p', { style: styles.empty }, props.data.catalogError)
        : catalog.length
          ? createElement('ul', { style: styles.list }, ...catalogRows)
          : createElement('p', { style: styles.empty }, translations.emptyCatalog || '')
    );
  }

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
      createElement(
        'span', { style: styles.rowActions },
        item?.updateAvailable && createElement(
          'span', { style: styles.updateInfo },
          (translations.available || 'Version {{version}} is available').replace('{{version}}', item.latestVersion)
        ),
        createElement('span', { style: styles.rowVersion }, `v${version}`),
        item?.updateAvailable && createElement(
          'button',
          {
            type: 'button', style: styles.updateButton,
            disabled: statuses[appId] === 'updating' || statuses[appId] === 'done',
            onClick: () => updateModule(appId)
          },
          statuses[appId] === 'updating' ? translations.updating :
            statuses[appId] === 'done' ? translations.updated :
              statuses[appId] === 'failed' ? translations.updateFailed : translations.update
        ),
        item?.canRemove && removeUrl && createElement(
          'button',
          {
            type: 'button', style: styles.removeButton,
            disabled: statuses[appId] === 'removing' || statuses[appId] === 'removed',
            onClick: () => removeModule(appId, name)
          },
          statuses[appId] === 'removing' ? translations.removing :
            statuses[appId] === 'removed' ? translations.removed :
              statuses[appId] === 'removeFailed' ? translations.removeFailed : translations.remove
        )
      )
    );
  });

  return createElement(
    'div',
    { style: styles.page },
    restartBanner,
    createElement('div', { style: styles.headerActions },
      createElement('h1', { style: styles.title }, translations.title || ''),
      createElement('a', { href: catalogUrl, style: styles.simpleButton }, translations.addModule || 'Add module')
    ),
    createElement('p', { style: styles.subtitle }, translations.subtitle || ''),
    modules.length
      ? createElement('ul', { style: styles.list }, ...rows)
      : createElement('p', { style: styles.empty }, translations.empty || '')
  );
}
