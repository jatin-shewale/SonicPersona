from flask import Blueprint, jsonify, session
from services.spotify_service import SpotifyService
from services.personality_service import PersonalityService
from services.ollama_service import OllamaService
from functools import wraps

personality_bp = Blueprint("personality", __name__)
spotify_service = SpotifyService()
personality_service = PersonalityService()
ollama_service = OllamaService()


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = session.get("access_token")
        if not token:
            return jsonify({"error": "Not authenticated"}), 401
        return f(token, *args, **kwargs)
    return decorated


@personality_bp.route("/analyze")
@require_auth
def analyze(token):
    """Full personality analysis pipeline"""
    # 1. Fetch Spotify data
    spotify_data = spotify_service.get_full_analysis_data(token)
    if not spotify_data:
        return jsonify({"error": "Failed to fetch Spotify data"}), 500

    # 2. Run local personality analysis
    personality = personality_service.analyze(spotify_data)

    # 3. Enrich with Ollama/Llama3 AI insights
    ai_insights = ollama_service.generate_personality_reading(
        personality, spotify_data
    )

    # Merge
    result = {**personality, "ai_insights": ai_insights}
    return jsonify(result)


@personality_bp.route("/demo")
def demo():
    """Demo data for development/testing without Spotify auth"""
    demo_spotify_data = spotify_service.get_demo_data()
    personality = personality_service.analyze(demo_spotify_data)
    ai_insights = {
        "archetype_story": "You emotionally live inside a rainy neon coming-of-age soundtrack from 2016. The kind of music that feels like midnight drives with nowhere to go — simultaneously restless and at peace.",
        "main_character_energy": "The misunderstood protagonist who has incredible taste but never brags about it. You discover artists six months before they blow up.",
        "alter_ego": "Midnight Archivist — a lone figure in a vinyl-filled room, cataloguing emotional frequencies only they can detect.",
        "emotional_aura": "Your aura radiates quiet intensity. Neon-soaked nostalgia wrapped in modern melancholy. Like a polaroid developing in real time.",
        "roast": "You've added 847 songs to your 'listen later' playlist and listened to exactly zero of them. Your algorithmic recommendations are just therapy you're not billing to insurance.",
        "compliment": "Your taste is the kind that DJs study. Every song in your library is a deliberate choice — a small act of emotional archaeology.",
        "relationship_energy": "You love deeply and quietly, the kind that makes playlists for people instead of saying how you feel.",
        "night_drive_score": 94,
        "chaos_calm_meter": 38,
        "listening_era": "Emotionally, you live in 2013-2019 — the golden age of bedroom pop and introspective indie. Sonically, you're always half a step into tomorrow.",
    }
    result = {**personality, "ai_insights": ai_insights}
    return jsonify(result)
