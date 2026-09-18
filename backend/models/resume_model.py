import pymysql
from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash

class ResumeModel:
    @staticmethod
    def get_db_connection():
        """Create and return a database connection"""
        return pymysql.connect(
            host=current_app.config['MYSQL_HOST'],
            user=current_app.config['MYSQL_USER'],
            password=current_app.config['MYSQL_PASSWORD'],
            db=current_app.config['MYSQL_DB'],
            cursorclass=current_app.config['MYSQL_CURSORCLASS']
        )
    
    @staticmethod
    def save(data):
        """Save a new resume to the database"""
        connection = None
        try:
            connection = ResumeModel.get_db_connection()
            with connection.cursor() as cursor:
                # Check if resumes table exists, if not create it
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS resumes (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        phone VARCHAR(50),
                        summary TEXT,
                        experience TEXT,
                        education TEXT,
                        skills TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                
                # Insert the resume data
                sql = """
                    INSERT INTO resumes 
                    (name, email, phone, summary, experience, education, skills) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(sql, (
                    data.get('name'),
                    data.get('email'),
                    data.get('phone'),
                    data.get('summary'),
                    data.get('experience'),
                    data.get('education'),
                    data.get('skills')
                ))
                
                connection.commit()
                return cursor.lastrowid
        except Exception as e:
            if connection:
                connection.rollback()
            raise e
        finally:
            if connection:
                connection.close()
    
    @staticmethod
    def get_by_id(resume_id):
        """Get a resume by its ID"""
        connection = None
        try:
            connection = ResumeModel.get_db_connection()
            with connection.cursor() as cursor:
                sql = "SELECT * FROM resumes WHERE id = %s"
                cursor.execute(sql, (resume_id,))
                result = cursor.fetchone()
                return result
        except Exception as e:
            raise e
        finally:
            if connection:
                connection.close()
    
    @staticmethod
    def get_all():
        """Get all resumes"""
        connection = None
        try:
            connection = ResumeModel.get_db_connection()
            with connection.cursor() as cursor:
                sql = "SELECT * FROM resumes ORDER BY created_at DESC"
                cursor.execute(sql)
                results = cursor.fetchall()
                return results
        except Exception as e:
            raise e
        finally:
            if connection:
                connection.close()
    
    @staticmethod
    def update(resume_id, data):
        """Update an existing resume"""
        connection = None
        try:
            connection = ResumeModel.get_db_connection()
            with connection.cursor() as cursor:
                sql = """
                    UPDATE resumes 
                    SET name=%s, email=%s, phone=%s, summary=%s, 
                        experience=%s, education=%s, skills=%s
                    WHERE id=%s
                """
                cursor.execute(sql, (
                    data.get('name'),
                    data.get('email'),
                    data.get('phone'),
                    data.get('summary'),
                    data.get('experience'),
                    data.get('education'),
                    data.get('skills'),
                    resume_id
                ))
                connection.commit()
                return cursor.rowcount > 0
        except Exception as e:
            if connection:
                connection.rollback()
            raise e
        finally:
            if connection:
                connection.close()
    
    @staticmethod
    def delete(resume_id):
        """Delete a resume by its ID"""
        connection = None
        try:
            connection = ResumeModel.get_db_connection()
            with connection.cursor() as cursor:
                sql = "DELETE FROM resumes WHERE id = %s"
                cursor.execute(sql, (resume_id,))
                connection.commit()
                return cursor.rowcount > 0
        except Exception as e:
            if connection:
                connection.rollback()
            raise e
        finally:
            if connection:
                connection.close()
