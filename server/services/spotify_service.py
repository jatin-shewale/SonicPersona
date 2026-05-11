import os
import requests
import base64
from urllib.parse import urlencode


class SpotifyService:
    BASE_URL = "https://api.spotify.com/v1"
    AUTH_URL = "https://accounts.spotify.com/authorize"
    TOKEN_URL = "https://accounts.spotify.com/api/token"

    def __init__(self):
        self.client_id = os.getenv("SPOTIFY_CLIENT_ID")
        self.client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
        self.redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI", "http://127.0.0.1:5001/auth/callback")

    def _auth_header(self):
        credentials = f"{self.client_id}:{self.client_secret}"
        encoded = base64.b64encode(credentials.encode()).decode()
        return {"Authorization": f"Basic {encoded}"}

    def _bearer_header(self, token):
        return {"Authorization": f"Bearer {token}"}

    def get_auth_url(self, scopes: str, state: str) -> str:
        params = {
            "client_id": self.client_id,
            "response_type": "code",
            "redirect_uri": self.redirect_uri,
            "scope": scopes,
            "state": state,
            "show_dialog": "false",
        }
        return f"{self.AUTH_URL}?{urlencode(params)}"

    def exchange_code(self, code: str) -> dict | None:
        try:
            resp = requests.post(
                self.TOKEN_URL,
                headers={**self._auth_header(), "Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": self.redirect_uri,
                },
                timeout=10,
            )
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"Token exchange error: {e}")
            return None

    def refresh_access_token(self, refresh_token: str) -> str | None:
        try:
            resp = requests.post(
                self.TOKEN_URL,
                headers={**self._auth_header(), "Content-Type": "application/x-www-form-urlencoded"},
                data={"grant_type": "refresh_token", "refresh_token": refresh_token},
                timeout=10,
            )
            resp.raise_for_status()
            return resp.json().get("access_token")
        except Exception as e:
            print(f"Token refresh error: {e}")
            return None

    def _get(self, token: str, path: str, params: dict = None) -> dict | None:
        try:
            resp = requests.get(
                f"{self.BASE_URL}{path}",
                headers=self._bearer_header(token),
                params=params or {},
                timeout=15,
            )
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"Spotify GET {path} error: {e}")
            return None

    def _post(self, token: str, path: str, json_data: dict = None) -> dict | None:
        try:
            resp = requests.post(
                f"{self.BASE_URL}{path}",
                headers={**self._bearer_header(token), "Content-Type": "application/json"},
                json=json_data or {},
                timeout=15,
            )
            resp.raise_for_status()
            return resp.json() if resp.content else {}
        except Exception as e:
            print(f"Spotify POST {path} error: {e}")
            return None

    def get_current_user(self, token: str) -> dict | None:
        return self._get(token, "/me")

    def get_top_artists(self, token: str, limit=50, time_range="long_term") -> dict | None:
        return self._get(token, "/me/top/artists", {"limit": limit, "time_range": time_range})

    def get_top_tracks(self, token: str, limit=50, time_range="long_term") -> dict | None:
        return self._get(token, "/me/top/tracks", {"limit": limit, "time_range": time_range})

    def get_audio_features(self, token: str, track_ids: list) -> dict | None:
        ids_str = ",".join(track_ids[:100])
        result = self._get(token, "/audio-features", {"ids": ids_str})
        if result is not None:
            return result

        # Fallback: fetch audio features one track at a time to avoid batch restrictions
        audio_features = []
        for track_id in track_ids[:100]:
            track_result = self._get(token, f"/audio-features/{track_id}")
            if track_result:
                audio_features.append(track_result)
        if audio_features:
            return {"audio_features": audio_features}
        return None

    def get_recently_played(self, token: str, limit=50) -> dict | None:
        return self._get(token, "/me/player/recently-played", {"limit": limit})

    def get_full_analysis_data(self, token: str) -> dict | None:
        """Fetch all data needed for personality analysis"""
        artists_data = self.get_top_artists(token, limit=50, time_range="long_term")
        tracks_data = self.get_top_tracks(token, limit=50, time_range="long_term")
        recently_data = self.get_recently_played(token, limit=50)

        if not artists_data or not tracks_data:
            return None

        top_artists = artists_data.get("items", [])
        top_tracks = tracks_data.get("items", [])

        # Fetch audio features for top tracks
        track_ids = [t["id"] for t in top_tracks if t.get("id")]
        audio_features = []
        if track_ids:
            af_data = self.get_audio_features(token, track_ids)
            if af_data:
                audio_features = [f for f in af_data.get("audio_features", []) if f]

        # Parse artists
        parsed_artists = [
            {
                "id": a["id"],
                "name": a["name"],
                "genres": a.get("genres", []),
                "popularity": a.get("popularity", 0),
                "followers": a.get("followers", {}).get("total", 0),
                "images": a.get("images", []),
                "external_url": a.get("external_urls", {}).get("spotify", ""),
            }
            for a in top_artists
        ]

        # Parse tracks
        parsed_tracks = [
            {
                "id": t["id"],
                "name": t["name"],
                "artists": [ar["name"] for ar in t.get("artists", [])],
                "artist_ids": [ar["id"] for ar in t.get("artists", [])],
                "album": t.get("album", {}).get("name", ""),
                "album_image": (t.get("album", {}).get("images", [{}]) or [{}])[0].get("url", ""),
                "popularity": t.get("popularity", 0),
                "duration_ms": t.get("duration_ms", 0),
                "preview_url": t.get("preview_url"),
                "release_date": t.get("album", {}).get("release_date", ""),
                "external_url": t.get("external_urls", {}).get("spotify", ""),
            }
            for t in top_tracks
        ]

        # Map audio features to tracks
        af_map = {af["id"]: af for af in audio_features if af.get("id")}
        for track in parsed_tracks:
            af = af_map.get(track["id"], {})
            track["audio_features"] = {
                "acousticness": af.get("acousticness", 0.5),
                "danceability": af.get("danceability", 0.5),
                "energy": af.get("energy", 0.5),
                "instrumentalness": af.get("instrumentalness", 0.0),
                "liveness": af.get("liveness", 0.2),
                "speechiness": af.get("speechiness", 0.1),
                "tempo": af.get("tempo", 120),
                "valence": af.get("valence", 0.5),
            }

        # Recently played
        recent_tracks = []
        if recently_data:
            recent_tracks = [
                {
                    "id": item["track"]["id"],
                    "name": item["track"]["name"],
                    "artists": [ar["name"] for ar in item["track"].get("artists", [])],
                    "played_at": item.get("played_at", ""),
                }
                for item in recently_data.get("items", [])
            ]

        return {
            "top_artists": parsed_artists,
            "top_tracks": parsed_tracks,
            "recent_tracks": recent_tracks,
        }

    def get_demo_data(self) -> dict:
        """Realistic demo data for testing"""
        return {
            "top_artists": [
                {"id": "1", "name": "Radiohead", "genres": ["alternative rock", "art rock", "indie rock"], "popularity": 82, "followers": 5200000, "images": [], "external_url": "https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb"},
                {"id": "2", "name": "Tame Impala", "genres": ["indie pop", "psychedelic rock", "indie rock"], "popularity": 85, "followers": 7100000, "images": [], "external_url": ""},
                {"id": "3", "name": "Frank Ocean", "genres": ["neo soul", "r&b", "alternative r&b"], "popularity": 88, "followers": 9300000, "images": [], "external_url": ""},
                {"id": "4", "name": "The National", "genres": ["indie rock", "alternative rock"], "popularity": 73, "followers": 2800000, "images": [], "external_url": ""},
                {"id": "5", "name": "James Blake", "genres": ["electronic", "indie soul", "ambient"], "popularity": 72, "followers": 2100000, "images": [], "external_url": ""},
            ],
            "top_tracks": [
                {
                    "id": "t1", "name": "Motion Picture Soundtrack", "artists": ["Radiohead"],
                    "artist_ids": ["1"], "album": "Kid A", "album_image": "",
                    "popularity": 78, "duration_ms": 248000, "preview_url": None,
                    "release_date": "2000-10-02", "external_url": "",
                    "audio_features": {"acousticness": 0.82, "danceability": 0.28, "energy": 0.15, "instrumentalness": 0.02, "liveness": 0.08, "speechiness": 0.04, "tempo": 72, "valence": 0.12}
                },
                {
                    "id": "t2", "name": "Let It Happen", "artists": ["Tame Impala"],
                    "artist_ids": ["2"], "album": "Currents", "album_image": "",
                    "popularity": 85, "duration_ms": 467000, "preview_url": None,
                    "release_date": "2015-07-17", "external_url": "",
                    "audio_features": {"acousticness": 0.12, "danceability": 0.64, "energy": 0.72, "instrumentalness": 0.08, "liveness": 0.09, "speechiness": 0.05, "tempo": 118, "valence": 0.58}
                },
                {
                    "id": "t3", "name": "Nights", "artists": ["Frank Ocean"],
                    "artist_ids": ["3"], "album": "Blonde", "album_image": "",
                    "popularity": 89, "duration_ms": 307000, "preview_url": None,
                    "release_date": "2016-08-20", "external_url": "",
                    "audio_features": {"acousticness": 0.31, "danceability": 0.58, "energy": 0.55, "instrumentalness": 0.0, "liveness": 0.12, "speechiness": 0.18, "tempo": 122, "valence": 0.42}
                },
            ],
            "recent_tracks": []
        }

    def create_playlist(self, token: str, name: str, description: str, public: bool = False) -> dict | None:
        return self._post(token, "/me/playlists", {
            "name": name,
            "description": description,
            "public": public,
        })

    def add_tracks_to_playlist(self, token: str, playlist_id: str, track_uris: list) -> dict | None:
        # Spotify allows max 100 tracks per request
        for i in range(0, len(track_uris), 100):
            batch = track_uris[i:i+100]
            result = self._post(token, f"/playlists/{playlist_id}/items", {"uris": batch})
            if not result:
                return None
        return {"success": True}
