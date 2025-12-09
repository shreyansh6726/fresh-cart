document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const cartIcon = document.getElementById('cart-icon');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const productsGrid = document.querySelector('.products-grid');
    const productCards = document.querySelectorAll('.product-card');
    const cartItemsList = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    const cartCountSpan = document.querySelector('.cart-count');
    const searchInput = document.getElementById('product-search');

    // --- State Management ---
    let cart = [];

    // --- Cart Sidebar Animation Logic ---
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // --- Core Functions ---

    /** Calculates total price and number of items in the cart. */
    const updateCartTotal = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        totalPriceSpan.textContent = total.toFixed(2);
        cartCountSpan.textContent = itemCount;

        // NEW: Update buttons on the product grid to reflect current quantities
        productCards.forEach(card => {
            const id = card.getAttribute('data-id');
            const item = cart.find(i => i.id === id);
            const currentControl = card.querySelector('.quantity-controls');
            
            if (item && item.quantity > 0 && !currentControl) {
                // Item is in cart but controls aren't rendered yet (page refresh/initial load logic)
                renderQuantityControls(card, item.quantity);
            } else if (item && currentControl) {
                // Item is in cart and controls are visible, just update the number
                currentControl.querySelector('.quantity-display').textContent = item.quantity;
            } else if (!item && currentControl) {
                // Item removed from cart (quantity 0), revert to original button
                const originalButton = document.createElement('button');
                originalButton.classList.add('add-to-cart');
                originalButton.textContent = 'Add to Cart';
                currentControl.replaceWith(originalButton);
            }
        });
    };

    /** Renders the cart items in the sidebar. */
    const renderCart = () => {
        cartItemsList.innerHTML = ''; // Clear existing items

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
        } else {
            cart.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.name} (${item.quantity}x)</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                `;
                cartItemsList.appendChild(li);
            });
        }
        updateCartTotal();
    };

    /** NEW: Creates and displays the - [1] + quantity control interface. */
    const renderQuantityControls = (card, initialQuantity) => {
        const button = card.querySelector('.add-to-cart');
        
        const controls = document.createElement('div');
        controls.classList.add('quantity-controls');
        controls.innerHTML = `
            <button class="qty-btn decrease">-</button>
            <span class="quantity-display">${initialQuantity}</span>
            <button class="qty-btn increase">+</button>
        `;
        
        button.replaceWith(controls);
    };

    /** NEW: Updates the quantity of an item in the cart. */
    const updateQuantity = (productId, change) => {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            
            if (cart[itemIndex].quantity <= 0) {
                // Remove item if quantity drops to zero or below
                cart.splice(itemIndex, 1);
            }
        }
        renderCart();
    };
    
    /** Handles adding a product to the cart (only used for the *first* add). */
    const addToCart = (productId, name, price, card) => {
        const existingItem = cart.find(item => item.id === productId);

        if (!existingItem) {
            cart.push({ id: productId, name, price: parseFloat(price), quantity: 1 });
            renderQuantityControls(card, 1); // Render controls immediately
        }
        
        renderCart();
    };

    // --- Search Functionality ---
    const filterProducts = () => {
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

    // --- Event Listeners ---

    // 1. Listen for clicks on "Add to Cart" or Quantity controls
    productsGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.product-card');
        if (!card) return;

        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        const price = card.getAttribute('data-price');

        if (event.target.classList.contains('add-to-cart')) {
            addToCart(id, name, price, card);
        } else if (event.target.classList.contains('qty-btn')) {
            const change = event.target.classList.contains('increase') ? 1 : -1;
            updateQuantity(id, change);
        }
    });

    // 2. Listen for input (typing) in the search bar
    searchInput.addEventListener('input', filterProducts);
    
    // Initial render
    renderCart(); 
});
// --- TEST USER ACCOUNTS (Replaces CSV file for front-end testing) ---
const AUTH_ACCOUNTS = [
    { id: 'priyanshu.m', pass: 'p187' },
    { id: 'priyanshu.r', pass: 'p188' },
    { id: 'sarbik', pass: 's216' },
    { id: 'shiv', pass: 's224' },
    { id: 'utkarsh', pass: 'u262' }
];

// --- LANDING PAGE ANIMATION AND AUTHENTICATION LOGIC (For index.html) ---

// Use a global handler for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    // Select elements from the LANDING PAGE (index.html)
    const landingContainer = document.getElementById('landing-container');
    const getStartedBtn = document.getElementById('get-started-btn');
    const authModal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close-btn');
    const loginBtn = document.getElementById('login-btn');
    
    // --- 1. INTRO ANIMATION CHECK ---
    if (landingContainer) {
        // Ensure the landing container becomes visible after a slight delay
        setTimeout(() => {
            landingContainer.classList.add('active');
        }, 300); 
    }

    // --- 2. MODAL OPEN/CLOSE HANDLERS ---
    if (getStartedBtn && authModal) {
        // Open Modal on "Get Started" Click
        getStartedBtn.addEventListener('click', () => {
            authModal.style.display = 'block';
            document.getElementById('auth-message').textContent = '';
            document.getElementById('userId').value = '';
            document.getElementById('password').value = '';
        });
    }

    if (closeBtn && authModal) {
        // Close Modal on 'x' click
        closeBtn.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
    }

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    // --- 3. LOGIN BUTTON EVENT ---
    if (loginBtn) {
        loginBtn.addEventListener('click', authenticateUser);
    }
    
    // NOTE: Add your cart functionality or other common functions below this block.
    // Since the cart elements are now in home.html, any cart-specific JS needs to
    // be written to run specifically on home.html and the category pages.
});

// --- AUTHENTICATION FUNCTION ---
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
        // Successful login
        authMessage.textContent = 'Authentication successful! Redirecting...';
        authMessage.style.color = 'green';
        
        // Redirect to the new home page
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 800);

    } else {
        // Failed login
        authMessage.textContent = 'Invalid User ID or Password. Please try again.';
        authMessage.style.color = 'red';
    }
}