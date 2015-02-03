
/**
 * Copyright {2015} {Paul Cech}
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
    'use strict';

    angular.module('angular.chronicle', [])
        .service('commandHistoryService', function () {
            // AngularJS will instantiate a singleton by calling "new" on this function

            var commandHistory = [];
            var commandCounter = 0;

            return {
                addCommand : function (_command) {
                    commandHistory.unshift(_command);
                    commandCounter = -1;
                },

                getNextCommand : function () {
                    var command = commandHistory[commandHistory.length - 1];

                    if (commandCounter < commandHistory.length - 1) {

                        commandCounter++;
                        command = commandHistory[commandCounter];
                    }

                    return command;
                },

                getLastCommand : function () {
                    var command = '';

                    if (commandCounter > 0) {

                        commandCounter--;
                        command = commandHistory[commandCounter];
                    }
                    else {
                        commandCounter = -1;
                    }

                    return command;
                },

                getCurrentCommand : function () {
                    var command = '';

                    if (commandHistory.length > 0) {
                        command = commandHistory[commandCounter];
                    }
                    return command;
                },

                resetCommandCounter : function () {
                    commandCounter = -1;
                },

                resetData : function () {
                    commandCounter = -1;
                    commandHistory = [];
                }
            };
        })
        .directive('commandHistory', ['commandHistoryService', function (commandHistoryService) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function ($scope, $element, $attrs, ngModel) {

                    $element.bind('keydown', function (event) {

                        var currentValue = $element.val();
                        var command = '';

                        // Enter
                        if (event.which === 13) {
                            if (currentValue != undefined && currentValue != '') {
                                commandHistoryService.addCommand(currentValue);
                            }
                        }
                        // Up Arrow
                        else if (event.which === 38) {
                            command = commandHistoryService.getNextCommand();
                            $element.val(command);
                            ngModel.$setViewValue(command);
                        }
                        // Down Arrow
                        else if (event.which === 40) {
                            command = commandHistoryService.getLastCommand();
                            $element.val(command);
                            ngModel.$setViewValue(command);
                        }

                        if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                            $scope.$apply();
                        }
                    });
                }
            };
        }]);
}());


