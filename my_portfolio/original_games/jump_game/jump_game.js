let canvas,g;
// var charaPosX, charaPosY, charaImg, eneImg, enePosX, enePosY;
let speed, acceleration;//ジャンプの勢いとふわっと感
let Time;
onload = function(){
    //描画コンテキストの取得
    canvas = document.getElementById("jump_canvas");
    g = canvas.getContext("2d");
    //初期化
    init();
    //入力処理の指定
    document.onkeydown = keydown;
    //ゲームループの設定 60FPS
    setInterval("gameloop()",16);
};

class Vec2{
    constructor(_x,_y){
        this.x = _x;
        this.y = _y;
    }
    //このベクトルとの和
    add(b){
        let a = this;
        return new Vec2(a.x +b.x,a.y+b.y);
    }
    //このベクトルのスカラー倍
    mul(s){
        let a = this;
        return new Vec2(s*a.x,s*a.y);
    }
    //このベクトルとベクトルbとの内積
    dot(b){
        let a = this;
        return a.x*b.x + a.y*b.y;
    }
    //このベクトルの大きさ
    mag(){
        let a = this;
        return Math.sqrt(a.x**2+a.y**2);
    }
    //このベクトルとベクトルbとの差(bが基準)
    sub(b){
        let a =this;
        return new Vec2(a.x-b.x,a.y-b.y);
    }
    //このベクトルの大きさを１にする（正規化）
    norm(){
        let a = this;
        //return new Vec2(a.x*(1/this.mag(a)),a.y*(1/this.mag(a)));
        return a.mul(1/this.mag(a));
    }
}

class Charactor{
    constructor(_p,_v){
        this.p = _p;//位置ベクトル
        this.v = _v;//速度ベクトル
    }
};

// class Enemy{
//     constructor(_p,_v){
//         this.p = _p;
//         this.v = _v;
//     }
// };

let charactor;
let enemy;

function init() {
    Time = 0;
    speed = 0;
    acceleration = 0;
    charaImg = new Image();
    charaImg.src = "piyo.png";
    eneImg = new Image();
    eneImg.src = "kuri.png";

    // charaPosX = 20;
    // charaPosY = 480;
    charactor = new Charactor(
    new Vec2(20, 480),//自キャラの初期位置
    new Vec2(2, 0)//自キャラの初速度
);
    // enePosX = 450;
    // enePosY = 480;
    enemy = new Charactor(
    new Vec2(450, 480),//敵キャラの初期位置
    new Vec2(-2.5,0)//敵キャラの初速度
);
}

function keydown(e){

    if(charactor.p.y>380&&charactor.p.y<=480){
            speed = -17;
    acceleration = 0.5;

    }    
}

function gameloop(){
    update();
    draw();
    Time +=1;//毎秒60回くらい、Timeに１が足される
}

let vx = 2;//自キャラの速さ
let vx2 = -2.5;//敵キャラの速さ
let ac2 = 0.5;//敵キャラの加速度
function update(){
    //キャラの動き
    charactor.p.x = charactor.p.x + vx;
    // charaPosX = charaPosX + vx;
    if(charactor.p.x>480){
        vx=-vx;
    }
    if(charactor.p.x<20){
        vx=-vx;
    }
    speed = speed + acceleration;
    charactor.p = new Vec2(
        charactor.p.x,
        charactor.p.y+ speed
    )
    // charactor.p.y = charactor.p.y + speed;
    if(charactor.p.y>=480){
        acceleration = 0;
        speed = 0;
        charactor.p.y = 480;
    }
    //敵の動き
    if(Time%300===0){
    vx2 = vx2 + ac2;
    }//だんだん速くしたい

    enemy.p.x += vx2;
    if(enemy.p.x>480){
        vx2=-vx2
        ac2=-ac2;
    }
    if(enemy.p.x<20){
        vx2=-vx2
        ac2=-ac2;
    }
}

const scale = 0.06;//キャラ画像の大きさの倍率
const scale2 =0.15;//敵キャラ画像の大きさの倍率
function draw(){
    //背景
    g.fillStyle = "#84d0b4ff";
    g.fillRect(0,0,500,500);
    //キャラの描画
    g.drawImage(
        charaImg,
        charactor.p.x - charaImg.width * scale / 2,
        charactor.p.y - charaImg.height * scale / 2,
        charaImg.width * scale,
        charaImg.height * scale
    );
    //敵の描画
    g.drawImage(
        eneImg,
        enemy.p.x  - eneImg.width * scale2 /2,
        enemy.p.y - eneImg.height * scale2 /2,
        eneImg.width * scale2,
        eneImg.height * scale2
    );
    
    }
