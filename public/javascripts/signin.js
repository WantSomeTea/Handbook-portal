/**
 * Created by pavtr_000 on 11.03.2016.
 */
angular.module('handbookApp', []).controller('handbookController', function ($scope, $http) {

  $scope.signin = function () {
    $http.post('/api/signin/signin?username=' + $scope.formAdmin.username + '&password=' + $scope.formAdmin.password)
      .success(function (data, status, headers, config) {
        if (status == 200) {
          window.location.href = '/';
        }
      }).error(function (data, status, headers, config) {
      if (status == 404) {
        noty({
          text: 'Неверное имя пользователя или пароль',
          layout: 'topRight',
          type: 'error',
          timeout: 5000
        });
      }
    });
  };
});