export async function sendEmail(to: string, message: string): Promise<void> {
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        message,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
  }