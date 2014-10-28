name := "JMaat"

version := "1.0-SNAPSHOT"

resolvers += "Sonatype Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots/"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  "org.scalacheck" %% "scalacheck" % "1.10.1",
  "org.reactivemongo" % "play2-reactivemongo_2.10" % "0.10.5.0.akka22"
)     

play.Project.playScalaSettings
