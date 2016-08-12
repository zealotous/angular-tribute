'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Tribute = _interopDefault(require('tributejs/src'));

if (typeof Tribute === 'undefined') {
  throw new Error('[AngularTribute] cannot locate tributejs!');
}

var AngularTribute = function AngularTribute($timeout) {
  return {
    restrict: 'A',
    scope: {
      values: '=',
      options: '=',
      onReplaced: '&',
      onNoMatch: '&'
    },
    controller: function controller($scope) {
      this.$onDestroy = function () {
        $scope.tribute.hideMenu();
      };
    },
    compile: function compile($element, $attrs) {
      var _this = this;

      return function ($scope, $element, $attrs) {
        if (typeof $scope.options === 'array') {
          $scope.tribute = new Tribute({
            collection: $scope.options
          });
        } else {
          $scope.tribute = new Tribute(angular.merge({
            values: $scope.values
          }, $scope.options || {}));
        }
        // Update first collection when values changed
        $scope.$watch('values', function (newValue, oldValue) {
          $scope.tribute.append(0, newValue, true);
        });

        $scope.tribute.attach($element[0]);

        $element[0].addEventListener("tribute-replaced", function (e) {
          if (typeof $scope.onReplaced !== 'function') return;
          $timeout($scope.onReplaced.apply(_this));
        });
        $element[0].addEventListener("tribute-no-match", function (e) {
          if (typeof $scope.onNoMatch !== 'function') return;
          $timeout($scope.onNoMatch.apply(_this));
        });
      };
    }
  };
};

AngularTribute.$inject = ['$timeout'];

module.exports = AngularTribute;