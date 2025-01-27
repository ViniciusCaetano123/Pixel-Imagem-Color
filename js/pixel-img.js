
const carregarVariaveis = () => {
    const imageLoader = document.getElementById('file-img');
    const canvasImg = document.getElementById('canvas-img');
    const ctx = canvasImg.getContext('2d',{ willReadFrequently: true });
    const colorDisplay = document.getElementById('color-display');
    const hexInputColor = document.getElementById('hex-color');
    return { hexInputColor,imageLoader, canvasImg, ctx, colorDisplay };
}

const { hexInputColor,imageLoader, canvasImg, ctx, colorDisplay } = carregarVariaveis();
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
    imageLoader.click();
}
const getPixel = (e)=>{
    const rect = canvasImg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b, a] = pixel;
    const hexColor = rgbToHex(r, g, b);
    hexInputColor.value = hexColor;
    colorDisplay.style.backgroundColor = hexColor;
}

canvasImg.addEventListener("click", (e) => {
    if(isListeningCanvasImg){
        canvasImg.addEventListener("mousemove", getPixel);
    }else{
        const { rgb, hsl, cmyk, lab, luv, hwb } = convertHex(hexInputColor.value);       
        canvasImg.removeEventListener("mousemove",getPixel);
    }
    isListeningCanvasImg = !isListeningCanvasImg;
});


const imgOnLoad = (img, swidth = 500, sheight = 500) => {
    canvasImg.width = swidth;
    canvasImg.height = sheight;     
    ctx.drawImage(img, 0, 0, swidth, sheight);
    canvasImg.style.display = 'block';
}

const readerFileOnload = (event) => {
    const img = new Image();
    img.onload = () => imgOnLoad(img, 550, 400);
    img.src = event.target.result;
}

const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = readerFileOnload;
    reader.readAsDataURL(e.target.files[0]);
}

imageLoader.addEventListener('change', handleImageChange);


const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}