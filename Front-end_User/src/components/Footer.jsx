const Footer = () => {
    return (
        <footer className="footer bg-black text-white text-sm">
            <div className="max-w-[90%] mx-auto py-10">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Section */}
                    <div>
                        <h5 className="text-lg font-semibold mb-2">CoolMate lắng nghe bạn!</h5>
                        <p className="text-gray-400 ">
                            Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để
                            có thể nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.
                        </p>
                    </div>

                    {/* Center Section */}
                    <div>
                        <h5 className="text-lg font-semibold mb-2">Hotline</h5>
                        <p className="text-gray-400"><i className="fas fa-phone-alt"></i> 1900.272737 - 028.7777.2737</p>
                        <p className="text-gray-400"><i className="fas fa-clock"></i> (8:30 - 22:00)</p>
                        <h5 className="mt-4 text-lg font-semibold">Email</h5>
                        <p className="text-gray-400"><i className="fas fa-envelope"></i> Cool@coolmate.me</p>
                    </div>

                    {/* Right Section */}
                    <div>
                        <ul className="flex space-x-10 text-6xl">
                            {[
                                { href: "https://web.facebook.com/coolmate.me/about", icon: "fab fa-facebook-f" },
                                { href: "https://www.instagram.com/coolmate.me/", icon: "fab fa-instagram" },
                                { href: "#", icon: "fab fa-twitter" },
                                { href: "https://www.tiktok.com/@cool.coolmate", icon: "fab fa-tiktok" },
                                { href: "https://www.youtube.com/channel/UCWw8wLlodKBtEvVt1tTAsMA", icon: "fab fa-youtube" }
                            ].map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        className="hover:text-gray-400 transition-all"
                                    >
                                        <i className={item.icon}></i>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <hr className="border-gray-700 my-6" />
            <div className="max-w-[90%] mx-auto py-8 grid md:grid-cols-5 gap-6">
                {/* 4 cột bên trái */}
                <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { title: "COOLCLUB", links: ["Đăng kí thành viên", "Ưu đãi & Đặc quyền"] },
                        { title: "CHÍNH SÁCH", links: ["Chính sách trả đổi 60 ngày", "Chính sách khuyến mãi", "Chính sách bảo mật", "Chính sách giao hàng"]},
                        { title: "CHĂM SÓC KHÁCH HÀNG", links: ["Trải nghiệm mua sắm 100% hài lòng", "Hỏi đáp - FAQs"] },
                        { title: "Tuyển dụng", links: ["Tuyển dụng", "Đăng ký bản quyền"] },
                        { title: "Về COOLMATE", links: ["Quy tắc ứng xử của Coolmate", "Coolmate 101", "DVKH xuất sắc", "Câu chuyện về Coolmate", "Nhà máy", "Care & Share","Cam kết bền vững"] },
                        { title: "COOLMATEME", links: ["Lịch sử thay đổi website"]},
                        { title: "KIẾN THỨC MẶC ĐẸP", links: ["Hướng dẫn chọn size đồ nam", "Hướng dẫn chọn size đồ nữ","Blog"] },

                    ].map((section, index) => (
                        <div key={index}>
                            <h5 className="text-lg font-semibold mb-2">{section.title}</h5>
                            <div className="space-y-2">
                                {section.links.map((link, i) => (
                                    <a key={i} href="#" className="block text-gray-400 hover:text-gray-300 transition-all">
                                        {link}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 1 cột bên phải dành cho Địa chỉ liên hệ */}
                <div className="md:col-span-1">
                    <h5 className="text-lg font-semibold mb-2">Địa chỉ liên hệ</h5>
                    <div className="space-y-2">
                        <p className="text-gray-400">🏢 Văn phòng Hà Nội: Tầng 3 Tòa nhà BMM, KM2, Đường Phùng Hưng, Hà Đông, Hà Nội</p>
                        <p className="text-gray-400">🏢 Trung tâm vận hành Hà Nội: Lô C8, KCN Lại Yên, Hoài Đức, Hà Nội</p>
                        <p className="text-gray-400">🏢 Văn phòng & Trung tâm vận hành TP. HCM: Lô C3, KCN Cát Lái, TP. Thủ Đức</p>
                    </div>
                </div>
            </div>


            <hr className="border-gray-700 my-6" />

            {/* Footer Bottom */}
            <div className="max-w-[90%] mx-auto py-4 text-center">
                <p className="text-gray-400">@ CÔNG TY TNHH FASTECH ASIA</p>
                <p className="text-gray-400">Mã số doanh nghiệp: 0108617038. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư TP Hà Nội cấp lần đầu ngày 20/02/2019.</p>
            </div>

            <hr className="border-gray-700" />
        </footer>
    );
};

export default Footer;
