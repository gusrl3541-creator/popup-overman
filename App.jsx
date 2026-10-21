import React, { useState, useMemo } from 'react';
import {
  Users,
  Calendar,
  Store,
  AlertTriangle,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Copy,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertCircle,
  Briefcase,
  UserCheck,
  ShieldAlert,
  Download,
  Info
} from 'lucide-react';

// --- INITIAL PRESET DATA ---
const INITIAL_STORES = [
  {
    id: 'gangnam',
    name: '강남 신세계점',
    color: 'border-l-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20',
    badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    minStaff: 4,
    operatingHours: '10:30 - 20:00',
    shifts: ['오전 (10:00-15:30)', '오후 (15:00-20:30)', '풀타임 (10:00-20:00)']
  },
  {
    id: 'daegu',
    name: '대구 신세계점',
    color: 'border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    minStaff: 3,
    operatingHours: '10:30 - 20:00',
    shifts: ['오전 (10:00-15:30)', '오후 (15:00-20:30)', '풀타임 (10:00-20:00)']
  },
  {
    id: 'gwangju',
    name: '광주 신세계점',
    color: 'border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/20',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    minStaff: 3,
    operatingHours: '10:30 - 20:00',
    shifts: ['오전 (10:00-15:30)', '오후 (15:00-20:30)', '풀타임 (10:00-20:00)']
  }
];

const INITIAL_STAFF = [
  { id: 'st_1', name: '김민준', role: '메인 매니저', type: '정직원', skills: ['POS/결제', '매장총괄', '재고관리'], hourlyRate: 15000, phone: '010-1234-5678', color: 'bg-blue-500' },
  { id: 'st_2', name: '이서연', role: '시식/호객 팀장', type: '정직원', skills: ['시식/호객', '멘트진행', '오징어구이'], hourlyRate: 13000, phone: '010-2345-6789', color: 'bg-purple-500' },
  { id: 'st_3', name: '박도현', role: 'POS & 정산', type: '알바', skills: ['POS/결제', '포장', '카운터'], hourlyRate: 10500, phone: '010-3456-7890', color: 'bg-emerald-500' },
  { id: 'st_4', name: '최지우', role: '시식 지원', type: '알바', skills: ['시식/호객', '위생관리', '어포튀각'], hourlyRate: 10000, phone: '010-4567-8901', color: 'bg-amber-500' },
  { id: 'st_5', name: '정현우', role: '재고 및 세팅', type: '알바', skills: ['재고관리', '포장', '박스작업'], hourlyRate: 10000, phone: '010-5678-9012', color: 'bg-rose-500' },
  { id: 'st_6', name: '강유진', role: '판매 및 스태프', type: '알바', skills: ['POS/결제', '시식/호객', '포장'], hourlyRate: 10000, phone: '010-6789-0123', color: 'bg-teal-500' },
  { id: 'st_7', name: '윤아름', role: '시식지원/멘트', type: '알바', skills: ['시식/호객', '먹태소진'], hourlyRate: 10200, phone: '010-7890-1234', color: 'bg-indigo-500' },
  { id: 'st_8', name: '임성민', role: '카운터 지원', type: '알바', skills: ['POS/결제', '고객응대'], hourlyRate: 10000, phone: '010-8901-2345', color: 'bg-orange-500' }
];

const SHIFT_TYPES = [
  { id: 'morning', label: '오전조', hours: '10:00 - 15:30', duration: 5.5, color: 'bg-sky-100 text-sky-800 border-sky-300' },
  { id: 'afternoon', label: '오후조', hours: '15:00 - 20:30', duration: 5.5, color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'full', label: '풀타임', hours: '10:00 - 20:00', duration: 9.0, color: 'bg-indigo-100 text-indigo-800 border-indigo-300' }
];

// Preset Schedule (Y-M-D)
const generateInitialSchedules = () => {
  const today = new Date();
  const dateStr = (offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  return [
    { id: 'sch_1', date: dateStr(0), storeId: 'gangnam', staffId: 'st_1', shiftId: 'full', roleAssigned: '메인 매니저' },
    { id: 'sch_2', date: dateStr(0), storeId: 'gangnam', staffId: 'st_3', shiftId: 'morning', roleAssigned: 'POS/결제' },
    { id: 'sch_3', date: dateStr(0), storeId: 'gangnam', staffId: 'st_4', shiftId: 'morning', roleAssigned: '시식/호객' },
    { id: 'sch_4', date: dateStr(0), storeId: 'gangnam', staffId: 'st_6', shiftId: 'afternoon', roleAssigned: '판매지원' },
    { id: 'sch_5', date: dateStr(0), storeId: 'daegu', staffId: 'st_2', shiftId: 'full', roleAssigned: '대구 책임자' },
    { id: 'sch_6', date: dateStr(0), storeId: 'daegu', staffId: 'st_5', shiftId: 'morning', roleAssigned: '재고/세팅' },
    { id: 'sch_7', date: dateStr(0), storeId: 'daegu', staffId: 'st_7', shiftId: 'afternoon', roleAssigned: '시식지원' },
    { id: 'sch_8', date: dateStr(0), storeId: 'gwangju', staffId: 'st_8', shiftId: 'full', roleAssigned: '광주 담당' },
    { id: 'sch_9', date: dateStr(1), storeId: 'gangnam', staffId: 'st_1', shiftId: 'full', roleAssigned: '메인 매니저' },
    { id: 'sch_10', date: dateStr(1), storeId: 'daegu', staffId: 'st_2', shiftId: 'full', roleAssigned: '대구 매니저' }
  ];
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('schedule'); // schedule | staff | stores | analytics | print
  const [stores, setStores] = useState(INITIAL_STORES);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [schedules, setSchedules] = useState(generateInitialSchedules());
  
  // Date State
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('all');

  // Modal / Form States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({ storeId: 'gangnam', staffId: '', shiftId: 'morning', roleAssigned: '' });
  const [editingStaff, setEditingStaff] = useState(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState('');

  // Form handlers for staff
  const [staffForm, setStaffForm] = useState({ name: '', role: '', type: '알바', skills: '', hourlyRate: 10000, phone: '' });

  // Handle Date Navigation
  const changeDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // --- CONFLICT & WARNING SYSTEM LOGIC ---
  const conflicts = useMemo(() => {
    const warnings = [];
    
    // 1. Double Assignment Conflict (Same staff assigned to multiple stores or overlaps on same date)
    const staffDateMap = {};
    schedules.forEach((sch) => {
      const key = `${sch.staffId}_${sch.date}`;
      if (!staffDateMap[key]) {
        staffDateMap[key] = [];
      }
      staffDateMap[key].push(sch);
    });

    Object.entries(staffDateMap).forEach(([key, items]) => {
      if (items.length > 1) {
        const staff = staffList.find((s) => s.id === items[0].staffId);
        const date = items[0].date;
        const storeNames = items.map((i) => stores.find((st) => st.id === i.storeId)?.name).join(', ');
        warnings.push({
          id: `conflict_${key}`,
          type: 'OVERLAP',
          date: date,
          staffName: staff?.name || '근무자',
          message: `[중복배치 경고] ${staff?.name}님이 ${date}에 여러 매장(${storeNames})에 동시 배치되었습니다!`,
          severity: 'high'
        });
      }
    });

    // 2. Minimum Staff Threshold Check per Store on selectedDate
    stores.forEach((store) => {
      const assignedCount = schedules.filter((s) => s.date === selectedDate && s.storeId === store.id).length;
      if (assignedCount < store.minStaff) {
        warnings.push({
          id: `understaff_${store.id}_${selectedDate}`,
          type: 'UNDERSTAFFED',
          date: selectedDate,
          storeName: store.name,
          message: `[인원미달 경고] ${store.name}의 ${selectedDate} 배치 인원(${assignedCount}명)이 최소 권장 인원(${store.minStaff}명)보다 부족합니다.`,
          severity: 'medium'
        });
      }
    });

    // 3. Excessive Hours Alert (> 12 hours in a single day)
    Object.entries(staffDateMap).forEach(([key, items]) => {
      let totalHours = 0;
      items.forEach((item) => {
        const shift = SHIFT_TYPES.find((st) => st.id === item.shiftId);
        if (shift) totalHours += shift.duration;
      });
      if (totalHours > 10) {
        const staff = staffList.find((s) => s.id === items[0].staffId);
        warnings.push({
          id: `overtime_${key}`,
          type: 'OVERTIME',
          date: items[0].date,
          staffName: staff?.name,
          message: `[근무시간 과다] ${staff?.name}님의 ${items[0].date} 일일 예정 근무시간이 ${totalHours}시간입니다. (피로도 유의)`,
          severity: 'low'
        });
      }
    });

    return warnings;
  }, [schedules, selectedDate, stores, staffList]);

  // Current Date Specific Conflicts
  const currentDateConflicts = useMemo(() => {
    return conflicts.filter((c) => c.date === selectedDate);
  }, [conflicts, selectedDate]);

  // --- STATS & COST CALCULATIONS ---
  const dailyCost = useMemo(() => {
    let total = 0;
    schedules
      .filter((s) => s.date === selectedDate)
      .forEach((sch) => {
        const staff = staffList.find((st) => st.id === sch.staffId);
        const shift = SHIFT_TYPES.find((sh) => sh.id === sch.shiftId);
        if (staff && shift) {
          total += staff.hourlyRate * shift.duration;
        }
      });
    return total;
  }, [schedules, selectedDate, staffList]);

  // Handle Schedule Assignment
  const handleAssignShift = (e) => {
    e.preventDefault();
    if (!assignForm.staffId) return;

    const newSchedule = {
      id: `sch_${Date.now()}`,
      date: selectedDate,
      storeId: assignForm.storeId,
      staffId: assignForm.staffId,
      shiftId: assignForm.shiftId,
      roleAssigned: assignForm.roleAssigned || '일반 지원'
    };

    setSchedules((prev) => [...prev, newSchedule]);
    setIsAssignModalOpen(false);
    setAssignForm({ storeId: 'gangnam', staffId: '', shiftId: 'morning', roleAssigned: '' });
  };

  const handleDeleteSchedule = (schId) => {
    setSchedules((prev) => prev.filter((s) => s.id !== schId));
  };

  // Staff Management Handlers
  const handleSaveStaff = (e) => {
    e.preventDefault();
    const skillsArray = typeof staffForm.skills === 'string' 
      ? staffForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      : staffForm.skills;

    if (editingStaff) {
      setStaffList((prev) =>
        prev.map((st) =>
          st.id === editingStaff.id
            ? { ...st, ...staffForm, skills: skillsArray }
            : st
        )
      );
    } else {
      const newStaff = {
        id: `st_${Date.now()}`,
        ...staffForm,
        skills: skillsArray,
        color: ['bg-pink-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500'][Math.floor(Math.random() * 5)]
      };
      setStaffList((prev) => [...prev, newStaff]);
    }
    setIsStaffModalOpen(false);
    setEditingStaff(null);
    setStaffForm({ name: '', role: '', type: '알바', skills: '', hourlyRate: 10000, phone: '' });
  };

  const openEditStaff = (staff) => {
    setEditingStaff(staff);
    setStaffForm({
      name: staff.name,
      role: staff.role,
      type: staff.type,
      skills: staff.skills.join(', '),
      hourlyRate: staff.hourlyRate,
      phone: staff.phone
    });
    setIsStaffModalOpen(true);
  };

  const handleDeleteStaff = (id) => {
    if (confirm('해당 근무자를 삭제하시겠습니까? 관련된 근무 스케줄도 함께 정리됩니다.')) {
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      setSchedules((prev) => prev.filter((sch) => sch.staffId !== id));
    }
  };

  // Export Daily Roster Text to Clipboard
  const copyRosterText = () => {
    let text = `📢 [팝업스토어 근무배치표] - ${selectedDate}\n\n`;
    stores.forEach((store) => {
      text += `📍 ${store.name} (운영시간: ${store.operatingHours})\n`;
      const storeSchs = schedules.filter((s) => s.date === selectedDate && s.storeId === store.id);
      if (storeSchs.length === 0) {
        text += `  - 배치 인원 없음\n`;
      } else {
        storeSchs.forEach((sch) => {
          const staff = staffList.find((s) => s.id === sch.staffId);
          const shift = SHIFT_TYPES.find((sh) => sh.id === sch.shiftId);
          text += `  • [${shift?.label}] ${staff?.name} (${sch.roleAssigned}) - ${staff?.phone}\n`;
        });
      }
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedNotice('텍스트가 클립보드에 복사되었습니다! 카카오톡이나 밴드에 공유하세요.');
    setTimeout(() => setCopiedNotice(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* --- TOP HEADER --- */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl font-bold shadow-lg flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wide">팝업스토어 인원배치 및 스케줄러</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Popup Store Staff Schedule & Cost Manager</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2 bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setCurrentTab('schedule')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentTab === 'schedule' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>배치표</span>
            </button>

            <button
              onClick={() => setCurrentTab('staff')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentTab === 'staff' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>근무자 명단 ({staffList.length})</span>
            </button>

            <button
              onClick={() => setCurrentTab('stores')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentTab === 'stores' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>점포 설정</span>
            </button>

            <button
              onClick={() => setCurrentTab('print')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentTab === 'print' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">현장 출력용</span>
            </button>
          </nav>
        </div>
      </header>

      {/* --- WARNING / ALERT BANNER --- */}
      {currentDateConflicts.length > 0 && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm font-medium">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-slate-950 flex-shrink-0 animate-bounce" />
              <span>
                <strong>근무배치 주의알림 ({currentDateConflicts.length}건):</strong>{' '}
                {currentDateConflicts[0].message}
              </span>
            </div>
            {currentDateConflicts.length > 1 && (
              <span className="bg-slate-900/10 px-2 py-0.5 rounded text-xs font-bold">
                외 {currentDateConflicts.length - 1}건 더 있음
              </span>
            )}
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ================= TAB 1: INTERACTIVE SCHEDULE BOARD ================= */}
        {currentTab === 'schedule' && (
          <div className="space-y-6">
            {/* Control Bar: Date Selector & Quick Summary */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Date Controller */}
              <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => changeDate(-1)}
                    className="p-2 hover:bg-white rounded-lg transition text-slate-600 hover:text-slate-900"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent font-bold text-slate-800 text-sm focus:outline-none px-2 cursor-pointer"
                  />
                  <button
                    onClick={() => changeDate(1)}
                    className="p-2 hover:bg-white rounded-lg transition text-slate-600 hover:text-slate-900"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  오늘
                </button>
              </div>

              {/* Store Filter */}
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">점포 필터:</span>
                <select
                  value={selectedStoreFilter}
                  onChange={(e) => setSelectedStoreFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">전체 점포 보기</option>
                  {stores.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="ml-auto flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>근무 배치 등록</span>
                </button>
              </div>
            </div>

            {/* Daily Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">당일 총 배치 인원</p>
                  <p className="text-lg font-bold text-slate-800">
                    {schedules.filter((s) => s.date === selectedDate).length} 명
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">당일 예상 인건비</p>
                  <p className="text-lg font-bold text-slate-800">
                    {dailyCost.toLocaleString()} 원
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">배치 경고 상태</p>
                  <p className={`text-sm font-bold ${currentDateConflicts.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {currentDateConflicts.length > 0 ? `주의 ${currentDateConflicts.length}건 발생` : '정상 배치됨'}
                  </p>
                </div>
              </div>
            </div>

            {/* STORE SHIFT GRID BOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {stores
                .filter((st) => selectedStoreFilter === 'all' || selectedStoreFilter === st.id)
                .map((store) => {
                  const storeSchedules = schedules.filter(
                    (s) => s.date === selectedDate && s.storeId === store.id
                  );
                  const isUnderstaffed = storeSchedules.length < store.minStaff;

                  return (
                    <div
                      key={store.id}
                      className={`bg-white rounded-2xl border-2 ${store.color} shadow-sm overflow-hidden flex flex-col justify-between`}
                    >
                      {/* Store Card Header */}
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${store.badgeBg}`}>
                              {store.name}
                            </span>
                            {isUnderstaffed && (
                              <span className="flex items-center text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                                <AlertTriangle className="w-3 h-3 mr-1" /> 인원부족
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-slate-400" />
                            운영: {store.operatingHours} (최소 {store.minStaff}명 필요)
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setAssignForm((prev) => ({ ...prev, storeId: store.id }));
                            setIsAssignModalOpen(true);
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg transition"
                          title="인원 추가"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Shift Roster List */}
                      <div className="p-4 space-y-3 flex-1">
                        {SHIFT_TYPES.map((shift) => {
                          const shiftSchedules = storeSchedules.filter((s) => s.shiftId === shift.id);

                          return (
                            <div key={shift.id} className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${shift.color}`}>
                                  {shift.label} ({shift.hours})
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {shiftSchedules.length}명 배치
                                </span>
                              </div>

                              {shiftSchedules.length === 0 ? (
                                <p className="text-xs text-slate-400 italic py-1 text-center bg-white/50 rounded border border-dashed border-slate-200">
                                  배치된 인원이 없습니다.
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {shiftSchedules.map((sch) => {
                                    const staff = staffList.find((st) => st.id === sch.staffId);
                                    const hasConflict = conflicts.some(
                                      (c) => c.date === selectedDate && c.staffName === staff?.name && c.type === 'OVERLAP'
                                    );

                                    return (
                                      <div
                                        key={sch.id}
                                        className={`bg-white p-2.5 rounded-lg border shadow-xs flex items-center justify-between transition ${
                                          hasConflict ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200 hover:border-indigo-200'
                                        }`}
                                      >
                                        <div className="flex items-center space-x-2">
                                          <div className={`w-2 h-2 rounded-full ${staff?.color || 'bg-slate-400'}`} />
                                          <div>
                                            <div className="flex items-center space-x-1.5">
                                              <span className="text-xs font-bold text-slate-800">{staff?.name || '근무자'}</span>
                                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                                {staff?.type}
                                              </span>
                                              {hasConflict && (
                                                <AlertCircle className="w-3.5 h-3.5 text-amber-500" title="중복 배치 발생" />
                                              )}
                                            </div>
                                            <p className="text-[11px] text-indigo-600 font-medium mt-0.5">
                                              담당: {sch.roleAssigned}
                                            </p>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => handleDeleteSchedule(sch.id)}
                                          className="text-slate-300 hover:text-rose-500 p-1 rounded transition"
                                          title="삭제"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Store Footer Cost Info */}
                      <div className="p-3 bg-slate-100/70 border-t border-slate-100 text-xs flex justify-between items-center text-slate-600">
                        <span>매장 예상 인건비:</span>
                        <span className="font-bold text-slate-900">
                          {storeSchedules
                            .reduce((acc, sch) => {
                              const staff = staffList.find((st) => st.id === sch.staffId);
                              const shift = SHIFT_TYPES.find((sh) => sh.id === sch.shiftId);
                              return acc + (staff ? staff.hourlyRate * (shift?.duration || 0) : 0);
                            }, 0)
                            .toLocaleString()} 원
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ================= TAB 2: STAFF LIST & DATABASE ================= */}
        {currentTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-bold text-slate-900">팝업스토어 근무자 관리</h2>
                <p className="text-xs text-slate-500">정직원 및 파트타임/알바 스태프의 정보와 보유 역량을 관리합니다.</p>
              </div>

              <button
                onClick={() => {
                  setEditingStaff(null);
                  setStaffForm({ name: '', role: '', type: '알바', skills: '', hourlyRate: 10000, phone: '' });
                  setIsStaffModalOpen(true);
                }}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>신규 근무자 등록</span>
              </button>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffList.map((staff) => (
                <div key={staff.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 relative hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-sm ${staff.color}`}>
                        {staff.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-slate-900 text-sm">{staff.name}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            staff.type === '정직원' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {staff.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{staff.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditStaff(staff)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">시급:</span>
                      <span className="font-semibold text-slate-800">{staff.hourlyRate.toLocaleString()} 원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">연락처:</span>
                      <span className="font-medium">{staff.phone}</span>
                    </div>
                  </div>

                  {/* Skills Badges */}
                  <div className="pt-2">
                    <p className="text-[11px] text-slate-400 mb-1.5">보유 역량 / 주특기:</p>
                    <div className="flex flex-wrap gap-1">
                      {staff.skills.map((skill, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: STORE CONFIGURATION ================= */}
        {currentTab === 'stores' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">팝업 점포별 권장 설정</h2>
              <p className="text-xs text-slate-500">운영 중인 백화점 팝업 매장의 최소 인원 기준 및 운영시간을 조정합니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stores.map((store) => (
                <div key={store.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${store.badgeBg}`}>
                      {store.name}
                    </span>
                    <Store className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">운영 시간</label>
                      <input
                        type="text"
                        value={store.operatingHours}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStores((prev) =>
                            prev.map((st) => (st.id === store.id ? { ...st, operatingHours: val } : st))
                          );
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-medium mb-1">최소 권장 근무 인원 (명)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={store.minStaff}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setStores((prev) =>
                            prev.map((st) => (st.id === store.id ? { ...st, minStaff: val } : st))
                          );
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: PRINT & EXPORT VIEW ================= */}
        {currentTab === 'print' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">현장 공유 및 출력용 배치표</h2>
                <p className="text-xs text-slate-500">
                  {selectedDate} 기준 매장별 근무 배치 현황입니다. 카카오톡 전달용 텍스트 복사나 인쇄가 가능합니다.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={copyRosterText}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow transition"
                >
                  <Copy className="w-4 h-4" />
                  <span>텍스트 복사</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>인쇄하기</span>
                </button>
              </div>
            </div>

            {copiedNotice && (
              <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{copiedNotice}</span>
              </div>
            )}

            {/* PRINT READY SHEET */}
            <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-sm space-y-8 print:p-0 print:border-none">
              <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">팝업스토어일별 근무 배치표</h1>
                  <p className="text-sm text-slate-500 font-semibold mt-1">기준일자: {selectedDate}</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  발행일: {new Date().toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-6">
                {stores.map((store) => {
                  const storeSchs = schedules.filter((s) => s.date === selectedDate && s.storeId === store.id);

                  return (
                    <div key={store.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-100 px-4 py-2.5 font-bold text-sm text-slate-800 flex justify-between">
                        <span>📍 {store.name}</span>
                        <span className="text-xs text-slate-500 font-normal">운영시간: {store.operatingHours}</span>
                      </div>

                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                          <tr>
                            <th className="p-2.5">근무 조</th>
                            <th className="p-2.5">성명</th>
                            <th className="p-2.5">구분</th>
                            <th className="p-2.5">담당 역할</th>
                            <th className="p-2.5">연락처</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {storeSchs.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="p-4 text-center text-slate-400 italic">
                                배치된 근무자가 없습니다.
                              </td>
                            </tr>
                          ) : (
                            storeSchs.map((sch) => {
                              const staff = staffList.find((s) => s.id === sch.staffId);
                              const shift = SHIFT_TYPES.find((sh) => sh.id === sch.shiftId);
                              return (
                                <tr key={sch.id} className="hover:bg-slate-50">
                                  <td className="p-2.5 font-semibold text-indigo-600">{shift?.label}</td>
                                  <td className="p-2.5 font-bold text-slate-800">{staff?.name}</td>
                                  <td className="p-2.5 text-slate-500">{staff?.type}</td>
                                  <td className="p-2.5 font-medium text-slate-700">{sch.roleAssigned}</td>
                                  <td className="p-2.5 text-slate-500">{staff?.phone}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- ASSIGNMENT MODAL --- */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">근무 배치 등록 ({selectedDate})</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignShift} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">점포 선택</label>
                <select
                  value={assignForm.storeId}
                  onChange={(e) => setAssignForm((prev) => ({ ...prev, storeId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                >
                  {stores.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">근무자 선택</label>
                <select
                  value={assignForm.staffId}
                  onChange={(e) => setAssignForm((prev) => ({ ...prev, staffId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  required
                >
                  <option value="">근무자를 선택하세요</option>
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role} / {st.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">근무 시간 (조)</label>
                <select
                  value={assignForm.shiftId}
                  onChange={(e) => setAssignForm((prev) => ({ ...prev, shiftId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                >
                  {SHIFT_TYPES.map((sh) => (
                    <option key={sh.id} value={sh.id}>
                      {sh.label} ({sh.hours})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">현장 담당 역할</label>
                <input
                  type="text"
                  placeholder="예: POS/결제, 시식지원, 오징어구이 메인 등"
                  value={assignForm.roleAssigned}
                  onChange={(e) => setAssignForm((prev) => ({ ...prev, roleAssigned: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md"
                >
                  배치 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- STAFF MODAL --- */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingStaff ? '근무자 정보 수정' : '신규 근무자 등록'}
              </h3>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">성명</label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">고용 형태</label>
                  <select
                    value={staffForm.type}
                    onChange={(e) => setStaffForm((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  >
                    <option value="알바">알바/파트타임</option>
                    <option value="정직원">정직원</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">시급 (원)</label>
                  <input
                    type="number"
                    step="100"
                    value={staffForm.hourlyRate}
                    onChange={(e) => setStaffForm((prev) => ({ ...prev, hourlyRate: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">주요 역할 / 직책</label>
                <input
                  type="text"
                  placeholder="예: 시식팀장, POS스태프"
                  value={staffForm.role}
                  onChange={(e) => setStaffForm((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">보유 스킬 (쉼표로 구분)</label>
                <input
                  type="text"
                  placeholder="예: POS/결제, 시식/호객, 오징어구이"
                  value={staffForm.skills}
                  onChange={(e) => setStaffForm((prev) => ({ ...prev, skills: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">연락처</label>
                <input
                  type="text"
                  placeholder="010-0000-0000"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
