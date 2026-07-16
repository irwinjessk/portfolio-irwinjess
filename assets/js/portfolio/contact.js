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
   const fields = Array.from(form.querySelectorAll('input, select, textarea'));

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const phoneRegex = /^\+?[0-9\s\-\(\)]{10,}$/;

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
       field.style.borderColor = '#FF5722';
       field.style.boxShadow = '0 0 8px rgba(255, 87, 34, 0.2)';
     } else {
       field.style.borderColor = 'rgba(255, 255, 255, 0.15)';
       field.style.boxShadow = 'none';
     }

     return isValid;
   }

   fields.forEach((field) => {
     field.addEventListener('blur', () => validateField(field));
   });

   form.addEventListener('submit', function (event) {
     event.preventDefault();

     let isFormValid = true;
     fields.forEach((field) => {
       if (!validateField(field)) {
         isFormValid = false;
       }
     });

     if (!isFormValid) {
       alert('⚠️ Veuillez remplir correctement tous les champs');
       return;
     }

     if (submitButton) {
       submitButton.disabled = true;
       submitButton.textContent = 'Envoi en cours...';
     }

     const data = Object.fromEntries(new FormData(form));
     console.log('Form submitted:', data);

     setTimeout(() => {
       alert('✅ Merci! Votre demande a été reçue.\nNous vous revenons sous 24h');
       form.reset();
       fields.forEach((field) => {
         field.style.borderColor = 'rgba(255, 255, 255, 0.15)';
         field.style.boxShadow = 'none';
       });
       if (submitButton) {
         submitButton.disabled = false;
         submitButton.textContent = 'ENVOYER MA DEMANDE →';
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
