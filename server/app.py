import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey_change_in_prod")

allowed_origins = [origin.strip() for origin in os.getenv("CLIENT_URL", "http://127.0.0.1:5173").split(",")]
CORS(app, 
     origins=allowed_origins,
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

# Register blueprints
from routes.auth import auth_bp
from routes.spotify import spotify_bp
from routes.personality import personality_bp
from routes.playlist import playlist_bp

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(spotify_bp, url_prefix="/spotify")
app.register_blueprint(personality_bp, url_prefix="/personality")
app.register_blueprint(playlist_bp, url_prefix="/playlist")

@app.route("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    debug = os.getenv("FLASK_ENV", "development") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
