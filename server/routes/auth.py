import os
import secrets
from flask import Blueprint, redirect, request, jsonify, session
from services.spotify_service import SpotifyService

auth_bp = Blueprint("auth", __name__)
spotify_service = SpotifyService()

SCOPES = " ".join([
    "user-top-read",
    "user-read-email",
    "user-read-private",
    "user-read-recently-played",
    "playlist-modify-public",
    "playlist-modify-private",
    "streaming",
    "user-read-playback-state",
])

@auth_bp.route("/login")
def login():
    state = secrets.token_urlsafe(16)
    session["oauth_state"] = state
    auth_url = spotify_service.get_auth_url(SCOPES, state)
    return redirect(auth_url)

@auth_bp.route("/callback")
def callback():
    error = request.args.get("error")
    if error:
        client_url = os.getenv("CLIENT_URL", "http://localhost:5173")
        return redirect(f"{client_url}/?error={error}")

    code = request.args.get("code")
    state = request.args.get("state")

    # Optional: validate state
    # stored_state = session.pop("oauth_state", None)
    # if state != stored_state:
    #     return redirect(f"{os.getenv('CLIENT_URL')}/?error=state_mismatch")

    token_data = spotify_service.exchange_code(code)
    if not token_data:
        client_url = os.getenv("CLIENT_URL", "http://localhost:5173")
        return redirect(f"{client_url}/?error=token_exchange_failed")

    session["access_token"] = token_data["access_token"]
    session["refresh_token"] = token_data.get("refresh_token")
    session["expires_in"] = token_data.get("expires_in", 3600)

    client_url = os.getenv("CLIENT_URL", "http://localhost:5173")
    return redirect(f"{client_url}/loading")

@auth_bp.route("/status")
def status():
    access_token = session.get("access_token")
    if not access_token:
        return jsonify({"authenticated": False})
    
    user = spotify_service.get_current_user(access_token)
    if not user:
        # Try to refresh
        refresh_token = session.get("refresh_token")
        if refresh_token:
            new_token = spotify_service.refresh_access_token(refresh_token)
            if new_token:
                session["access_token"] = new_token
                user = spotify_service.get_current_user(new_token)

    if user:
        return jsonify({
            "authenticated": True,
            "user": {
                "id": user.get("id"),
                "display_name": user.get("display_name"),
                "email": user.get("email"),
                "images": user.get("images", []),
            }
        })
    return jsonify({"authenticated": False})

@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True})

@auth_bp.route("/token")
def get_token():
    """Return access token for client-side Spotify Web Playback SDK"""
    token = session.get("access_token")
    if not token:
        return jsonify({"error": "Not authenticated"}), 401
    return jsonify({"access_token": token})
