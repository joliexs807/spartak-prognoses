document.addEventListener("DOMContentLoaded", () => {

/* ================== ПЕРЕМЕННЫЕ ================== */

const loginScreen = document.querySelector(".login-screen");
const appScreen = document.querySelector(".app");
const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username");

const userNameDisplay = document.getElementById("user-name");
const userScoreDisplay = document.getElementById("user-score");
const winsDisplay = document.getElementById("wins");
const drawsDisplay = document.getElementById("draws");
const lossesDisplay = document.getElementById("losses");

const logoutBtn = document.getElementById("logout-btn");
const themeBtn = document.getElementById("theme-btn");

const avatarDisplay = document.getElementById("avatar-display");
const avatars = document.querySelectorAll(".avatar");

/* ====== АДМИН ====== */
const ADMIN_PASSWORD = "spartak1922";
const adminOpen = document.getElementById("admin-open");
const adminLogin = document.getElementById("admin-login");
const adminPanel = document.getElementById("admin-panel");
const adminPassInput = document.getElementById("admin-password");
const adminLoginBtn = document.getElementById("admin-login-btn");
const adminExit = document.getElementById("admin-exit");
const resetUserBtn = document.getElementById("reset-user");

/* ================== ДАННЫЕ ================== */

let username = "";
let avatar = "🦁";

let userData = {
  score: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  history: {}
};

/* ================== АВАТАР ================== */

avatars.forEach(a => {
  a.onclick = () => {
    avatar = a.dataset.emoji;
    avatarDisplay.textContent = avatar;
  };
});

/* ================== АВТОВХОД ================== */

const savedUser = localStorage.getItem("currentUser");

if (savedUser) {
  username = savedUser;
  const savedData = localStorage.getItem("user_" + username);
  if (savedData) userData = JSON.parse(savedData);

  avatar = localStorage.getItem("avatar_" + username) || "🦁";
  showApp();
} else {
  loginScreen.style.display = "flex";
}

/* ================== ЛОГИН ================== */

loginBtn.onclick = () => {
  const name = usernameInput.value.trim();
  if (!name) return alert("Введите имя");

  username = name;
  localStorage.setItem("currentUser", username);

  const savedData = localStorage.getItem("user_" + username);
  if (savedData) {
    userData = JSON.parse(savedData);
  } else {
    userData = { score: 0, wins: 0, draws: 0, losses: 0, history: {} };
    localStorage.setItem("user_" + username, JSON.stringify(userData));
  }

  localStorage.setItem("avatar_" + username, avatar);

  loginScreen.classList.add("hidden");
  setTimeout(showApp, 600);
};

/* ================== ВЫХОД ================== */

logoutBtn.onclick = () => {
  localStorage.removeItem("currentUser");
  location.reload();
};

/* ================== ТЕМА ================== */

themeBtn.onclick = () => {
  document.body.classList.toggle("light-theme");
};

/* ================== ПОКАЗ ПРИЛОЖЕНИЯ ================== */

function showApp() {
  loginScreen.style.display = "none";
  appScreen.classList.add("visible");

  userNameDisplay.textContent = username;
  userScoreDisplay.textContent = userData.score;
  winsDisplay.textContent = userData.wins;
  drawsDisplay.textContent = userData.draws;
  lossesDisplay.textContent = userData.losses;
  avatarDisplay.textContent = avatar;

  initMatches();
}

/* ================== МАТЧИ ================== */

function initMatches() {
  document.querySelectorAll(".match").forEach(match => {

    const matchName = match.dataset.match;
    const scoreBox = match.querySelector(".score strong");
    const historyList = match.querySelector(".history-list");
    const buttons = match.querySelectorAll(".main-btn");

    if (!userData.history[matchName]) {
      userData.history[matchName] = null;
    }

    historyList.innerHTML = "";

    if (userData.history[matchName]) {
      const li = document.createElement("li");
      li.textContent = userData.history[matchName].text;
      historyList.appendChild(li);

      buttons.forEach(b => {
        b.disabled = true;
        b.classList.add("locked");
        if (b.textContent === userData.history[matchName].choice) {
          b.classList.add("selected");
        }
      });
    }

    buttons.forEach(btn => {
      btn.onclick = () => {

        if (userData.history[matchName]) return;

        buttons.forEach(b => {
          b.disabled = true;
          b.classList.add("locked");
        });

        btn.classList.add("selected");

        let points = 0;

        if (btn.textContent.includes("Победа")) {
          points = 3;
          userData.wins++;
        } else if (btn.textContent.includes("Ничья")) {
          points = 1;
          userData.draws++;
        } else {
          userData.losses++;
        }

        userData.score += points;

        const record = {
          choice: btn.textContent,
          text: `${btn.textContent} — +${points} очк.`,
          time: Date.now()
        };

        userData.history[matchName] = record;

        const li = document.createElement("li");
        li.textContent = record.text;
        historyList.appendChild(li);

        scoreBox.textContent = userData.score;
        userScoreDisplay.textContent = userData.score;
        winsDisplay.textContent = userData.wins;
        drawsDisplay.textContent = userData.draws;
        lossesDisplay.textContent = userData.losses;

        localStorage.setItem("user_" + username, JSON.stringify(userData));
      };
    });

  });
}

/* ================== АДМИНКА ================== */

adminOpen.onclick = () => adminLogin.classList.remove("hidden");

adminLoginBtn.onclick = () => {
  if (adminPassInput.value === ADMIN_PASSWORD) {
    localStorage.setItem("isAdmin", "true");
    adminLogin.classList.add("hidden");
    adminPanel.classList.remove("hidden");
  } else {
    alert("Неверный пароль");
  }
};

if (localStorage.getItem("isAdmin") === "true") {
  adminPanel.classList.remove("hidden");
}

adminExit.onclick = () => {
  localStorage.removeItem("isAdmin");
  adminPanel.classList.add("hidden");
};

/* ================== СБРОС АККАУНТА ================== */

if (resetUserBtn) {
  resetUserBtn.onclick = () => {
    if (!confirm("Сбросить аккаунт полностью?")) return;

    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return alert("Нет активного пользователя");

    localStorage.removeItem("user_" + currentUser);
    alert("Аккаунт сброшен");
    location.reload();
  };
}

});
const adminBtn = document.getElementById("adminBtn");
const adminModal = document.getElementById("adminModal");
const adminLogin = document.getElementById("adminLogin");
const adminClose = document.getElementById("adminClose");

adminBtn.onclick = () => {
  adminModal.classList.remove("hidden");
};

adminClose.onclick = () => {
  adminModal.classList.add("hidden");
};

adminLogin.onclick = () => {
  const pass = document.getElementById("adminPassword").value;
  if (pass === "spartak1922") {
    localStorage.setItem("isAdmin", "true");
    window.location.href = "admin.html";
  } else {
    alert("Неверный пароль");
  }
};