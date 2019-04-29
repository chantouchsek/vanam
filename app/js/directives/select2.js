function select2() {

return {
        restrict: 'AC',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {

            //$this becomes element
 

            element.select2({
            'language': {
                 'noResults': function(){
                     return 'Aucun résultat trouvé';
                 }
             },
           });

            // element.on('change', function() {
            //      console.log('on change event');
            //      var val = $(this).value;
            //      scope.$apply(function(){
            //          //will cause the ng-model to be updated.
            //          ngModel.setViewValue(val);
            //      });
            // });
            // ngModel.$render = function() {
            //      //if this is called, the model was changed outside of select, and we need to set the value
            //     //not sure what the select2 api is, but something like:
            //     element.value = ngModel.$viewValue;
            // }

        }
    }
}

export default {
  name: 'select2',
  fn: select2
};


 