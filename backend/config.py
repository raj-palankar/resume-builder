import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Database configuration
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'password'  # Change this to your MySQL password
    MYSQL_DB = 'resume_builder'
    MYSQL_CURSORCLASS = 'DictCursor'
