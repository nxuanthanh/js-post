import dayjs from 'dayjs';
import postApi from './api/postAPI';
import { registerLightbox, setTextContent } from './utils';

function renderPostDetail(post) {
  if (!post) return;

  const postDetail = document.querySelector('.post-detail');

  setTextContent(postDetail, '#postDetailTitle', post.title);
  setTextContent(postDetail, '#postDetailAuthor', post.author);
  setTextContent(postDetail, '#postDetailDescription', post.description);
  setTextContent(postDetail, '#postDetailTimeSpan', dayjs(post.updatedAt).format(' - DD/MM/YYYY'));

  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url('${post.imageUrl}')`;

    heroImage.addEventListener('error', () => {
      heroImage.style.backgroundImage =
        "url('https://via.placeholder.com/1368x400?text=thumbnail')";
    });
  }

  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/addEditPost.html?id=${post.id}`;
    editPageLink.innerHTML = `<i class="fas fa-edit"></i> Edit post`;
  }
}

(async () => {
  // get post id from URL
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    if (!postId) return;

    const post = await postApi.getById(postId);

    renderPostDetail(post);

    registerLightbox({
      modalId: 'lightbox',
      imgSelector: 'img[data-id="lightboxImg"]',
      prevSelector: 'button[data-id="lightboxPrev"]',
      nextSelector: 'button[data-id="lightboxNext"]',
    });
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
