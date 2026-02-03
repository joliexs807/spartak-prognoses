// ====== Личный кабинет ======
const usernameInput = document.getElementById("username");
const saveNameBtn = document.getElementById("saveName");
const userPanel = document.getElementById("userPanel");
const welcome = document.getElementById("welcome");
const nameForm = document.getElementById("nameForm");

let username = localStorage.getItem("username");

function showWelcome() {
  if(username) {
    nameForm.style.display = "none";
    welcome.textContent = "Привет, " + username + "!";
  } else {
    nameForm.style.display = "block";
  }
}

saveNameBtn.onclick = () => {
  const val = usernameInput.value.trim();
  if(val) {
    username = val;
    localStorage.setItem("username", username);
    showWelcome();
    renderLeaderboard();
  }
}

showWelcome();

// ====== Матчи ======
const matchesData = [
  {id:1, team1:"Спартак", team2:"ЦСКА"},
  {id:2, team1:"Зенит", team2:"Локомотив"},
  {id:3, team1:"Динамо", team2:"Краснодар"}
];

function renderMatches() {
  const container = document.getElementById("matches");
  container.innerHTML = "";
  matchesData.forEach(match=>{
    const div = document.createElement("div");
    div.className = "match";
    div.innerHTML = `<strong>${match.team1} - ${match.team2}</strong>`;
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttons";

    ["П1","Ничья","П2"].forEach(choice=>{
      const btn = document.createElement("button");
      btn.textContent = choice;
      if(localStorage.getItem("match_"+match.id)) btn.disabled = true;
      if(choice==="П1") btn.className="win1";
      if(choice==="Ничья") btn.className="draw";
      if(choice==="П2") btn.className="win2";

      btn.onclick = ()=>{
        localStorage.setItem("match_"+match.id, choice);
        btn.disabled=true;
        Array.from(buttonsDiv.children).forEach(b=>b.disabled=true);
        updateLeaderboard(username);
      }
      buttonsDiv.appendChild(btn);
    });

    div.appendChild(buttonsDiv);
    container.appendChild(div);
  });
}

renderMatches();

// ====== Таблица лидеров ======
function getLeaderboard() {
  const data = JSON.parse(localStorage.getItem("leaderboard")||"{}");
  return data;
}

function updateLeaderboard(name) {
  const data = getLeaderboard();
  if(!data[name]) data[name]=0;
  data[name]+=1;
  localStorage.setItem("leaderboard", JSON.stringify(data));
  renderLeaderboard();
}

function renderLeaderboard() {
  const table = document.getElementById("leaderboard");
  table.innerHTML = "<tr><th>Имя</th><th>Очки</th></tr>";
  const data = getLeaderboard();
  Object.keys(data).sort((a,b)=>data[b]-data[a]).forEach(name=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${name}</td><td>${data[name]}</td>`;
    table.appendChild(tr);
  });
}

renderLeaderboard();

// ====== Админка ======
const modal = document.getElementById("adminModal");
document.getElementById("openAdmin").onclick = ()=>modal.style.display="flex";
modal.onclick = e=>{if(e.target===modal) modal.style.display="none";};

document.getElementById("loginAdmin").onclick = ()=>{
  const pass = document.getElementById("adminPass").value;
  if(pass==="admin123") {
    localStorage.setItem("isAdmin","true");
    window.location.href="admin.html";
  } else alert("Неверный пароль");
};
