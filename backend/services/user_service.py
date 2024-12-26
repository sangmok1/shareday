import bcrypt
from datetime import datetime
from utils.db_connection import get_db_connection
import logging
from mysql.connector import Error
from mysql.connector.cursor import MySQLCursor

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class UserService:
    @staticmethod
    def check_existing_user(cursor, email, nickname):
        # 닉네임 중복 체크만 수행
        cursor.execute("SELECT nickname FROM users WHERE nickname = %s", (nickname,))
        if cursor.fetchone():
            return {'exists': True, 'message': '이미 사용 중인 닉네임입니다.'}
        
        return {'exists': False, 'message': ''}

    @staticmethod
    def create_user(nickname, password, email):
        try:
            logger.info(f"Starting create_user process for nickname: {nickname}")
            with get_db_connection() as con:
                with con.cursor() as cursor:
                    # 닉네임 중복 체크
                    logger.info("Checking for existing nickname")
                    check_result = UserService.check_existing_user(cursor, email, nickname)
                    if check_result['exists']:
                        logger.info(f"Nickname exists: {check_result['message']}")
                        return {'success': False, 'message': check_result['message']}

                    # 비밀번호 해싱
                    logger.info("Hashing password")
                    salt = bcrypt.gensalt()
                    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
                    
                    try:
                        # 사용자 등록
                        logger.info("Inserting new user")
                        cursor.execute("""
                            INSERT INTO users (email, password, nickname)
                            VALUES (%s, %s, %s)
                        """, (email, hashed_password.decode('utf-8'), nickname))
                        
                        con.commit()
                        logger.info("User created successfully")
                        return {'success': True, 'message': '회원가입이 완료되었습니다.'}
                    
                    except Exception as e:
                        con.rollback()
                        logger.error(f"Database error in create_user: {str(e)}")
                        return {'success': False, 'message': f'회원가입 처리 중 오류가 발생했습니다: {str(e)}'}

        except Exception as e:
            logger.error(f"Error in create_user: {str(e)}", exc_info=True)
            return {'success': False, 'message': f'서버 오류가 발생했습니다: {str(e)}'}

    @staticmethod
    def get_user_by_email(email):
        try:
            with get_db_connection() as con:
                with con.cursor() as cursor:
                    cursor.execute("""
                        SELECT id, email, nickname, admin, joined_date, status 
                        FROM users 
                        WHERE email = %s
                    """, (email,))
                    return cursor.fetchone()
        except Exception as e:
            logger.error(f"Error in get_user_by_email: {str(e)}", exc_info=True)
            return None

    @staticmethod
    def get_user_by_nickname(nickname):
        try:
            with get_db_connection() as con:
                with con.cursor() as cursor:
                    cursor.execute("""
                        SELECT id, email, nickname, admin, joined_date, status 
                        FROM users 
                        WHERE nickname = %s
                    """, (nickname,))
                    return cursor.fetchone()
        except Exception as e:
            logger.error(f"Error in get_user_by_nickname: {str(e)}", exc_info=True)
            return None 

    @staticmethod
    def login_user(nickname, password):
        try:
            with get_db_connection() as con:
                cursor = con.cursor()
                logger.info(f"Attempting login for nickname: {nickname}")
                
                cursor.execute("""
                    SELECT nickname, password, email, admin 
                    FROM users 
                    WHERE nickname = %s
                """, (nickname,))
                
                row = cursor.fetchone()
                logger.info(f"Query result type: {type(row)}")  # 타입 확인
                logger.info(f"Query result: {row}")
                
                if not row:
                    return {
                        'success': False,
                        'message': '존재하지 않는 아이디입니다.'
                    }
                
                # row가 dictionary인 경우
                if isinstance(row, dict):
                    stored_password = row['password'].encode('utf-8')
                    input_password = password.encode('utf-8')
                    
                    if bcrypt.checkpw(input_password, stored_password):
                        return {
                            'success': True,
                            'message': '로그인 성공',
                            'nickname': row['nickname'],
                            'email': row['email'],
                            'admin': row.get('admin', 0)
                        }
                # row가 튜플인 경우
                else:
                    stored_password = str(row[1]).encode('utf-8')
                    input_password = password.encode('utf-8')
                    
                    if bcrypt.checkpw(input_password, stored_password):
                        return {
                            'success': True,
                            'message': '로그인 성공',
                            'nickname': row[0],
                            'email': row[2],
                            'admin': row[3] if len(row) > 3 and row[3] is not None else 0
                        }
                
                return {
                    'success': False,
                    'message': '비밀번호가 일치하지 않습니다.'
                }

        except Exception as e:
            logger.error(f"Login error: {str(e)}", exc_info=True)
            logger.error(f"Row data: {row}")  # 에러 발생 시 row 데이터 출력
            return {
                'success': False,
                'message': '로그인 처리 중 오류가 발생했습니다.'
            } 