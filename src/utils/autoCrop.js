/* Auto-crop using OpenCV.js. Exports detectAndCrop(imageElement, options) -> { dataUrl, success } */
/* Requires OpenCV.js loaded (global `cv`) and cv['onRuntimeInitialized'] completed before using. */

export async function detectAndCrop(imageElement, { maxWidth = 1600 } = {}){
  if(typeof cv === 'undefined') throw new Error('OpenCV.js (cv) not loaded.');
  // create temporary canvas to ensure image is drawn as RGBA
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.naturalWidth || imageElement.width;
  canvas.height = imageElement.naturalHeight || imageElement.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0);
  // read into OpenCV Mat
  const src = cv.imread(canvas);
  const original = src.clone();

  // resize if large
  let ratio = Math.max(1, src.cols / maxWidth);
  if(ratio > 1){
    const dsize = new cv.Size(Math.round(src.cols/ratio), Math.round(src.rows/ratio));
    cv.resize(src, src, dsize, 0, 0, cv.INTER_AREA);
  }

  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  cv.GaussianBlur(gray, gray, new cv.Size(5,5), 0);

  const edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(edges, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

  let maxArea = 0;
  let pageCnt = null;
  for(let i=0;i<contours.size();i++){
    const cnt = contours.get(i);
    const peri = cv.arcLength(cnt, true);
    const approx = new cv.Mat();
    cv.approxPolyDP(cnt, approx, 0.02*peri, true);
    if(approx.rows === 4){
      const area = cv.contourArea(approx);
      if(area > maxArea){ maxArea = area; pageCnt = approx.clone(); }
    }
    approx.delete();
    cnt.delete();
  }

  if(!pageCnt){
    // fallback - return original image dataURL
    const outCanvas = document.createElement('canvas');
    outCanvas.width = original.cols;
    outCanvas.height = original.rows;
    cv.imshow(outCanvas, original);
    const dataUrl = outCanvas.toDataURL('image/jpeg', 0.9);
    src.delete(); original.delete(); gray.delete(); edges.delete(); contours.delete(); hierarchy.delete();
    return { dataUrl, success: false };
  }

  // extract points and scale back if resized
  const pts = [];
  for(let i=0;i<4;i++) pts.push({ x: pageCnt.intAt(i,0), y: pageCnt.intAt(i,1) });
  if(ratio>1) pts.forEach(p=>{ p.x = Math.round(p.x*ratio); p.y = Math.round(p.y*ratio); });

  // order points: top-left, top-right, bottom-right, bottom-left
  pts.sort((a,b)=> a.x + a.y - (b.x + b.y));
  const tl = pts[0];
  const br = pts[3];
  const others = [pts[1], pts[2]].sort((a,b)=> a.x - b.x);
  const tr = others[1];
  const bl = others[0];

  const widthA = Math.hypot(br.x - bl.x, br.y - bl.y);
  const widthB = Math.hypot(tr.x - tl.x, tr.y - tl.y);
  const maxW = Math.max(Math.round(widthA), Math.round(widthB));

  const heightA = Math.hypot(tr.x - br.x, tr.y - br.y);
  const heightB = Math.hypot(tl.x - bl.x, tl.y - bl.y);
  const maxH = Math.max(Math.round(heightA), Math.round(heightB));

  const srcTri = cv.matFromArray(4,1,cv.CV_32FC2,[tl.x,tl.y, tr.x,tr.y, br.x,br.y, bl.x,bl.y]);
  const dstTri = cv.matFromArray(4,1,cv.CV_32FC2,[0,0, maxW-1,0, maxW-1,maxH-1, 0,maxH-1]);
  const M = cv.getPerspectiveTransform(srcTri, dstTri);

  const dst = new cv.Mat();
  const dsize = new cv.Size(maxW, maxH);
  cv.warpPerspective(original, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

  const outCanvas = document.createElement('canvas');
  outCanvas.width = dst.cols; outCanvas.height = dst.rows;
  cv.imshow(outCanvas, dst);
  const dataUrl = outCanvas.toDataURL('image/jpeg', 0.92);

  // free
  src.delete(); original.delete(); gray.delete(); edges.delete(); contours.delete(); hierarchy.delete();
  pageCnt.delete(); srcTri.delete(); dstTri.delete(); M.delete(); dst.delete();

  return { dataUrl, success: true };
}
