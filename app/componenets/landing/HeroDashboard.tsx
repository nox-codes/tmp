export default function HeroDashboard() {
  return (
    <div className="hero-dashboard-mockup">
      {/* Top Bar */}
      <div className="hero-dashboard-topbar">
        <div className="hero-dashboard-topbar-left">
          <div className="hero-dashboard-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" className="hero-dashboard-logo-svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.9"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="hero-dashboard-nav-items">
            <span className="hero-dashboard-nav-item hero-dashboard-nav-active">Dashboard</span>
            <span className="hero-dashboard-nav-item">Courses</span>
            <span className="hero-dashboard-nav-item">CBT Mode</span>
            <span className="hero-dashboard-nav-item">Analytics</span>
          </div>
        </div>
        <div className="hero-dashboard-topbar-right">
          <div className="hero-dashboard-notification">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span className="hero-dashboard-notification-dot" />
          </div>
          <div className="hero-dashboard-avatar">
            <span>N</span>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="hero-dashboard-body">
        {/* Welcome Section */}
        <div className="hero-dashboard-welcome">
          <div className="hero-dashboard-welcome-text">
            <h3>Welcome back, Nox</h3>
            <p>You have 3 pending assignments and 2 CBTs scheduled</p>
          </div>
          <div className="hero-dashboard-date">
            <span>Today</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="hero-dashboard-stats">
          <div className="hero-dashboard-stat-card">
            <div className="hero-dashboard-stat-icon hero-dashboard-stat-icon-teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div className="hero-dashboard-stat-info">
              <span className="hero-dashboard-stat-label">Overall Score</span>
              <span className="hero-dashboard-stat-number">87.5%</span>
            </div>
            <div className="hero-dashboard-stat-trend hero-dashboard-stat-trend-up">
              <span>+4.2%</span>
            </div>
          </div>

          <div className="hero-dashboard-stat-card">
            <div className="hero-dashboard-stat-icon hero-dashboard-stat-icon-amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
              </svg>
            </div>
            <div className="hero-dashboard-stat-info">
              <span className="hero-dashboard-stat-label">Study Streak</span>
              <span className="hero-dashboard-stat-number">14 Days</span>
            </div>
            <div className="hero-dashboard-stat-trend hero-dashboard-stat-trend-up">
              <span>On fire!</span>
            </div>
          </div>

          <div className="hero-dashboard-stat-card">
            <div className="hero-dashboard-stat-icon hero-dashboard-stat-icon-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="hero-dashboard-stat-info">
              <span className="hero-dashboard-stat-label">CBT Completed</span>
              <span className="hero-dashboard-stat-number">247</span>
            </div>
            <div className="hero-dashboard-stat-trend hero-dashboard-stat-trend-up">
              <span>+23 this week</span>
            </div>
          </div>

          <div className="hero-dashboard-stat-card">
            <div className="hero-dashboard-stat-icon hero-dashboard-stat-icon-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div className="hero-dashboard-stat-info">
              <span className="hero-dashboard-stat-label">Courses</span>
              <span className="hero-dashboard-stat-number">12</span>
            </div>
            <div className="hero-dashboard-stat-trend hero-dashboard-stat-trend-neutral">
              <span>2 new</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="hero-dashboard-charts">
          {/* Performance Chart */}
          <div className="hero-dashboard-chart">
            <div className="hero-dashboard-chart-header">
              <h4>Performance Trend</h4>
              <span className="hero-dashboard-chart-badge">Last 6 months</span>
            </div>
            <div className="hero-dashboard-chart-body">
              <div className="hero-dashboard-bar-chart">
                <div className="hero-dashboard-bar" style={{ height: '45%' }}>
                  <span>45%</span>
                </div>
                <div className="hero-dashboard-bar" style={{ height: '62%' }}>
                  <span>62%</span>
                </div>
                <div className="hero-dashboard-bar" style={{ height: '58%' }}>
                  <span>58%</span>
                </div>
                <div className="hero-dashboard-bar hero-dashboard-bar-highlight" style={{ height: '78%' }}>
                  <span>78%</span>
                </div>
                <div className="hero-dashboard-bar" style={{ height: '82%' }}>
                  <span>82%</span>
                </div>
                <div className="hero-dashboard-bar hero-dashboard-bar-current" style={{ height: '91%' }}>
                  <span>91%</span>
                </div>
              </div>
              <div className="hero-dashboard-bar-labels">
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
          </div>

          {/* Course Progress */}
          <div className="hero-dashboard-chart">
            <div className="hero-dashboard-chart-header">
              <h4>Course Progress</h4>
              <span className="hero-dashboard-chart-badge">This semester</span>
            </div>
            <div className="hero-dashboard-chart-body">
              <div className="hero-dashboard-progress-list">
                <div className="hero-dashboard-progress-item">
                  <div className="hero-dashboard-progress-info">
                    <span className="hero-dashboard-progress-label">CSC 301</span>
                    <span className="hero-dashboard-progress-value">92%</span>
                  </div>
                  <div className="hero-dashboard-progress-bar">
                    <div className="hero-dashboard-progress-fill hero-dashboard-progress-fill-teal" style={{ width: '92%' }} />
                  </div>
                </div>
                <div className="hero-dashboard-progress-item">
                  <div className="hero-dashboard-progress-info">
                    <span className="hero-dashboard-progress-label">MTH 301</span>
                    <span className="hero-dashboard-progress-value">78%</span>
                  </div>
                  <div className="hero-dashboard-progress-bar">
                    <div className="hero-dashboard-progress-fill hero-dashboard-progress-fill-amber" style={{ width: '78%' }} />
                  </div>
                </div>
                <div className="hero-dashboard-progress-item">
                  <div className="hero-dashboard-progress-info">
                    <span className="hero-dashboard-progress-label">PHY 301</span>
                    <span className="hero-dashboard-progress-value">85%</span>
                  </div>
                  <div className="hero-dashboard-progress-bar">
                    <div className="hero-dashboard-progress-fill hero-dashboard-progress-fill-green" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="hero-dashboard-progress-item">
                  <div className="hero-dashboard-progress-info">
                    <span className="hero-dashboard-progress-label">STA 301</span>
                    <span className="hero-dashboard-progress-value">68%</span>
                  </div>
                  <div className="hero-dashboard-progress-bar">
                    <div className="hero-dashboard-progress-fill hero-dashboard-progress-fill-purple" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming CBT */}
        <div className="hero-dashboard-upcoming">
          <h4>Upcoming CBT Sessions</h4>
          <div className="hero-dashboard-upcoming-list">
            <div className="hero-dashboard-upcoming-item">
              <div className="hero-dashboard-upcoming-time">
                <span>10:00 AM</span>
              </div>
              <div className="hero-dashboard-upcoming-info">
                <span className="hero-dashboard-upcoming-course">CSC 301 - Data Structures</span>
                <span className="hero-dashboard-upcoming-details">50 Questions • 60 mins</span>
              </div>
              <div className="hero-dashboard-upcoming-status hero-dashboard-upcoming-status-pending">
                Scheduled
              </div>
            </div>
            <div className="hero-dashboard-upcoming-item">
              <div className="hero-dashboard-upcoming-time">
                <span>2:00 PM</span>
              </div>
              <div className="hero-dashboard-upcoming-info">
                <span className="hero-dashboard-upcoming-course">MTH 301 - Calculus II</span>
                <span className="hero-dashboard-upcoming-details">40 Questions • 45 mins</span>
              </div>
              <div className="hero-dashboard-upcoming-status hero-dashboard-upcoming-status-pending">
                Scheduled
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}