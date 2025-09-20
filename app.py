# app.py
# Import necessary libraries
import os
import subprocess
import psutil
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize the Flask application
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow frontend to communicate with this backend
CORS(app)

# Keep track of the current working directory. Start in the directory where the script is run.
# os.getcwd() gets the current working directory of the script.
current_working_directory = os.getcwd()

# --- AI-Powered Natural Language Parsing ---
def parse_natural_language(command):
    """Parses a natural language command and translates it into a corresponding shell command using simple rule-based logic.
    Args:
        command (str): The natural language command to be parsed.
    Returns:
        str: The translated shell command if a rule matches; otherwise, returns the original command.
    Supported Rules:
        - Create a folder: Recognizes phrases like "create folder" or "make directory" and generates a "mkdir" command.
        - List files: Recognizes phrases like "list files" or "show files" and generates an "ls -l" command.
        - Show current path: Recognizes phrases like "where am i" or "current path" and generates a "pwd" command.***
    """
    command_lower = command.lower()
    parts = command.split()
    # ... the rest of the function continues below ...

    # Rule for creating a folder
    if ("create" in command_lower or "make" in command_lower) and ("folder" in command_lower or "directory" in command_lower):
        # Assumes the folder name is the last word
        folder_name = parts[-1]
        return f"mkdir {folder_name}"

    # Rule for listing files
    if "list" in command_lower or "show" in command_lower and "files" in command_lower:
        return "ls -l"
    
    # Rule for showing current path
    if "where am i" in command_lower or "current path" in command_lower:
        return "pwd"

    # If no rule matches, return the original command
    return command


# --- API Endpoint to Execute Commands ---
@app.route('/api/execute', methods=['POST'])
def execute_command():
    """
    Receives a command from the frontend, executes it, and returns the output.
    """
    global current_working_directory
    data = request.get_json()
    command = data.get('command', '')

    if not command:
        return jsonify({'error': 'No command provided'}), 400

    # 1. Parse for natural language first
    processed_command = parse_natural_language(command)

    # 2. Handle special custom commands
    if processed_command == 'cpu':
        cpu_usage = psutil.cpu_percent(interval=1)
        return jsonify({'output': f'CPU Usage: {cpu_usage}%'})
    
    if processed_command == 'memory':
        memory_info = psutil.virtual_memory()
        return jsonify({'output': f'Memory Usage: {memory_info.percent}% Used'})

    # 3. Handle directory change command ('cd') specially
    if processed_command.strip().startswith('cd '):
        try:
            # Get the target directory from the command (e.g., "cd my_folder")
            target_dir = processed_command.strip().split(maxsplit=1)[1]
            
            # Create a prospective new path
            prospective_path = os.path.join(current_working_directory, target_dir)
            
            # Check if the path exists and is a directory
            if os.path.isdir(prospective_path):
                # Update the global current working directory
                current_working_directory = os.path.abspath(prospective_path)
                return jsonify({'output': f'Changed directory to: {current_working_directory}'})
            else:
                return jsonify({'error': f'Directory not found: {target_dir}'})
        except Exception as e:
            return jsonify({'error': str(e)})

    # 4. Execute all other standard commands
    try:
        # subprocess.run is used to execute the command in a shell.
        # `cwd` argument ensures the command runs in our tracked directory.
        result = subprocess.run(
            processed_command,
            shell=True,
            capture_output=True,
            text=True,
            cwd=current_working_directory,
            timeout=10 # Add a timeout for safety
        )

        # Check if there was an error during execution
        if result.returncode != 0:
            return jsonify({'error': result.stderr.strip()})

        # Return the standard output
        return jsonify({'output': result.stdout.strip()})

    except subprocess.TimeoutExpired:
        return jsonify({'error': 'Command timed out.'})
    except Exception as e:
        return jsonify({'error': str(e)})

# --- Main entry point for the application ---
if __name__ == '__main__':
    # Run the Flask app on host 0.0.0.0 (accessible from network) and port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
