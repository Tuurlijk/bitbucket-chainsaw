package com.michielroos.bitbucket.servlet;

/**
 * Copyright notice
 *
 * ⓒ 2016 Michiel Roos <michiel@maxserv.nl>
 * All rights reserved
 *
 * This script is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * This copyright notice MUST APPEAR in all copies of the script!
 */

import com.atlassian.bitbucket.auth.AuthenticationContext;
import com.atlassian.bitbucket.nav.NavBuilder;
import com.atlassian.bitbucket.permission.Permission;
import com.atlassian.bitbucket.permission.PermissionService;
import com.atlassian.bitbucket.repository.*;
import com.atlassian.bitbucket.user.ApplicationUser;
import com.atlassian.bitbucket.util.PageRequest;
import com.atlassian.bitbucket.util.PageRequestImpl;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import org.apache.commons.collections.map.HashedMap;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Scanned
public class ChainsawServlet extends HttpServlet {
    private static final Logger log = LoggerFactory.getLogger(ChainsawServlet.class);

    private static final int PAGE_SIZE = 1000;
    @ComponentImport
    private final AuthenticationContext authenticationContext;
    @ComponentImport
    private final NavBuilder navBuilder;
    @ComponentImport
    private final RefService refService;
    @ComponentImport
    private final RepositoryService repositoryService;
    @ComponentImport
    private final PermissionService permissionService;


    @Inject
    public ChainsawServlet(
            @NotNull AuthenticationContext authenticationContext,
            @NotNull NavBuilder navBuilder,
            @NotNull RefService refService,
            @NotNull RepositoryService repositoryService,
            @NotNull PermissionService permissionService
    ) {
        this.authenticationContext = authenticationContext;
        this.navBuilder = navBuilder;
        this.refService = refService;
        this.repositoryService = repositoryService;
        this.permissionService = permissionService;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

//        https://developer.atlassian.com/bitbucket/server/docs/latest/tutorials-and-examples/controlling-when-pull-requests-can-be-merged.html
//    if (!permissionService.hasRepositoryPermission(request.getPullRequest().getToRef().getRepository(), Permission.REPO_ADMIN)) {
//        //TODO: implement me
//    }
        // Get repoSlug from path
        String pathInfo = req.getPathInfo();

        String[] components = pathInfo.split("/");

        if (components.length < 3) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        Repository repository = repositoryService.getBySlug(components[1], components[2]);

        boolean canRead = true;

        if (!permissionService.isPubliclyAccessible(repository)) {
            ApplicationUser currentUser = authenticationContext.getCurrentUser();
            canRead = permissionService.hasRepositoryPermission(currentUser, repository, Permission.REPO_READ);
        }

        if (!canRead) {
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        if (repository == null) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        Branch defaultBranch = refService.getDefaultBranch(repository);

        RepositoryBranchesRequest request = new RepositoryBranchesRequest
                .Builder(repository)
                .order(RefOrder.ALPHABETICAL)
                .build();

        PageRequest pageRequest = new PageRequestImpl(0, PAGE_SIZE);

        Map<String, Branch> branchMap = new HashMap<String, Branch>();

        while (true) {
            com.atlassian.bitbucket.util.Page<? extends Branch> branchPage = refService.getBranches(request, pageRequest);

            for (Branch b : branchPage.getValues()) {
                if (branchMap.containsKey(b)) {
//                    log.error("Trying to insert existing key '" + b.getId() + "' into branchMap with value '" + b + "'");
                    continue;
                }
//                log.error("Inserting key '" + b.getId() + "' into branchMap with value '" + b + "'");
                branchMap.put(b.getId(), b);
            }
            if (branchPage.getIsLastPage()) {
                break;
            }
            pageRequest = branchPage.getNextPageRequest();
        }

        int count = branchMap.size();

        Map<String, Object> parameters = new HashedMap();
        parameters.put("navBuilder", navBuilder);
        parameters.put("defaultBranch", defaultBranch);
        parameters.put("branches", branchMap);
        parameters.put("count", count);
        parameters.put("repository", repository);
//        log.warn("form parametrs : " + parameters);
        VelocityContext context = new VelocityContext(parameters);
        VelocityEngine engine = new VelocityEngine();
        engine.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
        engine.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
        engine.setProperty("runtime.log.logsystem.class", "org.apache.velocity.runtime.log.NullLogSystem");
        try {
            engine.init();
            Template template = engine.getTemplate("templates/chainsaw.vm", "UTF-8");
            resp.setContentType("text/html;charset=utf-8");
            template.merge(context, resp.getWriter());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}