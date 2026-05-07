import React, { Fragment } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Badge = ({ children, variant = 'slate', className }) => {
  const variants = {
    indigo: 'bg-indigo-100 text-indigo-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  );
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  isLoading, 
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2',
  };

  return (
    <button 
      className={cn(variants[variant], className)} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>}
      <input 
        className={cn(
          'input-field', 
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )} 
        {...props} 
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export const Card = ({ children, className, hover = true }) => {
  return (
    <div className={cn('card', hover && 'hover:shadow-md transition-shadow', className)}>
      {children}
    </div>
  );
};

export const Avatar = ({ name, src, size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';

  return (
    <div className={cn(
      'rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium overflow-hidden border-2 border-white shadow-sm',
      sizes[size],
      className
    )}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-8 sm:pb-4">
                  <div className="flex justify-between items-center mb-6">
                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-slate-900">
                      {title}
                    </Dialog.Title>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="mt-2">{children}</div>
                </div>
                {footer && (
                  <div className="bg-slate-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-8 gap-3">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export const Drawer = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 py-6 sm:px-8">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-bold leading-6 text-slate-900">
                          {title}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-slate-400 hover:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-8">
                      {children}
                    </div>
                    {footer && (
                      <div className="border-t border-slate-100 px-4 py-6 sm:px-8 flex justify-end gap-3 bg-slate-50">
                        {footer}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
