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

  /*
  Loop through the results[] array. For each result, create a clone of the
  template and append it to the DOM element with the .container class.
  */
  if (response.results) {
    response.results.forEach((item) => {
      const cardClone = document.querySelector('#template').content.firstElementChild.cloneNode(true);
      const postImg = cardClone.querySelector('.post__img');
      const postUser = cardClone.querySelector('.post__user');
      const postDescription = cardClone.querySelector('.post__desc');

      /*
      Add an attribution statement below the image using the
      postUser element and the photographer's name from dataObj
      */
      if (item.user.first_name || item.user.last_name) {
        postUser.textContent = `by ${item.user.first_name || ''} ${item.user.last_name || ''}`;
      }

      /*
      Check the description of the post. If it's bot bull and less than 100 characters,
      add the description from dataObj to the post. If it's more than 100 characters,
      add the first 100 characters of the description from dataObj to the post followed by
      an ellipsis (...)
      */
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

      postDescription.textContent = `${formattedDescription}`;

      container.appendChild(cardClone);
    });
  } else {
    container.textContent = 'Oops! We were unable to retrieve your results. :(';
  }
});
