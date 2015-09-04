'use strict';

angular.module('KipalogExt',[])
.controller('OptionCtrl',function($scope){
        $scope.max_page = 10;

        console.log(chrome.cookies.get({
            name : 'ext_max_page',
            url : 'http://kipalog.com'
        }, function(){

        }));
        chrome.cookies.getAll({},function (cookies){
            console.log(cookies);
            for(var i=0;i<cookies.length;i++){
                if(cookies[i].name == 'ext_max_page'){
                    console.log(cookies[i]);
                    $scope.$apply(function(){

                        $scope.max_page = parseInt(cookies[i].value);
                    });

                }
            }
        });

        $scope.currentPage = 1;
        $scope.$watch('max_page',function(newval){
            $scope.pages = [];
            console.log(newval);
            $scope.setCookies('ext_max_page',$scope.max_page);
            for(var i = 0 ; i < $scope.max_page; i++){
                $scope.pages[i] = i+1;
            }
        });
        $scope.gotoPage = function(p){
            if(p > 0 && p <= $scope.max_page)
            {
                $scope.currentPage = p;
            }
        };
        $scope.previousPage = function(){
            $scope.gotoPage($scope.currentPage-1);
        };
        $scope.nextPage = function(){
            $scope.gotoPage($scope.currentPage+1);
        };

        $scope.setCookies = function(name,value){
            chrome.cookies.set({
                name:name,
                value:''+value,
                url:'http://kipalog.com',
                domain:'kipalog.com',
                secure : true,
                expirationDate:(new Date(2020,12,31,23,59,59)).getTime()/1000
            },function(cookie){

            });
        };
    });