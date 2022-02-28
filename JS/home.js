import postApi from './api/postAPI';
import { initPagination, renderPostList, initSearch, renderPagination, toast } from './utils';

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location);

    if (filterName) url.searchParams.set(filterName, filterValue);

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

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      var confirmModal = new window.bootstrap.Modal(document.getElementById('confirm'));
      confirmModal.show();

      // const yesConfirm = document.querySelector('[data-id="confirmYes"]');
      // const noConfirm = document.querySelector('[data-id="confirmNo"]');
      const post = event.detail;
      const message = 'Are you sure you want to delete';
      if (window.confirm(message)) {
        await postApi.remove(post.id);
        await handleFilterChange();

        toast.success('Remove post successfully');
      }

      // yesConfirm.addEventListener('click', async () => {
      //   await postApi.remove(post.id);
      //   await handleFilterChange();

      //   confirmModal.hide();
      //   toast.success('Remove post successfully');
      // });

      // noConfirm.addEventListener('click', () => {
      //   confirmModal.hide();
      // });
    } catch (error) {
      console.log('failed to fetch post list', error);
      toast.error(error.message);
    }
  });
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

    registerPostDeleteEvent();

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

    // const { data, pagination } = await postApi.getALL(queryParams);

    // renderPostList('postList', data);
    // renderPagination('pagination', pagination);

    handleFilterChange();
  } catch (error) {
    console.log('get all failed', error);
  }
})();
