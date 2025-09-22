
import React, { useState, FormEvent } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AppContext';
import { Button, Input, Card, CardContent, CardHeader } from '../components/ui';
import { SunIcon } from '../components/ui';

const AuthPage: React.FC = () => {
    const location = useLocation();
    const isLogin = location.pathname === '/login';

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <SunIcon className="h-12 w-12 text-primary-600" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    {isLogin ? 'Sign in to your account' : 'Create a new account'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Or{' '}
                    {isLogin ? (
                        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                            create a new account
                        </Link>
                    ) : (
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            sign in to your existing account
                        </Link>
                    )}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card>
                    <CardContent className="py-8 px-4 sm:px-10">
                        {isLogin ? <LoginForm /> : <RegisterForm />}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await login({ email, password });
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Input id="email" label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

            <div className="flex items-center justify-between">
                <div className="text-sm">
                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                        Forgot your password?
                    </a>
                </div>
            </div>

            <div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Sign in
                </Button>
            </div>
        </form>
    );
};

const RegisterForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await register({ name, email, password });
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to register.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Input id="name" label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} required />
            <Input id="email" label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            
            <div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Create account
                </Button>
            </div>
        </form>
    );
};

export default AuthPage;
