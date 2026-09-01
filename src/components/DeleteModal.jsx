import React from 'react';
import ConfirmModal from './ConfirmModal';

export default function DeleteModal({ isOpen, onClose, onConfirm, taskTitle }) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Task?"
      message={
        taskTitle
          ? `Are you sure you want to delete "${taskTitle}"? This task will be permanently removed.`
          : 'Are you sure you want to delete this task?'
      }
      confirmText="Delete Task"
      cancelText="Cancel"
      isDestructive={true}
    />
  );
}
