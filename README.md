# Inner-Parking-map Solution

## SVG (Scalable Vector Graphics)

- svg即可缩放的矢量图形,它是基于XML（Extensible Markup Language），由W3C联盟进行开发的，严格来说应该是一种开放标准的矢量图形语言，可以作为HTML的标签，在绘制室内停车位的地图的过程中，svg采用inline的方式内嵌入body模块中。

- [官网菜鸟教程](http://www.w3school.com.cn/svg/index.asp)

## 素材处理

- 根据车位所在图纸或图片上的各模块坐标，简化表示各地图元素。使用element子标签g,polygon,rect,line,circle,ellipse等，进行地图区域和parking-lot的分组与绘制，配合相关javascript,jquery脚本与自定义function，实现web端室内停车位地图。

### DWG平面图纸

- 若含有停车位的原始文件是DWG格式的AutoCAD图纸集，如[加利大厦.dwg],建议使用AutoCAD-2007或其他更高更稳定的版本。正版的AutoCAD软件通常是收费的，大型软件运行起来颇占内存,笔记本电脑出现短时间的卡顿或闪退是正常的。官网可以免费试用三个月或者更短时间，破解版推荐使用注册机进行密钥破解。[百度网盘](https://pan.baidu.com/s/11aIYG4SIo7cEjx6HEMSCuw) 提取码：i4c5。

- 各个不同版本的CAD软件主功能界面大同小异，主界面最下栏会即时显示提示信息，遇到相关问题可以百度解决。运行软件至Home Page。[文件]菜单下[打开]选项卡下选择[图纸集]，找到电脑中的dwg图纸，[确定]加载至主视图View。如果提示本机需要替换图纸中的个性化shx字体文件，请一律忽略，因为这种文字注释一般来自土建从业人员的签名或者美观设计。

- 首先需要确定的是当前图纸的[比例尺]，可以通过[标注]功能和一般常识进行判断.一般采用[标注-线性],使用鼠标左键依次点选View窗口的一条线段，如车位的一条边，[标注]信息会平行显示在目标线段一侧。单击选中蓝绿色的带箭头的标注信息，右键菜单[特性]里可以查看标注数字。

- 为了后续获取关键点坐标使用方便性，需要对图纸进行适当比例的缩放。如[加利大厦.dwg]中的车位的宽度，笔者原始标注的信息是2500，推测单位是mm，故对其缩放成原图纸的0.01倍。具体操作：Ctrl+A全选View窗口的所有图纸元素，鼠标右键菜单，选中[缩放]功能，选中一个缩放原点(一般选左上角)，键盘输入：缩放为原比例的0.01倍，即完成缩放。

- 新建USC操作，保证拾取的坐标是正值。通常原始的dwg图纸是默认世界USC坐标系的，坐标正负数值跨度非常大，在进行适当比例的缩放后，建议使用[工具栏]-[line]功能，在图纸的左上角绘制两条相交的短线段，交点尽量靠近图纸的最左上角点，建议交点距离图纸左上角X,Y方向均不超过50。此后，在视图窗口下方的命令输入框中键入：[USC]，回车后按照提示继续输入[N]，捕捉前一步形成的交点指定为[原点]，然后分别指定X,Y轴正方向。建议X轴正方形：水平向右；Y轴正方形：竖直向下。[新建USC参考](https://zhidao.baidu.com/question/1924060573348733427.html)。

- 在建立合适的USC坐标系的基础上，在视图窗口下方的命令输入框中键入：[ID]，鼠标左键捕捉图纸中的端点，视图窗口下方立即会显示当前point坐标点的X,Y,Z坐标,平面图Z=0，即可获得svg标签所需的点的坐标。

- 需要注意的是，AutoCAD窗口的坐标点是伪精确的，小数点后通常好多位。考虑实际图形效果的水平，竖直以及图形间的排列间距，获取的第一手point坐标数据可以进行人为调整。举例来说，获取[加利大厦.dwg]中左上角一点的坐标为(31.289,37.876)，记作(30,38)绘制写入polygon多边形标签中：

            <polygon 
                points="30,38 30,550 190,550 190,592 875,592 875,550 1042,550 1042,38 875,38
                875,20 190,20 190,38"
                style="fill:#e6e6e6; stroke:black; stroke-width:2"/>

- 对于规则的图形如长方形状的"停车位"，其实不需要使用[ID]捕捉四个坐标点。根据svg中rect标签，指定停车位左上角的顶点(x,y)，输入width和height，即可以将"停车位"快速绘制：

            <rect id="lot_1" x="170" y="85" width="25" height="50" 
                style="fill:gold;stroke-width:1;stroke:rgb(0,0,0)"/>

- svg中的"g"标签是group的简称，可以将同一类元素的所有Element集中放到一个g标签下，而g标签处于svg大标签下，这对后续的全局鼠标单击事件响应管理相当奏效。

### PNG或PSD图片

- 若含有停车位的原始文件是.png或.psd格式的素材，相较于.dwg格式的设计图纸来说更为简单。

- UI工程师可以熟练地在PS软件中捕捉出图片中各元素边界点的像素坐标，也可以使用在线轻量级PS网站进行捕捉。例如[在线ps编辑网站](https://www.uupoop.com/)。

- 除了上述的专业途径，前端工程师也可以使用Windows系统自带的[画图]软件查看原始素材。在工具栏选定[选择]，鼠标光标即变成十字丝交叉圆点状，移动光标至图片对应的元素顶点处，[画图]软件左下角即显示形如"257,577像素"的提示，像素坐标可以用来当做svg绘图的坐标。

- 参考"满庭芳园.docx"

## 代码案例

- 详见Map文件夹丁丁地图模板20190909.html
