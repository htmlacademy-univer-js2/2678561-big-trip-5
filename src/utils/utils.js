import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export function getLabel(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function formatDuration(start, end) {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const diffMs = endDate.diff(startDate);
  const diffDuration = dayjs.duration(diffMs);

  const days = Math.floor(diffDuration.asDays());
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();

  if (days > 0) {
    return `${days}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }

  if (hours > 0) {
    if (minutes === 0) {
      return `${hours.toString().padStart(2, '0')}H 00M`;
    }
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }

  return `${minutes}M`;
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

export function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}
