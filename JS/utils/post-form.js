import { setFieldValue, setBackgroundImage, setTextContent } from './common';
import * as yup from 'yup';
import { randomNumber } from '.';

export const IMAGE_SOURCE = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl);

  setBackgroundImage(document, '#postHeroImage', formValues.imageUrl);
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words of 3 characters',
        (value) => value.split(' ').filter((x) => x.length >= 3).length >= 2
      ),
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([IMAGE_SOURCE.PICSUM, IMAGE_SOURCE.UPLOAD], 'Invalid image source'),
    description: yup.string(),
    imageUrl: yup.string().when('imageSource', {
      is: IMAGE_SOURCE.PICSUM,
      then: yup.string().required('Please random background image').url('Please enter a valid url'),
    }),
    image: yup.mixed().when('imageSource', {
      is: IMAGE_SOURCE.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image to upload', (file) => Boolean(file?.name))
        .test('maxSize', 'The image is too large (MAX 2MB)', (file) => {
          const fileSize = file?.size || 0;
          const MAX_SIZE = 2 * 1024 * 1024;

          return fileSize <= MAX_SIZE;
        }),
    }),
  });
}

function setFieldError(form, name, error) {
  const field = form.querySelector(`[name="${name}"]`);

  if (field) {
    field.setCustomValidity(error);
    setTextContent(field.parentElement, '.invalid-feedback', error);
  }
}

async function validateFormField(form, formValues, name) {
  try {
    // clear previous error
    setFieldError(form, name, '');

    const schema = getPostSchema();
    await schema.validateAt(name, formValues);
  } catch (error) {
    setFieldError(form, name, error.message);
  }

  const field = form.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

async function validatePostForm(form, formValues) {
  try {
    ['author', 'title', 'imageUrl', 'image', 'imageSource'].forEach((name) =>
      setFieldError(form, name, '')
    );

    const schema = getPostSchema();
    await schema.validate(formValues, {
      abortEarly: false,
    });
  } catch (error) {
    console.log(error.name);
    // console.log(error.inner);

    const errorLog = {};

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationEror of error.inner) {
        const name = validationEror.path;
        // inogre if the field is already logged
        if (errorLog[name]) continue;

        // set field error and mark as logged
        setFieldError(form, name, validationEror.message);
        errorLog[name] = true;
      }
    }
  }

  let isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');

  return isValid;
}

function getFormValues(form) {
  const formValues = {};

  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

function showLoading(form) {
  const submitBtn = form.querySelector('[name="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Saveving...`;
  }
}

function hideLoading(form) {
  const submitBtn = form.querySelector('[name="submit"]');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fas fa-save mr-1"></i> Save`;
  }
}

function initRandomImage(form) {
  const changeImageBtn = document.getElementById('postChangeImage');
  if (!changeImageBtn) return;

  changeImageBtn.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;

    setFieldValue(form, '[name="imageUrl"]', imageUrl);
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}

function renderImageSourceControl(form, selector) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]');

  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selector.value;
  });
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]');

  radioList.forEach((radio) => {
    radio.addEventListener('change', (e) => renderImageSourceControl(form, e.target));
  });
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]');
  if (!uploadImage) return;

  uploadImage.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setBackgroundImage(document, '#postHeroImage', imageUrl);
    }

    validateFormField(form, { imageSource: IMAGE_SOURCE.UPLOAD, image: file }, 'image');
  });
}

function initValidationOnchange(form) {
  ['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);

    if (field) {
      field.addEventListener('input', (e) => {
        validateFormField(form, { [name]: e.target.value }, name);
      });
    }
  });
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  let submitting = false;

  setFormValues(form, defaultValues);
  initRandomImage(form);
  initRadioImageSource(form);
  initUploadImage(form);
  initValidationOnchange(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;

    if (submitting) return;

    showLoading(form);
    submitting = true;

    const isValid = await validatePostForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);

    hideLoading(form);
    submitting = false;
  });
}
