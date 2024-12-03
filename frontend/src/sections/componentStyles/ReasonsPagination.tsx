import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const reasons = [
  {
    title: "Smart Attendance Tracking",
    subtitle: "Effortless and Accurate",
    description: "Our system leverages cutting-edge technology to automate attendance tracking, making it effortless and accurate.",
    image: "https://cdn.pixabay.com/photo/2018/07/14/11/33/earth-3537401_960_720.jpg",
    features: [
      "Real-time attendance monitoring",
      "Facial recognition technology",
      "Automated reporting system",
      "Mobile attendance tracking"
    ]
  },
  {
    title: "Seamless Integration",
    subtitle: "Works with Your Tools",
    description: "Easily integrate with existing school management systems and devices for a unified experience.",
    image: "https://cdn.pixabay.com/photo/2024/08/30/19/54/ai-generated-9009917_1280.png",
    features: [
      "Cross-platform compatibility",
      "API-first architecture",
      "Custom integration options",
      "Data synchronization"
    ]
  },
  {
    title: "Advanced Analytics",
    subtitle: "Data-Driven Insights",
    description: "Get detailed insights and analytics to make data-driven decisions about attendance patterns.",
    image: "https://cdn.pixabay.com/photo/2024/02/16/22/45/ai-generated-8578459_1280.jpg",
    features: [
      "Attendance trends",
      "Performance metrics",
      "Custom reports",
      "Data visualization"
    ]
  },
  {
    title: "Enhanced Security",
    subtitle: "Protected & Reliable",
    description: "State-of-the-art security measures ensure your attendance data is protected and accessible only to authorized personnel.",
    image: "https://cdn.pixabay.com/photo/2021/10/11/17/54/technology-6701509_960_720.jpg",
    features: [
      "End-to-end encryption",
      "Role-based access control",
      "Audit logging",
      "Secure data storage"
    ]
  },
  {
    title: "Join Us Today",
    subtitle: "Get Started Now",
    description: "Transform your attendance management system with our innovative solution. Experience the future of educational management.",
    image: "https://cdn.pixabay.com/photo/2024/04/18/09/08/ai-generated-8703863_1280.jpg",
    features: [
      "Quick setup process",
      "24/7 technical support",
      "Customizable solutions",
      "Flexible pricing plans"
    ]
  }
];

interface ReasonsPaginationProps {
  onClose: () => void;
}

function ReasonsPagination({ onClose }: ReasonsPaginationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentIndex === reasons.length - 1) {
      navigate('/login');
    } else {
      setCurrentIndex((prev) => (prev + 1) % reasons.length);
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
  };

  return (
    <div className="w-full max-w-7xl mx-auto text-center">
      <div className="relative">
        <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative h-full min-h-[400px] lg:min-h-[600px]">
              <div className="absolute inset-0">
                <img 
                  src={reasons[currentIndex].image}
                  alt={reasons[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <div className="flex flex-col gap-3">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium backdrop-blur-sm border border-blue-500/20">
                    {reasons[currentIndex].subtitle}
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white">
                    {reasons[currentIndex].title}
                  </h2>
                </div>
              </div>

              <button
                onClick={onClose}
                className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 text-white font-medium border border-white/20"
              >
                Close
              </button>
            </div>

            <div className="p-8 lg:p-12 flex flex-col">
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                {reasons[currentIndex].description}
              </p>

              <div className="flex-grow">
                <div className="grid gap-4">
                  {reasons[currentIndex].features.map((feature) => (
                    <div
                      key={feature}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="h-2 w-2 rounded-full bg-blue-400 group-hover:scale-125 transition-transform duration-300" />
                      <span className="text-gray-200 group-hover:text-white transition-colors duration-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevSlide}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex gap-2">
                    {reasons.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'w-8 bg-blue-400' 
                            : 'w-1.5 bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                  >
                    <span>
                      {currentIndex === reasons.length - 1 ? 'Engage Now' : 'Next'}
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReasonsPagination;