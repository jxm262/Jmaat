package controllers

import play.api._
import play.api.mvc._
import play.api.mvc.{Action, Controller}
import play.api.http.MimeTypes

object Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }
  
  def code(name: String) = Action {
	  Ok(views.html.java())
  }

}