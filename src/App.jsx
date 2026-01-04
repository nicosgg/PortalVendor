import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  FileSignature, 
  Bell, 
  Inbox, 
  CheckCircle2, 
  AlertCircle, 
  CalendarOff, 
  Briefcase,
  Search, 
  Filter, 
  ArrowRight, 
  LogOut, 
  Clock, 
  History, 
  Info, 
  Check, 
  Download, 
  MoreVertical, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Truck, 
  HelpCircle, 
  ArrowUpDown, 
  ChevronDown, 
  Eye, 
  FileCheck, 
  Settings, 
  User, 
  Building2, 
  Lock, 
  Globe 
} from 'lucide-react';

/**
 * KONSEP DESIGN: GOLDEN RATIO (1.618)
 * Tipografi dan Spasi Proposional untuk Kenyamanan Vendor
 */

// --- Helper Functions (Defined globally to avoid ReferenceErrors) ---
const formatCurrencyLocal = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
const formatDateLocal = (str) => new Date(str).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

// --- Data Simulasi Realistis ---
const INITIAL_AGREEMENTS = [
  { id: 'AGR-CPO-001', title: 'Kontrak Angkutan CPO Riau-Sumut', endDate: '2025-12-01', status: 'Aktif', value: 1500000000 },
  { id: 'AGR-PUP-012', title: 'Pasokan Pupuk NPK Non-Subsidi 2024', endDate: '2025-06-15', status: 'Aktif', value: 2400000000 },
  { id: 'AGR-SW-005', title: 'Sewa Truk Tangki Kapasitas 20KL', endDate: '2025-05-20', status: 'Menunggu Tanda Tangan Vendor', value: 500000000 },
  { id: 'AGR-MN-099', title: 'Maintenance Excavator CAT X-200', endDate: '2024-12-15', status: 'Kadaluarsa', value: 120000000 },
  { id: 'AGR-BIB-044', title: 'Pengadaan Bibit Sawit Unggul DxP', endDate: '2025-08-30', status: 'Aktif', value: 750000000 },
];

const INITIAL_PURCHASE_ORDERS = [
  { id: 'PO-2024-001', agreementId: 'AGR-CPO-001', item: 'Pengiriman CPO Batch 1 (Sei Lala)', amount: 125000000, status: 'Baru', date: '2025-01-01' },
  { id: 'PO-2024-002', agreementId: 'AGR-PUP-012', item: 'Pupuk NPK Granular 150 Ton', amount: 825000000, status: 'Selesai', date: '2024-12-10' },
  { id: 'PO-2024-003', agreementId: 'AGR-CPO-001', item: 'Sewa Truk Tambahan (Emergency)', amount: 45000000, status: 'Dikonfirmasi', date: '2024-12-28' },
  { id: 'PO-2024-004', agreementId: 'AGR-BIB-044', item: 'Bibit Sawit Simalungun 5000 Pokok', amount: 350000000, status: 'Baru', date: '2025-01-02' },
  { id: 'PO-2024-005', agreementId: 'AGR-PUP-012', item: 'Pupuk KCL Jerman 50 Ton', amount: 275000000, status: 'Selesai', date: '2024-11-20' },
];

const INITIAL_INVOICES = [
  { id: 'INV-24-901', poId: 'PO-2024-002', amount: 825000000, status: 'Lunas', date: '2024-12-20', payDate: '2024-12-25' },
  { id: 'INV-24-905', poId: 'PO-2024-003', amount: 45000000, status: 'Diproses', date: '2025-01-01', payDate: 'Estimasi: 15 Jan 2025' },
];

// --- UI Sub-Components ---

const StatusBadge = ({ status }) => {
  const map = {
    'Aktif': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Menunggu Tanda Tangan Vendor': 'bg-amber-50 text-amber-700 border-amber-100',
    'Kadaluarsa': 'bg-rose-50 text-rose-700 border-rose-100',
    'Baru': 'bg-blue-50 text-blue-700 border-blue-100',
    'Dikonfirmasi': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Selesai': 'bg-slate-100 text-slate-700 border-slate-200',
    'Diproses': 'bg-violet-50 text-violet-700 border-violet-100',
    'Lunas': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };
  return (
    <span className={`px-3 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-bold border whitespace-nowrap shadow-sm ${map[status] || 'bg-slate-50 text-slate-500'}`}>
      {status}
    </span>
  );
};

const WorkflowStepper = ({ status }) => {
  const steps = ['Rilis PO', 'Vendor Konfirmasi', 'GR Gudang', 'Siap Bayar'];
  const currentIdx = steps.indexOf(status === 'Baru' ? 'Rilis PO' : status === 'Dikonfirmasi' ? 'Vendor Konfirmasi' : status === 'Selesai' ? 'GR Gudang' : 'Siap Bayar');
  
  return (
    <div className="flex items-center space-x-1 md:space-x-2">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center">
             <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${i <= currentIdx ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                {i < currentIdx ? <Check size={12} strokeWidth={3}/> : i + 1}
             </div>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-4 md:w-10 h-[2px] md:h-[3px] rounded-full transition-all duration-300 ${i < currentIdx ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[20px] md:rounded-[26px] shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-base md:text-xl uppercase tracking-tight leading-none">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400"><X size={20}/></button>
        </div>
        <div className="p-6 md:p-10 max-h-[80vh] overflow-y-auto text-sm md:text-base">{children}</div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-600 text-indigo-600',
    blue: 'bg-blue-600 text-blue-600',
    violet: 'bg-violet-600 text-violet-600',
    emerald: 'bg-emerald-600 text-emerald-600',
  };
  
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-300 group cursor-default">
      <div className="flex items-center space-x-5">
        <div className={`p-3 md:p-4 rounded-xl ${colorClasses[color] || 'bg-slate-600 text-slate-600'} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <div className="overflow-hidden">
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mb-1 truncate leading-none">{label}</p>
          <p className="text-xl md:text-[32px] font-black text-slate-800 leading-none tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick, open, id }) => (
  <button 
    id={id}
    onClick={onClick}
    className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 group ${active ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
  >
    <Icon size={20} className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`} />
    {(open || window.innerWidth < 768) && <span className={`ml-4 md:ml-6 text-sm md:text-base font-bold tracking-tight ${active ? 'text-white' : ''} uppercase tracking-widest text-left`}>{label}</span>}
    {active && open && <div className="ml-auto w-2 h-2 bg-indigo-300 rounded-full animate-pulse shadow-glow" />}
  </button>
);

// --- Main App ---

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [agreements, setAgreements] = useState(INITIAL_AGREEMENTS);
  const [pos, setPos] = useState(INITIAL_PURCHASE_ORDERS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [notifications, setNotifications] = useState([]);
  const [modal, setModal] = useState({ open: false, type: '', data: null });

  const notify = useCallback((msg) => {
    const id = Date.now();
    setNotifications(prev => [{ id, msg }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  }, []);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentFilteredData = useMemo(() => {
    let source = [];
    if (page === 'po') source = pos;
    else if (page === 'perjanjian') source = agreements;
    else if (page === 'faktur') source = invoices;

    let result = source.filter(item => {
      const text = (item.id + (item.title || item.item || '')).toLowerCase();
      const matchSearch = text.includes(searchQuery.toLowerCase());
      const matchFilter = statusFilter === 'Semua' || item.status === statusFilter;
      return matchSearch && matchFilter;
    });

    result.sort((a, b) => {
      const vA = a[sortConfig.key];
      const vB = b[sortConfig.key];
      if (vA < vB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (vA > vB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [page, pos, agreements, invoices, searchQuery, statusFilter, sortConfig]);

  const stats = useMemo(() => ({
    activeAgreements: agreements.filter(a => a.status === 'Aktif').length,
    newPOs: pos.filter(p => p.status === 'Baru').length,
    processingInvoices: invoices.filter(i => i.status === 'Diproses').length,
    paidInvoices: invoices.filter(i => i.status === 'Lunas').length,
  }), [agreements, pos, invoices]);

  const tasks = useMemo(() => {
    const t = [];
    agreements.filter(a => a.status === 'Menunggu Tanda Tangan Vendor').forEach(a => t.push({ id: `t-a-${a.id}`, text: `Konfirmasi Kontrak: ${a.title}`, icon: FileSignature, color: 'bg-amber-500' }));
    pos.filter(p => p.status === 'Baru').forEach(p => t.push({ id: `t-p-${p.id}`, text: `Konfirmasi PO Baru: ${p.id}`, icon: Inbox, color: 'bg-indigo-600' }));
    return t;
  }, [agreements, pos]);

  const activityLog = [
    { message: 'Finance: Dana tagihan INV-24-901 telah dirilis ke antrian transfer bank', time: '10 Menit Lalu' },
    { message: 'Warehouse: Good Receipt (GR) telah diterbitkan untuk PO-2024-002', time: '2 Jam Lalu' },
    { message: 'Legal: Draft Kontrak baru telah tersedia untuk ditinjau', time: 'Hari Ini' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-inter text-slate-900 overflow-hidden text-sm md:text-base leading-relaxed">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; letter-spacing: -0.01em; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-[70] h-full bg-slate-900 transition-all duration-500 ease-in-out flex flex-col shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
        ${isSidebarOpen ? 'lg:w-80' : 'lg:w-24'}
      `}>
        <div className="h-20 md:h-24 flex items-center px-6 md:px-10 border-b border-slate-800 mb-4 md:mb-8 shrink-0 overflow-hidden">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-indigo-500/20">
             <Zap size={20} fill="currentColor"/>
          </div>
          {(isSidebarOpen || isMobileMenuOpen) && <span className="ml-4 md:ml-5 font-black text-white tracking-tighter text-xl md:text-2xl uppercase whitespace-nowrap">Vendor Hub</span>}
        </div>

        <nav className="flex-1 px-4 md:px-6 space-y-2 md:space-y-3 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
            { id: 'perjanjian', label: 'Kontrak', icon: FileText },
            { id: 'po', label: 'Pesanan', icon: Briefcase },
            { id: 'faktur', label: 'Keuangan', icon: Receipt },
          ].map(item => (
            <NavItem 
              key={item.id}
              icon={item.icon} 
              label={item.label} 
              active={page === item.id} 
              onClick={() => {
                setPage(item.id); 
                setSearchQuery(''); 
                if(window.innerWidth < 1024) setIsMobileMenuOpen(false);
              }} 
              open={isSidebarOpen || isMobileMenuOpen} 
            />
          ))}
        </nav>

        <div className="p-4 md:p-6 border-t border-slate-800 text-white">
           <button 
             onClick={() => setModal({ open: true, type: 'profile' })}
             className={`w-full flex items-center ${(isSidebarOpen || isMobileMenuOpen) ? 'space-x-4 md:space-x-5' : 'justify-center'} py-3 md:py-4 px-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-white/5 transition-all group`}
           >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-white font-bold text-xs shadow-inner group-hover:scale-105 transition-transform">ML</div>
              {(isSidebarOpen || isMobileMenuOpen) && (
                <div className="overflow-hidden text-left">
                  <p className="text-xs md:text-sm font-bold truncate uppercase tracking-tight leading-none mb-1 md:mb-2 text-white">Mitra Logistik</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">V-2024</span>
                    <Settings size={12} className="text-slate-600" />
                  </div>
                </div>
              )}
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 md:h-24 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-12 z-40 shrink-0 shadow-sm text-slate-800">
          <div className="flex items-center space-x-4 md:space-x-8">
            <button 
              onClick={() => {
                if(window.innerWidth < 1024) setIsMobileMenuOpen(true);
                else setSidebarOpen(!isSidebarOpen);
              }} 
              className="p-2 md:p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 border border-slate-100 transition-all active:scale-90 shadow-sm"
            >
              <Menu size={20} className="md:w-6 md:h-6" />
            </button>
            <div className="hidden sm:block">
               <h1 className="font-bold text-slate-800 text-sm md:text-lg uppercase tracking-[0.1em] md:tracking-[0.2em]">{page}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-6 text-slate-400">
            <button className="relative p-2 md:p-3 hover:text-indigo-600 transition-all hover:bg-slate-50 rounded-2xl group shadow-sm">
              <Bell size={20} className="md:w-6 md:h-6" />
              <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 md:w-3 h-2 md:h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            </button>
            <div className="h-8 md:h-10 w-px bg-slate-100 mx-1 md:mx-2" />
            <button className="flex items-center space-x-2 md:space-x-4 px-3 md:px-5 py-2 md:py-2.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all group border border-slate-200">
               <LogOut size={16} className="md:w-5 md:h-5 group-hover:text-rose-600 transition-colors"/> 
               <span className="hidden md:inline font-bold text-xs md:text-sm uppercase tracking-widest text-slate-500 group-hover:text-rose-600">Keluar</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 md:space-y-12">
          {page === 'dashboard' && (
            <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
              {/* Statistik */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                <StatCard label="Kontrak Berlaku" value={stats.activeAgreements} icon={FileCheck} color="indigo" />
                <StatCard label="Pesanan Baru" value={stats.newPOs} icon={Inbox} color="blue" />
                <StatCard label="Faktur Diproses" value={stats.processingInvoices} icon={Clock} color="violet" />
                <StatCard label="Dana Cair (Bln Ini)" value={stats.paidInvoices} icon={CreditCard} color="emerald" />
              </div>

              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 md:gap-12">
                <div className="lg:col-span-2 space-y-8 md:space-y-10 text-slate-800">
                  <section className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm overflow-hidden" id="tasks">
                    <div className="px-6 md:px-10 py-4 md:py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                      <h2 className="text-xs md:text-base font-black text-slate-800 flex items-center uppercase tracking-widest md:tracking-[0.2em]">
                        <Zap size={18} className="text-indigo-500 mr-2 md:mr-4 fill-indigo-500" />
                        Tindakan Respon Cepat
                      </h2>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase">{tasks.length} Tindakan</span>
                    </div>
                    <div className="p-2 min-h-[150px] md:min-h-[200px] space-y-2">
                      {tasks.length === 0 ? (
                        <p className="p-10 md:p-16 text-center text-slate-400 text-sm md:text-base italic font-medium">Semua tugas operasional selesai.</p>
                      ) : (
                        tasks.map(t => {
                          const TaskIcon = t.icon;
                          return (
                            <div key={t.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 hover:bg-slate-50 rounded-2xl md:rounded-3xl transition-all group border border-transparent hover:border-slate-100 gap-4">
                              <div className="flex items-center space-x-4 md:space-x-6 text-slate-800">
                                <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${t.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                                  <TaskIcon size={20} className="md:w-6 md:h-6" />
                                </div>
                                <div>
                                  <p className="text-sm md:text-lg font-bold leading-tight mb-1 md:mb-2 uppercase tracking-tight">{t.text}</p>
                                  <p className="text-[9px] md:text-xs text-slate-400 font-bold uppercase tracking-widest leading-none italic">Butuh tindakan segera</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => { setPage(t.id.includes('po') ? 'po' : 'perjanjian'); notify("Membuka dokumen..."); }} 
                                className="w-full sm:w-auto bg-white text-indigo-600 font-black text-[10px] md:text-xs px-6 md:px-8 py-2.5 md:py-3 border-2 border-indigo-50 rounded-xl md:rounded-2xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all uppercase tracking-widest shadow-sm"
                              >PROSES</button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </section>

                  <section className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 md:px-10 py-4 md:py-6 border-b border-slate-100 bg-slate-50/30 flex items-center">
                      <History size={18} className="text-slate-400 mr-2 md:mr-4" />
                      <h2 className="text-xs md:text-base font-black text-slate-800 uppercase tracking-widest md:tracking-[0.2em]">Log ERP Perusahaan</h2>
                    </div>
                    <div className="p-6 md:p-10 space-y-6 md:space-y-10">
                      {activityLog.map((a, i) => (
                        <div key={i} className="flex space-x-4 md:space-x-8 group">
                          <div className="flex flex-col items-center shrink-0">
                            <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-indigo-500 ring-[4px] md:ring-[6px] ring-indigo-50 group-hover:ring-indigo-100 transition-all shadow-sm" />
                            {i !== activityLog.length - 1 && <div className="w-[2px] md:w-[3px] h-full bg-slate-100 mt-2 md:mt-3 rounded-full" />}
                          </div>
                          <div className="pb-2">
                            <p className="text-xs md:text-base font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">{a.message}</p>
                            <p className="text-[9px] md:text-[11px] text-slate-400 font-black tracking-widest uppercase mt-1 md:mt-2 leading-none italic flex items-center">
                              <Clock size={10} className="mr-1 md:w-3 md:h-3" /> {a.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-8 md:space-y-10">
                  <div className="bg-white p-8 md:p-10 rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm border-l-[6px] md:border-l-8 border-l-emerald-500 relative overflow-hidden group text-slate-800">
                     <Info size={80} className="absolute -right-4 -bottom-4 text-slate-50 opacity-50 md:w-32 md:h-32" />
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-8 flex items-center"><Info size={14} className="mr-2 text-emerald-500 md:w-4 md:h-4"/> Info Sistem</h4>
                     <p className="text-sm md:text-base text-slate-600 leading-relaxed md:leading-[1.8] font-medium italic relative z-10">
                       "Pencairan dana hanya dikirim ke rekening tervalidasi. Perubahan Master Data melalui admin perusahaan."
                     </p>
                  </div>

                  <div className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm text-slate-800">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest md:mb-10 text-center hidden md:block">Bantuan & Support</h4>
                     <div className="space-y-3 md:space-y-4">
                        <button className="w-full flex items-center justify-between p-4 md:p-6 bg-slate-50 hover:bg-indigo-50 rounded-xl md:rounded-[20px] transition-all group border-2 border-transparent hover:border-indigo-100 text-slate-700">
                           <div className="flex items-center space-x-3 md:space-x-5 group-hover:text-indigo-600">
                              <HelpCircle size={20} className="md:w-6 md:h-6"/>
                              <span className="text-xs md:text-sm font-black uppercase tracking-widest">Panduan</span>
                           </div>
                           <ChevronRight size={16} className="text-slate-300 md:w-[18px] md:h-[18px] group-hover:text-indigo-600" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 md:p-6 bg-slate-50 hover:bg-emerald-50 rounded-xl md:rounded-[20px] transition-all group border-2 border-transparent hover:border-emerald-100 text-slate-700">
                           <div className="flex items-center space-x-3 md:space-x-5 group-hover:text-emerald-600">
                              <Truck size={20} className="md:w-6 md:h-6"/>
                              <span className="text-xs md:text-sm font-black uppercase tracking-widest">Logistik</span>
                           </div>
                           <ChevronRight size={16} className="text-slate-300 md:w-[18px] md:h-[18px] group-hover:text-emerald-600" />
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(page === 'po' || page === 'perjanjian' || page === 'faktur') && (
            <div className="space-y-8 md:space-y-10 animate-in slide-in-from-bottom-8 duration-700 text-slate-800">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-4 md:mb-8 text-slate-800">
                  <div className="space-y-2 md:space-y-3">
                    <h2 className="text-xl md:text-[32px] font-black tracking-tighter uppercase leading-none text-slate-800">
                       {page === 'po' ? 'Purchase Orders' : page === 'perjanjian' ? 'Master Agreements' : 'Financial Ledger'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                       <span className="px-3 md:px-5 py-0.5 md:py-1 bg-slate-900 text-white text-[9px] md:text-[11px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-slate-200">{currentFilteredData.length} Dokumen</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 md:gap-4">
                    <div className="relative flex-1 sm:w-64 md:w-96 shadow-sm">
                       <Search size={18} className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 md:w-5 md:h-5" />
                       <input 
                         type="text" 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder="Cari ID atau Item..." 
                         className="w-full pl-11 md:pl-14 pr-4 md:pr-6 py-3 md:py-5 bg-white border-2 border-slate-100 rounded-xl md:rounded-[22px] text-sm md:text-base font-semibold focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                       />
                    </div>
                    <div className="relative">
                       <select 
                         value={statusFilter}
                         onChange={(e) => setStatusFilter(e.target.value)}
                         className="appearance-none w-full pl-4 md:pl-6 pr-10 md:pr-14 py-3 md:py-5 bg-white border-2 border-slate-100 rounded-xl md:rounded-[22px] text-xs md:text-sm font-black text-slate-600 focus:ring-4 focus:ring-indigo-50 outline-none cursor-pointer uppercase tracking-widest shadow-sm"
                       >
                          <option value="Semua">Semua Status</option>
                          {page === 'po' && ['Baru', 'Dikonfirmasi', 'Selesai'].map(s => <option key={s} value={s}>{s}</option>)}
                          {page === 'perjanjian' && ['Aktif', 'Menunggu Tanda Tangan Vendor', 'Kadaluarsa'].map(s => <option key={s} value={s}>{s}</option>)}
                          {page === 'faktur' && ['Diproses', 'Lunas'].map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                       <ChevronDown size={18} className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none md:w-5 md:h-5" />
                    </div>
                  </div>
               </div>
               
               <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-x-auto min-h-[300px]">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                     <thead className="bg-slate-50/80 border-b-2 border-slate-100">
                        <tr className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em]">
                           <th className="p-6 md:p-8 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('id')}>
                             <div className="flex items-center text-slate-400">ID <ArrowUpDown size={12} className="ml-2 text-slate-300"/></div>
                           </th>
                           <th className="p-6 md:p-8 text-slate-400">Deskripsi</th>
                           <th className="p-6 md:p-8 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort(page === 'perjanjian' ? 'value' : 'amount')}>
                             <div className="flex items-center text-slate-400">Nominal <ArrowUpDown size={12} className="ml-2 text-slate-300"/></div>
                           </th>
                           <th className="p-6 md:p-8 text-slate-400">Detail Status</th>
                           <th className="p-6 md:p-8 text-slate-400">Label</th>
                           <th className="p-6 md:p-8 text-right text-slate-400">Opsi</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {currentFilteredData.length === 0 ? (
                          <tr><td colSpan="6" className="p-20 text-center text-slate-400 text-sm md:text-lg italic font-medium text-slate-800">Data tidak ditemukan.</td></tr>
                        ) : (
                          currentFilteredData.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-all group text-slate-800">
                               <td className="p-6 md:p-8 text-xs md:text-sm font-bold text-slate-400 font-mono tracking-tighter group-hover:text-indigo-600 transition-colors">{item.id}</td>
                               <td className="p-6 md:p-8">
                                  <h3 className="font-black text-slate-800 text-sm md:text-lg leading-tight group-hover:text-indigo-600 transition-colors tracking-tight mb-1 md:mb-2 text-left">{item.title || item.item}</h3>
                                  {item.poId && <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none text-left">REF: {item.poId}</p>}
                               </td>
                               <td className="p-6 md:p-8 text-sm md:text-base font-black text-slate-900 tracking-tighter whitespace-nowrap text-left">
                                  {formatCurrencyLocal(item.amount || item.value)}
                               </td>
                               <td className="p-6 md:p-8 text-left text-slate-800">
                                  {page === 'po' && <WorkflowStepper status={item.status} />}
                                  {page === 'perjanjian' && <span className="text-[10px] md:text-sm font-bold text-slate-600 flex items-center leading-none tracking-widest text-slate-800"><CalendarOff size={14} className="mr-2 text-slate-400"/> {formatDateLocal(item.endDate)}</span>}
                                  {page === 'faktur' && (
                                     <div className="flex items-center text-slate-800">
                                        <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full mr-2 md:mr-3 ${item.status === 'Lunas' ? 'bg-emerald-500 shadow-lg' : 'bg-amber-400 animate-pulse shadow-lg'}`} />
                                        <span className={`text-[10px] md:text-sm font-black uppercase tracking-wider ${item.status === 'Lunas' ? 'text-emerald-700' : 'text-amber-700 italic'}`}>
                                           {item.payDate}
                                        </span>
                                     </div>
                                  )}
                               </td>
                               <td className="p-6 md:p-8 text-left text-slate-800"><StatusBadge status={item.status} /></td>
                               <td className="p-6 md:p-8 text-right whitespace-nowrap text-slate-800">
                                  <div className="flex items-center justify-end space-x-2 md:space-x-4 text-slate-400">
                                     {page === 'po' && item.status === 'Baru' && (
                                       <button 
                                          onClick={() => { setPos(prev => prev.map(p => p.id === item.id ? { ...p, status: 'Dikonfirmasi' } : p)); notify(`Sukses: PO ${item.id} dikonfirmasi.`); }} 
                                          className="bg-indigo-600 text-white text-[9px] md:text-[11px] px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-black hover:bg-indigo-700 shadow-lg transition-all uppercase tracking-widest"
                                       >KONFIRMASI</button>
                                     )}
                                     {page === 'po' && item.status === 'Dikonfirmasi' && (
                                       <button 
                                          onClick={() => setModal({ open: true, type: 'invoice', data: item })} 
                                          className="bg-emerald-600 text-white text-[9px] md:text-[11px] px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-black hover:bg-emerald-700 shadow-lg transition-all uppercase tracking-widest"
                                       >TAGIH</button>
                                     )}
                                     {page === 'perjanjian' && item.status.includes('Menunggu') && (
                                       <button 
                                          onClick={() => setModal({ open: true, type: 'sign', data: item })} 
                                          className="bg-amber-500 text-white text-[9px] md:text-[11px] px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-black hover:bg-amber-600 shadow-lg transition-all uppercase tracking-widest"
                                       >TTD DIGITAL</button>
                                     )}
                                     <button onClick={() => notify("Download dokumen...")} className="p-2 text-slate-300 hover:text-indigo-600 border border-transparent hover:border-slate-100 rounded-xl text-slate-800"><Download size={20}/></button>
                                     <button className="p-2 text-slate-300 hover:text-slate-600 border border-transparent hover:border-slate-100 rounded-xl text-slate-800"><Eye size={20}/></button>
                                  </div>
                               </td>
                            </tr>
                          ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          )}
        </main>
      </div>

      {/* Notifications */}
      <div className="fixed bottom-8 right-8 z-[200] space-y-3 pointer-events-none text-xs text-slate-800">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-4 animate-in slide-in-from-right-4 duration-300 border border-white/10">
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-inner"><CheckCircle2 size={18} className="text-white" /></div>
            <span className="font-bold tracking-tight uppercase leading-none">{n.msg}</span>
          </div>
        ))}
      </div>

      {/* Modals */}
      <Modal 
        isOpen={modal.open} 
        onClose={() => setModal({ open: false })} 
        title={
          modal.type === 'invoice' ? 'PENERBITAN FAKTUR DIGITAL' : 
          modal.type === 'sign' ? 'TANDA TANGAN ELEKTRONIK' : 
          modal.type === 'profile' ? 'PROFIL & PENGATURAN VENDOR' : ''
        }
      >
        {modal.type === 'profile' && (
           <div className="space-y-8 md:space-y-12 text-slate-800">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-8 gap-4 pb-6 md:pb-10 border-b border-slate-100 text-center sm:text-left text-slate-800">
                 <div className="w-20 h-20 md:w-24 md:h-24 rounded-[22px] md:rounded-[28px] bg-indigo-500 flex items-center justify-center text-white text-3xl md:text-4xl font-black shadow-2xl">ML</div>
                 <div>
                    <h4 className="text-xl md:text-2xl font-black leading-none mb-2 md:mb-3 uppercase">PT. Mitra Logistik Jaya</h4>
                    <p className="text-xs md:text-sm text-indigo-600 font-black tracking-widest uppercase">Member ID: V-2024-MJL</p>
                 </div>
              </div>
              
              <div className="space-y-8 md:space-y-10 text-left text-slate-800">
                 <div className="grid grid-cols-1 gap-4 md:gap-6 bg-slate-50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border-2 border-slate-100 shadow-inner text-slate-800">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">ID Pajak (NPWP)</span>
                       <span className="text-sm md:text-base text-slate-800 font-black tracking-widest">01.234.567.8-091.000</span>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-slate-200 pt-4 text-slate-800">
                       <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Kantor Pusat</span>
                       <span className="text-sm md:text-base text-slate-800 font-black">Gedung Jaya Lt. 12, Jakarta</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-slate-800">
                    <button className="flex items-center justify-between p-4 md:p-6 bg-white border-2 border-slate-100 rounded-2xl md:rounded-[24px] hover:border-indigo-500 transition-all group text-slate-700">
                       <div className="flex items-center space-x-3 md:space-x-4">
                          <Lock size={18} className="md:w-5 md:h-5"/> <span className="font-black text-[10px] md:text-xs uppercase tracking-widest">Keamanan</span>
                       </div>
                       <ChevronRight size={16} className="text-slate-300 md:w-[18px] md:h-[18px]"/>
                    </button>
                    <button className="flex items-center justify-between p-4 md:p-6 bg-white border-2 border-slate-100 rounded-2xl md:rounded-[24px] hover:border-indigo-500 transition-all group text-slate-700">
                       <div className="flex items-center space-x-3 md:space-x-4">
                          <Globe size={18} className="md:w-5 md:h-5"/> <span className="font-black text-[10px] md:text-xs uppercase tracking-widest">Bahasa</span>
                       </div>
                       <ChevronRight size={16} className="text-slate-300 md:w-[18px] md:h-[18px]"/>
                    </button>
                 </div>
              </div>

              <div className="flex justify-end pt-6 md:pt-8 border-t border-slate-100 text-slate-800">
                 <button onClick={() => setModal({ open: false })} className="w-full sm:w-auto px-10 md:px-12 py-3 md:py-4 bg-slate-900 text-white text-[10px] md:text-[11px] font-black rounded-xl md:rounded-2xl shadow-xl hover:bg-indigo-600 transition-all uppercase tracking-widest text-slate-800">Tutup</button>
              </div>
           </div>
        )}

        {modal.type === 'invoice' && (
          <div className="space-y-8 md:space-y-10 text-slate-800">
            <div className="p-6 md:p-8 bg-indigo-50/70 rounded-[24px] md:rounded-[32px] border-2 border-indigo-100 flex items-start space-x-5 md:space-x-8 shadow-inner">
              <div className="p-4 md:p-5 bg-indigo-600 rounded-xl md:rounded-2xl text-white shadow-2xl shrink-0"><Zap size={24}/></div>
              <div className="flex-1 space-y-1 md:space-y-3 text-left">
                 <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-none text-left">Automated ERP</p>
                 <p className="text-sm md:text-base text-indigo-800 leading-snug md:leading-[1.6] font-bold text-left">
                   Menerbitkan faktur untuk <strong>{modal.data?.id}</strong> senilai <strong>{formatCurrencyLocal(modal.data?.amount)}</strong>.
                 </p>
              </div>
            </div>
            <label className="flex items-center space-x-4 md:space-x-6 p-6 md:p-8 bg-slate-50 rounded-[20px] md:rounded-[28px] border-2 border-slate-100 cursor-pointer hover:bg-white transition-all shadow-sm">
              <input type="checkbox" className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer text-slate-800" />
              <span className="text-xs md:text-sm font-black text-slate-600 leading-tight uppercase tracking-tight text-left text-slate-800">Konfirmasi: Barang/Jasa telah diterima sesuai standar Perusahaan.</span>
            </label>
            <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-6 pt-6 md:pt-10 border-t border-slate-100 text-slate-800">
              <button onClick={() => setModal({ open: false })} className="text-[10px] md:text-[11px] font-black text-slate-400 px-8 py-3 uppercase tracking-widest">Batal</button>
              <button onClick={() => {
                const po = modal.data;
                setInvoices(prev => [{ id: `INV-24-${Math.floor(Math.random()*1000)}`, poId: po.id, amount: po.amount, status: 'Diproses', date: new Date().toISOString(), payDate: 'Persetujuan' }, ...prev]);
                setPos(prev => prev.map(p => p.id === po.id ? { ...p, status: 'Selesai' } : p));
                setModal({ open: false });
                notify('Tagihan Terkirim.');
              }} className="px-8 md:px-14 py-4 md:py-5 bg-indigo-600 text-white text-[10px] md:text-[11px] font-black rounded-xl md:rounded-2xl shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest">Kirim E-Invoice</button>
            </div>
          </div>
        )}

        {modal.type === 'sign' && (
           <div className="space-y-8 md:space-y-10 text-center text-slate-800">
              <div className="p-6 md:p-8 bg-amber-50 rounded-[24px] md:rounded-[32px] border-2 border-amber-100 shadow-sm shadow-amber-100/50">
                 <p className="text-sm md:text-base text-amber-900 leading-snug md:leading-[1.6] font-black uppercase tracking-tight text-slate-800">
                    Persetujuan digital Anda memiliki kekuatan hukum penuh sesuai kebijakan ERP perusahaan.
                 </p>
              </div>
              <div className="h-40 md:h-52 border-2 border-dashed border-slate-200 rounded-[32px] md:rounded-[40px] bg-slate-50 flex items-center justify-center italic text-slate-300 text-xs md:text-sm font-black uppercase tracking-[0.5em] md:tracking-[0.8em] shadow-inner">
                 Area TTD Digital
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-6 pt-6 md:pt-10 border-t border-slate-100 text-left">
                <button onClick={() => setModal({ open: false })} className="text-[10px] md:text-[11px] font-black text-slate-400 px-8 py-3 uppercase tracking-widest text-slate-800">Batal</button>
                <button onClick={() => {
                  setAgreements(prev => prev.map(a => a.id === modal.data.id ? { ...a, status: 'Aktif' } : a));
                  setModal({ open: false });
                  notify('Kontrak Resmi Aktif.');
                }} className="px-8 md:px-14 py-4 md:py-5 bg-indigo-600 text-white text-[10px] md:text-[11px] font-black rounded-xl md:rounded-2xl shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest">VALIDASI & TTD</button>
              </div>
           </div>
        )}
      </Modal>
    </div>
  );
}