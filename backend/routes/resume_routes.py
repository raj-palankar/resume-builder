from flask import request, jsonify
from . import resume_bp
from models import ResumeModel

@resume_bp.route('/save', methods=['POST'])
def save_resume():
    """Save a new resume or update an existing one"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        if not data.get('name') or not data.get('email'):
            return jsonify({'error': 'Name and email are required fields'}), 400
        
        # Check if this is an update or a new resume
        resume_id = data.get('id')
        
        if resume_id:
            # Update existing resume
            success = ResumeModel.update(resume_id, data)
            if success:
                return jsonify({'success': True, 'id': resume_id})
            else:
                return jsonify({'error': 'Resume not found'}), 404
        else:
            # Create new resume
            new_id = ResumeModel.save(data)
            return jsonify({'success': True, 'id': new_id}), 201
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/get/<int:resume_id>', methods=['GET'])
def get_resume(resume_id):
    """Get a specific resume by ID"""
    try:
        resume = ResumeModel.get_by_id(resume_id)
        if resume:
            return jsonify(resume)
        else:
            return jsonify({'error': 'Resume not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/list', methods=['GET'])
def list_resumes():
    """Get all resumes"""
    try:
        resumes = ResumeModel.get_all()
        return jsonify(resumes)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/delete/<int:resume_id>', methods=['DELETE'])
def delete_resume(resume_id):
    """Delete a resume by ID"""
    try:
        success = ResumeModel.delete(resume_id)
        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'error': 'Resume not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
