// src/components/ProductReviews.js

import React, { useState, useEffect } from 'react';
import { Rating } from 'primereact/rating';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { Checkbox } from 'primereact/checkbox';
// ... các import khác

const ProductReviews = ({ productId }) => {
    // ... (toàn bộ state và logic của bạn giữ nguyên)
    const mockReviews = [
        { id: 1, user: { name: 'Nguyễn Văn A', avatar: '/avt/avt1.jpg' }, rating: 5, comment: 'Sản phẩm rất tốt, vải mát, form đẹp. Sẽ ủng hộ shop tiếp!', date: '2024-05-20', images: ['/product/ao-so-mi-dai-tay-co-tau-peimium-poplin-4.webp', '/product/ao-so-mi-dai-tay-co-tau-peimium-poplin-3.webp'] },
        { id: 2, user: { name: 'Trần Thị B', avatar: '/avt/avt2.jpg' }, rating: 4, comment: 'Áo đẹp, nhưng giao hàng hơi chậm một chút. Vẫn cho 4 sao.', date: '2024-05-18' },
        { id: 3, user: { name: 'Lê Minh C', avatar: '/avt/av3.jpg' }, rating: 5, comment: 'Chất lượng tuyệt vời, không có gì để chê!', date: '2024-05-15' },
    ];
    
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingCounts, setRatingCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    const [sortOrder, setSortOrder] = useState(null);
    const [ratingFilter, setRatingFilter] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);

    const sortOptions = [
        { label: 'Mới nhất', value: 'newest' },
        { label: 'Cũ nhất', value: 'oldest' },
        { label: 'Đánh giá cao', value: 'highest' },
        { label: 'Đánh giá thấp', value: 'lowest' },
    ];

    useEffect(() => {
        setTimeout(() => {
            setReviews(mockReviews);
            setFilteredReviews(mockReviews);
            calculateStats(mockReviews);
            setLoading(false);
        }, 1000);
    }, [productId]);

    const calculateStats = (data) => {
        if (!data || data.length === 0) return;
        const totalRating = data.reduce((acc, review) => acc + review.rating, 0);
        setAverageRating(totalRating / data.length);
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        data.forEach(review => {
            counts[review.rating]++;
        });
        setRatingCounts(counts);
    };

    useEffect(() => {
        let tempReviews = [...reviews];
        if (ratingFilter.length > 0) {
            tempReviews = tempReviews.filter(r => ratingFilter.includes(r.rating));
        }
        if (searchTerm) {
            tempReviews = tempReviews.filter(r => 
                r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (sortOrder) {
            tempReviews.sort((a, b) => {
                switch(sortOrder) {
                    case 'newest': return new Date(b.date) - new Date(a.date);
                    case 'oldest': return new Date(a.date) - new Date(b.date);
                    case 'highest': return b.rating - a.rating;
                    case 'lowest': return a.rating - b.rating;
                    default: return 0;
                }
            });
        }
        setFilteredReviews(tempReviews);
        setFirst(0);
    }, [ratingFilter, sortOrder, searchTerm, reviews]);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const handleRatingFilterChange = (e) => {
        let _selectedCategories = [...ratingFilter];
        if (e.checked) {
            _selectedCategories.push(e.value);
        } else {
            _selectedCategories = _selectedCategories.filter(category => category !== e.value);
        }
        setRatingFilter(_selectedCategories);
    };

    const paginatedReviews = filteredReviews.slice(first, first + rows);

    return (
        <div className="max-w-[80%] mx-auto px-4 py-8">
            <h3 className="text-5xl font-bold mb-6">ĐÁNH GIÁ SẢN PHẨM</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cột trái: Thống kê và bộ lọc */}
                <div className="md:col-span-1">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-7xl font-bold">{reviews.length > 0 ? averageRating.toFixed(1) : '0'}</span>
                        <div className="flex flex-col">
                            <Rating value={averageRating} readOnly cancel={false} stars={5} />
                            <span>Dựa trên {reviews.length} đánh giá</span>
                        </div>
                    </div>
                    
                    <h4 className="font-semibold mb-2 text-gray-600">Phân loại xếp hạng</h4>
                    <div className="space-y-2">
                        {/* ====================================================== */}
                        {/* ==========> SỬA LẠI PHẦN NÀY <========== */}
                        {/* ====================================================== */}
                        {[5, 4, 3, 2, 1].map(star => (
                             <div key={star} className="flex items-center">
                                <Checkbox 
                                    inputId={`star${star}`} 
                                    name="rating" 
                                    value={star} 
                                    onChange={handleRatingFilterChange} 
                                    checked={ratingFilter.includes(star)} 
                                />
                                <label htmlFor={`star${star}`} className="ml-3 flex items-center cursor-pointer gap-2">
                                    {/* Sử dụng Rating component để hiển thị đúng số sao */}
                                    <Rating 
                                        value={star} 
                                        readOnly 
                                        cancel={false} 
                                        stars={5} // Tổng số sao luôn là 5
                                    />
                                    <span className="text-gray-600">({ratingCounts[star]})</span>
                                </label>
                            </div>
                        ))}
                    </div>
                     <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                        <i className="pi pi-check-circle mr-2"></i>
                        Các review đều đến từ khách hàng đã thực sự mua hàng của Coolmate
                    </div>
                </div>

                {/* ... (phần cột phải giữ nguyên) ... */}
                 <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <span className="p-input-icon-left w-full max-w-xs">
                            <i className="pi pi-search" />
                            <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm kiếm đánh giá" className="w-full rounded-full" />
                        </span>
                        <Dropdown value={sortOrder} options={sortOptions} onChange={(e) => setSortOrder(e.value)} placeholder="Sắp xếp" className="rounded-full" />
                    </div>

                    {loading && <p>Đang tải đánh giá...</p>}

                    {!loading && filteredReviews.length === 0 && (
                        <div className="text-center py-10">
                            <p className="font-semibold">Chưa có đánh giá</p>
                            <p>Hãy mua và đánh giá sản phẩm này nhé!</p>
                        </div>
                    )}
                    
                    {!loading && paginatedReviews.map(review => (
                        <div key={review.id} className="border-b py-4">
                            <div className="flex items-center mb-2">
                                <img src={review.user.avatar} alt={review.user.name} className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <p className="font-semibold">{review.user.name}</p>
                                    <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                            <Rating value={review.rating} readOnly cancel={false} className="mb-2" />
                            <p>{review.comment}</p>
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                    {review.images.map((img, idx) => (
                                        <img key={idx} src={img} alt="review" className="w-20 h-20 object-cover rounded" />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredReviews.length > rows && (
                        <Paginator first={first} rows={rows} totalRecords={filteredReviews.length} onPageChange={onPageChange} className="mt-4" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;