import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Plus, BarChart3, FileText, DollarSign, AlertCircle, User } from 'lucide-react';

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
  }
];

// ✅ 样式定义
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
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
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db', // ✅ 修正引号错误
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
    minWidth: '140px',
    flex: '0 1 160px'
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
    transition: 'background-color 0.2s',
    flex: '0 0 auto',
    whiteSpace: 'nowrap'
  },
  searchBar: {
    display: 'flex',
    flexWrap: 'wrap', // ✅ 自动换行防重叠
    gap: '12px',
    marginBottom: '16px',
    alignItems: 'center'
  },
  searchInput: {
    position: 'relative',
    flex: '1 1 320px', // ✅ 搜索框弹性宽度
    minWidth: '240px',
    maxWidth: '100%'
  }
};

// ✅ 新增/编辑合同弹窗
const FormModal = React.memo(({ showForm, formData, onClose, onSave, onChange }) => {
  if (!showForm) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '24px',
          width: '600px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
          {formData.id ? '编辑合同' : '新增合同'}
        </h2>

        {/* ✅ 改为“对方” */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '4px'
            }}
          >
            对方 *
          </label>
          <input
            type="text"
            style={{ ...styles.input, width: '100%' }}
            value={formData.counterparty || ''}
            onChange={(e) => onChange('counterparty', e.target.value)}
          />
        </div>

        <div style={{ textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: '#fff',
              marginRight: '8px'
            }}
          >
            取消
          </button>
          <button onClick={onSave} style={styles.button}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
});

// ✅ 主组件
const App = () => {
  const [contracts, setContracts] = useState(initialContracts);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('全部');
  const [filterStatus, setFilterStatus] = useState('全部');

  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const matchesSearch =
        c.contractNo.includes(searchTerm) || c.contractName.includes(searchTerm);
      const matchesType = filterType === '全部' || c.type === filterType;
      const matchesStatus = filterStatus === '全部' || c.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [contracts, searchTerm, filterType, filterStatus]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveContract = () => {
    if (!formData.counterparty) {
      alert('请填写对方名称');
      return;
    }
    setContracts((prev) => [
      ...prev,
      { ...formData, id: prev.length + 1, totalAmount: 0, paidAmount: 0 }
    ]);
    setShowForm(false);
    setFormData({});
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

      <main style={styles.main}>
        {/* ✅ 顶部工具栏 */}
        <div style={styles.searchBar}>
          <div style={styles.searchInput}>
            <Search
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                pointerEvents: 'none'
              }}
              size={20}
            />
            <input
              type="text"
              placeholder="搜索合同编号、名称..."
              style={{ ...styles.input, width: '100%', paddingLeft: '40px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select style={styles.select} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option>全部</option>
            <option>采购</option>
            <option>销售</option>
          </select>

          <select
            style={styles.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>全部</option>
            <option>未开始</option>
            <option>履行中</option>
            <option>已完结</option>
            <option>终止</option>
          </select>

          <button onClick={() => setShowForm(true)} style={styles.button}>
            <Plus size={20} />
            新增合同
          </button>
        </div>

        {/* ✅ 合同列表 */}
        <div style={styles.card}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>合同编号</th>
                <th>合同名称</th>
                <th>对方</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((c) => (
                <tr key={c.id}>
                  <td>{c.contractNo}</td>
                  <td>{c.contractName}</td>
                  <td>{c.counterparty}</td>
                  <td>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <FormModal
        showForm={showForm}
        formData={formData}
        onClose={() => setShowForm(false)}
        onSave={handleSaveContract}
        onChange={handleFormChange}
      />
    </div>
  );
};

export default App;
