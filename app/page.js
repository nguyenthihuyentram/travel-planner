'use client';
import { useState, useEffect } from 'react';

export default function TravelPlanner() {
  // --- AUTH STATES ---
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  // --- APP STATES ---
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('itinerary');

  // --- FORM STATES ---
  const [tripForm, setTripForm] = useState({ title: '', destination: '', budget: '', startDate: '' });
  const [locationForm, setLocationForm] = useState({ name: '', day: 'Ngày 1', note: '' });
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', method: 'Tiền mặt', bank: 'MBBank', accountNo: '' });
  const [checklistInput, setChecklistInput] = useState('');
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });

  // --- PASSENGER / BOOKER INFO STATE (CẬP NHẬT MỚI) ---
  const [passengerForm, setPassengerForm] = useState({ fullName: '', idCard: '', phone: '', email: '', docImage: '' });

  // --- PAYMENTS & CURRENCY ---
  const [activeBill, setActiveBill] = useState(null);
  const [currency, setCurrency] = useState({ amount: 100, type: 'USD' });
  const rates = { USD: 25400, EUR: 27500, JPY: 165, KRW: 18 };

  // Tải dữ liệu ban đầu
  useEffect(() => {
    const savedSession = localStorage.getItem('app_user_session');
    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      setLoginForm(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
    if (savedSession) setUser(JSON.parse(savedSession));

    const savedTrips = localStorage.getItem('my_travel_trips_v2');
    if (savedTrips) {
      const parsed = JSON.parse(savedTrips);
      setTrips(parsed);
      if (parsed.length > 0) setSelectedTrip(parsed[0]);
    }
  }, []);

  // Lưu dữ liệu vào LocalStorage
  useEffect(() => {
    localStorage.setItem('my_travel_trips_v2', JSON.stringify(trips));
  }, [trips]);

  // Auth Handlers
  const handleRegister = (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password) return alert('Vui lòng điền đầy đủ thông tin!');
    if (registerForm.password !== registerForm.confirmPassword) return alert('Mật khẩu xác nhận không khớp!');

    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    if (registeredUsers.some(u => u.email === registerForm.email)) return alert('Email này đã được đăng ký!');

    registeredUsers.push({ name: registerForm.name, email: registerForm.email, password: registerForm.password });
    localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

    alert('Đăng ký thành công!');
    setLoginForm({ email: registerForm.email, password: '' });
    setIsLoginView(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const foundUser = registeredUsers.find(u => u.email === loginForm.email && u.password === loginForm.password);

    if (!foundUser) return alert('Email hoặc mật khẩu không chính xác!');

    if (rememberMe) localStorage.setItem('remembered_email', loginForm.email);
    else localStorage.removeItem('remembered_email');

    const userData = { name: foundUser.name, email: foundUser.email };
    setUser(userData);
    localStorage.setItem('app_user_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('app_user_session');
  };

  // Trip Handlers
  const handleAddTrip = (e) => {
    e.preventDefault();
    if (!tripForm.title || !tripForm.destination) return;
    const newTrip = {
      id: Date.now(),
      title: tripForm.title,
      destination: tripForm.destination,
      budget: Number(tripForm.budget) || 0,
      startDate: tripForm.startDate || '',
      passengers: [], // Khởi tạo danh sách hành khách
      locations: [],
      expenses: [],
      checklist: [
        { id: 1, text: 'Hộ chiếu / CCCD', done: false },
        { id: 2, text: 'Quần áo & Đồ dùng cá nhân', done: false },
        { id: 3, text: 'Sạc dự phòng & Thiết bị điện tử', done: false }
      ],
      notes: []
    };
    const updated = [newTrip, ...trips];
    setTrips(updated);
    setSelectedTrip(newTrip);
    setTripForm({ title: '', destination: '', budget: '', startDate: '' });
  };

  const handleDeleteTrip = (id) => {
    const updated = trips.filter(t => t.id !== id);
    setTrips(updated);
    if (selectedTrip?.id === id) setSelectedTrip(updated[0] || null);
  };

  const updateCurrentTrip = (updatedTrip) => {
    setSelectedTrip(updatedTrip);
    setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  };

  // Sub-feature Handlers
  const handleAddPassenger = (e) => {
    e.preventDefault();
    if (!selectedTrip || !passengerForm.fullName || !passengerForm.idCard) return alert('Vui lòng điền Họ tên và Số CCCD/Hộ chiếu!');
    const updatedPassengers = [...(selectedTrip.passengers || []), { id: Date.now(), ...passengerForm }];
    updateCurrentTrip({ ...selectedTrip, passengers: updatedPassengers });
    setPassengerForm({ fullName: '', idCard: '', phone: '', email: '', docImage: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassengerForm(prev => ({ ...prev, docImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!selectedTrip || !locationForm.name) return;
    const updated = { ...selectedTrip, locations: [...selectedTrip.locations, { id: Date.now(), ...locationForm }] };
    updateCurrentTrip(updated);
    setLocationForm({ name: '', day: 'Ngày 1', note: '' });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!selectedTrip || !expenseForm.title || !expenseForm.amount) return;
    const newExpense = {
      id: Date.now(),
      title: expenseForm.title,
      amount: Number(expenseForm.amount),
      method: expenseForm.method,
      bank: expenseForm.bank,
      accountNo: expenseForm.accountNo,
      paid: false,
      date: new Date().toLocaleDateString('vi-VN')
    };
    const updated = { ...selectedTrip, expenses: [...selectedTrip.expenses, newExpense] };
    updateCurrentTrip(updated);
    setExpenseForm({ title: '', amount: '', method: 'Tiền mặt', bank: 'MBBank', accountNo: '' });
  };

  const toggleExpenseStatus = (expId) => {
    const updatedExpenses = selectedTrip.expenses.map(e => e.id === expId ? { ...e, paid: !e.paid } : e);
    updateCurrentTrip({ ...selectedTrip, expenses: updatedExpenses });
  };

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (!selectedTrip || !checklistInput) return;
    const updated = { ...selectedTrip, checklist: [...selectedTrip.checklist, { id: Date.now(), text: checklistInput, done: false }] };
    updateCurrentTrip(updated);
    setChecklistInput('');
  };

  const toggleChecklist = (id) => {
    const updatedChecklist = selectedTrip.checklist.map(item => item.id === id ? { ...item, done: !item.done } : item);
    updateCurrentTrip({ ...selectedTrip, checklist: updatedChecklist });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!selectedTrip || !noteForm.title) return;
    const updated = { ...selectedTrip, notes: [...selectedTrip.notes, { id: Date.now(), ...noteForm }] };
    updateCurrentTrip(updated);
    setNoteForm({ title: '', content: '' });
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculations & Helpers
  const totalSpent = selectedTrip ? selectedTrip.expenses.reduce((sum, item) => sum + item.amount, 0) : 0;
  const filteredTrips = trips.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const getDaysLeft = (startDateStr) => {
    if (!startDateStr) return null;
    const diffTime = new Date(startDateStr) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // ================= AUTH VIEW =================
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-blue-400 flex items-center justify-center gap-2">
              <span>✈️</span> TravelPlanner Pro
            </h1>
            <p className="text-slate-400 text-sm mt-1">{isLoginView ? 'Đăng nhập vào hệ thống' : 'Tạo tài khoản mới'}</p>
          </div>

          {isLoginView ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold uppercase">Email</label>
                <input type="email" required placeholder="admin@gmail.com" className="w-full mt-1 p-3 bg-slate-700 rounded-lg border border-slate-600 text-white focus:outline-none focus:border-blue-500" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold uppercase">Mật Khẩu</label>
                <div className="relative mt-1">
                  <input type={showLoginPassword ? "text" : "password"} required placeholder="••••••••" className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 text-white pr-10 focus:outline-none focus:border-blue-500" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
                  <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showLoginPassword ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" />
                Ghi nhớ tài khoản
              </label>
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-lg transition shadow-lg">Đăng Nhập</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold uppercase">Họ tên</label>
                <input type="text" required placeholder="Nguyễn Văn A" className="w-full mt-1 p-3 bg-slate-700 rounded-lg border border-slate-600 text-white focus:outline-none focus:border-blue-500" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold uppercase">Email</label>
                <input type="email" required placeholder="user@gmail.com" className="w-full mt-1 p-3 bg-slate-700 rounded-lg border border-slate-600 text-white focus:outline-none focus:border-blue-500" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold uppercase">Mật khẩu</label>
                <div className="relative mt-1">
                  <input type={showRegPassword ? "text" : "password"} required placeholder="••••••••" className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 text-white pr-10 focus:outline-none focus:border-blue-500" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} />
                  <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showRegPassword ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold uppercase">Xác nhận mật khẩu</label>
                <div className="relative mt-1">
                  <input type={showConfirmPassword ? "text" : "password"} required placeholder="••••••••" className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 text-white pr-10 focus:outline-none focus:border-blue-500" value={registerForm.confirmPassword} onChange={e => setRegisterForm({...registerForm, confirmPassword: e.target.value})} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showConfirmPassword ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <button className="w-full py-3 bg-green-600 hover:bg-green-500 font-bold rounded-lg transition shadow-lg">Đăng Ký</button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-400">
            {isLoginView ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button className="text-blue-400 hover:underline font-semibold" onClick={() => setIsLoginView(!isLoginView)}>
              {isLoginView ? 'Đăng ký' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN APP VIEW =================
  const daysLeft = selectedTrip ? getDaysLeft(selectedTrip.startDate) : null;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* HEADER NAVBAR */}
      <nav className="bg-slate-900 text-white px-8 py-5 shadow-lg flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">✈️</span>
          <span className="text-2xl font-black text-blue-400 tracking-wider">TravelPlanner Pro</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>📌 Phân công & Source Code:</span>
          <a 
          href="href="https://github.com/nguyenthihuyentram/travel-planner-gc8f"" 
            target="_blank" 
              rel="noopener noreferrer"
          className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
          >
          GitHub Repo ↗
          </a>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right hidden sm:block">
            <p className="text-base font-bold text-slate-200">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
            Đăng Xuất
          </button>
        </div>
      </nav>

      {/* CONTAINER MỞ RỘNG KHÔNG GIAN FULL WIDTH */}
      <div className="max-w-[1600px] mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* SIDEBAR TRÁI (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* FORM TẠO CHUYẾN ĐI MỚI */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              ➕ Tạo Lịch Trình Mới
            </h2>
            <form onSubmit={handleAddTrip} className="space-y-3">
              <input type="text" placeholder="Tên chuyến đi (VD: Đi Đà Lạt 3N2Đ)" required className="w-full p-3 border rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500 text-black" value={tripForm.title} onChange={e => setTripForm({...tripForm, title: e.target.value})} />
              <input type="text" placeholder="Điểm đến (VD: Đà Lạt)" required className="w-full p-3 border rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500 text-black" value={tripForm.destination} onChange={e => setTripForm({...tripForm, destination: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Ngân sách (VNĐ)" className="p-3 border rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500 text-black" value={tripForm.budget} onChange={e => setTripForm({...tripForm, budget: e.target.value})} />
                <input type="date" min="2000-01-01" max="2099-12-31" className="p-3 border rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500 text-black" value={tripForm.startDate} onChange={e => setTripForm({...tripForm, startDate: e.target.value})} />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition text-base shadow-md">
                Khởi Tạo Chuyến Đi
              </button>
            </form>
          </div>

          {/* DỊCH VỤ: QUY ĐỔI TIỀN TỆ DU LỊCH */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              💱 Quy Đổi Tiền Tệ
            </h2>
            <div className="flex gap-2">
              <input type="number" className="p-2.5 border rounded-xl text-sm font-bold text-black w-1/2" value={currency.amount} onChange={e => setCurrency({...currency, amount: e.target.value})} />
              <select className="p-2.5 border rounded-xl text-sm font-bold text-black w-1/2" value={currency.type} onChange={e => setCurrency({...currency, type: e.target.value})}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="KRW">KRW (₩)</option>
              </select>
            </div>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs text-blue-600 font-bold block">Giá trị quy đổi VNĐ</span>
              <span className="text-xl font-black text-blue-900">
                {((currency.amount || 0) * rates[currency.type]).toLocaleString()} VNĐ
              </span>
            </div>
          </div>

          {/* DANH SÁCH CHUYẾN ĐI */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-extrabold text-slate-900">Danh Sách ({trips.length})</h2>
              <input type="text" placeholder="🔍 Tìm kiếm..." className="p-2 border rounded-xl text-xs w-36 outline-none text-black" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {filteredTrips.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Chưa có chuyến đi nào.</p>}
              {filteredTrips.map(trip => (
                <div key={trip.id} onClick={() => setSelectedTrip(trip)} className={`p-4 rounded-xl border flex justify-between items-center cursor-pointer transition ${selectedTrip?.id === trip.id ? 'bg-blue-50 border-blue-500 shadow-sm' : 'hover:bg-slate-50 border-slate-200'}`}>
                  <div>
                    <p className="font-bold text-base text-slate-900">{trip.title}</p>
                    <p className="text-xs text-slate-500 mt-1">📍 {trip.destination} {trip.startDate && `• 📅 ${trip.startDate}`}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id); }} className="text-slate-400 hover:text-red-500 font-bold text-base p-1">✕</button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CHI TIẾT CHUYẾN ĐI (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedTrip ? (
            <>
              {/* DASHBOARD HEADER BANNER */}
              <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-md relative overflow-hidden">
                <div className="flex flex-wrap justify-between items-center gap-4 z-10 relative">
                  <div>
                    <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">Chuyến đi đang chọn</span>
                    <h1 className="text-3xl font-black mt-2 text-white">{selectedTrip.title}</h1>
                    <p className="text-base text-slate-300 mt-1">📍 Địa điểm: <strong>{selectedTrip.destination}</strong></p>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-4 rounded-xl text-center min-w-[120px]">
                      <span className="text-xs text-slate-400 block font-semibold">Khởi hành</span>
                      <span className="text-xl font-black text-amber-400">
                        {daysLeft !== null ? (daysLeft > 0 ? `Còn ${daysLeft} ngày` : daysLeft === 0 ? 'Hôm nay!' : 'Đã đi') : 'Chưa đặt'}
                      </span>
                    </div>

                    <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-4 rounded-xl text-center min-w-[120px]">
                      <span className="text-xs text-slate-400 block font-semibold">Thời tiết</span>
                      <span className="text-xl font-black text-blue-300">☀️ 28°C</span>
                    </div>

                    <button onClick={handlePrint} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 p-4 rounded-xl text-white font-bold text-xs flex flex-col items-center gap-1">
                      <span>🖨️</span>
                      <span>Xuất PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* TAB NAVIGATION */}
              <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-3 pt-3 gap-3 overflow-x-auto">
                <button onClick={() => setActiveTab('itinerary')} className={`py-3 px-6 font-extrabold text-base rounded-t-xl transition flex items-center gap-2 ${activeTab === 'itinerary' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  📍 Lịch Trình
                </button>
                <button onClick={() => setActiveTab('passengers')} className={`py-3 px-6 font-extrabold text-base rounded-t-xl transition flex items-center gap-2 ${activeTab === 'passengers' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  👤 Người Đặt Vé & Hành Khách ({selectedTrip.passengers?.length || 0})
                </button>
                <button onClick={() => setActiveTab('checklist')} className={`py-3 px-6 font-extrabold text-base rounded-t-xl transition flex items-center gap-2 ${activeTab === 'checklist' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  ☑️ Hành Lý ({selectedTrip.checklist?.filter(i => i.done).length || 0}/{selectedTrip.checklist?.length || 0})
                </button>
                <button onClick={() => setActiveTab('expenses')} className={`py-3 px-6 font-extrabold text-base rounded-t-xl transition flex items-center gap-2 ${activeTab === 'expenses' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  💳 Chi Phí
                </button>
                <button onClick={() => setActiveTab('notes')} className={`py-3 px-6 font-extrabold text-base rounded-t-xl transition flex items-center gap-2 ${activeTab === 'notes' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  📝 Ghi Chú & Vé
                </button>
              </div>

              {/* TAB 1: LỊCH TRÌNH */}
              {activeTab === 'itinerary' && (
                <div className="bg-white p-6 rounded-b-2xl shadow-sm border border-t-0 border-slate-200 space-y-6">
                  <form onSubmit={handleAddLocation} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border">
                    <input type="text" placeholder="Tên địa điểm (Hồ Tuyền Lâm...)" required className="p-3 border rounded-xl text-base text-black" value={locationForm.name} onChange={e => setLocationForm({...locationForm, name: e.target.value})} />
                    <select className="p-3 border rounded-xl text-base text-black" value={locationForm.day} onChange={e => setLocationForm({...locationForm, day: e.target.value})}>
                      <option value="Ngày 1">Ngày 1</option>
                      <option value="Ngày 2">Ngày 2</option>
                      <option value="Ngày 3">Ngày 3</option>
                      <option value="Ngày 4">Ngày 4</option>
                    </select>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Ghi chú thêm..." className="w-full p-3 border rounded-xl text-base text-black" value={locationForm.note} onChange={e => setLocationForm({...locationForm, note: e.target.value})} />
                      <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 rounded-xl text-base shrink-0">Thêm</button>
                    </div>
                  </form>

                  <div className="space-y-3 max-h-[450px] overflow-y-auto">
                    {selectedTrip.locations.length === 0 && <p className="text-slate-400 text-base text-center py-8">Chưa có địa điểm tham quan nào trong lịch trình.</p>}
                    {selectedTrip.locations.map(loc => (
                      <div key={loc.id} className="p-4 bg-slate-50 border-l-4 border-green-500 rounded-r-xl flex justify-between items-center">
                        <div>
                          <span className="text-xs bg-green-100 text-green-800 font-bold px-3 py-1 rounded mr-3">{loc.day}</span>
                          <strong className="text-slate-800 text-base">{loc.name}</strong>
                          {loc.note && <p className="text-sm text-slate-500 mt-1">{loc.note}</p>}
                        </div>
                        <button onClick={() => updateCurrentTrip({ ...selectedTrip, locations: selectedTrip.locations.filter(l => l.id !== loc.id) })} className="text-slate-400 hover:text-red-500 font-bold text-sm">Xóa</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: THÔNG TIN NGƯỜI ĐẶT VÉ & HÀNH KHÁCH (CẬP NHẬT MỚI) */}
              {activeTab === 'passengers' && (
                <div className="bg-white p-6 rounded-b-2xl shadow-sm border border-t-0 border-slate-200 space-y-6">
                  {/* FORM THÊM HÀNH KHÁCH */}
                  <form onSubmit={handleAddPassenger} className="space-y-4 bg-slate-50 p-5 rounded-xl border">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      👤 Thêm Thông Tin Người Đặt Vé / Hành Khách
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input type="text" placeholder="Họ và Tên (VD: NGUYEN VAN A)" required className="p-3 border rounded-xl text-base text-black" value={passengerForm.fullName} onChange={e => setPassengerForm({...passengerForm, fullName: e.target.value})} />
                      <input type="text" placeholder="Số CCCD / Hộ chiếu" required className="p-3 border rounded-xl text-base text-black" value={passengerForm.idCard} onChange={e => setPassengerForm({...passengerForm, idCard: e.target.value})} />
                      <input type="tel" placeholder="Số điện thoại liên hệ" className="p-3 border rounded-xl text-base text-black" value={passengerForm.phone} onChange={e => setPassengerForm({...passengerForm, phone: e.target.value})} />
                      <input type="email" placeholder="Email nhận vé" className="p-3 border rounded-xl text-base text-black" value={passengerForm.email} onChange={e => setPassengerForm({...passengerForm, email: e.target.value})} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">📷 Tải ảnh CCCD / Hộ chiếu (để trình khi Check-in):</label>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-base shadow">Lưu Thông Tin Hành Khách</button>
                  </form>

                  {/* DANH SÁCH HÀNH KHÁCH ĐÃ LƯU */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-base">📋 Danh Sách Người Đặt Vé / Đi Cùng</h3>
                    {(!selectedTrip.passengers || selectedTrip.passengers.length === 0) && (
                      <p className="text-slate-400 text-sm text-center py-6">Chưa có thông tin hành khách nào được lưu.</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                      {selectedTrip.passengers?.map(p => (
                        <div key={p.id} className="p-4 bg-slate-50 border rounded-xl relative space-y-2">
                          <button onClick={() => updateCurrentTrip({ ...selectedTrip, passengers: selectedTrip.passengers.filter(item => item.id !== p.id) })} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 font-bold text-base">✕</button>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🪪</span>
                            <div>
                              <p className="font-extrabold text-slate-900 text-base">{p.fullName}</p>
                              <p className="text-xs text-blue-600 font-semibold">CCCD/Hộ chiếu: {p.idCard}</p>
                            </div>
                          </div>

                          <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200">
                            {p.phone && <p>📞 SĐT: <strong>{p.phone}</strong></p>}
                            {p.email && <p>✉️ Email: <strong>{p.email}</strong></p>}
                          </div>

                          {p.docImage && (
                            <div className="mt-2">
                              <p className="text-[10px] text-slate-400 mb-1">Ảnh giấy tờ:</p>
                              <img src={p.docImage} alt="CCCD/Hộ chiếu" className="w-full h-32 object-cover rounded-lg border" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CHECKLIST HÀNH LÝ */}
              {activeTab === 'checklist' && (
                <div className="bg-white p-6 rounded-b-2xl shadow-sm border border-t-0 border-slate-200 space-y-5">
                  <form onSubmit={handleAddChecklist} className="flex gap-3">
                    <input type="text" placeholder="Thêm đồ dùng cần mang (VD: Áo mưa, Giày thể thao...)" className="flex-1 p-3 border rounded-xl text-base text-black outline-none" value={checklistInput} onChange={e => setChecklistInput(e.target.value)} />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-xl text-base">Thêm Món</button>
                  </form>

                  <div className="space-y-3 max-h-[450px] overflow-y-auto">
                    {selectedTrip.checklist?.map(item => (
                      <div key={item.id} onClick={() => toggleChecklist(item.id)} className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${item.done ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-300'}`}>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={item.done} onChange={() => {}} className="w-5 h-5 accent-blue-600 rounded" />
                          <span className={`text-base font-semibold ${item.done ? 'line-through text-slate-500' : 'text-slate-800'}`}>{item.text}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); updateCurrentTrip({ ...selectedTrip, checklist: selectedTrip.checklist.filter(i => i.id !== item.id) }); }} className="text-slate-400 hover:text-red-500 font-bold text-sm">Xóa</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CHI PHÍ & THANH TOÁN HÓA ĐƠN */}
              {activeTab === 'expenses' && (
                <div className="bg-white p-6 rounded-b-2xl shadow-sm border border-t-0 border-slate-200 space-y-6">
                  <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between text-sm text-slate-300 font-semibold">
                      <span>Ngân sách dự kiến: {selectedTrip.budget.toLocaleString()} VNĐ</span>
                      <span>Đã chi: {totalSpent.toLocaleString()} VNĐ</span>
                    </div>
                    <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                      <div className={`h-full ${totalSpent > selectedTrip.budget ? 'bg-red-500' : 'bg-green-400'}`} style={{ width: `${Math.min((totalSpent / (selectedTrip.budget || 1)) * 100, 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center pt-1 text-base font-bold">
                      <span>Ngân sách còn lại:</span>
                      <span className={selectedTrip.budget - totalSpent < 0 ? 'text-red-400' : 'text-green-400'}>
                        {(selectedTrip.budget - totalSpent).toLocaleString()} VNĐ
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleAddExpense} className="space-y-3 bg-slate-50 p-4 rounded-xl border">
                    <h3 className="font-bold text-slate-800 text-sm">➕ Tạo Hóa Đơn / Thêm Khoản Chi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input type="text" placeholder="Nội dung (VD: Vé máy bay, Ăn tối...)" required className="p-3 border rounded-xl text-base text-black" value={expenseForm.title} onChange={e => setExpenseForm({...expenseForm, title: e.target.value})} />
                      <input type="number" placeholder="Số tiền (VNĐ)" required className="p-3 border rounded-xl text-base text-black" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <select className="p-3 border rounded-xl text-base text-black" value={expenseForm.method} onChange={e => setExpenseForm({...expenseForm, method: e.target.value})}>
                        <option value="Tiền mặt">💵 Tiền mặt</option>
                        <option value="Chuyển khoản (VietQR)">🏦 Chuyển khoản (VietQR)</option>
                      </select>

                      {expenseForm.method === 'Chuyển khoản (VietQR)' && (
                        <>
                          <select className="p-3 border rounded-xl text-base text-black" value={expenseForm.bank} onChange={e => setExpenseForm({...expenseForm, bank: e.target.value})}>
                            <option value="MBBank">MBBank</option>
                            <option value="Vietcombank">Vietcombank</option>
                            <option value="Techcombank">Techcombank</option>
                            <option value="VPBank">VPBank</option>
                            <option value="ACB">ACB</option>
                          </select>
                          <input type="text" placeholder="Số tài khoản nhận" required className="p-3 border rounded-xl text-base text-black" value={expenseForm.accountNo} onChange={e => setExpenseForm({...expenseForm, accountNo: e.target.value})} />
                        </>
                      )}
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-base shadow">Lưu Hóa Đơn Chi Phí</button>
                  </form>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    <h3 className="font-bold text-slate-800 text-sm">📋 Danh Sách Hóa Đơn</h3>
                    {selectedTrip.expenses.length === 0 && <p className="text-slate-400 text-sm text-center py-6">Chưa có hóa đơn nào.</p>}
                    {selectedTrip.expenses.map(exp => (
                      <div key={exp.id} className="p-4 bg-slate-50 border rounded-xl flex flex-wrap justify-between items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${exp.paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {exp.paid ? '🟢 Đã thanh toán' : '⏳ Chờ thanh toán'}
                            </span>
                            <span className="text-xs text-slate-400">📅 {exp.date}</span>
                          </div>
                          <p className="font-bold text-base text-slate-900 mt-1">{exp.title}</p>
                          <p className="text-xs text-slate-500">PTTT: {exp.method} {exp.bank ? `(${exp.bank} - ${exp.accountNo})` : ''}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-slate-900 text-lg">{exp.amount.toLocaleString()} VNĐ</span>
                          
                          {exp.method === 'Chuyển khoản (VietQR)' && exp.accountNo && (
                            <button onClick={() => setActiveBill(exp)} className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition">
                              📲 QR Trả Tiền
                            </button>
                          )}

                          <button onClick={() => toggleExpenseStatus(exp.id)} className={`text-xs font-bold px-3 py-2 rounded-lg transition ${exp.paid ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                            {exp.paid ? 'Đổi trạng thái' : 'Đánh dấu xong'}
                          </button>

                          <button onClick={() => updateCurrentTrip({ ...selectedTrip, expenses: selectedTrip.expenses.filter(e => e.id !== exp.id) })} className="text-slate-400 hover:text-red-500 font-bold text-base p-1">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: GHI CHÚ VÀ LƯU VÉ */}
              {activeTab === 'notes' && (
                <div className="bg-white p-6 rounded-b-2xl shadow-sm border border-t-0 border-slate-200 space-y-5">
                  <form onSubmit={handleAddNote} className="space-y-3 bg-slate-50 p-4 rounded-xl border">
                    <input type="text" placeholder="Tiêu đề (Mã đặt chỗ máy bay, Mã phòng...)" required className="w-full p-3 border rounded-xl text-base text-black" value={noteForm.title} onChange={e => setNoteForm({...noteForm, title: e.target.value})} />
                    <textarea placeholder="Nội dung chi tiết..." rows="3" className="w-full p-3 border rounded-xl text-base text-black" value={noteForm.content} onChange={e => setNoteForm({...noteForm, content: e.target.value})}></textarea>
                    <button className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-xl text-base">Lưu Ghi Chú</button>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto">
                    {selectedTrip.notes?.map(note => (
                      <div key={note.id} className="p-4 bg-amber-50 border border-amber-200 rounded-xl relative">
                        <button onClick={() => updateCurrentTrip({ ...selectedTrip, notes: selectedTrip.notes.filter(n => n.id !== note.id) })} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 font-bold text-sm">✕</button>
                        <h4 className="font-bold text-base text-amber-900">{note.title}</h4>
                        <p className="text-sm text-amber-800 mt-2 whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-16 rounded-2xl border text-center text-slate-400 text-lg">
              Vui lòng chọn hoặc tạo chuyến đi để xem đầy đủ các tính năng.
            </div>
          )}
        </div>

      </div>

      {/* POPUP MODAL XEM MÃ QR THANH TOÁN VIETQR */}
      {activeBill && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button onClick={() => setActiveBill(null)} className="absolute top-3 right-4 text-slate-400 hover:text-red-500 text-xl font-bold">✕</button>
            <h3 className="font-black text-xl text-slate-900">Quét Mã Chuyển Khoản</h3>
            <p className="text-xs text-slate-500">Mã QR tạo tự động theo ngân hàng và số tiền</p>
            
            <div className="bg-slate-50 p-4 rounded-xl border flex justify-center">
              <img 
                src={`https://img.vietqr.io/image/${activeBill.bank}-${activeBill.accountNo}-compact2.png?amount=${activeBill.amount}&addInfo=${encodeURIComponent(activeBill.title)}`} 
                alt="Mã VietQR Thanh Toán" 
                className="w-64 h-64 object-contain rounded-lg shadow-sm"
              />
            </div>

            <div className="text-left bg-slate-100 p-3 rounded-xl text-xs space-y-1 text-slate-700 font-semibold">
              <p>📍 Khoản chi: <strong>{activeBill.title}</strong></p>
              <p>💵 Số tiền: <strong className="text-blue-600">{activeBill.amount.toLocaleString()} VNĐ</strong></p>
              <p>🏦 Ngân hàng: <strong>{activeBill.bank}</strong></p>
              <p>💳 STK: <strong>{activeBill.accountNo}</strong></p>
            </div>

            <button onClick={() => { toggleExpenseStatus(activeBill.id); setActiveBill(null); }} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm transition">
              Xác Nhận Đã Thanh Toán
            </button>
          </div>
        </div>
      )}

    </div>
  );
}