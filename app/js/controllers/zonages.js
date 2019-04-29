function zonagesController($scope, $rootScope, $state, WS, $localStorage) {
    'ngInject';
    const vm = this;
    vm.zonages = [];
    vm.zonage = {};
    vm.img_edit = 0;
    let table = null;
    vm.getZonages = function(){
    	WS.get('zonage')
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.zonages = res.data.zonage_cities;
                    $scope.$apply();
                    table = $('#zonages').DataTable({
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
    vm.addZonage = function(){
    	WS.post('zonage', vm.zonage)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    table.destroy();
                    vm.getZonages();
                    vm.zonage= {};
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.updateZonage = function(value){
    	value.zonage_city_id = value.id;
    	WS.put('zonage', value)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    table.destroy();
                    vm.getZonages();
                    vm.zonage= {};
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.deleteZonage = function(id){
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
            WS.delete('zonage', {zonage_city_id: id})
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif(res.data.msg,'success');
                        table.destroy();
                        vm.getZonages();
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
    name: 'zonagesController',
    fn: zonagesController
};