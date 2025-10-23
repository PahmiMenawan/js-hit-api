const slider = document.querySelector(".hero");
const list = document.querySelector("#container");
const modal = document.getElementById("myModal");
const closeBtn = document.querySelector(".close");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalContent = document.getElementById("modalContent");
let currentIndex = 0;
let photos = [];
let offset = 0;
let limit = 9;

async function fetchPhotos() {
  try {
    const response = await fetch(
      "https://api.slingacademy.com/v1/sample-data/photos?offset=5&limit=10"
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    photos = data.photos.map((photo) => photo.url);

    changeBackground();
    setInterval(changeBackground, 3000);
  } catch (error) {
    console.error("Error fetching photos:", error);
  }
}

function changeBackground() {
  if (photos.length === 0) return;
  slider.style.backgroundImage = `url(${photos[currentIndex]})`;
  currentIndex = (currentIndex + 1) % photos.length;
}

async function fetchPosts(offset, limit) {
  try {
    const response = await fetch(
      `https://api.slingacademy.com/v1/sample-data/blog-posts?offset=${offset}&limit=${limit}`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    list.innerHTML = "";

    data.blogs.forEach((post) => {
      const shortContent =
        post.content_text.length > 50
          ? post.content_text.substring(0, 50) + "..."
          : post.content_text;

      const html = `
        <div class="blog-card" data-id="${post.id}">
          <img src="${post.photo_url}" alt="${post.title}">
          <h3>${post.title}</h3>
          <p><strong>Category:</strong> ${post.category}</p>
          <p>${shortContent}</p>
        </div>
      `;
      list.insertAdjacentHTML("beforeend", html);
    });
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
    modalContent.textContent = post.content_text.substring(0, 1000);

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
  offset += limit;
  fetchPosts(offset, limit);
}

function previouspage() {
  if (offset >= limit) {
    offset -= limit;
    fetchPosts(offset, limit);
  }
}

function setLimit() {
  const input = document.getElementById("limit").value;
  const newLimit = parseInt(input);
  if (isNaN(newLimit) || newLimit < 1 || newLimit > 21) {
    alert("Please enter a number between 1 and 21");
    return;
  }
  limit = newLimit;
  offset = 0;
  fetchPosts(offset, limit);
}

fetchPosts(offset, limit);
fetchPhotos();