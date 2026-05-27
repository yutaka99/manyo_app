function renderApp() {
    const hash = window.location.hash.substring(1);
    const appContainer = document.getElementById('app');
    
    // database.js で定義した plantDatabase を参照
    if (!hash || !plantDatabase[hash]) {
        appContainer.innerHTML = ``;
        return;
    }

    const data = plantDatabase[hash];
    appContainer.innerHTML = ``;
}

window.addEventListener('hashchange', renderApp);
window.addEventListener('DOMContentLoaded', renderApp);