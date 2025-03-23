import React, { createContext, useContext, useState } from 'react';

// Create a context for the tabs
const TabsContext = createContext();

export const Tabs = ({ children, value, onValueChange, className }) => {
  const [activeTab, setActiveTab] = useState(value || '');

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, onChange: handleTabChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabList = ({ children, className }) => {
  return (
    <div className={className} role="tablist">
      {children}
    </div>
  );
};

export const Tab = ({ children, value, className, disabled }) => {
  const { activeTab, onChange } = useContext(TabsContext);
  const isActive = activeTab === value;

  const handleClick = () => {
    if (!disabled) {
      onChange(value);
    }
  };

  // Determine the state class based on active/disabled status
  const stateClass = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : isActive 
      ? 'data-[state=active]' 
      : '';

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      disabled={disabled}
      onClick={handleClick}
      className={`${className} ${stateClass}`}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
    </button>
  );
};

export const TabPanel = ({ children, value, className }) => {
  const { activeTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  if (!isActive) {
    return null;
  }

  return (
    <div 
      role="tabpanel" 
      id={`panel-${value}`}
      className={className}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
    </div>
  );
};
