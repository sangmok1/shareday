from flask import jsonify, request
import logging
from datetime import datetime
from pymysql.cursors import DictCursor

logger = logging.getLogger(__name__)

def init_notice_routes(app):
    @app.route('/api/notices', methods=['GET'])
    def get_notices():
        try:
            with app.db_connection() as con:
                cursor = con.cursor(DictCursor)
                logger.info("Executing SELECT query on notices table")
                
                cursor.execute("""
                    SELECT id, title, content, created_at, updated_at 
                    FROM notices 
                    WHERE status = 1
                    ORDER BY created_at DESC
                """)
                
                notices = []
                rows = cursor.fetchall()
                logger.info(f"Found {len(rows)} active notices")
                
                for i, row in enumerate(rows):
                    logger.info(f"Processing row {i}: {row}")
                    try:
                        notice = {
                            'id': row['id'],
                            'title': row['title'],
                            'content': row['content'],
                            'created_at': row['created_at'].strftime('%Y-%m-%d %H:%M:%S') if row['created_at'] else None,
                            'updated_at': row['updated_at'].strftime('%Y-%m-%d %H:%M:%S') if row['updated_at'] else None
                        }
                        notices.append(notice)
                        logger.info(f"Successfully processed row {i}")
                    except Exception as e:
                        logger.error(f"Error processing row {i}: {str(e)}", exc_info=True)
                        continue

                return jsonify({
                    'success': True,
                    'notices': notices
                })

        except Exception as e:
            logger.error(f"Error fetching notices: {str(e)}", exc_info=True)
            return jsonify({
                'success': False,
                'message': '공지사항을 불러오는 중 오류가 발생했습니다.'
            }), 500

    @app.route('/api/notices', methods=['POST'])
    def create_notice():
        logger.info("Received POST request to /api/notices")
        try:
            data = request.get_json()
            logger.info(f"Received notice data: {data}")
            
            title = data.get('title')
            content = data.get('content')
            
            if not title or not content:
                logger.warning("Missing title or content")
                return jsonify({
                    'success': False,
                    'message': '제목과 내용을 모두 입력해주세요.'
                }), 400

            with app.db_connection() as con:
                cursor = con.cursor()
                logger.info(f"Inserting notice with title: {title}")
                
                current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                cursor.execute("""
                    INSERT INTO notices (title, content, created_at, updated_at, status)
                    VALUES (%s, %s, %s, %s, 1)
                """, (title, content, current_time, current_time))
                
                notice_id = cursor.lastrowid
                con.commit()
                
                logger.info(f"Successfully created notice with id: {notice_id}")
                
                return jsonify({
                    'success': True,
                    'message': '공지사항이 등록되었습니다.',
                    'notice_id': notice_id
                }), 201

        except Exception as e:
            logger.error(f"Error creating notice: {str(e)}", exc_info=True)
            return jsonify({
                'success': False,
                'message': '공지사항 등록 중 오류가 발생했습니다.'
            }), 500

    return app