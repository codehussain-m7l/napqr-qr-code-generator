const qrImage = document.getElementById("qrImage");
const historyList = document.getElementById("historyList");
const qrContentPreview = document.getElementById("qrContentPreview");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const STORAGE_KEY = "qr_app_data";

let appData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  username: "",
  avatar: "",
  history: []
};

// save localStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

// load profile
document.getElementById("username").value = appData.username;
if (appData.avatar) avatar.src = appData.avatar;

// save username
username.oninput = () => {
  appData.username = username.value;
  saveData();
};

// avatar upload
avatar.onclick = () => avatarInput.click();
avatarInput.onchange = e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    avatar.src = reader.result;
    appData.avatar = reader.result;
    saveData();
  };
  reader.readAsDataURL(file);
};

// generate QR
function generateQR() {
  const text = qrText.value.trim();
  if (!text) return alert("Please enter text");

  const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
  qrImage.src = url;
  qrContentPreview.value = text;

  appData.history.unshift({ text, url });
  if (appData.history.length > 20) appData.history.pop();

  qrText.value = "";

  saveData();
  renderHistory();
}

//download QR
function downloadQR() {
  const a = document.createElement("a");
  a.href = qrImage.src;
  a.download = "qr-code.png";
  a.click();
}

// Render history
let selectedIndex = -1;

function renderHistory() {
  historyList.innerHTML = "";

  appData.history.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "history-item";
    if (index === selectedIndex) div.classList.add("selected");

    div.innerHTML = `<img src="${item.url}">`;

    div.onclick = () => {
      selectedIndex = index;
      qrImage.src = item.url;
      qrContentPreview.value = item.text;
      renderHistory();
    };

    historyList.appendChild(div);
  });
  clearHistoryBtn.disabled = appData.history.length === 0;

}

renderHistory();

clearHistoryBtn.onclick = () => {
  if (!confirm("Clear all QR history? This cannot be undone.")) return;

  appData.history = [];
  selectedIndex = -1;

  qrImage.src = "";
  qrContentPreview.value = "";

  saveData();
  renderHistory();
};
