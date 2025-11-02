// https://www.youtube.com/watch?v=14pTZU14ntg&list=PL80OIWUJ1J0GLq9SY9ozePR9kax3Uy6Xp&index=4
// 参考動画。ここで挫折(2025/10/27)


let canvas, g;
let player;
let enemy;
let score;
let scene;//現在のシーンが何かを表す変数
let frameCount;
let bound;

class Sprite{
    image = null;
    posx = 0;
    posy = 0;
    speed = 0;
    acceleration = 0;
    r = 0;

    //描画処理
    draw(g){
        g.drawImage(
            this.image,
            this.posx - this.image.width / 2,
            this.posy - this.image.height
        );
    }
}

//シーンの定義
//連想配列。Scenes.GameOver のように、
// .で区切って表現すると、「GameOver」の文字列を取得
const Scenes = {
    GameMain: "GameMain",
    GameOver: "GameOver",
};

onload = function(){
    canvas = document.getElementById("gamecanvas");
    g=canvas.getContext("2d");
    init();
    document.onkeydown=keydown;
    setInterval("gameloop()",16);
};

function init(){
    player = new Sprite();
    player.posx = 100;
    player.posy = 480;
    player.r = 16;
    player.image = new Image();
    player.image.src = "dinosaur.png";
    player.speed = 0;
    player.acceleration = 0;

    enemy = new Sprite();

    enemy.posx = 600;
    enemy.posy = 470;
    enemy.r = 16;
    enemy.image = new Image();
    enemy.image.src ="kuri.png";
    enemy.speed = 5;
    enemy.acceleration = 0;

    score = 0;
    frameCount = 0;
    bound = false;
    scene = Scenes.GameMain;//シーンの初期設定
}

function keydown(e){
    if(player.posy===480){
    player.speed = -17;
    player.acceleration = 0.7;
    }
}

function gameloop(){
    update();
    draw();
}

function update(){
    frameCount++;
    //今まで書いた処理を、シーンがメインの時のみに限定
    if(scene==Scenes.GameMain){
    player.speed += player.acceleration;
    player.posy += player.speed;
    if(player.posy>480){
        player.posy = 480;
        player.speed = 0;
        player.acceleration = 0;
    }
    enemy.posx -= enemy.speed;
    if(enemy.posx<-100){
        enemy.posx = 600;
        score += 100;
    }
    let diffX = player.posx - enemy.posx;
    let diffY = player.posy - enemy.posy;
    let distance = Math.sqrt(diffX**2 + diffY**2);
    if(distance<player.r+enemy.r){
        scene = Scenes.GameOver;
        player.speed = -20;
        player.acceleration = 0.5;
        frameCount = 0;
    }//それ以外の場合の１つとして、ゲームオーバーシーンの設定
    }else if(scene==Scenes.GameOver){
        player.speed += player.acceleration;
        player.posy += player.speed;

        if(player.posx<20||player.posx>460){
            bound =!bound;
        }
        if(bound){
            player.posx += 30;
        }else{
            player.posx -= 30;
        }
        if(frameCount>60*4){
            init();
        }
    }
}

const scale = 0.1;
const scale2 = 0.2; 
function draw(){
    g.imageSmoothingEnabled = false;
    //メイン画面での描画
    if(scene == Scenes.GameMain){
    g.fillStyle = "#e8e4e4ff"
    g.fillRect(0,0,480,480);

    g.drawImage(
        player.image,
        player.posx - (player.image.width*scale)/2,
        player.posy - (player.image.height*scale),
        player.image.width*scale,
        player.image.height*scale
    );
    g.drawImage(
        enemy.image,
        enemy.posx - (enemy.image.width*scale2)/2,
        enemy.posy - (enemy.image.height*scale2),
        enemy.image.width*scale2,
        enemy.image.height*scale2
    );

    //メイン画面でのスコア表示
    g.fillStyle = "#d31313d5";
    g.font = "16pt Arial";
    let scoreLabel = "現在の得点："+score+"点";
    let scoreLabelWidth = g.measureText(scoreLabel).width;
    g.fillText(scoreLabel, 460-scoreLabelWidth, 40);

    //メイン画面での経過時間表示
    g.fillStyle = "#160404ff"
    g.font = "16pt Arial";
    let timeLabel = frameCount;
    let timeLabelWidth = g.measureText(timeLabel).width;
    g.fillText(timeLabel, 20, 40);

    // ゲームオーバー画面での表示
    }else if (scene == Scenes.GameOver){
    g.fillStyle = "#e8e4e4ff"
    g.fillRect(0,0,480,480);
    // ゲームオーバー時、自キャラをぶっ飛ばす
    if(frameCount<120){
        g.save();
        g.translate(player.posx, player.posy);
        g.rotate(((frameCount%30)*Math.PI*2)/30);
        g.drawImage(
        player.image,
        - (player.image.width*scale)/2,
        - (player.image.height*scale),
        player.image.width*scale + frameCount,
        player.image.height*scale + frameCount
    );
    g.restore();
    }

    // ゲームオーバーやけど敵キャラは普通に描画する
    g.drawImage(
        enemy.image,
        enemy.posx - (enemy.image.width*scale2)/2,
        enemy.posy - (enemy.image.height*scale2),
        enemy.image.width*scale2,
        enemy.image.height*scale2
    );
    //得点も普通に描画する
    g.fillStyle = "#d31313d5";
    g.font = "16pt Arial";
    let scoreLabel = "現在の得点："+score+"点";
    let scoreLabelWidth = g.measureText(scoreLabel).width;
    g.fillText(scoreLabel, 460-scoreLabelWidth, 40);

    //GAMEOVER表示
    g.fillStyle = "#390505d5";
    g.font = "40pt Arial";
    let gameoverLabel = "GAME OVER";
    let gameoverLabelWidth = g.measureText(gameoverLabel).width;
    g.fillText(gameoverLabel, 400-gameoverLabelWidth, 240);
    }
}
