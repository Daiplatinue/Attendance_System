export async function recordAttendance(sheetUrl: string) {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    const currentTime = currentDate.toTimeString().slice(0, 5);
    const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()];
    
    // Get the token from localStorage
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
    const studentSection = userData.user.u_section;

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

    // Record attendance
    const response = await fetch(sheetUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        timestamp: formattedDate,
        name: studentName,
        subject: currentSubject,
        section: studentSection,
        day: currentDay,
        time: currentTime
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to record attendance');
    }

    const result = await response.text();
    
    try {
      const jsonResult = JSON.parse(result);
      return { 
        success: true, 
        data: {
          ...jsonResult,
          subject: currentSubject,
          section: studentSection
        }
      };
    } catch {
      return { 
        success: true, 
        data: { 
          message: 'Attendance recorded',
          subject: currentSubject,
          section: studentSection
        }
      };
    }
  } catch (error) {
    console.error('Error recording attendance:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}