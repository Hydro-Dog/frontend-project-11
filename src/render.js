import {
  generateFeedItemLinkNode,
  generateFeedItemLiNode,
  generateFeedItemButtonNode,
  generateFeedSourceParNode,
  generateFeedSourceHeaderNode,
  generateFeedSourceLiNode,
} from './utils.js';

export const getDomNodesRefs = () => {
  const modal = document.getElementById('modal');
  const feedForm = document.getElementById('rss-feed-form');
  const feedInput = document.getElementById('rss-feed-input');
  const exampleBlock = document.getElementById('example-block');
  const feedInputLabel = document.getElementById('input-label');
  const inputValidationErrorDiv = document.getElementById('validation-message');
  const formSubmitButton = document.getElementById('form-submit');
  const postsList = document.getElementById('posts-list');
  const feedsList = document.getElementById('feeds-list');
  const feedsHeader = document.getElementById('feeds-header');
  const postsHeader = document.getElementById('posts-header');
  const closeModalButton = document.getElementById('close-modal');
  const readFullPostButton = document.getElementById('read-full-post');
  const feedFormData = new FormData(feedForm);

  return {
    modal,
    feedForm,
    feedInput,
    exampleBlock,
    feedInputLabel,
    inputValidationErrorDiv,
    formSubmitButton,
    postsList,
    feedsList,
    feedsHeader,
    postsHeader,
    closeModalButton,
    readFullPostButton,
    feedFormData,
  };
};

export const render = (domElements, i18nextInstance) => (path, value) => {
  const {
    modal,
    feedForm,
    feedInput,
    postsList,
    postsHeader,
    feedsList,
    feedsHeader,
    inputValidationErrorDiv,
    formSubmitButton,
    feedInputLabel,
    exampleBlock,
    closeModalButton,
  } = domElements;

  feedInputLabel.innerHTML = i18nextInstance.t('INPUT_LABEL');
  formSubmitButton.innerHTML = i18nextInstance.t('SUBMIT');
  exampleBlock.innerHTML = `${i18nextInstance.t('EXAMPLE')}https://ru.hexlet.io/lessons.rss`;
  feedsHeader.innerHTML = i18nextInstance.t('FEEDS');
  postsHeader.innerHTML = i18nextInstance.t('POSTS');
  closeModalButton.innerHTML = i18nextInstance.t('CLOSE');

  switch (path) {
    case 'modalData': {
      const modalTitle = modal.querySelector('#modal-title');
      const modalBody = modal.querySelector('#modal-body');
      const readButtonLink = modal.querySelector('#read-full-post-link');

      modalTitle.textContent = value.title;
      modalBody.textContent = value.description;
      readButtonLink.href = value.link;
      readButtonLink.textContent = i18nextInstance.t('READ');
      break;
    }

    case 'feedItems':
      postsList.innerHTML = '';
      Object.values(value).forEach((item) => {
        const linkNode = generateFeedItemLinkNode();
        const liNode = generateFeedItemLiNode();
        const buttonNode = generateFeedItemButtonNode();
        linkNode.href = item.link;
        linkNode.id = item.id;
        linkNode.textContent = item.title;
        buttonNode.dataset.id = item.id;
        buttonNode.textContent = i18nextInstance.t('OPEN');
        liNode.append(linkNode);
        liNode.append(buttonNode);
        postsList.append(liNode);

        if (item.isRead) {
          const element = document.getElementById(item.id);
          element.classList.add('fw-normal');
          element.classList.remove('fw-bold');
        }
      });
      postsHeader.hidden = false;
      break;

    case 'feedSources':
      feedsList.innerHTML = '';
      Object.values(value).forEach((item) => {
        const liNode = generateFeedSourceLiNode();
        const hNode = generateFeedSourceHeaderNode();
        hNode.textContent = item.title;
        const pNode = generateFeedSourceParNode();
        pNode.textContent = item.description;
        liNode.append(hNode);
        liNode.append(pNode);
        feedsList.append(liNode);
      });

      feedsHeader.hidden = false;
      break;

    case 'inputMessage':
      inputValidationErrorDiv.innerHTML = i18nextInstance.t(value);
      break;

    case 'feedUrlUploadState':
      if (value === 'none') {
        feedInput.classList.remove('is-valid');
        feedInput.classList.remove('is-invalid');
        inputValidationErrorDiv.classList.remove('valid-feedback');
        inputValidationErrorDiv.classList.remove('invalid-feedback');
        inputValidationErrorDiv.innerHTML = '';
        feedInput.disabled = false;
        formSubmitButton.disabled = false;
        feedForm.reset();
      } else if (value === 'sending') {
        feedInput.disabled = true;
        formSubmitButton.disabled = true;
      } else if (value === 'finished') {
        feedInput.classList.add('is-valid');
        feedInput.classList.remove('is-invalid');
        inputValidationErrorDiv.classList.add('valid-feedback');
        inputValidationErrorDiv.classList.remove('invalid-feedback');
        feedInput.disabled = false;
        formSubmitButton.disabled = false;
        feedForm.reset();
      } else if (value === 'failed') {
        feedInput.classList.add('is-invalid');
        feedInput.classList.remove('is-valid');
        inputValidationErrorDiv.classList.add('invalid-feedback');
        inputValidationErrorDiv.classList.remove('valid-feedback');
        feedInput.disabled = false;
        formSubmitButton.disabled = false;
      }
      break;

    default:
      break;
  }
};
