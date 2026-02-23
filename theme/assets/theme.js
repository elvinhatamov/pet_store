/**
 * M&M Pet Store – theme.js
 * Vanilla JS – no dependencies
 */

(function () {
  'use strict';

  /* ── Utilities ──────────────────────────────────────────────── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function moneyFormat(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  /* ── Announcement Bar ───────────────────────────────────────── */
  (function initAnnouncementBar() {
    var btn = $('#CloseAnnouncement');
    var bar = $('#AnnouncementBar');
    if (!btn || !bar) return;
    btn.addEventListener('click', function () {
      bar.classList.add('is-hidden');
      try { sessionStorage.setItem('announcement-closed', '1'); } catch (e) {}
    });
    try {
      if (sessionStorage.getItem('announcement-closed') === '1') {
        bar.classList.add('is-hidden');
      }
    } catch (e) {}
  })();

  /* ── Mobile Menu ────────────────────────────────────────────── */
  (function initMobileMenu() {
    var openBtn = $('#MobileMenuOpen');
    var closeBtn = $('#MobileMenuClose');
    var nav = $('#MobileNav');
    var overlay = $('#MobileNavOverlay');
    if (!openBtn || !nav) return;

    function open() {
      nav.classList.add('is-open');
      if (overlay) overlay.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
      openBtn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      nav.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
      document.body.style.overflow = '';
      openBtn.setAttribute('aria-expanded', 'false');
    }

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
    });
  })();

  /* ── Search Overlay ─────────────────────────────────────────── */
  (function initSearch() {
    var openBtns = $$('[data-search-open]');
    var closeBtn = $('#SearchOverlayClose');
    var bgClose = $('#SearchOverlayBg');
    var overlay = $('#SearchOverlay');
    var input = $('#SearchOverlayInput');
    if (!overlay) return;

    function open() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (input) setTimeout(function () { input.focus(); }, 100);
    }
    function close() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openBtns.forEach(function (btn) { btn.addEventListener('click', open); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (bgClose) bgClose.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  })();

  /* ── Cart Drawer ────────────────────────────────────────────── */
  var CartDrawer = (function () {
    var drawer = $('#CartDrawer');
    var overlay = $('#CartDrawerOverlay');
    var closeBtn = $('#CartDrawerClose');
    var itemsEl = $('#CartDrawerItems');
    var footerEl = $('#CartDrawerFooter');
    var subtotalEl = $('#CartDrawerSubtotal');

    function open() {
      if (!drawer) return;
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      fetchAndRender();
    }
    function close() {
      if (!drawer) return;
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function fetchAndRender() {
      if (!itemsEl) return;
      itemsEl.innerHTML = '<div class="cart-drawer__loading">Loading…</div>';
      if (footerEl) footerEl.style.display = 'none';

      fetch('/cart.js')
        .then(function (r) { return r.json(); })
        .then(function (cart) { renderCart(cart); })
        .catch(function () {
          itemsEl.innerHTML = '<p style="padding:1rem;color:var(--color-error)">Could not load cart.</p>';
        });
    }

    function renderCart(cart) {
      if (!itemsEl) return;
      if (!cart.items || cart.items.length === 0) {
        itemsEl.innerHTML = '<div class="cart-drawer__empty"><div class="cart-drawer__empty-icon">🛒</div><p>Your cart is empty.</p><a href="/collections/all" class="btn btn--primary btn--sm">Shop Now</a></div>';
        if (footerEl) footerEl.style.display = 'none';
        return;
      }

      var html = cart.items.map(function (item) {
        var imgSrc = item.image ? item.image.replace(/(\.[^.]+)$/, '_80x80$1') : '';
        return '<div class="cart-drawer-item" data-key="' + item.key + '">' +
          '<div class="cart-drawer-item__image">' + (imgSrc ? '<img src="' + imgSrc + '" alt="' + escHtml(item.title) + '" loading="lazy">' : '') + '</div>' +
          '<div class="cart-drawer-item__details">' +
            '<div class="cart-drawer-item__title">' + escHtml(item.product_title) + '</div>' +
            (item.variant_title ? '<div class="cart-drawer-item__variant">' + escHtml(item.variant_title) + '</div>' : '') +
            '<div class="cart-drawer-item__price">' + moneyFormat(item.final_line_price) + '</div>' +
            '<div class="cart-drawer-item__actions">' +
              '<div class="cart-drawer-item__qty">' +
                '<button class="cart-drawer-item__qty-btn" data-action="decrease" aria-label="Decrease quantity">−</button>' +
                '<span class="cart-drawer-item__qty-num">' + item.quantity + '</span>' +
                '<button class="cart-drawer-item__qty-btn" data-action="increase" aria-label="Increase quantity">+</button>' +
              '</div>' +
              '<button class="cart-drawer-item__remove" data-action="remove">Remove</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');

      itemsEl.innerHTML = html;
      if (footerEl) {
        footerEl.style.display = '';
        if (subtotalEl) subtotalEl.textContent = moneyFormat(cart.total_price);
      }
      updateCartCount(cart.item_count);

      // Bind item events
      $$('.cart-drawer-item', itemsEl).forEach(function (el) {
        var key = el.dataset.key;
        el.querySelector('[data-action="remove"]').addEventListener('click', function () {
          updateItem(key, 0);
        });
        el.querySelector('[data-action="decrease"]').addEventListener('click', function () {
          var cur = parseInt(el.querySelector('.cart-drawer-item__qty-num').textContent, 10);
          updateItem(key, Math.max(0, cur - 1));
        });
        el.querySelector('[data-action="increase"]').addEventListener('click', function () {
          var cur = parseInt(el.querySelector('.cart-drawer-item__qty-num').textContent, 10);
          updateItem(key, cur + 1);
        });
      });
    }

    function updateItem(key, qty) {
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: qty })
      })
      .then(function (r) { return r.json(); })
      .then(function (cart) { renderCart(cart); })
      .catch(function () {});
    }

    if (overlay) overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);

    // Open on cart icon click
    $$('[data-cart-open]').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) close();
    });

    return { open: open, close: close, refresh: fetchAndRender };
  })();

  /* ── Cart Count Badge ───────────────────────────────────────── */
  function updateCartCount(count) {
    $$('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.dataset.count = count;
    });
  }

  /* ── Add To Cart ────────────────────────────────────────────── */
  (function initAddToCart() {
    var forms = $$('[data-product-form]');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('[data-atc-btn]') || form.querySelector('[type="submit"]');
        if (!btn) return;

        var fd = new FormData(form);
        var data = { items: [{ id: fd.get('id'), quantity: parseInt(fd.get('quantity') || 1, 10) }] };

        btn.classList.add('btn--loading');
        btn.disabled = true;

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        .then(function (r) { return r.json(); })
        .then(function () {
          btn.classList.remove('btn--loading');
          btn.disabled = false;
          CartDrawer.open();
        })
        .catch(function () {
          btn.classList.remove('btn--loading');
          btn.disabled = false;
        });
      });
    });
  })();

  /* ── Variant Selector ───────────────────────────────────────── */
  (function initVariantSelector() {
    var productForms = $$('[data-product-form]');
    productForms.forEach(function (form) {
      var variantInput = form.querySelector('[name="id"]');
      var priceEl = form.querySelector('[data-price-current]');
      var comparePriceEl = form.querySelector('[data-price-compare]');
      var atcBtn = form.querySelector('[data-atc-btn]');
      var variantData = null;

      var dataEl = document.getElementById('ProductVariantData');
      if (dataEl) {
        try { variantData = JSON.parse(dataEl.textContent); } catch (e) {}
      }

      // Radio variant options
      var optionSets = $$('[data-option-set]', form);
      optionSets.forEach(function (set) {
        var inputs = $$('input[type="radio"], .variant-option', set);
        inputs.forEach(function (input) {
          var evName = input.tagName === 'INPUT' ? 'change' : 'click';
          input.addEventListener(evName, function () {
            if (input.tagName !== 'INPUT') {
              $$('.variant-option', set).forEach(function (o) { o.classList.remove('selected'); });
              input.classList.add('selected');
            }
            updateVariant(form, variantInput, variantData, priceEl, comparePriceEl, atcBtn);
          });
        });
      });

      // Native select variant
      var variantSelect = form.querySelector('[data-variant-select]');
      if (variantSelect) {
        variantSelect.addEventListener('change', function () {
          if (variantInput) variantInput.value = variantSelect.value;
          if (variantData) {
            var selected = variantData.find(function (v) { return String(v.id) === String(variantSelect.value); });
            if (selected) applyVariant(selected, priceEl, comparePriceEl, atcBtn);
          }
        });
      }
    });

    function updateVariant(form, variantInput, variantData, priceEl, comparePriceEl, atcBtn) {
      if (!variantData) return;
      var selectedOptions = [];
      $$('[data-option-set]', form).forEach(function (set) {
        var checked = set.querySelector('input[type="radio"]:checked');
        var active = set.querySelector('.variant-option.selected');
        if (checked) selectedOptions.push(checked.value);
        else if (active) selectedOptions.push(active.dataset.value || active.textContent.trim());
      });

      var match = variantData.find(function (v) {
        return v.options.every(function (opt, i) { return opt === selectedOptions[i]; });
      });

      if (match) {
        if (variantInput) variantInput.value = match.id;
        applyVariant(match, priceEl, comparePriceEl, atcBtn);
      }
    }

    function applyVariant(variant, priceEl, comparePriceEl, atcBtn) {
      if (priceEl) priceEl.textContent = moneyFormat(variant.price);
      if (comparePriceEl) {
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          comparePriceEl.textContent = moneyFormat(variant.compare_at_price);
          comparePriceEl.style.display = '';
        } else {
          comparePriceEl.style.display = 'none';
        }
      }
      if (atcBtn) {
        if (!variant.available) {
          atcBtn.disabled = true;
          atcBtn.textContent = 'Sold Out';
        } else {
          atcBtn.disabled = false;
          atcBtn.textContent = 'Add to Cart';
        }
      }
    }
  })();

  /* ── Quantity Stepper ───────────────────────────────────────── */
  (function initQuantityStepper() {
    document.addEventListener('click', function (e) {
      if (!e.target.matches('[data-qty-btn]')) return;
      var action = e.target.dataset.qtyBtn;
      var wrapper = e.target.closest('.quantity-selector');
      if (!wrapper) return;
      var input = wrapper.querySelector('.quantity-selector__input');
      if (!input) return;
      var val = parseInt(input.value, 10) || 1;
      if (action === 'minus') val = Math.max(1, val - 1);
      if (action === 'plus') val = val + 1;
      input.value = val;
    });
  })();

  /* ── Product Gallery ────────────────────────────────────────── */
  (function initGallery() {
    var mainImg = $('.product-gallery__main img');
    var thumbnails = $$('.product-gallery__thumbnail');
    if (!mainImg || !thumbnails.length) return;

    thumbnails.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var src = thumb.querySelector('img');
        if (src) {
          mainImg.src = src.dataset.full || src.src.replace(/_\d+x\d+\./, '.');
          mainImg.alt = src.alt;
        }
        thumbnails.forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
      });
    });
  })();

  /* ── Product Tabs ───────────────────────────────────────────── */
  (function initProductTabs() {
    var triggers = $$('.product-tab__trigger');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var tab = trigger.closest('.product-tab');
        if (tab) tab.classList.toggle('is-open');
      });
    });
    // Open first tab by default
    var firstTab = $('.product-tab');
    if (firstTab) firstTab.classList.add('is-open');
  })();

  /* ── Collection Sort ────────────────────────────────────────── */
  (function initCollectionSort() {
    var sortSelect = $('#SortBy');
    if (!sortSelect) return;
    sortSelect.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', sortSelect.value);
      window.location.href = url.toString();
    });
  })();

  /* ── Smooth Scroll ──────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });

  /* ── Helper: escape HTML ─────────────────────────────────────── */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
