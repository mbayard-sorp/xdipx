// Global JavaScript for XD IPX Flash Deals Theme

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  initStickyHeader();
  initQuantitySelectors();
  initQuickAdd();
});

// Sticky Header
function initStickyHeader() {
  const header = document.querySelector('.header--sticky');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// Quantity Selectors
function initQuantitySelectors() {
  document.querySelectorAll('.quantity-selector').forEach((selector) => {
    const minusBtn = selector.querySelector('[data-quantity-minus]');
    const plusBtn = selector.querySelector('[data-quantity-plus]');
    const input = selector.querySelector('.quantity-selector__input');

    if (minusBtn && input) {
      minusBtn.addEventListener('click', () => {
        const min = parseInt(input.getAttribute('min')) || 1;
        const value = parseInt(input.value);
        if (value > min) {
          input.value = value - 1;
          input.dispatchEvent(new Event('change'));
        }
      });
    }

    if (plusBtn && input) {
      plusBtn.addEventListener('click', () => {
        const max = parseInt(input.getAttribute('max')) || 999;
        const value = parseInt(input.value);
        if (value < max) {
          input.value = value + 1;
          input.dispatchEvent(new Event('change'));
        }
      });
    }
  });
}

// Quick Add to Cart
function initQuickAdd() {
  document.querySelectorAll('.product-card__form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const variantId = form.querySelector('[data-product-variant-id]').value;

      if (submitBtn && variantId) {
        submitBtn.textContent = 'Adding...';
        submitBtn.disabled = true;

        try {
          const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              items: [{
                id: variantId,
                quantity: 1
              }]
            })
          });

          if (response.ok) {
            submitBtn.textContent = 'Added!';
            // Update cart count
            const cartCount = document.querySelector('.cart-count-bubble span');
            if (cartCount) {
              cartCount.textContent = parseInt(cartCount.textContent) + 1;
            }
            
            // Reset button after 2 seconds
            setTimeout(() => {
              submitBtn.textContent = 'Add to Cart';
              submitBtn.disabled = false;
            }, 2000);
          } else {
            throw new Error('Failed to add to cart');
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
          submitBtn.textContent = 'Error';
          submitBtn.disabled = false;
        }
      }
    });
  });
}

// Countdown Timer (reusable)
function initCountdowns() {
  document.querySelectorAll('[data-countdown]').forEach((countdown) => {
    const endDate = new Date(countdown.dataset.countdown).getTime();

    function update() {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance < 0) {
        countdown.innerHTML = '<span class="countdown__expired">Deal ended</span>';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const daysEl = countdown.querySelector('[data-days]');
      const hoursEl = countdown.querySelector('[data-hours]');
      const minutesEl = countdown.querySelector('[data-minutes]');
      const secondsEl = countdown.querySelector('[data-seconds]');

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  });
}

// Debounce utility
function debounce(fn, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Format money (matches Shopify format)
function formatMoney(cents, format) {
  return Money(cents, format);
}

// Expose to global scope
window.XDIPX = {
  debounce,
  formatMoney
};