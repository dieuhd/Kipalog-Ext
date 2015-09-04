/**
 * Created by hoangdieu on 8/30/15.
 */
(function (angular) {
    'use strict';

    function getCookie(cname) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return '';
    }


    var pagination = document.createElement('div');
    pagination.id = 'PaginationCtrl';
    pagination.innerHTML = "<nav>"
        +"<ul class=\"pagination\">"
        +"<li ng-click='previousPage()' class='{{nextClass}}'>"
        +"<a aria-label=\"Previous\">"
        +"<span aria-hidden='true'>&laquo;</span>"
        +"</a>"
        +"</li>"
        +"<li ng-repeat='p in pages' ng-class=\"{'active':currentPage == p.page }\" ng-click='gotoPage(p.page)'><a ng-bind='p.page'></a></li>"
        +"<li ng-click='nextPage()' class='{{previousClass}}'>"
        +"<a aria-label=\"Next\">"
        +"<span aria-hidden='true'>&raquo;</span>"
        +"</a>"
        +"</li>"
        +"</ul>"
        +"</nav>";

    var feedController = $('[ng-controller="FeedController"]');
    feedController.append(pagination);

    setTimeout(function(){
        var scope = angular.element('[ng-controller="FeedController"]').scope();
        scope.$apply(function(){
            var max_page = getCookie('ext_max_page')+0;
            if( max_page != 5 && max_page != 15){
                scope.MAX_PAGE = 10;
            } else {
                scope.MAX_PAGE = max_page;
            }
            var pages = [];
            for(var i= 0; i< scope.MAX_PAGE ; i++){
                pages[i] = {
                    page    :i+1
                };
            }
            scope.pages = pages;
            scope.default_pages = pages;

            scope.gotoPage = function(page){
                if(page >0 && page <= scope.MAX_PAGE && !scope.goingpage) {
                    scope.goingpage = true;
                    $.get(
                        "/posts/pagination",
                        {
                            page: page,
                            filter: scope.focus
                        },
                        function (data) {
                            scope.$apply(function () {
                                scope.pages = angular.copy(scope.default_pages);
                                scope.currentPage = page;
                                if(scope.currentPage == 1){
                                    scope.nextClass = 'disabled';
                                } else if(scope.currentPage == scope.MAX_PAGE){
                                    scope.previousClass = 'disabled';
                                }
                                scope.goingpage = false;
                                scope.posts = data;
                            });
                        }
                    );
                }
            };
            scope.nextPage = function(){
                scope.gotoPage(scope.currentPage+1);
            };
            scope.previousPage = function(){
                scope.gotoPage(scope.currentPage-1);
            };
        });
        var injector = angular.injector(['ng']);
        injector.invoke(function ($compile) {
            $compile(angular.element("#PaginationCtrl").contents())(scope);
        });
    },100);


})(window.angular);