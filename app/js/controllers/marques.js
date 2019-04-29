function marquesController($scope, $rootScope, $state, WS, $localStorage) {
    'ngInject';
    const vm = this;
    vm.brands = [];
    vm.brand = {};
    vm.img_edit = 0;
    let table = null;

    function callback(json){
        alert('test');
    }

    vm.getBrands = function(){
    	WS.get('brand')
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.brands = res.data.brands;
                    $scope.$apply();
                    if(table){
                        table.destroy();
                    }
                    table = $('#marques').DataTable({
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
    vm.addBrand = function(){
    	WS.post('brand', vm.brand)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.brand = res.data.brand;
                    vm.brands.push(vm.brand);
                    vm.brand= {};
                    $scope.$apply();
                    if(table){
                        table.destroy();
                    }
                    table = $('#marques').DataTable({
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
        table.reload();
    }
    vm.updateBrand = function(value){
    	value.brand_id = value.id;
    	WS.put('brand', value)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.getBrands();
                    vm.brand= {};
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.deleteBrand = function(id){
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
            WS.delete('brand', {brand_id: id})
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif(res.data.msg,'success');
                        vm.getBrands();
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
        formData.append('id', id);
        formData.append('picture', $('[name="picture"]')[0].files[0]);
        WS.post('brand/media', formData, undefined)
            .then(function(res) {
                $('.loader').addClass('hidden');
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    window.notif(res.data.msg,'success');
                    // $('#c-'+id).find('.btn-hide').removeClass('hidden');
                    vm.getBrands();

                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');    
                
            });
    }

    vm.deleteLogo = function(id){
        console.log(id);
        WS.delete('brand/media',{id,id})
            .then(function(res) {
                $('.loader').addClass('hidden');
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    window.notif(res.data.msg,'success');
                    vm.getBrands();
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
               $('.img'+vm.img_edit).attr('src', e.target.result);
               vm.uploadPhoto( vm.img_edit );
               $('[name="picture"]').val('');
               $scope.$apply();
            }
           reader.readAsDataURL(input.files[0]);
        }

    });
    $(document).on('mouseenter', 'td', function(event) {
        $(this).find('.btn-rounded').removeClass('hidden');
    });
    $(document).on('mouseleave', 'td', function(event) {
        $(this).find('.btn-rounded').addClass('hidden');
    });
}
export default {
    name: 'marquesController',
    fn: marquesController
};