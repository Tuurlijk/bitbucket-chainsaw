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

define('michielroos/bitbucket/chainsaw/branch-deletion', [
    '@atlassian/aui',
    'jquery',
    'lodash',
    'bitbucket/util/navbuilder',
    'bitbucket/util/state',
    'bitbucket/util/server'
], function(AJS,
            $,
            _,
            nav,
            state,
            server) {

    var branchListTable = '#branch-list';

    /**
     * Get Branch data
     *
     */
    function getBranchData() {
        var branches = [];
        $(branchListTable).find('input[type=checkbox]:checked').each(
            function() {
                var branch = {};
                branch.id = $(this).data('branch-id');
                branch.displayId = $(this).data('branch-display-id');
                branch.latestCommit = $(this).data('latest-commit');
                branches.push(branch);
            }
        );
        return branches;
    }

    function getBranchRestUrl() {
        return nav.rest('branch-utils')
            .project(state.getProject().key)
            .repo(state.getRepository().slug)
            .addPathComponents('branches').build();
    }

    function deleteBranchByRest(branchName, latestCommit) {
        var url = getBranchRestUrl();
        return server.rest({
            url: url,
            type: 'DELETE',
            data: {
                name: branchName,
                endPoint: latestCommit
            },
            statusCode: {
                '400': false,
                '403': false,
                '409': false
            }
        });
    }

    function addErrorNotifications(errors) {
        if (errors && errors.length > 0) {
            var errorBody = '';
            _.forEach(errors, function(error) {
                errorBody += bitbucket.internal.widget.errorContent(error);
            });
            require(['aui/flag'], function(flag) {
                flag({
                    type: 'error',
                    body: errorBody
                });
            });
        }
    }

    function createConfirmationDialog() {

        var title = AJS.I18n.getText('bitbucket.feature.branch-deletion.dialog.title');
        var mainText = AJS.I18n.getText('chainsaw.feature.repository.branch.table.delete.text');
        var confirmText = AJS.I18n.getText('bitbucket.web.button.delete');
        var cancelText = AJS.I18n.getText('bitbucket.web.button.cancel');

        var dialogTemplate =
            '<section id="delete-branch-dialog" class="aui-dialog2 aui-dialog2-medium aui-dialog2-warning aui-layer" role="dialog" aria-hidden="true">' +
            '    <header class="aui-dialog2-header">' +
            '        <h2 class="aui-dialog2-header-main">'+title+'</h2>' +
            '        <a class="aui-dialog2-header-close">' +
            '            <span class="aui-icon aui-icon-small aui-iconfont-close-dialog">Close</span>' +
            '        </a>' +
            '    </header>' +
            '    <div class="aui-dialog2-content"><p>'+mainText+'</p></div>' +
            '    <footer class="aui-dialog2-footer">' +
            '        <div class="aui-dialog2-footer-actions">' +
            '            <button id="delete-branch-confirm" class="aui-button aui-button-primary">'+confirmText+'</button>' +
            '            <button id="delete-branch-cancel" class="aui-button aui-button-link">'+cancelText+'</button>' +
            '        </div>' +
            '    </footer>' +
            '</section>'
            ;

        var dialog = $(dialogTemplate);
        dialog.appendTo($("body"));

        var dialogRef = AJS.dialog2(dialog);

        $("#delete-checked-branches").click(function (e) {
            e.preventDefault();
            dialogRef.show();
        });

        $(document).on("click", "#delete-branch-dialog button", function (e) {
            e.preventDefault();

            if (this.id === 'delete-branch-confirm') {
                var branches = getBranchData();

                _.forEach(branches, function (branch) {
                    deleteBranchByRest(branch.displayId, branch.latestCommit).done(function () {
                        // internal events aren't supported anymore, lets just refresh the page
                        location.reload();
                    }).fail(function (xhr, textStatus, errorThrown, data) {
                        addErrorNotifications(data && data.errors);
                    }).always(dialogRef.hide);
                });
            }
            dialogRef.hide();
        });
    }

    AJS.$(document).ready(function() {
        createConfirmationDialog();
    });
});

AJS.$(document).ready(function() {
    require('michielroos/bitbucket/chainsaw/branch-deletion');
});
