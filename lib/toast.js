import toast from 'react-hot-toast';

// Success notifications
export const showSuccess = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
  });
};

// Error notifications
export const showError = (message) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  });
};

// Info notifications
export const showInfo = (message) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
  });
};

// Warning notifications
export const showWarning = (message) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#f59e0b',
      color: '#fff',
    },
  });
};

// Loading notifications
export const showLoading = (message) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

// Dismiss a specific toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Blog-specific notifications
export const showBlogCreated = () => {
  showSuccess('Blog post created successfully! 🎉');
};

export const showBlogUpdated = () => {
  showSuccess('Blog post updated successfully! ✨');
};

export const showBlogDeleted = () => {
  showSuccess('Blog post deleted successfully! 🗑️');
};

// Notes-specific notifications
export const showNoteSaved = () => {
  showSuccess('Note saved successfully! 💾');
};

export const showNoteDeleted = () => {
  showSuccess('Note deleted successfully! 🗑️');
};

export const showNoteStarred = () => {
  showSuccess('Note added to favorites! ⭐');
};

export const showNoteUnstarred = () => {
  showInfo('Note removed from favorites');
};

// Authentication notifications
export const showLoginSuccess = (username) => {
  showSuccess(`Welcome back, ${username}! 👋`);
};

export const showLogoutSuccess = () => {
  showInfo('Logged out successfully');
};

export const showLoginRequired = () => {
  showWarning('Please log in to access this feature');
};

// GitHub integration notifications
export const showGitHubConnected = () => {
  showSuccess('GitHub account connected successfully! 🔗');
};

export const showGitHubDisconnected = () => {
  showInfo('GitHub account disconnected');
};

// General action notifications
export const showCopied = () => {
  showSuccess('Copied to clipboard! 📋');
};

export const showSaved = () => {
  showSuccess('Changes saved successfully! 💾');
};

export const showDeleted = () => {
  showSuccess('Item deleted successfully! 🗑️');
};

export const showUpdated = () => {
  showSuccess('Updated successfully! ✨');
};

// Error notifications with specific messages
export const showNetworkError = () => {
  showError('Network error. Please check your connection.');
};

export const showServerError = () => {
  showError('Server error. Please try again later.');
};

export const showValidationError = (field) => {
  showError(`Please check the ${field} field.`);
};

export const showPermissionError = () => {
  showError('You don\'t have permission to perform this action.');
};
