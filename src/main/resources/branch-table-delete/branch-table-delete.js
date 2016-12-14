'use strict';

define('michielroos/bitbucket/chainsaw/branch-table-delete',
    [
        'jquery',
        'bitbucket/internal/util/dom-event',
        'exports'],
    function($,
             domEventUtil,
             exports) {

        'use strict';

        exports.onReady = function() {
            var $container = $('.aui-toolbar2-secondary.commit-badge-container');
            $container.prepend('<button class="aui-button"><span class="aui-icon aui-icon-small aui-iconfont-delete">Delete </span> Delete checked branches</button> ');


            $('#delete-column').on('click', function(e) {
                console.warn('del cell clicked');
                e.preventDefault();
                // var branchId = $(this).closest('[data-branch-id]').attr('data-branch-id');
            });

            // $('.pull-request-list-trigger').tooltip({
            //     gravity: 'n',
            //     live: true
            // });
        };
    });

jQuery(document).ready(function() {
    require('michielroos/bitbucket/chainsaw/branch-table-delete').onReady();
});
