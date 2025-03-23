import React from 'react';
import AccessibilityChecker from './components/AccessibilityChecker';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-center mb-2">Web Accessibility Checker</h1>
          <p className="text-center text-gray-600 mb-8">Identify and fix accessibility issues in your web projects</p>
        </div>
      </header>
      <main className="container mx-auto px-4 pb-12">
        <AccessibilityChecker />
      </main>
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">
            Created with a commitment to making the web accessible to all.
          </p>
          <p className="text-center text-gray-500 text-sm mt-2">
            <a href="https://github.com/YourUsername/web-accessibility-checker" className="text-blue-600 hover:underline">
              GitHub Repository
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
