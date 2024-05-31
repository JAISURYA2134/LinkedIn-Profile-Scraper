chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startScraping') {
    chrome.storage.local.get('profileUrls', (data) => {
      const urls = data.profileUrls;
      if (urls && urls.length > 0) {
        openProfilesSequentially(urls);
        sendResponse({ status: 'Scraping started' });
      } else {
        sendResponse({ status: 'No URLs found' });
      }
    });
    // Return true to indicate we will respond asynchronously
    return true;
  }
});

function openProfilesSequentially(urls) {
  if (urls.length === 0) return;
  const url = urls.shift();

  chrome.tabs.create({ url: url, active: false }, (tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeProfile,
      args: [url]
    }, () => {
      chrome.tabs.onRemoved.addListener(function onTabRemoved(tabId) {
        if (tabId === tab.id) {
          chrome.tabs.onRemoved.removeListener(onTabRemoved);
          openProfilesSequentially(urls);
        }
      });
      setTimeout(() => chrome.tabs.remove(tab.id), 5000); // Close tab after 5 seconds
    });
  });
}

function scrapeProfile(url) {
  const profile = {
    url,
    name: document.querySelector('.pv-text-details__left-panel h1')?.innerText || '',
    location: document.querySelector('.pv-text-details__left-panel .text-body-small')?.innerText || '',
    about: document.querySelector('.pv-about__summary-text')?.innerText || '',
    bio: document.querySelector('.text-body-medium')?.innerText || '',
    followerCount: parseInt(document.querySelector('.pv-recent-activity-section__follower-count')?.innerText.replace(/\D/g, ''), 10) || 0,
    connectionCount: parseInt(document.querySelector('.pv-top-card--list-bullet .inline-show-more-text')?.innerText.replace(/\D/g, ''), 10) || 0,
    bioLine: document.querySelector('.pv-top-card--list > li:nth-child(2)')?.innerText || ''
  };

  fetch('http://localhost:3000/profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profile)
  });
}
