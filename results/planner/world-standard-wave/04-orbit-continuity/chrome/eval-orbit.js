() => {
  const c = document.querySelector('[data-testid="three-viewer-container"]');
  const canvas = document.querySelector('[data-testid="planner-3d-canvas"]');
  const allOrbit = Array.from(document.querySelectorAll('[data-orbit-enabled]')).map(el => ({
    testid: el.getAttribute('data-testid'),
    orbit: el.getAttribute('data-orbit-enabled'),
    w: el.clientWidth,
    h: el.clientHeight
  }));
  const canvases = Array.from(document.querySelectorAll('canvas')).map(cv => ({
    testid: cv.getAttribute('data-testid'),
    w: cv.width,
    h: cv.height,
    cw: cv.clientWidth,
    ch: cv.clientHeight
  }));
  return {
    container: c ? { orbit: c.getAttribute('data-orbit-enabled'), w: c.clientWidth, h: c.clientHeight } : null,
    planner3d: canvas ? { w: canvas.clientWidth, h: canvas.clientHeight, tag: canvas.tagName } : null,
    allOrbit,
    canvases,
    furniture: (document.body.innerText.match(/(\d+)\s+furniture/i) || [])[1] || null,
    radio3dChecked: !!document.querySelector('[role="radio"][aria-checked="true"]')
  };
}
