import os
from flask import jsonify
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handle_file_upload(files):
    try:
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        
        for key in files:
            file = files[key]
            if file and allowed_file(file.filename):
                filename = file.filename
                file.save(os.path.join(UPLOAD_FOLDER, filename))
            else:
                return jsonify({'error': '허용되지 않는 파일 형식'}), 400
        
        return jsonify({'message': '파일 업로드 성공'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
