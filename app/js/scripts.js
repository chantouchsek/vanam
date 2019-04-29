window.$ = window.jQuery = require('jquery');

//   (function ($, DataTable) {
//     // Datatable global configuration
//     $.extend(true, DataTable.defaults, {
//         pageLength: 50,
//         'dom': '<"top"f>rt<"bottom"lip>',
//         lengthMenu: [ 10, 25, 50, 75, 100, 200, 1000 ],
//         language: {
//             'sProcessing':     'Traitement en cours...',
//             'sSearch':         'Rechercher&nbsp;:',
//             'sLengthMenu':     'Afficher _MENU_ &eacute;l&eacute;ments',
//             'sInfo':           'Affichage de l\'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments',
//             'sInfoEmpty':      'Affichage de l\'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment',
//             'sInfoFiltered':   '(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)',
//             'sInfoPostFix':    '',
//             'sLoadingRecords': 'Chargement en cours...',
//             'sZeroRecords':    'Aucun &eacute;l&eacute;ment &agrave; afficher',
//             'sEmptyTable':     'Aucune donn&eacute;e disponible dans le tableau',
//             'oPaginate': {
//                 'sFirst':      'Premier',
//                 'sPrevious':   'Pr&eacute;c&eacute;dent',
//                 'sNext':       'Suivant',
//                 'sLast':       'Dernier'
//             },
//             'oAria': {
//                 'sSortAscending':  ': activer pour trier la colonne par ordre croissant',
//                 'sSortDescending': ': activer pour trier la colonne par ordre d&eacute;croissant'
//             }
//         }
//     });

// })(jQuery, jQuery.fn.dataTable);


$(function() {

    'use strict';

    var ua = navigator.userAgent,
        event = (ua.match(/iP/i)) ? 'touchstart' : 'click';

    $(document).off(event, '.disabled');
    $(document).on(event, '.disabled', function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    });

    // Disable demonstrative links!
    $('a[href="#"]').on('click', function(e) {
        e.preventDefault();
    });

   
       
});

 