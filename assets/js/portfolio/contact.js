/*-----------------------------------------------------------
 * Template Name    : RectCV - Personal Bootstrap 4 HTML Template
 * Author           : Narek Sukiasyan
 * Version          : 1.0.0
 * Created          : May 2020
 * File Description : Contact US script file for theme
 *--
 */

document.addEventListener('DOMContentLoaded', function () {
   const form = document.getElementById('contactForm');
   if (!form) return;

   const submitButton = form.querySelector('button[type="submit"]');
   const submitLabel = submitButton ? submitButton.querySelector('span') : null;
   const successMessage = document.getElementById('success-message');
   const errorMessage = document.getElementById('error-message');
   const defaultSubmitText = submitLabel ? submitLabel.textContent.trim() : 'Envoyer ma demande';
   const fields = Array.from(form.querySelectorAll('input, select, textarea'));

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const phoneRegex = /^\+?[0-9\s\-\(\)]{8,}$/;

   const hideFeedback = () => {
     if (successMessage) {
       successMessage.classList.add('is-hidden');
     }
     if (errorMessage) {
       errorMessage.classList.add('is-hidden');
       errorMessage.textContent = '';
     }
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
       isValid = phoneRegex.test(value);
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

     const data = Object.fromEntries(new FormData(form));
     console.log('Form submitted:', data);

     setTimeout(() => {
       form.reset();
       fields.forEach((field) => {
         field.style.borderColor = 'rgba(255, 255, 255, 0.09)';
         field.style.boxShadow = 'none';
         if (field.tagName === 'SELECT') {
           field.style.backgroundColor = 'rgba(12, 16, 22, 0.92)';
         }
       });

       if (successMessage) {
         successMessage.classList.remove('is-hidden');
       }

       if (submitButton) {
         submitButton.disabled = false;
       }
       if (submitLabel) {
         submitLabel.textContent = defaultSubmitText;
       }
     }, 750);
   });
});

// International Telephone Input initialization
document.addEventListener('DOMContentLoaded', function () {
   const phoneInput = document.querySelector("#phone");
   if (phoneInput && window.intlTelInput) {
     window.intlTelInput(phoneInput, {
       initialCountry: "ci",
       preferredCountries: ["ci", "fr", "us", "gb"],
       separateDialCode: true,
       nationalMode: false,
       utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.16/build/js/utils.js"
     });
   }
});
