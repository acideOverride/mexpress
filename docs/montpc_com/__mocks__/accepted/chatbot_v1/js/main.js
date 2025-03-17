/**
 * MontPC Chatbot Interface
 * Based on v3 website styling
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initThemeToggle();
  initCustomCursor();
  initChatInteraction();
  initAppointmentForm();
  initAutoScroll();
});

/**
 * Theme Toggle Functionality
 * Toggles between light and dark mode
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved theme preference or use user's system preference
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
  }
  
  // Toggle theme when button is clicked
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    
    // Save preference to localStorage
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}

/**
 * Custom Cursor
 * Implements a custom cursor with hover effects
 */
function initCustomCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  
  // Skip on mobile/touch devices
  if (isTouchDevice()) {
    return;
  }
  
  // Track cursor position
  document.addEventListener('mousemove', e => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Use requestAnimationFrame for smooth cursor movement
    window.requestAnimationFrame(() => {
      cursorDot.style.transform = `translate(${posX}px, ${posY}px)`;
      cursorOutline.style.transform = `translate(${posX}px, ${posY}px)`;
    });
    
    // Show custom cursor
    cursorDot.style.opacity = 1;
    cursorOutline.style.opacity = 1;
  });
  
  // Add custom cursor effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, select, .suggestion-chip, .repair-card');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursorOutline.style.width = '60px';
      cursorOutline.style.height = '60px';
      cursorDot.style.transform = `translate(${cursorDot._x}px, ${cursorDot._y}px) scale(1.5)`;
    });
    
    element.addEventListener('mouseleave', () => {
      cursorOutline.style.width = '40px';
      cursorOutline.style.height = '40px';
      cursorDot.style.transform = `translate(${cursorDot._x}px, ${cursorDot._y}px) scale(1)`;
    });
  });
  
  // Cursor click effect
  document.addEventListener('mousedown', () => {
    cursorOutline.style.width = '35px';
    cursorOutline.style.height = '35px';
  });
  
  document.addEventListener('mouseup', () => {
    cursorOutline.style.width = '40px';
    cursorOutline.style.height = '40px';
  });
}

/**
 * Chat Interaction
 * Handles sending messages and suggestion chips
 */
function initChatInteraction() {
  const chatMessages = document.getElementById('chat-messages');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-message');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  
  // Send message on button click
  sendButton.addEventListener('click', () => {
    sendMessage();
  });
  
  // Send message on Enter key
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Suggestion chip click
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const message = chip.getAttribute('data-message');
      sendPredefinedMessage(message);
    });
  });
  
  // Function to send message
  function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message) {
      // Add user message to chat
      addUserMessage(message);
      
      // Clear input
      messageInput.value = '';
      
      // Show typing indicator
      showTypingIndicator();
      
      // Simulate bot response after delay
      setTimeout(() => {
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add bot response based on message content
        respondToMessage(message);
      }, 1500);
    }
  }
  
  // Function to send a predefined message from suggestion chips
  function sendPredefinedMessage(message) {
    // Add user message to chat
    addUserMessage(message);
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate bot response after delay
    setTimeout(() => {
      // Hide typing indicator
      hideTypingIndicator();
      
      // Add bot response based on message content
      respondToMessage(message);
    }, 1500);
  }
  
  // Add user message to chat
  function addUserMessage(message) {
    const currentTime = getCurrentTime();
    
    const messageHTML = `
      <div class="message user">
        <div class="message-content">
          <p>${escapeHTML(message)}</p>
          <div class="message-time">${currentTime}</div>
        </div>
      </div>
    `;
    
    // Add to chat and scroll to bottom
    appendToChat(messageHTML);
  }
  
  // Add bot message to chat
  function addBotMessage(message, includeChips = false) {
    const currentTime = getCurrentTime();
    
    let chipsHTML = '';
    if (includeChips) {
      chipsHTML = `
        <div class="suggestion-chips">
          <button class="suggestion-chip" data-message="Prendre rendez-vous">Prendre rendez-vous</button>
          <button class="suggestion-chip" data-message="Questions fréquentes">Questions fréquentes</button>
          <button class="suggestion-chip" data-message="Parler à un conseiller">Parler à un conseiller</button>
        </div>
      `;
    }
    
    const messageHTML = `
      <div class="message bot">
        <div class="message-avatar">
          <div class="avatar-circle small">
            <svg class="avatar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </div>
        </div>
        <div class="message-content">
          <p>${message}</p>
          ${chipsHTML}
          <div class="message-time">${currentTime}</div>
        </div>
      </div>
    `;
    
    // Add to chat and scroll to bottom
    appendToChat(messageHTML);
    
    // Initialize any new suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const chipMessage = chip.getAttribute('data-message');
        sendPredefinedMessage(chipMessage);
      });
    });
  }
  
  // Show typing indicator
  function showTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    typingIndicator.style.display = 'inline-flex';
    scrollToBottom();
  }
  
  // Hide typing indicator
  function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    typingIndicator.style.display = 'none';
  }
  
  // Append message to chat and scroll to bottom
  function appendToChat(messageHTML) {
    const typingIndicator = document.querySelector('.typing-indicator');
    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    chatMessages.appendChild(typingIndicator);
    scrollToBottom();
    
    // Update event listeners for new elements
    initChatInteraction();
  }
  
  // Respond to user message
  function respondToMessage(message) {
    message = message.toLowerCase();
    
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
      addBotMessage("Bonjour ! Comment puis-je vous aider aujourd'hui ?", true);
    }
    else if (message.includes('tarif') || message.includes('prix') || message.includes('coût') || message.includes('tarifs')) {
      addBotMessage("Nos tarifs varient selon le modèle et le type de réparation. Pour un iPhone récent, comptez environ 150€ pour un écran, 70€ pour une batterie. Souhaitez-vous un devis plus précis pour votre appareil spécifique ?", true);
    }
    else if (message.includes('iphone') && (message.includes('écran') || message.includes('cassé') || message.includes('brisé'))) {
      const repairCardHTML = `
        <p>Pour un remplacement d'écran d'iPhone, nos prix débutent à 79€ pour les modèles plus anciens et vont jusqu'à 259€ pour les derniers modèles Pro Max. Quel modèle d'iPhone possédez-vous exactement ?</p>
        <div class="repair-card">
          <div class="repair-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div class="repair-details">
            <h3>Remplacement Écran iPhone</h3>
            <div class="repair-info">
              <span class="repair-price">À partir de 79€</span>
              <span class="repair-time">30-45 minutes</span>
            </div>
            <div class="repair-features">
              <span class="feature">Garantie 12 mois</span>
              <span class="feature">Pièces premium</span>
            </div>
          </div>
        </div>
        <p>Souhaitez-vous prendre rendez-vous ou obtenir un devis personnalisé ?</p>
      `;
      
      addBotMessage(repairCardHTML, true);
    }
    else if (message.includes('batterie') || message.includes('autonomie') || message.includes('charge')) {
      const repairCardHTML = `
        <p>Pour un remplacement de batterie, nos prix varient selon le modèle :</p>
        <div class="repair-card">
          <div class="repair-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect>
              <line x1="23" y1="13" x2="23" y2="11"></line>
            </svg>
          </div>
          <div class="repair-details">
            <h3>Remplacement Batterie</h3>
            <div class="repair-info">
              <span class="repair-price">À partir de 49€</span>
              <span class="repair-time">30 minutes</span>
            </div>
            <div class="repair-features">
              <span class="feature">Garantie 12 mois</span>
              <span class="feature">Haute capacité</span>
            </div>
          </div>
        </div>
        <p>Nous utilisons exclusivement des batteries de haute qualité avec une capacité égale ou supérieure à celle d'origine. Quel appareil avez-vous ?</p>
      `;
      
      addBotMessage(repairCardHTML, true);
    }
    else if (message.includes('rendez-vous') || message.includes('rdv')) {
      const appointmentHTML = `
        <p>Pour prendre rendez-vous, veuillez remplir ce formulaire :</p>
        <div class="appointment-form">
          <div class="form-fields">
            <div class="form-field">
              <label for="name-new">Nom</label>
              <input type="text" id="name-new" placeholder="Votre nom">
            </div>
            <div class="form-field">
              <label for="phone-new">Téléphone</label>
              <input type="tel" id="phone-new" placeholder="Votre numéro">
            </div>
            <div class="form-field full">
              <label for="device-type">Type d'appareil</label>
              <select id="device-type">
                <option value="">Sélectionner</option>
                <option value="iPhone">iPhone</option>
                <option value="Samsung">Samsung</option>
                <option value="iPad">iPad</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div class="form-field full">
              <label for="repair-type">Type de réparation</label>
              <select id="repair-type">
                <option value="">Sélectionner</option>
                <option value="Écran">Écran</option>
                <option value="Batterie">Batterie</option>
                <option value="Connecteur">Connecteur de charge</option>
                <option value="Autre">Autre / Je ne sais pas</option>
              </select>
            </div>
            <div class="form-field full">
              <label for="date-new">Date souhaitée</label>
              <input type="date" id="date-new">
            </div>
          </div>
          <button class="submit-btn" id="submit-appointment-new">Confirmer le rendez-vous</button>
        </div>
      `;
      
      addBotMessage(appointmentHTML);
      
      // Initialize the new appointment form
      document.getElementById('submit-appointment-new').addEventListener('click', () => {
        submitNewAppointment();
      });
    }
    else if (message.includes('garantie')) {
      addBotMessage("Tous nos services de réparation sont garantis 12 mois. Cette garantie couvre tous les défauts de pièces et de main-d'œuvre. Si un problème survient avec la réparation effectuée, nous résoudrons le problème gratuitement pendant cette période. Avez-vous d'autres questions sur notre garantie ?", true);
    }
    else if (message.includes('délai') || message.includes('temps') || message.includes('durée')) {
      addBotMessage("La plupart de nos réparations courantes (écran, batterie) sont effectuées en 30 à 60 minutes. Pour les réparations plus complexes, comme les problèmes de carte mère, le délai peut aller jusqu'à 48 heures. Nous vous proposons un service de prêt d'appareil si votre réparation nécessite plus de temps. Quel type de réparation vous intéresse ?", true);
    }
    else if (message.includes('merci')) {
      addBotMessage("Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Nous sommes là pour vous aider !", true);
    }
    else if (message.includes('prendre rendez-vous')) {
      const appointmentHTML = `
        <p>Pour prendre rendez-vous, veuillez remplir ce formulaire :</p>
        <div class="appointment-form">
          <div class="form-fields">
            <div class="form-field">
              <label for="name-new">Nom</label>
              <input type="text" id="name-new" placeholder="Votre nom">
            </div>
            <div class="form-field">
              <label for="phone-new">Téléphone</label>
              <input type="tel" id="phone-new" placeholder="Votre numéro">
            </div>
            <div class="form-field full">
              <label for="device-type">Type d'appareil</label>
              <select id="device-type">
                <option value="">Sélectionner</option>
                <option value="iPhone">iPhone</option>
                <option value="Samsung">Samsung</option>
                <option value="iPad">iPad</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div class="form-field full">
              <label for="repair-type">Type de réparation</label>
              <select id="repair-type">
                <option value="">Sélectionner</option>
                <option value="Écran">Écran</option>
                <option value="Batterie">Batterie</option>
                <option value="Connecteur">Connecteur de charge</option>
                <option value="Autre">Autre / Je ne sais pas</option>
              </select>
            </div>
            <div class="form-field full">
              <label for="date-new">Date souhaitée</label>
              <input type="date" id="date-new">
            </div>
          </div>
          <button class="submit-btn" id="submit-appointment-new">Confirmer le rendez-vous</button>
        </div>
      `;
      
      addBotMessage(appointmentHTML);
      
      // Initialize the new appointment form
      document.getElementById('submit-appointment-new').addEventListener('click', () => {
        submitNewAppointment();
      });
    }
    else if (message.includes('questions fréquentes')) {
      addBotMessage(`
        <p>Voici les questions les plus fréquentes :</p>
        <p><strong>Q : Combien de temps dure une réparation ?</strong><br>
        La plupart des réparations sont effectuées en 30-60 minutes.</p>
        <p><strong>Q : Offrez-vous une garantie ?</strong><br>
        Oui, toutes nos réparations sont garanties 12 mois.</p>
        <p><strong>Q : Utilisez-vous des pièces d'origine ?</strong><br>
        Nous utilisons des pièces de qualité équivalente ou supérieure aux pièces d'origine.</p>
        <p><strong>Q : Faut-il prendre rendez-vous ?</strong><br>
        Bien que ce ne soit pas obligatoire, un rendez-vous garantit une prise en charge immédiate.</p>
        <p>Avez-vous une autre question ?</p>
      `, true);
    }
    else if (message.includes('parler à un conseiller')) {
      addBotMessage(`
        <p>Pour parler directement à un conseiller, vous pouvez :</p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li>• Nous appeler au 04 50 XX XX XX (9h-19h en semaine, 10h-18h le samedi)</li>
          <li>• Nous envoyer un email à contact@montpc.com</li>
          <li>• Nous rendre visite en magasin au 23 Avenue des Alpes, 74000 Annecy</li>
        </ul>
        <p>Un conseiller sera heureux de répondre à toutes vos questions.</p>
      `, true);
    }
    else {
      addBotMessage(`Je n'ai pas complètement compris votre demande. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur nos services de réparation, nos tarifs, ou prendre rendez-vous.`, true);
    }
  }
  
  // Submit new appointment
  function submitNewAppointment() {
    const nameInput = document.getElementById('name-new');
    const phoneInput = document.getElementById('phone-new');
    const deviceSelect = document.getElementById('device-type');
    const repairSelect = document.getElementById('repair-type');
    const dateInput = document.getElementById('date-new');
    
    // Simple validation
    if (!nameInput.value || !phoneInput.value || !deviceSelect.value || !repairSelect.value || !dateInput.value) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    // Format date
    const date = new Date(dateInput.value);
    const formattedDate = date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    // Show success message
    addBotMessage(`
      <p>Merci, ${nameInput.value} ! Votre rendez-vous a été confirmé pour le ${formattedDate}.</p>
      <p>Un SMS de confirmation sera envoyé au ${phoneInput.value} avec tous les détails.</p>
      <p>Pour toute question supplémentaire ou pour modifier votre rendez-vous, n'hésitez pas à nous contacter au 04 50 XX XX XX.</p>
    `, true);
  }
}

/**
 * Appointment Form
 * Handles the appointment form submission
 */
function initAppointmentForm() {
  const submitButton = document.getElementById('submit-appointment');
  
  if (submitButton) {
    submitButton.addEventListener('click', () => {
      const nameInput = document.getElementById('name');
      const phoneInput = document.getElementById('phone');
      const dateInput = document.getElementById('date');
      const timeInput = document.getElementById('time');
      
      // Simple validation
      if (!nameInput.value || !phoneInput.value || !dateInput.value || !timeInput.value) {
        alert('Veuillez remplir tous les champs');
        return;
      }
      
      // Format date
      const date = new Date(dateInput.value);
      const formattedDate = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      // Show success message
      const chatMessages = document.getElementById('chat-messages');
      const typingIndicator = document.querySelector('.typing-indicator');
      
      showTypingIndicator();
      
      setTimeout(() => {
        hideTypingIndicator();
        
        const messageHTML = `
          <div class="message bot">
            <div class="message-avatar">
              <div class="avatar-circle small">
                <svg class="avatar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
            </div>
            <div class="message-content">
              <p>Merci, ${nameInput.value} ! Votre rendez-vous a été confirmé pour le ${formattedDate} à ${timeInput.value}.</p>
              <p>Un SMS de confirmation sera envoyé au ${phoneInput.value} avec tous les détails.</p>
              <p>Pour toute question supplémentaire ou pour modifier votre rendez-vous, n'hésitez pas à nous contacter au 04 50 XX XX XX.</p>
              <div class="suggestion-chips">
                <button class="suggestion-chip" data-message="Merci">Merci</button>
                <button class="suggestion-chip" data-message="Questions fréquentes">Questions fréquentes</button>
                <button class="suggestion-chip" data-message="Parler à un conseiller">Parler à un conseiller</button>
              </div>
              <div class="message-time">${getCurrentTime()}</div>
            </div>
          </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();
        
        // Initialize suggestion chips
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            const message = chip.getAttribute('data-message');
            const messageInput = document.getElementById('message-input');
            messageInput.value = message;
            document.getElementById('send-message').click();
          });
        });
      }, 1500);
    });
  }
  
  // Show typing indicator
  function showTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    typingIndicator.style.display = 'inline-flex';
    scrollToBottom();
  }
  
  // Hide typing indicator
  function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    typingIndicator.style.display = 'none';
  }
}

/**
 * Auto Scroll
 * Automatically scrolls to the bottom of the chat
 */
function initAutoScroll() {
  // Initial scroll to bottom
  scrollToBottom();
  
  // Scroll to bottom on window resize
  window.addEventListener('resize', scrollToBottom);
}

// Utility Functions

/**
 * Get current time in HH:MM format
 */
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Escape HTML special characters
 */
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Check if device is touch-enabled
 */
function isTouchDevice() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}