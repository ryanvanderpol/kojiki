const angular = require('angular'),
      $ = require('jquery');

angular.module('kojiki').directive('menu', () => {
    return {
        restrict: 'A',
        scope: {
        },
        link: function (scope, element) {

            let $button = $(element).find('.dropdown-button');

            let hide = function($menu){
                $menu.removeClass("show-menu");
            };

            $button.click(event => {
                
                let $menu = $button.siblings(".dropdown-menu");
                $menu.children("li").click(() => hide($menu));
                $menu.toggleClass("show-menu");

                //event.stopImmediatePropagation();

                $('html').click(e => {
                    let parentButton = $(e.target).parents('.dropdown-button');
                    if(!parentButton[0] || parentButton[0] != $button[0]){
                        hide($menu);
                    }
                }); 
            });
        }
    };
});
