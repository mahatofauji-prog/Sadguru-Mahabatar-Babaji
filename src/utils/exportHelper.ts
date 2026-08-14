import { jsPDF } from 'jspdf';
import { toCanvas, toPng } from 'html-to-image';

const TRANSPARENT_FALLBACK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const urlToBase64 = async (url: string, timeoutMs: number = 3000): Promise<string | null> => {
  if (!url) return null;
  if (url.startsWith('data:')) return url;

  return new Promise((resolve) => {
    let finished = false;
    const done = (val: string | null) => {
      if (!finished) {
        finished = true;
        resolve(val);
      }
    };

    const timer = setTimeout(() => done(null), timeoutMs);

    fetch(url, { mode: 'cors', cache: 'force-cache' })
      .then((res) => {
        if (res.ok) return res.blob();
        throw new Error('Fetch failed');
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          clearTimeout(timer);
          done((reader.result as string) || null);
        };
        reader.onerror = () => {
          clearTimeout(timer);
          done(null);
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width || 100;
            canvas.height = img.naturalHeight || img.height || 100;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const dataUrl = canvas.toDataURL('image/png');
              clearTimeout(timer);
              done(dataUrl);
              return;
            }
          } catch (_) {}
          clearTimeout(timer);
          done(null);
        };
        img.onerror = () => {
          clearTimeout(timer);
          done(null);
        };
        img.src = url;
      });
  });
};

export const prepareElementImages = async (element: HTMLElement): Promise<void> => {
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(
    images.map(async (img) => {
      img.setAttribute('crossOrigin', 'anonymous');
      const currentSrc = img.src || img.getAttribute('src') || '';
      if (currentSrc && !currentSrc.startsWith('data:')) {
        try {
          const base64Src = await urlToBase64(currentSrc, 3000);
          if (base64Src && base64Src.startsWith('data:')) {
            img.src = base64Src;
          } else {
            img.src = TRANSPARENT_FALLBACK;
          }
        } catch (err) {
          console.warn('Failed converting image src to base64:', currentSrc, err);
          img.src = TRANSPARENT_FALLBACK;
        }
      }
    })
  );
};

export const downloadBlob = (blob: Blob, filename: string): string => {
  const blobUrl = URL.createObjectURL(blob);
  try {
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.rel = 'noopener noreferrer';
    link.style.position = 'fixed';
    link.style.left = '-9999px';
    link.style.top = '-9999px';
    link.style.opacity = '0';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 1000);
  } catch (e) {
    console.error('downloadBlob failed:', e);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    reader.readAsDataURL(blob);
  }
  return blobUrl;
};

export const renderElementToCanvas = async (
  element: HTMLElement,
  backgroundColor: string | null = '#ffffff',
  scale: number = 3
): Promise<HTMLCanvasElement> => {
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch (_) {}
  }
  
  await prepareElementImages(element);
  
  const canvasPromise = toCanvas(element, {
    pixelRatio: scale,
    backgroundColor: backgroundColor || '#ffffff',
    cacheBust: true,
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('html-to-image timed out after 12s')), 12000);
  });

  return Promise.race([canvasPromise, timeoutPromise]);
};

export const downloadElementAsPNG = async (
  element: HTMLElement,
  filename: string,
  backgroundColor: string | null = '#ffffff',
  scale: number = 3
): Promise<{ dataUrl: string; blobUrl: string }> => {
  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch (_) {}
  }

  await prepareElementImages(element);

  const pngPromise = toPng(element, {
    pixelRatio: scale,
    backgroundColor: backgroundColor || '#ffffff',
    cacheBust: true,
    quality: 1.0,
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('html-to-image timed out after 12s')), 12000);
  });

  const dataUrl = await Promise.race([pngPromise, timeoutPromise]);
  const cleanFilename = filename.endsWith('.png') ? filename : `${filename}.png`;
  let blobUrl = '';

  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    blobUrl = downloadBlob(blob, cleanFilename);
  } catch (err) {
    console.warn('blob conversion failed, falling back to data URL download:', err);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = cleanFilename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return { dataUrl, blobUrl };
};

export const downloadElementAsPDF = async (
  element: HTMLElement,
  filename: string,
  options: { orientation?: 'p' | 'l'; format?: string | [number, number]; backgroundColor?: string | null; scale?: number } = {}
): Promise<{ dataUrl: string; blobUrl: string }> => {
  const { orientation = 'p', format = 'a4', backgroundColor = '#ffffff', scale = 3 } = options;
  
  const canvas = await renderElementToCanvas(element, backgroundColor, scale);
  const imgData = canvas.toDataURL('image/png', 1.0);

  const pdf = new jsPDF(orientation, 'mm', format as any);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Standard margin for professional document look
  const margin = 5;
  const targetWidth = pdfWidth - (margin * 2);
  let renderWidth = targetWidth;
  let renderHeight = (canvas.height * targetWidth) / canvas.width;

  if (renderHeight > (pageHeight - (margin * 2))) {
    renderHeight = pageHeight - (margin * 2);
    renderWidth = (canvas.width * renderHeight) / canvas.height;
  }

  const x = (pdfWidth - renderWidth) / 2;
  const y = (pageHeight - renderHeight) / 2;

  pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight, undefined, 'FAST');

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  const pdfDataUri = pdf.output('datauristring');
  const pdfBlob = pdf.output('blob');
  const blobUrl = downloadBlob(pdfBlob, cleanFilename);

  try {
    pdf.save(cleanFilename);
  } catch (err) {
    console.warn('pdf.save failed:', err);
  }

  return { dataUrl: pdfDataUri, blobUrl };
};
