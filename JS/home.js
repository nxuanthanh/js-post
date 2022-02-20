import postApi from './api/postAPI';
import { initPagination, renderPostList, initSearch, renderPagination } from './utils';

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
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('failed to fetch postlist', error);
  }
}

(async () => {
  try {
    // set default pagination {_page, _limit} on URL
    const url = new URL(window.location);

    // update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);

    // render postlist based URL params
    const queryParams = url.searchParams;

    // attach click event for links
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });
    initSearch({
      elementId: 'inputSearch',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    const { data, pagination } = await postApi.getALL(queryParams);

    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
