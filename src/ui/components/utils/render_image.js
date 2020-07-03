export default function RenderImage(image, fallbackImage = '/assets/img/logo.png', showFallback = true) {

    if(fallbackImage === '' || fallbackImage === null) {
        fallbackImage = '/assets/img/logo.png'
    }

    const onerror = (showFallback) ?
        `this.onerror=null;this.src=this.dataset.fallbackImage;this.width=300;this.height=300` :
        `this.onerror=null;this.style.display=none`

    return (
    <div dangerouslySetInnerHTML={{
        __html: `<img onError="${onerror}" data-fallback-image=${fallbackImage} src="${image}" />`
    }}>
    </div>
    )
}
