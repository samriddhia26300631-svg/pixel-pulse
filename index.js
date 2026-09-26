// 1. Get references to your Part 1 HTML elements
const searchForm = document.getElementById('search-form'); // Assumes your form wrapper has this ID
const searchInput = document.getElementById('search-input'); // Your input box
const resultsContainer = document.getElementById('results-container'); // Your grid

// 2. Add the event listener to catch the search form submission
searchForm.addEventListener('submit', async (event) => {
  // Prevent the page from reloading
  event.preventDefault();

  // Read the query and trim extra spaces
  const query = searchInput.value.trim();

  // Task: Ignore empty searches
  if (!query) {
    return;
  }

  // Task: Clear old results before rendering a new search
  resultsContainer.innerHTML = "";

  // 3. Fetch the data using the Wikimedia Commons API
  // We use encodeURIComponent so multi-word searches like "new york" work correctly
  const url = `https://wikimedia.org{encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&origin=*`;

  try {
    const response = await fetch(url);

    // Task: Check response.ok before doing anything
    if (!response.ok) {
      console.error("Network response was not ok");
      return;
    }

    // Task: Parse the JSON
    const data = await response.json();

    // Verify if any pages/results were returned
    if (!data.query || !data.query.pages) {
      resultsContainer.innerHTML = `<p class="no-results">No results found for "${query}".</p>`;
      return;
    }

    // Convert the pages object into an array
    const pages = Object.values(data.query.pages);

    // --- ENHANCEMENT: Display a result count ---
    const countBadge = document.createElement('div');
    countBadge.className = 'result-count';
    countBadge.textContent = `Showing ${pages.length} results for "${query}"`;
    resultsContainer.appendChild(countBadge);

    // 4. Render the results
    pages.forEach(page => {
      // Ensure the image URL exists in the API payload
      if (page.imageinfo && page.imageinfo[0]) {
        const imageUrl = page.imageinfo[0].url;
        
        // Clean up the title text (remove "File:" prefix from Wikimedia)
        const displayTitle = page.title.replace(/^File:/, '');

        // --- ENHANCEMENT: Make each card a link that opens the full image in a new tab ---
        const cardLink = document.createElement('a');
        cardLink.href = imageUrl;
        cardLink.target = '_blank';
        cardLink.className = 'card-link';

        // Build the card container
        const card = document.createElement('div');
        card.className = 'card';

        // Create the image element
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = displayTitle;
        img.loading = 'lazy'; // Performance boost

        // Create the title element
        const title = document.createElement('h3');
        title.textContent = displayTitle;

        // Assemble the card pieces
        card.appendChild(img);
        card.appendChild(title);
        cardLink.appendChild(card);

        // Task: Add it to your results container with appendChild
        resultsContainer.appendChild(cardLink);
      }
    });

  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
git