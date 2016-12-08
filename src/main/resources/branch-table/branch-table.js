define('michielroos/bitbucket/chainsaw/branch-table',
    [
        'aui',
        'jquery',
        'lodash',
        'bitbucket/util/navbuilder',
        'bitbucket/internal/model/page-state',
        'bitbucket/internal/util/events',
        'bitbucket/internal/widget/paged-table'
    ],
    function(AJS,
             $,
             _,
             nav,
             pageState,
             events,
             PagedTable) {

        'use strict';

        function validateRef(ref) {
            if (!ref) {
                throw new Error('Undefined ref');
            } else if (!ref.id) {
                throw new Error('Ref without id');
            }
            return ref;
        }

        function BranchTable(options, baseRef) {
            PagedTable.call(this, $.extend({}, BranchTable.defaults, options));
            this._baseRef = validateRef(baseRef);
        }

        BranchTable.defaults = {
            filterable: true,
            pageSize: 20, // this must be less than ref.metadata.max.request.count
            noneFoundMessageHtml: AJS.escapeHtml(AJS.I18n.getText('bitbucket.web.repository.branch.table.no.branches')),
            noneMatchingMessageHtml: AJS.escapeHtml(AJS.I18n.getText('bitbucket.web.repository.branch.table.no.matches')),
            idForEntity: function idForEntity(ref) {
                return ref.id;
            },
            paginationContext: 'branch-table'
        };

        $.extend(BranchTable.prototype, PagedTable.prototype);

        BranchTable.prototype.buildUrl = function(start, limit, filter) {
            // Ideally the context would be populated from a plugin (in this case the branch plugin)
            // but we do not expose a JS API for it yet
            var context = JSON.stringify({withMessages: false});
            var params = {
                base: this._baseRef.id,
                details: true,
                start: start,
                limit: limit,
                orderBy: 'MODIFICATION', // Always order by last modified regardless of filtering
                context: context
            };

            if (filter) {
                params.filterText = filter;
            }

            return nav.rest().currentRepo().branches().withParams(params).build();
        };

        BranchTable.prototype.handleNewRows = function(branchPage, attachmentMethod) {
            this.$table.find('tbody')[attachmentMethod](bitbucket.internal.feature.repository.branchRows({
                branches: branchPage.values,
                baseRef: this._baseRef,
                repository: pageState.getRepository().toJSON()
            }));
        };

        BranchTable.prototype.isCurrentBase = function(ref) {
            return this._baseRef.id === validateRef(ref).id;
        };

        BranchTable.prototype.update = function(baseRef, options) {
            if (baseRef) {
                this._baseRef = validateRef(baseRef);
            }
            PagedTable.prototype.update.call(this, options);
        };

        BranchTable.prototype.remove = function(ref) {
            if (PagedTable.prototype.remove.call(this, ref)) {
                var $row = this.$table.find('tbody > tr[data-id="' + ref.id + '"]');
                $row.fadeOut(_.bind(function() {
                    if ($row.hasClass('focused')) {
                        var $nextRow = $row.next();
                        var $nextFocus = $nextRow.length ? $nextRow : $row.prev();
                        if ($nextFocus.length) {
                            $nextFocus.addClass('focused');
                            $nextFocus.find('td[headers=branch-name-column] > a').focus();
                        }
                    }
                    $row.remove();

                    // Ensure we display the no data message when
                    // the last row is deleted
                    if (this.loadedRange.reachedStart() && this.loadedRange.reachedEnd() && !this.$table.find('tbody > tr').length) {
                        this.handleNoData();
                    }

                    this.updateTimestamp();
                }, this));
                return true;
            }
            return false;
        };

        BranchTable.prototype.initShortcuts = function() {
            PagedTable.prototype.initShortcuts.call(this);

            var tableSelector = this.$table.selector;
            var options = this.options.focusOptions;
            var rowSelector = tableSelector + ' ' + options.rowSelector;

            var focusedRowSelector = rowSelector + '.' + options.focusedClass;

            events.on('bitbucket.internal.keyboard.shortcuts.requestMoveToNextHandler', function(keys) {
                (this.moveToNextItem ? this : AJS.whenIType(keys)).moveToNextItem(rowSelector, options).execute(function() {
                    if ($(rowSelector).last().hasClass(options.focusedClass)) {
                        window.scrollTo(0, document.documentElement.scrollHeight);
                    }
                });
            });

            events.on('bitbucket.internal.keyboard.shortcuts.requestMoveToPreviousHandler', function(keys) {
                (this.moveToPrevItem ? this : AJS.whenIType(keys)).moveToPrevItem(rowSelector, options);
            });

            events.on('bitbucket.internal.keyboard.shortcuts.requestOpenItemHandler', function(keys) {
                (this.execute ? this : AJS.whenIType(keys)).execute(function() {
                    var $focusedItem = $(focusedRowSelector);
                    if ($focusedItem.length) {
                        location.href = $focusedItem.find('td[headers=branch-name-column] a').attr('href');
                    }
                });
            });

            events.on('bitbucket.internal.keyboard.shortcuts.requestOpenItemActionHandler', function(keys) {
                (this.execute ? this : AJS.whenIType(keys)).execute(function() {
                    var $focusedItem = $(focusedRowSelector);
                    if ($focusedItem.length) {
                        $focusedItem.find('.branch-list-action-trigger').click();
                    }
                });
            });
        };

        return BranchTable;
    }
);
