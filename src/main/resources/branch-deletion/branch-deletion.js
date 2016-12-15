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
    'aui',
    'jquery',
    'bitbucket/util/navbuilder',
    'bitbucket/internal/model/page-state',
    'bitbucket/internal/util/ajax',
    'bitbucket/internal/util/events',
    'bitbucket/internal/widget/confirm-dialog',
    'exports'
], function(AJS,
            $,
            nav,
            pageState,
            ajax,
            events,
            ConfirmDialog,
            exports) {

    var branchListTable = '#branch-list';
    var linkSelector = '#delete-checked-branches';

    /**
     * Get Branch data
     *
     */
    function getBranchData() {
        var branches = [];
        $(branchListTable).find('input[type=checkbox]:checked').each(
            function() {
                let branch = {};
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
            .project(pageState.getProject().getKey())
            .repo(pageState.getRepository().getSlug())
            .addPathComponents('branches').build();
    }

    function deleteBranchByRest(branchName, latestCommit) {
        return ajax.rest({
            url: getBranchRestUrl(),
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
            errors.forEach(function(error) {
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
        var dialog = new ConfirmDialog({
            id: 'delete-branch-dialog',
            titleText: AJS.I18n.getText('bitbucket.feature.branch-deletion.dialog.title'),
            titleClass: 'warning-header',
            panelContent: com.michielroos.bitbucket.chainsaw.branchDeletion.dialog(),
            submitText: AJS.I18n.getText('bitbucket.web.button.delete'),
            submitToHref: false
        });

        dialog.addConfirmListener(function(promise, $trigger, removeDialog, dialog, $spinner) {
            var branches = getBranchData();
            $spinner.show();
            branches.forEach(function(branch) {
                deleteBranchByRest(branch.displayId, branch.latestCommit).done(function() {
                    events.trigger('bitbucket.internal.page.branches.revisionRefRemoved', null, {
                        id: branch.id,
                        displayId: branch.displayId,
                        latestCommit: branch.latestCommit
                    });
                }).fail(function(xhr, textStatus, errorThrown, data) {
                    addErrorNotifications(data && data.errors);
                }).always(removeDialog);
            });
            removeDialog();
        });

        dialog.attachTo(linkSelector, function(trigger, dialog) {
            var branches = getBranchData(),
                branchNames = [];
            branches.forEach(function(branch) {
                branchNames.push(branch.displayId);
            });
            dialog.getCurrentPanel().body.find('.branch-name').text(branchNames.join(', '));
        }, document);
    }

    exports.onReady = function() {
        createConfirmationDialog();
    };
});

jQuery(document).ready(function() {
    require('michielroos/bitbucket/chainsaw/branch-deletion').onReady();
});
