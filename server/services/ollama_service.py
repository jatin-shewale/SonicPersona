import os
import requests
import json


class OllamaService:
    def __init__(self):
        self.host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "llama3")

    def _generate(self, prompt: str, max_tokens: int = 1024) -> str | None:
        try:
            resp = requests.post(
                f"{self.host}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "num_predict": max_tokens,
                        "temperature": 0.85,
                        "top_p": 0.9,
                    },
                },
                timeout=60,
            )
            resp.raise_for_status()
            return resp.json().get("response", "")
        except requests.exceptions.ConnectionError:
            print("Ollama not running. Using fallback insights.")
            return None
        except Exception as e:
            print(f"Ollama error: {e}")
            return None

    def generate_personality_reading(self, personality: dict, spotify_data: dict) -> dict:
        archetype = personality.get("archetype", {})
        mood = personality.get("mood_spectrum", {})
        genres = [g["genre"] for g in personality.get("genre_dna", [])[:5]]
        top_artists = [a["name"] for a in personality.get("top_artists", [])[:8]]
        top_tracks = [f"{t['name']} by {', '.join(t['artists'])}" for t in personality.get("top_tracks", [])[:5]]
        era = personality.get("listening_era", {}).get("dominant_era", "contemporary")
        stats = personality.get("stats", {})

        prompt = f"""You are a witty, emotionally intelligent music personality analyst. Generate a deeply personalized, cinematic music personality reading.

LISTENER DATA:
- Archetype: {archetype.get('name')} — {archetype.get('description')}
- Top Genres: {', '.join(genres) if genres else 'varied'}
- Top Artists: {', '.join(top_artists) if top_artists else 'unknown'}
- Favorite Tracks: {'; '.join(top_tracks) if top_tracks else 'various'}
- Mood Profile: Energy {mood.get('energy')}%, Danceability {mood.get('danceability')}%, Acoustic {mood.get('acousticness')}%, Positivity {mood.get('valence')}%
- Dominant Era: {era}
- Underground Score: {100 - stats.get('avg_popularity', 50)}% (higher = more underground)

Write a JSON response with these exact keys. Be specific, cinematic, emotionally resonant, witty, and shareable. Never be generic. Always reference the actual artists/genres:

{{
  "archetype_story": "2-3 sentences. Poetic, specific. Reference their actual genres/artists. E.g. 'You emotionally live inside a rainy neon coming-of-age soundtrack from 2016...' NOT 'You like indie music.'",
  "main_character_energy": "1-2 sentences. What kind of main character are they in a film? Reference their music.",
  "alter_ego": "A creative alter ego name + 1 sentence description. E.g. 'Midnight Archivist — cataloguing emotional frequencies only they can detect.'",
  "emotional_aura": "2-3 sentences. Synesthetic description of their vibe. Colors, textures, times of day. Reference their sound.",
  "roast": "2-3 sentences. Sharp, witty roast of their listening habits. Funny but not mean. Must be specific to their actual data.",
  "compliment": "2-3 sentences. Genuine, specific compliment about their taste. Make them feel seen.",
  "relationship_energy": "1-2 sentences. How do they love based on their music?",
  "night_drive_score": integer 0-100 (how perfect is their music for a midnight drive),
  "chaos_calm_meter": integer 0-100 (0=pure calm, 100=pure chaos),
  "listening_era": "2-3 sentences about their temporal relationship with music. Be poetic and specific."
}}

Return ONLY valid JSON. No markdown. No explanation."""

        raw = self._generate(prompt)

        if raw:
            # Try to extract JSON from response
            try:
                # Find JSON block
                start = raw.find("{")
                end = raw.rfind("}") + 1
                if start != -1 and end > start:
                    return json.loads(raw[start:end])
            except json.JSONDecodeError:
                pass

        # Fallback: generate contextual fallback based on archetype
        return self._generate_fallback(personality)

    def _generate_fallback(self, personality: dict) -> dict:
        archetype = personality.get("archetype", {})
        archetype_id = archetype.get("id", "the-chameleon")
        genres = [g["genre"] for g in personality.get("genre_dna", [])[:3]]
        mood = personality.get("mood_spectrum", {})
        artists = [a["name"] for a in personality.get("top_artists", [])[:3]]

        genre_str = ", ".join(genres) if genres else "eclectic sounds"
        artist_str = ", ".join(artists) if artists else "your artists"

        fallbacks = {
            "the-melomaniac": {
                "archetype_story": f"Your library is a cathedral built one perfect track at a time. You live in the space between {genre_str} — where most people glance, you actually look.",
                "main_character_energy": f"You're the person at the party who's somehow heard of {artists[0] if artists else 'every artist'} before they blew up. The quiet tastemaker.",
                "night_drive_score": 78,
                "chaos_calm_meter": 45,
            },
            "the-dreamer": {
                "archetype_story": f"You've built an entire emotional universe out of {genre_str}. Every song is a portal. You don't just listen — you disappear into it.",
                "main_character_energy": "You're the protagonist of a coming-of-age film that hasn't been made yet. The one who stares out rainy windows with perfect songs playing.",
                "night_drive_score": 91,
                "chaos_calm_meter": 22,
            },
            "the-rager": {
                "archetype_story": f"Your music doesn't play — it detonates. The {genre_str} you gravitate toward isn't background noise, it's a manifesto.",
                "main_character_energy": "You're the character who walks in slow motion while everything explodes behind them. Unbothered. Powerful.",
                "night_drive_score": 65,
                "chaos_calm_meter": 88,
            },
        }

        specific = fallbacks.get(archetype_id, {})
        energy = mood.get("energy", 50)
        valence = mood.get("valence", 50)

        return {
            "archetype_story": specific.get("archetype_story", f"Your taste in {genre_str} tells a story that most people couldn't write. Eclectic, intentional, and entirely yours."),
            "main_character_energy": specific.get("main_character_energy", f"You're the character in the film everyone else wants to be — with a soundtrack that proves it."),
            "alter_ego": f"{archetype.get('emoji', '🎵')} The {archetype.get('name', 'Sonic Wanderer').replace('The ', '')} — someone who experiences the world through sound first.",
            "emotional_aura": f"Your aura is {genre_str} at {'golden hour' if valence > 50 else 'midnight'} — {'warm and electric' if energy > 60 else 'quiet and luminous'}. The kind that draws people in without trying.",
            "roast": f"You have {personality.get('stats', {}).get('total_tracks_analyzed', 50)} analyzed tracks and still add songs to playlists you never finish. Your 'Listen Later' folder is a graveyard of good intentions.",
            "compliment": f"Your taste in {artist_str} is genuinely impressive — the kind of curation that takes years of real listening. You don't just consume music, you inhabit it.",
            "relationship_energy": f"You love the way a {'slow build' if energy < 50 else 'perfect drop'} feels — quietly, completely, and always with the right song ready.",
            "night_drive_score": specific.get("night_drive_score", max(30, min(95, round(energy * 0.6 + (100 - valence) * 0.4)))),
            "chaos_calm_meter": specific.get("chaos_calm_meter", round(energy * 0.7 + mood.get("danceability", 50) * 0.3)),
            "listening_era": f"Temporally, you're a {'nostalgic time-traveler' if personality.get('listening_era', {}).get('avg_year', 2020) < 2015 else 'contemporary explorer'} — emotionally rooted in {'a golden age' if True else 'the present'} but always hunting what's next.",
        }
