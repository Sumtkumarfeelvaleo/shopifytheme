document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.custom-product-card').forEach(card => {
    const content = card.querySelector('.product-card-content');
    const quickAddBtn = card.querySelector('.quick-add-btn');
    const variantsContainer = card.querySelector('.custom-card__variants');
    const addToCartBtn = card.querySelector('[data-btn-addtocart]');
    const cancelBtn = card.querySelector('.cancel-btn');
    const variantCircles = card.querySelectorAll('.variant-circle');
    const selectedVariantIdInput = card.querySelector('.selected-variant-id');
    const quantityInput = card.querySelector('.quantity-input');
    const quantityBtns = card.querySelectorAll('.quantity-btn');

    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', function() {
        content.classList.add('blurred');
        if (variantsContainer) {
          variantsContainer.style.display = 'flex';
        }
        this.style.display = 'none';
      });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            content.classList.remove('blurred');
            if(variantsContainer) {
                variantsContainer.style.display = 'none';
            }
            if(quickAddBtn) {
                quickAddBtn.style.display = 'block';
            }
        });
    }

    variantCircles.forEach(circle => {
      circle.addEventListener('click', function() {
        if (this.hasAttribute('disabled')) return;

        variantCircles.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        
        selectedVariantIdInput.value = this.dataset.variantId;
        addToCartBtn.disabled = false;
      });
    });

    quantityBtns.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            let currentValue = parseInt(quantityInput.value, 10);

            if (action === 'plus') {
                quantityInput.value = currentValue + 1;
            } else if (action === 'minus' && currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    });
  });
});
