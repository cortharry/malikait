/**
 * SPH Corporate Website - Main JavaScript File
 * Handles dynamic behavior, form validation, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load section content dynamically
    loadSection('header-container', 'sections/header.html');
    loadSection('services-container', 'sections/services.html');
    loadSection('products-container', 'sections/products.html');
    loadSection('about-container', 'sections/about.html');
    loadSection('career-container', 'sections/career.html');
    loadSection('team-container', 'sections/team.html');
    loadSection('contact-container', 'sections/contact.html');
    
    // Initialize components after sections are loaded
    setTimeout(initializeComponents, 100);
    
    // Set current year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize counters for About section
    initCounters();
    
    // Initialize forms
    initForms();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Initialize career section functionality using event delegation
    initCareerEventDelegation();
});

/**
 * Load section content from external HTML files
 */
async function loadSection(containerId, filePath) {
    try {
        const response = await fetch(filePath);
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        document.getElementById(containerId).innerHTML = `<p>Error loading content. Please try again later.</p>`;
    }
}

/**
 * Initialize all components after sections are loaded
 */
function initializeComponents() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Sticky header on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Tab functionality for About section
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                button.classList.add('active');
                if (document.getElementById(tabId)) {
                    document.getElementById(tabId).classList.add('active');
                }
            });
        });
    }
    
    // Product slider functionality
    initProductSlider();
    
    // Team member hover effects
    initTeamHoverEffects();
}

/**
 * Initialize counters for About section
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            
            // Lower inc to slow and higher to speed
            const inc = target / speed;
            
            // Check if target is reached
            if (count < target) {
                // Add inc to count and output in counter
                counter.innerText = Math.ceil(count + inc);
                // Call function every ms
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        // Start counting when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

/**
 * Initialize form validation and submission
 */
function initForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            const formMessage = document.getElementById('formMessage');
            
            let valid = true;
            
            // Reset previous error states
            [name, email, message].forEach(field => {
                if (field) field.style.borderColor = '';
            });
            
            // Validate name
            if (name.value.trim() === '') {
                name.style.borderColor = '#dc3545';
                valid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                email.style.borderColor = '#dc3545';
                valid = false;
            }
            
            // Validate message
            if (message.value.trim() === '') {
                message.style.borderColor = '#dc3545';
                valid = false;
            }
            
            if (valid) {
                // In a real application, you would send data to a server here
                // For demo purposes, we'll show a success message
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            } else {
                formMessage.textContent = 'Please fill in all required fields correctly.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            }
        });
    }
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize product slider functionality
 */
function initProductSlider() {
    const productGrid = document.querySelector('.products-grid');
    if (!productGrid) return;
    
    // Create navigation buttons for slider
    const productsSection = document.querySelector('.products');
    if (productsSection) {
        const sliderNav = document.createElement('div');
        sliderNav.className = 'slider-nav';
        sliderNav.innerHTML = `
            <button class="slider-prev"><i class="fas fa-chevron-left"></i></button>
            <button class="slider-next"><i class="fas fa-chevron-right"></i></button>
        `;
        
        productsSection.querySelector('.container').appendChild(sliderNav);
        
        // Add event listeners for navigation
        const prevBtn = sliderNav.querySelector('.slider-prev');
        const nextBtn = sliderNav.querySelector('.slider-next');
        
        let scrollAmount = 0;
        const scrollStep = 350;
        
        prevBtn.addEventListener('click', () => {
            productGrid.scrollBy({
                left: -scrollStep,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', () => {
            productGrid.scrollBy({
                left: scrollStep,
                behavior: 'smooth'
            });
        });
        
        // Hide/show buttons based on scroll position
        productGrid.addEventListener('scroll', () => {
            const maxScroll = productGrid.scrollWidth - productGrid.clientWidth;
            
            if (productGrid.scrollLeft <= 10) {
                prevBtn.style.opacity = '0.5';
                prevBtn.disabled = true;
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.disabled = false;
            }
            
            if (productGrid.scrollLeft >= maxScroll - 10) {
                nextBtn.style.opacity = '0.5';
                nextBtn.disabled = true;
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.disabled = false;
            }
        });
        
        // Initial state
        prevBtn.style.opacity = '0.5';
        prevBtn.disabled = true;
    }
}

/**
 * Initialize team member hover effects
 */
function initTeamHoverEffects() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section, .section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Utility function to format numbers with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ==================== CAREER SECTION (Event Delegation) ==================== */

/**
 * Initialize event delegation for career section (Apply Now & Back to Jobs)
 * This ensures buttons work even if career.html loads later.
 */
function initCareerEventDelegation() {
    // Listen for clicks on the whole document (or a specific container like #career-container)
    document.addEventListener('click', function(e) {
        // Check if the clicked element or its parent is an Apply Now button
        const applyBtn = e.target.closest('.apply-now-btn');
        if (applyBtn) {
            e.preventDefault(); // Prevent any default action
            const jobId = applyBtn.getAttribute('data-job-id');
            const jobTitle = applyBtn.getAttribute('data-job-title');
            if (jobId && jobTitle) {
                handleApplyClick(jobId, jobTitle);
            }
            return;
        }
        
        // Check if the clicked element is the Back to Jobs button
        const backBtn = e.target.closest('.back-to-jobs-btn');
        if (backBtn) {
            e.preventDefault();
            handleBackToJobsClick();
            return;
        }
    });
    
    // Also initialize file uploads and form submission (these elements exist only after career is loaded)
    // We'll set up file upload listeners when the career section is loaded, but we can also use event delegation for form submit.
    // Better to set up form submission once the form exists, using a mutation observer or simply check after load.
    // We'll add a small helper to initialize file uploads when career appears.
    waitForElement('#career', function() {
        initCareerFileUploads();
        initCareerFormSubmission();
    });
}

/**
 * Wait for an element to appear in the DOM (useful for dynamically loaded content)
 */
function waitForElement(selector, callback) {
    if (document.querySelector(selector)) {
        callback();
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

/**
 * Handle Apply Now button click
 */
function handleApplyClick(jobId, jobTitle) {
    const jobListView = document.getElementById('jobListingsView');
    const applicationView = document.getElementById('applicationView');
    const selectedJobTitle = document.getElementById('selectedJobTitle');
    const jobIdInput = document.getElementById('jobId');
    const jobTitleField = document.getElementById('jobTitleField');
    
    if (!jobListView || !applicationView) return;
    
    // Update form fields
    if (selectedJobTitle) selectedJobTitle.textContent = jobTitle;
    if (jobIdInput) jobIdInput.value = jobId;
    if (jobTitleField) jobTitleField.value = jobTitle;
    
    // Load job details
    loadJobDetails(jobId);
    
    // Switch views
    jobListView.style.display = 'none';
    applicationView.style.display = 'block';
    
    // Scroll to top of application view
    window.scrollTo({ top: applicationView.offsetTop - 100, behavior: 'smooth' });
}

/**
 * Handle Back to Jobs button click
 */
function handleBackToJobsClick() {
    const jobListView = document.getElementById('jobListingsView');
    const applicationView = document.getElementById('applicationView');
    
    if (!jobListView || !applicationView) return;
    
    applicationView.style.display = 'none';
    jobListView.style.display = 'block';
    
    // Scroll to career section
    document.getElementById('career').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Load job details into the application view
 */
function loadJobDetails(jobId) {
    const jobData = {
        'devops-engineer': {
            title: 'DevOps Engineer',
            summary: 'The DevOps Engineer is responsible for designing automated CI/CD systems, managing Kubernetes-based deployments, implementing observability stacks, enforcing security compliance, and ensuring reliable and scalable DevOps infrastructure.',
            qualification: [
                'Bachelor\'s degree in Computer Science, Engineering, or related field',
                '3+ years of experience in DevOps/SRE roles',
                'Certifications in AWS, Azure, or Kubernetes (preferred)',
                'Strong understanding of Linux/Unix administration'
            ],
            responsibilities: [
                'Design and implement CI/CD pipelines using Jenkins, GitLab CI, or similar',
                'Manage and optimize Kubernetes clusters and container orchestration',
                'Implement monitoring, logging, and observability solutions',
                'Automate infrastructure provisioning using Terraform or CloudFormation',
                'Ensure security compliance and implement best practices',
                'Collaborate with development teams to optimize application performance'
            ],
            requirements: [
                'Proficiency with container technologies (Docker, Kubernetes)',
                'Experience with cloud platforms (AWS, Azure, GCP)',
                'Strong scripting skills (Bash, Python, PowerShell)',
                'Knowledge of Infrastructure as Code (Terraform, Ansible)',
                'Experience with monitoring tools (Prometheus, Grafana, ELK stack)',
                'Understanding of networking and security principles'
            ],
            benefits: [
                'Flexible working hours and remote work options',
                'Annual training and certification budget',
                'Latest hardware and software tools',
                'Opportunity to work with cutting-edge technologies',
                'Career growth and mentorship programs',
                'Participation in tech conferences and events'
            ]
        },
        'senior-fullstack': {
            title: 'Senior Full-Stack Developer',
            summary: 'Lead development of web applications using React, Node.js, and cloud platforms. Mentor junior developers and architect scalable solutions for enterprise clients.',
            qualification: [
                'Bachelor\'s degree in Computer Science or related field',
                '5+ years of full-stack development experience',
                'Experience with modern JavaScript frameworks',
                'Strong understanding of software architecture'
            ],
            responsibilities: [
                'Develop and maintain web applications using React and Node.js',
                'Design and implement RESTful APIs',
                'Mentor junior developers and conduct code reviews',
                'Architect scalable and maintainable solutions',
                'Collaborate with cross-functional teams'
            ],
            requirements: [
                'Expertise in React.js and Node.js',
                'Experience with databases (MongoDB, PostgreSQL)',
                'Knowledge of cloud platforms (AWS, Azure)',
                'Understanding of CI/CD pipelines',
                'Strong problem-solving skills'
            ],
            benefits: [
                'Flexible working hours',
                'Professional development budget',
                'Latest development tools',
                'Annual performance bonus',
                'Health insurance coverage'
            ]
        },
        'cybersecurity-analyst': {
            title: 'Cybersecurity Analyst',
            summary: 'Monitor security systems, conduct vulnerability assessments, and implement security measures to protect organizational assets and data.',
            qualification: [
                'Bachelor\'s degree in Cybersecurity or related field',
                '3+ years of security operations experience',
                'Relevant certifications (CISSP, CEH, Security+)',
                'Strong understanding of security frameworks'
            ],
            responsibilities: [
                'Monitor security alerts and incidents',
                'Conduct vulnerability assessments and penetration tests',
                'Implement and manage security tools',
                'Develop security policies and procedures',
                'Respond to security incidents'
            ],
            requirements: [
                'Knowledge of security tools (SIEM, IDS/IPS)',
                'Understanding of network protocols',
                'Experience with vulnerability scanning',
                'Knowledge of compliance standards',
                'Strong analytical skills'
            ],
            benefits: [
                'Certification reimbursement',
                'Security training programs',
                'Latest security tools',
                'Competitive salary',
                'Comprehensive benefits package'
            ]
        },
        'data-scientist': {
            title: 'Data Scientist',
            summary: 'Develop machine learning models, analyze large datasets, and provide data-driven insights to drive business decisions and product improvements.',
            qualification: [
                'Master\'s or PhD in Data Science, Statistics, or related field',
                '3+ years of data science experience',
                'Strong statistical and mathematical background',
                'Experience with machine learning algorithms'
            ],
            responsibilities: [
                'Develop and deploy machine learning models',
                'Analyze large and complex datasets',
                'Create data visualizations and reports',
                'Collaborate with business teams',
                'Research new data science techniques'
            ],
            requirements: [
                'Proficiency in Python and data science libraries',
                'Experience with ML frameworks (TensorFlow, PyTorch)',
                'Knowledge of SQL and NoSQL databases',
                'Statistical analysis skills',
                'Data visualization expertise'
            ],
            benefits: [
                'Research and development budget',
                'Conference attendance opportunities',
                'Latest hardware and software',
                'Flexible work schedule',
                'Performance bonuses'
            ]
        }
    };
    
    if (jobData[jobId]) {
        const job = jobData[jobId];
        
        const jobSummary = document.getElementById('jobSummary');
        const jobQualification = document.getElementById('jobQualification');
        const jobResponsibilities = document.getElementById('jobResponsibilities');
        const jobRequirements = document.getElementById('jobRequirements');
        const jobBenefits = document.getElementById('jobBenefits');
        
        if (jobSummary) jobSummary.textContent = job.summary;
        
        if (jobQualification) updateList(jobQualification, job.qualification);
        if (jobResponsibilities) updateList(jobResponsibilities, job.responsibilities);
        if (jobRequirements) updateList(jobRequirements, job.requirements);
        if (jobBenefits) updateList(jobBenefits, job.benefits);
    }
}

/**
 * Helper function to update list items
 */
function updateList(element, items) {
    element.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        element.appendChild(li);
    });
}

/**
 * Initialize file upload functionality for career form
 */
function initCareerFileUploads() {
    const cvUploadArea = document.getElementById('cvUploadArea');
    const cvFileInput = document.getElementById('cvFile');
    const cvFileName = document.getElementById('cvFileName');
    
    const coverLetterUploadArea = document.getElementById('coverLetterUploadArea');
    const coverLetterFileInput = document.getElementById('coverLetterFile');
    const coverLetterFileName = document.getElementById('coverLetterFileName');
    
    function setupFileUpload(uploadArea, fileInput, fileNameDisplay) {
        if (!uploadArea || !fileInput || !fileNameDisplay) return;
        
        // Click handler
        uploadArea.addEventListener('click', function(e) {
            if (e.target !== fileInput) {
                fileInput.click();
            }
        });
        
        // File change handler
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
                uploadArea.classList.add('dragover');
            } else {
                fileNameDisplay.textContent = 'No file chosen';
                uploadArea.classList.remove('dragover');
            }
        });
        
        // Drag and drop handlers
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                fileNameDisplay.textContent = e.dataTransfer.files[0].name;
            }
        });
    }
    
    setupFileUpload(cvUploadArea, cvFileInput, cvFileName);
    setupFileUpload(coverLetterUploadArea, coverLetterFileInput, coverLetterFileName);
}

/**
 * Initialize career form submission
 */
function initCareerFormSubmission() {
    const applicationForm = document.getElementById('jobApplicationForm');
    const formMessage = document.getElementById('applicationFormMessage');
    
    if (!applicationForm) return;
    
    applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('applicantEmail');
        const phone = document.getElementById('applicantPhone');
        const cvFileInput = document.getElementById('cvFile');
        const cvUploadArea = document.getElementById('cvUploadArea');
        const coverLetterFileInput = document.getElementById('coverLetterFile');
        const coverLetterUploadArea = document.getElementById('coverLetterUploadArea');
        
        let valid = true;
        const errors = [];
        
        // Reset error states
        if (firstName) firstName.style.borderColor = '';
        if (lastName) lastName.style.borderColor = '';
        if (email) email.style.borderColor = '';
        if (phone) phone.style.borderColor = '';
        if (cvUploadArea) cvUploadArea.style.borderColor = '';
        if (coverLetterUploadArea) coverLetterUploadArea.style.borderColor = '';
        
        // Validate required fields
        if (!firstName || !firstName.value.trim()) {
            if (firstName) firstName.style.borderColor = 'var(--danger-color)';
            errors.push('First Name is required');
            valid = false;
        }
        
        if (!lastName || !lastName.value.trim()) {
            if (lastName) lastName.style.borderColor = 'var(--danger-color)';
            errors.push('Last Name is required');
            valid = false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email.value.trim())) {
            if (email) email.style.borderColor = 'var(--danger-color)';
            errors.push('Valid Email is required');
            valid = false;
        }
        
        if (!phone || !phone.value.trim()) {
            if (phone) phone.style.borderColor = 'var(--danger-color)';
            errors.push('Contact Number is required');
            valid = false;
        }
        
        // Validate CV file
        if (!cvFileInput || cvFileInput.files.length === 0) {
            if (cvUploadArea) cvUploadArea.style.borderColor = 'var(--danger-color)';
            errors.push('CV file is required');
            valid = false;
        } else {
            // Check file type
            const allowedTypes = ['application/pdf', 'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(cvFileInput.files[0].type)) {
                if (cvUploadArea) cvUploadArea.style.borderColor = 'var(--danger-color)';
                errors.push('CV must be a PDF or Word document');
                valid = false;
            }
        }
        
        // Validate cover letter if uploaded
        if (coverLetterFileInput && coverLetterFileInput.files.length > 0) {
            const allowedTypes = ['application/pdf', 'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(coverLetterFileInput.files[0].type)) {
                if (coverLetterUploadArea) coverLetterUploadArea.style.borderColor = 'var(--danger-color)';
                errors.push('Cover Letter must be a PDF or Word document');
                valid = false;
            }
        }
        
        if (valid) {
            // In a real application, you would submit to a server here
            // For demo purposes, show success message
            if (formMessage) {
                formMessage.textContent = 'Application submitted successfully! We will review your application and contact you soon.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
            }
            
            // Reset form
            applicationForm.reset();
            const cvFileName = document.getElementById('cvFileName');
            const coverLetterFileName = document.getElementById('coverLetterFileName');
            if (cvFileName) cvFileName.textContent = 'No file chosen';
            if (coverLetterFileName) coverLetterFileName.textContent = 'No file chosen';
            if (cvUploadArea) cvUploadArea.classList.remove('dragover');
            if (coverLetterUploadArea) coverLetterUploadArea.classList.remove('dragover');
            
            // Hide message after 5 seconds
            setTimeout(() => {
                if (formMessage) formMessage.style.display = 'none';
            }, 5000);
            
            // Scroll to top of form
            const applicationView = document.getElementById('applicationView');
            if (applicationView) {
                applicationView.scrollTop = 0;
            }
        } else {
            if (formMessage) {
                formMessage.textContent = errors.join('. ') + '. Please correct the errors and try again.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            }
        }
    });
}