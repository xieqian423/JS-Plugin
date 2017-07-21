; //在压缩js文件时，防止上一个模块的结尾不用分号导致报错

// mousedown 鼠标按下时触发
// mousemove 鼠标按下后拖动时触发
// mouseup   鼠标松开时触发
//在移动端，分别与之对应的则是touchstart、touchmove、touchend。
(function(window){

    var transform = getTransform();

    //构造函数
    function Draggable(id,options){
        options = options || {};

        // 获取目标元素对象
        this.target = document.getElementById("drag");
        // 鼠标初始位置的x，y坐标
        this.mouseP = {startX: 0, startY: 0};
        //保存目标元素初始位置的x，y坐标
        this.targetP = {startX: 0, startY: 0};

        this.init();
    }

    //原型
    Draggable.prototype = {
        constructor: Draggable,
        //初始化，设置拖拽
        init: function(){
            this.setDraggable();
        },
        //获取元素样式
        getStyle: function (el, property) {
            // 低版本ie通过currentStyle来获取元素的样式，其他浏览器通过getComputedStyle来获取
            if (document.defaultView && document.defaultView.getComputedStyle) {
                return document.defaultView.getComputedStyle(el, false)[property];
            } else {
                return el.currentStyle[property];
            }
        },

        //通过translate设置偏移，只能通过translate获取偏移
        getTargetPos: function (el) {
            var self = this;
            var pos = {x: 0, y: 0};
            // transform = false;
            if (transform) {
                //transformValue = "matrix(1, 0, 0, 1, 745, 76)"
                var transformValue = self.getStyle(el, transform);
                if (transformValue == 'none') {
                    el.style[transform] = 'translate(0, 0)';
                    return pos;
                } else {
                    // /[0-9,\s\.]+/
                    var temp = transformValue.match(/[0-9,\s0-9]+/)[0].split(',');
                    return pos = {
                        x: parseInt(temp[4].trim()),  //去除字符串中的空格，然后解析成整数
                        y: parseInt(temp[5].trim())
                    }
                }

            } else {
                if (self.getStyle(el, 'position') === 'static') {
                    el.style.position = 'relative';
                    return pos;
                } else {
                    pos.x = self.getStyle(el, 'left') ? parseInt(self.getStyle(el, 'left')) : 0;
                    pos.y = self.getStyle(el, 'top') ? parseInt(self.getStyle(el, 'top')) : 0;
                    return pos;
                }
            }
        },


        setDraggable: function () {
            var self = this;
            self.target.addEventListener('mousedown', start, false);

            //鼠标按下
            function start(e) {
                //获取鼠标初始位置
                self.mouseP.startX = e.pageX;
                self.mouseP.startY = e.pageY;

                //获取元素初始位置
                var pos = self.getTargetPos(self.target);
                self.targetP.startX = pos.x;
                self.targetP.startY = pos.y;

                document.addEventListener('mousemove', move, false);
                document.addEventListener('mouseup', end, false);
            }

            //鼠标移动
            function move(e) {
                //获取位移
                var width = e.pageX - self.mouseP.startX;
                var height = e.pageY - self.mouseP.startY;

                //设置元素位置
                //e.target.style.left = parseInt(sourceX) + width + 'px';
                //e.target.style.top = parseInt(sourceY) + height + 'px';
                self.setTargetPos(self.target, {
                    x: width + self.targetP.startX,
                    y: height + self.targetP.startY
                });
            };

            //鼠标松开
            function end() {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', end);
            };
        },

        //如果不支持，只能通过left/top设置元素位置
        setTargetPos: function (el, pos) {

            if (transform) {
                el.style[transform] = 'translate(' + pos.x + 'px,' + pos.y + 'px)';
            } else {
                el.style.left = pos.x + 'px';
                el.style.top = pos.y + 'px';
            }

            return el;
        }
    };

    //获取浏览器对transform的支持，如果不支持，只能通过left/top设置元素位置
    //element.style.transform = "translate(20px,10px)";
    function getTransform(){
        var trans = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'];
        var divStyle = document.createElement("div").style;

        var i, len;
        for(i=0, len=trans.length; i<len; i++){
            if(trans[i] in divStyle){
                return trans[i];
            }
        }
        return;
    };

    window.Draggable = Draggable;

})(window);





