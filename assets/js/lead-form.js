/* ============================================
   HANINGE GRÄVTJÄNST AB — Lågtröskel-minformulär
   Delad mellan startsidans hero-kort och sidopanelens formulär på
   tjänste-/ort-sidor. Skickas via /api/contact (samma endpoint som
   kontakt.html, men bara namn/telefon/tjänst). Varje formulär med
   klassen .nt-lead-form binds oberoende, så flera kan finnas på samma
   sida utan att krocka (skiljs åt via unika id-attribut i markupen).
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('form.nt-lead-form').forEach(function (form) {
    const messageBox = form.querySelector('.nt-form-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    function showMessage(text, isError) {
      if (!messageBox) return;
      messageBox.textContent = text;
      messageBox.style.display = 'block';
      messageBox.style.background = isError ? '#fdecea' : '#e9f7ef';
      messageBox.style.color = isError ? '#b3261e' : '#1e7d3c';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (messageBox) messageBox.style.display = 'none';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Skickar...';
      }

      const data = Object.fromEntries(new FormData(form).entries());
      data.source = form.dataset.source || 'lead-form';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          return res.json().then(function (body) {
            if (!res.ok) throw new Error(body.error || 'Något gick fel.');
            return body;
          });
        })
        .then(function () {
          showMessage('Tack! Vi återkommer så snart vi kan.', false);
          form.reset();
        })
        .catch(function (err) {
          showMessage(err.message || 'Kunde inte skicka förfrågan. Försök igen eller ring oss direkt.', true);
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        });
    });
  });
});
