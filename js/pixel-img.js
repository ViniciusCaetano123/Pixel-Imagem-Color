

const carregarVariaveis = () => {
    const imageFileLoader = document.getElementById('file-img');
    const canvasImg = document.getElementById('canvas-img');
    const ctx = canvasImg.getContext('2d',{ willReadFrequently: true });
    const colorDisplay = document.getElementById('color-display');
    const hexInputColor = document.getElementById('hex-color');
    const pixelColorResultado = document.getElementById('pixel-resultado');
    return { hexInputColor,imageFileLoader, canvasImg, ctx, colorDisplay,pixelColorResultado };
}

const { hexInputColor,imageFileLoader, canvasImg, ctx, colorDisplay ,pixelColorResultado} = carregarVariaveis();
const default_hex = '#ff7f50';
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
        canvasImg.height = 400;
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
    console.log(text)
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

imageFileLoader.addEventListener('change', handleImageChange);

const { rgb, hsl, cmyk, lab, luv, hwb } = convertHex(default_hex);  
createColorElement('HEX',default_hex );
createColorElement('RGB', rgb);
createColorElement('HSL', hsl);
createColorElement('CMYK',cmyk);
createColorElement('LAB',lab);
createColorElement('LUV',luv);
createColorElement('HWB',hwb);


const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}