import { DirectiveBinding, ObjectDirective } from 'vue';

/**
 * Directive to highlight text matches within an element
 * Usage: v-highlight="searchQuery"
 */
export const highlightDirective: ObjectDirective<HTMLElement, string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (!binding.value) return;
    
    highlight(el, binding.value);
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (binding.value === binding.oldValue) return;
    
    // Reset original content if we have it cached
    if ((el as any).__original !== undefined) {
      el.innerHTML = (el as any).__original;
    }
    
    if (!binding.value) return;
    
    highlight(el, binding.value);
  },
  
  unmounted(el: HTMLElement) {
    // Reset original content if we have it cached
    if ((el as any).__original !== undefined) {
      el.innerHTML = (el as any).__original;
      delete (el as any).__original;
    }
  }
};

/**
 * Highlights occurrences of a search term in an element's text
 * @param el The element to highlight text in
 * @param searchTerm The term to highlight
 */
function highlight(el: HTMLElement, searchTerm: string) {
  if (!searchTerm.trim()) return;
  
  // Store original content if not already stored
  if ((el as any).__original === undefined) {
    (el as any).__original = el.innerHTML;
  }
  
  // Get all text nodes in the element
  const walk = document.createTreeWalker(
    el,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  const textNodes: Node[] = [];
  let currentNode: Node | null = walk.nextNode();
  
  // Collect all text nodes
  while (currentNode) {
    textNodes.push(currentNode);
    currentNode = walk.nextNode();
  }
  
  // Create a case-insensitive regex for the search term
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  let hasChanges = false;
  
  // Process each text node
  textNodes.forEach(node => {
    const parent = node.parentNode;
    
    if (!parent) return;
    
    const content = node.textContent || '';
    
    // Skip if no match
    if (!regex.test(content)) return;
    
    // Reset regex lastIndex
    regex.lastIndex = 0;
    
    // Create a document fragment to hold the highlighted content
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    
    // Find all matches and create highlighted spans
    while ((match = regex.exec(content)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(content.substring(lastIndex, match.index))
        );
      }
      
      // Create highlighted span for the match
      const span = document.createElement('span');
      span.className = 'highlight';
      span.textContent = match[0];
      fragment.appendChild(span);
      
      lastIndex = regex.lastIndex;
    }
    
    // Add text after the last match
    if (lastIndex < content.length) {
      fragment.appendChild(
        document.createTextNode(content.substring(lastIndex))
      );
    }
    
    // Replace the text node with our fragment
    parent.replaceChild(fragment, node);
    hasChanges = true;
  });
  
  // Add highlight styles if we made changes
  if (hasChanges && document.head) {
    const styleId = 'highlight-directive-styles';
    
    // Only add style tag if it doesn't exist
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .highlight {
          background-color: rgba(255, 213, 0, 0.4);
          border-radius: 2px;
          padding: 0 1px;
          font-weight: inherit;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

/**
 * Escapes special regex characters in a string
 * @param string The string to escape
 * @returns Escaped string for use in regex
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}