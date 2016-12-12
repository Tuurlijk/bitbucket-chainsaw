package com.michielroos.bitbucket.repository;

/**
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

import com.atlassian.bitbucket.commit.Commit;
import com.atlassian.bitbucket.repository.Branch;
import com.atlassian.bitbucket.repository.SimpleRef;
import com.atlassian.bitbucket.repository.StandardRefType;

import javax.annotation.Nonnull;

public class ElaborateBranch extends SimpleRef implements Branch {
    private final Commit lastCommit;
    private final boolean isDefault;

    protected ElaborateBranch(ElaborateBranch.AbstractBranchBuilder<?, ?> builder) {
        super(builder, StandardRefType.BRANCH);
        this.lastCommit = builder.lastCommit;
        this.isDefault = builder.isDefault;
    }

    public Commit getLastCommit() {
        return this.lastCommit;
    }

    public boolean getIsDefault() {
        return this.isDefault;
    }

    @Nonnull
    protected String fieldsToString() {
        return super.fieldsToString() + ", default=" + this.getIsDefault();
    }

    public static class Builder extends ElaborateBranch.AbstractBranchBuilder<ElaborateBranch.Builder, Branch> {
        public Builder() {
        }

        public Builder(Branch ref) {
            super(ref);
        }

        @Nonnull
        public ElaborateBranch build() {
            return new ElaborateBranch(this);
        }

        @Nonnull
        protected ElaborateBranch.Builder self() {
            return this;
        }
    }

    protected abstract static class AbstractBranchBuilder<B extends ElaborateBranch.AbstractBranchBuilder<B, R>, R extends Branch> extends AbstractRefBuilder<B, R> {
        private Commit lastCommit;
        private boolean isDefault;

        public AbstractBranchBuilder() {
        }

        public AbstractBranchBuilder(R ref) {
            super(ref);
            this.isDefault = ref.getIsDefault();
//            this.lastCommit = ref.getLatestCommit();
        }

        public AbstractBranchBuilder setLastCommit(Commit lastCommit) {
            this.lastCommit = lastCommit;
            return (ElaborateBranch.AbstractBranchBuilder) this.self();
        }

        public AbstractBranchBuilder isDefault(boolean value) {
            this.isDefault = value;
            return (ElaborateBranch.AbstractBranchBuilder) this.self();
        }
    }
}
