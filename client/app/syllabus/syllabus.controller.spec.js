'use strict';

describe('Controller: SyllabusCtrl', function () {

  // load the controller's module
  beforeEach(module('courseplannerApp'));

  var SyllabusCtrl, scope;
  var stateModels = [{}, {}, {}];

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SyllabusCtrl = $controller('SyllabusCtrl', {
      $scope: scope,
      syllabuses: stateModels
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
