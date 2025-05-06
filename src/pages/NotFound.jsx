import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  const HomeIcon = getIcon('Home');
  const AlertCircleIcon = getIcon('AlertCircle');

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-5 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative mb-6">
          <div className="text-9xl font-bold text-surface-200 dark:text-surface-800">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertCircleIcon className="w-16 h-16 text-primary dark:text-primary-light" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-surface-800 dark:text-white">
          Page Not Found
        </h1>
        
        <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-8">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Return Home
          </Link>
        </motion.div>
      </motion.div>

      <div className="w-full max-w-md">
        <div className="h-2 w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "easeInOut" }}
          />
        </div>
        <p className="mt-2 text-sm text-surface-500 dark:text-surface-500">
          Redirecting you shortly...
        </p>
      </div>
    </div>
  );
}

export default NotFound;