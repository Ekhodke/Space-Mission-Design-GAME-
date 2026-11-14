let THREE;
try {
  THREE = await import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js');
} catch (primaryError) {
  try {
    THREE = await import('https://unpkg.com/three@0.164.1/build/three.module.js');
  } catch (fallbackError) {
    const notice = document.createElement('div');
    notice.style.cssText = 'position:fixed;z-index:9999;inset:auto 16px 16px;padding:14px 18px;background:#401d20;color:#fff;border:1px solid #ff7954;border-radius:10px;font:14px Inter, sans-serif';
    notice.textContent = 'The 3D game engine could not load. Check your internet connection, then refresh the page.';
    document.body.appendChild(notice);
    throw fallbackError;
  }
}
