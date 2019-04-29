function devisController($scope, $rootScope, $uibModal,$state, WS, $localStorage, AppSettings) {
  'ngInject';
  const vm = this;
  let addProductModalInstance;
  vm.quotation = {};
  vm.quotation.quotation_details = [];
  vm.total = 0;
  vm.somme_stock=0;
  vm.isChanged=0;
  let table = null;

  vm.log = function(e){
    console.log(e);
  }
  vm.calculTotal = function(){
    vm.total = 0;
    angular.forEach(vm.quotation.quotation_details, function(value){
      value.qte = vm.calculerStock(value.stock);
      vm.total += value.sale_price * value.qte;
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
          $scope.$apply();
      }
    })
  }
  vm.getClients = function(search) {
    WS.get('client', 'query=' + search)
      .then(function(res) {
        if (res.data.succes == 'false') {
          console.log(res.data.msg);
        } else {
          vm.clients = res.data.clients;
          $scope.$apply();
        }
        $('.loader').addClass('hidden');
      })
      .then(null, function(error) {
        window.notif(''+error.msg, 'error');
        $('.loader').addClass('hidden');
      });
  }
  vm.getProduits = function(format = 0) {
    let o = {};
    o.format=0;
    o.qtr_exhausted=0;
    o.quantite=1;
    o.with_stock=1;
    o.lissage=1;

    WS.post('product/search', o )
      .then(function(res) {
        if (res.data.succes == 'false') {
          console.log(res.data.msg);
        } else {
          $('.loader').addClass('hidden');
          vm.produits = res.data.products;
          $scope.$apply();
        }
      })
      .then(null, function(error) {
        window.notif(error.data.msg, 'error');
        $('.loader').addClass('hidden');

      });
  }
  vm.getDevises = function() {
    WS.get('change')
      .then(function(res) {
        if (res.data.succes == 'false') {
          console.log(res.data.msg);
        } else {
          vm.devises = res.data.changes;
          $.each(vm.devises, function(index, item) {
             if(item.name == '€'){
              if(!vm.quotation.change_id){ 
                vm.quotation.change_id = item.id;
              }
            }
          });

          $scope.$apply();
        }
          $('.loader').addClass('hidden');
      })
      .then(null, function(error) {
        window.notif(''+error.msg, 'error');
        $('.loader').addClass('hidden');

      });
  }
  vm.getQuotation = function(id) {
    alert('test');
    if(!id){
      id = $state.params.id;
    }
    WS.get('quotation/'+id)
      .then(function(res) {
        if (res.data.succes == 'false') {
          console.log(res.data.msg);
        } else {
          vm.quotation = res.data.quotation;
          vm.print_id = id;
          $scope.$apply();
          vm.calculTotal();
        }
        $('.loader').addClass('hidden');
      })
      .then(null, function(error) {
        window.notif(''+error.msg, 'error');
        $('.loader').addClass('hidden');
      });
  }
  vm.dupliquer = function(id){
    WS.post('quotation/duplication', {quotation_id: id}  )
      .then(function(res) {
        if (res.data.succes == 'false') {
          console.log(res.data.msg);
        } else {
          console.log(res.data);
          window.notif('Devis dupliquer avec succée','success');
            swal({
                text               : 'Voulez vous éditer le nouveau devis ?',
                type               : 'warning',
                showCancelButton   : true,
                confirmButtonColor : '#3085d6',
                cancelButtonColor  : '#d33',
                confirmButtonText  : 'Oui',
                cancelButtonText   : 'Non'
            }).then(function (result) {
              $state.go('app.devis.details', { id: res.data.quotation.id });
            });

          $scope.$apply();
        }
        $('.loader').addClass('hidden');
      })
      .then(null, function(error) {
        window.notif(''+error.msg, 'error');
        $('.loader').addClass('hidden');
      });
  }
  vm.getQuotations = function(filter=null) {
    let o ='' ;
    if(filter){
      o= $.param(filter);
    }
    WS.get('quotation', o)
      .then(function(res) {
        if (res.data.succes == 'false') {
          console.log(res.data.msg);
        } else {
          if(table){
            table.destroy();
          }
          vm.quotations = res.data.quotations;
          $scope.$apply();
          table = $('#liste_devis').DataTable({
                    'pageLength': 100,
                    'bFilter': false,
                    initComplete: function(settings, json) {
                      $('.loader').addClass('hidden');
                    }
                  });
        }
        $('.loader').addClass('hidden');
      })
      .then(null, function(error) {
        window.notif(''+error.msg, 'error');
        $('.loader').addClass('hidden');
      });
  }
  vm.deleteDevis = function(id){
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
        WS.delete('quotation/'+id)
            .then(function(res) {
                $('.loader').addClass('hidden');
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                    window.notif(res.data.msg,'success');
                    vm.getQuotations();
                }
            })
            .then(null, function(error) {
                window.notif(''+error.msg,'error');
                $('.loader').addClass('hidden'); 
            });
    })
  }
  vm.addQuotation = function() {
    let o = {};
    angular.copy( vm.quotation, o );

    if(o.client && o.client.originalObject){
      o.client_id = o.client.originalObject.id;
    }
    delete o.client;
    WS.post('quotation', o)
      .then(function(res) {
        if (res.data.succes == 'false') {
          console.log(res.data.msg);
        } else {
          $('.loader').addClass('hidden');
          window.notif(res.data.msg, 'success');
          $state.go('app.devis.index');
        }
      })
      .then(null, function(error) {
        window.notif(''+error.data.msg, 'error');
        $('.loader').addClass('hidden');

      });
  }
  vm.updateQuotation = function() {
    let o = {};
    angular.copy( vm.quotation, o );
    if(o.client && o.client.originalObject){
      o.client_id = o.client.originalObject.id;
      delete o.client;
    }
    WS.put('quotation/'+$state.params.id, o)
      .then(function(res) {
        if (res.data.succes == 'false') {
          console.log(res.data.msg);
        } else {
          $('.loader').addClass('hidden');
          window.notif('' + res.data.msg, 'success');
        }
      })
      .then(null, function(error) {
        window.notif(''+error.data.msg, 'error');
        $('.loader').addClass('hidden');

      });
  }
  vm.calculerStock = function(stock) {
    let s = 0;
    angular.forEach(stock, function(t) {
      if (t.value && t.value != NaN) {
        if(parseInt(t.qtr)<parseInt(t.value)){
          t.value = t.qtr;
        }
        s += t.value * 1;
      }
    })
    return s;
  }
  vm.lissage = function(produit_id, qte, showModal=1){
    vm.isChanged = 1;
    let url = 'product_id=' + produit_id+'&quantity=' + qte;
    if( vm.quotation && vm.quotation.id ){
      url+= '&quotation_id='+vm.quotation.id;
    }
    WS.get('quotation/lissage', url)
      .then(function(res) {
        if (res.data.succes == 'false') {
          console.log(res.data.msg);
        } else {
          $('.loader').addClass('hidden');
          let produit = vm.quotation.quotation_details.filter(function(obj) {
            return obj.product_id == produit_id;
          })[0];
          if(produit){
            $scope.$apply();
            vm.somme_stock = 0;
            angular.forEach(produit.stock, function(item){
              item.qtr   = res.data.stock.filter(function(obj) { return obj.name == item.name; })[0].qtr*1;
              item.qtt   = res.data.stock.filter(function(obj) { return obj.name == item.name; })[0].qtt*1;
              item.value = res.data.lissage[item.name]*1;

              vm.somme_stock += item.qtr;
            })
            vm.selected = produit;
            vm.isChanged=1;

            // vm.selected.product_id = produit.product_id;
            $scope.$apply();
            vm.calculTotal();

            if(showModal){
              $('#lissage').modal('show');
            }
          }
        }
      })
      .then(null, function(error) {
        window.notif(''+error.data.msg, 'error');
        $('.loader').addClass('hidden');
      });
  }
  vm.selectedProduct = function(item) {
    if (!item) {
      return;
    }
    let exist = vm.quotation.quotation_details.filter(function(obj) {
      return obj.id == item.originalObject.id;
    });
    if (exist.length > 0) {
      window.notif('Produit exsite déjà dans la liste', 'error');
      return;
    } 
    vm.selected = item.originalObject;
    vm.selected.product_id = item.originalObject.id;
    vm.selected.qte = item.originalObject.qtt*1;
    vm.selected.sale_price = item.originalObject.sale_vanam_price*1;
    vm.quotation.quotation_details.unshift(vm.selected);
    vm.lissage(vm.selected.id, vm.selected.qte, 0);
    vm.isChanged=1;
  }
  vm.removeProduct = function(index, call_ws=0, product_id) {
    vm.quotation.quotation_details.splice(index, 1);
    if( call_ws ){
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
          WS.delete('quotation/products/'+vm.quotation.id+'/'+product_id)
              .then(function(res) {
                  $('.loader').addClass('hidden');
                  if(res.data.succes=='false'){
                      console.log(  res.data.msg );
                  }else{
                      window.notif(res.data.msg,'success');
                      vm.getQuotation(vm.quotation.id);
                      vm.calculTotal();
                  }
              })
              .then(null, function(error) {
                  window.notif(''+error.msg,'error');
                  $('.loader').addClass('hidden'); 
              });
      })
    }
    vm.isChanged=1;
  }
  vm.transformer = function(id){
    WS.post('quotation/convert', {quotation_id:id})
        .then(function(res) {
          if (res.data.succes == 'false') {
            console.log(res.data.msg);
          } else {
            $('.loader').addClass('hidden');
            
            swal({
                text               : 'Voulez vous éditer la nouvelle commande créée',
                type               : 'success',
                showCancelButton   : true,
                confirmButtonColor : '#3085d6',
                cancelButtonColor  : '#d33',
                confirmButtonText  : 'Oui',
                cancelButtonText   : 'Non'
            }).then(function (result) {
              $state.go('app.commande.details', {id: res.data.command_id});  
            });


          }
        })
        .then(null, function(error) {
          window.notif(''+error.data.msg, 'error');
          $('.loader').addClass('hidden');
        });
  }
  vm.transformerDevis = function(data){
    console.log('transformerDevis',data);
    vm.quotation = {};
    vm.getDevises();
    vm.quotation.quotation_details = [];
    // vm.quotation.change_id = '1';
    angular.forEach(data, function(product){
        WS.get('product/'+product.id)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                  let p = res.data.product;
                  p.product_id = p.id;
                  p.qte = p.qtt*1;
                  p.sale_price = p.sale_vanam_price*1;
                  vm.quotation.quotation_details.unshift(p);
                  vm.lissage(p.id, p.qte, 0);
                  $scope.$apply();
                  $('.loader').addClass('hidden');
                }
            })
            .then(null, function(error) {
                window.notif(error.data.msg,'error');
                $('.loader').addClass('hidden');
                
            });


    })
  }
  vm.imprimer = function(params) {
    let id = vm.print_id;
    WS.get('quotation/file/' + id, $.param(params))
      .then(function(res) {
        if (res.data.succes == 'false') {
          console.log(res.data.msg);
        } else {
          $('.loader').addClass('hidden');
          if(res.data.url_file){
            $('#exports').modal('hide');
            window.open(AppSettings.apiUrl + '' + res.data.url_file);
          }  
          $scope.$apply();
        }
      })
      .then(null, function(error) {
        window.notif(error.data.msg, 'error');
        $('.loader').addClass('hidden');
      });
  }
  vm.fermer = function(){
    if( vm.isChanged ){
      swal({
        text               : 'Voulez vous vraiment quitter cette page sans enregister les informations en cours ?',
        type               : 'warning',
        showCancelButton   : true,
        confirmButtonColor : '#3085d6',
        cancelButtonColor  : '#d33',
        confirmButtonText  : 'Oui, quitter',
        cancelButtonText   : 'Rester'
      }).then(function () {
        $state.go('app.devis.index');
      })
    }else{
      $state.go('app.devis.index');
    }
  }
  vm.openDetailsProduit = function(product_id) {
    if( $('meta[name="product_id"]').length ){
      $('meta[name="product_id"]').attr('content',(product_id * 1));
    }else{
      $('head').append('<meta name="product_id" content="' + (product_id * 1) + '" />');
    }

    addProductModalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'detailsProduit.html',
      controller: 'produitsController',
      controllerAs: 'vm',
      size: 'lg'
    });
  }
  vm.closeModalLissage = function(){
    $('.modal').modal('hide');
  } 
  vm.showprice = function(){
        vm.showPrice = 1;
        setTimeout(function() {
            vm.showPrice = 0;
            $scope.$apply();
        }, 200);
  }
  vm.affectCompany = function(user){
    console.log( 'user : ',user );
    // vm.quotation.client = user;
  }
  $rootScope.$on('transformerDevis', function (event, data) {
    vm.transformerDevis(data);
  });

  jQuery(document).ready(function($) {
    let ua = navigator.userAgent,
      event = (ua.match(/iP/i)) ? 'touchstart' : 'click';

    $('.modal').on('shown.bs.modal', function() {
      $(this).find('[autofocus]').focus();
    });

    $('.input-search-produit').keydown(function(event) {
      if(event.keyCode === 13){
        console.log( $(this).val() );
      }
    });

    $(document).off(event, '.closeModal');
    $(document).on(event, '.closeModal', function(event) {
      addProductModalInstance.close();
      event.preventDefault();
      event.stopPropagation();
    });
  });
}
export default {
  name: 'devisController',
  fn: devisController
};
