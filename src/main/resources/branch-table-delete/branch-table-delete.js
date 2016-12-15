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
        'lodash',
        'bitbucket/internal/util/dom-event',
        'michielroos/bitbucket/chainsaw/branch-deletion',
        'exports'],
    function($,
             _,
             domEventUtil,
             branchDeletion,
             exports) {

        var branchListTable = '#branch-list';

        exports.onReady = function() {
            var $container = $('.aui-toolbar2-secondary.commit-badge-container');
            $container.append(' <div class="aui-buttons">' +
                '    <button class="aui-button aui-button-split-main" id="delete-checked-branches"><span class="aui-icon aui-icon-small aui-iconfont-delete">Delete </span> Delete checked branches</button>' +
                '    <button class="aui-button aui-dropdown2-trigger aui-button-split-more" aria-haspopup="true" aria-owns="split-container-delete-checked-branches">Options</button></div>' +
                '    <div id="split-container-delete-checked-branches" class="aui-dropdown2 aui-style-default aui-layer aui-alignment-element aui-alignment-side-bottom aui-alignment-snap-right aui-alignment-out-of-bounds aui-alignment-out-of-bounds-bottom aui-alignment-out-of-bounds-left aui-alignment-element-attached-top aui-alignment-element-attached-right aui-alignment-target-attached-bottom aui-alignment-target-attached-right" role="menu" aria-hidden="true" resolved="" data-aui-alignment-container="#delete-checked-branches" data-aui-alignment="bottom auto" data-aui-alignment-static="true">' +
                '	<ul class="aui-list-truncate" id="delete-checked-branches-options">' +
                '		<li><a class="check-all" href="#" tabindex="-1">Check all</a></li>' +
                '		<li><a class="toggle" href="#" tabindex="-1">Toggle selection</a></li>' +
                // '		<li><a class="check-all-merged" href="#" tabindex="-1">Select only merged branches</a></li>' +
                // '		<li><a class="check-all-merged-6m" href="#" tabindex="-1">Select only merged branches over 6 months old</a></li>' +
                // '		<li><a class="check-all-merged-12m" href="#" tabindex="-1">Select only merged branches over 1 year old</a></li>' +
                '	</ul>' +
                '</div></div>' +
                '');

            $('#delete-checked-branches-options .toggle')
                .on('click', function(e) {
                    var checkBoxes = $(branchListTable).find('input[type=checkbox]');
                    _.forEach(checkBoxes, function(checkbox) {
                        $(checkbox).prop('checked', !$(checkbox).prop('checked'));
                    });
                });

            $('#delete-checked-branches-options .check-all')
                .on('click', function(e) {
                    var checkBoxes = $(branchListTable).find('input[type=checkbox]');
                    checkBoxes.prop('checked', 'checked');
                    e.preventDefault();
                });
        };
    });

jQuery(document).ready(function() {
    require('michielroos/bitbucket/chainsaw/branch-table-delete').onReady();
});
