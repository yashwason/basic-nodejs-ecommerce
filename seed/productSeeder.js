const Product = require(`../models/product`);
const mongoose = require(`mongoose`);

mongoose.connect(`mongodb://localhost:27017/demo_shop`, {
	useNewUrlParser: true
});

const products = [
    new Product({
        imagePath: `https://images.g2a.com/newlayout/470x470/1x1x0/b99b28590aea/5bc9c521ae653a5fd7677389`,
        title: `Red Dead Redemption`,
        description: `The best and most realistic game ever!`,
        price: 25
    }),
    new Product({
        imagePath: `https://store.playstation.com/store/api/chihiro/00_09_000/container/US/en/99/UP9000-CUSA02299_00-MARVELSSPIDERMAN//image?_version=00_09_000&platform=chihiro&w=720&h=720&bg_color=000000&opacity=100`,
        title: `Spiderman PS4`,
        description: `Highest rated superhero game ever!`,
        price: 20
    }),
    new Product({
        imagePath: `https://i.ytimg.com/vi/Q51nuWHRaRY/hqdefault.jpg`,
        title: `Fortnite`,
        description: `The game all streamers love`,
        price: 5
    }),
    new Product({
        imagePath: `https://ae01.alicdn.com/kf/HTB1jWWblGagSKJjy0Fgq6ARqFXau/playerunknown-s-battlegrounds-PUBG-poster-for-HD-canvas-poster-decoration-painting-with-solid-wood-hanging-scroll.jpg_640x640.jpg`,
        title: `PUBG Mobile`,
        description: `The game that has destroyed India's youth`,
        price: 15
    }),
    new Product({
        imagePath: `https://images.igdb.com/igdb/image/upload/t_cover_big/co1j9f.jpg`,
        title: `Shadow of the Tomb Raider `,
        description: `Return to the world of Shadow of the Tomb Raider and solve a mystery behind Lara Croft's greatest foe.`,
        price: 18
    }),
    new Product({
        imagePath: `https://images.igdb.com/igdb/image/upload/t_cover_big/co1i9k.jpg`,
        title: `Draugen`,
        description: `Draugen is a first-person psychological horror adventure, set amongst the deep fjords and towering mountains of Norway’s awe-inspiring west coast. `,
        price: 35
    }),
    new Product({
        imagePath: `https://images.igdb.com/igdb/image/upload/t_cover_big/co1i03.jpg`,
        title: `Assassin's Creed`,
        description: `The story arc will be cut into three episodes, with each episode being released roughly every six weeks after the release of the first, and will set players against mythic creatures while they uncover the mysteries of the fabled sunken city of Atlantis.`,
        price: 28
    })
];

for(let i=0; i<products.length; i++){
    products[i].save()
    .then((data) => {
        console.log(data);
        if(i === products.length){
            mongoose.disconnect();
        }
    })
    .catch((err) => {
        console.log(`Error: ${err}`);
    });
}