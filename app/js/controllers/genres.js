function genresController($scope, $rootScope, $state, WS, $localStorage) {
    'ngInject';
    const vm = this;
    vm.genders = [];
    vm.gender = {};
    vm.img_edit = 0;
    let table = null;
    vm.getGenders = function(){
        WS.get('gender')
            .then(function(res) {
                if(res.data.success === 'true')
                {
                    vm.genders = res.data.genders;
                    $scope.$apply();
                    table = $('#genres').DataTable({
                        initComplete: function(settings, json) {
                        $('.loader').addClass('hidden');
                        }
                    });
                }
                else
                {
                    console.error(res.data.msg);
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');                
            });
    }
    vm.addGender = function(){
        WS.post('gender', vm.gender)
            .then(function(res) {
                if(res.data.success === 'true' && res.data.gender)
                {
                    vm.gender = res.data.gender;
                    vm.genders.push(vm.gender);
                    vm.gender= {};
                    table.destroy();
                    table = $('#genres').DataTable({
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
    vm.updateGender = function(value){
        value.gender_id = value.id;
        WS.put('gender', value)
            .then(function(res) {
                if(res.data.success === 'true')
                {
                    vm.gender = res.data.gender;
                    for (var i = 0; i < vm.genders.length; i++){
                        if (vm.genders[i].id == vm.gender.id){ 
                            vm.genders[i] = vm.gender;
                        }
                    }
                    vm.gender = {};
                    table.destroy();
                    table = $('#genres').DataTable({
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
    vm.deleteGender = function(id){
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
            WS.delete('gender', {gender_id: id})
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif(res.data.msg,'success');
                        table.destroy();
                        vm.getGenders();
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
    name: 'genresController',
    fn: genresController
};