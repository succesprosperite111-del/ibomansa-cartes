const PASSWORD_HASH = "6ad1616ef12b62b3d26aac195566297aaf94ceefa3cb279793768a8827873704";

const members = [
  {
    prenoms: "ADAMA",
    nom: "DAO",
    numero: "CI002327968",
    matricule: "1156Z",
    village: "ZAÏBO",
    sousPrefecture: "ZOUKOUGBEU (DALOA)",
    image: "assets/carte-adama-dao.jpg"
  }
];

const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const loginForm = document.getElementById("login-form");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const togglePassword = document.getElementById("toggle-password");
const logoutButton = document.getElementById("logout-button");
const searchInput = document.getElementById("search-input");
const cardsGrid = document.getElementById("cards-grid");
const cardCount = document.getElementById("card-count");
const emptyState = document.getElementById("empty-state");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const closeModalButton = document.getElementById("close-modal");

async function sha256(value) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

function openApp() {
  sessionStorage.setItem("ibomansaAuthenticated", "yes");
  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  renderCards(members);
}

function logout() {
  sessionStorage.removeItem("ibomansaAuthenticated");
  appScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  passwordInput.value = "";
  searchInput.value = "";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";
  const enteredHash = await sha256(passwordInput.value);

  if (enteredHash === PASSWORD_HASH) {
    openApp();
  } else {
    loginError.textContent = "Mot de passe incorrect.";
  }
});

togglePassword.addEventListener("click", () => {
  const hidden = passwordInput.type === "password";
  passwordInput.type = hidden ? "text" : "password";
  togglePassword.textContent = hidden ? "Masquer" : "Afficher";
});

logoutButton.addEventListener("click", logout);

function renderCards(list) {
  cardsGrid.innerHTML = "";
  cardCount.textContent = `${list.length} carte${list.length > 1 ? "s" : ""}`;
  emptyState.classList.toggle("hidden", list.length !== 0);

  list.forEach(member => {
    const article = document.createElement("article");
    article.className = "member-card";
    article.innerHTML = `
      <img src="${member.image}" alt="Carte de ${member.prenoms} ${member.nom}" loading="lazy">
      <div class="card-meta">
        <h3>${member.prenoms} ${member.nom}</h3>
        <p><strong>N° :</strong> ${member.numero}</p>
        <p><strong>Matricule :</strong> ${member.matricule}</p>
        <p><strong>Village :</strong> ${member.village}</p>
        <div class="card-actions">
          <button class="secondary view-button">Voir en grand</button>
          <button class="secondary download-button">Télécharger</button>
        </div>
      </div>
    `;

    article.querySelector("img").addEventListener("click", () => showModal(member.image));
    article.querySelector(".view-button").addEventListener("click", () => showModal(member.image));
    article.querySelector(".download-button").addEventListener("click", () => downloadCard(member));
    cardsGrid.appendChild(article);
  });
}

function showModal(image) {
  modalImage.src = image;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  modalImage.src = "";
}

function downloadCard(member) {
  const link = document.createElement("a");
  link.href = member.image;
  link.download = `carte-${member.prenoms.toLowerCase()}-${member.nom.toLowerCase()}.jpg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = members.filter(member =>
    Object.values(member).some(value =>
      String(value).toLowerCase().includes(query)
    )
  );
  renderCards(filtered);
});

closeModalButton.addEventListener("click", closeModal);
modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

if (sessionStorage.getItem("ibomansaAuthenticated") === "yes") {
  openApp();
}
