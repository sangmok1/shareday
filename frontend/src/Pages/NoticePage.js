import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/noticepage.css';

const NoticePage = () => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/notices');
                if (response.data.success) {
                    setNotices(response.data.notices);
                } else {
                    setError('공지사항을 불러올 수 없습니다.');
                }
            } catch (error) {
                console.error('Error fetching notices:', error);
                setError('서버 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    const noticesPerPage = 20;
    const totalPages = Math.ceil(notices.length / noticesPerPage);
    const indexOfLastNotice = currentPage * noticesPerPage;
    const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
    const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleNoticeClick = (notice) => {
        setSelectedNotice(selectedNotice?.id === notice.id ? null : notice);
    };

    if (loading) return <div className="loading">로딩 중...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="notice-page">
            <div className="notice-container">
                <h2>소식/공지사항</h2>
                
                {isAdmin && (
                    <button 
                        className="notice-write-btn"
                        onClick={() => navigate('/notice/create')}
                    >
                        새 공지사항 작성
                    </button>
                )}

                <div className="notice-list">
                    {currentNotices.map((notice) => (
                        <div 
                            key={notice.id} 
                            className={`notice-item ${selectedNotice?.id === notice.id ? 'expanded' : ''}`}
                            onClick={() => handleNoticeClick(notice)}
                        >
                            <div className="notice-header">
                                <h3>{notice.title}</h3>
                                <div className="notice-date">
                                    {new Date(notice.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            {selectedNotice?.id === notice.id && (
                                <div className="notice-content">
                                    <p>{notice.content}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {notices.length > 0 && (
                    <div className="pagination">
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                className={`page-number ${currentPage === number ? 'active' : ''}`}
                                onClick={() => setCurrentPage(number)}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticePage; 