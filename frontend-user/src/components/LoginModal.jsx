import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IoClose } from 'react-icons/io5';
import '../styles/_login_modal.scss';
import { motion, AnimatePresence } from 'framer-motion';

const LoginModal = ({ isOpen, onClose }) => {
    const modalVariants = {
        hidden: {
            y: '100vh',
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20,
                duration: 0.5,
            },
        },
        exit: {
            y: '-100vh',
            opacity: 0,
            transition: {
                duration: 0.4,
            },
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <motion.div
                        className="login-modal-overlay"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    ></motion.div>

                    <motion.div
                        className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-[80vh] max-h-[80vh] h-full"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <button
                            className="absolute -top-4 -right-4 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
                            onClick={onClose}
                        >
                            <IoClose className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold text-blue-600">COOL CLUB</h2>
                        </div>

                        <h3 className="text-center text-lg font-semibold mb-4">
                            Rất nhiều đặc quyền và quyền lợi mua sắm đang chờ bạn
                        </h3>

                        <div className="flex justify-center gap-4 mb-4">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                                <i className="pi pi-percentage"></i> Voucher ưu đãi
                            </button>
                            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                                <i className="pi pi-gift"></i> Quà tặng độc quyền
                            </button>
                            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                                <i className="pi pi-wallet"></i> Hoàn tiền Coolcash
                            </button>
                        </div>

                        <div className="flex justify-center gap-4 mb-4">
                            <Button
                                icon="pi pi-google"
                                className="p-button-rounded p-button-outlined flex items-center gap-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                                label="Google"
                            />
                            <Button
                                icon="pi pi-facebook"
                                className="p-button-rounded p-button-outlined flex items-center gap-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                                label="Facebook"
                            />
                        </div>

                        <div className="flex items-center justify-center mb-4">
                            <span className="border-t w-1/4 border-gray-300"></span>
                            <span className="mx-2 text-gray-500">Hoặc đăng nhập tài khoản:</span>
                            <span className="border-t w-1/4 border-gray-300"></span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <InputText
                                    id="email"
                                    placeholder="Email/SĐT của bạn"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <InputText
                                    id="password"
                                    type="password"
                                    placeholder="Mật khẩu"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <Button
                            label="ĐĂNG NHẬP"
                            className="w-full bg-black text-white p-3 rounded mt-4 hover:bg-gray-800"
                        />

                        <div className="flex justify-between mt-4 text-sm">
                            <a href="#" className="text-blue-600 hover:underline">
                                Đăng ký
                            </a>
                            <a href="#" className="text-blue-600 hover:underline">
                                Quên mật khẩu
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;