import pygame
from pygame import mixer
import random
import math

# pygameを使うための挨拶
pygame.init()

# ゲームの舞台を設定。描画はまだ。ゲームタイトルの宣言
screen = pygame.display.set_mode((800,600))
pygame.display.set_caption("Shooting Game")

# これがないとPCの処理速度次第で更新したりせんかったりする
clock = pygame.time.Clock()

# Player この辺りはクラスで簡潔に書きたい
playerImg = pygame.image.load("player.png")
playerX, playerY = 370, 480
playerX_change = 0
# 位置を反映して描画するだけ
def player(x, y):
    screen.blit(playerImg,(x, y))


# enemy クラス化して、増やしたりしたい
enemyImg = pygame.image.load("enemy.png")
enemyX = random.randint(0, 736)
enemyY = random.randint(20, 50)
enemyX_change, enemyY_change = 10, 80
# 位置を反映して描画するだけ
def enemy(x, y):
    screen.blit(enemyImg, (x, y))


# bullet クラス化して、３way弾とか連発とかでかい弾とか種類増やしたい
bulletImg = pygame.image.load("bullet.png")
bulletX, bulletY = 0, 480
bulletX_change, bulletY_change = 0, 18
bullet_state = "ready"
# 弾を発射する関数
def fire_bullet():
    global bullet_state
    bullet_state = "fire"

# 衝突判定。三平方の定理
def isCollision(enemyX, enemyY, bulletX, bulletY):
    distance = math.sqrt(math.pow(enemyX - bulletX, 2) + math.pow(enemyY - bulletY, 2))
    return distance < 32
    
# この辺にアイテムクラスとか作りたい。取ったら自機が加速とか、敵全滅とか、弾の種類増えるとか


# 点数の初期値
score_value = 0

# BGM。play(-1)で１曲リピート
mixer.Sound("background.wav").play(-1)

# このwhile文の中身がゲームの本体。常に更新し続ける
running = True
game_over = False

while running:
    # FPSを安定させる
    clock.tick(60)
    # スクリーンを初期化しないと、前の瞬間の描画が残像として全部残る
    if not game_over:
        screen.fill((16,16,43))
    # ゲーム続行に関する呪文。バツ押したら終了するようにしている。
    # ここでrunnningとスペルミスをしたために、終了できなくなった（１敗）
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        # キー操作に対して何を行うかを記述
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_LEFT:
                playerX_change = -8
            elif event.key == pygame.K_RIGHT:
                playerX_change = 8
            elif event.key == pygame.K_SPACE:
                if bullet_state == "ready":
                    mixer.Sound("laser.wav").play()
                    bulletX = playerX
                    fire_bullet()
        # キーを離したとき、変化量をリセット
        if event.type == pygame.KEYUP:
            if event.key == pygame.K_LEFT or event.key == pygame.K_RIGHT:
                playerX_change = 0

    if not game_over:
        if enemyY > 440:
            game_over = True
        # キー操作に応じて自機の位置を変化させ、端に来たらそれ以上行かなくする
        playerX += playerX_change
        if playerX <= 0:
            playerX = 0
        elif playerX >= 736:
            playerX = 736

        # 敵の位置更新
        enemyX += enemyX_change
        # 端で跳ね返ってくるようにしている
        if enemyX <= 0:
            enemyX_change = 10
            enemyY += enemyY_change
        elif enemyX >= 736:
            enemyX_change = -10
            enemyY += enemyY_change
        
        
        # 弾発射操作に対して、弾を描画し動かす
        if bullet_state == 'fire':
            screen.blit(bulletImg, (bulletX + 16, bulletY +10))
            bulletY -= bulletY_change
            # 弾が当たらずに画面外に行ったら再装填
            if bulletY <= 0:
                bulletY = 480
                bullet_state = 'ready'
        # 衝突した時に起きることを記述
        collision = isCollision(enemyX, enemyY, bulletX, bulletY)
        collision = False
        if bullet_state == "fire":
            if isCollision(enemyX, enemyY, bulletX, bulletY):
                collision = True

        if collision:
            bulletY = 480
            bullet_state = 'ready'
            score_value += 100
            mixer.Sound("hit.mp3").play()
            enemyX = random.randint(0, 736)
            enemyY = random.randint(20, 50)

        # スコア表示
        font = pygame.font.SysFont(None, 32)
        score = font.render("Score : " + str(score_value), True, (255,255,255))
        screen.blit(score, (20,30))

        # 最終的な自機と敵の位置セット&描画
        player(playerX, playerY)
        enemy(enemyX, enemyY)

    # 敵が自陣に攻め入ってきたら
    if game_over:
        text = "GAME OVER"
        font = pygame.font.SysFont(None, 100)
        score = font.render(text, True, (255,2,2))
        screen.blit(score, (200,300))
        enemy(random.randint(0,800),random.randint(0,600))
    
    # 常に更新し続ける
    pygame.display.update()

pygame.quit()