import { getActiveTabURL } from "./utils.js";

async function checkLoginStatus() {
  return new Promise((resolve, reject) => {
    chrome.cookies.get(
      { url: "http://localhost:3000", name: "authjs.session-token" },
      function (cookie) {
        if (cookie) {
          resolve(true); // 로그인된 상태
        } else {
          resolve(false); // 로그인되지 않은 상태
        }
      },
    );
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const toggle = document.getElementById("featureToggle");
  const toggleStatus = document.getElementById("toggleStatus");

  chrome.storage.sync.get(["featureEnabled"], function (result) {
    toggle.checked = result.featureEnabled || false;
    updateToggleText(toggle.checked);
  });

  toggle.addEventListener("change", function () {
    chrome.storage.sync.set({ featureEnabled: this.checked });
    updateToggleText(this.checked);
    let buttonStatus = this.checked;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleChanged",
        status: buttonStatus,
      });
    });
  });

  function updateToggleText(checked) {
    toggleStatus.textContent = checked ? "ON" : "OFF";
  }

  const activeTab = await getActiveTabURL();

  const isLoggedIn = await checkLoginStatus();

  if (!isLoggedIn) {
    alert("로그인하셔야 이용 가능합니다.");
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML =
      '<div class="title"><a href="#" id="loginLink">로그인 하러 가기</a></div>';

    document.getElementById("loginLink").addEventListener("click", function () {
      window.open("http://localhost:3000/login", "_blank");
    });

    return;
  }

  if (activeTab.url.includes("youtube.com")) {
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML =
      '<div class="title">유튜브 영상을 digestify 하세요!</div>';
  }
});
