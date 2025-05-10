// Function to fetch and convert markdown to HTML
async function loadMarkdown(url) {
    try {
        const response = await fetch(url);
        const markdown = await response.text();
        return marked.parse(markdown);
    } catch (error) {
        console.error('Error loading markdown:', error);
        return '<p>Error loading documentation. Please try again later.</p>';
    }
}

// Function to create a modal for displaying documentation
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    };
    
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = content;
    
    modalContent.appendChild(closeButton);
    modalContent.appendChild(contentDiv);
    modal.appendChild(modalContent);
    
    // Add click outside to close
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    };
    
    return modal;
}

// Add click handlers to all documentation links
document.addEventListener('DOMContentLoaded', () => {
    const docLinks = document.querySelectorAll('.doc-card .social-link');
    
    docLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const url = link.getAttribute('href');
            const originalText = link.textContent;
            
            // Show loading state
            link.textContent = 'Loading...';
            
            // Load and convert markdown
            const htmlContent = await loadMarkdown(url);
            
            // Create and show modal
            const modal = createModal(htmlContent);
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Reset link text
            link.textContent = originalText;
        });
    });
}); 