import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { KanbanBoard } from './features/kanban/KanbanBoard';
import { FinanceDashboard } from './features/finance/FinanceDashboard';
import { InventoryDashboard } from './features/inventory/InventoryDashboard';
import { EmployeeManagement } from './features/inventory/EmployeeManagement';

function App() {
  const [activeTab, setActiveTab] = useState('kanban');

  const renderContent = () => {
    switch (activeTab) {
      case 'kanban':
        return <KanbanBoard />;
      case 'finance':
        return <FinanceDashboard />;
      case 'inventory':
        return <InventoryDashboard />;
      case 'employees':
        return <EmployeeManagement />;
      default:
        return <div className="text-gray-500 text-center mt-20">Selecione um módulo na barra lateral.</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
