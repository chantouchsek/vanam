function profileController($scope, $rootScope, $state, WS, $localStorage) {
    'ngInject';
    const vm = this;
    vm.user = {};
    if ($localStorage.data.user) {
        angular.copy($localStorage.data.user, vm.user);
        console.log(vm.user);
    }

    vm.editUser = function() {
        WS.put('user', vm.user)
            .then(function(res) {
                $('.loader').addClass('hidden');
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    angular.copy( vm.user , $localStorage.data.user);
                    window.notif('Profile mis à ajour avec succès.' ,'success');
                    $state.go('app.index');
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');
                    
                    
            });
    }

    vm.deletePhoto = function(id){
        swal({
            title              : 'Êtes-vous sûr?',
            text               : 'Vous ne pourrez pas revenir à cela!',
            type               : 'warning',
            showCancelButton   : true,
            confirmButtonColor : '#3085d6',
            cancelButtonColor  : '#d33',
            confirmButtonText  : 'Oui, supprimez-la!',
            cancelButtonText  : 'Annuler'
        }).then(function () {
            WS.delete('account/picture', {user_id: id})
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif( 'l\'image a été supprimé.','success');
                        vm.user.url_picture = null;
                        angular.copy( vm.user , $localStorage.data.user);
                        $scope.$apply();
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
                    vm.user.url_picture = res.data.url_logo;
                    vm.canUpload = 0;
                    angular.copy( vm.user , $localStorage.data.user);
                    $scope.$apply();
                    $state.go('app.index');

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
        event.stopPropagation();
   
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
    name: 'profileController',
    fn: profileController
};