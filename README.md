🚀 Python-Based AI Command Terminal
Built for the CodeMate.AI Hackathon | September 2025
A fully functional, web-based command terminal with a Python/Flask backend. This application mimics the behavior of a real system terminal while adding a layer of intelligence with an AI-powered natural language parser and a polished, modern user interface.

📸 Screenshot of project 
For a visual overview and demo of the UI, see attached screenshots 
<img width="1855" height="893" alt="Image" src="https://github.com/user-attachments/assets/185545d0-094d-4bc4-b202-afcfbf0af42f" />
✨ Live Demo
Frontend Live Site: https://codemate-terminal-hackathon.netlify.app/

Backend Live API: https://codemate-terminal-hackathon.onrender.com

🌟 Key Features
This project meets all the mandatory requirements of the hackathon and includes several optional enhancements to improve functionality and user experience.

Core Functionality
Python/Flask Backend: A robust backend server that processes commands, handles logic, and communicates with the frontend.

Full File System Interaction: Executes standard shell commands (ls, cd, pwd, mkdir, rm) that interact directly with the local file system, just like a native terminal.

System Monitoring: Integrated psutil to provide custom commands (cpu, memory) for real-time system resource monitoring.

Robust Error Handling: Gracefully handles invalid commands and provides clear error feedback to the user without crashing.

🏆 Standout Enhancements
🧠 AI-Powered Natural Language Parser: Users can type commands in plain English (e.g., "create a new folder called 'assets'"), and the backend translates them into executable shell commands.

⌨ Persistent Command History: A polished frontend feature that saves command history to localStorage. Users can effortlessly cycle through previous commands using the Up and Down arrow keys, creating a seamless and authentic terminal experience.

🎨 Professional UI/UX: A clean, responsive interface with a modern dark theme, custom interactive scrollbar, and an animated glowing border to provide a premium user experience.

💡 Built-in Help Command: A help command that lists all available custom and natural language features, making the terminal easy to use for new users.

🛠 Tech Stack
Frontend: HTML5, CSS3, Vanilla JavaScript

Backend: Python

Framework: Flask

Key Python Libraries: psutil, Flask-Cors

🚀 How to Run Locally
To run this project on your local machine, please follow these steps:

Clone the repository:

git clone [https://github.com/vishnu77ss/codemate-terminal-hackathon.git](https://github.com/vishnu77ss/codemate-terminal-hackathon.git)
cd codemate-terminal-hackathon

Set up the Python virtual environment:

python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate

Install the required dependencies:

pip install -r requirements.txt

Run the Flask backend server:

flask run

The backend will be running at http://127.0.0.1:5000.

Run the frontend:

Simply open the index.html file in your web browser.

📫 Contact
Vishnu Murthy
LinkedIn-https://www.linkedin.com/in/vishnumediboina/
vishnumurthy_mediboina@srmap.edu.in
