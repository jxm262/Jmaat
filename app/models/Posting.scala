package models

import play.api.mvc._
import play.api.libs.json.Json
import play.api.libs.concurrent.Execution.Implicits._
import models._
import reactivemongo.bson.BSONObjectID
import scala.concurrent.Future

case class Posting(postingId: String, title: String, text: String)

//  case class MessageForm(message: String) {
//    def toMessage: Message = Message(BSONObjectID.generate, message)
//  }