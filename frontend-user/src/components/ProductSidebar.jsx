// src/components/ProductSidebar.js - Phiên bản mới

import React, { useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Panel } from 'primereact/panel';

const ProductSidebar = ({ onFilterChange }) => {
    // State cho các bộ lọc
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedTech, setSelectedTech] = useState([]);

    // Dữ liệu mẫu cho bộ lọc (bạn có thể lấy từ API)
    const categories = [
        { name: 'Áo', key: 'ao' },
        { name: 'Quần', key: 'quan' },
        { name: 'Quần lót', key: 'quan-lot' },
        { name: 'Phụ kiện', key: 'phu-kien' }
    ];
    
    const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

    const colors = [
        { name: 'Phối màu', value: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)', key: 'multi' },
        { name: 'Đen', value: '#000000', key: 'black' },
        { name: 'Xám', value: '#808080', key: 'gray' },
        { name: 'Trắng', value: '#FFFFFF', key: 'white' },
        { name: 'Xanh lam', value: '#0000FF', key: 'blue' },
        { name: 'Xanh lá', value: '#008000', key: 'green' },
        { name: 'Xanh ngọc', value: '#40E0D0', key: 'turquoise' },
        { name: 'Đỏ', value: '#FF0000', key: 'red' },
        { name: 'Cam', value: '#FFA500', key: 'orange' },
        { name: 'Vàng', value: '#FFFF00', key: 'yellow' },
        { name: 'Tím', value: '#800080', key: 'purple' },
        { name: 'Nâu', value: '#A52A2A', key: 'brown' },
        { name: 'Hồng', value: '#FFC0CB', key: 'pink' },
        { name: 'Xanh đậm', value: '#00008B', key: 'darkblue' },
        { name: 'Đen xám', value: '#36454F', key: 'charcoalgray' },
    ];
    
    const technologies = [
        { name: '4-Way Stretch', key: '4way' },
        { name: 'Chafe Free', key: 'chafe' },
        { name: 'Exdry', key: 'exdry' },
        { name: 'Logo phản quang', key: 'logo' },
        { name: 'Seamless', key: 'seamless' },
        { name: 'Ultralight', key: 'ultralight' },
    ];
    
    // Template cho header của Panel để có icon expand/collapse
    const filterTemplate = (options) => {
        const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
        return (
            <div className="flex items-center justify-between cursor-pointer" onClick={options.onTogglerClick}>
                <span className="font-semibold text-lg">{options.props.header}</span>
                <button className={options.togglerClassName}>
                    <span className={toggleIcon}></span>
                </button>
            </div>
        );
    };

    // Hàm chung để cập nhật bộ lọc và gửi lên component cha
    const updateFilters = (newFilters) => {
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };
    
    return (
        <div className="w-full md:w-64 space-y-4">
            {/* Loại sản phẩm - Dùng RadioButton */}
            <Panel header="Loại sản phẩm" toggleable headerTemplate={filterTemplate}>
                <div className="flex flex-col gap-4 mt-2">
                    {categories.map((category) => (
                        <div key={category.key} className="flex items-center">
                            <RadioButton 
                                inputId={category.key} 
                                name="category" 
                                value={category} 
                                onChange={(e) => {
                                    setSelectedCategory(e.value);
                                    updateFilters({ category: e.value.key, size: selectedSize, color: selectedColor?.key });
                                }} 
                                checked={selectedCategory?.key === category.key} 
                            />
                            <label htmlFor={category.key} className="ml-2 text-base cursor-pointer">{category.name}</label>
                        </div>
                    ))}
                </div>
            </Panel>

            {/* Kích cỡ - Dùng Button */}
            <Panel header="Kích cỡ" toggleable headerTemplate={filterTemplate}>
                <div className="flex flex-wrap gap-2 mt-2">
                    {sizes.map(size => (
                        <button 
                            key={size} 
                            onClick={() => {
                                const newSize = selectedSize === size ? null : size;
                                setSelectedSize(newSize);
                                updateFilters({ category: selectedCategory?.key, size: newSize, color: selectedColor?.key });
                            }}
                            className={`p-2 border rounded w-16 h-12 text-center transition-colors duration-200 
                                ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black hover:border-black'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </Panel>

            {/* Màu sắc - Dùng div tròn */}
            <Panel header="Màu sắc" toggleable headerTemplate={filterTemplate}>
                <div className="grid grid-cols-4 gap-y-4 gap-x-2 mt-2">
                    {colors.map(color => (
                        <div 
                            key={color.key} 
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => {
                                const newColor = selectedColor?.key === color.key ? null : color;
                                setSelectedColor(newColor);
                                updateFilters({ category: selectedCategory?.key, size: selectedSize, color: newColor?.key });
                            }}
                        >
                            <div 
                                className={`w-8 h-8 rounded-full border-2 p-0.5 
                                    ${selectedColor?.key === color.key ? 'border-blue-500' : 'border-transparent'}`}
                            >
                                <div 
                                    className="w-full h-full rounded-full border border-gray-300" 
                                    style={{ background: color.value }}
                                ></div>
                            </div>
                            <span className="text-xs mt-1 text-center">{color.name}</span>
                        </div>
                    ))}
                </div>
            </Panel>

            {/* Công nghệ - Dùng Checkbox */}
            <Panel header="Công nghệ" toggleable collapsed headerTemplate={filterTemplate}>
                 <div className="flex flex-col gap-3 mt-2">
                    {technologies.map((tech) => (
                        <div key={tech.key} className="flex items-center">
                            <RadioButton inputId={tech.key} name="tech" value={tech.key} />
                            <label htmlFor={tech.key} className="ml-2">{tech.name}</label>
                        </div>
                    ))}
                </div>
            </Panel>
            
            {/* Giới tính - Dùng RadioButton */}
            <Panel header="Giới tính" toggleable collapsed headerTemplate={filterTemplate}>
                 <div className="flex flex-col gap-4 mt-2">
                    <div className="flex items-center">
                        <RadioButton inputId="gt_nam" name="gender" value="nam" />
                        <label htmlFor="gt_nam" className="ml-2 text-base">Nam</label>
                    </div>
                     <div className="flex items-center">
                        <RadioButton inputId="gt_nu" name="gender" value="nu" />
                        <label htmlFor="gt_nu" className="ml-2 text-base">Nữ</label>
                    </div>
                </div>
            </Panel>
        </div>
    );
};

export default ProductSidebar;