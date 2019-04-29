function produitsController($scope, $q,$rootScope, $state, WS, $localStorage,AppSettings, moment) {
    'ngInject';

    const vm = this;
    let table = null;
    vm.data = $localStorage.data;

    vm.produit = {};
    vm.produits = [];
    vm.devis = [];
    vm.search = {
        categories:[],
        sports:[],
        brands:[],
        gammes:[],
        genders:[],
        quantite: 1,
        qtr_exhausted: 0,
        is_no_pictures: 0,
        entry_event_after_before : '<'
    };
    vm.optionsSlider = {
        ceil: 1000,
        max: 1000,
        hideLimitLabels: true,
        translate: function(value) {
            if(value ==  vm.optionsSlider.ceil){
                return 'MAX';
            }
            return  value;
        }
    };

    if ($localStorage.devis) {
        vm.devis = $localStorage.devis;
    }
    $localStorage.devis = vm.devis;
    vm.moy_commands = 0;
    vm.moy_quotations = 0;
    vm.moy_invoices = 0;

    vm.calculCA = function(list, type){
        let total = 0;
        let qte = 0;
        angular.forEach(list, function(i){
            total+= i.total*1;
            qte+= i.qte_total*1;
        }) 
        if( type==1 ){
           vm.moy_commands=total/qte; 
        }
        if( type==2 ){
           vm.moy_invoices=total/qte; 
        }
        if( type==3 ){
           vm.moy_quotations=total/qte; 
        }
        $scope.$apply();
    }
    vm.getStats = function(id){
        WS.get('product/stats','product_id='+id)
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
    vm.getProduits = function(format=0){
 
        var o ={};
        angular.copy( vm.search, o );
        o.format = format;
        
        if(o.genders.length){
            o.genders = o.genders.map(function(c) {
               return c.id;
            });
        }
        if(o.categories.length){
            o.categories = o.categories.map(function(c) {
               return c.id;
            });
        }

        if(o.brands.length){
            o.brands = o.brands.map(function(c) {
               return c.id;
            });
        }

        if(o.sports.length){
            o.sports = o.sports.map(function(c) {
               return c.id;
            });
        }

        if(o.entry_event_date){
            o.entry_event_date = moment(o.entry_event_date).format('YYYY/MM/DD');
        }

        o.qte_min = vm.search.quantite;

        if(vm.optionsSlider.max<1000){
            o.qte_max = vm.optionsSlider.max;
        }

        WS.post('product/search', o)
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    $('.loader').addClass('hidden');
                    if(res.data.url_file){
                        window.open(AppSettings.apiUrl  +''+res.data.url_file);
                    }else{
                        vm.produits = res.data.products;
                        if(table){
                            table.destroy();
                        }
                        $scope.$apply();
                        table = $('#liste-produits').DataTable({
                            'pageLength': table?table.page.len():50,
                            'bFilter': false,
                            initComplete: function(settings, json) {
                            $('.loader').addClass('hidden');
                            }
                        });
                    }
                }
            })
            .then(null, function(error) {
                window.notif(error.data.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.getProduitById = function(id){
        if(!id){
            id = $state.params.id;
        }
        if($('meta[name="product_id"]').attr('content')){
            id = $('meta[name="product_id"]').attr('content')*1;
        }

        WS.get('product/'+id)
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.produit = res.data.product;
                    vm.produit.zonage_city_id = '1';
                    $scope.$apply();
                    vm.getStats(vm.produit.id);
                    $('.loader').addClass('hidden');
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(error.data.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.deleteProduct = function(id){
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
            WS.delete('product/'+id)
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.success=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif(res.data.msg,'success');
                        vm.getProduits();
                    }
                })
                .then(null, function(error) {
                    window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden');
                    
                });
        })
    }
    vm.resetSearch = function(){
        vm.search = {
            categories:[],
            sports:[],
            brands:[],
            gammes:[],
            quantite: 1,
            qtr_exhausted: 0,
            is_no_pictures: 0,
            entry_event_after_before : '<'
        };
        $scope.$apply();
    }
    vm.resetProduit = function(){
        vm.produit = {};
        if($('meta[name="reference"]').length){
            vm.produit.reference = $('meta[name="reference"]').attr('content');
        }
    }
    vm.goToProductList = function(){
        if(!$('body').hasClass('modal-open')){
            $state.go('app.produits.index');
            vm.getProduits();
        }
    }
    if($state.params){
        if($state.params.tab){
            jQuery(document).ready(function($) {
                $('.nav-tabs a[href="#' + $state.params.tab + '"]').tab('show');
            });
        }
    } 
    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
        if($state.params){
            if($state.params.tab){
                jQuery(document).ready(function($) {
                    $('.nav-tabs a[href="#' + $state.params.tab + '"]').tab('show');
                });
            }
        }
    });
    vm.addProduit = function(){
        WS.post('product', vm.produit)
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    $('.loader').addClass('hidden');
                    window.notif(res.data.msg,'success');
                    $rootScope.$broadcast('addProductSuccess', {
                      product_id: res.data.id
                    });
                    vm.produit = {};
                    if(!$('body').hasClass('modal-open')){
                        $state.go('app.produits.index');
                        vm.getProduits();
                    }
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.updateProduit = function(){
        vm.produit.product_id = vm.produit.id;
        WS.put('product', vm.produit)
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    $('.loader').addClass('hidden');
                    window.notif(res.data.msg,'success');
                    vm.getProduits();
                    $state.go('app.produits.index');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.setDefault = function(id){
        WS.post('product/picture/default', {product_id: vm.produit.id, picture_id : id})
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    $('.loader').addClass('hidden');
                    window.notif(res.data.msg,'success');
                    vm.getProduitById($state.params.id);
                    vm.getProduits();
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.addPhotos = function(){
        var err = '';
        var formData = new FormData();
        formData.append('product_id', vm.produit.id);
        $.each($('[name="picture"]')[0].files, function(i, file) {
            if( (file.size / 1048576) > 5 ){
                err += file.name + ' ';
            }
            formData.append('picture[]', file);
        });

        if(err){
            window.notif( 'La taille maximale d\'un fichier est 5 Mo. Merci de vérifier les fichiers suivants : '+err,'error');
            return;
        }
        WS.post('product/picture', formData, undefined)
            .then(function(res) {
                $('.loader').addClass('hidden');
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    window.notif(res.data.msg,'success');
                    $('.modal').modal('hide');
                    vm.getProduitById( vm.produit.id );
                    vm.getProduits();
                    console.log( res );
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');    
                
            });
    }
    vm.deletePhoto = function(id){
        
        WS.delete('product/picture', {picture_id : id})
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    $('.loader').addClass('hidden');
                    window.notif(res.data.msg,'success');
                    vm.getProduitById($state.params.id);
                    vm.getProduits();
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
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.categories = res.data.categories;
	                $('.loader').addClass('hidden');
	                $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.getZonages = function(){
        WS.get('zonage')
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.zonages = res.data.zonage_cities;
                    $('.loader').addClass('hidden');
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.getMarques = function(){
        WS.get('brand')
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.marques = res.data.brands;
	                $('.loader').addClass('hidden');
	                $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.getGenders = function(){
        WS.get('gender')
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.genders = res.data.genders;
	                $('.loader').addClass('hidden');
	                $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.getSports = function(){
        WS.get('sport')
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.sports = res.data.sport;
	                $('.loader').addClass('hidden');
	                $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.getGammes = function(){
        WS.get('range')
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.gammes = res.data.ranges;
	                $('.loader').addClass('hidden');
	                $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.getSports = function(){
        WS.get('sport')
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    vm.sports = res.data.sports;
	                $('.loader').addClass('hidden');
	                $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.updateStock = function( value ){
        var o = {};
        o.id = value.id;
        o.qtr = value.qtr;
        WS.put('product/stock', o)
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    $('.loader').addClass('hidden');
                    window.notif(res.data.msg,'success');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.updateZonage = function( value ){
        var o = {};

        o.product_id = value.id;
        o.aisle = value.aisle;
        o.palette = value.palette;
        WS.put('product/utils/zonage', o)
            .then(function(res) {
                if(res.data.success=='false'){
                    console.log(  res.data.msg );
                }else{
                    $('.loader').addClass('hidden');
                    window.notif(res.data.msg,'success');
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden');
                
            });
    }
    vm.showprice = function(){
        vm.showPrice = 1;
        setTimeout(function() {
            vm.showPrice = 0;
            $scope.$apply();
        }, 1000);
    }
    vm.deleteLigneDevis = function(i){
        vm.devis.splice(i, 1);
    }
    var dragged_product = {};
    vm.registerDraggedItem=function(e,ui,item){
        dragged_product = item;
    }
    vm.beforeDrop = function(e,ui){
         var deferred = $q.defer();
        if(vm.devis.find(item => item.id == dragged_product.id)){
            deferred.reject();
        }else{
            deferred.resolve();
        }
        return deferred.promise;
    }
    vm.selectAll = function(){
        console.log( vm.search.categories );
    }
    vm.addToDevis = function(produits){
        angular.forEach(produits, function(produit){
            if(!vm.devis.find(item => item.id == produit.id)){
                vm.devis.push( produit );
            }else{
                window.notif('Produit existe déjà','error');
            }
        });
        $localStorage.devis=vm.devis;
    }
    vm.eventsGenders ={
        onSelectAll : function(){
            if(vm.search.genders.length){
                vm.search.genders = [];
            }
        }
    }
    vm.eventsCategories ={
        onSelectAll : function(){
            if(vm.search.categories.length){
                vm.search.categories = [];
            }
        }
    }
    vm.eventsBrands ={
        onSelectAll : function(){
            if(vm.search.brands.length){
                vm.search.brands = [];
                $scope.$apply();
            }
        }
    }
    vm.eventsSports ={
        onSelectAll : function(){
            if(vm.search.sports.length){
                vm.search.sports = [];
                $scope.$apply();
            }
        }
    }
    vm.eventsGammes ={
        onSelectAll : function(){
            if(vm.search.gammes.length){
                vm.search.gammes = [];
                $scope.$apply();
            }
        }
    }
    vm.multiSelectSettings = { 
        checkBoxes: true, 
        enableSearch : true, 
        showUncheckAll: false,
        displayProp: 'name',
        scrollableHeight: '300px', 
        scrollable: true,
    };
    var ua = navigator.userAgent,
        event = (ua.match(/iP/i)) ? 'touchstart' : 'click';
    $(document).off('change', '#check-all');
    $(document).on('change', '#check-all', function(event) {
        if( $(this).is(':checked') ){
            $('[type="checkbox"]').prop('checked', true);
        }else{
            $('[type="checkbox"]').prop('checked',false);
        }
    });
    $(document).off(event, '.add-photo-box');
    $(document).on(event, '.add-photo-box', function(event) {
        $('[name=picture]').trigger('click');
    });
    $(document).on('change', '[name="picture"]', function(event) {
        var input = this;
        var url = $(this).val();
        var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        if (input.files && input.files[0]&& (ext == 'gif' || ext == 'png' || ext == 'jpeg' || ext == 'jpg')) {
            var reader = new FileReader();
            reader.onload = function (e) {
               $('.add-photo-box').find('img').attr('src', e.target.result);
               vm.addPhotos();
               $scope.$apply();
            }
           reader.readAsDataURL(input.files[0]);
        }
    });

     $(document).off(event, '.drop');
    $(document).on(event, '.drop', function(event) {
        event.preventDefault();
        $('.devis_produits').toggleClass('open');
    });
    $(document).on(event, '.toCopy', function(event) {
        var $temp = $('<input>');
        $('body').append($temp);
        $temp.val( $(this).text() ).select();
        document.execCommand('copy');
        $temp.remove();
    });     
}
export default {
    name: 'produitsController',
    fn: produitsController
};