function devisesController($scope, $rootScope, $state, WS, $localStorage) {
    'ngInject';
    const vm = this;
    vm.devises = [];
    vm.devise = {};
    vm.img_edit = 0;
    let table = null;
    vm.getDevises = function(){
        WS.get('change')
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.devises = res.data.changes;
                $('.loader').addClass('hidden');
                    $scope.$apply();
                    table = $('#devises').DataTable({
                      initComplete: function(settings, json) {
                        $('.loader').addClass('hidden');
                      }
                    });
                }
            })
            .then(null, function(error) {
                
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.addDevise = function(){
        WS.post('change', vm.devise)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    table.destroy();
                    vm.getDevises();
                    vm.devise= {};
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.updateDevise = function(value){
        value.change_id = value.id;
        WS.put('change', value)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    table.destroy();
                    vm.getDevises();
                    vm.devise= {};
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.deleteDevise = function(id){
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
            WS.delete('change', {change_id: id})
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif(res.data.msg,'success');
                        table.destroy();
                        vm.getDevises();
                    }
                })
                .then(null, function(error) {
                    window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');
                });
        })
    }  
}
export default {
    name: 'devisesController',
    fn: devisesController
};