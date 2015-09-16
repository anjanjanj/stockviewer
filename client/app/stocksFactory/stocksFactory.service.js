'use strict';

angular.module('stocks2App')
  .factory('stocksFactory', function($q, $http) {
    // Service logic
    // ...

    function pad(n) {return (n<10 ? '0'+n : n);}

    function collectStockData(stockCode) {
      return $q(function(resolve, reject) {
        //if (typeof stockCode !== 'string') reject('Invalid');
        stockCode = stockCode.toUpperCase();

        var date = new Date(Date.now());
        var year = date.getFullYear();
        var month = pad(date.getMonth() + 1);
        var day = pad(date.getDate());
        var url = 'https://www.quandl.com/api/v3/datasets/WIKI/' + stockCode + '/data.json?end_date='+year+'-'+month+'-'+day+'&limit=365&order=desc &callback=JSON_CALLBACK';
        var stockData = $http.get(url);
        stockData.then(function(response) {
          response.data.code = stockCode;

          var results = {
            name: stockCode,
            data: []
          };
          _.forEach(response.data.dataset_data.data, function(day) {
            results.data.push([new Date(day[0]).getTime(), day[1]]);
          });

          //console.log(results);
          //console.log(response.data);

          resolve(results);
        }, function(error) {
          reject(error);
        });
      });
    }

    function getData(stock) {

      return collectStockData(stock);
      //.then(function(result) {
      //});
    }

    /*
    var code = $scope.awesomeThings[0];
    code = code.toUpperCase();
    $scope.series.push(code);
    console.log(code);

    var url = 'https://www.quandl.com/api/v3/datasets/WIKI/' + code + '/data.json?end_date=2015-09-13&limit=7&order=desc &callback=JSON_CALLBACK';
    var stockData = $http.get(url);

    stockData.then(function(response) {
      var daysData = response.data.dataset_data.data.map(function (day) {
        return day[1];
      });

      $scope.data.push(daysData);

      console.log($scope.data);
    });

    */

    // Public API here
    return {
      getData: getData
    };
  });
