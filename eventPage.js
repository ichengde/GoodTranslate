;(function(){
  function handle(command) {
    console.log('Command:', command);
    if (command === 'translate') {
      chrome.tabs.executeScript(null,{
        file: "translate.js"
      });
    }
  }
  chrome.commands.onCommand.addListener(handle);
})();
