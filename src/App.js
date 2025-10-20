import React, { useState, useMemo } from 'react';
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

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [contracts, setContracts] = useState(initialContracts);
  const [selectedContract, setSelectedContract] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('全部');
  const [filterStatus, setFilterStatus] = useState('全部');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  // 统计数据
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

  // 过滤合同
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

  // 格式化金额
  const formatCurrency = (amount) => {
    return `¥${amount.toLocaleString('zh-CN')}`;
  };

  // 计算付款进度
  const getPaymentProgress = (contract) => {
    return contract.totalAmount > 0 ? (contract.paidAmount / contract.totalAmount * 100).toFixed(1) : 0;
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    const colors = {
      '未开始': 'bg-gray-100 text-gray-800',
      '履行中': 'bg-blue-100 text-blue-800',
      '已完结': 'bg-green-100 text-green-800',
      '终止': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // 新增或编辑合同
  const handleSaveContract = () => {
    if (formData.id) {
      // 编辑
      setContracts(contracts.map(c => c.id === formData.id ? formData : c));
    } else {
      // 新增
      const newContract = {
        ...formData,
        id: Math.max(...contracts.map(c => c.id)) + 1,
        paidAmount: 0,
        invoicedAmount: 0
      };
      setContracts([...contracts, newContract]);
    }
    setShowForm(false);
    setFormData({});
  };

  // 仪表盘视图
  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">合同总数</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statistics.totalContracts}</p>
            </div>
            <FileText className="text-blue-500" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">履行中合同</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{statistics.activeContracts}</p>
            </div>
            <BarChart3 className="text-green-500" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">合同总金额</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(statistics.totalAmount)}</p>
            </div>
            <DollarSign className="text-yellow-500" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">待收/待付款</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">{formatCurrency(statistics.unpaidAmount)}</p>
            </div>
            <AlertCircle className="text-orange-500" size={40} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">财务概览</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">应收账款（销售）</span>
              <span className="text-lg font-semibold text-green-600">{formatCurrency(statistics.receivables)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">应付账款（采购）</span>
              <span className="text-lg font-semibold text-red-600">{formatCurrency(statistics.payables)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">已付款/已收款</span>
              <span className="text-lg font-semibold text-blue-600">{formatCurrency(statistics.paidAmount)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">合同状态分布</h3>
          <div className="space-y-3">
            {['未开始', '履行中', '已完结', '终止'].map(status => {
              const count = contracts.filter(c => c.status === status).length;
              const percentage = ((count / statistics.totalContracts) * 100).toFixed(0);
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{status}</span>
                    <span className="font-medium">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status === '未开始' ? 'bg-gray-400' :
                        status === '履行中' ? 'bg-blue-500' :
                        status === '已完结' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">近期到期合同提醒</h3>
        <div className="space-y-3">
          {contracts
            .filter(c => c.status === '履行中')
            .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
            .slice(0, 5)
            .map(contract => (
              <div key={contract.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-yellow-600" size={20} />
                  <div>
                    <p className="font-medium">{contract.contractName}</p>
                    <p className="text-sm text-gray-600">{contract.counterparty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">到期日期</p>
                  <p className="text-sm text-gray-600">{contract.endDate}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // 合同列表视图
  const ContractListView = () => (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索合同编号、名称或相对方..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option>全部</option>
          <option>采购</option>
          <option>销售</option>
        </select>
        
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={20} />
          新增合同
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">合同编号</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">合同名称</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">类别</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">相对方</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">合同金额</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">付款进度</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">状态</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{contract.contractNo}</td>
                  <td className="px-4 py-3 text-sm">{contract.contractName}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      contract.type === '采购' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {contract.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{contract.counterparty}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(contract.totalAmount)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${getPaymentProgress(contract)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{getPaymentProgress(contract)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => {
                        setSelectedContract(contract);
                        setCurrentView('detail');
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      查看
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredContracts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-3 opacity-50" />
            <p>暂无符合条件的合同</p>
          </div>
        )}
      </div>
    </div>
  );

  // 合同详情视图
  const ContractDetailView = () => {
    if (!selectedContract) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('list')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← 返回列表
          </button>
          <button
            onClick={() => {
              setFormData(selectedContract);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            编辑合同
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{selectedContract.contractName}</h2>
            <p className="text-gray-600 mt-1">合同编号：{selectedContract.contractNo}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">基础信息</h3>
              
              <div>
                <p className="text-sm text-gray-600">合同类别</p>
                <p className="font-medium mt-1">
                  <span className={`px-2 py-1 rounded text-sm ${
                    selectedContract.type === '采购' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedContract.type}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">相对方</p>
                <p className="font-medium mt-1">{selectedContract.counterparty}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">合同状态</p>
                <p className="font-medium mt-1">
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(selectedContract.status)}`}>
                    {selectedContract.status}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">经办人</p>
                <p className="font-medium mt-1">{selectedContract.responsiblePerson}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">归属部门</p>
                <p className="font-medium mt-1">{selectedContract.department}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">结算方式</p>
                <p className="font-medium mt-1">{selectedContract.paymentMethod}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">财务信息</h3>
              
              <div>
                <p className="text-sm text-gray-600">合同总金额</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(selectedContract.totalAmount)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">已付/已收金额</p>
                <p className="text-lg font-semibold text-green-600 mt-1">{formatCurrency(selectedContract.paidAmount)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">待付/待收金额</p>
                <p className="text-lg font-semibold text-orange-600 mt-1">
                  {formatCurrency(selectedContract.totalAmount - selectedContract.paidAmount)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">已开票金额</p>
                <p className="font-medium mt-1">{formatCurrency(selectedContract.invoicedAmount)}</p>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-2">付款进度</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${getPaymentProgress(selectedContract)}%` }}
                  >
                    {getPaymentProgress(selectedContract)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">时间节点</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">签订日期</p>
                <p className="font-medium mt-1">{selectedContract.signDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">生效日期</p>
                <p className="font-medium mt-1">{selectedContract.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">交付日期</p>
                <p className="font-medium mt-1">{selectedContract.deliveryDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">结束日期</p>
                <p className="font-medium mt-1">{selectedContract.endDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 表单弹窗
  const FormModal = () => {
    if (!showForm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">{formData.id ? '编辑合同' : '新增合同'}</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">合同编号 *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.contractNo || ''}
                  onChange={(e) => setFormData({...formData, contractNo: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">合同名称 *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.contractName || ''}
                  onChange={(e) => setFormData({...formData, contractName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">合同类别 *</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.type || '采购'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>采购</option>
                  <option>销售</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">相对方 *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.counterparty || ''}
                  onChange={(e) => setFormData({...formData, counterparty: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">合同金额 *</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.totalAmount || ''}
                  onChange={(e) => setFormData({...formData, totalAmount: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">合同状态 *</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status || '未开始'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option>未开始</option>
                  <option>履行中</option>
                  <option>已完结</option>
                  <option>终止</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">签订日期 *</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.signDate || ''}
                  onChange={(e) => setFormData({...formData, signDate: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">生效日期 *</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">交付日期</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.deliveryDate || ''}
                  onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">经办人 *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.responsiblePerson || ''}
                  onChange={(e) => setFormData({...formData, responsiblePerson: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">归属部门 *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">结算方式</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.paymentMethod || ''}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  placeholder="如：分期付款、验收后付款等"
                />
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t flex justify-end gap-3">
            <button
              onClick={() => {
                setShowForm(false);
                setFormData({});
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleSaveContract}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">合同台账管理系统</h1>
            <div className="text-sm text-gray-600">
              <User className="inline mr-1" size={16} />
              管理员
            </div>
          </div>
        </div>
      </header>

      {/* 主导航 */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="inline mr-2" size={18} />
              数据概览
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'list' || currentView === 'detail'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="inline mr-2" size={18} />
              合同列表
            </button>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'list' && <ContractListView />}
        {currentView === 'detail' && <ContractDetailView />}
      </main>

      {/* 表单弹窗 */}
      <FormModal />
    </div>
  );
};

export default App;