import sys
import os

# 프로젝트 루트 디렉토리를 Python 경로에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from migrations.create_tables import create_tables

def init_database():
    print("Initializing database...")
    create_tables()
    print("Database initialization completed!")

if __name__ == "__main__":
    init_database() 