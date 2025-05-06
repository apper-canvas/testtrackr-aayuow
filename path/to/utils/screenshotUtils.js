/**
 * Utility functions for capturing and managing screenshots
 */

/**
 * Captures a screenshot using the browser's screen capture API
 * @returns {Promise<string|null>} - A promise that resolves to a base64 string of the screenshot or null if error
 */
export const captureScreenshot = async () => {
  try {
    // Request screen capture permission and get media stream
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: { 
        displaySurface: 'monitor',
        cursor: 'always' 
      },
      audio: false
    });
    
    // Create video element to capture the stream
    const video = document.createElement('video');
    video.srcObject = mediaStream;
    
    // Wait for video to be loaded
    const loaded = new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play();
        resolve();
      };
    });
    
    await loaded;
    
    // Create canvas and draw the video frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Stop all tracks
    mediaStream.getTracks().forEach(track => track.stop());
    
    // Convert to base64 image
    const dataUrl = canvas.toDataURL('image/png');
    
    return dataUrl;
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    if (error.name === 'NotAllowedError') {
      return { error: 'Permission denied. Please allow screen capture to take screenshots.' };
    } else if (error.name === 'NotFoundError') {
      return { error: 'Screen capture device not found.' };
    }
    return { error: 'Failed to capture screenshot. Please try again.' };
  }
};

export default { captureScreenshot };