import { useState, ChangeEvent, FormEvent } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import axios from 'axios';
import profileImg from './assets/2.webp';
import faceIcon from './assets/3.png';

import RegisterModal from './componentStyles/RegisterModal';
import PasswordInput from './componentStyles/PasswordInput';
import UIDinput from './componentStyles/UIDinput';

const Login: React.FC = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [values, setValues] = useState({
        studentId: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(`Changing ${e.target.name} to ${e.target.value}`); 
        setValues({ ...values, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Form submitted with values:", values); 
        try {
            const response = await axios.post('http://localhost:3000/auth/login', values);

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                const userType = response.data.type;

                console.log('Login response:', response);
                console.log('Navigating to:', userType === 'admin' ? '/admin' :
                    userType === 'parent' ? '/parent' :
                        userType === 'teacher' ? '/teacher' :
                            userType === 'student' ? '/' : '/');


                if (userType === 'admin') {
                    navigate('/admin');
                } else if (userType === 'parent') {
                    navigate('/parent');
                } else if (userType === 'teacher') {
                    navigate('/teacher');
                } else if (userType === 'student') { 
                    navigate('/'); 
                } else {
                    toast.error('Unknown user type. Please contact support.');
                }
                
            }
        } catch (err: any) {
            if (err.response) {
                toast.error(err.response.data.message || 'Login failed. Please check your credentials.');
            } else {
                toast.error('An error occurred. Please try again later.');
            }
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0F1C] flex">
            {/* Left Section - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img
                        src={profileImg}
                        alt="Profile"
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>

            {/* Right Section - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold text-white">Welcome to SAMS</h2>
                        <p className="text-sm text-gray-400">
                            Education is the most powerful weapon you can use to change the world.
                        </p>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                        <img
                            src={faceIcon}
                            alt="Profile"
                            className="w-8"
                        />
                        Sign in with RFID
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#0A0F1C] text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="studentId" className="block text-sm font-medium text-gray-300">Student ID</label>
                                {
                                    <UIDinput
                                        id="studentId"
                                        name="studentId"
                                        type="text"
                                        value={values.studentId}
                                        onChange={handleChanges}
                                    />

                                }
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                                {
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={values.password}
                                        onChange={handleChanges}
                                    />
                                }
                            </div>

                            <div className="items-top flex space-x-2">
                                <Checkbox id="terms1" className="text-gray-300 border-gray-300 focus:ring-gray-300" />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="terms1"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                                    >
                                        Remember Me
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                        Do not use this if you are on a public computer.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type='submit'
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Login
                            </button>
                        </div>

                        <div className="text-center text-sm">
                            <span className="text-gray-400">Don't have an account? </span>
                            <button
                                onClick={() => setIsRegisterOpen(true)}
                                className="text-blue-500 hover:text-blue-400 font-medium"
                            >
                                Create free account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
            />
            <Toaster position="top-right" />
        </div>
    );
}

export default Login;