/*-----------------------------------------------------------
 * Contact form — validation + envoi Formspree
 *--
 */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mkodjovr';
  const NEED_TYPE_LABELS = {
    automatisation: 'Automatisation',
    maintenance: 'Maintenance informatique',
    applications: 'Applications sur mesure',
    formation: 'Formation',
  };

  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = submitButton ? submitButton.querySelector('span') : null;
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const defaultSubmitText = submitLabel ? submitLabel.textContent.trim() : 'Envoyer ma demande';
  const fields = Array.from(form.querySelectorAll('input, select, textarea'));
  const phoneInput = form.querySelector('#phone');

  let phoneIti = null;
  if (phoneInput && window.intlTelInput) {
    phoneIti = window.intlTelInput(phoneInput, {
      initialCountry: 'ci',
      preferredCountries: ['ci', 'fr', 'us', 'gb'],
      separateDialCode: true,
      nationalMode: false,
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.16/build/js/utils.js',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9\s\-()]{8,}$/;

  const hideFeedback = () => {
    if (successMessage) {
      successMessage.classList.add('is-hidden');
    }
    if (errorMessage) {
      errorMessage.classList.add('is-hidden');
      errorMessage.textContent = '';
    }
  };

  const resetSubmitButton = () => {
    if (submitButton) {
      submitButton.disabled = false;
    }
    if (submitLabel) {
      submitLabel.textContent = defaultSubmitText;
    }
  };

  const resetFieldStyles = () => {
    fields.forEach((field) => {
      field.style.borderColor = 'rgba(255, 255, 255, 0.09)';
      field.style.boxShadow = 'none';
      if (field.tagName === 'SELECT') {
        field.style.backgroundColor = 'rgba(12, 16, 22, 0.92)';
      }
    });
  };

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    if (field.required && !value) {
      isValid = false;
    }

    if (isValid && field.type === 'email') {
      isValid = emailRegex.test(value);
    }

    if (isValid && field.type === 'tel') {
      const phoneValue = phoneIti ? phoneIti.getNumber() : value;
      isValid = phoneRegex.test(phoneValue);
    }

    if (!isValid) {
      field.style.borderColor = 'rgba(239, 68, 68, 0.45)';
      field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    } else {
      field.style.borderColor = 'rgba(255, 255, 255, 0.09)';
      field.style.boxShadow = 'none';
    }

    if (field.tagName === 'SELECT' && isValid) {
      field.style.backgroundColor = 'rgba(12, 16, 22, 0.92)';
    }

    return isValid;
  }

  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', hideFeedback);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    hideFeedback();

    let isFormValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      if (errorMessage) {
        errorMessage.textContent = 'Veuillez vérifier les champs du formulaire.';
        errorMessage.classList.remove('is-hidden');
      }
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }
    if (submitLabel) {
      submitLabel.textContent = 'Envoi en cours...';
    }

    const formData = Object.fromEntries(new FormData(form));
    const needTypeLabel = NEED_TYPE_LABELS[formData.needType] || formData.needType;
    const phoneNumber = phoneIti ? phoneIti.getNumber() : formData.phone;

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: phoneNumber,
      needType: needTypeLabel,
      message: formData.message,
      _subject: 'Nouvelle demande de devis — Portfolio Irwin Jess',
      _replyto: formData.email,
    };

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          const detail = result.errors?.map((item) => item.message).join(' ') || '';
          throw new Error(detail || 'Impossible d\'envoyer votre demande pour le moment.');
        }

        form.reset();
        resetFieldStyles();

        if (successMessage) {
          successMessage.classList.remove('is-hidden');
        }
      })
      .catch((error) => {
        if (errorMessage) {
          errorMessage.textContent =
            error.message || 'Une erreur est survenue. Réessayez ou contactez-moi directement par email.';
          errorMessage.classList.remove('is-hidden');
        }
      })
      .finally(resetSubmitButton);
  });
});
