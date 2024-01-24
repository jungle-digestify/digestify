(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;
        
        if (type === "NEW") {
          currentVideo = videoId;
          newVideoLoaded();
        } else if (type === "PLAY") {
          youtubePlayer.currentTime = value;
        } else if ( type === "DELETE") {
          currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
          chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });
    
          response(currentVideoBookmarks);
        }
      });
    
      const fetchBookmarks = () => {
        return new Promise((resolve) => {
          chrome.storage.sync.get([currentVideo], (obj) => {
            resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
          });
        });
      };

    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
    
        currentVideoBookmarks = await fetchBookmarks();
    
        if (!bookmarkBtnExists) {
          const bookmarkBtn = document.createElement("img");
    
          bookmarkBtn.src = chrome.runtime.getURL("/assets/d-icon.png");
          bookmarkBtn.className = "ytp-button " + "bookmark-btn";
          bookmarkBtn.title = "Click to bookmark current timestamp";
    
          youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
          youtubePlayer = document.getElementsByClassName('video-stream')[0];
    
          youtubeLeftControls.appendChild(bookmarkBtn);
          bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
      };

      const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime;
        console.log(currentTime)
        const newBookmark = {
          time: currentTime,
          desc: "Bookmark at " + getTime(currentTime),
        };
        
        const currentUrl = window.location.href;
        console.log('Current URL:', currentUrl); // 이놈 수정
        const get_v = currentUrl.split('?v=')
        const get_v_id = get_v[1]
        // console.log('get_v_id = ', get_v_id);
        
        
        currentVideoBookmarks = await fetchBookmarks();

        // console.log(currentVideoBookmarks)
        chrome.storage.sync.set({
          [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
        console.log('??????????????????? get_v_id = ', get_v_id);
        window.open('http://localhost:3000/playground-ai?v='+get_v_id, 'CodeGPT'); 
      };

    let hideTimeout;
    const applyEventListeners = (element) => {
        element.addEventListener('mouseover', () => {
            clearTimeout(hideTimeout);
            showExtensionIcon(element);
        });
        element.addEventListener('mouseout', () => {
            hideTimeout = setTimeout(() => hideExtensionIcon(), 5000);
        });
    };

    const initializeExtensionIconOnHover = () => {
        const targetElements = document.querySelectorAll('#contents > ytd-rich-item-renderer');
        targetElements.forEach(element => applyEventListeners(element));

        const targetContainer = document.querySelector('#contents');
        if (!targetContainer) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const newTargetElements = node.querySelectorAll('ytd-rich-item-renderer');
                        newTargetElements.forEach(newElement => applyEventListeners(newElement));
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
            console.log('Video URL!:', videoUrl); // 이놈 수정
            const get_v = videoUrl.split('?v=')


            console.log(get_v)
            const get_v_id = get_v[1]
            console.log(get_v_id); // 이놈 수정
            window.open('http://localhost:3000/playground-ai?v='+get_v_id, 'CodeGPT');  
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

    initializeExtensionIconOnHover();
    newVideoLoaded();
})();

const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);
    return date.toISOString().slice(11, 19);
};