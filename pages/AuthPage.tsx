import React, { useState, FormEvent } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AppContext';
import { Button, Input, Card, CardContent, CardHeader } from '../components/ui';
import { SunIcon } from '../components/ui';
import { PaymentInfo } from '../types';

const AuthPage: React.FC = () => {
    const location = useLocation();
    const isLogin = location.pathname === '/login';

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <SunIcon className="h-12 w-12 text-primary-600" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-primary)]">
                    {isLogin ? 'Sign in to your account' : 'Create a new account'}
                </h2>
                <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
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
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'mobile_money'>('visa');
    const [cardNumber, setCardNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const payment: PaymentInfo = {
                method: paymentMethod,
                card_number: paymentMethod === 'visa' ? cardNumber : null,
                phone_number: paymentMethod === 'mobile_money' ? phoneNumber : null,
            };

            if (payment.method === 'visa' && !payment.card_number) {
                throw new Error("Card number is required for Visa payment.");
            }
            if (payment.method === 'mobile_money' && !payment.phone_number) {
                 throw new Error("Phone number is required for Mobile Money payment.");
            }

            await register({ name, email, password, payment });
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
            
            <fieldset>
                <legend className="block text-sm font-medium text-[var(--color-text-secondary)]">Payment Method</legend>
                <div className="mt-2 grid grid-cols-2 gap-3">
                    <label className={`relative block cursor-pointer rounded-lg border bg-[var(--color-card-bg)] p-4 focus:outline-none ring-offset-2 ring-offset-[var(--color-bg-secondary)] ${paymentMethod === 'visa' ? 'border-primary-500 ring-2 ring-primary-500' : 'border-[var(--color-border-input)]'}`}>
                        <input type="radio" name="payment-method" value="visa" className="sr-only" aria-labelledby="visa-label" checked={paymentMethod === 'visa'} onChange={() => setPaymentMethod('visa')} />
                        <span id="visa-label" className="text-sm font-medium text-[var(--color-text-primary)]">Visa</span>
                    </label>
                    <label className={`relative block cursor-pointer rounded-lg border bg-[var(--color-card-bg)] p-4 focus:outline-none ring-offset-2 ring-offset-[var(--color-bg-secondary)] ${paymentMethod === 'mobile_money' ? 'border-primary-500 ring-2 ring-primary-500' : 'border-[var(--color-border-input)]'}`}>
                        <input type="radio" name="payment-method" value="mobile_money" className="sr-only" aria-labelledby="mobile-money-label" checked={paymentMethod === 'mobile_money'} onChange={() => setPaymentMethod('mobile_money')} />
                        <span id="mobile-money-label" className="text-sm font-medium text-[var(--color-text-primary)]">Mobile Money</span>
                    </label>
                </div>
            </fieldset>

            {paymentMethod === 'visa' && (
                <Input id="card-number" label="Card Number" type="text" placeholder="•••• •••• •••• ••••" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required />
            )}
            {paymentMethod === 'mobile_money' && (
                <Input id="phone-number" label="Phone Number" type="tel" placeholder="+1234567890" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
            )}

            <div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Create account
                </Button>
            </div>
        </form>
    );
};

export default AuthPage;