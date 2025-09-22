
import React, { useState, useEffect, useMemo } from 'react';
import { ProjectOut } from '../types';
import api from '../services/api';
import { Card, CardContent, CardHeader, Input, Button, Skeleton } from '../components/ui';
import { Link } from 'react-router-dom';

const ProjectsListPage: React.FC = () => {
    const [projects, setProjects] = useState<ProjectOut[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Mocking project data since API does not provide all fields
                const fetchedProjects: ProjectOut[] = await Promise.resolve([
                    { id: 1, name: "Downtown Commercial Rooftop", currency: "USD", status: "Active", site_location_json: {}, owner: "Jane Doe", updated_at: "2023-10-26T10:00:00Z" },
                    { id: 2, name: "Suburban Residence", currency: "USD", status: "Draft", site_location_json: {}, owner: "John Smith", updated_at: "2023-10-25T14:30:00Z" },
                    { id: 3, name: "Industrial Park Ground Mount", currency: "EUR", status: "Archived", site_location_json: {}, owner: "Jane Doe", updated_at: "2023-09-15T11:00:00Z" },
                    { id: 4, name: "Community Solar Farm", currency: "USD", status: "Active", site_location_json: {}, owner: "Peter Jones", updated_at: "2023-10-20T09:00:00Z" },
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

    const filteredProjects = useMemo(() => {
        return projects.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [projects, searchTerm]);

    const StatusBadge: React.FC<{status: string}> = ({status}) => {
        const statusMap: {[key: string]: string} = {
            'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'Draft': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            'Archived': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        };
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
                <Link to="/projects/new"><Button variant="primary">New Project</Button></Link>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="w-1/3">
                             <Input id="search" label="" placeholder="Search projects..." type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        {/* Filter dropdowns could go here */}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Owner</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {isLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-5 w-48" /></td>
                                            <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-5 w-24" /></td>
                                            <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-5 w-20" /></td>
                                            <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-5 w-32" /></td>
                                            <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-8 w-16" /></td>
                                        </tr>
                                    ))
                                ) : filteredProjects.map(project => (
                                    <tr key={project.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{project.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{project.owner}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={project.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(project.updated_at || Date.now()).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/projects/${project.id}`}><Button size="sm">Open</Button></Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!isLoading && filteredProjects.length === 0 && (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium">No projects found</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {searchTerm ? 'Try adjusting your search.' : 'Create your first project to get started.'}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectsListPage;
