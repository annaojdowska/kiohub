/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.servlet;

import java.io.IOException;
import java.util.LinkedList;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jasig.cas.client.authentication.AttributePrincipal;
import pg.eti.kiohub.controller.LoginController;

///**
// *
// * @author Tomasz
// */
//

@WebServlet(name = "Login", urlPatterns = {"/login"})
public class LoginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        Map<String, Object> attributes = ((AttributePrincipal)request.getUserPrincipal()).getAttributes();
        String firstName = attributes.get("firstName").toString();
        String lastName = attributes.get("lastName").toString();
        String personNumber = attributes.get("personNumber").toString();
        String mail = ((LinkedList)attributes.get("mail")).get(0).toString();
        
        LoginController loginController = new LoginController();
        
        
        throw new NullPointerException("Koniec " + firstName + " " + lastName + " " + personNumber + " " + mail);
    }


}
