// components/HomepageBrand.jsx
import React from 'react';
import bandMenImg from '../assets/brand/active_men.webp';
import bandWomenImg from '../assets/brand/active_women.webp';

const HomepageBrand = () => {
    return (
        <div className="max-w-[90%] mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative bg-gray-100 rounded-2xl overflow-hidden group">
                    <img
                        src={bandMenImg}
                        alt="Men Wear Collection"
                        className="w-full h-[480px] object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute bottom-5 left-5 p-4 bg-opacity-30 flex items-end justify-start">
                        <div className="text-start text-white">
                            <h2 className="text-5xl font-bold w-[450px]">MEN WEAR COLLECTION</h2>
                            <p className="text-xl">Nhập CM10 giảm 10% đến từ 600K</p>
                            <button className="mt-4 text-xl w-45 h-15 px-6 py-2 bg-white text-black font-thin rounded-full hover:bg-neutral-300 transition-colors">
                                MUA NGAY
                            </button>
                        </div>
                    </div>
                </div>
                <div className="relative bg-gray-100 rounded-2xl overflow-hidden group">
                    <img
                        src={bandWomenImg}
                        alt="Women Active Collection"
                        className="w-full h-[480px] object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute bottom-5 left-5 p-4 bg-opacity-30 flex items-end justify-start">
                        <div className="text-start text-white">
                            <h2 className="text-5xl font-bold w-[450px]">WOMEN ACTIVE COLLECTION</h2>
                            <p className="text-xl">Nhập CMWMHELLO giảm 15% tối đa 100K</p>
                            <button className="mt-4 text-xl w-45 h-15 px-6 py-2 bg-white text-black rounded-full hover:bg-neutral-300 transition-colors">
                                MUA NGAY
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomepageBrand;