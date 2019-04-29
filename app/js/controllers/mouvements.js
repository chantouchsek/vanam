function mouvementsController($scope, $rootScope, $state, WS, $uibModal, AppSettings, moment) {
    'ngInject';
    const vm = this;

    let table = null;
    let addProductModalInstance;
    vm.produits = [];
    vm.liersItems = [];
    vm.entry_event_details = [];
    vm.headers = [];
    vm.canUpload = 1;
    vm.nb_elements = 50;
    vm.current_page = 1;

    //stock 
    vm.selectedStock = [];

    vm.url = AppSettings.apiUrl;
    vm.mouvement = {
        entry_event_details: []
    };
    vm.selected = {};
    vm.search = {
        start_date: moment().subtract(30, 'days').toDate(),
        end_date: moment().toDate()
    };
    vm.print  = {
        rate_price: 0,
        purchase_price: 0
    }
    vm.listItems = [{
        i: 0,
        value: 'Référence',
        obligatoire: 1
    }, {
        i: 2,
        value: 'Description',
        obligatoire: 1
    }, {
        i: 3,
        value: 'Categorie',
        obligatoire: 1
    }, {
        i: 4,
        value: 'Marque',
        obligatoire: 1
    }, {
        i: 5,
        value: 'Genre'
    }, {
        i: 6,
        value: 'Sport'
    }, {
        i: 7,
        value: 'Color'
    }, {
        i: 8,
        value: 'Prix vente public'
    }, {
        i: 9,
        value: 'Prix vente tarif'
    }, {
        i: 10,
        value: 'Prix vente vanam'
    }, {
        i: 11,
        value: 'Prix achat',
        obligatoire: 1
    }, {
        i: 12,
        value: 'Aisle'
    }, {
        i: 13,
        value: 'Palette'
    }, {
        i: 14,
        value: 'Ville zonage'
    }, ];

    vm.getDevises = function() {
        WS.get('change')
        .then(function(res) {
            if (res.data.success == 'false') {
                console.log(res.data.msg);
            } else {
            vm.devises = res.data.changes;
            $.each(vm.devises, function(index, item) {
                if(item.name == '€'){
                if(!vm.mouvement.change_id){ 
                    console.log( item.id );
                    vm.mouvement.change_id = item.id;
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

    vm.openMouvement = function(id) {
        $state.go('app.traitements.mouvements.details', {
            id: id
        });
    }
    vm.removeProduct = function(index) {
        vm.mouvement.entry_event_details.splice(index, 1);
    }
    vm.updateStock = function(range_detail_id, produit_id, entry_event_detail_id, new_value, keyCode) {
        alert(keyCode);
        WS.put('entry/product', {
                product_id: produit_id,
                range_detail_id: range_detail_id,
                entry_event_detail_id: entry_event_detail_id,
                new_value: new_value
            })
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    window.notif('Stock modifié avec succès.', 'success');
                }
                if (keyCode == 13) {
                    $('.modal').modal('hide');
                }
                $('.loader').addClass('hidden');

                vm.getMouvementByID();
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');

            });
    }

    vm.closeModal = function(){
        $('.modal').modal('hide');
    }

    vm.initMouvement = function() {
        vm.mouvement = {
            entry_event_details: []
        };
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

    vm.getMouvementByID = function(id) {
        vm.entry_event_details = [];
        if (!id) {
            id = $state.params.id
        };
        WS.get('entry/' + id, 'nb_elements=' + vm.nb_elements + '&current_page=' + vm.entry_event_details.length)
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    $('.loader').addClass('hidden');
                    vm.mouvement = res.data.entry_event;
                    // vm.entry_event_details = vm.entry_event_details.concat(res.data.entry_event.entry_event_details);
                    $scope.$apply();
                    // if (res.data.entry_event.entry_event_details.length > 0) {
                        // vm.current_page++;
                        // vm.getMouvementByID();
                    // } else {
                        // $('.loader').removeClass('hide');
                    // }
                }
            })
            .then(null, function(error) {
                window.notif(error.data.msg, 'error');
                $('.loader').addClass('hidden');

            });
    }

    vm.imprimer = function(id) {
        if (!id) {
            id = vm.mouvement.id;
        }
        if (vm.print_id) {
            id = vm.print_id;
        }

        var url = 'rate_price=' + vm.print.rate_price + '&purchase_price=' + vm.print.purchase_price

        WS.get('entry/print/' + id, url)
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    $('.loader').addClass('hidden');
                    window.open(AppSettings.apiUrl + '' + res.data.url_file);
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(error.data.msg, 'error');

                $('.loader').addClass('hidden');

            });
    }
    vm.getProduits = function() {
        WS.get('product')
            .then(function(res) {
                if(res.data.success === 'true')
                {
                    $('.loader').addClass('hidden');
                    vm.produits = res.data.products;
                    $scope.$apply();
                }
                else
                {
                    window.notif(error.data.msg, 'error');
                }
            })
            .then(null, function(error) {
                window.notif(error.data.msg, 'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.getStock = function(ligne) {
        WS.get('entry/product/'+ligne.id, 'is_entry_event=1')
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    $('.loader').addClass('hidden');
                    vm.selected=res.data;
                    vm.entry_event_detail_id = ligne.id;
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif(error.data.msg, 'error');
                $('.loader').addClass('hidden');

            });
    }
    vm.getMouvements = function(search) {
        var url = '';
        if (search && search.num_inf_value) {
            url += 'num_inf_value=' + search.num_inf_value;
        }
        if (search && search.start_date) {
            url += '&start_date=' + moment(search.start_date).format('YYYY/MM/DD');
        }
        if (search && search.end_date) {
            url += '&end_date=' + moment(search.end_date).format('YYYY/MM/DD');
        }
        WS.get('entry', url)
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    vm.mouvements = res.data.entry_events;
                    if (table) {
                        table.destroy();
                    }
                    $scope.$apply();
                    table = $('#mouvements').DataTable({
                        'bFilter': false,
                        initComplete: function(settings, json) {
                            $('.loader').addClass('hidden');
                        }
                    });
                }
            })
            .then(null, function(error) {
                window.notif(error.data.msg, 'error');
                $('.loader').addClass('hidden');

            });
    }

    // selected product when auto complete press enter
    vm.selectedProduct = function(item) {
        if (!item) {
            return;
        }
        var exist = vm.mouvement.entry_event_details.filter(function(obj) {
            return obj.product_id == item.originalObject.id;
        }); 
        if (exist.length > 0) {
            window.notif('Produit exsite déjà dans la liste', 'error');
            return;
        } 
        
        WS.get('product/' + item.originalObject.id, 'is_entry_event=1')
            .then(function(res) {
                if(res.data.success === 'true')
                {
                    vm.selected                 = res.data.product;
                    vm.selected.product_id      = res.data.product.id;
                    $scope.$broadcast('angucomplete-alt:clearInput');
                    vm.mouvement.entry_event_details.push(vm.selected);
                    $('.loader').addClass('hidden');   
                    $('#ajoutStock').modal('show');
                    $scope.$apply();
                }
                else 
                {
                    console.log(res.data.msg);
                }
            })
            .then(null, function(error) {
                window.notif(error.data.msg, 'error');
                $('.loader').addClass('hidden');

            });
    }
    vm.saveMouvement = function() {
        WS.post('entry', vm.mouvement)
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    window.notif('Mouvement ajouté avec succès.', 'success');
                }
                $state.go('app.traitements.mouvements.details',{id:res.data.entry_event_id });
                $('.loader').addClass('hidden');
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');

            });
    }
    vm.updateMouvement = function() {
        vm.closeModal();

        return;
        if( $state.current.name == 'app.traitements.mouvements.add' ){
            return; 
        }
        WS.put('entry', vm.mouvement)
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    window.notif('Mouvement modifié avec succès.', 'success');
                    vm.getMouvementByID();

                }
                $('.loader').addClass('hidden');
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');

            });
    }
    vm.deleteProduct = function(id) {
        swal({
            title: 'Êtes-vous sûr?',
            text: 'Vous ne pourrez pas revenir à cela!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimez-le!',
            cancelButtonText: 'Annuler'
        }).then(function() {
            WS.delete('entry/product?entry_event_detail_id=' + id)
                .then(function(res) {
                    if (res.data.succes == 'false') {
                        console.log(res.data.msg);
                    } else {
                        window.notif('Produit supprimé avec succès.', 'success');
                        vm.getMouvementByID();
                    }
                    $('.loader').addClass('hidden');
                })
                .then(null, function(error) {
                    window.notif('' + error.msg, 'error');
                    $('.loader').addClass('hidden');

                });
        })
    }
    vm.openDetailsProduit = function(product_id) {

        if ($('meta[name="product_id"]').length) {
            $('meta[name="product_id"]').attr('content', (product_id * 1));
        } else {
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
    vm.delete = function(id) {
        swal({
            title: 'Êtes-vous sûr?',
            text: 'Vous ne pourrez pas revenir à cela!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimez-le!',
            cancelButtonText: 'Annuler'
        }).then(function() {
            WS.delete('entry?entry_event_id=' + id)
                .then(function(res) {
                    if (res.data.succes == 'false') {
                        console.log(res.data.msg);
                    } else {
                        window.notif('Mouvement supprimé avec succès.', 'success');
                        vm.getMouvements();
                    }
                    $('.loader').addClass('hidden');
                })
                .then(null, function(error) {
                    window.notif('' + error.msg, 'error');
                    $('.loader').addClass('hidden');

                });
        })
    }
    vm.getGammes = function() {
        WS.get('range')
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    vm.gammes = res.data.ranges;
                    vm.gammeItems = res.data.ranges;
                    $scope.$apply();
                }
                $('.loader').addClass('hidden');
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.getGammes();
    vm.getDetails = function(gamme) {
        if (gamme) {
            vm.details_gamme = gamme;
        }
        WS.get('range/detail', 'range_id=' + vm.details_gamme.id)
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    vm.range_details = res.data.range_details;
                    $scope.$apply();
                    $('.loader').addClass('hidden');
                }
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');

            });
    }

    //TODO : à optimiser
    vm.modalNewGamme = function(product, value, name) {
        vm.parent_gamme_id = 0;
        var gamme_id;
        angular.forEach(product.ranges, function(gamme) {
            if (gamme.range_id || product.range_id) {
                if (gamme.range_id) {
                    gamme_id = gamme.range_id;
                }
                if (product.range_id) {
                    gamme_id = product.range_id;
                }
                angular.forEach(vm.gammes, function(gamme) {
                    let g = gamme.ranges.find(item => item.id == gamme_id);
                    if (g) {
                        vm.parent_gamme_id = g.id;
                    }
                });
                return;
            }
        });

        $('#accordion .collapse.in').removeClass('in');
        vm.gamme = value;
        vm.gamme.range_detail_id = gamme_id;
        vm.gamme.old_name = name;
        vm.new = 0;
        $('#gamme').modal('show');
    }
    vm.addGamme = function(gamme = false) {
        if (gamme) {
            angular.forEach(vm.products, function(product) {
                angular.forEach(product.ranges, function(range, key) {
                    if (vm.gamme.old_name == key) {
                        range.status = true;
                        range.name = gamme.name;
                        range.range_id = gamme.id;
                        if (vm.parent_gamme_id == 0) {
                            angular.forEach(vm.gammes, function(_gamme) {
                                let g = _gamme.ranges.find(item => item.id == gamme.id);
                                if (g) {
                                    vm.parent_gamme_id = _gamme.id;
                                }
                            });
                        }
                        product.range_id = vm.parent_gamme_id;
                    }
                });
            });
            $('#gamme').modal('hide');
        } else {
            WS.post('range/detail', vm.gamme)
                .then(function(res) {
                    if (res.data.succes == 'false') {
                        console.log(res.data.msg);
                    } else {
                        angular.forEach(vm.products, function(product) {
                            angular.forEach(product.ranges, function(range, key) {
                                if (vm.gamme.old_name == key) {
                                    range.status = true;
                                    range.name = vm.gamme.name;
                                }
                            });
                        });
                        $('#gamme').modal('hide');
                        $scope.$apply();
                    }
                    $('.loader').addClass('hidden');
                })
                .then(null, function(error) {
                    window.notif('' + error.msg, 'error');
                    $('.loader').addClass('hidden');
                });
        }
    }
    vm.openModalAddProduct = function() {
        WS.get('product/exist/' + $('[ng-model="searchStr"]').val())
            .then(function(res) {
                $('.loader').addClass('hidden');
                if(res.data.exist==false){
                    if( $('meta[name="reference"]').length ){
                        $('meta[name="reference"]').attr('content', $('[ng-model="searchStr"]').val());
                    }else{
                        $('head').append('<meta name="reference" content="' + $('[ng-model="searchStr"]').val() + '" />');
                    }
                    addProductModalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'addProduct.html',
                        controller: 'produitsController',
                        controllerAs: 'vm',
                        size: 'lg'
                    });

                    addProductModalInstance.result.then(function(selectedItem) {
                        setTimeout(function() {
                            vm.getProduits();
                        }, 2000);
                    }, function() {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                }
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.uploadFile = function() {
        vm.file_name = $('[name="file"]').val().replace('C:\\fakepath\\', '');
        vm.canUpload = 0;
        var formData = new FormData();
        formData.append('file', $('[name="file"]')[0].files[0]);
        WS.post('entry/import/stepone', formData, undefined)
            .then(function(res) {

                $('.loader').addClass('hidden');
                if (res.data.success == 'false') {
                    console.error(res.data.msg);
                } else {
                    vm.canUpload = 1;
                    var t = [];
                    angular.forEach(res.data.headers, function(val, key) {
                        t.push({
                            i: i++,
                            key: key,
                            value: val
                        });
                    });
                    vm.headers = t;

                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');
                console.error(error);
            });
    }
    vm.uploadImages = function() {
        vm.file_name = $('[name="file"]').val().replace('C:\\fakepath\\', '');
        vm.canUpload = 0;
        var formData = new FormData();
        formData.append('file', $('[name="file"]')[0].files[0]);
        WS.post('entry/import/pictures', formData, undefined)
            .then(function(res) {
                $('.loader').addClass('hidden');
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    vm.report = res.data;
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');

            });
    }
    vm.lier = function() {
        var items1 = [];
        var items2 = [];
        vm.liersItem = {};
        if ($('#list1 option:selected').length == 0 || $('#list2 option:selected').length == 0) {
            return;
        }
        $('#list1 option:selected').each(function(index, el) {
            items1.push({
                i: $(el).data('i'),
                key: $(el).data('key'),
                value: $(el).text()
            });
            vm.headers = vm.headers.filter(function(c) {
                return c.key != $(el).data('key');
            });
        });
        $('#list2 option:selected').each(function(index, el) {
            items2.push({
                i: $(el).data('i'),
                value: $(el).data('value'),
                obligatoire: $(el).data('obligatoire'),
                type: $(el).data('type'),
                is_range: $(el).data('is_range')
            });
            vm.listItems = vm.listItems.filter(function(c) {
                return c.value != $(el).data('value');
            });
            vm.gammeItems = vm.gammeItems.filter(function(c) {
                return c.name != $(el).data('value');
            });
        });
        $('#list1 option:selected').prop('selected', false);
        $('#list2 option:selected').prop('selected', false);
        if (items1.length && items2.length) {
            vm.liersItems.push([items1, items2]);
            console.log(vm.liersItems);
        }
    }
    vm.dissocier = function(index, value1, value2) {
        vm.liersItems.splice(index, 1);
        angular.forEach(value1, function(el) {
            vm.headers.push(el);
        });
        angular.forEach(value2, function(el) {
            if (el.type == 'gamme') {
                el.name = el.value;
                vm.gammeItems.push(el);
            } else {
                vm.listItems.push(el);
            }
        });
    }
    vm.envoyerLiaisons = function() {
        var obligatoires = vm.listItems.filter(function(c) {
            return c.obligatoire == 1;
        });

        if (obligatoires.length) {
            window.notif('Veuillez choisir tous les elements obligatoires <i>contenant *</i>', 'error');
            return;
        }
        var o = {};
        o.data = vm.liersItems;
        o.file_name = vm.file_name;
        WS.post('entry/import/steptwo', o)
            .then(function(res) {
                $('.loader').addClass('hidden');
                if (res.data.success == 'false') {
                    console.log(res.data.msg);
                } else {
                    vm.step = 2;
                    vm.products = res.data.data;
                    console.log(res.data);
                    $scope.$apply();
                    $('[href="#etape2"]').trigger('click');
                }
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.getBrands = function() {
        WS.get('brand')
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data);
                } else {
                    vm.brands = res.data.brands;
                    $scope.$apply();
                }
            })
            .then(null ,function(error) {
                console.error(error);
                //window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.getGenders = function() {
        WS.get('gender')
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    vm.genders = res.data.genders;
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');
            });

    }
    vm.getSports = function() {
        WS.get('sport')
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    vm.sports = res.data.sports;
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.getCategories = function() {
        WS.get('category')
            .then(function(res) {
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    vm.categories = res.data.categories;
                    $scope.$apply();
                }
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.verifStatusRanges = function(product) {
        var status = true;
        angular.forEach(product.ranges, function(range, key) {
            if (range.status == false || range.status == 'false') {
                status = false;
            }
        });
        if (product['Marque'] && !product.marque) {
            status = false;
        }
        if (product['Genre'] && !product.genre) {
            status = false;
        }
        if (product['Sport'] && !product.sport) {
            status = false;
        }
        if (product['Categorie'] && !product.categorie) {
            status = false;
        }
        return status;
    }
    vm.lierMarque = function(_marque, v) {
        angular.forEach(vm.products, function(product) {
            if (vm._marque == product['Marque']) {
                product.marque = v;
            }
        });
        $('[data-marque="' + _marque + '"]').html(v.name)
            .attr('data-id', v.id)
            .removeClass('badge-danger')
            .addClass('badge-success');
        $('.modal').modal('hide');
    }
    vm.lierGenre = function(_genre, v) {
        angular.forEach(vm.products, function(product) {
            if (vm._genre == product['Genre']) {
                product.gender = v;
            }
        });
        $('[data-genre="' + _genre + '"]').html(v.name)
            .attr('data-id', v.id)
            .removeClass('badge-danger')
            .addClass('badge-success');
        $('.modal').modal('hide');
    }
    vm.lierSport = function(_sport, v) {
        angular.forEach(vm.products, function(product) {
            if (vm._sport == product['Sport']) {
                product.sport = v;
            }
        });
        $('[data-sport="' + _sport + '"]').html(v.name)
            .attr('data-id', v.id)
            .removeClass('badge-danger')
            .addClass('badge-success');
        $('.modal').modal('hide');
    }
    vm.lierCategorie = function(_categorie, v) {
        angular.forEach(vm.products, function(product) {
            if (vm._categorie == product['Categorie']) {
                product.categorie = v;
            }
        });
        $('[data-categorie="' + _categorie + '"]').html(v.name)
            .attr('data-id', v.id)
            .removeClass('badge-danger')
            .addClass('badge-success');
        $('.modal').modal('hide');
    }
    vm.envoyerProduits = function() {
        console.error($('.rouge'));
        if ($('.rouge').length && $('.badge-danger').length) {
            window.notif('Veuillez compléter toutes les correspondances attendues', 'error');
            return;
        }
        var o = {};
        o.data = vm.products;
        o.file_name = vm.file_name;
        WS.post('entry/import/stepthree', o)
            .then(function(res) {
                console.log(res);
                console.error(res);
                $('.loader').addClass('hidden');
                if (res.data.succes == 'false') {
                    console.log(res.data.msg);
                } else {
                    vm.step = 3;
                    vm.step3 = res.data;
                    $scope.$apply();
                    $('[href="#etape3"]').trigger('click');
                }
            })
            .then(null, function(error) {
                window.notif('' + error.msg, 'error');
                $('.loader').addClass('hidden');
            });
    }
    vm.toggleProductStatus = function() {
        if (vm.product_status == 1) {
            $('.completed').removeClass('completed');
        } else {
            $('#table_produits tr').each(function(index, el) {
                console.log($(el).find('.rouge').length, $(el).find('.badge-danger').length);
                if ($(el).find('.rouge').length || $(el).find('.badge-danger').length) {
                    $(el).removeClass('completed');
                } else {
                    $(el).addClass('completed');
                }
            });
        }
    }
    vm.getDeviseName = function(id){
        let devise = vm.devises.filter(function(d) {
            return d.id == id;
        })
        return devise[0]?devise[0].name:'';
    }
    $rootScope.$on('addProductSuccess', function(event, data) {
        var o = {};
        o.originalObject = {};
        o.originalObject.id = data.product_id;
        vm.selectedProduct(o);

        addProductModalInstance.close();
        vm.getProduits();
    });
    $(document).ready(function($) {
        var ua = navigator.userAgent,
            event = (ua.match(/iP/i)) ? 'touchstart' : 'click';
        $(document).off(event, '[ng-bind="textNoResults"]');
        $(document).on(event, '[ng-bind="textNoResults"]', function(event) {
            vm.openModalAddProduct();
        });

        $(document).off(event, '.btn-upload-images');
        $(document).on(event, '.btn-upload-images', function(event) {
            $('[name=images]').trigger('click')
        });

        $(document).off(event, '.closeModal');
        $(document).on(event, '.closeModal', function(event) {
            addProductModalInstance.close();
            event.preventDefault();
            event.stopPropagation();
        });

        $(document).on('change', '[name="file"]', function(event) {
            event.preventDefault();
            vm.file_name = $.trim($(this).val().replace('C:\\fakepath\\', ''));
            $scope.$apply();
        });
    });
}
export default {
    name: 'mouvementsController',
    fn: mouvementsController
};