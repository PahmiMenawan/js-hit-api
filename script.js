const list = document.querySelector("#container");
const slider = document.querySelector(".hero");
let currentIndex = 0;
let photos = [];

function nextpage() {
  offset += limit;
  fetchPosts(offset, limit);
}

function previouspage() {
  offset -= limit;
  fetchPosts(offset, limit);
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

async function fetchPhotos() {
  try {
    const response = await fetch(
      "https://api.slingacademy.com/v1/sample-data/photos?offset=5&limit=10"
    );

    if (!response.ok) {
      throw new Error(`Error : ${response.status}`);
    }
    console.log("okay");

    const data = await response.json();
    photos = data.photos.map((photo) => photo.url);

    changeBackground();

    setInterval(changeBackground, 3000);
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

function changeBackground() {
  if (photos.length === 0) return;

  slider.style.backgroundImage = `url(${photos[currentIndex]})`;
  currentIndex = (currentIndex + 1) % photos.length;
}

let offset = 0;
let limit = 9;
async function fetchPosts(offset, limit) {
  try {
    const response = await fetch(
      `https://api.slingacademy.com/v1/sample-data/blog-posts?offset=${offset}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Error : ${response.status}`);
    }

    const data = await response.json();
    console.log("okay");
    list.innerHTML = "";
    data.blogs.forEach((post) => {
      const shortContent =
        post.content_text.length > 50
          ? post.content_text.substring(0, 50) + "..."
          : post.content_text;

      const html = `
        <div class="blog-card">
          <img src="${post.photo_url}" alt="${post.title}">
          <h3>${post.title}</h3>
          <p><strong>Category:</strong> ${post.category}</p>
          <p>${shortContent}</p>
        </div>
      `;

      list.insertAdjacentHTML("beforeend", html);
      const blogCards = document.querySelectorAll(".blog-card");
      blogCards.forEach((card) => {
        card.addEventListener("click", () => {
          modal.style.display = "flex";

        });
      });
    });
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

fetchPosts(offset, limit);
fetchPhotos();


// MODAL
const modal = document.getElementById("myModal");
const closeBtn = document.querySelector(".close");
closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
