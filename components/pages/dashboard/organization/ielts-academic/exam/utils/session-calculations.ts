/* eslint-disable prefer-const */
import { TimeWindow } from "@/types/exam/ielts-academic/exam";
import { SessionCalculationResult } from "@/types/exam/ielts-academic/exam-creation";

export const calculateSessionsInWindow = (
  window: TimeWindow,
  sessionDuration: number,
  instructorCount: number
): SessionCalculationResult => {
  if (instructorCount === 0) {
    return {
      canFit: 0,
      totalMinutes: 0,
      utilization: 0,
      sessionsPerInstructor: 0,
      totalCapacity: 0,
      instructorCount: 0
    };
  }

  try {
    // Parse time strings (assuming format like "09:00 AM" or "09:00")
    const parseTime = (timeStr: string): number => {
      // Convert 12-hour format to 24-hour if needed
      const cleanTime = timeStr.replace(/\s/g, '');
      let [hours, minutes] = cleanTime.split(':').map(Number);
      
      if (cleanTime.toLowerCase().includes('pm') && hours !== 12) {
        hours += 12;
      } else if (cleanTime.toLowerCase().includes('am') && hours === 12) {
        hours = 0;
      }
      
      return hours * 60 + (minutes || 0);
    };

    const startMinutes = parseTime(window.start_time);
    const endMinutes = parseTime(window.end_time);
    
    // Handle case where end time is next day (e.g., start at 11 PM, end at 2 AM)
    const totalMinutes = endMinutes > startMinutes ? endMinutes - startMinutes : (24 * 60) - startMinutes + endMinutes;

    const sessionsPerInstructor = Math.floor(totalMinutes / sessionDuration);
    const totalCapacity = sessionsPerInstructor * instructorCount;
    const utilization = (sessionsPerInstructor * sessionDuration) / totalMinutes * 100;

    return {
      canFit: totalCapacity,
      totalMinutes,
      utilization,
      sessionsPerInstructor,
      totalCapacity,
      instructorCount
    };
  } catch (error) {
    console.error('Error calculating sessions:', error);
    return {
      canFit: 0,
      totalMinutes: 0,
      utilization: 0,
      sessionsPerInstructor: 0,
      totalCapacity: 0,
      instructorCount: 0
    };
  }
};
