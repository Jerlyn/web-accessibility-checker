import React, { useState } from 'react';
import './AccessibilityChecker.css';
import { analyzeAccessibility } from '../engine/accessibilityEngine';

// Simple implementation of icons
const Icon = ({ type }) => {
  switch (type) {
    case 'clipboard':
      return <span role="img" aria-label="clipboard">📋</span>;
    case 'check':
      return <span role="img" aria-label="check">✅</span>;
    case 'warning':
      return <span role="img" aria-label="warning">⚠️</span>;
    case 'error':
      return <span role="img" aria-label="error">❌</span>;
    case 'info':
      return <span role="img" aria-label="info">ℹ️</span>;
    case 'external-link':
      return <span role="img" aria-label="external link">🔗</span>;
    default:
      return null;
  }
};

// Simple Tab implementation
const Tabs = ({ value, onValueChange, children }) => {
  return <div className="tabs">{children}</div>;
};

const TabList = ({ children }) => {
  return <div className="tab-list flex mb-4" role="tablist">{children}</div>;
};

const Tab = ({ value, className, disabled, children, onClick }) => {
  return (
    <button
      role="tab"
      disabled={disabled}
      className={`${className || ''} ${disabled ? 'opacity-50' : ''}`}
      onClick={() => onClick && onClick(value)}
    >
      {children}
    </button>
  );
};

const TabPanel = ({ value, activeTab, className, children }) => {
  if (value !== activeTab) return null;
  return <div role="tabpanel" className={className}>{children}</div>;
};

// Simple Card implementation
const Card = ({ className, children }) => {
  return <div className={`card ${className || ''}`}>{children}</div>;
};

const CardHeader = ({ className, children }) => {
  return <div className={`card-header ${className || ''}`}>{children}</div>;
};

const CardTitle = ({ className, children }) => {
  return <h3 className={`text-xl font-bold ${className || ''}`}>{children}</h3>;
};

const CardDescription = ({ className, children }) => {
  return <p className={`text-sm text-gray-600 ${className || ''}`}>{children}</p>;
};

const CardContent = ({ className, children }) => {
  return <div className={`card-content ${className || ''}`}>{children}</div>;
};

const CardFooter = ({ className, children }) => {
  return <div className={`card-footer ${className || ''}`}>{children}</div>;
};

// Simple Alert implementation
const Alert = ({ className, children }) => {
  return <div className={`alert ${className || ''}`} role="alert">{children}</div>;
};

const AlertTitle = ({ className, children }) => {
  return <h5 className={`font-bold ${className || ''}`}>{children}</h5>;
};

const AlertDescription = ({ className, children }) => {
  return <p className={`${className || ''}`}>{children}</p>;
};

// Simple Button implementation
const Button = ({ onClick, disabled, children, variant, className }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${variant === 'outline' ? 'variant-outline' : ''} ${className || ''}`}
    >
      {children}
    </button>
  );
};

const AccessibilityChecker = () => {
  const [inputCode, setInputCode] = useState('');
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [fixedCode, setFixedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    if (!inputCode.trim()) return;
    
    const analysisResults = analyzeAccessibility(inputCode);
    setResults(analysisResults);
    setFixedCode(analysisResults.fixedCode);
    setActiveTab('results');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <Icon type="error" />;
      case 'warning':
        return <Icon type="warning" />;
      case 'info':
        return <Icon type="info" />;
      default:
        return <Icon type="info" />;
    }
  };

  const IssueCard = ({ issue }) => (
    <Card className="mb-4">
      <CardHeader className="flex items-center gap-2">
        {getSeverityIcon(issue.severity)}
        <div>
          <CardTitle>{issue.title}</CardTitle>
          <CardDescription>
            Line {issue.position.line}, Column {issue.position.column} | WCAG: {issue.wcagReference}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="font-medium mb-1">Issue:</h4>
          <p>{issue.description}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-1">Why it matters:</h4>
          <p>{issue.impact}</p>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">Current code:</h4>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            <code>{issue.codeSnippet}</code>
          </pre>
        </div>

        <div>
          <h4 className="font-medium mb-1">Suggested fix:</h4>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            <code>{issue.fixExample}</code>
          </pre>
        </div>
      </CardContent>
      <CardFooter>
        <a 
          href={issue.learnMoreUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-blue-600"
        >
          Learn more <Icon type="external-link" />
        </a>
      </CardFooter>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Web Accessibility Checker</h1>
        <p className="text-gray-600">Identify and fix accessibility issues in your HTML code</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabList>
          <Tab 
            value="input" 
            className="flex-1 py-2 text-center border-b-2 border-transparent" 
            onClick={handleTabChange}
            data-state={activeTab === 'input' ? 'active' : ''}
          >
            Input Code
          </Tab>
          <Tab 
            value="results" 
            className="flex-1 py-2 text-center border-b-2 border-transparent" 
            disabled={!results}
            onClick={handleTabChange}
            data-state={activeTab === 'results' ? 'active' : ''}
          >
            Results ({results?.issues.length || 0})
          </Tab>
          <Tab 
            value="fixed" 
            className="flex-1 py-2 text-center border-b-2 border-transparent" 
            disabled={!results}
            onClick={handleTabChange}
            data-state={activeTab === 'fixed' ? 'active' : ''}
          >
            Fixed Code
          </Tab>
        </TabList>

        <TabPanel value="input" activeTab={activeTab} className="p-4 bg-white rounded shadow">
          <div className="mb-4">
            <label htmlFor="code-input" className="block text-sm font-medium mb-2">Paste your HTML code:</label>
            <textarea
              id="code-input"
              className="w-full h-64 p-3 border rounded font-mono text-sm"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="<div>Paste your HTML code here</div>"
            />
          </div>
          <Button onClick={handleAnalyze} disabled={!inputCode.trim()}>
            Analyze Accessibility
          </Button>
        </TabPanel>

        <TabPanel value="results" activeTab={activeTab} className="p-4 bg-white rounded shadow">
          {results && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Analysis Results</h2>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Icon type="error" /> 
                      Critical: {results.issues.filter(i => i.severity === 'critical').length}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Icon type="warning" /> 
                      Warning: {results.issues.filter(i => i.severity === 'warning').length}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Icon type="info" /> 
                      Info: {results.issues.filter(i => i.severity === 'info').length}
                    </span>
                  </div>
                </div>

                {results.issues.length === 0 ? (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertTitle className="text-green-800">No accessibility issues found!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Your code appears to be free of common accessibility issues. Great job!
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert className="mb-6 bg-blue-50 border-blue-200">
                      <AlertTitle className="text-blue-800">We found {results.issues.length} accessibility issues</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        Review the issues below and see our suggested fixes.
                      </AlertDescription>
                    </Alert>

                    <div>
                      {results.issues.map((issue, index) => (
                        <IssueCard key={index} issue={issue} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </TabPanel>

        <TabPanel value="fixed" activeTab={activeTab} className="p-4 bg-white rounded shadow">
          {fixedCode && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Fixed Code</h2>
                <Button 
                  variant="outline" 
                  onClick={handleCopyToClipboard}
                  className="flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Icon type="check" /> Copied!
                    </>
                  ) : (
                    <>
                      <Icon type="clipboard" /> Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap">
                <code>{fixedCode}</code>
              </pre>
            </>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default AccessibilityChecker;