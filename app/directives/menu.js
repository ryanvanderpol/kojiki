const angular = require('angular'),
      $ = require('jquery');

angular.module('kojiki').directive('menu', () => {
    return {
        restrict: 'A',
        scope: {
        },
        link: function (scope, element) {

            let hide = function($menu){
                $menu.removeClass("show-menu");
            };

            $(element).find('.dropdown-button').click(function() {
                var $button, $menu;
                $button = $(this);
                $menu = $button.siblings(".dropdown-menu");
                $menu.children("li").click(() => hide($menu));
                //setTimeout(() => $(document.body).click(() => hide($menu)));
                $menu.toggleClass("show-menu");
              });
        }
    };
});
