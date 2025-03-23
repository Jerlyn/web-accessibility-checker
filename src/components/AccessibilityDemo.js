import React, { useState } from 'react';
import './AccessibilityChecker.css';

/**
 * This component demonstrates how the Accessibility Checker looks with pre-loaded results
 * It's useful for showcasing the UI without needing to analyze real code
 */
const AccessibilityDemo = () => {
  const [activeTab, setActiveTab] = useState('results');
  const [copied, setCopied] = useState(false);

  // Demo data - sample issues and fixes
  const demoResults = {
    issues: [
      {
        title: 'Missing alt text for image',
        severity: 'critical',
        wcagReference: '1.1.1 Non-text Content (Level A)',
        description: 'Image elements must have an alt attribute that describes the image content or its purpose.',
        impact: 'Screen reader users will not know what information the image conveys.',
        position: { line: 7, column: 3 },
        codeSnippet: '<img src="logo.png">',
        fixExample: '<img src="logo.png" alt="Company Logo">',
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#non-text-content',
      },
      {
        title: 'Form control without label',
        severity: 'critical',
        wcagReference: '1.3.1 Info and Relationships, 3.3.2 Labels or Instructions (Level A)',
        description: 'This input element doesn\'t have a properly associated label.',
        impact: 'Screen reader users will not know the purpose of this form control, making it difficult or impossible to complete the form.',
        position: { line: 12, column: 5 },
        codeSnippet: '<input type="text" name="username">',
        fixExample: '<label for="username">Username:</label>\n<input type="text" name="username" id="username">',
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#info-and-relationships',
      },
      {
        title: 'Ambiguous link text',
        severity: 'warning',
        wcagReference: '2.4.4 Link Purpose (In Context) (Level A), 2.4.9 Link Purpose (Link Only) (Level AAA)',
        description: 'Link text "click here" doesn\'t clearly indicate its purpose or destination.',
        impact: 'Screen reader users often navigate by links, and ambiguous link text makes it difficult to understand where links lead.',
        position: { line: 16, column: 36 },
        codeSnippet: '<p>To learn about our services, <a href="services.html">click here</a>.</p>',
        fixExample: '<p>Learn more about our <a href="services.html">comprehensive service offerings</a>.</p>',
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#link-purpose-in-context',
      },
    ],
    fixedCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Accessibility Example</title>
</head>
<body>
  <h1>Welcome to Our Website</h1>
  
  <!-- Fixed: Added alt attribute -->
  <img src="logo.png" alt="Company Logo">
  
  <form>
    <div>
      <!-- Fixed: Added label with for attribute -->
      <label for="username">Username:</label>
      <input type="text" name="username" id="username">
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" name="password" id="password">
    </div>
    <div>
      <button type="submit">Login</button>
    </div>
  </form>
  
  <!-- Fixed: Made link text descriptive -->
  <p>Learn more about our <a href="services.html">comprehensive service offerings</a>.</p>
</body>
</html>`
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(demoResults.fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Simple implementation of icons using emoji with additional classes for styling
  const Icon = ({ type, className = '' }) => {
    const getIcon = () => {
      switch (type) {
        case 'clipboard':
          return '📋';
        case 'check':
          return '✓';
        case 'warning':
          return '⚠️';
        case 'error':
          return '❌';
        case 'info':
          return 'ℹ️';
        case 'external-link':
          return '↗️';
        default:
          return null;
      }
    };

    return <span className={`icon ${className}`} role="img" aria-hidden="true">{getIcon()}</span>;
  };

  const getIssueCount = (severity) => {
    return demoResults.issues.filter(i => i.severity === severity).length;
  };

  // Card component for displaying issue details
  const IssueCard = ({ issue }) => (
    <div className={`card card-${issue.severity} slide-in`}>
      <div className="card-header">
        <div className={`card-icon ${issue.severity}`}>
          <Icon type={issue.severity === 'critical' ? 'error' : issue.severity === 'warning' ? 'warning' : 'info'} />
        </div>
        <div>
          <h3 className="card-title">{issue.title}</h3>
          <div className="card-subtitle">
            Line {issue.position.line}, Column {issue.position.column} | WCAG: {issue.wcagReference}
          </div>
        </div>
      </div>
      <div className="card-content">
        <div className="form-group">
          <div className="section-label">Issue:</div>
          <p>{issue.description}</p>
        </div>
        
        <div className="form-group">
          <div className="section-label">Why it matters:</div>
          <p>{issue.impact}</p>
        </div>

        <div className="form-group">
          <div className="section-label">Current code:</div>
          <pre className="code-snippet">
            <code>{issue.codeSnippet}</code>
          </pre>
        </div>

        <div className="form-group">
          <div className="section-label">Suggested fix:</div>
          <pre className="code-snippet">
            <code>{issue.fixExample}</code>
          </pre>
        </div>
      </div>
      <div className="card-footer">
        <a 
          href={issue.learnMoreUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="link link-with-icon"
        >
          Learn more <span className="link-icon"><Icon type="external-link" /></span>
        </a>
      </div>
    </div>
  );

  return (
    <div className="accessibility-checker">
      <header className="app-header">
        <h1 className="app-title">Web Accessibility Checker</h1>
        <p className="app-description">
          Identify and fix common accessibility issues in your HTML code to ensure your websites are usable by everyone.
        </p>
      </header>

      <div className="tab-container">
        <div className="tab-list" role="tablist">
          <button
            className="tab"
            role="tab"
            aria-selected={activeTab === 'input'}
            onClick={() => handleTabChange('input')}
            data-state={activeTab === 'input' ? 'active' : ''}
          >
            Input Code
          </button>
          <button
            className="tab"
            role="tab"
            aria-selected={activeTab === 'results'}
            onClick={() => handleTabChange('results')}
            data-state={activeTab === 'results' ? 'active' : ''}
          >
            Results
            <span className="tab-badge">{demoResults.issues.length}</span>
          </button>
          <button
            className="tab"
            role="tab"
            aria-selected={activeTab === 'fixed'}
            onClick={() => handleTabChange('fixed')}
            data-state={activeTab === 'fixed' ? 'active' : ''}
          >
            Fixed Code
          </button>
        </div>

        {activeTab === 'input' && (
          <div className="tab-panel fade-in" role="tabpanel">
            <div className="form-group">
              <label htmlFor="code-input" className="form-label">Paste your HTML code:</label>
              <textarea
                id="code-input"
                className="form-control"
                placeholder="<div>Paste your HTML code here</div>"
                defaultValue={`<!DOCTYPE html>
<html>
<head>
  <title>Accessibility Example</title>
</head>
<body>
  <h1>Welcome to Our Website</h1>
  
  <!-- Missing alt attribute -->
  <img src="logo.png">
  
  <form>
    <div>
      <!-- Missing label -->
      <input type="text" name="username">
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" name="password" id="password">
    </div>
    <div>
      <button type="submit">Login</button>
    </div>
  </form>
  
  <!-- Ambiguous link text -->
  <p>To learn about our services, <a href="services.html">click here</a>.</p>
</body>
</html>`}
              />
            </div>
            
            <button className="btn btn-primary">
              Analyze Accessibility
            </button>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="tab-panel fade-in" role="tabpanel">
            <div className="results-header">
              <h2 className="results-title">Analysis Results</h2>
              <div className="results-summary">
                <div className="summary-item">
                  <span className="summary-icon card-icon critical">
                    <Icon type="error" />
                  </span>
                  Critical: {getIssueCount('critical')}
                </div>
                <div className="summary-item">
                  <span className="summary-icon card-icon warning">
                    <Icon type="warning" />
                  </span>
                  Warning: {getIssueCount('warning')}
                </div>
                <div className="summary-item">
                  <span className="summary-icon card-icon info">
                    <Icon type="info" />
                  </span>
                  Info: {getIssueCount('info')}
                </div>
              </div>
            </div>

            <div className="alert alert-warning">
              <div className="alert-icon">
                <Icon type="warning" />
              </div>
              <div>
                <div className="alert-title">We found {demoResults.issues.length} accessibility issues</div>
                <div className="alert-message">
                  Review the issues below and see our suggested fixes.
                </div>
              </div>
            </div>

            <div className="issue-list">
              {demoResults.issues.map((issue, index) => (
                <IssueCard key={index} issue={issue} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fixed' && (
          <div className="tab-panel fade-in" role="tabpanel">
            <div className="fixed-code-header">
              <h2 className="results-title">Fixed Code</h2>
              <button 
                className="btn btn-secondary"
                onClick={handleCopyToClipboard}
              >
                {copied ? (
                  <span className="copy-feedback">
                    <Icon type="check" /> Copied to clipboard!
                  </span>
                ) : (
                  <>
                    <span className="btn-icon"><Icon type="clipboard" /></span> Copy Code
                  </>
                )}
              </button>
            </div>
            <pre className="code-snippet">
              <code>{demoResults.fixedCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityDemo;