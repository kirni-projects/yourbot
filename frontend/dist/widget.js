(function() {
    const scriptElement = document.querySelector('script[src*="widget.js"]');
    const dataId = scriptElement.getAttribute('data-id');
    const eid = scriptElement.getAttribute('eid');
  
    // Fetch the allowed domain from the backend
    async function fetchAllowedDomain() {
        try {
            const response = await fetch(`/api/getdomainurl/${eid}`);
            const data = await response.json();
            console.log('Fetched domain URL:', data.domainURL); // Add this line
            return data.domainURL;
        } catch (error) {
            console.error('Error fetching domain URL:', error);
            return null;
        }
    }
  
    async function initializeWidget() {
        const allowedDomain = await fetchAllowedDomain();
  
        if (!allowedDomain) {
            console.error('Allowed domain could not be fetched.');
            return;
        }
  
        // Check if the current domain matches the allowed domain
        const currentDomain = window.location.hostname;
        console.log('Current Domain:', currentDomain, 'Allowed Domain:', allowedDomain);

        if (currentDomain !== allowedDomain) {
            console.error('Chatbot script is not authorized for this domain.');
            return;
        }
  
        function createChatbot() {
            const container = document.createElement('div');
            container.id = 'chatbot-container';
            container.style.position = 'fixed';
            container.style.bottom = '0';
            container.style.right = '0';
            container.style.width = '300px';
            container.style.height = '400px';
            container.style.zIndex = '1000';
            container.style.border = '1px solid #ccc';
            container.style.backgroundColor = '#fff';
            document.body.appendChild(container);
  
            const chatbotScript = document.createElement('script');
            chatbotScript.src = `/chatbotLogic.js`; // No need for localhost or domain in production
            chatbotScript.async = true;
            document.body.appendChild(chatbotScript);
  
            chatbotScript.onload = function() {
                if (typeof initializeChatbot === 'function') {
                    initializeChatbot(container.id, dataId, eid);
                }
            };
        }
  
        if (!document.getElementById('chatbot-container')) {
            createChatbot();
        }
    }
  
    initializeWidget();
})();