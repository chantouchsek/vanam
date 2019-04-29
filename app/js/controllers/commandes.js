function commandeController($scope, $rootScope, $uibModal, $state, WS, $localStorage, AppSettings) {
  'ngInject';
  const vm = this;
  vm.command = {};
  vm.command.command_details = [];
  let addProductModalInstance;
  vm.total = 0;
  vm.somme_stock=0;
  vm.proforma = {};
  vm.isChanged=0;
  let table = null;
  vm.url = AppSettings.apiUrl;
  
  vm.calculTotal = function(){
    vm.total = 0;
    angular.forEach(vm.command.command_details, function(value){
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
        if (res.data.success == 'false') {
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
    console.log('getProduits');
    var o = {};
    o.format=0;
    o.qtr_exhausted=0;
    o.quantite=1;
    o.with_stock=1;
    o.lissage=2;

    WS.post('product/search', o )
      .then(function(res) {
        if (res.data.success == 'false') {
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
              if(!vm.command.change_id){ 
                vm.command.change_id = item.id;
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
  vm.getCommand = function(id) {
    if(!id){
      id = $state.params.id;
    }
    WS.get('command/'+id)
      .then(function(res) {
        if (res.data.success == 'false') {
          console.log(res.data.msg);
        } else {
          vm.command = res.data.command;
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
  vm.getProforma = function(id){
    vm.proforma.command_id = id;
    WS.get('command/proforma', $.param(vm.proforma)  )
      .then(function(res) {
        if (res.data.success == 'false') {
          console.log(res.data.msg);
        } else {
          if(res.data.url_file){
            $('#exports').modal('hide');
            window.open(AppSettings.apiUrl + '' + res.data.url_file);
          }
        }
        $('.loader').addClass('hidden');
      })
      .then(null, function(error) {
        window.notif(''+error.msg, 'error');
        $('.loader').addClass('hidden');
      });
  }
  vm.facturer = function(id){
    WS.post('command/invoice/create', {command_id:id})
      .then(function(res) {
        if (res.data.success == 'false') {
          console.log(res.data.msg);
        } else {
          swal({
            text               : 'Voulez vous consulter la facture ajoutée ?',
            type               : 'success',
            showCancelButton   : true,
            confirmButtonColor : '#3085d6',
            cancelButtonColor  : '#d33',
            confirmButtonText  : 'Oui',
            cancelButtonText   : 'Non'
          }).then(function (choice) {
            $state.go('app.facture.index');
          },function (choice) {
            $state.go('app.commande.index');
          })


        }
        $('.loader').addClass('hidden');
      })
      .then(null, function(error) {
        window.notif(''+error.msg, 'error');
        $('.loader').addClass('hidden');
      });
  }
  vm.dupliquerEnDevis = function(id){
    WS.post('command/convert/quotation', {command_id: id}  )
      .then(function(res) {
        if (res.data.success == 'false') {
          console.log(res.data.msg);
        } else {

          if (res.data.success == 'false') {
              console.log(res.data.msg);
            } else {
              swal({
                text               : 'Voulez vous éditer le devis copié ?',
                type               : 'success',
                showCancelButton   : true,
                confirmButtonColor : '#3085d6',
                cancelButtonColor  : '#d33',
                confirmButtonText  : 'Oui',
                cancelButtonText   : 'Non'
              }).then(function (choice) {
                $state.go('app.devis.details', {id: res.data.quotation_id});
              },function (choice) {
                $state.go('app.commande.index');
              })
            $scope.$apply();
          }
          $('.loader').addClass('hidden');
        }
      })
      .then(null, function(error) {
        window.notif(''+error.msg, 'error');
        $('.loader').addClass('hidden');
      });
  } 
  vm.bonPreparation = function(id){
    WS.get('command/bp/print', $.param({command_id:id})  )
      .then(function(res) {
        if (res.data.success == 'false') {
          console.log(res.data.msg);
        } else {
          if(res.data.url_file){
            $('#exports').modal('hide');
            window.open(AppSettings.apiUrl + '' + res.data.url_file);
          }
        }
        $('.loader').addClass('hidden');
      })
      .then(null, function(error) {
        window.notif(''+error.msg, 'error');
        $('.loader').addClass('hidden');
      });
  }
  vm.dupliquer = function(id){
    WS.post('command/duplicate', {command_id: id}  )
      .then(function(res) {
        if (res.data.success == 'false') {
          console.log(res.data.msg);
        } else {
          
          $state.go('app.commande.details', { id: res.data.command.id });
          $scope.$apply();
        }
        $('.loader').addClass('hidden');
      })
      .then(null, function(error) {
        window.notif(''+error.msg, 'error');
        $('.loader').addClass('hidden');
      });
  }
  vm.getCommands = function(filter=null) {
    let o ='' ;
    if(filter){
      o= $.param(filter);
    }
    WS.get('command', o)
      .then(function(res) {
        if (res.data.success == 'false') {
          console.log(res.data.msg);
        } else {
          if(table){
            table.destroy();
          }
          vm.commands = res.data.commands;
          $scope.$apply();
          table = $('#liste_commands').DataTable({
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
  vm.deleteCommand = function(id){
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
            WS.delete('command/'+id)
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif(res.data.msg,'success');
                        vm.getCommands();
                    }
                })
                .then(null, function(error) {
                    window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden'); 
                });
        })
  }
  vm.addCommand = function() {
    var o = {};
    angular.copy( vm.command, o );

    o.client_id = o.client.originalObject.id;
    delete o.client;
    WS.post('command', o)
      .then(function(res) {
        if (res.data.success == 'false') {
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
  vm.updateCommand = function() {
    var o = {};
    angular.copy( vm.command, o );
    if(o.client && o.client.originalObject){
      o.client_id = o.client.originalObject.id;
      delete o.client;
    }
    WS.put('command/'+$state.params.id, o)
      .then(function(res) {
        if (res.data.success == 'false') {
          console.log(res.data.msg);
        } else {
          $('.loader').addClass('hidden');
          window.notif('' + res.data.msg, 'success');
          vm.getCommand();
        }
      })
      .then(null, function(error) {
        window.notif(''+error.data.msg, 'error');
        $('.loader').addClass('hidden');

      });
  }
  vm.calculerStock = function(tailles) {
    var s = 0;
    angular.forEach(tailles, function(t) {
      if (t.value && t.value != NaN) {
        s += t.value * 1;
      }
    })
    return s;
  }
  vm.lissage = function(produit_id, qte, showModal=1){
      let url = 'product_id=' + produit_id+'&quantity=' + qte;
      var produit = vm.command.command_details.filter(function(obj) {
            return obj.product_id == produit_id;
          })[0];

      if(!qte) return;
      if( vm.command && vm.command.id ){
        url+= '&command_id='+vm.command.id;
      }
      WS.get('command/lissage', url)
      .then(function(res) {
        if (res.data.success == 'false') {
          console.log(res.data.msg);
        } else {
          $('.loader').addClass('hidden');
          var produit = vm.command.command_details.filter(function(obj) {
            return obj.product_id == produit_id;
          })[0];
          if(produit){
            $scope.$apply();

            angular.forEach(produit.stock, function(item){
              item.qtr   = res.data.stock.filter(function(obj) { return obj.name == item.name; })[0].qtr*1;
              item.qtt   = res.data.stock.filter(function(obj) { return obj.name == item.name; })[0].qtt*1;
              item.value = res.data.lissage[item.name]*1;
            })
            vm.selected = produit;
            vm.isChanged=1;
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
    var exist = vm.command.command_details.filter(function(obj) {
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
    vm.command.command_details.unshift(vm.selected);
    vm.lissage(vm.selected.id, vm.selected.qte, 0);
    vm.isChanged=1;
  }
  vm.removeProduct = function(index, call_ws=0, product_id) {
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
          WS.delete('command/products/'+vm.command.id+'/'+product_id)
              .then(function(res) {
                  $('.loader').addClass('hidden');
                  if(res.data.succes=='false'){
                      console.log(  res.data.msg );
                  }else{
                      vm.command.command_details.splice(index, 1);
                      window.notif(res.data.msg,'success');
                      vm.getCommand(vm.command.id);
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
  vm.transformerCommand = function(data){
    console.log('transformerCommand',data);
    vm.command = {};
    vm.command.command_details = [];
    vm.command.change_id = '1';
    angular.forEach(data, function(product){
        WS.get('product/'+product.id)
            .then(function(res) {
                if(res.data.succes=='false'){
                    console.log(  res.data.msg );
                }else{
                  var p = res.data.product;
                  p.sale_price = 0;
                  vm.command.command_details.push( p );
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
    var id = vm.print_id;
    WS.get('command/file/' + id, $.param(params))
      .then(function(res) {
        if (res.data.success == 'false') {
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
        $state.go('app.commande.index');
      })
    }else{
      $state.go('app.commande.index');
    }
  }
  vm.uploadFile = function(){
    var formData = new FormData();
    formData.append('command_id', vm.command.id);
    formData.append('file', $('[name="file"]')[0].files[0]);
    WS.post('command/media', formData, undefined)
        .then(function(res) {
            $('.loader').addClass('hidden');
            if(res.data.succes=='false'){
                console.log(  res.data.msg );
            }else{
                window.notif(res.data.msg,'success');
                vm.getCommand(vm.command.id);
            }
        })
        .then(null, function(error) {
            window.notif(''+error.msg,'error');
            $('.loader').addClass('hidden');    
        });
  }
  vm.deleteFile = function(media_id){
    swal({
            title              : 'Voulez vous vraiment supprimer le fichier?',
            text               : 'Vous ne pourrez pas revenir à cela!',
            type               : 'warning',
            showCancelButton   : true,
            confirmButtonColor : '#3085d6',
            cancelButtonColor  : '#d33',
            confirmButtonText  : 'Oui, supprimez-le!',
            cancelButtonText  : 'Annuler'
        }).then(function () {
            WS.delete('command/media/'+ vm.command.id +'/'+media_id)
              .then(function(res) {
                  $('.loader').addClass('hidden');
                  if(res.data.succes=='false'){
                      console.log(  res.data.msg );
                  }else{
                      window.notif(res.data.msg,'success');
                      vm.getCommand(vm.command.id);
                  }
              })
              .then(null, function(error) {
                  window.notif(''+error.msg,'error');
                  $('.loader').addClass('hidden');    
              });
        })
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
  $rootScope.$on('transformerCommand', function (event, data) {
    vm.transformerCommand(data);
  });
  jQuery(document).ready(function($) {
    
    var ua = navigator.userAgent,
      event = (ua.match(/iP/i)) ? 'touchstart' : 'click';
    $(document).off(event, '.btn-add-file');
    $(document).on(event, '.btn-add-file', function(event) {
      
      $('[name=file]').trigger('click');
    });

    $(document).off(event, '.closeModal');
    $(document).on(event, '.closeModal', function(event) {
      addProductModalInstance.close();
      event.preventDefault();
      event.stopPropagation();
    });

    $(document).on('change', '[name="file"]', function(event) {
        var input = this;
        var url = $(this).val();
        var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
            var reader = new FileReader();
            reader.onload = function (e) {
               vm.uploadFile();
               $('[name="file"]').val('');
               $scope.$apply();
            }
           reader.readAsDataURL(input.files[0]);
    });

    $('.modal').on('shown.bs.modal', function() {
      $(this).find('[autofocus]').focus();
    });


  });
  // $scope.$watch('vm.selectedProduct',function(newVal, oldVal) {
  //        if(!newVal) return;
  //        vm.command.command_details.push( newVal.originalObject );
  //    })
}
export default {
  name: 'commandeController',
  fn: commandeController
};
