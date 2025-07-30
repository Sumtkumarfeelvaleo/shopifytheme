document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.custom-product-card').forEach(card => {
    const content = card.querySelector('.product-card-content');
    const quickAddBtn = card.querySelector('.quick-add-btn');
    const variantsContainer = card.querySelector('.custom-card__variants');
    const addToCartBtn = card.querySelector('[data-btn-addtocart]');
    const variantCircles = card.querySelectorAll('.variant-circle');
    const selectedVariantIdInput = card.querySelector('.selected-variant-id');

    const showVariants = () => {
      content.classList.add('blurred');
      quickAddBtn.classList.add('blurred');
      if (variantsContainer) {
        variantsContainer.style.display = 'flex';
      }
    };

    const hideVariants = () => {
      content.classList.remove('blurred');
      if (variantsContainer) {
        variantsContainer.style.display = 'none';
      }
      quickAddBtn.classList.remove('blurred');
    };

    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', showVariants);
    }

    card.addEventListener('mouseleave', hideVariants);

    variantCircles.forEach(circle => {
      circle.addEventListener('click', function() {
        if (this.hasAttribute('disabled')) return;

        variantCircles.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        
        selectedVariantIdInput.value = this.dataset.variantId;
        addToCartBtn.disabled = false;
      });
    });
  });
});
