$(function () {
    // Init
    visualLoad();
    fixedNav($(".navs")); // 상단 네비 고정
    modalOn(); // 모달 ON
    modalOff(); // 모달 OFF

    // 상단 NAV TAB 전환
    var $navTop = $(".nav_list").offset().top;
    var $navItem = $(".nav_list > li > a"),
        $navCont = $(".content .section");

    $navItem.on("click", function(){
    var _this = $(this).closest("li"),
        _idx = _this.index()+1;

        _this.siblings("li").removeClass("is-on");
        _this.addClass("is-on");

        $(".tab_cont"+_idx).addClass("is-shown").siblings().removeClass("is-shown");

        $("html, body").stop(true,false).animate({scrollTop : $navTop},200);
        return false;        
    });

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
        $('.qstep-2').show();
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
        
    $lay2_2.find(".btn-next").on("click", function(){
        $lay2_2.fadeOut(200);
        $lay2_1.fadeIn(200, function(){
            // 사연 작성하기 닫기 
            $lay2_1.find(".btn-info").on("click", function(){
                // 배송지 입력 종료 
                $lay2_1.fadeOut(500);
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

// 상단 네비 Fixed
function fixedNav(target) {
    var elemTop = target.offset().top;
    $(document).on("scroll", function () {
        var docViewTop = $(window).scrollTop();
        if(docViewTop > elemTop) {
            target.addClass('is-fixed');
        } else {
            target.removeClass('is-fixed');
        }
    });
}

// 레이어 열기
var modalOn = function(target){
    var layer = target;
    $(layer).fadeIn();

    $(".btn-privacy").on("click", function(){
        $("#layPrivacy").fadeIn();
    })
}

// 레이어 닫기
var modalOff = function(target){
    var layclose = $(".lay-wrap .btn-cls, .lay-wrap .btn-confirm"); // 닫기 영역

    layclose.on("click", function(){
        $(this).closest(".lay-wrap").fadeOut(100)
    })
}


// 드래그 작동
function dragSet() {
    $("#gate").removeClass('dropped');  // 초기화를위한 클래스제거
    $(".dragbtn.winning").css('background', 'url(./apps/imgs/w_drag_logo1.png) 50% 50% no-repeat'); // 초기화를위한 배경삽입
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
