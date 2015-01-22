$(function(){  
    var UIEvent = window.UIEvent = {
        searchHolder : function() {
            //搜索框的placeholder效果
            var $search = $('.header .search');
            var $input = $search.find('input');
            var $placeholder = $search.find('label');
            $search.on('click', function () {
                $placeholder.hide();
                $input.focus();
            });
            $input.on('blur', function () {
                if ($(this).val() == '') {
                    $placeholder.show();
                    $search.removeClass('focus');
                }
            }).on('focus', function () {
                $placeholder.hide();
                $search.addClass('focus');
            });
            $search.find('a').on('click',function(){
                $search.find('form').trigger('submit');
                return false;
            });
        },
        rankTab : function(){
            var $rank = $('.index .rank');
            var $leftControl = $rank.find('.left');
            var $rightControl = $rank.find('.right');
            var $ul = $rank.find('ul');
            var $li = $rank.find('li');
            var _width = parseInt($rank.find('.list').css('width'));
            var _px = parseInt($li.css('width')) + parseInt($li.css('marginRight'));
            var len = $li.length;
            var curLi = Math.round(_width/_px);
            $ul.attr('index',0).css('width', _px*len*1.5).css('left',0);
            $rightControl.removeClass('disabled').unbind('click');
            $leftControl.addClass('disabled').unbind('click');

            $rank.bind("selectstart",function(){return false;}); //禁止双击选中

            $rightControl.on('click',function(){
                if( $rightControl.hasClass('disabled') ) return false;
                var _index = parseInt($ul.attr('index')) + 1;
                $ul.attr('index', _index );
                $ul.stop().animate({ left:-_index*_px}, 200);
                if( _index > 0 ){
                    $leftControl.removeClass('disabled');
                }
                if( _index >= len - curLi ){
                    $rightControl.addClass('disabled');
                }
                return false;
            });
            $leftControl.on('click',function(){
                if( $leftControl.hasClass('disabled') ) return false;
                var _index = parseInt($ul.attr('index')) - 1;
                $ul.attr('index', _index );
                $ul.stop().animate({ left:-_index*_px}, 200);
                if( _index < len - curLi ){
                    $rightControl.removeClass('disabled');
                }
                if( _index <= 0 ){
                    $leftControl.addClass('disabled');
                }
                return false;
            })
        },
        showAdd : function(){
            $('.rank .list li,.group li').on('mouseenter',function(){
                $(this).find('.add').fadeIn(200);
            }).on('mouseleave',function(){
                $(this).find('.add').fadeOut(200);
            })
        },
        /*menuHover : function(){
            $('.me-menu li:not(.add)').on('mouseenter',function(){
                $(this).addClass('hover');
            }).on('mouseleave',function(){
                $(this).removeClass('hover');
            })
        },*/
        selectBank : function(){
            $('.pay .netbank li').on('click',function(){
                $(this).addClass('selected').siblings().removeClass('selected');
            })
        },
        fixBorder : function(){
            $left = $('.main>.side');
            $right = $('.main>.content');
            if( $left.length > 0 ){
                if( $left.height() + 60 - $right.height() - 20 < 0 ){
                    //$left.css('height',$right.height()+20-60);
                }
            }
        },
        pageBar : function( opt ){
            if( !opt.wrapper || !opt.pageCount ) return false;
            var pageBarHtml = '';
            var $wrapper = $(opt.wrapper);
            var pageCount = parseInt(opt.pageCount);
            var currentPage = parseInt(opt.currentPage) || 1;
            var singleCount = parseInt(opt.singleCount) || 7;
            singleCount = singleCount%2==0?singleCount-1:singleCount;
            if(pageCount == 1){}
            else if( pageCount <= singleCount ){
                for( var i = 1 ; i < pageCount+1; i++ ){
                    pageBarHtml += i===currentPage?'<span>'+ i +'</span>':'<a href="#" data-page='+ i +'>'+ i +'</a>';
                }
            }
            else{
                //判断当前页是否是首页
                pageBarHtml += currentPage===1? '<a href="#" class="disabled">上一页</a>' : '<a href="#" data-page='+ (currentPage - 1) +'>上一页</a>';

                if( currentPage <= (singleCount+1)/2 ){
                    for( var i = 1 ; i < singleCount+1; i++ ){
                        pageBarHtml += i===currentPage?'<span>'+ i +'</span>':'<a href="#" data-page='+ i +'>'+ i +'</a>';
                    }
                }
                else if( currentPage>= pageCount- (singleCount-1)/2){
                    for( var j = pageCount - singleCount +1 ; j <= pageCount; j++ ){
                        pageBarHtml += j===currentPage ? '<span>'+ j +'</span>' : '<a href="#" data-page='+ j +'>'+ j +'</a>';
                    }
                }
                else{
                    for( var k = currentPage - (singleCount-1)/2 ; k <= currentPage + (singleCount-1)/2; k++ ){
                        pageBarHtml += k===currentPage?'<span>'+ k +'</span>':'<a href="#" data-page='+ k +'>'+ k +'</a>';
                    }
                }
                pageBarHtml += currentPage===pageCount?'<a href="#" class="disabled">下一页</a>':'<a href="#" data-page='+ (currentPage + 1) +'>下一页</a>';
            }
            $wrapper.html( pageBarHtml);

            if( opt.noajax ){
                opt.callback&&opt.callback( currentPage , pageCount );
            }
            else{
                if( !opt.init ){
                    opt.callback&&opt.callback( currentPage , pageCount );
                }
                $wrapper.find('a').on('click',function(){
                    var clickPage = $(this).data('page');
                    if( clickPage ){
                        UIEvent.pageBar({
                            wrapper : opt.wrapper,
                            currentPage : clickPage,
                            pageCount : pageCount,
                            init : false,
                            singleCount : singleCount,
                            callback : opt.callback
                        })
                    }
                    return false;
                })
            }
        }
    };
    window.UIEvent.searchHolder();
    window.UIEvent.fixBorder();
});

//通用函数定义
$.getUrlParam = function( name ){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
};

$.HTMLDecode = function(text){   
    var temp = document.createElement("div");   
    temp.innerHTML = text;   
    var output = temp.innerText || temp.textContent;   
    temp = null;   
    return output;   
};

//loading遮罩
$.loadingStart =  function(showmask){
    showmask = showmask || true;
    if(showmask){
        var mask = $('.mask');
        if(mask.length==0){
            $('<div class="mask"></div>').appendTo(document.body);
        }
        mask.show();
    }
    var loadingicon = $('.loadingicon');
    if(loadingicon.length==0){
        $('<img class="loadingicon" src="/img/loading2.gif" alt="正在加载" />').appendTo(document.body);
    }
    loadingicon.show();
};
$.loadingEnd = function(hidemask){
    hidemask = hidemask || true;
    setTimeout(function(){
        $('.loadingicon').hide();
        if(hidemask){
            $('.mask').hide();
        }
    },300);

};