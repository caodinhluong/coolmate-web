import React, { useState, useEffect } from 'react';

import aoThun from '../assets/category/ao-thun.webp';
import aoSoMi from '../assets/category/ao-so-mi.webp';
import aoKhoac from '../assets/category/ao-khoac.webp';
import quanDai from '../assets/category/quan-dai.webp';
import quanShort from '../assets/category/quan-short.webp';
import quanLot from '../assets/category/quan-lot.webp';
import phuKien from '../assets/category/phu-kien.webp';

// Import ảnh cho categoriesGirl
import braLegging from '../assets/category/bra-legging.webp';
import aoTheThaoNu from '../assets/category/ao-the-thao-nu.webp';
import quanTheThaoNu from '../assets/category/quan-the-thao-nu.webp';
import phuKienNu from '../assets/category/phu-kien-nu.webp';
const Category = ({ selectedGender }) => {

    const categoriesBoy = [
        { name: 'ÁO THUN', image: aoThun },
        { name: 'SƠ MI', image: aoSoMi },
        { name: 'ÁO KHOÁC', image: aoKhoac },
        { name: 'QUẦN DÀI', image: quanDai },
        { name: 'QUẦN SHORT', image: quanShort },
        { name: 'QUẦN LÓT', image: quanLot },
        { name: 'PHỤ KIỆN', image: phuKien },
    ];

    const categoriesGirl = [
        { image: braLegging, name: 'BRA & LEGGING' },
        { image: aoTheThaoNu, name: 'ÁO THỂ THAO' },
        { image: quanTheThaoNu, name: 'QUẦN THỂ THAO' },
        { image: phuKienNu, name: 'PHỤ KIỆN' },
    ];

    const [categories, setCategories] = useState(categoriesBoy);

    useEffect(() => {
        if (selectedGender === 'female') {
            setCategories(categoriesGirl);
        } else {
            setCategories(categoriesBoy);
        }
    }, [selectedGender]);

    return (
        <div className="max-w-[90%] mx-auto py-8">
            <div className="flex overflow-x-auto space-x-4 no-scrollbar">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="flex flex-col cursor-pointer hover:text-blue-500 items-center min-w-[150px] md:min-w-[200px] lg:min-w-[270px] p-0.5 rounded-2xl overflow-hidden"
                    >
                        <div className="w-full h-90 overflow-hidden rounded-xl">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover rounded-xl hover:scale-108 transition-transform duration-700 ease-in-out"
                            />
                        </div>
                        <h3 className="mt-3 text-sm md:text-lg font-bold text-black text-center">
                            {category.name}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
