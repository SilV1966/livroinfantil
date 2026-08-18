(() => {
  const BOOKS = window.BOOKS || [];
  const CONFIG = window.SITE_CONFIG || {};
  const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const SHIPPING = 10.00;
  let cart = JSON.parse(localStorage.getItem("sv_cart") || "{}");

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const booksGrid = $("#booksGrid");
  const cartDrawer = $("#cartDrawer");
  const backdrop = $("#drawerBackdrop");
  const cartItems = $("#cartItems");
  const cartCount = $("#cartCount");
  const cartTotal = $("#cartTotal");
  const bookModal = $("#bookModal");
  const modalContent = $("#modalContent");

  document.getElementById("year").textContent = new Date().getFullYear();

  function coverMarkup(book, modal=false) {
    if (book.cover) {
      return `<img src="${book.cover}" alt="Capa do livro ${book.title}" loading="lazy">`;
    }
    const cls = modal ? "modal-book-cover" : "cover-placeholder";
    return `<div class="${cls}">
      <strong>${book.shortTitle}</strong>
      <small>${book.subtitle}</small>
    </div>`;
  }

  function renderBooks() {
    booksGrid.innerHTML = BOOKS.map(book => `
      <article class="book-card reveal" style="--book-color:${book.color}">
        <div class="book-cover">${coverMarkup(book)}</div>
        <div class="book-meta">
          <span class="theme">${book.theme}</span>
          <h3>${book.title}</h3>
          <p>${book.description}</p>
          <div class="book-price-row">
            <strong>${currency.format(book.price)}</strong>
            <button class="link-button" data-detail="${book.id}">Ver a história →</button>
          </div>
        </div>
      </article>
    `).join("");

    $$("[data-detail]").forEach(btn => btn.addEventListener("click", () => openBook(btn.dataset.detail)));
    observeReveals();
  }

  function openBook(id) {
    const book = BOOKS.find(b => b.id === id);
    if (!book) return;
    modalContent.innerHTML = `
      <div class="modal-book" style="--modal-color:${book.color}">
        <div class="modal-visual">${coverMarkup(book, true)}</div>
        <div class="modal-copy">
          <span class="eyebrow">${book.theme}</span>
          <h2 id="modalTitle">${book.title}</h2>
          <p><strong>${book.age}</strong></p>
          <p>${book.longDescription}</p>
          <div class="modal-tags">${book.tags.map(t => `<span>${t}</span>`).join("")}</div>
          <div class="modal-actions">
            <strong>${currency.format(book.price)}</strong>
            <button class="btn btn-primary" data-add="${book.id}">Adicionar à sacola</button>
          </div>
        </div>
      </div>`;
    bookModal.classList.add("open");
    bookModal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
    $("[data-add]", modalContent).addEventListener("click", () => {
      addToCart(id);
      closeModal();
      openCart();
    });
  }

  function closeModal() {
    bookModal.classList.remove("open");
    bookModal.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }

  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    persistCart();
  }
  function changeQty(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    persistCart();
  }
  function persistCart() {
    localStorage.setItem("sv_cart", JSON.stringify(cart));
    renderCart();
  }
  function cartEntries() {
    return Object.entries(cart)
      .map(([id, qty]) => ({ book: BOOKS.find(b => b.id === id), qty }))
      .filter(x => x.book && x.qty > 0);
  }
  function renderCart() {
    const entries = cartEntries();
    const count = entries.reduce((sum, x) => sum + x.qty, 0);
    const subtotal = entries.reduce((sum, x) => sum + x.book.price * x.qty, 0);
    const total = entries.length ? subtotal + SHIPPING : 0;
    cartCount.textContent = count;
    cartTotal.textContent = currency.format(total);

    if (!entries.length) {
      cartItems.innerHTML = `<div class="cart-empty">Sua sacola ainda está vazia.<br>Escolha um dos livros para começar.</div>`;
      return;
    }
    cartItems.innerHTML = entries.map(({book,qty}) => `
      <div class="cart-item">
        <div>
          <strong>${book.shortTitle}</strong>
          <small>${currency.format(book.price)} cada</small>
        </div>
        <div class="qty-controls">
          <button data-minus="${book.id}" aria-label="Diminuir quantidade">−</button>
          <span>${qty}</span>
          <button data-plus="${book.id}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
    `).join("");
    $$("[data-minus]", cartItems).forEach(b => b.onclick = () => changeQty(b.dataset.minus,-1));
    $$("[data-plus]", cartItems).forEach(b => b.onclick = () => changeQty(b.dataset.plus,1));
  }

  function openCart() {
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden","false");
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden","true");
    backdrop.hidden = true;
    document.body.style.overflow = "";
  }

  async function sendToEndpoint(payload) {
    if (!CONFIG.leadEndpoint) {
      console.info("Endpoint não configurado. Dados não enviados:", payload);
      return { configured:false };
    }
    await fetch(CONFIG.leadEndpoint, {
      method:"POST",
      mode:"no-cors",
      headers:{ "Content-Type":"text/plain;charset=utf-8" },
      body:JSON.stringify(payload)
    });
    return { configured:true };
  }

  $("#leadForm").addEventListener("submit", async e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const status = $("#formStatus");
    status.textContent = "Registrando...";
    const payload = Object.fromEntries(form.entries());
    payload.tipo = "lead";
    payload.data = new Date().toISOString();
    try {
      const result = await sendToEndpoint(payload);
      status.textContent = result.configured
        ? "Obrigado! Seus dados foram enviados."
        : "Formulário pronto. Configure o endpoint do Google Apps Script em js/config.js para armazenar os dados.";
      if (result.configured) e.currentTarget.reset();
    } catch {
      status.textContent = "Não foi possível enviar agora. Tente novamente.";
    }
  });

  $("#orderForm").addEventListener("submit", async e => {
    e.preventDefault();
    const entries = cartEntries();
    if (!entries.length) {
      alert("Escolha pelo menos um livro.");
      return;
    }
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const subtotal = entries.reduce((sum, x) => sum + x.book.price*x.qty, 0);
    const frete = SHIPPING;
    const total = subtotal + frete;
    const order = "SV-" + Date.now().toString().slice(-8);
    const itemsText = entries.map(x => `${x.qty}x ${x.book.shortTitle}`).join(", ");
    const enderecoCompleto = [
      data.logradouro,
      data.numero,
      data.complemento,
      data.bairro,
      data.cidade,
      data.uf,
      data.cep
    ].filter(Boolean).join(", ");

    const payload = {
      tipo:"pedido",
      pedido:order,
      ...data,
      enderecoCompleto,
      itens:itemsText,
      subtotal:subtotal.toFixed(2),
      frete:frete.toFixed(2),
      total:total.toFixed(2),
      data:new Date().toISOString()
    };
    try { await sendToEndpoint(payload); } catch {}

    $("#paymentBox").hidden = false;
    $("#orderNumber").textContent = `Pedido ${order} • ${itemsText} • Subtotal ${currency.format(subtotal)} • Frete ${currency.format(frete)} • Total ${currency.format(total)}`;

    const wa = String(CONFIG.whatsappNumber || "").replace(/\D/g,"");
    const msg = encodeURIComponent(`Olá! Fiz o pagamento do pedido ${order}. Livros: ${itemsText}. Subtotal: ${currency.format(subtotal)}. Frete: ${currency.format(frete)}. Total pago: ${currency.format(total)}. Nome: ${data.nome}. Endereço: ${enderecoCompleto}.`);
    const waLink = $("#whatsappPayment");
    waLink.href = wa ? `https://wa.me/${wa}?text=${msg}` : `https://wa.me/?text=${msg}`;
    $("#paymentBox").scrollIntoView({ behavior:"smooth", block:"center" });
  });

  function observeReveals() {
    const els = $$(".reveal:not(.visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.12 });
    els.forEach(el => io.observe(el));
  }

  $(".menu-toggle").addEventListener("click", e => {
    const nav = $("#menu");
    const open = nav.classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", String(open));
  });
  $$("#menu a").forEach(a => a.addEventListener("click",()=>$("#menu").classList.remove("open")));

  $("#openCart").onclick = openCart;
  $("#openCartFromPix").onclick = openCart;
  $("#closeCart").onclick = closeCart;
  backdrop.onclick = closeCart;
  $("#closeModal").onclick = closeModal;
  bookModal.addEventListener("click", e => { if (e.target === bookModal) closeModal(); });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal(); closeCart(); }
  });

  $$(".video-placeholder button").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Substitua este bloco por um vídeo do YouTube/Vimeo ou arquivo MP4. O layout já está reservado.");
    });
  });

  $("#privacyLink").addEventListener("click", e => {
    e.preventDefault();
    window.location.href = "privacidade.html";
  });

  renderBooks();
  renderCart();
  observeReveals();
})();
