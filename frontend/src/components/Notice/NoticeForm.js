import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NoticeList.css';

const NoticeForm = () => {
    const navigate = useNavigate();
    const [newNotice, setNewNotice] = useState({
        title: '',
        content: '',
        file: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newNotice.title.trim() || !newNotice.content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            const response = await axios({
                method: 'post',
                url: '/api/notices',
                data: {
                    title: newNotice.title.trim(),
                    content: newNotice.content.trim()
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('서버 응답:', response.data);
            
            if (response.data.success) {
                alert('공지사항이 등록되었습니다.');
                navigate('/notices');
            } else {
                alert(response.data.message || '등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('공지사항 생성 에러:', error);
            alert('서버 통신 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="notice-page">
            <div className="notice-container">
                <h2>공지사항 작성</h2>
                <form className="notice-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="제목"
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                        required
                    />
                    <textarea
                        placeholder="내용"
                        value={newNotice.content}
                        onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                        required
                    />
                    <input
                        type="file"
                        onChange={(e) => setNewNotice({...newNotice, file: e.target.files[0]})}
                    />
                    <div className="notice-form-buttons">
                        <button type="submit">등록</button>
                        <button type="button" onClick={() => navigate('/notices')}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoticeForm; 