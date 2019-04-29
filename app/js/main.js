window.notif = function(message, type){
    jQuery(document).ready(function($) {
        $('#alert').fadeIn().removeClass('hidden');
        $('#alert').removeClass('alert-error').removeClass('alert-success');
        $('#alert').addClass('alert-'+type);
        $('#alert').find('.'+type).removeClass('hidden')
        if(message=='undefined'){
            $('#alert').find('p').html('500 : Erreur serveur');
        }else{
            $('#alert').find('p').html(message);            
        }

        setTimeout(function() {
            $('#alert').fadeOut().addClass('hidden');
        }, 5000);
    });
}


import angular from 'angular';

require('bootstrap');
require('jquery-slimscroll');

import 'summernote';
import 'angucomplete-alt';
import 'angular-ui-bootstrap';
import 'bootstrap-select';
import 'vendors/detect.js';
import 'vendors/jquery.blockUI.js';
import 'vendors/jquery.slimscroll.js';
import 'vendors/jquery.scrollTo.min.js';
require('switchery');
import 'vendors/plugins/waypoints/jquery.waypoints.min.js';
import 'vendors/plugins/counterup/jquery.counterup.min.js';
import 'angular-dragdrop';
import 'angularjs-dropdown-multiselect';
import 'angularjs-slider';


let dt = require('datatables.net')( window, $ );
require('datatables.net-buttons')( window, $ );
require( 'pdfmake' );
require( 'jszip' )( window, $ );
require( 'datatables.net-buttons/js/buttons.colVis.js' )( window, $ );
require( 'datatables.net-buttons/js/buttons.flash.js' )( window, $ );
require( 'datatables.net-buttons/js/buttons.html5.js' )( window, $ );
require( 'datatables.net-buttons/js/buttons.print.js' )( window, $ );
  (function ($, DataTable) {
    // Datatable global configuration
    $.extend(true, DataTable.defaults, {
        pageLength: 50,
        'dom': '<"top"f>rt<"bottom"lip>',
        lengthMenu: [ 10, 25, 50, 75, 100, 200, 1000 ],
        language: {
            'sProcessing':     'Traitement en cours...',
            'sSearch':         'Rechercher&nbsp;:',
            'sLengthMenu':     'Afficher _MENU_ &eacute;l&eacute;ments',
            'sInfo':           'Affichage de l\'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments',
            'sInfoEmpty':      'Affichage de l\'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment',
            'sInfoFiltered':   '(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)',
            'sInfoPostFix':    '',
            'sLoadingRecords': 'Chargement en cours...',
            'sZeroRecords':    'Aucun &eacute;l&eacute;ment &agrave; afficher',
            'sEmptyTable':     'Aucune donn&eacute;e disponible dans le tableau',
            'oPaginate': {
                'sFirst':      'Premier',
                'sPrevious':   'Pr&eacute;c&eacute;dent',
                'sNext':       'Suivant',
                'sLast':       'Dernier'
            },
            'oAria': {
                'sSortAscending':  ': activer pour trier la colonne par ordre croissant',
                'sSortDescending': ': activer pour trier la colonne par ordre d&eacute;croissant'
            }
        }
    });

})(jQuery, jQuery.fn.dataTable);


import 'vendors/plugins/select2/js/select2.min.js';
import 'vendors/plugins/multiselect/js/jquery.multi-select.js';


import 'vendors/plugins/morris/morris.min.js';
require('raphael');

// import 'vendors/pages/jquery.dashboard.js';

import 'vendors/jquery.core.js';
import 'vendors/jquery.app.js';

import 'ngstorage';
import 'angular-sanitize';
import 'moment/locale/fr.js';
import 'angular-moment';
import 'angular-cookies';
import 'angular-ui-sortable';

import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';
import 'bootstrap-tagsinput';
import 'ui-select';
import './scripts.js';

window.alert = alert = window.sweetAlert;

import constants from './constants';
import onConfig from './on_config';
import onRun from './on_run';
import 'angular-ui-router';
import './templates';
import './filters';
import './controllers';
import './services';
import './directives';

const requires = [
    'ui.router',
    'ui.sortable',
    'ngSanitize',
    'ngCookies',
    'rzModule',
    'ngStorage',
    'ngDragDrop',
    'ui.select',
    'angularjs-dropdown-multiselect',
    'angularMoment',
    'ui.bootstrap',
    'angucomplete-alt',
    'templates',
    'app.filters',
    'app.controllers',
    'app.services',
    'app.directives',
    'pascalprecht.translate'
];

window.app = angular.module('app', requires);

angular.module('app').constant('AppSettings', constants);

angular.module('app').config(onConfig)
;

angular.module('app').run(onRun);

angular.bootstrap(document, ['app'], {
    strictDi: true
});
