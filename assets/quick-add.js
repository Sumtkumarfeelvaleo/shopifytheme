document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.custom-product-card').forEach(card => {
    const content = card.querySelector('.product-card-content');
    const quickAddBtn = card.querySelector('.quick-add-btn');
    const variantsContainer = card.querySelector('.custom-card__variants');
    const variantSelect = card.querySelector('.custom-card__variant-select');
    const addToCartBtn = card.querySelector('.product-card-form .button-ATC');

    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', function() {
        content.classList.add('blurred');
        if (variantsContainer) {
          variantsContainer.style.display = 'block';
        }
        if (addToCartBtn) {
          addToCartBtn.style.display = 'block';
        }
        this.style.display = 'none';
      });
    }

    if (variantSelect) {
      variantSelect.addEventListener('change', function() {
        if (this.value) {
          addToCartBtn.disabled = false;
        } else {
          addToCartBtn.disabled = true;
        }
      });
    }
  });
});
