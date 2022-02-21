import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncateText } from './common';

// to use fromNow func
dayjs.extend(relativeTime);

export function createPostItem(post) {
  if (!post) return;

  const postTemplate = document.getElementById('postItemTemplate');
  if (!postTemplate) return;

  const postItem = postTemplate.content.firstElementChild.cloneNode(true);
  if (!postItem) return;

  // update title, description, author, thumbnail
  setTextContent(postItem, '[data-id="title"]', post.title);
  setTextContent(postItem, '[data-id="author"]', post.author);

  setTextContent(postItem, '[data-id="description"]', truncateText(post.description, 100));

  setTextContent(postItem, '[data-id="timeSpan"]', ` - ${dayjs(post.updateAt).fromNow()}`);

  const thumbnailElement = postItem.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=nxuanthanh';
    });
  }

  // attach events

  return postItem;
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostItem(post);
    if (!liElement) return;

    ulElement.appendChild(liElement);

    const divElement = liElement.firstElementChild;
    if (!divElement) return;

    divElement.addEventListener('click', () => {
      window.location.assign(`/postDetail.html?id=${post.id}`);
    });
  });
}
