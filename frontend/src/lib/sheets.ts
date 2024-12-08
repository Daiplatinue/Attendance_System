export async function recordAttendance(sheetUrl: string) {
  try {
    const currentDate = new Date().toLocaleString();
    
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Fetch user data from the server
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
    
    const response = await fetch(sheetUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        timestamp: currentDate,
        name: studentName,
      }),
    });

    const result = await response.text();
    
    if (response.ok) {
      try {
        const jsonResult = JSON.parse(result);
        return { success: true, data: jsonResult };
      } catch {
        return { success: true, data: { message: 'Attendance recorded' } };
      }
    }

    return { 
      success: false, 
      error: 'Failed to record attendance' 
    };
  } catch (error) {
    console.error('Error recording attendance:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}