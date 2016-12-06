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

import com.atlassian.bitbucket.permission.PermissionService;
import com.atlassian.bitbucket.repository.Repository;
import com.atlassian.bitbucket.repository.RepositoryService;
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
import java.io.IOException;
import java.util.Map;

import static com.google.common.base.Preconditions.checkNotNull;

@Scanned
public class ChainsawServlet extends HttpServlet {
    private static final Logger log = LoggerFactory.getLogger(ChainsawServlet.class);

    @ComponentImport
    private final RepositoryService repositoryService;
    @ComponentImport
    private final PermissionService permissionService;

    @Inject
    public ChainsawServlet(RepositoryService repositoryService, PermissionService permissionService) {
        this.repositoryService = checkNotNull(repositoryService);
        this.permissionService = checkNotNull(permissionService);
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

        if (repository == null) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        Map<String, Object> parameters = new HashedMap();
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