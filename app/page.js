'use client';

import React, { useState } from 'react';
import { 
  Home, MapPin, UtensilsCrossed, Store, Landmark, Calendar, 
  Map, Share2, User, LogOut, Search, Moon, Sun,
  ExternalLink, ArrowRight, Bot, Star, Heart, Plus, Clock
} from 'lucide-react';

import { destinationList, foodList, restaurantList, cultureList, categoryCards, trendingTags } from './data';

export default function TravelPlanner() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  // State bộ lọc trang chủ
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('destination');

  // State bộ lọc Trang Điểm Đến
  const [destSearch, setDestSearch] = useState('');
  const [destRegion, setDestRegion] = useState('all');
  const [destType, setDestType] = useState('all');

  // State bộ lọc Trang Ẩm Thực
  const [foodSearch, setFoodSearch] = useState('');
  const [foodRegion, setFoodRegion] = useState('all');
  const [foodCategory, setFoodCategory] = useState('all');

  // State bộ lọc Trang Quán Ăn
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [restaurantRegion, setRestaurantRegion] = useState('all');
  const [restaurantType, setRestaurantType] = useState('all');

  // State bộ lọc Trang Văn Hóa
  const [cultureSearch, setCultureSearch] = useState('');
  const [cultureRegion, setCultureRegion] = useState('all');
  const [cultureType, setCultureType] = useState('all');

  // State Tạo lịch trình
  const [trips, setTrips] = useState([
    {
      id: 1,
      name: 'Chuyến đi Đà Lạt 3N2Đ',
      destination: 'Đà Lạt',
      budget: '3,500,000 VNĐ',
      startDate: '2026-10-15',
      days: [
        { day: 'Ngày 1', activities: ['Check-in khách sạn', 'Thăm Chợ Đêm Đà Lạt', 'Ăn lẩu gà lá é'] },
        { day: 'Ngày 2', activities: ['Săn mây Cầu Đất', 'Uống cà phê Túi Mơ To', 'Thăm Vườn Hoa Thành Phố'] }
      ],
      checklist: ['Thẻ Căn Cước / Đăng ký', 'Máy ảnh', 'Áo ấm / Áo khoác']
    }
  ]);

  const [selectedTripId, setSelectedTripId] = useState(1);
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');

  // State thêm hoạt động
  const [newActivity, setNewActivity] = useState('');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // State Quy đổi tiền tệ
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState('USD');
  const exchangeRates = { USD: 25400, EUR: 27500, JPY: 165, KRW: 18 };

 // State cho Góc chia sẻ
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Trần Minh Thư',
      avatar: 'T',
      time: 'Đã đăng 2 giờ trước',
      location: 'Đà Lạt',
      content: 'Chuyến đi 3N2Đ săn mây Cầu Đất cực kỳ mãn nhãn. Thời tiết Đà Lạt tuần này se lạnh về đêm, ban ngày nắng vàng rất đẹp. Mọi người nhớ ghé tiệm cà phê Túi Mơ To sống ảo nhé, view đỉnh lắm ạ! ❤️',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      likes: 128,
      comments: 24,
    },
    {
      id: 2,
      author: 'Hoàng Nam',
      avatar: 'H',
      time: 'Đã đăng 1 ngày trước',
      location: 'Vịnh Hạ Long',
      content: 'Lần đầu đi du thuyền khám phá Vịnh Hạ Long và thực sự không thất vọng chút nào. Cảnh quan kỳ vĩ, dịch vụ chuyên nghiệp. Khuyên mọi người nên chọn tour ngắm hoàng hôn trên vịnh nhé! 🌅',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
      likes: 256,
      comments: 42,
    }
  ]);
  const [newContent, setNewContent] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newImage, setNewImage] = useState('');
 
  // Các hàm lọc dữ liệu
  const filteredDestinations = destinationList.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(destSearch.toLowerCase()) || 
                        item.location.toLowerCase().includes(destSearch.toLowerCase());
    const matchRegion = destRegion === 'all' || item.region === destRegion;
    const matchType = destType === 'all' || item.type === destType;
    return matchSearch && matchRegion && matchType;
  });

  const filteredFood = foodList.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(foodSearch.toLowerCase()) || 
                        item.location.toLowerCase().includes(foodSearch.toLowerCase());
    const matchRegion = foodRegion === 'all' || item.region === foodRegion;
    const matchCategory = foodCategory === 'all' || item.category === foodCategory;
    return matchSearch && matchRegion && matchCategory;
  });

  const filteredRestaurants = restaurantList.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(restaurantSearch.toLowerCase()) || 
                        item.address.toLowerCase().includes(restaurantSearch.toLowerCase());
    const matchRegion = restaurantRegion === 'all' || item.region === restaurantRegion;
    const matchType = restaurantType === 'all' || item.type === restaurantType;
    return matchSearch && matchRegion && matchType;
  });

  const filteredCulture = cultureList.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(cultureSearch.toLowerCase()) || 
                        item.location.toLowerCase().includes(cultureSearch.toLowerCase());
    const matchRegion = cultureRegion === 'all' || item.region === cultureRegion;
    const matchType = cultureType === 'all' || item.type === cultureType;
    return matchSearch && matchRegion && matchType;
  });

  const handleCreateTrip = (e) => {
    e.preventDefault();
    if (!tripName || !destination) return;
    const newTrip = {
      id: Date.now(),
      name: tripName,
      destination,
      budget: budget ? Number(budget).toLocaleString('vi-VN') + ' VNĐ' : 'Chưa nhập',
      startDate,
      days: [
        { day: 'Ngày 1', activities: [] },
        { day: 'Ngày 2', activities: [] }
      ],
      checklist: ['Thẻ Căn Cước / Hộ Chiếu']
    };
    setTrips([...trips, newTrip]);
    setSelectedTripId(newTrip.id);
    setTripName('');
    setDestination('');
    setBudget('');
    setStartDate('');
    setActiveTab('schedule');
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivity) return;
    setTrips(trips.map(trip => {
      if (trip.id === selectedTripId) {
        const updatedDays = [...trip.days];
        if (!updatedDays[selectedDayIndex]) {
          updatedDays[selectedDayIndex] = { day: `Ngày ${selectedDayIndex + 1}`, activities: [] };
        }
        updatedDays[selectedDayIndex].activities.push(newActivity);
        return { ...trip, days: updatedDays };
      }
      return trip;
    }));
    setNewActivity('');
  };

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'destinations', label: 'Điểm đến', icon: MapPin },
    { id: 'food', label: 'Ẩm thực', icon: UtensilsCrossed },
    { id: 'restaurants', label: 'Quán ăn', icon: Store },
    { id: 'culture', label: 'Văn hóa', icon: Landmark },
    { id: 'schedule', label: 'Lịch trình', icon: Calendar },
    { id: 'map', label: 'Bản đồ', icon: Map },
    { id: 'community', label: 'Góc chia sẻ', icon: Share2 },
  ];

  const currentTrip = trips.find(t => t.id === selectedTripId);

  // MÀN HÌNH ĐĂNG NHẬP / ĐĂNG KÝ
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-blue-500 flex items-center justify-center gap-2">
              ✈️ TravelPlanner
            </h1>
            <p className="text-xs text-slate-400">
              {isLoginView ? 'Đăng nhập để quản lý lịch trình' : 'Tạo tài khoản mới'}
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            {!isLoginView && (
              <div>
                <label className="text-xs text-slate-300 block mb-1">Họ và Tên</label>
                <input 
                  type="text" 
                  defaultValue="Nguyễn Thị Huyền Trâm"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500"
                  required 
                />
              </div>
            )}
            <div>
              <label className="text-xs text-slate-300 block mb-1">Email</label>
              <input 
                type="email" 
                defaultValue="tram592005@gmail.com"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500"
                required 
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Mật khẩu</label>
              <input 
                type="password" 
                defaultValue="123456"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-sm outline-none focus:border-blue-500"
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-lg transition shadow-md"
            >
              {isLoginView ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
          </form>

          <div className="text-center text-sm text-slate-400">
            {isLoginView ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button 
              className="text-blue-400 hover:underline font-semibold"
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? 'Đăng ký' : 'Đăng nhập'}
            </button>
          </div>

          {/* Link GitHub ngay dưới nút đăng nhập */}
          <div className="pt-2 border-t border-slate-700 text-center">
            <a
              href="https://github.com/nguyenthihuyentram/travel-planner"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1.5"
            >
              <span>Xem GitHub Repository của dự án</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // GIAO DIỆN CHÍNH SAU KHI ĐĂNG NHẬP
  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* SIDEBAR BÊN TRÁI */}
      <aside className={`w-64 border-r flex flex-col justify-between h-screen sticky top-0 z-50 shrink-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div>
          <div 
            className={`p-5 cursor-pointer ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}
            onClick={() => setActiveTab('home')}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">✈️</span>
              <span className="font-bold text-xl text-blue-500 tracking-tight">
                TravelPlanner
              </span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all mt-4 ${
                activeTab === 'profile'
                  ? 'bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <User size={18} />
              <span>Xem hồ sơ tài khoản</span>
            </button>
          </nav>
        </div>

        <div className={`p-3 border-t space-y-2.5 ${isDarkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full py-2 px-3 border rounded-xl text-xs font-medium flex items-center justify-center gap-2 border-slate-300 dark:border-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition"
          >
            {isDarkMode ? <Sun size={15} className="text-yellow-400" /> : <Moon size={15} />}
            <span>Chế độ {isDarkMode ? 'Sáng' : 'Tối'}</span>
          </button>

          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-700/60 border-slate-600' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
              N
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate leading-tight">
                Nguyễn Thị Huyền Trâm
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                tram592005@gmail.com
              </p>
            </div>

            <button 
              onClick={() => setIsLoggedIn(false)}
              title="Đăng xuất"
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* NỘI DUNG CHÍNH */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto relative">

        {/* Nút Tư Vấn AI */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-full shadow-lg font-bold text-xs transition">
            <Bot size={18} />
            <span>Tư vấn AI</span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          </button>
        </div>

        {/* TAB TRANG CHỦ */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            <div className="relative rounded-3xl overflow-hidden min-h-[420px] flex flex-col justify-center items-center text-center p-6 md:p-12 bg-cover bg-center shadow-xl"
                 style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.55)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')` }}>
              
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-2xl max-w-4xl w-full text-left space-y-4 text-slate-800 dark:text-white border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ĐIỂM ĐẾN HOẶC MÓN ĂN</label>
                    <input 
                      type="text"
                      placeholder="Hạ Long, Hội An, Phở bò, Tràng An..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">VÙNG MIỀN</label>
                    <select 
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="all">Toàn bộ 3 miền</option>
                      <option value="north">Miền Bắc</option>
                      <option value="central">Miền Trung</option>
                      <option value="south">Miền Nam</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">TRẢI NGHIỆM</label>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="destination">Điểm đến</option>
                      <option value="food">Ẩm thực</option>
                      <option value="culture">Văn hóa</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex items-end">
                    <button 
                      onClick={() => setActiveTab('destinations')}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Khám phá ngay</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Điểm đến thịnh hành:</span>
                    {trendingTags.map((tag, idx) => (
                      <button 
                        key={idx}
                        onClick={() => { setDestSearch(tag); setActiveTab('destinations'); }}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-medium transition"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Trải Nghiệm Đa Dạng</p>
                  <h2 className="text-2xl md:text-3xl font-extrabold">Hành Trình Theo Phong Cách Của Bạn</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryCards.map((card) => (
                  <div 
                    key={card.id}
                    onClick={() => setActiveTab('destinations')}
                    className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={card.image} 
                        alt={card.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute top-3 left-3 ${card.badgeBg} text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow`}>
                        {card.badge}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-base group-hover:text-blue-600 transition-colors">{card.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB ĐIỂM ĐẾN */}
        {activeTab === 'destinations' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold">Danh Sách Điểm Đến Hấp Dẫn</h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Khám phá danh thắng, di sản và địa điểm nghỉ dưỡng nổi tiếng khắp Việt Nam
                </p>
              </div>

              <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center gap-3 ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="relative flex-1 w-full">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Tìm tên điểm đến hoặc tỉnh thành..."
                    value={destSearch}
                    onChange={(e) => setDestSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>

                <select 
                  value={destRegion}
                  onChange={(e) => setDestRegion(e.target.value)}
                  className="w-full md:w-44 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium outline-none cursor-pointer"
                >
                  <option value="all">Tất cả Miền</option>
                  <option value="north">Miền Bắc</option>
                  <option value="central">Miền Trung</option>
                  <option value="south">Miền Nam</option>
                </select>

                <select 
                  value={destType}
                  onChange={(e) => setDestType(e.target.value)}
                  className="w-full md:w-44 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium outline-none cursor-pointer"
                >
                  <option value="all">Loại hình (Tất cả)</option>
                  <option value="beach">Biển đảo</option>
                  <option value="mountain">Núi rừng / Săn mây</option>
                  <option value="culture">Văn hóa / Lịch sử</option>
                </select>
              </div>
            </div>

            {filteredDestinations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDestinations.map((item) => (
                  <div 
                    key={item.id}
                    className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-blue-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow">
                          {item.tag}
                        </span>
                        <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white backdrop-blur-md rounded-full text-slate-600 dark:text-white transition">
                          <Heart size={16} />
                        </button>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <MapPin size={13} />
                            {item.location}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star size={14} className="fill-amber-400 text-amber-400" />
                            <span>{item.rating}</span>
                            <span className="text-slate-400 font-normal">({item.reviews})</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                      <button 
                        onClick={() => {
                          setDestination(item.name);
                          setActiveTab('schedule');
                        }}
                        className="w-full py-2 bg-blue-50 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1"
                      >
                        <Plus size={14} />
                        <span>Thêm vào lịch trình</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-12 text-center rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className="text-slate-500 text-sm">Không tìm thấy điểm đến nào phù hợp với từ khóa của bạn.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB ẨM THỰC */}
        {activeTab === 'food' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold">Khám Phá Ẩm Thực Việt Nam</h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Thưởng thức các món ăn đặc sản 3 miền hấp dẫn và chuẩn vị nhất
                </p>
              </div>

              <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center gap-3 ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="relative flex-1 w-full">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Tìm tên món ăn (Phở, Bún bò, Bánh mì...)"
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>

                <select 
                  value={foodRegion}
                  onChange={(e) => setFoodRegion(e.target.value)}
                  className="w-full md:w-44 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium outline-none cursor-pointer"
                >
                  <option value="all">Tất cả Miền</option>
                  <option value="north">Ẩm thực Miền Bắc</option>
                  <option value="central">Ẩm thực Miền Trung</option>
                  <option value="south">Ẩm thực Miền Nam</option>
                </select>

                <select 
                  value={foodCategory}
                  onChange={(e) => setFoodCategory(e.target.value)}
                  className="w-full md:w-44 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium outline-none cursor-pointer"
                >
                  <option value="all">Thể loại (Tất cả)</option>
                  <option value="noodle">Món Bún / Phở / Mì</option>
                  <option value="rice">Món Cơm / Lẩu / Cá</option>
                  <option value="streetfood">Ăn vặt / Bánh ngọt</option>
                </select>
              </div>
            </div>

            {filteredFood.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFood.map((item) => (
                  <div 
                    key={item.id}
                    className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow">
                          {item.tag}
                        </span>
                        <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white backdrop-blur-md rounded-full text-slate-600 dark:text-white transition">
                          <Heart size={16} />
                        </button>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                            <UtensilsCrossed size={13} />
                            {item.location}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star size={14} className="fill-amber-400 text-amber-400" />
                            <span>{item.rating}</span>
                            <span className="text-slate-400 font-normal">({item.reviews})</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="pt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                          💵 Giá khoảng: <span className="text-emerald-600 dark:text-emerald-400">{item.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                      <button 
                        onClick={() => {
                          if (currentTrip) {
                            const updatedDays = [...currentTrip.days];
                            updatedDays[0].activities.push(`Thưởng thức món ${item.name}`);
                            setTrips(trips.map(t => t.id === selectedTripId ? { ...t, days: updatedDays } : t));
                          }
                          setActiveTab('schedule');
                        }}
                        className="w-full py-2 bg-red-50 dark:bg-slate-700 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1"
                      >
                        <Plus size={14} />
                        <span>Thêm vào lịch trình ăn uống</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-12 text-center rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className="text-slate-500 text-sm">Không tìm thấy món ăn nào phù hợp với từ khóa của bạn.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB QUÁN ĂN */}
        {activeTab === 'restaurants' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold">Top Quán Ăn & Nhà Hàng Nổi Tiếng</h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Danh sách quán ăn ngon chuẩn vị, chất lượng hàng đầu được cộng đồng du lịch yêu thích
                </p>
              </div>

              <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center gap-3 ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="relative flex-1 w-full">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Tìm tên quán ăn, địa chỉ..."
                    value={restaurantSearch}
                    onChange={(e) => setRestaurantSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>

                <select 
                  value={restaurantRegion}
                  onChange={(e) => setRestaurantRegion(e.target.value)}
                  className="w-full md:w-44 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium outline-none cursor-pointer"
                >
                  <option value="all">Tất cả Miền</option>
                  <option value="north">Miền Bắc</option>
                  <option value="central">Miền Trung</option>
                  <option value="south">Miền Nam</option>
                </select>

                <select 
                  value={restaurantType}
                  onChange={(e) => setRestaurantType(e.target.value)}
                  className="w-full md:w-44 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium outline-none cursor-pointer"
                >
                  <option value="all">Mô hình (Tất cả)</option>
                  <option value="traditional">Quán truyền thống</option>
                  <option value="restaurant">Nhà hàng</option>
                  <option value="street">Quán vỉa hè / Bánh mì</option>
                </select>
              </div>
            </div>

            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((item) => (
                  <div 
                    key={item.id}
                    className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-emerald-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow">
                          {item.tag}
                        </span>
                        <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white backdrop-blur-md rounded-full text-slate-600 dark:text-white transition">
                          <Heart size={16} />
                        </button>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Store size={13} />
                            {item.openTime}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star size={14} className="fill-amber-400 text-amber-400" />
                            <span>{item.rating}</span>
                            <span className="text-slate-400 font-normal">({item.reviews})</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1">
                          <MapPin size={13} className="shrink-0 mt-0.5 text-blue-500" />
                          <span>{item.address}</span>
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="pt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                          💵 Mức giá: <span className="text-emerald-600 dark:text-emerald-400">{item.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                      <button 
                        onClick={() => {
                          if (currentTrip) {
                            const updatedDays = [...currentTrip.days];
                            updatedDays[0].activities.push(`Ghé quán: ${item.name} (${item.address})`);
                            setTrips(trips.map(t => t.id === selectedTripId ? { ...t, days: updatedDays } : t));
                          }
                          setActiveTab('schedule');
                        }}
                        className="w-full py-2 bg-emerald-50 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1"
                      >
                        <Plus size={14} />
                        <span>Thêm địa điểm vào lịch trình</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-12 text-center rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className="text-slate-500 text-sm">Không tìm thấy quán ăn nào phù hợp với tìm kiếm của bạn.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB VĂN HÓA */}
        {activeTab === 'culture' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold">Di Sản, Lễ Hội & Văn Hóa Việt Nam</h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Khám phá các di sản văn hóa phi vật thể, lễ hội truyền thống và làng nghề đặc sắc
                </p>
              </div>

              <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center gap-3 ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="relative flex-1 w-full">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Tìm tên di sản, lễ hội, địa điểm..."
                    value={cultureSearch}
                    onChange={(e) => setCultureSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>

                <select 
                  value={cultureRegion}
                  onChange={(e) => setCultureRegion(e.target.value)}
                  className="w-full md:w-44 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium outline-none cursor-pointer"
                >
                  <option value="all">Tất cả Miền</option>
                  <option value="north">Miền Bắc</option>
                  <option value="central">Miền Trung</option>
                  <option value="south">Miền Nam</option>
                </select>

                <select 
                  value={cultureType}
                  onChange={(e) => setCultureType(e.target.value)}
                  className="w-full md:w-44 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium outline-none cursor-pointer"
                >
                  <option value="all">Phân loại (Tất cả)</option>
                  <option value="heritage">Di sản UNESCO</option>
                  <option value="festival">Lễ hội truyền thống</option>
                  <option value="village">Làng nghề thủ công</option>
                </select>
              </div>
            </div>

            {filteredCulture.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCulture.map((item) => (
                  <div 
                    key={item.id}
                    className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-amber-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow">
                          {item.tag}
                        </span>
                        <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white backdrop-blur-md rounded-full text-slate-600 dark:text-white transition">
                          <Heart size={16} />
                        </button>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Landmark size={13} />
                            {item.location}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star size={14} className="fill-amber-400 text-amber-400" />
                            <span>{item.rating}</span>
                            <span className="text-slate-400 font-normal">({item.reviews})</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Calendar size={13} className="text-blue-500 shrink-0" />
                          <span>Thời gian: <strong className="text-slate-700 dark:text-slate-200">{item.time}</strong></span>
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                      <button 
                        onClick={() => {
                          if (currentTrip) {
                            const updatedDays = [...currentTrip.days];
                            updatedDays[0].activities.push(`Khám phá văn hóa: ${item.name} tại ${item.location}`);
                            setTrips(trips.map(t => t.id === selectedTripId ? { ...t, days: updatedDays } : t));
                          }
                          setActiveTab('schedule');
                        }}
                        className="w-full py-2 bg-amber-50 dark:bg-slate-700 hover:bg-amber-600 hover:text-white text-amber-600 dark:text-amber-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1"
                      >
                        <Plus size={14} />
                        <span>Thêm vào lịch trình trải nghiệm</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-12 text-center rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className="text-slate-500 text-sm">Không tìm thấy thông tin văn hóa nào phù hợp với tìm kiếm của bạn.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB LỊCH TRÌNH */}
        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} space-y-4`}>
                <h2 className="font-bold text-base flex items-center gap-2">
                  <span className="text-blue-600">┼</span> Tạo Lịch Trình Mới
                </h2>
                <form onSubmit={handleCreateTrip} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Tên chuyến đi (VD: Đi Đà Lạt 3N2Đ)"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm outline-none dark:bg-slate-700 dark:border-slate-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Điểm đến (VD: Đà Lạt)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm outline-none dark:bg-slate-700 dark:border-slate-600"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Ngân sách (VND)"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm outline-none dark:bg-slate-700 dark:border-slate-600"
                    />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-sm outline-none dark:bg-slate-700 dark:border-slate-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow"
                  >
                    Khởi Tạo Chuyến Đi
                  </button>
                </form>
              </div>

              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} space-y-4`}>
                <h2 className="font-bold text-base flex items-center gap-2">
                  <span>💱</span> Quy Đổi Tiền Tệ
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="px-3 py-2 border rounded-xl text-sm outline-none dark:bg-slate-700 dark:border-slate-600"
                  />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="px-3 py-2 border rounded-xl text-sm outline-none dark:bg-slate-700 dark:border-slate-600"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="KRW">KRW (₩)</option>
                  </select>
                </div>
                <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mb-1">Giá trị quy đổi VNĐ</p>
                  <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                    {(amount * exchangeRates[currency]).toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {currentTrip ? (
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} space-y-6 shadow-sm`}>
                  <div className="flex justify-between items-start border-b pb-4 dark:border-slate-700">
                    <div>
                      <h1 className="text-2xl font-bold">{currentTrip.name}</h1>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-1">
                        <span>📍 {currentTrip.destination}</span>
                        <span>📅 {currentTrip.startDate || 'Chưa định ngày'}</span>
                        <span>💰 {currentTrip.budget}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Clock size={18} className="text-blue-600" /> Chi Tiết Lịch Trình
                    </h3>
                    
                    <form onSubmit={handleAddActivity} className="flex gap-2">
                      <select 
                        value={selectedDayIndex} 
                        onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
                        className="px-3 py-2 border rounded-xl text-sm dark:bg-slate-700 dark:border-slate-600 outline-none"
                      >
                        <option value={0}>Ngày 1</option>
                        <option value={1}>Ngày 2</option>
                        <option value={2}>Ngày 3</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Thêm hoạt động..." 
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-xl text-sm outline-none dark:bg-slate-700 dark:border-slate-600"
                      />
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition">
                        Thêm
                      </button>
                    </form>

                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                      {currentTrip.days.map((dayItem, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                          <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 mb-2">{dayItem.day}</h4>
                          <ul className="space-y-1 text-sm">
                            {dayItem.activities.length > 0 ? (
                              dayItem.activities.map((act, actIdx) => (
                                <li key={actIdx} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                  <span>{act}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-xs text-slate-400 italic">Chưa có hoạt động</li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`p-12 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} min-h-[400px] flex items-center justify-center text-center`}>
                  <p className="text-slate-400 text-sm">Vui lòng tạo chuyến đi.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB HỒ SƠ TÀI KHOẢN */}
        {activeTab === 'profile' && (
          <div className={`max-w-md mx-auto p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} text-center space-y-4 shadow-sm`}>
            <div className="w-20 h-20 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center mx-auto text-3xl shadow-md">
              N
            </div>
            <div>
              <h2 className="text-xl font-bold">Nguyễn Thị Huyền Trâm</h2>
              <p className="text-slate-500 text-sm">tram592005@gmail.com</p>
            </div>
          </div>
        )}

        {/* TAB BẢN ĐỒ */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">Bản Đồ Du Lịch Việt Nam</h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Tra cứu không gian trực quan các điểm đến, quán ăn và di sản nổi bật
              </p>
            </div>

            <div className={`p-4 rounded-2xl border overflow-hidden shadow-sm ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="w-full h-[550px] rounded-xl overflow-hidden">
                <iframe
                  title="Google Map Viet Nam"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.494674620092!2d106.69830207688756!3d10.772033659223847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a6c2db!2zTmjDoCBWxMSjbiBDaOG7pyBUaOG6oW4gSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* TAB GÓC CHIA SẺ */}
        {activeTab === 'community' && (
          <div className="space-y-6 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold">Góc Chia Sẻ & Review Du Lịch</h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Nơi cộng đồng chia sẻ những trải nghiệm thực tế, kinh nghiệm và hình ảnh các chuyến đi
                </p>
              </div>
              <button 
                onClick={() => setShowPostModal(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>✏️ Viết bài review</span>
              </button>
            </div>

            {/* DANH SÁCH BÀI VIẾT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div key={post.id} className={`p-5 rounded-2xl border space-y-4 shadow-sm transition hover:shadow-md ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow">
                      {post.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{post.author}</h4>
                      <p className="text-[11px] text-slate-400">{post.time} • 📍 {post.location}</p>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {post.content}
                  </p>

                  {post.image && (
                    <div className="rounded-xl overflow-hidden h-48">
                      <img 
                        src={post.image} 
                        alt="Review" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t dark:border-slate-700 text-xs text-slate-500">
                    <button 
                      onClick={() => {
                        setPosts(posts.map(p => p.id === post.id ? {...p, likes: p.likes + 1} : p));
                      }}
                      className="flex items-center gap-1.5 hover:text-red-500 transition font-medium"
                    >
                      <span>❤️ {post.likes} Thích</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-blue-500 transition font-medium">
                      <span>💬 {post.comments} Bình luận</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-blue-500 transition font-medium">
                      <span>🔗 Chia sẻ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* MODAL ĐĂNG BÀI REVIEW */}
            {showPostModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-xl space-y-4 ${
                  isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                    <h3 className="text-lg font-bold">Viết Bài Review Du Lịch</h3>
                    <button 
                      onClick={() => setShowPostModal(false)}
                      className="text-slate-400 hover:text-red-500 font-bold text-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1">Địa điểm / Tỉnh thành</label>
                      <input 
                        type="text" 
                        placeholder="VD: Đà Nẵng, Phú Quốc..."
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">Nội dung review</label>
                      <textarea 
                        rows="4"
                        placeholder="Chia sẻ cảm nhận, lịch trình hoặc quán ăn ngon..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}
                      ></textarea>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">Link hình ảnh minh họa (URL)</label>
                      <input 
                        type="text" 
                        placeholder="Dán link ảnh (https://...)"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t dark:border-slate-800">
                    <button 
                      onClick={() => setShowPostModal(false)}
                      className="px-4 py-2 rounded-xl border text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Hủy
                    </button>
                    <button 
                      onClick={() => {
                        if (!newContent.trim()) {
                          alert('Vui lòng nhập nội dung bài viết!');
                          return;
                        }
                        const newPostItem = {
                          id: Date.now(),
                          author: 'Nguyễn Thị Huyền Trâm',
                          avatar: 'N',
                          time: 'Vừa xong',
                          location: newLocation || 'Việt Nam',
                          content: newContent,
                          image: newImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
                          likes: 0,
                          comments: 0,
                        };
                        setPosts([newPostItem, ...posts]);
                        setNewContent('');
                        setNewLocation('');
                        setNewImage('');
                        setShowPostModal(false);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition"
                    >
                      Đăng bài
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}