### 使用说明

Anim 模块为节点提供动画机制，有两种使用方式：

- 实例化 Anim 对象，然后调用该对象的 `run()` 方法开始运行动画。
- 通过调用 node 对象的 animate 方法，生成并运行动画。

### 基本使用例子

    var Anim = require('anim');

    // 初始化动画实例
    var anim = Anim('#anim-el',
        // 动画目标样式
        {
            'background-color':'#fcc',
            'border-width':'5px'
        },
        {
            duration : 5,  // 动画时长，秒
            easing : "bounceOut",   // 动画特效
            complete : function(){  // 动画结束的回调
                alert('动画结束');
            }
        });

    // 开始执行动画
    anim.run();