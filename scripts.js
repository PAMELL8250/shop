// API Configuration
const API_BASE_URL = 'http://localhost:6000/api';

// Fetch Projects from Backend
async function fetchProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        return await response.json();
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

// Fetch Skills from Backend
async function fetchSkills() {
    try {
        const response = await fetch(`${API_BASE_URL}/skills`);
        if (!response.ok) throw new Error('Failed to fetch skills');
        return await response.json();
    } catch (error) {
        console.error('Error fetching skills:', error);
        return [];
    }
}

// Fetch Profile from Backend
async function fetchProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const profiles = await response.json();
        return profiles.length > 0 ? profiles[0] : null;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

// Load Projects
async function loadProjects() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    
    container.innerHTML = '<p>Loading projects...</p>';
    const projects = await fetchProjects();
    
    if (projects.length === 0) {
        container.innerHTML = '<p>No projects found. Add some projects to your portfolio!</p>';
        return;
    }
    
    container.innerHTML = projects.map(project => `
        <div class="project-card">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <p><strong>🛠️ Tech Stack:</strong> ${project.tech || 'N/A'}</p>
            <a href="${project.githubLink || '#'}" target="_blank">View Project →</a>
        </div>
    `).join('');
}

// Load Skills
async function loadSkills() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    
    container.innerHTML = '<p>Loading skills...</p>';
    const skills = await fetchSkills();
    
    if (skills.length === 0) {
        container.innerHTML = '<p>No skills found. Add some skills to your portfolio!</p>';
        return;
    }
    
    container.innerHTML = skills.map(skill => `
        <div class="skill-card">
            <h3>${skill.skillName}</h3>
            <p>Level: ${skill.level || 'Not specified'}</p>
        </div>
    `).join('');
}

// Contact Form Handler
function setupContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('status');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Show loading status
        status.innerHTML = '📨 Sending message...';
        status.style.color = '#38bdf8';
        
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            });
            
            if (response.ok) {
                status.innerHTML = '✅ Message sent successfully! I\'ll get back to you soon.';
                status.style.color = '#34d399';
                form.reset();
                
                // Clear status after 5 seconds
                setTimeout(() => {
                    status.innerHTML = '';
                }, 5000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            status.innerHTML = '❌ Failed to send message. Please try again.';
            status.style.color = '#f87171';
        }
    });
}

// Smooth Scrolling for Navigation Links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Animate elements on scroll
function setupScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    document.querySelectorAll('.section, .project-card, .skill-card, .about-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Update profile info from backend
async function updateProfileInfo() {
    const profileData = await fetchProfile();
    
    // Default profile data if API returns nothing
    const defaultProfile = {
        fullName: "ISINGIZWE SERGE",
        title: "Full Stack Developer",
        bio: "Building practical software solutions that solve real-world problems.",
        email: "isingizweserge@gmail.com",
        github: "github.com/isingizweserge",
        linkedin: "linkedin.com/in/isingizweserge"
    };
    
    const profile = profileData || defaultProfile;
    
    const nameElement = document.getElementById('fullName');
    const titleElement = document.getElementById('title');
    const bioElement = document.getElementById('bio');
    const emailElement = document.getElementById('emailInfo');
    const githubElement = document.getElementById('githubInfo');
    const linkedinElement = document.getElementById('linkedinInfo');
    
    if (nameElement) nameElement.textContent = profile.fullName || defaultProfile.fullName;
    if (titleElement) titleElement.textContent = profile.title || defaultProfile.title;
    if (bioElement) bioElement.textContent = profile.bio || defaultProfile.bio;
    if (emailElement) emailElement.textContent = profile.email || defaultProfile.email;
    if (githubElement) githubElement.textContent = profile.github || defaultProfile.github;
    if (linkedinElement) linkedinElement.textContent = profile.linkedin || defaultProfile.linkedin;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadSkills();
    setupContactForm();
    setupSmoothScroll();
    setupScrollAnimation();
    updateProfileInfo();
});