
async function carregarLocales(lang='pt-br') {
    try{
        const response = await fetch(`./i18/locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Error ao carregar arquivos`);
        }
        return await response.json();
    }catch(err){
        console.error(err)
    }
    
}
function aplicarTraducao(locale){ 
    document.title = locale.titleHead;
    document.getElementById('btn-file-img').textContent = locale.btnFileImage; 
}
async function main(){
    const userLocale = navigator.language || navigator.userLanguage ;   
    const locale = await carregarLocales(userLocale.toLowerCase());   
    aplicarTraducao(locale)
}

main()