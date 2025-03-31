import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Category from "../components/Category";
import HomepageBrand from "../components/HomepageBrand";
import GenderSelector from "../components/GenderSelector";
import BannerBlock from "../components/BannerBlock";
import ListProductScoll from "../components/ListProductScroll";

import videoBanner from "../assets/banner/COOLMATE_TVC_MASTER_2.mp4";
import imgannerYoga from "../assets/banner/banner-yoga.webp";
import imgbannerRunning from "../assets/banner/banner-running-collection.webp";
import imgbannerSportswear from "../assets/banner/banner-sportswear.webp";

import imgMix1 from "../assets/banner/mix-and-match-1.webp";
import imgMix2 from "../assets/banner/mix-and-match-2.webp";
import imgMix3 from "../assets/banner/mix-and-match-3.webp";
import imgMix4 from "../assets/banner/mix-and-match-4.webp";
import imgCongNgheVai from "../assets/banner/cong-nghe-vai-noi-bat.png";
import imgDaiSu1 from "../assets/banner/dai-su-1.png";
import imgDaiSu2 from "../assets/banner/dai-su-2.png";
import imgDaiSu3 from "../assets/banner/dai-su-3.png";
import imgDaiSu4 from "../assets/banner/dai-su-4.png";
import imgCongDong1 from "../assets/banner/coolmate-congdong.png";
import imgCongDong2 from "../assets/banner/coolmate-congdong-1.png";
import imgCongDong3 from "../assets/banner/coolmate-congdong-2.png";

const NuNavBarPage = () => {

    const bannerYoga = {
        imageUrl: imgannerYoga,
        title: "YOGA COLLECTION",
        description: "Sự thoải mái và mềm mại tối đa để bạn cảm nhận trọn vẹn từng chuyển động và hơi thở.",
    };
    const bannerRunning = {
        imageUrl: imgbannerRunning,
        title: "RUNNING COLLECTON",
        description: "Để mỗi bước chạy đều là niềm vui, để hành trình nào cũng là hành trình tốt hơn mỗi ngày.",
    };
    const bannerSportswear = {
        imageUrl: imgbannerSportswear,
        title: "SPORTSWEAR COLLECTION",
        description: "Linh hoạt, thoải mái cho mọi chuyển động, đồng hành cùng bạn ở mọi môn thể thao.",
    };
    const mixAndMatch = [
        { image: imgMix1 },
        { image: imgMix2 },
        { image: imgMix3 },
        { image: imgMix4 },
    ]
    const daiSu = [
        { image: imgDaiSu1 },
        { image: imgDaiSu2 },
        { image: imgDaiSu3 },
        { image: imgDaiSu4 },
    ]
    const congDong = [
        { image: imgCongDong1 },
        { image: imgCongDong2 },
        { image: imgCongDong3 },
    ]
    return (
        <div>
            <NavBar />
            {/* video banner */}

            <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden relative">
                <video
                    src={videoBanner}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Category */}
            <div className="flex justify-center w-full bg-neutral-100 mb-12 pt-8">
                <div className="w-full max-w-7xl">
                    <Category selectedGender={"female"} />
                </div>
            </div>
            <h2 className="max-w-[90%] mx-auto text-4xl font-semibold mb-3">KHÁM PHÁ</h2>
            <ListProductScoll />

            {/*  */}
            <BannerBlock
                imageUrl={bannerYoga.imageUrl}
                title={bannerYoga.title}
                description={bannerYoga.description}
            />
            <h2 className="max-w-[90%] mt-10 mx-auto text-4xl font-semibold mb-3">FEEL NOTHING TO FEEL EVERYTHING</h2>
            <ListProductScoll />


            {/*  */}
            <BannerBlock
                imageUrl={bannerRunning.imageUrl}
                title={bannerRunning.title}
                description={bannerRunning.description}
            />
            <h2 className="max-w-[90%] mt-10 mx-auto text-4xl font-semibold mb-3">ENJOY YOUR RUN</h2>
            <ListProductScoll />

            {/*  */}
            <BannerBlock
                imageUrl={bannerSportswear.imageUrl}
                title={bannerSportswear.title}
                description={bannerSportswear.description}
            />
            <h2 className="max-w-[90%] mt-10 mx-auto text-4xl font-semibold mb-3">MOVE MORE, MOVE BETTER</h2>
            <ListProductScoll />

            {/*  */}
            <h2 className="max-w-[90%] mt-20 mx-auto text-4xl font-semibold mb-3">MIX AND MATCH</h2>
            <div className=" max-w-[90%] mx-auto grid grid-cols-4 gap-8 mb-20">
                {mixAndMatch.map((mix, index) => (
                    <div
                        key={index}
                        className="cursor-pointer relative bg-white rounded-lg flex flex-col items-center"
                    >
                        <img src={mix.image} className=" w-full rounded-md" />
                        <button className="w-37 h-13 text-lg absolute left-5  bottom-4  mt-4 bg-white  border-black text-black px-4 py-2 rounded-full  hover:bg-gray-200">
                            MUA NGAY
                        </button>
                    </div>
                ))}
            </div>

            {/*  */}
            <div className="max-w-[90%] mx-auto w-full h-150 rounded-2xl  bg-gray-200 mb-20">

            </div>


            <h2 className="max-w-[90%] mt-20 mx-auto text-4xl font-semibold mb-3">CÔNG NGHỆ VẢI NỔI BẬT</h2>
            <img src={imgCongNgheVai} className="max-w-[90%] mx-auto mb-10"></img>

            <h2 className="max-w-[90%] mt-20 mx-auto text-4xl font-semibold mb-3">GẶP NHỮNG ĐẠI SỨ CỦA CHÚNG TÔI</h2>
            <div className=" max-w-[90%] mx-auto overflow-x-auto flex mx-aut gap-5 mb-20 ">
                {daiSu.map((daisu, index) => (
                    <div
                        key={index}
                        className=" bg-white rounded-lg flex flex-col items-center"
                    >
                        <img src={daisu.image} className=" w-full rounded-md" />

                    </div>
                ))}
            </div>

            <div className="w-full bg-neutral-200 h-150">
                <h2 className="w-105 mx-auto pt-20 text-3xl font-bold">COOLMATE VÀ CỘNG ĐỒNG</h2>
                <div className=" max-w-[95%] mx-auto flex mx-auto gap-5 mb-20 mt-10   ">
                {congDong.map((congdong, index) => (
                    <div
                        key={index}
                        className=" rounded-3xl overflow-hidden "
                    >
                        <img src={congdong.image} className=" w-full object-cover hover:scale-105 duration-500"  />

                    </div>
                ))}
            </div>

            </div>
            <Footer />
        </div>
    );
};

export default NuNavBarPage;
