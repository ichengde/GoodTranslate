;(function(){
  function handle(command) {
    var toLanguage = 'en';
    if (command === 'translate-zh') {
      toLanguage = 'zh-CN';
    }

    if (command === 'translate-en') {
      toLanguage = 'en';
    }

    if (command === 'delete') {
      toLanguage = 'delete';
    }

    if (command === 'open') {
      toLanguage = 'open';
    }

    chrome.storage.sync.set({
      toLanguage: toLanguage,
    }, function() {
      chrome.tabs.executeScript(null,{
        file: "translate.js"
      });
    });
  }
  chrome.commands.onCommand.addListener(handle);
})();
