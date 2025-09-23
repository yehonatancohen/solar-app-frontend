import React, { useState, useEffect, FormEvent, useMemo } from 'react';
import { Card, CardHeader, CardContent, Input, Button, Skeleton } from '../components/ui';
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from '../components/ui';
import api from '../services/api';
import { SocialLinkOut, SocialLinkCreate } from '../types';

type Platform = 'facebook' | 'instagram' | 'linkedin' | 'twitter';

const socialPlatforms: { id: Platform; name: string; icon: React.FC<{ className?: string }>; placeholder: string }[] = [
    { id: 'facebook', name: 'Facebook', icon: FacebookIcon, placeholder: 'e.g., jane.doe' },
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon, placeholder: 'e.g., j.doe' },
    { id: 'linkedin', name: 'LinkedIn', icon: LinkedInIcon, placeholder: 'in/janedoe' },
    { id: 'twitter', name: 'X (Twitter)', icon: XIcon, placeholder: 'e.g., janedoe' },
];

const PlatformIcon: React.FC<{ platform: string, className?: string }> = ({ platform, className }) => {
    const platformInfo = socialPlatforms.find(p => p.id === platform.toLowerCase());
    if (!platformInfo) return null;
    const IconComponent = platformInfo.icon;
    return <IconComponent className={className} />;
};

const SettingsPage: React.FC = () => {
    const [socialLinks, setSocialLinks] = useState<SocialLinkOut[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('facebook');
    const [handle, setHandle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const fetchLinks = async () => {
        try {
            const links = await api.getSocialLinks();
            setSocialLinks(links);
        } catch (err: any) {
            setError(err.message || "Failed to load social links.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!handle) {
            setFormError("Handle cannot be empty.");
            return;
        }
        setIsSubmitting(true);
        setFormError(null);
        try {
            const newLinkData: SocialLinkCreate = { platform: selectedPlatform, handle };
            await api.createSocialLink(newLinkData);
            setHandle('');
            // Refetch links to show the newly added one
            await fetchLinks();
        } catch (err: any) {
            setFormError(err.message || "Failed to add link.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const currentPlaceholder = useMemo(() => {
        return socialPlatforms.find(p => p.id === selectedPlatform)?.placeholder || 'Your handle';
    }, [selectedPlatform]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">Your Social Links</h2>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-2/3" />
                        </div>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : socialLinks.length > 0 ? (
                        <ul className="space-y-3">
                            {socialLinks.map(link => (
                                <li key={link.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                    <PlatformIcon platform={link.platform} className="h-6 w-6 mr-4 text-gray-600 dark:text-gray-300" />
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{link.handle}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">You haven't added any social links yet.</p>
                    )}
                </CardContent>
                
                <form onSubmit={handleSubmit}>
                    <CardHeader className="border-t dark:border-gray-700">
                        <h2 className="text-lg font-semibold">Add a New Link</h2>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {socialPlatforms.map(platform => (
                                    <button
                                        key={platform.id}
                                        type="button"
                                        onClick={() => setSelectedPlatform(platform.id)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${selectedPlatform === platform.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/40' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        <platform.icon className="h-8 w-8 mb-1" />
                                        <span className="text-sm font-medium">{platform.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Input
                            id="handle"
                            label="Your Handle or Username"
                            type="text"
                            value={handle}
                            onChange={e => setHandle(e.target.value)}
                            placeholder={currentPlaceholder}
                            error={formError || undefined}
                            required
                        />
                    </CardContent>
                    <CardContent className="border-t dark:border-gray-700 flex justify-end">
                        <Button type="submit" isLoading={isSubmitting}>
                            Add Link
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
};

export default SettingsPage;