import pymysql
# CORS 설정
CORS_CONFIG = {
    r"/api/*": {
        "origins": "http://localhost:3000",
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
}

# 파일 업로드 설정
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'} 

# Database 설정
DB_CONFIG = {
    'host': '43.203.225.97',
    'user': 'sangmok',
    'password': 'wwqq1551',
    'database': 'luckyviki',
    'cursorclass': pymysql.cursors.DictCursor 
}

# Email 설정
EMAIL_CONFIG = {
    'mail_id': "da2ter.noreply@gmail.com",
    'mail_app_pw': "awnvbfnyywlscicg",
    'admin_id': "tkdahr1551@naver.com",
    'smtp_server': "smtp.gmail.com",
    'smtp_port': 587
}