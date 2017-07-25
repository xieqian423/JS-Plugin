(function(){

    var transform = (function(temp){
        var trans = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'];
        var divStyle = temp.style;

        var i, len;
        for(i=0, len=trans.length; i<len; i++){
            if(divStyle[trans[i]] !== undefined){
                return trans[i];
            }
        }
        return;
    })(document.createElement("div"));

    var transition = (function(temp){
        var trans = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'];
        var divStyle = temp.style;

        var i, len;
        for(i=0, len=trans.length; i<len; i++){
            if(divStyle[trans[i]] !== undefined){
                return trans[i];
            }
        }
        return;
    })(document.createElement("div"));


    function PageSwicth(el, options){
        options = options || {};

        this.keyboard = options.keyboard || false;
        this.loop = options.loop || false;
        this.direction = options.direction ? options.direction : "vertical";

        this.index = 0;
        this.win = el;
        this.selectors = {};
        this.selectors.container = "swicth-sections";
        this.selectors.page = "section";

        this.init();
    };

    PageSwicth.prototype = {
        constructor: PageSwicth,

        init: function(){
            this.pageCount = this.getPageCount();
            this.container = document.getElementsByClassName(this.selectors.container)[0];
            this.pages = this.container.getElementsByClassName(this.selectors.page);

            //设置屏幕垂直还是水平
            if(this.direction == "vertical"){
                this._layoutV();
            }else{
                this._layoutH();
            }

            //设置窗口滚动隐藏
            this.win.style.overflow = 'hidden';
            //设置按钮排列方向
            this.botton = this.container.getElementsByClassName("swicth-controls")[0];
            if(!this.botton){
                this.createBtn();
            }
            this._layoutBtn();

            //绑定事件
            this._initEvent();
        },

        /**
         * 设置垂直显示
         * @private
         */
        _layoutV: function(){
            this.container.style.height = (100*this.pageCount) + '%';
            var i,len=this.pageCount;
            for(i=0; i<len; i++){
                this.pages[i].style.height = (100/len).toFixed(2) + '%';
            }
        },

        /**
         * 设置水平显示
         * @private
         */
        _layoutH: function(){
            this.container.style.width = (100*this.pageCount) + '%';
            var i,len=this.pageCount;
            for(i=0; i<len; i++){
                this.pages[i].style.width = (100/len).toFixed(2) + '%';
                //this.pages[i].style.display = "inline-block";
                if("cssFloat" in this.pages[i].style){
                    this.pages[i].style.cssFloat = "left";
                }else{
                    this.pages[i].style.styleFloat = "left";  //兼容IE
                }
            }
        },

        /**
         * 设置按钮样式
         * @private
         */
        _layoutBtn: function(){
            var i,len=this.pageCount;
            this.controls[this.index].classList.add("active");
        },

        _initEvent: function(){
            //使用事件委托
            //点击事件
            var self = this;
            var len = this.pageCount;
            this.win.addEventListener('click',function(e){
                if(e.target.nodeName.toUpperCase() !== 'LI'){
                    return;
                }
                for(var i=0; i<len; i++){
                    if(self.controls[i] == e.target){
                        self.index = i;
                    }
                }
                //获取对应索引
                self.scrollPage();
            },false);

            //鼠标滚轮事件
            this.win.addEventListener("mousewheel",function(e){
                if(e.wheelDelta>0){ //向上滑动
                    self.prev();
                }else if(e.wheelDelta<0){  //向下滑动
                    self.next();
                }
            },false);

            //绑定键盘事件
            if(this.keyboard){
                document.onkeydown = function(e){
                    if(e.keyCode == 37 || e.keyCode == 38){
                        //向上滑动
                        self.prev();
                    }else if(e.keyCode == 39 || e.keyCode == 40){
                        //向下滑动
                        self.next();
                    }
                }
            }

            //窗口改变

            //动画结束 transitionend
            //this.container
        },

        getPageCount: function(){
            return this.win.getElementsByClassName(this.selectors.page).length;
        },

        createBtn: function(){
            //var fragment = document.createDocumentFragment();
            //该元素不能使用innerHTML

            var ul = document.createElement("ul");
            ul.classList.add("swicth-controls");
            if(this.direction == "vertical"){
                ul.classList.add("vertical");
            }else{
                ul.classList.add("horizontal");
            }

            var html="";
            for(var i=0; i<this.pageCount; i++){
                html += "<li data-index=" + i + ">" + "</li>";
            }

            ul.innerHTML = html;
            this.win.appendChild(ul);
            this.controls = ul.children;
        },

        /**
         * 获取竖直或水平方向的切换跨度
         */
        getSwitchWidth: function(){
            var style = getComputedStyle(this.container, null);
            if(this.direction == "vertical"){
                return parseInt(style.height)/this.pageCount;
            }else{
                return parseInt(style.width)/this.pageCount;
            }
        },

        prev: function(){
            if(this.index > 0){
                this.index--;
            }else if(this.loop){
                this.index = this.pageCount - 1;
            }
            //调用滑动事件
            this.scrollPage();
        },
        next: function(){
            if(this.index < this.pageCount-1){
                this.index++;
            }else if(this.loop){
                this.index=0;
            }
            //调用滑动事件
            this.scrollPage();
        },

        scrollPage: function(){
            //添加过渡动画属性
            //竖向滑动，当前页面相对于父元素的top
            // 横向滑动left的值
            //transition与transform
            //如果不支持transiform就用animate实现
            var width = this.getSwitchWidth() * this.index;
            if(this.direction == "vertical"){
                transform ? (this.container.style[transform] = "translateY(-"+ width +"px)") :(this.container.style.top = -width+'px');
            }else{
                transform ? (this.container.style[transform] = "translateX(-"+ width +"px)"):(this.container.style.left = -width+'px');
            }
            this.container.style.transition = "all "+ " 1s " + " ease";

            this.setBtnActive();
        },

        setBtnActive: function(){
            var len = this.pageCount;
            var control = null;
            for(var i=0; i<len; i++){
                control = this.controls[i];
                if(control.getAttribute("data-index") == this.index){
                    control.classList.add("active");
                }else{
                    control.classList.remove("active");
                }
            }
        }
    };

    PageSwicth.default = {
        selectos:{},
        index: 0, //当前滚动的页面
        loop: false, //是否循环播放
        pagination: true,
        keyboard: true ,
        direction: 'vertical', //滑动方向
        callback: ""
    };

    window.PageSwitch = PageSwicth;
})();