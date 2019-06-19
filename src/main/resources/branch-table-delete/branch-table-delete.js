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

define('michielroos/bitbucket/chainsaw/branch-table-delete', [
        '@atlassian/aui',
        'jquery',
        'lodash'
    ],
function(AJS,
         $,
         _) {

        var branchListTable = '#branch-list';

        var $container = $('.aui-toolbar2-secondary.commit-badge-container');
        $container.append(' <div class="aui-buttons">' +
            '   <button class="aui-button aui-button-split-main" id="delete-checked-branches"><span class="aui-icon aui-icon-small aui-iconfont-delete">Delete </span> Delete checked branches</button>' +
            '   <button class="aui-button aui-dropdown2-trigger aui-button-split-more" aria-haspopup="true" aria-owns="split-container-delete-checked-branches">Options</button></div>' +
            '   <div id="split-container-delete-checked-branches"' +
            '       class="aui-dropdown2 aui-style-default aui-layer aui-alignment-element aui-alignment-side-bottom aui-alignment-snap-right aui-alignment-out-of-bounds' +
            '           aui-alignment-out-of-bounds-bottom aui-alignment-out-of-bounds-left aui-alignment-element-attached-top aui-alignment-element-attached-right' +
            '           aui-alignment-target-attached-bottom aui-alignment-target-attached-right"' +
            '       role="menu" aria-hidden="true" resolved="" data-aui-alignment-container="#delete-checked-branches" data-aui-alignment="bottom auto" data-aui-alignment-static="true">' +
            '	<div class="aui-dropdown2-section" id="delete-checked-branches-options">' +
            '	    <div class="aui-dropdown2-heading">' +
            '   	    <strong>Select</strong>' +
            '   	</div>' +
            '   	<ul class="aui-list-truncate">' +
            '	    	<li><a class="check-all" href="#" tabindex="-1">All</a></li>' +
            '		    <li><a class="toggle" href="#" tabindex="-1">Toggle selection</a></li>' +
            '   		<li><a class="check-all-merged" href="#" tabindex="-1">Merged branches</a></li>' +
            '	    	<li><a class="check-all-merged-6m" href="#" tabindex="-1">Merged branches older than 6 months</a></li>' +
            '	    	<li><a class="check-all-merged-12m" href="#" tabindex="-1">Merged branches older than 1 year</a></li>' +
            '	    </ul>' +
            '   </div></div></div>' +
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

        $('#delete-checked-branches-options .check-all-merged')
            .on('click', function(e) {
                var checkBoxes = $(branchListTable).find('td .merged').closest('tr').find('input[type=checkbox]');
                $(branchListTable).find('input[type=checkbox]').prop('checked', false);
                checkBoxes.prop('checked', 'checked');
                e.preventDefault();
            });

        $('#delete-checked-branches-options .check-all-merged-6m')
            .on('click', function(e) {
                var checkBoxes = $(branchListTable).find('td .merged').closest('tr').find('input[type=checkbox]'),
                    lastModification,
                    now = new Date() / 1000 | 0;
                $(branchListTable).find('input[type=checkbox]').prop('checked', false);
                _.forEach(checkBoxes, function(checkbox) {
                    lastModification = new Date($(checkbox).closest('tr').find('td.last-updated-column time').prop('datetime')) / 1000 | 0;
                    if (((now - lastModification) / 3600 / 24) > 182) {
                        $(checkbox).prop('checked', 'checked');
                    }
                });
                e.preventDefault();
            });

        $('#delete-checked-branches-options .check-all-merged-12m')
            .on('click', function(e) {
                var checkBoxes = $(branchListTable).find('td .merged').closest('tr').find('input[type=checkbox]'),
                    lastModification,
                    now = new Date() / 1000 | 0;
                $(branchListTable).find('input[type=checkbox]').prop('checked', false);
                _.forEach(checkBoxes, function(checkbox) {
                    lastModification = new Date($(checkbox).closest('tr').find('td.last-updated-column time').prop('datetime')) / 1000 | 0;
                    if (((now - lastModification) / 3600 / 24) >= 365) {
                        $(checkbox).prop('checked', 'checked');
                    }
                });
                e.preventDefault();
            });

        $.fn.shiftClick = function () {
            var lastSelected;
            var checkBoxes = $(this);
            this.each(function () {
                $(this).click(function (ev) {
                    if (ev.shiftKey) {
                        if (!lastSelected) {
                          return false;
                        }
                        var last = checkBoxes.index(lastSelected);
                        var first = checkBoxes.index(this);
                        var start = Math.min(first, last);
                        var end = Math.max(first, last);
                        var check = lastSelected.checked;
                        for (var i = start; i <= end; i++) {
                          checkBoxes[i].checked = check;
                        }
                    } else {
                        lastSelected = this;
                    }
                })
            });
        };

        // due to the lazy loading of branches, register this after each branch rest call
        $(document).ajaxComplete(function(event, xhr, settings) {
            if (settings.url.indexOf("branches") !== -1) {
                $('input.branch-list-delete').shiftClick();
            }
        });


    });

AJS.$(document).ready(function() {
    require('michielroos/bitbucket/chainsaw/branch-table-delete');
});
