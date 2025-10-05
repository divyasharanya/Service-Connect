import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { forgotPassword } from '../../utils/api';
import { showSuccess, showError } from '../../features/notifications/notificationsSlice';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { email: '' } });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async ({ email }) => {
    try {
      await forgotPassword(email);
      dispatch(showSuccess('If an account exists, a reset link has been sent.'));
      navigate('/user-login');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to process request';
      dispatch(showError(msg));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="customer" isAuthenticated={false} onLogout={() => navigate('/user-login')} />
      <main className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' } })}
            error={errors.email?.message}
            placeholder="you@example.com"
            disabled={isSubmitting}
          />
          <Button type="submit" variant="default" fullWidth loading={isSubmitting}>Send Reset Link</Button>
          <Button type="button" variant="outline" fullWidth onClick={() => navigate('/user-login')}>Back to Login</Button>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
