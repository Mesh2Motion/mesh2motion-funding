/**
 * Venmo Dialog Module
 * Handles the Venmo QR code dialog functionality
 */
class VenmoDialog {
    dialogOverlay = null;
    dialogCloseBtn = null;
    venmoQrLink = null;
    isInitialized = false;

    constructor() {
        this.init();
    }

    async init() {
        if (this.isInitialized) return;

        await this.loadDialogHTML();
        this.getDOMElements();
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('Venmo dialog initialized');
    }

    async loadDialogHTML() {
        const response = await fetch('./venmo-dialog/venmo-dialog.html');
        const html = await response.text();
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        document.body.appendChild(tempDiv.firstElementChild);
    }

    getDOMElements() {
        this.dialogOverlay = document.getElementById('venmo-dialog-overlay');
        this.dialogCloseBtn = document.getElementById('dialog-close-btn');
        this.venmoQrLink = document.getElementById('venmo-qr-link');
    }

    setupEventListeners() {
        // Open dialog
        this.venmoQrLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.open();
        });

        // Close dialog
        this.dialogCloseBtn?.addEventListener('click', () => this.close());
        
        // Close on overlay click
        this.dialogOverlay?.addEventListener('click', (e) => {
            if (e.target === this.dialogOverlay) this.close();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) this.close();
        });
    }

    open() {
        this.dialogOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.dialogOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    isOpen() {
        return this.dialogOverlay?.style.display === 'flex';
    }

    updateContent(content) {
        const dialogBody = this.dialogOverlay?.querySelector('.dialog-body');
        if (dialogBody) {
            dialogBody.innerHTML = content;
        }
    }
}

// Create singleton instance
const venmoDialog = new VenmoDialog();

// Make available globally
window.VenmoDialog = venmoDialog;