export async function loadSpriteAsync() {
    let response = await fetch('sprite.svg').then(res=>res.clone())
    let spriteHtml = await response.text()
    let node = document.querySelector('.sprite')!
    node.innerHTML = spriteHtml
    document.body.appendChild(node)
}