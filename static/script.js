document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById("userInput");
  const log = document.getElementById("chatlog");

  // Send message on Enter key, only if input exists
  input?.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

  async function sendMessage() {
    const userMessage = input.value.trim();
    if (!userMessage) return;

    // Append user message bubble
    const userMsg = document.createElement("div");
    userMsg.textContent = "🧑: " + userMessage;
    userMsg.classList.add("user-message");
    log.appendChild(userMsg);
    input.value = "";
    log.scrollTop = log.scrollHeight;

    // Show typing indicator
    const typingMsg = document.createElement("div");
    typingMsg.textContent = "🤖 Demobot is typing...";
    typingMsg.classList.add("bot-message", "typing");
    log.appendChild(typingMsg);
    log.scrollTop = log.scrollHeight;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      // Remove typing indicator
      typingMsg.remove();

      // Append bot response bubble
      const botMsg = document.createElement("div");
      botMsg.classList.add("bot-message");
      if (data.reply) {
        botMsg.textContent = "🤖 Demobot: " + data.reply;
      } else {
        botMsg.textContent = "🤖 Demobot: Sorry, something went wrong.";
      }

      log.appendChild(botMsg);
      log.scrollTop = log.scrollHeight;

    } catch (error) {
      console.error("Error:", error);
      typingMsg.remove();

      const botMsg = document.createElement("div");
      botMsg.textContent = "🤖 Demobot: Could not connect to backend.";
      botMsg.classList.add("bot-message");
      log.appendChild(botMsg);
      log.scrollTop = log.scrollHeight;
    }
  }

  // Hamburger Nav Menu
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Expose sendMessage globally so inline onclick can access it
  window.sendMessage = sendMessage;
});
