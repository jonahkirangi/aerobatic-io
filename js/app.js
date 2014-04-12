/**
 * The main app module
 *
 * @type {angular.Module}
 */

// In the outer define bring in all the 3rd party dependencies.
define([
  'angular',
  'google-analytics',
  'aerobatic',
  'asset!js/move',
  'angular-route',
  'angular-animate',
  'angular-bootstrap',
  'jquery',
  'css!//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css',
  'css!http://fonts.googleapis.com/css?family=Open+Sans:300,400,600,800',
  'css!font/fontello-embedded',
  'css!css/theme',
  'css!css/custom'
], function(angular, ga, aerobatic, move) {
  'use strict';

  require([
    'asset!partials/layout',
    'asset!partials/index',
    'asset!partials/docs',
    'asset!partials/blog',
    'asset!partials/gallery',
    'asset!partials/about',
    'asset!js/aerobatic-angular'
  ], function(layoutView, indexView, docsView, blogView, galleryView, aboutView) {
    var app = angular.module('aerobatic-io', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'aerobatic']);

    // Create a custom angular service that encapsulates the communication with google analytics
    app.service('analytics', ['$rootScope', '$location', '$log', function($rootScope, $location, $log) {
      // http://burgiblog.com/2013/07/09/google-analytics-and-requirejs/
      $rootScope.$on('$viewContentLoaded', function() {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#send
        $log.info("Page view changed to " + $location.path());
        ga('send', 'pageview', {
          page: $location.path()
        });
      });

      return {
        initialize: function() {
          // Initialize google analytics tracking
          ga('create', aerobatic.config.settings.GOOGLE_ANALYTICS_TRACK_CODE, {});
        }
      };
    }]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
          template: indexView
        }).when('/docs', {
          template: docsView
        }).when('/blog', {
          template: blogView
        }).when('/about', {
          template: aboutView
        }).when('/gallery', {
          template: galleryView
        }).otherwise({
          redirectTo: '/'
        });
      }
    ]);

    app.run(['$log', 'analytics', function ($log, analytics) {
      $log.info("Angular app aerobatic-io run event");
      analytics.initialize();
    }]);

    var headerCtrl = function($scope, $location) {
      // http://plnkr.co/edit/OlCCnbGlYWeO7Nxwfj5G?p=preview
      $scope.navCollapsed = true;

      $scope.toggleNav = function() {
        $scope.navCollapsed = !$scope.navCollapsed;
      }
    };

    headerCtrl.$inject = ['$scope', '$location'];
    app.controller('HeaderCtrl', headerCtrl);

    app.animation('.my-slide-animation', function() {
      return {
        // TODO: Replace with move.js css3 animations
        enter : function(element, done) {
          // move(element[0])
          //   .set('display', 'block')
          //   .set('position', 'absolute')
          //   .set('z-index', 100)
          //   .set('top', 600)
          //   .set('opacity', 0)
          //   .then()
          //   .translate(0, 0)
          //   .duration('.2s')
          //   .set('opacity', 1)
          //   .end(done);

          jQuery(element).css({
            position:'absolute',
            'z-index':100,
            top:600,
            opacity:0
          });

          jQuery(element).animate({
            top:0,
            opacity:1
          }, done);
        },

        leave : function(element, done) {
          // move(element[0])
          //   .set('opacity', '1')
          //   .duration('.2s')
          //   .end(done);

          jQuery(element).css({
            position:'absolute',
            'z-index':101,
            top:0,
            opacity:1
          });
          jQuery(element).animate({
            top:-600,
            opacity:0
          }, done);
        }
      };
    });

    angular.element(document).ready(function() {
      // Append an ng-view to the body to load our partial views into
      angular.element(document.body).append(angular.element(layoutView));
      angular.bootstrap(document, ['aerobatic-io']);
    });
  });
});
