import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ToastContainer() {
  const { toasts, removeToast } = useAppContext();

  return (
    <div className="fixed bottom-20 lg:bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let bgColor = 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-200';
          
          if (toast.type === 'success') {
            Icon = CheckCircle2;
            bgColor = 'bg-pink-50 border-pink-200 text-[#F78FB3] dark:bg-[#352328]/50 dark:border-pink-900 dark:text-pink-200';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            bgColor = 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-900 dark:text-red-200';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              layout
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl border shadow-md ${bgColor}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-semibold font-body tracking-wide">
                  {toast.message}
                </span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 shrink-0 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
