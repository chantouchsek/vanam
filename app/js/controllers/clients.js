function clientsController($scope, $rootScope, $state, WS, $localStorage, AppSettings) {
    'ngInject';
    const vm = this;
    let table = null;
    vm.editing = 0;
    vm.update_client = 0;
    vm.address = {
        is_delivery_address : 0,
        is_billing_address : 0
    };
    vm.info = {};
    vm.search = '';
    vm.link = '';
    vm.info.authorization = {};
    vm.managers = [];
    vm.brands = [];
    vm.categories = [];
    vm.countries = [];
    vm.total_commands = 0;
    vm.total_quotations = 0;
    vm.total_invoices = 0;

    vm.calculCA = function(list, type){
        let s = 0;
        angular.forEach(list, function(i){
            s+= i.total*1;
        })
        if( type==1 ){
           vm.total_commands=s;
        }
        if( type==2 ){
           vm.total_invoices=s;
        }
        if( type==3 ){
           vm.total_quotations=s;
        }
        $scope.$apply();
    }
    vm.getStats = function(id){
        WS.get('client/stats','client_id='+id)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.stats = res.data.stats;
                    $scope.$apply();
                    vm.calculCA(vm.stats.commands  , 1);
                    vm.calculCA(vm.stats.invoices  , 2);
                    vm.calculCA(vm.stats.quotations, 3);
                    $('.loader').addClass('hidden');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.getCountries = function(){
        WS.get('country')
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.countries = res.data.countries;
                    $scope.$apply();
                    $('.loader').addClass('hidden');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.getCountries();
    vm.getCountryName = function(id){
        let c = vm.countries.find(item => item.id == id);
        if( !c ) {
            return '--';
        }
        return c.name;
    }
    vm.getFile = function(type){
        WS.get('client', 'file_type='+ type +'&query='+vm.search)
            .then(function(res) {
                $('.loader').addClass('hidden');
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    window.open(AppSettings.apiUrl  +''+res.data.url_file);
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.getClientById = function(id){
        WS.get('client/'+id)
            .then(function(res) {
                $('.loader').addClass('hidden');

                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.info = res.data.client;
                    vm.editing = 1;
                    vm.tous_categories = 0;
                    vm.tous_marques = 0;
                    if(!vm.info.authorization){
                        vm.info.authorization = {};
                    }
                    vm.info.authorization.authorization_contact_mail = vm.info.contact_email;
                    vm.update_client = 1;
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');


            });
        vm.getAddresses(id);
        vm.getStats(id);
    }
    vm.getClients = function(search){
        vm.search = search;
        WS.get('client', 'query='+search)
            .then(function(res) {

                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.clients = res.data.clients;
                    if(table){
                        table.destroy();
                    }
                    $scope.$apply();
                    table = $('#clients').DataTable({
                      'bFilter': false,
                       dom: '<"top"f>rt<"bottom"lip>',
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
            WS.delete('client/'+id)
                .then(function(res) {
                    if(res.data.success=='false'){
                        console.log(  res.data.msg );
                    }else{
                        $('.loader').addClass('hidden');
                        window.notif(res.data.msg,'success');
                        $('#c-'+id).remove();
                    }
                })
                .then(null, function(error) {
                    $('.loader').addClass('hidden');
                    window.notif(''+error.msg,'error');
                });
        })
    }
    // vm.getClients();
    vm.addAddress = function(){
        let t = [];
        angular.copy(vm.addresses, t)
        t = t.concat([vm.address]);
        if(!checkAddress( t )){
           return;
        }
        vm.address.client_id = vm.info.id;
        WS.post('address', vm.address)
            .then(function(res) {
                $('.loader').addClass('hidden');

                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    window.notif(res.data.msg,'success');
                    vm.getAddresses( vm.address.client_id );
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
            });
    }
    function checkAddress( adresses ){
         let adresse_liv = 0;
        let nb_adresse_liv = 0;
        let adresse_fact = 0;
        let nb_adresse_fact = 0;
        angular.forEach(adresses, function(adresse){
            if( adresse.is_billing_address == 1 ){
                adresse_fact = 1;
                nb_adresse_fact++;
            }
            if( adresse.is_delivery_address == 1 ){
                adresse_liv = 1;
                nb_adresse_liv++;
            }
        })

        if( nb_adresse_liv > 1 ){
            window.notif('Merci de désigner une seule adresse de livraison.' ,'error');
            return false;
        }
        if( nb_adresse_fact > 1 ){
            window.notif( 'Merci de désigner une seule adresse de facturation.','error');
            return false;
        }
        if( !adresse_fact || !adresse_liv ){
            if(adresses.length == 1){
                window.notif('Cette adresse est unique pour ce client, elle doit être l\'adresse de facturation et de livraison.' ,'error');
            }else{
                window.notif( 'Merci de désigner l’adresse de facturation et/ou l’adresse de livraison.','error');
            }
            return false;
        }
        return true;
    }
    vm.updateAddress = function(value){
        if(!checkAddress( vm.addresses )){
            return;
        }


        WS.put('address', value)
            .then(function(res) {
                $('.loader').addClass('hidden');

                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    window.notif(res.data.msg,'success');
                    vm.getAddresses( value.client_id );
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');

            });
    }
    vm.deleteAddress = function(id,idClient){
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
            WS.delete('address', { address_id: id })
            .then(function(res) {
                $('.loader').addClass('hidden');

                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    window.notif(res.data.msg,'success');
                    vm.getAddresses( idClient );
                }
            })
            .then(null, function(error) {

                window.notif(''+error.msg,'error');

                    $('.loader').addClass('hidden');


            });
        })
    }
    vm.getAddresses = function(id){
        if( !id ){
            id = vm.info.id;
        }
        if( id == undefined ){
            return;
        }
        WS.get('address','client_id='+id)
            .then(function(res) {
                $('.loader').addClass('hidden');

                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.addresses = res.data.addresses;
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.initDatatable = function(){
        $('#clients').DataTable({
            initComplete: function(settings, json) {
                $('.loader').addClass('hidden');
            }
        })
    }
    vm.getManagers = function(){
        WS.get('manager')
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.managers = res.data.managers;
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.saveInfos = function(){
        WS.post('client/informations', vm.info)
            .then(function(res) {
                $('.loader').addClass('hidden');

                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    console.log(res.data );
                    vm.info = res.data.client;
                    if(!vm.info.authorization){
                        vm.info.authorization = {};
                    }
                    vm.info.authorization.authorization_contact_mail = vm.info.contact_email;
                    vm.editing = 1;
                    window.notif(res.data.msg,'success');

                    $('form')[0].reset();
                    vm.getClients(vm.search);
                    $('.modal').modal('hide');
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.updateInfos = function(){
        vm.info.client_id = vm.info.id;


        WS.put('client/informations', vm.info)
            .then(function(res) {
                $('.loader').addClass('hidden');
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    console.log(res.data );
                    vm.info = res.data.client;
                    $scope.$apply();
                    $('.modal').modal('hide');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.saveAuthorization =function(){
        var o ={};
        angular.copy( vm.info.authorization, o );
        o.client_id           = vm.info.id;
        o.contact_direct_line = vm.info.contact_tel_line;
        o.contact_firstname   = vm.info.contact_firstname;
        o.contact_mobile_line = vm.info.contact_mobile_line;
        o.contact_name        = vm.info.contact_name;

        if(o.brands.length){
            o.brands = o.brands.map(function(b) {
               return { id: b.id};
            });
        }
        if(o.categories){
            o.categories = o.categories.map(function(c) {
               return { id: c.id};
            });
        }
        WS.post('client/authorization', o)
            .then(function(res) {
                $('.loader').addClass('hidden');

                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    window.notif(res.data.msg,'success');
                    vm.info.is_authorization_access = 1;
                    $('#c-'+vm.info.id).find('.fa-circle').removeClass('text-danger').addClass( 'text-success' );
                    // vm.getClients(vm.search);
                    $('.modal').modal('hide');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.updateAuthorization =function(){
        var o ={};
        angular.copy( vm.info.authorization, o );
        o.is_authorization_access = vm.info.is_authorization_access;
        o.client_id = vm.info.id;
        delete o.contact_direct_line;
        delete o.contact_firstname;
        delete o.contact_mobile_line;
        delete o.contact_name;


        if(o.brands.length){
            o.brands = o.brands.map(function(b) {
               return { id: b};
            });
        }

        if(o.categories){
            o.categories = o.categories.map(function(c) {
               return { id: c};
            });
        }

        angular.forEach(o.brands, function(item){
            delete item.name;
            delete item.picture;
        });

        angular.forEach(o.categories, function(item){
            delete item.name;
            delete item.company_id;
        });

        WS.put('client/authorization', o)
            .then(function(res) {
                $('.loader').addClass('hidden');

                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    window.notif(res.data.msg,'success');
                    $('#c-'+vm.info.id).find('.fa-circle').removeClass('text-danger')
                                                  .removeClass( 'text-success' )
                                                  .addClass( vm.info.is_authorization_access == 1 ? 'text-success':'text-danger' );

                    $('.modal').modal('hide');

                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');


            });
    }
    vm.getBrands = function(){
        WS.get('brand')
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.brands = res.data.brands;
                    $('.loader').addClass('hidden');
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');


            });
    }
    vm.getCategories = function(){
        WS.get('category')
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    $('.loader').addClass('hidden');
                    vm.categories = res.data.categories;
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');


            });
    }
    vm.updateCategories = function(e){
        console.log(e);

        let o = [];
        angular.copy( e, o );
        angular.forEach(o, function(item){
            delete item.name;
            delete item.company_id;
        });
        WS.post('client/category', {client_id: vm.info.id, categories: o})
            .then(function(res) {
                $('.loader').addClass('hidden');

                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    console.log(res.data );
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');


            });
    }
    vm.updateBrands = function(e){
        let o = [];
        angular.copy( e, o );
        angular.forEach(o, function(item){
            delete item.name;
            delete item.picture;
        });

        WS.post('client/brand', {client_id:vm.info.id, brands: o})
            .then(function(res) {
                $('.loader').addClass('hidden');

                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    console.log(res.data );
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');


            });
    }
    vm.triggerSelectAllCategories = function(action){
        if( action == 1 ){
            vm.info.authorization.categories = vm.categories;
        }else{
            vm.info.authorization.categories = [];
        }
        setTimeout(function() {
            vm.updateCategories();
        }, 100);
    }
    vm.triggerSelectAllBrands = function(action){
        if( action == 1 ){
            vm.info.authorization.brands = vm.brands;
        }else{
            vm.info.authorization.brands = [];
        }
        setTimeout(function() {
            vm.updateBrands();
        }, 10);
    }
}
export default {
    name: 'clientsController',
    fn: clientsController
};