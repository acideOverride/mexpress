// Gallery Experience Interactive Elements

document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    const galleryExperience = document.querySelector('.gallery-experience');
    const waterLoader = document.querySelector('.water-loader');
    const galleryGrid = document.getElementById('gallery-grid');
    const fullscreenView = document.getElementById('fullscreen-view');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const fullscreenTitle = document.getElementById('fullscreen-title');
    const fullscreenDescription = document.getElementById('fullscreen-description');
    const fullscreenDimensions = document.getElementById('fullscreen-dimensions');
    const fullscreenYear = document.getElementById('fullscreen-year');
    const closeFullscreenBtn = document.querySelector('.close-fullscreen');
    const prevImageBtn = document.getElementById('prev-image');
    const nextImageBtn = document.getElementById('next-image');
    const themeToggle = document.querySelector('.theme-toggle');
    const seriesToggle = document.querySelector('.series-toggle');
    const seriesDropdown = document.querySelector('.series-dropdown');
    const seriesLinks = document.querySelectorAll('.series-dropdown a');
    const seriesTitle = document.querySelector('.series-title');
    const seriesText = document.querySelector('.series-text');
    const visibleCountSpan = document.getElementById('visible-count');
    const waterTransition = document.querySelector('.water-transition');
    const floatingNav = document.querySelector('.floating-nav');

    let currentGalleryItems = [];
    let currentItemIndex = 0;
    let lastScrollY = window.scrollY;
    let isNavVisible = true;
    
    // Mock data for fullscreen view (would be replaced with real data in production)
    const mockDimensions = [
        "80 × 120 cm", "70 × 105 cm", "90 × 135 cm", "60 × 90 cm", 
        "100 × 150 cm", "50 × 75 cm", "40 × 60 cm"
    ];
    
    const mockYears = [
        "2024", "2023", "2022", "2021", "2020", "2019", "2018"
    ];
    
    const seriesDescriptions = {
        'all': {
            title: 'GALERIE COMPLÈTE',
            text: 'Explorez les sept collections photographiques de Giandra, chacune capturant l\'essence pure de l\'eau sans aucune retouche numérique. Les photographies présentent l\'eau comme élément central, révélant sa texture, mouvement et lumière naturelle.'
        },
        'renverser': {
            title: 'RENVERSER LES MONTAGNES',
            text: 'Cette série explore le dialogue entre les sommets majestueux et leur reflet parfait sur l\'eau. Sans manipulation numérique, ces images capturent le moment où la montagne et son reflet deviennent indiscernables, remettant en question notre perception de la réalité et de l\'orientation.'
        },
        'giverny': {
            title: 'COMME A GIVERNY',
            text: 'Un hommage moderne aux nymphéas de Claude Monet, cette collection capture la surface miroitante de l\'eau avec ses jeux de lumière naturelle, créant des œuvres qui évoquent l\'impressionnisme tout en restant ancrées dans la photographie pure.'
        },
        'cosmogonie': {
            title: 'COSMOGONIE',
            text: 'Quand l\'eau devient miroir de l\'univers. Ces photographies révèlent comment les motifs naturels formés sur l\'eau reflètent étrangement les structures cosmiques, créant des parallèles visuels entre le microcosme et le macrocosme.'
        },
        'tisser': {
            title: 'TISSER LA MATIERE',
            text: 'Cette série explore la texture physique de l\'eau, ses ondulations, ses rides et ses motifs complexes. Chaque image révèle comment l\'eau, bien que fluide, manifeste une matérialité et une structure propres.'
        },
        'esprits': {
            title: 'ESPRITS DE NOTRE ESPRIT',
            text: 'Une exploration des formes évanescentes qui émergent naturellement sur la surface de l\'eau, évoquant des silhouettes et des visages. Cette série joue sur la tendance humaine à percevoir des formes familières dans les motifs aléatoires.'
        },
        'surfing': {
            title: 'Surfing Angels',
            text: 'La seule série incorporant des figures humaines, Surfing Angels capture la danse entre les surfeurs et les vagues. Ces images saisissent l\'harmonie parfaite entre l\'homme et l\'élément aquatique dans un ballet silencieux et puissant.'
        },
        'bleu': {
            title: 'LE GRAND BLEU',
            text: 'Une plongée dans les profondeurs de l\'océan, cette série explore les nuances infinies du bleu marin. Ces photographies évoquent le calme, la méditation et l\'immensité de l\'eau qui recouvre la majorité de notre planète.'
        }
    };

    // Custom cursor implementation
    function createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        
        document.addEventListener('mousedown', () => {
            cursor.classList.add('click');
            setTimeout(() => {
                cursor.classList.remove('click');
            }, 300);
        });
        
        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    // Loading sequence
    function initLoader() {
        // Simulate loading time (would be replaced with actual asset loading in production)
        setTimeout(() => {
            waterLoader.classList.add('hidden');
        }, 2000);
    }

    // Theme toggle functionality
    function initThemeToggle() {
        const savedTheme = localStorage.getItem('giandra-theme');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('giandra-theme', 
                document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    // Series filter functionality
    function initSeriesFilter() {
        seriesToggle.addEventListener('click', () => {
            seriesToggle.classList.toggle('active');
            seriesDropdown.classList.toggle('visible');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!seriesToggle.contains(e.target) && !seriesDropdown.contains(e.target)) {
                seriesToggle.classList.remove('active');
                seriesDropdown.classList.remove('visible');
            }
        });
        
        // Filter items by series
        seriesLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                seriesLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Get selected series
                const series = link.getAttribute('data-series');
                
                // Update series description
                if (seriesDescriptions[series]) {
                    seriesTitle.textContent = seriesDescriptions[series].title;
                    seriesText.textContent = seriesDescriptions[series].text;
                }
                
                // Filter gallery items
                filterGalleryItems(series);
                
                // Close dropdown
                seriesToggle.classList.remove('active');
                seriesDropdown.classList.remove('visible');
                
                // Animate transition
                animatePageTransition();
            });
        });
    }

    // Gallery filtering logic
    function filterGalleryItems(series) {
        const allItems = document.querySelectorAll('.gallery-item');
        let visibleCount = 0;
        
        allItems.forEach(item => {
            if (series === 'all' || item.getAttribute('data-series') === series) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });
        
        // Update visible count
        visibleCountSpan.textContent = visibleCount;
        
        // Update currentGalleryItems for fullscreen navigation
        currentGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    }

    // Initialize gallery item click events
    function initGalleryItems() {
        const allItems = document.querySelectorAll('.gallery-item');
        
        allItems.forEach((item, index) => {
            // Add staggered animation delay
            item.style.animationDelay = `${index * 0.1}s`;
            
            // Add click handler for fullscreen view
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').getAttribute('src');
                const title = item.querySelector('h3').textContent;
                const description = item.querySelector('p').textContent;
                
                // Get random mock data (would be real data in production)
                const randomDimension = mockDimensions[Math.floor(Math.random() * mockDimensions.length)];
                const randomYear = mockYears[Math.floor(Math.random() * mockYears.length)];
                
                // Set fullscreen content
                fullscreenImage.setAttribute('src', imgSrc);
                fullscreenImage.setAttribute('alt', title);
                fullscreenTitle.textContent = title;
                fullscreenDescription.textContent = description;
                fullscreenDimensions.textContent = `Dimensions: ${randomDimension}`;
                fullscreenYear.textContent = `Année: ${randomYear}`;
                
                // Update current item index
                currentGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
                currentItemIndex = currentGalleryItems.indexOf(item);
                
                // Show fullscreen view
                fullscreenView.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Initialize with all items visible
        currentGalleryItems = Array.from(allItems);
    }

    // Fullscreen view navigation
    function initFullscreenNavigation() {
        // Close fullscreen view
        closeFullscreenBtn.addEventListener('click', () => {
            fullscreenView.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && fullscreenView.classList.contains('active')) {
                fullscreenView.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Check URL params for collection filter
        function getCollectionFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('collection');
        }
        
        // Apply collection filter if specified in URL
        const collectionParam = getCollectionFromUrl();
        if (collectionParam) {
            // Find the matching link and trigger click
            const collectionLinks = document.querySelectorAll('.series-dropdown a');
            collectionLinks.forEach(link => {
                if (link.getAttribute('data-series') === collectionParam) {
                    setTimeout(() => {
                        link.click();
                    }, 1000); // Delay to allow page to load first
                }
            });
        }
        
        // Previous image
        prevImageBtn.addEventListener('click', () => {
            if (currentGalleryItems.length <= 1) return;
            
            currentItemIndex = (currentItemIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
            updateFullscreenContent(currentGalleryItems[currentItemIndex]);
        });
        
        // Next image
        nextImageBtn.addEventListener('click', () => {
            if (currentGalleryItems.length <= 1) return;
            
            currentItemIndex = (currentItemIndex + 1) % currentGalleryItems.length;
            updateFullscreenContent(currentGalleryItems[currentItemIndex]);
        });
        
        // Arrow keys navigation
        document.addEventListener('keydown', (e) => {
            if (!fullscreenView.classList.contains('active')) return;
            
            if (e.key === 'ArrowLeft') {
                prevImageBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextImageBtn.click();
            }
        });
    }

    // Update fullscreen content
    function updateFullscreenContent(item) {
        // Animate transition
        fullscreenImage.style.opacity = '0';
        fullscreenImage.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            const imgSrc = item.querySelector('img').getAttribute('src');
            const title = item.querySelector('h3').textContent;
            const description = item.querySelector('p').textContent;
            
            // Get random mock data (would be real data in production)
            const randomDimension = mockDimensions[Math.floor(Math.random() * mockDimensions.length)];
            const randomYear = mockYears[Math.floor(Math.random() * mockYears.length)];
            
            // Set fullscreen content
            fullscreenImage.setAttribute('src', imgSrc);
            fullscreenImage.setAttribute('alt', title);
            fullscreenTitle.textContent = title;
            fullscreenDescription.textContent = description;
            fullscreenDimensions.textContent = `Dimensions: ${randomDimension}`;
            fullscreenYear.textContent = `Année: ${randomYear}`;
            
            // Show image again
            fullscreenImage.style.opacity = '1';
            fullscreenImage.style.transform = 'scale(1)';
        }, 300);
    }

    // Animate page transition
    function animatePageTransition() {
        waterTransition.classList.add('active');
        
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                waterTransition.classList.remove('active');
            }, 600);
        }, 400);
    }

    // Floating navigation visibility
    function initNavVisibility() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Determine scroll direction
            if (currentScrollY > lastScrollY + 10) {
                // Scrolling down - hide nav
                if (isNavVisible) {
                    floatingNav.classList.add('hidden');
                    isNavVisible = false;
                }
            } else if (currentScrollY < lastScrollY - 10) {
                // Scrolling up - show nav
                if (!isNavVisible) {
                    floatingNav.classList.remove('hidden');
                    isNavVisible = true;
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // Prevent image download
    function preventImageDownload() {
        const allImages = document.querySelectorAll('img');
        
        allImages.forEach(img => {
            img.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });
            
            img.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
        });
    }

    // Simulate image loading with subtle animations
    function simulateImageLoading() {
        const galleryImages = document.querySelectorAll('.gallery-item img');
        
        galleryImages.forEach((img, index) => {
            // Set initial state and add loading handler
            img.style.opacity = '0';
            img.style.filter = 'blur(5px)';
            
            // Use real image loading events
            img.onload = function() {
                // Add delay to simulate progressive loading
                setTimeout(() => {
                    img.style.opacity = '1';
                    img.style.filter = 'blur(0)';
                    
                    // Add slight motion to make the loading feel more organic
                    const randomDirection = Math.random() > 0.5 ? 1 : -1;
                    const randomAmount = (Math.random() * 10 + 5) * randomDirection;
                    
                    img.style.transform = `translateY(${randomAmount}px)`;
                    
                    setTimeout(() => {
                        img.style.transform = 'translateY(0)';
                    }, 500);
                }, index * 100);
            };
            
            // Handle image loading errors
            img.onerror = function() {
                // Fallback to placeholder
                img.src = '../img/placeholder1.svg';
                img.style.opacity = '1';
                img.style.filter = 'blur(0)';
            };
        });
    }

    // Initialize all features
    function init() {
        initLoader();
        createCustomCursor();
        initThemeToggle();
        initSeriesFilter();
        initGalleryItems();
        initFullscreenNavigation();
        initNavVisibility();
        preventImageDownload();
        simulateImageLoading();
        
        // Set default values
        filterGalleryItems('all');
    }

    // Start initialization
    init();
});