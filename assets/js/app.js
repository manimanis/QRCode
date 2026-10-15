/**
 * GénéCode – Application JavaScript principale
 * Vue.js 3 + QRCodeStyling + JsBarcode
 */

const { createApp, ref, computed, nextTick, watch } = Vue;

// ─── Logos vectoriels intégrés (Base64 / Data URI) ───
const ICONS = {
  target: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%231877f2"/><circle cx="50" cy="50" r="36" fill="%23ffffff" fill-opacity="0.25"/><circle cx="50" cy="50" r="24" fill="%231877f2"/><circle cx="50" cy="50" r="10" fill="%23ffffff"/><rect x="48" y="14" width="4" height="12" rx="2" fill="%23ffffff"/><rect x="48" y="74" width="4" height="12" rx="2" fill="%23ffffff"/><rect x="14" y="48" width="12" height="4" rx="2" fill="%23ffffff"/><rect x="74" y="48" width="12" height="4" rx="2" fill="%23ffffff"/></svg>',
  download: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%231877f2"/><path d="M50 26 L50 58 M36 46 L50 60 L64 46" stroke="%23ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/><rect x="32" y="70" width="36" height="6" rx="3" fill="%23ffffff"/></svg>',
  star: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23f59e0b"/><path d="M50 18 L59.5 37.3 L80.8 40.4 L65.4 55.4 L69 76.6 L50 66.6 L31 76.6 L34.6 55.4 L19.2 40.4 L40.5 37.3 Z" fill="%23ffffff"/></svg>',
  heart: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23ec4899"/><path d="M50 72 C50 72 26 54 26 38 C26 28 34 22 43 24 C47 25 50 30 50 30 C50 30 53 25 57 24 C66 22 74 28 74 38 C74 54 50 72 50 72 Z" fill="%23ffffff"/></svg>',
  wifi: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%236366f1"/><path d="M25 40 A36 36 0 0 1 75 40 M33 50 A24 24 0 0 1 67 50 M41 60 A12 12 0 0 1 59 60" stroke="%23ffffff" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="50" cy="72" r="5" fill="%23ffffff"/></svg>',
  globe: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230ea5e9"/><circle cx="50" cy="50" r="32" stroke="%23ffffff" stroke-width="5" fill="none"/><line x1="18" y1="50" x2="82" y2="50" stroke="%23ffffff" stroke-width="5"/><ellipse cx="50" cy="50" rx="16" ry="32" stroke="%23ffffff" stroke-width="5" fill="none"/></svg>',
  camera: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%238b5cf6"/><circle cx="50" cy="50" r="22" stroke="%23ffffff" stroke-width="6" fill="none"/><circle cx="50" cy="50" r="10" fill="%23ffffff"/><path d="M30 32 L36 22 L64 22 L70 32 Z" fill="%23ffffff"/></svg>'
};

// ─── Palettes de couleurs (agissent UNIQUEMENT sur les couleurs du QR Code) ───
const COLOR_PALETTES = [
  { id: 'black', label: 'Noir & Blanc', swatch: '#000000', fgColor: '#000000', bgColor: '#ffffff', colorType: 'single' },
  { id: 'blue', label: 'Bleu Royal', swatch: '#1877f2', fgColor: '#1877f2', bgColor: '#ffffff', colorType: 'single' },
  { id: 'red', label: 'Rouge Carmin', swatch: '#ef4444', fgColor: '#ef4444', bgColor: '#ffffff', colorType: 'single' },
  { id: 'green', label: 'Émeraude', swatch: '#059669', fgColor: '#059669', bgColor: '#ffffff', colorType: 'single' },
  { id: 'purple', label: 'Violet', swatch: '#7c3aed', fgColor: '#7c3aed', bgColor: '#ffffff', colorType: 'single' },
  { id: 'pink', label: 'Framboise', swatch: '#ec4899', fgColor: '#ec4899', bgColor: '#ffffff', colorType: 'single' },
  { id: 'cyberpunk', label: 'Cyberpunk', swatch: 'linear-gradient(135deg, #7928ca, #00dfd8)', fgColor: '#7928ca', gradColor2: '#00dfd8', colorType: 'linear', gradRotation: 45, bgColor: '#ffffff' },
  { id: 'sunset', label: 'Sunset', swatch: 'linear-gradient(135deg, #f43f5e, #f97316)', fgColor: '#f43f5e', gradColor2: '#f97316', colorType: 'linear', gradRotation: 45, bgColor: '#ffffff' },
  { id: 'neon', label: 'Néon Sombre', swatch: '#00f59b', fgColor: '#00f59b', bgColor: '#0f172a', colorType: 'single' }
];

createApp({
  setup() {
    const mode  = ref('qr');
    const qrTab = ref('content'); // 'content' | 'shapes' | 'colors' | 'logo' | 'frame'

    // Configuration avancée du QRCode
    const qr = ref({
      content: 'https://example.com',
      ecl: 'M',
      size: 280,
      margin: 8,

      // Formes
      dotsType: 'rounded',            // 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded'
      cornersSquareType: 'extra-rounded', // 'square' | 'dot' | 'extra-rounded'
      cornersDotType: 'dot',          // 'square' | 'dot'

      // Couleurs & Dégradés
      colorType: 'single',            // 'single' | 'linear' | 'radial'
      fgColor: '#1877f2',
      gradColor2: '#00d4aa',
      gradRotation: 45,
      customEyes: false,
      eyeColor: '#1877f2',
      eyeDotColor: '#1877f2',
      transparentBg: false,
      bgColor: '#ffffff',

      // Logo
      logo: '',
      logoSize: 0.35,
      logoMargin: 6,
      hideBackgroundDots: true,

      // Cadre & Bannière
      frame: 'scanme',
      framePosition: 'top',           // 'top' | 'bottom'
      frameText: 'SCAN ME',
      frameColor: '#1877f2',
    });

    // Configuration Code-barres
    const bc = ref({
      content: 'GENECODE-2025',
      format: 'CODE128',
      width: 2,
      height: 100,
      fgColor: '#000000',
      bgColor: '#ffffff',
      displayValue: true,
      fontSize: 16,
    });

    const generated = ref(false);
    const genError  = ref('');
    const copied    = ref(false);
    const toasts    = ref([]);
    const history   = ref([]);
    let   autoTimer = null;
    let   qrCodeStylingInstance = null;

    const currentContent = computed(() =>
      mode.value === 'qr' ? qr.value.content.trim() : bc.value.content.trim()
    );

    // Synchronisation automatique : la couleur du cadre suit toujours la couleur du QR code
    watch(() => qr.value.fgColor, (newColor) => {
      if (newColor) {
        qr.value.frameColor = newColor;
      }
    });

    function showToast(message, type = 'success') {
      const id = Date.now();
      toasts.value.push({ id, message, type });
      setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id); }, 3000);
    }

    function switchMode(m) {
      mode.value = m;
      generated.value = false;
      genError.value = '';
    }

    function autoGenerate() {
      clearTimeout(autoTimer);
      autoTimer = setTimeout(() => { if (currentContent.value) generate(); }, 350);
    }

    // Prefill helpers
    function prefillEmail() { qr.value.content = 'mailto:contact@example.com?subject=Bonjour'; autoGenerate(); }
    function prefillPhone() { qr.value.content = 'tel:+33600000000'; autoGenerate(); }
    function prefillWifi()  { qr.value.content = 'WIFI:T:WPA;S:MonReseau;P:motdepasse;;'; autoGenerate(); }

    function onFormatChange() {
      const placeholders = {
        EAN13: '5901234123457', EAN8: '96385074', UPC: '012345678905',
        EAN5: '54495', EAN2: '53', CODE128: 'GENECODE-2025',
        CODE39: 'HELLO-WORLD', CODE93: 'HELLO WORLD',
        ITF14: '10012345678902', MSI: '1234567', pharmacode: '1234',
      };
      bc.value.content = placeholders[bc.value.format] || '';
      autoGenerate();
    }

    // Logo helpers
    function selectBuiltinLogo(key) {
      qr.value.logo = ICONS[key] || '';
      autoGenerate();
    }
    function removeLogo() {
      qr.value.logo = '';
      autoGenerate();
    }
    function onLogoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        qr.value.logo = e.target.result;
        autoGenerate();
      };
      reader.readAsDataURL(file);
    }

    // Color palette loader (modifie les couleurs du QR Code et synchronise la couleur du cadre)
    function applyColorPalette(p) {
      qr.value.fgColor = p.fgColor;
      qr.value.colorType = p.colorType || 'single';
      if (p.gradColor2) qr.value.gradColor2 = p.gradColor2;
      if (p.gradRotation !== undefined) qr.value.gradRotation = p.gradRotation;
      if (p.bgColor) qr.value.bgColor = p.bgColor;
      // Le cadre adopte automatiquement la couleur sélectionnée
      qr.value.frameColor = p.fgColor;
      showToast(`Couleur "${p.label}" appliquée !`);
      autoGenerate();
    }

    // Changement direct de la couleur principale du QR -> synchronise aussi le cadre
    function onFgColorChange() {
      qr.value.frameColor = qr.value.fgColor;
      autoGenerate();
    }

    // Sync frame color with QR color
    function syncFrameColor() {
      qr.value.frameColor = qr.value.fgColor;
      autoGenerate();
    }

    async function generate() {
      if (!currentContent.value) return;
      genError.value = '';
      await nextTick();
      if (mode.value === 'qr') await generateQR();
      else await generateBarcode();
    }

    // Build QRCodeStyling options
    function getQROptions() {
      const isGrad = qr.value.colorType !== 'single';
      const rad = (qr.value.gradRotation * Math.PI) / 180;

      const dotsGradient = isGrad ? {
        type: qr.value.colorType,
        rotation: rad,
        colorStops: [
          { offset: 0, color: qr.value.fgColor },
          { offset: 1, color: qr.value.gradColor2 }
        ]
      } : undefined;

      const eyeColor = qr.value.customEyes ? qr.value.eyeColor : (isGrad ? undefined : qr.value.fgColor);
      const eyeDotColor = qr.value.customEyes ? qr.value.eyeDotColor : (isGrad ? undefined : qr.value.fgColor);

      return {
        width: qr.value.size,
        height: qr.value.size,
        type: 'canvas',
        data: qr.value.content || 'https://example.com',
        margin: qr.value.margin,
        qrOptions: {
          errorCorrectionLevel: qr.value.ecl
        },
        dotsOptions: {
          type: qr.value.dotsType,
          color: isGrad ? undefined : qr.value.fgColor,
          gradient: dotsGradient
        },
        cornersSquareOptions: {
          type: qr.value.cornersSquareType,
          color: eyeColor,
          gradient: isGrad && !qr.value.customEyes ? dotsGradient : undefined
        },
        cornersDotOptions: {
          type: qr.value.cornersDotType,
          color: eyeDotColor,
          gradient: isGrad && !qr.value.customEyes ? dotsGradient : undefined
        },
        backgroundOptions: {
          color: qr.value.transparentBg ? 'transparent' : qr.value.bgColor
        },
        image: qr.value.logo || undefined,
        imageOptions: {
          hideBackgroundDots: qr.value.hideBackgroundDots,
          imageSize: Number(qr.value.logoSize),
          margin: Number(qr.value.logoMargin),
          crossOrigin: 'anonymous'
        }
      };
    }

    async function generateQR() {
      try {
        generated.value = true;
        await nextTick();
        const container = document.getElementById('qr-container');
        if (!container) { await nextTick(); return generateQR(); }

        const options = getQROptions();

        if (window.QRCodeStyling) {
          container.innerHTML = '';
          qrCodeStylingInstance = new QRCodeStyling(options);
          qrCodeStylingInstance.append(container);
        } else {
          throw new Error('Bibliothèque QRCodeStyling non chargée');
        }

        await addHistoryQR();
      } catch (e) {
        genError.value = e.message || 'Erreur de génération.';
        generated.value = false;
        showToast('Erreur : ' + genError.value, 'error');
      }
    }

    async function generateBarcode() {
      try {
        generated.value = true;
        await nextTick();
        const svg = document.getElementById('bc-svg');
        if (!svg) { await nextTick(); return generateBarcode(); }
        JsBarcode(svg, bc.value.content, {
          format:       bc.value.format,
          width:        bc.value.width,
          height:       bc.value.height,
          lineColor:    bc.value.fgColor,
          background:   bc.value.bgColor,
          displayValue: bc.value.displayValue,
          fontSize:     bc.value.fontSize,
          margin:       10,
        });
        await addHistoryBarcode();
        showToast('Code-barres généré avec succès !');
      } catch (e) {
        genError.value = 'Contenu invalide pour ce format (' + bc.value.format + ').';
        showToast('Erreur : ' + genError.value, 'error');
        generated.value = false;
      }
    }

    async function addHistoryQR() {
      await nextTick();
      const dataUrl = await getCompositeQRDataUrl();
      if (dataUrl) pushHistory({ mode: 'qr', content: currentContent.value, format: null, dataUrl });
    }

    async function addHistoryBarcode() {
      svgToPng(dataUrl => {
        pushHistory({ mode: 'barcode', content: currentContent.value, format: bc.value.format, dataUrl });
      });
    }

    function pushHistory(item) {
      history.value = history.value.filter(h => !(h.content === item.content && h.mode === item.mode));
      history.value.push(item);
      if (history.value.length > 9) history.value.shift();
    }

    function restoreHistory(item) {
      switchMode(item.mode);
      if (item.mode === 'qr') qr.value.content = item.content;
      else { bc.value.content = item.content; bc.value.format = item.format || 'CODE128'; }
      nextTick(() => generate());
    }

    function svgToPng(callback) {
      const svg = document.getElementById('bc-svg');
      if (!svg) return;
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width  = svg.width.baseVal.value  || 400;
        canvas.height = svg.height.baseVal.value || 200;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        callback(canvas.toDataURL('image/png'));
      };
      img.src = url;
    }

    // Helper: get base QR canvas from container
    function getBaseQRCanvas() {
      const container = document.getElementById('qr-container');
      if (!container) return null;
      return container.querySelector('canvas');
    }

    // Draw rounded rectangle helper
    function roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    // Generate Composite Image (Frame + QR + Text) for high quality export
    async function getCompositeQRDataUrl() {
      const baseCanvas = getBaseQRCanvas();
      if (!baseCanvas) return null;

      const frame = qr.value.frame;
      if (frame === 'none') {
        return baseCanvas.toDataURL('image/png');
      }

      const qrW = baseCanvas.width;
      const qrH = baseCanvas.height;
      const frameColor = qr.value.frameColor || '#1877f2';
      const text = (qr.value.frameText || 'DOWNLOAD').toUpperCase();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const pos = qr.value.framePosition || (frame === 'scanme' ? 'top' : 'bottom');

      if (frame === 'download') {
        const pad = 28;
        const borderW = 8;
        const bubbleH = 54;
        const bubbleGap = 16;
        canvas.width = qrW + pad * 2;
        canvas.height = qrH + pad * 2 + bubbleH + bubbleGap;
        const cardH = qrH + pad * 2;
        const bW = Math.max(160, ctx.measureText(text).width + 80);
        const bX = (canvas.width - bW) / 2;

        if (pos === 'bottom') {
          // Card bg & border
          ctx.fillStyle = qr.value.bgColor || '#ffffff';
          roundRect(ctx, borderW/2, borderW/2, canvas.width - borderW, cardH - borderW, 26);
          ctx.fill();
          ctx.lineWidth = borderW;
          ctx.strokeStyle = frameColor;
          ctx.stroke();

          // Draw QR
          ctx.drawImage(baseCanvas, pad, pad);

          // Draw bubble banner at bottom
          const bY = cardH + bubbleGap;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 - 12, bY);
          ctx.lineTo(canvas.width / 2, bY - 12);
          ctx.lineTo(canvas.width / 2 + 12, bY);
          ctx.fillStyle = frameColor;
          ctx.fill();

          roundRect(ctx, bX, bY, bW, bubbleH, 12);
          ctx.fillStyle = frameColor;
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 22px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, canvas.width / 2, bY + bubbleH / 2);
        } else {
          // Bubble at top
          const cardY = bubbleH + bubbleGap;
          ctx.fillStyle = qr.value.bgColor || '#ffffff';
          roundRect(ctx, borderW/2, cardY + borderW/2, canvas.width - borderW, cardH - borderW, 26);
          ctx.fill();
          ctx.lineWidth = borderW;
          ctx.strokeStyle = frameColor;
          ctx.stroke();

          // Draw QR
          ctx.drawImage(baseCanvas, pad, cardY + pad);

          // Bubble at top
          const bY = 0;
          roundRect(ctx, bX, bY, bW, bubbleH, 12);
          ctx.fillStyle = frameColor;
          ctx.fill();

          // Pointer pointing down
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 - 12, bubbleH);
          ctx.lineTo(canvas.width / 2, bubbleH + 12);
          ctx.lineTo(canvas.width / 2 + 12, bubbleH);
          ctx.fillStyle = frameColor;
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 22px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, canvas.width / 2, bY + bubbleH / 2);
        }

      } else if (frame === 'rateus') {
        const pad = 24;
        const borderW = 8;
        const bannerH = 58;
        canvas.width = qrW + pad * 2;
        canvas.height = qrH + pad + bannerH;

        ctx.save();
        roundRect(ctx, borderW/2, borderW/2, canvas.width - borderW, canvas.height - borderW, 28);
        ctx.fillStyle = qr.value.bgColor || '#ffffff';
        ctx.fill();
        ctx.lineWidth = borderW;
        ctx.strokeStyle = frameColor;
        ctx.stroke();
        ctx.clip();

        if (pos === 'bottom') {
          ctx.drawImage(baseCanvas, pad, pad);
          const bY = canvas.height - bannerH;
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, bY, canvas.width, bannerH);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, canvas.width / 2, bY + bannerH / 2);
        } else {
          ctx.fillStyle = frameColor;
          ctx.fillRect(0, 0, canvas.width, bannerH);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, canvas.width / 2, bannerH / 2);
          ctx.drawImage(baseCanvas, pad, bannerH + pad/2);
        }
        ctx.restore();

      } else if (frame === 'scanme') {
        const pad = 30;
        const extra = 30;
        const borderW = 8;
        canvas.width = qrW + pad * 2;
        canvas.height = qrH + pad * 2 + extra;

        const pillW = Math.max(140, ctx.measureText(text).width + 60);
        const pillH = 36;
        const pillX = (canvas.width - pillW) / 2;

        if (pos === 'top') {
          ctx.fillStyle = qr.value.bgColor || '#ffffff';
          roundRect(ctx, borderW/2, extra, canvas.width - borderW, canvas.height - extra - borderW, 28);
          ctx.fill();
          ctx.lineWidth = borderW;
          ctx.strokeStyle = frameColor;
          ctx.stroke();

          ctx.drawImage(baseCanvas, pad, pad + extra);

          const pillY = extra - pillH / 2;
          roundRect(ctx, pillX, pillY, pillW, pillH, 18);
          ctx.fillStyle = frameColor;
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, canvas.width / 2, pillY + pillH / 2);
        } else {
          ctx.fillStyle = qr.value.bgColor || '#ffffff';
          roundRect(ctx, borderW/2, borderW/2, canvas.width - borderW, canvas.height - extra - borderW, 28);
          ctx.fill();
          ctx.lineWidth = borderW;
          ctx.strokeStyle = frameColor;
          ctx.stroke();

          ctx.drawImage(baseCanvas, pad, pad);

          const pillY = canvas.height - extra - pillH / 2;
          roundRect(ctx, pillX, pillY, pillW, pillH, 18);
          ctx.fillStyle = frameColor;
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, canvas.width / 2, pillY + pillH / 2);
        }

      } else if (frame === 'simple') {
        // Simple rounded border
        const pad = 24;
        const borderW = 8;
        canvas.width = qrW + pad * 2;
        canvas.height = qrH + pad * 2;

        ctx.fillStyle = qr.value.bgColor || '#ffffff';
        roundRect(ctx, borderW/2, borderW/2, canvas.width - borderW, canvas.height - borderW, 26);
        ctx.fill();
        ctx.lineWidth = borderW;
        ctx.strokeStyle = frameColor;
        ctx.stroke();

        ctx.drawImage(baseCanvas, pad, pad);

      } else if (frame === 'circle') {
        // Circular badge frame
        const pad = 44;
        const borderW = 8;
        const radius = (qrW + pad * 2) / 2;
        canvas.width = radius * 2;
        canvas.height = radius * 2;

        ctx.fillStyle = qr.value.bgColor || '#ffffff';
        ctx.beginPath();
        ctx.arc(radius, radius, radius - borderW/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = borderW;
        ctx.strokeStyle = frameColor;
        ctx.stroke();

        ctx.drawImage(baseCanvas, pad, pad);
      }

      return canvas.toDataURL('image/png');
    }

    async function downloadImage(ext = 'png') {
      if (mode.value === 'qr') {
        if (ext === 'svg' && qrCodeStylingInstance) {
          qrCodeStylingInstance.download({ name: 'qrcode_genecode', extension: 'svg' });
          showToast('Téléchargement SVG démarré !');
          return;
        }
        const dataUrl = await getCompositeQRDataUrl();
        if (!dataUrl) return;
        const link = document.createElement('a');
        link.download = 'qrcode_genecode.png';
        link.href = dataUrl;
        link.click();
        showToast('Téléchargement PNG démarré !');
      } else {
        svgToPng(dataUrl => {
          const link = document.createElement('a');
          link.download = 'barcode_genecode.png';
          link.href = dataUrl;
          link.click();
          showToast('Téléchargement démarré !');
        });
      }
    }

    async function copyToClipboard() {
      const doCopy = (dataUrl) => {
        fetch(dataUrl).then(r => r.blob()).then(blob => {
          if (navigator.clipboard && window.ClipboardItem) {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          }
        });
        copied.value = true;
        showToast('Image copiée dans le presse-papiers !');
        setTimeout(() => { copied.value = false; }, 2000);
      };
      if (mode.value === 'qr') {
        const dataUrl = await getCompositeQRDataUrl();
        if (dataUrl) doCopy(dataUrl);
      } else {
        svgToPng(doCopy);
      }
    }

    function resetForm() {
      if (mode.value === 'qr') {
        qr.value = {
          content: 'https://example.com',
          ecl: 'M',
          size: 280,
          margin: 8,
          dotsType: 'rounded',
          cornersSquareType: 'extra-rounded',
          cornersDotType: 'dot',
          colorType: 'single',
          fgColor: '#1877f2',
          gradColor2: '#00d4aa',
          gradRotation: 45,
          customEyes: false,
          eyeColor: '#1877f2',
          eyeDotColor: '#1877f2',
          transparentBg: false,
          bgColor: '#ffffff',
          logo: '',
          logoSize: 0.35,
          logoMargin: 6,
          hideBackgroundDots: true,
          frame: 'download',
          framePosition: 'bottom',
          frameText: 'DOWNLOAD',
          frameColor: '#1877f2',
        };
      } else {
        bc.value = { content: 'GENECODE-2025', format: 'CODE128', width: 2, height: 100, fgColor: '#000000', bgColor: '#ffffff', displayValue: true, fontSize: 16 };
      }
      generated.value = false;
      genError.value = '';
      autoGenerate();
    }

    // Initial setup on mount
    nextTick(() => {
      generate();
    });

    return {
      mode, qr, qrTab, bc, generated, genError, copied, toasts, history,
      currentContent, COLOR_PALETTES, ICONS,
      switchMode, generate, autoGenerate,
      prefillEmail, prefillPhone, prefillWifi,
      onFormatChange, selectBuiltinLogo, removeLogo, onLogoUpload,
      applyColorPalette, syncFrameColor, onFgColorChange,
      downloadImage, copyToClipboard, resetForm, restoreHistory,
    };
  }
}).mount('#app');
