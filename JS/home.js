import postApi from './api/postAPI';
import { setTextContent, truncateText } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// to use fromNow func
dayjs.extend(relativeTime);
function createPostItem(post) {
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

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  postList.forEach((post) => {
    const liElement = createPostItem(post);
    if (!liElement) return;

    ulElement.appendChild(liElement);
  });
}

function handleFilterChange(filterName, filterValue) {
  // update query params

  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, '', url);

  // fetch API
  // re-render postlist
}

function handlePrevClick() {
  console.log('vnd');
}
function handleNextClick() {
  console.log('usd');
}

function initPagination() {
  const ulPagination = document.getElementById('pagination');
  if (!ulPagination) return;

  const prevElement = ulPagination.firstElementChild?.firstElementChild;
  if (prevElement) {
    prevElement.addEventListener('click', (e) => {
      e.preventDefault();
      handlePrevClick();
    });
  }

  const nextlement = ulPagination.lastElementChild?.firstElementChild;
  if (nextlement) {
    nextlement.addEventListener('click', (e) => {
      e.preventDefault();
      handleNextClick();
    });
  }
}

function initURL() {
  const url = new URL(window.location);

  // update search params if needed

  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

  history.pushState({}, '', url);
}

(async () => {
  try {
    initPagination();
    initURL();
    const queryParams = new URLSearchParams(window.location.search);

    const { data, pagination } = await postApi.getALL(queryParams);
    renderPostList(data);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
