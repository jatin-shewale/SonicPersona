from flask import Blueprint, jsonify, session, request
from services.spotify_service import SpotifyService
from services.playlist_service import PlaylistService
from functools import wraps

playlist_bp = Blueprint("playlist", __name__)
spotify_service = SpotifyService()
playlist_service = PlaylistService()


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = session.get("access_token")
        if not token:
            return jsonify({"error": "Not authenticated"}), 401
        return f(token, *args, **kwargs)
    return decorated


@playlist_bp.route("/create-dna", methods=["POST"])
@require_auth
def create_dna_playlist(token):
    """Create 'My Musical DNA' playlist with top tracks"""
    data = request.get_json() or {}
    archetype_name = data.get("archetype_name", "Musical DNA")
    track_ids = data.get("track_ids", [])

    if not track_ids:
        return jsonify({"error": "No track IDs provided"}), 400

    result = playlist_service.create_musical_dna_playlist(
        token, track_ids, archetype_name
    )

    if not result:
        return jsonify({"error": "Failed to create playlist"}), 500

    return jsonify(result)
