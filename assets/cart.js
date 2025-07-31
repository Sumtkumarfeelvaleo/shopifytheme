document.addEventListener('DOMContentLoaded', function() {
    // Quantity plus/minus and cart item removal
    document.body.addEventListener('click', function(event) {
        // Handle quantity change (plus/minus buttons)
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

        // Handle cart item removal
        if (event.target.closest('[data-cart-remove]')) {
            event.preventDefault();
            const button = event.target.closest('[data-cart-remove]');
            const id = button.dataset.cartRemoveId;
            removeCartItem(id);
        }
    });

    // Update cart quantity
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

    // Remove cart item
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

    // Re-render the cart section
    function renderCartSection() {
        var cartSection = document.querySelector('.halo-cart-content');
        var parentSection = cartSection?.closest('[data-section]');
        var sectionId = parentSection ? parentSection.getAttribute('data-section') : null;
        if (!sectionId) {
            var cartSectionId = cartSection?.id?.replace('main-cart-items-', '') || '';
            sectionId = cartSectionId || 'main-cart';
        }
        var url = `/?section_id=main-cart`;
        fetch(url)
            .then(response => response.text())
            .then(html => {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                var newCartContent = tempDiv.querySelector('.halo-cart-content');
                if (newCartContent && cartSection) {
                    cartSection.innerHTML = newCartContent.innerHTML;
                } else if (cartSection) {
                    cartSection.innerHTML = '<div class="cart-content-empty text-center"><span class="cart-text">Your cart is empty</span></div>';
                }
            });
    }

    class CartItems extends HTMLElement {
        constructor() {
            super();

            this.cartCountDown = document.getElementById(`CartCountdown-${this.dataset.section}`)
            this.giftCardElement = document.getElementById('is-a-gift')
            this.giftCardButton = document.getElementById('cart-gift-wrapping')
            this.removeButtons = document.querySelectorAll('[data-cart-remove]')
            this.toCheckoutButton = document.getElementById('cart-checkout')
            this.couponCodeInput = document.getElementById('cart-coupon-code')
            this.cartNoteInput = document.getElementById('cart-note')
            this.checkTerms = document.getElementById('cart_conditions')

            this.toCheckoutButton?.addEventListener('click', this.handleToCheckoutPage.bind(this))

            this.initToCheckoutButtonDisabling()
            this.initCartCountdown()
            this.initGiftCardElement()
            this.initGiftCardManipulation()
        }

        initGiftCardElement() {
            const isChecked = this.giftCardButton?.dataset.isChecked
            if (isChecked === 'true') {
                const variantId = this.giftCardButton?.dataset.giftId
                const giftCardRemoveButton = document.querySelector(`[data-cart-remove-id="${variantId}"]`)
                const giftCardQuantityInput = document.querySelector(`[data-cart-quantity-id="${variantId}"]`)

                this.giftCardElement.style.display = 'none'
                giftCardRemoveButton?.addEventListener('click', () => {
                    this.giftCardButton.dataset.isChecked = 'false'
                })

                giftCardQuantityInput?.addEventListener('change', (e) => {
                    const value = Number(e.target.value)
                    if (value <= 0) {
                        this.giftCardButton.dataset.isChecked = 'false'
                    }
                })
            } else {
                this.giftCardElement.style.display = 'flex'
            }
        }

        initGiftCardManipulation() {
            if (this.giftCardButton) {
                this.giftCardButton.removeEventListener('click', this.onAddGiftCardClick.bind(this))
                this.giftCardButton.addEventListener('click', this.onAddGiftCardClick.bind(this))
            }
        }

        onAddGiftCardClick(e) {
            e.preventDefault()
            e.stopPropagation()
            this.giftCardButton.dataset.isChecked = 'true'
        }

        initToCheckoutButtonDisabling() {
            if (this.checkTerms) {
                window.addEventListener('load', () => {
                    this.toCheckoutButton.disabled = !this.checkTerms.checked
                })
            }
        }

        async handleToCheckoutPage(e) {
            e.preventDefault()

            try {
                // saving coupon
                const couponCode = this.couponCodeInput?.value 
                if (couponCode) {
                    localStorage.setItem('storedDiscount', couponCode)
                    const couponRes =  await fetch(`/discount/${couponCode}`)
                    const text1 = await couponRes.text()
                }
                
                // saving cart note
                const cartNote = this.cartNoteInput?.value
                if (cartNote) {
                    const cartNoteBody = JSON.stringify({ note: cartNote })
                    const cartNoteRes = await fetch(`${routes.cart_update_url}`, {...fetchConfig(), ...{ body: cartNoteBody }})
                    const text2 = await cartNoteRes.text()
                }

            } catch(error) {
                console.error(`Error: ${error.message}`)
            }

            window.location = this.toCheckoutButton.dataset.href;
        }

        initCartCountdown() {
            if(!this.cartCountDown) return;

            if(!this.cartCountDown.classList.contains('is-running')){
                const duration = this.cartCountDown.getAttribute('data-cart-countdown') * 60
                const element = this.cartCountDown.querySelector('.time');

                this.cartCountDown.classList.add('is-running');
                this.startTimerCartCountdown(duration, element);
            }
        }

        startTimerCartCountdown(duration, element){
            var timer = duration, minutes, seconds, text;

            var startCoundown = setInterval(() => {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                text = minutes + ":" + seconds;

                element.innerText = text;

                if (--timer < 0) {
                    clearInterval(startCoundown);
                    this.cartCountDown.remove();
                }
            }, 1000);
        }
    }

    customElements.define('cart-items', CartItems);
});
