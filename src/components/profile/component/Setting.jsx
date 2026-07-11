import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiLock, FiAlertTriangle, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import PageLoader from '@/components/common/PageLoader';
import { cookieKeys } from '@/services/cookies';
import routesConstants from '@/routes/routesConstants';
import { logout } from '@/components/auth/slice/loginSlice';
import {
  changePassword,
  deleteAccount,
  getSettings,
  updateNotifications,
} from '../slice/settingsSlice';

const notificationOptions = [
  { key: 'email', label: 'Email notifications' },
  { key: 'sms', label: 'SMS notifications' },
  { key: 'promotional', label: 'Promotional emails' },
  { key: 'orderUpdates', label: 'Order updates' },
];

const Setting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    notifications,
    settingsLoading,
    notificationsUpdating,
    passwordUpdating,
    accountDeleting,
  } = useSelector((state) => state.settings);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  const handleToggleNotification = (key) => {
    const nextNotifications = {
      ...notifications,
      [key]: !notifications[key],
    };

    dispatch(updateNotifications(nextNotifications)).then((res) => {
      if (res?.payload?.data?.success || res?.payload?.status === 200) {
        toast.success('Notification preferences updated');
      }
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error('Please fill all password fields');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    dispatch(changePassword(passwordForm)).then((res) => {
      if (res?.payload?.data?.success || res?.payload?.status === 200) {
        toast.success(res?.payload?.data?.message || 'Password changed successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordModal(false);
      }
    });
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();

    if (!deletePassword) {
      toast.error('Please enter your password to confirm');
      return;
    }

    dispatch(deleteAccount({ password: deletePassword })).then((res) => {
      if (res?.payload?.data?.success || res?.payload?.status === 200) {
        toast.success(res?.payload?.data?.message || 'Account deleted successfully');
        dispatch(logout());
        Cookies.remove(cookieKeys?.TOKEN);
        Cookies.remove(cookieKeys?.REFRESH_TOKEN);
        Cookies.remove(cookieKeys?.USER);
        setShowDeleteModal(false);
        navigate(routesConstants.LOGIN);
      }
    });
  };

  if (settingsLoading) {
    return <PageLoader loadingState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div className="mb-2 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
          Preferences
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-slate-900">
          Account Settings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Control notifications, security, and account options.
        </p>
      </div>

      <section className="border border-slate-100 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(2,137,222,0.35)]">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center bg-[#0289de]/10 text-[#0289de]">
            <FiBell className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Notification Preferences
            </h3>
            {notificationsUpdating && (
              <p className="text-xs text-[#0289de]">Saving...</p>
            )}
          </div>
        </div>
        <div className="space-y-3">
          {notificationOptions.map((pref) => (
            <label
              key={pref.key}
              className="flex cursor-pointer items-center justify-between border border-slate-100 px-4 py-3 transition hover:border-sky-100"
            >
              <span className="text-sm text-slate-700">{pref.label}</span>
              <input
                type="checkbox"
                checked={!!notifications[pref.key]}
                onChange={() => handleToggleNotification(pref.key)}
                disabled={notificationsUpdating}
                className="h-4 w-4 accent-[#0289de]"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="border border-slate-100 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(2,137,222,0.35)]">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center bg-[#0289de]/10 text-[#0289de]">
            <FiLock className="h-4 w-4" />
          </span>
          <h3 className="font-display text-lg font-bold text-slate-900">Security</h3>
        </div>
        <p className="mb-4 text-sm text-slate-500">
          Keep your SwiftCart account protected with a strong password.
        </p>
        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="bg-[#0289de] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0169ab]"
        >
          Change Password
        </button>
      </section>

      <section className="border border-rose-100 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center bg-rose-50 text-rose-600">
            <FiAlertTriangle className="h-4 w-4" />
          </span>
          <h3 className="font-display text-lg font-bold text-rose-700">Danger Zone</h3>
        </div>
        <p className="mb-4 text-sm text-slate-500">
          Permanently remove your account and associated data. This cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          Delete Account
        </button>
      </section>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md border border-slate-100 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Change Password
              </h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current password"
                className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0289de]"
              />
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="New password"
                className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0289de]"
              />
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0289de]"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={passwordUpdating}
                  className="flex-1 bg-[#0289de] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0169ab] disabled:bg-slate-400"
                >
                  {passwordUpdating ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md border border-rose-100 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-rose-700">
                Delete Account
              </h3>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-4 text-sm text-slate-500">
              This will permanently delete your account, cart, wishlist, and orders.
              Enter your password to confirm.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-3">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-400"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={accountDeleting}
                  className="flex-1 bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:bg-slate-400"
                >
                  {accountDeleting ? 'Deleting...' : 'Delete Forever'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeletePassword('');
                    setShowDeleteModal(false);
                  }}
                  className="border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Setting;
