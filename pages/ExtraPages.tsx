
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Button } from '../components/ui';
import { useAuth } from '../contexts/AppContext';
import api from '../services/api';

// --- Paywall Page ---
export const PaywallPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [isLoading, setIsLoading] = useState<'stripe' | 'mobile' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async (provider: 'stripe' | 'mobile') => {
        setIsLoading(provider);
        setError(null);
        try {
            // The backend is expected to handle the redirect to the payment provider.
            // A real implementation would depend on the exact API response,
            // which might include a URL to navigate to.
            await api.createCheckoutSession({ provider });
            // If the call is successful but no redirect happens, we might need
            // to poll for user status change. For this implementation, we assume a
            // redirect is handled by the backend or the page will be reloaded.
        } catch (err: any) {
            setError(err.message || `Failed to initiate ${provider === 'stripe' ? 'Visa' : 'Mobile Money'} payment.`);
            setIsLoading(null);
        }
        // Do not set isLoading to null on success, as the page should be navigating away.
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
             <div className="text-center mb-8">
                 <h1 className="text-3xl font-bold">Account Inactive</h1>
                 <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome, {user?.name}. Please activate your account to continue.</p>
                  {error && <p className="mt-4 text-red-500">{error}</p>}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                <Card className="text-center">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Pay with Visa</h2>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500 mb-6">Securely pay with your credit or debit card via Stripe.</p>
                        <Button 
                            variant="primary" 
                            className="w-full"
                            onClick={() => handleCheckout('stripe')}
                            isLoading={isLoading === 'stripe'}
                            disabled={!!isLoading}
                        >
                            Continue to Payment
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="text-center">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Pay with Mobile Money</h2>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500 mb-6">Pay instantly using your mobile money account.</p>
                        <Button 
                            variant="secondary" 
                            className="w-full"
                            onClick={() => handleCheckout('mobile')}
                            isLoading={isLoading === 'mobile'}
                            disabled={!!isLoading}
                        >
                            Continue to Payment
                        </Button>
                    </CardContent>
                </Card>
             </div>
              <Button variant="ghost" className="mt-8" onClick={logout}>Logout</Button>
        </div>
    );
};

// --- Help Page ---
export const HelpPage: React.FC = () => (
    <div>
        <h1 className="text-2xl font-bold mb-6">Help & FAQ</h1>
        <Card>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold">How do I enter project inputs?</h3>
                    <p className="text-gray-600 dark:text-gray-400">Navigate to a project's detail page and click on the 'Inputs' tab. Fill out the required fields and click 'Save Inputs' to create a new version.</p>
                </div>
                 <div>
                    <h3 className="font-semibold">How do I run a calculation?</h3>
                    <p className="text-gray-600 dark:text-gray-400">Once you have saved inputs, go to the 'Calculations' tab and click the 'Run New Calculation' button. The results will appear below.</p>
                </div>
                 <div>
                    <h3 className="font-semibold">How do I generate a PDF quote?</h3>
                    <p className="text-gray-600 dark:text-gray-400">From the 'Quotes' tab, create a new quote from the latest calculation. Once you are done editing, click 'Generate PDF'.</p>
                </div>
            </CardContent>
             <CardHeader className="border-t dark:border-gray-700 mt-6">
                <h3 className="font-semibold">Contact Us</h3>
                <p className="text-gray-600 dark:text-gray-400">Still have questions? <a href="mailto:support@solarplanner.com" className="text-primary-600 hover:underline">support@solarplanner.com</a></p>
            </CardHeader>
        </Card>
    </div>
);

// --- Notifications Page ---
export const NotificationsPage: React.FC = () => (
     <div>
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <Card>
            <CardContent>
                <div className="text-center py-12 text-gray-500">
                    <p>No new notifications.</p>
                </div>
            </CardContent>
        </Card>
    </div>
);


// --- Not Found Page ---
export const NotFoundPage: React.FC = () => (
    <div className="text-center py-20">
        <h1 className="text-4xl font-bold">404 - Not Found</h1>
        <p className="text-gray-500 mt-4">The page you are looking for does not exist.</p>
    </div>
);
