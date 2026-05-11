import math
from datetime import datetime


ARCHETYPES = [
    {
        "id": "the-melomaniac",
        "name": "The Melomaniac",
        "emoji": "🎵",
        "description": "You live and breathe music. Your taste is eclectic, sophisticated, and always ahead of the curve.",
        "traits": ["Curious", "Diverse", "Knowledgeable", "Exploratory"],
        "color": "#9B59B6",
        "gradient": "from-purple-500 to-pink-500",
        "audio_features": {"energy": 0.7, "danceability": 0.6, "acousticness": 0.4, "valence": 0.6},
    },
    {
        "id": "the-rager",
        "name": "The Rager",
        "emoji": "🔥",
        "description": "High energy, high intensity. You need beats that match your internal fire.",
        "traits": ["Energetic", "Bold", "Intense", "Unstoppable"],
        "color": "#E74C3C",
        "gradient": "from-red-500 to-orange-500",
        "audio_features": {"energy": 0.95, "danceability": 0.85, "acousticness": 0.1, "valence": 0.7},
    },
    {
        "id": "the-dreamer",
        "name": "The Dreamer",
        "emoji": "☁️",
        "description": "Lost in melodies and atmosphere. Your music takes you somewhere between sleep and waking.",
        "traits": ["Imaginative", "Introspective", "Atmospheric", "Ethereal"],
        "color": "#3498DB",
        "gradient": "from-blue-500 to-indigo-600",
        "audio_features": {"energy": 0.35, "danceability": 0.38, "acousticness": 0.55, "valence": 0.45},
    },
    {
        "id": "the-nostalgic",
        "name": "The Nostalgic",
        "emoji": "📼",
        "description": "You find magic in the golden days. Your playlists are emotional time machines.",
        "traits": ["Sentimental", "Timeless", "Warm", "Reflective"],
        "color": "#F39C12",
        "gradient": "from-amber-500 to-yellow-500",
        "audio_features": {"energy": 0.5, "danceability": 0.5, "acousticness": 0.65, "valence": 0.65},
    },
    {
        "id": "the-chameleon",
        "name": "The Chameleon",
        "emoji": "🦎",
        "description": "Your taste shifts with the seasons, moods, and lunar cycles. Never predictable.",
        "traits": ["Adaptable", "Versatile", "Curious", "Genre-fluid"],
        "color": "#1ABC9C",
        "gradient": "from-emerald-500 to-teal-500",
        "audio_features": {"energy": 0.6, "danceability": 0.6, "acousticness": 0.5, "valence": 0.6},
    },
    {
        "id": "the-cerebral",
        "name": "The Cerebral",
        "emoji": "🧠",
        "description": "Complexity is your comfort zone. Odd time signatures and layered arrangements are your playground.",
        "traits": ["Analytical", "Sophisticated", "Detail-obsessed", "Progressive"],
        "color": "#7F8C8D",
        "gradient": "from-slate-500 to-gray-600",
        "audio_features": {"energy": 0.6, "danceability": 0.3, "acousticness": 0.45, "valence": 0.35},
    },
    {
        "id": "the-soulful",
        "name": "The Soulful",
        "emoji": "💜",
        "description": "Feeling matters most. Your music comes from the marrow and speaks to the soul.",
        "traits": ["Emotional", "Authentic", "Passionate", "Deep"],
        "color": "#E91E8C",
        "gradient": "from-rose-500 to-red-400",
        "audio_features": {"energy": 0.5, "danceability": 0.5, "acousticness": 0.62, "valence": 0.68},
    },
    {
        "id": "the-hipster",
        "name": "The Hipster",
        "emoji": "🎧",
        "description": "You were into it before it was cool. Indie gems and underground artists fill your library.",
        "traits": ["Alternative", "Underground", "Discerning", "Unique"],
        "color": "#27AE60",
        "gradient": "from-green-500 to-lime-500",
        "audio_features": {"energy": 0.5, "danceability": 0.42, "acousticness": 0.72, "valence": 0.48},
    },
]

ALTER_EGOS = {
    "the-melomaniac": {"name": "The Curator", "title": "Musical Archivist", "emoji": "📚"},
    "the-rager": {"name": "The Firestarter", "title": "Energy Incarnate", "emoji": "⚡"},
    "the-dreamer": {"name": "The Voyager", "title": "Stellar Wanderer", "emoji": "🚀"},
    "the-nostalgic": {"name": "The Timekeeper", "title": "Memory Guardian", "emoji": "⏰"},
    "the-chameleon": {"name": "The Shape-shifter", "title": "Eternal Explorer", "emoji": "🌀"},
    "the-cerebral": {"name": "The Oracle", "title": "Pattern Seeker", "emoji": "🔮"},
    "the-soulful": {"name": "The Empath", "title": "Feeling Conduit", "emoji": "💫"},
    "the-hipster": {"name": "The Explorer", "title": "Undiscovered Finder", "emoji": "🗺️"},
}

GENRE_COLORS = {
    "pop": "#FF6B6B", "dance pop": "#4ECDC4", "electronic": "#45B7D1",
    "hip hop": "#96CEB4", "rap": "#FFEAA7", "rock": "#DDA0DD",
    "indie": "#98D8C8", "alternative": "#F7DC6F", "jazz": "#BB8FCE",
    "blues": "#85C1E9", "classical": "#F8C471", "country": "#82CCDD",
    "folk": "#A3E4D7", "metal": "#E74C3C", "punk": "#F39C12",
    "r&b": "#EC7063", "soul": "#D7BDE2", "reggae": "#58D68D",
    "latin": "#F9E79F", "k-pop": "#FF9AA2", "ambient": "#C39BD3",
    "techno": "#85C1E9", "house": "#5D6D7E", "funk": "#D6DBDF",
    "indie pop": "#7FB3D5", "indie rock": "#85C1E9", "alternative rock": "#DDA0DD",
    "psychedelic": "#A569BD", "neo soul": "#E59866", "experimental": "#BDC3C7",
}


class PersonalityService:

    def analyze(self, spotify_data: dict) -> dict:
        top_artists = spotify_data.get("top_artists", [])
        top_tracks = spotify_data.get("top_tracks", [])

        # Calculate mood spectrum from audio features
        mood_spectrum = self._calculate_mood_spectrum(top_tracks)

        # Calculate genre DNA
        genre_dna = self._calculate_genre_dna(top_artists)

        # Find archetype
        archetype = self._find_archetype(mood_spectrum, genre_dna)

        # Alter ego
        alter_ego_base = ALTER_EGOS.get(archetype["id"], ALTER_EGOS["the-chameleon"])
        alter_ego = {**alter_ego_base, "description": archetype["description"], "color": archetype["color"]}

        # Stats
        total_minutes = sum(t.get("duration_ms", 0) for t in top_tracks) / 60000
        unique_genres = len(genre_dna)
        unique_artists = len(set(a["id"] for a in top_artists))

        # Listening era
        listening_era = self._calculate_listening_era(top_tracks)

        # Popularity score (how mainstream vs underground)
        avg_popularity = (sum(t.get("popularity", 50) for t in top_tracks) / len(top_tracks)) if top_tracks else 50

        return {
            "archetype": archetype,
            "genre_dna": genre_dna,
            "mood_spectrum": mood_spectrum,
            "alter_ego": alter_ego,
            "top_artists": top_artists[:10],
            "top_tracks": top_tracks[:20],
            "stats": {
                "total_minutes": round(total_minutes),
                "unique_artists": unique_artists,
                "unique_genres": unique_genres,
                "avg_popularity": round(avg_popularity),
                "total_tracks_analyzed": len(top_tracks),
            },
            "listening_era": listening_era,
        }

    def _calculate_mood_spectrum(self, tracks: list) -> dict:
        if not tracks:
            return {"energy": 50, "danceability": 50, "acousticness": 50, "valence": 50, "instrumentalness": 0, "speechiness": 10}

        af_list = [t.get("audio_features", {}) for t in tracks if t.get("audio_features")]
        if not af_list:
            return {"energy": 50, "danceability": 50, "acousticness": 50, "valence": 50, "instrumentalness": 0, "speechiness": 10}

        def avg(key):
            vals = [af.get(key, 0.5) for af in af_list]
            return round(sum(vals) / len(vals) * 100)

        return {
            "energy": avg("energy"),
            "danceability": avg("danceability"),
            "acousticness": avg("acousticness"),
            "valence": avg("valence"),
            "instrumentalness": avg("instrumentalness"),
            "speechiness": avg("speechiness"),
        }

    def _calculate_genre_dna(self, artists: list) -> list:
        genre_map = {}
        for artist in artists:
            for genre in artist.get("genres", []):
                genre_map[genre] = genre_map.get(genre, 0) + 1

        sorted_genres = sorted(genre_map.items(), key=lambda x: x[1], reverse=True)[:8]
        if not sorted_genres:
            return []

        total = sum(c for _, c in sorted_genres)
        result = []
        for genre, count in sorted_genres:
            color = GENRE_COLORS.get(genre)
            if not color:
                # Generate a deterministic color from genre name
                hash_val = sum(ord(c) for c in genre)
                hue = hash_val % 360
                color = f"hsl({hue}, 70%, 60%)"
            result.append({
                "genre": genre,
                "percentage": round(count / total * 100),
                "color": color,
            })
        return result

    def _find_archetype(self, mood: dict, genres: list) -> dict:
        def score(archetype):
            af = archetype["audio_features"]
            # Normalize mood to 0-1
            s = 0
            s += 100 - abs(mood["energy"] / 100 - af["energy"]) * 100
            s += 100 - abs(mood["danceability"] / 100 - af["danceability"]) * 100
            s += 100 - abs(mood["acousticness"] / 100 - af["acousticness"]) * 100
            s += 100 - abs(mood["valence"] / 100 - af["valence"]) * 100
            return s

        best = max(ARCHETYPES, key=score)
        return best

    def _calculate_listening_era(self, tracks: list) -> dict:
        years = []
        for track in tracks:
            rd = track.get("release_date", "")
            if rd and len(rd) >= 4:
                try:
                    years.append(int(rd[:4]))
                except ValueError:
                    pass

        if not years:
            return {"dominant_era": "Unknown", "avg_year": 2020, "era_label": "Contemporary Explorer"}

        avg_year = round(sum(years) / len(years))
        decade = (avg_year // 10) * 10

        era_map = {
            1960: ("60s Soul Era", "You're a time traveler with incredible taste."),
            1970: ("70s Groove Era", "Disco, funk, and psychedelia run in your veins."),
            1980: ("80s Synth Era", "Neon, synthesizers, and power ballads define your soul."),
            1990: ("90s Golden Era", "Grunge, hip-hop, and Britpop shaped your musical DNA."),
            2000: ("2000s Revival", "The era of pop maximalism and indie discovery."),
            2010: ("2010s Bedroom Pop Era", "SoundCloud drops and streaming-era masterpieces."),
            2020: ("Contemporary Explorer", "You live at the bleeding edge of new sound."),
        }

        era_key = min(era_map.keys(), key=lambda k: abs(k - decade))
        era_label, era_desc = era_map[era_key]

        # Distribution by decade
        decade_dist = {}
        for y in years:
            d = f"{(y // 10) * 10}s"
            decade_dist[d] = decade_dist.get(d, 0) + 1

        return {
            "dominant_era": era_label,
            "avg_year": avg_year,
            "era_description": era_desc,
            "decade_distribution": decade_dist,
        }
