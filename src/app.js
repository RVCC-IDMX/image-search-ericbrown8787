const form = document.querySelector('.search-form');
const container = document.querySelector('.container');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const formData = new FormData(event.target);

  const response = await fetch('/.netlify/functions/unsplash-search', {
    method: 'POST',
    body: JSON.stringify({
      query: formData.get('query'),
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  response.results.forEach((item) => {
    const cardClone = document.querySelector('#template').content.firstElementChild.cloneNode(true);
    const postImg = cardClone.querySelector('.post__img');
    const postUser = cardClone.querySelector('.post__user');
    const postDescription = cardClone.querySelector('.post__desc');
    let formattedDescription = item.description;
    if (formattedDescription) {
      if (typeof formattedDescription === 'string' && formattedDescription.length > 100) {
        formattedDescription = `${formattedDescription.slice(0, 100)}...`;
      }
    } else {
      formattedDescription = '';
    }

    postImg.src = item.urls.small;
    postImg.alt = item.alt_description;

    if (item.user.first_name || item.user.last_name) {
      postUser.innerText = `by ${item.user.first_name || ''} ${item.user.last_name || ''}`;
    }

    postDescription.innerText = `${formattedDescription}`;

    container.appendChild(cardClone);
  });
  /*
    Loop through the results[] array. For each result, create a clone of the
    template and append it to the DOM element with the .container class.
  */

  /*
    Add an attribution statement below the image using the
    postUser element and the photographer's name from dataObj
   */

  /*
    Check the description of the post. If it's bot bull and less than 100 characters,
    add the description from dataObj to the post. If it's more than 100 characters,
    add the first 100 characters of the description from dataObj to the post followed by
    an ellipsis (...)
  */
});
