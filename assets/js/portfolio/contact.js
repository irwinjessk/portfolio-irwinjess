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
  const ALLOWED_NEED_TYPES = Object.keys(NEED_TYPE_LABELS);

  const RULES = {
    name: {
      min: 2,
      max: 100,
      pattern: /^[\p{L}\p{N}\s'.-]+$/u,
      messages: {
        required: 'Indiquez votre nom ou le nom de votre entreprise.',
        min: 'Le nom doit contenir au moins 2 caractères.',
        max: 'Le nom ne peut pas dépasser 100 caractères.',
        pattern: 'Utilisez uniquement des lettres, chiffres, espaces ou tirets.',
        letters: 'Le nom doit contenir au moins 2 lettres.',
      },
    },
    email: {
      max: 254,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      messages: {
        required: 'Indiquez une adresse email valide.',
        pattern: 'Le format de l\'email est incorrect (ex. nom@domaine.com).',
        max: 'L\'email ne peut pas dépasser 254 caractères.',
      },
    },
    phone: {
      messages: {
        required: 'Indiquez un numéro de téléphone.',
        invalid: 'Le numéro de téléphone n\'est pas valide.',
      },
    },
    needType: {
      messages: {
        required: 'Sélectionnez un type de besoin.',
        invalid: 'Choisissez une option valide dans la liste.',
      },
    },
    message: {
      min: 10,
      max: 2000,
      messages: {
        required: 'Décrivez brièvement votre besoin.',
        min: 'Le message doit contenir au moins 10 caractères.',
        max: 'Le message ne peut pas dépasser 2000 caractères.',
      },
    },
  };

  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = submitButton ? submitButton.querySelector('span') : null;
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const honeypotInput = form.querySelector('#company');
  const messageInput = form.querySelector('#message');
  const messageCounter = document.getElementById('message-counter');
  const defaultSubmitText = submitLabel ? submitLabel.textContent.trim() : 'Envoyer ma demande';
  const fields = Array.from(form.querySelectorAll('input:not(#company), select, textarea'));
  const phoneInput = form.querySelector('#phone');

  const fieldErrors = {
    name: document.getElementById('name-error'),
    email: document.getElementById('email-error'),
    phone: document.getElementById('phone-error'),
    needType: document.getElementById('needType-error'),
    message: document.getElementById('message-error'),
  };

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

  const setFieldState = (field, isValid, message = '') => {
    const errorEl = fieldErrors[field.name];
    field.classList.toggle('is-invalid', !isValid);
    field.setAttribute('aria-invalid', isValid ? 'false' : 'true');

    if (errorEl) {
      errorEl.textContent = isValid ? '' : message;
    }

    if (isValid) {
      field.style.borderColor = 'rgba(255, 255, 255, 0.09)';
      field.style.boxShadow = 'none';
      if (field.tagName === 'SELECT') {
        field.style.backgroundColor = 'rgba(12, 16, 22, 0.92)';
      }
    } else {
      field.style.borderColor = 'rgba(239, 68, 68, 0.45)';
      field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }
  };

  const resetFieldStyles = () => {
    fields.forEach((field) => setFieldState(field, true));
    updateMessageCounter();
  };

  const countLetters = (value) => (value.match(/\p{L}/gu) || []).length;

  const isPhoneValid = () => {
    if (!phoneInput) return false;

    const rawValue = phoneInput.value.trim();
    if (!rawValue) return false;

    if (phoneIti && window.intlTelInputUtils) {
      return phoneIti.isValidNumber();
    }

    const phoneValue = phoneIti ? phoneIti.getNumber() : rawValue;
    return /^\+?[0-9\s\-()]{8,20}$/.test(phoneValue);
  };

  function validateField(field, { showMessage = true } = {}) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    if (field.name === 'name') {
      if (!value) {
        isValid = false;
        message = RULES.name.messages.required;
      } else if (value.length < RULES.name.min) {
        isValid = false;
        message = RULES.name.messages.min;
      } else if (value.length > RULES.name.max) {
        isValid = false;
        message = RULES.name.messages.max;
      } else if (!RULES.name.pattern.test(value)) {
        isValid = false;
        message = RULES.name.messages.pattern;
      } else if (countLetters(value) < 2) {
        isValid = false;
        message = RULES.name.messages.letters;
      }
    }

    if (isValid && field.name === 'email') {
      if (!value) {
        isValid = false;
        message = RULES.email.messages.required;
      } else if (value.length > RULES.email.max) {
        isValid = false;
        message = RULES.email.messages.max;
      } else if (!RULES.email.pattern.test(value)) {
        isValid = false;
        message = RULES.email.messages.pattern;
      }
    }

    if (isValid && field.name === 'phone') {
      if (!phoneInput.value.trim()) {
        isValid = false;
        message = RULES.phone.messages.required;
      } else if (!isPhoneValid()) {
        isValid = false;
        message = RULES.phone.messages.invalid;
      }
    }

    if (isValid && field.name === 'needType') {
      if (!value) {
        isValid = false;
        message = RULES.needType.messages.required;
      } else if (!ALLOWED_NEED_TYPES.includes(value)) {
        isValid = false;
        message = RULES.needType.messages.invalid;
      }
    }

    if (isValid && field.name === 'message') {
      if (!value) {
        isValid = false;
        message = RULES.message.messages.required;
      } else if (value.length < RULES.message.min) {
        isValid = false;
        message = RULES.message.messages.min;
      } else if (value.length > RULES.message.max) {
        isValid = false;
        message = RULES.message.messages.max;
      }
    }

    if (showMessage) {
      setFieldState(field, isValid, message);
    }

    return isValid;
  }

  const updateMessageCounter = () => {
    if (!messageInput || !messageCounter) return;

    const length = messageInput.value.length;
    messageCounter.textContent = `${length} / ${RULES.message.max}`;
    messageCounter.classList.toggle('is-limit', length >= RULES.message.max);
  };

  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      hideFeedback();
      if (field.classList.contains('is-invalid')) {
        validateField(field);
      }
      if (field.name === 'message') {
        updateMessageCounter();
      }
    });
  });

  if (messageInput) {
    updateMessageCounter();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    hideFeedback();

    if (honeypotInput && honeypotInput.value.trim()) {
      if (successMessage) {
        successMessage.classList.remove('is-hidden');
      }
      form.reset();
      resetFieldStyles();
      return;
    }

    let isFormValid = true;
    let firstInvalidField = null;

    fields.forEach((field) => {
      if (!validateField(field)) {
        isFormValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    });

    if (!isFormValid) {
      if (errorMessage) {
        errorMessage.textContent = 'Veuillez corriger les champs signalés avant l\'envoi.';
        errorMessage.classList.remove('is-hidden');
      }
      if (firstInvalidField) {
        firstInvalidField.focus();
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
    const phoneNumber = phoneIti ? phoneIti.getNumber() : formData.phone.trim();

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: phoneNumber,
      needType: needTypeLabel,
      message: formData.message.trim(),
      _subject: 'Nouvelle demande de devis — Portfolio Irwin Jess',
      _replyto: formData.email.trim(),
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
