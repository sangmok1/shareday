from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import logging
from utils.db_connection import get_db_connection
from routes.notice_routes import init_notice_routes
from routes.auth_routes import init_auth_routes
from services.photo_service import create_photo_strip
import datetime
import os

# 로깅 설정
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.db_connection = get_db_connection

# CORS 설정 수정 - AWS 배포용
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://your-domain.com", "http://your-ip:8080"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# 요청 로깅 미들웨어
@app.before_request
def log_request():
    logger.info(f"Received {request.method} request to {request.path}")
    logger.info(f"Headers: {request.headers}")
    if request.data:
        logger.info(f"Data: {request.get_json(silent=True)}")

# 에러 핸들러
@app.errorhandler(Exception)
def handle_error(error):
    logger.error(f"An error occurred: {str(error)}", exc_info=True)
    return jsonify({
        'success': False,
        'message': str(error)
    }), 500

# 테스트 라우트
@app.route('/test')
def test():
    return jsonify({'message': 'Server is running!'})

# 라우트 초기화
init_notice_routes(app)
init_auth_routes(app)

@app.route('/api/test-auth', methods=['POST'])
def test_auth():
    data = request.get_json()
    return jsonify({
        'success': True,
        'received_data': data
    })

@app.route('/create-photo-strip', methods=['POST'])
def create_photo_strip_endpoint():
    try:
        if 'image1' not in request.files:
            return '이미지 파일이 없습니다.', 400

        # 임시 파일 저장을 위한 디렉토리 생성
        temp_dir = 'temp_images'
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)

        # 이미지 파일 임시 저장
        temp_paths = []
        for i in range(1, 5):
            file = request.files[f'image{i}']
            if file:
                temp_path = os.path.join(temp_dir, f'temp_image_{i}.png')
                file.save(temp_path)
                temp_paths.append(temp_path)

        # 배경색 옵션 가져오기
        background_color_option = request.form.get('background_color_option', 'turquoise')  # 기본값은 turquoise

        # 포토 스트립 생성
        output_path = create_photo_strip(temp_paths, background_color_option)

        # 결과 파일 전송
        return send_file(output_path, as_attachment=True)

    except Exception as e:
        print(f"이미지 처리 중 에러 발생: {str(e)}")
        return str(e), 500

    finally:
        # 임시 파일들 삭제
        for path in temp_paths:
            if os.path.exists(path):
                os.remove(path)
        if os.path.exists(output_path):
            os.remove(output_path)

if __name__ == '__main__':
    print("Starting Flask server on http://0.0.0.0:8080")
    app.run(
        host='0.0.0.0',  # 모든 IP에서 접근 가능하도록 설정
        port=8080,
        debug=False  # 프로덕션에서는 debug 모드 비활성화
    )

