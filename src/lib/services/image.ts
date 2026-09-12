import { CakeImage } from '../../types';

/**
 * Uploads an image file to the specified provider using our secure backend proxy.
 */
export async function uploadImage(file: File, provider: 'imagekit' | 'imgbb'): Promise<CakeImage> {
  const base64Data = await fileToBase64(file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: base64Data,
      fileName: file.name,
      provider
    })
  });
  
  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(errorMsg || 'Failed to upload image through secure proxy');
  }
  
  const data = await response.json();
  return {
    url: data.url,
    provider: data.provider,
    fileId: data.fileId || '',
    fileName: data.fileName || file.name,
    uploadedAt: new Date().toISOString()
  };
}

/**
 * Deletes an image from the hosting provider using our secure backend proxy.
 */
export async function deleteImage(image: CakeImage): Promise<void> {
  if (!image.fileId) {
    console.log('Skipping image deletion - no fileId present (likely ImgBB or external reference)');
    return;
  }
  
  try {
    const response = await fetch('/api/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId: image.fileId,
        provider: image.provider
      })
    });
    
    if (!response.ok) {
      console.error('Failed to delete image:', await response.text());
    }
  } catch (e) {
    console.error('Error deleting image:', e);
  }
}

/**
 * Converts a standard File object to a Base64 data URL string.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
