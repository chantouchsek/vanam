function sportsController($scope, $rootScope, $state, WS, $localStorage) {
    'ngInject';
    const vm = this;
    vm.sports = [];
    vm.sport = {};
    vm.img_edit = 0;
    let table = null;
    vm.getSports = function(){
    	WS.get('sport')
            .then(function(res) {
                if(res.data.success === 'true')
                {
                    vm.sports = res.data.sports;
                    $scope.$apply();
                    table = $('#sports').DataTable({
                      initComplete: function(settings, json) {
                        $('.loader').addClass('hidden');
                      }
                    });
                }
                else
                {
                    console.log(  res.data.msg );
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.addSport = function(){
    	WS.post('sport', vm.sport)
            .then(function(res) {
                if(res.data.success === 'true' && res.data.sport)
                {
                    vm.sport = res.data.sport;
                    vm.sports.push(vm.sport);
                    vm.sports = vm.sports.sort();
                    vm.sport = {};
                    table.destroy();
                    table = $('#sports').DataTable({
                        initComplete: function(settings, json) {
                          $('.loader').addClass('hidden');
                        }
                    });
                    $scope.$apply();
                }
                else
                {
                    console.log(  res.data.msg );
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden'); 
            });
    }
    vm.updateSport = function(value){
        value.sport_id = value.id;
        console.error(value);
        if(value.name)
        {
            WS.put('sport', value)
                .then(function(res) {
                    if(res.data.success === 'true' && res.data.sport)
                    {
                        vm.sport = res.data.sport;
                        for (var i = 0; i < vm.sports.length; i++){
                            if (vm.sports[i].id == vm.sport.id){ 
                                vm.sports[i] = vm.sport;
                            }
                        }
                        vm.sport = {};
                        table.destroy();
                        table = $('#sports').DataTable({
                            initComplete: function(settings, json) {
                            $('.loader').addClass('hidden');
                            }
                        });
                        $scope.$apply();
                    }
                    else
                    {
                        console.log(res.data.msg );
                    }
                })
                .then(null, function(error) {
                    window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');
                    
                });
        }
        else
        {
            alert('Please fill Name');
            table.destroy();
            table = $('#sports').DataTable({
                initComplete: function(settings, json) {
                $('.loader').addClass('hidden');
                }
            });
            $scope.$apply();
        }
    }
    vm.deleteSport = function(id){
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
            WS.delete('sport', {sport_id: id})
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif(res.data.msg,'success');
                        table.destroy();
                        vm.getSports();
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
    name: 'sportsController',
    fn: sportsController
};