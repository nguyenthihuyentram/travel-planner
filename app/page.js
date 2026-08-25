'use client';
import { useState, useEffect } from 'react';

export default function TravelPlanner() {
  // --- STATE AUTHENTICATION ---
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  
  // State điều khiển ẩn/hiện mật khẩu
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forms Auth
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  // --- STATE DỮ LIỆU CHUYẾN ĐI ---
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Forms Chức năng
  const [tripForm, setTripForm] = useState({ title: '', destination: '', budget: '' });
  const [locationForm, setLocationForm] = useState({ name: '', day: 'Ngày 1', note: '' });
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '' });

  // Tải dữ liệu ban đầu
  useEffect(() => {
    const savedSession = localStorage.getItem('app_user_session');
    const rememberedEmail = localStorage.getItem('remembered_email');
    
    if (rememberedEmail) {
      setLoginForm(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }

    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }

    const savedTrips = localStorage.getItem('my_travel_trips');
    if (savedTrips) {
      const parsed = JSON.parse(savedTrips);
      setTrips(parsed);
      if (parsed.length > 0) setSelectedTrip(parsed[0]);
    }
  }, []);

  // Đồng bộ lịch trình
  useEffect(() => {
    localStorage.setItem('my_travel_trips', JSON.stringify(trips));
  }, [trips]);

  // Xử lý Đăng ký
  const handleRegister = (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      return alert('Vui lòng điền đầy đủ thông tin!');
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      return alert('Mật khẩu xác nhận không trùng khớp!');
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    if (registeredUsers.some(u => u.email === registerForm.email)) {
      return alert('Email này đã được đăng ký!');
    }

    const newUser = { name: registerForm.name, email: registerForm.email, password: registerForm.password };
    registeredUsers.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    setLoginForm({ email: registerForm.email, password: '' });
    setIsLoginView(true);
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  // Xử lý Đăng nhập
  const handleLogin = (e) => {
    e.preventDefault();
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const foundUser = registeredUsers.find(
      u => u.email === loginForm.email && u.password === loginForm.password
    );

    if (!foundUser) {
      return alert('Email hoặc mật khẩu không chính xác!');
    }

    if (rememberMe) {
      localStorage.setItem('remembered_email', loginForm.email);
    } else {
      localStorage.removeItem('remembered_email');
    }

    const userData = { name: foundUser.name, email: foundUser.email };
    setUser(userData);
    localStorage.setItem('app_user_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('app_user_session');
  };

  const handleAddTrip = (e) => {
    e.preventDefault();
    if (!tripForm.title || !tripForm.destination) return;
    const newTrip = {
      id: Date.now(),
      title: tripForm.title,
      destination: tripForm.destination,
      budget: Number(tripForm.budget) || 0,
      locations: [],
      expenses: []
    };
    const updated = [newTrip, ...trips];
    setTrips(updated);
    setSelectedTrip(newTrip);
    setTripForm({ title: '', destination: '', budget: '' });
  };

  const handleDeleteTrip = (id) => {
    const updated = trips.filter(t => t.id !== id);
    setTrips(updated);
    if (selectedTrip?.id === id) setSelectedTrip(updated[0] || null);
  };

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!selectedTrip || !locationForm.name) return;
    const newLoc = { id: Date.now(), ...locationForm };
    const updatedTrip = { ...selectedTrip, locations: [...selectedTrip.locations, newLoc] };
    updateCurrentTrip(updatedTrip);
    setLocationForm({ name: '', day: 'Ngày 1', note: '' });
  };

  const handleDeleteLocation = (id) => {
    const updatedTrip = { ...selectedTrip, locations: selectedTrip.locations.filter(l => l.id !== id) };
    updateCurrentTrip(updatedTrip);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!selectedTrip || !expenseForm.title || !expenseForm.amount) return;
    const newExp = { id: Date.now(), title: expenseForm.title, amount: Number(expenseForm.amount) };
    const updatedTrip = { ...selectedTrip, expenses: [...selectedTrip.expenses, newExp] };
    updateCurrentTrip(updatedTrip);
    setExpenseForm({ title: '', amount: '' });
  };

  const handleDeleteExpense = (id) => {
    const updatedTrip = { ...selectedTrip, expenses: selectedTrip.expenses.filter(e => e.id !== id) };
    updateCurrentTrip(updatedTrip);
  };

  const updateCurrentTrip = (updatedTrip) => {
    setSelectedTrip(updatedTrip);
    setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  };

  const totalSpent = selectedTrip ? selectedTrip.expenses.reduce((sum, item) => sum + item.amount, 0) : 0;
  const filteredTrips = trips.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-blue-400">TravelPlanner Pro</h1>
            <p className="text-slate-400 text-sm mt-1">
              {isLoginView ? 'Đăng nhập vào hệ thống' : 'Tạo tài khoản mới'}
            </p>
          </div>

          {isLoginView ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold uppercase">Email Account</label>
                <input
                  type="email" required placeholder="admin@gmail.com"
                  className="w-full mt-1 p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-blue-500 text-white"
                  value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold uppercase">Mật Khẩu</label>
                <div className="relative mt-1">
                  <input
                    type={showLoginPassword ? "text" : "password"} required placeholder="••••••••"
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-blue-500 text-white pr-10"
                    value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-base select-none"
                  >
                    {showLoginPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                  Ghi nhớ tài khoản
                </label>
              </div>

              <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-lg transition shadow-lg mt-2">
                Đăng Nhập Hệ Thống
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold uppercase">Họ và Tên</label>
                <input
                  type="text" required placeholder="Nguyễn Văn A"
                  className="w-full mt-1 p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-blue-500 text-white"
                  value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold uppercase">Email</label>
                <input
                  type="email" required placeholder="user@gmail.com"
                  className="w-full mt-1 p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-blue-500 text-white"
                  value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold uppercase">Mật Khẩu</label>
                <div className="relative mt-1">
                  <input
                    type={showRegPassword ? "text" : "password"} required placeholder="••••••••"
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-blue-500 text-white pr-10"
                    value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-base select-none"
                  >
                    {showRegPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold uppercase">Xác Nhận Mật Khẩu</label>
                <div className="relative mt-1">
                  <input
                    type={showConfirmPassword ? "text" : "password"} required placeholder="••••••••"
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-blue-500 text-white pr-10"
                    value={registerForm.confirmPassword} onChange={e => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-base select-none"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button className="w-full py-3 bg-green-600 hover:bg-green-500 font-bold rounded-lg transition shadow-lg mt-2">
                Tạo Tài Khoản Mới
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-400">
            {isLoginView ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button
              className="text-blue-400 hover:underline font-semibold"
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="bg-slate-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">✈️</span>
          <span className="text-xl font-bold tracking-wide text-blue-400">TravelPlanner Pro</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"
          >
            Đăng Xuất
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">➕ Tạo Lịch Trình Mới</h2>
            <form onSubmit={handleAddTrip} className="space-y-3">
              <input
                type="text" placeholder="Tên chuyến đi"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                value={tripForm.title} onChange={e => setTripForm({...tripForm, title: e.target.value})}
              />
              <input
                type="text" placeholder="Điểm đến"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                value={tripForm.destination} onChange={e => setTripForm({...tripForm, destination: e.target.value})}
              />
              <input
                type="number" placeholder="Ngân sách (VNĐ)"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                value={tripForm.budget} onChange={e => setTripForm({...tripForm, budget: e.target.value})}
              />
              <button className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition">
                Tạo Chuyến Đi
              </button>
            </form>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-slate-900">Danh Sách ({trips.length})</h2>
              <input
                type="text" placeholder="🔍 Tìm kiếm..."
                className="p-1.5 border rounded-lg text-xs w-36 outline-none text-black"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTrips.map(trip => (
                <div
                  key={trip.id}
                  onClick={() => setSelectedTrip(trip)}
                  className={`p-3 rounded-lg border flex justify-between items-center cursor-pointer transition ${selectedTrip?.id === trip.id ? 'bg-blue-50 border-blue-500' : 'hover:bg-slate-50'}`}
                >
                  <div>
                    <p className="font-bold text-slate-800">{trip.title}</p>
                    <p className="text-xs text-slate-500">📍 {trip.destination}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id); }}
                    className="text-slate-400 hover:text-red-500 text-sm font-bold px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">📍 Địa Điểm Tham Quan</h2>
          {selectedTrip ? (
            <>
              <form onSubmit={handleAddLocation} className="space-y-3 mb-6 bg-slate-50 p-4 rounded-lg">
                <input
                  type="text" placeholder="Tên địa điểm"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
                  value={locationForm.name} onChange={e => setLocationForm({...locationForm, name: e.target.value})}
                />
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
                  value={locationForm.day} onChange={e => setLocationForm({...locationForm, day: e.target.value})}
                >
                  <option value="Ngày 1">Ngày 1</option>
                  <option value="Ngày 2">Ngày 2</option>
                  <option value="Ngày 3">Ngày 3</option>
                  <option value="Ngày 4">Ngày 4</option>
                </select>
                <input
                  type="text" placeholder="Ghi chú"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
                  value={locationForm.note} onChange={e => setLocationForm({...locationForm, note: e.target.value})}
                />
                <button className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition">
                  Thêm Địa Điểm
                </button>
              </form>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {selectedTrip.locations.map(loc => (
                  <div key={loc.id} className="p-3 border-l-4 border-green-500 bg-slate-50 rounded-lg flex justify-between items-start">
                    <div>
                      <span className="text-xs bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded mr-2">{loc.day}</span>
                      <strong className="text-slate-800">{loc.name}</strong>
                      {loc.note && <p className="text-xs text-slate-500 mt-1">{loc.note}</p>}
                    </div>
                    <button onClick={() => handleDeleteLocation(loc.id)} className="text-slate-400 hover:text-red-500 text-xs font-bold">
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">Vui lòng chọn hoặc tạo chuyến đi.</div>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">💵 Quản Lý Chi Phí</h2>
          {selectedTrip ? (
            <>
              <div className="bg-slate-900 text-white p-4 rounded-xl mb-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Dự kiến: {selectedTrip.budget.toLocaleString()} VNĐ</span>
                  <span>Đã tiêu: {totalSpent.toLocaleString()} VNĐ</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${totalSpent > selectedTrip.budget ? 'bg-red-500' : 'bg-green-400'}`}
                    style={{ width: `${Math.min((totalSpent / (selectedTrip.budget || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs font-semibold">Còn lại:</span>
                  <span className={`font-bold ${selectedTrip.budget - totalSpent < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {(selectedTrip.budget - totalSpent).toLocaleString()} VNĐ
                  </span>
                </div>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-3 mb-6 bg-slate-50 p-4 rounded-lg">
                <input
                  type="text" placeholder="Khoản chi"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-black"
                  value={expenseForm.title} onChange={e => setExpenseForm({...expenseForm, title: e.target.value})}
                />
                <input
                  type="number" placeholder="Số tiền (VNĐ)"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-black"
                  value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                />
                <button className="w-full bg-orange-600 text-white font-semibold py-2 rounded-lg hover:bg-orange-700 transition">
                  Thêm Chi Phí
                </button>
              </form>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {selectedTrip.expenses.map(exp => (
                  <div key={exp.id} className="flex justify-between items-center p-2.5 border-b text-sm">
                    <span className="text-slate-700 font-medium">{exp.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">{exp.amount.toLocaleString()} đ</span>
                      <button onClick={() => handleDeleteExpense(exp.id)} className="text-slate-400 hover:text-red-500 text-xs font-bold">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">Vui lòng chọn hoặc tạo chuyến đi.</div>
          )}
        </div>
      </div>
    </div>
  );
}