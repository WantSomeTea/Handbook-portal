/**
 * Created by pavtr_000 on 11.03.2016.
 */
var app = angular.module('handbookApp', ['ui.mask']).controller('handbookController', function ($scope, $http) {
  $scope.employees = [];
  $scope.formEmployee = {};
  $scope.paginator = {currentPage: 1};
  $scope.pageLimit = 10;
  $scope.filterStr = "";
  $scope.sortField = 'name';
  $scope.sortDir = "A";
  $scope.formState = {};
  $scope.Prop = "name";
  $scope.formAdmin = {};
  $scope.resetPass = {};
  $scope.resetForm = {};
  $scope.settings = {};
  $scope.invalid = true;
  $scope.docHeaders = [];
  $scope.compare = {};
  $scope.sendedObj = [];
  $scope.parsingError = [];
  $scope.showTable = false;
  $scope.showRows = false;
  $scope.users = [];
  $scope.docObject = [];
  $scope.notAllItems = [];
  $scope.dataLoaded = false;
  $scope.newNameField = false;

  $scope.init = function () {
    $scope.search("");
    $http.get('/api/settings/getSettings')
      .success(function (data, status, headers, config) {
        $scope.departments= data.departments;
        $scope.jobs = data.jobs;
      })
  };

  $scope.getMenuItemClass = function (uri) {
    return uri == '/' ? "active" : "";
  };

  $scope.clearModal = function () {
    $scope.formEmployee = {};
    $scope.formState = {};
  };

  $scope.saveEmployee = function () {

    $http.post('/api/employees',$scope.formEmployee).success(function (data, status, headers, config) {
      $scope.search("");
      $scope.formState = {};
      $scope.formEmployee = {};
      noty({
        text: 'Пользователь добавлен',
        layout: 'bottomRight',
        type: 'success',
        timeout: 5000
      });

    }).error(function (data, status, headers, config) {
      if (status == 403) {
        window.location.href = '/signin';
      } else {
        noty({
          text: 'Ошибка добавления пользователя, повторите попытку позже',
          layout: 'bottomRight',
          type: 'error',
          timeout: 5000
        });
      }
    });
  };

  $scope.search = function () {
    $http.get('/api/employees/search?page=' + $scope.paginator.currentPage + '&limit=' + $scope.pageLimit + '&sort=' + $scope.sortField + '&sortDir=' + $scope.sortDir)
      .success(function (data, status, headers, config) {
        var employees = data.objects.map(function (employee) {
          employee.name = employee.second_name + ' ' + employee.first_name + ' ' + employee.middle_name;
          return employee;
        });

        $scope.dataLoaded = true;
        $scope.employees = employees;
        $scope.paginator = data.paginator;
      }).error(function (data, status, headers, config) {
      if (status == 403) {
        window.location.href = '/signin';
      } else {
        noty({
          text: data,
          layout: 'bottomRight',
          type: 'error',
          timeout: 5000
        });
      }
    });
  };

  $scope.setPageLimit = function (newLimit) {
    $scope.pageLimit = newLimit;
    $scope.paginator.currentPage = 1;
    $scope.search();
  };

  $scope.setCurrentPage = function (newCurrentPage) {
    $scope.paginator.currentPage = newCurrentPage;
    $scope.search();
  };

  $scope.setSort = function (field) {
    if ($scope.sortField == field) {
      if ($scope.sortDir == "A") {
        $scope.sortDir = "Z";
      } else {
        $scope.sortField = "";
        $scope.sortDir = "A";
      }
    } else {
      $scope.sortField = field;
      $scope.sortDir = "A";
    }
    $scope.search();
  };

  $scope.getSortClass = function (field) {
    return field == $scope.sortField ? ("fa fa-sort-" + ($scope.sortDir == "A" ? "desc" : "asc")) : "";
  };

  $scope.getPageLimitClass = function (limit) {
    return limit == $scope.pageLimit ? "active" : "";
  };

  $scope.editEmployee = function (obj) {
    $scope.formState = angular.copy(obj);
    $scope.formEmployee = angular.copy(obj);
  };

  $scope.delEmployee = function (obj) {
    if (confirm('Вы действительно хотите удалить этого пользователя?')) {
      $http.delete('/api/employees/' + obj.phoneNumber).success(function (data, status, headers, config) {
        noty({
          text: data.msg,
          layout: 'bottomRight',
          type: 'success',
          timeout: 5000
        });

        for (var i = 0, objs = $scope.employees; i < objs.length; i++) {
          if (objs[i] === obj) {
            $scope.employees.splice(i, 1);
          }
        }

      }).error(function (data, status, headers, config) {
        if (status == 403) {
          window.location.href('/signin');
        } else {
          noty({
            text: data.responseText,
            layout: 'bottomRight',
            type: 'error',
            timeout: 5000
          });
        }
      });
    }
  };

}).filter('phoneNumber', function () {
  return function (tel) {
    if (!tel) {
      return '';
    }
    var value = tel.toString().trim().replace(/^\+/, '');
    if (value.match(/[^0-9]/)) {
      return tel;
    }
    var country,
      city,
      number;

    if (value.length == 11) {
      country = value[0];
      city = value.slice(1, 4);
      number = value.slice(4);
    } else {
      return tel;
    }
    number = number.slice(0, 3) + '-' + number.slice(3);
    return ('+' + country + " (" + city + ") " + number).trim();
  };
});

app.directive('numbersOnly', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        if (text) {
          var transformedInput = text.replace(/[^0-9]/g, '');

          if (transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
          }
          return transformedInput;
        }
        return undefined;
      }

      ngModelCtrl.$parsers.push(fromUser);
    }
  };
});

app.directive('customOnChange', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', function (event) {
        var files = event.target.files;
        onChangeFunc(files);
      });

      element.bind('click', function () {
        element.val('');
      });
    }
  };
});