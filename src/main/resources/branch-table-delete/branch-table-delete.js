/*
 * Copyright notice
 *
 * ⓒ 2016 Michiel Roos <michiel@michielroos.com>
 * All rights reserved
 *
 * This script is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * This copyright notice MUST APPEAR in all copies of the script!
 */

/*jshint esversion: 6, bitwise:true, curly:true, eqeqeq:true, forin:true, globalstrict: true,
 latedef:true, noarg:true, noempty:true, nonew:true, undef:true, maxlen:256,
 strict:true, trailing:true, boss:true, browser:true, devel:true, jquery:true */
/*global bitbucket, define, require, com, require */
'use strict';

define('michielroos/bitbucket/chainsaw/branch-table-delete',
    [
        'jquery',
        'bitbucket/internal/util/dom-event',
        'michielroos/bitbucket/chainsaw/branch-deletion',
        'exports'],
    function($,
             domEventUtil,
             branchDeletion,
             exports) {

        var branchListTable = '#branch-list';

        exports.onReady = function() {
            var $container = $('.aui-toolbar2-secondary.commit-badge-container');
            $container.prepend('<button class="aui-button" id="delete-checked-branches"><span class="aui-icon aui-icon-small aui-iconfont-delete">Delete </span> Delete checked branches</button> ');

            $('#delete-column')
                .attr('title', 'Click to toggle checkboxes')
                .tooltip({
                    gravity: 'n',
                    live: true
                })
                .on('click', function(e) {
                    var checkBoxes = $(branchListTable).find('input[type=checkbox]');
                    checkBoxes.prop('checked', !checkBoxes.prop('checked'));
                });
        };
    });

jQuery(document).ready(function() {
    require('michielroos/bitbucket/chainsaw/branch-table-delete').onReady();
});
