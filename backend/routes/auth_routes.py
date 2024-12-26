from flask import request, jsonify
from services.email_service import EmailService
from services.auth_service import AuthService
from services.user_service import UserService
from utils.db_connection import get_db_connection
import logging

logger = logging.getLogger(__name__)

def init_auth_routes(app):
    @app.route('/api/auth/send-verification', methods=['POST'], endpoint='auth_send_verification')
    def send_verification():
        try:
            data = request.get_json()
            email = data.get('email')
            
            if not email:
                return jsonify({'success': False, 'message': '이메일이 필요합니다.'}), 400
            
            print(f"Received verification request for email: {email}")
            
            result = EmailService.send_verification_email(email)
            return jsonify(result)
        except Exception as e:
            print(f"Error in send_verification: {str(e)}")
            return jsonify({'success': False, 'message': str(e)}), 500

    @app.route('/api/auth/verify-code', methods=['POST'], endpoint='auth_verify_code')
    def verify_code():
        data = request.json
        email = data.get('email')
        code = data.get('code')
        
        if not email or not code:
            return jsonify({'success': False, 'message': '이메일과 인증코드가 필요합니다.'}), 400
        
        result = AuthService.verify_code(email, code)
        return jsonify(result)

    @app.route('/api/auth/signup', methods=['POST'], endpoint='auth_signup')
    def signup():
        try:
            data = request.get_json()
            nickname = data.get('id')
            password = data.get('password')
            email = data.get('email')

            if not all([nickname, password, email]):
                return jsonify({'success': False, 'message': '모든 필드를 입력해주세요.'}), 400

            result = UserService.create_user(nickname, password, email)
            
            if result['success']:
                return jsonify(result), 201
            else:
                return jsonify(result), 400

        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    @app.route('/api/auth/check-nickname', methods=['POST'], endpoint='auth_check_nickname')
    def check_nickname():
        try:
            data = request.get_json()
            nickname = data.get('nickname')
            
            if not nickname:
                return jsonify({'success': False, 'message': '닉네임을 입력해주세요.'}), 400

            with get_db_connection() as con:
                with con.cursor() as cursor:
                    cursor.execute("SELECT nickname FROM users WHERE nickname = %s", (nickname,))
                    if cursor.fetchone():
                        return jsonify({
                            'success': False, 
                            'message': '이미 사용 중인 닉네임입니다.'
                        })
                    
                    return jsonify({
                        'success': True, 
                        'message': '사용 가능한 닉네임입니다.'
                    })

        except Exception as e:
            logger.error(f"Nickname check error: {str(e)}", exc_info=True)
            return jsonify({
                'success': False, 
                'message': '닉네임 확인 중 오류가 발생했습니다.'
            }), 500

    @app.route('/api/auth/login', methods=['POST'], endpoint='auth_login')
    def login():
        try:
            data = request.get_json()
            nickname = data.get('id')
            password = data.get('password')

            logger.info(f"Login attempt - nickname: {nickname}")

            if not all([nickname, password]):
                return jsonify({
                    'success': False,
                    'message': '아이디와 비밀번호를 모두 입력해주세요.'
                }), 400

            result = UserService.login_user(nickname, password)
            logger.info(f"Login result: {result}")
            
            if result['success']:
                return jsonify({
                    'success': True,
                    'isAdmin': bool(result['admin']),
                    'nickname': result['nickname'],
                    'email': result['email'],
                    'message': '로그인 성공'
                }), 200
            else:
                return jsonify(result), 401

        except Exception as e:
            logger.error(f"Login error: {str(e)}", exc_info=True)
            return jsonify({
                'success': False,
                'message': '로그인 처리 중 오류가 발생했습니다.'
            }), 500