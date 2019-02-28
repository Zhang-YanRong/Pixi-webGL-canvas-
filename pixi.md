# pixi学习笔记

### 配置
运行必须要有web服务器

### 安装
``` bash
<script src="pixi.min.js"></script>
```
安装正常（在浏览器控制台中会打印下面的一行）
``` bash
 PixiJS 4.4.5 - * canvas * http://www.pixijs.com/  ♥♥♥ 
```

### 创建Pixi应用程序和stage
Pixi有一个Application，会选择用canvas还是WebGL去渲染图像（取决于正在使用的浏览器支持哪一个），然后需要创建一个Container（特殊的Pixi对象stage）,这个stage对象将作为根容器。

//示例
``` bash
//创建一个Application
let app = new PIXI.Application({
    width: 256,          //default: 800
    height: 256,         //default: 600
    antialias: true,     //default: false 使字体边界和几何图形更加圆滑
    transparent: false,  //default: false 设置canvas的透明度
    resolution: 1        //default: 1 让Pixi在不同的分辨率和像素密度的平台上运行变得简单
    foreCanvas: true     //default: false 强制抛弃WebGL，只用canvas
})
//将Application转化的canvas添加到页面中
document.body.appendChild(app.view)
```

### renderer
##### 创建画布之后想改变背景色设置app.renderer对象的backgroundColor属性为一个十六进制的颜色：
``` bash 
app.renderer.backgroundColor = 1x245628
```

##### 重新设置画布宽高
``` bash
app.renderer.view.width = 200
//该方法也可以获取画布的宽高
console.log(app.renderer.view.width)
```
``` bash
app.renderer.autoResize = true
app.renderer.resize(512,512)
```
##### 让canvas占据整个窗口
``` bash 
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth,window.innerHeight);
```
注：padding和margin都设置成0

##### 让canvas在任何浏览器中统一尺寸

### Pixi sprites

有了画布，想显示图像就必须运用stage对象。stage是Pixi的一个Container（容器）对象，所有要显示的东西都要放在stage中。
Pixi拥有一个sprites类来创建游戏精灵，有三种主要的方法来创建：
* 用一个但图像文件创建
* 用一个雪碧图（tileset）上的子图来创建
* 从一个纹理（texture ）贴图集中创建（纹理贴图集就是用JSON定义了图像大小和位置的tileset）

### 将图片加载到纹理（texture）缓存中
因为Pixi用WebGL和GPU去渲染图像，所以图像需要转化成GPU可以处理的版本。
> 可以被GPU处理的图像被称作 纹理（texture）
> 在让精灵（sprites）显示图片之前，要将图片转化成WebGL纹理
> 为了提高效率，Pixi使用纹理缓存来存储和引用所有的纹理
``` bash
//用WEBGL兼容的格式存储纹理
let texture = PIXI.utils.TextureCache["img/11.png"]
//使用Pixi的sprite来创建一个新的sprite来使用纹理
let sprite = new PIXI.Sprite(texture)
```
##### 用loader加载图像并转化成纹理
loader可以加载任何图像资源
``` bash
PIXI.loader.add("img/11.png").load(setup)
function setup(){
    //这里是loader加载完成后的回调函数
    //创建一个精灵（sprite）来连接loader的sesources对象
    let sprite = new PIXI.Sprite(
        PIXI.loader.resources["./img/11.png"].texture
    )
    //让sprite显示
    app.stage.addChild(sprite)
}
```

##### add用法
1.链式
``` bash
PIXI.loader
    .add('./img/1.png')
    .add('./img/2.png')
    .load(steup)
```
2.数组
``` bash
PIXI.loader
    .add([
        './img/1.png',
        './img/2.png'
    ])
    .load(steup)
```

### 显示 sprite
`app.stage.addChild(sprite) `
__stage 是用来包裹你所有精灵的主要容器 __
``` bash
let app = new PIXI.Application({
    width: 256,
    height: 256,
    antialias: true,
    transparent: false,
    resolution: 1
})
document.body.appendChild(app.view)


PIXI.loader.add('./img/11.png').load(imgs)
function imgs(){
    let sprite = new PIXI.Sprite(PIXI.loader.resources["./img/11.png"].texture)
    app.stage.addChild(sprite)
}
```

### 让canvas占据整个窗口
``` bash
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth,window.innerHeight)
```
### 从javascript的Image对象或canvas创建一个精灵
``` bash
let base = new PIXI.BaseTexture(imgObject),
    texture = new PIXI.Texture(base),
    sprite = new PIXI.Sprite(texture);

//使用BaseTexture.fromCanvas(anyCanvasElement)
let base = new PIXI.BaseTexture.fromCanvas(anyCanvasElement),

//改变已经显示的精灵的纹理
anySprite.texture = PIXI.utils.TextureCache["anyTexture.png"];
```
### 监视加载进程
pixi的加载器有一个特殊的progress事件，它将会调用一个可以定制的函数，这个函数将在每次文件加载时调用，progress事件将会被loader的on方法调用：
``` bash
PIXI.loader.on('progress',loadProgressHandler)
```

实例
``` bash 
PIXI.loader
  .add([
    "images/one.png",
    "images/two.png",
    "images/three.png"
  ])
  .on("progress", loadProgressHandler)
  .load(setup);

function loadProgressHandler() {
  console.log("loading");
}

function setup() {
  console.log("setup");
}
```

#### 文件加载以及百分比
``` bash
PIXI.loader
  .add([
    "images/one.png",
    "images/two.png",
    "images/three.png"
  ])
  .on("progress", loadProgressHandler)
  .load(setup);

function loadProgressHandler(loader, resource) {

  //Display the file `url` currently being loaded
  console.log("loading: " + resource.url);

  //Display the percentage of files currently loaded
  console.log("progress: " + loader.progress + "%");

  //If you gave your files names as the first argument
  //of the `add` method, you can access them like this
  //console.log("loading: " + resource.name);
}

function setup() {
  console.log("All files loaded");
}

//result:
loading: images/one.png
progress: 33.333333333333336%
loading: images/two.png
progress: 66.66666666666667%
loading: images/three.png
progress: 100%
All files loaded
```

#### pixi加载器的奇特知识：
* add方法有四个基础参数：
``` bash 
add(name, url, optionObject, callbackFunction)
```
>1. name(string): 加载源文件的别名，如果没有设置，url就会放在这
>2. url(string)：源文件的地址，是加载器baseUrl的相对地址（必填）
>3. options(object literal): 加载设置
>4. options.crossOrigin(Boolean): 源文件请求跨域不?默认是自动设定的
>5. options.loadType：源文件是怎么加载进来的？默认是Resource.LOAD_TYPE.XHR。options.xhrType:用XHR的时候该怎么处理数据？ 默认是Resource.XHR_RESPONSE_TYPE.DEEAULT。
>6. callbackFunction: 当这个特定的函数加载完，这个特定的函数将会被执行

实例：
``` bash
//链式语法
.add('key','http://...',function(){})
.add('http://...',function(){})
.add('http://...')

//对象语法
.add({
    name:'key2',
    url:'http://...',
    crossOrigin: true
},function(){})
.add({
    name:'key2',
    url:'http://...',
    onComplete: function(){},
    crossOrigin: true
})

//数组对象语法
.add([
    {name: 'key4', url: 'http://...', onComplete: function () {} },
    {url: 'http://...', onComplete: function () {} },
    'http://...'
])
```

### 精灵位置

``` bash
function setup(){
    let cat = new Sprite(resources["img/11.png"].texture)
    cat.x = 96;
    cat.y = 96;
    app.stage.addChild(cat)
}
```

### 大小和比例
``` bash
function setup(){
    let cat = new Sprite(resources["img/11.png"].texture)
    cat.width = 80;
    cat.height = 120;
    cat.scale.x = 0.5;
    cat.scale.y = 0.5;
    app.stage.addChild(cat)
}
```

### 旋转
``` bash
cat.rotation = 0.5;
```
精灵是以左上角的点为基准，直接旋转则是把左上角的点作为中心点,anchor.x和anchor.y的值是以百分比的形式从0-1，都设置成0.5,就表示在图片中心：
``` bash
cat.anchor.x = 0.5;
car.anchor.y = 0.5;
//这里改变了图片的锚点位置，就会改变图片位置
```

### 雪碧图
Pixi有一个内置的Rectangle object(PIXI.Rectangle),他是一个用于定义举行形状的通用对象，他需要四个参数，前两个参数定义矩形的x和y位置。最后两个定义了他width和height
``` bash
let rectangle =  new  PIXI.Rectangle（x，y，width，height）;
```
Pixi的纹理中有一个叫做frame的属性，可以被设置成任何的Rectangle对象。frame将纹理映射到Rectangke的维度。下面是怎么用frame来定义火箭的大小和位置：
``` bash
let rectangle = new Rectangle(192, 128, 64, 64);
texture.frame = rectangle;
```
``` bash
function setup(){
    //从纹理中创建`tileset`精灵
    let texture = TextureCache["img/11.png"]
    //创建一个矩形对象，用于定义,要从纹理中提取的子图像的位置和大小（`Rectangle`是`PIXI.Rectangle`的别名）
    let rectangle = new PIXI.Rectangle(192, 128, 64, 64)
    //告诉纹理使用那个矩形截面
    texture.frame = rectangle;
    //从纹理中创建精灵
    let rocket = new Sprite(texture);
    //将火箭精灵放在画布
    rocket.x = 32;
    rocket.y = 32;
    //将火箭添加到舞台
    app.stage.addChild(rocket);
    //渲染舞台 
    renderer.render(stage);
}
```


### 移动精灵
* 使用Pixi的ticker（游戏循环），任何在游戏循环里的代码都会1秒更新60次，你可以用下面的代码让cat精灵以每帧1像素的速率移动。
``` bash 
function setup(){
    app.ticker.add(delta => gameLoop(delta))
}

function gameLoop(delta){
    cat.x += 1;
}
```
delta的值代表帧的部分延迟，可以加到cat的位置，让cat的速度和帧率无关,这个delta只有动画不能跟上60帧的速录时候出现
``` bash
cat.x += 1 + delta;
```
* 使用requestAnimationFrame创建游戏循环
``` bash
function gameLoop(){
    requestAnimationFrame(gameLoop)
    cat.x += 1
}
```

### 速度属性
> * vx 水平
> * vy 竖直
#### 用法
> 1.给精灵创建vx和vy属性，并给初始值
``` bash
cat.vx = 0;
cat.vy = 0;
//速度为0表示静止
```
> 2.在游戏循环中更新vx和vy为想要的值，然后把值赋给精灵的x和y属性
``` bash
let cat;
function setup(){
    cat = new PIXI.Sprite(PIXI.loader.resources('img/11.png').texture)
    cat.x = 0;
    cat.y = 20;
    cat.vx = 0;
    cat.vy = 0;
    app.stage.addChild(cat)
    gameLoop()
}
function gameLoop(){
    requestAnimationFrame(gameLoop)
    cat.vx = 1;
    cat.vy = 1;
    cat.x += cat.vx;
    cat.y += cat.vy;
}

```

### 键盘移动
``` bash 
function keyboard(keyCode){
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefind;
    key.downHandler = event => {
        if(event.keyCode === key.code){
            if(key.isUp && key.press){
                key.press()
            }
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault()
    }
    key.upHandler = event => {
        if(event.keyCode === key.code){
            if(key.isDown && key.release){
                key.release()
            }
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault()
    }
    
    window.addEventListener(
        "keydown",key.downHandler.bind(key),false
    )
    window.addEventListener(
        "keyup",key.upHandler.bind(key),false
    )
    return key;
}

//调用keyObject 
let keyObject = keyboard(asciiKeyCodeNumber);
keyObject.press = () => {

}
keyObject.release = () => {
    
}
```

#### 代码实例
``` bash 
let app = new PIXI.Application({
    width: 256,
    height: 256,
    antialias: true,
    transparent: false,
    resolution: 1
})
document.body.appendChild(app.view)

app.renderer.view.width = 600
app.renderer.autoResize = true;
app.renderer.resize(512,512)
app.renderer.resize(window.innerWidth,window.innerHeight)

PIXI.loader.add('./img/11.png').load(imgs)
let cat,stage;

function imgs() {
    cat = new PIXI.Sprite(PIXI.loader.resources["./img/11.png"].texture)
    cat.y = 96;
    cat.vx = 0;
    cat.vy = 0;
    app.stage.addChild(cat)

    let left = new Keyboard(37),
        up = new Keyboard(38),
        right = new Keyboard(39),
        down = new Keyboard(40);
    //按下左键
    left.press = () =>{
        cat.vx = -5;
        cat.vy = 0;
    }

    //松开左键
    left.release = () => {
        if(!right.isDown && cat.vy === 0) {
            cat.vx = 0;
        }
    }

    //按下上键
    up.press = () => {
        cat.vy = -5;
        cat.vx = 0;
    }

    //松开上键
    up.release = () => {
        if(!down.isDown && cat.vx === 0){
            cat.vy = 0;
        }
    }

    //按下右键
    right.press = () => {
        cat.vy = 0;
        cat.vx = 5;
    }

    //松开右键
    right.release = () => {
        if(!down.isDown && cat.vy === 0){
            cat.vx = 0;
        }
    }

    //按下下键
    down.press = () => {
        cat.vy = 5;
        cat.vx = 0;
    };

    // 松开下键
    down.release = () => {
        if (!up.isDown && cat.vx === 0) {
            cat.vy = 0;
        }
    };

    state = play;
    app.ticker.add(delta => gameLoop(delta))
    
    function gameLoop(){
        state()
    }

}
function play(delta) {
    cat.x += cat.vx;
    cat.y += cat.vy;
}


function Keyboard(keyCode){
    let that = this;
    this.code = keyCode;
    this.isDown = false;
    this.isUp = true;
    this.press = undefined;
    this.release = undefined;
    this.downHandler = event => {
        if(event.keyCode === key.code){
            if(key.isUp && key.press){
                key.press()
            }
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault()
    }

    this.upHandler = event => {
        if (event.keyCode === key.code) {
            console.log(key,'up1')
            if (key.isDown && key.release) {
                key.release();
            }
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    window.addEventListener(
        "keydown",that.downHandler.bind(this), false
    );

    window.addEventListener(
        "keyup",that.upHandler.bind(this), false
    );
}
```

### 给精灵分组
``` bash
let cat = new PIXI>Sprite(["cat.png"])
cat.positon.set(16,16)

let hedgehog = new PIXI>Sprite(["hedgehog.png"])
hedgehog.positon.set(32,32)

let tiger = new PIXI>Sprite(["tiger.png"])
tiger.positon.set(64,64)

//创建一个animals容器（container）把他们聚合在一起
let ainmals = new PIXI.Container();

//然后用 addChild 去把精灵图 添加到分组中
ainmals.addChild(cat)
ainmals.addChild(hedgehog)
ainmals.addChild(tiger)

//最后把分组添加到舞台上（把三个精灵捆绑在一起，看作一个整体）
app.stage.addChild(animals)

//注：stage对象也是一个Container。它是所有Pixi精灵的根容器
//操作animals，上面三个精灵会一起变动
```
``` bash
//animals分组也有它自己的尺寸，它是以包含的精灵所占的区域计算出来的。你可以像这样来获取width和height的值：

console.log(animals.width);
console.log(animals.height);
```
### 局部位置和全局位置

精灵图还有 全局位置 。全局位置是舞台左上角到精灵锚点（通常是精灵的左上角）的距离。你可以通过toGlobal方法的帮助找到精灵图的全局位置：
``` bash
animals.toGlobal(cat.position)
```
如果你想知道一个精灵的全局位置，但是不知道精灵的父容器怎么办？每个精灵图有一个属性叫parent 能告诉你精灵的父级是什么。在上面的例子中，猫的父级是 animals。这意味着你可以像如下代码一样得到猫的全局位置：
``` bash
cat.parent.toGlobal(cat.position);
```
#### 更好的获取全局位置的方式
想知道精灵到canvas左上角的距离，但是不知道或者不关心精灵的父亲是谁，用getGlobalPosition方法:
``` bash
tiger.getGlobalPosition().x
tiger.getGlobalPosition().y
```
#### 将全局位置转换成局部位置
``` bash
tiger.toLocal(tiger.position, hedgehog).x
tiger.toLocal(tiger.position, hedgehog).y
```
### 精灵分组
Pixi有一个额外的，高性能的方式去分组精灵的方法：ParticleContainer(PIXI.ParticleContainer)。任何在ParticleContainer里的精灵都会比在一个普通的Container的渲染速度快2到5倍：
``` bash
let superFastSprites = new PIXI.particles.ParticleContainer()
//然后用addChild去往里添加精灵，就像往普通的Container添加一样
```
如果决定用ParticleContainer，就必须做出一些妥协。在ParticleContainer里的精灵图只有一小部分基本属性：x,y,width,height,scale.pivot,alpha,visble这几个，并且它包含的精灵不能再继续嵌套自己的孩子精灵。particleContainer也不能用Pixi的现金视觉效果如过滤器和混合模式，每个PaticleContainer只能用一个纹理（所以想精灵有不同的表现方式就必须更换雪碧图），但是项目中可以同时用Container和ParticleContainer

##### ParticleContainer性能高的原因是精灵位置直接在GPU上计算的

ParticleContainer有四个参数（size,properties,batchSize,autoResize）：
``` bash
let superFastSprites = new ParticleContainer(maxSize,properties,batcheSize,autoResize)
```
> 1.默认的maxSize是1500
> 2.properties是一个有五个布尔值的对象：scale,position,rotation,uvs和alpha(默认的position是true,其他都为false) :
>let superFastSprites = new ParticleContainer(
  size,
  {
    rotation: true,
    alphaAndtint: true,
    scale: true,
    uvs: true
  }
);
> 3.uvs：只有在动画需要时盖面纹理子图像的时候需要设置为true(注意：UV mapping 是一个3D图表展示术语，它指纹理（图片）准备映射到三维表面的x和y的坐标，U 是 x 轴，V 是 y 轴， WebGL用 x, y 和 z 来进行三维空间定位，所以U 和 V 被选为表示2D图片纹理的 x 和 y)

### Pixi绘制几何图形
#### 矩形
``` bash
//创造一个Pixi的Graphics类的实例
let rectangle = new PIXI.Graphics()

使用beginFill和一个16进制的颜色值填充
rectangle.beginFill(0x66CCFF)

//给图形设置一个轮廓，使用lineStyle方法，设置一个宽4像素，alpha值为1的红色轮廓
rectangle.lineStyle(4, 0xFF3300, 1);

//调用drawRect方法来画一个矩形。它的四个参数是x, y, width 和 height。
rectangle.drawRect(x,y,width,height)

//endFill表示绘制结束
rectangle.endFill()

//设置矩形的起点
rectangle.x = 170;
rectangle.y = 170;

app.stage.addChild(rectangle)
```
#### 圆形
调用drawCircle方法来创造一个圆，他的三个参数是x,y和radius
> drawCircle(x,y,radius)
``` bash
let circle = new PIXI.Graphics()
circle.beginFill(0x9966FF);
circle.drawCircle(0,0,32)
circle.endFill();
circle.x = 64;
circle.y = 130;
app.stage.addChild(circle)
```
#### 椭圆
drawEllipse 是一个卓越的Canvas绘画api，Pixi也能调用drawEllipse来绘制椭圆
> drawEllipse(x,y,width,height)
> x/y表示圆心，也是默认起点
``` bash 
let ellipse = new PIXI.Graphics();
ellipse.beginFill(0xFFFF0);
ellipse.drawEllipse(0,0,50,20)
ellipse.endFill();
ellipse.x = 180;
ellipse.y = 130;
app.stage.addChild(ellipse);
```