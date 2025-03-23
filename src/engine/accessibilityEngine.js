// accessibilityEngine.js

/**
 * A comprehensive accessibility analysis engine that examines HTML code
 * for common accessibility issues and provides detailed fixes.
 */

/**
 * Analyze HTML code for accessibility issues
 * @param {string} htmlCode - The HTML code to analyze
 * @returns {Object} Analysis results with issues and fixed code
 */
export function analyzeAccessibility(htmlCode) {
  // Parse the HTML code
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlCode, 'text/html');
  
  // Initialize results
  const results = {
    issues: [],
    fixedCode: htmlCode,
  };
  
  // Run all accessibility tests
  runImageAltTextCheck(doc, results);
  runHeadingStructureCheck(doc, results);
  runFormLabelCheck(doc, results);
  runColorContrastCheck(doc, results);
  runLinkPurposeCheck(doc, results);
  runARIACheck(doc, results);
  runKeyboardNavigationCheck(doc, results);
  runDocumentLangCheck(doc, results);
  runButtonRoleCheck(doc, results);
  runTableStructureCheck(doc, results);
  
  // Apply all suggested fixes to generate the fixed code
  results.fixedCode = applyFixes(htmlCode, results.issues);
  
  return results;
}

/**
 * Check for images without alt text
 */
function runImageAltTextCheck(doc, results) {
  const images = doc.querySelectorAll('img');
  
  images.forEach((img, index) => {
    // Get line and column information (this would be more accurate in a real implementation)
    const position = estimateElementPosition(img, index);
    
    if (!img.hasAttribute('alt')) {
      results.issues.push({
        title: 'Missing alt text for image',
        severity: 'critical',
        wcagReference: '1.1.1 Non-text Content (Level A)',
        description: 'Image elements must have an alt attribute that describes the image content or its purpose.',
        impact: 'Screen reader users will not know what information the image conveys.',
        position,
        codeSnippet: getElementOuterHTML(img),
        fixExample: getElementOuterHTML(img).replace('<img ', '<img alt="Descriptive text about this image" '),
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#non-text-content',
      });
    } else if (img.getAttribute('alt') === '') {
      // Empty alt text is only appropriate for decorative images
      results.issues.push({
        title: 'Empty alt text - confirm if image is decorative',
        severity: 'warning',
        wcagReference: '1.1.1 Non-text Content (Level A)',
        description: 'This image has empty alt text. This is correct only if the image is purely decorative and conveys no information.',
        impact: 'If this image conveys information but has empty alt text, screen reader users will miss that information.',
        position,
        codeSnippet: getElementOuterHTML(img),
        fixExample: `<!-- If decorative: -->
${getElementOuterHTML(img)}
<!-- If informative: -->
${getElementOuterHTML(img).replace('alt=""', 'alt="Descriptive text about this image"')}`,
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#info-and-relationships',
      });
    }
  });
}

/**
 * Check for proper heading structure
 */
function runHeadingStructureCheck(doc, results) {
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  
  // Check if there's an H1
  if (!doc.querySelector('h1')) {
    results.issues.push({
      title: 'Missing H1 heading',
      severity: 'critical',
      wcagReference: '1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA)',
      description: 'Each page should have at least one H1 heading that identifies the page content.',
      impact: 'Screen reader users rely on headings to understand page structure and navigate content.',
      position: { line: 1, column: 1 },
      codeSnippet: '<body>\n  <!-- No H1 heading found -->\n</body>',
      fixExample: '<body>\n  <h1>Main Page Title</h1>\n  <!-- Rest of the content -->\n</body>',
      learnMoreUrl: 'https://www.w3.org/WAI/tutorials/page-structure/headings/',
    });
  }
  
  // Check for skipped heading levels
  for (let i = 0; i < headings.length - 1; i++) {
    const currentLevel = parseInt(headings[i].tagName[1]);
    const nextLevel = parseInt(headings[i + 1].tagName[1]);
    
    if (nextLevel > currentLevel + 1) {
      const position = estimateElementPosition(headings[i + 1], i + 1);
      
      results.issues.push({
        title: `Skipped heading level (H${currentLevel} to H${nextLevel})`,
        severity: 'warning',
        wcagReference: '1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA)',
        description: `Heading levels should not be skipped. Found H${currentLevel} followed by H${nextLevel}.`,
        impact: 'Skipped heading levels create confusion in the document structure for screen reader users.',
        position,
        codeSnippet: getElementOuterHTML(headings[i + 1]),
        fixExample: getElementOuterHTML(headings[i + 1]).replace(
          new RegExp(`<h${nextLevel}`, 'g'), 
          `<h${currentLevel + 1}`
        ).replace(
          new RegExp(`</h${nextLevel}>`, 'g'), 
          `</h${currentLevel + 1}>`
        ),
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#headings-and-labels',
      });
    }
  }
}

/**
 * Check for form controls without associated labels
 */
function runFormLabelCheck(doc, results) {
  const formControls = doc.querySelectorAll('input, select, textarea');
  
  formControls.forEach((control, index) => {
    const position = estimateElementPosition(control, index);
    const id = control.getAttribute('id');
    const type = control.getAttribute('type') || '';
    
    // Skip hidden inputs, submit buttons, and elements with aria-label or aria-labelledby
    if (
      type === 'hidden' || 
      type === 'submit' || 
      type === 'button' ||
      control.hasAttribute('aria-label') || 
      control.hasAttribute('aria-labelledby')
    ) {
      return;
    }
    
    if (!id || !doc.querySelector(`label[for="${id}"]`)) {
      results.issues.push({
        title: 'Form control without label',
        severity: 'critical',
        wcagReference: '1.3.1 Info and Relationships, 3.3.2 Labels or Instructions (Level A)',
        description: `This ${control.tagName.toLowerCase()} element doesn't have a properly associated label.`,
        impact: 'Screen reader users will not know the purpose of this form control, making it difficult or impossible to complete the form.',
        position,
        codeSnippet: getElementOuterHTML(control),
        fixExample: !id 
          ? `<label for="unique-id">Label text</label>\n${getElementOuterHTML(control).replace('<' + control.tagName.toLowerCase(), '<' + control.tagName.toLowerCase() + ' id="unique-id"')}` 
          : `<label for="${id}">Label text</label>\n${getElementOuterHTML(control)}`,
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#labels-or-instructions',
      });
    }
  });
}

/**
 * Simplified implementation of color contrast check
 * Note: Real implementation would need to parse CSS and calculate actual contrast ratios
 */
function runColorContrastCheck(doc, results) {
  // This is a very simplified check - a real implementation would involve:
  // 1. Getting computed styles
  // 2. Calculating contrast ratios
  // 3. Checking against WCAG requirements
  
  // For now, we'll just check for inline styles with potentially problematic colors
  const elementsWithInlineStyles = doc.querySelectorAll('[style*="color"], [style*="background"]');
  
  elementsWithInlineStyles.forEach((element, index) => {
    const style = element.getAttribute('style');
    const position = estimateElementPosition(element, index);
    
    if (
      /color:\s*#([0-9a-f]{3}){1,2}/i.test(style) || 
      /color:\s*rgb\(/i.test(style) ||
      /background(-color)?:\s*#([0-9a-f]{3}){1,2}/i.test(style) ||
      /background(-color)?:\s*rgb\(/i.test(style)
    ) {
      results.issues.push({
        title: 'Potential color contrast issue',
        severity: 'warning',
        wcagReference: '1.4.3 Contrast (Minimum) (Level AA)',
        description: 'Inline styles with color values detected. Ensure text has sufficient contrast against its background.',
        impact: 'Users with low vision or color blindness may have difficulty reading text without adequate contrast.',
        position,
        codeSnippet: getElementOuterHTML(element),
        fixExample: `<!-- Ensure a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text -->\n<!-- Consider using a color contrast checker tool -->`,
        learnMoreUrl: 'https://webaim.org/resources/contrastchecker/',
      });
    }
  });
}

/**
 * Check for links with unclear purpose
 */
function runLinkPurposeCheck(doc, results) {
  const links = doc.querySelectorAll('a');
  
  links.forEach((link, index) => {
    const position = estimateElementPosition(link, index);
    const linkText = link.textContent.trim();
    
    // Check for common ambiguous link text
    const ambiguousTexts = ['click here', 'read more', 'more', 'link', 'here', 'this page', 'learn more'];
    
    if (ambiguousTexts.includes(linkText.toLowerCase())) {
      results.issues.push({
        title: 'Ambiguous link text',
        severity: 'warning',
        wcagReference: '2.4.4 Link Purpose (In Context) (Level A), 2.4.9 Link Purpose (Link Only) (Level AAA)',
        description: `Link text "${linkText}" doesn't clearly indicate its purpose or destination.`,
        impact: 'Screen reader users often navigate by links, and ambiguous link text makes it difficult to understand where links lead.',
        position,
        codeSnippet: getElementOuterHTML(link),
        fixExample: getElementOuterHTML(link).replace(
          linkText, 
          `Specific description of link destination`
        ),
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#link-purpose-in-context',
      });
    }
    
    // Check for empty links
    if (linkText === '' && !link.querySelector('img[alt]') && !link.hasAttribute('aria-label') && !link.hasAttribute('aria-labelledby')) {
      results.issues.push({
        title: 'Empty link',
        severity: 'critical',
        wcagReference: '2.4.4 Link Purpose (In Context) (Level A)',
        description: 'This link has no text content or accessible name.',
        impact: 'Screen reader users will not know the purpose of this link.',
        position,
        codeSnippet: getElementOuterHTML(link),
        fixExample: getElementOuterHTML(link).replace(
          '<a ', 
          '<a aria-label="Description of link purpose" '
        ),
        learnMoreUrl: 'https://www.w3.org/WAI/tutorials/images/decorative/',
      });
    }
  });
}

/**
 * Check for proper ARIA usage
 */
function runARIACheck(doc, results) {
  // Check for invalid ARIA roles
  const elementsWithRoles = doc.querySelectorAll('[role]');
  
  // List of valid ARIA roles
  const validRoles = [
    'alert', 'alertdialog', 'application', 'article', 'banner', 'button', 'cell', 'checkbox',
    'columnheader', 'combobox', 'complementary', 'contentinfo', 'definition', 'dialog', 
    'directory', 'document', 'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
    'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee', 'math', 'menu',
    'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'navigation', 'none',
    'note', 'option', 'presentation', 'progressbar', 'radio', 'radiogroup', 'region',
    'row', 'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 'slider',
    'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term',
    'textbox', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem'
  ];
  
  elementsWithRoles.forEach((element, index) => {
    const role = element.getAttribute('role');
    const position = estimateElementPosition(element, index);
    
    if (!validRoles.includes(role)) {
      results.issues.push({
        title: 'Invalid ARIA role',
        severity: 'critical',
        wcagReference: '4.1.2 Name, Role, Value (Level A)',
        description: `The role "${role}" is not a valid ARIA role.`,
        impact: 'Assistive technologies rely on valid roles to communicate the purpose of elements to users.',
        position,
        codeSnippet: getElementOuterHTML(element),
        fixExample: getElementOuterHTML(element).replace(
          `role="${role}"`, 
          `role="[appropriate valid role]"`
        ),
        learnMoreUrl: 'https://www.w3.org/TR/wai-aria-1.1/#role_definitions',
      });
    }
  });
  
  // Check for required ARIA attributes
  const elementsWithRelevantRoles = doc.querySelectorAll('[role="checkbox"], [role="combobox"], [role="slider"], [role="spinbutton"]');
  
  elementsWithRelevantRoles.forEach((element, index) => {
    const role = element.getAttribute('role');
    const position = estimateElementPosition(element, index);
    
    if (!element.hasAttribute('aria-checked') && role === 'checkbox') {
      results.issues.push({
        title: 'Missing required ARIA attribute',
        severity: 'critical',
        wcagReference: '4.1.2 Name, Role, Value (Level A)',
        description: 'Elements with role="checkbox" must have an aria-checked attribute.',
        impact: 'Screen reader users will not know the state of this checkbox.',
        position,
        codeSnippet: getElementOuterHTML(element),
        fixExample: getElementOuterHTML(element).replace(
          `role="checkbox"`, 
          `role="checkbox" aria-checked="false"`
        ),
        learnMoreUrl: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role',
      });
    }
    
    if (!element.hasAttribute('aria-valuemin') && (role === 'slider' || role === 'spinbutton')) {
      results.issues.push({
        title: 'Missing required ARIA attribute',
        severity: 'critical',
        wcagReference: '4.1.2 Name, Role, Value (Level A)',
        description: `Elements with role="${role}" must have aria-valuemin, aria-valuemax, and aria-valuenow attributes.`,
        impact: 'Screen reader users will not know the range and current value of this control.',
        position,
        codeSnippet: getElementOuterHTML(element),
        fixExample: getElementOuterHTML(element).replace(
          `role="${role}"`, 
          `role="${role}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"`
        ),
        learnMoreUrl: `https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/${role}_role`,
      });
    }
  });
}

/**
 * Check for keyboard navigability issues
 */
function runKeyboardNavigationCheck(doc, results) {
  // Check for tabindex values greater than 0
  const elementsWithHighTabindex = doc.querySelectorAll('[tabindex]');
  
  elementsWithHighTabindex.forEach((element, index) => {
    const tabindex = parseInt(element.getAttribute('tabindex'));
    const position = estimateElementPosition(element, index);
    
    if (tabindex > 0) {
      results.issues.push({
        title: 'Positive tabindex value',
        severity: 'warning',
        wcagReference: '2.1.1 Keyboard (Level A), 2.4.3 Focus Order (Level A)',
        description: `This element has tabindex="${tabindex}". Positive tabindex values create a custom tab order that may be confusing.`,
        impact: 'Keyboard users may experience an unexpected navigation order, making the page difficult to use.',
        position,
        codeSnippet: getElementOuterHTML(element),
        fixExample: getElementOuterHTML(element).replace(
          `tabindex="${tabindex}"`, 
          `tabindex="0"`
        ),
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H4',
      });
    }
  });
  
  // Check for potentially inaccessible custom controls
  const customControls = doc.querySelectorAll('div[onclick], span[onclick]');
  
  customControls.forEach((element, index) => {
    const position = estimateElementPosition(element, index);
    
    if (!element.hasAttribute('tabindex') && !element.hasAttribute('role')) {
      results.issues.push({
        title: 'Inaccessible custom control',
        severity: 'critical',
        wcagReference: '2.1.1 Keyboard (Level A), 4.1.2 Name, Role, Value (Level A)',
        description: 'This element has click handlers but is not keyboard accessible and has no ARIA role.',
        impact: 'Keyboard users and screen reader users cannot access this interactive element.',
        position,
        codeSnippet: getElementOuterHTML(element),
        fixExample: getElementOuterHTML(element)
          .replace('<div', '<div role="button" tabindex="0" onkeydown="if(event.key === \'Enter\') this.click()"')
          .replace('<span', '<span role="button" tabindex="0" onkeydown="if(event.key === \'Enter\') this.click()"'),
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#name-role-value',
      });
    }
  });
}

/**
 * Check for document language
 */
function runDocumentLangCheck(doc, results) {
  const html = doc.querySelector('html');
  
  if (!html.hasAttribute('lang')) {
    results.issues.push({
      title: 'Missing language attribute',
      severity: 'critical',
      wcagReference: '3.1.1 Language of Page (Level A)',
      description: 'The HTML element should have a lang attribute that identifies the language of the page.',
      impact: 'Screen readers need the language attribute to correctly pronounce and interpret content.',
      position: { line: 1, column: 1 },
      codeSnippet: getElementOuterHTML(html).substring(0, 50) + '...',
      fixExample: getElementOuterHTML(html).replace('<html', '<html lang="en"'),
      learnMoreUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H57',
    });
  }
}

/**
 * Check for div/span elements used as buttons
 */
function runButtonRoleCheck(doc, results) {
  // Find elements that might be functioning as buttons
  const fakeButtons = doc.querySelectorAll('div[class*="button"], span[class*="button"], div[class*="btn"], span[class*="btn"]');
  
  fakeButtons.forEach((element, index) => {
    const position = estimateElementPosition(element, index);
    
    if (!element.hasAttribute('role')) {
      results.issues.push({
        title: 'Div/span used as button without proper role',
        severity: 'critical',
        wcagReference: '4.1.2 Name, Role, Value (Level A)',
        description: 'This element appears to be used as a button but doesn\'t have the button role.',
        impact: 'Screen reader users will not know this element is a button.',
        position,
        codeSnippet: getElementOuterHTML(element),
        fixExample: `<!-- Better solution: Use a real button element -->
<button class="${element.className}">${element.innerHTML}</button>

<!-- Alternative: Add proper ARIA role and keyboard support -->
${getElementOuterHTML(element)
  .replace(`<${element.tagName.toLowerCase()}`, 
  `<${element.tagName.toLowerCase()} role="button" tabindex="0" onkeydown="if(event.key === 'Enter') this.click()"`)}`,
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#name-role-value',
      });
    }
  });
}

/**
 * Check for proper table structure
 */
function runTableStructureCheck(doc, results) {
  const tables = doc.querySelectorAll('table');
  
  tables.forEach((table, index) => {
    const position = estimateElementPosition(table, index);
    
    // Check for data tables without headers
    if (table.querySelectorAll('td').length > 0 && table.querySelectorAll('th').length === 0) {
      results.issues.push({
        title: 'Table missing headers',
        severity: 'warning',
        wcagReference: '1.3.1 Info and Relationships (Level A)',
        description: 'This table appears to be a data table but has no header cells (th elements).',
        impact: 'Screen reader users will not know the relationship between header and data cells.',
        position,
        codeSnippet: getElementOuterHTML(table).substring(0, 150) + '...',
        fixExample: `<table>
  <thead>
    <tr>
      <th scope="col">Header 1</th>
      <th scope="col">Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>`,
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#focus-order',
      });
    }
    
    // Check for tables used for layout
    if (
      table.querySelectorAll('th').length === 0 && 
      !table.hasAttribute('role') && 
      table.querySelectorAll('table').length === 0
    ) {
      results.issues.push({
        title: 'Table potentially used for layout',
        severity: 'info',
        wcagReference: '1.3.1 Info and Relationships (Level A)',
        description: 'This table might be used for layout purposes. If so, it should have role="presentation" or role="none".',
        impact: 'Screen readers announce layout tables as tables, which can confuse users when they\'re used for visual layout only.',
        position,
        codeSnippet: getElementOuterHTML(table).substring(0, 150) + '...',
        fixExample: `<!-- If this is a layout table: -->
<table role="presentation">
  <!-- table content -->
</table>

<!-- Better modern solution: Use CSS for layout instead of tables -->`,
        learnMoreUrl: 'https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2#language-of-page',
      });
    }
  });
}

/**
 * Helper function to estimate the position of an element
 * In a real implementation, this would be more accurate
 */
function estimateElementPosition(element, index) {
  // This is a simplification - a real implementation would 
  // parse the actual HTML to get accurate line and column
  return {
    line: index + 1,
    column: 1
  };
}

/**
 * Get the outer HTML of an element 
 * Handles potential serialization issues
 */
function getElementOuterHTML(element) {
  try {
    return element.outerHTML;
  } catch (e) {
    return `<${element.tagName.toLowerCase()}>...</${element.tagName.toLowerCase()}>`;
  }
}

/**
 * Apply all fixes to the original HTML code
 */
function applyFixes(originalHtml, issues) {
  let fixedHtml = originalHtml;
  
  // Sort issues by position line/column in reverse order (bottom to top)
  // This prevents position changes from affecting later fixes
  const sortedIssues = [...issues].sort((a, b) => {
    if (b.position.line !== a.position.line) {
      return b.position.line - a.position.line;
    }
    return b.position.column - a.position.column;
  });
  
  // Apply each fix
  sortedIssues.forEach(issue => {
    // Handle special insertion cases first
    if (issue.insertBefore && issue.insertContent) {
      // For issues that need to insert content before an element
      if (issue.codeSnippet && fixedHtml.includes(issue.codeSnippet)) {
        fixedHtml = fixedHtml.replace(issue.codeSnippet, `${issue.insertContent}\n${issue.codeSnippet}`);
      }
    } 
    else if (issue.insertAfter && issue.insertContent) {
      // For issues that need to insert content after an element
      if (fixedHtml.includes(issue.insertAfter)) {
        fixedHtml = fixedHtml.replace(issue.insertAfter, `${issue.insertAfter}${issue.insertContent}`);
      }
    }
    // Regular code snippet replacement
    else if (issue.codeSnippet && issue.fixExample) {
      // Extract the fix from examples that may contain comments
      let fixContent = issue.fixExample;
      
      // If the fix contains HTML comments with alternatives, extract the first recommended alternative
      if (fixContent.includes('<!-- ')) {
        const alternatives = fixContent.split(/<!--.*?-->/g)
          .map(part => part.trim())
          .filter(part => part.length > 0);
        
        if (alternatives.length > 0) {
          fixContent = alternatives[0];
        }
      }
      
      // Apply the fix
      if (fixContent) {
        // For exact match, do direct replacement
        if (fixedHtml.includes(issue.codeSnippet)) {
          fixedHtml = fixedHtml.replace(issue.codeSnippet, fixContent);
        } 
        // If not found, try to do a more context-aware replacement
        else {
          // This is a simplified approach - a real implementation would
          // use a proper HTML parser for precise replacement
          const lines = fixedHtml.split('\n');
          const targetLine = issue.position.line - 1; // 0-based index
          
          if (targetLine >= 0 && targetLine < lines.length) {
            // Simple heuristic: check if some part of the code snippet is in the line
            const snippetWords = issue.codeSnippet.split(/[<>\s="']/);
            const lineContainsSnippet = snippetWords.some(word => 
              word.length > 3 && lines[targetLine].includes(word)
            );
            
            if (lineContainsSnippet) {
              lines[targetLine] = fixContent;
              fixedHtml = lines.join('\n');
            }
          }
        }
      }
    }
  });
  
  return fixedHtml;
}
