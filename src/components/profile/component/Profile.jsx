// import { getUserProfile } from '@/components/auth/slice/loginSlice';
// import { motion } from 'framer-motion';
// import {useState,useRef, useEffect} from 'react'
// import { useDispatch, useSelector } from 'react-redux';


// const Profile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//    const fileInputRef = useRef(null);
//    const dispatch = useDispatch();
//     // Sample user data
//   const [userData, setUserData] = useState({
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     phone: '+1 (555) 123-4567',
//     address: '123 Main Street, New York, NY 10001',
//     joinDate: 'January 2023',
//     avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80'
//   });

//   const [addressType,setAddressType]= useState("home");

//    const { userProfile, userProfileLoading, userProfileFetched  } = useSelector(state => ({
//     userProfile: state.login.userProfile,
//     userProfileLoading: state.login.userProfileLoading,
//     userProfileFetched : state.login.userProfileFetched 
//     }));

// //     useEffect(() => {
// //   if (!userProfileFetched) {
// //     dispatch(getUserProfile());
// //   }
// // }, [dispatch, userProfileFetched]);
//     // console.log("profile:-",userProfile)

//   const handleSave = () => {
//     setIsEditing(false);
//     // In a real app, you would save the data to your backend here
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAvatarClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Create a URL for the selected image
//       const imageUrl = URL.createObjectURL(file);
//       setUserData(prev => ({ ...prev, avatar: imageUrl }));
      
//       // In a real app, you would upload the file to your server here
//       console.log('File selected:', file.name);
//     }
//   };

//   return (
//     <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//               className="bg-white rounded-lg shadow-md p-6"
//             >
//               <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
//                 {/* Avatar Section */}
//                 <div className="flex-shrink-0">
//                   <div className="relative">
//                     <img
//                       src={userProfile?.profile?.avatar}
//                       alt="Profile"
//                       className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
//                     />
//                     <button 
//                     onClick={handleAvatarClick}
//                     className="absolute bottom-0 right-[3.8rem] bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
//                       </svg>
//                     </button>
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       onChange={handleFileChange}
//                       accept="image/*"
//                       className="hidden"
//                     />
//                   </div>
//                   <p className="text-sm text-gray-500 mt-2 text-center">Member since {
//                     new Intl.DateTimeFormat('en-US', {
//                       month: 'long',
//                       year: 'numeric'
//                     }).format(new Date(userProfile.createdAt))
//                   }</p>
//                 </div>
    
//                 {/* Profile Form */}
//                 <div className="flex-grow space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           name="name"
//                           value={userData.name}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       ) : (
//                         <p className="text-gray-900">{userProfile.profile.firstName} {userProfile.profile.lastName}</p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                       {isEditing ? (
//                         <input
//                           type="email"
//                           name="email"
//                           value={userData.email}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           disabled
//                         />
//                       ) : (
//                         <p className="text-gray-900">{userProfile.email}</p>
//                       )}
//                     </div>
//                   </div>
    
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                       {isEditing ? (
//                         <input
//                           type="tel"
//                           name="phone"
//                           value={userData.phone}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       ) : (
//                         <p className="text-gray-900">{userProfile.profile.phone}</p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                       {isEditing ? (
//                         <textarea
//                           name="address"
//                           value={userData.address}
//                           onChange={handleInputChange}
//                           rows={2}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       ) : (
//                         <>
//                         <div className='flex gap-3 mb-3'>
//                           <p className={`${addressType === 'home' ? 'bg-[#f83838] hover:bg-[#fd0000]' : 'bg-[#0289de] hover:bg-[#007ac7]'} text-white p-1 rounded-md cursor-pointer `} onClick={()=> setAddressType("home")}>Home</p>
//                           <p className={`${addressType === 'work' ? 'bg-[#f83838] hover:bg-[#fd0000]' : 'bg-[#0289de] hover:bg-[#007ac7]'} text-white p-1 rounded-md cursor-pointer `} onClick={()=> setAddressType("work")}>Work</p>
//                           <p className={`${addressType === 'other' ? 'bg-[#f83838] hover:bg-[#fd0000]' : 'bg-[#0289de] hover:bg-[#007ac7]'} text-white p-1 rounded-md cursor-pointer `} onClick={()=> setAddressType("other")}>Other</p>
//                         </div>
//                         <p className="text-gray-900">
//                           {userProfile.address?.map((add, index) => (
//                             <div key={index}>
//                               {add?.type === 'home' && addressType === 'home' ? (
//                                 <>
//                                   <span>{add?.street}, </span>
//                                   <span>{add?.city}, </span>
//                                   <span>{add?.state}, </span>
//                                   <span>{add?.country}, </span>
//                                   <span>{add?.zipCode}</span>
//                                 </>
//                               ) : add?.type === 'work' && addressType === 'work' ? (
//                                 <>
//                                   <span>{add?.street}, </span>
//                                   <span>{add?.city}, </span>
//                                   <span>{add?.state}, </span>
//                                   <span>{add?.country}, </span>
//                                   <span>{add?.zipCode}</span>
//                                 </>
//                               ) : add?.type === 'other' && addressType === 'other' ? (
//                                 <>
//                                   <span>{add?.street}, </span>
//                                   <span>{add?.city}, </span>
//                                   <span>{add?.state}, </span>
//                                   <span>{add?.country}, </span>
//                                   <span>{add?.zipCode}</span>
//                                 </>
//                               ) : 'No Address'}
//                             </div>
//                           ))}
//                         </p>
//                         </>
//                       )}
//                     </div>
//                   </div>
    
//                   <div className="flex space-x-4 pt-4">
//                     {isEditing ? (
//                       <>
//                         <button
//                           onClick={handleSave}
//                           className=" bg-[#0289de] hover:bg-[#007ac7] text-white px-6 py-2 rounded-md  transition-colors cursor-pointer"
//                         >
//                           Save Changes
//                         </button>
//                         <button
//                           onClick={() => setIsEditing(false)}
//                           className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
//                         >
//                           Cancel
//                         </button>
//                       </>
//                     ) : (
//                       <button
//                         onClick={() => setIsEditing(true)}
//                         className="bg-[#0289de] hover:bg-[#007ac7] text-white px-6 py-2 rounded-md  transition-colors cursor-pointer"
//                       >
//                         Edit Profile
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//   )
// }

// export default Profile


import { getUserProfile, updateUserProfile } from '@/components/auth/slice/loginSlice';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PageLoader from '@/components/common/PageLoader';

// Yup validation schema
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
    zipCode: Yup.string().required('Zip code is required')
  })
});

// // View Profile Component
// const ViewProfile = ({ userProfile, setIsEditing, handleAvatarClick, fileInputRef, addressType, setAddressType }) => {
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Unknown date';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   const getCurrentAddress = () => {
//     if (!userProfile?.address?.length) return 'No address found';
    
//     const currentAddress = userProfile.address.find(add => add?.type === addressType);
    
//     if (!currentAddress) {
//       return 'No address found for this type';
//     }
    
//     return (
//       <>
//         <span>{currentAddress?.street}, </span>
//         <span>{currentAddress?.city}, </span>
//         <span>{currentAddress?.state}, </span>
//         <span>{currentAddress?.country}, </span>
//         <span>{currentAddress?.zipCode}</span>
//       </>
//     );
//   };

//   return (
//     <>
//       {/* Avatar Section */}
//       <div className="flex-shrink-0">
//         <div className="relative">
//           <img
//             src={userProfile?.profile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80'}
//             alt="Profile"
//             className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
//           />
//           <button 
//             onClick={handleAvatarClick}
//             className="absolute bottom-0 right-[3.8rem] bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
//             </svg>
//           </button>
//           <input
//             type="file"
//             ref={fileInputRef}
//             accept="image/*"
//             className="hidden"
//           />
//         </div>
//         <p className="text-sm text-gray-500 mt-2 text-center">
//           Member since {formatDate(userProfile?.createdAt)}
//         </p>
//       </div>

//       {/* Profile Info */}
//       <div className="flex-grow space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//             <p className="text-gray-900">
//               {userProfile?.profile?.firstName} {userProfile?.profile?.lastName}
//             </p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <p className="text-gray-900">{userProfile?.email}</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//             <p className="text-gray-900">{userProfile?.profile?.phone || 'Not provided'}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//             <div className='flex gap-3 mb-3'>
//               <p 
//                 className={`${addressType === 'home' ? 'bg-[#f83838] hover:bg-[#fd0000]' : 'bg-[#0289de] hover:bg-[#007ac7]'} text-white p-1 rounded-md cursor-pointer`} 
//                 onClick={() => setAddressType("home")}
//               >
//                 Home
//               </p>
//               <p 
//                 className={`${addressType === 'work' ? 'bg-[#f83838] hover:bg-[#fd0000]' : 'bg-[#0289de] hover:bg-[#007ac7]'} text-white p-1 rounded-md cursor-pointer`} 
//                 onClick={() => setAddressType("work")}
//               >
//                 Work
//               </p>
//               <p 
//                 className={`${addressType === 'other' ? 'bg-[#f83838] hover:bg-[#fd0000]' : 'bg-[#0289de] hover:bg-[#007ac7]'} text-white p-1 rounded-md cursor-pointer`} 
//                 onClick={() => setAddressType("other")}
//               >
//                 Other
//               </p>
//             </div>
//             <p className="text-gray-900">
//               {getCurrentAddress()}
//             </p>
//           </div>
//         </div>

//         <div className="flex space-x-4 pt-4">
//           <button
//             onClick={() => setIsEditing(true)}
//             className="bg-[#0289de] hover:bg-[#007ac7] text-white px-6 py-2 rounded-md transition-colors cursor-pointer"
//           >
//             Edit Profile
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// // Edit Profile Component with Formik
// const EditProfile = ({ userProfile, setIsEditing, initialValues, addressType, handleAvatarClick, fileInputRef }) => {
//   const dispatch = useDispatch();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(null);

// // Update handleFileChange function
// const handleFileChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     // Create preview URL
//     const imageUrl = URL.createObjectURL(file);
//     setAvatarPreview(imageUrl);
//     setAvatarFile(file);
    
//     console.log('File selected:', file.name);
//     // Note: We're not updating the profile immediately, just storing the file
//   }
// };

// // const handleSubmit = async (values, { setSubmitting, resetForm }) => {
// //   setIsSubmitting(true);
  
// //   try {
// //     // Get all existing addresses
// //     const existingAddresses = userProfile?.addresses || userProfile?.address || [];
    
// //     // Find if there's already an address of the current type
// //     const addressIndex = existingAddresses.findIndex(addr => addr.type === addressType);
    
// //     // Prepare the updated address
// //     const updatedAddress = {
// //       type: addressType || 'home',
// //       street: values.address.street,
// //       city: values.address.city,
// //       state: values.address.state,
// //       zipCode: values.address.zipCode,
// //       country: values.address.country,
// //       isDefault: true
// //     };
    
// //     // Create new addresses array
// //     let newAddresses;
// //     if (addressIndex >= 0) {
// //       // Update existing address of this type
// //       newAddresses = [...existingAddresses];
// //       newAddresses[addressIndex] = updatedAddress;
// //     } else {
// //       // Add new address
// //       newAddresses = [...existingAddresses, updatedAddress];
// //     }
    
// //     // Prepare payload according to your API structure
// //     const payload = {
// //       username: userProfile?.username || values.firstName?.toLowerCase(),
// //       email: userProfile?.email, // Email should not be changed
// //       profile: {
// //         firstName: values.firstName,
// //         lastName: values.lastName,
// //         avatar: userProfile?.profile?.avatar || 'https://example.com/avatar.jpg',
// //         phone: values.phone
// //       },
// //       addresses: newAddresses, // Send all addresses, not just one
// //       wishlist: userProfile?.wishlist || []
// //     };

// //     console.log('Updating profile with addresses:', newAddresses);
    
// //     // Dispatch the update action
// //     await dispatch(updateUserProfile(payload)).unwrap();
    
// //     // Refresh user profile data
// //     dispatch(getUserProfile());
    
// //     // Exit edit mode
// //     setIsEditing(false);
// //     resetForm();
    
// //   } catch (error) {
// //     console.error('Failed to update profile:', error);
// //     alert('Failed to update profile. Please try again.');
// //   } finally {
// //     setIsSubmitting(false);
// //     setSubmitting(false);
// //   }
// // };

// const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//   setIsSubmitting(true);
  
//   try {
//     // Get all existing addresses
//     const existingAddresses = userProfile?.addresses || userProfile?.address || [];
    
//     // Find if there's already an address of the current type
//     const addressIndex = existingAddresses.findIndex(addr => addr.type === addressType);
    
//     // Prepare the updated address
//     const updatedAddress = {
//       type: addressType || 'home',
//       street: values.address.street,
//       city: values.address.city,
//       state: values.address.state,
//       zipCode: values.address.zipCode,
//       country: values.address.country,
//       isDefault: true
//     };
    
//     // Create new addresses array
//     let newAddresses;
//     if (addressIndex >= 0) {
//       // Update existing address of this type
//       newAddresses = [...existingAddresses];
//       newAddresses[addressIndex] = updatedAddress;
//     } else {
//       // Add new address
//       newAddresses = [...existingAddresses, updatedAddress];
//     }
    
//     // Create FormData to handle file upload
//     const formData = new FormData();
    
//     // Append profile data as JSON string
//     const profileData = {
//       firstName: values.firstName,
//       lastName: values.lastName,
//       phone: values.phone,
//       // Note: avatar will be handled by the file upload
//     };
    
//     formData.append('profile', JSON.stringify(profileData));
//     formData.append('addresses', JSON.stringify(newAddresses));
    
//     // If there's a new avatar file, append it
//     if (avatarFile) {
//       formData.append('avatar', avatarFile);
//     }
    
//     // Append wishlist if exists
//     if (userProfile?.wishlist) {
//       formData.append('wishlist', JSON.stringify(userProfile.wishlist));
//     }
    
//     console.log('Updating profile with FormData...');
    
//     // Dispatch the update action with FormData
//     await dispatch(updateUserProfile(formData)).unwrap();
    
//     // Clear avatar state after successful upload
//     setAvatarFile(null);
//     if (avatarPreview) {
//       URL.revokeObjectURL(avatarPreview);
//       setAvatarPreview(null);
//     }
    
//     // Refresh user profile data
//     dispatch(getUserProfile());
    
//     // Exit edit mode
//     setIsEditing(false);
//     resetForm();
    
//   } catch (error) {
//     console.error('Failed to update profile:', error);
//     alert('Failed to update profile. Please try again.');
//   } finally {
//     setIsSubmitting(false);
//     setSubmitting(false);
//   }
// };


//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={profileSchema}
//       onSubmit={handleSubmit}
//       enableReinitialize
//     >
//       {({ isSubmitting: formikSubmitting, errors, touched }) => (
//         <Form className="w-full">
//           <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
//             {/* Avatar Section (Read-only in edit mode) */}
//             {/* <div className="flex-shrink-0">
//               <div className="relative">
//                 <img
//                   src={userProfile?.profile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80'}
//                   alt="Profile"
//                   className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
//                 />
//               </div>

//               <p className="text-sm text-gray-500 mt-2 text-center">
//                 Member since {new Date(userProfile?.createdAt).toLocaleDateString('en-US', {
//                   month: 'long',
//                   year: 'numeric'
//                 })}
//               </p>
//             </div> */}
//             <div className="flex-shrink-0">
//         <div className="relative">
//           <img
//             src={userProfile?.profile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80'}
//             alt="Profile"
//             className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
//           />
//           {/* Add the avatar change button in edit mode too */}
//           <button 
//             onClick={handleAvatarClick}
//             className="absolute bottom-0 right-[3.8rem] bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
//             </svg>
//           </button>
//         </div>
//         <p className="text-sm text-gray-500 mt-2 text-center">
//           Member since {new Date(userProfile?.createdAt).toLocaleDateString('en-US', {
//             month: 'long',
//             year: 'numeric'
//           })}
//         </p>
//       </div>

//             {/* Edit Form */}
//             <div className="flex-grow space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                   <Field
//                     type="text"
//                     name="firstName"
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName && touched.firstName ? 'border-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                   <Field
//                     type="text"
//                     name="lastName"
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName && touched.lastName ? 'border-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <input
//                     type="email"
//                     value={userProfile?.email || ''}
//                     disabled
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
//                   />
//                   <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                   <Field
//                     type="tel"
//                     name="phone"
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
//                   <Field
//                     type="text"
//                     name="address.street"
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.street && touched.address?.street ? 'border-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage name="address.street" component="div" className="mt-1 text-sm text-red-600" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//                   <Field
//                     type="text"
//                     name="address.city"
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.city && touched.address?.city ? 'border-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage name="address.city" component="div" className="mt-1 text-sm text-red-600" />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
//                   <Field
//                     type="text"
//                     name="address.state"
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.state && touched.address?.state ? 'border-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage name="address.state" component="div" className="mt-1 text-sm text-red-600" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//                   <Field
//                     type="text"
//                     name="address.country"
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.country && touched.address?.country ? 'border-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage name="address.country" component="div" className="mt-1 text-sm text-red-600" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
//                   <Field
//                     type="text"
//                     name="address.zipCode"
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.zipCode && touched.address?.zipCode ? 'border-red-500' : 'border-gray-300'}`}
//                   />
//                   <ErrorMessage name="address.zipCode" component="div" className="mt-1 text-sm text-red-600" />
//                 </div>
//               </div>

//               <div className="flex space-x-4 pt-4">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting || formikSubmitting}
//                   className="bg-[#0289de] hover:bg-[#007ac7] disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed"
//                 >
//                   {isSubmitting ? 'Saving...' : 'Save Changes'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setIsEditing(false)}
//                   className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// // Main Profile Component
// const Profile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [addressType, setAddressType] = useState("home");
  
//   const fileInputRef = useRef(null);
//   const dispatch = useDispatch();

//   const { userProfile, userProfileLoading, userProfileFetched } = useSelector(state => ({
//     userProfile: state.login.userProfile,
//     userProfileLoading: state.login.userProfileLoading,
//     userProfileFetched: state.login.userProfileFetched
//   }));

//   // Fetch user profile if not already fetched
//   useEffect(() => {
//     if (!userProfileFetched) {
//       dispatch(getUserProfile());
//     }
//   }, [dispatch, userProfileFetched]);

//   const handleAvatarClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       // In a real app, you would upload the file to your server here
//       console.log('File selected:', file.name);
//       // You can dispatch an action to update avatar here
//     }
//   };

//   // Prepare initial values for Formik
//   const getInitialValues = () => {
//     if (!userProfile) {
//       return {
//         firstName: '',
//         lastName: '',
//         phone: '',
//         address: {
//           street: '',
//           city: '',
//           state: '',
//           country: '',
//           zipCode: ''
//         }
//       };
//     }

//     // Get the current address based on addressType
//     const currentAddress = userProfile.address?.find(add => add?.type === addressType) || {};

//     return {
//       firstName: userProfile?.profile?.firstName || '',
//       lastName: userProfile?.profile?.lastName || '',
//       phone: userProfile?.profile?.phone || '',
//       address: {
//         street: currentAddress?.street || '',
//         city: currentAddress?.city || '',
//         state: currentAddress?.state || '',
//         country: currentAddress?.country || '',
//         zipCode: currentAddress?.zipCode || ''
//       }
//     };
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="bg-white rounded-lg shadow-md p-6"
//     >
//       {!isEditing ? (
//         <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
//           <ViewProfile
//             userProfile={userProfile}
//             setIsEditing={setIsEditing}
//             handleAvatarClick={handleAvatarClick}
//             fileInputRef={fileInputRef}
//             addressType={addressType}
//             setAddressType={setAddressType}
//           />
//         </div>
//       ) : (
//         <EditProfile
//           userProfile={userProfile}
//           setIsEditing={setIsEditing}
//           initialValues={getInitialValues()}
//           addressType={addressType}
//           handleAvatarClick={handleAvatarClick}
//            fileInputRef={fileInputRef} // Add this line
//         />
//       )}
      
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         accept="image/*"
//         className="hidden"
//       />
//     </motion.div>
//   );
// };



const ViewProfile = ({ userProfile, setIsEditing, handleAvatarClick, fileInputRef, addressType, setAddressType, avatarPreview }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getCurrentAddress = () => {
    if (!userProfile?.address?.length) return 'No address found';
    
    const currentAddress = userProfile.address.find(add => add?.type === addressType);
    
    if (!currentAddress) {
      return 'No address found for this type';
    }
    
    return (
      <>
        <span>{currentAddress?.street}, </span>
        <span>{currentAddress?.city}, </span>
        <span>{currentAddress?.state}, </span>
        <span>{currentAddress?.country}, </span>
        <span>{currentAddress?.zipCode}</span>
      </>
    );
  };

  return (
    <>
      {/* Avatar Section */}
      <div className="flex-shrink-0">
        <div className="relative">
          <img
            src={avatarPreview || userProfile?.profile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <button 
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-[3.8rem] bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Member since {formatDate(userProfile?.createdAt)}
        </p>
      </div>

      {/* Profile Info */}
      <div className="flex-grow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <p className="text-gray-900">
              {userProfile?.profile?.firstName} {userProfile?.profile?.lastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{userProfile?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <p className="text-gray-900">{userProfile?.profile?.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <div className='flex gap-3 mb-3'>
              <p 
                className={`${addressType === 'home' ? 'bg-[#f83838] hover:bg-[#fd0000]' : 'bg-[#0289de] hover:bg-[#007ac7]'} text-white p-1 rounded-md cursor-pointer`} 
                onClick={() => setAddressType("home")}
              >
                Home
              </p>
              <p 
                className={`${addressType === 'work' ? 'bg-[#f83838] hover:bg-[#fd0000]' : 'bg-[#0289de] hover:bg-[#007ac7]'} text-white p-1 rounded-md cursor-pointer`} 
                onClick={() => setAddressType("work")}
              >
                Work
              </p>
              <p 
                className={`${addressType === 'other' ? 'bg-[#f83838] hover:bg-[#fd0000]' : 'bg-[#0289de] hover:bg-[#007ac7]'} text-white p-1 rounded-md cursor-pointer`} 
                onClick={() => setAddressType("other")}
              >
                Other
              </p>
            </div>
            <p className="text-gray-900">
              {getCurrentAddress()}
            </p>
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#0289de] hover:bg-[#007ac7] text-white px-6 py-2 rounded-md transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
};

const EditProfile = ({ userProfile, setIsEditing, initialValues, addressType, handleAvatarClick, fileInputRef, avatarFile, setAvatarFile, avatarPreview, setAvatarPreview }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  //   setIsSubmitting(true);
    
  //   try {
  //     // Get all existing addresses
  //     const existingAddresses = userProfile?.addresses || userProfile?.address || [];
      
  //     // Find if there's already an address of the current type
  //     const addressIndex = existingAddresses.findIndex(addr => addr.type === addressType);
      
  //     // Prepare the updated address
  //     const updatedAddress = {
  //       type: addressType || 'home',
  //       street: values.address.street,
  //       city: values.address.city,
  //       state: values.address.state,
  //       zipCode: values.address.zipCode,
  //       country: values.address.country,
  //       isDefault: true
  //     };
      
  //     // Create new addresses array
  //     let newAddresses;
  //     if (addressIndex >= 0) {
  //       // Update existing address of this type
  //       newAddresses = [...existingAddresses];
  //       newAddresses[addressIndex] = updatedAddress;
  //     } else {
  //       // Add new address
  //       newAddresses = [...existingAddresses, updatedAddress];
  //     }
      
  //     // Create FormData for file upload
  //     const formData = new FormData();
      
  //     // Append profile data as JSON string
  //     const profileData = {
  //       firstName: values.firstName,
  //       lastName: values.lastName,
  //       phone: values.phone,
  //       avatar: userProfile?.profile?.avatar || 'https://example.com/avatar.jpg'
  //     };
      
  //     formData.append('profile', JSON.stringify(profileData));
  //     formData.append('addresses', JSON.stringify(newAddresses));
  //     formData.append('username', userProfile?.username || '');
  //     formData.append('email', userProfile?.email || '');
      
  //     // If there's a new avatar file, append it
  //     if (avatarFile) {
  //       formData.append('avatar', avatarFile);
  //     }
      
  //     // Append wishlist if exists
  //     if (userProfile?.wishlist) {
  //       formData.append('wishlist', JSON.stringify(userProfile.wishlist));
  //     }
      
  //     console.log('Updating profile with FormData...');
      
  //     // Dispatch the update action with FormData
  //     await dispatch(updateUserProfile(formData)).unwrap();
      
  //     // Clear avatar state after successful upload
  //     setAvatarFile(null);
  //     if (avatarPreview) {
  //       URL.revokeObjectURL(avatarPreview);
  //       setAvatarPreview(null);
  //     }
      
  //     // Refresh user profile data
  //     dispatch(getUserProfile());
      
  //     // Exit edit mode
  //     setIsEditing(false);
  //     resetForm();
      
  //   } catch (error) {
  //     console.error('Failed to update profile:', error);
  //     alert('Failed to update profile. Please try again.');
  //   } finally {
  //     setIsSubmitting(false);
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  setIsSubmitting(true);
  
  try {
    // Get all existing addresses
    const existingAddresses = userProfile?.addresses || userProfile?.address || [];
    
    // Find if there's already an address of the current type
    const addressIndex = existingAddresses.findIndex(addr => addr.type === addressType);
    
    // Prepare the updated address
    const updatedAddress = {
      type: addressType || 'home',
      street: values.address.street,
      city: values.address.city,
      state: values.address.state,
      zipCode: values.address.zipCode,
      country: values.address.country,
      isDefault: true
    };
    
    // Create new addresses array
    let newAddresses;
    if (addressIndex >= 0) {
      // Update existing address of this type
      newAddresses = [...existingAddresses];
      newAddresses[addressIndex] = updatedAddress;
    } else {
      // Add new address
      newAddresses = [...existingAddresses, updatedAddress];
    }
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Append profile data as JSON string (EXCLUDE avatar from JSON)
    const profileData = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone
      // REMOVED: avatar: userProfile?.profile?.avatar || 'https://example.com/avatar.jpg'
    };
    
    formData.append('profile', JSON.stringify(profileData));
    formData.append('addresses', JSON.stringify(newAddresses));
    formData.append('username', userProfile?.username || '');
    formData.append('email', userProfile?.email || '');
    
    // If there's a new avatar file, append it
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    } else {
    }
    
    // Append wishlist if exists
    if (userProfile?.wishlist) {
      formData.append('wishlist', JSON.stringify(userProfile.wishlist));
    }
    
    
    // Dispatch the update action with FormData
    await dispatch(updateUserProfile(formData)).unwrap();
    
    // Clear avatar state after successful upload
    setAvatarFile(null);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
    
    // Refresh user profile data
    dispatch(getUserProfile());
    
    // Exit edit mode
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
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={avatarPreview || userProfile?.profile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button 
                  onClick={handleAvatarClick}
                  type="button"
                  className="absolute bottom-0 right-[3.8rem] bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Member since {new Date(userProfile?.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            {/* Edit Form */}
            <div className="flex-grow space-y-4">
              {/* ... rest of the form fields remain the same ... */}
              {/* Keep all your existing form fields as they are */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                   <Field
                    type="text"
                    name="firstName"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName && touched.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <Field
                    type="text"
                    name="lastName"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName && touched.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={userProfile?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Field
                    type="tel"
                    name="phone"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <Field
                    type="text"
                    name="address.street"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.street && touched.address?.street ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="address.street" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <Field
                    type="text"
                    name="address.city"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.city && touched.address?.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="address.city" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <Field
                    type="text"
                    name="address.state"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.state && touched.address?.state ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="address.state" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <Field
                    type="text"
                    name="address.country"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.country && touched.address?.country ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="address.country" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <Field
                    type="text"
                    name="address.zipCode"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address?.zipCode && touched.address?.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <ErrorMessage name="address.zipCode" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || formikSubmitting}
                  className="bg-[#0289de] hover:bg-[#007ac7] disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Clear avatar preview when canceling
                    if (avatarPreview) {
                      URL.revokeObjectURL(avatarPreview);
                      setAvatarPreview(null);
                    }
                    setAvatarFile(null);
                    setIsEditing(false);
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
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

// Main Profile Component
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [addressType, setAddressType] = useState("home");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const { userProfile, userProfileLoading, userProfileFetched } = useSelector(state => ({
    userProfile: state.login.userProfile,
    userProfileLoading: state.login.userProfileLoading,
    userProfileFetched: state.login.userProfileFetched
  }));

  // Fetch user profile if not already fetched
  useEffect(() => {
    if (!userProfileFetched) {
      dispatch(getUserProfile());
    }
  }, [dispatch, userProfileFetched]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      setAvatarFile(file);
    }
  };

  // Prepare initial values for Formik
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
          zipCode: ''
        }
      };
    }

    // Get the current address based on addressType
    const currentAddress = userProfile.address?.find(add => add?.type === addressType) || {};

    return {
      firstName: userProfile?.profile?.firstName || '',
      lastName: userProfile?.profile?.lastName || '',
      phone: userProfile?.profile?.phone || '',
      address: {
        street: currentAddress?.street || '',
        city: currentAddress?.city || '',
        state: currentAddress?.state || '',
        country: currentAddress?.country || '',
        zipCode: currentAddress?.zipCode || ''
      }
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      {userProfileLoading && <PageLoader/>}
      {!isEditing ? (
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
          <ViewProfile
            userProfile={userProfile}
            setIsEditing={setIsEditing}
            handleAvatarClick={handleAvatarClick}
            fileInputRef={fileInputRef}
            addressType={addressType}
            setAddressType={setAddressType}
            avatarPreview={avatarPreview}
          />
        </div>
      ) : (
        <EditProfile
          userProfile={userProfile}
          setIsEditing={setIsEditing}
          initialValues={getInitialValues()}
          addressType={addressType}
          handleAvatarClick={handleAvatarClick}
          fileInputRef={fileInputRef}
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