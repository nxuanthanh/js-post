import { setFieldValue, setBackgroundImage, setTextContent } from './common';
import * as yup from 'yup';

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl);

  setBackgroundImage(document, '#postHeroImage', formValues.imageUrl);
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('please enter title'),
    author: yup
      .string()
      .required('please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words of 3 characters',
        (value) => value.split(' ').filter((x) => x.length >= 3).length >= 2
      ),
    description: yup.string(),
  });
}

function setFieldError(form, name, error) {
  const field = form.querySelector(`[name="${name}"]`);

  if (field) {
    field.setCustomValidity(error);
    setTextContent(field.parentElement, '.invalid-feedback', error);
  }
}

async function validatePostForm(form, formValues) {
  try {
    ['author', 'title'].forEach((name) => setFieldError(form, name, ''));

    const schema = getPostSchema();
    await schema.validate(formValues, {
      abortEarly: false,
    });
  } catch (error) {
    console.log(error.name);
    console.log(error.inner);

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

  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`);
  //   formValues[name] = field.value;
  // });

  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValues(form, defaultValues);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;

    const isValid = await validatePostForm(form, formValues);
    if (!isValid) return;

    onSubmit?.(formValues);
  });
}
