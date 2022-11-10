$(function () {
    // Init
    visualLoad();
    navScrActive();

    getImgSize($("#photo .thumb")); // 페이스북 캡쳐 영역 이미지 사이즈 체크

    $(window).on("scroll", function(){
        navScrActive();
    })
    // 영상 탭 전환
    var $quizItem = $(".quiz_tab > li > a");
    $quizItem.on("click", function(){
        var _this = $(this).closest("li"),
            _idx = _this.index()+1;

        _this.siblings("li").removeClass("is-on");
        _this.addClass("is-on");

        $(".quiz_cont-"+_idx).addClass("is-shown").siblings(".quiz_cont").removeClass("is-shown");

        if(_idx == 2) {
            $("#playVod").attr("src", "https://www.youtube.com/embed/JUZzQPBied4?autoplay=1&mute=0")
        }else{
            $("#playVod").attr("src", "")
        }

        return false;
    });

    // 양지은 TVC 영상 탭 스텝
    $('.btn-play').on('click', function(){
        $('.qstep-1').hide();
        $('.qstep-2').show().append("<div id=\"qstep-2-video\"></div>"); // 동영상 영역 노출 후 append
        onYouTubeIframeAPIReady();
    })
    $('.btn-skip').on('click', function(){
        stopVideo($('#qstep-2-video'));
        $('.qstep-2').remove();
        $('.qstep-3').show();

        setTimeout(function(){
            $('.qstep-3').hide();
            $('.qstep-4').show();

            $(".ico-coretein").addClass("move");
        }, 1000)  // 나중에 시간설정 필요. 작동여부만확인위해 1000
    })
    dragSet();


    // 드래그 레이어 노출 순서
    var $lay1_1 = $("#laySuccess"),          // 레이어1-1, 정답
        $lay1_2 = $("#layReady"),            // 레이어1-2, 추첨 로딩 n초후 제거
        $lay1_3 = $("#laywinning"),          // 레이어1-3, 축하 레이어
        $lay1_4 = $("#layDeliveryinfo"),     // 레이어1-4, 배송지 입력 폼
        $lay1_5 = $("#layFail");             // 레이어1-5, 실패!

    // 정답->로딩->축하->배송지 입력
    $lay1_1.find(".btn-info").on("click", function(){
        $lay1_1.fadeOut(200);
        $lay1_2.fadeIn(200, function(){
            // 로딩 n초후 제거
            setTimeout(function(){
                $lay1_2.fadeOut(200);

                // 축하 레이어 노출
                setTimeout(function(){
                    $lay1_3.fadeIn(200, function(){
                        // 당첨 상품 노출
                        var _num = 3; // 임의의 당첨 번호

                        $lay1_3.find(".scs_gift").hide()
                        $lay1_3.find(".scs_gift-"+_num).show();

                        // 주소입력 클릭
                        $lay1_3.find(".btn-address").on("click", function(){
                            $lay1_3.fadeOut();

                            // 주소 입력 폼 노출
                            $lay1_4.fadeIn(200, function(){
                                $(this).find(".btn-info").on("click", function(){
                                    // 배송지 입력 종료
                                    $lay1_4.closest(".lay-wrap").fadeOut(500);
                                })
                            });
                        });
                    });
                },500);
            },2000);
        });
    });

    // 사연 작성하기 레이어 노출
    var $lay2_1 = $("#layWrite"),            // 레이어2-1, 사연 작성하기
        $lay2_2 = $("#layPhotoAdd"),         // 레이어2-2, 사진 첨부하기
        $lay2_3 = $("#layThanksSns"),        // 레이어2-3, 응모 감사, SNS공유
        $lay2_4 = $("#layPhotoDown");        // 레이어2-4, 이미지 다운로드

    $lay2_1.find(".btn-info").on("click", function(){
        $lay2_1.fadeOut(200);
        $lay2_2.fadeIn(200, function(){
            getImgSize("#addPhoto .thumb");
            // 사연 작성하기 닫기
            $lay2_2.find(".btn-next").on("click", function(){
                // 배송지 입력 종료
                $lay2_2.fadeOut(500);
                setTimeout(function(){
                    $lay2_3.fadeIn(200);
                }, 500)
            });
        })
    })

    // 구매인증 레이어 노출
    var $lay3_1 = $("#layPurchase"),            // 레이어3-2, 구매인증 폼
        $lay3_2 = $("#layComplete");        // 레이어3-3, 응모 완료

    // 구매인증 파일 찾기 후 파일명 넣기
    $("#fileInput").on("change", function(){
        if(window.FileReader){
            var filename = $(this)[0].files[0].name;
        }else { // old IE
            var filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출
        }
        // 추출한 파일명 삽입
        $(this).siblings('.ipt-txt').val(filename);
    });

    $lay3_1.find(".btn-info").on("click", function(){
        $lay3_1.fadeOut(500);
        setTimeout(function(){
            $lay3_2.fadeIn(200);
        }, 500)
    })

    // 개인정보
    $(".btn-privacy").on("click", function(){
        $("#layPrivacy").fadeIn();
    })

    $(".input--checkbox-item").on("click", function(){
        console.log($(this).prop('checked'));
    })
});

// 상단 타이틀 등장 모션
var visualLoad = function() {
    var $visual = $(".header");
    $visual.addClass("intro");
    setTimeout(function() {
        $visual.addClass("end");
    }, 100);
}

// 상단 네비 Fixed & Active
var navScrActive = function(){
    var $nav = $(".navs"), // scroll tabs
        $navItem = $(".nav_list > li"), // 네비 항목
        $navCont = $(".content .section"), // 각 섹션
        $areaTop = [], // 각 섹션 top
        $stickyBnr = $(".lay-sticky"); // 모바일에서 배너 FIXED
        $.each($navCont, function(idx, item){
            $areaTop[idx] = Math.floor($navCont.eq(idx).offset().top - $navItem.outerHeight());
            console.log($areaTop[idx])
        });

    // 클릭 시 해당 섹션 이동
    $navItem.find("a").on("click", function(){
        var _this = $(this).closest("li"),
            _idx = _this.index();

            console.log($areaTop[_idx])
            $("html, body").stop(true,false).animate({scrollTop : $areaTop[_idx]}, 400);
            return false;
        });

    // 스크롤 시, 상단 탭 position 변경 및 버튼 활성화
    $(window).on("scroll", function(){
        var _scrTop = $(this).scrollTop() // 현재 scroll

        if(_scrTop > $areaTop[0]) {
            $nav.addClass("is-fixed");
            $stickyBnr.addClass("is-fixed");
        }else {
            $nav.removeClass("is-fixed");            
            $stickyBnr.removeClass("is-fixed");
            $navItem.eq(0).addClass("is-on");    
        }                    
            
        if($areaTop[0] <= _scrTop && $areaTop[1] > _scrTop){
            $navItem.removeClass("is-on");
            $navItem.eq(0).addClass("is-on");
        }else if($areaTop[1] <= _scrTop && $areaTop[2] > _scrTop){
            $navItem.removeClass("is-on");
            $navItem.eq(1).addClass("is-on");
        }else if($areaTop[2] <= _scrTop && $areaTop[3] > _scrTop){
            $navItem.removeClass("is-on");
            $navItem.eq(2).addClass("is-on");
        }else if($areaTop[3] <= _scrTop){
            $navItem.removeClass("is-on");
            $navItem.eq(3).addClass("is-on");
        }
    });
};

// 레이어 열기
var modalOn = function(target){
    var layer = target;
    $(layer).fadeIn();
}

// 레이어 닫기
var modalOff = function(obj){
    $(obj).closest(".lay-wrap").fadeOut(100)
}

// 캡쳐 이미지 사이즈 체크
var getImgSize = function(obj){
    console.log(obj);
    var imgSrc = $(obj).find("img").attr("src"),
        img = new Image(),
        _w, _h;

    img.src = imgSrc;
    _w = img.width;
    _h = img.height;

    if(_w >= _h){
        // 가로형 이미지일 때, vertical-mid 클래스 추가
        $(obj).addClass("vertical-mid")
    }
}

// 드래그 작동
var dragSet = function() {
    $("#gate").removeClass('dropped');  // 초기화를위한 클래스제거
    $(".dragbtn.winning").css('background', 'url(https://cdn.coretein-event.com/assets/imgs/w_drag_logo1.png) 50% 50% no-repeat'); // 초기화를위한 배경삽입
    $(".dragbtn").draggable({
        containment:".drag_area", //이 영역 안에서만 이동
        stop: function () {
            $(this).css({
                'top' : '',
                'left' : ''
            });
        }
    });

    // 드롭 작동
    $("#gate").droppable({
        // accept: ".winning", 해당 클래스를 가진경우에만 작동하기에 다른이벤트 넣기 어려워 다른방법으로 처리
        drop: function(event, ui) {
            // 드래그버튼 드랍시 조건, 이벤트해당하는 엘리먼트의 winning 클래스존재여부
            if($(event['toElement']).hasClass('winning')) {
                $(this).addClass("dropped"); // 작동시 클래스생성 - 배경생성
                $(".dragbtn.winning").css('background', 'none'); // 배경제거
                modalOn("#laySuccess");

                // 드랍 후 실수로 레이어 끈 사람은 로고 클릭하여 레이어 재오픈
                $(".dropzone.dropped").on("click", function(){
                    modalOn("#laySuccess");
                })
            } else {
                modalOn("#layFail");
            }

            $(".dragbtn").draggable('destroy'); // 드래그 막음
        }
    });
}

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    var player = new YT.Player('qstep-2-video' , {
        height: '100%',
        width: '100%',
        playerVars: {'autoplay': 1, 'controls': 0, 'playsinline': true},
        videoId: 'JUZzQPBied4',
        rel : 0,
        events: {
            'onStateChange': onPlayerStateChange,
            // 'onReady': onPlayerReady,
        }
    });
}

function onPlayerStateChange(event) {
    // -1:시작되지않음 , 0:종료,1:재생중, 2:정지, 3:버퍼링중, 5:스킵된
    if(event.data === 0) {
        stopVideo($('#qstep-2-video'));
        $('.qstep-2').remove();
        $('.qstep-3').show();

        setTimeout(function(){
            $('.qstep-3').hide();
            $('.qstep-4').show();
        }, 1000)  // 나중에 시간설정 필요. 작동여부만확인위해 1000
    }
    /* if(event.data === 2) {
        alert("정지")
    } */
}

function stopVideo(target) {
    target.prop('src', '');
}
