
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AppContext';
import { ProjectOut } from '../types';
import api from '../services/api';
import { Card, CardContent, CardHeader, StatCard, Skeleton, Button } from '../components/ui';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<ProjectOut[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Mocking project data since API does not provide all fields
                const fetchedProjects: ProjectOut[] = await Promise.resolve([
                    { id: 1, name: "Downtown Commercial Rooftop", currency: "USD", status: "Active", site_location_json: {}, owner: "Jane Doe", updated_at: "2023-10-26T10:00:00Z" },
                    { id: 2, name: "Suburban Residence", currency: "USD", status: "Draft", site_location_json: {}, owner: "John Smith", updated_at: "2023-10-25T14:30:00Z" },
                    { id: 3, name: "Industrial Park Ground Mount", currency: "EUR", status: "Archived", site_location_json: {}, owner: "Jane Doe", updated_at: "2023-09-15T11:00:00Z" },
                ]);
                // In a real app: const fetchedProjects = await api.getProjects();
                setProjects(fetchedProjects);
            } catch (err) {
                setError("Failed to load projects.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const activeProjects = projects.filter(p => p.status === 'Active').length;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome, {user?.name}!
                </h1>
                <Link to="/projects/new">
                   <Button variant="primary">Create Project</Button>
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    <>
                        <Skeleton className="h-28" />
                        <Skeleton className="h-28" />
                        <Skeleton className="h-28" />
                        <Skeleton className="h-28" />
                    </>
                ) : (
                    <>
                        <StatCard title="Active Projects" value={activeProjects} />
                        <StatCard title="Quotes Pending" value="3" />
                        <StatCard title="Tasks Due" value="1" />
                        <StatCard title="Estimated Annual kWh" value="1.2M" />
                    </>
                )}
            </div>
            
            {/* Panels */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentProjects projects={projects} isLoading={isLoading} />
                <ExpiringQuotes isLoading={isLoading} />
            </div>
        </div>
    );
};

const RecentProjects: React.FC<{ projects: ProjectOut[], isLoading: boolean }> = ({ projects, isLoading }) => (
    <Card>
        <CardHeader>
            <h2 className="text-lg font-medium">Recent Projects</h2>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                </div>
            ) : projects.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {projects.slice(0, 5).map(p => (
                        <li key={p.id} className="py-3 flex justify-between items-center">
                            <div>
                                <Link to={`/projects/${p.id}`} className="font-medium text-primary-600 hover:text-primary-500">{p.name}</Link>
                                <p className="text-sm text-gray-500">{p.status}</p>
                            </div>
                            <span className="text-sm text-gray-500">{new Date(p.updated_at || Date.now()).toLocaleDateString()}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 py-4">No projects yet.</p>
            )}
        </CardContent>
    </Card>
);

const ExpiringQuotes: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
     <Card>
        <CardHeader>
            <h2 className="text-lg font-medium">Expiring Quotes</h2>
        </CardHeader>
        <CardContent>
             {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                </div>
            ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <li className="py-3 flex justify-between items-center">
                       <div>
                            <p className="font-medium">Quote #Q2023-015</p>
                            <p className="text-sm text-red-500">Expires in 3 days</p>
                        </div>
                        <Button size="sm">View</Button>
                    </li>
                     <li className="py-3 flex justify-between items-center">
                       <div>
                            <p className="font-medium">Quote #Q2023-011</p>
                            <p className="text-sm text-yellow-500">Expires in 12 days</p>
                        </div>
                        <Button size="sm">View</Button>
                    </li>
                </ul>
            )}
        </CardContent>
    </Card>
);

export default DashboardPage;
