import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: 'linear-gradient(to right, #03a9f4, #01579b)',
      },
    }).showToast();
  },

  success(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: 'linear-gradient(to right, #4caf50, #1b5e20)',
      },
    }).showToast();
  },

  warning(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: 'linear-gradient(to right, #ff9800, #e65100)',
      },
    }).showToast();
  },

  error(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: 'linear-gradient(to right, #ef5350, #c62828)',
      },
    }).showToast();
  },
};
