import React, { useState } from 'react';
import './AccessibilityChecker.css';
import { analyzeAccessibility } from '../engine/accessibilityEngine';

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
      case 'loading':
        return '⟳';
      case 'success':
        return '✅';
      case 'help':
        return '?';
      case 'accessibility':
        return '♿';
      default:
        return null;
    }
  };

  return <span className={`icon ${className}`} role="img" aria-hidden="true">{getIcon()}</span>;
};

const AccessibilityChecker = () => {
  const [inputCode, setInputCode] = useState('');
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [fixedCode, setFixedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = () => {
    if (!inputCode.trim()) return;
    
    setLoading(true);
    setError(null);
    
    // Simulate analysis delay
    setTimeout(() => {
      try {
        const analysisResults = analyzeAccessibility(inputCode);
        setResults(analysisResults);
        setFixedCode(analysisResults.fixedCode);
        setActiveTab('results');
        setLoading(false);
      } catch (err) {
        setError('Error analyzing code. Please check your HTML syntax and try again.');
        setLoading(false);
      }
    }, 1200); // Simulated delay for better UX
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (tab) => {
    if ((tab === 'results' || tab === 'fixed') && !results) {
      return; // Don't switch to results or fixed tab if no results
    }
    setActiveTab(tab);
  };

  const getIssueCount = (severity) => {
    if (!results) return 0;
    return results.issues.filter(i => i.severity === severity).length;
  };

  const getTotalIssueCount = () => {
    if (!results) return 0;
    return results.issues.length;
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'critical':
        return 'Critical';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Info';
      default:
        return 'Unknown';
    }
  };

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

  const NoIssuesFound = () => (
    <div className="alert alert-success fade-in">
      <div className="alert-icon">
        <Icon type="success" />
      </div>
      <div>
        <div className="alert-title">No accessibility issues found!</div>
        <div className="alert-message">
          Your code appears to be free of common accessibility issues. Great job!
        </div>
      </div>
    </div>
  );

  const SuggestionsList = () => (
    <div className="alert alert-info fade-in">
      <div className="alert-icon">
        <Icon type="info" />
      </div>
      <div>
        <div className="alert-title">Suggestions for improvement</div>
        <div className="alert-message">
          <p>Even with no detected issues, consider these accessibility best practices:</p>
          <ul className="mt-2">
            <li>Add ARIA labels to interactive elements for better screen reader support</li>
            <li>Ensure keyboard navigation works logically through your interface</li>
            <li>Test with actual screen readers like NVDA or VoiceOver</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon type="accessibility" />
      </div>
      <h2 className="empty-state-title">Welcome to the Accessibility Checker</h2>
      <p className="empty-state-message">
        Paste your HTML code in the Input tab to get started. We'll analyze it for common accessibility issues and suggest fixes.
      </p>
    </div>
  );

  const Tooltip = ({ text, children }) => (
    <div className="tooltip">
      {children}
      <span className="tooltip-text">{text}</span>
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
            disabled={!results}
          >
            Results
            {results && <span className="tab-badge">{getTotalIssueCount()}</span>}
          </button>
          <button
            className="tab"
            role="tab"
            aria-selected={activeTab === 'fixed'}
            onClick={() => handleTabChange('fixed')}
            data-state={activeTab === 'fixed' ? 'active' : ''}
            disabled={!results}
          >
            Fixed Code
          </button>
        </div>

        {activeTab === 'input' && (
          <div className="tab-panel fade-in" role="tabpanel">
            <div className="form-group">
              <label htmlFor="code-input" className="form-label">
                Paste your HTML code:
                <Tooltip text="Paste your HTML code here to check for accessibility issues.">
                  <span className="help-icon">?</span>
                </Tooltip>
              </label>
              <textarea
                id="code-input"
                className="form-control"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="<div>Paste your HTML code here</div>"
              />
            </div>
            
            {error && (
              <div className="alert alert-error fade-in">
                <div className="alert-icon">
                  <Icon type="error" />
                </div>
                <div className="alert-message">{error}</div>
              </div>
            )}
            
            <button
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={!inputCode.trim() || loading}
            >
              {loading ? (
                <span className="loading-text">
                  <span className="loader"></span> Analyzing...
                </span>
              ) : (
                <>Analyze Accessibility</>
              )}
            </button>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="tab-panel fade-in" role="tabpanel">
            {results ? (
              <>
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

                {results.issues.length === 0 ? (
                  <>
                    <NoIssuesFound />
                    <SuggestionsList />
                  </>
                ) : (
                  <>
                    <div className="alert alert-warning">
                      <div className="alert-icon">
                        <Icon type="warning" />
                      </div>
                      <div>
                        <div className="alert-title">We found {results.issues.length} accessibility issues</div>
                        <div className="alert-message">
                          Review the issues below and see our suggested fixes.
                        </div>
                      </div>
                    </div>

                    <div className="issue-list">
                      {results.issues.map((issue, index) => (
                        <IssueCard key={index} issue={issue} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        )}

        {activeTab === 'fixed' && (
          <div className="tab-panel fade-in" role="tabpanel">
            {fixedCode ? (
              <>
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
                  <code>{fixedCode}</code>
                </pre>
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityChecker;