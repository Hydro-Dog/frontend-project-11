import i18nextInstance from './i18n.js';
import {
  generateFeedItemLinkNode,
  generateFeedItemLiNode,
  generateFeedItemButtonNode,
  generateFeedSourceParNode,
  generateFeedSourceHeaderNode,
  generateFeedSourceLiNode,
} from './utils.js';

export const getDomNodesRefs = () => {
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

const setPostAsVisited = (id) => {
  const element = document.getElementById(id);
  element.classList.add('fw-normal');
  element.classList.remove('fw-bold');
};

const initModal = (posts) => {
  const modal = document.getElementById('modal');
  modal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const id = button.getAttribute('data-id');
    const post = posts[id];

    setPostAsVisited(id);

    const modalTitle = modal.querySelector('#modal-title');
    const modalBody = modal.querySelector('#modal-body');
    const readButtonLink = modal.querySelector('#read-full-post-link');

    modalTitle.textContent = post.title;
    modalBody.textContent = post.description;
    readButtonLink.href = post.link;
    readButtonLink.textContent = i18nextInstance.t('READ');
  });
};

export const render = (path, value) => {
  const {
    feedForm,
    feedInput,
    postsList,
    postsHeader,
    feedsList,
    feedsHeader,
    inputValidationErrorDiv,
    formSubmitButton,
  } = getDomNodesRefs();
  if (path === 'inputValue') {
    if (!value) {
      feedForm.reset();
    } else {
      feedInput.textContent = value;
    }
  }

  if (path === 'feedItems') {
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
    });
    postsHeader.hidden = false;
    initModal(value);
  }

  if (path === 'feedSources') {
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
  }

  if (path === 'inputMessage') {
    inputValidationErrorDiv.innerHTML = i18nextInstance.t(value);
  }

  if (path === 'inputState') {
    if (value === 'none') {
      feedInput.classList.remove('is-valid');
      feedInput.classList.remove('is-invalid');
      inputValidationErrorDiv.classList.remove('valid-feedback');
      inputValidationErrorDiv.classList.remove('invalid-feedback');
      inputValidationErrorDiv.innerHTML = '';
      feedInput.disabled = false;
      formSubmitButton.disabled = false;
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
    } else if (value === 'failed') {
      feedInput.classList.add('is-invalid');
      feedInput.classList.remove('is-valid');
      inputValidationErrorDiv.classList.add('invalid-feedback');
      inputValidationErrorDiv.classList.remove('valid-feedback');
      feedInput.disabled = false;
      formSubmitButton.disabled = false;
    }
  }
};
