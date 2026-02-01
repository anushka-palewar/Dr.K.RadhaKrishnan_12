// Home.jsx
import { useState } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar2 from "../components/layout/Navbar2";

import './Home.css'

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  Activity, Clock, CheckCircle, AlertTriangle,
  TrendingUp, RefreshCw, Filter, MoreVertical
} from 'lucide-react'


// Sample Data
const kpiData = [
  {
    title: 'Total Service Requests',
    value: '2,847',
    trend: '+12.5%',
    icon: Activity,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)'
  },
  {
    title: 'Open Requests',
    value: '342',
    trend: '-4.2%',
    icon: AlertTriangle,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  },
  {
    title: 'SLA Compliance',
    value: '94.2%',
    trend: '+2.1%',
    icon: CheckCircle,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)'
  },
  {
    title: 'Avg Resolution Time',
    value: '2.4h',
    trend: '-8.3%',
    icon: Clock,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)'
  }
]

const categoryChartData = [
  { name: 'IT Support', value: 480 },
  { name: 'Facilities', value: 320 },
  { name: 'Finance', value: 240 },
  { name: 'HR Services', value: 180 },
  { name: 'Admin', value: 120 }
]

const slaData = [
  { date: 'Mon', compliance: 92 },
  { date: 'Tue', compliance: 94 },
  { date: 'Wed', compliance: 89 },
  { date: 'Thu', compliance: 95 },
  { date: 'Fri', compliance: 98 },
  { date: 'Sat', compliance: 91 },
  { date: 'Sun', compliance: 93 }
]

const teamWorkloadData = [
  { team: 'Team A', completed: 120, inProgress: 45, open: 32 },
  { team: 'Team B', completed: 98, inProgress: 38, open: 28 },
  { team: 'Team C', completed: 156, inProgress: 52, open: 38 },
  { team: 'Team D', completed: 87, inProgress: 29, open: 18 }
]

const delayData = [
  { category: 'IT Support', delays: 12, severity: 'critical' },
  { category: 'Facilities', delays: 8, severity: 'warning' },
  { category: 'Finance', delays: 3, severity: 'info' },
  { category: 'HR Services', delays: 5, severity: 'warning' },
  { category: 'Admin', delays: 2, severity: 'info' }
]

const alerts = [
  {
    id: 1,
    severity: 'critical',
    title: 'High SLA Breaches',
    message: 'IT Support category has exceeded 15% breach threshold',
    icon: AlertTriangle
  },
  {
    id: 2,
    severity: 'warning',
    title: 'Team Workload Alert',
    message: 'Team A approaching maximum capacity with 45 in-progress requests',
    icon: Activity
  },
  {
    id: 3,
    severity: 'info',
    title: 'Daily Performance',
    message: 'Overall SLA compliance improved by 2.1% compared to last week',
    icon: TrendingUp
  }
]

// KPI Card Component
function KPICard({ title, value, trend, icon: Icon, color, bgColor }) {
  const isPositive = trend.startsWith('+')
  return (
    <div className="kpi-card" style={{ '--card-bg': bgColor, '--accent-color': color }}>
      <div className="kpi-icon">
        <Icon size={24} color={color} />
      </div>
      <div className="kpi-content">
        <p className="kpi-title">{title}</p>
        <h3 className="kpi-value">{value}</h3>
        <span className={`kpi-trend ${isPositive ? 'positive' : 'negative'}`}>
          {trend}
        </span>
      </div>
    </div>
  )
}


// Filter Bar Component
function FilterBar() {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <button className="filter-btn">
          <Filter size={16} />
          <span>Date Range</span>
        </button>
        <button className="filter-btn">
          <span>Category</span>
        </button>
        <button className="filter-btn">
          <span>Priority</span>
        </button>
        <button className="filter-btn">
          <span>Team</span>
        </button>
      </div>
      <button className="refresh-btn">
        <RefreshCw size={16} />
      </button>
    </div>
  )
}

// Chart Card Component
function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`chart-card ${className}`}>
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <button className="menu-btn">
          <MoreVertical size={16} />
        </button>
      </div>
      <div className="chart-content">
        {children}
      </div>
    </div>
  )
}

// Alert Card Component
function AlertCard({ severity, title, message, icon: Icon }) {
  const severityConfig = {
    critical: { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
    warning: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
    info: { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' }
  }
  const config = severityConfig[severity]

  return (
    <div className="alert-card" style={{ '--alert-color': config.color, '--alert-bg': config.bgColor }}>
      <Icon size={20} color={config.color} />
      <div className="alert-content">
        <h4 className="alert-title">{title}</h4>
        <p className="alert-message">{message}</p>
      </div>
    </div>
  )
}
<section className="powerbi-section">
  <h2 className="section-title">Power BI Report</h2>
  <div className="powerbi-embed-container" style={{ width: '100%', height: '600px', margin: '20px 0' }}>
    <iframe
      title="Power BI Report"
      width="100%"
      height="100%"
      src="https://app.powerbi.com/reportEmbed?reportId=940870b6-fa26-45ee-ab1b-03d0882e0893&autoAuth=true&ctid=0ed51ad7-52cc-4234-b54a-76b82d40b5c3"
      frameBorder="0"
      allowFullScreen={true}
      style={{ borderRadius: '12px', backgroundColor: '#1f2937' }}
    />
  </div>
</section>

// Main Dashboard Component (Home)
export default function Home() {
  const [refreshing, setRefreshing] = useState(false)
  const navigate = useNavigate()

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 600)
  }

  return (
    <div className="dashboard">
      <Navbar2 
        onOpenAI={() => navigate('/ai-assistance')}
        onAddRequest={() => navigate('/add-request')}
      />

      {/* Dashboard Content */}
      <div className="p-6">
        {/* KPI cards & charts go here */}
      </div>

      {/* KPI Cards */}
      <section className="kpi-section">
        <div className="kpi-grid">
          {kpiData.map((kpi, idx) => (
            <KPICard key={idx} {...kpi} />
          ))}
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <section className="main-grid">
        {/* Left Column */}
        <div className="grid-column">
          {/* Category Chart */}
          <ChartCard title="Service Requests by Category">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404853" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #404853',
                    borderRadius: '8px'
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* SLA Trend Chart */}
          <ChartCard title="SLA Adherence Trend (7 Days)">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={slaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404853" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[85, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #404853',
                    borderRadius: '8px'
                  }}
                  cursor={{ stroke: 'rgba(16, 185, 129, 0.2)' }}
                />
                <Line
                  type="monotone"
                  dataKey="compliance"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right Column */}
        <div className="grid-column">
          {/* Workload Distribution Chart */}
          <ChartCard title="Workload Distribution by Team">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={teamWorkloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404853" />
                <XAxis dataKey="team" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #404853',
                    borderRadius: '8px'
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Legend wrapperStyle={{ color: '#9ca3af' }} />
                <Bar dataKey="completed" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="inProgress" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="open" fill="#ef4444" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Resolution Delays Chart */}
          <ChartCard title="Resolution Delays by Category">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={delayData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#404853" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis type="category" dataKey="category" width={100} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #404853',
                    borderRadius: '8px'
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar
                  dataKey="delays"
                  fill="#8b5cf6"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      {/* Key Insights & Alerts */}
      <section className="alerts-section">
        <h2 className="alerts-title">Key Insights & Alerts</h2>
        <div className="alerts-grid">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} {...alert} />
          ))}
          
        </div>
      </section>
      <section className="powerbi-section">
  <h2 className="section-title">Power BI Report</h2>
  <div
    className="powerbi-embed-container"
    style={{ width: '100%', height: '600px', margin: '20px 0' }}
  >
    <iframe
      title="Power BI Report"
      width="100%"
      height="100%"
      src="https://app.powerbi.com/reportEmbed?reportId=940870b6-fa26-45ee-ab1b-03d0882e0893&autoAuth=true&ctid=0ed51ad7-52cc-4234-b54a-76b82d40b5c3"
      frameBorder="0"
      allowFullScreen={true}
      style={{ borderRadius: '12px', backgroundColor: '#1f2937' }}
    />
  </div>
</section>
      
    </div>
  )
}
