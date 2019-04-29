function usersController($scope, $rootScope, $state, WS, $localStorage) {
    'ngInject';
    const vm = this;
    vm.error = '';
    vm.users = {};
    vm.user = {};
    vm.editing = 0;
    vm.canUpload = 0;
    let table = null;

    vm.getUsers = function() {
        WS.get('user')
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.users = res.data.users;
                    $scope.$apply();
                    table = $('#users').DataTable({
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
    vm.addUser = function() {
        WS.post('user', vm.user)
            .then(function(res) {
                $('.loader').addClass('hidden');
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.user = {};
                    table.destroy();
                    $('form')[0].reset();
                    window.notif('l\'utilisateur ajouté avec succès.','success');
                    vm.getUsers();
                    $('.modal').modal('hide');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');

            });
    }
    vm.editUser = function() {
        WS.put('user', vm.user)
            .then(function(res) {
                $('.loader').addClass('hidden');
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.user = {};
                    $('form')[0].reset();
                    window.notif('l\'utilisateur mis à ajour avec succès.','success');
                    table.destroy();
                    vm.getUsers();
                    $('.modal').modal('hide');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');

            });
    }
    vm.delete = function(id){
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
            WS.delete('user/'+id)
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif('l\'utilisateur a été supprimé.' ,'success');
                        table.destroy();
                        vm.getUsers();
                    }
                })
                .then(null, function(error) {
                    window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');

                });
        })
    }
    vm.edit = function(user) {
        vm.user = user;
        vm.editing = 1;
    }
    vm.deletePhoto = function(id){
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
            WS.delete('account/picture', {user_id: id})
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif('l\'image a été supprimé.' ,'success');
                        $('.modal').modal('hide');
                        table.destroy();
                        vm.getUsers();
                    }
                })
                .then(null, function(error) {
                    window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');


                });
        })
    }
    vm.uploadPhoto = function(id){
        var formData = new FormData();
        formData.append('user_id', id);
        formData.append('picture', $('[name="picture"]')[0].files[0]);
        WS.post('account/picture', formData, undefined)
            .then(function(res) {
                $('.loader').addClass('hidden');
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    window.notif(res.data.msg,'success');
                    vm.canUpload = 0;
                    table.destroy();
                    vm.getUsers();
                    $('.modal').modal('hide');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');

            });
    }

    var ua = navigator.userAgent,
        event = (ua.match(/iP/i)) ? 'touchstart' : 'click';


    $(document).off(event, '.img');
    $(document).on(event, '.img', function(event) {
        $('[name=picture]').trigger('click');
    });
    $(document).on('change', '[name="picture"]', function(event) {
        var input = this;
        var url = $(this).val();
        var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        if (input.files && input.files[0]&& (ext == 'gif' || ext == 'png' || ext == 'jpeg' || ext == 'jpg')) {
            var reader = new FileReader();
            reader.onload = function (e) {
               $('.img').attr('src', e.target.result);
               vm.canUpload = 1;
               $scope.$apply();
            }
           reader.readAsDataURL(input.files[0]);
        }

    });

}
export default {
    name: 'usersController',
    fn: usersController
};