import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Plus, Filter, BarChart3, FileText, DollarSign, AlertCircle, Calendar, User, Download } from 'lucide-react';

// 模拟数据
const initialContracts = [
  {
    id: 1,
    contractNo: 'HT-2024-001',
    contractName: '办公设备采购合同',
    type: '采购',
    counterparty: '联想科技有限公司',
    totalAmount: 580000,
    paidAmount: 348000,
    invoicedAmount: 348000,
    status: '履行中',
    signDate: '2024-01-15',
    startDate: '2024-01-20',
    endDate: '2024-12-31',
    responsiblePerson: '张伟',
    department: '行政部',
    deliveryDate: '2024-06-30',
    paymentMethod: '分期付款'
  },
  {
    id: 2,
    contractNo: 'HT-2024-002',
    contractName: '软件开发服务合同',
    type: '销售',
    counterparty: '科技创新股份公司',
    totalAmount: 1200000,
    paidAmount: 720000,
    invoicedAmount: 720000,
    status: '履行中',
    signDate: '2024-02-10',
    startDate: '2024-02-15',
    endDate: '2025-02-14',
    responsiblePerson: '李娜',
    department: '技术部',
    deliveryDate: '2024-12-31',
    paymentMethod: '里程碑付款'
  },
  {
    id: 3,
    contractNo: 'HT-2024-003',
    contractName: '年度广告投放合同',
    type: '采购',
    counterparty: '天际传媒集团',
    totalAmount: 800000,
    paidAmount: 800000,
    invoicedAmount: 800000,
    status: '已完结',
    signDate: '2024-01-05',
    startDate: '2024-01-10',
    endDate: '2024-10-10',
    responsiblePerson: '王芳',
    department: '市场部',
    deliveryDate: '2024-10-01',
    paymentMethod: '一次性付款'
  },
  {
    id: 4,
    contractNo: 'HT-2024-004',
    contractName: '物业管理服务合同',
    type: '采购',
    counterparty: '盛世物业管理公司',
    totalAmount: 360000,
    paidAmount: 90000,
    invoicedAmount: 90000,
    status: '履行中',
    signDate: '2024-03-01',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    responsiblePerson: '赵强',
    department: '行政部',
    deliveryDate: '2025-02-28',
    paymentMethod: '季度付款'
  },
  {
    id: 5,
    contractNo: 'HT-2024-005',
    contractName: '产品销售合同',
    type: '销售',
    counterparty: '华盛贸易有限公司',
    totalAmount: 2500000,
    paidAmount: 0,
    invoicedAmount: 0,
    status: '未开始',
    signDate: '2024-10-15',
    startDate: '2024-11-01',
    endDate: '2025-10-31',
    responsiblePerson: '刘明',
    department: '销售部',
    deliveryDate: '2025-06-30',
    paymentMethod: '验收后付款'
  }
];

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '16px 32px'
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  userInfo: {
    fontSize: '14px',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  nav: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb'
  },
  navContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 32px',
    display: 'flex',
    gap: '32px'
  },
  navButton: {
    padding: '16px 8px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  navButtonActive: {
    color: '#2563eb',
    borderBottomColor: '#2563eb'
  },
  navButtonInactive: {
    color: '#6b7280'
  },
  main: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '24px 32px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '24px'
  },
  grid: {
    display: 'grid',
    gap: '16px',
    marginBottom: '24px'
  },
  grid4: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
  },
  grid2: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#111827'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s'
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '120px',
    flexShrink: 0
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    borderBottom: '1px solid #e5e7eb'
  },
  badge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    transition: 'width 0.3s'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid #e5e7eb'
  },
  modalBody: {
    padding: '24px'
  },
  modalFooter: {
    padding: '24px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  },
  searchBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchInput: {
    width: '220px',
    flexShrink: 0,
    position: 'relative'
  }
};

// 独立的表单组件 - 解决输入框失焦问题
const FormModal = React.memo(({ 
  showForm, 
  formData, 
  onClose, 
  onSave, 
  onChange 
}) => {
  if (!showForm) return null;

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', margin: 0}}>
            {formData.id ? '编辑合同' : '新增合同'}
          </h2>
        </div>
        
        <div style={styles.modalBody}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px'}}>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>合同编号 *</label>
              <input
                type="text"
                style={{...styles.input, width: '100%'}}
                value={formData.contractNo || ''}
                onChange={(e) => onChange('contractNo', e.target.value)}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>合同名称 *</label>
              <input
                type="text"
                style={{...styles.input, width: '100%'}}
                value={formData.contractName || ''}
                onChange={(e) => onChange('contractName', e.target.value)}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>合同类别 *</label>
              <select
                style={{...styles.select, width: '100%'}}
                value={formData.type || '采购'}
                onChange={(e) => onChange('type', e.target.value)}
              >
                <option>采购</option>
                <option>销售</option>
              </select>
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>相对方 *</label>
              <input
                type="text"
                style={{...styles.input, width: '100%'}}
                value={formData.counterparty || ''}
                onChange={(e) => onChange('counterparty', e.target.value)}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>合同金额 *</label>
              <input
                type="number"
                style={{...styles.input, width: '100%'}}
                value={formData.totalAmount || ''}
                onChange={(e) => onChange('totalAmount', e.target.value)}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>合同状态 *</label>
              <select
                style={{...styles.select, width: '100%'}}
                value={formData.status || '未开始'}
                onChange={(e) => onChange('status', e.target.value)}
              >
                <option>未开始</option>
                <option>履行中</option>
                <option>已完结</option>
                <option>终止</option>
              </select>
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>签订日期 *</label>
              <input
                type="date"
                style={{...styles.input, width: '100%'}}
                value={formData.signDate || ''}
                onChange={(e) => onChange('signDate', e.target.value)}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>生效日期 *</label>
              <input
                type="date"
                style={{...styles.input, width: '100%'}}
                value={formData.startDate || ''}
                onChange={(e) => onChange('startDate', e.target.value)}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>结束日期</label>
              <input
                type="date"
                style={{...styles.input, width: '100%'}}
                value={formData.endDate || ''}
                onChange={(e) => onChange('endDate', e.target.value)}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>交付日期</label>
              <input
                type="date"
                style={{...styles.input, width: '100%'}}
                value={formData.deliveryDate || ''}
                onChange={(e) => onChange('deliveryDate', e.target.value)}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>经办人 *</label>
              <input
                type="text"
                style={{...styles.input, width: '100%'}}
                value={formData.responsiblePerson || ''}
                onChange={(e) => onChange('responsiblePerson', e.target.value)}
              />
            </div>
            
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>归属部门 *</label>
              <input
                type="text"
                style={{...styles.input, width: '100%'}}
                value={formData.department || ''}
                onChange={(e) => onChange('department', e.target.value)}
              />
            </div>
            
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>结算方式</label>
              <input
                type="text"
                style={{...styles.input, width: '100%'}}
                value={formData.paymentMethod || ''}
                onChange={(e) => onChange('paymentMethod', e.target.value)}
                placeholder="如：分期付款、验收后付款等"
              />
            </div>
          </div>
        </div>
        
        <div style={styles.modalFooter}>
          <button
            onClick={onClose}
            style={{padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#ffffff', cursor: 'pointer'}}
          >
            取消
          </button>
          <button
            onClick={onSave}
            style={styles.button}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
});

const App = () => {
  // 从 localStorage 加载数据（如果存在）
  const loadContracts = () => {
    try {
      const saved = localStorage.getItem('contracts');
      return saved ? JSON.parse(saved) : initialContracts;
    } catch (error) {
      console.log('localStorage not available, using initial data');
      return initialContracts;
    }
  };

  const [currentView, setCurrentView] = useState('dashboard');
  const [contracts, setContracts] = useState(loadContracts);
  const [selectedContract, setSelectedContract] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('全部');
  const [filterStatus, setFilterStatus] = useState('全部');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  // 保存数据到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('contracts', JSON.stringify(contracts));
    } catch (error) {
      console.log('localStorage not available');
    }
  }, [contracts]);

  const statistics = useMemo(() => {
    const totalContracts = contracts.length;
    const activeContracts = contracts.filter(c => c.status === '履行中').length;
    const totalAmount = contracts.reduce((sum, c) => sum + c.totalAmount, 0);
    const paidAmount = contracts.reduce((sum, c) => sum + c.paidAmount, 0);
    const unpaidAmount = totalAmount - paidAmount;
    const receivables = contracts.filter(c => c.type === '销售').reduce((sum, c) => sum + (c.totalAmount - c.paidAmount), 0);
    const payables = contracts.filter(c => c.type === '采购').reduce((sum, c) => sum + (c.totalAmount - c.paidAmount), 0);
    
    return {
      totalContracts,
      activeContracts,
      totalAmount,
      paidAmount,
      unpaidAmount,
      receivables,
      payables
    };
  }, [contracts]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = 
        contract.contractNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.counterparty.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === '全部' || contract.type === filterType;
      const matchesStatus = filterStatus === '全部' || contract.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [contracts, searchTerm, filterType, filterStatus]);

  const formatCurrency = (amount) => {
    return `¥${amount.toLocaleString('zh-CN')}`;
  };

  const getPaymentProgress = (contract) => {
    return contract.totalAmount > 0 ? (contract.paidAmount / contract.totalAmount * 100).toFixed(1) : 0;
  };

  const getStatusStyle = (status) => {
    const statusStyles = {
      '未开始': { backgroundColor: '#f3f4f6', color: '#374151' },
      '履行中': { backgroundColor: '#dbeafe', color: '#1e40af' },
      '已完结': { backgroundColor: '#d1fae5', color: '#065f46' },
      '终止': { backgroundColor: '#fee2e2', color: '#991b1b' }
    };
    return statusStyles[status] || statusStyles['未开始'];
  };

  const getTypeStyle = (type) => {
    return type === '采购' 
      ? { backgroundColor: '#f3e8ff', color: '#6b21a8' }
      : { backgroundColor: '#d1fae5', color: '#065f46' };
  };

  // 使用 useCallback 确保函数引用稳定
  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setFormData({});
  }, []);

  const handleSaveContract = useCallback(() => {
    // 验证必填字段
    if (!formData.contractNo || !formData.contractName || !formData.counterparty || 
        !formData.totalAmount || !formData.signDate || !formData.startDate || 
        !formData.responsiblePerson || !formData.department) {
      alert('请填写所有必填字段（标记*的字段）');
      return;
    }

    if (formData.id) {
      // 编辑现有合同
      setContracts(prev => prev.map(c => c.id === formData.id ? {
        ...formData,
        totalAmount: Number(formData.totalAmount)
      } : c));
    } else {
      // 新增合同
      const newContract = {
        ...formData,
        id: contracts.length > 0 ? Math.max(...contracts.map(c => c.id)) + 1 : 1,
        paidAmount: 0,
        invoicedAmount: 0,
        totalAmount: Number(formData.totalAmount)
      };
      setContracts(prev => [...prev, newContract]);
    }
    
    setShowForm(false);
    setFormData({});
  }, [formData, contracts]);

  const handleDeleteContract = useCallback((contract) => {
    if (window.confirm(`确定要删除合同"${contract.contractName}"吗？\n\n合同编号：${contract.contractNo}\n此操作不可恢复！`)) {
      setContracts(prev => prev.filter(c => c.id !== contract.id));
      // 如果删除的是当前查看的合同，返回列表
      if (selectedContract && selectedContract.id === contract.id) {
        setSelectedContract(null);
        setCurrentView('list');
      }
    }
  }, [selectedContract]);

  const DashboardView = () => (
    <div>
      <div style={styles.grid}>
        <div style={{...styles.grid, ...styles.grid4}}>
          <div style={styles.statCard}>
            <div>
              <p style={styles.statLabel}>合同总数</p>
              <p style={styles.statValue}>{statistics.totalContracts}</p>
            </div>
            <FileText color="#3b82f6" size={40} />
          </div>
          
          <div style={styles.statCard}>
            <div>
              <p style={styles.statLabel}>履行中合同</p>
              <p style={{...styles.statValue, color: '#059669'}}>{statistics.activeContracts}</p>
            </div>
            <BarChart3 color="#10b981" size={40} />
          </div>
          
          <div style={styles.statCard}>
            <div>
              <p style={styles.statLabel}>合同总金额</p>
              <p style={{...styles.statValue, fontSize: '20px'}}>{formatCurrency(statistics.totalAmount)}</p>
            </div>
            <DollarSign color="#eab308" size={40} />
          </div>
          
          <div style={styles.statCard}>
            <div>
              <p style={styles.statLabel}>待收/待付款</p>
              <p style={{...styles.statValue, color: '#ea580c', fontSize: '20px'}}>{formatCurrency(statistics.unpaidAmount)}</p>
            </div>
            <AlertCircle color="#f97316" size={40} />
          </div>
        </div>
      </div>

      <div style={{...styles.grid, ...styles.grid2}}>
        <div style={styles.card}>
          <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px'}}>财务概览</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb'}}>
              <span style={{color: '#6b7280'}}>应收账款（销售）</span>
              <span style={{fontSize: '18px', fontWeight: '600', color: '#059669'}}>{formatCurrency(statistics.receivables)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb'}}>
              <span style={{color: '#6b7280'}}>应付账款（采购）</span>
              <span style={{fontSize: '18px', fontWeight: '600', color: '#dc2626'}}>{formatCurrency(statistics.payables)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: '#6b7280'}}>已付款/已收款</span>
              <span style={{fontSize: '18px', fontWeight: '600', color: '#2563eb'}}>{formatCurrency(statistics.paidAmount)}</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px'}}>合同状态分布</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {['未开始', '履行中', '已完结', '终止'].map(status => {
              const count = contracts.filter(c => c.status === status).length;
              const percentage = ((count / statistics.totalContracts) * 100).toFixed(0);
              const colors = {
                '未开始': '#9ca3af',
                '履行中': '#3b82f6',
                '已完结': '#10b981',
                '终止': '#ef4444'
              };
              return (
                <div key={status}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px'}}>
                    <span style={{color: '#6b7280'}}>{status}</span>
                    <span style={{fontWeight: '500'}}>{count} ({percentage}%)</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: `${percentage}%`, backgroundColor: colors[status]}} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px'}}>近期到期合同提醒</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          {contracts
            .filter(c => c.status === '履行中')
            .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
            .slice(0, 5)
            .map(contract => (
              <div key={contract.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', borderRadius: '4px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <AlertCircle color="#d97706" size={20} />
                  <div>
                    <p style={{fontWeight: '500', marginBottom: '4px'}}>{contract.contractName}</p>
                    <p style={{fontSize: '14px', color: '#6b7280'}}>{contract.counterparty}</p>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{fontSize: '14px', fontWeight: '500', marginBottom: '4px'}}>到期日期</p>
                  <p style={{fontSize: '14px', color: '#6b7280'}}>{contract.endDate}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const ContractListView = () => (
    <div>
      <div style={styles.searchBar}>
        <div style={styles.searchInput}>
          <div style={{position: 'relative'}}>
            <Search style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af'}} size={20} />
            <input
              type="text"
              placeholder="搜索合同编号、名称..."
              style={{...styles.input, width: '100%', paddingLeft: '40px'}}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <select style={styles.select} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option>全部</option>
          <option>采购</option>
          <option>销售</option>
        </select>
        
        <select style={styles.select} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option>全部</option>
          <option>未开始</option>
          <option>履行中</option>
          <option>已完结</option>
          <option>终止</option>
        </select>
        
        <button
          onClick={() => {
            setFormData({
              contractNo: '',
              contractName: '',
              type: '采购',
              counterparty: '',
              totalAmount: '',
              status: '未开始',
              signDate: '',
              startDate: '',
              endDate: '',
              responsiblePerson: '',
              department: '',
              deliveryDate: '',
              paymentMethod: ''
            });
            setShowForm(true);
          }}
          style={styles.button}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          <Plus size={20} />
          新增合同
        </button>
      </div>

      <div style={styles.card}>
        <div style={{overflowX: 'auto'}}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>合同编号</th>
                <th style={styles.th}>合同名称</th>
                <th style={styles.th}>类别</th>
                <th style={styles.th}>相对方</th>
                <th style={styles.th}>合同金额</th>
                <th style={styles.th}>付款进度</th>
                <th style={styles.th}>状态</th>
                <th style={styles.th}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => (
                <tr key={contract.id} style={{transition: 'background-color 0.2s'}}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}>
                  <td style={{...styles.td, fontWeight: '500', color: '#2563eb'}}>{contract.contractNo}</td>
                  <td style={styles.td}>{contract.contractName}</td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...getTypeStyle(contract.type)}}>
                      {contract.type}
                    </span>
                  </td>
                  <td style={styles.td}>{contract.counterparty}</td>
                  <td style={{...styles.td, fontWeight: '500'}}>{formatCurrency(contract.totalAmount)}</td>
                  <td style={styles.td}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <div style={{flex: 1, ...styles.progressBar}}>
                        <div style={{...styles.progressFill, width: `${getPaymentProgress(contract)}%`}} />
                      </div>
                      <span style={{fontSize: '12px', fontWeight: '500'}}>{getPaymentProgress(contract)}%</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...getStatusStyle(contract.status)}}>
                      {contract.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button
                        onClick={() => {
                          setSelectedContract(contract);
                          setCurrentView('detail');
                        }}
                        style={{color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px'}}
                        onMouseOver={(e) => e.target.style.color = '#1d4ed8'}
                        onMouseOut={(e) => e.target.style.color = '#2563eb'}
                      >
                        查看
                      </button>
                      <span style={{color: '#d1d5db'}}>|</span>
                      <button
                        onClick={() => handleDeleteContract(contract)}
                        style={{color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px'}}
                        onMouseOver={(e) => e.target.style.color = '#991b1b'}
                        onMouseOut={(e) => e.target.style.color = '#dc2626'}
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredContracts.length === 0 && (
          <div style={{textAlign: 'center', padding: '48px', color: '#6b7280'}}>
            <FileText size={48} style={{margin: '0 auto 12px', opacity: 0.5}} />
            <p>暂无符合条件的合同</p>
          </div>
        )}
      </div>
    </div>
  );

  const ContractDetailView = () => {
    if (!selectedContract) return null;
    
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
          <button
            onClick={() => setCurrentView('list')}
            style={{color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px'}}
          >
            ← 返回列表
          </button>
          <div style={{display: 'flex', gap: '12px'}}>
            <button
              onClick={() => handleDeleteContract(selectedContract)}
              style={{...styles.button, backgroundColor: '#dc2626'}}
              onMouseOver={(e) => e.target.style.backgroundColor = '#991b1b'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              删除合同
            </button>
            <button
              onClick={() => {
                setFormData(selectedContract);
                setShowForm(true);
              }}
              style={styles.button}
            >
              编辑合同
            </button>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px'}}>
            <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '4px'}}>{selectedContract.contractName}</h2>
            <p style={{color: '#6b7280'}}>合同编号：{selectedContract.contractNo}</p>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
            <div>
              <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px'}}>基础信息</h3>
              
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>合同类别</p>
                <span style={{...styles.badge, ...getTypeStyle(selectedContract.type)}}>
                  {selectedContract.type}
                </span>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>相对方</p>
                <p style={{fontWeight: '500'}}>{selectedContract.counterparty}</p>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>合同状态</p>
                <span style={{...styles.badge, ...getStatusStyle(selectedContract.status)}}>
                  {selectedContract.status}
                </span>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>经办人</p>
                <p style={{fontWeight: '500'}}>{selectedContract.responsiblePerson}</p>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>归属部门</p>
                <p style={{fontWeight: '500'}}>{selectedContract.department}</p>
              </div>

              <div>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>结算方式</p>
                <p style={{fontWeight: '500'}}>{selectedContract.paymentMethod}</p>
              </div>
            </div>

            <div>
              <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px'}}>财务信息</h3>
              
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>合同总金额</p>
                <p style={{fontSize: '24px', fontWeight: 'bold'}}>{formatCurrency(selectedContract.totalAmount)}</p>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>已付/已收金额</p>
                <p style={{fontSize: '18px', fontWeight: '600', color: '#059669'}}>{formatCurrency(selectedContract.paidAmount)}</p>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>待付/待收金额</p>
                <p style={{fontSize: '18px', fontWeight: '600', color: '#ea580c'}}>
                  {formatCurrency(selectedContract.totalAmount - selectedContract.paidAmount)}
                </p>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>已开票金额</p>
                <p style={{fontWeight: '500'}}>{formatCurrency(selectedContract.invoicedAmount)}</p>
              </div>
              
              <div style={{paddingTop: '16px'}}>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>付款进度</p>
                <div style={{...styles.progressBar, height: '16px'}}>
                  <div style={{
                    ...styles.progressFill, 
                    width: `${getPaymentProgress(selectedContract)}%`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '500',
                    height: '16px'
                  }}>
                    {getPaymentProgress(selectedContract)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb'}}>
            <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px'}}>时间节点</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
              <div>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>签订日期</p>
                <p style={{fontWeight: '500'}}>{selectedContract.signDate}</p>
              </div>
              <div>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>生效日期</p>
                <p style={{fontWeight: '500'}}>{selectedContract.startDate}</p>
              </div>
              <div>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>交付日期</p>
                <p style={{fontWeight: '500'}}>{selectedContract.deliveryDate}</p>
              </div>
              <div>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>结束日期</p>
                <p style={{fontWeight: '500'}}>{selectedContract.endDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>合同台账管理系统</h1>
          <div style={styles.userInfo}>
            <User size={16} />
            管理员
          </div>
        </div>
      </header>

      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <button
            onClick={() => setCurrentView('dashboard')}
            style={{
              ...styles.navButton,
              ...(currentView === 'dashboard' ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            <BarChart3 size={18} />
            数据概览
          </button>
          <button
            onClick={() => setCurrentView('list')}
            style={{
              ...styles.navButton,
              ...(currentView === 'list' || currentView === 'detail' ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            <FileText size={18} />
            合同列表
          </button>
        </div>
      </nav>

      <main style={styles.main}>
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'list' && <ContractListView />}
        {currentView === 'detail' && <ContractDetailView />}
      </main>

      <FormModal
        showForm={showForm}
        formData={formData}
        onClose={handleCloseForm}
        onSave={handleSaveContract}
        onChange={handleFormChange}
      />
    </div>
  );
};

export default App;