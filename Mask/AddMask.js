
;
/**
 * @class Mask
 * 给元素添加一个半透明遮罩层，使其无法被点击
 *
 * 思路：
 *  1.添加一个绝对定位的兄弟元素
 *  2.遮罩层的位置相对于定位的直接父元素计算,，
 *      所以要获取被遮元素距离父元素的左边及顶部的距离 offsetLeft/offsetTop
 *  3.遮罩层的宽高和被遮元素宽高相等，包括边框要计算在内
 *
 *  elem.getBoundingClientRect()
 *      left/top：距离窗口左侧(顶部)的位置
 *      width/height:元素的宽高
 *      bottom/right: top+height/left+width
 */
(function(window){

    /**
     * 构造函数
     * @param el        父元素对象
     * @param opacity   透明度
     */
    function Mask(el, style){
        style = style || {};

        this.opacity = style.opacity || 0.2;
        this.backgroundColor = style.backgroundColor || 'red';

        this.element = el;

        this.init();
    }

    Mask.prototype = {
        constructor: Mask,

        init: function(){
            this.addMask();
        },

        addMask: function(){
            var mask = document.createElement("div");
            mask.style.position = 'absolute'; //设置定位

            this.setStyle(mask);
            this.element.parentNode.appendChild(mask);

            return mask;
        },

        getPos: function(el){
            return {
                left: parseInt(el.offsetLeft),
                top:  parseInt(el.offsetTop)
            };
        },

        getSize: function(el){
            //left的值也包含了margin-left
            var pos = el.getBoundingClientRect();
            return {
                width: parseInt(pos.width),
                height: parseInt(pos.height)
            };
        },

        setStyle: function(mask){
            mask.style.backgroundColor = this.backgroundColor;

            if('opacity' in mask.style){
                mask.style.opacity = '' + this.opacity;
            }else{
                mask.style.filter = 'alpha(opacity='+ this.opacity + ')';
            }

            //设置位置
            var pos = this.getPos(this.element);
            mask.style.left = pos.left + 'px';
            mask.style.top = pos.top + 'px';

            //设置大小
            var size = this.getSize(this.element);
            mask.style.width = size.width + 'px';
            mask.style.height = size.height + 'px';
        }
    }

    window.Mask = Mask;

})(window);