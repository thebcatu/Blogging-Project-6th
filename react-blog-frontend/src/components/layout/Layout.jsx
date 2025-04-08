import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useState } from 'react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-grow">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        {/* Sidebar */}
        <div 
          className={`fixed lg:static inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-64 bg-white shadow-lg`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <main className="container mx-auto px-4 py-8">
            <Outlet />
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;
