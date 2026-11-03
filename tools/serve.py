"""Local preview server that, like GitHub Pages, serves /world from world.html."""
import http.server
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def translate_path(self, path):
        local = Path(super().translate_path(path))
        if not local.exists() and local.with_suffix(".html").is_file():
            return str(local.with_suffix(".html"))
        return str(local)


if __name__ == "__main__":
    http.server.ThreadingHTTPServer(("", 4173), Handler).serve_forever()
