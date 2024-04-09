import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const observer = useRef();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          'https://pixabay.com/api/?key=43151652-7f90e29630d4aac9b9b98db43&q=slave&image_type=photo&per_page=5'
        );
        setImages(response.data.hits);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            img.setAttribute('src', src);
            observer.current.unobserve(img);
          }
        });
      },
      { rootMargin: '0px 0px 400px 0px' }
    );

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="image-gallery">
      <h6>Ваши изоображения</h6>
      <div className="gallery-container">
        {images.map((image) => (
          <img
            key={image.id}
            src={null}
            data-src={image.largeImageURL}
            alt={image.tags}
            className="gallery-item"
            ref={(element) => {
              if (element) {
                observer.current.observe(element);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
