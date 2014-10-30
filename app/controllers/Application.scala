package controllers

import play.api._
import play.api.mvc._
import play.api.mvc.{ Action, Controller }
import play.api.http.MimeTypes
import models.Posting
import models.Posting
import models.Posting

object Application extends Controller {

  def index = Action {
    Redirect("/posting/Home")
  }

  def code(postingId: String) = Action {
    Ok(views.html.code())
  }

}