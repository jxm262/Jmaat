package controllers

import play.api._
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.functional.syntax._
import play.api.libs.json._
import scala.concurrent.Future
import reactivemongo.api._
import play.modules.reactivemongo.MongoController
import play.modules.reactivemongo.json.collection.JSONCollection
import models.Posting
import reactivemongo.bson.BSONDocument

object AdminController extends Controller with MongoController {

  implicit val postingReads = Json.reads[Posting]

  def collection: JSONCollection = db.collection[JSONCollection]("persons")

  //  def code(postingId: String) = Action.async { implicit request =>
  //    collection.find(Json.obj("postingId" -> postingId)).cursor[Posting]
  //      .collect[List]().map {
  //        posting => Ok(views.html.admin(postings))
  //      }.recover {
  //        case e =>
  //          e.printStackTrace()
  //          BadRequest(e.getMessage())
  //      }
  //  }

  def index(postingId: String) = Action {
    Ok(views.html.index())
  }
  
  //TODO: refactor this somehow?  Or is this clean?
  def admin = Action.async { implicit request =>
    collection.find(Json.obj()).cursor[Posting]
      .collect[List]().map {
        postings => Ok(views.html.admin())
      }.recover {
        case e =>
          e.printStackTrace()
          BadRequest(e.getMessage())
      }
  }  

  def delete = Action.async(parse.json) { implicit request =>
    Json.fromJson[Posting](request.body).fold(
      invalid => Future.successful(BadRequest("Bad message form")),
      valid => collection.remove(Json.obj("postingId" -> valid.postingId)).map(lastError => Ok(Json.obj("success" -> true)))
    )
  }

  def save = Action.async(parse.json) { implicit request =>
    Json.fromJson[Posting](request.body).fold(
      invalid => Future.successful(BadRequest("Bad message form")),
      valid => collection.update(Json.obj("postingId" -> valid.postingId), request.body, upsert = true).map(lastError => Ok(Json.obj("success" -> true)))
    )
  }
  
  def findAllPostings = Action.async {
    val cursor: Cursor[JsObject] = collection.find(Json.obj()).cursor[JsObject]
    val futurePersonsList: Future[List[JsObject]] = cursor.collect[List]()
    val futurePostingsJsonArray: Future[JsArray] = futurePersonsList.map(postings => Json.arr(postings))

    futurePostingsJsonArray.map(postings => Ok(postings))
  }

  def findPostingById(postingId: String) = Action.async {
    val cursor: Cursor[JsObject] = collection.find(Json.obj("postingId" -> postingId)).cursor[JsObject]
    val futurePersonsList: Future[List[JsObject]] = cursor.collect[List]()
    val futurePersonsJsonArray: Future[JsArray] = futurePersonsList.map(postings => Json.arr(postings))
    
    futurePersonsJsonArray.map(postings => Ok(postings))
  }
  
  /**
   * To map other fields manually, use an explicit read like below, but can use case class instead of tuple
   */
  //  val posting: Reads[(String, String, String)] = {
  //    (JsPath \ "postingId").read[String] and
  //    (JsPath \ "title").read[String] and
  //    (JsPath \ "text").read[String]
  //  }.tupled

}