import { getUserProfile, updateUserProfile } from '@/components/auth/slice/loginSlice';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PageLoader from '@/components/common/PageLoader';
import { FiCamera, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80';

const profileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[+]?[0-9\s\-()]{10,}$/, 'Please enter a valid phone number'),
  address: Yup.object().shape({
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    zipCode: Yup.string().required('Zip code is required'),
  }),
});

const fieldClass = (hasError) =>
  `w-full border bg-slate-50/50 px-3 py-2.5 text-sm outline-none transition focus:border-[#0289de] focus:bg-white ${
    hasError ? 'border-rose-400' : 'border-slate-200'
  }`;

const AddressTypeTabs = ({ addressType, setAddressType }) => (
  <div className="mb-3 flex flex-wrap gap-2">
    {['home', 'work', 'other'].map((type) => (
      <button
        key={type}
        type="button"
        onClick={() => setAddressType(type)}
        className={`px-3 py-1.5 text-xs font-semibold capitalize transition ${
          addressType === type
            ? 'bg-[#0289de] text-white'
            : 'border border-slate-200 text-slate-600 hover:border-[#0289de]/40'
        }`}
      >
        {type}
      </button>
    ))}
  </div>
);



const AvatarBlock = ({ src, onClick, memberSince, showCamera = true }) => (
  <div className="flex shrink-0 flex-col items-center">
    <div className="relative">
      <div className="h-28 w-28 overflow-hidden border-4 border-white bg-slate-100 shadow-[0_16px_40px_-20px_rgba(2,137,222,0.55)] sm:h-32 sm:w-32">
        <img src={src} alt="Profile" className="h-full w-full object-cover" />
      </div>
      {showCamera && (
        <button
          type="button"
          onClick={onClick}
          className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center bg-[#0289de] text-white transition hover:bg-[#0169ab]"
          aria-label="Change avatar"
        >
          <FiCamera className="h-4 w-4" />
        </button>
      )}
    </div>
    <p className="mt-3 text-center text-xs text-slate-500">
      Member since {memberSince}
    </p>
  </div>
);

const ViewProfile = ({
  userProfile,
  setIsEditing,
  handleAvatarClick,
  addressType,
  setAddressType,
  avatarPreview,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const getCurrentAddress = () => {
    if (!userProfile?.address?.length) return 'No address found';
    const currentAddress = userProfile.address.find((add) => add?.type === addressType);
    if (!currentAddress) return 'No address found for this type';
    return `${currentAddress.street}, ${currentAddress.city}, ${currentAddress.state}, ${currentAddress.country}, ${currentAddress.zipCode}`;
  };

  const fullName = `${userProfile?.profile?.firstName || ''} ${userProfile?.profile?.lastName || ''}`.trim();

  return (
    <div className="flex w-full flex-col gap-8 md:flex-row md:items-start">
      <AvatarBlock
        src={avatarPreview || userProfile?.profile?.avatar || DEFAULT_AVATAR}
        onClick={handleAvatarClick}
        memberSince={formatDate(userProfile?.createdAt)}
      />

      <div className="min-w-0 flex-1">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            {fullName || 'Your profile'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Personal details used for checkout and delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border border-slate-100 bg-slate-50/60 p-4">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <FiMail className="h-3.5 w-3.5" /> Email
            </p>
            <p className="truncate text-sm font-medium text-slate-900">
              {userProfile?.email || '—'}
            </p>
          </div>
          <div className="border border-slate-100 bg-slate-50/60 p-4">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <FiPhone className="h-3.5 w-3.5" /> Phone
            </p>
            <p className="text-sm font-medium text-slate-900">
              {userProfile?.profile?.phone || 'Not provided'}
            </p>
          </div>
          <div className="border border-slate-100 bg-slate-50/60 p-4 sm:col-span-2">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <FiMapPin className="h-3.5 w-3.5" /> Address
            </p>
            <AddressTypeTabs addressType={addressType} setAddressType={setAddressType} />
            <p className="text-sm leading-relaxed text-slate-800">{getCurrentAddress()}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="mt-6 bg-[#0289de] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0169ab]"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

const EditProfile = ({
  userProfile,
  setIsEditing,
  initialValues,
  addressType,
  handleAvatarClick,
  avatarFile,
  setAvatarFile,
  avatarPreview,
  setAvatarPreview,
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);

    try {
      const existingAddresses = userProfile?.addresses || userProfile?.address || [];
      const addressIndex = existingAddresses.findIndex((addr) => addr.type === addressType);

      const updatedAddress = {
        type: addressType || 'home',
        street: values.address.street,
        city: values.address.city,
        state: values.address.state,
        zipCode: values.address.zipCode,
        country: values.address.country,
        isDefault: true,
      };

      let newAddresses;
      if (addressIndex >= 0) {
        newAddresses = [...existingAddresses];
        newAddresses[addressIndex] = updatedAddress;
      } else {
        newAddresses = [...existingAddresses, updatedAddress];
      }

      const formData = new FormData();
      const profileData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
      };

      formData.append('profile', JSON.stringify(profileData));
      formData.append('addresses', JSON.stringify(newAddresses));
      formData.append('username', userProfile?.username || '');
      formData.append('email', userProfile?.email || '');

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      if (userProfile?.wishlist) {
        formData.append('wishlist', JSON.stringify(userProfile.wishlist));
      }

      await dispatch(updateUserProfile(formData)).unwrap();

      setAvatarFile(null);
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }

      dispatch(getUserProfile());
      setIsEditing(false);
      resetForm();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={profileSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting: formikSubmitting, errors, touched }) => (
        <Form className="w-full">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <AvatarBlock
              src={avatarPreview || userProfile?.profile?.avatar || DEFAULT_AVATAR}
              onClick={handleAvatarClick}
              memberSince={
                userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'
              }
            />

            <div className="min-w-0 flex-1 space-y-4">
              <div className="mb-2">
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Edit profile
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Updating address type:{' '}
                  <span className="font-semibold capitalize text-[#0289de]">
                    {addressType}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    First Name
                  </label>
                  <Field
                    type="text"
                    name="firstName"
                    className={fieldClass(errors.firstName && touched.firstName)}
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="mt-1 text-xs text-rose-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Last Name
                  </label>
                  <Field
                    type="text"
                    name="lastName"
                    className={fieldClass(errors.lastName && touched.lastName)}
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="mt-1 text-xs text-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userProfile?.email || ''}
                    disabled
                    className="w-full cursor-not-allowed border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500"
                  />
                  <p className="mt-1 text-xs text-slate-400">Email cannot be changed</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </label>
                  <Field
                    type="tel"
                    name="phone"
                    className={fieldClass(errors.phone && touched.phone)}
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="mt-1 text-xs text-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Street
                  </label>
                  <Field
                    type="text"
                    name="address.street"
                    className={fieldClass(
                      errors.address?.street && touched.address?.street
                    )}
                  />
                  <ErrorMessage
                    name="address.street"
                    component="div"
                    className="mt-1 text-xs text-rose-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    City
                  </label>
                  <Field
                    type="text"
                    name="address.city"
                    className={fieldClass(errors.address?.city && touched.address?.city)}
                  />
                  <ErrorMessage
                    name="address.city"
                    component="div"
                    className="mt-1 text-xs text-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    State
                  </label>
                  <Field
                    type="text"
                    name="address.state"
                    className={fieldClass(
                      errors.address?.state && touched.address?.state
                    )}
                  />
                  <ErrorMessage
                    name="address.state"
                    component="div"
                    className="mt-1 text-xs text-rose-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Country
                  </label>
                  <Field
                    type="text"
                    name="address.country"
                    className={fieldClass(
                      errors.address?.country && touched.address?.country
                    )}
                  />
                  <ErrorMessage
                    name="address.country"
                    component="div"
                    className="mt-1 text-xs text-rose-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Zip Code
                  </label>
                  <Field
                    type="text"
                    name="address.zipCode"
                    className={fieldClass(
                      errors.address?.zipCode && touched.address?.zipCode
                    )}
                  />
                  <ErrorMessage
                    name="address.zipCode"
                    component="div"
                    className="mt-1 text-xs text-rose-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || formikSubmitting}
                  className="bg-[#0289de] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0169ab] disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (avatarPreview) {
                      URL.revokeObjectURL(avatarPreview);
                      setAvatarPreview(null);
                    }
                    setAvatarFile(null);
                    setIsEditing(false);
                  }}
                  className="border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [addressType, setAddressType] = useState('home');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const { userProfile, userProfileLoading, userProfileFetched } = useSelector(
    (state) => ({
      userProfile: state.login.userProfile,
      userProfileLoading: state.login.userProfileLoading,
      userProfileFetched: state.login.userProfileFetched,
    })
  );

  useEffect(() => {
    if (!userProfileFetched) {
      dispatch(getUserProfile());
    }
  }, [dispatch, userProfileFetched]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      setAvatarFile(file);
    }
  };

  const getInitialValues = () => {
    if (!userProfile) {
      return {
        firstName: '',
        lastName: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
        },
      };
    }

    const currentAddress =
      userProfile.address?.find((add) => add?.type === addressType) || {};

    return {
      firstName: userProfile?.profile?.firstName || '',
      lastName: userProfile?.profile?.lastName || '',
      phone: userProfile?.profile?.phone || '',
      address: {
        street: currentAddress?.street || '',
        city: currentAddress?.city || '',
        state: currentAddress?.state || '',
        country: currentAddress?.country || '',
        zipCode: currentAddress?.zipCode || '',
      },
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="border border-slate-100 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(2,137,222,0.35)] sm:p-8"
    >
      {userProfileLoading && <PageLoader />}

      {!isEditing ? (
        <ViewProfile
          userProfile={userProfile}
          setIsEditing={setIsEditing}
          handleAvatarClick={handleAvatarClick}
          addressType={addressType}
          setAddressType={setAddressType}
          avatarPreview={avatarPreview}
        />
      ) : (
        <EditProfile
          userProfile={userProfile}
          setIsEditing={setIsEditing}
          initialValues={getInitialValues()}
          addressType={addressType}
          handleAvatarClick={handleAvatarClick}
          avatarFile={avatarFile}
          setAvatarFile={setAvatarFile}
          avatarPreview={avatarPreview}
          setAvatarPreview={setAvatarPreview}
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </motion.div>
  );
};

export default Profile;
