'use strict';

angular.module('stocks2App')
  .controller('MainCtrl', function($scope, $timeout, $http, socket, stocksFactory) {

    function addStock(code) {
      stocksFactory.getData(code)
        .then(function(stockInfo) {
          stockInfo.data.reverse();
          console.log(stockInfo);
          $scope.chartConfig.series.push(stockInfo);
        }, function(error) {
          console.error(error);
        });
    }

    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;

      _.forEach($scope.awesomeThings, function(stock) { addStock(stock.name); });
      //socket.syncUpdates('thing', $scope.awesomeThings);
      socket.syncUpdates('thing', $scope.awesomeThings, function(event, item, object) {
        console.log(event);
        // event = "deleted" or "created"
        console.log(item.name);
        console.log(object);
        $scope.awesomeThings = object;  // item contains the updated array

        if (event === 'deleted') {
          // remove item.name from $scope.chartConfig.series{name: }
          _.remove($scope.chartConfig.series, function(series) {
            //console.log("remove loop", series, item);
            return series.name.toUpperCase() === item.name.toUpperCase();
          });
        }
        else if (event === 'created') {
          // download graph and add to chart
          addStock(item.name);
        }
      });
    });

    $scope.$watch('awesomeThings', function() {
       //alert('Dink!');
       /*
       _.forEach($scope.awesomeThings, function(stock) {
         console.log('calling stocksFactory', stock.name);
         stocksFactory.getData(stock.name)
           .then(function(stockInfo) {
             stockInfo.data.reverse();
             console.log(stockInfo);
             $scope.chartConfig.series.push(stockInfo);
           }, function(error) {
             console.error(error);
           });
       });
       */
    });

    $scope.addThing = function() {
      if ($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', {
        name: $scope.newThing
      });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });

    $scope.chartConfig = {
      options: {
        chart: {
          zoomType: 'x'
        },
        rangeSelector: {
          enabled: true
        },
        navigator: {
          enabled: false
        }
      },
      series: [],
      useHighStocks: true
    };


    /*
    $scope.chartConfig.series.push

    /*
    $scope.chartConfig.series.push({
        //id: 1,
        name: "test1",
        data: [
          [1147651200000, 23.15],
          [1147737600000, 23.01],
          [1147824000000, 22.73],
          [1147910400000, 22.83],
          [1147996800000, 22.56],
          [1148256000000, 22.88],
          [1148342400000, 22.79],
          [1148428800000, 23.50],
          [1148515200000, 23.74],
          [1148601600000, 23.72],
          [1148947200000, 23.15],
          [1149033600000, 22.65]
        ]
      },   {
        //id: 2,
        name: "it's test 2",
        data: [
          [1147651200000, 25.15],
          [1147737600000, 25.01],
          [1147824000000, 25.73],
          [1147910400000, 25.83],
          [1147996800000, 25.56],
          [1148256000000, 25.88],
          [1148342400000, 25.79],
          [1148428800000, 25.50],
          [1148515200000, 26.74],
          [1148601600000, 26.72],
          [1148947200000, 26.15],
          [1149033600000, 26.65]
        ]

      }
    );
    */
  });
