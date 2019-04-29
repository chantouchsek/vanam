function paysController($scope, $rootScope, $state, WS, $localStorage) {
    'ngInject';
    const vm = this;
    vm.countries = [];
    vm.country = {};
    vm.img_edit = 0;
    let table = null;
    vm.getCountries = function(){
    	WS.get('country')
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.countries = res.data.countries;
                    $scope.$apply();
                    table = $('#pays').DataTable({
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
    vm.addCountry = function(){
    	WS.post('country', vm.country)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                        window.notif(res.data.msg,'success');
                    $('.loader').addClass('hidden');
                    table.destroy();
                    vm.getCountries();
                    vm.country= {};
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.updateCountry = function(value){
    	value.country_id = value.id;
    	WS.put('country', value)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                        window.notif(res.data.msg,'success');
                    $('.loader').addClass('hidden');
                    table.destroy();
                    vm.getCountries();
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.deleteCountry = function(id){
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
            WS.delete('country', {country_id: id})
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif(res.data.msg,'success');
                        $('.loader').addClass('hidden');
                        table.destroy();
                        vm.getCountries();
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
    name: 'paysController',
    fn: paysController
};