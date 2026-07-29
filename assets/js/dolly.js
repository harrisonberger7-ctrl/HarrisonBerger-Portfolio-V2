(() => {
  const modal = document.querySelector('#image-modal');
  const modalImage = document.querySelector('#modal-image');
  const modalCaption = document.querySelector('#modal-caption');
  const closeButton = document.querySelector('.modal-close');
  const year = document.querySelector('#current-year');

  if (year) year.textContent = new Date().getFullYear();

  if (!modal || !modalImage || !modalCaption) return;

  document.querySelectorAll('[data-full]').forEach((button) => {
    button.addEventListener('click', () => {
      const fullImage = button.getAttribute('data-full');
      const altText = button.getAttribute('data-alt') || 'Project image';
      modalImage.src = fullImage;
      modalImage.alt = altText;
      modalCaption.textContent = altText;
      modal.showModal();
    });
  });

  const closeModal = () => {
    modal.close();
    modalImage.src = '';
  };

  closeButton?.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
})();
