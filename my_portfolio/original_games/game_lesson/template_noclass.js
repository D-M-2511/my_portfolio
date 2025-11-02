let canvas, g;
let characterPosX, characterPosY, characterImage, characterR;
let speed, acceleration;
let enemyPosX, enemyPosY, enemyImage, enemySpeed,enemyR;
let score;
let scene;//現在のシーンが何かを表す変数
let frameCount;
let bound;

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
    characterPosX = 100;
    characterPosY = 480;
    characterR = 16;
    characterImage = new Image();
    characterImage.src = "dinosaur.png";
    speed = 0;
    acceleration = 0;

    enemyPosX = 600;
    enemyPosY = 470;
    enemyR = 16;
    enemyImage = new Image();
    enemyImage.src ="kuri.png";
    enemySpeed = 5;

    score = 0;
    frameCount = 0;
    bound = false;
    scene = Scenes.GameMain;//シーンの初期設定
}

function keydown(e){
    if(characterPosY===480){
    speed = -17;
    acceleration = 0.7;
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
    speed += acceleration;
    characterPosY += speed;
    if(characterPosY>480){
        characterPosY = 480;
        speed = 0;
        acceleration = 0;
    }
    enemyPosX -= enemySpeed;
    if(enemyPosX<-100){
        enemyPosX = 600;
        score += 100;
    }
    let diffX = characterPosX - enemyPosX;
    let diffY = characterPosY - enemyPosY;
    let distance = Math.sqrt(diffX**2 + diffY**2);
    if(distance<characterR+enemyR){
        scene = Scenes.GameOver;
        speed = -20;
        acceleration = 0.5;
        frameCount = 0;
    }//それ以外の場合の１つとして、ゲームオーバーシーンの設定
    }else if(scene==Scenes.GameOver){
        speed += acceleration;
        characterPosY += speed;

        if(characterPosX<20||characterPosX>460){
            bound =!bound;
        }
        if(bound){
            characterPosX += 30;
        }else{
            characterPosX -= 30;
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
        characterImage,
        characterPosX - (characterImage.width*scale)/2,
        characterPosY - (characterImage.height*scale),
        characterImage.width*scale,
        characterImage.height*scale
    );
    g.drawImage(
        enemyImage,
        enemyPosX - (enemyImage.width*scale2)/2,
        enemyPosY - (enemyImage.height*scale2),
        enemyImage.width*scale2,
        enemyImage.height*scale2
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
        g.translate(characterPosX, characterPosY);
        g.rotate(((frameCount%30)*Math.PI*2)/30);
        g.drawImage(
        characterImage,
        - (characterImage.width*scale)/2,
        - (characterImage.height*scale),
        characterImage.width*scale + frameCount,
        characterImage.height*scale + frameCount
    );
    g.restore();
    }

    // ゲームオーバーやけど敵キャラは普通に描画する
    g.drawImage(
        enemyImage,
        enemyPosX - (enemyImage.width*scale2)/2,
        enemyPosY - (enemyImage.height*scale2),
        enemyImage.width*scale2,
        enemyImage.height*scale2
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
