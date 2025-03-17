/**
 * MontPC Website v3 - Interactive Configurator
 * "The Devil Wears Prada meets Sanrio" Edition
 * Configurator JavaScript file
 */

document.addEventListener('DOMContentLoaded', () => {
  initializeConfigurator();
});

/**
 * Initialize the repair configurator with all steps
 */
function initializeConfigurator() {
  // User selections
  const userSelections = {
    deviceType: '',
    brand: '',
    series: '',
    model: '',
    issue: '',
    quality: '',
  };

  // Database of devices, brands, series, models, and issues
  const deviceDatabase = {
    smartphone: {
      name: 'Smartphone',
      brands: {
        apple: {
          name: 'Apple',
          series: {
            iphone13: {
              name: 'iPhone 13',
              models: {
                iphone13: { name: 'iPhone 13' },
                iphone13mini: { name: 'iPhone 13 Mini' },
                iphone13pro: { name: 'iPhone 13 Pro' },
                iphone13promax: { name: 'iPhone 13 Pro Max' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 89 },
                battery: { name: 'Battery Replacement', price: 69 },
                charging: { name: 'Charging Port Repair', price: 59 },
                camera: { name: 'Camera Repair', price: 79 },
                water: { name: 'Water Damage Treatment', price: 99 },
              }
            },
            iphone12: {
              name: 'iPhone 12',
              models: {
                iphone12: { name: 'iPhone 12' },
                iphone12mini: { name: 'iPhone 12 Mini' },
                iphone12pro: { name: 'iPhone 12 Pro' },
                iphone12promax: { name: 'iPhone 12 Pro Max' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 79 },
                battery: { name: 'Battery Replacement', price: 59 },
                charging: { name: 'Charging Port Repair', price: 49 },
                camera: { name: 'Camera Repair', price: 69 },
                water: { name: 'Water Damage Treatment', price: 89 },
              }
            },
            iphone11: {
              name: 'iPhone 11',
              models: {
                iphone11: { name: 'iPhone 11' },
                iphone11pro: { name: 'iPhone 11 Pro' },
                iphone11promax: { name: 'iPhone 11 Pro Max' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 69 },
                battery: { name: 'Battery Replacement', price: 49 },
                charging: { name: 'Charging Port Repair', price: 45 },
                camera: { name: 'Camera Repair', price: 59 },
                water: { name: 'Water Damage Treatment', price: 79 },
              }
            }
          }
        },
        samsung: {
          name: 'Samsung',
          series: {
            galaxys21: {
              name: 'Galaxy S21',
              models: {
                galaxys21: { name: 'Galaxy S21' },
                galaxys21plus: { name: 'Galaxy S21+' },
                galaxys21ultra: { name: 'Galaxy S21 Ultra' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 79 },
                battery: { name: 'Battery Replacement', price: 59 },
                charging: { name: 'Charging Port Repair', price: 55 },
                camera: { name: 'Camera Repair', price: 69 },
                water: { name: 'Water Damage Treatment', price: 89 },
              }
            },
            galaxys20: {
              name: 'Galaxy S20',
              models: {
                galaxys20: { name: 'Galaxy S20' },
                galaxys20plus: { name: 'Galaxy S20+' },
                galaxys20ultra: { name: 'Galaxy S20 Ultra' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 75 },
                battery: { name: 'Battery Replacement', price: 55 },
                charging: { name: 'Charging Port Repair', price: 49 },
                camera: { name: 'Camera Repair', price: 65 },
                water: { name: 'Water Damage Treatment', price: 85 },
              }
            }
          }
        },
        google: {
          name: 'Google',
          series: {
            pixel6: {
              name: 'Pixel 6',
              models: {
                pixel6: { name: 'Pixel 6' },
                pixel6pro: { name: 'Pixel 6 Pro' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 79 },
                battery: { name: 'Battery Replacement', price: 59 },
                charging: { name: 'Charging Port Repair', price: 49 },
                camera: { name: 'Camera Repair', price: 69 },
                water: { name: 'Water Damage Treatment', price: 89 },
              }
            },
            pixel5: {
              name: 'Pixel 5',
              models: {
                pixel5: { name: 'Pixel 5' },
                pixel5a: { name: 'Pixel 5a' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 69 },
                battery: { name: 'Battery Replacement', price: 49 },
                charging: { name: 'Charging Port Repair', price: 45 },
                camera: { name: 'Camera Repair', price: 59 },
                water: { name: 'Water Damage Treatment', price: 79 },
              }
            }
          }
        }
      }
    },
    laptop: {
      name: 'Laptop',
      brands: {
        apple: {
          name: 'Apple',
          series: {
            macbookpro: {
              name: 'MacBook Pro',
              models: {
                macbookpro13: { name: 'MacBook Pro 13"' },
                macbookpro14: { name: 'MacBook Pro 14"' },
                macbookpro16: { name: 'MacBook Pro 16"' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 299 },
                battery: { name: 'Battery Replacement', price: 149 },
                keyboard: { name: 'Keyboard Repair', price: 179 },
                storage: { name: 'Storage Upgrade', price: 199 },
                water: { name: 'Water Damage Treatment', price: 249 },
              }
            },
            macbookair: {
              name: 'MacBook Air',
              models: {
                macbookairm1: { name: 'MacBook Air M1' },
                macbookair2020: { name: 'MacBook Air (2020)' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 249 },
                battery: { name: 'Battery Replacement', price: 129 },
                keyboard: { name: 'Keyboard Repair', price: 159 },
                storage: { name: 'Storage Upgrade', price: 179 },
                water: { name: 'Water Damage Treatment', price: 219 },
              }
            }
          }
        },
        dell: {
          name: 'Dell',
          series: {
            xps: {
              name: 'XPS',
              models: {
                xps13: { name: 'XPS 13' },
                xps15: { name: 'XPS 15' },
                xps17: { name: 'XPS 17' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 219 },
                battery: { name: 'Battery Replacement', price: 109 },
                keyboard: { name: 'Keyboard Repair', price: 129 },
                storage: { name: 'Storage Upgrade', price: 149 },
                water: { name: 'Water Damage Treatment', price: 199 },
              }
            },
            inspiron: {
              name: 'Inspiron',
              models: {
                inspiron14: { name: 'Inspiron 14' },
                inspiron15: { name: 'Inspiron 15' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 179 },
                battery: { name: 'Battery Replacement', price: 89 },
                keyboard: { name: 'Keyboard Repair', price: 99 },
                storage: { name: 'Storage Upgrade', price: 129 },
                water: { name: 'Water Damage Treatment', price: 169 },
              }
            }
          }
        }
      }
    },
    tablet: {
      name: 'Tablet',
      brands: {
        apple: {
          name: 'Apple',
          series: {
            ipadpro: {
              name: 'iPad Pro',
              models: {
                ipadpro11: { name: 'iPad Pro 11"' },
                ipadpro12: { name: 'iPad Pro 12.9"' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 199 },
                battery: { name: 'Battery Replacement', price: 109 },
                charging: { name: 'Charging Port Repair', price: 89 },
                button: { name: 'Button Replacement', price: 69 },
                water: { name: 'Water Damage Treatment', price: 149 },
              }
            },
            ipadair: {
              name: 'iPad Air',
              models: {
                ipadair4: { name: 'iPad Air 4' },
                ipadair5: { name: 'iPad Air 5' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 169 },
                battery: { name: 'Battery Replacement', price: 89 },
                charging: { name: 'Charging Port Repair', price: 79 },
                button: { name: 'Button Replacement', price: 59 },
                water: { name: 'Water Damage Treatment', price: 129 },
              }
            }
          }
        },
        samsung: {
          name: 'Samsung',
          series: {
            galaxytabs: {
              name: 'Galaxy Tab S',
              models: {
                galaxytabs7: { name: 'Galaxy Tab S7' },
                galaxytabs7plus: { name: 'Galaxy Tab S7+' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 159 },
                battery: { name: 'Battery Replacement', price: 79 },
                charging: { name: 'Charging Port Repair', price: 69 },
                button: { name: 'Button Replacement', price: 49 },
                water: { name: 'Water Damage Treatment', price: 119 },
              }
            }
          }
        }
      }
    },
    desktop: {
      name: 'Desktop',
      brands: {
        apple: {
          name: 'Apple',
          series: {
            imac: {
              name: 'iMac',
              models: {
                imac24: { name: 'iMac 24"' },
                imac27: { name: 'iMac 27"' },
              },
              issues: {
                screen: { name: 'Screen Replacement', price: 399 },
                storage: { name: 'Storage Upgrade', price: 179 },
                memory: { name: 'Memory Upgrade', price: 149 },
                power: { name: 'Power Supply Repair', price: 169 },
                diagnostic: { name: 'Diagnostic & Tune Up', price: 99 },
              }
            },
            macmini: {
              name: 'Mac Mini',
              models: {
                macminim1: { name: 'Mac Mini M1' },
                macmini2018: { name: 'Mac Mini (2018)' },
              },
              issues: {
                storage: { name: 'Storage Upgrade', price: 159 },
                memory: { name: 'Memory Upgrade', price: 129 },
                power: { name: 'Power Supply Repair', price: 149 },
                diagnostic: { name: 'Diagnostic & Tune Up', price: 89 },
              }
            }
          }
        },
        custom: {
          name: 'Custom PC',
          series: {
            gaming: {
              name: 'Gaming PC',
              models: {
                gaminghigh: { name: 'High-End Gaming PC' },
                gamingmid: { name: 'Mid-Range Gaming PC' },
                gamingbudget: { name: 'Budget Gaming PC' },
              },
              issues: {
                gpu: { name: 'GPU Replacement/Upgrade', price: 149 },
                cpu: { name: 'CPU Replacement/Upgrade', price: 129 },
                storage: { name: 'Storage Upgrade', price: 99 },
                memory: { name: 'Memory Upgrade', price: 89 },
                power: { name: 'Power Supply Repair', price: 109 },
                cooling: { name: 'Cooling System Upgrade', price: 129 },
                diagnostic: { name: 'Diagnostic & Tune Up', price: 79 },
              }
            },
            office: {
              name: 'Office PC',
              models: {
                officepremium: { name: 'Premium Office PC' },
                officestandard: { name: 'Standard Office PC' },
              },
              issues: {
                storage: { name: 'Storage Upgrade', price: 89 },
                memory: { name: 'Memory Upgrade', price: 79 },
                power: { name: 'Power Supply Repair', price: 99 },
                diagnostic: { name: 'Diagnostic & Tune Up', price: 69 },
              }
            }
          }
        }
      }
    }
  };

  // Quality options pricing modifiers
  const qualityOptions = {
    standard: { name: 'Standard', multiplier: 1, warrantyDays: 90 },
    premium: { name: 'Premium', multiplier: 1.4, warrantyDays: 180 },
    genuine: { name: 'Genuine', multiplier: 2, warrantyDays: 365 }
  };
  
  // Step elements
  const progressSteps = document.querySelectorAll('.progress-step');
  const configSteps = document.querySelectorAll('.config-step');
  
  // Option selection functionality
  document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', function() {
      const step = this.closest('.config-step');
      step.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      
      // Enable the next button
      const nextButton = step.querySelector('.next-step');
      if (nextButton) {
        nextButton.disabled = false;
      }
      
      // Store selection for current step
      const stepId = step.id.split('-')[1];
      switch (stepId) {
        case '1':
          userSelections.deviceType = this.dataset.value;
          break;
        case '2':
          userSelections.brand = this.dataset.value;
          loadSeries();
          break;
        case '3':
          userSelections.series = this.dataset.value;
          loadModels();
          break;
        case '4':
          userSelections.model = this.dataset.value;
          loadIssues();
          break;
        case '5':
          userSelections.issue = this.dataset.value;
          break;
        case '6':
          userSelections.quality = this.dataset.value;
          break;
      }
    });
  });
  
  // Navigation buttons
  document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', function() {
      const currentStep = parseInt(this.closest('.config-step').id.split('-')[1]);
      const nextStep = parseInt(this.dataset.next);
      
      // Update progress indicators
      progressSteps[currentStep - 1].classList.add('completed');
      progressSteps[nextStep - 1].classList.add('active');
      
      // Hide current step and show next step
      document.getElementById(`step-${currentStep}`).classList.remove('active');
      document.getElementById(`step-${nextStep}`).classList.add('active');
    });
  });
  
  document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', function() {
      const currentStep = parseInt(this.closest('.config-step').id.split('-')[1]);
      const prevStep = parseInt(this.dataset.prev);
      
      // Update progress indicators
      progressSteps[currentStep - 1].classList.remove('active');
      progressSteps[prevStep - 1].classList.remove('completed');
      progressSteps[prevStep - 1].classList.add('active');
      
      // Hide current step and show previous step
      document.getElementById(`step-${currentStep}`).classList.remove('active');
      document.getElementById(`step-${prevStep}`).classList.add('active');
    });
  });
  
  // Get Quote button
  document.getElementById('get-quote').addEventListener('click', function() {
    generateQuote();
    
    // Hide current step and show results
    document.getElementById('step-6').classList.remove('active');
    document.getElementById('step-results').classList.add('active');
  });
  
  // Start over button
  document.getElementById('reconfigure').addEventListener('click', function() {
    // Reset all steps
    progressSteps.forEach((step, index) => {
      if (index === 0) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active');
        step.classList.remove('completed');
      }
    });
    
    // Reset all selections
    document.querySelectorAll('.option-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Disable continue buttons
    document.querySelectorAll('.next-step').forEach(button => {
      button.disabled = true;
    });
    
    // Reset user selections
    Object.keys(userSelections).forEach(key => {
      userSelections[key] = '';
    });
    
    // Reset quote add-ons
    document.querySelectorAll('.add-on-option input').forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Show first step
    configSteps.forEach(step => step.classList.remove('active'));
    document.getElementById('step-1').classList.add('active');
  });
  
  // Book appointment button
  document.getElementById('book-appointment').addEventListener('click', function() {
    alert('Thank you for your configuration! This would redirect to the appointment scheduling page in a live implementation.');
  });
  
  // Add-on options update total price
  document.querySelectorAll('.add-on-option input').forEach(checkbox => {
    checkbox.addEventListener('change', updateTotalWithAddons);
  });
  
  // Dynamic loading functions for each step
  function loadBrands() {
    const deviceType = userSelections.deviceType;
    const brandsContainer = document.querySelector('.brands');
    brandsContainer.innerHTML = '';
    
    if (deviceType && deviceDatabase[deviceType]) {
      const brands = deviceDatabase[deviceType].brands;
      
      for (const [brandId, brand] of Object.entries(brands)) {
        const brandCard = document.createElement('div');
        brandCard.className = 'option-card';
        brandCard.dataset.value = brandId;
        brandCard.innerHTML = `
          <div class="option-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h4>${brand.name}</h4>
        `;
        
        brandCard.addEventListener('click', function() {
          document.querySelectorAll('.brands .option-card').forEach(c => c.classList.remove('selected'));
          this.classList.add('selected');
          userSelections.brand = brandId;
          document.querySelector('#step-2 .next-step').disabled = false;
          loadSeries();
        });
        
        brandsContainer.appendChild(brandCard);
      }
    }
  }
  
  function loadSeries() {
    const { deviceType, brand } = userSelections;
    const seriesContainer = document.querySelector('.series');
    seriesContainer.innerHTML = '';
    
    if (deviceType && brand && deviceDatabase[deviceType] && deviceDatabase[deviceType].brands[brand]) {
      const seriesData = deviceDatabase[deviceType].brands[brand].series;
      
      for (const [seriesId, series] of Object.entries(seriesData)) {
        const seriesCard = document.createElement('div');
        seriesCard.className = 'option-card';
        seriesCard.dataset.value = seriesId;
        seriesCard.innerHTML = `
          <div class="option-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M7 9H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 13H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 17H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h4>${series.name}</h4>
        `;
        
        seriesCard.addEventListener('click', function() {
          document.querySelectorAll('.series .option-card').forEach(c => c.classList.remove('selected'));
          this.classList.add('selected');
          userSelections.series = seriesId;
          document.querySelector('#step-3 .next-step').disabled = false;
          loadModels();
        });
        
        seriesContainer.appendChild(seriesCard);
      }
    }
  }
  
  function loadModels() {
    const { deviceType, brand, series } = userSelections;
    const modelsContainer = document.querySelector('.models');
    modelsContainer.innerHTML = '';
    
    if (deviceType && brand && series && 
        deviceDatabase[deviceType] && 
        deviceDatabase[deviceType].brands[brand] && 
        deviceDatabase[deviceType].brands[brand].series[series]) {
      const modelsData = deviceDatabase[deviceType].brands[brand].series[series].models;
      
      for (const [modelId, model] of Object.entries(modelsData)) {
        const modelCard = document.createElement('div');
        modelCard.className = 'option-card';
        modelCard.dataset.value = modelId;
        modelCard.innerHTML = `
          <div class="option-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 9H3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h4>${model.name}</h4>
        `;
        
        modelCard.addEventListener('click', function() {
          document.querySelectorAll('.models .option-card').forEach(c => c.classList.remove('selected'));
          this.classList.add('selected');
          userSelections.model = modelId;
          document.querySelector('#step-4 .next-step').disabled = false;
          loadIssues();
        });
        
        modelsContainer.appendChild(modelCard);
      }
    }
  }
  
  function loadIssues() {
    const { deviceType, brand, series } = userSelections;
    const issuesContainer = document.querySelector('.issues');
    issuesContainer.innerHTML = '';
    
    if (deviceType && brand && series && 
        deviceDatabase[deviceType] && 
        deviceDatabase[deviceType].brands[brand] && 
        deviceDatabase[deviceType].brands[brand].series[series]) {
      const issuesData = deviceDatabase[deviceType].brands[brand].series[series].issues;
      
      for (const [issueId, issue] of Object.entries(issuesData)) {
        const issueCard = document.createElement('div');
        issueCard.className = 'option-card';
        issueCard.dataset.value = issueId;
        issueCard.innerHTML = `
          <div class="option-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 9L12 12.5L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 7L12 14L22 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 21L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h4>${issue.name}</h4>
          <p class="issue-price">From $${issue.price}</p>
        `;
        
        issueCard.addEventListener('click', function() {
          document.querySelectorAll('.issues .option-card').forEach(c => c.classList.remove('selected'));
          this.classList.add('selected');
          userSelections.issue = issueId;
          document.querySelector('#step-5 .next-step').disabled = false;
        });
        
        issuesContainer.appendChild(issueCard);
      }
    }
  }
  
  function generateQuote() {
    const { deviceType, brand, series, model, issue, quality } = userSelections;
    
    // Fill in device details
    document.getElementById('result-device').textContent = deviceDatabase[deviceType].name;
    document.getElementById('result-brand').textContent = deviceDatabase[deviceType].brands[brand].name;
    document.getElementById('result-series').textContent = deviceDatabase[deviceType].brands[brand].series[series].name;
    document.getElementById('result-model').textContent = deviceDatabase[deviceType].brands[brand].series[series].models[model].name;
    
    // Fill in service details
    const issueInfo = deviceDatabase[deviceType].brands[brand].series[series].issues[issue];
    const qualityInfo = qualityOptions[quality];
    
    document.getElementById('result-issue').textContent = issueInfo.name;
    document.getElementById('result-quality').textContent = `${qualityInfo.name} Quality`;
    document.getElementById('result-warranty').textContent = `${qualityInfo.warrantyDays}-Day Warranty`;
    
    // Set service time based on quality
    let serviceTime = "Standard Service (2-3 days)";
    if (quality === 'premium') {
      serviceTime = "Priority Service (1-2 days)";
    } else if (quality === 'genuine') {
      serviceTime = "Express Service (Same day)";
    }
    document.getElementById('result-time').textContent = serviceTime;
    
    // Calculate prices
    const basePrice = issueInfo.price;
    const qualityUpgrade = Math.round((qualityInfo.multiplier - 1) * basePrice);
    
    document.getElementById('base-price').textContent = `$${basePrice.toFixed(2)}`;
    document.getElementById('quality-price').textContent = `$${qualityUpgrade.toFixed(2)}`;
    document.getElementById('parts-price').textContent = `$0.00`;
    
    const totalPrice = basePrice + qualityUpgrade;
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
    
    // Update quality card prices in step 6
    document.querySelectorAll('.quality-card').forEach(card => {
      const type = card.dataset.value;
      const qualityOption = qualityOptions[type];
      const price = Math.round(basePrice * qualityOption.multiplier);
      card.querySelector('.quality-price').textContent = `$${price}`;
    });
    
    // Add event listeners for add-ons
    updateTotalWithAddons();
  }
  
  function updateTotalWithAddons() {
    const baseTotal = parseFloat(document.getElementById('total-price').textContent.replace('$', ''));
    let addOnTotal = 0;
    
    // Calculate add-ons
    document.querySelectorAll('.add-on-option input:checked').forEach(checkbox => {
      const priceText = checkbox.parentElement.querySelector('.add-on-price').textContent;
      const price = parseFloat(priceText.replace('+$', ''));
      addOnTotal += price;
    });
    
    // Update total
    const newTotal = baseTotal + addOnTotal;
    document.getElementById('total-price').textContent = `$${newTotal.toFixed(2)}`;
  }
  
  // Initialize event listeners for device type step
  document.querySelectorAll('#step-1 .option-card').forEach(card => {
    card.addEventListener('click', function() {
      loadBrands();
    });
  });
  
  // Initialize the steps navigation
  progressSteps.forEach((step, index) => {
    if (index === 0) {
      step.classList.add('active');
    }
  });
}