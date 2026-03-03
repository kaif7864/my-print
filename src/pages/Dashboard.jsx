import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiFileText, FiCreditCard, FiTruck, FiArrowRight, FiList, FiBookOpen, FiCalendar, FiLogOut, FiLoader } from "react-icons/fi";
import { LuWallet } from "react-icons/lu";
import Sidebar from "../components/Sidebar";
import ComingSoonPage from "../components/ComingSoonPage";
import { GiFirstAidKit } from "react-icons/gi";
import NotforYou from "../services/marksheets/MarksheetForm";

export default function Dashboard() {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({ userToday: 0, systemTotal: 0 });
  const [loading, setLoading] = useState(true);
  
  // ✨ User state for real name and avatar
  const [user, setUser] = useState({
      name: "User",
      avatar: "https://api.dicebear.com/8.x/adventurer/svg?seed=default"
  });

  // ✨ API se Stats fetch karein
  useEffect(() => {
    // A. Real User Data set karein
    const storedName = localStorage.getItem("userName");
    const storedAvatar = localStorage.getItem("userAvatar");
    if(storedName) setUser(prev => ({...prev, name: storedName}));
    if(storedAvatar) setUser(prev => ({...prev, avatar: storedAvatar}));

    // B. Stats Fetch Logic
    const fetchStats = async () => {
      try {
        // ✨ User ka email localStorage se lein
        const userEmail = localStorage.getItem("userEmail");                
        const response = await fetch(`http://localhost:5000/api/stats?email=${userEmail}`);
        const data = await response.json();
        
        if (response.ok) {
          setStatsData(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userName"); // Clear local data
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  // ✨ Updated Stats Array
  const stats = [
    { 
        label: "Today's IDs (You)", // 👤 Sirf user ki today's ids
        value: loading ? <FiLoader className="animate-spin inline" /> : statsData.userToday, 
        icon: <FiCalendar className="text-indigo-600" /> 
    },
    { 
        label: "Total IDs (System)", // 🌐 Puri system ki total
        value: loading ? <FiLoader className="animate-spin inline" /> : statsData.systemTotal, 
        icon: <FiList className="text-emerald-600" /> 
    },
  ];

  const services = [
    {
      title: "PAN Card",
      description: "Generate instant PAN ID from extracted data.",
      icon: <FiCreditCard className="text-orange-500 w-7 h-7" />,
      path: "/generate/pan",
      color: "border-orange-100 bg-orange-50"
    },
    {
      title: "Aadhaar Card",
      description: "Convert Aadhaar PDF into a printable Smart ID.",
      icon: <FiFileText className="text-blue-500 w-7 h-7" />,
      path: "/aadhar",
      color: "border-blue-100 bg-blue-50"
    },
    {
      title: "Vehicle RC",
      description: "Smart Digital RC generation for vehicles.",
      icon: <FiTruck className="text-green-500 w-7 h-7" />,
      path: "/coming-soon",
      color: "border-green-100 bg-green-50"
    },
    {
    title: "License",
    description: "Digital Driving License generation.",
    icon: <FiBookOpen className="text-red-500 w-7 h-7" />,
    path: "/coming-soon",
    color: "border-red-100 bg-red-50"
  },
  {
    title: "not for you",
    description: "secret documents",
    icon: <GiFirstAidKit className="text-red-500 w-7 h-7" />,
    path: "/not-for-you",
    color: "border-red-100 bg-red-50"
  },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      <Sidebar />

      <main className="flex-1 overflow-y-auto h-screen">
        
        <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-3 group">
              <img
                src={user.avatar}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover border-2 border-indigo-100"
              />
              <span className="font-semibold text-gray-700 group-hover:text-indigo-600">{user.name}</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
              title="Logout"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                <div className="p-4 bg-indigo-50 rounded-xl">{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Available Services
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Link 
                  key={index} 
                  to={service.path}
                  className={`group p-6 rounded-2xl border ${service.color} hover:shadow-lg transition-all duration-300 bg-white`}
                >
                  <div className="mb-5">{service.icon}</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{service.title}</h4>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-1 transition-all">
                    Generate <FiArrowRight className="ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Recent Activity</h3>
              <Link to="/print-list" className="text-sm text-indigo-600 font-medium hover:underline">View All</Link>
            </div>
            <div className="p-10 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <FiList size={28} />
              </div>
              <p className="text-gray-500 text-sm">No recent IDs generated yet.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}