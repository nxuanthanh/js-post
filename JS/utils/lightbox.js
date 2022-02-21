function showModal(modalElement) {
  if (!window.bootstrap) return;
  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) {
    modal.show();
  }
}

export function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  if (modalElement.dataset.registered) return;

  const imgElement = document.querySelector(imgSelector);
  const prevButton = document.querySelector(prevSelector);
  const nextButton = document.querySelector(nextSelector);

  if (!imgElement || !prevButton || !nextButton) return;

  let album = [];
  let currentIndex;

  function showImageAtIndex(index) {
    imgElement.src = album[index].src;
  }

  document.addEventListener('click', (e) => {
    const { target } = e;
    if (target.tagName !== 'IMG' && !target.dataset.album) return;

    album = document.querySelectorAll('img[data-album="post-image"]');

    currentIndex = [...album].findIndex((x) => x === target);

    showImageAtIndex(currentIndex);
    showModal(modalElement);
  });

  prevButton.addEventListener('click', (e) => {
    currentIndex = (currentIndex - 1 + album.length) % album.length;
    showImageAtIndex(currentIndex);
  });

  nextButton.addEventListener('click', (e) => {
    currentIndex = (currentIndex + 1) % album.length;
    showImageAtIndex(currentIndex);
  });

  modalElement.dataset.registered = 'true';
}
