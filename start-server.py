#!/usr/bin/env python3
"""
Simple HTTP server for Elements Festival Planner
Run this script to start a local server for development
"""

import http.server
import socketserver
import webbrowser
import os
import sys

def start_server(port=8000):
    """Start a simple HTTP server on the specified port"""
    
    # Change to the directory containing this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Create the server
    handler = http.server.SimpleHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"🚀 Starting Elements Festival Planner server...")
            print(f"📁 Serving files from: {script_dir}")
            print(f"🌐 Server running at: http://localhost:{port}")
            print(f"📄 Open your browser and go to: http://localhost:{port}")
            print(f"⏹️  Press Ctrl+C to stop the server")
            print("-" * 50)
            
            # Try to open the browser automatically
            try:
                webbrowser.open(f"http://localhost:{port}")
                print("✅ Browser opened automatically")
            except:
                print("⚠️  Please open your browser manually")
            
            # Start the server
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {port} is already in use. Try a different port:")
            print(f"   python start-server.py {port + 1}")
        else:
            print(f"❌ Error starting server: {e}")
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    # Get port from command line argument or use default
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    start_server(port) 