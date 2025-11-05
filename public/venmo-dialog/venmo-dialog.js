/**
 * Venmo Dialog Module
 * Handles the Venmo QR code dialog functionality
 */

class VenmoDialog {
    constructor() {
        this.dialogOverlay = null;
        this.dialogCloseBtn = null;
        this.venmoQrLink = null;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // Load the dialog HTML
            await this.loadDialogHTML();
            
            // Get DOM elements
            this.dialogOverlay = document.getElementById('venmo-dialog-overlay');
            this.dialogCloseBtn = document.getElementById('dialog-close-btn');
            this.venmoQrLink = document.getElementById('venmo-qr-link');

            // Add event listeners
            this.addEventListeners();
            
            this.isInitialized = true;
            console.log('Venmo dialog initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Venmo dialog:', error);
        }
    }

    async loadDialogHTML() {
        try {
            const response = await fetch('./venmo-dialog/venmo-dialog.html');
            const html = await response.text();
            
            // Create a temporary div to hold the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // Append the dialog to the body
            document.body.appendChild(tempDiv.firstElementChild);
        } catch (error) {
            console.error('Failed to load dialog HTML:', error);
            throw error;
        }
    }

    addEventListeners() {
        // Open dialog when Venmo QR link is clicked
        if (this.venmoQrLink) {
            this.venmoQrLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        }

        // Close dialog when close button is clicked
        if (this.dialogCloseBtn) {
            this.dialogCloseBtn.addEventListener('click', () => {
                this.close();
            });
        }

        // Close dialog when clicking outside the dialog content
        if (this.dialogOverlay) {
            this.dialogOverlay.addEventListener('click', (e) => {
                if (e.target === this.dialogOverlay) {
                    this.close();
                }
            });
        }

        // Close dialog when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    open() {
        if (!this.dialogOverlay) {
            console.error('Dialog not initialized');
            return;
        }
        
        this.dialogOverlay.style.display = 'flex';
        // Prevent body scrolling when dialog is open
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (!this.dialogOverlay) {
            console.error('Dialog not initialized');
            return;
        }
        
        this.dialogOverlay.style.display = 'none';
        // Restore body scrolling
        document.body.style.overflow = '';
    }

    isOpen() {
        return this.dialogOverlay && this.dialogOverlay.style.display !== 'none';
    }

    // Method to update dialog content if needed
    updateContent(content) {
        const dialogBody = this.dialogOverlay?.querySelector('.dialog-body');
        if (dialogBody) {
            dialogBody.innerHTML = content;
        }
    }
}

// Create and export a singleton instance
const venmoDialog = new VenmoDialog();

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => venmoDialog.init());
} else {
    venmoDialog.init();
}

// Export for external use if needed
window.VenmoDialog = venmoDialog;