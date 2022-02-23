import postApi from './api/postAPI';
import { initPostForm, toast } from './utils';

async function handlePostFormSubmit(formValues) {
  try {
    const savePost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);

    toast.success('Save post successfully');

    setTimeout(() => {}, 3000);

    window.location.assign(`/postDetail.html?id=${savePost.id}`);
  } catch (error) {
    console.log('failed to save post', error);
    toast.error(`Error: ${error.message}`);
  }
}

(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    const defaultValues = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    });
  } catch (error) {
    console.log('failed to fetch post details: ', error);
  }
})();
