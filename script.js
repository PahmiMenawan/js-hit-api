const slider = document.querySelector(".hero");
const list = document.querySelector("#container");
const modal = document.getElementById("myModal");
const closeBtn = document.querySelector(".close");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalContent = document.getElementById("modalContent");
const pages = document.getElementById("pages");
const warn = document.getElementById("warn");
let currentIndex = 0;
let photos = [];
let offset = 0;
let limit = 9;
let page = 1;

async function fetchPhotos() {
  try {
    const response = await fetch(
      "https://api.slingacademy.com/v1/sample-data/photos?offset=5&limit=10"
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    photos = data.photos.map((photo) => photo.url);

    changeBackground();
    setInterval(changeBackground, 5000);
  } catch (error) {
    console.error("Error fetching photos:", error);
  }
}

function changeBackground() {
  if (photos.length === 0) return;
  slider.style.backgroundImage = `url(${photos[currentIndex]})`;
  currentIndex = (currentIndex + 1) % photos.length;
  console.log(currentIndex);
}

async function fetchPosts(offset, limit) {
  try {
    const response = await fetch(
      `https://api.slingacademy.com/v1/sample-data/blog-posts?offset=${offset}&limit=${limit}`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    let idAsString = data.total_blogs;
    let ofPage = parseInt(idAsString, 10);
    let page_exist = Math.ceil(ofPage / limit);
    pages.textContent = `Page ${page} of ${page_exist}`;
    list.innerHTML = "";
    data.blogs.forEach((post) => {
      let shortContent = post.content_text;
      if (shortContent.length > 50) {
        const trim = shortContent.substring(0, 50);
        const lastSpace = trim.lastIndexOf(" ");
        shortContent = trim.substring(0, lastSpace) + "...";
      }

      let category = post.category;
      const html = `
    <article class="blog-card"  data-id="${post.id}">
      <img src="${post.photo_url}" alt="${post.title}">
      <div class="card-content">
        <h3>${post.title}</h3>
        <p class="blog-category">${category.toUpperCase()}</p>
        <p>${shortContent}.</p>
      </div>
    </article>
      `;
      list.insertAdjacentHTML("beforeend", html);
    });
    const goToInput = document.getElementById("goToPage");

    goToInput.addEventListener("change", handleGoToPage);
    goToInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleGoToPage();
    });

    function handleGoToPage() {
      const pageInput = parseInt(goToInput.value);

      if (isNaN(pageInput) || pageInput < 1 || pageInput > page_exist) {
        warn.textContent = "Please enter a valid page number.";
        setTimeout(() => (warn.textContent = ""), 3000);
        return;
      }

      page = pageInput;
      offset = (page - 1) * limit;
      fetchPosts(offset, limit);
    }
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
}

async function fetchPostById(id) {
  try {
    const response = await fetch(
      `https://api.slingacademy.com/v1/sample-data/blog-posts/${id}`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    const post = data.blog;

    modalTitle.textContent = post.title;
    modalImage.src = post.photo_url;
    modalCategory.textContent = `Category: ${post.category}`;
    modalContent.innerHTML = post.content_html;

    modal.style.display = "flex";
  } catch (err) {
    console.error("Error fetching post detail:", err);
  }
}

list.addEventListener("click", (e) => {
  const card = e.target.closest(".blog-card");
  if (!card) return;
  const postId = card.dataset.id;
  fetchPostById(postId);
});

closeBtn.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

function nextpage() {
  page++;
  offset += limit;
  fetchPosts(offset, limit);
  document.getElementById("goToPage").value = "";
  document.getElementById("limit").value = "";
}

function previouspage() {
  if (offset >= limit) {
    page--;
    offset -= limit;
    fetchPosts(offset, limit);
    document.getElementById("goToPage").value = "";
    document.getElementById("limit").value = "";
  }
}

// document.getElementById("goToPage").addEventListener("change", () => {
//   const pageInput = parseInt(document.getElementById("goToPage").value);

//   if (isNaN(pageInput) || pageInput < 1 || pageInput > 1000) {
//     warn.textContent = "Please enter a valid page number.";
//     setTimeout(() => (document.getElementById("warn").textContent = ``), 3000);
//     return;
//   }
//   page = pageInput;
//   offset = (page - 1) * limit;
//   fetchPosts(offset, limit);
// });

function setLimit() {
  const input = document.getElementById("limit").value;
  const newLimit = parseInt(input);
  if (isNaN(newLimit) || newLimit < 1 || newLimit > 30) {
    warn.textContent = "Enter from 1 to 30";
    setTimeout(() => (document.getElementById("warn").textContent = ``), 3000);
    return;
  }
  document.getElementById("goToPage").value = "";
  document.getElementById("limit").value = "";
  limit = newLimit;
  offset = 0;
  fetchPosts(offset, limit);
}

fetchPosts(offset, limit);
fetchPhotos();
