// AZ-700 Study Guide Interactive Functionality
class AZ700StudyGuide {
    constructor() {
        this.currentPage = 'index';
        this.progress = this.loadProgress();
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initProgressTracking();
        this.initInteractiveElements();
        this.initPracticeQuestions();
        this.initNetworkDiagrams();
    }

    // Scroll animations using Anime.js
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    if (element.classList.contains('fade-in-up')) {
                        anime({
                            targets: element,
                            translateY: [30, 0],
                            opacity: [0, 1],
                            duration: 600,
                            easing: 'easeOutQuart',
                            delay: element.dataset.delay || 0
                        });
                    }
                    
                    if (element.classList.contains('scale-in')) {
                        anime({
                            targets: element,
                            scale: [0.8, 1],
                            opacity: [0, 1],
                            duration: 500,
                            easing: 'easeOutBack'
                        });
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-up, .scale-in').forEach(el => {
            observer.observe(el);
        });
    }

    // Progress tracking system
    initProgressTracking() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const progress = bar.dataset.progress || 0;
            anime({
                targets: bar.querySelector('.progress-fill'),
                width: `${progress}%`,
                duration: 1000,
                easing: 'easeOutQuart',
                delay: 500
            });
        });

        // Update progress when sections are completed
        this.updateSectionProgress();
    }

    updateSectionProgress() {
        const sections = document.querySelectorAll('.study-section');
        sections.forEach(section => {
            const checkboxes = section.querySelectorAll('input[type="checkbox"]');
            const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
            const total = checkboxes.length;
            const progress = total > 0 ? (completed / total) * 100 : 0;
            
            const progressBar = section.querySelector('.section-progress');
            if (progressBar) {
                anime({
                    targets: progressBar,
                    width: `${progress}%`,
                    duration: 800,
                    easing: 'easeOutQuart'
                });
            }
        });
    }

    // Interactive elements
    initInteractiveElements() {
        // Service comparison cards
        const comparisonCards = document.querySelectorAll('.service-card');
        comparisonCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    translateY: -8,
                    boxShadow: '0 20px 40px rgba(0, 120, 212, 0.15)',
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            });

            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    translateY: 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    duration: 300,
                    easing: 'easeOutQuart'
                });
            });
        });

        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(button.dataset.tab);
            });
        });

        // Accordion functionality
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isOpen = content.style.maxHeight;
                
                // Close all other accordions
                document.querySelectorAll('.accordion-content').forEach(acc => {
                    acc.style.maxHeight = null;
                    acc.previousElementSibling.classList.remove('active');
                });
                
                if (!isOpen) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    header.classList.add('active');
                }
            });
        });
    }

    switchTab(tabId) {
        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedContent = document.getElementById(tabId);
        if (selectedContent) {
            selectedContent.classList.add('active');
            
            // Animate content appearance
            anime({
                targets: selectedContent.children,
                translateY: [20, 0],
                opacity: [0, 1],
                duration: 400,
                delay: anime.stagger(100),
                easing: 'easeOutQuart'
            });
        }
        
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    }

    // Practice questions functionality
    initPracticeQuestions() {
        const questions = document.querySelectorAll('.practice-question');
        questions.forEach((question, index) => {
            this.setupQuestion(question, index);
        });
    }

    setupQuestion(questionEl, index) {
        const options = questionEl.querySelectorAll('.option');
        const submitBtn = questionEl.querySelector('.submit-answer');
        const explanation = questionEl.querySelector('.explanation');
        
        let selectedOption = null;
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove previous selections
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Select current option
                option.classList.add('selected');
                selectedOption = option;
                
                // Enable submit button
                submitBtn.disabled = false;
                submitBtn.classList.add('enabled');
            });
        });
        
        submitBtn.addEventListener('click', () => {
            if (selectedOption) {
                this.checkAnswer(questionEl, selectedOption, explanation);
            }
        });
    }

    checkAnswer(questionEl, selectedOption, explanation) {
        const isCorrect = selectedOption.dataset.correct === 'true';
        
        // Disable all options
        const options = questionEl.querySelectorAll('.option');
        options.forEach(option => {
            option.style.pointerEvents = 'none';
            if (option.dataset.correct === 'true') {
                option.classList.add('correct');
            } else if (option === selectedOption && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        // Show explanation
        if (explanation) {
            explanation.style.display = 'block';
            anime({
                targets: explanation,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 400,
                easing: 'easeOutQuart'
            });
        }
        
        // Update progress
        this.updateQuestionProgress(isCorrect);
    }

    updateQuestionProgress(isCorrect) {
        if (isCorrect) {
            this.progress.correctAnswers = (this.progress.correctAnswers || 0) + 1;
        }
        this.progress.totalQuestions = (this.progress.totalQuestions || 0) + 1;
        this.saveProgress();
        
        // Update UI
        this.updateProgressDisplay();
    }

    // Network diagrams with ECharts
    initNetworkDiagrams() {
        const diagramContainers = document.querySelectorAll('.network-diagram');
        diagramContainers.forEach(container => {
            this.createNetworkDiagram(container);
        });
    }

    createNetworkDiagram(container) {
        const chart = echarts.init(container);
        
        const option = {
            backgroundColor: 'transparent',
            series: [{
                type: 'graph',
                layout: 'force',
                animation: true,
                roam: true,
                focusNodeAdjacency: true,
                force: {
                    repulsion: 1000,
                    edgeLength: 200
                },
                data: [
                    { name: 'VNet', x: 0, y: 0, symbolSize: 60, itemStyle: { color: '#0078D4' } },
                    { name: 'Subnet 1', x: -100, y: -50, symbolSize: 40, itemStyle: { color: '#00BCF2' } },
                    { name: 'Subnet 2', x: 100, y: -50, symbolSize: 40, itemStyle: { color: '#00BCF2' } },
                    { name: 'VPN Gateway', x: -150, y: 50, symbolSize: 50, itemStyle: { color: '#107C10' } },
                    { name: 'App Gateway', x: 150, y: 50, symbolSize: 50, itemStyle: { color: '#FF8C00' } }
                ],
                links: [
                    { source: 'VNet', target: 'Subnet 1' },
                    { source: 'VNet', target: 'Subnet 2' },
                    { source: 'VNet', target: 'VPN Gateway' },
                    { source: 'VNet', target: 'App Gateway' }
                ],
                label: {
                    show: true,
                    position: 'bottom',
                    fontSize: 12,
                    color: '#2D3748'
                },
                lineStyle: {
                    color: '#0078D4',
                    width: 2,
                    curveness: 0.1
                }
            }]
        };
        
        chart.setOption(option);
        
        // Resize chart on window resize
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    // Progress persistence
    loadProgress() {
        const saved = localStorage.getItem('az700-progress');
        return saved ? JSON.parse(saved) : {
            correctAnswers: 0,
            totalQuestions: 0,
            completedSections: []
        };
    }

    saveProgress() {
        localStorage.setItem('az700-progress', JSON.stringify(this.progress));
    }

    updateProgressDisplay() {
        const progressText = document.getElementById('progress-text');
        if (progressText) {
            const percentage = this.progress.totalQuestions > 0 
                ? Math.round((this.progress.correctAnswers / this.progress.totalQuestions) * 100)
                : 0;
            progressText.textContent = `${this.progress.correctAnswers}/${this.progress.totalQuestions} (${percentage}%)`;
        }
    }

    // Utility functions
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard!');
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        anime({
            targets: notification,
            translateY: [-50, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuart',
            complete: () => {
                setTimeout(() => {
                    anime({
                        targets: notification,
                        opacity: 0,
                        duration: 300,
                        complete: () => notification.remove()
                    });
                }, 2000);
            }
        });
    }
}

// Initialize the study guide when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.az700Guide = new AZ700StudyGuide();
});

// Network topology data for different scenarios
const networkTopologies = {
    hubSpoke: {
        nodes: [
            { name: 'Hub VNet', category: 0, symbolSize: 80 },
            { name: 'Spoke VNet 1', category: 1, symbolSize: 60 },
            { name: 'Spoke VNet 2', category: 1, symbolSize: 60 },
            { name: 'On-premises', category: 2, symbolSize: 70 }
        ],
        links: [
            { source: 'Hub VNet', target: 'Spoke VNet 1' },
            { source: 'Hub VNet', target: 'Spoke VNet 2' },
            { source: 'Hub VNet', target: 'On-premises' }
        ]
    },
    
    loadBalancing: {
        nodes: [
            { name: 'App Gateway', category: 0, symbolSize: 70 },
            { name: 'VM 1', category: 1, symbolSize: 50 },
            { name: 'VM 2', category: 1, symbolSize: 50 },
            { name: 'VM 3', category: 1, symbolSize: 50 },
            { name: 'Client', category: 2, symbolSize: 40 }
        ],
        links: [
            { source: 'Client', target: 'App Gateway' },
            { source: 'App Gateway', target: 'VM 1' },
            { source: 'App Gateway', target: 'VM 2' },
            { source: 'App Gateway', target: 'VM 3' }
        ]
    }
};

// Practice questions database
const practiceQuestions = [
    {
        id: 1,
        category: 'Core Networking',
        question: 'What is the maximum number of subnets you can create in a single VNet?',
        options: [
            { text: '1000', correct: false },
            { text: '2000', correct: false },
            { text: '3000', correct: true },
            { text: '5000', correct: false }
        ],
        explanation: 'Azure allows up to 3000 subnets per virtual network, providing ample capacity for complex network architectures.'
    },
    {
        id: 2,
        category: 'VPN Gateway',
        question: 'Which VPN Gateway SKU supports active-active mode?',
        options: [
            { text: 'Basic', correct: false },
            { text: 'VpnGw1', correct: false },
            { text: 'VpnGw2', correct: true },
            { text: 'All SKUs', correct: false }
        ],
        explanation: 'VpnGw2 and higher SKUs support active-active mode for high availability and redundancy.'
    },
    {
        id: 3,
        category: 'Application Gateway',
        question: 'What layer does Azure Application Gateway operate at?',
        options: [
            { text: 'Layer 3 (Network)', correct: false },
            { text: 'Layer 4 (Transport)', correct: false },
            { text: 'Layer 7 (Application)', correct: true },
            { text: 'Layer 2 (Data Link)', correct: false }
        ],
        explanation: 'Application Gateway is a Layer 7 load balancer that provides application delivery controller functionality.'
    }
];