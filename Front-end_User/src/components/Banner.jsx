import { useState, useEffect } from "react";
import "../styles/_banner.scss";

import banner1 from "../assets/banner/slide-1.jpg";
import banner2 from "../assets/banner/slide-2.webp";
import banner3 from "../assets/banner/slide-3.webp";
import banner4 from "../assets/banner/slide-4.webp";

const Banner = () => {
  const images = [banner1, banner2, banner3, banner4];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev === images.length) {
        return ;
      }
      return prev + 1;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev === images.length) {
          return 0; 
        }
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="banner">
      <div
        className="slide-container"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {[...images, images[0]].map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className="slide-image"
          />
        ))}
      </div>
      <button className="arrow left-arrow" onClick={prevSlide}>
        ❮
      </button>
      <button className="arrow right-arrow" onClick={nextSlide}>
        ❯
      </button>
    </div>
  );
};

export default Banner;
