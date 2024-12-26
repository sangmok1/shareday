import axios from 'axios';

// 이미지 업로드 API
export const uploadImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('이미지 업로드 실패');
  }
};