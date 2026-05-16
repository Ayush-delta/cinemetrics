import React from 'react';

/**
 * @param {{
 *   tabs: Array<{ id: string, label: string }>,
 *   activeTab: string,
 *   onChange: (id: string) => void,
 *   className?: string
 * }} props
 */
const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`tab-bar flex-wrap ${className}`} role="tablist">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          role="tab"
          aria-selected={activeTab === id}
          onClick={() => onChange(id)}
          className={`tab-item ${activeTab === id ? 'active' : ''}`}
          id={`tab-${id}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
