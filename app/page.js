'use client';

import React, { useState } from 'react';
import { 
  Home, MapPin, UtensilsCrossed, Store, Landmark, Calendar, 
  Map, Share2, User, LogOut, Plus, Search, Trash2, Moon, Sun,
  CheckCircle2, Clock, CheckSquare, Globe
} from 'lucide-react';

export default function TravelPlanner() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoginView, setIsLoginView] = useState(true);

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
  const [searchTerm, setSearchTerm] = useState('');

  // State thêm hoạt động & checklist
  const [newActivity, setNewActivity] = useState('');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [newCheckitem, setNewCheckitem] = useState('');

  // State Quy đổi tiền tệ
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState('USD');
  const exchangeRates = { USD: 25400, EUR: 27500, JPY: 165, KRW: 18 };

  // Xử lý tạo chuyến đi mới
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
  };

  // Thêm hoạt động vào ngày được chọn
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

  // Thêm hành lý
  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (!newCheckitem) return;
    setTrips(trips.map(trip => {
      if (trip.id === selectedTripId) {
        return { ...trip, checklist: [...trip.checklist, newCheckitem] };
      }
      return trip;
    }));
    setNewCheckitem('');
  };

  // Danh sách Sidebar Menu bên trái
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

  const filteredTrips = trips.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // MÀN HÌNH ĐĂNG NHẬP / ĐĂNG KÝ
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-blue-400">✈️ TravelPlanner Pro</h1>
            <p className="text-xs text-slate-400">
              {isLoginView ? 'Đăng nhập để quản lý lịch trình của bạn' : 'Tạo tài khoản mới'}
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
              className="w-full py-3 bg-green-600 hover:bg-green-500 font-bold rounded-lg transition"
            >
              {isLoginView ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            {isLoginView ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button 
              className="text-blue-400 hover:underline font-semibold"
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? 'Đăng ký' : 'Đăng nhập'}
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-400 mb-2">📌 Xem Mã nguồn dự án:</p>
            <a 
              href="https://github.com/nguyenthihuyentram/travel-planner" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-blue-400 hover:text-blue-300 rounded-xl text-xs font-semibold transition"
            >
              <Globe size={16} />
              <span>GitHub Repo ↗</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'}`}>
      
      {/* 1. THANH CÔNG CỤ DỌC BÊN TRÁI MÀN HÌNH (SIDEBAR) */}
      <aside className={`w-64 border-r flex flex-col justify-between h-screen sticky top-0 z-50 shrink-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div>
          {/* Logo */}
          <div 
            className={`p-5 font-bold text-xl text-blue-500 border-b flex items-center justify-between cursor-pointer ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}
            onClick={() => setActiveTab('schedule')}
          >
            <span className="flex items-center gap-2">✈️ TravelPlanner</span>
          </div>

          {/* Danh sách Menu */}
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
                      ? 'bg-red-50 text-red-600 dark:bg-slate-700 dark:text-red-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Nút Xem hồ sơ tài khoản */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all mt-4 ${
                activeTab === 'profile'
                  ? 'bg-red-50 text-red-600 dark:bg-slate-700 dark:text-red-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <User size={18} />
              <span>Xem hồ sơ tài khoản</span>
            </button>
          </nav>
        </div>

        {/* Cụm chỉnh Darkmode & Khung Tài Khoản Đẹp */}
        <div className={`p-3 border-t space-y-2.5 ${isDarkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full py-2 px-3 border rounded-xl text-xs font-medium flex items-center justify-center gap-2 border-slate-300 dark:border-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition"
          >
            {isDarkMode ? <Sun size={15} className="text-yellow-400" /> : <Moon size={15} />}
            <span>Chế độ {isDarkMode ? 'Sáng' : 'Tối'}</span>
          </button>

          {/* KHUNG TÀI KHOẢN ĐƯỢC THIẾT KẾ ĐẸP MẮT */}
          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-700/60 border-slate-600' : 'bg-white border-slate-200 shadow-sm'}`}>
            {/* Ảnh Avatar Đại Diện phía trước */}
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
              N
            </div>
            
            {/* Thông tin Tên & Email */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate leading-tight">
                Nguyễn Thị Huyền Trâm
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                tram592005@gmail.com
              </p>
            </div>

            {/* Nút Đăng Xuất */}
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

      {/* 2. KHU VỰC NỘI DUNG CHÍNH (BÊN PHẢI) */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* TAB LỊCH TRÌNH */}
        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Cột trái (4 cột) */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              
              {/* Form Tạo Lịch Trình */}
              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} space-y-4`}>
                <h2 className="font-bold text-base flex items-center gap-2">
                  <span className="text-blue-500">┼</span> Tạo Lịch Trình Mới
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
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                  >
                    Khởi Tạo Chuyến Đi
                  </button>
                </form>
              </div>

              {/* Box Quy Đổi Tiền Tệ */}
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

              {/* Danh sách chuyến đi */}
              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} space-y-4`}>
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-base">Danh Sách ({trips.length})</h2>
                  <input
                    type="text"
                    placeholder="🔍 Tìm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 border rounded-lg text-xs w-28 outline-none dark:bg-slate-700 dark:border-slate-600"
                  />
                </div>
                {filteredTrips.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Chưa có chuyến đi nào.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredTrips.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => setSelectedTripId(item.id)}
                        className={`p-3 border rounded-xl flex justify-between items-center cursor-pointer transition ${
                          selectedTripId === item.id 
                            ? 'border-blue-500 bg-blue-50/30 dark:bg-slate-700' 
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">📍 {item.destination} - 💰 {item.budget}</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setTrips(trips.filter(t => t.id !== item.id));
                          }}
                          className="text-red-500 text-xs hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Cột phải (8 cột) - Chi tiết Kế hoạch chuyến đi */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {currentTrip ? (
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} space-y-6`}>
                  
                  {/* Header chuyến đi đang chọn */}
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

                  {/* Lịch trình chi tiết */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Clock size={18} className="text-blue-500" /> Chi Tiết Lịch Trình Theo Ngày
                    </h3>
                    
                    <form onSubmit={handleAddActivity} className="flex gap-2">
                      <select 
                        value={selectedDayIndex} 
                        onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
                        className="px-3 py-2 border rounded-xl text-sm dark:bg-slate-700 dark:border-slate-600"
                      >
                        <option value={0}>Ngày 1</option>
                        <option value={1}>Ngày 2</option>
                        <option value={2}>Ngày 3</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Thêm hoạt động (VD: Ăn sáng Phở Thìn lúc 8:00)..." 
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-xl text-sm outline-none dark:bg-slate-700 dark:border-slate-600"
                      />
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">
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
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
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

                  {/* Checklist Đồ dùng */}
                  <div className="space-y-4 border-t pt-6 dark:border-slate-700">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <CheckSquare size={18} className="text-green-500" /> Hành Lý & Công Việc Cần Chuẩn Bị
                    </h3>

                    <form onSubmit={handleAddChecklist} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Thêm đồ dùng cần mang (VD: Sạc dự phòng)..." 
                        value={newCheckitem}
                        onChange={(e) => setNewCheckitem(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-xl text-sm outline-none dark:bg-slate-700 dark:border-slate-600"
                      />
                      <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700">
                        Thêm Đồ
                      </button>
                    </form>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {currentTrip.checklist.map((item, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-green-50 dark:bg-slate-700 text-green-700 dark:text-green-300 border border-green-200 dark:border-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                          <CheckCircle2 size={14} /> {item}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className={`p-12 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} min-h-[400px] flex items-center justify-center text-center`}>
                  <p className="text-slate-400 text-sm">
                    Vui lòng chọn hoặc tạo một chuyến đi mới từ danh sách bên trái.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB XEM HỒ SƠ TÀI KHOẢN */}
        {activeTab === 'profile' && (
          <div className={`max-w-md mx-auto p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} text-center space-y-4`}>
            <div className="w-20 h-20 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center mx-auto text-3xl shadow-md">
              N
            </div>
            <div>
              <h2 className="text-xl font-bold">Nguyễn Thị Huyền Trâm</h2>
              <p className="text-slate-500 text-sm">tram592005@gmail.com</p>
            </div>
            <div className="border-t pt-4 text-left space-y-2 text-sm dark:border-slate-700">
              <p><strong>Vai trò:</strong> Thành viên Pro</p>
              <p><strong>Tổng số chuyến đi đã tạo:</strong> {trips.length}</p>
            </div>

            <div className="pt-4 border-t dark:border-slate-700">
              <a 
                href="https://github.com/nguyenthihuyentram/travel-planner" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition"
              >
                <Globe size={16} />
                <span>Xem GitHub Repository ↗</span>
              </a>
            </div>
          </div>
        )}

        {/* CÁC TAB KHÁC */}
        {['home', 'destinations', 'food', 'restaurants', 'culture', 'map', 'community'].includes(activeTab) && (
          <div className={`p-12 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} text-center space-y-3`}>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 capitalize">
              Giao diện: {navItems.find(n => n.id === activeTab)?.label}
            </h2>
            <p className="text-slate-500 text-sm">Nội dung chi tiết của tính năng này đang được cập nhật...</p>
          </div>
        )}

      </main>
    </div>
  );
}