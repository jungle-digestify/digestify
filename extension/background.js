function getCookieToken() {
  const cookie = chrome.cookies.get({
    url: "https://cpocs.io",
    name: "authjs.session-token",
  });
  // console.log("cookie = ", cookie);
  return cookie;
}

// const cookie = await getCookieToken();
// const token = cookie ? cookie.value : null;

// chrome.tabs.onUpdated.addListener((tabId, tab) => {

//   if (tab.url && tab.url.includes("youtube.com/watch")) {
//     const queryParameters = tab.url.split("?")[1];
//     const urlParameters = new URLSearchParams(queryParameters);
//     chrome.tabs.sendMessage(tabId, {
//       type: "NEW",
//       videoId: urlParameters.get("v"),
//     });
//   }
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // TODO : cookie 검사 -> 없으면 바로 리턴
  switch (request.action) {
    case "sendYoutubeUrl":
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        var url = activeTab.url;
        var title = activeTab.title;
        sendResponse({ url: url, title: title });
      });
      return true; // 비동기 응답을 위해 필요
      break;
    case "sendWebUrl":
      break;
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "extractTapInfo") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      var url = activeTab.url;
      var title = activeTab.title;
      sendResponse({ url: url, title: title });
    });
    return true; // 비동기 응답을 위해 필요합니다.
  }
});
