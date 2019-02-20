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