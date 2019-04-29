function OnRun($rootScope, AppSettings, $state,$localStorage) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
      if( toState.name == 'access.login' ){
        // event.preventDefault();
        // $state.go('app.index');
      }      
      if ( !Object.keys($localStorage.data).length && toState.name != 'access.login' ) {
        $state.go('access.login', {}, { reload: true });
        event.preventDefault();
      }

      var ua = navigator.userAgent,
                event = (ua.match(/iP/i)) ? function(){
                  console.log('iphone');
                  $('#wrapper').toggleClass('enlarged');
                  $('#wrapper').addClass('forced');
                } : null;

    })
    
    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
        if( $('body').hasClass('mobile')   ){
          $('#wrapper').addClass('enlarged');
          $('#wrapper').addClass('forced');
        }
        $('meta[name="product_id"]').remove();
        $('meta[name="reference"]').remove();
        
        $rootScope.pageTitle = '';

        if (toState.title) {
            $rootScope.pageTitle += toState.title;
            $rootScope.pageTitle += ' \u2014 ';
        }
        $rootScope.pageTitle += AppSettings.appTitle;
        $('body').attr('class', '');
        $('body').addClass('fixed-left');
        if (toState.bodyClass) {
            $('body').addClass(toState.bodyClass);
        }
        $('body').animate({ scrollTop: 0 }, 'slow');
 
        jQuery(document).ready(function($) {
         
           // $('.select2').select2({
           //  'language': {
           //       'noResults': function(){
           //           return 'Aucun résultat trouvé';
           //       }
           //   },
           // });
               
           var ua = navigator.userAgent,
                event = (ua.match(/iP/i)) ? 'touchstart' : 'click';

              $('.dropdown-toggle-devis').unbind(event);
              $('.dropdown-toggle-devis').bind(event, function(event) {
                $(this).parent().toggleClass('open');
              })
                





           
            var Sidemenu = function() {
                this.$body = $('body'),
                this.$openLeftBtn = $('.open-left')
            };
            Sidemenu.prototype.openLeftBar = function() {
              $('#wrapper').toggleClass('enlarged');
              $('#wrapper').addClass('forced');

              if($('#wrapper').hasClass('enlarged') && $('body').hasClass('fixed-left')) {
                $('body').removeClass('fixed-left').addClass('fixed-left-void');
              } else if(!$('#wrapper').hasClass('enlarged') && $('body').hasClass('fixed-left-void')) {
                $('body').removeClass('fixed-left-void').addClass('fixed-left');
              }

              if($('#wrapper').hasClass('enlarged')) {
                $('.left ul').removeAttr('style');
              } else {
                $('.subdrop').siblings('ul:first').show();
              }

              toggle_slimscroll('.slimscrollleft');
              $('body').trigger('resize');
            },

            //init sidemenu
            Sidemenu.prototype.init = function() {
              var $this  = this;

              var ua = navigator.userAgent,
                event = (ua.match(/iP/i)) ? 'touchstart' : 'click';

              //bind on click
              this.$openLeftBtn.unbind(event);
              this.$openLeftBtn.bind(event, function(e) {
                e.stopPropagation();
                $this.openLeftBar();
              });

              $('#sidebar-menu > ul > li > a').unbind(event);
              $('#sidebar-menu > ul > li > a').bind(event, function(event) {
                $(this).parents('li').siblings('.has_sub').each(function(index, el) {
                  $(el).find('.subdrop').removeClass('subdrop'); 
                  $(el).find('.active').removeClass('active'); 
                  $(el).find('ul').slideUp(350);
                });

              });

              $('#sidebar-menu .has_sub > a').unbind(event);
              $('#sidebar-menu .has_sub > a').bind(event, function(event) {
                $(this).parent().siblings('.has_sub').each(function(index, el) {
                  $(el).find('.subdrop').removeClass('subdrop'); 
                  $(el).find('.active').removeClass('active'); 
                  $(el).find('ul').slideUp(350);
                });
                if( $(this).hasClass('subdrop') ){
                  $(this).next('ul').slideUp(350);
                  $(this).removeClass('subdrop');
                }else{
                  $(this).addClass('active');
                  $(this).next('ul').slideDown(350);
                  $(this).addClass('subdrop');
                }
              });

              $('#sidebar-menu a').each(function() {
                  if (window.location.href.indexOf(this.href) > -1) {
                      $(this).parent('li').addClass('active');
                      $(this).parent('li').siblings().removeClass('active');
                      $(this).parents('.has_sub').find('ul').slideDown(350);
                      $(this).parents('.has_sub').find('a').first().addClass('subdrop');
                  }
              });
              
            },

            //init Sidemenu
            $.Sidemenu = new Sidemenu, $.Sidemenu.Constructor = Sidemenu
 

            var FullScreen = function() {
                this.$body = $('body'),
                this.$fullscreenBtn = $('#btn-fullscreen')
            };

            //turn on full screen
            // Thanks to http://davidwalsh.name/fullscreen
            FullScreen.prototype.launchFullscreen  = function(element) {
              if(element.requestFullscreen) {
                element.requestFullscreen();
              } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
              } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
              } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
              }
            },
            FullScreen.prototype.exitFullscreen = function() {
              if(document.exitFullscreen) {
                document.exitFullscreen();
              } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
              } else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
              }
            },
            //toggle screen
            FullScreen.prototype.toggle_fullscreen  = function() {
              var $this = this;
              var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
              if(fullscreenEnabled) {
                if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                  $this.launchFullscreen(document.documentElement);
                } else{
                  $this.exitFullscreen();
                }
              }
            },
            //init sidemenu
            FullScreen.prototype.init = function() {
              var $this  = this;
              //bind
              var ua = navigator.userAgent,
              event = (ua.match(/iP/i)) ? 'touchstart' : 'click';
              $this.$fullscreenBtn.unbind(event);
              $this.$fullscreenBtn.bind(event, function() {
                $this.toggle_fullscreen();
              });
            },
             //init FullScreen
            $.FullScreen = new FullScreen, $.FullScreen.Constructor = FullScreen
 

        
            var App = function() {
                this.VERSION = '1.3.0',
                this.AUTHOR = 'Coderthemes',
                this.SUPPORT = 'coderthemes@gmail.com',
                this.pageScrollElement = 'html, body',
                this.$body = $('body')
            };

             //on doc load
            App.prototype.onDocReady = function(e) {
              // FastClick.attach(document.body);
              // resizefunc.push('initscrolls');
              // resizefunc.push('changeptype');

              $('.animate-number').each(function(){
                $(this).animateNumbers($(this).attr('data-value'), true, parseInt($(this).attr('data-duration')));
              });

              //RUN RESIZE ITEMS
              $(window).resize(debounce(resizeitems,100));
              $('body').trigger('resize');

              // right side-bar toggle
              var ua = navigator.userAgent,
              event = (ua.match(/iP/i)) ? 'touchstart' : 'click';
              $('.right-bar-toggle').unbind(event);
              $('.right-bar-toggle').bind(event, function(e){
                  $('#wrapper').toggleClass('right-bar-enabled');
              });


            },
            //initilizing
            App.prototype.init = function() {
                var $this = this;
                //document load initialization
                $(document).ready($this.onDocReady);
                //init side bar - left
                $.Sidemenu.init();
                //init fullscreen
                $.FullScreen.init();
            },

            $.App = new App, $.App.Constructor = App
         
            $.App.init();
        

        /* ------------ some utility functions ----------------------- */
        //this full screen
        var toggle_fullscreen = function () {

        }

        function executeFunctionByName(functionName, context /*, args */) {
          var args = [].slice.call(arguments).splice(2);
          var namespaces = functionName.split('.');
          var func = namespaces.pop();
          for(var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
          }
          return context[func].apply(this, args);
        }
        var w,h,dw,dh;
        var changeptype = function(){
            w = $(window).width();
            h = $(window).height();
            dw = $(document).width();
            dh = $(document).height();

            if(window.mobileAndTabletcheck() === true){
                $('body').addClass('mobile').removeClass('fixed-left');
            }

            if(!$('#wrapper').hasClass('forced')){
              if(w > 1024){
                $('body').removeClass('smallscreen').addClass('widescreen');
                  $('#wrapper').removeClass('enlarged');
              }else{
                $('body').removeClass('widescreen').addClass('smallscreen');
                $('#wrapper').addClass('enlarged');
                $('.left ul').removeAttr('style');
              }
              if($('#wrapper').hasClass('enlarged') && $('body').hasClass('fixed-left')){
                $('body').removeClass('fixed-left').addClass('fixed-left-void');
              }else if(!$('#wrapper').hasClass('enlarged') && $('body').hasClass('fixed-left-void')){
                $('body').removeClass('fixed-left-void').addClass('fixed-left');
              }

          }
          toggle_slimscroll('.slimscrollleft');
        }


        var debounce = function(func, wait, immediate) {
          var timeout, result;
          return function() {
            var context = this, args = arguments;
            var later = function() {
              timeout = null;
              if (!immediate) result = func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(context, args);
            return result;
          };
        }

        function resizeitems(){
            initscrolls();
            changeptype();
          if($.isArray(resizefunc)){
            for (i = 0; i < resizefunc.length; i++) {
                window[resizefunc[i]]();
            }
          }
        }
        window.mobileAndTabletcheck = function() {
          var check = false;
          (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
          return check;
        };

        function initscrolls(){
            if(window.mobileAndTabletcheck() !== true){
              //SLIM SCROLL
              $('.slimscroller').slimscroll({
                height: 'auto',
                size: '5px'
              });

              $('.slimscrollleft').slimScroll({
                  height: 'auto',
                  position: 'right',
                  size: '7px',
                  color: '#bbb',
                  wheelStep: 7
              });
          }
        }
        function toggle_slimscroll(item){
            if($('#wrapper').hasClass('enlarged')){
              $(item).css('overflow','inherit').parent().css('overflow','inherit');
              $(item). siblings('.slimScrollBar').css('visibility','hidden');
            }else{
              $(item).css('overflow','hidden').parent().css('overflow','hidden');
              $(item). siblings('.slimScrollBar').css('visibility','visible');
            }
        }

        
            var dropdown = $('#setting-dropdown');

            // Add slidedown animation to dropdown
            dropdown.unbind('show.bs.dropdown');
            dropdown.bind('show.bs.dropdown', function(e){
                $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
            });

            // Add slideup animation to dropdown
            dropdown.unbind('hide.bs.dropdown');
            dropdown.bind('hide.bs.dropdown', function(e){
                $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
            });
        
        // Loader
      
            $('#status').fadeOut();
            $('#preloader').delay(350).fadeOut('slow');
            $('body').delay(350).css({
                'overflow': 'visible'
            });
          
            
        });



    });
}
export default OnRun;
