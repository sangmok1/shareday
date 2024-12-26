from .notice_routes import init_notice_routes

def init_routes(app):
    """Initialize all routes"""
    init_notice_routes(app)
    return app

__all__ = ['init_routes']