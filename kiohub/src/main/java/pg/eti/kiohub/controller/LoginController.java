/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.controller;

import java.io.IOException;
import java.util.Collection;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jasig.cas.client.authentication.AttributePrincipal;
import org.jasig.cas.client.util.HttpServletRequestWrapperFilter;

///**
// *
// * @author Tomasz
// */
//

@WebServlet(name = "Login", urlPatterns = {"/login"})
public class LoginController extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String user = ((AttributePrincipal)request.getUserPrincipal()).getAttributes().toString();
        
        throw new NullPointerException(user);
    }


}
