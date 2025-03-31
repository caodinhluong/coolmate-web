import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Category from "../components/Category";
import HomepageBrand from "../components/HomepageBrand";
import GenderSelector from "../components/GenderSelector";
import BannerBlock from "../components/BannerBlock";
import ListProductScroll from "../components/ListProductScroll";

import { Star } from "lucide-react";

import imgbannerMacHangNgay from "../assets/banner/banner-mac-hang-ngay.webp";
import imgbannerDoChayBo from "../assets/banner/banner-do-chay-bo.webp";
import imgbannerQuanLot from "../assets/banner/banner-quan-lot.webp";


import imgAllSpFooter from "../assets/banner/banner-all-san-pham.webp"
import imgMacHangNgayFooter from "../assets/banner/mceclip0_55.webp"
import imgDoTheThaoFooter from "../assets/banner/mceclip1_30.webp"
import imgPhuKienFooter from "../assets/banner/mceclip1_27.webp"

const NamNavBarPage = () => {


    const bannerMacHangNgay = {
        imageUrl: imgbannerMacHangNgay,
        title: "MẶC HẰNG NGÀY",
        description: "Thoải mái, thanh lịch | Nhập CM10 giảm 10% đơn từ 600K",
    };
    const bannerDoChayBo = {
        imageUrl: imgbannerDoChayBo,
        title: "ĐỒ CHẠY BỘ",
        description: "Co giãn, thoáng khí | Mua combo tiết kiệm đến 30%",
    };
    const bannerQuanLot = {
        imageUrl: imgbannerQuanLot,
        title: "QUẦN LÓT",
        description: "Thoải mái, dễ chịu | Freeship mọi đơn hàng",
    };
    const bannerFooter = [
        {image:imgAllSpFooter},
        {image:imgMacHangNgayFooter},
        {image:imgDoTheThaoFooter},
        {image:imgPhuKienFooter},
    ]
    return (
        <div>
            <NavBar />
            <Banner />
            <div className="w-full h-120 bg-gray-100 ">
                <Category selectedGender={"male"} />
            </div>
            <div className="flex items-center justify-between w-full max-w-[90%] mx-auto mt-15 mb-5">
                <div className=" flex">
                    <button className="w-50 h-13 text-xl flex items-center gap-2 px-4 py-2 text-white bg-black rounded-full">
                        Sản phẩm mới <Star size={16} fill="white" />
                    </button>
                    <button className="w-50 h-13 text-xl px-4 py-2 text-black border border-black rounded-full">
                        Bán chạy nhất
                    </button>
                </div>


                <button className="text-black text-xl underline">Xem Thêm</button>
            </div>
            <ListProductScroll />

            <BannerBlock
                imageUrl={bannerMacHangNgay.imageUrl}
                title={bannerMacHangNgay.title}
                description={bannerMacHangNgay.description}
            />
            <div className="flex items-center justify-between w-full max-w-[90%] mx-auto mt-15 mb-5">
                <div className=" flex">
                    <h2 className="text-3xl font-semibold">SẢN PHẨM MẶC HẰNG NGÀY</h2>
                </div>
                <button className="text-black text-xl underline">Xem Thêm</button>
            </div>
            <ListProductScroll />


            <BannerBlock
                imageUrl={bannerDoChayBo.imageUrl}
                title={bannerDoChayBo.title}
                description={bannerDoChayBo.description}
            />
             <div className="flex items-center justify-between w-full max-w-[90%] mx-auto mt-15 mb-5">
                <div className=" flex">
                    <h2 className="text-3xl font-semibold">SẢN PHẨM CHẠY BỘ</h2>
                </div>
                <button className="text-black text-xl underline">Xem Thêm</button>
            </div>
            <ListProductScroll />


            <BannerBlock
                imageUrl={bannerQuanLot.imageUrl}
                title={bannerQuanLot.title}
                description={bannerQuanLot.description}
            />
             <div className="flex items-center justify-between w-full max-w-[90%] mx-auto mt-15 mb-5">
                <div className=" flex">
                    <h2 className="text-3xl font-semibold">SẢN PHẨM QUẦN LÓT NAM</h2>
                </div>
                <button className="text-black text-xl underline">Xem Thêm</button>
            </div>
            <ListProductScroll />

            <div className=" max-w-[90%] mx-auto flex gap-5 mb-20 ">
                {bannerFooter.map((a, index) => (
                    <div
                        key={index}
                        className=" bg-white  rounded-lg flex flex-col items-center"
                    >
                        <img src={a.image} className=" w-100" />
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default NamNavBarPage;
