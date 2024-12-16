interface AttendanceRecord {
  ts_id: number;
  u_id: number;
  ts_subject: string;
  ts_clockedIn: string;
  ts_clockedOut: string | null;
  ts_date: string;
  ts_status: 'On Time' | 'Late' | 'Very Late' | 'Absent';
}

interface NotificationRecord {
  nt_id: number;
  u_id: number;
  u_studentParentID: number;
  nt_description: string;
  ts_clockedIn: number;
  ts_clockedOut: number;
  ts_date: number;
  ts_status: number;
}


export async function recordAttendance(sheetUrl: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    const currentTime = currentDate.toTimeString().slice(0, 5);
    const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()];

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Fetch user data
    const userResponse = await fetch('http://localhost:3000/auth/home', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();
    const studentName = userData.user.u_fullname;
    const section = userData.user.u_section;
    const userId = userData.user.u_id;

    // Fetch parent ID
    const parentResponse = await fetch(`http://localhost:3000/api/get-parent/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!parentResponse.ok) {
      throw new Error('Failed to fetch parent data');
    }

    const parentData = await parentResponse.json();
    const parentId = parentData.parentId;

    // Fetch current schedule
    const scheduleResponse = await fetch('http://localhost:3000/api/current-schedule', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!scheduleResponse.ok) {
      throw new Error('Failed to fetch schedule');
    }

    const scheduleData = await scheduleResponse.json();
    const currentSubject = scheduleData.currentSubject || 'No scheduled class';

    // Check if there's an existing attendance record
    const checkResponse = await fetch('http://localhost:3000/api/check-attendance', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!checkResponse.ok) {
      throw new Error('Failed to check attendance');
    }

    const checkData = await checkResponse.json();
    let clockedOut = null;
    let notificationDescription = '';
    let clockedInTime = currentTime;
    let clockedOutTime = null;

    // If record exists, update with clockedOut time
    if (checkData.exists) {
      clockedOut = currentTime;
      clockedOutTime = currentTime;
      notificationDescription = `Your student has clocked out from ${currentSubject}`;
      clockedInTime = checkData.record.ts_clockedIn;
    } else {
      notificationDescription = `Your student has clocked in to ${currentSubject}`;
    }

    // Determine attendance status
    const status = determineStatus(clockedInTime, scheduleData.startTime);

    // Record attendance in Google Sheets
    const response = await fetch(sheetUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        ts_date: formattedDate,
        studentName,
        ts_subject: currentSubject,
        section,
        day: currentDay,
        ts_clockedIn: clockedInTime,
        ts_clockedOut: clockedOutTime,
        ts_status: status
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to record attendance in sheets');
    }

    // Record in database
    const attendancePayload: Partial<AttendanceRecord> = {
      ts_subject: currentSubject,
      ts_date: formattedDate,
      ts_clockedIn: clockedInTime,
      ts_clockedOut: clockedOutTime,
      ts_status: status
    };

    const dbResponse = await fetch('http://localhost:3000/api/record-attendance', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(attendancePayload)
    });

    if (!dbResponse.ok) {
      throw new Error('Failed to record attendance in database');
    }

    // Create notification
    const notificationPayload = {
      u_id: userId,
      u_studentParentID: parentId,
      nt_description: notificationDescription,
      ts_clockedIn: clockedInTime,
      ts_clockedOut: clockedOutTime,
      ts_date: Math.floor(currentDate.getTime() / 1000),
      ts_status: status === 'On Time' ? 1 : status === 'Late' ? 2 : status === 'Very Late' ? 3 : 4
    };

    const notificationResponse = await fetch('http://localhost:3000/api/create-notification', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificationPayload)
    });

    if (!notificationResponse.ok) {
      throw new Error('Failed to create notification');
    }

    return {
      success: true,
      data: {
        date: formattedDate,
        subject: currentSubject,
        section,
        status,
        clockedIn: clockedInTime,
        clockedOut: clockedOutTime
      }
    };

  } catch (error) {
    console.error('Error recording attendance:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function determineStatus(actualTime: string, scheduledTime: string = '00:00'): AttendanceRecord['ts_status'] {
  try {
    const [actualHours, actualMinutes] = actualTime.split(':').map(Number);
    const [scheduledHours, scheduledMinutes] = scheduledTime.split(':').map(Number);

    if (isNaN(actualHours) || isNaN(actualMinutes) || 
        isNaN(scheduledHours) || isNaN(scheduledMinutes) ||
        (scheduledHours === 0 && scheduledMinutes === 0)) {
      return 'Absent';
    }

    const totalActualMinutes = actualHours * 60 + actualMinutes;
    const totalScheduledMinutes = scheduledHours * 60 + scheduledMinutes;
    const minutesDifference = totalActualMinutes - totalScheduledMinutes;

    if (minutesDifference <= 10) return 'On Time';
    if (minutesDifference <= 20) return 'Late';
    if (minutesDifference <= 30) return 'Very Late';
    return 'Absent';
  } catch (error) {
    console.error('Error determining status:', error);
    return 'Absent';
  }
} 