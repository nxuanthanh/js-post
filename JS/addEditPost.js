import postApi from './api/postAPI';
import { IMAGE_SOURCE, initPostForm, toast } from './utils';

function removeUnusedField(formValues) {
  const payload = { ...formValues };

  if (payload.imageSource === IMAGE_SOURCE.PICSUM) {
    delete payload.image;
  } else {
    delete payload.imageUrl;
  }

  delete payload.imageSource;

  if (!payload.id) delete payload.id;

  return payload;
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handlePostFormSubmit(formValues) {
  try {
    const payload = removeUnusedField(formValues);
    const formData = jsonToFormData(payload);

    const savePost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    toast.success('Save post successfully');

    setTimeout(() => {
      window.location.assign(`/postDetail.html?id=${savePost.id}`);
    }, 2000);
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
