// Função para converter HEX para RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Função para converter RGB para HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
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
    return { h: h * 360, s: s * 100, l: l * 100 };
}

// Função para converter RGB para CMYK
function rgbToCmyk(r, g, b) {
    const c = 1 - (r / 255);
    const m = 1 - (g / 255);
    const y = 1 - (b / 255);
    const k = Math.min(c, m, y);
    return {
        c: (c - k) / (1 - k) * 100,
        m: (m - k) / (1 - k) * 100,
        y: (y - k) / (1 - k) * 100,
        k: k * 100
    };
}

// Função para converter RGB para LAB
function rgbToLab(r, g, b) {
    const xyz = rgbToXyz(r, g, b);
    return xyzToLab(xyz.x, xyz.y, xyz.z);
}

// Função para converter RGB para LUV
function rgbToLuv(r, g, b) {
    const xyz = rgbToXyz(r, g, b);
    return xyzToLuv(xyz.x, xyz.y, xyz.z);
}

// Função para converter RGB para HWB
function rgbToHwb(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    const w = Math.min(r, g, b) / 255;
    const wb = 1 - Math.max(r, g, b) / 255;
    return { h: hsl.h, w: w * 100, wb: wb * 100 };
}

// Funções auxiliares para conversões
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

// Função principal para converter HEX para todas as outras
function convertHex(hex) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
    const luv = rgbToLuv(rgb.r, rgb.g, rgb.b);
    const hwb = rgbToHwb(rgb.r, rgb.g, rgb.b);
    return { rgb, hsl, cmyk, lab, luv, hwb };
}