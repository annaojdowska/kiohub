/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pg.eti.kiohub.servlet;

import java.io.IOException;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jasig.cas.client.authentication.AttributePrincipal;

/**
 *
 * @author Tomasz
 */
@WebServlet(name = "Login", urlPatterns = {"/login"})
public class LoginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        Map<String, Object> attributes = ((AttributePrincipal)request.getUserPrincipal()).getAttributes();
        throw new NullPointerException();
//        String firstName = attributes.get("fisrtName").toString();
//        throw new NullPointerException();
//        String lastName = attributes.get("lastName").toString();
//        String personNumber = attributes.get("personNumber").toString();
//        String mail = ((String[])attributes.get("mail"))[0];
//        Long userId = Long.parseLong(personNumber);
//        User user = new User(userId, firstName, lastName, mail);
//        LoginController loginController = new LoginController();
//        loginController.loginUser(user, request.getSession());       
//
//        throw new NullPointerException(firstName + " " + lastName + " " + personNumber + " " + mail);
    }


}
