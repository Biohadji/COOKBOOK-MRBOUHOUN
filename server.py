import http.server
import socketserver
import os

PORT = 8000
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
    ".js": "application/javascript",
    ".json": "application/json",
    ".html": "text/html",
})

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"الخادم يعمل على: http://localhost:{PORT}")
    print("اضغط Ctrl+C للإيقاف")
    httpd.serve_forever()