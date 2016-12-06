package com.michielroos.bitbucket.servlet;

import com.atlassian.bitbucket.permission.PermissionService;
import com.atlassian.bitbucket.repository.RepositoryService;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.atlassian.templaterenderer.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.google.common.base.Preconditions.checkNotNull;

@Component
public class ChainsawServlet extends HttpServlet {
    private static final Logger log = LoggerFactory.getLogger(ChainsawServlet.class);
    private final RepositoryService repositoryService;
    private final PermissionService permissionService;
//    private final TemplateRenderer templateRenderer;

    @Autowired
//    public ChainsawServlet(@ComponentImport RepositoryService repositoryService, @ComponentImport PermissionService permissionService, @ComponentImport TemplateRenderer templateRenderer) {
    public ChainsawServlet(@ComponentImport RepositoryService repositoryService, @ComponentImport PermissionService permissionService) {
        this.repositoryService = checkNotNull(repositoryService);
        this.permissionService = checkNotNull(permissionService);
//        this.templateRenderer = checkNotNull(templateRenderer);
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

        log.warn(components[0]);
        log.warn(components[1]);
        log.warn(components[2]);

//        Repository repository = repositoryService.getBySlug(components[1], components[2]);
//
//        if (repository == null) {
//            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
//            return;
//        }

        log.warn("aaaaaah");

//        resp.setContentType("text/html;charset=utf-8");
//        renderer.render("templates/chainsaw.vm", ImmutableMap.<String, Object>of("repository", repository), resp.getWriter());
    }
}