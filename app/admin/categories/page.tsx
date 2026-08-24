'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CategoryModal } from '@/components/admin/CategoryModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Category } from '@/lib/types';
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const { categories, scripts, addCategory, updateCategory, deleteCategory } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setModalOpen(true);
  };

  const handleSave = (data: Partial<Category>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data);
    } else {
      addCategory(data as Omit<Category, 'id'>);
    }
  };

  const targetCategoryToDelete = categories.find((c) => c.id === deleteTargetId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Category Management</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Organize scripts by frameworks, platforms, or product types ({categories.length} Total Categories)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid / Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs sm:text-sm">
            No categories created yet. Click &quot;Add New Category&quot; to create one.
          </div>
        ) : (
          <>
            {/* Mobile Card View (visible below md breakpoint) */}
            <div className="md:hidden divide-y divide-slate-100">
              {categories.map((category) => {
                const count = scripts.filter((s) => s.categorySlug === category.slug).length;

                return (
                  <div key={category.id} className="p-4 space-y-3 bg-white hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: category.color || '#2563eb' }}
                        />
                        <span className="font-bold text-slate-900 text-sm">
                          {category.name}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          category.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {category.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <code className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        /{category.slug}
                      </code>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                        <Layers className="w-3 h-3" />
                        <span>{count} {count === 1 ? 'script' : 'scripts'}</span>
                      </span>
                    </div>

                    {category.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(category)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(category.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (with horizontal scroll) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Category</th>
                    <th className="py-3.5 px-4">Slug</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4">Scripts Count</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((category) => {
                    const count = scripts.filter((s) => s.categorySlug === category.slug).length;

                    return (
                      <tr key={category.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Name & Accent Color */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                              style={{ backgroundColor: category.color || '#2563eb' }}
                            />
                            <span className="font-bold text-slate-900 text-sm">
                              {category.name}
                            </span>
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <code className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {category.slug}
                          </code>
                        </td>

                        {/* Description */}
                        <td className="py-4 px-4 max-w-xs truncate text-slate-500 text-xs">
                          {category.description || '—'}
                        </td>

                        {/* Associated Scripts Count */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                            <Layers className="w-3.5 h-3.5" />
                            <span>{count} {count === 1 ? 'script' : 'scripts'}</span>
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              category.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {category.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(category)}
                              className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Edit Category"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTargetId(category.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      <CategoryModal
        isOpen={modalOpen}
        category={editingCategory}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Category?"
        message={`Are you sure you want to delete the category "${targetCategoryToDelete?.name}"? Scripts belonging to this category will not be deleted, but may need recategorization.`}
        confirmLabel="Delete Category"
        isDestructive={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteCategory(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
