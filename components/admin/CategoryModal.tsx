'use client';

import React, { useState } from 'react';
import { Category } from '@/lib/types';
import { generateSlug } from '@/lib/utils';
import { X, Folder } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface CategoryModalProps {
  isOpen: boolean;
  category?: Category | null;
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
}

function CategoryFormInner({
  category,
  onClose,
  onSave,
}: {
  category?: Category | null;
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
}) {
  const [name, setName] = useState(category ? category.name : '');
  const [slug, setSlug] = useState(category ? category.slug : '');
  const [description, setDescription] = useState(category ? category.description || '' : '');
  const [status, setStatus] = useState<'active' | 'inactive'>(category ? category.status : 'active');
  const [color, setColor] = useState(category ? category.color || '#2563eb' : '#2563eb');
  const [isManualSlug, setIsManualSlug] = useState(Boolean(category));

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isManualSlug) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      slug: slug.trim() || generateSlug(name),
      description: description.trim(),
      status,
      color,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="relative bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 z-10"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Folder className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {category ? 'Edit Category' : 'Add New Category'}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Category Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. React & Next.js, Laravel, Gaming"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Slug
            </label>
            <button
              type="button"
              onClick={() => setIsManualSlug(!isManualSlug)}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              {isManualSlug ? 'Auto' : 'Custom'}
            </button>
          </div>
          <input
            type="text"
            value={slug}
            disabled={!isManualSlug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            placeholder="react-nextjs"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 outline-none focus:bg-white focus:border-blue-500 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short summary of what scripts belong to this category..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
              />
              <span className="text-xs font-mono text-slate-600">{color}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm"
          >
            {category ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export function CategoryModal({ isOpen, category, onClose, onSave }: CategoryModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Card with key to recreate state clean */}
        <CategoryFormInner
          key={category?.id || 'new'}
          category={category}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </AnimatePresence>
  );
}
