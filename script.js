const CONFIG = {
  owner: "succesprosperite111-del",
  repo: "ibomansa-cartes",
  branch: "main",
  passwordHash: "6ad1616ef12b62b3d26aac195566297aaf94ceefa3cb279793768a8827873704",
  imageExtensions: [".jpg", ".jpeg", ".png", ".webp"]
};

const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");
const togglePassword = document.getElementById("togglePassword");
const logoutButton = document.getElementById("logoutButton");
const navItems = document.querySelectorAll(".nav-item");
const overviewPanel = document.getElementById("overviewPanel");
const cardsPanel = document.getElementById("cardsPanel");
const pageTitle = document.getElementById("pageTitle");
const allCardsContainer = document.getElementById("allCards");
const recentCardsContainer = document.getElementById("recentCards");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const statusMessage = document.getElementById("statusMessage");
const emptyState = document.getElementById("emptyState");
const totalCards = document.getElementById("totalCards");
const jpgCount = document.getElementById("jpgCount");
const otherCount = document.getElementById("otherCount");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

let cards = [];

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";
  if (await sha256(passwordInput.value) === CONFIG.passwordHash) {
    sessionStorage.setItem("ibomansa_admin", "yes");
    openDashboard();
  } else {
    loginError.textContent = "Mot de passe incorrect.";
  }
});

togglePassword.addEventListener("click", () => {
  const hidden = passwordInput.type === "password";
  passwordInput.type = hidden ? "text" : "password";
  togglePassword.textContent = hidden ? "Masquer" : "Afficher";
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem("ibomansa_admin");
  dashboardView.classList.add("hidden");
  loginView.classList.remove("hidden");
  passwordInput.value = "";
});

navItems.forEach(item => {
  item.addEventListener("click", () => {
    navItems.forEach(button => button.classList.remove("active"));
    item.classList.add("active");

    const view = item.dataset.view;
    overviewPanel.classList.toggle("hidden", view !== "overview");
    cardsPanel.classList.toggle("hidden", view !== "cards");
    pageTitle.textContent = view === "overview" ? "Tableau de bord" : "Toutes les cartes";
  });
});

async function openDashboard() {
  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  await loadCards();
}

async function loadCards() {
  statusMessage.textContent = "Chargement des cartes...";
  try {
    const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents?ref=${CONFIG.branch}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Impossible de lire le dépôt.");

    const files = await response.json();
    cards = files
      .filter(file => file.type === "file")
      .filter(file => CONFIG.imageExtensions.some(ext => file.name.toLowerCase().endsWith(ext)))
      .map(file => ({
        name: formatName(file.name),
        fileName: file.name,
        url: file.download_url,
        extension: "." + file.name.split(".").pop().toLowerCase()
      }))
      .sort((a,b) => a.name.localeCompare(b.name));

    statusMessage.textContent = "";
    updateStats();
    renderCards(cards, allCardsContainer);
    renderCards(cards.slice(0, 6), recentCardsContainer);
  } catch (error) {
    statusMessage.textContent = "Erreur de chargement. Vérifiez que le dépôt GitHub est public.";
  }
}

function updateStats() {
  totalCards.textContent = cards.length;
  jpgCount.textContent = cards.filter(card => [".jpg", ".jpeg"].includes(card.extension)).length;
  otherCount.textContent = cards.filter(card => ![".jpg", ".jpeg"].includes(card.extension)).length;
}

function formatName(fileName) {
  return fileName
    .replace(/\.(jpg|jpeg|png|webp)$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function renderCards(list, container) {
  container.innerHTML = "";
  if (container === allCardsContainer) {
    resultCount.textContent = `${list.length} résultat${list.length > 1 ? "s" : ""}`;
    emptyState.classList.toggle("hidden", list.length !== 0);
  }

  list.forEach(card => {
    const article = document.createElement("article");
    article.className = "member-card";
    article.innerHTML = `
      <img src="${card.url}" alt="${card.name}" loading="lazy">
      <div class="card-body">
        <h4>${card.name}</h4>
        <p>${card.fileName}</p>
        <div class="card-actions">
          <button type="button" class="view-button">Voir</button>
          <a href="${card.url}" download>Télécharger</a>
        </div>
      </div>
    `;

    article.querySelector("img").addEventListener("click", () => showModal(card.url));
    article.querySelector(".view-button").addEventListener("click", () => showModal(card.url));
    container.appendChild(article);
  });
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = cards.filter(card =>
    card.name.toLowerCase().includes(query) ||
    card.fileName.toLowerCase().includes(query)
  );
  renderCards(filtered, allCardsContainer);
});

function showModal(url) {
  modalImage.src = url;
  modal.classList.remove("hidden");
}

function hideModal() {
  modal.classList.add("hidden");
  modalImage.src = "";
}

closeModal.addEventListener("click", hideModal);
modal.addEventListener("click", event => {
  if (event.target === modal) hideModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") hideModal();
});

if (sessionStorage.getItem("ibomansa_admin") === "yes") {
  openDashboard();
}
