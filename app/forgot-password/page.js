'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import GlobalApi from '../_services/GlobalApi';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LoaderIcon } from 'lucide-react';
import AnimatedSpin from '../_components/AnimatedSpin';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleEmailSubmit = async (data) => {
    setEmail(data.email);
    setLoading(true);
    GlobalApi.GenerateOTP({ email: data.email })
      .then(() => {
        setStep(2);
      })
      .catch(() => {
        // toast.error("User Not Found.")
        alert('User Not Found.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOtpSubmit = async (data) => {
    setOtp(data.otp);
    setLoading(true);
    GlobalApi.ValidateOTP({ email, otp: data.otp })
      .then(() => {
        setStep(3);
      })
      .catch(() => {
        toast.error('Invalid/Expired OTP.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePasswordSubmit = async (data) => {
    console.log('New Password:', data.password);
    setLoading(true);
    GlobalApi.ResetPasswordWithOTP({ email, otp, password: data.password })
      .then(() => {
        toast.error('Password successfully updated!');
        router.push('/');
      })
      .catch(() => {
        toast.error('Invalid/Expired OTP.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md p-4 md:p-8 space-y-4 md:space-y-6 bg-white shadow-lg rounded-xl">
        <h2
          className="text-xl md:text-2xl font-bold text-center"
          style={{ color: 'black' }}
        >
          Forgot Password
        </h2>

        {step === 1 && (
          <form
            onSubmit={handleSubmit(handleEmailSubmit)}
            className="space-y-3 md:space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                disabled={loading}
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-3 py-2 text-sm md:text-base border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white py-2 text-sm md:text-base rounded-md hover:bg-blue-700"
            >
              <AnimatedSpin loading={loading}>Send OTP</AnimatedSpin>
            </Button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleSubmit(handleOtpSubmit)}
            className="space-y-3 md:space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Enter OTP
              </label>
              <Input
                disabled={loading}
                type="text"
                {...register('otp', { required: 'OTP is required' })}
                className="w-full px-3 py-2 text-sm md:text-base border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.otp && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.otp.message}
                </p>
              )}
            </div>
            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white py-2 text-sm md:text-base rounded-md hover:bg-blue-700"
            >
              <AnimatedSpin loading={loading}>Verify OTP</AnimatedSpin>
            </Button>
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={handleSubmit(handlePasswordSubmit)}
            className="space-y-3 md:space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Input
                disabled={loading}
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full px-3 py-2 text-sm md:text-base border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <Input
                disabled={loading}
                type="password"
                {...register('confirmPassword', {
                  required: 'Confirm Password is required',
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match',
                })}
                className="w-full px-3 py-2 text-sm md:text-base border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-green-600 text-white py-2 text-sm md:text-base rounded-md hover:bg-green-700"
            >
              <AnimatedSpin loading={loading}>Submit</AnimatedSpin>
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
