import Tribute from 'tributejs/src';

if (typeof Tribute === 'undefined') {
  throw new Error('[AngularTribute] cannot locate tributejs!');
}

const AngularTribute = ($timeout) => ({
  restrict: 'A',
  scope: {
    values: '=',
    options: '=',
    onReplaced: '&',
    onNoMatch: '&'
  },
  controller: function($scope) {
    this.$onDestroy = () => {
      $scope.tribute.hideMenu();
    };
  },
  compile($element, $attrs) {
    return ($scope, $element, $attrs) => {
      if (typeof $scope.options === 'array') {
        $scope.tribute = new Tribute({
          collection: $scope.options
        });
      } else {
        $scope.tribute = new Tribute(angular.merge({
          values: $scope.values
        }, ($scope.options || {})));
      }
      // Update first collection when values changed
      $scope.$watch('values', (newValue, oldValue) => {
        $scope.tribute.append(0, newValue, true);
      });

      $scope.tribute.attach($element[0]);

      $element[0].addEventListener("tribute-replaced", (e) => {
        if (typeof $scope.onReplaced !== 'function') return;
        $timeout($scope.onReplaced.apply(this));
      });
      $element[0].addEventListener("tribute-no-match", (e) => {
        if (typeof $scope.onNoMatch !== 'function') return;
        $timeout($scope.onNoMatch.apply(this));
      });
    }
  }
});

AngularTribute.$inject = ['$timeout'];

export default AngularTribute;
