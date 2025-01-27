


const loadImgPlaceholder = () => {     
     const imgFirst = new Image();
    imgFirst.width = 150;
    imgFirst.height = 100;
    imgFirst.src = './images/image-placeholder.svg';
    imgFirst.onload = () => imgOnLoad(imgFirst, imgFirst.width,  imgFirst.height);
}

loadImgPlaceholder()

   
    
