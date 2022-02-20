import postApi from './api/postAPI';
import { getUlPagination, setTextContent, truncateText } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import debounce from 'lodash.debounce';

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
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostItem(post);
    if (!liElement) return;

    ulElement.appendChild(liElement);
  });
}

function handlePrevClick() {
  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  if (page <= 1) return;

  handleFilterChange('_page', page - 1);
}
function handleNextClick() {
  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  const totalPages = Number.parseInt(ulPagination.dataset.totalPages);
  if (page >= totalPages) return;

  handleFilterChange('_page', page + 1);
}

function renderPagination(pagination) {
  const ulPagination = getUlPagination();

  if (!pagination || !ulPagination) return;

  // calc totalPages
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // check enable/disaple in prev link
  if (_page <= 1) ulPagination?.firstElementChild.classList.add('disabled');
  else ulPagination?.firstElementChild.classList.remove('disabled');

  // check enable/disaple in next link
  if (_page >= 5) ulPagination?.lastElementChild.classList.add('disabled');
  else ulPagination?.lastElementChild.classList.remove('disabled');
}

function initPagination() {
  const ulPagination = getUlPagination();
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

function initSearch() {
  const inputSearch = document.getElementById('inputSearch');
  if (!inputSearch) return;

  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('title_like')) {
    inputSearch.value = queryParams.get('title_like');
  }

  const debounceSearch = debounce((e) => handleFilterChange('title_like', e.target.value), 500);

  // set default value from query params
  inputSearch.addEventListener('input', debounceSearch);
}

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1);
    history.pushState({}, '', url);

    // fetch API
    // re-render postlist

    const { data, pagination } = await postApi.getALL(url.searchParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('failed to fetch postlist', error);
  }
}

(async () => {
  try {
    // attach click event for links
    initPagination();
    initSearch();

    // set default pagination {_page, _limit} on URL
    initURL();

    // render postlist based URL params
    const queryParams = new URLSearchParams(window.location.search);
    const { data, pagination } = await postApi.getALL(queryParams);

    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
