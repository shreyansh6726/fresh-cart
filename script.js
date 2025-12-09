// =================================================================
// 1. GLOBAL STATE & CONFIGURATION
// =================================================================

// --- AUTHENTICATION ACCOUNTS (For index.html mock-up) ---
const AUTH_ACCOUNTS = [
    { id: 'priyanshu.m', pass: 'p187' },
    { id: 'priyanshu.r', pass: 'p188' },
    { id: 'sarbik', pass: 's216' },
    { id: 'shiv', pass: 's224' },
    { id: 'utkarsh', pass: 'u262' }
];

// --- CART STATE MANAGEMENT (Uses localStorage for persistence) ---
// Initialize cart from localStorage, or start with an empty array
let cart = JSON.parse(localStorage.getItem('freshCartItems')) || [];


// =================================================================
// 2. AUTHENTICATION LOGIC (Used only by index.html)
// =================================================================

function authenticateUser() {
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value.trim();
    const authMessage = document.getElementById('auth-message');

    if (!userId || !password) {
        authMessage.textContent = 'Please enter both ID and Password.';
        return;
    }

    // Search the predefined array for a matching user
    const user = AUTH_ACCOUNTS.find(account => 
        account.id === userId && account.pass === password
    );

    if (user) {
        authMessage.textContent = 'Authentication successful! Redirecting...';
        authMessage.style.color = 'green';
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 800);

    } else {
        authMessage.textContent = 'Invalid User ID or Password. Please try again.';
        authMessage.style.color = 'red';
    }
}


// =================================================================
// 3. CART & PRODUCT GRID FUNCTIONS (Used by home.html, etc.)
// =================================================================

/** Calculates total price, item count, and saves the cart state. */
const updateCartTotal = (
    totalPriceSpan, 
    cartCountSpan, 
    productCards
) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    totalPriceSpan.textContent = total.toFixed(2);
    cartCountSpan.textContent = itemCount;

    // Save state to browser storage
    localStorage.setItem('freshCartItems', JSON.stringify(cart));


    // NEW: Update buttons on the product grid to reflect current quantities
    productCards.forEach(card => {
        const id = card.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        const currentControl = card.querySelector('.quantity-controls');
        
        if (item && item.quantity > 0) {
            // Item is in cart, render or update controls
            if (!currentControl) {
                renderQuantityControls(card, item.quantity);
            } else {
                currentControl.querySelector('.quantity-display').textContent = item.quantity;
            }
        } else if (!item && currentControl) {
            // Item removed from cart, revert to original button
            const originalButton = document.createElement('button');
            originalButton.classList.add('add-to-cart');
            originalButton.textContent = 'Add to Cart';
            // Important: Reattach the event listener to the new button
            originalButton.addEventListener('click', handleProductGridClick); 
            currentControl.replaceWith(originalButton);
        }
    });
};

/** Renders the cart items in the sidebar. */
const renderCart = (cartItemsList, totalPriceSpan, cartCountSpan, productCards) => {
    cartItemsList.innerHTML = ''; // Clear existing items

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>₹{item.name} (₹{item.quantity}x)</span>
                <span>₹₹{(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsList.appendChild(li);
        });
    }
    updateCartTotal(totalPriceSpan, cartCountSpan, productCards);
};

/** Creates and displays the - [Qty] + quantity control interface. */
const renderQuantityControls = (card, initialQuantity) => {
    const button = card.querySelector('.add-to-cart');
    if (!button) return;
    
    const controls = document.createElement('div');
    controls.classList.add('quantity-controls');
    controls.innerHTML = `
        <button class="qty-btn decrease">-</button>
        <span class="quantity-display">₹{initialQuantity}</span>
        <button class="qty-btn increase">+</button>
    `;
    
    button.replaceWith(controls);
};

/** Updates the quantity of an item in the cart. */
const updateQuantity = (productId, change, elements) => {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    renderCart(elements.cartItemsList, elements.totalPriceSpan, elements.cartCountSpan, elements.productCards);
};

/** Handles adding a product to the cart (only used for the *first* add). */
const addToCart = (productId, name, price, card, elements) => {
    const existingItem = cart.find(item => item.id === productId);

    if (!existingItem) {
        cart.push({ id: productId, name, price: parseFloat(price), quantity: 1 });
        renderQuantityControls(card, 1);
    } else {
        existingItem.quantity++; // If it exists, just increase the quantity
    }
    
    renderCart(elements.cartItemsList, elements.totalPriceSpan, elements.cartCountSpan, elements.productCards);
};


/** Handles all clicks on the product grid (Add to Cart, Increase, Decrease). */
const handleProductGridClick = (event, elements) => {
    const card = event.target.closest('.product-card');
    if (!card) return;

    const id = card.getAttribute('data-id');
    const name = card.getAttribute('data-name');
    const price = card.getAttribute('data-price');

    if (event.target.classList.contains('add-to-cart')) {
        addToCart(id, name, price, card, elements);
    } else if (event.target.classList.contains('qty-btn')) {
        const change = event.target.classList.contains('increase') ? 1 : -1;
        updateQuantity(id, change, elements);
    }
};


// --- Search Functionality ---
const filterProducts = (searchInput, productCards) => {
    const searchTerm = searchInput.value.toLowerCase();
    
    productCards.forEach(card => {
        const productName = card.getAttribute('data-name').toLowerCase();
        
        if (productName.includes(searchTerm)) {
            card.style.display = 'block'; 
        } else {
            card.style.display = 'none'; 
        }
    });
};


// =================================================================
// 4. MASTER INITIALIZATION (DOMContentLoaded)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Determine Page Type ---
    const landingContainer = document.getElementById('landing-container');
    const isLandingPage = !!landingContainer;

    if (isLandingPage) {
        // --- A. LANDING PAGE INITIALIZATION ---
        const getStartedBtn = document.getElementById('get-started-btn');
        const authModal = document.getElementById('authModal');
        const closeBtn = document.querySelector('.close-btn');
        const loginBtn = document.getElementById('login-btn');

        // Intro Animation
        setTimeout(() => {
            landingContainer.classList.add('active');
        }, 300); 

        // Modal Handlers
        if (getStartedBtn) getStartedBtn.addEventListener('click', () => {
            authModal.style.display = 'block';
            document.getElementById('auth-message').textContent = '';
            document.getElementById('userId').value = '';
            document.getElementById('password').value = '';
        });
        if (closeBtn) closeBtn.addEventListener('click', () => authModal.style.display = 'none');
        window.addEventListener('click', (event) => {
            if (event.target === authModal) authModal.style.display = 'none';
        });

        // Login Event
        if (loginBtn) loginBtn.addEventListener('click', authenticateUser);
        
    } else {
        // --- B. PRODUCT PAGE INITIALIZATION (home.html, etc.) ---
        
        // --- DOM Elements ---
        const elements = {
            cartIcon: document.getElementById('cart-icon'),
            closeCartBtn: document.getElementById('close-cart'),
            cartSidebar: document.getElementById('cart-sidebar'),
            productsGrid: document.querySelector('.products-grid'),
            productCards: document.querySelectorAll('.product-card'),
            cartItemsList: document.getElementById('cart-items'),
            totalPriceSpan: document.getElementById('total-price'),
            cartCountSpan: document.querySelector('.cart-count'),
            searchInput: document.getElementById('product-search'),
            checkoutBtn: document.querySelector('.checkout-btn')
        };
        
        // --- Cart Sidebar Animation Logic ---
        if (elements.cartIcon) elements.cartIcon.addEventListener('click', () => {
            elements.cartSidebar.classList.add('open');
        });
        if (elements.closeCartBtn) elements.closeCartBtn.addEventListener('click', () => {
            elements.cartSidebar.classList.remove('open');
        });

        // --- Event Listeners ---
        // 1. Product Grid Click (Add/Qty Change)
        if (elements.productsGrid) elements.productsGrid.addEventListener('click', (event) => {
            handleProductGridClick(event, elements);
        });

        // 2. Search Input
        if (elements.searchInput) elements.searchInput.addEventListener('input', () => {
            filterProducts(elements.searchInput, elements.productCards);
        });
        
        // 3. Checkout Redirection
        if (elements.checkoutBtn) elements.checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                 window.location.href = 'checkout.html';
            } else {
                 alert("Your cart is empty. Please add items before checking out.");
            }
        });

        // Initial render of the cart and product controls based on saved state
        if (elements.cartItemsList) {
            renderCart(elements.cartItemsList, elements.totalPriceSpan, elements.cartCountSpan, elements.productCards);
        }
    }
});