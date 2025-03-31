import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Category from "../components/Category";
import HomepageBrand from "../components/HomepageBrand";
import GenderSelector from "../components/GenderSelector";
import BannerBlock from "../components/BannerBlock";
import ListProductScroll from "../components/ListProductScroll";

import imgCareAndShare from "../assets/banner/mceclip33.png";
import imgBannerFooter1 from "../assets/banner/mceclip18.webp";
import imgBannerFooter2 from "../assets/banner/mceclip19.webp";
import imgBannerFooter3 from "../assets/banner/mceclip2_81.webp";

import dailyBanner from "../assets/banner/hang-ngay-desk-chung.webp";
import runningBanner from "../assets/banner/running-desk-chung_23.webp";

const HomePage = () => {
    const [selectedGender, setSelectedGender] = useState('male');

    const handleGenderChange = (gender) => {
        setSelectedGender(gender);
    };

    const bannerData1 = {
        imageUrl: dailyBanner,
        title: "MẶC HÀNG NGÀY",
        description: "Thoải mái, thanh lịch | Nhập CM10 giảm 10% đơn từ 600K",
    };
    const bannerData2 = {
        imageUrl: runningBanner,
        title: "ĐỒ CHẠY BỘ",
        description: "Cố gắng, thoải mái! Mua combo tiết kiệm đến 30%",
    };

    return (
        <div>
            <NavBar />
            <Banner />
            <GenderSelector onGenderChange={handleGenderChange} />
            <Category selectedGender={selectedGender} />

            {/* Homepage brand */}
            <HomepageBrand />

            {/* Banner block với props imageUrl, title, description */}
            <BannerBlock
                imageUrl={bannerData1.imageUrl}
                title={bannerData1.title}
                description={bannerData1.description}
            />
             <div className="container mx-auto mt-10 flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">SẢN PHẨM MẶC HÀNG NGÀY</h2>
                <a href="#" className="text-blue-600 hover:underline">
                    Xem Thêm
                </a>
            </div>
            <ListProductScroll />
            <BannerBlock
                imageUrl={bannerData2.imageUrl}
                title={bannerData2.title}
                description={bannerData2.description}
            />
             <div className="container mx-auto mt-10 flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">ĐỒ CHẠY BỘ</h2>
                <a href="#" className="text-blue-600 hover:underline">
                    Xem Thêm
                </a>
            </div>
            <ListProductScroll />

            <img src={imgCareAndShare} className="w-[90%] mx-auto rounded-2xl cursor-pointer mt-10 mb-20" />
            {/* Thêm div mới dựa trên ảnh */}
            <div className="flex w-[90%] mx-auto p-4 bg-gray-100 rounded-2xl shadow-md mb-20">
                {/* Phần Đặc quyền dành cho 364,377 thành viên CoolClub chiếm 2/3 */}
                <div className="w-2/3 pr-4">
                    <h2 className="text-4xl p-2 font-bold text-gray-800">Đặc quyền dành cho 364,377 thành viên CoolClub</h2>
                    <div className="flex space-x-4">
                        <div className=" text-white px-2 rounded-lg flex items-center justify-center w-85 h-60">
                            <img src={imgBannerFooter1}></img>
                        </div>
                        <div className=" text-white px-2 rounded-lg flex items-center justify-center w-85 h-60">
                            <img src={imgBannerFooter2}></img>
                        </div>
                        <div className=" text-white px-2 rounded-lg flex items-center justify-center w-85 h-60">
                            <img src={imgBannerFooter3}></img>
                        </div>
                    </div>
                </div>

                {/* Phần Hoạt động gần đây chiếm 1/3 */}
                <div className="w-1/3">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">Hoạt động gần đây</h2>
                    <marquee behavior="scroll" direction="left" scrollamount="6" height="20px">
                        <p className="text-gray-700 text-2xl mb-2">rước nhận 1 phần quà siêu hấp dẫn. Thải Tường và dư lượng Bảng vừa gia nhập CoolClub! Chào mừng Trần Ngữ!</p>
                    </marquee>
                    <marquee behavior="scroll" direction="left" scrollamount="7" height="20px">
                        <p className="text-gray-700 text-2xl mb-2">rước nhận 1 phần quà siêu hấp dẫn. Thải Tường và dư lượng Bảng vừa gia nhập CoolClub! Chào mừng Trần Ngữ!</p>
                    </marquee>

                    <button className="bg-black rounded-full mx-30 my-15 text-white px-4 py-2 rounded w-70 h-15">GIA NHẬP COOLCLUB NGAY</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
