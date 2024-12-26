// src/pages/CalendarPage.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './css/calendarpage.css';

const CalendarPage = () => {
    const [date, setDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    // const [setSelectedDate] = useState(null);
    const [eventText, setEventText] = useState('');

    const onChange = (newDate) => {
        setDate(newDate);
        // setSelectedDate(newDate);
        setShowModal(true);
    };
    
    const handleSaveEvent = () => {
        setShowModal(false);
        setEventText('');
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={onChange}
                value={date}
                className="custom-calendar"
                locale="ko-KR"
                formatDay={(date) => date.toLocaleString('en', {day: 'numeric'})}
            />

            {showModal && (
                <div className="event-modal">
                    <div className="event-modal-content">
                        <h3>일정 추가</h3>
                        <input
                            type="text"
                            value={eventText}
                            onChange={(e) => setEventText(e.target.value)}
                            placeholder="일정을 입력하세요"
                        />
                        <div className="event-modal-buttons">
                            <button onClick={handleSaveEvent}>저장</button>
                            <button onClick={() => setShowModal(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;