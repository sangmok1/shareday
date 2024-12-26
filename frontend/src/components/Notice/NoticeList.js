import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './NoticeList.css';

const NoticeList = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

    const noticesPerPage = 20;

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
                setError('서버 오류가 발생했습니다.');
                console.error('Error fetching notices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    const totalPages = Math.ceil(notices.length / noticesPerPage);
    const indexOfLastNotice = currentPage * noticesPerPage;
    const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
    const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            {/* 이 부분에 페이지네이션 컴포넌트를 추가할 수 있습니다. */}
        </div>
    );
};

export default NoticeList;