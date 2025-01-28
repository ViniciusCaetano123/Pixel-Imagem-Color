
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; 
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    console.log(h,s,l)
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}


function rgbToCmyk(r, g, b) {
    const c = 1 - (r / 255);
    const m = 1 - (g / 255);
    const y = 1 - (b / 255);
    const k = Math.min(c, m, y);
    return `(${((c - k) / (1 - k) * 100).toFixed(0)}%, ${((m - k) / (1 - k) * 100).toFixed(0)}%, ${((y - k) / (1 - k) * 100).toFixed(0)}%, ${(k * 100).toFixed(0)}%)`;
}


function rgbToLab(r, g, b) {
    const xyz = rgbToXyz(r, g, b);
    const lab = xyzToLab(xyz.x, xyz.y, xyz.z);
    return `(${lab.l.toFixed(0)}, ${lab.a.toFixed(0)}, ${lab.b.toFixed(0)})`;
}


function rgbToLuv(r, g, b) {
    const xyz = rgbToXyz(r, g, b);
    const luv = xyzToLuv(xyz.x, xyz.y, xyz.z);
    return `(${luv.l.toFixed(0)}, ${luv.u.toFixed(0)}, ${luv.v.toFixed(0)})`;
}


function rgbToHwb(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    const w = Math.min(r, g, b) / 255;
    const wb = 1 - Math.max(r, g, b) / 255;
    return `(${hsl.h}, ${(w * 100).toFixed(0)}%, ${(wb * 100).toFixed(0)}%)`;
}


function rgbToXyz(r, g, b) {
    r = r / 255; g = g / 255; b = b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    return { x: x * 100, y: y * 100, z: z * 100 };
}

function xyzToLab(x, y, z) {
    x /= 95.047; y /= 100; z /= 108.883;
    x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
    y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
    z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);
    const l = (116 * y) - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);
    return { l, a, b };
}

function xyzToLuv(x, y, z) {
    const refX = 95.047, refY = 100, refZ = 108.883;
    const u = (4 * x) / (x + (15 * y) + (3 * z));
    const v = (9 * y) / (x + (15 * y) + (3 * z));
    const yr = y / refY;
    const l = yr > 0.008856 ? (116 * Math.pow(yr, 1/3)) - 16 : 903.3 * yr;
    const refU = (4 * refX) / (refX + (15 * refY) + (3 * refZ));
    const refV = (9 * refY) / (refX + (15 * refY) + (3 * refZ));
    const uPrime = 13 * l * (u - refU);
    const vPrime = 13 * l * (v - refV);
    return { l, u: uPrime, v: vPrime };
}
const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
    const r = Math.round(f(0) * 255);
    const g = Math.round(f(8) * 255);
    const b = Math.round(f(4) * 255);
    return rgbToHex(r, g, b);
}

function convertHex(hex) {
    const rgbObj = hexToRgb(hex);
    const rgb = `(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`;
    const hslObj = rgbToHsl(rgbObj.r, rgbObj.g, rgbObj.b);
    const hsl = `(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`;
    const cmyk = rgbToCmyk(rgbObj.r, rgbObj.g, rgbObj.b);
    const lab = rgbToLab(rgbObj.r, rgbObj.g, rgbObj.b);
    const luv = rgbToLuv(rgbObj.r, rgbObj.g, rgbObj.b);
    const hwb = rgbToHwb(rgbObj.r, rgbObj.g, rgbObj.b);
    return { rgb, hsl, cmyk, lab, luv, hwb };
}