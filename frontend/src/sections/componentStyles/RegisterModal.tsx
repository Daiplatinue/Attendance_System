import { Fragment, useState, ChangeEvent, FormEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import profileImg from '../assets/12.webp';
import PasswordChecker from './PasswordChecker';
import NameInput from './NameInput';
import PhoneNumber from './PhoneNumber';
import OTPbutton from './OTPbutton';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
    const [values, setValues] = useState({
        fullname: '',
        contact: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Submitted values:", values);
        try {
            const response = await axios.post('http://localhost:3000/auth/register', values);
            if (response.status === 201) {
                toast.success('Registration successful!');
                onClose();
                navigate('/login');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
            console.error(err.message);
        }
    };


    const handleAlreadyHaveAccount = () => {
        setValues({
            fullname: '',
            contact: '',
            password: ''
        });
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-[#0A0F1C] shadow-xl transition-all w-full max-w-4xl">
                                <motion.div
                                    className="flex"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {/* Left Section - Form */}
                                    <div className="w-full lg:w-1/2 p-8">
                                        <div className="max-w-md mx-auto space-y-8">
                                            <div className="space-y-3">
                                                <Dialog.Title className="text-3xl font-bold text-white">
                                                    Create an Account
                                                </Dialog.Title>
                                                <Dialog.Description className="text-sm text-gray-400">
                                                    This registration form is intended for parents and guardians only.
                                                </Dialog.Description>
                                            </div>

                                            <form className="space-y-6" onSubmit={handleSubmit}>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-300">Full Name</label>
                                                        <NameInput name="fullname" onChange={handleChanges} value={values.fullname} />
                                                    </div>
                                                    <div className="gap-4 flex">
                                                        <div>
                                                            <label htmlFor="contact" className="block text-sm font-medium text-gray-300">Phone Number</label>
                                                            <PhoneNumber name="contact" onChange={handleChanges} value={values.contact} />
                                                        </div>
                                                        <OTPbutton />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                                                        <PasswordChecker
                                                            name="password"
                                                            value={values.password}
                                                            onChange={handleChanges}
                                                        />

                                                    </div>
                                                </div>

                                                <div>
                                                    <button
                                                        type="submit"
                                                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Create Account
                                                    </button>
                                                </div>

                                                <div className="text-center text-sm">
                                                    <span className="text-gray-400">Already have an account? </span>
                                                    <button
                                                        type="button"
                                                        onClick={handleAlreadyHaveAccount}
                                                        className="text-blue-500 hover:text-blue-400 font-medium"
                                                    >
                                                        Sign in
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Right Section - Image */}
                                    <div className="hidden lg:block lg:w-1/2 relative">
                                        <img
                                            src={profileImg}
                                            alt="Profile"
                                            className="object-cover w-full h-full rounded-r-2xl"
                                        />
                                    </div>
                                </motion.div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
                <Toaster position="top-right" />
            </Dialog>
        </Transition>
    );
};

export default RegisterModal;