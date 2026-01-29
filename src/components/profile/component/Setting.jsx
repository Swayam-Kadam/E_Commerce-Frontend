import { motion } from 'framer-motion';


const Setting = () => {

  return (
    <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6 space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  {['Email notifications', 'SMS notifications', 'Promotional emails', 'Order updates'].map((pref) => (
                    <label key={pref} className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{pref}</span>
                    </label>
                  ))}
                </div>
              </div>
    
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Change Password
                </button>
              </div>
    
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
                <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Delete Account
                </button>
              </div>
    </motion.div>
  )
}

export default Setting