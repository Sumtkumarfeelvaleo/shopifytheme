// Remove the CartItems custom element and use event delegation instead

document.addEventListener('DOMContentLoaded', function() {
    // Quantity plus/minus
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-quantity')) {
            event.preventDefault();
            const inputElement = event.target.parentElement.querySelector('.quantity');
            if (!inputElement) return;
            const value = Number(inputElement.value);
            let newVal;
            if (event.target.classList.contains('plus')) {
                newVal = value + 1;
            } else {
                newVal = value - 1;
            }
            const id = inputElement.dataset.cartQuantityId;
            if (newVal > 0) {
                updateCartQuantity(id, newVal);
            } else if (newVal === 0) {
                removeCartItem(id);
            }
        }
    });

    // Remove item
    document.body.addEventListener('click', function(event) {
        if (event.target.closest('[data-cart-remove]')) {
            event.preventDefault();
            const button = event.target.closest('[data-cart-remove]');
            const id = button.dataset.cartRemoveId;
            removeCartItem(id);
        }
    });

    function updateCartQuantity(id, quantity) {
        fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                quantity: quantity
            })
        })
        .then(response => response.json())
        .then(data => {
            renderCartSection();
        })
        .catch(error => {
            console.error('Error updating cart quantity:', error);
        });
    }

    function removeCartItem(id) {
        fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                quantity: 0
            })
        })
        .then(response => response.json())
        .then(data => {
            renderCartSection();
        })
        .catch(error => {
            console.error('Error removing cart item:', error);
        });
    }

    // Re-render the cart section using Shopify's section rendering API
    function renderCartSection() {
        // Find the section id from the cart container
        var cartSection = document.querySelector('.halo-cart-content');
        var parentSection = cartSection?.closest('[data-section]');
        var sectionId = parentSection ? parentSection.getAttribute('data-section') : null;
        if (!sectionId) {
            // fallback: try to get from cartSection id
            var cartSectionId = cartSection?.id?.replace('main-cart-items-', '') || '';
            sectionId = cartSectionId || 'main-cart';
        }
        // Build the section URL
        var url = `/?section_id=main-cart`;
        fetch(url)
            .then(response => response.text())
            .then(html => {
                // Parse the returned HTML and extract the new cart content
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                var newCartContent = tempDiv.querySelector('.halo-cart-content');
                if (newCartContent && cartSection) {
                    cartSection.innerHTML = newCartContent.innerHTML;
                } else if (cartSection) {
                    // fallback: replace with empty message
                    cartSection.innerHTML = '<div class="cart-content-empty text-center"><span class="cart-text">Your cart is empty</span></div>';
                }
            });
    }

    // Shopify money formatting helper (kept for legacy, not used in this approach)
    if (typeof Shopify === 'undefined') {
        window.Shopify = {};
    }
    if (!Shopify.formatMoney) {
        Shopify.formatMoney = function(cents) {
            var value = (cents / 100).toFixed(2);
            return '$' + value;
        }
    }
});

