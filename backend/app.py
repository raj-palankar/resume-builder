import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from config import Config
from routes import resume_bp

app = Flask(__name__, static_folder='../frontend', static_url_path='')

app.config.from_object(Config)

CORS(app)

# Register blueprints
app.register_blueprint(resume_bp, url_prefix='/api')

@app.route('/')
def serve_frontend():
    """Serve the frontend index.html"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    # Ensure the database exists
    try:
        import pymysql
        connection = pymysql.connect(
            host=app.config['MYSQL_HOST'],
            user=app.config['MYSQL_USER'],
            password=app.config['MYSQL_PASSWORD']
        )
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {app.config['MYSQL_DB']}")
        connection.close()
        print(f"Database '{app.config['MYSQL_DB']}' is ready")
    except Exception as e:
        print(f"Warning: Could not create database: {e}")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
