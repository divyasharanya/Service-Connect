import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { resetPassword } from '../../utils/api';
import { showSuccess, showError } from '../../features/notifications/notificationsSlice';

const ResetPassword = () => {
  const { token } = useParams();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ defaultValues: { password: '', confirm: '' } });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async ({ password }) => {
    try {
      await resetPassword({ token, password });
      dispatch(showSuccess('Password reset successful. You can now log in.'));
      navigate('/user-login');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to reset password';
      dispatch(showError(msg));
    }
  };

  const password = watch('password');

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="customer" isAuthenticated={false} onLogout={() => navigate('/user-login')} />
      <main className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
            error={errors.password?.message}
            placeholder="Enter new password"
            disabled={isSubmitting}
          />
          <Input
            label="Confirm Password"
            type="password"
            {...register('confirm', { required: 'Confirm your password', validate: (val) => val === password || 'Passwords do not match' })}
            error={errors.confirm?.message}
            placeholder="Re-enter new password"
            disabled={isSubmitting}
          />
          <Button type="submit" variant="default" fullWidth loading={isSubmitting}>Reset Password</Button>
          <Button type="button" variant="outline" fullWidth onClick={() => navigate('/user-login')}>Back to Login</Button>
        </form>
      </main>
    </div>
  );
};

export default ResetPassword;
