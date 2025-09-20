// Wait for the entire HTML document to be loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element Selection ---
  // Get references to the essential elements from our index.html
  const commandInput = document.getElementById("command-input");
  const outputArea = document.getElementById("output-area");
  const terminalContainer = document.getElementById("terminal-container");

  // --- Command History Feature ---
  // Load command history from localStorage or initialize an empty array
  let commandHistory =
    JSON.parse(localStorage.getItem("terminalHistory")) || [];
  let historyIndex = commandHistory.length; // Start index at the end of the history

  // --- Main Event Listener for User Input ---
  commandInput.addEventListener("keydown", async (event) => {
    // We only care about the 'Enter', 'ArrowUp', and 'ArrowDown' keys
    if (event.key === "Enter") {
      // Prevent the default 'Enter' key behavior (like adding a new line)
      event.preventDefault();

      const command = commandInput.value.trim(); // Get the command and remove whitespace

      if (command) {
        // Display the command the user typed
        displayCommand(command);

        // Add the command to our history if it's not a duplicate of the last one
        if (commandHistory[commandHistory.length - 1] !== command) {
          commandHistory.push(command);
          localStorage.setItem(
            "terminalHistory",
            JSON.stringify(commandHistory)
          );
        }
        historyIndex = commandHistory.length; // Reset history index

        // Handle a special frontend-only 'clear' command
        if (command.toLowerCase() === "clear") {
          outputArea.innerHTML = ""; // Clear all previous output
        } else if (command.toLowerCase() === "help") {
          displayHelp();
        } else {
          // Send the command to the backend for execution
          await executeCommandOnBackend(command);
        }

        // Clear the input field for the next command
        commandInput.value = "";
        // Scroll to the bottom of the terminal to show the latest output
        terminalContainer.scrollTop = terminalContainer.scrollHeight;
      }
    } else if (event.key === "ArrowUp") {
      // --- Handle Command History Navigation (Up) ---
      event.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        commandInput.value = commandHistory[historyIndex];
      }
    } else if (event.key === "ArrowDown") {
      // --- Handle Command History Navigation (Down) ---
      event.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        commandInput.value = commandHistory[historyIndex];
      } else {
        // If at the end of history, clear the input
        historyIndex = commandHistory.length;
        commandInput.value = "";
      }
    }
  });

  // --- Function to Execute Command on Backend ---
  async function executeCommandOnBackend(command) {
    // The URL of our Flask backend API
    const apiUrl = "http://127.0.0.1:5000/api/execute";

    try {
      const response = await fetch(apiUrl, {
        method: "POST", // We are sending data
        headers: {
          "Content-Type": "application/json", // Tell the server we're sending JSON
        },
        body: JSON.stringify({ command: command }), // Convert our JS object to a JSON string
      });

      const result = await response.json(); // Parse the JSON response from the server

      // Check if the server sent back an error or normal output
      if (result.error) {
        displayError(result.error);
      } else {
        displayOutput(result.output);
      }
    } catch (error) {
      // This catches network errors (e.g., if the backend server is not running)
      displayError("Connection error: Could not reach the backend server.");
      console.error("Fetch error:", error);
    }
  }

  // --- Helper Functions to Display Content ---
  function displayCommand(command) {
    const commandElement = document.createElement("div");
    commandElement.className = "input-line";
    commandElement.innerHTML = `<span class="prompt">guest@codemate:~$</span><span>${escapeHtml(
      command
    )}</span>`;
    outputArea.appendChild(commandElement);
  }

  function displayOutput(output) {
    const outputElement = document.createElement("div");
    outputElement.className = "output-line";
    outputElement.textContent = output;
    outputArea.appendChild(outputElement);
  }

  function displayError(error) {
    const errorElement = document.createElement("div");
    errorElement.className = "output-line error-line"; // Use the special error style
    errorElement.textContent = error;
    outputArea.appendChild(errorElement);
  }

  function displayHelp() {
    const helpText = `
Available custom commands:
  cpu         - Show current CPU usage percentage.
  memory      - Show current memory usage percentage.
  help        - Display this list of commands.
  clear       - Clear the terminal screen.

You can also use standard shell commands like ls, pwd, mkdir, etc., and natural language like "create a folder my_stuff".
        `;
    displayOutput(helpText);
  }

  // Utility to prevent HTML injection from command outputs
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});``
