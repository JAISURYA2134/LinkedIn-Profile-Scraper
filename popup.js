document.getElementById('startScraping').addEventListener('click', () => {
  const urls = document.getElementById('profileUrls').value.split('\n').filter(url => url.trim());
  chrome.storage.local.set({ profileUrls: urls }, () => {
    chrome.runtime.sendMessage({ action: 'startScraping' });
  });
});
