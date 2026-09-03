/* ============================================
   HANINGE GRÄVTJÄNST AB — Kontaktformulär (kontakt.html)
   Skickas via /api/contact (Resend)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
  const imageInput = document.getElementById('contact-image');
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

  function readFileAsBase64(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        // FileReader.result är "data:<mime>;base64,<data>" — vi vill bara ha delen efter kommat.
        const base64 = String(reader.result).split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (messageBox) messageBox.style.display = 'none';

    const file = imageInput && imageInput.files && imageInput.files[0];
    if (file && file.size > MAX_IMAGE_BYTES) {
      showMessage('Bilden är för stor. Max 4 MB.', true);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Skickar...';
    }

    const data = Object.fromEntries(new FormData(form).entries());
    delete data.image;

    const sendRequest = function () {
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
          showMessage('Tack för din förfrågan! Vi återkommer så snart vi kan.', false);
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
    };

    if (file) {
      readFileAsBase64(file)
        .then(function (base64) {
          data.imageBase64 = base64;
          data.imageFilename = file.name;
          data.imageType = file.type;
          sendRequest();
        })
        .catch(function () {
          showMessage('Kunde inte läsa bilden. Försök igen utan bild eller kontakta oss direkt.', true);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        });
    } else {
      sendRequest();
    }
  });
});
