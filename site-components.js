(function(){
  // Global helper: explicit 'Download PDF' button uses browser Print -> Save as PDF
  window.downloadPDF = function(){
    window.print();
  };
  const cfg = window.HOSTEL_CONFIG || {};
  const phoneLink = cfg.PHONE_WHATSAPP || "#";
  const phoneText = cfg.PHONE_DISPLAY || "";
  const email = cfg.EMAIL || "";
  const mapsUrl = cfg.MAPS_URL || "#";
  const addr1 = cfg.ADDRESS_LINE1 || "";
  const addr2 = cfg.ADDRESS_LINE2 || "";
  const logo = cfg.LOGO_URL || "";
  const ctaLabel = cfg.PRIMARY_CTA_LABEL || "Book Now";
  const ctaUrl = cfg.PRIMARY_CTA_URL || "#";
  const year = new Date().getFullYear();

  const header = document.createElement("header");
  header.innerHTML = `
    <div class="mh-topstrip">
      <div class="mh-topstrip-inner">
        <div class="mh-contact">
          <a href="${phoneLink}" target="_blank" rel="noopener">${phoneText}</a>
          <span>${email}</span>
        </div>
        <button class="mh-langbtn" type="button" id="mhLangBtn">ES / EN</button>
      </div>
    </div>
    <div class="mh-nav">
      <div class="mh-nav-inner">
        <div class="mh-brand">
          ${logo ? `<img src="${logo}" alt="${cfg.PROPERTY_NAME || "Hostel"} logo" />` : `<div class="mh-badge">${cfg.PROPERTY_NAME || "Hostel"}</div>`}
        </div>
        <a class="mh-cta" href="${ctaUrl}" target="_blank" rel="noopener">${ctaLabel}</a>
      </div>
    </div>
  `;
  document.body.prepend(header);

  // Inject a print-only branded header inside the document card (for PDF exports)
  try{
    const card = document.querySelector(".card");
    if(card && !card.querySelector(".mh-printhead")){
      const ph = document.createElement("div");
      ph.className = "mh-printhead";
      ph.innerHTML = `
        <div class="mh-ph-left">
          ${logo ? `<img src="${logo}" alt="${cfg.PROPERTY_NAME || "Hostel"} logo" />` : ``}
          <div>
            <div class="mh-ph-title">${cfg.PROPERTY_NAME || "Hostel"}</div>
            <div class="mh-ph-meta">${cfg.TAGLINE || ""}</div>
          </div>
        </div>
        <div class="mh-ph-right">
          ${phoneText ? phoneText : ""}${phoneText && email ? " • " : ""}${email ? email : ""}
          ${addr1 || addr2 ? `\n${addr1}${addr1 && addr2 ? ", " : ""}${addr2}` : ""}
        </div>
      `;
      // Put it at the very top of the card
      card.insertBefore(ph, card.firstChild);
    }
  }catch(e){}

  const footer = document.createElement("footer");
  footer.className = "mh-footer";
  footer.innerHTML = `
    <div class="mh-footer-inner">
      <div>
        ${logo ? `<img src="${logo}" alt="${cfg.PROPERTY_NAME || "Hostel"} logo" style="height:46px;width:auto;display:block;margin-bottom:10px;" />` : ""}
        <small>${cfg.TAGLINE || ""}</small><br/>
        <small><a href="${phoneLink}" target="_blank" rel="noopener">${phoneText}</a> &nbsp; ${email}</small><br/>
        <small><a href="${mapsUrl}" target="_blank" rel="noopener">${addr1}${addr2 ? ", " + addr2 : ""}</a></small>
      </div>
      <div class="mh-cols">
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="${ctaUrl}" target="_blank" rel="noopener">Book Now</a></li>
            <li><a href="index.html">Documents</a></li>
          </ul>
        </div>
        <div>
          <h4>Legal</h4>
          <ul>
            <li><a href="https://mandiocahostel.com/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a></li>
            <li><a href="https://mandiocahostel.com/terms" target="_blank" rel="noopener">Terms & Conditions</a></li>
            <li><a href="https://mandiocahostel.com/cancellation-policy" target="_blank" rel="noopener">Cancellation Policy</a></li>
          </ul>
        </div>
      </div>
      <div>
        <small>© ${year} ${cfg.PROPERTY_NAME || "Hostel"}. All rights reserved.</small>
      </div>
    </div>
  `;
  document.body.append(footer);
})();

// Language toggle wiring (works with existing page toggleLang, or generic ids)
(function(){
  // Global helper: explicit 'Download PDF' button uses browser Print -> Save as PDF
  window.downloadPDF = function(){
    window.print();
  };
  function genericToggle(){
    const es = document.getElementById('es') || document.getElementById('esBlock');
    const en = document.getElementById('en') || document.getElementById('enBlock');
    if(!es || !en) return;
    const isEsHidden = es.classList.contains('hidden');
    // If ES hidden, show ES; else show EN
    if(isEsHidden){ es.classList.remove('hidden'); en.classList.add('hidden'); }
    else { es.classList.add('hidden'); en.classList.remove('hidden'); }
  }
  function handle(){
    if(typeof window.toggleLang === 'function') window.toggleLang();
    else genericToggle();
  }
  document.addEventListener('click', function(e){
    const btn = e.target && (e.target.id==='mhLangBtn' ? e.target : null);
    if(btn){ e.preventDefault(); handle(); }
  });

  // Ensure every document has a visible "Download PDF" button (bilingual).
  try{
    const actions = document.querySelector(".topbar .actions");
    if(actions && !actions.querySelector(".mh-download-pdf")){
      const btn = document.createElement("button");
      btn.className = "btn mh-download-pdf";
      btn.type = "button";
      btn.textContent = "Descargar PDF / Download PDF";
      btn.addEventListener("click", ()=>window.print());
      // Place it next to the existing Print/PDF button if present
      const printBtn = [...actions.querySelectorAll("button")].find(b=>{
        const t = (b.textContent||"").toLowerCase();
        return t.includes("imprimir") || t.includes("print") || t.includes("pdf");
      });
      if(printBtn && printBtn.nextSibling){
        actions.insertBefore(btn, printBtn.nextSibling);
      }else if(printBtn){
        actions.appendChild(btn);
      }else{
        actions.prepend(btn);
      }
    }
  }catch(e){}

})();


/* ===== Mandioca: per-document toolbar (fallback) ===== */
(function(){
  try{
    // Create a simple toolbar inside the document header/content for every page.
    // This guarantees buttons are visible even if some layout hides the topbar.
    const existing = document.querySelector(".mh-doc-toolbar");
    if(existing) return;

    const targetHeader =
      document.querySelector("header") ||
      document.querySelector(".content") ||
      document.querySelector(".box") ||
      document.body;

    const bar = document.createElement("div");
    bar.className = "mh-doc-toolbar print-hide";
    bar.innerHTML = `
      <button class="btn miniBtn" type="button" data-action="print">Imprimir / PDF</button>
      <button class="btn miniBtn" type="button" data-action="download">Descargar PDF / Download PDF</button>
      <button class="btn primary miniBtn" type="button" data-action="lang">ES / EN</button>
    `;

    // Insert right after the main h1 if possible
    const h1 = document.querySelector("header h1, .content h1, h1");
    if(h1 && h1.parentElement){
      h1.insertAdjacentElement("afterend", bar);
    } else {
      targetHeader.insertAdjacentElement("afterbegin", bar);
    }

    bar.addEventListener("click", (e)=>{
      const btn = e.target.closest("button");
      if(!btn) return;
      const act = btn.getAttribute("data-action");
      if(act === "print" || act === "download"){
        window.print();
      } else if(act === "lang"){
        // Best-effort: use page's toggleLang() if available, otherwise flip ?lang=
        if(typeof window.toggleLang === "function"){
          window.toggleLang();
        } else {
          const url = new URL(window.location.href);
          const curr = url.searchParams.get("lang") || "es";
          url.searchParams.set("lang", curr.toLowerCase()==="es" ? "en" : "es");
          window.location.href = url.toString();
        }
      }
    });
  }catch(e){}
})();
