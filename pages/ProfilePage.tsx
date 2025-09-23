import React, { useState, useEffect, FormEvent, useMemo } from 'react';
import { Card, CardHeader, CardContent, CardFooter, Input, Button, Skeleton } from '../components/ui';
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon, ArrowTopRightOnSquareIcon } from '../components/ui';
import api from '../services/api';
import { SocialLinkOut, SocialLinkCreate } from '../types';
import { useAuth } from '../contexts/AppContext';

type Platform = 'facebook' | 'instagram' | 'linkedin' | 'twitter';

const socialPlatforms: { id: Platform; name: string; icon: React.FC<{ className?: string }>; placeholder: string; baseUrl: string; helpText: string; }[] = [
    { id: 'facebook', name: 'Facebook', icon: FacebookIcon, placeholder: 'e.g., jane.doe', baseUrl: 'https://www.facebook.com/', helpText: 'Enter your Facebook profile name.' },
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon, placeholder: 'e.g., j.doe', baseUrl: 'https://www.instagram.com/', helpText: "Enter your Instagram username, without the '@'." },
    { id: 'linkedin', name: 'LinkedIn', icon: LinkedInIcon, placeholder: 'in/janedoe', baseUrl: 'https://www.linkedin.com/', helpText: 'Enter your LinkedIn profile path (e.g., in/yourname).' },
    { id: 'twitter', name: 'X (Twitter)', icon: XIcon, placeholder: 'e.g., janedoe', baseUrl: 'https://x.com/', helpText: "Enter your X (Twitter) username, without the '@'." },
];

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [socialLinks, setSocialLinks] = useState<SocialLinkOut[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('facebook');
    const [handle, setHandle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const fetchLinks = async () => {
        setIsLoading(true);
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

    const addedPlatforms = useMemo(() => socialLinks.map(link => link.platform.toLowerCase()), [socialLinks]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if (!handle) {
            setFormError("Handle cannot be empty.");
            return;
        }
        if (addedPlatforms.includes(selectedPlatform)) {
            setFormError("You have already added a link for this platform.");
            return;
        }

        setIsSubmitting(true);
        try {
            const newLinkData: SocialLinkCreate = { platform: selectedPlatform, handle };
            await api.createSocialLink(newLinkData);
            setHandle('');
            await fetchLinks(); // Refetch links
        } catch (err: any) {
            setFormError(err.message || "Failed to add link.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const currentPlatformInfo = useMemo(() => {
        return socialPlatforms.find(p => p.id === selectedPlatform);
    }, [selectedPlatform]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Profile & Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="flex flex-col items-center text-center p-8">
                            <div className="w-24 h-24 rounded-full bg-[var(--color-primary-subtle-bg)] flex items-center justify-center mb-4">
                                <span className="text-4xl font-semibold text-[var(--color-primary-subtle-text)]">{user?.name?.charAt(0)}</span>
                            </div>
                            <h2 className="text-xl font-bold">{user?.name}</h2>
                            <p className="text-[var(--color-text-secondary)]">{user?.email}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                     <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Your Social Links</h2>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-2/3" />
                                </div>
                            ) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : socialLinks.length > 0 ? (
                                <ul className="space-y-3">
                                    {socialLinks.map(link => {
                                        const platform = socialPlatforms.find(p => p.id === link.platform.toLowerCase());
                                        const fullUrl = platform ? `${platform.baseUrl}${link.handle}` : '#';

                                        return (
                                            <li key={link.id} className="flex items-center justify-between p-3 bg-[var(--color-bg-primary)] rounded-md">
                                                <div className="flex items-center">
                                                    {platform && <platform.icon className="h-6 w-6 mr-4 text-[var(--color-text-secondary)]" />}
                                                    <span className="font-medium text-[var(--color-text-primary)]">{link.handle}</span>
                                                </div>
                                                <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 font-medium">
                                                    View
                                                    <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                                                </a>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : (
                                <p className="text-[var(--color-text-secondary)]">You haven't added any social links yet.</p>
                            )}
                        </CardContent>
                        
                        <form onSubmit={handleSubmit}>
                            <CardHeader className="border-t border-[var(--color-border)]">
                                <h2 className="text-lg font-semibold">Add a New Link</h2>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Platform</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {socialPlatforms.map(platform => (
                                            <button
                                                key={platform.id}
                                                type="button"
                                                onClick={() => setSelectedPlatform(platform.id)}
                                                disabled={addedPlatforms.includes(platform.id)}
                                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${selectedPlatform === platform.id ? 'border-primary-500 bg-[var(--color-primary-subtle-bg)]' : 'border-[var(--color-border-input)] hover:bg-[var(--color-bg-primary)]'}`}
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
                                    placeholder={currentPlatformInfo?.placeholder}
                                    helpText={currentPlatformInfo?.helpText}
                                    error={formError || undefined}
                                    required
                                />
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button type="submit" isLoading={isSubmitting}>
                                    Add Link
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;