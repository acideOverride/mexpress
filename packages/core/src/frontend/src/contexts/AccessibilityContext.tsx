import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type AccessibilityContextType = {
  // High contrast mode
  highContrastMode: boolean;
  toggleHighContrastMode: () => void;
  
  // Font size adjustment
  fontSizeScale: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  
  // Focus management
  focusableElements: HTMLElement[];
  addFocusableElement: (element: HTMLElement) => void;
  removeFocusableElement: (element: HTMLElement) => void;
  moveFocusTo: (index: number) => void;
  
  // User preferences
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
  
  // Screen reader assistance
  announceMessage: (message: string, politeness?: 'polite' | 'assertive') => void;
};

// Create the context with default values
const AccessibilityContext = createContext<AccessibilityContextType>({
  // High contrast
  highContrastMode: false,
  toggleHighContrastMode: () => {},
  
  // Font size
  fontSizeScale: 1,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
  resetFontSize: () => {},
  
  // Focus management
  focusableElements: [],
  addFocusableElement: () => {},
  removeFocusableElement: () => {},
  moveFocusTo: () => {},
  
  // User preferences
  reduceMotion: false,
  toggleReduceMotion: () => {},
  
  // Screen reader assistance
  announceMessage: () => {},
});

// Announcer component for screen reader notifications
const Announcer: React.FC = () => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  
  // Clear messages after they've been announced
  useEffect(() => {
    if (politeMessage) {
      const timer = setTimeout(() => setPoliteMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [politeMessage]);
  
  useEffect(() => {
    if (assertiveMessage) {
      const timer = setTimeout(() => setAssertiveMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [assertiveMessage]);
  
  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
      >
        {politeMessage}
      </div>
      <div
        aria-live="assertive"
        aria-atomic="true"
        style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
      >
        {assertiveMessage}
      </div>
    </>
  );
};

// Provider component
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for high contrast mode
  const [highContrastMode, setHighContrastMode] = useState(false);
  
  // State for font size scaling
  const [fontSizeScale, setFontSizeScale] = useState(1);
  
  // State for focusable elements
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  
  // State for reduce motion preference
  const [reduceMotion, setReduceMotion] = useState(false);
  
  // State for announcer
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  
  // Initialize accessibility settings from user preferences if available
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setReduceMotion(true);
    }
    
    // Check for saved preferences in localStorage
    const savedHighContrast = localStorage.getItem('highContrastMode');
    if (savedHighContrast) {
      setHighContrastMode(savedHighContrast === 'true');
    }
    
    const savedFontSize = localStorage.getItem('fontSizeScale');
    if (savedFontSize) {
      setFontSizeScale(parseFloat(savedFontSize));
    }
  }, []);
  
  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('highContrastMode', highContrastMode.toString());
  }, [highContrastMode]);
  
  useEffect(() => {
    localStorage.setItem('fontSizeScale', fontSizeScale.toString());
  }, [fontSizeScale]);
  
  // Toggle high contrast mode
  const toggleHighContrastMode = useCallback(() => {
    setHighContrastMode(prev => !prev);
  }, []);
  
  // Font size adjustments
  const increaseFontSize = useCallback(() => {
    setFontSizeScale(prev => Math.min(prev + 0.1, 2.0));
  }, []);
  
  const decreaseFontSize = useCallback(() => {
    setFontSizeScale(prev => Math.max(prev - 0.1, 0.7));
  }, []);
  
  const resetFontSize = useCallback(() => {
    setFontSizeScale(1);
  }, []);
  
  // Focus management
  const addFocusableElement = useCallback((element: HTMLElement) => {
    setFocusableElements(prev => [...prev, element]);
  }, []);
  
  const removeFocusableElement = useCallback((element: HTMLElement) => {
    setFocusableElements(prev => prev.filter(el => el !== element));
  }, []);
  
  const moveFocusTo = useCallback((index: number) => {
    const element = focusableElements[index];
    if (element) {
      element.focus();
    }
  }, [focusableElements]);
  
  // Toggle reduce motion
  const toggleReduceMotion = useCallback(() => {
    setReduceMotion(prev => !prev);
  }, []);
  
  // Announce message for screen readers
  const announceMessage = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    if (politeness === 'assertive') {
      setAssertiveMessage(message);
    } else {
      setPoliteMessage(message);
    }
  }, []);
  
  // Context value
  const contextValue = {
    highContrastMode,
    toggleHighContrastMode,
    
    fontSizeScale,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    
    focusableElements,
    addFocusableElement,
    removeFocusableElement,
    moveFocusTo,
    
    reduceMotion,
    toggleReduceMotion,
    
    announceMessage,
  };
  
  return (
    <AccessibilityContext.Provider value={contextValue}>
      <Announcer />
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook for using the accessibility context
export const useAccessibility = () => useContext(AccessibilityContext);

export default AccessibilityContext;