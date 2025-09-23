import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, StatCard, Button, Skeleton } from '../components/ui';
import { CalcResultOut } from '../types';
import { useTheme } from '../contexts/AppContext';

type Tab = 'overview' | 'inputs' | 'calculations' | 'quotes' | 'planner';

// Mock Data
const MOCK_PROJECT = { id: 1, name: "Downtown Commercial Rooftop", status: "Active", updated_at: "2023-10-26T10:00:00Z" };
const MOCK_CALC_RESULT: CalcResultOut = {
    id: 1,
    project_id: 1,
    version: 3,
    created_at: "2023-10-26T11:00:00Z",
    results_json: {
        dc_kw: 50.5,
        kwh_per_kwdc: 1450,
        annual_kwh: 73225,
        monthly_yield: [5000, 5500, 6800, 7200, 7800, 8100, 7900, 7500, 6900, 6100, 5200, 4725],
        financials: { capex: 85000, opex_per_year: 1200, roi_years: 7.8 }
    }
};
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const yieldData = MOCK_CALC_RESULT.results_json.monthly_yield?.map((value, index) => ({ name: MONTHS[index], kWh: value })) || [];
const financials = MOCK_CALC_RESULT.results_json.financials;
const financialData = financials ? [
    { name: 'CAPEX', value: financials.capex },
    { name: 'Annual OPEX', value: financials.opex_per_year },
] : [];


// Main Page Component
const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    // In a real app, you'd fetch project data based on projectId
    const project = MOCK_PROJECT; 

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab />;
            case 'inputs': return <InputsTab />;
            case 'calculations': return <CalculationsTab />;
            case 'quotes': return <QuotesTab />;
            case 'planner': return <InstallPlannerTab />;
            default: return null;
        }
    };

    const TabButton: React.FC<{tab: Tab, label: string}> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === tab ? 'bg-[var(--color-primary-subtle-bg)] text-[var(--color-primary-subtle-text)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
        >
            {label}
        </button>
    );

    return (
        <div>
            <div className="flex items-start gap-4 mb-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span className="ml-2 hidden sm:inline">Back</span>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{project.name}</h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">Status: {project.status} | Last updated: {new Date(project.updated_at).toLocaleString()}</p>
                </div>
            </div>
            <div className="border-b border-[var(--color-border)] mb-6">
                <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    <TabButton tab="overview" label="Overview" />
                    <TabButton tab="inputs" label="Inputs" />
                    <TabButton tab="calculations" label="Calculations" />
                    <TabButton tab="quotes" label="Quotes" />
                    <TabButton tab="planner" label="Install Planner" />
                </nav>
            </div>
            <div>
                {renderTabContent()}
            </div>
        </div>
    );
};

// --- Tab Components ---
const OverviewTab: React.FC = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard title="DC kW" value={`${MOCK_CALC_RESULT.results_json.dc_kw || 0} kWp`} />
            <StatCard title="Annual kWh" value={`${(MOCK_CALC_RESULT.results_json.annual_kwh || 0).toLocaleString()} kWh`} />
            <StatCard title="Latest Quote" value="$98,500.00" />
        </div>
        <Card>
            <CardHeader><h3 className="text-lg font-medium">Activity Feed</h3></CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    <li className="text-sm">Calculation v3 run - <span className="text-[var(--color-text-secondary)]">2 hours ago</span></li>
                    <li className="text-sm">Inputs saved - <span className="text-[var(--color-text-secondary)]">3 hours ago</span></li>
                    <li className="text-sm">Quote #Q23-01 sent - <span className="text-[var(--color-text-secondary)]">1 day ago</span></li>
                </ul>
            </CardContent>
        </Card>
    </div>
);

const InputsTab: React.FC = () => (
    <Card>
        <CardHeader><h3 className="text-lg font-medium">Project Inputs</h3></CardHeader>
        <CardContent>
            <p className="text-center py-8 text-[var(--color-text-secondary)]">Input form sections (Site, Demand, PV, Financials) would be displayed here.</p>
        </CardContent>
        <CardContent className="border-t border-[var(--color-border)]">
             <Button>Save Inputs</Button>
        </CardContent>
    </Card>
);

const CalculationsTab: React.FC = () => {
    const { theme } = useTheme();
    const tooltipStyle = theme === 'dark' 
        ? { backgroundColor: '#374151', border: '1px solid #4b5563', color: '#f9fafb' } 
        : { backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e5e7eb' };
    const axisColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
    const gridColor = theme === 'dark' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(209, 213, 219, 0.4)';


    return (
     <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Calculation Results</h2>
            <Button variant="primary">Run New Calculation</Button>
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard title="DC kW" value={`${MOCK_CALC_RESULT.results_json.dc_kw || 0} kWp`} />
            <StatCard title="kWh/kWdc" value={`${MOCK_CALC_RESULT.results_json.kwh_per_kwdc || 0}`} />
            <StatCard title="Annual kWh" value={`${(MOCK_CALC_RESULT.results_json.annual_kwh || 0).toLocaleString()}`} />
        </div>
        <Card>
            <CardHeader><h3 className="font-medium">Energy Yield (12 months)</h3></CardHeader>
            <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={yieldData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="name" className="text-xs" stroke={axisColor} />
                            <YAxis unit=" kWh" className="text-xs" stroke={axisColor} />
                            <Tooltip
                                contentStyle={tooltipStyle}
                                cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
                            />
                            <Legend wrapperStyle={{ color: axisColor }} />
                            <Bar dataKey="kWh" fill="#3b82f6" name="Energy Yield"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><h3 className="font-medium">Financial Summary</h3></CardHeader>
            <CardContent>
                 <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={financialData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                            <XAxis type="number" unit="$" className="text-xs" stroke={axisColor} />
                            <YAxis type="category" dataKey="name" width={100} className="text-xs" stroke={axisColor} />
                            <Tooltip formatter={(value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} contentStyle={tooltipStyle} cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }} />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </CardContent>
        </Card>
     </div>
    );
};

const QuotesTab: React.FC = () => (
     <Card>
        <CardHeader>
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Quotes</h3>
                <Button>New Quote</Button>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-center py-8 text-[var(--color-text-secondary)]">A list of generated quotes would appear here.</p>
        </CardContent>
    </Card>
);

const InstallPlannerTab: React.FC = () => (
     <Card>
        <CardHeader><h3 className="text-lg font-medium">Installation Planner</h3></CardHeader>
        <CardContent>
            <p className="text-center py-8 text-[var(--color-text-secondary)]">List, Kanban, or Calendar view for installation tasks would be here.</p>
        </CardContent>
    </Card>
);

export default ProjectDetailPage;