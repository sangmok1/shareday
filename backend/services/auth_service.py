from utils.db_connection import get_db_connection

class AuthService:
    @staticmethod
    def verify_code(email, code):
        try:
            with get_db_connection() as con:
                with con.cursor() as cursor:
                    cursor.execute("""
                        SELECT CASE 
                            WHEN EXISTS (
                                SELECT 1 FROM singup_email_check 
                                WHERE email = %s AND certification_code = %s
                                ORDER BY ID DESC LIMIT 1
                            ) THEN 1 ELSE 0
                        END AS result
                    """, (email, code))
                    result = cursor.fetchone()
                    return {'success': True, 'verified': bool(result['result'])}
        except Exception as e:
            return {'success': False, 'message': str(e)} 

    @staticmethod
    def check_email_verified(email):
        try:
            with get_db_connection() as con:
                with con.cursor() as cursor:
                    cursor.execute("""
                        SELECT verified 
                        FROM singup_email_check 
                        WHERE email = %s 
                        ORDER BY updated_at DESC 
                        LIMIT 1
                    """, (email,))
                    
                    result = cursor.fetchone()
                    
                    if result and result['verified']:
                        return {'verified': True}
                    return {'verified': False}

        except Exception as e:
            logger.error(f"Error in check_email_verified: {str(e)}", exc_info=True)
            return {'verified': False} 