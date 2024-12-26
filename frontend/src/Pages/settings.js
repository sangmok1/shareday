import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import './css/setting.css';

const Setting = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    handleFiles(acceptedFiles);
  }, []);

  const handleFiles = (files) => {
    setSelectedFiles(prev => [...prev, ...files]);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    noClick: true // 클릭 비활성화
  });

  const handleFileSelect = (event) => {
    handleFiles(Array.from(event.target.files));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("업로드할 이미지를 선택해주세요!");
      return;
    }

    try {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      // 여기에 실제 백엔드 API 엔드포인트를 추가해야 합니다
      // const response = await fetch('your-backend-api/upload', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (response.ok) {
      //   alert("이미지가 성공적으로 업로드되었습니다!");
      //   setSelectedFiles([]);
      //   setPreviewUrls([]);
      // }

      // 임시로 성공 메시지 표시
      console.log("업로드할 파일:", selectedFiles);
      alert("이미지가 성공적으로 업로드되었습니다! (테스트 메시지)");
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Upload error:', error);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // 이전 URL 객체 해제
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // 컴포넌트 언마운트 시 URL 객체 정리
  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="setting-container">
      <h2 className="setting-title">The most unforgettable moment</h2>
      
      <div className="upload-area">
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <div className="plus-icon">+</div>
            <p>{isDragActive ? "이미지를 여기에 놓아주세요!" : "이미지를 여기에 드래그하세요"}</p>
          </div>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          style={{ display: 'none' }} 
          multiple 
          accept="image/*"
        />
        
        <button 
          className="file-select-button"
          onClick={() => fileInputRef.current.click()}
        >
          파일 선택하기
        </button>
      </div>

      {previewUrls.length > 0 && (
        <div className="preview-container">
          {previewUrls.map((url, index) => (
            <div key={index} className="preview-item">
              <img src={url} alt={`Preview ${index + 1}`} />
              <button 
                className="remove-button"
                onClick={() => removeFile(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button 
        className="upload-button"
        onClick={handleUpload}
        disabled={selectedFiles.length === 0}
      >
        이미지 업로드 ({selectedFiles.length}개 선택됨)
      </button>
    </div>
  );
};

export default Setting;