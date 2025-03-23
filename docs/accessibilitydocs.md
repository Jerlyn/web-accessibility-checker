# Web Accessibility Checker

An interactive tool that helps developers identify and fix common accessibility issues in their web projects.

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [Features](#features)
- [Accessibility Issues Detected](#accessibility-issues-detected)
- [Contributing](#contributing)
- [Resources](#resources)

## Overview

This tool provides an interactive interface for developers to check their HTML code for accessibility issues. It scans code for common WCAG (Web Content Accessibility Guidelines) violations, provides detailed explanations of the issues found, and suggests practical fixes.

Key benefits:
- Immediate feedback on accessibility issues
- Educational content to help developers learn best practices
- Interactive examples that demonstrate before/after code
- Focus on practical, actionable improvements

## Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/YourUsername/web-accessibility-checker.git
   cd web-accessibility-checker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## How to Use

1. **Paste Your HTML Code**: Enter or paste your HTML code into the input field.
2. **Analyze**: Click "Analyze Accessibility" to scan your code.
3. **Review Issues**: The tool will display any accessibility issues found, sorted by severity.
4. **Understand & Learn**: Each issue includes:
   - A description of the problem
   - Why it matters for accessibility
   - The relevant WCAG success criterion
   - Code snippets showing the issue
   - Example code showing how to fix it
   - Links to learning resources
5. **Fix Your Code**: Use the "Fixed Code" tab to see a version of your code with suggested fixes applied.
6. **Apply Fixes**: Copy the fixed code or implement the suggested changes in your project.

## Features

### Real-time Analysis
The tool performs immediate analysis of your HTML code without sending data to a server, ensuring privacy and quick results.

### Comprehensive Issue Detection
Scans for a wide range of accessibility issues including:
- Missing alternative text for images
- Improper heading structure
- Form elements without labels
- Color contrast issues
- Keyboard accessibility problems
- And many more

### Educational Resources
Each identified issue includes:
- Clear explanations tailored for developers
- Impact statements that explain why the issue matters
- Links to authoritative resources for further learning

### Interactive Fixes
- See side-by-side comparisons of problematic code and recommended fixes
- Get executable code examples you can implement immediately
- Preview how the changes would affect your project

## Accessibility Issues Detected

The tool checks for the following categories of issues:

### Content & Structure
- Missing alternative text for images
- Improper heading structure (missing H1, skipped levels)
- Empty links and buttons
- Ambiguous link text

### Forms & Controls
- Form controls without labels
- Custom controls without keyboard support
- Missing or invalid ARIA attributes
- Improper use of ARIA roles

### Visual Design
- Color contrast issues
- Focus indicator visibility

### Keyboard & Navigation
- Keyboard traps
- Improper tab order
- Elements not accessible via keyboard

### Tables & Data
- Tables missing headers
- Layout tables without proper roles
- Complex tables without proper structure

### Document Structure
- Missing language attribute
- Invalid HTML attributes

## WCAG Conformance Levels

Issues are categorized by WCAG conformance levels:

- **Level A**: Essential for basic accessibility. Most critical issues that would prevent people with disabilities from using the content.
- **Level AA**: Important for standard accessibility. Issues that would make content difficult (but not impossible) to use.
- **Level AAA**: Ideal for enhanced accessibility. Issues that would improve the experience for specific user groups.

## Severity Levels

Issues are marked with severity levels:

- **Critical**: Prevents access for certain users
- **Warning**: Creates significant barriers but not complete blockers
- **Info**: Best practices and enhancements

## Contributing

Contributions to improve this tool are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on the process.

### Areas for Improvement
- Additional accessibility checks
- Improved code fixing algorithms
- Support for checking CSS files
- Support for JavaScript interaction patterns
- Automated testing of dynamic content

## Resources

### Web Accessibility Guidelines
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.1](https://www.w3.org/TR/wai-aria-1.1/)

### Learning Resources
- [W3C Web Accessibility Initiative Tutorials](https://www.w3.org/WAI/tutorials/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Articles](https://webaim.org/articles/)

### Testing Tools
- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/)
- [IBM Equal Access Toolkit](https://www.ibm.com/able/toolkit/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Created with a commitment to making the web accessible to all.
