import { useState } from 'react';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home() {
  const [activeTab, setActiveTab] = useState('testCases');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data for statistics
  const statistics = {
    testCases: 126,
    testSuites: 15,
    executions: 87,
    passRate: 78
  };
  
  const recentActivity = [
    { id: 1, action: "Created test case", item: "User Login Validation", user: "Sarah Chen", time: "2 hours ago" },
    { id: 2, action: "Executed test suite", item: "Payment Processing", user: "David Kim", time: "5 hours ago" },
    { id: 3, action: "Updated test case", item: "Product Search Functionality", user: "Maya Patel", time: "1 day ago" },
    { id: 4, action: "Failed test case", item: "User Registration Error Handling", user: "James Wilson", time: "2 days ago" }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for "${searchQuery}"...`, {
        position: "bottom-right",
        autoClose: 2000
      });
    }
  };

  // Icon components
  const ClipboardCheckIcon = getIcon('ClipboardCheck');
  const FolderIcon = getIcon('Folder');
  const PlayIcon = getIcon('Play');
  const PercentIcon = getIcon('Percent');
  const SearchIcon = getIcon('Search');
  const ActivityIcon = getIcon('Activity');
  const AwardIcon = getIcon('Award');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white">
            Test Case Management
          </h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">
            Organize, execute, and track test cases efficiently
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-64 lg:w-80">
          <input
            type="text"
            placeholder="Search test cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pr-10"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
          >
            <SearchIcon className="w-5 h-5 text-surface-400" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 flex flex-col bg-gradient-to-br from-primary-light to-primary">
          <div className="flex justify-between items-start">
            <div className="bg-white/20 rounded-lg p-2">
              <ClipboardCheckIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{statistics.testCases}</span>
          </div>
          <h3 className="mt-2 text-sm font-medium text-white/80">Test Cases</h3>
          <p className="mt-1 text-xs text-white/60">+12 this week</p>
        </div>
        
        <div className="card p-5 flex flex-col bg-gradient-to-br from-secondary-light to-secondary">
          <div className="flex justify-between items-start">
            <div className="bg-white/20 rounded-lg p-2">
              <FolderIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{statistics.testSuites}</span>
          </div>
          <h3 className="mt-2 text-sm font-medium text-white/80">Test Suites</h3>
          <p className="mt-1 text-xs text-white/60">+3 this week</p>
        </div>
        
        <div className="card p-5 flex flex-col bg-gradient-to-br from-indigo-400 to-indigo-600">
          <div className="flex justify-between items-start">
            <div className="bg-white/20 rounded-lg p-2">
              <PlayIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{statistics.executions}</span>
          </div>
          <h3 className="mt-2 text-sm font-medium text-white/80">Executions</h3>
          <p className="mt-1 text-xs text-white/60">+24 this week</p>
        </div>
        
        <div className="card p-5 flex flex-col bg-gradient-to-br from-green-400 to-green-600">
          <div className="flex justify-between items-start">
            <div className="bg-white/20 rounded-lg p-2">
              <PercentIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{statistics.passRate}%</span>
          </div>
          <h3 className="mt-2 text-sm font-medium text-white/80">Pass Rate</h3>
          <p className="mt-1 text-xs text-white/60">+5% improvement</p>
        </div>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide border-b border-surface-200 dark:border-surface-700 mb-4">
        <button
          onClick={() => setActiveTab('testCases')}
          className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'testCases'
              ? 'text-primary border-b-2 border-primary'
              : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
          }`}
        >
          Create Test Case
        </button>
        <button
          onClick={() => setActiveTab('recentActivity')}
          className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'recentActivity'
              ? 'text-primary border-b-2 border-primary'
              : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
          }`}
        >
          Recent Activity
        </button>
      </div>

      {activeTab === 'testCases' ? (
        <MainFeature />
      ) : (
        <div className="card">
          <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center">
            <ActivityIcon className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="divide-y divide-surface-200 dark:divide-surface-700">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <AwardIcon className="w-5 h-5 text-primary-light mr-3" />
                    <div>
                      <p className="font-medium text-surface-800 dark:text-surface-200">{activity.action}</p>
                      <p className="text-sm text-primary dark:text-primary-light">{activity.item}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-surface-800 dark:text-surface-300">{activity.user}</p>
                    <p className="text-xs text-surface-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 text-center">
            <button className="text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary font-medium">
              View All Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;