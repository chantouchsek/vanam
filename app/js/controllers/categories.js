function categoriesController($scope, $rootScope, $state, WS, $localStorage) {
    'ngInject';
    const vm = this;
    vm.categories = [];
    vm.category = {};
    let table = null;
    vm.getCategories = function(){
    	WS.get('category')
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.categories = res.data.categories;
                    $scope.$apply();
                    table = $('#categories').DataTable({
                      initComplete: function(settings, json) {
                        $('.loader').addClass('hidden');
                      }
                    });
                }
            })
            .then(null, function(error) {
                
            });
    }
    vm.addCategory = function(){
    	WS.post('category', vm.category)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    table.destroy();
                    vm.getCategories();
                    vm.category= {};
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                
            });
    }

    vm.updateCategory = function(value){
    	value.category_id = value.id;
    	WS.put('category', value)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    table.destroy();
                    vm.getCategories();
                    vm.category= {};
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                
            });
    }

    vm.deleteCategory = function(id){
    	swal({
            title              : 'Êtes-vous sûr?',
            text               : 'Vous ne pourrez pas revenir à cela!',
            type               : 'warning',
            showCancelButton   : true,
            confirmButtonColor : '#3085d6',
            cancelButtonColor  : '#d33',
            confirmButtonText  : 'Oui, supprimez-le!',
            cancelButtonText  : 'Annuler'
        }).then(function () {
            WS.delete('category', {category_id: id})
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif(res.data.msg,'success');
                        table.destroy();
                        vm.getCategories();
                    }
                })
                .then(null, function(error) {
                    
                });
        })
    }
      
}
export default {
    name: 'categoriesController',
    fn: categoriesController
};