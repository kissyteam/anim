Anim

### new Anim(elem, props)

#### Parameters

- elem {String | HTMLElement | KISSY.Node | Window | Object}
  作用动画的元素节点或窗口
- props {Object}
  动画结束时的 DOM 样式
- config {Object} Optional

### Methods

#### isPaused(elem) static

静态方法, 判断 elem 上是否有动画对象在暂停

**Parameters:**

- elem {HTMLElement | Window}
作用动画的元素节点

Returns: {Boolean}

#### isPaused()

判断当前动画对象是否被暂停

Returns: {Boolean}

#### isRunning()

判断当前动画对象是否在执行动画过程

Returns: {Boolean}

#### pause(elem, queueName) static

静态方法, 暂停某元素上的动画（集合）

**Parameters:**

- elem {HTMLElement | Window}
作用动画的元素节点

- queueName {String}
队列名字。设置 queueName 后, 表示暂停元素上指定队列中的所有动画：

null 表示默认队列的动画
false 表示不排队的动画
string 类型表示指定名称的队列的动画
不设置时, 表示暂停所有队列中的所有动画

#### pause ()

在动画实例上调用, 暂停当前动画实例的动画

#### resume ( elem  queueName ) static

Anim 的静态方法, 继续某元素上的动画（集合）

**Parameters:**

- elem {HTMLElement | Window}
  作用动画的元素节点

- queueName String
  队列名字。设置 queueName 后, 表示继续元素上指定队列中的所有动画：

### resume ()

在动画实例上调用, 继续当前动画实例的动画

### run ()

在动画实例上调用, 开始当前动画实例的动画

### stop ( [finish=false] )

在动画实例上调用, 结束当前动画实例的动画

**Parameters:**

[finish=false] {Boolean} optional
默认为false. false 时, 动画会在当前帧直接停止（不触发 complete 回调）. 为 true 时, 动画停止时会立刻跳到最后一帧（触发 complete 回调）

### stop(elem, end, clearQueue=false, queueName) static

静态方法, 结束某元素上的动画（集合）

**Parameters:**

- elem {HTMLElement | Window}
  作用动画的元素节点

- end {Boolean}
  此参数同实例方法 stop 中的 finish 参数

- clearQueue=false {Boolean}
  默认为 false, 是否清除动画队列中余下的动画

- queueName String
  队列名字。设置 queueName 后, 表示结束元素上指定队列中的所有动画：
