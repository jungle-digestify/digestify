const newVideoLoaded = async (checked) => {
  let youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];

  const BUTTON_ID = "digestBookmarkButton";

  let existingButton = document.getElementById(BUTTON_ID);

  if (checked) {
      if (!existingButton) {
          const digestButton = document.createElement("img");
          digestButton.src = chrome.runtime.getURL("/assets/d-icon.png");
          digestButton.className = "ytp-button " + "bookmark-btn";
          digestButton.title = "Click to bookmark current timestamp";
          digestButton.id = BUTTON_ID; 
          digestButton.addEventListener("click", addVideoEventHandler);
          
          if(youtubeLeftControls) {
            youtubeLeftControls.appendChild(digestButton);
          }
      }
  } else {
    if (existingButton && youtubeLeftControls.contains(existingButton)) {
      youtubeLeftControls.removeChild(existingButton);
    }
  }
};


const addVideoEventHandler = async () => {

  const currentUrl = window.location.href;
  console.log('Current URL:', currentUrl); // 이놈 수정
  const get_v = currentUrl.split('?v=')
  const get_v_id = get_v[1]

  console.log('??????????????????? get_v_id = ', get_v_id);
  //window.open('http://localhost:3000/playground-ai?v='+get_v_id, 'CodeGPT'); 
  
  
  // TODO: videoUrl 부터 보내 보고 잘 되면 유저에 대한 정보나 쿠키를 보내서 유효성을 확인하는 식으로 확장 하기
  sendYoutubeUrl('http://localhost:3000/api/extension',{ videoUrl: get_v_id })
};

let hideTimeout;
function onMouseOverHandler() {
  clearTimeout(hideTimeout);
  showExtensionIcon(this); // 'this'는 이벤트가 발생한 엘리먼트를 가리킵니다.
}

function onMouseOutHandler() {
  hideTimeout = setTimeout(() => hideExtensionIcon(), 5000);
}

const applyEventListeners = (element) => {
  element.addEventListener('mouseover', onMouseOverHandler);
  element.addEventListener('mouseout', onMouseOutHandler);
};

const removeEventListeners = (element) => {
  element.removeEventListener('mouseover', onMouseOverHandler);
  element.removeEventListener('mouseout', onMouseOutHandler);
};

const initializeExtensionIconOnHover = (checked) => {
    console.log("initialExHover:",checked)
    const targetElements = document.querySelectorAll('#contents > ytd-rich-item-renderer');
    if (checked) {
        targetElements.forEach(element => applyEventListeners(element));
    } else {
        targetElements.forEach(element => removeEventListeners(element));
    }

    const targetContainer = document.querySelector('#contents');
    if (!targetContainer) return;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const newTargetElements = node.querySelectorAll('ytd-rich-item-renderer');
                    if(checked) newTargetElements.forEach(newElement => applyEventListeners(newElement));
                    else newTargetElements.forEach(newElement => removeEventListeners(newElement));
                }
            });
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(targetContainer, config);
};

const showExtensionIcon = (element) => {
    let extensionIcon = document.getElementById('extension-icon');
    if (!extensionIcon) {
        extensionIcon = document.createElement('img');
        extensionIcon.id = 'extension-icon';
        extensionIcon.src = chrome.runtime.getURL('/assets/d-icon.png'); // 확장 아이콘 경로
        extensionIcon.style.position = 'absolute';
        extensionIcon.style.zIndex = '1000';
        extensionIcon.style.cursor = 'pointer';
        extensionIcon.style.width = '20px'; // 아이콘 크기 조정
        extensionIcon.style.height = '20px'; // 아이콘 크기 조정
        document.body.appendChild(extensionIcon);
    }

    // 이전에 추가된 이벤트 리스너를 제거
    extensionIcon.removeEventListener('click', extensionIcon.clickEventListener);

    // 새로운 이벤트 리스너를 추가  
    extensionIcon.clickEventListener = () => {
        const videoUrl = element.querySelector('a#thumbnail').href;
        // 콘솔이 아니라 fetch로 백으로 보내야함
        const get_v = videoUrl.split('?v=')

        const get_v_id = get_v[1]
        console.log(get_v_id); // 이놈 수정
        //window.open('http://localhost:3000/playground-ai?v='+get_v_id, 'CodeGPT');  
        // 
        // TODO: videoUrl 부터 보내 보고 잘 되면 유저에 대한 정보나 쿠키를 보내서 유효성을 확인하는 식으로 확장 하기
        sendYoutubeUrl('http://localhost:3000/api/extension',{ videoUrl: get_v_id })
    };
    extensionIcon.addEventListener('click', extensionIcon.clickEventListener);

    const rect = element.getBoundingClientRect();
    extensionIcon.style.top = `${rect.top + window.scrollY - 25}px`;
    extensionIcon.style.left = `${rect.right + window.scrollX - 25}px`; // 아이콘 위치 조정
    extensionIcon.style.display = 'block';

    
}

const hideExtensionIcon = () => {
    const extensionIcon = document.getElementById('extension-icon');
    if (extensionIcon) {
        extensionIcon.style.display = 'none';
    }
}

chrome.storage.sync.get(['featureEnabled'], function(result) {
  let checked = result.featureEnabled;
  if (checked){
    initializeExtensionIconOnHover(checked)
    newVideoLoaded(checked)
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggleChanged") {
    initializeExtensionIconOnHover(request.status)
    newVideoLoaded(request.status)
  }
});

function sendYoutubeUrl(url,data) {
  return postData(url, data)
}



async function extractContents() {
  
  const currentUrl = window.location.href;
  console.log("clicked!");
  let sendData = contentSelect();
  let data = {
    url: currentUrl,
    contents: sendData
  }

  console.log("current Url : ", currentUrl)
  console.log(data)
  postData('http://localhost:3000/api/extension',data)

  return
}

async function postData(url = '', data = {}) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };

  const response = await fetch(url, requestOptions);

  console.log(response)
  return response; // 'opaque' 응답은 내용을 읽을 수 없습니다.
}

function getAllText(element) {
  // 특정 태그 또는 클래스를 가진 요소는 건너뛸 것입니다.
  const skipTags = ['SCRIPT', 'STYLE', 'CODE'];
  const skipClasses = ['office_preference']; // 건너뛸 클래스를 여기에 추가

  let text = "";
  for (const child of element.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE && (skipTags.includes(child.tagName) || skipClasses.some(cls => child.classList.contains(cls)))) {
      continue; // 정의된 태그 또는 클래스에 해당되면 건너뜁니다.
    }

    if (child.nodeType === Node.TEXT_NODE) {
      const trimmedText = child.textContent.trim();
      if (trimmedText.length >= 10) { // 10글자 이상인 텍스트만 추가
        text += trimmedText + "\n";
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      text += getAllText(child); // 재귀적으로 처리
    }
  }
  return text;
}


function contentSelect() {
  // const elements = window.document.querySelectorAll("h1, h2");

  // let combinedText = [];
  // for (let element of elements) {
  //   combinedText.push(element.innerText);
  // }
  const allText = getAllText(document.body); // body 요소부터 시작하여 모든 텍스트 추출

  console.log("보낼 컨텐츠: ",allText)
  return allText; 
}

function createButton() {
  const button = document.createElement("digest");
  button.id = "digestButton";
  button.style =
     'position: fixed; width:100px; height:100px; top: 40px; right: 10px; z-index: 1000; background-image: url("' +
    chrome.runtime.getURL("assets/d-icon.png") +
    '"); background-size: contain; background-color: transparent;';
  button.style.transition = "transform 0.5s ease";
  document.body.appendChild(button);
  
  button.addEventListener("click",extractContents);
}



if (!window.location.href.includes('www.youtube.com')) {
  createButton();
}