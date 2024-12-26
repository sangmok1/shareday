import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import random
from datetime import datetime
from config import EMAIL_CONFIG
from utils.db_connection import get_db_connection
import logging
import threading

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    def send_verification_email(email):
        try:
            logger.debug(f"Starting email verification process for: {email}")
            
            with get_db_connection() as con:
                with con.cursor() as cursor:
                    # 이메일 발송 횟수 확인
                    query = "SELECT MAX(transmission_count) AS transmission_count FROM singup_email_check WHERE email = %s"
                    cursor.execute(query, (email,))
                    result = cursor.fetchone()
                    
                    count = result['transmission_count'] if result and result['transmission_count'] else 0

                    if count >= 11:
                        return {'success': False, 'message': '최대 발송 횟수를 초과했습니다.'}

                    # 먼저 DB에 저장하고 응답
                    certification_code = str(random.randint(1000, 9999))
                    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                    if count > 0:
                        cursor.execute("""
                            UPDATE singup_email_check
                            SET transmission_count = transmission_count + 1,
                                updated_at = %s,
                                certification_code = %s
                            WHERE email = %s
                        """, (now, certification_code, email))
                    else:
                        cursor.execute("""
                            INSERT INTO singup_email_check 
                            (email, certification_code, created_at, updated_at, transmission_count)
                            VALUES (%s, %s, %s, %s, 1)
                        """, (email, certification_code, now, now))
                    
                    con.commit()

                    # 이메일 발송은 백그라운드에서 처리
                    threading.Thread(target=EmailService._send_email, 
                                  args=(email, certification_code)).start()

                    return {'success': True, 'message': '인증 코드가 발송중입니다. 잠시만 기다려주세요.'}

        except Exception as e:
            logger.error(f"Error in send_verification_email: {str(e)}", exc_info=True)
            return {'success': False, 'message': str(e)}

    @staticmethod
    def _send_email(email, certification_code):
        try:
            # 기존의 이메일 발송 코드를 여기로 이동
            smtp = smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port'])
            smtp.starttls()
            smtp.login(EMAIL_CONFIG['mail_id'], EMAIL_CONFIG['mail_app_pw'])

            msg = MIMEMultipart('alternative')
            msg['Subject'] = 'Luckiviky 이메일 인증'
            msg['From'] = EMAIL_CONFIG['mail_id']
            msg['To'] = email
            
            # HTML 이메일 템플릿
            email_body = f'''<!DOCTYPE html>
                            <html>
                                <head></head>
                                <body>
                                    <div style="width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
                                        <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd;">
                                            <h1 style="color: #2e6c80;">이메일 인증</h1>
                                            <br><p>회원가입을 위한 이메일 인증을 요청하셨습니다. 
                                            <br>이 요청을 승인하시려면 아래 4자리 코드를 입력하시기 바랍니다.</p>
                                            <h2>{certification_code}</h2>
                                            <p>인증 코드는 30분간 유효합니다. 이 코드를 공유하지 마시기 바랍니다.</p>
                                            <br><p>요청한 적이 없는 작업이라면 https://www.luckiviky.com/support 로 즉시 문의 주시기 바랍니다.</p>
                                            <br><p>감사합니다.</p>
                                        </div>
                                        <div style="background-color: #f8f8f8; padding: 10px; text-align: center; font-size: 12px; color: #777;">
                                            © 2024 luckiviky. 모든 권리 보유.
                                        </div>
                                    </div>
                                </body>
                            </html>
                        '''
                
            msg.attach(MIMEText(email_body, 'html'))
            smtp.send_message(msg)
            smtp.quit()

        except Exception as e:
            logger.error(f"Error in _send_email: {str(e)}", exc_info=True)