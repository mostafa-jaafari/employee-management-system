export function getFormattedTimeLeft(dueDate: string, dueTime: string) {
  if (!dueDate) return "";

  // 1. Extract ONLY the date part (YYYY-MM-DD) from the first string
  // This removes the "T00:00:00" that causes the error
  const datePart = dueDate.split("T")[0].trim();
  
  // 2. Clean the time part
  const timePart = dueTime ? dueTime.trim() : "00:00:00";

  // 3. Create a clean ISO string: "2026-02-03T23:05:00"
  const target = new Date(`${datePart}T${timePart}`);
  
  const now = new Date();
  const diffInMs = target.getTime() - now.getTime();

  // 4. Handle invalid dates
  if (isNaN(target.getTime())) return "Invalid Date";

  // 5. Check if Overdue
  if (diffInMs <= 0) return "Overdue";

  // 6. Convert to units
  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  // 7. Return the largest unit
  if (years > 0) return `${years}y left`;
  if (months > 0) return `${months}mo left`;
  if (days > 0) return `${days}d left`;
  if (hours > 0) return `${hours}h left`;
  if (minutes > 0) return `${minutes}m left`;
  
  return `${seconds}s left`;
}