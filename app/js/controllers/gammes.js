function gammesController($scope, $rootScope, $state, WS, $localStorage) {
    'ngInject';
    const vm = this;
    vm.gammes = [];
    vm.range_details = [];
    vm.gamme = {};
    vm.details_gamme = {};

    vm.img_edit = 0;
    let table = null;
    let table2 = null;
    vm.getGammes = function(){
        WS.get('range')
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.gammes = res.data.ranges;
                    $scope.$apply();
                    table = $('#gammes').DataTable({
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
    vm.addGamme = function(){
        WS.post('range', vm.gamme)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    table.destroy();
                    vm.getGammes();
                    vm.gamme= {};
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.updateGamme = function(value){
        value.range_id = value.id;
        WS.put('range', value)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    table.destroy();
                    vm.getGammes();
                    vm.gamme= {};
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.deleteGamme = function(id){
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
            WS.delete('range', {range_id: id})
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif(res.data.msg,'success');
                        table.destroy();
                        vm.getGammes();
                    }
                })
                .then(null, function(error) {
                    window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');
                    
                });
        })
    }  
    vm.getDetails  = function(gamme){
         
        if(gamme){
            vm.details_gamme = gamme;
        }
        WS.get('range/detail', 'range_id='+vm.details_gamme.id)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{                     
                    vm.range_details = res.data.range_details;
                    $scope.$apply();
                    $('.loader').addClass('hidden');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.addDetailsGamme  = function(){
        WS.post('range/detail', { name: vm.details_gamme_name, range_detail_id: vm.details_gamme.id })
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.details_gamme_name = '';
                    $scope.$apply();
                    vm.getDetails();
                    $('.loader').addClass('hidden');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.updateDetailsGamme  = function(value){
        value.range_detail_id = value.id;
        WS.put('range/detail', value)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.getDetails();
                    $('.loader').addClass('hidden');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.deleteDetailsGamme  = function(id){
        WS.delete('range/detail', { range_detail_id : id })
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.getDetails();
                    $('.loader').addClass('hidden');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    } 
    vm.sortableOptions = {
      update: function(e, ui) {
        setTimeout(function() {
            angular.forEach(vm.range_details,  function(item , index){
                item.range_detail_id = item.id;
                item.rang = index+1;
                console.log( item );
                WS.put('range/detail', item)
                    .then(function(res) {
                        if(res.data.succes=='false'){
                            console.log(  res.data.msg );
                        }else{
                            // vm.getDetails();
                            $('.loader').addClass('hidden');
                        }
                    })
                    .then(null, function(error) {
                        window.notif(''+error.msg,'error');
                        $('.loader').addClass('hidden');
                        
                    });
            })
        }, 10);
      }
    };

}
export default {
    name: 'gammesController',
    fn: gammesController
};