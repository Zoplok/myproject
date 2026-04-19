import { useState } from 'react';
import type { Page, Stream } from './types';
import { FEATURED_STREAMS, RECOMMENDED_STREAMS } from './data/mockData';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import StreamPage from './pages/StreamPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import AIFloatingButton from './components/ai/AIFloatingButton';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);

  const allStreams = [...FEATURED_STREAMS, ...RECOMMENDED_STREAMS];

  const handleNavigate = (page: Page, id?: string) => {
    if (page === 'stream' && id) {
      const stream = allStreams.find(s => s.id === id) ?? allStreams[0];
      setActiveStream(stream);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStream = (id: string) => handleNavigate('stream', id);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Header onNavigate={handleNavigate} onToggleSidebar={() => setSidebarCollapsed(c => !c)} />

      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
      />

      <main
        className={`pt-14 transition-all duration-300 ${
          sidebarCollapsed ? 'pl-14' : 'pl-60'
        }`}
      >
        <div className="p-5 max-w-[1600px] mx-auto">
          {currentPage === 'home' && (
            <HomePage onSelectStream={handleSelectStream} />
          )}
          {currentPage === 'stream' && activeStream && (
            <StreamPage
              stream={activeStream}
              onBack={() => handleNavigate('home')}
              onSelectStream={handleSelectStream}
              onViewProfile={() => handleNavigate('profile')}
            />
          )}
          {currentPage === 'profile' && (
            <ProfilePage onBack={() => handleNavigate('home')} />
          )}
          {currentPage === 'dashboard' && (
            <DashboardPage onBack={() => handleNavigate('home')} />
          )}
        </div>
      </main>

      <AIFloatingButton />
    </div>
  );
}

export default App;
