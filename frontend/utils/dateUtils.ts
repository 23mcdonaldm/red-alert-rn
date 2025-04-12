import { Timestamp } from 'firebase/firestore';

export const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return '';

  try {
    let date: Date;

    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (timestamp._seconds !== undefined) {
      date = new Date(timestamp._seconds * 1000);
    } else if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
      date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    } else if (typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string/number:', timestamp);
        return '';
      }
    } else {
      console.warn('Unknown timestamp format:', timestamp);
      return '';
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diff / 60000);
    const diffHours = Math.floor(diff / 3600000);
    const diffDays = Math.floor(diff / 86400000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.warn('Error formatting timestamp:', error);
    return '';
  }
}; 