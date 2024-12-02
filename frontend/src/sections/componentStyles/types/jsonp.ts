export function fetchJSONP(url: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonpCallback' + Date.now();
      
      (window as any)[callbackName] = (data: unknown) => {
        resolve(data);
        cleanup();
      };
      
      const script = document.createElement('script');
      script.src = `${url}?callback=${callbackName}`;
      script.onerror = () => {
        reject(new Error('Failed to load data'));
        cleanup();
      };
      
      function cleanup() {
        delete (window as any)[callbackName];
        document.head.removeChild(script);
      }
      
      document.head.appendChild(script);
    });
  }