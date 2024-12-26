from flask import jsonify, request
from services.upload_service import handle_file_upload

def init_routes(app):
    @app.route('/')
    def home():
        return "Flask 서버가 정상적으로 실행중입니다."

    @app.route('/api/upload', methods=['POST'])
    def upload_files():
        try:
            return handle_file_upload(request.files)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
