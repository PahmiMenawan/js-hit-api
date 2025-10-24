import { BlogService } from "./services/BlogService.js";
import { PhotoService } from "./services/PhotoService.js";

const blogService = new BlogService(
  `https://api.slingacademy.com/v1/sample-data`
);
const photoService = new PhotoService(
  `https://api.slingacademy.com/v1/sample-data`
);

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

let offset = 0,
  limit = 9,
  page = 1;
let totalPages = 1;
let photos = [],
  currentIndex = 0;

async function init() {
  await loadPhotos();
  await loadPosts();
}

async function loadPhotos() {
  photos = await photoService.getPhotos(5, 10);
  changeBackground();
  setInterval(changeBackground, 5000);
}

function changeBackground() {
  if (photos.length === 0) return;
  slider.style.backgroundImage = `url(${photos[currentIndex].url})`;
  currentIndex = (currentIndex + 1) % photos.length;
}

async function loadPosts() {
  const { total, posts } = await blogService.getPosts(offset, limit);
  totalPages = Math.ceil(total / limit);
  pages.textContent = `Page ${page} of ${totalPages}`;
  list.innerHTML = posts
    .map(
      (p) => `
      <article class="blog-card" data-id="${p.id}">
        <img src="${p.photoUrl}" alt="${p.title}">
        <div class="card-content">
          <h3>${p.title}</h3>
          <p class="blog-category">${p.category.toUpperCase()}</p>
          <p>${p.shortContent}</p>
        </div>
      </article>`
    )
    .join("");
}

list.addEventListener("click", async (e) => {
  const card = e.target.closest(".blog-card");
  if (!card) return;
  const post = await blogService.getPostById(card.dataset.id);
  showModal(post);
});

function showModal(post) {
  modalTitle.textContent = post.title;
  modalImage.src = post.photoUrl;
  modalCategory.textContent = `Category: ${post.category}`;
  modalContent.innerHTML = post.contentHtml;
  modal.style.display = "flex";
}

// PAGINATIONS
function nextpage() {
  if (page < totalPages) {
    page++;
    offset = (page - 1) * limit;
    loadPosts();
  }
}

function previouspage() {
  if (page > 1) {
    page--;
    offset = (page - 1) * limit;
    loadPosts();
  }
}

const goToInput = document.getElementById("goToPage");

goToInput.addEventListener("change", handleGoToPage);
goToInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleGoToPage();
});

closeBtn.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

function handleGoToPage() {
  const pageInput = parseInt(goToInput.value);

  if (isNaN(pageInput) || pageInput < 1 || pageInput > totalPages) {
    warn.textContent = "Please enter a valid page number.";
    setTimeout(() => (warn.textContent = ""), 3000);
    return;
  }

  page = pageInput;
  offset = (page - 1) * limit;
  loadPosts();
  goToInput.value = "";
}

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
  loadPosts();
}

init();
window.nextpage = nextpage;
window.previouspage = previouspage;
window.setLimit = setLimit;
