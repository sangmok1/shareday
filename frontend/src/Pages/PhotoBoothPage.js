import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import './css/photobooth.css';
import API_BASE_URL from '../api/config';

const PhotoBoothPage = () => {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBackground, setSelectedBackground] = useState('turquoise');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkLoginStatus = () => {
            const nickname = sessionStorage.getItem('nickname');
            
            if (!nickname) {
                alert('4컷 사진 기능을 사용하려면 로그인이 필요합니다.');
                navigate('/login', { replace: true });
                return;
            }
            setIsAuthenticated(true);
        };

        checkLoginStatus();
    }, [navigate]);

    const processFiles = useCallback((files) => {
        const newFiles = Array.from(files);
        const totalFiles = selectedFiles.length + newFiles.length;
        
        if (totalFiles > 4) {
            alert('최대 4장까지만 선택할 수 있습니다.');
            return;
        }

        const updatedFiles = [...selectedFiles, ...newFiles].slice(0, 4);
        setSelectedFiles(updatedFiles);

        const urls = updatedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    }, [selectedFiles]);

    const handleFileSelect = (e) => {
        processFiles(e.target.files);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        processFiles(files);
    }, [processFiles]);

    const handleSubmit = async () => {
        if (selectedFiles.length !== 4) {
            alert('정확히 4장의 사진을 선택해주세요.');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        selectedFiles.forEach((file, index) => {
            formData.append(`image${index + 1}`, file);
        });
        formData.append('background_color_option', selectedBackground);

        try {
            const response = await axios.post(`${API_BASE_URL}/create-photo-strip`, formData, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'photo_strip.png');
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            alert('4컷 사진이 생성되었습니다!');
            clearFiles();
            
        } catch (error) {
            console.error('Error creating photo strip:', error);
            alert('사진 생성 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const clearFiles = () => {
        setSelectedFiles([]);
        setPreviewUrls([]);
    };

    const removeFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newUrls = previewUrls.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setPreviewUrls(newUrls);
    };

    if (!isAuthenticated) {
        return null;
    }

    const colorOptions = [
        { id: 'turquoise', name: '청록색', color: 'rgb(95, 158, 160)' },
        { id: 'black', name: '검정', color: '#000000' },
        { id: 'white', name: '흰색', color: '#ffffff' },
        { id: 'gradient1', name: '그라데이션1', color: 'linear-gradient(45deg, #ff9a9e, #fad0c4)' },
        { id: 'gradient2', name: '그라데이션2', color: 'linear-gradient(45deg, #a8edea, #fed6e3)' },
        { id: 'gradient3', name: '그라데이션3', color: 'linear-gradient(45deg, #5ee7df, #b490ca)' },
        { id: 'pink', name: '핑크', color: '#ff69b4' },
        { id: 'purple', name: '보라', color: '#9370db' },
        { id: 'blue', name: '파랑', color: '#4169e1' }
    ];

    return (
        <div className="photobooth-container">
            <div className="content-wrapper">
                <div className="title-section">
                    <h2><FontAwesomeIcon icon={faCamera} /> 4컷 사진 만들기</h2>
                </div>

                <div className="background-selection">
                    <div className="color-selection-title">
                        <span className="palette-emoji">🎨</span>
                        <h3>배경색 선택</h3>
                    </div>
                    <div className="color-options">
                        {colorOptions.map((option) => (
                            <button
                                key={option.id}
                                className={`color-option ${selectedBackground === option.id ? 'selected' : ''}`}
                                onClick={() => setSelectedBackground(option.id)}
                                title={option.name}
                                style={{
                                    background: option.color,
                                    border: option.id === 'white' ? '1px solid #ddd' : 'none'
                                }}
                            >
                                {selectedBackground === option.id && <span className="selected-check">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="main-section">
                    <div 
                        className={`upload-section ${isDragging ? 'dragging' : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <label className="file-upload-label">
                            <FontAwesomeIcon icon={faUpload} />
                            <span>사진을 드래그하거나 클릭하여 업로드하세요 (최대 4장)</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    {previewUrls.length > 0 && (
                        <div className="preview-section">
                            <div className="section-title">
                                <h3>선택된 사진 ({previewUrls.length}/4)</h3>
                                <button className="clear-button" onClick={clearFiles}>
                                    <FontAwesomeIcon icon={faTimes} /> 초기화
                                </button>
                            </div>
                            <div className="preview-container">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="preview-item">
                                        <img 
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="preview-image"
                                        />
                                        <span className="image-number">사진 {index + 1}</span>
                                        <button 
                                            className="remove-image"
                                            onClick={() => removeFile(index)}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="action-section">
                        <button 
                            className={`create-button ${isLoading ? 'loading' : ''}`}
                            onClick={handleSubmit}
                            disabled={selectedFiles.length !== 4 || isLoading}
                        >
                            {isLoading ? '생성 중...' : '4컷 사진 만들기'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoBoothPage; 