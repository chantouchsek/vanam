function factureController($scope, $rootScope, $uibModal, $state, WS, $localStorage, moment, AppSettings) {
  'ngInject';
  const vm = this;
  vm.invoice = {};
  let table = null;
  let date = new Date(), y = date.getFullYear(), m = date.getMonth();

  vm.filter = {
    start_date : new Date(moment(new Date(y, m, 1)).format('YYYY-MM-DD')),
    end_date : new Date(moment(new Date(y, m + 1, 0)).format('YYYY-MM-DD')),
  }

   
  vm.getDevises = function() {
    WS.get('change')
      .then(function(res) {
        if (res.data.success == 'false') {
          console.log(res.data.msg);
        } else {
          vm.devises = res.data.changes;
          $scope.$apply();
        }
          $('.loader').addClass('hidden');
      })
      .then(null, function(error) {
        window.notif(''+error.msg, 'error');
        $('.loader').addClass('hidden');
      });
  }
  vm.getInvoice = function(id) {
    if(!id){
      id = $state.params.id;
    }
    WS.get('invoices/'+id)
      .then(function(res) {
        if (res.data.success == 'false') {
          console.log(res.data.msg);
        } else {
          vm.invoice = res.data.invoice;
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
  vm.getInvoices = function(filter=null) {
    let o ='' ;
    let f = {};
    angular.copy(filter, f);
    if(filter){
      if(filter.start_date){
        f.start_date = moment(filter.start_date).format('YYYY-MM-DD');
      }
      if(filter.end_date){
        f.end_date = moment(filter.end_date).format('YYYY-MM-DD');
      }

      o= $.param(f);
    }
    WS.get('invoice', o)
      .then(function(res) {
        if (res.data.success == 'false') {
          console.log(res.data.msg);
        } else {
          if(table){
            table.destroy();
          }
          vm.invoices = res.data.invoices;
          $scope.$apply();
          table = $('#liste_invoices').DataTable({
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
  vm.deleteInvoice = function(id){
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
            WS.delete('invoice/'+id)
                .then(function(res) {
                    $('.loader').addClass('hidden');
                    if(res.data.succes=='false'){
                        console.log(  res.data.msg );
                    }else{
                        window.notif(res.data.msg, 'success');
                        vm.getInvoices();
                    }
                })
                .then(null, function(error) {
                    window.notif(''+error.msg,'error');
                    $('.loader').addClass('hidden'); 
                });
        })
  }
  vm.addInvoice = function() {
    var o = {};
    angular.copy( vm.invoice, o );

    o.client_id = o.client.originalObject.id;
    delete o.client;
    WS.post('invoice', o)
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
  vm.updateInvoice = function() {
    var o = {};
    angular.copy( vm.invoice, o );
    if(o.client && o.client.originalObject){
      o.client_id = o.client.originalObject.id;
      delete o.client;
    }
    WS.put('invoices/'+$state.params.id, o)
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
  vm.print = function(command_id, type){
    WS.get('invoice/print', $.param({type:type, command_id:command_id})  )
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
  
}
export default {
  name: 'factureController',
  fn: factureController
};
