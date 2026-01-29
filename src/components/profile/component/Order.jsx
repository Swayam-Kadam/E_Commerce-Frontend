import { motion } from 'framer-motion';


const Order = () => {
    // Sample user data
  const orders = [
    {
      id: 'ORD-12345',
      date: '2023-10-15',
      status: 'Delivered',
      items: 3,
      total: 149.97,
      products: [
        { name: 'Classic White T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80' },
        { name: 'Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80' }
      ]
    },
    {
      id: 'ORD-12346',
      date: '2023-10-10',
      status: 'Processing',
      items: 2,
      total: 89.98,
      products: [
        { name: 'Running Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80' }
      ]
    },
    {
      id: 'ORD-12347',
      date: '2023-10-05',
      status: 'Delivered',
      items: 1,
      total: 29.99,
      products: [
        { name: 'Coffee Beans', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80' }
      ]
    }
  ];


  return (
    <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">Placed on {order.date}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
    
                  <div className="border-t pt-4">
                    <div className="block md:flex items-center space-x-4">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="flex items-center space-x-3 mt-5">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <span className="text-sm text-gray-700">{product.name}</span>
                        </div>
                      ))}
                      {order.items > order.products.length && (
                        <span className="text-sm text-gray-500">+{order.items - order.products.length} more items</span>
                      )}
                    </div>
    
                    <div className="flex justify-end space-x-4 mt-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Buy Again
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
  )
}

export default Order