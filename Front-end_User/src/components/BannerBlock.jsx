import React from "react";

const BannerBlock = ({ imageUrl, title, description }) => {
    return (
        <div className="w-full h-[580px] relative flex items-end justify-start"> {/* Thay items-center bằng items-end */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${imageUrl})`, 
                }}
            />

            <div className="relative z-10 ml-10 md:ml-20 mb-10 text-white"> {/* Thêm mb-10 để cách lề dưới */}
                <h1 className="text-5xl  ">
                    {title}
                </h1>
                <p className="mt-2 text-3xl md:text-xl font-light">
                    {description}
                </p>
                <button className="mt-12 px-6 py-3 w-80 h-20 text-xl cursor-pointer bg-white text-black  rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                    KHÁM PHÁ NGAY
                    <span className="ml-2">→</span>
                </button>
            </div>
        </div>
    );
};

export default BannerBlock;