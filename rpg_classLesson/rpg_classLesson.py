# クラスの中身を詰めていく作業を効率化できる
from dataclasses import dataclass
# 何これ
import pandas as pd
import os

# ハンターの名前や基本体力、攻撃力、防御力、各属性耐性の設計図
# そのほか、防具の防御力合計を計算したり、武器を装備して攻撃力を更新したりといった「処理」もここで定義しておく
class Human:#self.なんとかってやるのめんどいから、dataclassモジュールを活用するといい
    def __init__(self,name,hp,atk,defense,fire_resistance,water_resistance,thunder_resistance):
        self.name = name
        self.hp = hp
        self.atk = atk
        self.default_atk = atk
        self.defense = defense
        self.fire_resistance = fire_resistance
        self.water_resistance = water_resistance
        self.thunder_resistance = thunder_resistance
    def equip(self,weapon):#武器を装備する
        self.atk = self.default_atk +weapon.atk
        print(f"{weapon.name}を装備しました。")
    def equip_armor(self,armor):#防具を装備する
        self.defense += armor.defense
        print(f"{armor.name}を装備しました。")
    def display_parameter(self):
        print(f"HP：{self.hp},攻撃力{self.atk},防御{self.defense},火耐性{self.fire_resistance},水耐性{self.water_resistance},雷耐性{self.thunder_resistance}")


hunter1 = Human("ふんたー１号",150,4,1,0,0,0)
print(hunter1)
print(f"{hunter1.name}を入力しました")
print(f"残り体力は{hunter1.hp}です")
print(f"HP：{hunter1.hp},攻撃力{hunter1.atk},防御{hunter1.defense},火耐性{hunter1.fire_resistance},水耐性{hunter1.water_resistance},雷耐性{hunter1.thunder_resistance}")


# class Weapon:
#     def __init__(self,name,atk,critical_rate,element_value):
#         self.name = name
#         self.atk #こうやって設定していくのめんどくない？
# 下のように書くといい

@dataclass
class Weapon:
    weapon_type : str
    name: str
    atk: int
    critical_rate:int
    element_type: str
    element_value:int
# 打ち込むのは楽な反面、csvとかで読み込みたければ別の方法が必要

# Weaponクラスの試運転
weapon_1 = Weapon("大剣","角王剣アーティラート",310,-15,"無",0)

# Weaponクラスの特徴を引き継いで、武器種固有のパラメータ等を定義
class LightBowgun(Weapon):
    ammo_data: list # 他武器種にはない弾種データをリストで保持
class Bow(Weapon):
    arrow_type: list # 矢種のリスト

# ここからCSVの読み込み。一気に複雑になるが耐えること
# csvの場所を引数に持ち、それを読み込む関数「load_weapons_basic」を作る
# csvは、カレントディレクトリからの相対パスでたどる。よって辿りやすい場所においておく
def load_weapons_basic(folder_path):
    weapons=[] # これから武器の基本データを読み込む。その値(表形式になる)を格納するための空箱
    for filename in os.listdir(folder_path):
        if filename.endswith(".csv"): #.csvで終わるやつだけを探す
            csv_path = os.path.join(folder_path,filename)
            df = pd.read_csv(csv_path) #pandasのread_csv機能を呼び出して、()内のcsvを読みこむ
            for _, row in df.iterrows(): # 表のデータをそれぞれの変数に詰め込んでいくループ
                w = Weapon(
                    weapon_type=row["weapon_type"],
                    name = row["name"],
                    atk=int(row["atk"]),
                    critical_rate=int(row["critical_rate"]),
                    element_type=row["element_type"],
                    element_value=int(row["element_value"])
                )
                weapons.append(w) # さっき作った空箱にループで取り出した値を入れる
    return weapons # 武器情報の入ったリストを返す

# 次にボウガン、弓などの武器固有パラメータを読み込みたいが、難しいので一旦ステイ
@dataclass
class Armor:
    name: str
    part: str #頭胴腕腰脚のどこの防具かを指定
    defense: int
    fire_resistance: int
    water_resistance: int
    thunder_resistance: int
    skills: dict[str,int] # 辞書にすることで、一つの防具あたりのスキルポイント数にばらつきがありスキル名も様々あっても対応できる

# Armorクラスの試運転
armor_head_silverSol = Armor("シルバーソルヘルム","頭",153,4,-4,-2,{})

# 俺は最初こう書いたが、
Human.equip(hunter1,weapon_1)
Human.display_parameter(hunter1)

# こう書くのが普通
hunter1.equip(weapon_1)
hunter1.display_parameter()
# hunter1はHumanクラスのインスタンスであることはわかっているからって感覚かな

weapons_list=load_weapons_basic("weapons")

print(weapons_list[56:58])
print(len(weapons_list))


w = next((w for w in weapons_list if w.name == "角王弓ゲイルホーン"), None)
if w:
    hunter1.equip(w)
else:
    print("武器が見つかりません")

hunter1.display_parameter()