from flask import Blueprint, jsonify, session
from services.spotify_service import SpotifyService
from functools import wraps

spotify_bp = Blueprint("spotify", __name__)
spotify_service = SpotifyService()


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = session.get("access_token")
        if not token:
            return jsonify({"error": "Not authenticated"}), 401
        return f(token, *args, **kwargs)
    return decorated


@spotify_bp.route("/top-artists")
@require_auth
def top_artists(token):
    time_range = "long_term"  # short_term, medium_term, long_term
    data = spotify_service.get_top_artists(token, limit=50, time_range=time_range)
    if data is None:
        return jsonify({"error": "Failed to fetch top artists"}), 500
    return jsonify(data)


@spotify_bp.route("/top-tracks")
@require_auth
def top_tracks(token):
    time_range = "long_term"
    data = spotify_service.get_top_tracks(token, limit=50, time_range=time_range)
    if data is None:
        return jsonify({"error": "Failed to fetch top tracks"}), 500
    return jsonify(data)


@spotify_bp.route("/audio-features")
@require_auth
def audio_features(token):
    from flask import request
    track_ids = request.args.get("ids", "")
    if not track_ids:
        return jsonify({"error": "No track IDs provided"}), 400
    
    ids_list = track_ids.split(",")[:100]  # Spotify limit
    data = spotify_service.get_audio_features(token, ids_list)
    if data is None:
        return jsonify({"error": "Failed to fetch audio features"}), 500
    return jsonify(data)


@spotify_bp.route("/recently-played")
@require_auth
def recently_played(token):
    data = spotify_service.get_recently_played(token, limit=50)
    if data is None:
        return jsonify({"error": "Failed to fetch recently played"}), 500
    return jsonify(data)


@spotify_bp.route("/full-data")
@require_auth
def full_data(token):
    """Fetch all data needed for personality analysis in one shot"""
    result = spotify_service.get_full_analysis_data(token)
    if result is None:
        return jsonify({"error": "Failed to fetch Spotify data"}), 500
    return jsonify(result)
