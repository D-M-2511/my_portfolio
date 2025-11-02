function setup() {
  createCanvas(400, 400);
  for(let i=0; i<12; i++){
  let p = new Vec2(100*((i+1)%4)+40, 50*floor(i/4)+50);
  blocks.push(new Block(p,20));
}

}

class Vec2 {
  constructor(_x,_y){
    this.x = _x;
    this.y = _y;
  }
  add(b){
    let a = this;
    return new Vec2(a.x+b.x, a.y+b.y);
  }
  mul(s){
    let a = this;
    return new Vec2(s*a.x,s*a.y);
  }
  //このベクトルの大きさを求める
  mag(){
    let a = this;
    return sqrt(a.x**2 +a.y**2);
  }
  //このベクトルと引数のベクトルbの差を求める
  sub(b){
    let a = this;
    return new Vec2(a.x-b.x, a.y-b.y);
  }
  //正規化
  norm(){
    let a = this;
    return a.mul(1/a.mag());
  }
  //内積
  dot(b){
    let a = this;
    return a.x*b.x + a.y*b.y;
  }
  //このベクトルの反射ベクトルを求める
  //wは法線ベクトル。大きさは不問
  reflect(w){
    let v = this;
    let cosTheta = v.mul(-1).dot(w)/(v.mul(-1).mag()*w.mag());
    let n = w.norm().mul(v.mag()*cosTheta);
    let r = v.add(n.mul(2));
    return r;

  }
}


class Ball{
  constructor(_p,_v,_r){
    this.p = _p;
    this.v = _v;
    this.r = _r;
  }
}

class Block{
  constructor(_p,_r){
    this.p = _p;//ブロックの中心の位置ベクトル
    this.r = _r;//ブロックの半径
  }
}

class Paddle {
  constructor(_p,_r){
    this.p = _p;
    this.r = _r;
  }
}

//これがdraw関数の中にあると、毎フレーム位置が(100,20)に戻されるので外に
  //let ballP = new Vec2(100,20);//ボールの位置を宣言しただけ
  //let ballV = new Vec2(120,40);// ボールの速度ベクトル(1s)あたりの成分
//反射する時に値を変えたいので、スコープの外に避難
//この辺りは下のクラスに吸収された

//ボールを作る
let ball = new Ball(
  new Vec2(100,220),
  new Vec2(200,80),
  20
  );

//ブロックを作る
let blocks = [];

//パドルを作る
let paddle = new Paddle(new Vec2(200,320),30);


//let block = new Block(new Vec2(200,200),150);

function draw(){
  ball.p = ball.p.add(ball.v.mul(1/60));
//  ball.p = Vec2Add(ball.p,Vec2Mul(ball.v,1/60));//ボールを動かす。1fあたりに直す
  

  if(ball.p.x>(400-20/2)||ball.p.x<(20/2)){
    ball.v.x = -ball.v.x;
  }
  if(ball.p.y<(20/2)){
    ball.v.y = -ball.v.y;
  }
  
  //ボールとブロックの衝突判定
  for(let block of blocks){
  let d = block.p.sub(ball.p).mag(); //距離
  if(d<(ball.r+block.r)){
    let w = ball.p.sub(block.p);
    let r = ball.v.reflect(w)
    ball.v = r;
    blocks.splice(blocks.indexOf(block),1);
  }
  }
  
  //パドルの操作
  paddle.p.x = mouseX;
  //パドルとボールの衝突判定
  let d = paddle.p.sub(ball.p).mag(); //距離
  if(d<(ball.r+paddle.r)){
    let w = ball.p.sub(paddle.p);
    let r = ball.v.reflect(w)
    ball.v = r;
  }
  
  background(220);//背景を塗りつぶす
  //パドルを描画
  circle(paddle.p.x,paddle.p.y,2*paddle.r);
  
  circle(ball.p.x,ball.p.y,2*ball.r);//実際に球を描画する関数
  //ブロックを描画。ループで
  for(let b of blocks){
  circle(b.p.x,b.p.y,2*b.r);  
  }
  
}




