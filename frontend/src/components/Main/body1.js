import React, { useState } from 'react';
import './body.css';
import img1 from '../../assets/images/main_img1.png';
import img2 from '../../assets/images/main_img2.png';
import img3 from '../../assets/images/main_img3.png';
import img4 from '../../assets/images/main_img4.png';

const images = [img1, img2, img3, img4];

const Body1 = () => {
    const [currentIndex] = useState(0);

    const visibleImages = [
        images[(currentIndex + 3) % images.length],
        images[(currentIndex + 2) % images.length],
        images[(currentIndex + 1) % images.length],
        images[currentIndex % images.length]
    ];

    return (
        <>
            <section className="play-now">
                <div className="play-now-font"><p><b>Record It Now!</b></p></div>
            
            </section>
            <section className="contents">
                <div className="content-slider">
                    <div className="slider-item">
                        <h3>특별한 순간을 채워보세요!</h3>
                    </div>

                    <div className="slider-images">
                        {/* 고정된 반투명 이미지 */}
                        <div className="static-images">
                            {images.map((image, index) => (
                                <img 
                                    key={`static-${index}`} 
                                    src={image} 
                                    alt={`Static ${index}`}
                                />
                            ))}
                        </div>
                        
                        {/* 애니메이션 이미지 - 역순으로 렌더링 */}
                        {visibleImages.reverse().map((image, index) => (
                            <img 
                                key={index} 
                                src={image} 
                                alt={`Slide ${index}`} 
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Body1;