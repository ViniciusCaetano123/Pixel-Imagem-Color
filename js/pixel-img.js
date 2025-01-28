

const carregarVariaveis = () => {
    const imageFileLoader = document.getElementById('file-img');
    const canvasImg = document.getElementById('canvas-img');
    const ctx = canvasImg.getContext('2d',{ willReadFrequently: true });
    const colorDisplay = document.getElementById('color-display');
    const hexInputColor = document.getElementById('hex-color');
    const pixelColorResultado = document.getElementById('pixel-resultado');
    const palette = document.getElementById('palette');
    const relatedPalette = document.getElementById('related-palette');
    return { palette,relatedPalette,hexInputColor,imageFileLoader, canvasImg, ctx, colorDisplay,pixelColorResultado };
}

const {palette,relatedPalette, hexInputColor,imageFileLoader, canvasImg, ctx, colorDisplay ,pixelColorResultado} = carregarVariaveis();
const default_hex = '#ffe4c4';
let isListeningCanvasImg = false;
const colorRighrNow = {
    hex: '',
    rgb: '',
    hsl: '',
    hsv: '',
    cmyk: ''
}
const abrirFolder = () => {
    
    canvasImg.addEventListener("mousemove", getPixel);
    imageFileLoader.click();
    isListeningCanvasImg = false;
}
const getPixel = (e)=>{ 
    const rect = canvasImg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b, a] = pixel;
    const hexColor = rgbToHex(r, g, b);   
    const { rgb, hsl, cmyk, lab, luv, hwb } = convertHex(hexColor);
    updateColorElement('HEX', hexColor);
    updateColorElement('RGB', rgb);
    updateColorElement('HSL', hsl);
    updateColorElement('CMYK', cmyk);
    updateColorElement('LAB', lab);
    updateColorElement('LUV', luv);
    updateColorElement('HWB', hwb);
    generateRelatedPalette(hexColor);
}

canvasImg.addEventListener("click", (e) => {
    if(isListeningCanvasImg){
        canvasImg.addEventListener("mousemove", getPixel);
    }else{  
        canvasImg.removeEventListener("mousemove",getPixel);
    }
    isListeningCanvasImg = !isListeningCanvasImg;
});


const imgOnLoad = (img, swidth, sheight) => {
    if (swidth > 600) {
        canvasImg.width = 600;
        canvasImg.height = 420;
    }else{
        canvasImg.width = swidth;
        canvasImg.height = sheight;     
    }    
    ctx.drawImage(img, 0, 0,  canvasImg.width, canvasImg.height);
    canvasImg.style.display = 'block';
}

const readerFileOnload = (event) => {
    const img = new Image();
    img.onload = () => imgOnLoad(img, img.width, img.height);
    img.src = event.target.result;
}

const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = readerFileOnload;
    reader.readAsDataURL(e.target.files[0]);
}

const updateColorElement = (name, color) => {
    const bgColorPixel = document.getElementById(`${name.toLowerCase()}`);
    const text = document.getElementById(`input-${name}`); 
    text.value = color;
    bgColorPixel.style.backgroundColor = name == 'HEX' ? color : name+color;
}

const createColorElement = (name,color) => {
    const colorContainer = document.createElement('div');
    colorContainer.className = 'color-container';
    const bgColorPixel = document.createElement('div');
    bgColorPixel.className = `bgColorPixel`;
    bgColorPixel.id = name.toLowerCase();  
    bgColorPixel.style.backgroundColor = name == 'HEX' ? color : name+color;
    const imgCopy = document.createElement('img');
    imgCopy.src = './images/copy.svg';
    const create = createColorLabel(name, color); 
    colorContainer.appendChild(bgColorPixel);
    colorContainer.appendChild(create);
    colorContainer.appendChild(imgCopy);
    pixelColorResultado.appendChild(colorContainer);
}

const createColorLabel = (labelText, value) => {
    const colorPixel = document.createElement('div');
    colorPixel.className = 'color-pixel';
   
    const label = document.createElement('label');
    label.textContent = labelText;

    const input = document.createElement('input');
    input.id =`input-${labelText}`;
    input.type = 'text';
    input.value = value;
    input.readOnly = true;

    colorPixel.appendChild(label);
    colorPixel.appendChild(input);

    return colorPixel;
}
function luminance(r, g, b) {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Função para determinar se a cor é escura
function isDarkColor(hex) {
    const { r, g, b } = hexToRgb(hex);
    const lum = luminance(r, g, b);
    return lum < 0.5;
}
const generateRelatedPalette = (hex) => {
    relatedPalette.innerHTML = ''; 

    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  
    const analogous1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
    const analogous2 = hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l);

 
    const complementary = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);

    const triadic1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
    const triadic2 = hslToHex((hsl.h - 120 + 360) % 360, hsl.s, hsl.l);

   
    [analogous1, analogous2, complementary, triadic1, triadic2].forEach(color => {
        const paletteColor = document.createElement('div');
        const paletteColorSpan = document.createElement('span');
        paletteColor.className = 'palette-color';
        paletteColorSpan.textContent = color;
        paletteColorSpan.className = 'palette-color-span';
        if (isDarkColor(hex)) {
            paletteColorSpan.style.color = '#fff';
        } else {
            paletteColorSpan.style.color = '#000';
        }
        paletteColor.appendChild(paletteColorSpan);
        paletteColor.style.backgroundColor = color;
        relatedPalette.appendChild(paletteColor);
    });
}

imageFileLoader.addEventListener('change', handleImageChange);

const { rgb, hsl, cmyk, lab, luv, hwb } = convertHex(default_hex);  
createColorElement('HEX',default_hex );
createColorElement('RGB', rgb);
createColorElement('HSL', hsl);
createColorElement('CMYK',cmyk);
createColorElement('LAB',lab);
createColorElement('LUV',luv);
createColorElement('HWB',hwb);
generateRelatedPalette('ffe4c4');



