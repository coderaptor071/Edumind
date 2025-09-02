# llm_server/app.py
from flask import Flask, request, jsonify
import subprocess
import json

app = Flask(__name__)

@app.route("/api/generate", methods=["POST"])
def generate():
    """
    Expects a JSON payload with at least:
    {
      "model": "mistral:7b",
      "prompt": "Your prompt here",
      "options": {
          "temperature": 0.7,
          "max_tokens": 1000
      }
    }
    """
    data = request.get_json()
    if data is None:
        return jsonify({"error": "Invalid JSON payload"}), 400

    model = data.get("model", "mistral:7b")
    prompt = data.get("prompt", "")
    options = data.get("options", {})
    temperature = options.get("temperature", 0.7)
    max_tokens = options.get("max_tokens", 1000)

    try:
        # Build the command for calling the Ollama CLI.
        # (Adjust the command below based on the actual CLI arguments your installation requires.)
        command = [
            "ollama",
            "generate",
            model,
            "--prompt", prompt,
            "--temperature", str(temperature),
            "--max_tokens", str(max_tokens),
            "--format", "json"  # If your CLI supports a JSON output format.
        ]
        # Call the CLI and capture its output.
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        output = result.stdout.strip()

        # Try to parse the output as JSON.
        response_data = json.loads(output)
        return jsonify(response_data)
    except subprocess.CalledProcessError as cpe:
        return jsonify({"error": f"Command failed: {cpe.stderr}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Run on port 5000 (or another available port) to avoid conflict with port 11434.
    app.run(port=5000, debug=True)
