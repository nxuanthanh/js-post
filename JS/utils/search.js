import debounce from 'lodash.debounce';

export function initSearch({ elementId, defaultParams, onChange }) {
  const inputSearch = document.getElementById(elementId);
  if (!inputSearch) return;

  if (defaultParams && defaultParams.get('title_like')) {
    inputSearch.value = defaultParams.get('title_like');
  }

  const debounceSearch = debounce((e) => onChange?.(e.target.value), 500);

  // set default value from query params
  inputSearch.addEventListener('input', debounceSearch);
}
